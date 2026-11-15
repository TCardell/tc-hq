import {tr} from '../core.js?v=174';
const el=(tag,cls='',txt)=>{const n=document.createElement(tag);n.className=cls;if(txt!==undefined)n.textContent=txt;return n};
export function makeAdminLogin(onAccept){
 const wrap=el('form','sys-app tcos-admin-login'),title=el('h2','',tr('Acceso administrativo TC-HQ','TC-HQ Administrative Access')),
 user=el('input','sys-input'),pass=el('input','sys-input'),status=el('p','sys-muted',tr('Identifícate para iniciar una sesión administrativa.','Identify yourself to start an administrative session.')),
 submit=el('button','sys-button',tr('Iniciar sesión','Sign in'));
 user.placeholder=tr('Usuario','Username');user.autocomplete='off';user.setAttribute('aria-label',user.placeholder);
 pass.type='password';pass.placeholder=tr('Contraseña','Password');pass.autocomplete='off';pass.setAttribute('aria-label',pass.placeholder);
 submit.type='submit';wrap.append(title,status,user,pass,submit);
 wrap.addEventListener('submit',e=>{e.preventDefault();onAccept(user.value,pass.value)});
 return wrap;
}
