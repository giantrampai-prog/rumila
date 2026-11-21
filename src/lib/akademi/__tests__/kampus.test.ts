import { describe, expect, it } from "vitest";
import { ALL_TOOLS } from "../../catalog";
import { GEDUNG, RUTE_ALAT, alatSiap, daftarDisiapkan, isiGedung } from "../../kampus";

const semua = () => true;

describe("Kampus RINOYA", () => {
  it("setiap alat yang sudah berisi punya gedung (tidak ada konten yang hilang dari beranda)", () => {
    const diGedung = new Set(GEDUNG.flatMap((g) => isiGedung(g, semua).map((t) => t.id)));
    const siap = ALL_TOOLS.filter(alatSiap).map((t) => t.id);
    expect(siap.length).toBeGreaterThanOrEqual(14);
    for (const id of siap) expect(diGedung, id).toContain(id);
  });

  it("setiap alat yang belum berisi tercatat di daftar sedang disiapkan", () => {
    const dicatat = new Set(daftarDisiapkan().flatMap((k) => k.alat.map((t) => t.id)));
    for (const t of ALL_TOOLS.filter((t) => !alatSiap(t))) expect(dicatat, t.id).toContain(t.id);
  });

  it("isi gedung mengikuti izin menu lama", () => {
    const lab = GEDUNG.find((g) => g.id === "lab")!;
    expect(isiGedung(lab, (k) => k !== "angkasa")).toHaveLength(0);
    const musala = GEDUNG.find((g) => g.id === "musala")!;
    expect(isiGedung(musala, semua).map((t) => t.id)).toContain("petualangan-umroh");
    expect(isiGedung(musala, (k) => k === "doa")).toHaveLength(0);
  });

  it("rute alat mengarah ke modul yang ada", () => {
    for (const r of Object.values(RUTE_ALAT)) expect(r).toMatch(/^\/(jelajah-|buah-buahan|roket|laut|bumi|umroh-virtual|resto|ular-tangga|koding\/)/);
  });
});
