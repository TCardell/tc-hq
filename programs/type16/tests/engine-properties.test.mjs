import test from 'node:test';
import assert from 'node:assert/strict';
import {buildProfile,createSession,transition,nextItem,restoreSession,serializeSession} from '../js/engine/index.js';
import {QUESTIONS} from '../js/questions.js';

function independentlyScore(q){
  return [
    30-q[3]-q[7]-q[11]+q[15]-q[19]+q[23]+q[27]-q[31],
    12+q[4]+q[8]+q[12]+q[16]+q[20]-q[24]-q[28]+q[32],
    30-q[2]+q[6]+q[10]-q[14]-q[18]+q[22]-q[26]-q[30],
    18+q[1]+q[5]-q[9]+q[13]-q[17]+q[21]-q[25]+q[29]
  ];
}
const rng=seed=>()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296};

test('500 random full sets match the independent, published scoring formulas',()=>{
  const r=rng(8522);
  for(let n=0;n<500;n++){
    const answers=Object.fromEntries(QUESTIONS.map(q=>[q.id,Math.floor(r()*5)+1]));
    const p=buildProfile(answers),expected=independentlyScore(answers);
    assert.deepEqual(p.axes.map(a=>a.raw),expected);
    assert.equal(p.officialType,[expected[0]>24?'E':'I',expected[1]>24?'N':'S',expected[2]>24?'T':'F',expected[3]>24?'P':'J'].join(''));
    assert.ok(p.axes.every(a=>a.raw>=8&&a.raw<=40&&a.position>=0&&a.position<=100));
  }
});
test('subsets: every completed full score lies within its preceding arithmetic bound',()=>{
  const r=rng(942);
  for(let trial=0;trial<100;trial++){
    const all=Object.fromEntries(QUESTIONS.map(q=>[q.id,Math.floor(r()*5)+1]));
    const partial=Object.fromEntries(Object.entries(all).filter(()=>r()<.5));
    const p=buildProfile(partial),f=buildProfile(all);
    for(let axis=0;axis<4;axis++){
      const [min,max]=p.axes[axis].rawRange;
      assert.ok(f.axes[axis].raw>=min&&f.axes[axis].raw<=max);
      if(p.axes[axis].arithmeticallyFixed)assert.equal(p.axes[axis].possibleLetters[0],f.axes[axis].officialLetter);
    }
  }
});
test('random state transitions survive serialisation at every checkpoint and undo step',()=>{
  const r=rng(124);
  for(let trial=0;trial<25;trial++){
    let s=createSession({locale:trial%2?'en':'es'});
    let steps=0;
    while(steps++<100){
      const id=nextItem(s);
      if(id){const value=r()<.13?null:Math.floor(r()*5)+1;s=transition(s,{type:'respond',id,value});}
      else if(s.phase==='checkpoint'){
        if(s.skipped.length&&r()<.1)s=transition(s,{type:'review'});
        else if(s.seen.length<32)s=transition(s,{type:'continue'});
        else{s=transition(s,{type:'finish'});break}
      }else break;
      const roundTrip=restoreSession(serializeSession(s));assert.deepEqual(roundTrip,s);
      if(s.undoStack.length&&r()<.03){
        const back=transition(s,{type:'undo'});assert.notDeepEqual(back,s);
        s=back;
      }
    }
    assert.ok(steps<100);
  }
});
