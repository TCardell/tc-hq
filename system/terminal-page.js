import {lang,tr,loadCatalog,localized,icon,applyTheme} from './core.js?v=174';
import {VirtualFS} from './filesystem.js?v=174';
import {TerminalUI} from './terminal-ui.js?v=174';
if(new URLSearchParams(location.search).has('v')){const clean=new URL(location.href);clean.searchParams.delete('v');history.replaceState(null,'',clean)}
document.documentElement.lang=lang;applyTheme();window.addEventListener('tcos-preferences',applyTheme);
const terminal=document.getElementById('terminal-output');
const catalog=await loadCatalog(),fs=new VirtualFS(catalog);
const title=document.getElementById('terminal-heading');
title.textContent=tr('Terminal remota TC-HQ','TC-HQ Remote Terminal');
const goGUI=()=>{location.href='home.html'+(lang==='en'?'?lang=en':'')};
const ui=new TerminalUI({host:terminal,fs,catalog,standalone:true,
 onGUI:goGUI,onReboot:()=>{location.href='index.html'+(lang==='en'?'?lang=en':'')},
 onProgram:p=>{if(p.type==='page')window.open(new URL(p.url,location.href),'_blank','noopener,noreferrer');else location.href='home.html?app='+encodeURIComponent(p.id)+(lang==='en'?'&lang=en':'')}
});
document.getElementById('gui-button').textContent=tr('Escritorio','Desktop');
document.getElementById('gui-button').addEventListener('click',goGUI);
const fullscreen=document.getElementById('terminal-screen');
fullscreen.addEventListener('click',()=>ui.focus());
