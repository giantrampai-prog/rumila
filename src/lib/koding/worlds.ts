// Tiga dunia untuk mesin program (prog.ts):
// - Ulangi · Agam Pelukis: Agam menggambar garis di kanvas (seperti kura-kura LOGO). Menang bila semua garis pola
//   tergambar; menggores di luar pola = salah (berhenti di situ).
// - Kalau… · Agam Pelari: lintasan tampak samping dengan rintangan ACAK tiap main (rendah → lompat, terbang →
//   merunduk, lubang → lompat). Menang bila sampai finis.

import type { ProgLevelBase, World } from './prog';

/* ================= Ulangi · kanvas ================= */

export interface UlangiLevel extends ProgLevelBase {
  /** jumlah titik grid ke kanan & ke bawah */
  cols: number;
  rows: number;
  start: { x: number; y: number };
  /** 0 atas, 1 kanan, 2 bawah, 3 kiri */
  dir: number;
  /** garis pola: "x1,y1:x2,y2" dengan titik kecil dulu */
  target: string[];
}

const DX = [0, 1, 0, -1],
  DY = [-1, 0, 1, 0];
export const segKey = (x1: number, y1: number, x2: number, y2: number) => (x1 < x2 || (x1 === x2 && y1 < y2) ? `${x1},${y1}:${x2},${y2}` : `${x2},${y2}:${x1},${y1}`);

export interface PaintData {
  x: number;
  y: number;
  dir: number;
  /** garis yang baru digambar */
  from?: { x: number; y: number };
}

export function paintWorld(l: UlangiLevel): World<PaintData> & { drawn: Set<string> } {
  let x = l.start.x,
    y = l.start.y,
    dir = l.dir;
  const want = new Set(l.target);
  const drawn = new Set<string>();
  return {
    drawn,
    act(a) {
      if (a === 'kiri' || a === 'kanan') {
        dir = (dir + (a === 'kanan' ? 1 : 3)) % 4;
        return { data: { x, y, dir }, out: 'go', kind: 'turn' };
      }
      const nx = x + DX[dir],
        ny = y + DY[dir];
      const k = segKey(x, y, nx, ny);
      const from = { x, y };
      if (nx < 0 || ny < 0 || nx >= l.cols || ny >= l.rows || !want.has(k)) {
        // kuas melenceng dari pola → berhenti di tengah garis yang salah
        return { data: { x, y, dir, from }, out: 'bump', kind: 'bump' };
      }
      x = nx;
      y = ny;
      drawn.add(k);
      return { data: { x, y, dir, from }, out: drawn.size === want.size ? 'win' : 'go', kind: 'paint' };
    },
    sense: () => false,
    done: () => drawn.size === want.size,
    end: () => (drawn.size === want.size ? 'win' : 'short'),
  };
}

/** telusuri daftar aksi → garis-garis (untuk membuat soal); null bila keluar batas */
export function traceSegments(acts: string[], dir0: number): { segs: string[]; pts: { x: number; y: number }[] } {
  let x = 0,
    y = 0,
    d = dir0;
  const segs = new Set<string>();
  const pts = [{ x, y }];
  for (const a of acts) {
    if (a === 'kiri' || a === 'kanan') {
      d = (d + (a === 'kanan' ? 1 : 3)) % 4;
      continue;
    }
    const nx = x + DX[d],
      ny = y + DY[d];
    segs.add(segKey(x, y, nx, ny));
    x = nx;
    y = ny;
    pts.push({ x, y });
  }
  return { segs: [...segs], pts };
}

/* ================= Kalau… · lari ================= */

export type Obst = 'low' | 'fly' | 'gap';
export interface KalauLevel extends ProgLevelBase {
  /** panjang lintasan (petak); finis di petak len */
  len: number;
  /** jenis rintangan yang bisa muncul */
  kinds: Obst[];
  /** jumlah rintangan (min, maks) */
  count: [number, number];
}

/** susunan rintangan acak (tetap untuk seed yang sama); jarak antar rintangan ≥ 3 petak, petak 0–2 & terakhir kosong */
export function layoutFor(l: KalauLevel, seed: number): (Obst | null)[] {
  let s = (seed >>> 0) || 1;
  const rnd = () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
  const cells: (Obst | null)[] = Array(l.len + 1).fill(null);
  if (!l.kinds.length) return cells;
  const want = l.count[0] + Math.floor(rnd() * (l.count[1] - l.count[0] + 1));
  const free: number[] = [];
  for (let i = 3; i <= l.len - 2; i++) free.push(i);
  let placed = 0;
  for (let tries = 0; tries < 200 && placed < want; tries++) {
    const i = free[Math.floor(rnd() * free.length)];
    if (cells.slice(Math.max(0, i - 2), i + 3).some(Boolean)) continue;
    cells[i] = l.kinds[Math.floor(rnd() * l.kinds.length)];
    placed++;
  }
  // pastikan setiap jenis muncul minimal sekali bila tempatnya cukup
  for (const k of l.kinds)
    if (!cells.includes(k)) {
      const i = cells.findIndex((c, j) => c && j >= 3 && cells.filter((x) => x === c).length > 1);
      if (i > 0) cells[i] = k;
    }
  return cells;
}

export interface RunData {
  /** posisi setelah aksi (petak) */
  x: number;
  /** jenis gerak untuk animasi */
  move: 'run' | 'jump' | 'duck' | 'crash';
  /** rintangan yang ditabrak */
  hit?: Obst;
}

export function runWorld2(l: KalauLevel, cells: (Obst | null)[]): World<RunData> {
  let x = 0;
  const at = (i: number) => (i >= 0 && i < cells.length ? cells[i] : null);
  return {
    act(a) {
      const n1 = at(x + 1);
      if (a === 'lari') {
        if (n1) return { data: { x, move: 'crash', hit: n1 }, out: 'bump', kind: 'crash' };
        x++;
        return { data: { x, move: 'run' }, out: x >= l.len ? 'win' : 'go', kind: 'run' };
      }
      if (a === 'merunduk') {
        if (n1 === 'low' || n1 === 'gap') return { data: { x, move: 'crash', hit: n1 }, out: 'bump', kind: 'crash' };
        x++;
        return { data: { x, move: 'duck' }, out: x >= l.len ? 'win' : 'go', kind: 'duck' };
      }
      // lompat: melewati satu petak, mendarat 2 petak di depan
      if (n1 === 'fly') return { data: { x, move: 'crash', hit: 'fly' }, out: 'bump', kind: 'crash' };
      const n2 = at(x + 2);
      if (n2 && x + 2 <= l.len) return { data: { x: x + 1, move: 'crash', hit: n2 }, out: 'bump', kind: 'crash' };
      x = Math.min(l.len, x + 2);
      return { data: { x, move: 'jump' }, out: x >= l.len ? 'win' : 'go', kind: 'jump' };
    },
    sense: (c) => at(x + 1) === c,
    done: () => x >= l.len,
    end: () => (x >= l.len ? 'win' : 'short'),
  };
}

/* ================= Jurus · gerakan dojo ================= */

export const MOVES = ['pukul', 'tendang', 'tangkis', 'lompat', 'putar'] as const;
export type MoveName = (typeof MOVES)[number];
