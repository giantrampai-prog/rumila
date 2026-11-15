import { describe, expect, it } from "vitest";
import { keadaanLab } from "../lab";
import { kompetensi } from "./helper";

const K = [kompetensi("SAINS.TKA.BAGIAN-TUMBUHAN.01"), kompetensi("SAINS.TKA.BAGIAN-TUMBUHAN.02")];
const dasar = { level: "TKA" as const, selesai: new Set<string>(), ujian: [], pernah: false, kompetensi: K };

describe("keadaanLab", () => {
  it("terkunci sampai modul syarat tuntas, dengan teks syarat", () => {
    const k = keadaanLab("edukasi-buah", dasar);
    expect(k.terbuka).toBe(false);
    expect(k.syarat).toBe("Sains · TK A · BAGIAN-TUMBUHAN");
    expect(keadaanLab("edukasi-buah", { ...dasar, selesai: new Set(["SAINS.TKA.BAGIAN-TUMBUHAN.01"]) }).terbuka).toBe(false);
    expect(keadaanLab("edukasi-buah", { ...dasar, selesai: new Set(K.map((c) => c.id)) }).terbuka).toBe(true);
  });
  it("kuis lulus, jenjang lebih tinggi, pernah dibuka, atau tanpa syarat → terbuka", () => {
    expect(keadaanLab("edukasi-buah", { ...dasar, ujian: [{ jenis: "kuis", level: "TKA", ruang: "BAGIAN-TUMBUHAN", sessionId: "s", benar: 8, total: 8, nilai: 100, lulus: true, at: "" }] }).terbuka).toBe(true);
    expect(keadaanLab("edukasi-buah", { ...dasar, level: "TKB" }).terbuka).toBe(true);
    expect(keadaanLab("edukasi-buah", { ...dasar, pernah: true }).terbuka).toBe(true);
    expect(keadaanLab("petualangan-umroh", dasar).terbuka).toBe(true);
  });
});
