import { describe,it,expect } from 'vitest';
import * as T from 'three';
import { FRUITS } from '../catalog';
import { createFruitModel,disposeFruit } from '../models';
describe('fruit geometry shipped to the WebGL viewer',()=>{
 it.each(FRUITS.map(f=>[f.id,f] as const))('%s has finite, centered geometry within the camera budget',(_id,fruit)=>{
  const model=createFruitModel(fruit);model.updateMatrixWorld(true);const box=new T.Box3().setFromObject(model),center=box.getCenter(new T.Vector3()),size=box.getSize(new T.Vector3());
  expect(center.length()).toBeLessThan(.001);expect(Math.max(size.x,size.y,size.z)).toBeCloseTo(2.6,3);expect(Math.min(size.x,size.y,size.z)).toBeGreaterThan(.1);
  let triangles=0;
  model.traverse(o=>{if(!(o instanceof T.Mesh))return;for(const key of ['position','normal']){const attribute=o.geometry.getAttribute(key);expect(attribute).toBeDefined();for(const value of attribute.array)if(!Number.isFinite(value))throw new Error(`${fruit.id}: invalid ${key}`);}triangles+=(o.geometry.index?.count??o.geometry.getAttribute('position').count)/3*(o instanceof T.InstancedMesh?o.count:1);});
  expect(triangles).toBeGreaterThan(1000);expect(triangles).toBeLessThan(100000);disposeFruit(model);
 });
});
