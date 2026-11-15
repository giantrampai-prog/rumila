import { describe, expect, it } from "vitest";
import {
  advanceJourneyTravel, advancePractice, completeLesson, createJourneyProgress, createProgress,
  finishPractice, getJourneyChapter, JOURNEY_CHAPTERS, nextJourneyChapter, parseJourneyProgress,
  SAI_LEG_SECONDS, serializeJourneyProgress, serializeProgress, STAGE_IDS, TAWAF_LAP_SECONDS,
  updateJourneyUmroh, type JourneyChapterId, type JourneyProgress, type UmrohProgress, type UmrohStage,
} from "..";

function completeUmroh(initial: UmrohProgress): UmrohProgress {
  let umroh = initial;
  while (umroh.stage !== "selesai") {
    umroh = umroh.stage === "tawaf" || umroh.stage === "sai"
      ? finishPractice(advancePractice(umroh, 1000)) : completeLesson(umroh);
  }
  return umroh;
}

function reachChapter(id: JourneyChapterId): JourneyProgress {
  let progress = createJourneyProgress("putri");
  while (progress.chapter !== id) {
    const chapter = getJourneyChapter(progress.chapter);
    if (chapter.kind === "travel") progress = advanceJourneyTravel(progress, 1000);
    if (chapter.kind === "umroh") progress = updateJourneyUmroh(progress, completeUmroh(progress.umroh));
    const next = nextJourneyChapter(progress);
    if (next === progress) throw new Error(`Unreachable chapter: ${id}`);
    progress = next;
  }
  return progress;
}

function reachUmrohStage(stage: UmrohStage): UmrohProgress {
  let umroh = createProgress("pesawat", "putri");
  while (umroh.stage !== stage) {
    umroh = umroh.stage === "tawaf" || umroh.stage === "sai"
      ? finishPractice(advancePractice(umroh, 1000)) : completeLesson(umroh);
  }
  return umroh;
}

describe("Indonesia round-trip journey", () => {
  it("starts at home and visits the complete outbound and return itinerary in order", () => {
    let progress = createJourneyProgress("putri");
    const seen: JourneyChapterId[] = [progress.chapter];
    expect(progress).toMatchObject({ version: 2, chapter: "rumah", travelSeconds: 0, umroh: { route: "madinah", pilgrim: "putri", stage: "persiapan" } });
    while (progress.chapter !== "rumah_selesai") {
      const chapter = getJourneyChapter(progress.chapter);
      if (chapter.kind === "travel") progress = advanceJourneyTravel(progress, chapter.durationSeconds!);
      if (chapter.kind === "umroh") progress = updateJourneyUmroh(progress, completeUmroh(progress.umroh));
      const next = nextJourneyChapter(progress);
      expect(next).not.toBe(progress);
      progress = next;
      seen.push(progress.chapter);
      expect(progress.travelSeconds).toBe(0);
      expect(progress.umroh.pilgrim).toBe("putri");
      expect(parseJourneyProgress(serializeJourneyProgress(progress))).toEqual(progress);
    }
    expect(seen).toEqual([
      "rumah", "taxi_cgk", "cgk", "cgk_imigrasi", "cgk_keamanan", "cgk_gate", "cgk_boarding", "garuda_jed", "jeddah", "haramain", "madinah_station",
      "uber_nabawi", "nabawi", "rawdah", "salam", "umroh", "makkah_jed", "jeddah_pulang",
      "garuda_cgk", "cgk_pulang", "taxi_rumah", "rumah_selesai",
    ]);
    expect(progress.umroh.stage).toBe("selesai");
    expect(nextJourneyChapter(progress)).toBe(progress);
  });

  it("walks through the Soekarno–Hatta departure step by step before boarding", () => {
    const airport = ["cgk", "cgk_imigrasi", "cgk_keamanan", "cgk_gate"] as const;
    for (const id of airport) {
      const chapter = getJourneyChapter(id);
      expect(chapter.kind).toBe("lesson");
      expect(chapter.steps?.length).toBeGreaterThanOrEqual(3);
    }
    expect(getJourneyChapter("cgk").steps?.at(-1)).toMatch(/boarding pass/);
    expect(getJourneyChapter("cgk_boarding").kind).toBe("travel");
    // A save made before the airport was split still resumes at check-in.
    const legacy = { ...createJourneyProgress(), chapter: "cgk" };
    expect(parseJourneyProgress(JSON.stringify(legacy))?.chapter).toBe("cgk");
    expect(nextJourneyChapter(legacy as JourneyProgress).chapter).toBe("cgk_imigrasi");
  });

  it.each(JOURNEY_CHAPTERS.filter((chapter) => chapter.kind === "travel"))(
    "waits for $id travel to finish and still requires acknowledgement",
    (chapter) => {
      const initial = reachChapter(chapter.id);
      expect(chapter.durationSeconds).toBeGreaterThanOrEqual(12);
      // Flights stage pushback, takeoff, cruise and landing, so they run longer than ground rides.
      expect(chapter.durationSeconds).toBeLessThanOrEqual(chapter.id.startsWith("garuda_") ? 180 : 20);
      expect(nextJourneyChapter(initial)).toBe(initial);
      const almost = advanceJourneyTravel(initial, chapter.durationSeconds! - 0.001);
      expect(nextJourneyChapter(almost)).toBe(almost);
      const complete = advanceJourneyTravel(almost, 0.001);
      expect(complete.chapter).toBe(initial.chapter);
      expect(complete.travelSeconds).toBe(chapter.durationSeconds);
      expect(nextJourneyChapter(complete).chapter).not.toBe(initial.chapter);
      expect(initial.travelSeconds).toBe(0);
    },
  );

  it("bounds travel time, ignores invalid deltas, and never accumulates time in a lesson", () => {
    const initial = reachChapter("taxi_cgk");
    for (const delta of [0, -1, NaN, Infinity, -Infinity]) expect(advanceJourneyTravel(initial, delta)).toBe(initial);
    const maximum = advanceJourneyTravel(initial, Number.MAX_VALUE);
    expect(maximum.travelSeconds).toBe(getJourneyChapter("taxi_cgk").durationSeconds);
    expect(advanceJourneyTravel(maximum, 1)).toBe(maximum);
    const lesson = createJourneyProgress();
    expect(advanceJourneyTravel(lesson, 10)).toBe(lesson);
    let fractional = initial;
    for (let i = 0; i < 140; i++) fractional = advanceJourneyTravel(fractional, 0.1);
    expect(fractional.travelSeconds).toBe(14);
    expect(nextJourneyChapter(fractional).chapter).toBe("cgk");
  });

  it("cannot start the return before both seven-part practices and tahallul are complete", () => {
    let journey = reachChapter("umroh");
    expect(nextJourneyChapter(journey)).toBe(journey);
    for (const stage of STAGE_IDS) {
      expect(journey.umroh.stage).toBe(stage);
      if (stage === "selesai") break;
      expect(nextJourneyChapter(journey)).toBe(journey);
      if (stage === "tawaf" || stage === "sai") {
        const duration = stage === "tawaf" ? TAWAF_LAP_SECONDS : SAI_LEG_SECONDS;
        journey = updateJourneyUmroh(journey, advancePractice(journey.umroh, duration * 7 - 0.001));
        expect(journey.umroh.count).toBe(6);
        expect(finishPractice(journey.umroh)).toBe(journey.umroh);
        expect(nextJourneyChapter(journey)).toBe(journey);
        journey = updateJourneyUmroh(journey, advancePractice(journey.umroh, 0.001));
        expect(journey.umroh.count).toBe(7);
        expect(nextJourneyChapter(journey)).toBe(journey);
        journey = updateJourneyUmroh(journey, finishPractice(journey.umroh));
      } else journey = updateJourneyUmroh(journey, completeLesson(journey.umroh));
    }
    expect(nextJourneyChapter(journey).chapter).toBe("makkah_jed");
  });

  it("confines nested changes to the umroh chapter and rejects route changes or corrupt counts", () => {
    const outbound = createJourneyProgress();
    expect(updateJourneyUmroh(outbound, completeLesson(outbound.umroh))).toBe(outbound);
    const returnTrip = reachChapter("makkah_jed");
    expect(updateJourneyUmroh(returnTrip, createProgress())).toBe(returnTrip);
    const ritual = reachChapter("umroh");
    expect(updateJourneyUmroh(ritual, ritual.umroh)).toBe(ritual);
    expect(updateJourneyUmroh(ritual, createProgress("pesawat"))).toBe(ritual);
    expect(updateJourneyUmroh(ritual, { ...ritual.umroh, count: 7 })).toBe(ritual);
    const updated = updateJourneyUmroh(ritual, completeLesson(ritual.umroh));
    expect(updated.umroh.stage).toBe("miqat");
    expect(ritual.umroh.stage).toBe("persiapan");
  });
});

describe("journey persistence and migration", () => {
  it("resumes partial transport and partial ritual without advancing time while away", () => {
    const travel = advanceJourneyTravel(reachChapter("haramain"), 7.125);
    expect(parseJourneyProgress(serializeJourneyProgress(travel))).toEqual(travel);
    const migrated = parseJourneyProgress(serializeProgress(advancePractice(reachUmrohStage("sai"), SAI_LEG_SECONDS * 2.625)))!;
    const restored = parseJourneyProgress(serializeJourneyProgress(migrated))!;
    expect(restored).toEqual(migrated);
    expect(restored.umroh).toMatchObject({ route: "pesawat", pilgrim: "putri", stage: "sai", count: 2, elapsedSeconds: 21 });
    expect(advancePractice(restored.umroh, SAI_LEG_SECONDS * 4.375).count).toBe(7);
  });

  it("migrates each legacy stage into umroh and preserves both routes including completed saves", () => {
    for (const stage of STAGE_IDS) {
      for (const route of ["madinah", "pesawat"] as const) {
        const legacy = { ...reachUmrohStage(stage), route };
        const migrated = parseJourneyProgress(serializeProgress(legacy))!;
        expect(migrated).toEqual({ version: 2, chapter: "umroh", travelSeconds: 0, umroh: legacy });
        expect(parseJourneyProgress(serializeJourneyProgress(migrated))).toEqual(migrated);
        if (stage === "selesai") {
          const returnTrip = nextJourneyChapter(migrated);
          expect(returnTrip.chapter).toBe("makkah_jed");
          expect(returnTrip.umroh.route).toBe(route);
          expect(parseJourneyProgress(serializeJourneyProgress(returnTrip))).toEqual(returnTrip);
        }
      }
    }
    const completeSeven = advancePractice(reachUmrohStage("tawaf"), 7 * TAWAF_LAP_SECONDS);
    const migrated = parseJourneyProgress(serializeProgress(completeSeven))!;
    expect(migrated.umroh).toEqual(completeSeven);
    expect(nextJourneyChapter(migrated)).toBe(migrated);
  });

  it("rejects malformed schemas, unknown chapters, and invalid elapsed values", () => {
    for (const raw of [null, undefined, "", "{", "null", "[]", "true", '"home"', " ".repeat(8193)]) expect(parseJourneyProgress(raw)).toBeNull();
    for (const change of [
      { version: 0 }, { version: 3 }, { version: "2" }, { chapter: "constructor" }, { chapter: null },
      { travelSeconds: "0" }, { travelSeconds: null }, { travelSeconds: -1 }, { umroh: null },
      { umroh: {} }, { umroh: { ...createProgress(), version: 2 } },
    ]) expect(parseJourneyProgress(JSON.stringify({ ...createJourneyProgress(), ...change }))).toBeNull();
    const overflow = serializeJourneyProgress(createJourneyProgress()).replace('"travelSeconds":0', '"travelSeconds":1e999');
    expect(parseJourneyProgress(overflow)).toBeNull();
    expect(parseJourneyProgress(JSON.stringify({ ...createProgress(), stage: "tawaf", count: 7 }))).toBeNull();
  });

  it("rejects chapter, route, ritual, and transport-time contradictions", () => {
    const initial = createJourneyProgress();
    const returnTrip = reachChapter("makkah_jed");
    const invalid = [
      { ...initial, travelSeconds: 0.1 },
      { ...initial, chapter: "taxi_cgk", travelSeconds: 14.001 },
      { ...initial, umroh: { ...initial.umroh, route: "pesawat" } },
      { ...initial, chapter: "nabawi", umroh: completeLesson(initial.umroh) },
      { ...initial, chapter: "salam", umroh: completeUmroh(initial.umroh) },
      { ...initial, chapter: "umroh", travelSeconds: 1 },
      { ...returnTrip, umroh: initial.umroh },
      { ...returnTrip, chapter: "rumah_selesai", umroh: { ...returnTrip.umroh, stage: "tahallul" } },
      { ...returnTrip, umroh: { ...returnTrip.umroh, count: 1 } },
    ];
    for (const value of invalid) expect(parseJourneyProgress(JSON.stringify(value))).toBeNull();
  });

  it("returns only schema fields at both levels", () => {
    const initial = createJourneyProgress();
    const saved = { ...initial, unlocked: true, umroh: { ...initial.umroh, completed: true } };
    expect(parseJourneyProgress(JSON.stringify(saved))).toEqual(initial);
  });
});
