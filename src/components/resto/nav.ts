// Navigasi orang di dalam & sekitar restoran: kisi 0,2 m dengan A* (8 arah) lalu "string pulling" agar
// jalur lurus-lurus wajar. Rintangan dibaca langsung dari geometri yang sudah dibangun (meja, kursi, kasir,
// rak, stasiun dapur, dinding, pagar tangga) sehingga tidak ada orang yang menembus benda. Bila jalur tidak
// ditemukan (mis. titik di luar kisi), pemanggil memakai rute denah lama sebagai cadangan.

import * as T from 'three';
import { AISLE_Z, BLD, DOOR, FLOOR_Y, ROOMS, STEPS, TERRACE } from './layout';

const CELL = 0.2;
/** batas kisi: lahan + trotoar depan (tempat pelanggan muncul) */
const X0 = -25,
  X1 = 8.6,
  Z0 = -16.6,
  Z1 = 7.6;
/** tinggi badan yang dianggap bertabrakan (relatif lantai dalam) */
const HEAD = FLOOR_Y + 1.3;
const KNEE = FLOOR_Y + 0.25;

interface Rect {
  x0: number;
  x1: number;
  z0: number;
  z1: number;
}

export class NavGrid {
  readonly nx = Math.ceil((X1 - X0) / CELL);
  readonly nz = Math.ceil((Z1 - Z0) / CELL);
  /** 1 = terhalang */
  private blocked: Uint8Array;

  constructor(obstacles: Rect[], clear: Rect[] = []) {
    const raw = new Uint8Array(this.nx * this.nz);
    for (const r of obstacles) this.fill(raw, r, 1);
    // perlebar rintangan setengah lebar badan (satu sel) agar orang tidak menyerempet
    const b = new Uint8Array(raw);
    for (let j = 0; j < this.nz; j++)
      for (let i = 0; i < this.nx; i++) {
        if (!raw[j * this.nx + i]) continue;
        for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) this.set(b, i + di, j + dj, 1);
      }
    for (const r of clear) this.fill(b, r, 0);
    this.blocked = b;
  }

  private set(a: Uint8Array, i: number, j: number, v: number) {
    if (i >= 0 && j >= 0 && i < this.nx && j < this.nz) a[j * this.nx + i] = v;
  }
  private fill(a: Uint8Array, r: Rect, v: number) {
    const i0 = Math.max(0, Math.floor((r.x0 - X0) / CELL)),
      i1 = Math.min(this.nx - 1, Math.floor((r.x1 - X0) / CELL)),
      j0 = Math.max(0, Math.floor((r.z0 - Z0) / CELL)),
      j1 = Math.min(this.nz - 1, Math.floor((r.z1 - Z0) / CELL));
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) a[j * this.nx + i] = v;
  }
  private free(i: number, j: number) {
    return i >= 0 && j >= 0 && i < this.nx && j < this.nz && !this.blocked[j * this.nx + i];
  }
  private cell(p: T.Vector3): [number, number] {
    return [Math.floor((p.x - X0) / CELL), Math.floor((p.z - Z0) / CELL)];
  }
  private center(i: number, j: number) {
    return new T.Vector3(X0 + (i + 0.5) * CELL, 0, Z0 + (j + 0.5) * CELL);
  }
  /** sel bebas terdekat (kursi/stasiun ada di dalam rintangan: orang berhenti tepat di sebelahnya) */
  private nearestFree(i: number, j: number, maxR = 7): [number, number] | null {
    if (this.free(i, j)) return [i, j];
    for (let r = 1; r <= maxR; r++) {
      let best: [number, number] | null = null,
        bd = Infinity;
      for (let dj = -r; dj <= r; dj++)
        for (let di = -r; di <= r; di++) {
          if (Math.max(Math.abs(di), Math.abs(dj)) !== r) continue;
          if (!this.free(i + di, j + dj)) continue;
          const d = di * di + dj * dj;
          if (d < bd) {
            bd = d;
            best = [i + di, j + dj];
          }
        }
      if (best) return best;
    }
    return null;
  }
  /** garis pandang antar dua sel (semua sel yang dilewati bebas) */
  private los(a: [number, number], b: [number, number]) {
    const n = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])) * 2;
    for (let k = 1; k < n; k++) {
      const t = k / n;
      const x = a[0] + (b[0] - a[0]) * t,
        z = a[1] + (b[1] - a[1]) * t;
      if (!this.free(Math.round(x), Math.round(z))) return false;
      // sudut: jangan memotong diagonal di antara dua sel terhalang
      if (!this.free(Math.floor(x), Math.round(z)) || !this.free(Math.ceil(x), Math.round(z))) return false;
    }
    return true;
  }

  /** Daftar titik yang dilalui (tanpa titik awal, diakhiri `to` persis). null bila tak ada jalur.
   *  `snap`: bila `to` terhalang (meja, dinding), berhenti di sel bebas terdekat, bukan menembus. */
  route(from: T.Vector3, to: T.Vector3, snap = false): T.Vector3[] | null {
    const [si0, sj0] = this.cell(from),
      [ti0, tj0] = this.cell(to);
    const s = this.nearestFree(si0, sj0),
      t = this.nearestFree(ti0, tj0);
    if (!s || !t) return null;
    const cells = this.astar(s, t);
    if (!cells) return null;
    // string pulling: ambil titik sejauh mungkin yang masih terlihat
    const out: [number, number][] = [];
    let i = 0;
    while (i < cells.length - 1) {
      let j = cells.length - 1;
      while (j > i + 1 && !this.los(cells[i], cells[j])) j--;
      out.push(cells[j]);
      i = j;
    }
    const pts = out.map(([i, j]) => this.center(i, j));
    pts.push(snap && !this.free(ti0, tj0) ? this.center(t[0], t[1]) : to.clone().setY(0));
    return pts.filter((p, k) => k === pts.length - 1 || k === 0 || p.distanceTo(pts[k - 1]) > 0.15);
  }

  private astar(s: [number, number], t: [number, number]): [number, number][] | null {
    const N = this.nx * this.nz;
    const gS = new Float32Array(N).fill(Infinity);
    const came = new Int32Array(N).fill(-1);
    const closed = new Uint8Array(N);
    const id = (i: number, j: number) => j * this.nx + i;
    const h = (i: number, j: number) => {
      const dx = Math.abs(i - t[0]),
        dz = Math.abs(j - t[1]);
      return Math.max(dx, dz) + 0.4142 * Math.min(dx, dz);
    };
    // tumpukan biner sederhana (f, id)
    const heapF: number[] = [],
      heapI: number[] = [];
    const push = (f: number, k: number) => {
      heapF.push(f);
      heapI.push(k);
      let c = heapF.length - 1;
      while (c > 0) {
        const p = (c - 1) >> 1;
        if (heapF[p] <= heapF[c]) break;
        [heapF[p], heapF[c]] = [heapF[c], heapF[p]];
        [heapI[p], heapI[c]] = [heapI[c], heapI[p]];
        c = p;
      }
    };
    const pop = () => {
      const k = heapI[0];
      const lf = heapF.pop()!,
        li = heapI.pop()!;
      if (heapF.length) {
        heapF[0] = lf;
        heapI[0] = li;
        let c = 0;
        for (;;) {
          const l = c * 2 + 1,
            r = l + 1;
          let m = c;
          if (l < heapF.length && heapF[l] < heapF[m]) m = l;
          if (r < heapF.length && heapF[r] < heapF[m]) m = r;
          if (m === c) break;
          [heapF[m], heapF[c]] = [heapF[c], heapF[m]];
          [heapI[m], heapI[c]] = [heapI[c], heapI[m]];
          c = m;
        }
      }
      return k;
    };
    const start = id(s[0], s[1]),
      goal = id(t[0], t[1]);
    gS[start] = 0;
    push(h(s[0], s[1]), start);
    let steps = 0;
    while (heapF.length) {
      const k = pop();
      if (closed[k]) continue;
      if (k === goal) break;
      closed[k] = 1;
      if (++steps > 60000) return null;
      const i = k % this.nx,
        j = (k - i) / this.nx;
      for (let dj = -1; dj <= 1; dj++)
        for (let di = -1; di <= 1; di++) {
          if (!di && !dj) continue;
          const ni = i + di,
            nj = j + dj;
          if (!this.free(ni, nj)) continue;
          // diagonal hanya bila kedua sel ortogonal bebas (tidak memotong sudut meja)
          if (di && dj && (!this.free(i + di, j) || !this.free(i, j + dj))) continue;
          const nk = id(ni, nj);
          if (closed[nk]) continue;
          const ng = gS[k] + (di && dj ? 1.4142 : 1);
          if (ng < gS[nk]) {
            gS[nk] = ng;
            came[nk] = k;
            push(ng + h(ni, nj), nk);
          }
        }
    }
    if (came[goal] < 0 && goal !== start) return null;
    const path: [number, number][] = [];
    for (let k = goal; k >= 0; k = came[k]) {
      const i = k % this.nx;
      path.push([i, (k - i) / this.nx]);
      if (k === start) break;
    }
    return path.reverse();
  }
}

const _bb = new T.Box3();
const _pos = new T.Vector3(),
  _quat = new T.Quaternion(),
  _scl = new T.Vector3(),
  _m = new T.Matrix4(),
  _c = new T.Vector3();

/**
 * Susun kisi dari geometri yang sudah dibangun. Yang dihitung rintangan: mesh setinggi badan
 * (bawahnya di bawah kepala, atasnya di atas lutut) dan bukan hamparan luas (lantai, atap, kanopi daun
 * yang digabung). Dinding "tumbuh" (scale.y sementara kecil) dihitung setinggi penuh.
 */
export function navFromScene(groups: T.Object3D[]): NavGrid {
  const obs: Rect[] = [];
  for (const g of groups) {
    g.updateMatrixWorld(true);
    g.traverse((o) => {
      const m = o as T.Mesh;
      if (!m.isMesh || !m.geometry || (o as T.Sprite).isSprite) return;
      if (!o.visible) return;
      m.geometry.computeBoundingBox();
      const gb = m.geometry.boundingBox;
      if (!gb) return;
      o.matrixWorld.decompose(_pos, _quat, _scl);
      _scl.y = Math.max(_scl.y, 1); // dinding yang masih "tumbuh"
      _m.compose(_pos, _quat, _scl);
      _bb.makeEmpty();
      for (let k = 0; k < 8; k++) {
        _c.set(k & 1 ? gb.max.x : gb.min.x, k & 2 ? gb.max.y : gb.min.y, k & 4 ? gb.max.z : gb.min.z).applyMatrix4(_m);
        _bb.expandByPoint(_c);
      }
      if (_bb.min.y > HEAD || _bb.max.y < KNEE) return;
      const w = _bb.max.x - _bb.min.x,
        d = _bb.max.z - _bb.min.z;
      if (w * d > 30 && Math.min(w, d) > 1) return; // hamparan luas: lantai, atap, kanopi daun
      obs.push({ x0: _bb.min.x, x1: _bb.max.x, z0: _bb.min.z, z1: _bb.max.z });
    });
  }
  // tepi teras/plint selain tangga: orang tidak memanjat
  obs.push({ x0: TERRACE.x0 - 0.3, x1: STEPS.x0, z0: TERRACE.z1 - 0.05, z1: TERRACE.z1 + 0.05 });
  obs.push({ x0: STEPS.x1, x1: TERRACE.x1 + 0.3, z0: TERRACE.z1 - 0.05, z1: TERRACE.z1 + 0.05 });
  for (const x of [TERRACE.x0, TERRACE.x1]) obs.push({ x0: x - 0.05, x1: x + 0.05, z0: TERRACE.z0, z1: TERRACE.z1 });
  // celah yang harus selalu terbuka: pintu & tangga, celah sekat area makan, tepi trotoar
  const clear: Rect[] = [
    { x0: DOOR.x - 0.7, x1: DOOR.x + 0.7, z0: BLD.z1 - 1.2, z1: STEPS.z1 + 0.3 },
    { x0: ROOMS.dining.x1 - 0.6, x1: ROOMS.dining.x1 + 0.6, z0: AISLE_Z - 1.1, z1: AISLE_Z + 1.1 },
  ];
  return new NavGrid(obs, clear);
}
