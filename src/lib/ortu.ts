"use client";

// Kunci Ruang Orang Tua: PIN admin rumah (Ayah/Ibu).
// - Anggota rumah di server: PIN diperiksa RPC verify_member_pin (hash bcrypt di server, tidak pernah dikirim balik).
// - Anggota demo lokal: PIN polos di store (seperti sebelumnya).
// - Terbuka 15 menit per tab (sessionStorage); 5 kali salah → terkunci 5 menit (localStorage).

import { PIN_SET, verifyPin } from "@/lib/supabase/family";
import { isOrangTua } from "@/lib/profil";
import type { Member } from "@/lib/store";

const KUNCI_BUKA = "rinoya-ortu-buka";
const KUNCI_GAGAL = "rinoya-ortu-gagal";
export const LAMA_BUKA_MS = 15 * 60_000;
export const MAKS_SALAH = 5;
export const JEDA_KUNCI_MS = 5 * 60_000;

const aman = <T,>(fn: () => T, cadangan: T): T => {
  try {
    return fn();
  } catch {
    return cadangan;
  }
};

/** Profil yang PIN-nya membuka Ruang Orang Tua: orang tua ber-PIN; rumah yang didaftarkan siswa sendiri memakai PIN admin. */
export const adminBerPin = (members: Member[]) => {
  const ortu = members.filter((m) => isOrangTua(m) && !!m.pin);
  return ortu.length ? ortu : members.filter((m) => m.admin && !!m.pin);
};

/** Tandai Ruang Orang Tua terbuka (mis. orang tua baru saja masuk ke profilnya dengan PIN). */
export const bukaRuang = () => aman(() => sessionStorage.setItem(KUNCI_BUKA, String(Date.now())), undefined);

export function ruangTerbuka(sekarang = Date.now()): boolean {
  const t = Number(aman(() => sessionStorage.getItem(KUNCI_BUKA), null) ?? 0);
  return t > 0 && sekarang - t < LAMA_BUKA_MS;
}

export function tutupRuang() {
  aman(() => sessionStorage.removeItem(KUNCI_BUKA), undefined);
}

type Gagal = { n: number; sampai: number };
const bacaGagal = (): Gagal => aman(() => JSON.parse(localStorage.getItem(KUNCI_GAGAL) ?? "null") as Gagal | null, null) ?? { n: 0, sampai: 0 };
const tulisGagal = (g: Gagal) => aman(() => localStorage.setItem(KUNCI_GAGAL, JSON.stringify(g)), undefined);

/** Sisa waktu terkunci (ms), 0 bila boleh mencoba. */
export const sisaKunci = (sekarang = Date.now()) => Math.max(0, bacaGagal().sampai - sekarang);

export type HasilPin = { ok: true } | { ok: false; alasan: "salah" | "terkunci" | "tanpa_pin" | "galat"; sisa?: number };

/** Cocokkan PIN dengan PIN salah satu admin rumah. */
export async function bukaDenganPin(members: Member[], pin: string): Promise<HasilPin> {
  const sisa = sisaKunci();
  if (sisa > 0) return { ok: false, alasan: "terkunci", sisa };
  const admin = adminBerPin(members);
  if (!admin.length) return { ok: false, alasan: "tanpa_pin" };
  let cocok = false;
  try {
    for (const m of admin) {
      if (m.pin === PIN_SET ? await verifyPin(m.id, pin) : m.pin === pin) {
        cocok = true;
        break;
      }
    }
  } catch {
    return { ok: false, alasan: "galat" };
  }
  if (cocok) {
    tulisGagal({ n: 0, sampai: 0 });
    bukaRuang();
    return { ok: true };
  }
  const g = bacaGagal();
  const n = g.n + 1;
  tulisGagal(n >= MAKS_SALAH ? { n: 0, sampai: Date.now() + JEDA_KUNCI_MS } : { n, sampai: 0 });
  return n >= MAKS_SALAH ? { ok: false, alasan: "terkunci", sisa: JEDA_KUNCI_MS } : { ok: false, alasan: "salah", sisa: MAKS_SALAH - n };
}
