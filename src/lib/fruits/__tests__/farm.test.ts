import { describe, expect, it } from 'vitest';
import { FRUITS } from '../catalog';
import { PLAYABLE_MISSIONS, STAGE_SECONDS, advanceBed, bedStatus, missionMatches, plantBed, sectionOf, waterBed } from '../farm';

describe('permainan Kebun Buah', () => {
  it('tanaman tumbuh satu tahap per siraman dan berhenti menunggu disiram', () => {
    let b = plantBed('pisang');
    const t0 = 1_000_000;
    expect(bedStatus(b, t0).thirsty).toBe(true);
    expect(advanceBed(b, t0 + 999_999)).toBe(b); // tanpa siraman tidak tumbuh
    for (let s = 0; s < 4; s++) {
      const now = t0 + s * 100_000;
      b = waterBed(b, now);
      expect(bedStatus(b, now).growing).toBe(true);
      b = advanceBed(b, now + STAGE_SECONDS[s] * 1000);
      expect(b.stage).toBe(s + 1);
    }
    expect(bedStatus(b, t0 + 999_999).ripe).toBe(true);
  });

  it('setiap misi yang dipakai punya minimal dua buah yang cocok', () => {
    expect(PLAYABLE_MISSIONS.length).toBeGreaterThanOrEqual(10);
    for (const m of PLAYABLE_MISSIONS) expect(FRUITS.filter((f) => missionMatches(m, f)).length).toBeGreaterThanOrEqual(2);
  });

  it('semua buah punya penampang untuk dibelah', () => {
    for (const f of FRUITS) {
      const s = sectionOf(f);
      expect(s.flesh).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});
