/* Selector de flujos (no es parte del producto): una pestaña discreta "Clic aquí para ver flujos" en el borde izquierdo,
   bajo el menú hamburguesa, que abre la lista de fichas para saltar de una a otra. Es autónomo: trae su propio marcado y estilos,
   así cada página solo carga este archivo. Los enlaces se arman a partir de la ubicación de este script (pos/),
   por lo que funcionan igual en local y publicados. */
(() => {
  const base = new URL('.', document.currentScript.src);   // …/pos/
  const DEMOS = [
    ['Inventario', 'POS · artículos a la venta (comercial)', 'inventario/'],
    ['Inventario prendario', 'POS · artículos empeñados', 'inventario/?tipo=prendario'],
    ['Inventario vacío', 'POS · sin artículos todavía', 'inventario/?vacio=1'],
    ['Comercial V1', 'POS · popup de apartados', ''],
    ['Comercial V2', 'POS · pestañas Compra | Apartado', 'v2/'],
    ['Prendario', 'POS · artículo en contrato vigente', 'v2-prendario/'],
    ['Prendario en mora', 'POS · contrato en mora vigente', 'v2-prendario/?estado=mora'],
    ['Marketplace', 'Ficha del cliente', 'v2-marketplace/'],
  ];
  // la ruta sin index.html, más los parámetros que cambian de ficha (mora, tipo de inventario, inventario vacío)
  const limpiar = (u) => u.pathname.replace(/index\.html$/, '').replace(/\/?$/, '/')
    + (u.searchParams.get('estado') === 'mora' ? '?estado=mora' : '')
    + (u.searchParams.get('tipo') === 'prendario' ? '?tipo=prendario' : '')
    + (u.searchParams.get('vacio') === '1' ? '?vacio=1' : '');
  const aqui = limpiar(new URL(location.href));

  const css = document.createElement('style');
  css.textContent = `
/* riel fijo en el borde izquierdo, bajo el header: aquí cuelgan esta pestaña y la de comentarios (comentarios.js) */
.demo-rail {
  position: fixed; left: 0; top: calc(var(--pos-header-h, 56px) + 8px); z-index: 29;
  display: flex; flex-direction: column; align-items: flex-start; gap: 8px;
}
.demo-tab {
  box-sizing: border-box; width: 18px; margin: 0; padding: 8px 3px; border: 0; border-radius: 8px 0 0 8px;
  writing-mode: vertical-rl; transform: rotate(180deg);
  background: #e5e5ff; color: #0d166b; cursor: pointer; opacity: .8;
  font: 600 11px/12px 'Nunito', sans-serif; letter-spacing: .4px; white-space: nowrap;
  transition: opacity .15s, background .15s;
}
.demo-tab:hover, .demo-tab:focus-visible, .demo-tab[aria-expanded='true'] { opacity: 1; }
.demo-tab[aria-expanded='true'] { background: #0d166b; color: #fff; }
.demo-tab:focus-visible { outline: 2px solid #5a5aff; outline-offset: 2px; }
.demo-menu {
  position: fixed; left: 26px; top: calc(var(--pos-header-h, 56px) + 8px); z-index: 45;
  box-sizing: border-box; width: min(288px, calc(100vw - 38px)); max-height: calc(100vh - var(--pos-header-h, 56px) - 24px); overflow-y: auto;
  margin: 0; padding: 8px 0; border-radius: 16px; background: #fff; box-shadow: 0 10px 60px 0 rgba(0, 0, 0, .25);
  font-family: 'Nunito', sans-serif; text-align: left;
}
.demo-menu[hidden] { display: none; }
.demo-menu__title { margin: 0; padding: 8px 16px 4px; font-size: 12px; line-height: 1.2; font-weight: 600; color: #54575c; }
.demo-menu a {
  display: flex; flex-direction: column; gap: 2px; padding: 8px 16px; text-decoration: none;
  font-size: 14px; line-height: 1.2; font-weight: 400; color: #2a2c2f; transition: background .15s;
}
.demo-menu a small { font-size: 12px; line-height: 1.2; font-weight: 400; color: #54575c; }
.demo-menu a:hover, .demo-menu a:focus-visible { background: #f0f0ff; color: #2a2c2f; }
.demo-menu a:focus-visible { outline: 2px solid #5a5aff; outline-offset: -2px; }
.demo-menu a[aria-current='page'] { font-weight: 700; color: #0d166b; }
.demo-menu a[aria-current='page'] small::after { content: ' · estás aquí'; color: #0d166b; }
@media (max-width: 720px) { .demo-tab { width: 14px; padding: 8px 1px; font-size: 10px; } .demo-menu { left: 20px; width: min(288px, calc(100vw - 32px)); } }
@media (prefers-reduced-motion: reduce) { .demo-tab, .demo-menu a { transition: none; } }
@media print { .demo-rail, .demo-menu { display: none; } }
`;
  document.head.appendChild(css);

  const tab = document.createElement('button');
  tab.type = 'button';
  tab.className = 'demo-tab';
  tab.id = 'demoTab';
  tab.textContent = 'Clic aquí para ver flujos';
  tab.setAttribute('aria-haspopup', 'menu');
  tab.setAttribute('aria-expanded', 'false');
  tab.setAttribute('aria-controls', 'demoMenu');

  const menu = document.createElement('div');
  menu.className = 'demo-menu';
  menu.id = 'demoMenu';
  menu.hidden = true;
  menu.setAttribute('role', 'menu');
  menu.setAttribute('aria-labelledby', 'demoTab');
  const titulo = document.createElement('p');
  titulo.className = 'demo-menu__title';
  titulo.setAttribute('role', 'presentation');
  titulo.textContent = 'Flujos';
  menu.appendChild(titulo);
  DEMOS.forEach(([nombre, detalle, ruta]) => {
    const u = new URL(ruta, base);
    const a = document.createElement('a');
    a.href = u.href;
    a.setAttribute('role', 'menuitem');
    if (limpiar(u) === aqui) a.setAttribute('aria-current', 'page');
    a.append(nombre);
    const s = document.createElement('small');
    s.textContent = detalle;
    a.appendChild(s);
    menu.appendChild(a);
  });
  const riel = document.createElement('div');
  riel.className = 'demo-rail';
  riel.append(tab);
  document.body.append(riel, menu);

  const links = () => [...menu.querySelectorAll('a')];
  const cerrar = (devolverFoco) => {
    if (menu.hidden) return;
    menu.hidden = true;
    tab.setAttribute('aria-expanded', 'false');
    if (devolverFoco) tab.focus();
  };
  const abrir = () => {
    menu.hidden = false;
    tab.setAttribute('aria-expanded', 'true');
    (menu.querySelector('[aria-current="page"]') || links()[0]).focus();
  };
  tab.addEventListener('click', () => (menu.hidden ? abrir() : cerrar(true)));
  document.addEventListener('click', (e) => { if (!menu.hidden && !tab.contains(e.target) && !menu.contains(e.target)) cerrar(); });
  menu.addEventListener('focusout', (e) => { if (!menu.hidden && e.relatedTarget && !menu.contains(e.relatedTarget) && e.relatedTarget !== tab) cerrar(); });
  document.addEventListener('keydown', (e) => {
    if (menu.hidden) return;
    if (e.key === 'Escape') { cerrar(true); return; }
    if ((e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Home' && e.key !== 'End') || !menu.contains(document.activeElement)) return;
    e.preventDefault();
    const it = links();
    const i = it.indexOf(document.activeElement);
    const a = { ArrowDown: (i + 1) % it.length, ArrowUp: (i - 1 + it.length) % it.length, Home: 0, End: it.length - 1 }[e.key];
    it[a].focus();
  });
})();
