import * as T from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import type { Attire } from './human';

export type CharacterMode = 'standing' | 'seated' | 'driving';
export interface CharacterSource { scene: T.Group; animations: T.AnimationClip[] }
export interface BakedCharacterPart { geometry: T.BufferGeometry; material: T.Material | T.Material[]; name: string }
export interface BakedCharacterPose { parts: BakedCharacterPart[]; walkFrames: number; idleFrame: number; duration: number }
export interface BakedCharacterAsset {
  poses: Partial<Record<CharacterMode, BakedCharacterPose>>;
  errors: Partial<Record<CharacterMode, string>>;
  dispose(): void;
}
export type CharacterLoadState = 'idle' | 'loading' | 'ready' | 'error';
interface Entry { state: CharacterLoadState; asset?: BakedCharacterAsset; error?: string; controller?: AbortController }
type Loader = (url: string, signal: AbortSignal) => Promise<CharacterSource>;
const MODEL_URLS: Record<Attire, string> = { ihram: '/umroh/models/man-ihram.glb', travel: '/umroh/models/man-travel.glb' };
const WALK_FRAMES = 12;
const yieldToBrowser = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

function collectResources(source: CharacterSource): { geometries: Set<T.BufferGeometry>; materials: Set<T.Material>; textures: Set<T.Texture>; skeletons: Set<T.Skeleton> } {
  const geometries = new Set<T.BufferGeometry>(), materials = new Set<T.Material>(), textures = new Set<T.Texture>(), skeletons = new Set<T.Skeleton>();
  source.scene.traverse((object) => {
    if (!(object instanceof T.Mesh)) return;
    geometries.add(object.geometry);
    if (object instanceof T.SkinnedMesh) skeletons.add(object.skeleton);
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      materials.add(material);
      for (const value of Object.values(material)) if (value instanceof T.Texture) textures.add(value);
    }
  });
  return { geometries, materials, textures, skeletons };
}
function disposeTextures(textures: Set<T.Texture>): void {
  const bitmaps = new Set<ImageBitmap>();
  textures.forEach((texture) => {
    const image = texture.source.data;
    if (typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap) bitmaps.add(image);
    texture.dispose();
  });
  bitmaps.forEach((image) => image.close());
}
function disposeSource(source: CharacterSource): void {
  const resources = collectResources(source);
  resources.geometries.forEach((geometry) => geometry.dispose()); resources.materials.forEach((material) => material.dispose());
  disposeTextures(resources.textures); resources.skeletons.forEach((skeleton) => skeleton.dispose());
  source.scene.clear();
}
function abortIfNeeded(signal?: AbortSignal): void { if (signal?.aborted) throw new Error('Pemuatan karakter dibatalkan.'); }
function visibleMesh(object: T.Object3D): object is T.Mesh {
  if (!(object instanceof T.Mesh)) return false;
  for (let parent: T.Object3D | null = object; parent; parent = parent.parent) if (!parent.visible) return false;
  return true;
}
function findClip(source: CharacterSource, names: string[]): T.AnimationClip | undefined {
  return source.animations.find((clip) => names.includes(clip.name.split('|').at(-1)!.trim().toLowerCase()));
}
function findHip(source: CharacterSource): T.Bone | null {
  const matches: T.Bone[] = [];
  source.scene.traverse((object) => { if (object instanceof T.Bone && /(?:hips|pelvis)$/i.test(object.name.replace(/[^a-z]/gi, ''))) matches.push(object); });
  return matches.length === 1 ? matches[0] : null;
}
function sampleMesh(mesh: T.Mesh, origin: T.Vector3): { positions: Float32Array; normals: Float32Array } {
  const count = mesh.geometry.getAttribute('position').count;
  const positions = new Float32Array(count * 3), normals = new Float32Array(count * 3);
  const sourceNormals = mesh.geometry.getAttribute('normal');
  const vertex = new T.Vector3(), normal = new T.Vector3(), direction = new T.Vector4();
  const normalMatrix = new T.Matrix3().getNormalMatrix(mesh.matrixWorld);
  for (let i = 0; i < count; i++) {
    mesh.getVertexPosition(i, vertex).applyMatrix4(mesh.matrixWorld).sub(origin);
    vertex.toArray(positions, i * 3);
    normal.fromBufferAttribute(sourceNormals, i);
    if (mesh instanceof T.SkinnedMesh) { direction.set(normal.x, normal.y, normal.z, 0); mesh.applyBoneTransform(i, direction); normal.set(direction.x, direction.y, direction.z); }
    normal.applyMatrix3(normalMatrix).normalize(); normal.toArray(normals, i * 3);
    if (!Number.isFinite(vertex.x + vertex.y + vertex.z + normal.x + normal.y + normal.z)) throw new Error('Geometri karakter tidak valid.');
  }
  return { positions, normals };
}

/** Bake once per outfit, then use ordinary textured instancing for every person. */
export async function bakeCharacter(source: CharacterSource, signal?: AbortSignal): Promise<BakedCharacterAsset> {
  const meshes: T.Mesh[] = [];
  source.scene.traverse((object) => { if (visibleMesh(object)) meshes.push(object); });
  if (!meshes.length) throw new Error('Model karakter tidak memiliki mesh.');
  for (const mesh of meshes) if (!mesh.geometry.getAttribute('normal')) mesh.geometry.computeVertexNormals();
  const sourceResources = collectResources(source);
  const bones = sourceResources.skeletons.size;
  if (!bones) throw new Error('Model karakter belum memiliki rig.');
  const rest = new Map<T.Object3D, { position: T.Vector3; quaternion: T.Quaternion; scale: T.Vector3; morph?: number[] }>();
  source.scene.traverse((object) => rest.set(object, { position: object.position.clone(), quaternion: object.quaternion.clone(), scale: object.scale.clone(), morph: object instanceof T.Mesh ? object.morphTargetInfluences?.slice() : undefined }));
  const mixer = new T.AnimationMixer(source.scene);
  const reset = () => {
    mixer.stopAllAction();
    rest.forEach((pose, object) => { object.position.copy(pose.position); object.quaternion.copy(pose.quaternion); object.scale.copy(pose.scale); if (object instanceof T.Mesh && pose.morph) object.morphTargetInfluences = pose.morph.slice(); });
    source.scene.updateMatrixWorld(true);
  };
  const applyClip = (clip: T.AnimationClip | undefined, time: number) => {
    reset();
    if (clip) { const action = mixer.clipAction(clip); action.reset().setLoop(T.LoopOnce, 1).play(); action.clampWhenFinished = true; mixer.setTime(time); }
    source.scene.updateMatrixWorld(true);
  };
  const geometries = new Set<T.BufferGeometry>();
  const poses: BakedCharacterAsset['poses'] = {}, errors: BakedCharacterAsset['errors'] = {};
  const walk = findClip(source, ['walk', 'walking']);
  const idle = findClip(source, ['idle']);
  const hip = findHip(source);
  const makeGeometry = (mesh: T.Mesh, snapshot: ReturnType<typeof sampleMesh>) => {
    const geometry = mesh.geometry.clone(); geometry.morphAttributes = {};
    geometry.deleteAttribute('skinIndex'); geometry.deleteAttribute('skinWeight'); geometry.deleteAttribute('tangent');
    geometry.setAttribute('position', new T.BufferAttribute(snapshot.positions, 3)); geometry.setAttribute('normal', new T.BufferAttribute(snapshot.normals, 3));
    geometries.add(geometry); return geometry;
  };
  try {
    abortIfNeeded(signal);
    applyClip(idle, 0);
    const idleHip = hip?.getWorldPosition(new T.Vector3());
    const idleSnapshots = meshes.map((mesh) => sampleMesh(mesh, new T.Vector3()));
    const bounds = new T.Box3();
    for (const snapshot of idleSnapshots) bounds.union(new T.Box3().setFromBufferAttribute(new T.BufferAttribute(snapshot.positions, 3)));
    const height = bounds.max.y - bounds.min.y;
    if (height < 1.25 || height > 2.3 || Math.abs(bounds.min.y) > .2) throw new Error('Model karakter perlu dinormalisasi ke meter dan lantai y=0.');
    if (!walk || walk.duration < .2) errors.standing = 'Animasi berjalan belum tersedia untuk karakter ini.';
    else {
      const parts = meshes.map((mesh, i) => ({ geometry: makeGeometry(mesh, idleSnapshots[i]), material: mesh.material, name: mesh.name }));
      const framePositions: T.BufferAttribute[][] = meshes.map(() => []), frameNormals: T.BufferAttribute[][] = meshes.map(() => []);
      for (let frame = 0; frame < WALK_FRAMES; frame++) {
        abortIfNeeded(signal); applyClip(walk, frame / WALK_FRAMES * walk.duration);
        // Gameplay owns translation; imported locomotion may contain root travel.
        const origin = hip && idleHip ? hip.getWorldPosition(new T.Vector3()).sub(idleHip).setY(0) : new T.Vector3();
        meshes.forEach((mesh, i) => { const snapshot = sampleMesh(mesh, origin); framePositions[i].push(new T.BufferAttribute(snapshot.positions, 3)); frameNormals[i].push(new T.BufferAttribute(snapshot.normals, 3)); });
        await yieldToBrowser();
      }
      parts.forEach((part, i) => {
        part.geometry.morphTargetsRelative = false;
        part.geometry.morphAttributes.position = [...framePositions[i], new T.BufferAttribute(idleSnapshots[i].positions, 3)];
        part.geometry.morphAttributes.normal = [...frameNormals[i], new T.BufferAttribute(idleSnapshots[i].normals, 3)];
        part.geometry.computeBoundingBox(); part.geometry.computeBoundingSphere();
      });
      poses.standing = { parts, walkFrames: WALK_FRAMES, idleFrame: WALK_FRAMES, duration: walk.duration };
    }
    for (const mode of ['seated', 'driving'] as const) {
      abortIfNeeded(signal);
      const clip = findClip(source, mode === 'seated' ? ['seated', 'sit', 'sitting'] : ['driving', 'drive']);
      if (!clip || !hip) { errors[mode] = !clip ? 'Pose duduk belum tersedia untuk karakter ini.' : 'Titik panggul karakter belum tersedia.'; continue; }
      // These clips must already contain the desired seated pose at their start.
      applyClip(clip, 0);
      const origin = hip.getWorldPosition(new T.Vector3());
      const parts = meshes.map((mesh) => ({ geometry: makeGeometry(mesh, sampleMesh(mesh, origin)), material: mesh.material, name: mesh.name }));
      parts.forEach((part) => { part.geometry.computeBoundingBox(); part.geometry.computeBoundingSphere(); });
      poses[mode] = { parts, walkFrames: 0, idleFrame: 0, duration: 0 };
      await yieldToBrowser();
    }
    abortIfNeeded(signal);
    if (!Object.keys(poses).length) throw new Error(errors.standing ?? 'Pose karakter tidak tersedia.');
    let disposed = false;
    return { poses, errors, dispose() {
      if (disposed) return; disposed = true;
      geometries.forEach((geometry) => geometry.dispose()); sourceResources.geometries.forEach((geometry) => geometry.dispose());
      sourceResources.materials.forEach((material) => material.dispose()); disposeTextures(sourceResources.textures); sourceResources.skeletons.forEach((skeleton) => skeleton.dispose());
      source.scene.clear();
    } };
  } catch (error) { geometries.forEach((geometry) => geometry.dispose()); throw error; }
  finally { mixer.stopAllAction(); mixer.uncacheRoot(source.scene); }
}

async function loadSource(url: string, signal: AbortSignal): Promise<CharacterSource> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Aset karakter gagal dimuat (HTTP ${response.status}).`);
  const buffer = await response.arrayBuffer(); abortIfNeeded(signal);
  const loader = new GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder);
  return loader.parseAsync(buffer, url.slice(0, url.lastIndexOf('/') + 1));
}

/** One owner per scene resources; no global GPU assets survive the last renderer. */
export class CharacterAssetLibrary {
  private entries = new Map<Attire, Entry>();
  private listeners = new Set<() => void>();
  private disposed = false;
  constructor(private loader: Loader = loadSource) {}
  subscribe(listener: () => void): () => void { this.listeners.add(listener); return () => this.listeners.delete(listener); }
  state(attire: Attire): CharacterLoadState { return this.entries.get(attire)?.state ?? 'idle'; }
  asset(attire: Attire): BakedCharacterAsset | undefined { return this.entries.get(attire)?.asset; }
  error(attire: Attire, mode?: CharacterMode): string | null {
    const entry = this.entries.get(attire);
    return entry?.error ?? (mode ? entry?.asset?.errors[mode] : null) ?? null;
  }
  request(attire: Attire): void {
    if (this.disposed || this.entries.has(attire)) return;
    const controller = new AbortController(); const entry: Entry = { state: 'loading', controller }; this.entries.set(attire, entry);
    void this.load(attire, entry, controller);
  }
  private async load(attire: Attire, entry: Entry, controller: AbortController): Promise<void> {
    let source: CharacterSource | undefined;
    try {
      source = await this.loader(MODEL_URLS[attire], controller.signal);
      abortIfNeeded(controller.signal);
      const asset = await bakeCharacter(source, controller.signal);
      if (this.disposed) { asset.dispose(); return; }
      entry.asset = asset; entry.state = 'ready';
    } catch (error) {
      if (source) disposeSource(source);
      if (!this.disposed) { entry.state = 'error'; entry.error = error instanceof Error ? error.message : 'Karakter belum dapat dimuat.'; }
    } finally {
      entry.controller = undefined;
      if (!this.disposed) this.listeners.forEach((listener) => listener());
    }
  }
  dispose(): void {
    if (this.disposed) return; this.disposed = true;
    this.entries.forEach((entry) => { entry.controller?.abort(); entry.asset?.dispose(); }); this.entries.clear(); this.listeners.clear();
  }
}

const libraries = new WeakMap<object, { library: CharacterAssetLibrary; users: number }>();
export function acquireCharacterLibrary(owner: object): { library: CharacterAssetLibrary; release(): void } {
  let entry = libraries.get(owner);
  if (!entry) { entry = { library: new CharacterAssetLibrary(), users: 0 }; libraries.set(owner, entry); }
  entry.users++;
  let released = false;
  return { library: entry.library, release() { if (released) return; released = true; if (--entry.users === 0) { entry.library.dispose(); libraries.delete(owner); } } };
}
