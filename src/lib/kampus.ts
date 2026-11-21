// Kampus RINOYA: semua konten berada di bawah satu Academy. Beranda = gerbang kampus; dunia, game, coding,
// dan ibadah menjadi gedung di dalamnya. Kunci izin (FolderKey) dan id alat tidak berubah, jadi progres
// dan pengaturan izin anak tetap terbaca.

import { ALL_TOOLS, getTool, type ColorKey, type FolderKey, type Tool } from "./catalog";

/** id alat → halaman modulnya. Alat tanpa rute masih berupa kartu (belum berisi). */
export const RUTE_ALAT: Record<string, string> = {
  "edukasi-buah": "/buah-buahan",
  edukasi6: "/jelajah-tubuh",
  edukasi2: "/jelajah-tubuh",
  angkasa6: "/jelajah-angkasa",
  angkasa0: "/jelajah-angkasa",
  angkasa1: "/jelajah-angkasa?obj=moon",
  angkasa3: "/roket",
  "petualangan-laut": "/laut",
  "petualangan-bumi": "/bumi",
  "petualangan-umroh": "/umroh-virtual",
  "game-resto": "/resto",
  "game-ular": "/ular-tangga",
  "koding-langkah": "/koding/langkah",
  "koding-pola": "/koding/pola",
  "koding-ulangi": "/koding/ulangi",
  "koding-kalau": "/koding/kalau",
  "koding-jurus": "/koding/jurus",
};

/** Alat yang sudah membuka modul sungguhan. */
export const alatSiap = (t: Tool) => t.id in RUTE_ALAT;

export type GedungId = "lab" | "komputer" | "taman" | "musala";

export interface Gedung {
  id: GedungId;
  nama: string;
  /** keterangan singkat di papan nama */
  peran: string;
  desc: string;
  href: string;
  c: ColorKey;
  icon: string;
  /** folder (kunci izin) yang isinya pindah ke gedung ini */
  folders: FolderKey[];
  /** alat dari folder lain yang juga dipajang di sini (pintasan) */
  pintasan?: string[];
}

export const GEDUNG: Gedung[] = [
  {
    id: "lab",
    nama: "Laboratorium 3D",
    peran: "Praktik Sains",
    desc: "Dunia 3D yang terbuka setiap kamu menuntaskan modul Sains.",
    href: "/akademi/lab",
    c: "space",
    icon: "view_in_ar",
    folders: ["angkasa"],
  },
  {
    id: "komputer",
    nama: "Lab Komputer",
    peran: "Praktik Coding",
    desc: "Latihan bebas Coding bersama robot Agam.",
    href: "/akademi/komputer",
    c: "purple",
    icon: "smart_toy",
    folders: ["coding"],
  },
  {
    id: "taman",
    nama: "Taman Bermain",
    peran: "Jam istirahat",
    desc: "Main sebentar dulu, nanti belajar lagi.",
    href: "/akademi/taman",
    c: "orange",
    icon: "sports_esports",
    folders: ["game"],
  },
  {
    id: "musala",
    nama: "Musala",
    peran: "Karakter & Agama",
    desc: "Belajar ibadah dan doa sehari-hari.",
    href: "/akademi/musala",
    c: "green",
    icon: "mosque",
    folders: ["doa", "ibadah"],
    pintasan: ["petualangan-umroh"],
  },
];

export const getGedung = (id: string) => GEDUNG.find((g) => g.id === id);

/** Isi gedung yang boleh dibuka: hanya alat yang sudah berisi dan izinnya dimiliki. */
export function isiGedung(g: Gedung, boleh: (k: FolderKey) => boolean): Tool[] {
  const utama = ALL_TOOLS.filter((t) => g.folders.includes(t.folder));
  const pintas = (g.pintasan ?? []).map((id) => getTool(id)).filter((t): t is Tool => !!t);
  return [...utama, ...pintas].filter((t) => alatSiap(t) && boleh(t.folder));
}

/** Alat yang belum berisi, dikelompokkan per tempat barunya (untuk daftar "sedang disiapkan" di Ruang Orang Tua). */
export function daftarDisiapkan(): { tempat: string; alat: Tool[] }[] {
  const belum = (f: FolderKey[]) => ALL_TOOLS.filter((t) => f.includes(t.folder) && !alatSiap(t));
  return [
    { tempat: "Keluarga", alat: belum(["keluarga"]) },
    { tempat: "Kesehatan", alat: belum(["kesehatan"]) },
    ...GEDUNG.map((g) => ({ tempat: g.nama, alat: belum(g.folders) })),
    { tempat: "Ruang Kelas (topik lama)", alat: belum(["edukasi"]) },
  ].filter((k) => k.alat.length);
}
