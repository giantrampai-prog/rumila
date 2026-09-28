// One shared surface for terrain, props and shoreline water. World units are illustrative (~10 m).
export const EARTH_R = 1000;
export const groundY = (x: number, z: number) => -(x * x + z * z) / (2 * EARTH_R);
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
export function smooth(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
const hash = (x: number, y: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
function noise(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const u = smooth(0, 1, x - ix), v = smooth(0, 1, y - iy);
  const a = hash(ix, iy), b = hash(ix + 1, iy), c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
export function fbm(x: number, y: number, oct = 5) {
  let sum = 0, a = 0.5;
  for (let i = 0; i < oct; i++) { sum += a * noise(x, y); x *= 2.03; y *= 2.03; a *= 0.5; }
  return sum;
}
// Shared verbatim with the water shader to prevent foam drifting away from the beach.
export const COAST_GLSL = `float coast(float z){ return 14.5 + sin(z*0.35)*0.8 + sin(z*0.017)*9.0 + sin(z*0.006+1.0)*14.0 - 11.0*sin(1.0); }`;
export const coastX = (z: number) => 14.5 + Math.sin(z * 0.35) * 0.8 + Math.sin(z * 0.017) * 9 + Math.sin(z * 0.006 + 1) * 14 - 11 * Math.sin(1);
export function terrainH(x: number, z: number) {
  const d = Math.hypot(x, z), shore = x - coastX(z);
  if (shore >= 0) return -0.12 - Math.min(7, shore * 0.12);
  const warp = fbm(x * 0.017, z * 0.017, 3) * 12;
  const hills = smooth(24, 72, d) * (1 + 25 * Math.pow(fbm(x * 0.014 + 3.1, z * 0.014 - 1.7), 1.7))
    + smooth(110, 290, d) * 55 * Math.pow(fbm((x + warp) * 0.008 + 7, z * 0.008 + 2), 1.6)
    + smooth(50, 300, d) * (d * d / 2000) * 0.8;
  const bumps = smooth(18, 30, d) * (fbm(x * 0.15, z * 0.15, 3) - 0.5) * 0.6;
  const beach = 0.06 - Math.max(0, shore + 2) * 0.09;
  const k = smooth(-32, -3, shore);
  return ((hills * (1 - smooth(320, 510, d)) + bumps) * (1 - k) + beach * k) * smooth(6, 10, d);
}
export const worldY = (x: number, z: number) => terrainH(x, z) + groundY(x, z);
/** Preserve the pad, roads, tanks and service buildings when scattering vegetation. */
export function occupied(x: number, z: number, margin = 0) {
  return Math.hypot(x, z) < 10.5 + margin
    || (x > -24 - margin && x < -2 + margin && z > 1 - margin && z < 16 + margin)
    || (Math.abs(x + 10) < 1.3 + margin && z > 7)
    || (Math.abs(z - 9) < 1.3 + margin && x < 1 && x > -24)
    || (x > 2 - margin && x < 9 + margin && z < -8 + margin && z > -15 - margin);
}
