/** TC/OS Desktop shortcuts. Stores REFERENCES, never removes applications. */
import {safeGet,safeSet,getDisabledPrograms} from './core.js?v=174';
export const pKey=id=>'p:'+id;
export const fKey=id=>'f:'+id;
const normalKeys=['p:system-info','p:explorer','p:terminal','f:education','f:projects','p:recycle-bin'];
export class Shortcuts {
 constructor(catalog){this.catalog=catalog;this.folders=catalog.folders||[];this.items=new Map();this.trash=[];this.load()}
 valid(key){if(typeof key!=='string')return false;
  if(key.startsWith('p:'))return this.catalog.some(p=>p.id===key.slice(2));
  if(key.startsWith('f:'))return this.folders.some(f=>f.id===key.slice(2));
  return false;
 }
 defaultKeys(preset='normal'){
  if(preset==='empty')return [];
  if(preset==='all')return [...this.catalog.filter(p=>!p.id.startsWith('admin-')).map(p=>pKey(p.id)),...this.folders.filter(f=>!f.parent&&f.id!=='administration').map(f=>fKey(f.id))];
  return normalKeys.filter(k=>this.valid(k));
 }
 looksLikeLegacyStandard(list){return Array.isArray(list)&&list.length===normalKeys.length&&normalKeys.every((key,i)=>{const item=list[i];return (typeof item==='string'?item:item?.key)===key && (typeof item==='string'?i:item?.slot)===i})}
 load(){
  const raw=safeGet('desktop-shortcuts',null);const list=Array.isArray(raw)?raw:this.defaultKeys();
  this.items.clear();
  for(const item of list){const key=typeof item==='string'?item:item?.key;if(!this.valid(key)||this.items.has(key))continue;
    const slot=Number.isInteger(item?.slot)?Math.max(0,Math.min(500,item.slot)):this.items.size;
    const autoAnchor=key==='p:recycle-bin' && (item?.anchor==='bottom-right' || (!raw && this.defaultKeys().includes(key)) || (raw && slot===5 && this.looksLikeLegacyStandard(raw)));
    this.items.set(key,{key,slot, ...(autoAnchor?{anchor:'bottom-right'}:{}),...(typeof item?.label==='string'&&item.label.trim()?{label:item.label.trim().slice(0,45)}:{})});}
  const trash=safeGet('desktop-trash',[]);
  this.trash=Array.isArray(trash)?trash.filter(x=>this.valid(x?.key)).slice(-100):[];
 }
 persist(){safeSet('desktop-shortcuts',[...this.items.values()]);safeSet('desktop-trash',this.trash);window.dispatchEvent(new Event('tcos-shortcuts-changed'))}
 available(){const disabled=getDisabledPrograms();return [...this.items.values()].filter(x=>!x.key.startsWith('p:')||!disabled.has(x.key.slice(2))).sort((a,b)=>a.slot-b.slot)}
 has(key){return this.items.has(key)}
 add(key,at=null){if(!this.valid(key))return false;
   if(this.items.has(key))return true;
   const occupied=new Set([...this.items.values()].map(x=>x.slot));let slot=Number.isInteger(at)&&at>=0?at:0;
   while(occupied.has(slot))slot++;
   this.items.set(key,{key,slot});this.persist();return true;
 }
 rename(key,label){const item=this.items.get(key);if(!item||typeof label!=='string'||label.length>45)return false;const value=label.trim();if(value)item.label=value;else delete item.label;this.persist();return true}
 remove(key){const old=this.items.get(key);if(!old)return false;
   this.items.delete(key);this.trash.push({...old,deletedAt:Date.now()});this.trash=this.trash.slice(-100);this.persist();return true;
 }
 move(key,toSlot){const item=this.items.get(key);if(!item||!Number.isInteger(toSlot)||toSlot<0||toSlot>500)return false;
   const other=[...this.items.values()].find(x=>x.key!==key&&x.slot===toSlot);
   if(other){other.slot=item.slot;delete other.anchor;}item.slot=toSlot;delete item.anchor;this.persist();return true;
 }
 organize(){let i=0;for(const item of this.items.values()){if(item.anchor==='bottom-right')continue;item.slot=i++}this.persist()}
 restore(index){const item=this.trash[index];if(!item)return false;
   this.trash.splice(index,1);this.add(item.key,item.slot);this.persist();return true;
 }
 emptyTrash(){this.trash=[];this.persist()}
 preset(name){if(!['empty','normal','all'].includes(name))return;
   this.items.clear();for(const key of this.defaultKeys(name))this.items.set(key,{key,slot:this.items.size,...(name==='normal'&&key==='p:recycle-bin'?{anchor:'bottom-right'}:{})});
   this.persist();
 }
 item(key){if(key?.startsWith('p:'))return {entry:this.catalog.find(p=>p.id===key.slice(2))};
  if(key?.startsWith('f:'))return {folder:this.folders.find(f=>f.id===key.slice(2))};return null}
}
