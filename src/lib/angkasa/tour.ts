// Naskah "Tur terbang": urutan persinggahan + teks edukatif per persinggahan.
// Angka diambil dari manifest (bukan ditulis ulang) agar sama dengan panel & perbandingan.

import { OBJ } from "./manifest";
import { fmtValue } from "./sim";

export interface TourStop {
  /** id objek di manifest, atau "intro"/"outro" untuk bidikan lebar */
  id: string;
  title: string;
  lines: string[];
}

/** Ambil fakta dari manifest dan format dengan satuannya: fact("jupiter","Satu hari (rotasi)") → "9,9 jam". */
export function fact(id: string, label: string): string {
  const f = OBJ.get(id)?.keyFacts.find((k) => k.label === label);
  if (!f) throw new Error(`Fakta tur tidak ditemukan: ${id}/${label}`);
  const v = fmtValue(f.qty.value, f.format);
  return f.format === "hours-days" ? v : `${v} ${f.qty.unit}`;
}

const def = (id: string) => OBJ.get(id)!.definitionSimple;

export const TOUR: TourStop[] = [
  {
    id: "intro",
    title: "Siap terbang!",
    lines: [
      "Selamat datang, penjelajah! Kita akan terbang melewati Matahari, delapan planet, dan benda-benda kecil di tata surya.",
      "Jarak di tur ini dirapatkan dan perjalanannya dipercepat. Aslinya, cahaya Matahari saja butuh sekitar 8 menit untuk sampai ke Bumi.",
    ],
  },
  {
    id: "sun",
    title: "Matahari",
    lines: [
      def("sun"),
      "Matahari adalah bintang, bukan planet. Cahayanya yang membuat planet-planet tampak terang.",
      `Radiusnya sekitar ${fact("sun", "Radius")} — lebih dari 100 kali radius Bumi.`,
    ],
  },
  {
    id: "mercury",
    title: "Merkurius",
    lines: [
      def("mercury"),
      "Merkurius hampir tidak punya atmosfer, jadi siangnya sangat panas dan malamnya sangat dingin.",
      `Satu tahun di Merkurius hanya sekitar ${fact("mercury", "Satu tahun")}.`,
    ],
  },
  {
    id: "venus",
    title: "Venus",
    lines: [
      def("venus"),
      `Awan tebalnya memerangkap panas. Suhu permukaannya sekitar ${fact("venus", "Suhu permukaan")} — lebih panas dari Merkurius!`,
      "Venus berputar sangat lambat, dan arahnya terbalik dibanding kebanyakan planet.",
    ],
  },
  {
    id: "earth",
    title: "Bumi",
    lines: [
      def("earth"),
      "Sekitar tujuh puluh persen permukaan Bumi tertutup air.",
      `Sumbu Bumi miring ${fact("earth", "Kemiringan sumbu")}. Kemiringan inilah yang menyebabkan pergantian musim di banyak tempat.`,
    ],
  },
  {
    id: "moon",
    title: "Bulan",
    lines: [
      def("moon"),
      "Sisi Bulan yang sama selalu menghadap Bumi, karena Bulan berputar sekali untuk setiap satu kali mengelilingi Bumi.",
    ],
  },
  {
    id: "mars",
    title: "Mars",
    lines: [
      def("mars"),
      "Warna merahnya berasal dari debu yang mengandung oksida besi — mirip karat.",
      "Di Mars ada Olympus Mons, gunung berapi terbesar yang diketahui di tata surya.",
    ],
  },
  {
    id: "asteroid-example",
    title: "Sabuk asteroid",
    lines: [
      "Di antara Mars dan Jupiter ada sabuk asteroid: banyak batuan sisa pembentukan tata surya.",
      "Batuan ini hanya model contoh, bukan asteroid tertentu.",
      "Walau di film tampak berdesakan, jarak antarasteroid sebenarnya sangat jauh.",
    ],
  },
  {
    id: "jupiter",
    title: "Jupiter",
    lines: [
      def("jupiter"),
      `Jupiter berputar sangat cepat: satu harinya hanya ${fact("jupiter", "Satu hari (rotasi)")}.`,
      "Bintik Merah Raksasa adalah badai yang lebih besar dari Bumi. Jupiter tidak punya permukaan padat untuk didarati.",
    ],
  },
  {
    id: "saturn",
    title: "Saturnus",
    lines: [
      def("saturn"),
      "Cincinnya tersusun dari milyaran bongkah es dan batuan, bukan satu piringan padat.",
      "Titan, satelit terbesarnya, diselimuti atmosfer tebal berwarna jingga.",
    ],
  },
  {
    id: "uranus",
    title: "Uranus",
    lines: [
      def("uranus"),
      `Sumbunya miring ${fact("uranus", "Kemiringan sumbu")}, jadi Uranus berputar hampir rebah.`,
      "Warna biru kehijauannya berasal dari gas metana di atmosfernya.",
    ],
  },
  {
    id: "neptune",
    title: "Neptunus",
    lines: [
      def("neptune"),
      "Neptunus punya angin tercepat yang diketahui di tata surya.",
      "Dari sini, cahaya Matahari butuh sekitar 4 jam untuk tiba.",
    ],
  },
  {
    id: "pluto",
    title: "Pluto",
    lines: [
      def("pluto"),
      "Sejak 2006 Pluto digolongkan planet katai, bukan planet kesembilan.",
      "Wahana New Horizons memotret dataran es berbentuk hati di permukaannya.",
    ],
  },
  {
    id: "comet-example",
    title: "Komet",
    lines: [
      "Komet adalah bongkahan es dan debu. Ini model contoh, bukan komet tertentu.",
      "Saat mendekati Matahari, esnya menguap membentuk koma dan ekor.",
      "Ekor komet selalu mengarah menjauhi Matahari — bukan sekadar tertinggal di belakang geraknya.",
    ],
  },
  {
    id: "outro",
    title: "Tur selesai!",
    lines: [
      "Seluruh tata surya kita hanyalah satu titik kecil di galaksi Bima Sakti.",
      "Kamu bisa kembali ke planet mana pun untuk belajar lebih dalam, atau buka Bintang & galaksi.",
    ],
  },
];

/** Lama singgah (detik) — cukup untuk membaca setiap kalimat. */
export const lineSeconds = (line: string) =>
  Math.max(4.5, Math.min(9, line.length / 14));
export const dwellSeconds = (stop: TourStop) =>
  stop.lines.reduce((a, l) => a + lineSeconds(l), 0);
/** Kalimat ke berapa yang tampil pada detik t dari awal singgah. */
export function lineAt(stop: TourStop, t: number) {
  let acc = 0;
  for (let i = 0; i < stop.lines.length; i++) {
    acc += lineSeconds(stop.lines[i]);
    if (t < acc) return i;
  }
  return stop.lines.length - 1;
}
