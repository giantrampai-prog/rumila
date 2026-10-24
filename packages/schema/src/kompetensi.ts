// Kompetensi "Aku bisa …": satuan terkecil kurikulum yang dibuktikan lewat game.

import { z } from "zod";
import { Depth, Dwibahasa, FrameworkId, LevelId, MechanicId, TrackId } from "./jenjang";

/** Format id: TRACK.LEVEL.UNIT.NN — contoh MAT.PAUD.BILANGAN-1-5.01 */
export const COMPETENCY_ID_RE = /^(MAT|KODE|SAINS|BIND|BING|DUNIA|SENI|KARAKTER)\.(PAUD|TKA|TKB|SD[1-6]|SMP[1-3]|SMA[1-3])\.[A-Z0-9]+(?:-[A-Z0-9]+)*\.\d{2}$/;
export const CompetencyId = z.string().regex(COMPETENCY_ID_RE, "id kompetensi harus TRACK.LEVEL.UNIT.NN, huruf besar");

export const StandardRef = z.object({
  framework: FrameworkId,
  code: z.string().trim().min(1),
  note: z.string().trim().optional(),
});
export type StandardRef = z.infer<typeof StandardRef>;

export const MasteryRule = z.object({
  /** bukti sukses minimum */
  minSuccess: z.number().int().min(1),
  /** konteks berbeda minimum (mekanik atau paket berbeda) */
  minContexts: z.number().int().min(1),
  /** hari kalender berbeda minimum */
  minDays: z.number().int().min(1),
  /** rasio sukses pada 10 bukti terakhir */
  minRatioLast10: z.number().min(0).max(1),
  /** jumlah bukti terakhir yang harus tanpa bantuan */
  noHintLast: z.number().int().min(0),
});
export type MasteryRule = z.infer<typeof MasteryRule>;

export const DEFAULT_MASTERY: MasteryRule = { minSuccess: 3, minContexts: 2, minDays: 2, minRatioLast10: 0.7, noHintLast: 2 };

export const Unit = z.object({
  /** slug huruf besar, sama dengan segmen ke-3 id kompetensi */
  id: z.string().regex(/^[A-Z0-9]+(?:-[A-Z0-9]+)*$/),
  nama: Dwibahasa,
});

export const Competency = z.object({
  id: CompetencyId,
  track: TrackId,
  level: LevelId,
  unit: Unit,
  /** "Aku bisa …" / "I can …" — satu kalimat, aksi yang bisa diamati */
  statement: Dwibahasa,
  /** tingkat yang diminta untuk dianggap dikuasai; minimal satu */
  depth: z.array(Depth).min(1),
  /** id kompetensi prasyarat */
  prereq: z.array(CompetencyId).default([]),
  /** kode acuan kerangka internasional; boleh kosong untuk pelajaran khas sekolah (SENI, KARAKTER) */
  refs: z.array(StandardRef).default([]),
  /** wajib untuk lencana/naik level */
  core: z.boolean(),
  /** override aturan penguasaan */
  mastery: MasteryRule.partial().optional(),
  /** mekanik yang disarankan penulis kurikulum ke penulis konten */
  mechanics: z.array(MechanicId).min(1),
  /** catatan untuk peninjau/penulis konten: contoh aksi, jebakan umum */
  catatan: z.string().trim().optional(),
}).superRefine((c, ctx) => {
  const [track, level, unit] = c.id.split(".");
  if (track !== c.track) ctx.addIssue({ code: "custom", path: ["track"], message: `track ${c.track} tidak sama dengan segmen id ${track}` });
  if (level !== c.level) ctx.addIssue({ code: "custom", path: ["level"], message: `level ${c.level} tidak sama dengan segmen id ${level}` });
  if (unit !== c.unit.id) ctx.addIssue({ code: "custom", path: ["unit", "id"], message: `unit.id ${c.unit.id} tidak sama dengan segmen id ${unit}` });
  if (c.prereq.includes(c.id)) ctx.addIssue({ code: "custom", path: ["prereq"], message: "kompetensi tidak boleh jadi prasyarat dirinya sendiri" });
  for (const lang of ["id", "en"] as const) {
    const s = c.statement[lang];
    const awal = lang === "id" ? /^aku bisa\b/i : /^i can\b/i;
    if (!awal.test(s)) ctx.addIssue({ code: "custom", path: ["statement", lang], message: lang === "id" ? 'statement.id harus diawali "Aku bisa"' : 'statement.en harus diawali "I can"' });
    if (s.length > 140) ctx.addIssue({ code: "custom", path: ["statement", lang], message: "statement maksimal 140 karakter" });
  }
});
export type Competency = z.infer<typeof Competency>;

/** Satu berkas kurikulum: kumpulan kompetensi untuk satu track × level (atau lebih). */
export const KurikulumFile = z.object({
  $schema: z.string().optional(),
  versi: z.string().regex(/^\d+\.\d+\.\d+$/),
  kompetensi: z.array(Competency).min(1),
});
export type KurikulumFile = z.infer<typeof KurikulumFile>;
