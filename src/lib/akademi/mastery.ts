// Proyeksi penguasaan kompetensi dari event belajar — fungsi murni, tanpa DOM / React.
// Bukti = event "attempt" yang payload-nya menyebut competencyIds.
//   konteks  = activityId berbeda di antara percobaan benar (event imported → satu konteks "import")
//   hari     = tanggal lokal (id-ID) berbeda di antara percobaan benar
//   ratio    = benar / semua pada 10 percobaan terakhir
//   hintTail = percobaan berturut-turut dari akhir yang memakai bantuan
// Aturan = DEFAULT_MASTERY ditimpa c.mastery.

import { DEFAULT_MASTERY, type Competency, type GameEvent, type LevelId, type MasteryRule, type TrackId } from "@akademi/schema";

export type Status = "belum" | "berkembang" | "dikuasai";

export interface Penguasaan {
  status: Status;
  success: number;
  fail: number;
  contexts: number;
  days: number;
  ratioLast10: number;
  lastAt?: string;
  hintTail: number;
}

interface Bukti {
  at: string;
  correct: boolean;
  hintUsed: boolean;
  konteks: string;
}

const KOSONG: Penguasaan = { status: "belum", success: 0, fail: 0, contexts: 0, days: 0, ratioLast10: 0, hintTail: 0 };

/** Tanggal lokal yang konsisten untuk hitungan "hari berbeda". */
export function hariLokal(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso.slice(0, 10) : d.toLocaleDateString("id-ID");
}

function kumpulkanBukti(events: GameEvent[]): Map<string, Bukti[]> {
  const per = new Map<string, Bukti[]>();
  const urut = events
    .filter((e) => e.type === "attempt")
    .slice()
    .sort((a, b) => (a.clientAt < b.clientAt ? -1 : a.clientAt > b.clientAt ? 1 : 0));
  for (const e of urut) {
    const p = e.payload as { correct?: unknown; hintUsed?: unknown; competencyIds?: unknown; imported?: unknown };
    if (!Array.isArray(p.competencyIds) || p.competencyIds.length === 0) continue;
    const b: Bukti = {
      at: e.clientAt,
      correct: p.correct === true,
      hintUsed: p.hintUsed === true,
      konteks: p.imported === true ? "import" : e.activityId,
    };
    for (const cid of p.competencyIds) {
      if (typeof cid !== "string") continue;
      const arr = per.get(cid);
      if (arr) arr.push(b);
      else per.set(cid, [b]);
    }
  }
  return per;
}

export function nilaiPenguasaan(bukti: Bukti[], aturan: MasteryRule): Penguasaan {
  if (!bukti.length) return { ...KOSONG };
  const benar = bukti.filter((b) => b.correct);
  const success = benar.length;
  const fail = bukti.length - success;
  const contexts = new Set(benar.map((b) => b.konteks)).size;
  const days = new Set(benar.map((b) => hariLokal(b.at))).size;
  const last10 = bukti.slice(-10);
  const ratioLast10 = last10.filter((b) => b.correct).length / last10.length;
  let hintTail = 0;
  for (let i = bukti.length - 1; i >= 0 && bukti[i].hintUsed; i--) hintTail++;
  const lastAt = bukti[bukti.length - 1].at;

  const ekor = bukti.slice(-aturan.noHintLast);
  const tanpaHint = aturan.noHintLast === 0 || (hintTail === 0 && ekor.length >= aturan.noHintLast && ekor.every((b) => !b.hintUsed));
  const dikuasai =
    success >= aturan.minSuccess && contexts >= aturan.minContexts && days >= aturan.minDays && ratioLast10 >= aturan.minRatioLast10 && tanpaHint;
  const status: Status = dikuasai ? "dikuasai" : success >= 1 ? "berkembang" : "belum";
  return { status, success, fail, contexts, days, ratioLast10, lastAt, hintTail };
}

export function aturanUntuk(c: Competency): MasteryRule {
  return { ...DEFAULT_MASTERY, ...(c.mastery ?? {}) };
}

/** Penguasaan tiap kompetensi (kompetensi tanpa bukti → "belum" dengan angka 0). */
export function proyeksi(events: GameEvent[], kompetensi: Competency[]): Record<string, Penguasaan> {
  const bukti = kumpulkanBukti(events);
  const out: Record<string, Penguasaan> = {};
  for (const c of kompetensi) out[c.id] = nilaiPenguasaan(bukti.get(c.id) ?? [], aturanUntuk(c));
  return out;
}

export interface RingkasanTrack {
  total: number;
  dikuasai: number;
  berkembang: number;
  belum: number;
  coreDikuasai: number;
  coreTotal: number;
}

/** Ringkasan satu track × level untuk Rapor / lencana. */
export function ringkasTrack(peng: Record<string, Penguasaan>, kompetensi: Competency[], track: TrackId, level: LevelId): RingkasanTrack {
  const r: RingkasanTrack = { total: 0, dikuasai: 0, berkembang: 0, belum: 0, coreDikuasai: 0, coreTotal: 0 };
  for (const c of kompetensi) {
    if (c.track !== track || c.level !== level) continue;
    const s = peng[c.id]?.status ?? "belum";
    r.total++;
    r[s]++;
    if (c.core) {
      r.coreTotal++;
      if (s === "dikuasai") r.coreDikuasai++;
    }
  }
  return r;
}
