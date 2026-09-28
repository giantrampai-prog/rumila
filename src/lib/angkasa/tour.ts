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

// Naskah v3 (docs/angkasa/naskah-tur-terbang-v3.md): tempo pelan, tiap persinggahan diakhiri kalimat pamit ke
// tujuan berikutnya, Bumi diperpanjang. Teks = persis yang dibacakan rekaman (angka ditulis dalam kata).
export const TOUR: TourStop[] = [
  {
    id: "intro",
    title: "Briefing misi",
    lines: [
      "Halo, penjelajah cilik! Aku Agam, pemandumu hari ini di pesawat antariksa Rinoya.",
      "Misi kita istimewa: mengunjungi keluarga besar Matahari, yaitu delapan planet, Bulan, dan beberapa tetangga kecilnya.",
      "Di setiap persinggahan, perhatikan kartu-kartu yang muncul, ya. Isinya fakta seru yang bisa kamu ceritakan ke Ayah dan Ibu.",
      "Satu rahasia: di tur ini jarak antarplanet kita rapatkan. Aslinya jauuuh sekali. Cahaya Matahari saja butuh sekitar delapan menit untuk sampai ke Bumi!",
      "Sabuk pengaman sudah terpasang? Mesin menyala. Tiga… dua… satu… meluncur! Tujuan pertama kita: pusat tata surya.",
    ],
  },
  {
    id: "sun",
    title: "Matahari",
    lines: [
      "Wah, silau sekali! Inilah Matahari.",
      "Matahari itu sebuah bintang, bola gas raksasa yang sangat panas. Permukaannya sekitar lima ribu lima ratus derajat Celsius.",
      "Matahari besar sekali. Lebih dari satu juta Bumi bisa masuk ke dalamnya!",
      "Tanpa cahaya dan hangat Matahari, tidak akan ada siang, tumbuhan tidak bisa tumbuh, dan Bumi akan membeku.",
      "Sekarang kita terbang ke planet yang paling dekat dengan Matahari. Pegangan, ya!",
    ],
  },
  {
    id: "mercury",
    title: "Merkurius",
    lines: [
      "Ini Merkurius, planet paling kecil dan paling dekat dengan Matahari.",
      "Merkurius berlari cepat mengelilingi Matahari. Satu tahun di sini cuma delapan puluh delapan hari!",
      "Merkurius hampir tidak punya udara. Siangnya panas membara, malamnya dingin membeku. Brrr!",
      "Permukaannya penuh kawah, bekas ditabrak batu-batu angkasa sejak dulu sekali.",
      "Ayo lanjut ke tetangga berikutnya, planet yang berselimut awan.",
    ],
  },
  {
    id: "venus",
    title: "Venus",
    lines: [
      "Ini Venus, planet yang terbungkus awan tebal kekuningan.",
      "Awannya memerangkap panas seperti selimut. Suhunya sekitar empat ratus enam puluh empat derajat. Venus adalah planet paling panas, lebih panas dari Merkurius!",
      "Venus berputar sangat pelan dan ke arah terbalik. Satu harinya lebih lama daripada satu tahunnya!",
      "Dari Bumi, Venus sering terlihat sangat terang saat senja atau subuh. Orang menyebutnya bintang kejora.",
      "Sekarang… kita pulang sebentar. Tujuan berikutnya adalah planet yang paling spesial untuk kita.",
    ],
  },
  {
    id: "earth",
    title: "Bumi",
    lines: [
      "Hore, ini rumah kita, Bumi! Planet ketiga dari Matahari.",
      "Bumi adalah satu-satunya planet yang kita tahu punya makhluk hidup: manusia, hewan, dan tumbuhan.",
      "Lihat warna birunya? Itu lautan! Sekitar tujuh puluh satu persen permukaan Bumi tertutup air.",
      "Yang putih berputar-putar itu awan. Awan membawa hujan, supaya sungai dan danau terisi lagi.",
      "Bumi diselimuti udara yang disebut atmosfer. Udara ini kita hirup setiap hari, dan melindungi kita dari panas Matahari dan batu angkasa.",
      "Jarak Bumi dari Matahari pas sekali: tidak terlalu panas, tidak terlalu dingin. Karena itu air bisa tetap cair, dan makhluk hidup bisa tinggal di sini.",
      "Bumi berputar seperti gasing. Satu putaran butuh sekitar dua puluh empat jam, dan itulah yang membuat siang dan malam.",
      "Sambil berputar, Bumi juga mengelilingi Matahari. Satu putaran penuh butuh tiga ratus enam puluh lima hari, atau satu tahun. Setiap kali kamu berulang tahun, Bumi sudah sekali keliling Matahari!",
      "Sumbu Bumi agak miring. Kemiringan inilah yang membuat ada musim di banyak tempat.",
      "Coba cari Indonesia! Negara kita punya lebih dari tujuh belas ribu pulau, berjajar di sekitar garis khatulistiwa.",
      "Bumi punya teman setia yang selalu menemani. Yuk, kita sapa dia!",
    ],
  },
  {
    id: "moon",
    title: "Bulan",
    lines: [
      "Hai, Bulan! Bulan adalah satelit alami Bumi. Jaraknya sekitar tiga ratus delapan puluh empat ribu kilometer.",
      "Bulan tidak bercahaya sendiri. Ia memantulkan cahaya Matahari, makanya bisa terlihat terang di malam hari.",
      "Bulan mengelilingi Bumi kira-kira sebulan sekali. Dari Bumi, kita selalu melihat sisi Bulan yang sama.",
      "Tahun seribu sembilan ratus enam puluh sembilan, manusia pertama kali mendarat di sini. Jejak kakinya masih ada, karena di Bulan tidak ada angin!",
      "Sekarang kita tinggalkan Bumi dan Bulan, menuju planet yang berwarna merah.",
    ],
  },
  {
    id: "mars",
    title: "Mars",
    lines: [
      "Inilah Mars, si planet merah! Warnanya dari debu yang mengandung karat besi.",
      "Di Mars ada Olympus Mons, gunung berapi terbesar di tata surya. Tingginya sekitar dua setengah kali Gunung Everest!",
      "Satu hari di Mars hampir sama dengan di Bumi, sekitar dua puluh empat setengah jam.",
      "Mars punya dua bulan kecil bernama Phobos dan Deimos. Robot-robot penjelajah juga sedang meneliti Mars sekarang!",
      "Setelah Mars, hati-hati… kita akan melewati daerah penuh batu angkasa.",
    ],
  },
  {
    id: "asteroid-example",
    title: "Sabuk asteroid",
    lines: [
      "Awas, batu angkasa! Di antara Mars dan Jupiter ada sabuk asteroid.",
      "Asteroid adalah batuan sisa sejak tata surya terbentuk. Batu yang kamu lihat ini hanya model contoh.",
      "Tenang saja, aslinya jarak antarasteroid sangat jauh, jadi pesawat bisa lewat tanpa tabrakan.",
      "Di depan sana sudah menunggu planet paling besar. Siap-siap terpukau!",
    ],
  },
  {
    id: "jupiter",
    title: "Jupiter",
    lines: [
      "Wow, lihat raksasa ini! Jupiter adalah planet terbesar. Lebarnya sekitar sebelas kali Bumi.",
      "Jupiter terbuat dari gas, jadi tidak punya tanah untuk didarati.",
      "Walau raksasa, Jupiter berputar paling cepat. Satu harinya cuma sekitar sepuluh jam!",
      "Lihat bintik kemerahan itu? Itu Bintik Merah Raksasa, badai yang lebih besar dari Bumi dan sudah diamati lebih dari seratus lima puluh tahun.",
      "Berikutnya, planet yang memakai cincin paling cantik!",
    ],
  },
  {
    id: "saturn",
    title: "Saturnus",
    lines: [
      "Tadaa! Inilah Saturnus dengan cincinnya yang indah.",
      "Cincinnya bukan piringan padat, tapi miliaran bongkah es dan batu yang ikut berputar.",
      "Saturnus sangat ringan untuk ukurannya. Kalau ada kolam air yang cukup besar, Saturnus bisa mengapung!",
      "Yang jingga di dekatnya itu Titan, bulan terbesar Saturnus. Titan diselimuti udara tebal berkabut.",
      "Kita terbang makin jauh dari Matahari. Makin jauh, makin dingin… brrr!",
    ],
  },
  {
    id: "uranus",
    title: "Uranus",
    lines: [
      "Halo, Uranus! Planet biru kehijauan ini adalah planet terdingin.",
      "Sumbunya miring hampir tidur, jadi Uranus berputar sambil rebahan, seperti bola yang menggelinding!",
      "Warna birunya berasal dari gas metana di udaranya.",
      "Satu planet lagi, yang paling jauh. Ayo kita ke sana!",
    ],
  },
  {
    id: "neptune",
    title: "Neptunus",
    lines: [
      "Kita sampai di Neptunus, planet terjauh dari Matahari.",
      "Di Neptunus bertiup angin tercepat di tata surya, lebih cepat dari pesawat jet. Wuuush!",
      "Dari sini, cahaya Matahari butuh sekitar empat jam untuk tiba.",
      "Tapi tunggu, masih ada si mungil yang tinggal lebih jauh lagi!",
    ],
  },
  {
    id: "pluto",
    title: "Pluto",
    lines: [
      "Nah, ini Pluto, si mungil dari kawasan jauh. Pluto lebih kecil daripada Bulan kita!",
      "Sejak tahun dua ribu enam, Pluto disebut planet katai, bukan planet kesembilan.",
      "Wahana New Horizons pernah memotret dataran es berbentuk hati di permukaannya. Manis, ya!",
      "Sebelum pulang, lihat! Ada tamu berekor yang sedang lewat.",
    ],
  },
  {
    id: "comet-example",
    title: "Komet",
    lines: [
      "Ini komet, seperti bola salju kotor dari es dan debu. Ini model contoh, ya.",
      "Saat mendekati Matahari, esnya menguap dan membentuk ekor panjang yang berkilau.",
      "Ekor komet selalu mengarah menjauhi Matahari.",
      "Sekarang kita naik tinggi-tinggi, untuk melihat seluruh tata surya sekaligus.",
    ],
  },
  {
    id: "outro",
    title: "Misi selesai!",
    lines: [
      "Misi selesai, penjelajah hebat! Kamu sudah mengunjungi seluruh keluarga besar Matahari.",
      "Lihat betapa luasnya tata surya kita. Padahal, ia hanyalah satu bagian kecil dari galaksi Bima Sakti.",
      "Planet mana yang paling kamu suka? Kamu bisa mengunjunginya lagi kapan saja. Sampai jumpa di petualangan berikutnya!",
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
