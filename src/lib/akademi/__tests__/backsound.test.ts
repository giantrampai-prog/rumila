import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { LAGU, laguUntuk } from "../backsound";

describe("backsound per jenjang", () => {
  it("PAUD–TK ceria, SD1–3 sd-awal, SD4–6 fokus", () => {
    for (const lv of ["PAUD", "TKA", "TKB"] as const) expect(laguUntuk(lv)).toBe(LAGU.ceria);
    for (const lv of ["SD1", "SD2", "SD3"] as const) expect(laguUntuk(lv)).toBe(LAGU["sd-awal"]);
    for (const lv of ["SD4", "SD5", "SD6"] as const) expect(laguUntuk(lv)).toBe(LAGU.fokus);
  });
  it("berkas lagu ada di public/", () => {
    for (const l of Object.values(LAGU)) expect(existsSync(`public${l.src}`), l.src).toBe(true);
  });
});
