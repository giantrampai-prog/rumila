import { describe, expect, it } from 'vitest';
import { solve, THEME_ORDER } from '../engine';
import { buildJurus, buildKalau, buildUlangi } from '../gen-prog';
import { JURUS } from '../jurus';
import { KALAU } from '../kalau';
import { countBlocks, progStars, runProg, S, type Program } from '../prog';
import { ULANGI } from '../ulangi';

const GAMES = { Ulangi: [ULANGI, buildUlangi], 'Kalau…': [KALAU, buildKalau], Jurus: [JURUS, buildJurus] } as const;

for (const [name, [LEVELS, build]] of Object.entries(GAMES)) {
  describe(`Coding Agam · ${name}`, () => {
    it('100 soal, 10 Level × 10, satu tema per Level, peta & id unik', () => {
      expect(LEVELS).toHaveLength(100);
      expect(new Set(LEVELS.map((l) => l.id)).size).toBe(100);
      expect(new Set(LEVELS.map((l) => l.map.join('/'))).size).toBe(100);
      for (let w = 0; w < 10; w++) expect(new Set(LEVELS.slice(w * 10, w * 10 + 10).map((l) => l.theme))).toEqual(new Set([THEME_ORDER[w]]));
    });

    it('data sama dengan hasil pembuat level (tidak diedit manual)', () => {
      expect(JSON.parse(JSON.stringify(build()))).toEqual(JSON.parse(JSON.stringify(LEVELS)));
    });

    it('solusi menang, sehemat "best", muat di jatah blok, dan program tanpa blok baru tidak muat', () => {
      for (const l of LEVELS) {
        expect(runProg(l, l.solution).result, l.id).toBe('win');
        expect(countBlocks(l.solution), l.id).toBe(l.best);
        expect(l.limit, l.id).toBeGreaterThanOrEqual(l.best);
        // jalan terpendek dengan maju/belok saja lebih panjang dari jatah → blok baru memang dibutuhkan
        expect(solve(l)!.length, l.id).toBeGreaterThan(l.limit);
      }
    });
  });
}

describe('mesin program', () => {
  const lv = ULANGI[0];
  it('ulangi, kalau, sampai bintang, jurus', () => {
    const n = solve(lv)!.length;
    expect(runProg(lv, { main: [S.loop(n, [S.m()])], jurus: [] }).result).toBe('win');
    expect(runProg(lv, { main: [S.loop(n - 1, [S.m()])], jurus: [] }).result).toBe('short');
    expect(runProg(lv, { main: [S.until([S.m()])], jurus: [] }).result).toBe('win');
    expect(runProg(lv, { main: [S.call(), S.call()], jurus: [S.loop(Math.ceil(n / 2), [S.m()])] }).result).toBe('win');
    // ulangi sampai bintang yang tidak bergerak → berhenti (tidak macet selamanya)
    expect(runProg(lv, { main: [S.until([S.if('depan', [S.m()])])], jurus: [] }).result).toBe('stuck');
    expect(runProg(lv, { main: [S.until([])], jurus: [] }).result).toBe('stuck');
  });
  it('kalau memilih cabang sesuai sensor', () => {
    const p: Program = { main: [S.if('depan', [S.c('kanan')], [S.m()])], jurus: [] };
    const r = runProg(lv, p);
    expect(r.steps[0].kind).toBe('check');
    expect(r.steps[1].kind).toBe(r.steps[0].ok ? 'turn' : 'move');
  });
  it('bintang', () => {
    expect(progStars(lv, lv.best, false)).toBe(3);
    expect(progStars(lv, lv.best + 2, false)).toBe(2);
    expect(progStars(lv, lv.best + 3, false)).toBe(1);
    expect(progStars(lv, lv.best, true)).toBe(2);
  });
});
