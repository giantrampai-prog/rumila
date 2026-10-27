import { TAWAF_RADIUS, TAWAF_START_ANGLE } from './realistic/kaaba-layout';

type CameraView = 'walk' | 'follow' | 'overview';
type Position = [number, number, number];
export interface TawafCameraState {
  stage: string;
  chapter?: string;
  visit?: string | null;
  running: boolean;
  paused?: boolean;
  reducedMotion?: boolean;
  view?: CameraView;
}
export const TAWAF_EYE_HEIGHT = 1.68;

export function isTawafScene(state: Pick<TawafCameraState, 'stage' | 'chapter' | 'visit'>): boolean {
  return state.stage === 'tawaf' && (!state.chapter || state.chapter === 'umroh') && !state.visit;
}

/** Keep the camera still for reduced motion; the pilgrim and lap counter can continue. */
export function getTawafView(state: TawafCameraState): CameraView {
  return isTawafScene(state) && state.reducedMotion ? 'overview' : state.view ?? 'walk';
}

export function isGuidedTawaf(state: TawafCameraState): boolean {
  return isTawafScene(state) && state.running && !state.paused && getTawafView(state) !== 'overview';
}

/** An unwrapped angle avoids a camera rotation discontinuity at each completed lap. */
export function getTawafRoutePose(progress: number): { position: Position; heading: number; angle: number } {
  const laps = Number.isFinite(progress) ? Math.max(0, Math.min(7, progress)) : 0;
  const angle = TAWAF_START_ANGLE - laps * Math.PI * 2;
  return { position: [Math.cos(angle) * TAWAF_RADIUS, 0, Math.sin(angle) * TAWAF_RADIUS], heading: Math.PI - angle, angle };
}

/** Heading follows the tangent counterclockwise, keeping the Ka'bah on the left. */
export function getTawafCameraFrame(progress: number, view: 'walk' | 'follow', lookYaw = 0, lookPitch = 0, aspect = 1.2): { position: Position; yaw: number; pitch: number; target: Position } {
  const { position: [x, , z], heading, angle } = getTawafRoutePose(progress);
  if (view === 'walk') {
    // Look toward the left-front so the Ka'bah remains visible as the body follows the tangent.
    const portraitWeight = Math.max(0, Math.min(1, (1.2 - aspect) / .7));
    const yaw = -angle + 1.3 + portraitWeight * .2 + lookYaw;
    const pitch = Math.max(-1.25, Math.min(1.3, .12 + lookPitch));
    return {
      position: [x, TAWAF_EYE_HEIGHT, z], yaw, pitch,
      target: [x - Math.sin(yaw) * Math.cos(pitch), TAWAF_EYE_HEIGHT + Math.sin(pitch), z - Math.cos(yaw) * Math.cos(pitch)],
    };
  }
  // Stand behind and outside the pilgrim's route to frame both the pilgrim and the Ka'bah.
  const position: Position = [x - Math.sin(heading) * 5.2 + Math.cos(angle) * 6.5, 2.9, z - Math.cos(heading) * 5.2 + Math.sin(angle) * 6.5];
  const target: Position = [x, 1.3, z];
  const pitch = Math.atan2(target[1] - position[1], Math.hypot(5.2, 6.5));
  return { position, target, yaw: -angle + Math.atan2(6.5, 5.2), pitch };
}
