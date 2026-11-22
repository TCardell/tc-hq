# TYPE/16 — motor de preguntas y perfil tipológico (en desarrollo)

Proyecto experimental de 16 combinaciones de preferencias, **no** MBTI® oficial, prueba clínica ni herramienta para decisiones de alto impacto. El objetivo es ofrecer una experiencia educativa y de reflexión, con límites explícitos de interpretación.

## Dos partes independientes

**Interfaz aprobada.** `gesture-lab.html` (v0.11.1) funciona en GitHub Pages y sigue siendo **solo un laboratorio de gestos** con ocho decisiones ficticias. **No se ha modificado ni conectado aún al test**. El paisaje, los reversos y las animaciones quedan intactos.

**Motor de evaluación.** La rama `feature/type16-foundation` contiene una implementación nueva, sin componentes gráficos, en `js/engine/`. Su API agrupa preguntas, el protocolo de 12 + 20, selección de la siguiente pregunta, respuestas, resultados, deshacer, revisión de omisiones y recuperación de progreso. Esta parte **todavía no se publica como test**.

## Diseño del motor

- **Banco base:** OEJTS 1.2 de Eric Jorgenson (2015), **32 ítems**. Cuatro dimensiones de **ocho preguntas** con signo de corrección propio; la traducción española está **pendiente de validación**.
- **Respuestas:** `1` muy A, `2` un poco A, `3` neutral, `4` un poco B, `5` muy B; `null` omisión. Saltar y neutral no son equivalentes.
- **Fase rápida:** 12 preguntas, tres por dimensión, en orden fijo. Resultado **exploratorio**, nunca puntuación oficial completa.
- **Profundización:** preguntas restantes reordenadas de forma determinista para equilibrar ejes, observar tendencias próximas al centro y diversificar temas. Heurística de **administración**, no teoría de respuesta al ítem ni cálculo de fiabilidad.
- **Resultado completo:** con **32 respuestas válidas**, las cuatro fórmulas OEJTS 1.2 dan valores 8–40 y una combinación de cuatro letras. Aunque la fórmula sea fiel, la presentación por cartas y la traducción no han sido validadas.
- **Resultados parciales:** cobertura, escala descriptiva, letras provisionales y límites aritméticos de las puntuaciones todavía posibles. **No son probabilidades ni intervalos de confianza.**
- **Sesión:** estado serializable con esquema y versión, deshacer, repaso de preguntas omitidas, cambio ES/EN y recuperación de sesión; sin conexión de red, analítica ni almacenamiento dentro del propio motor.

## Estructura

| Ruta | Propósito |
|---|---|
| `js/questions.js` / `js/scoring.js` | Fuente de 32 ítems y clave original, conservadas sin cambios de puntuación |
| `js/engine/catalog.js` | Inventario, dimensiones, signos, idiomas, auditoría y origen |
| `js/engine/profile.js` | Puntuación, controles de entrada, informe por ejes y límites parciales |
| `js/engine/selection.js` | Selección fija rápida + orden adaptativo en profundización |
| `js/engine/session.js` | Máquina de estados, omisiones, deshacer, validación y restauración |
| `js/engine/index.js` | API pública sin DOM |
| `tests/engine-*.test.mjs` | Pruebas unitarias y simulación de perfiles aleatorios |
| `tools/engine-smoke.mjs` | Recorrido automático de demostración, sin UI |
| `ENGINE_ARCHITECTURE.md` | Contratos, límites e integración futura |
| `QUESTION_AUTHORING_SPEC.md` | Normas de calidad editorial y nuevas preguntas |

## Ejecutar las pruebas

Requiere Node.js reciente. Desde `programs/type16/`:

```bash
npm test
node tools/engine-smoke.mjs
```

El motor no necesita dependencias de terceros ni compilación. `npm test` ejecuta también los tests antiguos de puntuación e idioma y los tests nuevos de estado, banco, selección y propiedades. El `smoke` imprime resultados en JSON sin cargar ninguna página.

## Estado pendiente

1. Revisar y corregir los textos ES/EN de las 32 preguntas: revisar `QUESTION_AUDIT.md` y mantener un registro de cambios.
2. Probar comprensión y neutralidad de los pares, y el efecto de su presentación como cartas.
3. Diseñar por separado cualquier banco futuro de preguntas originales TYPE/16; no mezclar escalas sin calibración.
4. Definir cómo explicar en resultados lo provisional, lo dudoso y los empates sin porcentajes de «exactitud» inventados.
5. Conectar el motor a la **interfaz ya aprobada** mediante un adaptador, preservando su funcionamiento y estética y realizando pruebas de regresión.

## Derechos y fuentes

Ítems OEJTS 1.2 y adaptaciones sujetos a **CC BY-NC-SA 4.0** (atribución, no comercial y compartir igual). Fuente original: https://openpsychometrics.org/tests/OJTS/development/OEJTS1.2.pdf . Véase `CREDITS.md` y `METHODOLOGY.md`. Los módulos originales de ingeniería son independientes de los contenidos protegidos del instrumento.

**PR de investigación:** [#6](https://github.com/TCardell/tc-hq/pull/6), mantenida como borrador mientras no se integre y revise el cuestionario.


## Auditoría bilingüe de preguntas v1 (sin cambios de interfaz)

Se han cotejado los 32 textos ingleses con el PDF original, revisado críticamente sus traducciones españolas y clasificado riesgos de sesgo, comprensibilidad y pertinencia del constructo. [Abrir auditoría de las 32 preguntas](QUESTION_AUDIT.md). El registro machine-readable está en `js/engine/editorial-audit.js` y las regresiones de fuente/clave en `tests/engine-editorial.test.mjs`.

**No son 32 preguntas «aprobadas».** Todas las traducciones/candidatos siguen pendientes de revisión humana y entrevistas de comprensión. Los candidatos están aislados: el motor sigue consumiendo los ítems originales y no cambia las fórmulas.

## Ronda de entrevistas cognitivas (preparada, **no realizada**)

El avance siguiente **no cambia el test ni la clave de puntuación**: crea un protocolo de revisión independiente y un pequeño motor de formularios no puntuables. Consultar:

- [COGNITIVE_PILOT_PROTOCOL.md](COGNITIVE_PILOT_PROTOCOL.md): entrevistas cualitativas, consentimiento, cuatro formularios, versiones ES/EN y reglas de decisión.
- [PILOT_DECISION_LOG.md](PILOT_DECISION_LOG.md): estado inicial de las 32 preguntas y acta de decisiones sin datos personales.
- `js/engine/pilot.js`: formularios A–D equilibrados, controles de versión, codificación anónima y recuentos descriptivos, sin inferencias psicométricas.
- `tests/engine-pilot.test.mjs`: pruebas de cobertura, versiones, privacidad y aislamiento de la puntuación.

Generar un formulario de **solo lectura**: `node tools/cognitive-pilot.mjs form A es current` o `node tools/cognitive-pilot.mjs form A es candidate 3`. Inglés: `node tools/cognitive-pilot.mjs form B en source`.

El piloto **no** almacena notas de personas ni transmite respuestas a ningún servidor. Ninguna propuesta editorial está aprobada, ninguna entrevista ha sido realizada y ningún registro de ejemplo debe presentarse como evidencia real. El formulario piloto es deliberadamente distinto del juego de ocho cartas.

## Motor de interpretación de resultados (noviembre 2026)

`js/engine/interpretation.js` genera **tres niveles de lectura**, en español e inglés, sin tocar el banco ni las fórmulas: `brief` (combinación provisional/completa), `dimensions` (cuatro ejes continuos con matices) y `deep` (evidencias referenciadas por ID, tendencias visibles y cuestiones abiertas). Hay 16 descripciones originales en `interpretation-copy.js`, redactadas como combinaciones **posibles** de preferencias, no categorías naturales demostradas.

La API pública acepta las mismas respuestas del motor (1–5; omisiones fuera del objeto) y puede interpretar una sesión recuperada:

```js
import {buildInterpretation,interpretSession} from './js/engine/index.js';
const reading=buildInterpretation({3:1,12:4},{locale:'es',skipped:[15]});
// O bien: const reading=interpretSession(existingSession);
// reading.brief, reading.dimensions y reading.deep son datos, no HTML.
```

El código técnico OEJTS de 32 ítems respeta su desempate publicado; cuando una dimensión empata, TYPE/16 **no adjudica una descripción de personalidad por ese desempate**. Un resultado rápido con pocos datos tampoco recibe una etiqueta completa. Los números `observedPosition` e `intensity` son resúmenes aritméticos de respuestas, nunca probabilidades, intervalos estadísticos ni afirmaciones de fiabilidad.

Especificación y límites: [RESULT_INTERPRETATION_SPEC.md](RESULT_INTERPRETATION_SPEC.md). Pruebas de regresión: `tests/engine-interpretation.test.mjs`; demostración sin interfaz: `npm run interpret:smoke`.
