import {lang,tr,icon,loadCatalog,getPreferences,localized,programTitle,formatTime,openSafeURL,getDisabledPrograms,folderPath,getFavoriteIds,toggleFavorite,openModeOf} from './core.js?v=174';
import {VirtualFS} from './filesystem.js?v=174';
import {createApp,makeTextViewer} from './apps.js?v=174-patch1';
import {Shortcuts,pKey,fKey} from './shortcuts.js?v=174';
import {safeGet,safeSet} from './core.js?v=174';
import {makeAdminLogin} from './apps/admin.js?v=174';
import {installSoundEngine} from './sound.js?v=174';
import {installScreensaver} from './screensaver.js?v=174';
const qs=new URLSearchParams(location.search);
if(qs.has('v')){const clean=new URL(location.href);clean.searchParams.delete('v');history.replaceState(null,'',clean)}
document.documentElement.lang=lang;
// Compatibility with the 1.4 link; normal links now lead directly to terminal.html.
if(qs.get('mode')==='terminal')location.replace('terminal.html'+(lang==='en'?'?lang=en':''));
const catalog=await loadCatalog(),fs=new VirtualFS(catalog),shortcuts=new Shortcuts(catalog);
installSoundEngine(document);
const $=id=>document.getElementById(id);
const desktop=$('desktop'),workspace=$('workspace'),icons=$('desktop-icons'),menu=$('start-menu'),items=$('start-items'),tasks=$('tasks'),ctxMenu=$('context-menu'),start=$('start-button');
const el=(tag,cls='',text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e};
const ambient=el('div','desktop-ambient');ambient.setAttribute('aria-hidden','true');desktop.prepend(ambient);
const applyPreferences=()=>{const p=getPreferences();desktop.classList.toggle('grid-on',p.grid);desktop.classList.toggle('crt-on',p.crt);desktop.dataset.wallpaper=p.wallpaper;desktop.classList.toggle('no-animations',!p.windowAnimations);desktop.classList.toggle('ambient-off',!p.ambientMotion||p.reduceMotion)};
applyPreferences();window.addEventListener('tcos-preferences',applyPreferences);installScreensaver(desktop);
$('start-label').textContent=tr('Inicio','Start');
$('tray-state').textContent='● ONLINE';
const clock=()=>{const now=new Date();$('tray-clock').textContent=now.toLocaleTimeString(lang==='es'?'es-ES':'en-GB',getPreferences().time24?{hour:'2-digit',minute:'2-digit',hour12:false}:{hour:'numeric',minute:'2-digit',hour12:true});$('tray-date').textContent=[now.getDate(),now.getMonth()+1,now.getFullYear()].map((v,i)=>i<2?String(v).padStart(2,'0'):String(v)).join('/')};clock();setInterval(clock,15000);
$('tray-clock').title=tr('Abrir Reloj TC-HQ','Open TC-HQ Clock');$('tray-date').title=tr('Abrir calendario','Open calendar');
$('tray-clock').setAttribute('aria-label',$('tray-clock').title);$('tray-date').setAttribute('aria-label',$('tray-date').title);
$('tray-clock').addEventListener('click',()=>openProgram(catalog.find(p=>p.id==='clock')));
$('tray-date').addEventListener('click',()=>openProgram(catalog.find(p=>p.id==='calendar')));
let z=20,seq=0,activeId=null,selection=null,dragKey=null,rows=6;
const windows=new Map();
const narrow=()=>matchMedia('(max-width:700px)').matches;
const folders=catalog.folders||[];const folderFor=id=>folders.find(f=>f.id===id);
let adminActive=false;
const adminFolder={id:'administration',name:{es:'Administración',en:'Administration'},parent:null,icon:'secret',menu:true,desktop:false};
const adminTools=[
 {id:'admin-installer',name:{es:'Gestor de programas y directorios',en:'Program & Directory Manager'},description:{es:'Organizar aplicaciones y carpetas del sistema',en:'Organize applications and folders'},type:'page',url:'programs/admin/installer.html',folder:'administration',icon:'archive',desktop:false,menu:true,terminal:false,command:'pkg'},
 {id:'admin-diagnostics',name:{es:'Diagnósticos del sistema',en:'System Diagnostics'},description:{es:'Comprobar catálogo, rutas e iconos',en:'Check catalog, paths and icons'},type:'page',url:'programs/admin/diagnostics.html',folder:'administration',icon:'logs',desktop:false,menu:true,terminal:false,command:'diagnostics'}
];
const childrenOf=id=>folders.filter(f=>(f.parent||null)===(id||null));
const programsIn=id=>catalog.filter(p=>(p.folder||null)===(id||null)&&p.menu&&!getDisabledPrograms().has(p.id));
function closeMenus(){menu.classList.remove('open');ctxMenu.classList.remove('open');menu.querySelectorAll('.start-submenu.open').forEach(x=>x.classList.remove('open'));start.setAttribute('aria-expanded','false')}
function toggleMenu(){const next=!menu.classList.contains('open');closeMenus();if(next){menu.classList.add('open');start.setAttribute('aria-expanded','true')}}
start.addEventListener('click',e=>{e.stopPropagation();toggleMenu()});
const taskbar=document.querySelector('.taskbar');taskbar.addEventListener('contextmenu',e=>{if(e.target.closest('button'))return;showContext(e,[
 [tr('Mostrar escritorio','Show desktop'),()=>{for(const w of windows.values())minimize(w.id)}],
 [tr('Restaurar ventanas','Restore windows'),()=>{for(const w of windows.values())restore(w.id)}],
 [tr('Ventanas en cascada','Cascade windows'),()=>{let i=0;for(const w of windows.values()){if(!w.maximized){w.node.style.left=(24+i*27)+'px';w.node.style.top=(24+i*25)+'px';i++}restore(w.id)}}],
 [tr('Abrir calendario','Open calendar'),()=>openProgram(catalog.find(p=>p.id==='calendar'))],
 [tr('Configuración de sonido','Sound settings'),()=>{openProgram(catalog.find(p=>p.id==='settings'));window.dispatchEvent(new CustomEvent('tcos-control-category',{detail:{category:'sound'}}))}]])});
function renderTasks(){tasks.replaceChildren();for(const [id,w] of windows){const b=el('button','sys-button task'+(activeId===id&&!w.minimized?' active':''));b.type='button';b.title=w.title;b.innerHTML=icon(w.icon,17);b.append(el('span','',w.title));b.addEventListener('click',()=>{if(w.minimized||activeId!==id)restore(id);else minimize(id)});
 b.addEventListener('contextmenu',e=>{e.preventDefault();
  const current=windows.get(id);if(!current)return;
  const actions=[];
  actions.push([tr('Restaurar / Activar','Restore / Activate'),()=>restore(id)]);
  if(current.maximized){actions.push([tr('Restaurar tamaño','Restore size'),()=>maximize(id)])}
  else actions.push([tr('Maximizar','Maximize'),()=>{if(current.minimized)restore(id);maximize(id)}]);
  if(!current.minimized)actions.push([tr('Minimizar','Minimize'),()=>minimize(id)]);
  actions.push([tr('Cerrar','Close'),()=>closeWindow(id)]);
  showContext(e,actions);
 });tasks.append(b)}}
function focus(id){const w=windows.get(id);if(!w)return;w.minimized=false;w.node.classList.remove('hidden');w.node.style.zIndex=String(++z);activeId=id;for(const [key,x] of windows)x.node.classList.toggle('active',key===id);renderTasks()}
function restore(id){focus(id)}
function minimize(id){const w=windows.get(id);if(!w)return;w.minimized=true;w.node.classList.add('hidden');if(activeId===id)activeId=null;renderTasks()}
function closeWindow(id){const w=windows.get(id);if(!w)return;saveWindowLayout(w);w.observer?.disconnect();w.node.remove();windows.delete(id);if(activeId===id)activeId=null;const next=[...windows.values()].reverse().find(x=>!x.minimized);if(next)focus(next.id);else renderTasks()}
function maximize(id){const w=windows.get(id);if(!w)return;w.maximized=!w.maximized;w.node.classList.toggle('maximized',w.maximized);saveWindowLayout(w);focus(id)}
function moveWindow(bar,node){let drag=null;
 bar.addEventListener('pointerdown',e=>{
  if(e.button!==0||e.target.closest('button')||node.classList.contains('maximized')||narrow())return;
  focus(node.dataset.window);drag={x:e.clientX,y:e.clientY,left:node.offsetLeft,top:node.offsetTop};bar.setPointerCapture(e.pointerId);e.preventDefault();
 });
 bar.addEventListener('pointermove',e=>{if(!drag)return;const x=drag.left+(e.clientX-drag.x),y=drag.top+(e.clientY-drag.y);node.style.left=Math.max(0,Math.min(x,Math.max(0,workspace.clientWidth-node.offsetWidth*.20)))+'px';node.style.top=Math.max(0,Math.min(y,Math.max(0,workspace.clientHeight-42)))+'px'});
 const end=()=>{if(drag)saveWindowLayout(windows.get(node.dataset.window));drag=null};bar.addEventListener('pointerup',end);bar.addEventListener('pointercancel',end);
}
function saveWindowLayout(w){if(!w||!getPreferences().windowRemember)return;const all=safeGet('window-layout',{});const rect=w.node;all[w.id]={left:rect.offsetLeft,top:rect.offsetTop,width:rect.offsetWidth,height:rect.offsetHeight,maximized:w.maximized};safeSet('window-layout',all)}
function openWindow(id,title,windowIcon,content,config={}){
 if(windows.has(id)){restore(id);return windows.get(id)}
 const node=el('section','window active');node.dataset.window=id;node.setAttribute('role','dialog');node.setAttribute('aria-label',title);
 const width=Math.min(config.width||650,Math.max(335,innerWidth-25));const height=Math.min(config.height||460,Math.max(250,innerHeight-55));
 node.style.width=width+'px';node.style.height=height+'px';node.style.left=Math.max(12,Math.round((workspace.clientWidth-width)/2)+(seq%4)*23)+'px';node.style.top=Math.max(10,Math.round((workspace.clientHeight-height)/2)+(seq%4)*16)+'px';seq++;
 if(getPreferences().windowRemember&&!narrow()){const saved=safeGet('window-layout',{})[id];if(saved){node.style.width=Math.min(innerWidth-20,Math.max(320,saved.width))+'px';node.style.height=Math.min(innerHeight-60,Math.max(220,saved.height))+'px';node.style.left=Math.min(workspace.clientWidth-70,Math.max(0,saved.left))+'px';node.style.top=Math.min(workspace.clientHeight-40,Math.max(0,saved.top))+'px'}}
 const bar=el('div','window-title');bar.innerHTML=icon(windowIcon,18);bar.append(el('div','window-label',title));
 const controls=el('div','window-controls');
 for(const [action,glyph,label] of [['min','minimize',tr('Minimizar','Minimize')],['max','maximize',tr('Maximizar','Maximize')],['close','close',tr('Cerrar','Close')]]){
  const b=el('button','win-action '+(action==='close'?'close':''));b.type='button';b.setAttribute('aria-label',label);b.title=label;b.innerHTML=icon(glyph,13);b.addEventListener('click',e=>{e.stopPropagation();if(action==='min')minimize(id);if(action==='max')maximize(id);if(action==='close')closeWindow(id)});controls.append(b)
 }
 bar.append(controls);
 const main=el('div','window-content');node.append(bar,main);workspace.append(node);
 const record={id,node,main,title,icon:windowIcon,minimized:false,maximized:false};windows.set(id,record);
 main.append(content);node.addEventListener('pointerdown',()=>{if(activeId!==id)focus(id)});
 moveWindow(bar,node);if(getPreferences().windowMax&&!narrow()){record.maximized=true;node.classList.add('maximized')}
 if(typeof ResizeObserver!=='undefined'){const obs=new ResizeObserver(()=>saveWindowLayout(record));obs.observe(node);record.observer=obs}
 focus(id);return record;
}
function openProgram(entry,options={}){
 if(entry?.id?.startsWith('admin-')&&!adminActive)return;
 if(!entry||getDisabledPrograms().has(entry.id))return;
 const mode=entry.type==='page'?(options.forceMode||openModeOf(entry)):'internal';
 closeMenus();
 if(mode==='external'){openSafeURL(entry.url);return}
 if(mode==='ask'){
  const dialogId='open-choice-'+entry.id;
  if(windows.has(dialogId)){restore(dialogId);return}
  const body=el('div','open-choice');
  const heading=el('div','open-choice-heading');heading.innerHTML=icon(entry.icon,29);heading.append(el('span','',tr('¿Cómo deseas abrir «','How would you like to open “')+programTitle(entry)+(lang==='es'?'»?':'”?')));
  const actions=el('div','open-choice-actions');
  const choose=(label,glyph,fn)=>{const b=el('button','sys-button');b.type='button';b.innerHTML=icon(glyph,25);b.append(el('span','',label));b.onclick=()=>{closeWindow(dialogId);fn()};return b};
  actions.append(
    choose(tr('Ventana de TC/OS','TC/OS window'),'computer',()=>openProgram(entry,{...options,forceMode:'internal'})),
    choose(tr('Nueva pestaña','New browser tab'),'globe',()=>openProgram(entry,{...options,forceMode:'external'}))
  );
  const note=el('p','sys-muted',tr('También puedes elegir ambas opciones desde el menú contextual.','Both options are always available from the context menu.'));
  body.append(heading,actions,note);
  openWindow(dialogId,tr('Abrir programa','Open program'),'info',body,{width:485,height:305});
  return;
 }
 const id='app-'+entry.id;
 if(windows.has(id)){restore(id);return}
 const content=createApp(entry,{fs,catalog,options,openProgram,openText,shortcuts,refreshDesktop:populateIcons,showProgramContext,showFolderContext,minimizeSelf:()=>minimize(id)});
 const dims={'admin-installer':{width:950,height:650},'satellite-view':{width:980,height:680},'admin-diagnostics':{width:790,height:540},'music-player':{width:640,height:560},calculator:{width:990,height:705},'system-info':{width:620,height:490},notepad:{width:720,height:500},terminal:{width:750,height:500},explorer:{width:790,height:525},'boot-logs':{width:720,height:490},personalization:{width:740,height:600},calendar:{width:400,height:490},'recycle-bin':{width:590,height:420},settings:{width:740,height:560},help:{width:720,height:555}};
 openWindow(id,programTitle(entry),entry.icon,content,dims[entry.id]||{width:740,height:490});
}
function showProgramProperties(p){
 if(!p)return;const id='program-properties';if(windows.has(id))closeWindow(id);
 const wrap=el('div','sys-app');wrap.append(el('h2','',tr('Propiedades de programa','Program properties')));
 const lines=[
  [tr('Nombre','Name'),programTitle(p)],['ID',p.id],
  [tr('Tipo','Type'),p.type==='page'?'HTML / Web':'TC/OS'],
  [tr('Directorio','Directory'),'/srv/programs/'+(p.folder?folderPath(folders,p.folder):'')],
  [tr('Comando','Command'),p.command||'—'],
  [tr('Icono','Icon'),p.icon||'file'],
  [tr('Apertura','Opening'),p.type!=='page'?tr('Ventana interna','Internal window'):{internal:tr('Ventana interna','Internal window'),external:tr('Nueva pestaña','New tab'),ask:tr('Preguntar siempre','Always ask')}[openModeOf(p)]],
  [tr('Archivo','File'),p.url||'TC/OS'],
  [tr('Descripción','Description'),localized(p.description)||'—']
 ];
 const header=el('div','about-hero');header.innerHTML=icon(p.icon||'file',53);header.append(el('h2','',programTitle(p)));wrap.append(header);
 for(const [label,value] of lines){const row=el('div','sys-kv');row.append(el('span','',label),el('span','',String(value)));wrap.append(row)}
 const bar=el('div','sys-toolbar');const fav=el('button','sys-button',getFavoriteIds().has(p.id)?tr('★ Quitar de favoritos','★ Remove favorite'):tr('☆ Añadir a favoritos','☆ Add favorite'));
 fav.onclick=()=>{toggleFavorite(p.id);fav.textContent=getFavoriteIds().has(p.id)?tr('★ Quitar de favoritos','★ Remove favorite'):tr('☆ Añadir a favoritos','☆ Add favorite')};
 if(!p.id.startsWith('admin-'))bar.append(fav);
 const close=el('button','sys-button',tr('Cerrar','Close'));close.onclick=()=>closeWindow(id);bar.append(close);wrap.append(bar);
 openWindow(id,tr('Propiedades','Properties'),'info',wrap,{width:590,height:520});
}
function openText(title,txt){const id='viewer-'+(++seq);openWindow(id,title,'file',makeTextViewer(title,txt),{width:570,height:390})}
function openFolder(folder){
 const path='/srv/programs/'+folderPath(folders,folder.id);
 const explorer=catalog.find(p=>p.id==='explorer');if(!explorer)return;
 if(windows.has('app-explorer')){restore('app-explorer');window.dispatchEvent(new CustomEvent('tcos-explore',{detail:{path}}))}
 else openProgram(explorer,{path});
}
function desktopButton(shortcut){
 const target=shortcuts.item(shortcut.key)||{};const entry=target.entry,folder=target.folder;
 if(!entry&&!folder)return null;
 const name=shortcut.label|| (entry?programTitle(entry):localized(folder.name)),ic=entry?entry.icon:(folder.icon||'folder');
 const b=el('button','desktop-icon');b.type='button';b.title=name;b.dataset.shortcut=shortcut.key;b.dataset.slot=shortcut.slot;b.draggable=true;
 const slot=visualSlot(shortcut);b.style.gridRow=String(slot%rows+1);b.style.gridColumn=String(Math.floor(slot/rows)+1);b.dataset.slot=slot;
 b.innerHTML='<div class="icon-tile'+(entry?.id==='terminal'?' accent':'')+'">'+icon(ic,36)+'</div>';b.append(el('span','icon-title',name));
 const open=()=>entry?openProgram(entry):openFolder(folder);
 let suppress=false;
 b.addEventListener('click',e=>{if(suppress){suppress=false;return}if(selection)selection.classList.remove('selected');b.classList.add('selected');selection=b;if(getPreferences().iconOpen==='single'||e.detail>=2||matchMedia('(pointer:coarse)').matches)open()});
 b.addEventListener('dblclick',e=>{if(getPreferences().iconOpen!=='single'){e.preventDefault();open()}});
 b.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();open()}});
 b.addEventListener('contextmenu',e=>{e.preventDefault();showShortcutContext(e,shortcut.key,entry,folder)});
 b.addEventListener('dragstart',e=>{dragKey=shortcut.key;e.dataTransfer?.setData('application/x-tcos-shortcut',shortcut.key);if(e.dataTransfer)e.dataTransfer.effectAllowed='move'});
 b.addEventListener('dragover',e=>{if(shortcut.key==='p:recycle-bin'&&dragKey&&dragKey!==shortcut.key)e.preventDefault()});
 b.addEventListener('drop',e=>{if(shortcut.key==='p:recycle-bin'&&dragKey&&dragKey!==shortcut.key){e.preventDefault();e.stopPropagation();shortcuts.remove(dragKey);dragKey=null}});
 b.addEventListener('dragend',()=>{dragKey=null});
 // Touch/pen: custom snap-to-grid gesture. A small tap still opens the shortcut.
 if(matchMedia('(pointer:coarse)').matches){let from=null;
  b.addEventListener('pointerdown',e=>{if(e.button!==0)return;from={x:e.clientX,y:e.clientY,dragged:false}});
  b.addEventListener('pointermove',e=>{if(from&&Math.hypot(e.clientX-from.x,e.clientY-from.y)>18)from.dragged=true});
  b.addEventListener('pointerup',e=>{if(!from)return;if(from.dragged){const key=shortcut.key;suppress=true;const under=document.elementFromPoint(e.clientX,e.clientY);
   if(under?.closest('[data-shortcut="p:recycle-bin"]')&&key!=='p:recycle-bin')shortcuts.remove(key);
   else{const slot=slotAt(e.clientX,e.clientY);if(slot!==null)shortcuts.move(key,slot)}
  }from=null});
 }
 return b;
}
function refreshDesktopGrid(){
 const mobile=innerWidth<=700,small=innerWidth<=430;
 const cellHeight=small?86:(mobile?91:99);
 // The visible icon zone extends all the way down to the taskbar.
 const availableHeight=Math.max(0,icons.clientHeight || innerHeight-(mobile?56:70));
 rows=Math.max(1,Math.floor((availableHeight+ (small||mobile?4:9))/cellHeight));
 icons.style.setProperty('--tcos-icon-rows',String(rows));
}
function bottomRightSlot(){
 const mobile=innerWidth<=700,cellWidth=mobile?90:97,iconWidth=mobile?82:88;
 const lastColumn=Math.max(0,Math.floor((icons.clientWidth-iconWidth)/cellWidth));
 return lastColumn*rows+(rows-1);
}
function visualSlot(shortcut){return shortcut.anchor==='bottom-right'?bottomRightSlot():shortcut.slot}
function slotAt(x,y){const rect=icons.getBoundingClientRect();if(x<rect.left||y<rect.top||y>rect.bottom||x>rect.right)return null;
 const cellWidth=innerWidth<=700?90:97,cellHeight=innerWidth<=430?86:innerWidth<=700?91:99;
 const col=Math.max(0,Math.floor((x-rect.left+icons.scrollLeft)/cellWidth));const row=Math.max(0,Math.min(rows-1,Math.floor((y-rect.top+icons.scrollTop)/cellHeight)));
 return Math.min(500,col*rows+row);
}
function populateIcons(){
 refreshDesktopGrid();icons.replaceChildren();
 // Keep the bin at the bottom-right on the standard layout, without changing saved user positions.
 const list=shortcuts.available();const anchored=list.find(x=>x.anchor==='bottom-right');
 const reserved=anchored?bottomRightSlot():-1;const occupied=new Set(list.filter(x=>x!==anchored).map(x=>x.slot));
 for(let item of list){if(item!==anchored&&item.slot===reserved){let slot=0;while(occupied.has(slot)||slot===reserved)slot++;item={...item,slot};}const b=desktopButton(item);if(b)icons.append(b)}

}
window.addEventListener('resize',populateIcons);
function showContext(e,actions){e.preventDefault();e.stopPropagation();closeMenus();ctxMenu.replaceChildren();
 for(const [title,fn] of actions){const b=el('button','',title);b.type='button';b.addEventListener('click',()=>{closeMenus();fn()});ctxMenu.append(b)}
 ctxMenu.style.left=Math.max(4,Math.min(e.clientX,innerWidth-230))+'px';ctxMenu.style.top=Math.max(4,Math.min(e.clientY,innerHeight-45-actions.length*34))+'px';ctxMenu.classList.add('open');
}
function renameShortcut(key){
 const item=shortcuts.items.get(key);if(!item)return;
 const target=shortcuts.item(key)||{};
 const original=target.entry?programTitle(target.entry):localized(target.folder?.name);
 const pane=el('div','sys-app');
 const title=el('h2','',tr('Cambiar nombre del acceso directo','Rename shortcut'));
 const label=el('label','sys-muted',tr('Nombre en el escritorio','Desktop label'));
 const input=el('input','sys-input');input.type='text';input.maxLength=45;input.value=item.label||original;input.setAttribute('aria-label',label.textContent);
 const buttons=el('div','sys-toolbar');
 const save=el('button','sys-button',tr('Guardar','Save'));
 const cancel=el('button','sys-button',tr('Cancelar','Cancel'));
 const id='shortcut-rename';
 save.addEventListener('click',()=>{const name=input.value.trim();if(name&&shortcuts.rename(key,name===original?'':name))closeWindow(id);else input.focus()});
 cancel.addEventListener('click',()=>closeWindow(id));
 input.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();save.click()}if(event.key==='Escape'){event.stopPropagation();cancel.click()}});
 buttons.append(save,cancel);pane.append(title,label,input,buttons);
 const previous=windows.get(id);if(previous)closeWindow(id);
 openWindow(id,tr('Cambiar nombre','Rename'),'note',pane,{width:410,height:260});input.focus();input.select();
}
function showShortcutContext(e,key,entry,folder){
 const actions=[[tr('Abrir','Open'),()=>entry?openProgram(entry):openFolder(folder)]];
 if(entry?.id==='system-info')actions.push([tr('Administrar TC-HQ','Manage TC-HQ'),openAdminLogin]);
 if(entry?.type==='page'&&entry.url)actions.push([tr('Abrir en ventana de TC/OS','Open in TC/OS window'),()=>openProgram(entry,{forceMode:'internal'})],[tr('Abrir en nueva pestaña','Open in new tab'),()=>openProgram(entry,{forceMode:'external'})]);
 if(entry)actions.push([tr('Propiedades','Properties'),()=>showProgramProperties(entry)]);
 actions.push([tr('Cambiar nombre','Rename'),()=>renameShortcut(key)]);
 actions.push([tr('Quitar acceso directo','Remove shortcut'),()=>shortcuts.remove(key)]);
 showContext(e,actions);
}
function showProgramContext(e,p){if(!p)return;const actions=[[tr('Abrir','Open'),()=>openProgram(p)]];
 if(p.type==='page'&&p.url)actions.push([tr('Abrir en ventana de TC/OS','Open in TC/OS window'),()=>openProgram(p,{forceMode:'internal'})],[tr('Abrir en nueva pestaña','Open in new tab'),()=>openProgram(p,{forceMode:'external'})]);
 if(!p.id.startsWith('admin-'))actions.push([getFavoriteIds().has(p.id)?tr('★ Quitar de favoritos','★ Remove favorite'):tr('☆ Añadir a favoritos','☆ Add favorite'),()=>toggleFavorite(p.id)]);
 actions.push([tr('Propiedades','Properties'),()=>showProgramProperties(p)]);
 if(p.id==='system-info')actions.push([tr('Administrar TC-HQ','Manage TC-HQ'),openAdminLogin]);
 if(!p.id.startsWith('admin-')&&!shortcuts.has(pKey(p.id)))actions.push([tr('Añadir acceso al escritorio','Create desktop shortcut'),()=>shortcuts.add(pKey(p.id))]);
 else if(!p.id.startsWith('admin-'))actions.push([tr('Quitar acceso del escritorio','Remove desktop shortcut'),()=>shortcuts.remove(pKey(p.id))]);
 showContext(e,actions);
}
function showFolderContext(e,f){const actions=[[tr('Abrir carpeta','Open folder'),()=>openFolder(f)]];
 if(f.id==='administration'){showContext(e,actions);return}if(!shortcuts.has(fKey(f.id)))actions.push([tr('Añadir al escritorio','Add to desktop'),()=>shortcuts.add(fKey(f.id))]);
 else actions.push([tr('Quitar del escritorio','Remove from desktop'),()=>shortcuts.remove(fKey(f.id))]);
 showContext(e,actions);
}
icons.addEventListener('dragover',e=>{if(e.dataTransfer?.types.includes('application/x-tcos-shortcut'))e.preventDefault()});
icons.addEventListener('drop',e=>{const key=e.dataTransfer?.getData('application/x-tcos-shortcut')||dragKey;
 if(!key||!shortcuts.valid(key))return;e.preventDefault();const slot=slotAt(e.clientX,e.clientY);
 if(shortcuts.has(key))shortcuts.move(key,slot??0);else shortcuts.add(key,slot);dragKey=null;
});
function populateMenu(){
 items.replaceChildren();
 const favs=[...getFavoriteIds()].map(id=>catalog.find(p=>p.id===id)).filter(p=>p&&!p.id.startsWith('admin-')&&!getDisabledPrograms().has(p.id));
 if(favs.length){items.append(el('div','sys-section-title',tr('★ FAVORITOS','★ FAVORITES')));for(const p of favs){const b=el('button','start-item');b.type='button';b.innerHTML=icon(p.icon,23);b.append(el('span','',programTitle(p)));b.onclick=()=>openProgram(p);b.addEventListener('contextmenu',e=>showProgramContext(e,p));items.append(b)}items.append(el('div','start-sep'))}
 items.append(el('div','sys-section-title',tr('PROGRAMAS','PROGRAMS')));
 const makeProgram=(p)=>{
  const b=el('button','start-item');b.type='button';b.innerHTML=icon(p.icon,23);b.append(el('span','',programTitle(p)));
  b.addEventListener('click',()=>openProgram(p));
  b.addEventListener('contextmenu',e=>showProgramContext(e,p));return b;
 };
 const hideSiblingSubmenus=(container,except)=>{for(const node of container.children){const sub=node.querySelector?.(':scope > .start-submenu');if(sub&&sub!==except)sub.classList.remove('open')}};
 const createFolderNode=(folder,depth=0)=>{
  if(depth>8)return el('div','start-sep');
  const wrapper=el('div','start-group'),b=el('button','start-item has-submenu');b.type='button';b.setAttribute('aria-haspopup','true');b.setAttribute('aria-expanded','false');b.innerHTML=icon(folder.icon||'folder',23);
  b.append(el('span','start-name',localized(folder.name)),el('span','start-chevron','›'));
  const sub=el('div','start-submenu');sub.setAttribute('role','menu');
  // On touch: a back button is more reliable than a multi-column flyout.
  const back=el('button','start-item mobile-back',tr('‹ Volver','‹ Back'));back.type='button';back.addEventListener('click',e=>{e.stopPropagation();sub.classList.remove('open')});sub.append(back);
  if(depth>=2 && childrenOf(folder.id).some(f=>f.menu!==false)){
   const more=el('button','start-item',tr('Abrir subcarpetas en Explorador...','Open subfolders in Explorer...'));
   more.addEventListener('click',e=>{e.stopPropagation();openFolder(folder)});sub.append(more);
  }else for(const child of childrenOf(folder.id).filter(f=>f.menu!==false))sub.append(createFolderNode(child,depth+1));
  for(const p of programsIn(folder.id))sub.append(makeProgram(p));
  if(sub.childElementCount===1)sub.append(el('div','sys-muted start-empty',tr('Carpeta vacía','Empty folder')));
  const toggle=open=>{
   hideSiblingSubmenus(wrapper.parentElement,sub);sub.classList.toggle('open',open);
   b.setAttribute('aria-expanded',open?'true':'false');
   if(open&&!narrow()){
    sub.classList.remove('submenu-left');
    const rect=b.getBoundingClientRect();const approximateWidth=252;
    if(rect.right+approximateWidth>innerWidth-8)sub.classList.add('submenu-left');
    sub.style.top='-6px';
    const bounds=sub.getBoundingClientRect();
    if(bounds.bottom>innerHeight-45)sub.style.top=(-6-(bounds.bottom-(innerHeight-45)))+'px';
    const adjusted=sub.getBoundingClientRect();
    if(adjusted.top<8)sub.style.top=(parseFloat(sub.style.top)+8-adjusted.top)+'px';
   }
  };
  b.addEventListener('click',e=>{e.stopPropagation();toggle(!sub.classList.contains('open'))});
  wrapper.addEventListener('mouseenter',()=>{if(!narrow())toggle(true)});
  wrapper.addEventListener('mouseleave',()=>{if(!narrow())toggle(false)});
  b.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();toggle(true);sub.querySelector('button')?.focus()}else if(e.key==='ArrowLeft'){e.preventDefault();toggle(false)}});
  wrapper.append(b,sub);return wrapper;
 };
 for(const f of childrenOf(null).filter(x=>x.menu!==false))items.append(createFolderNode(f));
 for(const p of programsIn(null))items.append(makeProgram(p));
 items.append(el('div','start-sep'));
 const helpBtn=el('button','start-item');helpBtn.type='button';helpBtn.innerHTML=icon('book',23);helpBtn.append(el('span','',tr('Ayuda de TC/OS','TC/OS Help')));helpBtn.onclick=()=>openProgram(catalog.find(p=>p.id==='help'));items.append(helpBtn);
 const standalone=el('button','start-item');standalone.type='button';standalone.innerHTML=icon('terminal',23);standalone.append(el('span','',tr('Consola completa','Full-screen console')));standalone.addEventListener('click',()=>{location.href='terminal.html'+(lang==='en'?'?lang=en':'')});items.append(standalone);
 if(adminActive){const exit=el('button','start-item');exit.type='button';exit.innerHTML=icon('key',23);exit.append(el('span','',tr('Salir del modo administrador','Exit administrator mode')));exit.addEventListener('click',logoutAdmin);items.append(exit)}
 const reboot=el('button','start-item');reboot.type='button';reboot.innerHTML=icon('power',23);reboot.append(el('span','',tr('Reiniciar conexión','Reconnect TC-HQ')));reboot.addEventListener('click',()=>location.href='index.html'+(lang==='en'?'?lang=en':''));items.append(reboot);
}
function openAdminLogin(){if(adminActive){openFolder(adminFolder);return}openWindow('admin-login',tr('Acceso administrativo','Administrative access'),'key',makeAdminLogin(activateAdmin),{width:410,height:310})}
function activateAdmin(){if(adminActive)return;adminActive=true;window.__tcosAdmin=true;folders.push(adminFolder);catalog.push(...adminTools);Object.assign(fs,new VirtualFS(catalog));closeWindow('admin-login');closeWindow('app-explorer');document.body.classList.add('admin-on');$('tray-state').textContent='● ADMIN';populateIcons();populateMenu();openFolder(adminFolder);window.dispatchEvent(new CustomEvent('tcos-admin-status',{detail:{active:true}}));}
function logoutAdmin(){if(!adminActive)return;for(const p of adminTools){closeWindow('app-'+p.id)}closeWindow('app-explorer');adminActive=false;window.__tcosAdmin=false;folders.splice(folders.findIndex(f=>f.id===adminFolder.id),1);for(const p of adminTools){const i=catalog.findIndex(x=>x.id===p.id);if(i>=0)catalog.splice(i,1)}Object.assign(fs,new VirtualFS(catalog));document.body.classList.remove('admin-on');$('tray-state').textContent='● ONLINE';populateIcons();populateMenu();window.dispatchEvent(new CustomEvent('tcos-admin-status',{detail:{active:false}}));}
window.__tcosAdmin=false;window.addEventListener('tcos-admin-request',openAdminLogin);window.addEventListener('tcos-admin-logout',logoutAdmin);
populateIcons();populateMenu();
if(qs.get('admin')==='1'){history.replaceState(null,'',location.pathname);openAdminLogin()}
window.addEventListener('tcos-programs-changed',()=>{populateIcons();populateMenu()});window.addEventListener('tcos-shortcuts-changed',populateIcons);
desktop.addEventListener('pointerdown',e=>{if(!e.target.closest('.start-menu,.taskbar,.window,.context-menu')){closeMenus();if(selection){selection.classList.remove('selected');selection=null}}});
// Desktop context actions never change the published program catalog.
desktop.addEventListener('contextmenu',e=>{
 if(e.target.closest('.window,.taskbar,.start-menu,.desktop-icon'))return;
 showContext(e,[[tr('Organizar iconos','Arrange icons'),()=>shortcuts.organize()],
 [tr('Personalización','Personalization'),()=>openProgram(catalog.find(p=>p.id==='personalization'))],
 [tr('Panel de control','Control Panel'),()=>openProgram(catalog.find(p=>p.id==='settings'))],
 [tr('Actualizar escritorio','Refresh desktop'),populateIcons]]);
});
function cycleWindows(reverse=false){const available=[...windows.values()].filter(w=>!w.minimized);if(available.length<2)return;
 const current=available.findIndex(w=>w.id===activeId);const next=(current+(reverse?-1:1)+available.length)%available.length;focus(available[next].id);
}
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'){
  const choice=[...windows.keys()].find(k=>k.startsWith('open-choice-'));if(choice){e.preventDefault();closeWindow(choice)}
  closeMenus();return;
 }
 const editing=!!e.target.closest?.('input,textarea,select,[contenteditable="true"]');
 if(e.key==='F2'&&selection?.dataset.shortcut&&!editing){e.preventDefault();renameShortcut(selection.dataset.shortcut);return}
 if(e.key==='F1'&&!editing){e.preventDefault();openProgram(catalog.find(p=>p.id==='help'));return}
 if(e.altKey&&e.key==='Tab'&&!editing){e.preventDefault();cycleWindows(e.shiftKey);return}
 if(e.altKey&&!e.ctrlKey&&e.key.toLowerCase()==='t'&&!editing){e.preventDefault();openProgram(catalog.find(p=>p.id==='terminal'));return}
 if(e.ctrlKey&&e.altKey&&!e.metaKey&&!editing){const k=e.key.toLowerCase();
  if(k==='e'){e.preventDefault();openProgram(catalog.find(p=>p.id==='explorer'))}
  if(k==='t'){e.preventDefault();openProgram(catalog.find(p=>p.id==='terminal'))}
  if(k==='m'){e.preventDefault();for(const w of windows.values())minimize(w.id)}
  if(k==='f'){e.preventDefault();const explorer=catalog.find(p=>p.id==='explorer');if(windows.has('app-explorer')){restore('app-explorer');window.dispatchEvent(new CustomEvent('tcos-favorites-view'))}else openProgram(explorer,{path:'/favorites'})}
 }
});
window.addEventListener('tcos-favorites-changed',populateMenu);
// Inform user if the required JSON was not found instead of silently showing an empty desktop.
if(!catalog.length){openText('TC/OS / programs.json',tr('No se ha podido cargar el catálogo programs.json.\nComprueba que se ha subido junto con home.html y que los directorios se conservan.','Unable to load programs.json.\nEnsure the file is uploaded alongside home.html and folders are preserved.'))}
if(qs.has('app')){const p=catalog.find(x=>x.id===qs.get('app'));if(p)openProgram(p)}
