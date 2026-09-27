// Pembuat 100 level "Langkah" untuk usia 3–8 tahun. Dijalankan sekali lewat `npx tsx scripts/gen-langkah.ts`
// dan hasilnya disimpan tetap di langkah.ts (level tidak berubah-ubah, progres anak aman).
//
// Cara kerja: buat jalur yang tidak menyilang dengan jumlah belokan & panjang sesuai tingkat, lalu isi
// kotak lain dengan rintangan sesuai tema. Level hanya diterima bila jalan terpendek (BFS) persis sepanjang
// jalur itu — tidak ada jalan pintas yang membuatnya jadi terlalu mudah.
//
// Kurva: 1–10 hanya "maju" (garis lurus 2–6 kotak) · 11–15 + belok kanan · 16–18 + belok kiri ·
// 19–20 keduanya · Pantai 21–40 (2–3 belokan) · Salju 41–60 (3–4) · Gurun 61–80 (4–5) · Angkasa 81–100 (5–7).

import { run, solve, type Cmd, type Dir, type Level, type Theme } from './engine';

const DX = [0, 1, 0, -1],
  DY = [-1, 0, 1, 0];

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

interface Tier {
  theme: Theme;
  blocks: Cmd[];
  /** jumlah belokan pada jalur */
  turns: number;
  /** panjang program (maju + belok) */
  len: number;
  maxW: number;
  maxH: number;
  /** kepadatan rintangan di luar jalur */
  density: number;
  /** arah belokan yang boleh: R kanan, L kiri */
  turnSet: ('R' | 'L')[];
  dir?: Dir;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function tierFor(n: number): Tier {
  // n = nomor level 1..100
  if (n <= 10) {
    const lens = [2, 3, 3, 4, 4, 4, 5, 5, 6, 6];
    const dirs: Dir[] = [1, 1, 0, 1, 0, 3, 2, 1, 0, 3];
    return { theme: 'kebun', blocks: ['maju'], turns: 0, len: lens[n - 1], maxW: 8, maxH: 7, density: n <= 5 ? 0 : 0.12, turnSet: [], dir: dirs[n - 1] };
  }
  if (n <= 15) return { theme: 'kebun', blocks: ['maju', 'kanan'], turns: 1, len: [4, 5, 5, 6, 7][n - 11], maxW: 6, maxH: 5, density: 0.15, turnSet: ['R'] };
  if (n <= 18) return { theme: 'kebun', blocks: ['maju', 'kiri'], turns: 1, len: [5, 6, 7][n - 16], maxW: 6, maxH: 5, density: 0.18, turnSet: ['L'] };
  if (n <= 20) return { theme: 'kebun', blocks: ['maju', 'kiri', 'kanan'], turns: 2, len: [7, 8][n - 19], maxW: 6, maxH: 5, density: 0.2, turnSet: ['L', 'R'] };
  const all: Cmd[] = ['maju', 'kiri', 'kanan'];
  const t = (n - 1) % 20 / 19; // 0..1 di dalam satu dunia
  if (n <= 40) return { theme: 'pantai', blocks: all, turns: t < 0.5 ? 2 : 3, len: Math.round(lerp(7, 12, t)), maxW: 6, maxH: 5, density: 0.3, turnSet: ['L', 'R'] };
  if (n <= 60) return { theme: 'salju', blocks: all, turns: t < 0.5 ? 3 : 4, len: Math.round(lerp(10, 15, t)), maxW: 7, maxH: 5, density: 0.3, turnSet: ['L', 'R'] };
  if (n <= 80) return { theme: 'gurun', blocks: all, turns: t < 0.5 ? 4 : 5, len: Math.round(lerp(13, 18, t)), maxW: 7, maxH: 6, density: 0.3, turnSet: ['L', 'R'] };
  return { theme: 'angkasa', blocks: all, turns: t < 0.35 ? 5 : t < 0.7 ? 6 : 7, len: Math.round(lerp(16, 23, t)), maxW: 8, maxH: 6, density: 0.28, turnSet: ['L', 'R'] };
}

/** rintangan per tema: # padat (batu/pohon/kaktus/asteroid), ~ air/es/oasis */
const WATER: Record<Theme, number> = { kebun: 0.2, pantai: 0.6, salju: 0.45, gurun: 0.2, angkasa: 0 };

function attempt(n: number, tier: Tier, rnd: () => number): Level | null {
  const M = tier.len - tier.turns; // jumlah maju
  const segs = tier.turns + 1;
  if (M < segs) return null;
  // bagi maju ke segmen, tiap segmen ≥1
  const seg = Array(segs).fill(1);
  for (let k = segs; k < M; k++) seg[Math.floor(rnd() * segs)]++;
  const dir0: Dir = tier.dir ?? (Math.floor(rnd() * 4) as Dir);
  // jalur di kanvas longgar
  const cells: { x: number; y: number }[] = [{ x: 0, y: 0 }];
  const seen = new Set(['0,0']);
  let d = dir0,
    x = 0,
    y = 0;
  for (let s = 0; s < segs; s++) {
    if (s > 0) {
      const t = tier.turnSet[Math.floor(rnd() * tier.turnSet.length)];
      d = ((d + (t === 'R' ? 1 : 3)) % 4) as Dir;
    }
    for (let k = 0; k < seg[s]; k++) {
      x += DX[d];
      y += DY[d];
      const key = `${x},${y}`;
      if (seen.has(key)) return null;
      seen.add(key);
      cells.push({ x, y });
    }
  }
  const xs = cells.map((c) => c.x),
    ys = cells.map((c) => c.y);
  const minX = Math.min(...xs),
    maxX = Math.max(...xs),
    minY = Math.min(...ys),
    maxY = Math.max(...ys);
  const bw = maxX - minX + 1,
    bh = maxY - minY + 1;
  if (bw > tier.maxW || bh > tier.maxH) return null;
  // ukuran peta: sedikit ruang di sekitar jalur, minimal 3 baris & 4 kolom
  const W = Math.min(tier.maxW, Math.max(4, bw + Math.floor(rnd() * 3))),
    H = Math.min(tier.maxH, Math.max(3, bh + Math.floor(rnd() * 3)));
  const ox = Math.floor(rnd() * (W - bw + 1)) - minX,
    oy = Math.floor(rnd() * (H - bh + 1)) - minY;
  const grid = Array.from({ length: H }, () => Array(W).fill('.'));
  const onPath = new Set(cells.map((c) => `${c.x + ox},${c.y + oy}`));
  const water = WATER[tier.theme];
  for (let gy = 0; gy < H; gy++)
    for (let gx = 0; gx < W; gx++) {
      if (onPath.has(`${gx},${gy}`)) continue;
      if (rnd() < tier.density) grid[gy][gx] = rnd() < water ? '~' : '#';
    }
  const s0 = cells[0],
    g0 = cells[cells.length - 1];
  grid[s0.y + oy][s0.x + ox] = 'S';
  grid[g0.y + oy][g0.x + ox] = 'G';
  const level: Level = { id: `k${n}`, theme: tier.theme, dir: dir0, blocks: tier.blocks, map: grid.map((r) => r.join('')), hint: '' };
  // tutup jalan pintas: taruh rintangan di kotak jalan pintas yang bukan bagian jalur, ulangi
  let sol = solve(level);
  for (let fix = 0; fix < 40 && sol && sol.length < tier.len; fix++) {
    const shortcut = run(level, sol)
      .steps.filter((st) => st.kind === 'move' && !onPath.has(`${st.x},${st.y}`))
      .map((st) => ({ x: st.x, y: st.y }));
    if (!shortcut.length) return null;
    const c = shortcut[Math.floor(rnd() * shortcut.length)];
    grid[c.y][c.x] = rnd() < water ? '~' : '#';
    level.map = grid.map((r) => r.join(''));
    sol = solve(level);
  }
  if (!sol || sol.length !== tier.len) return null;
  // hindari putar balik (dua belokan sama berturut-turut) yang membingungkan anak kecil
  if (/(kanan,kanan|kiri,kiri)/.test(sol.join(','))) return null;
  return level;
}

const HINT_FIRST: Record<number, string> = {
  1: 'Ketuk blok Maju, lalu tekan Jalankan. Agam akan berjalan!',
  2: 'Berapa kotak sampai ke bintang? Sebanyak itu blok Maju.',
  3: 'Agam menghadap ke atas. Maju berarti jalan ke atas.',
  6: 'Agam menghadap ke kiri. Maju berarti jalan ke kiri.',
  7: 'Sekarang Agam menghadap ke bawah.',
  11: 'Blok baru: belok kanan! Agam berputar di tempat, belum berjalan.',
  16: 'Blok baru: belok kiri! Agam berputar ke arah tangan kirinya.',
  19: 'Sekarang ada belok kiri dan belok kanan. Pilih yang tepat, ya.',
  21: 'Selamat datang di Pantai! Agam tidak bisa berenang, lewat pasir saja.',
  41: 'Brrr, dunia Salju! Kolam es tipis bisa retak, dan pohon cemara menghalangi.',
  61: 'Dunia Gurun! Hati-hati kaktus berduri, dan jangan tercebur di oasis.',
  81: 'Luar Angkasa! Asteroid melayang di mana-mana. Pelan-pelan saja.',
  100: 'Level terakhir! Selesaikan, lalu ambil sertifikatmu.',
};
const HINT_POOL = [
  'Tunjuk kotaknya dengan jari sambil menghitung.',
  'Bayangkan kamu adalah Agam. Ke mana tangan kananmu?',
  'Susun sedikit dulu, jalankan, lalu tambah lagi.',
  'Makin sedikit blok, makin banyak bintang.',
  'Kalau salah, tidak apa-apa. Programmer juga sering mencoba lagi.',
  'Ikuti jalan yang kosong, hindari rintangan.',
  'Belok tidak membuat Agam berjalan. Setelah belok, jangan lupa Maju.',
  'Lihat dulu ke mana Agam menghadap sebelum menyusun blok.',
];

function hintFor(n: number, l: Level) {
  if (HINT_FIRST[n]) return HINT_FIRST[n];
  if (n <= 10) return 'Hitung kotaknya, lalu ketuk Maju sebanyak itu.';
  if (n <= 15) return 'Maju dulu, belok kanan, lalu maju lagi.';
  if (n <= 18) return 'Maju dulu, belok kiri, lalu maju lagi.';
  if (l.dir === 2 && n % 3 === 0) return 'Agam menghadap ke bawah. Kanan dan kiri Agam jadi terbalik, lho!';
  return HINT_POOL[n % HINT_POOL.length];
}

export function buildLangkah(): Level[] {
  const out: Level[] = [];
  const maps = new Set<string>();
  for (let n = 1; n <= 100; n++) {
    const tier = tierFor(n);
    const rnd = mulberry(7919 * n + 17);
    let lv: Level | null = null;
    for (let a = 0; a < 20000 && !lv; a++) {
      const got = attempt(n, tier, rnd);
      if (got && !maps.has(got.map.join('/'))) lv = got;
    }
    if (!lv) throw new Error(`level ${n} gagal dibuat`);
    lv.hint = hintFor(n, lv);
    maps.add(lv.map.join('/'));
    out.push(lv);
  }
  return out;
}
