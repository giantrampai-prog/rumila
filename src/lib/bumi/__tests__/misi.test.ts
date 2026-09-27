import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { KARAKTER, LAPISAN, TEMUAN, TUR_BUMI, fmtDepth } from '../misi';

describe('Petualangan ke Dalam Bumi', () => {
  it('16 adegan, kedalaman bersambung dari permukaan sampai pusat Bumi (6.371 km)', () => {
    expect(TUR_BUMI).toHaveLength(16);
    for (let i = 1; i < 13; i++) expect(TUR_BUMI[i].depth[0]).toBe(TUR_BUMI[i - 1].depth[1]);
    expect(TUR_BUMI.find((s) => s.id === 'inti-dalam')!.depth[1]).toBe(6_371_000);
    expect(new Set(TUR_BUMI.map((s) => s.id)).size).toBe(16);
  });
  it('setiap karakter muncul di adegan yang ada & ikonnya tersedia', () => {
    expect(KARAKTER).toHaveLength(16);
    for (const k of KARAKTER) {
      expect(TUR_BUMI.some((s) => s.id === k.stop)).toBe(true);
      expect(existsSync(`public${k.img}`)).toBe(true);
    }
  });
  it('lapisan tersusun dari luar ke dalam, temuan fosil unik', () => {
    expect(LAPISAN.map((l) => l.id)).toEqual(['kerak', 'mantel-atas', 'mantel-bawah', 'inti-luar', 'inti-dalam']);
    expect(new Set(TEMUAN.map((t) => t.kind)).size).toBe(TEMUAN.length);
  });
  it('format kedalaman', () => {
    expect(fmtDepth(35)).toBe('35 m');
    expect(fmtDepth(6_371_000)).toBe('6.371 km');
  });
});
