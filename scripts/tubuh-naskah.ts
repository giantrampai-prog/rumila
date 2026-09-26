// Tulis naskah suara Tur Jelajah Tubuh (satu file suara) dari src/lib/anatomy/tur.ts: docs/tubuh/naskah-tur-tubuh.txt.
// Pakai: npx tsx scripts/tubuh-naskah.ts
import { writeFileSync } from "node:fs";
import { TUR } from "../src/lib/anatomy/tur";

const txt = [
  "NASKAH SUARA — TUR JELAJAH TUBUH 3D",
  "",
  `Rekam jadi SATU file, urut dari atas. Beri jeda ±1 detik antaradegan. ${TUR.length} adegan.`,
  "Setelah rekaman jadi, catat timestamp mulai tiap adegan (menit:detik), misalnya 1 = 0:00, 2 = 0:14, dst.",
  "",
  ...TUR.map((s, i) => `[${i + 1}. ${s.title}]\n${s.lines.join(" ")}\n`),
].join("\n");
writeFileSync("docs/tubuh/naskah-tur-tubuh.txt", txt);
const words = TUR.flatMap((s) => s.lines).join(" ").split(/\s+/).length;
console.log(`${TUR.length} adegan, ${words} kata (~${(words / 130).toFixed(1)} menit)`);
