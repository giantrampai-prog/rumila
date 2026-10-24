import { describe, expect, it } from "vitest";
import type { GameEvent } from "@akademi/schema";
import type { Penguasaan, Status } from "../mastery";
import { jenjangBerikut, paketMisi, petaJenjang } from "../peta";
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
  kompetensi(M3, { core: false, prereq: [M2] }),
  kompetensi(K1, { core: true }),
  kompetensi(K2, { core: true, prereq: [K1, "LUAR.KATALOG.01"] }),
  kompetensi(T1, { core: true }),
];

const p = (status: Status, hari = 0): Penguasaan => ({ status, success: 0, fail: 0, contexts: 0, days: 0, ratioLast10: 0, hintTail: 0, lastAt: waktuHari(hari) });
const SEKARANG = new Date(waktuHari(10)).getTime();

describe("petaJenjang", () => {
  it("mengelompokkan per pelajaran dan unit sesuai urutan kurikulum", () => {
    const peta = petaJenjang({}, KOMP, "PAUD", ["MAT", "KODE"], SEKARANG);
    expect(peta.pelajaran.map((x) => x.track)).toEqual(["MAT", "KODE"]);
    expect(peta.pelajaran[0].unit.map((u) => u.id)).toEqual(["BILANGAN", "BENTUK"]);
    expect(peta.inti).toEqual({ dikuasai: 0, total: 4 });
  });

  it("prasyarat belum → terkunci; prasyarat di luar katalog dianggap lulus", () => {
    const peta = petaJenjang({ [K1]: p("berkembang") }, KOMP, "PAUD", ["MAT", "KODE"], SEKARANG);
    const mat = peta.pelajaran[0].unit[0].misi;
    expect(mat.map((m) => m.terbuka)).toEqual([true, false]);
    const kode = peta.pelajaran[1].unit[0].misi;
    expect(kode.map((m) => m.terbuka)).toEqual([true, true]);
  });

  it("'sekarang' = misi terbuka pertama yang belum dikuasai", () => {
    const peta = petaJenjang({ [M1]: p("dikuasai", 9) }, KOMP, "PAUD", ["MAT", "KODE"], SEKARANG);
    const mat = peta.pelajaran[0];
    expect(mat.sekarang?.kompetensi.id).toBe(M2);
    expect(mat.unit[0].misi.filter((m) => m.sekarang)).toHaveLength(1);
  });

  it("Lanjut memilih pelajaran yang progres intinya paling tertinggal", () => {
    const peta = petaJenjang({ [M1]: p("dikuasai", 9) }, KOMP, "PAUD", ["MAT", "KODE"], SEKARANG);
    expect(peta.lanjut?.track).toBe("KODE");
    expect(peta.lanjut?.misi.kompetensi.id).toBe(K1);
  });

  it("semua dikuasai → tercapai; Lanjut jatuh ke latihan ulang terlama", () => {
    const peng = { [M1]: p("dikuasai", 1), [M2]: p("dikuasai", 2), [M3]: p("dikuasai", 9), [K1]: p("dikuasai", 9), [K2]: p("dikuasai", 9) };
    const peta = petaJenjang(peng, KOMP, "PAUD", ["MAT", "KODE"], SEKARANG);
    expect(peta.tercapai).toBe(true);
    expect(peta.pelajaran[0].unit[0].misi.map((m) => m.ulang)).toEqual([true, true]);
    expect(peta.lanjut?.misi.kompetensi.id).toBe(M1);
  });

  it("lencana unit mengikuti status kompetensi inti", () => {
    const peta = petaJenjang({ [M1]: p("dikuasai"), [M2]: p("dikuasai") }, KOMP, "PAUD", ["MAT"], SEKARANG);
    expect(peta.pelajaran[0].unit.map((u) => u.lencana)).toEqual(["emas", "terkunci"]);
  });
});

describe("jenjangBerikut", () => {
  it("melompat ke jenjang berikut yang punya kurikulum", () => {
    expect(jenjangBerikut("PAUD", KOMP)).toBe("TKA");
    expect(jenjangBerikut("TKA", KOMP)).toBeUndefined();
  });
});

describe("paketMisi", () => {
  const mulai = (activityId: string): GameEvent => ({ id: idBaru(), learnerId: LEARNER, sessionId: SESSION, activityId, mechanic: "pilah", type: "activity_start", clientAt: waktuHari(0), payload: {} } as GameEvent);
  const PAKET = [paket("b", "PAUD", [M1]), paket("a", "PAUD", [M1]), paket("c", "TKA", [M1]), paket("d", "PAUD", [M2])];

  it("jenjang sama dulu, lalu yang paling jarang dimulai", () => {
    expect(paketMisi(M1, PAKET, [], "PAUD")?.id).toBe("a");
    expect(paketMisi(M1, PAKET, [mulai("a")], "PAUD")?.id).toBe("b");
    expect(paketMisi(M2, PAKET, [], "PAUD")?.id).toBe("d");
    expect(paketMisi("TIDAK.ADA", PAKET, [], "PAUD")).toBeUndefined();
  });
});
