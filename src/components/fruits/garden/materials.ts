import * as T from 'three';

type Surface = 'earth' | 'stone' | 'wood' | 'cloth' | 'woven' | 'feather' | 'fur';
const NOISE = `
float gardenHash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
float gardenNoise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
 return mix(mix(mix(gardenHash(i),gardenHash(i+vec3(1,0,0)),f.x),mix(gardenHash(i+vec3(0,1,0)),gardenHash(i+vec3(1,1,0)),f.x),f.y),
 mix(mix(gardenHash(i+vec3(0,0,1)),gardenHash(i+vec3(1,0,1)),f.x),mix(gardenHash(i+vec3(0,1,1)),gardenHash(i+vec3(1,1,1)),f.x),f.y),f.z);}
`;

/** Fine material relief complements the model; fades out before it can shimmer at a distance. */
export function detailed<M extends T.MeshStandardMaterial>(m: M, kind: Surface): M {
  const before = m.onBeforeCompile;
  const key = m.customProgramCacheKey();
  const scale = { earth: 35, stone: 25, wood: 16, cloth: 180, woven: 80, feather: 145, fur: 150 }[kind];
  const relief = { earth: 0.012, stone: 0.01, wood: 0.003, cloth: 0.0008, woven: 0.002, feather: 0.0006, fur: 0.0009 }[kind];
  m.onBeforeCompile = (s, renderer) => {
    before.call(m, s, renderer);
    s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vGardenSurface;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvGardenSurface=position;');
    s.fragmentShader = s.fragmentShader.replace('#include <common>', `#include <common>\nvarying vec3 vGardenSurface;\n${NOISE}`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        vec3 gp=vGardenSurface*${scale.toFixed(1)};
        float gardenFine=gardenNoise(gp);
        ${kind === 'woven' || kind === 'cloth' ? 'gardenFine=0.5+0.25*sin(gp.x*3.14159)+0.25*sin(gp.z*3.14159+gp.y*3.14159);' : ''}
        ${kind === 'fur' ? 'gardenFine=gardenNoise(vec3(gp.x*2.0,gp.y*0.14,gp.z*2.0));' : ''}
        float gardenFade=1.0-smoothstep(7.0,32.0,length(vViewPosition));
        diffuseColor.rgb*=1.0+(gardenFine-0.5)*${kind === 'earth' || kind === 'stone' ? '0.18' : '0.12'}*gardenFade;
      `)
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor=clamp(roughnessFactor+(gardenFine-0.5)*0.12*gardenFade,0.2,1.0);')
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        float gardenHeight=gardenFine*${relief.toFixed(4)};
        vec3 gardenDx=dFdx(-vViewPosition),gardenDy=dFdy(-vViewPosition);
        vec3 gardenR1=cross(gardenDy,normal),gardenR2=cross(normal,gardenDx);
        float gardenDet=dot(gardenDx,gardenR1);
        normal=normalize(max(abs(gardenDet),1e-8)*normal-sign(gardenDet)*(dFdx(gardenHeight)*gardenR1+dFdy(gardenHeight)*gardenR2)*gardenFade);
      `);
  };
  m.customProgramCacheKey = () => `${key}-garden-${kind}-v1`;
  return m;
}

/** Grass texture in world coordinates at two scales, with soil under each planting spot. */
export function groundMaterial(map: T.Texture) {
  const m = detailed(new T.MeshStandardMaterial({ map, vertexColors: true, roughness: 0.96 }), 'earth');
  const before = m.onBeforeCompile;
  m.onBeforeCompile = (s, renderer) => {
    before.call(m, s, renderer);
    s.fragmentShader = s.fragmentShader.replace('#include <map_fragment>', `
      vec2 gardenP=vGardenSurface.xz;
      vec3 gardenNear=texture2D(map,gardenP*0.42).rgb;
      vec3 gardenWide=texture2D(map,mat2(0.8,-0.6,0.6,0.8)*gardenP*0.117+0.37).rgb;
      diffuseColor.rgb*=mix(gardenNear,gardenWide,0.32);
    `);
  };
  m.customProgramCacheKey = () => 'garden-ground-v1';
  return m;
}

/** Curved, tapered blades replace the dark rectangular grass billboards. */
export function grassClump(seed: number) {
  const p: number[] = [], c: number[] = [], ix: number[] = [];
  const col = new T.Color();
  let state = seed >>> 0;
  const random = () => ((state = (1664525 * state + 1013904223) >>> 0) / 4294967296);
  for (let b = 0; b < 9; b++) {
    const angle = random() * Math.PI * 2, h = 0.42 + random() * 0.58, bend = 0.15 + random() * 0.35;
    const x = (random() - 0.5) * 0.6, z = (random() - 0.5) * 0.6, base = p.length / 3;
    for (let j = 0; j <= 3; j++) {
      const t = j / 3, width = (1 - t) * 0.035;
      for (const side of [-1, 1]) {
        p.push(x + Math.cos(angle) * bend * t * t + Math.sin(angle) * width * side, h * t, z + Math.sin(angle) * bend * t * t - Math.cos(angle) * width * side);
        col.set('#8e9c5a').multiplyScalar(0.56 + t * 0.44);
        c.push(col.r, col.g, col.b);
      }
      if (j < 3) { const k = base + j * 2; ix.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
    }
  }
  const g = new T.BufferGeometry();
  g.setAttribute('position', new T.Float32BufferAttribute(p, 3));
  g.setAttribute('color', new T.Float32BufferAttribute(c, 3));
  g.setIndex(ix); g.computeVertexNormals();
  return g;
}

export function riverRock(radius: number, seed: number) {
  const g = new T.SphereGeometry(radius, 20, 14), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const k = 1 + Math.sin(x / radius * 3 + seed) * Math.cos((z * 3 - y * 2) / radius) * 0.12;
    p.setXYZ(i, x * k, y * k, z * k);
  }
  g.computeVertexNormals(); return g;
}
