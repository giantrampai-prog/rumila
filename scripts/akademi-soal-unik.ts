// npx tsx scripts/akademi-soal-unik.ts <id-paket...>  → soal berbeda menurut mata anak dalam satu sesi (terburuk dari 8 sesi) + stok soal; target OK = semua ronde berbeda
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { ContentPack } from "../packages/schema/src/index";
import { buatRonde, buatRondeBaru, knobDefaults, kunciRonde } from "../packages/mechanics/src/index";
const semua = (d: string): string[] => readdirSync(d).flatMap((n) => { const f = join(d, n); return statSync(f).isDirectory() ? semua(f) : f.endsWith(".json") ? [f] : []; });
const idx = new Map<string, string>();
for (const f of [...semua("content/paket"), ...semua("content/golden")]) { try { const j = JSON.parse(readFileSync(f, "utf8")); if (j.id && j.mechanic) idx.set(j.id, f); } catch {} }
for (const id of process.argv.slice(2)) {
  const f = idx.get(id); if (!f) { console.log("TIDAK ADA", id); continue; }
  const p = ContentPack.parse(JSON.parse(readFileSync(f, "utf8")));
  const pool = new Set<string>(); for (let i = 0; i < 4000; i++) pool.add(kunciRonde(buatRonde(p, knobDefaults(p), i)));
  let terburuk = 99;
  for (let s = 0; s < 8; s++) { const riw: string[] = []; for (let i = 0; i < p.rounds; i++) riw.push(kunciRonde(buatRondeBaru(p, knobDefaults(p), (s * 7919 + i * 104729) >>> 0, riw))); terburuk = Math.min(terburuk, new Set(riw).size); }
  console.log(`${terburuk >= p.rounds ? "OK    " : "KURANG"} ${terburuk}/${p.rounds} (stok ${pool.size})  ${id}  ${f}`);
}
