import { describe, expect, it } from "vitest";
import type { GameEvent } from "@akademi/schema";
import { eventDariBaris, nilaiKelulusan, type BarisEvent } from "../sertifikat-inti";
import { buktiKuat, kompetensi } from "./helper";

const C1 = "MAT.PAUD.BILANGAN-1-5.01";
const K1 = "KODE.PAUD.URUTAN.01";
const T1 = "MAT.TKA.BILANGAN-1-10.01";
const daftar = [kompetensi(C1, { core: true }), kompetensi(K1, { core: true }), kompetensi(T1, { core: true })];

/** Event → baris tabel; created_at bisa dipaksa (meniru jam server). */
const keBaris = (e: GameEvent, createdAt = e.clientAt): BarisEvent => ({
  id: e.id,
  member_id: e.learnerId,
  session_id: e.sessionId,
  activity_id: e.activityId,
  mechanic: e.mechanic,
  type: e.type,
  payload: e.payload,
  client_at: e.clientAt,
  created_at: createdAt,
});

describe("eventDariBaris", () => {
  it("memakai jam server (created_at), bukan jam HP", () => {
    const [e] = buktiKuat(C1, 1);
    const [hasil] = eventDariBaris([keBaris(e, "2026-11-15T03:00:00.000Z")]);
    expect(hasil.clientAt).toBe("2026-11-15T03:00:00.000Z");
  });

  it("membuang baris yang tidak lolos skema", () => {
    const [e] = buktiKuat(C1, 1);
    const rusak = { ...keBaris(e), payload: { correct: "ya" } };
    expect(eventDariBaris([rusak, { ...keBaris(e), created_at: "bukan-tanggal" }])).toEqual([]);
  });
});

describe("nilaiKelulusan", () => {
  it("lulus bila semua kompetensi inti jenjang dikuasai; jenjang berikut dibuka", () => {
    const rows = [...buktiKuat(C1), ...buktiKuat(K1)].map((e) => keBaris(e));
    const k = nilaiKelulusan(eventDariBaris(rows), daftar, "PAUD");
    expect(k.lulus).toBe(true);
    expect([k.dikuasai, k.total]).toEqual([2, 2]);
    expect(k.berikut).toBe("TKA");
    expect(k.snapshot.kompetensi.map((x) => x.id)).toEqual([C1, K1]);
  });

  it("jam HP dimundurkan tapi semua diterima server di hari yang sama → belum lulus", () => {
    const sama = "2026-11-15T03:00:00.000Z";
    const rows = [...buktiKuat(C1), ...buktiKuat(K1)].map((e) => keBaris(e, sama));
    const k = nilaiKelulusan(eventDariBaris(rows), daftar, "PAUD");
    expect(k.lulus).toBe(false);
    expect(k.dikuasai).toBe(0);
  });

  it("satu kompetensi inti kurang → belum lulus", () => {
    const k = nilaiKelulusan(eventDariBaris(buktiKuat(C1).map((e) => keBaris(e))), daftar, "PAUD");
    expect(k.lulus).toBe(false);
    expect([k.dikuasai, k.total]).toEqual([1, 2]);
  });
});
