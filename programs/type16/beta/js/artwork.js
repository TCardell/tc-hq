/**
 * TYPE/16 — Beta art system (12 geometric masters for 64 situations).
 * All artwork is original, handmade SVG: no fonts, images, generated clipart or dependencies.
 * Intentional reuse: one semantic symbol per question, three quiet background treatments.
 * Illustrations do not signal the direction of a scored answer.
 */
const INK='#455767', GOLD='#af8157', ROSE='#ad726e', PAPER='#eee3d0', BLUE='#788d93';
const PALETTE={INK,GOLD,ROSE,PAPER,BLUE};
const MASTERS={
 sanctuary:'<circle cx="108" cy="69" r="30" fill="{INK}"/><circle cx="122" cy="58" r="27" fill="{PAPER}"/><circle cx="154" cy="43" r="5" fill="{GOLD}"/><path d="M153 24v8m0 21v8m-19-18h8m21 0h8" stroke="{GOLD}" stroke-width="2"/>',
 threshold:'<path d="M75 119V57a35 35 0 0 1 70 0v62" fill="none" stroke="{INK}" stroke-width="4"/><path d="M89 119V57a21 21 0 0 1 42 0v62" fill="{BLUE}" fill-opacity=".26" stroke="{GOLD}" stroke-width="2.5"/><path d="M110 37v82" stroke="{INK}" stroke-width="2"/><circle cx="103" cy="87" r="3" fill="{ROSE}"/><circle cx="117" cy="87" r="3" fill="{ROSE}"/>',
 exchange:'<circle cx="84" cy="68" r="31" fill="none" stroke="{INK}" stroke-width="3.5"/><circle cx="136" cy="68" r="31" fill="none" stroke="{ROSE}" stroke-width="3.5"/><path d="M107 41q18 27 0 54" stroke="{GOLD}" stroke-width="2.5" fill="none"/><circle cx="72" cy="68" r="4" fill="{INK}"/><circle cx="148" cy="68" r="4" fill="{ROSE}"/><path d="M82 116h56" stroke="{GOLD}" stroke-width="2" stroke-linecap="round"/>',
 focus:'<circle cx="110" cy="70" r="47" fill="none" stroke="{GOLD}" stroke-width="2"/><circle cx="110" cy="70" r="31" fill="none" stroke="{INK}" stroke-width="3"/><circle cx="110" cy="70" r="13" fill="{BLUE}" fill-opacity=".28" stroke="{INK}" stroke-width="2.5"/><circle cx="110" cy="70" r="4" fill="{ROSE}"/><path d="M110 10v13m0 94v13M50 70h13m94 0h13" stroke="{GOLD}" stroke-width="2"/>',
 pattern:'<g fill="{BLUE}"><circle cx="77" cy="40" r="6"/><circle cx="110" cy="40" r="6"/><circle cx="143" cy="40" r="6"/><circle cx="77" cy="73" r="6"/><circle cx="110" cy="73" r="6"/><circle cx="143" cy="73" r="6"/><circle cx="77" cy="106" r="6"/><circle cx="110" cy="106" r="6"/><circle cx="143" cy="106" r="6"/></g><path d="M77 106L110 73 77 40h66v66" stroke="{GOLD}" stroke-width="2.7" fill="none" stroke-linejoin="round"/><g fill="{ROSE}"><circle cx="77" cy="40" r="6"/><circle cx="110" cy="73" r="6"/><circle cx="143" cy="106" r="6"/></g>',
 prism:'<path d="M110 25L61 112h98Z" fill="{BLUE}" fill-opacity=".17" stroke="{INK}" stroke-width="3.5" stroke-linejoin="round"/><path d="M33 76h60" stroke="{GOLD}" stroke-width="3" stroke-linecap="round"/><path d="M123 78l60-29m-60 29 63 0m-63 0 60 29" stroke="{ROSE}" stroke-width="2.8" stroke-linecap="round"/><circle cx="110" cy="78" r="4.2" fill="{GOLD}"/>',
 balance:'<path d="M110 27v88M70 45h80M93 119h34" stroke="{INK}" stroke-width="4" stroke-linecap="round"/><path d="M110 18l-10 12h20Z" fill="{ROSE}"/><path d="M72 45L57 92m15-47 15 47m61-47-15 47m15-47 15 47" fill="none" stroke="{GOLD}" stroke-width="2.5"/><path d="M39 92q18 25 36 0Zm106 0q18 25 36 0Z" fill="{BLUE}" fill-opacity=".6" stroke="{INK}" stroke-width="2" stroke-linejoin="round"/>',
 consideration:'<circle cx="91" cy="70" r="37" fill="{ROSE}" fill-opacity=".15" stroke="{ROSE}" stroke-width="3"/><circle cx="129" cy="70" r="37" fill="{INK}" fill-opacity=".12" stroke="{INK}" stroke-width="3"/><path d="M110 42q-18 28 0 56q18-28 0-56Z" fill="{GOLD}" fill-opacity=".5" stroke="{GOLD}" stroke-width="2"/><circle cx="110" cy="70" r="5" fill="{PAPER}"/><path d="M110 19v9m0 83v9" stroke="{GOLD}" stroke-width="2"/>',
 criteria:'<circle cx="110" cy="70" r="45" fill="none" stroke="{GOLD}" stroke-width="2"/><path d="M110 16l11 43 43 11-43 11-11 43-11-43-43-11 43-11Z" fill="{INK}" fill-opacity=".12" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/><path d="M110 28l11 42h-11Z" fill="{ROSE}"/><circle cx="110" cy="70" r="8" fill="{PAPER}" stroke="{GOLD}" stroke-width="2"/>',
 interval:'<path d="M79 28h62M79 113h62" stroke="{INK}" stroke-width="5" stroke-linecap="round"/><path d="M87 29q0 29 23 41-23 12-23 42h46q0-30-23-42 23-12 23-41Z" fill="{BLUE}" fill-opacity=".15" stroke="{GOLD}" stroke-width="3" stroke-linejoin="round"/><path d="M97 43h26L110 64Z" fill="{ROSE}" fill-opacity=".7"/><path d="M100 103l10-15 10 15Z" fill="{ROSE}" fill-opacity=".7"/><circle cx="110" cy="76" r="2.7" fill="{GOLD}"/>',
 paths:'<path d="M110 119V86M110 86Q78 74 66 45M110 86V39M110 86Q142 74 154 45" fill="none" stroke="{INK}" stroke-width="4" stroke-linecap="round"/><circle cx="110" cy="39" r="9" fill="{GOLD}"/><circle cx="66" cy="45" r="9" fill="{BLUE}"/><circle cx="154" cy="45" r="9" fill="{ROSE}"/><circle cx="110" cy="119" r="6" fill="{INK}"/><path d="M62 67h12m73 0h12" stroke="{GOLD}" stroke-width="2"/>',
 key:'<circle cx="85" cy="57" r="27" fill="none" stroke="{INK}" stroke-width="5"/><circle cx="85" cy="57" r="11" fill="none" stroke="{GOLD}" stroke-width="3"/><path d="M104 77L146 119h21v-13h-14V94h-13l-34-34" fill="none" stroke="{INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="164" cy="40" r="5" fill="{ROSE}"/>'
};
export const MOTIF_GROUPS=Object.freeze({
 IE:Object.freeze(['sanctuary','threshold','exchange']),
 SN:Object.freeze(['focus','pattern','prism']),
 FT:Object.freeze(['balance','consideration','criteria']),
 JP:Object.freeze(['interval','paths','key'])
});
const SEMANTIC_ASSIGNMENTS={
 sanctuary:[3,23,35,49,50],
 threshold:[15,31,33,36,51],
 exchange:[7,11,19,27,34,52],
 focus:[12,24,37,40,54,56],
 pattern:[8,16,38,39,55],
 prism:[4,20,28,32,53],
 balance:[18,22,26,41,59],
 consideration:[10,14,30,43,57,58],
 criteria:[2,6,42,44,60],
 interval:[1,13,21,46,62],
 paths:[9,25,29,47,48,64],
 key:[5,17,45,61,63]
};
export const MOTIF_BY_QUESTION=Object.freeze(Object.fromEntries(
 Object.entries(SEMANTIC_ASSIGNMENTS).flatMap(([symbol,ids])=>ids.map(id=>[id,symbol]))
));
export const MOTIF_NAMES=Object.freeze(Object.keys(MASTERS));
const frame=Object.freeze([
 '<circle cx="110" cy="71" r="65" fill="none" stroke="{GOLD}" stroke-opacity=".25" stroke-width="1.5"/>',
 '<path d="M34 34h12m-12 0v12m152-12h-12m12 0v12M34 107h12m-12 0V95m152 12h-12m12 0V95" stroke="{GOLD}" stroke-opacity=".4" stroke-width="1.6" fill="none"/>',
 '<path d="M42 41Q110 -9 178 41M42 108Q110 156 178 108" fill="none" stroke="{GOLD}" stroke-opacity=".3" stroke-width="1.5"/>'
]);
const hydrate=html=>html.replace(/\{(INK|GOLD|ROSE|PAPER|BLUE)\}/g,(_,key)=>PALETTE[key]);
export function getCardArt(id=1, variantOverride=null){
 const number=Number(id);
 const motif=MOTIF_BY_QUESTION[number]||'criteria';
 const variant=variantOverride===null?(number+Math.floor(number/8))%3:Math.max(0,Number(variantOverride)||0)%3;
 return '<svg viewBox="0 0 220 145" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">'
 +hydrate('<path d="M24 70h15M181 70h15" stroke="{GOLD}" stroke-width="1.5" stroke-opacity=".36"/>'
 +frame[variant]+MASTERS[motif])+'</svg>';
}
export function auditArtwork(questionBank){
 const errors=[],counts={};
 const all=Object.values(SEMANTIC_ASSIGNMENTS).flat();
 if(new Set(all).size!==64||all.length!==64)errors.push('Exactly 64 unique assignments required');
 for(let id=1;id<=64;id++){
  const motif=MOTIF_BY_QUESTION[id];
  if(!motif||!MASTERS[motif])errors.push('Missing or invalid motif for Q'+id);
  const question=questionBank?.find?.(q=>q.id===id);
  if(question){const allowed=MOTIF_GROUPS[question.axis];if(!allowed||!allowed.includes(motif))errors.push('Wrong visual family Q'+id);}
  counts[motif]=(counts[motif]||0)+1;
 }
 return {ok:errors.length===0,errors,counts};
}
