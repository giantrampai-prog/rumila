// Katalog Akademi (murni, aman untuk server & klien): kompetensi (content/kurikulum) + paket (content/paket).
// Sumber: src/lib/akademi/katalog.generated.ts (dibuat `npm run -s akademi:index`), diparse zod sekali saat modul dimuat.
// Berkas yang tidak lolos skema dilaporkan ke console.error dan dilewati, bukan menjatuhkan aplikasi.

import { ContentPack, DEFAULT_MASTERY, KurikulumFile, type Competency } from "@akademi/schema";
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

// Konteks = paket berbeda. Kompetensi yang paketnya kurang dari DEFAULT_MASTERY.minContexts tidak akan pernah
// "dikuasai" (dan anak tertahan di Gerbang Naik Pangkat), jadi syaratnya diturunkan ke jumlah paket yang ada.
for (const c of KOMPETENSI) {
  const ada = paketPerKompetensi.get(c.id)?.length ?? 0;
  if (c.mastery?.minContexts === undefined && ada < DEFAULT_MASTERY.minContexts) c.mastery = { ...c.mastery, minContexts: Math.max(1, ada) };
}

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

