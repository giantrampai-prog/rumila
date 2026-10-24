// Paket konten per mekanik dan Aktivitas (mekanik + paket + pemetaan kompetensi).

import { z } from "zod";
import { CompetencyId } from "./kompetensi";
import { Depth, LevelId, MechanicId } from "./jenjang";

export const Semver = z.string().regex(/^\d+\.\d+\.\d+$/);

export const AssetRef = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  kind: z.enum(["image", "audio", "model", "sprite"]),
  /** jalur relatif di bucket konten; hash diisi saat publikasi */
  path: z.string().min(1),
  hash: z.string().optional(),
});
export type AssetRef = z.infer<typeof AssetRef>;

/** Kunci string: nilai di locale.id dan locale.en harus ada untuk tiap kunci yang dipakai. */
const Key = z.string().regex(/^[a-zA-Z0-9]+(?:[._-][a-zA-Z0-9]+)*$/);
const Slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const KnobSchema = z.record(Key, z.object({
  min: z.number(), max: z.number(), default: z.number(), step: z.number().positive().default(1),
  keterangan: z.string().optional(),
}));

const Base = {
  id: Slug,
  version: Semver,
  level: LevelId,
  competencyIds: z.array(CompetencyId).min(1),
  /** kunci instruksi yang dibacakan (VO) saat aktivitas mulai */
  instructionKey: Key,
  locale: z.object({ id: z.record(Key, z.string().min(1)), en: z.record(Key, z.string().min(1)) }),
  knobs: KnobSchema,
  assets: z.array(AssetRef).default([]),
  /** seed acak dibolehkan? bila false, item dipakai apa adanya */
  generatif: z.boolean().default(true),
};

export const PaketPilah = z.object({
  ...Base,
  mechanic: z.literal("pilah"),
  bins: z.array(z.object({ id: Slug, labelKey: Key, assetId: Slug.optional() })).min(2).max(5),
  items: z.array(z.object({ id: Slug, labelKey: Key, bin: Slug, assetId: Slug.optional() })).min(4),
});

export const PaketUrutkan = z.object({
  ...Base,
  mechanic: z.literal("urutkan"),
  sequences: z.array(z.object({
    id: Slug,
    titleKey: Key,
    steps: z.array(z.object({ id: Slug, labelKey: Key, assetId: Slug.optional() })).min(2).max(8),
  })).min(1),
});

export const PaketDagang = z.object({
  ...Base,
  mechanic: z.literal("dagang"),
  currency: z.literal("IDR"),
  /** pecahan uang yang tersedia di laci */
  denominations: z.array(z.number().int().positive()).min(1),
  goods: z.array(z.object({ id: Slug, labelKey: Key, price: z.number().int().positive(), assetId: Slug.optional() })).min(2),
  /** aturan pembeli yang dibangkitkan dari seed */
  customerRule: z.object({ itemsMin: z.number().int().min(1), itemsMax: z.number().int().min(1), payExact: z.boolean(), maxTotal: z.number().int().positive() }),
});

export const PaketNavigasi = z.object({
  ...Base,
  mechanic: z.literal("navigasi"),
  commands: z.array(z.enum(["maju", "kiri", "kanan", "ulangi", "kalau"])).min(1),
  grids: z.array(z.object({
    id: Slug,
    w: z.number().int().min(2).max(10),
    h: z.number().int().min(1).max(10),
    start: z.object({ x: z.number().int().min(0), y: z.number().int().min(0), dir: z.enum(["N", "E", "S", "W"]) }),
    goal: z.object({ x: z.number().int().min(0), y: z.number().int().min(0) }),
    walls: z.array(z.object({ x: z.number().int().min(0), y: z.number().int().min(0) })).default([]),
    /** jumlah perintah program terpendek; dipakai untuk menilai efisiensi */
    optimal: z.number().int().min(1),
  })).min(1),
});

export const ContentPack = z.discriminatedUnion("mechanic", [PaketPilah, PaketUrutkan, PaketDagang, PaketNavigasi]);
export type ContentPack = z.infer<typeof ContentPack>;

/** Mekanik yang sudah punya skema paket. Mekanik lain menyusul. */
export const PACK_MECHANICS: readonly MechanicId[] = ["pilah", "urutkan", "dagang", "navigasi"];

export const Activity = z.object({
  id: Slug,
  mechanic: MechanicId,
  pack: Slug,
  competencies: z.array(z.object({ id: CompetencyId, depth: Depth, weight: z.number().positive().default(1) })).min(1),
  knobDefaults: z.record(Key, z.number()).default({}),
  world: Slug.optional(),
  minutes: z.number().int().min(1).max(20),
});
export type Activity = z.infer<typeof Activity>;
