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

// Gaya narasi: ceria, menyapa anak ("kita", "kamu"), kalimat pendek — tetapi faktanya tetap akurat.
export const TOUR: TourStop[] = [
  {
    id: "intro",
    title: "Briefing misi",
    lines: [
      "Selamat datang di pesawat antariksa Rumila, penjelajah cilik! Aku pemandumu dalam perjalanan kali ini.",
      "Hari ini kita dapat misi istimewa: mengunjungi keluarga besar Matahari, dari planet yang paling panas sampai yang paling jauh dan dingin.",
      "Di setiap persinggahan, perhatikan baik-baik, ya. Ada fakta seru yang bisa kamu ceritakan ke Ayah dan Ibu nanti!",
      "Satu rahasia sebelum berangkat: jarak antarplanet di tur ini kita rapatkan, dan pesawat kita super cepat. Aslinya, cahaya Matahari saja butuh sekitar 8 menit untuk sampai ke Bumi.",
      "Sabuk pengaman sudah terpasang? Mesin menyala. Tiga, dua, satu... meluncur!",
    ],
  },
  {
    id: "sun",
    title: "Matahari",
    lines: [
      "Wah, silau! Ini Matahari, bintang raksasa di pusat tata surya kita.",
      "Matahari itu bintang, bukan planet. Cahaya dan hangatnya yang membuat planet-planet tampak terang.",
      `Radiusnya sekitar ${fact("sun", "Radius")}. Kalau Matahari itu kotak kosong, lebih dari satu juta Bumi bisa masuk ke dalamnya!`,
    ],
  },
  {
    id: "mercury",
    title: "Merkurius",
    lines: [
      "Ini Merkurius, planet terkecil dan paling dekat dengan Matahari. Si kecil yang lincah!",
      `Merkurius mengelilingi Matahari cepat sekali. Satu tahun di sini cuma sekitar ${fact("mercury", "Satu tahun")}.`,
      "Karena hampir tidak punya selimut udara, siangnya panas membara dan malamnya dingin membeku. Brrr!",
    ],
  },
  {
    id: "venus",
    title: "Venus",
    lines: [
      "Selanjutnya Venus, planet yang tertutup awan tebal berwarna kekuningan.",
      `Awan itu memerangkap panas, jadi suhunya sekitar ${fact("venus", "Suhu permukaan")}. Venus adalah planet terpanas, lebih panas dari Merkurius!`,
      "Uniknya, Venus berputar ke arah terbalik, dan satu harinya lebih lama daripada satu tahunnya!",
    ],
  },
  {
    id: "earth",
    title: "Bumi",
    lines: [
      "Hore, ini rumah kita, Bumi! Satu-satunya planet yang kita tahu punya makhluk hidup.",
      "Lihat birunya? Sekitar tujuh puluh persen permukaan Bumi tertutup air.",
      `Sumbu Bumi miring ${fact("earth", "Kemiringan sumbu")}. Kemiringan inilah yang membuat pergantian musim di banyak tempat.`,
    ],
  },
  {
    id: "moon",
    title: "Bulan",
    lines: [
      "Hai, Bulan! Ia setia menemani Bumi dan memantulkan cahaya Matahari.",
      "Dari Bumi, kita selalu melihat sisi Bulan yang sama, karena Bulan berputar sekali setiap kali mengelilingi Bumi.",
      "Tahun 1969, astronaut pertama kali mendarat di sini. Jejak kakinya masih ada, karena di Bulan tidak ada angin!",
    ],
  },
  {
    id: "mars",
    title: "Mars",
    lines: [
      "Mars, si planet merah! Warnanya berasal dari debu yang mengandung karat besi.",
      "Di Mars ada Olympus Mons, gunung berapi terbesar yang diketahui di tata surya. Tingginya sekitar dua setengah kali Gunung Everest!",
      "Mars punya dua bulan kecil bernama Phobos dan Deimos.",
    ],
  },
  {
    id: "asteroid-example",
    title: "Sabuk asteroid",
    lines: [
      "Awas, batu angkasa! Di antara Mars dan Jupiter ada sabuk asteroid, kumpulan batuan sisa pembentukan tata surya.",
      "Batu yang kamu lihat ini hanya model contoh, bukan asteroid tertentu.",
      "Tenang, di dunia nyata jarak antarasteroid sangat jauh, jadi pesawat bisa lewat tanpa tabrakan.",
    ],
  },
  {
    id: "jupiter",
    title: "Jupiter",
    lines: [
      "Wow, lihat raksasa ini! Jupiter adalah planet terbesar di tata surya.",
      `Walau besar, Jupiter berputar paling cepat. Satu harinya cuma sekitar ${fact("jupiter", "Satu hari (rotasi)")}!`,
      "Bintik Merah Raksasa itu badai yang lebih besar dari Bumi. Dan Jupiter tidak punya permukaan padat untuk didarati.",
    ],
  },
  {
    id: "saturn",
    title: "Saturnus",
    lines: [
      "Tadaa! Saturnus dengan cincinnya yang cantik.",
      "Cincinnya bukan piringan padat, melainkan miliaran bongkah es dan batu yang ikut berputar.",
      "Yang jingga di dekatnya itu Titan, satelit terbesar Saturnus. Ia diselimuti atmosfer tebal.",
    ],
  },
  {
    id: "uranus",
    title: "Uranus",
    lines: [
      "Halo, Uranus! Planet biru kehijauan yang dingin sekali.",
      `Sumbunya miring ${fact("uranus", "Kemiringan sumbu")}, jadi Uranus berputar sambil rebahan, seperti bola yang menggelinding!`,
      "Warna birunya berasal dari gas metana di atmosfernya.",
    ],
  },
  {
    id: "neptune",
    title: "Neptunus",
    lines: [
      "Kita sudah sampai di Neptunus, planet terjauh dari Matahari.",
      "Neptunus punya angin tercepat yang diketahui di tata surya. Wuuush!",
      "Dari sini, cahaya Matahari butuh sekitar 4 jam untuk tiba.",
    ],
  },
  {
    id: "pluto",
    title: "Pluto",
    lines: [
      "Nah, ini Pluto, si mungil dari kawasan jauh.",
      "Sejak tahun 2006, Pluto digolongkan sebagai planet katai, bukan planet kesembilan.",
      "Wahana New Horizons pernah memotret dataran es berbentuk hati di permukaannya. Manis, ya!",
    ],
  },
  {
    id: "comet-example",
    title: "Komet",
    lines: [
      "Lihat ekornya! Komet itu seperti bola salju kotor dari es dan debu. Ini model contoh, bukan komet tertentu.",
      "Saat mendekati Matahari, esnya menguap dan membentuk kepala berkabut serta ekor panjang.",
      "Ekor komet selalu mengarah menjauhi Matahari, bukan sekadar tertinggal di belakangnya.",
    ],
  },
  {
    id: "outro",
    title: "Misi selesai!",
    lines: [
      "Misi selesai, penjelajah hebat! Kamu sudah mengunjungi seluruh keluarga besar Matahari.",
      "Dari sini, lihat betapa luasnya tata surya kita. Padahal, ia hanyalah satu titik kecil di galaksi Bima Sakti.",
      "Pesawat Rumila siap mengantarmu lagi kapan saja. Pilih planet favoritmu, atau jelajahi bintang dan galaksi. Sampai jumpa di petualangan berikutnya!",
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
