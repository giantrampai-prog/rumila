// Tema dunia tiap paket Academy: latar dan bentuk wadah dipilih dari isi paket (id, judul, instruksi, mapel),
// supaya soal laut terasa di laut, soal kasir terasa di pasar, dst. Murni (tanpa React) supaya mudah diuji.

export type DuniaId = "pasar" | "kebun" | "laut" | "pantai" | "kelas" | "rumah" | "kota" | "hutan" | "angkasa" | "taman";

export const SEMUA_DUNIA: DuniaId[] = ["pasar", "kebun", "laut", "pantai", "kelas", "rumah", "kota", "hutan", "angkasa", "taman"];

/** Kata kunci per dunia; dicocokkan sebagai kata utuh (boleh berakhiran -nya). */
const KATA: Record<DuniaId, string[]> = {
  laut: ["laut", "ikan", "kapal selam", "terumbu", "karang", "palung", "hiu", "paus", "gurita", "cumi", "kuda laut", "teripang", "bawah air", "akuarium", "kolam"],
  pantai: ["pantai", "pasir", "penyu", "kerang", "ombak", "pelabuhan", "nelayan", "perahu", "dermaga", "pulau"],
  pasar: ["pasar", "kios", "toko", "kasir", "kembalian", "jual", "beli", "pembeli", "penjual", "harga", "uang", "koin", "rupiah", "kantin", "warung", "lapak", "belanja", "dagang", "bayar", "celengan", "tukar", "mesin tukar", "supermarket", "kue", "roti"],
  kebun: ["kebun", "tanaman", "tumbuhan", "bedeng", "sayur", "panen", "petani", "sawah", "padi", "pot", "benih", "biji", "akar", "daun", "bunga", "buah", "ternak", "peternakan", "kandang", "ayam", "sapi", "kambing", "bebek", "lebah", "siput", "ulat", "wortel"],
  angkasa: ["angkasa", "antariksa", "planet", "bintang", "roket", "astronaut", "bulan purnama", "fase bulan", "bumi bulan", "matahari", "tata surya", "galaksi", "satelit", "langit malam", "gerhana"],
  hutan: ["hutan", "rimba", "harimau", "gajah", "monyet", "orang utan", "jerapah", "singa", "rantai makanan", "jaring makanan", "satwa", "habitat", "burung"],
  kelas: ["kelas", "sekolah", "guru", "murid", "buku", "pensil", "papan tulis", "perpustakaan", "kata", "huruf", "kalimat", "cerita", "baca", "tulis", "ukur", "jengkal", "penggaris", "jam", "turus", "data", "tabel", "diagram", "pecahan"],
  rumah: ["rumah", "kamar", "dapur", "kamar mandi", "baju", "pakaian", "keluarga", "ibu", "ayah", "mandi", "tidur", "makan", "sarapan", "lemari", "tubuh", "gigi", "tangan", "indra", "kesehatan"],
  kota: ["kota", "jalan", "kendaraan", "mobil", "bus", "kereta", "lalu lintas", "rambu", "robot", "kode", "program", "perintah", "blok", "algoritma", "peta", "gedung", "listrik", "lampu", "mesin", "pabrik", "tombol"],
  taman: ["taman", "bermain", "main", "ayunan", "perosotan", "layang", "bola", "lompat", "lari", "olahraga", "piknik", "kupu"],
};

/** Dunia cadangan per mapel bila tidak ada kata kunci yang cocok. */
const CADANGAN_MAPEL: Record<string, DuniaId[]> = {
  MAT: ["pasar", "kelas", "taman"],
  SAINS: ["kebun", "hutan", "laut"],
  CODING: ["kota", "angkasa"],
};

export interface SumberTema {
  id: string;
  competencyIds?: readonly string[];
  /** teks berbahasa Indonesia yang menggambarkan paket: judul, instruksi, label */
  teks?: readonly string[];
}

function normal(s: string): string {
  return ` ${s.toLowerCase().replace(/[-_/.,:;!?()"'’]+/g, " ").replace(/\s+/g, " ").trim()} `;
}

/** Jumlah kemunculan `kata` sebagai kata utuh, boleh berakhiran -nya/-an/-kan (mis. "ikannya", "tanaman" tidak dihitung untuk "tanam"). */
function hitung(teks: string, kata: string): number {
  const pola = new RegExp(` ${kata.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:nya)? `, "g");
  return (teks.replace(/ /g, "  ").match(pola) ?? []).length;
}

/** Hash string sederhana (stabil) untuk memutar dunia cadangan antarpaket. */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

/**
 * Pilih dunia paket. Bobot: id paket ×3 dan judul ×2 (paling mewakili), sisa teks ×1.
 * Seri → urutan SEMUA_DUNIA. Tanpa cocok → cadangan mapel, diputar dengan hash id supaya tidak semuanya sama.
 */
export function pilihDunia(p: SumberTema): DuniaId {
  const id = normal(p.id);
  const [judul = "", ...lain] = p.teks ?? [];
  const tJudul = normal(judul);
  const tLain = normal(lain.join(" "));
  let terbaik: DuniaId | null = null;
  let skorTerbaik = 0;
  for (const d of SEMUA_DUNIA) {
    let s = 0;
    for (const k of KATA[d]) s += hitung(id, k) * 3 + hitung(tJudul, k) * 2 + hitung(tLain, k);
    if (s > skorTerbaik) { skorTerbaik = s; terbaik = d; }
  }
  if (terbaik) return terbaik;
  const mapel = (p.competencyIds?.[0] ?? "").split(".")[0];
  const daftar = CADANGAN_MAPEL[mapel] ?? ["taman", "kebun", "pasar"];
  return daftar[hash(p.id) % daftar.length];
}

/** Bentuk wadah tujuan seret per dunia (dipakai bin pilah, rak urutkan, dll.). */
export type BentukWadah = "keranjang" | "pot" | "ember" | "peti" | "kotak" | "laci" | "papan" | "kapsul" | "sarang" | "kotak-mainan";

export interface Tema {
  id: DuniaId;
  nama: string;
  /** warna panel isi (latar kartu benda), sedikit diwarnai tema */
  panel: string;
  /** warna garis/aksen panel */
  aksen: string;
  /** teks di atas latar (judul bila tanpa panel) */
  tinta: string;
  wadah: BentukWadah;
  /** warna utama wadah dan bayangannya */
  wadahWarna: string;
  wadahGelap: string;
}

export const TEMA: Record<DuniaId, Tema> = {
  pasar: { id: "pasar", nama: "Pasar", panel: "#fffaf1", aksen: "#e8483f", tinta: "#3b2412", wadah: "keranjang", wadahWarna: "#c98b47", wadahGelap: "#7a4a1c" },
  kebun: { id: "kebun", nama: "Kebun", panel: "#fbfff4", aksen: "#5aa13a", tinta: "#1f3a12", wadah: "pot", wadahWarna: "#d9774a", wadahGelap: "#8f4424" },
  laut: { id: "laut", nama: "Laut", panel: "#f2fbff", aksen: "#1f8fd6", tinta: "#ffffff", wadah: "peti", wadahWarna: "#3a8fc9", wadahGelap: "#155a8a" },
  pantai: { id: "pantai", nama: "Pantai", panel: "#fffdf4", aksen: "#18a7b5", tinta: "#123a44", wadah: "ember", wadahWarna: "#ff8a3d", wadahGelap: "#c4561a" },
  kelas: { id: "kelas", nama: "Kelas", panel: "#ffffff", aksen: "#6b4ce6", tinta: "#1d2a3a", wadah: "kotak", wadahWarna: "#7d6bf0", wadahGelap: "#4a37b8" },
  rumah: { id: "rumah", nama: "Rumah", panel: "#fffaf6", aksen: "#e0735a", tinta: "#3a2420", wadah: "laci", wadahWarna: "#c98a5e", wadahGelap: "#82522f" },
  kota: { id: "kota", nama: "Kota", panel: "#f7f9ff", aksen: "#2f6fe0", tinta: "#14213d", wadah: "kapsul", wadahWarna: "#4b86f0", wadahGelap: "#2550a8" },
  hutan: { id: "hutan", nama: "Hutan", panel: "#f6fff2", aksen: "#2e8b57", tinta: "#ffffff", wadah: "sarang", wadahWarna: "#9b6a3c", wadahGelap: "#5e3d1e" },
  angkasa: { id: "angkasa", nama: "Angkasa", panel: "#f4f2ff", aksen: "#8b6cff", tinta: "#ffffff", wadah: "kapsul", wadahWarna: "#6c5ce7", wadahGelap: "#3c2fa0" },
  taman: { id: "taman", nama: "Taman", panel: "#fffef7", aksen: "#ff9f1c", tinta: "#1d2a3a", wadah: "kotak-mainan", wadahWarna: "#ffb347", wadahGelap: "#c67814" },
};

/** Dunia sebuah paket konten (bentuk minimal ContentPack supaya modul ini tetap bebas dependensi). */
export function duniaPaket(p: { id: string; competencyIds?: readonly string[]; instructionKey: string; locale: { id: Record<string, string | undefined> } }): DuniaId {
  const l = p.locale.id;
  const lain = Object.entries(l).filter(([k]) => k !== "judul" && k !== p.instructionKey).slice(0, 40).map(([, v]) => v ?? "");
  return pilihDunia({ id: p.id, competencyIds: p.competencyIds, teks: [l.judul ?? "", l[p.instructionKey] ?? "", ...lain] });
}
