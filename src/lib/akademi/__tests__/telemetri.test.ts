import { describe, expect, it } from "vitest";
import type { GameEvent } from "@akademi/schema";
import { ringkasAnak, ringkasHarian, ringkasKompetensi, ringkasPaket, teksRingkasan } from "../telemetri";
import { LEARNER, attempt, buktiKuat, idBaru, kompetensi, mulai, paket, waktuHari } from "./helper";

const C1 = "MAT.PAUD.BILANGAN-1-5.01";
const ANAK2 = "44444444-4444-4444-8444-444444444444";
const SESI2 = "55555555-5555-4555-8555-555555555555";
const PA = paket("paket-a", "PAUD", [C1]);
const PB = paket("paket-b", "PAUD", [C1]);

/** percobaan dengan latensi/knob sendiri (helper bawaan memakai latensi 100) */
function coba(o: { correct?: boolean; hintUsed?: boolean; latencyMs?: number; knobs?: Record<string, number>; activityId?: string; hari?: number; learnerId?: string } = {}): GameEvent {
  const e = attempt([C1], { correct: o.correct, hintUsed: o.hintUsed, activityId: o.activityId, hari: o.hari, learnerId: o.learnerId });
  const payload = { ...e.payload, latencyMs: o.latencyMs ?? 100 } as Record<string, unknown>;
  if (o.knobs) payload.knobs = o.knobs;
  return { ...e, payload };
}

function selesai(activityId: string, o: { hari?: number; durationMs?: number; outcome?: "selesai" | "berhenti"; learnerId?: string; sessionId?: string } = {}): GameEvent {
  return {
    id: idBaru(),
    learnerId: o.learnerId ?? LEARNER,
    sessionId: o.sessionId ?? mulai(activityId).sessionId,
    activityId,
    mechanic: "pilah",
    type: "activity_end",
    clientAt: waktuHari(o.hari ?? 0),
    payload: { outcome: o.outcome ?? "selesai", successCount: 3, failCount: 0, hintCount: 0, durationMs: o.durationMs ?? 60000 },
  };
}

describe("ringkasPaket", () => {
  it("menghitung percobaan, rasio, median latensi, hint, anak unik, dan rata-rata knob", () => {
    const ev = [
      coba({ latencyMs: 1000, knobs: { n: 3 } }),
      coba({ latencyMs: 3000, knobs: { n: 5 } }),
      coba({ latencyMs: 9000, correct: false, hintUsed: true, learnerId: ANAK2 }),
      attempt([C1], { activityId: "tidak-ada-di-katalog" }),
    ];
    const [r] = ringkasPaket(ev, [PA, PB]);
    expect(ringkasPaket(ev, [PA, PB])).toHaveLength(1);
    expect(r).toMatchObject({ paketId: "paket-a", mechanic: "pilah", level: "PAUD", attempts: 3, benar: 2, anakUnik: 2, medianLatencyMs: 3000, knobRataRata: { n: 4 }, bendera: [] });
    expect(r.rasio).toBeCloseTo(2 / 3);
    expect(r.hintRate).toBeCloseTo(1 / 3);
  });

  it("berhenti = start tanpa end dalam sesi yang sama; bendera sering-berhenti saat ≥ 50% dari ≥ 4 mulai", () => {
    const ev: GameEvent[] = [];
    // sesi 1: dua kali mulai, satu kali selesai → 1 berhenti
    ev.push(mulai("paket-a"), mulai("paket-a"), selesai("paket-a"));
    // sesi 2: dua kali mulai, tidak pernah selesai → 2 berhenti
    ev.push({ ...mulai("paket-a"), sessionId: SESI2 }, { ...mulai("paket-a"), sessionId: SESI2 });
    const [r] = ringkasPaket(ev, [PA]);
    expect(r).toMatchObject({ mulai: 4, selesai: 1, berhenti: 3 });
    expect(r.bendera).toEqual(["sering-berhenti"]);
  });

  it("bendera terlalu-mudah / terlalu-sukar / banyak-hint sesuai ambang, dan paket berbendera diurutkan lebih dulu", () => {
    const mudah = Array.from({ length: 8 }, () => coba({ latencyMs: 1500, activityId: "paket-a" }));
    const sukar = Array.from({ length: 10 }, (_, i) => coba({ correct: i < 3, hintUsed: true, latencyMs: 5000, activityId: "paket-b" }));
    const biasa = Array.from({ length: 20 }, (_, i) => coba({ correct: i % 2 === 0, latencyMs: 5000, activityId: "paket-c" }));
    const PC = paket("paket-c", "PAUD", [C1]);
    const r = ringkasPaket([...biasa, ...mudah, ...sukar], [PA, PB, PC]);
    expect(r.map((x) => x.paketId)).toEqual(["paket-b", "paket-a", "paket-c"]);
    expect(r[0].bendera).toEqual(["terlalu-sukar", "banyak-hint"]);
    expect(r[1].bendera).toEqual(["terlalu-mudah"]);
    expect(r[2].bendera).toEqual([]);
    // rasio 0.9 tapi latensi lambat → bukan terlalu mudah
    const lambat = Array.from({ length: 10 }, (_, i) => coba({ correct: i > 0, latencyMs: 6000 }));
    expect(ringkasPaket(lambat, [PA])[0].bendera).toEqual([]);
  });
});

describe("ringkasKompetensi", () => {
  it("menghitung jumlah anak per status dan rasio gabungan", () => {
    const k = [kompetensi(C1), kompetensi("MAT.PAUD.BILANGAN-1-5.02")];
    const anak2 = [attempt([C1], { learnerId: ANAK2 }), attempt([C1], { learnerId: ANAK2, correct: false })];
    const r = ringkasKompetensi({ [LEARNER]: buktiKuat(C1), [ANAK2]: anak2, "anak-3": [] }, k);
    expect(r[0]).toMatchObject({ id: C1, statement: `Aku bisa ${C1}`, core: false, level: "PAUD", track: "MAT", dikuasai: 1, berkembang: 1, belum: 1, attempts: 6 });
    expect(r[0].rasio).toBeCloseTo(5 / 6);
    expect(r[1]).toMatchObject({ belum: 3, berkembang: 0, dikuasai: 0, attempts: 0, rasio: 0 });
  });
});

describe("ringkasAnak", () => {
  it("hari aktif 30 hari terakhir, menit main, selesai, rasio, terakhir main — hanya anak yang diminta", () => {
    const now = new Date(waktuHari(40));
    const ev = [
      attempt([C1], { hari: 5 }), // > 30 hari lalu: tidak dihitung hari aktif
      attempt([C1], { hari: 20 }),
      attempt([C1], { hari: 20.2, correct: false }),
      attempt([C1], { hari: 30 }),
      selesai("paket-a", { hari: 30, durationMs: 90000 }),
      selesai("paket-a", { hari: 31, durationMs: 60000, outcome: "berhenti" }),
      attempt([C1], { hari: 39, learnerId: ANAK2 }),
    ];
    const r = ringkasAnak(ev, LEARNER, now);
    expect(r).toMatchObject({ hariAktif: 3, menitMain: 3, aktivitasSelesai: 1, terakhirAt: waktuHari(31) });
    expect(r.rasio).toBeCloseTo(3 / 4);
    expect(ringkasAnak([], LEARNER, now)).toEqual({ hariAktif: 0, menitMain: 0, aktivitasSelesai: 0, rasio: 0, terakhirAt: undefined });
  });
});

describe("ringkasHarian", () => {
  it("mengembalikan tepat n hari lokal urut lama → baru, hari kosong bernilai 0", () => {
    const now = new Date(waktuHari(13)); // 14 Jan 2026
    const ev = [attempt([C1], { hari: 13 }), attempt([C1], { hari: 13, correct: false, learnerId: ANAK2 }), attempt([C1], { hari: 0 }), attempt([C1], { hari: -1 })];
    const r = ringkasHarian(ev, 14, now);
    expect(r).toHaveLength(14);
    expect(r[0]).toEqual({ tanggal: "2026-01-01", attempts: 1, benar: 1, anakUnik: 1 });
    expect(r[1]).toEqual({ tanggal: "2026-01-02", attempts: 0, benar: 0, anakUnik: 0 });
    expect(r[13]).toEqual({ tanggal: "2026-01-14", attempts: 2, benar: 1, anakUnik: 2 });
  });
});

describe("teksRingkasan", () => {
  it("menyusun teks polos dengan paket berbendera dan per anak", () => {
    const sukar = Array.from({ length: 10 }, (_, i) => coba({ correct: i < 3, latencyMs: 5000 }));
    const paketR = ringkasPaket(sukar, [PA]);
    const teks = teksRingkasan({
      tanggal: "24 Okt 2026",
      anakAktif: 1,
      totalAnak: 2,
      selesaiMingguIni: 3,
      rasio: 0.3,
      paket: paketR,
      namaPaket: (id) => `Judul ${id}`,
      kompetensi: ringkasKompetensi({ [LEARNER]: sukar }, [kompetensi(C1)]),
      anak: [{ nama: "Agam", r: ringkasAnak(sukar, LEARNER, new Date(waktuHari(1))) }],
    });
    expect(teks).toContain("Anak aktif 7 hari: 1/2");
    expect(teks).toContain("Judul paket-a [pilah/PAUD]: terlalu sukar");
    expect(teks).toContain(`${C1} (30% dari 10)`);
    expect(teks).toContain("Agam: 1 hari aktif");
  });
});
