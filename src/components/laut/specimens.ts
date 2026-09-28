import * as T from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { organicTube, path, surfaceGrid } from './organic-geometry';

type Clock = { value: number };
const TAU = Math.PI * 2;
const speckle = `
float hash31(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
float cells(vec3 p){vec3 i=floor(p),f=fract(p);vec3 center=.22+.56*vec3(hash31(i),hash31(i+7.),hash31(i+13.));return (1.-smoothstep(.08,.25,length(f-center))) * step(.30,hash31(i));}
float tissueNoise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(mix(hash31(i),hash31(i+vec3(1,0,0)),f.x),mix(hash31(i+vec3(0,1,0)),hash31(i+vec3(1,1,0)),f.x),f.y),
mix(mix(hash31(i+vec3(0,0,1)),hash31(i+vec3(1,0,1)),f.x),mix(hash31(i+vec3(0,1,1)),hash31(i+vec3(1,1,1)),f.x),f.y),f.z);}
`;

/** Local-position skin keeps pigmentation attached to the animal rather than tiled rectangular UVs. */
function skin(kind: 'squid' | 'lionfish' | 'seahorse', clock: Clock) {
  const m=new T.MeshPhysicalMaterial({color:'#ffffff',roughness:kind==='squid'?.38:.55,metalness:0,clearcoat:kind==='squid'?.35:.08,clearcoatRoughness:.3});
  m.onBeforeCompile=s=>{
    s.uniforms.uBioTime=clock;
    s.vertexShader=s.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vSpecimen; varying vec2 vSpecimenUv;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvSpecimen=position; vSpecimenUv=uv;');
    s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>\nvarying vec3 vSpecimen; varying vec2 vSpecimenUv; uniform float uBioTime;\n${speckle}`)
      .replace('#include <color_fragment>',`#include <color_fragment>
        ${kind==='squid'?`
          float dorsal=smoothstep(-.12,.1,vSpecimen.y);
          float flecks=cells(vSpecimen*185.0)+.4*cells(vSpecimen*380.0);
          float patches=.5+.5*sin(vSpecimen.x*17.0+sin(vSpecimen.z*31.0)*2.0);
          vec3 pearl=mix(vec3(.65,.49,.35),vec3(.32,.115,.043),dorsal*.8);
          vec3 pigment=mix(vec3(.22,.063,.029),vec3(.43,.16,.065),patches);
          diffuseColor.rgb *= mix(pearl,pigment,clamp(flecks*(.6+.23*dorsal),0.,.84));
        `:kind==='lionfish'?`
          float bands=.5+.5*sin(vSpecimen.x*100.0+sin(vSpecimen.y*40.0)*1.8+vSpecimen.z*14.0);
          vec3 pigment=mix(vec3(.19,.065,.025),vec3(.82,.70,.50),smoothstep(.34,.48,bands));
          diffuseColor.rgb *= pigment*(.87+.13*hash31(floor(vSpecimen*600.0)));
        `:`
          float rings=pow(.5+.5*cos(vSpecimenUv.y*170.0),8.0);
          float patches=tissueNoise(vSpecimen*55.0)*.65+tissueNoise(vSpecimen*150.0)*.35;
          diffuseColor.rgb *= mix(vec3(.08,.044,.012),vec3(.31,.18,.055),.15+patches*.65+rings*.2);
        `}
      `);
  };
  m.customProgramCacheKey=()=>`organic-skin-${kind}-v1`;return m;
}

function eye(g:T.Group,x:number,y:number,z:number,r:number) {
  const iris=new T.MeshStandardMaterial({color:'#858575',roughness:.23,metalness:.25});
  const pupil=new T.MeshPhysicalMaterial({color:'#03090d',roughness:.1,clearcoat:1,clearcoatRoughness:.08});
  for(const side of [-1,1]) {
    const e=new T.Mesh(new T.SphereGeometry(r,32,20),iris);e.scale.z=.48;e.position.set(x,y,side*z);g.add(e);
    const p=new T.Mesh(new T.SphereGeometry(r*.76,32,20),pupil);p.scale.z=.26;p.position.set(x+r*.035,y,side*(z+r*.39));g.add(p);
  }
}

function merged(parts:T.BufferGeometry[],mat:T.Material,name:string) {
  const geometry=mergeGeometries(parts); parts.forEach(g=>g.dispose());
  const mesh=new T.Mesh(geometry,mat);mesh.name=name;return mesh;
}

/** Skin and suckers share the same travelling bend, with an immobile attachment at x=0. */
function flexArm<M extends T.MeshStandardMaterial>(source:M,clock:Clock) {
  const material=source.clone();
  const compile=source.onBeforeCompile.bind(source);
  material.onBeforeCompile=(s,renderer)=>{
    compile(s,renderer);s.uniforms.uArmTime=clock;
    s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nuniform float uArmTime;')
      .replace('#include <begin_vertex>',`#include <begin_vertex>
        float reach=max(0.,position.x);
        transformed.y+=sin(reach*7.-uArmTime*1.7)*reach*reach*.047;
        transformed.z+=sin(reach*5.-uArmTime*1.2+1.)*reach*reach*.038;`);
  };
  material.customProgramCacheKey=()=>`${source.customProgramCacheKey()}-flex-v1`;
  return material;
}

/** Eight tapered arms plus two longer feeding tentacles; suckers face toward the arm crown. */
export function createSquid(clock:Clock, glowing=false) {
  const g=new T.Group();g.name='cumi-natural';
  const bodyMat=skin('squid',clock);
  if(glowing){bodyMat.emissive.set('#4b170e');bodyMat.emissiveIntensity=.12;}
  const mantle=new T.Mesh(organicTube(path([[-1.46,0,0],[-1.14,.025,0],[-.74,.025,0],[-.30,.005,0],[.015,0,0]]),u=>.006+.145*Math.pow(Math.sin(Math.PI*u*.57),.72),64,40),bodyMat);
  mantle.name='mantel-meruncing';g.add(mantle);
  const head=new T.Mesh(new T.SphereGeometry(1,40,28).scale(.17,.115,.125),bodyMat);head.position.set(.12,-.012,0);g.add(head);
  const collar=new T.Mesh(new T.TorusGeometry(.092,.012,8,40),bodyMat);collar.rotation.y=Math.PI/2;collar.position.x=.012;g.add(collar);
  eye(g,.16,.006,.115,.074);
  const siphon=new T.Mesh(organicTube(path([[.015,-.095,0],[.1,-.16,0],[.22,-.15,0]]),u=>.028-u*.008,24,12),bodyMat);siphon.name='sifon';g.add(siphon);

  const finMat=bodyMat.clone();finMat.side=T.DoubleSide;finMat.transparent=true;finMat.opacity=.83;
  finMat.onBeforeCompile=bodyMat.onBeforeCompile;finMat.customProgramCacheKey=bodyMat.customProgramCacheKey;
  const fins:T.Mesh[]=[];
  for(const side of [-1,1]) {
    const geom=surfaceGrid((u,v)=>{
      const x=-1.39+u*.78, width=Math.pow(Math.sin(Math.PI*u),1.3)*.27;
      return new T.Vector3(x,.008+Math.sin(v*Math.PI)*.032,(.055+v*width)*side);
    },40,10);
    const f=new T.Mesh(geom,finMat);f.name='sirip-mantel';g.add(f);fins.push(f);
    f.userData.rest=new Float32Array(geom.attributes.position.array);
  }
  const cupMat=new T.MeshStandardMaterial({color:'#d6c4a5',roughness:.42,side:T.DoubleSide});
  const armMat=flexArm(bodyMat,clock),flexCups=flexArm(cupMat,clock);
  const arms:T.Group[]=[];
  for(let i=0;i<10;i++) {
    const tentacle=i>=8, a=tentacle ? (i===8?.7:Math.PI+.7) : (i/8)*TAU;
    const length=tentacle?1.18:.57+(i%3)*.055, spread=tentacle?.12:.20;
    const curve=path([[0,0,0],[length*.34,Math.cos(a)*spread*.55,Math.sin(a)*spread*.55],[length*.76,Math.cos(a)*spread,Math.sin(a)*spread],[length,Math.cos(a)*spread*.83,Math.sin(a)*spread*.83]]);
    const radius=(u:number)=>tentacle ? .011*(1-u*.7)+.024*Math.exp(-Math.pow((u-.85)/.105,2)) : .026*Math.pow(1-u,1.2)+.0014;
    const arm=new T.Group();arm.position.set(.245,Math.cos(a)*.055,Math.sin(a)*.068);
    arm.name=tentacle?'tentakel-panjang':'lengan';
    arm.add(new T.Mesh(organicTube(curve,u=>radius(u),40,12),armMat));
    const cups:T.BufferGeometry[]=[];
    for(let j=0;j<(tentacle?9:16);j++) for(const row of [-1,1]) {
      const u=tentacle?.73+j*.023:.12+j*.045;
      const c=curve.getPointAt(u), rr=radius(u), cupR=tentacle?.008:.008*(1-u*.8);
      const inward=new T.Vector3(0,-Math.cos(a),-Math.sin(a));
      c.addScaledVector(inward,rr*.85).add(new T.Vector3(0,-Math.sin(a),Math.cos(a)).multiplyScalar(row*rr*.48));
      const cup=new T.TorusGeometry(cupR,cupR*.26,5,9);
      cup.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,0,1),inward));cup.translate(c.x,c.y,c.z);cups.push(cup);
    }
    arm.add(merged(cups,flexCups,'pengisap'));
    arm.rotation.y=Math.sin(a)*.08;g.add(arm);arms.push(arm);
  }
  g.userData.anatomy={arms:8,feedingTentacles:2};
  g.userData.update=(t:number,ph=0)=>{
    mantle.scale.y=1+Math.sin(t*2.2+ph)*.018;
    for(const [i,arm] of arms.entries()) {
      arm.rotation.y=Math.sin(i*.8)*.08+Math.sin(t*1.7-i*.45+ph)*.075;
      arm.rotation.z=Math.cos(i*.8)*.035+Math.sin(t*1.5-i*.37+ph)*.045;
    }
    for(const [side,f] of fins.entries()) {
      const p=f.geometry.attributes.position as T.BufferAttribute, rest=f.userData.rest as Float32Array;
      for(let i=0;i<p.count;i++) {const x=rest[i*3],z=rest[i*3+2];p.setY(i,rest[i*3+1]+Math.sin(t*3.2+x*8+ph+side*.7)*Math.abs(z)*.2);}
      p.needsUpdate=true;f.geometry.computeVertexNormals();
    }
  };
  return g;
}

/** Dedicated lionfish silhouette: a broad pair of pectoral fans and thirteen separate dorsal spines. */
export function createLionfish(clock:Clock) {
  const g=new T.Group();g.name='lionfish-natural';const m=skin('lionfish',clock);
  const body=new T.Mesh(new T.SphereGeometry(1,48,32).scale(.29,.14,.09),m);g.add(body);
  const snout=new T.Mesh(new T.SphereGeometry(1,24,16).scale(.09,.072,.075),m);snout.position.set(.25,-.025,0);g.add(snout);
  eye(g,.20,.034,.078,.029);
  const mouth=new T.Mesh(new T.TorusGeometry(.035,.005,8,28),m);mouth.rotation.y=Math.PI/2;mouth.position.set(.319,-.035,0);g.add(mouth);
  const membrane=new T.MeshStandardMaterial({color:'#e0cfb5',side:T.DoubleSide,transparent:true,opacity:.7,roughness:.52,depthWrite:false});
  membrane.onBeforeCompile=s=>{
    s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec2 finUV;').replace('#include <begin_vertex>','#include <begin_vertex>\nfinUV=uv;');
    s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying vec2 finUV;').replace('#include <color_fragment>',`#include <color_fragment>
      vec2 tile=fract(finUV*vec2(7.,19.));float dotMark=1.-smoothstep(.10,.24,length(tile-.5));
      float stripes=smoothstep(.64,.72,.5+.5*sin(finUV.x*55.+sin(finUV.y*15.)));
      diffuseColor.rgb*=mix(vec3(.95,.85,.67),vec3(.20,.085,.04),max(dotMark*.8,stripes*.7));
      diffuseColor.a*=1.-.25*finUV.x;`);
  };membrane.customProgramCacheKey=()=> 'lion-fan-v1';
  const fans:T.Group[]=[];
  for(const side of [-1,1]) {
    const root=new T.Vector3(.08,-.018,side*.065);
    const tips=Array.from({length:18},(_,i)=>{const a=i/17*Math.PI;return new T.Vector3(.19-.70*(i/17),-.035+Math.sin(a)*.15,side*(.10+Math.pow(Math.sin(a),.75)*.48));});
    const fan=new T.Group();const rays:T.BufferGeometry[]=[];
    const sample=(u:number,v:number)=>{
      const f=u*17,j=Math.min(16,Math.floor(f));
      return root.clone().lerp(tips[j].clone().lerp(tips[j+1],f-j),v).add(new T.Vector3(0,Math.sin(v*Math.PI)*.035,0));
    };
    fan.add(new T.Mesh(surfaceGrid(sample,68,10),membrane));
    for(const tip of tips) rays.push(organicTube(path([root.toArray(),root.clone().lerp(tip,.55).add(new T.Vector3(0,.025,0)).toArray(),tip.toArray()]),u=>.0038*(1-u)+.0007,18,6));
    fan.add(merged(rays,m,'jari-sirip-dada'));g.add(fan);fans.push(fan);
  }
  const spines:T.BufferGeometry[]=[];
  for(let i=0;i<13;i++) {
    const x=.16-i*.034,h=.22+.20*Math.sin(i/13*Math.PI);
    spines.push(organicTube(path([[x,.08,0],[x-.04,.15+h*.45,0],[x-.085,.13+h,0]]),u=>.007*(1-u)+.0006,20,7));
  }
  for(const side of [-1,1])for(let i=0;i<3;i++)spines.push(organicTube(path([[.17-i*.04,.09,side*.055],[.18-i*.04,.17,side*.09],[.16-i*.04,.21,side*.12]]),u=>.0035*(1-u)+.0005,14,6));
  g.add(merged(spines,m,'duri-punggung-dan-rumbai'));
  const tail=new T.Mesh(surfaceGrid((u,v)=>{
    const a=(u-.5)*Math.PI*.85;return new T.Vector3(-.24-v*.23*Math.cos(a),Math.sin(a)*.15*v,Math.sin(v*Math.PI)*.01);
  },30,8),membrane);g.add(tail);
  g.userData.anatomy={dorsalSpines:13,pectoralFans:2};
  g.userData.update=(t:number)=>{fans[0].rotation.x=Math.sin(t*2.1)*.09;fans[1].rotation.x=-Math.sin(t*2.1+.5)*.09;tail.rotation.y=Math.sin(t*2.4)*.12;};
  return g;
}

export function createSeahorse(clock:Clock) {
  const g=new T.Group();g.name='kuda-laut-natural';const m=skin('seahorse',clock);
  const curve=path([[0,.43,0],[-.045,.30,0],[.025,.15,0],[.035,-.04,0],[-.08,-.20,0],[-.16,-.30,0],[-.11,-.39,0],[.01,-.40,0],[.07,-.33,0],[.04,-.27,0],[-.015,-.27,0],[-.035,-.31,0]]);
  const r=(u:number,a:number)=>{
    const profile=u<.45?.045+.037*Math.sin(u/.45*Math.PI):.037*Math.pow((1-u)/.55,1.3)+.001;
    return profile*(.95+.06*Math.cos(a*7))*(1+.035*Math.cos(u*170));
  };
  g.add(new T.Mesh(organicTube(curve,r,150,20),m));
  const head=new T.Mesh(new T.SphereGeometry(1,28,20).scale(.082,.056,.043),m);head.position.set(.048,.443,0);head.rotation.z=-.27;g.add(head);
  const snout=new T.Mesh(organicTube(path([[.09,.423,0],[.17,.391,0],[.23,.368,0]]),u=>.024-u*.011,28,16),m);g.add(snout);
  eye(g,.075,.46,.038,.018);
  const ridges:T.BufferGeometry[]=[];
  for(let i=0;i<16;i++) {
    const u=i*.026,p=curve.getPointAt(u);ridges.push(organicTube(path([[p.x-.036,p.y,0],[p.x-.076,p.y+.016,0],[p.x-.068,p.y-.011,0]]),v=>.009*(1-v)+.001,10,6));
  }
  for(let i=0;i<4;i++)ridges.push(organicTube(path([[i*.013,.49,0],[i*.013-.014,.53+(i%2)*.015,0]]),u=>.008*(1-u)+.001,8,6));
  g.add(merged(ridges,m,'lempeng-dan-mahkota'));
  const fin=new T.Mesh(surfaceGrid((u,v)=>new T.Vector3(-.06-v*.08*Math.sin(u*Math.PI),.12+u*.19,Math.sin(u*35)*v*.004),24,8),new T.MeshStandardMaterial({color:'#b5a575',side:T.DoubleSide,transparent:true,opacity:.52,roughness:.5}));g.add(fin);
  g.userData.update=(t:number)=>{fin.rotation.y=Math.sin(t*24)*.23;};return g;
}
