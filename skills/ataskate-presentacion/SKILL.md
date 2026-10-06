---
name: ataskate-presentacion
description: Crea presentaciones animadas en HTML con el estilo del Design System de Ataskate (Nunito, morado #5A5AFF, fondos lavanda, muñequitos oficiales del DS, transiciones y pasos con flechas). Úsalo cuando pidan una presentación, deck, slides o "láminas" con el look de Ataskate, o una presentación "igual a la del Design System". Parte de una plantilla funcionando y de la referencia exacta del DS.
---

# Presentación animada con el estilo Ataskate

El resultado es una página HTML estática:
- Tiene un escenario fijo de **1600×900** que se escala a cualquier pantalla.
- → o espacio avanza: primero revela los pasos de la lámina y después cambia de lámina. ← regresa.
- **F** pone pantalla completa y `#N` en la URL abre la lámina N.
- Usa los muñequitos oficiales del DS, íconos del DS y animaciones de entrada.

- Ejemplo publicado (8 láminas): https://codaboeppler.github.io/ataskate-marketplace/presentacion-ds/
- Cómo debe verse: `referencias/capturas-plantilla.jpg`, con las 8 láminas de la plantilla.

## Archivos del skill

- `plantilla/`: la presentación de ejemplo, completa y funcionando.
  - `index.html`: las láminas.
  - `deck.css`: los estilos.
  - `deck.js`: el motor, los íconos y el comportamiento de cada lámina.
  - `ilus/`: las ilustraciones oficiales.
  - `assets/`: logo, imágenes y capturas.
- `referencias/referencia-ds.md`: medidas exactas del DS (colores, tipografía, botón, campos, Select, TabsButton, Dropzone, Alerta…). **Léela antes de dibujar cualquier componente "del DS".**
- `referencias/ilustraciones.jpg`: catálogo visual de los muñequitos.
- `referencias/iconos-ds.json`: los 372 íconos (`{ Nombre: { viewBox, svg } }`). Para verlos: `iconos-ds-1.jpg` e `iconos-ds-2.jpg`.
- `scripts/capturas.mjs`: captura cada paso y prueba la navegación.

Si solo tienes este archivo y no la carpeta, descárgala de https://github.com/codaboeppler/ataskate-marketplace/tree/main/skills/ataskate-presentacion. Los archivos crudos están en `https://raw.githubusercontent.com/codaboeppler/ataskate-marketplace/main/skills/ataskate-presentacion/<ruta>`.

## Cómo trabajar

1. **Copia la plantilla.** Copia `${CLAUDE_SKILL_DIR}/plantilla/` completa a una carpeta nueva del proyecto, por ejemplo `mi-presentacion/`. El look sale de `deck.css` y `deck.js`:
   - **No cambies sus reglas existentes.** Agrega las tuyas al final de `deck.css`, bajo `/* ===== estilos de esta presentación ===== */`.
   - En `deck.js` solo agregas íconos al mapa `ICONS` o un hook nuevo en `HOOKS`.
2. **Planea pocas láminas.** De 5 a 9, una idea por lámina; menos es mejor. Escribe primero el título de cada lámina y qué se anima en ella.
3. **Arma cada lámina con un patrón de la tabla.** Duplica el `<section>` de la plantilla y cambia los textos.
   - Puedes borrar láminas completas. `deck.js` revisa que existan `#edHost`, `#ba`, `.cover__start` y `#confetti` antes de usarlos.
   - El CSS de los patrones que no uses puede quedarse.
4. **Íconos.** Usa `<i class="ic" data-i="Nombre"></i>`. Si no está en `ICONS` de `deck.js`, copia su entrada de `referencias/iconos-ds.json` a ese mapa. Ver "Íconos".
5. **Muñequitos.** Elígelos por tema con el catálogo de "Muñequitos". No copies las posiciones de la plantilla.
6. **Antes de entregar:**
   - Actualiza `<title>`, `<meta name="description">` y el `data-title` de cada `<section>`. El contador "1 / N" se calcula solo.
   - Haz la "Verificación".

## Patrones de lámina (todos están en la plantilla)

| Patrón | Dónde está | Cómo se usa |
|---|---|---|
| Portada | `<section class="slide cover">` | Logo, `kicker`, título `.h1.words` (entra palabra por palabra), `lead`, botón "Empezar" y muñequitos. El título mide 104 px: máximo 2 líneas de ~16 caracteres. Si es más largo, bájalo a 88–92 px y corta con `<br>`; con 3 líneas choca con el `lead` y con "Empezar", que está fijo en y = 640 |
| Capas y contadores | `data-hook="counters"` | Tres `.layer` con flechas y `.counters`. `<b data-count="1200">0</b>` cuenta de 0 a 1,200 con separador de miles. Las unidades van fuera del número: `<b><span data-count="30">0</span><small>%</small></b>`. Cuenta de 1.5 s a 2.9 s después de entrar |
| Tarjetas con mini animación | `.laws > .law` y `.md-*` | 8 tarjetas en 4 columnas; con `class="laws laws--3"` son 3 columnas más altas. Cada `.md-*` es una animación CSS en bucle: `md-color`, `md-gap`, `md-type`, `md-shape`, `md-fitts`, `md-hick`, `md-jakob` y `md-only`. Para una nueva usa el mismo esquema: ciclo de 4–6 s con estados en `@keyframes` |
| Comparación por pasos | `data-steps="5" data-hook="button"` | A la izquierda, un elemento que cambia en cada → (`.morph` + clases `b-*`); a la derecha, una tabla `.spec__row[data-row]` que se va marcando |
| Transformación de una pantalla | `data-steps="6" data-hook="editor"` + `<template id="edTpl">` | Ver "Transformación" |
| Antes y después | `data-hook="ba"`, con `#baA` (antes) y `#baB` (después) | Un jalador que se recorre solo y queda en 50 % a los ~4.5 s. Si el presentador lo arrastra, el recorrido se detiene. Si `#baA`/`#baB` están vacíos, se llenan con el editor de ejemplo. Si pones tu HTML, dibújalo a 1:1 en el panel de **990×640**, con las dos versiones en las mismas coordenadas. Cambia el texto de `.ba__lbl.l`/`.r`; si el "antes" no es Square, pon `.ba__lbl.l` en `#F7F7F7`/`#54575C` |
| Pantallas en marcos | `.prod > .prod__item` | Capturas `<img class="prod__shot">` dentro de un marco de navegador. Un `<iframe data-src>` solo sirve si es del mismo sitio |
| Beneficios y cierre | `data-steps="1" data-hook="end"` | Tarjetas `.win` (4 columnas; `wins wins--3` para 3) con un muñequito cada una. Con un → más aparece "Gracias" con confeti y desfile. **Para un cierre solo con "Gracias"**, deja `.end__a` vacío y quita `data-steps`: se muestra al entrar |

**Transformación.** El `<template id="edTpl">` guarda la pantalla "antes":
- Cada zona lleva una clase `z-base`, `z-head`, `z-fields`, `z-desc`, `z-vis` o `z-media`.
- En cada paso, el contenedor `.ed` recibe la clase `t-*` de esa zona, y la zona cambia al DS con las reglas `.ed.t-x .z-x …` de `deck.css`.
- Los textos que cambian van así: `<span class="tx"><span class="en">antes</span><span class="es">después</span></span>`. El texto oculto no ocupa lugar.
- Los íconos que cambian llevan `data-sq` (la versión "antes") y `data-i2` (el ícono del DS).
- La "cámara" (`ZONES` en `deck.js`) se acerca a la zona de cada paso y al final se aleja.
- Para otra pantalla:
  1. Reemplaza el contenido del template conservando el esquema.
  2. Ajusta `ED_STEPS`, `ZONES` y los textos de `.ed-step`.
  3. Mide el alto real de la pantalla y ajusta `.ed { height }` y la escala `VIEW.z`.

## Vocabulario de animación

- **Entrada de un elemento:** `data-a="up|down|left|right|pop|fade|zoom|drop"`, con retraso `style="--d:.3s"`. En los muñequitos el retraso va en `data-d=".6"`.
- **Título palabra por palabra:** clase `words` en el `h1`.
- **Muñequito:** `<div class="m" style="left:…px; top:…px; width:…px" data-a="drop"><div class="bob"><img src="ilus/…"></div></div>`.
  - Movimientos del envoltorio interno: `bob`, `bob-slow`, `sway`, `hop` o `spin-slow`.
  - **No** pongas `bob` en el mismo elemento que `data-a`: se pisan.
- **Corredor que cruza la lámina:** `<div class="m run" style="top:…px; width:…px; --dur:12s; --d:1s">` (o `run-back`). Espera fuera de cuadro mientras corre su retraso. Déjalo arriba de y = 760 para no tapar los controles.
- **Revelar por pasos:** `data-steps="N"` en la lámina y `data-step="k"` en cada elemento, que aparece en el paso k.
  - Si el paso cambia algo más que la visibilidad, usa un hook en `HOOKS` de `deck.js`: `enter(slide, token, paso)` y `step(slide, paso, regresando)`.
  - En código asíncrono, compara `token` antes de seguir, para no animar una lámina que ya se fue.

## Reglas (para que se vea igual)

- **Medidas en px sobre el escenario de 1600×900.** Las láminas usan `padding: 72px 96px 96px` y posiciones absolutas. Nada de `vw` ni `vh` dentro de las láminas.
- **Colores de la presentación:**
  - Fondo `#FBFBFE` con manchas lavanda; tarjetas blancas con borde `#E8E9EA`.
  - El morado `#5A5AFF` es el único color de acción y de acento en los títulos (`<em>` dentro del `h1`/`h2`).
  - Navy `#0D166B` solo para texto. Nunca rellenos navy ni oscuros en tarjetas.
- **Colores de componentes del DS:** usa los hex de `referencia-ds.md`, no las variables de `deck.css`. Por ejemplo, el borde del DS es `#D4D6D8`, no `--line`.
- **Pesos de la tipografía de la presentación:**
  - Títulos, kickers, etiquetas, títulos de tarjeta y números: **600**.
  - Párrafos (`.lead`, `p`): 400.
  - Nunca 700, 800 ni 900 en el texto de la presentación.
- **Pesos de los componentes presentados como del DS:** usan el peso exacto de `referencia-ds.md`.
  - Botón: 700.
  - Título de página: 700.
  - Título de Alerta: 700.
  - Etiqueta de campo: 500.
  - Texto de campo: 400.
  - TabsButton: 400, y 600 el seleccionado.

  Las recreaciones del "antes" quedan exentas.
- **Componentes "del DS":** si una lámina dice que algo es del DS, debe medir exactamente lo que dice `referencia-ds.md`. Si no está en el DS, no se presenta como del DS.
- **Textos:** español de México, cortos (máximo 2 líneas por párrafo) y claros para alguien que no es diseñador.
- **Cifras:**
  - Nada de cifras inventadas presentadas como reales.
  - Si piden cifras de ejemplo, márcalas con `<span class="tag-ej">Ejemplo</span>` y dilo en el `lead`.
  - Los montos de ejemplo llevan "Monto de ejemplo".
- **Otras marcas:** si se comparan, se rotulan "recreación" y van sin logos.
- **Repos públicos:** si se publica en uno, sin nombres de personas reales, sin credenciales y sin datos privados.
- **Legibilidad en proyector:**
  - Lo que el público lee va a 14 px o más (en el escenario de 1600). Las mini-UI dentro de `.md` y la barra de controles son la excepción.
  - Muñequitos y textos no deben encimarse entre sí ni con la barra de controles (y > 830).

### Muñequitos (solo oficiales del DS)

Están en `plantilla/ilus/` y se ven en `referencias/ilustraciones.jpg`. Si falta alguna, se descarga de `https://qa.ataskate.com.mx/ilustraciones/<archivo>`.

| Archivo | Qué es | Úsalo para |
|---|---|---|
| `ilust-15-color.svg` | lobo con café y corbata | portada, anfitrión |
| `ilust-18-color.svg` | lobo con signos de pregunta | preguntas, dudas |
| `ilust-19-color.svg` | lobo con sobre | mensajes, avisos |
| `ilust-07-color.svg` | carpetas | piezas, organizar |
| `ilust-17-color.svg` | carpeta con ojos | documentos |
| `ilust-13-color.svg` | cactus con reportes | datos, reportes |
| `ilust-09-color.svg` | ventana con lentes y taza | web, pantallas |
| `ilust-10-color.svg` | ventana con carrito | tienda en línea |
| `ilust-11-color.svg` | puerta | alta, acceso |
| `ilust-12-color.svg` | flecha veloz | rapidez |
| `ilust-14-color.svg` | cerebro en patines | ideas |
| `ilust-05` / `ilust-16-color.svg` | bolsa con billetes | dinero, cliente |
| `ilust-06-color.svg` | taza saltando | energía |
| `ilust-02-color.svg` / `mundo-icono.png` | mundo corriendo | alcance, en línea |
| `ilust-01-color.svg` | hoja en llamas | urgencia, vencimientos |
| `ilust-08-color.svg` | roca enojada sobre papeles | papeleo, problema |
| `ilust-04-color.svg` | plumero enojado | molestia, limpiar |
| `success-message.png` / `error-message.png` | palomita / prohibido | sí / no |
| `inventario.png` | cajas en 3D (otro estilo) | solo inventario |

Las `propuesta-*` del DS todavía no son oficiales. **Nunca uses `avatar.png`**: es la foto de una persona real.

### Íconos

- Elige viendo `iconos-ds-1.jpg` e `iconos-ds-2.jpg`: algunos nombres engañan.
  - `Schedule` es un reloj.
  - `Clock` es un calendario.
  - `Time` es un reloj de arena.
  - `Monitor` es una gráfica.
- Evita `Hashtag`, `HashtagSecondary` y `ThumbUp`, que se dibujan mal, y los nombres con erratas: `Evaluacin`, `Dcownload`, `ComunicacinConClientes`.
- El puntero de `.md-fitts` es el único dibujo propio permitido.

## Verificación

1. **Sirve la carpeta** desde `mi-presentacion/`: `python3 -m http.server 8000`.
2. **Corre el script.** Instala una vez, en esa misma carpeta, con `npm i puppeteer-core`; necesita Google Chrome. Después:
   `node ${CLAUDE_SKILL_DIR}/scripts/capturas.mjs "http://localhost:8000/#1"`
   El script:
   - cuenta solo las → (láminas − 1 + todos los `data-steps`);
   - espera 4.5 s por paso;
   - guarda las capturas en `./capturas/`;
   - prueba que ← regrese, que cinco → rápidos dejen una sola lámina en pantalla y que `#3` abra la lámina 3;
   - imprime los errores de consola.
3. **Revisa cada captura** contra `referencias/capturas-plantilla.jpg`. Busca:
   - textos encimados o cortados;
   - muñequitos sobre el texto o sobre los controles;
   - espacios vacíos raros;
   - letras chicas;
   - títulos con una palabra sola en la última línea.
4. **Confirma** que el script diga "Sin errores en consola" y que las tres pruebas digan "bien".

Las fuentes (Nunito y Platypi) se cargan de Google Fonts. Para presentar sin internet, descarga los `.woff2` a `assets/` y declara `@font-face` al inicio de `deck.css`.

## Publicar

La carpeta es estática, sin build: sirve para GitHub Pages, Netlify o cualquier hosting estático. Pregunta antes de publicar.
