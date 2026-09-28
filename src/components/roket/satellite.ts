import * as T from 'three';

/** A small generic observation satellite: insulated bus, hinged cell arrays and antenna hardware. */
export function createSatellite(seed:number) {
  const g=new T.Group();g.name='observation-satellite';
  const metal=new T.MeshStandardMaterial({color:'#afb5b9',roughness:.31,metalness:.8});
  const foil=new T.MeshStandardMaterial({color:seed%3===0?'#ced0cf':'#b39140',roughness:.44,metalness:.72});
  foil.onBeforeCompile=s=>{
    s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 foilP;').replace('#include <begin_vertex>','#include <begin_vertex>\nfoilP=position;');
    s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 foilP;')
      .replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
        vec3 crease=sin(foilP*vec3(81.,47.,63.)+sin(foilP.yzx*29.));
        normal=normalize(normal+crease*.19);`);
  };foil.customProgramCacheKey=()=> 'satellite-foil-v1';
  const cells=new T.MeshPhysicalMaterial({color:'#ffffff',roughness:.34,metalness:.5,clearcoat:.5});
  cells.onBeforeCompile=s=>{
    s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec2 cellUv;').replace('#include <begin_vertex>','#include <begin_vertex>\ncellUv=uv;');
    s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying vec2 cellUv;').replace('#include <color_fragment>',`#include <color_fragment>
      vec2 cell=fract(cellUv*vec2(12.,6.));
      float gap=max(1.-smoothstep(.018,.04,min(cell.x,1.-cell.x)),1.-smoothstep(.02,.04,min(cell.y,1.-cell.y)));
      float busbar=1.-smoothstep(.008,.014,abs(fract(cell.x*3.)-.5));
      diffuseColor.rgb*=mix(vec3(.018,.035,.083),vec3(.27,.31,.36),max(gap,busbar*.4));`);
  };cells.customProgramCacheKey=()=> 'satellite-cells-v1';
  const box=(x:number,y:number,z:number,px:number,py:number,pz:number,m:T.Material)=>{
    const o=new T.Mesh(new T.BoxGeometry(x,y,z),m);o.position.set(px,py,pz);g.add(o);return o;
  };
  const strut=(a:number[],b:number[],radius=.02)=>{
    const from=new T.Vector3(...a),to=new T.Vector3(...b),d=to.clone().sub(from);
    const o=new T.Mesh(new T.CylinderGeometry(radius,radius,d.length(),8),metal);
    o.position.copy(from.add(to).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());g.add(o);
  };
  box(.76,.76,1.08,0,0,0,foil).name='insulated-bus';
  for(const x of [-.4,.4])for(const y of [-.4,.4])box(.035,.035,1.17,x,y,0,metal);
  box(.83,.035,1.16,0,.4,0,metal);box(.83,.035,1.16,0,-.4,0,metal);
  // Recessed instrument aperture and radiator louvers on the bus.
  const aperture=new T.Mesh(new T.CylinderGeometry(.19,.23,.17,32),metal);aperture.rotation.x=Math.PI/2;aperture.position.z=-.62;g.add(aperture);
  const glass=new T.Mesh(new T.CircleGeometry(.165,32),new T.MeshPhysicalMaterial({color:'#111b26',metalness:.5,roughness:.1,clearcoat:1}));glass.rotation.y=Math.PI;glass.position.z=-.713;g.add(glass);
  for(let i=0;i<8;i++)box(.012,.047,.67,.392,-.26+i*.075,0,metal);
  for(const sign of [-1,1]) {
    strut([sign*.4,0,0],[sign*1.08,0,0],.035);
    for(let j=0;j<2;j++) {
      const x=sign*(1.62+j*1.14);
      box(1.11,.036,.98,x,0,0,metal);
      box(1.055,.006,.916,x,.022,0,cells).name='solar-cell-array';
      for(const z of [-.35,.35])strut([x-sign*.555,0,z],[x-sign*.59,0,z],.024);
    }
  }
  // A shallow parabolic reflector, not an opaque spherical cap.
  const profile=Array.from({length:25},(_,i)=>{const r=i/24*.36;return new T.Vector2(r,r*r*.6);});
  const dish=new T.Mesh(new T.LatheGeometry(profile,48),new T.MeshStandardMaterial({color:'#d7d5c7',roughness:.47,metalness:.4,side:T.DoubleSide}));
  dish.rotation.x=Math.PI/2;dish.position.set(0,.08,.68);g.add(dish);
  for(let i=0;i<3;i++){const a=i*Math.PI*2/3;strut([Math.cos(a)*.32,.08+Math.sin(a)*.32,.745],[0,.08,1.07],.007);}
  const feed=new T.Mesh(new T.CylinderGeometry(.027,.027,.1,12),metal);feed.rotation.x=Math.PI/2;feed.position.set(0,.08,1.07);g.add(feed);
  strut([.2,.4,-.25],[.2,1.05,-.25],.012);
  g.rotation.set((seed*.71)%Math.PI,(seed*1.43)%Math.PI,0);g.scale.setScalar(1.6);
  return g;
}
