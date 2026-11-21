import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { bentukDariTeks, duniaDariWorld, duniaPaket, pilihDunia, SEMUA_DUNIA, TEMA } from "./tema-dunia";

describe("pilihDunia", () => {
  it("memilih dari kata kunci di id dan judul", () => {
    expect(pilihDunia({ id: "sains-lapisan-laut", teks: ["Rumah di Lapisan Laut"] })).toBe("laut");
    expect(pilihDunia({ id: "kasir-kembalian-toko-mainan", teks: ["Kasir Toko Mainan"] })).toBe("pasar");
    expect(pilihDunia({ id: "sains-urutkan-matahari-bumi-bulan" })).toBe("angkasa");
  });

  it("mencocokkan kata utuh, bukan potongan kata", () => {
    // "kotak" tidak boleh terbaca sebagai "kota"
    expect(pilihDunia({ id: "sisa-kelereng-kotak", competencyIds: ["MAT.SD1.X.01"] })).not.toBe("kota");
    // "bulan" (nama bulan) tidak membawa ke angkasa
    expect(pilihDunia({ id: "sd1-mat-urutan-bulan", competencyIds: ["MAT.SD1.X.01"] })).not.toBe("angkasa");
  });

  it("tanpa kata kunci jatuh ke cadangan mapel secara stabil", () => {
    const a = pilihDunia({ id: "zzz-qqq", competencyIds: ["CODING.SD3.A.01"] });
    expect(["kota", "angkasa"]).toContain(a);
    expect(pilihDunia({ id: "zzz-qqq", competencyIds: ["CODING.SD3.A.01"] })).toBe(a);
  });

  it("dunia tulisan penulis (world) menang atas tebakan kata kunci", () => {
    expect(duniaDariWorld("kolam")).toBe("sungai");
    expect(duniaDariWorld("stasiun")).toBe("kota");
    expect(duniaDariWorld("toko-kue")).toBe("pasar");
    expect(duniaDariWorld("kebun-pasar", ["Rak Hasil Dua Angka"])).toBe("pasar");
    expect(duniaDariWorld("kebun-pasar", ["Rawat Pot di Kebun"])).toBe("kebun");
    // "Jalan Katak Loncat" dulu jatuh ke kota karena kata "jalan"
    expect(duniaPaket({ id: "x", world: "kolam", instructionKey: "i", locale: { id: { judul: "Jalan Katak Loncat 10", i: "" } } })).toBe("sungai");
  });

  it("wadah mengikuti benda yang disebut teks", () => {
    expect(bentukDariTeks("Rak Hasil Dua Angka")).toBe("rak");
    expect(bentukDariTeks("Kotak Mainan Warna")).toBe("kotak-mainan");
    expect(bentukDariTeks("Ember Kerang")).toBe("ember");
    expect(bentukDariTeks("Genap atau Ganjil?")).toBeNull();
  });

  it("setiap dunia punya tema lengkap", () => {
    for (const d of SEMUA_DUNIA) expect(TEMA[d].id).toBe(d);
  });

  it("semua paket mendapat dunia, dan tidak ada satu dunia yang mendominasi", () => {
    const root = join(process.cwd(), "content/paket");
    const hit: Record<string, number> = {};
    let total = 0;
    for (const m of readdirSync(root)) {
      for (const f of readdirSync(join(root, m))) {
        const p = JSON.parse(readFileSync(join(root, m, f), "utf8"));
        const d = duniaPaket(p);
        expect(SEMUA_DUNIA).toContain(d);
        hit[d] = (hit[d] ?? 0) + 1;
        total++;
      }
    }
    expect(Object.keys(hit).length).toBeGreaterThanOrEqual(8);
    expect(Math.max(...Object.values(hit)) / total).toBeLessThan(0.3);
  });
});
