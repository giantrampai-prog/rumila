import * as T from 'three';
import { surfaceGrid } from './organic-geometry';

export const SEAGRASS_PUSHERS=16;
export function leafGeometry() {
  // Root at y=0; cupped cross-section, arched blade and a rounded, narrowing tip.
  return surfaceGrid((u,v)=>{
    const edge=v*2-1;
    const tip=Math.sqrt(Math.max(.0001,1-Math.pow(u,12)));
    return new T.Vector3(edge*.028*(.55+.45*Math.sin(u*Math.PI))*tip+.17*u*u,
      u-.14*u*u*u, .011*edge*edge*Math.sin(u*Math.PI)+.10*u*u*u);
  },14,3);
}

/** Clustered shoots, soft bending and vein detail in one draw call. No image billboards. */
export function seagrass(count:number,radius:number,time:{value:number},seed=3) {
  let state=seed>>>0;
  const random=()=>((state=(Math.imul(state,1664525)+1013904223)>>>0)/4294967296);
  const blade=leafGeometry();
  const push=Array.from({length:SEAGRASS_PUSHERS},()=>new T.Vector4(0,-9999,0,0));
  const mat=new T.MeshStandardMaterial({color:'#ffffff',roughness:.7,side:T.DoubleSide});
  mat.onBeforeCompile=s=>{
    s.uniforms.uGrassTime=time;s.uniforms.uGrassPush={value:push};
    s.vertexShader=s.vertexShader.replace('#include <common>',`#include <common>
      uniform float uGrassTime;uniform vec4 uGrassPush[${SEAGRASS_PUSHERS}];varying vec2 leafUv;`)
      .replace('#include <begin_vertex>',`#include <begin_vertex>
        leafUv=uv;
        float phase=instanceMatrix[3].x*.55+instanceMatrix[3].z*.37;
        float h=uv.y;float bend=h*h;
        transformed.x+=(sin(uGrassTime*.85+phase)*.075+sin(uGrassTime*1.25+phase*2.)*.023)*bend;
        transformed.z+=cos(uGrassTime*.65+phase)*.045*bend;
      `).replace('#include <project_vertex>',`vec4 mvPosition=instanceMatrix*vec4(transformed,1.);
        vec4 wpos=modelMatrix*mvPosition;
        vec3 root=(modelMatrix*instanceMatrix*vec4(0.,0.,0.,1.)).xyz;
        float topY=(modelMatrix*instanceMatrix*vec4(0.,.86,0.,1.)).y;
        vec3 shove=vec3(0.);
        for(int i=0;i<${SEAGRASS_PUSHERS};i++) {
          vec4 p=uGrassPush[i];if(p.w<=0.)continue;
          vec2 d=root.xz-p.xz;float dist=length(d);
          float k=1.-smoothstep(p.w*.2,p.w*1.15,dist);
          k*=smoothstep(p.y-p.w-.2,p.y-p.w*.2,topY);
          vec2 dir=dist>.0001?d/dist:vec2(1.,0.);
          shove.xz+=dir*k*p.w*.6;shove.y-=k*p.w*.3;
        }
        float sl=length(shove);if(sl>.65)shove*=.65/sl;
        wpos.xyz+=shove*bend;mvPosition=viewMatrix*wpos;gl_Position=projectionMatrix*mvPosition;`);
    s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying vec2 leafUv;')
      .replace('#include <color_fragment>',`#include <color_fragment>
        float midrib=exp(-pow((leafUv.x-.5)*48.,2.));
        float veins=pow(.5+.5*cos(leafUv.x*65.),7.);
        float mottled=.5+.5*sin(leafUv.y*47.+sin(leafUv.x*8.)*4.);
        vec3 rootColor=vec3(.18,.15,.052), bladeColor=vec3(.12,.24,.047);
        vec3 tissue=mix(rootColor,bladeColor,smoothstep(0.,.18,leafUv.y));
        tissue*=.86+.12*mottled+.10*midrib+.06*veins;
        tissue=mix(tissue,tissue*vec3(1.12,.97,.72),smoothstep(.84,1.,leafUv.y)*.28);
        diffuseColor.rgb*=tissue;
      `).replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
        normal=normalize(normal+vec3(sin(leafUv.x*65.)*.035,0.,0.));`);
  };
  mat.customProgramCacheKey=()=> 'seagrass-curved-shoots-v1';
  const grass=new T.InstancedMesh(blade,mat,count),dummy=new T.Object3D(),color=new T.Color();
  let cx=0,cz=0,height=1,phase=0;
  for(let i=0;i<count;i++) {
    // Nine leaves emerge from each small shoot; larger patches have uneven sandy openings.
    if(i%9===0){const a=random()*Math.PI*2,rr=Math.sqrt(random())*radius;cx=Math.cos(a)*rr;cz=Math.sin(a)*rr;height=.53+random()*.70;phase=random()*Math.PI*2;}
    const a=phase+(i%9)*2.399;
    dummy.position.set(cx+Math.cos(a)*.047,0,cz+Math.sin(a)*.047);
    dummy.rotation.set((random()-.5)*.22,a,(random()-.5)*.28);
    dummy.scale.set(.65+random()*.65,height*(.65+random()*.55),1);
    dummy.updateMatrix();grass.setMatrixAt(i,dummy.matrix);
    color.setRGB(.78+random()*.30,.83+random()*.20,.68+random()*.23);grass.setColorAt(i,color);
  }
  grass.computeBoundingSphere();
  // Include the largest current/interaction displacement in CPU culling bounds.
  if(grass.boundingSphere)grass.boundingSphere.radius+=1;
  grass.userData.push=push;grass.userData.blades=count;return grass;
}
