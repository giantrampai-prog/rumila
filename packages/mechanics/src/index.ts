// Pintu masuk @akademi/mechanics: re-export tiap mekanik + buatRonde/nilai yang memilih lewat mechanic.

import type { ContentPack } from "@akademi/schema";
import { buatRondeDagang, nilaiDagang } from "./dagang";
import { buatRondeNavigasi, nilaiNavigasi } from "./navigasi";
import { buatRondePilah, nilaiPilah } from "./pilah";
import { buatRondePola, nilaiPola } from "./pola";
import { buatRondeSimulasi, nilaiSimulasi } from "./simulasi";
import type {
  Hasil, JawabanDagang, JawabanNavigasi, JawabanPilah, JawabanPola, JawabanSimulasi, JawabanUrutkan, Knobs,
  RondeDagang, RondeNavigasi, RondePilah, RondePola, RondeSimulasi, RondeUrutkan,
} from "./types";
import { buatRondeUrutkan, nilaiUrutkan } from "./urutkan";

export * from "./types";
export * from "./rng";
export * from "./pilah";
export * from "./urutkan";
export * from "./dagang";
export * from "./navigasi";
export * from "./pola";
export * from "./simulasi";
export { knobDefaults } from "./rng";

/** Ronde terbungkus diskriminator `mechanic`, supaya runner bisa memilih presenter dan fungsi nilai. */
export type Ronde =
  | { mechanic: "pilah"; ronde: RondePilah }
  | { mechanic: "urutkan"; ronde: RondeUrutkan }
  | { mechanic: "dagang"; ronde: RondeDagang }
  | { mechanic: "navigasi"; ronde: RondeNavigasi }
  | { mechanic: "pola"; ronde: RondePola }
  | { mechanic: "simulasi"; ronde: RondeSimulasi };
export type Jawaban = JawabanPilah | JawabanUrutkan | JawabanDagang | JawabanNavigasi | JawabanPola | JawabanSimulasi;

export function buatRonde(p: ContentPack, knobs: Knobs, seed: number): Ronde {
  switch (p.mechanic) {
    case "pilah": return { mechanic: "pilah", ronde: buatRondePilah(p, knobs, seed) };
    case "urutkan": return { mechanic: "urutkan", ronde: buatRondeUrutkan(p, knobs, seed) };
    case "dagang": return { mechanic: "dagang", ronde: buatRondeDagang(p, knobs, seed) };
    case "navigasi": return { mechanic: "navigasi", ronde: buatRondeNavigasi(p, knobs, seed) };
    case "pola": return { mechanic: "pola", ronde: buatRondePola(p, knobs, seed) };
    case "simulasi": return { mechanic: "simulasi", ronde: buatRondeSimulasi(p, knobs, seed) };
  }
}

/**
 * Ronde berikutnya tanpa mengulang soal: coba beberapa seed turunan dan ambil yang belum pernah keluar di sesi ini
 * (`riwayat` = kunci ronde sebelumnya, lihat `kunciRonde`). Bila kumpulan soal untuk knob ini habis, minimal jangan
 * sama dengan ronde terakhir — dengan meminjam knob tetangga, dan untuk navigasi saringan knob dilepas sebagai pilihan terakhir.
 */
export function buatRondeBaru(p: ContentPack, knobs: Knobs, seed: number, riwayat: readonly string[], percobaan = 24): Ronde {
  const pernah = new Set(riwayat);
  const terakhir = riwayat[riwayat.length - 1];
  const turunan = (i: number) => (seed + Math.imul(i, 0x9e3779b1)) >>> 0;
  let bedaTerakhir: Ronde | undefined;
  for (let i = 0; i < percobaan; i++) {
    const r = buatRonde(p, knobs, turunan(i));
    const k = kunciRonde(r);
    if (!pernah.has(k)) return r;
    if (!bedaTerakhir && k !== terakhir) bedaTerakhir = r;
  }
  // Kumpulan soal di tingkat ini habis → pinjam dari tingkat kesulitan tetangga (satu langkah knob naik/turun).
  const tetangga = knobTetangga(p, knobs);
  for (let i = 0; i < percobaan; i++) {
    const r = buatRonde(p, tetangga[i % Math.max(1, tetangga.length)] ?? knobs, turunan(percobaan + i));
    if (!pernah.has(kunciRonde(r))) return r;
  }
  if (bedaTerakhir) return bedaTerakhir;
  for (let i = 0; i < percobaan; i++) {
    const r = buatRonde(p, p.mechanic === "navigasi" ? {} : (tetangga[i % Math.max(1, tetangga.length)] ?? knobs), turunan(2 * percobaan + i));
    if (kunciRonde(r) !== terakhir) return r;
  }
  return buatRonde(p, knobs, seed);
}

/** Knob yang bergeser satu langkah (naik dulu, lalu turun) dari `knobs`, tetap dalam rentang paket. */
function knobTetangga(p: ContentPack, knobs: Knobs): Knobs[] {
  const spek = (p as { knobs?: Record<string, { min: number; max: number; step?: number }> }).knobs ?? {};
  const out: Knobs[] = [];
  for (const arah of [1, -1])
    for (const [kunci, k] of Object.entries(spek)) {
      const kini = (knobs as Record<string, number>)[kunci];
      if (typeof kini !== "number") continue;
      const baru = kini + arah * (k.step ?? 1);
      if (baru >= k.min && baru <= k.max) out.push({ ...knobs, [kunci]: baru });
    }
  return out;
}

/** Kunci pembanding dua ronde (isi soal identik → kunci sama). */
export const kunciRonde = (r: Ronde) => JSON.stringify(r);

export function nilai(_p: ContentPack, r: Ronde, j: Jawaban): Hasil {
  switch (r.mechanic) {
    case "pilah": return nilaiPilah(r.ronde, j as JawabanPilah);
    case "urutkan": return nilaiUrutkan(r.ronde, j as JawabanUrutkan);
    case "dagang": return nilaiDagang(r.ronde, j as JawabanDagang);
    case "navigasi": return nilaiNavigasi(r.ronde, j as JawabanNavigasi);
    case "pola": return nilaiPola(r.ronde, j as JawabanPola);
    case "simulasi": return nilaiSimulasi(r.ronde, j as JawabanSimulasi);
  }
}
