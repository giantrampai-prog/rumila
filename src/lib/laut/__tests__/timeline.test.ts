import { readFileSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { TUR_LAUT } from '../misi';
import { SEA_RECORDING, SEA_TRACKS, validTrack } from '../narration';
import { chapterAtTime, diveAtTime, SEA_SHOTS, shotAtTime, subLightAtTime } from '../timeline';

describe('timestamp asli pengguna mengendalikan semua adegan', () => {
  it('setiap kata, paragraf, dan bab cocok dengan sumber tanpa celah waktu', () => {
    const words=readFileSync('docs/laut/rekaman-algenib/timestamp-dongeng.txt','utf8').trim().split(/\r?\n/).map(l=>{
      const m=l.match(/^\[(\d+):(\d{2})\]\s+(.+)$/)!;
      return {at:Number(m[1])*60+Number(m[2]),text:m[3]};
    });
    const norm=(s:string)=>s.toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
    let cursor=0;
    for(const [i,s] of TUR_LAUT.entries()) {
      const t=SEA_TRACKS[s.id]; expect(validTrack(t,s.lines.length)).toBe(true);
      expect(chapterAtTime(t.start!)).toBe(i);
      expect(chapterAtTime(t.end!-.001)).toBe(i);
      if(i>0) expect(t.start).toBe(SEA_TRACKS[TUR_LAUT[i-1].id].end);
      for(const [j,line] of s.lines.entries()) {
        expect(t.start!+t.cues[j]).toBe(words[cursor].at);
        for(const word of line.split(/\s+/)) expect(norm(word)).toBe(norm(words[cursor++].text));
      }
      expect(t.src).toBe(SEA_RECORDING.src);
    }
    expect(cursor).toBe(words.length); expect(cursor).toBe(1274);
    expect(SEA_TRACKS[TUR_LAUT.at(-1)!.id].end).toBeCloseTo(598.775333,5);
    expect(statSync(`public${SEA_RECORDING.src}`).size).toBeLessThan(6*1024*1024);
    expect(readFileSync('public/laut/voice/v2/algenib-20260928.vtt','utf8').match(/ --> /g)).toHaveLength(58);
  });
  it('kamera hewan hanya dipilih dalam bab yang tepat', () => {
    expect(Object.keys(SEA_SHOTS)).toHaveLength(TUR_LAUT.length);
    for(const [id,shots] of Object.entries(SEA_SHOTS)) for(const shot of shots) {
      expect(shot.at).toBeGreaterThanOrEqual(SEA_TRACKS[id].start!);
      expect(shot.at).toBeLessThan(SEA_TRACKS[id].end!);
      expect(shot.distance).toBeGreaterThan(0);
    }
    expect(shotAtTime('terumbu-karang',90.9)).toBeNull();
    expect(shotAtTime('terumbu-karang',91)?.target).toBe('ikan-badut');
    expect(shotAtTime('bioluminesensi',312)?.target).toBe('ikan-pemancing');
    expect(shotAtTime('bioluminesensi',324)?.target).toBe('hewan-sisir');
  });
  it('Agam masuk air tepat saat byur dan lampu mengikuti ucapan', () => {
    expect(diveAtTime(0)).toEqual({walk:0,jump:0,sink:0,standing:true});
    expect(diveAtTime(4.99).standing).toBe(true);
    expect(diveAtTime(5)).toMatchObject({jump:1,sink:0,standing:false});
    expect(diveAtTime(12).sink).toBe(1);
    expect(subLightAtTime('makin-redup',253)).toBe(0);
    expect(subLightAtTime('makin-redup',254.5)).toBe(.5);
    expect(subLightAtTime('makin-redup',255)).toBe(1);
  });
});
