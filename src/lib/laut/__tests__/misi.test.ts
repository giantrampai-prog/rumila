import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { BIOTA, TUR_LAUT, ZONA_LAUT, depthToY, yToDepth, zoneAtDepth } from '../misi';
import { lineAtTime, validTrack } from '../narration';

describe('ekspedisi laut v2', () => {
  it('menghubungkan seluruh bab hingga Challenger Deep, kemudian kembali ke permukaan', () => {
    expect(new Set(TUR_LAUT.map(s=>s.id)).size).toBe(TUR_LAUT.length);
    for(let i=1;i<TUR_LAUT.length;i++) expect(TUR_LAUT[i].depth[0]).toBe(TUR_LAUT[i-1].depth[1]);
    expect(TUR_LAUT.find(s=>s.id==='challenger-deep')?.depth[1]).toBe(10935);
    expect(TUR_LAUT.at(-1)!.depth[1]).toBe(0);
  });
  it('memakai kapal selam sebelum perjalanan laut dalam dan tidak menaruh ikan di Challenger Deep',()=>{
    for(const s of TUR_LAUT) if(Math.max(...s.depth)>20) expect(s.ride).toBe('kapal-selam');
    for(const b of BIOTA){const stop=TUR_LAUT.find(s=>s.id===b.stop)!;expect(stop).toBeDefined();expect(stop.depth[1]).toBeLessThan(8336);expect(existsSync(`public${b.img}`)).toBe(true);}
  });
  it('konversi dunia dan batas zona akurat, terpisah dari skala tampilan',()=>{
    for(const d of [0,16,200,1000,4500,6500,10935]) expect(yToDepth(depthToY(d))).toBeCloseTo(d,6);
    expect(ZONA_LAUT.map(z=>z.min)).toEqual([0,200,1000,4000,6000]);
    expect(zoneAtDepth(999).name).toBe('Zona senja');expect(zoneAtDepth(1000).name).toBe('Zona tengah malam');
  });
  it('paket rekaman sama dengan teks yang tampil di aplikasi',()=>{
    TUR_LAUT.forEach((s,i)=>expect(readFileSync(`docs/laut/narasi-v2/${String(i+1).padStart(2,'0')}-${s.id}.txt`,'utf8').trim()).toBe(s.lines.join('\n\n')));
    expect(existsSync('public/laut/narasi-v2.zip')).toBe(true);
    expect(JSON.parse(readFileSync('public/laut/voice/v2/manifest.json','utf8')).version).toBe(2);
  });
});

describe('rekaman dan subtitle',()=>{
  it('menerima hanya cue versi baru yang lengkap, naik berurutan dan berawal nol',()=>{
    expect(validTrack({src:'/laut/voice/v2/persiapan.mp3',cues:[0,12,28]},3)).toBe(true);
    for(const cues of [[1,12,28],[0,12,12],[0,-1,20],[0,NaN,28],[0,12]]) expect(validTrack({src:'/laut/voice/v2/persiapan.mp3',cues},3)).toBe(false);
    expect(validTrack({src:'/laut/voice/tur-01.m4a',cues:[0,12,28]},3)).toBe(false);
    expect(validTrack({src:'javascript:alert(1)',cues:[0,12,28]},3)).toBe(false);
  });
  it('memilih kalimat yang benar ketika audio dilompatkan atau berada pada batas cue',()=>{
    const cues=[0,8.2,17.5];
    expect(lineAtTime(cues,0)).toBe(0);expect(lineAtTime(cues,8.19)).toBe(0);expect(lineAtTime(cues,8.2)).toBe(1);expect(lineAtTime(cues,100)).toBe(2);
  });
});
