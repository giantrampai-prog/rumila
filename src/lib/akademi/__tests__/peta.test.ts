import { describe, expect, it } from "vitest";
import type { GameEvent } from "@akademi/schema";
import type { Penguasaan, Status } from "../mastery";
import { jenjangBerikut, kompetensiSelesai, paketMisi, petaJenjang, progresMisi } from "../peta";
import { LEARNER, SESSION, idBaru, kompetensi, paket, waktuHari } from "./helper";

const M1 = "MAT.PAUD.BILANGAN.01";
const M2 = "MAT.PAUD.BILANGAN.02";
const M3 = "MAT.PAUD.BENTUK.01";
const K1 = "KODE.PAUD.URUTAN.01";
const K2 = "KODE.PAUD.URUTAN.02";
const T1 = "MAT.TKA.BILANGAN.01";

const KOMP = [
  kompetensi(M1, { core: true }),
  kompetensi(M2, { core: true, prereq: [M1] }),
  kompetensi(M3, { core: false }),
  kompetensi(K1, { core: true }),
  kompetensi(K2, { core: true }),
  kompetensi(T1, { core: true }),
];
const TRACKS = ["MAT", "KODE"] as const;

const p = (status: Status): Penguasaan => ({ status, success: 0, fail: 0, contexts: 0, days: 0, ratioLast10: 0, hintTail: 0, lastAt: waktuHari(0) });
const ev = (type: GameEvent["type"], activityId: string, payload: Record<string, unknown> = {}): GameEvent =>
  ({ id: idBaru(), learnerId: LEARNER, sessionId: SESSION, activityId, mechanic: "pilah", type, clientAt: waktuHari(0), payload }) as GameEvent;
const tamat = (activityId: string, s: number, f: number) => ev("activity_end", activityId, { outcome: "selesai", successCount: s, failCount: f, hintCount: 0, durationMs: 1 });

describe("petaJenjang", () => {
  it("satu jalur bernomor: unit diselang-seling antarpelajaran", () => {
    const peta = petaJenjang({}, new Set(), KOMP, "PAUD", TRACKS);
    expect(peta.unit.map((u) => `${u.track}:${u.id}:${u.ke}`)).toEqual(["MAT:BILANGAN:1", "KODE:URUTAN:1", "MAT:BENTUK:2"]);
    expect(peta.unit.flatMap((u) => u.misi.map((m) => `${m.nomor}:${m.kompetensi.id}`))).toEqual([`1:${M1}`, `2:${M2}`, `3:${K1}`, `4:${K2}`, `5:${M3}`]);
    expect(peta.total).toBe(5);
  });

  it("unit aktif terbuka dalam urutan bebas; unit sesudahnya terkunci", () => {
    const peta = petaJenjang({}, new Set([M1]), KOMP, "PAUD", TRACKS);
    const misi = peta.unit.flatMap((u) => u.misi);
    expect(misi.map((m) => (m.selesai ? "S" : m.sekarang ? "N" : m.terkunci ? "K" : "-")).join("")).toBe("SNKKK");
    // M2 dikerjakan dulu (M1 belum): unit pertama tetap aktif, misi lain di unit itu tetap terbuka
    const bebas = petaJenjang({}, new Set([M2]), KOMP, "PAUD", TRACKS).unit.flatMap((u) => u.misi);
    expect(bebas.map((m) => (m.selesai ? "S" : m.sekarang ? "N" : m.terkunci ? "K" : "-")).join("")).toBe("NSKKK");
    expect(peta.sekarang?.kompetensi.id).toBe(M2);
    expect(peta.selesai).toBe(1);
  });

  it("urutan bebas: misi yang tamat di luar urutan ikut dihitung selesai", () => {
    const peta = petaJenjang({}, new Set([M1, K1]), KOMP, "PAUD", TRACKS);
    expect(peta.sekarang?.nomor).toBe(2);
    expect(peta.selesai).toBe(2);
  });

  it("progres misi yang belum selesai diteruskan; misi selesai = 1", () => {
    const peta = petaJenjang({}, new Set([M1]), KOMP, "PAUD", TRACKS, new Map([[M2, 0.5], [M1, 0.3]]));
    const misi = peta.unit.flatMap((u) => u.misi);
    expect(misi.slice(0, 3).map((m) => m.progres)).toEqual([1, 0.5, 0]);
  });

  it("dikuasai juga dihitung selesai", () => {
    const peta = petaJenjang({ [M1]: p("dikuasai") }, new Set(), KOMP, "PAUD", TRACKS);
    expect(peta.sekarang?.kompetensi.id).toBe(M2);
    expect(peta.inti).toEqual({ dikuasai: 1, total: 4 });
  });

  it("semua misi selesai tapi inti belum dikuasai → pemantapan, belum tercapai", () => {
    const peta = petaJenjang({ [M1]: p("dikuasai") }, new Set([M2, M3, K1, K2]), KOMP, "PAUD", TRACKS);
    expect(peta.sekarang).toBeUndefined();
    expect(peta.tercapai).toBe(false);
    expect(peta.pemantapan?.kompetensi.id).toBe(M2);
  });

  it("semua inti dikuasai → tercapai tanpa pemantapan", () => {
    const peng = { [M1]: p("dikuasai"), [M2]: p("dikuasai"), [K1]: p("dikuasai"), [K2]: p("dikuasai") };
    const peta = petaJenjang(peng, new Set([M3]), KOMP, "PAUD", TRACKS);
    expect(peta.tercapai).toBe(true);
    expect(peta.pemantapan).toBeUndefined();
    expect(peta.unit[0].lencana).toBe("emas");
  });
});

describe("kompetensiSelesai", () => {
  const PAKET = [paket("a", "PAUD", [M1, M2]), paket("b", "PAUD", [K1])];
  it("paket tamat ≥ 60% menandai semua kompetensinya; di bawah ambang & paket asing diabaikan", () => {
    const set = kompetensiSelesai([tamat("a", 3, 2), tamat("b", 2, 3), tamat("x", 5, 0), ev("activity_start", "b")], PAKET);
    expect([...set].sort()).toEqual([M1, M2]);
  });
});

describe("jenjangBerikut", () => {
  it("melompat ke jenjang berikut yang punya kurikulum", () => {
    expect(jenjangBerikut("PAUD", KOMP)).toBe("TKA");
    expect(jenjangBerikut("TKA", KOMP)).toBeUndefined();
  });
});

describe("paketMisi", () => {
  const PAKET = [paket("b", "PAUD", [M1]), paket("a", "PAUD", [M2, M1]), paket("c", "TKA", [M1]), paket("d", "PAUD", [M1])];
  it("jenjang sama, kompetensi utama, lalu yang paling jarang dimulai", () => {
    expect(paketMisi(M1, PAKET, [], "PAUD")?.id).toBe("b");
    expect(paketMisi(M1, PAKET, [ev("activity_start", "b")], "PAUD")?.id).toBe("d");
    expect(paketMisi("TIDAK.ADA", PAKET, [], "PAUD")).toBeUndefined();
  });
});

describe("progresMisi", () => {
  const PAKET = [paket("a", "PAUD", [M1, M2]), paket("b", "PAUD", [K1])];
  it("ronde terjauh dalam satu sesi / jumlah ronde paket, maksimal 1", () => {
    const coba = (activityId: string, sessionId: string) => ({ ...ev("attempt", activityId, { correct: true }), sessionId }) as GameEvent;
    const n = PAKET[0].rounds;
    const ev2 = [...Array.from({ length: Math.ceil(n / 2) }, () => coba("a", "s1")), coba("a", "s2"), coba("b", "s1"), coba("x", "s1")];
    const pr = progresMisi(ev2, PAKET);
    expect(pr.get(M1)).toBeCloseTo(Math.ceil(n / 2) / n);
    expect(pr.get(M2)).toBeCloseTo(Math.ceil(n / 2) / n);
    expect(pr.get(K1)).toBeCloseTo(1 / PAKET[1].rounds);
  });
});
