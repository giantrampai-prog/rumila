// Tiga tingkat penghargaan RINOYA Academy (Sekolah Tahap 4) — fungsi murni, tanpa React/DOM.
//   Tingkat 1 · Piagam Modul        : tiap Kuis Modul lulus (digital, tanpa QR)
//   Tingkat 2 · Sertifikat Semester : tiap Ujian Semester lulus (A4, nilai per pelajaran, QR verifikasi sesi)
//   Tingkat 3 · Sertifikat Kenaikan : sertifikat jenjang (tabel akademi_certificate, terbit dari server)
// Tingkat 1 & 2 diturunkan dari hasil ujian (akademi_ujian), jadi tidak perlu tabel sendiri.

import { levelIndex, type Competency, type LevelId, type TrackId } from "@akademi/schema";
import { TRACK_AKTIF } from "./katalog";
import { petaJenjang } from "./peta";
import { terbaik, type HasilUjian } from "./ujian";

export interface PiagamModul {
  level: LevelId;
  unitId: string;
  track: TrackId;
  /** urutan modul di pelajarannya */
  ke: number;
  nama: { id: string; en: string };
  nilai: number;
  at: string;
  sessionId: string;
}

export interface NilaiPelajaran {
  track: TrackId;
  /** rata-rata nilai Kuis Modul pelajaran itu di semester ini */
  nilai: number;
  modul: number;
}

export interface SertifikatSemester {
  level: LevelId;
  ke: 1 | 2;
  /** nilai Ujian Semester */
  nilai: number;
  perPelajaran: NilaiPelajaran[];
  /** nilai akhir = 60% ujian semester + 40% rata-rata kuis modul */
  nilaiAkhir: number;
  at: string;
  sessionId: string;
}

const urutWaktu = <T extends { at: string }>(a: T, b: T) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0);

/** Semua Piagam Modul anak, urut waktu lulus. Hanya kuis lulus (hasil terbaik per modul). */
export function piagamModul(hasil: HasilUjian[], kompetensi: Competency[]): PiagamModul[] {
  const out: PiagamModul[] = [];
  const cache = new Map<LevelId, ReturnType<typeof petaJenjang>>();
  for (const h of terbaik(hasil).values()) {
    if (h.jenis !== "kuis" || !h.lulus) continue;
    const peta = cache.get(h.level) ?? cache.set(h.level, petaJenjang({}, new Set(), kompetensi, h.level, TRACK_AKTIF)).get(h.level)!;
    const u = peta.unit.find((x) => x.id === h.ruang);
    if (!u) continue;
    out.push({ level: h.level, unitId: u.id, track: u.track, ke: u.ke, nama: u.nama, nilai: h.nilai, at: h.at, sessionId: h.sessionId });
  }
  return out.sort(urutWaktu);
}

/** Semua Sertifikat Semester anak (Ujian Semester lulus), lengkap nilai per pelajaran dari Kuis Modul. */
export function sertifikatSemester(hasil: HasilUjian[], kompetensi: Competency[]): SertifikatSemester[] {
  const terbaikMap = terbaik(hasil);
  const out: SertifikatSemester[] = [];
  for (const h of terbaikMap.values()) {
    if (h.jenis !== "semester" || !h.lulus) continue;
    const ke = h.ruang === "S2" ? 2 : 1;
    const peta = petaJenjang({}, new Set(), kompetensi, h.level, TRACK_AKTIF);
    const unit = peta.semester[ke - 1]?.unit ?? [];
    const perTrack = new Map<TrackId, number[]>();
    for (const u of unit) {
      const kuis = terbaikMap.get(`kuis|${h.level}|${u.id}`);
      if (kuis?.lulus) (perTrack.get(u.track) ?? perTrack.set(u.track, []).get(u.track)!).push(kuis.nilai);
    }
    const perPelajaran = TRACK_AKTIF.filter((t) => perTrack.has(t)).map((t) => {
      const n = perTrack.get(t)!;
      return { track: t, nilai: Math.round(n.reduce((a, b) => a + b, 0) / n.length), modul: n.length };
    });
    const semuaKuis = [...perTrack.values()].flat();
    const rataKuis = semuaKuis.length ? semuaKuis.reduce((a, b) => a + b, 0) / semuaKuis.length : h.nilai;
    out.push({ level: h.level, ke, nilai: h.nilai, perPelajaran, nilaiAkhir: Math.round(0.6 * h.nilai + 0.4 * rataKuis), at: h.at, sessionId: h.sessionId });
  }
  return out.sort(urutWaktu);
}

/** Tahun ajaran dari tanggal (Juli–Juni), mis. "2026/2027". */
export function tahunAjaran(iso: string): string {
  const d = new Date(iso);
  const y = d.getUTCFullYear();
  const awal = d.getUTCMonth() >= 6 ? y : y - 1;
  return `${awal}/${awal + 1}`;
}

/** Nomor dokumen semester: RA/<tahun>/<jenjang>-S<ke>/<8 huruf sesi>. */
export const nomorSemester = (s: Pick<SertifikatSemester, "level" | "ke" | "at" | "sessionId">) =>
  `RA/${new Date(s.at).getUTCFullYear()}/${s.level}-S${s.ke}/${s.sessionId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;

/** Urutan jenjang untuk lemari piagam (jenjang terbaru dulu). */
export const urutJenjangTurun = (a: LevelId, b: LevelId) => levelIndex(b) - levelIndex(a);
