// Level game "Langkah" (konsep: urutan perintah). Kebun 1–5, Pantai 6–10, Luar Angkasa 11–15.
// Peta: . kosong · # batu/asteroid · ~ air · S mulai · G bintang tujuan. dir: 0 atas, 1 kanan, 2 bawah, 3 kiri.

import type { Level } from './engine';

export const LANGKAH: Level[] = [
  { id: 'l1', theme: 'kebun', dir: 1, blocks: ['maju'], map: ['......', '......', 'S...G.', '......'], hint: 'Ketuk blok Maju sampai Robi tiba di bintang, lalu tekan Jalankan.' },
  { id: 'l2', theme: 'kebun', dir: 0, blocks: ['maju'], map: ['...G..', '......', '......', '...S..'], hint: 'Robi menghadap ke atas. Berapa kali Robi harus maju?' },
  { id: 'l3', theme: 'kebun', dir: 0, blocks: ['maju', 'kanan'], map: ['....G', '.....', '.....', 'S....'], hint: 'Belok kanan membuat Robi berputar di tempat, belum berjalan.' },
  { id: 'l4', theme: 'kebun', dir: 0, blocks: ['maju', 'kiri', 'kanan'], map: ['G.....', '......', '...#..', '...S..'], hint: 'Ada batu di depan! Coba belok kiri dulu.' },
  { id: 'l5', theme: 'kebun', dir: 2, blocks: ['maju', 'kiri', 'kanan'], map: ['S.#...', '..#.#.', '....#G', '###...'], hint: 'Hitung kotaknya satu per satu. Jari boleh ikut menunjuk.' },
  { id: 'l6', theme: 'pantai', dir: 1, blocks: ['maju', 'kiri', 'kanan'], map: ['~~~~~~', 'S....~', '~~~~.~', '~G...~', '~~~~~~'], hint: 'Robi tidak bisa berenang. Ikuti jalan pasir.' },
  { id: 'l7', theme: 'pantai', dir: 0, blocks: ['maju', 'kiri', 'kanan'], map: ['G.~...', '.~~.#.', '...~..', '#.....', '..S~~.'], hint: 'Cari jalan yang tidak melewati air.' },
  { id: 'l8', theme: 'pantai', dir: 1, blocks: ['maju', 'kiri', 'kanan'], map: ['~~~~~~~', '~S.#..~', '~.~#.~~', '~...G.~', '~~~~~~~'], hint: 'Jalan terdekat tertutup batu. Coba jalan memutar.' },
  { id: 'l9', theme: 'pantai', dir: 1, blocks: ['maju', 'kiri', 'kanan'], map: ['S.~....', '~.~.~..', '~...~G.', '~~~~~~~'], hint: 'Jalannya berkelok. Susun sedikit demi sedikit, lalu coba jalankan.' },
  { id: 'l10', theme: 'pantai', dir: 0, blocks: ['maju', 'kiri', 'kanan'], map: ['....~~G', '.~~.~..', '.~..~.#', '.~.~~..', 'S......'], hint: 'Ada banyak jalan. Bisakah kamu cari yang paling pendek?' },
  { id: 'l11', theme: 'angkasa', dir: 0, blocks: ['maju', 'kiri', 'kanan'], map: ['......G', '.#####.', '.#...#.', '.#.#.#.', 'S..#...'], hint: 'Asteroid menghalangi. Lewat pinggir saja.' },
  { id: 'l12', theme: 'angkasa', dir: 2, blocks: ['maju', 'kiri', 'kanan'], map: ['S#.....', '.#.###.', '.#...#.', '.###.#G', '.......'], hint: 'Robi menghadap ke bawah. Kanan dan kiri Robi jadi terbalik, lho!' },
  { id: 'l13', theme: 'angkasa', dir: 0, blocks: ['maju', 'kiri', 'kanan'], map: ['..#..G.', '.....#.', '#.#....', '..#.##.', 'S.#....'], hint: 'Bayangkan kamu adalah Robi. Ke mana tangan kananmu?' },
  { id: 'l14', theme: 'angkasa', dir: 0, blocks: ['maju', 'kiri', 'kanan'], map: ['G.#....', '.##.##.', '...#...', '#.##.#.', '...S#..'], hint: 'Level sulit! Jalankan sedikit demi sedikit untuk mengecek.' },
  { id: 'l15', theme: 'angkasa', dir: 1, blocks: ['maju', 'kiri', 'kanan'], map: ['S.....#', '####.##', 'G..#...', '.##...#', '....#..'], hint: 'Level terakhir! Kamu pasti bisa, penjelajah koding.' },
];
