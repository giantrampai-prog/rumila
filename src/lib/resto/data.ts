// Konten & parameter awal Rinoya Resto – Autentik Jepang (PRD v1.1). Semua angka dalam Koin Resto (fiktif)
// dan merupakan balancing awal, bukan biaya restoran nyata. Bahan disimpan dalam "unit" bilangan bulat;
// harga dasar 1 koin per unit sehingga biaya resep mudah dihitung anak.

export type Segment = 'pelajar' | 'pekerja' | 'keluarga';
export type Station = 'goreng' | 'kompor' | 'sushi' | 'minum';
export type Role = 'kasir' | 'koki' | 'pelayan' | 'kebersihan';

export const SEGMENT_NAME: Record<Segment, string> = { pelajar: 'Pelajar', pekerja: 'Pekerja', keluarga: 'Keluarga' };

export interface Location {
  id: string;
  name: string;
  rent: number;
  deposit: number;
  maxSeats: number;
  mix: Record<Segment, number>;
  /** kedatangan dasar per 30 menit virtual, jam 10.00 … 15.30 (12 interval) */
  base: number[];
  note: string;
  npc: string;
}

export const LOCATIONS: Location[] = [
  {
    id: 'sekolah',
    name: 'Dekat sekolah',
    rent: 180,
    deposit: 1800,
    maxSeats: 32,
    mix: { pelajar: 0.55, pekerja: 0.1, keluarga: 0.35 },
    base: [2, 3, 5, 8, 9, 7, 5, 6, 8, 7, 4, 3],
    note: 'Peka harga, ramai saat jam pulang sekolah. Porsi & pelayanan harus pas.',
    npc: '“Anak-anak suka jajan onigiri & minuman dingin sepulang sekolah!” — Bu Kantin',
  },
  {
    id: 'kantor',
    name: 'Area perkantoran',
    rent: 260,
    deposit: 2600,
    maxSeats: 40,
    mix: { pelajar: 0.05, pekerja: 0.8, keluarga: 0.15 },
    base: [2, 4, 9, 12, 11, 6, 3, 2, 2, 2, 2, 1],
    note: 'Makan siang singkat — kecepatan & paket penting.',
    npc: '“Jam istirahat cuma sebentar, yang cepat disajikan pasti laris.” — Pak Satpam',
  },
  {
    id: 'perumahan',
    name: 'Lingkungan perumahan',
    rent: 140,
    deposit: 1400,
    maxSeats: 24,
    mix: { pelajar: 0.2, pekerja: 0.1, keluarga: 0.7 },
    base: [2, 2, 4, 6, 5, 4, 3, 3, 4, 5, 5, 4],
    note: 'Pelanggan setia kembali lagi bila ramah & konsisten.',
    npc: '“Keluarga di sini suka makan ramen bersama di akhir pekan.” — Bu RT',
  },
];

export interface Contractor {
  id: string;
  name: string;
  cost: number;
  days: number;
  quality: number;
  warranty: number;
  note: string;
}

export const CONTRACTORS: Contractor[] = [
  { id: 'hemat', name: 'Tukang Hemat', cost: 5000, days: 4, quality: 60, warranty: 1, note: 'Paling murah, paling lama, hasil cukup.' },
  { id: 'standar', name: 'Karya Standar', cost: 7000, days: 3, quality: 80, warranty: 3, note: 'Harga & hasil seimbang.' },
  { id: 'cepat', name: 'Kilat Bangun', cost: 9000, days: 2, quality: 85, warranty: 3, note: 'Paling cepat & rapi, paling mahal.' },
];

export type Ingredient = 'nasi' | 'ayam' | 'panko' | 'saus' | 'nori' | 'tuna' | 'mi' | 'kaldu' | 'telur' | 'daunbawang' | 'kulitgyoza' | 'kol' | 'timun' | 'teh' | 'susu';

export const INGREDIENT_NAME: Record<Ingredient, string> = {
  nasi: 'Nasi Jepang',
  ayam: 'Ayam',
  panko: 'Tepung panko',
  saus: 'Saus katsu',
  nori: 'Nori (rumput laut)',
  tuna: 'Tuna matang',
  mi: 'Mi ramen',
  kaldu: 'Kaldu shoyu',
  telur: 'Telur',
  daunbawang: 'Daun bawang',
  kulitgyoza: 'Kulit gyoza',
  kol: 'Kol',
  timun: 'Timun',
  teh: 'Teh hijau',
  susu: 'Susu',
};

export interface Menu {
  id: string;
  name: string;
  jp: string;
  emoji: string;
  recipe: Partial<Record<Ingredient, number>>;
  station: Station;
  /** menit virtual memasak oleh koki dengan kecepatan 50 */
  cook: number;
  price: number;
  fit: Record<Segment, number>;
  desc: string;
}

export const MENUS: Menu[] = [
  { id: 'katsu', name: 'Chicken katsu don', jp: 'チキンかつ丼', emoji: '🍛', recipe: { nasi: 8, ayam: 20, panko: 4, saus: 3 }, station: 'goreng', cook: 6, price: 80, fit: { pelajar: 1.0, pekerja: 1.2, keluarga: 1.0 }, desc: 'Nasi dengan ayam goreng tepung renyah dan saus katsu.' },
  { id: 'onigiri', name: 'Onigiri', jp: 'おにぎり', emoji: '🍙', recipe: { nasi: 6, nori: 3, tuna: 8 }, station: 'sushi', cook: 3, price: 40, fit: { pelajar: 1.2, pekerja: 0.9, keluarga: 0.8 }, desc: 'Nasi kepal segitiga berbalut nori, isi tuna matang.' },
  { id: 'ramen', name: 'Ramen shoyu', jp: '醤油ラーメン', emoji: '🍜', recipe: { mi: 10, kaldu: 12, telur: 5, daunbawang: 2 }, station: 'kompor', cook: 7, price: 75, fit: { pelajar: 0.9, pekerja: 1.0, keluarga: 1.2 }, desc: 'Mi ramen dalam kaldu kecap asin, telur & daun bawang.' },
  { id: 'gyoza', name: 'Gyoza', jp: '餃子', emoji: '🥟', recipe: { kulitgyoza: 6, ayam: 8, kol: 3 }, station: 'kompor', cook: 5, price: 45, fit: { pelajar: 1.0, pekerja: 1.0, keluarga: 1.1 }, desc: 'Pangsit isi ayam & kol, dikukus lalu dipanggang.' },
  { id: 'maki', name: 'Sushi roll (maki)', jp: '巻き寿司', emoji: '🍣', recipe: { nasi: 8, nori: 3, timun: 3, telur: 5 }, station: 'sushi', cook: 5, price: 55, fit: { pelajar: 0.9, pekerja: 1.0, keluarga: 1.1 }, desc: 'Gulungan nasi & nori isi timun dan tamago (telur dadar manis).' },
  { id: 'ocha', name: 'Ocha / matcha latte', jp: 'お茶', emoji: '🍵', recipe: { teh: 4, susu: 6 }, station: 'minum', cook: 2, price: 30, fit: { pelajar: 1.2, pekerja: 1.0, keluarga: 1.0 }, desc: 'Teh hijau dingin atau matcha dengan susu.' },
];

export const recipeCost = (m: Menu, mult = 1) => Object.values(m.recipe).reduce((a, q) => a + Math.round((q ?? 0) * mult), 0);

export interface Equipment {
  id: string;
  name: string;
  cost: number;
  station?: Station;
  note: string;
}

export const EQUIPMENT: Equipment[] = [
  { id: 'ricecooker', name: 'Rice cooker besar', cost: 800, note: 'Wajib untuk menu bernasi.' },
  { id: 'goreng', name: 'Penggorengan katsu', cost: 1500, station: 'goreng', note: 'Untuk chicken katsu.' },
  { id: 'kompor', name: 'Kompor & panci kaldu', cost: 1500, station: 'kompor', note: 'Untuk ramen & gyoza.' },
  { id: 'sushi', name: 'Meja sushi', cost: 1200, station: 'sushi', note: 'Untuk onigiri & sushi roll.' },
  { id: 'minum', name: 'Stasiun minuman', cost: 700, station: 'minum', note: 'Untuk ocha & matcha.' },
  { id: 'kasir', name: 'Meja kasir', cost: 600, note: 'Wajib untuk menerima pembayaran.' },
  { id: 'kulkas', name: 'Kulkas bahan', cost: 1000, note: 'Wajib: tempat menyimpan bahan (kapasitas 3.000 unit).' },
];

export const STORAGE_CAP = 3000;
export const TABLE_COST = 250; // meja + 4 kursi
export const DECOR = [
  { id: 'polos', name: 'Sederhana', cost: 0, appeal: 1.0, note: 'Tanpa hiasan tambahan.' },
  { id: 'kedai', name: 'Kedai ramen tradisional', cost: 1000, appeal: 1.05, note: 'Noren, lampion merah, kayu gelap.' },
  { id: 'taman', name: 'Taman Jepang', cost: 2000, appeal: 1.08, note: 'Bambu, batu, kolam koi mini, tatami.' },
] as const;

export interface Vendor {
  id: string;
  name: string;
  mult: number;
  quality: number;
  min: number;
  /** berapa hari bahan bisa dipakai setelah diterima */
  shelf: number;
  sameDay: boolean;
  note: string;
}

export const VENDORS: Vendor[] = [
  { id: 'hemat', name: 'Pasar Hemat', mult: 0.9, quality: 65, min: 500, shelf: 2, sameDay: false, note: 'Murah, mutu cukup, cepat kedaluwarsa.' },
  { id: 'segar', name: 'Segar Andal (bahan Jepang)', mult: 1.0, quality: 85, min: 800, shelf: 3, sameDay: false, note: 'Mutu konsisten, belanja minimum lebih besar.' },
  { id: 'kilat', name: 'Kilat', mult: 1.25, quality: 80, min: 200, shelf: 2, sameDay: true, note: 'Datang hari ini juga, tapi lebih mahal.' },
];

export interface Candidate {
  id: string;
  name: string;
  role: Role;
  speed: number;
  accuracy: number;
  friendly: number;
  clean: number;
  wage: number;
}

export const ROLE_NAME: Record<Role, string> = { kasir: 'Kasir', koki: 'Koki', pelayan: 'Pelayan', kebersihan: 'Kebersihan' };
export const ROLE_EMOJI: Record<Role, string> = { kasir: '🧾', koki: '👨‍🍳', pelayan: '🍱', kebersihan: '🧹' };

export const CANDIDATES: Candidate[] = [
  { id: 'c1', name: 'Dina', role: 'kasir', speed: 60, accuracy: 55, friendly: 70, clean: 50, wage: 140 },
  { id: 'c2', name: 'Raka', role: 'kasir', speed: 45, accuracy: 70, friendly: 55, clean: 50, wage: 120 },
  { id: 'c3', name: 'Kenji', role: 'koki', speed: 65, accuracy: 60, friendly: 50, clean: 55, wage: 180 },
  { id: 'c4', name: 'Sari', role: 'koki', speed: 50, accuracy: 70, friendly: 55, clean: 60, wage: 160 },
  { id: 'c5', name: 'Yuki', role: 'pelayan', speed: 60, accuracy: 55, friendly: 70, clean: 55, wage: 130 },
  { id: 'c6', name: 'Bima', role: 'pelayan', speed: 70, accuracy: 50, friendly: 50, clean: 50, wage: 120 },
  { id: 'c7', name: 'Ayu', role: 'kebersihan', speed: 55, accuracy: 50, friendly: 55, clean: 70, wage: 110 },
  { id: 'c8', name: 'Joko', role: 'kebersihan', speed: 65, accuracy: 45, friendly: 50, clean: 55, wage: 100 },
];

export const TRAINING_COST = 150;
export const TRAIN_ATTR: Record<Role, 'accuracy' | 'speed' | 'friendly' | 'clean'> = { kasir: 'accuracy', koki: 'speed', pelayan: 'friendly', kebersihan: 'clean' };
export const TRAINING_NAME: Record<Role, string> = {
  kasir: 'Kasir & ketelitian: cocokkan pesanan dan kembalian',
  koki: 'Resep & dapur: urutan persiapan yang rapi',
  pelayan: 'Pelayanan: sapa “Irasshaimase!” & tanggapi keluhan',
  kebersihan: 'Kebersihan: pisahkan bahan & cuci peralatan',
};

export interface Channel {
  id: string;
  name: string;
  cost: number;
  reach: number;
  seg: Record<Segment, number>;
}

export const CHANNELS: Channel[] = [
  { id: 'selebaran', name: 'Selebaran sekitar', cost: 100, reach: 400, seg: { pelajar: 0.6, pekerja: 0.4, keluarga: 0.8 } },
  { id: 'papan', name: 'Papan promo depan', cost: 150, reach: 600, seg: { pelajar: 0.8, pekerja: 0.7, keluarga: 0.7 } },
  { id: 'medsos', name: 'Media sosial (fiktif)', cost: 250, reach: 900, seg: { pelajar: 0.9, pekerja: 0.8, keluarga: 0.5 } },
];

export const START_CASH = 30000;
export const UTILITY = 120;
export const GRANT = 3000;
/** jam buka 10.00–16.00 = 12 interval 30 menit; 1× = 30 detik nyata per interval (6 menit per hari) */
export const INTERVAL_MIN = 30;
export const INTERVALS = 12;
export const REAL_SECONDS_PER_MIN = 1;
