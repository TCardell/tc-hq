/** TYPE/16 Playtest 64.1: display-only grammatical alignment and evidence-led interpretation.
 * The original OEJTS question bank and scoring key remain unchanged.
 * Counts and positions are descriptive, not calibrated certainty or reliability.
 */
import {AXES} from './scoring.js';
import {TYPE_COPY} from './engine/interpretation-copy.js';

// Personalized renderings of OEJTS option text. No reordering or scoring changes.
// The raw OEJTS 1.2 wording remains in the canonical source manifest.
export const DISPLAY_OPTIONS_32=Object.freeze({
 es:[
  ['Hago listas','Confío en mi memoria'],
  ['Suelo ser escéptico/a','Quiero creer'],
  ['Me aburro al pasar tiempo a solas','Necesito tiempo a solas'],
  ['Acepto las cosas tal como son','No me satisface cómo están las cosas'],
  ['Mantengo mi habitación ordenada','Dejo las cosas donde sea'],
  ['Considero «robótico» un insulto','Aspiro a tener una mente mecánica'],
  ['Suelo ser enérgico/a','Suelo ser tranquilo/a'],
  ['Prefiero exámenes tipo test','Prefiero preguntas de desarrollo'],
  ['Tiendo a ser caótico/a','Tiendo a ser organizado/a'],
  ['Los comentarios me hieren fácilmente','No suelen herirme fácilmente los comentarios'],
  ['Trabajo mejor en grupo','Trabajo mejor a solas'],
  ['Me centro en el presente','Me centro en el futuro'],
  ['Planifico con mucha antelación','Planifico en el último momento'],
  ['Busco el respeto de los demás','Busco el cariño de los demás'],
  ['Las fiestas me dejan agotado/a','Las fiestas me dan energía'],
  ['Suelo encajar entre los demás','Suelo destacar entre los demás'],
  ['Mantengo abiertas mis opciones','Me comprometo con una decisión'],
  ['Quiero ser bueno/a reparando cosas','Quiero ser bueno/a ayudando a personas a mejorar'],
  ['Suelo hablar más','Suelo escuchar más'],
  ['Cuento qué ocurrió','Cuento qué significó'],
  ['Me pongo a trabajar enseguida','Dejo las tareas para más tarde'],
  ['Me guío por el corazón','Me guío por la cabeza'],
  ['Me quedo en casa','Salgo a divertirme'],
  ['Prefiero la visión de conjunto','Prefiero los detalles'],
  ['Suelo improvisar','Suelo prepararme'],
  ['Baso mi moralidad en la justicia','Baso mi moralidad en la compasión'],
  ['Me cuesta gritar muy fuerte','Me sale natural gritar a alguien que está lejos'],
  ['Me atrae más lo teórico','Me atrae más lo empírico'],
  ['Trabajo intensamente','Me divierto intensamente'],
  ['Me siento incómodo/a con las emociones','Valoro las emociones'],
  ['Me gusta actuar delante de otras personas','Evito hablar en público'],
  ['Quiero saber quién, qué y cuándo','Quiero saber por qué']
 ],
 en:[
  ['I make lists','I rely on my memory'],
  ['I tend to be sceptical','I want to believe'],
  ['I get bored spending time alone','I need time alone'],
  ['I accept things as they are','I am dissatisfied with how things are'],
  ['I keep my room tidy','I put things wherever'],
  ['I see “robotic” as an insult','I strive for a mechanical mind'],
  ['I tend to be energetic','I tend to be mellow'],
  ['I prefer multiple-choice tests','I prefer essay-style answers'],
  ['I tend to be chaotic','I tend to be organized'],
  ['My feelings are easily hurt','My feelings are not easily hurt'],
  ['I work best in groups','I work best alone'],
  ['I focus on the present','I focus on the future'],
  ['I plan far ahead','I plan at the last minute'],
  ['I want people’s respect','I want people’s love'],
  ['Parties wear me out','Parties energize me'],
  ['I tend to fit in','I tend to stand out'],
  ['I keep my options open','I commit to a decision'],
  ['I want to be good at fixing things','I want to be good at helping people improve'],
  ['I tend to talk more','I tend to listen more'],
  ['I describe what happened','I describe what it meant'],
  ['I get work done right away','I put tasks off until later'],
  ['I follow my heart','I follow my head'],
  ['I stay at home','I go out for fun'],
  ['I prefer the big picture','I prefer the details'],
  ['I tend to improvise','I tend to prepare'],
  ['I base morality on justice','I base morality on compassion'],
  ['I find it hard to yell loudly','Yelling to someone far away comes naturally'],
  ['I lean toward theory','I lean toward empirical evidence'],
  ['I work hard','I play hard'],
  ['I feel uncomfortable with emotions','I value emotions'],
  ['I like performing in front of people','I avoid public speaking'],
  ['I want to know who, what and when','I want to know why']
 ]
});

export function displayOptions(question,language='es'){
 if(question.id<=32){
  const options=DISPLAY_OPTIONS_32[language]?.[question.id-1];
  if(!options||options.length!==2)throw new Error('Unmapped original card '+question.id);
  return options;
 }
 return [question.a[language],question.b[language]];
}

const SIGNS=new Map(AXES.flatMap(axis=>axis.items.map(([id,sign])=>[id,sign])));
const AXIS_ORDER=['IE','SN','FT','JP'];
const STAGE_NAMES={
 es:{12:'Primera impresión',24:'Mapa en formación',32:'Retrato de referencia',48:'Contrastes cotidianos',64:'Retrato extendido'},
 en:{12:'First impression',24:'Mapping preferences',32:'Reference portrait',48:'Everyday contrasts',64:'Extended portrait'}
};
const COPY={
 es:{
  title:'Un análisis más profundo',intro:'Un retrato construido a partir de tus elecciones, no de suposiciones sobre ti.',
  summary:'Síntesis de tus preferencias',portrait:'La combinación de referencia',extendedPortrait:'La combinación exploratoria',
  noPortrait:'Todavía no hay una combinación definida en las cuatro dimensiones.',
  baseNote:'Este resumen describe únicamente el banco de 32 preguntas originales.',
  extendedNote:'Este segundo resumen interpreta el índice experimental de las preguntas contestadas. No es una tipología validada.',
  trend:'Cómo ha evolucionado la lectura',trendDetail:'Comparación recalculada con las respuestas registradas actualmente, incluidas las revisadas después de una parada. No es una medición de estabilidad.',
  open:'Abierta',contrast:'Coincidencias y contrastes',mixed:'Hay señales que se inclinan hacia ambos polos.',
  match:'Las preguntas nuevas y las originales apuntan hacia el mismo polo en esta dimensión.',
  differ:'Las respuestas nuevas apuntan al polo contrario. Merece la pena explorar el contexto, no etiquetarlo como error.',
  insufficient:'Faltan respuestas en uno de los bloques para establecer una comparación.',
  evidenceTitle:'Qué respuestas sustentan cada lectura',evidenceIntro:'Abre una dimensión para consultar ejemplos concretos de ambos polos. No son pruebas de un rasgo estable.',
  low:'Respuestas orientadas hacia',high:'Respuestas orientadas hacia',neutral:'Respuestas neutrales',
  noExamples:'No hay respuestas orientadas hacia este polo.',seenFrom:'Banco de referencia',seenNew:'Situaciones nuevas',
  gentle:'Inclinación ligera en las respuestas',clear:'Inclinación más marcada en las respuestas',
  balanced:'Sin una inclinación definida en las respuestas',notObserved:'Sin respuestas suficientes para una lectura',
  strong:'marcada',soft:'moderada',source:'Sin efecto de las preguntas adicionales sobre la puntuación OEJTS',
  cautious:'Una lectura de 64 ítems no es automáticamente más fiable que una de 32. Las preguntas nuevas necesitan pruebas de comprensión y validación.',
  skip:'Las omisiones se excluyen de los cálculos, no cuentan como respuestas neutrales.'
 },
 en:{
  title:'A deeper reading',intro:'A portrait based on your choices, not assumptions about you.',
  summary:'Your preference overview',portrait:'The reference combination',extendedPortrait:'The exploratory combination',
  noPortrait:'The four axes do not yet form an unambiguous combination.',
  baseNote:'This description comes only from the original 32-item bank.',
  extendedNote:'This description relates to an experimental index of answered items, not a validated typology.',
  trend:'How the reading changed',trendDetail:'Recalculated from currently recorded answers, including answers reviewed after a checkpoint. It does not measure stability.',
  open:'Unresolved',contrast:'Agreements and contrasts',mixed:'Some answers point toward each pole.',
  match:'The new and original answers lean toward the same pole on this axis.',
  differ:'The new answers lean toward the opposite pole. Context may help explain this; it is not an error.',
  insufficient:'One of the sets lacks enough answers for a comparison.',
  evidenceTitle:'Which answers contribute to the reading',evidenceIntro:'Expand an axis to see concrete examples pointing in both directions. They do not prove a fixed trait.',
  low:'Answers pointing toward',high:'Answers pointing toward',neutral:'Neutral answers',
  noExamples:'No answers point toward this pole.',seenFrom:'Reference bank',seenNew:'New situations',
  gentle:'Slight observed leaning',clear:'More pronounced observed leaning',
  balanced:'No clear observed leaning',notObserved:'Not enough answers yet',
  strong:'strong',soft:'moderate',source:'New items do not alter the original OEJTS reference score',
  cautious:'A 64-item reading is not automatically more reliable than a 32-item one. New questions need comprehension testing and validation.',
  skip:'Skipped items do not contribute to the calculations; they are not neutral answers.'
 }
};

const isValid=x=>Number.isInteger(x)&&x>=1&&x<=5;
const signOf=q=>q.id<=32?SIGNS.get(q.id):q.highPoleSide==='A'?-1:1;

/** Inspect answered questions only. Neither skip nor neutral counts as a pole. */
function analyzeAnswers(session,items){
 const all=[];
 for(const q of items){
  const answer=session.answers[q.id];
  if(!isValid(answer))continue;
  const centered=(answer-3)*signOf(q);
  all.push({id:q.id,axis:q.axis,answer,centered,source:q.id<=32?'reference':'new',item:q});
 }
 return all;
}
function codeAt(answers,items){
 return AXIS_ORDER.map(axis=>{
  const parts=items.filter(q=>q.axis===axis && isValid(answers[q.id]));
  const total=parts.reduce((acc,q)=>acc+(answers[q.id]-3)*signOf(q),0);
  if(!parts.length||total===0)return '?';
  return total>0?{IE:'E',SN:'N',FT:'T',JP:'P'}[axis]:{IE:'I',SN:'S',FT:'F',JP:'J'}[axis];
 }).join('');
}

/** More explanation, not a psychometric confidence estimator. */
export function renderDeepAnalysis({report,session,plan,locale='es',escapeHTML}){
 const lang=locale==='en'?'en':'es',w=COPY[lang],esc=escapeHTML;
 const sourceItems=plan.questions.filter(q=>q.id<=32);
 const completedItems=plan.questions.filter(q=>session.seen.includes(q.id));
 const observations=analyzeAnswers(session,completedItems);
 const type=report.interpretation.brief.type;
 const baselineCopy=type.readable?{title:type.title,summary:type.summary}:null;
 const expandedCode=report.combinedCode;
 const expandedCopy=report.checkpoint>32&&expandedCode?TYPE_COPY[expandedCode]?.[lang]:null;
 const caution=`<p class="depth-caution">${esc(w.cautious)} ${esc(w.source)}.</p>`;
 const originalNarrative=baselineCopy?`<div class="depth-portrait"><div class="depth-overline">${esc(w.portrait)} · ${esc(type.code)}</div><h3>${esc(baselineCopy.title)}</h3><p>${esc(baselineCopy.summary)}</p><small>${esc(w.baseNote)}</small></div>`:
   `<p class="depth-muted">${esc(w.noPortrait)}</p>`;
 const extendedNarrative=expandedCopy?`<div class="depth-portrait depth-experimental"><div class="depth-overline">${esc(w.extendedPortrait)} · ${esc(expandedCode)}</div><h3>${esc(expandedCopy.title)}</h3><p>${esc(expandedCopy.summary)}</p><small>${esc(w.extendedNote)}</small></div>`:'';
 const stageRows=plan.stages.filter(s=>s.checkpoint<=session.seen.length).map(stage=>{
  const slice=plan.stages.flatMap(s=>s.ids).slice(0,stage.checkpoint);
  const stageItems=plan.questions.filter(q=>slice.includes(q.id));
  let typeCode=codeAt(session.answers,stageItems);
  if(stage.checkpoint===32&&report.sourceFull)typeCode=report.sourceType;
  return `<li class="depth-stage"><span>${stage.checkpoint} · ${esc(STAGE_NAMES[lang][stage.checkpoint])}</span><b aria-label="${esc(w.summary)}">${esc(typeCode.replace(/\?/g,'·'))}</b></li>`;
 }).join('');
 const axisNames={
  es:{IE:['Introversión','Extraversión'],SN:['Sensación','Intuición'],FT:['Sentimiento','Pensamiento'],JP:['Juicio','Percepción']},
  en:{IE:['Introversion','Extraversion'],SN:['Sensing','Intuition'],FT:['Feeling','Thinking'],JP:['Judging','Perceiving']}
 }[lang];
 const scoreRows=AXIS_ORDER.map(axis=>{
  const entries=observations.filter(x=>x.axis===axis);
  const low=entries.filter(e=>e.centered<0).sort((a,b)=>Math.abs(b.centered)-Math.abs(a.centered)||a.id-b.id);
  const high=entries.filter(e=>e.centered>0).sort((a,b)=>Math.abs(b.centered)-Math.abs(a.centered)||a.id-b.id);
  const neutral=entries.filter(e=>e.centered===0).length;
  const centered=entries.reduce((acc,x)=>acc+x.centered,0);
  const degree=entries.length?Math.abs(centered)/(2*entries.length):0;
  const observed=entries.length===0?w.notObserved:centered===0?w.balanced:
   (degree<.3?w.gentle:w.clear);
  const renderSide=(items,pole)=>{
    const chosen=items.slice(0,3);
    const examples=chosen.map(row=>{
      const q=row.item,side=row.answer<3?'A':'B';
      const option=displayOptions(q,lang)[side==='A'?0:1];
      const degree=Math.abs(row.centered)===2?w.strong:w.soft;
      return `<li><span class="depth-source">Q${String(row.id).padStart(2,'0')} · ${esc(row.source==='new'?w.seenNew:w.seenFrom)} · ${esc(degree)}</span><span>${esc(option)}</span></li>`;
    }).join('');
    return `<div class="depth-side"><h4>${esc(pole)}</h4>${examples?`<ul>${examples}</ul>`:`<p>${esc(w.noExamples)}</p>`}</div>`;
  };
  return `<details class="depth-axis"><summary><strong>${esc(axisNames[axis].join(' / '))}</strong><span>${esc(observed)} · ${entries.length} / ${session.seen.filter(id=>plan.questions.find(q=>q.id===id)?.axis===axis).length}</span></summary><div class="depth-axis-content">${renderSide(low,w.low+' '+axisNames[axis][0])}${renderSide(high,w.high+' '+axisNames[axis][1])}<p class="depth-meta">${esc(w.neutral)}: ${neutral}. ${low.length&&high.length?esc(w.mixed):''}</p></div></details>`;
 }).join('');
 let contrasts='';
 if(report.checkpoint>32){
  const cards=AXIS_ORDER.map(axis=>{
   const a=report.extra[axis];const label=axisNames[axis].join(' / ');
   const sentence=(!a.originalCount||!a.answeredNew||!a.originalLetter||!a.newLetter)?w.insufficient:
    a.differingDirections?w.differ:w.match;
   const status=a.differingDirections?'depth-contrast-alert':'depth-contrast-muted';
   return `<p class="${status}"><strong>${esc(label)}:</strong> ${esc(sentence)}</p>`;
  }).join('');
  contrasts=`<section class="depth-section"><h3>${esc(w.contrast)}</h3>${cards}</section>`;
 }
 return `<section class="depth-report" aria-label="${esc(w.title)}"><h2>${esc(w.title)}</h2><p class="depth-lead">${esc(w.intro)}</p><section class="depth-section"><h3>${esc(w.summary)}</h3><div class="depth-portraits">${originalNarrative}${extendedNarrative}</div></section><section class="depth-section"><h3>${esc(w.trend)}</h3><p class="depth-muted">${esc(w.trendDetail)}</p><ol class="depth-timeline">${stageRows}</ol></section>${contrasts}<section class="depth-section"><h3>${esc(w.evidenceTitle)}</h3><p class="depth-muted">${esc(w.evidenceIntro)}</p><div class="depth-evidence">${scoreRows}</div></section>${caution}</section>`;
}

/** Developer-facing structural assertions; never used to manufacture confidence. */
export function auditDisplayOptions(){
 const errors=[];
 for(const lang of ['es','en']){
  const options=DISPLAY_OPTIONS_32[lang];
  if(options.length!==32)errors.push('Expected 32 original options for '+lang);
  for(const [i,pair] of options.entries()){
   if(pair.length!==2||!pair[0]?.trim()||!pair[1]?.trim())errors.push('Invalid Q'+(i+1)+' '+lang);
  }
 }
 return {ok:errors.length===0,errors};
}