/* SCE DOM player: reusable UI, no demo-specific logic. */
(function(root){root.SCE=root.SCE||{};root.SCE.player=(function playerAPI(){
 const M=globalThis.SCE.model, G=globalThis.SCE.gestures, A=globalThis.SCE.audio;
 const el=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e;};
 const symbols={left:"←",farLeft:"⇤",right:"→",farRight:"⇥",up:"↑",down:"↓"};
 function imageSource(value){
   if(typeof value!=="string"||!value)return "";
   if(/^data:image\/(?:png|jpeg|webp|gif|svg\+xml);(?:base64,|charset=utf-8,|utf8,)/i.test(value))return value;
   if(/^(?:https?:\/\/|\/\/|[a-z]+:)/i.test(value))return "";
   try{const u=new URL(value,document.baseURI);return u.origin===location.origin&&["http:","https:","file:"].includes(u.protocol)?u.href:"";}catch{return "";}
 }
 const themes={midnight:{bg:"#141c2a",card:"#f4ebd8",ink:"#262e3c",accent:"#ac8755",left:"#385d89",right:"#33765f"},paper:{bg:"#d9d5c9",card:"#fffdf4",ink:"#28302e",accent:"#927143",left:"#345c80",right:"#367657"},graphic:{bg:"#24252d",card:"#fff9ee",ink:"#171720",accent:"#c04b64",left:"#187b9e",right:"#a34b75"},forest:{bg:"#1d302b",card:"#e5eddf",ink:"#273b31",accent:"#748b56",left:"#496785",right:"#477149"}};
 function applyTheme(root,theme={}){
   const p=themes[theme.preset]||themes.midnight;
   for(const k of Object.keys(p)){const v=theme[k];root.style.setProperty("--sce-"+k,typeof v==="string"&&/^#[0-9a-f]{6}$/i.test(v)?v:p[k]);}
   const fonts={serif:"Georgia, serif",sans:"system-ui, sans-serif",mono:"ui-monospace, monospace"};
   root.style.setProperty("--sce-font",fonts[theme.font]||fonts.serif);
   const source=imageSource(theme.background);
   root.style.setProperty("--sce-background",source?'url('+JSON.stringify(source)+')':"none");
 }
 class Player{
  constructor(root,set,options={}){
   this.root=root;this.options=options;this.session=new M.Session(set);this.busy=false;this.destroyed=false;this.timer=0;
   this.sound=options.sound!==false;this.threshold=Number(options.threshold)||150;
   this.key=e=>{if(!root.contains(document.activeElement)&&this.options.globalKeys!==true)return;if(e.target.closest?.("input,textarea,select,button,[contenteditable]")&&!e.key.startsWith("Arrow"))return;if(e.target.closest?.("input,textarea,select,[contenteditable]"))return;
   const k=({ArrowLeft:"left",ArrowRight:"right",ArrowUp:"up",ArrowDown:"down",a:"farLeft",d:"farRight"})[e.key];if(k&&this.session.actions.includes(k)){e.preventDefault();this.choose(k);}};
   document.addEventListener("keydown",this.key);root.classList.add("sce-player");root.tabIndex=0;applyTheme(root,set.theme);this.render();
  }
  stop(){clearTimeout(this.timer);this.busy=false;if(this.unbind){this.unbind();this.unbind=null;}}
  destroy(){this.destroyed=true;this.stop();document.removeEventListener("keydown",this.key);this.root.replaceChildren();}
  restart(){this.stop();this.session.restart();this.last=null;this.render();}
  undo(){if(this.busy)return;if(this.session.undo()){this.last=null;this.render();}}
  button(label,handler,cls="sce-button"){const b=el("button",cls,label);b.type="button";b.addEventListener("click",handler);return b;}
  render(){
    if(this.destroyed)return;this.stop();const s=this.session.state,set=this.session.set,c=this.session.card,root=this.root;root.replaceChildren();
    const head=el("header","sce-head");head.append(el("div","sce-wordmark","SCE / "+(set.name||"Sin título")));const tools=el("div","sce-tools");
    const mute=this.button(this.sound?"♪ Sonido":"♪ Silencio",()=>{this.sound=!this.sound;mute.textContent=this.sound?"♪ Sonido":"♪ Silencio";mute.setAttribute("aria-pressed",String(this.sound));});mute.setAttribute("aria-pressed",String(this.sound));
    tools.append(mute,this.button("⛶",()=>{try{const p=document.fullscreenElement?document.exitFullscreen():root.requestFullscreen();p?.catch(()=>{});}catch{}}));head.append(tools);root.append(head);
    const display=el("div","sce-display");const d=set.display||{};
    if(d.progress!==false)display.append(el("span","","Cartas respondidas: "+s.history.length+(set.linear===false?"":" / "+set.cards.length)));
    if(d.score!==false)display.append(el("span","","Puntos: "+s.score));
    if(d.variables)for(const [k,v] of Object.entries(s.variables))display.append(el("span","",k+": "+v));
    if(display.childNodes.length)root.append(display);
    if(!c){
      const end=el("section","sce-end");end.append(el("span","sce-eyebrow","✦  FIN DEL SET  ✦"),el("h2","",set.endText||"Experiencia completada"),el("p","",s.history.length+" cartas respondidas"));
      if(d.score!==false)end.append(el("strong","sce-score",String(s.score)+" puntos"),el("p","",s.correct+" aciertos · "+s.incorrect+" errores"));
      end.append(this.button("Volver a empezar",()=>this.restart()),this.button("Deshacer última decisión",()=>this.undo()));root.append(end);this.options.onFinish?.(s);return;
    }
    const stage=el("div","sce-stage"),stack=el("div","sce-stack");stack.setAttribute("aria-hidden","true");stack.append(el("span","","✧"));
    const card=el("article","sce-card entering");this.card=card;const meta=el("div","sce-card-meta");meta.append(el("span","","CARTA "+String(s.history.length+1).padStart(2,"0")),el("span","","✦ ✧ ✦"),el("span","","SCE"));card.append(meta);
    const art=el("div","sce-art");const source=imageSource(c.image);
    if(source){const img=el("img");img.alt=c.imageAlt||"";img.draggable=false;img.src=source;img.addEventListener("error",()=>{art.replaceChildren(el("span","sce-art-mark","✧"));});art.append(img);}else art.append(el("span","sce-art-mark","✧"));
    card.append(art);if(c.character)card.append(el("div","sce-character",c.character));card.append(el("h2","sce-question",c.text));
    const sides=el("div","sce-sides");for(const k of ["left","right"]){const r=c.responses[k];sides.append(el("span","",this.session.actions.includes(k)?symbols[k]+" "+r.label:""));}card.append(sides);
    this.stamp=el("div","sce-stamp");this.stamp.setAttribute("aria-hidden","true");card.append(this.stamp);stage.append(stack,card);root.append(stage);
    this.hint=el("div","sce-hint","Arrastra la carta o utiliza los botones");this.hint.setAttribute("aria-live","polite");root.append(this.hint);
    const buttons=el("div","sce-responses");for(const k of this.session.actions){const b=this.button(symbols[k]+"  "+c.responses[k].label,()=>this.choose(k),"sce-response "+(k.toLowerCase().includes("left")?"left":k.toLowerCase().includes("right")?"right":"vertical"));b.dataset.action=k;buttons.append(b);}root.append(buttons);
    const foot=el("div","sce-foot");const undo=this.button("↶ Deshacer",()=>this.undo());undo.disabled=!s.history.length;foot.append(undo,this.button("Reiniciar",()=>this.restart()));root.append(foot);
    if(this.last&&this.last.feedback){const f=el("p","sce-feedback",this.last.feedback);f.setAttribute("role","status");root.append(f);}
    this.unbind=G.bind(card,{allowed:()=>this.session.actions,threshold:()=>Math.max(110,Math.min(210,this.threshold)),onPreview:k=>this.preview(k),onAnswer:k=>this.choose(k),isBusy:()=>this.busy});
    this.options.onRender?.(this);
  }
  preview(k){if(!this.stamp?.isConnected)return;const r=k&&this.session.card?.responses[k];this.stamp.textContent=r?symbols[k]+" "+r.label:"";this.stamp.className="sce-stamp"+(r?" visible "+(k.toLowerCase().includes("left")?"left":k.toLowerCase().includes("right")?"right":"vertical"):"");this.hint.textContent=r?r.label:"Arrastra la carta o utiliza los botones";}
  choose(k){if(this.busy||!this.session.actions.includes(k))return;this.busy=true;this.preview(k);if(this.sound){A.setEnabled(true);A.play(k==="down"?null:k);}
   const card=this.card;card.classList.remove("entering","dragging");const dx=k.toLowerCase().includes("left")?-1:k.toLowerCase().includes("right")?1:0,dy=k==="up"?-1:k==="down"?1:0;
   const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
   if(!reduced){card.style.transition="transform 260ms ease-in, opacity 250ms";card.style.transform="translate3d("+dx*Math.max(innerWidth,550)+"px,"+dy*Math.max(innerHeight,650)+"px,0) rotate("+dx*28+"deg)";card.style.opacity="0";}
   for(const b of this.root.querySelectorAll(".sce-response"))b.disabled=true;
   const advance=()=>{if(this.destroyed)return;this.last=this.session.answer(k);this.options.onAnswer?.(this.last,this.session.state);this.render();};if(reduced)advance();else this.timer=setTimeout(advance,270);
  }
 }
 return {Player,themes,applyTheme,imageSource,el,symbols};
})();})(globalThis);
