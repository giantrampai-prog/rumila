import { describe, expect, it } from "vitest";
import {
  advancePractice, completeLesson, createProgress, finishPractice, getPracticeProgress,
  parseSavedProgress, restart, SAI_LEG_SECONDS, serializeProgress, STAGE_IDS, TAWAF_LAP_SECONDS,
  type UmrohProgress, type UmrohStage,
} from "..";

function reach(stage: UmrohStage): UmrohProgress {
  let progress = createProgress("pesawat", "putri");
  while (progress.stage !== stage) {
    if (progress.stage === "tawaf" || progress.stage === "sai") {
      progress = finishPractice(advancePractice(progress, 1000));
    } else {
      const next = completeLesson(progress);
      if (next === progress) throw new Error(`Unreachable stage: ${stage}`);
      progress = next;
    }
  }
  return progress;
}

describe("umroh learning progress", () => {
  it("visits the complete route in order without losing the selected route or pilgrim", () => {
    let progress = createProgress("pesawat", "putri");
    const seen: UmrohStage[] = [progress.stage];
    while (progress.stage !== "selesai") {
      progress = progress.stage === "tawaf" || progress.stage === "sai"
        ? finishPractice(advancePractice(progress, 1000))
        : completeLesson(progress);
      seen.push(progress.stage);
      expect(progress.route).toBe("pesawat");
      expect(progress.pilgrim).toBe("putri");
      expect(progress.count).toBe(0);
      expect(progress.elapsedSeconds).toBe(0);
    }
    expect(seen).toEqual(STAGE_IDS);
    expect(completeLesson(progress)).toBe(progress);
    expect(finishPractice(progress)).toBe(progress);
    expect(advancePractice(progress, 100)).toBe(progress);
  });

  it.each(["tawaf", "sai"] as const)("cannot skip %s by acknowledging a lesson or leaving before seven", (stage) => {
    const progress = reach(stage);
    const duration = stage === "tawaf" ? TAWAF_LAP_SECONDS : SAI_LEG_SECONDS;
    expect(completeLesson(progress)).toBe(progress);
    expect(finishPractice(progress)).toBe(progress);
    const almost = advancePractice(progress, 7 * duration - 0.001);
    expect(almost.count).toBe(6);
    expect(finishPractice(almost)).toBe(almost);
    const complete = advancePractice(almost, 0.001);
    expect(complete.count).toBe(7);
    expect(complete.stage).toBe(stage); // Completing the motion still needs acknowledgement.
    expect(finishPractice(complete).stage).toBe(stage === "tawaf" ? "salat" : "tahallul");
  });

  it("counts only complete tawaf circuits and exposes counter-clockwise travel", () => {
    const progress = reach("tawaf");
    expect(getPracticeProgress(advancePractice(progress, TAWAF_LAP_SECONDS / 2))).toMatchObject({
      count: 0, direction: "counter-clockwise", position: 0.5, finished: false,
    });
    const one = advancePractice(progress, TAWAF_LAP_SECONDS);
    expect(one.count).toBe(1);
    expect(getPracticeProgress(one).position).toBe(0);
    expect(getPracticeProgress(advancePractice(progress, 7 * TAWAF_LAP_SECONDS))).toMatchObject({
      count: 7, position: 0, fraction: 1, finished: true,
    });
  });

  it("counts Safa→Marwah as one, returns as two, and finishes the seventh at Marwah", () => {
    const initial = reach("sai");
    expect(getPracticeProgress(initial)).toMatchObject({ count: 0, direction: "safa-to-marwah", position: 0 });
    for (let leg = 1; leg <= 7; leg++) {
      const progress = advancePractice(initial, leg * SAI_LEG_SECONDS);
      const visual = getPracticeProgress(progress);
      expect(progress.count).toBe(leg);
      expect(visual.position).toBe(leg % 2);
      if (leg < 7) expect(visual.direction).toBe(leg % 2 ? "marwah-to-safa" : "safa-to-marwah");
    }
    expect(getPracticeProgress(advancePractice(initial, SAI_LEG_SECONDS * 1.5))).toMatchObject({ count: 1, direction: "marwah-to-safa", position: 0.5 });
    expect(getPracticeProgress(advancePractice(initial, 7 * SAI_LEG_SECONDS))).toMatchObject({ count: 7, direction: "safa-to-marwah", position: 1, finished: true });
  });

  it("bounds a long update at seven and discards negative, non-finite, and zero updates", () => {
    const progress = reach("tawaf");
    for (const delta of [-1, -Infinity, Infinity, NaN, 0]) expect(advancePractice(progress, delta)).toBe(progress);
    const complete = advancePractice(progress, Number.MAX_VALUE);
    expect(complete.elapsedSeconds).toBe(7 * TAWAF_LAP_SECONDS);
    expect(complete.count).toBe(7);
    expect(advancePractice(complete, 100)).toBe(complete);
    expect(advancePractice(createProgress(), 100)).toEqual(createProgress());
  });

  it("does not mutate earlier state and resolves fractional accumulated time at a circuit boundary", () => {
    const initial = reach("tawaf");
    let progress = initial;
    for (let tick = 0; tick < 100; tick++) progress = advancePractice(progress, 0.1);
    expect(progress.count).toBe(1);
    expect(progress.elapsedSeconds).toBe(TAWAF_LAP_SECONDS);
    expect(initial.elapsedSeconds).toBe(0);
    expect(initial.count).toBe(0);
  });

  it("restart discards progress while preserving the selected journey", () => {
    expect(restart(reach("selesai"))).toEqual(createProgress("pesawat", "putri"));
  });
});

describe("saved umroh progress", () => {
  it("round-trips every reachable stage and interrupted practice", () => {
    for (const stage of STAGE_IDS) {
      const progress = reach(stage);
      expect(parseSavedProgress(serializeProgress(progress))).toEqual(progress);
    }
    const partial = advancePractice(reach("sai"), SAI_LEG_SECONDS * 2.625);
    expect(parseSavedProgress(serializeProgress(partial))).toEqual(partial);
    const restored = parseSavedProgress(serializeProgress(partial))!;
    expect(advancePractice(restored, SAI_LEG_SECONDS * 4.375).count).toBe(7);
  });

  it("rejects invalid JSON, unsupported schemas, invalid selections, and non-finite values", () => {
    for (const raw of [null, undefined, "", "{", "null", "[]", "true", '"hello"', " ".repeat(4097)]) {
      expect(parseSavedProgress(raw)).toBeNull();
    }
    for (const change of [
      { version: 0 }, { version: 2 }, { version: "1" }, { route: "makkah" }, { pilgrim: "other" },
      { stage: "constructor" }, { stage: null }, { elapsedSeconds: "0" }, { elapsedSeconds: -1 },
      { elapsedSeconds: null }, { count: 0.5 }, { count: -1 }, { count: 8 },
    ]) expect(parseSavedProgress(JSON.stringify({ ...createProgress(), ...change }))).toBeNull();
    expect(parseSavedProgress('{"version":1,"route":"madinah","pilgrim":"putra","stage":"tawaf","count":0,"elapsedSeconds":1e999}')).toBeNull();
  });

  it("rejects inconsistent lesson data, impossible circuit counts, and practice beyond seven", () => {
    const cases = [
      { ...createProgress(), elapsedSeconds: 1 },
      { ...createProgress(), count: 1 },
      { ...reach("tawaf"), elapsedSeconds: 1, count: 7 },
      { ...reach("tawaf"), elapsedSeconds: TAWAF_LAP_SECONDS, count: 0 },
      { ...reach("sai"), elapsedSeconds: SAI_LEG_SECONDS * 8, count: 7 },
    ];
    for (const value of cases) expect(parseSavedProgress(JSON.stringify(value))).toBeNull();
  });

  it("returns only supported fields rather than trusting arbitrary saved properties", () => {
    const saved = JSON.stringify({ ...createProgress(), completed: true, scripts: ["unexpected"] });
    expect(parseSavedProgress(saved)).toEqual(createProgress());
  });
});
