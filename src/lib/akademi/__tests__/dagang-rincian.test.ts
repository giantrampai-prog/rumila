// Presenter dagang: rincian harga per barang (fitur 5) — total disembunyikan bila anak harus menjumlah sendiri.
import { describe, expect, it } from "vitest";
import type { PaketDagang } from "@akademi/schema";
import type { RondeDagang } from "@akademi/mechanics";
import { rincianHarga } from "@/components/akademi/dagang";

const goods = [
  { id: "buku", labelKey: "buku", price: 23000 },
  { id: "pensil", labelKey: "pensil", price: 9000 },
];
const paket = (knobs: Record<string, unknown> = {}) => ({ goods, knobs }) as unknown as PaketDagang;
const ronde = (pesanan: { goodId: string; qty: number }[], harga: number) => ({ mode: "kembalian", pesanan, harga }) as unknown as RondeDagang;

describe("rincianHarga", () => {
  it("> 1 barang & jumlah price = harga → baris per barang", () => {
    expect(rincianHarga(paket(), ronde([{ goodId: "buku", qty: 2 }, { goodId: "pensil", qty: 1 }], 55000))).toEqual([
      { goodId: "buku", qty: 2, price: 23000 }, { goodId: "pensil", qty: 1, price: 9000 },
    ]);
  });
  it("1 barang → null (total tampil seperti dulu)", () => {
    expect(rincianHarga(paket(), ronde([{ goodId: "buku", qty: 1 }], 23000))).toBeNull();
  });
  it("paket ber-knob harga (TK) → null walau > 1 barang", () => {
    expect(rincianHarga(paket({ harga: { min: 1, max: 5, default: 2 } }), ronde([{ goodId: "pensil", qty: 2 }], 18000))).toBeNull();
  });
  it("jumlah price ≠ harga ronde → null (jangan tampilkan harga yang tak cocok)", () => {
    expect(rincianHarga(paket(), ronde([{ goodId: "pensil", qty: 2 }], 20000))).toBeNull();
  });
});
