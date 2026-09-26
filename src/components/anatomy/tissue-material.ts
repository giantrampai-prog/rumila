// Material jaringan realistis: MeshPhysicalMaterial + detail permukaan prosedural di shader.
// Pola dihitung dari posisi objek (noise 3D), jadi tidak butuh UV/tekstur dan tetap tajam saat didekati:
// variasi warna (bercak, urat, lemak), serat otot/saraf, lekuk otak, lobulus organ, pori kulit/tulang.
// Lapisan basah (clearcoat) sengaja halus di atas tonjolan — seperti jaringan segar.
import * as THREE from 'three';
import type { TissueDetail, TissueLook } from '@/lib/anatomy/materials';

/** Tingkat kualitas global (lihat perf.ts): 2 = penuh, 1 = pola 2 oktaf tanpa sheen, 0 = tanpa pola/clearcoat/sheen. */
let QUALITY: 0 | 1 | 2 = 2;

const MODE: Record<TissueDetail, number> = { none: 0, smooth: 1, skin: 2, muscle: 3, organ: 4, lobule: 5, bone: 6, vessel: 7, nerve: 8, brain: 9, lung: 10 };

// Simplex noise 3D (Ian McEwan, Ashima Arts — MIT)
const NOISE = /* glsl */ `
vec3 tm289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 tm289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 tperm(vec4 x){return tm289(((x*34.0)+1.0)*x);}
vec4 ttis(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float tsnoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=tm289(i);
  vec4 p=tperm(tperm(tperm(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=ttis(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float tfbm(vec3 p){float a=0.5,s=0.0;for(int i=0;i<TISSUE_OCT;i++){s+=a*tsnoise(p);p*=2.03;a*=0.5;}return s;}
float tridge(vec3 p){float a=0.5,s=0.0;for(int i=0;i<TISSUE_OCT-1;i++){s+=a*(1.0-abs(tsnoise(p)));p*=2.1;a*=0.5;}return s;}

// Keluaran: tone (-1..1 kecerahan), mixT (0..1 campuran warna tint), h (tinggi tonjolan 0..1)
void tissuePattern(vec3 p, out float tone, out float mixT, out float h){
  tone=0.0; mixT=0.0; h=0.0;
  #if TISSUE_MODE == 1
    float n=tfbm(p*0.35); tone=n*0.35; h=0.5+0.5*tsnoise(p*1.5)*0.3;
  #elif TISSUE_MODE == 2
    float low=tfbm(p*0.08); float pore=tsnoise(p*3.2);
    tone=low*0.45; mixT=smoothstep(0.1,0.7,low)*0.35; h=0.55+0.25*low-0.35*smoothstep(0.55,0.95,pore);
  #elif TISSUE_MODE == 3
    vec3 q=vec3(p.x,p.y*0.14,p.z); float f=tfbm(q*1.2); float band=tsnoise(vec3(p.x*0.05,p.y*0.02,p.z*0.05));
    tone=f*0.55; mixT=smoothstep(0.25,0.9,band)*0.55; h=0.5+0.5*f;
  #elif TISSUE_MODE == 4
    float low=tfbm(p*0.12); float fine=tsnoise(p*1.8);
    tone=low*0.4+fine*0.04; mixT=smoothstep(0.0,0.8,low)*0.4; h=0.5+0.25*low+0.06*fine;
  #elif TISSUE_MODE == 5
    float r=tridge(p*0.9); float low=tfbm(p*0.1);
    tone=(r-0.6)*0.6+low*0.2; mixT=smoothstep(0.66,0.92,r)*0.45; h=0.5+0.5*(r-0.5);
  #elif TISSUE_MODE == 6
    float low=tfbm(p*0.1); float pore=tsnoise(p*2.6);
    tone=low*0.35-smoothstep(0.6,1.0,pore)*0.25; mixT=smoothstep(0.1,0.8,low)*0.45; h=0.6+0.2*low-0.3*smoothstep(0.55,1.0,pore);
  #elif TISSUE_MODE == 7
    vec3 q=vec3(p.x*0.35,p.y,p.z*0.35); float vein=1.0-abs(tsnoise(q*0.5)); float low=tfbm(p*0.2);
    tone=low*0.25; mixT=smoothstep(0.93,0.99,vein)*0.9; h=0.5+0.2*low;
  #elif TISSUE_MODE == 8
    vec3 q=vec3(p.x,p.y*0.08,p.z); float f=tfbm(q*1.4);
    tone=f*0.6; mixT=smoothstep(0.2,0.8,f)*0.5; h=0.5+0.5*f;
  #elif TISSUE_MODE == 9
    float g=tridge(p*0.9); float low=tfbm(p*0.3);
    tone=(g-0.55)*1.1+low*0.15; mixT=1.0-smoothstep(0.35,0.62,g); h=g;
  #elif TISSUE_MODE == 10
    float cell=tridge(p*1.1); float low=tfbm(p*0.12);
    tone=low*0.35+(cell-0.6)*0.5; mixT=smoothstep(0.66,0.92,cell)*0.55+smoothstep(0.3,0.9,low)*0.25; h=cell;
  #endif
}
`;

export function createTissueMaterial(look: TissueLook): THREE.MeshPhysicalMaterial {
  const glassy = look.transmission > 0;
  const mat = new THREE.MeshPhysicalMaterial({
    color: look.color,
    roughness: look.roughness,
    metalness: 0,
    clearcoat: look.wet,
    clearcoatRoughness: glassy ? 0.02 : 0.18 + (1 - look.wet) * 0.3,
    sheen: look.sheen,
    sheenColor: new THREE.Color(look.sheenColor ?? '#ffffff'),
    sheenRoughness: 0.55,
    specularIntensity: glassy ? 1 : 0.6,
    ior: glassy ? 1.38 : 1.4,
    envMapIntensity: glassy ? 0.9 : 0.35,
    side: THREE.DoubleSide,
  });
  const mode = look.detailStrength > 0 ? MODE[look.detail] : 0;
  if (!mode) return mat;
  const uniforms = {
    // frekuensi pola per satuan objek; dikalikan skala dunia mesh lewat setTissueUnit() agar seragam per meter
    uTissueScale: { value: look.detailScale },
    uTissueStrength: { value: look.detailStrength },
    uTissueTint: { value: new THREE.Color(look.tint ?? look.color) },
    // tinggi tonjolan dalam meter (ruang pandang)
    uTissueBump: { value: (look.detailStrength * 1.2) / look.detailScale },
  };
  mat.userData.tissue = { uniforms, detailScale: look.detailScale, look };
  applyQualityProps(mat, look);
  mat.onBeforeCompile = (shader) => {
    if (QUALITY === 0) return; // hemat: material fisik biasa tanpa pola
    shader.defines = { ...(shader.defines ?? {}), TISSUE_MODE: mode, TISSUE_OCT: QUALITY === 2 ? 4 : 2 };
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vTissuePos;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvTissuePos = position;');
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>\nvarying vec3 vTissuePos;\nuniform float uTissueScale;\nuniform float uTissueStrength;\nuniform float uTissueBump;\nuniform vec3 uTissueTint;\n${NOISE}\nfloat tTone; float tMix; float tH;`,
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        tissuePattern(vTissuePos * uTissueScale * 0.1, tTone, tMix, tH);
        diffuseColor.rgb = mix(diffuseColor.rgb, uTissueTint, clamp(tMix * uTissueStrength, 0.0, 1.0));
        diffuseColor.rgb *= 1.0 + tTone * 0.32 * uTissueStrength;`,
      )
      .replace(
        '#include <normal_fragment_maps>',
        `#include <normal_fragment_maps>
        {
          // bump dari pola (turunan layar), rumus perturbNormalArb three.js
          vec3 sp = -vViewPosition; vec3 dx = dFdx(sp); vec3 dy = dFdy(sp);
          vec2 dH = vec2(dFdx(tH), dFdy(tH)) * uTissueBump;
          vec3 r1 = cross(dy, normal); vec3 r2 = cross(normal, dx); float det = dot(dx, r1);
          vec3 grad = sign(det) * (dH.x * r1 + dH.y * r2);
          normal = normalize(abs(det) * normal - grad);
        }`,
      );
  };
  mat.customProgramCacheKey = () => `tissue-${mode}-${QUALITY}`;
  return mat;
}

/** Samakan kepadatan pola dengan ukuran nyata: `metersPerUnit` = skala dunia mesh (satuan objek → meter). */
export function setTissueUnit(mat: THREE.Material, metersPerUnit: number) {
  const t = mat.userData.tissue as { uniforms: { uTissueScale: { value: number } }; detailScale: number } | undefined;
  if (t && Number.isFinite(metersPerUnit) && metersPerUnit > 0) t.uniforms.uTissueScale.value = t.detailScale * metersPerUnit;
}

function applyQualityProps(mat: THREE.MeshPhysicalMaterial, look: TissueLook) {
  const glassy = look.transmission > 0;
  mat.clearcoat = QUALITY === 0 && !glassy ? 0 : look.wet;
  mat.sheen = QUALITY === 2 ? look.sheen : 0;
}

/** Ganti tingkat kualitas semua material jaringan (memicu kompilasi ulang program). */
export function setTissueQuality(q: 0 | 1 | 2, materials: Iterable<THREE.Material>) {
  QUALITY = q;
  for (const m of materials) {
    const t = m.userData.tissue as { look: TissueLook } | undefined;
    if (!t || !(m instanceof THREE.MeshPhysicalMaterial)) continue;
    applyQualityProps(m, t.look);
    m.needsUpdate = true;
  }
}

/** Setel kualitas awal sebelum material dibuat. */
export const initTissueQuality = (q: 0 | 1 | 2) => {
  QUALITY = q;
};
