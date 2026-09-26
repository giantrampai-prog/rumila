// Turn on only after the reviewed fruit-audio migration is applied.
export const FRUIT_AUDIO_STORAGE_READY = false;
import { FRUIT_BY_ID } from './catalog';
export type AudioManifest = {version:1;tracks:Record<string,string>};
/** Only our own fruit recordings; never accept arbitrary paths from a manifest. */
export function readAudioManifest(value:unknown):AudioManifest {
 const result:AudioManifest={version:1,tracks:{}};
 if(!value||typeof value!=='object'||!('tracks' in value)||!value.tracks||typeof value.tracks!=='object')return result;
 for(const [id,path] of Object.entries(value.tracks))if(FRUIT_BY_ID.has(id)&&typeof path==='string'&&new RegExp(`^/fruits/audio/${id}\\.(mp3|wav|m4a)(\\?v=[a-f0-9]+)?$`).test(path))result.tracks[id]=path;
 return result;
}
export const AUDIO_MAX_BYTES=20*1024*1024;
export function audioFileInfo(name:string,size:number,header:Uint8Array):{extension:string;mime:string} {
 if(size===0||size>AUDIO_MAX_BYTES)throw new Error('Pilih rekaman yang tidak kosong, maksimal 20 MB.');
 const extension=name.split('.').pop()?.toLowerCase();
 const text=(start:number,end:number)=>String.fromCharCode(...header.slice(start,end));
 const valid=extension==='mp3'?(text(0,3)==='ID3'||header[0]===255&&(header[1]&224)===224):extension==='wav'?(text(0,4)==='RIFF'&&text(8,12)==='WAVE'):extension==='m4a'?text(4,8)==='ftyp':false;
 if(!valid)throw new Error('Gunakan berkas audio MP3, WAV, atau M4A yang valid.');
 return {extension:extension!,mime:extension==='mp3'?'audio/mpeg':extension==='wav'?'audio/wav':'audio/mp4'};
}
export function fruitAudioPath(familyId:string,fruitId:string,extension:string) {
 if(!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(familyId)||!FRUIT_BY_ID.has(fruitId)||!['mp3','wav','m4a'].includes(extension))throw new Error('Tujuan rekaman tidak valid.');
 return `${familyId}/fruits/${fruitId}.${extension}`;
}
