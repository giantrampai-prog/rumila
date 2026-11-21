// Kartu Pelajar RINOYA: Nomor Induk Siswa dan IPK. Fungsi murni.
// Nomor induk dibuat aplikasi dari id anggota (tetap, tidak berubah), bukan NIK kependudukan.

import type { HasilUjian } from "./ujian";

/** Nomor Induk Siswa, mis. "26.0712.4831": tahun masuk · 8 digit dari id anggota. */
export function nomorInduk(memberId: string, tahunMasuk: number): string {
  let h = 2166136261;
  for (const ch of memberId) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
  const d = String(h % 100_000_000).padStart(8, "0");
  return `${String(tahunMasuk % 100).padStart(2, "0")}.${d.slice(0, 4)}.${d.slice(4)}`;
}

/** Tahun masuk = tahun ujian/tes pertama; belum pernah ujian → tahun ini. */
export function tahunMasuk(hasil: HasilUjian[], sekarang = new Date()): number {
  const awal = hasil.map((h) => Date.parse(h.at)).filter(Number.isFinite).sort((a, b) => a - b)[0];
  return new Date(awal ?? sekarang.getTime()).getFullYear();
}

export interface Ipk {
  /** 0,00–4,00; null bila belum ada ujian yang dinilai */
  nilai: number | null;
  /** jumlah ujian yang dihitung */
  jumlah: number;
  predikat: string;
}

/**
 * IPK skala 4: rata-rata nilai ujian (0–100) dibagi 25. Tes Penempatan tidak dihitung (bukan ujian kelas).
 * Ujian yang diulang memakai nilai terakhir.
 */
export function hitungIpk(hasil: HasilUjian[]): Ipk {
  const terakhir = new Map<string, HasilUjian>();
  for (const h of [...hasil].sort((a, b) => a.at.localeCompare(b.at))) {
    if (h.jenis === "penempatan") continue;
    terakhir.set(`${h.jenis}|${h.level}|${h.ruang}`, h);
  }
  const daftar = [...terakhir.values()];
  if (!daftar.length) return { nilai: null, jumlah: 0, predikat: "Belum ada ujian" };
  const rata = daftar.reduce((s, h) => s + h.nilai, 0) / daftar.length;
  const nilai = Math.round((rata / 25) * 100) / 100;
  const predikat = nilai >= 3.51 ? "Dengan Pujian" : nilai >= 3.01 ? "Sangat Memuaskan" : nilai >= 2.76 ? "Memuaskan" : "Terus Berlatih";
  return { nilai, jumlah: daftar.length, predikat };
}

export const formatIpk = (n: number | null) => (n === null ? "–" : n.toFixed(2).replace(".", ","));
