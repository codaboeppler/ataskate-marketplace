/* Pasarela de pago (Operativo) — Figma "Carrito - Pasarela de pago", Section 1 (2934:14981).
   Pantallas: cobro (métodos de pago + método de entrega + resumen), modales de la terminal (procesando, aprobada,
   rechazada, error), dirección de envío, sucursal de recolecta, "Espera un momento..." y el recibo "Transacción registrada".
   Es una maqueta: la terminal, la transferencia y el registro de la operación responden simulados (se cambian en
   "Estados de la maqueta"). Lee el carrito compartido de localStorage "ats-carrito"; si está vacío carga uno de muestra. */
(() => {
  const CLAVE = 'ats-carrito';
  const $main = document.getElementById('main');
  const $modal = document.getElementById('pasModal');
  const $toasts = document.getElementById('pasToasts');
  const A = (n) => 'assets/' + n + '.svg';
  const qs = new URLSearchParams(location.search);

  /* ---------- utilidades ---------- */
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const r2 = (n) => Math.round(n * 100) / 100;
  const mxn = (n) => (n < 0 ? '-' : '') + '$' + Math.abs(n).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const num = (v) => { const n = parseFloat(String(v || '').replace(/[^0-9.]/g, '')); return isFinite(n) ? r2(n) : 0; };
  const iniciales = (n) => String(n || '').trim().split(/\s+/).slice(0, 2).map((p) => p[0] || '').join('').toUpperCase() || 'VP';
  const CLOSE = '<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z" fill="currentColor"/></svg>';
  const TOAST_OK = '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9.55 18L3.85 12.3L5.275 10.875L9.55 15.15L18.725 5.975L20.15 7.4L9.55 18Z" fill="currentColor"/></svg>';
  const TOAST_ERR = '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11 13V7h2v6h-2Zm0 4v-2h2v2h-2Z" fill="currentColor"/></svg>';

  /* ---------- carrito ---------- */
  const MUESTRA = {
    cliente: { nuc: 'NUC-204381', nombre: 'Valentina López', telefono: '5512345678' },
    items: [
      { id: 'm1', tipo: 'compra', titulo: 'iPhone 16 128 GB Negro', detalle: 'SKU 367-837282', monto: 5000, imagen: '../assets/inventario/iphone-16-negro.png' },
      { id: 'm2', tipo: 'desempeno', titulo: 'Anillo de oro 14k', detalle: 'Contrato RE34-8RT3', contrato: 'RE34-8RT3', monto: 10000, imagen: '../assets/inventario/anillo.png' },
      { id: 'm3', tipo: 'refrendo', titulo: 'Consola Xbox Series S', detalle: 'Contrato RE41-2KM8', contrato: 'RE41-2KM8', monto: 1000, imagen: '../assets/inventario/xbox.png' },
      { id: 'm4', tipo: 'apartado', titulo: 'Bocina Bluetooth', detalle: 'SKU 512-004219', monto: 1000, imagen: '../assets/inventario/bocina.png' },
    ],
  };
  /* empeño de muestra (?empeno=1): un contrato con dos prendas; el préstamo sale de la caja (monto negativo) */
  const MUESTRA_EMPENO = {
    cliente: { nuc: 'NUC-204381', nombre: 'Valentina López', telefono: '5512345678', correo: 'valentina.lopez@ejemplo.com' },
    items: [
      { id: 'e1', tipo: 'empeno', contrato: '000124', titulo: 'Empeño · 2 artículos', detalle: 'Contrato IZT-000124 · Plazo Mensual (6.5%)', plazo: 'Mensual', monto: -13000, imagen: 'assets/prendas/anillo-1-general.jpg',
        cotitulares: ['Ricardo López Ejemplo'],
        articulos: [
          { nombre: 'Anillo de oro', ruta: ['Joyas y relojes', 'Joyería', 'Oro'], caracteristicas: '14K · 12 g · accesorios 2 g', estado: 'Excelente', avaluo: 12500, prestamo: 8000, imagen: 'assets/prendas/anillo-1-general.jpg',
            fotos: [{ src: 'assets/prendas/anillo-1-general.jpg', etiqueta: 'Vista general' }, { src: 'assets/prendas/anillo-2-kilataje.jpg', etiqueta: 'Detalle del kilataje (MEX 14K)' }, { src: 'assets/prendas/anillo-3-lateral.jpg', etiqueta: 'Detalle del borde labrado' }] },
          { nombre: 'Consola Xbox Series S', ruta: ['Electrónica', 'Videojuegos', 'Consolas'], caracteristicas: 'Microsoft · 512 GB · SN DEMO-4821', estado: 'Bueno', avaluo: 8200, prestamo: 5000, imagen: 'assets/prendas/xbox-s-1-general.jpg',
            fotos: [{ src: 'assets/prendas/xbox-s-1-general.jpg', etiqueta: 'Vista general con control' }, { src: 'assets/prendas/xbox-s-2-control.jpg', etiqueta: 'Control incluido' }, { src: 'assets/prendas/xbox-s-3-frente.jpg', etiqueta: 'Frente y ventilación' }] },
        ] },
    ],
  };
  const leerCarrito = () => {
    try {
      const c = window.atsCarrito && typeof window.atsCarrito.leer === 'function' ? window.atsCarrito.leer() : JSON.parse(localStorage.getItem(CLAVE) || 'null');
      if (c && Array.isArray(c.items) && c.items.length) return { cliente: c.cliente || null, items: c.items.map((it, i) => ({ ...it, id: it.id || 'i' + i, monto: Number(it.monto) || 0 })) };
    } catch (e) { /* carrito ilegible: se usa la muestra */ }
    return null;
  };
  const vaciarCarrito = () => {
    if (window.atsCarrito && typeof window.atsCarrito.vaciar === 'function') { window.atsCarrito.vaciar(); return; }
    try { localStorage.removeItem(CLAVE); } catch (e) { /* sin almacenamiento */ }
    window.dispatchEvent(new CustomEvent('ats-carrito', { detail: { cliente: null, items: [] } }));
  };
  const pintarContador = (n) => {
    const b = document.getElementById('posCart'), s = document.getElementById('posCartN');
    if (window.atsCarrito || !b || !s) return;   // carrito.js lleva su propio contador
    s.textContent = n; b.setAttribute('aria-label', 'Carrito, ' + n + (n === 1 ? ' artículo' : ' artículos'));
  };

  /* tipos de renglón del carrito → etiqueta del desglose. Los intereses (refrendo, extensión, abono a empeño) llevan IVA 16 % */
  const TIPOS = {
    compra: 'Compra', venta: 'Compra', apartado: 'Cuota de apartado', 'cuota-apartado': 'Cuota de apartado', 'abono-apartado': 'Abono apartado',
    liquidacion: 'Liquidación apartado', desempeno: 'Desempeño', refrendo: 'Refrendo', extension: 'Extensión refrendo', 'extension-refrendo': 'Extensión refrendo',
    'abono-empeno': 'Abono empeño', abono: 'Abono empeño', empeno: 'Empeño',
  };
  const CON_IVA = ['refrendo', 'extension', 'extension-refrendo', 'abono-empeno', 'abono'];
  const SE_ENTREGA = ['compra', 'venta', 'desempeno', 'liquidacion'];
  const norm = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-');
  const etiqueta = (t) => TIPOS[norm(t)] || (String(t || 'Artículo').charAt(0).toUpperCase() + String(t || 'artículo').slice(1));

  /* ---------- catálogos ficticios ---------- */
  const SUCURSALES = [
    { id: 'iztapalapa', nombre: 'Multiapoyo Iztapalapa', dir: 'La Purísima, Ermita Iztapalapa 1721, San Miguel, Iztapalapa, 09830 Ciudad de México, CDMX' },
    { id: 'coyoacan', nombre: 'Multiapoyo Coyoacán', dir: 'Av. División del Norte #1234, Col. Del Carmen, C.P. 04100, Coyoacán, CDMX' },
    { id: 'tlalpan', nombre: 'Multiapoyo Tlalpan', dir: 'Calz. de Tlalpan #3890, Col. Espartaco, C.P. 14870, Tlalpan, CDMX' },
  ];
  const CPS = {
    '07840': { colonias: ['Guadalupe Tepeyac', 'Gertrudis Sánchez'], alcaldia: 'Gustavo A. Madero', estado: 'Ciudad de México' },
    '04100': { colonias: ['Del Carmen', 'Villa Coyoacán'], alcaldia: 'Coyoacán', estado: 'Ciudad de México' },
    '09830': { colonias: ['San Miguel', 'Santa Isabel Industrial'], alcaldia: 'Iztapalapa', estado: 'Ciudad de México' },
  };
  const ESTADOS = ['Ciudad de México', 'Estado de México', 'Jalisco', 'Nuevo León', 'Puebla'];
  const cpInfo = (cp) => CPS[cp] || (/^\d{5}$/.test(cp) ? { colonias: ['Centro', 'Del Valle', 'Las Flores'], alcaldia: 'Cuauhtémoc', estado: 'Ciudad de México' } : null);

  const METODOS = [
    { id: 'tarjeta', nombre: 'Tarjeta', desc: 'Cobro con terminal bancaria' },
    { id: 'transferencia', nombre: 'Transferencia bancaria', desc: 'Pago monto a través de una transferencia' },
    { id: 'efectivo', nombre: 'Efectivo', desc: 'Pago monto en efectivo' },
    { id: 'ewallet', nombre: 'eWallet', desc: 'Pago monto a billetera Ataskate' },
  ];
  const nombreMetodo = (id) => (METODOS.find((m) => m.id === id) || {}).nombre || id;
  const RAPIDOS = [100, 200, 500, 1000, 1500, 2000];

  /* ---------- estado ---------- */
  const st = {};
  const sim = { terminal: 'ok', registro: 'ok' };
  let saldoWallet = 1100;
  let seq = 0;
  const reiniciar = (forzarMuestra) => {
    const c = forzarMuestra ? null : leerCarrito();
    Object.assign(st, {
      carrito: c || ((m) => { const n = Number(qs.get('arts')); if (n > 0) m.items = m.items.slice(0, n); return m; })(JSON.parse(JSON.stringify(qs.get('empeno') === '1' ? MUESTRA_EMPENO : MUESTRA))),
      muestra: !c,
      pagos: [],
      abierto: null,
      bor: { tarjeta: { tipo: '', monto: '' }, transferencia: { monto: '', ref: '' }, efectivo: { monto: '' }, ewallet: { monto: '' } },
      err: {},
      saldo: saldoWallet,
      desglose: true,
      articulos: true,
      menu: null,
      ocupado: null,
      modo: 'una',
      sucursal: 'iztapalapa',
      opciones: [],
      opcion: 'sucursal',
      porArt: {},
      vista: 'cobro',
      recibo: null,
    });
    st.opciones = [{ id: 'sucursal', tipo: 'sucursal' }];
    if (st.carrito.cliente) st.opciones.push({ id: 'casa', tipo: 'dir', nombre: 'Casa', cp: '07840', calle: 'Elsa', ext: '102', int: '', colonia: 'Guadalupe Tepeyac', alcaldia: 'Gustavo A. Madero', estado: 'Ciudad de México' });
    pintarContador(st.carrito.items.length);
  };

  const cuentas = () => {
    const items = st.carrito.items;
    const subtotal = r2(items.reduce((s, it) => s + it.monto, 0));
    const iva = r2(items.filter((it) => CON_IVA.includes(norm(it.tipo))).reduce((s, it) => s + it.monto, 0) * 0.16);
    const ieps = 0, envio = 0;
    const total = r2(subtotal + iva + ieps + envio);
    const pagado = r2(st.pagos.reduce((s, p) => s + p.monto, 0));
    const cambio = r2(st.pagos.reduce((s, p) => s + (p.cambio || 0), 0));
    const porTipo = [];
    items.forEach((it) => { const e = etiqueta(it.tipo); const f = porTipo.find((x) => x[0] === e); if (f) f[1] += it.monto; else porTipo.push([e, it.monto]); });
    return { subtotal, iva, ieps, envio, total, pagado, cambio, falta: r2(Math.abs(total) - pagado), porTipo, n: items.length };
  };
  const entregables = () => st.carrito.items.filter((it) => SE_ENTREGA.includes(norm(it.tipo)));
  const sucursal = () => SUCURSALES.find((s) => s.id === st.sucursal) || SUCURSALES[0];
  const dirTexto = (o) => [o.calle + ' ' + o.ext + (o.int ? ' int. ' + o.int : ''), o.colonia, o.alcaldia, o.cp + ' ' + o.estado].join(', ') + (o.estado === 'Ciudad de México' ? ', CDMX' : '');
  const nombreOpcion = (o) => (o.tipo === 'sucursal' ? 'Sucursal' : (o.id === 'casa' ? 'Domicilio cliente - ' + o.nombre : o.nombre));

  /* ---------- toasts (DS Toast) ---------- */
  const toast = (tipo, titulo, texto) => {
    $toasts.querySelectorAll('.ds-toast').forEach((x) => x.remove());
    const t = document.createElement('div');
    t.className = 'ds-toast ds-toast--' + tipo;
    t.setAttribute('role', tipo === 'error' ? 'alert' : 'status');
    t.innerHTML = '<span class="ds-toast__icon" aria-hidden="true">' + (tipo === 'error' ? TOAST_ERR : TOAST_OK) + '</span><div class="ds-toast__body-wrap"><p class="ds-toast__title"></p>' + (texto ? '<p class="ds-toast__body"></p>' : '') + '</div><button type="button" class="ds-toast__close" aria-label="Cerrar aviso">' + CLOSE + '</button>';
    t.querySelector('.ds-toast__title').textContent = titulo;
    if (texto) t.querySelector('.ds-toast__body').textContent = texto;
    t.querySelector('.ds-toast__close').addEventListener('click', () => t.remove());
    $toasts.appendChild(t);
    setTimeout(() => t.remove(), 5000);
  };

  /* ---------- pantalla de cobro ---------- */
  // sin breadcrumb en la pasarela (decisión de producto): es un paso del cobro, no una sección del menú
  const crumbs = () => '';

  const imgArt = (it) => it.imagen ? `<img src="${esc(it.imagen)}" alt="" />` : `<span aria-hidden="true">${esc(iniciales(it.titulo))}</span>`;

  const renglonPago = (p) => `<div class="pas-renglon">
      <span class="pas-renglon__lbl">${esc(p.detalle)}${p.cambio ? `<small>Recibido ${mxn(p.recibido)} · cambio ${mxn(p.cambio)}</small>` : ''}</span>
      <span class="pas-renglon__monto">${mxn(p.monto)}</span>
      <span class="pas-menu-wrap"><button class="ds-btn ds-btn--tertiary pas-ibtn pas-ibtn--sm" type="button" data-accion="menu" data-id="${p.id}" aria-haspopup="menu" aria-expanded="${st.menu === p.id}" aria-label="Opciones del pago ${esc(p.detalle)} de ${mxn(p.monto)}"><img src="../assets/more-vert-card.svg" alt="" /></button>
        <span class="pas-menu" role="menu" ${st.menu === p.id ? '' : 'hidden'}><button type="button" role="menuitem" class="is-peligro" data-accion="quitar" data-id="${p.id}">Quitar pago</button></span></span>
    </div>`;

  const campoMonto = (m, c) => {
    const ph = c.falta > 0 ? mxn(m === 'ewallet' ? Math.min(c.falta, st.saldo) : c.falta) : '$0.00';
    return `<span class="pas-monto${st.err[m] ? ' pas-monto--error' : ''}"><input class="ds-input--standalone" type="text" inputmode="decimal" id="monto-${m}" data-borrador="${m}" data-campo="monto" value="${esc(st.bor[m].monto)}" placeholder="${ph}" aria-label="Monto a cobrar con ${nombreMetodo(m)}" ${st.err[m] ? `aria-invalid="true" aria-describedby="err-${m}"` : ''} autocomplete="off" /></span>`;
  };
  const btnAplicar = (m, c) => `<button class="ds-btn ds-btn--primary ds-btn--md${st.ocupado === m ? ' ds-btn--loading' : ''}" type="button" data-accion="aplicar" data-metodo="${m}" ${c.falta <= 0 || st.ocupado ? 'disabled' : ''}>${st.ocupado === m ? '<span class="ds-spinner ds-spinner--sm ds-spinner--white" aria-hidden="true"></span>Validando' : (m === 'transferencia' ? 'Validar y aplicar' : 'Aplicar pago')}</button>`;
  const chips = (m) => `<div class="pas-chips" role="group" aria-label="Montos rápidos">${RAPIDOS.map((v) => `<button class="ds-chip ds-chip--choice" type="button" data-accion="rapido" data-metodo="${m}" data-valor="${v}">+${mxn(v)}</button>`).join('')}<button class="ds-chip ds-chip--choice" type="button" data-accion="exacto" data-metodo="${m}">Monto exacto</button></div>`;

  const metodo = (m, c) => {
    const abierto = st.abierto === m.id;
    const pagos = st.pagos.filter((p) => p.metodo === m.id);
    const usado = pagos.length > 0;
    let desc = m.desc;
    if (m.id === 'ewallet' && st.pagos.some((p) => p.metodo === 'ewallet') && !abierto) desc = 'Saldo: ' + mxn(st.saldo);
    const chevron = `<button class="ds-btn ds-btn--tertiary pas-ibtn" type="button" data-accion="abrir" data-metodo="${m.id}" aria-expanded="${abierto}" aria-controls="cuerpo-${m.id}" aria-label="${abierto ? 'Cerrar' : 'Abrir'} ${m.nombre}"><img src="${A(abierto ? 'chevron-b' : 'chevron')}" alt="" /></button>`;
    // efectivo y eWallet llevan monto + aplicar en la misma fila del título; tarjeta y transferencia, en una fila aparte
    const enFila = abierto && (m.id === 'efectivo' || m.id === 'ewallet');
    let cuerpo = '';
    if (abierto && m.id === 'tarjeta') {
      cuerpo = `<div class="pas-cobro-tarjeta">
          <span class="pas-select"><select class="ds-select--standalone${st.bor.tarjeta.tipo ? '' : ' is-vacio'}" id="tipo-tarjeta" data-borrador="tarjeta" data-campo="tipo" aria-label="Tipo de tarjeta" ${st.err.tarjetaTipo ? 'aria-invalid="true" aria-describedby="err-tarjetaTipo"' : ''}>
            <option value="" ${st.bor.tarjeta.tipo ? '' : 'selected'} disabled>Tipo de tarjeta</option>
            <option value="Débito" ${st.bor.tarjeta.tipo === 'Débito' ? 'selected' : ''}>Débito</option>
            <option value="Crédito" ${st.bor.tarjeta.tipo === 'Crédito' ? 'selected' : ''}>Crédito</option>
          </select><img src="../assets/ds/KeyboardArrowDown.svg" alt="" /></span>
          ${campoMonto('tarjeta', c)}${btnAplicar('tarjeta', c)}
        </div>
        ${st.err.tarjetaTipo ? `<p class="pas-error" id="err-tarjetaTipo">${st.err.tarjetaTipo}</p>` : ''}
        ${st.err.tarjeta ? `<p class="pas-error" id="err-tarjeta">${st.err.tarjeta}</p>` : ''}
        ${usado ? '' : `<div class="pas-renglon"><span class="pas-renglon__lbl">${esc(st.bor.tarjeta.tipo || 'Tipo de tarjeta')}</span><span class="pas-renglon__monto pas-renglon__monto--accion">${mxn(0)}</span></div>`}`;
    } else if (abierto && m.id === 'transferencia') {
      cuerpo = `<div class="pas-cobro-tarjeta">
          <span class="pas-monto pas-select"><input class="ds-input--standalone pas-input-sm${st.err.ref ? ' ds-input--error' : ''}" type="text" id="ref-transferencia" data-borrador="transferencia" data-campo="ref" value="${esc(st.bor.transferencia.ref)}" placeholder="Clave de rastreo o referencia" aria-label="Clave de rastreo o referencia" ${st.err.ref ? 'aria-invalid="true" aria-describedby="err-ref"' : ''} autocomplete="off" /></span>
          ${campoMonto('transferencia', c)}${btnAplicar('transferencia', c)}
        </div>
        ${st.err.ref ? `<p class="pas-error" id="err-ref">${st.err.ref}</p>` : ''}
        ${st.err.transferencia ? `<p class="pas-error" id="err-transferencia">${st.err.transferencia}</p>` : ''}
        <div class="pas-renglon pas-renglon--blanco"><span class="pas-renglon__lbl">Cuenta para depositar<small>CLABE 012 180 0012 3456 7890 · Ataskate Operaciones</small></span></div>`;
    } else if (abierto && m.id === 'efectivo') {
      const cambio = Math.max(0, r2(num(st.bor.efectivo.monto) - c.falta));
      cuerpo = `${st.err.efectivo ? `<p class="pas-error" id="err-efectivo">${st.err.efectivo}</p>` : ''}${chips('efectivo')}
        <div class="pas-renglon pas-renglon--blanco"><span class="pas-renglon__lbl">Cambio a entregar</span><span class="pas-renglon__monto pas-renglon__monto--accion" id="cambio-vivo" aria-live="polite">${mxn(cambio)}</span></div>`;
    } else if (abierto && m.id === 'ewallet') {
      cuerpo = `${st.err.ewallet ? `<p class="pas-error" id="err-ewallet">${st.err.ewallet}</p>` : ''}${chips('ewallet')}
        <div class="pas-renglon"><span class="pas-renglon__lbl">Saldo en Wallet</span><span class="pas-renglon__monto pas-renglon__monto--accion">${mxn(st.saldo)}</span></div>`;
    }
    return `<section class="pas-metodo${abierto ? ' is-abierto' : ''}" aria-label="${m.nombre}">
        <div class="pas-metodo__fila">
          <span class="pas-tile"><img src="${A(m.id)}" alt="" /></span>
          <div class="pas-metodo__txt"><p class="pas-metodo__nombre">${m.nombre}</p><p class="pas-metodo__desc">${desc}</p></div>
          ${enFila ? `<div class="pas-metodo__cobro">${campoMonto(m.id, c)}${btnAplicar(m.id, c)}</div>` : ''}
          ${chevron}
        </div>
        ${abierto || usado ? `<div class="pas-pagos" id="cuerpo-${m.id}">${cuerpo}${pagos.map(renglonPago).join('')}</div>` : ''}
      </section>`;
  };

  const seccionEntrega = () => {
    const arts = entregables();
    if (!arts.length) return '';
    const varias = st.modo === 'varias';
    const botones = varias
      ? `<button class="ds-btn ds-btn--secondary ds-btn--md pas-btn-ico" type="button" data-accion="modo" data-modo="una"><img src="${A('tienda')}" alt="" />Enviar a una dirección</button>`
      : `<button class="ds-btn ds-btn--secondary ds-btn--md pas-btn-ico" type="button" data-accion="nueva-dir"><img src="${A('mas')}" alt="" />Dirección</button>
         ${arts.length > 1 ? `<button class="ds-btn ds-btn--secondary ds-btn--md pas-btn-ico" type="button" data-accion="modo" data-modo="varias"><img src="${A('camion')}" alt="" />Varias direcciones</button>` : ''}`;
    let cuerpo;
    if (varias) {
      cuerpo = arts.map((it) => {
        const elegida = st.porArt[it.id] || 'sucursal';
        return `<div class="pas-metodo pas-art"><span class="pas-art__img">${imgArt(it)}</span>
          <div class="pas-metodo__txt"><p class="pas-metodo__nombre">${esc(it.titulo)}</p><p class="pas-metodo__desc">${esc(it.detalle || '')}</p>
            <div class="pas-chips" role="radiogroup" aria-label="Entrega de ${esc(it.titulo)}">${st.opciones.map((o) => `<button class="ds-chip ds-chip--choice${elegida === o.id ? ' ds-chip--on' : ''}" type="button" role="radio" aria-checked="${elegida === o.id}" data-accion="art-entrega" data-art="${esc(it.id)}" data-opcion="${o.id}">${esc(nombreOpcion(o))}</button>`).join('')}</div>
          </div></div>`;
      }).join('');
    } else {
      cuerpo = `<div role="radiogroup" aria-label="Dónde se entrega" class="pas-pagos">${st.opciones.map((o) => {
        const suc = o.tipo === 'sucursal';
        const s = sucursal();
        const t = suc ? s.nombre : (o.id === 'casa' ? 'Domicilio del cliente' : o.nombre);
        const d = suc ? (s.id === 'iztapalapa' ? 'Sucursal actual' : s.dir) : dirTexto(o);
        return `<label class="pas-metodo pas-opcion${st.opcion === o.id ? ' is-elegido' : ''}">
            <span class="ds-radio"><input type="radio" name="entrega" value="${o.id}" ${st.opcion === o.id ? 'checked' : ''} data-accion="opcion" /><span class="ds-radio__wrap"><span class="ds-radio__dot"></span></span></span>
            <span class="pas-tile"><img src="${A(suc ? 'ubicacion' : 'casa')}" alt="" /></span>
            <span class="pas-metodo__txt"><span class="pas-metodo__nombre">${esc(t)}${!suc && o.id === 'casa' ? `<span class="ds-tag ds-tag--gris pas-info">${esc(o.nombre)}</span>` : ''}</span><span class="pas-metodo__desc">${esc(d)}</span></span>
            <button class="ds-btn ds-btn--tertiary pas-ibtn" type="button" data-accion="editar-opcion" data-opcion="${o.id}" aria-label="Editar ${esc(t)}"><img src="${A('editar')}" alt="" /></button>
          </label>`;
      }).join('')}</div>`;
    }
    return `<section class="pas-card" aria-labelledby="tEntrega">
        <div class="pas-card__head"><div class="pas-card__titles"><h2 class="pas-card__title" id="tEntrega">Método de entrega</h2></div>
          <div class="pas-card__actions">${botones}</div></div>
        ${cuerpo}
      </section>`;
  };

  const resumen = (c, enRecibo) => `<div class="pas-desglose pas-desglose--costo"><dl>
      <div class="pas-fila"><dt><button class="pas-toggle" type="button" data-accion="desglose" aria-expanded="${st.desglose}">Subtotal (${c.n} art.)<img src="${A(st.desglose ? 'droplet-down' : 'droplet-up')}" alt="" /></button></dt><dd>${mxn(c.subtotal)}</dd></div>
      ${c.porTipo.map(([e, v]) => `<div class="pas-fila pas-fila--sub" data-desglose ${st.desglose ? '' : 'hidden'}><dt>${esc(e)}</dt><dd>${mxn(v)}</dd></div>`).join('')}
      <hr class="pas-sep" />
      <div class="pas-fila"><dt>IVA 16%</dt><dd>${mxn(c.iva)}</dd></div>
      <div class="pas-fila"><dt>Impuestos adicionales (IEPS)</dt><dd>${mxn(c.ieps)}</dd></div>
      <div class="pas-fila"><dt>Envío</dt><dd>${mxn(c.envio)}</dd></div>
      <hr class="pas-sep" />
      <div class="pas-fila pas-fila--total"><dt>Total</dt><dd>${mxn(c.total)} <small>MXN</small></dd></div>
    </dl></div>`;

  const aside = (c) => {
    const cli = st.carrito.cliente;
    const porMetodo = [];
    st.pagos.slice().reverse().forEach((p) => { const f = porMetodo.find((x) => x[0] === p.metodo); if (f) f[1] += p.monto; else porMetodo.push([p.metodo, p.monto]); });
    const negativo = c.total < 0;
    const dato = (t, d, cls) => `<div class="rc-dato${cls ? ' ' + cls : ''}"><dt>${t}</dt><dd>${d}</dd></div>`;
    return `<aside class="pas-aside" aria-label="Resumen del cobro">
      <section class="rc-card rc-resumen">
        <div class="rc-cli">
          <span class="ds-avatar" aria-hidden="true">${esc(iniciales(cli ? cli.nombre : 'Venta público'))}</span>
          <span class="rc-cli__txt"><b>${esc(cli ? cli.nombre : 'Venta al público')}</b><small>${cli ? 'Buen cliente' : 'Sin cliente asignado'}</small></span>
        </div>
        <div class="rc-bloque">
          <div class="rc-porcobrar" aria-live="polite"><span>${negativo ? 'Monto a entregar al cliente' : 'Monto a recibir de cliente'}</span><strong id="montoRecibir">${mxn(Math.max(0, c.falta))}</strong></div>
          ${st.pagos.length ? `<dl class="rc-datos">
            ${porMetodo.map(([m, v]) => dato(nombreMetodo(m), mxn(r2(v)))).join('')}
            ${c.falta > 0 ? dato('Asignación faltante', mxn(c.falta), 'rc-dato--falta') : dato('Total pagado', mxn(c.pagado), 'rc-dato--ok')}
            ${c.cambio > 0 ? dato('Cambio a entregar', mxn(c.cambio), 'rc-dato--fuerte') : ''}
          </dl>` : ''}
        </div>
        <div class="rc-bloque">
          <h2 class="rc-bloque__t">Resumen del cobro</h2>
          <dl class="rc-datos">
            <div class="rc-dato"><dt><button class="pas-toggle rc-toggle" type="button" data-accion="desglose" aria-expanded="${st.desglose}">Subtotal (${c.n} ${c.n === 1 ? 'artículo' : 'artículos'})<img src="${A(st.desglose ? 'droplet-down' : 'droplet-up')}" alt="" /></button></dt><dd>${mxn(c.subtotal)}</dd></div>
            ${c.porTipo.map(([e, v]) => `<div class="rc-dato rc-dato--sub" data-desglose ${st.desglose ? '' : 'hidden'}><dt>${esc(e)}</dt><dd>${mxn(v)}</dd></div>`).join('')}
            ${dato('IVA 16%', mxn(c.iva))}
            ${dato('IEPS', mxn(c.ieps))}
            ${dato('Envío', mxn(c.envio))}
          </dl>
          <div class="rc-total"><span>Total</span><strong>${mxn(c.total)} <small>MXN</small></strong></div>
        </div>
        <div class="rc-bloque rc-bloque--acciones">
          <button class="ds-btn ${c.falta <= 0 ? 'ds-btn--primary' : 'ds-btn--secondary'} ds-btn--md pas-procesar" type="button" data-accion="procesar" id="btnProcesar">Procesar</button>
          ${st.pagos.length ? `<button class="ds-btn ds-btn--tertiary ds-btn--md pas-cancelar" type="button" data-accion="cancelar-cobro">Cancelar</button>` : ''}
          <div class="pas-seguro"><span><img src="${A('admin-panel')}" alt="" />Operación protegida</span><i aria-hidden="true"></i><span><img src="${A('edificio')}" alt="" />Sucursal Centro · Caja 03</span></div>
        </div>
      </section>
    </aside>`;
  };

  const vistaCobro = () => {
    const c = cuentas();
    return `${crumbs('Pasarela de pago')}
      <div class="pas-head"><div class="pas-head__row"><h1 class="pas-title">Pasarela de pago</h1>${st.muestra ? '<span class="ds-tag ds-tag--amarillo pas-muestra" title="El carrito estaba vacío: se cargó un ejemplo para revisar la pasarela">Carrito de muestra</span>' : ''}</div></div>
      <div class="pas-layout">
        <div class="pas-col">
          <section class="pas-card" aria-labelledby="tCarrito">
            <div class="pas-card__titles"><h2 class="pas-card__title" id="tCarrito">Carrito</h2></div>
            <div class="pas-metodo${st.articulos ? ' is-abierto' : ''}">
              <div class="pas-metodo__fila"><span class="pas-tile"><img src="${A('articulos')}" alt="" /></span>
                <div class="pas-metodo__txt"><p class="pas-metodo__nombre">Artículos <span class="ds-tag ds-tag--gris pas-info">${c.n}</span></p><p class="pas-metodo__desc pas-metodo__desc--nowrap">${esc(c.porTipo.map((x) => x[0]).join(', '))}</p></div>
                <button class="ds-btn ds-btn--tertiary pas-ibtn" type="button" data-accion="articulos" aria-expanded="${st.articulos}" aria-controls="listaArt" aria-label="${st.articulos ? 'Ocultar' : 'Ver'} artículos"><img src="${A(st.articulos ? 'chevron-b' : 'chevron')}" alt="" /></button></div>
              <ul class="pas-lista" id="listaArt" ${st.articulos ? '' : 'hidden'}>${st.carrito.items.map((it) => `<li><span class="pas-art__img">${imgArt(it)}</span><span class="pas-lista__txt"><b>${esc(it.titulo)}</b><small>${esc(etiqueta(it.tipo))}${it.detalle ? ' · ' + esc(it.detalle) : ''}</small></span><span class="pas-lista__monto">${mxn(it.monto)}</span></li>`).join('')}</ul>
            </div>
          </section>
          <section class="pas-card" aria-labelledby="tMetodos">
            <div class="pas-card__titles"><h2 class="pas-card__title" id="tMetodos">Métodos de pago</h2></div>
            ${METODOS.map((m) => metodo(m, c)).join('')}
          </section>
          ${seccionEntrega()}
        </div>
        ${aside(c)}
      </div>`;
  };

  const vistaCargando = () => `<div class="pas-cargando" role="status" aria-live="polite"><span class="ds-spinner" aria-hidden="true"></span><p>Espera un momento...</p></div>`;

  const vistaRecibo = () => {
    const r = st.recibo;
    const cli = r.cliente;
    // contratos de empeño de la transacción (firma digital y ticket de empeño en ./contrato-firma.js)
    const ctrs = window.AtsContrato ? window.AtsContrato.contratosDe(r) : [];
    const ctrDe = (it) => ctrs.find((x) => x.item === it);
    const firmados = ctrs.filter((x) => window.AtsContrato.firmaDe(r, x.folio)).length;
    const pendientes = ctrs.length - firmados;
    const entregaDe = (it) => {
      const k = ctrDe(it);
      if (k) return 'Contrato ' + k.folio + ' · ' + k.articulos.length + (k.articulos.length === 1 ? ' prenda' : ' prendas') + ' · ' + (window.AtsContrato.firmaDe(r, k.folio) ? 'firmado' : 'firma pendiente');
      if (!SE_ENTREGA.includes(norm(it.tipo))) return it.contrato ? 'Contrato ' + it.contrato : (it.detalle || etiqueta(it.tipo));
      const o = r.entrega[it.id];
      return 'Entrega ' + (o === 'sucursal' || !o ? 'en sucursal' : 'a domicilio');
    };
    const sale = r.total < 0;
    const pagado = r2(r.pagos.reduce((s, p) => s + p.monto, 0));
    const fila = (ico, t, d, m) => `<li class="rc-fila">${ico}<span class="rc-fila__txt"><b>${t}</b><small>${d}</small></span><span class="rc-fila__monto">${m}</span></li>`;
    const arts = r.items.map((it) => fila(`<span class="pas-art__img rc-fila__img">${imgArt(it)}</span>`,
      esc(etiqueta(it.tipo) === 'Compra' || String(it.titulo).startsWith(etiqueta(it.tipo)) ? it.titulo : etiqueta(it.tipo) + ' · ' + it.titulo), esc(entregaDe(it)), mxn(it.monto))).join('');
    const pagos = r.pagos.map((p) => fila(`<span class="rc-fila__ico"><img src="${A(p.metodo)}" alt="" /></span>`,
      nombreMetodo(p.metodo), esc(p.detalle), mxn(p.monto))).join('');
    const dato = (t, d) => `<div class="rc-dato"><dt>${t}</dt><dd>${d}</dd></div>`;
    return `<div class="rc">
      <header class="rc-hero">
        <div class="rc-anim" aria-hidden="true">
          <img class="rc-anim__jag" src="assets/jaguar-atrapa.webp?v=1" alt="" width="96" height="140" />
          <span class="rc-anim__check"><svg viewBox="0 0 32 32" width="32" height="32"><circle cx="16" cy="16" r="15" /><path d="M9.5 16.5l4.2 4.2 8.8-9" /></svg></span>
        </div>
        <h1 tabindex="-1" id="tRecibo">Transacción registrada</h1>
        <p>${sale ? 'Se entregaron' : 'Se cobraron'} <b>${mxn(Math.abs(r.total))} MXN</b>${cli ? (sale ? ' a ' : ' de ') + '<b>' + esc(cli.nombre) + '</b>' : ' en venta al público'}</p>
        ${ctrs.length ? `<div class="rc-hero__estado">${pendientes
          ? `<span class="ds-tag ds-tag--amarillo">${pendientes === 1 ? 'Falta firmar el contrato' : 'Faltan ' + pendientes + ' contratos por firmar'}</span>`
          : `<span class="ds-tag ds-tag--verde">${ctrs.length === 1 ? 'Contrato firmado' : 'Contratos firmados'}</span>`}</div>` : ''}
        <div class="rc-hero__acciones">
          <button class="ds-btn ds-btn--secondary ds-btn--md pas-btn-ico" type="button" data-accion="compartir"><img src="${A('recibo')}" alt="" />Compartir recibo</button>
          ${ctrs.length
            ? `<button class="ds-btn ds-btn--secondary ds-btn--md pas-btn-ico" type="button" data-accion="ticket"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M16 8V5H8v3H6V3h12v5h-2zM4 10h16v7h-4v4H8v-4H4v-7zm6 9h4v-4h-4v4zm8-5.5a1 1 0 100-2 1 1 0 000 2z" fill="currentColor"/></svg>Ticket de empeño</button>
               ${pendientes
                 ? `<button class="ds-btn ds-btn--primary ds-btn--md pas-btn-ico" type="button" data-accion="firmar"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83a.996.996 0 000-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z" fill="currentColor"/></svg>${pendientes === ctrs.length && ctrs.length === 1 ? 'Firmar contrato' : 'Firmar contratos (' + firmados + '/' + ctrs.length + ')'}</button>`
                 : `<button class="ds-btn ds-btn--secondary ds-btn--md pas-btn-ico" type="button" data-accion="ver-contrato">Ver contrato</button>`}`
            : `<button class="ds-btn ds-btn--primary ds-btn--md pas-btn-ico" type="button" data-accion="imprimir"><img src="${A('imprimir')}" alt="" />Imprimir</button>`}
        </div>
      </header>
      <div class="rc-grid">
        <div class="rc-col">
          <section class="rc-card" aria-labelledby="tArts">
            <div class="rc-card__head"><h2 id="tArts">Artículos</h2><span class="ds-tag ds-tag--azul">${r.items.length} ${r.items.length === 1 ? 'artículo' : 'artículos'}</span></div>
            <ul class="rc-lista">${arts}</ul>
          </section>
          <section class="rc-card" aria-labelledby="tPagos">
            <div class="rc-card__head"><h2 id="tPagos">Pagos</h2><span class="ds-tag ds-tag--verde">Pagado completo</span></div>
            <ul class="rc-lista">${pagos}</ul>
            <dl class="rc-pie">
              <div class="rc-dato rc-dato--fuerte"><dt>Total pagado</dt><dd>${mxn(pagado)}</dd></div>
              ${r.c.cambio > 0 ? dato('Cambio entregado', mxn(r.c.cambio)) : ''}
            </dl>
          </section>
        </div>
        <aside class="rc-col" aria-label="Resumen del cobro">
          <section class="rc-card rc-resumen">
            <div class="rc-cli">
              <span class="ds-avatar" aria-hidden="true">${esc(iniciales(cli ? cli.nombre : 'Venta público'))}</span>
              <span class="rc-cli__txt"><b>${esc(cli ? cli.nombre : 'Venta al público')}</b><small>${cli ? 'Buen cliente · Cuenta Marketplace' : 'Sin cliente asignado'}</small></span>
              ${cli ? `<a class="rc-cli__link" href="../clientes/">Ver perfil</a>` : ''}
            </div>
            <div class="rc-bloque" aria-labelledby="tCobro">
              <h2 class="rc-bloque__t" id="tCobro">Resumen del cobro</h2>
              <dl class="rc-datos">
                ${dato('Subtotal (' + r.c.n + (r.c.n === 1 ? ' artículo)' : ' artículos)'), mxn(r.c.subtotal))}
                ${dato('IVA 16%', mxn(r.c.iva))}
                ${dato('IEPS', mxn(r.c.ieps))}
                ${dato('Envío', mxn(r.c.envio))}
              </dl>
              <div class="rc-total"><span>${sale ? 'Total entregado' : 'Total cobrado'}</span><strong>${mxn(Math.abs(r.c.total))} <small>MXN</small></strong></div>
            </div>
            <div class="rc-bloque" aria-labelledby="tOper">
              <h2 class="rc-bloque__t" id="tOper">Datos de la operación</h2>
              <dl class="rc-datos">
                ${dato('Folio', '<b>' + r.folio + '</b>')}
                ${dato('Fecha y hora', r.fecha)}
                ${dato('Sucursal', esc(r.sucursal))}
                ${dato('Caja', 'Caja 03')}
              </dl>
            </div>
          </section>
        </aside>
      </div>
    </div>`;
  };

  /* pinta la vista y devuelve el foco al mismo control (por id) */
  const render = () => {
    const act = document.activeElement;
    const id = act && $main.contains(act) ? (act.id || (act.dataset.accion ? '[data-accion="' + act.dataset.accion + '"]' + (act.dataset.metodo ? '[data-metodo="' + act.dataset.metodo + '"]' : '') + (act.dataset.id ? '[data-id="' + act.dataset.id + '"]' : '') + (act.dataset.opcion ? '[data-opcion="' + act.dataset.opcion + '"]' : '') + (act.dataset.art ? '[data-art="' + act.dataset.art + '"]' : '') : '')) : '';
    const sel = act && act.selectionStart != null ? [act.selectionStart, act.selectionEnd] : null;
    $main.innerHTML = st.vista === 'cobro' ? vistaCobro() : st.vista === 'cargando' ? vistaCargando() : vistaRecibo();
    if (id) {
      const el = id[0] === '[' ? $main.querySelector(id) : document.getElementById(id);
      if (el) { el.focus({ preventScroll: true }); if (sel && el.setSelectionRange) try { el.setSelectionRange(sel[0], sel[1]); } catch (e) { /* select */ } }
    }
  };

  /* ---------- modales (DS Modal · patrón .pos-plazos) con foco atrapado ---------- */
  let modalPrevio = null, modalCerrar = null;
  const cerrarModal = () => {
    if (!$modal.firstChild) return;
    $modal.innerHTML = '';
    modalCerrar = null;
    document.removeEventListener('keydown', teclasModal, true);
    if (modalPrevio && document.contains(modalPrevio)) modalPrevio.focus();
    else { const b = document.getElementById('btnProcesar'); if (b) b.focus(); }
  };
  const teclasModal = (e) => {
    const box = $modal.querySelector('.ds-modal');
    if (!box) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); if (modalCerrar) modalCerrar(); return; }
    if (e.key !== 'Tab') return;
    const f = [...box.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href]')].filter((x) => x.offsetParent !== null);
    if (!f.length) { e.preventDefault(); box.focus(); return; }
    const i = f.indexOf(document.activeElement);
    if (e.shiftKey && (i <= 0)) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && (i === f.length - 1 || i < 0)) { e.preventDefault(); f[0].focus(); }
  };
  const abrirModal = ({ titulo, sub, cuerpo, pie, alCerrar, foco, ancho }) => {
    if (!$modal.firstChild) modalPrevio = document.activeElement;
    modalCerrar = alCerrar || cerrarModal;
    $modal.innerHTML = `<div class="ds-modal-overlay" data-fondo>
        <div class="ds-modal pos-plazos pas-modal${ancho ? ' pas-modal--ancho' : ''}" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="mTitulo" ${sub ? 'aria-describedby="mSub"' : ''}>
          <div class="ds-modal__header"><div class="pos-plazos__titulos"><h2 class="ds-modal__title" id="mTitulo">${titulo}</h2>${sub ? `<p class="pos-plazos__sub" id="mSub">${sub}</p>` : ''}</div>
            <button class="pos-plazos__close" type="button" data-m="cerrar" aria-label="Cerrar">${CLOSE}</button></div>
          <div class="ds-modal__body">${cuerpo}</div>
          ${pie ? `<div class="ds-modal__footer">${pie}</div>` : ''}
        </div></div>`;
    document.removeEventListener('keydown', teclasModal, true);
    document.addEventListener('keydown', teclasModal, true);
    $modal.querySelector('[data-m="cerrar"]').addEventListener('click', () => modalCerrar());
    const box = $modal.querySelector('.ds-modal');
    const f = foco ? box.querySelector(foco) : null;
    (f || box).focus();
    return box;
  };

  /* terminal bancaria (pinpad) simulada */
  let terminalTimer = null;
  const modalTerminal = (fase, pago, opts = {}) => {
    clearTimeout(terminalTimer);
    const sub = 'El cliente tiene la transacción en su pinpad';
    const cancelar = () => { clearTimeout(terminalTimer); cerrarModal(); toast('neutral', 'Cobro cancelado', 'No se hizo ningún cargo a la tarjeta.'); };
    if (fase === 'procesando') {
      const box = abrirModal({ titulo: 'Registrando transacción', sub, alCerrar: cancelar, foco: '[data-m="cancelar"]',
        cuerpo: `<div class="pas-modal__centro" role="status" aria-live="polite"><p>Transacción procesándose</p><span class="ds-spinner ds-spinner--brand" aria-hidden="true"></span><p class="pas-modal__det">${esc(pago.detalle)} · ${mxn(pago.monto)}</p></div>`,
        pie: '<button class="ds-btn ds-btn--destructive ds-btn--md" type="button" data-m="cancelar">Cancelar transacción</button>' });
      box.querySelector('[data-m="cancelar"]').addEventListener('click', cancelar);
      /* "Terminal procesando" solo se ve como estado fijo desde el riel: el cobro real abre directo el resultado */
    } else if (fase === 'aprobada') {
      const aut = String(100000 + Math.floor(Math.random() * 899999));
      const guardar = () => { st.pagos.push({ ...pago, detalle: pago.detalle, aut }); st.bor.tarjeta = { tipo: '', monto: '' }; st.abierto = cuentas().falta > 0 ? 'tarjeta' : null; cerrarModal(); render(); toast('success', 'Pago con tarjeta aplicado', mxn(pago.monto) + ' · autorización ' + aut); };
      const box = abrirModal({ titulo: 'Registrando transacción', sub, alCerrar: guardar, foco: '[data-m="guardar"]',
        cuerpo: `<div class="pas-modal__centro" role="status"><p>Transacción aprobada</p><p class="pas-modal__det">${esc(pago.detalle)} · ${mxn(pago.monto)} · autorización ${aut}</p></div>`,
        pie: '<button class="ds-btn ds-btn--primary ds-btn--md" type="button" data-m="guardar">Guardar</button>' });
      box.querySelector('[data-m="guardar"]').addEventListener('click', guardar);
    } else {
      const rechazada = fase === 'rechazada';
      const box = abrirModal({ titulo: 'Registrando transacción', sub, foco: '[data-m="reintentar"]',
        cuerpo: `<div class="pas-modal__centro" role="alert"><p class="pas-modal__error">${rechazada ? 'Tarjeta rechazada por el banco' : 'No se pudo procesar la transacción'}</p><p class="pas-modal__det">${rechazada ? 'Pide otra tarjeta o cobra con otro método de pago. No se hizo ningún cargo.' : 'La terminal no respondió. Revisa la conexión del pinpad e intenta de nuevo.'}</p></div>`,
        pie: '<button class="ds-btn ds-btn--secondary ds-btn--md" type="button" data-m="cancelar">Cancelar</button><button class="ds-btn ds-btn--primary ds-btn--md" type="button" data-m="reintentar">Intentar de nuevo</button>' });
      box.querySelector('[data-m="cancelar"]').addEventListener('click', cerrarModal);
      box.querySelector('[data-m="reintentar"]').addEventListener('click', () => modalTerminal('procesando', pago));
    }
  };

  /* dirección de envío (nueva o editar) */
  const modalDireccion = (o) => {
    const d = o || { cp: '', calle: '', ext: '', int: '', colonia: '', alcaldia: '', estado: '', nombre: '' };
    const info = cpInfo(d.cp);
    const opt = (lista, val) => '<option value="" disabled ' + (val ? '' : 'selected') + '>Selecciona</option>' + lista.map((x) => `<option ${x === val ? 'selected' : ''}>${esc(x)}</option>`).join('');
    const campo = (id, lbl, val, extra = '') => `<label class="ds-field"><span class="ds-label">${lbl}</span><input class="ds-input--standalone" id="${id}" value="${esc(val)}" autocomplete="off" ${extra} /><span class="ds-helper ds-helper--error" id="${id}-err" hidden></span></label>`;
    const lista = (id, lbl, items, val) => `<label class="ds-field"><span class="ds-label">${lbl}</span><span class="pas-select"><select class="ds-select--standalone${val ? '' : ' is-vacio'}" id="${id}">${opt(items, val)}</select><img src="../assets/ds/KeyboardArrowDown.svg" alt="" /></span><span class="ds-helper ds-helper--error" id="${id}-err" hidden></span></label>`;
    const box = abrirModal({ titulo: 'Dirección de envío', sub: 'Los artículos pueden asignarse a cualquier dirección registrada.', foco: '#dCp',
      cuerpo: `<form class="pas-form" id="fDir" novalidate>
          ${campo('dCp', 'Código postal', d.cp, 'inputmode="numeric" maxlength="5"')}
          ${campo('dCalle', 'Calle', d.calle)}
          ${campo('dExt', 'No. exterior', d.ext)}
          ${campo('dInt', 'No. interior <span class="ds-label__optional">(opcional)</span>', d.int)}
          ${lista('dCol', 'Colonia', info ? info.colonias : [], d.colonia)}
          ${lista('dAlc', 'Alcaldía o municipio', info ? [info.alcaldia] : [], d.alcaldia)}
          ${lista('dEdo', 'Estado', ESTADOS, d.estado)}
          ${campo('dNom', 'Nombre del lugar', d.nombre, 'placeholder="Casa, oficina…"')}
        </form>`,
      pie: '<button class="ds-btn ds-btn--secondary ds-btn--md" type="button" data-m="cancelar">Cancelar</button><button class="ds-btn ds-btn--primary ds-btn--md" type="submit" form="fDir">Guardar</button>' });
    box.querySelector('[data-m="cancelar"]').addEventListener('click', cerrarModal);
    const $ = (s) => box.querySelector(s);
    box.querySelectorAll('select').forEach((s) => s.addEventListener('change', () => s.classList.toggle('is-vacio', !s.value)));
    $('#dCp').addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 5);
      const i = cpInfo(e.target.value);
      $('#dCol').innerHTML = opt(i ? i.colonias : [], i ? i.colonias[0] : '');
      $('#dAlc').innerHTML = opt(i ? [i.alcaldia] : [], i ? i.alcaldia : '');
      if (i) $('#dEdo').value = i.estado;
      box.querySelectorAll('select').forEach((s) => s.classList.toggle('is-vacio', !s.value));
    });
    $('#fDir').addEventListener('submit', (e) => {
      e.preventDefault();
      const v = { cp: $('#dCp').value.trim(), calle: $('#dCalle').value.trim(), ext: $('#dExt').value.trim(), int: $('#dInt').value.trim(), colonia: $('#dCol').value, alcaldia: $('#dAlc').value, estado: $('#dEdo').value, nombre: $('#dNom').value.trim() };
      const reglas = [['dCp', !/^\d{5}$/.test(v.cp), 'Escribe un código postal de 5 dígitos'], ['dCalle', !v.calle, 'Escribe la calle'], ['dExt', !v.ext, 'Escribe el número exterior'], ['dCol', !v.colonia, 'Elige la colonia'], ['dAlc', !v.alcaldia, 'Elige la alcaldía o municipio'], ['dEdo', !v.estado, 'Elige el estado'], ['dNom', !v.nombre, 'Ponle un nombre, por ejemplo Casa']];
      let primero = null;
      reglas.forEach(([id, mal, msg]) => {
        const el = $('#' + id), er = $('#' + id + '-err');
        el.classList.toggle('ds-input--error', mal); er.hidden = !mal; er.textContent = mal ? msg : '';
        if (mal) { el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', id + '-err'); if (!primero) primero = el; } else { el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby'); }
      });
      if (primero) { primero.focus(); return; }
      if (o) Object.assign(o, v); else { const n = { id: 'dir' + (++seq), tipo: 'dir', ...v }; st.opciones.push(n); st.opcion = n.id; }
      cerrarModal(); render(); toast('success', o ? 'Dirección actualizada' : 'Dirección agregada', v.nombre + ' · ' + v.calle + ' ' + v.ext);
    });
  };

  const modalSucursal = () => {
    const box = abrirModal({ titulo: 'Selecciona sucursal de recolecta', sub: 'Los artículos pueden ser recogidos en la sucursal seleccionada.', foco: '#sSuc',
      cuerpo: `<div class="pas-form pas-form--una"><label class="ds-field"><span class="ds-label">Sucursal seleccionada</span><span class="pas-select"><select class="ds-select--standalone" id="sSuc">${SUCURSALES.map((s) => `<option value="${s.id}" ${s.id === st.sucursal ? 'selected' : ''}>${esc(s.nombre)} - ${esc(s.dir)}</option>`).join('')}</select><img src="../assets/ds/KeyboardArrowDown.svg" alt="" /></span></label></div>`,
      pie: '<button class="ds-btn ds-btn--secondary ds-btn--md" type="button" data-m="cancelar">Cancelar</button><button class="ds-btn ds-btn--primary ds-btn--md" type="button" data-m="guardar">Guardar</button>' });
    box.querySelector('[data-m="cancelar"]').addEventListener('click', cerrarModal);
    box.querySelector('[data-m="guardar"]').addEventListener('click', () => { st.sucursal = box.querySelector('#sSuc').value; st.opcion = 'sucursal'; cerrarModal(); render(); toast('success', 'Sucursal de recolecta actualizada', sucursal().nombre); });
  };

  const modalCancelarCobro = () => {
    const box = abrirModal({ titulo: '¿Cancelar el cobro?', sub: 'Se quitan los pagos aplicados. Los cobros con tarjeta se reversan en la terminal; el carrito se conserva.', foco: '[data-m="volver"]',
      cuerpo: '', pie: '<button class="ds-btn ds-btn--secondary ds-btn--md" type="button" data-m="volver">Volver</button><button class="ds-btn ds-btn--destructive ds-btn--md" type="button" data-m="si">Cancelar cobro</button>' });
    box.querySelector('[data-m="volver"]').addEventListener('click', cerrarModal);
    box.querySelector('[data-m="si"]').addEventListener('click', () => { st.saldo = saldoWallet; st.pagos = []; st.abierto = null; cerrarModal(); render(); toast('neutral', 'Cobro cancelado', 'Se quitaron los pagos aplicados.'); });
  };

  /* ---------- acciones ---------- */
  const aplicar = (m) => {
    const c = cuentas();
    const b = st.bor[m];
    const monto = num(b.monto);
    st.err = {};
    if (m === 'tarjeta' && !b.tipo) st.err.tarjetaTipo = 'Elige si es débito o crédito';
    if (!(monto > 0)) st.err[m] = 'Escribe el monto a cobrar';
    else if (m !== 'efectivo' && monto > c.falta) st.err[m] = 'El monto no puede ser mayor a lo que falta: ' + mxn(c.falta);
    else if (m === 'ewallet' && monto > st.saldo) st.err[m] = 'Saldo insuficiente en la eWallet: disponible ' + mxn(st.saldo);
    if (m === 'transferencia' && !/^[A-Za-z0-9-]{6,}$/.test(b.ref.trim())) st.err.ref = 'Escribe la clave de rastreo (mínimo 6 caracteres, sin espacios)';
    if (Object.keys(st.err).length) {
      render();
      const f = $main.querySelector('[aria-invalid="true"]'); if (f) f.focus();
      return;
    }
    if (m === 'tarjeta') { modalTerminal(sim.terminal === 'ok' ? 'aprobada' : sim.terminal, { id: 'p' + (++seq), metodo: m, monto, detalle: b.tipo }); return; }
    if (m === 'transferencia') {
      {
        st.pagos.push({ id: 'p' + (++seq), metodo: m, monto, detalle: 'Ref. ' + b.ref.trim().toUpperCase() });
        st.bor.transferencia = { monto: '', ref: '' };
        if (cuentas().falta <= 0) st.abierto = null;
        render(); toast('success', 'Transferencia validada', mxn(monto) + ' · ref. ' + b.ref.trim().toUpperCase());
      }
      return;
    }
    if (m === 'efectivo') {
      const cobra = Math.min(monto, c.falta), cambio = r2(monto - cobra);
      st.pagos.push({ id: 'p' + (++seq), metodo: m, monto: cobra, recibido: monto, cambio, detalle: 'Efectivo recibido' });
      st.bor.efectivo = { monto: '' };
      if (cuentas().falta <= 0) st.abierto = null;
      render(); toast('success', 'Pago en efectivo aplicado', cambio > 0 ? 'Entrega ' + mxn(cambio) + ' de cambio al cliente.' : mxn(cobra));
      return;
    }
    st.saldo = r2(st.saldo - monto);
    st.pagos.push({ id: 'p' + (++seq), metodo: m, monto, detalle: 'Saldo eWallet' });
    st.bor.ewallet = { monto: '' };
    st.abierto = null;
    render(); toast('success', 'Pago con eWallet aplicado', mxn(monto));
  };

  const procesar = () => {
    const c = cuentas();
    if (c.falta > 0) {
      toast('error', 'Falta asignar ' + mxn(c.falta), 'Aplica uno o más métodos de pago hasta cubrir el total.');
      if (!st.abierto) { st.abierto = 'efectivo'; render(); }
      const f = $main.querySelector('#monto-' + st.abierto) || $main.querySelector('[data-accion="abrir"]');
      if (f) f.focus();
      return;
    }
    {
      if (sim.registro === 'error') { st.vista = 'cobro'; render(); toast('error', 'No se pudo registrar la operación', 'Los pagos siguen aplicados. Intenta de nuevo.'); const b = document.getElementById('btnProcesar'); if (b) b.focus(); return; }
      generarRecibo(true);
    }
  };

  const generarRecibo = (vaciar) => {
    const ab = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', pick = (n) => Array.from({ length: n }, () => ab[Math.floor(Math.random() * ab.length)]).join('');
    const ahora = new Date();
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const entrega = {};
    entregables().forEach((it) => { entrega[it.id] = st.modo === 'varias' ? (st.porArt[it.id] || 'sucursal') : st.opcion; });
    st.recibo = {
      folio: 'OP-' + pick(4) + '-' + pick(4),
      fecha: ahora.getDate() + ' ' + meses[ahora.getMonth()] + ' ' + ahora.getFullYear() + ', ' + String(ahora.getHours()).padStart(2, '0') + ':' + String(ahora.getMinutes()).padStart(2, '0'),
      sucursal: 'Multi apoyo Iztapalapa', cliente: st.carrito.cliente, items: st.carrito.items.slice(), pagos: st.pagos.slice(), c: cuentas(), total: cuentas().total, entrega,
      creado: ahora.getTime(), firmas: {},
    };
    st.vista = 'recibo';
    if (vaciar) { vaciarCarrito(); pintarContador(0); }
    render();
    const h = document.getElementById('tRecibo'); if (h) h.focus();
    window.scrollTo(0, 0);
  };

  $main.addEventListener('click', (e) => {
    const t = e.target.closest('[data-accion]');
    if (!t || t.disabled) return;
    const a = t.dataset.accion, m = t.dataset.metodo;
    if (a !== 'menu' && st.menu && a !== 'quitar') { st.menu = null; }
    switch (a) {
      case 'abrir': st.abierto = st.abierto === m ? null : m; st.err = {}; render(); break;
      case 'articulos': st.articulos = !st.articulos; render(); break;
      case 'desglose': st.desglose = !st.desglose; render(); break;
      case 'aplicar': aplicar(m); break;
      case 'rapido': st.bor[m].monto = mxn(r2(num(st.bor[m].monto) + Number(t.dataset.valor))); st.err[m] = ''; render(); break;
      case 'exacto': { const c = cuentas(); st.bor[m].monto = mxn(m === 'ewallet' ? Math.min(c.falta, st.saldo) : Math.max(0, c.falta)); st.err[m] = ''; render(); break; }
      case 'menu': st.menu = st.menu === t.dataset.id ? null : t.dataset.id; render(); { const it = $main.querySelector('.pas-menu:not([hidden]) [role="menuitem"]'); if (it) it.focus(); } break;
      case 'quitar': {
        const p = st.pagos.find((x) => x.id === t.dataset.id);
        st.pagos = st.pagos.filter((x) => x !== p); st.menu = null;
        if (p && p.metodo === 'ewallet') st.saldo = r2(st.saldo + p.monto);
        render(); toast('neutral', 'Pago quitado', p ? nombreMetodo(p.metodo) + ' · ' + mxn(p.monto) : '');
        const b = $main.querySelector('[data-accion="abrir"][data-metodo="' + (p ? p.metodo : 'tarjeta') + '"]'); if (b) b.focus();
        break;
      }
      case 'procesar': procesar(); break;
      case 'cancelar-cobro': modalCancelarCobro(); break;
      case 'nueva-dir': modalDireccion(null); break;
      case 'editar-opcion': {
        e.preventDefault();
        const o = st.opciones.find((x) => x.id === t.dataset.opcion);
        if (o && o.tipo === 'sucursal') modalSucursal(); else modalDireccion(o);
        break;
      }
      case 'opcion': st.opcion = t.value; render(); break;
      case 'modo': st.modo = t.dataset.modo; render(); { const b = $main.querySelector('[data-accion="modo"]'); if (b) b.focus(); } break;
      case 'art-entrega': st.porArt[t.dataset.art] = t.dataset.opcion; render(); break;
      case 'imprimir': window.print(); break;
      case 'firmar': case 'ver-contrato': case 'ticket': {
        if (!window.AtsContrato || !st.recibo) break;
        // al firmar se repinta el recibo (cambia el botón); al cerrar, contrato-firma.js avisa con "ats-contrato-cerrado"
        const alCambiar = () => { render(); };
        if (a === 'firmar') window.AtsContrato.firmar({ recibo: st.recibo, alCambiar });
        if (a === 'ver-contrato') window.AtsContrato.ver({ recibo: st.recibo });
        if (a === 'ticket') window.AtsContrato.ticket({ recibo: st.recibo });
        break;
      }
      case 'compartir': {
        const tel = st.recibo && st.recibo.cliente && st.recibo.cliente.telefono;
        toast('success', 'Recibo compartido', tel ? 'Se envió por WhatsApp al número que termina en ' + String(tel).slice(-4) + '.' : 'Se copió el enlace del recibo.');
        break;
      }
      default: break;
    }
  });
  // el botón que abrió la firma se repintó: el foco vuelve a la acción del contrato que quedó en el encabezado
  window.addEventListener('ats-contrato-cerrado', () => {
    const b = $main.querySelector('[data-accion="firmar"]') || $main.querySelector('[data-accion="ver-contrato"]') || $main.querySelector('[data-accion="ticket"]');
    if (b) b.focus();
  });
  // cerrar el menú ⋮ con clic afuera o Esc
  document.addEventListener('click', (e) => { if (st.menu && !e.target.closest('.pas-menu-wrap')) { st.menu = null; render(); } });
  $main.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && st.menu) { const id = st.menu; st.menu = null; render(); const b = $main.querySelector('[data-accion="menu"][data-id="' + id + '"]'); if (b) b.focus(); }
    if (e.key === 'Enter' && e.target.matches('input[data-borrador]')) { e.preventDefault(); aplicar(e.target.dataset.borrador); }
  });
  // borradores: escribir no vuelve a pintar todo (solo el cambio en vivo); al salir del campo se da formato de moneda
  $main.addEventListener('input', (e) => {
    const t = e.target;
    if (!t.dataset.borrador) return;
    st.bor[t.dataset.borrador][t.dataset.campo] = t.value;
    if (t.dataset.borrador === 'efectivo') { const v = document.getElementById('cambio-vivo'); if (v) v.textContent = mxn(Math.max(0, r2(num(t.value) - cuentas().falta))); }
  });
  $main.addEventListener('change', (e) => {
    const t = e.target;
    if (t.dataset.borrador && t.tagName === 'SELECT') { st.bor[t.dataset.borrador][t.dataset.campo] = t.value; st.err.tarjetaTipo = ''; render(); }
    if (t.matches('input[name="entrega"]')) { st.opcion = t.value; render(); }
  });
  $main.addEventListener('focusout', (e) => {
    const t = e.target;
    if (t.dataset.campo === 'monto' && t.value.trim()) { const v = num(t.value); t.value = v > 0 ? mxn(v) : ''; st.bor[t.dataset.borrador].monto = t.value; }
  });

  /* ---------- "Estados de la maqueta" ---------- */
  const tope = (v, c) => Math.min(v, r2(Math.max(0, c.total) * 0.6));
  const ESTADOS_PROTO = {
    inicio: () => {},
    parcial: () => { const c = cuentas(); st.pagos.push({ id: 'p' + (++seq), metodo: 'tarjeta', monto: tope(10000, c), detalle: 'Débito' }); st.abierto = 'tarjeta'; },
    dividido: () => { ESTADOS_PROTO.parcial(); const w = Math.min(st.saldo, cuentas().falta); if (w > 0) { st.saldo = r2(st.saldo - w); st.pagos.push({ id: 'p' + (++seq), metodo: 'ewallet', monto: w, detalle: 'Saldo eWallet' }); } st.abierto = null; },
    efectivo: () => { ESTADOS_PROTO.dividido(); st.abierto = 'efectivo'; st.bor.efectivo.monto = mxn(r2(cuentas().falta + 500)); },
    completo: () => { ESTADOS_PROTO.dividido(); const f = cuentas().falta; if (f > 0) st.pagos.push({ id: 'p' + (++seq), metodo: 'efectivo', monto: f, recibido: f, cambio: 0, detalle: 'Efectivo recibido' }); st.abierto = null; },
    'por-articulo': () => { ESTADOS_PROTO.completo(); st.modo = entregables().length > 1 ? 'varias' : 'una'; const a = entregables(); if (a[1] && st.opciones[1]) st.porArt[a[1].id] = st.opciones[1].id; },
    terminal: () => { st.abierto = 'tarjeta'; st.bor.tarjeta = { tipo: 'Débito', monto: mxn(tope(10000, cuentas())) }; },
    rechazada: () => ESTADOS_PROTO.terminal(),
    'error-terminal': () => ESTADOS_PROTO.terminal(),
    cargando: () => { ESTADOS_PROTO.completo(); st.vista = 'cargando'; },
    recibo: () => {
      const c = cuentas();
      if (c.total >= 0) { ESTADOS_PROTO.completo(); return; }
      // empeño: el préstamo se le entrega al cliente (parte por transferencia y el resto en efectivo)
      const total = Math.abs(c.total), spei = Math.min(10000, total);
      st.pagos.push({ id: 'p' + (++seq), metodo: 'transferencia', monto: spei, detalle: 'Transferencia SPEI · cuenta ••• 4821' });
      if (total > spei) st.pagos.push({ id: 'p' + (++seq), metodo: 'efectivo', monto: r2(total - spei), recibido: 0, cambio: 0, detalle: 'Efectivo entregado' });
    },
  };
  const irA = (nombre) => {
    clearTimeout(terminalTimer); cerrarModal();
    const carrito = st.carrito, muestra = st.muestra;
    reiniciar(); st.carrito = carrito; st.muestra = muestra;
    if (nombre === 'recibo-empeno') { st.carrito = JSON.parse(JSON.stringify(MUESTRA_EMPENO)); st.muestra = true; ESTADOS_PROTO.recibo(); generarRecibo(false); return; }
    (ESTADOS_PROTO[nombre] || (() => {}))();
    if (nombre === 'recibo') { generarRecibo(false); return; }
    render();
    const pago = { id: 'p' + (++seq), metodo: 'tarjeta', monto: num(st.bor.tarjeta.monto), detalle: 'Débito' };
    if (nombre === 'terminal') modalTerminal('procesando', pago, { fija: true });
    if (nombre === 'rechazada') modalTerminal('rechazada', pago);
    if (nombre === 'error-terminal') modalTerminal('error', pago);
  };
  const $p = (id) => document.getElementById(id);
  $p('protoEstado').addEventListener('change', (e) => { if (e.target.value) irA(e.target.value); });
  $p('protoTerminal').addEventListener('change', (e) => { sim.terminal = e.target.value; });
  $p('protoRegistro').addEventListener('change', (e) => { sim.registro = e.target.value; });
  $p('protoWallet').addEventListener('change', (e) => { saldoWallet = Number(e.target.value); st.saldo = r2(saldoWallet - st.pagos.filter((p) => p.metodo === 'ewallet').reduce((s, p) => s + p.monto, 0)); if (st.vista === 'cobro') render(); });
  $p('protoMuestra').addEventListener('click', () => { clearTimeout(terminalTimer); cerrarModal(); reiniciar(true); render(); toast('success', 'Carrito de muestra cargado', '4 artículos de ejemplo para revisar la pasarela.'); });

  // si otra pestaña o el carrito cambia mientras no hay pagos, se vuelve a leer
  window.addEventListener('ats-carrito', () => { if (st.vista === 'cobro' && !st.pagos.length) { reiniciar(qs.get('muestra') === '1'); render(); } });

  reiniciar(qs.get('muestra') === '1');
  if (qs.get('estado') && (ESTADOS_PROTO[qs.get('estado')] || qs.get('estado') === 'recibo-empeno')) irA(qs.get('estado')); else render();
})();
