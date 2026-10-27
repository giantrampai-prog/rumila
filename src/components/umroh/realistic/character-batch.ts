import * as T from 'three';
import type { WorldResources } from './types';
import type { Attire, HumanAppearance, HumanPose } from './human';
import { acquireCharacterLibrary, type BakedCharacterPose, type CharacterAssetLibrary, type CharacterLoadState, type CharacterMode } from './character-assets';

interface Slot extends HumanPose { female: boolean; attire: Attire }
interface BatchPart { mesh: T.InstancedMesh; weights: T.Mesh }
interface PoseBatch { parts: BatchPart[]; pose: BakedCharacterPose; count: number }
const UP = new T.Vector3(0, 1, 0);

/** Normalized neighboring walk frames, plus a dedicated idle pose. */
export function walkMorphFrame(gait: number, walking: boolean, frames: number): { first: number; second: number; mix: number } {
  if (!walking || !Number.isFinite(gait) || frames < 1) return { first: frames, second: frames, mix: 0 };
  const phase = ((gait / (Math.PI * 2)) % 1 + 1) % 1 * frames;
  const first = Math.floor(phase);
  return { first, second: (first + 1) % frames, mix: phase - first };
}
function modeFor(pose: Pick<HumanPose, 'seated' | 'driving'>): CharacterMode { return pose.driving ? 'driving' : pose.seated ? 'seated' : 'standing'; }

/** Male textured/rigged assets; female slots remain available to the existing renderer. */
export class RealisticHumanBatch {
  readonly group = new T.Group();
  private library: CharacterAssetLibrary;
  private release: () => void;
  private unsubscribe: () => void;
  private slots: (Slot | undefined)[];
  private batches = new Map<string, PoseBatch>();
  private requiredModes = new Set<CharacterMode>();
  private disposed = false;
  private hasPose = false;
  private transform = new T.Object3D();

  constructor(r: WorldResources, private count: number, seated = false, private onChange?: () => void) {
    this.count = Math.max(1, Math.floor(count)); this.slots = new Array(this.count);
    this.group.name = 'Realistic human assets'; this.group.userData.dynamic = true;
    this.requiredModes.add(seated ? 'seated' : 'standing');
    const acquired = acquireCharacterLibrary(r); this.library = acquired.library; this.release = acquired.release;
    this.unsubscribe = this.library.subscribe(() => { if (!this.disposed) { this.flush(); this.onChange?.(); } });
  }

  isReady(attire: Attire, pose?: Pick<HumanPose, 'seated' | 'driving'>): boolean {
    const asset = this.library.asset(attire); if (!asset) return false;
    return pose ? Boolean(asset.poses[modeFor(pose)]) : [...this.requiredModes].every((mode) => Boolean(asset.poses[mode]));
  }
  getState(attire: Attire): CharacterLoadState { return this.library.state(attire); }
  getError(attire: Attire): string | null {
    for (const mode of this.requiredModes) { const error = this.library.error(attire, mode); if (error) return error; }
    return this.library.error(attire);
  }
  pose(index: number, appearance: HumanAppearance, pose: HumanPose, attire: Attire): void {
    if (this.disposed || index < 0 || index >= this.count) return;
    if (!this.hasPose) { this.hasPose = true; this.requiredModes.clear(); }
    const existing = this.slots[index];
    if (existing) { const position = existing.position; Object.assign(existing, pose, { position, female: appearance.female, attire }); position.copy(pose.position); }
    else this.slots[index] = { ...pose, position: pose.position.clone(), female: appearance.female, attire };
    this.requiredModes.add(modeFor(pose));
  }
  private createBatch(attire: Attire, mode: CharacterMode): PoseBatch | null {
    const key = `${attire}/${mode}`, existing = this.batches.get(key); if (existing) return existing;
    const pose = this.library.asset(attire)?.poses[mode]; if (!pose) return null;
    const batch: PoseBatch = { pose, count: 0, parts: pose.parts.map((part) => {
      const mesh = new T.InstancedMesh(part.geometry, part.material, this.count);
      mesh.name = `asset-${attire}-${mode}-${part.name}`; mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false;
      mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);
      const weights = new T.Mesh(part.geometry, part.material);
      // Allocate the full-capacity morph texture before setting the visible count.
      if (pose.walkFrames) { weights.morphTargetInfluences!.fill(0); weights.morphTargetInfluences![pose.idleFrame] = 1; mesh.setMorphAt(0, weights); }
      mesh.count = 0; this.group.add(mesh); return { mesh, weights };
    }) };
    this.batches.set(key, batch); return batch;
  }
  flush(): void {
    if (this.disposed) return;
    this.batches.forEach((batch) => { batch.count = 0; });
    for (const slot of this.slots) {
      if (!slot || slot.female) continue;
      const mode = modeFor(slot);
      this.library.request(slot.attire);
      const batch = this.createBatch(slot.attire, mode); if (!batch) continue;
      const index = batch.count++;
      this.transform.position.copy(slot.position);
      // The pelvis joint is above the cushion's contact surface.
      if (mode !== 'standing') this.transform.position.y += .08 * slot.scale;
      this.transform.quaternion.setFromAxisAngle(UP, slot.angle); this.transform.scale.setScalar(slot.scale); this.transform.updateMatrix();
      const phase = walkMorphFrame(slot.gait, slot.walking, batch.pose.walkFrames);
      for (const part of batch.parts) {
        part.mesh.setMatrixAt(index, this.transform.matrix);
        if (batch.pose.walkFrames) {
          const influences = part.weights.morphTargetInfluences!; influences.fill(0); influences[phase.first] = 1 - phase.mix; influences[phase.second] += phase.mix;
          part.mesh.setMorphAt(index, part.weights);
        }
      }
    }
    this.batches.forEach((batch) => batch.parts.forEach(({ mesh }) => { mesh.count = batch.count; mesh.instanceMatrix.needsUpdate = true; if (mesh.morphTexture) mesh.morphTexture.needsUpdate = true; }));
  }
  dispose(): void {
    if (this.disposed) return; this.disposed = true; this.unsubscribe();
    this.batches.forEach((batch) => batch.parts.forEach(({ mesh }) => mesh.dispose())); this.batches.clear(); this.slots = [];
    this.group.clear(); this.group.removeFromParent(); this.release();
  }
}
