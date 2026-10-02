/* Comentarios sobre los flujos, al estilo de los comentarios de un prototipo de Figma (no es parte del producto).
   Una pestaña "Comentarios" en el borde izquierdo activa el modo comentar: se hace clic en cualquier parte de la
   pantalla para dejar un pin con un comentario; los demás lo ven, responden y lo resuelven. Tecla C para entrar o salir.
   - Los comentarios se guardan en un servicio propio (Cloudflare Worker + D1, carpeta ../comentarios-api).
   - Cada pin se ancla a un elemento de la página y a su posición relativa dentro de él, para que siga en su lugar
     en otros anchos de pantalla. Si el elemento está en una pestaña oculta, el pin no se dibuja y la lista lo abre.
   - No hay cuentas: cada quien escribe su nombre una vez (se recuerda en su navegador) y solo puede borrar lo suyo.
   Es autónomo (marcado y estilos propios), igual que demo.js. */
(() => {
  const API = 'https://ataskate-comentarios.danielboeppler.workers.dev';
  const base = new URL('.', document.currentScript.src);   // …/pos/
  // los comentarios hechos en local no se mezclan con los del sitio publicado
  const ESPACIO = location.hostname === 'codaboeppler.github.io' ? 'prod' : 'dev';
  const ruta = location.pathname.replace(/index\.html$/, '').replace(/\/?$/, '/');
  const rel = ruta.startsWith(base.pathname) ? ruta.slice(base.pathname.length) : null;
  const enMora = new URLSearchParams(location.search).get('estado') === 'mora';
  const PAGINA = { '': 'v1', 'v2/': 'v2', 'v2-prendario/': enMora ? 'prendario-mora' : 'prendario', 'v2-marketplace/': 'marketplace' }[rel];
  if (!PAGINA) return;

  // ---------- quién soy (solo en este navegador) ----------
  const LS = 'ataskate-comentarios';
  let yo = {};
  try { yo = JSON.parse(localStorage.getItem(LS)) || {}; } catch (e) { yo = {}; }
  if (typeof yo.token !== 'string' || yo.token.length < 16) {
    yo.token = [...crypto.getRandomValues(new Uint8Array(24))].map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  if (!Array.isArray(yo.ids)) yo.ids = [];
  const guardarYo = () => { try { localStorage.setItem(LS, JSON.stringify(yo)); } catch (e) { /* sin almacenamiento: se pide el nombre cada vez */ } };
  guardarYo();

  // ---------- estado ----------
  let comentarios = [];       // tal como llegan del servicio: raíces (pines) y respuestas
  let modo = false;           // modo comentar activo
  let verResueltos = false;
  let abierto = null;         // id del hilo abierto
  let borrador = null;        // { ancla } mientras se escribe un comentario nuevo
  let listaAbierta = false;
  let sondeo = 0;

  const raices = () => comentarios.filter((c) => !c.hilo);
  const respuestas = (id) => comentarios.filter((c) => c.hilo === id);
  const abiertos = () => raices().filter((c) => !c.resuelto);

  // ---------- utilidades ----------
  const h = (tag, props, ...hijos) => {
    const e = document.createElement(tag);
    if (props) Object.keys(props).forEach((k) => {
      const v = props[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'class') e.className = v;
      else if (k === 'text') e.textContent = v;
      else if (k === 'html') e.innerHTML = v;                       // solo para los íconos constantes de este archivo
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    });
    hijos.flat().forEach((c) => { if (c !== null && c !== undefined && c !== false) e.append(c); });
    return e;
  };
  // íconos del design system (Close y EstadosSuccess), en currentColor
  const ICO_X = '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z" fill="currentColor"/></svg>';
  const ICO_OK = '<svg aria-hidden="true" width="20" height="20" viewBox="96 156 24 24" fill="none"><path d="M108 178C106.617 178 105.317 177.737 104.1 177.212C102.883 176.687 101.825 175.975 100.925 175.075C100.025 174.175 99.3127 173.117 98.788 171.9C98.2627 170.683 98 169.383 98 168C98 166.617 98.2627 165.317 98.788 164.1C99.3127 162.883 100.025 161.825 100.925 160.925C101.825 160.025 102.883 159.312 104.1 158.787C105.317 158.262 106.617 158 108 158C109.383 158 110.683 158.262 111.9 158.787C113.117 159.312 114.175 160.025 115.075 160.925C115.975 161.825 116.687 162.883 117.212 164.1C117.737 165.317 118 166.617 118 168C118 169.383 117.737 170.683 117.212 171.9C116.687 173.117 115.975 174.175 115.075 175.075C114.175 175.975 113.117 176.687 111.9 177.212C110.683 177.737 109.383 178 108 178ZM106.6 172.6L113.65 165.55L112.25 164.15L106.6 169.8L103.75 166.95L102.35 168.35L106.6 172.6Z" fill="currentColor"/></svg>';
  const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const hace = (ms) => {
    const s = Math.max(0, (Date.now() - ms) / 1000);
    if (s < 60) return 'ahora';
    if (s < 3600) return 'hace ' + Math.floor(s / 60) + ' min';
    if (s < 86400) return 'hace ' + Math.floor(s / 3600) + ' h';
    const d = new Date(ms);
    return d.getDate() + ' ' + MESES[d.getMonth()] + (d.getFullYear() !== new Date().getFullYear() ? ' ' + d.getFullYear() : '');
  };
  const iniciales = (nombre) => (nombre.match(/[\p{L}\p{N}]+/gu) || []).slice(0, 2).map((p) => [...p][0]).join('').toUpperCase() || '?';
  // color del avatar por autor, con los tonos claros del design system
  const TONOS = ['#ff98ef', '#d1ffd1', '#d0f6ff', '#e5e5ff', '#ffebba', '#ebf9ff'];
  const tono = (nombre) => TONOS[[...nombre].reduce((t, ch) => (t * 31 + ch.charCodeAt(0)) >>> 0, 7) % TONOS.length];
  const avatar = (nombre, clase) => h('span', { class: 'cm-avatar' + (clase ? ' ' + clase : ''), style: 'background:' + tono(nombre), 'aria-hidden': 'true', text: iniciales(nombre) });

  const api = async (camino, metodo, cuerpo) => {
    let r;
    try {
      r = await fetch(API + camino, { method: metodo || 'GET', headers: cuerpo ? { 'Content-Type': 'application/json' } : undefined, body: cuerpo ? JSON.stringify(cuerpo) : undefined });
    } catch (e) { throw new Error('No hay conexión con el servicio de comentarios.'); }
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || 'No se pudo completar la acción.');
    return d;
  };

  // ---------- anclas: elemento + posición relativa ----------
  const propio = (el) => !!(el && el.closest && el.closest('.cm-capa, .cm-pins, .cm-barra, .cm-lista, .demo-rail, .demo-menu'));
  const selectorDe = (el) => {
    const partes = [];
    let n = el;
    while (n && n.nodeType === 1 && n !== document.body && n !== document.documentElement) {
      if (n.id && document.querySelectorAll('#' + CSS.escape(n.id)).length === 1) { partes.unshift('#' + CSS.escape(n.id)); break; }
      const p = n.parentElement;
      if (!p) break;
      partes.unshift(n.tagName.toLowerCase() + ':nth-child(' + ([...p.children].indexOf(n) + 1) + ')');
      n = p;
    }
    if (!partes.length) return 'body';
    return (partes[0][0] === '#' ? '' : 'body > ') + partes.join(' > ');
  };
  const anclaEn = (x, y) => {
    let el = document.elementsFromPoint(x, y).find((e) => !propio(e)) || document.body;
    const svg = el.closest && el.closest('svg');
    if (svg) el = svg.parentElement || svg;                         // los trazos de un ícono no son un buen ancla
    if (el === document.documentElement) el = document.body;
    const r = el.getBoundingClientRect();
    const frac = (v, total) => (total > 0 ? Math.min(1, Math.max(0, v / total)) : 0);
    return {
      s: selectorDe(el).slice(0, 600),
      rx: frac(x - r.left, r.width), ry: frac(y - r.top, r.height), oy: Math.max(0, y - r.top),
      dx: frac(x + scrollX, document.documentElement.scrollWidth), dy: Math.max(0, y + scrollY),
      vw: innerWidth,
    };
  };
  const elementoDe = (a) => { try { return document.querySelector(a.s); } catch (e) { return null; } };
  // posición del pin en coordenadas del documento; null si su elemento está oculto (otra pestaña, fila cerrada)
  const ubicar = (a) => {
    const el = elementoDe(a);
    if (el) {
      if (!el.getClientRects().length) return null;
      const r = el.getBoundingClientRect();
      // en un contenedor alto (la página, una sección) la altura cambia con el contenido: ahí el pin guarda su distancia al borde superior
      const dy = r.height > 400 && typeof a.oy === 'number' ? Math.min(a.oy, r.height) : a.ry * r.height;
      return { x: r.left + scrollX + a.rx * r.width, y: r.top + scrollY + dy };
    }
    // el elemento ya no existe: queda donde se dejó, en proporción al ancho de la página
    return { x: a.dx * document.documentElement.scrollWidth, y: a.dy };
  };
  // abre las pestañas o filas que esconden el elemento (cada contenedor oculto con un control aria-controls)
  const revelar = (a) => {
    const el = elementoDe(a);
    if (!el) return;
    const cadena = [];
    for (let n = el; n && n !== document.body; n = n.parentElement) cadena.unshift(n);
    cadena.forEach((n) => {
      if (!n.id || n.getClientRects().length) return;
      const ctl = document.querySelector('[aria-controls="' + CSS.escape(n.id) + '"]');
      if (ctl && ctl.getAttribute('aria-selected') !== 'true' && ctl.getAttribute('aria-expanded') !== 'true') ctl.click();
    });
  };

  // ---------- estilos ----------
  const css = document.createElement('style');
  css.textContent = `
.cm-tab {
  box-sizing: border-box; width: 18px; margin: 0; padding: 8px 3px; border: 0; border-radius: 8px 0 0 8px;
  writing-mode: vertical-rl; transform: rotate(180deg);
  background: #e5e5ff; color: #0d166b; cursor: pointer; opacity: .8;
  font: 600 11px/12px 'Nunito', sans-serif; letter-spacing: .4px; white-space: nowrap;
  transition: opacity .15s, background .15s;
}
.cm-tab:hover, .cm-tab:focus-visible, .cm-tab[aria-pressed='true'] { opacity: 1; }
.cm-tab[aria-pressed='true'] { background: #0d166b; color: #fff; }
.cm-tab:focus-visible { outline: 2px solid #5a5aff; outline-offset: 2px; }
.cm-activo .demo-rail { z-index: 2003; }
.cm-activo .demo-menu { z-index: 2004; }
.cm-capa { position: fixed; inset: 0; z-index: 2000; cursor: crosshair; background: transparent; }
.cm-pins { position: absolute; left: 0; top: 0; width: 0; height: 0; z-index: 2001; font-family: 'Nunito', sans-serif; }
.cm-pin {
  position: absolute; box-sizing: border-box; width: 32px; height: 32px; margin: 0; padding: 3px; border: 0;
  border-radius: 50% 50% 50% 0; background: #fff; cursor: pointer; transform: translate(0, -100%);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .28); transition: transform .12s;
}
.cm-pin:hover { transform: translate(0, -100%) scale(1.08); transform-origin: 0 100%; }
.cm-pin:focus-visible { outline: 2px solid #5a5aff; outline-offset: 2px; }
.cm-pin[aria-expanded='true'] { background: #5a5aff; }
.cm-pin--resuelto { opacity: .6; }
.cm-pin--nuevo { background: #5a5aff; cursor: default; }
.cm-pin--nuevo .cm-avatar { background: #fff !important; color: #5a5aff; font-size: 16px; }
.cm-avatar {
  flex: none; display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box;
  width: 26px; height: 26px; border-radius: 50%; color: #0d166b; font: 700 11px/1 'Nunito', sans-serif; letter-spacing: .2px;
}
.cm-hilo {
  position: absolute; z-index: 1; box-sizing: border-box; width: 320px; max-height: min(480px, calc(100vh - 32px));
  display: flex; flex-direction: column; border-radius: 16px; background: #fff; box-shadow: 0 10px 60px 0 rgba(0, 0, 0, .25);
  color: #2a2c2f; font: 400 14px/1.4 'Nunito', sans-serif; text-align: left; cursor: default; overflow: hidden;
}
.cm-hilo__top { flex: none; display: flex; align-items: center; gap: 8px; padding: 8px 8px 8px 16px; border-bottom: 1px solid #e8e9ea; }
.cm-hilo__titulo { flex: 1 1 0; min-width: 0; margin: 0; font-size: 14px; line-height: 1.2; font-weight: 600; color: #1d1e20; }
.cm-ico { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; padding: 8px; border: 0; border-radius: 100px; background: #fff; color: #5a5aff; cursor: pointer; transition: background .15s; }
.cm-ico:hover { background: #f0f0ff; }
.cm-ico:focus-visible, .cm-btn:focus-visible, .cm-link:focus-visible { outline: 2px solid #5a5aff; outline-offset: 2px; }
.cm-ico[aria-pressed='true'] { color: #309c60; }
.cm-hilo__msgs { flex: 1 1 auto; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding: 12px 16px; scrollbar-width: thin; }
.cm-hilo__msgs:empty { display: none; }
.cm-msg { display: flex; gap: 8px; }
.cm-msg__cuerpo { flex: 1 1 0; min-width: 0; }
.cm-msg__cab { display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px 8px; }
.cm-msg__autor { font-size: 14px; line-height: 1.2; font-weight: 700; color: #1d1e20; overflow-wrap: anywhere; }
.cm-msg__hora { font-size: 12px; line-height: 1.2; color: #54575c; }
.cm-msg__texto { margin: 2px 0 0; font-size: 14px; line-height: 1.4; color: #2a2c2f; white-space: pre-wrap; overflow-wrap: anywhere; }
.cm-link { margin: 0; padding: 0; border: 0; background: none; color: #5a5aff; cursor: pointer; font: 700 12px/1.2 'Nunito', sans-serif; }
.cm-link:hover { color: #0d166b; }
.cm-form { flex: none; display: flex; flex-direction: column; gap: 8px; margin: 0; padding: 12px 16px 16px; border-top: 1px solid #e8e9ea; }
.cm-hilo__msgs:empty + .cm-form { border-top: 0; }
.cm-campo {
  box-sizing: border-box; width: 100%; margin: 0; padding: 8px 12px; border: 1px solid #d4d6d8; border-radius: 8px; background: #fff;
  color: #2a2c2f; font: 400 14px/1.4 'Nunito', sans-serif; transition: border-color .15s;
}
.cm-campo::placeholder { color: #71767d; }
.cm-campo:hover { border-color: #5a5aff; }
.cm-campo:focus { outline: 0; border-color: #0d166b; }
textarea.cm-campo { min-height: 64px; max-height: 160px; resize: vertical; }
.cm-form__pie { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.cm-form__quien { min-width: 0; font-size: 12px; line-height: 1.2; color: #54575c; overflow-wrap: anywhere; }
.cm-form__quien b { font-weight: 700; color: #2a2c2f; }
.cm-form__acciones { flex: none; display: flex; align-items: center; gap: 8px; }
.cm-btn {
  box-sizing: border-box; height: 36px; margin: 0; padding: 7px 16px; border: 1px solid transparent; border-radius: 100px; cursor: pointer;
  background: #5a5aff; color: #fff; font: 700 14px/20px 'Nunito', sans-serif; white-space: nowrap; transition: background .15s;
}
.cm-btn:hover { background: #0d166b; }
.cm-btn[disabled] { pointer-events: none; opacity: .6; }
.cm-btn--ter { background: #fff; color: #5a5aff; }
.cm-btn--ter:hover { background: #f0f0ff; }
.cm-error { margin: 0; font-size: 12px; line-height: 1.3; color: #a82424; }
.cm-error:empty { display: none; }
.cm-barra {
  position: fixed; left: 50%; bottom: 16px; z-index: 2003; transform: translateX(-50%); box-sizing: border-box; max-width: calc(100vw - 24px);
  display: flex; align-items: center; gap: 8px; padding: 8px 8px 8px 16px; border-radius: 100px; background: #fff;
  box-shadow: 0 10px 60px 0 rgba(0, 0, 0, .25); color: #2a2c2f; font: 400 14px/1.2 'Nunito', sans-serif;
}
.cm-barra__txt { min-width: 0; }
.cm-barra__txt b { font-weight: 700; color: #0d166b; }
.cm-lista {
  position: fixed; right: 16px; top: calc(var(--pos-header-h, 56px) + 8px); z-index: 2003; box-sizing: border-box; width: 320px;
  max-height: calc(100vh - var(--pos-header-h, 56px) - 96px); display: flex; flex-direction: column; border-radius: 16px; background: #fff;
  box-shadow: 0 10px 60px 0 rgba(0, 0, 0, .25); color: #2a2c2f; font: 400 14px/1.4 'Nunito', sans-serif; text-align: left; overflow: hidden;
}
.cm-lista__top { flex: none; display: flex; align-items: center; gap: 8px; padding: 8px 8px 8px 16px; border-bottom: 1px solid #e8e9ea; }
.cm-lista__filtro { flex: none; display: flex; align-items: center; gap: 8px; padding: 8px 16px; font-size: 12px; line-height: 1.2; color: #54575c; cursor: pointer; }
.cm-lista__filtro input { width: 16px; height: 16px; margin: 0; accent-color: #5a5aff; }
.cm-lista__items { flex: 1 1 auto; min-height: 0; overflow-y: auto; margin: 0; padding: 0 0 8px; list-style: none; scrollbar-width: thin; }
.cm-item { display: flex; gap: 8px; box-sizing: border-box; width: 100%; margin: 0; padding: 8px 16px; border: 0; background: none; cursor: pointer; text-align: left; font: inherit; color: inherit; transition: background .15s; }
.cm-item:hover, .cm-item:focus-visible { background: #f0f0ff; }
.cm-item:focus-visible { outline: 2px solid #5a5aff; outline-offset: -2px; }
.cm-item__txt { flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.cm-item__snip { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; overflow-wrap: anywhere; color: #2a2c2f; }
.cm-item__meta { font-size: 12px; line-height: 1.2; color: #54575c; }
.cm-vacio { margin: 0; padding: 8px 16px 16px; font-size: 14px; line-height: 1.4; color: #54575c; }
[hidden].cm-capa, [hidden].cm-pins, [hidden].cm-barra, [hidden].cm-lista { display: none; }
@media (max-width: 720px) {
  .cm-tab { width: 14px; padding: 8px 1px; font-size: 10px; }
  .cm-barra { left: 12px; right: 12px; bottom: 12px; transform: none; max-width: none; border-radius: 24px; }
  .cm-barra__txt { flex: 1 1 0; }
}
@media (max-width: 600px) {
  /* en teléfono el hilo y la lista suben desde abajo, a todo lo ancho */
  .cm-hilo { position: fixed; left: 8px !important; right: 8px; top: auto !important; bottom: 72px; width: auto; max-height: min(60vh, calc(100vh - 160px)); }
  .cm-lista { left: 8px; right: 8px; top: auto; bottom: 72px; width: auto; max-height: min(60vh, calc(100vh - 160px)); }
}
@media (prefers-reduced-motion: reduce) { .cm-tab, .cm-pin, .cm-ico, .cm-btn, .cm-item, .cm-campo { transition: none; } .cm-pin:hover { transform: translate(0, -100%); } }
@media print { .cm-tab, .cm-capa, .cm-pins, .cm-barra, .cm-lista { display: none !important; } }
`;
  document.head.appendChild(css);

  // ---------- piezas fijas ----------
  // la pestaña vive en el mismo riel que "Clic aquí para ver flujos" (lo crea demo.js; si no está, se crea aquí)
  let riel = document.querySelector('.demo-rail');
  if (!riel) {
    riel = h('div', { class: 'demo-rail', style: 'position:fixed;left:0;top:calc(var(--pos-header-h,56px) + 8px);z-index:29;display:flex;flex-direction:column;align-items:flex-start;gap:8px' });
    document.body.append(riel);
  }
  const tab = h('button', { type: 'button', class: 'cm-tab', id: 'cmTab', 'aria-pressed': 'false', onclick: () => activar(!modo) });
  riel.append(tab);

  const capa = h('div', { class: 'cm-capa', hidden: true, 'aria-hidden': 'true' });
  const pins = h('div', { class: 'cm-pins', hidden: true });
  const barraTxt = h('span', { class: 'cm-barra__txt' });
  const btnLista = h('button', { type: 'button', class: 'cm-btn cm-btn--ter', 'aria-expanded': 'false', 'aria-controls': 'cmLista', onclick: () => verLista(!listaAbierta) });
  const barra = h('div', { class: 'cm-barra', hidden: true, role: 'region', 'aria-label': 'Modo comentar' },
    barraTxt, btnLista, h('button', { type: 'button', class: 'cm-btn', text: 'Salir', onclick: () => activar(false) }));
  const listaItems = h('ul', { class: 'cm-lista__items' });
  const chkResueltos = h('input', { type: 'checkbox', onchange: (e) => { verResueltos = e.target.checked; if (abierto && !visibleEnLista(abierto)) cerrarHilo(); pintar(); } });
  const lista = h('div', { class: 'cm-lista', id: 'cmLista', hidden: true, role: 'region', 'aria-label': 'Lista de comentarios' },
    h('div', { class: 'cm-lista__top' }, h('h2', { class: 'cm-hilo__titulo', text: 'Comentarios' }),
      h('button', { type: 'button', class: 'cm-ico', 'aria-label': 'Cerrar la lista', html: ICO_X, onclick: () => verLista(false) })),
    h('label', { class: 'cm-lista__filtro' }, chkResueltos, 'Ver también los resueltos'),
    listaItems);
  document.body.append(capa, pins, lista, barra);

  // ---------- pintar ----------
  const visibleEnLista = (id) => { const c = comentarios.find((x) => x.id === id); return !!c && (verResueltos || !c.resuelto); };
  const pintarTab = () => {
    const n = abiertos().length;
    tab.textContent = 'Comentarios' + (n ? ' · ' + n : '');
    tab.setAttribute('aria-label', (modo ? 'Salir del modo comentar' : 'Comentar este flujo') + (n ? ' (' + n + (n === 1 ? ' comentario abierto)' : ' comentarios abiertos)') : ''));
  };
  let tarjeta = null;   // tarjeta del hilo abierto o del comentario nuevo
  const colocarTarjeta = (p) => {
    if (!tarjeta || !p) return;
    const ancho = 320, doc = document.documentElement;
    let x = p.x + 40;
    if (x + ancho > scrollX + doc.clientWidth - 8) x = p.x - ancho - 8;
    x = Math.max(scrollX + 8, x);
    const alto = tarjeta.offsetHeight || 200;
    let y = p.y - 36;
    y = Math.min(y, scrollY + innerHeight - alto - 80);   // deja libre la barra del modo comentar
    y = Math.max(scrollY + 8, y);
    tarjeta.style.left = x + 'px';
    tarjeta.style.top = y + 'px';
  };
  // los pines se actualizan en su sitio (no se recrean): así no pierden el foco al desplazar la página
  const pinDe = new Map();   // id del hilo → botón
  const pinNuevo = h('span', { class: 'cm-pin cm-pin--nuevo', 'aria-hidden': 'true' }, h('span', { class: 'cm-avatar', text: '+' }));
  const pintarPins = () => {
    const vistos = new Set();
    if (modo) raices().filter((c) => verResueltos || !c.resuelto).forEach((c) => {
      const p = ubicar(c.ancla);
      if (!p) return;
      vistos.add(c.id);
      let b = pinDe.get(c.id);
      if (!b) {
        const id = c.id;
        b = h('button', { type: 'button', class: 'cm-pin', 'data-id': id, onclick: (e) => { e.stopPropagation(); if (abierto === id) cerrarHilo(); else abrirHilo(id); } }, avatar(c.autor));
        pinDe.set(id, b);
        pins.prepend(b);
      }
      const n = respuestas(c.id).length;
      b.classList.toggle('cm-pin--resuelto', c.resuelto);
      b.style.left = p.x + 'px';
      b.style.top = p.y + 'px';
      b.setAttribute('aria-expanded', String(abierto === c.id));
      b.setAttribute('aria-label', 'Comentario de ' + c.autor + (n ? ' con ' + n + (n === 1 ? ' respuesta' : ' respuestas') : '') + (c.resuelto ? ', resuelto' : '') + ': ' + c.texto.slice(0, 80));
    });
    pinDe.forEach((b, id) => { if (!vistos.has(id)) { b.remove(); pinDe.delete(id); } });
    const pb = modo && borrador ? ubicar(borrador.ancla) : null;
    if (pb) { pinNuevo.style.left = pb.x + 'px'; pinNuevo.style.top = pb.y + 'px'; if (!pinNuevo.isConnected) pins.prepend(pinNuevo); }
    else pinNuevo.remove();
    if (tarjeta) {
      const raiz = abierto ? comentarios.find((c) => c.id === abierto) : null;
      colocarTarjeta(raiz ? ubicar(raiz.ancla) : pb);
    }
  };
  const pintarLista = () => {
    const visibles = raices().filter((c) => verResueltos || !c.resuelto).sort((a, b) => b.creado - a.creado);
    btnLista.textContent = 'Lista' + (visibles.length ? ' (' + visibles.length + ')' : '');
    barraTxt.replaceChildren(h('b', { text: 'Modo comentar' }), ' · haz clic para dejar un comentario');
    listaItems.replaceChildren(...visibles.map((c) => {
      const n = respuestas(c.id).length;
      const oculto = !ubicar(c.ancla);
      return h('li', null, h('button', { type: 'button', class: 'cm-item', onclick: () => irA(c.id) },
        avatar(c.autor),
        h('span', { class: 'cm-item__txt' },
          h('span', { class: 'cm-msg__cab' }, h('span', { class: 'cm-msg__autor', text: c.autor }), h('span', { class: 'cm-msg__hora', text: hace(c.creado) })),
          h('span', { class: 'cm-item__snip', text: c.texto }),
          h('span', { class: 'cm-item__meta', text: [n ? n + (n === 1 ? ' respuesta' : ' respuestas') : '', c.resuelto ? 'Resuelto' : '', oculto ? 'En otra pestaña de la ficha' : ''].filter(Boolean).join(' · ') }))));
    }));
    if (!visibles.length) listaItems.replaceChildren(h('li', null, h('p', { class: 'cm-vacio', text: raices().length ? 'No hay comentarios abiertos en este flujo.' : 'Aún no hay comentarios en este flujo. Haz clic en cualquier parte de la pantalla para dejar el primero.' })));
  };
  const pintar = () => { pintarTab(); pintarPins(); pintarLista(); if (abierto) pintarMensajes(); };

  // ---------- hilo y redacción ----------
  let msgs = null, errorTxt = null;
  const formulario = (placeholder, etiqueta, alEnviar, alCancelar) => {
    const nombre = h('input', { class: 'cm-campo', type: 'text', maxlength: '40', placeholder: 'Tu nombre', 'aria-label': 'Tu nombre', autocomplete: 'name', value: yo.nombre || '', hidden: !!yo.nombre });
    const texto = h('textarea', { class: 'cm-campo', maxlength: '2000', rows: '2', placeholder, 'aria-label': placeholder });
    const quien = h('span', { class: 'cm-form__quien' });
    const pintarQuien = () => quien.replaceChildren(...(yo.nombre && nombre.hidden
      ? ['Comentas como ', h('b', { text: yo.nombre }), ' · ', h('button', { type: 'button', class: 'cm-link', text: 'Cambiar', onclick: () => { nombre.hidden = false; pintarQuien(); nombre.focus(); nombre.select(); } })]
      : []));
    pintarQuien();
    errorTxt = h('p', { class: 'cm-error', role: 'alert' });
    const enviar = h('button', { type: 'submit', class: 'cm-btn', text: etiqueta });
    const f = h('form', { class: 'cm-form', novalidate: true, onsubmit: async (e) => {
      e.preventDefault();
      const n = nombre.value.trim(), t = texto.value.trim();
      if (!n) { errorTxt.textContent = 'Escribe tu nombre para comentar.'; nombre.hidden = false; nombre.focus(); return; }
      if (!t) { errorTxt.textContent = 'Escribe un comentario.'; texto.focus(); return; }
      errorTxt.textContent = '';
      yo.nombre = n.slice(0, 40); guardarYo();
      enviar.disabled = true;
      try { await alEnviar(yo.nombre, t); texto.value = ''; nombre.hidden = true; pintarQuien(); }
      catch (err) { errorTxt.textContent = err.message; }
      enviar.disabled = false;
    } }, nombre, texto, errorTxt,
      h('div', { class: 'cm-form__pie' }, quien,
        h('span', { class: 'cm-form__acciones' }, alCancelar ? h('button', { type: 'button', class: 'cm-btn cm-btn--ter', text: 'Cancelar', onclick: alCancelar }) : null, enviar)));
    // Cmd/Ctrl + Enter envía, como en Figma
    texto.addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); f.requestSubmit(); } });
    f.cmTexto = texto; f.cmNombre = nombre;
    return f;
  };
  const quitarTarjeta = () => { if (tarjeta) { tarjeta.remove(); tarjeta = null; msgs = null; } };
  const cerrarHilo = (devolverFoco) => {
    const id = abierto;
    abierto = null; borrador = null;
    quitarTarjeta();
    pintarPins();
    if (devolverFoco && id) { const p = pins.querySelector('.cm-pin[data-id="' + id + '"]'); if (p) p.focus(); }
  };
  const pintarMensajes = () => {
    if (!msgs || !abierto) return;
    const raiz = comentarios.find((c) => c.id === abierto);
    if (!raiz) { cerrarHilo(); return; }
    const abajo = msgs.scrollTop + msgs.clientHeight >= msgs.scrollHeight - 8;
    msgs.replaceChildren(...[raiz].concat(respuestas(raiz.id)).map((c) => h('div', { class: 'cm-msg' }, avatar(c.autor),
      h('div', { class: 'cm-msg__cuerpo' },
        h('div', { class: 'cm-msg__cab' }, h('span', { class: 'cm-msg__autor', text: c.autor }), h('span', { class: 'cm-msg__hora', text: hace(c.creado) }),
          yo.ids.includes(c.id) ? h('button', { type: 'button', class: 'cm-link', text: 'Borrar', 'aria-label': 'Borrar mi comentario', onclick: () => borrar(c) }) : null),
        h('p', { class: 'cm-msg__texto', text: c.texto })))));
    if (abajo) msgs.scrollTop = msgs.scrollHeight;
    const r = tarjeta.querySelector('.cm-resolver');
    if (r) { r.setAttribute('aria-pressed', String(raiz.resuelto)); r.setAttribute('aria-label', raiz.resuelto ? 'Reabrir el hilo' : 'Marcar como resuelto'); r.title = raiz.resuelto ? 'Reabrir' : 'Resolver'; }
  };
  const abrirHilo = (id) => {
    const raiz = comentarios.find((c) => c.id === id);
    if (!raiz) return;
    quitarTarjeta();
    abierto = id; borrador = null;
    msgs = h('div', { class: 'cm-hilo__msgs' });
    const form = formulario('Responder…', 'Responder', async (autor, texto) => {
      const d = await api('/comentarios', 'POST', { espacio: ESPACIO, pagina: PAGINA, hilo: id, autor, texto, token: yo.token });
      comentarios.push(d.comentario); yo.ids.push(d.comentario.id); guardarYo();
      pintar();
      msgs.scrollTop = msgs.scrollHeight;
    });
    tarjeta = h('div', { class: 'cm-hilo', role: 'dialog', 'aria-label': 'Comentario de ' + raiz.autor, onclick: (e) => e.stopPropagation() },
      h('div', { class: 'cm-hilo__top' }, h('h2', { class: 'cm-hilo__titulo', text: 'Comentario' }),
        h('button', { type: 'button', class: 'cm-ico cm-resolver', html: ICO_OK, onclick: () => resolver(raiz) }),
        h('button', { type: 'button', class: 'cm-ico', 'aria-label': 'Cerrar', html: ICO_X, onclick: () => cerrarHilo(true) })),
      msgs, form);
    pins.append(tarjeta);
    pintar();
    form.cmTexto.focus({ preventScroll: true });
  };
  const nuevoEn = (x, y) => {
    quitarTarjeta();
    abierto = null;
    borrador = { ancla: anclaEn(x, y) };
    const form = formulario('Escribe un comentario…', 'Comentar', async (autor, texto) => {
      const d = await api('/comentarios', 'POST', { espacio: ESPACIO, pagina: PAGINA, autor, texto, token: yo.token, ancla: borrador.ancla });
      comentarios.push(d.comentario); yo.ids.push(d.comentario.id); guardarYo();
      abrirHilo(d.comentario.id);
    }, () => cerrarHilo());
    tarjeta = h('div', { class: 'cm-hilo', role: 'dialog', 'aria-label': 'Comentario nuevo', onclick: (e) => e.stopPropagation() }, form);
    pins.append(tarjeta);
    pintarPins();
    (yo.nombre ? form.cmTexto : form.cmNombre).focus({ preventScroll: true });
  };
  const resolver = async (raiz) => {
    const valor = !raiz.resuelto;
    try {
      await api('/comentarios/' + raiz.id, 'PATCH', { resuelto: valor });
      raiz.resuelto = valor;
      if (valor && !verResueltos) cerrarHilo();
      pintar();
    } catch (err) { if (errorTxt) errorTxt.textContent = err.message; }
  };
  const borrar = async (c) => {
    if (!window.confirm(c.hilo ? '¿Borrar tu respuesta?' : '¿Borrar tu comentario y sus respuestas?')) return;
    try {
      await api('/comentarios/' + c.id, 'DELETE', { token: yo.token });
      comentarios = comentarios.filter((x) => x.id !== c.id && x.hilo !== c.id);
      yo.ids = yo.ids.filter((i) => i !== c.id); guardarYo();
      if (!c.hilo) cerrarHilo();
      pintar();
    } catch (err) { if (errorTxt) errorTxt.textContent = err.message; }
  };
  // desde la lista: muestra la pestaña donde está el pin, lo lleva a la vista y abre su hilo
  const irA = (id) => {
    const c = comentarios.find((x) => x.id === id);
    if (!c) return;
    revelar(c.ancla);
    const p = ubicar(c.ancla);
    if (p) window.scrollTo({ top: Math.max(0, p.y - innerHeight / 3), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    if (innerWidth <= 600) verLista(false);
    abrirHilo(id);
  };

  // ---------- modo comentar ----------
  const verLista = (ver) => {
    if (ver && innerWidth <= 600) cerrarHilo();   // en teléfono la lista y el hilo ocupan el mismo lugar
    listaAbierta = ver;
    lista.hidden = !ver;
    btnLista.setAttribute('aria-expanded', String(ver));
    if (ver) pintarLista();
  };
  const cargar = async () => {
    try {
      const d = await api('/comentarios?espacio=' + ESPACIO + '&pagina=' + PAGINA);
      comentarios = d.comentarios;
      pintar();
    } catch (err) { /* sin conexión: se queda con lo último que se cargó */ }
  };
  const activar = (si) => {
    modo = si;
    document.documentElement.classList.toggle('cm-activo', si);
    tab.setAttribute('aria-pressed', String(si));
    capa.hidden = pins.hidden = barra.hidden = !si;
    if (!si) { cerrarHilo(); verLista(false); }
    clearInterval(sondeo);
    if (si) {
      cargar();
      // mientras se comenta se traen los comentarios de los demás cada 20 s
      sondeo = setInterval(() => { if (!document.hidden) cargar(); }, 20000);
    }
    pintar();
  };
  capa.addEventListener('click', (e) => {
    // con un borrador con texto, un clic fuera no lo descarta: vuelve al campo
    if (tarjeta && !abierto) { const t = tarjeta.querySelector('textarea'); if (t && t.value.trim()) { t.focus(); return; } }
    if (tarjeta && abierto) { cerrarHilo(); return; }
    nuevoEn(e.clientX, e.clientY);
  });
  document.addEventListener('keydown', (e) => {
    const escribiendo = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName || '')) || e.target.isContentEditable;
    if (e.key === 'Escape' && modo) {
      if (tarjeta) cerrarHilo(true); else if (listaAbierta) verLista(false); else activar(false);
      return;
    }
    if ((e.key === 'c' || e.key === 'C') && !escribiendo && !e.metaKey && !e.ctrlKey && !e.altKey) activar(!modo);
  });
  // los pines siguen a sus elementos al cambiar el tamaño, al desplazar (elementos fijos) y al cambiar la página
  let cuadro = 0;
  const recolocar = () => { if (!modo || cuadro) return; cuadro = requestAnimationFrame(() => { cuadro = 0; pintarPins(); }); };
  addEventListener('resize', recolocar);
  addEventListener('scroll', recolocar, { passive: true });
  new ResizeObserver(recolocar).observe(document.body);
  document.addEventListener('visibilitychange', () => { if (modo && !document.hidden) cargar(); });

  pintar();
  cargar();   // al entrar a la ficha: para mostrar cuántos comentarios abiertos tiene
})();
