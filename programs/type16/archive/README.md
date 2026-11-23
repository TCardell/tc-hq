# TYPE/16 · Archivo histórico

**Versión actual:** [TYPE/16 v1.0.1](../index.html) — https://t.cardell.es/programs/type16/

Este directorio reúne las versiones anteriores en su propio espacio, sin mezclarlas con el código actual. **No es una carpeta de desarrollo activo.**

| Versión o recurso | Archivo |
| --- | --- |
| Laboratorio de gestos | [gesture-lab.html](./gesture-lab.html) |
| Primer playtest (12 + 20 cartas) | [playtest-legacy.html](./playtest-legacy.html) |
| Playtest de 64 cartas | [playtest-64/index.html](./playtest-64/index.html) |
| Beta I (arte SVG) | [beta-i-legacy.html](./beta-i-legacy.html) |
| Beta V3 (arte digital) | [beta-v3-legacy.html](./beta-v3-legacy.html) |
| Beta II (sonido y variaciones) | [beta-ii-legacy.html](./beta-ii-legacy.html) |
| Galería de diseños SVG V1/V2 | [art-gallery.html](./art-gallery.html) |
| Galería de 12 ilustraciones WebP | [art-gallery-v3.html](./art-gallery-v3.html) |

## Dependencias históricas conservadas

- `runtime/js/`: copia congelada del motor utilizado por las betas y los primeros prototipos. Se incluye expresamente para que los archivos históricos sigan funcionando incluso cuando cambie `../js/`.
- `playtest-64/enhancements.js`: versión específica del módulo de ampliaciones, distinta de la utilizada por Beta II.
- `legacy-manifest.webmanifest`: compatibilidad del archivo histórico.
- `notes/`: documentación original de los ensayos; [beta](./notes/beta.md), [playtest](./notes/playtest.md) y [playtest de 64 cartas](./playtest-64/README.md).

Los WebP de estas versiones se comparten con `../assets/art/`, sin duplicar las imágenes. **No moverlos sin corregir todas sus referencias.**

Las URL antiguas públicas de `beta/`, `playtest/`, `playtest-64/` y `gesture-lab.html` conservan redirecciones para evitar errores 404.

## Restauración

La reorganización está documentada en Git: si hubiese que restaurar una versión anterior, recuperar los archivos desde el historial de commits o desde esta carpeta. Evitar modificar el motor actual solo para reparar una versión archivada.
