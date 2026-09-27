// Kolam ikan Kebun Rinoya: kolam batu alam yang ditinggikan dengan dasar berlumpur-kerikil, dinding dalam
// berlumut, air bening kehijauan (tepi dangkal lebih terang, tengah lebih dalam), pantulan langit & kilau
// matahari, riak air. Di dalamnya berenang ikan air tawar yang beragam: koi kohaku, sanke, showa, ogon, chagoi,
// mas koki, nila, dan ikan mas — badannya meliuk (ekor mengibas) sesuai kecepatan. Anak bisa memberi makan:
// pelet dilempar, mengapung, ikan-ikan berebut naik ke permukaan dan menyambarnya (riak + bunyi "plup").
// Ada daun & bunga teratai, pancuran bambu yang terus mengalirkan air, dan papan nama jenis ikan.

import * as T from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const WL = 0.36; // tinggi permukaan air
const BED = 0.03; // dasar kolam

function rnd(seed: number) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

function canvasTex(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d')!);
  const t = new T.CanvasTexture(c);
  t.colorSpace = T.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

const _m = new T.Matrix4(),
  _q = new T.Quaternion(),
  _e = new T.Euler(),
  _p = new T.Vector3(),
  _s = new T.Vector3();
/** Geometri non-indeks berwarna (atribut color) + penanda bagian (aPart) agar bisa digabung. */
function part(geo: T.BufferGeometry, color: string, partId: number, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = sx, sz = sx) {
  const g = geo.index ? geo.toNonIndexed() : geo.clone();
  geo.dispose();
  if (!g.getAttribute('uv')) g.setAttribute('uv', new T.BufferAttribute(new Float32Array(g.getAttribute('position').count * 2), 2));
  _m.compose(_p.set(x, y, z), _q.setFromEuler(_e.set(rx, ry, rz)), _s.set(sx, sy, sz));
  g.applyMatrix4(_m);
  const n = g.getAttribute('position').count;
  const c = new T.Color(color);
  const col = new Float32Array(n * 3);
  const pid = new Float32Array(n).fill(partId);
  for (let i = 0; i < n; i++) {
    col[i * 3] = c.r;
    col[i * 3 + 1] = c.g;
    col[i * 3 + 2] = c.b;
  }
  g.setAttribute('color', new T.BufferAttribute(col, 3));
  g.setAttribute('aPart', new T.BufferAttribute(pid, 1));
  return g;
}

/* ---------------- ikan ---------------- */

export interface FishKind {
  id: string;
  name: string;
  base: string;
  patch?: string; // bercak besar (merah koi)
  spot?: string; // bintik kecil (hitam sanke / putih showa)
  stripe?: string; // garis tegak (nila)
  belly: string;
  fin: string;
  metal?: number;
  len: [number, number]; // panjang (m)
  fat?: number; // gemuk (mas koki)
  fancy?: boolean; // ekor berumbai
  n: number;
}

export const FISH: FishKind[] = [
  { id: 'kohaku', name: 'Koi kohaku', base: '#f7f3ec', patch: '#d8261a', belly: '#fbf8f3', fin: '#f4efe8', len: [0.55, 0.75], n: 3 },
  { id: 'sanke', name: 'Koi sanke', base: '#f7f3ec', patch: '#d8321a', spot: '#141414', belly: '#fbf8f3', fin: '#f2ede6', len: [0.5, 0.7], n: 2 },
  { id: 'showa', name: 'Koi showa', base: '#1a1a1a', patch: '#d8321a', spot: '#f4f0e8', belly: '#e8e2d8', fin: '#2a2a2a', len: [0.5, 0.7], n: 2 },
  { id: 'ogon', name: 'Koi ogon', base: '#e8b53a', belly: '#f6d77a', fin: '#f2c85a', metal: 0.55, len: [0.55, 0.72], n: 2 },
  { id: 'chagoi', name: 'Koi chagoi', base: '#8a6440', belly: '#c8a47a', fin: '#9a7450', len: [0.6, 0.8], n: 1 },
  { id: 'koki', name: 'Mas koki', base: '#f2661a', patch: '#ffffff', belly: '#f8c080', fin: '#f59a4a', len: [0.2, 0.28], fat: 1.45, fancy: true, n: 4 },
  { id: 'nila', name: 'Ikan nila', base: '#6f7a6a', stripe: '#3a4436', belly: '#d2d2c2', fin: '#5a6656', len: [0.28, 0.4], fat: 1.15, n: 4 },
  { id: 'mas', name: 'Ikan mas', base: '#b08a3a', belly: '#ecdca6', fin: '#9a7a3a', metal: 0.3, len: [0.45, 0.6], n: 2 },
];

/** Badan ikan (hadap +x, panjang 1): badan lathe, sirip ekor bercabang, sirip punggung, sirip dada, mata. */
function fishGeometry(k: FishKind) {
  const prof = [
    [0.0, 0.5],
    [0.045, 0.485],
    [0.085, 0.43],
    [0.112, 0.33],
    [0.122, 0.18],
    [0.116, 0.02],
    [0.092, -0.14],
    [0.06, -0.27],
    [0.034, -0.36],
    [0.0, -0.38],
  ].map(([r, y]) => new T.Vector2(r, y));
  const fat = k.fat ?? 1;
  const parts: T.BufferGeometry[] = [];
  // badan (sumbu lathe y → x)
  parts.push(part(new T.LatheGeometry(prof, 18).rotateZ(-Math.PI / 2), '#ffffff', 0, 0, 0, 0, 0, 0, 0, 1, 1.08 * fat, 0.8 * fat));
  // sirip ekor
  const tail = new T.Shape();
  if (k.fancy) {
    tail.moveTo(-0.34, 0);
    tail.bezierCurveTo(-0.5, 0.22, -0.78, 0.26, -0.74, 0.08);
    tail.lineTo(-0.62, 0);
    tail.lineTo(-0.74, -0.08);
    tail.bezierCurveTo(-0.78, -0.26, -0.5, -0.22, -0.34, 0);
  } else {
    tail.moveTo(-0.34, 0);
    tail.lineTo(-0.58, 0.15);
    tail.quadraticCurveTo(-0.53, 0.03, -0.5, 0);
    tail.quadraticCurveTo(-0.53, -0.03, -0.58, -0.15);
    tail.lineTo(-0.34, 0);
  }
  parts.push(part(new T.ShapeGeometry(tail, 6), '#ffffff', 1));
  if (k.fancy) parts.push(part(new T.ShapeGeometry(tail, 6), '#ffffff', 1, 0, 0, 0, 0.5, 0, 0));
  // sirip punggung
  const dorsal = new T.Shape();
  dorsal.moveTo(0.16, 0.1);
  dorsal.quadraticCurveTo(0.05, 0.22 * fat, -0.2, 0.15);
  dorsal.lineTo(-0.24, 0.06);
  dorsal.lineTo(0.16, 0.1);
  parts.push(part(new T.ShapeGeometry(dorsal, 4), '#ffffff', 1, 0, 0.02 * fat, 0));
  // sirip dada & perut
  for (const s of [-1, 1]) {
    const pec = new T.Shape();
    pec.moveTo(0, 0);
    pec.lineTo(-0.14, 0.05);
    pec.lineTo(-0.12, -0.02);
    pec.lineTo(0, 0);
    parts.push(part(new T.ShapeGeometry(pec), '#ffffff', 1, 0.24, -0.05, s * 0.08 * fat, -Math.PI / 2 + s * 0.35, 0, 0));
    parts.push(part(new T.ShapeGeometry(pec), '#ffffff', 1, -0.05, -0.08 * fat, s * 0.05 * fat, -Math.PI / 2 + s * 0.6, 0, 0, 0.8));
  }
  // mata
  for (const s of [-1, 1]) parts.push(part(new T.SphereGeometry(0.022, 8, 6), '#000000', 2, 0.39, 0.03, s * 0.058 * fat));
  const g = mergeGeometries(parts)!;
  parts.forEach((p) => p.dispose());
  return g;
}

function fishMaterial(k: FishKind, seed: number) {
  const u = {
    uPh: { value: 0 },
    uAmp: { value: 0.05 },
    uSeed: { value: seed },
    uBase: { value: new T.Color(k.base) },
    uPatch: { value: new T.Color(k.patch ?? k.base) },
    uSpot: { value: new T.Color(k.spot ?? k.base) },
    uStripe: { value: new T.Color(k.stripe ?? k.base) },
    uBelly: { value: new T.Color(k.belly) },
    uFin: { value: new T.Color(k.fin) },
    uW: { value: new T.Vector3(k.patch ? 1 : 0, k.spot ? 1 : 0, k.stripe ? 1 : 0) },
  };
  const m = new T.MeshStandardMaterial({ roughness: 0.32, metalness: k.metal ?? 0.08, side: T.DoubleSide, transparent: false });
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aPart; uniform float uPh; uniform float uAmp; varying vec3 vObj; varying float vPart;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vObj = position; vPart = aPart;
        float tailK = 1.0 - smoothstep(-0.62, 0.35, position.x);
        transformed.z += sin(uPh - position.x * 5.5) * uAmp * (0.12 + tailK * tailK * 1.3);`,
      );
    sh.fragmentShader = sh.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform float uSeed; uniform vec3 uBase, uPatch, uSpot, uStripe, uBelly, uFin, uW; varying vec3 vObj; varying float vPart;
        float fh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float fn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
          return mix(mix(fh(i), fh(i+vec2(1,0)), f.x), mix(fh(i+vec2(0,1)), fh(i+vec2(1,1)), f.x), f.y); }`,
      )
      .replace(
        'vec4 diffuseColor = vec4( diffuse, opacity );',
        `vec3 col = uBase;
        vec2 q = vObj.xz * vec2(6.0, 11.0) + uSeed;
        float top = smoothstep(-0.04, 0.05, vObj.y);
        float pch = step(0.52, fn(q) * 0.7 + fn(q * 2.3) * 0.3);
        col = mix(col, uPatch, pch * top * uW.x);
        float spot = step(0.74, fn(vObj.xz * vec2(14.0, 22.0) + uSeed * 1.7));
        col = mix(col, uSpot, spot * top * uW.y);
        col = mix(col, uStripe, smoothstep(0.35, 0.95, sin(vObj.x * 34.0 + 1.0)) * 0.55 * uW.z);
        col = mix(col, uBelly, 1.0 - smoothstep(-0.09, 0.0, vObj.y));
        col *= 0.93 + 0.07 * sin(vObj.x * 95.0) * sin(vObj.z * 80.0 + vObj.y * 95.0);
        if (vPart > 0.5 && vPart < 1.5) col = mix(uFin, col, 0.25) * (0.85 + 0.15 * sin(vObj.x * 120.0));
        if (vPart > 1.5) col = vec3(0.02);
        vec4 diffuseColor = vec4(col, opacity);`,
      );
  };
  return { m, u };
}

interface Fish {
  kind: FishKind;
  mesh: T.Mesh;
  u: { uPh: { value: number }; uAmp: { value: number } };
  x: number;
  z: number;
  y: number;
  a: number; // arah hadap (rad), maju = (cos a, sin a)
  speed: number;
  size: number;
  tx: number;
  tz: number;
  ty: number;
  retarget: number;
  gulp: number;
}

interface Pellet {
  mesh: T.Mesh;
  from: T.Vector3;
  to: T.Vector3;
  t: number; // 0…1 melayang di udara, >1 mengapung
  life: number;
  vx: number;
  vz: number;
}

export class FishPond {
  group = new T.Group();
  readonly center: T.Vector3;
  private fish: Fish[] = [];
  private pellets: Pellet[] = [];
  private ripples: T.Vector4[] = Array.from({ length: 10 }, () => new T.Vector4(0, 0, -99, 0));
  private ri = 0;
  private pads: T.Object3D[] = [];
  private textures: T.Texture[] = [];
  private pelletGeo = new T.SphereGeometry(0.022, 6, 5);
  private pelletMat = new T.MeshStandardMaterial({ color: '#8a5a2a', roughness: 0.8 });
  private spout = new T.Vector3();
  private nextSpout = 0;
  private fishGeo = new Map<string, T.BufferGeometry>();

  constructor(
    center: T.Vector3,
    readonly rx: number,
    readonly rz: number,
    private uTime: { value: number },
    sunDir: T.Vector3,
    private sound: (k: 'plop' | 'splash', vol?: number) => void,
  ) {
    this.center = center.clone();
    const r = rnd(4242);
    const cx = center.x,
      cz = center.z;

    // dasar kolam: lumpur & kerikil, makin gelap di tengah
    const bedTex = canvasTex(256, 256, (g) => {
      const grd = g.createRadialGradient(128, 128, 10, 128, 128, 128);
      grd.addColorStop(0, '#3e4a3a');
      grd.addColorStop(0.7, '#5e5c46');
      grd.addColorStop(1, '#7e7658');
      g.fillStyle = grd;
      g.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 900; i++) {
        const x = r() * 256,
          y = r() * 256;
        g.fillStyle = ['#7a7462', '#5a5646', '#8a8270', '#3a3a2e'][Math.floor(r() * 4)];
        g.beginPath();
        g.ellipse(x, y, 1 + r() * 3, 1 + r() * 2, r() * 3, 0, Math.PI * 2);
        g.fill();
      }
      for (let i = 0; i < 40; i++) {
        g.fillStyle = 'rgba(60,90,40,.35)';
        g.beginPath();
        g.arc(r() * 256, r() * 256, 4 + r() * 10, 0, Math.PI * 2);
        g.fill();
      }
    });
    this.textures.push(bedTex);
    const bed = new T.Mesh(new T.CircleGeometry(1, 48), new T.MeshStandardMaterial({ map: bedTex, roughness: 1 }));
    bed.rotation.x = -Math.PI / 2;
    bed.scale.set(rx + 0.15, rz + 0.15, 1);
    bed.position.set(cx, BED, cz);
    this.group.add(bed);
    // dinding dalam berlumut
    const wallTex = canvasTex(256, 64, (g) => {
      g.fillStyle = '#5a5a4a';
      g.fillRect(0, 0, 256, 64);
      for (let i = 0; i < 160; i++) {
        g.fillStyle = ['#6a6a58', '#4a4a3c', '#7a7866', '#3e5a34'][Math.floor(r() * 4)];
        g.fillRect(r() * 256, r() * 64, 6 + r() * 16, 4 + r() * 10);
      }
      const gr = g.createLinearGradient(0, 0, 0, 64);
      gr.addColorStop(0, 'rgba(0,0,0,0)');
      gr.addColorStop(1, 'rgba(40,70,30,.6)');
      g.fillStyle = gr;
      g.fillRect(0, 0, 256, 64);
    });
    wallTex.wrapS = T.RepeatWrapping;
    wallTex.repeat.set(10, 1);
    this.textures.push(wallTex);
    const wall = new T.Mesh(new T.CylinderGeometry(1, 1, WL + 0.02, 64, 1, true), new T.MeshStandardMaterial({ map: wallTex, roughness: 1, side: T.BackSide }));
    wall.scale.set(rx + 0.15, 1, rz + 0.15);
    wall.position.set(cx, (WL + 0.02) / 2, cz);
    this.group.add(wall);

    // tepian batu alam dua lapis + batu penutup datar
    const S: T.BufferGeometry[] = [];
    const stoneCol = ['#a8a298', '#8f8a80', '#b8b0a2', '#7a766c', '#9a9284', '#a0927a'];
    const ringAt = (k: number, n: number, y: number, sx: number, sy: number, grow: number) => {
      for (let i = 0; i < n; i++) {
        const a = ((i + (k % 2) * 0.5) / n) * Math.PI * 2;
        const R = 1 + grow;
        S.push(
          part(
            new T.DodecahedronGeometry(1, 1),
            stoneCol[Math.floor(r() * stoneCol.length)],
            0,
            cx + Math.cos(a) * (rx + 0.45) * R,
            y,
            cz + Math.sin(a) * (rz + 0.45) * R,
            r() * 0.3,
            -a + (r() - 0.5) * 0.4,
            r() * 0.2,
            sx * (0.85 + r() * 0.35),
            sy * (0.8 + r() * 0.4),
            sx * (0.7 + r() * 0.3),
          ),
        );
      }
    };
    ringAt(0, 34, 0.16, 0.5, 0.26, 0);
    ringAt(1, 30, 0.4, 0.55, 0.14, 0.01);
    const rim = mergeGeometries(S)!;
    S.forEach((g) => g.dispose());
    rim.computeVertexNormals();
    const rock = new T.Mesh(rim, new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, flatShading: true }));
    rock.castShadow = rock.receiveShadow = true;
    this.group.add(rock);

    // air
    const water = new T.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime,
        uSun: { value: sunDir.clone().normalize() },
        uC: { value: new T.Vector2(cx, cz) },
        uR: { value: new T.Vector2(rx + 0.15, rz + 0.15) },
        uRip: { value: this.ripples },
      },
      vertexShader: 'varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
      fragmentShader: `uniform float uTime; uniform vec3 uSun; uniform vec2 uC; uniform vec2 uR; uniform vec4 uRip[10]; varying vec3 vW;
        void main(){
          vec2 p = vW.xz;
          float e = length((p - uC) / uR);
          float nx = sin(p.x*2.3+uTime*1.3)*0.035 + sin((p.x+p.y)*4.1-uTime*1.7)*0.02 + sin(p.y*7.3+uTime*2.1)*0.01;
          float nz = cos(p.y*2.7+uTime*1.1)*0.035 + cos((p.x-p.y)*3.7+uTime*1.5)*0.02 + cos(p.x*6.1-uTime*1.9)*0.01;
          for (int i = 0; i < 10; i++) {
            vec4 r = uRip[i];
            float age = uTime - r.z;
            if (age < 0.0 || age > 2.6) continue;
            vec2 d = p - r.xy;
            float dist = length(d) + 1e-4;
            float front = age * 0.75;
            float w = exp(-pow((dist - front) * 7.0, 2.0)) * (1.0 - age / 2.6) * r.w;
            float wave = cos((dist - front) * 28.0) * w;
            nx += d.x / dist * wave * 0.35;
            nz += d.y / dist * wave * 0.35;
          }
          vec3 n = normalize(vec3(nx, 1.0, nz));
          vec3 v = normalize(cameraPosition - vW);
          float fres = pow(1.0 - max(dot(n, v), 0.0), 4.0);
          vec3 deep = vec3(0.09, 0.25, 0.25), shallow = vec3(0.32, 0.48, 0.38);
          vec3 body = mix(deep, shallow, smoothstep(0.3, 1.0, e));
          float caus = pow(abs(sin(p.x*5.0 + sin(p.y*4.0 + uTime) + uTime*0.6) * sin(p.y*5.5 + sin(p.x*3.0 - uTime*0.8))), 6.0);
          body += caus * 0.05;
          vec3 sky = vec3(0.72, 0.85, 0.96);
          vec3 c = mix(body, sky, 0.06 + fres * 0.75);
          vec3 h = normalize(uSun + v);
          c += vec3(1.0, 0.96, 0.88) * pow(max(dot(n, h), 0.0), 240.0) * 2.2;
          float a = mix(0.26, 0.9, fres) + smoothstep(0.85, 1.0, e) * 0.15;
          gl_FragColor = vec4(c, clamp(a, 0.0, 0.96));
        }`,
    });
    const surf = new T.Mesh(new T.CircleGeometry(1, 64), water);
    surf.rotation.x = -Math.PI / 2;
    surf.scale.set(rx + 0.15, rz + 0.15, 1);
    surf.position.set(cx, WL, cz);
    surf.renderOrder = 2;
    this.group.add(surf);

    // daun teratai & bunga
    const padTex = canvasTex(128, 128, (g) => {
      g.fillStyle = '#3f7f2f';
      g.beginPath();
      g.arc(64, 64, 62, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = 'rgba(180,220,120,.45)';
      g.lineWidth = 1.5;
      for (let k = 0; k < 14; k++) {
        const a = (k / 14) * Math.PI * 2;
        g.beginPath();
        g.moveTo(64, 64);
        g.lineTo(64 + Math.cos(a) * 60, 64 + Math.sin(a) * 60);
        g.stroke();
      }
      g.fillStyle = 'rgba(120,170,60,.35)';
      g.beginPath();
      g.arc(58, 58, 30, 0, Math.PI * 2);
      g.fill();
    });
    this.textures.push(padTex);
    const padMat = new T.MeshStandardMaterial({ map: padTex, roughness: 0.6, side: T.DoubleSide });
    const petalMat = new T.MeshStandardMaterial({ color: '#f7a6c2', roughness: 0.6, side: T.DoubleSide });
    const petalIn = new T.MeshStandardMaterial({ color: '#fde2ec', roughness: 0.6, side: T.DoubleSide });
    for (let i = 0; i < 11; i++) {
      const a = r() * Math.PI * 2,
        d = 0.45 + r() * 0.45;
      const px = cx + Math.cos(a) * rx * d,
        pz = cz + Math.sin(a) * rz * d;
      const pad = new T.Mesh(new T.CircleGeometry(0.28 + r() * 0.18, 18, 0.3, Math.PI * 2 - 0.35), padMat);
      pad.rotation.set(-Math.PI / 2, 0, r() * 6);
      pad.position.set(px, WL + 0.012, pz);
      pad.receiveShadow = true;
      pad.userData.ph = r() * 6;
      this.group.add(pad);
      this.pads.push(pad);
      if (i % 3 === 0) {
        const fl = new T.Group();
        for (let k = 0; k < 10; k++) {
          const inner = k >= 6;
          const pet = new T.Mesh(new T.SphereGeometry(0.07, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2), inner ? petalIn : petalMat);
          pet.scale.set(0.55, 1.5, 0.3);
          const aa = (k / (inner ? 4 : 6)) * Math.PI * 2;
          pet.position.set(Math.cos(aa) * (inner ? 0.03 : 0.06), 0.06, Math.sin(aa) * (inner ? 0.03 : 0.06));
          pet.rotation.set(Math.sin(aa) * (inner ? 0.3 : 0.7), 0, -Math.cos(aa) * (inner ? 0.3 : 0.7));
          fl.add(pet);
        }
        const heart = new T.Mesh(new T.CylinderGeometry(0.03, 0.025, 0.03, 10), new T.MeshStandardMaterial({ color: '#f2d24a' }));
        heart.position.y = 0.06;
        fl.add(heart);
        fl.position.set(px + 0.08, WL + 0.02, pz + 0.05);
        this.group.add(fl);
      }
    }

    // pancuran bambu di tepi utara: air terus mengalir ke kolam
    const bamboo = new T.MeshStandardMaterial({ color: '#b8a052', roughness: 0.6 });
    const sa = -Math.PI / 2 + 0.35;
    const bx = cx + Math.cos(sa) * (rx + 0.6),
      bz = cz + Math.sin(sa) * (rz + 0.6);
    const post = new T.Mesh(new T.CylinderGeometry(0.07, 0.08, 1.4, 10), bamboo);
    post.position.set(bx, 0.7, bz);
    const pipe = new T.Mesh(new T.CylinderGeometry(0.05, 0.05, 1.0, 10), bamboo);
    const inward = new T.Vector3(cx - bx, 0, cz - bz).normalize();
    pipe.position.set(bx + inward.x * 0.45, 1.25, bz + inward.z * 0.45);
    pipe.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), new T.Vector3(inward.x, -0.25, inward.z).normalize());
    this.group.add(post, pipe);
    const tip = new T.Vector3(bx + inward.x * 0.93, 1.13, bz + inward.z * 0.93);
    this.spout.set(tip.x + inward.x * 0.18, WL, tip.z + inward.z * 0.18);
    const stream = new T.Mesh(new T.CylinderGeometry(0.02, 0.035, tip.y - WL, 8, 1, true), new T.MeshStandardMaterial({ color: '#dff2ff', transparent: true, opacity: 0.55, roughness: 0.1 }));
    stream.position.set((tip.x + this.spout.x) / 2, (tip.y + WL) / 2, (tip.z + this.spout.z) / 2);
    stream.rotation.z = 0.08;
    this.group.add(stream);

    // papan nama jenis ikan
    const sign = canvasTex(512, 256, (g) => {
      g.fillStyle = '#8a5a34';
      g.fillRect(0, 0, 512, 256);
      g.fillStyle = '#f7ecd6';
      g.fillRect(12, 12, 488, 232);
      g.fillStyle = '#1f4f7a';
      g.font = '900 44px system-ui, sans-serif';
      g.textAlign = 'center';
      g.fillText('🐟 Kolam Ikan', 256, 62);
      g.fillStyle = '#3a2a1a';
      g.font = '700 26px system-ui, sans-serif';
      g.fillText('Koi kohaku · sanke · showa · ogon', 256, 116);
      g.fillText('Mas koki · Nila · Ikan mas', 256, 156);
      g.fillStyle = '#8a3a2a';
      g.font = '800 24px system-ui, sans-serif';
      g.fillText('Beri makan secukupnya ya!', 256, 212);
    });
    this.textures.push(sign);
    const ga = Math.PI / 2 - 0.2;
    const gx = cx + Math.cos(ga) * (rx + 1.4),
      gz = cz + Math.sin(ga) * (rz + 1.4);
    const board = new T.Mesh(new T.PlaneGeometry(1.5, 0.75), new T.MeshStandardMaterial({ map: sign, roughness: 0.8 }));
    board.position.set(gx, 1.15, gz);
    board.lookAt(gx, 1.15, gz + 5);
    board.rotation.x = -0.15;
    const legM = new T.MeshStandardMaterial({ color: '#6b4a31', roughness: 0.9 });
    for (const s of [-0.6, 0.6]) {
      const leg = new T.Mesh(new T.BoxGeometry(0.08, 1.2, 0.08), legM);
      leg.position.set(gx + s, 0.6, gz - 0.03);
      this.group.add(leg);
    }
    this.group.add(board);

    // ikan
    let seed = 1;
    for (const k of FISH) {
      if (!this.fishGeo.has(k.id)) this.fishGeo.set(k.id, fishGeometry(k));
      for (let i = 0; i < k.n; i++) {
        const { m, u } = fishMaterial(k, seed++ * 7.31);
        const mesh = new T.Mesh(this.fishGeo.get(k.id)!, m);
        const size = k.len[0] + r() * (k.len[1] - k.len[0]);
        mesh.scale.setScalar(size);
        mesh.castShadow = false;
        this.group.add(mesh);
        const a = r() * Math.PI * 2,
          d = r() * 0.7;
        const f: Fish = { kind: k, mesh, u, x: cx + Math.cos(a) * rx * d, z: cz + Math.sin(a) * rz * d, y: BED + 0.1 + r() * 0.15, a: r() * 6, speed: 0.2, size, tx: cx, tz: cz, ty: 0.15, retarget: 0, gulp: 0 };
        this.pickTarget(f, r);
        this.fish.push(f);
      }
    }
  }

  /** Nilai elips: <1 di dalam air. */
  inside(x: number, z: number, pad = 0) {
    return ((x - this.center.x) / (this.rx + pad)) ** 2 + ((z - this.center.z) / (this.rz + pad)) ** 2;
  }

  /** Titik tepi kolam (untuk berdiri) searah dari tengah ke posisi p. */
  standPoint(p: T.Vector3) {
    const d = new T.Vector3(p.x - this.center.x, 0, p.z - this.center.z);
    if (d.lengthSq() < 1e-4) d.set(0, 0, 1);
    const a = Math.atan2(d.z, d.x);
    return new T.Vector3(this.center.x + Math.cos(a) * (this.rx + 1.35), 0, this.center.z + Math.sin(a) * (this.rz + 1.35));
  }

  private pickTarget(f: Fish, r: () => number = Math.random) {
    const a = r() * Math.PI * 2,
      d = Math.sqrt(r()) * 0.78;
    f.tx = this.center.x + Math.cos(a) * this.rx * d;
    f.tz = this.center.z + Math.sin(a) * this.rz * d;
    f.ty = BED + 0.08 + r() * (WL - BED - 0.16);
    f.retarget = 3 + r() * 6;
  }

  private ripple(x: number, z: number, strength = 1) {
    this.ripples[this.ri].set(x, z, this.uTime.value, strength);
    this.ri = (this.ri + 1) % this.ripples.length;
  }

  /** Lempar pelet dari tangan (from) ke sekitar titik aim di permukaan air. */
  feed(from: T.Vector3, aim: T.Vector3) {
    const n = 10 + Math.floor(Math.random() * 5);
    for (let i = 0; i < n; i++) {
      const to = new T.Vector3(aim.x + (Math.random() - 0.5) * 1.6, WL + 0.01, aim.z + (Math.random() - 0.5) * 1.6);
      if (this.inside(to.x, to.z) > 0.85) to.lerp(new T.Vector3(this.center.x, WL + 0.01, this.center.z), 0.3);
      const mesh = new T.Mesh(this.pelletGeo, this.pelletMat);
      mesh.position.copy(from);
      this.group.add(mesh);
      this.pellets.push({ mesh, from: from.clone(), to, t: -i * 0.03, life: 30, vx: (Math.random() - 0.5) * 0.05, vz: (Math.random() - 0.5) * 0.05 });
    }
  }

  /** Titik bidik di air, sedikit ke dalam dari tepi terdekat pemain. */
  aimFrom(p: T.Vector3) {
    const a = Math.atan2(p.z - this.center.z, p.x - this.center.x);
    return new T.Vector3(this.center.x + Math.cos(a) * this.rx * 0.55, WL, this.center.z + Math.sin(a) * this.rz * 0.55);
  }

  update(t: number, dt: number) {
    // pancuran: riak terus-menerus
    if (t > this.nextSpout) {
      this.ripple(this.spout.x, this.spout.z, 0.7);
      this.nextSpout = t + 0.45;
    }
    for (const p of this.pads) p.position.y = WL + 0.012 + Math.sin(t * 1.2 + (p.userData.ph as number)) * 0.004;
    // pelet
    const floating: Pellet[] = [];
    for (let i = this.pellets.length - 1; i >= 0; i--) {
      const p = this.pellets[i];
      if (p.t < 1) {
        p.t += dt * 1.6;
        const k = T.MathUtils.clamp(p.t, 0, 1);
        p.mesh.position.lerpVectors(p.from, p.to, k);
        p.mesh.position.y += Math.sin(k * Math.PI) * 0.9;
        if (p.t >= 1) {
          this.ripple(p.to.x, p.to.z, 0.5);
          if (i % 3 === 0) this.sound('plop', 0.6);
        }
      } else {
        p.life -= dt;
        p.mesh.position.x += p.vx * dt;
        p.mesh.position.z += p.vz * dt;
        p.mesh.position.y = WL + 0.008 + Math.sin(t * 3 + i) * 0.003 - (p.life < 3 ? (3 - p.life) * 0.08 : 0);
        if (p.life <= 0) {
          this.group.remove(p.mesh);
          this.pellets.splice(i, 1);
          continue;
        }
        floating.push(p);
      }
    }
    // ikan
    const cx = this.center.x,
      cz = this.center.z;
    for (const f of this.fish) {
      let food: Pellet | null = null;
      let fd = 7;
      for (const p of floating) {
        const d = Math.hypot(p.mesh.position.x - f.x, p.mesh.position.z - f.z);
        if (d < fd) {
          fd = d;
          food = p;
        }
      }
      let want = 0.18 + f.size * 0.35;
      if (food) {
        f.tx = food.mesh.position.x;
        f.tz = food.mesh.position.z;
        f.ty = WL - 0.03;
        want = 0.7 + f.size * 0.8;
        // sambar!
        if (fd < 0.12 + f.size * 0.25 && Math.abs(f.y - (WL - 0.03)) < 0.08) {
          const ix = this.pellets.indexOf(food);
          if (ix >= 0) {
            this.group.remove(food.mesh);
            this.pellets.splice(ix, 1);
            floating.splice(floating.indexOf(food), 1);
          }
          f.gulp = 1;
          this.ripple(f.x + Math.cos(f.a) * f.size * 0.4, f.z + Math.sin(f.a) * f.size * 0.4, 1);
          this.sound('plop', 1);
        }
      } else {
        f.retarget -= dt;
        if (f.retarget <= 0 || Math.hypot(f.tx - f.x, f.tz - f.z) < 0.3) this.pickTarget(f);
      }
      // kemudi: menuju target, menjauh dari tepi & ikan lain
      let dx = f.tx - f.x,
        dz = f.tz - f.z;
      const q = this.inside(f.x, f.z);
      if (q > 0.72) {
        dx += (cx - f.x) * (q - 0.72) * 6;
        dz += (cz - f.z) * (q - 0.72) * 6;
      }
      for (const o of this.fish) {
        if (o === f) continue;
        const ox = f.x - o.x,
          oz = f.z - o.z;
        const d2 = ox * ox + oz * oz;
        const min = (f.size + o.size) * 0.45;
        if (d2 < min * min && d2 > 1e-6) {
          dx += (ox / Math.sqrt(d2)) * 0.6;
          dz += (oz / Math.sqrt(d2)) * 0.6;
        }
      }
      const desired = Math.atan2(dz, dx);
      let da = desired - f.a;
      while (da > Math.PI) da -= Math.PI * 2;
      while (da < -Math.PI) da += Math.PI * 2;
      const turn = (food ? 3.2 : 1.4) * dt;
      f.a += T.MathUtils.clamp(da, -turn, turn);
      f.speed = T.MathUtils.damp(f.speed, want * (Math.abs(da) > 1.4 ? 0.5 : 1), 2.5, dt);
      f.x += Math.cos(f.a) * f.speed * dt;
      f.z += Math.sin(f.a) * f.speed * dt;
      const q2 = this.inside(f.x, f.z);
      if (q2 > 0.9) {
        const k = Math.sqrt(0.9 / q2);
        f.x = cx + (f.x - cx) * k;
        f.z = cz + (f.z - cz) * k;
      }
      f.y = T.MathUtils.damp(f.y, f.ty, food ? 3 : 0.8, dt);
      f.y = T.MathUtils.clamp(f.y, BED + 0.05, WL - 0.025);
      f.u.uPh.value += dt * (5 + f.speed * 16);
      f.u.uAmp.value = 0.035 + Math.min(0.09, f.speed * 0.1) + Math.min(0.08, Math.abs(da) * 0.04);
      f.gulp = Math.max(0, f.gulp - dt * 3);
      f.mesh.position.set(f.x, f.y, f.z);
      f.mesh.rotation.set(0, -f.a, T.MathUtils.clamp((f.ty - f.y) * 2, -0.4, 0.4));
      f.mesh.scale.set(f.size * (1 + f.gulp * 0.06), f.size * (1 - f.gulp * 0.04), f.size * (1 + f.gulp * 0.08));
    }
  }

  get hasFood() {
    return this.pellets.length > 0;
  }

  dispose() {
    this.group.traverse((o) => {
      const m = o as T.Mesh;
      if (m.geometry && m.geometry !== this.pelletGeo) m.geometry.dispose();
      const mt = m.material as T.Material | undefined;
      if (mt && mt !== this.pelletMat) mt.dispose();
    });
    this.fishGeo.forEach((g) => g.dispose());
    this.pelletGeo.dispose();
    this.pelletMat.dispose();
    this.textures.forEach((t) => t.dispose());
  }
}
