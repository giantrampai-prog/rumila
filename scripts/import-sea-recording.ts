/** Rebuild chapter/paragraph timing from the user-supplied word timestamps. No inferred speech timings. */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { TUR_LAUT } from '../src/lib/laut/misi';

const timestampPath = 'docs/laut/rekaman-algenib/timestamp-dongeng.txt';
const timestamp = readFileSync(timestampPath, 'utf8');
const words = timestamp.trim().split(/\r?\n/).map(line => {
  const m = line.match(/^\[(\d+):(\d{2})\]\s+(.+)$/);
  if (!m) throw new Error(`Timestamp tidak dikenali: ${line}`);
  return { at: Number(m[1]) * 60 + Number(m[2]), text: m[3] };
});
const normalized = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const duration = 14370608 / 24000; // Exact PCM frame count and sample rate of supplied WAV.
const src = '/laut/voice/v2/algenib-20260928.m4a';
let cursor = 0;
const chapters = TUR_LAUT.map(stop => {
  const starts = stop.lines.map(line => {
    const at = words[cursor]?.at;
    for (const text of line.split(/\s+/)) {
      if (normalized(text) !== normalized(words[cursor]?.text ?? '')) throw new Error(`Naskah berbeda pada kata ${cursor}: ${text}`);
      cursor++;
    }
    return at;
  });
  return { id: stop.id, title: stop.title, start: starts[0], starts };
});
if (cursor !== words.length || words.some((w,i)=>w.at>=duration || (i>0 && w.at<words[i-1].at))) throw new Error('Jumlah/urutan kata tidak valid');
const tracks = Object.fromEntries(chapters.map((c,i) => [c.id, {
  src, start: c.start, end: chapters[i+1]?.start ?? duration, cues: c.starts.map(t => t-c.start),
}]));
const manifest = { version: 2, recording: { src, duration, voice: 'Algenib', words: words.length, timestampPrecisionSeconds: 1, timestampSha256: createHash('sha256').update(timestamp).digest('hex') }, tracks };
writeFileSync('public/laut/voice/v2/manifest.json', JSON.stringify(manifest,null,2)+'\n');
const fmt = (t:number) => new Date(t*1000).toISOString().slice(11,23);
let vtt = 'WEBVTT\n\n';
chapters.forEach((c,i)=>c.starts.forEach((start,j)=>{
  const end=c.starts[j+1]??tracks[c.id].end;
  vtt+=`${c.id}-${j+1}\n${fmt(start)} --> ${fmt(end)}\n${TUR_LAUT[i].lines[j]}\n\n`;
}));
writeFileSync('public/laut/voice/v2/algenib-20260928.vtt',vtt.trimEnd()+'\n');
writeFileSync('docs/laut/rekaman-algenib/bab-dan-timestamp.txt', chapters.map((c,i)=>`${String(i+1).padStart(2,'0')} | ${fmt(c.start)} – ${fmt(tracks[c.id].end)} | ${c.title}\nParagraf: ${c.starts.map(fmt).join(', ')}`).join('\n\n')+'\n');
console.log(`${words.length} kata cocok; ${chapters.length} bab; ${TUR_LAUT.reduce((n,s)=>n+s.lines.length,0)} paragraf; ${duration.toFixed(3)} detik.`);
