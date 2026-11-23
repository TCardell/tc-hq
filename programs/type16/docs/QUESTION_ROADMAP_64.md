# TYPE/16 — Recorrido completo de 64 preguntas (PLAN EDITORIAL v0.1)

**Fecha:** 23/11/2026 · **Estado:** propuesta de diseño, NO implementada en `playtest` ni en Gesture Lab v0.11.1.  
**Objetivo:** diseñar un viaje por etapas con **64 ítems, 16 por dimensión**, sin convertir la experiencia en un formulario de 64 pantallas indistinguibles.

## 1. Decisión estructural

- **Q01–Q32:** instrumento de partida **OEJTS 1.2 (Eric Jorgenson, 2015)**. Texto de opciones y clave `js/scoring.js` se mantienen intactos. Atribución/licencia de los ítems originales y sus adaptaciones: **CC BY-NC-SA 4.0**, https://openpsychometrics.org/tests/OJTS/development/OEJTS1.2.pdf . El español sigue siendo borrador editorial.
- **Q33–Q64:** **32 propuestas nuevas TYPE/16**, 8 por dimensión. Son redacciones **originales en ES y EN**, deliberadamente situacionales; pendientes de revisión humana, contraste semántico y prueba de comprensión.
- No mezclar las puntuaciones de ambos bancos ni presentar la escala de 64 como OEJTS. No generar porcentajes de exactitud, confianza o fiabilidad sin datos de validación.
- Todos los ítems usan las **cinco opciones gestuales** del laboratorio: muy A, algo A, neutral, algo B, muy B; *saltar* no equivale a neutral.
- Los enunciados personalizados son **capas editoriales nuevas**, no modificaciones de las frases OEJTS. Deben revisarse por posible cambio de significado antes de publicarse.

## 2. Cinco paradas narrativas

| Cartas vistas | Nombre de la parada | Acumulado IE/SN/FT/JP | Contenido | Qué ofrecer |
|---|---|---|---|---|
| **12** | **Primera impresión** | 3/3/3/3 | 12 ítems OEJTS ya seleccionados en el motor | lectura provisional muy breve; continuar, guardar o terminar |
| **24** | **Mapa en formación** | 6/6/6/6 | 12 ítems OEJTS adicionales | mapa de cuatro ejes, contrastes y preguntas abiertas |
| **32** | **Retrato de referencia** | 8/8/8/8 | 8 ítems OEJTS finales | código completo OEJTS solo si los 32 están respondidos, o repaso de saltadas |
| **48** | **Contrastes cotidianos** | 12/12/12/12 | 16 ítems TYPE/16 nuevos | comparación descriptiva entre la lectura de 32 y situaciones cotidianas |
| **64** | **Retrato extendido** | 16/16/16/16 | 16 ítems TYPE/16 nuevos | lectura narrativa final con preferencias, ambivalencias, matices, evidencia y límites |

**Punto de partida:** la fase de 12 cartas continúa exactamente la selección `FAST_IDS` vigente. El resto de la distribución se propone abajo, pero **no cambia el motor todavía**.

### Comportamiento de las paradas

1. Aparecen después de mostrar las cartas 12, 24, 32, 48 y 64; no bloquean innecesariamente. Un botón claramente visible permite **continuar** y otro **guardar/salir**.
2. Mostrar tres niveles de interpretación: **observado** (respuesta de esa persona), **provisional** (faltan preguntas) y **completo respecto al banco de 32**, sin confundirse con «psicológicamente confirmado».
3. A los 32, si hay omisiones, ofrecer **revisar saltadas** antes de presentar una puntuación OEJTS completa. Evitar que una letra provisional parezca una puntuación oficial.
4. A los 48 y 64, distinguir dos lecturas: **«Referencia de 32»**, congelada sobre Q01–Q32, y **«Exploración TYPE/16»**, que añade Q33–Q64. Si discrepan, describir la diferencia sin declarar que la segunda «corrige» la primera.
5. Permitir volver a consultar cualquier parada completada sin responder de nuevo. Los resultados antiguos pueden **recalcularse sobre el estado actual** y etiquetarse como tal, o conservar instantáneas versionadas; decidir esto antes de implementar.
6. Preservar el comportamiento de izquierda/derecha, intensidad, neutral, saltar, deshacer, localStorage y ES/EN. Versionar el guardado; no migrar automáticamente sesiones de 32 a 64 sin una política explícita.
7. Recomendar una **pausa optativa** en las 24 y 48 para quien quiera repartir el recorrido en varios momentos. No mostrar un cuestionario de duración garantizada.
8. **No convertir una parada en resultado definitivo** a menos que el usuario desee finalizarla. Si continúa, la carta siguiente conserva el ritmo jugable.

## 3. Orden editorial propuesto — 64 cartas

Separamos **identidad estable Qxx** de **posición en el recorrido**. El motor podría adaptar el orden **dentro de cada bloque** más adelante, pero respetando el cupo de cada eje para que todas las paradas queden equilibradas.

| Tramo | Posiciones | IDs en orden de referencia |
|---|---|---|
| Primera impresión | 1–12 | Q03 · Q12 · Q22 · Q25 · Q15 · Q20 · Q14 · Q13 · Q11 · Q32 · Q26 · Q17 |
| Mapa en formación | 13–24 | Q19 · Q24 · Q02 · Q01 · Q07 · Q28 · Q18 · Q21 · Q23 · Q04 · Q30 · Q29 |
| Retrato de referencia | 25–32 | Q31 · Q08 · Q06 · Q05 · Q27 · Q16 · Q10 · Q09 |
| Contrastes cotidianos | 33–48 | Q33 · Q37 · Q41 · Q45 · Q34 · Q38 · Q42 · Q46 · Q35 · Q39 · Q43 · Q47 · Q36 · Q40 · Q44 · Q48 |
| Retrato extendido | 49–64 | Q49 · Q53 · Q57 · Q61 · Q50 · Q54 · Q58 · Q62 · Q51 · Q55 · Q59 · Q63 · Q52 · Q56 · Q60 · Q64 |

**Criterio de orden:** rotar IE → SN → FT → JP dentro de cada grupo de cuatro siempre que se pueda, alternar temas y evitar preguntas prácticamente duplicadas en cartas contiguas. Si se hace selección adaptativa, que sea una heurística reproducible de **presentación** y nunca una precisión psicológica fabricada.

## 4. Las 32 preguntas de referencia — enunciados ES/EN sugeridos

La columna «A / B» reproduce las **opciones ES actuales**, conservadas sin alterar; solo los **enunciados** son propuestas nuevas. Ver `js/questions.js` para EN original, signos y fuente.

| ID · eje | Enunciado personalizado ES | Opción A original | Opción B original |
|---|---|---|---|
| Q01 · JP | Para recordar tareas, ¿qué recurso utilizas más? | Hace listas | Confía en su memoria |
| Q02 · FT | Ante una idea que te proponen, ¿qué actitud te describe mejor? | Es escéptico/a | Quiere creer |
| Q03 · IE | Cuando pasas tiempo a solas, ¿con qué te identificas más? | Se aburre pasando tiempo a solas | Necesita tiempo a solas |
| Q04 · SN | Ante las cosas tal y como son, ¿cuál es tu tendencia? | Acepta las cosas tal como son | No le satisface cómo están las cosas |
| Q05 · JP | ¿Cómo sueles mantener tu habitación? | Mantiene su habitación ordenada | Deja las cosas en cualquier sitio |
| Q06 · FT | ¿Cómo te relacionas con la idea de una mente «robótica»? | Considera «robótico» un insulto | Aspira a tener una mente mecánica |
| Q07 · IE | ¿Qué nivel de energía suele describirte mejor? | Enérgico/a | Tranquilo/a |
| Q08 · SN | En una evaluación, ¿qué formato prefieres? | Prefiere exámenes tipo test | Prefiere respuestas de desarrollo |
| Q09 · JP | ¿Qué palabra describe mejor tu manera de organizarte? | Caótico/a | Organizado/a |
| Q10 · FT | ¿Cómo suelen afectarte los comentarios que pueden herir? | Se siente herido/a fácilmente | Es difícil herir sus sentimientos |
| Q11 · IE | ¿En qué entorno sueles trabajar mejor? | Trabaja mejor en grupo | Trabaja mejor a solas |
| Q12 · SN | ¿Hacia qué momento tiende a dirigirse tu atención? | Se centra en el presente | Se centra en el futuro |
| Q13 · JP | ¿Con cuánta antelación acostumbras a planificar? | Planifica con mucha antelación | Planifica en el último momento |
| Q14 · FT | ¿Qué tipo de reconocimiento valoras más de los demás? | Busca el respeto de los demás | Busca el cariño de los demás |
| Q15 · IE | ¿Qué efecto suelen tener en ti las fiestas? | Las fiestas le dejan agotado/a | Las fiestas le dan energía |
| Q16 · SN | ¿Cómo sueles situarte dentro de un grupo? | Encaja entre los demás | Destaca entre los demás |
| Q17 · JP | Al tomar decisiones, ¿qué tendencia te representa más? | Mantiene abiertas sus opciones | Se compromete con una decisión |
| Q18 · FT | ¿Qué habilidad te gustaría desarrollar especialmente? | Quiere ser bueno/a reparando cosas | Quiere ser bueno/a ayudando a personas a mejorar |
| Q19 · IE | En una conversación, ¿qué haces con más frecuencia? | Habla más | Escucha más |
| Q20 · SN | Cuando cuentas un acontecimiento, ¿qué tiendes a destacar? | Al contar un suceso, explica qué ocurrió | Al contar un suceso, explica qué significó |
| Q21 · JP | Ante una tarea pendiente, ¿qué sueles hacer? | Se pone a trabajar enseguida | Deja las tareas para más tarde |
| Q22 · FT | Al tomar decisiones, ¿qué suele guiarte más? | Sigue al corazón | Sigue a la cabeza |
| Q23 · IE | ¿Qué te apetece más en tu tiempo libre? | Se queda en casa | Sale a divertirse |
| Q24 · SN | Al explorar un tema, ¿qué te interesa más? | Prefiere la visión de conjunto | Prefiere los detalles |
| Q25 · JP | Antes de realizar una actividad, ¿qué enfoque prefieres? | Improvisa | Se prepara |
| Q26 · FT | Ante un dilema moral, ¿qué suele guiarte más? | Basa la moralidad en la justicia | Basa la moralidad en la compasión |
| Q27 · IE | Cuando necesitas llamar a alguien que está lejos, ¿qué te describe mejor? | Le cuesta gritar muy fuerte | Le sale natural gritar a alguien que está lejos |
| Q28 · SN | ¿Qué enfoque te atrae más para conocer un tema? | Teórico/a | Empírico/a |
| Q29 · JP | ¿Dónde tiendes a poner más intensidad? | Trabaja intensamente | Se divierte intensamente |
| Q30 · FT | ¿Cómo describirías tu relación con las emociones? | Se siente incómodo/a con las emociones | Valora las emociones |
| Q31 · IE | Ante un público, ¿qué tendencia reconoces en ti? | Le gusta actuar delante de otras personas | Evita hablar en público |
| Q32 · SN | Para comprender algo, ¿qué preguntas te surgen primero? | Quiere saber quién, qué y cuándo | Quiere saber por qué |

**Enunciados EN de estas 32 cartas:** incluidos en el JSON de planificación, no introducidos en la UI actual. En Q02, Q06, Q27, Q29 y otros ítems problemáticos, ninguna pregunta introductoria debe aparentar «resolver» las limitaciones del par de afirmaciones. Se revisarán con calma en la fase editorial.

## 5. Las 32 preguntas nuevas — propuestas ES

Cada nueva pregunta tiene un identificador estable, un contexto concreto y dos opciones igualmente defendibles. **`Polo alto` = lado que provisionalmente expresaría E/N/T/P, nunca una clave OEJTS oficial.** Para el usuario final esta etiqueta NO se muestra.

| ID · eje | Pregunta sugerida | A · izquierda | B · derecha | Polo alto |
|---|---|---|---|---|
| Q33 · IE | Al incorporarte a una actividad con gente nueva, ¿qué te sale primero? | Empezar a conversar mientras conozco el ambiente | Observar el ambiente y acercarme poco a poco | A |
| Q34 · IE | Cuando una idea todavía está poco clara, ¿cómo prefieres desarrollarla? | Pensarla a solas antes de compartirla | Hablarla con alguien para ir dándole forma | B |
| Q35 · IE | Después de varias horas de actividades compartidas, ¿qué te apetece más? | Dedicar un rato a una actividad individual | Seguir compartiendo alguna actividad con otras personas | B |
| Q36 · IE | Cuando surge un asunto interesante en un grupo pequeño, ¿qué haces más a menudo? | Participo pronto para explorar ideas entre todos | Escucho primero y aporto cuando lo he pensado | A |
| Q37 · SN | Al aprender a usar una herramienta, ¿qué te ayuda más al principio? | Probar una tarea concreta con ella | Comprender primero la idea general de su funcionamiento | B |
| Q38 · SN | Al mirar el plano de un lugar desconocido, ¿qué miras primero? | Calles, distancias y puntos concretos | Patrones del recorrido y posibilidades de exploración | B |
| Q39 · SN | Cuando recuerdas una historia, ¿qué suele permanecer más en tu memoria? | La idea que conecta lo ocurrido | Los detalles concretos de lo ocurrido | A |
| Q40 · SN | Al imaginar un proyecto futuro, ¿en qué piensas primero? | En las posibilidades que podría abrir | En sus recursos y requisitos concretos | A |
| Q41 · FT | Si tu equipo discrepa sobre un plan, ¿qué te ayuda más a decidir? | Comparar las razones usando criterios comunes | Comprender lo que necesita cada participante | A |
| Q42 · FT | Cuando alguien te pide consejo sobre una decisión difícil, ¿por dónde empiezas? | Por comprender cómo le afecta personalmente | Por examinar las opciones y sus consecuencias | B |
| Q43 · FT | Al valorar una propuesta para varias personas, ¿qué pesa primero? | Cómo puede afectar a quienes participen | Si los argumentos y criterios son consistentes | B |
| Q44 · FT | Si dos soluciones parecen razonables, ¿qué suele ayudarte a elegir? | Comparar sistemáticamente ventajas y dificultades | Considerar cuál encaja mejor con las personas implicadas | A |
| Q45 · JP | Cuando empiezas un proyecto con tiempo flexible, ¿qué prefieres? | Establecer etapas y un orden inicial | Probar caminos antes de fijar un orden | B |
| Q46 · JP | Durante una escapada sin obligaciones, ¿qué te atrae más? | Dejar varias posibilidades abiertas según el momento | Organizar de antemano las visitas principales | A |
| Q47 · JP | Cuando tienes varias tareas por delante, ¿cómo prefieres afrontarlas? | Decidir un orden y avanzar paso a paso | Alternarlas según lo que pida cada momento | B |
| Q48 · JP | Si una condición importante cambia a mitad de un plan, ¿qué haces primero? | Explorar nuevas alternativas y ajustar la marcha | Reorganizar las etapas para mantener una ruta clara | A |
| Q49 · IE | Cuando descubres algo que te entusiasma, ¿qué te sale primero? | Compartirlo y comentarlo con alguien | Explorarlo por mi cuenta antes de contarlo | A |
| Q50 · IE | En un encuentro con personas que conoces, ¿qué parte disfrutas más? | Tener algunas conversaciones tranquilas y largas | Moverme entre conversaciones diferentes | B |
| Q51 · IE | Cuando un proyecto te sale especialmente bien, ¿cómo prefieres celebrarlo? | Compartiendo el momento con varias personas | Disfrutándolo de manera más reservada | A |
| Q52 · IE | Si tienes que preparar una propuesta, ¿qué proceso te resulta más natural? | Escribirla o pensarla primero de forma individual | Desarrollarla mediante una conversación inicial | B |
| Q53 · SN | Para explicar una idea compleja, ¿qué recurso utilizas primero? | Un ejemplo específico que se pueda observar | Una analogía que conecte varios conceptos | B |
| Q54 · SN | Al visitar una exposición, ¿qué te atrae más de entrada? | Las conexiones entre piezas, épocas o ideas | Los materiales y detalles de cada pieza | A |
| Q55 · SN | Cuando lees un informe con muchos datos, ¿qué buscas primero? | Cifras y observaciones específicas | Tendencias y relaciones generales | B |
| Q56 · SN | Si un enfoque no funciona, ¿qué exploras primero? | Otras maneras posibles de plantear el problema | Qué paso concreto ha fallado en el enfoque actual | A |
| Q57 · FT | Al comentar el borrador de alguien que ha pedido tu opinión, ¿qué priorizas? | Identificar mejoras concretas y sus motivos | Comprender primero qué quiere expresar la persona | A |
| Q58 · FT | Cuando dos personas discrepan, ¿qué te ayuda a intervenir? | Escuchar qué preocupa a cada una | Acordar criterios claros para resolver la diferencia | B |
| Q59 · FT | Si una regla admite excepciones, ¿qué te parece más importante al decidir? | Considerar las circunstancias particulares | Mantener criterios coherentes y explicables | B |
| Q60 · FT | Cuando lees un debate complejo, ¿qué observas primero? | Si los argumentos están bien fundamentados | Qué valores importan a quienes participan | A |
| Q61 · JP | Antes de empezar una actividad creativa, ¿cómo te gusta proceder? | Experimentar con materiales y decidir durante el proceso | Elegir pasos y herramientas con antelación | A |
| Q62 · JP | Si dispones de un fin de semana libre, ¿cómo prefieres organizarlo? | Decidir antes cuándo haré cada actividad | Ir eligiendo actividades conforme avance | B |
| Q63 · JP | Cuando recibes una tarea compleja, ¿qué te ayuda más a arrancar? | Dividirla en una secuencia de pasos | Abrir varias vías y ajustar al ver cuál funciona | B |
| Q64 · JP | Al organizar una actividad en grupo, ¿qué prefieres dejar decidido? | Solo lo imprescindible, dejando margen a ideas nuevas | Los detalles principales para que todo esté previsto | A |

**Inglés:** el JSON adjunto contiene traducción EN inicial de cada enunciado y cada polo. Ninguna está aprobada. Estilo editorial deseado: situaciones cotidianas, una sola preferencia por carta, longitud móvil legible; sustituir un par si se solapa excesivamente con otro.

## 6. Rúbrica de calidad para cada pregunta nueva

- **Neutralidad:** ni A ni B se formula como más responsable, inteligente, cuidadoso, popular o «correcto». Evitar caricaturizar autonomía, planificación, emocionalidad o análisis.
- **Un constructo razonable:** cada par debe enfocarse principalmente en **una** dimensión. Ciertos contextos mezclan ejes; documentar y corregir esos casos.
- **Fidelidad bilingüe:** traducciones EN/ES paralelas, sin cambiar la situación ni introducir consecuencias nuevas.
- **Aplicabilidad:** situaciones accesibles con diversidad de edad, experiencia, formas de comunicación y vida cotidiana; ofrecer alternativas cuando dependen de trabajar o viajar.
- **Cobertura temática:** comprobar que las ocho nuevas de un eje no son ocho formulaciones del mismo gesto.
- **Respuestas utilizables:** el centro puntúa como neutral observado; saltar se contabiliza como pendiente. Nunca convertir automáticamente una omisión en 3.
- **Sesgo de posición:** 4 de las 8 nuevas por eje con el polo alto en A y 4 con el polo alto en B. Esa alternancia evita una clave obvia, aunque no elimina por sí sola sesgos.
- **Arte sin pistas:** el SVG debe representar la **situación**, no dar mejores colores, expresiones o iluminación al polo de puntuación alta.
- **Procedencia:** OEJTS Q01–Q32 y TYPE/16 Q33–Q64 permanecen versionados por separado para autoría, licencia, pruebas y puntuación.

## 7. Puntuación: separación obligatoria

### 7.1. Referencia OEJTS-32 — sin cambios

Con 32 respuestas válidas, ejecutar exactamente el `scoreAll` existente y su criterio original de desempate. Si faltan ítems, ofrecer solo lectura parcial y revisión. En las paradas 48 y 64, **esta referencia no debe cambiar** al agregar respuestas Q33–Q64.

### 7.2. Índice propio TYPE/16 — solamente una idea técnica

Para explorar la utilidad de las nuevas preguntas, construir **otro índice no validado** de tendencia por eje: usar el centro `respuesta - 3`, invertir cada nueva pregunta mediante su clave propuesta, y computar por separado las contribuciones de las ocho preguntas nuevas de cada dimensión. Visualizarlo como «señal exploratoria», **no como porcentaje de certeza, probabilidad, validación, fiabilidad o exactitud**.

Tras revisar datos, podría plantearse una lectura combinada de 16 por eje; sin estudios de calibración no debe equipararse automáticamente la puntuación de los nuevos ítems con la escala OEJTS. Hasta entonces, **dos lecturas separadas** es la opción más honesta.

### 7.3. Comportamiento cuando hay respuestas mixtas o empates

- Mostrar «preferencia poco definida / señales en ambos sentidos» como resultado legítimo.
- Empates no se reinterpretan como «personalidad equilibrada» de forma concluyente.
- Cambios entre paradas no se llaman «inconsistencia personal». Son diferencias observadas en las respuestas y contextos.

## 8. Qué falta decidir antes de programarlo

1. **Aceptar o corregir** las paradas 12 / 24 / 32 / 48 / 64.
2. Revisar los enunciados personalizados para Q01–Q32, sobre todo en términos de fidelidad a la fuente.
3. Revisar **las 32 nuevas** por contexto, imparcialidad y solapamiento; cerrar su nombre/versión.
4. Probar el texto más largo y las paradas dentro de Gesture Lab v0.11.1 (sin rehacer la interfaz original).
5. Diseñar una vista de progreso **12 → 24 → 32 → 48 → 64**, que explique la diferencia entre lectura provisional, referencia y extensión.
6. Preparar motor extendido **independiente**; tests de cuotas por dimensión, omisiones, restauración, claves A/B, bilingüismo y cálculo OEJTS intacto.
7. Solo después incorporar el flujo a un **nuevo prototipo**, sin tocar `gesture-lab.html`, ni presentarlo como arte o test definitivos.

## 9. Resumen de control

- 64 ítems planificados, **16 por eje**; 32 originales preservados + 32 nuevos redactados ES/EN.
- 5 paradas; cuotas acumuladas **3, 6, 8, 12, 16 por eje**.
- Cuatro nuevos ítems con polo alto A y cuatro con polo alto B por cada eje.
- **Todo es documentación**, no cambios de funcionamiento en Pages ni en el motor aprobado.
- Archivo de datos de trabajo: [QUESTION_BANK_64_DRAFT.json](QUESTION_BANK_64_DRAFT.json).
