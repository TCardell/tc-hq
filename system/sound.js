/** Original short system cues. Never plays before a user action. */
import {getPreferences} from './core.js?v=174';
let context=null;
export function playCue(kind='click'){
 const p=getPreferences();if(!p.sound||!p.volume||!p.effectsVolume)return;
 try{
  const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext)return;
  if(!context)context=new AudioContext();if(context.state==='suspended')context.resume().catch(()=>{});
  const now=context.currentTime,o=context.createOscillator(),gain=context.createGain();
  const pitch=kind==='error'?245:kind==='open'?620:kind==='close'?450:740;
  o.type='square';o.frequency.setValueAtTime(pitch,now);o.frequency.exponentialRampToValueAtTime(pitch*.78,now+.055);
  const volume=Math.min(.08,.07*(p.volume/100)*(p.effectsVolume/100));
  gain.gain.setValueAtTime(Math.max(.00001,volume),now);gain.gain.exponentialRampToValueAtTime(.00001,now+.065);
  o.connect(gain);gain.connect(context.destination);o.start(now);o.stop(now+.075);
 }catch(err){/* Playback depends on browser permissions; never blocks UI. */}
}
export function installSoundEngine(doc=document){
 doc.addEventListener('pointerdown',e=>{
  if(e.button!==0)return;
  const button=e.target.closest('button,[role="button"]');if(!button||button.disabled)return;
  if(button.closest('.window-controls'))playCue('close');else if(button.closest('.desktop-icon,.file-icon,.start-item'))playCue('open');else playCue('click');
 },{capture:true,passive:true});
}
