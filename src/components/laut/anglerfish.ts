import * as T from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const TAU = Math.PI * 2;

/** Smooth open head, tapering tail, and an oblique mouth rather than a ball with teeth on it. */
export function anglerBodyGeometry() {
  const profile = new T.CatmullRomCurve3([
    new T.Vector3(0.50, 0.29, 0.28), new T.Vector3(0.22, 0.37, 0.345),
    new T.Vector3(-0.10, 0.32, 0.29), new T.Vector3(-0.40, 0.19, 0.16),
    new T.Vector3(-0.63, 0.068, 0.055), new T.Vector3(-0.75, 0.025, 0.02),
  ]);
  const vertices: number[] = [], indices: number[] = [], uv: number[] = [];
  const rows = 48, sides = 64;
  for (let i = 0; i <= rows; i++) {
    const t = i / rows, p = profile.getPoint(t);
    for (let j = 0; j <= sides; j++) {
      const a = j / sides * TAU;
      const wrinkle = 1 + Math.sin(a * 9 + t * 13) * Math.sin(t * Math.PI) * 0.012;
      vertices.push(p.x - Math.sin(a) * 0.17 * Math.exp(-t * 9),
        -0.02 + t * 0.03 + Math.sin(a) * p.y * wrinkle, Math.cos(a) * p.z * wrinkle);
      uv.push(j / sides, t);
      if (i < rows && j < sides) {
        const k = i * (sides + 1) + j;
        indices.push(k, k + 1, k + sides + 1, k + 1, k + sides + 2, k + sides + 1);
      }
    }
  }
  const geo = new T.BufferGeometry();
  geo.setAttribute('position', new T.Float32BufferAttribute(vertices, 3));
  geo.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
  geo.setIndex(indices); geo.computeVertexNormals();
  // The duplicated UV seam shares one smooth normal, avoiding a ridge along the flank.
  const normals = geo.getAttribute('normal');
  for (let i = 0; i <= rows; i++) {
    const first = i * (sides + 1), last = first + sides;
    const normal = new T.Vector3().fromBufferAttribute(normals, first)
      .add(new T.Vector3().fromBufferAttribute(normals, last)).normalize();
    normals.setXYZ(first, normal.x, normal.y, normal.z);
    normals.setXYZ(last, normal.x, normal.y, normal.z);
  }
  return geo;
}

const rimPoint = (a: number) => new T.Vector3(0.50 - Math.sin(a) * 0.17, -0.02 + Math.sin(a) * 0.29, Math.cos(a) * 0.28);

function toothGeometry(base: T.Vector3, length: number, upper: boolean) {
  const curve = new T.QuadraticBezierCurve3(base,
    base.clone().add(new T.Vector3(-0.014, (upper ? -1 : 1) * length * 0.5, -base.z * 0.12)),
    base.clone().add(new T.Vector3(-0.072, (upper ? -1 : 1) * length, -base.z * 0.22)));
  const geo = new T.TubeGeometry(curve, 9, 0.007, 7, false);
  const p = geo.attributes.position;
  for (let i = 0; i <= 9; i++) {
    const center = curve.getPointAt(i / 9), taper = Math.max(0.025, Math.pow(1 - i / 9, 0.8));
    for (let j = 0; j <= 7; j++) {
      const n = i * 8 + j, v = new T.Vector3().fromBufferAttribute(p, n).sub(center).multiplyScalar(taper).add(center);
      p.setXYZ(n, v.x, v.y, v.z);
    }
  }
  geo.computeVertexNormals(); return geo;
}

function fin(points: T.Vector3[], material: T.Material) {
  const group = new T.Group();
  const outline = new T.CatmullRomCurve3(points);
  const pos = [0, 0, 0], indices: number[] = [];
  const ribs: number[] = [];
  for (let i = 0; i <= 32; i++) {
    const p = outline.getPoint(i / 32); pos.push(p.x, p.y, p.z);
    if (i < 32) indices.push(0, i + 1, i + 2);
    if (i % 3 === 0) ribs.push(0, 0, 0, p.x, p.y, p.z);
  }
  const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); geo.setIndex(indices); geo.computeVertexNormals();
  group.add(new T.Mesh(geo, material));
  const rays = new T.BufferGeometry(); rays.setAttribute('position', new T.Float32BufferAttribute(ribs, 3));
  group.add(new T.LineSegments(rays, new T.LineBasicMaterial({color:'#898074',transparent:true,opacity:0.42})));
  return group;
}

/** Melanocetus-inspired educational model; fine needle teeth, tiny eyes and subdued skin. */
export function createAnglerfish(glowMap: T.Texture) {
  const g = new T.Group();
  const skin = new T.MeshStandardMaterial({color:'#3c3530',roughness:0.56,metalness:0});
  skin.onBeforeCompile = s => {
    s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 skinPosition;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nskinPosition=position;');
    s.fragmentShader = s.fragmentShader.replace('#include <common>', `#include <common>
      varying vec3 skinPosition;
      float grain(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
      float noise3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
        return mix(mix(mix(grain(i),grain(i+vec3(1,0,0)),f.x),mix(grain(i+vec3(0,1,0)),grain(i+vec3(1,1,0)),f.x),f.y),
          mix(mix(grain(i+vec3(0,0,1)),grain(i+vec3(1,0,1)),f.x),mix(grain(i+vec3(0,1,1)),grain(i+vec3(1,1,1)),f.x),f.y),f.z);}
    `).replace('#include <color_fragment>', `#include <color_fragment>
      float pores=noise3(skinPosition*105.0); float mottling=noise3(skinPosition*18.0);
      diffuseColor.rgb *= 0.68+mottling*0.50+pores*0.18;
    `).replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
      vec3 q0=dFdx(vViewPosition),q1=dFdy(vViewPosition),r1=cross(q1,normal),r2=cross(normal,q0);
      float det=dot(q0,r1);vec3 grad=sign(det)*(dFdx(pores)*r1+dFdy(pores)*r2);
      if(abs(det)>0.00000001)normal=normalize(abs(det)*normal-0.00065*grad);
    `);
  };
  skin.customProgramCacheKey = () => 'angler-leathery-skin-v1';
  const body = new T.Mesh(anglerBodyGeometry(), skin); body.name='angler-body'; g.add(body);

  // A recessed funnel creates an actual mouth cavity, with continuous lips around the opening.
  const inner: number[] = [-0.025, -0.04, 0], idx: number[] = [];
  const lip: T.Vector3[] = [];
  for (let i = 0; i <= 64; i++) {
    const p = rimPoint(i / 64 * TAU); inner.push(p.x - 0.008, p.y, p.z); lip.push(p);
    if(i < 64)idx.push(0,i+1,i+2);
  }
  const cavity = new T.BufferGeometry(); cavity.setAttribute('position', new T.Float32BufferAttribute(inner,3)); cavity.setIndex(idx); cavity.computeVertexNormals();
  g.add(new T.Mesh(cavity,new T.MeshStandardMaterial({color:'#150c0d',roughness:0.86,side:T.DoubleSide})));
  g.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(lip,false),96,0.014,8,false),skin));
  const teeth: T.BufferGeometry[] = [];
  for (let side = 0; side < 2; side++) for (let i = 0; i < 21; i++) {
    const a = side * Math.PI + 0.16 + i / 20 * (Math.PI - 0.32);
    const p = rimPoint(a); p.x -= 0.008; p.z *= 0.96;
    teeth.push(toothGeometry(p,0.075+Math.abs(Math.sin(i*2.37+side))*0.125,side===0));
  }
  const teethGeo=mergeGeometries(teeth)!; teeth.forEach(t=>t.dispose());
  const toothMesh=new T.Mesh(teethGeo,new T.MeshStandardMaterial({color:'#c3b9a0',roughness:0.38})); toothMesh.name='needle-teeth';g.add(toothMesh);
  for (const side of [-1,1]) {
    const eye=new T.Mesh(new T.SphereGeometry(0.023,24,16),new T.MeshPhysicalMaterial({color:'#080b0b',roughness:0.16,clearcoat:1}));
    eye.name='small-eye';eye.scale.z=0.48;eye.position.set(0.25,0.18,side*0.293);g.add(eye);
    const crease=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3([
      new T.Vector3(-0.08,0.11,side*0.29),new T.Vector3(-0.13,-0.01,side*0.30),new T.Vector3(-0.09,-0.16,side*0.25)
    ]),20,0.007,5),new T.MeshStandardMaterial({color:'#241f1b',roughness:0.8}));g.add(crease);
  }
  const finM=new T.MeshStandardMaterial({color:'#62584b',roughness:0.6,transparent:true,opacity:0.78,side:T.DoubleSide,depthWrite:false});
  const tail=fin([new T.Vector3(-0.06,0.08,0),new T.Vector3(-0.23,0.18,0),new T.Vector3(-0.31,0,0.025),new T.Vector3(-0.23,-0.15,0),new T.Vector3(-0.05,-0.055,0)],finM);
  tail.position.set(-0.74,0.01,0);g.add(tail);
  const paired:T.Group[]=[];
  for (const side of [-1,1]) {
    const f=fin([new T.Vector3(-0.02,0.055,side*0.03),new T.Vector3(-0.20,0.075,side*0.13),new T.Vector3(-0.31,-0.08,side*0.16),new T.Vector3(-0.12,-0.11,side*0.10)],finM);
    f.position.set(-0.15,-0.10,side*0.22);g.add(f);paired.push(f);
  }
  const dorsal=fin([new T.Vector3(-0.02,0.05,0),new T.Vector3(-0.17,0.15,0),new T.Vector3(-0.26,0.03,0)],finM);
  dorsal.position.set(-0.39,0.16,0);g.add(dorsal);
  const stalk=new T.CatmullRomCurve3([new T.Vector3(0.08,0.34,0),new T.Vector3(0.14,0.70,0),new T.Vector3(0.45,0.76,0.015),new T.Vector3(0.64,0.51,0.02)]);
  g.add(new T.Mesh(new T.TubeGeometry(stalk,40,0.007,8),skin));
  const bulb=new T.Mesh(new T.SphereGeometry(0.027,24,16),new T.MeshStandardMaterial({color:'#dfe8c9',emissive:'#cee5b7',emissiveIntensity:1.1,roughness:0.4}));
  bulb.position.copy(stalk.getPoint(1));g.add(bulb);
  const halo=new T.Sprite(new T.SpriteMaterial({map:glowMap,color:'#d5e8b8',transparent:true,opacity:0.55,blending:T.AdditiveBlending,depthWrite:false}));
  halo.position.copy(bulb.position);halo.scale.setScalar(0.19);g.add(halo);
  const light=new T.PointLight('#d7e7bd',0.45,1.4,2);light.position.copy(bulb.position);g.add(light);
  g.userData.update=(t:number)=>{tail.rotation.y=Math.sin(t*1.8)*0.13;paired.forEach((f,i)=>f.rotation.x=Math.sin(t*1.5+i*2)*0.10);halo.scale.setScalar(0.19+Math.sin(t*1.2)*0.012);};
  return g;
}
