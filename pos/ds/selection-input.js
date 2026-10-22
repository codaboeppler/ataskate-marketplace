/* SelectionInput del DS (src/design-system/SelectionInput) para el prototipo del POS.
   Convierte solo cada <select class="ds-select--standalone"> en el componente del DS: botón píldora + listbox.
   El <select> se queda (oculto) como fuente del valor: al elegir se le cambia el valor y se disparan "input" y "change",
   así que la lógica de cada pantalla no cambia. Si la pantalla repinta, los selects nuevos se convierten solos
   (MutationObserver) y, después de elegir, el foco regresa al botón nuevo del mismo select.

   Medidas del DS: botón 40 px, radio 100px, borde neutral300 → primary300 (hover) → primary400 (foco/abierto),
   chevron neutral500 que gira; panel blanco radio 16, sombra de dropdown, máx. 240 px, opciones de 40 px,
   hover primary50, elegida primary100. Teclado: ↓/↑ abren y recorren, Inicio/Fin, Enter o Espacio eligen,
   Esc cierra y regresa el foco, Tab y clic afuera cierran.
   Para dejar un select nativo a propósito: data-ds-nativo. */
(function () {
  'use strict';
  const CHEV = '<svg class="ds-selin__chev" viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true" focusable="false"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let seq = 0, pop = null;

  function cerrar(devolverFoco) {
    if (!pop) return;
    const p = pop; pop = null;
    p.ul.remove(); p.btn.setAttribute('aria-expanded', 'false'); p.btn.removeAttribute('aria-controls');
    if (devolverFoco && document.contains(p.btn)) p.btn.focus();
  }

  function etiquetaDe(sel) {
    if (sel.id) { const l = document.querySelector(`label[for="${CSS.escape(sel.id)}"]`); if (l) return l; }
    const campo = sel.closest('.ds-field');
    return campo ? campo.querySelector('.ds-label') : null;
  }

  function pintarBtn(sel, btn) {
    const o = sel.options[sel.selectedIndex];
    const vacio = !o || o.value === '';
    btn.querySelector('.ds-selin__txt').textContent = o ? o.text : '';
    btn.classList.toggle('is-vacio', vacio);
    btn.classList.toggle('is-error', sel.classList.contains('ds-input--error') || sel.getAttribute('aria-invalid') === 'true');
    btn.disabled = sel.disabled;
  }

  function abrir(sel, btn, enfoque) {
    cerrar(false);
    const ops = [...sel.options].filter((o) => !o.hidden && o.value !== '');   // el placeholder no es una opción (como en el DS)
    const ul = document.createElement('ul');
    ul.className = 'ds-selin__lista'; ul.setAttribute('role', 'listbox'); ul.id = btn.id + '-lista'; ul.tabIndex = -1;
    const lbl = btn.getAttribute('aria-labelledby'); if (lbl) ul.setAttribute('aria-labelledby', lbl.split(' ')[0]); else if (btn.getAttribute('aria-label')) ul.setAttribute('aria-label', btn.getAttribute('aria-label'));
    ul.innerHTML = ops.map((o, i) => `<li role="option" tabindex="-1" data-i="${i}" aria-selected="${o.selected && o.value !== ''}"${o.disabled ? ' aria-disabled="true"' : ''}${o.value === '' ? ' class="is-placeholder"' : ''}>${esc(o.text)}</li>`).join('');
    document.body.appendChild(ul);
    const colocar = () => {
      const r = btn.getBoundingClientRect(), h = Math.min(ul.scrollHeight, 240), abajo = window.innerHeight - r.bottom;
      ul.style.width = r.width + 'px'; ul.style.left = Math.max(8, Math.min(r.left, window.innerWidth - r.width - 8)) + 'px';
      ul.style.top = (abajo >= h + 8 || abajo >= r.top ? r.bottom + 4 : r.top - 4 - h) + 'px';
    };
    colocar();
    btn.setAttribute('aria-expanded', 'true'); btn.setAttribute('aria-controls', ul.id);
    pop = { sel, btn, ul, colocar };
    const lis = [...ul.children].filter((li) => li.getAttribute('aria-disabled') !== 'true');
    const ini = lis.find((li) => li.getAttribute('aria-selected') === 'true') || (enfoque === 'ultimo' ? lis[lis.length - 1] : lis.find((li) => !li.classList.contains('is-placeholder')) || lis[0]);
    // como SelectionDropdown del DS: al abrir, la opción elegida queda centrada en la lista
    if (ini) { ini.focus({ preventScroll: true }); ul.scrollTop = ini.offsetTop - (ul.clientHeight - ini.offsetHeight) / 2; }
    const elegir = (li) => {
      const o = ops[+li.dataset.i]; if (!o || o.disabled) return;
      const id = sel.id, cambio = sel.value !== o.value;
      cerrar(false);
      sel.value = o.value;
      if (document.contains(btn)) pintarBtn(sel, btn);
      if (cambio) { sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); }
      // si la pantalla repintó, el foco va al botón nuevo del mismo select
      setTimeout(() => {
        const s2 = id && document.getElementById(id);
        if (s2 && !s2._dsBtn) mejorar(s2);
        const nuevo = document.contains(btn) ? btn : (s2 && s2._dsBtn);
        if (nuevo && document.activeElement !== nuevo) nuevo.focus();
      }, 0);
    };
    ul.addEventListener('click', (e) => { const li = e.target.closest('[role="option"]'); if (li) elegir(li); });
    ul.addEventListener('mouseover', (e) => { const li = e.target.closest('[role="option"]'); if (li && li !== document.activeElement && li.getAttribute('aria-disabled') !== 'true') li.focus({ preventScroll: true }); });
    ul.addEventListener('keydown', (e) => {
      const i = lis.indexOf(document.activeElement);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); const n = lis[Math.min(lis.length - 1, Math.max(0, i + (e.key === 'ArrowDown' ? 1 : -1)))]; if (n) { n.focus({ preventScroll: true }); n.scrollIntoView({ block: 'nearest' }); } }
      else if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); const n = e.key === 'Home' ? lis[0] : lis[lis.length - 1]; if (n) n.focus(); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (i >= 0) elegir(lis[i]); }
      else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); cerrar(true); }
      else if (e.key === 'Tab') { e.preventDefault(); cerrar(true); }
    });
  }

  function mejorar(sel) {
    if (sel._dsBtn || sel.hasAttribute('data-ds-nativo') || sel.multiple) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ds-selin';
    btn.id = (sel.id || 'dsSel' + (++seq)) + '-ds';
    btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false');
    const lbl = etiquetaDe(sel);
    if (lbl) { if (!lbl.id) lbl.id = btn.id + '-l'; if (lbl.tagName === 'LABEL') lbl.htmlFor = btn.id; btn.setAttribute('aria-labelledby', lbl.id + ' ' + btn.id); }
    else if (sel.getAttribute('aria-label')) btn.setAttribute('aria-label', sel.getAttribute('aria-label'));
    if (sel.getAttribute('aria-describedby')) btn.setAttribute('aria-describedby', sel.getAttribute('aria-describedby'));
    btn.innerHTML = `<span class="ds-selin__txt"></span>${CHEV}`;
    sel.classList.add('ds-selin__nativo'); sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true');
    sel.after(btn); sel._dsBtn = btn;
    if (sel.parentElement) sel.parentElement.classList.add('ds-selin__host');
    pintarBtn(sel, btn);
    sel.addEventListener('change', () => pintarBtn(sel, btn));
    btn.addEventListener('click', () => { if (pop && pop.btn === btn) cerrar(true); else abrir(sel, btn); });
    btn.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); abrir(sel, btn, e.key === 'ArrowUp' ? 'ultimo' : 'primero'); } });
  }

  const todos = (raiz) => (raiz.querySelectorAll ? raiz.querySelectorAll('select.ds-select--standalone') : []).forEach(mejorar);
  const arrancar = () => {
    todos(document);
    new MutationObserver((ms) => {
      if (pop && !document.contains(pop.btn)) cerrar(false);
      ms.forEach((m) => m.addedNodes.forEach((n) => { if (n.nodeType !== 1) return; if (n.matches && n.matches('select.ds-select--standalone')) mejorar(n); else todos(n); }));
    }).observe(document.body, { childList: true, subtree: true });
  };
  // Esc con la lista abierta cierra solo la lista (los modales de las pantallas escuchan Esc en captura y se cerrarían)
  document.addEventListener('keydown', (e) => { if (pop && e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); cerrar(true); } }, true);
  document.addEventListener('mousedown', (e) => { if (pop && !pop.ul.contains(e.target) && !pop.btn.contains(e.target)) cerrar(false); });
  window.addEventListener('scroll', (e) => { if (pop && !pop.ul.contains(e.target)) pop.colocar(); }, true);
  window.addEventListener('resize', () => cerrar(false));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar); else arrancar();
  window.DSSelectionInput = { mejorar, todos, cerrar };
})();
