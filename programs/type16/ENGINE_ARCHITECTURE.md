# TYPE/16 — motor de evaluación v0.1 (sin interfaz)

**Estado: implementación técnica exploratoria, 22 de noviembre de 2026.** La interfaz jugable aprobada (`gesture-lab.html`, v0.11.1) **no se modifica** y todavía **no está conectada** a este motor. Este documento distingue entre reglas implementadas, hipótesis editoriales y validación científica pendiente.

## 1. Fuente, permiso y límites

Banco de partida: **Open Extended Jungian Type Scales 1.2** (OEJTS), **Eric Jorgenson (2015)**, 32 pares bipolares y cuatro escalas de ocho ítems cada una. Fuente primaria: https://openpsychometrics.org/tests/OJTS/development/OEJTS1.2.pdf . Ítems y traducciones/adaptaciones de esos ítems sujetos a **CC BY-NC-SA 4.0** (atribución, no comercial, compartir igual). La licencia de los ítems **no** se transfiere automáticamente al código original que los procesa. La versión española actual es una traducción **editorial provisional, no validada**. No se presenta como MBTI® oficial, diagnóstico ni instrumento para decisiones de alto impacto. La propia fuente original no garantiza fiabilidad ni exactitud.

El protocolo de TYPE/16 **reordena** preguntas respecto a OEJTS y utiliza formato de tarjetas; aunque la clave matemática de 32 respuestas reproduce las fórmulas fuente, esta modalidad no tiene demostrada equivalencia psicométrica. Las 12 preguntas rápidas tampoco forman una versión corta validada.

## 2. Estructura y responsabilidades

| Módulo | Contrato | Dependencias |
|---|---|---|
| `js/questions.js` | 32 pares ES/EN originales en esta rama, su orden y selección rápida | ninguna |
| `js/scoring.js` | **Fórmulas originales** OEJTS 1.2 (se conserva sin modificaciones) | ninguna |
| `js/engine/catalog.js` | catálogo referenciado por Q01–Q32, eje, signo, tema, bandera editorial, metadatos de fuente/licencia, auditoría de integridad | `questions`, `scoring` |
| `js/engine/profile.js` | validación estricta de respuestas, puntuación exacta de 32, puntuación exploratoria, cobertura, neutrales, omisiones, intervalos **aritméticos** | `scoring`, `catalog` |
| `js/engine/selection.js` | primera ruta rápida fija y secuencia de profundización determinada por cobertura, empate observado y temas | `catalog`, `profile` |
| `js/engine/session.js` | máquina de estados pura: preguntas, checkpoints, repaso, deshacer, cambio de idioma, persistencia/versiones | `catalog`, `selection`, `profile` |
| `js/engine/index.js` | API estable de importación para una futura capa de interfaz | módulos anteriores |

No depende de DOM, `localStorage`, red, paquetes externos ni componentes visuales. El motor devuelve **datos**, nunca HTML.

## 3. Escala de respuesta (única traducción gesto → valor)

- `1`: muy A, extremo **izquierdo** de la pregunta original.
- `2`: un poco A.
- `3`: neutral (respuesta **real** y puntuada como centro).
- `4`: un poco B.
- `5`: muy B, extremo **derecho** de la pregunta original.
- `null`: **saltar**, sin puntuación; el ID queda pendiente de repaso.

No dar por sentado que «A» es introversión ni que «B» es extroversión: cada pregunta tiene su propio **signo** original. Los ítems invertidos se corrigen en la clave de puntuación; el motor preserva la orientación original.

## 4. Recorridos, decisiones y estados

```text
createSession() → quick [12 preguntas fijas: 3 por eje]
      │
      └→ checkpoint / quick → resultado provisional
                            ├→ continue → deep [20 preguntas restantes, adaptativas por orden]
                            │               └→ checkpoint / deep → clave de 32 si hay 32 válidas
                            ├→ review [una pasada por saltadas]
                            │             └→ checkpoint anterior
                            └→ finish → done [conserva posibilidad de profundizar]
```

La fase `quick` mantiene un orden fijo inicialmente aprobado: Q3, Q12, Q22, Q25, Q15, Q20, Q14, Q13, Q11, Q32, Q26 y Q17. No selecciona respuestas por una supuesta dificultad estadística.

La fase `deep` utiliza una heurística reproducible de **ordenación, no calibración**:

1. Preferir el eje con menos ítems **presentados** (evita que aparezca demasiado un solo eje).
2. Entre ejes igualmente cubiertos, priorizar el que tiene menor magnitud media de preferencia **observada**; no interpretar esa cercanía al centro como «probabilidad» ni como verdadera incertidumbre psicométrica.
3. Evitar repetir enseguida temas editoriales muy similares.
4. Empates resueltos por ID, siempre de forma determinista.

Al término de 32 ítems presentados, todavía pueden existir omisiones. El estado `review` recorre las preguntas saltadas sin permitir bucles automáticos infinitos; saltar otra vez las deja pendientes para un nuevo repaso voluntario. Una respuesta se puede deshacer; se guardan como máximo 48 pasos de historial.

## 5. Puntuación y significado de la incertidumbre

La clave exacta para **32/32 respuestas** conserva las cuatro fórmulas del PDF (ver `METHODOLOGY.md`), cada escala entre 8 y 40, centro 24. La convención del original usa el extremo izquierdo de la dimensión en el empate. El informe de TYPE/16 señala los empates observados y **no oculta** la convención.

Para menos de 32 respuestas, el motor devuelve:

- Puntuación descriptiva normalizada **0–100** de los ítems realmente contestados (no estimación de probabilidad).
- `rawRange: [min, max]`: posibles resultados brutos al completar todos los ítems faltantes, considerando que cada uno contribuye entre −2 y +2. Esto es una **cota matemática**, no un intervalo de confianza ni una certificación de precisión.
- `possibleLetters`: polos todavía matemáticamente posibles según lo observado, sin promesas psicométricas.
- `exploratoryCode`: letras orientativas solo cuando hay tendencia observada; `?` para ejes no observados o empatados.
- `officialType: null` mientras no haya 32 valores válidos.

**Nunca** presentar una posición de escala como «75 % de ser ENFP», ni mostrar `arithmeticallyFixed` al usuario como «confianza del 100 %».

## 6. Ejemplo de integración futura (sin efectos visuales)

```js
import {createSession, nextItem, transition, inspectSession, serializeSession, restoreSession} from './js/engine/index.js';

let session = createSession({locale: 'es'});
const id = nextItem(session); // Q3
session = transition(session, {type:'respond', id, value:2}); // Un poco A
const preview = inspectSession(session).profile; // no resultado tipológico oficial
const json = serializeSession(session); // la aplicación decidirá si guarda localmente
session = restoreSession(json);
```

Hay que conectar la interfaz con este motor **mediante un adaptador**, no copiando las reglas de puntuación dentro de `gesture-lab.html`. Las tarjetas decorativas de prueba no son preguntas del instrumento y no deben llegar al motor.

## 7. Privacidad, estabilidad y migración

- No hay red, analítica, seguimiento, identificadores personales ni perfilado remoto.
- `SESSION_SCHEMA = 2` y `BANK_VERSION = "oejts-1.2-type16-draft-1"` protegen contra estado guardado incompatible. No existe migración automática desde el prototipo de gestos ni desde la antigua aplicación provisional.
- `restoreSession` **rechaza** estados incompletos, incoherentes o con puntuaciones inválidas, evitando reinterpretarlos silenciosamente. El almacenaje concreto y una opción de borrar/exportar se implementarán al integrar la interfaz.
- Todas las transiciones de sesión generan un estado **nuevo**. El núcleo es reproducible a partir de historial de acciones.

## 8. Pruebas y criterios de aceptación

Desde `programs/type16/`:

```bash
npm test
```

`node --test tests/engine-*.test.mjs` ejecuta la batería nueva de 20 pruebas: integridad de 32/12 ítems, orientación de los cuatro ejes, claves extremas y empate, neutral/omisión, límites parciales, 500 vectores de respuestas frente a una fórmula independiente, 100 participantes sintéticos para selección adaptativa, guardado/restauración, deshacer, repaso y 25 trayectorias con acciones aleatorias. Sin dependencias externas.

### Pendiente antes de integrar

1. Auditoría editorial por pares del texto original inglés y traducciones ES, empezando por `QUESTION_AUDIT.md`.
2. Decidir con pruebas piloto si las etiquetas A/B y las instrucciones permiten comparar los dos polos de cada par con fidelidad.
3. Explorar ítems redundantes, sesgos de accesibilidad, y efectos de orden/tarjetas. Sin evidencia, no anunciar «test validado».
4. Definir la experiencia de la capa de resultados, explicando incertidumbre y empate, sin atribuciones psicométricas inventadas.
5. Preparar módulo independiente para futuras preguntas TYPE/16 originales. **No mezclarlas en el cómputo OEJTS 1.2** sin una escala/protocolo distinto y trabajo de validación.
6. Integrar la interfaz visual ya aprobada **sin cambiar su diseño**, con pruebas de regresión de gestos y la persistencia local.

## 9. Interpretación de resultados (sin modificar la interfaz)

Módulos nuevos: `js/engine/interpretation.js` y `js/engine/interpretation-copy.js`.
La implementación calcula tres vistas de un mismo conjunto de respuestas: resumen (`brief`), cuatro dimensiones (`dimensions`) y lectura profundizada (`deep`). Está desacoplada de estilos, DOM, almacenamiento y de las cartas de prueba. Cada matiz se fundamenta en sumas firmadas de ítems reales: el motor expone IDs, dirección, fuerza de elección y tema editorial, sin presentar un ítem como evidencia diagnóstica.

Solo se muestra una descripción de alguno de los 16 patrones cuando las cuatro dimensiones tienen al menos dos respuestas válidas y no empatan. En un perfil completo, el código de la fuente se conserva; **si existe empate, la descripción tipológica se suprime y se explica la convención de desempate**. Los 12 ítems rápidos generan orientaciones provisionales. Véase `RESULT_INTERPRETATION_SPEC.md`.
