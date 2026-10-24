import { describe, expect, it } from "vitest";
import { pilihMisi, type Katalog } from "../misi";
import { LEARNER, attempt, buktiKuat, kompetensi, mulai, paket } from "./helper";

const A = "MAT.PAUD.BILANGAN-1-5.01";
const B = "MAT.PAUD.BILANGAN-1-5.02";
const C = "MAT.PAUD.BILANGAN-1-5.03";
const D = "MAT.TKA.BILANGAN-1-10.01"; // level di atas PAUD
const E = "KODE.PAUD.URUTAN.01";

const katalog: Katalog = {
  kompetensi: [kompetensi(A, { core: true }), kompetensi(B), kompetensi(C, { prereq: [A], core: true }), kompetensi(D, { prereq: [A] }), kompetensi(E, { core: true })],
  paket: [
    paket("pa-1", "PAUD", [A]),
    paket("pa-2", "PAUD", [A]),
    paket("pb-1", "PAUD", [B]),
    paket("pc-1", "PAUD", [C]),
    paket("pd-1", "TKA", [D]),
    paket("pe-1", "PAUD", [E]),
  ],
};

describe("pilihMisi", () => {
  it("mengembalikan sampai 3 paket berbeda, hanya level ≤ level anak", () => {
    const m = pilihMisi(LEARNER, [], "PAUD", katalog);
    expect(m).toHaveLength(3);
    expect(new Set(m.map((p) => p.id)).size).toBe(3);
    expect(m.every((p) => p.level === "PAUD")).toBe(true);
  });

  it("tanpa event: 'belum' yang siap, core dulu, lalu id", () => {
    const m = pilihMisi(LEARNER, [], "PAUD", katalog);
    // A dan E (core, tanpa prereq) duluan (seri → id); C core tapi prereq A belum berkembang; B bukan core
    expect(m.map((p) => p.competencyIds[0]).slice(0, 2).sort()).toEqual([E, A].sort());
    expect(m[2].competencyIds[0]).toBe(B);
  });

  it("memprioritaskan berkembang yang paling lama tidak dilatih", () => {
    const ev = [attempt([B], { hari: 0, activityId: "pb-1" }), attempt([E], { hari: 5, activityId: "pe-1" })];
    const m = pilihMisi(LEARNER, ev, "PAUD", katalog);
    expect(m[0].competencyIds[0]).toBe(B);
    expect(m[1].competencyIds[0]).toBe(E);
  });

  it("menghormati prereq: C muncul setelah A berkembang, D hanya bila level anak cukup", () => {
    expect(pilihMisi(LEARNER, [], "PAUD", katalog).some((p) => p.id === "pc-1")).toBe(false);
    const ev = [attempt([A], { activityId: "pa-1" })];
    const m = pilihMisi(LEARNER, ev, "PAUD", katalog);
    expect(m[0].competencyIds[0]).toBe(A); // berkembang dulu
    expect(m.some((p) => p.id === "pc-1")).toBe(true);
    expect(m.some((p) => p.id === "pd-1")).toBe(false);
    const ad: Katalog = { kompetensi: katalog.kompetensi.filter((c) => [A, D].includes(c.id)), paket: katalog.paket.filter((p) => ["pa-1", "pd-1"].includes(p.id)) };
    expect(pilihMisi(LEARNER, ev, "PAUD", ad).map((p) => p.id)).toEqual(["pa-1"]);
    expect(pilihMisi(LEARNER, ev, "TKA", ad).map((p) => p.id)).toEqual(["pa-1", "pd-1"]);
  });

  it("review dikuasai terlama hanya setelah berkembang & belum habis", () => {
    const kecil: Katalog = { kompetensi: [kompetensi(A), kompetensi(B)], paket: [paket("pa-1", "PAUD", [A]), paket("pb-1", "PAUD", [B])] };
    const ev = [...buktiKuat(A), attempt([B], { hari: 20, activityId: "pb-1" })];
    const m = pilihMisi(LEARNER, ev, "PAUD", kecil);
    expect(m.map((p) => p.id)).toEqual(["pb-1", "pa-1"]);
  });

  it("memilih paket yang paling jarang dimainkan untuk kompetensi yang sama", () => {
    const ev = [mulai("pa-1"), mulai("pa-1"), mulai("pa-2")];
    const m = pilihMisi(LEARNER, ev, "PAUD", katalog);
    expect(m.find((p) => p.competencyIds[0] === A)?.id).toBe("pa-2");
  });

  it("deterministik untuk event yang sama; event anak lain diabaikan", () => {
    const ev = [attempt([B], { learnerId: "44444444-4444-4444-8444-444444444444" })];
    const a = pilihMisi(LEARNER, ev, "PAUD", katalog).map((p) => p.id);
    const b = pilihMisi(LEARNER, ev, "PAUD", katalog).map((p) => p.id);
    expect(a).toEqual(b);
    expect(a).toEqual(pilihMisi(LEARNER, [], "PAUD", katalog).map((p) => p.id));
  });

  it("katalog kosong → []", () => {
    expect(pilihMisi(LEARNER, [], "PAUD", { kompetensi: [], paket: [] })).toEqual([]);
  });
});
