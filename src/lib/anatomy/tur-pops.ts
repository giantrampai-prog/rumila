// Kartu info pop-up & gerak 3D untuk tiap adegan tur Jelajah Tubuh.
// `at` = saat kartu muncul (0…1 dari lamanya adegan), selaras dengan kalimat narasi di tur.ts.
// `big` = angka besar yang ditonjolkan. `fx` = emoji kecil yang melayang di latar.
// `motion` = gerak organ di 3D (lihat engine.ts setMotion).

import type { MotionKind } from '@/components/anatomy/engine';

export interface TurPop {
  at: number;
  emoji: string;
  text: string;
  big?: string;
}

export interface TurExtra {
  pops: TurPop[];
  fx?: string[];
  motion: { kind: MotionKind; ids?: string[]; layer?: string };
}

export const TUR_EXTRA: Record<string, TurExtra> = {
  pembuka: {
    pops: [
      { at: 0.05, emoji: '👋', text: 'Halo, penjelajah!' },
      { at: 0.5, emoji: '⚙️', text: 'Tubuh bagaikan mesin hebat' },
      { at: 0.78, emoji: '😴', text: 'Tetap bekerja saat kita tidur' },
    ],
    fx: ['✨', '⭐'],
    motion: { kind: 'none' },
  },
  kulit: {
    pops: [
      { at: 0.05, emoji: '🏆', text: 'Organ terbesar di tubuh' },
      { at: 0.45, emoji: '🛡️', text: 'Melindungi dari kuman' },
      { at: 0.62, emoji: '🌡️', text: 'Menjaga suhu tubuh' },
      { at: 0.8, emoji: '✋', text: 'Merasakan sentuhan, panas & dingin' },
    ],
    fx: ['🦠'],
    motion: { kind: 'none' },
  },
  otot: {
    pops: [
      { at: 0.08, emoji: '💪', big: '600+', text: 'otot di tubuh kita' },
      { at: 0.5, emoji: '🦴', text: 'Otot menarik tulang' },
      { at: 0.68, emoji: '🏃', text: 'Berjalan & melompat' },
      { at: 0.84, emoji: '😊', text: 'Tersenyum & berkedip' },
    ],
    fx: ['💪'],
    motion: { kind: 'flex', layer: 'muscle' },
  },
  tulang: {
    pops: [
      { at: 0.08, emoji: '🦴', big: '206', text: 'tulang orang dewasa' },
      { at: 0.45, emoji: '👶', big: '±300', text: 'tulang bayi' },
      { at: 0.7, emoji: '🧱', text: 'Menopang tubuh' },
      { at: 0.85, emoji: '🛡️', text: 'Melindungi organ di dalamnya' },
    ],
    motion: { kind: 'none' },
  },
  otak: {
    pops: [
      { at: 0.05, emoji: '🧠', text: 'Pusat kendali tubuh' },
      { at: 0.28, emoji: '⛑️', text: 'Dilindungi tengkorak yang keras' },
      { at: 0.5, emoji: '⚡', big: '86 miliar', text: 'sel saraf' },
      { at: 0.78, emoji: '💭', text: 'Berpikir, mengingat, bermimpi' },
    ],
    fx: ['⚡', '💭'],
    motion: { kind: 'glow', ids: ['brain_l', 'brain_r'] },
  },
  mata: {
    pops: [
      { at: 0.05, emoji: '💡', text: 'Menangkap cahaya' },
      { at: 0.3, emoji: '🧠', text: 'Otak mengubahnya jadi gambar' },
      { at: 0.62, emoji: '😉', big: 'ribuan', text: 'kedipan setiap hari' },
      { at: 0.84, emoji: '💧', text: 'Kedipan membasahi mata' },
    ],
    fx: ['✨'],
    motion: { kind: 'look', ids: ['eye_l', 'eye_r'] },
  },
  telinga: {
    pops: [
      { at: 0.05, emoji: '🔊', text: 'Suara adalah getaran' },
      { at: 0.45, emoji: '🍚', text: 'Sanggurdi: tulang terkecil, lebih kecil dari sebutir beras' },
      { at: 0.82, emoji: '⚖️', text: 'Membantu menjaga keseimbangan' },
    ],
    fx: ['🎵', '🎶'],
    motion: { kind: 'pulse', ids: ['ear_l'] },
  },
  hidung: {
    pops: [
      { at: 0.05, emoji: '👃', text: 'Mencium bau' },
      { at: 0.3, emoji: '🌸', text: 'Wangi bunga' },
      { at: 0.45, emoji: '🍳', text: 'Harum masakan' },
      { at: 0.72, emoji: '🧹', text: 'Rambut & lendir menyaring debu dan kuman' },
    ],
    fx: ['🌸', '💨'],
    motion: { kind: 'breathe', ids: ['nose'] },
  },
  mulut: {
    pops: [
      { at: 0.05, emoji: '🦷', text: 'Gigi memotong & mengunyah' },
      { at: 0.3, emoji: '👅', text: 'Lidah mengecap rasa' },
      { at: 0.55, emoji: '🍼', big: '20', text: 'gigi susu' },
      { at: 0.7, emoji: '😁', big: '32', text: 'gigi dewasa' },
      { at: 0.86, emoji: '🪥', text: 'Sikat gigi 2× sehari' },
    ],
    motion: { kind: 'chew', ids: ['mouth'] },
  },
  paru: {
    pops: [
      { at: 0.03, emoji: '🌬️', text: 'Tarik napas…' },
      { at: 0.25, emoji: '🫁', text: 'Mengambil oksigen (O₂)' },
      { at: 0.45, emoji: '💨', text: 'Membuang karbon dioksida (CO₂)' },
      { at: 0.75, emoji: '🔁', big: '±20.000', text: 'napas setiap hari' },
    ],
    fx: ['💨', '🫧'],
    motion: { kind: 'breathe', ids: ['lung_r', 'lung_l'] },
  },
  jantung: {
    pops: [
      { at: 0.03, emoji: '💓', text: 'Dug, dug, dug!' },
      { at: 0.22, emoji: '✊', text: 'Sebesar kepalan tanganmu' },
      { at: 0.48, emoji: '🩸', text: 'Memompa darah ke seluruh tubuh' },
      { at: 0.76, emoji: '💗', big: '±100.000', text: 'detak setiap hari' },
    ],
    fx: ['❤️', '💗'],
    motion: { kind: 'beat', ids: ['heart'] },
  },
  lambung: {
    pops: [
      { at: 0.05, emoji: '🍙', text: 'Makanan meluncur ke lambung' },
      { at: 0.32, emoji: '🎈', text: 'Kantong yang bisa melar' },
      { at: 0.62, emoji: '🌀', text: 'Diaduk dengan cairan asam kuat' },
      { at: 0.85, emoji: '🥣', text: 'Jadi bubur halus' },
    ],
    motion: { kind: 'churn', ids: ['stomach'] },
  },
  hati: {
    pops: [
      { at: 0.05, emoji: '🏅', text: 'Organ dalam terbesar' },
      { at: 0.28, emoji: '📋', big: '500+', text: 'tugas' },
      { at: 0.55, emoji: '🧽', text: 'Membersihkan darah' },
      { at: 0.72, emoji: '🟢', text: 'Membuat cairan empedu' },
      { at: 0.88, emoji: '🔋', text: 'Menyimpan cadangan energi' },
    ],
    motion: { kind: 'pulse', ids: ['liver'] },
  },
  pankreas: {
    pops: [
      { at: 0.05, emoji: '📍', text: 'Letaknya di belakang lambung' },
      { at: 0.45, emoji: '🧪', text: 'Membuat cairan pencernaan' },
      { at: 0.72, emoji: '🍬', text: 'Insulin mengatur gula darah' },
    ],
    motion: { kind: 'glow', ids: ['pancreas'] },
  },
  usus: {
    pops: [
      { at: 0.05, emoji: '📏', big: '±6 m', text: 'panjang usus halus' },
      { at: 0.35, emoji: '🪢', text: 'Terlipat rapi di dalam perut' },
      { at: 0.65, emoji: '🩸', text: 'Sari makanan diserap ke darah' },
    ],
    motion: { kind: 'churn', ids: ['jejunum', 'ileum', 'duodenum'] },
  },
  ginjal: {
    pops: [
      { at: 0.05, emoji: '🫘', big: '2', text: 'ginjal, bentuknya seperti kacang merah' },
      { at: 0.42, emoji: '🧹', text: 'Menyaring darah' },
      { at: 0.62, emoji: '🚽', text: 'Sisa dibuang jadi air seni' },
      { at: 0.84, emoji: '💧', text: 'Minum air putih yang cukup!' },
    ],
    fx: ['💧'],
    motion: { kind: 'pulse', ids: ['kidney_l', 'kidney_r'] },
  },
  tangan: {
    pops: [
      { at: 0.08, emoji: '✋', big: '27', text: 'tulang di setiap tangan' },
      { at: 0.6, emoji: '✏️', text: 'Menulis' },
      { at: 0.72, emoji: '🎨', text: 'Menggambar' },
      { at: 0.84, emoji: '🧩', text: 'Bermain' },
    ],
    motion: { kind: 'wiggle', ids: ['hand_l'] },
  },
  kaki: {
    pops: [
      { at: 0.08, emoji: '🦶', big: '26', text: 'tulang di setiap kaki' },
      { at: 0.4, emoji: '🤝', text: 'Bekerja sama dengan otot & sendi' },
      { at: 0.72, emoji: '🏃', text: 'Menopang tubuh saat berlari' },
    ],
    motion: { kind: 'wiggle', ids: ['foot_l'] },
  },
  penutup: {
    pops: [
      { at: 0.05, emoji: '🎉', text: 'Hebat, penjelajah!' },
      { at: 0.45, emoji: '🥦', text: 'Makan bergizi' },
      { at: 0.58, emoji: '💧', text: 'Minum air putih' },
      { at: 0.7, emoji: '😴', text: 'Tidur cukup' },
      { at: 0.82, emoji: '⚽', text: 'Rajin bergerak' },
    ],
    fx: ['🎉', '⭐'],
    motion: { kind: 'none' },
  },
};

/** Gerak organ saat anak membuka organ sendiri (bukan tur). */
export const ORGAN_MOTION: Record<string, { kind: MotionKind; ids: string[] }> = {
  heart: { kind: 'beat', ids: ['heart'] },
  brain_l: { kind: 'glow', ids: ['brain_l', 'brain_r'] },
  lung_r: { kind: 'breathe', ids: ['lung_r', 'lung_l'] },
  stomach: { kind: 'churn', ids: ['stomach'] },
  liver: { kind: 'pulse', ids: ['liver'] },
  kidney_l: { kind: 'pulse', ids: ['kidney_l', 'kidney_r'] },
  jejunum: { kind: 'churn', ids: ['jejunum', 'ileum', 'duodenum'] },
  pancreas: { kind: 'glow', ids: ['pancreas'] },
  eye_l: { kind: 'look', ids: ['eye_l', 'eye_r'] },
  ear_l: { kind: 'pulse', ids: ['ear_l'] },
  nose: { kind: 'breathe', ids: ['nose'] },
  mouth: { kind: 'chew', ids: ['mouth'] },
  hand_l: { kind: 'wiggle', ids: ['hand_l'] },
  foot_l: { kind: 'wiggle', ids: ['foot_l'] },
};
