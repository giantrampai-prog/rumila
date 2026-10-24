import { describe, expect, it } from 'vitest';
import * as T from 'three';
import { NavGrid } from '../nav';

/** apakah ruas a→b menyentuh persegi (disampel rapat) */
function crosses(a: T.Vector3, b: T.Vector3, r: { x0: number; x1: number; z0: number; z1: number }) {
  const n = Math.ceil(a.distanceTo(b) / 0.05) + 1;
  for (let k = 0; k <= n; k++) {
    const p = a.clone().lerp(b, k / n);
    if (p.x > r.x0 && p.x < r.x1 && p.z > r.z0 && p.z < r.z1) return true;
  }
  return false;
}

describe('NavGrid', () => {
  const table = { x0: -12.6, x1: -11.2, z0: -8.9, z1: -7.9 }; // meja di area makan
  const wall = { x0: -22.4, x1: -6.8, z0: -10.7, z1: -10.5 }; // garis dapur
  const nav = new NavGrid([table, wall]);

  it('jalur lurus bila tidak ada rintangan', () => {
    const p = nav.route(new T.Vector3(-9, 0, -4), new T.Vector3(-15, 0, -4));
    expect(p).not.toBeNull();
    expect(p!.length).toBeLessThanOrEqual(2);
    expect(p![p!.length - 1].x).toBeCloseTo(-15);
  });

  it('memutari meja, tidak menembusnya', () => {
    const from = new T.Vector3(-9, 0, -8.4),
      to = new T.Vector3(-15, 0, -8.4);
    const p = nav.route(from, to)!;
    expect(p).not.toBeNull();
    let prev = from;
    for (const q of p) {
      expect(crosses(prev, q, table)).toBe(false);
      prev = q;
    }
    expect(prev.distanceTo(to)).toBeLessThan(0.01);
  });

  it('tujuan di dalam rintangan (kursi) tetap tercapai lewat sel bebas terdekat', () => {
    const to = new T.Vector3(-11.9, 0, -8.4); // tengah meja
    const p = nav.route(new T.Vector3(-9, 0, -6.5), to)!;
    expect(p).not.toBeNull();
    expect(p[p.length - 1].distanceTo(to)).toBeLessThan(0.01);
    // titik sebelum terakhir berada di luar meja
    const q = p[p.length - 2];
    expect(q.x > table.x0 - 0.1 && q.x < table.x1 + 0.1 && q.z > table.z0 - 0.1 && q.z < table.z1 + 0.1).toBe(false);
  });

  it('titik di luar kisi → null (pemanggil pakai rute cadangan)', () => {
    expect(nav.route(new T.Vector3(-60, 0, 0), new T.Vector3(0, 0, 0))).toBeNull();
  });
});
