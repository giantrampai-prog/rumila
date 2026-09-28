import * as T from "three";
import { COAST_GLSL } from "./terrain-math";

export type KeepTexture = (texture: T.Texture) => void;
export function siteTexture(name: string, keep: KeepTexture, repeat = false) {
  const t = new T.TextureLoader().load(`/roket/textures/${name}.webp`);
  t.colorSpace = T.SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) t.wrapS = t.wrapT = T.RepeatWrapping;
  keep(t);
  return t;
}

export const NOISE_GLSL = `
  float rh(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
  float rn(vec2 p){vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
    return mix(mix(rh(i),rh(i+vec2(1,0)),f.x),mix(rh(i+vec2(0,1)),rh(i+vec2(1,1)),f.x),f.y);}
  float rf(vec2 p){return rn(p)*0.57+rn(p*2.03)*0.28+rn(p*4.11)*0.15;}
`;

/** Albedo at three scales avoids the tiled lawn effect; beach receives its own mineral microdetail. */
export function terrainMaterial(keep: KeepTexture) {
  const m = new T.MeshStandardMaterial({ vertexColors: true, map: siteTexture("grass-albedo", keep, true), roughness: 0.95 });
  m.onBeforeCompile = (s) => {
    s.vertexShader = s.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vSite;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvSite = position;");
    s.fragmentShader = s.fragmentShader.replace("#include <common>", `#include <common>\nvarying vec3 vSite;\n${NOISE_GLSL}\n${COAST_GLSL}`)
      .replace("#include <map_fragment>", `
        vec2 p = vSite.xz;
        float shore = p.x - coast(p.y);
        float grass = 1.0-smoothstep(-3.8,-2.0,shore);
        vec3 fine = texture2D(map, p * 0.75).rgb;
        vec3 broad = texture2D(map, mat2(0.8,-0.6,0.6,0.8)*p*0.173+0.37).rgb;
        vec3 albedo = mix(fine, broad, 0.3) * 2.8;
        float macro = mix(0.72,1.22,rf(p*0.24));
        diffuseColor.rgb *= mix(vec3(0.84+rn(p*36.0)*0.2),albedo*macro,grass);
      `)
      .replace("#include <normal_fragment_maps>", `#include <normal_fragment_maps>
        float detailFade = 1.0-smoothstep(18.0,70.0,length(vViewPosition));
        float grain = rn(vSite.xz*80.0)*0.0035;
        vec3 qx=dFdx(vViewPosition), qy=dFdy(vViewPosition);
        vec3 bump = cross(qy,normal)*dFdx(grain)+cross(normal,qx)*dFdy(grain);
        normal = normalize(normal-bump*detailFade/max(abs(dot(qx,cross(qy,normal))),0.00001));
      `);
  };
  m.customProgramCacheKey = () => "rocket-terrain-v2";
  return m;
}

/** Fine surface relief on concrete / metal. It stays subtle at the metre scale of the scene. */
export function weathered(color: T.ColorRepresentation, kind: "concrete" | "metal" | "rock" = "concrete") {
  const m = new T.MeshStandardMaterial({ color, roughness: kind === "metal" ? 0.4 : 0.92, metalness: kind === "metal" ? 0.72 : 0 });
  m.onBeforeCompile = (s) => {
    s.vertexShader = s.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vSurface;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvSurface=position;");
    s.fragmentShader = s.fragmentShader.replace("#include <common>", `#include <common>\nvarying vec3 vSurface;\n${NOISE_GLSL}`)
      .replace("#include <color_fragment>", `#include <color_fragment>
        float pat=rf(vSurface.xz*${kind === "metal" ? "85.0" : "8.0"}+vSurface.y*3.1);
        diffuseColor.rgb *= ${kind === "metal" ? "0.92+pat*0.14" : "0.75+pat*0.38"};`)
      .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\nroughnessFactor=clamp(roughnessFactor+(pat-0.5)*0.14,0.15,1.0);");
  };
  m.customProgramCacheKey = () => `rocket-weathered-${kind}`;
  return m;
}
