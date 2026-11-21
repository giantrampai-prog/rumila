// Fitur putaran 2 (21 Nov 2026): urutkan `potong: "tengah"`, dagang `barangIkutHarga`, Visual shape/angka baru.
import { describe, expect, it } from "vitest";
import { ContentPack, type PaketDagang, type PaketUrutkan } from "@akademi/schema";
import { buatRondeDagang, buatRondeUrutkan, nilaiUrutkan, potongTengah } from "../src";

const dasar = { version: "1.0.0", level: "TKA", instructionKey: "instruksi", knobs: {} };
const locale = (keys: string[]) => {
  const d: Record<string, string> = { instruksi: "Ayo", judul: "Judul" };
  for (const k of keys) d[k] = k;
  return { id: d, en: { ...d } };
};

/* ---------------- urutkan potong ---------------- */

const LANGKAH = ["a", "b", "c", "d", "e", "f", "g"];
function paketUrut(extra: Record<string, unknown> = {}): PaketUrutkan {
  return ContentPack.parse({
    ...dasar, id: "urut-potong", mechanic: "urutkan", competencyIds: ["KODE.TKA.URUTAN.02"],
    knobs: { steps: { min: 3, max: 7, default: 4, keterangan: "langkah" } },
    locale: locale(["seq", ...LANGKAH]),
    sequences: [{ id: "seq", titleKey: "seq", steps: LANGKAH.map(id => ({ id, labelKey: id, emoji: "🌱" })) }],
    ...extra,
  }) as PaketUrutkan;
}

describe("potongTengah", () => {
  it("pertama & terakhir tetap, yang terdekat ke tengah dibuang dulu (seri: indeks kecil dulu)", () => {
    expect(potongTengah(LANGKAH, 7)).toEqual(LANGKAH);
    expect(potongTengah(LANGKAH, 9)).toEqual(LANGKAH);
    expect(potongTengah(LANGKAH, 6)).toEqual(["a", "b", "c", "e", "f", "g"]);
    expect(potongTengah(LANGKAH, 5)).toEqual(["a", "b", "e", "f", "g"]);
    expect(potongTengah(LANGKAH, 4)).toEqual(["a", "b", "f", "g"]);
    expect(potongTengah(LANGKAH, 3)).toEqual(["a", "f", "g"]);
    expect(potongTengah(LANGKAH, 2)).toEqual(["a", "g"]);
    // panjang genap: dua indeks tengah sama dekat → yang lebih kecil dibuang dulu
    expect(potongTengah(["a", "b", "c", "d", "e", "f"], 5)).toEqual(["a", "b", "d", "e", "f"]);
    expect(potongTengah(["a", "b", "c", "d", "e", "f"], 4)).toEqual(["a", "b", "e", "f"]);
  });
  it("sumber tidak diubah", () => {
    const src = [...LANGKAH];
    potongTengah(src, 3);
    expect(src).toEqual(LANGKAH);
  });
});

describe("urutkan potong", () => {
  it("tanpa potong / potong akhir: n langkah pertama (perilaku lama)", () => {
    for (const p of [paketUrut(), paketUrut({ potong: "akhir" })])
      for (let seed = 0; seed < 10; seed++) expect(buatRondeUrutkan(p, { steps: 4 }, seed).correct).toEqual(["a", "b", "c", "d"]);
    // field tak diisi tidak muncul di hasil parse (paket lama tetap identik)
    expect("potong" in paketUrut()).toBe(false);
  });
  it("tanpa potong: ronde identik dengan potong akhir untuk seed sama", () => {
    for (let seed = 0; seed < 10; seed++) expect(buatRondeUrutkan(paketUrut(), { steps: 5 }, seed)).toEqual(buatRondeUrutkan(paketUrut({ potong: "akhir" }), { steps: 5 }, seed));
  });
  it("potong tengah: awal & akhir dipertahankan, kunci tetap urutan benar", () => {
    const p = paketUrut({ potong: "tengah" });
    for (let seed = 0; seed < 10; seed++) {
      const r = buatRondeUrutkan(p, { steps: 4 }, seed);
      expect(r.correct).toEqual(["a", "b", "f", "g"]);
      expect([...r.shown.map(s => s.id)].sort()).toEqual(["a", "b", "f", "g"]);
      expect(nilaiUrutkan(r, r.correct).benar).toBe(true);
    }
    expect(buatRondeUrutkan(p, { steps: 7 }, 1).correct).toEqual(LANGKAH);
  });
  it("skema menolak nilai potong lain", () => {
    expect(() => paketUrut({ potong: "depan" })).toThrow();
  });
});

/* ---------------- dagang barangIkutHarga ---------------- */

function paketDagang(mode: "bayar" | "kembalian", extra: Record<string, unknown> = {}): PaketDagang {
  const goods = [
    { id: "pensil", labelKey: "pensil", price: 2000, emoji: "✏️" },
    { id: "penghapus", labelKey: "penghapus", price: 3000, emoji: "🧽" },
    { id: "spidol", labelKey: "spidol", price: 3000, emoji: "🖊️" },
    { id: "buku", labelKey: "buku", price: 8000, emoji: "📒" },
  ];
  return ContentPack.parse({
    ...dasar, id: `dagang-${mode}`, mechanic: "dagang", mode, competencyIds: ["MAT.TKA.BILANGAN.01"], currency: "IDR",
    denominations: [1000, 2000, 5000, 10000], priceLabel: "rupiah",
    knobs: { harga: { min: 2, max: 9, default: 3, keterangan: "ribuan" } },
    locale: locale(goods.map(g => g.id)), goods,
    customerRule: { itemsMin: 1, itemsMax: 3, payExact: true, maxTotal: 10000, kindsMax: 2 },
    ...extra,
  }) as PaketDagang;
}

describe("dagang barangIkutHarga", () => {
  for (const mode of ["bayar", "kembalian"] as const) {
    it(`${mode}: tanpa field → ronde identik dengan barangIkutHarga false (perilaku lama)`, () => {
      for (let seed = 0; seed < 20; seed++)
        expect(buatRondeDagang(paketDagang(mode), { harga: 3 }, seed)).toEqual(buatRondeDagang(paketDagang(mode, { barangIkutHarga: false }), { harga: 3 }, seed));
    });
    it(`${mode}: aktif → satu barang ber-price = harga ronde, diundi di antara yang cocok`, () => {
      const p = paketDagang(mode, { barangIkutHarga: true });
      const dipilih = new Set<string>();
      for (let seed = 0; seed < 40; seed++) {
        const r = buatRondeDagang(p, { harga: 3 }, seed);
        expect(r.harga).toBe(3000);
        expect(r.pesanan).toHaveLength(1);
        expect(r.pesanan[0].qty).toBe(1);
        expect(["penghapus", "spidol"]).toContain(r.pesanan[0].goodId);
        dipilih.add(r.pesanan[0].goodId);
      }
      expect(dipilih.size).toBe(2);
      const r8 = buatRondeDagang(p, { harga: 8 }, 1);
      expect(r8.pesanan).toEqual([{ goodId: "buku", qty: 1 }]);
      if (mode === "kembalian") expect(r8.dibayar).toBe(10000);
    });
    it(`${mode}: aktif tetapi tidak ada barang cocok → pesanan acak seperti bawaan`, () => {
      for (let seed = 0; seed < 10; seed++) {
        const lama = buatRondeDagang(paketDagang(mode), { harga: 7 }, seed);
        const baru = buatRondeDagang(paketDagang(mode, { barangIkutHarga: true }), { harga: 7 }, seed);
        expect(baru).toEqual(lama);
        expect(baru.harga).toBe(7000);
      }
    });
  }
  it("tanpa knob harga: harga dari pesanan, barangIkutHarga tidak berpengaruh", () => {
    const { knobs: _k, ...tanpaKnob } = paketDagang("bayar", { barangIkutHarga: true });
    void _k;
    const p = { ...tanpaKnob, knobs: {} } as PaketDagang;
    for (let seed = 0; seed < 10; seed++) expect(buatRondeDagang(p, {}, seed)).toEqual(buatRondeDagang({ ...p, barangIkutHarga: undefined }, {}, seed));
  });
});

/* ---------------- skema Visual ---------------- */

describe("Visual shape & angka", () => {
  const item = (v: Record<string, unknown>) => paketUrut({ sequences: [{ id: "seq", titleKey: "seq", steps: ["a", "b", "c"].map(id => ({ id, labelKey: id, ...v })) }] });
  it("menerima belah-ketupat, koin, uang dan angka ≤ 8 karakter", () => {
    for (const shape of ["belah-ketupat", "koin", "uang", "akar"]) expect(() => item({ shape, angka: "Rp2.000", color: "#7ec8a0" })).not.toThrow();
    expect(item({ shape: "koin", angka: "500" }).sequences[0].steps[0].angka).toBe("500");
  });
  it("menolak angka kosong atau > 8 karakter", () => {
    expect(() => item({ shape: "uang", angka: "" })).toThrow();
    expect(() => item({ shape: "uang", angka: "Rp100.000" })).toThrow();
  });
});

describe("dagang: knob itemsMax di hitung/subitasi dan pecahan di bayar", () => {
  it("hitung dan subitasi membaca itemsMax bila maxCount tidak ada", async () => {
    const { buatRonde } = await import("../src/index");
    const dasar = { id: "uji-hitung", version: "1.0.0", level: "PAUD", competencyIds: ["MAT.PAUD.BILANGAN-1-5.01"], instructionKey: "i", locale: { id: { i: "x", a: "a" }, en: { i: "x", a: "a" } }, assets: [], generatif: true, rounds: 10, mechanic: "dagang", currency: "IDR", denominations: [1000], priceLabel: "koin", goods: [{ id: "a", labelKey: "a", price: 1000 }], customerRule: { itemsMin: 1, itemsMax: 5, payExact: true, maxTotal: 10000, kindsMax: 1 } } as const;
    for (const mode of ["hitung", "subitasi"] as const) {
      const p = { ...dasar, mode, knobs: { itemsMax: { min: 2, max: 8, default: 8, step: 1 } } } as never;
      const maks = Math.max(...Array.from({ length: 200 }, (_, s) => (buatRonde(p, { itemsMax: 8 }, s) as { ronde: { target: number } }).ronde.target));
      expect(maks).toBe(8);
    }
  });
  it("bayar: knob pecahan membatasi jenis uang di laci, pecahan terkecil dulu", async () => {
    const { buatRonde } = await import("../src/index");
    const p = { id: "uji-bayar", version: "1.0.0", level: "TKB", competencyIds: ["MAT.TKB.UANG-10RB.01"], instructionKey: "i", locale: { id: { i: "x", a: "a" }, en: { i: "x", a: "a" } }, assets: [], generatif: true, rounds: 10, mechanic: "dagang", mode: "bayar", currency: "IDR", denominations: [5000, 1000, 2000], priceLabel: "rupiah", goods: [{ id: "a", labelKey: "a", price: 3000 }], customerRule: { itemsMin: 1, itemsMax: 1, payExact: true, maxTotal: 10000, kindsMax: 1 }, knobs: { harga: { min: 2, max: 9, default: 3, step: 1 }, pecahan: { min: 1, max: 3, default: 1, step: 1 } } } as never;
    const laci = (k: number) => new Set((buatRonde(p, { harga: 3, pecahan: k }, 1) as { ronde: { laci: number[] } }).ronde.laci);
    expect([...laci(1)]).toEqual([1000]);
    expect([...laci(2)].sort()).toEqual([1000, 2000]);
    expect([...laci(3)].sort((a, b) => a - b)).toEqual([1000, 2000, 5000]);
  });
});
