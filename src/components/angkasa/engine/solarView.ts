// View Tata Surya + Planet (satu scene "tampilan belajar"): orbit, pemilihan, fokus kamera yang mengikuti objek.
// Skala: LEARNING (ukuran & jarak disederhanakan) — keterangan wajib tampil di UI.

import * as THREE from "three";
import { MANIFEST, getObj } from "@/lib/angkasa/manifest";
import { LEARNING, orbitAngle, spinAngle } from "@/lib/angkasa/sim";
import type { AngkasaObject } from "@/lib/angkasa/types";
import { createBody, orbitLine, starfield, type Body } from "./bodies";
import type { AngkasaState } from "@/lib/angkasa/state";
import { disposeTree, type EngineCtx, type LabelSpec } from "./core";
import type { ModeView } from "./views";
import { TourController } from "./tour";

const DEG = Math.PI / 180;
const SYSTEM_IDS = [
  "sun",
  "mercury",
  "venus",
  "earth",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
  "asteroid-example",
  "comet-example",
];

export class SolarView implements ModeView {
  name = "solar";
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(42, 1, 0.02, 3000);
  controlsConfig = { minDistance: 0.3, maxDistance: 140, enablePan: false };
  bodies = new Map<string, Body>();
  private orbits: THREE.Object3D[] = [];
  private moonOrbitFrames = new Map<string, THREE.Group>();
  private light = new THREE.PointLight(0xfff4e6, 3.2, 0, 0);
  private fill = new THREE.AmbientLight(0x8899bb, 0.05);
  private ctx!: EngineCtx;
  /** objek yang sedang difokuskan kamera (null = ringkasan tata surya) */
  focusId: string | null = null;
  /** ID terpilih (bisa bagian seperti saturn.rings) */
  selectedId: string | null = null;
  inspect = false;
  private followPrev = new THREE.Vector3();
  private focusToken = 0;
  showOrbits = true;
  private tmp = new THREE.Vector3();
  private sunPos = new THREE.Vector3();
  /** Tur terbang (mode "tur"): kamera dikendalikan controller, bukan fokus biasa. */
  tour: TourController | null = null;
  private tourApplied = -1;

  start(ctx: EngineCtx) {
    this.ctx = ctx;
    this.scene.add(starfield());
    this.scene.add(this.light, this.fill);

    for (const id of SYSTEM_IDS) {
      const o = getObj(id);
      const b = createBody(o, ctx, { radius: LEARNING.radius(o) });
      this.bodies.set(id, b);
      this.scene.add(b.orbitAnchor);
      if (o.orbitModel?.parameters.semiMajorAxisAU) {
        // Bidang orbit sedikit miring sesuai inklinasi (ilustratif), jalur digambar pada kerangka yang sama.
        const ring = orbitLine(
          LEARNING.distance(o.orbitModel.parameters.semiMajorAxisAU),
          id === "pluto" ? 0x9a8f80 : 0x6f86b8,
          id.includes("example") ? 0.14 : 0.28,
        );
        ring.rotation.x =
          (o.orbitModel.parameters.inclinationDeg ?? 0) * DEG * 0.5;
        ring.userData.orbitOf = id;
        this.scene.add(ring);
        this.orbits.push(ring);
      }
    }
    // Satelit: orbit di kerangka terpisah dari mesh induk yang berputar harian (instruksi §2).
    for (const [moonId, parentId] of [
      ["moon", "earth"],
      ["titan", "saturn"],
    ] as const) {
      const m = getObj(moonId);
      const parent = this.bodies.get(parentId)!;
      const frame = new THREE.Group();
      frame.name = `${moonId}.orbitFrame`;
      // Titan mengorbit di bidang ekuator Saturnus → ikut kemiringan sumbu (bukan putaran awan).
      if (moonId === "titan") frame.rotation.z = parent.axisFrame.rotation.z;
      else
        frame.rotation.x = (m.orbitModel!.parameters.inclinationDeg ?? 0) * DEG;
      parent.orbitAnchor.add(frame);
      const b = createBody(m, ctx, {
        radius: LEARNING.radius(m) * (moonId === "moon" ? 1 : 1),
      });
      frame.add(b.orbitAnchor);
      const line = orbitLine(LEARNING.moonDistance(m), 0x8fa3c8, 0.22, 128);
      frame.add(line);
      this.orbits.push(line);
      this.bodies.set(moonId, b);
      this.moonOrbitFrames.set(moonId, frame);
    }
    this.camera.position.set(0, 26, 46);
    ctx.controls.target.set(0, 0, 0);
    this.poseAll();
  }

  /** Hitung pose semua benda dari waktu simulasi absolut (tidak akumulatif). */
  private poseAll() {
    const { days, spinSeconds } = this.ctx.clock;
    for (const [id, b] of this.bodies) {
      const o = b.obj;
      const p = o.orbitModel?.parameters;
      if (p?.semiMajorAxisAU) {
        const a = orbitAngle(o, days);
        const d = LEARNING.distance(p.semiMajorAxisAU);
        const inc = (p.inclinationDeg ?? 0) * DEG * 0.5;
        b.orbitAnchor.position
          .set(Math.cos(a) * d, 0, -Math.sin(a) * d)
          .applyAxisAngle(new THREE.Vector3(1, 0, 0), inc);
      } else if (p?.parentDistanceKm) {
        const a = orbitAngle(o, days);
        const d = LEARNING.moonDistance(o);
        b.orbitAnchor.position.set(Math.cos(a) * d, 0, -Math.sin(a) * d);
      }
      // Rotasi: satelit sinkron menghadapkan sisi yang sama ke induk (dihitung dari sudut orbit).
      if (o.spinModel?.direction === "sinkron")
        b.spin.rotation.y = orbitAngle(o, days) + Math.PI;
      else b.spin.rotation.y = spinAngle(o, spinSeconds);
      if (id === "earth" && b.clouds) b.clouds.rotation.y = spinSeconds * 0.01; // awan bergeser pelan (ilustrasi)
    }
    this.sunPos.set(0, 0, 0);
    for (const [, b] of this.bodies) b.setSun(this.sunPos);
  }

  update(dt: number, ctx: EngineCtx) {
    this.poseAll();
    this.tour?.update(dt);
    for (const o of this.orbits) o.visible = this.showOrbits;
    // Kamera mengikuti objek terfokus yang sedang mengorbit (geser kamera & target sebesar perpindahannya).
    if (this.focusId) {
      const b = this.bodies.get(this.focusId);
      if (b) {
        const now = b.orbitAnchor.getWorldPosition(this.tmp);
        const delta = now.clone().sub(this.followPrev);
        if (delta.lengthSq() > 0 && delta.lengthSq() < 100) {
          this.camera.position.add(delta);
          ctx.controls.target.add(delta);
        }
        this.followPrev.copy(now);
      }
    }
    // Mode inspeksi: cahaya bantu halus tanpa menghapus sisi malam.
    this.fill.intensity = this.inspect ? 0.14 : 0.05;
  }

  /** Radius framing objek (termasuk cincin). */
  frameRadius(id: string) {
    return this.bodies.get(id)?.frameRadius ?? 1;
  }

  /** Fokuskan kamera ke objek: transisi ~900 ms, dapat dibatalkan input; token terbaru menang. */
  async focus(
    id: string | null,
    engineFly: (
      pos: THREE.Vector3,
      target: THREE.Vector3,
      ms?: number,
    ) => Promise<boolean>,
  ) {
    const token = ++this.focusToken;
    if (!id) {
      this.focusId = null;
      this.inspect = false;
      return engineFly(
        new THREE.Vector3(0, 26, 46),
        new THREE.Vector3(0, 0, 0),
        1000,
      );
    }
    const b = this.bodies.get(id);
    if (!b) return false;
    this.focusId = id;
    this.inspect = true;
    const target = b.orbitAnchor.getWorldPosition(new THREE.Vector3());
    this.followPrev.copy(target);
    // Cincin sudah melebarkan frameRadius; globe polos diberi ruang lebih agar tidak memenuhi layar.
    // Objek mengisi ±30–40% area terlihat: lega untuk melihatnya berputar dan konteks di sekitarnya.
    const dist =
      (b.frameRadius / Math.sin(this.ctx.fitHalfFov())) * (b.rings ? 1.9 : 3);
    // Sudut pandang dari sisi yang tersinari & sedikit di atas bidang (cincin terbaca).
    const fromSun = target.clone().normalize();
    if (fromSun.lengthSq() < 0.5) fromSun.set(0, 0, 1);
    const side = new THREE.Vector3(0, 1, 0).cross(fromSun).normalize();
    const dir = fromSun
      .clone()
      .multiplyScalar(-0.75)
      .add(side.multiplyScalar(0.55))
      .add(new THREE.Vector3(0, 0.38, 0))
      .normalize();
    const pos = target.clone().add(dir.multiplyScalar(dist));
    this.ctx.controls.minDistance = b.radius * 1.3;
    this.ctx.controls.maxDistance = Math.max(dist * 3, 20);
    // Tekstur detail dimuat lazy; hasil lama diabaikan bila pengguna sudah memilih objek lain.
    b.loadDetail(this.ctx).catch(() => {
      if (token === this.focusToken)
        this.ctx.assetStatus(`detail:${id}`, "error");
    });
    return engineFly(pos, target, 950);
  }

  private applied = { focus: "" as string | null, refocus: -1, venus: "awan" };

  apply(st: AngkasaState) {
    this.showOrbits = st.showOrbits;
    if (st.mode === "tur") {
      if (!this.tour) {
        this.focusId = null;
        this.inspect = false;
        this.tour = new TourController(this, this.ctx);
        this.tourApplied = -1;
        this.applied.focus = "__tur";
      }
      if (st.tourIndex !== this.tourApplied) {
        this.tourApplied = st.tourIndex;
        this.tour.go(st.tourIndex);
      }
      this.tour.setPlaying(st.tourPlaying);
      return;
    }
    if (this.tour) {
      this.tour.dispose();
      this.tour = null;
      this.resetOverview();
    }
    const objId =
      st.mode === "planet" && st.selectedId && this.bodies.has(st.selectedId)
        ? st.selectedId
        : null;
    if (
      objId !== this.applied.focus ||
      st.refocusNonce !== this.applied.refocus
    ) {
      this.applied.focus = objId;
      this.applied.refocus = st.refocusNonce;
      if (!objId) this.resetOverview();
      void this.focus(objId, this.ctx.flyTo);
    }
    if (st.venusView !== this.applied.venus) {
      this.applied.venus = st.venusView;
      void this.setVariant(
        "venus",
        st.venusView === "radar" ? "radar" : "awan",
      );
    }
  }

  scaleNote(st: AngkasaState) {
    const rot = st.spinOn ? " · Rotasi diperlambat" : "";
    return `Tampilan belajar: ukuran dan jarak disederhanakan${rot}`;
  }

  resetOverview() {
    this.ctx.controls.minDistance = 0.3;
    this.ctx.controls.maxDistance = 140;
  }

  pickables() {
    const list: THREE.Object3D[] = [];
    for (const [, b] of this.bodies) {
      list.push(b.surface);
      if (b.rings) list.push(b.rings);
      // proxy hanya di ringkasan (di mode planet, objek sudah besar)
      if (!this.inspect || b.id === "moon" || b.id === "titan")
        list.push(b.proxy);
    }
    return list;
  }

  occluders() {
    return [...this.bodies.values()].map((b) => b.surface);
  }

  labels(): LabelSpec[] {
    const out: LabelSpec[] = [];
    const focus = this.focusId;
    const tourId = this.tour?.targetId;
    for (const [id, b] of this.bodies) {
      const o = b.obj;
      if (this.tour) {
        // Tur: hanya objek yang disinggahi (dan satelitnya); bidikan lebar menampilkan semua objek utama.
        if (
          tourId
            ? id !== tourId && o.parentId !== tourId
            : id === "moon" || id === "titan"
        )
          continue;
      } else if (focus) {
        // Mode planet: label objek terfokus disembunyikan (nama ada di panel), tampilkan anak & bagian.
        const isChild = o.parentId === focus;
        if (!isChild) continue;
      } else if (id === "moon" || id === "titan") continue;
      out.push({
        id,
        text: o.nameId,
        pickId: id,
        priority:
          id === "sun"
            ? 10
            : o.classification === "Ilustrasi benda kecil"
              ? 1
              : 5,
        kind: "object",
        world: (v) =>
          b.orbitAnchor
            .getWorldPosition(v)
            .add(new THREE.Vector3(0, b.frameRadius * 1.15 + 0.08, 0)),
      });
    }
    if (focus === "saturn") {
      const s = this.bodies.get("saturn")!;
      out.push({
        id: "saturn.rings",
        text: "Cincin Saturnus",
        pickId: "saturn.rings",
        priority: 8,
        kind: "part",
        world: (v) => {
          // titik di cincin B (bidang ekuator), sisi kiri-depan
          const p = new THREE.Vector3(-s.radius * 1.75, 0, s.radius * 0.6);
          return s.axisFrame.localToWorld(v.copy(p));
        },
      });
    }
    return out;
  }

  /** Posisi dunia objek untuk UI. */
  worldOf(id: string, out = new THREE.Vector3()) {
    const b = this.bodies.get(id);
    return b ? b.orbitAnchor.getWorldPosition(out) : out.set(0, 0, 0);
  }

  setVariant(id: string, v: string) {
    return this.bodies.get(id)?.setVariant?.(v, this.ctx);
  }

  dispose() {
    this.tour?.dispose();
    this.tour = null;
    for (const [, b] of this.bodies) b.dispose();
    disposeTree(this.scene);
    this.scene.clear();
    this.bodies.clear();
  }
}

export const SOLAR_OBJECT_IDS = SYSTEM_IDS;
export const ALL_EXPLORABLE = MANIFEST.objects
  .filter((o: AngkasaObject) => o.id !== "milky-way")
  .map((o) => o.id);
