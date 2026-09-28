import { expect,it } from 'vitest';
import * as T from 'three';
import { createAurora } from '../aurora';
import { createSatellite } from '../satellite';

it('uses continuous subdivided aurora curtains with transparent feathered emission',()=>{
  const aurora=createAurora(40,120);
  expect(aurora.group.children.length).toBe(3);
  for(const object of aurora.group.children){
    const mesh=object as T.Mesh,geo=mesh.geometry;geo.computeBoundingBox();
    expect(Array.from(geo.attributes.position.array).every(Number.isFinite)).toBe(true);
    expect(geo.boundingBox!.max.y-geo.boundingBox!.min.y).toBeCloseTo(80);
    expect(geo.attributes.position.count).toBeGreaterThan(4000);
  }
  expect(aurora.mat.depthWrite).toBe(false);
});

it('keeps the satellite lightweight and its solid materials non-emissive',()=>{
  const sat=createSatellite(1);let triangles=0,arrays=0;
  sat.traverse(o=>{
    if(!(o instanceof T.Mesh))return;
    if(o.name==='solar-cell-array')arrays++;
    triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;
    expect(Array.from(o.geometry.attributes.position.array).every(Number.isFinite)).toBe(true);
    if(o.material instanceof T.MeshStandardMaterial)expect(o.material.emissive.getHex()).toBe(0);
  });
  expect(arrays).toBe(4);expect(triangles).toBeLessThan(4000);
});
