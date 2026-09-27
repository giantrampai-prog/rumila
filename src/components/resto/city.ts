// Kota di sekitar Rinoya Resto. Restoran berdiri di HOOK sebuah perempatan berlampu merah:
// jalan utama di depan (sumbu x) dan jalan simpang di sisi kanan (sumbu z). Lampu lalu lintas bekerja dengan fase
// hijau–kuning–merah + hitung mundur; mobil, taksi, bus kota dan motor (termasuk ojek online berjaket hijau dengan
// kotak antar makanan) berhenti & mengantre saat merah, pejalan kaki menyeberang di zebra cross saat aman.
// Area perkantoran dibuat seperti jalan protokol Jakarta: jalan lebar dengan median taman, jalur sepeda hijau,
// lampu jalan dua lengan, palem; gedung di sekitar resto bertingkat sedang & beragam (kaca, batu, jendela pita,
// ruko), gedung pencakar langit hanya di kejauhan. Gedung yang menghalangi kamera dibuat tembus pandang.
// Satuan: 1 = 1 meter. Lahan restoran di x −7…7, z −5…4.6.

import * as T from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { FRUIT_BY_ID } from '@/lib/fruits/catalog';
import { Merge, backdropTree, buildPlant, swayMaterial, type Kit } from '@/components/fruits/garden/build';
import * as TX from '@/components/fruits/garden/textures';

const std = (c: string, rough = 0.8, extra: T.MeshStandardMaterialParameters = {}) => new T.MeshStandardMaterial({ color: c, roughness: rough, ...extra });

function rnd(seed: number) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/* ---------------- geometri gabungan berwarna (1 draw call per kendaraan / orang) ---------------- */

const _m = new T.Matrix4(),
  _q = new T.Quaternion(),
  _e = new T.Euler(),
  _p = new T.Vector3(),
  _s = new T.Vector3();
function part(geo: T.BufferGeometry, color: string, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = sx, sz = sx) {
  const g = geo.index ? geo.toNonIndexed() : geo.clone();
  geo.dispose();
  _m.compose(_p.set(x, y, z), _q.setFromEuler(_e.set(rx, ry, rz)), _s.set(sx, sy, sz));
  g.applyMatrix4(_m);
  const c = new T.Color(color);
  const n = g.getAttribute('position').count;
  const a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    a[i * 3] = c.r;
    a[i * 3 + 1] = c.g;
    a[i * 3 + 2] = c.b;
  }
  g.setAttribute('color', new T.BufferAttribute(a, 3));
  return g;
}
function merged(parts: T.BufferGeometry[], mat: T.Material) {
  const g = mergeGeometries(parts)!;
  parts.forEach((p) => p.dispose());
  return new T.Mesh(g, mat);
}

/* ---------------- kendaraan ---------------- */

type CarKind = 'sedan' | 'mpv' | 'suv' | 'taxi' | 'bus';
const CAR_COL = ['#f4f4f2', '#c9ccd1', '#1d1f24', '#8a8f96', '#7a1f24', '#27456e', '#e8e4da', '#5a6068', '#f4f4f2', '#1d1f24'];

function carMesh(kind: CarKind, color: string, mat: T.Material) {
  const P: T.BufferGeometry[] = [];
  const glass = '#1b2733',
    dark = '#1a1a1a',
    tire = '#151515',
    rim = '#b8bcc2',
    head = '#fff4d0',
    tail = '#c01818';
  if (kind === 'bus') {
    const L = 11,
      Wd = 2.5;
    P.push(part(new T.BoxGeometry(L, 2.25, Wd), color, 0, 1.55, 0));
    P.push(part(new T.BoxGeometry(L - 0.6, 0.95, Wd + 0.02), glass, -0.1, 2.05, 0));
    P.push(part(new T.BoxGeometry(0.06, 1.4, Wd - 0.3), glass, L / 2 + 0.01, 1.9, 0));
    P.push(part(new T.BoxGeometry(L + 0.02, 0.22, Wd + 0.03), '#ffffff', 0, 1.25, 0));
    P.push(part(new T.BoxGeometry(3, 0.3, 1.6), '#dfe3e8', -1.5, 2.83, 0));
    P.push(part(new T.BoxGeometry(0.9, 1.8, 0.04), glass, 3.6, 1.4, Wd / 2 + 0.01));
    for (const x of [L / 2 - 2.1, -L / 2 + 2.4])
      for (const z of [-Wd / 2 + 0.05, Wd / 2 - 0.05]) {
        P.push(part(new T.CylinderGeometry(0.5, 0.5, 0.3, 16), tire, x, 0.5, z, Math.PI / 2));
        P.push(part(new T.CylinderGeometry(0.28, 0.28, 0.31, 10), rim, x, 0.5, z, Math.PI / 2));
      }
    for (const z of [-0.85, 0.85]) {
      P.push(part(new T.BoxGeometry(0.06, 0.2, 0.4), head, L / 2 + 0.02, 0.85, z));
      P.push(part(new T.BoxGeometry(0.06, 0.25, 0.3), tail, -L / 2 - 0.02, 0.9, z));
    }
    return { mesh: merged(P, mat), len: L };
  }
  const L = kind === 'suv' ? 4.7 : kind === 'sedan' ? 4.55 : 4.4;
  const Wd = 1.78;
  const bodyH = kind === 'suv' ? 0.78 : 0.62;
  const base = 0.32;
  P.push(part(new T.BoxGeometry(L, bodyH, Wd), color, 0, base + bodyH / 2, 0));
  P.push(part(new T.BoxGeometry(0.14, 0.24, Wd - 0.04), dark, L / 2, base + 0.12, 0));
  P.push(part(new T.BoxGeometry(0.14, 0.24, Wd - 0.04), dark, -L / 2, base + 0.12, 0));
  const cabL = kind === 'sedan' ? L * 0.52 : L * 0.66;
  const cabH = kind === 'suv' ? 0.64 : kind === 'sedan' ? 0.5 : 0.62;
  const cabX = kind === 'sedan' ? -0.2 : -0.35;
  P.push(part(new T.CylinderGeometry(0.74, 1, cabH, 4, 1).rotateY(Math.PI / 4), glass, cabX, base + bodyH + cabH / 2, 0, 0, 0, 0, cabL / 1.414, 1, (Wd - 0.12) / 1.414));
  P.push(part(new T.BoxGeometry(cabL * 0.72, 0.05, (Wd - 0.12) * 0.74), color, cabX, base + bodyH + cabH + 0.02, 0));
  for (const x of [L / 2 - 0.85, -L / 2 + 0.9])
    for (const z of [-Wd / 2 + 0.03, Wd / 2 - 0.03]) {
      P.push(part(new T.CylinderGeometry(0.33, 0.33, 0.24, 14), tire, x, 0.33, z, Math.PI / 2));
      P.push(part(new T.CylinderGeometry(0.2, 0.2, 0.25, 10), rim, x, 0.33, z, Math.PI / 2));
    }
  for (const z of [-0.6, 0.6]) {
    P.push(part(new T.BoxGeometry(0.06, 0.13, 0.38), head, L / 2 + 0.01, base + bodyH - 0.16, z));
    P.push(part(new T.BoxGeometry(0.06, 0.14, 0.32), tail, -L / 2 - 0.01, base + bodyH - 0.16, z));
  }
  P.push(part(new T.BoxGeometry(0.05, 0.16, 0.62), dark, L / 2 + 0.02, base + bodyH - 0.3, 0));
  for (const z of [-Wd / 2 - 0.08, Wd / 2 + 0.08]) P.push(part(new T.BoxGeometry(0.12, 0.1, 0.12), color, cabX + cabL * 0.42, base + bodyH + 0.12, z));
  if (kind === 'taxi') P.push(part(new T.BoxGeometry(0.5, 0.16, 0.22), '#fbfbf2', cabX, base + bodyH + cabH + 0.12, 0));
  return { mesh: merged(P, mat), len: L };
}

type Rider = 'gojek' | 'grab' | 'biasa';
function motorMesh(rider: Rider, r: () => number, mat: T.Material) {
  const pick = <V,>(a: V[]) => a[Math.floor(r() * a.length)];
  const P: T.BufferGeometry[] = [];
  const color = pick(['#1a1a1a', '#c8342a', '#f4f4f2', '#2a4a8a', '#8a8f96', '#1a1a1a']);
  for (const x of [0.66, -0.62]) {
    P.push(part(new T.CylinderGeometry(0.28, 0.28, 0.1, 14), '#141414', x, 0.28, 0, Math.PI / 2));
    P.push(part(new T.CylinderGeometry(0.15, 0.15, 0.11, 8), '#9aa0a8', x, 0.28, 0, Math.PI / 2));
  }
  P.push(part(new T.BoxGeometry(0.6, 0.08, 0.34), '#222222', 0.05, 0.36, 0));
  P.push(part(new T.BoxGeometry(0.12, 0.7, 0.36), color, 0.46, 0.68, 0, 0, 0, -0.35));
  P.push(part(new T.BoxGeometry(0.3, 0.08, 0.16), color, 0.66, 0.6, 0));
  P.push(part(new T.BoxGeometry(0.75, 0.34, 0.34), color, -0.42, 0.62, 0));
  P.push(part(new T.BoxGeometry(0.72, 0.1, 0.3), '#1a1a1a', -0.35, 0.84, 0));
  P.push(part(new T.BoxGeometry(0.08, 0.08, 0.66), '#2a2a2a', 0.52, 1.08, 0));
  P.push(part(new T.BoxGeometry(0.14, 0.12, 0.2), color, 0.56, 1.08, 0));
  P.push(part(new T.BoxGeometry(0.03, 0.08, 0.12), '#fff4d0', 0.64, 1.06, 0));
  P.push(part(new T.BoxGeometry(0.03, 0.06, 0.14), '#c01818', -0.8, 0.72, 0));
  // pengendara: ojol berjaket & helm hijau; lainnya jaket beragam
  const jacket = rider === 'gojek' ? '#00a53c' : rider === 'grab' ? '#00b14f' : pick(['#2d3e52', '#5a2a2a', '#3d5a80', '#6b6b6b', '#1f1f1f', '#8a5a34']);
  const helm = rider === 'gojek' ? '#0b7a2c' : rider === 'grab' ? '#00914a' : pick(['#1a1a1a', '#f4f4f4', '#c8342a', '#2a4a8a']);
  const pants = '#262c36';
  const riderAt = (x: number, jk: string, hm: string) => {
    for (const z of [-0.13, 0.13]) {
      P.push(part(new T.CapsuleGeometry(0.075, 0.34, 3, 6), pants, x + 0.1, 0.95, z, 0, 0, Math.PI / 2));
      P.push(part(new T.CapsuleGeometry(0.065, 0.3, 3, 6), pants, x + 0.3, 0.64, z, 0, 0, 0.25));
      P.push(part(new T.BoxGeometry(0.2, 0.08, 0.1), '#1a1a1a', x + 0.34, 0.44, z));
    }
    P.push(part(new T.CapsuleGeometry(0.17, 0.36, 4, 8), jk, x - 0.02, 1.28, 0, 0, 0, -0.25));
    P.push(part(new T.SphereGeometry(0.17, 12, 10), hm, x + 0.06, 1.72, 0));
    P.push(part(new T.BoxGeometry(0.08, 0.1, 0.22), '#1b2733', x + 0.22, 1.7, 0));
  };
  riderAt(-0.2, jacket, helm);
  for (const z of [-0.2, 0.2]) P.push(part(new T.CapsuleGeometry(0.055, 0.42, 3, 6), jacket, 0.2, 1.27, z, 0, 0, -2.0));
  if (rider !== 'biasa' && r() < 0.55) {
    // kotak antar makanan di jok belakang
    P.push(part(new T.BoxGeometry(0.44, 0.44, 0.44), rider === 'gojek' ? '#00a53c' : '#00b14f', -0.74, 1.12, 0));
    P.push(part(new T.BoxGeometry(0.45, 0.06, 0.45), '#f4f4f2', -0.74, 1.2, 0));
  } else if (r() < 0.45) riderAt(-0.62, pick(['#c8342a', '#f2d21a', '#3f7ac8', '#ffffff', '#8a5aa8']), rider === 'biasa' ? pick(['#f4f4f4', '#1a1a1a']) : helm);
  return { mesh: merged(P, mat), len: 1.9 };
}

/* ---------------- pejalan kaki ---------------- */

function pedestrian(r: () => number, mat: T.Material) {
  const pick = <V,>(a: V[]) => a[Math.floor(r() * a.length)];
  const hijab = r() < 0.35;
  const female = hijab || r() < 0.2;
  const skin = pick(['#e0b48a', '#c99466', '#a8764e', '#d9a67c']);
  const top = pick(['#ffffff', '#dfe9f5', '#2d3e52', '#8a2a3a', '#3f6a8a', '#e8d8b8', '#5a7a4a', '#f2b8c6', '#ffffff']);
  const bottom = pick(['#23262e', '#3a3f4a', '#5a4a3a', '#2a2a3a']);
  const P: T.BufferGeometry[] = [];
  P.push(part(new T.CapsuleGeometry(0.17, 0.4, 4, 10), top, 0, 1.13, 0, 0, 0, 0, 0.75, 1, 1));
  for (const z of [-0.22, 0.22]) P.push(part(new T.CapsuleGeometry(0.05, 0.48, 3, 6), top, 0, 1.08, z, z * 0.25));
  P.push(part(new T.SphereGeometry(0.115, 12, 10), skin, 0, 1.56, 0));
  if (hijab) {
    const hc = pick(['#e8b0c0', '#2d3e52', '#f4ecdc', '#6a4a7a', '#3f7a6a', '#c8a070']);
    P.push(part(new T.SphereGeometry(0.135, 12, 10), hc, -0.01, 1.58, 0));
    P.push(part(new T.CylinderGeometry(0.13, 0.25, 0.28, 12), hc, 0, 1.38, 0));
  } else P.push(part(new T.SphereGeometry(0.12, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2.1), pick(['#1a120c', '#2a1a10', '#3a2a1a']), -0.01, 1.58, 0));
  if (female && r() < 0.7) P.push(part(new T.CylinderGeometry(0.16, 0.26, 0.62, 12), bottom, 0, 0.55, 0));
  if (r() < 0.35) P.push(part(new T.BoxGeometry(0.1, 0.3, 0.25), pick(['#1a1a1a', '#6a4a2a', '#2a3a5a']), -0.18, 1.12, 0));
  const g = new T.Group();
  g.add(merged(P, mat));
  const legs: T.Object3D[] = [];
  for (const z of [-0.08, 0.08]) {
    const leg = new T.Group();
    leg.add(merged([part(new T.CapsuleGeometry(0.07, 0.62, 3, 6), bottom, 0, -0.38, 0), part(new T.BoxGeometry(0.22, 0.08, 0.1), '#1a1a1a', 0.05, -0.78, 0)], mat));
    leg.position.set(0, 0.82, z);
    g.add(leg);
    legs.push(leg);
  }
  return { g, legs };
}

/* ---------------- tekstur fasad ---------------- */

type Style = 'ruko' | 'curtain' | 'punched' | 'ribbon';

function canvas(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d')!);
  return c;
}

function glassFill(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, base: string, r: () => number) {
  const gr = g.createLinearGradient(x, y, x + w * 0.4, y + h);
  const lite = new T.Color(base).lerp(new T.Color('#dce8f2'), 0.45 + r() * 0.2);
  gr.addColorStop(0, '#' + lite.getHexString());
  gr.addColorStop(1, base);
  g.fillStyle = gr;
  g.fillRect(x, y, w, h);
}

/** Satu ubin fasad = 4 lantai × 4 bentang (ruko: 2 jendela per lantai). */
function facadeCanvas(style: Style, wall: string, glass: string, seed: number) {
  const r = rnd(seed);
  return canvas(256, 256, (g) => {
    if (style === 'curtain') {
      glassFill(g, 0, 0, 256, 256, glass, r);
      for (let f = 0; f < 4; f++)
        for (let b = 0; b < 8; b++) {
          g.fillStyle = `rgba(255,255,255,${(r() * 0.16).toFixed(3)})`;
          g.fillRect(b * 32, f * 64, 32, 54);
          if (r() < 0.15) {
            g.fillStyle = 'rgba(240,240,230,.35)'; // tirai
            g.fillRect(b * 32 + 2, f * 64 + 2, 28, 18 + r() * 20);
          }
        }
      g.fillStyle = 'rgba(10,20,30,.45)';
      for (let f = 0; f < 4; f++) g.fillRect(0, f * 64 + 54, 256, 10);
      g.fillStyle = 'rgba(210,220,228,.55)';
      for (let b = 0; b <= 8; b++) g.fillRect(b * 32 - 1, 0, b % 2 ? 1.5 : 3, 256);
      for (let f = 0; f <= 4; f++) g.fillRect(0, f * 64 - 1, 256, 2);
    } else if (style === 'punched') {
      g.fillStyle = wall;
      g.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 500; i++) {
        g.fillStyle = r() < 0.5 ? 'rgba(0,0,0,.035)' : 'rgba(255,255,255,.05)';
        g.fillRect(r() * 256, r() * 256, 3, 3);
      }
      for (let f = 0; f < 4; f++)
        for (let b = 0; b < 4; b++) {
          const x = b * 64 + 12,
            y = f * 64 + 12;
          g.fillStyle = 'rgba(0,0,0,.25)';
          g.fillRect(x - 2, y - 2, 44, 42);
          glassFill(g, x, y, 40, 38, glass, r);
          g.fillStyle = 'rgba(255,255,255,.5)';
          g.fillRect(x + 19, y, 2, 38);
          g.fillStyle = 'rgba(255,255,255,.35)';
          g.fillRect(x - 3, y + 38, 46, 4);
        }
      g.fillStyle = 'rgba(0,0,0,.08)';
      for (let f = 0; f < 4; f++) g.fillRect(0, f * 64 + 60, 256, 4);
    } else if (style === 'ribbon') {
      g.fillStyle = wall;
      g.fillRect(0, 0, 256, 256);
      for (let f = 0; f < 4; f++) {
        glassFill(g, 0, f * 64 + 20, 256, 38, glass, r);
        g.fillStyle = 'rgba(220,228,235,.6)';
        for (let b = 0; b <= 8; b++) g.fillRect(b * 32 - 1, f * 64 + 20, 2, 38);
        g.fillStyle = 'rgba(0,0,0,.18)';
        g.fillRect(0, f * 64 + 20, 256, 3);
      }
    } else {
      // ruko: 2 jendela per lantai, lis, AC luar, teralis
      g.fillStyle = wall;
      g.fillRect(0, 0, 256, 256);
      for (let f = 0; f < 4; f++) {
        for (const x of [22, 140]) {
          const y = f * 64 + 10;
          g.fillStyle = '#f4f4f0';
          g.fillRect(x - 4, y - 4, 102, 44);
          glassFill(g, x, y, 94, 36, glass, r);
          g.fillStyle = '#f4f4f0';
          g.fillRect(x + 45, y, 4, 36);
          if (r() < 0.3) {
            g.strokeStyle = 'rgba(40,40,40,.6)';
            g.lineWidth = 2;
            g.beginPath();
            for (let k = 8; k < 94; k += 10) {
              g.moveTo(x + k, y);
              g.lineTo(x + k, y + 36);
            }
            g.stroke();
          }
          if (r() < 0.25) {
            g.fillStyle = '#e8e8e4';
            g.fillRect(x + 60, y + 38, 30, 16);
            g.fillStyle = '#9a9a9a';
            g.beginPath();
            g.arc(x + 75, y + 46, 5, 0, Math.PI * 2);
            g.fill();
          }
        }
        g.fillStyle = 'rgba(0,0,0,.2)';
        g.fillRect(0, f * 64 + 56, 256, 4);
        g.fillStyle = 'rgba(255,255,255,.4)';
        g.fillRect(0, f * 64 + 54, 256, 2);
      }
    }
  });
}

function shopCanvas(name: string, wall: string, sign: string, seed: number) {
  const r = rnd(seed);
  return canvas(256, 128, (g) => {
    g.fillStyle = wall;
    g.fillRect(0, 0, 256, 128);
    g.fillStyle = sign;
    g.fillRect(6, 4, 244, 30);
    g.fillStyle = '#ffffff';
    g.font = '900 20px system-ui, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(name, 128, 20);
    if (r() < 0.45) {
      // rolling door setengah terbuka
      g.fillStyle = '#9aa0a6';
      g.fillRect(14, 40, 228, 50);
      g.fillStyle = 'rgba(0,0,0,.18)';
      for (let y = 42; y < 90; y += 5) g.fillRect(14, y, 228, 1.5);
      g.fillStyle = '#2d3238';
      g.fillRect(14, 90, 228, 38);
      g.fillStyle = '#f0d8a0';
      for (let k = 0; k < 6; k++) g.fillRect(24 + k * 36, 100 + (k % 2) * 8, 22, 20);
    } else {
      glassFill(g, 14, 40, 228, 88, '#6a8aa0', r);
      g.fillStyle = '#e8e8e4';
      g.fillRect(126, 40, 4, 88);
      g.fillStyle = '#3a3f46';
      g.fillRect(100, 60, 56, 68);
      g.fillStyle = 'rgba(255,240,200,.5)';
      g.fillRect(104, 64, 22, 60);
      g.fillRect(130, 64, 22, 60);
    }
  });
}

function lobbyCanvas(name: string, stone: string, glass: string, seed: number) {
  const r = rnd(seed);
  return canvas(256, 128, (g) => {
    g.fillStyle = stone;
    g.fillRect(0, 0, 256, 128);
    g.fillStyle = '#2a2f36';
    g.font = '800 15px system-ui, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(name, 128, 16);
    glassFill(g, 10, 30, 236, 98, glass, r);
    g.fillStyle = 'rgba(230,235,240,.7)';
    for (let x = 10; x <= 246; x += 29.5) g.fillRect(x - 1, 30, 2.5, 98);
    g.fillStyle = '#c9ccd1';
    g.beginPath();
    g.ellipse(128, 128, 26, 60, 0, Math.PI, 0);
    g.fill();
    glassFill(g, 108, 76, 40, 52, glass, r);
  });
}

function billboardCanvas(i: number) {
  const ads: [string, string, string, string][] = [
    ['Ayo Minum Air Putih!', '💧 8 gelas sehari', '#1f6fd1', '#ffffff'],
    ['Rinoya Academy', 'Belajar itu seru!', '#f2a21a', '#1f2f5a'],
    ['Buang Sampah', 'pada tempatnya ♻️', '#2e9d4a', '#ffffff'],
    ['Makan Buah Tiap Hari', '🍌🍎🍊 Sehat & kuat', '#e8504a', '#ffffff'],
    ['Hati-hati di Jalan', 'Pakai helm & sabuk', '#1f2f5a', '#ffe08a'],
  ];
  const [a, b, bg, fg] = ads[i % ads.length];
  return canvas(512, 192, (g) => {
    g.fillStyle = bg;
    g.fillRect(0, 0, 512, 192);
    g.fillStyle = 'rgba(255,255,255,.15)';
    g.beginPath();
    g.arc(430, 40, 140, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = fg;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = '900 52px system-ui, sans-serif';
    g.fillText(a, 256, 72);
    g.font = '700 34px system-ui, "Apple Color Emoji", sans-serif';
    g.fillText(b, 256, 140);
  });
}

/* ---------------- tata letak ---------------- */

const XW = 9.8, // tepi barat jalan simpang (sisi resto)
  XE = 16.8, // tepi timur jalan simpang
  XC = (XW + XE) / 2,
  ZN = 7.2; // tepi dekat jalan utama (depan resto)

interface Occluder {
  box: T.Box3;
  mats: T.Material[];
  op: number;
  faded: boolean;
}

interface Vehicle {
  mesh: T.Mesh;
  axis: 'x' | 'z';
  dir: 1 | -1;
  lane: number;
  lat: number;
  s: number;
  v: number;
  vmax: number;
  len: number;
  moto: boolean;
  stop: number;
  lo: number;
  hi: number;
}

interface Walker {
  g: T.Group;
  legs: T.Object3D[];
  axis: 'x' | 'z';
  fixed: number;
  s: number;
  dir: 1 | -1;
  speed: number;
  ph: number;
  lo: number;
  hi: number;
  zone: [number, number]; // zebra yang diseberangi
  cross: 'main' | 'side'; // jalan yang diseberangi
}

interface Head {
  lamps: T.MeshStandardMaterial[];
  colors: string[];
  group: 'main' | 'side';
  tex: T.CanvasTexture;
  ctx: CanvasRenderingContext2D;
  shown: string;
}

type Light = 'g' | 'y' | 'r';

const SHOPS: Record<string, string[]> = {
  sekolah: ['TOKO BUKU', 'FOTOKOPI', 'ES TEH', 'ALAT TULIS', 'BAKSO', 'MINIMARKET', 'ROTI', 'LES MUSIK', 'WARTEG', 'OPTIK'],
  kantor: ['KOPI', 'BANK', 'APOTEK', 'MINIMARKET', 'LAUNDRY', 'SALON', 'ROTI', 'OPTIK', 'SATE', 'MARTABAK'],
  perumahan: ['WARUNG', 'LAUNDRY', 'APOTEK', 'SAYUR', 'BENGKEL', 'ROTI', 'MINIMARKET', 'KLINIK', 'BAKSO', 'PULSA'],
};
const OFFICE_NAMES = ['WISMA NUSANTARA', 'GEDUNG SAMUDRA', 'MENARA KENARI', 'PLAZA MELATI', 'WISMA BAHARI', 'GRAHA CEMPAKA', 'GEDUNG PELANGI', 'MENARA SEROJA', 'WISMA GARUDA', 'GRAHA ANGGREK'];
const RUKO_WALL = ['#f2e8d4', '#f6ecc8', '#dfe9e0', '#f2d8c8', '#e4e4e8', '#f8f4ec', '#d8e4ee', '#efe0c0', '#e8d4cc'];
const SIGN = ['#c8342a', '#1f6fd1', '#2e9d4a', '#f2a21a', '#8a3aa8', '#1f2f5a', '#e8504a', '#0f8a8a'];
const GLASS = ['#3d6f7a', '#4a6f98', '#2f4a5f', '#4f7d74', '#6a7f8f', '#355a80', '#5b6f63'];
const STONE = ['#d8cfc0', '#c9c3b8', '#e6e0d4', '#b8b2a8', '#d4c8b4', '#e8e4dc'];

const _ray = new T.Ray();
const _hit = new T.Vector3();

export class City {
  group = new T.Group();
  private uTime = { value: 0 };
  private textures: T.Texture[] = [];
  private texCache = new Map<string, T.CanvasTexture>();
  private occ: Occluder[] = [];
  private cars: Vehicle[] = [];
  private walkers: Walker[] = [];
  private heads: Head[] = [];
  private readonly E: number; // tepi jauh jalan utama
  private readonly median: [number, number] | null;
  private readonly r: () => number;
  private main: Light = 'g';
  private side: Light = 'r';
  private leftMain = 0;
  private leftSide = 0;

  constructor(private loc: string) {
    this.r = rnd(loc.length * 977 + 13);
    const city = loc === 'kantor';
    this.E = city ? 25.2 : 12.8;
    this.median = city ? [15.2, 17.4] : null;
    this.buildGround();
    this.buildRoads();
    this.buildSignals();
    this.buildBlocks();
    this.buildGreenery();
    this.buildFurniture();
    this.buildTraffic();
    this.buildWalkers();
  }

  private add<O extends T.Object3D>(o: O) {
    this.group.add(o);
    return o;
  }

  private tex(key: string, make: () => HTMLCanvasElement, rx = 1, ry = 1) {
    let base = this.texCache.get(key);
    if (!base) {
      base = new T.CanvasTexture(make());
      base.colorSpace = T.SRGBColorSpace;
      base.anisotropy = 4;
      base.wrapS = base.wrapT = T.RepeatWrapping;
      this.texCache.set(key, base);
      this.textures.push(base);
    }
    if (rx === 1 && ry === 1) return base;
    const t = base.clone();
    t.repeat.set(rx, ry);
    t.needsUpdate = true;
    this.textures.push(t);
    return t;
  }

  /* ---------- tanah & jalan ---------- */

  private buildGround() {
    const ground = new T.Mesh(new T.PlaneGeometry(700, 700), std(this.loc === 'kantor' ? '#8a9c74' : '#86ad62', 1));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.add(ground);
  }

  private plane(w: number, d: number, x: number, z: number, y: number, mat: T.Material) {
    const m = new T.Mesh(new T.PlaneGeometry(w, d), mat);
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, y, z);
    m.receiveShadow = true;
    return this.add(m);
  }

  private asphalt(w: number, d: number) {
    const base = () =>
      canvas(256, 256, (g) => {
        g.fillStyle = '#56595f';
        g.fillRect(0, 0, 256, 256);
        const r = rnd(5);
        for (let i = 0; i < 3000; i++) {
          g.fillStyle = r() < 0.5 ? 'rgba(0,0,0,.14)' : 'rgba(255,255,255,.07)';
          g.fillRect(r() * 256, r() * 256, 2, 2);
        }
        for (let i = 0; i < 6; i++) {
          g.fillStyle = 'rgba(0,0,0,.06)';
          g.beginPath();
          g.ellipse(r() * 256, r() * 256, 30 + r() * 40, 10 + r() * 20, r() * 3, 0, Math.PI * 2);
          g.fill();
        }
      });
    return std('#ffffff', 0.95, { map: this.tex('asphalt', base, w / 12, d / 12) });
  }

  private _pave: T.Material | null = null;
  private walk(x0: number, x1: number, z0: number, z1: number) {
    if (!this._pave) {
      const t = this.tex('pave', () =>
        canvas(128, 128, (g) => {
          g.fillStyle = '#cfc8ba';
          g.fillRect(0, 0, 128, 128);
          g.strokeStyle = 'rgba(0,0,0,.12)';
          g.lineWidth = 2;
          g.beginPath();
          for (let i = 0; i <= 128; i += 32) {
            g.moveTo(i, 0);
            g.lineTo(i, 128);
            g.moveTo(0, i);
            g.lineTo(128, i);
          }
          g.stroke();
        }),
      );
      this._pave = new T.MeshStandardMaterial({ roughness: 0.95, map: t });
    }
    const m = new T.Mesh(new T.BoxGeometry(x1 - x0, 0.15, z1 - z0), this._pave);
    // ulangi ubin 1 per 2 m
    const uv = m.geometry.getAttribute('uv');
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * Math.max(1, (x1 - x0) / 2), uv.getY(i) * Math.max(1, (z1 - z0) / 2));
    m.position.set((x0 + x1) / 2, 0.075, (z0 + z1) / 2);
    m.receiveShadow = true;
    return this.add(m);
  }

  private buildRoads() {
    const E = this.E,
      city = this.loc === 'kantor';
    const W = E - ZN;
    // jalan utama dipotong di persimpangan; jalan simpang di depan & belakang persimpangan
    this.plane(XW + 220, W, (XW - 220) / 2, (ZN + E) / 2, 0.02, this.asphalt(XW + 220, W));
    this.plane(220 - XE, W, (XE + 220) / 2, (ZN + E) / 2, 0.02, this.asphalt(220 - XE, W));
    this.plane(XE - XW, W, XC, (ZN + E) / 2, 0.021, this.asphalt(XE - XW, W));
    this.plane(XE - XW, ZN + 220, XC, (ZN - 220) / 2, 0.02, this.asphalt(XE - XW, ZN + 220));
    this.plane(XE - XW, 220 - E, XC, (E + 220) / 2, 0.02, this.asphalt(XE - XW, 220 - E));

    const white = std('#f2f0e8', 0.7);
    const line = (w: number, d: number, x: number, z: number, m: T.Material = white) => this.plane(w, d, x, z, 0.03, m);
    const inInter = (x: number) => x > 5.2 && x < 21.4;
    const dashed = (z: number) => {
      for (let x = -214; x < 214; x += 6) if (!inInter(x) && !inInter(x + 3)) line(3, 0.14, x + 1.5, z);
    };
    if (city) {
      const [m0, m1] = this.median!;
      // jalur sepeda hijau di kedua tepi
      const green = std('#3f8f5a', 0.9);
      for (const [z0, z1] of [
        [ZN, ZN + 1.4],
        [E - 1.4, E],
      ])
        for (const [x0, x1] of [
          [-216, 5.2],
          [21.4, 216],
        ]) {
          this.plane(x1 - x0, z1 - z0, (x0 + x1) / 2, (z0 + z1) / 2, 0.025, green);
          line(x1 - x0, 0.12, (x0 + x1) / 2, z0 === ZN ? z1 : z0);
        }
      dashed((ZN + 1.4 + m0) / 2);
      dashed((m1 + E - 1.4) / 2);
      // median taman: tepi beton bergaris kuning-hitam + pagar tanaman berbunga
      const stripeMake = () =>
        canvas(64, 16, (g) => {
          for (let i = 0; i < 8; i++) {
            g.fillStyle = i % 2 ? '#1a1a1a' : '#f2c21a';
            g.fillRect(i * 8, 0, 8, 16);
          }
        });
      const hedgeMake = () =>
        canvas(128, 64, (g) => {
          g.fillStyle = '#3d7a34';
          g.fillRect(0, 0, 128, 64);
          const r = rnd(11);
          for (let i = 0; i < 900; i++) {
            g.fillStyle = ['#2f6a2a', '#4f9040', '#5aa04a', '#2a5a24'][Math.floor(r() * 4)];
            g.fillRect(r() * 128, r() * 64, 3, 3);
          }
          for (let i = 0; i < 40; i++) {
            g.fillStyle = r() < 0.5 ? '#e85a9a' : '#f2d21a';
            g.fillRect(r() * 128, r() * 20, 3, 3);
          }
        });
      const hedgeM = std('#ffffff', 0.95, { map: this.tex('hedge', hedgeMake, 2, 1) });
      for (const [x0, x1] of [
        [-216, 4.6],
        [22, 216],
      ]) {
        const len = x1 - x0;
        const st = new T.MeshStandardMaterial({ map: this.tex('curb', stripeMake, len / 1.2, 1), roughness: 0.8 });
        const concrete = std('#bfbab0', 0.9);
        const curb = new T.Mesh(new T.BoxGeometry(len, 0.3, m1 - m0), [concrete, concrete, std('#8a8a80', 0.95), concrete, st, st]);
        curb.position.set((x0 + x1) / 2, 0.15, (m0 + m1) / 2);
        curb.receiveShadow = true;
        this.add(curb);
        for (let x = x0 + 1; x < x1 - 5; x += 5.6) {
          const geo = new T.BoxGeometry(4.6, 0.8, 1.4, 6, 2, 2);
          const pos = geo.getAttribute('position');
          for (let i = 0; i < pos.count; i++) if (pos.getY(i) > 0.3) pos.setY(i, pos.getY(i) + Math.sin(pos.getX(i) * 3 + pos.getZ(i) * 5) * 0.06);
          geo.computeVertexNormals();
          const h = new T.Mesh(geo, hedgeM);
          h.position.set(x + 2.3, 0.7, (m0 + m1) / 2);
          h.castShadow = h.receiveShadow = true;
          this.add(h);
        }
      }
      const yel = std('#f2c21a', 0.7);
      line(430, 0.12, 0, m0 - 0.2, yel);
      line(430, 0.12, 0, m1 + 0.2, yel);
    } else dashed((ZN + E) / 2);
    // marka tengah jalan simpang
    for (let z = -214; z < 214; z += 6) {
      if (z > ZN - 6 && z < E + 4) continue;
      line(0.14, 3, XC, z + 1.5);
    }
    // garis henti
    const mid0 = this.median ? this.median[0] : (ZN + E) / 2;
    const mid1 = this.median ? this.median[1] : (ZN + E) / 2;
    line(0.4, mid0 - ZN, 5.6, (ZN + mid0) / 2);
    line(0.4, E - mid1, 21.0, (mid1 + E) / 2);
    line(XE - XC, 0.4, (XC + XE) / 2, 3.9);
    line(XC - XW, 0.4, (XW + XC) / 2, E + 3.3);
    // zebra cross: menyeberangi jalan utama (barat & timur persimpangan) dan jalan simpang (dekat & jauh)
    for (const x of [7.8, 19.2])
      for (let z = ZN + 0.5; z < E - 0.3; z += 1.0) {
        if (this.median && z > this.median[0] - 0.6 && z < this.median[1] + 0.3) continue;
        line(3.0, 0.5, x, z + 0.25);
      }
    for (const z of [5.8, E + 1.5]) for (let x = XW + 0.4; x < XE - 0.3; x += 1.0) line(0.5, 2.6, x + 0.25, z);

    // trotoar (4 kuadran perempatan)
    // halaman lahan resto (paving)
    const lot = this.plane(14.8, 13, -0.2, -3.3, 0.03, std('#b9b3a6', 0.95));
    lot.receiveShadow = true;
    this.walk(-220, XW, 3.2, ZN);
    this.walk(XE, 220, 3.2, ZN);
    this.walk(-220, XW, E, E + 3);
    this.walk(XE, 220, E, E + 3);
    this.walk(7.2, XW, -220, 3.2);
    this.walk(XE, 19.6, -220, 3.2);
    this.walk(7.2, XW, E + 3, 220);
    this.walk(XE, 19.6, E + 3, 220);
  }

  /* ---------- lampu lalu lintas ---------- */

  private buildSignals() {
    const E = this.E;
    const poleM = std('#3a3f46', 0.5, { metalness: 0.6 });
    const signal = (x: number, z: number, armDir: T.Vector3, face: number, armLen: number, group: 'main' | 'side') => {
      const g = new T.Group();
      g.position.set(x, 0.15, z);
      const pole = new T.Mesh(new T.CylinderGeometry(0.1, 0.12, 5.6, 10), poleM);
      pole.position.y = 2.8;
      pole.castShadow = true;
      g.add(pole);
      const arm = new T.Mesh(new T.CylinderGeometry(0.07, 0.07, armLen, 8), poleM);
      arm.position.copy(armDir).multiplyScalar(armLen / 2).setY(5.4);
      arm.rotation.set(armDir.z ? Math.PI / 2 : 0, 0, armDir.x ? Math.PI / 2 : 0);
      g.add(arm);
      const mk = (at: T.Vector3) => {
        const head = new T.Group();
        head.position.copy(at);
        head.rotation.y = face;
        head.add(new T.Mesh(new T.BoxGeometry(0.4, 1.2, 0.35), std('#1a1a1a', 0.5)));
        const plate = new T.Mesh(new T.BoxGeometry(0.62, 1.4, 0.04), std('#f2c21a', 0.6));
        plate.position.z = -0.2;
        head.add(plate);
        const colors = ['#ff2a1a', '#ffb21a', '#1aff6a'];
        const lamps = colors.map((c, i) => {
          const m = new T.MeshStandardMaterial({ color: '#222222', emissive: c, emissiveIntensity: 0, roughness: 0.3 });
          const l = new T.Mesh(new T.CylinderGeometry(0.13, 0.13, 0.06, 16), m);
          l.rotation.x = Math.PI / 2;
          l.position.set(0, 0.38 - i * 0.38, 0.19);
          const hood = new T.Mesh(new T.CylinderGeometry(0.16, 0.16, 0.14, 16, 1, true, 0, Math.PI), std('#111111', 0.5, { side: T.DoubleSide }));
          hood.rotation.set(Math.PI / 2, Math.PI / 2, 0);
          hood.position.set(0, 0.42 - i * 0.38, 0.26);
          head.add(l, hood);
          return m;
        });
        // papan hitung mundur
        const cv = document.createElement('canvas');
        cv.width = 64;
        cv.height = 48;
        const tex = new T.CanvasTexture(cv);
        tex.colorSpace = T.SRGBColorSpace;
        this.textures.push(tex);
        const cdb = new T.Mesh(new T.BoxGeometry(0.56, 0.44, 0.1), std('#1a1a1a', 0.5));
        cdb.position.set(0, -0.85, -0.04);
        const cd = new T.Mesh(new T.PlaneGeometry(0.5, 0.38), new T.MeshBasicMaterial({ map: tex }));
        cd.position.set(0, -0.85, 0.02);
        head.add(cdb, cd);
        g.add(head);
        this.heads.push({ lamps, colors, group, tex, ctx: cv.getContext('2d')!, shown: '' });
      };
      mk(armDir.clone().multiplyScalar(armLen - 0.4).setY(4.7));
      mk(armDir.clone().multiplyScalar(0.35).setY(3.1));
      this.add(g);
    };
    const armMain = this.median ? this.median[0] - ZN - 0.8 : (E - ZN) / 2 + 0.5;
    const armSide = (XE - XW) / 2 + 0.3;
    // di hook resto (sudut barat-dekat): untuk lalu lintas jalan utama yang bergerak ke +x
    signal(XW - 0.6, ZN - 0.4, new T.Vector3(0, 0, 1), -Math.PI / 2, armMain, 'main');
    // sudut timur-jauh: jalan utama ke −x
    signal(XE + 0.6, E + 0.4, new T.Vector3(0, 0, -1), Math.PI / 2, armMain, 'main');
    // sudut timur-dekat: jalan simpang ke +z
    signal(XE + 0.6, 3.4, new T.Vector3(-1, 0, 0), Math.PI, armSide, 'side');
    // sudut barat-jauh: jalan simpang ke −z
    signal(XW - 0.6, E + 3.6, new T.Vector3(1, 0, 0), 0, armSide, 'side');
  }

  /* ---------- gedung ---------- */

  private building(o: {
    x: number;
    z: number;
    w: number;
    d: number;
    floors: number;
    style: Style;
    ry?: number;
    wall?: string;
    glass?: string;
    name?: string;
    ground?: 'shop' | 'lobby' | 'none';
    billboard?: number;
    shadow?: boolean;
    props?: boolean;
  }) {
    const r = this.r;
    const pick = <V,>(a: V[]) => a[Math.floor(r() * a.length)];
    const ruko = o.style === 'ruko';
    const wall = o.wall ?? (ruko ? pick(RUKO_WALL) : pick(STONE));
    const glass = o.glass ?? pick(GLASS);
    const fh = ruko ? 3.2 : 3.4;
    const gH = ruko ? 3.6 : 4.6;
    const upper = Math.max(0, o.floors - 1);
    const H = gH + upper * fh;
    const g = new T.Group();
    const mats: T.Material[] = [];
    const M = (p: T.MeshStandardMaterialParameters) => {
      const m = new T.MeshStandardMaterial({ roughness: 0.85, ...p });
      mats.push(m);
      return m;
    };
    const tileW = ruko ? 4.5 : 12;
    const variant = Math.floor(r() * 3);
    const fkey = `${o.style}|${wall}|${glass}|${variant}`;
    const make = () => facadeCanvas(o.style, wall, glass, fkey.length * 31 + variant * 977);
    const glassy = o.style === 'curtain';
    const faceMat = (width: number) => M({ map: this.tex(fkey, make, width / tileW, upper / 4), roughness: glassy ? 0.25 : 0.85, metalness: glassy ? 0.35 : 0 });
    const plain = M({ color: wall });
    const roofM = M({ color: '#8a8a86', roughness: 0.95 });
    if (upper > 0) {
      const fw = faceMat(o.w);
      const side = ruko ? plain : faceMat(o.d);
      const body = new T.Mesh(new T.BoxGeometry(o.w, H - gH, o.d), [side, side, roofM, roofM, fw, ruko ? plain : fw]);
      body.position.y = gH + (H - gH) / 2;
      body.castShadow = o.shadow !== false;
      body.receiveShadow = true;
      g.add(body);
    }
    const par = new T.Mesh(new T.BoxGeometry(o.w + 0.1, 0.8, o.d + 0.1), [plain, plain, roofM, roofM, plain, plain]);
    par.position.y = H + 0.4;
    g.add(par);
    // lantai dasar: toko (ruko) atau lobi (kantor)
    const gKind = o.ground ?? (ruko ? 'shop' : 'lobby');
    let frontG: T.Material = plain;
    if (gKind === 'shop') {
      const name = o.name ?? 'TOKO';
      const sign = pick(SIGN);
      frontG = M({ map: this.tex(`shop|${name}|${wall}|${sign}`, () => shopCanvas(name, wall, sign, name.length * 7 + variant), o.w / 4.5, 1) });
    } else if (gKind === 'lobby') {
      const name = o.name ?? pick(OFFICE_NAMES);
      const stone = pick(STONE);
      frontG = M({ map: this.tex(`lobby|${name}|${glass}`, () => lobbyCanvas(name, stone, glass, name.length * 13)), roughness: 0.4 });
    }
    const gm = new T.Mesh(new T.BoxGeometry(o.w, gH, o.d), [plain, plain, roofM, roofM, frontG, plain]);
    gm.position.y = gH / 2;
    gm.castShadow = o.shadow !== false;
    gm.receiveShadow = true;
    g.add(gm);
    if (gKind !== 'none') {
      const canopy = new T.Mesh(new T.BoxGeometry(o.w - 0.3, 0.14, ruko ? 1.3 : 2.4), M({ color: ruko ? pick(['#e8504a', '#3f7ac8', '#f2b134', '#6aa84f', '#c8c8c8', '#8a5a34']) : '#c9ccd1', roughness: 0.6 }));
      canopy.position.set(0, gH - 0.35, o.d / 2 + (ruko ? 0.65 : 1.2));
      canopy.castShadow = true;
      g.add(canopy);
    }
    // perlengkapan atap (digabung): tandon, unit AC, rumah lift, antena
    if (o.props !== false) {
      const P: T.BufferGeometry[] = [];
      const top = H + 0.02;
      const n = ruko ? 1 : 2 + Math.floor(r() * 3);
      for (let i = 0; i < n; i++) P.push(part(new T.CylinderGeometry(0.6, 0.6, 1.3, 12), '#e8e8e8', (r() - 0.5) * (o.w - 2), top + 0.65, (r() - 0.5) * (o.d - 2)));
      for (let i = 0; i < (ruko ? 1 : 4); i++) P.push(part(new T.BoxGeometry(0.9, 0.6, 0.6), '#c9ccd1', (r() - 0.5) * (o.w - 2), top + 0.3, (r() - 0.5) * (o.d - 2)));
      if (!ruko) {
        P.push(part(new T.BoxGeometry(Math.min(6, o.w * 0.4), 2.6, Math.min(5, o.d * 0.4)), wall, (r() - 0.5) * 2, top + 1.3, (r() - 0.5) * 2));
        if (o.floors > 14) P.push(part(new T.CylinderGeometry(0.06, 0.1, 8, 6), '#9aa0a8', 1, top + 4, 1));
      }
      const pm = new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.7 });
      mats.push(pm);
      g.add(merged(P, pm));
    }
    // papan reklame di atap (pesan ramah anak)
    if (o.billboard !== undefined) {
      const bi = o.billboard;
      const bt = this.tex(`bb|${bi}`, () => billboardCanvas(bi));
      const bw = Math.min(10, o.w - 1);
      const y = H + 1.4 + bw * 0.19;
      const face = new T.Mesh(new T.PlaneGeometry(bw, bw * 0.375), M({ map: bt, roughness: 0.5, emissive: '#ffffff', emissiveMap: bt, emissiveIntensity: 0.15 }));
      face.position.set(0, y, o.d / 2 - 1);
      const back = new T.Mesh(new T.BoxGeometry(bw + 0.2, bw * 0.375 + 0.2, 0.2), M({ color: '#3a3f46' }));
      back.position.set(0, y, o.d / 2 - 1.12);
      g.add(face, back);
      for (const x of [-bw / 3, bw / 3]) {
        const leg = new T.Mesh(new T.BoxGeometry(0.2, 1.6, 0.2), M({ color: '#3a3f46' }));
        leg.position.set(x, H + 0.8, o.d / 2 - 1.12);
        g.add(leg);
      }
    }
    g.position.set(o.x, 0, o.z);
    g.rotation.y = o.ry ?? 0;
    this.add(g);
    g.updateMatrixWorld(true);
    this.occ.push({ box: new T.Box3().setFromObject(g), mats, op: 1, faded: false });
  }

  /** Isi deret [x0,x1] dengan bangunan yang menghadap ke jalan (face +1 → +z, −1 → −z). */
  private row(x0: number, x1: number, zFront: number, face: 1 | -1, kind: 'ruko' | 'kantor' | 'mix', maxFloors: number, second = false) {
    const r = this.r;
    const shops = SHOPS[this.loc] ?? SHOPS.kantor;
    const ry = face === 1 ? 0 : Math.PI;
    let x = x0;
    let bb = Math.floor(r() * 5);
    while (x < x1 - 4.5) {
      const office = kind === 'kantor' || (kind === 'mix' && r() < 0.5);
      if (!office) {
        // blok ruko 2–4 unit berdempet, tinggi & warna berbeda
        const units = 2 + Math.floor(r() * 3);
        for (let u = 0; u < units && x < x1 - 4.5; u++) {
          const d = 12;
          this.building({ x: x + 2.25, z: zFront - (face * d) / 2, w: 4.45, d, floors: 2 + Math.floor(r() * Math.min(3, maxFloors - 1)), style: 'ruko', ry, name: shops[Math.floor(r() * shops.length)], shadow: !second });
          x += 4.5;
        }
        x += 1.5 + r() * 2;
      } else {
        const w = Math.min(x1 - x, 12 + Math.floor(r() * 3) * 3);
        if (w < 8) break;
        const d = 14 + Math.floor(r() * 3) * 2;
        const style = (['curtain', 'punched', 'ribbon', 'curtain'] as Style[])[Math.floor(r() * 4)];
        const floors = Math.max(3, Math.round(maxFloors * (0.55 + r() * 0.45)));
        this.building({ x: x + w / 2, z: zFront - (face * d) / 2, w, d, floors, style, ry, billboard: !second && r() < 0.35 ? bb++ : undefined, shadow: !second });
        x += w + 2 + r() * 3;
      }
    }
  }

  private buildBlocks() {
    const E = this.E,
      loc = this.loc,
      r = this.r;
    const kantor = loc === 'kantor';
    // sisi resto: tetangga kiri ruko rendah; seberang jalan simpang (timur)
    this.row(-100, -7.6, 3.2, 1, 'ruko', 4);
    this.row(19.8, 100, 3.2, 1, kantor ? 'mix' : 'ruko', kantor ? 7 : 4);
    // seberang jalan utama: bangunan umum, tidak terlalu tinggi, agar seimbang dengan resto
    if (loc === 'sekolah') {
      this.building({ x: -6, z: E + 9.4, w: 26, d: 12, floors: 3, style: 'punched', wall: '#f0e8d8', glass: '#6a8aa0', ry: Math.PI, ground: 'lobby', name: 'SD RINOYA' });
      const postM = std('#3a5a8a', 0.6);
      for (let x = -19; x <= 7; x += 1) {
        const post = new T.Mesh(new T.BoxGeometry(0.08, 1.2, 0.08), postM);
        post.position.set(x, 0.75, E + 3.2);
        this.add(post);
      }
      const pole = new T.Mesh(new T.CylinderGeometry(0.05, 0.05, 7, 8), std('#dddddd', 0.4, { metalness: 0.6 }));
      pole.position.set(-16, 3.5, E + 4.4);
      this.add(pole);
      const red = new T.Mesh(new T.PlaneGeometry(1.5, 0.5), std('#e0262b', 0.8, { side: T.DoubleSide }));
      const white = new T.Mesh(new T.PlaneGeometry(1.5, 0.5), std('#ffffff', 0.8, { side: T.DoubleSide }));
      red.position.set(-15.2, 6.55, E + 4.4);
      white.position.set(-15.2, 6.05, E + 4.4);
      this.add(red);
      this.add(white);
      this.row(-100, -21, E + 3.2, -1, 'ruko', 4);
      this.row(19.8, 100, E + 3.2, -1, 'ruko', 4);
    } else if (loc === 'perumahan') {
      for (let x = -94; x < 96; x += 9) if (x < 2 || x > 24) this.house(x, E + 8);
    } else {
      this.row(-100, 7.0, E + 3.2, -1, 'mix', 8);
      this.row(19.8, 100, E + 3.2, -1, 'mix', 9);
    }
    // baris kedua supaya kota terasa padat
    const back = kantor ? 'kantor' : 'ruko';
    this.row(-100, 7.0, -10.5, 1, back, kantor ? 11 : 4, true);
    this.row(19.8, 100, -14, 1, back, kantor ? 12 : 4, true);
    if (loc === 'perumahan') {
      for (let x = -94; x < 96; x += 9) if (x < 2 || x > 24) this.house(x, E + 22);
    } else {
      this.row(-100, 7.0, E + 22, -1, back, kantor ? 12 : 4, true);
      this.row(19.8, 100, E + 22, -1, back, kantor ? 12 : 4, true);
    }
    // gedung di kejauhan (latar kota): pencakar langit hanya di area perkantoran
    for (let i = 0; i < (kantor ? 24 : 10); i++) {
      const a = r() * Math.PI * 2;
      const d = 110 + r() * 90;
      const x = Math.cos(a) * d,
        z = Math.sin(a) * d;
      this.building({
        x,
        z,
        w: 16 + Math.floor(r() * 3) * 4,
        d: 16 + Math.floor(r() * 3) * 4,
        floors: kantor ? 18 + Math.floor(r() * 26) : 5 + Math.floor(r() * 6),
        style: kantor ? (['curtain', 'punched', 'ribbon', 'curtain'] as Style[])[Math.floor(r() * 4)] : 'punched',
        ry: Math.atan2(-x, -z),
        ground: 'none',
        shadow: false,
        props: false,
      });
    }
  }

  private house(x: number, z: number) {
    const r = this.r;
    const g = new T.Group();
    const mats: T.Material[] = [];
    const M = (col: string, rough = 0.9) => {
      const m = std(col, rough);
      mats.push(m);
      return m;
    };
    const h = new T.Mesh(new T.BoxGeometry(7, 3.2, 7), M(RUKO_WALL[Math.floor(r() * RUKO_WALL.length)]));
    h.position.y = 1.6;
    h.castShadow = h.receiveShadow = true;
    const roof = new T.Mesh(new T.ConeGeometry(5.4, 2.4, 4), M(['#a8442e', '#6a4a3a', '#3a5a6a', '#8a3a2a'][Math.floor(r() * 4)]));
    roof.rotation.y = Math.PI / 4;
    roof.position.y = 4.4;
    roof.castShadow = true;
    g.add(h, roof);
    const door = new T.Mesh(new T.PlaneGeometry(0.9, 2), M('#6a4a3a'));
    door.position.set(1.4, 1.0, -3.51);
    door.rotation.y = Math.PI;
    g.add(door);
    for (const s of [-2.4, 2.4]) {
      const w = new T.Mesh(new T.PlaneGeometry(1.2, 1), M('#6a8aa0', 0.2));
      w.position.set(s, 1.8, -3.51);
      w.rotation.y = Math.PI;
      g.add(w);
    }
    const fence = new T.Mesh(new T.BoxGeometry(8, 1.1, 0.12), M('#f4f4f0'));
    fence.position.set(0, 0.55, -5);
    g.add(fence);
    g.position.set(x, 0, z);
    this.add(g);
    g.updateMatrixWorld(true);
    this.occ.push({ box: new T.Box3().setFromObject(g), mats, op: 1, faded: false });
  }

  /* ---------- pohon & palem (model realistis dari Kebun Rinoya) ---------- */

  private buildGreenery() {
    const r = this.r,
      E = this.E;
    const kit: Kit = { bark: new Merge(), leaf: new Merge(), plain: new Merge() };
    const S = 0.62;
    let seed = 700;
    const tree = (x: number, z: number) => backdropTree(kit, x / S, z / S, 0.15 / S, 1.05 + r() * 0.35, seed++);
    const coconut = FRUIT_BY_ID.get('kelapa');
    const palm = (x: number, z: number, y = 0.15) => {
      if (coconut) buildPlant(kit, { fruit: coconut, kind: 'palm', zone: coconut.group, x: x / S, z: z / S, y: y / S, reach: 1 }, 3000 + seed++, false);
    };
    const free = (x: number) => x < 3.5 || x > 23;
    for (let x = -92; x <= 92; x += 9) {
      if (free(x) && Math.abs(x) > 8) tree(x + (r() - 0.5), ZN - 0.7);
      if (free(x + 3)) tree(x + 3 + (r() - 0.5), E + 0.8);
    }
    for (let z = -90; z <= 90; z += 10) {
      if (z > -6 && z < E + 6) continue;
      tree(7.6, z);
      tree(19.1, z + 4);
    }
    if (this.median) {
      const mz = (this.median[0] + this.median[1]) / 2;
      for (let x = -90; x <= 90; x += 20) if (free(x + 10)) palm(x + 10, mz, 0.3);
      for (let x = -94; x <= 94; x += 13) if (free(x) && r() < 0.6) palm(x, E + 2.6);
    }
    const flora = new T.Group();
    flora.scale.setScalar(S);
    const barkMap = TX.bark(),
      leafMap = TX.foliageAtlas();
    this.textures.push(barkMap, leafMap);
    for (const m of [
      kit.bark.empty ? null : kit.bark.build(swayMaterial(this.uTime, { map: barkMap, roughness: 0.95 })),
      kit.leaf.empty ? null : kit.leaf.build(swayMaterial(this.uTime, { map: leafMap, alphaTest: 0.5, side: T.DoubleSide, roughness: 0.8 }, true)),
      kit.plain.empty ? null : kit.plain.build(swayMaterial(this.uTime, { roughness: 0.8 })),
    ])
      if (m) {
        m.castShadow = true;
        m.receiveShadow = true;
        flora.add(m);
      }
    this.add(flora);
  }

  /* ---------- perabot jalan ---------- */

  private buildFurniture() {
    const E = this.E;
    const P: T.BufferGeometry[] = [];
    const grey = '#5a6068';
    const lamp = (x: number, z: number, dz: number, two = false) => {
      P.push(part(new T.CylinderGeometry(0.08, 0.12, 8, 8), grey, x, 4.1, z));
      for (const s of two ? [-1, 1] : [dz]) {
        P.push(part(new T.BoxGeometry(0.1, 0.1, 1.8), grey, x, 8.1, z + s * 0.9, s * -0.2));
        P.push(part(new T.BoxGeometry(0.35, 0.12, 0.6), '#f4f0e0', x, 8.2, z + s * 1.8));
      }
    };
    const skip = (x: number) => x > 3 && x < 23;
    for (let x = -90; x <= 90; x += 16) {
      if (!skip(x)) lamp(x, ZN - 0.35, 1);
      if (!skip(x + 8)) lamp(x + 8, E + 0.35, -1);
      if (this.median && !skip(x + 4)) lamp(x + 4, (this.median[0] + this.median[1]) / 2, 0, true);
    }
    for (let z = -88; z <= 88; z += 16) {
      if (z > -4 && z < E + 4) continue;
      P.push(part(new T.CylinderGeometry(0.08, 0.12, 8, 8), grey, XW - 0.35, 4.1, z));
      P.push(part(new T.BoxGeometry(1.8, 0.1, 0.1), grey, XW + 0.55, 8.1, z));
      P.push(part(new T.BoxGeometry(0.6, 0.12, 0.35), '#f4f0e0', XW + 1.4, 8.2, z));
    }
    // tiang pembatas kuning-hitam (perkantoran) & pot tanaman beton di trotoar
    if (this.loc === 'kantor')
      for (let x = -60; x <= 60; x += 3) {
        if (skip(x) || Math.abs(x) < 8) continue;
        P.push(part(new T.CylinderGeometry(0.1, 0.1, 0.9, 8), '#f2c21a', x, 0.6, ZN - 0.25));
        P.push(part(new T.CylinderGeometry(0.105, 0.105, 0.2, 8), '#1a1a1a', x, 0.75, ZN - 0.25));
      }
    for (let x = -80; x <= 80; x += 18) {
      if (skip(x + 4.5) || Math.abs(x + 4.5) < 10) continue;
      P.push(part(new T.BoxGeometry(1.4, 0.7, 0.9), '#e8e4dc', x + 4.5, 0.5, 3.9));
      P.push(part(new T.SphereGeometry(0.55, 10, 8), '#4f8a3a', x + 4.5, 1.0, 3.9, 0, 0, 0, 1.2, 0.8, 0.8));
    }
    const furn = merged(P, new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.55, metalness: 0.3 }));
    furn.castShadow = true;
    this.add(furn);
    // halte bus di seberang
    const shelter = new T.Group();
    const roofS = new T.Mesh(new T.BoxGeometry(5, 0.14, 2), std('#2a5ab8', 0.5));
    roofS.position.y = 2.7;
    const glassW = new T.Mesh(new T.BoxGeometry(5, 1.8, 0.05), std('#cfe6f5', 0.1, { transparent: true, opacity: 0.35 }));
    glassW.position.set(0, 1.5, 0.9);
    const bench = new T.Mesh(new T.BoxGeometry(3.4, 0.1, 0.5), std('#8a8f96', 0.5, { metalness: 0.5 }));
    bench.position.set(0, 0.55, 0.5);
    shelter.add(roofS, glassW, bench);
    for (const x of [-2.4, 2.4]) {
      const p = new T.Mesh(new T.BoxGeometry(0.1, 2.7, 0.1), std('#3a3f46', 0.4, { metalness: 0.6 }));
      p.position.set(x, 1.35, 0.9);
      shelter.add(p);
    }
    shelter.position.set(-34, 0.15, E + 1.6);
    this.add(shelter);
    // mesin minuman khas Jepang di sebelah resto
    const vend = new T.Mesh(new T.BoxGeometry(0.9, 1.9, 0.7), std('#e8322a', 0.4));
    vend.position.set(-6.85, 1.1, 3.9);
    vend.castShadow = true;
    const vwin = new T.Mesh(new T.PlaneGeometry(0.7, 0.9), std('#cfe6ff', 0.2, { emissive: '#a0c8ff', emissiveIntensity: 0.4 }));
    vwin.position.set(-6.85, 1.4, 4.26);
    this.add(vend);
    this.add(vwin);
  }

  /* ---------- lalu lintas ---------- */

  private buildTraffic() {
    const r = this.r,
      E = this.E;
    const mat = new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.42, metalness: 0.25 });
    const city = this.loc === 'kantor';
    // lajur kiri (lalu lintas Indonesia): yang ke +x di sisi dekat, yang ke −x di sisi jauh
    const lanes: { axis: 'x' | 'z'; dir: 1 | -1; c: number; n: number; stop: number; lo: number; hi: number; moto: number }[] = [];
    if (city) {
      const [m0, m1] = this.median!;
      const nb = ZN + 1.4;
      lanes.push({ axis: 'x', dir: 1, c: nb + (m0 - nb) / 4, n: 14, stop: 5.4, lo: -120, hi: 120, moto: 0.65 });
      lanes.push({ axis: 'x', dir: 1, c: nb + ((m0 - nb) * 3) / 4, n: 9, stop: 5.4, lo: -120, hi: 120, moto: 0.3 });
      const fb = E - 1.4;
      lanes.push({ axis: 'x', dir: -1, c: m1 + (fb - m1) / 4, n: 9, stop: 21.2, lo: -120, hi: 120, moto: 0.3 });
      lanes.push({ axis: 'x', dir: -1, c: m1 + ((fb - m1) * 3) / 4, n: 14, stop: 21.2, lo: -120, hi: 120, moto: 0.65 });
    } else {
      lanes.push({ axis: 'x', dir: 1, c: ZN + (E - ZN) / 4, n: 12, stop: 5.4, lo: -120, hi: 120, moto: 0.6 });
      lanes.push({ axis: 'x', dir: -1, c: ZN + ((E - ZN) * 3) / 4, n: 12, stop: 21.2, lo: -120, hi: 120, moto: 0.6 });
    }
    lanes.push({ axis: 'z', dir: 1, c: XC + (XE - XC) / 2, n: 9, stop: 3.7, lo: -110, hi: E + 110, moto: 0.6 });
    lanes.push({ axis: 'z', dir: -1, c: XW + (XC - XW) / 2, n: 9, stop: E + 3.5, lo: -110, hi: E + 110, moto: 0.6 });
    for (const L of lanes) {
      const span = L.hi - L.lo;
      for (let i = 0; i < L.n; i++) {
        const moto = r() < L.moto;
        let built: { mesh: T.Mesh; len: number };
        let vmax: number;
        if (moto) {
          const k = r();
          built = motorMesh(k < 0.3 ? 'gojek' : k < 0.55 ? 'grab' : 'biasa', r, mat);
          vmax = 9 + r() * 3;
        } else {
          const k = r();
          const kind: CarKind = city && k < 0.08 ? 'bus' : k < 0.25 ? 'taxi' : k < 0.5 ? 'mpv' : k < 0.75 ? 'suv' : 'sedan';
          built = carMesh(kind, kind === 'taxi' ? '#4aa3df' : kind === 'bus' ? '#1f6fd1' : CAR_COL[Math.floor(r() * CAR_COL.length)], mat);
          vmax = kind === 'bus' ? 7 : 8 + r() * 3;
        }
        built.mesh.castShadow = true;
        this.add(built.mesh);
        this.cars.push({
          mesh: built.mesh,
          axis: L.axis,
          dir: L.dir,
          lane: L.c,
          lat: moto ? (r() - 0.5) * 2.0 : (r() - 0.5) * 0.3,
          s: L.lo + ((i + r() * 0.5) / L.n) * span,
          v: vmax * 0.6,
          vmax,
          len: built.len,
          moto,
          stop: L.stop,
          lo: L.lo,
          hi: L.hi,
        });
      }
    }
  }

  private buildWalkers() {
    const r = this.r,
      E = this.E;
    const mat = new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.8 });
    const paths: { axis: 'x' | 'z'; fixed: number; lo: number; hi: number; zone: [number, number]; cross: 'main' | 'side'; n: number }[] = [
      { axis: 'x', fixed: 5.3, lo: -80, hi: 80, zone: [XW - 0.3, XE + 0.3], cross: 'side', n: 12 },
      { axis: 'x', fixed: E + 1.6, lo: -80, hi: 80, zone: [XW - 0.3, XE + 0.3], cross: 'side', n: 10 },
      { axis: 'z', fixed: 8.6, lo: -70, hi: E + 70, zone: [ZN - 0.3, E + 0.3], cross: 'main', n: 5 },
      { axis: 'z', fixed: 17.9, lo: -70, hi: E + 70, zone: [ZN - 0.3, E + 0.3], cross: 'main', n: 5 },
    ];
    for (const p of paths)
      for (let i = 0; i < p.n; i++) {
        const w = pedestrian(r, mat);
        w.g.traverse((o) => ((o as T.Mesh).isMesh ? (o.castShadow = true) : null));
        this.add(w.g);
        let s = p.lo + r() * (p.hi - p.lo);
        if (s > p.zone[0] && s < p.zone[1]) s = p.zone[0] - 2;
        this.walkers.push({ ...w, axis: p.axis, fixed: p.fixed + (r() - 0.5) * 0.6, s, dir: r() < 0.5 ? 1 : -1, speed: 1.0 + r() * 0.4, ph: r() * 6, lo: p.lo, hi: p.hi, zone: p.zone, cross: p.cross });
      }
  }

  /* ---------- pembaruan tiap frame ---------- */

  private readonly CYCLE = 42;
  private updateSignals(t: number) {
    // utama hijau 0–17, kuning 17–20, semua merah 20–22, simpang hijau 22–37, kuning 37–40, semua merah 40–42
    const c = t % this.CYCLE;
    const [main, lm]: [Light, number] = c < 17 ? ['g', 17 - c] : c < 20 ? ['y', 20 - c] : ['r', this.CYCLE - c];
    const [side, ls]: [Light, number] = c >= 22 && c < 37 ? ['g', 37 - c] : c >= 37 && c < 40 ? ['y', 40 - c] : ['r', c < 22 ? 22 - c : this.CYCLE - c + 22];
    this.main = main;
    this.side = side;
    this.leftMain = lm;
    this.leftSide = ls;
    for (const h of this.heads) {
      const st = h.group === 'main' ? this.main : this.side;
      const left = Math.ceil(h.group === 'main' ? this.leftMain : this.leftSide);
      h.lamps.forEach((m, i) => {
        const on = (i === 0 && st === 'r') || (i === 1 && st === 'y') || (i === 2 && st === 'g');
        m.emissiveIntensity = on ? 2.2 : 0;
        m.color.set(on ? h.colors[i] : '#222222');
      });
      const txt = `${st}${left}`;
      if (txt !== h.shown) {
        h.shown = txt;
        const g = h.ctx;
        g.fillStyle = '#0a0a0a';
        g.fillRect(0, 0, 64, 48);
        g.fillStyle = st === 'g' ? '#3aff7a' : st === 'y' ? '#ffc21a' : '#ff3a2a';
        g.font = '900 34px ui-monospace, monospace';
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillText(String(left).padStart(2, '0'), 32, 26);
        h.tex.needsUpdate = true;
      }
    }
  }

  update(t: number, dt: number, cam?: T.Camera, target?: T.Vector3) {
    this.uTime.value = t;
    this.updateSignals(t);
    // kendaraan: jaga jarak dengan yang di depan, berhenti di garis henti saat lampu tidak hijau
    for (const c of this.cars) {
      const light = c.axis === 'x' ? this.main : this.side;
      const front = c.s + (c.dir * c.len) / 2;
      let want = c.vmax;
      const toStop = (c.stop - front) * c.dir;
      if (light !== 'g' && toStop > -0.2 && toStop < 45) {
        const mustStop = light === 'r' || toStop > ((c.v * c.v) / 14) * 0.7;
        if (mustStop) want = Math.min(want, Math.sqrt(12 * Math.max(0, toStop - 0.3)));
      }
      let best = Infinity,
        lead: Vehicle | null = null;
      for (const o of this.cars) {
        if (o === c || o.axis !== c.axis || o.dir !== c.dir || o.lane !== c.lane) continue;
        if (Math.abs(o.lat - c.lat) > (c.moto && o.moto ? 0.7 : c.moto || o.moto ? 1.1 : 1.6)) continue;
        const ahead = (o.s - c.s) * c.dir;
        if (ahead > 0 && ahead < best) {
          best = ahead;
          lead = o;
        }
      }
      if (lead) {
        const gap = best - (c.len + lead.len) / 2;
        want = Math.min(want, gap < 1.2 ? 0 : lead.v + (gap - 1.2) * 0.9);
      }
      c.v = Math.max(0, c.v + T.MathUtils.clamp(want - c.v, -9 * dt, 3 * dt));
      c.s += c.dir * c.v * dt;
      if (c.s > c.hi) c.s = c.lo;
      if (c.s < c.lo) c.s = c.hi;
      if (c.axis === 'x') {
        c.mesh.position.set(c.s, 0.02, c.lane + c.lat);
        c.mesh.rotation.y = c.dir > 0 ? 0 : Math.PI;
      } else {
        c.mesh.position.set(c.lane + c.lat, 0.02, c.s);
        c.mesh.rotation.y = c.dir > 0 ? -Math.PI / 2 : Math.PI / 2;
      }
    }
    // pejalan kaki: menunggu di tepi zebra sampai kendaraan di jalan itu berhenti & waktunya cukup
    for (const w of this.walkers) {
      const [z0, z1] = w.zone;
      const inside = w.s > z0 && w.s < z1;
      const sp = w.speed * (inside ? 1.8 : 1);
      const next = w.s + w.dir * sp * dt;
      const entering = !inside && next > z0 && next < z1;
      let ok = true;
      if (entering) {
        const need = (z1 - z0) / (w.speed * 1.8) + 0.5;
        ok = w.cross === 'side' ? this.side === 'r' && this.main === 'g' && this.leftMain > need : this.main === 'r' && this.side === 'g' && this.leftSide > need;
      }
      if (ok) w.s = next;
      if (w.s > w.hi) w.dir = -1;
      if (w.s < w.lo) w.dir = 1;
      const ph = ok ? Math.sin(t * 6 * sp + w.ph) : 0;
      if (w.axis === 'x') {
        w.g.position.set(w.s, 0.15 + Math.abs(ph) * 0.03, w.fixed);
        w.g.rotation.y = w.dir > 0 ? 0 : Math.PI;
      } else {
        w.g.position.set(w.fixed, 0.15 + Math.abs(ph) * 0.03, w.s);
        w.g.rotation.y = w.dir > 0 ? -Math.PI / 2 : Math.PI / 2;
      }
      w.legs[0].rotation.z = ph * 0.5;
      w.legs[1].rotation.z = -ph * 0.5;
    }
    // gedung yang menghalangi pandangan kamera ke resto dibuat tembus pandang
    if (cam && target) {
      const from = cam.position;
      const dist = from.distanceTo(target);
      _ray.origin.copy(from);
      _ray.direction.copy(target).sub(from).normalize();
      for (const o of this.occ) {
        const hit = o.box.containsPoint(from) || (_ray.intersectBox(o.box, _hit) !== null && from.distanceTo(_hit) < dist - 0.5);
        o.op = T.MathUtils.damp(o.op, hit ? 0.15 : 1, 8, dt);
        const fade = o.op < 0.98;
        if (fade !== o.faded) {
          o.faded = fade;
          for (const m of o.mats) {
            m.transparent = fade;
            m.depthWrite = !fade;
            m.opacity = fade ? o.op : 1;
            m.needsUpdate = true;
          }
        } else if (fade) for (const m of o.mats) m.opacity = o.op;
      }
    }
  }

  dispose() {
    this.group.traverse((o) => {
      const m = o as T.Mesh;
      m.geometry?.dispose();
      const mt = m.material as T.Material | T.Material[] | undefined;
      if (Array.isArray(mt)) mt.forEach((x) => x.dispose());
      else mt?.dispose();
    });
    this.textures.forEach((t) => t.dispose());
  }
}
