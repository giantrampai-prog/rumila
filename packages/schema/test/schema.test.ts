import { describe, expect, it } from "vitest";
import { Competency, ContentPack, DEFAULT_MASTERY, GameEvent, Kamus, KerangkaFile, adaError, validasiKurikulum, type Competency as C } from "../src";

const dasar = (over: Partial<C> = {}): C => Competency.parse({
  id: "MAT.PAUD.BILANGAN-1-5.01",
  track: "MAT", level: "PAUD",
  unit: { id: "BILANGAN-1-5", nama: { id: "Bilangan 1–5", en: "Numbers 1–5" } },
  statement: { id: "Aku bisa menghitung 1 sampai 5 benda satu per satu", en: "I can count 1 to 5 objects one by one" },
  depth: ["pakai"], prereq: [], refs: [{ framework: "EYFS", code: "ELG-MATH-NUMBER" }],
  core: true, mechanics: ["pilah", "dagang"],
  ...over,
});

describe("Competency", () => {
  it("menerima kompetensi dasar", () => { expect(dasar().mastery).toBeUndefined(); expect(DEFAULT_MASTERY.minSuccess).toBe(3); });
  it("menolak id yang tidak sesuai format", () => {
    expect(() => dasar({ id: "mat.paud.x.1" as never })).toThrow();
  });
  it("menolak track yang beda dengan id", () => {
    expect(() => dasar({ track: "KODE" })).toThrow(/segmen id/);
  });
  it("mewajibkan awalan Aku bisa / I can", () => {
    expect(() => dasar({ statement: { id: "Menghitung sampai 5", en: "I can count" } })).toThrow(/Aku bisa/);
    expect(() => dasar({ statement: { id: "Aku bisa menghitung", en: "Count to five" } })).toThrow(/I can/);
  });
  it("menolak prasyarat diri sendiri", () => {
    expect(() => dasar({ prereq: ["MAT.PAUD.BILANGAN-1-5.01"] })).toThrow(/dirinya sendiri/);
  });
});

describe("validasiKurikulum", () => {
  const kamus = new Kamus([KerangkaFile.parse({ framework: "EYFS", title: "EYFS", entries: [
    { code: "ELG-MATH-NUMBER", text: "Have a deep understanding of number to 10", verified: true },
    { code: "ELG-MATH-PATTERNS", text: "Verbally count beyond 20", verified: false },
  ] })]);
  it("lolos untuk kurikulum konsisten", () => {
    const a = dasar();
    const b = dasar({ id: "MAT.PAUD.BILANGAN-1-5.02", prereq: [a.id] });
    const t = validasiKurikulum([a, b], kamus);
    expect(adaError(t)).toBe(false);
  });
  it("menemukan prasyarat hilang, siklus, dan ref di luar kamus", () => {
    const a = dasar({ prereq: ["MAT.PAUD.BILANGAN-1-5.02"] });
    const b = dasar({ id: "MAT.PAUD.BILANGAN-1-5.02", prereq: [a.id], refs: [{ framework: "EYFS", code: "TIDAK-ADA" }] });
    const c = dasar({ id: "MAT.PAUD.BILANGAN-1-5.03", prereq: ["MAT.PAUD.BILANGAN-1-5.99"] });
    const t = validasiKurikulum([a, b, c], kamus);
    expect(t.some(x => x.pesan.includes("siklus"))).toBe(true);
    expect(t.some(x => x.pesan.includes("tidak ada di kamus"))).toBe(true);
    expect(t.some(x => x.pesan.includes("tidak ditemukan"))).toBe(true);
    expect(adaError(t)).toBe(true);
  });
  it("memperingatkan ref belum terverifikasi dan prasyarat dari level lebih tinggi", () => {
    const a = dasar({ refs: [{ framework: "EYFS", code: "ELG-MATH-PATTERNS" }] });
    const tinggi = dasar({ id: "MAT.TKA.BILANGAN-1-10.01", level: "TKA", unit: { id: "BILANGAN-1-10", nama: { id: "Bilangan 1–10", en: "Numbers 1–10" } } });
    const b = dasar({ id: "MAT.PAUD.BILANGAN-1-5.02", prereq: [tinggi.id] });
    const t = validasiKurikulum([a, tinggi, b], kamus);
    expect(t.find(x => x.id === a.id)?.tingkat).toBe("warning");
    expect(t.find(x => x.id === b.id)?.pesan).toMatch(/lebih tinggi/);
  });
});

describe("ContentPack", () => {
  it("menerima paket pilah", () => {
    const p = ContentPack.parse({
      id: "keranjang-warna", version: "1.0.0", level: "PAUD", mechanic: "pilah",
      competencyIds: ["MAT.PAUD.WARNA-BENTUK.01"], instructionKey: "instruksi",
      locale: { id: { instruksi: "Masukkan ke keranjang yang warnanya sama", merah: "merah", biru: "biru", apel: "apel", bola: "bola" },
                en: { instruksi: "Put it in the basket with the same colour", merah: "red", biru: "blue", apel: "apple", bola: "ball" } },
      knobs: { itemCount: { min: 4, max: 12, default: 6 } },
      bins: [{ id: "merah", labelKey: "merah" }, { id: "biru", labelKey: "biru" }],
      items: [{ id: "apel", labelKey: "apel", bin: "merah" }, { id: "bola", labelKey: "bola", bin: "biru" }, { id: "apel-2", labelKey: "apel", bin: "merah" }, { id: "bola-2", labelKey: "bola", bin: "biru" }],
    });
    expect(p.mechanic).toBe("pilah");
    expect(p.generatif).toBe(true);
  });
  it("menolak mekanik tanpa skema paket", () => {
    expect(() => ContentPack.parse({ mechanic: "simulasi" })).toThrow();
  });
});

describe("GameEvent", () => {
  const base = { id: "7b0b6b7e-1b2c-4d3e-8f90-123456789abc", learnerId: "7b0b6b7e-1b2c-4d3e-8f90-123456789abd", sessionId: "7b0b6b7e-1b2c-4d3e-8f90-123456789abe", activityId: "pasar-buah-1", mechanic: "dagang", clientAt: "2026-10-24T03:00:00.000Z" };
  it("memvalidasi payload attempt", () => {
    expect(GameEvent.parse({ ...base, type: "attempt", payload: { itemId: "pembeli-3", correct: true, latencyMs: 1200 } }).type).toBe("attempt");
    expect(() => GameEvent.parse({ ...base, type: "attempt", payload: { itemId: "x" } })).toThrow(/attempt/);
  });
  it("menerima activity_start tanpa payload", () => {
    expect(GameEvent.parse({ ...base, type: "activity_start" }).payload).toEqual({});
  });
});
