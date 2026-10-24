// Katalog Akademi yang dipakai UI: kompetensi (content/kurikulum) + paket (content/paket).
// Sumber: src/lib/akademi/katalog.generated.ts (dibuat `npm run -s akademi:index`), diparse zod sekali saat modul dimuat.
// Berkas yang tidak lolos skema dilaporkan ke console.error dan dilewati, bukan menjatuhkan aplikasi.

import { useEffect, useState } from "react";
import { ContentPack, KurikulumFile, LevelId, type Competency } from "@akademi/schema";
import { KURIKULUM_RAW, PAKET_RAW } from "./katalog.generated";

function jelaskan(issues: { path: PropertyKey[]; message: string }[]) {
  return issues
    .slice(0, 8)
    .map((i) => `${i.path.join(".")}: ${i.message}`)
    .join("; ");
}

function parseKompetensi(): Competency[] {
  const out: Competency[] = [];
  const lihat = new Set<string>();
  (KURIKULUM_RAW as readonly unknown[]).forEach((raw, i) => {
    const r = KurikulumFile.safeParse(raw);
    if (!r.success) {
      console.error(`[akademi] kurikulum #${i} tidak valid: ${jelaskan(r.error.issues)}`);
      return;
    }
    for (const c of r.data.kompetensi) {
      if (lihat.has(c.id)) {
        console.error(`[akademi] kompetensi ganda dilewati: ${c.id}`);
        continue;
      }
      lihat.add(c.id);
      out.push(c);
    }
  });
  return out;
}

function parsePaket(): ContentPack[] {
  const out: ContentPack[] = [];
  const lihat = new Set<string>();
  PAKET_RAW.forEach((raw, i) => {
    const r = ContentPack.safeParse(raw);
    if (!r.success) {
      const id = raw && typeof raw === "object" && "id" in raw ? String((raw as { id: unknown }).id) : `#${i}`;
      console.error(`[akademi] paket ${id} tidak valid: ${jelaskan(r.error.issues)}`);
      return;
    }
    if (lihat.has(r.data.id)) {
      console.error(`[akademi] paket ganda dilewati: ${r.data.id}`);
      return;
    }
    lihat.add(r.data.id);
    out.push(r.data);
  });
  return out;
}

/** Gabungan content/kurikulum/*.json (urutan berkas → urutan kompetensi). */
export const KOMPETENSI: Competency[] = parseKompetensi();
/** Gabungan content/paket/**\/*.json. */
export const PAKET: ContentPack[] = parsePaket();

const kompetensiIdx = new Map(KOMPETENSI.map((c) => [c.id, c]));
const paketIdx = new Map(PAKET.map((p) => [p.id, p]));
const paketPerKompetensi = new Map<string, ContentPack[]>();
for (const p of PAKET) for (const cid of p.competencyIds) (paketPerKompetensi.get(cid) ?? paketPerKompetensi.set(cid, []).get(cid)!).push(p);

export function kompetensiById(id: string): Competency | undefined {
  return kompetensiIdx.get(id);
}
export function paketById(id: string): ContentPack | undefined {
  return paketIdx.get(id);
}
/** Paket yang membuktikan kompetensi ini. */
export function paketUntuk(competencyId: string): ContentPack[] {
  return paketPerKompetensi.get(competencyId) ?? [];
}
/** Kompetensi yang dibuktikan paket ini (yang tidak ada di kurikulum dilewati). */
export function kompetensiUntuk(paketId: string): Competency[] {
  const p = paketIdx.get(paketId);
  if (!p) return [];
  return p.competencyIds.map((id) => kompetensiIdx.get(id)).filter((c): c is Competency => !!c);
}

/* ---------------- level anak (localStorage; disinkron game_save oleh lapisan lain) ---------------- */

export const LEVEL_ANAK_KEY = (memberId: string) => `rumila-akademi-${memberId}`;
const LEVEL_DEFAULT: LevelId = "PAUD";

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

type PendengarBahasa = (memberId: string) => void;
const pendengarBahasa = new Set<PendengarBahasa>();

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
