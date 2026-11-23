/**
 * Deterministic item planning. Quick order is fixed for reproducibility.
 * Deep order balances per-axis coverage, then prioritizes axes near the midpoint
 * and less-repeated editorial topics. No IRT, calibration or random scoring.
 */
import {ITEM_BANK,getItem} from './catalog.js';
import {FAST_IDS} from '../questions.js';
import {buildProfile} from './profile.js';

export const QUICK_TARGET=12;
export const FULL_TARGET=32;

/** Returns a question ID or null when the current phase has no question. */
export function nextItem(session){
  if(!session||typeof session!=='object')throw new TypeError('A session is required');
  if(session.phase==='quick')return FAST_IDS.find(id=>!session.seen.includes(id))??null;
  if(session.phase==='review')return session.reviewQueue[session.reviewIndex]??null;
  if(session.phase!=='deep')return null;
  const remaining=ITEM_BANK.filter(item=>!session.seen.includes(item.id));
  if(!remaining.length)return null;
  const p=buildProfile(session.answers,{skipped:session.skipped});
  const seenItems=session.seen.map(getItem);
  const seenByAxis=Object.fromEntries(p.axes.map(a=>[a.id,seenItems.filter(q=>q.dimension===a.id).length]));
  const pByAxis=Object.fromEntries(p.axes.map(a=>[a.id,a]));
  const rank=item=>{
    const axis=pByAxis[item.dimension];
    const sameTheme=seenItems.filter(q=>q.theme===item.theme).length;
    return [seenByAxis[item.dimension],Math.abs(axis.centered)/Math.max(1,axis.answered),sameTheme,item.id];
  };
  remaining.sort((a,b)=>{
    const x=rank(a),y=rank(b);
    for(let i=0;i<x.length;i++){if(x[i]!==y[i])return x[i]-y[i]}
    return 0;
  });
  return remaining[0].id;
}

/** Transparent explanation for each selected item; useful for debugging/audits. */
export function explainNext(session){
  const id=nextItem(session);
  if(id===null)return null;
  const q=getItem(id);
  return Object.freeze({id,dimension:q.dimension,theme:q.theme,
    strategy:session.phase==='quick'?'fixed-balanced-12':session.phase==='review'?'skipped-revisit':'balanced-midpoint-topic',
    note:'Editorial heuristic; no calibrated adaptive psychometrics.'});
}
