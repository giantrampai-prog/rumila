// Tulis naskah suara modul Roket dari src/lib/roket/misi.ts: docs/roket/naskah-misi-roket.{json,txt}.
// Pakai: npx tsx scripts/roket-naskah.ts
import { writeFileSync } from "node:fs";
import { JELAJAH, MISI } from "../src/lib/roket/misi";

writeFileSync("docs/roket/naskah-misi-roket.json", JSON.stringify(MISI.map((s) => ({ id: s.id, lines: s.lines })), null, 2) + "\n");
const partsText: Record<string, string> = {
  roket: "Ini roket kita! Roket punya beberapa bagian bertumpuk. Paling atas kapsul, di tengah tahap kedua, dan paling bawah tahap pertama.",
  kapsul: "Ini kapsul, ruang kecil di puncak roket. Di sinilah astronaut duduk selama perjalanan. Kapsul punya pelindung panas agar aman saat pulang ke Bumi.",
  "tahap-2": "Ini tahap kedua. Mesinnya menyala setelah tahap pertama lepas, untuk mendorong kapsul sampai ke orbit.",
  "tahap-1": "Ini tahap pertama, bagian roket yang paling besar. Isinya bahan bakar yang sangat banyak untuk mengangkat roket dari landasan.",
  mesin: "Ini mesin roket. Mesin menyemburkan gas yang sangat panas ke bawah. Semburan itu mendorong roket melesat ke atas.",
  astronot: "Ini astronaut! Baju antariksanya memberi udara untuk bernapas, menjaga tubuh tetap hangat, dan melindungi dari sinar Matahari yang kuat.",
  menara: "Ini menara peluncuran. Astronaut naik lift di menara, lalu menyeberangi jembatan untuk masuk ke kapsul.",
};
const txt = [
  "NASKAH SUARA — ROKET & ASTRONOT 3D",
  "",
  "BAGIAN A — MISI TERBANG (±5 menit; rekam jadi SATU file, urut dari atas; beri jeda ±1 detik antarparagraf)",
  "",
  ...MISI.map((s, i) => `[${i + 1}. ${s.title}]\n${s.lines.join(" ")}\n`),
  "BAGIAN B — JELAJAH (rekam SATU file per bagian, nama file = kata dalam kurung)",
  "",
  ...JELAJAH.filter((j) => j.kind === "part").map((j) => `[${j.id}] ${j.name}\n${partsText[j.id]}\n`),
].join("\n");
writeFileSync("docs/roket/naskah-misi-roket.txt", txt);
console.log(txt);
