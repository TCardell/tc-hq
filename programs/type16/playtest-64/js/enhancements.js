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
  title:'Más allá de las cuatro letras',intro:'Una mirada a tus preferencias, sus coincidencias y los matices que aparecen al responder.',
  summary:'Tu combinación en detalle',portrait:'Lo que muestran las primeras cartas',extendedPortrait:'Las preferencias en nuevas situaciones',
  noPortrait:'Todavía no hay una combinación definida en las cuatro dimensiones.',
  baseNote:'La primera mirada a tu forma de ser.',
  extendedNote:'Una mirada complementaria a tus elecciones cotidianas.',
  trend:'Tu retrato a lo largo del viaje',trendDetail:'Observa cómo se va dibujando tu combinación al conocer nuevas facetas de ti.',
  open:'Abierta',contrast:'Coincidencias y contrastes',mixed:'Hay señales que se inclinan hacia ambos polos.',
  match:'Las preguntas nuevas y las originales apuntan hacia el mismo polo en esta dimensión.',
  differ:'Las respuestas nuevas apuntan al polo contrario. Merece la pena explorar el contexto, no etiquetarlo como error.',
  insufficient:'Faltan respuestas en uno de los bloques para establecer una comparación.',
  evidenceTitle:'De dónde nace cada tendencia',evidenceIntro:'Descubre qué elecciones apoyan cada inclinación y cuáles aportan matices distintos.',
  low:'Respuestas orientadas hacia',high:'Respuestas orientadas hacia',neutral:'Respuestas neutrales',
  noExamples:'No hay respuestas orientadas hacia este polo.',seenFrom:'Banco de referencia',seenNew:'Situaciones nuevas',
  gentle:'Inclinación ligera en las respuestas',clear:'Inclinación más marcada en las respuestas',
  balanced:'Sin una inclinación definida en las respuestas',notObserved:'Sin respuestas suficientes para una lectura',
  strong:'marcada',soft:'moderada',source:'Las situaciones nuevas complementan la referencia de las primeras cartas',
  cautious:'Este retrato describe tendencias de tus respuestas, no una verdad definitiva sobre tu personalidad.',
  skip:'Las omisiones se excluyen de los cálculos, no cuentan como respuestas neutrales.'
 },
 en:{
  title:'Beyond the four letters',intro:'A closer look at your preferences, recurring patterns and unexpected nuances.',
  summary:'Your combination in detail',portrait:'What the first cards reveal',extendedPortrait:'Preferences in new situations',
  noPortrait:'The four axes do not yet form an unambiguous combination.',
  baseNote:'A first perspective on your tendencies.',
  extendedNote:'A complementary perspective from everyday choices.',
  trend:'Your portrait along the journey',trendDetail:'See how your four-letter portrait takes shape as new facets emerge.',
  open:'Unresolved',contrast:'Agreements and contrasts',mixed:'Some answers point toward each pole.',
  match:'The new and original answers lean toward the same pole on this axis.',
  differ:'The new answers lean toward the opposite pole. Context may help explain this; it is not an error.',
  insufficient:'One of the sets lacks enough answers for a comparison.',
  evidenceTitle:'Where your tendencies come from',evidenceIntro:'Explore which choices support each tendency and which add nuance.',
  low:'Answers pointing toward',high:'Answers pointing toward',neutral:'Neutral answers',
  noExamples:'No answers point toward this pole.',seenFrom:'Reference bank',seenNew:'New situations',
  gentle:'Slight observed leaning',clear:'More pronounced observed leaning',
  balanced:'No clear observed leaning',notObserved:'Not enough answers yet',
  strong:'strong',soft:'moderate',source:'The new situations complement the original reference portrait',
  cautious:'This portrait describes patterns in your answers, not a definitive statement about your personality.',
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

// Editorial interpretation: separate from scoring. No diagnosis, norming or invented confidence.
const PORTRAIT_COPY={
 es:{
  headline:'Tu personalidad, en perspectiva',intro:'A medida que respondes, empieza a aparecer una forma de relacionarte con el mundo. No son etiquetas cerradas: son preferencias que pueden variar según el momento.',
  tentative:'El perfil que empieza a dibujarse',codeLead:'Por ahora, la combinación que sugieren tus respuestas es',
  noCode:'Todavía hay preferencias muy próximas entre sí. Eso también forma parte de tu retrato: no necesitas encajar a la fuerza en cuatro letras.',
  patterns:'Cómo se expresa en tu día a día',twoSided:'Aparecen elecciones en ambos sentidos. Puede que adaptes este estilo según la situación.',
  soft:'La inclinación es suave y admite bastante variación.',missing:'Aún quedan aspectos por descubrir en esta dimensión.',
  overview:'Qué significan las cuatro dimensiones',reflect:'Tus siguientes decisiones pueden afinar este retrato, aportar ejemplos nuevos o mostrar excepciones interesantes.',
  axis:{
   IE:{name:'Energía y relación con los demás',legend:'I: Introversión · E: Extraversión',
     low:['I · Introversión','Parece que valoras el espacio para reflexionar, recargar energía o desarrollar algunas ideas por tu cuenta. Eso no impide disfrutar de la compañía.'],
     high:['E · Extraversión','En varias situaciones tiendes a involucrarte en el intercambio con otras personas y a desarrollar ideas mientras interactúas. Esto no significa querer compañía siempre.'],
     open:'Por ahora alternas entre momentos de interacción y momentos de reflexión individual.'},
   SN:{name:'Percepción y formas de explorar',legend:'S: Sensación (Sensing) · N: Intuición (iNtuition)',
     low:['S · Sensación','Tus elecciones tienden a partir de hechos, ejemplos y detalles que puedes observar directamente antes de buscar una interpretación más amplia.'],
     high:['N · Intuición','Tiendes a fijarte en conexiones, posibilidades y patrones generales, incluso cuando todavía no están todos los detalles disponibles.'],
     open:'A veces partes de detalles concretos y otras de conexiones o posibilidades generales.'},
   FT:{name:'Criterios al decidir',legend:'F: Sentimiento (Feeling) · T: Pensamiento (Thinking)',
     low:['F · Sentimiento','Parece importante para ti considerar los valores, las personas implicadas y el impacto humano de las decisiones. Esto no excluye el análisis.'],
     high:['T · Pensamiento','Tus elecciones suelen dar peso a la coherencia de los argumentos, los criterios y las consecuencias lógicas. Esto no implica falta de sensibilidad.'],
     open:'Tus respuestas reparten el peso entre los criterios analíticos y la consideración personal.'},
   JP:{name:'Organización y posibilidades',legend:'J: Juicio (Judging) · P: Percepción (Perceiving)',
     low:['J · Juicio','Parece que agradeces ordenar las posibilidades, preparar etapas y dar cierre a decisiones cuando lo consideras oportuno.'],
     high:['P · Percepción','Tiendes a mantener alternativas abiertas y a ajustar el camino conforme descubres información o surgen oportunidades.'],
     open:'Según el contexto, puedes preferir tanto organizar como explorar opciones abiertas.'}
  }
 },
 en:{
  headline:'Your personality, in perspective',intro:'With each answer, a picture of how you engage with the world begins to emerge. These are not fixed labels: preferences can vary with context.',
  tentative:'The profile beginning to emerge',codeLead:'For now, the combination suggested by your choices is',
  noCode:'Some preferences are still very close. That too is part of your portrait: you do not have to fit neatly into four letters.',
  patterns:'How these preferences appear in everyday life',twoSided:'Your answers point in both directions. Your approach may vary with the situation.',
  soft:'This leaning is gentle and leaves room for variation.',missing:'There is still more to explore on this dimension.',
  overview:'What the four dimensions mean',reflect:'Your next choices may refine this portrait, add examples or reveal interesting exceptions.',
  axis:{
   IE:{name:'Energy and connecting with others',legend:'I: Introversion · E: Extraversion',
     low:['I · Introversion','You may value space to reflect, recharge or develop ideas on your own. This does not mean you cannot enjoy company.'],
     high:['E · Extraversion','In several situations you tend to engage with others and work through ideas while interacting. This does not mean wanting company all the time.'],
     open:'For now you alternate between interacting with others and reflecting independently.'},
   SN:{name:'Perception and exploration',legend:'S: Sensing · N: iNtuition',
     low:['S · Sensing','Your choices tend to start from tangible facts, examples and details before turning to a wider interpretation.'],
     high:['N · iNtuition','You often notice patterns, connections and wider possibilities even before every detail is available.'],
     open:'Sometimes you start from tangible details, and sometimes from wider connections and possibilities.'},
   FT:{name:'Criteria for decisions',legend:'F: Feeling · T: Thinking',
     low:['F · Feeling','You may put weight on values, the people involved and the human impact of decisions. This does not exclude analysis.'],
     high:['T · Thinking','You often weigh coherent arguments, criteria and logical consequences. This does not imply a lack of sensitivity.'],
     open:'Your answers spread emphasis across analytical criteria and personal considerations.'},
   JP:{name:'Structure and open options',legend:'J: Judging · P: Perceiving',
     low:['J · Judging','You may prefer setting an order, preparing stages and bringing decisions to a close when it helps.'],
     high:['P · Perceiving','You may prefer leaving options open and adjusting your path when new information or opportunities appear.'],
     open:'Depending on the context, you may favour either structure or open-ended exploration.'}
  }
 }
};
function renderProfileContext({report,session,plan,lang,esc}){
 const w=PORTRAIT_COPY[lang],items=plan.questions.filter(q=>session.seen.includes(q.id));
 const observed=analyzeAnswers(session,items),code=codeAt(session.answers,items);
 const copy=code.includes('?')?null:TYPE_COPY[code]?.[lang];
 const stage=report.checkpoint;
 const isPreliminary=stage<32||!report.sourceFull;
 const codeMarkup=copy?
   '<div class="portrait-code"><span>'+esc(isPreliminary?w.tentative:w.codeLead)+'</span><strong>'+esc(code)+'</strong><h3>'+esc(copy.title)+'</h3><p>'+esc(copy.summary)+'</p></div>':
   '<div class="portrait-code portrait-open"><h3>'+esc(w.tentative)+'</h3><p>'+esc(w.noCode)+'</p></div>';
 const section=AXIS_ORDER.map(axis=>{
  const ax=w.axis[axis],rows=observed.filter(r=>r.axis===axis),sum=rows.reduce((total,r)=>total+r.centered,0);
  const low=rows.filter(r=>r.centered<0).length,high=rows.filter(r=>r.centered>0).length;
  const meaningful=rows.length>=2;
  const leaning=meaningful&&sum!==0?(sum<0?ax.low:ax.high):null;
  const variation=low>0&&high>0?w.twoSided:(!meaningful?w.missing:Math.abs(sum)/(2*rows.length)<.25?w.soft:'');
  return '<article class="portrait-dimension"><div class="portrait-axis-top"><span>'+esc(axis.replace('IE','I · E').replace('SN','S · N').replace('FT','F · T').replace('JP','J · P'))+'</span><small>'+rows.length+' / '+(stage<=32?'8':'16')+'</small></div><h4>'+esc(ax.name)+'</h4><p class="portrait-axis-legend">'+esc(ax.legend)+'</p><h5>'+esc(leaning?leaning[0]:(lang==='es'?'Preferencia abierta':'Open preference'))+'</h5><p>'+esc(leaning?leaning[1]:ax.open)+'</p>'+(variation?'<p class="portrait-nuance">'+esc(variation)+'</p>':'')+'</article>';
 }).join('');
 return '<section class="depth-section portrait-context" aria-label="'+esc(w.headline)+'"><div class="portrait-kicker">✧ · TYPE / XVI</div><h3>'+esc(w.headline)+'</h3><p class="portrait-context-lead">'+esc(w.intro)+'</p>'+codeMarkup+'<h3 class="portrait-dim-title">'+esc(w.overview)+'</h3><div class="portrait-dimension-grid">'+section+'</div><p class="portrait-reflection">'+esc(w.reflect)+'</p></section>';
}

export function renderDeepAnalysis({report,session,plan,locale='es',escapeHTML}){
 const lang=locale==='en'?'en':'es',w=COPY[lang],esc=escapeHTML;
 const portrait=renderProfileContext({report,session,plan,lang,esc});
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
 return `<section class="depth-report" aria-label="${esc(w.title)}"><h2>${esc(w.title)}</h2><p class="depth-lead">${esc(w.intro)}</p>${portrait}<section class="depth-section"><h3>${esc(w.summary)}</h3><div class="depth-portraits">${originalNarrative}${extendedNarrative}</div></section><section class="depth-section"><h3>${esc(w.trend)}</h3><p class="depth-muted">${esc(w.trendDetail)}</p><ol class="depth-timeline">${stageRows}</ol></section>${contrasts}<section class="depth-section"><h3>${esc(w.evidenceTitle)}</h3><p class="depth-muted">${esc(w.evidenceIntro)}</p><div class="depth-evidence">${scoreRows}</div></section>${caution}</section>`;
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