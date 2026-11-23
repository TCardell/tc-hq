/** Console-only demonstration. No UI, no storage, no personal data. */
import {ITEM_BANK,AXIS_INFO,buildInterpretation} from '../js/engine/index.js';

function aligned(code){
  return Object.fromEntries(ITEM_BANK.map(q=>{
    const axis=AXIS_INFO.find(a=>a.id===q.dimension);
    const high=code[AXIS_INFO.indexOf(axis)]===axis.high;
    return [q.id,(high?q.scoringSign:-q.scoringSign)>0?5:1];
  }));
}
const sample=aligned('INFP');
const quickIds=[3,12,22,25,15,20,14,13,11,32,26,17];
const quick=Object.fromEntries(quickIds.map(id=>[id,sample[id]]));
const projections={};
for(const [key,answers,locale] of [['quick',quick,'es'],['complete',sample,'es'],['english',sample,'en']]){
  const r=buildInterpretation(answers,{locale});
  projections[key]={answered:r.answered,type:r.brief.type,axes:r.dimensions.map(a=>({id:a.id,preference:a.preference,position:a.observedPosition,answered:a.answered})),
    deep:{nextAction:r.deep.nextAction,highlights:r.deep.highlights,nuances:r.deep.nuances.length}};
}
console.log(JSON.stringify(projections,null,2));
