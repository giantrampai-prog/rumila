// Mekanik urutkan: susun (langkah diacak), perbaiki (satu pasang tertukar), dulu (dua langkah, pilih yang lebih dulu),
// label (langkah sudah urut; anak memasang label pertama/lalu/terakhir per posisi).
// Knob: steps = jumlah langkah tampil; sequence yang cukup panjang dipilih lalu dipotong dari depan.

import type { PaketUrutkan } from "@akademi/schema";
import { acak, acakInt, pilihSatu, rng } from "./rng";
import type { Hasil, JawabanUrutkan, Knobs, LabelUrutan, RondeUrutkan } from "./types";

type Step = PaketUrutkan["sequences"][number]["steps"][number];

const samaUrutan = (a: string[], b: string[]) => a.length === b.length && a.every((x, i) => x === b[i]);

/** Label benar untuk n langkah: pertama, lalu × (n − 2), terakhir. */
export function labelUrutan(n: number): LabelUrutan[] {
  if (n <= 0) return [];
  if (n === 1) return ["pertama"];
  return ["pertama", ...Array.from({ length: n - 2 }, () => "lalu" as const), "terakhir"];
}

/** Jumlah pertukaran minimal untuk mengubah `dari` menjadi `ke` (n − jumlah siklus). null bila bukan permutasi yang sama. */
export function hitungSwap(dari: string[], ke: string[]): number | null {
  if (dari.length !== ke.length) return null;
  const posisi = new Map(dari.map((id, i) => [id, i] as const));
  const perm: number[] = [];
  for (const id of ke) { const i = posisi.get(id); if (i === undefined) return null; perm.push(i); }
  if (new Set(perm).size !== perm.length) return null;
  const dikunjungi = new Array<boolean>(perm.length).fill(false);
  let siklus = 0;
  for (let i = 0; i < perm.length; i++) {
    if (dikunjungi[i]) continue;
    siklus++;
    for (let k = i; !dikunjungi[k]; k = perm[k]) dikunjungi[k] = true;
  }
  return perm.length - siklus;
}

export function buatRondeUrutkan(p: PaketUrutkan, knobs: Knobs, seed: number): RondeUrutkan {
  const r = rng(seed);
  const n = p.mode === "dulu" ? 2 : knobs.steps !== undefined ? Math.max(2, Math.floor(knobs.steps)) : undefined;
  let kandidat = n !== undefined ? p.sequences.filter(s => s.steps.length >= n) : p.sequences;
  if (!kandidat.length) {
    const terpanjang = Math.max(...p.sequences.map(s => s.steps.length));
    kandidat = p.sequences.filter(s => s.steps.length === terpanjang);
  }
  const seq = pilihSatu(kandidat, r);
  const steps: Step[] = n !== undefined ? seq.steps.slice(0, n) : seq.steps;
  const correct = steps.map(s => s.id);
  const dasar = { mode: p.mode, sequenceId: seq.id, titleKey: seq.titleKey, correct };

  // label: gambar tampil urut benar; tugasnya memasang label, bukan menyusun
  if (p.mode === "label") return { ...dasar, shown: steps, labels: labelUrutan(steps.length) };

  if (p.mode === "perbaiki") {
    const jarak = steps.length >= 3 && r() < 0.5 ? 2 : 1;
    const i = acakInt(r, 0, steps.length - 1 - jarak);
    const shown = steps.slice();
    [shown[i], shown[i + jarak]] = [shown[i + jarak], shown[i]];
    return { ...dasar, shown, swapped: [i, i + jarak] };
  }
  // dulu: posisi jawaban benar diacak lempar koin (kiri/kanan sama peluangnya); urutan benar boleh tampil apa adanya
  if (p.mode === "dulu") return { ...dasar, shown: acak(steps, r) };
  // susun: acak sampai bukan urutan benar
  let shown = acak(steps, r);
  for (let coba = 0; coba < 32 && samaUrutan(shown.map(s => s.id), correct); coba++) shown = acak(steps, r);
  if (samaUrutan(shown.map(s => s.id), correct)) shown = [...steps.slice(1), steps[0]];
  return { ...dasar, shown };
}

export function nilaiUrutkan(r: RondeUrutkan, j: JawabanUrutkan): Hasil {
  if (r.mode === "dulu") {
    const dipilih = typeof j === "string" ? j : Array.isArray(j) ? j[0] ?? "" : "";
    return { benar: dipilih === r.correct[0], detail: { dipilih } };
  }
  if (r.mode === "label") {
    const seharusnya = r.labels ?? labelUrutan(r.correct.length);
    const labels = j && typeof j === "object" && !Array.isArray(j) && Array.isArray(j.labels) ? j.labels : [];
    const salah = seharusnya.map((l, i) => (labels[i] === l ? -1 : i)).filter(i => i >= 0);
    const benar = labels.length === seharusnya.length && salah.length === 0;
    // terputus: "terakhir" dipasang sebelum gambar terakhir → cerita berhenti di sana
    const terputus = labels.findIndex((l, i) => l === "terakhir" && i < seharusnya.length - 1);
    return { benar, detail: { salah, terputusDi: terputus >= 0 ? terputus : null } };
  }
  const urutan = Array.isArray(j) ? j : [];
  const cocok = samaUrutan(urutan, r.correct);
  if (r.mode === "perbaiki") {
    const swaps = hitungSwap(r.shown.map(s => s.id), urutan);
    return { benar: cocok && swaps === 1, detail: { swaps } };
  }
  return { benar: cocok, detail: {} };
}
