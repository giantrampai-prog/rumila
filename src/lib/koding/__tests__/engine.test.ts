import { describe, expect, it } from 'vitest';
import { nextHint, run, solve, starsFor, THEME_ORDER } from '../engine';
import { buildLangkah } from '../gen-langkah';
import { LANGKAH } from '../langkah';

describe('Coding Agam · Langkah', () => {
  it('100 level, semuanya bisa diselesaikan, unik, dan solusi terpendeknya menang', () => {
    expect(LANGKAH).toHaveLength(100);
    expect(new Set(LANGKAH.map((l) => l.map.join('/'))).size).toBe(100);
    expect(new Set(LANGKAH.map((l) => l.id)).size).toBe(100);
    for (const l of LANGKAH) {
      const s = solve(l);
      expect(s, l.id).not.toBeNull();
      expect(run(l, s!).result, l.id).toBe('win');
      expect(s!.length, l.id).toBeLessThanOrEqual(24);
    }
  });

  it('langkah.ts sama dengan hasil pembuat level (tidak diedit manual)', () => {
    expect(buildLangkah()).toEqual(LANGKAH);
  });

  it('10 Level × 10 soal: satu tema per Level, rata-rata panjang solusi naik tiap Level', () => {
    for (const l of LANGKAH.slice(0, 10)) expect(l.blocks).toEqual(['maju']);
    for (let w = 0; w < 10; w++) expect(new Set(LANGKAH.slice(w * 10, w * 10 + 10).map((l) => l.theme))).toEqual(new Set([THEME_ORDER[w]]));
    const len = LANGKAH.map((l) => solve(l)!.length);
    const avg = [...Array(10)].map((_, w) => len.slice(w * 10, w * 10 + 10).reduce((a, b) => a + b, 0) / 10);
    for (let w = 1; w < 10; w++) expect(avg[w]).toBeGreaterThan(avg[w - 1]);
    // soal ke-10 tiap Level paling sulit di Level itu
    for (let w = 0; w < 10; w++) expect(len[w * 10 + 9]).toBe(Math.max(...len.slice(w * 10, w * 10 + 10)));
    // tidak ada lompatan mendadak antar level berurutan
    for (let i = 1; i < 100; i++) expect(len[i] - len[i - 1], `level ${i + 1}`).toBeLessThanOrEqual(3);
  });

  it('menabrak berhenti, program kurang = belum sampai', () => {
    const l = LANGKAH[0];
    expect(run(l, ['maju']).result).toBe('short');
    expect(run(l, ['maju', 'maju']).result).toBe('win');
    expect(run(LANGKAH[10], ['maju', 'maju', 'maju', 'maju', 'maju']).result).toBe('bump');
  });

  it('bantuan: tunjuk blok berikutnya atau blok yang salah', () => {
    const l = LANGKAH[40];
    const best = solve(l)!;
    expect(nextHint(l, [])).toEqual({ kind: 'next', cmd: best[0] });
    // mengikuti bantuan terus-menerus selalu sampai
    const prog: typeof best = [];
    for (let k = 0; k < 40; k++) {
      const h = nextHint(l, prog);
      if (h.kind !== 'next') break;
      prog.push(h.cmd);
    }
    expect(run(l, prog).result).toBe('win');
    expect(prog.length).toBe(best.length);
    // program menabrak → tunjuk blok yang menabrak
    const bump = [...Array(9)].map(() => 'maju' as const);
    const r = run(l, bump);
    if (r.result === 'bump') expect(nextHint(l, bump)).toEqual({ kind: 'wrong', i: r.steps.at(-1)!.i });
  });

  it('bintang: hemat = 3, lebih sedikit = 2, boros = 1', () => {
    const l = LANGKAH[0];
    const best = solve(l)!.length;
    expect(starsFor(l, best)).toBe(3);
    expect(starsFor(l, best + 2)).toBe(2);
    expect(starsFor(l, best + 5)).toBe(1);
  });
});
