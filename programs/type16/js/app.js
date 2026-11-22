import {QUESTIONS, FAST_IDS, ORDER, getQuestion} from "./questions.js";
import {scoreAll} from "./scoring.js";

const KEY="type16.session.v1";
const root=document.getElementById("app");
const I18N={
  es:{
    intro:"DESCUBRE TU FORMA DE SER",headline:"Una baraja. Cuatro dimensiones. Dieciséis posibilidades.",
    welcomeText:"Desliza cartas para explorar tus preferencias. Empieza con 12 y decide después cuánto quieres profundizar.",
    start:"Empezar a descubrir",welcomeNote:"Sin registro · Guardado local · Resultados orientativos",
    quick:"Exploración inicial",full:"Exploración completa",review:"Preguntas pendientes",
    what:"¿Qué te describe mejor?",gesture:"Arrastra la carta o pulsa una opción",
    left:"Izquierda",right:"Derecha",both:"Entre ambas",little:"Algo",much:"Mucho",
    selection:["A mucho","A algo","Ambas","B algo","B mucho"],
    neutral:"Neutral",skip:"Saltar",undo:"Deshacer",results:"Mi perfil",
    quickResult:"Primera estimación",fullResult:"Resultado con escala completa",result:"Perfil provisional",
    typeApprox:"Tipo orientativo",unknown:"Dimensión sin definir",done:"Respuestas",of:"de",
    resultIntro:"Esta combinación resume tendencias en tus respuestas; no es una etiqueta fija ni una medida clínica.",
    preliminary:"Resultado exploratorio. Algunas dimensiones aún pueden cambiar; los porcentajes son posiciones dentro de las escalas, no probabilidades.",
    finalNote:"Has respondido los 32 ítems. Se ha aplicado la clave OEJTS 1.2; el formato de tarjetas y la traducción española no están validados por separado.",
    ties:"Hay dimensiones próximas al centro. La clave de la escala resuelve empates por convención, no porque exista una diferencia clara.",
    continue:"Seguir con más preguntas",revisit:"Contestar las omitidas",again:"Empezar desde cero",
    methodology:"¿Cómo se ha calculado?",methodBody:"Cada eje reúne ocho ítems, algunos con puntuación invertida. Solo con 32 respuestas puede reproducirse la puntuación original OEJTS 1.2. El recorrido de 12 preguntas es exploratorio, no una escala corta validada.",
    source:"Instrumento de Eric Jorgenson · CC BY-NC-SA 4.0 · Uso educativo no comercial",
    footer:"Proyecto experimental · No es el MBTI® oficial ni una prueba clínica",
    confirm:"¿Quieres empezar una sesión nueva y borrar el progreso guardado?",
    missed:"omitidas",returnQuiz:"Volver a las cartas",prev:"Última respuesta",
    count:"pregunta",noInfo:"Todavía faltan datos de esta dimensión.",
    ambiguous:"Cerca del centro",backToSite:"Volver a TC-HQ",answer:"Responder",
    hint:"En móvil puedes deslizar; los botones son la opción más precisa.",
    shortWarning:"Aún estamos revisando traducciones, ítems y gestos. No interpretes el tipo como una certeza.",
    switchLang:"EN",progress:"Tu progreso"
  },
  en:{
    intro:"DISCOVER YOUR PREFERENCES",headline:"One deck. Four dimensions. Sixteen possibilities.",
    welcomeText:"Swipe cards to explore preferences. Begin with 12, then decide how deeply you want to go.",
    start:"Start exploring",welcomeNote:"No signup · Saved locally · Exploratory results",
    quick:"First exploration",full:"Full exploration",review:"Skipped questions",
    what:"Which describes you better?",gesture:"Swipe the card or tap an option",
    left:"Left",right:"Right",both:"In between",little:"Somewhat",much:"Strongly",
    selection:["A strong","A slight","In between","B slight","B strong"],
    neutral:"Neutral",skip:"Skip",undo:"Undo",results:"My profile",
    quickResult:"First estimate",fullResult:"Full-scale result",result:"Provisional profile",
    typeApprox:"Exploratory type",unknown:"Unresolved dimension",done:"Answered",of:"of",
    resultIntro:"This combination summarizes your responses. It is not a fixed label or a clinical measure.",
    preliminary:"Exploratory result. Preferences may change; percentages are positions on the scales, not probabilities.",
    finalNote:"You answered all 32 items. OEJTS 1.2 scoring was applied; this card format and the Spanish draft translation have not been validated separately.",
    ties:"Some dimensions are close to the midpoint. The published scoring resolves ties by convention, not by evidence of a strong preference.",
    continue:"Explore more questions",revisit:"Review skipped items",again:"Start over",
    methodology:"How is this calculated?",methodBody:"Each axis has eight items, some reverse-scored. Only 32 answers reproduce the full OEJTS 1.2 calculation. The 12-item path is exploratory, not a validated short form.",
    source:"Eric Jorgenson instrument · CC BY-NC-SA 4.0 · Noncommercial educational use",
    footer:"Experimental project · Not the official MBTI® or a clinical test",
    confirm:"Start a new session and erase your saved progress?",
    missed:"skipped",returnQuiz:"Return to cards",prev:"Previous answer",
    count:"question",noInfo:"Not enough data yet for this dimension.",
    ambiguous:"Near the midpoint",backToSite:"Back to TC-HQ",answer:"Answer",
    hint:"You can swipe on mobile; buttons are the most precise option.",
    shortWarning:"Translations, items and gestures are under review. Do not treat this type as a certainty.",
    switchLang:"ES",progress:"Your progress"
  }
};
const AXIS_LABEL={
  es:{IE:["Introversión","Extraversión"],SN:["Sensación","Intuición"],FT:["Sentimiento","Pensamiento"],JP:["Juicio","Percepción"]},
  en:{IE:["Introversion","Extraversion"],SN:["Sensing","Intuition"],FT:["Feeling","Thinking"],JP:["Judging","Perceiving"]}
};
function newSession(lang){
  return {version:1,lang,screen:"welcome",cursor:0,mode:"main",reviewIds:[],reviewCursor:0,answers:{},history:[]};
}
function loadSession(){
  const lang=(navigator.language||"es").toLowerCase().startsWith("es")?"es":"en";
  try{
    const stored=JSON.parse(localStorage.getItem(KEY)||"null");
    if(stored?.version===1 && ["es","en"].includes(stored.lang) && stored.answers && Array.isArray(stored.history)){
      return {...newSession(lang),...stored};
    }
  }catch{}
  return newSession(lang);
}
let state=loadSession();
function t(name){return I18N[state.lang][name];}
function escapeHtml(value){
  return String(value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{}}
function snapshot(){
  const {history,...rest}=state;
  state.history.push(JSON.parse(JSON.stringify(rest)));
  if(state.history.length>45)state.history.shift();
}
function undo(){
  const last=state.history.pop();
  if(!last)return;
  const history=state.history;
  state={...last,history};
  save();render();
}
function activeId(){
  return state.mode==="review"?state.reviewIds[state.reviewCursor]:ORDER[state.cursor];
}
function answer(value){
  if(state.screen!=="quiz")return;
  const id=activeId();
  if(!id)return;
  if(value!==null && (!Number.isInteger(value)||value<1||value>5))return;
  snapshot();
  if(value===null)delete state.answers[id];else state.answers[id]=value;
  if(state.mode==="review"){
    state.reviewCursor++;
    if(state.reviewCursor>=state.reviewIds.length)state.screen="result";
  }else{
    state.cursor++;
    if(state.cursor===12 || state.cursor>=32)state.screen="result";
  }
  save();render();
}
function continueQuiz(){
  if(state.cursor<32){
    snapshot();state.mode="main";state.screen="quiz";save();render();return;
  }
  const missing=ORDER.filter(id=>!Number.isInteger(state.answers[id]));
  if(missing.length){
    snapshot();state.mode="review";state.reviewIds=missing;state.reviewCursor=0;state.screen="quiz";save();render();
  }
}
function reset(){
  if(!window.confirm(t("confirm")))return;
  state=newSession(state.lang);
  save();render();
}
function header(){
  const resultButton=state.screen==="quiz"?
    '<button type="button" class="mini-button" data-action="results">'+escapeHtml(t("results"))+'</button>':"";
  return '<header class="topbar"><a class="brand" href="../../home.html" aria-label="'+escapeHtml(t("backToSite"))+'">TC—HQ / TYPE16</a>'+
    '<div class="top-actions">'+resultButton+
    '<button type="button" class="mini-button" data-action="language" aria-label="Change language">'+t("switchLang")+'</button></div></header>';
}
function footer(){
  return '<footer class="footer">'+escapeHtml(t("footer"))+
    ' · <a href="https://openpsychometrics.org/tests/OJTS/development/OEJTS1.2.pdf" target="_blank" rel="noopener noreferrer">OEJTS 1.2 ↗</a></footer>';
}
function welcome(){
  return '<section class="hero" aria-labelledby="hero-title"><div class="hero-cards" aria-hidden="true">'+
    '<div class="hero-card"></div><div class="hero-card"></div><div class="hero-card"><span class="hero-star">✦</span></div></div>'+
    '<div class="micro">'+escapeHtml(t("intro"))+'</div>'+
    '<h1 class="hero-title" id="hero-title">TYPE<em>/</em>16</h1>'+
    '<p>'+escapeHtml(t("headline"))+'</p><p>'+escapeHtml(t("welcomeText"))+'</p>'+
    '<button type="button" data-action="start" class="primary">'+escapeHtml(t("start"))+' →</button>'+
    '<div class="small-print">'+escapeHtml(t("welcomeNote"))+'<br>'+escapeHtml(t("shortWarning"))+'</div></section>';
}
function question(){
  const id=activeId(),q=getQuestion(id);
  if(!q){state.screen="result";save();return result();}
  const step=state.mode==="review"?state.reviewCursor+1:state.cursor+1;
  const max=state.mode==="review"?state.reviewIds.length:(state.cursor<12?12:32);
  const fraction=Math.round(100*Math.min(1,step/max));
  const stage=state.mode==="review"?t("review"):(state.cursor<12?t("quick"):t("full"));
  const left=escapeHtml(q.left[state.lang]),right=escapeHtml(q.right[state.lang]);
  const choices=t("selection").map((label,i)=>
    '<button type="button" class="choice" data-action="answer" data-value="'+(i+1)+'" aria-label="'+escapeHtml(label)+'">'+
    '<span class="choice-number">'+(i+1)+'</span><span class="choice-desc">'+escapeHtml(label)+'</span></button>').join("");
  return '<section class="quiz" aria-labelledby="question-title">'+
    '<div class="progress-head"><span>'+escapeHtml(stage)+'</span><span>'+step+' / '+max+'</span></div>'+
    '<div class="progress" role="progressbar" aria-label="'+escapeHtml(t("progress"))+'" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+fraction+'"><div class="progress-fill" style="width:'+fraction+'%"></div></div>'+
    '<div class="question-subtitle">'+escapeHtml(t("gesture"))+'</div>'+
    '<div class="card-viewport"><div class="card-shadow" aria-hidden="true"></div>'+
    '<article class="prompt-card" id="swipe-card" aria-label="'+escapeHtml(t("count"))+' '+id+'">'+
    '<div class="card-ornament"><span>TYPE / 16</span><span>✦ '+String(id).padStart(2,"0")+' ✦</span></div>'+
    '<div class="card-symbol" aria-hidden="true"><span class="orb"></span></div>'+
    '<h2 class="card-question" id="question-title" tabindex="-1">'+escapeHtml(t("what"))+'</h2>'+
    '<div class="pair"><div class="pair-side"><span class="pair-letter">A ←</span><p>'+left+'</p></div>'+
    '<div class="pair-side"><span class="pair-letter">→ B</span><p>'+right+'</p></div></div>'+
    '<div class="card-bottom"><span>← A</span><span>✧</span><span>B →</span></div></article></div>'+
    '<div class="drag-status" id="drag-status" aria-live="polite">'+escapeHtml(t("hint"))+'</div>'+
    '<div class="choices" role="group" aria-label="'+escapeHtml(t("answer"))+'">'+choices+'</div>'+
    '<div class="action-pair"><button class="mini-button" type="button" data-action="undo" '+(state.history.length?"":"disabled")+'>'+
      '↶ '+escapeHtml(t("undo"))+'</button><button class="mini-button" type="button" data-action="skip">'+escapeHtml(t("skip"))+' ↓</button></div></section>';
}
function result(){
  const s=scoreAll(state.answers);
  const type=s.complete?s.officialType:s.provisional;
  const title=s.complete?t("fullResult"):(state.cursor>=12?t("quickResult"):t("result"));
  const axisRows=s.axes.map(axis=>{
    const labels=AXIS_LABEL[state.lang][axis.id];
    const marker=axis.position===null?"":'<span class="axis-marker" style="left:'+Math.max(2,Math.min(98,axis.position)).toFixed(1)+'%"></span>';
    const position=axis.position===null?t("noInfo"):(
      (Math.round(axis.position))+'% · '+axis.count+'/8 · '+(axis.ambiguous?t("ambiguous"):(axis.preferred||"—"))
    );
    return '<div class="axis-row"><div class="axis-labels"><span>'+escapeHtml(labels[0])+' ('+axis.low+')</span>'+
      '<span>'+escapeHtml(labels[1])+' ('+axis.high+')</span></div>'+
      '<div class="axis-track" aria-label="'+escapeHtml(labels.join(" – "))+'">'+marker+'</div>'+
      '<div class="axis-numbers"><span>'+escapeHtml(axis.id)+'</span><span>'+escapeHtml(position)+'</span></div></div>';
  }).join("");
  const hasTie=s.axes.some(axis=>axis.ambiguous);
  const missing=ORDER.filter(id=>!Number.isInteger(state.answers[id])).length;
  const nextText=state.cursor<32?t("continue"):(missing?t("revisit"):null);
  const nextButton=nextText?'<button class="primary" type="button" data-action="continue">'+escapeHtml(nextText)+' →</button>':"";
  return '<section class="result" aria-labelledby="result-title">'+
    '<div class="result-card"><div class="result-header"><span>TYPE / 16</span><span>'+escapeHtml(title)+'</span></div>'+
    '<h1 class="result-type" id="result-title">'+escapeHtml(type)+'</h1>'+
    '<div class="result-subtitle">'+escapeHtml(t("typeApprox"))+' · '+s.answered+' / 32 '+escapeHtml(t("done").toLowerCase())+'</div>'+
    '<div class="axes">'+axisRows+'</div></div>'+
    '<p class="result-copy">'+escapeHtml(t("resultIntro"))+'</p>'+
    '<div class="result-note">'+escapeHtml(s.complete?t("finalNote"):t("preliminary"))+'</div>'+
    (hasTie?'<div class="result-note">'+escapeHtml(t("ties"))+'</div>':"")+
    '<div class="result-actions">'+nextButton+
    '<button class="secondary" type="button" data-action="undo" '+(state.history.length?"":"disabled")+'>'+escapeHtml(t("undo"))+'</button>'+
    '<button class="secondary" type="button" data-action="reset">'+escapeHtml(t("again"))+'</button></div>'+
    '<details class="disclosure"><summary>'+escapeHtml(t("methodology"))+'</summary><p>'+
    escapeHtml(t("methodBody"))+'</p><p>'+escapeHtml(t("source"))+'</p></details></section>';
}
function render(){
  document.documentElement.lang=state.lang;
  const page=state.screen==="welcome"?welcome():state.screen==="quiz"?question():result();
  root.innerHTML='<main class="shell">'+header()+page+footer()+'</main>';
  if(state.screen==="quiz")bindSwipe();
}
root.addEventListener("click",event=>{
  const button=event.target.closest("button[data-action]");
  if(!button || button.disabled)return;
  switch(button.dataset.action){
    case "start":state.screen="quiz";save();render();break;
    case "language":state.lang=state.lang==="es"?"en":"es";save();render();break;
    case "answer":answer(Number(button.dataset.value));break;
    case "skip":answer(null);break;
    case "undo":undo();break;
    case "results":snapshot();state.screen="result";save();render();break;
    case "continue":continueQuiz();break;
    case "reset":reset();break;
  }
});
function bindSwipe(){
  const card=document.getElementById("swipe-card");
  const status=document.getElementById("drag-status");
  if(!card)return;
  let start=null;
  const resetVisual=()=>{
    card.classList.remove("dragging");
    card.style.transform="";
    status.classList.remove("active");
    status.textContent=t("hint");
  };
  const decision=(dx,dy)=>{
    if(Math.abs(dy)>75 && Math.abs(dy)>Math.abs(dx)*1.18){
      return dy<0?{value:3,label:t("neutral")}:{value:null,label:t("skip")};
    }
    if(Math.abs(dx)<68 || Math.abs(dx)<Math.abs(dy)*1.18)return null;
    const strong=Math.abs(dx)>=Math.max(115,card.clientWidth*.38);
    const value=dx<0?(strong?1:2):(strong?5:4);
    return {value,label:t("selection")[value-1]};
  };
  card.addEventListener("pointerdown",event=>{
    if(event.button!==0)return;
    start={x:event.clientX,y:event.clientY,id:event.pointerId};
    card.setPointerCapture(event.pointerId);
    card.classList.add("dragging");
  });
  card.addEventListener("pointermove",event=>{
    if(!start || start.id!==event.pointerId)return;
    const dx=event.clientX-start.x,dy=event.clientY-start.y;
    card.style.transform="translate("+dx+"px,"+dy+"px) rotate("+(dx*.035)+"deg)";
    const action=decision(dx,dy);
    status.textContent=action?action.label:t("gesture");
    status.classList.toggle("active",Boolean(action));
  });
  card.addEventListener("pointerup",event=>{
    if(!start || start.id!==event.pointerId)return;
    const action=decision(event.clientX-start.x,event.clientY-start.y);
    start=null;
    resetVisual();
    if(action)answer(action.value);
  });
  card.addEventListener("pointercancel",()=>{start=null;resetVisual();});
}
render();
