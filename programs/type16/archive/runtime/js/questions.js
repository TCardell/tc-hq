/**
 * OEJTS 1.2 — Eric Jorgenson (2015).
 * Items: CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
 * Source: https://openpsychometrics.org/tests/OJTS/development/OEJTS1.2.pdf
 * ES translations: TYPE/16 editorial DRAFT, not validated.
 * Each tuple is [EN left, EN right, ES left, ES right].
 */
const pairs = [
  ["makes lists","relies on memory","Hace listas","Confía en su memoria"],
  ["sceptical","wants to believe","Es escéptico/a","Quiere creer"],
  ["bored by time alone","needs time alone","Se aburre pasando tiempo a solas","Necesita tiempo a solas"],
  ["accepts things as they are","unsatisfied with the ways things are","Acepta las cosas tal como son","No le satisface cómo están las cosas"],
  ["keeps a clean room","just puts stuff where ever","Mantiene su habitación ordenada","Deja las cosas en cualquier sitio"],
  ["thinks 'robotic' is an insult","strives to have a mechanical mind","Considera «robótico» un insulto","Aspira a tener una mente mecánica"],
  ["energetic","mellow","Enérgico/a","Tranquilo/a"],
  ["prefer to take multiple choice test","prefer essay answers","Prefiere exámenes tipo test","Prefiere respuestas de desarrollo"],
  ["chaotic","organized","Caótico/a","Organizado/a"],
  ["easily hurt","thick-skinned","Se siente herido/a fácilmente","Es difícil herir sus sentimientos"],
  ["works best in groups","works best alone","Trabaja mejor en grupo","Trabaja mejor a solas"],
  ["focused on the present","focused on the future","Se centra en el presente","Se centra en el futuro"],
  ["plans far ahead","plans at the last minute","Planifica con mucha antelación","Planifica en el último momento"],
  ["wants people's respect","wants their love","Busca el respeto de los demás","Busca el cariño de los demás"],
  ["gets worn out by parties","gets fired up by parties","Las fiestas le dejan agotado/a","Las fiestas le dan energía"],
  ["fits in","stands out","Encaja entre los demás","Destaca entre los demás"],
  ["keeps options open","commits","Mantiene abiertas sus opciones","Se compromete con una decisión"],
  ["wants to be good at fixing things","wants to be good at fixing people","Quiere ser bueno/a reparando cosas","Quiere ser bueno/a ayudando a personas a mejorar"],
  ["talks more","listens more","Habla más","Escucha más"],
  ["when describing an event, will tell people what happened","when describing an event, will tell people what it meant","Al contar un suceso, explica qué ocurrió","Al contar un suceso, explica qué significó"],
  ["gets work done right away","procrastinates","Se pone a trabajar enseguida","Deja las tareas para más tarde"],
  ["follows the heart","follows the head","Sigue al corazón","Sigue a la cabeza"],
  ["stays at home","goes out on the town","Se queda en casa","Sale a divertirse"],
  ["wants the big picture","wants the details","Prefiere la visión de conjunto","Prefiere los detalles"],
  ["improvises","prepares","Improvisa","Se prepara"],
  ["bases morality on justice","bases morality on compassion","Basa la moralidad en la justicia","Basa la moralidad en la compasión"],
  ["finds it difficult to yell very loudly","yelling to others when they are far away comes naturally","Le cuesta gritar muy fuerte","Le sale natural gritar a alguien que está lejos"],
  ["theoretical","empirical","Teórico/a","Empírico/a"],
  ["works hard","plays hard","Trabaja intensamente","Se divierte intensamente"],
  ["uncomfortable with emotions","values emotions","Se siente incómodo/a con las emociones","Valora las emociones"],
  ["likes to perform in front of other people","avoids public speaking","Le gusta actuar delante de otras personas","Evita hablar en público"],
  ["likes to know 'who?', 'what?', 'when?'","likes to know 'why?'","Quiere saber quién, qué y cuándo","Quiere saber por qué"]
];

export const QUESTIONS = Object.freeze(pairs.map(([leftEn,rightEn,leftEs,rightEs],i)=>Object.freeze({
  id:i+1,
  left:{en:leftEn,es:leftEs},
  right:{en:rightEn,es:rightEs},
  source:"OEJTS-1.2",
  translationStatus:"draft"
})));

export const FAST_IDS = Object.freeze([3,12,22,25,15,20,14,13,11,32,26,17]);
export const ORDER = Object.freeze([...FAST_IDS,...QUESTIONS.map(q=>q.id).filter(id=>!FAST_IDS.includes(id))]);
export function getQuestion(id){ return QUESTIONS[id-1] || null; }
