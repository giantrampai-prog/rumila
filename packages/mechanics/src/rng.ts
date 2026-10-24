// Pembangkit acak deterministik (mulberry32) + alat bantu: acak urutan, ambil bilangan bulat, default knob.
// Semua mekanik hanya memakai rng(seed) sehingga (paket, knobs, seed) yang sama selalu menghasilkan ronde yang sama.

import type { ContentPack } from "@akademi/schema";
import type { Knobs } from "./types";

/** mulberry32: mengembalikan fungsi () => [0, 1) yang deterministik untuk seed yang sama. */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates; mengembalikan salinan baru, sumber tidak diubah. */
export function acak<T>(arr: T[], r: () => number): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Bilangan bulat acak di [min, max] (inklusif). Bila max < min, kembalikan min. */
export function acakInt(r: () => number, min: number, max: number): number {
  if (max <= min) return min;
  return min + Math.floor(r() * (max - min + 1));
}

/** Satu elemen acak dari daftar (daftar tidak boleh kosong). */
export function pilihSatu<T>(arr: T[], r: () => number): T {
  return arr[Math.floor(r() * arr.length)];
}

/** Nilai default tiap knob paket: { namaKnob: default }. */
export function knobDefaults(paket: ContentPack): Knobs {
  const out: Knobs = {};
  for (const [k, v] of Object.entries(paket.knobs)) out[k] = v.default;
  return out;
}
