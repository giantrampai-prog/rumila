import { describe, expect, it } from 'vitest';
import { cellXY, classicBoard, makeBoard, playTurn, rollDie, shuffle, stepPath } from '../game';

describe('Ular Tangga', () => {
  it('pantul: dari 99 dapat 5 → 100, 99, 98, 97, 96', () => {
    expect(stepPath(99, 5)).toEqual([100, 99, 98, 97, 96]);
    expect(stepPath(95, 5)).toEqual([96, 97, 98, 99, 100]);
    expect(stepPath(0, 3)).toEqual([1, 2, 3]);
    expect(stepPath(97, 6)).toEqual([98, 99, 100, 99, 98, 97]);
  });

  it('papan acak adil: ujung unik, tanpa rantai, pindah baris, tidak di 1/100', () => {
    for (let t = 0; t < 200; t++) {
      const b = makeBoard();
      const ends = b.jumps.flatMap((j) => [j.from, j.to]);
      expect(new Set(ends).size).toBe(ends.length);
      expect(ends).not.toContain(1);
      expect(ends).not.toContain(100);
      for (const j of b.jumps) {
        expect(Math.floor((j.from - 1) / 10)).not.toBe(Math.floor((j.to - 1) / 10));
        expect(b.map[j.to]).toBeUndefined(); // tidak berantai
        if (j.kind === 'ladder') expect(j.to).toBeGreaterThan(j.from);
        else expect(j.to).toBeLessThan(j.from);
      }
      expect(b.jumps.filter((j) => j.kind === 'ladder').length).toBeGreaterThanOrEqual(6);
      expect(b.jumps.filter((j) => j.kind === 'snake').length).toBeGreaterThanOrEqual(6);
    }
  });

  it('papan berbeda-beda setiap permainan', () => {
    const keys = new Set(Array.from({ length: 30 }, () => JSON.stringify(makeBoard().jumps)));
    expect(keys.size).toBeGreaterThan(25);
  });

  it('dadu seragam 1…6 tanpa bias', () => {
    const n = 60000,
      c = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < n; i++) c[rollDie() - 1]++;
    for (const k of c) expect(Math.abs(k - n / 6)).toBeLessThan(n / 6 * 0.05);
  });

  it('giliran: ular setelah pantul, tangga, menang, angka 6 lempar lagi', () => {
    const b = classicBoard();
    const t1 = playTurn(b, 97, 4); // 98, 99, 100, 99 → mendarat 99? (99 bukan ujung)
    expect(t1.steps).toEqual([98, 99, 100, 99]);
    expect(t1.bounced).toBe(true);
    const t2 = playTurn(b, 94, 4); // 98 = kepala ular → 78
    expect(t2.final).toBe(78);
    expect(t2.jump?.kind).toBe('snake');
    const t3 = playTurn(b, 0, 4); // tangga 4 → 14
    expect(t3.final).toBe(14);
    expect(playTurn(b, 96, 4).won).toBe(true);
    expect(playTurn(b, 10, 6).again).toBe(true);
    expect(playTurn(b, 10, 6, false).again).toBe(false);
  });

  it('koordinat zig-zag', () => {
    expect(cellXY(1)).toEqual({ col: 0, row: 0 });
    expect(cellXY(10)).toEqual({ col: 9, row: 0 });
    expect(cellXY(11)).toEqual({ col: 9, row: 1 });
    expect(cellXY(100)).toEqual({ col: 0, row: 9 });
  });

  it('acak urutan tetap berisi semua pemain', () => {
    expect(shuffle([1, 2, 3, 4, 5, 6]).sort()).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
