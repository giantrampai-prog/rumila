// Konstanta jenjang, mata pelajaran, mekanik, dan kerangka acuan.
// Id di sini stabil selamanya: dipakai di kode kompetensi, event, dan sertifikat.

import { z } from "zod";

export const LEVEL_IDS = [
  "PAUD", "TKA", "TKB",
  "SD1", "SD2", "SD3", "SD4", "SD5", "SD6",
  "SMP1", "SMP2", "SMP3",
  "SMA1", "SMA2", "SMA3",
] as const;
export const LevelId = z.enum(LEVEL_IDS);
export type LevelId = z.infer<typeof LevelId>;

/** Jenjang yang sudah masuk lingkup produk. Sisanya dicadangkan. */
export const ACTIVE_LEVELS: readonly LevelId[] = ["PAUD", "TKA", "TKB", "SD1", "SD2", "SD3", "SD4", "SD5", "SD6"];

export interface LevelMeta { id: LevelId; nama: string; usia: [number, number]; pangkat: string; acuan: string }
export const LEVELS: readonly LevelMeta[] = [
  { id: "PAUD", nama: "PAUD", usia: [3, 4], pangkat: "Tunas", acuan: "Cambridge Early Years 1, EYFS" },
  { id: "TKA", nama: "TK A", usia: [4, 5], pangkat: "Kadet", acuan: "Cambridge Early Years 2" },
  { id: "TKB", nama: "TK B", usia: [5, 6], pangkat: "Navigator", acuan: "Cambridge Early Years 3, Pre-A1 Starters" },
  { id: "SD1", nama: "SD 1", usia: [6, 7], pangkat: "Pilot", acuan: "Cambridge Primary Stage 1" },
  { id: "SD2", nama: "SD 2", usia: [7, 8], pangkat: "Kapten", acuan: "Cambridge Primary Stage 2, A1 Movers" },
  { id: "SD3", nama: "SD 3", usia: [8, 9], pangkat: "Komandan", acuan: "Cambridge Primary Stage 3" },
  { id: "SD4", nama: "SD 4", usia: [9, 10], pangkat: "Laksamana", acuan: "Cambridge Primary Stage 4, A2 Flyers" },
  { id: "SD5", nama: "SD 5", usia: [10, 11], pangkat: "Penjelajah", acuan: "Cambridge Primary Stage 5" },
  { id: "SD6", nama: "SD 6", usia: [11, 12], pangkat: "Legenda", acuan: "Cambridge Primary Stage 6, Checkpoint" },
  { id: "SMP1", nama: "SMP 1", usia: [12, 13], pangkat: "", acuan: "dicadangkan" },
  { id: "SMP2", nama: "SMP 2", usia: [13, 14], pangkat: "", acuan: "dicadangkan" },
  { id: "SMP3", nama: "SMP 3", usia: [14, 15], pangkat: "", acuan: "dicadangkan" },
  { id: "SMA1", nama: "SMA 1", usia: [15, 16], pangkat: "", acuan: "dicadangkan" },
  { id: "SMA2", nama: "SMA 2", usia: [16, 17], pangkat: "", acuan: "dicadangkan" },
  { id: "SMA3", nama: "SMA 3", usia: [17, 18], pangkat: "", acuan: "dicadangkan" },
];
export const levelIndex = (id: LevelId) => LEVEL_IDS.indexOf(id);

export const TRACK_IDS = ["MAT", "KODE", "SAINS", "BIND", "BING", "DUNIA", "SENI", "KARAKTER"] as const;
export const TrackId = z.enum(TRACK_IDS);
export type TrackId = z.infer<typeof TrackId>;

export interface TrackMeta { id: TrackId; nama: { id: string; en: string }; singkat: string; /** mengacu kerangka internasional langsung */ internasional: boolean }
export const TRACKS: readonly TrackMeta[] = [
  { id: "MAT", nama: { id: "Matematika", en: "Mathematics" }, singkat: "MA", internasional: true },
  { id: "KODE", nama: { id: "Coding", en: "Computing" }, singkat: "KO", internasional: true },
  { id: "SAINS", nama: { id: "Sains", en: "Science" }, singkat: "SA", internasional: true },
  { id: "BIND", nama: { id: "Bahasa Indonesia", en: "Indonesian" }, singkat: "BI", internasional: true },
  { id: "BING", nama: { id: "Bahasa Inggris", en: "English" }, singkat: "EN", internasional: true },
  { id: "DUNIA", nama: { id: "Dunia & Budaya", en: "World & Culture" }, singkat: "DU", internasional: true },
  { id: "SENI", nama: { id: "Seni & Musik", en: "Art & Music" }, singkat: "SE", internasional: false },
  { id: "KARAKTER", nama: { id: "Karakter & Agama", en: "Character & Religion" }, singkat: "KA", internasional: false },
];

export const MECHANIC_IDS = [
  "pilah", "urutkan", "bangun", "dagang", "navigasi", "simulasi",
  "cerita", "telusur", "ucap", "cari", "pola", "rawat",
] as const;
export const MechanicId = z.enum(MECHANIC_IDS);
export type MechanicId = z.infer<typeof MechanicId>;

export const DEPTHS = ["kenal", "pakai", "cipta"] as const;
export const Depth = z.enum(DEPTHS);
export type Depth = z.infer<typeof Depth>;

export const FRAMEWORK_IDS = [
  "CAMBRIDGE_EY", "CAMBRIDGE_PRIMARY_MATHS", "CAMBRIDGE_PRIMARY_COMPUTING",
  "CAMBRIDGE_PRIMARY_SCIENCE", "CAMBRIDGE_PRIMARY_ENGLISH", "CAMBRIDGE_GLOBAL_PERSPECTIVES",
  "EYFS", "COMMON_CORE", "CEFR", "KURMER",
] as const;
export const FrameworkId = z.enum(FRAMEWORK_IDS);
export type FrameworkId = z.infer<typeof FrameworkId>;

/** Teks dwibahasa. Keduanya wajib terisi. */
export const Dwibahasa = z.object({ id: z.string().trim().min(1), en: z.string().trim().min(1) });
export type Dwibahasa = z.infer<typeof Dwibahasa>;
