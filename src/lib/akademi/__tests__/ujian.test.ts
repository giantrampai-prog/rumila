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
    expect(predikat(60)).toBe("Cukup");
    expect(predikat(60, "semester")).toBe("Belum Lulus");
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

describe("piagam & sertifikat semester", async () => {
  const { piagamModul, sertifikatSemester, tahunAjaran, nomorSemester } = await import("../piagam");
  const { kompetensi } = await import("./helper");
  const K = [kompetensi("MAT.PAUD.A.01", { core: true }), kompetensi("MAT.PAUD.A.02"), kompetensi("KODE.PAUD.B.01", { core: true }), kompetensi("MAT.PAUD.C.01")];
  const h = (jenis: HasilUjian["jenis"], ruang: string, nilai: number, sessionId = `${jenis}-${ruang}-${nilai}`): HasilUjian => ({ jenis, level: "PAUD", ruang, sessionId, benar: 0, total: 8, nilai, lulus: nilai >= 70, at: "2026-11-15T03:00:00.000Z" });

  it("piagam hanya untuk kuis lulus, nilai terbaik per modul", () => {
    const p = piagamModul([h("kuis", "A", 50), h("kuis", "A", 90), h("kuis", "A", 80), h("kuis", "B", 60)], K);
    expect(p.map((x) => `${x.unitId}:${x.nilai}:${x.ke}`)).toEqual(["A:90:1"]);
  });

  it("sertifikat semester: nilai per pelajaran dari kuis, nilai akhir 60/40", () => {
    const s = sertifikatSemester([h("kuis", "A", 80), h("kuis", "B", 100), h("semester", "S1", 90)], K);
    expect(s).toHaveLength(1);
    expect(s[0].ke).toBe(1);
    expect(s[0].perPelajaran.map((x) => `${x.track}:${x.nilai}`).sort()).toEqual(expect.arrayContaining([expect.stringMatching(/^MAT:/)]));
    expect(s[0].nilaiAkhir).toBe(Math.round(0.6 * 90 + 0.4 * ((s[0].perPelajaran.reduce((a, b) => a + b.nilai * b.modul, 0)) / s[0].perPelajaran.reduce((a, b) => a + b.modul, 0))));
    expect(tahunAjaran("2026-11-15T00:00:00Z")).toBe("2026/2027");
    expect(tahunAjaran("2027-03-01T00:00:00Z")).toBe("2026/2027");
    expect(nomorSemester({ level: "PAUD", ke: 1, at: "2026-11-15T00:00:00Z", sessionId: "ab12cd34-0000-4000-8000-000000000000" })).toBe("RA/2026/PAUD-S1/AB12CD34");
  });
});

describe("Ujian Akhir sekali-jalan", () => {
  const akhir = (nilai: number): HasilUjian => ({ jenis: "kenaikan", level: "TKB", ruang: "", sessionId: "s1", benar: 0, total: 20, nilai, lulus: nilai >= 75, at: "2026-11-01T03:00:00Z" });
  it("sudah dikerjakan (lulus atau tidak) → tidak bisa diulang, bahkan besoknya", () => {
    expect(bolehMengulang([akhir(60)], "kenaikan", "TKB", "", new Date("2026-12-01T03:00:00Z"))).toEqual({ boleh: false, sekali: true });
    expect(bolehMengulang([akhir(95)], "kenaikan", "TKB", "")).toEqual({ boleh: false, sekali: true });
    expect(bolehMengulang([], "kenaikan", "TKB", "")).toEqual({ boleh: true });
  });
  it("nilai di bawah 75 tetap berpredikat Cukup (bukan Belum Lulus)", () => {
    expect(predikat(60, "kenaikan")).toBe("Cukup");
    expect(predikat(60, "kuis")).toBe("Belum Lulus");
  });
});
