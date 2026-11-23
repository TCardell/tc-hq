# TYPE/16 · 64 cartas / cinco paradas

Prototipo separado del laboratorio v0.11.1 y del playtest anterior.

URL: https://t.cardell.es/programs/type16/playtest-64/

Paradas: 12, 24, 32, 48, 64; 16 preguntas por dimension, con 32 originales OEJTS y 32 propuestas TYPE/16.
Cada pregunta tiene enunciado propio ES/EN y opciones A/B.
Interaccion de cartas de Gesture Lab: gesto, intensidad, neutral, salto, deshacer y tutorial.
Se guardan sesiones solo en localStorage con clave type16.playtest64.v1; no se envian respuestas por red.

Resultado OEJTS original: scoreAll sobre Q01–Q32, completo exclusivamente con las 32 respuestas validas.
Las nuevas Q33–Q64 aportan un indice descriptivo separado: (valor-3) con signo provisional segun highPoleSide.
La lectura combinada es experimental, no certifica fiabilidad ni probabilidad de tipo.
Los empates no se fuerzan. Saltar no equivale a responder neutral.
Se pueden revisar preguntas omitidas en cada parada, guardar/salir y continuar desde el progreso existente.

Arte de preguntas temporal heredado del laboratorio. Ningun SVG de la galeria descartada se reutiliza.

Banco y auditoria editorial de esta version:
../docs/QUESTION_BANK_64_DRAFT.json
../docs/EDITORIAL_REVIEW_NEW_32.md

Desarrollo en pruebas; no constituye herramienta clinica ni MBTI oficial.


## Revision 64.1 — grammar and detailed interpretation

- Original 32 OEJTS response pairs are displayed as first-person statements in Spanish and English through `js/enhancements.js` (render-only; stored source strings, scoring direction and ids are unchanged).
- Added expandable answer-level evidence for both poles of every axis, separate original/extended illustrative portraits, plus a five-stage trajectory recalculated from current recorded responses.
- The new questions and results remain exploratory, not a psychometrically calibrated confidence measure. Original OEJTS score is isolated from new items.
- Existing `type16.playtest64.v1` local saved progress remains compatible; Gesture Lab v0.11.1 is unchanged.
