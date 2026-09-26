// Tur bernarasi Jelajah Tubuh: kamera berpindah dari lapisan ke organ mengikuti narasi.
// Naskah suara: docs/tubuh/naskah-tur-tubuh.txt (satu file suara, jeda ±1 detik antaradegan).
// Gaya: ceria, menyapa anak ("kita", "kamu"), kalimat pendek; fakta dibulatkan & akurat.

import type { LayerId } from "./types";

export interface TurStop {
  id: string;
  title: string;
  lines: string[];
  /** organ yang diperbesar sendirian; null = seluruh tubuh */
  focus: string | null;
  /** lapisan yang tampak saat seluruh tubuh (default: tulang + organ) */
  layers?: LayerId[];
}

export const TUR: TurStop[] = [
  {
    id: "pembuka",
    title: "Halo, penjelajah!",
    focus: null,
    layers: ["skin"],
    lines: [
      "Halo, penjelajah cilik! Hari ini kita akan berpetualang ke tempat yang sangat dekat, yaitu tubuh kita sendiri!",
      "Tubuh manusia seperti mesin yang luar biasa. Setiap bagiannya punya tugas, dan semuanya bekerja sama setiap detik, bahkan saat kita tidur.",
    ],
  },
  {
    id: "kulit",
    title: "Kulit",
    focus: null,
    layers: ["skin"],
    lines: [
      "Yang paling luar adalah kulit. Kulit adalah organ terbesar di tubuh kita!",
      "Kulit melindungi tubuh dari kuman, menjaga suhu tubuh, dan membuat kita bisa merasakan sentuhan, panas, dan dingin.",
    ],
  },
  {
    id: "otot",
    title: "Otot",
    focus: null,
    layers: ["muscle"],
    lines: [
      "Sekarang kita buka kulitnya. Lihat, ini otot! Tubuh kita punya lebih dari enam ratus otot.",
      "Otot menarik tulang supaya kita bisa berjalan, melompat, tersenyum, dan berkedip. Makin sering bergerak, otot makin kuat.",
    ],
  },
  {
    id: "tulang",
    title: "Tulang",
    focus: null,
    layers: ["bone"],
    lines: [
      "Di balik otot ada rangka. Orang dewasa punya dua ratus enam tulang.",
      "Bayi punya lebih banyak tulang, sekitar tiga ratus, tetapi sebagian menyatu saat tumbuh besar. Tulang menopang tubuh dan melindungi organ di dalamnya.",
    ],
  },
  {
    id: "otak",
    title: "Otak",
    focus: "brain_l",
    lines: [
      "Ini otak, pusat kendali tubuh kita. Otak dilindungi tengkorak yang keras.",
      "Di dalamnya ada sekitar delapan puluh enam miliar sel saraf yang saling mengirim pesan. Otak membuat kita bisa berpikir, mengingat, merasa, dan bermimpi!",
    ],
  },
  {
    id: "mata",
    title: "Mata",
    focus: "eye_l",
    lines: [
      "Ini mata. Mata menangkap cahaya, lalu otak mengubahnya menjadi gambar yang kita lihat.",
      "Kita berkedip ribuan kali setiap hari. Kedipan membersihkan dan membasahi mata supaya tidak kering.",
    ],
  },
  {
    id: "telinga",
    title: "Telinga",
    focus: "ear_l",
    lines: [
      "Ini telinga. Suara masuk seperti getaran, lalu diteruskan ke dalam telinga.",
      "Di dalam telinga ada tulang terkecil di tubuh, namanya sanggurdi, ukurannya lebih kecil dari sebutir beras! Telinga juga membantu kita menjaga keseimbangan.",
    ],
  },
  {
    id: "hidung",
    title: "Hidung",
    focus: "nose",
    lines: [
      "Ini hidung. Hidung membantu kita mencium bau, dari wangi bunga sampai harum masakan.",
      "Rambut halus dan lendir di dalam hidung menyaring debu dan kuman sebelum udara masuk ke paru-paru.",
    ],
  },
  {
    id: "mulut",
    title: "Mulut & gigi",
    focus: "mouth",
    lines: [
      "Ini mulut, tempat makanan mulai dicerna. Gigi memotong dan mengunyah, lidah membantu mengecap rasa.",
      "Anak-anak punya dua puluh gigi susu, lalu diganti tiga puluh dua gigi dewasa. Jangan lupa sikat gigi dua kali sehari, ya!",
    ],
  },
  {
    id: "paru",
    title: "Paru-paru",
    focus: "lung_r",
    lines: [
      "Tarik napas dalam-dalam! Udara masuk ke paru-paru. Paru-paru mengambil oksigen yang dibutuhkan tubuh, lalu membuang karbon dioksida saat kita mengembuskan napas.",
      "Kita bernapas sekitar dua puluh ribu kali setiap hari, tanpa perlu memikirkannya!",
    ],
  },
  {
    id: "jantung",
    title: "Jantung",
    focus: "heart",
    lines: [
      "Dug, dug, dug! Ini jantung, ukurannya kira-kira sebesar kepalan tanganmu.",
      "Jantung memompa darah ke seluruh tubuh, membawa oksigen dan makanan untuk setiap sel. Jantung berdetak sekitar seratus ribu kali sehari tanpa pernah istirahat.",
    ],
  },
  {
    id: "lambung",
    title: "Lambung",
    focus: "stomach",
    lines: [
      "Makanan yang kita telan meluncur ke lambung. Lambung seperti kantong yang bisa melar.",
      "Di sini makanan diaduk dan dicampur cairan asam yang kuat, sampai menjadi bubur halus.",
    ],
  },
  {
    id: "hati",
    title: "Hati",
    focus: "liver",
    lines: [
      "Ini hati, organ dalam yang paling besar. Hati punya lebih dari lima ratus tugas!",
      "Hati membersihkan darah dari zat yang tidak berguna, membuat cairan empedu untuk mencerna lemak, dan menyimpan cadangan energi.",
    ],
  },
  {
    id: "pankreas",
    title: "Pankreas",
    focus: "pancreas",
    lines: [
      "Ini pankreas, letaknya di belakang lambung.",
      "Pankreas membuat cairan pencernaan, dan juga insulin, zat yang mengatur kadar gula di dalam darah.",
    ],
  },
  {
    id: "usus",
    title: "Usus",
    focus: "jejunum",
    lines: [
      "Wah, panjang sekali! Ini usus halus. Panjangnya sekitar enam meter, tetapi terlipat rapi di dalam perut.",
      "Di usus halus, sari makanan diserap masuk ke darah, lalu dibawa ke seluruh tubuh.",
    ],
  },
  {
    id: "ginjal",
    title: "Ginjal",
    focus: "kidney_l",
    lines: [
      "Kita punya dua ginjal, bentuknya seperti kacang merah.",
      "Ginjal menyaring darah dan membuang sisa yang tidak dibutuhkan menjadi air seni. Karena itu, minum air putih yang cukup, ya!",
    ],
  },
  {
    id: "tangan",
    title: "Tangan",
    focus: "hand_l",
    lines: [
      "Lihat tanganmu! Setiap tangan punya dua puluh tujuh tulang.",
      "Karena itulah jari-jari kita bisa bergerak lincah untuk menulis, menggambar, dan bermain.",
    ],
  },
  {
    id: "kaki",
    title: "Kaki",
    focus: "foot_l",
    lines: [
      "Setiap kaki punya dua puluh enam tulang, yang bekerja sama dengan otot dan sendi.",
      "Kaki menopang seluruh berat tubuh saat kita berdiri, berjalan, dan berlari.",
    ],
  },
  {
    id: "penutup",
    title: "Jaga tubuhmu",
    focus: null,
    lines: [
      "Hebat, penjelajah! Kita sudah mengenal kulit, otot, tulang, otak, pancaindra, dan organ-organ di dalam tubuh.",
      "Supaya tubuh tetap sehat, makan makanan bergizi, minum air putih, tidur cukup, dan rajin bergerak. Sampai jumpa di petualangan berikutnya!",
    ],
  },
];

export interface TurAudioPart {
  src: string;
  /** indeks adegan pertama yang dicakup */
  first: number;
  /** detik mulai tiap adegan (dari timestamp rekaman) */
  cues: number[];
}

/** Narasi tur: SATU file suara. Kosong = belum ada rekaman (adegan memakai waktu baca, teks tampil kecil). */
export const TUR_AUDIO: TurAudioPart[] = [];

/** Lama adegan tanpa rekaman: perkiraan waktu baca (±14 karakter/detik) + jeda. */
export const turDwell = (s: TurStop) => Math.max(6, s.lines.join(" ").length / 14 + 1.5);
