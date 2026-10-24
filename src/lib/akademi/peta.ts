// Peta Petualangan Academy: satu jenjang = pelajaran → unit → misi (satu kompetensi) — fungsi murni, tanpa React/DOM.
//   terbuka   = semua prasyarat sudah ≥ berkembang (prasyarat yang tidak ada di katalog dianggap lulus)
//   sekarang  = misi terbuka pertama yang belum dikuasai, per pelajaran (urut file kurikulum)
//   ulang     = sudah dikuasai tapi tidak dilatih ≥ HARI_ULANG hari
//   lanjut    = misi "sekarang" dari pelajaran yang progres intinya paling tertinggal; bila semua habis → ulang terlama
// Naik jenjang: semua kompetensi inti jenjang dikuasai → jenjang berikutnya yang sudah punya kurikulum.

import { LEVEL_IDS, levelIndex, type Competency, type ContentPack, type GameEvent, type LevelId, type TrackId } from "@akademi/schema";
import { statusLencana, type StatusLencana } from "./koleksi";
import type { Penguasaan, Status } from "./mastery";

export const HARI_ULANG = 7;

export interface MisiPeta {
  kompetensi: Competency;
  status: Status;
  terbuka: boolean;
  sekarang: boolean;
  ulang: boolean;
}

export interface UnitPeta {
  id: string;
  nama: Competency["unit"]["nama"];
  misi: MisiPeta[];
  lencana: StatusLencana;
}

export interface Hitungan {
  dikuasai: number;
  total: number;
}

export interface PelajaranPeta {
  track: TrackId;
  unit: UnitPeta[];
  inti: Hitungan;
  sekarang?: MisiPeta;
}

export interface PetaJenjang {
  level: LevelId;
  pelajaran: PelajaranPeta[];
  inti: Hitungan;
  /** semua kompetensi inti jenjang dikuasai */
  tercapai: boolean;
  lanjut?: { track: TrackId; misi: MisiPeta };
}

const statusDari = (peng: Record<string, Penguasaan>, id: string): Status => peng[id]?.status ?? "belum";

export function petaJenjang(peng: Record<string, Penguasaan>, kompetensi: Competency[], level: LevelId, tracks: readonly TrackId[], now = Date.now()): PetaJenjang {
  const dikenal = new Set(kompetensi.map((c) => c.id));
  const batasUlang = now - HARI_ULANG * 86400000;

  const pelajaran: PelajaranPeta[] = [];
  for (const track of tracks) {
    const daftar = kompetensi.filter((c) => c.level === level && c.track === track);
    if (!daftar.length) continue;

    const unitMap = new Map<string, UnitPeta>();
    let sekarang: MisiPeta | undefined;
    const inti: Hitungan = { dikuasai: 0, total: 0 };
    for (const c of daftar) {
      const status = statusDari(peng, c.id);
      const terbuka = c.prereq.every((p) => !dikenal.has(p) || statusDari(peng, p) !== "belum");
      const terakhir = peng[c.id]?.lastAt ? new Date(peng[c.id].lastAt!).getTime() : NaN;
      const misi: MisiPeta = { kompetensi: c, status, terbuka, sekarang: false, ulang: status === "dikuasai" && !Number.isNaN(terakhir) && terakhir < batasUlang };
      if (!sekarang && terbuka && status !== "dikuasai") {
        misi.sekarang = true;
        sekarang = misi;
      }
      if (c.core) {
        inti.total++;
        if (status === "dikuasai") inti.dikuasai++;
      }
      const u = unitMap.get(c.unit.id) ?? unitMap.set(c.unit.id, { id: c.unit.id, nama: c.unit.nama, misi: [], lencana: "terkunci" }).get(c.unit.id)!;
      u.misi.push(misi);
    }
    const unit = [...unitMap.values()].map((u) => ({ ...u, lencana: statusLencana(u.misi.filter((m) => m.kompetensi.core).map((m) => m.status)) }));
    pelajaran.push({ track, unit, inti, sekarang });
  }

  const inti = pelajaran.reduce<Hitungan>((a, p) => ({ dikuasai: a.dikuasai + p.inti.dikuasai, total: a.total + p.inti.total }), { dikuasai: 0, total: 0 });
  const rasio = (h: Hitungan) => (h.total ? h.dikuasai / h.total : 1);

  let lanjut: PetaJenjang["lanjut"];
  const kandidat = pelajaran.filter((p) => p.sekarang).sort((a, b) => rasio(a.inti) - rasio(b.inti) || tracks.indexOf(a.track) - tracks.indexOf(b.track));
  if (kandidat[0]) lanjut = { track: kandidat[0].track, misi: kandidat[0].sekarang! };
  else {
    const ulang = pelajaran
      .flatMap((p) => p.unit.flatMap((u) => u.misi.filter((m) => m.ulang).map((m) => ({ track: p.track, misi: m }))))
      .sort((a, b) => (peng[a.misi.kompetensi.id]?.lastAt ?? "").localeCompare(peng[b.misi.kompetensi.id]?.lastAt ?? ""));
    lanjut = ulang[0];
  }

  return { level, pelajaran, inti, tercapai: inti.total > 0 && inti.dikuasai === inti.total, lanjut };
}

/** Jenjang berikutnya yang sudah punya kurikulum; undefined bila tidak ada. */
export function jenjangBerikut(level: LevelId, kompetensi: Competency[]): LevelId | undefined {
  const ada = new Set(kompetensi.map((c) => c.level));
  return LEVEL_IDS.slice(levelIndex(level) + 1).find((l) => ada.has(l));
}

/** Paket untuk memainkan satu misi: paket jenjang yang sama dulu, lalu yang paling jarang dimulai, lalu id. */
export function paketMisi(competencyId: string, paket: ContentPack[], events: GameEvent[], level?: LevelId): ContentPack | undefined {
  const dimulai = new Map<string, number>();
  for (const e of events) if (e.type === "activity_start") dimulai.set(e.activityId, (dimulai.get(e.activityId) ?? 0) + 1);
  return paket
    .filter((p) => p.competencyIds.includes(competencyId))
    .sort((a, b) => Number(a.level !== level) - Number(b.level !== level) || (dimulai.get(a.id) ?? 0) - (dimulai.get(b.id) ?? 0) || a.id.localeCompare(b.id))[0];
}
