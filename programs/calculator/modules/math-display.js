/** Vista previa matemática bidimensional segura. La entrada sigue siendo editable en modo lineal. */
import {parseMathExpression} from '../core/engine.js?v=021';
const NS='http://www.w3.org/1998/Math/MathML';
const elem=(name,...kids)=>{const el=document.createElementNS(NS,name);for(const kid of kids){if(kid==null)continue;el.append(typeof kid==='string'?document.createTextNode(kid):kid)}return el};
function expr(node){
 switch(node.type){
  case 'number':return elem('mn',node.value);
  case 'name':return elem('mi',node.name==='pi'?'π':node.name);
  case 'unary':return elem('mrow',elem('mo',node.op),expr(node.right));
  case 'postfix':return elem('mrow',expr(node.left),elem('mo',node.op));
  case 'binary':{
   if(node.op==='/')return elem('mfrac',expr(node.left),expr(node.right));
   if(node.op==='^')return elem('msup',wrapBase(node.left),expr(node.right));
   return elem('mrow',expr(node.left),elem('mo',node.op==='*'?'×':node.op),expr(node.right));
  }
  case 'call':{
   if(node.name.toLowerCase()==='sqrt'&&node.args.length===1)return elem('msqrt',expr(node.args[0]));
   if(node.name.toLowerCase()==='cbrt'&&node.args.length===1)return elem('mroot',expr(node.args[0]),elem('mn','3'));
   return elem('mrow',elem('mi',node.name),elem('mo','('),...node.args.flatMap((arg,i)=>i?[elem('mo',','),expr(arg)]:[expr(arg)]),elem('mo',')'));
  }
  default:throw Error('Expresión no representable');
 }
}
function wrapBase(node){if(node.type==='binary'&&node.op!=='^')return elem('mrow',elem('mo','('),expr(node),elem('mo',')'));return expr(node)}
export function makeMathPreview(source){
 const math=elem('math');math.setAttribute('display','block');
 if(!String(source).trim())return math;
 try{math.append(expr(parseMathExpression(source)))}
 catch{math.append(elem('mtext',source));math.setAttribute('data-incomplete','true')}
 return math;
}
