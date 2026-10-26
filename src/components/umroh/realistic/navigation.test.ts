import { describe, expect, it } from 'vitest';
import { moveWithinWorld } from './navigation';

const bounds = { minX: -10, maxX: 10, minZ: -10, maxZ: 10 };
const wall = { minX: 0, maxX: .2, minZ: -5, maxZ: 5 };

describe('human-scale walking boundaries', () => {
  it('stops before a wall even when a movement step would pass through it', () => {
    const moved = moveWithinWorld(-2, 0, 8, 0, bounds, [wall]);
    expect(moved.x).toBeLessThanOrEqual(-.3);
    expect(moved.x).toBeGreaterThan(-.5);
  });
  it('slides along the wall while preserving a safe body radius', () => {
    const moved = moveWithinWorld(-.4, -2, 2, 3, bounds, [wall]);
    expect(moved.x).toBeLessThanOrEqual(-.3);
    expect(moved.z).toBeCloseTo(1);
  });
  it('keeps the camera on the floor at the edges of the courtyard', () => {
    const moved = moveWithinWorld(9, 9, 2, 2, bounds, []);
    expect(moved).toEqual({ x: 9.7, z: 9.7 });
  });
  it('ignores invalid movement and allows a clear path', () => {
    expect(moveWithinWorld(-2, -6, NaN, 1, bounds, [wall])).toEqual({ x: -2, z: -6 });
    const moved = moveWithinWorld(-2, -6, 4, 0, bounds, [wall]);
    expect(moved.x).toBeCloseTo(2);
    expect(moved.z).toBe(-6);
  });
});
