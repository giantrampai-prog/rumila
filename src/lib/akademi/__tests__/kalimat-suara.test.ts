// Kalimat yang diucapkan dari kode harus ada di daftar rekaman scripts/akademi-suara.ts (kalimatUmum + kalimatPaket +
// locale paket): ronde dibangkitkan lewat generator asli untuk banyak seed dan semua posisi knob, lalu kalimat yang
// akan dibacakan presenter dibangun dengan pembangun yang sama dan dicek ada di daftar (utuh, atau semua potongannya).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { ContentPack, type PaketDagang } from "@akademi/schema";
import { buatRonde, type Knobs } from "@akademi/mechanics";
import { rincianHarga } from "@/components/akademi/dagang";
import {
  ANGKA_KATA, KATA_URUTAN, RATUSAN_KATA, angkaKata, bilanganPotongan, kalimatDagang, kalimatPaket, kalimatSimulasi, kalimatUjian,
  kalimatUmum, kalimatUrutkan, kerjaSisa, type Ucapan,
} from "@/lib/akademi/kalimat-suara";

const KOIN = 1000;

function jsonRekursif(dir: string): string[] {
  const st = statSync(dir);
  if (st.isFile()) return dir.endsWith(".json") ? [dir] : [];
  return readdirSync(dir).sort().flatMap((f) => jsonRekursif(join(dir, f)));
}

const paket: ContentPack[] = jsonRekursif(resolve(process.cwd(), "content/paket")).flatMap((f) => {
  const r = ContentPack.safeParse(JSON.parse(readFileSync(f, "utf8")));
  return r.success ? [r.data] : [];
});

const umum = new Set(kalimatUmum().map((k) => k.teks));

/** Daftar rekaman untuk satu paket (pendekatan skrip): umum + kalimatPaket + semua teks locale.id. */
function daftarRekam(p: ContentPack) {
  return new Set([...umum, ...kalimatPaket(p).map((k) => k.teks), ...Object.values(p.locale.id)]);
}

/** Knob seperti runner: semua knob digeser bersama ±step dari default, dijepit ke [min, max]. */
function posisiKnob(p: ContentPack): Knobs[] {
  const out: Knobs[] = [];
  for (let geser = -12; geser <= 12; geser++) {
    const k: Knobs = {};
    for (const [nama, d] of Object.entries(p.knobs)) k[nama] = Math.min(d.max, Math.max(d.min, d.default + geser * (d.step ?? 1)));
    out.push(k);
  }
  return out;
}

function harusTerekam(rekam: Set<string>, u: string | Ucapan, konteks: string) {
  if (typeof u === "string") {
    expect(rekam.has(u), `${konteks}: "${u}"`).toBe(true);
    return;
  }
  if (rekam.has(u.teks)) return;
  const hilang = u.potongan.filter((x) => !rekam.has(x));
  expect(u.potongan.length && hilang, `${konteks}: "${u.teks}" — potongan hilang ${JSON.stringify(hilang)}`).toEqual([]);
}

describe("bilangan", () => {
  it("kata bilangan baku 0–100", () => {
    expect(ANGKA_KATA).toHaveLength(101);
    expect(new Set(ANGKA_KATA).size).toBe(101);
    expect([0, 1, 10, 11, 12, 19, 20, 21, 47, 90, 99, 100].map(angkaKata)).toEqual([
      "nol", "satu", "sepuluh", "sebelas", "dua belas", "sembilan belas", "dua puluh", "dua puluh satu", "empat puluh tujuh", "sembilan puluh", "sembilan puluh sembilan", "seratus",
    ]);
  });

  it("potongan rupiah hanya memakai potongan yang direkam", () => {
    expect(bilanganPotongan(24300)).toEqual(["dua puluh empat", "ribu", "tiga ratus"]);
    expect(bilanganPotongan(1500)).toEqual(["seribu", "lima ratus"]);
    expect(bilanganPotongan(100000)).toEqual(["seratus", "ribu"]);
    expect(bilanganPotongan(230000)).toEqual(["dua ratus", "tiga puluh", "ribu"]);
    expect(bilanganPotongan(5000)).toEqual(["lima", "ribu"]);
    const kenal = new Set([...ANGKA_KATA, ...RATUSAN_KATA, "seribu", "ribu"]);
    for (let n = 0; n < 1_000_000; n += 100) for (const x of bilanganPotongan(n)) expect(kenal.has(x), `${n}: ${x}`).toBe(true);
  });
});

describe("pembangun kalimat stabil (teks sama dengan yang sudah tampil/terekam)", () => {
  it("simulasi", () => {
    expect(kalimatSimulasi.jamPutar("makan siang", 12)).toBe("Robot makan siang pukul 12. Putar jarum pendeknya!");
    expect(kalimatSimulasi.alat("Kucing", true)).toBe("Kucing bertanya: Seberapa berat? Pilih alat yang tepat.");
    expect(kalimatSimulasi.telusur(3, true)).toBe("Telusuri angka 3 dengan jarimu, ikuti panahnya. Itu mantra pembuka peti!");
    expect(kalimatSimulasi.telusur(0, false)).toBe("Telusuri angka 0 dengan jarimu. Itu mantra pembuka peti!");
    expect(kalimatSimulasi.menara(4)).toBe("Bangun menara 4 tingkat. Ketuk benda untuk menaruhnya di atas.");
  });
  it("urutkan & ujian", () => {
    expect(kalimatUrutkan.cerita(KATA_URUTAN.lalu, "mandi")).toBe("lalu, mandi.");
    expect(kalimatUjian.belum(45)).toEqual({ teks: "Nilaimu 45. Ayo ulangi materinya, lalu coba besok.", potongan: ["Nilaimu", "empat puluh lima", "Ayo ulangi materinya, lalu coba besok."] });
    for (let n = 0; n <= 100; n++)
      for (const u of [kalimatUjian.latihan(n), kalimatUjian.akhir(n), kalimatUjian.lulus(n), kalimatUjian.belum(n)]) harusTerekam(umum, u, `ujian ${n}`);
  });
  it("dagang", () => {
    const nama = (id: string) => id;
    expect(kalimatDagang.pesanan([{ qty: 3, nama: "jeruk" }, { qty: 2, nama: "apel" }])).toEqual({ teks: "Aku mau 3 jeruk dan 2 apel.", potongan: ["Aku mau", "tiga", "jeruk", "dan", "dua", "apel"] });
    expect(kalimatDagang.bayarRincian([{ goodId: "buku", qty: 2, price: 23000 }, { goodId: "pensil", qty: 1, price: 9000 }], nama).teks).toBe(
      "buku 2 kali 23.000 rupiah dan pensil 9.000 rupiah. Berapa semuanya? Bayar dengan uang pas.",
    );
    expect(kalimatDagang.tukar([5000, 2000], 7000)).toBe("Tolong tukar uang 5.000 dan 2.000, semuanya 7.000, jadi koin seribuan.");
    expect(kalimatDagang.sisa({ kolam: false, awal: 5, diambil: 2, benda: "kue", penanda: "lilin", samaPenanda: false, kerja: kerjaSisa("toko-kue") }).teks).toBe(
      "Ada 5 kue. 2 kue dibeli. Taruh lilin sebanyak kue yang tersisa, satu lilin untuk satu kue.",
    );
  });
});

describe("semua kalimat ronde masuk daftar rekaman", () => {
  const SEED = 40;

  it("simulasi", () => {
    for (const p of paket) {
      if (p.mechanic !== "simulasi") continue;
      const rekam = daftarRekam(p);
      const nama = (id: string) => { const i = p.items.find((x) => x.id === id); return i ? p.locale.id[i.labelKey] : id; };
      for (const knobs of posisiKnob(p)) for (let seed = 1; seed <= SEED; seed++) {
        const r = buatRonde(p, knobs, seed);
        if (r.mechanic !== "simulasi") continue;
        const o = r.ronde;
        const ctx = `${p.id}#${seed}`;
        const benda = o.items.find((i) => i.role === "benda") ?? o.items[0];
        switch (o.mode) {
          case "jam-baca": for (const n of o.options) harusTerekam(rekam, kalimatSimulasi.pukul(n), ctx); break;
          case "jam-putar":
            harusTerekam(rekam, kalimatSimulasi.jamPutar(nama(o.correctId ?? ""), o.target), ctx);
            harusTerekam(rekam, kalimatSimulasi.jamPutarBantu(o.target), ctx);
            break;
          case "jengkal": harusTerekam(rekam, kalimatSimulasi.jengkal(nama(benda.id)), ctx); break;
          case "kubus": harusTerekam(rekam, kalimatSimulasi.kubus(nama(benda.id)), ctx); break;
          case "tombol":
            for (const t of o.urutan) { harusTerekam(rekam, kalimatSimulasi.tombolTebak(nama(t)), ctx); harusTerekam(rekam, kalimatSimulasi.tombolTekan(nama(t)), ctx); }
            break;
          case "alat": { const h = o.items.find((i) => i.role === "hewan") ?? o.items[0]; harusTerekam(rekam, kalimatSimulasi.alat(nama(h.id), h.value === 2), ctx); break; }
          case "menara": harusTerekam(rekam, kalimatSimulasi.menara(o.target), ctx); break;
          case "telusur": harusTerekam(rekam, kalimatSimulasi.telusur(o.target, o.offset === 1), ctx); break;
        }
      }
    }
  });

  it("dagang", () => {
    for (const p of paket) {
      if (p.mechanic !== "dagang") continue;
      const pd = p as PaketDagang;
      const rekam = daftarRekam(p);
      const nama = (id: string) => { const g = pd.goods.find((x) => x.id === id); return g ? pd.locale.id[g.labelKey] : id; };
      for (const knobs of posisiKnob(p)) for (let seed = 1; seed <= SEED; seed++) {
        const r = buatRonde(p, knobs, seed);
        if (r.mechanic !== "dagang") continue;
        const o = r.ronde;
        const ctx = `${p.id}#${seed}`;
        const id0 = Object.keys(o.tersedia)[0] ?? "";
        switch (o.mode) {
          case "ambil": harusTerekam(rekam, kalimatDagang.pesanan(o.pesanan.map((x) => ({ qty: x.qty, nama: nama(x.goodId) }))), ctx); break;
          case "subitasi": harusTerekam(rekam, kalimatDagang.subitasi(nama(o.pesanan[0]?.goodId ?? id0)), ctx); break;
          case "hitung": harusTerekam(rekam, kalimatDagang.hitung(nama(o.benda[0] ?? "")), ctx); break;
          case "bayar": {
            const rin = rincianHarga(pd, o);
            harusTerekam(rekam, rin ? kalimatDagang.bayarRincian(rin, nama) : o.priceLabel === "koin" ? kalimatDagang.hargaKoin(Math.round(o.harga / KOIN)) : kalimatDagang.hargaRupiah(o.harga), ctx);
            break;
          }
          case "kembalian": {
            const rin = rincianHarga(pd, o);
            harusTerekam(rekam, rin ? kalimatDagang.kembalianRincian(o.dibayar, rin, nama) : kalimatDagang.kembalian(o.dibayar, o.harga), ctx);
            break;
          }
          case "tukar": harusTerekam(rekam, kalimatDagang.tukar(o.lembar.length ? o.lembar : [o.dibayar], o.dibayar), ctx); break;
          case "lengkapi": harusTerekam(rekam, kalimatDagang.lengkapi(Math.round(o.harga / KOIN)), ctx); break;
          case "gabung": harusTerekam(rekam, kalimatDagang.gabung(o.kelompok[0], o.kelompok[1], nama(id0)), ctx); break;
          case "sisa": {
            const penanda = o.pesanan[0]?.goodId ?? id0;
            harusTerekam(rekam, kalimatDagang.sisa({ kolam: pd.world === "kolam", awal: o.kelompok[0], diambil: o.kelompok[1], benda: nama(id0), penanda: nama(penanda), samaPenanda: penanda === id0, kerja: kerjaSisa(pd.world) }), ctx);
            break;
          }
        }
      }
    }
  });

  it("urutkan label & pilah PAUD–TK", () => {
    for (const p of paket) {
      if (p.mechanic === "urutkan" && p.mode === "label") {
        const rekam = daftarRekam(p);
        for (const s of p.sequences) for (const x of s.steps) for (const k of Object.values(KATA_URUTAN)) harusTerekam(rekam, kalimatUrutkan.cerita(k, p.locale.id[x.labelKey]), p.id);
      }
    }
  });
});
