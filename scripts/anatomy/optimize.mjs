import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, weld, meshopt, prune } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
await MeshoptEncoder.ready;
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.encoder':MeshoptEncoder,'meshopt.decoder':MeshoptDecoder});
const parts=JSON.parse(await fs.readFile('sources/anatomy/compiled-parts.json','utf8'));
const extra=JSON.parse(await fs.readFile('sources/anatomy/nih-ear-part.json','utf8'));parts.push(extra);
for(const p of parts.filter(p=>p.id==='ear_l'||p.id==='ear_r')){p.insetId=extra.id;p.capabilities.microInset=true;p.definitionDetailed='Organ pendengaran di sisi kepala. Model ini memuat daun telinga, gendang, dan tiga tulang pendengaran. Telinga dalam tersedia melalui model pembelajaran terpisah yang diperbesar.';}
const assets=[];
for(const id of [...new Set(parts.map(p=>p.assetId))]){
 const doc=await io.read('sources/anatomy/uncompressed/'+id+'.glb');
 await doc.transform(weld(),dedup(),prune({keepLeaves:true}),meshopt({encoder:MeshoptEncoder,level:'medium'}));
 let triangles=0;for(const mesh of doc.getRoot().listMeshes())for(const p of mesh.listPrimitives())triangles+=(p.getIndices()?.getCount()||p.getAttribute('POSITION').getCount())/3;
 const bytes=await io.writeBinary(doc);await fs.writeFile('public/anatomy/'+id+'.glb',bytes);
 assets.push({id,deferred:['head','joints','ear-study'].includes(id),url:'/anatomy/'+id+'.glb',bytes:bytes.byteLength,triangles,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),license:id==='urinary'?'CC BY-SA 2.1 JP':'CC BY-SA 4.0; BodyParts3D components CC BY-SA 2.1 JP',source:'https://github.com/Z-Anatomy/Models-of-human-anatomy',attribution:'Z-Anatomy — The libre 3D atlas of anatomy, Gauthier Kervyn and contributors; BodyParts3D © The Database Center for Life Science. See ATTRIBUTION.md for per-part sources.',reviewStatus:'pending'});
 if(['heart','organ','nerve','head','joints'].includes(id)){
  const hi=await io.read('sources/anatomy/uncompressed/'+id+'-detail.glb');await hi.transform(weld(),dedup(),prune({keepLeaves:true}),meshopt({encoder:MeshoptEncoder,level:'medium'}));
  const detail=await io.writeBinary(hi);await fs.writeFile('public/anatomy/'+id+'-detail.glb',detail);
  let detailTriangles=0;for(const mesh of hi.getRoot().listMeshes())for(const p of mesh.listPrimitives())detailTriangles+=(p.getIndices()?.getCount()||p.getAttribute('POSITION').getCount())/3;
  Object.assign(assets.at(-1),{detailUrl:'/anatomy/'+id+'-detail.glb',detailBytes:detail.byteLength,detailTriangles,detailSha256:crypto.createHash('sha256').update(detail).digest('hex')});
 }
 if(id==='ear-study')Object.assign(assets.at(-1),{license:'CC BY 4.0',source:'https://3d.nih.gov/entries/1794?version=2',attribution:'Cochlea by chris@printhuman.org, NIH 3D 3DPX-001794, version 2. Display normalization, geometry cleanup and meshopt compression by Rumila. Source units and laterality not asserted.'});
 console.log(id,bytes.byteLength,triangles,assets.at(-1).detailBytes||'');
}
const missing=[
 'Peninjauan anatomi oleh reviewer manusia belum dilakukan; semua materi dan model berstatus pengembangan.',
 'Septum jantung belum memiliki pemetaan permukaan tersendiri. Batas potongan pada dinding anterior belum dikurasi dan ditutup sebagai volume jaringan.',
 'Simulasi hanya memperlihatkan urutan jalur sederhana; kontraksi miokard, gerak katup, napas, dan fleksi sendi belum dianimasikan.',
 'Detail lapisan kulit, inset alveolus/nefron, bagian dalam ginjal, dan simulasi sendi belum tersedia.',
 'Paket mulut berisi 28 gigi permanen tanpa gigi bungsu; gigi susu dan interior jaringan gigi belum tersedia.',
 'Telinga dalam ditampilkan sebagai inset NIH terpisah; posisi, sisi, dan skala anatomis belum diregistrasi ke kepala. Struktur sensorik mikroskopis belum tersedia.',
 'Reproduksi baru memakai variasi anatomi laki-laki; paket variasi perempuan belum tersedia.',
 'Cakupan otot dan saraf merupakan pilihan struktur utama; belum seluruh inventaris target. Limfatik belum memuat jaringan pembuluh dan nodus lengkap.',
 'Anggaran FPS belum diuji pada ponsel fisik kelas menengah.'
];
// Source-only fields stay in the editable pipeline metadata, not runtime content.
const publicParts=parts.map(({sourceNames,sourceProvider,special,pack,parent,side,location,registration,...p})=>({...p,relatedIds:p.relatedIds??(p.parentId?[p.parentId]:p.childIds)}));
await fs.writeFile('public/anatomy/manifest.json',JSON.stringify({version:'1.0.0',status:'development',assets,parts:publicParts,missing},null,2));
await fs.writeFile('docs/anatomy/asset-sizes.json',JSON.stringify(assets,null,2));
