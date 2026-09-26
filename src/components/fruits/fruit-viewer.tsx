'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createFruitModel, disposeFruit } from '@/lib/fruits/models';
import type { Fruit } from '@/lib/fruits/catalog';
import { FRUIT_ARTWORK } from '@/lib/fruits/artwork';
import { Icon } from '@/components/ui';

interface SceneHandle { setFruit:(f:Fruit)=>void; zoom:(factor:number)=>void; reset:()=>void; rotate:(on:boolean)=>void; }
export default function FruitViewer({fruit}:{fruit:Fruit}) {
 const stage=useRef<HTMLDivElement>(null),mount=useRef<HTMLDivElement>(null),handle=useRef<SceneHandle|null>(null),current=useRef(fruit);
 current.current=fruit;
 const [error,setError]=useState(false),[attempt,setAttempt]=useState(0),[spinning,setSpinning]=useState(false),[full,setFull]=useState(false);
 useEffect(()=>{
  const host=mount.current;if(!host)return;
  let renderer:T.WebGLRenderer;
  try{renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});}catch{setError(true);return;}
  setError(false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.setClearColor(0,0);
  renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.NeutralToneMapping;renderer.toneMappingExposure=1;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(38,1,.05,50);
  camera.position.set(0,.25,5.2);
  const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=2.8;controls.maxDistance=8;controls.autoRotateSpeed=.8;controls.target.set(0,0,0);controls.saveState();
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const pmrem=new T.PMREMGenerator(renderer),room=new RoomEnvironment(),env=pmrem.fromScene(room,.05);scene.environment=env.texture;scene.environmentIntensity=.55;room.dispose();pmrem.dispose();
  scene.add(new T.HemisphereLight('#fff9ed','#a8a4bf',.85));
  const key=new T.DirectionalLight('#fff7e8',2.5);key.position.set(-3,5,4);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.normalBias=.025;scene.add(key);
  const fill=new T.DirectionalLight('#e6efff',.75);fill.position.set(4,2,-3);scene.add(fill);
  const floor=new T.Mesh(new T.CircleGeometry(3,64),new T.ShadowMaterial({opacity:.12}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.4;floor.receiveShadow=true;scene.add(floor);
  let model=createFruitModel(current.current),modelId=current.current.id;scene.add(model);
  const canvas=renderer.domElement;canvas.tabIndex=0;canvas.setAttribute('aria-label',`Model 3D ${current.current.name}. Geser untuk memutar. Gunakan tombol panah atau tambah dan kurang.`);host.appendChild(canvas);
  const fit=()=>{const w=host.clientWidth,h=host.clientHeight;if(w&&h){renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}};
  const observer=new ResizeObserver(fit);observer.observe(host);fit();
  const zoom=(factor:number)=>{const offset=camera.position.clone().sub(controls.target);offset.setLength(T.MathUtils.clamp(offset.length()*factor,controls.minDistance,controls.maxDistance));camera.position.copy(controls.target).add(offset);controls.update();};
  const keyboard=(event:KeyboardEvent)=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','=','0'].includes(event.key)){event.preventDefault();controls.autoRotate=false;setSpinning(false);if(event.key==='0'){controls.reset();}else if(['+','-','='].includes(event.key)){zoom(event.key==='-'?1.12:.89);}else{const offset=camera.position.clone().sub(controls.target),spherical=new T.Spherical().setFromVector3(offset);if(event.key==='ArrowLeft')spherical.theta-=.16;if(event.key==='ArrowRight')spherical.theta+=.16;if(event.key==='ArrowUp')spherical.phi-=.16;if(event.key==='ArrowDown')spherical.phi+=.16;spherical.makeSafe();camera.position.copy(controls.target).add(new T.Vector3().setFromSpherical(spherical));controls.update();}}};
  canvas.addEventListener('keydown',keyboard);
  const lost=(event:Event)=>{event.preventDefault();renderer.setAnimationLoop(null);setError(true);};canvas.addEventListener('webglcontextlost',lost);
  const pause=()=>{if(reduced.matches){controls.autoRotate=false;setSpinning(false);}};reduced.addEventListener('change',pause);
  handle.current={setFruit:f=>{if(f.id===modelId)return;modelId=f.id;scene.remove(model);disposeFruit(model);model=createFruitModel(f);scene.add(model);controls.reset();controls.autoRotate=false;setSpinning(false);canvas.setAttribute('aria-label',`Model 3D ${f.name}. Geser untuk memutar. Gunakan tombol panah atau tambah dan kurang.`);},zoom,reset:()=>{controls.reset();controls.autoRotate=false;setSpinning(false);},rotate:on=>{controls.autoRotate=on;}};
  renderer.setAnimationLoop(()=>{if(document.hidden)return;controls.update();renderer.render(scene,camera);});
  return()=>{handle.current=null;renderer.setAnimationLoop(null);observer.disconnect();canvas.removeEventListener('keydown',keyboard);canvas.removeEventListener('webglcontextlost',lost);reduced.removeEventListener('change',pause);controls.dispose();disposeFruit(model);floor.geometry.dispose();(floor.material as T.Material).dispose();env.dispose();renderer.dispose();canvas.remove();};
 },[attempt]);
 useEffect(()=>{handle.current?.setFruit(fruit);},[fruit]);
 useEffect(()=>{
  if(!full)return;
  const overflow=document.body.style.overflow;document.body.style.overflow='hidden';
  const key=(event:KeyboardEvent)=>{
   if(event.key==='Escape')setFull(false);
   if(event.key==='Tab'){
    const items=stage.current?.querySelectorAll<HTMLElement>('button:not(:disabled),canvas[tabindex="0"]');if(!items?.length)return;
    const first=items[0],last=items[items.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
   }
  };
  document.addEventListener('keydown',key);return()=>{document.body.style.overflow=overflow;document.removeEventListener('keydown',key);};
 },[full]);
 // A viewport overlay also works in embedded browsers without the Fullscreen API.
 const fullscreen=()=>setFull(value=>!value);
 return <div className={`fruit-stage${full?' is-expanded':''}`} ref={stage} role={full?'dialog':undefined} aria-modal={full||undefined} aria-label={full?`Model ${fruit.name} layar penuh`:undefined}>
  <div className="fruit-stage-heading"><span><Icon name="view_in_ar" size={20}/>Jelajah 3D</span><button className="fruit-icon-button" onClick={fullscreen} aria-label={full?'Keluar layar penuh':'Layar penuh'}><Icon name={full?'fullscreen_exit':'fullscreen'}/></button></div>
  <div className="fruit-canvas" ref={mount} hidden={error}/>
  {error&&<div className="fruit-viewer-fallback"><Image src={FRUIT_ARTWORK[fruit.id].thumb} alt={fruit.name} width={160} height={160} unoptimized/><p>Tampilan 3D belum bisa dimuat. Kamu tetap bisa mengenal buahnya.</p><button className="fruit-button" onClick={()=>setAttempt(a=>a+1)}>Coba 3D lagi</button></div>}
  <div className="fruit-stage-bottom"><p><Icon name="swipe" size={18}/>Geser untuk memutar · Cubit untuk zoom</p><div className="fruit-viewer-tools" aria-label="Kontrol model 3D"><button className="fruit-icon-button" disabled={error} aria-label="Perkecil buah" onClick={()=>handle.current?.zoom(1.15)}><Icon name="remove"/></button><button className="fruit-icon-button" disabled={error} aria-label="Perbesar buah" onClick={()=>handle.current?.zoom(.87)}><Icon name="add"/></button><button className="fruit-icon-button" disabled={error} aria-label="Kembalikan sudut pandang" onClick={()=>handle.current?.reset()}><Icon name="restart_alt"/></button><button className="fruit-button fruit-spin" disabled={error} aria-pressed={spinning} onClick={()=>{setSpinning(!spinning);handle.current?.rotate(!spinning);}}><Icon name={spinning?'pause':'360'} size={20}/>{spinning?'Jeda':'Putar'}</button></div></div>
 </div>;
}
