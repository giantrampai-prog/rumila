import { describe, expect, it } from 'vitest';
import * as T from 'three';
import { anglerBodyGeometry, createAnglerfish } from '../anglerfish';

describe('anglerfish geometry', () => {
  it('has outward-facing skin so the body is visible without double-sided rendering', () => {
    const geometry = anglerBodyGeometry();
    const positions = geometry.attributes.position, normals = geometry.attributes.normal;
    let outward = 0;
    for (let i = 0; i < positions.count; i++) {
      if (positions.getY(i) * normals.getY(i) + positions.getZ(i) * normals.getZ(i) > 0) outward++;
    }
    expect(outward / positions.count).toBeGreaterThan(0.98);
    geometry.dispose();
  });

  it('remains finite while animating and fits a lightweight geometry budget', () => {
    const model = createAnglerfish(new T.Texture());
    let triangles = 0;
    for (const time of [0, 10, 100]) model.userData.update(time);
    model.traverse(object => {
      if (!(object instanceof T.Mesh)) return;
      const geometry = object.geometry;
      for (const key of ['position', 'normal']) {
        const attribute = geometry.getAttribute(key);
        if (attribute) expect(Array.from(attribute.array).every(Number.isFinite)).toBe(true);
      }
      triangles += (geometry.index?.count ?? geometry.attributes.position.count) / 3;
    });
    expect(triangles).toBeLessThan(22000);
    const box = new T.Box3().setFromObject(model);
    expect(box.isEmpty()).toBe(false);
    expect(box.max.x - box.min.x).toBeLessThan(2);
  });
});
