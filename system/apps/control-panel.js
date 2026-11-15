import {tr,getPreferences,setPreferences,VERSION,localized} from '../core.js?v=174';
import {resetAppearance,factoryReset} from '../preferences.js?v=174';
import {playCue} from '../sound.js?v=174';
const el=(tag,cls='',txt)=>{const n=document.createElement(tag);n.className=cls;if(txt!==undefined)n.textContent=txt;return n};
const button=(txt,fn)=>{const b=el('button','sys-button',txt);b.type='button';b.onclick=fn;return b};
const categories=[
 ['appearance','palette','Personalización','Personalization'],['windows','app-window','Ventanas','Windows'],['terminal','terminal','Terminal','Terminal'],
 ['files','folder','Archivos','Files'],['boot','power','Inicio y apagado','Startup & shutdown'],['locale','globe','Idioma y región','Language & region'],
 ['sound','volume','Sonido','Sound'],['accessibility','settings','Accesibilidad','Accessibility'],['storage','disk','Almacenamiento','Storage'],
 ['programs','archive','Programas','Programs'],['system','computer','Sistema','System']
];
export function makeControlPanel(ctx){
 const wrap=el('div','sys-app control-app');wrap.append(el('h2','',tr('Panel de control','Control Panel')));
 const nav=el('div','control-categories'),area=el('div','control-area');wrap.append(nav,area);let current='';
 function field(label,key,options){const row=el('div','setting-row');row.append(el('label','',label));const select=el('select','sys-select');select.setAttribute('aria-label',label);
  for(const [v,name] of options){const o=el('option','',name);o.value=String(v);select.append(o)}select.value=String(getPreferences()[key]);
  select.onchange=()=>{setPreferences({[key]:['true','false'].includes(select.value)?select.value==='true':select.value});if(key==='language'){location.reload()}};row.append(select);area.append(row);
 }
 function check(label,key,desc=''){const row=el('div','setting-row');const copy=el('div');copy.append(el('strong','',label));if(desc)copy.append(el('small','sys-muted',desc));const c=el('input');c.type='checkbox';c.checked=!!getPreferences()[key];c.onchange=()=>setPreferences({[key]:c.checked});row.append(copy,c);area.append(row)}
 function subsection(title){area.append(el('h3','control-heading',title))}
 function message(text){area.append(el('p','sys-muted',text))}
 function slider(label,key){const row=el('div','setting-row');const copy=el('span','',label);const wrap=el('div','sys-flex');const input=el('input');input.type='range';input.min='0';input.max='100';input.step='5';input.style.width='180px';const value=el('span','sys-muted');input.value=getPreferences()[key]??50;value.textContent=input.value+'%';input.oninput=()=>{value.textContent=input.value+'%';setPreferences({[key]:Number(input.value)})};wrap.append(input,value);row.append(copy,wrap);area.append(row)}
 function show(cat){current=cat;nav.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.category===cat));area.replaceChildren();
  const definition=categories.find(x=>x[0]===cat);subsection(tr(definition[2],definition[3]));
  switch(cat){
   case 'appearance':area.append(button(tr('Abrir Personalización','Open Personalization'),()=>ctx.openProgram(ctx.catalog.find(p=>p.id==='personalization'))));message(tr('Temas globales, fondos de escritorio, distribución y accesos directos.','Global themes, wallpapers, desktop presets and shortcuts.'));break;
   case 'windows':
    check(tr('Recordar posición y tamaño','Remember window size and position'),'windowRemember');
    check(tr('Abrir ventanas maximizadas','Open windows maximized'),'windowMax');
    check(tr('Animaciones de ventanas','Window animations'),'windowAnimations');
    field(tr('Abrir iconos con','Open desktop icons with'),'iconOpen',[['double',tr('Doble clic','Double click')],['single',tr('Un clic','Single click')]]);break;
   case 'terminal':
    field(tr('Tamaño de fuente','Font size'),'termSize',[[18,'18 px'],[20,'20 px'],[23,'23 px'],[26,'26 px'],[30,'30 px']]);
    field(tr('Estilo de cursor','Cursor style'),'termCursor',[['block',tr('Bloque','Block')],['bar',tr('Barra','Bar')],['underline',tr('Subrayado','Underline')]]);
    check(tr('Guardar historial de comandos','Save command history'),'termHistory');
    field(tr('Líneas de historial visible','Scrollback lines'),'termScrollback',[[500,'500'],[1000,'1000'],[2000,'2000'],[5000,'5000']]);
    message(tr('Estos ajustes se aplican a la terminal nueva o en la próxima sesión.','These settings apply to newly opened terminals or your next session.'));break;
   case 'files':
    check(tr('Mostrar extensiones de archivos','Show filename extensions'),'showExtensions');
    check(tr('Mostrar archivos ocultos','Show hidden files'),'showHidden',tr('Incluye carpetas y archivos de sistema.','Includes system files and directories.'));break;
   case 'boot':
    field(tr('Secuencia de arranque','Boot sequence'),'bootStyle',[['full',tr('Completa (11 s)','Full (11 s)')],['quick',tr('Rápida','Quick')],['none',tr('Sin animación','No animation')]]);
    field(tr('Destino predeterminado','Default destination'),'bootTarget',[['automatic',tr('Automático (escritorio o prompt)','Automatic (desktop or prompt)')],['graphical',tr('Escritorio','Desktop')],['terminal',tr('Terminal','Terminal')]]);
    message(tr('En modo automático, el prompt oculto conserva su función original.','In automatic mode, the hidden prompt retains its original behavior.'));
    area.append(button(tr('Repetir arranque','Replay boot'),()=>{location.href='index.html'}));break;
   case 'locale':
    field(tr('Idioma del sistema','System language'),'language',[['auto',tr('Automático','Automatic')],['es','Español'],['en','English']]);
    area.append(button(tr('Establecer todo en inglés','Set everything to English'),()=>{setPreferences({language:'en'});location.reload()}));
    message(tr('El idioma elegido se conserva para las próximas sesiones y se aplica al reiniciar TC/OS. Los programas externos pueden tener su propio idioma.','Your chosen language is saved for future sessions and is applied when TC/OS restarts. External programs may have their own language.'));
    field(tr('Hora','Time format'),'time24',[['true',tr('24 horas','24-hour')],['false',tr('12 horas','12-hour')]]);
    field(tr('Primer día de semana','First day of week'),'weekStart',[['monday',tr('Lunes','Monday')],['sunday',tr('Domingo','Sunday')]]);break;
   case 'sound':
    check(tr('Sonidos de TC/OS','TC/OS sounds'),'sound',tr('Efectos clásicos al utilizar botones y ventanas.','Classic cues for buttons and windows.'));
    slider(tr('Volumen general','Master volume'),'volume');slider(tr('Volumen de efectos','Effects volume'),'effectsVolume');
    area.append(button(tr('Probar sonido','Test sound'),()=>playCue('open')));
    message(tr('El navegador puede requerir una primera interacción para habilitar el audio.','Your browser may require an initial interaction to enable audio.'));break;
   case 'accessibility':
    check(tr('Reducir movimiento','Reduce motion'),'reduceMotion');
    message(tr('Puedes navegar por el escritorio con el teclado. El modo de alto contraste depende del tema seleccionado.','The desktop supports keyboard navigation. Theme choice also affects contrast.'));break;
   case 'storage':{
    message(tr('Los datos de TC/OS se guardan únicamente en este navegador. Los archivos publicados permanecen intactos.','TC/OS settings are stored in this browser only. Published files are not changed.'));
    area.append(button(tr('Restaurar apariencia e iconos','Reset appearance and shortcuts'),()=>{if(confirm(tr('¿Restaurar el tema e iconos predeterminados?','Restore default theme and shortcuts?'))){resetAppearance();ctx.shortcuts.load();ctx.refreshDesktop?.();show('storage')}}));
    area.append(el('hr','sys-divider'));
    const includeNotes=el('input');includeNotes.type='checkbox';includeNotes.id='include-notes';const label=el('label');label.append(includeNotes,document.createTextNode(' '+tr('Borrar también las notas locales','Also delete local notes')));area.append(label);
    area.append(button(tr('FORMATEAR TC/OS','FACTORY RESET TC/OS'),()=>{
     if(!confirm(tr('Esta acción restablecerá toda la configuración local de TC/OS. ¿Continuar?','This will reset all TC/OS local settings. Continue?')))return;
     if(includeNotes.checked&&!confirm(tr('Las notas locales también se borrarán. ¿Confirmas?','Saved local notes will also be deleted. Confirm?')))return;
     factoryReset({notes:includeNotes.checked});location.replace('index.html');
    }));
    message(tr('El formateo no borra la caché HTTP del navegador. Las versiones nuevas de TC/OS llevan identificadores de recursos propios.','Factory reset does not clear HTTP browser cache. TC/OS updates use versioned resources.'));break;
   }
   case 'programs':area.append(button(tr('Abrir Gestor de programas','Open Software Manager'),()=>ctx.openProgram(ctx.catalog.find(p=>p.id==='software-center'))));break;
   case 'system':
    area.append(el('p','sys-note',`TC/OS Professional ${VERSION} / TC-HQ`));
    message(tr('TC-HQ en línea. Servicios centrales disponibles.','TC-HQ online. Central services available.'));
    area.append(button(tr('Propiedades del sistema','System properties'),()=>ctx.openProgram(ctx.catalog.find(p=>p.id==='system-info'))));
    area.append(button(tr('Acceso administrador','Administrator access'),()=>window.dispatchEvent(new Event('tcos-admin-request'))));
    if(window.__tcosAdmin)area.append(button(tr('Salir del modo administrador','Exit administrator mode'),()=>window.dispatchEvent(new Event('tcos-admin-logout'))));break;
  }
 }
 for(const [id,ic,es,en] of categories){const b=el('button','control-category',tr(es,en));b.dataset.category=id;b.onclick=()=>show(id);nav.append(b)}
 window.addEventListener('tcos-admin-status',()=>{if(current==='system')show('system')});
 window.addEventListener('tcos-control-category',e=>{const cat=e.detail?.category;if(categories.some(c=>c[0]===cat))show(cat)});
 show('system');return wrap;
}
