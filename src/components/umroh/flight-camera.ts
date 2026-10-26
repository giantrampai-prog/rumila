export type FlightCameraMode = 'auto' | 'cabin' | 'exterior';
export type FlightPov = Exclude<FlightCameraMode, 'auto'>;

/** Four shots follow active journey progress, so pause/reload cannot advance the edit. */
export function getFlightPov(progress: number, mode: FlightCameraMode = 'auto', reducedMotion = false): FlightPov {
  if (mode !== 'auto') return mode;
  if (reducedMotion) return 'exterior';
  const fraction = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  const shot = Math.min(3, Math.floor(fraction * 4));
  return shot % 2 === 0 ? 'exterior' : 'cabin';
}

export function isFlightChapter(chapter?: string): boolean {
  return chapter === 'garuda_jed' || chapter === 'garuda_cgk';
}
