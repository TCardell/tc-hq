/**
 * TYPE/16 scoring/report adapter. Original OEJTS scoring remains in ../scoring.js.
 * Ranges are arithmetic bounds, NOT confidence intervals or probabilities.
 */
import {scoreAll} from '../scoring.js';
import {AXIS_INFO,BANK_VERSION,getItem} from './catalog.js';

const validAnswer=x=>Number.isInteger(x)&&x>=1&&x<=5;
export function normalizeAnswers(answers={}){
  if(!answers||typeof answers!=='object'||Array.isArray(answers))throw new TypeError('Answers must be an object');
  const result=Object.create(null);
  for(const [key,value] of Object.entries(answers)){
    const id=Number(key);
    if(!Number.isInteger(id)||String(id)!==key||!getItem(id))throw new RangeError(`Unknown item: ${key}`);
    if(!validAnswer(value))throw new RangeError(`Invalid response at Q${id}; omit skipped items instead`);
    result[id]=value;
  }
  return result;
}

export function buildProfile(inputAnswers={}, {skipped=[]}={}){
  const answers=normalizeAnswers(inputAnswers);
  if(!Array.isArray(skipped)||new Set(skipped).size!==skipped.length||skipped.some(id=>!getItem(id)||Object.hasOwn(answers,id)))
    throw new RangeError('Skipped IDs must be unique, valid and distinct from answered items');
  const scored=scoreAll(answers);
  const axes=scored.axes.map((axis,i)=>{
    const info=AXIS_INFO[i];
    const remaining=8-axis.count;
    // Each missing bipolar answer may add any integer contribution from -2 to +2.
    const minRaw=24+axis.centered-2*remaining;
    const maxRaw=24+axis.centered+2*remaining;
    const possibleLetters=minRaw>24?[axis.high]:maxRaw<=24?[axis.low]:[axis.low,axis.high];
    const neutralCount=info.questionIds.filter(id=>answers[id]===3).length;
    const strongCount=info.questionIds.filter(id=>answers[id]===1||answers[id]===5).length;
    const candidate=axis.count===0||axis.centered===0?null:axis.centered>0?axis.high:axis.low;
    return Object.freeze({
      id:axis.id,low:axis.low,high:axis.high,answered:axis.count,remaining,
      neutralCount,strongCount,skippedCount:info.questionIds.filter(id=>skipped.includes(id)).length,
      centered:axis.centered,position:axis.position,raw:axis.raw,
      rawRange:Object.freeze([minRaw,maxRaw]),
      possibleLetters:Object.freeze(possibleLetters),
      arithmeticallyFixed:possibleLetters.length===1, // never describe as 'confidence'
      exploratoryLetter:candidate,
      officialLetter:scored.complete?axis.officialLetter:null,
      ambiguity:axis.count===0?'unobserved':axis.centered===0?'observed-tie':'open',
      coverage:axis.count/8
    });
  });
  const complete=scored.complete;
  return Object.freeze({
    engine:'type16',bankVersion:BANK_VERSION,
    status:complete?'full-key':scored.answered===0?'no-data':'exploratory',
    complete,answered:scored.answered,skipped:skipped.length,missing:32-scored.answered,
    axes:Object.freeze(axes),
    exploratoryCode:axes.map(a=>a.exploratoryLetter||'?').join(''),
    possibleCode:axes.map(a=>a.possibleLetters.join('/')).join(' · '),
    officialType:complete?scored.officialType:null,
    caution:'Arithmetic ranges are not psychometric confidence intervals; short paths and translations are unvalidated.'
  });
}
