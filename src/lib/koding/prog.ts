// Mesin program bertingkat Coding Agam (Ulangi, Kalau…, Jurus). Program = daftar pernyataan: aksi (maju, lompat,
// pukul, …), panggil jurus, "ulangi N kali", "ulangi sampai selesai", dan "kalau … / kalau tidak …".
// Mesin ini tidak tahu dunianya: setiap game memberi "dunia" (World) yang menjalankan aksi, menjawab sensor, dan
// mencatat langkah untuk dianimasikan. Setiap langkah membawa id pernyataan yang sedang jalan (supaya bloknya menyala)
// dan putaran tiap blok ulangi.

export type Stmt =
  | { id: string; t: 'act'; a: string }
  | { id: string; t: 'call' }
  | { id: string; t: 'loop'; n: number; body: Stmt[] }
  | { id: string; t: 'until'; body: Stmt[] }
  | { id: string; t: 'if'; cond: string; then: Stmt[]; else: Stmt[] };

export interface Program {
  main: Stmt[];
  /** isi jurus (kosong bila game tidak memakai jurus) */
  jurus: Stmt[];
}

/** blok palet: aksi dunia atau blok struktur */
export type PBlock = string;
export const STRUCT = ['ulangi', 'sampai', 'kalau', 'jurus'] as const;

/** langkah yang dicatat (kind & data ditentukan dunia; 'check' / 'call' dari mesin) */
export interface Step<D = unknown> {
  id: string;
  kind: string;
  ok?: boolean;
  data?: D;
  iters: Record<string, number>;
}

export type Outcome = 'go' | 'win' | 'bump';
export interface World<D = unknown> {
  /** jalankan aksi; kembalikan data animasi + hasil */
  act(a: string): { data: D; out: Outcome; kind?: string };
  sense(cond: string): boolean;
  /** sudah selesai/sampai? (untuk "ulangi sampai selesai") */
  done(): boolean;
  /** hasil akhir bila program habis tanpa menang/menabrak */
  end(): 'win' | 'short';
}

export interface PRun<D = unknown> {
  steps: Step<D>[];
  /** win = berhasil · bump = salah/menabrak · short = program habis tapi belum selesai · stuck = berputar terus */
  result: 'win' | 'bump' | 'short' | 'stuck';
}

const MAX_STEPS = 500;

export function runWorld<D>(prog: Program, w: World<D>): PRun<D> {
  const steps: Step<D>[] = [];
  const iters: Record<string, number> = {};
  type R = 'go' | 'win' | 'bump' | 'stuck';
  const exec = (list: Stmt[], depth: number): R => {
    if (depth > 8) return 'stuck';
    for (const s of list) {
      if (steps.length > MAX_STEPS) return 'stuck';
      if (s.t === 'act') {
        const r = w.act(s.a);
        steps.push({ id: s.id, kind: r.kind ?? 'act', data: r.data, iters: { ...iters } });
        if (r.out !== 'go') return r.out;
      } else if (s.t === 'call') {
        steps.push({ id: s.id, kind: 'call', iters: { ...iters } });
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
        for (let k = 1; !w.done(); k++) {
          iters[s.id] = k;
          const before = steps.filter((x) => x.kind !== 'check' && x.kind !== 'call').length;
          const r = exec(s.body, depth + 1);
          if (r !== 'go') return r;
          if (steps.filter((x) => x.kind !== 'check' && x.kind !== 'call').length === before || steps.length > MAX_STEPS) return 'stuck';
        }
        delete iters[s.id];
      } else {
        const ok = w.sense(s.cond);
        steps.push({ id: s.id, kind: 'check', ok, iters: { ...iters } });
        const r = exec(ok ? s.then : s.else, depth + 1);
        if (r !== 'go') return r;
      }
    }
    return 'go';
  };
  const r = exec(prog.main, 0);
  return { steps, result: r === 'go' ? w.end() : r };
}

/* ---------------- hitung & jelaskan ---------------- */

const kids = (s: Stmt): Stmt[] => (s.t === 'loop' || s.t === 'until' ? s.body : s.t === 'if' ? [...s.then, ...s.else] : []);
export const countList = (l: Stmt[]): number => l.reduce((a, s) => a + 1 + countList(kids(s)), 0);
/** jumlah blok: setiap blok = 1 (termasuk isi blok ulangi/kalau dan isi jurus) */
export const countBlocks = (p: Program) => countList(p.main) + countList(p.jurus);

/** daftar aksi hasil buka (tanpa kalau/sampai) — untuk resep level */
export function flatActs(p: Program): string[] {
  const out: string[] = [];
  const walk = (l: Stmt[]) => {
    for (const s of l) {
      if (s.t === 'act') out.push(s.a);
      else if (s.t === 'call') walk(p.jurus);
      else if (s.t === 'loop') for (let k = 0; k < s.n; k++) walk(s.body);
    }
  };
  walk(p.main);
  return out;
}

export function describeList(l: Stmt[], word: (a: string) => string, cond: (c: string) => string, untilWord = 'selesai'): string {
  const parts: string[] = [];
  for (const s of l) {
    if (s.t === 'act') {
      const w = word(s.a);
      const last = parts[parts.length - 1] ?? '';
      const m = new RegExp(`^${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?: (\\d+)×)?$`).exec(last);
      if (m) parts[parts.length - 1] = `${w} ${Number(m[1] ?? 1) + 1}×`;
      else parts.push(w);
    } else if (s.t === 'call') parts.push('jurus');
    else if (s.t === 'loop') parts.push(`ulangi ${s.n} kali [${describeList(s.body, word, cond, untilWord)}]`);
    else if (s.t === 'until') parts.push(`ulangi sampai ${untilWord} [${describeList(s.body, word, cond, untilWord)}]`);
    else
      parts.push(
        `kalau ${cond(s.cond)} [${describeList(s.then, word, cond, untilWord) || '—'}]${s.else.length ? ` kalau tidak [${describeList(s.else, word, cond, untilWord)}]` : ''}`,
      );
  }
  return parts.join(', ');
}

/* ---------------- pembuat pernyataan (resep level & tes) ---------------- */

let uid = 0;
export const newId = () => `s${++uid}${Math.random().toString(36).slice(2, 6)}`;
export const S = {
  a: (a: string): Stmt => ({ id: newId(), t: 'act', a }),
  call: (): Stmt => ({ id: newId(), t: 'call' }),
  loop: (n: number, body: Stmt[]): Stmt => ({ id: newId(), t: 'loop', n, body }),
  until: (body: Stmt[]): Stmt => ({ id: newId(), t: 'until', body }),
  if: (cond: string, then: Stmt[], els: Stmt[] = []): Stmt => ({ id: newId(), t: 'if', cond, then, else: els }),
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

/** bintang: sehemat solusi = 3, lebih ≤2 blok = 2, selebihnya 1; memakai jawaban dari bantuan → paling banyak 2 */
export function progStars(best: number, used: number, revealed: boolean) {
  const s = used <= best ? 3 : used <= best + 2 ? 2 : 1;
  return revealed ? Math.min(2, s) : s;
}

/** data umum semua soal program */
export interface ProgLevelBase {
  id: string;
  /** Level ke- (0..9) — tema diambil dari skin game */
  world: number;
  palette: PBlock[];
  best: number;
  limit: number;
  hint: string;
  solution: Program;
}
