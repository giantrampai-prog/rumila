// Tulis SEMUA naskah suara Rinoya Academy (siap unggah ke aplikasi suara) ke docs/rekaman/lengkap/.
// Satu file per tur (paragraf = adegan, beri jeda ±1 detik) + paket kartu karakter.
// Pakai: npx tsx scripts/semua-naskah.ts
import { mkdirSync, writeFileSync } from "node:fs";
import { TOUR } from "../src/lib/angkasa/tour";
import { TUR } from "../src/lib/anatomy/tur";
import { KARAKTER, TUR_BUMI } from "../src/lib/bumi/misi";
import { TUR_BUAH } from "../src/lib/fruits/tur";
import { BIOTA, TUR_LAUT } from "../src/lib/laut/misi";
import { JELAJAH, MISI } from "../src/lib/roket/misi";

const dir = "docs/rekaman/lengkap";
mkdirSync(dir, { recursive: true });
const tours: [string, string, { lines: string[] }[]][] = [
  ["1-tur-jelajah-angkasa", "Jelajah Angkasa", TOUR],
  ["2-tur-roket-astronot", "Roket & Astronot", MISI],
  ["3-tur-jelajah-tubuh", "Jelajah Tubuh", TUR],
  ["4-tur-kebun-buah", "Kebun Buah", TUR_BUAH],
  ["5-tur-bawah-laut", "Bawah Laut", TUR_LAUT],
  ["6-tur-dalam-bumi", "Dalam Bumi", TUR_BUMI],
];
const sum: string[] = [];
for (const [file, name, stops] of tours) {
  const txt = stops.map((s) => s.lines.join(" ")).join("\n\n") + "\n";
  writeFileSync(`${dir}/${file}.txt`, txt);
  const words = txt.split(/\s+/).filter(Boolean).length;
  sum.push(`${file}.txt — ${name}: ${stops.length} adegan, ${words} kata (±${Math.round(words / 130)} menit)`);
}
const cards = [
  ["7-kartu-bawah-laut", BIOTA.map((b) => `${b.name}. ${b.desc} Tahukah kamu? ${b.fact}`)],
  ["8-kartu-dalam-bumi", KARAKTER.map((b) => `${b.name}. ${b.desc} Tahukah kamu? ${b.fact}`)],
  ["9-kartu-roket", JELAJAH.map((b) => `${b.name}. ${b.desc}`)],
] as const;
for (const [file, lines] of cards) {
  writeFileSync(`${dir}/${file}.txt`, lines.join("\n\n") + "\n");
  sum.push(`${file}.txt — ${lines.length} kartu (opsional)`);
}
console.log(sum.join("\n"));
