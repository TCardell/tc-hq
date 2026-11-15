import {tr,getPreferences,lang,formatDate} from '../core.js?v=171';
const el=(tag,cls='',txt)=>{const n=document.createElement(tag);n.className=cls;if(txt!==undefined)n.textContent=txt;return n};
export function makeCalendar(){
 const wrap=el('div','sys-app calendar-app');const now=new Date();let year=now.getFullYear(),month=now.getMonth(),selected=now.getDate();
 const title=el('h2','',tr('Calendario de TC/OS','TC/OS Calendar')),
  head=el('div','cal-header'),grid=el('div','cal-grid'),info=el('p','sys-muted');wrap.append(title,head,grid,info);
 function nav(delta){month+=delta;if(month>11){month=0;year++}if(month<0){month=11;year--}selected=null;draw()}
 function draw(){const prefs=getPreferences(),monday=prefs.weekStart!=='sunday';head.replaceChildren();grid.replaceChildren();
  const prev=el('button','sys-button','‹'),next=el('button','sys-button','›');prev.onclick=()=>nav(-1);next.onclick=()=>nav(1);
  head.append(prev,el('strong','',new Date(year,month,1).toLocaleDateString(lang==='es'?'es-ES':'en-GB',{month:'long',year:'numeric'})),next);
  const days=monday?['L','M','X','J','V','S','D']:['D','L','M','X','J','V','S'];
  for(const day of days)grid.append(el('div','cal-dow',day));
  const first=new Date(year,month,1).getDay(),offset=monday?(first+6)%7:first;
  for(let x=0;x<offset;x++)grid.append(el('span','cal-blank'));
  for(let d=1;d<=new Date(year,month+1,0).getDate();d++){
   const b=el('button','cal-day'+(selected===d?' selected':'')+(d===now.getDate()&&month===now.getMonth()&&year===now.getFullYear()?' today':''),String(d));
   b.onclick=()=>{selected=d;draw()};grid.append(b);
  }
  info.textContent=selected?new Date(year,month,selected).toLocaleDateString(lang==='es'?'es-ES':'en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'}):tr('Selecciona una fecha.','Select a date.');
 }
 draw();return wrap;
}
