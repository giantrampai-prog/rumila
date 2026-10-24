// Koleksi murid: stiker (paket selesai), lencana (per unit), pangkat (per jenjang) — fungsi murni, tanpa React/DOM.

import { ACTIVE_LEVELS, LEVELS, type Competency, type ContentPack, type GameEvent, type LevelId, type TrackId } from "@akademi/schema";
import type { Penguasaan, Status } from "./mastery";

/** Ambang "selesai dengan baik" untuk stiker. */
export const AMBANG_STIKER = 0.6;

export interface Stiker {
  paketId: string;
  /** Waktu penyelesaian pertama (clientAt). */
  pertamaAt: string;
  /** Jumlah penyelesaian yang lolos ambang. */
  kali: number;
}

export type StatusLencana = "terkunci" | "perunggu" | "perak" | "emas";

export interface Lencana {
  track: TrackId;
  level: LevelId;
  unitId: string;
  nama: string;
  status: StatusLencana;
}

export interface Pangkat {
  level: LevelId;
  nama: string;
  /** coreDikuasai / coreTotal (0–1); 0 bila jenjang tanpa kompetensi inti. */
  progres: number;
  tercapai: boolean;
}

/** Rasio sukses satu event activity_end; null bila tidak ada hitungan. */
function rasioSukses(e: GameEvent): number | null {
  const p = e.payload as { successCount?: unknown; failCount?: unknown };
  const s = typeof p.successCount === "number" ? p.successCount : 0;
  const f = typeof p.failCount === "number" ? p.failCount : 0;
  return s + f === 0 ? null : s / (s + f);
}

/**
 * Satu stiker per paket yang pernah selesai dengan rasio sukses ≥ 60% (event activity_end).
 * Urut terbaru dulu (menurut penyelesaian terakhir). Paket yang tidak ada di katalog dilewati.
 */
export function stiker(events: GameEvent[], paket: ContentPack[]): Stiker[] {
  const ada = new Set(paket.map((p) => p.id));
  const map = new Map<string, Stiker & { terakhirAt: string }>();
  for (const e of events) {
    if (e.type !== "activity_end" || !ada.has(e.activityId)) continue;
    const r = rasioSukses(e);
    if (r === null || r < AMBANG_STIKER) continue;
    const s = map.get(e.activityId);
    if (!s) map.set(e.activityId, { paketId: e.activityId, pertamaAt: e.clientAt, terakhirAt: e.clientAt, kali: 1 });
    else {
      s.kali++;
      if (e.clientAt < s.pertamaAt) s.pertamaAt = e.clientAt;
      if (e.clientAt > s.terakhirAt) s.terakhirAt = e.clientAt;
    }
  }
  return [...map.values()]
    .sort((a, b) => (a.terakhirAt < b.terakhirAt ? 1 : a.terakhirAt > b.terakhirAt ? -1 : 0))
    .map(({ paketId, pertamaAt, kali }) => ({ paketId, pertamaAt, kali }));
}

/** Status lencana dari daftar status kompetensi inti satu unit. */
export function statusLencana(inti: Status[]): StatusLencana {
  if (inti.length === 0) return "terkunci";
  const dik = inti.filter((s) => s === "dikuasai").length;
  const naik = inti.filter((s) => s !== "belum").length;
  if (dik === inti.length) return "emas";
  if (naik === inti.length && dik >= 1) return "perak";
  if (naik >= 1) return "perunggu";
  return "terkunci";
}

/**
 * Lencana per unit (track × level × unit.id), urut kemunculan kompetensi.
 * Emas: semua inti dikuasai · Perak: semua inti ≥ berkembang dan ≥ 1 dikuasai · Perunggu: ≥ 1 inti berkembang · Terkunci: selain itu.
 * Unit tanpa kompetensi inti → terkunci.
 */
export function lencana(peng: Record<string, Penguasaan>, kompetensi: Competency[]): Lencana[] {
  const map = new Map<string, { meta: Omit<Lencana, "status">; inti: Status[] }>();
  for (const c of kompetensi) {
    const key = `${c.track}|${c.level}|${c.unit.id}`;
    const g = map.get(key) ?? map.set(key, { meta: { track: c.track, level: c.level, unitId: c.unit.id, nama: c.unit.nama.id }, inti: [] }).get(key)!;
    if (c.core) g.inti.push(peng[c.id]?.status ?? "belum");
  }
  return [...map.values()].map(({ meta, inti }) => ({ ...meta, status: statusLencana(inti) }));
}

/** Jenjang yang punya pangkat (PAUD/TKA/TKB). */
export const LEVEL_PANGKAT: readonly LevelId[] = ACTIVE_LEVELS;

/**
 * Pangkat per jenjang: progres = kompetensi inti dikuasai / seluruh inti jenjang (semua track);
 * tercapai bila semua inti jenjang dikuasai (dan ada minimal satu inti).
 */
export function pangkat(peng: Record<string, Penguasaan>, kompetensi: Competency[], level: readonly LevelId[] = LEVEL_PANGKAT): Pangkat[] {
  return level.map((lv) => {
    const meta = LEVELS.find((l) => l.id === lv);
    let total = 0;
    let dik = 0;
    for (const c of kompetensi) {
      if (c.level !== lv || !c.core) continue;
      total++;
      if (peng[c.id]?.status === "dikuasai") dik++;
    }
    return { level: lv, nama: meta?.pangkat ?? "", progres: total ? dik / total : 0, tercapai: total > 0 && dik === total };
  });
}
