// Mode pengaya (24 Okt 2026): simulasi menara / bantuan / telusur dan urutkan label.
import { describe, expect, it } from "vitest";
import { ContentPack, type PaketSimulasi, type PaketUrutkan } from "@akademi/schema";
import {
  buatRonde, buatRondeSimulasi, buatRondeUrutkan, knobDefaults, labelUrutan, nilai, nilaiSimulasi, nilaiUrutkan,
  TELUSUR_CAKUPAN_MIN, TELUSUR_KELUAR_MAX, type RondeSimulasi, type RondeUrutkan,
} from "../src";

const dasar = { version: "1.0.0", level: "TKA", instructionKey: "instruksi", knobs: {} };
const locale = (keys: string[]) => {
  const d: Record<string, string> = { instruksi: "Ayo", judul: "Judul" };
  for (const k of keys) d[k] = k;
  return { id: d, en: { ...d } };
};

function paketSim(mode: PaketSimulasi["mode"], items: Array<Record<string, unknown>>): PaketSimulasi {
  return ContentPack.parse({
    ...dasar, id: `sim-${mode}`, mechanic: "simulasi", mode, items, competencyIds: ["MAT.TKA.BENTUK-RUANG.02"],
    locale: locale(items.map(i => String(i.id))),
  }) as PaketSimulasi;
}

const BENDA_MENARA = [
  { id: "kubus", labelKey: "kubus", role: "benda", value: 1, emoji: "🧊" },
  { id: "kotak", labelKey: "kotak", role: "benda", value: 1, emoji: "📦" },
  { id: "buku", labelKey: "buku", role: "benda", value: 1, emoji: "📕" },
  { id: "kaleng", labelKey: "kaleng", role: "benda", value: 2, emoji: "🥫" },
  { id: "bola-sepak", labelKey: "bola-sepak", role: "benda", value: 0, emoji: "⚽" },
  { id: "bola-basket", labelKey: "bola-basket", role: "benda", value: 0, emoji: "🏀" },
  { id: "bola-tenis", labelKey: "bola-tenis", role: "benda", value: 0, emoji: "🎾" },
];
const ALAT_RUMAH = [
  { id: "keran", labelKey: "keran", role: "alat", emoji: "🚰" },
  { id: "lampu", labelKey: "lampu", role: "alat", emoji: "💡" },
  { id: "pintu", labelKey: "pintu", role: "alat", emoji: "🚪" },
];
const PETI = [{ id: "peti", labelKey: "peti", role: "benda", emoji: "🧰" }];

/* ---------------- menara ---------------- */

describe("simulasi menara", () => {
  const p = paketSim("menara", BENDA_MENARA);
  it("ronde: target 4, 5–6 benda, ≥4 yang bisa ditumpuk dan ≥1 yang menggelinding, deterministik", () => {
    for (const seed of [1, 2, 3, 4, 5, 6, 7, 8]) {
      const r = buatRondeSimulasi(p, {}, seed);
      expect(r.target).toBe(4);
      expect(r.items.length).toBeGreaterThanOrEqual(5);
      expect(r.items.length).toBeLessThanOrEqual(6);
      expect(new Set(r.items.map(i => i.id)).size).toBe(r.items.length);
      expect(r.items.filter(i => i.value !== 0).length).toBeGreaterThanOrEqual(4);
      expect(r.items.filter(i => i.value === 0).length).toBeGreaterThanOrEqual(1);
    }
    expect(buatRondeSimulasi(p, {}, 3)).toEqual(buatRondeSimulasi(p, {}, 3));
    expect(buatRondeSimulasi(p, { tinggi: 3, benda: 6 }, 1)).toMatchObject({ target: 3 });
    expect(buatRondeSimulasi(p, { tinggi: 3, benda: 6 }, 1).items).toHaveLength(6);
  });
  it("nilai: 4 benda rata berdiri = benar; tabung tegak dihitung bisa (penemuan) dengan detail.tabung", () => {
    const r = buatRondeSimulasi(p, {}, 2);
    const bisa = r.items.filter(i => i.value !== 0).map(i => i.id).slice(0, 4);
    const h = nilaiSimulasi(r, { tumpukan: bisa });
    expect(h.benar).toBe(true);
    expect(h.detail.jatuhDi).toBeNull();
    const dgnTabung: RondeSimulasi = { ...r, items: BENDA_MENARA.slice(0, 5) as RondeSimulasi["items"] };
    const h2 = nilaiSimulasi(dgnTabung, { tumpukan: ["kubus", "kaleng", "kotak", "buku"] });
    expect(h2.benar).toBe(true);
    expect(h2.detail.tabung).toBe(1);
  });
  it("nilai: bola di tengah → jatuhDi = indeksnya; kurang dari target atau benda ganda = salah", () => {
    const r: RondeSimulasi = { ...buatRondeSimulasi(p, {}, 2), items: BENDA_MENARA as RondeSimulasi["items"] };
    const h = nilaiSimulasi(r, { tumpukan: ["kubus", "kotak", "bola-sepak", "buku"] });
    expect(h.benar).toBe(false);
    expect(h.detail.jatuhDi).toBe(2);
    expect(nilaiSimulasi(r, { tumpukan: ["kubus", "kotak", "buku"] })).toMatchObject({ benar: false, detail: { jatuhDi: null, tinggi: 3 } });
    expect(nilaiSimulasi(r, { tumpukan: ["kubus", "kubus", "kotak", "buku"] }).detail.jatuhDi).toBe(1);
    expect(nilaiSimulasi(r, { angka: 4 }).benar).toBe(false);
  });
});

/* ---------------- bantuan ---------------- */

describe("simulasi bantuan", () => {
  const p = paketSim("bantuan", ALAT_RUMAH);
  it("ronde: satu alat macet dipilih acak (correctId ∈ alat), semua alat tampil, batas default 5 (knob batas)", () => {
    const macet = new Set<string>();
    for (const seed of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
      const r = buatRondeSimulasi(p, {}, seed);
      expect(r.items).toHaveLength(3);
      expect(r.items.map(i => i.id)).toContain(r.correctId);
      expect(r.target).toBe(5);
      macet.add(r.correctId!);
    }
    expect(macet.size).toBeGreaterThan(1);
    expect(buatRondeSimulasi(p, { batas: 3 }, 1).target).toBe(3);
  });
  it("nilai: minta tolong setelah ≤ 5 ketukan = benar; > 5 atau tidak minta tolong = belum", () => {
    const r = buatRondeSimulasi(p, {}, 1);
    expect(nilaiSimulasi(r, { ketukanSiaSia: 0, mintaTolong: true }).benar).toBe(true);
    expect(nilaiSimulasi(r, { ketukanSiaSia: 5, mintaTolong: true }).benar).toBe(true);
    const h = nilaiSimulasi(r, { ketukanSiaSia: 6, mintaTolong: true });
    expect(h.benar).toBe(false);
    expect(h.detail).toMatchObject({ ketukanSiaSia: 6, mintaTolong: true, batas: 5 });
    expect(nilaiSimulasi(r, { ketukanSiaSia: 2, mintaTolong: false }).benar).toBe(false);
    expect(nilaiSimulasi(r, { angka: 1 }).benar).toBe(false);
  });
});

/* ---------------- telusur ---------------- */

describe("simulasi telusur", () => {
  const p = paketSim("telusur", PETI);
  it("ronde: target 1..max (knob max, default 5), offset = knob panah (default 1), snap tidak dipakai", () => {
    const terlihat = new Set<number>();
    for (const seed of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
      const r = buatRondeSimulasi(p, {}, seed);
      expect(r.target).toBeGreaterThanOrEqual(1);
      expect(r.target).toBeLessThanOrEqual(5);
      expect(r.offset).toBe(1);
      expect(r.snap).toBe(false);
      terlihat.add(r.target);
      expect(buatRondeSimulasi(p, { max: 2 }, seed).target).toBeLessThanOrEqual(2);
    }
    expect(terlihat.size).toBeGreaterThan(2);
    expect(buatRondeSimulasi(p, { panah: 0 }, 1).offset).toBe(0);
  });
  it("nilai: cakupan ≥ 0.85 dan keluar ≤ 0.25 pada angka yang benar = benar; di luar ambang atau angka lain = salah", () => {
    const r = buatRondeSimulasi(p, {}, 4);
    expect(TELUSUR_CAKUPAN_MIN).toBe(0.85);
    expect(TELUSUR_KELUAR_MAX).toBe(0.25);
    expect(nilaiSimulasi(r, { angka: r.target, cakupan: 0.9, keluar: 0.1 }).benar).toBe(true);
    expect(nilaiSimulasi(r, { angka: r.target, cakupan: 0.85, keluar: 0.25 }).benar).toBe(true);
    expect(nilaiSimulasi(r, { angka: r.target, cakupan: 0.8, keluar: 0.1 }).benar).toBe(false);
    expect(nilaiSimulasi(r, { angka: r.target, cakupan: 1, keluar: 0.3 }).benar).toBe(false);
    expect(nilaiSimulasi(r, { angka: (r.target % 5) + 1, cakupan: 1, keluar: 0 }).benar).toBe(false);
    const h = nilaiSimulasi(r, { angka: r.target });
    expect(h.benar).toBe(false);
    expect(h.detail).toMatchObject({ cakupan: 0, keluar: 1, panah: true });
  });
});

/* ---------------- urutkan label ---------------- */

function paketLabel(): PaketUrutkan {
  const langkah = (id: string) => ({ id, labelKey: id, emoji: "🌱" });
  return ContentPack.parse({
    ...dasar, id: "urut-label", mechanic: "urutkan", mode: "label", competencyIds: ["KODE.TKA.URUTAN.02"],
    knobs: { steps: { min: 3, max: 4, default: 3, keterangan: "langkah" } },
    locale: locale(["pagi", "tanam", "bangun", "mandi", "sarapan", "berangkat", "gali", "biji", "siram", "tumbuh"]),
    sequences: [
      { id: "pagi", titleKey: "pagi", steps: ["bangun", "mandi", "sarapan", "berangkat"].map(langkah) },
      { id: "tanam", titleKey: "tanam", steps: ["gali", "biji", "siram", "tumbuh"].map(langkah) },
    ],
  }) as PaketUrutkan;
}

describe("urutkan label", () => {
  const p = paketLabel();
  it("labelUrutan: 3 → pertama/lalu/terakhir, 4 → dua 'lalu'", () => {
    expect(labelUrutan(3)).toEqual(["pertama", "lalu", "terakhir"]);
    expect(labelUrutan(4)).toEqual(["pertama", "lalu", "lalu", "terakhir"]);
    expect(labelUrutan(2)).toEqual(["pertama", "terakhir"]);
  });
  it("ronde: shown = langkah urut benar (tidak diacak), labels sesuai jumlah langkah; knob steps 3 → 4", () => {
    const r3 = buatRondeUrutkan(p, knobDefaults(p), 5);
    expect(r3.mode).toBe("label");
    expect(r3.shown.map(s => s.id)).toEqual(r3.correct);
    expect(r3.shown).toHaveLength(3);
    expect(r3.labels).toEqual(["pertama", "lalu", "terakhir"]);
    const r4 = buatRondeUrutkan(p, { steps: 4 }, 5);
    expect(r4.shown).toHaveLength(4);
    expect(r4.labels).toEqual(["pertama", "lalu", "lalu", "terakhir"]);
    expect(buatRondeUrutkan(p, { steps: 4 }, 5)).toEqual(r4);
  });
  it("nilai: label sama persis = benar; 'terakhir' di gambar ke-2 = salah dengan terputusDi 1; jawaban bentuk lain = salah", () => {
    const r: RondeUrutkan = buatRondeUrutkan(p, { steps: 3 }, 2);
    expect(nilaiUrutkan(r, { labels: ["pertama", "lalu", "terakhir"] }).benar).toBe(true);
    const h = nilaiUrutkan(r, { labels: ["pertama", "terakhir", "lalu"] });
    expect(h.benar).toBe(false);
    expect(h.detail.salah).toEqual([1, 2]);
    expect(h.detail.terputusDi).toBe(1);
    expect(nilaiUrutkan(r, { labels: ["pertama", "lalu"] }).benar).toBe(false);
    expect(nilaiUrutkan(r, r.correct).benar).toBe(false);
    expect(nilaiUrutkan(r, "bangun").benar).toBe(false);
  });
});

describe("index: mode pengaya lewat buatRonde/nilai", () => {
  it("menara & label terbungkus mechanic yang benar dan dinilai lewat index", () => {
    const ps = paketSim("menara", BENDA_MENARA);
    const ws = buatRonde(ps, knobDefaults(ps), 1);
    expect(ws.mechanic).toBe("simulasi");
    const rs = ws.ronde as RondeSimulasi;
    expect(nilai(ps, ws, { tumpukan: rs.items.filter(i => i.value !== 0).slice(0, rs.target).map(i => i.id) }).benar).toBe(true);
    const pu = paketLabel();
    const wu = buatRonde(pu, knobDefaults(pu), 1);
    expect(wu.mechanic).toBe("urutkan");
    expect(nilai(pu, wu, { labels: (wu.ronde as RondeUrutkan).labels! }).benar).toBe(true);
  });
});
