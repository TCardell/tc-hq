# TYPE/16 · Versión estable 1.0.1

**Abrir la aplicación:** https://t.cardell.es/programs/type16/

Proyecto web de 64 cartas y 16 perfiles de personalidad, con interfaz bilingüe (ES/EN), cuatro dimensiones y paradas en 12, 24, 32, 48 y 64 preguntas. Esta es la versión activa; los experimentos anteriores están archivados.

## Estructura actual

| Ruta | Función |
| --- | --- |
| [`index.html`](./index.html) | Aplicación estable v1.0.1 |
| [`manifest.webmanifest`](./manifest.webmanifest) | Instalación PWA estable |
| [`js/`](./js/) y [`js/engine/`](./js/engine/) | Código activo, puntuación, contenido y motor del cuestionario |
| [`assets/art/`](./assets/art/) | Doce ilustraciones WebP reutilizadas por las 64 cartas |
| [`assets/icon.svg`](./assets/icon.svg) | Icono utilizado por la versión estable |
| [`archive/`](./archive/) | Código histórico congelado, galerías y versiones anteriores |
| `beta/`, `playtest/`, `playtest-64/`, `gesture-lab.html` | **Únicamente redirecciones de compatibilidad** a las versiones archivadas |
| `gesture-manifest.webmanifest` | Alias de instalación histórico hacia la versión estable |

**Importante:** no desarrollar código nuevo dentro de `archive/` ni de las carpetas de compatibilidad. Todos los cambios de la aplicación actual deben realizarse en `index.html`, `js/` y `assets/`.

## Funciones que deben preservarse

- Progreso guardado localmente con la clave `type16.beta.v1` (se conserva para no perder partidas anteriores).
- Preferencia de sonido guardada con la clave `type16.beta2.sound`.
- Cinco niveles de respuesta, neutral, saltar, deshacer, revisar preguntas omitidas y tutorial.
- Opciones de ajustes: idioma, pantalla completa, sonido, sensibilidad, guardar y salir, reiniciar.
- Doce diseños con ornamentaciones y variaciones de color; cartas 00 de bienvenida y 01–64 de preguntas.

## Límites del cuestionario

La versión es un **lanzamiento de software**, no una validación psicométrica. Se conservan las 32 preguntas OEJTS y sus reglas de puntuación separadas de las 32 preguntas complementarias experimentales. El resultado es orientativo y no una evaluación clínica ni un MBTI oficial.

## Archivo y compatibilidad

[Consultar archivo histórico](./archive/README.md) · [Ver copias archivadas](./archive/index.html)

Los antiguos enlaces se conservan mediante páginas de redirección y cada prototipo archivado utiliza una copia congelada de sus dependencias en `archive/runtime/js/`; así no depende de futuras modificaciones del código principal.

**Reorganización:** migración por Git sin regenerar los WebP, preservando el SHA de los archivos binarios. La versión estable sigue en la misma dirección y con las mismas claves de almacenamiento.
