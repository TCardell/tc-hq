/** CLI smoke test of the pure TYPE/16 engine; no browser or external services. */
import {createSession,transition,nextItem,inspectSession} from '../js/engine/index.js';
let session=createSession({locale:'es'});
while(session.phase==='quick'){
  const id=nextItem(session);
  session=transition(session,{type:'respond',id,value:(id%5)+1});
}
const quick=inspectSession(session);
session=transition(session,{type:'continue'});
while(session.phase==='deep'){
  const id=nextItem(session);
  session=transition(session,{type:'respond',id,value:((id+2)%5)+1});
}
const full=inspectSession(session);
console.log(JSON.stringify({
  bank:full.profile.bankVersion,
  quick:{seen:quick.seen,answered:quick.answered,code:quick.profile.exploratoryCode,officialType:quick.profile.officialType},
  full:{seen:full.seen,answered:full.answered,type:full.profile.officialType,scores:full.profile.axes.map(a=>({axis:a.id,raw:a.raw}))}
},null,2));
