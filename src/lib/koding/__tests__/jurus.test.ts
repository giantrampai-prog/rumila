import { describe, expect, it } from 'vitest';
import { JURUS_SOAL, jurusStars } from '../jurus-levels';

describe('Coding Agam · Jurus (versi anak)', () => {
  it('100 soal, id unik, 10 Level × 10, tahap tiru → kartu → rekam', () => {
    expect(JURUS_SOAL).toHaveLength(100);
    expect(new Set(JURUS_SOAL.map((s) => s.id)).size).toBe(100);
    JURUS_SOAL.forEach((s, i) => expect(s.world).toBe(Math.floor(i / 10)));
    expect(new Set(JURUS_SOAL.slice(0, 30).map((s) => s.mode))).toEqual(new Set(['tiru']));
    expect(new Set(JURUS_SOAL.slice(30, 50).map((s) => s.mode))).toEqual(new Set(['kartu']));
    expect(new Set(JURUS_SOAL.slice(50).map((s) => s.mode))).toEqual(new Set(['rekam']));
  });
  it('rangkaian cocok dengan kartu & tanda kurung; hanya gerakan yang ada tombolnya; tidak terlalu panjang', () => {
    for (const s of JURUS_SOAL) {
      for (const m of s.target) expect(s.moves, s.id).toContain(m);
      expect(s.target.length, s.id).toBeLessThanOrEqual(18);
      for (const [a, len, c] of s.groups) expect(s.target.slice(a, a + len), s.id).toEqual(s.cards[c].moves);
      // memakai kartu memang menghemat ketukan
      if (s.cards.length) expect(s.best, s.id).toBeLessThan(s.target.length);
      else expect(s.best).toBe(s.target.length);
    }
  });
  it('awal mudah: 2 gerakan & rangkaian pendek', () => {
    expect(JURUS_SOAL[0].moves).toHaveLength(2);
    expect(JURUS_SOAL[0].target.length).toBeLessThanOrEqual(2);
  });
  it('bintang', () => {
    const s = JURUS_SOAL[40];
    expect(jurusStars(s, 0, s.best)).toBe(3);
    expect(jurusStars(s, 1, s.best)).toBe(2);
    expect(jurusStars(s, 0, s.best + 2)).toBe(2);
    expect(jurusStars(s, 5, s.best)).toBe(1);
  });
});
