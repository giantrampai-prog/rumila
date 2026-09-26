// Pengendali modul Roket: renderer, loop, timeline Misi Terbang (sinkron dengan rekaman bila ada),
// kamera sinematik yang kalem, dan mode Jelajah (kamera bebas + ketuk bagian roket / pilih lapisan).

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { create } from "zustand";
import { COUNTDOWN, JELAJAH, LIFTOFF, MISI, MISI_AUDIO, dwellSeconds, type MisiAudioPart } from "@/lib/roket/misi";
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

const SEP = MISI.findIndex((s) => s.id === "pisah-tahap");
const ORBIT = MISI.findIndex((s) => s.id === "mengorbit");
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
  }

  /* ---------------- mode ---------------- */

  setMode(m: RoketMode) {
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

  private pose(i: number, t: number): RocketPose {
    const s = MISI[i];
    const dur = this.durs[i];
    const p = clamp01(t / dur);
    const k = i === LIFTOFF ? p * p : p;
    const altKm = s.alt[0] + (s.alt[1] - s.alt[0]) * k;
    const sepAltKm = MISI[SEP].alt[0] + (MISI[SEP].alt[1] - MISI[SEP].alt[0]) * SEP_AT;
    let sepT: number | null = null;
    if (i === SEP) sepT = t >= SEP_AT * dur ? t - SEP_AT * dur : null;
    else if (i > SEP) {
      sepT = (1 - SEP_AT) * this.durs[SEP] + t;
      for (let j = SEP + 1; j < i; j++) sepT += this.durs[j];
    }
    const burn: 0 | 1 | 2 = i < LIFTOFF || i >= ORBIT ? 0 : sepT === null ? 1 : sepT < 1.2 ? 0 : 2;
    const steam = i < COUNTDOWN ? 0.04 : i === COUNTDOWN ? 0.1 + p * 0.3 : 0;
    let astro: RocketPose["astro"] = { state: "inside", t: 0 };
    if (i === 0) astro = { state: "pad", t: 0 };
    else if (i === 1) astro = { state: "walk", t: p };
    else if (i === ORBIT) astro = { state: "eva", t };
    else if (i > ORBIT) astro = { state: "eva", t: this.durs[ORBIT] + t };
    const armOpen = i < COUNTDOWN ? 0 : i === COUNTDOWN ? smooth(0.4, 0.9, p) : 1;
    return { altKm, sepT, sepAltKm, burn, steam, astro, armOpen };
  }

  /** Kamera yang diinginkan untuk persinggahan (lembut; tanpa guncangan). */
  private shot(i: number, t: number, pose: RocketPose, out: { pos: THREE.Vector3; look: THREE.Vector3 }) {
    const id = MISI[i].id;
    const Y = altToY(pose.altKm);
    const p = clamp01(t / this.durs[i]);
    const flightT = this.durs.slice(0, i).reduce((a, b) => a + b, 0) + t;
    const a = 0.7 + flightT * 0.012;
    if (id === "landasan") {
      const ang = 0.6 + t * 0.03;
      out.pos.set(Math.cos(ang) * 20, 5, Math.sin(ang) * 20);
      out.look.set(0, 3, 0);
    } else if (id === "naik-kapsul") {
      const ap = this.world.a.astro.position;
      out.look.set(ap.x, ap.y + 0.4, ap.z);
      out.pos.set(ap.x + 3.2, ap.y + 1.3, ap.z + 3.6);
    } else if (id === "hitung-mundur") {
      const d = 10 - p * 2.5;
      out.pos.set(d * 0.8, 1.2, d * 0.8);
      out.look.set(0, 3.6, 0);
    } else if (id === "lepas-landas") {
      out.pos.set(9, Math.max(1.4, Y * 0.5 + 1.4), 9);
      out.look.set(0, Y + 3, 0);
    } else if (id === "mengorbit" || id === "penutup") {
      // Dari atas kapsul memandang ke bawah: Bumi terlihat di belakang astronaut; penutup mundur perlahan.
      const back = id === "penutup" ? ease(p) : 0;
      out.look.set(0.9, Y + 5.2 - back * 50, 0.4);
      out.pos.set(Math.cos(a) * (6 + back * 70), Y + 9 + back * 45, Math.sin(a) * (6 + back * 70));
    } else {
      // Kamera kejar: berputar pelan, makin jauh & makin di atas saat roket makin tinggi (Bumi terlihat).
      const alt = pose.altKm;
      const d = 12 + smooth(10, 110, alt) * 6 + smooth(110, 800, alt) * 10;
      const h = -3 + smooth(5, 60, alt) * 3 + smooth(90, 800, alt) * 10 + (id === "pisah-tahap" ? -2 : 0);
      out.pos.set(Math.cos(a) * d, Y + 3 + h, Math.sin(a) * d);
      out.look.set(0, Y + 3, 0);
    }
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
    if (!this.audio) this.audio = new Audio();
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
    if (a.paused && !a.ended) a.play().catch(() => {});
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
    this.world.dispose();
    this.renderer.dispose();
    el.remove();
  }
}
