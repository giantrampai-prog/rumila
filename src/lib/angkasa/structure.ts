// Matematika murni mode Struktur (tanpa three.js) — dapat diuji unit.
// Aturan (instruksi §7): posisi bagian = rest transform + offset terkurasi × (pisah/100), dihitung ABSOLUT.
// Tidak ada akumulasi per frame; 0% selalu tepat kembali ke rest.

import { OBJ, PART } from "./manifest";

export type StructureObj = "earth" | "saturn";
export type Vec3 = [number, number, number];

/** Lapisan dari luar ke dalam (urutan ini juga urutan daftar di panel). */
export const LAYERS: Record<StructureObj, readonly string[]> = {
  earth: [
    "earth.crust",
    "earth.mantle",
    "earth.outer_core",
    "earth.inner_core",
  ],
  saturn: ["saturn.molecular_h", "saturn.metallic_h", "saturn.core"],
};

/** Bagian konteks non-lapisan yang ikut tampil di model (cincin Saturnus). */
export const CONTEXT_PARTS: Record<StructureObj, readonly string[]> = {
  earth: [],
  saturn: ["saturn.rings"],
};

/** Ketebalan minimum kerak di model (fraksi radius) agar terbaca; aslinya ±0,5% radius. */
export const CRUST_MIN_FRAC = 0.05;

/** Arah pemisahan: bisektor oktan yang dipotong (x, y, z > 0), satuan. */
export const EXPLODE_DIR: Vec3 = [
  1 / Math.sqrt(3),
  1 / Math.sqrt(3),
  1 / Math.sqrt(3),
];

export interface Shell {
  id: string;
  /** radius visual luar/dalam (fraksi radius model) */
  outer: number;
  inner: number;
  /** radius dari data (sebelum pembesaran) */
  realOuter: number;
  realInner: number;
  color: string;
}

export const structureOf = (partId: string): StructureObj | null =>
  partId.startsWith("earth.")
    ? "earth"
    : partId.startsWith("saturn.")
      ? "saturn"
      : null;

/** Cangkang visual per lapisan. Kerak Bumi dipertebal sampai CRUST_MIN_FRAC; mantel menyesuaikan. */
export function visualShells(obj: StructureObj): Shell[] {
  const out: Shell[] = [];
  let prevInner = 1;
  for (const id of LAYERS[obj]) {
    const p = PART.get(id);
    if (!p || p.outerFrac === undefined || p.innerFrac === undefined)
      throw new Error(`Bagian struktur tanpa radius: ${id}`);
    let inner = p.innerFrac;
    if (id === "earth.crust") inner = Math.min(inner, 1 - CRUST_MIN_FRAC);
    out.push({
      id,
      outer: prevInner,
      inner,
      realOuter: p.outerFrac,
      realInner: p.innerFrac,
      color: p.color ?? "#999999",
    });
    prevInner = inner;
  }
  return out;
}

/** Faktor pembesaran ketebalan kerak (visual ÷ data). 1 = tidak diperbesar. */
export function crustExaggeration() {
  const c = visualShells("earth")[0];
  return (c.outer - c.inner) / (c.realOuter - c.realInner);
}

/**
 * Jarak pemisahan pada 100% sepanjang EXPLODE_DIR, per bagian.
 * Tiap lapisan dalam keluar lewat bukaan potongan lapisan luarnya: bola radius ρ berada utuh di dalam oktan
 * yang kosong bila jaraknya ≥ √3·ρ — jadi pada 100% tidak ada lapisan yang saling menembus.
 * Seluruh susunan digeser ke belakang (RECENTER) agar tetap di tengah bingkai kamera.
 */
const RECENTER = 0.35;
export function explodeDistances(obj: StructureObj): Record<string, number> {
  const shells = visualShells(obj);
  const cum: number[] = [0];
  for (let i = 1; i < shells.length; i++)
    cum.push(cum[i - 1] + Math.sqrt(3) * shells[i].outer * 1.06 + 0.04);
  const shift = cum[cum.length - 1] * RECENTER;
  const d: Record<string, number> = {};
  shells.forEach((s, i) => (d[s.id] = cum[i] - shift));
  // cincin ikut lapisan terluar (cincin & globe tetap satu sistem)
  for (const c of CONTEXT_PARTS[obj]) d[c] = d[shells[0].id];
  return d;
}

export const clampPct = (pct: number) =>
  Number.isFinite(pct) ? Math.min(100, Math.max(0, pct)) : 0;

/** Offset absolut bagian (koordinat lokal model) untuk slider pisah 0–100%. */
export function explodeOffset(partId: string, pct: number): Vec3 {
  const obj = structureOf(partId);
  if (!obj) return [0, 0, 0];
  const d = explodeDistances(obj)[partId];
  if (d === undefined) return [0, 0, 0];
  const k = (clampPct(pct) / 100) * d;
  if (k === 0) return [0, 0, 0]; // hindari -0: 0% identik dengan rest
  return [EXPLODE_DIR[0] * k, EXPLODE_DIR[1] * k, EXPLODE_DIR[2] * k];
}

/** Posisi bagian: rest (pusat model) + offset; bagian yang diisolasi ditaruh di rest agar terbingkai. */
export function partPosition(
  partId: string,
  pct: number,
  isolated: string | null,
): Vec3 {
  if (isolated === partId) return [0, 0, 0];
  return explodeOffset(partId, pct);
}

/** Titik label (lokal terhadap bagian, pada bidang potong yang menghadap kamera). */
export function labelAnchor(partId: string): Vec3 {
  const obj = structureOf(partId);
  if (!obj) return [0, 0, 0];
  if (partId === "saturn.rings") {
    const r = ringFracs();
    const m = (r.inner + r.outer) / 2;
    return [m * 0.26, 0, m * 0.97];
  }
  const shells = visualShells(obj);
  const i = shells.findIndex((s) => s.id === partId);
  if (i < 0) return [0, 0, 0];
  const s = shells[i];
  const m = s.inner === 0 ? s.outer * 0.55 : (s.outer + s.inner) / 2;
  const c = Math.SQRT1_2;
  // bergantian di tiga bidang potong agar label tidak menumpuk; inti pusat di bidang y = 0
  if (s.inner === 0) return [m * c, 0, m * c];
  if (i % 3 === 0) return [m * c, 0, m * c]; // bidang y = 0
  if (i % 3 === 1) return [0, m * c, m * c]; // bidang x = 0
  return [m * c, m * c, 0]; // bidang z = 0
}

/** Radius cincin utama (tepi dalam C – tepi luar A) sebagai fraksi radius ekuator Saturnus. */
export function ringFracs() {
  const facts = PART.get("saturn.rings")?.facts ?? [];
  const rEq = OBJ.get("saturn")?.equatorialRadius?.value ?? 60250;
  const inner = facts[0]?.qty.value ?? 74500;
  const outer = facts[1]?.qty.value ?? 136780;
  return { inner: inner / rEq, outer: outer / rEq };
}

/* ---------------- warna ---------------- */

const hexToRgb = (hex: string): Vec3 => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const mix = (a: Vec3, b: Vec3, t: number): Vec3 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

/**
 * Warna kode pendidikan pada radius r (sRGB 0–1). Bumi: warna rata per lapisan (batas seismik jelas).
 * Saturnus: gradasi lebar di batas lapisan — batas di model tidak tajam (model interpretasi).
 */
export function layerColorAt(obj: StructureObj, r: number): Vec3 {
  const shells = visualShells(obj);
  if (obj === "earth") {
    const s =
      shells.find((x) => r >= x.inner - 1e-9 && r <= x.outer + 1e-9) ??
      shells[shells.length - 1];
    return hexToRgb(s.color);
  }
  // dari dalam ke luar: mulai dari warna inti, lalu dicampur melewati tiap batas
  let c = hexToRgb(shells[shells.length - 1].color);
  for (let i = shells.length - 2; i >= 0; i--) {
    const b = shells[i].inner;
    const w = i === shells.length - 2 ? 0.08 : 0.06; // batas inti paling lebar (inti menyebar)
    c = mix(c, hexToRgb(shells[i].color), smooth(b - w, b + w, r));
  }
  return c;
}
