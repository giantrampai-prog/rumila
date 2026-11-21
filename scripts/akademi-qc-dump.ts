/* eslint-disable @typescript-eslint/no-explicit-any */
// Ringkasan isi paket yang mudah dibaca manusia untuk tinjauan QC manual.
//   npx tsx scripts/akademi-qc-dump.ts <folder-keluaran>
// Satu berkas per kurikulum (mis. MAT-SD3.txt): kompetensi + semua paketnya (teks, emoji, kunci, contoh ronde).
import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { ContentPack, KurikulumFile, type Competency } from "../packages/schema/src/index";
import { buatRonde, knobDefaults } from "../packages/mechanics/src/index";

const out = process.argv[2] ?? "qc-dump";
mkdirSync(out, { recursive: true });
const semua = (d: string): string[] => readdirSync(d).flatMap((n) => { const f = join(d, n); return statSync(f).isDirectory() ? semua(f) : f.endsWith(".json") ? [f] : []; });
const kompetensi: Competency[] = [];
for (const f of semua("content/kurikulum")) { const r = KurikulumFile.safeParse(JSON.parse(readFileSync(f, "utf8"))); if (r.success) kompetensi.push(...r.data.kompetensi); }
const paket: { file: string; p: ContentPack; raw: Record<string, unknown> }[] = [];
for (const f of semua("content/paket")) { const raw = JSON.parse(readFileSync(f, "utf8")); const r = ContentPack.safeParse(raw); if (r.success) paket.push({ file: f, p: r.data, raw }); }

function tampil(p: ContentPack, o: Record<string, unknown>): string {
  const L = p.locale.id;
  const lab = typeof o.labelKey === "string" ? (L[o.labelKey] ?? `?${o.labelKey}`) : "";
  const vis = ["emoji", "color", "scale", "count", "shape", "angka", "width", "value", "role", "price"].filter((k) => o[k] !== undefined).map((k) => k === "emoji" ? String(o[k]) : `${k}=${o[k]}`);
  return `${vis.join(" ")} "${lab}"`.trim();
}
function blok(m: (typeof paket)[number]): string {
  const { p, raw } = m;
  const L = p.locale.id;
  const any = raw as Record<string, any>;
  const dipakai = new Set<string>(["judul", p.instructionKey]);
  const s: string[] = [];
  s.push(`### PAKET ${p.id}  [${p.level} · ${p.mechanic}${any.mode ? `/${any.mode}` : ""}${any.execMode ? `/${any.execMode}` : ""}] berkas ${m.file}`);
  s.push(`kompetensi: ${p.competencyIds.join(", ")}`);
  s.push(`judul: ${L.judul}  | EN: ${p.locale.en.judul}`);
  s.push(`instruksi: ${L[p.instructionKey]}`);
  s.push(`instruksi EN: ${p.locale.en[p.instructionKey]}`);
  for (const [k, v] of Object.entries(p.knobs ?? {})) s.push(`knob ${k}: ${v.min}–${v.max} (def ${v.default})${v.keterangan ? ` — ${v.keterangan}` : ""}`);
  const mark = (o: any) => { if (o && typeof o.labelKey === "string") dipakai.add(o.labelKey); if (o && typeof o.titleKey === "string") dipakai.add(o.titleKey); if (o && typeof o.promptKey === "string") dipakai.add(o.promptKey); };
  if (any.bins) { s.push(`bins: ${any.bins.map((b: any) => { mark(b); return `[${b.id}] ${tampil(p, b)}`; }).join(" | ")}`); }
  if (any.items) s.push(`items (${any.items.length}):\n  ${any.items.map((i: any) => { mark(i); return `${tampil(p, i)}${i.bin ? ` → ${i.bin}` : ""}${i.id ? `  {${i.id}}` : ""}`; }).join("\n  ")}`);
  if (any.pilihan?.length) s.push(`soal pilih:\n  ${any.pilihan.map((r: any) => { mark(r); return `${L[r.promptKey] ?? r.promptKey} :: ${r.choices.join(", ")} ✓${r.correct}`; }).join("\n  ")}`);
  if (any.sequences) s.push(`urutan:\n  ${any.sequences.map((q: any) => { mark(q); return `${L[q.titleKey] ?? q.titleKey ?? q.id}: ${q.steps.map((st: any) => { mark(st); return tampil(p, st); }).join(" → ")}`; }).join("\n  ")}`);
  if (any.goods) s.push(`barang: ${any.goods.map((g: any) => { mark(g); return tampil(p, g); }).join(" | ")}`);
  if (any.denominations) s.push(`uang: ${any.denominations.join(", ")} · priceLabel ${any.priceLabel ?? ""}${any.customerRule ? ` · aturan ${JSON.stringify(any.customerRule)}` : ""}`);
  if (any.patterns?.length) s.push(`pola: ${any.patterns.map((q: any) => q.unit.join("-")).join(" | ")}`);
  if (any.commands) s.push(`perintah: ${any.commands.join(",")} · grid ${any.grids.length} (${any.grids.map((g: any) => `${g.w}x${g.h}/opt${g.optimal}${g.rackSlots ? `/rak${g.rackSlots}` : ""}`).join(" ")})${any.debug ? " · debug" : ""}${any.prediksi ? " · prediksi" : ""}`);
  const lain = Object.entries(L).filter(([k]) => !dipakai.has(k));
  if (lain.length) s.push(`teks lain:\n  ${lain.map(([k, v]) => `${k}: ${v}`).join("\n  ")}`);
  // contoh ronde
  const k = knobDefaults(p);
  for (const seed of [11, 977]) {
    try {
      const r = buatRonde(p, k, seed) as any;
      let j = JSON.stringify(r.ronde, (key, v) => (key === "bins" || key === "grids" || key === "walls") ? undefined : v);
      if (j.length > 700) j = j.slice(0, 700) + "…";
      s.push(`contoh ronde seed ${seed}: ${j}`);
    } catch (e) { s.push(`contoh ronde GAGAL: ${(e as Error).message}`); }
  }
  return s.join("\n");
}
const grup = new Map<string, Competency[]>();
for (const c of kompetensi) { const g = `${c.track}-${c.level}`; (grup.get(g) ?? grup.set(g, []).get(g)!).push(c); }
for (const [g, cs] of grup) {
  const s: string[] = [`# ${g} — ${cs.length} kompetensi`];
  for (const c of cs) {
    s.push(`\n## KOMPETENSI ${c.id}${c.core ? " (inti)" : ""} — modul "${c.unit.nama.id}"\n"${c.statement.id}"\nmekanik: ${c.mechanics.join(",")}${c.catatan ? `\ncatatan: ${c.catatan}` : ""}`);
    for (const m of paket.filter((x) => x.p.competencyIds[0] === c.id)) s.push("\n" + blok(m));
    const lain = paket.filter((x) => x.p.competencyIds.slice(1).includes(c.id)).map((x) => x.p.id);
    if (lain.length) s.push(`(juga dilatih paket: ${lain.join(", ")})`);
  }
  writeFileSync(join(out, `${g}.txt`), s.join("\n"));
}
console.log(`ditulis ${grup.size} berkas ke ${out}`);
