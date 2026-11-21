/** TC/OS taskbar sound control. Shares the same persistent audio preferences as Control Panel. */
import {tr,icon,getPreferences,setPreferences} from './core.js?v=175';

export function installSoundTray(tray){
 const holder=document.createElement('div');holder.className='sound-tray';
 const toggle=document.createElement('button');toggle.type='button';toggle.id='tray-audio-toggle';toggle.className='tray-audio-button';
 toggle.setAttribute('aria-controls','tray-audio-panel');toggle.setAttribute('aria-haspopup','true');toggle.setAttribute('aria-expanded','false');
 const panel=document.createElement('div');panel.id='tray-audio-panel';panel.className='sound-popover';panel.hidden=true;
 const title=document.createElement('strong');title.textContent=tr('Sonido de TC/OS','TC/OS sound');
 const mute=document.createElement('button');mute.type='button';mute.className='sys-button sound-mute';
 const line=document.createElement('div');line.className='sound-popover-line';
 const label=document.createElement('label');label.htmlFor='tray-audio-range';label.textContent=tr('Volumen general','Master volume');
 const number=document.createElement('output');number.htmlFor='tray-audio-range';number.className='sound-level';
 line.append(label,number);
 const range=document.createElement('input');range.id='tray-audio-range';range.type='range';range.min='0';range.max='100';range.step='1';
 const hint=document.createElement('small');hint.className='sys-muted';hint.textContent=tr('Clic derecho sobre el altavoz para silenciar rápidamente.','Right-click the speaker to quickly mute.');
 panel.append(title,mute,line,range,hint);
 holder.append(toggle,panel);
 tray.insertBefore(holder,tray.querySelector('.tray-datetime'));
 function render(){
  const p=getPreferences(),muted=!p.sound||p.volume===0;
  toggle.innerHTML=icon('audio',19);
  toggle.classList.toggle('muted',muted);
  toggle.title=tr('Sonido: clic para volumen, clic derecho para silenciar','Sound: click for volume, right-click to mute');
  toggle.setAttribute('aria-label',muted?tr('Sonido silenciado. Abrir volumen','Sound muted. Open volume'):tr('Sonido activado. Abrir volumen','Sound on. Open volume'));
  mute.textContent=muted?tr('Activar sonido','Unmute'):tr('Silenciar','Mute');
  mute.setAttribute('aria-pressed',String(muted));
  number.value=p.volume+'%';number.textContent=p.volume+'%';
  if(document.activeElement!==range)range.value=String(p.volume);
 }
 function close(){panel.hidden=true;toggle.setAttribute('aria-expanded','false')}
 toggle.addEventListener('click',()=>{
  const opening=panel.hidden;
  panel.hidden=!opening;toggle.setAttribute('aria-expanded',String(opening));
  if(opening)render();
 });
 // Secondary click is an instant mute switch without opening the panel.
 function toggleMute(){
  const p=getPreferences();
  setPreferences(!p.sound||p.volume===0
   ?{sound:true,volume:p.volume>0?p.volume:50}
   :{sound:false});
 }
 toggle.addEventListener('contextmenu',event=>{event.preventDefault();toggleMute()});
 mute.addEventListener('click',toggleMute);
 range.addEventListener('input',()=>{
  const volume=Number(range.value);
  setPreferences({volume,sound:volume>0});
 });
 range.addEventListener('change',()=>render());
 document.addEventListener('pointerdown',event=>{if(!holder.contains(event.target))close()});
 panel.addEventListener('keydown',event=>{if(event.key==='Escape'){close();toggle.focus()}});
 window.addEventListener('tcos-preferences',render);
 render();
}
