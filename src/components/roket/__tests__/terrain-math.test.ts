import { describe, expect, it } from 'vitest';
import { coastX, groundY, occupied, terrainH, worldY } from '../terrain-math';

describe('launch site surface', () => {
  it('keeps a continuous waterline along the entire curved coast', () => {
    for (let z=-250;z<=250;z+=5) {
      const x=coastX(z);
      expect(terrainH(x,z)).toBeCloseTo(-.12,6);
      expect(Math.abs(terrainH(x-.001,z)-terrainH(x+.001,z))).toBeLessThan(.001);
      expect(worldY(x,z)-groundY(x,z)).toBeCloseTo(-.12,6);
    }
  });
  it('leaves the rocket and tower foundations level relative to Earth curvature', () => {
    for (const [x,z] of [[0,0],[2.2,0],[-3,2],[0,4]]) expect(terrainH(x,z)).toBeCloseTo(0,5);
  });
  it('keeps all scattered vegetation out of roads and equipment', () => {
    for(const [x,z] of [[0,0],[7,-13],[5.6,-11],[-18,5],[-7,12],[-10,24],[-20,9]]) expect(occupied(x,z,1)).toBe(true);
    expect(occupied(-30,-30,1)).toBe(false);
  });
  it('keeps seabed below the moving water away from the swash', () => {
    for(let z=-200;z<=200;z+=10)for(const d of [1,5,30]) expect(terrainH(coastX(z)+d,z)).toBeLessThan(-.12-.07);
  });
});
