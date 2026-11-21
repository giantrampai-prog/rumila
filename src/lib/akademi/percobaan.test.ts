import { describe, expect, it } from "vitest";
import type { GameEvent } from "@akademi/schema";
import { percobaanUlang } from "./percobaan";

const ev = (detail?: Record<string, unknown>) => ({ type: "attempt", payload: { correct: true, detail } }) as unknown as GameEvent;

describe("percobaanUlang", () => {
  it("hanya percobaan kedua dst. yang dianggap ulangan", () => {
    expect(percobaanUlang(ev())).toBe(false);
    expect(percobaanUlang(ev({ percobaan: 1 }))).toBe(false);
    expect(percobaanUlang(ev({ percobaan: 2 }))).toBe(true);
    expect(percobaanUlang(ev({ percobaan: 5 }))).toBe(true);
  });
});
