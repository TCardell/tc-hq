// Small arithmetic parser: deliberately no eval() / Function().
export function calculate(expression){
 const s=String(expression).replace(/[×]/g,'*').replace(/[÷]/g,'/').replace(/,/g,'.').replace(/\s+/g,'');
 if(!s||s.length>140)throw new Error('Invalid expression');
 const tokens=s.match(/(?:\d+(?:\.\d*)?|\.\d+)|[()+\-*/%^]/g);
 if(!tokens||tokens.join('')!==s)throw Error('Invalid expression');
 let i=0;
 const atom=()=>{const t=tokens[i++];if(t==='('){let v=expressionParse();if(tokens[i++]!==')')throw Error('Missing )');return v}if(t==='-')return -atom();if(t==='+')return atom();if(t===undefined || !/^(?:\d|\.)/.test(t))throw Error('Invalid operand');return Number(t)};
 const power=()=>{let x=atom();if(tokens[i]==='^'){i++;x=x**power()}return x};
 const term=()=>{let x=power();while(['*','/','%'].includes(tokens[i])){const op=tokens[i++],y=power();x=op==='*'?x*y:op==='/'?x/y:x%y}return x};
 const expressionParse=()=>{let x=term();while(['+','-'].includes(tokens[i])){let op=tokens[i++],y=term();x=op==='+'?x+y:x-y}return x};
 const result=expressionParse();if(i!==tokens.length||!Number.isFinite(result))throw Error('Invalid result');
 return Number(result.toPrecision(12));
}
