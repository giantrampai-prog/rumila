"use client";

import { notFound } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import * as T from 'three';
import { ShipOverlay } from '@/components/angkasa/engine/ship';
import { EARTH_INTRO_SEC } from '@/components/angkasa/engine/fx';

/** Local, controllable inspection of the actual intro renderer. Never shipped as a public route. */
export default function LaunchReview() {
  if(process.env.NODE_ENV!=='development')notFound();
  const host=useRef<HTMLDivElement>(null),progress=useRef(.215),running=useRef(false);
  const [value,setValue]=useState(.215),[play,setPlay]=useState(false),[stats,setStats]=useState('Menyiapkan aset…');
  useEffect(()=>{
    const el=host.current!;
    const renderer=new T.WebGLRenderer({antialias:true});
    renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));el.appendChild(renderer.domElement);
    const camera=new T.PerspectiveCamera(42,1,.02,2000),ship=new ShipOverlay(renderer),sun=new T.Vector3(0,0,-20);
    ship.visible=true;ship.setIntro(progress.current);
    const resize=()=>{renderer.setSize(el.clientWidth,el.clientHeight);camera.aspect=el.clientWidth/el.clientHeight;camera.updateProjectionMatrix();};
    const ro=new ResizeObserver(resize);ro.observe(el);resize();
    let last=performance.now(),raf=0,n=0,elapsed=0;
    const loop=(now:number)=>{
      raf=requestAnimationFrame(loop);const dt=Math.min((now-last)/1000,.06);last=now;
      if(running.current&&ship.introReady){progress.current=Math.min(.549,progress.current+dt/EARTH_INTRO_SEC);setValue(progress.current);if(progress.current>=.549){running.current=false;setPlay(false);}}
      ship.setIntro(progress.current);ship.update(dt,camera,sun,0,0,false);ship.renderGround(renderer);
      n++;elapsed+=dt;if(elapsed>1){setStats(`${ship.introReady?'Aset siap':'Memuat aset'} · ${(n/elapsed).toFixed(0)} fps · ${renderer.info.render.calls} draw · ${(renderer.info.render.triangles/1000).toFixed(0)}k segitiga`);n=0;elapsed=0;}
    };raf=requestAnimationFrame(loop);
    return()=>{cancelAnimationFrame(raf);ro.disconnect();ship.dispose();renderer.dispose();renderer.domElement.remove();};
  },[]);
  return <main className="fixed inset-0 bg-black text-white"><div ref={host} className="absolute inset-0"/>
    <div className="absolute inset-x-4 bottom-4 mx-auto flex max-w-2xl flex-wrap items-center gap-3 rounded-2xl bg-black/70 p-4 text-sm backdrop-blur">
      <button className="rounded-xl bg-white px-4 py-2 font-bold text-black" onClick={()=>{running.current=!play;setPlay(!play);}}>{play?'Jeda':'Putar peluncuran'}</button>
      <label className="flex flex-1 items-center gap-2">Waktu pembuka<input className="min-w-24 flex-1" aria-label="Waktu pembuka" type="range" min="0" max="0.549" step="0.001" value={value} onChange={e=>{progress.current=Number(e.target.value);setValue(progress.current);}}/></label>
      <output className="w-full text-xs">{stats}</output>
    </div>
  </main>;
}
