import {VERSION,boot,icon,tr,localized,formatDate,getPreferences,setPreferences,openSafeURL,programTitle,getDisabledPrograms,setDisabledPrograms,getFavoriteIds,toggleFavorite} from './core.js?v=175';
import {TerminalUI} from './terminal-ui.js?v=175';
import {makePersonalization} from './apps/personalization.js?v=175';
import {makeRecycleBin} from './apps/recycle-bin.js?v=175';
import {makeControlPanel} from './apps/control-panel.js?v=175';
const el=(tag,cls='',text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
const button=(txt,fn,cls='sys-button')=>{const n=el('button',cls,txt);n.type='button';n.addEventListener('click',fn);return n};
const kv=(name,value)=>{const n=el('div','sys-kv');n.append(el('span','',name),el('span','',String(value??'—')));return n};
export function createApp(entry,ctx){
 if(entry.type==='page')return makePage(entry);
 switch(entry.id){
  case 'system-info':return makeSystemInfo(ctx);
  case 'explorer':return makeExplorer(ctx);
  case 'help':return makeHelp(ctx);
  case 'terminal':return makeTerminal(ctx);
  case 'notepad':return makeNotepad(ctx);
  case 'boot-logs':return makeLogs(ctx);
  case 'settings':return makeControlPanel(ctx);
  case 'personalization':return makePersonalization(ctx);
  case 'recycle-bin':return makeRecycleBin(ctx);
  case 'software-center':return makeSoftwareCenter(ctx);
  default:{const n=el('div','sys-app');n.append(el('p','sys-error',tr('Aplicación aún no instalada.','Application not installed yet.')));return n}
 }
}
function makePage(entry){
 const wrap=el('div','explorer');
 const page=el('iframe');const src=String(entry.url||'');page.src=entry.id==='calculator'?src+(src.includes('?')?'&':'?')+'patch=174-scientific':src;page.title=localized(entry.name);page.loading='eager';
 page.style.cssText='flex:1;width:100%;min-height:0;border:0;background:#070708';
 wrap.append(page);return wrap;
}
function makeSystemInfo(ctx){
 const wrap=el('div','sys-app');const header=el('div','about-hero');const logo=el('div','about-logo','TC');const body=el('div');
 body.append(el('h2','',`TC/OS Professional`),el('small','',`Version ${VERSION}  ·  TCardell Headquarters`),el('div','sys-success',tr('Sistema operativo TC/OS · en línea','TC/OS operating system · online')));
 header.append(logo,body);wrap.append(header);
 const tabs=el('div','sys-tabbar'),area=el('div');wrap.append(tabs,area);
 const b=boot();
 const items=[
  {name:tr('General','General'),draw:()=>{
    area.append(el('div','sys-section-title',tr('Infraestructura TC-HQ','TC-HQ infrastructure')));
    [['OS','TC/OS Professional'],['Build',VERSION],['Host','tc-hq-mainframe'],[tr('Cuenta','Account'),'guest / PUBLIC_GUEST'],[tr('Estado','Status'),'ONLINE'],['CPU','TC Core'],['RAM','16384 MiB']].forEach(pair=>area.append(kv(...pair)));
  }},
  {name:tr('Equipo visitante','Client'),draw:()=>{
    area.append(el('div','sys-section-title',tr('Datos comunicados por tu navegador','Information reported by your browser')));
    [[tr('Idioma','Language'),navigator.language],[tr('Idiomas preferidos','Preferred languages'),(navigator.languages||[]).join(', ')],[tr('Pantalla','Screen'),`${screen.width} × ${screen.height}`],[tr('Ventana','Viewport'),`${innerWidth} × ${innerHeight}`],[tr('Núcleos lógicos (aprox.)','Logical cores (approx.)'),navigator.hardwareConcurrency??tr('No disponible','Unavailable')],[tr('Conexión','Connection'),navigator.onLine?tr('Navegador conectado','Browser reports online'):tr('Sin conexión','Browser reports offline')],[tr('Fecha local','Local date'),formatDate()],[tr('Plataforma declarada','Reported platform'),navigator.platform||tr('No disponible','Unavailable')]].forEach(pair=>area.append(kv(...pair)));
  }},
  {name:tr('Sesión','Session'),draw:()=>{
    area.append(el('div','sys-section-title',tr('Último arranque de TC-HQ','Last TC-HQ boot')));
    [['Boot mode',b?.mode?.toUpperCase()||'—'],[tr('Inicio','Started'),b?.timestamp||'—'],[tr('Idioma de arranque','Boot language'),b?.lang||'—'],[tr('Eventos registrados','Logged events'),b?.lines?.length??0],[tr('Destino','Destination'),b?.destination||'—']].forEach(pair=>area.append(kv(...pair)));
  }}
 ];
 function setTab(idx){tabs.replaceChildren();area.replaceChildren();items.forEach((t,i)=>{const b=button(t.name,()=>setTab(i),'sys-tab'+(idx===i?' active':''));b.setAttribute('aria-pressed',idx===i?'true':'false');tabs.append(b)});items[idx].draw()}
 setTab(0);return wrap;
}
function makeExplorer(ctx){
 const wrap=el('div','explorer');const top=el('div','explorer-top'),toolbar=el('div','sys-toolbar'),address=el('input','sys-input explorer-path'),files=el('div','explorer-files'),status=el('div','sys-status');
 let cwd=ctx.options?.path==='/favorites'?'/favorites':ctx.options?.path&&ctx.fs.isDir(ctx.options.path)?ctx.options.path:'/home/guest';
 let backward=[],forward=[];
 const backBtn=button('←',()=>{if(backward.length){forward.push(cwd);render(backward.pop(),false)}});
 const forwardBtn=button('→',()=>{if(forward.length){backward.push(cwd);render(forward.pop(),false)}});
 const upBtn=button('↑',()=>{if(cwd==='/favorites')render('/srv/programs');else navigate(ctx.fs.normalize('..',cwd))});
 const homeBtn=button('⌂',()=>navigate('/home/guest'));
 const favBtn=button('★ '+tr('Favoritos','Favorites'),()=>navigate('/favorites'));
 const go=button(tr('Ir','Go'),()=>navigate(address.value.trim(),true));
 for(const b of [backBtn,forwardBtn,upBtn,homeBtn]){b.style.minWidth='29px';b.style.padding='5px';b.setAttribute('aria-label',b===backBtn?tr('Atrás','Back'):b===forwardBtn?tr('Adelante','Forward'):b===upBtn?tr('Subir','Up'):tr('Inicio','Home'))}
 address.type='text';address.spellcheck=false;address.setAttribute('aria-label',tr('Ruta del directorio','Directory path'));address.placeholder='/srv/programs/';
 address.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();navigate(address.value.trim(),true)}if(e.key==='Escape'){address.value=cwd;address.blur()}});
 toolbar.append(backBtn,forwardBtn,upBtn,homeBtn,favBtn,el('label','sys-muted',tr('Dirección','Address')+':'),address,go);
 top.append(toolbar);wrap.append(top,files,status);
 function navigate(input,fromAddress=false){
  const proposed=input==='/favorites'?'/favorites':ctx.fs.normalize(input||'.',cwd==='/favorites'?'/srv/programs':cwd);
  if(proposed!=='/favorites'&&!ctx.fs.isDir(proposed)){
   status.textContent=tr('Ruta no encontrada: ','Path not found: ')+proposed;
   status.classList.add('sys-error');if(fromAddress)address.select();return false;
  }
  if(proposed!==cwd){backward.push(cwd);forward=[]}render(proposed,false);return true;
 }
 function open(item){if(item.dir){navigate(item.path);return}if(item.program){ctx.openProgram(item.program);return}
  const txt=ctx.fs.read(item.path);if(item.path.startsWith('/home/guest/notes/'))ctx.openProgram(ctx.catalog.find(p=>p.id==='notepad'),{file:item.name});else ctx.openText(item.name,txt??'')}
 function render(path,record=true){if(path!=='/favorites'&&!ctx.fs.isDir(path))return;
  if(record&&cwd!==path){backward.push(cwd);forward=[]}cwd=path;address.value=path;files.replaceChildren();status.classList.remove('sys-error');
  const its=path==='/favorites'?[...getFavoriteIds()].map(id=>ctx.catalog.find(p=>p.id===id)).filter(Boolean).filter(p=>!p.id.startsWith('admin-')).map(p=>({name:p.id,label:localized(p.name),program:p,dir:false,path:'/favorites/'+p.id}))
   :(ctx.fs.list(path)||[]).filter(x=>getPreferences().showHidden||!x.name.startsWith('.'));
  for(const item of its){
   const btn=el('button','file-icon');btn.type='button';btn.title=item.name;btn.innerHTML=icon(item.dir?'folder':item.program?item.program.icon:'file',37);
   const label=item.program||item.folder?item.label:(getPreferences().showExtensions?(item.label||item.name):String(item.label||item.name).replace(/\.[^.]+$/,''));btn.append(el('span','',label));
   btn.addEventListener('click',()=>open(item));
   if(item.program){btn.draggable=!item.program.id.startsWith('admin-');btn.addEventListener('dragstart',e=>{if(item.program.id.startsWith('admin-')){e.preventDefault();return}e.dataTransfer.setData('application/x-tcos-shortcut','p:'+item.program.id);e.dataTransfer.effectAllowed='copy'});btn.addEventListener('contextmenu',e=>{e.preventDefault();ctx.showProgramContext?.(e,item.program)});}
   else if(item.folder){btn.draggable=item.folder.id!=='administration';btn.addEventListener('dragstart',e=>{if(item.folder.id==='administration'){e.preventDefault();return}e.dataTransfer.setData('application/x-tcos-shortcut','f:'+item.folder.id);e.dataTransfer.effectAllowed='copy'});btn.addEventListener('contextmenu',e=>{e.preventDefault();ctx.showFolderContext?.(e,item.folder)});}
   files.append(btn);
  }
  if(!its.length)files.append(el('p','sys-muted',tr('Esta carpeta está vacía.','This folder is empty.')));
  status.textContent=tr('Elementos: ','Items: ')+its.length;
  backBtn.disabled=!backward.length;forwardBtn.disabled=!forward.length;
 }
 render(cwd,false);
 const onChange=()=>render(cwd,false);
 window.addEventListener('tcos-files-changed',onChange);window.addEventListener('tcos-programs-changed',onChange);
 window.addEventListener('tcos-favorites-changed',onChange);window.addEventListener('tcos-favorites-view',()=>navigate('/favorites'));window.addEventListener('tcos-preferences',onChange);
 window.addEventListener('tcos-explore',e=>{if(ctx.fs.isDir(e.detail?.path))navigate(e.detail.path)});
 return wrap;
}
function makeHelp(ctx){
 const wrap=el('div','sys-app help-app');
 wrap.append(el('h2','',tr('Centro de ayuda de TC/OS','TC/OS Help Center')));
 const intro=el('p','sys-note',tr(
  'Bienvenido a TC-HQ. Estás en TC/OS Professional: un entorno con escritorio, ventanas, programas, carpetas y consola de comandos. Hay mucho por descubrir. Empieza por Inicio o el Explorador y explora sin prisa.',
  'Welcome to TC-HQ and TC/OS Professional: a complete desktop with windows, programs, folders and a command console. There is plenty to discover. Start with the Start menu or File Explorer and take a look around.'
  ));wrap.append(intro);
 const quick=el('div','sys-toolbar');
 const quickAccess=[
  ['explorer',tr('Explorador','File Explorer')],['software-center',tr('Programas','Programs')],
  ['personalization',tr('Personalización','Personalization')],['settings',tr('Panel de control','Control Panel')],['terminal',tr('Terminal','Terminal')]
 ];
 for(const [id,label] of quickAccess){const b=button(label,()=>{const program=ctx.catalog.find(p=>p.id===id);if(program)ctx.openProgram(program)});quick.append(b)}
 wrap.append(quick);
 const tabs=el('div','sys-tabbar'),area=el('div','help-text');wrap.append(tabs,area);
 const chapters=[
  {title:tr('Primeros pasos','Getting started'),intro:tr('TC-HQ reúne herramientas, utilidades, contenidos y proyectos para explorar. No necesitas aprenderlo todo de golpe.','TC-HQ brings together tools, utilities, content and projects. There is no need to learn everything at once.'),items:[
   [tr('¿Por dónde empiezo?','Where to begin'),tr('Pulsa Inicio para ver las categorías de programas. Abre el Explorador para recorrer las carpetas y descubrir aplicaciones, actividades y proyectos.','Open Start for program categories or File Explorer to browse folders and discover applications, activities and projects.')],
   [tr('Abrir un programa','Opening a program'),tr('En Inicio y el Explorador basta con pulsar la aplicación. En el escritorio se abren los accesos según la preferencia de uno o dos clics del Panel de control.','Click an application in Start or File Explorer. Desktop icons use the single- or double-click preference selected in Control Panel.')],
   [tr('Dónde se abre','Where it opens'),tr('Algunos programas se abren en una ventana de TC/OS, otros en una pestaña y otros te preguntan. En el menú contextual puedes elegir la apertura cuando esté disponible.','Programs can open in a TC/OS window, in a new tab or after asking. Their context menus provide a choice where supported.')],
   [tr('Seguir explorando','Keep exploring'),tr('Visita las herramientas, el calendario, el reloj, el reproductor musical, la calculadora científica y los proyectos. El catálogo puede ir creciendo con nuevas aplicaciones.','Explore the tools, calendar, clock, music player, scientific calculator and projects. New applications can join the catalog over time.')]
  ]},
  {title:tr('Escritorio y ventanas','Desktop & windows'),items:[
   [tr('Escritorio','Desktop'),tr('Los iconos son accesos directos. Puedes moverlos por la cuadrícula, colocarlos donde prefieras y ordenarlos desde el menú contextual del escritorio.','Desktop icons are shortcuts. Arrange them on the desktop grid and use the desktop context menu to sort them.')],
   [tr('Cambiar nombre','Rename shortcuts'),tr('Selecciona un acceso directo y pulsa F2, o utiliza clic derecho → Cambiar nombre. Solo cambia el nombre del acceso directo, no el nombre original del programa.','Select a shortcut and press F2, or right-click and choose Rename. This changes the shortcut label, not the program name.')],
   [tr('Ventanas','Windows'),tr('Arrastra una ventana por su barra de título. Usa los controles de la esquina superior para minimizarla, maximizarla o cerrarla. Algunas ventanas pueden redimensionarse arrastrando sus bordes.','Drag a window by its title bar. Use the top-right controls to minimize, maximize or close it. Some windows can be resized by dragging their edges.')],
   [tr('Barra de tareas','Taskbar'),tr('La barra inferior muestra las ventanas abiertas. Pulsa un botón para activar o minimizar una ventana. Haz clic derecho sobre un botón para Restaurar, Minimizar, Maximizar o Cerrar.','The bottom taskbar lists open windows. Click a task to activate or minimize it; right-click a task for Restore, Minimize, Maximize or Close.')],
   [tr('Reloj y calendario','Clock & calendar'),tr('Pulsa la hora de la barra de tareas para abrir el reloj y pulsa la fecha para consultar el calendario.','Click the taskbar time to open the clock, or the date to open the calendar.')]
  ]},
  {title:tr('Explorador','File Explorer'),items:[
   [tr('Navegar por carpetas','Browse folders'),tr('Las carpetas pueden contener otras carpetas y programas. Abre cualquier carpeta para continuar explorando y utiliza los botones Atrás, Adelante, Arriba e Inicio para navegar.','Folders can hold subfolders and programs. Open any folder to continue browsing, and use Back, Forward, Up and Home for navigation.')],
   [tr('Barra de direcciones','Address bar'),tr('Escribe una ruta, como /srv/programs/education/chemistry, y pulsa Intro. También puedes copiar una ruta para volver más adelante.','Enter a path such as /srv/programs/education/chemistry and press Enter. You can copy paths to revisit them later.')],
   [tr('Favoritos','Favorites'),tr('Haz clic derecho en un programa y elige Añadir a favoritos. Encontrarás tus favoritos en Inicio y en la vista Favoritos del Explorador.','Right-click a program and choose Add to favorites. Your favorites appear in Start and in File Explorer’s Favorites view.')],
   [tr('Propiedades','Properties'),tr('El menú contextual de un programa ofrece Propiedades: nombre, descripción, carpeta, icono, comando y, en su caso, modo de apertura.','Use a program’s context menu to view Properties: name, description, directory, icon, command and, where applicable, opening mode.')]
  ]},
  {title:tr('Programas y notas','Programs & notes'),items:[
   [tr('Catálogo de programas','Program catalog'),tr('En el Gestor de programas puedes consultar las aplicaciones disponibles. También aparecen repartidas por categorías en Inicio y el Explorador.','Browse available applications in the Program Manager. You can also find them under their categories in Start and File Explorer.')],
   [tr('Calculadora científica','Scientific calculator'),tr('La calculadora TC-HQ Scientific reúne teclados científicos, ecuaciones, matrices, cálculo, unidades, constantes y utilidades de laboratorio. Utiliza sus propios menús y ajustes.','TC-HQ Scientific includes scientific keypads, equations, matrices, calculus, unit conversions, constants and laboratory tools. It has its own menus and settings.')],
   [tr('Reproductor musical','Music player'),tr('El reproductor permite escuchar música y seleccionar archivos de audio. Los controles de reproducción y volumen están dentro de la aplicación.','The music player lets you listen to music and select audio files. Playback and volume controls are inside the app.')],
   [tr('Bloc de notas','Notepad'),tr('Crea y guarda tus notas desde el Bloc de notas. Puedes abrirlas de nuevo desde la lista de documentos y exportarlas como archivo de texto.','Create and save notes in Notepad. Reopen them from the saved-note list or export them as text files.')],
   [tr('Accesos directos','Shortcuts'),tr('Puedes añadir programas y carpetas al escritorio desde sus menús contextuales o arrastrarlos desde el Explorador. Quitar un acceso directo no desinstala su programa.','Add programs and folders to the desktop through context menus or by dragging from File Explorer. Removing a shortcut does not uninstall its program.')]
  ]},
  {title:tr('Terminal','Terminal'),items:[
   [tr('Consola de comandos','Command console'),tr('TC/OS incluye una terminal integrada y una consola de pantalla completa. Abre Terminal desde Inicio o el Explorador, o entra en Consola completa desde Inicio.','TC/OS includes an integrated terminal and a full-screen console. Open Terminal from Start or File Explorer, or choose Full-screen console from Start.')],
   [tr('Primeros comandos','First commands'),tr('Escribe help para ver la ayuda de la consola; prueba pwd para conocer tu ruta actual, ls para listar y cd para cambiar de carpeta.','Type help for command help; try pwd to see the current path, ls to list items and cd to change directories.')],
   [tr('Explorar en profundidad','Explore further'),tr('Prueba tree para dibujar carpetas, find para localizar elementos, cat para leer textos y man para consultar instrucciones. La terminal reconoce también comandos de aplicaciones.','Try tree to see folder structures, find to locate items, cat to read text and man for instructions. The terminal also recognizes application commands.')],
   [tr('Volver al escritorio','Return to desktop'),tr('Desde la consola completa, utiliza startx para regresar al escritorio. En la terminal integrada puedes minimizar su ventana como cualquier otra.','In the full-screen console, use startx to return to the desktop. The integrated terminal can be minimized like any other window.')],
   [tr('Personalizar la terminal','Terminal appearance'),tr('En Panel de control → Terminal puedes modificar tamaño de letra, tipo de cursor, historial y número de líneas visibles.','In Control Panel → Terminal, adjust font size, cursor type, command history and scrollback length.')]
  ]},
  {title:tr('Personalización','Personalization'),items:[
   [tr('Temas completos','Full themes'),tr('En Personalización → Temas puedes elegir distintos estilos de TC/OS, incluidos TC-HQ Black, Phosphor, Midnight, Classic y Synthwave. Cambian ventanas, menús, controles y terminal.','Choose TC/OS themes in Personalization → Themes, including TC-HQ Black, Phosphor, Midnight, Classic and Synthwave. They change windows, menus, controls and terminal.')],
   [tr('Fondos de escritorio','Wallpapers'),tr('Elige un fondo independientemente del tema. Algunos fondos son dinámicos y tienen movimiento de estrellas o luces neón. Puedes desactivar esas animaciones.','Choose a wallpaper independently of the theme. Some wallpapers feature animated stars or neon effects; you can disable their motion.')],
   [tr('Cursor y efectos CRT','Cursor & CRT effects'),tr('Personaliza el puntero, activa o desactiva la cuadrícula y experimenta con las líneas CRT para conseguir un estilo más clásico.','Customize the pointer, desktop grid and subtle CRT scanlines for a more classic look.')],
   [tr('Iconos del escritorio','Desktop icons'),tr('Puedes conservar un escritorio sencillo, mostrar todas las aplicaciones o comenzar con el escritorio vacío. Después podrás añadir o recolocar accesos.','Keep a simple desktop, display all applications or start with an empty desktop. Add and rearrange shortcuts whenever you like.')],
   [tr('Salvapantallas','Screensaver'),tr('Elige entre reloj digital, logotipo TC-HQ o estrellas; configura la espera, actívalo o desactívalo y utiliza Vista previa para probarlo.','Choose a digital clock, TC-HQ logo or stars; set the idle time, enable or disable the screensaver and use Preview to try it.')]
  ]},
  {title:tr('Audio','Sound'),items:[
   [tr('Sonidos del sistema','System sounds'),tr('TC/OS incorpora efectos sonoros para botones y ventanas. Abre Panel de control → Sonido para activar o silenciar los efectos.','TC/OS has sound cues for buttons and windows. Open Control Panel → Sound to enable or mute these effects.')],
   [tr('Control de volumen','Volume controls'),tr('Ajusta por separado el volumen general y el volumen de efectos. Utiliza Probar sonido para comprobar los cambios.','Adjust master volume and effects volume separately. Use Test sound to hear your changes.')],
   [tr('¿No se escucha nada?','No sound?'),tr('Comprueba que los sonidos estén activados y el volumen no esté a cero. En algunos dispositivos, el audio se activa tras una primera pulsación o interacción.','Check that sounds are enabled and the volume is above zero. On some devices sound activates after your first click or interaction.')],
   [tr('Música y efectos','Music & effects'),tr('El volumen del reproductor musical se controla desde su propia ventana; los efectos del sistema tienen sus ajustes independientes.','Music playback is controlled from the player window; system sound effects have separate settings.')]
  ]},
  {title:tr('Ajustes y memoria','Settings & saving'),items:[
   [tr('Panel de control','Control Panel'),tr('Agrupa los ajustes de ventanas, terminal, archivos, inicio, idioma, sonido, accesibilidad, almacenamiento y programas.','Find settings for windows, terminal, files, startup, language, sound, accessibility, storage and programs.')],
   [tr('Idioma y fecha','Language & date'),tr('Puedes elegir idioma automático, español o inglés, formato de 12 o 24 horas y primer día de la semana.','Choose automatic language, Spanish or English, 12- or 24-hour time and the first day of the week.')],
   [tr('Preferencias guardadas','Saved preferences'),tr('Los temas, fondos, accesos directos, favoritos, volumen y muchos otros ajustes se conservan al cerrar el navegador y volver a entrar desde el mismo dispositivo y perfil.','Themes, wallpapers, shortcuts, favorites, volume and many other settings persist after closing your browser when you return using the same device and profile.')],
   [tr('Notas y almacenamiento','Notes & storage'),tr('Tus notas y preferencias tienen su propio espacio de almacenamiento. En Panel de control → Almacenamiento puedes restablecer la apariencia si deseas empezar de nuevo.','Your notes and preferences have their own storage. In Control Panel → Storage, you can reset your appearance if you want a fresh start.')],
   [tr('Inicio de TC-HQ','TC-HQ startup'),tr('Puedes escoger entre un arranque completo, rápido o sin animación, además del destino inicial.','Choose a full, quick or animation-free startup sequence and configure the starting destination.')],
   [tr('Accesibilidad','Accessibility'),tr('Utiliza Reducir movimiento si prefieres una interfaz más tranquila. También puedes modificar colores, temas y tamaños de texto de la terminal.','Enable Reduce motion for a calmer interface. You can also adjust colors, themes and terminal text size.')]
  ]},
  {title:tr('Atajos de teclado','Keyboard shortcuts'),intro:tr(
   'IMPORTANTE: algunas teclas están reservadas por el navegador o el sistema operativo de tu dispositivo. Por eso ciertos atajos pueden no funcionar, aunque aparezcan en esta lista. Además, muchos requieren que el escritorio tenga el foco: no funcionarán mientras escribas en un campo o uses una aplicación integrada. Siempre puedes recurrir a Inicio, los iconos y los menús.',
   'IMPORTANT: some keys are reserved by your browser or your device’s operating system. As a result, some shortcuts might not work even when listed here. Many require focus on the desktop rather than a text field or an embedded app. You can always use Start, desktop icons and menus instead.'
  ),items:[
   ['F1',tr('Intentar abrir Ayuda. A menudo abre la ayuda del navegador y no puede capturarse.','Try to open Help. Often reserved for browser help and cannot be intercepted.')],
   ['F2',tr('Renombrar el acceso directo seleccionado en el escritorio.','Rename the selected desktop shortcut.')],
   ['Ctrl + Alt + E',tr('Abrir Explorador, si el sistema permite esta combinación.','Open File Explorer if the key combination is available.')],
   ['Ctrl + Alt + T',tr('Abrir la terminal integrada, si la combinación no está reservada.','Open the integrated terminal, unless the combination is reserved.')],
   ['Ctrl + Alt + F',tr('Abrir la carpeta Favoritos en el Explorador.','Open Favorites in File Explorer.')],
   ['Ctrl + Alt + M',tr('Minimizar las ventanas y mostrar el escritorio.','Minimize windows and show the desktop.')],
   ['Alt + Tab',tr('Puede alternar las ventanas del dispositivo en lugar de las de TC/OS. Usa la barra de tareas como alternativa.','May switch device windows rather than TC/OS windows. Use the taskbar instead.')],
   ['Esc',tr('Cerrar menús y algunos cuadros de diálogo de TC/OS.','Close menus and certain TC/OS dialogs.')],
   [tr('Atajos propios de aplicaciones','Application shortcuts'),tr('Algunas aplicaciones tienen combinaciones particulares, distintas de las del escritorio. Consulta sus respectivas ayudas.','Some applications have their own shortcuts. Check their individual help pages.')]
  ]}
 ];
 let active=0;
 function draw(index){active=index;tabs.replaceChildren();area.replaceChildren();
  chapters.forEach((chapter,j)=>{const b=button(chapter.title,()=>draw(j),'sys-tab'+(j===index?' active':''));b.setAttribute('aria-pressed',j===index?'true':'false');tabs.append(b)});
  const chapter=chapters[index];area.append(el('h3','',chapter.title));if(chapter.intro)area.append(el('p','sys-note',chapter.intro));
  for(const [title,body] of chapter.items){area.append(el('h3','',title),el('p','',body))}
 }
 draw(0);return wrap;
}

function makeNotepad(ctx){
 const wrap=el('div','editor'),top=el('div','editor-top'),filename=el('input','sys-input'),area=el('textarea'),status=el('div','sys-status');
 filename.value=ctx.options?.file||'Notes.txt';filename.title=tr('Nombre de archivo terminado en .txt','Filename ending in .txt');filename.setAttribute('aria-label',tr('Nombre de archivo','Filename'));
 area.setAttribute('aria-label',tr('Contenido de la nota','Note contents'));area.spellcheck=false;
 const loadName=name=>{filename.value=name;area.value=ctx.fs.notes[name]||'';status.textContent=tr('Nota abierta: ','Opened note: ')+name};
 loadName(filename.value);
 const save=()=>{try{const name=ctx.fs.saveNote(filename.value,area.value);status.textContent=tr('Guardado localmente: ','Saved in this browser: ')+name;filename.value=name}catch(e){status.textContent=e.message}};
 const newNote=()=>{filename.value='Notes.txt';area.value='';status.textContent=tr('Documento nuevo','New document')};
 const exportNote=()=>{const blob=new Blob([area.value],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=el('a');a.href=url;a.download=filename.value||'Notes.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
 const saved=el('select','sys-select');saved.style.maxWidth='140px';saved.setAttribute('aria-label',tr('Notas guardadas','Saved notes'));
 const listNotes=()=>{saved.replaceChildren();const option=el('option','',tr('Abrir nota...','Open note...'));option.value='';saved.append(option);ctx.fs.noteNames().forEach(n=>{const opt=el('option','',n);opt.value=n;saved.append(opt)})};
 listNotes();saved.addEventListener('change',()=>{if(saved.value)loadName(saved.value)});
 const saveBtn=button(tr('Guardar','Save'),()=>{save();listNotes()}),newBtn=button(tr('Nuevo','New'),newNote),exportBtn=button(tr('Exportar .txt','Export .txt'),exportNote);
 top.append(filename,saveBtn,newBtn,exportBtn,saved);wrap.append(top,area,status);status.textContent=tr('Las notas se guardan solo en este navegador. Ctrl+S guarda.','Notes are saved only in this browser. Ctrl+S saves.');
 area.addEventListener('keydown',e=>{if(e.ctrlKey&&e.key.toLowerCase()==='s'){e.preventDefault();save();listNotes()}});
 return wrap;
}
function makeLogs(){const wrap=el('div','sys-app'),buttons=el('div','sys-toolbar'),logview=el('pre','log-view');wrap.append(buttons,logview);
 const refresh=()=>{const b=boot();logview.textContent=b?`[ TC-HQ / BOOT ${b.mode?.toUpperCase()||'UNKNOWN'} ]\n${b.timestamp||''}\n${(b.lines||[]).join('\n')}`:tr('No hay registro de arranque guardado en esta sesión.','No saved boot log for this session.')};
 buttons.append(button(tr('Actualizar','Refresh'),refresh),button(tr('Reiniciar conexión','Reconnect'),()=>{location.href='index.html'}));refresh();return wrap;}
function makeSoftwareCenter(ctx){
 const wrap=el('div','sys-app software-center');
 wrap.append(el('h2','',tr('Gestor de programas TC-HQ','TC-HQ Software Manager')),
  el('p','sys-muted',tr('Descubre las aplicaciones de TC-HQ. Desde aquí puedes activar o desactivar cuáles estarán disponibles en tu espacio de trabajo.','Discover the applications available in TC-HQ. Enable or disable the ones you want in your workspace.')));
 const toolbar=el('div','sys-toolbar'),query=el('input','sys-input');query.placeholder=tr('Buscar programas...','Search programs...');query.style.maxWidth='300px';query.setAttribute('aria-label',query.placeholder);toolbar.append(query);wrap.append(toolbar);
 const list=el('div','software-list'),status=el('div','sys-status');wrap.append(list,status);
 const installed=()=>getDisabledPrograms();
 const persist=disabled=>setDisabledPrograms(disabled);
 const draw=()=>{
  list.replaceChildren();let total=0;const disabled=installed();
  for(const p of ctx.catalog){const name=localized(p.name),search=(name+' '+localized(p.description)).toLowerCase();if(!search.includes(query.value.trim().toLowerCase()))continue;total++;
   const row=el('div','software-entry'),glyph=el('div','software-icon'),info=el('div','software-desc'),actions=el('div','software-actions');glyph.innerHTML=icon(p.icon,30);
   info.append(el('strong','',name),el('small','sys-muted',localized(p.description)||p.id));
   const state=disabled.has(p.id)?tr('Deshabilitada localmente','Locally disabled'):tr('Disponible','Available');info.append(el('small',disabled.has(p.id)?'tone-amber':'tone-green',state));
   const open=button(tr('Abrir','Open'),()=>ctx.openProgram(p));open.disabled=disabled.has(p.id);
   actions.append(open);
   if(!['software-center','settings','personalization','recycle-bin'].includes(p.id)){
    const toggle=button(disabled.has(p.id)?tr('Instalar','Install'):tr('Quitar','Remove'),()=>{if(disabled.has(p.id))disabled.delete(p.id);else disabled.add(p.id);persist(disabled);draw()});
    actions.append(toggle);
   }
   row.append(glyph,info,actions);list.append(row);
  }
  status.textContent=tr('Programas encontrados: ','Programs found: ')+total;
 };
 query.addEventListener('input',draw);draw();return wrap;
}
function makeTerminal(ctx){const node=el('div','tcos-terminal');new TerminalUI({host:node,fs:ctx.fs,catalog:ctx.catalog,onProgram:p=>ctx.openProgram(p),onGUI:()=>ctx.minimizeSelf(),onReboot:()=>location.href='index.html'});return node;}
export function makeTextViewer(name,content){const wrap=el('div','sys-app'),header=el('h2','',name),text=el('pre','log-view',content);wrap.append(header,text);return wrap}
