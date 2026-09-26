import { describe, expect, it } from "vitest";
import { OBJ } from "../manifest";
import { TOUR, dwellSeconds, lineAt, lineSeconds } from "../tour";

describe("tur terbang", () => {
  it("setiap persinggahan merujuk objek manifest (kecuali intro/outro)", () => {
    for (const s of TOUR)
      if (s.id !== "intro" && s.id !== "outro")
        expect(OBJ.get(s.id), s.id).toBeTruthy();
    expect(TOUR[0].id).toBe("intro");
    expect(TOUR.at(-1)!.id).toBe("outro");
  });
  it("teks tidak kosong dan fakta terformat (tanpa undefined/NaN)", () => {
    for (const s of TOUR) {
      expect(s.lines.length).toBeGreaterThan(0);
      for (const l of s.lines) expect(l).not.toMatch(/undefined|NaN/);
    }
  });
  it("waktu singgah cukup untuk membaca dan lineAt konsisten", () => {
    for (const s of TOUR) {
      expect(dwellSeconds(s)).toBeGreaterThanOrEqual(4.5 * s.lines.length);
      expect(lineAt(s, 0)).toBe(0);
      expect(lineAt(s, dwellSeconds(s) + 1)).toBe(s.lines.length - 1);
      if (s.lines.length > 1)
        expect(lineAt(s, lineSeconds(s.lines[0]) + 0.01)).toBe(1);
    }
  });
});
