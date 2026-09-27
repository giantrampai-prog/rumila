import { describe, expect, it } from 'vitest';
import { FRUITS } from '../catalog';
import { GARDEN, buildPlots, plantKind } from '../garden';

describe('tata letak Kebun Buah', () => {
  const plots = buildPlots();

  it('menanam semua buah tepat satu kali', () => {
    expect(plots.map((p) => p.fruit.id).sort()).toEqual(FRUITS.map((f) => f.id).sort());
  });

  it('semua tanaman di dalam pagar, di luar alun-alun, dan tidak di jalan utama', () => {
    for (const p of plots) {
      expect(Math.abs(p.x)).toBeLessThan(GARDEN.half - 3);
      expect(Math.abs(p.z)).toBeLessThan(GARDEN.half - 3);
      expect(Math.hypot(p.x, p.z)).toBeGreaterThan(GARDEN.plaza);
      expect(Math.min(Math.abs(p.x), Math.abs(p.z))).toBeGreaterThan(GARDEN.path + 2);
    }
  });

  it('tanaman tidak saling bertumpuk', () => {
    for (let i = 0; i < plots.length; i++)
      for (let j = i + 1; j < plots.length; j++) expect(Math.hypot(plots[i].x - plots[j].x, plots[i].z - plots[j].z)).toBeGreaterThanOrEqual(GARDEN.step - 0.01);
  });

  it('bentuk tanaman sesuai buahnya', () => {
    const kind = (id: string) => plantKind(FRUITS.find((f) => f.id === id)!);
    expect(kind('kelapa')).toBe('palm');
    expect(kind('semangka')).toBe('vine');
    expect(kind('anggur')).toBe('trellis');
    expect(kind('pisang')).toBe('banana');
    expect(kind('apel')).toBe('tree');
  });
});
