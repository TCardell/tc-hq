/** TC/OS 1.7 — single preference registry. Only TC/OS-owned keys are modified. */
const KEY='tcos.preferences';
export const defaults=Object.freeze({
  theme:'hq-black',wallpaper:'original',grid:true,crt:true,
  desktopPreset:'normal',iconOpen:'double',windowRemember:false,windowMax:false,windowAnimations:true,
  termSize:23,termCursor:'underline',termHistory:true,termScrollback:1000,
  language:'auto',time24:true,weekStart:'monday',showExtensions:true,showHidden:false,
  ambientMotion:true,screensaverEnabled:false,screensaverMinutes:5,screensaverStyle:'clock',
  bootStyle:'full',bootTarget:'automatic',sound:true,volume:35,effectsVolume:55,cursorTheme:'classic',reduceMotion:false
});
const allowedThemes=['hq-black','graphite','phosphor','midnight','classic','blackout','synthwave'];
const allowedWallpapers=['original','headquarters','grid','mainframe','solid','synth-sunset','synth-grid','synth-neon','red-circuit','dark-stars','aurora','scanline','living-synth','living-stars'];
export function readPreferences(){
  let saved={};try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch{}
  if(!saved||typeof saved!=='object'||Array.isArray(saved))saved={};
  const p={...defaults,...saved};
  if(p.theme==='hq-dark')p.theme='hq-black';
  // Convert the old static block cursor to the standard blinking underscore once.
  if(saved.termCursor==='block' && saved.cursorStyleVersion!==171)p.termCursor='underline';
  if(!allowedThemes.includes(p.theme))p.theme=defaults.theme;
  if(!allowedWallpapers.includes(p.wallpaper))p.wallpaper=defaults.wallpaper;
  p.screensaverEnabled=!!p.screensaverEnabled;p.ambientMotion=p.ambientMotion!==false;
  p.screensaverMinutes=[1,2,5,10,15,30].includes(Number(p.screensaverMinutes))?Number(p.screensaverMinutes):5;
  if(!['clock','logo','stars'].includes(p.screensaverStyle))p.screensaverStyle='clock';
  p.volume=Math.max(0,Math.min(100,Number(p.volume??35)));
  p.effectsVolume=Math.max(0,Math.min(100,Number(p.effectsVolume??55)));
  if(!['classic','red','phosphor','crosshair'].includes(p.cursorTheme))p.cursorTheme='classic';
  p.termSize=Math.max(16,Math.min(34,Number(p.termSize)||23));
  p.termScrollback=Math.max(100,Math.min(5000,Number(p.termScrollback)||1000));
  return p;
}
export function savePreferences(update){
  const value={...readPreferences(),...update};
  if(Object.prototype.hasOwnProperty.call(update,'termCursor'))value.cursorStyleVersion=171;
  try{localStorage.setItem(KEY,JSON.stringify(value))}catch{}
  applyPreferences();window.dispatchEvent(new CustomEvent('tcos-preferences',{detail:value}));
  return value;
}
export function applyPreferences(){
  const p=readPreferences();const root=document.documentElement;
  root.dataset.theme=p.theme;root.dataset.wallpaper=p.wallpaper;
  root.classList.toggle('reduce-motion',!!p.reduceMotion);
  root.style.setProperty('--terminal-size',p.termSize+'px');
  root.dataset.cursor=p.termCursor;root.dataset.pointer=p.cursorTheme;
  return p;
}
export function resetAppearance(){
  const p=readPreferences();
  for(const k of ['theme','wallpaper','grid','crt','cursorTheme','desktopPreset','iconOpen','windowRemember','windowMax','windowAnimations','ambientMotion','screensaverEnabled','screensaverMinutes','screensaverStyle','reduceMotion'])p[k]=defaults[k];
  savePreferences(p);
  for(const k of ['tcos.desktop-shortcuts','tcos.desktop-trash','tcos.window-layout'])try{localStorage.removeItem(k)}catch{}
  window.dispatchEvent(new Event('tcos-shortcuts-changed'));
}
/** Factory reset doesn't affect TC-HQ files or other sites' storage. */
export function factoryReset({notes=false}={}){
  const keys=['preferences','desktop-shortcuts','desktop-trash','window-layout','software-disabled','terminal-history','favorites'];
  if(notes)keys.push('notes');
  for(const k of keys)try{localStorage.removeItem('tcos.'+k)}catch{}
  try{sessionStorage.removeItem('tcos.boot')}catch{}
  window.dispatchEvent(new Event('tcos-shortcuts-changed'));
  window.dispatchEvent(new Event('tcos-programs-changed'));
  applyPreferences();
}
