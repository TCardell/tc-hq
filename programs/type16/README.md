# TYPE/16 — investigación y prototipo móvil

Proyecto **en desarrollo** dentro de TC-HQ. No es el indicador MBTI® oficial ni una prueba clínica. Nunca debe utilizarse para contratación, diagnóstico ni decisiones de alto impacto.

## Prototipo visual para validar gestos (NOV 2026)

Abrir **[gesture-lab.html](gesture-lab.html)**. Es un archivo HTML autónomo (sin librerías ni recursos remotos), diseñado primero para móvil. Contiene ocho pares de decisiones ficticios: son ejemplos de interacción y no calculan ningún tipo de personalidad.

Vista previa temporal mediante una pasarela de terceros para HTML de GitHub: https://raw.githack.com/TCardell/tc-hq/feature/type16-foundation/programs/type16/gesture-lab.html

### Qué probar

- Izquierda o derecha, arrastre corto (más de 48 px) = preferencia suave.
- Arrastre largo (130 px inicialmente, ajustable entre 100 y 170 px en ⚙) = preferencia fuerte.
- Arriba = neutral; abajo = omitir.
- La carta gira suavemente, revela un sello con la elección, sale y deja pasar a la siguiente.
- Cinco botones inferiores equivalen a los gestos.
- ES/EN en cualquier momento, sin perder el progreso.
- Probar en móvil vertical y en escritorio; observar comodidad, umbrales, legibilidad y animación.

Esta rama experimental no modifica el catálogo ni la versión publicada.

## Objetivos

- Mobile first: tarjetas táctiles en vertical, alternativa accesible con cinco botones.
- Prueba rápida de 12 ítems **exploratoria y no validada**, reutilizando ítems de la escala completa.
- Escala de referencia OEJTS 1.2 de 32 ítems, con la puntuación exacta del autor; el orden de presentación es diferente y la traducción española está pendiente de revisión.
- Mostrar dimensiones continuas y empates; no llamar «probabilidad» a la posición de la escala.
- Crecer con informes por capas, ilustraciones originales, revisión psicométrica y selección adaptativa **sin** mezclar instrumentos incompatibles.

## Estado actual

Estructura y prototipo inicial en rama de desarrollo. **No fusionar ni anunciar como test validado**. Las tarjetas emplean una interacción experimental: 5 botones inequívocos y gestos (izquierda/derecha distancia corta o larga, arriba neutral, abajo omitir). Validar en móviles antes de considerarla definitiva.

## Desarrollo local

Desde la raíz del repositorio:

    python3 -m http.server 8000

Después abrir http://localhost:8000/programs/type16/ . También puede usarse un servidor HTTP estático equivalente. No hacen falta servicios externos ni compilación.

Pruebas del motor (Node.js instalado):

    cd programs/type16
    node --test tests/*.test.mjs

## Integración prevista

Mantener la aplicación desacoplada del escritorio de TC-HQ. Tras revisión, añadir entrada en programs.json con url \`programs/type16/index.html\`, carpeta \`projects\`, \`openMode: "ask"\`, nombre bilingüe e icono disponible. **No se modifica programs.json en esta rama inicial**, para evitar una publicación accidental en main.

## Lecturas esenciales

- [METHODOLOGY.md](METHODOLOGY.md) — fuentes, fórmulas, diferencias entre resultado parcial y completo.
- [QUESTION_AUDIT.md](QUESTION_AUDIT.md) — revisión de contenido y riesgos de los ítems.
- [CREDITS.md](CREDITS.md) — autoría, licencia y atribuciones.
