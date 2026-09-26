'use client';
import { useEffect, useState } from 'react';
import { useMe } from '@/lib/store';
import { validateManifest } from '@/lib/anatomy/state';
import type { Manifest } from '@/lib/anatomy/types';
import { KidBody } from '@/components/anatomy/kid-body';
import '@/components/anatomy/anatomy.css';
export default function AnatomyPage(){
 const me=useMe();const [manifest,setManifest]=useState<Manifest|null>(null),[error,setError]=useState(false),[attempt,setAttempt]=useState(0);
 useEffect(()=>{const controller=new AbortController();setError(false);fetch('/anatomy/manifest.json',{signal:controller.signal}).then(r=>{if(!r.ok)throw new Error('Manifest');return r.json();}).then((m:Manifest)=>{const errors=validateManifest(m);if(errors.length)throw new Error(errors.join('; '));setManifest(m);}).catch(e=>{if(e.name!=='AbortError')setError(true);});return()=>controller.abort();},[attempt]);
 if(!manifest)return <main className="anatomy-boot"><h1>Jelajah Tubuh 3D</h1>{error?<><p>Katalog belum dapat dimuat.</p><button className="anatomy-button" onClick={()=>setAttempt(n=>n+1)}>Coba lagi</button></>:<p role="status">Menyiapkan ruang eksplorasi…</p>}</main>;
 return <KidBody key={me.id} manifest={manifest} memberId={me.id}/>;
}
