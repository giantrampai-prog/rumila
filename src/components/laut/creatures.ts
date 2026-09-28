// Biota laut 3D (prosedural, proporsi natural, sisik halus dan sirip yang lentur).
// Ikan dibangun dari profil tubuh + tekstur corak (kanvas) + sirip; gerak berenang lewat shader lentur
// (tubuh melengkung makin kuat ke arah ekor). Satu material per jenis → kawanan memakai InstancedMesh.

import * as T from 'three';
import { createAnglerfish } from './anglerfish';

export const U = { time: { value: 0 } };

export function canvasTex(w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d')!, w, h);
  const t = new T.CanvasTexture(c);
  t.colorSpace = T.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** Tekstur cahaya bulat lembut (untuk cahaya hewan laut dalam, lampu, gelembung). */
let glowTex: T.Texture | null = null;
export function glow() {
  if (glowTex) return glowTex;
  glowTex = canvasTex(128, 128, (g) => {
    const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, 'rgba(255,255,255,1)');
    r.addColorStop(0.25, 'rgba(255,255,255,.6)');
    r.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = r;
    g.fillRect(0, 0, 128, 128);
  });
  glowTex.colorSpace = T.NoColorSpace;
  return glowTex;
}

export function glowSprite(color: T.ColorRepresentation, size: number, opacity = 1) {
  const s = new T.Sprite(new T.SpriteMaterial({ map: glow(), color, transparent: true, blending: T.AdditiveBlending, depthWrite: false, opacity }));
  s.scale.setScalar(size);
  return s;
}

/**
 * Material ber-"lentur": sumbu panjang hewan = sumbu X lokal (kepala di +x, ekor di -x).
 * Lengkung mengikuti gelombang dari kepala ke ekor; fase tiap salinan (instance) berbeda.
 */
export function bendMaterial(params: T.MeshStandardMaterialParameters, bend: { amp: number; speed: number; len: number; head?: number; axis?: 'z' | 'y' }) {
  const m = new T.MeshStandardMaterial(params);
  const head = bend.head ?? bend.len * 0.5;
  m.onBeforeCompile = (s) => {
    s.uniforms.uTime = U.time;
    s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nuniform float uTime;').replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>
      float ph = 0.0;
      #ifdef USE_INSTANCING
        ph = instanceMatrix[3].x * 1.7 + instanceMatrix[3].z * 1.3;
      #endif
      float k = clamp((${head.toFixed(3)} - position.x) / ${bend.len.toFixed(3)}, 0.0, 1.2);
      float wave = sin(uTime * ${bend.speed.toFixed(2)} + ph - position.x * ${(6 / bend.len).toFixed(3)}) * ${bend.amp.toFixed(3)} * k * k;
      transformed.${bend.axis ?? 'z'} += wave;`,
    );
  };
  m.customProgramCacheKey = () => `bend-${bend.amp}-${bend.speed}-${bend.len}-${head}-${bend.axis ?? 'z'}`;
  return m;
}

/* ---------------- ikan ---------------- */

export interface FishSpec {
  len: number;
  /** tinggi & tebal badan relatif panjang */
  h: number;
  w: number;
  /** corak tubuh: kanvas u = keliling (0 punggung, .5 perut), v = panjang (atas kanvas = kepala) */
  paint: (g: CanvasRenderingContext2D, w: number, h: number) => void;
  fin: string;
  finOpacity?: number;
  tail: 'fork' | 'round' | 'lunate' | 'shark' | 'frill';
  dorsal?: 'none' | 'small' | 'tall' | 'shark' | 'spiny' | 'long';
  /** ukuran mata relatif tinggi badan */
  eye?: number;
  teeth?: boolean;
  /** profil: seberapa gemuk kepala (0..1) */
  head?: number;
  speed?: number;
  amp?: number;
  rough?: number;
  metal?: number;
  emissive?: (g: CanvasRenderingContext2D, w: number, h: number) => void;
  translucent?: boolean;
}

function finShape(pts: [number, number][]) {
  const s = new T.Shape();
  s.moveTo(pts[0][0], pts[0][1]);
  for (const [x, y] of pts.slice(1)) s.lineTo(x, y);
  s.closePath();
  return new T.ShapeGeometry(s, 4);
}

/** Geometri & material satu jenis ikan (dipakai bersama banyak salinan). */
export function fishParts(spec: FishSpec) {
  const L = spec.len;
  const body = new T.SphereGeometry(1, 56, 32);
  body.rotateZ(-Math.PI / 2); // kutub → sumbu x (kepala +x)
  const p = body.attributes.position;
  const headFat = spec.head ?? 0.6;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const s = (x + 1) / 2; // 0 ekor → 1 kepala
    // profil gemuk di depan-tengah, meramping ke pangkal ekor
    const prof = Math.pow(Math.sin(Math.PI * Math.min(1, s * 0.9 + 0.1)), 0.7) * (0.55 + 0.45 * Math.pow(s, headFat)) + 0.06;
    p.setXYZ(i, (x * L) / 2, p.getY(i) * prof * L * spec.h * 0.5, p.getZ(i) * prof * L * spec.w * 0.5);
  }
  body.computeVertexNormals();
  const tex = canvasTex(512, 512, (g, w, h) => {
    spec.paint(g,w,h);
    // Subtle overlapping scales retain each species' original markings.
    for(let row=0;row<72;row++) for(let col=0;col<56;col++){
      const x=(col+(row%2)*0.5)*w/56,y=row*h/72;
      g.strokeStyle="rgba(20,35,40,0.10)";g.lineWidth=0.7;g.beginPath();g.arc(x,y,4.1,0.2,Math.PI-0.2);g.stroke();
      g.strokeStyle="rgba(255,255,255,0.09)";g.beginPath();g.arc(x,y-0.6,3.7,0.2,Math.PI-0.2);g.stroke();
    }
  });
  const emi = spec.emissive ? canvasTex(256, 256, spec.emissive) : null;
  const bend = { amp: (spec.amp ?? 0.1) * L, speed: spec.speed ?? 7, len: L };
  const bodyMat = bendMaterial(
    {
      map: tex,
      roughness: spec.rough ?? 0.45,
      metalness: spec.metal ?? 0,
      emissiveMap: emi,
      emissive: emi ? '#ffffff' : '#000000',
      transparent: !!spec.translucent,
      opacity: spec.translucent ? 0.82 : 1,
    },
    bend,
  );

  // sirip (dalam koordinat ikan)
  const fins: T.BufferGeometry[] = [];
  const H = L * spec.h * 0.5;
  const tx = -L / 2;
  const tail =
    spec.tail === 'fork'
      ? finShape([
          [0, 0],
          [-L * 0.28, H * 1.1],
          [-L * 0.2, 0],
          [-L * 0.28, -H * 1.1],
        ])
      : spec.tail === 'lunate'
        ? finShape([
            [0, 0],
            [-L * 0.12, H * 1.4],
            [-L * 0.16, H * 1.3],
            [-L * 0.06, 0],
            [-L * 0.16, -H * 1.3],
            [-L * 0.12, -H * 1.4],
          ])
        : spec.tail === 'shark'
          ? finShape([
              [0.02 * L, 0],
              [-L * 0.25, H * 1.5],
              [-L * 0.14, H * 0.2],
              [-L * 0.12, -H * 0.2],
              [-L * 0.18, -H * 0.8],
            ])
          : spec.tail === 'frill'
            ? finShape([
                [0, 0],
                [-L * 0.15, H * 0.9],
                [-L * 0.35, H * 0.5],
                [-L * 0.4, 0],
                [-L * 0.35, -H * 0.5],
                [-L * 0.15, -H * 0.9],
              ])
            : finShape([
                [0, 0],
                [-L * 0.1, H * 0.9],
                [-L * 0.25, H * 0.8],
                [-L * 0.28, 0],
                [-L * 0.25, -H * 0.8],
                [-L * 0.1, -H * 0.9],
              ]);
  tail.translate(tx + L * 0.04, 0, 0);
  fins.push(tail);
  const d = spec.dorsal ?? 'small';
  if (d !== 'none') {
    const top = H * 0.85;
    const g =
      d === 'shark'
        ? finShape([
            [L * 0.08, top],
            [-L * 0.02, top + H * 1.2],
            [-L * 0.12, top],
          ])
        : d === 'tall'
          ? finShape([
              [L * 0.2, top],
              [0, top + H * 1.1],
              [-L * 0.3, top * 0.6],
            ])
          : d === 'spiny'
            ? finShape([
                [L * 0.2, top],
                [L * 0.1, top + H * 1.6],
                [0, top + H * 0.5],
                [-L * 0.1, top + H * 1.5],
                [-L * 0.2, top + H * 0.4],
                [-L * 0.3, top * 0.8],
              ])
            : d === 'long'
              ? finShape([
                  [L * 0.25, top],
                  [L * 0.1, top + H * 0.5],
                  [-L * 0.35, top * 0.5 + H * 0.4],
                  [-L * 0.4, top * 0.5],
                ])
              : finShape([
                  [L * 0.1, top],
                  [-L * 0.02, top + H * 0.6],
                  [-L * 0.2, top * 0.8],
                ]);
    fins.push(g);
    // sirip dubur (bawah)
    const an = finShape([
      [-L * 0.05, -H * 0.8],
      [-L * 0.15, -H * 1.35],
      [-L * 0.28, -H * 0.6],
    ]);
    fins.push(an);
  }
  const finGeo = mergeFlat(fins);
  const rays = canvasTex(128,128,(c,w,h)=>{
    c.fillStyle=spec.fin;c.fillRect(0,0,w,h);
    for(let i=0;i<20;i++){c.strokeStyle=i%2?'rgba(255,255,255,.28)':'rgba(0,0,0,.15)';c.lineWidth=0.8;c.beginPath();c.moveTo(w/2,h);c.lineTo(i*w/20,0);c.stroke();}
  });
  const finMat = bendMaterial({ color: '#ffffff', map:rays, roughness: 0.42, side: T.DoubleSide, transparent: true, opacity: spec.finOpacity ?? 0.9 }, bend);

  // sirip dada (kiri-kanan), mengepak pelan
  const pec = finShape([
    [0, 0],
    [-L * 0.16, H * 0.5],
    [-L * 0.2, -H * 0.1],
  ]);

  return { body, bodyMat, finGeo, finMat, pec, tex, emi, L, H, spec };
}

function mergeFlat(list: T.BufferGeometry[]) {
  const pos: number[] = [],
    nor: number[] = [],
    uv: number[] = [];
  for (const g0 of list) {
    const g = g0.index ? g0.toNonIndexed() : g0;
    pos.push(...(g.attributes.position.array as Float32Array));
    nor.push(...(g.attributes.normal.array as Float32Array));
    uv.push(...(g.attributes.uv.array as Float32Array));
  }
  const out = new T.BufferGeometry();
  out.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
  out.setAttribute('normal', new T.Float32BufferAttribute(nor, 3));
  out.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
  return out;
}

const eyeWhite = new T.MeshStandardMaterial({ color: '#827957', roughness: 0.24 });
const eyeBlack = new T.MeshStandardMaterial({ color: '#0d0d12', roughness: 0.1 });
const shine = new T.MeshBasicMaterial({ color: '#ffffff' });

/** Iris natural, pupil and a restrained corneal highlight. */
function eyes(parent: T.Object3D, x: number, y: number, z: number, r: number) {
  r *= 0.6;
  for (const s of [-1, 1]) {
    const g = new T.Group();
    const w = new T.Mesh(new T.SphereGeometry(r, 16, 12), eyeWhite);
    const b = new T.Mesh(new T.SphereGeometry(r * 0.76, 18, 12), eyeBlack);
    b.position.set(r * 0.25, 0, r * 0.52);
    const h = new T.Mesh(new T.SphereGeometry(r * 0.12, 8, 6), shine);
    h.position.set(r * 0.4, r * 0.25, r * 0.95);
    g.add(w, b, h);
    g.position.set(x, y, s * z);
    if (s < 0) g.scale.z = -1;
    parent.add(g);
  }
}

/** Satu ikan utuh (Group) dengan sirip dada yang mengepak. */
export function buildFish(spec: FishSpec) {
  const P = fishParts(spec);
  const g = new T.Group();
  g.add(new T.Mesh(P.body, P.bodyMat), new T.Mesh(P.finGeo, P.finMat));
  const pecs: T.Mesh[] = [];
  for (const s of [-1, 1]) {
    const m = new T.Mesh(P.pec, new T.MeshStandardMaterial({ color: spec.fin, side: T.DoubleSide, transparent: true, opacity: 0.85 }));
    m.position.set(P.L * 0.12, -P.H * 0.2, s * P.L * spec.w * 0.42);
    m.rotation.y = s * 0.5;
    g.add(m);
    pecs.push(m);
  }
  eyes(g, P.L * 0.3, P.H * 0.22, P.L * spec.w * 0.36, P.H * (spec.eye ?? 0.32));
  if (spec.teeth) {
    const tm = new T.MeshStandardMaterial({ color: '#f4f1e8', roughness: 0.3 });
    for (let i = 0; i < 8; i++) {
      const t = new T.Mesh(new T.ConeGeometry(P.L * 0.012, P.L * 0.05, 5), tm);
      const a = (i / 7 - 0.5) * 1.6;
      t.position.set(P.L * 0.47, -P.H * 0.15, Math.sin(a) * P.L * spec.w * 0.2);
      t.rotation.z = Math.PI;
      g.add(t);
    }
  }
  g.userData.update = (t: number, ph = 0) => {
    const f = Math.sin(t * 5 + ph) * 0.4;
    pecs[0].rotation.x = f;
    pecs[1].rotation.x = -f;
  };
  return g;
}

/** Kawanan ikan: InstancedMesh tubuh + sirip; posisi diperbarui tiap bingkai. */
export class School {
  body: T.InstancedMesh;
  fins: T.InstancedMesh;
  group = new T.Group();
  private d = new T.Object3D();
  private offs: { o: T.Vector3; ph: number; sp: number }[] = [];
  constructor(
    spec: FishSpec,
    public count: number,
    public spread: T.Vector3,
    seed = 1,
  ) {
    const P = fishParts(spec);
    this.body = new T.InstancedMesh(P.body, P.bodyMat, count);
    this.fins = new T.InstancedMesh(P.finGeo, P.finMat, count);
    this.body.frustumCulled = this.fins.frustumCulled = false;
    this.group.add(this.body, this.fins);
    let s = seed;
    const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < count; i++) this.offs.push({ o: new T.Vector3((r() - 0.5) * spread.x, (r() - 0.5) * spread.y, (r() - 0.5) * spread.z), ph: r() * 6.28, sp: 0.8 + r() * 0.4 });
  }
  /** Seluruh kawanan bergerak mengikuti arah `heading` (rad, pada bidang XZ). */
  update(t: number, heading: number) {
    const q = new T.Quaternion().setFromEuler(new T.Euler(0, -heading, 0));
    this.offs.forEach((f, i) => {
      this.d.position.set(f.o.x + Math.sin(t * 0.7 * f.sp + f.ph) * 0.4, f.o.y + Math.sin(t * 0.9 + f.ph) * 0.25, f.o.z + Math.cos(t * 0.6 * f.sp + f.ph) * 0.4);
      this.d.quaternion.copy(q).multiply(new T.Quaternion().setFromEuler(new T.Euler(0, Math.sin(t * 0.8 + f.ph) * 0.15, 0)));
      this.d.updateMatrix();
      this.body.setMatrixAt(i, this.d.matrix);
      this.fins.setMatrixAt(i, this.d.matrix);
    });
    this.body.instanceMatrix.needsUpdate = this.fins.instanceMatrix.needsUpdate = true;
  }
}

/* ---------------- corak ---------------- */

const grad = (g: CanvasRenderingContext2D, w: number, h: number, top: string, belly: string) => {
  // u: 0 punggung → .5 perut → 1 punggung
  const r = g.createLinearGradient(0, 0, w, 0);
  r.addColorStop(0, top);
  r.addColorStop(0.5, belly);
  r.addColorStop(1, top);
  g.fillStyle = r;
  g.fillRect(0, 0, w, h);
};
const band = (g: CanvasRenderingContext2D, w: number, y: number, t: number, col: string, edge?: string) => {
  if (edge) {
    g.fillStyle = edge;
    g.fillRect(0, y - t / 2 - 5, w, t + 10);
  }
  g.fillStyle = col;
  g.fillRect(0, y - t / 2, w, t);
};

export const SPECIES: Record<string, FishSpec> = {
  'ikan-badut': {
    len: 0.36,
    h: 0.5,
    w: 0.32,
    fin: '#ff7a1a',
    tail: 'round',
    dorsal: 'long',
    eye: 0.34,
    head: 0.4,
    paint: (g, w, h) => {
      grad(g, w, h, '#ff6a0a', '#ff9a3c');
      band(g, w, h * 0.22, 26, '#ffffff', '#111');
      band(g, w, h * 0.5, 30, '#ffffff', '#111');
      band(g, w, h * 0.86, 18, '#ffffff', '#111');
    },
  },
  'ikan-kupu-kupu': {
    len: 0.34,
    h: 0.95,
    w: 0.22,
    fin: '#ffd21f',
    tail: 'round',
    dorsal: 'tall',
    eye: 0.2,
    head: 0.3,
    paint: (g, w, h) => {
      grad(g, w, h, '#ffd21f', '#fff6c9');
      for (let i = 0; i < 9; i++) band(g, w, h * (0.28 + i * 0.05), 5, '#1c1c1c');
      band(g, w, h * 0.12, 18, '#111');
      g.fillStyle = '#111';
      g.fillRect(0, h * 0.85, w, h * 0.15);
    },
  },
  'blue-tang': {
    len: 0.4,
    h: 0.7,
    w: 0.24,
    fin: '#1d3fcf',
    tail: 'fork',
    dorsal: 'long',
    eye: 0.26,
    head: 0.3,
    paint: (g, w, h) => {
      grad(g, w, h, '#1d4fff', '#3f7cff');
      g.fillStyle = '#0b1340';
      g.beginPath();
      g.ellipse(w * 0.2, h * 0.5, w * 0.15, h * 0.32, 0, 0, 7);
      g.ellipse(w * 0.8, h * 0.5, w * 0.15, h * 0.32, 0, 0, 7);
      g.fill();
      g.fillStyle = '#ffd400';
      g.fillRect(0, h * 0.92, w, h * 0.08);
    },
  },
  'ikan-kakatua': {
    len: 0.6,
    h: 0.5,
    w: 0.32,
    fin: '#2fd3b0',
    tail: 'lunate',
    dorsal: 'long',
    eye: 0.26,
    head: 0.5,
    paint: (g, w, h) => {
      const r = g.createLinearGradient(0, 0, 0, h);
      r.addColorStop(0, '#6fe0ff');
      r.addColorStop(0.45, '#2fd39a');
      r.addColorStop(0.8, '#b8e34a');
      r.addColorStop(1, '#ff8fb1');
      g.fillStyle = r;
      g.fillRect(0, 0, w, h);
      for (let i = 0; i < 60; i++) {
        g.strokeStyle = 'rgba(255,120,190,.35)';
        g.strokeRect((i * 37) % w, (i * 53) % h, 14, 10);
      }
    },
  },
  lionfish: {
    len: 0.42,
    h: 0.5,
    w: 0.3,
    fin: '#f4d6c8',
    finOpacity: 0.75,
    tail: 'round',
    dorsal: 'spiny',
    eye: 0.3,
    head: 0.6,
    paint: (g, w, h) => {
      grad(g, w, h, '#b33a2a', '#f3e2d8');
      for (let i = 0; i < 14; i++) band(g, w, h * (0.05 + i * 0.068), 9, i % 2 ? '#fff4ec' : '#7a1f14');
    },
  },
  'hiu-karang': {
    len: 1.9,
    h: 0.24,
    w: 0.22,
    fin: '#6f7c8a',
    finOpacity: 1,
    tail: 'shark',
    dorsal: 'shark',
    eye: 0.2,
    head: 0.9,
    speed: 3.2,
    amp: 0.08,
    rough: 0.55,
    paint: (g, w, h) => grad(g, w, h, '#5f6d7c', '#f2f4f5'),
  },
  barakuda: {
    len: 1.2,
    h: 0.16,
    w: 0.15,
    fin: '#8d99a6',
    tail: 'fork',
    dorsal: 'small',
    eye: 0.4,
    head: 1.2,
    speed: 4,
    amp: 0.06,
    metal: 0.5,
    rough: 0.3,
    teeth: true,
    paint: (g, w, h) => {
      grad(g, w, h, '#5d6b78', '#e9eef2');
      for (let i = 0; i < 18; i++) {
        g.fillStyle = 'rgba(40,50,60,.55)';
        g.fillRect(0, h * (0.2 + i * 0.04), w * 0.18, 6);
        g.fillRect(w * 0.82, h * (0.2 + i * 0.04), w * 0.18, 6);
      }
    },
  },
  tuna: {
    len: 1.1,
    h: 0.3,
    w: 0.28,
    fin: '#e3c14a',
    tail: 'lunate',
    dorsal: 'small',
    eye: 0.2,
    head: 0.8,
    speed: 6,
    amp: 0.05,
    metal: 0.6,
    rough: 0.25,
    paint: (g, w, h) => grad(g, w, h, '#15306b', '#dfe8f0'),
  },
  'ikan-lentera': {
    len: 0.22,
    h: 0.3,
    w: 0.2,
    fin: '#3a4a66',
    tail: 'fork',
    dorsal: 'small',
    eye: 0.5,
    head: 0.9,
    metal: 0.4,
    paint: (g, w, h) => grad(g, w, h, '#1b2336', '#7d8aa6'),
    emissive: (g, w, h) => {
      g.fillStyle = '#000';
      g.fillRect(0, 0, w, h);
      g.fillStyle = '#6fd6ff';
      for (let i = 0; i < 12; i++) for (const u of [0.38, 0.62, 0.45, 0.55]) {
        g.beginPath();
        g.arc(w * u, h * (0.15 + i * 0.06), 4, 0, 7);
        g.fill();
      }
    },
  },
  'ikan-kapak': {
    len: 0.2,
    h: 1.0,
    w: 0.14,
    fin: '#c9d3dd',
    tail: 'fork',
    dorsal: 'small',
    eye: 0.28,
    head: 0.2,
    metal: 0.9,
    rough: 0.2,
    paint: (g, w, h) => grad(g, w, h, '#4a5663', '#eef3f7'),
    emissive: (g, w, h) => {
      g.fillStyle = '#000';
      g.fillRect(0, 0, w, h);
      g.fillStyle = '#5fb8ff';
      for (let i = 0; i < 10; i++) {
        g.beginPath();
        g.arc(w * 0.5, h * (0.2 + i * 0.06), 4, 0, 7);
        g.fill();
      }
    },
  },
  'ikan-naga': {
    len: 0.9,
    h: 0.13,
    w: 0.12,
    fin: '#1a1a22',
    tail: 'round',
    dorsal: 'small',
    eye: 0.45,
    head: 1.2,
    teeth: true,
    speed: 4,
    amp: 0.12,
    paint: (g, w, h) => grad(g, w, h, '#0c0c12', '#1e1f2c'),
  },
  'ikan-siput-hadal': {
    len: 0.6,
    h: 0.42,
    w: 0.36,
    fin: '#f3dce6',
    finOpacity: 0.55,
    tail: 'frill',
    dorsal: 'long',
    eye: 0.2,
    head: 1.6,
    speed: 3,
    amp: 0.14,
    translucent: true,
    rough: 0.25,
    paint: (g, w, h) => grad(g, w, h, '#efc9d8', '#fbeef3'),
  },
  'ikan-tripod': {
    len: 0.45,
    h: 0.2,
    w: 0.18,
    fin: '#c8c2b8',
    tail: 'round',
    dorsal: 'small',
    eye: 0.35,
    head: 0.9,
    speed: 1.5,
    amp: 0.03,
    paint: (g, w, h) => grad(g, w, h, '#7d766c', '#cfc8bd'),
  },
};

/* ---------------- biota khusus ---------------- */

const std = (color: T.ColorRepresentation, rough = 0.6, extra: T.MeshStandardMaterialParameters = {}) => new T.MeshStandardMaterial({ color, roughness: rough, ...extra });

export function turtle() {
  const g = new T.Group();
  const shellTex = canvasTex(1024, 1024, (c, w, h) => {
    c.scale(4,4); w/=4; h/=4;
    c.fillStyle = '#6b4f2a';
    c.fillRect(0, 0, w, h);
    for (let i = 0; i < 18; i++) {
      const x = (i % 5) * 58 + (Math.floor(i / 5) % 2) * 29,
        y = Math.floor(i / 5) * 64 + 20;
      c.fillStyle = ['#8a6a32', '#a07a3a', '#7a5c2c'][i % 3];
      c.beginPath();
      for (let k = 0; k < 6; k++) c.lineTo(x + Math.cos((k / 6) * 6.28) * 26, y + Math.sin((k / 6) * 6.28) * 26);
      c.fill();
      c.strokeStyle = '#3d2b15';
      c.lineWidth = 4;
      c.stroke();
    }
  });
  const shell = new T.Mesh(new T.SphereGeometry(0.5, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2), std('#ffffff', 0.4, { map: shellTex, bumpMap:shellTex, bumpScale:0.012 }));
  shell.scale.set(1.2, 0.45, 0.95);
  const belly = new T.Mesh(new T.SphereGeometry(0.5, 24, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), std('#e8dcae', 0.7));
  belly.scale.set(1.15, 0.18, 0.9);
  const skinTex=canvasTex(512,512,(c,w,h)=>{
    c.fillStyle='#687d53';c.fillRect(0,0,w,h);
    for(let y=0;y<h;y+=18)for(let x=0;x<w;x+=23){c.fillStyle=['#909471','#777f59','#a19b78'][(x+y)%3];c.beginPath();c.ellipse(x+(y%36?11:0),y,10,7,0,0,Math.PI*2);c.fill();}
  });
  const skin = std('#ffffff',0.65,{map:skinTex,bumpMap:skinTex,bumpScale:0.003});
  const head = new T.Mesh(new T.SphereGeometry(0.16, 20, 14), skin);
  head.scale.set(1.3, 0.9, 0.95);
  head.position.set(0.72, 0.02, 0);
  g.add(shell, belly, head);
  eyes(g, 0.82, 0.08, 0.1, 0.055);
  const flip = (x: number, z: number, big: boolean) => {
    const f = new T.Mesh(new T.SphereGeometry(big ? 0.3 : 0.16, 14, 8), skin);
    f.scale.set(big ? 0.6 : 0.7, 0.1, big ? 1.2 : 0.9);
    const piv = new T.Group();
    piv.position.set(x, -0.02, z);
    f.position.z = Math.sign(z) * (big ? 0.3 : 0.12);
    piv.add(f);
    g.add(piv);
    return piv;
  };
  const fl = [flip(0.3, 0.38, true), flip(0.3, -0.38, true), flip(-0.4, 0.3, false), flip(-0.4, -0.3, false)];
  g.userData.update = (t: number) => {
    const a = Math.sin(t * 1.6) * 0.5;
    fl[0].rotation.x = a;
    fl[1].rotation.x = -a;
    fl[2].rotation.x = a * 0.4;
    fl[3].rotation.x = -a * 0.4;
  };
  return g;
}

export function seahorse() {
  const g = new T.Group();
  const m = std('#f2a531', 0.45);
  const pts: T.Vector3[] = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    // badan tegak lalu ekor melingkar di bawah
    if (t < 0.55) pts.push(new T.Vector3(Math.sin(t * 3) * 0.04, 0.5 - t * 0.9, 0));
    else {
      const a = (t - 0.55) * 11;
      pts.push(new T.Vector3(0.08 - Math.cos(a) * 0.08 * (1.2 - (t - 0.55)), 0.0 - Math.sin(a) * 0.08 * (1.2 - (t - 0.55)) - 0.02, 0));
    }
  }
  const curve = new T.CatmullRomCurve3(pts);
  const tube = new T.TubeGeometry(curve, 60, 0.06, 10, false);
  const pos = tube.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const seg = Math.floor(i / 11) / 60;
    const r = 0.35 + 0.9 * Math.sin(Math.min(1, seg * 1.6 + 0.15) * Math.PI) * (seg < 0.5 ? 1 : 0.5);
    const c = curve.getPointAt(Math.min(1, seg));
    const v = new T.Vector3().fromBufferAttribute(pos, i).sub(c).multiplyScalar(r).add(c);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  tube.computeVertexNormals();
  g.add(new T.Mesh(tube, m));
  const head = new T.Mesh(new T.SphereGeometry(0.08, 16, 12), m);
  head.position.set(0.02, 0.56, 0);
  const snout = new T.Mesh(new T.CylinderGeometry(0.018, 0.028, 0.14, 10), m);
  snout.rotation.z = Math.PI / 2;
  snout.position.set(0.12, 0.54, 0);
  const crest = new T.Mesh(new T.ConeGeometry(0.03, 0.08, 6), m);
  crest.position.set(-0.01, 0.65, 0);
  g.add(head, snout, crest);
  eyes(g, 0.06, 0.58, 0.05, 0.03);
  const fin = new T.Mesh(new T.CircleGeometry(0.06, 10), std('#ffe0a0', 0.5, { transparent: true, opacity: 0.7, side: T.DoubleSide }));
  fin.position.set(-0.07, 0.3, 0);
  fin.rotation.y = Math.PI / 2;
  g.add(fin);
  g.userData.update = (t: number) => (fin.rotation.x = Math.sin(t * 14) * 0.5);
  return g;
}

/** Pari (kecil, di pasir) atau pari manta (besar, terbang di air). */
export function ray(manta: boolean) {
  const g = new T.Group();
  const s = new T.Shape();
  const W = manta ? 2.2 : 0.55,
    Lh = manta ? 1.1 : 0.45;
  s.moveTo(Lh, 0);
  s.quadraticCurveTo(Lh * 0.5, W * 0.6, -Lh * 0.1, W);
  s.quadraticCurveTo(-Lh * 0.3, W * 0.4, -Lh * 0.6, 0);
  s.quadraticCurveTo(-Lh * 0.3, -W * 0.4, -Lh * 0.1, -W);
  s.quadraticCurveTo(Lh * 0.5, -W * 0.6, Lh, 0);
  const geo = new T.ShapeGeometry(s, 16);
  geo.rotateX(-Math.PI / 2);
  // tubuh sedikit menggembung di tengah
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i),
      z = p.getZ(i);
    p.setY(i, Math.max(0, 1 - Math.hypot(x / Lh, z / (W * 0.45))) * (manta ? 0.2 : 0.08));
  }
  geo.computeVertexNormals();
  const tex = canvasTex(256, 256, (c, w, h) => {
    c.fillStyle = manta ? '#1d2230' : '#8e8a86';
    c.fillRect(0, 0, w, h);
    if (!manta)
      for (let i = 0; i < 120; i++) {
        c.fillStyle = 'rgba(40,40,40,.35)';
        c.beginPath();
        c.arc((i * 47) % w, (i * 83) % h, 3, 0, 7);
        c.fill();
      }
  });
  const m = new T.MeshStandardMaterial({ map: tex, roughness: 0.7, side: T.DoubleSide });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = U.time;
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float uTime;').replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>
      float side = abs(position.z) / ${W.toFixed(2)};
      transformed.y += sin(uTime * ${manta ? '1.6' : '3.0'} - position.x * 2.0) * side * side * ${manta ? '0.55' : '0.12'};`,
    );
  };
  m.customProgramCacheKey = () => (manta ? 'ray-manta' : 'ray-pari');
  const body = new T.Mesh(geo, m);
  const under = new T.Mesh(geo, new T.MeshStandardMaterial({ color: manta ? '#f2f2f2' : '#e8e2da', roughness: 0.7, side: T.BackSide }));
  under.position.y = -0.005;
  g.add(body);
  if (manta) g.add(under);
  const tail = new T.Mesh(new T.CylinderGeometry(0.004, manta ? 0.03 : 0.015, manta ? 1.1 : 0.6, 6), std(manta ? '#1d2230' : '#7a7672'));
  tail.rotation.z = Math.PI / 2;
  tail.position.set(-Lh * 0.6 - (manta ? 0.55 : 0.3), 0.02, 0);
  g.add(tail);
  eyes(g, Lh * 0.5, manta ? 0.12 : 0.07, manta ? 0.35 : 0.1, manta ? 0.07 : 0.035);
  if (manta)
    for (const z of [-0.28, 0.28]) {
      const lobe = new T.Mesh(new T.BoxGeometry(0.3, 0.05, 0.06), std('#1d2230'));
      lobe.position.set(Lh + 0.1, 0.02, z);
      g.add(lobe);
    }
  return g;
}

/** Ubur-ubur: payung tembus cahaya berdenyut + tentakel bergelombang. */
export function jellyfish(color: string, glowing = false, size = 0.35) {
  const g = new T.Group();
  const bellGeo = new T.SphereGeometry(size, 28, 16, 0, Math.PI * 2, 0, Math.PI * 0.55);
  const bell = new T.Mesh(
    bellGeo,
    new T.MeshPhysicalMaterial({ color, roughness: 0.15, transmission: 0.2, transparent: true, opacity: 0.55, emissive: color, emissiveIntensity: glowing ? 0.9 : 0.15, side: T.DoubleSide, depthWrite: false }),
  );
  g.add(bell);
  const inner = new T.Mesh(new T.SphereGeometry(size * 0.55, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.5), new T.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: glowing ? 1.2 : 0.3, transparent: true, opacity: 0.6, depthWrite: false }));
  inner.position.y = -size * 0.1;
  g.add(inner);
  const tm = new T.LineBasicMaterial({ color, transparent: true, opacity: 0.6 });
  const tents: T.Line[] = [];
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * 6.28;
    const geo = new T.BufferGeometry().setFromPoints(Array.from({ length: 16 }, (_, k) => new T.Vector3(Math.cos(a) * size * 0.7, -k * size * 0.22, Math.sin(a) * size * 0.7)));
    const l = new T.Line(geo, tm);
    l.userData.a = a;
    tents.push(l);
    g.add(l);
  }
  if (glowing) g.add(glowSprite(color, size * 4, 0.5));
  g.userData.update = (t: number, ph = 0) => {
    const pulse = 1 + Math.sin(t * 2.2 + ph) * 0.1;
    bell.scale.set(pulse, 2 - pulse, pulse);
    inner.scale.copy(bell.scale);
    for (const l of tents) {
      const p = l.geometry.attributes.position as T.BufferAttribute;
      const a = l.userData.a as number;
      for (let k = 0; k < p.count; k++) {
        const w = Math.sin(t * 1.8 - k * 0.5 + a + ph) * k * size * 0.03;
        p.setXYZ(k, Math.cos(a) * size * 0.7 * pulse + w, -k * size * 0.22, Math.sin(a) * size * 0.7 * pulse + w * 0.6);
      }
      p.needsUpdate = true;
    }
    g.position.y += Math.sin(t * 2.2 + ph) * 0.002;
  };
  return g;
}

export function squid(glowing = false) {
  const g = new T.Group();
  const tex = canvasTex(128, 256, (c, w, h) => {
    c.fillStyle = '#c8453a';
    c.fillRect(0, 0, w, h);
    for (let i = 0; i < 300; i++) {
      c.fillStyle = `rgba(${120 + ((i * 7) % 80)},30,30,.5)`;
      c.beginPath();
      c.arc((i * 37) % w, (i * 59) % h, 2 + (i % 3), 0, 7);
      c.fill();
    }
  });
  const m = std('#ffffff', 0.4, { map: tex, emissive: glowing ? '#ff6a5a' : '#000', emissiveIntensity: glowing ? 0.3 : 0 });
  const mantle = new T.Mesh(new T.CylinderGeometry(0.05, 0.13, 0.7, 20, 4), m);
  mantle.rotation.z = -Math.PI / 2;
  mantle.position.x = -0.25;
  const finG = new T.Mesh(new T.CircleGeometry(0.16, 3), std('#d35a4a', 0.4, { side: T.DoubleSide }));
  finG.rotation.x = -Math.PI / 2;
  finG.position.x = -0.55;
  const head = new T.Mesh(new T.SphereGeometry(0.12, 18, 12), m);
  head.position.x = 0.15;
  g.add(mantle, finG, head);
  eyes(g, 0.18, 0.05, 0.1, 0.06);
  const arms: T.Mesh[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * 6.28;
    const arm = new T.Mesh(new T.CylinderGeometry(0.008, 0.03, 0.45, 6), m);
    arm.geometry.translate(0, -0.22, 0);
    arm.rotation.z = Math.PI / 2;
    const piv = new T.Group();
    piv.position.set(0.25, Math.cos(a) * 0.06, Math.sin(a) * 0.06);
    piv.add(arm);
    g.add(piv);
    arms.push(piv as unknown as T.Mesh);
  }
  g.userData.update = (t: number, ph = 0) => {
    arms.forEach((a, i) => {
      const k = (i / 8) * 6.28;
      a.rotation.y = Math.sin(k) * 0.25 + Math.sin(t * 3 + i + ph) * 0.1;
      a.rotation.z = Math.cos(k) * 0.25;
    });
    finG.scale.y = 1 + Math.sin(t * 6 + ph) * 0.2;
  };
  return g;
}

/** Model edukasi natural: kulit berpori, mulut terbuka dan gigi ramping. */
export function anglerfish() {
  return createAnglerfish(glow());
}

export function gulperEel() {
  const g = new T.Group();
  const m = bendMaterial({ color: '#141418', roughness: 0.5 }, { amp: 0.25, speed: 3, len: 3, head: 0.3, axis: 'z' });
  const body = new T.Mesh(new T.CylinderGeometry(0.1, 0.01, 3, 10, 40), m);
  body.geometry.rotateZ(Math.PI / 2);
  body.geometry.translate(-1.2, 0, 0);
  const jawTop = new T.Mesh(new T.SphereGeometry(0.4, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), std('#1c1c22', 0.5, { side: T.DoubleSide }));
  jawTop.scale.set(1.2, 0.3, 0.8);
  jawTop.position.set(0.35, 0.05, 0);
  const jawBot = new T.Mesh(new T.SphereGeometry(0.42, 20, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), std('#23232a', 0.5, { side: T.DoubleSide }));
  jawBot.scale.set(1.3, 0.9, 0.85);
  jawBot.position.set(0.35, 0, 0);
  g.add(body, jawTop, jawBot);
  eyes(g, 0.2, 0.1, 0.12, 0.035);
  const tip = glowSprite('#ff5fa8', 0.35);
  tip.position.set(-2.7, 0, 0);
  g.add(tip);
  g.userData.update = (t: number) => {
    jawBot.scale.y = 0.7 + Math.sin(t * 1.2) * 0.25;
    tip.position.z = Math.sin(t * 3 - 8) * 0.2;
  };
  return g;
}

/** Ubur-ubur sisir: kilau pelangi berjalan di sepanjang barisan sisir. */
export function combJelly() {
  const g = new T.Group();
  const body = new T.Mesh(new T.SphereGeometry(0.3, 24, 18), new T.MeshPhysicalMaterial({ color: '#cfe8ff', transparent: true, opacity: 0.25, roughness: 0.1, depthWrite: false }));
  body.scale.set(0.8, 1.2, 0.8);
  g.add(body);
  const rows: T.Mesh[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * 6.28;
    const curve = new T.CatmullRomCurve3(Array.from({ length: 9 }, (_, k) => {
      const v = (k / 8) * Math.PI;
      return new T.Vector3(Math.cos(a) * Math.sin(v) * 0.245, Math.cos(v) * 0.36, Math.sin(a) * Math.sin(v) * 0.245);
    }));
    const m = new T.Mesh(new T.TubeGeometry(curve, 24, 0.012, 4), new T.MeshBasicMaterial({ color: '#ffffff', transparent: true, blending: T.AdditiveBlending, depthWrite: false }));
    rows.push(m);
    g.add(m);
  }
  g.add(glowSprite('#7fd8ff', 1.1, 0.35));
  g.userData.update = (t: number) => rows.forEach((r, i) => (r.material as T.MeshBasicMaterial).color.setHSL((t * 0.3 + i / 8) % 1, 1, 0.6));
  return g;
}

/** Sifonofor: rantai panjang lonceng-lonceng kecil bercahaya. */
export function siphonophore() {
  const g = new T.Group();
  const bells: T.Object3D[] = [];
  for (let i = 0; i < 22; i++) {
    const b = new T.Mesh(new T.SphereGeometry(0.07, 10, 8), new T.MeshStandardMaterial({ color: '#ffb0e0', emissive: '#ff7ac8', emissiveIntensity: 1, transparent: true, opacity: 0.7 }));
    b.position.y = -i * 0.16;
    g.add(b);
    if (i % 3 === 0) {
      const s = glowSprite(i % 2 ? '#ff8ad0' : '#8ad8ff', 0.35, 0.8);
      s.position.copy(b.position);
      g.add(s);
    }
    bells.push(b);
  }
  g.userData.update = (t: number) => bells.forEach((b, i) => (b.position.x = Math.sin(t * 0.8 - i * 0.3) * 0.15));
  return g;
}

export function tubeWorms(n: number, seed = 1) {
  const g = new T.Group();
  let s = seed;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const tubeM = std('#e8e4dc', 0.8);
  const plume = std('#d62a2a', 0.5, { emissive: '#5a0000', emissiveIntensity: 0.3 });
  const plumes: T.Mesh[] = [];
  for (let i = 0; i < n; i++) {
    const h = 0.5 + r() * 1.2;
    const x = (r() - 0.5) * 1.4,
      z = (r() - 0.5) * 1.4;
    const t = new T.Mesh(new T.CylinderGeometry(0.035, 0.05, h, 8), tubeM);
    t.position.set(x, h / 2, z);
    t.rotation.set((r() - 0.5) * 0.3, 0, (r() - 0.5) * 0.3);
    const p = new T.Mesh(new T.ConeGeometry(0.09, 0.22, 10), plume);
    p.position.set(x + t.rotation.z * -h * 0.5, h + 0.08, z + t.rotation.x * h * 0.5);
    g.add(t, p);
    plumes.push(p);
  }
  g.userData.update = (tt: number) => plumes.forEach((p, i) => (p.scale.y = 1 + Math.sin(tt * 2 + i) * 0.15));
  return g;
}

export function crab(color = '#e0e0da') {
  const g = new T.Group();
  const m = std(color, 0.6);
  const body = new T.Mesh(new T.SphereGeometry(0.15, 16, 10), m);
  body.scale.set(1, 0.5, 1.2);
  g.add(body);
  eyes(g, 0.1, 0.1, 0.05, 0.025);
  const legs: T.Mesh[] = [];
  for (const s of [-1, 1])
    for (let i = 0; i < 4; i++) {
      const l = new T.Mesh(new T.CylinderGeometry(0.012, 0.012, 0.28, 5), m);
      l.position.set(-0.06 + i * 0.05, -0.02, s * 0.2);
      l.rotation.x = s * 1.1;
      g.add(l);
      legs.push(l);
    }
  for (const s of [-1, 1]) {
    const c = new T.Mesh(new T.SphereGeometry(0.06, 10, 8), m);
    c.scale.set(1.4, 0.8, 1);
    c.position.set(0.2, 0.02, s * 0.14);
    g.add(c);
  }
  g.userData.update = (t: number, ph = 0) => legs.forEach((l, i) => (l.rotation.z = Math.sin(t * 6 + i + ph) * 0.2));
  return g;
}

export function shrimp(color = '#f2e6e0', size = 1) {
  const g = new T.Group();
  const m = std(color, 0.4, { transparent: true, opacity: 0.9 });
  for (let i = 0; i < 6; i++) {
    const s = new T.Mesh(new T.SphereGeometry(0.05 - i * 0.005, 10, 8), m);
    s.position.set(-i * 0.06, Math.sin(i * 0.5) * 0.03, 0);
    s.scale.set(1.3, 1, 1);
    g.add(s);
  }
  for (let i = 0; i < 2; i++) {
    const a = new T.Mesh(new T.CylinderGeometry(0.003, 0.003, 0.3, 4), m);
    a.rotation.z = -1.1;
    a.position.set(0.14, 0.05, (i - 0.5) * 0.04);
    g.add(a);
  }
  eyes(g, 0.05, 0.03, 0.03, 0.015);
  g.scale.setScalar(size);
  return g;
}

export function seaCucumber() {
  const g = new T.Group();
  const geo = new T.CapsuleGeometry(0.12, 0.5, 8, 16);
  geo.rotateZ(Math.PI / 2);
  const b = new T.Mesh(geo, std('#a3242e', 0.7));
  b.scale.set(1, 0.8, 1);
  g.add(b);
  const bm = std('#c9474f', 0.6);
  for (let i = 0; i < 26; i++) {
    const c = new T.Mesh(new T.ConeGeometry(0.02, 0.07, 5), bm);
    const a = (i * 2.4) % 6.28;
    c.position.set(-0.3 + (i / 26) * 0.6, Math.sin(a) * 0.1, Math.cos(a) * 0.12);
    c.lookAt(c.position.clone().multiplyScalar(2).setX(c.position.x));
    c.rotateX(Math.PI / 2);
    g.add(c);
  }
  return g;
}

export function brittleStar(color = '#e07a2a') {
  const g = new T.Group();
  const m = std(color, 0.6);
  g.add(new T.Mesh(new T.CylinderGeometry(0.08, 0.08, 0.04, 10), m));
  const arms: T.Mesh[] = [];
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * 6.28;
    const curve = new T.CatmullRomCurve3([new T.Vector3(0, 0, 0), new T.Vector3(Math.cos(a) * 0.3, 0, Math.sin(a) * 0.3), new T.Vector3(Math.cos(a + 0.4) * 0.6, 0.02, Math.sin(a + 0.4) * 0.6)]);
    const arm = new T.Mesh(new T.TubeGeometry(curve, 16, 0.018, 5), m);
    g.add(arm);
    arms.push(arm);
  }
  g.userData.update = (t: number) => (g.rotation.y = Math.sin(t * 0.3) * 0.3);
  return g;
}

/** Ikan tripod berdiri di atas tiga jari-jari sirip panjang. */
export function tripodFish() {
  const g = new T.Group();
  const f = buildFish(SPECIES['ikan-tripod']);
  f.position.y = 0.9;
  g.add(f);
  const m = std('#bdb6aa', 0.5);
  for (const [x, z] of [
    [-0.25, 0],
    [0.05, 0.1],
    [0.05, -0.1],
  ]) {
    const leg = new T.Mesh(new T.CylinderGeometry(0.006, 0.006, 0.95, 4), m);
    leg.position.set(x, 0.45, z);
    g.add(leg);
  }
  g.userData.update = (t: number) => f.userData.update?.(t);
  return g;
}

export function amphipods(n: number) {
  const g = new T.Group();
  const list: T.Object3D[] = [];
  for (let i = 0; i < n; i++) {
    const s = shrimp('#f6efe6', 0.9);
    g.add(s);
    list.push(s);
  }
  g.userData.update = (t: number) =>
    list.forEach((s, i) => {
      const a = t * (0.6 + (i % 5) * 0.1) + i * 1.7;
      s.position.set(Math.cos(a) * (0.4 + (i % 4) * 0.25), 0.1 + Math.abs(Math.sin(t * 2 + i)) * 0.25, Math.sin(a * 1.2) * (0.4 + (i % 3) * 0.3));
      s.rotation.y = -a - Math.PI / 2;
    });
  return g;
}

export function anemone(color = '#c9a0ff') {
  const g = new T.Group();
  const m = std(color, 0.5, { emissive: color, emissiveIntensity: 0.08 });
  g.add(new T.Mesh(new T.CylinderGeometry(0.18, 0.22, 0.14, 16), std('#b87a9a', 0.7)));
  const tents: T.Mesh[] = [];
  for (let i = 0; i < 60; i++) {
    const a = i * 2.4,
      r = 0.05 + (i % 7) * 0.022;
    const t = new T.Mesh(new T.CapsuleGeometry(0.018, 0.2, 3, 6), m);
    t.position.set(Math.cos(a) * r, 0.18, Math.sin(a) * r);
    g.add(t);
    tents.push(t);
  }
  g.userData.update = (tt: number) =>
    tents.forEach((t, i) => {
      t.rotation.x = Math.sin(tt * 1.4 + i * 0.3) * 0.35;
      t.rotation.z = Math.cos(tt * 1.1 + i * 0.2) * 0.35;
    });
  return g;
}
