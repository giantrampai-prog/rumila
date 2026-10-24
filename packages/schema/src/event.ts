// Event belajar: append-only, dibuat di klien, idempoten saat sinkron.

import { z } from "zod";

const Uuid = z.string().uuid();

export const EventType = z.enum(["activity_start", "attempt", "hint", "activity_end", "quest_end"]);
export type EventType = z.infer<typeof EventType>;

export const AttemptPayload = z.object({
  itemId: z.string().min(1),
  correct: z.boolean(),
  hintUsed: z.boolean().default(false),
  latencyMs: z.number().int().min(0),
  /** knob yang aktif saat percobaan, untuk analisis kesulitan */
  knobs: z.record(z.string(), z.number()).optional(),
  seed: z.number().int().optional(),
});

export const ActivityEndPayload = z.object({
  outcome: z.enum(["selesai", "berhenti", "habis_waktu"]),
  successCount: z.number().int().min(0),
  failCount: z.number().int().min(0),
  hintCount: z.number().int().min(0),
  durationMs: z.number().int().min(0),
});

export const GameEvent = z.object({
  id: Uuid,
  learnerId: Uuid,
  sessionId: Uuid,
  activityId: z.string().min(1),
  mechanic: z.string().min(1),
  type: EventType,
  payload: z.record(z.string(), z.unknown()).default({}),
  clientAt: z.string().datetime(),
}).superRefine((e, ctx) => {
  if (e.type === "attempt") {
    const r = AttemptPayload.safeParse(e.payload);
    if (!r.success) ctx.addIssue({ code: "custom", path: ["payload"], message: "payload attempt tidak valid: " + r.error.issues.map(i => i.message).join("; ") });
  }
  if (e.type === "activity_end") {
    const r = ActivityEndPayload.safeParse(e.payload);
    if (!r.success) ctx.addIssue({ code: "custom", path: ["payload"], message: "payload activity_end tidak valid: " + r.error.issues.map(i => i.message).join("; ") });
  }
});
export type GameEvent = z.infer<typeof GameEvent>;
