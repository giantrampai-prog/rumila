import { afterEach, describe, expect, it, vi } from 'vitest';
import { SeaNarration } from '../narration';
import { TUR_LAUT } from '../misi';
afterEach(()=>vi.unstubAllGlobals());
function setup() {
  vi.stubGlobal('window',{});
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({version:2,tracks:{}})}));
  const n=new SeaNarration();n.load(TUR_LAUT[0]);return n;
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
    const n=new SeaNarration();n.load(TUR_LAUT[0]);n.play();const old=spoken[0];
    const beforePause=n.tick(5).progress;n.pause();
    expect(n.tick(0).progress).toBe(beforePause);
    n.play();expect(n.tick(1).progress).toBeGreaterThanOrEqual(beforePause);
    n.load(TUR_LAUT[2]);old.onend();
    expect(n.tick(0).line).toBe(0);expect(spoken.at(-1)!.text).toBe(TUR_LAUT[2].lines[0]);n.dispose();
  });
});
