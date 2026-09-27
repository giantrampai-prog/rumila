// Katalog warna, folder, alat, dan izin — README handoff + "Family Launcher v2".
import { EDUCATION_CATEGORIES } from './education';

export type ColorKey = "orange" | "red" | "pink" | "purple" | "indigo" | "blue" | "sky" | "teal" | "green" | "lime" | "gold" | "space";

/** [tint, main, deep] */
export const CAT: Record<ColorKey, [string, string, string]> = {
  orange: ["#FFE6DE", "#FF7F67", "#D4563E"],
  red: ["#FDE2E3", "#E8646A", "#B5434A"],
  pink: ["#FBE4EE", "#E07AA2", "#B04F7A"],
  purple: ["#EDE9FB", "#9A8AE0", "#6C5ABF"],
  indigo: ["#E7E9FA", "#7884D8", "#5360B3"],
  blue: ["#E3EDF9", "#5B8FD6", "#3B6AAD"],
  sky: ["#DFF2F7", "#4FB0CF", "#2D87A5"],
  teal: ["#DDF3EF", "#52B8A8", "#318E80"],
  green: ["#E3F3E8", "#5DB57C", "#3B8B58"],
  lime: ["#EEF5DB", "#9CBB4E", "#6F8A2D"],
  gold: ["#FFF2D1", "#FDC23E", "#B9830F"],
  space: ["#E4E7F0", "#3A4670", "#1F3044"],
};

export type FolderKey = "game" | "coding" | "doa" | "ibadah" | "angkasa" | "edukasi" | "keluarga" | "kesehatan";

export type PermKey = FolderKey;

export interface Tool {
  id: string;
  name: string;
  icon: string;
  desc: string;
  folder: FolderKey;
  folderName: string;
  /** warna folder */
  c: ColorKey;
  /** warna ikon alat (palet bergilir per folder, dari Family Launcher v2) */
  g: ColorKey;
  /** Planned education categories expose their topics without recording learning progress. */
  planned?: boolean;
  topics?: string[];
  keywords?: string[];
}

export interface Folder {
  id: FolderKey;
  name: string;
  c: ColorKey;
  icon: string;
  desc: string;
  items: Tool[];
}

// Katalog dari "Family Launcher v2" (acuan tampilan website). "Jadwal Sholat" sengaja tidak dimasukkan:
// README handoff menghapus pengingat sholat agar sederhana.
const RAW: { id: FolderKey; name: string; c: ColorKey; icon: string; desc: string; pal: ColorKey[]; items: ([string, string, string] | [string, string, string, string])[] }[] =
  [
    {
      id: "game",
      name: "Game",
      c: "orange",
      icon: "sports_esports",
      desc: "Permainan seru buat main sendiri atau bareng keluarga.",
      pal: ["orange", "purple", "red", "blue", "pink", "teal"],
      items: [
        ["Rinoya Resto", "ramen_dining", "Bangun & kelola restoran Jepang: menu, tim, promosi, dan untung-rugi.", "game-resto"],
        ["Puzzle Gambar", "extension", "Susun kepingan gambar hewan dan tempat."],
        ["Catur", "chess", "Main catur bareng ayah atau lawan komputer."],
        ["Tebak Kata", "quiz", "Tebak kata Bahasa Indonesia dan Inggris."],
        ["Ular Tangga", "casino", "Ular tangga untuk 2–6 pemain: dadu adil, papan acak, bisa lawan komputer.", "game-ular"],
        ["Kartu Memori", "style", "Cocokkan pasangan kartu bergambar."],
        ["Labirin", "route", "Cari jalan keluar dari labirin."],
        ["Warnai Gambar", "palette", "Mewarnai gambar dengan jari."],
        ["Balap Hitung", "sports_score", "Balapan sambil menjawab soal hitungan."],
      ],
    },
    {
      id: "coding",
      name: "Coding Agam",
      c: "indigo",
      icon: "smart_toy",
      desc: "Belajar coding bersama robot Agam.",
      pal: ["indigo", "teal", "purple", "lime", "sky", "pink", "orange"],
      items: [
        ["Pola", "pattern", "10 level × 10 coding: lengkapi pola warna, bentuk, dan bunyi bersama Agam.", "koding-pola"],
        ["Langkah", "footprint", "10 level × 10 coding: susun perintah supaya Agam sampai di bintang.", "koding-langkah"],
        ["Ulangi", "repeat", "10 level × 10 coding: pakai blok ulangi supaya program Agam lebih pendek.", "koding-ulangi"],
        ["Kalau…", "alt_route", "10 level × 10 coding: ajari Agam memilih jalan — kalau ada rintangan, belok.", "koding-kalau"],
        ["Jurus", "bolt", "10 level × 10 coding: buat jurus sendiri, lalu panggil berkali-kali.", "koding-jurus"],
        ["Detektif Bug", "bug_report", "Temukan dan perbaiki perintah yang salah.", "koding-bug"],
        ["Studio Animasi", "animation", "Buat animasi sendiri dengan blok kode.", "koding-studio"],
      ],
    },
    {
      id: "doa",
      name: "Doa Harian",
      c: "teal",
      icon: "volunteer_activism",
      desc: "Doa sehari-hari lengkap dengan arab, latin, arti, dan suara.",
      pal: ["gold", "green", "teal", "sky", "pink", "orange"],
      items: [
        ["Bangun Tidur", "wb_twilight", "Doa ketika bangun tidur."],
        ["Sebelum Makan", "restaurant", "Doa sebelum makan."],
        ["Sesudah Makan", "dinner_dining", "Doa sesudah makan."],
        ["Masuk Rumah", "home", "Doa masuk rumah."],
        ["Keluar Rumah", "door_open", "Doa keluar rumah."],
        ["Naik Kendaraan", "directions_car", "Doa naik kendaraan."],
        ["Sebelum Belajar", "edit_note", "Doa sebelum belajar."],
        ["Untuk Orang Tua", "family_restroom", "Doa untuk kedua orang tua."],
        ["Kamar Mandi", "shower", "Doa masuk kamar mandi."],
        ["Sebelum Tidur", "bedtime", "Doa sebelum tidur."],
      ],
    },
    {
      id: "ibadah",
      name: "Ibadah",
      c: "green",
      icon: "mosque",
      desc: "Al-Qur’an, hafalan, dan dzikir keluarga.",
      pal: ["teal", "gold", "sky", "lime", "indigo"],
      items: [
        ["Al-Qur’an", "menu_book", "Baca Al-Qur’an dengan terjemahan dan murottal."],
        ["Hafalan Surat", "record_voice_over", "Lacak progres hafalan juz ‘amma."],
        ["Arah Kiblat", "explore", "Kompas penunjuk arah kiblat."],
        ["Tasbih Digital", "radio_button_checked", "Penghitung dzikir."],
        ["Asmaul Husna", "auto_awesome", "99 nama Allah dengan arti."],
      ],
    },
    {
      id: "angkasa",
      name: "Petualangan 3D",
      c: "space",
      icon: "view_in_ar",
      desc: "Jelajahi angkasa, tubuh, buah, dan laut dalam 3D.",
      pal: ["space", "indigo", "sky", "purple", "orange", "pink"],
      items: [], // Isi & id tetap ada di ADVENTURE_3D (id lama dipertahankan agar progres tidak bergeser).
    },
    {
      id: "edukasi",
      name: "Edukasi",
      c: "red",
      icon: "school",
      desc: "Kenali diri, alam, dan dunia di sekitarmu.",
      pal: ["orange", "red", "teal", "green", "blue", "purple"],
      items: [], // Ordered categories and durable activity IDs live in education.ts.
    },
    {
      id: "keluarga",
      name: "Keluarga",
      c: "sky",
      icon: "family_restroom",
      desc: "Jadwal, tugas rumah, dan kenangan bersama.",
      pal: ["blue", "pink", "orange", "teal"],
      items: [
        ["Kalender Keluarga", "calendar_month", "Kegiatan, ulang tahun, dan libur sekolah."],
        ["Tugas Rumah", "checklist", "Bagi tugas rumah untuk semua anggota."],
        ["Galeri Kenangan", "photo_library", "Album foto keluarga."],
        ["Daftar Belanja", "shopping_cart", "Daftar belanja bersama."],
      ],
    },
    {
      id: "kesehatan",
      name: "Kesehatan",
      c: "purple",
      icon: "favorite",
      desc: "Pantau kesehatan dan kebiasaan baik.",
      pal: ["red", "sky", "indigo", "lime"],
      items: [
        ["Tumbuh Kembang", "monitor_weight", "Catat tinggi dan berat badan anak."],
        ["Minum Air", "water_drop", "Pengingat minum air."],
        ["Jam Tidur", "bedtime", "Rutinitas tidur dan waktu layar."],
      ],
    },
  ];

/** Modul yang dipindah dari Edukasi ke Petualangan 3D (id & progres tetap). */
const MOVED_TO_3D = new Set(["edukasi6", "edukasi-buah"]);
const edu = (id: string) => EDUCATION_CATEGORIES.find((c) => c.id === id)!;

/** Petualangan 3D: semua modul 3D di satu dunia. Id lama dipakai ulang supaya progres tersimpan tetap terbaca. */
const ADVENTURE_3D: Omit<Tool, "folder" | "folderName" | "c">[] = [
  { id: "angkasa6", name: "Jelajah Angkasa", icon: "public", g: "space", desc: "Terbang ke planet, bulan, dan bintang dalam 3D." },
  { id: "angkasa3", name: "Roket & Astronot", icon: "rocket_launch", g: "purple", desc: "Luncurkan roket 3D dari landasan sampai luar angkasa." },
  { ...edu("edukasi6"), name: "Jelajah Tubuh", g: "red", desc: "Lihat kulit, otot, tulang, dan organ tubuh dalam 3D." },
  { ...edu("edukasi-buah"), name: "Kebun Buah", g: "orange", desc: "Putar dan kenali 48 buah dalam 3D." },
  { id: "petualangan-laut", name: "Bawah Laut", icon: "scuba_diving", g: "sky", desc: "Menyelam dari terumbu karang sampai palung laut terdalam." },
  { id: "petualangan-bumi", name: "Dalam Bumi", icon: "landscape", g: "orange", desc: "Menjelajah gua, fosil, dan kristal sampai ke inti Bumi." },
];

export const FOLDERS: Folder[] = RAW.map(({ id, name, c, icon, desc, pal, items }) => ({
  id,
  name,
  c,
  icon,
  desc,
  items: (id === 'edukasi' ? EDUCATION_CATEGORIES.filter(category => !MOVED_TO_3D.has(category.id)).map(category => ({
    ...category,
    folder: id,
    folderName: name,
    c,
  })) : id === 'angkasa' ? ADVENTURE_3D.map(t => ({ ...t, folder: id, folderName: name, c })) : items.map(([n, ic, d, fixed], i) => ({
    // id tetap (bila ada) agar menambah item di depan tidak menggeser id & progres alat lama
    id: fixed ?? id + (id === 'game' ? i - 1 : i),
    name: n,
    icon: ic,
    desc: d,
    folder: id,
    folderName: name,
    c,
    g: pal[i % pal.length],
  }))),
}));

export const ALL_TOOLS: Tool[] = FOLDERS.flatMap((f) => f.items);

export const PERMS: { key: PermKey; name: string; icon: string; c: ColorKey }[] = [
  ...FOLDERS.map((f) => ({ key: f.id as PermKey, name: f.name, icon: f.icon, c: f.c })),
];

export const ALL_PERMS: PermKey[] = PERMS.map((p) => p.key);
export const KID_PRESET: PermKey[] = ["game", "coding", "doa", "ibadah", "angkasa", "edukasi", "kesehatan"];
export const MEMBER_COLORS: ColorKey[] = ["indigo", "orange", "teal", "gold", "pink", "green"];

/** Palet tema Playful: [light, main, deep] — dari Family Launcher v2 */
export const PLAY: Record<ColorKey, [string, string, string]> = {
  orange: ["#ffb347", "#ff7a1a", "#d95a00"],
  purple: ["#c78bff", "#8b45f5", "#6421c9"],
  red: ["#ff8a8a", "#ff4757", "#c92a3a"],
  blue: ["#7cc0ff", "#2f86ff", "#1a5fd1"],
  green: ["#6fe39a", "#1fbf62", "#12904a"],
  teal: ["#5ce8d6", "#12b8a6", "#0a8a7c"],
  gold: ["#ffe46b", "#ffbe0b", "#d99400"],
  pink: ["#ffa3cf", "#ff4fa3", "#d12a7c"],
  indigo: ["#9a93ff", "#5b4bff", "#3a2cd1"],
  space: ["#6a6fd6", "#2d2f86", "#16174f"],
  sky: ["#8fe3ff", "#20b7f0", "#0a88bf"],
  lime: ["#c8f56a", "#86d11a", "#5c9a00"],
};

export const getFolder = (id: string) => FOLDERS.find((f) => f.id === id);
/** Lab Sains now shares the single Tubuh Manusia entry, including saved activity. */
export const canonicalToolId = (id: string) => id === 'edukasi2' ? 'edukasi6' : id === 'angkasa0' || id === 'angkasa1' ? 'angkasa6' : id;
export const getTool = (id: string) => ALL_TOOLS.find((t) => t.id === canonicalToolId(id));

export const matchesTool = (tool: Tool, query: string) =>
  [tool.name, tool.folderName, tool.desc, ...(tool.topics ?? []), ...(tool.keywords ?? [])]
    .join(' ').toLocaleLowerCase('id-ID').includes(query.trim().toLocaleLowerCase('id-ID'));
