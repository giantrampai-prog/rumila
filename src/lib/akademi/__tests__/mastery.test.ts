import { describe, expect, it } from "vitest";
import { proyeksi, ringkasTrack } from "../mastery";
import { attempt, buktiKuat, kompetensi } from "./helper";

const C1 = "MAT.PAUD.BILANGAN-1-5.01";
const C2 = "MAT.PAUD.BILANGAN-1-5.02";

describe("proyeksi", () => {
  it("kompetensi tanpa event → belum dengan angka 0", () => {
    const p = proyeksi([], [kompetensi(C1)]);
    expect(p[C1]).toEqual({ status: "belum", success: 0, fail: 0, contexts: 0, days: 0, ratioLast10: 0, hintTail: 0 });
  });

  it("belum → berkembang → dikuasai sesuai aturan default", () => {
    const k = [kompetensi(C1)];
    expect(proyeksi([attempt([C1], { correct: false })], k)[C1].status).toBe("belum");
    const satu = proyeksi([attempt([C1])], k)[C1];
    expect(satu.status).toBe("berkembang");
    expect(satu.success).toBe(1);
    expect(satu.lastAt).toBeDefined();
    const kuat = proyeksi(buktiKuat(C1), k)[C1];
    expect(kuat.status).toBe("dikuasai");
    expect(kuat.contexts).toBe(2);
    expect(kuat.days).toBe(4);
    expect(kuat.ratioLast10).toBe(1);
  });

  it("konteks sama tidak naik ke dikuasai; hari sama juga tidak", () => {
    const k = [kompetensi(C1)];
    const satuKonteks = Array.from({ length: 5 }, (_, i) => attempt([C1], { hari: i, activityId: "paket-a" }));
    expect(proyeksi(satuKonteks, k)[C1]).toMatchObject({ status: "berkembang", contexts: 1, days: 5 });
    const satuHari = Array.from({ length: 5 }, (_, i) => attempt([C1], { hari: i * 0.01, activityId: i % 2 ? "b" : "a" }));
    expect(proyeksi(satuHari, k)[C1]).toMatchObject({ status: "berkembang", contexts: 2, days: 1 });
  });

  it("hint di akhir menahan, hint di tengah tidak", () => {
    const k = [kompetensi(C1)];
    const ev = buktiKuat(C1, 4);
    ev.push(attempt([C1], { hari: 4, hintUsed: true }));
    const p = proyeksi(ev, k)[C1];
    expect(p.status).toBe("berkembang");
    expect(p.hintTail).toBe(1);
    // satu lagi tanpa hint masih kurang (noHintLast = 2), dua lagi cukup
    ev.push(attempt([C1], { hari: 5 }));
    expect(proyeksi(ev, k)[C1].status).toBe("berkembang");
    ev.push(attempt([C1], { hari: 6 }));
    expect(proyeksi(ev, k)[C1].status).toBe("dikuasai");
    expect(proyeksi(ev, k)[C1].hintTail).toBe(0);
  });

  it("ratio rendah di 10 terakhir menahan", () => {
    const k = [kompetensi(C1)];
    const ev = buktiKuat(C1, 4);
    for (let i = 0; i < 4; i++) ev.push(attempt([C1], { hari: 4 + i, correct: false }));
    const p = proyeksi(ev, k)[C1];
    expect(p.ratioLast10).toBe(0.5);
    expect(p.status).toBe("berkembang");
    expect(p.fail).toBe(4);
  });

  it("override mastery dihormati", () => {
    const longgar = kompetensi(C1, { mastery: { minContexts: 1, minDays: 1, minSuccess: 2, noHintLast: 0 } });
    const ev = [attempt([C1], { hintUsed: true }), attempt([C1], { hintUsed: true, hari: 0.01 })];
    expect(proyeksi(ev, [longgar])[C1].status).toBe("dikuasai");
    expect(proyeksi(ev, [kompetensi(C1)])[C1].status).toBe("berkembang");
    const ketat = kompetensi(C1, { mastery: { minSuccess: 6 } });
    expect(proyeksi(buktiKuat(C1, 5), [ketat])[C1].status).toBe("berkembang");
  });

  it("event imported hanya satu konteks dan tidak dihitung ganda", () => {
    const k = [kompetensi(C1)];
    const ev = Array.from({ length: 4 }, (_, i) => attempt([C1], { hari: i, activityId: `lama-${i}`, imported: true }));
    const p = proyeksi(ev, k)[C1];
    expect(p).toMatchObject({ status: "berkembang", success: 4, contexts: 1 });
    ev.push(attempt([C1], { hari: 5, activityId: "paket-a" }));
    expect(proyeksi(ev, k)[C1].status).toBe("dikuasai");
  });

  it("event tanpa competencyIds atau bukan attempt diabaikan; satu attempt bisa membuktikan banyak kompetensi", () => {
    const k = [kompetensi(C1), kompetensi(C2)];
    const polos = attempt([C1]);
    polos.payload = { ...polos.payload, competencyIds: undefined };
    const p = proyeksi([polos, attempt([C1, C2])], k);
    expect(p[C1].success).toBe(1);
    expect(p[C2].success).toBe(1);
  });
});

describe("ringkasTrack", () => {
  it("menghitung per track × level dan core", () => {
    const k = [kompetensi(C1, { core: true }), kompetensi(C2), kompetensi("KODE.PAUD.URUTAN.01", { core: true })];
    const peng = proyeksi([...buktiKuat(C1), attempt([C2])], k);
    expect(ringkasTrack(peng, k, "MAT", "PAUD")).toEqual({ total: 2, dikuasai: 1, berkembang: 1, belum: 0, coreDikuasai: 1, coreTotal: 1 });
    expect(ringkasTrack(peng, k, "KODE", "PAUD")).toEqual({ total: 1, dikuasai: 0, berkembang: 0, belum: 1, coreDikuasai: 0, coreTotal: 1 });
  });
});
