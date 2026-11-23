/**
 * TYPE/16 narrative copy: original educational descriptions, not psychometric norms.
 * These are *possibilities*, never diagnoses or personality facts about a user.
 * Kept apart from the OEJTS questionnaire and scoring key.
 */

export const TYPE_COPY = Object.freeze({
  ISTJ:{
    es:{title:'Pragmatismo metódico',summary:'La combinación reúne una preferencia por observar lo concreto, analizar los asuntos y organizar los próximos pasos, con espacio para reflexionar en privado.'},
    en:{title:'Methodical pragmatism',summary:'This combination brings together attention to concrete details, an analytical approach and a preference for structuring next steps, alongside room for private reflection.'}
  },
  ISFJ:{
    es:{title:'Atención con estructura',summary:'Aquí se combinan la atención a experiencias concretas, la consideración por las personas y cierta preferencia por preparar lo que viene, sin necesidad de exponerse continuamente.'},
    en:{title:'Consideration with structure',summary:'This combination brings together attention to concrete experience, consideration for people and some preference for planning ahead, without constant outward engagement.'}
  },
  INFJ:{
    es:{title:'Sentido y estructura',summary:'Este patrón combina interés por el significado y las posibilidades, atención a cómo afectan las decisiones a otras personas y gusto por dar dirección a las ideas.'},
    en:{title:'Meaning and structure',summary:'This pattern combines an interest in meaning and possibilities, attention to how decisions affect people and a tendency to give ideas a clear direction.'}
  },
  INTJ:{
    es:{title:'Ideas con método',summary:'Las preferencias apuntan a explorar posibilidades, examinarlas con criterio analítico y convertirlas en planes, con espacio para trabajar de manera independiente.'},
    en:{title:'Ideas with a method',summary:'These preferences suggest exploring possibilities, testing them analytically and turning them into plans, with space for independent work.'}
  },
  ISTP:{
    es:{title:'Análisis práctico y flexible',summary:'La combinación acerca la observación de lo concreto a un estilo analítico que deja margen para reaccionar y ajustar el rumbo según la situación.'},
    en:{title:'Practical and flexible analysis',summary:'This combination links attention to tangible information with an analytical style that leaves room to react and change course as circumstances evolve.'}
  },
  ISFP:{
    es:{title:'Sensibilidad práctica',summary:'Aquí aparecen juntos el interés por la experiencia concreta, la consideración de valores personales y la libertad para adaptar decisiones al momento.'},
    en:{title:'Practical sensitivity',summary:'Here, interest in concrete experience sits alongside personal values and freedom to adapt decisions in the moment.'}
  },
  INFP:{
    es:{title:'Valores y posibilidades',summary:'Este patrón reúne atención al significado personal, curiosidad por alternativas y cierta preferencia por mantener opciones abiertas mientras las ideas maduran.'},
    en:{title:'Values and possibilities',summary:'This pattern brings together attention to personal meaning, curiosity about alternatives and a preference for leaving options open while ideas develop.'}
  },
  INTP:{
    es:{title:'Exploración analítica',summary:'La combinación sugiere interés por examinar ideas, conectar posibilidades y conservar libertad para revisar una conclusión antes de darla por cerrada.'},
    en:{title:'Analytical exploration',summary:'This combination suggests an interest in examining ideas, connecting possibilities and retaining freedom to revisit a conclusion before settling on it.'}
  },
  ESTJ:{
    es:{title:'Organización práctica',summary:'En este patrón conviven la participación con otras personas, el interés por soluciones concretas y la preferencia por decisiones claras y pasos organizados.'},
    en:{title:'Practical organization',summary:'This pattern combines engagement with others, an interest in concrete solutions and a preference for clear decisions and organized next steps.'}
  },
  ESFJ:{
    es:{title:'Conexión organizada',summary:'La combinación enlaza el contacto con los demás, la atención a necesidades cotidianas y el deseo de dar continuidad y estructura a los compromisos.'},
    en:{title:'Organized connection',summary:'This combination links contact with others, attention to everyday needs and a wish to bring continuity and structure to commitments.'}
  },
  ENFJ:{
    es:{title:'Conexión con propósito',summary:'El patrón mezcla intercambio con otras personas, búsqueda de sentido y atención a los valores, junto con preferencia por transformar ideas en planes.'},
    en:{title:'Purposeful connection',summary:'This pattern combines exchange with others, a search for meaning and attention to values with a preference for turning ideas into plans.'}
  },
  ENTJ:{
    es:{title:'Dirección de ideas',summary:'Aquí se unen la conversación y el intercambio, la exploración de posibilidades, la evaluación analítica y el interés por marcar una dirección.'},
    en:{title:'Giving ideas direction',summary:'This brings together discussion and exchange, exploration of possibilities, analytical evaluation and an interest in setting a direction.'}
  },
  ESTP:{
    es:{title:'Acción y adaptación',summary:'La combinación da espacio a la interacción, la información concreta y una forma analítica pero adaptable de responder a lo que ocurre.'},
    en:{title:'Action and adaptation',summary:'This combination leaves space for interaction, tangible information and an analytical yet adaptable response to events.'}
  },
  ESFP:{
    es:{title:'Experiencias compartidas',summary:'Este patrón enlaza interacción, experiencias cercanas, atención a las personas y flexibilidad para responder al momento.'},
    en:{title:'Shared experiences',summary:'This pattern links interaction, immediate experiences, attention to people and flexibility in responding to the moment.'}
  },
  ENFP:{
    es:{title:'Posibilidades compartidas',summary:'Aquí se combinan intercambio con los demás, entusiasmo por explorar alternativas, consideración de valores y margen para cambiar de rumbo.'},
    en:{title:'Shared possibilities',summary:'This combination brings together exchange with others, enthusiasm for exploring alternatives, consideration of values and room to change course.'}
  },
  ENTP:{
    es:{title:'Ideas en movimiento',summary:'La combinación favorece explorar posibilidades mediante el intercambio, analizarlas desde distintos ángulos y mantener flexibilidad para reconsiderar decisiones.'},
    en:{title:'Ideas in motion',summary:'This combination emphasizes exploring possibilities through exchange, examining them from several angles and keeping room to reconsider decisions.'}
  }
});

export const AXIS_COPY=Object.freeze({
  IE:{
    es:{title:'Interacción y espacio personal',low:'En estas preguntas aparece una inclinación hacia el espacio personal o el trabajo individual.',high:'En estas preguntas aparece una inclinación hacia el intercambio o la actividad con otras personas.'},
    en:{title:'Interaction and personal space',low:'These answers lean toward personal space or individual work.',high:'These answers lean toward exchange or activity with other people.'}
  },
  SN:{
    es:{title:'Concreción y posibilidades',low:'Aquí parece pesar más lo concreto y lo que puede observarse directamente.',high:'Aquí parece pesar más explorar significados, ideas o posibilidades.'},
    en:{title:'Concrete details and possibilities',low:'These answers lean toward concrete, directly observable information.',high:'These answers lean toward exploring meanings, ideas or possibilities.'}
  },
  FT:{
    es:{title:'Criterios y valores',low:'En este grupo se aprecia mayor inclinación hacia consideraciones personales y de valor.',high:'En este grupo se aprecia mayor inclinación hacia criterios analíticos.'},
    en:{title:'Criteria and values',low:'This group of answers leans more toward personal and value-based considerations.',high:'This group of answers leans more toward analytical criteria.'}
  },
  JP:{
    es:{title:'Estructura y flexibilidad',low:'Estas respuestas apuntan a cierta preferencia por preparar, organizar o cerrar decisiones.',high:'Estas respuestas apuntan a cierta preferencia por improvisar, adaptar o mantener opciones abiertas.'},
    en:{title:'Structure and flexibility',low:'These answers suggest some preference for preparing, organizing or settling decisions.',high:'These answers suggest some preference for improvising, adapting or leaving options open.'}
  }
});

export const THEME_COPY=Object.freeze({
  planning:['planificación','planning'],beliefs:['creencias','beliefs'],
  'social-energy':['energía social','social energy'],change:['cambio','change'],
  order:['orden','order'],'analytical-style':['estilo de análisis','analytical style'],
  energy:['energía','energy'],learning:['aprendizaje','learning'],
  emotion:['emociones','emotions'],collaboration:['colaboración','collaboration'],
  time:['tiempo','time'],relationships:['relaciones','relationships'],
  identity:['identidad','identity'],decisions:['decisiones','decisions'],
  helping:['ayuda a otros','helping others'],conversation:['conversación','conversation'],
  meaning:['significado','meaning'],procrastination:['gestión de tareas','task management'],
  'social-activity':['actividades sociales','social activities'],
  abstraction:['ideas abstractas','abstract ideas'],values:['valores','values'],
  communication:['comunicación','communication'],activity:['actividad','activity'],
  'public-speaking':['hablar en público','public speaking'],curiosity:['curiosidad','curiosity']
});

export const WORDING=Object.freeze({
 es:{
  noData:'Aún no hay respuestas que interpretar.',
  preliminary:'Primera lectura exploratoria',full:'Lectura de las 32 respuestas',
  early:'Por ahora hay pocas respuestas por dimensión para resumir un patrón de cuatro letras.',
  provisional:'Una combinación provisional que resume las respuestas actuales, no una identidad fija.',
  fullIntro:'Se ha aplicado la clave de puntuación de 32 ítems. El código describe el resultado de esta escala, no una personalidad demostrada.',
  tieCode:'El código de cuatro letras incluye un desempate convencional: esas letras no representan una preferencia observada.',
  unknown:'Todavía no hay respuestas en esta dimensión.',
  tie:'Las respuestas observadas se equilibran. No destaca ninguno de los polos.',
  slight:'La inclinación es suave y está cerca del centro.',
  moderate:'Hay una inclinación intermedia en las respuestas observadas.',
  marked:'Las respuestas observadas se inclinan de forma marcada hacia este polo.',
  tooFew:'Solo hay unas pocas respuestas de esta dimensión; conviene interpretarlas con mucha cautela.',
  partial:'Quedan preguntas de esta dimensión. Las respuestas futuras pueden cambiar el resultado.',
  mixed:'También aparecen respuestas en el sentido opuesto. Esto aporta matices, no indica que hayas contestado mal.',
  neutral:'Has elegido la opción neutral en esta dimensión.',
  low:'Polo izquierdo',high:'Polo derecho',
  support:'Ejemplos de respuestas que contribuyen a esta tendencia',
  opposite:'Ejemplos que aportan un matiz distinto',
  strengths:'Tendencias más visibles',nuances:'Matices y cuestiones abiertas',
  strongLine:'Esta dimensión muestra una inclinación observada más marcada.',
  softLine:'Esta dimensión está cerca del centro o reúne señales de ambos lados.',
  missingLine:'Aún faltan respuestas en esta dimensión.',
  noHighlights:'Todavía no hay suficientes respuestas para destacar tendencias.',
  noNuances:'No se han detectado matices destacados con los criterios descriptivos actuales.',
  followUp:'Puedes responder más preguntas para completar el recorrido.',
  reviewSkipped:'Hay preguntas omitidas que puedes revisar.',
  finished:'Has contestado las 32 preguntas del banco de referencia.',
  caution:'Lectura educativa y orientativa: no es un diagnóstico, un perfil clínico ni una estimación de certeza. Los porcentajes describen posiciones en escalas; no probabilidades.',
  sourceCaution:'La traducción, la versión rápida y el formato de tarjetas no han sido validados por separado.',
  noType:'Aún no se puede proponer una combinación completa sin ocultar ausencias o empates.',
  selected:'Tendencia observada',notSelected:'Lectura abierta',
  none:'Ninguna todavía'
 },
 en:{
  noData:'There are no answers to interpret yet.',
  preliminary:'First exploratory reading',full:'Reading of all 32 answers',
  early:'There are still too few answers per dimension to summarize a four-letter pattern.',
  provisional:'A provisional combination summarizing current answers, not a fixed identity.',
  fullIntro:'The published 32-item scoring key has been applied. The code describes this scale result, not a proven personality.',
  tieCode:'The four-letter code includes a conventional tie-break: those letters are not supported by a measured preference.',
  unknown:'No answers have been recorded for this dimension yet.',
  tie:'The observed responses balance each other out. Neither pole stands out.',
  slight:'This is a slight leaning, close to the midpoint.',
  moderate:'There is a moderate leaning in the observed answers.',
  marked:'The observed answers lean noticeably toward this pole.',
  tooFew:'Only a few responses are available for this dimension; interpretation needs extra caution.',
  partial:'Questions remain in this dimension. Further answers could change the result.',
  mixed:'There are also answers pointing in the opposite direction. These add nuance, not an error.',
  neutral:'You chose the neutral option in this dimension.',
  low:'Left pole',high:'Right pole',
  support:'Example answers contributing to this leaning',
  opposite:'Examples that introduce a different nuance',
  strengths:'More visible tendencies',nuances:'Nuances and open questions',
  strongLine:'This dimension shows a more noticeable observed leaning.',
  softLine:'This dimension is near the midpoint or contains signals on both sides.',
  missingLine:'There are still unanswered questions in this dimension.',
  noHighlights:'There are not yet enough answers to highlight a pattern.',
  noNuances:'No special nuances were identified under the current descriptive rules.',
  followUp:'You can answer more questions to complete the sequence.',
  reviewSkipped:'There are skipped questions you can revisit.',
  finished:'You have answered all 32 questions in the reference bank.',
  caution:'Educational and exploratory reading: not a diagnosis, clinical profile or estimate of certainty. Percentages are scale positions, not probabilities.',
  sourceCaution:'The translation, short form and card presentation have not been independently validated.',
  noType:'A complete combination cannot yet be proposed without hiding missing responses or ties.',
  selected:'Observed leaning',notSelected:'Open reading',
  none:'None yet'
 }
});
