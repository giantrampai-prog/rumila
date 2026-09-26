// Cetak naskah narasi Tur terbang sebagai SATU teks utuh (digenerate sekaligus jadi satu file audio).
// Jalankan: npx tsx scripts/angkasa-naskah-tur.ts
//   → docs/angkasa/naskah-tur-terbang.txt (siap tempel ke aplikasi suara)
//   → docs/angkasa/naskah-tur-terbang.md  (versi baca, dengan judul persinggahan)
import { writeFileSync } from "node:fs";
import { TOUR } from "../src/lib/angkasa/tour";

// Paragraf kosong antar-persinggahan = jeda sedikit lebih panjang di audio (membantu menandai perpindahan).
// Versi ucapan: satuan ditulis dalam kata agar tidak salah dibaca aplikasi suara.
const spoken = (t: string) =>
  t
    .replace(/\s?°C/g, " derajat Celsius")
    .replace(/\s?°/g, " derajat")
    .replace(/(\d) km\b/g, "$1 kilometer");
const txt = TOUR.map((s) => spoken(s.lines.join(" "))).join("\n\n") + "\n";
writeFileSync("docs/angkasa/naskah-tur-terbang.txt", txt);
// Struktur kalimat per persinggahan, dipakai scripts/angkasa-cue-tur.py untuk mencari titik pergantian di audio.
writeFileSync(
  "docs/angkasa/naskah-tur-terbang.json",
  JSON.stringify(
    TOUR.map((s) => ({ id: s.id, lines: s.lines.map(spoken) })),
    null,
    2,
  ) + "\n",
);

const md = [
  "# Naskah narasi — Tur terbang (Jelajah Angkasa 3D)",
  "",
  "Generate **sekaligus jadi satu file audio** dari `naskah-tur-terbang.txt` (isi sama dengan di bawah, tanpa judul).",
  "Pergantian planet dan teks di layar akan mengikuti audionya. Kalau bisa, beri jeda sedikit lebih panjang antar-paragraf.",
  "",
  ...TOUR.flatMap((s, i) => [
    `## ${i + 1}. ${s.title}`,
    "",
    s.lines.join(" "),
    "",
  ]),
].join("\n");
writeFileSync("docs/angkasa/naskah-tur-terbang.md", md);
console.log(`${TOUR.length} persinggahan · ${txt.split(/\s+/).length} kata`);
