# Instrucciones para Codex — TC-HQ / TC-OS

## Propósito
Este repositorio es el código fuente de TC-HQ, un sitio personal con escritorio web interactivo de estética retro y diversas aplicaciones integradas. Web publicada: https://tcardell.neocities.org/

## Principios de trabajo
- Preserva la versión funcional del sitio. Realiza cambios pequeños y localizados; no reescribas la aplicación entera si no se solicita.
- Antes de editar, inspecciona la estructura real del repositorio y lee los archivos relacionados. No presupongas que existen directorios solo porque figuren como plan en README.
- Explica qué archivos vas a modificar y por qué. Tras los cambios, detalla cómo comprobarlos.
- Para funcionalidades nuevas, prefiere ramas y pull requests revisables en lugar de modificar directamente `main`.
- No borres ni reestructures aplicaciones, carpetas o entradas de catálogo existentes sin una petición expresa.
- Conserva la compatibilidad con alojamiento estático (HTML, CSS, JavaScript y recursos) y con las rutas relativas.
- No incluyas claves API, tokens ni contraseñas en el repositorio, en archivos públicos ni en los mensajes de commit.
- No publiques ni despliegues el sitio automáticamente sin autorización explícita.

## Características a preservar
- Secuencia de arranque y escritorio estilo Windows clásico con ventanas, iconos y menú de inicio.
- Personalización de temas, fondos y disposición del escritorio.
- Soporte de interfaz en español e inglés donde ya exista.
- Catálogo de aplicaciones (por ejemplo, `programs.json`) y apertura según su configuración.
- Funcionamiento de aplicaciones independientes, tanto un HTML único como carpetas con varios archivos.

## Arquitectura y aplicaciones
- Mantén las aplicaciones desacopladas del núcleo del escritorio.
- Una aplicación puede residir en una carpeta propia como `programs/calculator/`, con su `index.html`, CSS, JS y recursos.
- Respeta las rutas y los nombres exactos que encuentres en la versión real; no cambies ubicaciones por esta guía.
- Si modificas un catálogo JSON, comprueba que su sintaxis siga siendo válida y que las referencias a archivos existan.
- Prioriza accesibilidad básica, buena experiencia de escritorio y ausencia de errores en consola.

## Verificación antes de dar el trabajo por terminado
1. Comprobar que carga la portada y que se puede entrar al escritorio.
2. Verificar que las ventanas, menús y aplicaciones afectadas se abren y cierran.
3. Verificar que los cambios no rompen las rutas relativas ni el catálogo de programas.
4. Indicar qué se ha comprobado realmente y qué queda por probar manualmente.

Estas instrucciones pueden adaptarse cuando se incorpore el código real de TC-HQ.
