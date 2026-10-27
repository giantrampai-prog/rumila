/** Local model axes: +Z is the door/east face, +X the Hijr/north face.
 * A schematic reconstruction, not a surveyed geographic coordinate system. */
export const KAABA = { width: 11.68, depth: 10.18, height: 13.1 } as const;
export const HAJAR_CORNER = { x: -KAABA.width / 2, z: KAABA.depth / 2 } as const;
export const TAWAF_START_ANGLE = Math.atan2(HAJAR_CORNER.z, HAJAR_CORNER.x);
export const TAWAF_RADIUS = 22;
export const MAQAM_POSITION = { x: -1.8, z: KAABA.depth / 2 + 10.5 } as const;
export const GREEN_MARKER_RADIUS = 80 / Math.max(Math.abs(Math.cos(TAWAF_START_ANGLE)), Math.abs(Math.sin(TAWAF_START_ANGLE)));
