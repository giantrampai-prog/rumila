// Modul "Roket & Astronot 3D": naskah misi peluncuran + item jelajah.
// Naskah suara: docs/roket/naskah-misi-roket.txt (bagian A = Misi Terbang, bagian B = Jelajah).
// Setiap persinggahan punya rentang ketinggian (km) — animasi roket naik mengikuti narasi persinggahan itu.
// Gaya narasi: ceria, menyapa anak ("kita", "kamu"), kalimat pendek; fakta tetap akurat & dibulatkan.

export interface MisiStop {
  id: string;
  title: string;
  lines: string[];
  /** ketinggian roket (km) di awal & akhir persinggahan */
  alt: [number, number];
}

export const MISI: MisiStop[] = [
  {
    id: "landasan",
    title: "Pagi di landasan",
    alt: [0, 0],
    lines: [
      "Selamat pagi, astronaut cilik! Kita ada di landasan peluncuran.",
      "Lihat roket raksasa itu. Tingginya seperti gedung dua puluh lantai!",
      "Hari ini kita akan terbang dari darat sampai ke luar angkasa. Siap?",
    ],
  },
  {
    id: "naik-kapsul",
    title: "Naik ke kapsul",
    alt: [0, 0],
    lines: [
      "Itu astronaut kita! Ia memakai baju antariksa yang memberi udara untuk bernapas dan melindungi tubuhnya.",
      "Ia naik lift di menara, menyeberangi jembatan, lalu masuk ke kapsul di puncak roket.",
      "Sabuk pengaman dipasang. Pintu kapsul ditutup rapat.",
    ],
  },
  {
    id: "hitung-mundur",
    title: "Hitung mundur",
    alt: [0, 0],
    lines: [
      "Semua sistem siap. Ayo hitung mundur bersama!",
      "Sepuluh, sembilan, delapan, tujuh, enam, lima, empat, tiga, dua, satu...",
    ],
  },
  {
    id: "lepas-landas",
    title: "Lepas landas!",
    alt: [0, 3],
    lines: [
      "Meluncur! Mesin roket menyemburkan gas yang sangat panas ke bawah dengan kuat.",
      "Semburan ke bawah itu mendorong roket naik ke atas. Wuuusss!",
    ],
  },
  {
    id: "troposfer",
    title: "Troposfer",
    alt: [3, 12],
    lines: [
      "Kita masuk troposfer, lapisan udara paling bawah.",
      "Di sinilah awan, hujan, dan angin terjadi. Pesawat terbang juga melintas di lapisan ini.",
      "Semakin tinggi, udaranya semakin dingin.",
    ],
  },
  {
    id: "stratosfer",
    title: "Stratosfer",
    alt: [12, 50],
    lines: [
      "Sekarang stratosfer! Di sini ada lapisan ozon.",
      "Ozon seperti tabir surya raksasa untuk Bumi. Ia menahan sebagian besar sinar ultraviolet yang berbahaya dari Matahari.",
      "Lihat langitnya, warna birunya makin gelap.",
    ],
  },
  {
    id: "mesosfer",
    title: "Mesosfer",
    alt: [50, 80],
    lines: [
      "Selamat datang di mesosfer, lapisan udara paling dingin. Suhunya bisa sampai sekitar minus sembilan puluh derajat Celsius!",
      "Lihat kilatan cahaya itu! Itu meteor, batu angkasa kecil yang terbakar habis saat menabrak udara di lapisan ini.",
    ],
  },
  {
    id: "pisah-tahap",
    title: "Tahap pertama lepas",
    alt: [80, 95],
    lines: [
      "Bahan bakar tahap pertama sudah habis. Klik! Tahap pertama dilepas.",
      "Roket jadi lebih ringan, lalu mesin tahap kedua menyala untuk mendorong kita lebih tinggi.",
    ],
  },
  {
    id: "garis-karman",
    title: "Garis Kármán",
    alt: [95, 110],
    lines: [
      "Kita melewati ketinggian seratus kilometer, garis Kármán.",
      "Banyak ilmuwan memakai garis ini sebagai batas antara langit Bumi dan luar angkasa. Selamat, kamu sudah di luar angkasa!",
    ],
  },
  {
    id: "termosfer",
    title: "Termosfer",
    alt: [110, 420],
    lines: [
      "Ini termosfer. Udaranya sudah sangat tipis.",
      "Cahaya hijau yang menari itu aurora, muncul saat partikel dari Matahari menabrak udara di lapisan ini.",
      "Stasiun Luar Angkasa Internasional juga mengorbit di sini, sekitar empat ratus kilometer di atas Bumi.",
    ],
  },
  {
    id: "eksosfer",
    title: "Eksosfer",
    alt: [420, 900],
    lines: [
      "Kita menuju eksosfer, lapisan paling luar. Udaranya hampir tidak ada.",
      "Lihat ke bawah! Bumi tampak bulat dan biru, diselimuti garis tipis atmosfer yang bercahaya.",
    ],
  },
  {
    id: "mengorbit",
    title: "Mengorbit & melayang",
    alt: [900, 900],
    lines: [
      "Mesin dimatikan. Sekarang kita mengorbit, terus mengelilingi Bumi dengan sangat cepat.",
      "Di sini semua benda melayang, termasuk astronaut kita! Ia keluar untuk berjalan di luar angkasa, dengan tali pengaman yang terpasang ke kapsul.",
    ],
  },
  {
    id: "penutup",
    title: "Misi berhasil",
    alt: [900, 900],
    lines: [
      "Misi berhasil, astronaut hebat! Kita sudah melewati troposfer, stratosfer, mesosfer, termosfer, sampai eksosfer.",
      "Ingat urutannya, dan ceritakan petualangan ini ke Ayah dan Ibu, ya. Sampai jumpa di misi berikutnya!",
    ],
  },
];

/** Persinggahan pertama yang sudah di udara (setelah hitung mundur). */
export const LIFTOFF = MISI.findIndex((s) => s.id === "lepas-landas");
export const COUNTDOWN = MISI.findIndex((s) => s.id === "hitung-mundur");

/* ---------------- Jelajah ---------------- */

export type JelajahKind = "part" | "layer";

export interface JelajahItem {
  id: string;
  name: string;
  kind: JelajahKind;
  /** satu kalimat singkat untuk kartu */
  desc: string;
  /** untuk lapisan: persinggahan misi yang narasinya dipakai sebagai suara */
  stop?: string;
  /** warna penanda */
  color: string;
}

export const JELAJAH: JelajahItem[] = [
  { id: "roket", name: "Roket", kind: "part", color: "#ffffff", desc: "Kendaraan yang membawa astronaut dari darat ke luar angkasa." },
  { id: "kapsul", name: "Kapsul", kind: "part", color: "#e8edf5", desc: "Ruang kecil di puncak roket tempat astronaut duduk." },
  { id: "tahap-2", name: "Tahap kedua", kind: "part", color: "#dfe6f0", desc: "Bagian tengah roket yang menyala setelah tahap pertama lepas." },
  { id: "tahap-1", name: "Tahap pertama", kind: "part", color: "#d5dde8", desc: "Bagian paling besar, berisi banyak bahan bakar untuk mengangkat roket." },
  { id: "mesin", name: "Mesin roket", kind: "part", color: "#ff9a3c", desc: "Menyemburkan gas panas ke bawah sehingga roket terdorong ke atas." },
  { id: "astronot", name: "Astronaut", kind: "part", color: "#ffd166", desc: "Penjelajah angkasa yang memakai baju khusus agar bisa bernapas dan tetap aman." },
  { id: "menara", name: "Menara", kind: "part", color: "#ff6b6b", desc: "Menara peluncuran dengan jembatan untuk masuk ke kapsul." },
  { id: "troposfer", name: "Troposfer", kind: "layer", stop: "troposfer", color: "#6fc3ff", desc: "Lapisan terbawah, tempat awan dan cuaca." },
  { id: "stratosfer", name: "Stratosfer", kind: "layer", stop: "stratosfer", color: "#6f8bff", desc: "Lapisan tempat ozon menahan sinar ultraviolet." },
  { id: "mesosfer", name: "Mesosfer", kind: "layer", stop: "mesosfer", color: "#9b7bff", desc: "Lapisan paling dingin, tempat meteor terbakar." },
  { id: "termosfer", name: "Termosfer", kind: "layer", stop: "termosfer", color: "#c77dff", desc: "Lapisan aurora dan Stasiun Luar Angkasa." },
  { id: "eksosfer", name: "Eksosfer", kind: "layer", stop: "eksosfer", color: "#ff8fd1", desc: "Lapisan paling luar, udaranya hampir tidak ada." },
];

/* ---------------- rekaman suara ---------------- */

export interface MisiAudioPart {
  src: string;
  /** indeks persinggahan pertama yang dicakup */
  first: number;
  /** detik mulai tiap persinggahan, relatif ke file */
  cues: number[];
}

/** Narasi Misi Terbang. Kosong = belum ada rekaman (persinggahan memakai waktu baca, teks tampil kecil). */
export const MISI_AUDIO: MisiAudioPart[] = [];

/** Rekaman per item Jelajah (bagian roket). Lapisan memakai potongan narasi misi. */
export const JELAJAH_AUDIO: Record<string, string> = {};

/** Lama persinggahan tanpa rekaman: perkiraan waktu baca (±14 karakter/detik) + jeda. */
export const dwellSeconds = (s: MisiStop) => Math.max(5, s.lines.join(" ").length / 14 + 1.5);
