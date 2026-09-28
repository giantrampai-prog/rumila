// Pop-up info Tur terbang (tampilan anak): kartu fakta singkat yang muncul saat kalimat narasi terkait
// dibacakan, berwarna sesuai objeknya. Angka dari manifest bila ada (fact), sisanya fakta umum yang sudah dicek:
// suhu fotosfer Matahari ±5.500 °C; Merkurius siang ±430 °C / malam ±−180 °C; air menutupi ±71% permukaan Bumi;
// Olympus Mons ±22 km; >1 juta asteroid dikenal; diameter Jupiter ±11× Bumi; Uranus terdingin (±−224 °C);
// angin Neptunus ±2.100 km/jam; Pluto lebih kecil dari Bulan.

import { fact } from "./tour";

export interface TourPop {
  /** muncul mulai kalimat ke- (indeks di TOUR[..].lines) */
  at: number;
  /** ikon Material Symbols */
  icon: string;
  /** angka / kata besar */
  big: string;
  /** keterangan pendek */
  label: string;
}

export interface TourLook {
  /** warna kartu: [terang, gelap] */
  accent: [string, string];
  pops: TourPop[];
}

const n = (id: string, label: string) => fact(id, label).replace(" hari Bumi", " hari");

export const TOUR_POPS: Record<string, TourLook> = {
  intro: {
    accent: ["#b07cff", "#5a1fc0"],
    pops: [
      { at: 1, icon: "public", big: "8 planet", label: "keluarga Matahari" },
      { at: 3, icon: "light_mode", big: "8 menit", label: "cahaya Matahari sampai ke Bumi" },
    ],
  },
  sun: {
    accent: ["#ffc247", "#d9480f"],
    pops: [
      { at: 0, icon: "star", big: "Bintang", label: "bukan planet" },
      { at: 1, icon: "thermostat", big: "5.500 °C", label: "panas permukaannya" },
      { at: 2, icon: "public", big: "1 juta+", label: "Bumi muat di dalamnya" },
    ],
  },
  mercury: {
    accent: ["#b8b3ad", "#57524d"],
    pops: [
      { at: 0, icon: "straighten", big: "Terkecil", label: "dari 8 planet" },
      { at: 1, icon: "event", big: n("mercury", "Satu tahun"), label: "satu tahun di Merkurius" },
      { at: 2, icon: "device_thermostat", big: "430° / −180°", label: "siang panas, malam beku" },
    ],
  },
  venus: {
    accent: ["#f0cf86", "#a8702a"],
    pops: [
      { at: 0, icon: "cloud", big: "Berawan", label: "tertutup awan tebal" },
      { at: 1, icon: "local_fire_department", big: fact("venus", "Suhu permukaan"), label: "planet terpanas" },
      { at: 2, icon: "sync", big: "243 hari", label: "satu hari di Venus" },
    ],
  },
  earth: {
    accent: ["#4f9dff", "#16539e"],
    pops: [
      { at: 0, icon: "home", big: "Rumah kita", label: "planet ke-3" },
      { at: 1, icon: "eco", big: "Ada kehidupan", label: "satu-satunya yang kita tahu" },
      { at: 2, icon: "water_drop", big: "71%", label: "permukaannya air" },
      { at: 4, icon: "shield", big: "Atmosfer", label: "selimut udara Bumi" },
      { at: 5, icon: "thumb_up", big: "Pas!", label: "tidak terlalu panas & dingin" },
      { at: 6, icon: "sync", big: "24 jam", label: "siang & malam" },
      { at: 7, icon: "cake", big: "365 hari", label: "satu tahun" },
      { at: 8, icon: "rotate_right", big: fact("earth", "Kemiringan sumbu"), label: "miring → ada musim" },
      { at: 9, icon: "flag", big: "17.000+", label: "pulau di Indonesia" },
    ],
  },
  moon: {
    accent: ["#c9ccd1", "#5f646b"],
    pops: [
      { at: 0, icon: "straighten", big: fact("moon", "Jarak rata-rata ke Bumi"), label: "jarak ke Bumi" },
      { at: 2, icon: "sync", big: fact("moon", "Satu putaran orbit"), label: "sekali mengelilingi Bumi" },
      { at: 3, icon: "steps", big: "1969", label: "manusia pertama mendarat" },
    ],
  },
  mars: {
    accent: ["#f08457", "#9c3014"],
    pops: [
      { at: 0, icon: "palette", big: "Merah", label: "debu karat besi" },
      { at: 1, icon: "landscape", big: "±22 km", label: "tinggi Olympus Mons" },
      { at: 3, icon: "bedtime", big: "2 bulan", label: "Phobos & Deimos" },
    ],
  },
  "asteroid-example": {
    accent: ["#b2a597", "#5b5147"],
    pops: [
      { at: 0, icon: "grain", big: "1 juta+", label: "asteroid yang dikenal" },
      { at: 2, icon: "swap_horiz", big: "Berjauhan", label: "tidak berdesakan" },
    ],
  },
  jupiter: {
    accent: ["#e7b67e", "#94572a"],
    pops: [
      { at: 0, icon: "public", big: "11× Bumi", label: "lebar planet terbesar" },
      { at: 2, icon: "schedule", big: fact("jupiter", "Satu hari (rotasi)"), label: "satu hari di Jupiter" },
      { at: 3, icon: "cyclone", big: "Badai raksasa", label: "lebih besar dari Bumi" },
    ],
  },
  saturn: {
    accent: ["#efd9a0", "#9c7c3c"],
    pops: [
      { at: 0, icon: "trip_origin", big: "Cincin", label: "paling indah" },
      { at: 1, icon: "ac_unit", big: "Es & batu", label: "isi cincinnya" },
      { at: 3, icon: "bedtime", big: "Titan", label: "bulan terbesarnya" },
    ],
  },
  uranus: {
    accent: ["#8fe3ea", "#2f8a96"],
    pops: [
      { at: 0, icon: "ac_unit", big: "−224 °C", label: "planet terdingin" },
      { at: 1, icon: "rotate_right", big: fact("uranus", "Kemiringan sumbu"), label: "berputar sambil rebahan" },
      { at: 2, icon: "science", big: "Metana", label: "membuatnya biru" },
    ],
  },
  neptune: {
    accent: ["#6f95ff", "#1e3a99"],
    pops: [
      { at: 0, icon: "flag", big: "Terjauh", label: "planet ke-8" },
      { at: 1, icon: "air", big: "2.100 km/jam", label: "angin tercepat" },
      { at: 2, icon: "light_mode", big: "4 jam", label: "cahaya Matahari sampai ke sini" },
    ],
  },
  pluto: {
    accent: ["#e2c6a8", "#86644a"],
    pops: [
      { at: 0, icon: "straighten", big: "Mungil", label: "lebih kecil dari Bulan kita" },
      { at: 1, icon: "category", big: "Planet katai", label: "sejak 2006" },
      { at: 2, icon: "favorite", big: "Hati es", label: "dataran es berbentuk hati" },
    ],
  },
  "comet-example": {
    accent: ["#9fdcff", "#2f6fa8"],
    pops: [
      { at: 0, icon: "ac_unit", big: "Bola salju", label: "es + debu" },
      { at: 1, icon: "wb_sunny", big: "Ekor muncul", label: "saat dekat Matahari" },
      { at: 2, icon: "east", big: "Menjauhi", label: "ekor menjauhi Matahari" },
    ],
  },
  outro: {
    accent: ["#b07cff", "#5a1fc0"],
    pops: [
      { at: 0, icon: "military_tech", big: "Misi selesai!", label: "penjelajah hebat" },
      { at: 1, icon: "blur_on", big: "Bima Sakti", label: "galaksi rumah kita" },
    ],
  },
};
