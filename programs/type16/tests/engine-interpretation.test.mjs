import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AXIS_INFO, ITEM_BANK, buildInterpretation, interpretSession, auditInterpretationCopy,
  createSession, nextItem, transition, serializeSession, restoreSession, buildProfile,
  INTERPRETATION_SCHEMA
} from '../js/engine/index.js';

const full = value => Object.fromEntries(ITEM_BANK.map(q=>[q.id,value]));
function answersFor(code){
  return Object.fromEntries(ITEM_BANK.map(q=>{
    const axisIndex=AXIS_INFO.findIndex(axis=>axis.id===q.dimension);
    const high=code[axisIndex]===AXIS_INFO[axisIndex].high;
    return [q.id, (high?q.scoringSign:-q.scoringSign)>0?5:1];
  }));
}
const codeSet=new Set();
for(const a of 'IE')for(const b of 'SN')for(const c of 'FT')for(const d of 'JP')codeSet.add(a+b+c+d);

test('catalog carries unique bilingual text for all sixteen codes and all axes',()=>{
  assert.deepEqual(auditInterpretationCopy(),{ok:true,errors:[]});
  assert.equal(codeSet.size,16);
});

test('all 16 polarities yield distinct, correctly keyed full descriptions in es and en',()=>{
  for(const code of codeSet){
    const answers=answersFor(code);
    for(const locale of ['es','en']){
      const narrative=buildInterpretation(answers,{locale});
      assert.equal(narrative.schema,INTERPRETATION_SCHEMA);
      assert.equal(narrative.status,'full-key');
      assert.equal(narrative.answered,32);
      assert.equal(narrative.brief.type.code,code);
      assert.equal(narrative.brief.type.status,'full-key');
      assert.ok(narrative.brief.type.title.length>5);
      assert.ok(narrative.brief.type.summary.length>45);
      assert.equal(narrative.dimensions.length,4);
      assert.ok(narrative.dimensions.every(x=>x.strength==='marked'));
      assert.equal(narrative.deep.nextAction,'none');
      assert.equal(narrative.safeguards.noProbability,true);
    }
  }
});

test('all-neutral full key follows source tie convention but refuses personality story',()=>{
  for(const locale of ['es','en']){
    const r=buildInterpretation(full(3),{locale});
    assert.equal(r.brief.type.code,'ISFJ');
    assert.equal(r.brief.type.status,'conventional-tie');
    assert.equal(r.brief.type.title,null);
    assert.equal(r.brief.type.summary,null);
    assert.equal(r.brief.type.readable,false);
    assert.ok(r.dimensions.every(a=>a.preference===null&&a.strength==='tie'));
    assert.equal(r.deep.highlights.length,0);
    assert.equal(r.deep.nuances.length,4);
  }
});

test('completely empty result is honest and does not assign any type',()=>{
  const r=buildInterpretation();
  assert.equal(r.status,'no-data');
  assert.equal(r.brief.type.code,null);
  assert.equal(r.brief.type.status,'unresolved');
  assert.equal(r.dimensions.length,4);
  assert.ok(r.dimensions.every(a=>a.strength==='unobserved'&&a.observedPosition===null));
  assert.equal(r.deep.nextAction,'continue');
});

test('a single strong answer must not invent a full four-letter profile',()=>{
  const r=buildInterpretation({3:1},{locale:'es'});
  assert.equal(r.brief.type.code,null);
  assert.equal(r.dimensions[0].preference,'E');
  assert.equal(r.dimensions[0].strength,'marked');
  assert.ok(r.dimensions[0].notes.some(n=>n.includes('pocas respuestas')));
  assert.equal(r.dimensions[0].answered,1);
  assert.equal(r.dimensions[0].evidence.supporting[0].id,3);
});

test('a balanced short path permits a provisional four-letter reading only after two observations per axis',()=>{
  const answers=Object.fromEntries(AXIS_INFO.flatMap(axis=>axis.questionIds.slice(0,2).map(id=>{
    const q=ITEM_BANK.find(item=>item.id===id);
    return [id,q.scoringSign>0?5:1];
  })));
  const r=buildInterpretation(answers);
  assert.equal(r.answered,8);
  assert.equal(r.brief.type.status,'provisional');
  assert.equal(r.brief.type.code,'ENTP');
  assert.ok(r.brief.type.readable);
  assert.equal(r.brief.type.isPreliminary,true);
  assert.equal(r.dimensions.length,4);
  assert.ok(r.dimensions.every(axis=>axis.remaining===6));
});

test('partial ties never get resolved via the official low-pole convention',()=>{
  const answers={};
  for(const axis of AXIS_INFO){
    const [id1,id2]=axis.questionIds;
    const q1=ITEM_BANK.find(item=>item.id===id1);
    const q2=ITEM_BANK.find(item=>item.id===id2);
    answers[id1]=q1.scoringSign>0?5:1; // high +2
    answers[id2]=q2.scoringSign>0?1:5; // low -2
  }
  const r=buildInterpretation(answers);
  assert.equal(r.brief.type.code,null);
  assert.ok(r.dimensions.every(a=>a.strength==='tie'));
  assert.equal(r.deep.highlights.length,0);
});

test('mixed response pattern reports both supporting and contrasting evidence with correct item provenance',()=>{
  // IE signs: 3 -1, 7 -1, 11 -1; responses 1,1,5 contribute +2,+2,-2 => E net.
  const r=buildInterpretation({3:1,7:1,11:5},{locale:'es'});
  const ie=r.dimensions[0];
  assert.equal(ie.preference,'E');
  assert.equal(ie.evidence.supportingCount,2);
  assert.equal(ie.evidence.contrastingCount,1);
  assert.deepEqual(ie.evidence.supporting.map(v=>v.id),[3,7]);
  assert.deepEqual(ie.evidence.contrasting.map(v=>v.id),[11]);
  assert.equal(ie.evidence.contrasting[0].contributesTo,'I');
  assert.ok(ie.reading.includes('matices'));
  assert.ok(r.deep.nuances.some(x=>x.id==='IE'));
});

test('neutral is counted as a real answer; skipped items are not taken as neutral',()=>{
  const r=buildInterpretation({3:3,12:5},{skipped:[7,15],locale:'en'});
  assert.equal(r.answered,2);
  assert.equal(r.skipped,2);
  assert.equal(r.dimensions[0].evidence.neutralCount,1);
  assert.equal(r.dimensions[0].answered,1);
  assert.equal(r.dimensions[0].remaining,7);
  assert.equal(r.deep.nextAction,'review');
});

test('partial positions and raw ranges remain identical to the authoritative scoring adapter',()=>{
  const answers={1:2,3:4,8:3,15:1,19:2,26:5,30:4};
  const p=buildProfile(answers);
  const r=buildInterpretation(answers);
  for(let i=0;i<4;i++){
    assert.equal(r.dimensions[i].observedPosition,p.axes[i].position);
    assert.deepEqual(r.dimensions[i].rawRange,p.axes[i].rawRange);
    assert.equal(r.dimensions[i].raw,p.axes[i].raw);
    assert.equal(r.dimensions[i].answered,p.axes[i].answered);
    assert.deepEqual(r.dimensions[i].possibleLetters,p.axes[i].possibleLetters);
  }
});

test('input and nested narrative are not mutated or mutable',()=>{
  const answers={3:1,8:2};
  const copy=JSON.stringify(answers);
  const r=buildInterpretation(answers);
  assert.equal(JSON.stringify(answers),copy);
  assert.ok(Object.isFrozen(r));
  assert.ok(Object.isFrozen(r.brief.type));
  assert.ok(Object.isFrozen(r.dimensions[0].evidence.supporting[0]));
  assert.throws(()=>r.dimensions.push('bad'),TypeError);
});

test('invalid inputs and locales fail closed, not a misleading default',()=>{
  for(const bad of [{3:null},{3:0},{3:'3'},{33:5},{'03':4}])assert.throws(()=>buildInterpretation(bad));
  assert.throws(()=>buildInterpretation({}, {locale:'fr'}),RangeError);
  assert.throws(()=>buildInterpretation({}, {skipped:[3,3]}),RangeError);
  assert.throws(()=>buildInterpretation({3:3}, {skipped:[3]}),RangeError);
});

test('session helper tracks language changes, skips, undo and serialization faithfully',()=>{
  let state=createSession({locale:'es'});
  state=transition(state,{type:'respond',id:nextItem(state),value:null});
  state=transition(state,{type:'language',locale:'en'});
  let r=interpretSession(state);
  assert.equal(r.locale,'en');
  assert.equal(r.skipped,1);
  assert.equal(r.deep.nextAction,'review');
  const clone=restoreSession(serializeSession(state));
  assert.deepEqual(interpretSession(clone),r);
  state=transition(state,{type:'undo'});
  r=interpretSession(state);
  assert.equal(r.locale,'en');
  assert.equal(r.skipped,0);
});

test('typed-language independent: translating the same answers changes copy but not interpretation',()=>{
  const answers=answersFor('ENFP');
  const es=buildInterpretation(answers,{locale:'es'});
  const en=buildInterpretation(answers,{locale:'en'});
  assert.equal(es.brief.type.code,en.brief.type.code);
  assert.notEqual(es.brief.type.title,en.brief.type.title);
  assert.deepEqual(es.dimensions.map(a=>a.observedPosition),en.dimensions.map(a=>a.observedPosition));
  assert.deepEqual(es.dimensions.map(a=>a.raw),en.dimensions.map(a=>a.raw));
});

test('deterministic interpretation of 500 synthetic profiles and bounded evidence',()=>{
  let seed=7331;
  const rand=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
  for(let i=0;i<500;i++){
    const a={};
    for(const item of ITEM_BANK)if(rand()>.19)a[item.id]=1+Math.floor(rand()*5);
    const es=buildInterpretation(a,{locale:'es'});
    const again=buildInterpretation(a,{locale:'es'});
    assert.deepEqual(es,again);
    assert.equal(es.answered,Object.keys(a).length);
    assert.equal(es.brief.type.code===null || /^(I|E)(S|N)(F|T)(J|P)$/.test(es.brief.type.code),true);
    assert.ok(es.dimensions.every(axis=>axis.evidence.supporting.length<=2&&axis.evidence.contrasting.length<=2));
    assert.ok(es.dimensions.every(axis=>axis.intensity===null||(axis.intensity>=0&&axis.intensity<=1)));
    assert.ok(es.dimensions.every(axis=>axis.answered+axis.remaining===8));
  }
});
