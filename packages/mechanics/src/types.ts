// Kontrak mesin mekanik Slice 1 — logika murni, tanpa React, bisa dites di node.
// Alur satu ronde: buatRonde(paket, knobs, seed) → presenter menampilkan → anak menjawab → nilai(ronde, jawaban) → Hasil.
// Presenter tidak boleh menilai sendiri; semua kebenaran dan bukti datang dari fungsi nilai*.

import type { NavCommand, PaketDagang, PaketNavigasi, PaketPilah, PaketPola, PaketSimulasi, PaketUrutkan } from "@akademi/schema";

/** Nilai knob aktif (kunci = nama knob di paket). */
export type Knobs = Record<string, number>;

/** Hasil satu ronde: dicatat sebagai event `attempt`. `detail` = bukti mesin (lompat vs batu, blok vs optimal, dll). */
export interface Hasil {
  benar: boolean;
  detail: Record<string, unknown>;
}

/* ---------------- pilah ---------------- */

export interface RondePilahKelompok {
  mode: "kelompok";
  bins: PaketPilah["bins"];
  /** item yang ditampilkan, urutan acak; `bin` = jawaban benar (presenter tidak menampilkannya) */
  items: PaketPilah["items"];
}
export interface RondePilahPilih {
  mode: "pilih";
  promptKey: string;
  choices: PaketPilah["items"];
  /** id item yang benar */
  correct: string;
}
export type RondePilah = RondePilahKelompok | RondePilahPilih;
/** jawaban kelompok: itemId → binId · jawaban pilih: itemId */
export type JawabanPilah = Record<string, string> | string;

/* ---------------- urutkan ---------------- */

export interface RondeUrutkan {
  mode: PaketUrutkan["mode"];
  sequenceId: string;
  titleKey: string;
  /** urutan benar (id langkah) */
  correct: string[];
  /** langkah seperti yang ditampilkan: susun = diacak (dijamin ≠ benar), perbaiki = tepat satu pasang tertukar, dulu = 2 langkah diacak */
  shown: PaketUrutkan["sequences"][number]["steps"];
  /** indeks pasangan yang tertukar pada mode perbaiki */
  swapped?: [number, number];
  /** mode label: label benar per posisi (shown sudah urut): ["pertama", "lalu", …, "terakhir"] */
  labels?: LabelUrutan[];
}
export type LabelUrutan = "pertama" | "lalu" | "terakhir";
/** susun/perbaiki: urutan id akhir · dulu: id langkah yang dipilih sebagai "lebih dulu" · label: label yang dipasang per posisi */
export type JawabanUrutkan = string[] | string | { labels: string[] };

/* ---------------- dagang ---------------- */

export interface Pesanan { goodId: string; qty: number }

export interface RondeDagang {
  mode: PaketDagang["mode"];
  /** barang yang tersedia di lapak (ambil/hitung/subitasi/sisa): goodId → jumlah tersedia */
  tersedia: Record<string, number>;
  /** pesanan pembeli (ambil, subitasi, bayar, kembalian) */
  pesanan: Pesanan[];
  /** harga total (bayar/kembalian/lengkapi) dalam rupiah */
  harga: number;
  /** uang yang diberikan pembeli (kembalian) atau lembar yang ditukar (tukar) atau koin yang ditunjukkan (lengkapi) */
  dibayar: number;
  /** pecahan di laci (bayar/kembalian/tukar/lengkapi) */
  laci: number[];
  /** benda yang harus dihitung (hitung): goodId per benda, posisi acak diserahkan ke presenter */
  benda: string[];
  /** gabung: dua kelompok; sisa: jumlah awal & diambil */
  kelompok: [number, number];
  /** jawaban angka yang benar (hitung/gabung/sisa/subitasi) */
  target: number;
  /** rentang strip jawaban */
  strip: [number, number];
  /** lama tampil (ms) untuk subitasi/lengkapi */
  flashMs: number;
  priceLabel: PaketDagang["priceLabel"];
}
/** ambil/subitasi/sisa: keranjang goodId → qty · bayar/kembalian/tukar/lengkapi: daftar pecahan yang ditaruh · hitung/gabung: angka strip */
export type JawabanDagang =
  | { keranjang: Record<string, number>; latencyMs?: number }
  | { uang: number[]; latencyMs?: number }
  | { angka: number; disentuh?: string[]; latencyMs?: number };

/* ---------------- navigasi ---------------- */

export type Arah = "N" | "E" | "S" | "W";
export type NavBlock =
  | { cmd: Exclude<NavCommand, "ulangi"> }
  | { cmd: "ulangi"; n: number; body: NavBlock[] };

export type NavGrid = PaketNavigasi["grids"][number];

export interface NavState { x: number; y: number; dir: Arah }

export interface NavStep {
  /** jalur blok yang dieksekusi: indeks di program (bersarang: [i, j]) */
  path: number[];
  /** perintah dasar yang dijalankan (ulangi/kalau sudah diurai) */
  cmd: "maju" | "lompat" | "kiri" | "kanan" | "bendera";
  /** keadaan sesudah langkah */
  after: NavState;
  kind: "move" | "turn" | "jump" | "stumble" | "bump" | "flag";
}

export type NavOutcome = "bintang" | "meleset" | "tersandung" | "tabrak" | "bendera" | "kosong";

export interface NavRun {
  steps: NavStep[];
  outcome: NavOutcome;
  final: NavState;
  /** jumlah blok dasar yang dijalankan */
  executed: number;
}

export interface RondeNavigasi {
  execMode: PaketNavigasi["execMode"];
  commands: NavCommand[];
  /** grid yang harus lolos (1, atau semua grid satu group bila semuaGrid) */
  grids: NavGrid[];
  /** program awal (debug) atau kosong */
  program: NavBlock[];
  /** batas slot rak; undefined = tanpa batas */
  rackSlots?: number;
  /** jumlah blok yang boleh diubah (debug) */
  fixes?: number;
  debug: boolean;
  prediksi: boolean;
}

export interface JawabanNavigasi {
  /** program akhir yang dijalankan */
  program: NavBlock[];
  /** jumlah blok yang diubah dari program awal (debug) — dihitung presenter */
  edits?: number;
  /** jumlah kali tombol jalan ditekan sebelum sukses */
  runs?: number;
  /** mode langsung: perintah yang ditekan berurutan */
  langsung?: NavBlock[];
  /** prediksi: benar/salah per langkah */
  prediksi?: boolean[];
  /** posisi bendera yang dipilih anak (dekomposisi) + dua bagian program */
  bendera?: { x: number; y: number; bagian: [NavBlock[], NavBlock[]] };
}

/* ---------------- pola ---------------- */

export interface RondePola {
  mode: PaketPola["mode"];
  unitLen: number;
  /** benda yang bisa dipilih untuk mengisi (sudah termasuk pengecoh, urutan acak) */
  palette: PaketPola["items"];
  /** urutan lengkap yang benar (id benda); untuk cipta kosong */
  correct: string[];
  /** yang ditampilkan: null = slot kosong (lanjut); perbaiki = satu unsur sudah diganti pengecoh; cipta = semua null */
  shown: (string | null)[];
  /** indeks unsur yang salah (perbaiki) */
  wrongIndex?: number;
  /** jumlah benda berbeda yang harus dipilih (cipta) */
  pilih?: number;
}
/** urutan akhir lengkap (id benda per slot) */
export type JawabanPola = string[];

/* ---------------- simulasi ---------------- */

export interface RondeSimulasi {
  mode: PaketSimulasi["mode"];
  /** benda/hewan/tombol/alat yang terlibat di ronde ini */
  items: PaketSimulasi["items"];
  /** jam-baca: jam yang ditampilkan · jam-putar: jam target · jengkal/kubus: panjang · taksir: jumlah · bagi: jumlah benda ·
   *  menara: tinggi menara · bantuan: batas ketukan sia-sia · telusur: angka yang ditelusuri */
  target: number;
  /** jam-baca: pilihan kartu jam · taksir: rentang garis [0,20] dipakai presenter */
  options: number[];
  /** jam-putar: kunci kegiatan · timbangan: id benda yang lebih berat · alat: id alat yang benar · bantuan: id alat yang macet */
  correctId?: string;
  /** turus: urutan hewan yang lewat (id) · tombol: urutan tombol yang diuji di putaran 2 */
  urutan: string[];
  /** tombol: peta tombol → alat (rahasia, dipakai presenter untuk menyalakan alat) */
  peta: Record<string, string>;
  /** jengkal: snap otomatis? · kubus: benda dimulai di kubus ke-`offset` (0 = pas) · telusur: offset 1 = panah urutan goresan ditampilkan */
  snap: boolean;
  offset: number;
  /** lama tampil (taksir) ms; jeda antar hewan (turus) ms */
  flashMs: number;
}
export type JawabanSimulasi =
  | { angka: number }                                   // jam-baca, jam-putar, kubus, taksir
  | { pilih: string }                                   // timbangan, alat
  | { posisi: number[]; angka: number }                 // jengkal: posisi awal tiap jengkal (satuan jengkal) + jumlah yang disebut
  | { turus: Record<string, number> }                   // turus
  | { tebakan: Record<string, string> }                 // tombol: tombol → alat yang ditunjuk sebelum ditekan
  | { kiri: number; kanan: number }                     // bagi
  | { tumpukan: string[] }                              // menara: id benda dari bawah ke atas
  | { ketukanSiaSia: number; mintaTolong: boolean }     // bantuan
  | { angka: number; cakupan: number; keluar: number }; // telusur: angka, rasio jalur tersentuh (0–1), rasio sampel jari di luar toleransi (0–1)
