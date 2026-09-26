import { mkdirSync } from 'node:fs';
import { Document, NodeIO } from '@gltf-transform/core';
import * as T from 'three';
import { FRUITS } from '../../src/lib/fruits/catalog';
import { createFruitModel, disposeFruit } from '../../src/lib/fruits/models';
const out='output/fruits/models';mkdirSync(out,{recursive:true});
async function main() {
for(const fruit of FRUITS) {
 const doc=new Document(),buffer=doc.createBuffer(),scene=doc.createScene(),root=createFruitModel(fruit);
 root.updateMatrixWorld(true);
 const geom=new Map<T.BufferGeometry,ReturnType<typeof doc.createPrimitive>>();
 const mats=new Map<string,ReturnType<typeof doc.createMaterial>>();
 root.traverse(obj=>{
  if(!(obj instanceof T.Mesh))return;
  const g=obj.geometry as T.BufferGeometry,m=obj.material as T.MeshStandardMaterial;
  let primitive=geom.get(g);
  if(!primitive){primitive=doc.createPrimitive();for(const [key,semantic] of [['position','POSITION'],['normal','NORMAL'],['color','COLOR_0']] as const){const a=g.getAttribute(key);if(a)primitive.setAttribute(semantic,doc.createAccessor().setType('VEC3').setArray(new Float32Array(a.array)).setBuffer(buffer));}if(g.index)primitive.setIndices(doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(g.index.array)).setBuffer(buffer));geom.set(g,primitive);}
  const n=obj instanceof T.InstancedMesh?obj.count:1;
  for(let i=0;i<n;i++){
   const c=m.color.clone(),mat4=obj.matrixWorld.clone();
   if(obj instanceof T.InstancedMesh){const im=new T.Matrix4();obj.getMatrixAt(i,im);mat4.multiply(im);if(obj.instanceColor){const ic=new T.Color();obj.getColorAt(i,ic);c.multiply(ic);}}
   const key=`${c.r},${c.g},${c.b},${m.roughness},${m.side}`;
   let mat=mats.get(key);if(!mat){mat=doc.createMaterial().setBaseColorFactor([c.r,c.g,c.b,1]).setRoughnessFactor(m.roughness).setMetallicFactor(0).setDoubleSided(m.side===T.DoubleSide);mats.set(key,mat);}
   const prim=primitive.clone().setMaterial(mat),mesh=doc.createMesh().addPrimitive(prim),node=doc.createNode().setMesh(mesh).setMatrix(mat4.toArray());scene.addChild(node);
  }
 });
 await new NodeIO().write(`${out}/${fruit.id}.glb`,doc);disposeFruit(root);console.log(fruit.id);
}

}
main().catch(e=>{console.error(e);process.exit(1)});
