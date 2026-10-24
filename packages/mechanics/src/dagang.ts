// Mekanik dagang: sembilan mode (ambil, hitung, subitasi, bayar, kembalian, tukar, gabung, sisa, lengkapi).
// Satu buatRonde dengan switch mode; field yang tidak relevan diisi nilai kosong ([], {}, 0).
// Knob yang dibaca bila ada: itemsMax, kinds, maxCount, harga (ribuan rupiah), pengurang, target, flashMs; kalau tidak, pakai customerRule.

import type { PaketDagang } from "@akademi/schema";
import { acak, acakInt, pilihSatu, rng } from "./rng";
import type { Hasil, JawabanDagang, Knobs, Pesanan, RondeDagang } from "./types";

const KOIN = 1000;

/** Laci: tiap pecahan disediakan cukup — 10 keping untuk koin (≤ 1000), 3 lembar untuk kertas; terurut naik. */
function laciDari(denominations: number[]): number[] {
  const out: number[] = [];
  for (const d of [...denominations].sort((a, b) => a - b)) {
    const n = d <= KOIN ? 10 : 3;
    for (let i = 0; i < n; i++) out.push(d);
  }
  return out;
}

function kosong(p: PaketDagang): RondeDagang {
  return {
    mode: p.mode, tersedia: {}, pesanan: [], harga: 0, dibayar: 0, laci: [], benda: [],
    kelompok: [0, 0], target: 0, strip: [0, 0], flashMs: 0, priceLabel: p.priceLabel, lembar: [],
  };
}

/** Pesanan acak: total barang di [itemsMin, itemsMax], dibagi ke `kinds` jenis (tiap jenis ≥ 1), total harga ≤ maxTotal bila bisa. */
function buatPesanan(p: PaketDagang, knobs: Knobs, r: () => number): { pesanan: Pesanan[]; harga: number; itemsMax: number } {
  const rule = p.customerRule;
  const itemsMax = Math.max(1, Math.floor(knobs.itemsMax ?? rule.itemsMax));
  const itemsMin = Math.min(Math.max(1, rule.itemsMin), itemsMax);
  const kindsMax = Math.max(1, Math.floor(knobs.kinds ?? rule.kindsMax));
  const total = acakInt(r, itemsMin, itemsMax);
  const jenis = Math.min(kindsMax, total, p.goods.length);
  const barang = acak(p.goods, r).slice(0, jenis);
  const qty = new Array<number>(jenis).fill(1);
  for (let sisa = total - jenis; sisa > 0; sisa--) qty[acakInt(r, 0, jenis - 1)]++;
  const pesanan = barang.map((g, i) => ({ goodId: g.id, qty: qty[i] }));
  const hargaDari = (ps: Pesanan[]) => ps.reduce((s, x) => s + x.qty * (p.goods.find(g => g.id === x.goodId)?.price ?? 0), 0);
  // kurangi qty sampai harga ≤ maxTotal (tiap jenis tetap ≥ 1)
  let harga = hargaDari(pesanan);
  for (let guard = 0; harga > rule.maxTotal && guard < 100; guard++) {
    const bisa = pesanan.filter(x => x.qty > 1);
    if (!bisa.length) break;
    pilihSatu(bisa, r).qty--;
    harga = hargaDari(pesanan);
  }
  return { pesanan, harga, itemsMax };
}

/** Harga ronde: knob `harga` (ribuan rupiah) menang; kalau tidak, dari pesanan. */
function hargaRonde(knobs: Knobs, dariPesanan: number): number {
  return knobs.harga !== undefined ? Math.max(1, Math.floor(knobs.harga)) * KOIN : dariPesanan;
}

export function buatRondeDagang(p: PaketDagang, knobs: Knobs, seed: number): RondeDagang {
  const r = rng(seed);
  const rule = p.customerRule;
  const ronde = kosong(p);
  const denoms = [...p.denominations].sort((a, b) => a - b);
  const satuBarang = () => pilihSatu(p.goods, r).id;
  const flashMs = Math.floor(knobs.flashMs ?? rule.flashMs ?? 1000);

  switch (p.mode) {
    case "ambil": {
      const { pesanan, harga, itemsMax } = buatPesanan(p, knobs, r);
      for (const g of p.goods) ronde.tersedia[g.id] = itemsMax + 2;
      ronde.pesanan = pesanan; ronde.harga = harga; ronde.strip = [1, itemsMax];
      return ronde;
    }
    case "hitung": {
      const maxCount = Math.max(1, Math.floor(knobs.maxCount ?? rule.itemsMax));
      const target = acakInt(r, 1, maxCount);
      const good = satuBarang();
      ronde.benda = new Array<string>(target).fill(good);
      ronde.tersedia = { [good]: target };
      ronde.target = target; ronde.strip = [1, maxCount];
      return ronde;
    }
    case "subitasi": {
      const maxCount = Math.max(1, Math.floor(knobs.maxCount ?? 3));
      const target = acakInt(r, 1, maxCount);
      const good = satuBarang();
      ronde.tersedia = { [good]: maxCount + 2 };
      ronde.pesanan = [{ goodId: good, qty: target }];
      ronde.target = target; ronde.strip = [1, maxCount]; ronde.flashMs = flashMs;
      return ronde;
    }
    case "bayar": {
      const { pesanan, harga } = buatPesanan(p, knobs, r);
      ronde.pesanan = pesanan; ronde.harga = hargaRonde(knobs, harga); ronde.laci = laciDari(denoms);
      return ronde;
    }
    case "kembalian": {
      const { pesanan, harga: dariPesanan } = buatPesanan(p, knobs, r);
      const harga = hargaRonde(knobs, dariPesanan);
      const lebih = denoms.filter(d => d > harga);
      const dibayar = lebih.length ? lebih[0] : Math.ceil((harga + 1) / 10000) * 10000;
      ronde.pesanan = pesanan; ronde.harga = harga; ronde.dibayar = dibayar; ronde.laci = laciDari(denoms);
      return ronde;
    }
    case "tukar": {
      // 1–3 lembar (customerRule.itemsMax, maks 3) yang totalnya ≤ batas: knob harga (ribuan) atau customerRule.maxTotal.
      const pecahan = denoms.filter(d => d > KOIN);
      const batas = knobs.harga !== undefined ? Math.floor(knobs.harga) * KOIN : rule.maxTotal;
      const boleh = pecahan.filter(d => d <= batas);
      const pakai = boleh.length ? boleh : pecahan.length ? [pecahan[0]] : [10000];
      const maksLembar = Math.min(3, Math.max(1, rule.itemsMax));
      let lembar: number[] = [pilihSatu(pakai, r)];
      for (let coba = 0; coba < 12; coba++) {
        const calon = Array.from({ length: acakInt(r, 1, maksLembar) }, () => pilihSatu(pakai, r));
        if (calon.reduce((a, b) => a + b, 0) <= Math.max(batas, pakai[0])) { lembar = calon; break; }
      }
      lembar.sort((a, b) => b - a);
      const dibayar = lembar.reduce((a, b) => a + b, 0);
      const target = Math.round(dibayar / KOIN);
      ronde.lembar = lembar; ronde.dibayar = dibayar; ronde.target = target; ronde.harga = dibayar;
      ronde.laci = new Array<number>(target + 3).fill(KOIN);
      return ronde;
    }
    case "lengkapi": {
      const targetKoin = Math.max(2, Math.floor(knobs.target ?? rule.target ?? 5));
      const ditunjukkan = acakInt(r, 1, targetKoin - 1);
      ronde.harga = targetKoin * KOIN; ronde.dibayar = ditunjukkan * KOIN;
      ronde.target = targetKoin - ditunjukkan;
      ronde.laci = new Array<number>(targetKoin + 3).fill(KOIN);
      ronde.strip = [1, targetKoin]; ronde.flashMs = flashMs;
      return ronde;
    }
    case "gabung": {
      const batas = Math.max(2, Math.floor(knobs.target ?? rule.target ?? 10));
      const a = acakInt(r, 1, batas - 1);
      const b = acakInt(r, 1, batas - a);
      const good = satuBarang();
      ronde.kelompok = [a, b]; ronde.target = a + b; ronde.strip = [0, batas];
      ronde.tersedia = { [good]: batas };
      return ronde;
    }
    case "sisa": {
      const batas = Math.max(2, Math.floor(knobs.maxCount ?? rule.target ?? 10));
      const awal = acakInt(r, 2, batas);
      const pengurangMax = knobs.pengurang !== undefined ? Math.min(Math.floor(knobs.pengurang), awal - 1) : awal - 1;
      const diambil = acakInt(r, 1, Math.max(1, pengurangMax));
      const good = satuBarang();
      ronde.kelompok = [awal, diambil]; ronde.target = awal - diambil; ronde.strip = [0, awal];
      ronde.tersedia = { [good]: awal };
      return ronde;
    }
  }
  return ronde;
}

const jumlahUang = (uang: number[]) => uang.reduce((s, x) => s + x, 0);
const totalKeranjang = (k: Record<string, number>) => Object.values(k).reduce((s, x) => s + x, 0);

export function nilaiDagang(r: RondeDagang, j: JawabanDagang): Hasil {
  const latencyMs = j.latencyMs;
  const keranjang = "keranjang" in j && j.keranjang ? j.keranjang : null;
  const uang = "uang" in j && Array.isArray(j.uang) ? j.uang : null;
  const angka = "angka" in j && typeof j.angka === "number" ? j.angka : null;

  switch (r.mode) {
    case "ambil": {
      if (!keranjang) return { benar: false, detail: { pesanan: r.pesanan, keranjang: {} } };
      const diminta = new Map(r.pesanan.map(x => [x.goodId, x.qty] as const));
      const cocokPesanan = r.pesanan.every(x => (keranjang[x.goodId] ?? 0) === x.qty);
      const tanpaLebih = Object.entries(keranjang).every(([id, q]) => q === 0 || diminta.has(id));
      return { benar: cocokPesanan && tanpaLebih, detail: { pesanan: r.pesanan, keranjang } };
    }
    case "subitasi":
    case "sisa": {
      const total = keranjang ? totalKeranjang(keranjang) : null;
      return { benar: total === r.target, detail: { target: r.target, total, latencyMs } };
    }
    case "hitung": {
      const disentuh = "disentuh" in j ? j.disentuh : undefined;
      const hitungan = new Map<string, number>();
      for (const id of disentuh ?? []) hitungan.set(id, (hitungan.get(id) ?? 0) + 1);
      const disentuhGanda = [...hitungan.entries()].filter(([, n]) => n > 1).map(([id]) => id);
      const terlewat = disentuh ? r.benda.map((_, i) => String(i)).filter(id => !hitungan.has(id)) : [];
      const sentuhBeres = !disentuh || (disentuhGanda.length === 0 && terlewat.length === 0);
      return { benar: angka === r.target && sentuhBeres, detail: { target: r.target, angka, disentuhGanda, terlewat, latencyMs } };
    }
    case "gabung":
      return { benar: angka === r.target, detail: { target: r.target, angka, kelompok: r.kelompok } };
    case "bayar": {
      const jumlah = uang ? jumlahUang(uang) : null;
      return { benar: jumlah === r.harga, detail: { harga: r.harga, jumlah } };
    }
    case "kembalian": {
      const jumlah = uang ? jumlahUang(uang) : null;
      return { benar: jumlah === r.dibayar - r.harga, detail: { harga: r.harga, dibayar: r.dibayar, jumlah } };
    }
    case "tukar": {
      const jumlah = uang ? jumlahUang(uang) : null;
      return { benar: jumlah === r.dibayar, detail: { dibayar: r.dibayar, jumlahKoin: uang?.length ?? 0, jumlah } };
    }
    case "lengkapi": {
      const jumlah = uang ? jumlahUang(uang) : null;
      return { benar: jumlah === r.harga - r.dibayar, detail: { target: r.target, harga: r.harga, dibayar: r.dibayar, jumlah, latencyMs } };
    }
  }
  return { benar: false, detail: {} };
}
