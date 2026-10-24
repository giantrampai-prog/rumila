// Pemakaian: npx tsx scripts/akademi-suara.ts [--dry-run] [--only <paketId>]
//
// Membangkitkan suara instruksi Academy dari ElevenLabs lalu menulis manifes
// src/lib/akademi/suara-manifest.generated.ts (teks → /akademi/suara/<hash>.mp3).
//
// Sumber kalimat:
//   - content/paket/**/*.json dan content/golden/paket-*.json (ContentPack dari @akademi/schema):
//     locale.id[instructionKey], pilah mode pilih → pilihan[].promptKey, urutkan → sequences[].titleKey,
//     dagang → nama tiap barang (goods[].labelKey) sebagai potongan frasa dinamis,
//     pola/simulasi → nama tiap benda/hewan/alat (items[].labelKey).
//   - Kalimat tetap runner (pujian, akhir aktivitas).
//   - Potongan frasa dagang: angka "satu".."dua puluh" (angka-<n>.mp3), "Aku mau", "Harganya", "ribu", "koin", "dan".
//
// Env: ELEVENLABS_API_KEY (wajib untuk generasi), ELEVENLABS_VOICE_ID (default Genesius),
//      ELEVENLABS_MODEL_ID (default eleven_multilingual_v2). Tanpa kunci: --dry-run tetap jalan.

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { ContentPack, isiBarang } from "@akademi/schema";

const root = resolve(process.cwd());
const OUT_DIR = resolve(root, "public/akademi/suara");
const OUT_MANIFEST = resolve(root, "src/lib/akademi/suara-manifest.generated.ts");
const URL_PREFIX = "/akademi/suara/";

const API_KEY = process.env.ELEVENLABS_API_KEY ?? "";
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID ?? "2lcxSPWqG78QhJnKPyMX"; // "Genesius"
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID ?? "eleven_multilingual_v2";
const LANGUAGE = "id";
const OUTPUT_FORMAT = "mp3_44100_128";
const PARALEL = 3;
const RETRY = 3;

/* ---------------- argumen ---------------- */

const argv = process.argv.slice(2);
const dryRun = argv.includes("--dry-run");
const onlyIdx = argv.indexOf("--only");
const only = onlyIdx >= 0 ? argv[onlyIdx + 1] : undefined;
if (onlyIdx >= 0 && !only) {
  console.error("✗ --only butuh <paketId>");
  process.exit(1);
}

/* ---------------- kalimat tetap ---------------- */

const KALIMAT_RUNNER = [
  "Hebat! Kamu dapat stiker baru.",
  "Bagus, kamu sudah mencoba. Ayo main lagi.",
  "Hebat!",
  "Coba lagi, ya",
];

const ANGKA = [
  "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh",
  "sebelas", "dua belas", "tiga belas", "empat belas", "lima belas", "enam belas", "tujuh belas", "delapan belas", "sembilan belas", "dua puluh",
];

const FRASA_DAGANG = ["Aku mau", "Harganya", "ribu", "koin", "dan"];

/* ---------------- kumpulkan ---------------- */

type Item = { teks: string; file: string; sumber: string; paketId?: string };

/** Semua .json di folder dan subfoldernya. */
function jsonRekursif(dir: string): string[] {
  try {
    const st = statSync(dir);
    if (st.isFile()) return dir.endsWith(".json") ? [dir] : [];
    return readdirSync(dir).sort().flatMap((f) => jsonRekursif(join(dir, f)));
  } catch {
    return [];
  }
}

function hash12(teks: string) {
  return createHash("sha1").update(teks, "utf8").digest("hex").slice(0, 12);
}

const daftar = new Map<string, Item>();
function tambah(teks: string, sumber: string, file?: string, paketId?: string) {
  const t = teks.trim();
  if (!t) return;
  if (daftar.has(t)) return;
  daftar.set(t, { teks: t, file: file ?? `${hash12(t)}.mp3`, sumber, paketId });
}

const berkasPaket = [
  ...jsonRekursif(resolve(root, "content/paket")),
  ...jsonRekursif(resolve(root, "content/golden")).filter((f) => /paket-[^/]*\.json$/.test(f)),
];

let jumlahPaket = 0;
for (const f of berkasPaket) {
  const rel = relative(root, f);
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(f, "utf8"));
  } catch (e) {
    console.error(`✗ ${rel}: JSON tidak bisa dibaca —`, e instanceof Error ? e.message : e);
    process.exitCode = 1;
    continue;
  }
  const hasil = ContentPack.safeParse(raw);
  if (!hasil.success) {
    console.error(`✗ ${rel}: tidak lolos skema ContentPack — ${hasil.error.issues[0]?.message ?? "?"}`);
    process.exitCode = 1;
    continue;
  }
  const p = hasil.data;
  jumlahPaket++;
  const id = p.locale.id;
  const ambil = (key: string, apa: string) => {
    const t = id[key];
    if (!t) console.warn(`! ${rel}: ${apa} ${key} tidak ada di locale.id`);
    else tambah(t, `${p.id}:${key}`, undefined, p.id);
  };
  if (p.mechanic === "dagang" && id[p.instructionKey]?.includes("arang}")) {
    // instruksi dengan {barang}: satu kalimat per barang yang mungkin muncul
    for (const g of p.goods) if (id[g.labelKey]) tambah(isiBarang(id[p.instructionKey], id[g.labelKey]), `${p.id}:${p.instructionKey}:${g.id}`, undefined, p.id);
  } else ambil(p.instructionKey, "instructionKey");
  if (p.mechanic === "pilah" && p.mode === "pilih") for (const r of p.pilihan) ambil(r.promptKey, "promptKey");
  if (p.mechanic === "urutkan") for (const s of p.sequences) ambil(s.titleKey, "titleKey");
  if (p.mechanic === "dagang") for (const g of p.goods) ambil(g.labelKey, "goods.labelKey");
  if (p.mechanic === "pola" || p.mechanic === "simulasi") for (const i of p.items) ambil(i.labelKey, "items.labelKey");
}

for (const k of KALIMAT_RUNNER) tambah(k, "runner");
ANGKA.forEach((a, i) => tambah(a, "angka", `angka-${i + 1}.mp3`));
for (const f of FRASA_DAGANG) tambah(f, "frasa-dagang");

/** Semua kalimat (manifes selalu dibangun dari semua); `--only` hanya membatasi yang dibangkitkan. */
const semuaItem = [...daftar.values()];
const items = only ? semuaItem.filter((i) => i.paketId === only) : semuaItem;
if (only && !items.length) {
  console.error(`✗ --only ${only}: paket tidak ditemukan atau tidak punya kalimat`);
  process.exit(1);
}
const totalKarakter = items.reduce((n, i) => n + i.teks.length, 0);

/* ---------------- manifes ---------------- */

function tulisManifest(semua: Item[]) {
  const sudahAda = semua.filter((i) => existsSync(join(OUT_DIR, i.file)));
  const baris = sudahAda
    .sort((a, b) => a.teks.localeCompare(b.teks, "id"))
    .map((i) => `  ${JSON.stringify(i.teks)}: ${JSON.stringify(URL_PREFIX + i.file)},\n`)
    .join("");
  const isi = `// DIBUAT OTOMATIS oleh scripts/akademi-suara.ts — jangan diedit.
// Teks yang dibacakan → berkas MP3 di public/akademi/suara (rekaman narasi EduVoice yang dipotong per kalimat/kata, atau ElevenLabs bila dibuat lewat skrip ini).
// Perbarui dengan: npm run -s akademi:suara
// Hanya teks yang berkasnya sudah ada yang masuk; teks lain jatuh ke speechSynthesis.

export const SUARA: Record<string, string> = {
${baris}};
`;
  writeFileSync(OUT_MANIFEST, isi);
  return sudahAda.length;
}

/* ---------------- ElevenLabs ---------------- */

function tidur(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function tts(teks: string): Promise<Buffer> {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(VOICE_ID)}?output_format=${OUTPUT_FORMAT}`;
  let terakhir = "";
  for (let percobaan = 1; percobaan <= RETRY; percobaan++) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "xi-api-key": API_KEY, "Content-Type": "application/json", Accept: "audio/mpeg" },
      body: JSON.stringify({
        text: teks,
        model_id: MODEL_ID,
        language_code: LANGUAGE,
        voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.2 },
      }),
    }).catch((e: unknown) => {
      terakhir = e instanceof Error ? e.message : String(e);
      return null;
    });
    if (res && res.ok) return Buffer.from(await res.arrayBuffer());
    if (res) {
      terakhir = `HTTP ${res.status} ${await res.text().catch(() => "")}`.trim();
      // 429/5xx: coba lagi dengan backoff; status lain (401, 400, 422) tidak akan sembuh sendiri
      if (res.status !== 429 && res.status < 500) break;
    }
    if (percobaan < RETRY) await tidur(1500 * 2 ** (percobaan - 1));
  }
  throw new Error(terakhir || "gagal tanpa pesan");
}

async function jalankanParalel<T>(antrean: T[], n: number, kerja: (x: T) => Promise<void>) {
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, antrean.length) }, async () => {
      while (i < antrean.length) await kerja(antrean[i++]);
    }),
  );
}

/* ---------------- utama ---------------- */

async function main() {
  const belumAda = items.filter((i) => !existsSync(join(OUT_DIR, i.file)));
  const karakterBaru = belumAda.reduce((n, i) => n + i.teks.length, 0);

  if (dryRun) {
    console.log(`Dry-run — ${jumlahPaket} paket${only ? ` (hanya ${only})` : ""}, ${items.length} kalimat unik, ${totalKarakter} karakter.`);
    for (const i of items) console.log(`  [${i.sumber}] ${i.file}  (${i.teks.length})  ${i.teks}`);
    console.log(`\nBelum ada berkasnya: ${belumAda.length} kalimat, ${karakterBaru} karakter.`);
    const masuk = tulisManifest(semuaItem);
    console.log(`Manifes ditulis: ${relative(root, OUT_MANIFEST)} (${masuk} entri yang sudah ada berkasnya).`);
    return;
  }

  if (!API_KEY) {
    console.error("✗ ELEVENLABS_API_KEY tidak ada. Jalankan dengan --dry-run untuk melihat daftar kalimat.");
    process.exit(1);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  let baru = 0;
  let gagal = 0;
  await jalankanParalel(belumAda, PARALEL, async (i) => {
    try {
      const mp3 = await tts(i.teks);
      writeFileSync(join(OUT_DIR, i.file), mp3);
      baru++;
      console.log(`✓ ${i.file}  ${i.teks}`);
    } catch (e) {
      gagal++;
      console.error(`✗ ${i.file}  ${i.teks} — ${e instanceof Error ? e.message : e}`);
    }
  });

  const masuk = tulisManifest(semuaItem);
  console.log(`\n${jumlahPaket} paket · ${items.length} kalimat unik · ${totalKarakter} karakter total`);
  console.log(`Berkas baru: ${baru} (${karakterBaru} karakter dikirim) · gagal: ${gagal} · dilewati (sudah ada): ${items.length - belumAda.length}`);
  console.log(`Manifes: ${relative(root, OUT_MANIFEST)} (${masuk} entri)`);
  if (gagal) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
