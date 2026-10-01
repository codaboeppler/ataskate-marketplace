/* Navbar del Operativo (Figma: Header · Version=Op, HU-CE-595-F): paneles de la caja ("Flujo de fondos") y de la tuerquita.
   Solo hay uno abierto a la vez; clic fuera o Esc lo cierran. El chip de su panel abierto se pinta activo con aria-expanded. */
(() => {
  const pares = [['posCaja', 'posCajaPanel'], ['posAjustes', 'posAjustesMenu']]
    .map(([b, p]) => [document.getElementById(b), document.getElementById(p)])
    .filter(([b, p]) => b && p);
  if (!pares.length) return;

  const cerrar = (devolverFoco) => pares.forEach(([b, p]) => {
    if (p.hidden) return;
    p.hidden = true;
    b.setAttribute('aria-expanded', 'false');
    if (devolverFoco) b.focus();
  });
  const abrir = (b, p) => {
    cerrar();
    // un toast todavía visible ocuparía la misma esquina y taparía el panel
    document.querySelectorAll('.ds-toast-region .ds-toast').forEach((t) => t.remove());
    p.hidden = false;
    b.setAttribute('aria-expanded', 'true');
    const primero = p.querySelector('button');
    if (primero) primero.focus();
  };
  pares.forEach(([b, p]) => {
    p.tabIndex = -1;
    b.addEventListener('click', () => (p.hidden ? abrir(b, p) : cerrar(true)));
    // las acciones de los paneles todavía no hacen nada: cierran el panel y devuelven el foco a su chip
    p.addEventListener('click', (e) => { if (e.target.closest('button')) cerrar(true); });
    // al salir del panel con Tab se cierra
    p.addEventListener('focusout', (e) => { if (!p.hidden && e.relatedTarget && !p.contains(e.relatedTarget) && e.relatedTarget !== b) cerrar(); });
  });
  document.addEventListener('click', (e) => { if (!pares.some(([b, p]) => b.contains(e.target) || p.contains(e.target))) cerrar(); });
  document.addEventListener('keydown', (e) => {
    const abierto = pares.find(([, p]) => !p.hidden);
    if (!abierto) return;
    if (e.key === 'Escape') { cerrar(true); return; }
    if (e.key === 'Tab' && abierto[1].contains(document.activeElement)) {
      const f = [...abierto[1].querySelectorAll('button')];
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); cerrar(true); return; }
      if (!e.shiftKey && document.activeElement === f[f.length - 1]) { cerrar(true); return; }
    }
    // flechas arriba / abajo recorren las opciones del menú de la tuerquita
    const p = abierto[1];
    if (p.getAttribute('role') !== 'menu' || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') || !p.contains(document.activeElement)) return;
    e.preventDefault();
    const it = [...p.querySelectorAll('[role="menuitem"]')];
    const i = it.indexOf(document.activeElement);
    // con el foco en el contenedor (i = -1): abajo va a la primera opción y arriba a la última
    it[i < 0 ? (e.key === 'ArrowDown' ? 0 : it.length - 1) : (i + (e.key === 'ArrowDown' ? 1 : -1) + it.length) % it.length].focus();
  });
  // si el chip deja de verse (pantalla angosta), su panel no se queda abierto
  addEventListener('resize', () => pares.forEach(([b, p]) => { if (!p.hidden && b.offsetParent === null) cerrar(); }));
})();
