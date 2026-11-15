import { getFlightPhase, type FlightPhaseId } from './flight-profile';

export type FlightCameraMode = 'auto' | 'cabin' | 'exterior';
export type FlightPov = Exclude<FlightCameraMode, 'auto'>;

/**
 * Automatic shots follow the flight phases: the window seat during taxi and the safety
 * briefing, outside for take-off, the window while climbing through cloud, alternating
 * at cruise, and outside from the descent until the aircraft has stopped on the runway.
 */
const SHOTS: Record<FlightPhaseId, (local: number) => FlightPov> = {
  pushback: () => 'cabin', taxi: () => 'cabin', lineup: () => 'cabin',
  takeoff: () => 'exterior', rotate: () => 'exterior',
  climb: (t) => t < .45 ? 'exterior' : 'cabin',
  cruise: (t) => t < .3 ? 'cabin' : t < .65 ? 'exterior' : 'cabin',
  descent: (t) => t < .45 ? 'cabin' : 'exterior',
  approach: () => 'exterior', flare: () => 'exterior', touchdown: () => 'exterior', rollout: () => 'exterior', stopped: () => 'exterior',
};

/** Shots follow active journey progress, so pause/reload cannot advance the edit. */
export function getFlightPov(progress: number, mode: FlightCameraMode = 'auto', reducedMotion = false): FlightPov {
  if (mode !== 'auto') return mode;
  if (reducedMotion) return 'exterior';
  const fraction = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  const phase = getFlightPhase(fraction);
  return SHOTS[phase.id]((fraction - phase.start) / (phase.end - phase.start));
}

export function isFlightChapter(chapter?: string): boolean {
  return chapter === 'garuda_jed' || chapter === 'garuda_cgk';
}
