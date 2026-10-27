import { describe, expect, it } from 'vitest';
import { PerspectiveCamera, Vector3 } from 'three';
import { HAJAR_CORNER, TAWAF_RADIUS } from './realistic/kaaba-layout';
import { getTawafCameraFrame, getTawafRoutePose, getTawafView, isGuidedTawaf, isTawafScene, TAWAF_EYE_HEIGHT, type TawafCameraState } from './tawaf-camera';

const active: TawafCameraState = { chapter: 'umroh', stage: 'tawaf', view: 'walk', running: true };

describe('tawaf camera route', () => {
  it('starts and finishes every lap on the Hajar Aswad ray', () => {
    for (let lap = 0; lap <= 7; lap++) {
      const { position: [x, y, z] } = getTawafRoutePose(lap);
      expect(Math.hypot(x, z)).toBeCloseTo(TAWAF_RADIUS);
      expect(x * HAJAR_CORNER.z - z * HAJAR_CORNER.x).toBeCloseTo(0);
      expect(x * HAJAR_CORNER.x + z * HAJAR_CORNER.z).toBeGreaterThan(0);
      expect(y).toBe(0);
    }
  });

  it('walks forward with the Ka’bah on the left throughout the circle', () => {
    for (const p of [0, .1, .25, .5, .75, 1.2, 4.4, 6.9]) {
      const pose = getTawafRoutePose(p), next = getTawafRoutePose(p + .0001);
      const forward = [Math.sin(pose.heading), Math.cos(pose.heading)];
      const left = [Math.cos(pose.heading), -Math.sin(pose.heading)];
      const movement = [next.position[0] - pose.position[0], next.position[2] - pose.position[2]];
      expect(movement[0] * forward[0] + movement[1] * forward[1]).toBeGreaterThan(0);
      expect(-pose.position[0] * left[0] - pose.position[2] * left[1]).toBeCloseTo(TAWAF_RADIUS);
      expect(-pose.position[0] * forward[0] - pose.position[2] * forward[1]).toBeCloseTo(0);
    }
  });

  it('moves the first-person eye with the pilgrim and keeps a dragged glance relative to the route', () => {
    for (const progress of [0, .25, .5, .75, 3.2, 7]) {
      const pose = getTawafRoutePose(progress);
      const frame = getTawafCameraFrame(progress, 'walk');
      const glanced = getTawafCameraFrame(progress, 'walk', .3, -.2);
      expect(frame.position).toEqual([pose.position[0], TAWAF_EYE_HEIGHT, pose.position[2]]);
      expect(glanced.position).toEqual(frame.position);
      expect(glanced.yaw - frame.yaw).toBeCloseTo(.3);
      expect(glanced.pitch - frame.pitch).toBeCloseTo(-.2);
    }
    expect(getTawafCameraFrame(.25, 'walk').yaw - getTawafCameraFrame(0, 'walk').yaw).toBeCloseTo(Math.PI / 2);
  });

  it('rotates the follow camera behind and outside the pilgrim while aiming at them', () => {
    for (const progress of [0, .25, .5, .75, 2.8]) {
      const { position: [x, , z], heading } = getTawafRoutePose(progress);
      const frame = getTawafCameraFrame(progress, 'follow');
      const dx = frame.position[0] - x, dz = frame.position[2] - z;
      expect(dx * Math.sin(heading) + dz * Math.cos(heading)).toBeCloseTo(-5.2);
      expect(Math.hypot(frame.position[0], frame.position[2])).toBeGreaterThan(TAWAF_RADIUS);
      expect(frame.target).toEqual([x, 1.3, z]);
      const distance = Math.hypot(x - frame.position[0], z - frame.position[2]);
      expect(-Math.sin(frame.yaw)).toBeCloseTo((x - frame.position[0]) / distance);
      expect(-Math.cos(frame.yaw)).toBeCloseTo((z - frame.position[2]) / distance);
    }
  });

  it('frames the Ka’bah near the centre-left on narrow portrait screens', () => {
    const camera = new PerspectiveCamera(64, .5, .065, 2600);
    for (const progress of [0, .25, .5, .75, 3.3]) {
      const frame = getTawafCameraFrame(progress, 'walk', 0, 0, camera.aspect);
      camera.position.set(...frame.position);
      camera.rotation.set(frame.pitch, frame.yaw, 0, 'YXZ');
      camera.updateMatrixWorld();
      const centre = new Vector3(0, 6.5, 0).project(camera);
      expect(centre.x).toBeGreaterThan(-.4);
      expect(centre.x).toBeLessThan(0);
      expect(Math.abs(centre.y)).toBeLessThan(1);
    }
  });

  it('does not flip or jump across lap boundaries, including restored later laps', () => {
    for (const view of ['walk', 'follow'] as const) {
      for (let lap = 1; lap < 7; lap++) {
        const before = getTawafCameraFrame(lap - .00001, view), after = getTawafCameraFrame(lap + .00001, view);
        expect(Math.hypot(...after.position.map((value, i) => value - before.position[i]))).toBeLessThan(.004);
        expect(after.yaw - before.yaw).toBeCloseTo(.00002 * Math.PI * 2);
        const restored = getTawafCameraFrame(lap + .3, view), first = getTawafCameraFrame(.3, view);
        restored.position.forEach((value, i) => expect(value).toBeCloseTo(first.position[i]));
      }
    }
  });

  it('bounds invalid saved progress and camera pitch', () => {
    for (const invalid of [-5, NaN, Infinity]) expect(getTawafRoutePose(invalid)).toEqual(getTawafRoutePose(0));
    expect(getTawafRoutePose(100)).toEqual(getTawafRoutePose(7));
    expect(getTawafCameraFrame(0, 'walk', 0, 10).pitch).toBe(1.3);
    expect(getTawafCameraFrame(0, 'walk', 0, -10).pitch).toBe(-1.25);
  });
});

describe('guided tawaf camera activation', () => {
  it('guides both first-person and follow views only during active tawaf', () => {
    expect(isGuidedTawaf(active)).toBe(true);
    expect(isGuidedTawaf({ ...active, view: 'follow' })).toBe(true);
    for (const state of [
      { ...active, running: false }, { ...active, paused: true }, { ...active, view: 'overview' as const },
      { ...active, stage: 'sai' }, { ...active, visit: 'nabawi' }, { ...active, chapter: 'garuda_jed' },
    ]) expect(isGuidedTawaf(state)).toBe(false);
    expect(isTawafScene({ stage: 'tawaf' })).toBe(true);
  });

  it('honours reduced motion with a stable overview instead of either moving POV', () => {
    for (const view of ['walk', 'follow', 'overview'] as const) {
      const state = { ...active, reducedMotion: true, view };
      expect(getTawafView(state)).toBe('overview');
      expect(isGuidedTawaf(state)).toBe(false);
    }
    expect(getTawafView({ ...active, stage: 'sai', reducedMotion: true })).toBe('walk');
    expect(getTawafView({ ...active, visit: 'nabawi', reducedMotion: true })).toBe('walk');
  });
});
