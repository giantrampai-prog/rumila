import * as T from 'three';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { acquireCharacterLibrary, bakeCharacter, CharacterAssetLibrary, type CharacterSource } from './character-assets';
import { walkMorphFrame } from './character-batch';

function riggedSource(): CharacterSource & { mesh: T.SkinnedMesh; hip: T.Bone } {
  const scene = new T.Group(), geometry = new T.CylinderGeometry(.18, .18, 1.75, 8, 3).translate(0, .875, 0);
  const positions = geometry.getAttribute('position'), indices: number[] = [], weights: number[] = [];
  for (let i = 0; i < positions.count; i++) { indices.push(positions.getY(i) > 1 ? 1 : 0, 0, 0, 0); weights.push(1, 0, 0, 0); }
  geometry.setAttribute('skinIndex', new T.Uint16BufferAttribute(indices, 4)); geometry.setAttribute('skinWeight', new T.Float32BufferAttribute(weights, 4));
  const material = new T.MeshStandardMaterial({ color: '#a88870', map: new T.Texture() });
  const mesh = new T.SkinnedMesh(geometry, material); mesh.name = 'character-body';
  const hip = new T.Bone(), chest = new T.Bone(); hip.name = 'mixamorigHips'; chest.name = 'chest';
  hip.position.y = .88; chest.position.y = .5; hip.add(chest); mesh.add(hip); scene.add(mesh);
  mesh.bind(new T.Skeleton([hip, chest])); scene.updateMatrixWorld(true);
  const quaternions = [-.2, .2, -.2, .2, -.2].flatMap((angle) => new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 0, 1), angle).toArray());
  const walk = new T.AnimationClip('walk', 1, [new T.QuaternionKeyframeTrack('chest.quaternion', [0, .25, .5, .75, 1], quaternions)]);
  const idle = new T.AnimationClip('idle', 0, [new T.QuaternionKeyframeTrack('chest.quaternion', [0], [0, 0, 0, 1])]);
  const seated = new T.AnimationClip('seated', 0, [new T.VectorKeyframeTrack('mixamorigHips.position', [0], [0, .6, .25])]);
  const driving = new T.AnimationClip('driving', 0, [new T.VectorKeyframeTrack('mixamorigHips.position', [0], [.15, .5, .3])]);
  return { scene, mesh, hip, animations: [walk, idle, seated, driving] };
}

function sharedBitmapTextures(source: ReturnType<typeof riggedSource>) {
  class Bitmap { close = vi.fn(); }
  vi.stubGlobal('ImageBitmap', Bitmap);
  const bitmap = new Bitmap(), material = source.mesh.material as T.MeshStandardMaterial;
  material.map!.source.data = bitmap;
  // Separate textures can share the same decoded image in GLTFLoader.
  material.normalMap = new T.Texture(bitmap);
  return { bitmap, textures: [material.map!, material.normalMap] };
}

afterEach(() => vi.unstubAllGlobals());

describe('realistic character assets', () => {
  it('bakes actual bone deformation, preserves source materials/UVs and seats around the hip anchor', async () => {
    const source = riggedSource(), originalUVs = Array.from(source.mesh.geometry.getAttribute('uv').array);
    const asset = await bakeCharacter(source);
    const standing = asset.poses.standing!; expect(standing.walkFrames).toBe(12); expect(standing.idleFrame).toBe(12);
    const part = standing.parts[0], poses = part.geometry.morphAttributes.position!;
    expect(poses).toHaveLength(13); expect(part.geometry.morphAttributes.normal).toHaveLength(13);
    expect(part.geometry.getAttribute('skinWeight')).toBeUndefined(); expect(part.geometry.getAttribute('skinIndex')).toBeUndefined();
    expect(Array.from(part.geometry.getAttribute('uv').array)).toEqual(originalUVs);
    expect(part.material).toBe(source.mesh.material);
    expect(Array.from(poses[0].array)).not.toEqual(Array.from(poses[3].array));
    for (const pose of Object.values(asset.poses)) for (const { geometry } of pose.parts) {
      for (const attribute of [geometry.getAttribute('position'), geometry.getAttribute('normal'), ...geometry.morphAttributes.position ?? [], ...geometry.morphAttributes.normal ?? []]) expect(Array.from(attribute.array).every(Number.isFinite)).toBe(true);
      for (const normals of [geometry.getAttribute('normal'), ...geometry.morphAttributes.normal ?? []]) for (let i = 0; i < normals.count; i++) expect(Math.hypot(normals.getX(i), normals.getY(i), normals.getZ(i))).toBeCloseTo(1, 5);
    }
    const normalFrames = part.geometry.morphAttributes.normal!;
    expect(Array.from(normalFrames[0].array)).not.toEqual(Array.from(normalFrames[3].array));
    const seated = asset.poses.seated!.parts[0].geometry, driving = asset.poses.driving!.parts[0].geometry;
    // Both pose clips translate the hip differently; baking removes that translation.
    Array.from(seated.getAttribute('position').array).forEach((value, i) => expect(value).toBeCloseTo(driving.getAttribute('position').array[i], 5));
    expect(seated.boundingBox!.max.y).toBeCloseTo(1.75 - .88, 5);
    expect(asset.poses.seated!.walkFrames).toBe(0);
    asset.dispose();
  });

  it('removes horizontal root motion while retaining the source vertical bob', async () => {
    const source = riggedSource();
    source.animations = [new T.AnimationClip('walk', 1, [new T.VectorKeyframeTrack('mixamorigHips.position', [0, .5, 1], [0, .88, 0, 2, .93, 1, 4, .88, 2])])];
    const asset = await bakeCharacter(source), frames = asset.poses.standing!.parts[0].geometry.morphAttributes.position!;
    const start = frames[0], middle = frames[6];
    for (let i = 0; i < start.count; i++) {
      expect(middle.getX(i)).toBeCloseTo(start.getX(i), 5);
      expect(middle.getZ(i)).toBeCloseTo(start.getZ(i), 5);
      expect(middle.getY(i) - start.getY(i)).toBeCloseTo(.05, 5);
    }
    asset.dispose();
  });

  it('keeps seated figures unavailable when the source has no valid seated clip', async () => {
    const source = riggedSource(); source.animations = source.animations.filter((clip) => clip.name === 'walk');
    const asset = await bakeCharacter(source);
    expect(asset.poses.standing).toBeDefined(); expect(asset.poses.seated).toBeUndefined(); expect(asset.poses.driving).toBeUndefined();
    expect(asset.errors.seated).toBeTruthy(); asset.dispose();
  });

  it('deduplicates loads and disposes a model that resolves after its library is released', async () => {
    const source = riggedSource(); const geometryDisposed = vi.spyOn(source.mesh.geometry, 'dispose');
    const { bitmap, textures } = sharedBitmapTextures(source), textureDisposals = textures.map((texture) => vi.spyOn(texture, 'dispose'));
    const materialDisposed = vi.spyOn(source.mesh.material as T.Material, 'dispose');
    let resolve!: (value: CharacterSource) => void;
    const loader = vi.fn(() => new Promise<CharacterSource>((done) => { resolve = done; }));
    const library = new CharacterAssetLibrary(loader), listener = vi.fn(); library.subscribe(listener);
    library.request('travel'); library.request('travel'); expect(loader).toHaveBeenCalledTimes(1); expect(library.state('travel')).toBe('loading');
    library.dispose(); resolve(source);
    await vi.waitFor(() => expect(geometryDisposed).toHaveBeenCalledOnce());
    expect(materialDisposed).toHaveBeenCalledOnce(); textureDisposals.forEach((spy) => expect(spy).toHaveBeenCalledOnce()); expect(bitmap.close).toHaveBeenCalledOnce(); expect(listener).not.toHaveBeenCalled();
    expect(library.asset('travel')).toBeUndefined();
  });

  it('closes shared decoded images once after a loaded asset is finally disposed', async () => {
    const source = riggedSource(), { bitmap, textures } = sharedBitmapTextures(source);
    const textureDisposals = textures.map((texture) => vi.spyOn(texture, 'dispose'));
    const library = new CharacterAssetLibrary(async () => source); library.request('travel');
    await vi.waitFor(() => expect(library.state('travel')).toBe('ready'));
    expect(bitmap.close).not.toHaveBeenCalled();
    library.dispose(); library.dispose();
    textureDisposals.forEach((spy) => expect(spy).toHaveBeenCalledOnce()); expect(bitmap.close).toHaveBeenCalledOnce();
  });

  it('keeps shared scene assets alive until the last crowd or passenger batch releases them', () => {
    const sceneResources = {}, crowd = acquireCharacterLibrary(sceneResources), passengers = acquireCharacterLibrary(sceneResources);
    const disposed = vi.spyOn(crowd.library, 'dispose');
    expect(crowd.library).toBe(passengers.library);
    crowd.release(); crowd.release(); expect(disposed).not.toHaveBeenCalled();
    passengers.release(); expect(disposed).toHaveBeenCalledOnce();
    const nextScene = acquireCharacterLibrary(sceneResources);
    expect(nextScene.library).not.toBe(crowd.library); nextScene.release();
  });
});

describe('instanced walk interpolation', () => {
  it('wraps both positive and negative phases across the end of a walk cycle', () => {
    const after = walkMorphFrame(Math.PI * 2 - .01, true, 12), before = walkMorphFrame(-.01, true, 12);
    expect(after.first).toBe(11); expect(after.second).toBe(0); expect(after.mix).toBeGreaterThan(.9); expect(before.first).toBe(after.first); expect(before.second).toBe(after.second); expect(before.mix).toBeCloseTo(after.mix, 12);
    expect(walkMorphFrame(0, true, 12)).toEqual({ first: 0, second: 1, mix: 0 });
  });
  it('selects the dedicated idle pose when paused or the gait is invalid', () => {
    expect(walkMorphFrame(2, false, 12)).toEqual({ first: 12, second: 12, mix: 0 });
    expect(walkMorphFrame(Number.NaN, true, 12)).toEqual({ first: 12, second: 12, mix: 0 });
  });
});
