// Tulis naskah suara Tur Kebun Buah (satu file suara) dari src/lib/fruits/tur.ts: docs/buah/naskah-tur-buah.txt.
// Pakai: npx tsx scripts/buah-naskah.ts
import { mkdirSync, writeFileSync } from "node:fs";
import { TUR_BUAH } from "../src/lib/fruits/tur";

mkdirSync("docs/buah", { recursive: true });
const txt = [
  "NASKAH SUARA — TUR KEBUN BUAH 3D (JALAN-JALAN DI KEBUN)",
  "",
  `Rekam jadi SATU file, urut dari atas. Beri jeda ±1 detik antaradegan. ${TUR_BUAH.length} adegan (pembuka, papan tiap petak, semua buah sesuai urutan jalan di kebun, penutup).`,
  "Setelah rekaman jadi, catat timestamp mulai tiap adegan (menit:detik), misalnya 1 = 0:00, 2 = 0:12, dst.",
  "",
  ...TUR_BUAH.map((s, i) => `[${i + 1}. ${s.title}]\n${s.lines.join(" ")}\n`),
].join("\n");
writeFileSync("docs/buah/naskah-tur-buah.txt", txt);
const words = TUR_BUAH.flatMap((s) => s.lines).join(" ").split(/\s+/).length;
console.log(`${TUR_BUAH.length} adegan, ${words} kata (~${(words / 130).toFixed(1)} menit)`);
