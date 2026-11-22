# TYPE/16 — Protocolo de entrevistas cognitivas y revisión de ítems (v1)

**Estado: protocolo preparado, SIN entrevistas realizadas.** Fecha: noviembre 2026. **Uso:** revisión editorial del banco OEJTS 1.2, no administración clínica, validación psicométrica, cálculo de fiabilidad, calibración adaptativa ni demostración de equivalencia ES/EN.

## Objetivo y separación de responsabilidades

Determinar **cómo interpretan personas reales cada opción de respuesta** y detectar ambigüedad, falsa oposición, diferencias de traducción, dependencia del contexto, accesibilidad y deseabilidad social antes de modificar el cuestionario. Las entrevistas cognitivas examinan comprensión, recuperación de experiencias, juicio y selección de respuesta; **no** sirven, por sí solas, para validar una tipología ni inferir la frecuencia poblacional de problemas.

- **Fuente congelada:** `js/questions.js`, `js/scoring.js` y `js/engine/catalog.js` preservan 32 ítems, clave de inversión y ecuaciones OEJTS 1.2. La clave sigue separada del trabajo editorial.
- **Banco editorial:** `js/engine/editorial-audit.js` documenta 32 propuestas ES no aprobadas. Una propuesta más natural **puede cambiar el constructo** y, por tanto, no debe recibir automáticamente la puntuación de OEJTS.
- **Plan de entrevistas:** `js/engine/pilot.js` crea formularios de lectura **no puntuables**, con texto explícitamente marcado como no validado.
- **Evidencia:** solo registros **codificados, anónimos y locales**; el repositorio no recibe datos reales de participantes.

## Diseño de la primera ronda

Cuatro formularios (A–D) de **8 ítems cada uno**, con exactamente **2 por eje** (IE, SN, FT, JP) y **3 de prioridad alta** en cada formulario. Los 32 aparecen una sola vez si se recorre A+B+C+D. Cada formulario permite rotar el orden de los ítems (`rotation=0..7`) para explorar efectos de orden, sin alterar las palabras.

| Formulario | Preguntas OEJTS | Prioridad alta | Cobertura |
|---|---|---|---|
| A | Q27, Q08, Q01, Q02, Q05, Q11, Q14, Q04 | Q27, Q08, Q02 | 2 por eje |
| B | Q16, Q09, Q31, Q06, Q03, Q13, Q20, Q22 | Q16, Q31, Q06 | 2 por eje |
| C | Q10, Q07, Q28, Q17, Q12, Q25, Q18, Q15 | Q10, Q28, Q18 | 2 por eje |
| D | Q29, Q26, Q19, Q24, Q30, Q32, Q21, Q23 | Q29, Q26, Q30 | 2 por eje |

**Variantes:** en español, `current` (traducción actual) y `candidate` (propuesta editorial). **Una misma persona ve una sola variante del mismo formulario** para evitar que la segunda redacción esté influida por la primera. No hay versión inglesa alternativa aprobada: el formulario inglés usa `source` (original) y pregunta por comprensión/adecuación, no hace una comparación lingüística ficticia.

**Plan orientativo de cobertura**, sujeto a recursos y heterogeneidad: 2 entrevistas por celda de formulario×variante ES (4×2×2=16 entrevistas ES); y 2 por formulario en EN (4×2=8 entrevistas EN). Son cantidades logísticas **ilustrativas**, no umbrales de validez ni tamaños muestrales que permitan estimación estadística. Con menos entrevistas se documentan vacíos, no se declara éxito. Para nueva ronda, congelar una versión revisada antes de volver a reclutar; no reutilizar silenciosamente la misma etiqueta de versión.

## Participantes y consentimiento

- Participación voluntaria de **personas adultas** capaces de consentir. Buscar diversidad de familiaridad con cuestionarios, niveles educativos y uso de móvil; no inferir aptitudes ni perfiles psicológicos.
- Informar: «Estamos probando la claridad de las preguntas, **no** evaluando tu personalidad. Puedes saltarte cualquiera y retirarte sin dar explicaciones. No se grabará ni compartirá información personal». No presentar respuestas como diagnóstico, resultado validado ni puntuación oficial.
- No recopilar nombre, correo, teléfono, IP, ubicación exacta, información clínica, características sensibles ni otros datos identificables. **No grabar audio/vídeo por defecto**. Si algún futuro estudio necesita grabaciones, diseñar consentimiento y protección de datos por separado antes de empezar.
- Notas cualitativas de trabajo, si existen, solo en almacenamiento local protegido, desidentificadas, con plazo de retención definido previamente; **no subirlas a GitHub**. La herramienta proporcionada acepta solo categorías codificadas, sin campos libres ni identificadores.
- Ofrecer lectura, descanso, tipografía suficiente, opción de no responder y alternativa accesible; no forzar respuestas a situaciones que no se apliquen (p. ej. examen, voz, eventos sociales).

## Guion sugerido (25–40 minutos, adaptable)

1. **Introducción (3 min).** Objetivo, voluntariedad, ausencia de diagnóstico, posibilidad de omitir, confirmación de que no se registrarán datos personales.
2. **Práctica (2 min).** Enseñar cómo funcionan los extremos A/B, los grados suave/fuerte, Neutral y Saltar con un ejemplo **ficticio no puntuable**. Comprobar que diferencian Neutral (ambas / punto medio) y Saltar (sin responder).
3. **Ocho ítems (3–4 min por ítem).** Mostrar **una sola versión** de la pareja. Solicitar una respuesta libre o señalar 1–5 / Saltar. Evitar sugerir cuál debería ser la respuesta. Preguntar, sin leer la explicación editorial:
   - «¿Qué significa para ti cada alternativa? Exprésalo con tus palabras».
   - «¿En qué situación pensaste para responder?».
   - «¿Las dos opciones se parecen, ambas son ciertas, ninguna te representa o depende del contexto?».
   - «¿Hay palabras que suenen extrañas, sean difíciles de aplicar o hagan parecer una opción mejor que otra?».
   - «¿Te resultaría más claro poder indicar Neutral o Saltar? ¿Por qué?».
4. **Cierre (2–3 min).** ¿Qué ítems te desconcertaron? ¿Se entendían A/B, intensidad y omisión? Agradecer sin comunicar un tipo psicológico ni interpretar respuestas individuales.

Para el entrevistador: registrar el significado reconstruido, las dudas y la forma de decidir **antes** de revelar el supuesto eje de la pregunta. No corregir la interpretación en mitad de la entrevista. Distinguir entre un problema de **traducción** y un problema del **constructo del original**; una traducción fluida no corrige automáticamente el segundo.

## Codificación anónima y reproducible

La unidad de análisis es una **interacción ítem–variante**, no una persona; evitar tratar registros repetidos como observaciones independientes. El esquema no contiene campo para identificadores ni texto libre.

| Campo | Códigos | Significado |
|---|---|---|
| `formId` | `A`, `B`, `C`, `D` | Formulario que realmente contenía el ítem |
| `locale` / `variant` | `es/current`, `es/candidate`, `en/source` | Versión exhibida |
| `response` | `1`–`5`, `null` | Marca observada; `null` es Saltar, no Neutral |
| `comprehension` | `clear`, `partially-clear`, `not-clear`, `not-assessed` | Reconstrucción de intención por entrevistador |
| `optionFit` | `distinct`, `both`, `neither`, `context-dependent`, `not-assessed` | Si son dos alternativas interpretables |
| `severity` | `none`, `minor`, `major`, `blocking` | Gravedad editorial local, criterio cualitativo |
| `flags` | `wording`, `translation`, `construct`, `false-dichotomy`, `context`, `culture`, `social-desirability`, `accessibility`, `other` | Causas observables; varias por interacción |

Ejemplo **FICTICIO**, exclusivamente para conocer el formato (no resultado de una entrevista):

```json
[
  {
    "pilotVersion": "type16-cognitive-pilot-v1",
    "formId": "A", "locale": "es", "variant": "current", "itemId": 27,
    "response": null, "comprehension": "partially-clear",
    "optionFit": "neither", "severity": "major", "flags": ["accessibility", "construct"]
  }
]
```

**Importante:** no guardar ese ejemplo como datos empíricos. Si se recopilan evidencias, crear **fuera del repositorio** el JSON con registros reales desidentificados. El programa rechaza automáticamente campos inesperados, incluidos nombres, notas e identificadores.

### Uso técnico (sin navegador ni dependencia externa)

```bash
cd programs/type16
node tools/cognitive-pilot.mjs form A es current
node tools/cognitive-pilot.mjs form A es candidate 3
node tools/cognitive-pilot.mjs form B en source
# Solo para registros locales anónimos que se hayan recogido de verdad:
node tools/cognitive-pilot.mjs summarize /ruta/privada/observaciones.json
npm test
```

El resumen devuelve **recuentos descriptivos y categorías para revisión**, nunca fiabilidad, probabilidad, intervalos de confianza ni una decisión automática de aprobación. Comparar variantes entre grupos distintos exige considerar composición y circunstancias: los recuentos no son una prueba estadística de que una traducción es mejor.

## Protocolo de decisión editorial (manual)

1. Examinar los códigos por ítem y versión; revisar las observaciones cualitativas **de forma local y desidentificada** para entender qué salió mal. No decidir solo por cantidades.
2. **Bloqueante** si una opción no se aplica a un grupo de usuarios, cambia el constructo o fuerza una oposición inadecuada; no activar la propuesta como equivalente al OEJTS.
3. Reconciliar en ES con al menos una revisión independiente del inglés original; revisar con experiencia del constructo los casos de prioridad alta. Registrar alternativas rechazadas y razones en `PILOT_DECISION_LOG.md` **sin información individual**.
4. Congelar nueva versión de texto (y, si es sustantivo, un nuevo banco propio con su propia puntuación), ejecutar ronda de retest y repetir la revisión. No alterar una versión publicada sin versionado ni actualizar sesiones anteriores silenciosamente.
5. Aunque el texto parezca claro, no afirmar **equivalencia psicométrica**, validez de 16 tipos ni fiabilidad sin un estudio específico separado. La entrevista cognitiva solo aporta evidencia sobre el proceso de respuesta.
6. **Puerta de integración:** ningún candidato debe entrar en `js/questions.js` o `js/scoring.js` por el mero hecho de estar en el piloto. Un revisor puede decidir "conservar fuente para reproducción", "revisar traducción" o "banco original TYPE/16 distinto". El código actual mantiene la interfaz v0.11.1 sin cambios.

## Referencias de método (enlaces públicos, no fuentes de ítems)

- CDC/NCHS, *Cognitive Interviewing*: https://www.cdc.gov/nchs/ccqder/question-evaluation/cognitive-interviewing.html
- US Census Bureau, *Questionnaire Testing and Evaluation Methods*: https://www.census.gov/about/policies/quality/standards/appendixa2.html
- University of Michigan, *Cross-Cultural Survey Guidelines — Cognitive Interviewing*: https://ccsg.isr.umich.edu/chapters/pretesting/cognitive-interviewing/
- International Test Commission, *Translating and Adapting Tests* (Second Edition): https://www.intestcom.org/page/14

Estas guías inspiran el proceso editorial; la configuración concreta de cuatro formularios y sus umbrales de seguimiento son decisiones **internas exploratorias**, no normas oficiales ni acreditación.
