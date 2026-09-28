/** Rebuild the editable voice handoff from the exact words displayed in the app. */
import { mkdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { TUR_LAUT, lineDuration } from '../src/lib/laut/misi';

const dir='docs/laut/narasi-v2';
mkdirSync(dir,{recursive:true});
const instructions=`NARASI JELAJAH LAUT V2 — RINOYA\n\nNaskah orisinal untuk anak. Pemandu: Agam. Hangat, ingin tahu, bersahabat.\nTempo 115–130 kata/menit. Tersenyum saat menyapa; tenang di laut dalam, bukan menakut-nakuti.\nBeri jeda 0,8–1,2 detik antarapagraf; beri ruang setelah pertanyaan.\nJangan membaca nomor bab, judul, petunjuk visual, atau instruksi ini.\n\nRekam SATU FILE PER BAB, sesuai id pada nama file teks. MP3, M4A, WAV, atau OGG.\nSetiap paragraf = satu cue teks. Setelah suara jadi, catat waktu awal setiap paragraf.\nAngka dibaca dalam bahasa Indonesia; kata asing: Challenger Deep = cel-en-jer dip,\nhadal = ha-dal, abisal = a-bi-sal, bioluminesensi = bi-o-lu-mi-ne-sen-si.\n\nPemasangan:\n1. Taruh rekaman pada public/laut/voice/v2/<id>.mp3.\n2. Edit public/laut/voice/v2/manifest.json: version tetap 2; tracks berisi id, src dan cues.\n3. cues dimulai 0, urut naik, jumlah persis sama dengan paragraf bab.\n4. Sesuaikan cue dengan REKAMAN JADI, bukan durasi perkiraan.\n5. Build/deploy menyajikan rekaman dari server; tidak perlu ubah komponen aplikasi.\n\nContoh satu entri:\n{"version":2,"tracks":{"persiapan":{"src":"/laut/voice/v2/persiapan.mp3","cues":[0,12.8,28.4]}}}\nAngka contoh di atas hanya contoh format; ganti dengan timestamp rekamanmu.\n\nTanpa rekaman: narasi memakai suara Indonesia perangkat jika tersedia, atau waktu baca teks.\nAudio v1 tetap tersimpan sebagai arsip, tidak dipakai karena naskah dan urutan bab berbeda.\n`;
writeFileSync(`${dir}/MULAI-DI-SINI.txt`,instructions);
let full='NASKAH NARASI JELAJAH LAUT V2\n\n';
const sheet:string[]=['bab,id,judul,paragraf,naskah,durasi_perkiraan_detik'];
const quote=(s:string)=>`"${s.replaceAll('"','""')}"`;
TUR_LAUT.forEach((s,i)=>{
 writeFileSync(`${dir}/${String(i+1).padStart(2,'0')}-${s.id}.txt`,s.lines.join('\n\n')+'\n');
 full+=`[${i+1}. ${s.title} — ${s.label}]\n${s.lines.join('\n\n')}\n\n`;
 s.lines.forEach((l,j)=>sheet.push([i+1,s.id,quote(s.title),j+1,quote(l),Math.round(lineDuration(l))].join(',')));
});
writeFileSync(`${dir}/SEMUA-NARASI.txt`,full.trimEnd()+'\n');
writeFileSync(`${dir}/cue-sheet.csv`,'\uFEFF'+sheet.join('\n')+'\n');
writeFileSync('docs/laut/naskah-tur-laut.txt',full.trimEnd()+'\n');
writeFileSync('docs/laut/suara-tur-laut-UPLOAD.txt',TUR_LAUT.map(s=>s.lines.join('\n\n')).join('\n\n\n'));
execFileSync('zip',['-j','-q','public/laut/narasi-v2.zip',...['MULAI-DI-SINI.txt','SEMUA-NARASI.txt','cue-sheet.csv',...TUR_LAUT.map((s,i)=>`${String(i+1).padStart(2,'0')}-${s.id}.txt`)].map(f=>`${dir}/${f}`)]);
console.log(`${TUR_LAUT.length} bab, ${TUR_LAUT.reduce((n,s)=>n+s.lines.length,0)} paragraf. Paket: public/laut/narasi-v2.zip`);
