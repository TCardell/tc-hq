/** TC-HQ Scientific — safe, offline mathematical expression engine.
 * No eval(), Function(), external libraries or arbitrary JavaScript execution.
 */
const DEFAULT_MAX_LENGTH=600;
export class MathInputError extends Error { constructor(message){super(message);this.name='MathInputError'} }
const fail=(message)=>{throw new MathInputError(message)};
const finite=value=>{if(!Number.isFinite(value))fail('Resultado no definido o fuera de rango.');return value};
const integer=(n,name='El argumento')=>{if(!Number.isSafeInteger(n))fail(`${name} debe ser un entero válido.`);return n};
const factorial=n=>{integer(n,'El factorial');if(n<0||n>170)fail('El factorial admite enteros de 0 a 170.');let z=1;for(let i=2;i<=n;i++)z*=i;return z};
const choose=(n,r)=>{integer(n,'n');integer(r,'r');if(n<0||r<0||r>n)fail('nCr requiere 0 ≤ r ≤ n.');r=Math.min(r,n-r);let v=1;for(let i=1;i<=r;i++)v=v*(n-r+i)/i;return finite(v)};
const permutations=(n,r)=>{integer(n,'n');integer(r,'r');if(n<0||r<0||r>n)fail('nPr requiere 0 ≤ r ≤ n.');let v=1;for(let i=0;i<r;i++)v*=n-i;return finite(v)};
const gcd=(a,b)=>{integer(a);integer(b);a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a};
const rad=(x,settings)=>settings.angle==='deg'?x*Math.PI/180:x;
const unrad=(x,settings)=>settings.angle==='deg'?x*180/Math.PI:x;
function callFunction(name,args,settings){
 const unary=(fn)=>{if(args.length!==1)fail(`${name} requiere un argumento.`);return finite(fn(args[0]))};
 const binary=(fn)=>{if(args.length!==2)fail(`${name} requiere dos argumentos.`);return finite(fn(args[0],args[1]))};
 switch(name.toLowerCase()){
  case 'sin':return unary(x=>Math.sin(rad(x,settings)));
  case 'cos':return unary(x=>Math.cos(rad(x,settings)));
  case 'tan':return unary(x=>{const radians=rad(x,settings);if(Math.abs(Math.cos(radians))<1e-14)fail('La tangente no está definida para ese ángulo.');return Math.tan(radians)});
  case 'asin':case 'arcsin':return unary(x=>unrad(Math.asin(x),settings));
  case 'acos':case 'arccos':return unary(x=>unrad(Math.acos(x),settings));
  case 'atan':case 'arctan':return unary(x=>unrad(Math.atan(x),settings));
  case 'sinh':return unary(Math.sinh);case 'cosh':return unary(Math.cosh);case 'tanh':return unary(Math.tanh);
  case 'asinh':return unary(Math.asinh);case 'acosh':return unary(Math.acosh);case 'atanh':return unary(Math.atanh);
  case 'sqrt':return unary(Math.sqrt);case 'cbrt':return unary(Math.cbrt);
  case 'abs':return unary(Math.abs);case 'ln':return unary(Math.log);
  case 'log':return args.length===1?finite(Math.log10(args[0])):binary((x,b)=>Math.log(x)/Math.log(b));
  case 'log2':return unary(Math.log2);case 'exp':return unary(Math.exp);
  case 'floor':return unary(Math.floor);case 'ceil':return unary(Math.ceil);
  case 'round':return unary(Math.round);case 'trunc':return unary(Math.trunc);
  case 'sign':return unary(Math.sign);case 'fact':return unary(factorial);
  case 'ncr':return binary(choose);case 'npr':return binary(permutations);
  case 'gcd':return binary(gcd);case 'lcm':return binary((a,b)=>a===0||b===0?0:Math.abs(a/gcd(a,b)*b));
  case 'pow':return binary(Math.pow);case 'root':return binary((x,n)=>n%2!==0&&x<0?-Math.pow(-x,1/n):Math.pow(x,1/n));
  case 'min':if(!args.length)fail('min requiere argumentos.');return Math.min(...args);
  case 'max':if(!args.length)fail('max requiere argumentos.');return Math.max(...args);
  default:fail(`Función desconocida: ${name}.`);
 }
}
const NORMALIZE=[[/[×·]/g,'*'],[/÷/g,'/'],[/[−–]/g,'-'],[/π/g,'pi'],[/√/g,'sqrt'],[/²/g,'^2'],[/³/g,'^3'],[/\bANS\b/gi,'Ans']];
export function tokenize(source){
 if(typeof source!=='string'||source.length>DEFAULT_MAX_LENGTH)fail('La expresión es demasiado larga.');
 for(const[reg,replacement]of NORMALIZE)source=source.replace(reg,replacement);
 const tokens=[];const rex=/(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+\-]?\d+)?|[A-Za-z_][A-Za-z_0-9]*|[()+\-*\/^!%,]/y;
 let i=0;while(i<source.length){if(/\s/.test(source[i])){i++;continue}rex.lastIndex=i;const m=rex.exec(source);if(!m)fail(`Carácter no admitido cerca de «${source.slice(i,i+10)}».`);const value=m[0];tokens.push({value,type:/^(?:\d|\.)/.test(value)?'number':/^[A-Za-z_]/.test(value)?'identifier':'operator'});i=rex.lastIndex;if(tokens.length>250)fail('Expresión demasiado compleja.')}
 if(!tokens.length)fail('Introduce una expresión.');return tokens;
}
function parse(source){const tokens=tokenize(source);let at=0;
 const peek=()=>tokens[at]?.value;const read=()=>tokens[at++];
 const canStart=t=>t?.type==='number'||t?.type==='identifier'||t?.value==='(';
 function expression(min=0){
  const token=read();if(!token)fail('Expresión incompleta.');let node;
  if(token.type==='number')node={type:'number',value:token.value};
  else if(token.value==='('){node=expression(0);if(peek()!==')')fail('Falta un paréntesis de cierre.');read()}
  else if(token.value==='+'||token.value==='-')node={type:'unary',op:token.value,right:expression(35)};
  else if(token.type==='identifier'){
   if(peek()==='('){read();const args=[];if(peek()!==')')while(true){args.push(expression(0));if(peek()!==',')break;read()}if(peek()!==')')fail('Falta cerrar la función.');read();node={type:'call',name:token.value,args}}
   else node={type:'name',name:token.value};
  }else fail(`No se esperaba «${token.value}».`);
  while(at<tokens.length){const next=tokens[at],t=peek();
   if(t==='!'||t==='%'){if(60<min)break;read();node={type:'postfix',op:t,left:node};continue}
   if(t===')'||t===',')break;
   const implicit=canStart(next);const op=implicit?'*':t;
   const power=op==='^';const bp=power?40:op==='*'||op==='/'?20:op==='+'||op==='-'?10:-1;
   if(bp<min||bp<0)break;
   if(!implicit)read();node={type:'binary',op,left:node,right:expression(power?bp:bp+1)};
  }
  return node;
 }
 const ast=expression(0);if(at!==tokens.length)fail(`Símbolo inesperado: «${peek()}».`);return ast;
}
function evaluateNode(node,context,depth=0){
 if(depth>70)fail('Expresión demasiado profunda.');const sub=n=>evaluateNode(n,context,depth+1);
 switch(node.type){
  case 'number':return finite(Number(node.value));
  case 'name':{
   const lname=node.name.toLowerCase();if(lname==='pi')return Math.PI;if(lname==='e')return Math.E;if(lname==='tau')return Math.PI*2;
   if(lname==='ans')return finite(context.ans??0);if(lname==='m')return finite(context.memory??0);
   if(lname==='x'&&Number.isFinite(context.x))return context.x;
   const custom=context.variables?.[node.name]??context.variables?.[lname];if(Number.isFinite(custom))return custom;
   fail(`Símbolo desconocido: ${node.name}.`)
  }
  case 'unary':return finite(node.op==='-'?-sub(node.right):sub(node.right));
  case 'postfix':return finite(node.op==='!'?factorial(sub(node.left)):sub(node.left)/100);
  case 'binary':{
   const a=sub(node.left),b=sub(node.right);
   switch(node.op){case '+':return finite(a+b);case '-':return finite(a-b);case '*':return finite(a*b);
    case '/':if(b===0)fail('División por cero.');return finite(a/b);case '^':return finite(Math.pow(a,b));}
   fail('Operación desconocida.');
  }
  case 'call':return callFunction(node.name,node.args.map(sub),context);
  default:fail('Error de expresión.')
 }
}
const absBig=x=>x<0n?-x:x;const bgcd=(a,b)=>{a=absBig(a);b=absBig(b);while(b)[a,b]=[b,a%b];return a||1n};
const frac=(n,d)=>{if(d===0n)return null;if(d<0n){n=-n;d=-d}const g=bgcd(n,d);return {n:n/g,d:d/g}};
function decimalFraction(s){if(/[eE]/.test(s))return null;const parts=s.split('.');const dec=parts[1]||'';if(dec.length>12)return null;return frac(BigInt(parts.join('')),10n**BigInt(dec.length))}
function rationalNode(node){const r=n=>rationalNode(n);
 switch(node.type){
  case 'number':return decimalFraction(node.value);
  case 'unary':{const a=r(node.right);return a?frac(node.op==='-'?-a.n:a.n,a.d):null}
  case 'postfix':{const a=r(node.left);return a&&node.op==='%'?frac(a.n,a.d*100n):null}
  case 'binary':{const a=r(node.left),b=r(node.right);if(!a||!b)return null;
   switch(node.op){case '+':return frac(a.n*b.d+b.n*a.d,a.d*b.d);
    case '-':return frac(a.n*b.d-b.n*a.d,a.d*b.d);case '*':return frac(a.n*b.n,a.d*b.d);
    case '/':return frac(a.n*b.d,a.d*b.n);case '^':if(b.d!==1n||b.n>24n||b.n< -24n)return null;return b.n>=0n?frac(a.n**b.n,a.d**b.n):frac(a.d**(-b.n),a.n**(-b.n));}
  }
 }
 return null;
}
export function parseMathExpression(source){return parse(source)}
export function compileExpression(source){const ast=parse(source);return (context={})=>evaluateNode(ast,context)};
export function calculate(source,context={}){
 const ast=parse(source),value=evaluateNode(ast,{angle:context.angle==='rad'?'rad':'deg',ans:context.ans,memory:context.memory,x:context.x,variables:context.variables});
 const rational=rationalNode(ast);
 const fraction=rational&&rational.d>1n&&rational.n.toString().length<60&&rational.d.toString().length<60?`${rational.n}/${rational.d}`:null;
 return {value,formatted:formatNumber(value),fraction};
}
export function formatNumber(value,digits=12){if(!Number.isFinite(value))return 'No definido';if(value===0||Object.is(value,-0))return '0';const precision=Math.max(2,Math.min(15,digits));const n=Number(value.toPrecision(precision));return String(n).replace('e+','e+');}
