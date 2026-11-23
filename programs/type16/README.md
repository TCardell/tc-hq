# TYPE/16 — Versión 1.0

**Versión publicada:** [Abrir TYPE/16](https://t.cardell.es/programs/type16/) · [Código principal](./index.html)

TYPE/16 es una aplicación interactiva bilingüe (ES/EN) sobre cuatro dimensiones y 16 perfiles de personalidad. Incluye 64 cartas, cinco paradas (12, 24, 32, 48, 64), selección de intensidad, opción neutral, saltar, deshacer, revisión de preguntas omitidas y progreso guardado localmente. La versión 1.0 añade controles completos, efectos sonoros opcionales y el arte digital de 12 motivos con variaciones.

## Estado de carpetas

| Ruta | Estado | Uso |
|---|---|---|
| [`index.html`](./index.html) | **V1.0 · principal** | Punto de entrada estable |
| [`manifest.webmanifest`](./manifest.webmanifest) | **V1.0 · principal** | Instalación de la aplicación |
| [`beta/`](./beta/) | **Recursos compartidos + pruebas históricas** | Las páginas antiguas son experimentos; `beta/js/` y `beta/art/v3/` son dependencias de v1.0 y no deben eliminarse |
| [`playtest/`](./playtest/) | **ARCHIVADO** | Demostración temprana de 12+20 preguntas, solo referencia |
| [`archive/`](./archive/) | **ARCHIVO HISTÓRICO** | Copias navegables de los prototipos, con enlace de regreso a v1.0 |
| `gesture-*` y laboratorios previos | **LEGADO/EXPERIMENTAL** | No forman parte del punto de entrada v1.0; conservar hasta revisar las dependencias |

## Cambios v1.0

- Tuerca SVG completamente rediseñada desde cero.
- Panel de ajustes con idioma, pantalla completa, sonido, sensibilidad, inclinación, **Continuar**, **Guardar y salir** y **Reiniciar test** (requiere confirmación).
- Las decisiones reproducen un sonido original de carta, que puede desactivarse y recuerda la preferencia.
- 12 motivos WebP reutilizados en las 64 cartas con adornos SVG y variaciones de color.
- Se mantiene la misma clave de almacenamiento del progreso anterior para no perder partidas existentes.

## Notas técnicas

La versión 1.0 es un **lanzamiento de software**, no una certificación de validez psicométrica. Las 32 preguntas OEJTS se puntúan mediante la clave de referencia y las otras 32 son contenido complementario exploratorio. Conservamos la documentación de sus límites y las advertencias en el resultado.

Los recursos compartidos bajo `beta/` siguen **activos** aunque las versiones antiguas de esa carpeta estén archivadas. No moverlos ni borrarlos hasta migrarlos a una carpeta común y actualizar las importaciones.

[Historial de versiones y copias archivadas](./archive/README.md)
