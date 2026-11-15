/** TC/OS screensaver: local, accessible, no remote resources. */
import {tr,getPreferences} from './core.js?v=174';
export function installScreensaver(desktop){
 const node=document.createElement('div');node.className='tcos-screensaver';node.setAttribute('role','dialog');node.setAttribute('aria-label',tr('Salvapantallas','Screensaver'));node.tabIndex=-1;
 const stars=document.createElement('div');stars.className='tcos-screensaver-stars';
 const content=document.createElement('div');content.className='tcos-screensaver-content';
 const hint=document.createElement('div');hint.className='tcos-screensaver-hint';hint.textContent=tr('Pulsa una tecla o toca la pantalla','Press any key or tap to return');
 node.append(stars,content,hint);desktop.append(node);
 let lastActivity=Date.now(),active=false;
 function update(){if(!active)return;const p=getPreferences();node.dataset.style=p.screensaverStyle;
  const now=new Date();const clock=now.toLocaleTimeString(tr('es-ES','en-GB'),{hour:'2-digit',minute:'2-digit',hour12:false});
  const date=now.toLocaleDateString(tr('es-ES','en-GB'),{weekday:'long',day:'numeric',month:'long'});
  content.replaceChildren();const strong=document.createElement('strong');strong.textContent=p.screensaverStyle==='clock'?clock:'TC-HQ';
  const sub=document.createElement('span');sub.textContent=p.screensaverStyle==='clock'?date:p.screensaverStyle==='stars'?'T C A R D E L L   H E A D Q U A R T E R S':'T C / O S   P R O F E S S I O N A L';content.append(strong,sub);
 }
 function hide(){if(!active)return;active=false;node.classList.remove('visible');lastActivity=Date.now()}
 function show(){if(active)return;active=true;node.classList.add('visible');update()}
 for(const event of ['pointerdown','touchstart','keydown','wheel'])document.addEventListener(event,()=>{if(active)hide();else lastActivity=Date.now()},{capture:true,passive:true});
 document.addEventListener('pointermove',e=>{if(!active&&e.isTrusted)lastActivity=Date.now()},{passive:true});
 window.addEventListener('tcos-preview-screensaver',show);
 window.addEventListener('tcos-preferences',()=>{if(!getPreferences().screensaverEnabled&&active)hide();else update()});
 document.addEventListener('visibilitychange',()=>{lastActivity=Date.now();if(document.hidden)hide()});
 setInterval(()=>{const p=getPreferences();if(active){update();return}if(document.activeElement?.tagName==='IFRAME'){lastActivity=Date.now();return}if(!document.hidden&&p.screensaverEnabled&&Date.now()-lastActivity>=p.screensaverMinutes*60000)show()},1000);
}
