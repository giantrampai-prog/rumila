import * as T from 'three';
import { describe, expect, it, vi } from 'vitest';
import { UmrohScene, type UmrohSceneState } from './scene';
import { getTawafCameraFrame } from './tawaf-camera';

const initial: UmrohSceneState = { stage: 'tawaf', chapter: 'umroh', route: 'madinah', pilgrim: 'putra', progress: 0, running: false, view: 'walk', flightCamera: 'auto', timeOfDay: 'day', visit: null };
type Harness = Pick<UmrohScene, 'update' | 'setMovement' | 'resetCamera'> & {
  updateCamera(delta: number): void;
  camera: T.PerspectiveCamera;
  state: UmrohSceneState;
  pressed: Set<string>;
  orbit: { enabled: boolean; target: T.Vector3; update: ReturnType<typeof vi.fn> };
};

/** Exercise scene state and camera movement with real Three cameras; omit only the GPU/DOM constructor. */
function sceneHarness(): Harness {
  return Object.assign(Object.create(UmrohScene.prototype), {
    disposed: false, contextLost: false, reducedMotion: false, compact: false,
    state: { ...initial }, worldKey: 'haram', lastTime: 0, crowdTime: 0,
    world: { spawn: [24, 1.68, 30], lookAt: [0, 4, 0], overview: [60, 45, 70], bounds: { minX: -100, maxX: 100, minZ: -100, maxZ: 100 }, blockers: [] },
    camera: new T.PerspectiveCamera(64, 1.2), avatar: new T.Vector3(), tmp: new T.Vector3(), lastFollow: new T.Vector3(),
    orbit: { target: new T.Vector3(), update: vi.fn(), enabled: false, enableDamping: true },
    renderer: { domElement: { setAttribute: vi.fn() }, render: vi.fn() },
    guide: { group: new T.Group(), pose: vi.fn(), setAttire: vi.fn(), update: vi.fn() },
    forward: 0, right: 0, pressed: new Set<string>(), pointer: null, yaw: 0, pitch: 0, tawafLookYaw: 0, tawafLookPitch: 0,
    // These are instance-bound callbacks in the browser constructor.
    pauseInput() { this.pressed.clear(); this.forward = this.right = 0; this.pointer = null; },
  }) as Harness;
}

describe('scene guided tawaf integration', () => {
  it('moves and rotates the default walking POV as progress advances', () => {
    const scene = sceneHarness();
    scene.update({ ...initial, running: true });
    const startPosition = scene.camera.position.clone(), startRotation = scene.camera.quaternion.clone();
    scene.update({ ...initial, progress: .25, running: true });
    expect(scene.camera.position.distanceTo(startPosition)).toBeGreaterThan(20);
    expect(scene.camera.quaternion.angleTo(startRotation)).toBeCloseTo(Math.PI / 2);
    expect(scene.camera.position.toArray()).toEqual(getTawafCameraFrame(.25, 'walk').position);
  });

  it('keeps follow framing behind the pilgrim through the turn, without manual orbit interference', () => {
    const scene = sceneHarness();
    scene.update({ ...initial, view: 'follow', progress: .25, running: true });
    const expected = getTawafCameraFrame(.25, 'follow');
    expect(scene.camera.position.toArray()).toEqual(expected.position);
    expect(scene.orbit.target.toArray()).toEqual(expected.target);
    expect(scene.orbit.enabled).toBe(false);
    const position = scene.camera.position.clone();
    scene.updateCamera(.03);
    expect(scene.camera.position.equals(position)).toBe(true);
  });

  it('suppresses walking input only during guidance, holds on pause, and resumes at saved progress', () => {
    const scene = sceneHarness();
    scene.update({ ...initial, progress: 2.4, running: true });
    const guided = scene.camera.position.clone();
    scene.setMovement(1, 1); scene.pressed.add('KeyW'); scene.updateCamera(.03); scene.updateCamera(.03);
    expect(scene.camera.position.equals(guided)).toBe(true);
    scene.update({ ...initial, progress: 2.4, running: false });
    scene.updateCamera(.03);
    expect(scene.camera.position.equals(guided)).toBe(true);
    scene.setMovement(1, 0); scene.updateCamera(.03);
    expect(scene.camera.position.distanceTo(guided)).toBeGreaterThan(0);
    scene.update({ ...initial, progress: 2.4, running: true });
    expect(scene.camera.position.equals(guided)).toBe(true);
    expect(scene.state.progress).toBe(2.4);
  });

  it('holds camera orientation while a dialog pauses the scene and restores the same point', () => {
    const scene = sceneHarness();
    scene.update({ ...initial, progress: 1.75, running: true, view: 'follow' });
    const position = scene.camera.position.clone(), rotation = scene.camera.quaternion.clone();
    scene.update({ ...initial, progress: 1.75, running: true, view: 'follow', paused: true });
    scene.updateCamera(.03); scene.updateCamera(.03);
    expect(scene.camera.position.equals(position)).toBe(true);
    expect(scene.camera.quaternion.equals(rotation)).toBe(true);
    scene.update({ ...initial, progress: 1.75, running: true, view: 'follow', paused: false });
    expect(scene.camera.position.equals(position)).toBe(true);
  });

  it('restores camera resets at the current lap, and leaves reduced-motion overview stationary', () => {
    const scene = sceneHarness();
    scene.update({ ...initial, progress: 3.3 }); scene.resetCamera();
    expect(scene.camera.position.toArray()).toEqual(getTawafCameraFrame(3.3, 'walk').position);
    scene.update({ ...initial, reducedMotion: true, running: true, progress: 3.3 });
    const overview = scene.camera.position.clone();
    scene.update({ ...initial, reducedMotion: true, running: true, progress: 3.6 }); scene.updateCamera(.03);
    expect(scene.state.view).toBe('overview');
    expect(scene.camera.position.equals(overview)).toBe(true);
  });
});
