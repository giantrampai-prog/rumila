import { describe, expect, it } from "vitest";
import { ASPEK, indeks, kunciBentuk, pasanganCepat, ringkasProfil, samaDiputar, soalPola, soalSpasial, urutanMemori, type HasilBerpikir } from "../berpikir";

describe("soal profil berpikir", () => {
  it("pola: 8 soal, satu jawaban benar, pilihan unik", () => {
    for (const seed of [1, 7, 99, 12345]) {
      const s = soalPola(seed);
      expect(s).toHaveLength(8);
      for (const q of s) {
        expect(q.benar).toBeGreaterThanOrEqual(0);
        const k = q.pilihan.map((p) => `${p.warna}${p.bentuk}${p.n}`);
        expect(new Set(k).size).toBe(k.length);
        expect(q.pilihan.length).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("spasial: jawaban = contoh diputar, pengecoh tidak bisa diputar jadi contoh", () => {
    for (const seed of [1, 2, 3, 42, 777]) {
      for (const q of soalSpasial(seed)) {
        expect(samaDiputar(q.contoh, q.pilihan[q.benar])).toBe(true);
        q.pilihan.forEach((p, i) => i !== q.benar && expect(samaDiputar(q.contoh, p)).toBe(false));
        expect(new Set(q.pilihan.map(kunciBentuk)).size).toBe(3);
      }
    }
  });

  it("memori tanpa kotak sama berturut; kecepatan seimbang", () => {
    const u = urutanMemori(5, 8);
    expect(u).toHaveLength(8);
    u.forEach((k, i) => i && expect(k).not.toBe(u[i - 1]));
    const p = pasanganCepat(3, 200);
    const sama = p.filter((x) => x.sama).length;
    expect(sama).toBeGreaterThan(60);
    p.forEach((x) => expect(x.kiri === x.kanan).toBe(x.sama));
  });
});

describe("indeks vs target usia", () => {
  const h = (usia: number, pola: number, span: number, spasial: number, cepat: number): HasilBerpikir => ({ at: "", usia, pola: { benar: pola, total: 8 }, memori: { span }, spasial: { benar: spasial, total: 8 }, kecepatan: { benar: cepat, salah: 0 } });
  it("anak 6 th sesuai target ≈ 100; jauh di atas → Menonjol; empat aspek, tanpa angka gabungan", () => {
    const xs = indeks(h(6, 4, 3, 4, 10));
    expect(xs.map((x) => x.aspek)).toEqual([...ASPEK]);
    xs.forEach((x) => expect(x.pita).toBe("Sesuai usia"));
    expect(indeks(h(6, 8, 6, 8, 20)).every((x) => x.pita === "Menonjol")).toBe(true);
    expect(indeks(h(10, 1, 2, 1, 2)).every((x) => x.pita === "Perlu latihan")).toBe(true);
  });
  it("ringkasan menyebut aspek terkuat & yang perlu latihan", () => {
    expect(ringkasProfil(h(6, 8, 3, 2, 10))).toEqual({ kuat: "pola", latih: "spasial" });
  });
});
