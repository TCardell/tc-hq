import {tr,icon,localized,programTitle} from '../core.js?v=174';
const el=(tag,cls='',txt)=>{const n=document.createElement(tag);n.className=cls;if(txt!==undefined)n.textContent=txt;return n};
export function makeRecycleBin(ctx){
 const wrap=el('div','sys-app');wrap.append(el('h2','',tr('Papelera de accesos directos','Shortcut Recycle Bin')),
 el('p','sys-muted',tr('La papelera solo guarda accesos retirados del escritorio. No elimina programas, archivos HTML ni documentos.','This bin only contains shortcuts removed from the desktop. It never deletes apps, HTML pages or documents.')));
 const toolbar=el('div','sys-toolbar'),list=el('div','software-list'),status=el('div','sys-status');wrap.append(toolbar,list,status);
 const empty=el('button','sys-button danger',tr('Vaciar papelera','Empty bin'));empty.onclick=()=>{if(!confirm(tr('¿Vaciar la papelera de accesos directos?','Empty shortcut recycle bin?')))return;ctx.shortcuts.emptyTrash();draw()};toolbar.append(empty);
 function draw(){list.replaceChildren();const items=ctx.shortcuts.trash;empty.disabled=!items.length;
  items.forEach((item,i)=>{const resolved=ctx.shortcuts.item(item.key)||{};const source=resolved.entry||resolved.folder;
   if(!source)return;const row=el('div','software-entry');const glyph=el('div','software-icon');glyph.innerHTML=icon(source.icon||'folder',30);
   const text=el('div','software-desc');text.append(el('strong','',localized(source.name)||source.id),el('small','sys-muted',tr('Acceso directo eliminado, programa intacto','Removed shortcut; program remains installed')));
   const b=el('button','sys-button',tr('Restaurar','Restore'));b.onclick=()=>{ctx.shortcuts.restore(i);draw()};row.append(glyph,text,b);list.append(row);
  });if(!items.length)list.append(el('p','sys-muted',tr('La papelera está vacía.','Recycle bin is empty.')));
  status.textContent=tr('Accesos: ','Shortcuts: ')+items.length;
 }
 draw();window.addEventListener('tcos-shortcuts-changed',draw);return wrap;
}
