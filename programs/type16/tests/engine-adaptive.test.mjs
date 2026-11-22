import test from 'node:test';
import assert from 'node:assert/strict';
import {createSession,transition,nextItem,explainNext,inspectSession} from '../js/engine/index.js';
import {ITEM_BANK} from '../js/engine/catalog.js';

function run(seed,withSkips=false){
  let s=createSession({locale:seed%2?'en':'es'});
  const seen=[];
  let z=seed;
  const pseudo=()=>{z=(Math.imul(z,1664525)+1013904223)>>>0;return z/0x100000000};
  while(s.phase!=='checkpoint'){
    const id=nextItem(s);seen.push(id);
    const value=withSkips&&pseudo()<.1?null:Math.floor(pseudo()*5)+1;
    s=transition(s,{type:'respond',id,value});
  }
  s=transition(s,{type:'continue'});
  const deepIds=[];
  while(s.phase==='deep'){
    const id=nextItem(s);assert.ok(id&&!seen.includes(id));
    const why=explainNext(s);assert.equal(why.id,id);
    const counts=Object.fromEntries(['IE','SN','FT','JP'].map(axis=>[axis,s.seen.filter(i=>ITEM_BANK[i-1].dimension===axis).length]));
    assert.equal(counts[ITEM_BANK[id-1].dimension],Math.min(...Object.values(counts)),`Coverage bias at Q${id}`);
    const value=withSkips&&pseudo()<.1?null:Math.floor(pseudo()*5)+1;
    s=transition(s,{type:'respond',id,value});seen.push(id);deepIds.push(id);
  }
  assert.equal(s.seen.length,32);assert.equal(new Set(s.seen).size,32);
  if(!withSkips)assert.equal(inspectSession(s).readyForFullKey,true);
  return {s,deepIds};
}
test('adaptive order is deterministic for identical answer histories',()=>{
  assert.deepEqual(run(123,false).deepIds,run(123,false).deepIds);
});
test('100 synthetic respondents: termination, coverage and no duplicated questions',()=>{
  for(let seed=1;seed<=100;seed++)run(seed,seed%2===0);
});
test('no type letter is fabricated for absent axes',()=>{
  const p=inspectSession(createSession()).profile;
  assert.equal(p.exploratoryCode,'????');
  assert.equal(p.officialType,null);
});
