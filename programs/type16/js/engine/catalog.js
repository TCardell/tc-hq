/**
 * TYPE/16 questionnaire catalog, independent of rendering and browser storage.
 * The English items and key come from OEJTS 1.2 (Eric Jorgenson, 2015).
 * Items/translations: CC BY-NC-SA 4.0. ES wording is an unvalidated draft.
 */
import {QUESTIONS, FAST_IDS, ORDER} from '../questions.js';
import {AXES} from '../scoring.js';

export const BANK_VERSION = 'oejts-1.2-type16-draft-1';
export const BANK_SOURCE = 'https://openpsychometrics.org/tests/OJTS/development/OEJTS1.2.pdf';
export const BANK_LICENSE = 'CC BY-NC-SA 4.0';
export const RESPONSE_VALUES = Object.freeze({veryA:1,somewhatA:2,neutral:3,somewhatB:4,veryB:5,skip:null});

// Themes are editorial grouping aids for sequence diversity. They are NOT
// psychometric factors, item calibration, or evidence of measurement validity.
const THEMES = Object.freeze([
  'planning','beliefs','social-energy','change','order','analytical-style','energy','learning',
  'order','emotion','collaboration','time','planning','relationships','social-energy','identity',
  'decisions','helping','conversation','meaning','procrastination','decisions','social-activity',
  'abstraction','planning','values','communication','abstraction','activity','emotion',
  'public-speaking','curiosity'
]);
const REVIEW_IDS = Object.freeze([2,6,8,10,16,18,26,27,29,31,32]);
export const AXIS_INFO = Object.freeze(AXES.map(axis => Object.freeze({
  id:axis.id,low:axis.low,high:axis.high,questionIds:Object.freeze(axis.items.map(([id])=>id)),
  labels:Object.freeze({
    IE:{es:['Introversión','Extraversión'],en:['Introversion','Extraversion']},
    SN:{es:['Sensación','Intuición'],en:['Sensing','Intuition']},
    FT:{es:['Sentimiento','Pensamiento'],en:['Feeling','Thinking']},
    JP:{es:['Juicio','Percepción'],en:['Judging','Perceiving']}
  }[axis.id])
})));
const signs = new Map(AXES.flatMap(axis=>axis.items.map(([id,sign])=>[id,{axis:axis.id,sign}])));

export const ITEM_BANK = Object.freeze(QUESTIONS.map(q=>Object.freeze({
  id:q.id,sourceId:`OEJTS12:Q${String(q.id).padStart(2,'0')}`,
  dimension:signs.get(q.id)?.axis,
  scoringSign:signs.get(q.id)?.sign,
  theme:THEMES[q.id-1],
  editorialReview:REVIEW_IDS.includes(q.id),
  left:Object.freeze({...q.left}),right:Object.freeze({...q.right}),
  source:q.source,translationStatus:q.translationStatus
})));

const index = new Map(ITEM_BANK.map(item=>[item.id,item]));
export function getItem(id){return Number.isInteger(id)?index.get(id)??null:null}
export function questionText(id,locale='es'){
  if(!['es','en'].includes(locale))throw new RangeError('Unsupported locale');
  const q=getItem(id);
  if(!q)return null;
  return Object.freeze({id:q.id,sourceId:q.sourceId,dimension:q.dimension,
    left:q.left[locale],right:q.right[locale],translationStatus:q.translationStatus});
}

/** Validate immutable source data before changing the item bank or scoring key. */
export function auditCatalog(){
  const errors=[];
  if(ITEM_BANK.length!==32)errors.push('Item bank must contain exactly 32 entries');
  if(AXES.length!==4)errors.push('Expected four axes');
  if(new Set(ITEM_BANK.map(q=>q.id)).size!==32)errors.push('Duplicate item IDs');
  if(new Set(ORDER).size!==32||ORDER.length!==32)errors.push('ORDER is not a permutation of 32 items');
  if(new Set(FAST_IDS).size!==12||FAST_IDS.length!==12)errors.push('FAST_IDS must contain 12 distinct questions');
  for(let id=1;id<=32;id++){
    const q=getItem(id);
    if(!q){errors.push(`Missing Q${id}`);continue}
    if(q.scoringSign!==1&&q.scoringSign!==-1)errors.push(`Invalid score sign Q${id}`);
    if(!q.theme)errors.push(`Missing editorial topic Q${id}`);
    if(!['es','en'].every(locale=>q.left[locale]?.trim()&&q.right[locale]?.trim()))errors.push(`Missing copy Q${id}`);
    if(!ORDER.includes(id))errors.push(`Q${id} missing from ORDER`);
  }
  for(const axis of AXES){
    if(axis.items.length!==8)errors.push(`${axis.id} must have 8 items`);
    if(axis.items.filter(([id])=>FAST_IDS.includes(id)).length!==3)errors.push(`${axis.id} must have 3 fast items`);
  }
  return Object.freeze({ok:errors.length===0,errors:Object.freeze(errors)});
}
