/* Selector de flujos (no es parte del producto): una pestaña discreta "Clic aquí para ver flujos" en el borde izquierdo,
   bajo el menú hamburguesa, que abre la lista de fichas para saltar de una a otra. Es autónomo: trae su propio marcado y estilos,
   así cada página solo carga este archivo. Los enlaces se arman a partir de la ubicación de este script (pos/),
   por lo que funcionan igual en local y publicados. */
(() => {
  const base = new URL('.', document.currentScript.src);   // …/pos/
  const DEMOS = [
    ['Home Operativo', 'Operativo · inicio por rol, estados de tarjeta y reglas de caja', 'home/'],
    ['Home Operativo vacío', 'Operativo · todas las tarjetas sin datos', 'home/?escenario=vacio'],
    ['Home Operativo 3.0 (anterior)', 'POS · Inicio por widgets', 'home-3/'],
    ['Home Operativo 3.0 vacío (anterior)', 'POS · sucursal sin datos todavía', 'home-3/?vacio=1'],
    ['Inventario', 'POS · artículos a la venta (comercial)', 'inventario/'],
    ['Inventario prendario', 'POS · artículos empeñados', 'inventario/?tipo=prendario'],
    ['Inventario vacío', 'POS · sin artículos todavía', 'inventario/?vacio=1'],
    ['Cotizador de empeño', 'POS · contratos, artículos y evaluación (PawnQuoterV4)', 'cotizador/'],
    ['Cotizador: selección de plazos', 'POS · plazos, cotitulares y extender fecha', 'cotizador/?paso=2'],
    ['Cotizador: empeño de un auto', 'POS · ficha del vehículo, opciones de un toque y checklist de documentos', 'cotizador/?ejemplo=auto'],
    ['Comercial V1', 'POS · popup de apartados', ''],
    ['Comercial V2', 'POS · pestañas Compra | Apartado', 'v2/'],
    ['Prendario', 'POS · artículo en contrato vigente', 'v2-prendario/'],
    ['Prendario en mora', 'POS · contrato en mora vigente', 'v2-prendario/?estado=mora'],
    ['Marketplace', 'Ficha del cliente', 'v2-marketplace/'],
    ['Pasarela de pago', 'POS · cobro del carrito: tarjeta, transferencia, efectivo y eWallet', 'pasarela/'],
    ['Firmar contrato de empeño', 'POS · transacción registrada: firma digital del contrato y ticket de empeño', 'pasarela/?estado=recibo-empeno'],
    ['Clientes', 'Operativo · listado y perfil', 'clientes/'],
    ['Cliente nuevo', 'Operativo · alta de cliente', 'clientes/cliente-nuevo.html'],
    ['Carrito', 'Operativo · operaciones del cliente y resumen del cobro', 'home/?carrito=1'],
    ['Carrito desde el perfil', 'Operativo · refrendo, desempeño y cuota de apartado al carrito', 'clientes/#perfil/c1131'],
    ['Configura tu empresa', 'Administrativo · guía de configuración inicial', 'empresa/'],
    ['Configuración de contratos', 'Administrativo · datos de la empresa y diseño del contrato', 'empresa/#datos'],
    ['Plazos', 'Administrativo · plazos', 'plazos/'],
    ['Tabuladores', 'Administrativo · tabuladores por ubicación', 'tabuladores/'],
    ['Detalle de tabulador', 'Administrativo · tabulador de metales', 'tabuladores/detalle.html'],
    ['Generación de códigos', 'Administrativo · cola de atención e historial', 'codigos-acceso/'],
    ['Generación de códigos vacía', 'Administrativo · sin solicitudes', 'codigos-acceso/?escenario=vacio'],
    ['Generación de códigos cargando', 'Administrativo · carga lenta', 'codigos-acceso/?escenario=carga-lenta'],
    ['Registro por invitación', 'Acceso · código de invitación y alta de cuenta', 'registro-invitacion/'],
  ];
  // la ruta sin index.html, más los parámetros que cambian de ficha (mora, tipo de inventario, inventario vacío) y el #datos de contratos
  const limpiar = (u) => u.pathname.replace(/index\.html$/, '').replace(/\/?$/, '/')
    + (u.searchParams.get('estado') === 'mora' ? '?estado=mora' : '')
    + (u.searchParams.get('tipo') === 'prendario' ? '?tipo=prendario' : '')
    + (u.searchParams.get('vacio') === '1' ? '?vacio=1' : '')
    + (u.searchParams.get('vista') ? '?vista=' + u.searchParams.get('vista') : '')
    + (u.searchParams.get('paso') === '2' ? '?paso=2' : '')
    + (u.searchParams.get('escenario') ? '?escenario=' + u.searchParams.get('escenario') : '')
    + (/^#(datos|contratos?)(\/|$)/.test(u.hash) ? '#datos' : '');   // Configuración de contratos vive en empresa/#datos
  const aqui = limpiar(new URL(location.href));

  const css = document.createElement('style');
  css.textContent = `
/* riel fijo en el borde izquierdo, bajo el header: aquí cuelgan esta pestaña y la de comentarios (comentarios.js) */
.demo-rail {
  position: fixed; left: 0; top: calc(var(--pos-header-h, 56px) + 8px); z-index: 29;
  display: flex; flex-direction: column; align-items: flex-start; gap: 8px;
}
/* con el menú lateral fijo abierto (Home y Administrativo, más de 900 px) el riel se recorre al borde del menú para no quedar debajo */
@media (min-width: 901px) {
  .pos-menu-fijo:not(.is-menu-cerrado) .demo-rail { left: 200px; }
  :root[data-plataforma='admin'] .pos-menu-fijo:not(.is-menu-cerrado) .demo-rail { left: 244px; }
  .pos-menu-fijo:not(.is-menu-cerrado) .demo-menu { margin-left: 200px; }
  :root[data-plataforma='admin'] .pos-menu-fijo:not(.is-menu-cerrado) .demo-menu { margin-left: 244px; }
}
.demo-tab {
  box-sizing: border-box; width: 18px; margin: 0; padding: 8px 3px; border: 0; border-radius: 8px 0 0 8px;
  writing-mode: vertical-rl; transform: rotate(180deg);
  background: var(--ats-primary-100); color: var(--ats-primary-400); cursor: pointer; opacity: .8;
  font: 600 11px/12px 'Nunito', sans-serif; letter-spacing: .4px; white-space: nowrap;
  transition: opacity .15s, background .15s;
}
.demo-tab:hover, .demo-tab:focus-visible, .demo-tab[aria-expanded='true'] { opacity: 1; }
.demo-tab[aria-expanded='true'] { background: var(--ats-primary-400); color: var(--color-base-white); }
.demo-tab:focus-visible { outline: 2px solid var(--ats-primary-300); outline-offset: 2px; }
.demo-menu {
  position: fixed; left: 26px; top: calc(var(--pos-header-h, 56px) + 8px); z-index: 45;
  box-sizing: border-box; width: min(288px, calc(100vw - 38px)); max-height: calc(100vh - var(--pos-header-h, 56px) - 24px); overflow-y: auto;
  margin: 0; padding: 8px 0; border-radius: 16px; background: var(--color-base-white); box-shadow: var(--pos-shadow-popup);
  font-family: 'Nunito', sans-serif; text-align: left;
}
.demo-menu[hidden] { display: none; }
.demo-menu__title { margin: 0; padding: 8px 16px 4px; font-size: 12px; line-height: 1.2; font-weight: 600; color: var(--ats-neutral-600); }
.demo-menu a {
  display: flex; flex-direction: column; gap: 2px; padding: 8px 16px; text-decoration: none;
  font-size: 14px; line-height: 1.2; font-weight: 400; color: var(--ats-neutral-700); transition: background .15s;
}
.demo-menu a small { font-size: 12px; line-height: 1.2; font-weight: 400; color: var(--ats-neutral-600); }
.demo-menu a:hover, .demo-menu a:focus-visible { background: var(--ats-primary-50); color: var(--ats-neutral-700); }
.demo-menu a:focus-visible { outline: 2px solid var(--ats-primary-300); outline-offset: -2px; }
.demo-menu a[aria-current='page'] { font-weight: 700; color: var(--ats-primary-400); }
.demo-menu a[aria-current='page'] small::after { content: ' · estás aquí'; color: var(--ats-primary-400); }
@media (max-width: 720px) { .demo-tab { width: 14px; padding: 8px 1px; font-size: 10px; } .demo-menu { left: 20px; width: min(288px, calc(100vw - 32px)); } }
@media (prefers-reduced-motion: reduce) { .demo-tab, .demo-menu a { transition: none; } }
/* panel de controles propio de una maqueta (data-proto-panel): flota junto al riel, igual que el menú de flujos */
.demo-proto {
  position: fixed !important; left: 26px; top: calc(var(--pos-header-h, 56px) + 8px); z-index: 45;
  box-sizing: border-box; width: min(320px, calc(100vw - 38px)); max-height: calc(100vh - var(--pos-header-h, 56px) - 24px); overflow-y: auto;
  margin: 0; padding: 12px 16px 16px; border-radius: 16px; background: var(--color-base-white); box-shadow: var(--pos-shadow-popup);
  font-family: 'Nunito', sans-serif; text-align: left;
}
.demo-proto[hidden] { display: none !important; }
@media (min-width: 901px) {
  .pos-menu-fijo:not(.is-menu-cerrado) .demo-proto { margin-left: 200px; }
  :root[data-plataforma='admin'] .pos-menu-fijo:not(.is-menu-cerrado) .demo-proto { margin-left: 244px; }
}
@media (max-width: 720px) { .demo-proto { left: 20px; width: min(320px, calc(100vw - 32px)); } }
@media print { .demo-rail, .demo-menu, .demo-proto { display: none; } }
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

  /* Si la pantalla trae sus propios controles de maqueta (<… data-proto-panel="Prototipo">), van en otra pestaña del riel:
     la pestaña abre y cierra el panel, que flota junto al riel como el menú de flujos; Esc o un clic afuera lo cierran. */
  const proto = document.querySelector('[data-proto-panel]');
  if (proto) {
    const tab2 = document.createElement('button');
    tab2.type = 'button';
    tab2.className = 'demo-tab';
    tab2.id = 'demoProtoTab';
    tab2.textContent = proto.dataset.protoPanel || 'Prototipo';
    proto.id = proto.id || 'demoProto';
    tab2.setAttribute('aria-expanded', 'false');
    tab2.setAttribute('aria-controls', proto.id);
    proto.classList.add('demo-proto');
    proto.setAttribute('role', 'dialog');
    proto.setAttribute('aria-labelledby', 'demoProtoTab');
    proto.hidden = true;
    riel.append(tab2);
    const cerrarP = (foco) => { if (proto.hidden) return; proto.hidden = true; tab2.setAttribute('aria-expanded', 'false'); if (foco) tab2.focus(); };
    const abrirP = () => {
      cerrar();
      proto.hidden = false; tab2.setAttribute('aria-expanded', 'true');
      const f = proto.querySelector('select, input, button'); if (f) f.focus();
    };
    tab2.addEventListener('click', () => (proto.hidden ? abrirP() : cerrarP(true)));
    tab.addEventListener('click', () => cerrarP());
    document.addEventListener('click', (e) => { if (!proto.hidden && !tab2.contains(e.target) && !proto.contains(e.target) && !e.target.closest('[role="listbox"], [role="option"]')) cerrarP(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !proto.hidden) cerrarP(true); });
  }

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
