import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';
import { initialState, reducer, poseAt, validateManifest, visiblePart, searchable, belongsTo } from '../../src/lib/anatomy/state';
import type { Manifest } from '../../src/lib/anatomy/types';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
const m=JSON.parse(fs.readFileSync('public/anatomy/manifest.json','utf8')) as Manifest;
const heart=m.parts.find(p=>p.id==='heart')!,left=m.parts.find(p=>p.id==='kidney_l')!;
test('manifest: IDs, hierarchy, source references and capability prerequisites',()=>assert.deepEqual(validateManifest(m),[]));
test('all manifest nodes resolve in their exported GLB package; files stay within budget',async()=>{
 const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder});
 for(const a of m.assets){assert.ok(a.bytes<8*1024*1024);const d=await io.read('public'+a.url),names=new Set(d.getRoot().listNodes().map(n=>n.getName()));for(const p of m.parts.filter(p=>p.assetId===a.id))for(const n of p.meshNodeNames)assert.ok(names.has(n),p.id+' missing '+n);const owners=new Set(m.parts.filter(p=>p.assetId===a.id).flatMap(p=>p.meshNodeNames));for(const node of d.getRoot().listNodes().filter(n=>n.getMesh())){let at:typeof node|null=node;while(at&&!owners.has(at.getName()))at=at.getParentNode();assert.ok(at,'Unmapped rendered node: '+node.getName());}}
});
test('separation is absolute and reversible over repeated 0/50/100/0 cycles',()=>{for(let i=0;i<20;i++){assert.deepEqual(poseAt([1,2,3],[.2,.4,.6],0),[1,2,3]);assert.deepEqual(poseAt([1,2,3],[.2,.4,.6],50),[1.1,2.2,3.3]);assert.deepEqual(poseAt([1,2,3],[.2,.4,.6],100),[1.2,2.4,3.6]);assert.deepEqual(poseAt([1,2,3],[.2,.4,.6],0),[1,2,3]);}});
test('isolation restores layers, selection, disassembly, camera, and section',()=>{let s=initialState();s=reducer(s,{type:'select',part:heart});s=reducer(s,{type:'patch',patch:{explode:50,detached:{heart:22},section:{axis:'axial',position:37}}});const camera={position:[1,2,3] as [number,number,number],target:[0,1,0] as [number,number,number]};const before=structuredClone(s);s=reducer(s,{type:'isolate',id:'heart',camera});s=reducer(s,{type:'layer',id:'skin',visible:true});s=reducer(s,{type:'back'});assert.deepEqual(s.layers,before.layers);assert.deepEqual(s.detached,before.detached);assert.equal(s.explode,50);assert.deepEqual(s.section,before.section);assert.deepEqual(s.cameraRestore,camera);assert.equal(s.selectedId,'heart');});
test('hidden and zero opacity parts are not pickable; isolated ancestors match',()=>{let s=initialState();assert.ok(visiblePart(heart,s,m.parts));s=reducer(s,{type:'layer',id:'organ',visible:false});assert.equal(visiblePart(heart,s,m.parts),false);s=reducer(s,{type:'layer',id:'organ',visible:true,opacity:0});assert.equal(visiblePart(heart,s,m.parts),false);assert.ok(belongsTo(m.parts.find(p=>p.id==='atrium_r')!,'heart',m.parts));assert.equal(belongsTo(left,'heart',m.parts),false);});
test('search reveals a hidden layer, escapes unrelated isolation, and preserves laterality',()=>{let s=initialState();s=reducer(s,{type:'isolate',id:'heart',camera:{position:[0,0,3],target:[0,0,0]}});s=reducer(s,{type:'layer',id:'organ',visible:false});s=reducer(s,{type:'select',part:left,reveal:true});assert.equal(s.isolation,null);assert.ok(visiblePart(left,s,m.parts));assert.equal(left.laterality,'left');assert.ok(left.bounds.min[0]>0);assert.ok(searchable(left,'GINJAL'));assert.ok(searchable(heart,'cor'));});
test('reset restores all modes and transform inputs, retaining reduced motion preference',()=>{let s=initialState(true);s=reducer(s,{type:'patch',patch:{mode:'disassemble',explode:100,selectedId:heart.id,playing:true,detached:{heart:88},labels:false,section:{axis:'axial',position:8}}});s=reducer(s,{type:'reset'});assert.deepEqual({...s,revision:0},initialState(true));});
test('validator rejects cycles, node aliases, orphan parts, missing source and fake release signoff',()=>{const bad=structuredClone(m);bad.parts[0].parentId=bad.parts[0].id;bad.parts[0].sources=[];bad.parts[1].meshNodeNames=bad.parts[0].meshNodeNames;bad.status='release';const e=validateManifest(bad);assert.ok(e.some(e=>e.startsWith('Siklus')));assert.ok(e.some(e=>e.startsWith('Node ganda')));assert.ok(e.some(e=>e.startsWith('Belum ditinjau')));});
test('detail packages preserve part IDs, improve topology, and retain checked budgets and hashes',async()=>{
 const {createHash}=await import('node:crypto');const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder});
 const opening=m.assets.filter(a=>['bone','organ','heart','urinary'].includes(a.id)).reduce((n,a)=>n+a.bytes,0);assert.ok(opening<8*1024*1024);
 for(const a of m.assets){const bytes=fs.readFileSync('public'+a.url);assert.equal(bytes.length,a.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),a.sha256);if(!a.detailUrl)continue;
  const data=fs.readFileSync('public'+a.detailUrl);assert.equal(data.length,a.detailBytes);assert.ok(data.length<8*1024*1024);assert.equal(createHash('sha256').update(data).digest('hex'),a.detailSha256);assert.ok(a.detailTriangles!>a.triangles);
  const doc=await io.read('public'+a.detailUrl),names=new Set(doc.getRoot().listNodes().map(n=>n.getName()));for(const p of m.parts.filter(p=>p.assetId===a.id))for(const name of p.meshNodeNames)assert.ok(names.has(name));
 }
});
test('supplemental valves remain within the cardiac region after source registration',()=>{
 const chamber=m.parts.filter(p=>['atrium_l','atrium_r','ventricle_l','ventricle_r'].includes(p.id));
 for(const id of ['valve_mitral','valve_tricuspid']){const p=m.parts.find(p=>p.id===id)!;for(let axis=0;axis<3;axis++){const center=(p.bounds.min[axis]+p.bounds.max[axis])/2;assert.ok(center>=Math.min(...chamber.map(c=>c.bounds.min[axis]))-.01);assert.ok(center<=Math.max(...chamber.map(c=>c.bounds.max[axis]))+.01);}}
});
test('expanded anatomy keeps teeth individually selectable and the unregistered inset outside the body',()=>{
 const teeth=m.parts.filter(p=>p.id.startsWith('tooth_'));
 assert.equal(teeth.length,28);
 // Empty pickNodeNames means raycast the actual mesh, not a separate hit proxy.
 for(const p of teeth){assert.equal(p.parentId,'mouth');assert.equal(p.kind,undefined);assert.ok(p.meshNodeNames.length);}
 for(const side of ['l','r']){
  const eye=m.parts.find(p=>p.id==='eye_'+side)!;
  for(const component of ['iris','cornea','lens','retina','vitreous'])assert.ok(eye.childIds.includes(component+'_'+side));
  const foot=m.parts.find(p=>p.id==='foot_'+side)!;
  assert.equal(foot.kind,'assembly');assert.ok(foot.childIds.length>=26);
 }
 const inset=m.parts.find(p=>p.id==='cochlea_study')!;
 assert.equal(inset.kind,'inset');assert.equal(visiblePart(inset,initialState(),m.parts),false);
 const s=reducer(initialState(),{type:'isolate',id:inset.id,camera:{position:[0,0,3],target:[0,0,0]}});
 assert.equal(visiblePart(inset,s,m.parts),true);
 assert.equal(visiblePart(heart,s,m.parts),false);
});
