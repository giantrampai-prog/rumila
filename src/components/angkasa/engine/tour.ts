// Pengendali "Tur terbang" (POV penjelajah) di scene tata surya.
// Fase: terbang (kamera menghadap arah gerak, lalu berbelok ke tujuan) → singgah (melayang pelan mengitari objek
// sambil teks edukatif berganti) → persinggahan berikutnya. Input pengguna menjeda tur dan mengembalikan kontrol kamera.
// Bila ada narasi rekaman (satu file untuk seluruh tur), audio menjadi jam utama: pindah persinggahan & ganti kalimat
// mengikuti posisi audio; tanpa rekaman, lama singgah mengikuti waktu baca teks.

import * as THREE from "three";
import { useAngkasa } from "@/lib/angkasa/state";
import { TOUR, dwellSeconds, lineAt } from "@/lib/angkasa/tour";
import {
  lineAtTime,
  partFor,
  stopAt,
  type TourAudioPart,
} from "@/lib/angkasa/tourVoice";
import type { Body } from "./bodies";
import type { EngineCtx } from "./core";

const smooth = (t: number) => t * t * (3 - 2 * t);
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

interface Host {
  camera: THREE.PerspectiveCamera;
  bodies: Map<string, Body>;
}

export class TourController {
  /** objek yang sedang disinggahi (untuk label) */
  targetId: string | null = null;
  private index = -1;
  private phase: "travel" | "dwell" | "idle" = "idle";
  private curve: THREE.CatmullRomCurve3 | null = null;
  private travelT = 0;
  private travelDur = 1;
  private dwellT = 0;
  private dwellDur = 10;
  private orbitAngle = 0;
  private orbitRadius = 3;
  private orbitHeight = 0.5;
  private lookFrom = new THREE.Vector3();
  private lastLine = -1;
  private playing = false;
  private saved: { min: number; max: number; enabled: boolean } | null = null;
  private tmp = new THREE.Vector3();
  /** geser titik pandang ke bawah agar objek tampil di atas teks keterangan */
  private lift = 0;
  /* Narasi rekaman (satu file) */
  private part: TourAudioPart | null = null;
  private failed = new Set<string>();
  /** lompatan persinggahan dari pengguna: posisikan audio ke awal narasinya */
  private forceSeek = false;
  private audio: HTMLAudioElement | null = null;
  private playRequested = false;
  private voiceWait = 0;
  private pendingSeek: number | null = null;
  /** true = perpindahan persinggahan berasal dari audio/lanjut-jeda (jangan lompatkan audio) */
  private followAudio = false;

  constructor(
    private host: Host,
    private ctx: EngineCtx,
  ) {
    this.saved = {
      min: ctx.controls.minDistance,
      max: ctx.controls.maxDistance,
      enabled: ctx.controls.enabled,
    };
    ctx.controls.minDistance = 0.02;
    ctx.controls.maxDistance = 400;
    ctx.renderer.domElement.addEventListener("pointerdown", this.onUserInput);
    ctx.renderer.domElement.addEventListener("wheel", this.onUserInput, {
      passive: true,
    });
  }

  /** Input pengguna (geser/zoom) menjeda tur; kamera bebas dipakai. */
  private onUserInput = () => {
    if (this.playing) useAngkasa.getState().set({ tourPlaying: false });
  };

  /** Posisi dunia pusat objek persinggahan. */
  private centerOf(id: string, out: THREE.Vector3) {
    if (id === "intro" || id === "outro") return out.set(0, 0, 0);
    return this.host.bodies.get(id)!.orbitAnchor.getWorldPosition(out);
  }

  /** Titik tiba: sisi yang tersinari Matahari, sedikit di atas bidang, jarak cukup untuk membingkai objek. */
  private arrival(id: string) {
    const center = this.centerOf(id, new THREE.Vector3());
    if (id === "intro")
      return { center, pos: new THREE.Vector3(0, 16, 62), radius: 62 };
    if (id === "outro")
      return { center, pos: new THREE.Vector3(-20, 46, 88), radius: 100 };
    const b = this.host.bodies.get(id)!;
    const half = this.ctx.fitHalfFov();
    // Komet dibidik dari samping & lebih jauh agar ekornya (menjauhi Matahari) terlihat utuh.
    const comet = id === "comet-example";
    const dist =
      (b.frameRadius / Math.sin(half)) *
      (comet ? 9 : b.rings ? 1.6 : id === "sun" ? 2 : 2.7);
    const toSun = center.clone().negate().normalize();
    if (toSun.lengthSq() < 0.5) toSun.set(0, 0, 1);
    const side = new THREE.Vector3(0, 1, 0).cross(toSun).normalize();
    const dir = toSun
      .multiplyScalar(comet ? 0.35 : 0.8)
      .add(side.multiplyScalar(comet ? 1 : 0.55))
      .add(new THREE.Vector3(0, 0.3, 0))
      .normalize();
    return {
      center,
      pos: center.clone().add(dir.multiplyScalar(dist)),
      radius: dist,
    };
  }

  /** Mulai perjalanan ke persinggahan i dari posisi kamera sekarang. */
  go(i: number) {
    this.index = Math.max(0, Math.min(TOUR.length - 1, i));
    const stop = TOUR[this.index];
    this.targetId = stop.id === "intro" || stop.id === "outro" ? null : stop.id;
    if (this.targetId)
      this.host.bodies
        .get(this.targetId)
        ?.loadDetail(this.ctx)
        .catch(() => {});
    const { center, pos, radius } = this.arrival(stop.id);
    const start = this.host.camera.position.clone();
    const span = start.distanceTo(pos);
    // Jalur melengkung: naik sedikit di tengah perjalanan, lalu mendekat dari arah tiba.
    const mid = start
      .clone()
      .lerp(pos, 0.5)
      .add(new THREE.Vector3(0, Math.min(8, span * 0.18), 0));
    const wide = stop.id === "intro" || stop.id === "outro";
    const approach = wide
      ? start.clone().lerp(pos, 0.8)
      : pos.clone().add(
          pos
            .clone()
            .sub(center)
            .normalize()
            .multiplyScalar(radius * 0.6),
        );
    this.curve = new THREE.CatmullRomCurve3(
      [start, mid, approach, pos],
      false,
      "centripetal",
    );
    this.travelDur = this.ctx.reducedMotion()
      ? 0
      : Math.max(2.4, Math.min(7, span / 8));
    this.travelT = 0;
    this.phase = this.travelDur > 0 && span > 0.05 ? "travel" : "dwell";
    this.lookFrom.copy(this.ctx.controls.target);
    this.dwellT = 0;
    this.dwellDur = dwellSeconds(stop);
    const rel = pos.clone().sub(center);
    this.orbitRadius = Math.hypot(rel.x, rel.z);
    this.orbitHeight = rel.y;
    this.orbitAngle = Math.atan2(rel.z, rel.x);
    this.lift = radius * (wide ? 0.16 : 0.2);
    this.lastLine = -1;
    // Lompat ke persinggahan (tombol/rute): posisikan audio ke awal narasi persinggahan itu.
    if (!this.followAudio) this.forceSeek = true;
    this.followAudio = false;
    if (this.phase === "dwell") this.placeDwell(0);
  }

  setPlaying(p: boolean) {
    const was = this.playing;
    this.playing = p;
    // Saat dijeda, kontrol kamera diserahkan ke pengguna; saat lanjut, terbang lagi dari posisi sekarang.
    this.ctx.controls.enabled = !p;
    if (!p) {
      this.audio?.pause();
      this.playRequested = false;
    }
    if (p && !was && this.index >= 0) {
      const keepDwell = this.phase === "dwell" ? this.dwellT : 0;
      this.followAudio = true; // lanjut dari jeda: audio meneruskan posisinya
      this.go(this.index);
      if (this.phase === "dwell") this.dwellT = keepDwell;
    }
  }

  /** Kamera melayang mengitari objek selama singgah (satu putaran lambat), menghadap objek. */
  private placeDwell(dt: number) {
    const stop = TOUR[this.index];
    const center = this.centerOf(stop.id, this.tmp);
    const wide = stop.id === "intro" || stop.id === "outro";
    const speed = this.ctx.reducedMotion() ? 0 : wide ? 0.035 : 0.09; // rad/detik
    this.orbitAngle += speed * dt;
    const cam = this.host.camera;
    cam.position.set(
      center.x + Math.cos(this.orbitAngle) * this.orbitRadius,
      center.y + this.orbitHeight,
      center.z + Math.sin(this.orbitAngle) * this.orbitRadius,
    );
    this.ctx.controls.target.copy(center).y -= this.lift;
  }

  update(dt: number) {
    if (this.index < 0 || !this.playing) return;
    if (this.syncAudio(dt)) return; // audio memindahkan persinggahan (go() sudah dipanggil)
    const stop = TOUR[this.index];
    const cam = this.host.camera;
    if (this.phase === "travel" && this.curve) {
      this.travelT = Math.min(1, this.travelT + dt / this.travelDur);
      const k = easeInOut(this.travelT);
      const at = (u: number) =>
        this.curve!.getPointAt(THREE.MathUtils.clamp(u, 0, 1));
      cam.position.copy(at(k));
      // POV: awalnya menghadap arah gerak, lalu pandangan berbelok ke tujuan.
      const ahead = at(k + 0.04);
      const center = this.centerOf(stop.id, this.tmp);
      center.y -= this.lift;
      const w = smooth(Math.min(1, Math.max(0, (this.travelT - 0.2) / 0.5)));
      const look = ahead
        .clone()
        .add(ahead.clone().sub(cam.position).setLength(4))
        .lerp(center, w);
      if (this.travelT < 0.15)
        look.lerp(this.lookFrom, 1 - this.travelT / 0.15);
      this.ctx.controls.target.copy(look);
      if (this.travelT >= 1) this.phase = "dwell";
      return;
    }
    if (this.phase === "dwell") {
      this.dwellT += dt;
      this.placeDwell(dt);
      if (partFor(this.index, this.failed)) return; // kalimat & perpindahan diatur audio
      const line = lineAt(stop, this.dwellT);
      if (line !== this.lastLine) {
        this.lastLine = line;
        useAngkasa.getState().set({ tourLine: line });
      }
      if (this.dwellT >= this.dwellDur) {
        const st = useAngkasa.getState();
        if (this.index < TOUR.length - 1)
          st.set({ tourIndex: this.index + 1, tourLine: 0 });
        else {
          this.phase = "idle";
          st.set({ tourPlaying: false });
        }
      }
    }
  }

  private getAudio() {
    if (!this.audio) {
      this.audio = new Audio();
      this.audio.preload = "auto";
      this.audio.onerror = () => this.dropPart();
    }
    return this.audio;
  }

  /** Bagian rekaman gagal dimuat/diblokir: persinggahannya memakai waktu baca teks. */
  private dropPart() {
    if (this.part) this.failed.add(this.part.src);
    this.part = null;
    this.audio?.pause();
    this.dwellT = 0;
  }

  /** Jalankan audio bagian yang mencakup persinggahan aktif & ikuti posisinya. true bila persinggahan berpindah. */
  private syncAudio(dt: number) {
    const part = partFor(this.index, this.failed);
    const a = this.getAudio();
    if (!part) {
      if (!a.paused) a.pause();
      this.part = null;
      return false;
    }
    const k = this.index - part.first;
    if (part !== this.part) {
      // pindah bagian: muat file & mulai dari narasi persinggahan ini
      this.part = part;
      a.src = part.src;
      this.pendingSeek = part.cues[k] ?? 0;
      this.playRequested = false;
      this.voiceWait = 0;
      this.forceSeek = false;
    } else if (this.forceSeek) {
      this.pendingSeek = part.cues[k] ?? 0;
      this.forceSeek = false;
    }
    a.muted = !useAngkasa.getState().tourNarration; // "Narasi" mati = bisu, waktunya tetap mengikuti rekaman
    if (a.readyState >= 1 && this.pendingSeek !== null) {
      a.currentTime = this.pendingSeek;
      this.pendingSeek = null;
    }
    if (a.paused && !a.ended && !this.playRequested) {
      this.playRequested = true;
      a.play().catch(() => this.dropPart());
    }
    if (a.readyState < 1 || !Number.isFinite(a.duration)) {
      this.voiceWait += dt;
      if (this.voiceWait > 6) this.dropPart();
      return false;
    }
    const st = useAngkasa.getState();
    if (a.ended) {
      // narasi bagian ini habis: lanjut ke persinggahan berikutnya (bagian lain atau waktu baca teks)
      if (this.index < TOUR.length - 1) {
        this.followAudio = true;
        this.playRequested = false;
        st.set({ tourIndex: this.index + 1, tourLine: 0 });
        return true;
      }
      this.phase = "idle";
      st.set({
        tourPlaying: false,
        tourLine: TOUR[this.index].lines.length - 1,
      });
      return false;
    }
    const t = a.currentTime;
    const at = part.first + stopAt(part.cues, t);
    if (at > this.index) {
      this.followAudio = true;
      st.set({ tourIndex: at, tourLine: 0 });
      return true;
    }
    const line = lineAtTime(part, TOUR[this.index].lines, k, t, a.duration);
    if (line !== this.lastLine) {
      this.lastLine = line;
      st.set({ tourLine: line });
    }
    return false;
  }

  dispose() {
    if (this.audio) {
      this.audio.pause();
      this.audio.removeAttribute("src");
      this.audio.load();
      this.audio = null;
    }
    const el = this.ctx.renderer.domElement;
    el.removeEventListener("pointerdown", this.onUserInput);
    el.removeEventListener("wheel", this.onUserInput);
    this.ctx.controls.enabled = true;
    if (this.saved) {
      this.ctx.controls.minDistance = this.saved.min;
      this.ctx.controls.maxDistance = this.saved.max;
    }
  }
}
