// Ujian RINOYA Academy (Sekolah Tahap 3) — fungsi murni, tanpa React/DOM. Dipakai aplikasi DAN server.
//
// Empat jenis gerbang:
//   kuis       akhir tiap modul (unit), membuka modul berikut                 · 8 soal  · lulus ≥ 70
//   semester   akhir semester (lintas modul semester itu), membuka semester 2 · 15 soal · lulus ≥ 75
//   kenaikan   Ujian Akhir seluruh jenjang, HANYA SEKALI; nilai apa adanya di sertifikat (<75 = "Cukup") · 20 soal
//   penempatan sekali saat anak didaftarkan, menentukan jenjang awal         · 10 soal · lulus ≥ 70
// Soal = satu ronde dari paket permainan yang sudah ada, tanpa tombol Bantu. Kompetensi diambil bergiliran
// supaya semua kompetensi ruang ujian terwakili. Gagal → boleh mengulang besok (remedial dulu).

import type { ContentPack, LevelId } from "@akademi/schema";

export const JENIS_UJIAN = ["kuis", "semester", "kenaikan", "penempatan"] as const;
export type JenisUjian = (typeof JENIS_UJIAN)[number];

export const AMBANG: Record<JenisUjian, number> = { kuis: 70, semester: 75, kenaikan: 75, penempatan: 70 };
export const JUMLAH_SOAL: Record<JenisUjian, number> = { kuis: 8, semester: 15, kenaikan: 20, penempatan: 10 };
export const NAMA_UJIAN: Record<JenisUjian, string> = { kuis: "Ulangan Modul", semester: "Ujian Semester", kenaikan: "Ujian Akhir", penempatan: "Tes Penempatan" };
/** Ujian Akhir jenjang hanya SEKALI (keputusan owner 15 Nov 2026): nilai berapa pun dicatat apa adanya di sertifikat. */
export const SEKALI: ReadonlySet<JenisUjian> = new Set(["kenaikan"]);

/** Ruang ujian: kuis = id unit, semester = "S1"/"S2", kenaikan & penempatan = "" */
export const ruangSemester = (ke: 1 | 2) => `S${ke}`;

export interface SoalUjian {
  paketId: string;
  competencyId: string;
  seed: number;
}

export interface HasilUjian {
  jenis: JenisUjian;
  level: LevelId;
  ruang: string;
  sessionId: string;
  benar: number;
  total: number;
  nilai: number;
  lulus: boolean;
  /** ISO waktu selesai */
  at: string;
  /** belum tercatat di server */
  pending?: boolean;
}

/** Hash string deterministik (FNV-1a 32-bit). */
export function hashUjian(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Susun soal ujian: kompetensi bergiliran (urutan diacak stabil per seed), tiap soal memakai paket yang memuat
 * kompetensi itu (paket berganti bila kompetensi muncul lagi). Kompetensi tanpa paket dilewati.
 */
export function rencanaUjian(kompetensiIds: string[], paket: ContentPack[], n: number, seed: string, level?: LevelId): SoalUjian[] {
  const perKomp = new Map<string, ContentPack[]>();
  for (const cid of kompetensiIds) {
    const list = paket
      .filter((p) => p.competencyIds.includes(cid))
      .sort((a, b) => Number(level !== undefined && a.level !== level) - Number(level !== undefined && b.level !== level) || Number(a.competencyIds[0] !== cid) - Number(b.competencyIds[0] !== cid) || a.id.localeCompare(b.id));
    if (list.length) perKomp.set(cid, list);
  }
  const urut = [...perKomp.keys()].sort((a, b) => hashUjian(`${seed}:${a}`) - hashUjian(`${seed}:${b}`) || a.localeCompare(b));
  if (!urut.length) return [];
  const pakai = new Map<string, number>();
  const out: SoalUjian[] = [];
  for (let i = 0; i < n; i++) {
    const cid = urut[i % urut.length];
    const list = perKomp.get(cid)!;
    const k = pakai.get(cid) ?? 0;
    pakai.set(cid, k + 1);
    out.push({ paketId: list[k % list.length].id, competencyId: cid, seed: hashUjian(`${seed}:${i}`) });
  }
  return out;
}

export const nilaiDari = (benar: number, total: number) => (total > 0 ? Math.round((benar / total) * 100) : 0);
export const lulusDari = (jenis: JenisUjian, nilai: number) => nilai >= AMBANG[jenis];

export type Predikat = "Dengan Pujian" | "Sangat Baik" | "Baik" | "Cukup" | "Belum Lulus";
export function predikat(nilai: number, jenis: JenisUjian = "kenaikan"): Predikat {
  if (!lulusDari(jenis, nilai)) return SEKALI.has(jenis) ? "Cukup" : "Belum Lulus";
  if (nilai >= 90) return "Dengan Pujian";
  if (nilai >= 80) return "Sangat Baik";
  return "Baik";
}

const kunci = (h: Pick<HasilUjian, "jenis" | "level" | "ruang">) => `${h.jenis}|${h.level}|${h.ruang}`;

/** Hasil terbaik per jenis × jenjang × ruang (lulus menang, lalu nilai tertinggi). */
export function terbaik(hasil: HasilUjian[]): Map<string, HasilUjian> {
  const out = new Map<string, HasilUjian>();
  for (const h of hasil) {
    const k = kunci(h);
    const ada = out.get(k);
    if (!ada || Number(h.lulus) - Number(ada.lulus) > 0 || (h.lulus === ada.lulus && h.nilai > ada.nilai)) out.set(k, h);
  }
  return out;
}

export function sudahLulus(hasil: HasilUjian[], jenis: JenisUjian, level: LevelId, ruang = ""): boolean {
  return hasil.some((h) => h.jenis === jenis && h.level === level && h.ruang === ruang && h.lulus);
}

/** Tanggal lokal Asia/Jakarta (YYYY-MM-DD). */
export const hariWIB = (iso: string | Date) => new Date(new Date(iso).getTime() + 7 * 3600_000).toISOString().slice(0, 10);

/** Ujian sekali-jalan sudah pernah dikerjakan (lulus atau tidak). */
export function sudahDikerjakan(hasil: HasilUjian[], jenis: JenisUjian, level: LevelId, ruang = ""): boolean {
  return hasil.some((h) => h.jenis === jenis && h.level === level && h.ruang === ruang);
}

/** Gagal hari ini → mengulang besok. Lulus → tidak perlu mengulang. Ujian Akhir: sekali saja. */
export function bolehMengulang(hasil: HasilUjian[], jenis: JenisUjian, level: LevelId, ruang: string, sekarang: Date = new Date()): { boleh: boolean; besok?: boolean; sekali?: boolean } {
  const milik = hasil.filter((h) => h.jenis === jenis && h.level === level && h.ruang === ruang);
  if (SEKALI.has(jenis) && milik.length) return { boleh: false, sekali: true };
  if (milik.some((h) => h.lulus)) return { boleh: false };
  const hariIni = hariWIB(sekarang);
  if (milik.some((h) => hariWIB(h.at) === hariIni)) return { boleh: false, besok: true };
  return { boleh: true };
}
