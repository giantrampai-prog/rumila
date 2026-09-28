import { afterEach, describe, expect, it, vi } from 'vitest';
import { SEA_RECORDING, SEA_TRACKS, SeaNarration } from '../narration';
import { TUR_LAUT } from '../misi';
afterEach(()=>vi.unstubAllGlobals());
function setup() {
  vi.stubGlobal('window',{});
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({version:2,tracks:{}})}));
  const n=new SeaNarration({});n.load(TUR_LAUT[0]);return n;
}
describe('jam narasi cadangan',()=>{
  it('tetap bisa menyelesaikan cerita tanpa suara perangkat atau server',()=>{
    const n=setup();n.play();for(let i=0;i<500;i++) n.tick(1);
    expect(n.tick(0).ended).toBe(true);expect(n.tick(0).source).toBe('teks');n.dispose();
  });
  it('jeda tidak memajukan kalimat dan pindah bab mengosongkan kemajuan lama',()=>{
    const n=setup();n.play();n.tick(5);n.pause();const paused=n.tick(0);
    expect(n.tick(60)).toEqual(paused);
    n.load(TUR_LAUT[5]);expect(n.tick(0).progress).toBe(0);expect(n.tick(0).line).toBe(0);n.dispose();
  });
  it('pindah bab membatalkan callback suara lama',()=>{
    class Speech { text:string; lang='';rate=1;pitch=1;voice=null;onend:()=>void=()=>{};onerror:()=>void=()=>{}; constructor(text:string){this.text=text;} }
    const spoken:Speech[]=[];
    vi.stubGlobal('SpeechSynthesisUtterance',Speech);
    vi.stubGlobal('window',{speechSynthesis:{getVoices:()=>[{lang:'id-ID'}],speak:(u:Speech)=>spoken.push(u),cancel:vi.fn()}});
    vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({version:2,tracks:{}})}));
    const n=new SeaNarration({});n.load(TUR_LAUT[0]);n.play();const old=spoken[0];
    const beforePause=n.tick(5).progress;n.pause();
    expect(n.tick(0).progress).toBe(beforePause);
    n.play();expect(n.tick(1).progress).toBeGreaterThanOrEqual(beforePause);
    n.load(TUR_LAUT[2]);old.onend();
    expect(n.tick(0).line).toBe(0);expect(spoken.at(-1)!.text).toBe(TUR_LAUT[2].lines[0]);n.dispose();
  });
});

function recording() {
  vi.stubGlobal('window', {});
  const audio = {
    src: '', currentTime: 0, duration: SEA_RECORDING.duration, readyState: 4, ended: false, muted: false,
    hidden: false, dataset: {}, isConnected: false, preload: '',
    onerror: null as null | (() => void), onloadedmetadata: null as null | (() => void), onended: null as null | (() => void),
    play: vi.fn().mockResolvedValue(undefined), pause: vi.fn(), removeAttribute: vi.fn(), load: vi.fn(), remove: vi.fn(),
  };
  const factory = vi.fn(() => audio as unknown as HTMLAudioElement);
  const n = new SeaNarration(SEA_TRACKS, factory);
  n.load(TUR_LAUT[0]);
  return { n, audio, factory };
}

describe('rekaman Algenib kontinu', () => {
  it('langsung memakai rekaman dan menunggu metadata sebelum seek', () => {
    const {n,audio}=recording();
    expect(n.source).toBe('rekaman');
    audio.readyState=0; n.load(TUR_LAUT[9]); n.play();
    expect(n.tick(0)).toMatchObject({time:305,line:0,loading:true});
    expect(audio.currentTime).toBe(0);
    audio.readyState=4; audio.onloadedmetadata!();
    expect(audio.currentTime).toBe(305);
    expect(n.tick(0).loading).toBe(false); n.dispose();
  });
  it('adegan dan teks hanya maju mengikuti currentTime, termasuk buffering', () => {
    const {n,audio}=recording(); n.play();
    n.tick(100); expect(n.tick(0).progress).toBe(0);
    audio.currentTime=10; expect(n.tick(0).line).toBe(1);
    audio.readyState=1;
    expect(n.tick(3)).toMatchObject({time:10,line:1,loading:true});
    audio.readyState=4; audio.currentTime=22;
    expect(n.tick(0)).toMatchObject({time:22,line:2,loading:false}); n.dispose();
  });
  it('17 bab tersambung tanpa memuat ulang, jeda, atau seek ke belakang', () => {
    const {n,audio,factory}=recording(); n.play();
    for(let i=1;i<TUR_LAUT.length;i++) {
      audio.currentTime=SEA_TRACKS[TUR_LAUT[i].id].start! + .025;
      expect(n.tick(0).ended).toBe(true);
      n.load(TUR_LAUT[i],true);
      expect(n.tick(0)).toMatchObject({ended:false,line:0});
      expect(n.tick(0).seconds).toBeCloseTo(.025,5);
    }
    expect(factory).toHaveBeenCalledTimes(1);
    expect(audio.pause).not.toHaveBeenCalled();
    audio.currentTime=SEA_RECORDING.duration; audio.ended=true;
    expect(n.tick(0)).toMatchObject({ended:true,progress:1}); n.dispose();
  });
  it('frame yang tertunda beberapa bab tetap mempertahankan posisi audio', () => {
    const {n,audio}=recording(); n.play(); audio.currentTime=320;
    n.load(TUR_LAUT[9],true);
    expect(audio.currentTime).toBe(320); expect(n.tick(0).line).toBe(1);
    expect(audio.pause).not.toHaveBeenCalled(); n.dispose();
  });
  it('jeda, lompat bab, seek balik, dan bisu menjaga jam rekaman', () => {
    const {n,audio}=recording(); n.play(); audio.currentTime=25; n.tick(0); n.pause();
    expect(n.tick(200).time).toBe(25);
    n.load(TUR_LAUT[9]); expect(audio.currentTime).toBe(305);
    n.seek(324); expect(n.tick(0)).toMatchObject({line:2,time:324});
    n.seek(312); expect(n.tick(0)).toMatchObject({line:1,time:312});
    n.setMuted(true); expect(audio.muted).toBe(true); n.play();
    audio.currentTime=337; expect(n.tick(0)).toMatchObject({line:3,time:337});
    n.setMuted(false); expect(audio.muted).toBe(false);
    n.load(TUR_LAUT[0]); expect(n.tick(0)).toMatchObject({time:0,line:0,progress:0}); n.dispose();
  });
  it('gagal audio setelah jeda tetap beralih ke teks; metadata pendek ditolak', () => {
    const {n,audio}=recording(); n.play(); n.pause(); audio.onerror!();
    expect(n.source).toBe('teks'); n.dispose();
    const r=recording(); r.audio.duration=5; r.audio.onloadedmetadata!();
    expect(r.n.source).toBe('teks'); expect(r.audio.remove).toHaveBeenCalled(); r.n.dispose();
  });
  it('menunggu sisa padding decoder pada akhir rekaman, tanpa memotong kata terakhir', () => {
    const {n,audio}=recording(); n.load(TUR_LAUT.at(-1)!);
    audio.duration=598.869333; audio.currentTime=598.8;
    expect(n.tick(0).ended).toBe(false);
    audio.currentTime=audio.duration; audio.ended=true;
    expect(n.tick(0).ended).toBe(true); n.dispose();
  });
});
