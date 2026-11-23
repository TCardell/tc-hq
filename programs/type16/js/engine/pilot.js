/**
 * TYPE/16 — cognitive-interview pilot kit (editorial only, NOT scoring).
 * All item texts are copied from the frozen, unapproved editorial audit.
 * No participant identifiers, free-text interviews, network or browser APIs.
 */
import {EDITORIAL_AUDIT, REVIEW_VERSION, getEditorialReview} from './editorial-audit.js';
import {BANK_VERSION} from './catalog.js';

export const PILOT_VERSION = 'type16-cognitive-pilot-v1';

// Four 8-item forms. Each contains 2 items per axis and exactly 3 high-risk
// items. Across four forms each of the 32 questions occurs exactly once.
// The order alternates constructs and is NOT the scoring sequence.
export const PILOT_FORMS = Object.freeze({
  A: Object.freeze([27,8,1,2,5,11,14,4]),
  B: Object.freeze([16,9,31,6,3,13,20,22]),
  C: Object.freeze([10,7,28,17,12,25,18,15]),
  D: Object.freeze([29,26,19,24,30,32,21,23])
});
export const OBSERVATION_FIELDS = Object.freeze([
  'pilotVersion','formId','locale','variant','itemId','response',
  'comprehension','optionFit','severity','flags'
]);
export const COMPREHENSION = Object.freeze(['clear','partially-clear','not-clear','not-assessed']);
export const OPTION_FIT = Object.freeze(['distinct','both','neither','context-dependent','not-assessed']);
export const SEVERITY = Object.freeze(['none','minor','major','blocking']);
export const FLAGS = Object.freeze([
  'wording','translation','construct','false-dichotomy','context',
  'culture','social-desirability','accessibility','other'
]);
const variants = Object.freeze({es:['current','candidate'],en:['source']});
const validResponses = new Set([1,2,3,4,5,null]);
const orderedForms = Object.keys(PILOT_FORMS);

/** Generate one versioned, non-scored interview form. A participant sees only
 * one wording variant, preventing direct within-person carryover. */
export function createPilotForm({formId='A',locale='es',variant,rotation=0}={}){
  if(!Object.hasOwn(PILOT_FORMS,formId))throw new RangeError('Unknown pilot form');
  if(!Object.hasOwn(variants,locale))throw new RangeError('Unsupported pilot locale');
  const wording=variant??(locale==='es'?'current':'source');
  if(!variants[locale].includes(wording))throw new RangeError('Variant is incompatible with locale');
  if(!Number.isInteger(rotation)||rotation<0||rotation>7)throw new RangeError('Rotation must be 0..7');
  const ids=PILOT_FORMS[formId];
  const ordered=ids.slice(rotation).concat(ids.slice(0,rotation));
  return Object.freeze({
    pilotVersion:PILOT_VERSION,reviewVersion:REVIEW_VERSION,bankVersion:BANK_VERSION,
    formId,locale,variant:wording,rotation,
    scored:false,validated:false,
    items:Object.freeze(ordered.map(id=>{
      const item=getEditorialReview(id);
      const text=locale==='en'?item.sourceEnglish:wording==='candidate'?item.candidateSpanish:item.currentDraftSpanish;
      return Object.freeze({
        itemId:id,sourceId:item.sourceId,axis:item.axis,riskLevel:item.riskLevel,
        wordingVersion:wording,
        left:text.left,right:text.right,
        prompt:locale==='es'?'¿Cuál de las dos opciones te describe mejor?':'Which of the two options describes you better?',
        scoringAllowed:false
      });
    }))
  });
}

/** Strictly coded, anonymous evidence. Prohibits extra keys (names/notes/IDs)
 * so accidental personally identifying information cannot enter this module. */
export function parsePilotObservation(observation){
  if(!observation||typeof observation!=='object'||Array.isArray(observation))throw new TypeError('Expected observation object');
  const keys=Object.keys(observation);
  if(keys.length!==OBSERVATION_FIELDS.length||
    keys.some(key=>!OBSERVATION_FIELDS.includes(key))||
    OBSERVATION_FIELDS.some(key=>!Object.hasOwn(observation,key)))
    throw new TypeError('Observation fields must match the anonymous schema exactly');
  const {pilotVersion,formId,locale,variant,itemId,response,comprehension,optionFit,severity,flags}=observation;
  if(pilotVersion!==PILOT_VERSION)throw new RangeError('Unknown pilot version');
  // Also validates locale and variant together.
  const form=createPilotForm({formId,locale,variant});
  if(!Number.isInteger(itemId)||!form.items.some(item=>item.itemId===itemId))throw new RangeError('Item is not on this interview form');
  if(!validResponses.has(response)||response===undefined)throw new RangeError('Invalid selection; use 1..5 or null for skip');
  if(!COMPREHENSION.includes(comprehension))throw new RangeError('Invalid comprehension code');
  if(!OPTION_FIT.includes(optionFit))throw new RangeError('Invalid option-fit code');
  if(!SEVERITY.includes(severity))throw new RangeError('Invalid severity code');
  if(!Array.isArray(flags)||flags.some(x=>!FLAGS.includes(x))||new Set(flags).size!==flags.length)
    throw new RangeError('Invalid or duplicate issue flag');
  if(severity==='none'&&flags.length)throw new RangeError('A flagged concern requires nonzero severity');
  if(severity==='blocking'&&flags.length===0)throw new RangeError('Blocking concerns must be categorized');
  return Object.freeze({
    pilotVersion,formId,locale,variant,itemId,response,comprehension,optionFit,severity,
    flags:Object.freeze([...flags])
  });
}

/** Descriptive ONLY: each record is one observed item interaction, not a
 * participant. No prevalence, reliability, significance or validity claims. */
export function summarizePilotObservations(input=[]){
  if(!Array.isArray(input))throw new TypeError('Expected observation array');
  const parsed=input.map(parsePilotObservation);
  const perItem=new Map();
  for(const o of parsed){
    const key=`${o.locale}:${o.variant}:${String(o.itemId).padStart(2,'0')}`;
    if(!perItem.has(key))perItem.set(key,{
      key,itemId:o.itemId,locale:o.locale,variant:o.variant,
      riskLevel:getEditorialReview(o.itemId).riskLevel,
      observations:0,unclear:0,optionProblems:0,majorOrBlocking:0,
      severityCounts:{none:0,minor:0,major:0,blocking:0},flags:{}
    });
    const row=perItem.get(key);
    row.observations++;
    if(o.comprehension==='not-clear'||o.comprehension==='partially-clear')row.unclear++;
    if(!['distinct','not-assessed'].includes(o.optionFit))row.optionProblems++;
    if(['major','blocking'].includes(o.severity))row.majorOrBlocking++;
    row.severityCounts[o.severity]++;
    for(const flag of o.flags)row.flags[flag]=(row.flags[flag]||0)+1;
  }
  const items=[...perItem.values()].sort((a,b)=>a.itemId-b.itemId||a.locale.localeCompare(b.locale)||a.variant.localeCompare(b.variant)).map(r=>{
    const action=r.severityCounts.blocking>0?'hold-for-revision':
      r.majorOrBlocking>0||r.optionProblems>0?'review-and-retest':
      'independent-editorial-review';
    // Even a clean sample never automatically approves translation or scores.
    return Object.freeze({...r,
      severityCounts:Object.freeze(r.severityCounts),flags:Object.freeze(r.flags),
      suggestedWorkflow:action,approval:'not-evaluated'
    });
  });
  const byRisk={high:0,medium:0,low:0};
  for(const row of items)byRisk[row.riskLevel]++;
  return Object.freeze({
    pilotVersion:PILOT_VERSION,reviewVersion:REVIEW_VERSION,recordCount:parsed.length,
    itemVariantCount:items.length,coverageByRisk:Object.freeze(byRisk),
    items:Object.freeze(items),
    note:'Qualitative coded observations only; no evidence of instrument validity, score equivalence or population prevalence.'
  });
}

/** Machine-checkable form integrity, separate from empirical study outcomes. */
export function auditPilotDesign(){
  const errors=[];
  if(EDITORIAL_AUDIT.length!==32)errors.push('Expected 32 audited items');
  const all=[];
  for(const key of orderedForms){
    const ids=PILOT_FORMS[key];all.push(...ids);
    if(ids.length!==8||new Set(ids).size!==8)errors.push(`Form ${key} must have 8 unique items`);
    const rows=ids.map(getEditorialReview);
    if(rows.some(x=>!x)){errors.push(`Form ${key} references missing review`);continue;}
    for(const axis of ['IE','SN','FT','JP'])if(rows.filter(x=>x.axis===axis).length!==2)
      errors.push(`Form ${key} must have 2 ${axis} items`);
    if(rows.filter(x=>x.riskLevel==='high').length!==3)errors.push(`Form ${key} must have 3 high-risk items`);
  }
  if(all.length!==32||new Set(all).size!==32||all.some(id=>id<1||id>32))
    errors.push('Forms must partition Q01..Q32');
  return Object.freeze({ok:errors.length===0,errors:Object.freeze(errors),forms:orderedForms.length,items:new Set(all).size});
}
