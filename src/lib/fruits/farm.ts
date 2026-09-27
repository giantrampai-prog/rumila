// Permainan Kebun Buah: bedengan tanam (biji → tunas → tanaman kecil → berbunga → berbuah, disiram tiap
// tahap), misi mencari buah dari tokoh petani, dan isi buah saat dibelah. Tanpa koin/skor: benih yang
// bisa ditanam = buah yang sudah ditemukan; hadiah misi = stiker di album.

import { FRUITS, FRUIT_BY_ID, type Fruit } from './catalog';
import { plantKind, type PlantKind } from './garden';

/* ---------------- bedengan tanam ---------------- */

export const STAGES = ['Biji', 'Tunas', 'Tanaman kecil', 'Berbunga', 'Berbuah'] as const;
/** lama tumbuh tiap tahap setelah disiram (detik) — total ±2 menit */
export const STAGE_SECONDS = [20, 25, 30, 30];
export const BED_COUNT = 6;

export interface Bed {
  fruit: string | null;
  stage: number;
  /** waktu (ms) mulai tumbuh setelah disiram; null = menunggu disiram */
  growSince: number | null;
}

export const emptyBed = (): Bed => ({ fruit: null, stage: 0, growSince: null });

/** Majukan tahap sesuai waktu berjalan (tanaman berhenti di tiap tahap sampai disiram lagi). */
export function advanceBed(b: Bed, now: number): Bed {
  if (!b.fruit || b.stage >= 4 || b.growSince === null) return b;
  if (now - b.growSince >= STAGE_SECONDS[b.stage] * 1000) return { ...b, stage: b.stage + 1, growSince: null };
  return b;
}

export function bedStatus(b: Bed, now: number) {
  const ripe = !!b.fruit && b.stage >= 4;
  const thirsty = !!b.fruit && !ripe && b.growSince === null;
  const growing = !!b.fruit && !ripe && b.growSince !== null;
  const left = growing ? Math.max(0, STAGE_SECONDS[b.stage] - (now - b.growSince!) / 1000) : 0;
  const progress = growing ? 1 - left / STAGE_SECONDS[b.stage] : 0;
  return { empty: !b.fruit, ripe, thirsty, growing, left, progress };
}

export const plantBed = (fruit: string): Bed => ({ fruit, stage: 0, growSince: null });
export const waterBed = (b: Bed, now: number): Bed => (b.fruit && b.stage < 4 && b.growSince === null ? { ...b, growSince: now } : b);

/* ---------------- misi mencari ---------------- */

export interface Mission {
  id: string;
  /** kalimat permintaan petani */
  text: string;
  icon: string;
  test: (f: Fruit, kind: PlantKind) => boolean;
}

const has = (s: string, ...w: string[]) => w.some((x) => s.toLowerCase().includes(x));

export const MISSIONS: Mission[] = [
  { id: 'kulit-merah', text: 'Tolong carikan buah yang kulitnya merah!', icon: 'palette', test: (f) => has(f.skin, 'merah') && !has(f.skin, 'merah muda') },
  { id: 'kulit-kuning', text: 'Tolong carikan buah yang kulitnya kuning!', icon: 'palette', test: (f) => has(f.skin, 'kuning') },
  { id: 'kulit-ungu', text: 'Adakah buah yang kulitnya ungu? Carikan, ya!', icon: 'palette', test: (f) => has(f.skin, 'ungu') },
  { id: 'kulit-cokelat', text: 'Carikan buah yang kulitnya cokelat!', icon: 'palette', test: (f) => has(f.skin, 'cokelat') },
  { id: 'berduri', text: 'Carikan buah yang kulitnya berduri atau berbulu!', icon: 'grain', test: (f) => ['durian', 'rambutan', 'soursop', 'jackfruit', 'pineapple', 'salak', 'kiwi', 'custard', 'lychee'].includes(f.shape) },
  { id: 'asam', text: 'Aku haus… carikan buah yang rasanya asam!', icon: 'sentiment_satisfied', test: (f) => has(f.taste, 'asam') },
  { id: 'manis', text: 'Carikan buah yang rasanya manis!', icon: 'sentiment_satisfied', test: (f) => has(f.taste, 'manis') && !has(f.taste, 'asam') },
  { id: 'palem', text: 'Carikan buah yang tumbuh di pohon palem!', icon: 'park', test: (_f, k) => k === 'palm' },
  { id: 'menjalar', text: 'Carikan buah yang tumbuh menjalar di atas tanah!', icon: 'grass', test: (_f, k) => k === 'vine' || k === 'pineapple' || k === 'bush' },
  { id: 'merambat', text: 'Carikan buah yang tumbuh merambat di para-para!', icon: 'fence', test: (_f, k) => k === 'trellis' },
  { id: 'nusantara', text: 'Carikan satu buah khas Nusantara!', icon: 'forest', test: (f) => f.group === 'nusantara' },
  { id: 'satu-biji', text: 'Carikan buah yang bijinya cuma satu!', icon: 'egg', test: (f) => has(f.seed, 'satu biji') },
  { id: 'banyak-biji', text: 'Carikan buah yang bijinya banyak sekali!', icon: 'scatter_plot', test: (f) => has(f.seed, 'banyak biji', 'ratusan', 'biji-biji', 'biji kecil') },
  { id: 'besar', text: 'Carikan buah yang ukurannya besar sekali!', icon: 'fitness_center', test: (f) => ['watermelon', 'jackfruit', 'durian', 'coconut', 'papaya', 'melon', 'pineapple'].includes(f.shape) || f.id === 'jeruk-bali' },
];

export const missionMatches = (m: Mission, f: Fruit) => m.test(f, plantKind(f));
/** Misi hanya dipakai bila ada ≥2 buah yang cocok (anak selalu bisa menemukan jawabannya). */
export const PLAYABLE_MISSIONS = MISSIONS.filter((m) => FRUITS.filter((f) => missionMatches(m, f)).length >= 2);

export function nextMission(lastIds: string[]): Mission {
  const pool = PLAYABLE_MISSIONS.filter((m) => !lastIds.includes(m.id));
  const list = pool.length ? pool : PLAYABLE_MISSIONS;
  return list[Math.floor(Math.random() * list.length)];
}

/* ---------------- isi buah saat dibelah ---------------- */

export type SeedStyle = 'pit' | 'core' | 'segments' | 'cavity' | 'specks' | 'ring' | 'arils' | 'bulbs' | 'star' | 'hollow' | 'banana' | 'pineapple' | 'scattered';

export interface Section {
  flesh: string;
  /** lapisan di bawah kulit (albedo/putih jeruk, sabut kelapa, dll.) */
  rind: string;
  seed: string;
  style: SeedStyle;
}

const BY_ID: Record<string, Partial<Section>> = {
  pisang: { flesh: '#fbeec6', style: 'banana', seed: '#8a6a3a' },
  mangga: { flesh: '#ffb62e', style: 'pit', seed: '#f4e2b2' },
  jeruk: { flesh: '#ffa326', style: 'segments', rind: '#fff1d8' },
  apel: { flesh: '#fbf3dc', style: 'core', seed: '#5a3a1e' },
  semangka: { flesh: '#f2455a', style: 'scattered', seed: '#1a1a1a', rind: '#e9f3c9' },
  melon: { flesh: '#d6efa0', style: 'cavity', seed: '#efe1b2' },
  pepaya: { flesh: '#ff8a3d', style: 'cavity', seed: '#1d1a1a' },
  nanas: { flesh: '#ffd84a', style: 'pineapple' },
  anggur: { flesh: '#d7eec0', style: 'pit', seed: '#6b8a3a' },
  stroberi: { flesh: '#f25a5a', style: 'core', seed: '#fbe0e0' },
  alpukat: { flesh: '#d9eb8a', style: 'pit', seed: '#8a5a2e', rind: '#8fbf4a' },
  kelapa: { flesh: '#fbfbf5', style: 'hollow', rind: '#9a6a3a' },
  durian: { flesh: '#f7d86a', style: 'bulbs', seed: '#b98a4a', rind: '#e6e0b6' },
  rambutan: { flesh: '#f6f6ee', style: 'pit', seed: '#9a6a3a' },
  manggis: { flesh: '#fbfaf5', style: 'segments', rind: '#8a2a4a' },
  salak: { flesh: '#f6ecd0', style: 'segments', seed: '#5a3a1e' },
  'buah-naga': { flesh: '#fbfbf8', style: 'specks', seed: '#141414' },
  kiwi: { flesh: '#9ccf3f', style: 'ring', seed: '#141414' },
  delima: { flesh: '#f7e6d0', style: 'arils', seed: '#c9213a' },
  'jambu-biji': { flesh: '#ff9fb6', style: 'cavity', seed: '#f3e1c0' },
  sirsak: { flesh: '#fbfbf5', style: 'scattered', seed: '#1d1a1a' },
  srikaya: { flesh: '#fbf7ea', style: 'scattered', seed: '#2a1f1a' },
  nangka: { flesh: '#ffd23f', style: 'bulbs', seed: '#e6d7b0' },
  cempedak: { flesh: '#ffb640', style: 'bulbs', seed: '#e6d7b0' },
  belimbing: { flesh: '#f3de5a', style: 'star', seed: '#a8783a' },
  markisa: { flesh: '#ffc94a', style: 'arils', seed: '#1d1a1a' },
  'jeruk-bali': { flesh: '#ff9aa6', style: 'segments', rind: '#fff4e4' },
  'jeruk-nipis': { flesh: '#cfe88a', style: 'segments', rind: '#f4f6de' },
  lemon: { flesh: '#fbe872', style: 'segments', rind: '#fdf8e0' },
  duku: { flesh: '#f5f5ee', style: 'segments', seed: '#6b8a3a' },
  langsat: { flesh: '#f5f5ee', style: 'segments', seed: '#6b8a3a' },
  lengkeng: { flesh: '#f5f5ee', style: 'pit', seed: '#2a1a12' },
  leci: { flesh: '#f7f5f0', style: 'pit', seed: '#5a3a1e' },
  matoa: { flesh: '#f5f5ee', style: 'pit', seed: '#3a2a1a' },
  sawo: { flesh: '#c99a66', style: 'core', seed: '#1d1a1a' },
  kurma: { flesh: '#c98a4a', style: 'pit', seed: '#e0c8a0' },
  persik: { flesh: '#ffc56a', style: 'pit', seed: '#9a3a2e' },
  plum: { flesh: '#f7c14a', style: 'pit', seed: '#9a6a3a' },
  ceri: { flesh: '#b8182e', style: 'pit', seed: '#e6d0b0' },
  kesemek: { flesh: '#ff9f3a', style: 'star', seed: '#7a4a2a' },
  pir: { flesh: '#fbf6e2', style: 'core', seed: '#5a3a1e' },
  blewah: { flesh: '#ffb56a', style: 'cavity', seed: '#efe1b2' },
  'terong-belanda': { flesh: '#ff8a4a', style: 'scattered', seed: '#3a1a14' },
  kedondong: { flesh: '#f4f0c8', style: 'pit', seed: '#c8b070' },
  jamblang: { flesh: '#b07ab8', style: 'pit', seed: '#6b4a2a' },
  'jambu-air': { flesh: '#fbf8f2', style: 'cavity', seed: '#c8a888' },
  'jambu-bol': { flesh: '#fbf8f2', style: 'pit', seed: '#c8a888' },
  cermai: { flesh: '#f2f0c0', style: 'pit', seed: '#c8b070' },
};

export function sectionOf(f: Fruit): Section {
  const o = BY_ID[f.id] ?? {};
  return { flesh: o.flesh ?? '#f7ecd0', rind: o.rind ?? f.color, seed: o.seed ?? '#5a3a1e', style: o.style ?? 'pit' };
}

export const fruitName = (id: string) => FRUIT_BY_ID.get(id)?.name ?? id;
