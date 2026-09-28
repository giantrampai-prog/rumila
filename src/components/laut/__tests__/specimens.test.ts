import { describe,expect,it } from 'vitest';
import * as T from 'three';
import { organicTube,path } from '../organic-geometry';
import { createSquid,createLionfish,createSeahorse } from '../specimens';
import { leafGeometry,seagrass } from '../seagrass';

describe('organic marine geometry',()=>{
  it('renders radial skin outward and closes the ends instead of leaving cut tubes',()=>{
    const geo=organicTube(path([[0,0,0],[1,0,0]]),u=>.1*(1-u*.8),24,16);
    const p=geo.attributes.position,n=geo.attributes.normal;
    let outward=0;
    for(let i=0;i<p.count-2;i++)if(p.getY(i)*n.getY(i)+p.getZ(i)*n.getZ(i)>0)outward++;
    expect(outward).toBe(p.count-2);
    expect(n.getX(p.count-2)).toBeLessThan(-.99);
    expect(n.getX(p.count-1)).toBeGreaterThan(.99);
  });

  it('keeps every animated animal finite, correctly sized and within a geometry budget',()=>{
    for(const build of [createSquid,createLionfish,createSeahorse]) {
      const clock={value:0},model=build(clock);let triangles=0;
      for(const time of [0,.25,12,240]) {clock.value=time;model.userData.update(time);}
      model.traverse(o=>{
        if(!(o instanceof T.Mesh))return;
        for(const key of ['position','normal'])expect(Array.from(o.geometry.attributes[key].array).every(Number.isFinite)).toBe(true);
        triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;
      });
      expect(triangles).toBeLessThan(90000);
      const size=new T.Box3().setFromObject(model).getSize(new T.Vector3());
      expect(size.length()).toBeGreaterThan(.5);expect(size.length()).toBeLessThan(3.2);
    }
  });

  it('has eight arms and two longer feeding tentacles, each carrying inward suckers',()=>{
    const squid=createSquid({value:0});
    const arms=squid.children.filter(o=>o.name==='lengan');
    const tentacles=squid.children.filter(o=>o.name==='tentakel-panjang');
    expect(arms.length).toBe(8);expect(tentacles.length).toBe(2);
    for(const arm of [...arms,...tentacles])expect(arm.getObjectByName('pengisap')).toBeDefined();
    const length=(o:T.Object3D)=>new T.Box3().setFromObject(o).getSize(new T.Vector3()).x;
    expect(Math.min(...tentacles.map(length))).toBeGreaterThan(Math.max(...arms.map(length))*1.5);
  });

  it('anchors curved leaf roots and varies shoot height without one draw call per blade',()=>{
    const leaf=leafGeometry(),p=leaf.attributes.position,uv=leaf.attributes.uv;
    for(let i=0;i<p.count;i++)if(uv.getY(i)===0)expect(p.getY(i)).toBe(0);
    leaf.computeBoundingBox();expect(leaf.boundingBox!.max.z-leaf.boundingBox!.min.z).toBeGreaterThan(.08);
    const grass=seagrass(7200,16,{value:0});expect(grass.isInstancedMesh).toBe(true);
    expect(leaf.index!.count/3*grass.count).toBeLessThan(650000);
    const matrix=new T.Matrix4(),scale=new T.Vector3(),heights:number[]=[];
    for(let i=0;i<grass.count;i++){grass.getMatrixAt(i,matrix);scale.setFromMatrixScale(matrix);heights.push(scale.y);}
    expect(Math.max(...heights)-Math.min(...heights)).toBeGreaterThan(.5);
  });
});
