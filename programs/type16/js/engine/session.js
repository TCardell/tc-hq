/**
 * Pure, versioned TYPE/16 session state machine.
 * No DOM, storage, timers, tracking, or network operations in this module.
 * Caller handles local persistence and presentation. Invalid actions throw.
 */
import {BANK_VERSION,getItem} from './catalog.js';
import {FAST_IDS} from '../questions.js';
import {nextItem} from './selection.js';
import {normalizeAnswers,buildProfile} from './profile.js';

export const SESSION_SCHEMA=2;
export const MAX_UNDO=48;
const PHASES=new Set(['quick','deep','review','checkpoint','done']);
const STAGES=new Set(['quick','deep']);
const okId=id=>Number.isInteger(id)&&getItem(id)!==null;
const unique=a=>Array.isArray(a)&&new Set(a).size===a.length;
const copy=obj=>JSON.parse(JSON.stringify(obj));
const snapshot=state=>{
  const {undoStack,...rest}=state;
  return copy(rest);
};
const historyStep=state=>[...state.undoStack,snapshot(state)].slice(-MAX_UNDO);

export function createSession({locale='es'}={}){
  if(!['es','en'].includes(locale))throw new RangeError('Locale must be es or en');
  return {schema:SESSION_SCHEMA,bankVersion:BANK_VERSION,locale,phase:'quick',checkpoint:null,
    seen:[],answers:{},skipped:[],reviewQueue:[],reviewIndex:0,undoStack:[],revision:0};
}

/** Returns a new state. Caller must retain returned value. */
export function transition(state,action){
  validateSession(state);
  if(!action||typeof action!=='object'||typeof action.type!=='string')throw new TypeError('Action requires a type');
  if(action.type==='undo'){
    if(!state.undoStack.length)return copy(state);
    const out=copy(state.undoStack.at(-1));
    out.undoStack=copy(state.undoStack.slice(0,-1));
    out.locale=state.locale; // Undo questions, not the manually selected language.
    out.revision=state.revision+1;
    validateSession(out);
    return out;
  }
  if(action.type==='language'){
    if(!['es','en'].includes(action.locale))throw new RangeError('Unsupported locale');
    return {...copy(state),locale:action.locale,revision:state.revision+1};
  }
  if(action.type==='restart')return createSession({locale:state.locale});
  const next=copy(state);
  const save=()=>{next.undoStack=historyStep(state);next.revision++;
    validateSession(next);return next};
  if(action.type==='respond'){
    const id=nextItem(state);
    if(id===null)throw new Error('No question is available in this phase');
    if(action.id!==id)throw new Error(`Expected Q${id}, got Q${action.id}`);
    if(action.value!==null&&(!Number.isInteger(action.value)||action.value<1||action.value>5))
      throw new RangeError('Response must be 1..5 or null (skip)');
    if(next.phase==='review'){
      next.reviewIndex++;
    }else{
      next.seen.push(id);
    }
    if(action.value===null){delete next.answers[id];if(!next.skipped.includes(id))next.skipped.push(id)}
    else{next.answers[id]=action.value;next.skipped=next.skipped.filter(qid=>qid!==id)}
    if(next.phase==='quick'&&next.seen.length===FAST_IDS.length){next.phase='checkpoint';next.checkpoint='quick'}
    else if(next.phase==='deep'&&next.seen.length===32){next.phase='checkpoint';next.checkpoint='deep'}
    else if(next.phase==='review'&&next.reviewIndex===next.reviewQueue.length){
      next.phase='checkpoint';next.reviewQueue=[];next.reviewIndex=0;
    }
    return save();
  }
  if(action.type==='continue'){
    if(!['checkpoint','done'].includes(next.phase)||next.seen.length===32)
      throw new Error('No unseen questions left to continue');
    next.phase='deep';next.checkpoint=null;
    next.reviewQueue=[];next.reviewIndex=0;
    return save();
  }
  if(action.type==='review'){
    if(!['checkpoint','done'].includes(next.phase)||next.skipped.length===0)
      throw new Error('No skipped questions to revisit');
    // Review in original display order; never silently count skip as neutral.
    next.reviewQueue=next.seen.filter(id=>next.skipped.includes(id));
    next.reviewIndex=0;next.phase='review';
    return save();
  }
  if(action.type==='finish'){
    if(next.phase!=='checkpoint')throw new Error('Can only finish at a checkpoint');
    next.phase='done';
    return save();
  }
  throw new RangeError(`Unknown action: ${action.type}`);
}

/** A safe rendering/controller-facing summary, with no mutable engine internals. */
export function inspectSession(state){
  validateSession(state);
  const nextId=nextItem(state);
  const profile=buildProfile(state.answers,{skipped:state.skipped});
  return Object.freeze({
    phase:state.phase,checkpoint:state.checkpoint,locale:state.locale,
    nextId,seen:state.seen.length,answered:profile.answered,skipped:state.skipped.length,
    canUndo:state.undoStack.length>0,
    canContinue:['checkpoint','done'].includes(state.phase)&&state.seen.length<32,
    canReview:['checkpoint','done'].includes(state.phase)&&state.skipped.length>0,
    readyForFullKey:profile.complete,
    profile
  });
}

/** Reject corrupted, stale or incompatible saved state, rather than guessing. */
export function validateSession(state){
  if(!state||typeof state!=='object'||Array.isArray(state))throw new TypeError('Invalid session object');
  if(state.schema!==SESSION_SCHEMA||state.bankVersion!==BANK_VERSION)throw new Error('Incompatible session/bank version');
  if(!['es','en'].includes(state.locale))throw new Error('Invalid language');
  if(!PHASES.has(state.phase)||!(state.checkpoint===null||STAGES.has(state.checkpoint)))throw new Error('Invalid phase/checkpoint');
  if(!unique(state.seen)||state.seen.some(id=>!okId(id)))throw new Error('Invalid seen question IDs');
  if(state.seen.length>32)throw new Error('Too many seen questions');
  if(state.seen.some(id=>state.seen.filter(i=>i===id).length!==1))throw new Error('Duplicated question');
  if(!unique(state.skipped)||state.skipped.some(id=>!state.seen.includes(id)))throw new Error('Invalid skipped IDs');
  normalizeAnswers(state.answers);
  if(Object.keys(state.answers).some(id=>!state.seen.includes(Number(id))||state.skipped.includes(Number(id))))
    throw new Error('Answer must be seen and not skipped');
  if(!unique(state.reviewQueue)||state.reviewQueue.some(id=>!state.seen.includes(id)))throw new Error('Invalid review queue');
  if(!Number.isInteger(state.reviewIndex)||state.reviewIndex<0||state.reviewIndex>state.reviewQueue.length)throw new Error('Invalid review position');
  if(state.phase==='quick'&&(state.seen.length>=12||state.seen.some(id=>!FAST_IDS.includes(id))))throw new Error('Invalid quick phase');
  if(state.phase==='deep'&&(state.seen.length<12||state.seen.length>=32))throw new Error('Invalid deep phase');
  if(state.phase==='review'&&(state.reviewQueue.length===0||state.reviewIndex>=state.reviewQueue.length))throw new Error('Invalid review phase');
  if(state.phase==='checkpoint'&&!state.checkpoint)throw new Error('Missing checkpoint stage');
  if(!Number.isInteger(state.revision)||state.revision<0)throw new Error('Invalid revision');
  if(!Array.isArray(state.undoStack)||state.undoStack.length>MAX_UNDO)throw new Error('Invalid history');
  if(state.undoStack.some(entry=>!entry||typeof entry!=='object'||'undoStack' in entry||entry.schema!==SESSION_SCHEMA||entry.bankVersion!==BANK_VERSION))
    throw new Error('Invalid undo snapshot');
  return true;
}

export function serializeSession(state){validateSession(state);return JSON.stringify(state)}
export function restoreSession(json){
  const data=typeof json==='string'?JSON.parse(json):copy(json);
  validateSession(data);
  // Only accept explicit known fields, never restore an attacker-provided prototype.
  return {
    schema:SESSION_SCHEMA,bankVersion:BANK_VERSION,locale:data.locale,phase:data.phase,
    checkpoint:data.checkpoint,seen:[...data.seen],answers:{...normalizeAnswers(data.answers)},
    skipped:[...data.skipped],reviewQueue:[...data.reviewQueue],reviewIndex:data.reviewIndex,
    undoStack:data.undoStack.map(snapshot=>copy(snapshot)),revision:data.revision
  };
}
