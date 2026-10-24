import { describe, expect, it } from "vitest";
import { ContentPack, type PaketDagang, type PaketPilah, type PaketUrutkan } from "@akademi/schema";
import {
  acak, buatRonde, buatRondeDagang, buatRondePilah, buatRondeUrutkan, hitungSwap, knobDefaults, nilai, nilaiDagang, nilaiPilah, nilaiUrutkan, rng,
  type RondeDagang, type RondePilahKelompok, type RondePilahPilih,
} from "../src";
import keranjang from "../../../content/golden/paket-keranjang-warna.json";
import hitungJari from "../../../content/golden/paket-hitung-jari.json";
import pagi from "../../../content/golden/paket-agam-pagi-hari.json";
import pasar from "../../../content/golden/paket-pasar-buah-1-5.json";

describe("rng", () => {
  it("deterministik untuk seed sama, beda untuk seed beda", () => {
    const a = rng(42), b = rng(42), c = rng(43);
    const xa = [a(), a(), a()], xb = [b(), b(), b()], xc = [c(), c(), c()];
    expect(xa).toEqual(xb);
    expect(xa).not.toEqual(xc);
    for (const x of xa) { expect(x).toBeGreaterThanOrEqual(0); expect(x).toBeLessThan(1); }
  });
  it("acak: salinan permutasi, sumber utuh", () => {
    const src = [1, 2, 3, 4, 5, 6];
    const out = acak(src, rng(1));
    expect(src).toEqual([1, 2, 3, 4, 5, 6]);
    expect([...out].sort()).toEqual([...src].sort());
    expect(acak(src, rng(1))).toEqual(out);
  });
  it("knobDefaults membaca default tiap knob", () => {
    expect(knobDefaults(ContentPack.parse(keranjang))).toEqual({ binCount: 2, itemCount: 6 });
  });
});

describe("pilah kelompok", () => {
  const p = ContentPack.parse(keranjang) as PaketPilah;
  it("binCount memilih bin pertama sesuai urutan paket, item hanya dari bin aktif", () => {
    const r = buatRondePilah(p, knobDefaults(p), 11) as RondePilahKelompok;
    expect(r.bins.map(b => b.id)).toEqual(["merah", "biru"]);
    expect(r.items).toHaveLength(4);
    for (const i of r.items) expect(["merah", "biru"]).toContain(i.bin);
  });
  it("itemCount memotong dan tiap bin aktif tetap punya item", () => {
    const r = buatRondePilah(p, { binCount: 4, itemCount: 4 }, 3) as RondePilahKelompok;
    expect(r.items).toHaveLength(4);
    expect(new Set(r.items.map(i => i.bin)).size).toBe(4);
  });
  it("deterministik", () => { expect(buatRondePilah(p, { binCount: 3, itemCount: 4 }, 9)).toEqual(buatRondePilah(p, { binCount: 3, itemCount: 4 }, 9)); });
  it("maxCount menyembunyikan bin berangka > maxCount (hitung-ambil)", () => {
    const h = ContentPack.parse(hitungJari) as PaketPilah;
    const r = buatRondePilah(h, knobDefaults(h), 2) as RondePilahKelompok;
    expect(r.bins.map(b => b.id)).toEqual(["k1", "k2", "k3"]);
    expect(r.items.map(i => i.id).sort()).toEqual(["g1", "g2", "g3"]);
    expect((buatRondePilah(h, { maxCount: 5, itemCount: 8 }, 2) as RondePilahKelompok).bins).toHaveLength(5);
  });
  it("nilai: benar bila semua item ke bin tepat, detail.salah berisi yang keliru", () => {
    const r = buatRondePilah(p, knobDefaults(p), 11) as RondePilahKelompok;
    const benar = Object.fromEntries(r.items.map(i => [i.id, i.bin]));
    expect(nilaiPilah(r, benar)).toEqual({ benar: true, detail: { salah: [] } });
    const salah = { ...benar, [r.items[0].id]: r.items[0].bin === "merah" ? "biru" : "merah" };
    const h = nilaiPilah(r, salah);
    expect(h.benar).toBe(false);
    expect(h.detail.salah).toEqual([r.items[0].id]);
    expect(nilaiPilah(r, {}).benar).toBe(false);
  });
});

describe("pilah pilih", () => {
  const p = ContentPack.parse({
    ...keranjang, id: "lebih-banyak", mode: "pilih", knobs: {},
    pilihan: [
      { id: "r1", promptKey: "instruksi", choices: ["apel", "bola", "pisang"], correct: "bola" },
      { id: "r2", promptKey: "instruksi", choices: ["daun", "katak"], correct: "katak" },
    ],
  }) as PaketPilah;
  it("ronde dari pilihan, choices diacak sebagai objek item", () => {
    const r = buatRondePilah(p, {}, 4) as RondePilahPilih;
    expect(r.mode).toBe("pilih");
    expect(r.choices.map(c => c.id)).toContain(r.correct);
    expect(r.choices.every(c => typeof c.labelKey === "string")).toBe(true);
    expect(nilaiPilah(r, r.correct)).toEqual({ benar: true, detail: { dipilih: r.correct } });
    expect(nilaiPilah(r, "zzz").benar).toBe(false);
  });
});

describe("urutkan", () => {
  const p = ContentPack.parse(pagi) as PaketUrutkan;
  it("susun: shown ≠ correct, knob steps menentukan panjang", () => {
    for (let seed = 0; seed < 20; seed++) {
      const r = buatRondeUrutkan(p, knobDefaults(p), seed);
      expect(r.shown).toHaveLength(3);
      expect(r.shown.map(s => s.id)).not.toEqual(r.correct);
      expect([...r.shown.map(s => s.id)].sort()).toEqual([...r.correct].sort());
    }
    const r4 = buatRondeUrutkan(p, { steps: 4 }, 1);
    expect(r4.sequenceId).toBe("tanam");
    expect(r4.correct).toEqual(["gali", "taruh", "siram", "tumbuh"]);
  });
  it("susun: nilai benar bila urutan sama", () => {
    const r = buatRondeUrutkan(p, { steps: 3 }, 2);
    expect(nilaiUrutkan(r, r.correct).benar).toBe(true);
    expect(nilaiUrutkan(r, r.shown.map(s => s.id)).benar).toBe(false);
  });
  it("perbaiki: tepat satu pasang tertukar; benar hanya bila jawaban == correct dan swaps == 1", () => {
    const pp = { ...p, mode: "perbaiki" as const };
    for (let seed = 0; seed < 10; seed++) {
      const r = buatRondeUrutkan(pp, { steps: 4 }, seed);
      const [i, k] = r.swapped!;
      expect(r.shown[i].id).toBe(r.correct[k]);
      expect(r.shown[k].id).toBe(r.correct[i]);
      expect(hitungSwap(r.shown.map(s => s.id), r.correct)).toBe(1);
      const ok = nilaiUrutkan(r, r.correct);
      expect(ok).toEqual({ benar: true, detail: { swaps: 1 } });
    }
    const r = buatRondeUrutkan(pp, { steps: 4 }, 1);
    const terbalik = [...r.correct].reverse();
    const salah = nilaiUrutkan(r, terbalik);
    expect(salah.benar).toBe(false);
    expect(nilaiUrutkan(r, r.shown.map(s => s.id))).toEqual({ benar: false, detail: { swaps: 0 } });
  });
  it("dulu: dua langkah, benar bila memilih correct[0]", () => {
    const pd = ContentPack.parse({
      ...pagi, id: "dulu", mode: "dulu", knobs: {},
      sequences: [{ id: "pagi", titleKey: "pagi", steps: [{ id: "bangun", labelKey: "bangun" }, { id: "gosok", labelKey: "gosok" }] }],
    }) as PaketUrutkan;
    const r = buatRondeUrutkan(pd, {}, 1);
    expect(r.shown).toHaveLength(2);
    expect(r.correct).toEqual(["bangun", "gosok"]);
    expect(nilaiUrutkan(r, "bangun").benar).toBe(true);
    expect(nilaiUrutkan(r, "gosok").benar).toBe(false);
  });
});

describe("dagang", () => {
  const p = ContentPack.parse(pasar) as PaketDagang;
  const mode = (m: PaketDagang["mode"], extra: Partial<PaketDagang> = {}): PaketDagang => ({ ...p, mode: m, ...extra });
  const uangPecahan: Partial<PaketDagang> = { denominations: [1000, 2000, 5000, 10000], priceLabel: "rupiah" };

  it("ambil (golden): pesanan dalam batas knob, nilai keranjang", () => {
    for (let seed = 0; seed < 15; seed++) {
      const r = buatRondeDagang(p, knobDefaults(p), seed);
      const total = r.pesanan.reduce((s, x) => s + x.qty, 0);
      expect(r.pesanan).toHaveLength(1);
      expect(total).toBeGreaterThanOrEqual(1);
      expect(total).toBeLessThanOrEqual(3);
      expect(r.strip).toEqual([1, 3]);
      expect(Object.keys(r.tersedia)).toHaveLength(4);
      const benar = Object.fromEntries(r.pesanan.map(x => [x.goodId, x.qty]));
      expect(nilaiDagang(r, { keranjang: benar }).benar).toBe(true);
      expect(nilaiDagang(r, { keranjang: { ...benar, [r.pesanan[0].goodId]: r.pesanan[0].qty + 1 } }).benar).toBe(false);
      expect(nilaiDagang(r, { keranjang: { ...benar, ekstra: 1 } }).benar).toBe(false);
    }
    const dua = buatRondeDagang(p, { itemsMax: 5, kinds: 2 }, 3);
    expect(dua.pesanan.length).toBeLessThanOrEqual(2);
    expect(buatRondeDagang(p, { itemsMax: 5, kinds: 2 }, 3)).toEqual(dua);
  });
  it("hitung: benda = goodId × target; disentuh harus tepat sekali tiap benda", () => {
    const r = buatRondeDagang(mode("hitung"), { maxCount: 5 }, 4);
    expect(r.benda).toHaveLength(r.target);
    expect(new Set(r.benda).size).toBe(1);
    const semua = r.benda.map((_, i) => String(i));
    expect(nilaiDagang(r, { angka: r.target }).benar).toBe(true);
    expect(nilaiDagang(r, { angka: r.target, disentuh: semua }).benar).toBe(true);
    const ganda = nilaiDagang(r, { angka: r.target, disentuh: [...semua, "0"] });
    expect(ganda.benar).toBe(false);
    expect(ganda.detail.disentuhGanda).toEqual(["0"]);
    const lewat = nilaiDagang(r, { angka: r.target, disentuh: semua.slice(1) });
    expect(lewat.benar).toBe(false);
    expect(lewat.detail.terlewat).toEqual(["0"]);
    expect(nilaiDagang(r, { angka: r.target + 1 }).benar).toBe(false);
  });
  it("subitasi: flashMs & keranjang total", () => {
    const r = buatRondeDagang(mode("subitasi"), {}, 2);
    expect(r.flashMs).toBe(1000);
    expect(r.target).toBeGreaterThanOrEqual(1);
    expect(r.target).toBeLessThanOrEqual(3);
    const good = r.pesanan[0].goodId;
    const h = nilaiDagang(r, { keranjang: { [good]: r.target }, latencyMs: 800 });
    expect(h.benar).toBe(true);
    expect(h.detail.latencyMs).toBe(800);
    expect(nilaiDagang(r, { keranjang: { [good]: r.target + 1 } }).benar).toBe(false);
    expect(buatRondeDagang(mode("subitasi"), { flashMs: 600 }, 2).flashMs).toBe(600);
  });
  it("bayar: jumlah uang == harga", () => {
    const r = buatRondeDagang(mode("bayar", uangPecahan), { harga: 7 }, 1);
    expect(r.harga).toBe(7000);
    expect(r.laci.filter(x => x === 1000)).toHaveLength(10);
    expect(r.laci.filter(x => x === 5000)).toHaveLength(3);
    expect(nilaiDagang(r, { uang: [5000, 2000] }).benar).toBe(true);
    expect(nilaiDagang(r, { uang: [5000, 1000] }).benar).toBe(false);
  });
  it("kembalian: dibayar pecahan terkecil > harga; jumlah == dibayar − harga", () => {
    const r = buatRondeDagang(mode("kembalian", uangPecahan), { harga: 3 }, 1);
    expect(r.dibayar).toBe(5000);
    expect(nilaiDagang(r, { uang: [2000] }).benar).toBe(true);
    expect(nilaiDagang(r, { uang: [1000] }).benar).toBe(false);
    expect(buatRondeDagang(mode("kembalian", uangPecahan), { harga: 12 }, 1).dibayar).toBe(20000);
  });
  it("tukar: satu lembar → koin seribu sejumlah nilainya", () => {
    const r = buatRondeDagang(mode("tukar", uangPecahan), {}, 5);
    expect([2000, 5000, 10000]).toContain(r.dibayar);
    expect(r.target).toBe(r.dibayar / 1000);
    expect(r.laci.every(x => x === 1000)).toBe(true);
    expect(nilaiDagang(r, { uang: new Array(r.target).fill(1000) }).benar).toBe(true);
    expect(nilaiDagang(r, { uang: new Array(r.target + 1).fill(1000) }).benar).toBe(false);
  });
  it("lengkapi: koin yang ditambah == target − ditunjukkan", () => {
    const r = buatRondeDagang(mode("lengkapi"), {}, 8);
    expect(r.harga).toBe(5000);
    expect(r.dibayar).toBeGreaterThanOrEqual(1000);
    expect(r.dibayar).toBeLessThan(5000);
    expect(r.target).toBe((r.harga - r.dibayar) / 1000);
    const h = nilaiDagang(r, { uang: new Array(r.target).fill(1000), latencyMs: 1200 });
    expect(h.benar).toBe(true);
    expect(h.detail.latencyMs).toBe(1200);
    expect(nilaiDagang(r, { uang: [] }).benar).toBe(false);
  });
  it("gabung & sisa", () => {
    const g = buatRondeDagang(mode("gabung"), {}, 3);
    expect(g.kelompok[0] + g.kelompok[1]).toBe(g.target);
    expect(g.target).toBeLessThanOrEqual(10);
    expect(nilaiDagang(g, { angka: g.target }).benar).toBe(true);
    expect(nilaiDagang(g, { angka: g.target - 1 }).benar).toBe(false);
    const s = buatRondeDagang(mode("sisa"), { maxCount: 5, pengurang: 2 }, 3);
    expect(s.kelompok[0]).toBeLessThanOrEqual(5);
    expect(s.kelompok[1]).toBeLessThanOrEqual(2);
    expect(s.kelompok[0] - s.kelompok[1]).toBe(s.target);
    const good = Object.keys(s.tersedia)[0];
    expect(nilaiDagang(s, { keranjang: { [good]: s.target } }).benar).toBe(true);
    expect(nilaiDagang(s, { keranjang: { [good]: s.target + 1 } }).benar).toBe(false);
  });
  it("semua mode deterministik lewat buatRonde", () => {
    for (const m of ["ambil", "hitung", "subitasi", "bayar", "kembalian", "tukar", "gabung", "sisa", "lengkapi"] as const) {
      const pk = mode(m, uangPecahan);
      const a = buatRonde(pk, knobDefaults(pk), 21);
      expect(a).toEqual(buatRonde(pk, knobDefaults(pk), 21));
      expect(a.mechanic).toBe("dagang");
      expect((a.ronde as RondeDagang).mode).toBe(m);
      expect(nilai(pk, a, { keranjang: {} }).benar).toBe(false);
    }
  });
});
