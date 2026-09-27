// Mesin Coding Agam (murni, bisa dites): peta kotak-kotak, Agam menghadap satu arah, program = daftar perintah.
// Menjalankan program menghasilkan langkah-langkah untuk dianimasikan. Solusi terpendek dicari otomatis (BFS)
// untuk menentukan bintang: blok sehemat solusi terpendek = 3 bintang.

export type Dir = 0 | 1 | 2 | 3; // 0 atas, 1 kanan, 2 bawah, 3 kiri
export type Cmd = 'maju' | 'kiri' | 'kanan';
export type Theme = 'kebun' | 'pantai' | 'salju' | 'gurun' | 'angkasa';

export interface Level {
  id: string;
  /** baris peta: . kosong · # batu · ~ air · S mulai · G tujuan */
  map: string[];
  dir: Dir;
  blocks: Cmd[];
  theme: Theme;
  hint: string;
}

export interface Parsed {
  w: number;
  h: number;
  start: { x: number; y: number };
  goal: { x: number; y: number };
  cell: (x: number, y: number) => string;
}

export function parse(l: Level): Parsed {
  const h = l.map.length,
    w = Math.max(...l.map.map((r) => r.length));
  let start = { x: 0, y: 0 },
    goal = { x: 0, y: 0 };
  l.map.forEach((row, y) =>
    [...row].forEach((c, x) => {
      if (c === 'S') start = { x, y };
      if (c === 'G') goal = { x, y };
    }),
  );
  const cell = (x: number, y: number) => (x < 0 || y < 0 || x >= w || y >= h ? 'X' : l.map[y][x] ?? '.');
  return { w, h, start, goal, cell };
}

export const DX = [0, 1, 0, -1],
  DY = [-1, 0, 1, 0];
const blocked = (c: string) => c === '#' || c === '~' || c === 'X';

export interface Step {
  i: number; // indeks perintah yang dijalankan
  x: number;
  y: number;
  dir: Dir;
  kind: 'move' | 'turn' | 'bump';
}

export interface RunResult {
  steps: Step[];
  result: 'win' | 'bump' | 'short';
}

/** Jalankan program. Berhenti saat menabrak atau saat sampai tujuan. */
export function run(l: Level, prog: Cmd[]): RunResult {
  const p = parse(l);
  let { x, y } = p.start,
    dir = l.dir;
  const steps: Step[] = [];
  for (let i = 0; i < prog.length; i++) {
    const c = prog[i];
    if (c === 'kiri' || c === 'kanan') {
      dir = ((dir + (c === 'kanan' ? 1 : 3)) % 4) as Dir;
      steps.push({ i, x, y, dir, kind: 'turn' });
      continue;
    }
    const nx = x + DX[dir],
      ny = y + DY[dir];
    if (blocked(p.cell(nx, ny))) {
      steps.push({ i, x, y, dir, kind: 'bump' });
      return { steps, result: 'bump' };
    }
    x = nx;
    y = ny;
    steps.push({ i, x, y, dir, kind: 'move' });
    if (x === p.goal.x && y === p.goal.y) return { steps, result: 'win' };
  }
  return { steps, result: 'short' };
}

type State = { x: number; y: number; d: Dir };

/** Program terpendek dari suatu keadaan (BFS atas posisi+arah). null bila tidak bisa diselesaikan. */
function solveFrom(l: Level, from: State): Cmd[] | null {
  const p = parse(l);
  if (from.x === p.goal.x && from.y === p.goal.y) return [];
  const key = (x: number, y: number, d: number) => `${x},${y},${d}`;
  const q: (State & { prog: Cmd[] })[] = [{ ...from, prog: [] }];
  const seen = new Set([key(from.x, from.y, from.d)]);
  for (let h = 0; h < q.length; h++) {
    const s = q[h];
    for (const c of l.blocks) {
      let { x, y } = s,
        d = s.d;
      if (c === 'maju') {
        x += DX[d];
        y += DY[d];
        if (blocked(p.cell(x, y))) continue;
      } else d = ((d + (c === 'kanan' ? 1 : 3)) % 4) as Dir;
      const prog = [...s.prog, c];
      if (c === 'maju' && x === p.goal.x && y === p.goal.y) return prog;
      const k = key(x, y, d);
      if (seen.has(k)) continue;
      seen.add(k);
      q.push({ x, y, d, prog });
    }
  }
  return null;
}

/** Program terpendek dari posisi awal. */
export function solve(l: Level): Cmd[] | null {
  const p = parse(l);
  return solveFrom(l, { ...p.start, d: l.dir });
}

/**
 * Bantuan untuk anak yang macet: bila program sejauh ini sudah salah (menabrak / menjauh sehingga tak bisa
 * sampai), tunjuk blok yang salah; bila masih benar, beri tahu blok berikutnya (dari jalan terpendek).
 */
export function nextHint(l: Level, prog: Cmd[]): { kind: 'next'; cmd: Cmd } | { kind: 'wrong'; i: number } | { kind: 'done' } {
  const r = run(l, prog);
  if (r.result === 'win') return { kind: 'done' };
  if (r.result === 'bump') return { kind: 'wrong', i: r.steps[r.steps.length - 1].i };
  const p = parse(l);
  const last = r.steps[r.steps.length - 1];
  const st: State = last ? { x: last.x, y: last.y, d: last.dir } : { ...p.start, d: l.dir };
  const rest = solveFrom(l, st);
  if (!rest || !rest.length) return { kind: 'wrong', i: Math.max(0, prog.length - 1) };
  return { kind: 'next', cmd: rest[0] };
}

/** Bintang: sehemat solusi terpendek = 3, lebih 1–2 blok = 2, selebihnya 1. */
export function starsFor(l: Level, used: number) {
  const best = solve(l)?.length ?? used;
  return used <= best ? 3 : used <= best + 2 ? 2 : 1;
}
