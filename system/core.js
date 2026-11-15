/** TC/OS shared core — front-end only, no server-side execution. */
import {readPreferences,savePreferences,applyPreferences,defaults} from './preferences.js?v=174';
export const VERSION = '1.7.4';
export const PALETTE = {red:'#f03b47',background:'#050506'};
const hasStorage = (key) => { try {return window[key]} catch{return null} };
export const safeGet = (key, fallback = null, type='localStorage') => {
  try {const item=hasStorage(type)?.getItem('tcos.'+key); return item===null?fallback:JSON.parse(item)} catch {return fallback}
};
export const safeSet = (key, value, type='localStorage') => {
  try {hasStorage(type)?.setItem('tcos.'+key,JSON.stringify(value)); return true} catch{return false}
};
const qs = new URLSearchParams(location.search);
const browserLanguage = navigator.languages?.[0] || navigator.language || 'en';
const preferred=readPreferences().language;
export const lang = ['es','en'].includes(preferred) ? preferred :
  (['es','en'].includes(qs.get('lang')) ? qs.get('lang') : /^es(?:-|$)/i.test(browserLanguage)?'es':'en');
export const tr = (es,en) => lang==='es'?es:en;
export const localized = value => typeof value === 'string' ? value : (value?.[lang] || value?.es || value?.en || '');
export const boot = () => safeGet('boot',null,'sessionStorage');
export const getPreferences = readPreferences;
export const setPreferences = savePreferences;
export const applyTheme = applyPreferences;
applyTheme();
import {icon} from './icons.js?v=174-iconpack2';
export {icon};
const fallback = [];
fallback.folders=[];
let catalogPromise;
// Validate the public JSON catalog. Only static HTML and known internal apps are allowed.
export function loadCatalog(){
 if(!catalogPromise)catalogPromise=fetch('programs.json?v=174',{cache:'no-store'}).then(async response=>{
  if(!response.ok)throw new Error(`HTTP ${response.status}`);
  const payload=await response.json();
  if(!Array.isArray(payload.programs))throw new Error('Invalid programs.json');
  const cleanId=id=>typeof id==='string'&&/^[a-z0-9][a-z0-9_-]{1,40}$/.test(id);
  const folderIDs=new Set();
  const folders=(Array.isArray(payload.folders)?payload.folders:[]).filter(f=>{
   if(!f||!cleanId(f.id)||folderIDs.has(f.id))return false;
   folderIDs.add(f.id);return true;
  });
  // Invalid parents and cycles are ignored, so a broken category cannot break the desktop.
  const byId=new Map(folders.map(f=>[f.id,f]));
  for(const f of folders){
   if(!byId.has(f.parent)||f.parent===f.id){f.parent=null;continue}
   const seen=new Set([f.id]);let cursor=f;
   while(cursor.parent&&byId.has(cursor.parent)){
    if(seen.has(cursor.parent)){f.parent=null;break}
    seen.add(cursor.parent);cursor=byId.get(cursor.parent);
   }
  }
  const ids=new Set();
  const programs=payload.programs.filter(p=>{
   if(!p||!cleanId(p.id)||ids.has(p.id))return false;
   if(p.type!=='system'&&p.type!=='page')return false;
   if(p.type==='page'){
    if(typeof p.url!=='string')return false;
    if(/^https?:\/\//i.test(p.url)){
     try{const u=new URL(p.url);if(!['http:','https:'].includes(u.protocol))return false}catch{return false}
    }else if(!/^[\w./-]+\.html(?:[?#][\w=&%/-]*)?$/.test(p.url)||p.url.split('/').includes('..')||p.url.startsWith('/'))return false;
   }
   p.folder=byId.has(p.folder)?p.folder:null;
   ids.add(p.id);return true;
  });
  programs.folders=folders;
  return programs;
 }).catch(e=>{console.error('TC/OS catalog error:',e);return fallback});
 return catalogPromise;
}
export function folderPath(folders,id){
 const map=new Map(folders.map(f=>[f.id,f]));const nodes=[],seen=new Set();let node=map.get(id);
 while(node&&!seen.has(node.id)){seen.add(node.id);nodes.unshift(node.id);node=map.get(node.parent)}
 return nodes.join('/');
}
export const getDisabledPrograms=()=>new Set(safeGet('software-disabled',[]));
export const setDisabledPrograms=disabled=>{safeSet('software-disabled',[...disabled]);window.dispatchEvent(new Event('tcos-programs-changed'))};
export const programTitle = p=>localized(p.name);
export const getFavoriteIds=()=>new Set(safeGet('favorites',[]));
export function toggleFavorite(id){
 if(typeof id!=='string'||!id||id.startsWith('admin-'))return;
 const next=getFavoriteIds();next.has(id)?next.delete(id):next.add(id);
 safeSet('favorites',[...next]);window.dispatchEvent(new Event('tcos-favorites-changed'));
}
export const openModeOf=p=>{
 if(p?.type!=='page')return 'internal';
 if(['internal','external','ask'].includes(p.openMode))return p.openMode;
 return /^https?:\/\//i.test(p.url||'')&&!p.embed?'external':'internal';
};
export function programByName(catalog,name){const find=name?.toLowerCase()||'';return catalog.find(p=>p.id===find||p.command===find||localized(p.name).toLowerCase()===find)}
export function openSafeURL(target){
 try{const u=new URL(target,location.href);if(!['https:','http:'].includes(u.protocol))return false;window.open(u.href,'_blank','noopener,noreferrer');return true}catch{return false}
}
export function formatDate(date=new Date()){return date.toLocaleString(lang==='es'?'es-ES':'en-GB')}
export function formatTime(date=new Date()){return date.toLocaleTimeString(lang==='es'?'es-ES':'en-GB',{hour:'2-digit',minute:'2-digit'})}
export function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
