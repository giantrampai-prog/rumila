import { describe, expect, it } from "vitest";
import { ContentPack, type PaketPola, type PaketSimulasi } from "@akademi/schema";
import {
  ALAT_BERAT, ALAT_PANJANG, buatRonde, buatRondePola, buatRondeSimulasi, knobDefaults, nilai, nilaiPola, nilaiSimulasi,
  type RondePola, type RondeSimulasi,
} from "../src";

/* ---------------- pabrik paket uji ---------------- */

const dasar = {
  version: "1.0.0", level: "PAUD", competencyIds: ["KODE.PAUD.POLA.01"], instructionKey: "instruksi", knobs: {},
};
const locale = (keys: string[]) => {
  const d: Record<string, string> = { instruksi: "Ayo", judul: "Judul" };
  for (const k of keys) d[k] = k;
  return { id: d, en: { ...d } };
};

function paketPola(over: Partial<Record<string, unknown>> = {}): PaketPola {
  const items = [
    { id: "apel", labelKey: "apel", emoji: "🍎" },
    { id: "pisang", labelKey: "pisang", emoji: "🍌" },
    { id: "anggur", labelKey: "anggur", emoji: "🍇" },
    { id: "jeruk", labelKey: "jeruk", emoji: "🍊" },
  ];
  return ContentPack.parse({
    ...dasar, id: "pola-uji", mechanic: "pola", items, locale: locale(items.map(i => i.id)), ...over,
  }) as PaketPola;
}

function paketSim(mode: PaketSimulasi["mode"], items: Array<Record<string, unknown>>, over: Partial<Record<string, unknown>> = {}): PaketSimulasi {
  return ContentPack.parse({
    ...dasar, id: `sim-${mode}`, mechanic: "simulasi", mode, items,
    locale: locale(items.map(i => String(i.id))), ...over,
  }) as PaketSimulasi;
}

const BENDA_BERAT = [
  { id: "balon", labelKey: "balon", role: "benda", value: 1, scale: 2 },
  { id: "batu", labelKey: "batu", role: "benda", value: 5, scale: 0.6 },
  { id: "buku", labelKey: "buku", role: "benda", value: 3, scale: 1 },
];
const BENDA_PANJANG = [
  { id: "pensil", labelKey: "pensil", role: "benda", value: 3 },
  { id: "sendok", labelKey: "sendok", role: "benda", value: 2 },
  { id: "ular", labelKey: "ular", role: "benda", value: 9 },
];
const HEWAN = [
  { id: "kucing", labelKey: "kucing", role: "hewan", value: 1 },
  { id: "gajah", labelKey: "gajah", role: "hewan", value: 2 },
  { id: "bebek", labelKey: "bebek", role: "hewan", value: 1 },
];
const TOMBOL_ALAT = [
  { id: "merah", labelKey: "merah", role: "tombol" },
  { id: "biru", labelKey: "biru", role: "tombol" },
  { id: "hijau", labelKey: "hijau", role: "tombol" },
  { id: "lampu", labelKey: "lampu", role: "alat" },
  { id: "kipas", labelKey: "kipas", role: "alat" },
  { id: "radio", labelKey: "radio", role: "alat" },
];
const ALAT = [
  ...HEWAN,
  { id: "penggaris-kubus", labelKey: "penggaris-kubus", role: "alat" },
  { id: "timbangan", labelKey: "timbangan", role: "alat" },
];

/* ---------------- pola ---------------- */

describe("pola lanjut", () => {
  const p = paketPola({ mode: "lanjut" });
  it("unit 2 benda berbeda, 3 ulangan + 1 slot kosong, palette = unit + 1 pengecoh, deterministik", () => {
    const r = buatRondePola(p, {}, 7);
    expect(r.unitLen).toBe(2);
    expect(r.correct).toHaveLength(7);
    expect(r.shown.slice(0, 6)).toEqual(r.correct.slice(0, 6));
    expect(r.shown[6]).toBeNull();
    const unit = r.correct.slice(0, 2);
    expect(new Set(unit).size).toBe(2);
    for (let i = 0; i < 7; i++) expect(r.correct[i]).toBe(unit[i % 2]);
    expect(r.palette).toHaveLength(3);
    expect(r.palette.map(i => i.id).sort()).toEqual([...unit, ...r.palette.map(i => i.id).filter(id => !unit.includes(id))].sort());
    expect(buatRondePola(p, {}, 7)).toEqual(r);
    expect(buatRondePola(p, {}, 8).correct).not.toEqual(r.correct);
  });
  it("knob blanks 2 & distractor 0 → 2 slot kosong, palette = unit saja; patterns terisi dipakai sebagai unit", () => {
    const pp = paketPola({ mode: "lanjut", unitLen: 3, patterns: [{ id: "abc", unit: ["apel", "pisang", "anggur"] }] });
    const r = buatRondePola(pp, { blanks: 2, distractor: 0, shown: 2 }, 3);
    expect(r.correct).toEqual(["apel", "pisang", "anggur", "apel", "pisang", "anggur", "apel", "pisang"]);
    expect(r.shown.filter(x => x === null)).toHaveLength(2);
    expect(r.palette.map(i => i.id).sort()).toEqual(["anggur", "apel", "pisang"]);
  });
  it("nilai: jawaban == correct benar; salah satu slot gagal dengan indeks salah", () => {
    const r = buatRondePola(p, { blanks: 2 }, 11);
    expect(nilaiPola(r, r.correct).benar).toBe(true);
    const salah = r.correct.slice();
    salah[salah.length - 1] = salah[salah.length - 2];
    const h = nilaiPola(r, salah);
    expect(h.benar).toBe(false);
    expect(h.detail.salah).toEqual([salah.length - 1]);
  });
});

describe("pola perbaiki", () => {
  const p = paketPola({ mode: "perbaiki" });
  it("8 unsur, satu diganti benda lain yang ≠ tetangga; posisi 0 = tengah, 1 = ujung", () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      const r = buatRondePola(p, { posisi: 0 }, seed);
      expect(r.correct).toHaveLength(8);
      expect(r.shown).toHaveLength(8);
      const w = r.wrongIndex!;
      expect([3, 4]).toContain(w);
      expect(r.shown[w]).not.toBe(r.correct[w]);
      expect(r.shown[w]).not.toBe(r.correct[w - 1]);
      expect(r.shown[w]).not.toBe(r.correct[w + 1]);
      expect(r.shown.filter((x, i) => x !== r.correct[i])).toHaveLength(1);
      expect(r.palette.map(i => i.id)).toContain(r.shown[w]);
      expect([0, 1, 6, 7]).toContain(buatRondePola(p, { posisi: 1 }, seed).wrongIndex);
    }
  });
  it("nilai: ganti tepat satu → benar; ubah 2 posisi gagal; tidak diubah gagal", () => {
    const r = buatRondePola(p, {}, 9);
    expect(nilaiPola(r, r.correct)).toEqual({ benar: true, detail: { diubah: [r.wrongIndex], wrongIndex: r.wrongIndex } });
    const dua = r.correct.slice();
    const lain = r.wrongIndex === 0 ? 7 : 0;
    dua[lain] = r.palette.find(i => i.id !== r.correct[lain])!.id;
    const h = nilaiPola(r, dua);
    expect(h.benar).toBe(false);
    expect(h.detail.diubah).toHaveLength(2);
    expect(nilaiPola(r, r.shown.map(x => x ?? "")).benar).toBe(false);
  });
});

describe("pola cipta", () => {
  const p = paketPola({ mode: "cipta" });
  it("shown = null × slots, pilih = unitLen, palette semua benda", () => {
    const r = buatRondePola(p, { slots: 6 }, 2);
    expect(r.shown).toEqual([null, null, null, null, null, null]);
    expect(r.pilih).toBe(2);
    expect(r.correct).toEqual([]);
    expect(r.palette).toHaveLength(4);
  });
  const r = buatRondePola(p, { slots: 6 }, 2);
  it("ABABAB dan BABABA sah (boleh mulai dari unsur mana pun)", () => {
    expect(nilaiPola(r, ["apel", "pisang", "apel", "pisang", "apel", "pisang"]).benar).toBe(true);
    expect(nilaiPola(r, ["pisang", "apel", "pisang", "apel", "pisang", "apel"]).benar).toBe(true);
  });
  it("AABAAB (tidak periodik dengan unit 2) tidak sah", () => {
    const h = nilaiPola(r, ["apel", "apel", "pisang", "apel", "apel", "pisang"]);
    expect(h.benar).toBe(false);
    expect(h.detail.periodik).toBe(false);
  });
  it("pakai 3 benda untuk unitLen 2 tidak sah; panjang kurang tidak sah", () => {
    expect(nilaiPola(r, ["apel", "pisang", "anggur", "apel", "pisang", "anggur"]).benar).toBe(false);
    expect(nilaiPola(r, ["apel", "pisang", "apel", "pisang"]).benar).toBe(false);
  });
  it("unitLen 3: slots dipaksa ≥ 2 ulangan penuh; ABCABC sah, ABABAB tidak", () => {
    const p3 = paketPola({ mode: "cipta", unitLen: 3 });
    const r3 = buatRondePola(p3, { slots: 4 }, 5);
    expect(r3.shown).toHaveLength(6);
    expect(nilaiPola(r3, ["apel", "pisang", "anggur", "apel", "pisang", "anggur"]).benar).toBe(true);
    expect(nilaiPola(r3, ["apel", "pisang", "apel", "pisang", "apel", "pisang"]).benar).toBe(false);
  });
});

/* ---------------- simulasi ---------------- */

describe("simulasi jam", () => {
  it("jam-baca: target 1..hourMax, options 3–4 memuat target & unik; nilai angka", () => {
    const p = paketSim("jam-baca", [{ id: "jam", labelKey: "jam" }]);
    for (const seed of [1, 2, 3, 4, 5, 6]) {
      const r = buatRondeSimulasi(p, { hourMax: 6 }, seed);
      expect(r.target).toBeGreaterThanOrEqual(1);
      expect(r.target).toBeLessThanOrEqual(6);
      expect(r.options.length).toBeGreaterThanOrEqual(3);
      expect(r.options.length).toBeLessThanOrEqual(4);
      expect(r.options).toContain(r.target);
      expect(new Set(r.options).size).toBe(r.options.length);
      expect(nilaiSimulasi(r, { angka: r.target }).benar).toBe(true);
      expect(nilaiSimulasi(r, { angka: r.target === 6 ? 5 : r.target + 1 }).benar).toBe(false);
    }
    expect(buatRondeSimulasi(p, { hourMax: 6 }, 4)).toEqual(buatRondeSimulasi(p, { hourMax: 6 }, 4));
  });
  it("jam-putar: kegiatan acak → target = value, correctId = id", () => {
    const p = paketSim("jam-putar", [
      { id: "sekolah", labelKey: "sekolah", role: "kegiatan", value: 7 },
      { id: "tidur", labelKey: "tidur", role: "kegiatan", value: 9 },
    ]);
    const r = buatRondeSimulasi(p, {}, 3);
    expect(r.items).toHaveLength(1);
    expect(r.correctId).toBe(r.items[0].id);
    expect(r.target).toBe(r.items[0].value);
    expect(nilaiSimulasi(r, { angka: r.target }).benar).toBe(true);
    expect(nilaiSimulasi(r, { angka: r.target + 1 }).benar).toBe(false);
  });
});

describe("simulasi timbangan & alat", () => {
  it("timbangan: dua benda beda berat, correctId = lebih berat; tipuan=1 pilih besar-ringan", () => {
    const p = paketSim("timbangan", BENDA_BERAT);
    const r = buatRondeSimulasi(p, {}, 5);
    expect(r.items).toHaveLength(2);
    const berat = r.items.reduce((a, b) => ((a.value ?? 0) > (b.value ?? 0) ? a : b));
    expect(r.correctId).toBe(berat.id);
    expect(nilaiSimulasi(r, { pilih: berat.id }).benar).toBe(true);
    expect(nilaiSimulasi(r, { pilih: r.items.find(i => i.id !== berat.id)!.id }).benar).toBe(false);
    for (const seed of [1, 2, 3]) {
      const t = buatRondeSimulasi(p, { tipuan: 1 }, seed);
      // pasangan tipuan: yang tampak besar justru lebih ringan; yang benar = yang kecil
      const [a, b] = t.items;
      const besar = (a.scale ?? 1) > (b.scale ?? 1) ? a : b;
      const kecil = besar === a ? b : a;
      expect(besar.scale!).toBeGreaterThan(kecil.scale!);
      expect(besar.value!).toBeLessThan(kecil.value!);
      expect(t.correctId).toBe(kecil.id);
    }
  });
  it("alat: hewan value 1 → penggaris-kubus, 2 → timbangan", () => {
    const p = paketSim("alat", ALAT);
    const dilihat = new Set<string>();
    for (const seed of [1, 2, 3, 4, 5, 6]) {
      const r = buatRondeSimulasi(p, {}, seed);
      const h = r.items[0];
      expect(h.role).toBe("hewan");
      expect(r.correctId).toBe(h.value === 2 ? ALAT_BERAT : ALAT_PANJANG);
      expect(r.items.map(i => i.id)).toContain(r.correctId);
      dilihat.add(r.correctId!);
      expect(nilaiSimulasi(r, { pilih: r.correctId! }).benar).toBe(true);
      expect(nilaiSimulasi(r, { pilih: r.correctId === ALAT_BERAT ? ALAT_PANJANG : ALAT_BERAT }).benar).toBe(false);
    }
    expect(dilihat).toEqual(new Set([ALAT_BERAT, ALAT_PANJANG]));
  });
});

describe("simulasi jengkal & kubus", () => {
  it("jengkal: benda ≤ maxSpans, snap dari knob; posisi rapat sah, celah 0.5 gagal, tumpang tindih gagal, angka salah gagal", () => {
    const p = paketSim("jengkal", BENDA_PANJANG);
    const r = buatRondeSimulasi(p, { maxSpans: 5, snap: 1 }, 2);
    expect(r.target).toBeLessThanOrEqual(5);
    expect(r.snap).toBe(true);
    expect(buatRondeSimulasi(p, { maxSpans: 5, snap: 0 }, 2).snap).toBe(false);
    const n = r.target;
    const rapat = Array.from({ length: n }, (_, i) => i);
    expect(nilaiSimulasi(r, { posisi: rapat, angka: n }).benar).toBe(true);
    expect(nilaiSimulasi(r, { posisi: rapat.map(x => x * 1.1), angka: n }).benar).toBe(true);
    const celah = nilaiSimulasi(r, { posisi: rapat.map((x, i) => (i === n - 1 ? x + 0.5 : x)), angka: n });
    expect(celah.benar).toBe(false);
    expect(celah.detail.celah).toBe(1);
    const tumpang = nilaiSimulasi(r, { posisi: rapat.map((x, i) => (i === n - 1 ? x - 0.5 : x)), angka: n });
    expect(tumpang.benar).toBe(false);
    expect(tumpang.detail.tumpang).toBe(1);
    expect(nilaiSimulasi(r, { posisi: rapat, angka: n + 1 }).benar).toBe(false);
    expect(nilaiSimulasi(r, { posisi: [...rapat, n], angka: n }).benar).toBe(false);
  });
  it("kubus: target = value, offset dari knob; nilai angka", () => {
    const p = paketSim("kubus", BENDA_PANJANG);
    const r = buatRondeSimulasi(p, { offset: 1 }, 4);
    expect(r.offset).toBe(1);
    expect(r.target).toBe(r.items[0].value);
    expect(nilaiSimulasi(r, { angka: r.target }).benar).toBe(true);
    expect(nilaiSimulasi(r, { angka: r.target + 1 }).benar).toBe(false);
  });
});

describe("simulasi turus & taksir", () => {
  it("turus: count hewan dari kinds jenis, flashMs = gapMs; nilai per jenis, salah satu jenis gagal", () => {
    const p = paketSim("turus", HEWAN);
    const r = buatRondeSimulasi(p, { count: 7, kinds: 2, gapMs: 900 }, 3);
    expect(r.urutan).toHaveLength(7);
    expect(r.items).toHaveLength(2);
    expect(new Set(r.urutan).size).toBe(2);
    expect(r.flashMs).toBe(900);
    const benar: Record<string, number> = {};
    for (const id of r.urutan) benar[id] = (benar[id] ?? 0) + 1;
    expect(nilaiSimulasi(r, { turus: benar }).benar).toBe(true);
    const [a, b] = Object.keys(benar);
    const h = nilaiSimulasi(r, { turus: { [a]: benar[a], [b]: benar[b] + 1 } });
    expect(h.benar).toBe(false);
    expect(h.detail.salah).toEqual([b]);
    expect(nilaiSimulasi(r, { turus: { [a]: benar[a] } }).benar).toBe(false);
  });
  it("taksir: target 8..max, options [0,20], flashMs; selisih 3 sah, 4 gagal", () => {
    const p = paketSim("taksir", BENDA_BERAT);
    const r = buatRondeSimulasi(p, { max: 15, flashMs: 800 }, 6);
    expect(r.target).toBeGreaterThanOrEqual(8);
    expect(r.target).toBeLessThanOrEqual(15);
    expect(r.options).toEqual([0, 20]);
    expect(r.flashMs).toBe(800);
    expect(nilaiSimulasi(r, { angka: r.target + 3 })).toMatchObject({ benar: true, detail: { selisih: 3 } });
    expect(nilaiSimulasi(r, { angka: r.target - 3 }).benar).toBe(true);
    expect(nilaiSimulasi(r, { angka: r.target + 4 })).toMatchObject({ benar: false, detail: { selisih: 4 } });
  });
});

describe("simulasi tombol & bagi", () => {
  it("tombol: peta pairs tombol→alat unik, urutan = semua tombol diacak; semua tebakan benar sah, salah satu gagal", () => {
    const p = paketSim("tombol", TOMBOL_ALAT);
    const r = buatRondeSimulasi(p, { pairs: 3 }, 8);
    expect(Object.keys(r.peta)).toHaveLength(3);
    expect(new Set(Object.values(r.peta)).size).toBe(3);
    expect([...r.urutan].sort()).toEqual(Object.keys(r.peta).sort());
    expect(r.items).toHaveLength(6);
    expect(nilaiSimulasi(r, { tebakan: { ...r.peta } }).benar).toBe(true);
    const [t0, t1] = r.urutan;
    const salah = { ...r.peta, [t0]: r.peta[t1] };
    const h = nilaiSimulasi(r, { tebakan: salah });
    expect(h.benar).toBe(false);
    expect(h.detail.salah).toEqual([t0]);
    expect(buatRondeSimulasi(p, { pairs: 2 }, 8).urutan).toHaveLength(2);
  });
  it("bagi: target genap ≤ max dari {2,4,6,8}; 3-3 untuk 6 sah, 2-4 gagal", () => {
    const p = paketSim("bagi", BENDA_BERAT);
    for (const seed of [1, 2, 3, 4, 5]) {
      expect([2, 4]).toContain(buatRondeSimulasi(p, { max: 4 }, seed).target);
      expect([2, 4, 6, 8]).toContain(buatRondeSimulasi(p, {}, seed).target);
    }
    const r: RondeSimulasi = { ...buatRondeSimulasi(p, {}, 1), target: 6 };
    expect(nilaiSimulasi(r, { kiri: 3, kanan: 3 }).benar).toBe(true);
    expect(nilaiSimulasi(r, { kiri: 2, kanan: 4 }).benar).toBe(false);
    expect(nilaiSimulasi(r, { kiri: 2, kanan: 2 }).benar).toBe(false);
  });
});

describe("index: buatRonde/nilai memilih cabang pola & simulasi", () => {
  it("pola terbungkus {mechanic:'pola'} dan nilai lewat index", () => {
    const p = paketPola({ mode: "lanjut" });
    const w = buatRonde(p, knobDefaults(p), 1);
    expect(w.mechanic).toBe("pola");
    const r = w.ronde as RondePola;
    expect(nilai(p, w, r.correct).benar).toBe(true);
  });
  it("simulasi terbungkus {mechanic:'simulasi'} dan nilai lewat index", () => {
    const p = paketSim("bagi", BENDA_BERAT);
    const w = buatRonde(p, knobDefaults(p), 1);
    expect(w.mechanic).toBe("simulasi");
    const t = (w.ronde as RondeSimulasi).target;
    expect(nilai(p, w, { kiri: t / 2, kanan: t / 2 }).benar).toBe(true);
    expect(nilai(p, w, { kiri: t, kanan: 0 }).benar).toBe(false);
  });
});
