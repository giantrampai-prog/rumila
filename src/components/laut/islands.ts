import * as T from 'three';
import { surfaceMaterial } from './realism';

/** Distant karst islands: rounded eroded rock, a narrow beach and individual leafy crowns. */
export function tropicalIslands() {
  const root = new T.Group();
  let seed=2907; const r=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
  const leaf = new T.TextureLoader().load('/fruits/garden/realism/foliage.webp');
  leaf.colorSpace=T.SRGBColorSpace; leaf.anisotropy=4;
  const foliage=new T.MeshStandardMaterial({map:leaf,alphaTest:0.48,side:T.DoubleSide,roughness:0.9,color:'#709668'});
  const dummy=new T.Object3D();
  for(let island=0;island<7;island++) {
    const group=new T.Group(), R=26+r()*25, height=13+r()*23;
    const geo=new T.SphereGeometry(1,64,36,0,Math.PI*2,0,Math.PI/2);
    const p=geo.attributes.position, colors:number[]=[];
    for(let i=0;i<p.count;i++) {
      const x=p.getX(i),y=p.getY(i),z=p.getZ(i),a=Math.atan2(z,x);
      const k=1+Math.sin(a*3+island)*0.17+Math.sin(a*7)*0.07;
      p.setXYZ(i,x*R*k,y*height*(0.85+0.15*Math.sin(x*6+z*5)),z*R*k);
      const c=new T.Color(y<0.07?'#bdc6ad':y<0.35?'#707e6d':'#41624b');
      c.multiplyScalar(0.8+0.2*Math.sin(a*13+y*20)); colors.push(c.r,c.g,c.b);
    }
    geo.setAttribute('color',new T.Float32BufferAttribute(colors,3));geo.computeVertexNormals();
    const m=surfaceMaterial('#ffffff');m.vertexColors=true;
    group.add(new T.Mesh(geo,m));
    const forest=new T.InstancedMesh(new T.PlaneGeometry(3.6,3.6),foliage,1100);
    for(let i=0;i<1100;i++) {
      const a=r()*Math.PI*2, rr=Math.sqrt(r())*R*0.83;
      const x=Math.cos(a)*rr,z=Math.sin(a)*rr;
      const h=Math.sqrt(Math.max(0,1-rr*rr/(R*R)))*height*(0.85+0.15*Math.sin(x/R*6+z/R*5));
      dummy.position.set(x,h+0.6+r()*1.8,z);dummy.rotation.set(r()*1.6,r()*6.28,r()*0.7);
      dummy.scale.setScalar(1+r()*1.1);dummy.updateMatrix();forest.setMatrixAt(i,dummy.matrix);
    }
    group.add(forest);
    const a=-0.2-island/6*Math.PI*1.05;group.position.set(Math.cos(a)*(175+r()*100),-1.3,Math.sin(a)*(175+r()*100));
    root.add(group);
  }
  return root;
}
