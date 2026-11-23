import test from 'node:test';
import assert from 'node:assert/strict';
import {buildProfile,normalizeAnswers} from '../js/engine/index.js';
import {scoreAll} from '../js/scoring.js';
import {QUESTIONS} from '../js/questions.js';
const all=n=>Object.fromEntries(QUESTIONS.map(q=>[q.id,n]));

test('full 32 reproduces legacy OEJTS published key on extremes and midpoint',()=>{
  for(const n of [1,2,3,4,5]){
    const answers=all(n),original=scoreAll(answers),p=buildProfile(answers);
    assert.equal(p.status,'full-key');assert.equal(p.complete,true);
    assert.equal(p.officialType,original.officialType);
    for(let i=0;i<4;i++){
      assert.equal(p.axes[i].raw,original.axes[i].raw);
      assert.deepEqual(p.axes[i].rawRange,[original.axes[i].raw,original.axes[i].raw]);
      assert.equal(p.axes[i].officialLetter,original.axes[i].officialLetter);
    }
  }
  assert.deepEqual(buildProfile(all(3)).axes.map(a=>a.raw),[24,24,24,24]);
  assert.equal(buildProfile(all(3)).officialType,'ISFJ');
  assert.equal(buildProfile(all(1)).officialType,'ESTJ');
  assert.equal(buildProfile(all(5)).officialType,'INFP');
});
test('partial answers do not become official; skip differs from neutral',()=>{
  const a=buildProfile({3:5,12:3},{skipped:[11]});
  assert.equal(a.officialType,null);assert.equal(a.status,'exploratory');
  assert.equal(a.answered,2);assert.equal(a.skipped,1);
  assert.equal(a.axes[0].answered,1);assert.equal(a.axes[0].skippedCount,1);
  assert.equal(a.axes[1].neutralCount,1);
  assert.equal(a.axes[0].position,0);
  assert.equal(a.axes[0].arithmeticallyFixed,false);
  assert.deepEqual(a.axes[0].rawRange,[8,36]);
});
test('partial mathematical bounds are accurate, not confidence estimates',()=>{
  const answers={3:1,7:1,11:1,15:5,19:1,23:5,27:5};
  const p=buildProfile(answers),ie=p.axes[0];
  assert.equal(ie.answered,7);
  assert.equal(ie.centered,14);
  assert.deepEqual(ie.rawRange,[36,40]);
  assert.deepEqual(ie.possibleLetters,['E']);
  assert.equal(ie.arithmeticallyFixed,true);
  assert.equal(ie.officialLetter,null);
  assert.equal(p.complete,false);
});
test('invalid or skipped values cannot be passed off as neutral',()=>{
  for(const a of [{1:null},{1:0},{1:'3'},{1:6},{33:3},{'01':3}])assert.throws(()=>normalizeAnswers(a),RangeError);
  assert.throws(()=>normalizeAnswers([]),TypeError);
  assert.throws(()=>buildProfile({1:3},{skipped:[1]}),RangeError);
  assert.throws(()=>buildProfile({1:3},{skipped:[2,2]}),RangeError);
});
