import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/akademi/jejak", () => ({ catatEvent: vi.fn((e: unknown) => e) }));

import { catatEvent } from "@/lib/akademi/jejak";
import { catatGagalKoding, catatMenangKoding, imporProgresKoding, kompetensiLevel } from "@/lib/akademi/bukti-koding";
import { KALAU } from "@/lib/koding/kalau";
import { LANGKAH } from "@/lib/koding/langkah";
import { ULANGI } from "@/lib/koding/ulangi";

const LEARNER = "11111111-1111-4111-8111-111111111111";
const catat = vi.mocked(catatEvent);

/** localStorage sederhana di lingkungan node */
function pasangLocalStorage() {
  const m = new Map<string, string>();
  const ls = {
    getItem: (k: string) => (m.has(k) ? m.get(k)! : null),
    setItem: (k: string, v: string) => void m.set(k, String(v)),
    removeItem: (k: string) => void m.delete(k),
    clear: () => m.clear(),
    key: (i: number) => Array.from(m.keys())[i] ?? null,
    get length() {
      return m.size;
    },
  };
  Object.defineProperty(globalThis, "localStorage", { value: ls, configurable: true });
  Object.defineProperty(globalThis, "window", { value: globalThis, configurable: true });
  return ls;
}

beforeEach(() => {
  catat.mockClear();
  pasangLocalStorage();
});

describe("kompetensiLevel", () => {
  it("langkah: pemetaan per rentang index", () => {
    expect(kompetensiLevel("langkah", "k1", 0)).toEqual(["KODE.PAUD.PERINTAH.01", "KODE.TKA.NAVIGASI.01"]);
    expect(kompetensiLevel("langkah", "k10", 9)).toEqual(["KODE.PAUD.PERINTAH.01", "KODE.TKA.NAVIGASI.01"]);
    expect(kompetensiLevel("langkah", "k11", 10)).toEqual(["KODE.TKA.NAVIGASI.02", "KODE.TKA.NAVIGASI.03"]);
    expect(kompetensiLevel("langkah", "k20", 19)).toEqual(["KODE.TKA.NAVIGASI.02", "KODE.TKA.NAVIGASI.03"]);
    expect(kompetensiLevel("langkah", "k21", 20)).toEqual(["KODE.TKA.NAVIGASI.03", "KODE.TKB.PROGRAM-5-8.01"]);
    expect(kompetensiLevel("langkah", "k50", 49)).toEqual(["KODE.TKA.NAVIGASI.03", "KODE.TKB.PROGRAM-5-8.01"]);
    expect(kompetensiLevel("langkah", "k51", 50)).toEqual(["KODE.TKB.PROGRAM-5-8.01"]);
    expect(kompetensiLevel("langkah", "k100", 99)).toEqual(["KODE.TKB.PROGRAM-5-8.01"]);
  });
  it("ulangi: dua kompetensi, tambah ULANGI.03 mulai index 30", () => {
    expect(kompetensiLevel("ulangi", "u1", 0)).toEqual(["KODE.TKB.ULANGI.01", "KODE.TKB.ULANGI.02"]);
    expect(kompetensiLevel("ulangi", "u30", 29)).toEqual(["KODE.TKB.ULANGI.01", "KODE.TKB.ULANGI.02"]);
    expect(kompetensiLevel("ulangi", "u31", 30)).toEqual(["KODE.TKB.ULANGI.01", "KODE.TKB.ULANGI.02", "KODE.TKB.ULANGI.03"]);
  });
  it("kalau: KONDISI.01", () => {
    expect(kompetensiLevel("kalau", "c1", 0)).toEqual(["KODE.TKB.KONDISI.01"]);
    expect(kompetensiLevel("kalau", "c99", 98)).toEqual(["KODE.TKB.KONDISI.01"]);
  });
});

describe("catatMenangKoding / catatGagalKoding", () => {
  const dasar = { learnerId: LEARNER, game: "langkah" as const, levelId: "k12", index: 11, blocks: 5, hintUsed: true, latencyMs: 4321.7 };
  it("menang → attempt correct true dengan payload lengkap", () => {
    catatMenangKoding({ ...dasar, stars: 3 });
    expect(catat).toHaveBeenCalledTimes(1);
    const e = catat.mock.calls[0][0];
    expect(e.learnerId).toBe(LEARNER);
    expect(e.activityId).toBe("koding-langkah");
    expect(e.mechanic).toBe("navigasi");
    expect(e.type).toBe("attempt");
    expect(e.sessionId).toMatch(/^[0-9a-f-]{36}$/);
    expect(e.payload).toEqual({
      itemId: "k12",
      correct: true,
      hintUsed: true,
      latencyMs: 4322,
      competencyIds: ["KODE.TKA.NAVIGASI.02", "KODE.TKA.NAVIGASI.03"],
      detail: { stars: 3, blocks: 5, levelId: "k12" },
    });
  });
  it("gagal → correct false, stars 0", () => {
    catatGagalKoding({ ...dasar, game: "kalau", levelId: "c3", index: 2 });
    const e = catat.mock.calls[0][0];
    expect(e.activityId).toBe("koding-kalau");
    expect(e.payload.correct).toBe(false);
    expect(e.payload.detail).toEqual({ stars: 0, blocks: 5, levelId: "c3" });
    expect(e.payload.competencyIds).toEqual(["KODE.TKB.KONDISI.01"]);
  });
  it("anggota demo (bukan UUID) tidak dicatat", () => {
    catatMenangKoding({ ...dasar, learnerId: "dev", stars: 1 });
    expect(catat).not.toHaveBeenCalled();
  });
});

describe("imporProgresKoding", () => {
  it("mencatat satu event imported per level berbintang, hanya sekali per anak", () => {
    localStorage.setItem(`rumila-koding-${LEARNER}`, JSON.stringify({ stars: { [LANGKAH[0].id]: 3, [LANGKAH[1].id]: 1, [LANGKAH[2].id]: 0, [LANGKAH[25].id]: 2 } }));
    localStorage.setItem(`rumila-koding-ulangi-${LEARNER}`, JSON.stringify({ stars: { [ULANGI[35].id]: 2 } }));
    localStorage.setItem(`rumila-koding-kalau-${LEARNER}`, JSON.stringify({ stars: { [KALAU[0].id]: 1, "tidak-ada": 3 } }));

    expect(imporProgresKoding(LEARNER)).toBe(5);
    expect(catat).toHaveBeenCalledTimes(5);

    const byItem = Object.fromEntries(catat.mock.calls.map(([e]) => [e.payload.itemId as string, e]));
    expect(Object.keys(byItem).sort()).toEqual([LANGKAH[0].id, LANGKAH[1].id, LANGKAH[25].id, ULANGI[35].id, KALAU[0].id].sort());
    for (const e of catat.mock.calls.map(([x]) => x)) {
      expect(e.activityId).toBe("import");
      expect(e.type).toBe("attempt");
      expect(e.learnerId).toBe(LEARNER);
      expect(e.payload).toMatchObject({ correct: true, hintUsed: false, latencyMs: 0, imported: true });
    }
    expect(byItem[LANGKAH[25].id].payload.competencyIds).toEqual(["KODE.TKA.NAVIGASI.03", "KODE.TKB.PROGRAM-5-8.01"]);
    expect(byItem[ULANGI[35].id].payload.competencyIds).toEqual(["KODE.TKB.ULANGI.01", "KODE.TKB.ULANGI.02", "KODE.TKB.ULANGI.03"]);
    expect(byItem[KALAU[0].id].payload.detail).toMatchObject({ stars: 1, game: "kalau" });
    expect(localStorage.getItem(`rumila-akademi-impor-koding-${LEARNER}`)).toBeTruthy();

    // kedua kali: tidak ada event baru
    expect(imporProgresKoding(LEARNER)).toBe(0);
    expect(catat).toHaveBeenCalledTimes(5);
  });
  it("tanpa progres lama tetap memasang penanda dan tidak mencatat apa pun", () => {
    expect(imporProgresKoding(LEARNER)).toBe(0);
    expect(catat).not.toHaveBeenCalled();
    expect(localStorage.getItem(`rumila-akademi-impor-koding-${LEARNER}`)).toBeTruthy();
  });
  it("anggota demo tidak diimpor", () => {
    localStorage.setItem("rumila-koding-dev", JSON.stringify({ stars: { k1: 3 } }));
    expect(imporProgresKoding("dev")).toBe(0);
    expect(catat).not.toHaveBeenCalled();
    expect(localStorage.getItem("rumila-akademi-impor-koding-dev")).toBeNull();
  });
});
