'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { RoundBtn } from '@/components/angkasa/kid-space';
import { Icon } from '@/components/ui';
import { installAudioUnlock } from '@/lib/audio-unlock';
import { BIOTA, TUR_LAUT, ZONA_LAUT, zoneAtDepth } from '@/lib/laut/misi';
import { LautEngine, useLaut } from './engine';

const BALOO = 'var(--ff-baloo), system-ui, sans-serif';
const fmt = (n: number) => Math.round(n).toLocaleString('id-ID');

function DepthMeter() {
  const depth = useLaut(s => s.depth);
  const zone = zoneAtDepth(depth);
  const i = ZONA_LAUT.indexOf(zone);
  const k = (i + Math.min(1, (depth-zone.min)/(zone.max-zone.min))) / ZONA_LAUT.length;
  return <aside className="pointer-events-none absolute right-3 top-28 hidden flex-col items-end gap-2 text-white sm:flex sm:right-5" aria-label={`Kedalaman ${fmt(depth)} meter, ${zone.name}`}>
    <div className="rounded-2xl border border-white/15 bg-[#061d32]/65 px-4 py-3 backdrop-blur-md">
      <div className="text-[10px] font-extrabold uppercase tracking-[.18em] text-cyan-200">Kedalaman</div>
      <div className="text-[30px] leading-tight" style={{fontFamily:BALOO,fontWeight:800}}>{fmt(depth)} <span className="text-sm text-cyan-100">m</span></div>
      <div className="mt-1 text-xs font-bold text-cyan-100">{zone.name}</div>
    </div>
    <div className="relative mr-3 h-[28vh] min-h-32 w-2 rounded-full border border-white/20" aria-hidden>
      {ZONA_LAUT.map(z => <div key={z.name} className="h-1/5" style={{background:z.color}} />)}
      <span className="absolute -left-1 h-4 w-4 -translate-y-1/2 rounded-full border-[3px] border-white bg-orange-400 shadow-lg" style={{top:`${k*100}%`}} />
    </div>
    <span className="text-[10px] text-white/60">Skema zona · bukan skala jarak</span>
  </aside>;
}

function ChapterMap({ engine, close }: {engine: LautEngine; close: () => void}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const stop = useLaut(s=>s.stop);
  useEffect(()=>{ dialog.current?.showModal(); },[]);
  return <dialog ref={dialog} onClose={close} className="pointer-events-auto m-auto max-h-[88dvh] w-[min(92vw,660px)] overflow-hidden rounded-[28px] bg-[#f9fcfd] p-0 text-[#2b1d4e] shadow-2xl backdrop:bg-[#031322]/80 backdrop:backdrop-blur-sm">
    <div className="flex items-center justify-between border-b border-slate-100 p-5">
      <div><div className="text-xs font-extrabold uppercase tracking-widest text-teal-600">Peta ekspedisi</div><h2 className="text-2xl font-extrabold" style={{fontFamily:BALOO}}>Ke mana kita menjelajah?</h2></div>
      <button autoFocus onClick={()=>dialog.current?.close()} aria-label="Tutup peta" className="rounded-full bg-slate-100 p-3"><Icon name="close" size={22}/></button>
    </div>
    <div className="max-h-[62dvh] space-y-2 overflow-y-auto p-4">
      {TUR_LAUT.map((s,i)=><button key={s.id} aria-current={i===stop?'step':undefined} onClick={()=>{engine.go(i);dialog.current?.close();}} className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left transition-colors hover:border-teal-300 ${i===stop?'border-teal-400 bg-teal-50':'border-transparent bg-white'}`}>
        <span className={`flex size-9 shrink-0 items-center justify-center rounded-full font-extrabold ${i===stop?'bg-teal-600 text-white':'bg-slate-100 text-slate-500'}`}>{i+1}</span>
        <span className="flex-1"><span className="block font-extrabold">{s.title}</span><span className="block text-xs text-slate-500">{s.label}</span></span><Icon name="chevron_right" size={20}/>
      </button>)}
    </div>
    <p className="border-t border-slate-100 px-5 py-3 text-xs leading-relaxed text-slate-500">Perjalanan virtual lintas habitat. Ukuran, jarak, dan waktu disederhanakan. <a href="/laut/narasi-v2.zip" className="font-bold text-teal-700 underline" download>Unduh naskah narasi</a></p>
  </dialog>;
}

function TourOverlay({engine}:{engine:LautEngine}) {
  const {stop,progress,playing,finished,line,source,muted,view,depth}=useLaut();
  const [map,setMap]=useState(false);
  const [captions,setCaptions]=useState(true);
  const resume=useRef(false);
  const s=TUR_LAUT[stop];
  const control='flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full bg-white/10 px-3 text-sm font-extrabold text-white transition hover:bg-white/20 disabled:opacity-30';
  useEffect(()=>{
    const key=(e:KeyboardEvent)=>{
      if(map || (e.target instanceof HTMLElement && /INPUT|TEXTAREA|BUTTON|A/.test(e.target.tagName)))return;
      if(e.code==='Space'){e.preventDefault();engine.setPlaying(!useLaut.getState().playing);}
      if(e.code==='ArrowRight')engine.go(useLaut.getState().stop+1);
      if(e.code==='ArrowLeft')engine.go(useLaut.getState().stop-1);
    }; window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);
  },[engine,map]);
  return <div className="pointer-events-none absolute inset-0 text-white">
    <div className="absolute inset-x-0 top-0 flex gap-1 px-4 pt-2" aria-label={`Bab ${stop+1} dari ${TUR_LAUT.length}`}>
      {TUR_LAUT.map((c,i)=><div key={c.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/15"><div className="h-full bg-[#ffd15c]" style={{width:i<stop?'100%':i===stop?`${progress*100}%`:'0%'}}/></div>)}
    </div>
    <header className="absolute inset-x-0 top-6 flex items-start justify-between gap-3 px-4 sm:px-6">
      <div className="min-w-0 drop-shadow-lg"><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-cyan-100">Ekspedisi laut · {String(stop+1).padStart(2,'0')} / {TUR_LAUT.length}</p><h1 className="mt-1 max-w-[70vw] text-[23px] leading-tight sm:text-[32px]" style={{fontFamily:BALOO,fontWeight:800}}>{s.title}</h1><p className="mt-1 text-xs font-bold text-cyan-100 sm:text-sm"><span className="hidden sm:inline">{s.label}</span><span className="sm:hidden">{s.set==='kapal'?'Di atas kapal':`${zoneAtDepth(depth).name} · ${fmt(depth)} m`}</span></p></div>
      <RoundBtn icon="close" label="Keluar tur" onClick={()=>engine.setMode('jelajah')}/>
    </header>
    {s.set!=='kapal'&&<DepthMeter/>}
    {view==='jendela'&&s.ride==='kapal-selam'&&<div className="absolute inset-0 rounded-[12%] border-[14px] border-[#142c3a]/40 shadow-[inset_0_0_90px_20px_rgba(2,16,30,.5)]" aria-hidden/>}
    <div className="absolute bottom-0 inset-x-0 flex flex-col items-center gap-3 bg-gradient-to-t from-[#031627]/95 via-[#031627]/40 to-transparent px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-10 sm:gap-4">
      <div className="max-w-[760px] text-center">
        <p className="mb-2 text-xs font-bold text-[#ffe4a0] sm:text-sm"><Icon name="search" size={15} className="mr-1 inline"/>{s.prompt}</p>
        {captions&&<div className="rounded-[20px] border border-white/15 bg-[#061d32]/80 px-4 py-3 shadow-lg backdrop-blur-md sm:px-6"><p className="mb-1 text-[10px] font-extrabold uppercase tracking-[.18em] text-cyan-200">Agam · {source==='rekaman'?'Narasi':source==='perangkat'?'Suara perangkat':'Baca bersama'}</p><p className="text-[14px] font-bold leading-relaxed sm:text-[17px]">{s.lines[line]??s.lines[0]}</p></div>}
      </div>
      <div className="pointer-events-auto flex max-w-full items-center gap-1 rounded-full border border-white/15 bg-[#071a2b]/95 p-1.5 shadow-xl backdrop-blur sm:gap-2">
        <button className={control} disabled={stop===0} aria-label="Bab sebelumnya" onClick={()=>engine.go(stop-1)}><Icon name="chevron_left" size={24}/></button>
        <button className={`${control} !bg-[#ff8718] !px-4 sm:!px-5`} aria-label={playing?'Jeda tur':'Lanjutkan tur'} onClick={()=>engine.setPlaying(!playing)}><Icon name={playing?'pause':'play_arrow'} size={25}/><span className="hidden sm:inline">{playing?'Jeda':'Lanjut'}</span></button>
        <button className={control} disabled={stop===TUR_LAUT.length-1} aria-label="Bab berikutnya" onClick={()=>engine.go(stop+1)}><Icon name="chevron_right" size={24}/></button>
        <span className="mx-1 h-6 w-px bg-white/15"/>
        <button className={control} aria-label="Buka peta ekspedisi" onClick={()=>{resume.current=playing;engine.setPlaying(false);setMap(true);}}><Icon name="map" size={21}/><span className="hidden sm:inline">Peta</span></button>
        <button className={control} aria-label={muted?'Nyalakan narasi':'Bisukan narasi'} aria-pressed={muted} onClick={()=>engine.setMuted(!muted)}><Icon name={muted?'volume_off':'volume_up'} size={21}/></button>
        <button className={`${control} hidden sm:flex`} aria-label="Tampilkan teks narasi" aria-pressed={captions} onClick={()=>setCaptions(!captions)}><Icon name="subtitles" size={21}/></button>
        {s.ride==='kapal-selam'&&<button className={control} aria-label={view==='cinema'?'Lihat dari jendela':'Lihat dari luar kapal'} aria-pressed={view==='jendela'} onClick={()=>engine.setView(view==='cinema'?'jendela':'cinema')}><Icon name="visibility" size={21}/></button>}
      </div>
    </div>
    {map&&<ChapterMap engine={engine} close={()=>{setMap(false);if(resume.current)engine.setPlaying(true);}}/>}
    {finished&&<div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-[#021626]/75 p-4 backdrop-blur-sm"><div className="max-w-md rounded-[30px] bg-white p-7 text-center text-[#2b1d4e] shadow-xl"><div className="text-5xl">🌊</div><h2 className="my-3 text-3xl font-extrabold" style={{fontFamily:BALOO}}>Penjelajah laut hebat!</h2><p className="mb-5 text-sm leading-relaxed text-slate-500">Dari karang hingga palung, setiap kedalaman punya cerita. Mana yang ingin kamu kunjungi lagi?</p><div className="flex justify-center gap-4"><RoundBtn icon="replay" label="Ulangi" tone="orange" onClick={()=>{engine.go(0);engine.setPlaying(true);}}/><RoundBtn icon="check" label="Jelajah bebas" tone="purple" onClick={()=>engine.setMode('jelajah')}/></div></div></div>}
  </div>;
}

function Dock({engine}:{engine:LautEngine}) {
  const focus=useLaut(s=>s.focus);
  const b=BIOTA.find(x=>x.id===focus);
  return <div className="flex flex-col items-center gap-3">
    {b&&<section className="pointer-events-auto flex max-w-[620px] gap-3 rounded-[24px] border border-white/20 bg-[#061d32]/90 p-4 text-white backdrop-blur-md"><Image src={b.img} alt="" width={88} height={72} unoptimized className="h-[72px] w-[88px] rounded-2xl object-cover"/><div><h2 style={{fontFamily:BALOO}} className="text-xl font-extrabold">{b.name}</h2><p className="text-sm text-cyan-50">{b.desc}</p><p className="mt-1 text-xs text-[#ffe4a0]">{b.fact}</p></div></section>}
    <div className="pointer-events-auto w-full overflow-x-auto rounded-[24px] border border-white/15 bg-[#061d32]/70 p-2 backdrop-blur-md"><div className="mx-auto flex w-max gap-1">{BIOTA.map(b=><button key={b.id} aria-pressed={focus===b.id} onClick={()=>engine.focus(b.id)} className={`flex w-[80px] shrink-0 flex-col items-center gap-1 rounded-2xl p-1.5 ${focus===b.id?'bg-white/20 ring-2 ring-[#ffd15c]':''}`}><Image src={b.img} alt="" width={66} height={46} unoptimized className="h-[46px] rounded-xl object-cover"/><span className="text-center text-[11px] font-extrabold leading-tight text-white">{b.name}</span></button>)}</div></div>
  </div>;
}

export function LautSpace() {
  const host=useRef<HTMLDivElement>(null);
  const [engine,setEngine]=useState<LautEngine|null>(null);
  const [error,setError]=useState(false);
  const mode=useLaut(s=>s.mode),focus=useLaut(s=>s.focus);
  const router=useRouter();
  useEffect(()=>{
    installAudioUnlock();
    useLaut.setState({mode:'jelajah',focus:null,playing:false,finished:false,stop:0,progress:0,depth:0,line:0,source:'teks',muted:false,view:'cinema'});
    let e:LautEngine;
    try{e=new LautEngine(host.current!);setEngine(e);}catch{setError(true);return;}
    return()=>e.dispose();
  },[]);
  return <div className="theme-play fixed inset-0 overflow-hidden bg-[#062f45]" style={{fontFamily:'var(--ff-nunito), system-ui, sans-serif'}}>
    <div ref={host} className="absolute inset-0" role="img" aria-label="Dunia bawah laut tiga dimensi. Pilih hewan atau mulai ekspedisi."/>
    {!engine&&!error&&<div className="absolute inset-0 flex items-center justify-center text-white"><p className="animate-pulse text-lg font-bold">Menyiapkan dunia bawah laut…</p></div>}
    {error&&<div className="absolute inset-0 flex items-center justify-center p-6 text-center text-white"><div><h1 className="text-2xl font-bold">Tampilan 3D belum bisa dibuka</h1><p className="my-3">Coba muat ulang atau gunakan browser yang mendukung WebGL.</p><a href="/laut/narasi-v2.zip" download className="rounded-full bg-white px-5 py-3 font-bold text-[#2b1d4e]">Unduh cerita ekspedisi</a></div></div>}
    {engine&&(mode==='tur'?<TourOverlay engine={engine}/>:<div className="pointer-events-none absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-[#03223d]/50 via-transparent to-[#031627]/50 p-3 sm:p-5">
      <header className="flex items-start justify-between gap-4"><RoundBtn icon={focus?'arrow_back':'home'} label={focus?'Kembali':'Keluar'} onClick={()=>focus?engine.focus(null):router.push('/beranda/angkasa')}/><div className="text-center text-white"><p className="mt-2 text-[10px] font-extrabold uppercase tracking-[.22em] text-cyan-100">Rinoya · dunia pengetahuan</p><h1 className="mt-1 text-[28px] leading-tight sm:text-4xl" style={{fontFamily:BALOO,fontWeight:800}}>Jelajah Laut</h1><p className="mt-1 hidden text-sm font-bold text-cyan-100 sm:block">Dari taman karang hingga hampir 11 kilometer di bawah laut.</p></div><RoundBtn icon="scuba_diving" label="Mulai ekspedisi" tone="orange" onClick={()=>engine.setMode('tur')}/></header>
      <DepthMeter/>
      <footer className="flex flex-col gap-3"><p className="text-center text-xs font-bold text-white/80">Geser untuk melihat sekitar · Pilih hewan untuk mengenal lebih dekat</p><Dock engine={engine}/></footer>
    </div>)}
  </div>;
}
