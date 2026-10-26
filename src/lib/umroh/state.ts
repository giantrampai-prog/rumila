import { STAGES } from "./content";
import { STAGE_IDS, type UmrohPilgrim, type UmrohProgress, type UmrohRoute } from "./types";

export const TAWAF_LAP_SECONDS = 10;
export const SAI_LEG_SECONDS = 8;
export const PRACTICE_COUNT = 7;
export const PROGRESS_STORAGE_KEY = "rumila.umroh.progress.v1";

export function createProgress(route: UmrohRoute = "madinah", pilgrim: UmrohPilgrim = "putra"): UmrohProgress {
  return { version: 1, route, pilgrim, stage: "persiapan", elapsedSeconds: 0, count: 0 };
}

function lapDuration(progress: UmrohProgress): number | null {
  return progress.stage === "tawaf" ? TAWAF_LAP_SECONDS : progress.stage === "sai" ? SAI_LEG_SECONDS : null;
}

function countAt(elapsedSeconds: number, duration: number): number {
  return Math.min(PRACTICE_COUNT, Math.floor((elapsedSeconds + 1e-9) / duration));
}

function nextStage(progress: UmrohProgress): UmrohProgress {
  const next = STAGE_IDS[STAGE_IDS.indexOf(progress.stage) + 1];
  return next ? { ...progress, stage: next, elapsedSeconds: 0, count: 0 } : progress;
}

/** Lesson acknowledgement never bypasses either seven-part practice. */
export function completeLesson(progress: UmrohProgress): UmrohProgress {
  return STAGES.find((stage) => stage.id === progress.stage)?.kind === "lesson" ? nextStage(progress) : progress;
}

/** Caller supplies active, unpaused time; no clock runs while the page is closed. */
export function advancePractice(progress: UmrohProgress, deltaSeconds: number): UmrohProgress {
  const duration = lapDuration(progress);
  if (!duration || !Number.isFinite(deltaSeconds) || deltaSeconds <= 0) return progress;
  const maximum = PRACTICE_COUNT * duration;
  // Round the bounded result, not the incoming delta, to avoid overflow on a large finite delta.
  const elapsedSeconds = Math.round(Math.min(maximum, progress.elapsedSeconds + deltaSeconds) * 1e6) / 1e6;
  if (elapsedSeconds === progress.elapsedSeconds) return progress;
  return { ...progress, elapsedSeconds, count: countAt(elapsedSeconds, duration) };
}

export function finishPractice(progress: UmrohProgress): UmrohProgress {
  const duration = lapDuration(progress);
  return duration && progress.elapsedSeconds >= PRACTICE_COUNT * duration && progress.count === PRACTICE_COUNT
    ? nextStage(progress)
    : progress;
}

export function restart(progress: UmrohProgress): UmrohProgress {
  return createProgress(progress.route, progress.pilgrim);
}

export interface PracticeProgress {
  count: number;
  /** Fraction of the entire seven-part exercise, from 0 to 1. */
  fraction: number;
  finished: boolean;
  direction: "counter-clockwise" | "safa-to-marwah" | "marwah-to-safa" | null;
  /** Tawaf loop phase, or sa'i position with Safa=0 and Marwah=1. */
  position: number;
}

export function getPracticeProgress(progress: UmrohProgress): PracticeProgress {
  const duration = lapDuration(progress);
  if (!duration) return { count: 0, fraction: 0, finished: false, direction: null, position: 0 };
  const total = Math.max(0, Math.min(PRACTICE_COUNT, progress.elapsedSeconds / duration));
  const finished = total >= PRACTICE_COUNT;
  if (progress.stage === "tawaf") {
    return { count: countAt(progress.elapsedSeconds, duration), fraction: total / PRACTICE_COUNT, finished, direction: "counter-clockwise", position: finished ? 0 : total % 1 };
  }
  const leg = finished ? PRACTICE_COUNT - 1 : Math.floor(total);
  const fraction = finished ? 1 : total - leg;
  const outbound = leg % 2 === 0;
  return { count: countAt(progress.elapsedSeconds, duration), fraction: total / PRACTICE_COUNT, finished,
    direction: outbound ? "safa-to-marwah" : "marwah-to-safa", position: outbound ? fraction : 1 - fraction };
}

/** Reject old versions, malformed numbers, and inconsistent count/time combinations. */
export function parseSavedProgress(raw: string | null | undefined): UmrohProgress | null {
  if (typeof raw !== "string" || raw.length > 4096) return null;
  let value: unknown;
  try { value = JSON.parse(raw); } catch { return null; }
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const saved = value as Record<string, unknown>;
  if (saved.version !== 1 || (saved.route !== "madinah" && saved.route !== "pesawat")
    || (saved.pilgrim !== "putra" && saved.pilgrim !== "putri")
    || !STAGE_IDS.some((id) => id === saved.stage)
    || typeof saved.elapsedSeconds !== "number" || !Number.isFinite(saved.elapsedSeconds) || saved.elapsedSeconds < 0
    || typeof saved.count !== "number" || !Number.isInteger(saved.count) || saved.count < 0 || saved.count > PRACTICE_COUNT) return null;
  const progress: UmrohProgress = { version: 1, route: saved.route, pilgrim: saved.pilgrim,
    stage: saved.stage as UmrohProgress["stage"], elapsedSeconds: saved.elapsedSeconds, count: saved.count };
  const duration = lapDuration(progress);
  if (duration) {
    if (progress.elapsedSeconds > PRACTICE_COUNT * duration || progress.count !== countAt(progress.elapsedSeconds, duration)) return null;
  } else if (progress.elapsedSeconds !== 0 || progress.count !== 0) return null;
  return progress;
}

export function serializeProgress(progress: UmrohProgress): string {
  return JSON.stringify(progress);
}
