# TYPE/16 — metodología, límites y reglas de puntuación

**Estado: especificación experimental, 22-11-2026.** Esta aplicación no es el cuestionario MBTI® oficial. Ofrece una exploración lúdica/educativa de preferencias tipológicas, no un diagnóstico, una medición certificada ni una estimación probabilística validada.

## Fuentes primarias

1. Eric Jorgenson (2015), *Open Extended Jungian Type Scales 1.2* (OEJTS): https://openpsychometrics.org/tests/OJTS/development/OEJTS1.2.pdf
2. Investigación y selección de ítems: https://openpsychometrics.org/tests/OJTS/development/
3. OJTS v2.1 (48 ítems, **otro instrumento**): https://openpsychometrics.org/tests/OJTS/
4. Licencia de los ítems: https://creativecommons.org/licenses/by-nc-sa/4.0/

El documento de OEJTS 1.2 publica 32 pares bipolares, valores enteros de 1 a 5, una clave de puntuación y una advertencia de que no garantiza precisión ni fiabilidad. Las preguntas originales y sus adaptaciones se distribuyen con reconocimiento de autoría, uso no comercial y compartir igual (CC BY-NC-SA 4.0). Las traducciones españolas de TYPE/16 son borradores editoriales pendientes de revisión, no adaptaciones validadas.

## Fórmulas exactas de OEJTS 1.2

A continuación, Qn es la respuesta 1..5 al ítem n. **No se suman ocho respuestas sin más.**

- IE = 30 - Q3 - Q7 - Q11 + Q15 - Q19 + Q23 + Q27 - Q31
- SN = 12 + Q4 + Q8 + Q12 + Q16 + Q20 - Q24 - Q28 + Q32
- FT = 30 - Q2 + Q6 + Q10 - Q14 + Q18 + Q22 + Q26 - Q30
- JP = 18 + Q1 + Q5 - Q9 + Q13 - Q17 + Q21 - Q25 + Q29

Cada escala completa va de 8 a 40, punto medio 24. IE > 24: E; en caso contrario: I. SN > 24: N; en caso contrario: S. FT > 24: T; en caso contrario: F. JP > 24: P; en caso contrario: J. **El desempate a la izquierda es una convención del documento original, no evidencia de una preferencia sólida.**

En pruebas unitarias: todas las respuestas igual a 3 -> las cuatro escalas son 24; todas igual a 1 -> IE 28, SN 16, FT 28, JP 20; todas igual a 5 -> IE 20, SN 32, FT 20, JP 28.

## Diferencia entre cuestionario de referencia y resultado rápido

- **32/32 contestadas**: se puede reproducir exactamente la clave OEJTS 1.2; aun así, el orden de ítems y la traducción difieren del original y no tienen validación específica.
- **Menos de 32**: resultado solo exploratorio. Cada contribución se centra en 3 y se orienta con su signo; para la vista parcial, posición = 50 + 50 × suma(signo × (respuesta-3)) / (2 × número de ítems contestados en ese eje). Si no hay respuestas en el eje, no hay posición ni letra inferida.
- **Respuestas omitidas**: no equivalen a neutral (3). Para reproducir OEJTS 1.2, hay que contestarlas o declarar el cuestionario incompleto.
- **Primeras 12**: 3 ítems por eje, elegidos para presentar una variedad inicial; esta selección **no es una versión corta validada**.
- **Empates**: se muestran como ambiguos, especialmente en vistas parciales. La clave oficial OEJTS solo se informa al completar los 32 ítems.

Nunca mostrar «97 % de probabilidad de ser INTP» usando posiciones en escalas. Una barra expresa preferencia observada dentro de la puntuación de ese eje; no exactitud, fiabilidad ni pertenencia a una clase natural.

## Extensiones y adaptación

Una secuencia adaptativa puede **reordenar los ítems pendientes dentro de estos 32** sin cambiar la suma final, pero ese cambio de administración necesita comprobación de efectos de orden. No agregar ítems de OJTS 2.1, bancos IPIP u otras fuentes a la puntuación OEJTS 1.2: tienen calibraciones y constructos distintos. Cualquier banco nuevo tendrá su propia versión, metodología y revisión.

Comparar pruebas repetidas, evaluar comprensión ES/EN, detectar redundancia, analizar consistencia de los ítems y estudiar respuestas de voluntarios solo con consentimiento y protocolo claro. El desarrollo original seleccionó ítems discriminando entre personas que ya se autoidentificaban con un tipo; esto no demuestra que existan 16 categorías psicológicas naturales.

## Privacidad

La versión inicial almacena progreso en localStorage del propio navegador. No hay servidor de respuestas, registro ni analítica; borrar datos del navegador puede perder el progreso. Más adelante añadir control explícito de eliminación y exportación.
