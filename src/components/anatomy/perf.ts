// Alat performa Jelajah Tubuh: tingkat kualitas per perangkat, penggabungan geometri (satu draw call),
// dan penyederhanaan model untuk tampilan jauh (vertex clustering, tanpa dependensi tambahan).
import * as THREE from 'three';

/** 2 = tinggi (laptop/desktop), 1 = sedang (tablet/HP), 0 = hemat (perangkat lemah / fps rendah). */
export type Quality = 0 | 1 | 2;

export function detectQuality(): Quality {
  if (typeof window === 'undefined') return 2;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency || 4;
  const memory = nav.deviceMemory ?? 8;
  const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  if (cores <= 4 || memory <= 3) return 0;
  if (coarse) return 1;
  return 2;
}

export const pixelRatioFor = (q: Quality) => Math.min(window.devicePixelRatio || 1, q === 2 ? 2 : q === 1 ? 1.5 : 1);

/**
 * Gabungkan banyak mesh jadi satu geometri dalam koordinat dunia (Float32).
 * Atribut terkuantisasi (int16 ternormalisasi) dibaca lewat fromBufferAttribute lalu dikalikan matriks dunia.
 */
export function mergeWorldGeometry(meshes: THREE.Mesh[]): THREE.BufferGeometry {
  let vCount = 0;
  let iCount = 0;
  for (const m of meshes) {
    const g = m.geometry;
    vCount += g.attributes.position.count;
    iCount += g.index ? g.index.count : g.attributes.position.count;
  }
  const P = new Float32Array(vCount * 3);
  const N = new Float32Array(vCount * 3);
  const I = new Uint32Array(iCount);
  const v = new THREE.Vector3();
  const nm = new THREE.Matrix3();
  let vo = 0;
  let io = 0;
  for (const m of meshes) {
    const g = m.geometry;
    const pos = g.attributes.position;
    const nor = g.attributes.normal;
    m.updateWorldMatrix(true, false);
    nm.getNormalMatrix(m.matrixWorld);
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld);
      P[(vo + i) * 3] = v.x;
      P[(vo + i) * 3 + 1] = v.y;
      P[(vo + i) * 3 + 2] = v.z;
      if (nor) {
        v.fromBufferAttribute(nor, i).applyMatrix3(nm).normalize();
        N[(vo + i) * 3] = v.x;
        N[(vo + i) * 3 + 1] = v.y;
        N[(vo + i) * 3 + 2] = v.z;
      }
    }
    if (g.index) for (let i = 0; i < g.index.count; i++) I[io + i] = g.index.getX(i) + vo;
    else for (let i = 0; i < pos.count; i++) I[io + i] = i + vo;
    vo += pos.count;
    io += g.index ? g.index.count : pos.count;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(P, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(N, 3));
  out.setIndex(new THREE.BufferAttribute(I, 1));
  if (!meshes.some((m) => m.geometry.attributes.normal)) out.computeVertexNormals();
  out.computeBoundingSphere();
  out.computeBoundingBox();
  return out;
}

/**
 * Sederhanakan geometri dengan vertex clustering: titik dalam sel grid `cell` (meter) digabung,
 * segitiga yang runtuh dibuang. Cepat (linear), cocok untuk tampilan jauh.
 */
export function clusterSimplify(src: THREE.BufferGeometry, cell: number): THREE.BufferGeometry {
  const pos = src.attributes.position as THREE.BufferAttribute;
  const idx = src.index!;
  const box = src.boundingBox ?? new THREE.Box3().setFromBufferAttribute(pos);
  const K = 2048;
  const map = new Map<number, number>();
  const remap = new Uint32Array(pos.count);
  const acc: number[] = [];
  const cnt: number[] = [];
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const key =
      Math.floor((x - box.min.x) / cell) + Math.floor((y - box.min.y) / cell) * K + Math.floor((z - box.min.z) / cell) * K * K;
    let id = map.get(key);
    if (id === undefined) {
      id = cnt.length;
      map.set(key, id);
      acc.push(0, 0, 0);
      cnt.push(0);
    }
    acc[id * 3] += x;
    acc[id * 3 + 1] += y;
    acc[id * 3 + 2] += z;
    cnt[id]++;
    remap[i] = id;
  }
  const P = new Float32Array(cnt.length * 3);
  for (let i = 0; i < cnt.length; i++) {
    P[i * 3] = acc[i * 3] / cnt[i];
    P[i * 3 + 1] = acc[i * 3 + 1] / cnt[i];
    P[i * 3 + 2] = acc[i * 3 + 2] / cnt[i];
  }
  const tris: number[] = [];
  for (let t = 0; t < idx.count; t += 3) {
    const a = remap[idx.getX(t)];
    const b = remap[idx.getX(t + 1)];
    const c = remap[idx.getX(t + 2)];
    if (a !== b && b !== c && a !== c) tris.push(a, b, c);
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(P, 3));
  out.setIndex(new THREE.BufferAttribute(cnt.length > 65535 ? new Uint32Array(tris) : new Uint16Array(tris), 1));
  out.computeVertexNormals();
  out.computeBoundingSphere();
  return out;
}
