/** Polynomial equations (real coefficients, degree 1–4) and real linear systems.
 * Pure numerics. Root results are approximations, not symbolic solutions.
 */
const finite = a => typeof a === 'number' && Number.isFinite(a);
const complex = (re=0, im=0) => ({re, im});
const add=(a,b)=>complex(a.re+b.re,a.im+b.im);
const sub=(a,b)=>complex(a.re-b.re,a.im-b.im);
const mul=(a,b)=>complex(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
const div=(a,b)=>{const d=b.re*b.re+b.im*b.im;if(d===0)throw Error('División compleja por cero.');return complex((a.re*b.re+a.im*b.im)/d,(a.im*b.re-a.re*b.im)/d)};
const abs=a=>Math.hypot(a.re,a.im);
const value=(coeff,z)=>coeff.reduce((v,c)=>add(mul(v,z),complex(c)),complex());
const evaluateReal=(coeff,x)=>coeff.reduce((v,c)=>v*x+c,0);
const rootBound=coeff=>1+Math.max(...coeff.slice(1).map(c=>Math.abs(c/coeff[0])));
function bisect(coeff,a,b){let fa=evaluateReal(coeff,a);for(let i=0;i<90;i++){const m=(a+b)/2,fm=evaluateReal(coeff,m);if(fm===0||Math.abs(b-a)<1e-13*Math.max(1,Math.abs(m)))return m;if((fa<0)===(fm<0)){a=m;fa=fm}else b=m}return(a+b)/2}
function realRoots(coeff){const n=coeff.length-1;if(n===1)return[-coeff[1]/coeff[0]];if(n===0)return[];
 const dc=coeff.slice(0,-1).map((v,i)=>v*(n-i));const critical=realRoots(dc);const bound=rootBound(coeff);const pts=[-bound,...critical.filter(v=>Math.abs(v)<=bound),bound].sort((a,b)=>a-b);
 const roots=[];const check=x=>{const f=evaluateReal(coeff,x);const scale=coeff.reduce((s,c)=>s+Math.abs(c)*Math.pow(Math.max(1,Math.abs(x)),n),0);if(Math.abs(f)<=1e-11*Math.max(1,scale))roots.push(x)};
 for(const x of critical)check(x);
 for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],fa=evaluateReal(coeff,a),fb=evaluateReal(coeff,b);if(fa*fb<0)roots.push(bisect(coeff,a,b))}
 return roots.sort((a,b)=>a-b).filter((x,i,arr)=>i===0||Math.abs(x-arr[i-1])>1e-7*Math.max(1,Math.abs(x)));
}
function deflate(coeff,r){const out=[coeff[0]];for(let i=1;i<coeff.length-1;i++)out.push(coeff[i]+r*out[out.length-1]);const residue=coeff.at(-1)+r*out.at(-1);return{out,residue}}
function quadratic(coeff){const[a,b,c]=coeff,disc=b*b-4*a*c;if(disc>=0){const s=Math.sqrt(disc),q=-.5*(b+Math.sign(b||1)*s);return q===0?[complex(-b/(2*a)),complex(-b/(2*a))]:[complex(q/a),complex(c/q)]}
 return[complex(-b/(2*a),Math.sqrt(-disc)/(2*Math.abs(a))),complex(-b/(2*a),-Math.sqrt(-disc)/(2*Math.abs(a)))]}
function durandKerner(coeff){const n=coeff.length-1;const scale=coeff[0],pol=coeff.map(c=>c/scale),bound=Math.min(1e5,Math.max(1,rootBound(pol)));
 for(let attempt=0;attempt<5;attempt++){
  const roots=Array.from({length:n},(_,i)=>{const theta=2*Math.PI*(i+.17+.071*attempt)/n;return complex(bound*.4*Math.cos(theta),bound*.4*Math.sin(theta))});
  for(let iter=0;iter<1200;iter++){let max=0;for(let i=0;i<n;i++){let product=complex(1,0);for(let j=0;j<n;j++){if(i!==j)product=mul(product,sub(roots[i],roots[j]))}if(abs(product)<1e-25)product=add(product,complex(1e-13,1e-13));const delta=div(value(pol,roots[i]),product);roots[i]=sub(roots[i],delta);max=Math.max(max,abs(delta))}
   if(max<1e-12*bound)break;
  }
  if(roots.every(z=>abs(value(pol,z))<1e-5*Math.max(1,Math.pow(abs(z),n))))return roots;
 }
 throw Error('No se han podido determinar todas las raíces con precisión. Prueba coeficientes mejor escalados.');
}
export function solvePolynomial(raw){if(!Array.isArray(raw)||raw.length<2||raw.length>5||!raw.every(finite))throw Error('Introduce de 2 a 5 coeficientes numéricos.');const coeff=[...raw];if(coeff[0]===0)throw Error('El coeficiente de mayor grado no puede ser cero.');
 const n=coeff.length-1;if(n===1)return[complex(-coeff[1]/coeff[0])];if(n===2)return quadratic(coeff);
 let current=[...coeff];const reals=realRoots(coeff);const roots=[];
 for(const r of reals){let attempts=0;while(current.length>3&&attempts++<n){const {out,residue}=deflate(current,r);const scale=current.reduce((sum,v)=>sum+Math.abs(v)*Math.pow(Math.max(1,Math.abs(r)),current.length-1),0);if(Math.abs(residue)>1e-7*Math.max(1,scale))break;roots.push(complex(r));current=out}}
 let rest;if(current.length===3)rest=quadratic(current);else if(current.length===2)rest=[complex(-current[1]/current[0])];else if(current.length===1)rest=[];else rest=durandKerner(current);
 const result=[...roots,...rest].map(z=>({re:Math.abs(z.re)<1e-11?0:z.re,im:Math.abs(z.im)<1e-10?0:z.im}));
 if(result.length!==n)throw Error('No se encontraron todas las raíces.');return result.sort((a,b)=>a.re-b.re||a.im-b.im);
}
export function solveLinearSystem(A,b){const n=A?.length;if(![2,3,4].includes(n)||!Array.isArray(b)||b.length!==n||!A.every(r=>Array.isArray(r)&&r.length===n&&r.every(finite))||!b.every(finite))throw Error('Sistema de 2 a 4 ecuaciones: introduce coeficientes reales.');
 const rows=A.map((r,i)=>[...r,b[i]]);const tol=1e-12*Math.max(1,...A.flat().map(Math.abs));
 for(let k=0;k<n;k++){let pivot=k;for(let i=k+1;i<n;i++)if(Math.abs(rows[i][k])>Math.abs(rows[pivot][k]))pivot=i;
  if(Math.abs(rows[pivot][k])<tol)throw Error('El sistema es singular o no tiene solución única.');
  [rows[k],rows[pivot]]=[rows[pivot],rows[k]];
  for(let i=k+1;i<n;i++){const m=rows[i][k]/rows[k][k];rows[i][k]=0;for(let j=k+1;j<=n;j++)rows[i][j]-=m*rows[k][j]}}
 const x=Array(n).fill(0);for(let i=n-1;i>=0;i--){let v=rows[i][n];for(let j=i+1;j<n;j++)v-=rows[i][j]*x[j];x[i]=v/rows[i][i]}
 if(x.some(v=>!Number.isFinite(v)))throw Error('Resultado no definido.');return x;
}
