// Instanced tropical vegetation. Each prototype contains real branching wood and bent leaf sprays;
// many trees share geometry/materials, while rotation, height, species and canopy tint vary per instance.
import * as T from 'three';
import { Merge, mat } from '@/components/fruits/garden/build';
import { rng } from './bodies';

const UP = new T.Vector3(0, 1, 0);
const IDENTITY = new T.Matrix4();
const TAU = Math.PI * 2;

export function wind<TMaterial extends T.MeshStandardMaterial | T.MeshDepthMaterial>(material: TMaterial, time: { value: number }) {
  material.onBeforeCompile = (s) => {
    s.uniforms.uWindTime = time;
    s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nattribute float aSway; uniform float uWindTime;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        vec3 wp = position;
        #ifdef USE_INSTANCING
          wp = (instanceMatrix * vec4(position,1.0)).xyz;
        #endif
        float phase=wp.x*0.37+wp.z*0.21;
        transformed.x += sin(uWindTime*0.85+phase)*aSway;
        transformed.z += cos(uWindTime*0.67+phase*1.3)*aSway*0.6;`);
  };
  return material;
}

function branch(wood: Merge, a: T.Vector3, b: T.Vector3, r0: number, r1: number) {
  const geo = new T.CylinderGeometry(r1, r0, a.distanceTo(b), 9, 3);
  const matrix = new T.Matrix4().compose(a.clone().lerp(b, 0.5), new T.Quaternion().setFromUnitVectors(UP, b.clone().sub(a).normalize()), new T.Vector3(1, 1, 1));
  wood.add(geo, matrix, '#c7bfb0', { uv: [1, a.distanceTo(b) * 2.5] });
}

function crown(leaves: Merge, center: T.Vector3, rad: T.Vector3, n: number, size: number, r: () => number) {
  const pos: number[] = [], normal: number[] = [], uv: number[] = [], colors: number[] = [];
  const direction = new T.Vector3(), q = new T.Quaternion(), e = new T.Euler(), p = new T.Vector3(), c = new T.Color();
  for (let i = 0; i < n; i++) {
    direction.set(r() * 2 - 1, r() * 2 - 1, r() * 2 - 1).normalize();
    const dist = 0.2 + Math.sqrt(r()) * 0.8;
    const at = center.clone().add(new T.Vector3(direction.x * rad.x, direction.y * rad.y, direction.z * rad.z).multiplyScalar(dist));
    q.setFromEuler(e.set(r() * TAU, r() * TAU, r() * TAU));
    const s = size * (0.65 + r() * 0.6);
    const shade = (0.61 + dist * 0.39) * (0.8 + Math.max(0, direction.y) * 0.24);
    c.setRGB(0.94, 1, 0.88).multiplyScalar(shade);
    const norm = direction.clone().addScaledVector(UP, 0.55).normalize();
    // Folded card rather than one flat quad: central vein protrudes towards the light.
    const corners = [[-0.5,-0.5,0,0,0],[0,-0.5,0.1,0.5,0],[0,0.5,0.1,0.5,1],[-0.5,0.5,0,0,1],[0.5,-0.5,0,1,0],[0.5,0.5,0,1,1]];
    for (const k of [0,1,2,0,2,3,1,4,5,1,5,2]) {
      const [x,y,z,u,v] = corners[k];
      p.set(x*s,y*s,z*s).applyQuaternion(q).add(at);
      pos.push(p.x,p.y,p.z); normal.push(norm.x,norm.y,norm.z); uv.push(u,v); colors.push(c.r,c.g,c.b);
    }
  }
  const geo = new T.BufferGeometry();
  geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));
  geo.setAttribute('normal',new T.Float32BufferAttribute(normal,3));
  geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
  geo.setAttribute('color',new T.Float32BufferAttribute(colors,3));
  leaves.add(geo,IDENTITY,'#ffffff',{sway:0.009,baseY:0.6});
}

export function broadleaf(seed: number, far: boolean) {
  const r = rng(seed), wood = new Merge(), leaves = new Merge();
  const h = 2.2 + r() * 0.9, spread = 1.1 + r() * 0.65;
  const trunk = [new T.Vector3(0,0,0),new T.Vector3(0.06,h*0.35,0),new T.Vector3((r()-0.5)*0.25,h*0.73,0.06),new T.Vector3(0.12,h,0.04)];
  for(let i=0;i<3;i++) branch(wood,trunk[i],trunk[i+1],0.17-i*0.045,0.12-i*0.04);
  if (!far) for(let i=0;i<5;i++) {
    const a=i*TAU/5;
    branch(wood,new T.Vector3(Math.cos(a)*0.43,-0.06,Math.sin(a)*0.43),new T.Vector3(0,0.5,0),0.035,0.085);
  }
  const n = far ? 4 : 7;
  for(let i=0;i<n;i++) {
    const a=i*2.399+r()*0.8, y=h*(0.5+r()*0.4), reach=spread*(0.55+r()*0.45);
    const start=new T.Vector3(0.04,y,0), mid=new T.Vector3(Math.cos(a)*reach*0.6,y+0.3,Math.sin(a)*reach*0.6);
    const end=new T.Vector3(Math.cos(a)*reach,y+0.65+r()*0.45,Math.sin(a)*reach);
    branch(wood,start,mid,0.055,0.028); branch(wood,mid,end,0.028,0.008);
    if(!far) for(let j=0;j<2;j++) branch(wood,mid,end.clone().add(new T.Vector3((r()-0.5)*0.8,r()*0.35,(r()-0.5)*0.8)),0.012,0.003);
    crown(leaves,end,new T.Vector3(spread*0.65,0.65+r()*0.3,spread*0.65),far?17:35,far?0.96:0.78,r);
  }
  crown(leaves,trunk[3].clone().addScaledVector(UP,0.45),new T.Vector3(spread*0.7,0.8,spread*0.7),far?18:38,0.85,r);
  return {wood,leaves};
}

/** 3D coconut leaflets individually follow an arching rachis. */
export function palm(seed: number) {
  const r = rng(seed), wood = new Merge(), leaves = new Merge();
  const h=3.4+r()*1.3, lean=(r()-0.5)*0.95;
  const at=(t:number)=>new T.Vector3(lean*t*t,h*t,0.1*Math.sin(t*2));
  for(let i=0;i<10;i++) branch(wood,at(i/10),at((i+1)/10),0.1-i*0.004,0.096-i*0.004);
  const top=at(1);
  for(let f=0;f<14;f++) {
    const a=f*TAU/14+r()*0.3,len=1.7+r()*0.7,lift=0.6+r()*1.2,droop=1.1+r()*0.9;
    const along=new T.Vector3(Math.cos(a),0,Math.sin(a)),side=new T.Vector3(-Math.sin(a),0,Math.cos(a));
    const point=(t:number)=>top.clone().addScaledVector(along,len*t).addScaledVector(UP,lift*t-droop*t*t);
    for(let j=0;j<8;j++) branch(wood,point(j/8),point((j+1)/8),0.009*(1-j/9),0.006*(1-j/9));
    const pos:number[]=[],uv:number[]=[],indices:number[]=[];
    const width=.8+r()*.2;
    for(let j=0;j<=14;j++) {
      const t=j/14,base=point(t);
      for(const sideK of [-1,0,1]) {
        const p=base.clone().addScaledVector(side,sideK*width*.5)
          .addScaledVector(UP,-Math.abs(sideK)*Math.sin(t*Math.PI)*.15);
        pos.push(p.x,p.y,p.z);uv.push((sideK+1)*.5,t);
      }
      if(j<14){const k=j*3;indices.push(k,k+3,k+1,k+1,k+3,k+4,k+1,k+4,k+2,k+2,k+4,k+5);}
    }
    const frond=new T.BufferGeometry();frond.setAttribute('position',new T.Float32BufferAttribute(pos,3));frond.setAttribute('uv',new T.Float32BufferAttribute(uv,2));frond.setIndex(indices);frond.computeVertexNormals();
    leaves.add(frond,IDENTITY,f>11?'#b7aa89':'#ecedd6',{sway:0.02,baseY:h-0.5});
  }
  for(let i=0;i<5;i++) wood.add(new T.SphereGeometry(0.12,10,8),mat(top.x+Math.cos(i*2)*0.18,h-0.16,top.z+Math.sin(i*2)*0.18,0,0,0,1,1.3,1),'#968367');
  return {wood,leaves};
}
