import * as T from 'three';
import { afterEach, describe, expect, it } from 'vitest';
import { HumanBatch, humanAppearance, type HumanPose } from './human';
import type { WorldResources } from './types';

const owned = new Set<T.BufferGeometry | T.Material | T.Texture>();
const batches: HumanBatch[] = [];
function makeBatch(count: number): HumanBatch {
  const fabric = new T.MeshStandardMaterial(); owned.add(fabric);
  const resources = {
    mat: { fabric },
    keep<G extends T.BufferGeometry | T.Material | T.Texture>(resource: G): G { owned.add(resource); return resource; },
  } as unknown as WorldResources;
  const batch = new HumanBatch(resources, count); batches.push(batch); return batch;
}
function meshes(batch: HumanBatch): T.InstancedMesh[] { return batch.group.children.filter((object): object is T.InstancedMesh => object instanceof T.InstancedMesh); }
function head(batch: HumanBatch): T.InstancedMesh { return meshes(batch).find((mesh) => mesh.name === 'human-head-skin')!; }
function matrixAt(mesh: T.InstancedMesh, index: number): number[] { const matrix = new T.Matrix4(); mesh.getMatrixAt(index, matrix); return matrix.toArray(); }
function colorAt(mesh: T.InstancedMesh, index: number): number[] { const color = new T.Color(); mesh.getColorAt(index, color); return color.toArray(); }
function pose(index: number): HumanPose { return { position: new T.Vector3(index * 3, 0, -index * 2), angle: index * .4, scale: .9 + index * .04, gait: index, walking: true }; }

afterEach(() => {
  batches.splice(0).forEach((batch) => batch.dispose());
  owned.forEach((resource) => resource.dispose()); owned.clear();
});

describe('procedural fallback GPU compaction', () => {
  it('removes hidden instances and preserves each remaining transform and color', () => {
    const batch = makeBatch(4);
    for (let i = 0; i < 4; i++) batch.pose(i, humanAppearance(i, i % 2 === 1), pose(i), 'travel');
    batch.flush();
    const mesh = head(batch);
    const matrices = [matrixAt(mesh, 1), matrixAt(mesh, 3)];
    const colors = [colorAt(mesh, 1), colorAt(mesh, 3)];
    batch.hide(0); batch.hide(2); batch.flush();

    expect(mesh.count).toBe(2);
    expect([matrixAt(mesh, 0), matrixAt(mesh, 1)]).toEqual(matrices);
    expect([colorAt(mesh, 0), colorAt(mesh, 1)]).toEqual(colors);
    expect(meshes(batch).filter((part) => part.name.includes('-male')).every((part) => part.count === 0 && !part.visible)).toBe(true);
    expect(meshes(batch).every((part) => part.count <= 2)).toBe(true);

    // A second flush must not read back already packed data as logical source slots.
    batch.flush();
    expect([matrixAt(mesh, 0), matrixAt(mesh, 1)]).toEqual(matrices);
    expect([colorAt(mesh, 0), colorAt(mesh, 1)]).toEqual(colors);
  });

  it('submits no geometry when all slots are hidden and safely reuses source indices', () => {
    const batch = makeBatch(4), reference = makeBatch(2);
    for (let i = 0; i < 4; i++) batch.pose(i, humanAppearance(i, false), pose(i), 'travel');
    batch.flush();
    for (let i = 0; i < 4; i++) batch.hide(i);
    batch.flush();
    expect(meshes(batch).every((part) => part.count === 0 && !part.visible)).toBe(true);

    const firstAppearance = humanAppearance(5, true), lastAppearance = humanAppearance(3, false);
    const firstPose = pose(7), lastPose = pose(8);
    // Revive in reverse order, with new appearance and attire on the same logical indices.
    batch.pose(3, lastAppearance, lastPose, 'ihram');
    batch.pose(0, firstAppearance, firstPose, 'ihram');
    reference.pose(0, firstAppearance, firstPose, 'ihram');
    reference.pose(1, lastAppearance, lastPose, 'ihram');
    batch.flush(); reference.flush();

    for (const [i, part] of meshes(batch).entries()) {
      const expected = meshes(reference)[i];
      expect(part.count).toBe(expected.count); expect(part.visible).toBe(expected.visible);
      for (let slot = 0; slot < expected.count; slot++) {
        expect(matrixAt(part, slot)).toEqual(matrixAt(expected, slot));
        if (part.instanceColor) expect(colorAt(part, slot)).toEqual(colorAt(expected, slot));
      }
    }
    expect(head(batch).count).toBe(2);
    expect(meshes(batch).filter((part) => part.name.endsWith('-travel')).every((part) => part.count === 0)).toBe(true);
  });
});
