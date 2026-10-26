import { describe, expect, it } from "vitest";
import { getStageContent, STAGES, STAGE_IDS } from "..";

describe("umroh teaching copy", () => {
  it("contains all ten ordered steps and distinct seven-part exercises", () => {
    expect(STAGES.map((stage) => stage.id)).toEqual(STAGE_IDS);
    expect(STAGES.filter((stage) => stage.kind === "tawaf").map((stage) => stage.id)).toEqual(["tawaf"]);
    expect(STAGES.filter((stage) => stage.kind === "sai").map((stage) => stage.id)).toEqual(["sai"]);
    expect(STAGES.at(-1)?.kind).toBe("finish");
  });

  it("keeps sunnah lessons distinct from the pillars and never scores religious merit", () => {
    expect(getStageContent("salat", "madinah", "putra").detail).toMatch(/sunah, bukan rukun/i);
    expect(getStageContent("zamzam", "madinah", "putra").detail).toMatch(/sunah/i);
    expect(getStageContent("sai", "madinah", "putra").detail).toMatch(/jika mampu dan aman; ini sunah/i);
    expect(getStageContent("selesai", "madinah", "putra").detail).toMatch(/tidak menggantikan/i);
  });

  it("teaches the correct route-specific miqat preparation without assigning every flight a fixed miqat", () => {
    const byLand = getStageContent("miqat", "madinah", "putra");
    const byAir = getStageContent("miqat", "pesawat", "putra");
    expect(byLand.instruction).toMatch(/Bir Ali \(Dzulhulaifah\)/);
    expect(byAir.instruction).toMatch(/sebelum melewati miqat/);
    expect(byAir.instruction).toMatch(/awak pesawat/);
    expect(byAir.instruction).not.toMatch(/Jeddah|Qarn/);
  });

  it("distinguishes clothing, sa'i, and tahallul guidance for putra and putri", () => {
    expect(getStageContent("persiapan", "madinah", "putri").detail).toMatch(/tidak harus putih/);
    expect(getStageContent("sai", "madinah", "putri").detail).toMatch(/berjalan biasa/);
    expect(getStageContent("tahallul", "madinah", "putri").instruction).toMatch(/bukan mencukur habis/);
    expect(getStageContent("tahallul", "madinah", "putra").instruction).toMatch(/mencukur lebih utama/);
  });

  it("customization leaves base content untouched and all route/pilgrim combinations have complete copy", () => {
    const before = JSON.stringify(STAGES);
    for (const route of ["madinah", "pesawat"] as const) {
      for (const pilgrim of ["putra", "putri"] as const) {
        for (const stage of STAGE_IDS) {
          const content = getStageContent(stage, route, pilgrim);
          expect(content.id).toBe(stage);
          for (const field of ["title", "subtitle", "instruction", "detail", "action"] as const) expect(content[field].trim().length).toBeGreaterThan(5);
        }
      }
    }
    expect(JSON.stringify(STAGES)).toBe(before);
  });
});
