// Tulis naskah suara Tur Petualangan ke Dalam Bumi (satu file suara) dari src/lib/bumi/misi.ts:
// docs/bumi/naskah-tur-bumi.txt (dengan judul adegan) & docs/bumi/suara-tur-bumi-UPLOAD.txt (teks bersih siap unggah).
// Pakai: npx tsx scripts/bumi-naskah.ts
import { mkdirSync, writeFileSync } from "node:fs";
import { KARAKTER, TUR_BUMI } from "../src/lib/bumi/misi";

mkdirSync("docs/bumi", { recursive: true });
const txt = [
  "NASKAH SUARA — PETUALANGAN KE DALAM BUMI 3D",
  "",
  `Bagian A — Tur. Rekam jadi SATU file, urut dari atas. Beri jeda ±1 detik antaradegan. ${TUR_BUMI.length} adegan.`,
  "Setelah rekaman jadi, kirim file suara + timestamp kata supaya tiap adegan dipasang pas.",
  "",
  ...TUR_BUMI.map((s, i) => `[${i + 1}. ${s.title} — ${s.label}]\n${s.lines.join(" ")}\n`),
  "",
  "Bagian B — Kartu Karakter (opsional).",
  "",
  ...KARAKTER.map((b) => `[${b.name} (${b.id})]\n${b.name}. ${b.desc} Tahukah kamu? ${b.fact}\n`),
].join("\n");
writeFileSync("docs/bumi/naskah-tur-bumi.txt", txt);
writeFileSync("docs/bumi/suara-tur-bumi-UPLOAD.txt", TUR_BUMI.map((s) => s.lines.join(" ")).join("\n\n") + "\n");
const words = TUR_BUMI.flatMap((s) => s.lines).join(" ").split(/\s+/).length;
console.log(`${TUR_BUMI.length} adegan, ${words} kata (~${(words / 130).toFixed(1)} menit)`);
