import * as T from 'three';
import { describe, expect, it } from 'vitest';
import { Resources } from './resources';

/** Exercise batching without creating the browser-only texture loader or canvas. */
function batchingResources(): Resources {
  return Object.assign(Object.create(Resources.prototype) as Resources, {
    resources: new Set<T.BufferGeometry | T.Material | T.Texture>(),
    cache: new Map<string, T.BufferGeometry>(),
    disposed: false,
  });
}

function verticesInWorld(group: T.Group): T.Vector3[] {
  group.updateWorldMatrix(true, true);
  const vertices: T.Vector3[] = [];
  group.traverse((object) => {
    if (!(object instanceof T.Mesh)) return;
    const positions = object.geometry.getAttribute('position');
    const index = object.geometry.index;
    for (let i = 0; i < (index?.count ?? positions.count); i++) {
      vertices.push(new T.Vector3().fromBufferAttribute(positions, index ? index.getX(i) : i).applyMatrix4(object.matrixWorld));
    }
  });
  return vertices;
}

function expectSameVertices(actual: T.Vector3[], expected: T.Vector3[]): void {
  expect(actual).toHaveLength(expected.length);
  actual.forEach((point, i) => expect(point.distanceTo(expected[i])).toBeLessThan(.0001));
}

describe('environment resource batching', () => {
  it('preserves world coordinates when batching a translated, rotated and scaled group', () => {
    const resources = batchingResources();
    const world = new T.Group();
    world.position.set(23, 5, -17);
    world.rotation.set(.1, .6, -.15);
    const aircraft = new T.Group();
    aircraft.position.set(4, 2, -8);
    aircraft.rotation.set(.25, -.4, .12);
    aircraft.scale.set(1.5, .75, 2);
    world.add(aircraft);
    const material = resources.keep(new T.MeshStandardMaterial());
    const body = resources.box(aircraft, [4, 3, 18], [0, 0, 2], material);
    body.rotation.y = .18;
    const nested = new T.Group();
    nested.position.set(1, 2, -6);
    nested.rotation.z = .3;
    aircraft.add(nested);
    resources.sphere(nested, [2, 1, 3], [0, 1, 0], material);
    const before = verticesInWorld(world);

    resources.batch(aircraft);

    expectSameVertices(verticesInWorld(world), before);
    resources.dispose();
  });

  it('keeps independently batched scenery movable after the outer world is batched', () => {
    const resources = batchingResources();
    const world = new T.Group();
    const scenery = new T.Group();
    scenery.userData.dynamic = true;
    scenery.position.set(-2, 3, -12);
    world.add(scenery);
    const material = resources.keep(new T.MeshStandardMaterial());
    resources.box(scenery, [3, 4, 5], [7, 1, -5], material);
    resources.sphere(scenery, [5, 2, 4], [-4, 0, -8], material);
    resources.box(world, [2, 1, 2], [0, 0, 0], material);
    const before = verticesInWorld(scenery);

    resources.batch(scenery);
    resources.batch(world);

    expect(scenery.parent).toBe(world);
    expectSameVertices(verticesInWorld(scenery), before);
    scenery.position.z += 40;
    expectSameVertices(verticesInWorld(scenery), before.map((point) => point.clone().add(new T.Vector3(0, 0, 40))));
    resources.dispose();
  });
});
