# TYPE/16 · Beta I · Atlas de personalidad

**Enlace de GitHub Pages:** https://t.cardell.es/programs/type16/beta/

Esta beta es **independiente** del prototipo de 64 cartas anterior y del laboratorio de gestos aprobado. Su objetivo es probar una experiencia más cercana al diseño definitivo de TYPE/16.

## Contenido

- **64 preguntas** en ES/EN; paradas opcionales a las cartas **12, 24, 32, 48 y 64**.
- **32 ítems originales OEJTS** conservados y puntuados exclusivamente mediante `js/scoring.js`; no se cambian las fórmulas ni su clave de respuestas.
- **32 ítems complementarios TYPE/16** con índice experimental separado; las respuestas omitidas no se tratan como neutrales y los empates no se fuerzan.
- Biblioteca **`js/artwork.js`** con 12 motivos SVG geométricos originales, 3 variaciones de composición y una asignación editorial razonada para las 64 preguntas. Cada dimensión utiliza exclusivamente su propia familia de tres símbolos.
- Resultados con un **retrato de personalidad visible** y áreas desplegables para profundizar en las cuatro dimensiones, el cambio entre paradas, la comparación original/nuevas y las respuestas concretas.
- Funciones del prototipo anterior: gestos, cinco grados de respuesta, neutral, saltar, deshacer, revisar saltadas, idioma, tutorial y reanudación.
- Partidas guardadas en localStorage: `type16.beta.v1`, **distintas** de `type16.playtest64.v1`. La portada ofrece importar una partida anterior válida **solo cuando la beta no tiene todavía respuestas**. No sobrescribe ni elimina el progreso original.
- Manifiesto PWA propio para evitar que la instalación abra accidentalmente Gesture Lab.

## Revisar las ilustraciones

[Galería visual de los doce motivos y sus variantes](./art-gallery.html).

**Estado:** beta de diseño y experiencia. El cuestionario es orientativo, no una evaluación clínica ni una versión oficial del MBTI. Los 32 ítems nuevos no han sido validados psicométricamente. La apariencia no implica que exista precisión estadística demostrada.

## Arquitectura y límites del cambio

Esta beta usa una copia inmutable de la lógica de selección, sesiones, puntuación y catálogo del prototipo de 64 cartas. La revisión de presentación de resultados está aislada en `js/enhancements.js`. No modifica archivos del prototipo anterior, `programs.json`, la página principal ni `../gesture-lab.html`.

## Comprobación

1. Abrir `index.html` servido por HTTP/Pages; deben verse la portada, 4 dimensiones y los 16 perfiles desplegables.
2. Recorrer 12, 24, 32, 48 y 64 respuestas con neutral y saltos. Verificar los botones de continuidad y revisión.
3. Verificar las imágenes y las áreas desplegables en móvil y escritorio.
4. Comprobar que una recarga conserva la partida; opcionalmente importar una partida antigua sin sobrescribirla.
5. Comprobar que los resultados OEJTS siguen independientes de las 32 preguntas nuevas.
