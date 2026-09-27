// Logika Ular Tangga (murni, tanpa tampilan) — bisa dites.
// • Dadu adil & tak bisa ditebak: crypto.getRandomValues + rejection sampling (tanpa bias modulo).
// • Papan diacak setiap permainan (letak ular & tangga berbeda) dengan aturan keadilan:
//   tidak ada ujung di petak 1 / 100, tidak ada dua ujung di petak yang sama, tidak ada rantai
//   (ujung ular/tangga jatuh di awal ular/tangga lain), total naik & turun seimbang.
// • Urutan giliran diacak di awal.
// • Aturan pantul: harus pas di 100; kelebihan langkah berjalan mundur (99 + 5 → 100, 99, 98, 97, 96).

export type Rand = () => number; // 0 ≤ x < 1

/** Angka acak kriptografis 0…1 (cadangan Math.random bila crypto tidak ada, mis. saat tes lama). */
export const secureRandom: Rand = () => {
  const c = globalThis.crypto;
  if (c?.getRandomValues) {
    const a = new Uint32Array(1);
    c.getRandomValues(a);
    return a[0] / 4294967296;
  }
  return Math.random();
};

/** Dadu 1…6 seragam tanpa bias (rejection sampling di atas bilangan acak 32-bit). */
export function rollDie(): number {
  const c = globalThis.crypto;
  if (c?.getRandomValues) {
    const a = new Uint32Array(1);
    const limit = Math.floor(4294967296 / 6) * 6; // buang sisa agar setiap sisi berpeluang sama
    for (;;) {
      c.getRandomValues(a);
      if (a[0] < limit) return (a[0] % 6) + 1;
    }
  }
  return 1 + Math.floor(Math.random() * 6);
}

export interface Jump {
  from: number;
  to: number;
  kind: 'ladder' | 'snake';
}

export interface Board {
  jumps: Jump[];
  /** peta cepat petak → tujuan */
  map: Record<number, number>;
}

const rowOf = (n: number) => Math.floor((n - 1) / 10);

type P2 = [number, number];
/** Jarak terdekat antara dua ruas garis (satuan petak); 0 bila bersilangan. */
function segSeg(a: P2, b: P2, c: P2, d: P2) {
  const cross = (o: P2, p: P2, q: P2) => (p[0] - o[0]) * (q[1] - o[1]) - (p[1] - o[1]) * (q[0] - o[0]);
  const d1 = cross(c, d, a),
    d2 = cross(c, d, b),
    d3 = cross(a, b, c),
    d4 = cross(a, b, d);
  if (d1 * d2 < 0 && d3 * d4 < 0) return 0;
  const ptSeg = (p: P2, s1: P2, s2: P2) => {
    const vx = s2[0] - s1[0],
      vy = s2[1] - s1[1];
    const t = Math.max(0, Math.min(1, ((p[0] - s1[0]) * vx + (p[1] - s1[1]) * vy) / (vx * vx + vy * vy || 1)));
    return Math.hypot(p[0] - (s1[0] + vx * t), p[1] - (s1[1] + vy * t));
  };
  return Math.min(ptSeg(a, c, d), ptSeg(b, c, d), ptSeg(c, a, b), ptSeg(d, a, b));
}

/** Susun papan acak yang adil. `r` bisa diganti (tes) — standar memakai acak kriptografis. */
export function makeBoard(r: Rand = secureRandom): Board {
  for (let attempt = 0; attempt < 400; attempt++) {
    const used = new Set<number>([1, 100]);
    const jumps: Jump[] = [];
    const pick = (lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1));
    const colOf = (n: number) => {
      const row = rowOf(n),
        k = (n - 1) % 10;
      return row % 2 === 0 ? k : 9 - k;
    };
    const pt = (n: number): [number, number] => [colOf(n), rowOf(n)];
    const segDist = (a1: number, a2: number, b1: number, b2: number) => segSeg(pt(a1), pt(a2), pt(b1), pt(b2));
    const parallel = (a: P2[], b: P2[]) => {
      const ax = a[1][0] - a[0][0],
        ay = a[1][1] - a[0][1],
        bx = b[1][0] - b[0][0],
        by = b[1][1] - b[0][1];
      return Math.abs(ax * bx + ay * by) / (Math.hypot(ax, ay) * Math.hypot(bx, by)) > 0.8;
    };
    const tryAdd = (kind: 'ladder' | 'snake', count: number) => {
      let tries = 0;
      while (jumps.filter((j) => j.kind === kind).length < count && tries++ < 300) {
        let from: number, to: number;
        if (kind === 'ladder') {
          from = pick(2, 85);
          to = from + pick(10, 30);
          if (to > 98) continue;
        } else {
          // ular pertama selalu di baris teratas supaya akhir permainan tetap menegangkan
          from = jumps.some((j) => j.kind === 'snake') ? pick(20, 99) : pick(91, 99);
          to = from - pick(10, 32);
          if (to < 2) continue;
        }
        if (rowOf(from) === rowOf(to)) continue; // harus pindah baris
        if (Math.abs(colOf(from) - colOf(to)) > 4) continue; // tidak terlalu miring (papan rapi)
        if (used.has(from) || used.has(to)) continue;
        // beri jarak antar ular/tangga: tidak bersentuhan, tidak menyambung lurus, tidak bersilangan
        const ends = [pt(from), pt(to)];
        if (
          jumps.some(
            (j) =>
              segDist(from, to, j.from, j.to) < 0.75 ||
              // ujung berdekatan & searah → tampak menyambung jadi satu ular/tangga panjang
              ([pt(j.from), pt(j.to)].some((q) => ends.some((e) => Math.hypot(e[0] - q[0], e[1] - q[1]) < 1.6)) && parallel(ends, [pt(j.from), pt(j.to)])),
          )
        )
          continue;
        used.add(from);
        used.add(to);
        jumps.push({ from, to, kind });
      }
    };
    const nL = 6 + Math.floor(r() * 2),
      nS = 6 + Math.floor(r() * 2);
    tryAdd('snake', nS);
    tryAdd('ladder', nL);
    if (jumps.length < nL + nS) continue;
    // keseimbangan: total naik vs turun tidak timpang
    const up = jumps.filter((j) => j.kind === 'ladder').reduce((a, j) => a + j.to - j.from, 0);
    const down = jumps.filter((j) => j.kind === 'snake').reduce((a, j) => a + j.from - j.to, 0);
    if (Math.abs(up - down) > 50) continue;
    // setidaknya satu ular di baris teratas supaya akhir tetap menegangkan
    if (!jumps.some((j) => j.kind === 'snake' && j.from > 90)) continue;
    const map: Record<number, number> = {};
    for (const j of jumps) map[j.from] = j.to;
    return { jumps, map };
  }
  // cadangan: papan klasik
  return classicBoard();
}

export function classicBoard(): Board {
  const pairs: [number, number][] = [
    [4, 14], [9, 31], [21, 42], [28, 84], [36, 44], [51, 67], [71, 91], [80, 99],
    [16, 6], [47, 26], [49, 11], [56, 53], [62, 19], [64, 60], [87, 24], [93, 73], [95, 75], [98, 78],
  ];
  const jumps = pairs.map(([from, to]) => ({ from, to, kind: to > from ? ('ladder' as const) : ('snake' as const) }));
  const map: Record<number, number> = {};
  for (const j of jumps) map[j.from] = j.to;
  return { jumps, map };
}

/**
 * Petak-petak yang dilewati selangkah demi selangkah untuk lemparan `roll` dari `pos`.
 * Harus pas di 100; kelebihannya berjalan mundur. Posisi 0 = belum masuk papan.
 */
export function stepPath(pos: number, roll: number): number[] {
  const out: number[] = [];
  let p = pos,
    dir = 1;
  for (let i = 0; i < roll; i++) {
    if (p === 100) dir = -1;
    p += dir;
    out.push(p);
  }
  return out;
}

export interface Player {
  id: string;
  name: string;
  color: string;
  avatar: string;
  cpu: boolean;
  pos: number;
}

export interface TurnResult {
  roll: number;
  steps: number[];
  landed: number;
  jump: Jump | null;
  final: number;
  won: boolean;
  bounced: boolean;
  again: boolean;
}

/** Hitung satu giliran (tidak mengubah apa pun). */
export function playTurn(board: Board, pos: number, roll: number, sixAgain = true): TurnResult {
  const steps = stepPath(pos, roll);
  const landed = steps[steps.length - 1];
  const to = board.map[landed];
  const jump = to ? board.jumps.find((j) => j.from === landed)! : null;
  const final = to ?? landed;
  const won = final === 100;
  return { roll, steps, landed, jump, final, won, bounced: steps.includes(100) && landed !== 100, again: sixAgain && roll === 6 && !won };
}

/** Acak urutan pemain (Fisher–Yates dengan acak kriptografis). */
export function shuffle<T>(a: T[], r: Rand = secureRandom): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

/** Koordinat petak (baris 0 = bawah; zig-zag: baris genap kiri→kanan). */
export function cellXY(n: number) {
  const row = rowOf(n);
  const k = (n - 1) % 10;
  const col = row % 2 === 0 ? k : 9 - k;
  return { col, row };
}
