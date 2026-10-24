// Pemakaian: npm run akademi:validate -- [berkas-atau-folder ...]
// Tanpa argumen: validasi content/kurikulum dan content/golden terhadap content/kerangka.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { ContentPack, Kamus, KerangkaFile, KurikulumFile, adaError, kunciLocale, validasiKurikulum, type Competency } from "./index";

const root = resolve(process.cwd());
const args = process.argv.slice(2);
const targets = args.length ? args : ["content/kurikulum", "content/golden", "content/paket"];

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
let paketTotal = 0;
const paketId = new Map<string, number>();

/** id kompetensi dari content/kurikulum: paket hanya boleh menunjuk ke sini (golden set diperlakukan sama). */
const semuaKompetensi = new Set<string>();
for (const f of jsonFiles("content/kurikulum")) {
  const raw = JSON.parse(readFileSync(f, "utf8"));
  if (raw && Array.isArray(raw.kompetensi)) for (const c of raw.kompetensi) if (c?.id) semuaKompetensi.add(c.id);
}

/** Tiap target dinilai sebagai satu kurikulum utuh; golden set dan content/kurikulum sengaja memakai id yang sama. */
for (const target of targets) {
  const semua: Competency[] = [];
  let paket = 0;
  const files = jsonFiles(target);
  if (!files.length) continue;
  console.log(`\n== ${target}`);
  for (const f of files) {
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
      const d = r.data;
      const hilang = [...kunciLocale(d)].filter(k => !d.locale.id[k] || !d.locale.en[k]);
      if (hilang.length) { gagal++; console.error(`✗ ${rel}: kunci locale hilang: ${hilang.join(", ")}`); continue; }
      for (const cid of d.competencyIds) if (!semuaKompetensi.has(cid)) { gagal++; console.error(`✗ ${rel}: kompetensi ${cid} tidak ada di content/kurikulum`); }
      paketId.set(d.id, (paketId.get(d.id) ?? 0) + 1);
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
  paketTotal += paket;
}
for (const [id, n] of paketId) if (n > 1) { gagal++; console.error(`✗ id paket ganda: ${id} (${n}×)`); }
console.log(`\n${paketTotal} paket konten valid`);
process.exit(gagal ? 1 : 0);
