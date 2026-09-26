// View Bandingkan (PRD §4D, §6 no. 2–3; instruksi §6).
// • Ukuran: globe bertekstur sebenarnya, SATU faktor skala untuk semua radius rata-rata (sizeScale), disusun
//   berdampingan (layout saja, bukan jarak orbit). Kamera ortografis → objek dekat tidak tampak lebih besar.
//   Fit-to-view hanya mengubah framing kamera, tidak pernah rasio. Cincin Saturnus dapat disembunyikan dan
//   tidak termasuk diameter tubuh planet.
// • Jarak: sumbu dari Matahari dengan SATU pemetaan jarak rata-rata (AU) → posisi (linear/log berlabel).
//   Penanda berupa ikon seragam yang diperbesar — bukan ukuran planet.

import * as THREE from "three";
import {
  axisMaxAU,
  axisTicks,
  distRows,
  distScaleLabel,
  fmtAU,
  fmtKm,
  meanDistanceAU,
  sizeLayout,
  sizeRows,
  useCompareUi,
  type SizeSlot,
} from "@/lib/angkasa/compare";
import { getObj } from "@/lib/angkasa/manifest";
import { distanceMap } from "@/lib/angkasa/sim";
import type { AngkasaState } from "@/lib/angkasa/state";
import { createBody, type Body } from "./bodies";
import { disposeTree, type EngineCtx, type LabelSpec } from "./core";
import type { ModeView } from "./views";

/** panjang sumbu jarak (unit scene) */
const AXIS_LEN = 10;
/** radius ikon penanda jarak (unit scene) — seragam untuk semua objek */
const ICON_R = 0.16;
/** perkiraan setengah lebar label (px) — sama dengan perkiraan anti-tabrakan di core.ts */
const halfLabelPx = (text: string) => Math.min(180, text.length * 7.2 + 18) / 2;
/** arah cahaya seragam (depan-kiri-atas) untuk semua globe */
const LIGHT_DIR = new THREE.Vector3(-3, 2, 5).normalize();

interface Anim {
  p0: THREE.Vector3;
  p1: THREE.Vector3;
  t0: THREE.Vector3;
  t1: THREE.Vector3;
  z0: number;
  z1: number;
  start: number;
  ms: number;
}

interface Marker {
  id: string;
  x: number;
  y: number;
  text: string;
}

export class CompareView implements ModeView {
  name = "compare";
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-5, 5, 3, -3, 0.1, 1000);
  controlsConfig = {
    enableRotate: true,
    enablePan: true,
    enableZoom: true,
    minPolarAngle: 0.45,
    maxPolarAngle: Math.PI - 0.45,
  };

  private ctx!: EngineCtx;
  private sizeRoot = new THREE.Group();
  private distRoot = new THREE.Group();
  private bodies = new Map<string, Body>();
  private slots: SizeSlot[] = [];
  private markers: Marker[] = [];
  private ticks: number[] = [];
  private tickX = new Map<number, number>();
  private kind: "ukuran" | "jarak" = "ukuran";
  private scale: "linear" | "log" = "linear";
  private ids: string[] = [];
  private key = "";
  private w = 1;
  private h = 1;
  /** framing fit-to-view (pusat & setengah lebar/tinggi yang harus terlihat) */
  private fit = { cx: 0, cy: 0, halfW: 3, halfH: 2 };
  private anim: Anim | null = null;
  private light = new THREE.DirectionalLight(0xffffff, 2.4);
  private ambient = new THREE.AmbientLight(0xb8c4dc, 0.45);
  private sunWorld = LIGHT_DIR.clone().multiplyScalar(1000);
  private unsubRings: (() => void) | null = null;
  private prevZoom = { min: 0, max: Infinity };

  start(ctx: EngineCtx) {
    this.ctx = ctx;
    this.light.position.copy(LIGHT_DIR).multiplyScalar(50);
    this.scene.add(this.light, this.ambient, this.sizeRoot, this.distRoot);
    this.prevZoom = { min: ctx.controls.minZoom, max: ctx.controls.maxZoom };
    ctx.controls.minZoom = 0.25;
    ctx.controls.maxZoom = 600;
    ctx.controls.addEventListener("start", this.cancelAnim);
    this.unsubRings = useCompareUi.subscribe(() => {
      if (this.kind === "ukuran") this.layoutSize(true);
    });
  }

  private cancelAnim = () => {
    this.anim = null;
  };

  /* ---------------- state ---------------- */

  apply(st: AngkasaState) {
    const ids = st.compareIds.filter((id) => {
      try {
        return !!getObj(id);
      } catch {
        return false;
      }
    });
    const key = `${st.compareKind}|${st.distScale}|${ids.join(",")}`;
    if (key === this.key) return;
    const kindChanged = st.compareKind !== this.kind || !this.key;
    this.key = key;
    this.kind = st.compareKind;
    this.scale = st.distScale;
    this.ids = ids;
    this.anim = null;
    // Jarak: sumbu datar, tanpa rotasi; Ukuran: globe boleh diputar (kamera tetap ortografis).
    this.ctx.controls.enableRotate = this.kind === "ukuran";
    if (this.kind === "ukuran") {
      this.clearDist();
      this.buildSize();
    } else {
      this.clearSize();
      this.buildDist();
    }
    this.fitView(kindChanged);
  }

  scaleNote(st: AngkasaState) {
    if (st.compareKind === "jarak") {
      return `Jarak rata-rata dari Matahari (AU) · ${distScaleLabel(st.distScale)} · Penanda diperbesar — bukan ukuran planet · Jarak rata-rata ≠ jarak saat ini`;
    }
    const ring = st.compareIds.includes("saturn")
      ? useCompareUi.getState().rings
        ? " · Cincin Saturnus tampil, tidak termasuk diameter"
        : " · Cincin Saturnus disembunyikan"
      : "";
    return `Skala sebenarnya: semua diameter memakai satu faktor (radius rata-rata) · Susunan hanya tata letak, bukan jarak${ring}`;
  }

  /* ---------------- ukuran ---------------- */

  private buildSize() {
    const rows = sizeRows(this.ids);
    const wanted = new Set(rows.map((r) => r.id));
    // buang globe yang tidak dipilih lagi
    for (const [id, b] of this.bodies) {
      if (!wanted.has(id)) {
        this.sizeRoot.remove(b.orbitAnchor);
        b.dispose();
        this.bodies.delete(id);
      }
    }
    for (const r of rows) {
      let b = this.bodies.get(r.id);
      // radius render berubah bila objek terbesar berubah → buat ulang dengan faktor baru
      if (b && Math.abs(b.radius - r.render) > 1e-9) {
        this.sizeRoot.remove(b.orbitAnchor);
        b.dispose();
        b = undefined;
      }
      if (!b) {
        b = createBody(getObj(r.id), this.ctx, {
          radius: r.render,
          detailLayers: false, // tanpa awan/atmosfer tambahan: tepi globe = diameter data
          hi: !this.ctx.lowPower,
          segments: this.ctx.lowPower ? 48 : 64,
        });
        // pendar Matahari tidak boleh membuatnya tampak lebih besar dari diameter data
        b.orbitAnchor.traverse((o) => {
          if (o instanceof THREE.Sprite) o.visible = false;
        });
        b.proxy.visible = false;
        this.bodies.set(r.id, b);
        this.sizeRoot.add(b.orbitAnchor);
      }
    }
    this.layoutSize(false);
  }

  private layoutSize(refit: boolean) {
    const rings = useCompareUi.getState().rings;
    const items = this.ids
      .map((id) => this.bodies.get(id))
      .filter((b): b is Body => !!b)
      .map((b) => {
        if (b.rings) b.rings.visible = rings;
        return {
          id: b.id,
          radius: b.radius,
          frame: b.rings && rings ? b.frameRadius : b.radius,
        };
      });
    const lay = sizeLayout(items);
    this.slots = lay.slots;
    for (const s of lay.slots)
      this.bodies.get(s.id)!.orbitAnchor.position.set(s.x, 0, 0);
    // ruang di bawah untuk label
    this.fit = {
      cx: 0,
      cy: -lay.maxFrame * 0.22,
      halfW: lay.width / 2 + lay.maxFrame * 0.25,
      halfH: lay.maxFrame * 1.55,
    };
    if (refit) this.fitView(false);
  }

  private clearSize() {
    for (const [, b] of this.bodies) {
      this.sizeRoot.remove(b.orbitAnchor);
      b.dispose();
    }
    this.bodies.clear();
    this.slots = [];
  }

  /* ---------------- jarak ---------------- */

  private buildDist() {
    this.clearDist();
    const log = this.scale === "log";
    const maxAU = axisMaxAU(this.ids);
    // SATU pemetaan untuk tanda sumbu dan penanda objek
    const map = distanceMap(this.scale, maxAU);
    const rows = new Map(distRows(this.ids).map((r) => [r.id, r]));
    const sunX = log ? -0.7 : 0; // skala log tidak memuat 0 AU: Matahari di luar pangkal sumbu
    const x0 = 0;

    const lineMat = new THREE.LineBasicMaterial({
      color: 0xaab6d3,
      transparent: true,
      opacity: 0.85,
    });
    const axisPts = [
      new THREE.Vector3(log ? sunX : x0, 0, 0),
      new THREE.Vector3(AXIS_LEN, 0, 0),
    ];
    this.distRoot.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(axisPts),
        lineMat,
      ),
    );

    // tanda satuan AU (dari pemetaan yang sama dengan penanda)
    this.ticks = axisTicks(this.scale, maxAU);
    this.tickX.clear();
    const tickPts: THREE.Vector3[] = [];
    for (const v of this.ticks) {
      const x = x0 + map(v) * AXIS_LEN;
      this.tickX.set(v, x);
      tickPts.push(
        new THREE.Vector3(x, -0.12, 0),
        new THREE.Vector3(x, 0.12, 0),
      );
    }
    const tickMat = new THREE.LineBasicMaterial({
      color: 0xaab6d3,
      transparent: true,
      opacity: 0.7,
    });
    this.distRoot.add(
      new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints(tickPts),
        tickMat,
      ),
    );
    if (log) {
      // tanda patahan sumbu antara Matahari (0 AU) dan pangkal skala log (0,2 AU)
      const brk = [
        new THREE.Vector3(-0.32, -0.14, 0),
        new THREE.Vector3(-0.22, 0.14, 0),
        new THREE.Vector3(-0.2, -0.14, 0),
        new THREE.Vector3(-0.1, 0.14, 0),
      ];
      this.distRoot.add(
        new THREE.LineSegments(
          new THREE.BufferGeometry().setFromPoints(brk),
          tickMat,
        ),
      );
    }

    // penanda: ikon seragam, posisi x tepat dari data; penanda yang berdekatan ditumpuk ke atas
    const items = this.ids
      .filter((id) => id !== "sun")
      .map((id) => ({ id, x: x0 + map(meanDistanceAU(id).au) * AXIS_LEN }))
      .sort((a, b) => a.x - b.x);
    const placed: { x: number; level: number }[] = [];
    const circle = new THREE.CircleGeometry(ICON_R, 40);
    const ring = new THREE.RingGeometry(ICON_R * 1.02, ICON_R * 1.28, 40);
    const stemPts: THREE.Vector3[] = [];
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
    });
    this.markers = [];
    const addIcon = (
      id: string,
      x: number,
      y: number,
      color: THREE.ColorRepresentation,
    ) => {
      const g = new THREE.Group();
      const disc = new THREE.Mesh(
        circle,
        new THREE.MeshBasicMaterial({ color }),
      );
      disc.userData.pickId = id;
      const outline = new THREE.Mesh(ring, ringMat);
      g.add(disc, outline);
      g.position.set(x, y, 0.01);
      this.distRoot.add(g);
    };

    for (const it of items) {
      let level = 0;
      while (
        placed.some(
          (p) => p.level === level && Math.abs(p.x - it.x) < ICON_R * 2.7,
        )
      )
        level++;
      placed.push({ x: it.x, level });
      const y = 0.55 + level * ICON_R * 2.9;
      stemPts.push(
        new THREE.Vector3(it.x, 0, 0),
        new THREE.Vector3(it.x, y - ICON_R * 1.3, 0),
      );
      const o = getObj(it.id);
      addIcon(it.id, it.x, y, o.texture.base);
      const r = rows.get(it.id)!;
      const via = r.viaParent ? ` (ikut ${getObj(r.viaParent).nameId})` : "";
      this.markers.push({
        id: it.id,
        x: it.x,
        y,
        text: `${o.nameId}${via} · ${fmtAU(r.au)} AU`,
      });
    }
    // Matahari = titik acuan (0 AU), selalu tampil
    addIcon("sun", sunX, 0, getObj("sun").texture.base);
    this.markers.push({
      id: "sun",
      x: sunX,
      y: 0,
      text: "Matahari · 0 AU (titik acuan)",
    });

    const stemMat = new THREE.LineBasicMaterial({
      color: 0xdde4f5,
      transparent: true,
      opacity: 0.55,
    });
    if (stemPts.length)
      this.distRoot.add(
        new THREE.LineSegments(
          new THREE.BufferGeometry().setFromPoints(stemPts),
          stemMat,
        ),
      );

    const top = Math.max(0.6, ...this.markers.map((m) => m.y)) + ICON_R * 3;
    const left = sunX - 0.6;
    const right = AXIS_LEN + 0.6;
    this.fit = {
      cx: (left + right) / 2,
      cy: (top - 1.1) / 2,
      halfW: (right - left) / 2,
      halfH: (top + 1.1) / 2,
    };
  }

  private clearDist() {
    disposeTree(this.distRoot);
    this.distRoot.clear();
    this.markers = [];
    this.ticks = [];
    this.tickX.clear();
  }

  /* ---------------- kamera ---------------- */

  /** Fit-to-view: hanya framing kamera (tidak mengubah rasio antarobjek). */
  fitView(resetCamera = true) {
    const aspect = this.w / this.h;
    const f = this.fit;
    const halfH = Math.max(f.halfH, (f.halfW * 1.08) / aspect) * 1.06;
    this.setFrustum(halfH);
    const pos = new THREE.Vector3(f.cx, f.cy, 100);
    const target = new THREE.Vector3(f.cx, f.cy, 0);
    if (resetCamera) {
      this.anim = null;
      this.camera.position.copy(pos);
      this.camera.zoom = 1;
      this.camera.updateProjectionMatrix();
      this.ctx.controls.target.copy(target);
      this.ctx.controls.update();
    } else {
      this.animateTo(pos, target, 1);
    }
  }

  /** Perbesar ke satu objek (mis. objek kecil di samping Matahari). null = lihat semua. */
  focusOn(id: string | null) {
    if (!id) return this.fitView(false);
    const halfH = this.camera.top;
    if (this.kind === "ukuran") {
      const s = this.slots.find((x) => x.id === id);
      if (!s) return;
      const zoom = Math.min(
        this.ctx.controls.maxZoom,
        Math.max(1, halfH / (s.frame * 2.2)),
      );
      this.animateTo(
        new THREE.Vector3(s.x, -s.frame * 0.25, 100),
        new THREE.Vector3(s.x, -s.frame * 0.25, 0),
        zoom,
        true,
      );
    } else {
      const m = this.markers.find((x) => x.id === id);
      if (!m) return;
      const y = Math.max(0.3, m.y / 2);
      this.animateTo(
        new THREE.Vector3(m.x, y, 100),
        new THREE.Vector3(m.x, y, 0),
        Math.max(1, halfH / 1.4),
        true,
      );
    }
  }

  private animateTo(
    pos: THREE.Vector3,
    target: THREE.Vector3,
    zoom: number,
    keepDir = false,
  ) {
    const c = this.ctx.controls;
    // posisi kamera mempertahankan arah pandang saat ini (bila diputar) agar tidak melompat
    if (keepDir) {
      const dir = this.camera.position.clone().sub(c.target).setLength(100);
      pos = target.clone().add(dir);
    }
    if (this.ctx.reducedMotion()) {
      this.camera.position.copy(pos);
      c.target.copy(target);
      this.camera.zoom = zoom;
      this.camera.updateProjectionMatrix();
      c.update();
      this.anim = null;
      return;
    }
    this.anim = {
      p0: this.camera.position.clone(),
      p1: pos.clone(),
      t0: c.target.clone(),
      t1: target.clone(),
      z0: this.camera.zoom,
      z1: zoom,
      start: performance.now(),
      ms: 700,
    };
  }

  private setFrustum(halfH: number) {
    const aspect = this.w / this.h;
    this.camera.top = halfH;
    this.camera.bottom = -halfH;
    this.camera.left = -halfH * aspect;
    this.camera.right = halfH * aspect;
    this.camera.updateProjectionMatrix();
  }

  onResize(w: number, h: number) {
    this.w = w;
    this.h = h;
    // pertahankan zoom/geser pengguna; hanya perbarui frustum agar semua tetap muat saat zoom = 1
    const f = this.fit;
    this.setFrustum(Math.max(f.halfH, (f.halfW * 1.08) / (w / h)) * 1.06);
  }

  update() {
    const a = this.anim;
    if (a) {
      const t = Math.min(1, (performance.now() - a.start) / a.ms);
      const k = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      this.camera.position.lerpVectors(a.p0, a.p1, k);
      this.ctx.controls.target.lerpVectors(a.t0, a.t1, k);
      // zoom diinterpolasi secara logaritmik agar perbesaran besar terasa halus
      this.camera.zoom = Math.exp(
        Math.log(a.z0) + (Math.log(a.z1) - Math.log(a.z0)) * k,
      );
      this.camera.updateProjectionMatrix();
      if (t >= 1) this.anim = null;
    }
    for (const [, b] of this.bodies) b.setSun(this.sunWorld);
  }

  /* ---------------- pemilihan & label ---------------- */

  pickables() {
    if (this.kind === "ukuran") {
      const out: THREE.Object3D[] = [];
      for (const [, b] of this.bodies) out.push(b.surface);
      return out;
    }
    return [this.distRoot];
  }

  occluders() {
    return [];
  }

  /** unit dunia per piksel layar (untuk offset label) */
  private upp() {
    return (
      (this.camera.top - this.camera.bottom) /
      this.camera.zoom /
      Math.max(1, this.h)
    );
  }

  labels(): LabelSpec[] {
    const out: LabelSpec[] = [];
    if (this.kind === "ukuran") {
      const rows = new Map(sizeRows(this.ids).map((r) => [r.id, r]));
      const rings = useCompareUi.getState().rings;
      this.slots.forEach((s, i) => {
        const r = rows.get(s.id);
        if (!r) return;
        const text = `${r.name} · ${fmtKm(r.diameterKm)} km`;
        out.push({
          id: `cmp.${s.id}`,
          text,
          pickId: s.id,
          priority: i === 0 ? 9 : 8 - i,
          kind: "object",
          alwaysVisible: true,
          // di bawah globe; baris berselang agar label objek kecil yang berdekatan tidak bertumpuk
          world: (v) =>
            v.set(
              s.x - (halfLabelPx(text) - 8) * this.upp(),
              -s.radius - (16 + (i % 2) * 28) * this.upp(),
              0,
            ),
        });
        if (s.id === "saturn" && rings) {
          const b = this.bodies.get("saturn");
          out.push({
            id: "cmp.saturn.rings",
            text: "Cincin — tidak termasuk diameter",
            priority: 3,
            kind: "note",
            alwaysVisible: true,
            world: (v) =>
              v.set(
                s.x + (b?.frameRadius ?? s.frame) * 0.55,
                s.radius + 18 * this.upp(),
                0,
              ),
          });
        }
      });
      return out;
    }
    for (const m of this.markers) {
      out.push({
        id: `cmp.d.${m.id}`,
        text: m.text,
        pickId: m.id,
        priority: m.id === "sun" ? 9 : 7,
        kind: "object",
        alwaysVisible: true,
        world: (v) =>
          v.set(
            m.x - (halfLabelPx(m.text) - 8) * this.upp(),
            m.y + ICON_R + 14 * this.upp(),
            0,
          ),
      });
    }
    for (const t of this.ticks) {
      const x = this.tickX.get(t)!;
      out.push({
        id: `cmp.t.${t}`,
        text: `${fmtAU(t)} AU`,
        priority: t === 0 ? 3 : 1,
        kind: "note",
        alwaysVisible: true,
        world: (v) => v.set(x - 10 * this.upp(), -0.12 - 18 * this.upp(), 0),
      });
    }
    out.push({
      id: "cmp.scale",
      text:
        this.scale === "log"
          ? "Skala logaritmik — jarak antartanda tidak sama"
          : "Skala linear — 1 AU selalu sama panjang",
      priority: 10,
      kind: "note",
      alwaysVisible: true,
      world: (v) => v.set(AXIS_LEN / 2 - 1.6, -0.12 - 50 * this.upp(), 0),
    });
    return out;
  }

  dispose() {
    this.unsubRings?.();
    this.unsubRings = null;
    if (this.ctx) {
      this.ctx.controls.removeEventListener("start", this.cancelAnim);
      this.ctx.controls.minZoom = this.prevZoom.min;
      this.ctx.controls.maxZoom = this.prevZoom.max;
      this.ctx.controls.enableRotate = true;
    }
    for (const [, b] of this.bodies) b.dispose();
    this.bodies.clear();
    this.clearDist();
    disposeTree(this.scene);
    this.scene.clear();
  }
}
