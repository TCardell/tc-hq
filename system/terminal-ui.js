import {lang,tr,localized,programByName,boot,formatDate,icon,VERSION,getDisabledPrograms,getPreferences,safeGet,safeSet} from './core.js?v=174';
import {calculate} from './math.js?v=174';
export class TerminalUI {
 constructor({host,fs,catalog,onProgram,onGUI,onReboot,standalone=false}){
  this.host=host;this.fs=fs;this.catalog=catalog;this.onProgram=onProgram;this.onGUI=onGUI;this.onReboot=onReboot;this.standalone=standalone;
  this.cwd='/home/guest';this.history=getPreferences().termHistory?safeGet('terminal-history',[]):[];if(!Array.isArray(this.history))this.history=[];this.historyIndex=this.history.length;this.currentInput=null;this.inputCount=0;
  this.host.classList.add('tcos-terminal');this.host.setAttribute('role','region');this.host.setAttribute('aria-label','TC/OS terminal');
  this.print(`TC/OS Terminal ${VERSION} / guest@tc-hq`,'green');
  this.print(tr('Sesión iniciada. Escribe help para consultar los comandos.','Session started. Type help for available commands.'),'muted');
  this.print('');this.newPrompt();
  this.host.addEventListener('pointerdown',e=>{if(!e.target.closest('button, a, input, textarea'))this.focus()});
 }
 focus(){this.currentInput?.focus({preventScroll:true})}
 print(message='',tone=''){
  for(const line of String(message).split('\n')){const node=document.createElement('div');node.className='term-line'+(tone?' tone-'+tone:'');node.textContent=line;this.host.append(node)}
  const max=getPreferences().termScrollback||1000;while(this.host.children.length>max)this.host.firstElementChild?.remove();this.scroll();
 }
 scroll(){this.host.scrollTop=this.host.scrollHeight}
 newPrompt(){
  const row=document.createElement('div');row.className='term-prompt';
  const user=document.createElement('span');user.className='term-user';user.textContent=window.__tcosAdmin?'admin@tc-hq':'guest@tc-hq';
  const path=document.createElement('span');path.className='term-path';path.textContent=':'+this.cwd.replace(/^\/home\/guest/,'~');
  const dollar=document.createElement('span');dollar.textContent=window.__tcosAdmin?'#':'$';dollar.className='term-dollar';
  const input=document.createElement('input');input.className='term-input';input.autocomplete='off';input.spellcheck=false;input.autocapitalize='off';input.autocorrect='off';input.setAttribute('aria-label',tr('Introduce un comando','Enter command'));input.setAttribute('aria-autocomplete','list');
  row.append(user,path,dollar,input);this.host.append(row);this.currentInput=input;this.scroll();
  // A blinking caret travels with the insertion point; no static background image.
  const caret=document.createElement('span');caret.className='term-caret';caret.setAttribute('aria-hidden','true');row.append(caret);
  const updateCursor=()=>{
   const style=getPreferences().termCursor||'underline';
   caret.textContent=style==='bar'?'│':style==='block'?'█':'_';
   if(document.activeElement!==input){caret.style.display='none';return}
   caret.style.display='block';
   try{
    const cs=getComputedStyle(input),canvas=document.createElement('canvas'),cx=canvas.getContext('2d');
    cx.font=cs.font;
    const text=input.value.slice(0,input.selectionStart??input.value.length);
    const x=cx.measureText(text).width-input.scrollLeft;
    caret.style.left=Math.max(0,Math.min(input.offsetLeft+x,input.offsetLeft+input.clientWidth-10))+'px';
   }catch{caret.style.left=input.offsetLeft+'px'}
  };
  for(const event of ['input','click','keyup','focus','blur','scroll'])input.addEventListener(event,updateCursor);
  input.addEventListener('keydown',e=>this.onKey(e,input));
  queueMicrotask(updateCursor);
  if(!this.standalone || this.inputCount===0)input.focus({preventScroll:true});
 }
 onKey(e,input){
  if(e.key==='Enter'){
   e.preventDefault();const command=input.value;const old=document.createElement('span');old.className='term-echo';old.textContent=command;input.replaceWith(old);this.currentInput=null;
   if(command.trim()){this.history.push(command);this.history=this.history.slice(-100);this.historyIndex=this.history.length;if(getPreferences().termHistory)safeSet('terminal-history',this.history)}
   const keep=this.execute(command);this.inputCount++;
   if(keep!==false){this.newPrompt();this.focus()}
   return;
  }
  if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();if(!this.history.length)return;this.historyIndex=e.key==='ArrowUp'?Math.max(0,this.historyIndex-1):Math.min(this.history.length,this.historyIndex+1);input.value=this.history[this.historyIndex]||'';input.setSelectionRange(input.value.length,input.value.length)}
  if(e.key==='Tab'){e.preventDefault();const fragment=input.value.trim();if(!fragment.includes(' ')){const commands=['help','ls','cd','pwd','cat','whoami','uname','date','uptime','echo','clear','status','about','startx','reboot','exit','apps','open','calc','sysinfo','logs','history','neofetch','nano','folders','software','tree','find','grep','head','tail','wc','which','man','admin','su','exit-admin'];const matches=commands.filter(x=>x.startsWith(fragment));if(matches.length===1)input.value=matches[0]+' '}
   else {const parts=input.value.match(/^(\S+)\s+(.*)$/);if(parts&&['cd','ls','cat','tree','head','tail','wc','find','grep'].includes(parts[1])){
    const typed=parts[2],slash=typed.lastIndexOf('/'),folder=slash===-1?'.':(typed.slice(0,slash)||'/'),fragment=typed.slice(slash+1),path=this.fs.normalize(folder,this.cwd);
    const matches=(this.fs.list(path)||[]).filter(f=>f.name.startsWith(fragment));if(matches.length===1){const m=matches[0];input.value=parts[1]+' '+(slash===-1?'':typed.slice(0,slash+1))+m.name+(m.dir?'/':' ')}
   }}}
  if(e.ctrlKey&&e.key.toLowerCase()==='l'){e.preventDefault();this.host.textContent='';this.newPrompt()}
  if(e.ctrlKey&&e.key.toLowerCase()==='c'){e.preventDefault();input.value='';this.print('^C','muted')}
 }
 parse(raw){return raw.trim().match(/(?:"(?:[^"\\]|\\.)*"|'[^']*'|\S+)/g)?.map(x=>x.replace(/^(?:'|")|(?:'|")$/g,''))||[]}
 execute(raw){
  if(raw.includes('|'))return this.executePipeline(raw);
  const args=this.parse(raw),command=args.shift()?.toLowerCase();if(!command)return true;
  const parameter=args.join(' ');
  switch(command){
   case 'admin':case 'su':{if(this.standalone){location.href='home.html?admin=1';return false}window.dispatchEvent(new Event('tcos-admin-request'));this.print(tr('Solicitando acceso de administrador...','Requesting administrator access...'),'muted');break}
   case 'exit-admin':window.dispatchEvent(new Event('tcos-admin-logout'));this.print(tr('Sesión administrativa cerrada.','Administrative session ended.'),'green');break;
   case 'help':this.print(tr('Comandos disponibles:', 'Available commands:')+'\n  help  ls  cd  pwd  cat  whoami  uname  date  uptime\n  echo  clear  status  about  apps  open  calc  logs\n  sysinfo  neofetch  nano  folders  software  history\n  tree  find  grep  head  tail  wc  which  man  admin  exit-admin  startx  reboot  exit');this.print(tr('Tab: autocompletar · ↑/↓: historial · Ctrl+L: limpiar','Tab: autocomplete · ↑/↓: history · Ctrl+L: clear'),'muted');break;
   case 'ls':{
    const desired=args.find(a=>!a.startsWith('-'))||'.',path=this.fs.normalize(desired,this.cwd),entries=this.fs.list(path);
    if(!entries)this.print('ls: '+tr('directorio inexistente: ','no such directory: ')+path,'amber');
    else if(args.includes('-l'))this.print(entries.length?entries.map(x=>(x.dir?'drwxr-xr-x':'-rw-r--r--')+' guest guest '+x.name+(x.dir?'/':'')).join('\n'):tr('(vacío)','(empty)'),'green');else this.print(entries.length?entries.map(x=>x.dir?x.name+'/':x.name).join('    '):tr('(vacío)','(empty)'),'green');break;
   }
   case 'folders':{
    this.print(tr('Categorías de TC-HQ:','TC-HQ categories:'),'green');
    for(const folder of this.catalog.folders||[])this.print(`  ${folder.id.padEnd(15)} ${localized(folder.name)}`);
    this.print(tr('Explora con: cd /srv/programs y ls','Browse with: cd /srv/programs and ls'),'muted');break;
   }
   case 'software':this.print(tr('Gestor de programas: ejecuta startx y abre el Gestor de programas desde el menú Inicio.','Software Manager: run startx and open Software Manager from Start.'),'muted');break;
   case 'tree':{
    const target=this.fs.normalize(args[0]||'.',this.cwd);
    if(!this.fs.isDir(target)){this.print('tree: '+tr('directorio inexistente','no such directory'),'amber');break}
    const result=[target],remaining={value:120};
    const visit=(path,prefix='',depth=0)=>{if(depth>=16||remaining.value<=0)return;const entries=this.fs.list(path)||[];for(let i=0;i<entries.length&&remaining.value>0;i++){
     const entry=entries[i],last=i===entries.length-1;result.push(prefix+(last?'└── ':'├── ')+entry.name+(entry.dir?'/':''));remaining.value--;
     if(entry.dir)visit(entry.path,prefix+(last?'    ':'│   '),depth+1);
    }};
    visit(target);this.print(result.join('\n'));break;
   }
   case 'find':{
    const start=this.fs.normalize(args[0]?.startsWith('/')||args[0]?.startsWith('.')?args[0]:'.',this.cwd);
    const term=(args.length>1?args[1]:(args[0]?.startsWith('/')||args[0]?.startsWith('.')?'':args[0]))?.toLowerCase()||'';
    if(!this.fs.isDir(start)){this.print('find: '+tr('directorio inexistente','no such directory'),'amber');break}
    const result=[],walk=(path,depth)=>{if(depth>16||result.length>=75)return;for(const item of this.fs.list(path)||[]){if(item.name.toLowerCase().includes(term))result.push(item.path);if(item.dir)walk(item.path,depth+1)}};walk(start,0);
    this.print(result.length?result.join('\n'):tr('(Sin coincidencias)','(No matches)'));break;
   }
   case 'grep':{
    if(args.length<2){this.print('grep: '+tr('uso: grep texto archivo','usage: grep text file'),'amber');break}
    const content=this.fs.read(this.fs.normalize(args[1],this.cwd));
    if(content===null){this.print('grep: '+tr('archivo no encontrado','file not found'),'amber');break}
    const matching=content.split('\n').filter(line=>line.toLowerCase().includes(args[0].toLowerCase()));this.print(matching.join('\n'));break;
   }
   case 'head':case 'tail':{
    const file=args.find(x=>!x.startsWith('-'));if(!file){this.print(command+': '+tr('falta el archivo','missing file'),'amber');break}
    const content=this.fs.read(this.fs.normalize(file,this.cwd));if(content===null){this.print(command+': '+tr('archivo no encontrado','file not found'),'amber');break}
    const lines=content.split('\n');this.print((command==='head'?lines.slice(0,10):lines.slice(-10)).join('\n'));break;
   }
   case 'wc':{
    const file=args[0];if(!file){this.print('wc: '+tr('falta el archivo','missing file'),'amber');break}
    const txt=this.fs.read(this.fs.normalize(file,this.cwd));if(txt===null){this.print('wc: '+tr('archivo no encontrado','file not found'),'amber');break}
    this.print(`${txt.split('\n').length} ${txt.trim()?txt.trim().split(/\s+/).length:0} ${txt.length} ${file}`);break;
   }
   case 'which':{
    const cmd=args[0]||'';const builtins=['help','ls','cd','pwd','cat','tree','find','grep','head','tail','wc','echo','which','man','calc','apps','open','startx','reboot','clear'];
    const app=programByName(this.catalog,cmd);
    this.print(builtins.includes(cmd)?'/bin/'+cmd:app?'/srv/programs/'+(app.command||app.id):tr('No encontrado','Not found'));break;
   }
   case 'man':{
    const available={ls:'ls [-l] [ruta] — lista archivos del directorio virtual',cd:'cd <ruta> — cambia de directorio virtual',tree:'tree [ruta] — muestra el árbol de directorios',find:'find [ruta] [texto] — localiza archivos por nombre',grep:'grep <texto> <archivo> — filtra líneas',head:'head <archivo> — primeras diez líneas',tail:'tail <archivo> — últimas diez líneas',wc:'wc <archivo> — líneas, palabras y caracteres',open:'open <programa> — ejecuta una aplicación registrada',apps:'apps — muestra el catálogo de programas',calc:'calc <expresión> — calculadora científica'};
    this.print((lang==='en'?({ls:'ls [-l] [path] — list virtual directory entries',cd:'cd <path> — change virtual directory',tree:'tree [path] — display folders and files',find:'find [path] [text] — find files by name',grep:'grep <text> <file> — filter text lines',head:'head <file> — first ten lines',tail:'tail <file> — last ten lines',wc:'wc <file> — count lines, words and characters',open:'open <app> — open registered application',apps:'apps — show installed catalog',calc:'calc <expression> — scientific calculator'})[args[0]]:available[args[0]])||tr('Consulta help o usa man ls, man tree, man grep...','See help or try man ls, man tree, man grep...'));break;
   }
   case 'pwd':this.print(this.cwd);break;
   case 'cd':{const path=this.fs.normalize(args[0]||'~',this.cwd);if(!this.fs.isDir(path))this.print('cd: '+tr('directorio inexistente: ','no such directory: ')+path,'amber');else this.cwd=path;break}
   case 'cat':{if(!args.length){this.print('cat: '+tr('falta el archivo','missing operand'),'amber');break}const path=this.fs.normalize(args[0],this.cwd),content=this.fs.read(path);this.print(content??'cat: '+tr('archivo no encontrado','file not found')+': '+path,content===null?'amber':'');break}
   case 'whoami':this.print(window.__tcosAdmin?'admin':'guest');break;
   case 'uname':this.print(args.includes('-a')?'TC/OS tc-hq '+VERSION+'.0-tchq x86_64 browser-shell':'TC/OS');break;
   case 'date':this.print(formatDate());break;
   case 'uptime':this.print(tr('Terminal activa: ','Terminal active: ')+Math.floor(performance.now()/1000)+'s  |  TC-HQ uptime: 213d');break;
   case 'echo':this.print(parameter);break;
   case 'clear':this.host.textContent='';break;
   case 'status':this.print('[ OK ] core-01 ONLINE   gateway-01 SECURE   archive-01 MOUNTED','green');this.print('ACCESS=PUBLIC_GUEST | SHELL=TC/OS | SERVER=ONLINE','muted');break;
   case 'about':this.print(tr('TC-HQ / TCardell Headquarters. Terminal de acceso público, cuenta guest.','TC-HQ / TCardell Headquarters. Public access terminal, guest account.'));break;
   case 'apps':this.catalog.forEach(p=>this.print((getDisabledPrograms().has(p.id)?'[OFF] ':p.terminal?'[CLI] ':'[GUI] ')+(p.command||p.id).padEnd(15)+' '+localized(p.name)));break;
   case 'open':{
    if(!parameter){this.print('open: '+tr('indica un programa. Prueba apps','specify a program. Try apps'),'amber');break}
    const program=programByName(this.catalog,parameter);if(!program){this.print('open: '+tr('programa desconocido','unknown program')+': '+parameter,'amber');break}
    if(getDisabledPrograms().has(program.id)){this.print(tr('Aplicación deshabilitada en el Gestor de programas.','Application disabled in Software Manager.'),'amber');break}
    if(!program.terminal){this.print(tr('Esta aplicación requiere la interfaz gráfica. Usa startx.','This program requires the graphical interface. Use startx.'),'amber');break}
    if(program.type==='page'){this.onProgram(program);this.print(tr('Abriendo enlace: ','Opening link: ')+localized(program.name),'green');break}
    if(program.id==='calculator')this.print(tr('Ejecuta calc 2*(3+4)','Run calc 2*(3+4)'));else if(program.id==='boot-logs')this.bootLogs();else if(program.id==='system-info')this.sysinfo();else if(program.id==='explorer')this.print((this.fs.list('/srv')||[]).map(x=>x.name+'/').join('    '));else this.onProgram(program);
    break;
   }
   case 'calc':{
    if(!parameter){this.print(tr('Uso: calc 2*(3+4)','Usage: calc 2*(3+4)'),'amber');break}try{this.print(String(calculate(parameter)),'green')}catch{this.print('calc: '+tr('expresión no válida','invalid expression'),'amber')}break;
   }
   case 'sysinfo':this.sysinfo();break;
   case 'logs':this.bootLogs();break;
   case 'history':this.history.forEach((cmd,i)=>this.print(String(i+1).padStart(3)+'  '+cmd));break;
   case 'neofetch':this.print(' TC-HQ   /  TC/OS '+VERSION+'\n ████     guest@tc-hq\n █  █     GUI: TC/Desktop\n ████     shell: tcsh\n █  █     theme: Red / Graphite','red');break;
   case 'nano':this.print(tr('El editor gráfico se abre desde el escritorio mediante startx → Bloc de notas.','The graphical editor is available via startx → Notepad.'),'amber');break;
   case 'startx':case 'exit':this.onGUI();return false;
   case 'reboot':this.onReboot();return false;
   default:{const app=programByName(this.catalog,command);
    if(app&&app.terminal&&!getDisabledPrograms().has(app.id)){this.onProgram(app);this.print(tr('Abriendo programa: ','Opening program: ')+localized(app.name),'green')}
    else this.print('tcsh: '+tr('comando no encontrado: ','command not found: ')+command,'amber');
   }
  }
  return true;
 }
 executePipeline(raw){
  const stages=raw.split('|').map(s=>this.parse(s));
  if(stages.some(parts=>!parts.length)){this.print('tcsh: '+tr('tubería incompleta','incomplete pipeline'),'amber');return true}
  const [source,...filters]=stages;const command=source[0]?.toLowerCase();let lines=[];
  if(command==='ls'){
   const target=this.fs.normalize(source[1]||'.',this.cwd),entries=this.fs.list(target);
   if(!entries){this.print('ls: '+tr('directorio inexistente','no such directory'),'amber');return true}
   lines=entries.map(f=>f.name+(f.dir?'/':''));
  }else if(command==='cat'){
   const txt=this.fs.read(this.fs.normalize(source[1]||'',this.cwd));
   if(txt===null){this.print('cat: '+tr('archivo no encontrado','file not found'),'amber');return true}lines=txt.split('\n');
  }else if(command==='echo')lines=[source.slice(1).join(' ')];
  else if(command==='apps')lines=this.catalog.map(p=>(p.command||p.id)+' '+localized(p.name));
  else {this.print(tr('Solo ls, cat, echo y apps pueden iniciar una tubería.','Only ls, cat, echo and apps can start a pipeline.'),'amber');return true}
  for(const filter of filters){const [cmd,...args]=filter,name=cmd.toLowerCase();
   if(name==='grep')lines=lines.filter(x=>x.toLowerCase().includes(args.join(' ').toLowerCase()));
   else if(name==='head')lines=lines.slice(0,10);
   else if(name==='tail')lines=lines.slice(-10);
   else if(name==='sort')lines.sort((a,b)=>a.localeCompare(b));
   else if(name==='wc')lines=[`${lines.length} ${lines.join(' ').trim().split(/\s+/).filter(Boolean).length} ${lines.join('\n').length}`];
   else {this.print('tcsh: '+tr('filtro no compatible','unsupported filter')+': '+cmd,'amber');return true}
  }
  this.print(lines.join('\n'));return true;
 }
 sysinfo(){const b=boot();this.print(`TC/OS ${VERSION}  |  guest@tc-hq  |  ${navigator.language}`,'green');this.print(`CLIENT: ${window.innerWidth}x${window.innerHeight}  |  BOOT: ${(b?.mode||'unknown').toUpperCase()}  |  NETWORK: ONLINE`)}
 bootLogs(){const b=boot();if(!b){this.print(tr('No hay registro del arranque actual.','No boot log for this session.'));return}this.print('BOOT='+b.mode+' / '+b.timestamp,'green');(b.lines||[]).forEach(line=>this.print(line))}
}
