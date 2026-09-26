import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {dedup,weld,meshopt} from '@gltf-transform/functions';
import {MeshoptEncoder,MeshoptDecoder} from 'meshoptimizer';

const source='sources/anatomy/generated-heart/review/heart-shape-candidate.glb';
const out='public/anatomy/review';await fs.mkdir(out,{recursive:true});
await MeshoptEncoder.ready;
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.encoder':MeshoptEncoder,'meshopt.decoder':MeshoptDecoder});
const doc=await io.read(source);
doc.getRoot().listNodes().forEach((n,i)=>n.setName('generated_heart_candidate_'+i));
await doc.transform(weld(),dedup(),meshopt({encoder:MeshoptEncoder,level:'medium'}));
const bytes=await io.writeBinary(doc);await fs.writeFile(out+'/heart-shape.glb',bytes);
const report=JSON.parse(await fs.readFile('sources/anatomy/generated-heart/review/geometry-report.json','utf8'));
Object.assign(report,{bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),
  status:'geometry-review-only',reference:'/anatomy/references/heart-gpt-reference.png',
  sourceModel:'Tencent Hunyuan3D 2.1',sourceTrianglesReportedByService:3270224,
  textureStatus:'not-generated',anatomyReview:'pending',
  limitations:['Single merged exterior mesh; not a modular anatomy asset.','No reviewed chambers, septa or valves.','Vessel openings and posterior anatomy are reconstructed estimates.','No anatomical scale or laterality certification.','Neutral inspection material; natural PBR textures are not generated.']});
await fs.writeFile(out+'/manifest.json',JSON.stringify(report,null,2));
for(const name of ['front','back','left','right'])await fs.copyFile('sources/anatomy/generated-heart/review/'+name+'.png',out+'/'+name+'.png');
const verified=await io.read(out+'/heart-shape.glb');
const triangles=verified.getRoot().listMeshes().flatMap(m=>m.listPrimitives()).reduce((n,p)=>n+(p.getIndices()?.getCount()??p.getAttribute('POSITION').getCount())/3,0);
if(triangles!==300000||bytes.length>8*1024*1024)throw new Error('Review mesh count or budget failed');
console.log(JSON.stringify({bytes:bytes.length,triangles,sha256:report.sha256}));
