// View Struktur: Bumi (kerak, mantel, inti luar, inti dalam) dan Saturnus (model interpretasi) sebagai
// cangkang tertutup dengan satu oktan terpotong (wedge) + muka penampang berwarna kode pendidikan.
// Pemisahan: rest + offset terkurasi × (pisah/100), dihitung ABSOLUT tiap apply (lib/angkasa/structure.ts).
// Skala: model pendidikan (ketebalan kerak diperbesar; batas Saturnus bukan hasil pengamatan langsung).

import * as THREE from "three";
import { OBJ, PART } from "@/lib/angkasa/manifest";
import type { AngkasaState } from "@/lib/angkasa/state";
import {
  CONTEXT_PARTS,
  EXPLODE_DIR,
  LAYERS,
  crustExaggeration,
  labelAnchor,
  layerColorAt,
  partPosition,
  ringFracs,
  visualShells,
  type Shell,
  type StructureObj,
  type Vec3,
} from "@/lib/angkasa/structure";
import { starfield } from "./bodies";
import { disposeTree, type EngineCtx, type LabelSpec } from "./core";
import type { ModeView } from "./views";

const HALF_PI = Math.PI / 2;
/** arah kamera awal: melihat ke dalam oktan yang terpotong, sedikit menyamping agar jalur pisah terbaca */
const CAM_DIR = new THREE.Vector3(1, 0.62, 0.42).normalize();
const FOV = 40;
/** geser peta Bumi agar Indonesia berada di sisi yang terlihat (di samping potongan) */
const EARTH_U_SHIFT = 0.277;
const HIGHLIGHT = new THREE.Color(0xff7f67);
const TEX: Record<StructureObj, string> = {
  earth: "/angkasa/tex/2k_earth_daymap.jpg",
  saturn: OBJ.get("saturn")?.texture.hi ?? "/angkasa/tex/2k_saturn.jpg",
};

/* ---------------- geometri ---------------- */

/**
 * Potongan permukaan bola (konvensi SphereGeometry three.js) dengan UV equirectangular sebenarnya:
 * u = φ/2π + shift (boleh > 1 → tekstur RepeatWrapping), v = 1 − θ/π.
 */
function spherePatch(
  r: number,
  phi0: number,
  phi1: number,
  th0: number,
  th1: number,
  ws: number,
  hs: number,
  uShift = 0,
) {
  const pos: number[] = [];
  const nor: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  const grid: number[][] = [];
  let n = 0;
  for (let iy = 0; iy <= hs; iy++) {
    const th = th0 + ((th1 - th0) * iy) / hs;
    const row: number[] = [];
    for (let ix = 0; ix <= ws; ix++) {
      const ph = phi0 + ((phi1 - phi0) * ix) / ws;
      const x = -Math.cos(ph) * Math.sin(th);
      const y = Math.cos(th);
      const z = Math.sin(ph) * Math.sin(th);
      pos.push(x * r, y * r, z * r);
      nor.push(x, y, z);
      uv.push(ph / (Math.PI * 2) + uShift, 1 - th / Math.PI);
      row.push(n++);
    }
    grid.push(row);
  }
  for (let iy = 0; iy < hs; iy++)
    for (let ix = 0; ix < ws; ix++) {
      const a = grid[iy][ix + 1];
      const b = grid[iy][ix];
      const c = grid[iy + 1][ix];
      const d = grid[iy + 1][ix + 1];
      if (iy !== 0 || th0 > 0) idx.push(a, b, d);
      if (iy !== hs - 1 || th1 < Math.PI) idx.push(b, c, d);
    }
  return { pos, nor, uv, idx };
}

type Patch = ReturnType<typeof spherePatch>;

function toGeometry(parts: Patch[], colors?: number[]) {
  const pos: number[] = [];
  const nor: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  for (const p of parts) {
    const base = pos.length / 3;
    pos.push(...p.pos);
    nor.push(...p.nor);
    uv.push(...p.uv);
    for (const i of p.idx) idx.push(i + base);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  if (colors)
    g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  g.setIndex(idx);
  g.computeBoundingSphere();
  return g;
}

/**
 * Bola tanpa oktan x, y, z > 0: belahan atas tanpa φ ∈ [π/2, π] + belahan bawah utuh.
 * (Oktan x>0, z>0 pada konvensi three.js = φ ∈ (π/2, π).)
 */
function cutSphere(r: number, ws: number, uShift = 0) {
  const hs = ws / 2;
  return toGeometry([
    spherePatch(
      r,
      Math.PI,
      Math.PI * 2.5,
      0,
      HALF_PI,
      Math.round(ws * 0.75),
      hs / 2,
      uShift,
    ),
    spherePatch(r, 0, Math.PI * 2, HALF_PI, Math.PI, ws, hs / 2, uShift),
  ]);
}

/** Oktan yang dipotong (penutup/lid) — permukaan luarnya saja. */
function octantPatch(r: number, ws: number, uShift = 0) {
  return toGeometry([
    spherePatch(
      r,
      HALF_PI,
      Math.PI,
      0,
      HALF_PI,
      Math.round(ws / 4),
      ws / 4,
      uShift,
    ),
  ]);
}

/**
 * Muka penampang: tiga seperempat-anulus di bidang x=0, y=0, z=0 yang menghadap oktan terbuka.
 * Warna per-verteks mengikuti radius (Saturnus: gradasi di batas lapisan).
 */
function capsGeometry(
  inner: number,
  outer: number,
  colorAt: (r: number) => Vec3,
  radial = 12,
  ang = 16,
) {
  const faces: [Vec3, Vec3, Vec3][] = [
    [
      [0, 1, 0],
      [0, 0, 1],
      [1, 0, 0],
    ], // x = 0 → normal +x
    [
      [0, 0, 1],
      [1, 0, 0],
      [0, 1, 0],
    ], // y = 0 → normal +y
    [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ], // z = 0 → normal +z
  ];
  const pos: number[] = [];
  const nor: number[] = [];
  const uv: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];
  const tmp = new THREE.Color();
  for (const [U, V, N] of faces) {
    const base = pos.length / 3;
    for (let i = 0; i <= radial; i++) {
      const r = inner + ((outer - inner) * i) / radial;
      const [cr, cg, cb] = colorAt(r);
      tmp.setRGB(cr, cg, cb, THREE.SRGBColorSpace); // sRGB → linear kerja
      for (let j = 0; j <= ang; j++) {
        const a = (HALF_PI * j) / ang;
        const c = Math.cos(a) * r;
        const s = Math.sin(a) * r;
        pos.push(U[0] * c + V[0] * s, U[1] * c + V[1] * s, U[2] * c + V[2] * s);
        nor.push(...N);
        uv.push(outer ? r / outer : 0, j / ang);
        col.push(tmp.r, tmp.g, tmp.b);
      }
    }
    // U × V = N → urutan (r0,a0) → (r1,a0) → (r1,a1) → (r0,a1) berlawanan jarum jam dilihat dari N
    for (let i = 0; i < radial; i++)
      for (let j = 0; j < ang; j++) {
        const p00 = base + i * (ang + 1) + j;
        const p10 = p00 + ang + 1;
        const p11 = p10 + 1;
        const p01 = p00 + 1;
        idx.push(p00, p10, p11, p00, p11, p01);
      }
  }
  return toGeometry([{ pos, nor, uv, idx }], col);
}

/** Anulus cincin dengan UV radial (u = 0 tepi dalam → 1 tepi luar), di bidang ekuator. */
function ringGeometry(inner: number, outer: number, segs: number) {
  const geo = new THREE.RingGeometry(inner, outer, segs, 1);
  const p = geo.attributes.position as THREE.BufferAttribute;
  const uv = geo.attributes.uv as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    uv.setXY(i, (v.length() - inner) / (outer - inner), 0.5);
  }
  geo.rotateX(-HALF_PI);
  return geo;
}

/* ---------------- bagian ---------------- */

interface PartRig {
  id: string;
  group: THREE.Group;
  shell: Shell | null;
  /** radius untuk framing kamera */
  radius: number;
  mats: THREE.MeshStandardMaterial[];
  lid?: THREE.Group;
  lidMats: THREE.MeshStandardMaterial[];
  anchor: Vec3;
}

/** jumlah segmen kelipatan 4 (belahan & oktan harus bulat) */
const seg = (n: number) => Math.max(16, Math.round(n / 4) * 4);
const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export class StructureView implements ModeView {
  name = "structure";
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(FOV, 1, 0.05, 3000);
  controlsConfig = { minDistance: 0.5, maxDistance: 18, enablePan: false };
  private ctx!: EngineCtx;
  private root: THREE.Group | null = null;
  private rigs = new Map<string, PartRig>();
  private obj: StructureObj | null = null;
  private buildToken = 0;
  private ownTex: THREE.Texture[] = [];
  private aspect = 1;
  private framed = false;
  private nonce: string | null = null;
  /** 0 = penutup oktan tertutup, 1 = terbuka */
  private lidT = 0;
  private cur = {
    explode: 0,
    cutaway: true,
    isolated: null as string | null,
    partId: null as string | null,
    labels: true,
  };

  start(ctx: EngineCtx) {
    this.ctx = ctx;
    this.scene.add(starfield(1200));
    // cahaya utama ikut kamera (kiri-atas) agar penampang selalu terbaca + cahaya isi lembut
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(-3, 4, 2.5);
    this.camera.add(key);
    this.scene.add(this.camera);
    this.scene.add(
      new THREE.HemisphereLight(0xe8eeff, 0x2a3346, 0.9),
      new THREE.AmbientLight(0xffffff, 0.18),
    );
    this.camera.position.copy(CAM_DIR).multiplyScalar(this.frameDistance());
    ctx.controls.target.set(0, 0, 0);
  }

  onResize(w: number, h: number) {
    this.aspect = w / Math.max(1, h);
    // framing awal menyesuaikan viewport (ponsel portrait butuh jarak lebih jauh)
    if (!this.framed) {
      this.framed = true;
      this.camera.position.copy(CAM_DIR).multiplyScalar(this.frameDistance());
      this.ctx?.controls.target.set(0, 0, 0);
    }
  }

  /** jarak kamera agar model utuh + ruang pisah 100% masuk bingkai */
  private frameDistance() {
    const extent = this.obj === "saturn" ? 2.5 : 1.9;
    const t = Math.tan(((FOV / 2) * Math.PI) / 180);
    return Math.max(5.6, extent / (t * Math.min(1, this.aspect)));
  }

  frameAll(animated = true) {
    if (!this.ctx) return;
    this.ctx.controls.minDistance = this.controlsConfig.minDistance;
    void this.ctx.flyTo(
      CAM_DIR.clone().multiplyScalar(this.frameDistance()),
      new THREE.Vector3(),
      animated ? 700 : 0,
    );
  }

  /** Fokus kamera ke satu bagian (arah pandang pengguna dipertahankan). */
  focusPart(id: string) {
    const rig = this.rigs.get(id);
    if (!rig || !this.ctx) return;
    const center = rig.group.getWorldPosition(new THREE.Vector3());
    const dir = this.camera.position.clone().sub(this.ctx.controls.target);
    if (dir.lengthSq() < 1e-6) dir.copy(CAM_DIR);
    dir.normalize();
    const t = Math.tan(((FOV / 2) * Math.PI) / 180) * Math.min(1, this.aspect);
    const dist = Math.max(0.7, (rig.radius / t) * 1.3);
    void this.ctx.flyTo(
      center.clone().add(dir.multiplyScalar(dist)),
      center,
      700,
    );
  }

  /* ---------- pembangunan model ---------- */

  private build(obj: StructureObj) {
    this.clearModel();
    const token = ++this.buildToken;
    this.obj = obj;
    const root = new THREE.Group();
    root.name = `structure.${obj}`;
    this.root = root;
    this.scene.add(root);
    const ws = seg(this.ctx.lowPower ? 48 : 72);
    const uShift = obj === "earth" ? EARTH_U_SHIFT : 0;
    const shells = visualShells(obj);
    const texMats: THREE.MeshStandardMaterial[] = [];

    shells.forEach((s, i) => {
      const group = new THREE.Group();
      group.name = s.id;
      group.userData.pickId = s.id;
      const color = new THREE.Color(s.color);
      const mats: THREE.MeshStandardMaterial[] = [];
      const lidMats: THREE.MeshStandardMaterial[] = [];
      const outermost = i === 0;
      const isCore = s.id === "saturn.core";

      // permukaan luar (lapisan terluar memakai peta planet agar terbaca sebagai Bumi/Saturnus)
      const outerMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.85,
        metalness: 0,
      });
      if (isCore) {
        // inti Saturnus: selubung tembus pandang = batas menyebar, bukan tepi tajam
        outerMat.transparent = true;
        outerMat.opacity = 0.42;
        outerMat.depthWrite = false;
      }
      const outer = new THREE.Mesh(cutSphere(s.outer, ws, uShift), outerMat);
      if (isCore) outer.userData.noOcclude = true;
      group.add(outer);
      mats.push(outerMat);
      if (outermost) texMats.push(outerMat);

      if (s.inner > 0) {
        const innerMat = new THREE.MeshStandardMaterial({
          color: color.clone().multiplyScalar(0.72),
          roughness: 0.95,
          side: THREE.BackSide,
        });
        group.add(
          new THREE.Mesh(
            cutSphere(s.inner, seg(ws * Math.max(0.4, s.inner))),
            innerMat,
          ),
        );
        mats.push(innerMat);
      }
      if (isCore) {
        // inti padat yang lebih kecil di dalam selubung menyebar
        const kernelMat = new THREE.MeshStandardMaterial({
          color,
          roughness: 0.9,
        });
        group.add(new THREE.Mesh(cutSphere(s.outer * 0.62, 32), kernelMat));
        mats.push(kernelMat);
      }

      const capMat = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.9,
        side: THREE.FrontSide,
      });
      group.add(
        new THREE.Mesh(
          capsGeometry(
            s.inner,
            s.outer,
            (r) => layerColorAt(obj, r),
            obj === "saturn" ? 24 : 6,
          ),
          capMat,
        ),
      );
      mats.push(capMat);

      // penutup oktan: tampil saat potongan dimatikan, bergeser keluar & memudar saat dibuka
      const lid = new THREE.Group();
      lid.name = `${s.id}.lid`;
      const lidMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.85,
        transparent: true,
        side: THREE.DoubleSide,
      });
      lid.add(new THREE.Mesh(octantPatch(s.outer, ws, uShift), lidMat));
      group.add(lid);
      lidMats.push(lidMat);
      mats.push(lidMat);
      if (outermost) texMats.push(lidMat);

      root.add(group);
      this.rigs.set(s.id, {
        id: s.id,
        group,
        shell: s,
        radius: s.outer,
        mats,
        lid,
        lidMats,
        anchor: labelAnchor(s.id),
      });
    });

    // cincin Saturnus sebagai konteks (bagian terpisah, bisa diisolasi)
    if (CONTEXT_PARTS[obj].includes("saturn.rings")) {
      const rf = ringFracs();
      const group = new THREE.Group();
      group.name = "saturn.rings";
      group.userData.pickId = "saturn.rings";
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xe3d3ae,
        roughness: 1,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(
        ringGeometry(rf.inner, rf.outer, this.ctx.lowPower ? 96 : 160),
        ringMat,
      );
      ring.userData.noOcclude = true;
      ring.renderOrder = 2;
      group.add(ring);
      root.add(group);
      this.rigs.set("saturn.rings", {
        id: "saturn.rings",
        group,
        shell: null,
        radius: rf.outer,
        mats: [ringMat],
        lidMats: [],
        anchor: labelAnchor("saturn.rings"),
      });
      const ringUrl = OBJ.get("saturn")?.texture.ring;
      if (ringUrl)
        this.ctx
          .loadTexture(ringUrl)
          .then((t) => {
            if (token !== this.buildToken) return;
            ringMat.map = t; // tekstur milik cache engine — tidak di-clone/di-dispose
            ringMat.color.set(0xffffff);
            ringMat.opacity = 0.95;
            ringMat.needsUpdate = true;
          })
          .catch(() => {
            /* status gagal dilaporkan engine; cincin tetap tampil berwarna polos */
          });
    }

    // peta permukaan (lazy): clone milik view (RepeatWrapping untuk geser bujur); sumber gambar tetap milik cache
    this.ctx
      .loadTexture(TEX[obj])
      .then((t) => {
        if (token !== this.buildToken) return;
        const c = t.clone();
        c.wrapS = THREE.RepeatWrapping;
        c.needsUpdate = true;
        this.ownTex.push(c);
        for (const m of texMats) {
          m.map = c;
          m.color.set(0xffffff);
          m.needsUpdate = true;
        }
      })
      .catch(() => {
        /* status gagal dilaporkan engine; lapisan tetap berwarna kode */
      });

    this.lidT = 0; // penutup dibuka lagi → "wedge bergerak" saat struktur dibuka
    this.pose();
    this.poseLids();
  }

  private clearModel() {
    if (this.root) {
      this.scene.remove(this.root);
      disposeTree(this.root);
      this.root = null;
    }
    for (const t of this.ownTex) t.dispose();
    this.ownTex = [];
    this.rigs.clear();
  }

  /* ---------- state → scene (absolut, tanpa akumulasi) ---------- */

  apply(st: AngkasaState) {
    if (!this.ctx) return;
    const rebuilt = st.structureObj !== this.obj;
    if (rebuilt) this.build(st.structureObj);
    this.cur = {
      explode: st.cutaway ? st.explode : 0,
      cutaway: st.cutaway,
      isolated: st.isolated,
      partId: st.partId,
      labels: st.prefs.labels,
    };
    // framing: langsung saat pertama dibangun; animasi saat Reset/ganti objek
    const nonce = `${st.resetNonce}:${st.refocusNonce}`;
    if (this.nonce === null) this.frameAll(false);
    else if (rebuilt || nonce !== this.nonce) this.frameAll(true);
    this.nonce = nonce;
    this.pose();
  }

  private pose() {
    const { explode, isolated, partId } = this.cur;
    const iso = isolated && this.rigs.has(isolated) ? isolated : null;
    for (const [id, rig] of this.rigs) {
      rig.group.visible = !iso || iso === id;
      rig.group.position.fromArray(partPosition(id, explode, iso));
      const on = partId === id;
      for (const m of rig.mats) {
        if (on) m.emissive.copy(HIGHLIGHT);
        else m.emissive.setHex(0);
        m.emissiveIntensity = on ? 0.32 : 0;
      }
    }
  }

  private poseLids() {
    const e = easeInOut(this.lidT);
    const op = 1 - smooth(0.45, 1, this.lidT);
    for (const [, rig] of this.rigs) {
      if (!rig.lid || !rig.shell) continue;
      const d = e * (rig.shell.outer + 0.6);
      rig.lid.position.set(
        EXPLODE_DIR[0] * d,
        EXPLODE_DIR[1] * d,
        EXPLODE_DIR[2] * d,
      );
      rig.lid.visible = this.lidT < 0.999;
      for (const m of rig.lidMats) {
        m.opacity = op;
        m.depthWrite = op > 0.95;
      }
    }
  }

  update(dt: number, ctx: EngineCtx) {
    const target = this.cur.cutaway ? 1 : 0;
    if (this.lidT !== target) {
      // animasi pendek (±0,8 dtk); gerakan berkurang → langsung
      if (ctx.reducedMotion()) this.lidT = target;
      else
        this.lidT =
          target > this.lidT
            ? Math.min(target, this.lidT + dt / 0.8)
            : Math.max(target, this.lidT - dt / 0.8);
      this.poseLids();
    }
  }

  scaleNote(st: AngkasaState) {
    if (st.structureObj === "saturn")
      return "Model interpretasi: batas lapisan tidak tajam dan tidak diamati langsung · warna = kode pendidikan";
    return `Model pendidikan: ketebalan kerak diperbesar agar terlihat (±${Math.round(crustExaggeration())}×) · warna = kode pendidikan`;
  }

  /* ---------- picking, occlusion, label ---------- */

  private visibleMeshes(filter?: (m: THREE.Mesh) => boolean) {
    const out: THREE.Object3D[] = [];
    this.root?.traverseVisible((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && (!filter || filter(m))) out.push(m);
    });
    return out;
  }

  pickables() {
    return this.visibleMeshes();
  }

  occluders() {
    return this.visibleMeshes((m) => {
      if (m.userData.noOcclude) return false;
      const mat = m.material as THREE.Material;
      return !(mat.transparent && mat.opacity < 0.95);
    });
  }

  labels(): LabelSpec[] {
    if (!this.obj) return [];
    const out: LabelSpec[] = [];
    const order = [...LAYERS[this.obj], ...CONTEXT_PARTS[this.obj]];
    const closed = this.lidT < 0.5;
    order.forEach((id, i) => {
      const rig = this.rigs.get(id);
      if (!rig || !rig.group.visible) return;
      const selected = this.cur.partId === id;
      if (!this.cur.labels && !selected) return;
      const p = PART.get(id);
      // penutup tertutup: hanya lapisan terluar yang terlihat → label di permukaannya
      let anchor = rig.anchor;
      if (closed && rig.shell) {
        if (i !== 0 && this.cur.isolated !== id) return;
        const r = rig.shell.outer;
        anchor = [CAM_DIR.x * r, CAM_DIR.y * r, CAM_DIR.z * r];
      }
      const a = new THREE.Vector3(...anchor);
      out.push({
        id: `st:${id}`,
        text: p?.nameId ?? id,
        pickId: id,
        kind: "part",
        priority: selected ? 10 : 6 - i * 0.5,
        world: (v) => rig.group.localToWorld(v.copy(a)),
      });
    });
    return out;
  }

  dispose() {
    this.buildToken++;
    this.clearModel();
    disposeTree(this.scene);
    this.scene.clear();
  }
}
