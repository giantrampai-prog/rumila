// Tokoh manusia bersendi untuk Rinoya Resto (pelanggan, staf, pejalan kaki). Proporsi orang dewasa ±1,7 m:
// panggul, dada, kepala, serta lengan (bahu–siku) dan kaki (pinggul–lutut) yang bisa ditekuk, jadi orang
// berjalan dengan ayunan tangan-kaki, duduk di kursi dengan paha mendatar, dan menyuap makanan.
// Tiap bagian kaku = satu mesh berwarna verteks dengan satu material bersama (hemat draw call).

import * as T from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const _m = new T.Matrix4(),
  _q = new T.Quaternion(),
  _e = new T.Euler(),
  _p = new T.Vector3(),
  _s = new T.Vector3();

function part(geo: T.BufferGeometry, color: string, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = sx, sz = sx) {
  const g = geo.index ? geo.toNonIndexed() : geo.clone();
  geo.dispose();
  g.deleteAttribute('uv');
  _m.compose(_p.set(x, y, z), _q.setFromEuler(_e.set(rx, ry, rz)), _s.set(sx, sy, sz));
  g.applyMatrix4(_m);
  const c = new T.Color(color);
  const n = g.getAttribute('position').count;
  const a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) c.toArray(a, i * 3);
  g.setAttribute('color', new T.BufferAttribute(a, 3));
  return g;
}

function mesh(parts: T.BufferGeometry[], mat: T.Material) {
  const m = new T.Mesh(mergeGeometries(parts)!, mat);
  parts.forEach((p) => p.dispose());
  m.castShadow = true;
  return m;
}

/** Ruas tungkai/lengan meruncing yang tergantung dari sendi (pangkal di y = y0). */
const limb = (r0: number, r1: number, len: number, color: string, y0 = 0) => part(new T.CylinderGeometry(r0, r1, len, 14), color, 0, y0 - len / 2, 0);

/** Profil putar (radius, tinggi) → badan lonjong, dipipihkan depan-belakang. */
const lathe = (pts: [number, number][], seg = 14) => new T.LatheGeometry(pts.map(([r, y]) => new T.Vector2(r, y)), seg);

export type Hair = 'pendek' | 'cepak' | 'panjang' | 'sanggul' | 'hijab';
export type Hat = 'koki' | 'topi' | null;

export interface Look {
  skin: string;
  hair: Hair;
  hairColor: string;
  /** warna hijab (bila hair = 'hijab') */
  scarf?: string;
  top: string;
  /** lengan panjang (warna atasan sampai pergelangan) */
  longSleeve: boolean;
  bottom: string;
  /** celana pendek (betis berwarna kulit) */
  shorts?: boolean;
  shoes: string;
  female: boolean;
  hat?: Hat;
  hatColor?: string;
  /** celemek panjang di depan (pelayan / koki) */
  apron?: string;
  /** tas punggung (pelajar) */
  backpack?: string;
  /** rompi/blazer di atas kemeja */
  jacket?: string;
}

export interface Rig {
  pelvis: T.Group;
  chest: T.Group;
  head: T.Group;
  hip: [T.Group, T.Group];
  knee: [T.Group, T.Group];
  shoulder: [T.Group, T.Group];
  elbow: [T.Group, T.Group];
  hipH: number;
  phase: number;
  walk: number;
  sit: number;
  seed: number;
}

const HIP_H = 0.837;

function buildHead(L: Look, mat: T.Material) {
  const P: T.BufferGeometry[] = [];
  const lip = new T.Color(L.skin).multiplyScalar(0.72).getStyle();
  P.push(part(new T.SphereGeometry(0.1, 18, 14), L.skin, 0, 0.11, 0, 0, 0, 0, 0.9, 1.1, 0.98)); // tengkorak
  P.push(part(new T.SphereGeometry(0.072, 14, 10), L.skin, 0, 0.055, 0.022, 0, 0, 0, 0.95, 0.9, 1)); // rahang & dagu
  P.push(part(new T.SphereGeometry(0.019, 8, 6), L.skin, 0, 0.095, 0.098, 0, 0, 0, 0.8, 1.1, 1)); // hidung
  P.push(part(new T.BoxGeometry(0.032, 0.007, 0.01), lip, 0, 0.058, 0.09)); // mulut
  for (const s of [-1, 1]) {
    P.push(part(new T.SphereGeometry(0.016, 10, 8), '#f6f2ec', s * 0.034, 0.118, 0.079, 0, 0, 0, 1.15, 0.8, 0.6)); // putih mata
    P.push(part(new T.SphereGeometry(0.0095, 8, 6), '#2a1c14', s * 0.034, 0.118, 0.087)); // pupil
    P.push(part(new T.BoxGeometry(0.036, 0.008, 0.012), L.hairColor, s * 0.035, 0.143, 0.086, 0, 0, s * 0.08)); // alis
    if (L.hair !== 'hijab') P.push(part(new T.SphereGeometry(0.024, 8, 6), L.skin, s * 0.09, 0.105, -0.005, 0, 0, 0, 0.45, 1, 0.8)); // telinga
  }
  const hc = L.hairColor;
  if (L.hair === 'hijab') {
    const sc = L.scarf ?? '#e8dccb';
    // penutup kepala dengan bukaan wajah oval + kain jatuh menutup leher & bahu
    P.push(part(new T.SphereGeometry(0.113, 18, 8, 0, Math.PI * 2, 0, 0.95), sc, 0, 0.115, -0.008, 0, 0, 0, 0.96, 1.08, 1));
    P.push(part(new T.SphereGeometry(0.113, 18, 10, Math.PI * 0.5 + 0.72, Math.PI * 2 - 1.44, 0.95, 1.75), sc, 0, 0.115, -0.008, 0, 0, 0, 0.96, 1.08, 1));
    P.push(part(new T.CylinderGeometry(0.075, 0.2, 0.17, 18, 1, true), sc, 0, -0.075, -0.012, 0, 0, 0, 1, 1, 0.8));
  } else if (L.hair === 'cepak') {
    P.push(part(new T.SphereGeometry(0.104, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2.1), hc, 0, 0.12, -0.006, -0.32, 0, 0, 0.92, 1.05, 1));
  } else {
    P.push(part(new T.SphereGeometry(0.108, 16, 10, 0, Math.PI * 2, 0, Math.PI / 1.9), hc, 0, 0.12, -0.01, -0.38, 0, 0, 0.94, 1.08, 1.02));
    // poni menutup dahi
    P.push(part(new T.SphereGeometry(0.1, 14, 6, Math.PI * 0.15, Math.PI * 0.7, 0.35, 0.5), hc, 0, 0.125, 0.012, 0, 0, 0, 0.94, 1.05, 1));
    if (L.hair === 'panjang') P.push(part(new T.CapsuleGeometry(0.075, 0.16, 4, 10), hc, 0, 0.02, -0.055, 0.12, 0, 0, 1.25, 1, 0.6));
    if (L.hair === 'sanggul') P.push(part(new T.SphereGeometry(0.045, 10, 8), hc, 0, 0.16, -0.1));
  }
  if (L.hat === 'koki') {
    P.push(part(new T.CylinderGeometry(0.098, 0.096, 0.1, 18), L.hatColor ?? '#ffffff', 0, 0.21, -0.008));
    P.push(part(new T.SphereGeometry(0.115, 16, 10), L.hatColor ?? '#ffffff', 0, 0.29, -0.008, 0, 0, 0, 1, 0.72, 1));
  } else if (L.hat === 'topi') {
    P.push(part(new T.SphereGeometry(0.108, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), L.hatColor ?? '#c8342a', 0, 0.13, -0.008, 0, 0, 0, 0.95, 0.9, 1));
    P.push(part(new T.CylinderGeometry(0.075, 0.075, 0.012, 14, 1, false, -Math.PI / 2, Math.PI), L.hatColor ?? '#c8342a', 0, 0.135, 0.07, 0.12, 0, 0, 1, 1, 1.25));
  }
  return mesh(P, mat);
}

/** Buat satu orang. Badan menghadap +z, telapak kaki di y = 0. Pose diatur posePerson(). */
export function makePerson(L: Look, mat: T.Material, seed = Math.random()) {
  const root = new T.Group();
  const pelvis = new T.Group();
  pelvis.position.y = HIP_H;
  root.add(pelvis);
  const hipW = L.female ? 1.08 : 1;

  // panggul (warna bawahan)
  pelvis.add(
    mesh(
      [
        part(
          lathe([
            [0, -0.1],
            [0.125, -0.1],
            [0.148, -0.03],
            [0.146, 0.06],
            [0.14, 0.12],
            [0, 0.12],
          ]),
          L.bottom,
          0,
          0,
          0,
          0,
          0,
          0,
          hipW,
          1,
          0.68,
        ),
      ],
      mat,
    ),
  );

  // dada & leher
  const chest = new T.Group();
  chest.position.y = 0.06;
  pelvis.add(chest);
  const torsoCol = L.jacket ?? L.top;
  const C: T.BufferGeometry[] = [];
  C.push(
    part(
      lathe(
        L.female
          ? [
              [0, 0.0],
              [0.148, 0.0],
              [0.135, 0.12],
              [0.15, 0.27],
              [0.155, 0.36],
              [0.13, 0.44],
              [0.06, 0.47],
              [0, 0.47],
            ]
          : [
              [0, 0.0],
              [0.15, 0.0],
              [0.148, 0.12],
              [0.168, 0.28],
              [0.175, 0.38],
              [0.145, 0.45],
              [0.06, 0.48],
              [0, 0.48],
            ],
      ),
      torsoCol,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      0.62,
    ),
  );
  if (L.jacket) C.push(part(new T.BoxGeometry(0.07, 0.3, 0.02), L.top, 0, 0.32, 0.098)); // kemeja di balik blazer
  C.push(part(new T.CylinderGeometry(0.048, 0.054, 0.1, 12), L.hair === 'hijab' ? (L.scarf ?? L.skin) : L.skin, 0, 0.5, 0));
  if (L.apron) C.push(part(new T.BoxGeometry(0.26, 0.3, 0.015), L.apron, 0, 0.15, 0.1));
  if (L.backpack) {
    C.push(part(new T.BoxGeometry(0.26, 0.32, 0.13), L.backpack, 0, 0.26, -0.15));
    for (const s of [-1, 1]) C.push(part(new T.BoxGeometry(0.03, 0.3, 0.02), L.backpack, s * 0.09, 0.3, 0.09));
  }
  chest.add(mesh(C, mat));
  // celemek panjang menggantung dari pinggang sampai lutut
  if (L.apron) pelvis.add(mesh([part(new T.BoxGeometry(0.3, 0.5, 0.015), L.apron, 0, -0.18, 0.108)], mat));

  const head = new T.Group();
  head.position.y = 0.545;
  chest.add(head);
  head.add(buildHead(L, mat));

  const shoulder: T.Group[] = [];
  const elbow: T.Group[] = [];
  for (const s of [-1, 1]) {
    const sh = new T.Group();
    sh.position.set(s * (L.female ? 0.145 : 0.158), 0.41, 0);
    chest.add(sh);
    const sleeve = L.longSleeve ? torsoCol : L.skin;
    // lengan atas meruncing dari bahu ke siku; lengan pendek = lengan baju sampai separuh
    sh.add(
      mesh(
        [
          part(new T.SphereGeometry(0.052, 14, 10), torsoCol, 0, 0, 0, 0, 0, 0, 1, 0.9, 0.9), // bahu
          ...(L.longSleeve
            ? [limb(0.05, 0.04, 0.27, torsoCol)]
            : [limb(0.054, 0.05, 0.13, torsoCol), limb(0.043, 0.038, 0.17, L.skin, -0.1)]),
        ],
        mat,
      ),
    );
    const el = new T.Group();
    el.position.y = -0.27;
    sh.add(el);
    el.add(
      mesh(
        [
          part(new T.SphereGeometry(0.04, 10, 8), sleeve, 0, 0, 0), // siku
          limb(0.039, 0.028, 0.23, sleeve),
          part(new T.SphereGeometry(0.03, 10, 8), L.skin, 0, -0.23, 0), // pergelangan
          part(new T.BoxGeometry(0.03, 0.085, 0.07, 1, 2, 2), L.skin, 0, -0.275, 0.008), // telapak
          part(new T.CapsuleGeometry(0.012, 0.035, 3, 6), L.skin, s * -0.008, -0.255, 0.045, 0.6, 0, 0), // ibu jari
        ],
        mat,
      ),
    );
    shoulder.push(sh);
    elbow.push(el);
  }

  const hip: T.Group[] = [];
  const knee: T.Group[] = [];
  for (const s of [-1, 1]) {
    const h = new T.Group();
    h.position.set(s * 0.083 * hipW, -0.02, 0);
    pelvis.add(h);
    // paha tebal di pangkal, mengecil ke lutut
    h.add(mesh([part(new T.SphereGeometry(0.078, 12, 10), L.bottom, 0, 0, 0), limb(0.078, 0.056, 0.4, L.bottom)], mat));
    const k = new T.Group();
    k.position.y = -0.4;
    h.add(k);
    const shin = L.shorts ? L.skin : L.bottom;
    k.add(
      mesh(
        [
          part(new T.SphereGeometry(0.057, 12, 10), L.shorts ? L.bottom : shin, 0, 0, 0), // lutut
          ...(L.shorts ? [limb(0.062, 0.058, 0.06, L.bottom)] : []),
          part(new T.SphereGeometry(0.052, 10, 8), shin, 0, -0.1, -0.012, 0, 0, 0, 1, 1.6, 1), // betis
          limb(0.055, 0.036, 0.37, shin),
          part(new T.SphereGeometry(0.036, 10, 8), shin, 0, -0.37, 0),
          // sepatu: tumit membulat, ujung runcing ke depan
          part(new T.CapsuleGeometry(0.043, 0.15, 4, 10), L.shoes, 0, -0.39, 0.045, Math.PI / 2, 0, 0, 1.05, 1, 0.8),
          part(new T.BoxGeometry(0.1, 0.02, 0.25), '#2a2a2a', 0, -0.417, 0.045),
        ],
        mat,
      ),
    );
    hip.push(h);
    knee.push(k);
  }

  const rig: Rig = {
    pelvis,
    chest,
    head,
    hip: hip as [T.Group, T.Group],
    knee: knee as [T.Group, T.Group],
    shoulder: shoulder as [T.Group, T.Group],
    elbow: elbow as [T.Group, T.Group],
    hipH: HIP_H,
    phase: seed * 6.28,
    walk: 0,
    sit: 0,
    seed,
  };
  root.userData.rig = rig;
  if (L.female) root.scale.setScalar(0.95);
  return root;
}

export interface PoseIn {
  t: number;
  dt: number;
  /** jarak tempuh frame ini (meter dunia); > 0 = berjalan */
  moved: number;
  /** tinggi dudukan di atas lantai (meter dunia); null = berdiri */
  seat: number | null;
  /** sedang makan (tangan kanan menyuap) */
  eat?: boolean;
  /** bekerja di meja (koki memotong / kasir mengetik) */
  work?: boolean;
}

const damp = T.MathUtils.damp;
const lerp = T.MathUtils.lerp;

/** Atur pose dari keadaan saat ini: berjalan, berdiri, duduk, makan, bekerja. */
export function posePerson(o: T.Object3D, p: PoseIn) {
  const r = o.userData.rig as Rig | undefined;
  if (!r) return;
  const sc = o.scale.y || 1;
  const speed = p.dt > 0 ? p.moved / p.dt / sc : 0;
  r.walk = damp(r.walk, speed > 0.2 ? Math.min(1, speed / 1.4) : 0, 10, p.dt);
  r.sit = damp(r.sit, p.seat != null ? 1 : 0, 6, p.dt);
  r.phase += (p.moved / sc) * ((Math.PI * 2) / 1.25); // satu siklus langkah ±1,25 m
  const w = r.walk * (1 - r.sit),
    s = r.sit,
    ph = r.phase,
    t = p.t + r.seed * 10;

  // kaki: ayun depan-belakang, lutut menekuk saat kaki diayun maju; duduk → paha mendatar, betis tegak
  for (let i = 0; i < 2; i++) {
    const q = ph + i * Math.PI;
    const swing = -Math.sin(q) * 0.42 * w;
    const kneeW = (0.06 + 0.62 * Math.max(0, Math.cos(q))) * w;
    r.hip[i].rotation.x = lerp(swing, -1.52, s);
    r.knee[i].rotation.x = lerp(kneeW, 1.5, s);
    r.hip[i].rotation.z = 0;
  }
  // panggul naik-turun dua kali per siklus; duduk → turun ke dudukan
  const seatLocal = (p.seat ?? 0.5) / sc + 0.06;
  r.pelvis.position.y = lerp(r.hipH - 0.018 * w + Math.cos(ph * 2) * 0.022 * w + Math.sin(t * 1.6) * 0.003, seatLocal, s);
  r.pelvis.position.z = lerp(0, -0.06, s);
  r.pelvis.rotation.y = Math.sin(ph) * 0.07 * w;
  r.chest.rotation.y = -Math.sin(ph) * 0.13 * w;
  r.chest.rotation.x = lerp(0.04 * w, 0.08, s) + Math.sin(t * 1.6) * 0.008; // napas
  r.chest.rotation.z = Math.sin(t * 0.7) * 0.012 * (1 - w);

  // kepala: sesekali menoleh saat diam, sedikit menunduk ke meja saat duduk
  const look = (1 - w) * (Math.sin(t * 0.37) * 0.35 + Math.sin(t * 0.11) * 0.2);
  r.head.rotation.y = damp(r.head.rotation.y, look * (p.work ? 0.3 : 1), 3, p.dt);
  r.head.rotation.x = lerp(0, 0.2, s) + (p.work ? 0.35 : 0);

  // lengan: berayun berlawanan dengan kaki; duduk → lengan bawah bertumpu di meja
  for (let i = 0; i < 2; i++) {
    const q = ph + i * Math.PI;
    const side = i === 0 ? -1 : 1;
    let sh = Math.sin(q) * 0.38 * w + Math.sin(t * 1.6 + i) * 0.015;
    let el = -0.18 - 0.22 * w;
    let out = side * 0.07;
    if (s > 0) {
      sh = lerp(sh, -0.5, s);
      el = lerp(el, -1.05, s);
      out = lerp(out, side * 0.12, s);
    }
    if (p.eat && i === 1) {
      // menyuap: angkat sendok ke mulut tiap ±3 detik
      const k = Math.max(0, Math.sin(t * 2.1)) ** 2;
      sh = lerp(sh, -0.62, k);
      el = lerp(el, -2.05, k);
      out = lerp(out, side * 0.05, k);
    }
    if (p.work && !w) {
      sh = -0.75 + Math.sin(t * 7 + i * 1.7) * 0.06;
      el = -0.9 + Math.sin(t * 7 + i * 1.7) * 0.12;
      out = side * 0.1;
    }
    r.shoulder[i].rotation.x = sh;
    r.shoulder[i].rotation.z = out;
    r.elbow[i].rotation.x = el;
  }
}

/** Lepas geometri tokoh (material dipakai bersama, tidak dibuang). */
export function disposePerson(o: T.Object3D) {
  o.traverse((x) => (x as T.Mesh).geometry?.dispose());
}

/* ---------------- pemilihan penampilan ---------------- */

const SKIN = ['#f1c9a5', '#e0b48a', '#d9a67c', '#c99466', '#b07a52', '#a8764e'];
const HAIR_COL = ['#16100c', '#1f1510', '#2a1a10', '#3a2618'];
const SCARF = ['#e8b0c0', '#2d3e52', '#f4ecdc', '#6a4a7a', '#3f7a6a', '#c8a070', '#9a3a4a', '#d8d0c4'];

export type Who = 'pelajar' | 'pekerja' | 'keluarga' | 'anak' | 'pejalan' | 'kasir' | 'koki' | 'pelayan' | 'kebersihan';

/** Penampilan acak yang wajar untuk tiap jenis orang (seragam sekolah, kemeja kantor, baju santai, seragam staf). */
export function lookFor(who: Who, rnd: () => number = Math.random): Look {
  const pick = <V>(a: readonly V[]) => a[Math.floor(rnd() * a.length) % a.length];
  const female = who === 'koki' ? rnd() < 0.3 : rnd() < 0.5;
  const hijab = female && who !== 'anak' && rnd() < 0.6;
  const hair: Hair = hijab ? 'hijab' : female ? pick(['panjang', 'sanggul', 'pendek'] as const) : pick(['pendek', 'cepak', 'pendek'] as const);
  const base: Look = {
    skin: pick(SKIN),
    hair,
    hairColor: pick(HAIR_COL),
    scarf: pick(SCARF),
    top: '#ffffff',
    longSleeve: false,
    bottom: '#2a2d36',
    shoes: pick(['#1a1a1a', '#2a2420', '#3a3030']),
    female,
  };
  switch (who) {
    case 'pelajar': {
      // seragam SMP/SMA: kemeja putih, bawahan biru tua / abu-abu, tas punggung
      const bottom = pick(['#2b3a5a', '#6e737c']);
      return { ...base, top: '#f6f6f2', longSleeve: hijab, bottom, scarf: hijab ? '#f6f6f2' : base.scarf, backpack: pick(['#1f2a44', '#2a2a2a', '#7a2a2a', '#3a5a7a']), shoes: '#151515' };
    }
    case 'pekerja':
      return {
        ...base,
        top: pick(['#ffffff', '#dbe6f2', '#e9e4da', '#cfd8e0', '#f2e6e6']),
        longSleeve: true,
        bottom: pick(['#23262e', '#2f3440', '#3a3a3a', '#4a4036']),
        jacket: rnd() < 0.35 ? pick(['#2a2f3a', '#3a3f4a', '#4a3a30']) : undefined,
        shoes: '#141414',
      };
    case 'keluarga':
    case 'pejalan':
      return {
        ...base,
        top: pick(['#e8804a', '#d94f5c', '#3f7ac8', '#5a8a4a', '#f2c24a', '#8a5aa8', '#f4ecdc', '#2d3e52', '#ffffff', '#f2b8c6', '#6a8aa8']),
        longSleeve: hijab || rnd() < 0.25,
        bottom: pick(['#3b4a66', '#2f3a52', '#c8b08a', '#4a4a4a', '#5a4a3a']),
        shoes: pick(['#1a1a1a', '#f0f0f0', '#8a6a4a', '#2a3a5a']),
      };
    case 'anak':
      return {
        ...base,
        hair: female ? pick(['panjang', 'sanggul'] as const) : 'pendek',
        top: pick(['#f2c24a', '#e85a5a', '#4ab0e0', '#7ac85a', '#f29ac0', '#ff9a3a']),
        bottom: pick(['#3b4a66', '#e8d8b8', '#5a6aa8']),
        shorts: rnd() < 0.6,
        shoes: pick(['#ffffff', '#e85a5a', '#2a3a5a']),
      };
    case 'kasir':
      return { ...base, top: '#c8342a', bottom: '#1f1f24', hat: hijab ? null : 'topi', hatColor: '#c8342a', scarf: hijab ? '#c8342a' : base.scarf, shoes: '#141414' };
    case 'koki':
      return { ...base, hair: female ? 'sanggul' : 'cepak', top: '#fbfbf8', longSleeve: true, bottom: '#26262a', hat: 'koki', apron: '#f2f2ee', shoes: '#141414' };
    case 'pelayan':
      return { ...base, top: '#fbfbf8', longSleeve: true, bottom: '#1a1a20', apron: '#1f2f5a', scarf: hijab ? '#1f2f5a' : base.scarf, shoes: '#141414' };
    case 'kebersihan':
      return { ...base, top: '#6aa84f', bottom: '#2f4a2a', hat: hijab ? null : 'topi', hatColor: '#4f8a3a', shoes: '#1a1a1a' };
  }
}
