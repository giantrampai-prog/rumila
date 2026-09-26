// Pengendali modul Roket: renderer, loop, timeline Misi Terbang (sinkron dengan rekaman bila ada),
// kamera sinematik yang kalem, dan mode Jelajah (kamera bebas + ketuk bagian roket / pilih lapisan).

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { create } from "zustand";
import { COUNTDOWN, JELAJAH, LIFTOFF, MISI, MISI_AUDIO, dwellSeconds, type MisiAudioPart } from "@/lib/roket/misi";
import { sharedAudio, unlockAudio } from "@/lib/audio-unlock";
import { Cabin } from "./cabin";
import { Cupola } from "./cupola";
import { RocketScene, altToY, type RocketPose } from "./scene";

export type RoketMode = "jelajah" | "terbang";

interface RoketUI {
  mode: RoketMode;
  stop: number;
  /** progres persinggahan aktif (0–1) */
  progress: number;
  playing: boolean;
  finished: boolean;
  focus: string | null;
}

export const useRoket = create<RoketUI>(() => ({
  mode: "jelajah",
  stop: 0,
  progress: 0,
  playing: false,
  finished: false,
  focus: null,
}));

const at = (id: string) => MISI.findIndex((s) => s.id === id);
const SEP = at("pisah-tahap");
const ORBIT = at("tanpa-bobot"); // mesin mati, tahap kedua lepas
const ISS_NEAR = at("termosfer");
const DOCK = at("merapat");
const EVA = at("bertugas");
const WALK = at("naik-kapsul");
const SEP_AT = 0.25; // bagian persinggahan "pisah tahap" saat tahap pertama lepas
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

const partFor = (i: number) => MISI_AUDIO.find((p) => i >= p.first && i < p.first + p.cues.length) ?? null;

export class RocketEngine {
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private world: RocketScene;
  private cabin = new Cabin();
  private cupola = new Cupola();
  private frame = new THREE.Object3D();
  private env: THREE.Texture;
  private wasCabin = false;
  private raf = 0;
  private last = performance.now();
  private ro: ResizeObserver;
  /* timeline */
  private idx = 0;
  private t = 0;
  private durs: number[] = MISI.map(dwellSeconds);
  private audio: HTMLAudioElement | null = null;
  private part: MisiAudioPart | null = null;
  private seekTo: number | null = null;
  private playing = false;
  /* kamera */
  private camPos = new THREE.Vector3(14, 5, 14);
  private camLook = new THREE.Vector3(0, 3, 0);
  private snap = true;
  private fly: { from: THREE.Vector3; fromT: THREE.Vector3; to: THREE.Vector3; toT: THREE.Vector3; k: number } | null = null;
  private down: { x: number; y: number } | null = null;
  private ray = new THREE.Raycaster();

  constructor(
    private host: HTMLElement,
    private onPick: (id: string) => void,
  ) {
    const low = (navigator.hardwareConcurrency ?? 8) <= 4;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, low ? 1.5 : 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.touchAction = "none";
    this.world = new RocketScene(low);
    // Pantulan logam (kaca helm emas, panel, roket) dari lingkungan studio lembut.
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    this.world.scene.environment = this.env;
    this.world.scene.environmentIntensity = 0.35;
    this.cabin.scene.environment = this.env;
    this.cabin.scene.environmentIntensity = 0.5;
    this.cupola.scene.environment = this.env;
    this.cupola.scene.environmentIntensity = 0.5;
    const cam = this.world.camera;
    cam.position.copy(this.camPos);
    this.controls = new OrbitControls(cam, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.enablePan = false;
    this.controls.minDistance = 1.2;
    this.controls.maxDistance = 400;
    this.controls.target.copy(this.camLook);
    this.world.applyPose(this.pose(0, 0));

    const el = this.renderer.domElement;
    el.addEventListener("pointerdown", this.onDown);
    el.addEventListener("pointerup", this.onUp);
    el.addEventListener("wheel", this.onWheel, { passive: true });
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(host);
    this.resize();
    this.raf = requestAnimationFrame(this.loop);
  }

  /* ---------------- input ---------------- */

  private onDown = (e: PointerEvent) => {
    this.down = { x: e.clientX, y: e.clientY };
    this.fly = null;
    // Menyentuh layar saat terbang: jeda & bebas melihat sekeliling.
    if (useRoket.getState().mode === "terbang" && useRoket.getState().playing) this.setPlaying(false);
  };
  private onWheel = () => {
    this.fly = null;
    if (useRoket.getState().mode === "terbang" && useRoket.getState().playing) this.setPlaying(false);
  };
  private onUp = (e: PointerEvent) => {
    const d = this.down;
    this.down = null;
    if (!d || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 6) return;
    if (useRoket.getState().mode !== "jelajah") return;
    const r = this.renderer.domElement.getBoundingClientRect();
    this.ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), this.world.camera);
    for (const hit of this.ray.intersectObjects(this.world.scene.children, true)) {
      const id = hit.object.userData.pick as string | undefined;
      if (id && hit.object.visible) return this.onPick(id);
    }
  };

  private resize() {
    const w = this.host.clientWidth || 1,
      h = this.host.clientHeight || 1;
    this.renderer.setSize(w, h, false);
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";
    this.world.camera.aspect = w / h;
    this.world.camera.updateProjectionMatrix();
    this.cabin.resize(w / h);
    this.cupola.resize(w / h);
  }

  /* ---------------- mode ---------------- */

  setMode(m: RoketMode) {
    unlockAudio(); // dipanggil dari ketukan tombol
    useRoket.setState({ mode: m, focus: null, finished: false });
    if (m === "terbang") {
      this.snap = true;
      this.go(0);
      this.setPlaying(true);
    } else {
      this.setPlaying(false);
      this.idx = 0;
      this.t = 0;
      this.world.applyPose(this.pose(0, 0));
      this.controls.enabled = true;
      this.flyTo(new THREE.Vector3(14, 5, 14), new THREE.Vector3(0, 3, 0));
    }
  }

  go(i: number) {
    this.idx = Math.max(0, Math.min(MISI.length - 1, i));
    this.t = 0;
    const part = partFor(this.idx);
    if (part) this.seekTo = part.cues[this.idx - part.first];
    useRoket.setState({ stop: this.idx, progress: 0, finished: false });
  }

  setPlaying(p: boolean) {
    useRoket.setState({ playing: p });
    this.controls.enabled = !p || useRoket.getState().mode === "jelajah";
    if (!p) this.audio?.pause();
    else {
      if (useRoket.getState().finished) {
        this.go(0);
      }
      const part = partFor(this.idx);
      if (part && this.seekTo === null) this.seekTo = part.cues[this.idx - part.first] + this.t;
    }
  }

  /** Jelajah: arahkan kamera ke bagian roket atau lapisan atmosfer. */
  focus(id: string | null) {
    useRoket.setState({ focus: id });
    if (!id) return this.flyTo(new THREE.Vector3(14, 5, 14), new THREE.Vector3(0, 3, 0));
    const item = JELAJAH.find((x) => x.id === id);
    if (!item) return;
    const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
    if (item.kind === "layer") {
      const mid: Record<string, number> = { troposfer: 6, stratosfer: 30, mesosfer: 68, termosfer: 300, eksosfer: 750 };
      const y = altToY(mid[id] ?? 10);
      return this.flyTo(V(18, y, 18), V(-40, y * 0.62 - 2, -40));
    }
    const parts: Record<string, [THREE.Vector3, THREE.Vector3]> = {
      roket: [V(0, 3.3, 0), V(9, 2, 9)],
      kapsul: [V(0, 5.5, 0), V(2.2, 0.6, 2.2)],
      "tahap-2": [V(0, 4.3, 0), V(2.8, 0.5, 2.8)],
      "tahap-1": [V(0, 2, 0), V(4.5, 1, 4.5)],
      mesin: [V(0, 0.35, 0), V(1.8, 0.1, 1.8)],
      astronot: [V(3.6, 0.35, 2.2), V(1.3, 0.35, 1.7)],
      menara: [V(2.2, 4, 0), V(7, 2, 7)],
    };
    const [look, off] = parts[id] ?? parts.roket;
    this.flyTo(look.clone().add(off), look);
  }

  private flyTo(to: THREE.Vector3, toT: THREE.Vector3) {
    this.fly = { from: this.world.camera.position.clone(), fromT: this.controls.target.clone(), to, toT, k: 0 };
  }

  /* ---------------- timeline → pose ---------------- */

  /** detik sejak awal persinggahan j sampai (i, t) */
  private since(j: number, i: number, t: number) {
    if (i < j) return -1;
    let x = t;
    for (let k = j; k < i; k++) x += this.durs[k];
    return x;
  }

  private pose(i: number, t: number): RocketPose {
    const s = MISI[i];
    const dur = this.durs[i];
    const p = clamp01(t / dur);
    const k = i === LIFTOFF ? p * p : p;
    const altKm = s.alt[0] + (s.alt[1] - s.alt[0]) * k;
    const sepAltKm = MISI[SEP].alt[0] + (MISI[SEP].alt[1] - MISI[SEP].alt[0]) * SEP_AT;
    const sepSince = this.since(SEP, i, t) - SEP_AT * this.durs[SEP];
    const sepT = sepSince >= 0 ? sepSince : null;
    const s2Since = this.since(ORBIT, i, t) - 1.5;
    const sep2T = s2Since >= 0 ? s2Since : null;
    const sep2AltKm = MISI[ORBIT].alt[0] + (MISI[ORBIT].alt[1] - MISI[ORBIT].alt[0]) * clamp01(1.5 / this.durs[ORBIT]);
    const burn: 0 | 1 | 2 = i < LIFTOFF || i >= ORBIT ? 0 : sepT === null ? 1 : sepT < 1.2 ? 0 : 2;
    const steam = i < COUNTDOWN ? 0.04 : i === COUNTDOWN ? 0.1 + p * 0.3 : 0;
    let astro: RocketPose["astro"] = { state: "inside", t: 0 };
    if (i < WALK) astro = { state: "pad", t: 0 };
    else if (i === WALK) astro = { state: "walk", t: p };
    else if (i >= EVA) astro = { state: "eva", t: this.since(EVA, i, t) };
    const armOpen = i < COUNTDOWN ? 0 : i === COUNTDOWN ? smooth(0.2, 0.7, p) : 1;
    // Stasiun: tampak mendekat sepanjang "termosfer", merapat pada "merapat", lalu tetap menempel
    let issGap: number | null = null;
    if (i === ISS_NEAR) issGap = 30 - 22 * smooth(0, 1, p);
    else if (i === DOCK) issGap = 8 * (1 - smooth(0, 0.7, p));
    else if (i > DOCK) issGap = 0;
    return { altKm, sepT, sepAltKm, sep2T, sep2AltKm, issGap, burn, steam, astro, armOpen };
  }

  /** Kamera yang diinginkan untuk persinggahan (lembut; tanpa guncangan). */
  private shot(i: number, t: number, pose: RocketPose, out: { pos: THREE.Vector3; look: THREE.Vector3 }) {
    const id = MISI[i].id;
    const Y = altToY(pose.altKm);
    const p = clamp01(t / this.durs[i]);
    const flightT = this.durs.slice(0, i).reduce((a, b) => a + b, 0) + t;
    const a = 0.7 + flightT * 0.012;
    const ap = this.world.a.astro.position;
    switch (id) {
      case "landasan": {
        const ang = 0.6 + t * 0.03;
        out.pos.set(Math.cos(ang) * 20, 5, Math.sin(ang) * 20);
        out.look.set(0, 3, 0);
        return;
      }
      case "tujuan-misi": {
        // terbang pelan di atas kompleks: gedung, pantai, menara air
        const ang = 1.6 + t * 0.035;
        out.pos.set(Math.cos(ang) * 22, 6.5, Math.sin(ang) * 22);
        out.look.set(-3, 1, 2);
        return;
      }
      case "baju-antariksa": {
        // dari depan astronaut (kaca helm emas terlihat), berputar pelan
        const ang = 2.0 + t * 0.04;
        out.look.set(ap.x, ap.y + 0.45, ap.z);
        out.pos.set(ap.x + Math.cos(ang) * 1.9, ap.y + 0.75, ap.z + Math.sin(ang) * 1.9);
        return;
      }
      case "naik-kapsul":
        out.look.set(ap.x, ap.y + 0.4, ap.z);
        out.pos.set(ap.x + 3.2, ap.y + 1.3, ap.z + 3.6);
        return;
      case "hitung-mundur": {
        const d = 10 - p * 2.5;
        out.pos.set(d * 0.8, 1.2, d * 0.8);
        out.look.set(0, 3.6, 0);
        return;
      }
      case "lepas-landas":
        out.pos.set(9, Math.max(1.4, Y * 0.5 + 1.4), 9);
        out.look.set(0, Y + 3, 0);
        return;
      case "gravitasi": {
        // jauh & tinggi: Bumi melengkung di bawah roket
        out.pos.set(Math.cos(a) * 26, Y + 12, Math.sin(a) * 26);
        out.look.set(0, Y + 1, 0);
        return;
      }
      case "termosfer":
        // dari bawah-samping menatap ke atas: kapsul & stasiun yang mendekat
        out.pos.set(Math.cos(a) * 16, Y + 1, Math.sin(a) * 16);
        out.look.set(0, Y + 5 + (pose.issGap ?? 0) * 0.5, 0);
        return;
      case "merapat":
        out.pos.set(Math.cos(a) * 12, Y + 8, Math.sin(a) * 12);
        out.look.set(0, Y + 6.5, 0);
        return;
      case "bertugas":
        out.look.set(ap.x, ap.y + 0.3, ap.z);
        out.pos.set(ap.x + Math.cos(a) * 4, ap.y + 2.5, ap.z + Math.sin(a) * 4);
        return;
      case "eksosfer":
        // menatap ke atas dari dekat stasiun: satelit-satelit di eksosfer
        // dari samping stasiun: stasiun & satelit dengan garis Bumi bercahaya di bawahnya
        out.pos.set(Math.cos(a) * 24, Y + 1, Math.sin(a) * 24);
        out.look.set(0, Y + 0.5, 0);
        return;
      case "penutup": {
        const back = ease(p);
        out.look.set(0, Y + 6 - back * 50, 0);
        out.pos.set(Math.cos(a) * (12 + back * 70), Y + 10 + back * 45, Math.sin(a) * (12 + back * 70));
        return;
      }
      default: {
        // Kamera kejar: berputar pelan, makin jauh & makin di atas saat roket makin tinggi.
        const alt = pose.altKm;
        const d = 12 + smooth(10, 110, alt) * 6 + smooth(110, 800, alt) * 10;
        const h = -3 + smooth(5, 60, alt) * 3 + smooth(90, 800, alt) * 10 + (id === "pisah-tahap" ? -2 : 0);
        out.pos.set(Math.cos(a) * d, Y + 3 + h, Math.sin(a) * d);
        out.look.set(0, Y + 3, 0);
      }
    }
  }

  /** Nilai layar kabin: kecepatan (perkiraan) & gaya G menurut adegan. */
  private cabinState(i: number, t: number, pose: RocketPose) {
    const km = pose.altKm;
    const pts: [number, number][] = [
      [0, 0],
      [3, 1500],
      [12, 3000],
      [50, 6000],
      [100, 10000],
      [250, 21000],
      [400, 27600],
    ];
    let speed = 0;
    for (let k = 1; k < pts.length; k++)
      if (km <= pts[k][0]) {
        const [a0, v0] = pts[k - 1],
          [a1, v1] = pts[k];
        speed = v0 + ((v1 - v0) * (km - a0)) / (a1 - a0);
        break;
      } else speed = pts[k][1];
    const id = MISI[i].id;
    const p = clamp01(t / this.durs[i]);
    const g = i < LIFTOFF ? 1 : id === "gaya-g" ? 1.6 + smooth(0, 0.6, p) * 1.4 : i < ORBIT ? 2.2 : 0;
    const float = i >= ORBIT ? smooth(0, 0.25, this.since(ORBIT, i, t) / this.durs[ORBIT]) : 0;
    return { altKm: km, speedKmh: i < LIFTOFF ? 0 : speed, g, float, t: this.since(0, i, t) };
  }

  /* ---------------- audio ---------------- */

  /** Ikuti rekaman bila ada: persinggahan & progres dari posisi audio. true = audio yang mengatur waktu. */
  private syncAudio(): boolean {
    const part = partFor(this.idx);
    if (!part) {
      this.audio?.pause();
      this.part = null;
      return false;
    }
    if (!this.audio) this.audio = sharedAudio("roket");
    const a = this.audio;
    if (part !== this.part) {
      this.part = part;
      a.src = part.src;
      if (this.seekTo === null) this.seekTo = part.cues[this.idx - part.first];
    }
    if (a.readyState >= 1 && this.seekTo !== null) {
      a.currentTime = this.seekTo;
      this.seekTo = null;
    }
    if (a.paused && !a.ended && !this.playing) {
      this.playing = true;
      a.play()
        .catch(() => {})
        .finally(() => (this.playing = false));
    }
    if (a.readyState < 1) return true;
    const ct = a.currentTime;
    let k = 0;
    while (k + 1 < part.cues.length && ct >= part.cues[k + 1]) k++;
    const i = part.first + k;
    const start = part.cues[k];
    const end = part.cues[k + 1] ?? a.duration;
    this.durs[i] = Math.max(1, end - start);
    if (i !== this.idx) {
      this.idx = i;
      useRoket.setState({ stop: i });
    }
    this.t = ct - start;
    if (a.ended) {
      // rekaman bagian ini habis: lanjut ke persinggahan berikutnya (bagian lain / waktu baca) atau selesai
      if (i < MISI.length - 1 && partFor(i + 1) !== part) this.go(i + 1);
      else this.finish();
    }
    return true;
  }

  private finish() {
    this.t = this.durs[this.idx];
    useRoket.setState({ playing: false, finished: true, progress: 1 });
    this.controls.enabled = true;
  }

  /* ---------------- loop ---------------- */

  private loop = (now: number) => {
    this.raf = requestAnimationFrame(this.loop);
    const dt = Math.min((now - this.last) / 1000, 0.1);
    this.last = now;
    const ui = useRoket.getState();
    const cam = this.world.camera;

    if (ui.mode === "terbang") {
      if (ui.playing && !this.syncAudio()) {
        this.t += dt;
        if (this.t >= this.durs[this.idx]) {
          if (this.idx < MISI.length - 1) this.go(this.idx + 1);
          else this.finish();
        }
      }
      const pose = this.pose(this.idx, this.t);
      this.world.applyPose(pose);
      const prog = clamp01(this.t / this.durs[this.idx]);
      if (Math.abs(prog - ui.progress) > 0.01) useRoket.setState({ progress: prog });
      if (ui.playing || this.snap) {
        const want = { pos: new THREE.Vector3(), look: new THREE.Vector3() };
        this.shot(this.idx, this.t, pose, want);
        if (this.snap) {
          this.camPos.copy(want.pos);
          this.camLook.copy(want.look);
          this.snap = false;
        } else {
          const k = 1 - Math.exp(-dt * 1.6);
          this.camPos.lerp(want.pos, k);
          this.camLook.lerp(want.look, k);
        }
        cam.position.copy(this.camPos);
        this.controls.target.copy(this.camLook);
        // Getaran halus saat mesin menyala (makin kecil di udara tipis) — terasa meluncur, tidak memusingkan
        if (pose.burn) {
          const now2 = now / 1000;
          const amp = 0.035 * (1 - smooth(60, 110, pose.altKm)) + 0.006;
          cam.position.x += (Math.sin(now2 * 37) + Math.sin(now2 * 53.3)) * amp * 0.5;
          cam.position.y += (Math.sin(now2 * 41.7) + Math.sin(now2 * 29.1)) * amp * 0.5;
        }
      } else {
        this.camPos.copy(cam.position);
        this.camLook.copy(this.controls.target);
      }
    }

    if (this.fly) {
      const f = this.fly;
      f.k = Math.min(1, f.k + dt / 1.4);
      const e = ease(f.k);
      cam.position.lerpVectors(f.from, f.to, e);
      this.controls.target.lerpVectors(f.fromT, f.toT, e);
      if (f.k >= 1) this.fly = null;
    }

    // POV kabin: dunia digambar dari dalam kapsul (orientasi kamera kabin), lalu kabin di atasnya.
    const view = ui.mode === "terbang" ? MISI[this.idx].view : undefined;
    if (view === "kupola") {
      // Mata astronaut di kupola stasiun: dunia dilihat menghadap Bumi (miring agar cakrawala tampak)
      this.cupola.update(this.since(0, this.idx, this.t));
      const pose = this.pose(this.idx, this.t);
      this.world.applyPose(pose);
      const Y = altToY(pose.altKm);
      cam.position.set(0, Y + 5.2, 1.6);
      this.frame.position.set(0, 0, 0);
      this.frame.lookAt(0, -0.8, 1); // +Z kupola → ke bawah-depan (Bumi & cakrawala)
      cam.quaternion.copy(this.frame.quaternion).multiply(this.cupola.camera.quaternion);
      cam.fov = this.cupola.camera.fov;
      cam.updateProjectionMatrix();
      this.controls.enabled = false;
      this.world.r.cap.visible = false;
      this.world.update(dt);
      this.renderer.autoClear = true;
      this.renderer.render(this.world.scene, cam);
      this.renderer.autoClear = false;
      this.renderer.clearDepth();
      this.renderer.render(this.cupola.scene, this.cupola.camera);
      this.renderer.autoClear = true;
      this.world.r.cap.visible = true;
      this.wasCabin = true;
      return;
    }
    if (view === "kabin") {
      const pose = this.pose(this.idx, this.t);
      const Y = altToY(pose.altKm);
      this.cabin.update(this.cabinState(this.idx, this.t, pose));
      cam.position.set(0, Y + 5.45, 0);
      cam.quaternion.copy(this.cabin.camera.quaternion);
      cam.fov = this.cabin.camera.fov;
      cam.updateProjectionMatrix();
      this.controls.enabled = false;
      this.world.r.cap.visible = false; // dinding kapsul dari luar tidak ikut menghalangi jendela
      this.world.update(dt);
      this.renderer.autoClear = true;
      this.renderer.render(this.world.scene, cam);
      this.renderer.autoClear = false;
      this.renderer.clearDepth();
      this.renderer.render(this.cabin.scene, this.cabin.camera);
      this.renderer.autoClear = true;
      this.world.r.cap.visible = true;
      this.wasCabin = true;
      return;
    }
    if (this.wasCabin) {
      // keluar dari kabin: kembalikan lensa & langsung ke bidikan luar
      this.wasCabin = false;
      cam.fov = 50;
      cam.updateProjectionMatrix();
      this.snap = true;
      this.controls.enabled = !ui.playing;
    }
    this.controls.update();
    this.world.update(dt);
    this.renderer.render(this.world.scene, cam);
  };

  dispose() {
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    const el = this.renderer.domElement;
    el.removeEventListener("pointerdown", this.onDown);
    el.removeEventListener("pointerup", this.onUp);
    el.removeEventListener("wheel", this.onWheel);
    this.audio?.pause();
    this.controls.dispose();
    this.cabin.dispose();
    this.cupola.dispose();
    this.env.dispose();
    this.world.dispose();
    this.renderer.dispose();
    el.remove();
  }
}
