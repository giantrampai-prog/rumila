// Pengendali modul Roket: renderer, loop, timeline Misi Terbang (sinkron dengan rekaman bila ada),
// kamera sinematik yang kalem, dan mode Jelajah (kamera bebas + ketuk bagian roket / pilih lapisan).

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { skyEnvScene, worldY } from "./site";
import { create } from "zustand";
import { COUNTDOWN, JELAJAH, LIFTOFF, MISI, MISI_AUDIO, type MisiAudioPart } from "@/lib/roket/misi";
import { missionCueAt, missionDurations } from "@/lib/roket/timeline";
import { followAudio } from "@/lib/audio-clock";
import { engineSound, sfx, stopEngineSound } from "@/lib/sfx";
import { sharedAudio, unlockAudio } from "@/lib/audio-unlock";
import { LoopMusic } from "@/lib/bgm";
import { Cabin } from "./cabin";
import { Cupola } from "./cupola";
import { RocketScene, altToY, type RocketPose } from "./scene";

export type RoketMode = "jelajah" | "terbang";

interface RoketUI {
  mode: RoketMode;
  stop: number;
  /** progres persinggahan aktif (0–1) */
  progress: number;
  seconds: number;
  duration: number;
  cueKey: string;
  audioError: boolean;
  playing: boolean;
  finished: boolean;
  focus: string | null;
}

export const useRoket = create<RoketUI>(() => ({
  mode: "jelajah",
  stop: 0,
  progress: 0,
  seconds: 0,
  duration: missionDurations()[0],
  cueKey: "landasan:0",
  audioError: false,
  playing: false,
  finished: false,
  focus: null,
}));

/** titik pajang Stasiun di mode Jelajah (jauh dari landasan & satelit ilustrasi) */
const ISS_SHOWCASE = new THREE.Vector3(-60, altToY(400), 40);
const at = (id: string) => MISI.findIndex((s) => s.id === id);
const SEP = at("pisah-tahap");
const ORBIT = at("tanpa-bobot"); // mesin mati, tahap kedua lepas
const ISS_NEAR = at("termosfer");
const DOCK = at("merapat");
/**
 * Saat kapsul menempel (0–1 dari adegan "merapat"): tepat ketika narasi mengucapkan "Klik!" — diperkirakan dari
 * posisi kata itu di naskah adegan (narasi dibaca merata), sedikit lebih awal supaya "klik" terdengar saat menempel.
 */
const DOCK_AT = (() => {
  const txt = MISI[DOCK].lines.join(" ");
  const k = txt.toLowerCase().indexOf("klik");
  return k > 0 ? Math.max(0.1, k / txt.length - 0.02) : 0.3;
})();
const EVA = at("bertugas");
const WALK = at("naik-kapsul");
const SEP_AT = 0.25; // bagian persinggahan "pisah tahap" saat tahap pertama lepas
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/**
 * Renderer memakai logarithmic depth buffer (Bumi sampai orbit dalam satu adegan). ShaderMaterial buatan
 * sendiri harus ikut menulis kedalaman logaritmik — tanpa ini api roket, jejak asap, dan garis kecepatan
 * selalu kalah uji kedalaman sehingga tidak tampak. Disuntikkan sekali ke semua ShaderMaterial di adegan.
 */
function withLogDepth(scene: THREE.Object3D) {
  const done = new Set<THREE.Material>();
  scene.traverse((o) => {
    const mats = (o as THREE.Mesh).material;
    for (const m of Array.isArray(mats) ? mats : mats ? [mats] : []) {
      if (!(m instanceof THREE.ShaderMaterial) || done.has(m) || m.vertexShader.includes("logdepthbuf")) continue;
      done.add(m);
      const vEnd = m.vertexShader.lastIndexOf("}");
      m.vertexShader = "#include <common>\n#include <logdepthbuf_pars_vertex>\n" + m.vertexShader.slice(0, vEnd) + "\n#include <logdepthbuf_vertex>\n}" + m.vertexShader.slice(vEnd + 1);
      m.fragmentShader = "#include <logdepthbuf_pars_fragment>\n" + m.fragmentShader.replace(/void\s+main\s*\(\s*\)\s*\{/, (x) => x + "\n#include <logdepthbuf_fragment>\n");
      m.needsUpdate = true;
    }
  });
}

const partFor = (i: number) => MISI_AUDIO.find((p) => i >= p.first && i < p.first + p.cues.length) ?? null;

export class RocketEngine {
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private world: RocketScene;
  private lastGap: number | null = null;
  /** musik latar misi terbang "Beyond Earth": pelan di bawah narasi, berulang tanpa putus sampai misi selesai */
  private music = new LoopMusic("/roket/musik-roket.m4a", ["roket-bgm-a", "roket-bgm-b"], { volume: 0.23, loopStart: 3, loopEnd: 229, fade: 4 });
  private cabin = new Cabin();
  private cupola = new Cupola();
  private frame = new THREE.Object3D();
  private env: THREE.Texture;
  private skyEnv: THREE.Texture;
  private wasCabin = false;
  private raf = 0;
  private last = performance.now();
  private lastShadow = 0;
  private perfStart = performance.now();
  private perfFrames = 0;
  private ro: ResizeObserver;
  /* timeline */
  private idx = 0;
  private t = 0;
  private durs: number[] = missionDurations();
  private audio: HTMLAudioElement | null = null;
  private part: MisiAudioPart | null = null;
  private seekTo: number | null = null;
  private playing = false;
  /* kamera */
  private camPos = new THREE.Vector3(16, 7.4, 20);
  private camLook = new THREE.Vector3(0, 3, 0);
  private snap = true;
  private cabinSnap = true;
  private reduceMotion = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  private fly: { from: THREE.Vector3; fromT: THREE.Vector3; to: THREE.Vector3; toT: THREE.Vector3; k: number } | null = null;
  private down: { x: number; y: number } | null = null;
  private ray = new THREE.Raycaster();

  constructor(
    private host: HTMLElement,
    private onPick: (id: string) => void,
  ) {
    const low = (navigator.hardwareConcurrency ?? 8) <= 4 || window.matchMedia("(max-width: 700px)").matches;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, low ? 1.5 : 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.92;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.touchAction = "none";
    this.world = new RocketScene(low);
    withLogDepth(this.world.scene);
    // Pantulan logam (kaca helm emas, panel, roket) dari lingkungan studio lembut.
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    // di luar ruangan: pantulan langit biru & tanah hijau (roket, menara baja, helm)
    this.skyEnv = pmrem.fromScene(skyEnvScene(), 0.02).texture;
    pmrem.dispose();
    this.world.scene.environment = this.skyEnv;
    this.world.scene.environmentIntensity = 0.38;
    withLogDepth(this.cabin.scene);
    withLogDepth(this.cupola.scene);
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
    this.snap = true;
    this.cabinSnap = true;
  }

  /* ---------------- mode ---------------- */

  setMode(m: RoketMode) {
    unlockAudio(); // dipanggil dari ketukan tombol
    useRoket.setState({ mode: m, focus: null, finished: false });
    this.world.issShowcase = null;
    this.fly = null;
    if (m === "terbang") {
      this.snap = true;
      this.go(0);
      this.setPlaying(true);
    } else {
      this.setPlaying(false);
      this.music.stop(1.2);
      this.idx = 0;
      this.t = 0;
      this.world.applyPose(this.pose(0, 0));
      this.controls.enabled = true;
      this.flyTo(new THREE.Vector3(16, 7.4, 20), new THREE.Vector3(0, 3, 0));
    }
  }

  go(i: number) {
    this.idx = Math.max(0, Math.min(MISI.length - 1, i));
    this.seek(0);
  }

  /** Seek within a chapter without changing its play/pause state. */
  seek(seconds: number) {
    this.t = Math.max(0, Math.min(this.durs[this.idx] - 0.01, seconds));
    const part = partFor(this.idx);
    if (part) this.seekTo = part.cues[this.idx - part.first] + this.t;
    this.clock = this.seekTo ?? this.t;
    this.snap = true;
    this.cabinSnap = true;
    this.fly = null;
    const cue = missionCueAt(this.idx, this.t, this.durs[this.idx]);
    useRoket.setState({ stop: this.idx, seconds: this.t, duration: this.durs[this.idx], progress: this.t / this.durs[this.idx], cueKey: cue.key, finished: false, audioError: false });
  }

  setPlaying(p: boolean) {
    useRoket.setState({ playing: p });
    this.controls.enabled = !p || useRoket.getState().mode === "jelajah";
    if (!p) this.audio?.pause();
    if (p && useRoket.getState().mode === "terbang") this.music.play();
    else this.music.pause();
    if (p) {
      useRoket.setState({ audioError: false });
      if (this.audio?.error) this.audio.load();
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
    // Stasiun dipajang utuh di orbit ±400 km hanya saat itemnya dipilih
    this.world.issShowcase = id === "stasiun" ? ISS_SHOWCASE.clone() : null;
    if (!id) return this.flyTo(new THREE.Vector3(16, 7.4, 20), new THREE.Vector3(0, 3, 0));
    const item = JELAJAH.find((x) => x.id === id);
    if (!item) return;
    const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
    if (item.kind === "layer") {
      const mid: Record<string, number> = { troposfer: 6, stratosfer: 30, mesosfer: 68, termosfer: 300, eksosfer: 750 };
      const y = altToY(mid[id] ?? 10);
      if (id === 'termosfer') return this.flyTo(V(-10, y + 8, -18), V(215, altToY(170), 130));
      if (id === 'eksosfer') return this.flyTo(V(46, altToY(650) + 12, 58), V(0, altToY(650) + 16, 0));
      return this.flyTo(V(18, y, 18), V(-40, y * 0.62 - 2, -40));
    }
    const parts: Record<string, [THREE.Vector3, THREE.Vector3]> = {
      roket: [V(0, 3.3, 0), V(9, 2, 9)],
      kapsul: [V(0, 5.5, 0), V(-2.2, 0.6, 2.2)],
      "tahap-2": [V(0, 4.3, 0), V(2.8, 0.5, 2.8)],
      "tahap-1": [V(0, 2, 0), V(4.5, 1, 4.5)],
      mesin: [V(0, 0.35, 0), V(1.8, 0.1, 1.8)],
      astronot: [V(3.6, 0.35, 2.2), V(1.3, 0.35, 1.7)],
      menara: [V(2.2, 4, 0), V(7, 2, 7)],
      // dari samping-atas: rangka & sayap utuh dengan Bumi berawan di bawahnya
      stasiun: [ISS_SHOWCASE.clone(), V(1.5, 3.2, 9.5)],
    };
    const [look, off] = parts[id] ?? parts.roket;
    this.flyTo(look.clone().add(off), look);
  }

  /** Low, close views make the coastline and tree detail explorable without losing the launch pad. */
  viewSite(view: "landasan" | "pesisir" | "hutan") {
    this.focus(null);
    const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
    if (view === "pesisir") this.flyTo(V(22, 2.8, 30), V(14, 0.5, -8));
    if (view === "hutan") this.flyTo(V(-10, 1.6, -12), V(-24, 2.6, -35));
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
    else if (i === DOCK) issGap = 8 * (1 - smooth(0, DOCK_AT, p));
    else if (i > DOCK) issGap = 0;
    return { altKm, sepT, sepAltKm, sep2T, sep2AltKm, issGap, burn, steam, astro, armOpen };
  }

  /** The camera and popup resolve the same cue from the narration clock. */
  private shot(i: number, t: number, pose: RocketPose, out: { pos: THREE.Vector3; look: THREE.Vector3 }) {
    const target = missionCueAt(i, t, this.durs[i]).target;
    const Y = altToY(pose.altKm);
    const a = 0.65 + t * 0.008;
    const ap = this.world.a.astro.position;
    const frame = (x: number, y: number, z: number, dx: number, dy: number, dz: number) => {
      out.look.set(x, y, z);
      const aspect = this.world.camera.aspect;
      const fit = target === "stasiun" ? Math.max(1, 1.4 / aspect)
        : target === "panel-surya" ? Math.max(1, 1 / aspect)
        : target === "satelit" ? Math.max(1, 0.65 / aspect)
        : aspect < 1 ? 1.22 : 1;
      out.pos.set(x + dx * fit, y + dy * fit, z + dz * fit);
      // Keep the subject above the bottom information card, including on phones.
      out.look.y -= Math.hypot(dx, dy, dz) * fit * (this.world.camera.aspect < 1 ? 0.1 : 0.11);
    };
    switch (target) {
      case "landasan": frame(0, 3, 0, -14, 5, 18); break;
      case "menara": frame(2.2, 4, 0, 8, 3, 11); break;
      case "astronaut":
        frame(ap.x, ap.y + 0.48, ap.z, -1.35, 0.35, 1.7); break;
      case "helm": frame(ap.x, ap.y + 0.75, ap.z, -0.68, 0.12, 0.85); break;
      case "kapsul": frame(0, Y + 5.35, 0, -2.7, 0.6, 3.8); break;
      case "mesin": frame(0, Y + 0.55, 0, -3.2, -0.15, 4.1); break;
      case "tahap-1": {
        const p = this.world.r.s1.getWorldPosition(new THREE.Vector3());
        frame(p.x, p.y + 1.5, p.z, -5, 2.5, 6); break;
      }
      case "tahap-2": frame(0, Y + 3.8, 0, -3.8, -0.3, 4.8); break;
      case "stasiun": case "panel-surya": case "satelit": {
        const anchor = this.world.missionAnchor(target);
        const d = target === "stasiun" ? 10 : target === "panel-surya" ? 5.6 : 9;
        frame(anchor.x, anchor.y, anchor.z, d * 0.28, d * 0.4, d); break;
      }
      case "bumi": {
        const y = Math.max(Y, altToY(400));
        frame(0, y - 130, 0, -32, 146, 55); break;
      }
      case "aurora": {
        const b = Math.PI / 2 - 1.9;
        out.pos.set(-Math.cos(b) * 7, Y + 3.2, -Math.sin(b) * 7);
        out.look.set(Math.cos(b) * 280, altToY(240) + 30, Math.sin(b) * 280);
        break;
      }
      case "meteor":
        // Meteors spawn ahead and above the camera in the negative-Z direction.
        out.pos.set(8, Y + 5, 12); out.look.set(0, Y + 27, -32); break;
      case "awan": frame(0, Y + 2, 0, -11, 7, 14); break;
      case "ozon": frame(0, Y + 3, 0, -13, 4, 17); break;
      case "orbit": frame(0, Y + 3, 0, -22, 16, 28); break;
      default: frame(0, Y + 3, 0, -Math.cos(a) * 12.5, 2.7, Math.sin(a) * 12.5); break;
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
  private clock = 0;
  private lastRumble = 0;
  /** mesin sedang menyala (bingkai sebelumnya) — untuk bunyi penyalaan */
  private wasBurning = false;
  /** suara mesin kontinu sedang diputar (dihentikan saat keluar mode Terbang) */
  private engineLive = false;
  private syncAudio(dt: number): boolean {
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
      a.onerror = () => { this.setPlaying(false); useRoket.setState({ audioError: true }); };
      if (this.seekTo === null) this.seekTo = part.cues[this.idx - part.first];
    }
    if (a.readyState >= 1 && this.seekTo !== null) {
      a.currentTime = this.seekTo;
      this.clock = this.seekTo;
      this.seekTo = null;
    }
    if (useRoket.getState().playing && a.paused && !a.ended && !this.playing) {
      this.playing = true;
      a.play()
        .catch(() => { if (useRoket.getState().playing) { this.setPlaying(false); useRoket.setState({ audioError: true }); } })
        .finally(() => (this.playing = false));
    }
    if (a.readyState < 1 || this.seekTo !== null) return true;
    // jam halus (currentTime di HP diperbarui tersendat → roket & kamera bergetar bila dibaca langsung)
    this.clock = followAudio(this.clock, a.currentTime, dt, !a.paused && !a.seeking && a.readyState >= 3);
    const ct = this.clock;
    let k = 0;
    while (k + 1 < part.cues.length && ct >= part.cues[k + 1]) k++;
    const i = part.first + k;
    const start = part.cues[k];
    const end = part.cues[k + 1] ?? (Number.isFinite(a.duration) ? a.duration : start + this.durs[i]);
    this.durs[i] = Math.max(1, end - start);
    if (i !== this.idx) {
      this.idx = i;
      useRoket.setState({ stop: i });
    }
    this.t = Math.max(0, ct - start);
    if (a.ended && useRoket.getState().playing) {
      // rekaman bagian ini habis: lanjut ke persinggahan berikutnya (bagian lain / waktu baca) atau selesai
      if (i < MISI.length - 1 && partFor(i + 1) !== part) this.go(i + 1);
      else this.finish();
    }
    return true;
  }

  private finish() {
    this.t = this.durs[this.idx];
    this.music.stop(3); // misi selesai: musik mengecil pelan lalu berhenti
    useRoket.setState({ playing: false, finished: true, progress: 1 });
    this.controls.enabled = true;
  }

  private refreshShadows(now: number) {
    // Leaf motion is slow; reuse the shadow atlas between updates.
    this.renderer.shadowMap.autoUpdate = false;
    if (this.world.shadowsLive && now - this.lastShadow > 120) {
      this.renderer.shadowMap.needsUpdate = true;
      this.lastShadow = now;
    }
  }

  /* ---------------- loop ---------------- */

  private loop = (now: number) => {
    this.raf = requestAnimationFrame(this.loop);
    const dt = Math.min((now - this.last) / 1000, 0.1);
    this.last = now;
    const ui = useRoket.getState();
    const cam = this.world.camera;

    if (ui.mode === "terbang") {
      const hasAudio = this.syncAudio(dt);
      if (ui.playing && !hasAudio) {
        this.t += dt;
        if (this.t >= this.durs[this.idx]) {
          if (this.idx < MISI.length - 1) this.go(this.idx + 1);
          else this.finish();
        }
      }
      const pose = this.pose(this.idx, this.t);
      const cue = missionCueAt(this.idx, this.t, this.durs[this.idx]);
      this.world.issShowcase = MISI[this.idx].id === "tujuan-misi" && cue.target === "stasiun" ? ISS_SHOWCASE : null;
      this.world.applyPose(pose);
      // bunyi "klik" tepat saat kapsul menempel ke stasiun
      if (ui.playing && this.lastGap !== null && this.lastGap > 0 && pose.issGap === 0) sfx.clink();
      this.lastGap = pose.issGap;
      // Suara mesin roket kontinu: gemuruh + raungan semburan + letupan kasar selama menyala, angin menderu saat
      // menembus atmosfer; makin pelan di udara tipis (di luar angkasa hampir tak terdengar). Ikut jeda.
      const on = !!pose.burn && ui.playing;
      const thin = smooth(15, 110, pose.altKm);
      if (on && !this.wasBurning && pose.altKm < 1) sfx.liftoff(); // penyalaan di landasan
      this.wasBurning = on;
      engineSound(
        on ? 1 - thin * 0.8 : 0,
        ui.playing ? smooth(0.05, 2, pose.altKm) * (1 - smooth(15, 45, pose.altKm)) * (pose.burn ? 1 : 0.4) : 0,
        on ? 0.35 : 0,
        on ? 1 - thin : 0,
      );
      this.engineLive = true;
      const prog = clamp01(this.t / this.durs[this.idx]);
      if (Math.abs(this.t - ui.seconds) > 0.1 || cue.key !== ui.cueKey) useRoket.setState({ progress: prog, seconds: this.t, duration: this.durs[this.idx], cueKey: cue.key });
      if (process.env.NODE_ENV === "development") {
        this.renderer.domElement.dataset.missionTarget = cue.target;
        this.renderer.domElement.dataset.missionCue = cue.key;
        this.renderer.domElement.dataset.missionSeconds = this.t.toFixed(2);
      }
      if (ui.playing || this.snap) {
        const want = { pos: new THREE.Vector3(), look: new THREE.Vector3() };
        this.shot(this.idx, this.t, pose, want);
        if (this.snap || this.reduceMotion) {
          this.camPos.copy(want.pos);
          this.camLook.copy(want.look);
          this.snap = false;
        } else {
          const k = 1 - Math.exp(-dt * 2.4);
          this.camPos.lerp(want.pos, k);
          this.camLook.lerp(want.look, k);
        }
        cam.position.copy(this.camPos);
        this.controls.target.copy(this.camLook);
        // Getaran halus saat mesin menyala (makin kecil di udara tipis) — terasa meluncur, tidak memusingkan
        if (pose.burn && !this.reduceMotion) {
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

    if (ui.mode !== "terbang" && this.engineLive) {
      stopEngineSound(0.8);
      this.engineLive = false;
      this.wasBurning = false;
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
      // bunyi "klik" tepat saat kapsul menempel ke stasiun
      if (ui.playing && this.lastGap !== null && this.lastGap > 0 && pose.issGap === 0) sfx.clink();
      this.lastGap = pose.issGap;
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
      this.refreshShadows(now);
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
      this.cabin.focus(missionCueAt(this.idx, this.t, this.durs[this.idx]).target, this.cabinSnap || this.reduceMotion ? 1 : 1 - Math.exp(-dt * 2.4));
      this.cabinSnap = false;
      cam.position.set(0, Y + 5.45, 0);
      cam.quaternion.copy(this.cabin.camera.quaternion);
      cam.fov = this.cabin.camera.fov;
      cam.updateProjectionMatrix();
      this.controls.enabled = false;
      this.world.r.cap.visible = false; // dinding kapsul dari luar tidak ikut menghalangi jendela
      this.world.update(dt);
      this.renderer.autoClear = true;
      this.refreshShadows(now);
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
      this.cabinSnap = true;
      cam.fov = 50;
      cam.updateProjectionMatrix();
      this.snap = true;
      this.controls.enabled = !ui.playing;
    }
    this.controls.update();
    // Jelajah: kamera tidak boleh menembus tanah (dulu bisa diputar ke bawah medan → dunia terlihat terbalik)
    if (ui.mode !== "terbang" && cam.position.y < 400) {
      const floor = worldY(cam.position.x, cam.position.z) + 0.8;
      if (cam.position.y < floor) cam.position.y = floor;
    }
    this.world.update(dt);
    this.refreshShadows(now);
    this.renderer.render(this.world.scene, cam);
    if (process.env.NODE_ENV === "development") {
      this.perfFrames++;
      if (now - this.perfStart > 2000) {
        this.renderer.domElement.dataset.frameMs = ((now - this.perfStart) / this.perfFrames).toFixed(1);
        this.renderer.domElement.dataset.drawCalls = String(this.renderer.info.render.calls);
        this.renderer.domElement.dataset.camera = cam.position.toArray().map(n => n.toFixed(2)).join(",");
        this.renderer.domElement.dataset.triangles = String(this.renderer.info.render.triangles);
        this.perfStart = now; this.perfFrames = 0;
      }
    }
  };

  dispose() {
    cancelAnimationFrame(this.raf);
    stopEngineSound(0.2);
    this.ro.disconnect();
    const el = this.renderer.domElement;
    el.removeEventListener("pointerdown", this.onDown);
    el.removeEventListener("pointerup", this.onUp);
    el.removeEventListener("wheel", this.onWheel);
    this.audio?.pause();
    this.music.stop(0.3);
    this.controls.dispose();
    this.cabin.dispose();
    this.cupola.dispose();
    this.env.dispose();
    this.skyEnv.dispose();
    this.world.dispose();
    this.renderer.dispose();
    el.remove();
  }
}
