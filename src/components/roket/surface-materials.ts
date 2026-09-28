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
    s.vertexShader = s.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vSite;\nvarying vec3 vSiteNormal;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvSite = position;\nvSiteNormal = objectNormal;");
    s.fragmentShader = s.fragmentShader.replace("#include <common>", `#include <common>\nvarying vec3 vSite;\nvarying vec3 vSiteNormal;\n${NOISE_GLSL}\n${COAST_GLSL}`)
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
      .replace("#include <color_fragment>", `#include <color_fragment>
        // Preserve distant forest crowns and slope shading from the mountain update.
        {
          float distanceToSurface = length(vViewPosition);
          float forest = grass * smoothstep(22.0,40.0,length(p));
          float nearCrown = rn(p*0.9)*0.6+rn(p*2.3)*0.4;
          float farCrown = rn(p*0.16)*0.55+rn(p*0.45)*0.45;
          float crown = mix(nearCrown,farCrown,smoothstep(40.0,140.0,distanceToSurface));
          float forestPatch = rn(p*0.025)*0.6+rn(p*0.06)*0.4;
          float amplitude = mix(0.62,0.9,smoothstep(60.0,250.0,distanceToSurface));
          diffuseColor.rgb *= mix(1.0,1.0-amplitude*0.62+amplitude*1.24*(crown-0.5)+amplitude*0.3,forest);
          diffuseColor.rgb *= mix(vec3(1.0),vec3(0.78,1.04,0.86),forest*smoothstep(0.35,0.75,forestPatch));
          diffuseColor.rgb *= mix(vec3(1.0),vec3(1.12,1.08,0.9),forest*(1.0-smoothstep(0.25,0.55,forestPatch))*0.6);
          diffuseColor.rgb *= mix(1.0,0.8+0.25*clamp(normalize(vSiteNormal).y,0.0,1.0),forest);
        }
      `)
      .replace("#include <normal_fragment_maps>", `#include <normal_fragment_maps>
        float detailFade = 1.0-smoothstep(18.0,70.0,length(vViewPosition));
        float grain = rn(vSite.xz*80.0)*0.0035;
        vec3 qx=dFdx(vViewPosition), qy=dFdy(vViewPosition);
        vec3 bump = cross(qy,normal)*dFdx(grain)+cross(normal,qx)*dFdy(grain);
        normal = normalize(normal-bump*detailFade/max(abs(dot(qx,cross(qy,normal))),0.00001));
      `);
  };
  m.customProgramCacheKey = () => "rocket-terrain-v3";
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
