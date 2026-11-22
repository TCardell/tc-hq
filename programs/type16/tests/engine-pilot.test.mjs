import test from 'node:test';
import assert from 'node:assert/strict';
import {PILOT_VERSION,PILOT_FORMS,createPilotForm,parsePilotObservation,
  summarizePilotObservations,auditPilotDesign} from '../js/engine/pilot.js';
import {scoreAll} from '../js/scoring.js';
import {EDITORIAL_AUDIT} from '../js/engine/editorial-audit.js';

const obs=(patch={})=>({
  pilotVersion:PILOT_VERSION,formId:'A',locale:'es',variant:'current',itemId:27,
  response:2,comprehension:'clear',optionFit:'distinct',severity:'none',flags:[],...patch
});

test('pilot forms cover all 32 items once, two per axis and three high-risk each',()=>{
  assert.deepEqual(auditPilotDesign(),{ok:true,errors:[],forms:4,items:32});
  const ids=Object.values(PILOT_FORMS).flat();
  assert.deepEqual([...ids].sort((a,b)=>a-b),Array.from({length:32},(_,i)=>i+1));
});
test('Spanish current/candidate and English source use separate text and status',()=>{
  const a=createPilotForm({formId:'A',locale:'es',variant:'current'});
  const b=createPilotForm({formId:'A',locale:'es',variant:'candidate'});
  const c=createPilotForm({formId:'A',locale:'en',variant:'source'});
  assert.equal(a.items[0].itemId,27);
  assert.equal(a.items[0].left,EDITORIAL_AUDIT[26].currentDraftSpanish.left);
  assert.equal(b.items[0].left,EDITORIAL_AUDIT[26].candidateSpanish.left);
  assert.equal(c.items[0].left,EDITORIAL_AUDIT[26].sourceEnglish.left);
  assert.equal(a.scored,false);assert.equal(c.validated,false);
  assert.ok(a.items.every(x=>x.scoringAllowed===false));
  assert.equal(Object.isFrozen(c.items),true);
});
test('rotation affects order, not item content or coverage',()=>{
  const a=createPilotForm({formId:'B',rotation:0});
  for(let r=1;r<8;r++){
    const rotated=createPilotForm({formId:'B',rotation:r});
    assert.equal(rotated.items[0].itemId,a.items[r].itemId);
    assert.deepEqual(new Set(rotated.items.map(x=>x.itemId)),new Set(a.items.map(x=>x.itemId)));
  }
});
test('reject invalid form, language, wording or rotation',()=>{
  for(const value of ['Z','__proto__'])assert.throws(()=>createPilotForm({formId:value}),RangeError);
  assert.throws(()=>createPilotForm({locale:'fr'}),RangeError);
  assert.throws(()=>createPilotForm({locale:'en',variant:'candidate'}),RangeError);
  assert.throws(()=>createPilotForm({locale:'es',variant:'source'}),RangeError);
  for(const rotation of [-1,8,2.5,'2'])assert.throws(()=>createPilotForm({rotation}),RangeError);
});
test('accept a valid anonymized coded observation and freeze it',()=>{
  const o=parsePilotObservation(obs({flags:['context'],severity:'minor',response:null}));
  assert.equal(o.response,null);assert.equal(Object.isFrozen(o),true);assert.equal(Object.isFrozen(o.flags),true);
});
test('reject extra properties that could leak participant identifiers',()=>{
  assert.throws(()=>parsePilotObservation(obs({participantName:'A'})),TypeError);
  assert.throws(()=>parsePilotObservation(obs({freeText:'some quotation'})),TypeError);
  assert.throws(()=>parsePilotObservation(obs({participantId:'123'})),TypeError);
  const incomplete=obs();delete incomplete.response;
  assert.throws(()=>parsePilotObservation(incomplete),TypeError);
});
test('reject invalid response, form-item mismatches and inconsistent codes',()=>{
  for(const response of [0,6,'3',undefined])assert.throws(()=>parsePilotObservation(obs({response})),RangeError);
  for(const itemId of [12,0,100])assert.throws(()=>parsePilotObservation(obs({itemId})),RangeError);
  assert.throws(()=>parsePilotObservation(obs({flags:['accessibility']})),RangeError);
  assert.throws(()=>parsePilotObservation(obs({severity:'blocking'})),RangeError);
  assert.throws(()=>parsePilotObservation(obs({flags:['other','other'],severity:'minor'})),RangeError);
  assert.throws(()=>parsePilotObservation(obs({comprehension:'sure'})),RangeError);
});
test('qualitative aggregation never approves items or claims psychometric validity',()=>{
  const data=[obs(),obs({severity:'major',flags:['construct'],optionFit:'both',comprehension:'not-clear'}),
    obs({itemId:8,variant:'candidate',severity:'blocking',flags:['accessibility'],response:null})];
  const report=summarizePilotObservations(data);
  assert.equal(report.recordCount,3);
  assert.equal(report.itemVariantCount,2);
  assert.equal(report.items[0].suggestedWorkflow,'hold-for-revision');
  assert.equal(report.items[1].suggestedWorkflow,'review-and-retest');
  assert.ok(report.items.every(x=>x.approval==='not-evaluated'));
  assert.equal(summarizePilotObservations([]).itemVariantCount,0);
});
test('pilot labels and variants cannot alter the OEJTS scoring module',()=>{
  const before=scoreAll({2:5,8:1,27:4,31:2});
  createPilotForm({formId:'A',locale:'es',variant:'candidate'});
  summarizePilotObservations([obs()]);
  assert.deepEqual(scoreAll({2:5,8:1,27:4,31:2}),before);
});
