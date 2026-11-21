// Penilaian Praktik Kampus: nilai akhir dari gedung kampus (keputusan owner 21 Nov 2026).
// Gedung kampus terpisah dari Ruang Kelas (lihat akses.ts): jejaknya tidak menaikkan misi/penguasaan Academy, tetapi
// dinilai di sini sebagai praktik — "bisa melakukannya di luar kelas".
//   komponen  = satu gedung yang punya aktivitas terpetakan ke kompetensi jenjang ini:
//               Lab Komputer (game Coding Agam: Langkah, Ulangi, Kalau) dan Laboratorium 3D (quest dunia 3D)
//   kompetensi = penguasaan dihitung HANYA dari jejak gedung itu (aturan penguasaan sama dengan Academy)
//   skor      = dikuasai 100 · berkembang 75 · sudah dicoba tapi belum berkembang 40 · belum dicoba 0
//   nilai     = rata-rata skor kompetensi per gedung, lalu rata-rata gedung; null bila jenjang belum punya praktik kampus
// Semua jenjang PAUD–SD 6 punya praktik kampus. Pelengkap, bukan syarat naik jenjang: ditampilkan di peta & rapor, dibekukan di transkrip saat sertifikat terbit.
// Fungsi murni (dipakai juga oleh API sertifikat di server).

import type { Competency, GameEvent, LevelId } from "@akademi/schema";
import { proyeksiDari, type Status } from "./mastery";
import { predikat } from "./ujian";

export type GedungPraktik = "komputer" | "lab";

/**
 * Kompetensi yang dibuktikan tiap gedung. Harus sama dengan pemetaan di bukti-koding.ts (kompetensiLevel) dan
 * quest.ts (QUEST) — dijaga tes praktik-kampus.test.ts.
 */
export const KOMPETENSI_GEDUNG: Record<GedungPraktik, readonly string[]> = {
  komputer: [
    "KODE.PAUD.PERINTAH.01",
    "KODE.TKA.NAVIGASI.01",
    "KODE.TKA.NAVIGASI.02",
    "KODE.TKA.NAVIGASI.03",
    "KODE.TKB.PROGRAM-5-8.01",
    "KODE.TKB.ULANGI.01",
    "KODE.TKB.ULANGI.02",
    "KODE.TKB.ULANGI.03",
    "KODE.TKB.KONDISI.01",
    "KODE.SD1.ULANGI.01",
    "KODE.SD1.KONDISI.01",
    "KODE.SD2.PROGRAM.01",
    "KODE.SD2.ULANGI.01",
    "KODE.SD2.KONDISI.01",
    "KODE.SD3.EFISIEN.01",
    "KODE.SD5.KONDISI.03",
  ],
  lab: [
    "SAINS.TKB.TULANG-OTOT-ORGAN.01",
    "SAINS.PAUD.HIDUP-TAK-HIDUP.02",
    "SAINS.TKB.MATAHARI-BUMI-BULAN.01",
    "SAINS.SD2.MATAHARI.01",
    "SAINS.SD3.BULAN.01",
    "SAINS.SD4.RANGKA-OTOT.01",
    "SAINS.SD4.RANGKA-OTOT.03",
    "SAINS.SD4.BUMI-ANTARIKSA.02",
    "SAINS.SD4.BUMI-ANTARIKSA.03",
    "SAINS.SD5.PENCERNAAN.02",
    "SAINS.SD5.BUMI-ORBIT.01",
    "SAINS.SD6.PERNAPASAN.01",
    "SAINS.SD6.SIRKULASI.01",
    "SAINS.SD6.TATA-SURYA.01",
  ],
};

export const NAMA_GEDUNG_PRAKTIK: Record<GedungPraktik, { nama: string; href: string; icon: string }> = {
  komputer: { nama: "Lab Komputer", href: "/akademi/komputer", icon: "smart_toy" },
  lab: { nama: "Laboratorium 3D", href: "/akademi/lab", icon: "view_in_ar" },
};

/** Gedung asal satu event kampus; undefined = bukan event kampus. */
export function gedungEvent(e: Pick<GameEvent, "activityId">): GedungPraktik | undefined {
  if (e.activityId.startsWith("koding-") || e.activityId === "import") return "komputer";
  if (e.activityId.startsWith("quest:")) return "lab";
  return undefined;
}

export interface KompetensiPraktik {
  id: string;
  pernyataan: string;
  status: Status;
  /** jumlah percobaan di gedung ini (benar + salah) */
  percobaan: number;
  skor: number;
}

export interface KomponenPraktik {
  gedung: GedungPraktik;
  kompetensi: KompetensiPraktik[];
  nilai: number;
}

export interface PenilaianKampus {
  level: LevelId;
  komponen: KomponenPraktik[];
  /** null bila jenjang ini belum punya aktivitas kampus yang dinilai */
  nilai: number | null;
  predikat?: string;
  /** semua kompetensi praktik sudah dicoba minimal sekali */
  lengkap: boolean;
}

export const skorStatus = (status: Status, percobaan: number) => (status === "dikuasai" ? 100 : status === "berkembang" ? 75 : percobaan > 0 ? 40 : 0);

const rata = (xs: number[]) => Math.round(xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length));

export function penilaianKampus(events: GameEvent[], kompetensi: Competency[], level: LevelId): PenilaianKampus {
  const idx = new Map(kompetensi.map((c) => [c.id, c]));
  const komponen: KomponenPraktik[] = [];
  for (const gedung of Object.keys(KOMPETENSI_GEDUNG) as GedungPraktik[]) {
    const cs = KOMPETENSI_GEDUNG[gedung].map((id) => idx.get(id)).filter((c): c is Competency => !!c && c.level === level);
    if (!cs.length) continue;
    const peng = proyeksiDari(events, cs, (e) => gedungEvent(e) === gedung);
    const isi = cs.map((c) => {
      const p = peng[c.id];
      const percobaan = p.success + p.fail;
      return { id: c.id, pernyataan: c.statement.id, status: p.status, percobaan, skor: skorStatus(p.status, percobaan) };
    });
    komponen.push({ gedung, kompetensi: isi, nilai: rata(isi.map((x) => x.skor)) });
  }
  if (!komponen.length) return { level, komponen, nilai: null, lengkap: false };
  const nilai = rata(komponen.map((k) => k.nilai));
  return { level, komponen, nilai, predikat: praktikPredikat(nilai), lengkap: komponen.every((k) => k.kompetensi.every((x) => x.percobaan > 0)) };
}

/** Predikat praktik memakai skala Ujian Akhir (≥75 lulus; di bawahnya "Cukup"). */
export const praktikPredikat = (nilai: number) => predikat(nilai, "kenaikan");

/** Ringkasan yang dibekukan di transkrip sertifikat. */
export interface SnapshotPraktik {
  nilai: number;
  predikat: string;
  komponen: { gedung: GedungPraktik; nilai: number }[];
}

export function snapshotPraktik(p: PenilaianKampus): SnapshotPraktik | undefined {
  if (p.nilai === null) return undefined;
  return { nilai: p.nilai, predikat: p.predikat ?? praktikPredikat(p.nilai), komponen: p.komponen.map((k) => ({ gedung: k.gedung, nilai: k.nilai })) };
}
