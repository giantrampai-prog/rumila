// Pembangun geometri Kebun Buah: semua bagian statis digabung (merge) per material agar ringan di HP
// (puluhan tanaman → beberapa draw call saja). Setiap simpul membawa warna sendiri dan bobot "goyang"
// untuk animasi angin di shader.

import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { Fruit } from '@/lib/fruits/catalog';
import type { Plot } from '@/lib/fruits/garden';

const tmpC = new T.Color();
const tmpM = new T.Matrix4();
const tmpQ = new T.Quaternion();
const tmpE = new T.Euler();
const tmpS = new T.Vector3();
const tmpP = new T.Vector3();

export const rnd = (seed: number) => {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
};

/** Matriks dari posisi, rotasi (euler), dan skala. */
export function mat(x: number, y: number, z: number, rx = 0, ry = 0, rz = 0, sx = 1, sy = sx, sz = sx) {
  tmpQ.setFromEuler(tmpE.set(rx, ry, rz));
  return tmpM.clone().compose(tmpP.set(x, y, z), tmpQ, tmpS.set(sx, sy, sz));
}

/** Kumpulan bagian yang nanti digabung menjadi satu mesh. */
export class Merge {
  private parts: T.BufferGeometry[] = [];
  /**
   * @param baseY dasar tanaman (goyang bertambah dengan tinggi di atas titik ini)
   * @param sway kekuatan goyang per satuan tinggi (0 = diam)
   */
  add(g: T.BufferGeometry, m: T.Matrix4, color: T.ColorRepresentation, sway = 0, baseY = 0, jitter = 0) {
    const geo = g.index ? g.toNonIndexed() : g.clone();
    for (const k of Object.keys(geo.attributes)) if (k !== 'position' && k !== 'normal') geo.deleteAttribute(k);
    geo.applyMatrix4(m);
    const pos = geo.attributes.position;
    const n = pos.count;
    const col = new Float32Array(n * 3),
      sw = new Float32Array(n);
    tmpC.set(color);
    for (let i = 0; i < n; i++) {
      const j = jitter ? 1 + (Math.sin(i * 12.9898 + pos.getX(i) * 78.233) * 0.5) * jitter : 1;
      col[i * 3] = tmpC.r * j;
      col[i * 3 + 1] = tmpC.g * j;
      col[i * 3 + 2] = tmpC.b * j;
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
    const mesh = new T.Mesh(geo, material);
    mesh.matrixAutoUpdate = false;
    return mesh;
  }
}

/** Material berwarna simpul + goyang angin (uTime dibagi bersama). */
export function swayMaterial(uTime: { value: number }, opts: T.MeshStandardMaterialParameters) {
  const m = new T.MeshStandardMaterial({ vertexColors: true, ...opts });
  m.onBeforeCompile = (s) => {
    s.uniforms.uTime = uTime;
    s.vertexShader = s.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aSway;\nuniform float uTime;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        float ph = position.x * 0.31 + position.z * 0.23;
        transformed.x += sin(uTime * 1.5 + ph) * aSway;
        transformed.z += cos(uTime * 1.2 + ph * 1.3) * aSway * 0.6;`,
      );
  };
  return m;
}

/* ---------------- tanaman ---------------- */

const LEAF = ['#4f9a3a', '#5aa843', '#3f8a35', '#66b24a'];
const TRUNK = '#8a5a34';

type Out = { plant: Merge; fruit: Merge };

/** Satu buah kecil di tanaman (bentuk disederhanakan dari bentuk katalog). */
function fruitBlob(o: Out, f: Fruit, x: number, y: number, z: number, s: number, r: () => number, sway: number, base: number) {
  const c = f.color;
  const ry = r() * 6.28;
  const add = (g: T.BufferGeometry, m: T.Matrix4, col = c) => o.fruit.add(g, m, col, sway, base);
  switch (f.shape) {
    case 'banana':
      for (let i = 0; i < 5; i++) add(new T.CapsuleGeometry(0.07 * s, 0.34 * s, 3, 6), mat(x + Math.cos(i * 1.25) * 0.14 * s, y - 0.1 * s, z + Math.sin(i * 1.25) * 0.14 * s, 0.25, i * 1.25, 0.4));
      break;
    case 'grapes':
    case 'cherries':
      for (let i = 0; i < (f.shape === 'grapes' ? 9 : 3); i++) {
        const row = f.shape === 'grapes' ? Math.floor(i / 3) : 0;
        const a = i * 2.1;
        add(new T.SphereGeometry(0.075 * s, 7, 5), mat(x + Math.cos(a) * (0.12 - row * 0.03) * s, y - row * 0.12 * s, z + Math.sin(a) * (0.12 - row * 0.03) * s));
      }
      break;
    case 'papaya':
    case 'jackfruit':
      add(new T.SphereGeometry(0.2 * s, 10, 8), mat(x, y, z, 0, ry, 0, s * 1, s * 1.7, s * 1));
      break;
    case 'watermelon':
      add(new T.SphereGeometry(0.42 * s, 12, 9), mat(x, y, z, 0, ry, 0, 1.25, 1, 1));
      break;
    case 'pineapple':
      add(new T.SphereGeometry(0.2 * s, 9, 8), mat(x, y, z, 0, 0, 0, 1, 1.45, 1));
      o.fruit.add(new T.ConeGeometry(0.16 * s, 0.34 * s, 6), mat(x, y + 0.42 * s, z), '#5a8739', sway, base);
      break;
    case 'durian':
    case 'rambutan':
    case 'soursop':
    case 'custard': {
      const big = f.shape === 'durian' || f.shape === 'soursop' ? 0.26 : 0.12;
      add(new T.IcosahedronGeometry(big * s, 1), mat(x, y, z, r(), r(), 0, 1, 1.15, 1));
      break;
    }
    case 'strawberry':
      add(new T.ConeGeometry(0.09 * s, 0.16 * s, 7), mat(x, y, z, Math.PI, 0, 0));
      break;
    case 'starfruit':
      add(new T.CylinderGeometry(0.1 * s, 0.1 * s, 0.3 * s, 5), mat(x, y, z, 0.2, ry, 0.2));
      break;
    case 'coconut':
      add(new T.SphereGeometry(0.22 * s, 9, 7), mat(x, y, z));
      break;
    default: {
      const big = f.shape === 'melon' ? 0.34 : f.shape === 'pear' || f.shape === 'avocado' || f.shape === 'mango' ? 0.16 : f.shape === 'date' || f.shape === 'lychee' || f.shape === 'gooseberry' ? 0.08 : 0.13;
      const tall = f.shape === 'pear' || f.shape === 'avocado' ? 1.35 : f.shape === 'mango' || f.shape === 'oval' || f.shape === 'date' ? 1.25 : f.shape === 'waxapple' ? 1.15 : 1;
      add(new T.SphereGeometry(big * s, 9, 7), mat(x, y, z, 0.2, ry, 0, 1, tall, 1));
    }
  }
}

/** Taburan buah pada kulit kanopi (bola) supaya tampak menggantung dari luar. */
function fruitsOnCanopy(o: Out, f: Fruit, cx: number, cy: number, cz: number, rad: number, n: number, r: () => number, s = 1) {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 6.28 + r() * 0.6;
    const yy = cy - rad * (0.15 + r() * 0.45);
    const rr = rad * 0.92;
    fruitBlob(o, f, cx + Math.cos(a) * rr, yy, cz + Math.sin(a) * rr, s * 1.45, r, 0.012, 0); // sedikit dibesarkan agar tampak dari atas
  }
}

function canopyTree(o: Out, p: Plot, r: () => number, size = 1) {
  const { x, z } = p;
  const h = (2.3 + r() * 0.6) * size;
  const leaf = LEAF[Math.floor(r() * LEAF.length)];
  o.plant.add(new T.CylinderGeometry(0.2 * size, 0.32 * size, h, 7), mat(x, h / 2, z), TRUNK, 0.004, 0);
  // cabang
  for (let i = 0; i < 2; i++) o.plant.add(new T.CylinderGeometry(0.07, 0.12, 1.1 * size, 5), mat(x + (i ? 0.35 : -0.35) * size, h - 0.1, z, 0, 0, i ? -0.7 : 0.7), TRUNK, 0.01, 0);
  const rad = 1.55 * size;
  const cy = h + rad * 0.55;
  o.plant.add(new T.IcosahedronGeometry(rad, 1), mat(x, cy, z, r(), r(), 0, 1, 0.85, 1), leaf, 0.012, 0, 0.18);
  for (let i = 0; i < 4; i++) {
    const a = i * 1.57 + r();
    o.plant.add(new T.IcosahedronGeometry(rad * 0.62, 1), mat(x + Math.cos(a) * rad * 0.72, cy - 0.2 + r() * 0.5, z + Math.sin(a) * rad * 0.72, r(), r(), 0), leaf, 0.014, 0, 0.2);
  }
  fruitsOnCanopy(o, p.fruit, x, cy, z, rad * 1.18, 7, r, size);
  return cy + rad;
}

function shrub(o: Out, p: Plot, r: () => number) {
  const { x, z } = p;
  o.plant.add(new T.CylinderGeometry(0.1, 0.16, 1, 6), mat(x, 0.5, z), TRUNK, 0.01, 0);
  const leaf = LEAF[Math.floor(r() * LEAF.length)];
  for (let i = 0; i < 5; i++) {
    const a = i * 1.26 + r();
    o.plant.add(new T.IcosahedronGeometry(0.72, 1), mat(x + Math.cos(a) * 0.55, 1.35 + r() * 0.4, z + Math.sin(a) * 0.55, r(), r(), 0), leaf, 0.02, 0, 0.2);
  }
  fruitsOnCanopy(o, p.fruit, x, 1.45, z, 1.15, 7, r, 0.95);
  return 2.4;
}

function palm(o: Out, p: Plot, r: () => number) {
  const { x, z } = p;
  const h = 5.2 + r();
  const lean = (r() - 0.5) * 0.25;
  const segs = 7;
  for (let i = 0; i < segs; i++) {
    const t = i / segs;
    o.plant.add(new T.CylinderGeometry(0.2 - t * 0.05, 0.24 - t * 0.05, h / segs + 0.05, 7), mat(x + lean * t * h * 0.5, (t + 0.5 / segs) * h, z, 0, 0, -lean * 0.5), i % 2 ? '#9a6d45' : '#86603c', 0.006, 0);
  }
  const tx = x + lean * h * 0.5,
    ty = h;
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * 6.28;
    const frond = new T.ConeGeometry(0.34, 2.8, 4);
    o.plant.add(frond, mat(tx + Math.cos(a) * 1.25, ty + 0.1, z + Math.sin(a) * 1.25, Math.sin(a) * 1.2, 0, -Math.cos(a) * 1.2, 1, 1, 0.25), '#4f9a3a', 0.03, ty - 1);
  }
  if (p.fruit.shape === 'date')
    for (let i = 0; i < 6; i++) {
      const a = i * 1.05;
      fruitBlob(o, p.fruit, tx + Math.cos(a) * 0.42, ty - 0.45 - (i % 2) * 0.15, z + Math.sin(a) * 0.42, 1, r, 0.004, 0);
    }
  else for (let i = 0; i < 4; i++) fruitBlob(o, p.fruit, tx + Math.cos(i * 1.57) * 0.3, ty - 0.25, z + Math.sin(i * 1.57) * 0.3, 1, r, 0.004, 0);
  return ty + 0.8;
}

function spiky(o: Out, p: Plot, r: () => number) {
  const { x, z } = p;
  for (let i = 0; i < 11; i++) {
    const a = (i / 11) * 6.28 + r() * 0.3;
    o.plant.add(new T.ConeGeometry(0.2, 2.6, 4), mat(x + Math.cos(a) * 0.55, 1.2, z + Math.sin(a) * 0.55, Math.sin(a) * 0.55, 0, -Math.cos(a) * 0.55, 1, 1, 0.35), '#4a7d34', 0.03, 0);
  }
  for (let i = 0; i < 6; i++) fruitBlob(o, p.fruit, x + Math.cos(i) * 0.28, 0.25 + (i % 2) * 0.12, z + Math.sin(i) * 0.28 + 0.1, 1.3, r, 0, 0);
  return 2.6;
}

function banana(o: Out, p: Plot, r: () => number) {
  const { x, z } = p;
  o.plant.add(new T.CylinderGeometry(0.22, 0.3, 2.6, 8), mat(x, 1.3, z), '#7b9a45', 0.008, 0);
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * 6.28 + r() * 0.4;
    o.plant.add(new T.SphereGeometry(1, 8, 4), mat(x + Math.cos(a) * 1.05, 2.8 + r() * 0.3, z + Math.sin(a) * 1.05, 0, -a, 0.35, 1.3, 0.05, 0.36), i % 2 ? '#5fae45' : '#4f9a3a', 0.035, 1.5);
  }
  fruitBlob(o, p.fruit, x + 0.3, 2.2, z + 0.3, 1.6, r, 0.01, 0);
  fruitBlob(o, p.fruit, x + 0.32, 1.85, z + 0.28, 1.5, r, 0.01, 0);
  o.fruit.add(new T.ConeGeometry(0.14, 0.4, 6), mat(x + 0.34, 1.45, z + 0.3, Math.PI), '#8b2c4a', 0.01, 0); // jantung pisang
  return 3.4;
}

function papaya(o: Out, p: Plot, r: () => number) {
  const { x, z } = p;
  o.plant.add(new T.CylinderGeometry(0.14, 0.22, 3.4, 7), mat(x, 1.7, z), '#a8a07a', 0.006, 0);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * 6.28;
    o.plant.add(new T.CylinderGeometry(0.03, 0.03, 1.4, 4), mat(x + Math.cos(a) * 0.6, 3.6, z + Math.sin(a) * 0.6, Math.sin(a) * 1, 0, -Math.cos(a) * 1), '#8db55a', 0.03, 3);
    o.plant.add(new T.IcosahedronGeometry(0.5, 0), mat(x + Math.cos(a) * 1.25, 3.95, z + Math.sin(a) * 1.25, 0, a, 0, 1, 0.25, 1), '#4f9a3a', 0.04, 3);
  }
  for (let i = 0; i < 5; i++) fruitBlob(o, p.fruit, x + Math.cos(i * 1.26) * 0.24, 3.05 - (i % 2) * 0.35, z + Math.sin(i * 1.26) * 0.24, 1, r, 0.005, 0);
  return 4.3;
}

function vine(o: Out, p: Plot, r: () => number) {
  const { x, z } = p;
  for (let i = 0; i < 12; i++) {
    const a = r() * 6.28,
      d = 0.4 + r() * 1.3;
    o.plant.add(new T.CircleGeometry(0.42, 6), mat(x + Math.cos(a) * d, 0.12 + r() * 0.15, z + Math.sin(a) * d, -Math.PI / 2 + (r() - 0.5) * 0.5, 0, r() * 6), LEAF[i % 4], 0.03, 0);
  }
  const big = p.fruit.shape === 'watermelon';
  fruitBlob(o, p.fruit, x - 0.35, big ? 0.36 : 0.3, z + 0.3, big ? 1 : 0.95, r, 0, 0);
  fruitBlob(o, p.fruit, x + 0.7, big ? 0.3 : 0.26, z - 0.4, big ? 0.8 : 0.8, r, 0, 0);
  return 1.2;
}

function pineapple(o: Out, p: Plot, r: () => number) {
  const { x, z } = p;
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * 6.28 + r() * 0.2;
    o.plant.add(new T.ConeGeometry(0.1, 1.5, 3), mat(x + Math.cos(a) * 0.45, 0.45, z + Math.sin(a) * 0.45, Math.sin(a) * 1.1, 0, -Math.cos(a) * 1.1, 1, 1, 0.4), '#4f8a3f', 0.04, 0);
  }
  fruitBlob(o, p.fruit, x, 0.95, z, 1.4, r, 0.01, 0.3);
  return 1.9;
}

function bush(o: Out, p: Plot, r: () => number) {
  const { x, z } = p;
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * 6.28;
    o.plant.add(new T.IcosahedronGeometry(0.42, 0), mat(x + Math.cos(a) * 0.55, 0.3, z + Math.sin(a) * 0.55, r(), r(), 0, 1, 0.55, 1), LEAF[i % 4], 0.03, 0, 0.15);
  }
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * 6.28 + 0.3;
    fruitBlob(o, p.fruit, x + Math.cos(a) * 0.85, 0.22, z + Math.sin(a) * 0.85, 1.6, r, 0.01, 0);
  }
  return 1;
}

function trellis(o: Out, p: Plot, r: () => number) {
  const { x, z } = p;
  const wood = '#9b6b3f';
  for (const [dx, dz] of [
    [-1.3, -0.7],
    [1.3, -0.7],
    [-1.3, 0.7],
    [1.3, 0.7],
  ])
    o.plant.add(new T.BoxGeometry(0.14, 2.4, 0.14), mat(x + dx, 1.2, z + dz), wood);
  for (const dz of [-0.7, 0.7]) o.plant.add(new T.BoxGeometry(2.8, 0.1, 0.1), mat(x, 2.4, z + dz), wood);
  for (let i = -2; i <= 2; i++) o.plant.add(new T.BoxGeometry(0.08, 0.08, 1.6), mat(x + i * 0.6, 2.46, z), wood);
  for (let i = 0; i < 14; i++) o.plant.add(new T.IcosahedronGeometry(0.42, 0), mat(x + (r() - 0.5) * 2.6, 2.55 + r() * 0.2, z + (r() - 0.5) * 1.4, r(), r(), 0, 1, 0.45, 1), LEAF[i % 4], 0.01, 0, 0.15);
  for (let i = 0; i < 6; i++) fruitBlob(o, p.fruit, x - 1.1 + i * 0.44, 2.05 - (i % 2) * 0.12, z + (i % 2 ? 0.35 : -0.35), p.fruit.shape === 'grapes' ? 1.5 : 1.2, r, 0.02, 1.5);
  return 3;
}

function cactus(o: Out, p: Plot, r: () => number) {
  const { x, z } = p;
  o.plant.add(new T.CylinderGeometry(0.12, 0.14, 2.2, 6), mat(x, 1.1, z), '#9b6b3f');
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * 6.28;
    o.plant.add(new T.BoxGeometry(0.16, 1.2, 0.08), mat(x + Math.cos(a) * 0.45, 2.1, z + Math.sin(a) * 0.45, Math.sin(a) * 0.9, -a, -Math.cos(a) * 0.9), '#6aa84f', 0.02, 1.5);
  }
  for (let i = 0; i < 4; i++) fruitBlob(o, p.fruit, x + Math.cos(i * 1.57 + 0.4) * 0.8, 1.9 + (i % 2) * 0.2, z + Math.sin(i * 1.57 + 0.4) * 0.8, 1.5, r, 0.01, 1.5);
  return 2.8;
}

function trunkFruit(o: Out, p: Plot, r: () => number) {
  const top = canopyTree({ plant: o.plant, fruit: new Merge() }, p, r, 1.1);
  // nangka/cempedak tumbuh langsung di batang
  for (let i = 0; i < 4; i++) fruitBlob(o, p.fruit, p.x + Math.cos(i * 1.6 + 0.5) * 0.42, 1.1 + i * 0.35, p.z + Math.sin(i * 1.6 + 0.5) * 0.42, 1.25, r, 0.003, 0);
  return top;
}

/** Bangun satu tanaman; mengembalikan tinggi puncaknya (untuk penanda). */
export function buildPlant(o: Out, p: Plot, seed: number) {
  const r = rnd(seed * 9301 + 49297);
  // tanah gembur di bawah tanaman
  o.plant.add(new T.CircleGeometry(p.kind === 'trellis' ? 2 : 1.6, 14), mat(p.x, 0.03, p.z, -Math.PI / 2), '#8a6240', 0, 0, 0.12);
  switch (p.kind) {
    case 'palm':
      return palm(o, p, r);
    case 'spiky':
      return spiky(o, p, r);
    case 'banana':
      return banana(o, p, r);
    case 'papaya':
      return papaya(o, p, r);
    case 'vine':
      return vine(o, p, r);
    case 'pineapple':
      return pineapple(o, p, r);
    case 'bush':
      return bush(o, p, r);
    case 'trellis':
      return trellis(o, p, r);
    case 'cactus':
      return cactus(o, p, r);
    case 'trunk':
      return trunkFruit(o, p, r);
    case 'shrub':
      return shrub(o, p, r);
    default:
      return canopyTree(o, p, r, 0.9 + r() * 0.2);
  }
}
