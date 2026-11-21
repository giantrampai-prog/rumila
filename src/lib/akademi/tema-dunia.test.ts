import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { duniaPaket, pilihDunia, SEMUA_DUNIA, TEMA } from "./tema-dunia";

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
