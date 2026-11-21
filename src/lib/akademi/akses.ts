// Akses paket Academy: Ruang Kelas (peta misi) terpisah dari gedung kampus (keputusan owner 21 Nov 2026).
// - Kemajuan Academy (penguasaan, misi selesai, ujian, sertifikat) hanya dari paket Academy. Aktivitas gedung kampus
//   (Lab Komputer: game Coding Agam, Laboratorium 3D: quest dunia) tetap dicatat sebagai jejak, tetapi TIDAK dihitung —
//   disimpan untuk penilaian akhir kelak.
// - Paket Academy hanya bisa dimainkan bila misinya terbuka di peta jenjang anak (atau kompetensinya dari jenjang yang
//   sudah dilewati). Halaman pelajaran, koleksi stiker, dan tautan langsung /akademi/main/<id> mengikuti kunci yang sama.
// Fungsi murni, tanpa React.

import { levelIndex, levelMeta, type Competency, type ContentPack, type GameEvent, type LevelId } from "@akademi/schema";
import { NAMA_UJIAN } from "./ujian";
import type { PetaJenjang } from "./peta";

/** Event dari gedung kampus (bukan paket Academy): quest dunia 3D, game Coding Agam, impor progres lama Coding. */
export function dariKampus(e: Pick<GameEvent, "activityId" | "payload">): boolean {
  const id = e.activityId;
  if (id.startsWith("quest:") || id.startsWith("koding-") || id === "import") return true;
  return (e.payload as { imported?: unknown } | undefined)?.imported === true;
}

export type Akses = { boleh: true } | { boleh: false; alasan: string };

/** Kalimat untuk anak: kenapa misi/modul ini masih terkunci, dan apa yang harus dikerjakan dulu. */
export function alasanKunci(peta: PetaJenjang, bahasa: "id" | "en" = "id"): string {
  const u = peta.ujian;
  if (u?.jenis === "kuis" && u.unit) {
    const nama = u.unit.nama[bahasa] ?? u.unit.nama.id;
    return bahasa === "en" ? `Finish the quiz for "${nama}" first.` : `Kerjakan ${NAMA_UJIAN.kuis} "${nama}" dulu.`;
  }
  if (u?.jenis === "semester") return bahasa === "en" ? `Finish the Semester ${u.semester ?? 1} Exam first.` : `Kerjakan ${NAMA_UJIAN.semester} ${u.semester ?? 1} dulu.`;
  if (peta.sekarang) {
    const nama = peta.sekarang.kompetensi.unit.nama[bahasa] ?? peta.sekarang.kompetensi.unit.nama.id;
    return bahasa === "en" ? `Finish the module "${nama}" first.` : `Selesaikan modul "${nama}" dulu.`;
  }
  return bahasa === "en" ? "Finish the earlier missions first." : "Selesaikan misi sebelumnya dulu.";
}

/**
 * Boleh dimainkan di Academy bila salah satu kompetensinya:
 *  - dari jenjang yang lebih rendah dari jenjang anak (pengulangan), atau
 *  - misinya di peta jenjang anak tidak terkunci (selesai, atau di modul yang sudah terbuka).
 * Kompetensi jenjang lebih tinggi terkunci sampai anak naik jenjang.
 */
export function aksesPaket(p: ContentPack, peta: PetaJenjang, kompetensi: ReadonlyMap<string, Competency>, bahasa: "id" | "en" = "id"): Akses {
  const misi = new Map(peta.unit.flatMap((u) => u.misi.map((m) => [m.kompetensi.id, m] as const)));
  const lv = levelIndex(peta.level);
  let lebihTinggi: LevelId | undefined;
  for (const id of p.competencyIds) {
    const c = kompetensi.get(id);
    if (!c) continue;
    const ci = levelIndex(c.level);
    if (ci < lv) return { boleh: true };
    if (ci > lv) { lebihTinggi ??= c.level; continue; }
    const m = misi.get(id);
    if (m && !m.terkunci) return { boleh: true };
  }
  if (lebihTinggi && !p.competencyIds.some((id) => kompetensi.get(id)?.level === peta.level)) {
    const nama = levelMeta(lebihTinggi).lokal;
    return { boleh: false, alasan: bahasa === "en" ? `Opens when you move up to ${nama}.` : `Terbuka setelah kamu naik ke ${nama}.` };
  }
  return { boleh: false, alasan: alasanKunci(peta, bahasa) };
}
