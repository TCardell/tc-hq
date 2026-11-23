# TYPE/16 — política de preguntas y control de calidad

**Versión de trabajo 2026-11-22.** Documento de ingeniería editorial, sin alterar el cuestionario publicado en el prototipo ni afirmar validación.

## Instrumento actual: OEJTS 1.2

Las 32 parejas originales del documento de Eric Jorgenson (2015) permanecen íntegramente identificadas como `OEJTS12:Q01` … `OEJTS12:Q32`. Cada una tiene: `id`, `dimension`, `scoringSign` (+1/−1), `left.en`, `right.en`, `left.es`, `right.es`, `source`, `translationStatus`, `theme` y `editorialReview`. Los metadatos de `theme` y `editorialReview` son para auditar la secuencia, no parámetros psicométricos.

Las claves de inversión **no** se calculan a partir de la apariencia A/B ni del idioma; proceden de `js/scoring.js`, fiel a las ecuaciones originales del PDF. Cambiar el orden no permite cambiar los signos.

## Revisión editorial priorizada

11 ítems requieren una segunda lectura especialmente cuidadosa, según `QUESTION_AUDIT.md`: Q2, Q6, Q8, Q10, Q16, Q18, Q26, Q27, Q29, Q31 y Q32. La revisión debe comprobar por separado:

- **Fidelidad de significado** ES y EN frente al texto original; evitar sustituir automáticamente conceptos culturales.
- **Simetría** de dos respuestas: ninguna opción debería resultar intrínsecamente más moral, admirable o competente.
- **Comprensión móvil**: frases cortas, sin dobles negaciones, ambigüedades o sobrecarga verbal.
- **Accesibilidad** y capacidad de contestar en distintos contextos personales, sensoriales y educativos.
- **Tendencia de deseabilidad social**: ítems sobre justicia, emocionalidad, trabajo o productividad pueden inducir respuestas aspiracionales.
- **Dependencia del contexto**: hablar en público, exámenes o fiestas no siempre representan una preferencia estable.
- **Equivalencia de traducciones**: una corrección editorial sustantiva genera una nueva versión de los datos y debe probarse, no sobrescribir silenciosamente la respuesta histórica.

## Reglas para crear preguntas nuevas en el futuro

1. Una pregunta = una observación o decisión concreta; se conoce a qué dimensión hipotética pretende aportar información.
2. Opciones A/B distintas y comprensibles. La orientación A/B y el signo de la clave deben declararse explícitamente; no se infieren de etiquetas de interfaz.
3. No forzar falsas dicotomías absolutas; permitir neutral y omisión.
4. Evitar valoraciones morales, estereotipos, términos clínicos o preguntas sensibles innecesarias.
5. Probar comprensión de la versión española e inglesa, con revisión independiente y registro de cambios.
6. Mantener procedencia, autor, licencia, versión, estado de revisión, resultados de pruebas piloto y destino previsto (solo exploración o instrumento calibrado).
7. Las preguntas propias se crearán en **otro banco y otra clave** (`type16-original-draft-*`). **Nunca se mezclarán con los 32 ítems OEJTS** en el resultado derivado de su fórmula 8–40 hasta contar con metodología y validación separadas.
8. Hasta que existan datos empíricos adecuados, la selección adaptativa se limita a **ordenar** preguntas, no a estimar rasgos latentes ni calcular precisión estadística.

## Criterios de salida de fase

- Auditoría bilingüe trazable de los 32 textos, con cambios registrados y fuentes.
- Pruebas de que los signos y dimensiones de todas las preguntas coinciden con la fuente publicada.
- Tests de regresión del resultado completo, de omisiones, de inversión de polos y de resultados parciales.
- Redacción clara en la interfaz de que el recorrido rápido y su porcentaje son **orientativos**.
- Solo después, integración sin alteraciones gráficas de la interfaz jugable aprobada.

## Auditoría de las 32 preguntas — v1 documental

Las 32 fichas, riesgos, propuestas y próximos controles están en [QUESTION_AUDIT.md](QUESTION_AUDIT.md), con registro legible por código en `js/engine/editorial-audit.js`.

**Estado para todos:** `pending-independent-review` y `translationApproval:false`. Ninguna alternativa se introduce en el motor; cambios sustantivos exigen nueva versión, revisión independiente y, si corresponde, un banco separado. Los tests comprueban integridad de código, no validez científica.
