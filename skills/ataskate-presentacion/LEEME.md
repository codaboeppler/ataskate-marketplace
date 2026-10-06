# Skill: presentaciones con el estilo Ataskate

Este skill le enseña a Claude a hacer presentaciones animadas en HTML que se ven como la del Design System de Ataskate. Incluye los muñequitos oficiales, los íconos y colores del DS, transiciones y pasos con flechas.

- Ejemplo publicado: https://codaboeppler.github.io/ataskate-marketplace/presentacion-ds/
- Contenido de la carpeta:
  - `SKILL.md`: las instrucciones para Claude.
  - `plantilla/`: la presentación de ejemplo, funcionando.
  - `referencias/`: las medidas exactas del DS y sus 372 íconos.
  - `scripts/`: capturas para revisar el resultado.

## Instalar

### Con Claude Code (terminal, app de escritorio o editor)

Copia la carpeta a tus skills personales:

```bash
git clone --depth 1 https://github.com/codaboeppler/ataskate-marketplace.git /tmp/ataskate-mkt && mkdir -p ~/.claude/skills && cp -R /tmp/ataskate-mkt/skills/ataskate-presentacion ~/.claude/skills/
```

Abre Claude Code y pídelo con tus palabras. Por ejemplo: *"Haz una presentación animada de 6 láminas sobre el cotizador en línea con el estilo Ataskate"*. También puedes escribir `/ataskate-presentacion`.

Si lo quieres solo para un proyecto, copia la carpeta a `.claude/skills/ataskate-presentacion/` dentro del repo y súbela con git. Así le llega a todo el equipo de ese proyecto.

### Con claude.ai o la app de Claude

1. Descarga el zip: https://codaboeppler.github.io/ataskate-marketplace/skills/ataskate-presentacion.zip
2. En Claude, ve a **Configuración → Personalizar → Skills** y sube el zip. Tu plan debe tener activada la ejecución de código.
3. Pide la presentación en un chat nuevo.

En un plan de equipo, quien ya lo subió puede compartirlo desde **Personalizar → Skills** con **Compartir** (a personas) o **Publicar en la organización** (para todos). Ninguno de los dos pasos requiere zip.

## Consejos para que salga igual

- Pide pocas láminas (5 a 9) y di qué quieres que se anime en cada una.
- Si comparas con otra marca, Claude la rotula como "recreación" y no usa logos.
- Antes de presentar, pídele que revise las capturas de cada lámina. El skill trae el script para hacerlo.
