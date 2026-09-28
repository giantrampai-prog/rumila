// Small construction details give the site a human scale. Geometry is merged per finish.
import * as T from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { weathered } from './surface-materials';

class Fabrication {
  private batches = new Map<T.Material, T.BufferGeometry[]>();
  concrete = weathered('#b5b0a4');
  steel = weathered('#89959a', 'metal');
  dark = weathered('#323d42', 'metal');
  trim = weathered('#d3d6ce', 'metal');
  yellow = new T.MeshStandardMaterial({color:'#d6a63c',roughness:.6});
  glass = new T.MeshPhysicalMaterial({color:'#416c7e',metalness:.35,roughness:.14,clearcoat:1,clearcoatRoughness:.07});
  add(geo:T.BufferGeometry,mat:T.Material,x:number,y:number,z:number,rx=0,ry=0,rz=0) {
    geo.applyMatrix4(new T.Matrix4().compose(new T.Vector3(x,y,z),new T.Quaternion().setFromEuler(new T.Euler(rx,ry,rz)),new T.Vector3(1,1,1)));
    if(!this.batches.has(mat))this.batches.set(mat,[]);
    this.batches.get(mat)!.push(geo);
  }
  box(w:number,h:number,d:number,m:T.Material,x:number,y:number,z:number){this.add(new T.BoxGeometry(w,h,d),m,x,y,z);}
  pipe(a:T.Vector3,b:T.Vector3,r=.018,m:T.Material=this.steel) {
    const geo=new T.CylinderGeometry(r,r,a.distanceTo(b),8);
    geo.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize()));
    this.add(geo,m,(a.x+b.x)/2,(a.y+b.y)/2,(a.z+b.z)/2);
  }
  finish() {
    const group=new T.Group();
    for(const [m,parts] of this.batches){const mesh=new T.Mesh(mergeGeometries(parts)!,m);mesh.castShadow=mesh.receiveShadow=true;group.add(mesh);parts.forEach(g=>g.dispose());}
    return group;
  }
}

export function assemblyDetails() {
  const k=new Fabrication();
  k.box(4.28,.18,3.68,k.concrete,0,.05,0);
  // Standing-seam facade ribs and corner flashing.
  for(let x=-1.95;x<2;x+=.18)for(const z of [-1.712,1.712])k.box(.018,4.9,.028,k.trim,x,2.55,z);
  for(let z=-1.68;z<1.7;z+=.18)for(const x of [-2.01,2.01])k.box(.028,4.9,.018,k.trim,x,2.55,z);
  for(const x of [-2.03,2.03])for(const z of [-1.72,1.72])k.box(.07,5.08,.07,k.steel,x,2.54,z);
  k.box(4.12,.11,3.5,k.trim,0,5.05,0);
  for(const z of [-1.71,1.71])k.box(4.2,.09,.12,k.dark,0,5.1,z);
  // Loading door frame, sill, rails and shallow projecting canopy.
  k.box(1.43,.09,.17,k.dark,1,3.26,1.78);
  for(const x of [.29,1.71])k.box(.07,3.22,.12,k.steel,x,1.65,1.78);
  k.box(1.9,.055,.55,k.trim,1,3.38,1.94);
  k.box(2.1,.05,.75,k.concrete,1,.14,1.96);
  for(const x of [.12,1.92])k.box(.07,.42,.07,k.yellow,x,.33,2.1);
  // Roof ventilation units with louvers.
  for(const x of [-1.25,-.25,.75]) {
    k.box(.62,.28,.48,k.steel,x,5.2,-.5);
    for(let i=0;i<7;i++)k.box(.47,.01,.025,k.dark,x,5.35,-.65+i*.046);
  }
  for(const z of [-1.58,1.58])k.pipe(new T.Vector3(-1.97,.12,z),new T.Vector3(-1.97,5,z),.025);
  return k.finish();
}

export function controlDetails() {
  const k=new Fabrication();
  k.box(3.2,.1,2,k.concrete,0,.03,0);
  for(const z of [-.91,.91])for(let y=.28;y<1.2;y+=.35)for(let x=-1.3;x<1.4;x+=.35) {
    k.box(.235,.245,.035,k.dark,x,y,z);
    k.box(.195,.205,.046,k.glass,x,y,z);
    k.box(.25,.014,.075,k.trim,x,y-.125,z);
  }
  k.box(.45,.72,.06,k.dark,0,.42,.95);
  k.box(.37,.62,.066,k.glass,0,.43,.955);
  k.box(.7,.055,.45,k.trim,0,.94,1.05);
  k.box(.75,.1,.4,k.concrete,0,.07,1.08);
  for(const x of [-1.15,-.35]) {
    k.add(new RoundedBoxGeometry(.5,.22,.38,2,.025),k.steel,x,1.51,-.35);
    for(let i=0;i<5;i++)k.box(.4,.012,.012,k.dark,x,1.52+i*.025,-.55);
  }
  return k.finish();
}

export function tankDetails(radius:number,height:number,legs:number) {
  const k=new Fabrication();
  k.add(new T.TorusGeometry(radius*1.002,.008,5,64),k.steel,0,height,0,Math.PI/2);
  for(const x of [-.3,.3])k.pipe(new T.Vector3(x,height+radius*.85,.15),new T.Vector3(x,height+radius+.13,.15),.011);
  k.pipe(new T.Vector3(-.3,height+radius+.13,.15),new T.Vector3(.3,height+radius+.13,.15),.012);
  k.pipe(new T.Vector3(0,height+radius-.03,0),new T.Vector3(0,height+radius+.2,0),.043);
  k.box(.17,.035,.17,k.dark,0,height+radius+.2,0);
  for(let i=0;i<legs;i++) {
    const a=i/legs*Math.PI*2,x=Math.cos(a)*radius*.84,z=Math.sin(a)*radius*.84;
    k.box(.24,.09,.24,k.concrete,x,.035,z);
    const b=(i+1)/legs*Math.PI*2;
    k.pipe(new T.Vector3(x,.12,z),new T.Vector3(Math.cos(b)*radius*.84,height*.7,Math.sin(b)*radius*.84),.015);
  }
  // Inspection ladder and visible valve at ground level.
  for(const x of [-.07,.07])k.pipe(new T.Vector3(x,.1,radius*.95),new T.Vector3(x,height+radius*.6,radius*.95),.008);
  for(let y=.18;y<height+radius*.6;y+=.12)k.pipe(new T.Vector3(-.07,y,radius*.95),new T.Vector3(.07,y,radius*.95),.007);
  k.pipe(new T.Vector3(0,height-radius+.1,0),new T.Vector3(0,.17,0),.045);
  k.pipe(new T.Vector3(0,.17,0),new T.Vector3(radius+.4,.17,0),.045);
  k.add(new T.TorusGeometry(.09,.012,6,20),k.yellow,radius+.18,.25,0,Math.PI/2);
  return k.finish();
}

export function rocketDetails(radius:number,from:number,to:number) {
  const k=new Fabrication();
  for(let y=from+.18;y<to;y+=.55) k.add(new T.TorusGeometry(radius+.0015,.003,5,64),k.trim,0,y,0,Math.PI/2);
  for(const a of [.8,3.9]) {
    const x=Math.cos(a)*(radius+.013),z=Math.sin(a)*(radius+.013);
    k.pipe(new T.Vector3(x,from+.1,z),new T.Vector3(x,to-.08,z),.01,k.trim);
    for(let y=from+.2;y<to;y+=.32)k.box(.029,.02,.029,k.steel,x,y,z);
  }
  return k.finish();
}

/** Railings, inspection windows and corner flashing on the moving crew access arm. */
export function crewAccessDetails() {
  const k = new Fabrication();
  for (const z of [-.2, .2]) {
    for (const y of [.16, .3]) k.pipe(new T.Vector3(-1.1, y, z), new T.Vector3(0, y, z), .008);
    for (let x = -1.05; x < .01; x += .21) k.pipe(new T.Vector3(x, .02, z), new T.Vector3(x, .3, z), .008);
    k.box(1.1, .04, .025, k.yellow, -.55, .025, z);
  }
  for (const z of [-.253, .253]) {
    k.box(.29, .23, .012, k.dark, -1.35, .29, z);
    k.box(.25, .19, .018, k.glass, -1.35, .29, z);
    for (const x of [-1.57, -1.13]) k.box(.016, .49, .018, k.steel, x, .25, z);
    k.box(.47, .015, .018, k.steel, -1.35, .49, z);
    k.box(.47, .022, .018, k.dark, -1.35, .04, z);
  }
  k.box(.49, .018, .54, k.trim, -1.35, .51, 0);
  return k.finish();
}
