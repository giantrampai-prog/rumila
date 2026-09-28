// Soal Coding Agam · Jurus (Dojo Ninja) untuk usia 3–8 tahun. Anak meniru rangkaian gerakan Sensei dengan
// mengetuk tombol gerakan; Agam langsung bergerak (tanpa menyusun program lebih dulu).
// Tiga tahap, masing-masing dikenalkan pelan-pelan:
//   Level 1–3  "tiru"  : ketuk gerakan satu per satu (2 → 4 jenis gerakan, 2 → 7 gerakan).
//   Level 4–5  "kartu" : Sensei memberi KARTU JURUS yang sudah jadi (satu ketukan = beberapa gerakan). Rangkaian
//                        Sensei berisi jurus itu beberapa kali — makin sering kartu dipakai, makin sedikit ketukan.
//   Level 6–10 "rekam" : anak MEREKAM jurusnya sendiri (tekan Rekam, peragakan, Selesai), lalu memakainya.
//                        Level 8–10 memakai dua kartu; bagian yang berulang ditandai kurung di gulungan
//                        (Level 10 tanpa tanda, anak mencari sendiri).
// Bintang: 3 = tanpa salah & ketukan paling hemat; 2 = sedikit salah atau ketukan lebih; 1 = selebihnya.
// Soal dibuat dari acakan tetap (hasil selalu sama).

import { MOVES, type MoveName } from './worlds';

export type JurusMode = 'tiru' | 'kartu' | 'rekam';

export interface JurusCard {
  /** gerakan dalam kartu (untuk mode kartu sudah terisi; untuk mode rekam = kunci jawaban) */
  moves: MoveName[];
  /** kartu diberikan Sensei (true) atau direkam anak (false) */
  given: boolean;
}

export interface JurusSoal {
  id: string;
  world: number;
  mode: JurusMode;
  /** tombol gerakan yang tersedia */
  moves: MoveName[];
  /** rangkaian gerakan Sensei */
  target: MoveName[];
  cards: JurusCard[];
  /** potongan rangkaian yang merupakan kartu ke-c: [awal, panjang, c] (untuk tanda kurung) */
  groups: [number, number, number][];
  /** tampilkan tanda kurung di gulungan */
  showGroups: boolean;
  /** ketukan paling hemat */
  best: number;
  /** kalimat pembuka Agam (pendek) */
  say: string;
}

function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

/** rangkaian acak tanpa 3 gerakan sama berturut-turut, memakai semua gerakan yang tersedia bila cukup panjang */
function randomSeq(r: () => number, pool: MoveName[], len: number): MoveName[] {
  for (let t = 0; t < 50; t++) {
    const out: MoveName[] = [];
    while (out.length < len) {
      const m = pool[Math.floor(r() * pool.length)];
      if (out.length >= 2 && out[out.length - 1] === m && out[out.length - 2] === m) continue;
      out.push(m);
    }
    if (len < pool.length || pool.every((m) => out.includes(m))) return out;
  }
  return pool.slice(0, len);
}

/** resep rangkaian untuk kartu: J/K = kartu 1/2, x = satu gerakan lepas */
const CARD_RECIPES: Record<number, string[]> = {
  3: ['JJ', 'JJ', 'JxJ', 'JJ', 'JJx', 'xJJ', 'JJJ', 'JxJ', 'JJx', 'JxJJ'],
  4: ['JJ', 'JxJ', 'JJJ', 'xJJ', 'JxJx', 'JJJ', 'JxJJ', 'xJxJ', 'JJxJ', 'JJJJ'],
  5: ['JJ', 'JJ', 'JxJ', 'JJx', 'JJJ', 'xJJ', 'JxJ', 'JJJ', 'JxJx', 'JJxJ'],
  6: ['JJ', 'JxJ', 'JJJ', 'JJx', 'xJJ', 'JxJJ', 'JJJ', 'xJxJ', 'JJxJ', 'JJJJ'],
  7: ['JJ', 'JxJ', 'JJJ', 'JxJx', 'xJJx', 'JJxJ', 'JxJJ', 'JJJ', 'xJxJx', 'JJJx'],
  8: ['JK', 'JJK', 'JKJ', 'KJJ', 'JKK', 'JKJK', 'JJKK', 'KJKJ', 'JKxJ', 'JJKJ'],
  9: ['JKJK', 'JJKK', 'JKKJ', 'KJJK', 'JKJKx', 'JxKJK', 'JJKJ', 'KKJJ', 'JKJJK', 'JKJKJ'],
};

export function buildJurusSoal(): JurusSoal[] {
  const out: JurusSoal[] = [];
  for (let w = 0; w < 10; w++)
    for (let k = 0; k < 10; k++) {
      const n = w * 10 + k + 1;
      const r = rng(n * 7919 + 31);
      const id = `jr${n}`;
      if (w < 3) {
        const pool = MOVES.slice(0, w + 2) as MoveName[];
        const len = [2, 2, 3, 3, 4, 4, 5, 5, 6, 7][k] + (w > 0 ? 1 : 0);
        const target = randomSeq(r, pool, Math.min(len, 8));
        const say =
          n === 1
            ? 'Tiru Sensei! Ketuk gerakan yang sama.'
            : k === 0 && w === 1
              ? 'Gerakan baru: TANGKIS!'
              : k === 0 && w === 2
                ? 'Gerakan baru: LOMPAT!'
                : 'Lihat gulungan, lalu tiru Sensei.';
        out.push({ id, world: w, mode: 'tiru', moves: pool, target, cards: [], groups: [], showGroups: false, best: target.length, say });
        continue;
      }
      const pool = MOVES.slice(0, w >= 4 ? 5 : 4) as MoveName[];
      const recipe = CARD_RECIPES[Math.min(w, 9)][k];
      const two = recipe.includes('K');
      const clen = w < 5 ? 3 : w < 7 ? 3 + (k >= 5 ? 1 : 0) : 3 + (k >= 6 ? 1 : 0);
      const cardJ = randomSeq(r, pool, clen);
      let cardK = randomSeq(r, pool, two ? Math.max(2, clen - 1) : 0);
      for (let t = 0; two && t < 20 && cardK.join() === cardJ.slice(0, cardK.length).join(); t++) cardK = randomSeq(r, pool, cardK.length);
      const target: MoveName[] = [];
      const groups: [number, number, number][] = [];
      for (const ch of recipe) {
        if (ch === 'x') target.push(pool[Math.floor(r() * pool.length)]);
        else {
          const c = ch === 'J' ? cardJ : cardK;
          groups.push([target.length, c.length, ch === 'J' ? 0 : 1]);
          target.push(...c);
        }
      }
      const mode: JurusMode = w < 5 ? 'kartu' : 'rekam';
      const cards: JurusCard[] = [{ moves: cardJ, given: mode === 'kartu' }];
      if (two) cards.push({ moves: cardK, given: false });
      // ketukan hemat: setiap kartu 1 ketukan (merekam tidak dihitung), gerakan lepas 1 ketukan
      const best = [...recipe].length;
      const say =
        w === 3 && k === 0
          ? 'Sensei memberimu KARTU JURUS! Satu ketukan = banyak gerakan.'
          : w === 5 && k === 0
            ? 'Sekarang REKAM jurusmu sendiri! Tekan Rekam, lakukan gerakannya, lalu Selesai.'
            : w === 7 && k === 0
              ? 'Ada DUA jurus! Rekam dua kartu.'
              : w === 9 && k === 0
                ? 'Ujian sabuk hitam: cari sendiri bagian yang berulang!'
                : mode === 'kartu'
                  ? 'Pakai kartu jurus supaya cepat!'
                  : 'Rekam jurus yang berulang, lalu pakai kartunya.';
      out.push({ id, world: w, mode, moves: pool, target, cards, groups, showGroups: w < 9, best, say });
    }
  return out;
}

export const JURUS_SOAL: JurusSoal[] = buildJurusSoal();

/** bintang dari jumlah salah & ketukan */
export function jurusStars(s: JurusSoal, mistakes: number, taps: number) {
  if (mistakes === 0 && taps <= s.best) return 3;
  if (mistakes <= 2 && taps <= s.best + 3) return 2;
  return 1;
}
