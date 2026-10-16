/* Carrito del Operativo (Figma "Carrito - Pasarela de pago": modal 2723:110668 / 2755:13739 / 2757:15524, buscador 2709:100555).
   Lo abre el ícono del carrito del header en cualquier página que cargue este archivo (y carrito.css).

   CONTRATO COMPARTIDO (otras páginas, como la pasarela, lo leen):
   localStorage "ats-carrito" = { cliente: null | { nuc, nombre, telefono? },
                                  items: [{ id, tipo, titulo, detalle, monto, contrato?, imagen? }] }
   tipo: refrendo | abono | extension | desempeno | apartado | abono-apartado | compra | empeno.
   window.atsCarrito = { leer, guardar, agregar, quitar, vaciar, setCliente, abrir, cerrar, total } y, tras cada cambio,
   un CustomEvent "ats-carrito" en window. Extras opcionales que solo usa este archivo: item.prestamo (saldo que reduce un abono),
   item.dias (días de extensión) y atsCarrito.agregarDe(cliente, item) (no mezcla clientes).

   Cómo se agrupa: abono y extensión cuelgan del refrendo con el mismo contrato; abono-apartado, del apartado con el mismo contrato.
   IVA: el monto ya lo trae; refrendo y cuota de apartado desglosan 16 % (neto = monto / 1.16). total() = suma de montos. */
(() => {
  if (window.atsCarrito) return;
  const KEY = 'ats-carrito';
  const base = new URL('.', document.currentScript.src);          // …/pos/
  const A = (f) => new URL('assets/carrito/' + f, base).href;
  const PASARELA = new URL('pasarela/', base).href;
  const PRINCIPAL = ['refrendo', 'desempeno', 'apartado', 'compra', 'empeno'];
  const PADRE_DE = { abono: 'refrendo', extension: 'refrendo', 'abono-apartado': 'apartado' };
  const CON_IVA = ['refrendo', 'apartado'];

  /* ---------- datos ---------- */
  const vacio = () => ({ cliente: null, items: [] });
  const leer = () => {
    try {
      const c = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (c && Array.isArray(c.items)) return { cliente: c.cliente || null, items: c.items.filter((i) => i && i.id) };
    } catch (e) { /* almacenamiento bloqueado o JSON roto */ }
    return vacio();
  };
  const avisar = (c) => dispatchEvent(new CustomEvent('ats-carrito', { detail: c }));
  const guardar = (c) => {
    const limpio = { cliente: (c && c.cliente) || null, items: (c && Array.isArray(c.items)) ? c.items : [] };
    try { localStorage.setItem(KEY, JSON.stringify(limpio)); } catch (e) { /* sin almacenamiento: solo esta vista */ memoria = limpio; }
    avisar(limpio);
    return limpio;
  };
  let memoria = null;
  const leerTodo = () => memoria || leer();
  const nuevoId = (tipo) => (tipo || 'item') + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const agregar = (item) => {
    const c = leerTodo();
    const it = { ...item, id: item.id || nuevoId(item.tipo), monto: Math.round(Number(item.monto || 0) * 100) / 100 };
    c.items = c.items.filter((x) => x.id !== it.id).concat(it);
    guardar(c);
    return it.id;
  };
  // quitar una operación principal también quita sus abonos / extensión
  const quitar = (id) => {
    const c = leerTodo();
    const it = c.items.find((x) => x.id === id);
    if (!it) return;
    const hijos = PRINCIPAL.includes(it.tipo) ? c.items.filter((x) => PADRE_DE[x.tipo] === it.tipo && x.contrato && x.contrato === it.contrato).map((x) => x.id) : [];
    c.items = c.items.filter((x) => x.id !== id && !hijos.includes(x.id));
    guardar(c);
  };
  const vaciar = () => guardar(vacio());
  const setCliente = (cli) => { const c = leerTodo(); c.cliente = cli ? { ...cli, nuc: Number(cli.nuc) } : null; guardar(c); };
  const total = (items) => Math.round((items || leerTodo().items).reduce((s, x) => s + (Number(x.monto) || 0), 0) * 100) / 100;
  // agrega a nombre de un cliente; si el carrito ya es de otro cliente con artículos, no lo mezcla
  const agregarDe = (cli, item) => {
    const c = leerTodo();
    if (cli && c.cliente && Number(c.cliente.nuc) !== Number(cli.nuc) && c.items.length) {
      aviso('El carrito es de ' + c.cliente.nombre, 'Termina su cobro o vacía el carrito antes de agregar operaciones de ' + cli.nombre + '.', 'warning');
      return null;
    }
    if (cli) setCliente(cli);
    return agregar(item);
  };

  /* ---------- utilidades ---------- */
  const mx = (n) => '$' + (Number(n) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const iva = (x) => (CON_IVA.includes(x.tipo) ? Math.round((x.monto - x.monto / 1.16) * 100) / 100 : 0);
  const iniciales = (n) => String(n || '').split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');
  const PLUS = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M11 13H5V11H11V5H13V11H19V13H13V19H11V13Z" fill="currentColor"/></svg>';
  const SUB_ICO = { abono: 'abono.svg', 'abono-apartado': 'abono.svg', extension: 'extension.svg' };

  // grupos: cada operación principal con sus abonos / extensión; lo que no tiene padre va solo
  const grupos = (items) => {
    const gs = [];
    items.forEach((x) => { if (PRINCIPAL.includes(x.tipo)) gs.push({ p: x, subs: [] }); });
    items.forEach((x) => {
      if (PRINCIPAL.includes(x.tipo)) return;
      const g = gs.find((g) => g.p.tipo === PADRE_DE[x.tipo] && g.p.contrato && g.p.contrato === x.contrato);
      if (g) g.subs.push(x); else gs.push({ p: x, subs: [] });
    });
    return gs;
  };

  /* ---------- toast propio (para páginas sin el suyo) ---------- */
  function aviso(titulo, texto, tono) {
    let reg = document.getElementById('posToasts') || document.querySelector('.ds-toast-region');
    if (!reg) { reg = document.createElement('div'); reg.className = 'ds-toast-region'; reg.setAttribute('role', 'region'); reg.setAttribute('aria-live', 'polite'); document.body.append(reg); }
    const t = document.createElement('div');
    t.className = 'ds-toast ds-toast--' + (tono || 'success');
    t.setAttribute('role', 'status');
    t.innerHTML = '<div class="ds-toast__body-wrap"><p class="ds-toast__title"></p><p class="ds-toast__body"></p></div><button type="button" class="ds-toast__close" aria-label="Cerrar">×</button>';
    t.querySelector('.ds-toast__title').textContent = titulo;
    t.querySelector('.ds-toast__body').textContent = texto || '';
    t.querySelector('.ds-toast__close').addEventListener('click', () => t.remove());
    reg.prepend(t);
    setTimeout(() => t.remove(), 5000);
  }

  /* ---------- clientes para "Vincula un cliente": la lista de Clientes y los creados en Cliente nuevo ---------- */
  let clientes = null;
  const cargarClientes = () => {
    if (clientes) return Promise.resolve(clientes);
    const map = (c) => ({ nuc: c.nuc, nombre: [c.name, c.last].filter(Boolean).join(' '), telefono: c.phone, email: c.email });
    return fetch(new URL('clientes/perfil-datos.js', base))
      .then((r) => (r.ok ? r.text() : ''))
      // se evalúa dentro de una función para no chocar con las constantes globales de la página
      .then((src) => (src ? new Function(src + '\n;return { lista: CLIENTES, creados: getCreatedClients() };')() : { lista: [], creados: [] }))
      .catch(() => ({ lista: [], creados: [] }))
      .then((d) => (clientes = [...d.creados, ...d.lista].map(map)));
  };
  const telFmt = (p) => { const d = String(p || '').replace(/\D/g, ''); return d.length === 10 ? d.slice(0, 2) + ' ' + d.slice(2, 6) + ' ' + d.slice(6) : (p || ''); };

  /* ---------- vistas: carrito chico (panel 399 bajo el header, Component 163…185) y grande (modal 1112) ----------
     Las dos pintan el mismo estado; solo una está abierta a la vez. "dlg" apunta a la vista abierta. */
  const FIJO = 'ats-carrito-fijo';
  const leerFijo = () => { try { return localStorage.getItem(FIJO) === '1'; } catch (e) { return false; } };
  const st = { auto: false, vista: null, fijo: leerFijo(), fuera: new Set(), form: null, menu: null, q: '', lista: false, activo: -1, origen: null };
  let ov, md, pn, dlg;
  const construir = () => {
    if (ov) return;
    ov = document.createElement('div');
    ov.className = 'ds-modal-overlay crt-overlay';
    ov.hidden = true;
    ov.innerHTML = '<div class="ds-modal crt" role="dialog" aria-modal="true" aria-labelledby="crtTitulo" tabindex="-1"></div>';
    md = ov.firstElementChild;
    pn = document.createElement('div');
    pn.className = 'crt-chico';
    pn.hidden = true;
    pn.tabIndex = -1;
    pn.setAttribute('role', 'dialog');
    pn.setAttribute('aria-labelledby', 'crtTitulo');
    document.body.append(ov, pn);
    ov.addEventListener('mousedown', (e) => { if (e.target === ov) cerrar(); });
    [md, pn].forEach((r) => {
      r.addEventListener('click', clic);
      r.addEventListener('input', escribir);
      r.addEventListener('keydown', teclas);
      r.addEventListener('submit', (e) => { e.preventDefault(); confirmarForm(); });
      // al desplazar la lista, el menú flotante se cierra (si no, quedaría suelto)
      r.addEventListener('scroll', (e) => { if (st.menu && !(e.target.closest && e.target.closest('.crt-menu'))) { st.menu = null; pintar(); } }, true);
    });
    // el chico se cierra con un clic afuera, salvo que esté fijado (pin)
    document.addEventListener('mousedown', (e) => {
      if (st.vista !== 'chico' || st.fijo || pn.contains(e.target)) return;
      const cart = document.getElementById('posCart');
      if (cart && cart.contains(e.target)) return;
      if (e.target.closest && e.target.closest('.ds-toast-region, .demo-riel, .cm-pins, .cm-lista, .cm-barra')) return;
      cerrar(false);
    });
  };

  const htmlSub = (s) => {
    const cap = s.tipo === 'extension' ? s.detalle : s.detalle;
    const m = st.menu === s.id;
    return '<div class="crt-sub"><span class="crt-sub__ico" aria-hidden="true"><img src="' + A(SUB_ICO[s.tipo] || 'abono.svg') + '" alt="" width="20" height="20"></span>'
      + '<div class="crt-sub__txt"><div class="crt-sub__row"><span>' + esc(s.titulo) + '</span><span>' + mx(s.monto) + '</span></div>'
      + (cap ? '<span class="crt-sub__cap">' + esc(cap) + '</span>' : '') + '</div>'
      + menuHtml(s, m) + '</div>';
  };
  // opciones del ⋮ (Figma 2720:103189: Extender · Ver contrato · Revertir a desempeño · Eliminar)
  const opciones = (x, g) => {
    const o = [];
    if (!PRINCIPAL.includes(x.tipo)) return [['editar', 'Editar'], ['quitar', 'Eliminar']];
    const tiene = (t) => g && g.subs.some((s) => s.tipo === t);
    if (x.tipo === 'refrendo' && x.contrato) {
      if (!tiene('abono')) o.push(['form', 'Abono a capital', 'abono']);
      if (!tiene('extension')) o.push(['form', 'Extender', 'extension']);
      if (x.prestamo) o.push(['revertir', 'Revertir a desempeño']);
    }
    if (x.tipo === 'apartado' && x.contrato && !tiene('abono-apartado')) o.push(['form', 'Abono a capital', 'abono-apartado']);
    o.push(['quitar', 'Eliminar']);
    return o;
  };
  const menuHtml = (x, abierto, g) => '<div class="crt-more"><button type="button" class="ds-btn ds-btn--tertiary crt-ib" data-a="menu" data-id="' + esc(x.id) + '" aria-haspopup="menu" aria-expanded="' + abierto + '" aria-label="Opciones: ' + esc(x.titulo) + '"><img src="' + A('more-vert.svg') + '" alt="" width="20" height="20"></button>'
    + (abierto ? '<div class="crt-menu" role="menu">' + opciones(x, g).map(([a, l, t]) => '<button type="button" role="menuitem" class="' + (a === 'quitar' ? 'crt-menu__del' : '') + '" data-a="' + a + '" data-id="' + esc(g && a === 'form' ? g.p.id : x.id) + '"' + (t ? ' data-t="' + t + '"' : '') + '>' + l + '</button>').join('') + '</div>' : '') + '</div>';

  const htmlForm = (g) => {
    const f = st.form;
    if (!f || f.gid !== g.p.id) return '';
    const ext = f.tipo === 'extension';
    const inp = '<input id="crtFormIn" inputmode="' + (ext ? 'numeric' : 'decimal') + '" autocomplete="off" value="' + esc(f.valor) + '"' + (f.error ? ' aria-invalid="true" aria-describedby="crtFormMsg"' : '') + '>';
    const campo = (lab) => '<div class="ds-field"><label class="ds-label" for="crtFormIn">' + lab + '</label><div class="ds-field-wrap' + (f.error ? ' ds-field-wrap--error' : '') + '">' + (ext ? '' : '<span aria-hidden="true">$</span>') + inp + '</div></div>';
    return '<form class="crt-form' + (ext ? '' : ' crt-form--uno') + '" novalidate aria-label="' + (ext ? 'Extender ' : 'Abono a capital de ') + esc(g.p.titulo) + '">'
      + (ext ? campo('Días de extensión') + '<div class="crt-form__cost"><span class="ds-label">Total del costo</span><b id="crtFormCost">' + costoTxt(g.p) + '</b></div>' : campo('Abono a capital'))
      + (f.error ? '<p class="ds-helper ds-helper--error" id="crtFormMsg">' + esc(f.error) + '</p>' : '')
      + '<div class="crt-form__btns"><button type="button" class="ds-btn ds-btn--link ds-btn--sm" data-a="cancelar">Cancelar</button><button type="submit" class="ds-btn ds-btn--secondary ds-btn--sm">Aplicar</button></div></form>';
  };
  const costoDia = (p) => p.monto / 60;            // Figma: refrendo $1,000 → 3 días = $50.00
  const valorNum = () => Number(String((st.form && st.form.valor) || '').replace(/[^0-9.]/g, ''));
  const costoTxt = (p) => {
    const v = valorNum();
    if (st.form.tipo === 'extension') return v >= 1 ? mx(Math.round(costoDia(p) * Math.floor(v) * 100) / 100) : '-';
    return p.prestamo ? mx(Math.max(0, p.prestamo - (v || 0))) : mx(v || 0);
  };

  const htmlGrupo = (g) => {
    const p = g.p, dentro = !st.fuera.has(p.id);
    const img = p.imagen ? '<img src="' + esc(p.imagen) + '" alt="" width="96" height="96">' : '<span class="crt-ini" aria-hidden="true">' + esc(iniciales(p.titulo)) + '</span>';
    const tiene = (t) => g.subs.some((s) => s.tipo === t);
    const acts = [];
    if (p.tipo === 'refrendo' && p.contrato) {
      if (!tiene('extension')) acts.push(['extension', 'Extender']);
      if (!tiene('abono')) acts.push(['abono', 'Abonar']);
    }
    if (p.tipo === 'apartado' && p.contrato && !tiene('abono-apartado')) acts.push(['abono-apartado', 'Abonar']);
    const formAbierto = st.form && st.form.gid === p.id;
    return '<article class="crt-grp" aria-label="' + esc(p.titulo + ' ' + mx(p.monto)) + '">'
      + '<label class="ds-check"><input type="checkbox" data-a="sel" data-id="' + esc(p.id) + '" ' + (dentro ? 'checked' : '') + ' aria-label="Cobrar ' + esc(p.titulo) + '"><span class="ds-check__wrap"><span class="ds-check__box"></span></span></label>'
      + '<div class="crt-grp__img">' + img + '</div>'
      + '<div class="crt-grp__mid"><div class="crt-grp__top"><h3>' + esc(p.titulo) + '</h3><span class="crt-amt">' + mx(p.monto) + '</span>' + menuHtml(p, st.menu === p.id, g) + '</div>'
      + (p.contrato ? '<p class="crt-grp__det">No. contrato: ' + esc(p.contrato) + '</p>' : '')
      + (p.detalle ? '<p class="crt-grp__det' + (p.contrato ? ' crt-grp__det--b' : '') + '" title="' + esc(p.detalle) + '">' + esc(p.detalle) + '</p>' : '')
      + g.subs.map(htmlSub).join('')
      + htmlForm(g)
      + (acts.length && !formAbierto ? '<div class="crt-acts">' + acts.map(([t, l]) => '<button type="button" class="ds-btn ds-btn--link" data-a="form" data-t="' + t + '" data-id="' + esc(p.id) + '">' + PLUS + l + '</button>').join('') + '</div>' : '')
      + '</div></article>';
  };

  const htmlCliente = (c) => {
    if (c.cliente) {
      const k = c.cliente;
      const av = '<span class="ds-avatar" aria-hidden="true">' + esc(iniciales(k.nombre)) + '</span>';   // sin fotos de personas: Avatar del DS con iniciales
      return '<div class="crt-cli"><div class="crt-cli__chip">' + av + '<span class="crt-cli__name"><b>' + esc(k.nombre) + '</b><small>NUC ' + esc(k.nuc) + (k.telefono ? ' · Tel: ' + esc(telFmt(k.telefono)) : '') + '</small></span></div>'
        + '<button type="button" class="ds-btn ds-btn--tertiary crt-ib" data-a="desvincular" aria-label="Quitar a ' + esc(k.nombre) + ' del carrito"><img src="' + A('close.svg') + '" alt="" width="20" height="20"></button></div>';
    }
    return '<div class="crt-cli"><div class="crt-find"><div class="ds-field-wrap"><input id="crtBuscar" type="text" role="combobox" aria-autocomplete="list" aria-expanded="' + st.lista + '" aria-controls="crtLista" placeholder="Vincula un cliente" aria-label="Vincula un cliente: busca por nombre, NUC o teléfono" autocomplete="off" value="' + esc(st.q) + '">'
      + '<span class="crt-find__ico" aria-hidden="true"><img src="' + A('person-search.svg') + '" alt="" width="24" height="24"></span></div>'
      + '<ul class="crt-list" id="crtLista" role="listbox" aria-label="Clientes"' + (st.lista ? '' : ' hidden') + '></ul></div></div>';
  };

  const htmlResumen = (c, sel) => {
    const gs = grupos(sel);
    const fila = (x, sub) => '<div class="crt-tr"><span>' + (sub ? '<img class="crt-tr__sub" src="' + A('sub.svg') + '" alt="" width="12" height="12">' : '') + '<span class="crt-tr__t">' + esc(sub ? x.titulo : x.titulo + (x.contrato && x.tipo !== 'apartado' ? ' ' + x.contrato : '')) + '</span></span><span>' + mx(x.monto - iva(x)) + '</span><span>' + mx(iva(x)) + '</span></div>';
    const tIva = sel.reduce((s, x) => s + iva(x), 0), tot = total(sel);
    const n = sel.length, fuera = c.items.length - n;
    return htmlCliente(c) + '<hr class="crt-sep">'
      + '<div class="crt-tab">' + (n ? '<div class="crt-tab__box"><div class="crt-tr crt-tr--h"><span>Artículos</span><span>Neto</span><span>IVA</span></div>'
        + gs.map((g) => '<div class="crt-tab__grp">' + fila(g.p) + g.subs.map((s) => fila(s, true)).join('') + '</div>').join('')
        + '<hr class="crt-sep"><div class="crt-tr crt-tr--sum"><span>Subtotal</span><span>' + mx(tot - tIva) + '</span></div>'
        + '<div class="crt-tr crt-tr--sum"><span>IVA</span><span>' + mx(tIva) + '</span></div>'
        + '<div class="crt-tr crt-tr--sum crt-tr--tot"><span>Total</span><span>' + mx(tot) + '</span></div></div>' : '') + '</div>'
      + '<hr class="crt-sep">'
      + (fuera > 0 && n ? '<p class="crt-note">' + fuera + (fuera === 1 ? ' operación sin seleccionar se quita' : ' operaciones sin seleccionar se quitan') + ' del carrito al comenzar el pago.</p>' : '')
      + (!c.cliente && n ? '<p class="crt-note">Vincula un cliente para comenzar el pago.</p>' : '')
      + '<button type="button" class="ds-btn ds-btn--primary ds-btn--lg" data-a="pagar" ' + (n && c.cliente ? '' : 'disabled') + '>Comenzar proceso de pago</button>';
  };

  // pin, expandir / contraer y vaciar (Figma "Component 7" del encabezado)
  const herramientas = (c, grande) => '<div class="crt__tools">'
    + '<button type="button" class="ds-btn ds-btn--tertiary crt-ib" data-a="fijar" aria-pressed="' + st.fijo + '" aria-label="' + (st.fijo ? 'Desfijar el carrito' : 'Fijar el carrito abierto') + '" title="' + (st.fijo ? 'Desfijar' : 'Fijar') + '"><img src="' + A('pin.svg') + '" alt="" width="20" height="20"></button>'
    + '<button type="button" class="ds-btn ds-btn--tertiary crt-ib" data-a="' + (grande ? 'contraer' : 'expandir') + '" aria-label="' + (grande ? 'Ver el carrito chico' : 'Expandir el carrito') + '" title="' + (grande ? 'Contraer' : 'Expandir') + '"><img src="' + A('expand.svg') + '" alt="" width="20" height="20"></button>'
    + '<button type="button" class="ds-btn ds-btn--tertiary crt-ib" data-a="vaciar" aria-label="Vaciar carrito" title="Vaciar" ' + (c.items.length || c.cliente ? '' : 'disabled') + '><img src="' + A('trash.svg') + '" alt="" width="20" height="20"></button>'
    + (grande ? '<button type="button" class="ds-btn ds-btn--tertiary crt-ib" data-a="cerrar" aria-label="Cerrar carrito" title="Cerrar"><img src="' + A('close.svg') + '" alt="" width="20" height="20"></button>' : '')
    + '</div>';

  /* carrito chico (Component 163…185, 399 de ancho): encabezado, cliente, operaciones en una tarjeta y resumen */
  const htmlOpChico = (g) => {
    const p = g.p;
    const img = p.imagen ? '<img src="' + esc(p.imagen) + '" alt="" width="52" height="52">' : '<span class="crt-ini" aria-hidden="true">' + esc(iniciales(p.titulo)) + '</span>';
    const cap = (p.tipo === 'apartado' || p.tipo === 'compra') ? String(p.detalle || '').replace(/^Artículo:\s*/, '') : (p.contrato ? 'No. contrato: ' + p.contrato : p.detalle);
    return '<div class="crt-c__op" aria-label="' + esc(p.titulo + ' ' + mx(p.monto)) + '" role="group"><div class="crt-c__tx"><span class="crt-c__img">' + img + '</span>'
      + '<div class="crt-c__txt"><div class="crt-c__row"><span>' + esc(p.titulo) + '</span><span>' + mx(p.monto) + '</span></div>' + (cap ? '<small title="' + esc(cap) + '">' + esc(cap) + '</small>' : '') + '</div>'
      + menuHtml(p, st.menu === p.id, g) + '</div>'
      + g.subs.map(htmlSub).join('') + htmlForm(g) + '</div>';
  };
  function pintarChico(c, gs, sel) {
    const tIva = sel.reduce((t, x) => t + iva(x), 0), tot = total(sel);
    const n = gs.filter((g) => !st.fuera.has(g.p.id)).length;
    pn.innerHTML = '<div class="crt-c__head"><h2 id="crtTitulo">Carrito</h2>' + herramientas(c, false) + '</div>'
      + '<div class="crt-c__cli">' + htmlCliente(c) + '</div>'
      + '<div class="crt-c__list">' + (gs.length ? '<div class="crt-c__card">' + gs.map(htmlOpChico).join('<hr class="crt-sep">') + '</div>'
        : '<div class="crt-empty crt-empty--c"><img src="' + A('vacio.svg') + '" alt="" width="96" height="96"><b>Tu carrito está vacío</b><p>Agrega operaciones desde el perfil del cliente o el inventario.</p></div>') + '</div>'
      + '<div class="crt-c__foot"><div class="crt-c__fr"><span>Subtotal neto</span><span>' + mx(tot - tIva) + '</span></div><div class="crt-c__fr"><span>IVA</span><span>' + mx(tIva) + '</span></div><hr class="crt-sep">'
      + '<div class="crt-c__tot"><span><b>Total</b><small>' + n + ' artículo(s)</small></span><b>' + mx(tot) + '</b></div>'
      + (!c.cliente && sel.length ? '<p class="crt-note">Vincula un cliente para comenzar el pago.</p>' : '')
      + '<button type="button" class="ds-btn ds-btn--primary ds-btn--md" data-a="pagar" ' + (sel.length && c.cliente ? '' : 'disabled') + '>Comenzar proceso de pago</button></div>';
  }

  function pintar(foco) {
    if (!dlg || !st.vista) return;
    const c = leerTodo();
    const ids = new Set(c.items.map((x) => x.id));
    [...st.fuera].forEach((id) => { if (!ids.has(id)) st.fuera.delete(id); });
    const gs = grupos(c.items);
    const sel = gs.filter((g) => !st.fuera.has(g.p.id)).flatMap((g) => [g.p, ...g.subs]);
    const todos = gs.length && gs.every((g) => !st.fuera.has(g.p.id));
    const dentro = !!(document.activeElement && dlg.contains(document.activeElement));
    const activo = foco || (dentro ? selectorDe(document.activeElement) : null);
    const lista = dlg.querySelector('.crt-c__list, .crt__items'), scroll = lista ? lista.scrollTop : 0;
    if (st.vista === 'chico') pintarChico(c, gs, sel);
    else dlg.innerHTML = '<div class="crt__head"><h2 class="ds-modal__title" id="crtTitulo">Carrito</h2>' + herramientas(c, true) + '</div>'
      + '<div class="crt__body"><section class="crt__items" aria-label="Operaciones en el carrito">'
      + (gs.length ? '<div class="crt__all"><label class="ds-check"><input type="checkbox" data-a="todos" ' + (todos ? 'checked' : '') + ' aria-label="Seleccionar todas las operaciones"><span class="ds-check__wrap"><span class="ds-check__box"></span></span></label><b>Artículos (' + gs.length + ')</b></div>' + gs.map(htmlGrupo).join('')
        : '<div class="crt-empty"><img src="' + A('vacio.svg') + '" alt="" width="150" height="150"><b>Tu carrito está vacío</b><p>Agrega refrendos, desempeños, apartados o compras desde el perfil del cliente, el inventario o la ficha del artículo.</p></div>')
      + '</section><aside class="crt__sum" aria-label="Resumen del cobro">' + htmlResumen(c, sel) + '</aside></div>';
    const lista2 = dlg.querySelector('.crt-c__list, .crt__items'); if (lista2) lista2.scrollTop = scroll;
    colocarMenu();
    if (st.lista) pintarLista();
    const el = activo && dlg.querySelector(activo);
    if (el) { el.focus({ preventScroll: true }); if (el.id === 'crtFormIn' && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' }); }
    else if ((dentro || foco) && !dlg.contains(document.activeElement)) dlg.focus({ preventScroll: true });   // el foco no se pierde en <body>; si estaba en la página, se queda ahí
  }
  // el menú ⋮ flota sobre la lista (position: fixed) para que el scroll de las operaciones no lo recorte
  function colocarMenu() {
    const m = dlg && dlg.querySelector('.crt-menu');
    if (!m) return;
    const b = m.previousElementSibling.getBoundingClientRect();
    const h = m.offsetHeight;
    const arriba = b.bottom + 4 + h > innerHeight - 8;
    m.style.top = (arriba ? Math.max(8, b.top - 4 - h) : b.bottom + 4) + 'px';
    m.style.left = Math.max(8, Math.min(b.right - m.offsetWidth, innerWidth - m.offsetWidth - 8)) + 'px';
  }
  addEventListener('resize', () => colocarMenu());
  // un selector estable para devolver el foco al mismo control tras repintar
  const selectorDe = (el) => {
    if (el.id) return '#' + el.id;
    const a = el.dataset && el.dataset.a;
    if (!a) return null;
    return '[data-a="' + a + '"]' + (el.dataset.id ? '[data-id="' + CSS.escape(el.dataset.id) + '"]' : '') + (el.dataset.t ? '[data-t="' + el.dataset.t + '"]' : '');
  };

  /* ---------- buscador de cliente (combobox) ---------- */
  let resultados = [];
  function pintarLista() {
    const ul = dlg.querySelector('#crtLista'), inp = dlg.querySelector('#crtBuscar');
    if (!ul || !inp) return;
    const q = st.q.trim().toLowerCase(), qd = q.replace(/\D/g, '');
    resultados = (clientes || []).filter((k) => !q || k.nombre.toLowerCase().includes(q) || (qd && (String(k.nuc).includes(qd) || String(k.telefono || '').includes(qd)))).slice(0, 8);
    const opciones = [{ add: true }].concat(resultados);
    // al escribir se resalta la primera coincidencia (no "Agregar cliente", que saca de la página)
    if (st.auto) st.activo = q && resultados.length ? 1 : -1;
    if (st.activo >= opciones.length) st.activo = opciones.length - 1;
    ul.innerHTML = opciones.map((k, i) => k.add
      ? '<li role="option" id="crtOp' + i + '" class="crt-list__add" data-i="' + i + '" aria-selected="' + (st.activo === i) + '"><img src="' + A('person-add.svg') + '" alt="" width="20" height="20"><span class="crt-list__t"><b>Agregar cliente</b></span></li>'
      : '<li role="option" id="crtOp' + i + '" data-i="' + i + '" aria-selected="' + (st.activo === i) + '"><span class="crt-list__t"><b>' + esc(k.nombre) + '</b><small>Tel: ' + esc(telFmt(k.telefono)) + ' - NUC: ' + esc(k.nuc) + (k.email ? ' - ' + esc(k.email) : '') + '</small></span></li>').join('')
      + (clientes && !resultados.length ? '<li class="crt-list__none" aria-disabled="true">Sin coincidencias. Agrégalo como cliente nuevo.</li>' : '')
      + (!clientes ? '<li class="crt-list__none" aria-disabled="true">Cargando clientes…</li>' : '');
    ul.hidden = false;
    inp.setAttribute('aria-expanded', 'true');
    if (st.activo >= 0) { inp.setAttribute('aria-activedescendant', 'crtOp' + st.activo); const o = ul.querySelector('#crtOp' + st.activo); if (o) o.scrollIntoView({ block: 'nearest' }); }
    else inp.removeAttribute('aria-activedescendant');
  }
  const abrirLista = () => { st.lista = true; pintarLista(); cargarClientes().then(() => { if (st.lista) pintarLista(); }); };
  const cerrarLista = () => {
    st.lista = false; st.activo = -1;
    const ul = dlg && dlg.querySelector('#crtLista'), inp = dlg && dlg.querySelector('#crtBuscar');
    if (ul) ul.hidden = true;
    if (inp) { inp.setAttribute('aria-expanded', 'false'); inp.removeAttribute('aria-activedescendant'); }
  };
  const elegir = (i) => {
    if (i === 0) {
      // Cliente nuevo guarda al cliente creado; al volver, este archivo lo vincula al carrito
      let antes = 0;
      try { antes = (JSON.parse(sessionStorage.getItem('ataskate-ux-created-clients') || '[]') || []).length; sessionStorage.setItem('ats-carrito-vincular', JSON.stringify({ antes, t: Date.now() })); } catch (e) { /* sin almacenamiento */ }
      location.href = new URL('clientes/cliente-nuevo.html', base).href;
      return;
    }
    const k = resultados[i - 1];
    if (!k) return;
    st.q = ''; st.lista = false; st.activo = -1;
    setCliente({ nuc: k.nuc, nombre: k.nombre, telefono: k.telefono });
    pintar('[data-a="desvincular"]');
  };

  /* ---------- formulario de abono / extensión ---------- */
  const abrirForm = (gid, tipo, editId) => {
    const c = leerTodo(), s = editId && c.items.find((x) => x.id === editId);
    st.form = { gid, tipo, editId: editId || null, valor: s ? String(tipo === 'extension' ? (s.dias || '') : s.monto) : '', error: '' };
    st.menu = null;
    pintar('#crtFormIn');
  };
  function confirmarForm() {
    const f = st.form; if (!f) return;
    const c = leerTodo(), p = c.items.find((x) => x.id === f.gid);
    if (!p) { st.form = null; pintar(); return; }
    const v = valorNum();
    if (f.tipo === 'extension') {
      const d = Math.floor(v);
      if (!(d >= 1 && d <= 30)) { f.error = 'Escribe de 1 a 30 días.'; pintar('#crtFormIn'); return; }
      const fin = new Date(); fin.setDate(fin.getDate() + d);
      const fecha = fin.getDate() + ' ' + ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][fin.getMonth()] + ' ' + fin.getFullYear();
      agregar({ id: f.editId || undefined, tipo: 'extension', titulo: 'Extensión', detalle: d + (d === 1 ? ' día' : ' días') + ' - Pago: ' + fecha, monto: Math.round(costoDia(p) * d * 100) / 100, contrato: p.contrato, dias: d });
    } else {
      if (!(v > 0)) { f.error = 'Escribe un monto mayor a $0.00.'; pintar('#crtFormIn'); return; }
      if (p.prestamo && v > p.prestamo) { f.error = 'El abono no puede pasar de ' + mx(p.prestamo) + '.'; pintar('#crtFormIn'); return; }
      agregar({ id: f.editId || undefined, tipo: f.tipo, titulo: 'Abono', detalle: p.prestamo ? 'Reduce el ' + (p.tipo === 'apartado' ? 'saldo' : 'préstamo') + ' a: ' + mx(p.prestamo - v) : '', monto: v, contrato: p.contrato });
    }
    st.form = null;
    pintar('[data-a="menu"][data-id="' + CSS.escape(f.gid) + '"]');
  }

  /* ---------- eventos ---------- */
  function clic(e) {
    const li = e.target.closest('.crt-list li[data-i]');
    if (li) { elegir(Number(li.dataset.i)); return; }
    const b = e.target.closest('[data-a]');
    if (st.menu && !(b && (b.dataset.a === 'menu' || b.closest('.crt-menu')))) { st.menu = null; pintar(); }
    if (st.lista && !e.target.closest('.crt-find')) cerrarLista();
    if (!b) return;
    const a = b.dataset.a, id = b.dataset.id;
    if (a === 'cerrar') cerrar();
    else if (a === 'expandir') cambiar('grande');
    else if (a === 'contraer') cambiar('chico');
    else if (a === 'fijar') { st.fijo = !st.fijo; try { localStorage.setItem(FIJO, st.fijo ? '1' : '0'); } catch (e2) { /* sin almacenamiento */ } pintar('[data-a="fijar"]'); }
    else if (a === 'revertir') {
      // refrendo → desempeño del mismo contrato: préstamo + interés del periodo (los abonos y la extensión se quitan)
      const c = leerTodo(), x = c.items.find((i) => i.id === id);
      st.menu = null;
      if (x) { quitar(x.id); agregar({ tipo: 'desempeno', titulo: 'Desempeño', detalle: x.detalle, monto: (x.prestamo || 0) + x.monto, contrato: x.contrato, imagen: x.imagen }); aviso('Refrendo cambiado por desempeño', 'Contrato ' + x.contrato); }
      pintar('[data-a="vaciar"]');
    }
    else if (a === 'vaciar') { vaciar(); st.fuera.clear(); st.form = null; aviso('Carrito vacío', 'Se quitaron las operaciones y el cliente.'); pintar('[data-a="vaciar"]'); }
    else if (a === 'menu') { st.menu = st.menu === id ? null : id; pintar(); const m = dlg.querySelector('.crt-menu [role="menuitem"]'); if (m) m.focus(); }
    else if (a === 'quitar') { const c = leerTodo(), x = c.items.find((i) => i.id === id); st.menu = null; if (st.form && (st.form.gid === id || st.form.editId === id)) st.form = null; quitar(id); if (x) aviso('Se quitó del carrito', x.titulo + ' · ' + mx(x.monto)); pintar('[data-a="vaciar"]'); }
    else if (a === 'editar') { const c = leerTodo(), x = c.items.find((i) => i.id === id), g = x && grupos(c.items).find((g) => g.subs.includes(x)); if (g) abrirForm(g.p.id, x.tipo, x.id); }
    else if (a === 'form') abrirForm(id, b.dataset.t);
    else if (a === 'cancelar') { const gid = st.form && st.form.gid; st.form = null; pintar('[data-a="menu"][data-id="' + CSS.escape(gid || '') + '"]'); }
    else if (a === 'desvincular') { setCliente(null); st.q = ''; pintar('#crtBuscar'); }
    else if (a === 'pagar') {
      const c = leerTodo(), gs = grupos(c.items);
      const sel = gs.filter((g) => !st.fuera.has(g.p.id)).flatMap((g) => [g.p, ...g.subs]);
      if (!sel.length || !c.cliente) return;
      guardar({ cliente: c.cliente, items: c.items.filter((x) => sel.includes(x)) });
      location.href = PASARELA;
    }
  }
  function escribir(e) {
    const t = e.target;
    if (t.dataset.a === 'sel') { if (t.checked) st.fuera.delete(t.dataset.id); else st.fuera.add(t.dataset.id); pintar(); return; }
    if (t.dataset.a === 'todos') { const gs = grupos(leerTodo().items); if (t.checked) st.fuera.clear(); else gs.forEach((g) => st.fuera.add(g.p.id)); pintar(); return; }
    if (t.id === 'crtBuscar') { st.q = t.value; st.auto = true; abrirLista(); return; }
    if (t.id === 'crtFormIn' && st.form) {
      st.form.valor = t.value;
      const c = leerTodo(), p = c.items.find((x) => x.id === st.form.gid), o = dlg.querySelector('#crtFormCost');
      if (p && o) o.textContent = costoTxt(p);
    }
  }
  const focusables = () => [...dlg.querySelectorAll('button:not(:disabled), input:not(:disabled), [href], [tabindex]:not([tabindex="-1"])')].filter((el) => el.getClientRects().length);
  function teclas(e) {
    if (e.target.id === 'crtBuscar') {
      const n = resultados.length + 1;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') st.auto = false;
      if (e.key === 'ArrowDown') { e.preventDefault(); if (!st.lista) abrirLista(); st.activo = (st.activo + 1) % n; pintarLista(); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); if (!st.lista) abrirLista(); st.activo = (st.activo - 1 + n) % n; pintarLista(); return; }
      if (e.key === 'Enter' && st.lista && st.activo >= 0) { e.preventDefault(); elegir(st.activo); return; }
      if (e.key === 'Escape' && st.lista) { e.preventDefault(); e.stopPropagation(); cerrarLista(); return; }
    }
    if (st.menu && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      const it = [...dlg.querySelectorAll('.crt-menu [role="menuitem"]')], i = it.indexOf(document.activeElement);
      if (it.length) { e.preventDefault(); it[(i + (e.key === 'ArrowDown' ? 1 : -1) + it.length) % it.length].focus(); }
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault(); e.stopPropagation();
      if (st.menu) { const id = st.menu; st.menu = null; pintar('[data-a="menu"][data-id="' + CSS.escape(id) + '"]'); return; }
      if (st.form) { const gid = st.form.gid; st.form = null; pintar('[data-a="menu"][data-id="' + CSS.escape(gid) + '"]'); return; }
      cerrar();
      return;
    }
    if (e.key === 'Tab' && st.vista === 'grande') {
      const f = focusables(); if (!f.length) return;
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && (i <= 0)) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  }

  const mostrar = (v) => {
    st.vista = v;
    dlg = v === 'grande' ? md : pn;
    (v === 'grande' ? pn : md).innerHTML = '';   // la vista cerrada no deja ids repetidos
    if (!v) { pn.innerHTML = ''; md.innerHTML = ''; }
    ov.hidden = v !== 'grande';
    pn.hidden = v !== 'chico';
    pn.setAttribute('aria-modal', 'false');
    document.documentElement.classList.toggle('crt-open', v === 'grande');
    document.documentElement.classList.toggle('crt-chico-open', v === 'chico');
    const cart = document.getElementById('posCart'); if (cart) cart.setAttribute('aria-expanded', String(!!v));
  };
  const enfocarInicio = () => {
    const c = leerTodo();
    const primero = (!c.cliente && c.items.length && dlg.querySelector('#crtBuscar')) || dlg.querySelector(st.vista === 'grande' ? '[data-a="cerrar"]' : '[data-a="expandir"]');
    if (primero) primero.focus();
  };
  // abre el chico (el que abre el ícono del header, como en el Figma) o el grande
  function abrir(v) {
    construir();
    v = v === 'grande' ? 'grande' : 'chico';
    if (st.vista === v) return;
    if (!st.vista) st.origen = document.activeElement;
    st.menu = null; st.lista = false; st.q = '';
    // los paneles del header (caja, tuerquita) no se quedan encima
    document.querySelectorAll('#posCajaPanel, #posAjustesMenu').forEach((p) => { p.hidden = true; });
    mostrar(v);
    pintar();
    enfocarInicio();
  }
  // expandir / contraer: el formulario abierto y la selección se conservan
  function cambiar(v) {
    if (!st.vista || st.vista === v) return;
    st.menu = null; st.lista = false;
    mostrar(v);
    pintar(st.form ? '#crtFormIn' : '[data-a="' + (v === 'grande' ? 'contraer' : 'expandir') + '"]');
  }
  function cerrar(devolverFoco) {
    if (!st.vista) return;
    mostrar(null);
    st.form = null; st.menu = null; st.lista = false;
    if (devolverFoco === false) return;
    const cart = document.getElementById('posCart');
    const o = st.origen;
    if (o && o.isConnected && o !== document.body && o.getClientRects().length) o.focus(); else if (cart) cart.focus();
  }

  /* ---------- header: cantidad del carrito ---------- */
  const pintarHeader = () => {
    const n = leerTodo().items.length;
    const el = document.getElementById('posCartN'), b = document.getElementById('posCart');
    if (el) el.textContent = n;
    if (b) b.setAttribute('aria-label', 'Carrito, ' + n + (n === 1 ? ' artículo' : ' artículos'));
  };
  addEventListener('ats-carrito', () => { pintarHeader(); if (st.vista) pintar(); });
  // otra pestaña cambió el carrito
  addEventListener('storage', (e) => { if (e.key === KEY) avisar(leer()); });

  const cart = document.getElementById('posCart');
  if (cart) {
    cart.setAttribute('aria-haspopup', 'dialog');
    cart.setAttribute('aria-expanded', 'false');
    cart.addEventListener('click', () => (st.vista ? cerrar() : abrir('chico')));
  }

  window.atsCarrito = { leer: leerTodo, guardar, agregar, quitar, vaciar, setCliente, abrir, cerrar, total: () => total(), agregarDe, aviso, expandir: () => cambiar('grande'), contraer: () => cambiar('chico') };
  pintarHeader();

  // regreso de Cliente nuevo con "Agregar cliente" del carrito: el cliente recién creado queda vinculado
  try {
    const v = JSON.parse(sessionStorage.getItem('ats-carrito-vincular') || 'null');
    if (v && Date.now() - v.t > 30 * 60 * 1000) sessionStorage.removeItem('ats-carrito-vincular');
    else if (v) {
      const creados = JSON.parse(sessionStorage.getItem('ataskate-ux-created-clients') || '[]') || [];
      if (creados.length > v.antes) {
        const k = creados[0];
        sessionStorage.removeItem('ats-carrito-vincular');
        setCliente({ nuc: k.nuc, nombre: [k.name, k.last].filter(Boolean).join(' '), telefono: k.phone });
        aviso('Cliente vinculado al carrito', [k.name, k.last].filter(Boolean).join(' ') + ' · NUC ' + k.nuc);
      }
    }
  } catch (e) { /* sin almacenamiento */ }
  // ?carrito=1 abre el carrito chico al cargar y ?carrito=grande el grande (enlaces directos para revisar el flujo);
  // fijado (pin), el chico sigue abierto al cambiar de página
  const pide = new URLSearchParams(location.search).get('carrito');
  if (pide === '1' || pide === 'chico') abrir('chico');
  else if (pide === 'grande') abrir('grande');
  else if (st.fijo && cart && cart.offsetParent) { construir(); mostrar('chico'); pintar(); }
})();
