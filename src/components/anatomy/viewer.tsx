'use client';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { Manifest } from '@/lib/anatomy/types';
import type { CameraPose, ExplorerState } from '@/lib/anatomy/state';
import { AnatomyEngine, type LoadStatus } from './engine';
export interface ViewerHandle { focus: (id: string) => void; camera: () => CameraPose; preset: (view: 'front'|'back'|'left'|'right')=>void; zoom: (factor: number)=>void }
interface Props { manifest: Manifest; state: ExplorerState; onSelect: (id: string)=>void; onDetach:(id:string,amount:number)=>void }
export const Viewer = forwardRef<ViewerHandle, Props>(function Viewer({manifest,state,onSelect,onDetach},ref){
 const host=useRef<HTMLDivElement>(null),labels=useRef<HTMLDivElement>(null),engine=useRef<AnatomyEngine|null>(null);
 const recoveryCamera=useRef<CameraPose|null>(null);
 const latest=useRef({state,onSelect,onDetach});latest.current={state,onSelect,onDetach};
 const [statuses,setStatuses]=useState<Record<string,LoadStatus>>({}),[failure,setFailure]=useState(''),[attempt,setAttempt]=useState(0),[direction,setDirection]=useState('Depan');
 useImperativeHandle(ref,()=>({focus:id=>engine.current?.focus(id),camera:()=>engine.current?.getCamera()??{position:[.25,.93,3.2],target:[0,.89,0]},preset:view=>engine.current?.preset(view),zoom:factor=>engine.current?.zoom(factor)}),[]);
 useEffect(()=>{
  if(!host.current||!labels.current)return;
  try{
   engine.current=new AnatomyEngine(host.current,labels.current,manifest,latest.current.state,{
    select:id=>latest.current.onSelect(id),detach:(id,amount)=>latest.current.onDetach(id,amount),
    status:(id,status)=>setStatuses(s=>({...s,[id]:status})),lost:()=>{recoveryCamera.current=engine.current?.getCamera()??null;setFailure('Tampilan 3D terhenti. Pulihkan untuk melanjutkan dari bagian yang sama.');},direction:setDirection,
   });
   if(recoveryCamera.current)engine.current.restoreCamera(recoveryCamera.current);
  }catch{setFailure('Perangkat ini belum dapat menampilkan WebGL. Materi dan daftar bagian tetap dapat dipelajari dalam mode 2D.');}
  return()=>{engine.current?.destroy();engine.current=null;};
 },[manifest,attempt]);
 useEffect(()=>{engine.current?.sync(state);},[state]);
 const loading=Object.entries(statuses).filter(([,s])=>s.state==='loading'),errors=Object.entries(statuses).filter(([,s])=>s.state==='error');
 return <>
  <div ref={host} className="anatomy-canvas" data-testid="anatomy-canvas" />
  <div ref={labels} className="anatomy-labels" />
  <div className="anatomy-orientation"><span aria-hidden>↑</span> {direction}<small>Kanan / kiri mengikuti tubuh model</small></div>
  {loading.length>0&&!failure&&<div role="status" className="anatomy-loading">{loading.some(([id])=>id.endsWith('-detail'))?'Memuat detail organ…':'Menyiapkan model…'} <progress max={100} value={loading.reduce((n,[,s])=>n+s.progress,0)/loading.length}/></div>}
  {errors.length>0&&!failure&&<div role="alert" className="anatomy-asset-errors">{errors.map(([id])=><div key={id}>Paket {id} belum termuat. <button onClick={()=>engine.current?.retry(id)}>Coba lagi</button></div>)}</div>}
  {failure&&<div className="anatomy-fallback" role="status"><span className="anatomy-eyebrow">MATERI 2D</span><h2>Belajar tetap bisa dilanjutkan</h2><p>{failure}</p>
    <svg viewBox="0 0 240 220" role="img" aria-label="Diagram lokasi organ: otak di kepala, paru dan jantung di dada, lambung dan ginjal di perut">
      <path d="M98 48 Q78 20 100 8 Q120 -1 140 8 Q162 20 142 48 L143 65 L173 78 L191 160 L172 165 L155 108 L154 213 L127 213 L120 155 L113 213 L86 213 L85 108 L68 165 L49 160 L67 78 L97 65Z" fill="#eadbd0" stroke="#9c8272"/>
      <ellipse cx="120" cy="24" rx="17" ry="12" fill="#bd8a83"/><text x="154" y="25">Otak</text><ellipse cx="106" cy="91" rx="12" ry="22" fill="#d78881"/><ellipse cx="134" cy="91" rx="12" ry="22" fill="#d78881"/><text x="165" y="92">Paru</text><path d="M120 101 Q113 87 121 91 Q130 86 130 95 L124 108Z" fill="#ac4c48"/><text x="163" y="116">Jantung</text><ellipse cx="133" cy="124" rx="12" ry="8" fill="#c19061"/>
    </svg>
    <p>Pilih nama pada daftar bagian untuk membaca definisinya.</p><button className="anatomy-button primary" onClick={()=>{setFailure('');setStatuses({});setAttempt(n=>n+1);}}>Pulihkan 3D</button></div>}
 </>;
});
