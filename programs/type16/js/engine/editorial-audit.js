/** TYPE/16: 32-item bilingual editorial audit, separate from scoring.
 * Original OEJTS 1.2 items: Eric Jorgenson (2015), CC BY-NC-SA 4.0.
 * https://openpsychometrics.org/tests/OJTS/development/OEJTS1.2.pdf
 * All Spanish candidates are UNVALIDATED and NOT used by the engine.
 */
export const REVIEW_VERSION="oejts12-editorial-audit-2026-11-22-v1";
const sourceRecords=[
  {
    "id": 1,
    "sourceId": "OEJTS12:Q01",
    "axis": "JP",
    "sign": 1,
    "sourceEnglish": {
      "left": "makes lists",
      "right": "relies on memory"
    },
    "currentDraftSpanish": {
      "left": "Hace listas",
      "right": "Confía en su memoria"
    },
    "candidateSpanish": {
      "left": "Hago listas para recordar cosas",
      "right": "Confío en mi memoria para recordar cosas"
    },
    "riskLevel": "medium",
    "riskTags": [
      "construct",
      "context"
    ],
    "issueEs": "Hacer listas y usar la memoria pueden coexistir; la respuesta depende de la tarea.",
    "nextReviewActionEs": "Comprobar con ejemplos cotidianos si parecen alternativas.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  },
  {
    "id": 2,
    "sourceId": "OEJTS12:Q02",
    "axis": "FT",
    "sign": -1,
    "sourceEnglish": {
      "left": "sceptical",
      "right": "wants to believe"
    },
    "currentDraftSpanish": {
      "left": "Es escéptico/a",
      "right": "Quiere creer"
    },
    "candidateSpanish": {
      "left": "Suelo ser escéptico/a",
      "right": "Suelo querer creer"
    },
    "riskLevel": "high",
    "riskTags": [
      "construct",
      "culture"
    ],
    "issueEs": "Escepticismo versus querer creer no representa necesariamente un polo F/T.",
    "nextReviewActionEs": "Revisar pertinencia del constructo con especialistas.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  },
  {
    "id": 3,
    "sourceId": "OEJTS12:Q03",
    "axis": "IE",
    "sign": -1,
    "sourceEnglish": {
      "left": "bored by time alone",
      "right": "needs time alone"
    },
    "currentDraftSpanish": {
      "left": "Se aburre pasando tiempo a solas",
      "right": "Necesita tiempo a solas"
    },
    "candidateSpanish": {
      "left": "Me aburro cuando paso tiempo a solas",
      "right": "Necesito pasar tiempo a solas"
    },
    "riskLevel": "medium",
    "riskTags": [
      "construct",
      "context"
    ],
    "issueEs": "Aburrimiento en soledad y necesidad de tiempo a solas no son opuestos estrictos.",
    "nextReviewActionEs": "Probar contextos de soledad elegida, descanso y compañía.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  },
  {
    "id": 4,
    "sourceId": "OEJTS12:Q04",
    "axis": "SN",
    "sign": 1,
    "sourceEnglish": {
      "left": "accepts things as they are",
      "right": "unsatisfied with the ways things are"
    },
    "currentDraftSpanish": {
      "left": "Acepta las cosas tal como son",
      "right": "No le satisface cómo están las cosas"
    },
    "candidateSpanish": {
      "left": "Acepto las cosas como son",
      "right": "No estoy conforme con cómo son las cosas"
    },
    "riskLevel": "medium",
    "riskTags": [
      "construct",
      "wording"
    ],
    "issueEs": "Aceptación y deseo de cambio pueden depender del contexto y valores.",
    "nextReviewActionEs": "Comprobar lectura de conformismo moral.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  },
  {
    "id": 5,
    "sourceId": "OEJTS12:Q05",
    "axis": "JP",
    "sign": 1,
    "sourceEnglish": {
      "left": "keeps a clean room",
      "right": "just puts stuff where ever"
    },
    "currentDraftSpanish": {
      "left": "Mantiene su habitación ordenada",
      "right": "Deja las cosas en cualquier sitio"
    },
    "candidateSpanish": {
      "left": "Mantengo ordenado mi espacio",
      "right": "Dejo mis cosas en cualquier sitio"
    },
    "riskLevel": "medium",
    "riskTags": [
      "accessibility",
      "culture",
      "social-desirability"
    ],
    "issueEs": "Orden en habitación depende de convivencia, edad y condiciones de vida.",
    "nextReviewActionEs": "Verificar si cambiar habitación por espacio preserva el sentido.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  },
  {
    "id": 6,
    "sourceId": "OEJTS12:Q06",
    "axis": "FT",
    "sign": 1,
    "sourceEnglish": {
      "left": "thinks 'robotic' is an insult",
      "right": "strives to have a mechanical mind"
    },
    "currentDraftSpanish": {
      "left": "Considera «robótico» un insulto",
      "right": "Aspira a tener una mente mecánica"
    },
    "candidateSpanish": {
      "left": "Me parece un insulto que me llamen «robótico/a»",
      "right": "Aspiro a pensar de una forma mecánica"
    },
    "riskLevel": "high",
    "riskTags": [
      "wording",
      "culture",
      "construct"
    ],
    "issueEs": "Robótico y mente mecánica son expresiones valorativas y poco uniformes.",
    "nextReviewActionEs": "Entrevista cognitiva; considerar sustitución en banco propio.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  },
  {
    "id": 7,
    "sourceId": "OEJTS12:Q07",
    "axis": "IE",
    "sign": -1,
    "sourceEnglish": {
      "left": "energetic",
      "right": "mellow"
    },
    "currentDraftSpanish": {
      "left": "Enérgico/a",
      "right": "Tranquilo/a"
    },
    "candidateSpanish": {
      "left": "Soy una persona enérgica",
      "right": "Soy una persona tranquila"
    },
    "riskLevel": "medium",
    "riskTags": [
      "accessibility",
      "construct"
    ],
    "issueEs": "Energía versus serenidad depende de salud y circunstancias, pueden coexistir.",
    "nextReviewActionEs": "Contrastar rasgo estable con estado actual.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  },
  {
    "id": 8,
    "sourceId": "OEJTS12:Q08",
    "axis": "SN",
    "sign": 1,
    "sourceEnglish": {
      "left": "prefer to take multiple choice test",
      "right": "prefer essay answers"
    },
    "currentDraftSpanish": {
      "left": "Prefiere exámenes tipo test",
      "right": "Prefiere respuestas de desarrollo"
    },
    "candidateSpanish": {
      "left": "Prefiero los exámenes con opciones de respuesta",
      "right": "Prefiero los exámenes de desarrollo"
    },
    "riskLevel": "high",
    "riskTags": [
      "culture",
      "context",
      "construct"
    ],
    "issueEs": "Preferencia por examen tipo test depende de experiencias educativas.",
    "nextReviewActionEs": "Comprobar comprensión en personas con educación diversa.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  },
  {
    "id": 9,
    "sourceId": "OEJTS12:Q09",
    "axis": "JP",
    "sign": -1,
    "sourceEnglish": {
      "left": "chaotic",
      "right": "organized"
    },
    "currentDraftSpanish": {
      "left": "Caótico/a",
      "right": "Organizado/a"
    },
    "candidateSpanish": {
      "left": "Suelo ser poco organizado/a",
      "right": "Suelo ser organizado/a"
    },
    "riskLevel": "medium",
    "riskTags": [
      "social-desirability",
      "wording"
    ],
    "issueEs": "Caótico/a puede estigmatizar una opción e inducir deseabilidad social.",
    "nextReviewActionEs": "Probar alternativas menos valorativas.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  },
  {
    "id": 10,
    "sourceId": "OEJTS12:Q10",
    "axis": "FT",
    "sign": 1,
    "sourceEnglish": {
      "left": "easily hurt",
      "right": "thick-skinned"
    },
    "currentDraftSpanish": {
      "left": "Se siente herido/a fácilmente",
      "right": "Es difícil herir sus sentimientos"
    },
    "candidateSpanish": {
      "left": "Me hieren las cosas con facilidad",
      "right": "Es difícil herir mis sentimientos"
    },
    "riskLevel": "high",
    "riskTags": [
      "wording",
      "social-desirability",
      "construct"
    ],
    "issueEs": "Ser fácilmente herido no equivale necesariamente al eje F/T.",
    "nextReviewActionEs": "Evaluar juicios de fragilidad e implicaciones culturales.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  },
  {
    "id": 11,
    "sourceId": "OEJTS12:Q11",
    "axis": "IE",
    "sign": -1,
    "sourceEnglish": {
      "left": "works best in groups",
      "right": "works best alone"
    },
    "currentDraftSpanish": {
      "left": "Trabaja mejor en grupo",
      "right": "Trabaja mejor a solas"
    },
    "candidateSpanish": {
      "left": "Trabajo mejor en grupo",
      "right": "Trabajo mejor a solas"
    },
    "riskLevel": "low",
    "riskTags": [
      "context",
      "construct"
    ],
    "issueEs": "Preferir equipos o soledad varía según tarea y personas.",
    "nextReviewActionEs": "Pedir ejemplos de tareas distintas.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  },
  {
    "id": 12,
    "sourceId": "OEJTS12:Q12",
    "axis": "SN",
    "sign": 1,
    "sourceEnglish": {
      "left": "focused on the present",
      "right": "focused on the future"
    },
    "currentDraftSpanish": {
      "left": "Se centra en el presente",
      "right": "Se centra en el futuro"
    },
    "candidateSpanish": {
      "left": "Me centro en el presente",
      "right": "Me centro en el futuro"
    },
    "riskLevel": "medium",
    "riskTags": [
      "construct",
      "context"
    ],
    "issueEs": "Enfoque presente/futuro no determina por sí mismo S/N.",
    "nextReviewActionEs": "Examinar interpretación de enfoque temporal.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  },
  {
    "id": 13,
    "sourceId": "OEJTS12:Q13",
    "axis": "JP",
    "sign": 1,
    "sourceEnglish": {
      "left": "plans far ahead",
      "right": "plans at the last minute"
    },
    "currentDraftSpanish": {
      "left": "Planifica con mucha antelación",
      "right": "Planifica en el último momento"
    },
    "candidateSpanish": {
      "left": "Planifico las cosas con bastante antelación",
      "right": "Planifico las cosas en el último momento"
    },
    "riskLevel": "medium",
    "riskTags": [
      "social-desirability",
      "context"
    ],
    "issueEs": "Planificar tarde puede deberse a circunstancias y no a preferencia.",
    "nextReviewActionEs": "Investigar implicaciones de responsabilidad moral.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  },
  {
    "id": 14,
    "sourceId": "OEJTS12:Q14",
    "axis": "FT",
    "sign": -1,
    "sourceEnglish": {
      "left": "wants people's respect",
      "right": "wants their love"
    },
    "currentDraftSpanish": {
      "left": "Busca el respeto de los demás",
      "right": "Busca el cariño de los demás"
    },
    "candidateSpanish": {
      "left": "Quiero que los demás me respeten",
      "right": "Quiero que los demás me quieran"
    },
    "riskLevel": "medium",
    "riskTags": [
      "social-desirability",
      "construct"
    ],
    "issueEs": "Querer respeto y querer cariño no son alternativas excluyentes.",
    "nextReviewActionEs": "Distinguir relaciones familiares, amistad y trabajo.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  },
  {
    "id": 15,
    "sourceId": "OEJTS12:Q15",
    "axis": "IE",
    "sign": 1,
    "sourceEnglish": {
      "left": "gets worn out by parties",
      "right": "gets fired up by parties"
    },
    "currentDraftSpanish": {
      "left": "Las fiestas le dejan agotado/a",
      "right": "Las fiestas le dan energía"
    },
    "candidateSpanish": {
      "left": "Las fiestas suelen agotarme",
      "right": "Las fiestas suelen darme energía"
    },
    "riskLevel": "medium",
    "riskTags": [
      "accessibility",
      "context"
    ],
    "issueEs": "Fiestas generan cansancio por ruido o accesibilidad, no solo preferencia I/E.",
    "nextReviewActionEs": "Comparar diferentes reuniones y ambientes.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  },
  {
    "id": 16,
    "sourceId": "OEJTS12:Q16",
    "axis": "SN",
    "sign": 1,
    "sourceEnglish": {
      "left": "fits in",
      "right": "stands out"
    },
    "currentDraftSpanish": {
      "left": "Encaja entre los demás",
      "right": "Destaca entre los demás"
    },
    "candidateSpanish": {
      "left": "Suelo encajar entre los demás",
      "right": "Suelo destacar entre los demás"
    },
    "riskLevel": "high",
    "riskTags": [
      "construct",
      "culture",
      "context"
    ],
    "issueEs": "Encajar y destacar puede medir conformidad/identidad más que S/N.",
    "nextReviewActionEs": "Revisar relevancia del ítem para el constructo.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  },
  {
    "id": 17,
    "sourceId": "OEJTS12:Q17",
    "axis": "JP",
    "sign": -1,
    "sourceEnglish": {
      "left": "keeps options open",
      "right": "commits"
    },
    "currentDraftSpanish": {
      "left": "Mantiene abiertas sus opciones",
      "right": "Se compromete con una decisión"
    },
    "candidateSpanish": {
      "left": "Prefiero mantener abiertas mis opciones",
      "right": "Prefiero comprometerme con una decisión"
    },
    "riskLevel": "medium",
    "riskTags": [
      "construct",
      "wording"
    ],
    "issueEs": "Comprometerse con una elección puede variar por su trascendencia.",
    "nextReviewActionEs": "Aclarar significado de compromiso fuera de relaciones.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  },
  {
    "id": 18,
    "sourceId": "OEJTS12:Q18",
    "axis": "FT",
    "sign": -1,
    "sourceEnglish": {
      "left": "wants to be good at fixing things",
      "right": "wants to be good at fixing people"
    },
    "currentDraftSpanish": {
      "left": "Quiere ser bueno/a reparando cosas",
      "right": "Quiere ser bueno/a ayudando a personas a mejorar"
    },
    "candidateSpanish": {
      "left": "Quiero saber reparar cosas",
      "right": "Quiero saber ayudar a personas a resolver problemas"
    },
    "riskLevel": "high",
    "riskTags": [
      "wording",
      "construct",
      "social-desirability"
    ],
    "issueEs": "Arreglar personas es ofensivo; ayudar a mejorar ya cambia sustancialmente el original.",
    "nextReviewActionEs": "Conservar fuente y estudiar alternativa en un banco nuevo.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  },
  {
    "id": 19,
    "sourceId": "OEJTS12:Q19",
    "axis": "IE",
    "sign": -1,
    "sourceEnglish": {
      "left": "talks more",
      "right": "listens more"
    },
    "currentDraftSpanish": {
      "left": "Habla más",
      "right": "Escucha más"
    },
    "candidateSpanish": {
      "left": "Suelo hablar más",
      "right": "Suelo escuchar más"
    },
    "riskLevel": "medium",
    "riskTags": [
      "social-desirability",
      "context"
    ],
    "issueEs": "Hablar/escuchar cambia con interlocutor; escuchar se valora socialmente.",
    "nextReviewActionEs": "Probar según confianza y contexto de conversación.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  },
  {
    "id": 20,
    "sourceId": "OEJTS12:Q20",
    "axis": "SN",
    "sign": 1,
    "sourceEnglish": {
      "left": "when describing an event, will tell people what happened",
      "right": "when describing an event, will tell people what it meant"
    },
    "currentDraftSpanish": {
      "left": "Al contar un suceso, explica qué ocurrió",
      "right": "Al contar un suceso, explica qué significó"
    },
    "candidateSpanish": {
      "left": "Al contar algo, explico qué sucedió",
      "right": "Al contar algo, explico qué significó"
    },
    "riskLevel": "low",
    "riskTags": [
      "construct",
      "wording"
    ],
    "issueEs": "Describir hechos y significados no son enfoques incompatibles.",
    "nextReviewActionEs": "Comprobar comprensión de significado.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  },
  {
    "id": 21,
    "sourceId": "OEJTS12:Q21",
    "axis": "JP",
    "sign": 1,
    "sourceEnglish": {
      "left": "gets work done right away",
      "right": "procrastinates"
    },
    "currentDraftSpanish": {
      "left": "Se pone a trabajar enseguida",
      "right": "Deja las tareas para más tarde"
    },
    "candidateSpanish": {
      "left": "Empiezo las tareas enseguida",
      "right": "Dejo las tareas para más tarde"
    },
    "riskLevel": "medium",
    "riskTags": [
      "social-desirability",
      "context"
    ],
    "issueEs": "Procrastinar tiene carga valorativa y puede relacionarse con carga de tareas.",
    "nextReviewActionEs": "Probar ejemplos sin atribución moral.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  },
  {
    "id": 22,
    "sourceId": "OEJTS12:Q22",
    "axis": "FT",
    "sign": 1,
    "sourceEnglish": {
      "left": "follows the heart",
      "right": "follows the head"
    },
    "currentDraftSpanish": {
      "left": "Sigue al corazón",
      "right": "Sigue a la cabeza"
    },
    "candidateSpanish": {
      "left": "Suelo guiarme por el corazón",
      "right": "Suelo guiarme por la cabeza"
    },
    "riskLevel": "medium",
    "riskTags": [
      "wording",
      "construct"
    ],
    "issueEs": "Corazón y cabeza son metáforas y no procesos excluyentes.",
    "nextReviewActionEs": "Comprobar equivalencia metafórica bilingüe.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  },
  {
    "id": 23,
    "sourceId": "OEJTS12:Q23",
    "axis": "IE",
    "sign": 1,
    "sourceEnglish": {
      "left": "stays at home",
      "right": "goes out on the town"
    },
    "currentDraftSpanish": {
      "left": "Se queda en casa",
      "right": "Sale a divertirse"
    },
    "candidateSpanish": {
      "left": "Me gusta quedarme en casa",
      "right": "Me gusta salir a divertirme"
    },
    "riskLevel": "medium",
    "riskTags": [
      "culture",
      "accessibility",
      "context"
    ],
    "issueEs": "Salir por la ciudad no es una opción igual de disponible en todos los entornos.",
    "nextReviewActionEs": "Comparar contextos urbanos y rurales.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  },
  {
    "id": 24,
    "sourceId": "OEJTS12:Q24",
    "axis": "SN",
    "sign": -1,
    "sourceEnglish": {
      "left": "wants the big picture",
      "right": "wants the details"
    },
    "currentDraftSpanish": {
      "left": "Prefiere la visión de conjunto",
      "right": "Prefiere los detalles"
    },
    "candidateSpanish": {
      "left": "Prefiero captar el panorama general",
      "right": "Prefiero conocer los detalles"
    },
    "riskLevel": "medium",
    "riskTags": [
      "construct",
      "wording"
    ],
    "issueEs": "Visión general/detalles varía con actividad y no equivale siempre a S/N.",
    "nextReviewActionEs": "Probar situaciones de trabajo y ocio.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  },
  {
    "id": 25,
    "sourceId": "OEJTS12:Q25",
    "axis": "JP",
    "sign": -1,
    "sourceEnglish": {
      "left": "improvises",
      "right": "prepares"
    },
    "currentDraftSpanish": {
      "left": "Improvisa",
      "right": "Se prepara"
    },
    "candidateSpanish": {
      "left": "Suelo improvisar",
      "right": "Suelo prepararme"
    },
    "riskLevel": "low",
    "riskTags": [
      "context",
      "construct"
    ],
    "issueEs": "Prepararse e improvisar son habilidades complementarias.",
    "nextReviewActionEs": "Confirmar interpretación como preferencia.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  },
  {
    "id": 26,
    "sourceId": "OEJTS12:Q26",
    "axis": "FT",
    "sign": -1,
    "sourceEnglish": {
      "left": "bases morality on justice",
      "right": "bases morality on compassion"
    },
    "currentDraftSpanish": {
      "left": "Basa la moralidad en la justicia",
      "right": "Basa la moralidad en la compasión"
    },
    "candidateSpanish": {
      "left": "Doy prioridad a la justicia al juzgar una situación",
      "right": "Doy prioridad a la compasión al juzgar una situación"
    },
    "riskLevel": "high",
    "riskTags": [
      "social-desirability",
      "construct",
      "ethics"
    ],
    "issueEs": "Justicia y compasión no son valores contrarios; polarización moral injustificada.",
    "nextReviewActionEs": "Revisión ética y relevancia del constructo.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  },
  {
    "id": 27,
    "sourceId": "OEJTS12:Q27",
    "axis": "IE",
    "sign": 1,
    "sourceEnglish": {
      "left": "finds it difficult to yell very loudly",
      "right": "yelling to others when they are far away comes naturally"
    },
    "currentDraftSpanish": {
      "left": "Le cuesta gritar muy fuerte",
      "right": "Le sale natural gritar a alguien que está lejos"
    },
    "candidateSpanish": {
      "left": "Me cuesta levantar mucho la voz",
      "right": "Me sale natural llamar en voz alta a alguien que está lejos"
    },
    "riskLevel": "high",
    "riskTags": [
      "accessibility",
      "construct",
      "context"
    ],
    "issueEs": "Gritar depende de voz/audición, accesibilidad y entorno, no de extraversión.",
    "nextReviewActionEs": "Considerar reemplazo en banco propio.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  },
  {
    "id": 28,
    "sourceId": "OEJTS12:Q28",
    "axis": "SN",
    "sign": -1,
    "sourceEnglish": {
      "left": "theoretical",
      "right": "empirical"
    },
    "currentDraftSpanish": {
      "left": "Teórico/a",
      "right": "Empírico/a"
    },
    "candidateSpanish": {
      "left": "Me interesa más la teoría",
      "right": "Me interesa más la experiencia práctica"
    },
    "riskLevel": "high",
    "riskTags": [
      "construct",
      "wording"
    ],
    "issueEs": "Teoría y evidencia empírica son compatibles; «empírico» cambia culturalmente.",
    "nextReviewActionEs": "No adoptar esta adaptación sin revalidar constructo.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  },
  {
    "id": 29,
    "sourceId": "OEJTS12:Q29",
    "axis": "JP",
    "sign": 1,
    "sourceEnglish": {
      "left": "works hard",
      "right": "plays hard"
    },
    "currentDraftSpanish": {
      "left": "Trabaja intensamente",
      "right": "Se divierte intensamente"
    },
    "candidateSpanish": {
      "left": "Me esfuerzo mucho cuando trabajo",
      "right": "Disfruto mucho cuando me divierto"
    },
    "riskLevel": "high",
    "riskTags": [
      "construct",
      "social-desirability"
    ],
    "issueEs": "Trabajar duro y divertirse mucho no son polos opuestos.",
    "nextReviewActionEs": "Candidato a sustitución futura en banco propio.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  },
  {
    "id": 30,
    "sourceId": "OEJTS12:Q30",
    "axis": "FT",
    "sign": -1,
    "sourceEnglish": {
      "left": "uncomfortable with emotions",
      "right": "values emotions"
    },
    "currentDraftSpanish": {
      "left": "Se siente incómodo/a con las emociones",
      "right": "Valora las emociones"
    },
    "candidateSpanish": {
      "left": "Las emociones me incomodan",
      "right": "Considero importantes las emociones"
    },
    "riskLevel": "high",
    "riskTags": [
      "social-desirability",
      "construct",
      "wording"
    ],
    "issueEs": "Incomodidad ante emociones y valorarlas pueden coexistir.",
    "nextReviewActionEs": "Examinar deseabilidad social y sentido real.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  },
  {
    "id": 31,
    "sourceId": "OEJTS12:Q31",
    "axis": "IE",
    "sign": -1,
    "sourceEnglish": {
      "left": "likes to perform in front of other people",
      "right": "avoids public speaking"
    },
    "currentDraftSpanish": {
      "left": "Le gusta actuar delante de otras personas",
      "right": "Evita hablar en público"
    },
    "candidateSpanish": {
      "left": "Me gusta actuar delante de otras personas",
      "right": "Evito hablar en público"
    },
    "riskLevel": "high",
    "riskTags": [
      "accessibility",
      "construct",
      "context"
    ],
    "issueEs": "Actuar en público y evitar discursos son actividades distintas; ansiedad/experiencia confunden.",
    "nextReviewActionEs": "Considerar dos actividades no equivalentes.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  },
  {
    "id": 32,
    "sourceId": "OEJTS12:Q32",
    "axis": "SN",
    "sign": 1,
    "sourceEnglish": {
      "left": "likes to know 'who?', 'what?', 'when?'",
      "right": "likes to know 'why?'"
    },
    "currentDraftSpanish": {
      "left": "Quiere saber quién, qué y cuándo",
      "right": "Quiere saber por qué"
    },
    "candidateSpanish": {
      "left": "Me interesa saber quién, qué y cuándo",
      "right": "Me interesa saber por qué"
    },
    "riskLevel": "medium",
    "riskTags": [
      "construct",
      "context"
    ],
    "issueEs": "Quién/qué/cuándo versus por qué depende del tipo de problema.",
    "nextReviewActionEs": "Probar ambos extremos dentro de un contexto narrativo único.",
    "status": "pending-independent-review",
    "translationApproval": false,
    "sourceCheck": "visually-compared-with-original-pdf-page-2"
  }
];
const freezeRecord=r=>Object.freeze({...r,sourceEnglish:Object.freeze(r.sourceEnglish),currentDraftSpanish:Object.freeze(r.currentDraftSpanish),candidateSpanish:Object.freeze(r.candidateSpanish),riskTags:Object.freeze(r.riskTags)});
export const EDITORIAL_AUDIT=Object.freeze(sourceRecords.map(freezeRecord));
const byId=new Map(EDITORIAL_AUDIT.map(r=>[r.id,r]));
export function getEditorialReview(id){return Number.isInteger(id)?byId.get(id)??null:null}
export function getEditorialSummary(){
 const counts={high:0,medium:0,low:0};for(const r of EDITORIAL_AUDIT)counts[r.riskLevel]++;
 return Object.freeze({version:REVIEW_VERSION,total:EDITORIAL_AUDIT.length,counts:Object.freeze(counts),
 pending:EDITORIAL_AUDIT.filter(r=>r.status!=="approved").length,
 sourceChecked:EDITORIAL_AUDIT.filter(r=>r.sourceCheck==="visually-compared-with-original-pdf-page-2").length,
 approvedTranslation:EDITORIAL_AUDIT.filter(r=>r.translationApproval).length});
}
