import { describe,it,expect } from 'vitest';
import { audioFileInfo,fruitAudioPath,readAudioManifest,AUDIO_MAX_BYTES } from '../audio';
const bytes=(s:string)=>new TextEncoder().encode(s);
const family='af80426b-5962-4f36-960e-f39ac0901639';
describe('audio upload validation',()=>{
 it('accepts Google-exportable MP3, WAV, and M4A signatures',()=>{
  expect(audioFileInfo('voice.MP3',1234,bytes('ID3\0'))).toEqual({extension:'mp3',mime:'audio/mpeg'});
  expect(audioFileInfo('voice.wav',1234,bytes('RIFFxxxxWAVE'))).toEqual({extension:'wav',mime:'audio/wav'});
  expect(audioFileInfo('voice.m4a',1234,bytes('xxxxftypM4A '))).toEqual({extension:'m4a',mime:'audio/mp4'});
 });
 it('rejects renamed non-audio, empty and oversized recordings',()=>{
  expect(()=>audioFileInfo('voice.mp3',100,bytes('<html>'))).toThrow();
  expect(()=>audioFileInfo('voice.txt',100,bytes('ID3'))).toThrow();
  expect(()=>audioFileInfo('voice.mp3',0,bytes('ID3'))).toThrow();
  expect(()=>audioFileInfo('voice.mp3',AUDIO_MAX_BYTES+1,bytes('ID3'))).toThrow();
 });
 it('cannot construct a path to another bucket or fruit',()=>{
  expect(fruitAudioPath(family,'pisang','mp3')).toBe(`${family}/fruits/pisang.mp3`);
  for(const [f,id,ext] of [['../other','pisang','mp3'],[family,'../../documents/file','mp3'],[family,'unknown','mp3'],[family,'pisang','html']])expect(()=>fruitAudioPath(f,id,ext)).toThrow();
 });
 it('ignores untrusted or cross-fruit URLs in the bundled manifest',()=>{
  expect(readAudioManifest({tracks:{pisang:'/fruits/audio/pisang.mp3?v=abcd',apel:'https://evil.example/a.mp3',mangga:'/fruits/audio/pisang.mp3',unknown:'/fruits/audio/unknown.mp3'}}).tracks).toEqual({pisang:'/fruits/audio/pisang.mp3?v=abcd'});
  expect(readAudioManifest(null).tracks).toEqual({});
 });
});
