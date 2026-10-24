import { describe, expect, it } from "vitest";
import { ALFABET_KODE, POLA_KODE, bacaSnapshot, buatKode, rapikanKode, snapshotSertifikat } from "../sertifikat";
import { proyeksi } from "../mastery";
import { attempt, buktiKuat, kompetensi } from "./helper";

const C1 = "MAT.PAUD.BILANGAN-1-5.01";
const C2 = "MAT.PAUD.BILANGAN-1-5.02";
const K1 = "KODE.PAUD.URUTAN.01";
const N1 = "MAT.PAUD.BENTUK.01"; // bukan inti
const T1 = "MAT.TKA.BILANGAN-1-10.01"; // jenjang lain

describe("buatKode", () => {
  it("8 karakter dari alfabet tanpa 0/O/1/I", () => {
    for (let i = 0; i < 200; i++) {
      const k = buatKode();
      expect(k).toHaveLength(8);
      expect(k).toMatch(POLA_KODE);
      expect(k).not.toMatch(/[01OI]/);
    }
  });

  it("deterministik dengan rng yang diberikan; batas 0 dan ~1 aman", () => {
    expect(buatKode(() => 0)).toBe("AAAAAAAA");
    expect(buatKode(() => 0.9999999)).toBe("99999999");
    const urut = [0, 1 / 32, 2 / 32, 3 / 32, 4 / 32, 5 / 32, 6 / 32, 7 / 32];
    let i = 0;
    expect(buatKode(() => urut[i++])).toBe(ALFABET_KODE.slice(0, 8));
  });

  it("rapikanKode membersihkan ketikan pengguna", () => {
    expect(rapikanKode(" ab2c-d3ef ")).toBe("AB2CD3EF");
  });
});

describe("snapshotSertifikat", () => {
  const daftar = [
    kompetensi(C1, { core: true }),
    kompetensi(C2, { core: true }),
    kompetensi(K1, { core: true }),
    kompetensi(N1, { core: false }),
    kompetensi(T1, { core: true }),
  ];

  it("hanya kompetensi inti jenjang itu, urut katalog, status beku + pangkat", () => {
    const peng = proyeksi([...buktiKuat(C1), ...buktiKuat(K1), attempt([C2])], daftar);
    const s = snapshotSertifikat(peng, daftar, "PAUD");
    expect(s.level).toBe("PAUD");
    expect(s.pangkat).toBe("Tunas");
    expect(s.kompetensi.map((k) => k.id)).toEqual([C1, C2, K1]);
    expect(s.kompetensi.map((k) => k.status)).toEqual(["dikuasai", "berkembang", "dikuasai"]);
    expect(s.dikuasai).toBe(2);
    expect(s.total).toBe(3);
    expect(s.kompetensi[0].statement).toEqual({ id: `Aku bisa ${C1}`, en: `I can ${C1}` });
    expect(s.kompetensi[0].track).toBe("MAT");
    expect(s.kompetensi[0].unit.id).toBe("BILANGAN-1-5");
    expect(s.kompetensi[0].refs).toEqual([]);
  });

  it("jenjang tanpa kompetensi inti → kosong", () => {
    const s = snapshotSertifikat({}, daftar, "TKB");
    expect(s.kompetensi).toEqual([]);
    expect(s.total).toBe(0);
    expect(s.pangkat).toBe("Navigator");
  });

  it("snapshot tidak berbagi referensi dengan katalog (beku)", () => {
    const k = kompetensi(C1, { core: true });
    k.refs = [{ framework: "EYFS", code: "M-1" }];
    const s = snapshotSertifikat({}, [k], "PAUD");
    k.refs[0].code = "DIUBAH";
    k.statement.id = "diubah";
    expect(s.kompetensi[0].refs[0].code).toBe("M-1");
    expect(s.kompetensi[0].statement.id).toBe(`Aku bisa ${C1}`);
  });

  it("bacaSnapshot: bulat-balik JSON dan toleran terhadap data rusak", () => {
    const s = snapshotSertifikat({}, daftar, "PAUD");
    expect(bacaSnapshot(JSON.parse(JSON.stringify(s)))).toEqual(s);
    expect(bacaSnapshot(null)).toBeNull();
    expect(bacaSnapshot({ level: "PAUD" })).toBeNull();
    expect(bacaSnapshot({ level: "PAUD", kompetensi: [null, { id: "X" }] })?.kompetensi).toHaveLength(1);
  });
});
