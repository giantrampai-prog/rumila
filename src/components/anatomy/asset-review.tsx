'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import './asset-review.css';

type ReviewControls = { view: (angle:number)=>void; wireframe:(value:boolean)=>void; rotate:(value:boolean)=>void; reset:()=>void };

/** Development-only review of image reconstruction; never records learning progress. */
export function AnatomyAssetReview() {
  const host=useRef<HTMLDivElement>(null), controls=useRef<ReviewControls|null>(null);
  const [status,setStatus]=useState('Memuat model 3D…'),[error,setError]=useState(false),[retry,setRetry]=useState(0);
  const [wire,setWire]=useState(false),[rotate,setRotate]=useState(false),[triangles,setTriangles]=useState(0);
  useEffect(()=>{
    let cleanup=()=>{},cancelled=false;
    const abort=new AbortController();
    setStatus('Memuat model 3D…');setError(false);setWire(false);setRotate(false);
    void (async()=>{
      const [T,{GLTFLoader},{OrbitControls},{MeshoptDecoder},{RoomEnvironment}]=await Promise.all([
        import('three'),import('three/addons/loaders/GLTFLoader.js'),import('three/addons/controls/OrbitControls.js'),
        import('three/addons/libs/meshopt_decoder.module.js'),import('three/addons/environments/RoomEnvironment.js'),
      ]);
      if(cancelled||!host.current)return;
      const el=host.current, scene=new T.Scene(),camera=new T.PerspectiveCamera(34,1,.01,100);
      const renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
      renderer.setPixelRatio(Math.min(Math.max(window.devicePixelRatio,1.5),2));
      renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
      renderer.domElement.setAttribute('aria-label','Model jantung hasil rekonstruksi gambar. Geser untuk memutar, gulir untuk memperbesar.');
      renderer.domElement.setAttribute('role','img');el.appendChild(renderer.domElement);
      const orbit=new OrbitControls(camera,renderer.domElement);orbit.enableDamping=true;orbit.autoRotateSpeed=.65;
      orbit.addEventListener('start',()=>{orbit.autoRotate=false;setRotate(false);});
      const env=new RoomEnvironment(),pmrem=new T.PMREMGenerator(renderer),environment=pmrem.fromScene(env,.08);
      scene.environment=environment.texture;env.dispose();pmrem.dispose();
      scene.add(new T.HemisphereLight(0xffffff,0x70645c,1.1));
      const key=new T.DirectionalLight(0xffffff,2.2);key.position.set(-3,5,4);scene.add(key);
      const fill=new T.DirectionalLight(0xffffff,.8);fill.position.set(4,0,-3);scene.add(fill);
      let span=2,frame=0,model:InstanceType<typeof T.Group>|null=null;
      const materials=new Set<InstanceType<typeof T.MeshStandardMaterial>>();
      const fit=()=>{
        const width=el.clientWidth,height=el.clientHeight;if(!width||!height)return;
        camera.aspect=width/height;camera.updateProjectionMatrix();renderer.setSize(width,height);
        if(!model)return;
        const box=new T.Box3().setFromObject(model),size=box.getSize(new T.Vector3());
        orbit.target.copy(box.getCenter(new T.Vector3()));span=size.length();
        const distance=Math.max(size.y,size.x/camera.aspect)/2/Math.tan(T.MathUtils.degToRad(camera.fov)/2)*1.25;
        camera.position.copy(orbit.target).add(new T.Vector3(0,0,distance));orbit.minDistance=span*.2;orbit.maxDistance=span*5;orbit.update();
      };
      const observer=new ResizeObserver(fit);observer.observe(el);fit();
      const render=()=>{orbit.update();renderer.render(scene,camera);frame=requestAnimationFrame(render);};render();
      controls.current={
        view:angle=>{orbit.autoRotate=false;const d=camera.position.distanceTo(orbit.target);camera.position.copy(orbit.target).add(new T.Vector3(Math.sin(angle)*d,0,Math.cos(angle)*d));orbit.update();},
        wireframe:value=>materials.forEach(m=>{m.wireframe=value;}),
        rotate:value=>{orbit.autoRotate=value;},reset:fit,
      };
      cleanup=()=>{
        controls.current=null;cancelAnimationFrame(frame);observer.disconnect();orbit.dispose();
        const textures=new Set<InstanceType<typeof T.Texture>>();
        scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material]){for(const value of Object.values(m))if(value instanceof T.Texture)textures.add(value);m.dispose();}}});
        textures.forEach(t=>t.dispose());environment.dispose();renderer.dispose();renderer.domElement.remove();
      };
      const response=await fetch('/anatomy/review/heart-shape.glb',{signal:abort.signal});
      if(!response.ok)throw new Error('Model belum tersedia.');
      const bytes=await response.arrayBuffer();if(cancelled)return;
      const loader=new GLTFLoader();loader.setMeshoptDecoder(MeshoptDecoder);
      const gltf=await loader.parseAsync(bytes,'');
      if(cancelled){gltf.scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}});return;}
      model=gltf.scene;let count=0;
      model.traverse(o=>{if(o instanceof T.Mesh){
        count+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;
        const multiple=Array.isArray(o.material),original=multiple?o.material as InstanceType<typeof T.Material>[]:[o.material as InstanceType<typeof T.Material>];
        const mapped=original.map(m=>{
          const mat=m instanceof T.MeshStandardMaterial?m.clone():new T.MeshStandardMaterial();
          // Neutral material makes actual shape defects visible. It is not an anatomical color map.
          if(!mat.map){mat.color.set('#b39e93');mat.roughness=.68;mat.metalness=0;}
          mat.envMapIntensity=.18;materials.add(mat);m.dispose();return mat;
        });
        o.material=multiple?mapped:mapped[0];
      }});
      scene.add(model);fit();setTriangles(Math.round(count));setStatus('');
    })().catch(e=>{if(!cancelled){cleanup();setError(true);setStatus(e instanceof Error?e.message:'Model tidak dapat dibuka.');}});
    return()=>{cancelled=true;abort.abort();cleanup();};
  },[retry]);
  const view=(angle:number)=>{setRotate(false);controls.current?.view(angle);};
  return <main className="anatomy-review">
    <header><Link href="/jelajah-tubuh" className="ar-brand">RUMILA<span>●</span></Link><span className="ar-status">Studio aset · pratinjau pengembangan</span><Link href="/jelajah-tubuh">Kembali ke Jelajah Tubuh →</Link></header>
    <section className="ar-heading"><div><p>GAMBAR GPT → REKONSTRUKSI 3D</p><h1>Jantung, dari segala sisi.</h1></div><span>Putar, perbesar, dan periksa bentuknya.</span></section>
    <div className="ar-workspace">
      <aside><h2>01 · Referensi GPT</h2><Image priority src="/anatomy/references/heart-gpt-reference.png" alt="Referensi jantung dengan warna jaringan alami, dibuat dengan GPT" width={1254} height={1254}/><p>Acuan warna dan detail permukaan.</p><h2>02 · Geometri 3D</h2><p>Rekonstruksi Hunyuan3D 2.1 dari gambar di atas. Bentuk ini memiliki volume dan bisa diputar.</p><dl><div><dt>Model mentah</dt><dd>3.270.224 segitiga</dd></div><div><dt>Pratinjau</dt><dd>{triangles?triangles.toLocaleString('id-ID')+' segitiga':'Memuat…'}</dd></div></dl><p className="ar-note">Material netral untuk memeriksa bentuk. Tekstur alami dan bagian dalam belum selesai; model belum ditinjau secara anatomis.</p><a href="/anatomy/review/heart-shape.glb" download>Unduh model GLB ↓</a></aside>
      <section className="ar-stage" aria-label="Pratinjau model jantung 3D"><div ref={host} className="ar-canvas"/>
        {status&&<div role="status" className="ar-loading">{status}{error&&<button onClick={()=>setRetry(v=>v+1)}>Coba lagi</button>}</div>}
        <span className="ar-stage-label">Geometri hasil rekonstruksi · belum divalidasi</span>
        <nav className="ar-views" aria-label="Sudut pandang model"><button onClick={()=>view(0)}>Depan</button><button onClick={()=>view(Math.PI)}>Belakang</button><button onClick={()=>view(Math.PI/2)}>Sisi 1</button><button onClick={()=>view(-Math.PI/2)}>Sisi 2</button></nav>
        <div className="ar-controls"><button aria-pressed={rotate} onClick={()=>{setRotate(!rotate);controls.current?.rotate(!rotate);}}>{rotate?'Jeda putaran':'Putar otomatis'}</button><button aria-pressed={wire} onClick={()=>{setWire(!wire);controls.current?.wireframe(!wire);}}>Lihat jaring 3D</button><button onClick={()=>{setRotate(false);controls.current?.rotate(false);controls.current?.reset();}}>Atur ulang</button></div>
      </section>
    </div>
  </main>;
}
