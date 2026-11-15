import {tr,getPreferences,setPreferences,icon} from '../core.js?v=174';
const el=(tag,cls='',text)=>{const n=document.createElement(tag);n.className=cls;if(text!==undefined)n.textContent=text;return n};
const btn=(label,handler)=>{const n=el('button','sys-button',label);n.type='button';n.addEventListener('click',handler);return n};
const THEMES=[['hq-black','TC-HQ Black','#050506','#d82b3f'],['graphite','Graphite Classic','#24252b','#95323c'],['phosphor','Phosphor Green','#0a120b','#33754b'],['midnight','Midnight Purple','#100d16','#754b91'],['classic','Windows Classic','#ccc9be','#26548d'],['blackout','Blackout','#010102','#b51d2f'],['synthwave','Synthwave 1986','#110820','#ff4eaf']];
const WALLS=[['original',tr('Original','Original')],['headquarters','Headquarters'],['grid',tr('Cuadrícula técnica','Technical grid')],['mainframe','Mainframe'],['solid',tr('Negro liso','Solid black')],['synth-sunset','Synthwave Sunset'],['synth-grid','Neon Grid'],['synth-neon','Retro Neon'],['red-circuit','Red Circuit'],['dark-stars','Deep Space'],['aurora','Aurora'],['scanline','CRT Pattern'],['living-synth',tr('Synthwave animado','Animated Synthwave')],['living-stars',tr('Espacio animado','Animated Space')]];
export function makePersonalization(ctx){
 const wrap=el('div','sys-app personalization-app');wrap.append(el('h2','',tr('Personalización de TC/OS','Personalize TC/OS')));
 const tabs=el('div','sys-tabbar'),area=el('div');wrap.append(tabs,area);
 const labels=[tr('Temas','Themes'),tr('Fondos','Wallpapers'),tr('Escritorio','Desktop'),tr('Salvapantallas','Screensaver')];let current=0;
 function row(title,desc,control){const div=el('div','setting-row');const text=el('div');text.append(el('strong','',title),el('br'),el('small','sys-muted',desc));div.append(text,control);return div}
 function toggle(title,desc,key){const input=el('input');input.type='checkbox';input.checked=!!getPreferences()[key];input.addEventListener('change',()=>setPreferences({[key]:input.checked}));area.append(row(title,desc,input))}
 function draw(i=current){current=i;tabs.replaceChildren();area.replaceChildren();labels.forEach((t,j)=>{const b=el('button','sys-tab'+(i===j?' active':''),t);b.onclick=()=>draw(j);tabs.append(b)});
  if(i===0){
   area.append(el('p','sys-muted',tr('Los temas modifican toda la interfaz: barras de ventanas, menús, botones, bordes y terminal.','Themes affect the complete interface: title bars, menus, buttons, borders and terminal.')));
   const grid=el('div','theme-options');for(const [id,name,bg,accent] of THEMES){const b=el('button','theme-option'+(getPreferences().theme===id?' chosen':''));b.type='button';b.innerHTML=`<span class="theme-swatch" style="background:${bg}"><span style="background:${accent}"></span></span>`;b.append(el('span','',name));b.onclick=()=>{setPreferences({theme:id});draw()};grid.append(b)}area.append(grid);
  }else if(i===1){
   area.append(el('p','sys-muted',tr('El fondo es independiente del tema de color.','Wallpaper is independent of the color theme.')));
   const grid=el('div','theme-options');for(const [id,name] of WALLS){const b=el('button','theme-option'+(getPreferences().wallpaper===id?' chosen':''));b.type='button';const preview=el('span','wallpaper-swatch wp-'+id);preview.append(el('span','',id==='mainframe'?'TC':'TC-HQ'));b.append(preview,el('span','',name));b.onclick=()=>{setPreferences({wallpaper:id});draw()};grid.append(b)}area.append(grid);
   toggle(tr('Animar fondos dinámicos','Animate dynamic wallpapers'),tr('Movimiento suave de neón y estrellas','Gentle neon and star motion'),'ambientMotion');
   toggle(tr('Cuadrícula del escritorio','Desktop grid'),tr('Textura discreta sobre el fondo','Subtle texture over wallpaper'),'grid');
   toggle(tr('Líneas CRT','CRT scanlines'),tr('Efecto de monitor antiguo, muy tenue','Very subtle old monitor effect'),'crt');
   const sel=el('select','sys-select');sel.style.width='auto';for(const[id,name] of [['classic',tr('Clásico','Classic')],['red','TC-HQ Red'],['phosphor','Phosphor'],['crosshair',tr('Precisión','Precision')]]){const o=el('option','',name);o.value=id;sel.append(o)}sel.value=getPreferences().cursorTheme||'classic';sel.onchange=()=>setPreferences({cursorTheme:sel.value});area.append(row(tr('Cursor del sistema','System cursor'),tr('Puntero en escritorio y ventanas','Pointer for desktop and windows'),sel));
  }else if(i===3){
   area.append(el('p','sys-muted',tr('Protege la pantalla durante la inactividad. Pulsa una tecla o toca la pantalla para volver.','Display an ambient screensaver while idle. Press any key or tap to return.')));
   toggle(tr('Activar salvapantallas','Enable screensaver'),tr('Se inicia al transcurrir el tiempo configurado','Starts after the configured idle time'),'screensaverEnabled');
   const sel=(key,choices,title,desc)=>{const input=el('select','sys-select');input.style.width='auto';for(const [value,name] of choices){const opt=el('option','',name);opt.value=value;input.append(opt)}input.value=String(getPreferences()[key]);input.onchange=()=>setPreferences({[key]:key==='screensaverMinutes'?Number(input.value):input.value});area.append(row(title,desc,input))};
   sel('screensaverMinutes',[[1,'1 min'],[2,'2 min'],[5,'5 min'],[10,'10 min'],[15,'15 min'],[30,'30 min']],tr('Inactividad','Idle time'),tr('Tiempo hasta activar el salvapantallas','Time before screensaver starts'));
   sel('screensaverStyle',[['clock',tr('Reloj digital','Digital clock')],['logo','TC-HQ'],['stars',tr('Estrellas','Stars')]],tr('Diseño','Style'),tr('Aspecto del salvapantallas','Screensaver appearance'));
   area.append(btn(tr('Vista previa','Preview'),()=>window.dispatchEvent(new Event('tcos-preview-screensaver'))));
  }else{
   area.append(el('p','sys-note',tr('Los preajustes sustituyen la distribución actual de accesos directos, pero nunca eliminan los programas. Después podrás moverlos, añadirlos o quitarlos.','Presets replace your current shortcuts, not the actual programs. You can move, add or remove shortcuts afterwards.')));
   for(const [id,es,en] of [['empty','Escritorio vacío','Empty desktop'],['normal','Escritorio estándar','Standard desktop'],['all','Todas las aplicaciones','All applications']]){
    area.append(row(tr(es,en),id==='all'?tr('Todos los programas instalados; permite desplazarse si no caben.','All installed programs; scroll if they do not fit.'):tr('Configuración predefinida','Preset layout'),btn(tr('Aplicar','Apply'),()=>{
     if(!confirm(tr('¿Reemplazar la distribución de iconos del escritorio?','Replace desktop shortcut layout?')))return;
     ctx.shortcuts.preset(id);setPreferences({desktopPreset:id});
    })));
   }
   const restore=btn(tr('Organizar iconos en orden','Arrange shortcuts in order'),()=>{ctx.shortcuts.organize();});
   area.append(restore);
   area.append(el('p','sys-muted',tr('Arrastra un programa desde el Explorador o usa su menú contextual para añadirlo al escritorio. Los accesos se alinean a la cuadrícula.','Drag an app from File Explorer or use its context menu to add it to the desktop. Shortcuts snap to the grid.')));
  }
 }
 draw(0);return wrap;
}
