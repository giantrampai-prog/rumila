import * as T from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

let coralTexture: T.Texture | null = null;

/** Small fixed-size textures; geometry provides silhouette, microrelief provides close-up detail. */
export function surfaceMaterial(color: T.ColorRepresentation, kind: 'sand' | 'rock' | 'coral' | 'metal' = 'rock') {
  const m = new T.MeshStandardMaterial({ color, roughness: kind === 'metal' ? 0.37 : 0.87, metalness: kind === 'metal' ? 0.5 : 0 });
  if (kind === 'coral' && typeof document !== 'undefined') {
    const texture=coralTexture ?? new T.TextureLoader().load('/laut/realism/coral-tissue.webp');
    if(!coralTexture){coralTexture=texture;texture.addEventListener('dispose',()=>{if(coralTexture===texture)coralTexture=null;});}
    texture.colorSpace=T.SRGBColorSpace;texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(2,2);texture.anisotropy=8;
    m.map=texture;m.bumpMap=texture;m.bumpScale=0.008;
  }
  m.onBeforeCompile = s => {
    s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vDetail;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvDetail = position;');
    s.fragmentShader = s.fragmentShader.replace('#include <common>', `#include <common>
      varying vec3 vDetail;
      float grain(vec3 p){ return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
      float noise3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
        return mix(mix(mix(grain(i),grain(i+vec3(1,0,0)),f.x),mix(grain(i+vec3(0,1,0)),grain(i+vec3(1,1,0)),f.x),f.y),
          mix(mix(grain(i+vec3(0,0,1)),grain(i+vec3(1,0,1)),f.x),mix(grain(i+vec3(0,1,1)),grain(i+vec3(1,1,1)),f.x),f.y),f.z); }
    `).replace('#include <color_fragment>', `#include <color_fragment>
      float n=noise3(vDetail*${kind === 'coral' ? '58.0' : '22.0'});
      float broad=noise3(vDetail*3.1);
      diffuseColor.rgb *= 0.79 + broad*0.24 + n*0.15;
    `).replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
      // Derivative bump in screen space, stable as the camera approaches the surface.
      vec3 q0=dFdx(vViewPosition),q1=dFdy(vViewPosition);
      vec3 r1=cross(q1,normal),r2=cross(normal,q0);
      float det=dot(q0,r1);
      vec3 grad=sign(det)*(dFdx(n)*r1+dFdy(n)*r2);
      if(abs(det)>0.00000001) normal=normalize(abs(det)*normal-${kind === 'coral' ? '0.002' : '0.003'}*grad);
    `);
  };
  m.customProgramCacheKey = () => `sea-relief-${kind}-v2`;
  return m;
}

/** Merge a static specimen; avoids one draw call for each coral branch and rounded tip. */
export function mergeSpecimen(group: T.Group) {
  const byMaterial = new Map<T.Material, T.BufferGeometry[]>();
  group.updateMatrixWorld(true);
  group.traverse(o => {
    if (!(o instanceof T.Mesh) || Array.isArray(o.material)) return;
    const geo = o.geometry.clone().applyMatrix4(o.matrixWorld);
    const geometries = byMaterial.get(o.material) ?? [];
    geometries.push(geo.index ? geo.toNonIndexed() : geo);
    if (geo.index) geo.dispose();
    byMaterial.set(o.material, geometries);
  });
  const out = new T.Group();
  for (const [m, geometries] of byMaterial) {
    const merged = mergeGeometries(geometries);
    geometries.forEach(g => g.dispose());
    if (merged) { const mesh = new T.Mesh(merged, m); mesh.castShadow = mesh.receiveShadow = true; out.add(mesh); }
  }
  group.traverse(o => { if (o instanceof T.Mesh) o.geometry.dispose(); });
  return out;
}

export function reefGeometry(radius: number, seed = 1) {
  const g = new T.SphereGeometry(radius, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2);
  const p = g.attributes.position;
  const c = new T.Color(), colors: number[] = [];
  for (let i = 0; i < p.count; i++) {
    const x=p.getX(i),y=p.getY(i),z=p.getZ(i);
    const a=Math.atan2(z,x), e=Math.acos(Math.min(1,y/radius));
    const folds=Math.sin(a*20+Math.sin(e*12+seed)*2.4);
    const k=1+folds*0.045+Math.sin(x*18+z*12)*0.014;
    p.setXYZ(i,x*k,y*k,z*k);
    c.setScalar(0.8+folds*0.16); colors.push(c.r,c.g,c.b);
  }
  g.setAttribute('color',new T.Float32BufferAttribute(colors,3)); g.computeVertexNormals();
  return g;
}
