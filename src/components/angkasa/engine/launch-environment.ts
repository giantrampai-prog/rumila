import * as T from 'three';
import { Merge, mat } from '@/components/fruits/garden/build';
import { rng } from './bodies';
import { broadleaf, palm, wind } from './launch-vegetation';

/** Meter-scale foreground. The distant photographic panorama remains a separate backdrop. */
export class LaunchEnvironment {
  readonly group = new T.Group();
  readonly time = { value: 0 };
  private resources = new Set<{ dispose(): void }>();
  private disposed = false;
  private manager = new T.LoadingManager();
  private loader = new T.TextureLoader(this.manager);
  ready = false;

  constructor(low: boolean) {
    this.group.name = 'launch-coastal-environment';
    this.manager.onLoad=()=>{this.ready=true;};
    const r = rng(317);
    const grass = this.texture('grass-albedo', true);
    const groundMat = new T.MeshStandardMaterial({ map: grass, roughness: 1, color: '#a8b18c', bumpMap: grass, bumpScale: .025 });
    // World-space detail and macro variation keep the horizon free of repeated texture stripes.
    groundMat.onBeforeCompile = s => {
      s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vGround;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvGround=position;');
      s.fragmentShader = s.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vGround;')
        .replace('#include <map_fragment>', `#include <map_fragment>
          float macro=sin(vGround.x*.23+sin(vGround.z*.17))*sin(vGround.z*.31)*.09;
          diffuseColor.rgb *= .92 + macro;
          float edge = smoothstep(3.25, 5.0, length(vGround.xz));
          diffuseColor.rgb = mix(diffuseColor.rgb*vec3(1.12,.92,.72), diffuseColor.rgb, edge);`);
    };
    const terrain = new T.PlaneGeometry(1, 1, 96, 96);
    const p = terrain.attributes.position, uv = terrain.attributes.uv;
    for (let i=0;i<p.count;i++) {
      const z=p.getY(i)*390, x=T.MathUtils.lerp(this.coast(z),195,p.getX(i)+.5);
      const d=Math.hypot(x,z), h=T.MathUtils.smoothstep(d,5,18)*(Math.sin(x*.19)*Math.sin(z*.14)*.13);
      p.setXYZ(i,x,h,z); uv.setXY(i,x/3.5,z/3.5);
    }
    terrain.computeVertexNormals();
    // Plane UV orientation is reversed after mapping y to z.
    terrain.setIndex(Array.from(terrain.index!.array).reverse());
    terrain.computeVertexNormals();
    this.mesh(terrain,groundMat);

    const sand = new T.MeshStandardMaterial({ color:'#c9b997', roughness:1, map:grass });
    const beach = new T.PlaneGeometry(1,1,1,96), bp=beach.attributes.position;
    for(let i=0;i<bp.count;i++) {
      const z=bp.getY(i)*390, k=bp.getX(i)+.5;
      bp.setXYZ(i,this.coast(z)-3+k*3.05,-.32+k*.32,z);
    }
    beach.setIndex(Array.from(beach.index!.array).reverse()); beach.computeVertexNormals(); this.mesh(beach,sand);
    const water = new T.ShaderMaterial({
      uniforms:{uTime:this.time}, transparent:false,
      vertexShader:`varying vec3 vP; uniform float uTime;
        void main(){vP=position;vec3 p=position;p.y+=sin(p.x*.12+p.z*.08-uTime*.7)*.035;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
      fragmentShader:`varying vec3 vP; uniform float uTime;
        void main(){
          float shore=-28.+sin(vP.z*.023)*5.; float d=shore-vP.x;
          float wave=sin(vP.x*1.3+vP.z*.28-uTime*1.7)+sin(vP.z*2.2+vP.x*.4+uTime*.9);
          vec3 c=mix(vec3(.018,.20,.30),vec3(.008,.105,.19),smoothstep(0.,100.,d));
          vec3 V=normalize(cameraPosition-vP);
          vec3 N=normalize(vec3(cos(vP.x*1.3+vP.z*.28-uTime*1.7)*.06,1.,cos(vP.z*2.2+vP.x*.4+uTime*.9)*.045));
          float fresnel=.02+.98*pow(1.-max(dot(N,V),0.),5.);
          c=mix(c,vec3(.16,.32,.46),fresnel*.7);
          vec3 L=normalize(vec3(-30.,40.,20.));
          c+=pow(max(dot(reflect(-L,N),V),0.),180.)*vec3(1.,.87,.63)*.8;
          c+=pow(max(0.,wave*.5),12.)*vec3(.06,.09,.1);
          float foam=(1.-smoothstep(1.5,5.,d)) * smoothstep(.35,.8,sin(d*2.-uTime*.85+sin(vP.z*.8)*.35));
          c=mix(c,vec3(.7,.82,.8),foam*.6); gl_FragColor=vec4(c,1.);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    });
    const sea = new T.PlaneGeometry(1,1,70,70), sp=sea.attributes.position;
    for(let i=0;i<sp.count;i++) {const z=sp.getY(i)*390;sp.setXYZ(i,T.MathUtils.lerp(-195,this.coast(z)-1.2,sp.getX(i)+.5),-.25,z);}
    sea.setIndex(Array.from(sea.index!.array).reverse()); sea.computeVertexNormals(); this.mesh(sea,water).receiveShadow=false;

    const bark=this.texture('bark-albedo',true); bark.repeat.set(2,1);
    const leaves=this.texture('tropical-leaves'), fronds=this.texture('coconut-frond');
    const woodMat=new T.MeshStandardMaterial({map:bark,bumpMap:bark,bumpScale:.013,roughness:.94,vertexColors:true});
    const foliage=(map:T.Texture)=>wind(new T.MeshStandardMaterial({map,vertexColors:true,alphaTest:.45,alphaToCoverage:true,side:T.DoubleSide,roughness:.85}),this.time);
    const leafMat=foliage(leaves), palmMat=foliage(fronds);
    const depth=(map:T.Texture)=>wind(new T.MeshDepthMaterial({map,alphaTest:.45,side:T.DoubleSide,depthPacking:T.RGBADepthPacking}),this.time);
    const leafDepth=depth(leaves), palmDepth=depth(fronds);
    this.resources.add(leafDepth);this.resources.add(palmDepth);
    type Pose={x:number;z:number;scale:number;yaw:number};
    const scatter=(source:T.Mesh,poses:Pose[],depth?:T.MeshDepthMaterial,castsShadow=true)=>{
      // Distant foliage cannot shadow the pad. Keep it outside the shadow draw entirely.
      for (const near of [true,false]) {
        const part=poses.filter(p=>(Math.hypot(p.x,p.z)<19)===near);
        if (!part.length) continue;
        const inst=new T.InstancedMesh(source.geometry,source.material,part.length);
        part.forEach((p,i)=>{inst.setMatrixAt(i,mat(p.x,0,p.z,0,p.yaw,0,p.scale));inst.setColorAt(i,new T.Color().setRGB(.86+r()*.13,.89+r()*.1,.8+r()*.12));});
        inst.castShadow=near && castsShadow;inst.receiveShadow=near;inst.customDepthMaterial=depth;
        inst.computeBoundingSphere();this.group.add(inst);this.resources.add(inst);
      }
      this.resources.add(source.geometry);
      for(const m of Array.isArray(source.material)?source.material:[source.material])this.resources.add(m);

    };
    for(let v=0;v<3;v++) {
      const tree=broadleaf(471+v*61,low || v>0), poses:Pose[]=[];
      for(let i=0;i<(low?24:45);i++) {
        const a=r()*Math.PI*2,d=14+r()*90,x=Math.cos(a)*d,z=Math.sin(a)*d;
        if(x<this.coast(z)+5)continue;
        // Clear view corridor towards the sea and volcano; denser forest on both sides.
        if(z>0 && x>-26 && x<12 && d<42)continue;
        poses.push({x,z,scale:1.1+r()*1.3,yaw:r()*Math.PI*2});
      }
      scatter(tree.wood.build(woodMat),poses);scatter(tree.leaves.build(leafMat),poses,leafDepth);
    }
    for(let v=0;v<2;v++) {
      const tree=palm(814+v),poses:Pose[]=[];
      for(let i=0;i<(low?7:12);i++) {const z=-50+r()*125;poses.push({x:this.coast(z)+3+r()*4,z,scale:1.25+r()*.55,yaw:r()*Math.PI*2});}
      scatter(tree.wood.build(woodMat),poses);scatter(tree.leaves.build(palmMat),poses,palmDepth);
    }
    const bush=broadleaf(692,true),bushes:Pose[]=[];
    for(let i=0;i<(low?30:65);i++) {const a=r()*Math.PI*2,d=7+r()*26,x=Math.cos(a)*d,z=Math.sin(a)*d;if(x<this.coast(z)+2)continue;bushes.push({x,z,scale:.1+r()*.22,yaw:a});}
    scatter(bush.wood.build(woodMat),bushes);scatter(bush.leaves.build(leafMat),bushes,leafDepth);

    // Low grass tufts provide parallax at the landing-pad edge, in a single instanced draw.
    const blades=new Merge();
    for(let i=0;i<7;i++) {
      const h=.055+r()*.075,w=.009,g=new T.BufferGeometry();
      g.setAttribute('position',new T.Float32BufferAttribute([-w,0,0,w,0,0,-w*.5,h*.5,.014,w*.5,h*.5,.014,0,h,.033],3));
      g.setIndex([0,1,2,1,3,2,2,3,4]);g.computeVertexNormals();
      blades.add(g,mat((r()-.5)*.12,0,(r()-.5)*.12,0,r()*6.28),i%2?'#72814b':'#87945e',{sway:.15});
    }
    const grassPos:Pose[]=[];
    for(let i=0;i<(low?850:2200);i++){const a=r()*6.28,d=3.35+Math.sqrt(r())*16;grassPos.push({x:Math.cos(a)*d,z:Math.sin(a)*d,scale:.8+r()*.6,yaw:a});}
    scatter(blades.build(wind(new T.MeshStandardMaterial({vertexColors:true,side:T.DoubleSide,roughness:1}),this.time)),grassPos,undefined,false);
    this.group.children.at(-1)!.castShadow=false;

    // Recessed lights and a metal rim make the pad read as a constructed object at close range.
    const rim=this.mesh(new T.CylinderGeometry(3.22,3.25,.08,128),new T.MeshStandardMaterial({color:'#717571',metalness:.22,roughness:.76}));rim.position.y=-.032;
    const details=new Merge(), lamp=new Merge();
    for(let i=0;i<12;i++) {
      const a=i*Math.PI/6,x=Math.cos(a)*3.05,z=Math.sin(a)*3.05;
      details.add(new T.CylinderGeometry(.055,.07,.026,12),mat(x,.025,z),'#454b4c');
      lamp.add(new T.SphereGeometry(.036,10,6),mat(x,.039,z,0,0,0,1,.4,1),'#fff1bd');
    }
    this.group.add(details.build(new T.MeshStandardMaterial({vertexColors:true,metalness:.65,roughness:.4})),lamp.build(new T.MeshStandardMaterial({vertexColors:true,emissive:'#ffd18c',emissiveIntensity:.7,roughness:.3})));
    this.group.traverse(o=>{const m=o as T.Mesh;if(!m.isMesh)return;this.resources.add(m.geometry);for(const material of Array.isArray(m.material)?m.material:[m.material])this.resources.add(material);});
  }

  private coast(z:number){return -28+Math.sin(z*.023)*5;}
  private texture(name:string,repeat=false){
    const t=this.loader.load(`/angkasa/kapal/realism/${name}.webp`,tex=>{if(this.disposed)tex.dispose();});
    t.colorSpace=T.SRGBColorSpace;t.anisotropy=8;
    if(repeat)t.wrapS=t.wrapT=T.RepeatWrapping;
    this.resources.add(t);return t;
  }
  private mesh(geometry:T.BufferGeometry,material:T.Material){const m=new T.Mesh(geometry,material);m.receiveShadow=true;this.group.add(m);return m;}
  update(seconds:number){this.time.value=seconds;}
  dispose(){this.disposed=true;this.resources.forEach(r=>r.dispose());this.resources.clear();this.group.clear();}
}
