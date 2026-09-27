// Tulis naskah suara Tur Petualangan Bawah Laut (satu file suara) dari src/lib/laut/misi.ts: docs/laut/naskah-tur-laut.txt.
// Pakai: npx tsx scripts/laut-naskah.ts
import { mkdirSync, writeFileSync } from "node:fs";
import { BIOTA, TUR_LAUT } from "../src/lib/laut/misi";

mkdirSync("docs/laut", { recursive: true });
const txt = [
  "NASKAH SUARA — PETUALANGAN BAWAH LAUT 3D",
  "",
  `Bagian A — Tur Menyelam. Rekam jadi SATU file, urut dari atas. Beri jeda ±1 detik antaradegan. ${TUR_LAUT.length} adegan.`,
  "Setelah rekaman jadi, catat timestamp mulai tiap adegan (menit:detik), misalnya 1 = 0:00, 2 = 0:18, dst.",
  "",
  ...TUR_LAUT.map((s, i) => `[${i + 1}. ${s.title} — ${s.label}]\n${s.lines.join(" ")}\n`),
  "",
  "Bagian B — Kartu Karakter (opsional, rekam satu file per karakter, nama file = kode di kurung).",
  "",
  ...BIOTA.map((b) => `[${b.name} (${b.id})]\n${b.name}. ${b.desc} Tahukah kamu? ${b.fact}\n`),
].join("\n");
writeFileSync("docs/laut/naskah-tur-laut.txt", txt);
const words = TUR_LAUT.flatMap((s) => s.lines).join(" ").split(/\s+/).length;
console.log(`${TUR_LAUT.length} adegan, ${words} kata (~${(words / 130).toFixed(1)} menit)`);
