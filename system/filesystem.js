import {safeGet,safeSet,boot,tr,localized,VERSION,folderPath,getDisabledPrograms} from './core.js?v=175';
const HOME='/home/guest';
const STATIC_DIRS=['/','/home',HOME,HOME+'/notes','/etc','/etc/tc-hq','/var','/var/log','/srv','/srv/programs'];
export class VirtualFS {
 constructor(catalog){
  this.catalog=catalog;this.folders=catalog.folders||[];
  this.notes=safeGet('notes',{});
  if(!this.notes||typeof this.notes!=='object'||Array.isArray(this.notes))this.notes={};
  this.dirs=new Set(STATIC_DIRS);this.folderAt=new Map();this.programAt=new Map();
  for(const folder of this.folders){const path='/srv/programs/'+folderPath(this.folders,folder.id);this.dirs.add(path);this.folderAt.set(path,folder)}
  for(const program of catalog){
   const base='/srv/programs'+(program.folder?'/'+folderPath(this.folders,program.folder):'');
   this.programAt.set(base+'/'+program.id+(program.type==='page'?'.url':'.app'),program);
  }
 }
 normalize(input='.',cwd=HOME){const path=input==='~'?HOME:input.startsWith('~/')?HOME+input.slice(1):input.startsWith('/')?input:cwd+'/'+input;const dirs=[];for(const part of path.split('/')){if(!part||part==='.')continue;if(part==='..')dirs.pop();else dirs.push(part)}return '/'+dirs.join('/')}
 isDir(path){return this.dirs.has(path)}
 files(){
  const b=boot(),data={
   [HOME+'/README.txt']:tr('Bienvenido a TC-HQ.\nLos programas se organizan en /srv/programs/ por categorías.\nLa terminal y el escritorio comparten el catálogo.','Welcome to TC-HQ.\nPrograms are organized under /srv/programs/ by category.\nTerminal and desktop share the catalog.'),
   ['/etc/tc-hq/release']:`NAME=TC/OS\nVERSION=${VERSION}\nHOST=tc-hq\nMODE=PUBLIC_GUEST`,
   ['/var/log/boot.log']:b?`TC-HQ ${b.mode||'UNKNOWN'} - ${b.timestamp||''}\n${(b.lines||[]).join('\n')}`:tr('No hay un arranque guardado en esta sesión.','No boot log saved for this session.')
  };
  for(const [name,txt] of Object.entries(this.notes))data[HOME+'/notes/'+name]=String(txt);
  for(const [path,program] of this.programAt)if(!getDisabledPrograms().has(program.id))data[path]=`${program.id}\n${program.url||'TC/OS internal application'}`;
  return data;
 }
 list(path){
  if(!this.isDir(path))return null;
  const prefix=path==='/'?'/':path+'/';const found=[];
  for(const dir of this.dirs){if(dir===path||!dir.startsWith(prefix))continue;const suffix=dir.slice(prefix.length);if(suffix&&!suffix.includes('/'))found.push({name:suffix,label:localized(this.folderAt.get(dir)?.name)||suffix,dir:true,path:dir,folder:this.folderAt.get(dir)||null})}
  for(const file of Object.keys(this.files())){if(!file.startsWith(prefix))continue;const suffix=file.slice(prefix.length);if(!suffix||suffix.includes('/'))continue;const program=this.programForPath(file);found.push({name:suffix,label:program?localized(program.name):suffix,dir:false,path:file,program})}
  return found.sort((a,b)=>Number(b.dir)-Number(a.dir)||(a.label||a.name).localeCompare(b.label||b.name));
 }
 programForPath(path){const p=this.programAt.get(path);return p&&!getDisabledPrograms().has(p.id)?p:null}
 read(path){const all=this.files();return Object.prototype.hasOwnProperty.call(all,path)?all[path]:null}
 saveNote(filename,text){
  let name=String(filename||'Notes.txt').trim();
  if(!/^[\wÀ-ÿ .()_-]{1,64}\.txt$/i.test(name))throw Error(tr('Nombre inválido: usa un nombre terminado en .txt.','Invalid name: use a filename ending in .txt.'));
  if(text.length>120000)throw Error(tr('El documento supera el límite de 120 000 caracteres.','Document exceeds 120,000 characters.'));
  this.notes[name]=text;
  if(!safeSet('notes',this.notes))throw Error(tr('No se ha podido guardar en este navegador.','Could not save to this browser.'));
  window.dispatchEvent(new CustomEvent('tcos-files-changed'));return name;
 }
 removeNote(filename){delete this.notes[filename];safeSet('notes',this.notes);window.dispatchEvent(new CustomEvent('tcos-files-changed'))}
 noteNames(){return Object.keys(this.notes).sort()}
}
