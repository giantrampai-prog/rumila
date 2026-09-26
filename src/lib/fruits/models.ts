import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { Fruit } from './catalog';
import { applyFruitSkin } from './skin';

// Original parametric educational models. Natural fruit colors are independent
// of the interface theme. No remote model download or renderer per catalogue tile.
const Y = new T.Vector3(0,1,0);
const hash = (x:number) => { const n=Math.sin(x*127.1+311.7)*43758.5453; return n-Math.floor(n); };
const color = (hex:string) => new T.Color(hex);
const material = (hex:string,roughness=.5) => new T.MeshStandardMaterial({color:hex,roughness,metalness:0});
function mesh(g:T.BufferGeometry,m:T.Material,parent:T.Group) { const o=new T.Mesh(g,m);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o; }
function tube(points:T.Vector3[],radius:number,m:T.Material,parent:T.Group,segments=16) {
  return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),segments,radius,6,false),m,parent);
}
function leaf(parent:T.Group,p:T.Vector3,dir:T.Vector3,length:number,width:number,hex='#49762d',base?:string) {
  const positions:number[]=[],colors:number[]=[],indices:number[]=[];
  const c=color(hex),b=color(base??hex);
  for(let i=0;i<=16;i++)for(let j=0;j<=4;j++){
    const u=i/16,v=j/2-1,w=Math.pow(Math.sin(u*Math.PI),.8)*width;
    positions.push(v*w,length*u,Math.sin(u*Math.PI)*length*.23+Math.abs(v)*w*.16);
    const cc=b.clone().lerp(c,u).multiplyScalar(.9+.1*(1-Math.abs(v)));colors.push(cc.r,cc.g,cc.b);
    if(i<16&&j<4){const n=i*5+j;indices.push(n,n+5,n+1,n+1,n+5,n+6);}
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.setIndex(indices);g.computeVertexNormals();
  const o=mesh(g,new T.MeshStandardMaterial({vertexColors:true,side:T.DoubleSide,roughness:.65}),parent);
  o.position.copy(p);o.quaternion.setFromUnitVectors(Y,dir.clone().normalize());return o;
}
function ellipsoid(parent:T.Group,scale:T.Vector3,hex:string,pos=new T.Vector3(),roughness=.45,segments=48) {
  const o=mesh(new T.SphereGeometry(1,segments,32),material(hex,roughness),parent);o.scale.copy(scale);o.position.copy(pos);return o;
}
function pointsOnSurface(count:number,s:T.Vector3,cb:(p:T.Vector3,n:T.Vector3,i:number)=>void) {
  for(let i=0;i<count;i++){
    const y=1-2*(i+.5)/count,a=i*Math.PI*(3-Math.sqrt(5)),r=Math.sqrt(1-y*y);
    const n=new T.Vector3(Math.cos(a)*r,y,Math.sin(a)*r);
    cb(n.clone().multiply(s),n,i);
  }
}
function stem(parent:T.Group,y:number,scale=1) {
  tube([new T.Vector3(0,y,0),new T.Vector3(.035*scale,y+.19*scale,0),new T.Vector3(.10*scale,y+.34*scale,-.04)],.043*scale,material('#6c5030',.85),parent);
}
function calyx(parent:T.Group,y:number,count=5,size=.36,hex='#50743b') {
  for(let i=0;i<count;i++){const a=i/count*Math.PI*2;leaf(parent,new T.Vector3(0,y,0),new T.Vector3(Math.cos(a),-.2,Math.sin(a)),size,size*.3,hex);}
}

export function createFruitModel(f:Fruit):T.Group {
  const root=new T.Group();root.name=`fruit_${f.id}`;
  const shape=f.shape;
  if(shape==='banana'){
    const curve=new T.CatmullRomCurve3([new T.Vector3(-.75,.85,0),new T.Vector3(-.83,.25,0),new T.Vector3(-.42,-.42,0),new T.Vector3(.35,-.68,0),new T.Vector3(.95,-.4,0)]);
    const frames=curve.computeFrenetFrames(100,false),v:number[]=[],idx:number[]=[],cs:number[]=[],uvs:number[]=[];
    for(let i=0;i<=100;i++){const u=i/100,p=curve.getPointAt(u),r=.05+.24*Math.pow(Math.sin(Math.PI*u),.65);
      for(let j=0;j<=24;j++){const a=j/24*Math.PI*2,rr=r*(1+.025*Math.cos(5*a));const pos=p.clone().addScaledVector(frames.normals[i],Math.cos(a)*rr).addScaledVector(frames.binormals[i],Math.sin(a)*rr);v.push(pos.x,pos.y,pos.z);
        const cc=color(u<.025||u>.97?'#655134':f.color).multiplyScalar(.9+.09*Math.cos(5*a)+hash(i*31+j)*.04);cs.push(cc.r,cc.g,cc.b);uvs.push(j/24,u);
        if(i<100&&j<24){const k=i*25+j;idx.push(k,k+1,k+25,k+1,k+26,k+25);}
      }
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(v,3));g.setAttribute('color',new T.Float32BufferAttribute(cs,3));g.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));g.setIndex(idx);g.computeVertexNormals();const body=mesh(g,new T.MeshStandardMaterial({vertexColors:true,roughness:.55}),root);body.userData.fruitSurface=true;
    ellipsoid(root,new T.Vector3(.058,.058,.058),'#655134',curve.getPoint(0));ellipsoid(root,new T.Vector3(.058,.058,.058),'#655134',curve.getPoint(1));
    tube([curve.getPoint(0),new T.Vector3(-.73,1.03,0)],.046,material('#655134',.85),root);root.rotation.z=-.25;
    return normalizeModel(root,f);
  }
  if(shape==='grapes'){
    for(let row=0;row<5;row++){const count=7-row,radius=.49-row*.07;for(let j=0;j<count;j++){const a=j/count*Math.PI*2+row*.6;const p=new T.Vector3(Math.cos(a)*radius,.65-row*.34,Math.sin(a)*radius);const o=ellipsoid(root,new T.Vector3(.265,.3,.26),f.color,p,.32,32);o.userData.fruitSurface=true;(o.material as T.MeshStandardMaterial).color.multiplyScalar(.8+hash(row*9+j)*.3);}}
    tube([new T.Vector3(0,.45,0),new T.Vector3(.04,1.03,0),new T.Vector3(.3,1.12,0)],.042,material('#6b7140',.8),root);
    leaf(root,new T.Vector3(.02,.95,0),new T.Vector3(-1,.3,0),.65,.28);return normalizeModel(root,f);
  }
  if(shape==='cherries'){
    [[-.38,-.14,0],[.4,-.3,.1]].forEach(([x,y,z])=>{const body=ellipsoid(root,new T.Vector3(.44,.42,.42),f.color,new T.Vector3(x,y,z),.24);body.userData.fruitSurface=true;tube([new T.Vector3(x,y+.35,z),new T.Vector3(x*.9,.95,z),new T.Vector3(.1,1.4,0)],.024,material('#657339'),root);});
    leaf(root,new T.Vector3(.1,1.36,0),new T.Vector3(.7,.25,0),.5,.15);return normalizeModel(root,f);
  }

  const s=new T.Vector3(1,1,1);
  if(['oval','kiwi','date'].includes(shape))s.set(.77,1.08,.76);
  if(shape==='mango')s.set(.86,1.08,.74);
  if(shape==='pear'||shape==='avocado')s.set(.85,1.12,.85);
  if(shape==='papaya')s.set(.76,1.3,.76);
  if(shape==='pineapple')s.set(.76,1.0,.76);
  if(shape==='watermelon')s.set(1.16,.94,.96);
  if(shape==='jackfruit')s.set(.85,1.25,.84);
  if(shape==='durian')s.set(.91,1.1,.86);
  if(shape==='soursop')s.set(.83,1.2,.76);
  if(shape==='salak')s.set(.81,1.05,.8);
  if(shape==='strawberry')s.set(.8,.99,.8);
  if(shape==='waxapple')s.set(.89,1.02,.88);
  if(shape==='dragonfruit')s.set(.85,1.0,.8);
  if(shape==='persimmon'||shape==='mangosteen')s.set(1,.83,1);
  if(shape==='gooseberry')s.set(1,.78,1);
  if(f.id==='cempedak')s.set(.72,1.4,.72);
  if(f.id==='jeruk-bali')s.set(1,1.05,1);
  if(f.id==='jambu-bol')s.set(.93,1.0,.9);
  const geo=new T.SphereGeometry(1,128,96),p=geo.getAttribute('position'),uv=geo.getAttribute('uv');
  const colors:number[]=[],base=color(f.color),accent=color(f.accent);
  for(let i=0;i<p.count;i++){
    const x=p.getX(i),y=p.getY(i),z=p.getZ(i),u=uv.getX(i),v=uv.getY(i),a=Math.atan2(z,x);
    const zz=z;let radial=1,yy=y,xx=x,variation=.92+hash(i*.19)*.065,mix=0;
    if(shape==='apple'){radial=1+.035*Math.cos(a*5)*(Math.abs(y)**3);yy=y*(.86-.15*Math.abs(y)**10);mix=Math.max(0,Math.sin(a*3+v*6))*.045;}
    if(shape==='mango'){radial=1-.16*y;xx=x+.20*(1-y*y)-.10*y;mix=Math.max(0,y)*.7;}
    if(shape==='pear'||shape==='avocado'){radial=.8-.32*y;yy=y*1.07;}
    if(shape==='waxapple'){radial=(f.id==='jambu-bol'?.94:.84)-.29*y;yy=y*(1-(y<0?.32:.12)*Math.abs(y)**6);radial*=1+.025*Math.cos(a*4)*(1-y);}
    if(shape==='salak'){radial=.90-.22*y;yy=y*1.08;const pattern=Math.sin(u*100*Math.PI+Math.floor(v*35)*Math.PI)*Math.sin(v*35*Math.PI);radial+=.013*pattern;mix=pattern>.35?.4:.0;}
    if(shape==='strawberry'){radial=.78+.26*y;yy=y;mix=hash(i*3)>.97?.16:0;}
    if(shape==='starfruit'){radial=.64+.36*Math.cos(a*5);yy=y*1.32;mix=Math.pow(Math.max(0,Math.cos(a*5)),8)*.55;}
    if(shape==='watermelon'){mix=(.5+.5*Math.sin(a*11+.5*Math.sin(y*12)+.13*Math.sin(y*45)))>.48?.76:.03;}
    if(shape==='melon'){
      const web=Math.abs(Math.sin(u*110+Math.sin(v*28)*3)*Math.sin(v*115+Math.sin(u*36)*4));mix=web<.17?.8:.1;
      if(f.id==='blewah'){mix=.5+.5*Math.cos(a*10);radial=1+.03*Math.cos(a*10);}
    }
    if(shape==='peach'){radial-=.03*Math.pow(Math.max(0,Math.cos(a)),20);mix=Math.max(0,Math.sin(a+v*2))*.7;}
    if(shape==='gooseberry'){radial=.92+.08*Math.cos(a*7);}
    if(shape==='papaya')mix=Math.max(0,Math.sin(a*5+v*3))*.42;
    if(shape==='date'){radial+=.015*Math.sin(a*38+Math.sin(y*12));variation-=.05*Math.sin(a*38);}
    if(shape==='coconut')radial+=.045*Math.cos(a*3);
    if(f.id==='lemon')yy+=Math.sign(y)*.11*Math.abs(y)**14;
    if(shape==='soursop'){xx+=.13*(1-y*y);radial*=1+.025*Math.sin(a*3+y*4);}
    if(shape==='guava'||shape==='mango'||shape==='round')radial*=1+.012*Math.sin(a*3+y*4)+.006*Math.cos(a*7-y*2);
    if(shape==='citrus'||shape==='avocado'||shape==='guava'){radial+=(hash(i)-.5)*.004;mix=hash(i*8)>.9?.13:0;}
    if(['oval','round','kiwi'].includes(shape))mix=hash(i*5)>.88?.22:0;
    p.setXYZ(i,xx*radial*s.x,yy*s.y,zz*radial*s.z);
    const c=base.clone().lerp(accent,mix).multiplyScalar(variation);colors.push(c.r,c.g,c.b);
  }
  geo.setAttribute('color',new T.Float32BufferAttribute(colors,3));geo.computeVertexNormals();
  const shiny=['apple','waxapple','mangosteen','round','pomegranate','persimmon'].includes(shape);
  const body=mesh(geo,new T.MeshStandardMaterial({vertexColors:true,roughness:shiny?.35:.64,metalness:0}),root);body.userData.fruitSurface=true;

  if(['durian','jackfruit','soursop','lychee','custard','pineapple'].includes(shape)){
    const count=shape==='durian'?620:shape==='jackfruit'?850:shape==='soursop'?120:shape==='pineapple'?180:shape==='custard'?110:420;
    const h=shape==='durian'?.17:shape==='soursop'?.11:shape==='custard'?.085:shape==='pineapple'?.04:.036;
    const radius=shape==='durian'?.087:shape==='custard'?.14:shape==='pineapple'?.1:.045;
    const g=shape==='custard'?new T.SphereGeometry(radius,10,8):new T.ConeGeometry(radius,h,shape==='pineapple'?4:6);
    const instances=new T.InstancedMesh(g,material('#ffffff',.76),count),dummy=new T.Object3D();
    pointsOnSurface(count,s,(pos,n,i)=>{dummy.position.copy(pos).addScaledVector(n,h*.32);dummy.quaternion.setFromUnitVectors(Y,n);dummy.scale.setScalar(.72+hash(i)*.5);if(shape==='custard')dummy.scale.y*=.34;dummy.updateMatrix();instances.setMatrixAt(i,dummy.matrix);instances.setColorAt(i,base.clone().lerp(accent,.25+hash(i)*.3));});
    instances.castShadow=true;root.add(instances);
  }
  if(shape==='rambutan'){
    const gs:T.BufferGeometry[]=[];
    pointsOnSurface(400,s,(pos,n,i)=>{
      const tangent=new T.Vector3(n.y,-n.x,.3+hash(i)*.3).normalize(),length=.18+hash(i*1.7)*.18;
      const curve=new T.CatmullRomCurve3([pos,pos.clone().addScaledVector(n,length*.55),pos.clone().addScaledVector(n,length).addScaledVector(tangent,.05+hash(i)*.13)]);
      const g=new T.TubeGeometry(curve,10,.014,4,false),c:number[]=[],gp=g.getAttribute('position');
      for(let k=0;k<gp.count;k++){
        const t=Math.floor(k/5)/10,center=curve.getPointAt(t),point=new T.Vector3().fromBufferAttribute(gp,k);
        point.sub(center).multiplyScalar(.12+.88*Math.pow(1-t,.8)).add(center);gp.setXYZ(k,point.x,point.y,point.z);
        const shade=base.clone().lerp(accent,Math.pow(t,.65)).multiplyScalar(.88+hash(i)*.12);c.push(shade.r,shade.g,shade.b);
      }
      g.setAttribute('color',new T.Float32BufferAttribute(c,3));g.computeVertexNormals();gs.push(g);
    });
    const joined=mergeGeometries(gs);gs.forEach(g=>g.dispose());mesh(joined,new T.MeshStandardMaterial({vertexColors:true,roughness:.65}),root);
  }
  if(shape==='strawberry'){
    const seeds=new T.InstancedMesh(new T.SphereGeometry(1,8,6),material('#dec28a',.6),210),dummy=new T.Object3D();
    pointsOnSurface(210,s,(pos,n,i)=>{const r=.78+.26*pos.y/s.y;pos.x*=r;pos.z*=r;dummy.position.copy(pos).addScaledVector(n,.006);dummy.scale.set(.017,.031,.011);dummy.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),n);dummy.updateMatrix();seeds.setMatrixAt(i,dummy.matrix);});root.add(seeds);calyx(root,.91,7,.48);stem(root,.95,.6);
  } else if(shape==='pineapple'){
    for(let i=0;i<28;i++){const a=i*2.4,t=i/28;leaf(root,new T.Vector3(Math.cos(a)*.12,.87+t*.35,Math.sin(a)*.12),new T.Vector3(Math.cos(a)*(.85-t*.65),1,Math.sin(a)*(.85-t*.65)),.72+(1-t)*.3,.065+(1-t)*.07,'#4d7944','#84994e');}
  } else if(shape==='dragonfruit'){
    for(let row=0;row<4;row++)for(let i=0;i<6;i++){const a=i/6*Math.PI*2+row*.6,y=-.65+row*.4,r=Math.sqrt(1-y*y);leaf(root,new T.Vector3(Math.cos(a)*s.x*r,y,Math.sin(a)*s.z*r),new T.Vector3(Math.cos(a)*.75,.9,Math.sin(a)*.75),.44,.105,'#92aa49',f.color);}
    calyx(root,.97,5,.37,'#8f9b45');
  } else if(shape==='mangosteen') {calyx(root,.79,4,.48);stem(root,.84,.65);}
  else if(shape==='pomegranate'){const crown=new T.CylinderGeometry(.14,.12,.21,7,1,true);const o=mesh(crown,material('#956339',.75),root);o.position.y=1.03;calyx(root,1.1,6,.16,'#a47947');}
  else if(shape==='persimmon')calyx(root,.80,4,.49,'#68733a');
  else if(!['salak','kiwi','date','coconut','waxapple'].includes(shape)){
    stem(root,s.y*(shape==='apple'?.72:1),['durian','jackfruit'].includes(shape)?1.4:.75);
    if(['apple','mango','pear','citrus','guava','peach'].includes(shape))leaf(root,new T.Vector3(.03,s.y*.99,0),new T.Vector3(.8,.18,.12),.52,.16);
  }
  if(shape==='waxapple')calyx(root,-.98,4,.16,'#764043');
  if(shape==='coconut')calyx(root,.98,3,.22,'#8e723d');
  return normalizeModel(root,f);
}
function normalizeModel(root:T.Group,f:Fruit) {
  applyFruitSkin(root,f);
  const box=new T.Box3().setFromObject(root),size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3());
  const holder=new T.Group();holder.name=root.name;root.position.sub(center);holder.add(root);holder.scale.setScalar(2.6/Math.max(size.x,size.y,size.z));return holder;
}
export function disposeFruit(root:T.Object3D) {
  const geometries=new Set<T.BufferGeometry>(),materials=new Set<T.Material>(),textures=new Set<T.Texture>();
  root.traverse(o=>{if(o instanceof T.Mesh){geometries.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));}});
  geometries.forEach(g=>g.dispose());materials.forEach(m=>{const material=m as T.MeshStandardMaterial;for(const t of [material.map,material.bumpMap,material.roughnessMap])if(t)textures.add(t);m.dispose();});textures.forEach(t=>t.dispose());
}
