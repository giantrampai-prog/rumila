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
  /** "kabin" = POV di dalam kapsul, "kupola" = POV di jendela kupola stasiun; selain itu kamera di luar */
  view?: "kabin" | "kupola";
}

export const MISI: MisiStop[] = [
  {
    id: "landasan",
    title: "Pagi di landasan",
    alt: [0, 0],
    lines: [
      "Selamat pagi, astronaut cilik! Kita berada di landasan peluncuran di pinggir pantai, di Pulau Biak, Papua. Lihat, bendera Merah Putih berkibar di mana-mana!",
      "Lihat roket putih raksasa itu. Tingginya seperti gedung dua puluh lantai! Di sebelahnya ada menara peluncuran, menara air, dan tangki-tangki bahan bakar.",
      "Hari ini kita ikut misi sungguhan: terbang dari darat sampai ke luar angkasa. Siap?",
    ],
  },
  {
    id: "tujuan-misi",
    title: "Kenapa ke luar angkasa?",
    alt: [0, 0],
    lines: [
      "Kenapa astronaut pergi ke luar angkasa? Banyak alasannya!",
      "Mereka bekerja di Stasiun Luar Angkasa Internasional untuk melakukan percobaan ilmiah, misalnya bagaimana tanaman tumbuh dan tubuh manusia berubah tanpa gravitasi.",
      "Mereka juga mengamati Bumi, merawat peralatan, dan belajar hidup lama di angkasa, sebagai latihan sebelum manusia pergi ke Bulan dan Mars.",
    ],
  },
  {
    id: "baju-antariksa",
    title: "Baju antariksa",
    alt: [0, 0],
    lines: [
      "Itu astronaut kita! Ia sudah berlatih bertahun-tahun, termasuk berlatih di kolam renang raksasa untuk merasakan gerak seperti melayang.",
      "Baju antariksanya sangat istimewa. Baju ini berisi udara untuk bernapas, menjaga tekanan tubuh, dan melindungi dari panas maupun dingin.",
      "Kaca helmnya berwarna emas untuk melindungi mata dari sinar Matahari yang sangat terang.",
    ],
  },
  {
    id: "naik-kapsul",
    title: "Naik ke kapsul",
    alt: [0, 0],
    lines: [
      "Astronaut naik lift di menara, menyeberangi jembatan, lalu masuk ke kapsul di puncak roket.",
      "Kapsul adalah satu-satunya bagian roket yang ditempati manusia. Bagian roket lainnya kebanyakan berisi bahan bakar.",
    ],
  },
  {
    id: "dalam-kapsul",
    title: "Di dalam kapsul",
    alt: [0, 0],
    view: "kabin",
    lines: [
      "Sekarang kita ikut masuk ke dalam kapsul. Lihat, ada kursi khusus, layar-layar kendali, dan jendela kecil untuk melihat langit.",
      "Astronaut duduk dan memasang sabuk pengaman dengan erat. Kursinya dibentuk pas dengan tubuhnya agar nyaman saat roket melaju sangat kencang.",
      "Lihat boneka kecil yang tergantung itu. Sekarang ia menjuntai ke bawah karena ditarik gravitasi Bumi. Perhatikan terus, ya. Nanti ada kejutan!",
    ],
  },
  {
    id: "hitung-mundur",
    title: "Hitung mundur",
    alt: [0, 0],
    lines: [
      "Semua sistem siap. Jembatan menara menjauh dari roket. Ayo hitung mundur bersama!",
      "Sepuluh, sembilan, delapan, tujuh, enam, lima, empat, tiga, dua, satu...",
    ],
  },
  {
    id: "lepas-landas",
    title: "Lepas landas!",
    alt: [0, 3],
    lines: [
      "Meluncur! Mesin roket menyemburkan gas yang sangat panas ke bawah dengan kuat.",
      "Semburan ke bawah itu mendorong roket naik ke atas. Seperti balon yang melesat saat udaranya keluar. Wuuusss!",
    ],
  },
  {
    id: "gaya-g",
    title: "Terasa berat!",
    alt: [3, 8],
    view: "kabin",
    lines: [
      "Di dalam kapsul, astronaut merasa tubuhnya tertekan ke kursi, sampai tiga kali lebih berat dari biasanya!",
      "Ini karena roket terus bertambah cepat. Rasanya seperti saat mobil tiba-tiba ngebut dan punggungmu terdorong ke jok. Perhatikan layar gaya G naik.",
    ],
  },
  {
    id: "troposfer",
    title: "Troposfer",
    alt: [8, 12],
    lines: [
      "Kita melewati troposfer, lapisan udara paling bawah. Di sinilah awan, hujan, dan angin terjadi. Burung dan pesawat terbang juga ada di lapisan ini.",
      "Semakin tinggi, udaranya semakin dingin dan semakin tipis.",
    ],
  },
  {
    id: "stratosfer",
    title: "Stratosfer",
    alt: [12, 50],
    lines: [
      "Sekarang stratosfer! Di sini ada lapisan ozon, seperti tabir surya raksasa untuk Bumi. Ozon menahan sebagian besar sinar ultraviolet yang berbahaya.",
      "Lihat langitnya, warna birunya makin gelap karena udaranya makin tipis.",
    ],
  },
  {
    id: "mesosfer",
    title: "Mesosfer",
    alt: [50, 80],
    lines: [
      "Selamat datang di mesosfer, lapisan udara paling dingin. Suhunya bisa sampai sekitar minus sembilan puluh derajat Celsius!",
      "Lihat kilatan cahaya itu! Itu meteor, batu angkasa kecil yang terbakar habis saat menabrak udara. Mesosfer melindungi Bumi dari hujan batu angkasa.",
    ],
  },
  {
    id: "pisah-tahap",
    title: "Tahap pertama lepas",
    alt: [80, 95],
    lines: [
      "Bahan bakar tahap pertama sudah habis. Klik! Tahap pertama dilepas dan jatuh kembali.",
      "Roket jadi jauh lebih ringan, lalu mesin tahap kedua menyala untuk mendorong kita lebih tinggi dan lebih cepat.",
    ],
  },
  {
    id: "garis-karman",
    title: "Garis Kármán",
    alt: [95, 110],
    lines: [
      "Kita melewati ketinggian seratus kilometer, garis Kármán. Banyak ilmuwan memakai garis ini sebagai batas antara langit Bumi dan luar angkasa.",
      "Lihat, langitnya sudah hitam dan bintang-bintang mulai tampak. Selamat, kamu sudah di luar angkasa!",
    ],
  },
  {
    id: "gravitasi",
    title: "Gravitasi & orbit",
    alt: [110, 250],
    lines: [
      "Tahukah kamu? Gravitasi adalah tarikan yang membuat semua benda jatuh ke Bumi. Gravitasi juga yang menahan kita tetap berdiri di tanah.",
      "Supaya tidak jatuh kembali, kapsul harus melaju sangat cepat ke samping, sekitar dua puluh delapan ribu kilometer per jam!",
      "Kapsul tetap jatuh, tetapi karena begitu cepat, ia jatuh mengelilingi Bumi dan tidak pernah menyentuh tanah. Itulah yang disebut mengorbit.",
    ],
  },
  {
    id: "tanpa-bobot",
    title: "Melayang!",
    alt: [250, 380],
    view: "kabin",
    lines: [
      "Mesin dimatikan. Lihat bonekanya! Sekarang ia melayang ke mana-mana. Inilah kejutannya!",
      "Astronaut juga ikut melayang. Karena kapsul dan semua isinya jatuh bersama-sama mengelilingi Bumi, tidak ada yang menekan kursi. Rasanya seperti tanpa bobot.",
    ],
  },
  {
    id: "termosfer",
    title: "Termosfer & aurora",
    alt: [380, 400],
    lines: [
      "Kita berada di termosfer. Udaranya sudah sangat tipis.",
      "Cahaya hijau yang menari itu aurora, muncul saat partikel dari Matahari menabrak udara di lapisan ini. Dan lihat di depan, itu Stasiun Luar Angkasa Internasional!",
    ],
  },
  {
    id: "merapat",
    title: "Merapat ke stasiun",
    alt: [400, 400],
    lines: [
      "Pelan-pelan, kapsul merapat ke Stasiun Luar Angkasa. Klik! Pintu tersambung dengan aman.",
      "Stasiun ini sebesar lapangan sepak bola dan mengelilingi Bumi sekitar sembilan puluh menit sekali. Jadi para astronaut bisa melihat matahari terbit sekitar enam belas kali sehari!",
    ],
  },
  {
    id: "kupola",
    title: "Jendela kupola",
    alt: [400, 400],
    view: "kupola",
    lines: [
      "Astronaut masuk ke stasiun dan melayang ke kupola, ruang dengan jendela paling besar. Wah, lihat Bumi kita! Ada laut biru, awan putih, dan daratan.",
      "Di stasiun, astronaut tidur di kantong tidur yang diikat ke dinding supaya tidak melayang ke mana-mana. Mereka minum dari kantong bersedotan, karena air di sini bisa melayang menjadi bola-bola kecil!",
    ],
  },
  {
    id: "bertugas",
    title: "Bertugas di luar",
    alt: [400, 400],
    lines: [
      "Hari ini astronaut kita bertugas memeriksa panel surya, sayap raksasa yang mengubah cahaya Matahari menjadi listrik untuk stasiun.",
      "Ia keluar untuk berjalan di luar angkasa, dengan tali pengaman yang selalu terpasang. Di bawahnya, Bumi tampak bulat dan biru, diselimuti garis tipis atmosfer yang bercahaya.",
    ],
  },
  {
    id: "eksosfer",
    title: "Eksosfer & satelit",
    alt: [400, 400],
    lines: [
      "Lihat ke atas! Di sana ada eksosfer, lapisan udara paling luar, tempat udaranya hampir tidak ada.",
      "Banyak satelit berputar mengelilingi Bumi. Ada satelit cuaca, satelit penunjuk arah, dan satelit yang mengirim siaran televisi dan internet ke rumahmu.",
    ],
  },
  {
    id: "penutup",
    title: "Misi berhasil",
    alt: [400, 400],
    lines: [
      "Misi berhasil, astronaut hebat! Kita sudah melewati troposfer, stratosfer, mesosfer, termosfer, sampai melihat eksosfer.",
      "Kamu juga sudah tahu tentang gravitasi, orbit, dan rasanya melayang. Ceritakan petualangan ini ke Ayah dan Ibu, ya. Sampai jumpa di misi berikutnya!",
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
  /** adegan misi yang potongan narasinya dipakai sebagai suara item ini */
  stop?: string;
  /** warna penanda */
  color: string;
}

export const JELAJAH: JelajahItem[] = [
  { id: "roket", name: "Roket", kind: "part", stop: "landasan", color: "#ffffff", desc: "Kendaraan yang membawa astronaut dari darat ke luar angkasa." },
  { id: "kapsul", name: "Kapsul", kind: "part", stop: "dalam-kapsul", color: "#e8edf5", desc: "Ruang kecil di puncak roket tempat astronaut duduk." },
  { id: "tahap-2", name: "Tahap kedua", kind: "part", stop: "pisah-tahap", color: "#dfe6f0", desc: "Bagian tengah roket yang menyala setelah tahap pertama lepas." },
  { id: "tahap-1", name: "Tahap pertama", kind: "part", stop: "pisah-tahap", color: "#d5dde8", desc: "Bagian paling besar, berisi banyak bahan bakar untuk mengangkat roket." },
  { id: "mesin", name: "Mesin roket", kind: "part", stop: "lepas-landas", color: "#ff9a3c", desc: "Menyemburkan gas panas ke bawah sehingga roket terdorong ke atas." },
  { id: "astronot", name: "Agam", kind: "part", stop: "baju-antariksa", color: "#ffd166", desc: "Agam, astronaut cilik kita! Baju antariksanya membuatnya bisa bernapas dan tetap aman." },
  { id: "menara", name: "Menara", kind: "part", stop: "naik-kapsul", color: "#ff6b6b", desc: "Menara peluncuran dengan jembatan untuk masuk ke kapsul." },
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

/**
 * Narasi Misi Terbang: SATU file suara untuk semua adegan (jeda ±1 detik antaradegan).
 * cues = detik mulai tiap adegan (urut sesuai MISI), dari timestamp rekaman.
 * Kosong = belum ada rekaman (adegan memakai waktu baca, teks tampil kecil).
 */
export const MISI_AUDIO: MisiAudioPart[] = [
  {
    // Suara "Sulafat" (SuaraKisah), 6:42, versi Rinoya. Batas adegan = jeda hening asli rekaman, diselaraskan ke batas kalimat.
    src: "/roket/voice/misi-02.m4a",
    first: 0,
    cues: [0, 28.74, 54.36, 78.35, 92.87, 121.47, 132.9, 148.48, 164.19, 178.01, 192.4, 213.64, 226.65, 243.69, 270.01, 285.88, 300.04, 318.32, 342.54, 363.75, 380.88],
  },
];

/** Rekaman khusus per item Jelajah (opsional). Tanpa ini, item memakai potongan narasi misi (`stop`). */
export const JELAJAH_AUDIO: Record<string, string> = {};

/** Lama persinggahan tanpa rekaman: perkiraan waktu baca (±14 karakter/detik) + jeda. */
export const dwellSeconds = (s: MisiStop) => Math.max(5, s.lines.join(" ").length / 14 + 1.5);
