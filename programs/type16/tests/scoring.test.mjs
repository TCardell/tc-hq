import test from "node:test";
import assert from "node:assert/strict";
import {scoreAll,AXES} from "../js/scoring.js";
import {QUESTIONS,FAST_IDS,ORDER} from "../js/questions.js";

const all = value => Object.fromEntries(QUESTIONS.map(q=>[q.id,value]));

test("32 questions, 8 per axis, unique quick selection of 3 per axis",()=>{
  assert.equal(QUESTIONS.length,32);
  assert.equal(new Set(QUESTIONS.map(q=>q.id)).size,32);
  assert.equal(new Set(ORDER).size,32);
  assert.equal(FAST_IDS.length,12);
  assert.equal(AXES.length,4);
  assert.ok(AXES.every(axis=>axis.items.length===8));
  for (const axis of AXES) assert.equal(axis.items.filter(([id])=>FAST_IDS.includes(id)).length,3);
});

test("neutral full answers: published midpoint and tie-low convention",()=>{
  const s=scoreAll(all(3));
  assert.deepEqual(s.axes.map(x=>x.raw),[24,24,24,24]);
  assert.equal(s.officialType,"ISFJ");
  assert.equal(s.complete,true);
  assert.ok(s.axes.every(x=>x.ambiguous));
});

test("all 1s and all 5s reproduce exact original-key formulas",()=>{
  const a=scoreAll(all(1));
  const b=scoreAll(all(5));
  assert.deepEqual(a.axes.map(x=>x.raw),[28,16,28,20]);
  assert.deepEqual(b.axes.map(x=>x.raw),[20,32,20,28]);
  assert.equal(a.officialType,"ESTJ");
  assert.equal(b.officialType,"INFP");
});

test("reversed items and partial results do not pretend to be official",()=>{
  const inputs={1:1,3:5,4:3,2:3};
  const s=scoreAll(inputs);
  assert.equal(s.complete,false);
  assert.equal(s.officialType,null);
  assert.equal(s.answered,4);
  assert.equal(s.axes[0].preferred,"I");
  assert.equal(s.axes[3].preferred,"J");
  assert.equal(s.axes[1].position,50);
});

test("missing and invalid values are not neutral answers",()=>{
  const s=scoreAll({1:0,2:6,3:null,4:"3"});
  assert.equal(s.answered,0);
  assert.ok(s.axes.every(x=>x.position===null && x.preferred===null));
});
