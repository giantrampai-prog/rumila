// Pembuat level Ulangi, Kalau… dan Jurus (10 Level bertema × 10 coding). Dijalankan sekali lewat
// `npx tsx scripts/gen-prog.ts`; hasilnya disimpan tetap di ulangi.ts / kalau.ts / jurus.ts (progres anak aman).
//
// Ulangi & Jurus: jalur dibuat dari RESEP program (mis. "ulangi 3 kali [maju, belok kanan, maju, belok kiri]"),
// rintangan diisi di luar jalur, lalu jalan pintas ditutup sampai jalan terpendek = jalur resep. Jatah blok dibuat
// lebih kecil dari program tanpa ulangi/jurus, jadi anak memang harus memakai blok baru itu.
// Kalau…: papan acak + ATURAN (mis. "ulangi sampai bintang [kalau ada rintangan di depan: belok kanan, kalau
// tidak: maju]"). Aturan dijalankan di papan itu dan bintang ditaruh di ujung jalannya; jalan terpendeknya dibuat
// jauh lebih panjang dari jatah blok, jadi hanya program yang "berpikir" yang muat.

import { run, solve, THEME_ORDER, type Cmd, type Dir, type Level, type Theme } from './engine';
import { countBlocks, describe, renumber, runProg, S, type PBlock, type Program, type ProgLevel, type Stmt } from './prog';

const DX = [0, 1, 0, -1],
  DY = [-1, 0, 1, 0];
const MAXW = 9,
  MAXH = 7;

function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const WATER: Record<Theme, number> = { kebun: 0.2, pantai: 0.6, hutan: 0.3, sawah: 0.7, kota: 0.25, salju: 0.45, gurun: 0.2, laut: 0.35, gunung: 0.5, bulan: 0.3 };
const ALL: Cmd[] = ['maju', 'kiri', 'kanan'];

/** buka resep (hanya perintah, ulangi, jurus) jadi daftar perintah biasa */
function flat(list: Stmt[], jurus: Stmt[]): Cmd[] {
  const out: Cmd[] = [];
  const walk = (l: Stmt[]) => {
    for (const s of l) {
      if (s.t === 'cmd') out.push(s.c);
      else if (s.t === 'call') walk(jurus);
      else if (s.t === 'loop') for (let k = 0; k < s.n; k++) walk(s.body);
    }
  };
  walk(list);
  // belokan di ujung program tidak ikut jalur
  while (out.length && out[out.length - 1] !== 'maju') out.pop();
  return out;
}

/** peta dari daftar perintah; null bila jalur menyilang / terlalu besar / tidak bisa dibuat tanpa jalan pintas */
function mapFromCmds(id: string, theme: Theme, cmds: Cmd[], dir0: Dir, density: number, rnd: () => number): Level | null {
  const cells = [{ x: 0, y: 0 }];
  const seen = new Set(['0,0']);
  let d = dir0,
    x = 0,
    y = 0;
  for (const c of cmds) {
    if (c !== 'maju') {
      d = ((d + (c === 'kanan' ? 1 : 3)) % 4) as Dir;
      continue;
    }
    x += DX[d];
    y += DY[d];
    const k = `${x},${y}`;
    if (seen.has(k)) return null;
    seen.add(k);
    cells.push({ x, y });
  }
  if (/(kanan,kanan|kiri,kiri)/.test(cmds.join(','))) return null;
  const xs = cells.map((c) => c.x),
    ys = cells.map((c) => c.y);
  const minX = Math.min(...xs),
    minY = Math.min(...ys);
  const bw = Math.max(...xs) - minX + 1,
    bh = Math.max(...ys) - minY + 1;
  if (bw > MAXW || bh > MAXH) return null;
  const W = Math.min(MAXW, Math.max(4, bw + Math.floor(rnd() * 2))),
    H = Math.min(MAXH, Math.max(3, bh + Math.floor(rnd() * 2)));
  const ox = Math.floor(rnd() * (W - bw + 1)) - minX,
    oy = Math.floor(rnd() * (H - bh + 1)) - minY;
  const grid = Array.from({ length: H }, () => Array(W).fill('.'));
  const onPath = new Set(cells.map((c) => `${c.x + ox},${c.y + oy}`));
  const water = WATER[theme];
  for (let gy = 0; gy < H; gy++) for (let gx = 0; gx < W; gx++) if (!onPath.has(`${gx},${gy}`) && rnd() < density) grid[gy][gx] = rnd() < water ? '~' : '#';
  const s0 = cells[0],
    g0 = cells[cells.length - 1];
  grid[s0.y + oy][s0.x + ox] = 'S';
  grid[g0.y + oy][g0.x + ox] = 'G';
  const level: Level = { id, theme, dir: dir0, blocks: ALL, map: grid.map((r) => r.join('')), hint: '' };
  // tutup jalan pintas sampai jalan terpendek = jalur resep
  let sol = solve(level);
  for (let fix = 0; fix < 90 && sol && sol.length < cmds.length; fix++) {
    const sc = run(level, sol)
      .steps.filter((st) => st.kind === 'move' && !onPath.has(`${st.x},${st.y}`))
      .map((st) => ({ x: st.x, y: st.y }));
    if (!sc.length) return null;
    const c = sc[Math.floor(rnd() * sc.length)];
    grid[c.y][c.x] = rnd() < water ? '~' : '#';
    level.map = grid.map((r) => r.join(''));
    sol = solve(level);
  }
  if (!sol || sol.length !== cmds.length) return null;
  return level;
}

/* ================= resep Ulangi & Jurus ================= */

type Recipe = (k: number, X: Cmd, Y: Cmd) => Program;
const M = S.m;
const Ms = (n: number) => Array.from({ length: n }, M);
const L = (n: number, body: Stmt[]) => S.loop(n, body);
const T = (c: Cmd) => S.c(c);

const ULANGI: { palette: PBlock[]; slack: number; hints: string[]; make: Recipe }[] = [
  // 1 Kebun: garis lurus
  { palette: ['maju', 'ulangi'], slack: 0, hints: ['Blok baru: ULANGI! Masukkan "maju" ke dalamnya, lalu ketuk angkanya untuk memilih berapa kali.', 'Hitung kotaknya. Ulangi maju sebanyak itu!'], make: (k) => ({ main: [L([3, 3, 4, 4, 5, 5, 6, 6, 7, 8][k], [M()])], jurus: [] }) },
  // 2 Pantai: lurus, belok, lurus
  {
    palette: ['maju', 'kiri', 'kanan', 'ulangi'],
    slack: 1,
    hints: ['Dua bagian lurus! Pakai dua blok ulangi dengan belokan di tengahnya.'],
    make: (k, X, Y) => {
      const ab = [[3, 3], [3, 4], [4, 3], [4, 4], [3, 5], [5, 3], [4, 5], [5, 4], [3, 3, 3], [3, 4, 3]][k];
      const main: Stmt[] = [L(ab[0], [M()]), T(X), L(ab[1], [M()])];
      if (ab.length > 2) main.push(T(Y), L(ab[2], [M()]));
      return { main, jurus: [] };
    },
  },
  // 3 Hutan: tangga
  {
    palette: ['maju', 'kiri', 'kanan', 'ulangi'],
    slack: 1,
    hints: ['Jalannya seperti tangga. Cari gerakan yang berulang: maju, belok, maju, belok…'],
    make: (k, X, Y) => {
      const n = [2, 3, 3, 3, 4, 4, 4, 3, 3, 3][k];
      const body = k < 7 ? [M(), T(X), M(), T(Y)] : k < 9 ? [M(), M(), T(X), M(), T(Y)] : [M(), M(), T(X), M(), M(), T(Y)];
      return { main: [L(n, body)], jurus: [] };
    },
  },
  // 4 Sawah: bentuk U (belok ke arah yang sama)
  {
    palette: ['maju', 'kiri', 'kanan', 'ulangi'],
    slack: 1,
    hints: ['Agam berkeliling pematang. Setiap sisi: maju beberapa kali, lalu belok ke arah yang sama.'],
    make: (k, X) => {
      const [r, a] = [[2, 2], [2, 3], [2, 4], [3, 2], [3, 2], [3, 3], [3, 3], [3, 4], [3, 4], [3, 5]][k];
      return { main: [L(r, [...Ms(a), T(X)])], jurus: [] };
    },
  },
  // 5 Kota: lurus + tangga
  {
    palette: ['maju', 'kiri', 'kanan', 'ulangi'],
    slack: 1,
    hints: ['Ada dua bagian: jalan lurus dan tangga. Satu ulangi untuk tiap bagian.'],
    make: (k, X, Y) => {
      const a = [2, 3, 3, 4, 4, 2, 3, 3, 4, 4][k],
        n = [2, 2, 3, 2, 3, 2, 2, 3, 3, 3][k];
      return k < 5 ? { main: [L(a, [M()]), L(n, [T(X), M(), T(Y), M()])], jurus: [] } : { main: [L(n, [M(), T(X), M(), T(Y)]), L(a, [M()])], jurus: [] };
    },
  },
  // 6 Salju: tangga besar, lalu jalan ular (banyak ulangi)
  {
    palette: ['maju', 'kiri', 'kanan', 'ulangi'],
    slack: 1,
    hints: ['Anak tangganya besar! Hitung berapa maju ke depan dan berapa maju ke samping.', 'Jalannya berkelok seperti ular. Setiap bagian lurus pakai ulangi.'],
    make: (k, X, Y) => {
      if (k < 5) {
        const [n, a, b] = [[2, 2, 1], [2, 1, 2], [2, 2, 2], [3, 2, 1], [3, 1, 2]][k];
        return { main: [L(n, [...Ms(a), T(X), ...Ms(b), T(Y)])], jurus: [] };
      }
      const a = [3, 3, 4, 4, 5][k - 5];
      return { main: [L(a, [M()]), T(X), L(2, [M()]), T(X), L(a, [M()]), T(Y), L(2, [M()]), T(Y), L(a, [M()])], jurus: [] };
    },
  },
  // 7 Gurun: lurus + belok + tangga panjang
  {
    palette: ['maju', 'kiri', 'kanan', 'ulangi'],
    slack: 1,
    hints: ['Pecah jalannya jadi bagian-bagian. Bagian yang berulang pakai ulangi.'],
    make: (k, X, Y) => {
      const a = [3, 3, 4, 4, 5, 3, 4, 4, 5, 4][k],
        n = [2, 3, 2, 3, 3, 2, 3, 3, 3, 4][k];
      return { main: [L(a, [M()]), T(X), L(n, [M(), T(Y), M(), T(X)])], jurus: [] };
    },
  },
  // 8 Laut: dua bentuk U berturutan
  {
    palette: ['maju', 'kiri', 'kanan', 'ulangi'],
    slack: 1,
    hints: ['Dua kelompok gerakan berulang. Butuh dua blok ulangi.'],
    make: (k, X, Y) => {
      const a = [2, 2, 3, 3, 2, 3, 3, 4, 4, 4][k],
        b = [2, 3, 2, 3, 4, 3, 4, 3, 4, 5][k];
      return { main: [L(a, [M()]), T(X), L(2, [...Ms(2), T(Y)]), L(b, [M()])], jurus: [] };
    },
  },
  // 9 Gunung: tangga dua tingkat
  {
    palette: ['maju', 'kiri', 'kanan', 'ulangi'],
    slack: 1,
    hints: ['Tangganya bertingkat dua. Satu anak tangga = maju 2, belok, maju, belok.'],
    make: (k, X, Y) => {
      const n = [2, 2, 3, 3, 3, 3, 3, 3, 3, 3][k],
        a = [1, 2, 1, 2, 2, 2, 1, 1, 1, 1][k];
      return { main: [L(a, [M()]), L(n, [M(), M(), T(X), M(), T(Y)]), ...(k >= 6 ? [M(), T(X), L(k >= 8 ? 3 : 2, [M()])] : [])], jurus: [] };
    },
  },
  // 10 Bulan: gabungan
  {
    palette: ['maju', 'kiri', 'kanan', 'ulangi'],
    slack: 1,
    hints: ['Soal terakhir Ulangi! Cari semua bagian yang berulang.'],
    make: (k, X, Y) => {
      const n = [2, 2, 3, 3, 3, 3, 3, 3, 3, 3][k],
        a = [2, 3, 2, 3, 3, 4, 3, 4, 4, 4][k];
      return { main: [L(a, [M()]), T(X), L(n, [M(), T(Y), M(), T(X)]), L(k >= 5 ? 3 : 2, [M()]), T(X), L(2, [M()])], jurus: [] };
    },
  },
];

const J = (main: Stmt[], jurus: Stmt[]): Program => ({ main, jurus });
const C = S.call;
const JURUS: { palette: PBlock[]; slack: number; hints: string[]; make: Recipe }[] = [
  // 1 Kebun: jurus = maju beberapa kali
  { palette: ['maju', 'kiri', 'kanan', 'jurus'], slack: 1, hints: ['Blok baru: JURUS ⚡! Isi jurusnya di kotak Jurus, lalu panggil jurus di program utama.', 'Jurusnya dipakai lebih dari sekali. Susun sekali, pakai berkali-kali!'], make: (k, X) => { const a = [3, 3, 4, 4, 3, 4, 3, 3, 4, 4][k]; return k < 4 ? J([C(), T(X), C()], Ms(a)) : k < 7 ? J([C(), T(X), C(), T(X), C()], Ms(a - 1)) : J([C(), T(X), C(), M(), C()], Ms(a - 1)); } },
  // 2 Pantai: jurus = lurus + belok
  { palette: ['maju', 'kiri', 'kanan', 'jurus'], slack: 1, hints: ['Jurusnya bisa berisi belokan juga, lho.'], make: (k, X) => { const a = [2, 2, 3, 3, 2, 3, 2, 3, 3, 3][k]; return k < 5 ? J([C(), C(), C()], [...Ms(a), T(X)]) : J([C(), C(), C(), ...Ms(k < 8 ? 1 : 2)], [...Ms(k < 8 ? 3 : 4), T(X)]); } },
  // 3 Hutan: jurus tangga
  { palette: ['maju', 'kiri', 'kanan', 'jurus'], slack: 1, hints: ['Buat jurus satu anak tangga, lalu panggil beberapa kali.'], make: (k, X, Y) => (k < 5 ? J([C(), C(), C()], [M(), T(X), M(), T(Y)]) : J([M(), C(), C(), M(), C()], [M(), T(X), M(), T(Y)])) },
  // 4 Sawah: jurus bentuk ⊓ (lompat pematang)
  { palette: ['maju', 'kiri', 'kanan', 'jurus'], slack: 1, hints: ['Jurus lompat pematang: naik, maju, lalu turun lagi.'], make: (k, X, Y) => { const d = k < 5 ? 1 : 2;
    const body = [T(X), ...Ms(d), T(Y), M(), M(), T(Y), ...Ms(d), T(X)]; return J([M(), C(), M(), M(), C()], body); } },
  // 5 Kota: jurus + jalan di antaranya
  { palette: ['maju', 'kiri', 'kanan', 'jurus'], slack: 1, hints: ['Di antara jurus ada jalan lurus. Jurusnya tetap sama!'], make: (k, X, Y) => (k < 5 ? J([C(), M(), C(), M(), C()], [M(), T(X), M(), T(Y), M()]) : J([C(), M(), C()], [M(), T(X), M(), T(Y), M(), T(X), M(), T(Y)])) },
  // 6 Salju: jurus tangga besar
  { palette: ['maju', 'kiri', 'kanan', 'jurus'], slack: 1, hints: ['Jurusnya panjang. Hemat sekali kalau dipakai tiga kali!'], make: (k, X, Y) => (k < 5 ? J([C(), C(), C()], [M(), T(X), M(), M(), T(Y), M()]) : J([C(), C(), C()], [M(), M(), T(X), M(), M(), T(Y)])) },
  // 7 Gurun: ulangi boleh dipakai di dalam jurus
  { palette: ['maju', 'kiri', 'kanan', 'ulangi', 'jurus'], slack: 1, hints: ['Sekarang ulangi boleh dipakai di dalam jurus!'], make: (k, X) => { const a = [3, 4, 3, 4, 5, 4, 5, 5, 6, 6][k]; return k < 5 ? J([C(), C(), C()], [L(a, [M()]), T(X)]) : J([C(), C(), M(), C()], [L(a - 1, [M()]), T(X)]); } },
  // 8 Laut: ulangi memanggil jurus
  { palette: ['maju', 'kiri', 'kanan', 'ulangi', 'jurus'], slack: 1, hints: ['Jurus juga bisa dipanggil di dalam ulangi!'], make: (k, X, Y) => { const n = [3, 3, 4, 4, 3, 3, 4, 4, 3, 4][k]; return J([L(n, [C()]), ...(k >= 4 ? [M(), T(X), M(), M()] : [])], [M(), T(X), M(), T(Y)]); } },
  // 9 Gunung: jurus tangga ganda + jalan lurus di antaranya
  { palette: ['maju', 'kiri', 'kanan', 'ulangi', 'jurus'], slack: 1, hints: ['Gabungkan jurus dan ulangi supaya programnya pendek.'], make: (k, X, Y) => { const g = [2, 3, 2, 3, 3, 2, 2, 2, 2, 2][k]; const body = [M(), T(X), M(), M(), T(Y), M()]; return k < 5 ? J([C(), L(g, [M()]), C()], body) : J([C(), C(), L(g, [M()]), C()], body); } },
  // 10 Bulan: gabungan
  { palette: ['maju', 'kiri', 'kanan', 'ulangi', 'jurus'], slack: 1, hints: ['Soal terakhir Jurus! Pakai jurus dan ulangi sehemat mungkin.'], make: (k, X, Y) => { const a = [1, 2, 1, 2, 2, 2, 1, 2, 2, 2][k]; return J([L(2, [C()]), L(a, [M()]), T(Y), L(2, [C()])], [M(), T(X), M(), T(Y), M()]); } },
];

function buildFromRecipes(prefix: string, R: typeof ULANGI, seed: number): ProgLevel[] {
  const out: ProgLevel[] = [];
  const maps = new Set<string>();
  for (let w = 0; w < 10; w++)
    for (let k = 0; k < 10; k++) {
      const n = w * 10 + k + 1;
      const theme = THEME_ORDER[w];
      const rnd = mulberry(seed * 7919 + n * 104729);
      let got: ProgLevel | null = null;
      for (let a = 0; a < 6000 && !got; a++) {
        const X: Cmd = rnd() < 0.5 ? 'kanan' : 'kiri';
        const Y: Cmd = X === 'kanan' ? 'kiri' : 'kanan';
        const prog = R[w].make(k, X, Y);
        const cmds = flat(prog.main, prog.jurus);
        const dir = (n <= 3 ? 1 : Math.floor(rnd() * 4)) as Dir;
        const lv = mapFromCmds(`${prefix}${n}`, theme, cmds, dir, w < 2 ? 0.18 : 0.26, rnd);
        if (!lv || maps.has(lv.map.join('/'))) continue;
        const sol = renumber(prog);
        if (runProg(lv, sol).result !== 'win') continue;
        const best = countBlocks(sol);
        const raw = cmds.length;
        if (best >= raw) continue;
        const limit = Math.max(best, Math.min(best + R[w].slack, raw - 1));
        const hint = R[w].hints[Math.min(k, R[w].hints.length - 1)];
        got = { ...lv, palette: R[w].palette, best, limit, tip: describe(sol), solution: sol, hint };
      }
      if (!got) throw new Error(`${prefix}${n} gagal dibuat`);
      maps.add(got.map.join('/'));
      out.push(got);
    }
  return out;
}

export const buildUlangi = () => buildFromRecipes('u', ULANGI, 11);
export const buildJurus = () => buildFromRecipes('j', JURUS, 23);

/* ================= Kalau… ================= */

type Rule = { name: string; make: (X: Cmd) => Program; turns: 'X' | 'kanan' | 'kiri' | 'mix' };
const RULES: Record<string, Rule> = {
  // ulangi sampai bintang [maju] — pengenalan "sampai bintang"
  lurus: { name: 'lurus', turns: 'X', make: () => ({ main: [S.until([M()])], jurus: [] }) },
  // kalau ada rintangan di depan: belok X, kalau tidak: maju
  depan: { name: 'depan', turns: 'X', make: (X) => ({ main: [S.until([S.if('depan', [T(X)], [M()])])], jurus: [] }) },
  // kalau jalan terbuka di kanan: belok kanan · lalu maju
  kanan: { name: 'kanan', turns: 'kanan', make: () => ({ main: [S.until([S.if('kanan', [T('kanan')]), M()])], jurus: [] }) },
  kiri: { name: 'kiri', turns: 'kiri', make: () => ({ main: [S.until([S.if('kiri', [T('kiri')]), M()])], jurus: [] }) },
  // kalau rintangan di depan: (kalau kanan terbuka: kanan, kalau tidak: kiri), kalau tidak: maju
  simpang: { name: 'simpang', turns: 'mix', make: () => ({ main: [S.until([S.if('depan', [S.if('kanan', [T('kanan')], [T('kiri')])], [M()])])], jurus: [] }) },
  // pengikut dinding kiri: kalau kiri terbuka belok kiri; kalau rintangan di depan belok kanan, kalau tidak maju
  dinding: { name: 'dinding', turns: 'mix', make: () => ({ main: [S.until([S.if('kiri', [T('kiri')]), S.if('depan', [T('kanan')], [M()])])], jurus: [] }) },
};

/** resep per Level: [aturan, belokan minimal, langkah maju minimal, kepadatan rintangan] per coding */
const KALAU: { palette: PBlock[]; hints: string[]; plan: (k: number) => [string, number, number, number] }[] = [
  { palette: ['maju', 'kiri', 'kanan', 'sampai', 'kalau'], hints: ['Blok baru: ULANGI SAMPAI BINTANG! Agam terus mengulang isinya sampai tiba di bintang.', 'Jalannya panjang, bloknya sedikit. Pakai ulangi sampai bintang.', 'Jalannya panjang, bloknya sedikit. Pakai ulangi sampai bintang.', 'Blok baru: KALAU! Agam bisa melihat: kalau ada rintangan di depan, belok. Kalau tidak, maju.', 'Masukkan blok kalau ke dalam ulangi sampai bintang.'], plan: (k) => (k < 3 ? ['lurus', 0, [6, 7, 7][k], 0.25] : ['depan', k < 6 ? 1 : 2, 5 + k, 0.35]) },
  { palette: ['maju', 'kiri', 'kanan', 'sampai', 'kalau'], hints: ['Kalau ada rintangan di depan, belok. Kalau tidak, maju. Ulangi sampai bintang!'], plan: (k) => ['depan', k < 5 ? 2 : 3, 8 + k, 0.4] },
  { palette: ['maju', 'kiri', 'kanan', 'sampai', 'kalau'], hints: ['Sensor baru: jalan terbuka di kanan. Kalau di kanan ada jalan, belok kanan. Lalu maju.'], plan: (k) => ['kanan', k < 5 ? 2 : 3, 8 + k, 0.6] },
  { palette: ['maju', 'kiri', 'kanan', 'sampai', 'kalau'], hints: ['Sekarang cek sisi kiri: kalau di kiri ada jalan, belok kiri. Lalu maju.'], plan: (k) => [k % 2 ? 'kanan' : 'kiri', k < 5 ? 2 : 3, 9 + k, 0.62] },
  { palette: ['maju', 'kiri', 'kanan', 'sampai', 'kalau'], hints: ['Belokannya bisa ke kanan atau ke kiri! Kalau di dalam kalau: kalau buntu, cek kanan dulu.'], plan: (k) => ['simpang', k < 5 ? 2 : 3, 8 + k, 0.75] },
  { palette: ['maju', 'kiri', 'kanan', 'sampai', 'kalau'], hints: ['Kalau buntu: kalau kanan terbuka belok kanan, kalau tidak belok kiri.'], plan: (k) => ['simpang', k < 5 ? 3 : 4, 10 + k, 0.8] },
  { palette: ['maju', 'kiri', 'kanan', 'sampai', 'kalau'], hints: ['Gurun luas! Pilih aturan yang tepat untuk jalannya.'], plan: (k) => [(['depan', 'kanan', 'kiri', 'simpang'] as const)[k % 4], 3, 10 + k, 0.55] },
  { palette: ['maju', 'kiri', 'kanan', 'sampai', 'kalau'], hints: ['Jurus penjelajah: susuri dinding kiri. Kalau kiri terbuka belok kiri; kalau depan terhalang belok kanan, kalau tidak maju.'], plan: (k) => ['dinding', k < 5 ? 3 : 4, 10 + k, 0.8] },
  { palette: ['maju', 'kiri', 'kanan', 'sampai', 'kalau'], hints: ['Jalan Gunung Berapi berliku. Pikirkan dulu: sensor mana yang dibutuhkan?'], plan: (k) => [(['simpang', 'dinding'] as const)[k % 2], 4, 12 + k, 0.75] },
  { palette: ['maju', 'kiri', 'kanan', 'sampai', 'kalau'], hints: ['Soal terakhir Kalau…! Kamu sudah jadi programmer yang pintar memilih.'], plan: (k) => [(['depan', 'kanan', 'kiri', 'simpang', 'dinding'] as const)[k % 5], 4 + (k >> 2), 12 + k, 0.7] },
];

export function buildKalau(): ProgLevel[] {
  const out: ProgLevel[] = [];
  const maps = new Set<string>();
  for (let w = 0; w < 10; w++)
    for (let k = 0; k < 10; k++) {
      const n = w * 10 + k + 1;
      const theme = THEME_ORDER[w];
      const rnd = mulberry(37 * 7919 + n * 104729);
      const [ruleName, minTurns, minMoves, dens] = KALAU[w].plan(k);
      const rule = RULES[ruleName];
      let got: ProgLevel | null = null;
      for (let a = 0; a < 40000 && !got; a++) {
        const X: Cmd = rnd() < 0.5 ? 'kanan' : 'kiri';
        // lorong: belokan sesuai aturan, panjang & jumlah belokan sesuai tingkat
        const turns = ruleName === 'lurus' ? 0 : minTurns + (rnd() < 0.4 ? 1 : 0);
        const moves = minMoves + Math.floor(rnd() * 3);
        const segs = turns + 1;
        if (moves < segs) continue;
        const seg = Array(segs).fill(1);
        for (let q = segs; q < moves; q++) seg[Math.floor(rnd() * segs)]++;
        const cmds: Cmd[] = [];
        seg.forEach((len, si) => {
          if (si > 0) cmds.push(rule.turns === 'X' ? X : rule.turns === 'mix' ? (rnd() < 0.5 ? 'kanan' : 'kiri') : rule.turns);
          for (let q = 0; q < len; q++) cmds.push('maju');
        });
        const dir = Math.floor(rnd() * 4) as Dir;
        const lv = mapFromCmds(`c${n}`, theme, cmds, dir, dens, rnd);
        if (!lv || maps.has(lv.map.join('/'))) continue;
        const prog = renumber(rule.make(X));
        if (runProg(lv, prog).result !== 'win') continue;
        const best = countBlocks(prog);
        const limit = best + (w < 4 ? 2 : 1);
        const shortest = solve(lv);
        // program tanpa "kalau" tidak boleh muat di jatah blok
        if (!shortest || shortest.length < limit + 3) continue;
        if (ruleName !== 'lurus' && /^(maju,)*maju$/.test(shortest.join(','))) continue;
        const hint = KALAU[w].hints[Math.min(k, KALAU[w].hints.length - 1)];
        got = { ...lv, palette: KALAU[w].palette, best, limit, tip: describe(prog), solution: prog, hint };
      }
      if (!got) throw new Error(`c${n} gagal dibuat`);
      maps.add(got.map.join('/'));
      out.push(got);
    }
  return out;
}
