import {compileExpression,MathInputError} from '../core/engine.js';
function fn(expression,context){const compiled=compileExpression(expression);return x=>{const y=compiled({...context,x});if(!Number.isFinite(y))throw new MathInputError('Función no definida en el intervalo.');return y}}
export function derivative(expression,x,context={},h){if(!Number.isFinite(x))throw Error('Introduce el punto x.');const f=fn(expression,context);const step=h||Math.max(1e-5,Math.abs(x)*2e-5);const value=(-f(x+2*step)+8*f(x+step)-8*f(x-step)+f(x-2*step))/(12*step);if(!Number.isFinite(value))throw Error('La derivada no se puede calcular en ese punto.');return {value,step}}
export function integrate(expression,start,end,context={},eps=1e-8){if(!Number.isFinite(start)||!Number.isFinite(end))throw Error('Introduce límites finitos.');if(start===end)return {value:0,error:0,evaluations:0};const f=fn(expression,context);let evaluations=0;const checked=x=>{evaluations++;return f(x)};
 const simpson=(a,b,fa,fm,fb)=>(b-a)*(fa+4*fm+fb)/6;
 const a=Math.min(start,end),b=Math.max(start,end),fa=checked(a),fb=checked(b),m=(a+b)/2,fm=checked(m),whole=simpson(a,b,fa,fm,fb);let estimated=0;
 function adapt(a,b,fa,fm,fb,s,epsilon,depth){const mid=(a+b)/2,lmid=(a+mid)/2,rmid=(mid+b)/2,fl=checked(lmid),fr=checked(rmid);const left=simpson(a,mid,fa,fl,fm),right=simpson(mid,b,fm,fr,fb);const err=Math.abs(left+right-s)/15;
  if(depth===0){if(err>epsilon*20)throw Error('No se alcanzó la precisión pedida; revisa singularidades o intervalos.');estimated+=err;return left+right+(left+right-s)/15}
  if(err<epsilon){estimated+=err;return left+right+(left+right-s)/15}
  return adapt(a,mid,fa,fl,fm,left,epsilon/2,depth-1)+adapt(mid,b,fm,fr,fb,right,epsilon/2,depth-1)
 }
 const val=adapt(a,b,fa,fm,fb,whole,Math.max(eps,Math.abs(whole)*eps),17);
 return {value:(start<=end?1:-1)*val,error:estimated,evaluations};}
