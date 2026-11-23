# TYPE/16 — motor de interpretación v1 (sin interfaz)

**Estado: implementación técnica exploratoria, 23 de noviembre de 2026.** Esta documentación describe un módulo original para explicar resultados, no una norma psicométrica ni una escala validada. Los textos fuente de OEJTS 1.2, sus 32 ítems y su fórmula no se alteran. El prototipo visual `gesture-lab.html` sigue independiente.

## 1. Propósito y principios

El motor calcula **tres capas** sin usar recursos externos ni inteligencia artificial generativa:

1. `brief`: estado del cuestionario y, cuando es razonable, un código de cuatro letras con descripción breve de una de 16 combinaciones. Todos los códigos son **resultados de escala, no identidades inmutables**.
2. `dimensions`: interpretación de cada eje, puntuación observada, cobertura 0–8, polo que destaca, intensidad descriptiva, respuestas neutrales y ejemplos de elecciones en ambos sentidos.
3. `deep`: hasta dos tendencias destacadas, notas sobre dimensiones abiertas o mixtas, y sugerencia para continuar o revisar preguntas omitidas.

Los textos se alojan en `interpretation-copy.js` y son exclusivos de TYPE/16. Hay dos versiones paralelas (ES/EN) para los 16 códigos y los cuatro ejes. No se usan descripciones ajenas de MBTI® ni se pretende inferir profesión, salud, relaciones íntimas, aptitudes o cualidades morales.

## 2. API

```js
import {buildInterpretation, interpretSession, auditInterpretationCopy} from './js/engine/index.js';
const analysis=buildInterpretation({3:1,12:4,22:5},{locale:'es',skipped:[15]});
const fromSession=interpretSession(restoredSession);

analysis.brief;       // title, opening, type {code,status,title,summary,...}
analysis.dimensions;  // IE, SN, FT, JP; 4 objetos con reading, evidence, puntuación
analysis.deep;        // highlights, nuances, nextAction, nextMessage
analysis.safeguards;  // aclaraciones para interfaz
```

- `locale`: únicamente `es` o `en`; otra lengua causa error.
- `answers`: objeto cuyos ID 1–32 apuntan a enteros 1–5. Neutral es **3**, omisión es ausencia de clave; `null` no puntúa.
- `skipped`: IDs válidos sin respuesta que se hayan omitido; pueden revisarse sin contaminar el cálculo.
- El motor devuelve datos JSON serializables, congelados recursivamente, sin HTML ni efectos sobre el estado.
- `interpretSession(session)` valida el esquema de sesión y respeta el idioma escogido.

## 3. Reglas de interpretación

Cada dimensión contiene ocho ítems. Para cada respuesta, la contribución centrada se calcula como:

`contribution = scoringSign * (response - 3)`

El signo proviene exclusivamente de la clave OEJTS 1.2. `centered = suma(contribution)` por eje, `intensity = abs(centered)/(2*answered)` para ejes observados y `observedPosition` procede de `buildProfile`. Son resúmenes **descriptivos de las respuestas dadas**.

Umbrales de redacción internos (heurísticos, NO puntos de corte validados):

| Intervalo de intensidad | Término mostrado |
| --- | --- |
| 0 | Equilibrio observado; sin polo preferido |
| mayor que 0 y menor que 0,25 | Inclinación suave |
| 0,25 a menos que 0,625 | Inclinación intermedia |
| 0,625 a 1 | Inclinación marcada |

Cuando hay menos de cuatro respuestas en un eje se señala expresamente que la muestra es pequeña, **incluso si la intensidad aritmética es máxima**. Cuando quedan ítems sin responder se advierte que el resultado puede cambiar. Una respuesta de signo opuesto se describe como un **matiz**, no como un error o inconsistencia.

El campo `evidence` documenta hasta dos ejemplos de respuestas en el sentido de la tendencia y dos en el sentido contrario, con sus ID y temas. Cada ejemplo es trazable a una respuesta real y a su signo. Las referencias no convierten por sí solas un ítem en demostración psicológica.

## 4. Cuándo se muestra una de las 16 descripciones

- **Sin respuestas**: resultado abierto, ningún tipo.
- **Exploración parcial**: solo se forma un código cuando los cuatro ejes tienen al menos dos respuestas válidas y en ninguno hay empate. Se marca **provisional**.
- **32 respuestas válidas, sin empates**: se presenta el código con la fórmula de referencia y la descripción asociada. No constituye una prueba de fiabilidad del instrumento, de las traducciones ni del formato de administración.
- **32 respuestas con empate**: el código técnico sigue disponible (la fuente utiliza desempate convencional), pero **no se le asigna una descripción de personalidad**. Se explica el empate y se describen los ejes por separado.

Las 16 descripciones son resúmenes originales construidos a partir de combinaciones de ejes. No atribuyen competencias, pronostican conducta ni distinguen tipos naturales.

## 5. Matices, evidencia y continuación

- `deep.highlights`: hasta dos ejes con al menos tres respuestas y orientación marcada observada.
- `deep.nuances`: ejes cerca del centro, empatados, con respuestas de ambas orientaciones o aún incompletos.
- `deep.nextAction`: `review` si hay omisiones, `continue` si faltan respuestas sin omisiones, `none` cuando las 32 están contestadas.
- Los ejes mantienen `raw`, `rawRange` y `possibleLetters` del motor base. Los límites son puramente matemáticos, **no intervalos de confianza**.

## 6. Salvaguardas y decisiones de producto

- No mostrar «porcentaje de ser INFP», «certeza», «97 % de fiabilidad» ni diagnósticos.
- No convertir tres respuestas en una descripción concluyente de personalidad.
- No presentar los textos como declaraciones de hechos personales: utilizar «estas respuestas sugieren», «en este grupo aparece...».
- Respetar la licencia **CC BY-NC-SA 4.0** de los ítems de origen; los párrafos originales de interpretación son independientes de esos ítems.
- Mantener el motor independiente de la presentación para integrar después con la interfaz visual aprobada sin alterar gestos, animaciones ni el mazo decorativo.

## 7. Pruebas

```bash
npm test
npm run interpret:smoke
```

`tests/engine-interpretation.test.mjs` comprueba 16 combinaciones por dos idiomas, ausencia de respuestas, empates, omisiones, trazabilidad de matices, entradas inválidas, inmutabilidad, igualdad de puntuación ES/EN y 500 perfiles sintéticos. Las pruebas garantizan coherencia informática, **no validez científica**.

## 8. Próximo hito

Conectar mediante un adaptador el motor de preguntas y el de interpretación con las cartas aprobadas. El adaptador deberá evitar que las ocho preguntas **decorativas** del prototipo visual lleguen a la clave OEJTS y preservar la gestión de sesiones, idiomas, omisiones y navegación. Esa integración será una fase independiente; no forma parte de esta entrega.
