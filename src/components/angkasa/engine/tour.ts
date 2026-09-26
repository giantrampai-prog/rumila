// Pengendali "Tur terbang" (POV penjelajah) di scene tata surya.
// Fase: terbang (kamera menghadap arah gerak, lalu berbelok ke tujuan) → singgah (melayang pelan mengitari objek
// sambil teks edukatif berganti) → persinggahan berikutnya. Input pengguna menjeda tur dan mengembalikan kontrol kamera.

import * as THREE from "three";
import { useAngkasa } from "@/lib/angkasa/state";
import { TOUR, dwellSeconds, lineAt } from "@/lib/angkasa/tour";
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
    if (this.phase === "dwell") this.placeDwell(0);
  }

  setPlaying(p: boolean) {
    const was = this.playing;
    this.playing = p;
    // Saat dijeda, kontrol kamera diserahkan ke pengguna; saat lanjut, terbang lagi dari posisi sekarang.
    this.ctx.controls.enabled = !p;
    if (p && !was && this.index >= 0) {
      const keepDwell = this.phase === "dwell" ? this.dwellT : 0;
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

  dispose() {
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
