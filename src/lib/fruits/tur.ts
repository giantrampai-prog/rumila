// Tur bernarasi Kebun Buah: anak berjalan sendiri menjelajah kebun 3D, berhenti di setiap tanaman,
// lalu info buah muncul mengikuti narasi. Urutan mengikuti jalan di kebun (petak demi petak, baris demi baris).
// Buah unggulan memakai naskah khusus; buah lainnya disusun dari deskripsi & fakta katalog (sudah ditinjau).
// Naskah suara: docs/buah/naskah-tur-buah.txt (satu file suara, jeda ±1 detik antaradegan).
// Tanpa klaim gizi/kesehatan; fakta tentang bentuk, warna, rasa, dan cara tumbuh.

import { type Fruit, type FruitGroup } from "./catalog";
import { ZONE_NAME, buildPlots } from "./garden";

export interface BuahStop {
  id: string;
  title: string;
  /** buah yang dibahas (id katalog); kosong untuk pembuka, papan petak, dan penutup */
  fruit?: string;
  /** tujuan jalan di kebun: id buah, "plaza", atau "zona:<kelompok>" */
  at: string;
  lines: string[];
}

/** Naskah khusus (pembuka, penutup, dan buah unggulan). */
const KHUSUS: BuahStop[] = [
  {
    id: "pembuka",
    title: "Kebun Buah",
    at: "plaza",
    lines: [
      "Halo, penjelajah cilik! Selamat datang di Kebun Buah Rumila.",
      "Hari ini kita akan berjalan-jalan keliling kebun dan berkenalan dengan buah-buahan dari dekat. Perhatikan warna, bentuk, dan kulitnya, ya!",
    ],
  },
  {
    id: "pisang",
    title: "Pisang",
    fruit: "pisang",
    at: "pisang",
    lines: [
      "Ini pisang! Pisang tumbuh bergerombol dalam satu tandan. Sekelompok pisang yang berjajar disebut sisir.",
      "Saat matang, kulitnya berubah kuning dan mudah dikupas. Daging buahnya lembut dan manis.",
    ],
  },
  {
    id: "mangga",
    title: "Mangga",
    fruit: "mangga",
    at: "mangga",
    lines: [
      "Ini mangga, buah yang harum saat matang. Di Indonesia ada banyak jenis mangga, misalnya arumanis dan gedong.",
      "Di tengahnya ada satu biji besar yang pipih.",
    ],
  },
  {
    id: "jeruk",
    title: "Jeruk",
    fruit: "jeruk",
    at: "jeruk",
    lines: [
      "Ini jeruk. Kulitnya berpori-pori kecil dan wangi.",
      "Kalau dikupas, isinya terbagi menjadi beberapa siung. Setiap siung berisi kantong-kantong kecil penuh sari buah.",
    ],
  },
  {
    id: "apel",
    title: "Apel",
    fruit: "apel",
    at: "apel",
    lines: [
      "Ini apel. Warnanya bisa merah, hijau, atau kuning. Daging buahnya renyah saat digigit.",
      "Coba belah apel, di bagian tengahnya ada biji-biji kecil berwarna cokelat.",
    ],
  },
  {
    id: "semangka",
    title: "Semangka",
    fruit: "semangka",
    at: "semangka",
    lines: [
      "Wah, besar sekali! Ini semangka. Kulitnya hijau bergaris, daging buahnya merah dan segar.",
      "Sebagian besar isi semangka adalah air, karena itu rasanya menyegarkan saat cuaca panas.",
    ],
  },
  {
    id: "nanas",
    title: "Nanas",
    fruit: "nanas",
    at: "nanas",
    lines: [
      "Ini nanas, lihat mahkota daunnya di atas! Kulitnya bersisik dan kasar.",
      "Tahukah kamu? Nanas sebenarnya gabungan dari banyak buah kecil yang tumbuh menyatu menjadi satu.",
    ],
  },
  {
    id: "stroberi",
    title: "Stroberi",
    fruit: "stroberi",
    at: "stroberi",
    lines: [
      "Ini stroberi yang merah cerah. Lihat titik-titik kecil di kulitnya.",
      "Titik-titik itu adalah bijinya! Stroberi adalah buah yang bijinya ada di luar.",
    ],
  },
  {
    id: "alpukat",
    title: "Alpukat",
    fruit: "alpukat",
    at: "alpukat",
    lines: [
      "Ini alpukat. Kulitnya hijau tua, daging buahnya hijau kekuningan dan lembut seperti mentega.",
      "Di tengahnya ada satu biji besar yang bulat.",
    ],
  },
  {
    id: "kelapa",
    title: "Kelapa",
    fruit: "kelapa",
    at: "kelapa",
    lines: [
      "Ini kelapa, tumbuh di pohon yang tinggi di tepi pantai. Kulit luarnya berserabut, tempurungnya keras.",
      "Di dalamnya ada daging buah putih dan air kelapa yang segar.",
    ],
  },
  {
    id: "durian",
    title: "Durian",
    fruit: "durian",
    at: "durian",
    lines: [
      "Hati-hati, berduri! Ini durian, sering disebut raja buah.",
      "Aromanya sangat kuat, ada yang suka dan ada yang tidak. Daging buahnya kuning dan lembut.",
    ],
  },
  {
    id: "rambutan",
    title: "Rambutan",
    fruit: "rambutan",
    at: "rambutan",
    lines: [
      "Ini rambutan! Namanya berasal dari kata rambut, karena kulitnya dipenuhi rambut-rambut halus.",
      "Daging buahnya putih bening, manis, dan berair.",
    ],
  },
  {
    id: "manggis",
    title: "Manggis",
    fruit: "manggis",
    at: "manggis",
    lines: [
      "Ini manggis, sering disebut ratu buah. Kulitnya ungu tua dan tebal, isinya putih.",
      "Ada rahasia seru: hitung kelopak kecil di bagian bawah manggis. Jumlahnya sama dengan jumlah potongan buah di dalamnya!",
    ],
  },
  {
    id: "salak",
    title: "Salak",
    fruit: "salak",
    at: "salak",
    lines: [
      "Ini salak. Kulitnya cokelat bersisik, mirip kulit ular.",
      "Rasanya manis dan sedikit sepat, dan daging buahnya renyah.",
    ],
  },
  {
    id: "buah-naga",
    title: "Buah Naga",
    fruit: "buah-naga",
    at: "buah-naga",
    lines: [
      "Ini buah naga, kulitnya merah muda dengan sisik hijau seperti api naga.",
      "Buah naga tumbuh dari tanaman sejenis kaktus. Daging buahnya putih atau merah dengan biji hitam kecil.",
    ],
  },
  {
    id: "matoa",
    title: "Matoa",
    fruit: "matoa",
    at: "matoa",
    lines: [
      "Ini matoa, buah khas dari Papua!",
      "Kulitnya licin, isinya putih bening dan manis. Banyak orang bilang rasanya mirip campuran lengkeng dan rambutan.",
    ],
  },
  {
    id: "kiwi",
    title: "Kiwi",
    fruit: "kiwi",
    at: "kiwi",
    lines: [
      "Ini kiwi. Kulitnya cokelat dan berbulu halus.",
      "Kalau dibelah, daging buahnya hijau dengan biji-biji hitam kecil yang tersusun melingkar.",
    ],
  },
  {
    id: "delima",
    title: "Delima",
    fruit: "delima",
    at: "delima",
    lines: [
      "Ini delima. Dari luar tampak biasa, tetapi di dalamnya ada ratusan biji kecil.",
      "Setiap biji dibungkus butiran merah yang bening dan berair, seperti permata!",
    ],
  },
  {
    id: "penutup",
    title: "Sampai jumpa",
    at: "plaza",
    lines: [
      "Hebat, kamu sudah mengenal empat puluh delapan buah! Setiap buah punya warna, bentuk, dan rasa yang berbeda.",
      "Jangan lupa cuci buah sebelum dimakan, ya. Buah mana yang paling ingin kamu coba? Sampai jumpa di Kebun Buah!",
    ],
  },
];

const byId = new Map(KHUSUS.map((s) => [s.id, s]));

/** Papan petak: pengantar setiap bagian kebun. */
const ZONA: Record<FruitGroup, string[]> = {
  sehari: ["Ayo kita mulai dari petak Buah Sehari-hari. Di sini tumbuh buah-buahan yang sering kita temui setiap hari."],
  nusantara: ["Sekarang kita masuk ke petak Buah Nusantara. Buah-buahan ini banyak tumbuh di berbagai daerah di Indonesia."],
  toko: ["Petak terakhir adalah Buah di Toko. Buah-buahan ini sering kita jumpai di toko buah, dan banyak di antaranya didatangkan dari negeri lain."],
};

/** Kalimat sapaan bergantian agar narasi buah-buah katalog tidak monoton. */
const SAPA = ["Ini {n}!", "Sekarang kita kenalan dengan {n}.", "Lihat, ini {n}.", "Nah, ini dia {n}!", "Yang berikutnya {n}."];

function dariKatalog(f: Fruit, i: number): BuahStop {
  return {
    id: f.id,
    title: f.name,
    fruit: f.id,
    at: f.id,
    lines: [`${SAPA[i % SAPA.length].replace("{n}", f.name.toLowerCase())} ${f.description}`, `Tahukah kamu? ${f.fact}`],
  };
}

/** Urutan jalan di kebun: per petak, baris terdekat alun-alun dulu, berkelok (ular) antarbaris. */
function urutanKebun(): { group: FruitGroup; fruits: Fruit[] }[] {
  const plots = buildPlots();
  return (["sehari", "nusantara", "toko"] as FruitGroup[]).map((group) => {
    const zone = plots.filter((p) => p.zone === group);
    const rows = [...new Set(zone.map((p) => Math.abs(p.z)))].sort((a, b) => a - b);
    const fruits = rows.flatMap((z, r) => {
      const row = zone.filter((p) => Math.abs(p.z) === z).sort((a, b) => Math.abs(a.x) - Math.abs(b.x));
      return (r % 2 ? row.reverse() : row).map((p) => p.fruit);
    });
    return { group, fruits };
  });
}

/** Urutan tur: pembuka → tiap petak (papan petak, lalu buahnya) → penutup. */
export const TUR_BUAH: BuahStop[] = (() => {
  let n = 0;
  const stops: BuahStop[] = [byId.get("pembuka")!];
  for (const { group, fruits } of urutanKebun()) {
    stops.push({ id: `zona-${group}`, title: ZONE_NAME[group], at: `zona:${group}`, lines: ZONA[group] });
    for (const f of fruits) stops.push(byId.get(f.id) ?? dariKatalog(f, n++));
  }
  stops.push(byId.get("penutup")!);
  return stops;
})();

export interface BuahAudioPart {
  src: string;
  first: number;
  /** detik mulai tiap adegan (dari timestamp rekaman) */
  cues: number[];
}

/** Narasi tur buah: SATU file suara. Kosong = belum ada rekaman (adegan memakai waktu baca, teks tampil kecil). */
export const TUR_BUAH_AUDIO: BuahAudioPart[] = [
  {
    // Suara "Charon" (SuaraKisah), 9:53. Waktu mulai tiap adegan dari timestamp per kata + jeda hening rekaman.
    src: "/fruits/narasi/tur-kebun-01.m4a",
    first: 0,
    cues: [
      0, 12.55, 19.27, 31.13, 41, 53.29, 64.67, 77, 88, 98.79, 110.47, 123, 133.03, 141.63, 154.91, 167.59, 179.43, 192.91, 199.57, 209.33, 217.93, 231.95, 237.79, 249.99, 264, 275, 286.79,
      298.87, 307.77, 320.59, 332.65, 344.57, 357.61, 368, 382, 393, 404, 415, 428.31, 435.07, 446.65, 457, 466.65, 475.87, 486.35, 494.31, 504.53, 513.01, 524.65, 538, 552, 566.49, 578.13,
    ],
  },
];

export const buahDwell = (s: BuahStop) => Math.max(6, s.lines.join(" ").length / 14 + 1.5);
