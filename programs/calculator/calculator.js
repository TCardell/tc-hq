import {calculate,formatNumber} from './core/engine.js?v=021';
import {CONSTANTS} from './data/constants.js?v=2';
import {makeMathPreview} from './modules/math-display.js?v=021';

const $=id=>document.getElementById(id);
const STORAGE='tcos.scientific.v1';
let saved={};try{saved=JSON.parse(localStorage.getItem(STORAGE)||'{}')||{}}catch{}
let angle=saved.angle==='rad'?'rad':'deg';
let ans=Number.isFinite(saved.ans)?saved.ans:0;
let memory=Number.isFinite(saved.memory)?saved.memory:0;
let history=Array.isArray(saved.history)?saved.history.filter(x=>typeof x.expression==='string'&&typeof x.formatted==='string').slice(0,40):[];
let justEvaluated=false,activeView='scientific';
const variables={};for(const c of CONSTANTS){const name=c.id==='e_charge'?'Qe':c.id;variables[name]=c.value;}
const context=()=>({angle,ans,memory,variables});
let settingsSaved={};try{settingsSaved=JSON.parse(localStorage.getItem('tcos.scientific.v2.settings')||'{}')||{}}catch{}
const calcSettings={digits:[6,10,12,15].includes(Number(settingsSaved.digits))?Number(settingsSaved.digits):12,notation:['auto','fixed','exponential'].includes(settingsSaved.notation)?settingsSaved.notation:'auto',keyboard:['basic','scientific','extended'].includes(settingsSaved.keyboard)?settingsSaved.keyboard:'scientific',entry:settingsSaved.entry==='natural'?'natural':'linear',showFraction:settingsSaved.showFraction!==false,saveHistory:settingsSaved.saveHistory!==false};
const screenStates={};
const saveSettings=()=>{try{localStorage.setItem('tcos.scientific.v2.settings',JSON.stringify(calcSettings))}catch{}};
function formatSciResult(value,fallback){if(!Number.isFinite(value))return fallback??String(value);if(calcSettings.notation==='fixed'){const digits=Math.min(calcSettings.digits,14);if(value!==0&&Math.abs(value)<0.5*10**(-digits))return value.toExponential(Math.max(1,calcSettings.digits-1));return value.toFixed(digits)}if(calcSettings.notation==='exponential')return value.toExponential(Math.max(1,calcSettings.digits-1));return formatNumber(value,calcSettings.digits)}
function renderExpressionPreview(){const pane=$('expression-preview');if(!pane)return;pane.classList.toggle('hidden',calcSettings.entry!=='natural');if(calcSettings.entry!=='natural')return;pane.replaceChildren(makeMathPreview($('expression').value))}
function saveScienceScreen(){if(activeView==='scientific')screenStates.scientific={text:$('expression').value,result:$('result').textContent,exact:$('exact-result').textContent,status:$('screen-message').textContent}}
function setModuleScreen(name,text,result,exact=''){screenStates[name]={text:String(text??''),result:String(result??'—'),exact:String(exact??''),status:''};if(activeView!==name)return;$('context-expression').textContent=screenStates[name].text;$('result').textContent=screenStates[name].result;$('exact-result').textContent=screenStates[name].exact;message('')}

const store=()=>{try{localStorage.setItem(STORAGE,JSON.stringify({angle,ans,memory,history:calcSettings.saveHistory?history:[]}))}catch{}};
function applyTheme(){let prefs={};try{prefs=JSON.parse(localStorage.getItem('tcos.preferences')||'{}')||{}}catch{}document.documentElement.dataset.theme=prefs.theme||'hq-black'}
applyTheme();window.addEventListener('storage',e=>{if(e.key==='tcos.preferences')applyTheme()});
function message(text='',bad=false){const el=$('screen-message');el.textContent=text;el.classList.toggle('ok',!bad)}
function setAngle(next){angle=next;for(const v of ['deg','rad'])$(v).classList.toggle('selected',v===angle);$('angle-status').textContent=angle.toUpperCase();store()}
$('deg').addEventListener('click',()=>setAngle('deg'));$('rad').addEventListener('click',()=>setAngle('rad'));setAngle(angle);
function insert(text){const input=$('expression');if(justEvaluated&&(/^[0-9.(]|^(pi|e|Ans|sin\(|cos\(|tan\(|asin\(|acos\(|atan\(|ln\(|log\(|sqrt\(|nCr\(|nPr\()/.test(text))){input.value=''}justEvaluated=false;
 const start=input.selectionStart??input.value.length,end=input.selectionEnd??input.value.length;
 input.value=input.value.slice(0,start)+text+input.value.slice(end);input.focus();input.setSelectionRange(start+text.length,start+text.length);message('');renderExpressionPreview()}
function showResult(r){const out=formatSciResult(r.value,r.formatted);$('result').textContent=out;$('exact-result').textContent=calcSettings.showFraction&&r.fraction?'Fracción exacta: '+r.fraction:'';message('Calculado correctamente.');if(r.fraction&&calcSettings.showFraction)renderFractionOutput(r.fraction);else $('fraction-rendered')?.replaceChildren();}
function evaluate(){const expression=$('expression').value.trim();try{const r=calculate(expression,context());ans=r.value;showResult(r);history.unshift({expression,formatted:formatSciResult(r.value,r.formatted),fraction:r.fraction||''});history=history.slice(0,40);justEvaluated=true;renderHistory();store();saveScienceScreen();renderExpressionPreview()}catch(e){$('result').textContent='ERROR';$('exact-result').textContent='';message(e.message||'No se pudo calcular.',true);saveScienceScreen()}}
function act(action){const input=$('expression');switch(action){
 case 'evaluate':evaluate();break;
 case 'clear':input.value='';$('result').textContent='0';$('exact-result').textContent='';$('fraction-rendered')?.replaceChildren();message('');justEvaluated=false;input.focus();saveScienceScreen();renderExpressionPreview();break;
 case 'backspace':{const a=input.selectionStart??input.value.length,b=input.selectionEnd??a;if(a!==b){input.value=input.value.slice(0,a)+input.value.slice(b);input.setSelectionRange(a,a)}else if(a>0){input.value=input.value.slice(0,a-1)+input.value.slice(a);input.setSelectionRange(a-1,a-1)}input.focus();justEvaluated=false;renderExpressionPreview();break}
 case 'sign':{const value=input.value.trim();input.value=value?(value.startsWith('-(')&&value.endsWith(')')?value.slice(2,-1):'-('+value+')'):'-';input.focus();input.setSelectionRange(input.value.length,input.value.length);renderExpressionPreview();break}
 case 'memory-recall':insert('M');break;
 case 'memory-add':memory+=ans;updateMemory();message('Resultado añadido a memoria.');store();break;
 case 'memory-clear':memory=0;updateMemory();message('Memoria borrada.');store();break;
 }}
function updateMemory(){$('memory-status').textContent=memory===0?'MEM —':'MEM '+formatNumber(memory,7)}updateMemory();
for(const id of ['keypad','basic-keypad'])$(id).addEventListener('click',e=>{const key=e.target.closest('button');if(!key)return;if(key.dataset.insert!==undefined)insert(key.dataset.insert);else if(key.dataset.action)act(key.dataset.action)});
$('expression').addEventListener('input',()=>{justEvaluated=false;renderExpressionPreview()});
$('expression').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();evaluate()}else if(e.key==='Escape'){e.preventDefault();act('clear')}});
$('copy-result').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('result').textContent);message('Resultado copiado.')}catch{message('Tu navegador no permite copiar automáticamente.',true)}});
function renderHistory(){const list=$('history-list');list.replaceChildren();if(!history.length){const p=document.createElement('p');p.className='empty';p.textContent='Todavía no hay operaciones.';list.append(p);return}history.forEach(item=>{const b=document.createElement('button');b.type='button';b.className='history-entry';const exp=document.createElement('span');exp.className='h-exp';exp.textContent=item.expression;const result=document.createElement('span');result.className='h-result';result.textContent='= '+item.formatted;b.append(exp,result);b.title='Reutilizar esta expresión';b.addEventListener('click',()=>{$('expression').value=item.expression;justEvaluated=false;$('expression').focus();$('result').textContent=item.formatted;$('exact-result').textContent=item.fraction?'Fracción exacta: '+item.fraction:'';renderExpressionPreview()});list.append(b)})}
renderHistory();$('clear-history').addEventListener('click',()=>{history=[];renderHistory();store()});
$('toggle-history').addEventListener('click',()=>{const panel=$('history'),visible=panel.classList.toggle('visible');$('toggle-history').setAttribute('aria-expanded',String(visible))});
$('help-toggle').addEventListener('click',()=>{$('help').classList.toggle('hidden');$('help-toggle').setAttribute('aria-expanded',String(!$('help').classList.contains('hidden')))});
const viewInitializers={equations:initEquations,matrices:initMatrices,calculus:initCalculus,units:initUnits,constants:initConstants,laboratory:initLaboratory};const initialized=new Set();
async function showView(name){
 if(!document.getElementById('view-'+name))return;
 saveScienceScreen();activeView=name;
 document.querySelectorAll('[data-view]').forEach(button=>{const selected=button.dataset.view===name;button.classList.toggle('active',selected);if(selected)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current')});
 document.querySelectorAll('.view').forEach(view=>view.classList.toggle('active',view.id==='view-'+name));
 $('screen-active').textContent={scientific:'CIENTÍFICA',equations:'ECUACIONES',matrices:'MATRICES',calculus:'CÁLCULO',units:'UNIDADES',constants:'CONSTANTES',laboratory:'LABORATORIO'}[name]||name.toUpperCase();
 $('expression').classList.toggle('hidden',name!=='scientific');$('fraction-rendered')?.classList.toggle('hidden',name!=='scientific');
 $('context-expression').classList.toggle('hidden',name==='scientific');
 const state=screenStates[name]||{text:name==='scientific'?'':'Herramienta lista',result:name==='scientific'?'0':'—',exact:'',status:''};
 if(name!=='scientific')$('context-expression').textContent=state.text||'';
 $('result').textContent=state.result||'—';$('exact-result').textContent=state.exact||'';message(state.status||'',false);
 $('modes').hidden=true;$('menu-toggle').setAttribute('aria-expanded','false');
 if(viewInitializers[name]&&!initialized.has(name)){try{await viewInitializers[name]();initialized.add(name)}catch(err){const target=$('view-'+name);const warning=document.createElement('p');warning.className='error';warning.textContent='Error al cargar el módulo: '+err.message;target.prepend(warning)}}
}

document.querySelector('.mode-nav').addEventListener('click',e=>{const b=e.target.closest('button[data-view]');if(b)showView(b.dataset.view)});

function numberInput(id){const text=$(id).value.trim();if(text==='')throw Error('Falta un dato numérico.');const n=Number(text);if(!Number.isFinite(n))throw Error('Introduce un número válido.');return n}
function errorOutput(id,error){const target=$(id);target.classList.add('error');target.textContent=error.message||String(error)}

async function initMatrices(){const {parseMatrixGrid,determinant,inverse,transpose,addMatrix,multiplyMatrix}=await import('./modules/matrices.js');
 function draw(){const n=Number($('matrix-size').value);for(const name of ['a','b']){const grid=$('matrix-'+name);grid.replaceChildren();grid.style.gridTemplateColumns=`repeat(${n},minmax(0,1fr))`;for(let i=0;i<n;i++)for(let j=0;j<n;j++){const input=document.createElement('input');input.type='text';input.inputMode='decimal';input.setAttribute('aria-label',`Matriz ${name.toUpperCase()}, fila ${i+1}, columna ${j+1}`);input.value=name==='a'?(i===j?'1':'0'):(i===j?'1':'0');grid.append(input)}}$('matrix-output').textContent='Selecciona una operación.'}
 function read(name){const n=Number($('matrix-size').value),inputs=[...$('matrix-'+name).querySelectorAll('input')],rows=[];for(let i=0;i<n;i++)rows.push(inputs.slice(i*n,(i+1)*n).map(el=>calculate(el.value,context()).value));return parseMatrixGrid(rows)}
 function outputMatrix(matrix){const output=$('matrix-output');output.replaceChildren();output.classList.remove('error');if(typeof matrix==='number'){output.textContent=formatNumber(matrix);setModuleScreen('matrices','det(A)',formatSciResult(matrix));return}const table=document.createElement('div');table.className='matrix-result';for(const row of matrix){const line=document.createElement('div');line.className='matrix-row';for(const v of row){const cell=document.createElement('span');cell.textContent=formatNumber(v,8);line.append(cell)}table.append(line)}output.append(table);setModuleScreen('matrices','Resultado matricial',matrix.map(row=>row.map(v=>formatNumber(v,6)).join('   ')).join('  /  '))}
 $('matrix-size').addEventListener('change',draw);$('matrix-identity').addEventListener('click',draw);
 document.querySelectorAll('[data-matrix-op]').forEach(b=>b.addEventListener('click',()=>{try{const a=read('a'),op=b.dataset.matrixOp;let result;switch(op){case 'det':result=determinant(a);break;case 'inv':result=inverse(a);break;case 'trans':result=transpose(a);break;default:{const bb=read('b');result=op==='add'?addMatrix(a,bb):op==='sub'?addMatrix(a,bb,-1):multiplyMatrix(a,bb)}}outputMatrix(result)}catch(e){errorOutput('matrix-output',e)}}));draw();
}

async function initCalculus(){const {derivative,integrate}=await import('./modules/calculus.js?v=2');
 let mode='integral';const modeButtons={integral:$('integrate'),derivative:$('derive')};
 function choose(next){mode=next;for(const[key,btn]of Object.entries(modeButtons)){btn.classList.toggle('selected',key===next);btn.setAttribute('aria-pressed',String(key===next))}for(const label of document.querySelectorAll('[data-calc-input]'))label.classList.toggle('hidden',label.dataset.calcInput!==(mode==='integral'?'integral':'derivative'));setModuleScreen('calculus',mode==='integral'?'∫ f(x) dx — indica límites':'f′(x) — indica el punto','—')}
 $('integrate').addEventListener('click',()=>choose('integral'));
 $('derive').addEventListener('click',()=>choose('derivative'));
 $('calculate-calculus').addEventListener('click',()=>{try{
  if(mode==='integral'){
   const a=numberInput('calc-a'),b=numberInput('calc-b');const r=integrate($('calc-function').value,a,b,context());
   $('calculus-output').classList.remove('error');$('calculus-output').textContent=formatSciResult(r.value);$('calculus-meta').textContent=`Aproximación numérica · Error estimado ≤ ${formatNumber(r.error,4)} · ${r.evaluations} evaluaciones.`;
   setModuleScreen('calculus',`∫ [${formatNumber(a)}, ${formatNumber(b)}] ${$('calc-function').value} dx`,formatSciResult(r.value),'Integración numérica');
  }else{
   const x=numberInput('calc-point');const r=derivative($('calc-function').value,x,context());
   $('calculus-output').classList.remove('error');$('calculus-output').textContent=`f′(${formatNumber(x)}) ≈ ${formatSciResult(r.value)}`;
   $('calculus-meta').textContent=`Diferencias finitas centradas de cinco puntos (orden 4) · Paso h = ${formatNumber(r.step,5)}. El resultado es aproximado.`;
   setModuleScreen('calculus',`f′(${formatNumber(x)}) · ${$('calc-function').value}`,formatSciResult(r.value),'Derivada numérica');
  }
 }catch(e){errorOutput('calculus-output',e);$('calculus-meta').textContent='';setModuleScreen('calculus','Error de cálculo','ERROR',e.message)}});
 choose('integral');
}

async function initUnits(){const {UNIT_GROUPS,convertUnit}=await import('./modules/units.js?v=2');const category=$('unit-category'),from=$('unit-from'),to=$('unit-to');for(const group of Object.keys(UNIT_GROUPS))category.add(new Option(group,group));
 function populate(){from.replaceChildren();to.replaceChildren();for(const[key,[label]]of Object.entries(UNIT_GROUPS[category.value].units)){from.add(new Option(`${key} — ${label}`,key));to.add(new Option(`${key} — ${label}`,key))}to.selectedIndex=Math.min(1,to.options.length-1);update()}
 function update(){try{const v=numberInput('unit-value'),res=convertUnit(v,category.value,from.value,to.value);$('unit-result').value=formatNumber(res,14);$('units-note').textContent=`${formatNumber(v)} ${from.value} = ${formatNumber(res,14)} ${to.value}`;setModuleScreen('units',`${formatNumber(v)} ${from.value} → ${to.value}`,formatSciResult(res));$('units-note').style.color=''}catch(e){$('unit-result').value='';$('units-note').textContent=e.message;$('units-note').style.color='var(--accent)'}}
 category.addEventListener('change',populate);for(const id of ['unit-value','unit-from','unit-to'])$(id).addEventListener(id==='unit-value'?'input':'change',update);
 $('unit-swap').addEventListener('click',()=>{const a=from.value;from.value=to.value;to.value=a;const oldResult=$('unit-result').value;if(oldResult)$('unit-value').value=oldResult;update()});populate();
}

async function initConstants(){const list=$('constant-list'),search=$('constant-search'),groups=$('constant-group');for(const group of new Set(CONSTANTS.map(c=>c.group)))groups.add(new Option(group,group));
 function draw(){list.replaceChildren();const q=search.value.trim().toLocaleLowerCase('es');for(const c of CONSTANTS){if(groups.value&&c.group!==groups.value)continue;if(q&&!`${c.name} ${c.symbol} ${c.id} ${c.unit}`.toLocaleLowerCase('es').includes(q))continue;const card=document.createElement('article');card.className='constant-card';const symbol=document.createElement('div');symbol.className='constant-symbol';symbol.textContent=c.symbol;const main=document.createElement('div');const heading=document.createElement('h3');heading.textContent=c.name;const value=document.createElement('p');value.textContent=formatNumber(c.value,11)+' '+c.unit;const note=document.createElement('small');note.textContent=c.exact?'Exacta (definición SI)':(c.source||'Derivada del SI');main.append(heading,value,note);const btn=document.createElement('button');btn.textContent='Usar';btn.title='Insertar valor en la calculadora';btn.addEventListener('click',()=>{setModuleScreen('constants',c.name+' ('+c.symbol+')',formatSciResult(c.value),c.unit);showView('scientific').then(()=>insert('('+String(c.value)+')'))});card.append(symbol,main,btn);list.append(card)}if(!list.childElementCount)list.textContent='No se encontraron constantes.'}
 search.addEventListener('input',draw);groups.addEventListener('change',draw);draw();
}

async function initLaboratory(){const [{photoelectric},{idealGas}]=await Promise.all([import('./tools/photoelectric.js'),import('./tools/ideal-gas.js')]);
 document.querySelectorAll('[data-tool]').forEach(btn=>btn.addEventListener('click',()=>{for(const b of document.querySelectorAll('[data-tool]'))b.classList.toggle('selected',b===btn);for(const el of document.querySelectorAll('.tool-view'))el.classList.toggle('hidden',el.id!=='tool-'+btn.dataset.tool)}));
 function addField(container,label,value){const item=document.createElement('div');item.className='tool-result-item';const name=document.createElement('small');name.textContent=label;const val=document.createElement('strong');val.textContent=String(value);item.append(name,val);container.append(item)}
 $('photo-calc').addEventListener('click',()=>{const out=$('photo-result');out.classList.remove('error');out.replaceChildren();try{const r=photoelectric({wavelengthNm:numberInput('photo-wavelength'),workFunctionEv:numberInput('photo-work')});addField(out,'Emisión fotoeléctrica',r.emission?'SÍ':'NO');addField(out,'Energía del fotón',formatNumber(r.photonEv)+' eV');addField(out,'Energía cinética máxima',r.emission?formatNumber(r.kineticEv)+' eV':'No hay fotoelectrones');addField(out,'Potencial de frenado',r.emission?formatNumber(r.stoppingV)+' V':'—');addField(out,'Longitud de onda umbral',Number.isFinite(r.thresholdNm)?formatNumber(r.thresholdNm)+' nm':'Sin umbral finito');addField(out,'Frecuencia incidente',formatNumber(r.frequencyHz)+' Hz');setModuleScreen('laboratory','Efecto fotoeléctrico · λ='+formatNumber(numberInput('photo-wavelength'))+' nm',r.emission?formatNumber(r.kineticEv)+' eV':'No hay emisión','Energía cinética máxima')}catch(e){out.classList.add('error');out.textContent=e.message}});
 function gasControls(){for(const k of ['p','v','n','t'])$('gas-'+k).disabled=k===$('gas-solve').value}
 $('gas-solve').addEventListener('change',gasControls);gasControls();$('gas-calc').addEventListener('click',()=>{const out=$('gas-result');out.replaceChildren();out.classList.remove('error');try{const solve=$('gas-solve').value,fields={};for(const k of ['p','v','n','t'])fields[k]=k===solve?1:numberInput('gas-'+k);const r=idealGas({...fields,solve});const names={p:'Presión',v:'Volumen',n:'Cantidad',t:'Temperatura'},units={p:'Pa',v:'m³',n:'mol',t:'K'};for(const k of ['p','v','n','t'])addField(out,names[k]+(k===solve?' (resultado)':''),formatNumber(r[k])+' '+units[k]);setModuleScreen('laboratory','Gases ideales · PV=nRT',formatNumber(r[solve])+' '+units[solve],names[solve])}catch(e){out.classList.add('error');out.textContent=e.message}})
}
// Expose only a small, read-only diagnostic hook for automated regression tests.
Object.defineProperty(window,'TCScientific',{value:Object.freeze({getState:()=>({angle,ans,memory,historyCount:history.length,view:activeView})}),configurable:false});

async function initEquations(){
 const {solvePolynomial,solveLinearSystem}=await import('./modules/equations.js?v=2');
 const poly=$('polynomial-inputs'),sys=$('system-inputs');
 let tab='polynomial';
 function tabSelect(t){tab=t;for(const b of document.querySelectorAll('[data-equation-tab]'))b.classList.toggle('selected',b.dataset.equationTab===t);$('equation-polynomial').classList.toggle('hidden',t!=='polynomial');$('equation-system').classList.toggle('hidden',t!=='system');setModuleScreen('equations',t==='polynomial'?'P(x) = 0':'A·x = b','—')}
 for(const b of document.querySelectorAll('[data-equation-tab]'))b.addEventListener('click',()=>tabSelect(b.dataset.equationTab));
 function polyFields(){const n=Number($('polynomial-degree').value);poly.replaceChildren();for(let k=n;k>=0;k--){const label=document.createElement('label');label.textContent='a'+k;const input=document.createElement('input');input.type='text';input.inputMode='decimal';input.value=n===2?String(({2:1,1:-5,0:6})[k]):k===n?'1':'0';input.setAttribute('aria-label','Coeficiente de x elevado a '+k);label.append(input);poly.append(label)}}
 function sysFields(){const n=Number($('system-size').value);sys.replaceChildren();sys.style.gridTemplateColumns=`repeat(${n+1},minmax(0,1fr))`;for(let i=0;i<n;i++)for(let j=0;j<=n;j++){const label=document.createElement('label');label.textContent=j===n?'b'+(i+1):'a'+(i+1)+(j+1);const input=document.createElement('input');input.type='text';input.inputMode='decimal';input.value=j===n?String(i+1):i===j?'1':'0';input.setAttribute('aria-label','Fila '+(i+1)+', columna '+(j+1));label.append(input);sys.append(label)}}
 function render(text,screenExpr){$('equation-output').classList.remove('error');$('equation-output').textContent=text;setModuleScreen('equations',screenExpr,text.replaceAll('\n','  ·  '))}
 $('polynomial-degree').addEventListener('change',polyFields);$('system-size').addEventListener('change',sysFields);
 $('polynomial-solve').addEventListener('click',()=>{try{const c=[...poly.querySelectorAll('input')].map(input=>calculate(input.value,context()).value);const roots=solvePolynomial(c);const text=roots.map((z,i)=>`x${i+1} = ${formatNumber(z.re,12)}${z.im?(z.im>0?' + ':' - ')+formatNumber(Math.abs(z.im),12)+'i':''}`).join('\n');render(text,`Polinomio de grado ${c.length-1}`)}catch(e){errorOutput('equation-output',e);setModuleScreen('equations','Error','ERROR',e.message)}});
 $('system-solve').addEventListener('click',()=>{try{const n=Number($('system-size').value),values=[...sys.querySelectorAll('input')].map(input=>calculate(input.value,context()).value);const A=Array.from({length:n},(_,i)=>values.slice(i*(n+1),i*(n+1)+n)),b=Array.from({length:n},(_,i)=>values[i*(n+1)+n]);const x=solveLinearSystem(A,b);render(x.map((v,i)=>`x${i+1} = ${formatNumber(v,12)}`).join('\n'),`${n} ecuaciones lineales`)}catch(e){errorOutput('equation-output',e);setModuleScreen('equations','Error','ERROR',e.message)}});
 polyFields();sysFields();tabSelect('polynomial');
}

function renderFractionOutput(fraction){const pane=$('fraction-rendered');if(!pane)return;pane.replaceChildren();const parts=String(fraction).split('/');if(parts.length!==2)return;const ns='http://www.w3.org/1998/Math/MathML';const math=document.createElementNS(ns,'math'),frac=document.createElementNS(ns,'mfrac');for(const part of parts){const n=document.createElementNS(ns,'mn');n.textContent=part;frac.append(n)}math.append(frac);pane.append(math)}
function setupV02(){
 const menu=$('modes'),toggle=$('menu-toggle'),settings=$('settings-dialog'),fraction=$('fraction-dialog');
 toggle.addEventListener('click',()=>{menu.hidden=!menu.hidden;toggle.setAttribute('aria-expanded',String(!menu.hidden))});
 document.addEventListener('pointerdown',e=>{if(!menu.hidden&&!menu.contains(e.target)&&!toggle.contains(e.target)){menu.hidden=true;toggle.setAttribute('aria-expanded','false')}});
 $('settings-toggle').addEventListener('click',()=>settings.showModal());
 for(const [key,elId,method] of [['digits','setting-digits','number'],['notation','setting-notation','text'],['keyboard','setting-keyboard','text'],['entry','setting-entry','text'],['showFraction','setting-fraction','checked'],['saveHistory','setting-history','checked']]){
  const input=$(elId);input[method==='checked'?'checked':'value']=calcSettings[key];
  input.addEventListener('change',()=>{calcSettings[key]=method==='checked'?input.checked:method==='number'?Number(input.value):input.value;saveSettings();if(key==='keyboard')setKeyboard(calcSettings.keyboard);if(key==='entry')renderExpressionPreview();if(key==='showFraction'&&!input.checked)$('fraction-rendered')?.replaceChildren()});
 }
 const basic=$('basic-keypad');const extendedKeys=[...document.querySelectorAll('.key-extended')];
 function setKeyboard(mode){calcSettings.keyboard=mode;$('app').dataset.keyboard=mode;basic.classList.toggle('hidden',mode!=='basic');$('keypad').classList.toggle('hidden',mode==='basic');for(const key of extendedKeys)key.classList.toggle('hidden',mode!=='extended');for(const b of document.querySelectorAll('button[data-keyboard]'))b.classList.toggle('selected',b.dataset.keyboard===mode);saveSettings()}
 for(const b of document.querySelectorAll('button[data-keyboard]'))b.addEventListener('click',()=>setKeyboard(b.dataset.keyboard));setKeyboard(calcSettings.keyboard);
 const input=$('expression');renderExpressionPreview();
 function moveCursor(direction){input.focus();let pos=input.selectionStart??input.value.length;if(direction==='home')pos=0;else if(direction==='end')pos=input.value.length;else if(direction==='left'||direction==='up')pos=Math.max(0,pos-1);else if(direction==='right'||direction==='down')pos=Math.min(input.value.length,pos+1);input.setSelectionRange(pos,pos)}
 for(const b of document.querySelectorAll('[data-cursor]'))b.addEventListener('click',()=>{if(fraction.open&&['up','down'].includes(b.dataset.cursor)){(b.dataset.cursor==='up'?$('fraction-num'):$('fraction-den')).focus()}else moveCursor(b.dataset.cursor)});
 $('fraction-open').addEventListener('click',()=>{$('fraction-num').value='';$('fraction-den').value='';fraction.showModal();$('fraction-num').focus()});
 for(const id of ['fraction-num','fraction-den'])$(id).addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();(e.key==='ArrowDown'?$('fraction-den'):$('fraction-num')).focus()}if(e.key==='Enter'){e.preventDefault();$('fraction-insert').click()}});
 $('fraction-insert').addEventListener('click',()=>{const n=$('fraction-num').value.trim(),d=$('fraction-den').value.trim();if(!n||!d){$('fraction-num').focus();return}fraction.close();insert(`((${n})/(${d}))`);const preview=$('fraction-rendered');if(preview){preview.replaceChildren();const m=document.createElementNS('http://www.w3.org/1998/Math/MathML','math'),f=document.createElementNS('http://www.w3.org/1998/Math/MathML','mfrac');for(const text of [n,d]){const cell=document.createElementNS('http://www.w3.org/1998/Math/MathML','mtext');cell.textContent=text;f.append(cell)}m.append(f);preview.append(m)}renderExpressionPreview()});
}
setupV02();
