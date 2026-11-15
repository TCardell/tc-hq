/** TC/OS English UI adapter for bundled independent tools.
 * Changes labels only. Does not alter application logic, input values, mathematical expressions or data.
 * Third-party pages are intentionally not modified.
 */
(()=>{
 let pref={};try{pref=JSON.parse(localStorage.getItem('tcos.preferences')||'{}')||{}}catch{}
 const chosen=['es','en'].includes(pref.language)?pref.language:(/^es(?:-|$)/i.test(navigator.languages?.[0]||navigator.language||'en')?'es':'en');
 document.documentElement.lang=chosen;
 if(chosen!=='en')return;
 const labels={
  // Scientific: navigation and general controls
  'Científica':'Scientific','CIENTÍFICA':'SCIENTIFIC','Ecuaciones':'Equations','Cálculo':'Calculus','Unidades':'Units','Constantes':'Constants','Laboratorio':'Laboratory',
  'GUÍA DE SINTAXIS':'SYNTAX GUIDE','Las funciones trigonométricas usan el modo DEG/RAD elegido. Las integrales son':'Trigonometric functions use the selected DEG/RAD mode. Integrals are',
  'numéricas y definidas':'numeric and definite',
  '; no hacemos álgebra simbólica ni derivadas simbólicas. Las constantes tienen unidades SI, no se incorporan automáticamente unidades dimensionales a los cálculos.':'; no symbolic algebra or symbolic derivatives are provided. Constants use SI units; dimensional units are not automatically carried through calculations.',
  'Expresión matemática':'Mathematical expression','RESULTADO':'RESULT','Resultado':'Result','Copiar':'Copy','Historial':'History',
  'Básica':'Basic','▤ Fracción':'▤ Fraction','Limpiar':'Clear',
  'Todavía no hay operaciones.':'No calculations yet.',
  'Las últimas operaciones se guardan en este navegador. Toca una expresión para reutilizarla.':'Recent calculations are saved locally. Select an expression to reuse it.',
  // Equation solver, matrices, numeric methods
  'Ecuaciones y sistemas':'Equations and systems',
  'Polinomios reales de grado 1 a 4 y sistemas de 2 a 4 incógnitas. El cálculo es numérico.':'Real polynomials of degrees 1–4 and systems of 2–4 unknowns. Solutions are numerical.',
  'Coeficientes en orden descendente: aₙxⁿ + … + a₀ = 0.':'Coefficients in descending order: aₙxⁿ + … + a₀ = 0.',
  'Tamaño del sistema':'System size','2 incógnitas':'2 unknowns','3 incógnitas':'3 unknowns','4 incógnitas':'4 unknowns',
  'Introduce los coeficientes y los términos independientes.':'Enter coefficients and constant terms.',
  'Introduce los coeficientes.':'Enter coefficients.',
  'Operaciones con matrices':'Matrix operations',
  'Introduce matrices reales de 2×2 a 4×4. Determinantes, inversa, transpuesta, suma, resta y producto.':'Enter real 2×2 to 4×4 matrices. Determinants, inverse, transpose, addition, subtraction and multiplication.',
  'Tamaño':'Size','Selecciona una operación.':'Select an operation.',
  'Integrales y derivadas':'Integrals and derivatives',
  'Integrales definidas y derivadas numéricas. Escribe la función con la variable':'Definite integrals and numerical derivatives. Enter the function using variable',
  'Función f(x)':'Function f(x)','Límite inferior a':'Lower bound a','Límite superior b':'Upper bound b','Punto de derivación':'Differentiation point',
  'f′(x) Derivada en un punto':'f′(x) Derivative at a point','Introduce una función para comenzar.':'Enter a function to begin.',
  'Conversiones por magnitudes físicas, incluyendo temperaturas y electronvoltios.':'Conversions between physical units, including temperatures and electronvolts.',
  'Magnitud':'Quantity','Valor':'Value','Constantes científicas':'Scientific constants',
  'Valores SI de referencia. Pulsa «Usar» para insertar la constante en la calculadora.':'SI reference values. Select Use to insert a constant into the calculator.',
  'Todas las áreas':'All areas',
  'Los valores señalados como «exactos» proceden de definiciones del SI. Para constantes medidas se indica su referencia.':'Values marked exact come from SI definitions. Measured constants include their reference.',
  'Pequeñas calculadoras temáticas. Comparten las constantes del sistema.':'Specialized calculators sharing the system constants.',
  '☀ Efecto fotoeléctrico':'☀ Photoelectric effect','Efecto fotoeléctrico':'Photoelectric effect',
  'Ecuación de Einstein':'Einstein equation',
  'Energía del fotón, umbral de emisión y energía cinética máxima del electrón.':'Photon energy, emission threshold and maximum kinetic energy of the electron.',
  'Longitud de onda λ (nm)':'Wavelength λ (nm)','Función de trabajo W (eV)':'Work function W (eV)',
  'Calcular efecto fotoeléctrico':'Calculate photoelectric effect',
  'Trabajamos en unidades SI: pascales, m³, moles y kelvin.':'Values use SI units: pascals, m³, moles and kelvin.',
  'Presión p':'Pressure p','Calcular gases ideales':'Calculate ideal gas',
  'Ajustes de Scientific':'Scientific settings','Formato del resultado':'Result format',
  'Automático':'Automatic','Científico':'Scientific','Teclado predeterminado':'Default keypad','Básico':'Basic',
  'Fracciones visuales y entrada lineal':'Visual fractions and linear input','Mostrar fracciones exactas':'Show exact fractions',
  'Guardar historial localmente':'Save calculation history locally',
  'Estos ajustes quedan guardados en tu navegador. Los cálculos mantienen su precisión interna independiente de los decimales mostrados.':'These settings are saved locally. Internal calculation precision is independent of displayed decimal places.',
  'Fracción en castillo':'Stacked fraction',
  'Escribe numerador y denominador. Usa las flechas ↑ y ↓ para cambiar de campo.':'Enter numerator and denominator. Use ↑ and ↓ to switch fields.',
  'Insertar fracción':'Insert fraction','Decimales visibles':'Visible decimal places','Cerrar':'Close',
  'Usar':'Use','Calcular':'Calculate','Buscar constante o símbolo…':'Search constant or symbol…',
  'Escribe una expresión…':'Enter an expression…',
  'Abrir herramientas':'Open tools','Ajustes':'Settings','Copiar el resultado':'Copy result','Borrar historial':'Clear history',
  // Registry Manager: static labels; dynamic reports remain source data
  'Cargando registro...':'Loading registry…','Recargar':'Reload','Importar catálogo':'Import catalog',
  'Los cambios se preparan en el registro de trabajo. Se aplica':'Changes are prepared in the working registry. Apply',
  'Programas':'Programs','Directorios':'Directories','Validación':'Validation','Programas registrados':'Registered programs',
  '+ Nuevo programa':'+ New program','Registrar programa':'Register program','ID interno':'Internal ID','Comando':'Command',
  'Nombre en español':'Spanish name','Nombre en inglés':'English name','Archivo HTML o URL HTTPS':'HTML file or HTTPS URL',
  'Icono':'Icon','Elegir':'Choose','Carpeta virtual':'Virtual folder',
  'Descripción en español':'Spanish description','Descripción en inglés':'English description',
  'Acceso directo de fábrica':'Default desktop shortcut','Mostrar en Inicio':'Show in Start','Disponible en terminal':'Available in terminal',
  'Comportamiento al abrir':'Launch behavior','Ventana de TC/OS':'TC/OS window','Pestaña nueva':'New tab',
  'Preguntar siempre':'Always ask','Guardar en el registro':'Save to registry','Probar apertura':'Test launch',
  'Quitar del catálogo':'Remove from catalog','Árbol de directorios':'Directory tree','+ Nueva carpeta':'+ New folder',
  'Las carpetas vacías se conservan en el catálogo.':'Empty folders are preserved in the registry.',
  'Crear directorio':'Create directory','ID permanente':'Permanent ID','Carpeta superior':'Parent folder',
  'Carpeta en el escritorio de fábrica':'Default desktop folder','Carpeta visible en Inicio':'Folder visible in Start',
  'Guardar carpeta':'Save folder','Eliminar si está vacía':'Delete if empty','Reubicar contenido y eliminar':'Relocate contents and delete',
  'Integridad del registro':'Registry integrity','Comprobar':'Validate','Registro de trabajo':'Working registry',
  'Sin modificaciones':'No changes','Deshacer último cambio':'Undo last change','Descartar cambios':'Discard changes',
  'DESCARGAR programs.json':'DOWNLOAD programs.json','BIBLIOTECA DE ICONOS TC-HQ':'TC-HQ ICON LIBRARY',
  // Diagnostics
  'Ejecutar diagnóstico':'Run diagnostics','Preparado.':'Ready.','Estado':'Status',
  'Recurso / Comprobación':'Resource / Check','Resultado':'Result',
  'Las verificaciones HTTP pueden depender de la configuración del alojamiento. Las comprobaciones del catálogo son independientes de la red.':'HTTP checks may depend on the available connection. Registry checks work independently of the network.'
 };
 const ignored=new Set(['SCRIPT','STYLE','TEXTAREA','CODE','PRE','KBD','OPTION']);
 const attrs=['title','aria-label','placeholder'];
 function translated(str){
  const exact=labels[str];if(exact!==undefined)return exact;
  let m=str.match(/^(\d+) incógnitas$/);if(m)return `${m[1]} unknowns`;
  return str;
 }
 function textNode(node){const parent=node.parentElement;if(!parent||ignored.has(parent.tagName)||parent.closest('script,style,textarea,pre,code,kbd'))return;
  const old=node.nodeValue;const t=old.trim();if(!t)return;const next=translated(t);
  if(next!==t){const lead=old.slice(0,old.indexOf(t)),tail=old.slice(old.indexOf(t)+t.length);node.nodeValue=lead+next+tail}
 }
 function visit(node){
  if(node.nodeType===3){textNode(node);return}
  if(node.nodeType!==1||ignored.has(node.tagName))return;
  for(const a of attrs){const current=node.getAttribute(a);if(current){const next=translated(current);if(next!==current)node.setAttribute(a,next)}}
  for(const child of node.childNodes)visit(child);
 }
 function attach(){visit(document.body);
  new MutationObserver(list=>{
   for(const rec of list){if(rec.type==='characterData')textNode(rec.target);
    else if(rec.type==='childList'){for(const node of rec.addedNodes)visit(node)}
    else if(rec.type==='attributes')visit(rec.target);
   }
  }).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:attrs});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attach,{once:true});else attach();
})();
