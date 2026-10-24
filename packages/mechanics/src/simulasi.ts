// Mekanik simulasi: tiga belas mode (jam-baca, jam-putar, timbangan, jengkal, kubus, turus, taksir, tombol, alat, bagi,
// menara, bantuan, telusur). Satu buatRonde dengan switch mode; field yang tidak relevan diisi nilai kosong ([], {}, 0, false).
// Knob yang dibaca bila ada: hourMax, tipuan, maxSpans, snap, offset, count, kinds, gapMs, max, flashMs, pairs,
// tinggi & benda (menara), batas (bantuan), max & panah (telusur).

import type { PaketSimulasi } from "@akademi/schema";
import { acak, acakInt, pilihSatu, rng } from "./rng";
import type { Hasil, JawabanSimulasi, Knobs, RondeSimulasi } from "./types";

type Item = PaketSimulasi["items"][number];

export const ALAT_PANJANG = "penggaris-kubus";
export const ALAT_BERAT = "timbangan";
/** toleransi taksir (selisih mutlak) dan jengkal (celah/tumpang tindih dalam satuan jengkal) */
const TOLERANSI_TAKSIR = 3;
const TOLERANSI_JENGKAL = 0.2;
/** telusur: minimal rasio jalur angka yang disentuh, maksimal rasio sampel jari di luar toleransi */
export const TELUSUR_CAKUPAN_MIN = 0.85;
export const TELUSUR_KELUAR_MAX = 0.25;
/** menara: nilai benda — 0 menggelinding, 1 bisa ditumpuk, 2 tabung (bisa bila tegak = penemuan, dihitung bisa) */
export const MENARA_GELINDING = 0;
export const MENARA_TABUNG = 2;

function kosong(p: PaketSimulasi): RondeSimulasi {
  return { mode: p.mode, items: [], target: 0, options: [], urutan: [], peta: {}, snap: false, offset: 0, flashMs: 0 };
}

function jepit(n: number | undefined, min: number, max: number, def: number): number {
  if (n === undefined || !Number.isFinite(n)) return def;
  return Math.min(max, Math.max(min, Math.floor(n)));
}

function peran(p: PaketSimulasi, role: Item["role"]): Item[] {
  return p.items.filter(i => i.role === role);
}

/** Item dengan role tertentu yang punya value; bila tidak ada, jatuh ke semua item ber-value, lalu semua item. */
function bernilai(p: PaketSimulasi, role: Item["role"]): Item[] {
  const a = peran(p, role).filter(i => typeof i.value === "number");
  if (a.length) return a;
  const b = p.items.filter(i => typeof i.value === "number");
  return b.length ? b : p.items;
}

export function buatRondeSimulasi(p: PaketSimulasi, knobs: Knobs, seed: number): RondeSimulasi {
  const r = rng(seed);
  const dasar = kosong(p);

  switch (p.mode) {
    case "jam-baca": {
      const hourMax = jepit(knobs.hourMax, 1, 12, 6);
      const target = acakInt(r, 1, hourMax);
      const jumlah = acakInt(r, 3, 4);
      const kolam = Array.from({ length: Math.max(hourMax, 4) }, (_, i) => i + 1).filter(h => h !== target);
      const options = acak([target, ...acak(kolam, r).slice(0, jumlah - 1)], r);
      return { ...dasar, items: p.items, target, options };
    }
    case "jam-putar": {
      const k = pilihSatu(bernilai(p, "kegiatan"), r);
      return { ...dasar, items: [k], target: k.value ?? 0, correctId: k.id };
    }
    case "timbangan": {
      const benda = bernilai(p, "benda");
      const pasangan: [Item, Item][] = [];
      const tipuanSaja: [Item, Item][] = [];
      for (let i = 0; i < benda.length; i++) for (let j = i + 1; j < benda.length; j++) {
        const a = benda[i], b = benda[j];
        if ((a.value ?? 0) === (b.value ?? 0)) continue;
        pasangan.push([a, b]);
        const besar = (a.scale ?? 1) > (b.scale ?? 1) ? a : (b.scale ?? 1) > (a.scale ?? 1) ? b : null;
        if (besar) {
          const kecil = besar === a ? b : a;
          if ((besar.value ?? 0) < (kecil.value ?? 0)) tipuanSaja.push([a, b]);
        }
      }
      const kolam = jepit(knobs.tipuan, 0, 1, 0) === 1 && tipuanSaja.length ? tipuanSaja : pasangan;
      if (!kolam.length) return { ...dasar, items: benda.slice(0, 2), correctId: benda[0]?.id };
      const [a, b] = pilihSatu(kolam, r);
      const berat = (a.value ?? 0) > (b.value ?? 0) ? a : b;
      return { ...dasar, items: acak([a, b], r), correctId: berat.id };
    }
    case "jengkal": {
      const maxSpans = jepit(knobs.maxSpans, 1, 20, 5);
      const semua = bernilai(p, "benda");
      const muat = semua.filter(i => (i.value ?? 0) >= 1 && (i.value ?? 0) <= maxSpans);
      const b = pilihSatu(muat.length ? muat : semua, r);
      return { ...dasar, items: [b], target: b.value ?? 0, snap: jepit(knobs.snap, 0, 1, 1) === 1 };
    }
    case "kubus": {
      const b = pilihSatu(bernilai(p, "benda"), r);
      return { ...dasar, items: [b], target: b.value ?? 0, offset: jepit(knobs.offset, 0, 1, 0) };
    }
    case "turus": {
      const hewan = peran(p, "hewan").length ? peran(p, "hewan") : p.items;
      const kinds = jepit(knobs.kinds, 1, hewan.length, Math.min(2, hewan.length));
      const count = jepit(knobs.count, 1, 20, 6);
      const jenis = acak(hewan, r).slice(0, kinds);
      // tiap jenis muncul minimal sekali bila count cukup, sisanya acak
      const urutan: string[] = jenis.slice(0, Math.min(kinds, count)).map(h => h.id);
      while (urutan.length < count) urutan.push(pilihSatu(jenis, r).id);
      return { ...dasar, items: jenis, urutan: acak(urutan, r), flashMs: jepit(knobs.gapMs, 100, 10000, 1200) };
    }
    case "taksir": {
      const max = jepit(knobs.max, 1, 20, 20);
      const target = acakInt(r, Math.min(8, max), max);
      const benda = peran(p, "benda").length ? peran(p, "benda") : p.items;
      return { ...dasar, items: [pilihSatu(benda, r)], target, options: [0, 20], flashMs: jepit(knobs.flashMs, 100, 10000, 1500) };
    }
    case "tombol": {
      const tombol = acak(peran(p, "tombol"), r);
      const alat = acak(peran(p, "alat"), r);
      const pairs = Math.min(jepit(knobs.pairs, 2, 3, 2), tombol.length, alat.length);
      const t = tombol.slice(0, pairs), a = alat.slice(0, pairs);
      const peta: Record<string, string> = {};
      t.forEach((x, i) => { peta[x.id] = a[i].id; });
      return { ...dasar, items: [...t, ...a], urutan: acak(t.map(x => x.id), r), peta };
    }
    case "alat": {
      const h = pilihSatu(bernilai(p, "hewan"), r);
      const correctId = h.value === 2 ? ALAT_BERAT : ALAT_PANJANG;
      return { ...dasar, items: [h, ...acak(peran(p, "alat"), r)], target: h.value ?? 1, correctId };
    }
    case "bagi": {
      const max = jepit(knobs.max, 2, 8, 8);
      const kandidat = [2, 4, 6, 8].filter(n => n <= max);
      const target = pilihSatu(kandidat.length ? kandidat : [2], r);
      const benda = peran(p, "benda").length ? peran(p, "benda") : p.items;
      return { ...dasar, items: [pilihSatu(benda, r)], target };
    }
    case "menara": {
      // target = tinggi menara (knob tinggi, default 4); benda di lantai = knob benda (default 5–6 acak), dijamin ≥ target yang bisa
      // ditumpuk dan ≥ 1 yang menggelinding (bila paket punya keduanya) supaya penemuan "bola jatuh" selalu mungkin.
      const semua = bernilai(p, "benda");
      const target = jepit(knobs.tinggi, 2, 8, 4);
      const jumlah = Math.min(semua.length, knobs.benda !== undefined ? jepit(knobs.benda, 2, 12, 5) : acakInt(r, 5, 6));
      const bisa = acak(semua.filter(i => (i.value ?? 0) !== MENARA_GELINDING), r);
      const gelinding = acak(semua.filter(i => (i.value ?? 0) === MENARA_GELINDING), r);
      const wajibBisa = Math.min(bisa.length, Math.max(target, jumlah - gelinding.length));
      const wajibGelinding = Math.min(gelinding.length, Math.max(gelinding.length ? 1 : 0, jumlah - wajibBisa));
      const dipilih = [...bisa.slice(0, wajibBisa), ...gelinding.slice(0, wajibGelinding)];
      const sisa = acak([...bisa.slice(wajibBisa), ...gelinding.slice(wajibGelinding)], r);
      while (dipilih.length < jumlah && sisa.length) dipilih.push(sisa.shift()!);
      return { ...dasar, items: acak(dipilih, r), target };
    }
    case "bantuan": {
      const alat = peran(p, "alat").length ? peran(p, "alat") : p.items;
      const macet = pilihSatu(alat, r);
      return { ...dasar, items: acak(alat, r), correctId: macet.id, target: jepit(knobs.batas, 1, 20, 5) };
    }
    case "telusur": {
      const max = jepit(knobs.max, 1, 5, 5);
      return { ...dasar, items: p.items, target: acakInt(r, 1, max), offset: jepit(knobs.panah, 0, 1, 1) };
    }
  }
}

const angkaDari = (j: JawabanSimulasi): number | null =>
  "angka" in j && typeof j.angka === "number" && Number.isFinite(j.angka) ? j.angka : null;

export function nilaiSimulasi(r: RondeSimulasi, j: JawabanSimulasi): Hasil {
  switch (r.mode) {
    case "jam-baca":
    case "jam-putar":
    case "kubus": {
      const angka = angkaDari(j);
      return { benar: angka === r.target, detail: { angka, target: r.target } };
    }
    case "taksir": {
      const angka = angkaDari(j);
      const selisih = angka === null ? Infinity : Math.abs(angka - r.target);
      return { benar: selisih <= TOLERANSI_TAKSIR, detail: { angka, target: r.target, selisih } };
    }
    case "timbangan":
    case "alat": {
      const pilih = "pilih" in j && typeof j.pilih === "string" ? j.pilih : "";
      return { benar: pilih === r.correctId, detail: { pilih, correctId: r.correctId ?? "" } };
    }
    case "jengkal": {
      const posisi = "posisi" in j && Array.isArray(j.posisi) ? j.posisi : [];
      const angka = angkaDari(j);
      let celah = 0, tumpang = 0, terurut = true;
      for (let i = 0; i + 1 < posisi.length; i++) {
        const d = posisi[i + 1] - posisi[i];
        if (d < 0) terurut = false;
        if (d - 1 > TOLERANSI_JENGKAL) celah++;
        if (d - 1 < -TOLERANSI_JENGKAL) tumpang++;
      }
      const benar = angka === r.target && posisi.length === r.target && terurut && celah === 0 && tumpang === 0;
      return { benar, detail: { angka, target: r.target, jumlahJengkal: posisi.length, celah, tumpang, terurut } };
    }
    case "turus": {
      const turus = "turus" in j && j.turus && typeof j.turus === "object" ? j.turus : {};
      const hitung: Record<string, number> = {};
      for (const id of r.urutan) hitung[id] = (hitung[id] ?? 0) + 1;
      const salah = Object.keys(hitung).filter(id => (turus[id] ?? 0) !== hitung[id]);
      return { benar: salah.length === 0, detail: { salah, seharusnya: hitung } };
    }
    case "tombol": {
      const tebakan = "tebakan" in j && j.tebakan && typeof j.tebakan === "object" ? j.tebakan : {};
      const salah = r.urutan.filter(t => tebakan[t] !== r.peta[t]);
      return { benar: salah.length === 0, detail: { salah, diuji: r.urutan.length } };
    }
    case "bagi": {
      const kiri = "kiri" in j && typeof j.kiri === "number" ? j.kiri : -1;
      const kanan = "kanan" in j && typeof j.kanan === "number" ? j.kanan : -1;
      const benar = kiri >= 0 && kanan >= 0 && kiri === kanan && kiri + kanan === r.target;
      return { benar, detail: { kiri, kanan, target: r.target } };
    }
    case "menara": {
      const tumpukan = "tumpukan" in j && Array.isArray(j.tumpukan) ? j.tumpukan.filter((x): x is string => typeof x === "string") : [];
      const nilaiBenda = new Map(r.items.map(i => [i.id, i.value ?? 1] as const));
      // jatuhDi = indeks (dari bawah) benda pertama yang menggelinding / tidak dikenal / dipakai dua kali; null bila menara berdiri
      let jatuhDi: number | null = null;
      const dipakai = new Set<string>();
      for (let i = 0; i < tumpukan.length; i++) {
        const v = nilaiBenda.get(tumpukan[i]);
        if (v === undefined || v === MENARA_GELINDING || dipakai.has(tumpukan[i])) { jatuhDi = i; break; }
        dipakai.add(tumpukan[i]);
      }
      const tabung = tumpukan.filter(id => nilaiBenda.get(id) === MENARA_TABUNG).length;
      const benar = jatuhDi === null && tumpukan.length === r.target;
      return { benar, detail: { jatuhDi, tinggi: tumpukan.length, target: r.target, tabung } };
    }
    case "bantuan": {
      const ketukanSiaSia = "ketukanSiaSia" in j && typeof j.ketukanSiaSia === "number" && Number.isFinite(j.ketukanSiaSia) ? Math.max(0, Math.floor(j.ketukanSiaSia)) : Infinity;
      const mintaTolong = "mintaTolong" in j && j.mintaTolong === true;
      const benar = mintaTolong && ketukanSiaSia <= r.target;
      return { benar, detail: { ketukanSiaSia: Number.isFinite(ketukanSiaSia) ? ketukanSiaSia : null, mintaTolong, batas: r.target, macet: r.correctId ?? "" } };
    }
    case "telusur": {
      const angka = angkaDari(j);
      const jepit01 = (v: unknown, def: number) => (typeof v === "number" && Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : def);
      const cakupan = jepit01("cakupan" in j ? j.cakupan : undefined, 0);
      const keluar = jepit01("keluar" in j ? j.keluar : undefined, 1);
      const benar = angka === r.target && cakupan >= TELUSUR_CAKUPAN_MIN && keluar <= TELUSUR_KELUAR_MAX;
      return { benar, detail: { angka, target: r.target, cakupan, keluar, panah: r.offset === 1 } };
    }
  }
}
