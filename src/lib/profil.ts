"use client";

// Kunci profil: setelah akun rumah masuk, setiap orang memilih profilnya lalu mengetik PIN.
// - Profil terbuka per tab (sessionStorage) dan terkunci lagi setelah 30 menit tidak dipakai.
// - Tablet anak bisa dikunci ke satu profil (localStorage): layar masuk langsung menampilkan PIN anak itu.
// - PIN diperiksa server (RPC verify_member_pin, bcrypt); 5 kali salah → jeda 5 menit per profil.

import { peranAkademi } from "@/lib/akademi/konten";
import { PIN_SET, verifyPin } from "@/lib/supabase/family";
import type { Member } from "@/lib/store";

const KUNCI_PROFIL = "rinoya-profil";
const KUNCI_PERANGKAT = "rinoya-perangkat-anak";
const KUNCI_GAGAL = (id: string) => `rinoya-pin-gagal-${id}`;
export const DIAM_MS = 30 * 60_000;
export const MAKS_SALAH = 5;
export const JEDA_MS = 5 * 60_000;

const aman = <T,>(fn: () => T, cadangan: T): T => {
  try {
    return fn();
  } catch {
    return cadangan;
  }
};

/** Orang tua/dewasa: admin yang tidak ditandai anak, atau anggota yang ditandai dewasa. */
export function isOrangTua(m: Pick<Member, "id" | "admin" | "peran">): boolean {
  if (m.peran) return m.peran === "dewasa";
  return m.admin || peranAkademi(m.id) === "dewasa";
}

type Sesi = { id: string; at: number };
const bacaSesi = (): Sesi | null => aman(() => JSON.parse(sessionStorage.getItem(KUNCI_PROFIL) ?? "null") as Sesi | null, null);

export function profilTerbuka(memberId: string, sekarang = Date.now()): boolean {
  const s = bacaSesi();
  return !!s && s.id === memberId && sekarang - s.at < DIAM_MS;
}

export const bukaProfil = (memberId: string) => aman(() => sessionStorage.setItem(KUNCI_PROFIL, JSON.stringify({ id: memberId, at: Date.now() })), undefined);
export const tutupProfil = () => aman(() => sessionStorage.removeItem(KUNCI_PROFIL), undefined);

/** Perpanjang waktu terbuka saat ada sentuhan/ketikan. */
export function sentuhProfil() {
  const s = bacaSesi();
  if (s) bukaProfil(s.id);
}

export const perangkatAnak = (): string | null => aman(() => localStorage.getItem(KUNCI_PERANGKAT), null);
export const setPerangkatAnak = (memberId: string | null) =>
  aman(() => (memberId ? localStorage.setItem(KUNCI_PERANGKAT, memberId) : localStorage.removeItem(KUNCI_PERANGKAT)), undefined);

type Gagal = { n: number; sampai: number };
const bacaGagal = (id: string): Gagal => aman(() => JSON.parse(localStorage.getItem(KUNCI_GAGAL(id)) ?? "null") as Gagal | null, null) ?? { n: 0, sampai: 0 };
const tulisGagal = (id: string, g: Gagal) => aman(() => localStorage.setItem(KUNCI_GAGAL(id), JSON.stringify(g)), undefined);
export const sisaJeda = (id: string, sekarang = Date.now()) => Math.max(0, bacaGagal(id).sampai - sekarang);

export type HasilPinProfil = { ok: true } | { ok: false; alasan: "salah" | "terkunci" | "galat"; sisa?: number };

/** Cocokkan PIN satu profil. Profil tanpa PIN selalu lolos. */
export async function cekPinProfil(m: Member, pin: string): Promise<HasilPinProfil> {
  if (!m.pin) return { ok: true };
  const jeda = sisaJeda(m.id);
  if (jeda > 0) return { ok: false, alasan: "terkunci", sisa: jeda };
  let cocok: boolean;
  try {
    cocok = m.pin === PIN_SET ? await verifyPin(m.id, pin) : m.pin === pin;
  } catch {
    return { ok: false, alasan: "galat" };
  }
  if (cocok) {
    tulisGagal(m.id, { n: 0, sampai: 0 });
    return { ok: true };
  }
  const n = bacaGagal(m.id).n + 1;
  tulisGagal(m.id, n >= MAKS_SALAH ? { n: 0, sampai: Date.now() + JEDA_MS } : { n, sampai: 0 });
  return n >= MAKS_SALAH ? { ok: false, alasan: "terkunci", sisa: JEDA_MS } : { ok: false, alasan: "salah", sisa: MAKS_SALAH - n };
}

/** Gambar PIN untuk PAUD–TK: tombol ke-1..9 = angka 1..9 (server tetap menyimpan 4 angka). */
export const GAMBAR_PIN = [
  { ikon: "pets", warna: "#fd861d", nama: "Kucing" },
  { ikon: "favorite", warna: "#ff4757", nama: "Hati" },
  { ikon: "star", warna: "#ffbe0b", nama: "Bintang" },
  { ikon: "eco", warna: "#1fbf62", nama: "Daun" },
  { ikon: "water_drop", warna: "#0786eb", nama: "Tetes air" },
  { ikon: "rocket_launch", warna: "#8b45f5", nama: "Roket" },
  { ikon: "sailing", warna: "#12b8a6", nama: "Perahu" },
  { ikon: "local_florist", warna: "#d12a7c", nama: "Bunga" },
  { ikon: "sunny", warna: "#5b4bff", nama: "Matahari" },
] as const;
