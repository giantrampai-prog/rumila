// Coding Agam · Pola — 100 soal "lanjutkan pola" untuk usia 3–8 tahun: 10 Level bertema (sama dengan Langkah)
// × 10 coding, makin tinggi makin sulit (coding 10 tiap Level paling sulit).
// Jenis pola naik bertahap: warna → bentuk → bunyi alat musik → warna+bentuk → melodi lonceng tangan →
// dua pola sekaligus (warna berulang tiap 2, bentuk tiap 3). Soal dibuat otomatis dari resep per Level dengan
// acakan tetap (hasil selalu sama), lalu dicek: polanya tidak ambigu dan setiap kotak kosong bisa ditebak.

import type { Theme } from './engine';
import { THEME_ORDER } from './engine';

export type Color = 'merah' | 'oranye' | 'kuning' | 'hijau' | 'biru' | 'ungu';
export type Shape = 'lingkaran' | 'kotak' | 'segitiga' | 'bintang' | 'hati' | 'ketupat';
export type Instr = 'gendang' | 'lonceng' | 'marakas' | 'gong';
export type Note = 'do' | 're' | 'mi' | 'sol' | 'la';
/** benda berwarna yang dipakai pola warna di tiap tema */
export type Obj = 'bunga' | 'bola' | 'mobil' | 'ikan' | 'permen';

export type Token =
  | { k: 'warna'; c: Color; o: Obj }
  | { k: 'bentuk'; s: Shape; c: Color }
  | { k: 'alat'; i: Instr }
  | { k: 'nada'; n: Note };

export interface PolaLevel {
  id: string;
  theme: Theme;
  /** apa yang harus diperhatikan anak (untuk kalimat Agam) */
  focus: 'warna' | 'bentuk' | 'bunyi' | 'warna-bentuk' | 'melodi' | 'dua-pola';
  /** deretan lengkap (jawaban benar) */
  seq: Token[];
  /** indeks kotak kosong yang harus diisi */
  blanks: number[];
  /** pilihan di palet (jawaban + pengecoh), urutan tetap */
  options: Token[];
  /** panjang satu pengulangan (untuk bantuan); dua-pola: [warna, bentuk] */
  period: number[];
  hint: string;
}

export const COLORS: Color[] = ['merah', 'kuning', 'biru', 'hijau', 'ungu', 'oranye'];
export const SHAPES: Shape[] = ['lingkaran', 'kotak', 'segitiga', 'bintang', 'hati', 'ketupat'];
export const INSTRS: Instr[] = ['gendang', 'lonceng', 'marakas', 'gong'];
export const NOTES: Note[] = ['do', 're', 'mi', 'sol', 'la'];

export const keyOf = (t: Token) => (t.k === 'warna' ? `w:${t.o}:${t.c}` : t.k === 'bentuk' ? `b:${t.s}:${t.c}` : t.k === 'alat' ? `a:${t.i}` : `n:${t.n}`);
export const same = (a: Token | null | undefined, b: Token | null | undefined) => !!a && !!b && keyOf(a) === keyOf(b);

export function nameOf(t: Token): string {
  if (t.k === 'warna') return `${t.o} ${t.c}`;
  if (t.k === 'bentuk') return `${t.s} ${t.c}`;
  if (t.k === 'alat') return t.i;
  return `lonceng ${t.n}`;
}

/* ---------------- resep per Level ---------------- */

type Kind = 'warna' | 'bentuk' | 'alat' | 'nada' | 'kombo' | 'dua';
/**
 * Resep satu soal: "<jenis> <pola> <panjang> <kosong> <pengecoh>".
 * pola: huruf A–E (mis. AAB) · dua-pola: "2.3" = warna tiap 2, bentuk tiap 3.
 * kosong: e<n> = n kotak terakhir, m<n> = n kotak acak setelah pengulangan pertama (selalu termasuk yang terakhir).
 */
const RECIPES: { theme: Theme; obj: Obj; list: string[] }[] = [
  { theme: 'kebun', obj: 'bunga', list: ['warna AB 6 e1 0', 'warna AB 6 e1 0', 'warna AB 7 e1 0', 'warna AB 8 e2 0', 'warna AB 7 m1 0', 'warna AAB 7 e1 0', 'warna ABB 7 e1 0', 'warna AB 8 e2 1', 'warna AAB 9 e2 0', 'warna ABB 9 m2 1'] },
  { theme: 'pantai', obj: 'bola', list: ['warna AB 7 e2 0', 'warna ABB 7 e1 0', 'warna AAB 8 e2 0', 'warna AB 8 m2 1', 'warna ABB 9 m2 0', 'warna AAB 9 m2 1', 'warna ABC 7 e1 0', 'warna ABC 8 e2 0', 'warna ABC 9 m2 1', 'warna ABC 10 m3 1'] },
  { theme: 'hutan', obj: 'permen', list: ['bentuk AB 6 e1 0', 'bentuk AB 8 e2 0', 'bentuk AAB 7 e1 0', 'bentuk ABB 8 m2 0', 'bentuk AB 8 m2 1', 'bentuk ABC 7 e1 0', 'bentuk ABC 9 e2 0', 'bentuk AABB 9 e1 0', 'bentuk ABC 10 m3 1', 'bentuk AABB 10 m3 1'] },
  { theme: 'sawah', obj: 'bola', list: ['alat AB 6 e1 0', 'alat AB 8 e2 0', 'alat AAB 7 e1 0', 'alat ABB 8 e2 0', 'alat AB 8 m2 1', 'alat ABC 7 e1 0', 'alat AAB 9 m2 1', 'alat ABC 9 e2 0', 'alat AABB 10 m2 1', 'alat ABC 10 m3 1'] },
  { theme: 'kota', obj: 'mobil', list: ['warna ABC 8 e2 0', 'warna AABB 9 e1 0', 'warna ABC 9 m2 1', 'warna AABB 10 m2 0', 'warna ABCC 10 e2 0', 'warna ABBC 10 m2 1', 'warna ABC 10 m3 1', 'warna AABB 11 m3 1', 'warna ABCC 11 m3 1', 'warna ABCD 10 m3 1'] },
  { theme: 'salju', obj: 'permen', list: ['kombo AB 6 e1 1', 'kombo AB 8 e2 1', 'kombo AAB 8 e2 1', 'kombo ABB 9 m2 1', 'kombo ABC 8 e2 1', 'kombo ABC 9 m2 2', 'kombo AABB 10 m2 1', 'kombo ABC 10 m3 2', 'kombo ABBC 10 m3 2', 'kombo ABCD 11 m3 2'] },
  { theme: 'gurun', obj: 'bola', list: ['nada AB 6 e1 0', 'nada ABC 7 e1 0', 'nada ABC 8 e2 0', 'nada AAB 9 m2 1', 'nada ABCB 9 e1 1', 'nada ABCB 10 m2 1', 'nada AABC 10 m2 1', 'nada ABCD 10 e2 1', 'nada ABCD 11 m3 1', 'nada ABCD 12 m4 1'] },
  { theme: 'laut', obj: 'ikan', list: ['warna ABC 9 m2 1', 'warna ABCD 10 e2 1', 'warna AABC 10 m2 1', 'warna ABCD 11 m3 1', 'warna AABBC 12 e2 1', 'warna ABBCC 12 m2 1', 'warna ABCD 12 m3 2', 'warna AABBC 12 m2 2', 'warna ABCDE 12 e2 1', 'warna ABCDE 13 m3 1'] },
  { theme: 'gunung', obj: 'permen', list: ['dua 2.3 10 e1 1', 'dua 2.3 10 e2 1', 'dua 3.2 10 e2 1', 'dua 2.3 11 m2 1', 'dua 3.2 11 m2 2', 'dua 2.4 11 e2 1', 'dua 4.2 11 m2 2', 'dua 3.4 12 e2 2', 'dua 2.3 12 m3 2', 'dua 3.4 13 m3 2'] },
  { theme: 'bulan', obj: 'bola', list: ['kombo ABC 10 m3 2', 'nada ABCB 12 m3 1', 'alat AABC 12 m3 1', 'dua 2.3 12 m3 2', 'warna AABBC 13 m3 2', 'bentuk ABCD 12 m3 2', 'nada AABC 12 m4 2', 'kombo ABCD 12 m4 2', 'dua 3.4 13 m4 2', 'nada ABCDE 14 m4 1'] },
];

/* ---------------- acakan tetap ---------------- */

function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}
const shuffle = <T,>(a: T[], r: () => number) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

/** periode terpendek yang cocok dengan semua kotak yang tampak (null = kosong) */
export function minPeriod(vals: (string | null)[]): number {
  for (let p = 1; p <= vals.length; p++) {
    let ok = true;
    for (let i = p; i < vals.length && ok; i++) {
      const a = vals[i],
        b = vals[i - p];
      if (a !== null && b !== null && a !== b) ok = false;
    }
    // kotak yang sama-sama kosong di satu kelas periode tidak boleh: harus ada contoh yang tampak
    if (ok) {
      for (let r = 0; r < p && ok; r++) {
        let seen = false;
        for (let i = r; i < vals.length; i += p) if (vals[i] !== null) seen = true;
        if (!seen) ok = false;
      }
      if (ok) return p;
    }
  }
  return vals.length;
}

/** pola huruf (AAB) → deretan indeks sepanjang n */
const expand = (pat: string, n: number) => Array.from({ length: n }, (_, i) => pat.charCodeAt(i % pat.length) - 65);

function makeLevel(w: number, k: number, recipe: string, obj: Obj): PolaLevel {
  const [kind, pat, nStr, blankStr, dStr] = recipe.split(' ') as [Kind, string, string, string, string];
  const n = Number(nStr);
  const nd = Number(dStr);
  const theme = THEME_ORDER[w];
  for (let attempt = 0; attempt < 200; attempt++) {
    const r = rng((w + 1) * 7919 + (k + 1) * 104729 + attempt * 31337);
    let seq: Token[];
    let period: number[];
    let pool: Token[] = [];
    let focus: PolaLevel['focus'];
    if (kind === 'dua') {
      const [pc, ps] = pat.split('.').map(Number);
      const cs = shuffle(COLORS, r).slice(0, pc);
      const ss = shuffle(SHAPES, r).slice(0, ps);
      seq = Array.from({ length: n }, (_, i) => ({ k: 'bentuk', s: ss[i % ps], c: cs[i % pc] }) as Token);
      period = [pc, ps];
      focus = 'dua-pola';
      // pengecoh: warna benar + bentuk salah, atau sebaliknya
      for (const c of cs) for (const s of ss) pool.push({ k: 'bentuk', s, c });
    } else {
      const m = new Set(pat).size;
      let items: Token[];
      if (kind === 'warna') items = shuffle(COLORS, r).map((c) => ({ k: 'warna', c, o: obj }));
      else if (kind === 'bentuk') {
        const c = COLORS[Math.floor(r() * COLORS.length)];
        items = shuffle(SHAPES, r).map((s) => ({ k: 'bentuk', s, c }));
      } else if (kind === 'alat') items = shuffle(INSTRS, r).map((i) => ({ k: 'alat', i }));
      else if (kind === 'nada') items = shuffle(NOTES, r).map((nn) => ({ k: 'nada', n: nn }));
      else {
        // kombo: tiap unsur beda warna & bentuk; pengecoh menukar warna/bentuk supaya harus dicek keduanya
        const cs = shuffle(COLORS, r).slice(0, m);
        const ss = shuffle(SHAPES, r).slice(0, m);
        items = cs.map((c, i) => ({ k: 'bentuk', s: ss[i], c }));
        for (let i = 0; i < m; i++) pool.push({ k: 'bentuk', s: ss[(i + 1) % m], c: cs[i] }, { k: 'bentuk', s: ss[i], c: cs[(i + 1) % m] });
      }
      const unit = items.slice(0, m);
      if (kind !== 'kombo') pool = items.slice(m);
      seq = expand(pat, n).map((j) => unit[j]);
      period = [pat.length];
      focus = kind === 'warna' ? 'warna' : kind === 'bentuk' ? 'bentuk' : kind === 'alat' ? 'bunyi' : kind === 'nada' ? 'melodi' : 'warna-bentuk';
    }
    // kotak kosong
    const cnt = Number(blankStr.slice(1));
    const maxP = Math.max(...period);
    let blanks: number[];
    if (blankStr[0] === 'e') blanks = Array.from({ length: cnt }, (_, i) => n - cnt + i);
    else {
      const from = maxP;
      const cand = shuffle(Array.from({ length: n - 1 - from }, (_, i) => from + i), r);
      blanks = [...cand.slice(0, cnt - 1), n - 1].sort((a, b) => a - b);
    }
    // cek: setiap atribut polanya tetap terbaca (periode terpendek = periode resep) & tiap kotak kosong punya contoh
    const hidden = new Set(blanks);
    const view = (f: (t: Token) => string) => seq.map((t, i) => (hidden.has(i) ? null : f(t)));
    const checks: [number, (t: Token) => string][] =
      kind === 'dua'
        ? [
            [period[0], (t) => (t.k === 'bentuk' ? t.c : '')],
            [period[1], (t) => (t.k === 'bentuk' ? t.s : '')],
          ]
        : [[period[0], keyOf]];
    if (!checks.every(([p, f]) => minPeriod(view(f)) === p)) continue;
    // palet: semua jenis benda di deretan + pengecoh
    const answers = blanks.map((i) => seq[i]);
    const opts: Token[] = [];
    const add = (t: Token) => !opts.some((o) => same(o, t)) && opts.push(t);
    answers.forEach(add);
    if (kind === 'kombo' || kind === 'dua') {
      // pilihan dibatasi (maks 6): jawaban + pengecoh yang mirip (warna benar bentuk salah, atau sebaliknya)
      const size = Math.min(6, opts.length + nd + 1);
      for (const t of shuffle([...pool, ...seq], r)) if (opts.length < size) add(t);
    } else {
      // semua benda di deretan + pengecoh
      seq.forEach(add);
      shuffle(pool, r).slice(0, nd).forEach(add);
    }
    const options = shuffle(opts, r);
    return { id: `p${w * 10 + k + 1}`, theme, focus, seq, blanks, options, period, hint: hintFor(focus, w, k, cnt) };
  }
  throw new Error(`Pola: resep tidak bisa dibuat ${w}/${k} ${recipe}`);
}

function hintFor(focus: PolaLevel['focus'], w: number, k: number, blanks: number): string {
  const first: Partial<Record<number, string>> = {
    0: 'Halo! Lihat bunga-bunganya: warnanya berulang. Ketuk benda yang cocok untuk kotak kosong, lalu tekan Jalankan.',
    10: 'Selamat datang di Pantai! Perhatikan warna bolanya. Mana yang datang berikutnya?',
    20: 'Masuk Hutan! Sekarang yang berulang adalah BENTUK permennya. Warnanya sama semua.',
    30: 'Di Sawah kita main musik! Dengarkan alat musiknya: ketuk tombol speaker untuk mendengar polanya.',
    40: 'Kota ramai! Mobil-mobil berbaris dengan pola warna. Ada tiga warna sekarang.',
    50: 'Brr, Salju! Sekarang cek warna DAN bentuknya. Hati-hati, ada yang mirip!',
    60: 'Di Gurun kita main lonceng tangan: do, re, mi, sol, la. Dengarkan melodinya!',
    70: 'Menyelam ke Bawah Laut! Ikan berbaris dengan pola warna yang lebih panjang.',
    80: 'Gunung Berapi: ada DUA pola sekaligus! Warnanya berulang sendiri, bentuknya berulang sendiri.',
    90: 'Bulan! Semua jenis pola bercampur di sini. Kamu pasti bisa!',
  };
  const i = w * 10 + k;
  if (first[i]) return first[i]!;
  const many = blanks > 1 ? `Ada ${blanks} kotak kosong. ` : '';
  const tail: Record<PolaLevel['focus'], string> = {
    warna: 'Sebutkan warnanya satu per satu, lalu lanjutkan.',
    bentuk: 'Sebutkan bentuknya satu per satu, lalu lanjutkan.',
    bunyi: 'Ketuk speaker untuk mendengar, lalu lanjutkan bunyinya.',
    'warna-bentuk': 'Cocokkan warna dan bentuknya sekaligus.',
    melodi: 'Nyanyikan melodinya, lalu lanjutkan nadanya.',
    'dua-pola': 'Cari pola warnanya dulu, lalu pola bentuknya.',
  };
  return many + tail[focus];
}

export function buildPola(): PolaLevel[] {
  return RECIPES.flatMap((w, wi) => w.list.map((rc, k) => makeLevel(wi, k, rc, w.obj)));
}

export const POLA: PolaLevel[] = buildPola();

/* ---------------- periksa & bantuan ---------------- */

/** isian anak per kotak kosong (indeks kotak → token) */
export type Fill = Record<number, Token | undefined>;

/** kotak kosong pertama yang belum diisi / salah (urut dari kiri); null = semua benar */
export function firstProblem(l: PolaLevel, fill: Fill): { i: number; kind: 'empty' | 'wrong' } | null {
  for (const i of l.blanks) {
    const f = fill[i];
    if (!f) return { i, kind: 'empty' };
    if (!same(f, l.seq[i])) return { i, kind: 'wrong' };
  }
  return null;
}

/** 3 bintang tanpa salah & tanpa bantuan, 2 bila sekali, 1 bila lebih */
export const polaStars = (mistakes: number) => (mistakes <= 0 ? 3 : mistakes === 1 ? 2 : 1);

/** kotak contoh untuk menjelaskan pola (pengulangan pertama) */
export const unitRange = (l: PolaLevel) => Array.from({ length: Math.max(...l.period) }, (_, i) => i);

/** kalimat Agam yang menyebut satu pengulangan: "merah, biru, lalu berulang" */
export function describeUnit(l: PolaLevel): string {
  if (l.focus === 'dua-pola') {
    const [pc, ps] = l.period;
    const cs = l.seq.slice(0, pc).map((t) => (t.k === 'bentuk' ? t.c : ''));
    const ss = l.seq.slice(0, ps).map((t) => (t.k === 'bentuk' ? t.s : ''));
    return `Warnanya: ${cs.join(', ')}, lalu berulang. Bentuknya: ${ss.join(', ')}, lalu berulang.`;
  }
  const unit = l.seq.slice(0, l.period[0]);
  const word = (t: Token) => (t.k === 'warna' ? t.c : t.k === 'bentuk' ? (l.focus === 'bentuk' ? t.s : `${t.s} ${t.c}`) : t.k === 'alat' ? t.i : t.n);
  return `Polanya: ${unit.map(word).join(', ')}, lalu berulang.`;
}
