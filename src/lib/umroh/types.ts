export const STAGE_IDS = [
  "persiapan", "miqat", "perjalanan", "masuk", "tawaf",
  "salat", "zamzam", "sai", "tahallul", "selesai",
] as const;

export type UmrohStage = (typeof STAGE_IDS)[number];
export type UmrohRoute = "madinah" | "pesawat";
export type UmrohPilgrim = "putra" | "putri";

export interface UmrohStageContent {
  id: UmrohStage;
  title: string;
  subtitle: string;
  instruction: string;
  detail: string;
  action: string;
  kind: "lesson" | "tawaf" | "sai" | "finish";
  dua?: { arabic: string; latin: string; meaning: string };
}

export interface UmrohProgress {
  version: 1;
  route: UmrohRoute;
  pilgrim: UmrohPilgrim;
  stage: UmrohStage;
  /** Elapsed active simulation time in the current practice, not wall-clock time. */
  elapsedSeconds: number;
  /** Completed tawaf circuits or one-way sa'i legs in the current practice. */
  count: number;
}
