// Mekanik pilah: kelompok (seret item ke bin) dan pilih (sentuh satu pilihan benar).
// Knob yang dihormati: binCount, itemCount, maxCount (bin berangka > maxCount disembunyikan).

import type { PaketPilah } from "@akademi/schema";
import { acak, pilihSatu, rng } from "./rng";
import type { Hasil, JawabanPilah, Knobs, RondePilah } from "./types";

type Bin = PaketPilah["bins"][number];
type Item = PaketPilah["items"][number];

/** Angka yang diwakili sebuah bin: labelKey numerik ("3"), atau digit di ujung labelKey/id ("k3"). */
function angkaBin(b: Bin): number | undefined {
  const langsung = Number(b.labelKey);
  if (b.labelKey.trim() !== "" && Number.isFinite(langsung)) return langsung;
  const m = /(\d+)$/.exec(b.labelKey) ?? /(\d+)$/.exec(b.id);
  return m ? Number(m[1]) : undefined;
}

/** Bin aktif: buang yang angkanya > maxCount, lalu ambil binCount pertama (urutan paket, bukan acak). */
function binAktif(p: PaketPilah, knobs: Knobs): Bin[] {
  let bins = p.bins;
  if (knobs.maxCount !== undefined) {
    bins = bins.filter(b => { const n = angkaBin(b); return n === undefined || n <= knobs.maxCount; });
  }
  if (knobs.binCount !== undefined) bins = bins.slice(0, Math.max(1, Math.floor(knobs.binCount)));
  return bins.length ? bins : p.bins.slice(0, 1);
}

/** Pilih item: hanya bin aktif, diacak, dipotong itemCount, tiap bin aktif dijamin ≥1 item bila itemCount memungkinkan. */
function itemAktif(p: PaketPilah, bins: Bin[], knobs: Knobs, r: () => number): Item[] {
  const aktif = new Set(bins.map(b => b.id));
  const kandidat = p.items.filter(i => aktif.has(i.bin));
  if (!p.generatif) return kandidat;
  const diacak = acak(kandidat, r);
  const diminta = knobs.itemCount !== undefined ? Math.max(1, Math.floor(knobs.itemCount)) : diacak.length;
  // Paling banyak separuh stok per ronde, supaya dua ronde berturut-turut bisa memakai benda yang berbeda
  // (anak merasa "dobel" bila benda yang sama terus muncul). Minimal tetap bins+1 / 3 benda; stok kecil tidak dipotong.
  const bawah = Math.max(bins.length + 1, 3);
  const batas = kandidat.length >= 2 * bawah ? Math.max(bawah, Math.min(diminta, Math.floor(kandidat.length / 2))) : diminta;
  if (batas >= diacak.length) return diacak;
  // satu wakil per bin dulu, sisanya diisi dari yang tersisa
  const terpilih: Item[] = [];
  const sudahBin = new Set<string>();
  for (const i of diacak) {
    if (terpilih.length >= batas) break;
    if (!sudahBin.has(i.bin)) { sudahBin.add(i.bin); terpilih.push(i); }
  }
  for (const i of diacak) {
    if (terpilih.length >= batas) break;
    if (!terpilih.includes(i)) terpilih.push(i);
  }
  return acak(terpilih, r);
}

export function buatRondePilah(p: PaketPilah, knobs: Knobs, seed: number): RondePilah {
  const r = rng(seed);
  if (p.mode === "pilih") {
    const ronde = pilihSatu(p.pilihan, r);
    const byId = new Map(p.items.map(i => [i.id, i] as const));
    const choices = ronde.choices.map(id => byId.get(id)).filter((i): i is Item => !!i);
    return { mode: "pilih", promptKey: ronde.promptKey, choices: acak(choices, r), correct: ronde.correct };
  }
  const bins = binAktif(p, knobs);
  return { mode: "kelompok", bins, items: itemAktif(p, bins, knobs, r) };
}

export function nilaiPilah(r: RondePilah, j: JawabanPilah): Hasil {
  if (r.mode === "pilih") {
    const dipilih = typeof j === "string" ? j : "";
    return { benar: dipilih === r.correct, detail: { dipilih } };
  }
  const peta = typeof j === "object" && j !== null ? j : {};
  const salah = r.items.filter(i => peta[i.id] !== i.bin).map(i => i.id);
  return { benar: salah.length === 0, detail: { salah } };
}
