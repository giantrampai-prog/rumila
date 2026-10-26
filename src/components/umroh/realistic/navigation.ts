import type { Rect } from './types';

/** Swept steps prevent wall tunnelling and let the camera slide along a facade. */
export function moveWithinWorld(x: number, z: number, dx: number, dz: number, bounds: Rect, blockers: Rect[], radius = .3): { x: number; z: number } {
  if (![x, z, dx, dz, radius].every(Number.isFinite)) return { x, z };
  const valid = (px: number, pz: number) => !blockers.some((b) => px > b.minX - radius && px < b.maxX + radius && pz > b.minZ - radius && pz < b.maxZ + radius);
  const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dz)) / .15));
  for (let i = 0; i < Math.min(steps, 1000); i++) {
    const nextX = Math.max(bounds.minX + radius, Math.min(bounds.maxX - radius, x + dx / steps)); if (valid(nextX, z)) x = nextX;
    const nextZ = Math.max(bounds.minZ + radius, Math.min(bounds.maxZ - radius, z + dz / steps)); if (valid(x, nextZ)) z = nextZ;
  }
  return { x, z };
}
