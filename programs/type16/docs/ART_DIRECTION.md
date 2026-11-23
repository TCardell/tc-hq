# TYPE/16 — Dirección artística de las cartas
**Guía de preproducción · v0.1 · 23/11/2026 · Estado: propuesta conceptual, SIN ilustraciones ni SVG generados**

## 0. Alcance y fuente de verdad
El aspecto que debemos respetar es el de `programs/type16/gesture-lab.html` **v0.11.1**, aprobado por el usuario. La presente guía NO autoriza modificar esa interfaz. El test real tendrá las 32 preguntas identificadas como Q01–Q32 en `js/questions.js`; las ocho preguntas actuales de Gesture Lab son ficticias y sirven solamente para probar interacción.

**Prioridad:** primero coherencia artística y legibilidad; después producción de SVG, uno por uno. Esta guía no equivale a una aprobación de artes finales. Ver `CARD_CONCEPTS.md` para la anatomía y los briefs de las preguntas.

## 1. Concepto rector
**«El atelier de las decisiones»: pequeñas escenas de un tarot editorial contemporáneo.** Mezcla del ritmo táctil y la narración por decisiones de *Reigns*, la composición de un grabado de libro ilustrado, y la sofisticación gráfica de una baraja de colección. Nada de copiar personajes, símbolos propietarios o diseños concretos de esos referentes: TYPE/16 debe adquirir su identidad propia.

Cada ilustración debe parecer una *viñeta alegórica comprensible*: una situación, dos maneras igualmente legítimas de abordarla y suficiente ambigüedad para invitar a reflexionar. No es un póster motivacional, un test corporativo ni una secuencia de pictogramas genéricos.

Tres palabras de dirección: **artesanal, evocador, legible**. A primera vista se reconoce la escena; al mirar mejor aparecen dos o tres detalles narrativos.

## 2. Lo existente es el marco, no algo que rediseñar
En la v0.11.1:
- El anverso es pergamino crema, con líneas ornamentales finas y bordes interiores; el reverso utiliza azules nocturnos, malvas oscuros y ribetes cálidos.
- La imagen vive en `.card-art`, un **arco de coronación redondeada**; debajo están el enunciado y las dos respuestas A/B. Conservar esta jerarquía.
- CSS actual del área jugable: `width:min(calc(100% - 34px),360px)` y `height:clamp(115px,25dvh,220px)`, con límites adicionales para pantallas pequeñas/bajas. Estos valores son **referencia del código vigente**, no promesa de que toda carta muestre 220 px.
- El prototipo dibuja motivos `<svg viewBox="0 0 220 145">` directamente en la carta. Para una futura biblioteca, **mantener proporción 220:145 (aprox. 1,52:1)**; diseñar internamente en 440×290 unidades es equivalente y ofrece comodidad de autoría.
- Sellos de elección flotan sobre la carta durante el arrastre; la ilustración no debe colocar rostros ni detalles esenciales bajo las zonas próximas a los dos ángulos superiores.
- El reverso, los gestos, la animación de giro, la barra «Tu elección» y los cinco botones son **sistemas ya aprobados**: no volverlos a diseñar durante la fase de ilustración.

### Zonas en coordenadas del lienzo ilustrado 440 × 290 (orientativas)
- **Zona narrativa principal:** x 45–395; y 40–245. Debe contar la escena sin depender de las esquinas.
- **Zona segura imprescindible:** x 55–385; y 45–245; mantener aquí los sujetos/acciones que distinguen A y B.
- **Áreas de quietud:** primeros y últimos ~35–45 de x, y franja superior ~35 de y: solo ambiente/ornamento ligero.
- **Suelo/soporte:** y 235–265 cuando la escena lo requiera.
- **No integrar textos** en el dibujo: el idioma, los rótulos A/B, los sellos y los enunciados los aporta la interfaz.

Las cifras son pautas de preproducción; antes de aprobar un SVG habrá que contrastarlas con tamaños reales y extremos de viewport, **sin mover el texto para hacer hueco al arte**.

## 3. Gramática de dibujo
| Elemento | Decisión | Evitar |
|---|---|---|
| Silueta | Masas nítidas, geometría ligeramente irregular a mano | Fotorealismo, muñecos 3D, caricatura infantil |
| Contorno | Tinta oscura, perfil dominante y detalle secundario fino; puntas redondeadas donde convenga | Contornos negros idénticos para todo o microtrazos ilegibles |
| Volumen | 2–4 planos de color y sombra recortada; casi ninguna gradación | Sombras aerografiadas, brillos de plástico |
| Textura | Tramas de puntos o rayado escaso, siguiendo los planos, con aire de grabado | Ruido continuo, filtros SVG pesados, tramas que parezcan «suciedad» |
| Personajes | Figuras simplificadas, expresivas por postura y relación espacial | Rasgos faciales minúsculos, género/edad codificados, gestos moralizantes |
| Arquitectura | Arcos, habitaciones, ventanas, escalones y mobiliario reconocibles | Escenarios imposibles por exceso de decoración |
| Símbolos | 1 metáfora central, 1 contrapunto y hasta 2 acentos decorativos | Amontonar 6–8 símbolos por carta |
| Composición | Simetría imperfecta, pausa visual y ritmo; sujetos 55–75% del impacto | Cortar miembros, poner todo exactamente en un eje, ilustración plana sin profundidad |

Como convención provisional: trazo de silueta equivalente a **2–3,5 unidades sobre un lienzo 440×290**, secundarios de **1–2 unidades**, motivos ínfimos no por debajo de lo que siga visible en una miniatura de 220×145. No es una orden de aplicar stroke idéntico a todo: el peso visual manda.

## 4. Paleta heredada y uso
Referencias del código ya aprobado (no paleta completamente nueva):

| Función | Referencia | Uso artístico |
|---|---|---|
| Noche / tinta | `#171c27`, `#29394b` | contorno, profundidad, fondo contextual |
| Pergamino | `#f1e8d7`, `#e4d7be`, `#e8ddc6` | papel, luz, negativo |
| Dorado envejecido | `#d7ad73` | ornamentos y pequeños hitos |
| Sombra cálida | `#88694d`, `#ac8c6d` | apoyo, madera, grabado |
| Azul elección A | entorno `#294d6c` | reservado a respuesta/sello; no pintar «la opción buena» |
| Verde elección B | entorno `#285949` | reservado a respuesta/sello; no pintar «la opción buena» |

La ilustración puede usar, por carta, **un pigmento acento adicional** (terracota, pizarra azulada, salvia, óxido rosado) y sus matices, subordinados a la familia de pergamino+tinta. Evitar A=azul/B=verde dentro de la escena: induciría a inferir el gesto correcto y haría visible qué polo puntúa en cada pregunta. Tampoco hay código de «color para introvertidos» o «color para racionales».

**Prueba de neutralidad:** si se permutan izquierda y derecha las dos escenas, el dibujo debe seguir siendo igual de bello y digno. Una opción no puede recibir sistemáticamente sol, flores o personas sonrientes y la otra sombras o deterioro.

## 5. Anatomía de una buena escena
1. **Ancla:** objeto o arquitectura que une las dos posibilidades (una mesa, un mapa, un camino, una lámpara).
2. **Dos lecturas:** diferencias de actividad o enfoque, **no** dos personas «buenas/malas».
3. **Puente:** línea, sombra, eje o elemento que conecta ambos lados; no una barrera hostil.
4. **Detalle de descubrimiento:** uno o dos signos que recompensen una segunda mirada, sin ser necesarios para entender la pregunta.
5. **Aire:** dejar hueco para que la silueta respire; la escena debe entenderse también a 50% de tamaño.

### Cuatro familias, sin imponer estereotipos
- **IE — relaciones con el entorno:** estancias, umbrales, reunión/recogimiento, conversaciones; no equiparar introversión con tristeza o extraversión con éxito social.
- **SN — modos de atender:** lupa y horizonte, mapa y paisaje, hechos y conexiones; no representar sensorial como simple o intuición como superior.
- **FT — criterios de decisión:** balanza, hilos, manos, geometría, vasijas; no equiparar pensamiento con frío ni sentimiento con irracionalidad.
- **JP — maneras de organizar:** senderos, calendarios abstractos, herramientas, puertas, líneas flexibles; no equiparar planificación con virtud ni espontaneidad con irresponsabilidad.

Estas son **familias editoriales** para dar variedad, **no iconos psicométricos** ni identificación visible de la dimensión en la carta.

## 6. Elementos comunes y diferenciados
**Conservar una sola vez en la interfaz:** contorno de carta, reverso, encabezado, numeración, divisores, pregunta, rótulos A/B, sello flotante y estados de botones. **No volver a dibujar** elementos que ya existen en CSS.

**Pueden variar por pregunta:** escena principal, objetos, dos o tres capas de profundidad, pequeña constelación/patrón, orientación espacial de figuras, acento secundario.

**No necesita SVG propio cada objeto:** libro, ventana, estrella, hilo, lámpara, mesa, balanza y sendero pueden formar una biblioteca de componentes. Pero las escenas tienen que ser **composiciones con intención**, no combinaciones aleatorias de iconos.

## 7. Biblioteca futura (especificación, no archivos creados)
Propuesta de carpetas, solamente cuando empecemos a producir:
```text
assets/art/
  core/           # apoyo de escenas; sin rehacer el marco de UI
  symbols/        # lámpara, libro, camino, ventana, brújula...
  figures/        # gestos y siluetas humanas reutilizables
  motifs/         # composiciones/escenas por pregunta
  patterns/       # puntillismo, cielo, líneas
  manifests/      # asociación Qxx → composición + versión
```

**Normas técnicas para futuros SVG:**
- `viewBox` coherente 440×290 o equivalente 220×145; sin dimensiones intrínsecas rígidas, sin fuentes embebidas y sin texto dependiente del idioma.
- SVG estático por defecto; nada de scripts, eventos, recursos remotos, raster incrustado, filtros costosos ni IDs globales duplicados cuando se incrusten varios SVG en una página.
- Grupos semánticos nombrados al editar; colores tokenizados en origen o un proceso de generación determinista y auditado. Prever `<img>` (CSS externo no colorea el interior) o inyección inline segura: decidir **antes** de construir la biblioteca, no prometer recoloración universal.
- No depender de máscaras complejas; prueba de exportación SVG→PNG para descubrir problemas con `clipPath` / `mask` / trazos y fondos transparentes.
- Cada motivo declarará `id`, `questionId`, versión, dependencia de símbolos, composición, colores, licencia y estado de aprobación; no mezclar estos metadatos con la clave de puntuación.
- La accesibilidad de la pregunta reside en el **texto real**; el arte será decorativo (`aria-hidden`) salvo que, en otra fase, se decida explícitamente ofrecer descripción alternativa. No codificar información indispensable solo por color.

## 8. No-negociables antes de aprobar ilustraciones
- Correcta lectura a `220×145` y reducido a ~`170×112`; geometría no se descompone.
- Dibujo reconocible en monocromo; ningún lado de A/B recibe mejor trato.
- Se ve bien en arco recortado; margen seguro; no invade enunciado/opciones.
- No introduce connotaciones de «normalidad», capacidad, nivel intelectual, género o moralidad.
- No altera el código ni los tiempos de gestos, sellos, vuelco o transición.
- Respeta tramas y peso gráfico de las otras cartas aprobadas, pero **cada pregunta cuenta algo distinto**.
- El SVG se puede revisar con ojos humanos y con comprobaciones de estructura sin convertirlo en una masa de paths inmanejable.

## 9. Proceso de trabajo deliberadamente pequeño
**Paso A — ahora:** aprobar la guía + briefs narrativos, sin imágenes.  
**Paso B:** elegir **Q11** como escena maestra; boceto conceptual y, solo con autorización posterior, un SVG de alta calidad.  
**Paso C:** probar Q11 en la carta a 320×568, 390×844 y escritorio, con todas las etiquetas/gestos, y comparar en miniatura.  
**Paso D:** producir 3 escenas adicionales, una por cada eje restante (Q12 SN, Q22 FT, Q25 JP); evaluar **coherencia sin repetición**.  
**Paso E:** cerrar un primer paquete con las 12 del modo rápido y después las otras 20.

**Estado de este documento:** las decisiones son guía de diseño, no artes finales, no aprobaciones de preguntas y no una orden de generar SVGs.
