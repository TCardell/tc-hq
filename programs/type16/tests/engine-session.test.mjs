import test from 'node:test';
import assert from 'node:assert/strict';
import {createSession,transition,inspectSession,nextItem,buildProfile,serializeSession,restoreSession,MAX_UNDO} from '../js/engine/index.js';
import {FAST_IDS} from '../js/questions.js';
const respond=(s,value=3)=>transition(s,{type:'respond',id:nextItem(s),value});
const afterQuick=(values=[])=>FAST_IDS.reduce((s,id,i)=>transition(s,{type:'respond',id,value:values[i]??3}),createSession());

test('new bilingual session starts with first fixed quick item; no visual dependency',()=>{
  const s=createSession({locale:'es'});
  assert.equal(nextItem(s),FAST_IDS[0]);assert.equal(inspectSession(s).seen,0);
  assert.equal(inspectSession(s).profile.status,'no-data');
  assert.equal(createSession({locale:'en'}).locale,'en');
  assert.throws(()=>createSession({locale:'de'}),RangeError);
});
test('quick phase uses 12 balanced items; deep phase reaches 32 without repeats',()=>{
  let s=createSession();
  for(const id of FAST_IDS){assert.equal(nextItem(s),id);s=respond(s,3)}
  assert.equal(s.phase,'checkpoint');assert.equal(s.checkpoint,'quick');
  assert.equal(nextItem(s),null);assert.equal(inspectSession(s).canContinue,true);
  assert.equal(buildProfile(s.answers).officialType,null);
  s=transition(s,{type:'continue'});
  for(let i=0;i<20;i++){const id=nextItem(s);assert.ok(id&&!s.seen.includes(id));s=respond(s,i%5+1)}
  assert.equal(s.phase,'checkpoint');assert.equal(s.checkpoint,'deep');
  assert.equal(new Set(s.seen).size,32);assert.equal(s.seen.length,32);
  assert.equal(inspectSession(s).readyForFullKey,true);
  assert.equal(buildProfile(s.answers).complete,true);
  s=transition(s,{type:'finish'});assert.equal(s.phase,'done');
});
test('skips survive checkpoint and can be re-asked, never converted to 3',()=>{
  let s=createSession();
  const first=nextItem(s);s=respond(s,null);
  for(let i=1;i<12;i++)s=respond(s,3);
  assert.equal(s.phase,'checkpoint');assert.equal(s.skipped[0],first);
  assert.equal(Object.hasOwn(s.answers,first),false);
  s=transition(s,{type:'review'});
  assert.equal(s.phase,'review');assert.equal(nextItem(s),first);
  s=respond(s,5);
  assert.equal(s.phase,'checkpoint');assert.equal(s.skipped.length,0);
  assert.equal(s.answers[first],5);
  s=transition(s,{type:'continue'});
  assert.equal(s.phase,'deep');
});
test('reviewing a skip with another skip terminates its single-pass queue',()=>{
  let s=createSession();s=respond(s,null);
  for(let i=1;i<12;i++)s=respond(s,1);
  s=transition(s,{type:'review'});s=respond(s,null);
  assert.equal(s.phase,'checkpoint');assert.equal(s.skipped.length,1);
  assert.equal(s.reviewQueue.length,0);
});
test('undo restores answers and selection; switching languages is not undone',()=>{
  let s=respond(createSession(),1);
  assert.equal(s.seen.length,1);
  s=transition(s,{type:'language',locale:'en'});
  s=transition(s,{type:'undo'});
  assert.equal(s.locale,'en');assert.equal(s.seen.length,0);
  assert.equal(nextItem(s),FAST_IDS[0]);
  assert.equal(s.undoStack.length,0);
});
test('invalid actions do not mutate input, corrupted sessions fail closed',()=>{
  const s=createSession();const before=JSON.stringify(s);
  assert.throws(()=>transition(s,{type:'respond',id:999,value:1}));
  assert.throws(()=>transition(s,{type:'respond',id:FAST_IDS[0],value:null===undefined?5:8}),RangeError);
  assert.throws(()=>transition(s,{type:'continue'}));
  assert.throws(()=>transition(s,{type:'review'}));
  assert.equal(JSON.stringify(s),before);
  const tampered={...s,seen:[1,1]};assert.throws(()=>restoreSession(tampered));
  assert.throws(()=>restoreSession({...s,bankVersion:'wrong'}));
});
test('save/restore round trip and bounded history',()=>{
  let s=createSession();for(let i=0;i<12;i++)s=respond(s,2);
  s=transition(s,{type:'continue'});
  for(let i=0;i<20;i++)s=respond(s,4);
  assert.ok(s.undoStack.length<=MAX_UNDO);
  const restored=restoreSession(serializeSession(s));
  assert.deepEqual(restored,s);
  let before=restored.seen.length;const back=transition(restored,{type:'undo'});
  assert.equal(back.seen.length,before-1);
});
test('restore rejects malformed quick order and corrupted undo snapshots',()=>{
  const good=createSession();
  const badOrder={...good,seen:[12]};
  assert.throws(()=>restoreSession(badOrder),/order/);
  const badHistory={...good,undoStack:[{...good,seen:[3],answers:{3:8}}]};
  delete badHistory.undoStack[0].undoStack;
  assert.throws(()=>restoreSession(badHistory),/Invalid response/);
});
