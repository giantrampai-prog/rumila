// Penjaga struktur katalog (audit konten 15 Nov 2026). Audit lengkap (ronde, kunci jawaban, peta robot):
// `npm run akademi:audit`.
import { describe, expect, it } from "vitest";
import { KOMPETENSI, PAKET } from "../katalog";

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
const kembar = (xs: string[]) => xs.filter((x, i) => xs.indexOf(x) !== i);

describe("katalog Academy", () => {
  it("setiap kompetensi punya minimal satu permainan (misi tidak buntu)", () => {
    const tanpa = KOMPETENSI.filter((c) => !PAKET.some((p) => p.competencyIds.includes(c.id))).map((c) => c.id);
    expect(tanpa).toEqual([]);
  });

  it("tidak ada id atau pernyataan kompetensi kembar", () => {
    expect(kembar(KOMPETENSI.map((c) => c.id))).toEqual([]);
    expect(kembar(KOMPETENSI.map((c) => norm(c.statement.id)))).toEqual([]);
  });

  it("tidak ada id atau judul paket kembar", () => {
    expect(kembar(PAKET.map((p) => p.id))).toEqual([]);
    expect(kembar(PAKET.map((p) => norm(p.locale.id.judul ?? p.id)))).toEqual([]);
    expect(kembar(PAKET.map((p) => norm(p.locale.en.judul ?? p.id)))).toEqual([]);
  });

  it("setiap paket menunjuk kompetensi yang ada", () => {
    const ada = new Set(KOMPETENSI.map((c) => c.id));
    expect(PAKET.flatMap((p) => p.competencyIds.filter((c) => !ada.has(c)).map((c) => `${p.id}→${c}`))).toEqual([]);
  });
});
