// Pembuat soal Ulangi, Kalau… dan Jurus (10 Level × 10 coding). Dijalankan lewat `npx tsx scripts/gen-prog.ts`;
// hasilnya disimpan tetap di ulangi.ts / kalau.ts / jurus.ts (progres anak aman).
//
// Ulangi (Agam Pelukis): gambar dibuat dari RESEP program (mis. "ulangi 4 kali [maju 2×, belok kanan]" = persegi).
//   Jatah blok lebih kecil dari program tanpa ulangi, jadi anak harus menemukan bagian yang berulang.
// Kalau… (Agam Pelari): tiap soal menentukan panjang lintasan & jenis rintangan; susunannya diacak tiap main, jadi
//   hanya program dengan "kalau" yang selalu berhasil. Tes menjalankan solusi di ratusan susunan acak.
// Jurus (Dojo Ninja): rangkaian gerakan Sensei dibuat dari resep jurus (mis. jurus = pukul, pukul, tendang; dipakai
//   3 kali dengan gerakan lain di antaranya). Jatah blok memaksa anak memakai jurus.

import { countBlocks, flatActs, renumber, S, type PBlock, type Program, type Stmt } from './prog';
import { MOVES, traceSegments, type JurusLevel, type KalauLevel, type MoveName, type Obst, type UlangiLevel } from './worlds';

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

const A = S.a;
const L = (n: number, body: Stmt[]) => S.loop(n, body);
const rep = (n: number, f: () => Stmt) => Array.from({ length: n }, f);

/* ================= Ulangi ================= */

const MAXC = 9,
  MAXR = 7;
type Shape = (k: number, X: string, Y: string) => Stmt[];
const M = () => A('maju');
const Ms = (n: number) => rep(n, M);
const T = (c: string) => A(c);

const ULANGI: { name: string; palette: PBlock[]; hints: string[]; shape: Shape }[] = [
  {
    name: 'garis',
    palette: ['maju', 'ulangi'],
    hints: ['Blok baru: ULANGI! Masukkan "maju" ke dalamnya, lalu ketuk angkanya untuk memilih berapa kali.', 'Hitung titiknya. Ulangi maju sebanyak itu!'],
    shape: (k) => [L([3, 3, 4, 4, 5, 5, 6, 6, 7, 8][k], [M()])],
  },
  {
    name: 'persegi',
    palette: ['maju', 'kiri', 'kanan', 'ulangi'],
    hints: ['Persegi punya 4 sisi yang sama. Satu sisi: maju, lalu belok. Ulangi 4 kali!', 'Persegi punya 4 sisi yang sama. Satu sisi: maju, lalu belok. Ulangi 4 kali!', 'Persegi punya 4 sisi yang sama. Satu sisi: maju, lalu belok. Ulangi 4 kali!', 'Persegi punya 4 sisi yang sama. Satu sisi: maju, lalu belok. Ulangi 4 kali!', 'Persegi punya 4 sisi yang sama. Satu sisi: maju, lalu belok. Ulangi 4 kali!', 'Persegi punya 4 sisi yang sama. Satu sisi: maju, lalu belok. Ulangi 4 kali!', 'Persegi punya 4 sisi yang sama. Satu sisi: maju, lalu belok. Ulangi 4 kali!', 'Persegi panjang: sisi panjang, belok, sisi pendek, belok — lalu ulangi 2 kali.'],
    shape: (k, X) => {
      if (k < 7) return [L(4, [...Ms([1, 1, 2, 2, 2, 3, 3][k]), T(X)])];
      const [a, b] = [[2, 3], [3, 2], [4, 2]][k - 7];
      return [L(2, [...Ms(a), T(X), ...Ms(b), T(X)])];
    },
  },
  {
    name: 'tangga',
    palette: ['maju', 'kiri', 'kanan', 'ulangi'],
    hints: ['Gambar tangga! Satu anak tangga: maju, belok, maju, belok ke arah sebaliknya.'],
    shape: (k, X, Y) => (k < 6 ? [L([2, 3, 3, 4, 4, 5][k], [M(), T(X), M(), T(Y)])] : [L([2, 3, 3, 3][k - 6], k < 8 ? [M(), M(), T(X), M(), T(Y)] : [M(), T(X), M(), M(), T(Y)])]),
  },
  {
    name: 'pagar',
    palette: ['maju', 'kiri', 'kanan', 'ulangi'],
    hints: ['Gambar pagar benteng: naik, maju, turun, maju — lalu ulangi.'],
    shape: (k, X, Y) => (k < 6 ? [L([2, 2, 3, 3, 4, 4][k], [T(X), M(), T(Y), M(), T(Y), M(), T(X), M()])] : [L([2, 3, 3, 4][k - 6], [T(X), M(), M(), T(Y), M(), T(Y), M(), M(), T(X), M()])]),
  },
  {
    name: 'ular',
    palette: ['maju', 'kiri', 'kanan', 'ulangi'],
    hints: ['Garisnya berkelok seperti ular: ke samping, turun, kembali, turun… Temukan bagian yang berulang.'],
    shape: (k, X, Y) => {
      const [n, a] = [[2, 2], [2, 3], [2, 3], [2, 4], [2, 5], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6]][k];
      return [L(n, [...Ms(a), T(X), M(), T(X), ...Ms(a), T(Y), M(), T(Y)])];
    },
  },
  {
    name: 'jendela',
    palette: ['maju', 'kiri', 'kanan', 'ulangi'],
    hints: ['Jendela punya 4 kotak kecil. Gambar satu kotak, lalu ulangi 4 kali — Agam berputar sendiri!'],
    shape: (k, X) => {
      const a = k < 5 ? 1 : 2;
      return [L(4, [...Ms(a), T(X), ...Ms(a), T(X), ...Ms(a), T(X), ...Ms(a)])];
    },
  },
  {
    name: 'plus',
    palette: ['maju', 'kiri', 'kanan', 'ulangi'],
    hints: ['Gambar tanda tambah (+). Satu lengan: maju, belok, maju, belok, maju, lalu belok ke arah lain.'],
    shape: (k, X, Y) => {
      const a = k < 5 ? 1 : 2;
      return [L(4, [...Ms(a), T(X), ...Ms(a), T(X), ...Ms(a), T(Y)])];
    },
  },
  {
    name: 'kincir',
    palette: ['maju', 'kiri', 'kanan', 'ulangi'],
    hints: ['Kincir angin: gambar satu baling-baling, lalu ulangi 4 kali!'],
    shape: (k, X, Y) => {
      const a = k < 5 ? 2 : 3;
      return [L(4, [...Ms(a), T(X), M(), T(X), ...Ms(a - 1), T(Y)])];
    },
  },
  {
    name: 'dua',
    palette: ['maju', 'kiri', 'kanan', 'ulangi'],
    hints: ['Gambarnya punya dua bagian. Pakai dua blok ulangi!'],
    shape: (k, X, Y) => {
      const a = [1, 2, 1, 2, 2, 1, 2, 2, 3, 2][k];
      return k < 5 ? [L(4, [...Ms(a), T(X)]), T(Y), L(3, [M()]), L(4, [T(Y), ...Ms(a)])] : [L(3, [M(), T(X), M(), T(Y)]), L(4, [...Ms(a), T(X)])];
    },
  },
  {
    name: 'karya',
    palette: ['maju', 'kiri', 'kanan', 'ulangi'],
    hints: ['Karya terakhir! Cari semua bagian yang berulang.'],
    shape: (k, X, Y) => {
      const n = [2, 2, 3, 3, 3, 2, 3, 3, 4, 4][k];
      return k < 5 ? [L(n, [T(X), M(), M(), T(Y), M(), T(Y), M(), M(), T(X), M()]), L(n < 3 ? 4 : 2, [M()])] : [L(n, [...Ms(2), T(X), M(), T(X), ...Ms(2), T(Y), M(), T(Y)]), L(2, [M()])];
    },
  },
];

export function buildUlangi(): UlangiLevel[] {
  const out: UlangiLevel[] = [];
  const seen = new Set<string>();
  for (let w = 0; w < 10; w++)
    for (let k = 0; k < 10; k++) {
      const n = w * 10 + k + 1;
      const rnd = mulberry(11 * 7919 + n * 104729);
      let got: UlangiLevel | null = null;
      for (let a = 0; a < 400 && !got; a++) {
        const X = rnd() < 0.5 ? 'kanan' : 'kiri';
        const Y = X === 'kanan' ? 'kiri' : 'kanan';
        const prog: Program = renumber({ main: ULANGI[w].shape(k, X, Y), jurus: [] });
        const acts = flatActs(prog);
        while (acts.length && acts[acts.length - 1] !== 'maju') acts.pop();
        const dir = n === 1 ? 1 : Math.floor(rnd() * 4);
        const { segs, pts } = traceSegments(acts, dir);
        const xs = pts.map((p) => p.x),
          ys = pts.map((p) => p.y);
        const minX = Math.min(...xs),
          minY = Math.min(...ys);
        const cols = Math.max(...xs) - minX + 1,
          rows = Math.max(...ys) - minY + 1;
        if (cols > MAXC || rows > MAXR) continue;
        // kanvas sedikit lebih besar dari gambar, gambar di tengah
        const C = Math.min(MAXC, Math.max(4, cols + 2)),
          R = Math.min(MAXR, Math.max(3, rows + 2));
        const ox = Math.floor((C - cols) / 2) - minX,
          oy = Math.floor((R - rows) / 2) - minY;
        const target = segs
          .map((s) => {
            const [p, q] = s.split(':').map((t) => t.split(',').map(Number));
            return `${p[0] + ox},${p[1] + oy}:${q[0] + ox},${q[1] + oy}`;
          })
          .sort();
        const key = `${C}x${R}|${target.join(' ')}|${dir}|${X}`;
        if (seen.has(key)) continue;
        const best = countBlocks(prog);
        const raw = acts.length;
        const limit = Math.max(best, Math.min(best + (w < 1 ? 0 : 1), raw - 1));
        seen.add(key);
        got = {
          id: `u${n}`,
          world: w,
          palette: ULANGI[w].palette,
          best,
          limit,
          hint: ULANGI[w].hints[Math.min(k, ULANGI[w].hints.length - 1)],
          solution: prog,
          cols: C,
          rows: R,
          start: { x: ox, y: oy },
          dir,
          target,
        };
      }
      if (!got) throw new Error(`u${n} gagal dibuat`);
      out.push(got);
    }
  return out;
}

/* ================= Kalau… ================= */

const K = {
  lari: () => A('lari'),
  lompat: () => A('lompat'),
  duck: () => A('merunduk'),
};
/** aturan: rintangan rendah & lubang → lompat, terbang → merunduk, kosong → lari */
function rule(kinds: Obst[]): Program {
  const jump = kinds.filter((k) => k !== 'fly');
  let els: Stmt[] = [K.lari()];
  if (kinds.includes('fly')) els = [S.if('fly', [K.duck()], els)];
  for (const j of [...jump].reverse()) els = [S.if(j, [K.lompat()], els)];
  return { main: [S.until(els)], jurus: [] };
}

const KALAU: { hints: string[]; plan: (k: number) => { kinds: Obst[]; len: number; count: [number, number] } }[] = [
  {
    hints: [
      'Blok baru: ULANGI SAMPAI FINIS! Agam terus mengulang isinya sampai tiba di garis finis.',
      'Lintasannya panjang, bloknya sedikit. Pakai ulangi sampai finis.',
      'Lintasannya panjang, bloknya sedikit. Pakai ulangi sampai finis.',
      'Blok baru: KALAU! Rintangannya berpindah tiap kali main. Kalau ada rintangan di depan, lompat. Kalau tidak, lari.',
      'Masukkan blok kalau ke dalam ulangi sampai finis.',
    ],
    plan: (k) => (k < 3 ? { kinds: [], len: [8, 10, 12][k], count: [0, 0] } : { kinds: ['low'], len: 10 + k, count: [1, 2 + (k >> 2)] }),
  },
  { hints: ['Awas lubang! Kalau ada lubang di depan, lompat.'], plan: (k) => ({ kinds: ['gap'], len: 12 + k, count: [2, 3] }) },
  { hints: ['Ada yang terbang setinggi kepala Agam! Kalau ada yang terbang di depan, merunduk.'], plan: (k) => ({ kinds: ['fly'], len: 12 + k, count: [2, 3] }) },
  { hints: ['Dua jenis rintangan! Yang di tanah dilompati, yang terbang dirunduki. Pakai kalau … kalau tidak.'], plan: (k) => ({ kinds: ['low', 'fly'], len: 14 + k, count: [3, 4] }) },
  { hints: ['Lubang dan yang terbang. Kalau lubang, lompat; kalau tidak, cek yang terbang.'], plan: (k) => ({ kinds: ['gap', 'fly'], len: 14 + k, count: [3, 4] }) },
  { hints: ['Tiga jenis rintangan sekaligus! Susun kalau di dalam kalau.'], plan: (k) => ({ kinds: ['low', 'gap', 'fly'], len: 16 + k, count: [3, 5] }) },
  { hints: ['Rintangannya makin banyak. Programmu tetap sama pendeknya, lho!'], plan: (k) => ({ kinds: ['low', 'gap', 'fly'], len: 18 + k, count: [4, 5] }) },
  { hints: ['Pikirkan dulu: rintangan mana dilompati, mana dirunduki?'], plan: (k) => ({ kinds: ['gap', 'low', 'fly'], len: 20 + k, count: [5, 6] }) },
  { hints: ['Lintasan panjang penuh rintangan. Satu program pintar untuk semuanya!'], plan: (k) => ({ kinds: ['fly', 'low', 'gap'], len: 22 + k, count: [5, 7] }) },
  { hints: ['Balapan terakhir! Kamu sudah jadi programmer yang pintar memilih.'], plan: (k) => ({ kinds: ['low', 'fly', 'gap'], len: 24 + k, count: [6, 8] }) },
];

export function buildKalau(): KalauLevel[] {
  const out: KalauLevel[] = [];
  for (let w = 0; w < 10; w++)
    for (let k = 0; k < 10; k++) {
      const n = w * 10 + k + 1;
      const { kinds, len, count } = KALAU[w].plan(k);
      const prog = renumber(kinds.length ? rule(kinds) : { main: [S.until([K.lari()])], jurus: [] });
      const best = countBlocks(prog);
      out.push({
        id: `c${n}`,
        world: w,
        palette: kinds.length ? ['lari', 'lompat', 'merunduk', 'sampai', 'kalau'] : ['lari', 'lompat', 'sampai'],
        best,
        limit: best + (w < 3 ? 2 : 1),
        hint: KALAU[w].hints[Math.min(k, KALAU[w].hints.length - 1)],
        solution: prog,
        kinds,
        len,
        count,
      });
    }
  return out;
}

/* ================= Jurus ================= */

type Combo = { jurus: string; main: string; moves: number };
const combos = (moves: number, list: string[]): Combo[] => list.map((s) => ({ jurus: s.split('|')[0], main: s.split('|')[1], moves }));
/** resep: jurus & program utama sebagai huruf (A–E = gerakan, J = panggil jurus, (n:…) = ulangi) */
const JURUS: { hints: string[]; list: Combo[]; palette: PBlock[] }[] = [
  { hints: ['Blok baru: JURUS ⚡! Susun gerakan di kotak Jurus, lalu panggil jurus di program utama.', 'Sensei mengulang gerakan yang sama. Jadikan jurus!'], palette: ['jurus'], list: combos(2, ['AAB|JJ', 'ABA|JJ', 'ABB|JJ', 'AAB|JJJ', 'ABA|JJJ', 'ABAB|JJ', 'AABB|JJ', 'ABB|JJJ', 'AABA|JJ', 'ABAA|JJJ']) },
  { hints: ['Gerakan baru: tangkis! Perhatikan urutan Sensei.'], palette: ['jurus'], list: combos(3, ['ABC|JJ', 'ACB|JJ', 'ABC|JJJ', 'AABC|JJ', 'ABCA|JJ', 'ABC|JCJ', 'ACB|JAJ', 'ABCC|JJ', 'ABCB|JJJ', 'AABC|JBJ']) },
  { hints: ['Gerakan baru: lompat! Ada gerakan lain di antara jurus.'], palette: ['jurus'], list: combos(4, ['ABD|JJ', 'ADB|JCJ', 'DAB|JJJ', 'ABCD|JJ', 'ABDD|JAJ', 'ADCB|JJ', 'ABCD|JDJ', 'DDAB|JJ', 'ABCD|JJJ', 'ADBC|JBJC']) },
  { hints: ['Gerakan baru: putar! Lima gerakan ninja lengkap.'], palette: ['jurus'], list: combos(5, ['AEB|JJ', 'EAB|JJJ', 'ABE|JCJ', 'AEBD|JJ', 'EDAB|JJ', 'ABCE|JEJ', 'AEEB|JJ', 'ABCDE|JJ', 'EABD|JCJD', 'ABCDE|JAJ']) },
  { hints: ['Jurusnya makin panjang. Susun sekali, pakai berkali-kali!'], palette: ['jurus'], list: combos(5, ['ABCDE|JJ', 'EDCBA|JJ', 'AABBC|JJ', 'ABCAB|JJ', 'ABCDE|JJJ', 'AEBDC|JAJ', 'ABCDE|JEJ', 'CABDE|JJB', 'ABACD|JJJ', 'ABCDE|JDJE']) },
  { hints: ['Blok ulangi kembali! Ulangi bisa dipakai di dalam jurus.'], palette: ['ulangi', 'jurus'], list: combos(5, ['(3:A)B|JJ', '(3:A)BC|JJ', 'A(3:B)|JJ', '(2:AB)C|JJ', '(4:A)B|JJ', '(3:A)BC|JDJ', 'A(3:B)C|JJ', '(2:AB)CD|JJ', '(4:A)BC|JJ', '(3:AB)C|JJ']) },
  { hints: ['Jurus juga bisa dipanggil di dalam ulangi!'], palette: ['ulangi', 'jurus'], list: combos(5, ['ABC|(3:J)', 'ABB|(3:J)', 'AAB|(4:J)', 'ABCD|(3:J)', 'ABC|(3:J)D', 'ABC|D(3:J)', 'ABCA|(3:J)', 'ABCD|(4:J)', 'ABC|(3:J)DD', 'ABCDE|(3:J)']) },
  { hints: ['Gabungkan ulangi di luar dan di dalam jurus.'], palette: ['ulangi', 'jurus'], list: combos(5, ['(3:A)B|(2:J)', '(2:AB)C|(3:J)', 'A(3:B)|(3:J)', '(3:A)BC|(3:J)', '(2:AB)CD|(2:J)E', 'A(4:B)|(2:J)C', '(3:A)B|(3:J)C', '(2:AB)C|(3:J)D', 'A(3:B)C|(3:J)', '(3:A)BC|(3:J)E']) },
  { hints: ['Rangkaian Sensei panjang sekali. Cari jurus yang paling hemat!'], palette: ['ulangi', 'jurus'], list: combos(5, ['ABCDE|(3:J)', 'AB(2:C)D|(3:J)', '(2:AB)CDE|(2:J)', 'ABCDE|J(2:A)J', 'A(3:B)CD|(3:J)', 'ABCDE|(2:J)CJ', '(2:ABC)D|(2:J)', 'A(2:BC)D|(3:J)', 'ABCDE|(4:J)', '(3:AB)CD|(2:J)E']) },
  { hints: ['Ujian sabuk hitam! Tunjukkan semua jurusmu.'], palette: ['ulangi', 'jurus'], list: combos(5, ['(2:ABC)DE|(3:J)', 'A(3:B)CDE|(3:J)', '(3:AB)CDE|(2:J)', 'ABCDE|(3:J)(2:A)', '(2:AB)(2:CD)E|(2:J)', 'A(4:B)CD|(3:J)', '(3:A)BCDE|(3:J)', '(2:ABC)(2:DE)|(2:J)', 'ABCDE|(4:J)B', '(3:AB)(2:CD)E|(3:J)']) },
];

/** "AB(3:C)J" → pernyataan, huruf dipetakan ke gerakan */
function parseSeq(src: string, map: Record<string, string>): Stmt[] {
  const out: Stmt[] = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (ch === '(') {
      const colon = src.indexOf(':', i);
      const close = src.indexOf(')', colon);
      out.push(L(Number(src.slice(i + 1, colon)), parseSeq(src.slice(colon + 1, close), map)));
      i = close + 1;
    } else {
      out.push(ch === 'J' ? S.call() : A(map[ch]));
      i++;
    }
  }
  return out;
}

export function buildJurus(): JurusLevel[] {
  const out: JurusLevel[] = [];
  const seen = new Set<string>();
  for (let w = 0; w < 10; w++)
    for (let k = 0; k < 10; k++) {
      const n = w * 10 + k + 1;
      const rnd = mulberry(23 * 7919 + n * 104729);
      const c = JURUS[w].list[k];
      let got: JurusLevel | null = null;
      for (let a = 0; a < 200 && !got; a++) {
        // gerakan yang sudah dikenal di Level ini, diacak urutannya
        const pool: string[] = [...MOVES.slice(0, c.moves)];
        for (let q = pool.length - 1; q > 0; q--) {
          const j = Math.floor(rnd() * (q + 1));
          [pool[q], pool[j]] = [pool[j], pool[q]];
        }
        const map: Record<string, string> = { A: pool[0], B: pool[1 % pool.length], C: pool[2 % pool.length], D: pool[3 % pool.length], E: pool[4 % pool.length] };
        const prog = renumber({ main: parseSeq(c.main, map), jurus: parseSeq(c.jurus, map) });
        const target = flatActs(prog) as MoveName[];
        if (seen.has(target.join(','))) continue;
        const best = countBlocks(prog);
        if (best >= target.length) throw new Error(`j${n}: jurus tidak menghemat (${best} ≥ ${target.length})`);
        seen.add(target.join(','));
        got = {
          id: `j${n}`,
          world: w,
          palette: [...MOVES.slice(0, Math.max(c.moves, 2)), ...JURUS[w].palette],
          best,
          limit: Math.max(best, Math.min(best + 1, target.length - 1)),
          hint: JURUS[w].hints[Math.min(k, JURUS[w].hints.length - 1)],
          solution: prog,
          target,
        };
      }
      if (!got) throw new Error(`j${n} gagal dibuat`);
      out.push(got);
    }
  return out;
}
