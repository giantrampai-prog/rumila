import { describe, expect, it } from 'vitest';
import { BIOTA, TUR_LAUT, depthToY, yToDepth } from '../misi';

describe('Petualangan Bawah Laut', () => {
  it('16 adegan, kedalaman menurun sampai palung lalu kembali ke permukaan', () => {
    expect(TUR_LAUT).toHaveLength(16);
    for (let i = 1; i < TUR_LAUT.length - 1; i++) expect(TUR_LAUT[i].depth[0]).toBe(TUR_LAUT[i - 1].depth[1]);
    expect(TUR_LAUT.at(-1)!.depth[1]).toBe(0);
  });
  it('setiap biota tinggal di adegan yang ada & punya ikon', () => {
    expect(BIOTA).toHaveLength(16);
    for (const b of BIOTA) {
      expect(TUR_LAUT.some((s) => s.id === b.stop)).toBe(true);
      expect(b.img).toMatch(/^\/laut\/ikon\/[a-z-]+\.webp$/);
    }
  });
  it('konversi kedalaman ↔ ketinggian dunia saling balik', () => {
    for (const d of [0, 10, 200, 6500]) expect(yToDepth(depthToY(d))).toBeCloseTo(d, 3);
  });
});
