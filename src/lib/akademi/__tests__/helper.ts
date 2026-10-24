// Pembuat kompetensi, paket, dan event dummy untuk tes mastery/misi.
import type { Competency, ContentPack, GameEvent, LevelId, MasteryRule } from "@akademi/schema";

export const LEARNER = "11111111-1111-4111-8111-111111111111";
export const SESSION = "22222222-2222-4222-8222-222222222222";

let n = 0;
export const idBaru = () => {
  n++;
  const h = n.toString(16).padStart(12, "0");
  return `33333333-3333-4333-8333-${h}`;
};

export function kompetensi(id: string, o: Partial<Pick<Competency, "prereq" | "core" | "level" | "track">> & { mastery?: Partial<MasteryRule> } = {}): Competency {
  const [track, level, unit] = id.split(".");
  return {
    id,
    track: (o.track ?? track) as Competency["track"],
    level: (o.level ?? level) as LevelId,
    unit: { id: unit, nama: { id: unit, en: unit } },
    statement: { id: `Aku bisa ${id}`, en: `I can ${id}` },
    depth: ["pakai"],
    prereq: o.prereq ?? [],
    refs: [],
    core: o.core ?? false,
    mastery: o.mastery,
    mechanics: ["pilah"],
  };
}

export function paket(id: string, level: LevelId, competencyIds: string[]): ContentPack {
  return {
    id,
    version: "1.0.0",
    level,
    competencyIds,
    instructionKey: "instr",
    locale: { id: { instr: "x" }, en: { instr: "x" } },
    knobs: {},
    assets: [],
    generatif: true,
    rounds: 5,
    world: "kebun-pasar",
    mechanic: "pilah",
    mode: "kelompok",
    bins: [],
    items: [],
    pilihan: [],
  } as unknown as ContentPack;
}

export interface OpsiAttempt {
  correct?: boolean;
  hintUsed?: boolean;
  activityId?: string;
  /** hari ke-n (0 = 1 Jan 2026 pukul 10:00 lokal), bisa pecahan untuk jam berbeda */
  hari?: number;
  imported?: boolean;
  learnerId?: string;
}

const dasar = new Date(2026, 0, 1, 10, 0, 0).getTime();
export const waktuHari = (hari: number) => new Date(dasar + hari * 86400000).toISOString();

export function attempt(competencyIds: string[], o: OpsiAttempt = {}): GameEvent {
  return {
    id: idBaru(),
    learnerId: o.learnerId ?? LEARNER,
    sessionId: SESSION,
    activityId: o.activityId ?? "paket-a",
    mechanic: "pilah",
    type: "attempt",
    clientAt: waktuHari(o.hari ?? 0),
    payload: {
      itemId: "item",
      correct: o.correct ?? true,
      hintUsed: o.hintUsed ?? false,
      latencyMs: 100,
      competencyIds,
      ...(o.imported ? { imported: true } : {}),
    },
  };
}

export function mulai(activityId: string, hari = 0, learnerId = LEARNER): GameEvent {
  return { id: idBaru(), learnerId, sessionId: SESSION, activityId, mechanic: "pilah", type: "activity_start", clientAt: waktuHari(hari), payload: {} };
}

/** n percobaan benar tersebar di n hari & dua paket berbeda (cukup untuk dikuasai dengan aturan default). */
export function buktiKuat(cid: string, n = 4): GameEvent[] {
  return Array.from({ length: n }, (_, i) => attempt([cid], { hari: i, activityId: i % 2 ? "paket-b" : "paket-a" }));
}
