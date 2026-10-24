import { describe, expect, it } from "vitest";
import type { GameEvent } from "@akademi/schema";
import { lencana, pangkat, statusLencana, stiker } from "../koleksi";
import { proyeksi } from "../mastery";
import { LEARNER, SESSION, attempt, buktiKuat, idBaru, kompetensi, paket, waktuHari } from "./helper";

const C1 = "MAT.PAUD.BILANGAN-1-5.01";
const C2 = "MAT.PAUD.BILANGAN-1-5.02";
const C3 = "MAT.PAUD.BENTUK.01";
const K1 = "KODE.PAUD.URUTAN.01";
const T1 = "MAT.TKA.BILANGAN-1-10.01";

function selesai(activityId: string, successCount: number, failCount: number, hari = 0): GameEvent {
  return {
    id: idBaru(),
    learnerId: LEARNER,
    sessionId: SESSION,
    activityId,
    mechanic: "pilah",
    type: "activity_end",
    clientAt: waktuHari(hari),
    payload: { outcome: "selesai", successCount, failCount, hintCount: 0, durationMs: 1000 },
  };
}

const PAKET = [paket("paket-a", "PAUD", [C1]), paket("paket-b", "PAUD", [C2])];

describe("stiker", () => {
  it("hanya activity_end dengan sukses ≥ 60%; attempt & paket asing diabaikan", () => {
    const ev = [selesai("paket-a", 3, 2), selesai("paket-b", 2, 3), selesai("tak-ada", 5, 0), attempt([C1])];
    const s = stiker(ev, PAKET);
    expect(s).toHaveLength(1);
    expect(s[0]).toEqual({ paketId: "paket-a", pertamaAt: waktuHari(0), kali: 1 });
  });

  it("satu stiker per paket, kali = jumlah penyelesaian, pertamaAt = yang paling awal, urut terbaru dulu", () => {
    const ev = [selesai("paket-a", 5, 0, 2), selesai("paket-b", 4, 1, 1), selesai("paket-a", 4, 0, 0), selesai("paket-a", 1, 4, 5)];
    const s = stiker(ev, PAKET);
    expect(s.map((x) => x.paketId)).toEqual(["paket-a", "paket-b"]);
    expect(s[0]).toEqual({ paketId: "paket-a", pertamaAt: waktuHari(0), kali: 2 });
    expect(s[1].kali).toBe(1);
    expect(stiker([], PAKET)).toEqual([]);
    expect(stiker([selesai("paket-a", 0, 0)], PAKET)).toEqual([]);
  });
});

describe("lencana", () => {
  it("statusLencana: emas / perak / perunggu / terkunci", () => {
    expect(statusLencana([])).toBe("terkunci");
    expect(statusLencana(["belum", "belum"])).toBe("terkunci");
    expect(statusLencana(["berkembang", "belum"])).toBe("perunggu");
    expect(statusLencana(["dikuasai", "belum"])).toBe("perunggu");
    expect(statusLencana(["dikuasai", "berkembang"])).toBe("perak");
    expect(statusLencana(["berkembang", "berkembang"])).toBe("perunggu");
    expect(statusLencana(["dikuasai", "dikuasai"])).toBe("emas");
  });

  it("mengelompokkan per track×level×unit dan hanya menimbang kompetensi inti", () => {
    const k = [kompetensi(C1, { core: true }), kompetensi(C2, { core: true }), kompetensi(C3, { core: true }), kompetensi(K1), kompetensi(T1, { core: true })];
    const peng = proyeksi([...buktiKuat(C1), attempt([C2]), ...buktiKuat(K1)], k);
    const l = lencana(peng, k);
    expect(l).toHaveLength(4);
    expect(l[0]).toEqual({ track: "MAT", level: "PAUD", unitId: "BILANGAN-1-5", nama: "BILANGAN-1-5", status: "perak" });
    expect(l[1]).toMatchObject({ unitId: "BENTUK", status: "terkunci" });
    // unit tanpa kompetensi inti tetap terkunci walau non-inti dikuasai
    expect(l[2]).toMatchObject({ track: "KODE", unitId: "URUTAN", status: "terkunci" });
    expect(l[3]).toMatchObject({ level: "TKA", status: "terkunci" });
  });

  it("emas bila semua inti dikuasai", () => {
    const k = [kompetensi(C1, { core: true }), kompetensi(C2, { core: true }), kompetensi(C3)];
    const peng = proyeksi([...buktiKuat(C1), ...buktiKuat(C2)], k);
    expect(lencana(peng, k).map((x) => x.status)).toEqual(["emas", "terkunci"]);
  });
});

describe("pangkat", () => {
  it("sembilan jenjang PAUD–SD 6 dengan nama pangkat; progres = inti dikuasai / inti total lintas track", () => {
    const k = [kompetensi(C1, { core: true }), kompetensi(K1, { core: true }), kompetensi(C2), kompetensi(T1, { core: true })];
    const peng = proyeksi(buktiKuat(C1), k);
    const p = pangkat(peng, k);
    expect(p.map((x) => [x.level, x.nama])).toEqual([
      ["PAUD", "Tunas"],
      ["TKA", "Kadet"],
      ["TKB", "Navigator"],
      ["SD1", "Pilot"],
      ["SD2", "Kapten"],
      ["SD3", "Komandan"],
      ["SD4", "Laksamana"],
      ["SD5", "Penjelajah"],
      ["SD6", "Legenda"],
    ]);
    expect(p[0]).toMatchObject({ progres: 0.5, tercapai: false });
    expect(p[1]).toMatchObject({ progres: 0, tercapai: false });
    // jenjang tanpa inti sama sekali → progres 0 dan tidak tercapai
    expect(p[2]).toMatchObject({ progres: 0, tercapai: false });
  });

  it("tercapai bila semua inti kedua track dikuasai; non-inti tidak berpengaruh", () => {
    const k = [kompetensi(C1, { core: true }), kompetensi(K1, { core: true }), kompetensi(C2)];
    const peng = proyeksi([...buktiKuat(C1), ...buktiKuat(K1)], k);
    expect(pangkat(peng, k)[0]).toEqual({ level: "PAUD", nama: "Tunas", progres: 1, tercapai: true });
  });
});
