// Denah Rinoya Resto (koordinat dunia, meter). Mengikuti "Denah Konsep" dari pemilik: jalan di depan (+z),
// halaman parkir mobil (kiri) & motor (kanan), pintu masuk bernoren di tengah, dinding merah berjendela bulat
// dengan taman di kanan depan. Di dalam: baris belakang DAPUR · PREP · CUCI · GUDANG KERING · PENDINGIN ·
// RUANG STAF; AREA MAKAN luas di kiri dengan dapur terbuka; KASIR, AMBIL PESANAN, rak pajang di tengah;
// TOILET AKSESIBEL, TOILET, CUCI TANGAN di kanan; akses servis di belakang.

import * as T from 'three';

/** Lahan resto (termasuk halaman parkir & akses servis). */
export const LOT = { x0: -23.8, x1: 7.2, z0: -16.2, z1: 3.2 };
/** Badan bangunan. */
export const BLD = { x0: -22.4, x1: 5.6, z0: -14.4, z1: -2.4 };
/** Tinggi lantai dalam (di atas halaman yang setinggi trotoar 0.15). */
export const FLOOR_Y = 0.45;
export const YARD_Y = 0.15;
/** Teras depan & tangga masuk. */
export const TERRACE = { x0: -6.6, x1: -1.4, z0: -2.4, z1: -0.9 };
export const STEPS = { x0: -5.6, x1: -2.4, z0: -0.9, z1: 0.3 };

/** Atap miring satu arah: rendah di kiri, tinggi di kanan. */
export const roofY = (x: number) => 4.3 + ((x - BLD.x0) / (BLD.x1 - BLD.x0)) * 2.6;

export const ROOMS = {
  kitchenZ: [-14.4, -10.6] as const,
  dapur: [-22.4, -12.2] as const,
  prep: [-12.2, -9.3] as const,
  cuci: [-9.3, -6.2] as const,
  gudang: [-6.2, -3.0] as const,
  pendingin: [-3.0, 0.1] as const,
  staf: [0.1, 5.6] as const,
  dining: { x0: -22.4, x1: -6.8, z0: -10.6, z1: -2.4 },
  toilet: { x0: 1.0, x1: 5.6, z0: -10.6, z1: -6.6 },
  wash: { x0: 1.0, x1: 5.6, z0: -6.6, z1: -4.6 },
  garden: { x0: 0.9, x1: 7.0, z0: -4.4, z1: -0.5 },
};

export const DOOR = new T.Vector3(-4.0, 0, -2.4);
export const SIDEWALK_IN = new T.Vector3(-4.0, 0, 5.4);
export const COUNTER = new T.Vector3(-5.2, 0, -7.6); // meja kasir (pelanggan berdiri di +z)
export const QUEUE_X = -3.7;
export const PICKUP = new T.Vector3(-6.2, 0, -5.0);
export const PASS_Z = -10.1; // meja saji dapur terbuka
export const STATIONS: Record<string, T.Vector3> = {
  goreng: new T.Vector3(-20.4, 0, -13.5),
  kompor: new T.Vector3(-17.8, 0, -13.5),
  sushi: new T.Vector3(-15.2, 0, -13.5),
  minum: new T.Vector3(-13.0, 0, -13.5),
};
export const RICE = new T.Vector3(-10.8, 0, -13.6);
export const FRIDGE = new T.Vector3(-1.5, 0, -13.4);

/** Posisi meja makan (maks 12): 4 kolom × 3 baris di area makan. */
export const TABLE_SLOTS: [number, number][] = [];
for (const z of [-8.3, -6.0, -3.8]) for (const x of [-10.4, -13.7, -17.0, -20.3]) TABLE_SLOTS.push([x, z]);

/** Tinggi permukaan tempat berpijak (lantai dalam, teras, tangga, halaman). */
export function groundY(x: number, z: number) {
  const inGarden = x > ROOMS.garden.x0 && z > ROOMS.garden.z0;
  const inBld = x > BLD.x0 && x < BLD.x1 + 0.1 && z > BLD.z0 && z < BLD.z1 && !inGarden;
  if (inBld) return FLOOR_Y;
  if (x > TERRACE.x0 && x < TERRACE.x1 && z >= TERRACE.z0 && z < TERRACE.z1) return FLOOR_Y;
  if (x > STEPS.x0 - 0.3 && x < STEPS.x1 + 0.3 && z >= STEPS.z0 && z < STEPS.z1) {
    const k = (z - STEPS.z0) / (STEPS.z1 - STEPS.z0);
    return FLOOR_Y - Math.min(1, Math.floor(k * 2 + 1) / 2) * (FLOOR_Y - YARD_Y);
  }
  return YARD_Y;
}

/** Ruang-ruang untuk gambar kerja (denah) di panel & papan proyek: [nama, x0, x1, z0, z1, warna]. */
export const PLAN_ROOMS: [string, number, number, number, number, string][] = [
  ['DAPUR', -22.4, -12.2, -14.4, -10.6, '#c9ced3'],
  ['PREP', -12.2, -9.3, -14.4, -10.6, '#c9ced3'],
  ['CUCI', -9.3, -6.2, -14.4, -10.6, '#c9ced3'],
  ['GUDANG', -6.2, -3.0, -14.4, -10.6, '#e6dccb'],
  ['PENDINGIN', -3.0, 0.1, -14.4, -10.6, '#d6e2ea'],
  ['STAF', 0.1, 5.6, -14.4, -10.6, '#efe4cf'],
  ['AREA MAKAN', -22.4, -6.8, -10.6, -2.4, '#e9c99a'],
  ['KASIR', -6.8, 1.0, -10.6, -2.4, '#f3e9d8'],
  ['TOILET ♿', 1.0, 3.3, -10.6, -6.6, '#e8e2d6'],
  ['TOILET', 3.3, 5.6, -10.6, -6.6, '#e8e2d6'],
  ['CUCI TANGAN', 1.0, 5.6, -6.6, -4.4, '#e8e2d6'],
  ['TAMAN', 0.9, 7.0, -4.4, -0.5, '#b8413a'],
  ['PARKIR MOBIL', -21.7, -11.6, -1.6, 3.0, '#b9b3a6'],
  ['PARKIR MOTOR', 1.2, 6.8, 0.2, 3.0, '#b9b3a6'],
];
