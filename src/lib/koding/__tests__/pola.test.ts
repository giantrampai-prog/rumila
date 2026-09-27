import { describe, expect, it } from 'vitest';
import { THEME_ORDER } from '../engine';
import { firstProblem, keyOf, minPeriod, POLA, polaStars, same, type Fill } from '../pola';

describe('Coding Agam · Pola', () => {
  it('100 soal, 10 Level × 10, satu tema per Level, id unik', () => {
    expect(POLA).toHaveLength(100);
    expect(new Set(POLA.map((l) => l.id)).size).toBe(100);
    for (let w = 0; w < 10; w++) expect(new Set(POLA.slice(w * 10, w * 10 + 10).map((l) => l.theme))).toEqual(new Set([THEME_ORDER[w]]));
  });

  it('setiap soal bisa dijawab: jawaban ada di palet dan polanya tidak ambigu', () => {
    for (const l of POLA) {
      expect(l.blanks.length, l.id).toBeGreaterThan(0);
      expect(l.blanks).toContain(l.seq.length - 1);
      for (const i of l.blanks) expect(l.options.some((o) => same(o, l.seq[i])), l.id).toBe(true);
      expect(new Set(l.options.map(keyOf)).size, l.id).toBe(l.options.length);
      const hidden = new Set(l.blanks);
      if (l.focus === 'dua-pola') {
        const col = l.seq.map((t, i) => (hidden.has(i) || t.k !== 'bentuk' ? null : t.c));
        const shp = l.seq.map((t, i) => (hidden.has(i) || t.k !== 'bentuk' ? null : t.s));
        expect(minPeriod(col), l.id).toBe(l.period[0]);
        expect(minPeriod(shp), l.id).toBe(l.period[1]);
      } else expect(minPeriod(l.seq.map((t, i) => (hidden.has(i) ? null : keyOf(t)))), l.id).toBe(l.period[0]);
    }
  });

  it('makin tinggi makin sulit: rata-rata (panjang + kotak kosong + pilihan + jenis pola) naik tiap Level', () => {
    // bobot jenis pola: memperhatikan dua hal sekaligus lebih sulit daripada satu
    const concept = { warna: 0, bentuk: 0.5, bunyi: 1, 'warna-bentuk': 1.5, melodi: 1.5, 'dua-pola': 3 };
    const score = POLA.map((l) => l.seq.length / 2 + l.blanks.length * 2 + l.options.length + Math.max(...l.period) + concept[l.focus]);
    const avg = [...Array(10)].map((_, w) => score.slice(w * 10, w * 10 + 10).reduce((a, b) => a + b, 0) / 10);
    for (let w = 1; w < 10; w++) expect(avg[w], `Level ${w + 1}`).toBeGreaterThanOrEqual(avg[w - 1] - 1.5);
    expect(avg[9]).toBeGreaterThan(avg[0] * 1.8);
  });

  it('periksa isian & bintang', () => {
    const l = POLA[0];
    expect(firstProblem(l, {})).toEqual({ i: l.blanks[0], kind: 'empty' });
    const ok: Fill = Object.fromEntries(l.blanks.map((i) => [i, l.seq[i]]));
    expect(firstProblem(l, ok)).toBeNull();
    const wrong = l.options.find((o) => !same(o, l.seq[l.blanks[0]]))!;
    expect(firstProblem(l, { ...ok, [l.blanks[0]]: wrong })).toEqual({ i: l.blanks[0], kind: 'wrong' });
    expect([polaStars(0), polaStars(1), polaStars(4)]).toEqual([3, 2, 1]);
  });
});
