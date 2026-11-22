import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {EDITORIAL_AUDIT,REVIEW_VERSION,getEditorialReview,getEditorialSummary} from '../js/engine/editorial-audit.js';
import {ITEM_BANK,BANK_VERSION} from '../js/engine/catalog.js';
import {AXES,scoreAll} from '../js/scoring.js';
const digest=v=>createHash('sha256').update(JSON.stringify(v),'utf8').digest('hex');
const SOURCE_HASH='17f54688a2e6d898ee114d52ec419f038023f787961d4528c6cdc28fa19e7d87';
const SCORING_HASH='5d6d2de60109ea8fa2f8a22d34140a17e8fb52e1b1ae62d551a522c5cd059d2b';
test('original English source snapshot and canonical question data match',()=>{
 assert.equal(EDITORIAL_AUDIT.length,32);
 assert.equal(digest(EDITORIAL_AUDIT.map(q=>[q.id,q.sourceEnglish.left,q.sourceEnglish.right])),SOURCE_HASH);
 for(const q of EDITORIAL_AUDIT){const item=ITEM_BANK[q.id-1];
  assert.equal(q.sourceId,item.sourceId);
  assert.deepEqual(q.sourceEnglish,{left:item.left.en,right:item.right.en});
  assert.deepEqual(q.currentDraftSpanish,{left:item.left.es,right:item.right.es});
  assert.equal(q.axis,item.dimension);assert.equal(q.sign,item.scoringSign);}
});
test('source scoring key and midpoint stay unchanged',()=>{
 assert.equal(digest(AXES.map(a=>[a.id,a.base,a.items])),SCORING_HASH);
 assert.equal(BANK_VERSION,'oejts-1.2-type16-draft-1');
 assert.deepEqual(scoreAll(Object.fromEntries(Array.from({length:32},(_,i)=>[i+1,3]))).axes.map(a=>a.raw),[24,24,24,24]);
});
test('32 bilingual editorial proposals are pending, complete and immutable',()=>{
 assert.equal(REVIEW_VERSION,'oejts12-editorial-audit-2026-11-22-v1');
 assert.deepEqual(getEditorialSummary().counts,{high:12,medium:17,low:3});
 assert.equal(getEditorialSummary().sourceChecked,32);
 assert.equal(getEditorialSummary().approvedTranslation,0);
 assert.equal(getEditorialSummary().pending,32);
 for(const q of EDITORIAL_AUDIT){
  assert.ok(q.issueEs.length>25&&q.nextReviewActionEs.length>20&&q.riskTags.length>0);
  assert.ok(q.candidateSpanish.left.length>5&&q.candidateSpanish.right.length>5);
  assert.equal(q.translationApproval,false);
  assert.equal(q.status,'pending-independent-review');
  assert.equal(getEditorialReview(q.id),q);
  assert.ok(Object.isFrozen(q)&&Object.isFrozen(q.riskTags));
 }
 assert.equal(getEditorialReview('3'),null);assert.equal(getEditorialReview(33),null);
});
test('12 priority questions remain flagged for independent review',()=>{
 for(const id of [2,6,8,10,16,18,26,27,28,29,30,31])
  assert.equal(getEditorialReview(id).riskLevel,'high','Q'+id);
});
test('editorial candidate edits cannot modify scores',()=>{
 const a=Object.fromEntries(Array.from({length:32},(_,i)=>[i+1,(i%5)+1]));
 const before=scoreAll(a);
 assert.throws(()=>{EDITORIAL_AUDIT[0].candidateSpanish.left='changed'},TypeError);
 assert.throws(()=>EDITORIAL_AUDIT.push({}),TypeError);
 assert.deepEqual(scoreAll(a),before);
});
