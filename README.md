# TC-HQ / TC-OS

Repositorio privado para desarrollar y mantener **TC-HQ**, una web personal con un escritorio virtual de estilo retro y aplicaciones independientes.

**Web publicada:** https://tcardell.neocities.org/

## Estructura del sitio

La copia exportada de Neocities se organiza principalmente así:

- `index.html` — entrada principal del sitio.
- `home.html`, `iconos.html`, `terminal.html`, `not_found.html` — páginas auxiliares.
- `system/` — núcleo de TC/OS, escritorio, ventanas, temas, iconos y aplicaciones del sistema.
- `programs/` — aplicaciones independientes, incluidas calculadora científica, SISFQ y otras herramientas.
- `programs.json` — catálogo de aplicaciones y carpetas.
- `pages/`, `media/`, `style.css` y `robots.txt` — contenidos y recursos adicionales.

> **Estado:** inicialmente el repositorio contiene documentación; hay que importar los archivos reales del sitio desde la exportación de Neocities. No se debe considerar este repositorio una copia completa del sitio hasta terminar esa importación.

## Reglas de colaboración con Codex

Consulta [AGENTS.md](AGENTS.md) antes de introducir cambios. Preserva la compatibilidad con alojamiento estático, las rutas relativas y el funcionamiento de las aplicaciones existentes.

## Importación inicial de Neocities

1. Descomprime la exportación ZIP del sitio en tu ordenador.
2. Desde GitHub, abre **Add file → Upload files** en la rama principal.
3. Arrastra **todo el contenido interior** de la carpeta extraída: `index.html`, `programs/`, `system/` y demás archivos al **nivel raíz** del repositorio, no dentro de otra carpeta contenedora.
4. Confirma los cambios y verifica que `index.html`, `programs.json`, `programs/` y `system/` aparecen en la raíz.
5. No subas contraseñas, tokens, claves API ni archivos locales con datos privados.

El repositorio puede seguir siendo privado aunque la web publicada sea accesible al público.
