// Pemakaian: npm run -s akademi:index
// Membaca content/kurikulum/*.json dan content/paket/**/*.json lalu menulis src/lib/akademi/katalog.generated.ts
// berisi JSON literal apa adanya (bukan import per berkas), supaya Next tidak perlu me-resolve tiap JSON.
// Validasi zod dilakukan di src/lib/akademi/konten.ts saat modul dimuat; di sini hanya JSON.parse.

import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const root = resolve(process.cwd());
const OUT = resolve(root, "src/lib/akademi/katalog.generated.ts");
const OUT_JUMLAH = resolve(root, "src/lib/akademi/jumlah.generated.ts");

/** Berkas .json langsung di folder (tanpa subfolder) — kurikulum punya subfolder `tinjauan` yang bukan kurikulum. */
function jsonDi(dir: string): string[] {
  try {
    return readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => join(dir, f))
      .filter((f) => statSync(f).isFile())
      .sort();
  } catch {
    return [];
  }
}

/** Semua .json di folder dan subfoldernya. */
function jsonRekursif(dir: string): string[] {
  try {
    const st = statSync(dir);
    if (st.isFile()) return dir.endsWith(".json") ? [dir] : [];
    return readdirSync(dir)
      .sort()
      .flatMap((f) => jsonRekursif(join(dir, f)));
  } catch {
    return [];
  }
}

function baca(files: string[], label: string): unknown[] {
  const out: unknown[] = [];
  for (const f of files) {
    try {
      out.push(JSON.parse(readFileSync(f, "utf8")));
    } catch (e) {
      console.error(`✗ ${label} ${relative(root, f)}: JSON tidak bisa dibaca —`, e instanceof Error ? e.message : e);
      process.exitCode = 1;
    }
  }
  return out;
}

const kurikulum = baca(jsonDi(resolve(root, "content/kurikulum")), "kurikulum");
// Golden set ikut dimainkan sebagai aktivitas; folder tambahan bisa diberikan lewat argumen.
const folderPaket = ["content/paket", "content/golden", ...process.argv.slice(2)];
const paket = baca(folderPaket.flatMap((d) => jsonRekursif(resolve(root, d))), "paket").filter((p) => !(p && typeof p === "object" && Array.isArray((p as { kompetensi?: unknown }).kompetensi)));

const header = `// DIBUAT OTOMATIS oleh scripts/akademi-index.ts — jangan diedit.
// Sumber: content/kurikulum/*.json (${kurikulum.length} berkas) dan content/paket/**/*.json (${paket.length} berkas).
// Perbarui dengan: npm run -s akademi:index
`;

const isi =
  header +
  `\nexport const KURIKULUM_RAW = ${JSON.stringify(kurikulum, null, 2)} as const;\n` +
  `\nexport const PAKET_RAW: unknown[] = ${JSON.stringify(paket, null, 2)};\n`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, isi);

// Berkas kecil terpisah untuk kartu beranda (tanpa memuat katalog besar).
const jumlahKompetensi = kurikulum.reduce<number>((n, k) => {
  const arr = k && typeof k === "object" && Array.isArray((k as { kompetensi?: unknown }).kompetensi) ? (k as { kompetensi: unknown[] }).kompetensi : [];
  return n + arr.length;
}, 0);
writeFileSync(
  OUT_JUMLAH,
  `// DIBUAT OTOMATIS oleh scripts/akademi-index.ts — jangan diedit.\n` +
    `export const JUMLAH_PAKET = ${paket.length};\n` +
    `export const JUMLAH_KOMPETENSI = ${jumlahKompetensi};\n`,
);
console.log(`katalog: ${kurikulum.length} berkas kurikulum (${jumlahKompetensi} kompetensi), ${paket.length} paket → ${relative(root, OUT)}, ${relative(root, OUT_JUMLAH)}`);
