# TYPE/16 — Anatomía y dirección conceptual de las cartas
**Preproducción · v0.1 · 23/11/2026 · SIN imágenes, SVG ni implementación gráfica.**  
Documento complementario a [ART_DIRECTION.md](ART_DIRECTION.md). Las ideas son borradores artísticos, no instrucciones de modificar el instrumento ni de cambiar el comportamiento aprobado en `gesture-lab.html`.

## 1. Qué es una carta de TYPE/16
Una carta contiene tres discursos a la vez, de arriba abajo:
1. **Objeto de baraja**: encabezado ornamental, número, arco ilustrado, reverso; identidad coherente con la v0.11.1.
2. **Una pequeña historia visual**: dos lecturas de una misma situación; anima a pensar, no a contestar de cierta manera.
3. **Pregunta inequívoca y dos polos A/B**: siempre procedentes de `js/questions.js`; el texto y la puntuación viven fuera del SVG.

En la fase actual no diseñamos la portada, el reverso, los sellos ni los botones: están aprobados y tienen su propio código. Diseñamos exclusivamente **qué escena habitará la ventana `.card-art`** de cada pregunta.

El código de la pregunta `Qxx` es inmutable respecto al documento OEJTS y **no corresponde al orden mostrado**. En el modo rápido, Q11 es la novena carta, no la primera: se elige ahora como **maestra de ilustración**, no para alterar la secuencia.

### 1.1. Composición técnica que debe respetar la escena
- Bastidor de autoría propuesto: **440×290 unidades** (proporción del SVG actual, 220×145). Resultado final transparente integrado sobre el fondo arqueado actual.
- No ocupar todo el campo con figuras: reservar un margen de respiración y evitar detalles críticos en los dos extremos superiores.
- Silueta principal en el 65–75% central, contrastes secundarios; nunca textos ni leyendas dentro de la escena.
- La versión móvil baja puede mostrar el arte alrededor de 100–115 px de alto: probar a esa escala antes de añadir ornamentos.
- La escena no depende del gesto: al responder, **se mueve y gira la carta completa**. Ningún personaje cambia de aspecto ni se anima para señalar A o B.
- Ambos polos deben ser identificables, pero **sin convertir la ilustración en una viñeta separada por una línea vertical rígida** siempre.

### 1.2. Orden de lectura
`encabezado → escena → pregunta → opciones A / B → pie`. Si el arte exige que el título se haga pequeño o que una opción se trunque, falla el arte, no el diseño de la interfaz.

## 2. Carta maestra: Q11 — «Trabajo en grupo / trabajo a solas»

**Código:** `OEJTS12:Q11` · eje IE · signo −1 · novena pregunta rápida.  
**Texto actual de producción:**
- ES A: «Trabaja mejor en grupo»
- ES B: «Trabaja mejor a solas»
- EN A: “works best in groups”
- EN B: “works best alone”
- Enunciado genérico de la interfaz real por definir sin alterar la pareja original (p. ej., «¿Qué te describe mejor?»); la escena NO contiene frases.

### 2.1. Título conceptual: **LA MESA COMPARTIDA**
**Premisa:** Una misma mesa de trabajo extensa puede albergar dos formas de concentración. A un lado, personas colaboran alrededor de un proyecto; en el otro, alguien desarrolla un trabajo a solas. Ningún extremo está vacío, triste o desordenado.

**Emoción buscada:** calma, curiosidad, reconocimiento; sensación de que ambos modos de trabajar son válidos y pueden incluso convivir en una misma vida.

**Metáfora central:** *una mesa y una lámpara común*. No hay un muro. Un arco y una serie de sombras crean dos rincones, pero ambos comparten la misma arquitectura.

### 2.2. Bloqueo de composición — lienzo conceptual 440×290
- **Fondo** (y ≈ 30–215): único taller/estudio de libros; un arco central poco marcado, dos ventanas altas equivalentes en peso visual. Una línea arquitectónica une los lados.
- **Mesa continua** (x ≈ 45–395, y ≈ 182–238): un mismo tablero largo, ligeramente curvado en perspectiva. Es el objeto que impide leer «grupo» y «soledad» como universos morales opuestos.
- **Lado A / izquierdo** (x ≈ 55–208): 2 o 3 siluetas pequeñas colaboran alrededor de un cuaderno abierto; gestos distintos pero claros (señalar, observar, tomar notas). No dibujar un grupo enorme que haga «ganar» visualmente a A.
- **Lado B / derecho** (x ≈ 232–386): una figura concentrada con un cuaderno de tamaño visual algo mayor y herramientas propias; su postura expresa atención, no aislamiento.
- **Centro** (x ≈ 203–237): lámpara o farol suspendido que da **la misma luz a ambos**. La intensidad, el contraste y el nivel de detalle se equilibran.
- **Suelo/base** (y ≈ 235–267): 1 o 2 líneas de apoyo, rayado leve; no obstruir las manos/cabezas.
- **Arriba y esquinas**: respiro; si aparece una estrella o arabesco, debe quedar subordinado a las acciones.

### 2.3. Guion de lectura en tres segundos
1. «Es el mismo espacio de trabajo».
2. «A la izquierda trabajan juntos; a la derecha, alguien trabaja por su cuenta».
3. «Ambas formas parecen naturales y satisfactorias».

Si el lector interpreta «acompañado frente a abandonado», «organizados frente a solitario» o «felices frente a tristes», hay que rehacer la composición.

### 2.4. Personajes, objetos y atmósfera
- Figuras humanas de **rostro esquemático**, sin codificar sexo, origen o edad y sin jerarquizar con ropa o postura.
- Libros, herramientas y hojas en **cantidades comparables**: no insinuar que una modalidad es más productiva.
- Madera en ocre cálido, contorno azul tinta, papel crema; un acento terracota apagado **distribuido** en ambos extremos (no usar «azul A y verde B»).
- Luz central suave, no halo heroico sobre la persona sola o sobre el grupo.
- Mini-trama de grabado en pared y superficie, no sobre los rostros ni sobre el gesto principal.

### 2.5. Capas de producción futuras, no SVG todavía
`architecture` (arco, ventanas), `light` (lámpara), `table`, `group-figures`, `solo-figure`, `props`, `ground`, `engraving-details`.
Los nombres son semánticos; no obligan a fragmentar todo en archivos independientes. Evitar que elementos reutilizados pierdan su relación de escala.

### 2.6. Alternativa B de composición (si la primera no convence)
Un **libro abierto** visto en perspectiva: a su izquierda varias manos comparten herramientas alrededor de una página; a su derecha una sola mano traza en la página contigua. No dibujar dedos anatómicos complejos en miniatura. Esta versión es más simbólica y más fácil de leer a tamaño reducido, pero pierde algo de narrativa humana.

### 2.7. Riesgos concretos y criterios de aprobación
| Riesgo | Comprobación |
|---|---|
| Lado A pesa más por reunir 3 figuras | Igualar masas oscuras y superficies claras, no número de personas |
| B parece «aislamiento» | Dar actividad propia y entorno cálido, no una habitación vacía |
| Demasiados dedos/libros a 100 px de alto | Simplificar a siluetas, cuadernos y gestos amplios |
| El farol induce la mirada hacia un lado | Luz central común; equilibrar contrastes |
| El sello flotante tapa cabezas | Concentrar siluetas en centro y franja media-baja |
| EN/ES cambia el espacio de texto | No incluir texto dentro del SVG, mantener geometría estable |

**Aprobación futura:** miniatura monocroma, muestra con color restringido, lectura a ~170×112, 220×145 y dentro de cartas móviles de 320×568 y 390×844 y PC; sin cortar el sello ni las respuestas. Hasta esa prueba, el concepto sigue siendo «candidato».

## 3. Tres escenas hermanas para comprobar las cuatro dimensiones
Son propuestas conceptuales **del segundo lote**, no dibujos que deban producirse de golpe.

### Q12 · SN · «El presente y el horizonte»
**A:** «Se centra en el presente». **B:** «Se centra en el futuro».  
Un mismo mirador dividido en *distancias*, no en castillos rivales. En primer plano, una figura estudia objetos a mano sobre una mesa; al otro lado, esa misma figura contempla un paisaje de caminos hacia el horizonte. Una línea de agua o de tierra une cercanía y distancia. **Equilibrio:** el detalle presente ha de ser tan sugerente como el horizonte; evitar que la visión lejana sea una «revelación superior». **Reutilizables:** ventana, mapa, horizonte, hoja, camino.

### Q22 · FT · «Los dos instrumentos»
**A:** «Sigue al corazón». **B:** «Sigue a la cabeza».  
Un documento por decidir permanece en el centro. Dos instrumentos de interpretación nacen del mismo punto: un **hilo de relaciones** que conecta pequeños retratos simbólicos y un **compás geométrico** que ordena trayectorias. Los dos están hechos de materiales de igual riqueza. No usar corazón rojo sonriente frente a cerebro gris frío; no sugerir que un polo es bondad y el otro cálculo deshumanizado. **Reutilizables:** hilo, compás, manos, pliego de papel.

### Q25 · JP · «El taller de posibilidades»
**A:** «Improvisa». **B:** «Se prepara».  
Dos maneras de construir una pequeña estructura con **el mismo juego de piezas**. A la izquierda, una figura prueba conexiones sobre la marcha; a la derecha, otra revisa plantillas y encajes antes de montar. Ambas estructuras funcionan y el taller es acogedor. No representar la improvisación como caos ni la preparación como aburrimiento. **Reutilizables:** piezas geométricas, mesa, regla, plantilla, manos.

**Prueba de sistema:** si Q11, Q12, Q22 y Q25 se ven juntos deben reconocerse como la misma baraja, pero distinguirse por historia, composición y objetos; no solo por cambiar el color.

## 4. Briefs de las 12 preguntas rápidas — orden real del motor
Cada brief especifica **concepto visual**, correspondencia A/B y qué sesgo evitar. No se han escrito instrucciones para cambiar el cuestionario.

| Turno rápido | ID / eje | Concepto de la ventana arqueada | Cuidado especial |
|---|---|---|---|
| 01 | **Q03 · IE** | **Habitación de las pausas.** Una misma habitación: una figura intenta llenar el silencio con actividades (A «Se aburre pasando tiempo a solas»), otra descansa deliberadamente en la calma (B «Necesita tiempo a solas»). | No convertir A en hiperactividad cómica ni B en tristeza |
| 02 | **Q12 · SN** | **El presente y el horizonte.** Primer plano observado frente a trayecto futuro; ambos tienen detalles interesantes. | Evitar «presente terrenal» inferior a «futuro brillante» |
| 03 | **Q22 · FT** | **Los dos instrumentos.** Hilo relacional y compás geométrico orientan una misma decisión. | No personificar empatía como «buena» ni análisis como «frío» |
| 04 | **Q25 · JP** | **El taller de posibilidades.** Construcción improvisada frente a construcción planificada, ambas logradas. | No igualar improvisación con incompetencia |
| 05 | **Q15 · IE** | **La sala de las luminarias.** Una misma reunión de siluetas, con un invitado que busca una pausa (A «Las fiestas le dejan agotado/a») y otro que se anima a conversar (B «Las fiestas le dan energía»). | La pausa no es rechazo social; B no es fiesta estridente |
| 06 | **Q20 · SN** | **El cronista.** Dos páginas del mismo acontecimiento: A sigue el recorrido observable de los hechos; B enlaza símbolos de su significado. | Evitar «hechos sin alma» o «interpretación mágica superior» |
| 07 | **Q14 · FT** | **Dos gestos de reconocimiento.** Escena de encuentro donde A expresa búsqueda de respeto y B de afecto; gestos equivalentes, nunca humillación/idealización. | Son deseos compatibles; no moralizar cercanía |
| 08 | **Q13 · JP** | **La mesa del tiempo.** Un proyecto con marcas tempranas frente a marcas próximas al final, ambos llegando al mismo objetivo. | A no es «adulto serio» y B no es «irresponsable» |
| 09 | **Q11 · IE** | **La mesa compartida.** Colaboración y trabajo en solitario en el mismo taller. Ver brief maestro. | Igualar importancia y luz en A/B |
| 10 | **Q32 · SN** | **El observatorio de las preguntas.** Un atlas de señales «quién/qué/cuándo» frente a una red que indaga conexiones «por qué». Sin palabras incrustadas. | No asociar las preguntas factuales con superficialidad |
| 11 | **Q26 · FT** | **La plaza del juicio.** Una balanza de criterios y una red de cuidado junto a la misma situación humana. | Justicia y compasión no son enemigos; ninguna opción más «buena» |
| 12 | **Q17 · JP** | **Las puertas del camino.** Una figura contempla varios senderos practicables (A «Mantiene abiertas sus opciones») y otra recorre un sendero elegido (B «Se compromete con una decisión»). | Abrir no es indecisión; cerrar no es rigidez |

Este primer bloque recorre escenas de **habitación, mirador, instrumento, taller, reunión, libro, plaza y camino**: variedad narrativa sin abandonar un vocabulario arquitectónico común.

## 5. Conceptos semilla para las 20 preguntas restantes
**Solo mapa editorial; no briefs finales**. Evita dibujarlas ya, pero ayuda a elegir qué recursos merecerá la pena extraer de la carta maestra.

| ID | Concepto posible | Nota de neutralidad |
|---|---|---|
| Q01 | **El inventario:** libreta de marcas frente a memoria representada por objetos recordados | Ambas estrategias pueden coexistir |
| Q02 | **La lente y el umbral:** examen de evidencias frente a deseo de admitir una idea | No premiar «creer» ni «dudar» |
| Q04 | **La escultura cambiante:** una forma aceptada y una forma transformable | Evitar equiparar cambio con progreso moral |
| Q05 | **El cuarto de las cosas:** objetos organizados y objetos dispuestos libremente | El orden no debe representarse como virtud |
| Q06 | **El autómata ambiguo:** relación distinta con una figura mecánica | Evitar ridiculizar/deshumanizar |
| Q07 | **El pulso del día:** gestos dinámicos frente a reposo consciente | Vitalidad y calma, igual dignidad |
| Q08 | **Dos cuadernos:** casillas y espacio narrativo como formatos de examen | No implicar más inteligencia en un lado |
| Q09 | **La caja de herramientas:** organización libre frente a estructura ordenada | Sin suciedad o negligencia |
| Q10 | **Dos superficies:** material delicado frente a material resistente | No dibujar vulnerabilidad como debilidad |
| Q16 | **El mosaico:** patrón compartido frente a una pieza singular | Destacar no significa ser mejor |
| Q18 | **El taller de reparación/cuidado:** objeto mecánico y acompañamiento humano | Evitar representar personas como «averiadas» |
| Q19 | **La conversación:** cintas de voz y escucha alrededor de una mesa | No hacer un lado dominante |
| Q21 | **La tarea y el reloj:** empezar ahora frente a posponer | No equiparar demora con pereza |
| Q23 | **La ventana y la ciudad:** dos maneras de pasar una tarde | Exterior no siempre más alegre |
| Q24 | **El mapa y la lupa:** vista global frente a foco en detalles | Igual atención, distinta escala |
| Q27 | **La llamada lejana:** gesto de llamar entre dos torres | No hacer inferencias sobre capacidades sensoriales |
| Q28 | **La teoría y la muestra:** dibujo de estructura frente a examen de objeto real | Evitar jerarquía intelectual |
| Q29 | **Los dos ritmos:** esfuerzo de trabajo y de juego, ambos intensos | El par no es opuesto real; no forzar moralidad |
| Q30 | **La vasija y el agua:** distintas maneras de relacionarse con emociones | No hacer de una opción «insensible» |
| Q31 | **El escenario y el atril:** actuar y hablar en público, escenas distintas | No inferir que miedo escénico es un tipo |

La pregunta Q27 y otras de riesgo editorial alto se conservan **tal cual** en la base actual; esto es planificación visual, no aprobación de su contenido.

## 6. La biblioteca mínima que merece la pena **planificar**, no fabricar aún
En lugar de 32 dibujos aislados, la carta Q11 indicará qué proporciones y estilo podemos reutilizar.

**Primitivos candidatos:** `arch`, `window`, `desk`, `lamp`, `book`, `human-silhouette`, `thread`, `path`, `compass`, `plant`, `horizon`, `star-detail`.

**Primer lote real futuro:** no más de **una escena terminada** (Q11), con recursos editables y su propia ficha. Una vez aprobada, se extraerán solo las piezas que sean realmente reutilizables. Las siguientes tres escenas permitirán verificar si tiene sentido crear subfamilias de símbolos.

### Ficha que acompañará a cada arte final
- `questionId` y `artId` estables; `version`; `status` (concept / draft / approved).
- Concepto y correspondencia A/B, paleta relativa y dependencias.
- Descripción de riesgos de sesgo / accesibilidad y tamaño mínimo al que funciona.
- Procedencia/licencia del propio dibujo, independiente de la licencia del cuestionario.
- Registro de cambios y evidencia de pruebas a distintos tamaños.

## 7. Comprobación antes de empezar a dibujar
**Preguntas de aprobación conceptual para Q11:**
1. ¿Se entiende como trabajo compartido **y** trabajo a solas, sin necesidad de subtítulos?
2. ¿Ambos extremos atraen la mirada por igual?
3. ¿La mesa y la lámpara aportan unidad en lugar de una división binaria agresiva?
4. ¿Se puede reducir a 3–4 siluetas, 2 cuadernos y una lámpara sin perder el significado?
5. ¿Se diferencia de las escenas Q12/Q22/Q25 y, aun así, pertenece a su misma baraja?

**Siguiente entrega autorizable más pequeña:** producir **solamente** un primer SVG Q11 una vez aprobados el concepto, los objetos y la composición. No generar una biblioteca de 32 SVG en lote ni crear ilustraciones por generación automática sin revisar.

**Estado final:** 32 ideas narrativas catalogadas (12 briefs de apertura, cuatro escenas de referencia —incluida Q11—, 20 semillas), sin ningún SVG, imagen o cambio de interfaz.
