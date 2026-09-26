// Mode Bandingkan — perhitungan murni (tanpa Three.js) untuk ukuran & jarak, agar mudah diuji.
// Ukuran: SATU faktor skala untuk semua radius rata-rata (sizeScale di sim.ts); susunan hanya layout.
// Jarak: SATU pemetaan jarak rata-rata dari Matahari (AU) → posisi sumbu (distanceMap di sim.ts).

import { create } from "zustand";
import { getObj } from "./manifest";
import { diameterRatio, distanceMap, sizeScale, type DistScale } from "./sim";

/** Objek yang dapat dibandingkan (punya radius rata-rata dari data). */
export const COMPARE_IDS = [
  "sun",
  "mercury",
  "venus",
  "earth",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "moon",
  "titan",
  "pluto",
] as const;

export const COMPARE_MIN = 2;
export const COMPARE_MAX = 4;
/** 1 AU dalam km (definisi IAU 2012) */
export const AU_KM = 149_597_870.7;

/** Tambah/hapus objek dengan batas 2–4 (perilaku sama dengan state.toggleCompare). */
export function toggleId(
  cur: string[],
  id: string,
  min = COMPARE_MIN,
  max = COMPARE_MAX,
): string[] {
  if (cur.includes(id))
    return cur.length > min ? cur.filter((x) => x !== id) : cur;
  return cur.length < max ? [...cur, id] : cur;
}

/** Pindahkan objek menjadi acuan (urutan pertama) tanpa mengubah isi pilihan. */
export function asReference(cur: string[], id: string) {
  return cur.includes(id) ? [id, ...cur.filter((x) => x !== id)] : cur;
}

/* ---------------- format ---------------- */

const nf = (min: number, max: number) =>
  new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  });

/** Bulatkan ke n angka penting (untuk km dari AU). */
export function roundSig(v: number, n = 4) {
  if (v === 0) return 0;
  const p = Math.pow(10, n - Math.ceil(Math.log10(Math.abs(v))));
  return Math.round(v * p) / p;
}

/** Rasio yang mudah dibaca: ≥100 → bulat, ≥1 → 1 desimal, <1 → 2 desimal (mis. "9,1", "0,27"). */
export function fmtRatio(r: number) {
  if (r >= 100) return nf(0, 0).format(r);
  if (r >= 1) return nf(0, 1).format(Math.round(r * 10) / 10);
  return nf(0, 2).format(Math.round(r * 100) / 100);
}

export const fmtKm = (km: number) => nf(0, 0).format(Math.round(km));
export const fmtAU = (au: number) => nf(0, au < 1 ? 3 : 2).format(au);

/* ---------------- ukuran ---------------- */

export interface SizeRow {
  id: string;
  name: string;
  radiusKm: number;
  /** diameter = 2 × radius rata-rata (km) */
  diameterKm: number;
  /** definisi besaran radius dari data */
  basis: string;
  /** rasio diameter terhadap objek acuan (pertama); 1 untuk acuan */
  ratio: number | null;
  /** radius render (unit scene) — satu faktor untuk semua */
  render: number;
}

export function sizeRows(ids: string[]): SizeRow[] {
  const valid = ids.filter((id) => getObj(id).radius.value);
  if (!valid.length) return [];
  const sc = sizeScale(valid);
  const ref = valid[0];
  return valid.map((id) => {
    const o = getObj(id);
    const r = o.radius.value!;
    return {
      id,
      name: o.nameId,
      radiusKm: r,
      diameterKm: 2 * r,
      basis: o.radius.quantityDefinition,
      ratio: diameterRatio(id, ref),
      render: sc.render(id),
    };
  });
}

/** Kalimat rasio, mis. "Saturnus ≈ 9,1 × diameter Bumi". */
export function ratioSentence(row: SizeRow, refName: string) {
  if (row.ratio === null) return `${row.name}: ukuran tidak diketahui`;
  return `${row.name} ≈ ${fmtRatio(row.ratio)} × diameter ${refName}`;
}

export interface SizeSlot {
  id: string;
  /** pusat globe (unit scene) */
  x: number;
  radius: number;
  /** radius terluar untuk layout (mis. termasuk cincin) */
  frame: number;
}

/**
 * Susunan berdampingan (layout saja — BUKAN jarak orbit). Celah minimum mengikuti objek terbesar
 * agar label objek kecil tidak bertumpuk; radius tidak pernah diubah.
 */
export function sizeLayout(
  items: { id: string; radius: number; frame?: number }[],
) {
  const frames = items.map((i) => Math.max(i.frame ?? i.radius, i.radius));
  const fMax = Math.max(...frames, 1e-6);
  const slots: SizeSlot[] = [];
  let x = 0;
  items.forEach((it, i) => {
    if (i > 0) {
      const gap = Math.max(0.3 * (frames[i - 1] + frames[i]), 0.7 * fMax);
      x += frames[i - 1] + gap + frames[i];
    }
    slots.push({ id: it.id, x, radius: it.radius, frame: frames[i] });
  });
  const left = slots.length ? slots[0].x - frames[0] : 0;
  const right = slots.length
    ? slots[slots.length - 1].x + frames[frames.length - 1]
    : 0;
  const shift = (left + right) / 2;
  for (const s of slots) s.x -= shift;
  return { slots, width: right - left, maxFrame: fMax };
}

/* ---------------- jarak ---------------- */

export interface DistRow {
  id: string;
  name: string;
  /** jarak rata-rata dari Matahari (AU); satelit mengikuti planet induknya */
  au: number;
  km: number;
  /** satelit: jarak diambil dari planet induk */
  viaParent: string | null;
}

/** Jarak rata-rata dari Matahari = setengah sumbu panjang orbit (AU) dari data. */
export function meanDistanceAU(id: string): {
  au: number;
  viaParent: string | null;
} {
  if (id === "sun") return { au: 0, viaParent: null };
  const o = getObj(id);
  const a = o.orbitModel?.parameters.semiMajorAxisAU;
  if (a !== undefined) return { au: a, viaParent: null };
  if (o.parentId && o.parentId !== "sun")
    return { au: meanDistanceAU(o.parentId).au, viaParent: o.parentId };
  return { au: 0, viaParent: null };
}

export function distRows(ids: string[]): DistRow[] {
  return ids.map((id) => {
    const { au, viaParent } = meanDistanceAU(id);
    return { id, name: getObj(id).nameId, au, km: au * AU_KM, viaParent };
  });
}

/** Batas sumbu: jarak terjauh yang dipilih (minimal 1 AU agar sumbu tidak nol). */
export function axisMaxAU(ids: string[]) {
  return Math.max(1, ...ids.map((id) => meanDistanceAU(id).au));
}

/** Posisi 0..1 pada sumbu untuk setiap objek dengan SATU pemetaan. */
export function axisPositions(ids: string[], scale: DistScale) {
  const maxAU = axisMaxAU(ids);
  const map = distanceMap(scale, maxAU);
  return ids.map((id) => ({ id, t: map(meanDistanceAU(id).au) }));
}

/** Tanda sumbu (AU). Linear: kelipatan rapi; log: 0,2 · 0,5 · 1 · 2 · 5 · 10 … */
export function axisTicks(scale: DistScale, maxAU: number): number[] {
  if (scale === "log") {
    const out: number[] = [];
    for (let e = -1; e <= 3; e++)
      for (const m of [1, 2, 5]) {
        const v = m * Math.pow(10, e);
        if (v >= 0.2 - 1e-9 && v <= maxAU * 1.0001)
          out.push(Number(v.toPrecision(3)));
      }
    return out;
  }
  const steps = [0.1, 0.2, 0.25, 0.5, 1, 2, 5, 10, 20, 50];
  const step = steps.find((s) => maxAU / s <= 8) ?? 50;
  const out: number[] = [];
  for (let v = 0; v <= maxAU + 1e-9; v += step) out.push(Number(v.toFixed(3)));
  return out;
}

/** Keterangan wajib untuk skala jarak yang dipakai. */
export function distScaleLabel(scale: DistScale) {
  return scale === "log" ? "Skala logaritmik" : "Skala linear";
}

/* ---------------- preferensi tampilan (bukan data ilmiah) ---------------- */

/** Tampilkan cincin Saturnus di mode ukuran (cincin bukan bagian diameter tubuh planet). */
export const useCompareUi = create<{
  rings: boolean;
  setRings: (v: boolean) => void;
}>()((set) => ({
  rings: true,
  setRings: (rings) => set({ rings }),
}));
