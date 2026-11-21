import { describe, expect, it } from "vitest";
import { formatIpk, hitungIpk, nomorInduk, tahunMasuk } from "../kartu-pelajar";
import type { HasilUjian } from "../ujian";

const h = (p: Partial<HasilUjian>): HasilUjian => ({ jenis: "kuis", level: "PAUD", ruang: "A", sessionId: "s", benar: 0, total: 10, nilai: 80, lulus: true, at: "2026-11-01T00:00:00Z", ...p });

describe("Kartu Pelajar", () => {
  it("nomor induk tetap untuk anggota yang sama dan berbeda antaranggota", () => {
    expect(nomorInduk("m1", 2026)).toBe(nomorInduk("m1", 2026));
    expect(nomorInduk("m1", 2026)).not.toBe(nomorInduk("m2", 2026));
    expect(nomorInduk("m1", 2026)).toMatch(/^26\.\d{4}\.\d{4}$/);
  });

  it("IPK = rata-rata nilai/25, penempatan tidak dihitung, ujian ulang pakai nilai terakhir", () => {
    const ipk = hitungIpk([
      h({ ruang: "A", nilai: 60, at: "2026-11-01T00:00:00Z" }),
      h({ ruang: "A", nilai: 100, at: "2026-11-02T00:00:00Z" }),
      h({ ruang: "B", nilai: 80 }),
      h({ jenis: "penempatan", ruang: "P", nilai: 10 }),
    ]);
    expect(ipk.nilai).toBe(3.6);
    expect(ipk.jumlah).toBe(2);
    expect(formatIpk(ipk.nilai)).toBe("3,60");
  });

  it("belum ada ujian → IPK kosong, tahun masuk = tahun ini", () => {
    expect(hitungIpk([]).nilai).toBeNull();
    expect(formatIpk(null)).toBe("–");
    expect(tahunMasuk([], new Date("2027-02-01"))).toBe(2027);
    expect(tahunMasuk([h({ at: "2026-03-01T00:00:00Z" })])).toBe(2026);
  });
});
