import { describe, expect, it } from 'vitest';
import { run, solve, starsFor } from '../engine';
import { LANGKAH } from '../langkah';

describe('Koding Robi · Langkah', () => {
  it('setiap level bisa diselesaikan dan solusi terpendeknya menang', () => {
    for (const l of LANGKAH) {
      const s = solve(l);
      expect(s, l.id).not.toBeNull();
      expect(run(l, s!).result, l.id).toBe('win');
      // tingkat kesulitan wajar untuk anak
      expect(s!.length, l.id).toBeLessThanOrEqual(24);
    }
  });

  it('menabrak batu/air/tepi berhenti, program kurang = belum sampai', () => {
    const l = LANGKAH[3]; // batu tepat di depan
    expect(run(l, ['maju']).result).toBe('bump');
    expect(run(LANGKAH[0], ['maju']).result).toBe('short');
    expect(run(LANGKAH[5], ['kiri', 'maju']).result).toBe('bump'); // air
  });

  it('bintang: hemat = 3, lebih sedikit = 2, boros = 1', () => {
    const l = LANGKAH[0];
    const best = solve(l)!.length;
    expect(starsFor(l, best)).toBe(3);
    expect(starsFor(l, best + 2)).toBe(2);
    expect(starsFor(l, best + 5)).toBe(1);
  });

  it('level makin lama makin panjang (kasar)', () => {
    const lens = LANGKAH.map((l) => solve(l)!.length);
    expect(lens[0]).toBeLessThan(lens[14]);
    console.log('panjang solusi:', lens.join(' '));
  });
});
