// "Hari ini": sampai 3 misi adaptif untuk satu anak — fungsi murni di atas proyeksi penguasaan.
// Urutan kompetensi yang dilatih:
//   (a) "berkembang" yang paling lama tidak dilatih
//   (b) "belum" yang semua prasyaratnya sudah ≥ berkembang (atau tanpa prasyarat): core dulu, lalu level terendah
//   (c) review "dikuasai" terlama
// Tiap kompetensi → satu paket: hanya paket ber-level ≤ level anak, level anak diprioritaskan, lalu yang paling
// jarang dimainkan (event activity_start), lalu acak stabil (seed = jumlah event). Kurang dari 3 → diisi paket
// acak level anak.

import { levelIndex, type Competency, type ContentPack, type GameEvent, type LevelId } from "@akademi/schema";
import { KOMPETENSI, PAKET } from "./konten";
import { proyeksi, type Penguasaan, type Status } from "./mastery";

export interface Katalog {
  kompetensi: Competency[];
  paket: ContentPack[];
}

const PERINGKAT: Record<Status, number> = { belum: 0, berkembang: 1, dikuasai: 2 };
const MAKS_MISI = 3;

/** Hash string deterministik (FNV-1a 32-bit) untuk pengacakan stabil. */
function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

const bandingWaktu = (a?: string, b?: string) => (a ?? "") < (b ?? "") ? -1 : (a ?? "") > (b ?? "") ? 1 : 0;

export function pilihMisi(learnerId: string, events: GameEvent[], level: LevelId, katalog?: Katalog): ContentPack[] {
  const kompetensi = katalog?.kompetensi ?? KOMPETENSI;
  const semuaPaket = katalog?.paket ?? PAKET;
  const milik = events.filter((e) => e.learnerId === learnerId);
  const idxAnak = levelIndex(level);
  const seed = milik.length;

  const paket = semuaPaket.filter((p) => levelIndex(p.level) <= idxAnak);
  if (!paket.length) return [];
  const paketPer = new Map<string, ContentPack[]>();
  for (const p of paket) for (const cid of p.competencyIds) (paketPer.get(cid) ?? paketPer.set(cid, []).get(cid)!).push(p);

  const dimainkan = new Map<string, number>();
  for (const e of milik) if (e.type === "activity_start") dimainkan.set(e.activityId, (dimainkan.get(e.activityId) ?? 0) + 1);

  const peng: Record<string, Penguasaan> = proyeksi(milik, kompetensi);
  const statusDari = (id: string): Status => peng[id]?.status ?? "belum";

  // hanya kompetensi yang punya paket yang boleh dimainkan anak ini
  const kandidat = kompetensi.filter((c) => levelIndex(c.level) <= idxAnak && (paketPer.get(c.id)?.length ?? 0) > 0);

  const berkembang = kandidat
    .filter((c) => statusDari(c.id) === "berkembang")
    .sort((a, b) => bandingWaktu(peng[a.id].lastAt, peng[b.id].lastAt) || a.id.localeCompare(b.id));

  const siap = (c: Competency) => c.prereq.every((p) => !peng[p] || PERINGKAT[statusDari(p)] >= PERINGKAT.berkembang);
  const belum = kandidat
    .filter((c) => statusDari(c.id) === "belum" && siap(c))
    .sort((a, b) => Number(b.core) - Number(a.core) || levelIndex(a.level) - levelIndex(b.level) || a.id.localeCompare(b.id));

  const review = kandidat
    .filter((c) => statusDari(c.id) === "dikuasai")
    .sort((a, b) => bandingWaktu(peng[a.id].lastAt, peng[b.id].lastAt) || a.id.localeCompare(b.id));

  const urutkanPaket = (list: ContentPack[]) =>
    list
      .slice()
      .sort(
        (a, b) =>
          Number(levelIndex(a.level) !== idxAnak) - Number(levelIndex(b.level) !== idxAnak) ||
          (dimainkan.get(a.id) ?? 0) - (dimainkan.get(b.id) ?? 0) ||
          hash(`${seed}:${a.id}`) - hash(`${seed}:${b.id}`) ||
          a.id.localeCompare(b.id),
      );

  const hasil: ContentPack[] = [];
  const dipakai = new Set<string>();
  const ambil = (list: ContentPack[]) => {
    for (const p of urutkanPaket(list)) {
      if (dipakai.has(p.id)) continue;
      hasil.push(p);
      dipakai.add(p.id);
      return true;
    }
    return false;
  };

  for (const c of [...berkembang, ...belum, ...review]) {
    if (hasil.length >= MAKS_MISI) break;
    ambil(paketPer.get(c.id) ?? []);
  }

  // kurang dari 3: paket acak level anak dulu, lalu level di bawahnya
  if (hasil.length < MAKS_MISI) {
    const levelAnak = paket.filter((p) => levelIndex(p.level) === idxAnak);
    const sisa = paket.filter((p) => levelIndex(p.level) !== idxAnak);
    for (const kelompok of [levelAnak, sisa]) {
      const acak = urutkanPaket(kelompok).sort((a, b) => hash(`${seed}:isi:${a.id}`) - hash(`${seed}:isi:${b.id}`));
      for (const p of acak) {
        if (hasil.length >= MAKS_MISI) break;
        if (dipakai.has(p.id)) continue;
        hasil.push(p);
        dipakai.add(p.id);
      }
    }
  }
  return hasil;
}
