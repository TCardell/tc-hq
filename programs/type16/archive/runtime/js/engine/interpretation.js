/**
 * TYPE/16 explanatory layer v1. Pure data in, structured bilingual narrative out.
 * Uses only observed OEJTS-1.2 responses; no random text, LLM, norms or diagnosis.
 * Neither scoreAll nor the frozen question bank is altered here.
 */
import {ITEM_BANK, BANK_VERSION, AXIS_INFO} from './catalog.js';
import {buildProfile, normalizeAnswers} from './profile.js';
import {validateSession} from './session.js';
import {TYPE_COPY, AXIS_COPY, THEME_COPY, WORDING} from './interpretation-copy.js';

export const INTERPRETATION_SCHEMA = 1;
const LOCALES = new Set(['es','en']);
const LETTERS = /^[IE][SN][FT][JP]$/;

function freezeTree(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) freezeTree(child);
    Object.freeze(value);
  }
  return value;
}
function wordTopic(theme,locale){
  const entries = THEME_COPY[theme];
  if(!entries) throw new Error(`Missing interpretation topic: ${theme}`);
  return entries[locale==='es'?0:1];
}
function scaleStrength(axis) {
  if(axis.answered===0) return 'unobserved';
  if(axis.centered===0) return 'tie';
  const intensity = Math.abs(axis.centered)/(2*axis.answered);
  return intensity < .25 ? 'slight' : intensity < .625 ? 'moderate' : 'marked';
}
function getAxisEvidence(axis,answers,locale) {
  const scored = ITEM_BANK.filter(item=>item.dimension===axis.id && Object.hasOwn(answers,item.id))
    .map(item=>{
      const response=answers[item.id];
      const signed=item.scoringSign*(response-3);
      return {
        id:item.id,sourceId:item.sourceId,theme:item.theme,
        topic:wordTopic(item.theme,locale),response,
        direction:signed===0?'neutral':signed>0?'high':'low',
        contributesTo:signed===0?null:signed>0?axis.high:axis.low,
        degree:Math.abs(signed)===2?'strong':Math.abs(signed)===1?'soft':'neutral',
        signedContribution:signed
      };
    });
  const preference=axis.centered>0?'high':axis.centered<0?'low':null;
  const byWeight=(a,b)=>Math.abs(b.signedContribution)-Math.abs(a.signedContribution)||a.id-b.id;
  const supporting=preference?scored.filter(item=>item.direction===preference).sort(byWeight):[];
  const contrasting=preference?scored.filter(item=>item.direction!=='neutral'&&item.direction!==preference).sort(byWeight):[];
  const neutrals=scored.filter(item=>item.direction==='neutral');
  // Details remain traceable to specific answers, but never imply that a single
  // item supports a validated psychological conclusion.
  return {supporting:supporting.slice(0,2),contrasting:contrasting.slice(0,2),
    supportingCount:supporting.length,contrastingCount:contrasting.length,
    neutralCount:neutrals.length};
}
function explainAxis(axis,answers,locale) {
  const w=WORDING[locale],copy=AXIS_COPY[axis.id][locale];
  const strength=scaleStrength(axis);
  const direction=axis.centered>0?'high':axis.centered<0?'low':null;
  const evidence=getAxisEvidence(axis,answers,locale);
  const notes=[];
  if(axis.answered===0)notes.push(w.unknown);
  else if(strength==='tie')notes.push(w.tie);
  else {
    notes.push(copy[direction]);
    notes.push(w[strength]);
  }
  if(axis.answered>0 && axis.answered<4)notes.push(w.tooFew);
  if(axis.remaining>0)notes.push(w.partial);
  if(evidence.contrastingCount>0)notes.push(w.mixed);
  if(evidence.neutralCount>0)notes.push(w.neutral);
  return {
    id:axis.id, title:copy.title,low:axis.low,high:axis.high,
    preference:direction===null?null:direction==='low'?axis.low:axis.high,
    direction, strength, intensity:axis.answered?Math.abs(axis.centered)/(2*axis.answered):null,
    observedPosition:axis.position, // scale location, NOT confidence/probability
    answered:axis.answered, remaining:axis.remaining,coverage:axis.coverage,
    raw:axis.raw,rawRange:[...axis.rawRange],
    possibleLetters:[...axis.possibleLetters],
    tieResolvedBySource:axis.officialLetter!==null&&axis.centered===0,
    evidence,reading:notes.join(' '),notes
  };
}
function describeType(profile,axes,locale) {
  const w=WORDING[locale];
  const hasObservedPreference=axes.every(a=>a.answered>=2&&a.preference!==null);
  const hasOfficialTie=profile.complete && axes.some(a=>a.tieResolvedBySource);
  // Full-code ties use the publisher's conventional tie-break, but must not
  // silently gain a personality narrative unsupported by the answers.
  const code=profile.complete?profile.officialType:
    hasObservedPreference?profile.exploratoryCode:null;
  const status=hasOfficialTie?'conventional-tie':
    code===null?'unresolved':profile.complete?'full-key':'provisional';
  if(code!==null&&!LETTERS.test(code))throw new Error(`Invalid type combination ${code}`);
  const copy=(code && !hasOfficialTie)?TYPE_COPY[code]?.[locale]:null;
  if(code&&!hasOfficialTie&&!copy)throw new Error(`Missing ${locale} narrative for ${code}`);
  const detail=status==='unresolved'?w.noType:status==='conventional-tie'?w.tieCode:
    status==='provisional'?w.provisional:w.fullIntro;
  return {code,status,title:copy?.title??null,summary:copy?.summary??null,
    readable:Boolean(copy),isPreliminary:!profile.complete,
    conventionalTie:hasOfficialTie,note:detail};
}

/**
 * API: buildInterpretation({3:1,12:4}, {locale:'es',skipped:[15]}).
 * The input is never changed. No questions or percentages are fabricated.
 */
export function buildInterpretation(inputAnswers={}, {locale='es',skipped=[]}={}){
  if(!LOCALES.has(locale))throw new RangeError('Locale must be es or en');
  const answers=normalizeAnswers(inputAnswers);
  const profile=buildProfile(answers,{skipped});
  const w=WORDING[locale];
  const axes=profile.axes.map(axis=>explainAxis(axis,answers,locale));
  const type=describeType(profile,axes,locale);
  const highlights=axes.filter(axis=>axis.answered>=3 && axis.strength==='marked')
    .sort((a,b)=>b.intensity-a.intensity||b.answered-a.answered||AXIS_INFO.findIndex(x=>x.id===a.id)-AXIS_INFO.findIndex(x=>x.id===b.id))
    .slice(0,2).map(axis=>({id:axis.id,title:axis.title,reason:w.strongLine,preference:axis.preference}));
  const nuances=axes.filter(axis=>axis.strength==='tie'||axis.strength==='slight'||
      axis.strength==='unobserved'||axis.evidence.contrastingCount>0||axis.remaining>0)
    .map(axis=>({id:axis.id,title:axis.title,
      reasons:[...(axis.strength==='tie'||axis.strength==='slight'? [w.softLine]:[]),
        ...(axis.strength==='unobserved'||axis.remaining>0?[w.missingLine]:[]),
        ...(axis.evidence.contrastingCount>0?[w.mixed]:[])]}));
  const nextAction=profile.skipped>0?'review':profile.answered<32?'continue':'none';
  const opening=profile.status==='no-data'?w.noData:profile.complete?w.fullIntro:
    type.status==='provisional'?w.provisional:w.early;
  return freezeTree({
    schema:INTERPRETATION_SCHEMA,bankVersion:BANK_VERSION,locale,
    status:profile.status,answered:profile.answered,missing:profile.missing,skipped:profile.skipped,
    brief:{title:profile.complete?w.full:w.preliminary,opening,
      type,notProbability:true},
    dimensions:axes,
    deep:{highlights,nuances,
      nextAction,nextMessage:nextAction==='review'?w.reviewSkipped:
        nextAction==='continue'?w.followUp:w.finished,
      highlightLabel:w.strengths,nuanceLabel:w.nuances},
    safeguards:{educationalOnly:true,noProbability:true,noClinicalUse:true,
      note:w.caution,sourceNote:w.sourceCaution}
  });
}

/** Session integration without modifying or migrating the stored state. */
export function interpretSession(state){
  validateSession(state);
  return buildInterpretation(state.answers,{locale:state.locale,skipped:state.skipped});
}

/** Check that all sixteen archetype copy sets are available in both languages. */
export function auditInterpretationCopy(){
  const errors=[];
  const codes=[];
  for(const a of 'IE')for(const b of 'SN')for(const c of 'FT')for(const d of 'JP')codes.push(a+b+c+d);
  if(Object.keys(TYPE_COPY).length!==16)errors.push('Expected 16 type descriptions');
  for(const code of codes)for(const locale of LOCALES){
    const copy=TYPE_COPY[code]?.[locale];
    if(!copy?.title?.trim()||!copy?.summary?.trim())errors.push(`Missing ${code}/${locale}`);
  }
  for(const axis of AXIS_INFO)for(const locale of LOCALES){
    const entry=AXIS_COPY[axis.id]?.[locale];
    if(!entry?.title?.trim()||!entry?.low?.trim()||!entry?.high?.trim())errors.push(`Missing axis ${axis.id}/${locale}`);
  }
  for(const item of ITEM_BANK)if(!THEME_COPY[item.theme])errors.push(`Missing topic ${item.theme}`);
  return freezeTree({ok:errors.length===0,errors});
}
