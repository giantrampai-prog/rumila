import { describe, expect, it } from "vitest";
import { bolehMengulang, hariWIB, lulusDari, nilaiDari, predikat, rencanaUjian, terbaik, type HasilUjian } from "../ujian";
import { paket } from "./helper";

const P = [paket("a1", "PAUD", ["C1"]), paket("a2", "PAUD", ["C1"]), paket("b1", "PAUD", ["C2", "C1"]), paket("x", "TKA", ["C3"])];

describe("rencanaUjian", () => {
  it("kompetensi bergiliran, paket berganti, deterministik per seed", () => {
    const s = rencanaUjian(["C1", "C2"], P, 6, "seed-1", "PAUD");
    expect(s).toHaveLength(6);
    expect(new Set(s.map((x) => x.competencyId))).toEqual(new Set(["C1", "C2"]));
    const c1 = s.filter((x) => x.competencyId === "C1").map((x) => x.paketId);
    expect(new Set(c1).size).toBeGreaterThan(1);
    expect(rencanaUjian(["C1", "C2"], P, 6, "seed-1", "PAUD")).toEqual(s);
  });

  it("kompetensi tanpa paket dilewati; tanpa paket sama sekali → kosong", () => {
    expect(rencanaUjian(["C9"], P, 5, "s")).toEqual([]);
    expect(rencanaUjian(["C9", "C3"], P, 3, "s").every((x) => x.paketId === "x")).toBe(true);
  });
});

describe("nilai & predikat", () => {
  it("nilai dibulatkan, ambang per jenis", () => {
    expect(nilaiDari(7, 8)).toBe(88);
    expect(lulusDari("kuis", 70)).toBe(true);
    expect(lulusDari("semester", 74)).toBe(false);
    expect(predikat(92)).toBe("Dengan Pujian");
    expect(predikat(85)).toBe("Sangat Baik");
    expect(predikat(76)).toBe("Baik");
    expect(predikat(60)).toBe("Belum Lulus");
  });
});

describe("mengulang", () => {
  const h = (lulus: boolean, at: string): HasilUjian => ({ jenis: "kuis", level: "PAUD", ruang: "U1", sessionId: at, benar: 1, total: 8, nilai: lulus ? 80 : 10, lulus, at });
  it("gagal hari ini (WIB) → tunggu besok; besoknya boleh; sudah lulus → tidak perlu", () => {
    const sekarang = new Date("2026-11-15T10:00:00+07:00");
    expect(bolehMengulang([h(false, "2026-11-15T01:00:00+07:00")], "kuis", "PAUD", "U1", sekarang)).toEqual({ boleh: false, besok: true });
    expect(bolehMengulang([h(false, "2026-11-14T23:30:00+07:00")], "kuis", "PAUD", "U1", sekarang)).toEqual({ boleh: true });
    expect(bolehMengulang([h(true, "2026-11-10T09:00:00+07:00")], "kuis", "PAUD", "U1", sekarang)).toEqual({ boleh: false });
    expect(hariWIB("2026-11-14T17:30:00Z")).toBe("2026-11-15");
  });
  it("terbaik: lulus menang", () => {
    const m = terbaik([h(false, "a"), h(true, "b")]);
    expect([...m.values()][0].lulus).toBe(true);
  });
});
