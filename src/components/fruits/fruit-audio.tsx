'use client';
import { useEffect, useRef, useState } from 'react';
import type { Fruit } from '@/lib/fruits/catalog';
import { fruitNarration } from '@/lib/fruits/narration';
import { audioFileInfo, fruitAudioPath, readAudioManifest, FRUIT_AUDIO_STORAGE_READY } from '@/lib/fruits/audio';
import { useCloud } from '@/lib/supabase/family';
import { supabase } from '@/lib/supabase/client';
import { Icon } from '@/components/ui';

export function FruitAudio({fruit,admin,autoPlayOnOpen=false}:{fruit:Fruit;admin:boolean;autoPlayOnOpen?:boolean}) {
 const familyId=useCloud(s=>s.familyId),[retry,setRetry]=useState(0),[state,setState]=useState<{fruitId:string;url?:string;loading:boolean;error?:string}>({fruitId:fruit.id,loading:true});
 useEffect(()=>{
  let alive=true;const abort=new AbortController();let refresh:ReturnType<typeof setTimeout>|undefined;
  setState({fruitId:fruit.id,loading:true});
  async function load(){
   let url:string|undefined;
   try{
    if(familyId&&FRUIT_AUDIO_STORAGE_READY){const bucket=supabase().storage.from('fruit-audio');const {data,error}=await bucket.list(`${familyId}/fruits`,{limit:100,search:`${fruit.id}.`,sortBy:{column:'updated_at',order:'desc'}});if(error)throw error;
     const file=data?.find(f=>new RegExp(`^${fruit.id}\\.(mp3|wav|m4a)$`).test(f.name));
     if(file){const signed=await bucket.createSignedUrl(`${familyId}/fruits/${file.name}`,3600);if(signed.error)throw signed.error;url=signed.data.signedUrl;}
    }
    if(!url){const response=await fetch('/fruits/audio/manifest.json',{cache:'no-store',signal:abort.signal});if(!response.ok)throw new Error();url=readAudioManifest(await response.json()).tracks[fruit.id];}
    if(alive){setState({fruitId:fruit.id,url,loading:false});if(url)refresh=setTimeout(()=>setRetry(v=>v+1),50*60*1000);}
   }catch(e){if(alive&&!(e instanceof DOMException&&e.name==='AbortError'))setState({fruitId:fruit.id,loading:false,error:'Suara belum berhasil dimuat. Coba periksa koneksimu.'});}
  }
  void load();return()=>{alive=false;abort.abort();clearTimeout(refresh);};
 },[familyId,fruit.id,retry]);
 const current=state.fruitId===fruit.id?state:{fruitId:fruit.id,loading:true},url=current.url;
 return <section className="fruit-audio" aria-label={`Narasi ${fruit.name}`}><div className="fruit-audio-title"><span className="fruit-audio-symbol"><Icon name="headphones" size={24}/></span><div><h3>Dengarkan ceritanya</h3><p>{url?'Yuk, kenalan sambil mendengarkan!':current.error??(current.loading?'Memeriksa cerita suara…':'Suara sedang disiapkan. Baca ceritanya dulu, yuk!')}</p></div></div>
 {current.error?<button className="fruit-button" onClick={()=>setRetry(v=>v+1)}>Muat ulang suara</button>:url?<Recording key={`${fruit.id}:${url}`} url={url} name={fruit.name} autoPlay={autoPlayOnOpen}/>:<button className="fruit-button fruit-listen" disabled><Icon name="volume_up" size={20}/>{current.loading?'Memuat suara…':'Suara belum tersedia'}</button>}
 <details className="fruit-story" key={fruit.id}><summary>Baca cerita {fruit.name}<Icon name="expand_more" size={20}/></summary><p>{fruitNarration(fruit)}</p>{admin&&<a href={`/fruits/narasi/per-buah/${fruit.id}.txt`} download>Unduh naskah {fruit.name}<Icon name="download" size={18}/></a>}</details>
 {admin&&familyId&&<UploadRecording key={`${familyId}:${fruit.id}`} familyId={familyId} fruit={fruit} onUploaded={()=>setRetry(v=>v+1)} hasAudio={!!url}/>}
 </section>;
}
function Recording({url,name,autoPlay}:{url:string;name:string;autoPlay:boolean}) {
 const audio=useRef<HTMLAudioElement>(null),[error,setError]=useState(false),[retry,setRetry]=useState(0),[blocked,setBlocked]=useState(false);
 useEffect(()=>{let alive=true;const element=audio.current;if(autoPlay&&element)void element.play().catch(()=>{if(alive)setBlocked(true);});return()=>{alive=false;element?.pause();};},[autoPlay,url,retry]);
 useEffect(()=>{const element=audio.current;const pause=()=>{if(document.hidden)element?.pause();};document.addEventListener('visibilitychange',pause);return()=>{document.removeEventListener('visibilitychange',pause);element?.pause();};},[url,retry]);
 return <>{blocked&&<p className="fruit-autoplay-note" role="status">Ketuk tombol putar untuk mendengarkan ceritanya.</p>}{error?<div role="alert"><p>Suara belum bisa diputar. Periksa koneksimu, lalu coba lagi.</p><button className="fruit-button" onClick={()=>{setError(false);setRetry(v=>v+1);}}>Coba lagi</button></div>:<audio key={retry} ref={audio} controls preload="none" src={url} aria-label={`Putar cerita ${name}`} onError={()=>setError(true)} onPlay={()=>setBlocked(false)}/>}</>;
}
function UploadRecording({fruit,familyId,onUploaded,hasAudio}:{fruit:Fruit;familyId:string;onUploaded:()=>void;hasAudio:boolean}) {
 const [busy,setBusy]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState(false),alive=useRef(true);
 useEffect(()=>{alive.current=true;return()=>{alive.current=false;};},[]);
 async function upload(file:File){
  if(!FRUIT_AUDIO_STORAGE_READY)return;
  setBusy(true);setMessage('Mengunggah rekaman…');setError(false);
  try{
   const info=audioFileInfo(file.name,file.size,new Uint8Array(await file.slice(0,16).arrayBuffer()));
   const path=fruitAudioPath(familyId,fruit.id,info.extension);
   const {error}=await supabase().storage.from('fruit-audio').upload(path,file,{contentType:info.mime,upsert:true,cacheControl:'0'});if(error)throw error;
   if(alive.current){setMessage(`Rekaman ${fruit.name} tersimpan. Siap diputar!`);onUploaded();}
  }catch(e){if(alive.current){setError(true);setMessage(e instanceof Error&&/Pilih rekaman|Gunakan berkas|Tujuan rekaman/.test(e.message)?e.message:'Rekaman belum tersimpan. Periksa koneksi lalu coba lagi.');}}
  finally{if(alive.current)setBusy(false);}
 }
 return <details className="fruit-upload"><summary><Icon name="cloud_upload" size={17}/>{hasAudio?'Ganti rekaman':'Unggah rekaman'} · Admin</summary><p>Rekaman untuk <strong>{fruit.name}</strong>, tersimpan di akun Rinoya Academy keluargamu. MP3, WAV, atau M4A, maksimal 20 MB.</p>{!FRUIT_AUDIO_STORAGE_READY&&<p>Unggah suara akan tersedia setelah penyimpanan diaktifkan. Naskahnya sudah bisa kamu unduh.</p>}<label className="fruit-upload-label"><span>{busy?'Sedang mengunggah…':`Pilih audio ${fruit.name}`}</span><input type="file" accept=".mp3,.wav,.m4a,audio/mpeg,audio/wav,audio/mp4" disabled={busy||!FRUIT_AUDIO_STORAGE_READY} aria-label={`Unggah audio ${fruit.name}`} onChange={e=>{const file=e.target.files?.[0];e.target.value='';if(file)void upload(file);}}/></label>{message&&<p role={error?'alert':'status'} className={error?'fruit-upload-error':''}>{message}</p>}</details>;
}
