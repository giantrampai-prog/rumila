// Tulis naskah suara modul Roket (satu file suara) dari src/lib/roket/misi.ts: docs/roket/naskah-misi-roket.{json,txt}.
// Pakai: npx tsx scripts/roket-naskah.ts
import { writeFileSync } from "node:fs";
import { MISI } from "../src/lib/roket/misi";

writeFileSync("docs/roket/naskah-misi-roket.json", JSON.stringify(MISI.map((s) => ({ id: s.id, lines: s.lines })), null, 2) + "\n");
const txt = [
  "NASKAH SUARA — ROKET & ASTRONOT 3D",
  "",
  `Rekam jadi SATU file, urut dari atas. Beri jeda ±1 detik antaradegan. ${MISI.length} adegan, ±5 menit.`,
  "Setelah rekaman jadi, catat timestamp mulai tiap adegan (menit:detik), misalnya 1 = 0:00, 2 = 0:19, dst.",
  "",
  ...MISI.map((s, i) => `[${i + 1}. ${s.title}]\n${s.lines.join(" ")}\n`),
].join("\n");
writeFileSync("docs/roket/naskah-misi-roket.txt", txt);
console.log(txt);
