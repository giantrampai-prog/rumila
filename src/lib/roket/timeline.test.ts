import { describe, expect, it } from "vitest";
import { MISI, MISI_AUDIO, COUNTDOWN, COUNT_ONSETS } from "./misi";
import { MISSION_AUDIO_DURATION, MISSION_CUES, missionCueAt, missionDurations } from "./timeline";

describe("rocket narration choreography", () => {
  it("covers every recorded chapter without gaps or out-of-range captions", () => {
    const durations = missionDurations();
    MISI.forEach((chapter, i) => {
      const cues = MISSION_CUES[chapter.id];
      expect(cues[0].at).toBe(0);
      cues.forEach((cue, k) => {
        expect(cue.at).toBeLessThan(durations[i]);
        if (k) expect(cue.at).toBeGreaterThan(cues[k - 1].at);
        expect(chapter.lines[cue.line]).toBeTruthy();
        expect(missionCueAt(i, cue.at + 0.001).target).toBe(cue.target);
        if (k) expect(missionCueAt(i, cue.at - 0.001).target).toBe(cues[k - 1].target);
      });
    });
    expect(durations.reduce((a, b) => a + b, 0)).toBeCloseTo(MISSION_AUDIO_DURATION);
  });

  it("moves to the rocket at its spoken introduction, then the tower", () => {
    expect(missionCueAt(0, 11.81).target).toBe("landasan");
    expect(missionCueAt(0, 11.82).title).toBe("Kenali roket kita");
    expect(missionCueAt(0, 17.11).target).toBe("menara");
    expect(missionCueAt(0, 24).target).toBe("roket");
  });

  it("resolves backward seeks independently of previously visited chapters", () => {
    const chapter = MISI.findIndex(s => s.id === "termosfer");
    expect(missionCueAt(chapter, 12).target).toBe("stasiun");
    expect(missionCueAt(chapter, 6).target).toBe("aurora");
    expect(missionCueAt(chapter, 0).target).toBe("orbit");
    expect(missionCueAt(0, 0).key).toBe("landasan:0");
  });

  it("keeps countdown and chapter seeking anchored to recorded timestamps", () => {
    expect(missionCueAt(COUNTDOWN, COUNT_ONSETS[0]).line).toBe(1);
    const durations = missionDurations();
    MISI_AUDIO[0].cues.forEach((start, i) => {
      expect(durations.slice(0, i).reduce((a, b) => a + b, 0)).toBeCloseTo(start);
    });
  });

  it("scales cue positions for text-only playback without overrunning the last cue", () => {
    const duration = missionDurations()[0];
    expect(missionCueAt(0, 13 * 2, duration * 2).key).toBe(missionCueAt(0, 13).key);
    expect(missionCueAt(0, -10).key).toBe("landasan:0");
    expect(missionCueAt(0, 9999).key).toBe("landasan:3");
  });
});
