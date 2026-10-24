// Pemakaian: npm run akademi:validate -- [berkas-atau-folder ...]
// Tanpa argumen: validasi content/kurikulum dan content/golden terhadap content/kerangka.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { ContentPack, Kamus, KerangkaFile, KurikulumFile, adaError, validasiKurikulum, type Competency } from "./index";

const root = resolve(process.cwd());
const args = process.argv.slice(2);
const targets = args.length ? args : ["content/kurikulum", "content/golden"];

function jsonFiles(p: string): string[] {
  const abs = resolve(root, p);
  try {
    const st = statSync(abs);
    if (st.isFile()) return abs.endsWith(".json") ? [abs] : [];
    return readdirSync(abs).flatMap(f => jsonFiles(join(abs, f)));
  } catch { return []; }
}

const kamus = new Kamus();
for (const f of jsonFiles("content/kerangka")) {
  const r = KerangkaFile.safeParse(JSON.parse(readFileSync(f, "utf8")));
  if (r.success) kamus.add(r.data); else console.error(`kerangka tidak valid: ${f}\n  ${r.error.issues.map(i => i.path.join(".") + ": " + i.message).join("\n  ")}`);
}
console.log(`kamus kerangka: ${kamus.size} kode`);

let gagal = 0;
const semua: Competency[] = [];
let paket = 0;
for (const f of targets.flatMap(jsonFiles)) {
  const raw = JSON.parse(readFileSync(f, "utf8"));
  const rel = f.slice(root.length + 1);
  if (raw && Array.isArray(raw.kompetensi)) {
    const r = KurikulumFile.safeParse(raw);
    if (!r.success) { gagal++; console.error(`✗ ${rel}\n  ${r.error.issues.map(i => i.path.join(".") + ": " + i.message).join("\n  ")}`); continue; }
    semua.push(...r.data.kompetensi);
    console.log(`✓ ${rel}: ${r.data.kompetensi.length} kompetensi`);
  } else if (raw && typeof raw.mechanic === "string") {
    const r = ContentPack.safeParse(raw);
    if (!r.success) { gagal++; console.error(`✗ ${rel}\n  ${r.error.issues.map(i => i.path.join(".") + ": " + i.message).join("\n  ")}`); continue; }
    // kunci string harus ada di kedua bahasa
    const kunci = new Set<string>([r.data.instructionKey]);
    const d = r.data;
    if (d.mechanic === "pilah") { d.bins.forEach(b => kunci.add(b.labelKey)); d.items.forEach(i => kunci.add(i.labelKey)); }
    if (d.mechanic === "urutkan") d.sequences.forEach(s => { kunci.add(s.titleKey); s.steps.forEach(x => kunci.add(x.labelKey)); });
    if (d.mechanic === "dagang") d.goods.forEach(g => kunci.add(g.labelKey));
    const hilang = [...kunci].filter(k => !d.locale.id[k] || !d.locale.en[k]);
    if (hilang.length) { gagal++; console.error(`✗ ${rel}: kunci locale hilang: ${hilang.join(", ")}`); continue; }
    if (d.mechanic === "pilah") {
      const bins = new Set(d.bins.map(b => b.id));
      const salah = d.items.filter(i => !bins.has(i.bin)).map(i => i.id);
      if (salah.length) { gagal++; console.error(`✗ ${rel}: item menunjuk bin yang tidak ada: ${salah.join(", ")}`); continue; }
    }
    paket++;
    console.log(`✓ ${rel}: paket ${d.mechanic} (${d.competencyIds.length} kompetensi)`);
  }
}

if (semua.length) {
  const temuan = validasiKurikulum(semua, kamus);
  for (const t of temuan) console[t.tingkat === "error" ? "error" : "warn"](`${t.tingkat === "error" ? "✗" : "!"} ${t.id}: ${t.pesan}`);
  if (adaError(temuan)) gagal++;
  console.log(`${semua.length} kompetensi, ${temuan.filter(t => t.tingkat === "error").length} error, ${temuan.filter(t => t.tingkat === "warning").length} peringatan`);
}
console.log(`${paket} paket konten valid`);
process.exit(gagal ? 1 : 0);
