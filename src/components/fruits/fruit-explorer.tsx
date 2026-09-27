'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { FRUITS, FRUIT_BY_ID, FRUIT_GROUPS, FRUIT_SOURCES, fruitMatches, type Fruit } from '@/lib/fruits/catalog';
import { FRUIT_ARTWORK } from '@/lib/fruits/artwork';
import { useFruitSession } from '@/lib/fruits/progress';
import { Avatar, Icon } from '@/components/ui';
import { useMe, useUI } from '@/lib/store';
import { FruitAudio } from './fruit-audio';
import './fruits.css';
const Viewer=dynamic(()=>import('./fruit-viewer'),{ssr:false,loading:()=> <div className="fruit-stage fruit-loading" role="status"><Icon name="nutrition" size={54}/><p>Menyiapkan buah 3D…</p></div>});

export default function FruitExplorer() {
 const me=useMe(),openSheet=useUI(s=>s.openSheet);
 const [selected,setSelected]=useState<string|null>(null),[query,setQuery]=useState(''),[group,setGroup]=useState('all'),[autoPlay,setAutoPlay]=useState(false);
 const savedScroll=useRef(0),fromCatalog=useRef(false),lastCard=useRef<string|null>(null);
 const fruit=selected?FRUIT_BY_ID.get(selected):undefined;
 const list=useMemo(()=>FRUITS.filter(f=>(group==='all'||f.group===group)&&fruitMatches(f,query)),[group,query]);
 useFruitSession(me.id);
 useEffect(()=>{
  const read=()=>{const id=new URL(window.location.href).searchParams.get('buah');setSelected(id&&FRUIT_BY_ID.has(id)?id:null);setAutoPlay(false);if(!id)requestAnimationFrame(()=>{window.scrollTo(0,savedScroll.current);if(lastCard.current)document.getElementById(`fruit-card-${lastCard.current}`)?.focus({preventScroll:true});});};
  read();window.addEventListener('popstate',read);return()=>window.removeEventListener('popstate',read);
 },[]);
 function choose(id:string) {
  const url=new URL(window.location.href);url.searchParams.set('buah',id);
  if(!selected){savedScroll.current=window.scrollY;lastCard.current=id;fromCatalog.current=true;window.history.pushState({fruitDetail:true},'',url);}
  else window.history.replaceState(null,'',url);
  setSelected(id);setAutoPlay(true);window.scrollTo(0,0);
 }
 function back(){
  setAutoPlay(false);
  if(fromCatalog.current){fromCatalog.current=false;window.history.back();return;}
  const url=new URL(window.location.href);url.searchParams.delete('buah');window.history.replaceState(null,'',url);setSelected(null);
 }
 return <main className="fruit-app">
  <header className="fruit-header">
   {fruit?<button className="fruit-back" onClick={back}><Icon name="arrow_back" size={22}/><span>Katalog buah</span></button>:<Link href="/beranda/edukasi" className="fruit-back"><Icon name="arrow_back" size={22}/><span>Edukasi</span></Link>}
   <Link href="/beranda" className="fruit-brand">RINOYA<span>●</span></Link>
   <button className="fruit-profile" onClick={()=>openSheet({kind:'members'})} aria-label="Ganti profil"><Avatar name={me.name} c={me.c} size={32}/><span className="fruit-profile-name">{me.name}</span><Icon name="expand_more" size={20}/></button>
  </header>
  <div className="fruit-page">
   {fruit?<FruitDetail key={fruit.id} fruit={fruit} admin={me.admin} memberId={me.id} autoPlay={autoPlay} choose={choose}/>:<>
    <div className="fruit-title-row"><div><div className="fruit-eyebrow"><Icon name="eco" size={18}/>KENALI DUNIA DI SEKITARMU</div><h1>Kebun Buah <span>3D</span></h1><p>Kenali buahnya. Putar modelnya. Dengarkan ceritanya!</p></div><div className="fruit-count"><Icon name="nutrition" size={28}/><strong>{FRUITS.length}<small>buah untuk dijelajahi</small></strong></div></div>
    <section aria-label="Katalog buah" className="fruit-catalog">
     <div className="fruit-catalog-toolbar"><div className="fruit-filters" aria-label="Kelompok buah">{FRUIT_GROUPS.map(g=><button key={g.id} aria-pressed={group===g.id} onClick={()=>setGroup(g.id)}>{g.name}</button>)}</div><label className="fruit-search"><Icon name="search" size={22}/><input type="search" aria-label="Cari buah" placeholder="Cari nama buah…" value={query} onChange={e=>setQuery(e.target.value)}/></label></div>
     <div className="fruit-catalog-caption"><h2>Pilih buah, mulai petualangan!</h2><span role="status">{list.length} buah ditemukan</span></div>
     <div className="fruit-catalog-grid">
      {list.map((f,i)=><button key={f.id} id={`fruit-card-${f.id}`} className="fruit-card" onClick={()=>choose(f.id)} aria-label={`Kenali ${f.name}`}>
       <div className="fruit-card-picture"><Image src={FRUIT_ARTWORK[f.id].thumb} width={512} height={512} alt={`Buah ${f.name}`} unoptimized priority={i<4}/><span className="fruit-card-3d"><Icon name="view_in_ar" size={16}/>3D</span></div>
       <div className="fruit-card-copy"><div><h3>{f.name}</h3><p>{f.english}</p></div><span className="fruit-card-arrow"><Icon name="arrow_forward" size={22}/></span></div>
      </button>)}
     </div>
     {!list.length&&<div className="fruit-no-results"><Icon name="search_off" size={40}/><h3>Buahnya belum ketemu.</h3><p>Coba nama yang lain atau lihat semua buah.</p><button className="fruit-button" onClick={()=>{setQuery('');setGroup('all');}}>Lihat semua buah</button></div>}
    </section>
   </>}
   <footer className="fruit-footer"><details><summary>Sumber belajar</summary>{FRUIT_SOURCES.map(s=><a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.name}<Icon name="open_in_new" size={15}/></a>)}<p>Gambar buah dibuat khusus untuk Rinoya Academy dengan GPT Image.</p></details>{me.admin&&<details className="fruit-recording-kit"><summary><Icon name="mic" size={18}/>Naskah & rekaman suara</summary><p>48 naskah buah, pembuka, dan penutup. Rekaman dapat ditambahkan satu per satu setelah dibuat.</p><div><a href="/fruits/narasi/paket-narasi-buah.zip" download>Unduh paket lengkap ZIP</a><a href="/fruits/narasi/narasi-buah.txt" download>Unduh semua naskah TXT</a><a href="/fruits/narasi/narasi-buah.csv" download>Unduh CSV</a><a href="/fruits/narasi/panduan-suara.txt" download>Panduan suara</a></div></details>}</footer>
  </div>
 </main>;
}
function FruitDetail({fruit,admin,memberId,autoPlay,choose}:{fruit:Fruit;admin:boolean;memberId:string;autoPlay:boolean;choose:(id:string)=>void}) {
 const [view,setView]=useState<'3d'|'photo'>('3d'),heading=useRef<HTMLHeadingElement>(null);
 const index=FRUITS.findIndex(f=>f.id===fruit.id),previous=FRUITS[(index-1+FRUITS.length)%FRUITS.length],next=FRUITS[(index+1)%FRUITS.length],photo=FRUIT_ARTWORK[fruit.id];
 useEffect(()=>{heading.current?.focus({preventScroll:true});},[]);
 return <>
  <div className="fruit-detail-heading"><div><span className="fruit-eyebrow">BUAH {String(index+1).padStart(2,'0')} DARI {FRUITS.length}</span><h1 tabIndex={-1} ref={heading}>{fruit.name}</h1><p>{fruit.english}</p></div><button className="fruit-surprise" onClick={()=>{const others=FRUITS.filter(f=>f.id!==fruit.id);choose(others[Math.floor(Math.random()*others.length)].id);}}><Icon name="shuffle" size={21}/>Pilihkan aku</button></div>
  <div className="fruit-detail-layout">
   <section className="fruit-detail-media" aria-label={`Galeri ${fruit.name}`}>
    <div className="fruit-media-tabs" role="tablist" aria-label="Pilih tampilan buah" onKeyDown={e=>{if(["ArrowLeft","ArrowRight","Home","End"].includes(e.key)){e.preventDefault();const next=e.key==="Home"?"3d":e.key==="End"?"photo":view==="3d"?"photo":"3d";setView(next);document.getElementById(`fruit-tab-${next}`)?.focus();}}}><button id="fruit-tab-3d" role="tab" tabIndex={view==='3d'?0:-1} aria-selected={view==='3d'} aria-controls="fruit-media-panel" onClick={()=>setView('3d')}><Icon name="view_in_ar" size={22}/>Putar 3D</button><button id="fruit-tab-photo" role="tab" tabIndex={view==='photo'?0:-1} aria-selected={view==='photo'} aria-controls="fruit-media-panel" onClick={()=>setView('photo')}><Icon name="photo_camera" size={22}/>Gambar buah</button></div>
    <div id="fruit-media-panel" role="tabpanel" aria-labelledby={`fruit-tab-${view}`}>
     {view==='3d'?<Viewer fruit={fruit}/>:<figure className="fruit-photo-stage">{photo?<Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} unoptimized priority/>:<p>Gambar buah sedang disiapkan.</p>}</figure>}
    </div>
    <p className="fruit-model-note">{view==='3d'?'Putar dan amati buah utuhnya. Bentuk dan warnanya mengacu pada gambar buah Rinoya Academy.':'Gambar realistis khusus Rinoya Academy. Buah utuh dan potongannya membantu kita mengenal bagian dalamnya.'}</p>
    {photo&&<details className="fruit-photo-credit"><summary>Tentang gambar {fruit.name}</summary><p>Ilustrasi realistis yang dibuat dengan GPT Image khusus untuk Rinoya Academy. Model 3D mengikuti jenis, bentuk, dan warna buah pada gambar. Bentuk serta warna buah di alam dapat bervariasi.</p></details>}
    <div className="fruit-pagination"><button className="fruit-button" onClick={()=>choose(previous.id)} aria-label={`Buah sebelumnya: ${previous.name}`}><Icon name="chevron_left"/>{previous.name}</button><span>Jelajahi buah lainnya</span><button className="fruit-button" onClick={()=>choose(next.id)} aria-label={`Buah berikutnya: ${next.name}`}>{next.name}<Icon name="chevron_right"/></button></div>
   </section>
   <aside className="fruit-info" aria-label={`Tentang ${fruit.name}`}>
    <div className="fruit-info-heading"><span><Icon name="menu_book" size={23}/></span><h2>Kenalan, yuk!</h2></div><p className="fruit-description">{fruit.description}</p>
    <dl className="fruit-facts"><div><dt><Icon name="palette" size={18}/>Warna kulit</dt><dd>{fruit.skin}</dd></div><div><dt><Icon name="nutrition" size={18}/>Daging buah</dt><dd>{fruit.flesh}</dd></div><div><dt><Icon name="sentiment_satisfied" size={18}/>Rasanya</dt><dd>{fruit.taste}</dd></div><div><dt><Icon name="spa" size={18}/>Bijinya</dt><dd>{fruit.seed}</dd></div></dl>
    <div className="fruit-did-you-know"><Icon name="lightbulb" size={25}/><div><h3>Tahu nggak?</h3><p>{fruit.fact}</p></div></div>
    <FruitAudio key={memberId} fruit={fruit} admin={admin} autoPlayOnOpen={autoPlay}/>
   </aside>
  </div>
 </>;
}
