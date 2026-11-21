// Katalog + profil Academy untuk UI. Katalog murni ada di ./katalog (dipakai juga server penerbit sertifikat);
// berkas ini menambah profil anak (level, bahasa, peran) di localStorage dan hook React-nya.

import { useEffect, useState } from "react";
import { LevelId } from "@akademi/schema";

export * from "./katalog";

/* ---------------- level anak (localStorage; disinkron game_save oleh lapisan lain) ---------------- */

export const LEVEL_ANAK_KEY = (memberId: string) => `rumila-akademi-${memberId}`;
const LEVEL_DEFAULT: LevelId = "PAUD";

/** pendengar perubahan profil Academy (level, bahasa, peran) per anggota */
type PendengarBahasa = (memberId: string) => void;
const pendengarBahasa = new Set<PendengarBahasa>();

export function levelAnak(memberId: string): LevelId {
  if (typeof window === "undefined") return LEVEL_DEFAULT;
  try {
    const raw = localStorage.getItem(LEVEL_ANAK_KEY(memberId));
    if (!raw) return LEVEL_DEFAULT;
    const v = JSON.parse(raw) as { level?: unknown };
    const r = LevelId.safeParse(v?.level);
    return r.success ? r.data : LEVEL_DEFAULT;
  } catch {
    return LEVEL_DEFAULT;
  }
}

export function setLevelAnak(memberId: string, level: LevelId) {
  if (typeof window === "undefined") return;
  try {
    let prev: Record<string, unknown> = {};
    try {
      prev = JSON.parse(localStorage.getItem(LEVEL_ANAK_KEY(memberId)) ?? "{}") ?? {};
    } catch {}
    localStorage.setItem(LEVEL_ANAK_KEY(memberId), JSON.stringify({ ...prev, level }));
  } catch {}
  for (const fn of pendengarBahasa) {
    try {
      fn(memberId);
    } catch {}
  }
}


/* ---------------- bahasa konten anak (objek JSON yang sama dengan level) ---------------- */

/** Bahasa konten Academy per anak: instruksi paket, pernyataan kompetensi, nama unit/track. UI kerangka tetap Indonesia. */
export type BahasaAnak = "id" | "en";
const BAHASA_DEFAULT: BahasaAnak = "id";

export function bahasaAnak(memberId: string): BahasaAnak {
  if (typeof window === "undefined") return BAHASA_DEFAULT;
  try {
    const raw = localStorage.getItem(LEVEL_ANAK_KEY(memberId));
    if (!raw) return BAHASA_DEFAULT;
    const v = JSON.parse(raw) as { bahasa?: unknown };
    return v?.bahasa === "en" ? "en" : BAHASA_DEFAULT;
  } catch {
    return BAHASA_DEFAULT;
  }
}


export function setBahasaAnak(memberId: string, bahasa: BahasaAnak) {
  if (typeof window === "undefined") return;
  try {
    let prev: Record<string, unknown> = {};
    try {
      prev = JSON.parse(localStorage.getItem(LEVEL_ANAK_KEY(memberId)) ?? "{}") ?? {};
    } catch {}
    localStorage.setItem(LEVEL_ANAK_KEY(memberId), JSON.stringify({ ...prev, bahasa }));
  } catch {}
  for (const fn of pendengarBahasa) {
    try {
      fn(memberId);
    } catch (e) {
      console.error("[akademi] pendengar bahasa gagal", e);
    }
  }
}

/** Hook: bahasa konten anak, ikut berubah saat setBahasaAnak() atau sinkron akun (event `rumila:saves`). */
export function useBahasaAnak(memberId: string): BahasaAnak {
  const [bahasa, setBahasa] = useState<BahasaAnak>(() => bahasaAnak(memberId));
  useEffect(() => {
    setBahasa(bahasaAnak(memberId));
    const segar = (id: string) => {
      if (id === memberId) setBahasa(bahasaAnak(memberId));
    };
    const dariSaves = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!Array.isArray(detail) || detail.includes(LEVEL_ANAK_KEY(memberId))) setBahasa(bahasaAnak(memberId));
    };
    pendengarBahasa.add(segar);
    window.addEventListener("rumila:saves", dariSaves);
    return () => {
      pendengarBahasa.delete(segar);
      window.removeEventListener("rumila:saves", dariSaves);
    };
  }, [memberId]);
  return bahasa;
}

/* ---------------- peran Academy: anak / dewasa (objek JSON yang sama dengan level & bahasa) ---------------- */

/** Anggota non-admin dianggap anak kecuali wali menandainya dewasa (Ibu, Nenek). Rapor, Telemetri, dan misi hanya menghitung anak. */
export type PeranAkademi = "anak" | "dewasa";

export function peranAkademi(memberId: string): PeranAkademi {
  if (typeof window === "undefined") return "anak";
  try {
    const raw = localStorage.getItem(LEVEL_ANAK_KEY(memberId));
    if (!raw) return "anak";
    const v = JSON.parse(raw) as { peran?: unknown };
    return v?.peran === "dewasa" ? "dewasa" : "anak";
  } catch {
    return "anak";
  }
}

export function setPeranAkademi(memberId: string, peran: PeranAkademi) {
  if (typeof window === "undefined") return;
  try {
    let prev: Record<string, unknown> = {};
    try {
      prev = JSON.parse(localStorage.getItem(LEVEL_ANAK_KEY(memberId)) ?? "{}") ?? {};
    } catch {}
    localStorage.setItem(LEVEL_ANAK_KEY(memberId), JSON.stringify({ ...prev, peran }));
  } catch {}
  for (const fn of pendengarBahasa) {
    try {
      fn(memberId);
    } catch (e) {
      console.error("[akademi] pendengar peran gagal", e);
    }
  }
}

/** Anak di rumah: non-admin yang tidak ditandai dewasa. */
export function anakRumah<T extends { id: string; admin: boolean; peran?: "anak" | "dewasa" }>(members: T[]): T[] {
  // peran di server menang; tanpa itu, non-admin dianggap anak kecuali ditandai dewasa di perangkat
  return members.filter((m) => (m.peran ? m.peran === "anak" : !m.admin && peranAkademi(m.id) === "anak"));
}

/** Hook: angka yang bertambah tiap profil Academy (level/bahasa/peran) anggota mana pun berubah — untuk daftar anak di Rapor/Telemetri. */
export function useProfilAkademiVersi(): number {
  const [v, setV] = useState(0);
  useEffect(() => {
    const naik = () => setV((x) => x + 1);
    pendengarBahasa.add(naik);
    window.addEventListener("rumila:saves", naik);
    return () => {
      pendengarBahasa.delete(naik);
      window.removeEventListener("rumila:saves", naik);
    };
  }, []);
  return v;
}

/** Hook: peran satu anggota. */
export function usePeranAkademi(memberId: string): PeranAkademi {
  const versi = useProfilAkademiVersi();
  const [p, setP] = useState<PeranAkademi>("anak");
  useEffect(() => setP(peranAkademi(memberId)), [memberId, versi]);
  return p;
}
