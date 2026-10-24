import { describe, expect, it } from "vitest";
import { ContentPack, type PaketNavigasi } from "@akademi/schema";
import { buatRonde, buatRondeNavigasi, hitungBlok, jalankan, knobDefaults, nilai, nilaiNavigasi, optimal, type NavBlock, type NavGrid } from "../src";
import lurus from "../../../content/golden/paket-robot-ke-bintang-lurus.json";

const grid = (over: Partial<NavGrid> = {}): NavGrid => ({
  id: "g", w: 5, h: 3, start: { x: 0, y: 1, dir: "E" }, goal: { x: 3, y: 1 }, walls: [], rocks: [], optimal: 3, ...over,
});
const M: NavBlock = { cmd: "maju" };
const L: NavBlock = { cmd: "lompat" };

describe("jalankan", () => {
  it("3 maju → bintang; 4 maju berhenti saat sampai", () => {
    expect(jalankan(grid(), [M, M, M]).outcome).toBe("bintang");
    const r = jalankan(grid(), [M, M, M, M]);
    expect(r.outcome).toBe("bintang");
    expect(r.executed).toBe(3);
    expect(r.final).toEqual({ x: 3, y: 1, dir: "E" });
  });
  it("program kosong = kosong; kurang = meleset", () => {
    expect(jalankan(grid(), []).outcome).toBe("kosong");
    expect(jalankan(grid(), [M, M]).outcome).toBe("meleset");
  });
  it("maju ke batu = tersandung", () => {
    const r = jalankan(grid({ rocks: [{ x: 1, y: 1 }] }), [M, M, M]);
    expect(r.outcome).toBe("tersandung");
    expect(r.steps[0].kind).toBe("stumble");
    expect(r.final.x).toBe(0);
  });
  it("lompat di petak kosong pindah 2 petak sehingga meleset", () => {
    const r = jalankan(grid(), [L, L]);
    expect(r.outcome).toBe("meleset");
    expect(r.final.x).toBe(4);
  });
  it("lompat melewati batu → sampai", () => {
    const r = jalankan(grid({ rocks: [{ x: 1, y: 1 }] }), [L, M]);
    expect(r.outcome).toBe("bintang");
    expect(r.steps[0].kind).toBe("jump");
  });
  it("lompat ke dinding/batu/luar grid = tabrak", () => {
    expect(jalankan(grid({ rocks: [{ x: 2, y: 1 }] }), [L]).outcome).toBe("tabrak");
    expect(jalankan(grid({ walls: [{ x: 2, y: 1 }] }), [L]).outcome).toBe("tabrak");
    expect(jalankan(grid({ start: { x: 3, y: 1, dir: "E" }, goal: { x: 0, y: 0 } }), [L]).outcome).toBe("tabrak");
  });
  it("tabrak dinding dan luar grid saat maju", () => {
    expect(jalankan(grid({ walls: [{ x: 1, y: 1 }] }), [M]).outcome).toBe("tabrak");
    expect(jalankan(grid({ start: { x: 0, y: 1, dir: "W" } }), [M]).outcome).toBe("tabrak");
  });
  it("kiri/kanan relatif terhadap arah hadap", () => {
    const g = grid({ start: { x: 2, y: 2, dir: "N" }, goal: { x: 0, y: 0 } });
    const r = jalankan(g, [{ cmd: "kiri" }, M, { cmd: "kanan" }, M]);
    expect(r.steps[0].after.dir).toBe("W");
    expect(r.steps[1].after).toEqual({ x: 1, y: 2, dir: "W" });
    expect(r.steps[2].after.dir).toBe("N");
    expect(r.final).toEqual({ x: 1, y: 1, dir: "N" });
    expect(jalankan(g, [{ cmd: "kanan" }]).final.dir).toBe("E");
  });
  it("ulangi 3 {maju} == 3 maju", () => {
    const a = jalankan(grid(), [{ cmd: "ulangi", n: 3, body: [M] }]);
    const b = jalankan(grid(), [M, M, M]);
    expect(a.outcome).toBe("bintang");
    expect(a.final).toEqual(b.final);
    expect(a.steps.map(s => s.path)).toEqual([[0, 0], [0, 0], [0, 0]]);
    expect(a.executed).toBe(3);
  });
  it("kalau: satu program [ulangi 4 {kalau}] lolos di 3 jalur batu berbeda", () => {
    const prog: NavBlock[] = [{ cmd: "ulangi", n: 4, body: [{ cmd: "kalau" }] }];
    const jalur = (x: number) => grid({ w: 6, goal: { x: 4, y: 1 }, rocks: [{ x, y: 1 }] });
    for (const x of [1, 2, 3]) expect(jalankan(jalur(x), prog).outcome).toBe("bintang");
    expect(jalankan(grid({ w: 6, goal: { x: 4, y: 1 } }), prog).outcome).toBe("bintang");
  });
  it("bendera: stopAtFlag berhenti dengan outcome bendera, tanpa itu dilewati", () => {
    const prog: NavBlock[] = [M, { cmd: "bendera" }, M, M];
    const a = jalankan(grid(), prog, { stopAtFlag: true });
    expect(a.outcome).toBe("bendera");
    expect(a.final.x).toBe(1);
    expect(a.steps[1].kind).toBe("flag");
    expect(jalankan(grid(), prog).outcome).toBe("bintang");
  });
});

describe("optimal & hitungBlok", () => {
  it("BFS lurus", () => { expect(optimal(grid(), ["maju"])).toBe(3); });
  it("BFS dengan belokan", () => {
    expect(optimal(grid({ goal: { x: 2, y: 0 } }), ["maju", "kiri", "kanan"])).toBe(4);
    expect(optimal(grid({ goal: { x: 2, y: 0 } }), ["maju"])).toBeNull();
  });
  it("BFS memakai lompat melewati batu", () => {
    const g = grid({ rocks: [{ x: 1, y: 1 }] });
    expect(optimal(g, ["maju"])).toBeNull();
    expect(optimal(g, ["maju", "lompat"])).toBe(2);
    expect(optimal(grid({ goal: { x: 4, y: 1 } }), ["maju", "lompat"])).toBe(2);
  });
  it("hitungBlok: ulangi = 1 keping + isinya", () => {
    expect(hitungBlok([M, { cmd: "ulangi", n: 3, body: [M, { cmd: "kiri" }] }])).toBe(4);
  });
});

describe("buatRondeNavigasi + nilaiNavigasi", () => {
  const p = ContentPack.parse(lurus) as PaketNavigasi;
  it("knob distance memilih grid dengan optimal == distance", () => {
    for (const d of [1, 2, 3, 4]) {
      const r = buatRondeNavigasi(p, { distance: d }, 7);
      expect(r.grids).toHaveLength(1);
      expect(r.grids[0].optimal).toBe(d);
    }
  });
  it("deterministik untuk seed sama", () => {
    expect(buatRondeNavigasi(p, {}, 3)).toEqual(buatRondeNavigasi(p, {}, 3));
  });
  it("menilai benar/salah dan mengisi bukti", () => {
    const r = buatRondeNavigasi(p, knobDefaults(p), 1);
    const ok = nilaiNavigasi(r, { program: [M, M], runs: 1 });
    expect(ok.benar).toBe(true);
    expect(ok.detail).toMatchObject({ outcome: "bintang", blocks: 2, optimal: 2, efisien: true, lompat: 0, batu: 0, runs: 1 });
    expect(nilaiNavigasi(r, { program: [M] }).benar).toBe(false);
  });
  it("lewat buatRonde/nilai union", () => {
    const ronde = buatRonde(p, { distance: 3 }, 1);
    expect(ronde.mechanic).toBe("navigasi");
    expect(nilai(p, ronde, { program: [M, M, M] }).benar).toBe(true);
  });
  it("rackSlots dilanggar → salah", () => {
    const r = buatRondeNavigasi(p, { distance: 3 }, 1);
    expect(nilaiNavigasi({ ...r, rackSlots: 2 }, { program: [M, M, M] }).benar).toBe(false);
    expect(nilaiNavigasi({ ...r, rackSlots: 2 }, { program: [{ cmd: "ulangi", n: 3, body: [M] }] }).benar).toBe(true);
  });
  it("debug: edits ≠ fixes → salah", () => {
    const r = { ...buatRondeNavigasi(p, { distance: 3 }, 1), debug: true, fixes: 1 };
    expect(nilaiNavigasi(r, { program: [M, M, M], edits: 2 }).benar).toBe(false);
    expect(nilaiNavigasi(r, { program: [M, M, M], edits: 1 }).benar).toBe(true);
  });
  it("mode langsung memakai j.langsung", () => {
    const r = { ...buatRondeNavigasi(p, { distance: 2 }, 1), execMode: "langsung" as const };
    expect(nilaiNavigasi(r, { program: [], langsung: [M, M] }).benar).toBe(true);
  });
  it("semuaGrid: semua grid satu group harus bintang; program awal dari grid", () => {
    const pk = ContentPack.parse({
      ...lurus, id: "kalau-3-jalur", level: "TKB", semuaGrid: true, commands: ["maju", "kalau", "ulangi"], knobs: {},
      grids: [1, 2, 3].map(x => ({
        id: `batu-${x}`, w: 6, h: 1, start: { x: 0, y: 0, dir: "E" }, goal: { x: 4, y: 0 }, rocks: [{ x, y: 0 }], optimal: 3, group: "batu",
        program: [{ cmd: "ulangi", n: 4, body: [{ cmd: "kalau" }] }],
      })),
    }) as PaketNavigasi;
    const r = buatRondeNavigasi(pk, {}, 5);
    expect(r.grids).toHaveLength(3);
    expect(r.program).toEqual([{ cmd: "ulangi", n: 4, body: [{ cmd: "kalau" }] }]);
    expect(nilaiNavigasi(r, { program: r.program }).benar).toBe(true);
    const salah = nilaiNavigasi(r, { program: [L, M, M] });
    expect(salah.benar).toBe(false);
    expect(salah.detail.batu).toBe(1);
  });
});

describe("nilaiNavigasi — bendera & prediksi", () => {
  const panjang = grid({ w: 8, goal: { x: 6, y: 1 }, optimal: 6 });
  it("bendera: batas rak berlaku per bagian, bukan total program", () => {
    const r = { execMode: "program", commands: ["maju", "bendera"], grids: [panjang], program: [], rackSlots: 4 } as unknown as Parameters<typeof nilaiNavigasi>[0];
    const bagian: [NavBlock[], NavBlock[]] = [[M, M, M], [M, M, M]];
    const h = nilaiNavigasi(r, { program: [...bagian[0], { cmd: "bendera" }, ...bagian[1]], bendera: { x: 3, y: 1, bagian } });
    expect(h.detail.benderaTepat).toBe(true);
    expect(h.benar).toBe(true);
    const kepanjangan: [NavBlock[], NavBlock[]] = [[M, M, M, M, M], [M]];
    expect(nilaiNavigasi(r, { program: [...kepanjangan[0], { cmd: "bendera" }, ...kepanjangan[1]], bendera: { x: 5, y: 1, bagian: kepanjangan } }).benar).toBe(false);
  });
  it("prediksi: Agam sampai tetap salah bila tebakan anak kebanyakan meleset", () => {
    const r = { execMode: "langkah", commands: ["maju"], grids: [grid()], program: [M, M, M], prediksi: true } as unknown as Parameters<typeof nilaiNavigasi>[0];
    expect(nilaiNavigasi(r, { program: [M, M, M], prediksi: [true, true, false] }).benar).toBe(true);
    expect(nilaiNavigasi(r, { program: [M, M, M], prediksi: [false, true, false] }).benar).toBe(false);
  });
});
