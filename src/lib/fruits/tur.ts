// Tur bernarasi Kebun Buah: SEMUA buah tampil satu per satu (berputar pelan) mengikuti narasi.
// Buah unggulan memakai naskah khusus; buah lainnya disusun dari deskripsi & fakta katalog (sudah ditinjau).
// Naskah suara: docs/buah/naskah-tur-buah.txt (satu file suara, jeda ±1 detik antaradegan).
// Tanpa klaim gizi/kesehatan; fakta tentang bentuk, warna, rasa, dan cara tumbuh.

import { FRUITS, type Fruit } from "./catalog";

export interface BuahStop {
  id: string;
  title: string;
  /** buah yang ditampilkan (id katalog) */
  fruit: string;
  lines: string[];
}

/** Naskah khusus (pembuka, penutup, dan buah unggulan). */
const KHUSUS: BuahStop[] = [
  {
    id: "pembuka",
    title: "Kebun Buah",
    fruit: "pisang",
    lines: [
      "Halo, penjelajah cilik! Selamat datang di Kebun Buah Rumila.",
      "Hari ini kita akan berkenalan dengan buah-buahan dari dekat. Perhatikan warna, bentuk, dan kulitnya, ya!",
    ],
  },
  {
    id: "pisang",
    title: "Pisang",
    fruit: "pisang",
    lines: [
      "Ini pisang! Pisang tumbuh bergerombol dalam satu tandan. Sekelompok pisang yang berjajar disebut sisir.",
      "Saat matang, kulitnya berubah kuning dan mudah dikupas. Daging buahnya lembut dan manis.",
    ],
  },
  {
    id: "mangga",
    title: "Mangga",
    fruit: "mangga",
    lines: [
      "Ini mangga, buah yang harum saat matang. Di Indonesia ada banyak jenis mangga, misalnya arumanis dan gedong.",
      "Di tengahnya ada satu biji besar yang pipih.",
    ],
  },
  {
    id: "jeruk",
    title: "Jeruk",
    fruit: "jeruk",
    lines: [
      "Ini jeruk. Kulitnya berpori-pori kecil dan wangi.",
      "Kalau dikupas, isinya terbagi menjadi beberapa siung. Setiap siung berisi kantong-kantong kecil penuh sari buah.",
    ],
  },
  {
    id: "apel",
    title: "Apel",
    fruit: "apel",
    lines: [
      "Ini apel. Warnanya bisa merah, hijau, atau kuning. Daging buahnya renyah saat digigit.",
      "Coba belah apel, di bagian tengahnya ada biji-biji kecil berwarna cokelat.",
    ],
  },
  {
    id: "semangka",
    title: "Semangka",
    fruit: "semangka",
    lines: [
      "Wah, besar sekali! Ini semangka. Kulitnya hijau bergaris, daging buahnya merah dan segar.",
      "Sebagian besar isi semangka adalah air, karena itu rasanya menyegarkan saat cuaca panas.",
    ],
  },
  {
    id: "nanas",
    title: "Nanas",
    fruit: "nanas",
    lines: [
      "Ini nanas, lihat mahkota daunnya di atas! Kulitnya bersisik dan kasar.",
      "Tahukah kamu? Nanas sebenarnya gabungan dari banyak buah kecil yang tumbuh menyatu menjadi satu.",
    ],
  },
  {
    id: "stroberi",
    title: "Stroberi",
    fruit: "stroberi",
    lines: [
      "Ini stroberi yang merah cerah. Lihat titik-titik kecil di kulitnya.",
      "Titik-titik itu adalah bijinya! Stroberi adalah buah yang bijinya ada di luar.",
    ],
  },
  {
    id: "alpukat",
    title: "Alpukat",
    fruit: "alpukat",
    lines: [
      "Ini alpukat. Kulitnya hijau tua, daging buahnya hijau kekuningan dan lembut seperti mentega.",
      "Di tengahnya ada satu biji besar yang bulat.",
    ],
  },
  {
    id: "kelapa",
    title: "Kelapa",
    fruit: "kelapa",
    lines: [
      "Ini kelapa, tumbuh di pohon yang tinggi di tepi pantai. Kulit luarnya berserabut, tempurungnya keras.",
      "Di dalamnya ada daging buah putih dan air kelapa yang segar.",
    ],
  },
  {
    id: "durian",
    title: "Durian",
    fruit: "durian",
    lines: [
      "Hati-hati, berduri! Ini durian, sering disebut raja buah.",
      "Aromanya sangat kuat, ada yang suka dan ada yang tidak. Daging buahnya kuning dan lembut.",
    ],
  },
  {
    id: "rambutan",
    title: "Rambutan",
    fruit: "rambutan",
    lines: [
      "Ini rambutan! Namanya berasal dari kata rambut, karena kulitnya dipenuhi rambut-rambut halus.",
      "Daging buahnya putih bening, manis, dan berair.",
    ],
  },
  {
    id: "manggis",
    title: "Manggis",
    fruit: "manggis",
    lines: [
      "Ini manggis, sering disebut ratu buah. Kulitnya ungu tua dan tebal, isinya putih.",
      "Ada rahasia seru: hitung kelopak kecil di bagian bawah manggis. Jumlahnya sama dengan jumlah potongan buah di dalamnya!",
    ],
  },
  {
    id: "salak",
    title: "Salak",
    fruit: "salak",
    lines: [
      "Ini salak. Kulitnya cokelat bersisik, mirip kulit ular.",
      "Rasanya manis dan sedikit sepat, dan daging buahnya renyah.",
    ],
  },
  {
    id: "buah-naga",
    title: "Buah Naga",
    fruit: "buah-naga",
    lines: [
      "Ini buah naga, kulitnya merah muda dengan sisik hijau seperti api naga.",
      "Buah naga tumbuh dari tanaman sejenis kaktus. Daging buahnya putih atau merah dengan biji hitam kecil.",
    ],
  },
  {
    id: "matoa",
    title: "Matoa",
    fruit: "matoa",
    lines: [
      "Ini matoa, buah khas dari Papua!",
      "Kulitnya licin, isinya putih bening dan manis. Banyak orang bilang rasanya mirip campuran lengkeng dan rambutan.",
    ],
  },
  {
    id: "kiwi",
    title: "Kiwi",
    fruit: "kiwi",
    lines: [
      "Ini kiwi. Kulitnya cokelat dan berbulu halus.",
      "Kalau dibelah, daging buahnya hijau dengan biji-biji hitam kecil yang tersusun melingkar.",
    ],
  },
  {
    id: "delima",
    title: "Delima",
    fruit: "delima",
    lines: [
      "Ini delima. Dari luar tampak biasa, tetapi di dalamnya ada ratusan biji kecil.",
      "Setiap biji dibungkus butiran merah yang bening dan berair, seperti permata!",
    ],
  },
  {
    id: "penutup",
    title: "Sampai jumpa",
    fruit: "mangga",
    lines: [
      "Hebat, kamu sudah mengenal empat puluh delapan buah! Setiap buah punya warna, bentuk, dan rasa yang berbeda.",
      "Jangan lupa cuci buah sebelum dimakan, ya. Buah mana yang paling ingin kamu coba? Sampai jumpa di Kebun Buah!",
    ],
  },
];

const byId = new Map(KHUSUS.map((s) => [s.id, s]));

/** Kalimat sapaan bergantian agar narasi buah-buah katalog tidak monoton. */
const SAPA = ["Ini {n}!", "Sekarang kita kenalan dengan {n}.", "Lihat, ini {n}.", "Nah, ini dia {n}!", "Yang berikutnya {n}."];

function dariKatalog(f: Fruit, i: number): BuahStop {
  return {
    id: f.id,
    title: f.name,
    fruit: f.id,
    lines: [`${SAPA[i % SAPA.length].replace("{n}", f.name.toLowerCase())} ${f.description}`, `Tahukah kamu? ${f.fact}`],
  };
}

/** Urutan tur: pembuka → semua buah (urut katalog) → penutup. */
export const TUR_BUAH: BuahStop[] = [
  byId.get("pembuka")!,
  ...FRUITS.map((f, i) => byId.get(f.id) ?? dariKatalog(f, i)),
  byId.get("penutup")!,
];

export interface BuahAudioPart {
  src: string;
  first: number;
  /** detik mulai tiap adegan (dari timestamp rekaman) */
  cues: number[];
}

/** Narasi tur buah: SATU file suara. Kosong = belum ada rekaman (adegan memakai waktu baca, teks tampil kecil). */
export const TUR_BUAH_AUDIO: BuahAudioPart[] = [];

export const buahDwell = (s: BuahStop) => Math.max(6, s.lines.join(" ").length / 14 + 1.5);
