// Mesin program bertingkat Coding Agam (Ulangi, Kalau…, Jurus). Program = daftar pernyataan: perintah (maju /
// belok), panggil jurus, "ulangi N kali", "ulangi sampai bintang", dan "kalau … / kalau tidak …". Program
// dijalankan di papan yang sama dengan Langkah dan menghasilkan langkah-langkah untuk dianimasikan; setiap langkah
// membawa id pernyataan yang sedang jalan (supaya bloknya menyala) dan putaran tiap blok ulangi.

import { DX, DY, parse, type Cmd, type Dir, type Level } from './engine';

/** sensor Agam untuk blok "kalau" */
export type Cond = 'depan' | 'kanan' | 'kiri';
export const COND_TEXT: Record<Cond, string> = { depan: 'ada rintangan di depan', kanan: 'jalan terbuka di kanan', kiri: 'jalan terbuka di kiri' };
export const CONDS: Cond[] = ['depan', 'kanan', 'kiri'];

export type Stmt =
  | { id: string; t: 'cmd'; c: Cmd }
  | { id: string; t: 'call' }
  | { id: string; t: 'loop'; n: number; body: Stmt[] }
  | { id: string; t: 'until'; body: Stmt[] }
  | { id: string; t: 'if'; cond: Cond; then: Stmt[]; else: Stmt[] };

export interface Program {
  main: Stmt[];
  /** isi jurus (kosong bila game tidak memakai jurus) */
  jurus: Stmt[];
}

/** blok di palet */
export type PBlock = Cmd | 'ulangi' | 'sampai' | 'kalau' | 'jurus';

export interface ProgLevel extends Level {
  palette: PBlock[];
  /** jumlah blok solusi terhemat (3 bintang) */
  best: number;
  /** jatah blok */
  limit: number;
  /** petunjuk bertahap: arah pikir, lalu jawabannya */
  tip: string;
  solution: Program;
}

/* ---------------- hitung & jelaskan ---------------- */

const kids = (s: Stmt): Stmt[] => (s.t === 'loop' || s.t === 'until' ? s.body : s.t === 'if' ? [...s.then, ...s.else] : []);
export const countList = (l: Stmt[]): number => l.reduce((a, s) => a + 1 + countList(kids(s)), 0);
/** jumlah blok: setiap blok = 1 (termasuk isi blok ulangi/kalau dan isi jurus) */
export const countBlocks = (p: Program) => countList(p.main) + countList(p.jurus);

const WORD: Record<Cmd, string> = { maju: 'maju', kiri: 'belok kiri', kanan: 'belok kanan' };
export function describeList(l: Stmt[]): string {
  const parts: string[] = [];
  for (const s of l) {
    if (s.t === 'cmd') {
      const last = parts[parts.length - 1] ?? '';
      const m = /^(maju|belok kiri|belok kanan)(?: (\d+)×)?$/.exec(last);
      if (m && m[1] === WORD[s.c]) parts[parts.length - 1] = `${m[1]} ${Number(m[2] ?? 1) + 1}×`;
      else parts.push(WORD[s.c]);
    } else if (s.t === 'call') parts.push('jurus');
    else if (s.t === 'loop') parts.push(`ulangi ${s.n} kali [${describeList(s.body)}]`);
    else if (s.t === 'until') parts.push(`ulangi sampai bintang [${describeList(s.body)}]`);
    else parts.push(`kalau ${COND_TEXT[s.cond]} [${describeList(s.then) || '—'}]${s.else.length ? ` kalau tidak [${describeList(s.else)}]` : ''}`);
  }
  return parts.join(', ');
}
export const describe = (p: Program) => (p.jurus.length ? `Jurus = [${describeList(p.jurus)}]. Program: ${describeList(p.main)}` : describeList(p.main));

/* ---------------- menjalankan ---------------- */

export interface PStep {
  id: string;
  kind: 'move' | 'turn' | 'bump' | 'check' | 'call';
  x: number;
  y: number;
  dir: Dir;
  /** hasil sensor (untuk kind 'check') */
  ok?: boolean;
  /** putaran blok ulangi yang sedang berjalan: id → putaran ke- */
  iters: Record<string, number>;
}
export interface PRun {
  steps: PStep[];
  /** win = sampai bintang · bump = menabrak · short = program habis · stuck = berputar terus / ulangi kosong */
  result: 'win' | 'bump' | 'short' | 'stuck';
}

const blockedCell = (c: string) => c === '#' || c === '~' || c === 'X';
const MAX_STEPS = 400;

export function runProg(l: Level, prog: Program, opts: { goal?: { x: number; y: number } } = {}): PRun {
  const p = parse(l);
  if (opts.goal) p.goal = opts.goal;
  let x = p.start.x,
    y = p.start.y,
    d: Dir = l.dir;
  const steps: PStep[] = [];
  const iters: Record<string, number> = {};
  type R = 'go' | 'win' | 'bump' | 'stuck';
  const at = () => x === p.goal.x && y === p.goal.y;
  const push = (id: string, kind: PStep['kind'], ok?: boolean) => steps.push({ id, kind, x, y, dir: d, ok, iters: { ...iters } });
  const sense = (c: Cond) => {
    const dd = c === 'depan' ? d : c === 'kanan' ? (d + 1) % 4 : (d + 3) % 4;
    const b = blockedCell(p.cell(x + DX[dd], y + DY[dd]));
    return c === 'depan' ? b : !b;
  };
  const exec = (list: Stmt[], depth: number): R => {
    if (depth > 8) return 'stuck';
    for (const s of list) {
      if (steps.length > MAX_STEPS) return 'stuck';
      if (s.t === 'cmd') {
        if (s.c === 'maju') {
          const nx = x + DX[d],
            ny = y + DY[d];
          if (blockedCell(p.cell(nx, ny))) {
            push(s.id, 'bump');
            return 'bump';
          }
          x = nx;
          y = ny;
          push(s.id, 'move');
          if (at()) return 'win';
        } else {
          d = ((d + (s.c === 'kanan' ? 1 : 3)) % 4) as Dir;
          push(s.id, 'turn');
        }
      } else if (s.t === 'call') {
        push(s.id, 'call');
        const r = exec(prog.jurus, depth + 1);
        if (r !== 'go') return r;
      } else if (s.t === 'loop') {
        for (let k = 1; k <= s.n; k++) {
          iters[s.id] = k;
          const r = exec(s.body, depth + 1);
          if (r !== 'go') return r;
        }
        delete iters[s.id];
      } else if (s.t === 'until') {
        if (!s.body.length) return 'stuck';
        for (let k = 1; !at(); k++) {
          iters[s.id] = k;
          const before = steps.length;
          const r = exec(s.body, depth + 1);
          if (r !== 'go') return r;
          if (steps.length === before || steps.length > MAX_STEPS) return 'stuck';
        }
        delete iters[s.id];
      } else {
        const ok = sense(s.cond);
        push(s.id, 'check', ok);
        const r = exec(ok ? s.then : s.else, depth + 1);
        if (r !== 'go') return r;
      }
    }
    return 'go';
  };
  const r = exec(prog.main, 0);
  return { steps, result: r === 'go' ? (at() ? 'win' : 'short') : r };
}

/** bintang: sehemat solusi = 3, lebih ≤2 blok = 2, selebihnya 1; memakai jawaban dari bantuan → paling banyak 2 */
export function progStars(l: ProgLevel, used: number, revealed: boolean) {
  const s = used <= l.best ? 3 : used <= l.best + 2 ? 2 : 1;
  return revealed ? Math.min(2, s) : s;
}

/* ---------------- pembuat pernyataan (untuk resep level & tes) ---------------- */

let uid = 0;
export const newId = () => `s${++uid}${Math.random().toString(36).slice(2, 6)}`;
export const S = {
  m: (): Stmt => ({ id: newId(), t: 'cmd', c: 'maju' }),
  c: (c: Cmd): Stmt => ({ id: newId(), t: 'cmd', c }),
  call: (): Stmt => ({ id: newId(), t: 'call' }),
  loop: (n: number, body: Stmt[]): Stmt => ({ id: newId(), t: 'loop', n, body }),
  until: (body: Stmt[]): Stmt => ({ id: newId(), t: 'until', body }),
  if: (cond: Cond, then: Stmt[], els: Stmt[] = []): Stmt => ({ id: newId(), t: 'if', cond, then, else: els }),
};

/** id tetap & rapi (untuk data level yang disimpan) */
export function renumber(p: Program): Program {
  let k = 0;
  const walk = (l: Stmt[]): Stmt[] =>
    l.map((s) => {
      const id = `b${++k}`;
      if (s.t === 'loop' || s.t === 'until') return { ...s, id, body: walk(s.body) };
      if (s.t === 'if') return { ...s, id, then: walk(s.then), else: walk(s.else) };
      return { ...s, id };
    });
  return { main: walk(p.main), jurus: walk(p.jurus) };
}
