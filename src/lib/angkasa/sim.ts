// Waktu, skala, dan pose — semua fungsi murni (tanpa Three.js) agar mudah diuji.

import { getObj } from "./manifest";
import type { AngkasaObject } from "./types";

/* ---------------- jam simulasi bersama ---------------- */

/**
 * Jam simulasi: waktu disimpan absolut (hari sejak epoch simulasi), pose selalu dihitung dari waktu ini.
 * Pause membekukan waktu; ubah kecepatan tidak memutus kontinuitas; langkah per frame dibatasi agar
 * kembali dari tab tersembunyi tidak menimbulkan loncatan besar.
 */
export class SimClock {
  /** hari simulasi sejak epoch */
  days = 0;
  /** hari simulasi per detik nyata */
  speed = 5;
  playing = false;
  /** jam inspeksi (detik nyata) untuk rotasi diperlambat; berhenti bila rotasi dimatikan */
  spinSeconds = 0;
  spinOn = true;
  orbitOn = true;

  tick(dtReal: number) {
    const dt = Math.min(Math.max(dtReal, 0), 0.1); // batasi langkah (tab kembali aktif tidak melompat)
    if (this.playing && this.orbitOn) this.days += dt * this.speed;
    if (this.playing && this.spinOn) this.spinSeconds += dt;
  }
  reset() {
    this.days = 0;
    this.spinSeconds = 0;
  }
}

export const SPEEDS: { value: number; label: string }[] = [
  { value: 1, label: "1 hari/detik" },
  { value: 5, label: "5 hari/detik" },
  { value: 30, label: "30 hari/detik" },
  { value: 120, label: "120 hari/detik" },
];

const TAU = Math.PI * 2;

/** Sudut orbit (radian) pada waktu `days`, dari parameter per objek. */
export function orbitAngle(o: AngkasaObject, days: number) {
  const p = o.orbitModel?.parameters;
  if (!p) return 0;
  return ((p.phaseDeg * Math.PI) / 180 + (TAU * days) / p.periodDays) % TAU;
}

/**
 * Periode rotasi tampilan (detik nyata per putaran) untuk mode inspeksi: "Rotasi diperlambat".
 * Urutan cepat–lambat dan arah (retrograde) dipertahankan; nilainya bukan kecepatan sebenarnya.
 */
export function visualSpinPeriodSec(o: AngkasaObject) {
  const h = o.spinModel?.periodHours;
  if (!h) return 0;
  const s = Math.min(60, Math.max(6, 8 * Math.pow(Math.abs(h) / 24, 0.35)));
  return Math.sign(h) * s;
}
export function spinAngle(o: AngkasaObject, spinSeconds: number) {
  const s = visualSpinPeriodSec(o);
  return s ? ((TAU * spinSeconds) / s) % TAU : 0;
}

/* ---------------- adapter skala ---------------- */

/** Tampilan belajar: radius & jarak dipetakan dengan fungsi berbeda. WAJIB tampil keterangan "Ukuran dan jarak disederhanakan". */
export const LEARNING = {
  label: "Tampilan belajar — ukuran dan jarak disederhanakan",
  /** radius render (unit scene) dari radius km */
  radius(o: AngkasaObject) {
    if (o.id === "sun") return 2.2;
    if (o.id === "asteroid-example") return 0.16;
    if (o.id === "comet-example") return 0.12;
    const r = o.radius.value ?? 1000;
    return 0.25 * Math.pow(r / 2439.7, 0.45);
  },
  /** jarak render dari Matahari (unit scene) dari setengah sumbu panjang (AU) */
  distance(au: number) {
    return 3.2 + 5.5 * Math.sqrt(au);
  },
  /** jarak satelit dari induk (unit scene), dirapatkan */
  moonDistance(o: AngkasaObject) {
    return o.id === "moon" ? 0.95 : o.id === "titan" ? 3.1 : 1;
  },
};

/** Bandingkan ukuran: SATU faktor untuk semua radius rata-rata (basis sama). */
export function sizeScale(ids: string[], largestRender = 1.6) {
  const radii = ids.map((id) => getObj(id).radius.value ?? 0);
  const max = Math.max(...radii, 1);
  const k = largestRender / max;
  return {
    k,
    basis: "radius rata-rata (km)",
    render: (id: string) => (getObj(id).radius.value ?? 0) * k,
  };
}

/** Rasio diameter A terhadap B, dihitung dari data (radius rata-rata). */
export function diameterRatio(a: string, b: string) {
  const ra = getObj(a).radius.value;
  const rb = getObj(b).radius.value;
  if (!ra || !rb) return null;
  return ra / rb;
}

export type DistScale = "linear" | "log";
/** Bandingkan jarak: satu pemetaan jarak rata-rata (AU) → posisi sumbu 0..1. */
export function distanceMap(scale: DistScale, maxAU: number) {
  if (scale === "linear") return (au: number) => au / maxAU;
  const lo = Math.log10(0.2);
  const hi = Math.log10(maxAU);
  return (au: number) => (Math.log10(Math.max(au, 0.2)) - lo) / (hi - lo);
}

/* ---------------- format angka ---------------- */

const nf = (d: number) =>
  new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: d,
    minimumFractionDigits: 0,
  });
export function fmtValue(v: number | null, format?: string) {
  if (v === null) return "tidak diketahui";
  if (format === "int") return nf(0).format(v);
  if (format === "1") return nf(1).format(v);
  if (format === "2") return nf(2).format(v);
  if (format === "hours-days") {
    const h = Math.abs(v);
    return `${nf(1).format(h / 24)} hari Bumi${v < 0 ? " (retrograde)" : ""}`;
  }
  return nf(2).format(v);
}
