import { describe, expect, it } from 'vitest';
import { buildJurus, buildKalau, buildUlangi } from '../gen-prog';
import { JURUS } from '../jurus';
import { KALAU } from '../kalau';
import { countBlocks, flatActs, progStars, runWorld, S, type Program } from '../prog';
import { ULANGI } from '../ulangi';
import { dojoWorld, layoutFor, paintWorld, runWorld2 } from '../worlds';

const GAMES = [
  ['Ulangi', ULANGI, buildUlangi],
  ['Kalau…', KALAU, buildKalau],
  ['Jurus', JURUS, buildJurus],
] as const;

for (const [name, LEVELS, build] of GAMES) {
  describe(`Coding Agam · ${name}`, () => {
    it('100 soal, 10 Level × 10, id unik, sama dengan hasil pembuat soal', () => {
      expect(LEVELS).toHaveLength(100);
      expect(new Set(LEVELS.map((l) => l.id)).size).toBe(100);
      LEVELS.forEach((l, i) => expect(l.world).toBe(Math.floor(i / 10)));
      expect(JSON.parse(JSON.stringify(build()))).toEqual(JSON.parse(JSON.stringify(LEVELS)));
    });
    it('solusi sehemat "best" dan muat di jatah blok', () => {
      for (const l of LEVELS) {
        expect(countBlocks(l.solution), l.id).toBe(l.best);
        expect(l.limit, l.id).toBeGreaterThanOrEqual(l.best);
      }
    });
  });
}

describe('Ulangi · kanvas', () => {
  it('solusi menggambar pola dengan tepat; tanpa ulangi tidak muat di jatah', () => {
    for (const l of ULANGI) {
      expect(runWorld(l.solution, paintWorld(l)).result, l.id).toBe('win');
      expect(flatActs(l.solution).length, l.id).toBeGreaterThan(l.limit);
    }
  });
  it('menggores di luar pola = salah', () => {
    const l = ULANGI[0];
    const wrong: Program = { main: [S.a('kanan'), S.a('maju')], jurus: [] };
    expect(runWorld(wrong, paintWorld(l)).result).toBe('bump');
  });
});

describe('Kalau… · lari', () => {
  it('solusi selalu sampai finis di 300 susunan acak; tanpa kalau/sampai tidak muat', () => {
    for (const l of KALAU) {
      for (let seed = 1; seed <= 300; seed++) expect(runWorld(l.solution, runWorld2(l, layoutFor(l, seed * 7919))).result, `${l.id} seed ${seed}`).toBe('win');
      expect(l.len, l.id).toBeGreaterThan(l.limit);
    }
  });
  it('susunan: jumlah & jarak rintangan sesuai soal, awal & finis kosong', () => {
    for (const l of KALAU)
      for (let seed = 1; seed <= 50; seed++) {
        const c = layoutFor(l, seed);
        const idx = c.map((v, i) => (v ? i : -1)).filter((i) => i >= 0);
        expect(idx.length, l.id).toBeLessThanOrEqual(l.count[1]);
        for (let i = 1; i < idx.length; i++) expect(idx[i] - idx[i - 1]).toBeGreaterThanOrEqual(3);
        expect(c[0] ?? c[1] ?? c[2] ?? c[l.len]).toBeNull();
        for (const v of c) if (v) expect(l.kinds).toContain(v);
      }
  });
  it('program tetap (tanpa kalau) gagal di susunan lain', () => {
    const l = KALAU[5];
    const res = new Set<string>();
    for (let seed = 1; seed <= 30; seed++) res.add(runWorld({ main: [S.until([S.a('lari')])], jurus: [] }, runWorld2(l, layoutFor(l, seed))).result);
    expect(res.has('bump')).toBe(true);
  });
});

describe('Jurus · dojo', () => {
  it('solusi meniru Sensei dengan tepat; tanpa jurus tidak muat', () => {
    for (const l of JURUS) {
      expect(runWorld(l.solution, dojoWorld(l)).result, l.id).toBe('win');
      expect(l.target.length, l.id).toBeGreaterThan(l.limit);
      expect(l.solution.jurus.length, l.id).toBeGreaterThan(0);
    }
  });
  it('gerakan salah berhenti di gerakan itu', () => {
    const l = JURUS[0];
    const wrongMove = l.palette.find((m) => m !== l.target[0] && m !== 'jurus')!;
    const r = runWorld({ main: [S.a(wrongMove)], jurus: [] }, dojoWorld(l));
    expect(r.result).toBe('bump');
  });
});

describe('mesin program', () => {
  it('ulangi sampai selesai yang tidak bergerak berhenti; bintang', () => {
    const l = KALAU[0];
    expect(runWorld({ main: [S.until([])], jurus: [] }, runWorld2(l, layoutFor(l, 1))).result).toBe('stuck');
    expect(runWorld({ main: [S.until([S.if('fly', [S.a('lari')])])], jurus: [] }, runWorld2(l, layoutFor(l, 1))).result).toBe('stuck');
    expect([progStars(4, 4, false), progStars(4, 6, false), progStars(4, 7, false), progStars(4, 4, true)]).toEqual([3, 2, 1, 2]);
  });
});
