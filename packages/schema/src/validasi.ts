// Validasi lintas-kompetensi: id unik, prasyarat ada & tak melingkar, ref ada di kamus, urutan level masuk akal.

import { Competency } from "./kompetensi";
import { Kamus } from "./kerangka";
import { levelIndex } from "./jenjang";

export interface Temuan { id: string; tingkat: "error" | "warning"; pesan: string }

export function validasiKurikulum(kompetensi: Competency[], kamus?: Kamus): Temuan[] {
  const out: Temuan[] = [];
  const byId = new Map<string, Competency>();
  for (const c of kompetensi) {
    if (byId.has(c.id)) out.push({ id: c.id, tingkat: "error", pesan: "id ganda" });
    byId.set(c.id, c);
  }
  for (const c of kompetensi) {
    for (const p of c.prereq) {
      const q = byId.get(p);
      if (!q) { out.push({ id: c.id, tingkat: "error", pesan: `prasyarat ${p} tidak ditemukan` }); continue; }
      if (levelIndex(q.level) > levelIndex(c.level)) out.push({ id: c.id, tingkat: "error", pesan: `prasyarat ${p} berada di level lebih tinggi` });
    }
    if (c.refs.length === 0 && (c.track === "MAT" || c.track === "KODE" || c.track === "SAINS" || c.track === "BING")) {
      out.push({ id: c.id, tingkat: "warning", pesan: "tidak ada kode acuan kerangka internasional" });
    }
    if (kamus) {
      for (const r of c.refs) {
        const e = kamus.get(r.framework, r.code);
        if (!e) out.push({ id: c.id, tingkat: "error", pesan: `ref ${r.framework}:${r.code} tidak ada di kamus kerangka` });
        else if (!e.verified) out.push({ id: c.id, tingkat: "warning", pesan: `ref ${r.framework}:${r.code} belum terverifikasi terhadap dokumen resmi` });
      }
    }
    if (c.core && c.depth.length === 1 && c.depth[0] === "kenal" && levelIndex(c.level) >= levelIndex("SD1")) {
      out.push({ id: c.id, tingkat: "warning", pesan: "kompetensi inti SD sebaiknya menuntut depth 'pakai'" });
    }
  }
  // deteksi siklus prasyarat
  const state = new Map<string, 0 | 1 | 2>();
  const dfs = (id: string, jalur: string[]) => {
    const s = state.get(id) ?? 0;
    if (s === 1) { out.push({ id, tingkat: "error", pesan: `siklus prasyarat: ${[...jalur, id].join(" → ")}` }); return; }
    if (s === 2) return;
    state.set(id, 1);
    for (const p of byId.get(id)?.prereq ?? []) if (byId.has(p)) dfs(p, [...jalur, id]);
    state.set(id, 2);
  };
  for (const c of kompetensi) dfs(c.id, []);
  return out;
}

export function adaError(t: Temuan[]) { return t.some(x => x.tingkat === "error"); }
