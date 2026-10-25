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
  // Pilah kelompok: soal "baru" yang benda-bendanya sebagian besar baru saja tampil tetap terasa dobel bagi anak,
  // jadi dari semua calon baru dipilih yang paling sedikit berbagi benda dengan ronde-ronde terakhir.
  const kelompok = p.mechanic === "pilah" && p.mode !== "pilih";
  const bendaLalu = kelompok ? riwayat.map((k) => { try { const j = JSON.parse(k); return j[0] === "pilah-kelompok" ? new Set<string>(j[1]) : new Set<string>(); } catch { return new Set<string>(); } }) : [];
  const tumpang = (r: Ronde) => r.mechanic !== "pilah" || r.ronde.mode !== "kelompok" ? 0
    : bendaLalu.reduce((s, lalu, i) => s + r.ronde.items.filter((x) => lalu.has(x.id)).length / (bendaLalu.length - i), 0);
  let terbaik: { r: Ronde; skor: number } | undefined;
  for (let i = 0; i < percobaan; i++) {
    const r = buatRonde(p, knobs, turunan(i));
    const k = kunciRonde(r);
    if (!pernah.has(k)) {
      if (!kelompok) return r;
      const skor = tumpang(r);
      if (!terbaik || skor < terbaik.skor) terbaik = { r, skor };
      continue;
    }
    if (!bedaTerakhir && k !== terakhir) bedaTerakhir = r;
  }
  if (terbaik) return terbaik.r;
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

/** Kunci pembanding dua ronde menurut mata anak: soal yang sama dengan susunan acak lain (pilihan diacak, gambar cerita
 *  dikocok, pasangan kiri-kanan ditukar, laci uang diurut beda) tetap dianggap soal yang sama. */
export function kunciRonde(r: Ronde): string {
  const urut = (xs: readonly unknown[]) => xs.map((x) => JSON.stringify(x)).sort();
  switch (r.mechanic) {
    case "pilah":
      return r.ronde.mode === "pilih"
        ? JSON.stringify(["pilah-pilih", r.ronde.promptKey, r.ronde.correct])
        : JSON.stringify(["pilah-kelompok", r.ronde.items.map((i) => i.id).sort()]);
    case "urutkan":
      return JSON.stringify(["urutkan", r.ronde.mode, r.ronde.sequenceId]);
    case "pola":
      return JSON.stringify(["pola", r.ronde.mode, r.ronde.correct, r.ronde.shown, r.ronde.wrongIndex ?? null, r.ronde.pilih ?? null, r.ronde.mode === "cipta" ? r.ronde.palette.map((i) => i.id).sort() : null]);
    case "dagang":
      return JSON.stringify(["dagang", { ...r.ronde, laci: [...r.ronde.laci].sort((a, b) => a - b), lembar: [...r.ronde.lembar].sort((a, b) => a - b), benda: [...r.ronde.benda].sort(), pesanan: urut(r.ronde.pesanan) }]);
    case "simulasi":
      return JSON.stringify(["simulasi", { ...r.ronde, items: r.ronde.items.map((i) => i.id).sort(), options: [...r.ronde.options].sort((a, b) => a - b) }]);
    default:
      return JSON.stringify(r);
  }
}

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
