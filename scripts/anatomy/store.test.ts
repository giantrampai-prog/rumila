import assert from 'node:assert/strict';
import {test} from 'node:test';
import {useRumila,type Member} from '../../src/lib/store';
const members:Member[]=[{id:'a',name:'A',c:'teal',admin:true,perms:[]},{id:'b',name:'B',c:'orange',admin:false,perms:['edukasi']},{id:'c',name:'C',c:'pink',admin:false,perms:[]}];
test('anatomy progress respects current profile, deduplicates completion, and denies unauthorized sessions',()=>{
 const old=useRumila.getState();useRumila.setState({signedIn:true,meId:'a',members,activity:[]});
 try{
  const s=useRumila.getState(),session=s.beginAnatomySession('a');assert.ok(session);s.addAnatomyTime('a',session!,10);s.completeAnatomy('a','heart');s.completeAnatomy('a','heart');
  assert.equal(useRumila.getState().activity.filter(a=>a.event==='material_complete').length,1);
  s.completeAnatomy('b','heart');assert.equal(useRumila.getState().activity.filter(a=>a.memberId==='b').length,0);
  useRumila.setState({meId:'b'});s.completeAnatomy('b','heart');assert.equal(useRumila.getState().activity.filter(a=>a.memberId==='b'&&a.event==='material_complete').length,1);
  s.addAnatomyTime('b',session!,20);assert.equal(useRumila.getState().activity.find(a=>a.id===session)?.durationSec,10);
  useRumila.setState({meId:'c'});assert.equal(s.beginAnatomySession('c'),null);s.completeAnatomy('c','heart');assert.equal(useRumila.getState().activity.filter(a=>a.memberId==='c').length,0);
 }finally{useRumila.setState(old);}
});
