// Kontrak gambar untuk game Coding Agam yang BUKAN papan kotak: Ulangi (kanvas lukis), Kalau… (lari tampak
// samping), Jurus (dojo tampak samping). Setiap game punya 10 tema sendiri (satu per Level) dan kostum Agam sendiri.
// Semua gambar SVG murni, deterministik (tanpa Math.random), id gradien/pola wajib unik per game (awalan ku-/kr-/kj-).

import type { ReactNode } from 'react';

/* ============ Ulangi · Agam Pelukis (tampak atas) ============
 * Kanvas berukuran w × h satuan (jarak titik grid = 100). Agam memegang kuas di titik pusatnya dan meninggalkan goresan.
 * Garis panduan putus-putus menunjukkan gambar yang harus dibuat. */
export interface CanvasTheme {
  name: string;
  /** warna halaman di sekitar kanvas, tinta judul */
  bg: string;
  ink: string;
  dark?: boolean;
  /** bingkai kanvas (warna tepi) */
  frame: string;
  /** gradien/pola/filter (id berawalan ku-) */
  defs: ReactNode;
  /** permukaan kanvas penuh 0..w × 0..h */
  surface: (w: number, h: number) => ReactNode;
  /** hiasan di pinggir kanvas (boleh keluar sampai -60 / w+60, jangan menutupi bagian dalam kanvas lebih dari 30 satuan dari tepi) */
  props: (w: number, h: number) => ReactNode;
  /** titik grid kecil */
  dot: string;
  /** garis panduan pola */
  guide: { color: string; width: number; dash: string; opacity: number };
  /** goresan Agam untuk path d (garis lurus antar titik grid); boleh beberapa lapis (bayangan, inti, kilau) */
  stroke: (d: string) => ReactNode;
  /** alat gambar yang dipegang Agam (kuas, kapur, canting, dsb.), 1 kata untuk kalimat Agam */
  tool: string;
}

/* ============ Kalau… · Agam Pelari (tampak samping) ============
 * Adegan tinggi 600 satuan; tanah di y = 460; satu petak = 100 satuan ke kanan. Kamera mengikuti Agam.
 * Rintangan: "low" (rendah di tanah → lompat), "fly" (melayang setinggi kepala → merunduk), "gap" (lubang/jurang → lompat). */
export interface RunnerTheme {
  name: string;
  bg: string;
  ink: string;
  dark?: boolean;
  defs: ReactNode;
  /** langit diam, 0..w × 0..600 */
  sky: (w: number) => ReactNode;
  /** lapisan jauh sepanjang 0..len (bergulir pelan) */
  far: (len: number) => ReactNode;
  /** lapisan tengah sepanjang 0..len (bergulir sedang) */
  mid: (len: number) => ReactNode;
  /** tanah dari x0 sampai x1 (bagian atas di y = 460, tebal sampai 600) */
  ground: (x0: number, x1: number) => ReactNode;
  /** lubang selebar 100 mulai di x (x..x+100), tampak dari samping */
  gap: (x: number) => ReactNode;
  /** rintangan rendah di petak berpusat x (berdiri di y = 460, tinggi ≤ 70); k = nomor acak tetap untuk variasi */
  low: (x: number, k: number) => ReactNode;
  /** rintangan melayang berpusat x, di ketinggian kepala Agam (sekitar y = 350–385) */
  fly: (x: number, k: number) => ReactNode;
  /** garis finis di x */
  finish: (x: number) => ReactNode;
  /** nama benda (untuk sensor & kalimat Agam), huruf kecil: mis. { low: 'batu', fly: 'burung', gap: 'lubang' } */
  words: { low: string; fly: string; gap: string };
}
export type RunPose = 'idle' | 'run' | 'jump' | 'duck' | 'bump' | 'win';

/* ============ Jurus · Dojo Ninja (tampak samping) ============
 * Panggung 1000 × 600 satuan, lantai di y = 470. Sensei berdiri di kiri, Agam di kanan (keduanya dipusatkan di kaki). */
export type Move = 'pukul' | 'tendang' | 'lompat' | 'putar' | 'tangkis';
export type Pose = Move | 'siap' | 'hormat' | 'jatuh' | 'menang';
export interface DojoTheme {
  name: string;
  bg: string;
  ink: string;
  dark?: boolean;
  defs: ReactNode;
  /** latar & lantai penuh 0..1000 × 0..600 */
  stage: () => ReactNode;
  /** hiasan depan (di atas para tokoh), boleh null */
  front: () => ReactNode;
}
