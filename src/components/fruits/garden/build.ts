// Pembangun geometri Kebun Buah yang realistis: batang bertekstur kulit kayu, tajuk dari ratusan kartu
// gerombol daun (bernormal membulat supaya pencahayaannya lembut seperti pohon sungguhan), pelepah palem,
// daun pisang & daun menjari yang melengkung. Semua bagian statis digabung per material agar ringan di HP.
// Buah asli (model 3D katalog versi ringan) dipasang terpisah di "titik buah" yang dikembalikan tiap tanaman.

import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { Plot } from '@/lib/fruits/garden';
import { ATLAS } from './textures';

const tmpC = new T.Color();
const tmpM = new T.Matrix4();
const tmpQ = new T.Quaternion();
const tmpE = new T.Euler();
const tmpS = new T.Vector3();
const tmpP = new T.Vector3();
const UP = new T.Vector3(0, 1, 0);

export const rnd = (seed: number) => {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
};

/** Matriks dari posisi, rotasi (euler), dan skala. */
export function mat(x: number, y: number, z: number, rx = 0, ry = 0, rz = 0, sx = 1, sy = sx, sz = sx) {
  tmpQ.setFromEuler(tmpE.set(rx, ry, rz));
  return tmpM.clone().compose(tmpP.set(x, y, z), tmpQ, tmpS.set(sx, sy, sz));
}
const I = new T.Matrix4();

interface AddOpts {
  sway?: number;
  baseY?: number;
  jitter?: number;
  /** skala UV (ulangan tekstur) */
  uv?: [number, number];
}

/** Kumpulan bagian yang nanti digabung menjadi satu mesh. */
export class Merge {
  private parts: T.BufferGeometry[] = [];
  add(g: T.BufferGeometry, m: T.Matrix4, color: T.ColorRepresentation, o: AddOpts = {}) {
    const geo = g.index ? g.toNonIndexed() : g.clone();
    for (const k of Object.keys(geo.attributes)) if (!['position', 'normal', 'uv', 'color'].includes(k)) geo.deleteAttribute(k);
    const n = geo.attributes.position.count;
    if (!geo.attributes.uv) geo.setAttribute('uv', new T.BufferAttribute(new Float32Array(n * 2), 2));
    if (!geo.attributes.normal) geo.computeVertexNormals();
    if (o.uv) {
      const uv = geo.attributes.uv;
      for (let i = 0; i < n; i++) uv.setXY(i, uv.getX(i) * o.uv[0], uv.getY(i) * o.uv[1]);
    }
    geo.applyMatrix4(m);
    const pos = geo.attributes.position;
    const pre = geo.attributes.color;
    const col = new Float32Array(n * 3),
      sw = new Float32Array(n);
    tmpC.set(color);
    const sway = o.sway ?? 0,
      baseY = o.baseY ?? 0,
      jitter = o.jitter ?? 0;
    for (let i = 0; i < n; i++) {
      const j = jitter ? 1 + Math.sin(i * 12.9898 + pos.getX(i) * 78.233) * 0.5 * jitter : 1;
      const pr = pre ? pre.getX(i) : 1,
        pg = pre ? pre.getY(i) : 1,
        pb = pre ? pre.getZ(i) : 1;
      col[i * 3] = tmpC.r * j * pr;
      col[i * 3 + 1] = tmpC.g * j * pg;
      col[i * 3 + 2] = tmpC.b * j * pb;
      sw[i] = sway * Math.max(0, pos.getY(i) - baseY);
    }
    geo.setAttribute('color', new T.BufferAttribute(col, 3));
    geo.setAttribute('aSway', new T.BufferAttribute(sw, 1));
    this.parts.push(geo);
    g.dispose();
  }
  get empty() {
    return this.parts.length === 0;
  }
  build(material: T.Material) {
    const geo = mergeGeometries(this.parts, false)!;
    this.parts.forEach((p) => p.dispose());
    this.parts = [];
    geo.computeBoundingSphere();
    const mesh = new T.Mesh(geo, material);
    mesh.matrixAutoUpdate = false;
    return mesh;
  }
}

/** Material berwarna simpul + goyang angin (uTime dibagi bersama). `foliage`: normal tidak dibalik di sisi belakang. */
export function swayMaterial(uTime: { value: number }, opts: T.MeshStandardMaterialParameters, foliage = false) {
  const m = new T.MeshStandardMaterial({ vertexColors: true, ...opts });
  m.onBeforeCompile = (s) => {
    s.uniforms.uTime = uTime;
    s.vertexShader = s.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aSway;\nuniform float uTime;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        float ph = position.x * 0.31 + position.z * 0.23;
        transformed.x += sin(uTime * 1.3 + ph) * aSway;
        transformed.z += cos(uTime * 1.1 + ph * 1.3) * aSway * 0.6;`,
      );
    if (foliage) s.fragmentShader = s.fragmentShader.replace('normal *= faceDirection;', '').replace('normal = normal * faceDirection;', '');
  };
  return m;
}

/** Tiga keranjang bahan: kulit kayu (bertekstur), dedaunan (atlas, alpha), dan polos (warna simpul). */
export interface Kit {
  bark: Merge;
  leaf: Merge;
  plain: Merge;
}

/** Titik buah: posisi & arah gantung (skala mengikuti ukuran buah, diatur saat buah dipasang). */
export interface Spot {
  p: T.Vector3;
  q: T.Quaternion;
  /** pengali ukuran (mis. sisir pisang yang lebih kecil di bawah) */
  s?: number;
}

export interface PlantResult {
  top: number;
  spots: Spot[];
}

/* ---------------- primitif ---------------- */

/** Kartu-kartu gerombol daun mengisi elipsoid; normal mengarah keluar dari pusat tajuk. */
export function canopy(kit: Kit, c: T.Vector3, rad: T.Vector3, n: number, size: number, r: () => number, hue = 0, sway = 0.006) {
  const [u0, v0, u1, v1] = ATLAS.cluster;
  const pos: number[] = [],
    nor: number[] = [],
    uv: number[] = [],
    col: number[] = [];
  const q = new T.Quaternion(),
    e = new T.Euler(),
    dir = new T.Vector3(),
    nn = new T.Vector3(),
    corner = new T.Vector3();
  const quad: [number, number, number, number][] = [
    [-0.5, -0.5, u0, v0],
    [0.5, -0.5, u1, v0],
    [0.5, 0.5, u1, v1],
    [-0.5, -0.5, u0, v0],
    [0.5, 0.5, u1, v1],
    [-0.5, 0.5, u0, v1],
  ];
  for (let i = 0; i < n; i++) {
    dir.set(r() * 2 - 1, r() * 2 - 1, r() * 2 - 1);
    if (dir.lengthSq() < 0.01) dir.set(0, 1, 0);
    dir.normalize();
    const d = 0.45 + 0.55 * Math.sqrt(r());
    const p = new T.Vector3(dir.x * rad.x * d, dir.y * rad.y * d, dir.z * rad.z * d).add(c);
    q.setFromEuler(e.set(r() * 6.28, r() * 6.28, r() * 6.28));
    nn.copy(dir).multiplyScalar(0.85).add(new T.Vector3(0, 0.25, 0)).normalize();
    // bagian dalam & bawah tajuk lebih gelap (terlindung), atas lebih terang
    const shade = (0.62 + 0.38 * d) * (0.85 + 0.2 * Math.max(0, dir.y));
    tmpC.setRGB(1, 1, 1).offsetHSL(hue + (r() - 0.5) * 0.03, 0, 0).multiplyScalar(shade);
    const s = size * (0.75 + r() * 0.5);
    for (const [x, y, uu, vv] of quad) {
      corner.set(x * s, y * s, 0).applyQuaternion(q).add(p);
      pos.push(corner.x, corner.y, corner.z);
      nor.push(nn.x, nn.y, nn.z);
      uv.push(uu, vv);
      col.push(tmpC.r, tmpC.g * (1 + hue), tmpC.b);
    }
  }
  const g = new T.BufferGeometry();
  g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new T.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
  g.setAttribute('color', new T.Float32BufferAttribute(col, 3));
  kit.leaf.add(g, I, '#ffffff', { sway, baseY: c.y - rad.y * 1.5 });
}

/**
 * Pita melengkung (pelepah / daun panjang / helai): dari pangkal ke arah `yaw`, naik lalu melengkung turun.
 * Tanpa `region` → helai polos berwarna yang meruncing.
 */
function ribbon(
  m: Merge,
  base: T.Vector3,
  yaw: number,
  len: number,
  width: number,
  lift: number,
  droop: number,
  color: T.ColorRepresentation,
  region?: [number, number, number, number],
  seg = 8,
  sway = 0.03,
  taper = 0.2,
) {
  const [u0, v0, u1, v1] = region ?? [0, 0, 1, 1];
  const fwd = new T.Vector3(Math.sin(yaw), 0, Math.cos(yaw)),
    side = new T.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
  const pos: number[] = [],
    uv: number[] = [],
    idx: number[] = [];
  for (let i = 0; i <= seg; i++) {
    const t = i / seg;
    const c = base.clone().addScaledVector(fwd, len * t).addScaledVector(UP, lift * t - droop * t * t);
    const w = region ? width : width * (1 - (1 - taper) * t) * Math.min(1, 0.4 + t * 3);
    // sedikit terlipat di tulang daun (bentuk V) supaya tidak seperti kertas datar
    for (const k of [-1, 0, 1]) {
      const p = c.clone().addScaledVector(side, (k * w) / 2).addScaledVector(UP, k === 0 ? 0.04 * width : 0);
      pos.push(p.x, p.y, p.z);
      uv.push(u0 + ((k + 1) / 2) * (u1 - u0), v0 + t * (v1 - v0));
    }
    if (i < seg) {
      const a = i * 3;
      idx.push(a, a + 3, a + 1, a + 1, a + 3, a + 4, a + 1, a + 4, a + 2, a + 2, a + 4, a + 5);
    }
  }
  const g = new T.BufferGeometry();
  g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  // normal condong ke atas agar daun terang dari kedua sisi
  const nor = g.attributes.normal;
  const v = new T.Vector3();
  for (let i = 0; i < nor.count; i++) {
    v.fromBufferAttribute(nor, i);
    if (v.y < 0) v.negate();
    v.add(UP).normalize();
    nor.setXYZ(i, v.x, v.y, v.z);
  }
  m.add(g, I, color, { sway, baseY: base.y });
}

/** Batang meruncing yang sedikit melengkung, akarnya melebar di pangkal. */
function trunk(kit: Kit, x: number, z: number, h: number, r0: number, r1: number, bend: number, yaw: number, color = '#8d6e57', y0 = 0) {
  const g = new T.CylinderGeometry(r1, r0, h, 10, 8);
  g.translate(0, h / 2, 0);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const t = p.getY(i) / h;
    const flare = t < 0.2 ? 1 + (0.2 - t) * 3 : 1;
    p.setX(i, p.getX(i) * flare + Math.sin(yaw) * bend * t * t + Math.sin(t * 9 + yaw) * 0.02);
    p.setZ(i, p.getZ(i) * flare + Math.cos(yaw) * bend * t * t);
  }
  g.computeVertexNormals();
  kit.bark.add(g, mat(x, y0, z), color, { uv: [2, h / 1.3], sway: 0.002, baseY: y0 });
  return new T.Vector3(x + Math.sin(yaw) * bend, y0 + h, z + Math.cos(yaw) * bend);
}

function branch(kit: Kit, a: T.Vector3, b: T.Vector3, r: number, color = '#8d6e57') {
  const mid = a.clone().lerp(b, 0.5).add(new T.Vector3(0, 0.25, 0));
  kit.bark.add(new T.TubeGeometry(new T.CatmullRomCurve3([a, mid, b]), 6, r, 6, false), I, color, { uv: [1, a.distanceTo(b) / 1.3], sway: 0.004, baseY: a.y });
}

/** Titik buah bergantung di permukaan bawah tajuk. */
function hangingSpots(out: Spot[], c: T.Vector3, rad: T.Vector3, n: number, r: () => number, inset = 0.9) {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 6.28 + r() * 0.8;
    const y = -0.15 - r() * 0.55;
    const k = Math.sqrt(1 - y * y) * inset;
    out.push({
      p: new T.Vector3(c.x + Math.cos(a) * rad.x * k, c.y + y * rad.y * inset, c.z + Math.sin(a) * rad.z * k),
      q: new T.Quaternion().setFromEuler(new T.Euler((r() - 0.5) * 0.4, r() * 6.28, (r() - 0.5) * 0.4)),
    });
  }
}

/* ---------------- tanaman ---------------- */

const BIG = new Set(['durian', 'mangga', 'nangka', 'cempedak', 'sawo', 'matoa', 'kedondong', 'jamblang', 'alpukat', 'sirsak', 'rambutan', 'duku', 'langsat', 'lengkeng', 'manggis']);

function tree(kit: Kit, p: Plot, r: () => number, size: number, fruits = 8): PlantResult {
  const yaw = r() * 6.28;
  const h = (1.9 + r() * 0.5) * size;
  const top = trunk(kit, p.x, p.z, h, 0.26 * size, 0.15 * size, 0.25 * size, yaw);
  const spots: Spot[] = [];
  const clusters = 4 + Math.floor(r() * 2);
  const main = new T.Vector3(top.x, top.y + 1.1 * size, top.z);
  const R = 1.55 * size;
  canopy(kit, main, new T.Vector3(R, R * 0.8, R), Math.round(70 * size), 1.25 * size, r);
  hangingSpots(spots, main, new T.Vector3(R, R * 0.8, R), Math.ceil(fruits / 2), r);
  for (let i = 0; i < clusters; i++) {
    const a = yaw + (i / clusters) * 6.28 + r() * 0.5;
    const c = new T.Vector3(top.x + Math.cos(a) * R * 0.85, top.y + (0.4 + r() * 0.9) * size, top.z + Math.sin(a) * R * 0.85);
    branch(kit, top.clone().add(new T.Vector3(0, -0.3 * size, 0)), c, 0.07 * size);
    const rr = new T.Vector3(R * 0.62, R * 0.52, R * 0.62);
    canopy(kit, c, rr, Math.round(34 * size), 1.1 * size, r);
    if (i < fruits - Math.ceil(fruits / 2)) hangingSpots(spots, c, rr, 1, r);
  }
  return { top: main.y + R * 0.8, spots };
}

function palm(kit: Kit, p: Plot, r: () => number): PlantResult {
  const yaw = r() * 6.28;
  const h = 5.4 + r() * 0.8;
  const y0 = p.y ?? 0;
  const top = trunk(kit, p.x, p.z, h, 0.24, 0.17, 0.7, yaw, '#9a8470', y0);
  // cincin bekas pelepah pada batang
  for (let i = 1; i < 12; i++) {
    const t = i / 12;
    kit.plain.add(new T.TorusGeometry(0.21 - t * 0.04, 0.025, 5, 12), mat(p.x + Math.sin(yaw) * 0.7 * t * t, y0 + h * t, p.z + Math.cos(yaw) * 0.7 * t * t, Math.PI / 2), '#6d5a48');
  }
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * 6.28 + r() * 0.2;
    const up = i % 3 === 0;
    ribbon(kit.leaf, top.clone().add(new T.Vector3(0, 0.1, 0)), a, 3.1 + r() * 0.5, 1.3, up ? 1.4 : 0.8, up ? 2.2 : 2.8, '#ffffff', ATLAS.frond, 10, 0.05);
  }
  const spots: Spot[] = [];
  const small = p.fruit.shape === 'date';
  const n = small ? 22 : 6;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 6.28 + r() * 0.3;
    const d = small ? 0.35 + r() * 0.3 : 0.3;
    spots.push({
      p: new T.Vector3(top.x + Math.cos(a) * d, top.y - (small ? 0.5 + r() * 0.7 : 0.3 + (i % 2) * 0.2), top.z + Math.sin(a) * d),
      q: new T.Quaternion().setFromEuler(new T.Euler(0, r() * 6.28, 0)),
    });
  }
  if (small) for (let i = 0; i < 3; i++) kit.plain.add(new T.CylinderGeometry(0.015, 0.02, 1, 4), mat(top.x + Math.cos(i * 2.1) * 0.3, top.y - 0.5, top.z + Math.sin(i * 2.1) * 0.3, 0.4 * Math.cos(i * 2.1), 0, -0.4 * Math.sin(i * 2.1)), '#d8a040');
  return { top: top.y + 1.4, spots };
}

/** Salak: palem berduri tanpa batang, buah bergerombol di pangkal. */
function salak(kit: Kit, p: Plot, r: () => number): PlantResult {
  const base = new T.Vector3(p.x, 0.15, p.z);
  for (let i = 0; i < 12; i++) ribbon(kit.leaf, base, (i / 12) * 6.28 + r() * 0.3, 2.6 + r() * 0.5, 1.05, 2.3, 1.9, '#d8ffd0', ATLAS.frond, 10, 0.045);
  const spots: Spot[] = [];
  for (let i = 0; i < 9; i++) {
    const a = r() * 6.28;
    spots.push({ p: new T.Vector3(p.x + Math.cos(a) * 0.25, 0.22 + r() * 0.2, p.z + Math.sin(a) * 0.25), q: new T.Quaternion().setFromEuler(new T.Euler(0, r() * 6.28, 0.3)) });
  }
  return { top: 2.8, spots };
}

function banana(kit: Kit, p: Plot, r: () => number): PlantResult {
  const { x, z } = p;
  // batang semu dari lapisan pelepah
  const g = new T.CylinderGeometry(0.2, 0.3, 2.7, 12, 4);
  g.translate(0, 1.35, 0);
  kit.plain.add(g, mat(x, 0, z), '#7f8f4a', { jitter: 0.15 });
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * 6.28 + r() * 0.4;
    ribbon(kit.leaf, new T.Vector3(x, 2.5 + r() * 0.3, z), a, 2.7 + r() * 0.4, 0.95, 1.3, 1.9, '#ffffff', ATLAS.banana, 10, 0.05);
  }
  // tandan: tangkai melengkung ke bawah, sisir-sisir pisang mengarah ke atas
  const stalkTop = new T.Vector3(x + 0.25, 2.55, z + 0.2),
    stalkEnd = new T.Vector3(x + 0.55, 1.35, z + 0.45);
  kit.plain.add(new T.TubeGeometry(new T.CatmullRomCurve3([stalkTop, new T.Vector3(x + 0.55, 2.4, z + 0.45), stalkEnd]), 8, 0.05, 6), I, '#6b7a3a');
  kit.plain.add(new T.ConeGeometry(0.13, 0.42, 10), mat(stalkEnd.x, stalkEnd.y - 0.3, stalkEnd.z, Math.PI), '#6e2440', { jitter: 0.1 }); // jantung pisang
  const spots: Spot[] = [];
  for (let h = 0; h < 4; h++) {
    const y = 2.15 - h * 0.2;
    const cx = x + 0.55,
      cz = z + 0.45;
    for (let f = 0; f < 7; f++) {
      const a = (f / 7) * 6.28 + h * 0.5;
      const q = new T.Quaternion().setFromEuler(new T.Euler(0, -a, 0));
      q.multiply(new T.Quaternion().setFromEuler(new T.Euler(0, 0, 1.1)));
      spots.push({ p: new T.Vector3(cx + Math.cos(a) * 0.17, y, cz + Math.sin(a) * 0.17), q, s: 1 - h * 0.08 });
    }
  }
  return { top: 3.9, spots };
}

/** Pelat berdaun menjari dengan UV atlas. */
function palmateLeaf(size: number) {
  const g = new T.PlaneGeometry(size, size);
  const [u0, v0, u1, v1] = ATLAS.palmate;
  const uv = g.attributes.uv;
  for (let k = 0; k < uv.count; k++) uv.setXY(k, u0 + uv.getX(k) * (u1 - u0), v0 + uv.getY(k) * (v1 - v0));
  return g;
}

function papaya(kit: Kit, p: Plot, r: () => number): PlantResult {
  const top = trunk(kit, p.x, p.z, 3.4, 0.17, 0.12, 0.15, r() * 6.28, '#b8ab94');
  const spots: Spot[] = [];
  for (let i = 0; i < 11; i++) {
    const a = (i / 11) * 6.28 + r() * 0.3;
    const len = 1.2 + r() * 0.3;
    const tip = top.clone().add(new T.Vector3(Math.cos(a) * len, 0.35 - r() * 0.3, Math.sin(a) * len));
    kit.plain.add(new T.TubeGeometry(new T.CatmullRomCurve3([top.clone().add(new T.Vector3(0, 0.1, 0)), top.clone().lerp(tip, 0.5).add(new T.Vector3(0, 0.35, 0)), tip]), 6, 0.022, 4), I, '#9fb35d', { sway: 0.02, baseY: top.y });
    kit.leaf.add(palmateLeaf(1.25), mat(tip.x, tip.y, tip.z, -Math.PI / 2 + 0.3, 0, -a + Math.PI / 2), '#ffffff', { sway: 0.03, baseY: top.y - 0.5 });
  }
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * 6.28 + r();
    spots.push({ p: new T.Vector3(top.x + Math.cos(a) * 0.24, top.y - 0.35 - (i % 3) * 0.28, top.z + Math.sin(a) * 0.24), q: new T.Quaternion().setFromEuler(new T.Euler(0, r() * 6.28, Math.cos(a) * 0.2)) });
  }
  return { top: top.y + 0.9, spots };
}

/** Semangka / melon: sulur menjalar di tanah dengan daun menjari, buah tergeletak. */
function vine(kit: Kit, p: Plot, r: () => number): PlantResult {
  const { x, z } = p;
  for (let i = 0; i < 26; i++) {
    const a = r() * 6.28,
      d = 0.3 + r() * 1.6;
    kit.leaf.add(palmateLeaf(0.75), mat(x + Math.cos(a) * d, 0.18 + r() * 0.22, z + Math.sin(a) * d, -Math.PI / 2 + (r() - 0.5) * 0.7, 0, r() * 6.28), '#ffffff', { sway: 0.06 });
  }
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * 6.28;
    const pts = [0, 1, 2, 3].map((k) => new T.Vector3(x + Math.cos(a + k * 0.3) * k * 0.55, 0.06, z + Math.sin(a + k * 0.3) * k * 0.55));
    kit.plain.add(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 10, 0.02, 4), I, '#6d9a3c');
  }
  return {
    top: 1,
    spots: [
      { p: new T.Vector3(x - 0.45, 0, z + 0.35), q: new T.Quaternion().setFromEuler(new T.Euler(0, r() * 6.28, 0)) },
      { p: new T.Vector3(x + 0.75, 0, z - 0.45), q: new T.Quaternion().setFromEuler(new T.Euler(0, r() * 6.28, 0)), s: 0.85 },
      { p: new T.Vector3(x + 0.2, 0, z + 1.2), q: new T.Quaternion().setFromEuler(new T.Euler(0, r() * 6.28, 0)), s: 0.7 },
    ],
  };
}

function pineapple(kit: Kit, p: Plot, r: () => number): PlantResult {
  for (let i = 0; i < 30; i++) {
    const a = (i / 30) * 6.28 + r() * 0.3;
    ribbon(kit.plain, new T.Vector3(p.x, 0.05, p.z), a, 0.9 + r() * 0.4, 0.09, 0.9 + r() * 0.3, 1 + r() * 0.3, i % 2 ? '#4f7d45' : '#5f8a4c', undefined, 6, 0.05, 0.1);
  }
  return { top: 1.7, spots: [{ p: new T.Vector3(p.x, 0.62, p.z), q: new T.Quaternion() }] };
}

/** Stroberi: bedengan jerami dengan rumpun rendah, buah menjuntai di tepi. */
function strawberry(kit: Kit, p: Plot, r: () => number): PlantResult {
  kit.plain.add(new T.CylinderGeometry(1.25, 1.35, 0.14, 20), mat(p.x, 0.07, p.z), '#d9c089', { jitter: 0.25 });
  for (let k = 0; k < 4; k++) {
    const cx = p.x + ((k % 2) - 0.5) * 1.1,
      cz = p.z + (Math.floor(k / 2) - 0.5) * 1.1;
    canopy(kit, new T.Vector3(cx, 0.35, cz), new T.Vector3(0.38, 0.2, 0.38), 12, 0.42, r, 0.01, 0.03);
  }
  const spots: Spot[] = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * 6.28 + r() * 0.3;
    spots.push({ p: new T.Vector3(p.x + Math.cos(a) * (0.75 + r() * 0.3), 0.2, p.z + Math.sin(a) * (0.75 + r() * 0.3)), q: new T.Quaternion().setFromEuler(new T.Euler(Math.PI + (r() - 0.5) * 0.6, r() * 6.28, 0)) });
  }
  return { top: 0.9, spots };
}

/** Para-para (anggur, kiwi, markisa): tiang kayu, atap daun, buah menggantung di bawahnya. */
function trellis(kit: Kit, p: Plot, r: () => number): PlantResult {
  const { x, z } = p;
  const H = 2.3;
  for (const [dx, dz] of [
    [-1.4, -0.8],
    [1.4, -0.8],
    [-1.4, 0.8],
    [1.4, 0.8],
  ])
    kit.bark.add(new T.CylinderGeometry(0.07, 0.08, H, 8), mat(x + dx, H / 2, z + dz), '#a58a70', { uv: [1, 2] });
  for (const dz of [-0.8, 0.8]) kit.bark.add(new T.CylinderGeometry(0.05, 0.05, 3, 6), mat(x, H, z + dz, 0, 0, Math.PI / 2), '#a58a70', { uv: [1, 2] });
  for (let i = -2; i <= 2; i++) kit.plain.add(new T.CylinderGeometry(0.012, 0.012, 1.7, 4), mat(x + i * 0.65, H + 0.02, z, Math.PI / 2), '#777777');
  // batang merambat memelintir di tiang
  for (const dx of [-1.4, 1.4]) {
    const pts = Array.from({ length: 9 }, (_, k) => new T.Vector3(x + dx + Math.cos(k * 1.4) * 0.12, (k / 8) * H, z + 0.8 + Math.sin(k * 1.4) * 0.12));
    kit.bark.add(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 20, 0.035, 5), I, '#7a5a3a', { uv: [1, 3] });
  }
  canopy(kit, new T.Vector3(x, H + 0.2, z), new T.Vector3(1.7, 0.28, 1.05), 60, 0.8, r, -0.01, 0.01);
  const spots: Spot[] = [];
  const n = p.fruit.shape === 'grapes' ? 9 : 12;
  for (let i = 0; i < n; i++)
    spots.push({
      p: new T.Vector3(x + (r() - 0.5) * 2.4, H - (p.fruit.shape === 'grapes' ? 0.3 : 0.15), z + (r() - 0.5) * 1.3),
      q: new T.Quaternion().setFromEuler(new T.Euler(0, r() * 6.28, 0)),
    });
  return { top: H + 0.6, spots };
}

/** Buah naga: kaktus merambat bertulang tiga yang menjuntai dari tiang beton. */
function dragon(kit: Kit, p: Plot, r: () => number): PlantResult {
  const { x, z } = p;
  kit.plain.add(new T.BoxGeometry(0.18, 1.9, 0.18), mat(x, 0.95, z), '#b9b5ad', { jitter: 0.1 });
  kit.plain.add(new T.TorusGeometry(0.42, 0.04, 6, 16), mat(x, 1.9, z, Math.PI / 2), '#9e9a92');
  const spots: Spot[] = [];
  for (let i = 0; i < 11; i++) {
    const a = (i / 11) * 6.28 + r() * 0.2;
    const pts = [
      new T.Vector3(x, 1.5, z),
      new T.Vector3(x + Math.cos(a) * 0.4, 2.05, z + Math.sin(a) * 0.4),
      new T.Vector3(x + Math.cos(a) * 0.8, 1.9, z + Math.sin(a) * 0.8),
      new T.Vector3(x + Math.cos(a) * 1.0, 1.3 + r() * 0.3, z + Math.sin(a) * 1.0),
    ];
    kit.plain.add(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 14, 0.07, 3, false), I, '#6f9e4c', { jitter: 0.08, sway: 0.01, baseY: 1.5 });
    if (i % 3 === 0) spots.push({ p: pts[3].clone().add(new T.Vector3(0, -0.12, 0)), q: new T.Quaternion().setFromEuler(new T.Euler(0, r() * 6.28, 0)) });
  }
  for (let i = 0; i < 3; i++) {
    const a = r() * 6.28;
    spots.push({ p: new T.Vector3(x + Math.cos(a) * 0.55, 2.1, z + Math.sin(a) * 0.55), q: new T.Quaternion().setFromEuler(new T.Euler(0, r() * 6.28, 0)) });
  }
  return { top: 2.6, spots };
}

/** Nangka/cempedak: pohon besar, buah tumbuh langsung di batang. */
function trunkFruit(kit: Kit, p: Plot, r: () => number): PlantResult {
  const res = tree(kit, p, r, 1.15, 0);
  for (let i = 0; i < 5; i++) {
    const a = i * 1.7 + 0.4;
    res.spots.push({ p: new T.Vector3(p.x + Math.cos(a) * 0.36, 0.9 + i * 0.3, p.z + Math.sin(a) * 0.36), q: new T.Quaternion().setFromEuler(new T.Euler(0, -a, 0.15)) });
  }
  return res;
}

/** Bangun satu tanaman: bagian statis ke kit, kembalikan tinggi puncak & titik-titik buahnya. */
export function buildPlant(kit: Kit, p: Plot, seed: number, ground = true): PlantResult {
  const r = rnd(seed * 9301 + 49297);
  // tanah gembur di bawah tanaman (tidak perlu di bedengan yang sudah bertanah)
  if (ground) kit.plain.add(new T.CircleGeometry(p.kind === 'trellis' ? 2.1 : 1.7, 20), mat(p.x, 0.035, p.z, -Math.PI / 2), '#6b4a31', { jitter: 0.35 });
  switch (p.kind) {
    case 'palm':
      return palm(kit, p, r);
    case 'spiky':
      return salak(kit, p, r);
    case 'banana':
      return banana(kit, p, r);
    case 'papaya':
      return papaya(kit, p, r);
    case 'vine':
      return vine(kit, p, r);
    case 'pineapple':
      return pineapple(kit, p, r);
    case 'bush':
      return strawberry(kit, p, r);
    case 'trellis':
      return trellis(kit, p, r);
    case 'cactus':
      return dragon(kit, p, r);
    case 'trunk':
      return trunkFruit(kit, p, r);
    case 'shrub':
      return tree(kit, p, r, 0.72, 8);
    default:
      return tree(kit, p, r, BIG.has(p.fruit.id) ? 1.12 + r() * 0.1 : 0.88 + r() * 0.12, 8);
  }
}

/** Pohon latar tanpa buah (di luar pagar). */
export function backdropTree(kit: Kit, x: number, z: number, y: number, size: number, seed: number) {
  const r = rnd(seed);
  const h = 2.6 * size;
  const top = trunk(kit, x, z, h, 0.3 * size, 0.18 * size, 0.2 * size, r() * 6.28, '#7d6250', y);
  canopy(kit, new T.Vector3(top.x, top.y + 1.2 * size, top.z), new T.Vector3(1.9 * size, 1.6 * size, 1.9 * size), Math.round(40 * size), 1.6 * size, r, -0.02 + r() * 0.03, 0.004);
}
