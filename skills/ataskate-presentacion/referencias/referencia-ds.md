# Referencia del Design System de Ataskate

Medidas leídas en vivo del DS de QA (https://qa.ataskate.com.mx/design-system) el 2026-10-06. Esa página es la fuente de verdad: si algo de aquí no coincide con ella, gana el DS de QA.

## Fundamentos

**Colores (47 en total).** Los que más se usan:

| Uso | Token | Hex |
|---|---|---|
| Acción (botones, enlaces de acción) | primary / purple-300 | `#5A5AFF` |
| Hover de botones, texto navy, borde activo | buttonLink / primary-400 | `#0D166B` |
| Superficies lavanda | purple-10 · 50 · 100 · 200 | `#FAFAFF` · `#F0F0FF` · `#E5E5FF` · `#ACACFF` |
| Fondo de página | surface-page | `#FBFBFE` |
| Tarjeta | surface-card | `#FFFFFF` |
| Tarjeta gris | surface-card-gray | `#F7F7F7` |
| Borde | border-default | `#D4D6D8` |
| Texto título · cuerpo · caption · placeholder | text-* | `#1D1E20` · `#2A2C2F` · `#54575C` · `#A1A5AA` |
| Éxito: fondo · ícono · título | success-* | `#EFFAF4` · `#309C60` · `#174A2E` |
| Error: fondo · ícono · título | error-* | `#FFEBEB` · `#A82424` · `#501111` |
| Alerta: fondo · ícono · título | warning-* | `#FFEBBA` · `#CC9200` · `#614500` |
| Info: fondo · ícono · título | info-* | `#EBF9FF` · `#008FCC` · `#004461` |
| Solo ilustraciones (nunca botones) | illustration-* | rosa `#FF98EF` `#FF6AE8`, lima `#D8FF03`, cian `#30D8FF`, rojo `#FF8E85` `#FF6357`, lila `#E7CBFF` |

Semántica light: navy (`#0D166B`) solo se usa para texto y hover; nunca como relleno de tarjetas.

**Tipografía (16 escalas).**
- Nunito para todo lo que se opera.
- Platypi solo para los títulos del Marketplace.

| Estilo | Familia | Tamaño / alto de línea | Peso |
|---|---|---|---|
| Título de página | Nunito | 28 / 33.6 | 700 |
| Títulos | Nunito | 24 / 28.8 | 600 |
| Subtítulos | Nunito | 20 / 24 | 600 |
| Texto Bold / SemiBold | Nunito | 16 / 19.2 | 600 |
| Texto Regular | Nunito | 16 / 19.2 | 400 |
| Tabla header | Nunito | 14 / 16.8 | 700 |
| Tabla contenido · Caption | Nunito | 14 / 16.8 | 400 |
| Label Bold / Regular | Nunito | 12 / 12 | 700 / 400 |
| Botón | Nunito | 14 / 20 | 700 |
| Título Marketplace | Platypi | 28 / 33.6 | 600 |

**Espacios:** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64.

**Radios:** 0 · 4 (xs) · 8 (sm) · 16 (md) · 24 (lg) · full.

**Íconos:** 372 en total, en SVG con `viewBox` de 24 y relleno `currentColor`. Están todos en `iconos-ds.json`. Ayuda: ícono `Info` de 16 px en `#A1A5AA`.

**Ilustraciones:** 42 en total. Las oficiales "A color" son `ilust-NN-color.svg` y viven en `https://qa.ataskate.com.mx/ilustraciones/`. También hay ilustraciones "Especiales" y "Más ilustraciones": `mundo-icono.png`, `success-message.png`, `error-message.png`, `inventario.png`.
- Las `propuesta-*` todavía son propuestas. No las uses como oficiales.
- **Nunca uses `avatar.png`**: es la foto de una persona real.

## Componentes

- **Botón:**
  - Píldora (radio 100), Nunito 700, gap 8, sin anillo de foco.
  - Tamaños: Medium de 36 px (padding 8/16, 14/20) y Large de 40 px (padding 8/16, 16 px).
  - Variantes:
    - Primary: `#5A5AFF` con texto blanco; hover `#0D166B`.
    - Secondary: fondo blanco, borde de 1 px `#5A5AFF` y texto `#5A5AFF`; hover `#F0F0FF`.
    - Tertiary: fondo blanco, sin borde y texto `#5A5AFF`; hover `#F0F0FF`.
    - Destructive: `#A82424`.
  - No existe estilo deshabilitado.
- **IconButton:** círculo blanco de 40, 36 o 28 px, padding 8 (4 en el chico), ícono `#5A5AFF` y hover `#F0F0FF`.
- **TextInput:**
  - Etiqueta 14/500 `#1D1E20` con padding 0 8 y 4 px hasta el campo.
  - Campo de 40 px en píldora, borde de 1 px `#D4D6D8`, fondo blanco, Nunito 16/400 `#2A2C2F`, letter-spacing 0.3 y padding 8/12.
  - Placeholder `#A1A5AA`.
  - Hover: borde `#5A5AFF`. Foco: borde `#0D166B`, sin sombra.
  - Error: borde `#A82424`.
  - Ayuda: 14/400, alto de línea 1.4, `#54575C`, padding 2/8.
  - Para moneda no hay prefijo "$": el valor se formatea, por ejemplo `$1,500.00`.
  - Textarea: radio 12, alto mínimo 80 y padding 10/12.
- **Select (SelectionInput):**
  - Como TextInput, con padding derecho de 40.
  - Chevron de trazo `M7 10L12 15L17 10`, 16 px, `#71767D`; gira 180° al abrir.
  - Menú: blanco, radio 16, sombra `0 4px 16px rgba(0,0,0,.12)`.
  - Opción de 40 px a 14/400; hover `#F0F0FF`; seleccionada `#E5E5FF`.
- **TabsButton (selector segmentado):**
  - 40 px de alto, radio 8 en los extremos.
  - Segmento: 16 px y padding 0 16.
  - Seleccionado: fondo `#F0F0FF`, borde `#ACACFF`, texto `#2A2C2F` a 600.
  - Sin seleccionar: blanco, borde `#D4D6D8`, texto `#54575C` a 400.
- **Tabs (subrayado):**
  - Alto 40, línea base de 1.2 px `#D4D6D8`.
  - Seleccionada: línea `#5A5AFF`, texto `#5A5AFF` a 600.
- **Breadcrumb:**
  - Enlace 14/600 `#54575C` (hover `#5A5AFF`).
  - Actual 14/600 `#1D1E20`.
  - Separador: chevron de 16 px `#D4D6D8`, con gap 4.
- **Dropzone:**
  - Fondo `#FAFAFA`, borde de 1 px punteado `#5A5AFF`, radio 16, padding 16, unos 74 px de alto.
  - Contenido: ícono de subir en un círculo blanco de 40 px, el texto "Arrastra elementos aquí o" a 16/400 y un botón Tertiary "Busca archivos" con ícono `Search`.
- **Alerta (info):**
  - Radio 8, padding 16, fondo `#EBF9FF`.
  - Ícono `Info` de 24 px en `#008FCC`.
  - Título 16/700 alto 24 en `#004461`; texto 16/400 en `#2A2C2F`.
  - Acción: botón transparente `#5A5AFF` a 14/700, de 36 px.
  - Cerrar: círculo de 36 px con fondo `rgba(255,255,255,.6)` e ícono `Close` de 20 px `#5A5AFF`.
  - No tiene lugar para ilustración.
- **Chip de estado (CardInventario):** 18 px de alto, padding 4, radio 4, 12/12 a 400.
- **Switch:**
  - Pista de 48×24 en píldora; encendida `#E5E5FF`, apagada `#FAFAFA`.
  - Perilla de 20 px; encendida `#5A5AFF`, apagada `#54575C`.
- **Checkbox:**
  - 20 px, radio 4, borde `#A1A5AA`.
  - Marcado: fondo `#E5E5FF`, borde `#ACACFF`, palomita `#0D166B`.
- **Radio:**
  - 20 px, borde `#D4D6D8`.
  - Seleccionado: borde `#2A2C2F` y punto de 12 px `#0D166B`.
- **FixedActionFooter:**
  - 68 px de alto, padding 16/24, fondo `#FAFAFF`, sombra `0 8px 32px rgba(0,0,0,.16)`.
  - Acciones a la derecha: Secondary "Cancelar" + Primary, con gap 12.
- **Formularios:** el DS no define un layout de formulario. La tarjeta que usan las demos es blanca, con borde de 1 px `#D4D6D8`, radio 16 y padding 24.
