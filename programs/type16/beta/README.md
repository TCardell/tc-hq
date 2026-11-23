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

## Revisión Beta I.1 — cabecera editorial y comparación de arte V1/V2

- **Cabeceras:** primera carta `Bienvenido` / `Welcome`; las siguientes `Carta 02` / `Card 02`, etc., según la posición en la baraja (también en la revisión de omitidas). A la derecha solo `Atlas`; `TYPE/16` se conserva únicamente en el pie. No se muestra la estrella central de cabecera.
- **Arte V1 intacto:** los 12 maestros SVG originales siguen en `js/artwork.js`, sin sustituciones ni cambios de trazados.
- **Nueva V2:** `js/artwork-v2.js` contiene otros **12 SVG distintos por composición y silueta** que mantienen el mismo lenguaje geométrico y paleta. No son cambios de color ni de marco.
- **Registro extensible:** `ART_VERSIONS`, `getMotifVersions(motif)`, `getMotifArt(motif,{version,frameVariant})`, `getCardArt(id,frameVariant,version)`. Para V3, añadir un módulo que exporte sus doce motivos y registrarlo en `VERSION_LIBRARY` de `artwork.js`; la galería se adapta automáticamente.
- **Galería comparativa** en `art-gallery.html`: V1 y V2 lado a lado, con descripción conceptual, preguntas asociadas y tres encuadres opcionales. Permite marcar / desmarcar cada favorita, copiar la selección y restablecerla.
- **Preferencias visuales independientes:** se guardan localmente bajo `type16.beta.art-choices.v1`, sin cambiar `type16.beta.v1` ni el historial de respuestas. La selección es un borrador, no la colección definitiva.
- **Previsualización en las cartas:** `./index.html?art=v2` aplica V2 a todos los motivos; `./index.html?art=selection` usa las versiones elegidas y V1 para las que aún no tienen decisión. `index.html` sin parámetros mantiene V1 sin cambios. Cambiar el arte **no afecta puntuación, progreso ni resultados**.
- **Trabajo reversible:** toda la revisión se limita al subdirectorio `programs/type16/beta/`, sin editar el prototipo 64 anterior ni Gesture Lab.

### URLs

- Beta normal: https://t.cardell.es/programs/type16/beta/index.html
- Comparar arte: https://t.cardell.es/programs/type16/beta/art-gallery.html
- Ver toda la V2: https://t.cardell.es/programs/type16/beta/index.html?art=v2
- Ver selección guardada: https://t.cardell.es/programs/type16/beta/index.html?art=selection

### Revisión recomendada

Comparar V1 y V2 en móvil y escritorio; comprobar el texto `Bienvenido` de la primera carta y el número correcto de las demás; seleccionar distintas V1/V2, recargar la galería y comprobar persistencia; abrir las dos modalidades de previsualización y confirmar que los resultados de las cinco paradas no cambian.
