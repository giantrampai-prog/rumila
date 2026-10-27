import { LIFTOFF, TOUCHDOWN } from './flight-profile';

/**
 * Moving map like an in-flight entertainment screen: Indian Ocean basin, Jakarta and
 * Jeddah, the route and an aircraft symbol. Coastlines are simplified outlines drawn
 * for learning, not navigation data. Shared by the HUD and the seat-back screens.
 */
type LonLat = [number, number];
const CGK: LonLat = [106.65, -6.13];
const JED: LonLat = [39.16, 21.68];
/** Great-circle-like bend over southern India and the Arabian Sea. */
const VIA: LonLat = [78, 12.5];
const TOTAL_KM = 7900;
const VIEW = { west: 33, east: 113, north: 31, south: -12 };

const LAND: LonLat[][] = [
  // Arabian Peninsula
  [[34.6, 28.1], [36.5, 25.8], [39.1, 21.5], [41, 18], [42.7, 14.8], [43.5, 12.7], [45.2, 13], [48.7, 14], [52.2, 15.6], [55.4, 17.3], [57.8, 19.4], [59.8, 22.5], [58.5, 23.7], [56.4, 26.3], [54.2, 24.2], [51.6, 24.5], [51.3, 26.2], [50, 26.6], [48.5, 28.7], [47.8, 30], [44, 31], [36, 31]],
  // North-east Africa and the Horn
  [[33, 31], [32.4, 29.9], [34.2, 27.2], [35.8, 23.9], [37.3, 21], [38.6, 17.9], [39.7, 15.1], [41.7, 13.3], [43.3, 11.9], [44.6, 10.4], [47.4, 11.2], [51.3, 11.9], [51, 10.4], [49.8, 7.9], [47.9, 4.4], [45.3, 1.9], [42.1, -1], [40, -3.5], [39.2, -6.5], [39.6, -10], [39.4, -12], [33, -12]],
  // Iran and Pakistan coast
  [[47.8, 31], [48.9, 30.1], [50.8, 29.2], [51.6, 27.8], [54.7, 26.5], [56.5, 27.1], [57.3, 25.7], [61.6, 25.2], [64.5, 25.2], [66.7, 25.4], [67.4, 24], [68.8, 23.8], [70.5, 31]],
  // India
  [[68.8, 23.8], [69.1, 22.4], [70.4, 20.9], [72.6, 21.1], [72.9, 18.9], [73.4, 16], [74.6, 13.2], [75.8, 10.8], [76.6, 8.9], [77.5, 8.1], [78.2, 9], [79.3, 10.3], [79.9, 12], [80.2, 13.8], [80.1, 15.6], [81.3, 16.4], [82.4, 17], [84.1, 18.3], [85.9, 19.8], [87.1, 21.5], [88.8, 21.9], [90.6, 22.4], [92.3, 20.7], [92.4, 24], [89, 31], [70.5, 31]],
  // Sri Lanka
  [[79.9, 9.8], [80.8, 9.2], [81.8, 7.5], [81.7, 6.3], [80.6, 5.9], [79.9, 6.9], [79.8, 8.6]],
  // Myanmar, Thailand and the Malay Peninsula
  [[92.3, 20.7], [93.7, 19.4], [94.3, 16.5], [96.6, 16.5], [97.6, 15.3], [98.6, 12.3], [98.3, 9.1], [99, 7.5], [100.3, 5.6], [101.3, 2.9], [103.5, 1.3], [104.3, 1.5], [103.4, 4.2], [102.2, 6.2], [101, 6.9], [100.3, 8.4], [99.2, 9.3], [99.8, 12.6], [100.9, 13.4], [102.5, 12.2], [104.6, 10.4], [106.6, 9.5], [108.8, 11.3], [109.3, 13.6], [108.8, 15.4], [107.1, 17.1], [106.5, 20.2], [108.1, 21.5], [109.8, 21.5], [113, 22.5], [113, 31], [89, 31]],
  // Sumatra
  [[95.3, 5.6], [97.5, 5.2], [98.7, 3.8], [100.4, 2.2], [102.3, 1], [103.8, -1], [105.9, -3], [105.8, -5.8], [104.6, -5.9], [102.3, -4], [100.9, -2.2], [99.3, 0], [98.6, 1.6], [97.1, 2.9], [96, 4.2]],
  // Java
  [[105.2, -6.8], [106, -5.9], [107.6, -6.2], [108.6, -6.7], [110.4, -6.9], [112.6, -6.9], [113, -7.6], [113, -8.5], [110.4, -8.1], [108.6, -7.8], [106.5, -7.4]],
  // Borneo (west coast)
  [[108.9, -2], [109.6, 0], [109.7, 1.7], [111.1, 1.6], [113, 3.1], [113, -3.4], [111.7, -3.1], [110.2, -2.9]],
];

function project(lonLat: LonLat, w: number, h: number): [number, number] {
  return [(lonLat[0] - VIEW.west) / (VIEW.east - VIEW.west) * w, (VIEW.north - lonLat[1]) / (VIEW.north - VIEW.south) * h];
}
function bezier(a: LonLat, c: LonLat, b: LonLat, t: number): LonLat {
  const u = 1 - t;
  return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]];
}

/** Share of the route flown, from lift-off (0) to touchdown (1). */
export function routeFraction(progress: number): number {
  const p = Number.isFinite(progress) ? progress : 0;
  return Math.max(0, Math.min(1, (p - LIFTOFF) / (TOUCHDOWN - LIFTOFF)));
}

export interface FlightMapInfo { remainingKm: number; remainingMinutes: number; from: string; to: string }
export function flightMapInfo(progress: number, toJeddah: boolean): FlightMapInfo {
  const f = routeFraction(progress);
  return { remainingKm: Math.round(TOTAL_KM * (1 - f) / 10) * 10, remainingMinutes: Math.round(540 * (1 - f)), from: toJeddah ? 'Jakarta' : 'Jeddah', to: toJeddah ? 'Jeddah' : 'Jakarta' };
}

/** `reveal` (0–1) draws the planned route progressively, for the take-off animation. */
export function drawFlightMap(ctx: CanvasRenderingContext2D, w: number, h: number, progress: number, toJeddah: boolean, options: { footer?: boolean; reveal?: number } = {}): void {
  const scale = w / 640;
  const sea = ctx.createLinearGradient(0, 0, 0, h);
  sea.addColorStop(0, '#0b3a5c'); sea.addColorStop(1, '#0a2a45');
  ctx.fillStyle = sea; ctx.fillRect(0, 0, w, h);
  // Faint graticule.
  ctx.strokeStyle = 'rgba(160,205,235,.12)'; ctx.lineWidth = 1;
  for (let lon = 40; lon <= 110; lon += 10) { const [x] = project([lon, 0], w, h); ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let lat = -10; lat <= 30; lat += 10) { const [, y] = project([0, lat], w, h); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  ctx.fillStyle = '#b9a77e'; ctx.strokeStyle = '#d8c9a2'; ctx.lineWidth = 1.2 * scale;
  for (const shape of LAND) {
    ctx.beginPath();
    shape.forEach((point, i) => { const [x, y] = project(point, w, h); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); });
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  ctx.fillStyle = 'rgba(200,225,240,.55)'; ctx.font = `italic ${Math.round(15 * scale)}px Arial`; ctx.textAlign = 'center';
  ctx.fillText('Samudra Hindia', ...project([82, -4], w, h));
  ctx.fillText('Laut Arab', ...project([63, 14], w, h));
  const from = toJeddah ? CGK : JED, to = toJeddah ? JED : CGK;
  const f = routeFraction(progress);
  // Planned route dashed, flown part solid.
  ctx.lineCap = 'round';
  ctx.setLineDash([6 * scale, 6 * scale]); ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 2 * scale;
  const reveal = Math.max(0, Math.min(1, options.reveal ?? 1));
  ctx.beginPath(); for (let i = 0; i <= 60; i++) { const [x, y] = project(bezier(from, VIA, to, reveal * i / 60), w, h); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); } ctx.stroke();
  if (reveal < 1) { const [x, y] = project(bezier(from, VIA, to, reveal), w, h); ctx.fillStyle = '#f2c230'; ctx.beginPath(); ctx.arc(x, y, 4 * scale, 0, Math.PI * 2); ctx.fill(); }
  ctx.setLineDash([]); ctx.strokeStyle = '#f2c230'; ctx.lineWidth = 3.4 * scale;
  ctx.beginPath(); for (let i = 0; i <= 60; i++) { const [x, y] = project(bezier(from, VIA, to, f * i / 60), w, h); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); } ctx.stroke();
  for (const [point, label] of [[CGK, 'Jakarta (CGK)'], [JED, 'Jeddah (JED)']] as const) {
    const [x, y] = project(point, w, h);
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(x, y, 5 * scale, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#0b3a5c'; ctx.lineWidth = 2 * scale; ctx.stroke();
    ctx.font = `bold ${Math.round(15 * scale)}px Arial`; ctx.textAlign = point === CGK ? 'right' : 'left';
    ctx.fillStyle = '#ffffff'; ctx.fillText(label, x + (point === CGK ? -9 : 9) * scale, y - 8 * scale);
  }
  // Aircraft symbol pointing along the route.
  const here = project(bezier(from, VIA, to, f), w, h), ahead = project(bezier(from, VIA, to, Math.min(1, f + .01)), w, h), behind = project(bezier(from, VIA, to, Math.max(0, f - .01)), w, h);
  const angle = Math.atan2(ahead[1] - behind[1], ahead[0] - behind[0]);
  ctx.save(); ctx.translate(here[0], here[1]); ctx.rotate(angle); ctx.scale(scale, scale);
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#0b3a5c'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(15, 0); ctx.lineTo(4, 2.2); ctx.lineTo(-3, 12); ctx.lineTo(-6.5, 12); ctx.lineTo(-2, 2.4); ctx.lineTo(-10, 2.2); ctx.lineTo(-13, 6); ctx.lineTo(-15, 6);
  ctx.lineTo(-13, 0); ctx.lineTo(-15, -6); ctx.lineTo(-13, -6); ctx.lineTo(-10, -2.2); ctx.lineTo(-2, -2.4); ctx.lineTo(-6.5, -12); ctx.lineTo(-3, -12); ctx.lineTo(4, -2.2);
  ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
  if (options.footer !== false) {
    const info = flightMapInfo(progress, toJeddah);
    ctx.fillStyle = 'rgba(6,24,40,.82)'; ctx.fillRect(0, h - 34 * scale, w, 34 * scale);
    ctx.fillStyle = '#ffffff'; ctx.font = `bold ${Math.round(14 * scale)}px Arial`; ctx.textAlign = 'left';
    ctx.fillText(`${info.from} → ${info.to}`, 12 * scale, h - 12 * scale);
    ctx.textAlign = 'right'; ctx.fillStyle = '#cfe3f0'; ctx.font = `${Math.round(13 * scale)}px Arial`;
    ctx.fillText(`Sisa ${info.remainingKm.toLocaleString('id-ID')} km · ${Math.floor(info.remainingMinutes / 60)}j ${String(info.remainingMinutes % 60).padStart(2, '0')}m (cerita)`, w - 12 * scale, h - 12 * scale);
  }
}
