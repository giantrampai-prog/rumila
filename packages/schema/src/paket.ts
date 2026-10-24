// Paket konten per mekanik dan Aktivitas (mekanik + paket + pemetaan kompetensi).
// Slice 1: empat mekanik (pilah, urutkan, dagang, navigasi), masing-masing punya beberapa "mode" supaya satu
// mesin bisa membuktikan banyak kompetensi tanpa menambah mekanik baru.

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
export type KnobSchema = z.infer<typeof KnobSchema>;

/** Tampilan benda tanpa aset: emoji + warna + skala. Presenter 2D menggambar dari sini. */
const Visual = {
  /** satu emoji (boleh gabungan ZWJ) */
  emoji: z.string().min(1).optional(),
  /** warna isi/latar (hex) */
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  /** skala relatif 0.5–2 (besar/kecil, panjang/pendek) */
  scale: z.number().min(0.25).max(3).optional(),
  /** jumlah salinan yang digambar (kelompok benda) */
  count: z.number().int().min(1).max(20).optional(),
  /** bentuk dasar untuk benda tanpa emoji */
  shape: z.enum(["circle", "square", "triangle", "rect", "star"]).optional(),
  /** lebar relatif untuk benda memanjang (ular, pensil) */
  width: z.number().min(0.25).max(4).optional(),
};

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
  /** jumlah ronde per aktivitas (default 5) */
  rounds: z.number().int().min(1).max(12).default(5),
  /** dunia tempat aktivitas digambar (latar) */
  world: Slug.default("kebun-pasar"),
};

/* ---------------- pilah ---------------- */

export const PilahBin = z.object({ id: Slug, labelKey: Key, assetId: Slug.optional(), ...Visual });
export const PilahItem = z.object({ id: Slug, labelKey: Key, bin: Slug, assetId: Slug.optional(), ...Visual });
/** mode "pilih": satu ronde = satu pertanyaan dengan beberapa pilihan, tepat satu benar */
export const PilahRonde = z.object({ id: Slug, promptKey: Key, choices: z.array(Slug).min(2).max(6), correct: Slug });

export const PaketPilahObj = z.object({
  ...Base,
  mechanic: z.literal("pilah"),
  /** kelompok: seret tiap item ke bin-nya · pilih: sentuh satu pilihan yang benar */
  mode: z.enum(["kelompok", "pilih"]).default("kelompok"),
  bins: z.array(PilahBin).min(1).max(10),
  items: z.array(PilahItem).min(2),
  pilihan: z.array(PilahRonde).default([]),
});
export const PaketPilah = PaketPilahObj.superRefine(refinePilah);
function refinePilah(p: z.infer<typeof PaketPilahObj>, ctx: z.RefinementCtx) {
  const bins = new Set(p.bins.map(b => b.id));
  const items = new Set(p.items.map(i => i.id));
  if (p.mode === "kelompok") {
    if (p.bins.length < 2) ctx.addIssue({ code: "custom", path: ["bins"], message: "mode kelompok butuh minimal 2 bin" });
    if (p.items.length < 4) ctx.addIssue({ code: "custom", path: ["items"], message: "mode kelompok butuh minimal 4 item" });
    for (const i of p.items) if (!bins.has(i.bin)) ctx.addIssue({ code: "custom", path: ["items"], message: `item ${i.id} menunjuk bin ${i.bin} yang tidak ada` });
  } else {
    if (p.pilihan.length < 1) ctx.addIssue({ code: "custom", path: ["pilihan"], message: "mode pilih butuh minimal 1 ronde pilihan" });
    for (const r of p.pilihan) {
      for (const c of r.choices) if (!items.has(c)) ctx.addIssue({ code: "custom", path: ["pilihan"], message: `ronde ${r.id}: pilihan ${c} bukan item` });
      if (!r.choices.includes(r.correct)) ctx.addIssue({ code: "custom", path: ["pilihan"], message: `ronde ${r.id}: jawaban ${r.correct} tidak ada di pilihan` });
    }
  }
}
export type PaketPilah = z.infer<typeof PaketPilah>;

/* ---------------- urutkan ---------------- */

export const UrutkanStep = z.object({ id: Slug, labelKey: Key, assetId: Slug.optional(), ...Visual });
export const PaketUrutkanObj = z.object({
  ...Base,
  mechanic: z.literal("urutkan"),
  /** susun: langkah diacak, anak menyusun · perbaiki: satu pasang tertukar, anak menukar tepat satu kali ·
   *  dulu: dua langkah, anak menyentuh yang terjadi lebih dulu */
  mode: z.enum(["susun", "perbaiki", "dulu"]).default("susun"),
  sequences: z.array(z.object({
    id: Slug,
    titleKey: Key,
    steps: z.array(UrutkanStep).min(2).max(8),
  })).min(1),
});
export const PaketUrutkan = PaketUrutkanObj.superRefine(refineUrutkan);
function refineUrutkan(p: z.infer<typeof PaketUrutkanObj>, ctx: z.RefinementCtx) {
  if (p.mode === "dulu" && p.sequences.some(s => s.steps.length !== 2)) ctx.addIssue({ code: "custom", path: ["sequences"], message: "mode dulu: tiap sequence tepat 2 langkah" });
  if (p.mode !== "dulu" && p.sequences.some(s => s.steps.length < 3)) ctx.addIssue({ code: "custom", path: ["sequences"], message: "mode susun/perbaiki: minimal 3 langkah" });
}
export type PaketUrutkan = z.infer<typeof PaketUrutkan>;

/* ---------------- dagang ---------------- */

export const DagangGood = z.object({ id: Slug, labelKey: Key, price: z.number().int().positive(), assetId: Slug.optional(), ...Visual });

export const DAGANG_MODES = [
  /** pembeli minta N barang (1–2 jenis); anak memasukkan tepat sebanyak itu ke keranjang */
  "ambil",
  /** benda tersebar; anak menyentuh satu per satu (yang sudah disentuh meredup) lalu menggeser penanda strip ke jumlahnya */
  "hitung",
  /** pembeli mengacungkan N jari sekejap (flashMs); anak mengambil sebanyak itu */
  "subitasi",
  /** harga tertera (koin atau rupiah); anak menaruh uang dari laci tepat sebesar harga */
  "bayar",
  /** pembeli bayar `paid`; anak memberi kembalian tepat */
  "kembalian",
  /** satu lembar ditukar koin: anak menyusun koin sejumlah nilainya */
  "tukar",
  /** dua kelompok digabung; anak menggeser penanda strip ke jumlahnya */
  "gabung",
  /** dari N, diambil K; anak menaruh benda sebanyak sisanya */
  "sisa",
  /** pembeli menunjukkan K koin sekejap; harga target; anak menambah koin sebanyak kekurangannya */
  "lengkapi",
] as const;
export const DagangMode = z.enum(DAGANG_MODES);
export type DagangMode = z.infer<typeof DagangMode>;

export const PaketDagang = z.object({
  ...Base,
  mechanic: z.literal("dagang"),
  mode: DagangMode.default("ambil"),
  currency: z.literal("IDR"),
  /** pecahan uang yang tersedia di laci (rupiah). 1000 = koin seribu */
  denominations: z.array(z.number().int().positive()).min(1),
  /** harga ditampilkan sebagai jumlah koin bergambar (TK A) atau "Rp7.000" (TK B) */
  priceLabel: z.enum(["koin", "rupiah"]).default("rupiah"),
  goods: z.array(DagangGood).min(1),
  /** aturan pembeli yang dibangkitkan dari seed */
  customerRule: z.object({
    itemsMin: z.number().int().min(1), itemsMax: z.number().int().min(1),
    payExact: z.boolean(), maxTotal: z.number().int().positive(),
    /** jenis barang per pesanan (1–2) */
    kindsMax: z.number().int().min(1).max(3).default(1),
    /** lama tampil (ms) untuk mode subitasi/lengkapi */
    flashMs: z.number().int().min(300).max(5000).optional(),
    /** mode lengkapi/gabung/sisa: target jumlah (5 atau 10) */
    target: z.number().int().min(2).max(20).optional(),
  }),
});
export type PaketDagang = z.infer<typeof PaketDagang>;

/* ---------------- navigasi ---------------- */

/** Semantik blok: lihat docs/akademi/mekanik-navigasi.md */
export const NAV_COMMANDS = ["maju", "lompat", "kiri", "kanan", "ulangi", "kalau", "bendera"] as const;
export const NavCommand = z.enum(NAV_COMMANDS);
export type NavCommand = z.infer<typeof NavCommand>;

const Cell = z.object({ x: z.number().int().min(0), y: z.number().int().min(0) });

/** Blok program di dalam JSON paket (untuk program awal mode debug / ulangi). */
export type NavBlockJson =
  | { cmd: "maju" | "lompat" | "kiri" | "kanan" | "kalau" | "bendera" }
  | { cmd: "ulangi"; n: number; body: NavBlockJson[] };
export const NavBlockJson: z.ZodType<NavBlockJson> = z.lazy(() => z.union([
  z.object({ cmd: z.enum(["maju", "lompat", "kiri", "kanan", "kalau", "bendera"]) }),
  z.object({ cmd: z.literal("ulangi"), n: z.number().int().min(2).max(6), body: z.array(NavBlockJson).min(1).max(2) }),
]));

export const NavGrid = z.object({
  id: Slug,
  w: z.number().int().min(2).max(10),
  h: z.number().int().min(1).max(10),
  start: z.object({ x: z.number().int().min(0), y: z.number().int().min(0), dir: z.enum(["N", "E", "S", "W"]) }),
  goal: Cell,
  /** dinding: maju ke sini = tabrak (program berhenti) */
  walls: z.array(Cell).default([]),
  /** batu: maju ke sini = tersandung; harus dilompati (lompat pindah 2 petak) */
  rocks: z.array(Cell).default([]),
  /** jumlah perintah program terpendek; dipakai untuk menilai efisiensi */
  optimal: z.number().int().min(1),
  /** batas slot rak program (mode program); tanpa batas bila kosong */
  rackSlots: z.number().int().min(1).max(12).optional(),
  /** program awal (mode debug): anak memperbaiki tepat `fixes` blok */
  program: z.array(NavBlockJson).optional(),
  fixes: z.number().int().min(1).max(3).optional(),
  /** kelompok grid yang harus lolos dengan satu program (kondisi) */
  group: Slug.optional(),
});
export type NavGrid = z.infer<typeof NavGrid>;

export const PaketNavigasiObj = z.object({
  ...Base,
  mechanic: z.literal("navigasi"),
  /** langsung: tiap tombol dijalankan seketika (PAUD) · program: susun di rak lalu jalan · langkah: satu blok per ketukan (prediksi) */
  execMode: z.enum(["langsung", "program", "langkah"]).default("program"),
  commands: z.array(NavCommand).min(1),
  /** mode debug: grid membawa `program` awal dan `fixes` */
  debug: z.boolean().default(false),
  /** satu program harus lolos di semua grid satu `group` (kondisi) */
  semuaGrid: z.boolean().default(false),
  /** mode prediksi (langkah): anak menunjuk petak tujuan sebelum tiap blok dijalankan */
  prediksi: z.boolean().default(false),
  grids: z.array(NavGrid).min(1),
});
export const PaketNavigasi = PaketNavigasiObj.superRefine(refineNavigasi);
function refineNavigasi(p: z.infer<typeof PaketNavigasiObj>, ctx: z.RefinementCtx) {
  for (const g of p.grids) {
    const inside = (c: { x: number; y: number }) => c.x < g.w && c.y < g.h;
    if (!inside(g.start) || !inside(g.goal)) ctx.addIssue({ code: "custom", path: ["grids"], message: `grid ${g.id}: start/goal di luar grid` });
    if (p.debug && (!g.program || !g.fixes)) ctx.addIssue({ code: "custom", path: ["grids"], message: `grid ${g.id}: mode debug butuh program dan fixes` });
    if (g.rocks.length && !p.commands.includes("lompat") && !p.commands.includes("kalau")) ctx.addIssue({ code: "custom", path: ["grids"], message: `grid ${g.id}: ada batu tetapi tidak ada perintah lompat/kalau` });
  }
  if (p.semuaGrid && p.grids.some(g => !g.group)) ctx.addIssue({ code: "custom", path: ["grids"], message: "semuaGrid: tiap grid harus punya group" });
}
export type PaketNavigasi = z.infer<typeof PaketNavigasi>;

export const ContentPack = z.discriminatedUnion("mechanic", [PaketPilahObj, PaketUrutkanObj, PaketDagang, PaketNavigasiObj]).superRefine((p, ctx) => {
  if (p.mechanic === "pilah") refinePilah(p, ctx);
  else if (p.mechanic === "urutkan") refineUrutkan(p, ctx);
  else if (p.mechanic === "navigasi") refineNavigasi(p, ctx);
});
export type ContentPack = z.infer<typeof ContentPack>;

/** Mekanik yang sudah punya skema paket. Mekanik lain menyusul. */
export const PACK_MECHANICS: readonly MechanicId[] = ["pilah", "urutkan", "dagang", "navigasi"];

/** Semua kunci locale yang dipakai sebuah paket (untuk validasi dwibahasa). */
export function kunciLocale(d: ContentPack): Set<string> {
  const k = new Set<string>([d.instructionKey]);
  if (d.mechanic === "pilah") { d.bins.forEach(b => k.add(b.labelKey)); d.items.forEach(i => k.add(i.labelKey)); d.pilihan.forEach(r => k.add(r.promptKey)); }
  if (d.mechanic === "urutkan") d.sequences.forEach(s => { k.add(s.titleKey); s.steps.forEach(x => k.add(x.labelKey)); });
  if (d.mechanic === "dagang") d.goods.forEach(g => k.add(g.labelKey));
  return k;
}

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
