import test from 'node:test';
import assert from 'node:assert/strict';
import {auditCatalog,ITEM_BANK,AXIS_INFO,questionText,BANK_VERSION,RESPONSE_VALUES} from '../js/engine/index.js';
import {AXES} from '../js/scoring.js';
import {FAST_IDS} from '../js/questions.js';

test('catalog: 32 exact source identifiers, four balanced axes and 12 balanced fast items',()=>{
  const audit=auditCatalog();assert.equal(audit.ok,true,audit.errors.join(' | '));
  assert.equal(ITEM_BANK.length,32);assert.equal(BANK_VERSION,'oejts-1.2-type16-draft-1');
  assert.deepEqual(ITEM_BANK.map(x=>x.id),Array.from({length:32},(_,i)=>i+1));
  assert.equal(new Set(ITEM_BANK.map(q=>q.sourceId)).size,32);
  assert.equal(AXIS_INFO.length,4);
  for(const axis of AXES){
    const qs=ITEM_BANK.filter(q=>q.dimension===axis.id);
    assert.equal(qs.length,8);assert.equal(qs.filter(q=>FAST_IDS.includes(q.id)).length,3);
    for(const q of qs)assert.equal(q.scoringSign,axis.items.find(([id])=>id===q.id)[1]);
  }
  assert.equal(RESPONSE_VALUES.skip,null);
});
test('catalog: ES and EN are both present but Spanish remains editorial draft',()=>{
  for(const item of ITEM_BANK){
    for(const locale of ['es','en']){
      const q=questionText(item.id,locale);
      assert.ok(q.left.length>3&&q.right.length>3);
      assert.equal(q.translationStatus,'draft');
    }
  }
  assert.throws(()=>questionText(1,'fr'),RangeError);
  assert.equal(questionText(33),null);
});
