export type FlightCameraMode = 'auto' | 'cabin' | 'exterior';
export type FlightPov = Exclude<FlightCameraMode, 'auto'>;

/**
 * Automatic shots follow the flight phases: the window seat during taxi and the
 * safety briefing, outside for take-off, the window again while climbing through
 * cloud, alternating at cruise, and outside for the approach and landing.
 */
export const AUTO_FLIGHT_SHOTS: readonly { until: number; pov: FlightPov }[] = [
  { until: .13, pov: 'cabin' },
  { until: .32, pov: 'exterior' },
  { until: .5, pov: 'cabin' },
  { until: .66, pov: 'exterior' },
  { until: .84, pov: 'cabin' },
  { until: Infinity, pov: 'exterior' },
];

/** Shots follow active journey progress, so pause/reload cannot advance the edit. */
export function getFlightPov(progress: number, mode: FlightCameraMode = 'auto', reducedMotion = false): FlightPov {
  if (mode !== 'auto') return mode;
  if (reducedMotion) return 'exterior';
  const fraction = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  return AUTO_FLIGHT_SHOTS.find((shot) => fraction < shot.until)!.pov;
}

export function isFlightChapter(chapter?: string): boolean {
  return chapter === 'garuda_jed' || chapter === 'garuda_cgk';
}
