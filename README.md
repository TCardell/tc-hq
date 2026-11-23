# TC-HQ / TC/OS

**TC-HQ (TCardell Headquarters)** es una web personal con un escritorio virtual retro, ventanas, carpetas, terminal y aplicaciones independientes. El repositorio es **público** y contiene los archivos fuente de la web estática (HTML, CSS y JavaScript).

**Enlaces**
- **Web de pruebas publicada con GitHub Pages:** https://tcardell.github.io/tc-hq/
- **Web de Neocities:** https://tcardell.neocities.org/
- **Código fuente:** https://github.com/TCardell/tc-hq

> GitHub Pages se publica desde la rama `main`, carpeta `/(root)`, mediante **Settings → Pages → Deploy from a branch**. El archivo `.nojekyll` evita el procesamiento con Jekyll. Los cambios en GitHub Pages **no actualizan automáticamente Neocities**.

## Organización del proyecto

| Archivo o carpeta | Función |
| --- | --- |
| `index.html` | Entrada y simulación de arranque (bootstrap); permite acceder al escritorio o a la terminal. |
| `home.html` | Escritorio gráfico TC/OS, barra de tareas y menú Inicio. |
| `terminal.html` | Terminal independiente. |
| `system/` | Núcleo, preferencias, escritorio, ventanas, estilos, iconos, audio y aplicaciones del sistema. |
| `system/boot-audio.js` | Efectos originales sintetizados para el arranque, sujetos a las políticas de audio del navegador. |
| `system/sound.js` y `system/tray-sound.js` | Sonidos de interfaz y control rápido de volumen/silencio en la barra de tareas. |
| `programs/` | Aplicaciones independientes: archivos HTML individuales o proyectos con varias carpetas (por ejemplo, `programs/calculator/`). |
| `programs.json` | Catálogo de programas y carpetas utilizado por TC/OS. |
| `pages/`, `media/` | Otras páginas y recursos. |
| `iconos.html`, `not_found.html`, `robots.txt` | Páginas y recursos auxiliares. |

## Uso y desarrollo

1. Para visitar la web, abre el enlace de GitHub Pages de arriba; la portada redirige al escritorio o a la terminal según las preferencias y la interacción.
2. Para trabajar en local, abre un servidor HTTP estático desde la raíz del repositorio (por ejemplo, `python3 -m http.server 8000`) y visita `http://localhost:8000/`. No se necesita compilación ni servidor de aplicaciones.
3. Realiza los cambios en una rama y revísalos mediante un *pull request* antes de integrarlos en `main`. Un cambio integrado en `main` puede desencadenar un despliegue automático de GitHub Pages.
4. Para desarrollar con Codex u otros asistentes, lee [AGENTS.md](AGENTS.md). Preserva rutas relativas y compatibilidad con alojamiento estático. No añadas tokens, contraseñas ni claves API.

## Sonido y preferencias

TC/OS utiliza preferencias locales del navegador (`localStorage`, clave `tcos.preferences`). El sonido del sistema está activado por defecto, con volumen general inicial del 50 % y control de efectos independiente. El icono de altavoz de la bandeja permite ajustar el volumen o silenciar rápidamente. En el arranque, los navegadores pueden bloquear la reproducción automática; en ese caso aparece un botón de altavoz para habilitar el audio y repetir el bootstrap.

Las preferencias guardadas en GitHub Pages y Neocities no se comparten: cada origen web tiene su propio almacenamiento.

## Comprobaciones antes de publicar

- Verificar que `index.html` abre correctamente la portada y da acceso a `home.html` y `terminal.html`.
- Probar menú Inicio, ventanas y aplicaciones afectadas.
- Si cambias `programs.json`, comprobar su sintaxis y que sus rutas apuntan a archivos existentes.
- Probar el sonido tras una interacción y verificar que volumen y silencio se sincronizan con el Panel de control.
- Revisar en **Actions** que el despliegue de GitHub Pages finaliza correctamente.

**Historial:** importación inicial desde Neocities realizada el 15/11/2026; GitHub Pages habilitado posteriormente para visualizar y probar el desarrollo.
