/* Cotizador de empeño (Operativo) = PawnQuoterV4 del repo del equipo (develop), con datos ficticios.
   Paso 1 "Cotización de artículo": contratos con artículos (arrastrar entre contratos, crear contrato, buscar en el catálogo)
   y a la derecha la evaluación del artículo elegido (Características del artículo + Préstamo a dar).
   Paso 2 "Selección de plazos": la lista queda de solo lectura, se elige un plazo por contrato, cotitulares/beneficiarios
   y extender fecha de pago; "Agregar a carrito" valida la info legal de la empresa y el cliente vinculado.
   Lo que en la app contesta un servicio (catálogo, características, estados de conservación, avalúo de metales, precio de venta,
   validar contrato, plazos y su tabla de pagos, clientes) aquí lo simula SRV con las mismas formas y reglas. */
(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // numberToCurrency de la app: $8,000.00 · formatCurrency sin centavos: $12,285
  const money = (n) => '$' + Number(n || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const money0 = (n) => '$' + Math.round(Number(n || 0)).toLocaleString('es-MX');
  const num = (v) => { const n = parseFloat(String(v).replace(/[^0-9.]/g, '')); return Number.isFinite(n) ? n : null; };
  const sinAcentos = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  /* ---------- iconos (Material, los del DS) ---------- */
  const P = (d) => `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${d}" fill="currentColor"/></svg>`;
  const ICO = {
    tag: P('M21.41 11.41 12.58 2.58A2 2 0 0 0 11.17 2H4a2 2 0 0 0-2 2v7.17a2 2 0 0 0 .59 1.41l8.83 8.83a2 2 0 0 0 2.83 0l7.16-7.17a2 2 0 0 0 0-2.83ZM12.83 20 4 11.17V4h7.17L20 12.83 12.83 20ZM6.5 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z'),
    add: P('M11 13H5v-2h6V5h2v6h6v2h-6v6h-2v-6Z'),
    menos: P('M5 13v-2h14v2H5Z'),
    close: P('M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19Z'),
    trash: P('M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21H7ZM17 6H7v13h10V6ZM9 17h2V8H9v9Zm4 0h2V8h-2v9Z'),
    drag: P('M9 20a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm-6-6a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4ZM9 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z'),
    down: P('M12 15.4 6 9.4 7.4 8l4.6 4.6L16.6 8 18 9.4l-6 6Z'),
    next: P('M12.6 12 8 7.4 9.4 6l6 6-6 6L8 16.6l4.6-4.6Z'),
    back: P('M16 22 6 12 16 2l1.775 1.775L9.55 12l8.225 8.225L16 22Z'),
    search: P('M19.6 21 13.3 14.7q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3-1.4 1.4ZM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5 6.313 6.313 5 9.5t1.313 3.188T9.5 14Z'),
    upload: P('M11 16V7.85l-2.6 2.6L7 9l5-5 5 5-1.4 1.45-2.6-2.6V16h-2Zm-5 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20H6Z'),
    sparkle: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.77 21C15.893 16.351 17.256 14.901 21 13.636 17.066 12.308 15.84 10.696 14.77 6.273 13.646 10.922 12.282 12.371 8.538 13.636 12.468 14.963 13.701 16.586 14.769 21M6.461 11.182C6.973 8.762 7.963 7.67 9.922 7.091 7.963 6.512 6.973 5.42 6.462 3 5.972 5.315 5.047 6.485 3 7.09 4.959 7.67 5.949 8.762 6.461 11.182Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    personAdd: P('M18 14v-3h-3V9h3V6h2v3h3v2h-3v3h-2Zm-9-2q-1.65 0-2.825-1.175T5 8t1.175-2.825T9 4t2.825 1.175T13 8t-1.175 2.825T9 12Zm-8 8v-2.8q0-.85.438-1.562T2.6 14.55q1.55-.775 3.15-1.163T9 13t3.25.388 3.15 1.162q.725.375 1.163 1.088T17 17.2V20H1Zm2-2h12v-.8q0-.275-.137-.5t-.363-.35q-1.35-.675-2.725-1.012T9 15t-2.775.338T3.5 16.35q-.225.125-.363.35T3 17.2v.8Zm6-8q.825 0 1.413-.588T11 8t-.587-1.412T9 6t-1.412.588T7 8t.588 1.413T9 10Z'),
    ok: P('M10.6 16.6l7.05-7.05-1.4-1.4-5.65 5.65-2.85-2.85-1.4 1.4 4.25 4.25ZM12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Z'),
    // EstadosMisc del DS: reloj en círculo (sección pendiente)
    pend: P('M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Zm3.3-5.3 1.4-1.4-3.7-3.7V7h-2v5.4l4.3 4.3Z'),
    warn: P('M1 21 12 2l11 19H1Zm3.45-2h15.1L12 6 4.45 19ZM12 18q.425 0 .713-.288T13 17t-.288-.712T12 16t-.712.288T11 17t.288.713T12 18Zm-1-3h2v-5h-2v5Z'),
    err: P('M12 17q.425 0 .713-.288T13 16t-.288-.712T12 15t-.712.288T11 16t.288.713T12 17Zm-1-4h2V7h-2v6Zm1 9a10 10 0 1 1 0-20 10 10 0 0 1 0 20Z'),
    x: P('M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19Z'),
    edit: P('M5 19h1.425L16.2 9.225 14.775 7.8 5 17.575V19Zm-2 2v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15.775.15.65.45L20.425 5q.3.275.437.65T21 6.4q0 .4-.138.763t-.437.662L7.25 21H3ZM15.475 8.525l-.7-.725 1.425 1.425-.725-.7Z'),
    card: P('M22 6v12q0 .825-.587 1.413T20 20H4q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6ZM4 8h16V6H4v2Zm0 4v6h16v-6H4Z'),
    mail: P('M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20H4Zm8-7L4 8v10h16V8l-8 5Zm0-2 8-5H4l8 5Z'),
    call: P('M19.95 21q-3.125 0-6.175-1.362t-5.55-3.863-3.862-5.55T3 4.05q0-.45.3-.75t.75-.3H8.1q.35 0 .625.238t.325.562l.65 3.5q.05.4-.025.675T9.4 8.45L6.975 10.9q.5.925 1.187 1.787t1.513 1.663q.775.775 1.625 1.438T13.1 17l2.35-2.35q.225-.225.588-.337t.712-.063l3.45.7q.35.1.575.363T21 15.9v4.05q0 .45-.3.75t-.75.3Z'),
    atm: P('M11 17h2v-1h1q.425 0 .713-.288T15 15v-3q0-.425-.288-.712T14 11h-3v-1h4V8h-2V7h-2v1h-1q-.425 0-.712.288T9 9v3q0 .425.288.713T10 13h3v1H9v2h2v1Zm-7 3q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20H4Zm0-2h16V6H4v12Z'),
    paid: P('M11.025 21v-2.15q-1.325-.3-2.287-1.15t-1.413-2.4l1.85-.75q.375 1.2 1.113 1.825t1.937.625q1.025 0 1.738-.462t.712-1.438q0-.875-.55-1.387t-2.55-1.163q-2.15-.675-2.95-1.612t-.8-2.288q0-1.625 1.05-2.525t2.15-1.025V3h2v2.1q1.25.2 2.063.912t1.187 1.738l-1.85.8q-.3-.8-.85-1.2t-1.5-.4q-1.1 0-1.675.488T10.8 8.65q0 .825.75 1.3t2.6 1q1.725.5 2.613 1.588t.887 2.512q0 1.775-1.05 2.7t-2.575 1.15V21h-2Z'),
    perfil: P('M10 12q-1.65 0-2.825-1.175T6 8t1.175-2.825T10 4t2.825 1.175T14 8t-1.175 2.825T10 12Zm-8 8v-2.8q0-.825.425-1.55t1.175-1.1q1.275-.65 2.875-1.1T10 13h.35q.15 0 .3.05-.2.45-.338.938T10.1 15H10q-1.775 0-3.187.45T4.5 16.35q-.225.125-.363.35T4 17.2v.8h6.3q.15.525.4 1.038t.55.962H2Zm14 1-.3-1.5q-.3-.125-.562-.262T14.6 18.9l-1.45.45-1-1.7 1.15-1q-.05-.35-.05-.65t.05-.65l-1.15-1 1-1.7 1.45.45q.275-.2.538-.337T15.7 12.5L16 11h2l.3 1.5q.3.125.563.275t.537.375l1.45-.5 1 1.75-1.15 1q.05.3.05.625t-.05.625l1.15 1-1 1.7-1.45-.45q-.275.2-.537.338T18.3 19.5L18 21h-2Zm1-3q.825 0 1.413-.587T19 16t-.587-1.412T17 14t-1.412.588T15 16t.588 1.413T17 18Zm-7-8q.825 0 1.413-.588T12 8t-.587-1.412T10 6t-1.412.588T8 8t.588 1.413T10 10Z'),
  };
  const ico = (k, size = 20, cls = '') => `<span class="cot-ico cot-ico--${size}${cls ? ' ' + cls : ''}">${ICO[k] || ''}</span>`;

  /* ---------- textos (copiados de PAWN_QUOTER_V4_TEXT y de los constants de cada HU) ---------- */
  const T = {
    listado: 'Listado de artículos', addContrato: 'Contrato', addArticulo: 'Artículo', total: 'Total a prestar',
    selPlazos: 'Seleccionar plazos', crearZona: 'Haz clic o arrastra para crear un contrato con artículos', soltar: 'Arrastra para agregar aquí',
    noArrastrar: 'No puedes arrastrar aquí', sinResultados: 'Sin resultados para esta búsqueda', errorBusqueda: 'No se pudo buscar artículos, intenta de nuevo',
    reqTitulo: 'Campos requeridos', reqTexto: 'Completa todos los campos requeridos para continuar con la cotización.',
    vacioPanel: 'Selecciona un artículo para comenzar la cotización.',
    car: 'Características del artículo', carSub: 'Completa para calcular el avalúo', carVacio: 'Este artículo no tiene características configuradas.',
    notas: 'Agregar notas', notasLbl: 'Descripción', opcional: ' (Opcional)',
    pre: 'Préstamo a dar', preSub: 'Define cuánto se le prestará al cliente', estado: 'Estado', avaluo: 'Avalúo', prestamo: 'Préstamo',
    venta: 'Precio de venta', maxPct: 'Maximo de préstamo', selecciona: 'Selecciona',
    obligatorio: 'Este campo es obligatorio', soloNumeros: 'Solo se permiten números', supera: 'Supera el porcentaje permitido',
    ofertaT: 'Personaliza la oferta', ofertaD: '. Conecta un cliente para aplicar plazos especiales.', vincula: 'Vincula un cliente',
    plazosT: 'Selección de plazos', cotit: 'Cotitulares/beneficiarios', extender: 'Extender fecha de pago',
    errExt: 'Selecciona un plazo antes de extender la fecha de pago', errCotit: 'Vincula un cliente antes de agregar cotitulares o beneficiarios',
    errCliente: 'Vincula un cliente antes de agregar la cotización al carrito',
    errLegal: 'No es posible continuar: falta información legal de la empresa. Complétala antes de agregar la cotización al carrito.',
    carrito: 'Agregar a carrito', paso1: 'Cotización de artículo',
  };

  /* ========== SRV: lo que en la app contesta cada servicio (datos ficticios) ========== */
  const ONZA_TROY = 31.1035;
  const precioGramoOro = (() => {           // tabulador de la sucursal (si viene por onza se pasa a gramo)
    try { const t = window.TB_DATOS && window.TB_DATOS.tabulador(12); if (t) return t.unitOfMeasure === 'Onza' ? t.basePrice / ONZA_TROY : t.basePrice; } catch (e) { /* respaldo */ }
    return 2182.66;
  })();
  const precioGramoPlata = 610 / ONZA_TROY;  // ficticio, por onza troy de plata fina
  const props = {
    oro: [{ id: 1, tipo: 3, nombre: 'Kilates', valores: ['10K', '14K', '18K', '21K', '22K', '24K'], obl: true }, { id: 2, tipo: 2, nombre: 'Peso de la prenda (g)', obl: true }, { id: 3, tipo: 2, nombre: 'Peso de accesorios (g)', obl: false }],
    plata: [{ id: 1, tipo: 3, nombre: 'Ley', valores: ['.925', '.950'], obl: true }, { id: 2, tipo: 2, nombre: 'Peso de la prenda (g)', obl: true }, { id: 3, tipo: 2, nombre: 'Peso de accesorios (g)', obl: false }],
    general: (marcas) => [{ id: 14, tipo: 1, nombre: 'Modelo', obl: true }, { id: 15, tipo: 1, nombre: 'Número de serie', obl: true }, { id: 13, tipo: 2, nombre: 'Año', obl: false }, { id: 12, tipo: 4, nombre: 'Incluye cargador o accesorios', obl: false }, { id: 11, tipo: 3, nombre: 'Marca', valores: marcas, obl: true }],
  };
  // autos: la marca y el modelo son el artículo del catálogo ("Nissan Versa"); sus propiedades dinámicas (tipo 1 texto, 2 número,
  // 3 lista, 4 casilla) son las mismas para todos los modelos, en el orden en que se capturan
  const AUTO = [
    { id: 23, tipo: 3, nombre: 'Año', valores: Array.from({ length: 15 }, (_, i) => String(2026 - i)), obl: true },
    { id: 24, tipo: 1, nombre: 'Versión', obl: false },
    { id: 25, tipo: 3, nombre: 'Transmisión', valores: ['Automática', 'Manual'], obl: true },
    { id: 26, tipo: 3, nombre: 'Combustible', valores: ['Gasolina', 'Diésel', 'Híbrido', 'Eléctrico'], obl: true },
    { id: 27, tipo: 3, nombre: 'Color', valores: ['Blanco', 'Negro', 'Gris', 'Plata', 'Rojo', 'Azul', 'Otro'], obl: false },
    { id: 28, tipo: 2, nombre: 'Kilometraje (km)', obl: true },
    { id: 29, tipo: 1, nombre: 'Número de serie (NIV)', obl: true },
    { id: 30, tipo: 1, nombre: 'Placas', obl: true },
    { id: 31, tipo: 1, nombre: 'Número de motor', obl: false },
    { id: 32, tipo: 4, nombre: 'Factura original', obl: false },
    { id: 33, tipo: 4, nombre: 'Tarjeta de circulación vigente', obl: false },
    { id: 34, tipo: 4, nombre: 'Verificación vigente', obl: false },
    { id: 35, tipo: 4, nombre: 'Tenencias o refrendos pagados', obl: false },
    { id: 36, tipo: 4, nombre: 'Sin reporte de robo (REPUVE)', obl: false },
    { id: 37, tipo: 4, nombre: 'Duplicado de llaves', obl: false },
    { id: 38, tipo: 4, nombre: 'Llanta de refacción y herramienta', obl: false },
  ];
  const CATALOGO = [
    { id: 501, nombre: 'Anillo de oro', ruta: ['Joyas y relojes', 'Joyería', 'Oro'], tipo: 'oro' },
    { id: 502, nombre: 'Cadena de oro', ruta: ['Joyas y relojes', 'Joyería', 'Oro'], tipo: 'oro' },
    { id: 503, nombre: 'Esclava de oro', ruta: ['Joyas y relojes', 'Joyería', 'Oro'], tipo: 'oro' },
    { id: 511, nombre: 'Cadena de plata', ruta: ['Joyas y relojes', 'Joyería', 'Plata'], tipo: 'plata' },
    { id: 601, nombre: 'Pantalla Samsung 55"', ruta: ['Electrónica', 'Pantallas', 'Smart TV'], tipo: 'general', marcas: ['Samsung', 'LG', 'Sony', 'Otra'] },
    { id: 602, nombre: 'Laptop Lenovo IdeaPad', ruta: ['Electrónica', 'Cómputo', 'Laptops'], tipo: 'general', marcas: ['Lenovo', 'HP', 'Dell', 'Otra'] },
    { id: 603, nombre: 'Consola Nintendo Switch 2', ruta: ['Electrónica', 'Videojuegos', 'Consolas'], tipo: 'general', marcas: ['Nintendo', 'Sony', 'Microsoft'] },
    { id: 604, nombre: 'Taladro Bosch', ruta: ['Herramientas', 'Eléctricas', 'Taladros'], tipo: 'general', marcas: ['Bosch', 'DeWalt', 'Makita'] },
    { id: 605, nombre: 'Bicicleta de montaña', ruta: ['Deportes', 'Ciclismo', 'Bicicletas'], tipo: 'general', sinProps: true },
    ...[['Nissan', 'Versa'], ['Nissan', 'Sentra'], ['Nissan', 'March'], ['Chevrolet', 'Aveo'], ['Volkswagen', 'Jetta'], ['Volkswagen', 'Vento'],
      ['Toyota', 'Corolla'], ['Honda', 'Civic'], ['Mazda', 'Mazda 3'], ['Kia', 'Rio']].map(([m, n], i) => (
      { id: 701 + i, nombre: m === 'Mazda' ? n : m + ' ' + n, ruta: ['Vehículos', 'Autos', m], tipo: 'general', props: AUTO, alias: 'auto carro coche vehiculo' })),
  ];
  const ESTADOS = [{ id: 1, nombre: 'Excelente', pct: 70 }, { id: 2, nombre: 'Bueno', pct: 60 }, { id: 3, nombre: 'Regular', pct: 45 }];
  // plazos que regresa GetTermSelectionList; el especial ("A medida") solo sale con un cliente vinculado
  const PLAZOS = [
    { id: '1', nombre: 'Mensual', pct: 6.5, pagos: [30] },
    { id: '2', nombre: 'Quincenal', pct: 3.5, pagos: [15, 30] },
    { id: '3', nombre: 'Cliente frecuente', pct: 5.5, pagos: [30], especial: true },
  ];
  const CLIENTES = [
    { id: '9001', nombre: 'Laura Méndez Ruiz', nuc: '100245', correo: 'laura.mendez@correo.mx', tel: '5512345678', lada: '+52', casa: 'Casa Demo', deuda: 0, ingresos: 18000, vinculado: true },
    { id: '9002', nombre: 'Laura Torres Vega', nuc: '100388', correo: 'ltorres@correo.mx', tel: '5587654321', lada: '+52', casa: 'Otra casa de empeño', deuda: 1200, ingresos: 9000, vinculado: false },
    { id: '9003', nombre: 'Jorge Salinas Ortiz', nuc: '100412', correo: 'jorge.salinas@correo.mx', tel: '5523456789', lada: '+52', casa: 'Casa Demo', deuda: 3500, ingresos: 22000, vinculado: true },
  ];
  const PARENTESCOS = ['Esposo(a)', 'Hijo(a)', 'Padre', 'Madre', 'Hermano(a)', 'Otro'];
  const IDENTIFICACIONES = ['INE', 'Pasaporte', 'Licencia de conducir'];
  const proto = { busqueda: 'ok', valida: 'familia', legal: 'ok', cotit: 'ok' };

  const hoy = new Date();
  const masDias = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const ddmmaaaa = (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  const deDdmmaaaa = (s) => { const [d, m, a] = s.split('/').map(Number); return new Date(a, m - 1, d); };

  const SRV = {
    async buscar(q) {                                  // GetSearchArticleList
      if (proto.busqueda === 'error') throw new Error('servicio');
      if (proto.busqueda === 'vacia') return [];
      const t = sinAcentos(q);
      return CATALOGO.filter((c) => sinAcentos(c.nombre + ' ' + c.ruta.join(' ') + ' ' + (c.alias || '')).includes(t));
    },
    async estados() { return ESTADOS; },          // GetStatesConservationByArticle
    propiedades(c) { return c.sinProps ? [] : c.props ? c.props.map((x) => ({ ...x })) : c.tipo === 'general' ? props.general(c.marcas) : props[c.tipo]; },   // GetArticleProperties
    // GetPledgeAppraisal: avalúo del metal = peso neto × precio por gramo del metal fino × pureza
    avaluoMetal(tipo, pureza, pesoNeto) {
      const fr = tipo === 'oro' ? Number(String(pureza).replace('K', '')) / 24 : Number(pureza);
      return Math.round(pesoNeto * (tipo === 'oro' ? precioGramoOro : precioGramoPlata) * fr);
    },
    precioVenta(prestamo) { return prestamo * 1.35; },                 // GetArticleSale (passPercentage ficticio de 35 %)
    // GetValidateContractPawn: ¿estos artículos pueden ir en el mismo contrato?
    valida(arts) {
      if (proto.valida === 'si') return true;
      if (proto.valida === 'no') return false;
      return new Set(arts.map((a) => (a.tipo === 'general' ? 'g' : 'm'))).size <= 1;
    },
    plazos(prestamo, avaluo, conCliente) {                              // GetTermSelectionList (solo habilitados)
      if (!prestamo || !avaluo) return [];
      return PLAZOS.filter((p) => !p.especial || conCliente);
    },
    tablaPagos(p, prestamo) {                                           // GetTermPaytable
      return p.pagos.map((d, i) => {
        const interes = prestamo * p.pct / 100;
        const refrendo = interes * 1.16;                                 // interés + IVA 16 %
        return { fecha: ddmmaaaa(masDias(hoy, d)), mutuo: prestamo, pct: p.pct, refrendo, desempeno: prestamo + refrendo, nota: i === p.pagos.length - 1 ? 'Fecha límite de pago' : '' };
      });
    },
    async clientes(q) { const t = sinAcentos(q); return CLIENTES.filter((c) => sinAcentos(c.nombre).includes(t)); },
  };

  /* ========== estado (mismo modelo que el form de PawnQuoterV4) ========== */
  const nuevoContrato = (id) => ({ id, articulos: [], cotit: { activo: false, roles: {} }, ext: { activo: false, fecha: null }, plazo: null });
  const st = {
    paso: 1, contratos: [], selArt: '', selContrato: null, cliente: null, intento: false,
    colapsados: new Set(), buscarEn: null, q: '', bEstado: 'idle', resultados: [], pendiente: null,
    secCar: true, secPre: true, dato: true, sucios: new Set(),
    secPlazos: true, plazosAbiertos: new Set(), personas: [], arrastre: null,
  };
  const idContrato = (n) => String(n).padStart(5, '0');
  const siguienteId = () => idContrato((st.contratos.length ? Math.max(...st.contratos.map((c) => Number(c.id))) : 0) + 1);
  const renumerar = () => st.contratos.forEach((c, i) => { c.id = idContrato(i + 1); });
  const todos = () => st.contratos.flatMap((c) => c.articulos);
  const artSel = () => todos().find((a) => a.id === st.selArt);
  const contratoDe = (artId) => st.contratos.find((c) => c.articulos.some((a) => a.id === artId));
  const contratoSel = () => st.contratos.find((c) => c.id === st.selContrato) || st.contratos[0];

  /* ---------- reglas (evaluationPanel.util, articleCompletion.utils, contractV4.utils) ---------- */
  const visibles = (a) => [...a.props].filter((p) => p.tipo !== 5).sort((x, y) => ({ 3: 0, 4: 1, 2: 2, 1: 3 }[x.tipo]) - ({ 3: 0, 4: 1, 2: 2, 1: 3 }[y.tipo]));
  const carCompleta = (a) => a.props.filter((p) => p.obl && p.tipo !== 5).every((p) => Boolean(a.valores[p.id]));
  const estadoDe = (a) => a.estados.find((e) => String(e.id) === a.estado) || null;
  const maxPrestamo = (a) => { const e = estadoDe(a); return e && a.avaluo != null ? (a.avaluo * e.pct) / 100 : null; };
  const preCompleto = (a) => {
    if (!a.estado || a.avaluo == null || a.prestamo == null || a.avaluo <= 0 || a.prestamo <= 0) return false;
    const m = maxPrestamo(a); return m !== null && a.prestamo <= m;
  };
  const completo = (a) => carCompleta(a) && preCompleto(a);
  const progreso = (a) => (carCompleta(a) ? 50 : 0) + (preCompleto(a) ? 50 : 0);
  const totalPrestar = (cs) => cs.reduce((s, c) => s + c.articulos.reduce((t, a) => t + (completo(a) ? a.prestamo || 0 : 0), 0), 0);
  const totalAvaluo = (cs) => cs.reduce((s, c) => s + c.articulos.reduce((t, a) => t + (completo(a) ? a.avaluo || 0 : 0), 0), 0);
  const cotizacionCompleta = () => st.contratos.length > 0 && st.contratos.every((c) => c.articulos.length > 0 && c.articulos.every(completo));
  const esMetal = (a) => a.tipo === 'oro' || a.tipo === 'plata';
  // extractMetalData: pureza (Kilates/Ley), peso de la prenda y de accesorios
  const metal = (a) => {
    const pureza = a.valores[1] || ''; const prenda = num(a.valores[2]) || 0; const acc = num(a.valores[3]) || 0;
    const neto = prenda - acc; return { pureza, neto, listo: Boolean(pureza) && prenda > 0 && neto >= 0 };
  };
  // useMetalAppraisal: sin metal listo o sin Estado, el avalúo queda vacío
  const recalcularMetal = (a) => { if (!esMetal(a)) return; const m = metal(a); a.avaluo = m.listo && estadoDe(a) ? SRV.avaluoMetal(a.tipo, m.pureza, m.neto) : null; };
  const errorPrestamo = (a) => {
    if (a.prestamo == null || a.prestamo <= 0) return T.soloNumeros;
    const m = maxPrestamo(a); return m === null || a.prestamo > m ? T.supera : '';
  };
  const ver = (k) => st.sucios.has(st.selArt + ':' + k) || st.intento;

  /* ========== toasts y modal del DS ========== */
  function toast({ tipo = 'warning', titulo = '', texto = '' }) {
    const t = document.createElement('div');
    t.className = 'ds-toast ds-toast--' + tipo;
    t.setAttribute('role', tipo === 'error' ? 'alert' : 'status');
    t.innerHTML = `<span class="ds-toast__icon" aria-hidden="true">${tipo === 'error' ? ICO.err : tipo === 'success' ? ICO.ok : ICO.warn}</span><div class="ds-toast__body-wrap">${titulo ? '<p class="ds-toast__title"></p>' : ''}<p class="ds-toast__body"></p></div><button type="button" class="ds-toast__close" aria-label="Cerrar">${ICO.close}</button>`;
    if (titulo) t.querySelector('.ds-toast__title').textContent = titulo;
    t.querySelector('.ds-toast__body').textContent = texto;
    const region = $('posToasts');
    region.querySelectorAll('.ds-toast').forEach((x) => x.remove());
    region.appendChild(t);
    let reloj = setTimeout(() => t.remove(), 5000);
    t.addEventListener('mouseenter', () => clearTimeout(reloj));
    t.addEventListener('mouseleave', () => { reloj = setTimeout(() => t.remove(), 2500); });
    t.querySelector('.ds-toast__close').addEventListener('click', () => t.remove());
  }
  let modalPrevio = null;
  let alCerrarModal = null;
  function modal(titulo, cuerpo, pie, { cls = '', alAbrir, alCerrar } = {}) {
    cerrarModal(false);
    modalPrevio = document.activeElement; alCerrarModal = alCerrar || null;
    $('cotModalRoot').innerHTML = `<div class="ds-modal-overlay" id="cotOverlay"><div class="ds-modal cot-modal ${cls}" role="dialog" aria-modal="true" aria-labelledby="cotModalT">
      <div class="ds-modal__header"><h2 class="ds-modal__title" id="cotModalT">${esc(titulo)}</h2><button class="ds-btn ds-btn--tertiary ds-btn--icon-sm cot-modal__x" type="button" data-cerrar aria-label="Cerrar">${ICO.close}</button></div>
      <div class="ds-modal__body" id="cotModalB">${cuerpo}</div><div class="ds-modal__footer" id="cotModalF">${pie}</div></div></div>`;
    const ov = $('cotOverlay');
    ov.addEventListener('click', (e) => { if (e.target === ov || e.target.closest('[data-cerrar]')) cerrarModal(); });
    ov.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); cerrarModal(); return; }
      if (e.key !== 'Tab') return;
      const f = [...ov.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea, a[href], [tabindex="0"]')].filter((x) => x.offsetParent);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
    document.body.style.overflow = 'hidden';
    if (alAbrir) alAbrir(ov);
    const primero = ov.querySelector('[autofocus]') || ov.querySelector('.ds-modal__body input') || ov.querySelector('[data-cerrar]');
    if (primero) primero.focus();
    return ov;
  }
  function cerrarModal(devolver = true) {
    const root = $('cotModalRoot');
    if (!root.firstChild) return;
    root.innerHTML = ''; document.body.style.overflow = '';
    const cb = alCerrarModal; alCerrarModal = null; if (cb) cb();
    if (devolver && modalPrevio && document.contains(modalPrevio)) modalPrevio.focus();
  }

  /* ========== piezas ========== */
  const anillo = (v) => {                     // CircularProgressRing 26 px, trazo 3
    const r = 11.5; const c = 2 * Math.PI * r; const off = c - (Math.min(100, Math.max(0, v)) / 100) * c;
    return `<svg class="cot-ring" width="26" height="26" viewBox="0 0 26 26" role="progressbar" aria-valuenow="${v}" aria-valuemin="0" aria-valuemax="100" aria-label="Progreso ${v}%"><circle cx="13" cy="13" r="${r}" fill="none" stroke="var(--ats-neutral-300)" stroke-width="3"/><circle cx="13" cy="13" r="${r}" fill="none" stroke="var(--ats-primary-300)" stroke-width="3" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${off}" transform="rotate(-90 13 13)"/></svg>`;
  };
  const iniciales = (n) => n.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
  const seccion = (id, titulo, sub, completa, abierta, alto = '') => `<div class="cot-sec__head${alto}">
      <div class="cot-sec__tit"><span class="cot-sec__row">${ico(completa ? 'ok' : 'pend', 20, completa ? 'cot-ico--ok' : 'cot-ico--pend')}<b>${esc(titulo)}</b></span>${sub ? `<span class="cot-sec__sub">${esc(sub)}</span>` : ''}</div>
      <button class="ds-btn ds-btn--tertiary cot-iconbtn cot-chev${abierta ? ' is-open' : ''}" type="button" data-sec="${id}" aria-expanded="${abierta}" aria-label="${abierta ? 'Contraer' : 'Expandir'} ${esc(titulo)}">${ico('down', 20)}</button></div>`;
  const ayuda = (msg, id) => (msg ? `<p class="ds-helper ds-helper--error cot-err" id="${id}">${esc(msg)}</p>` : '');
  const campoSelect = (id, label, opciones, valor, err) => `<div class="ds-field"><label class="ds-label" for="${id}">${esc(label)}</label>
      <select class="ds-select--standalone${err ? ' ds-input--error' : ''}" id="${id}"${err ? ` aria-invalid="true" aria-describedby="${id}E"` : ''}><option value=""${valor ? '' : ' selected'}>${T.selecciona}</option>${opciones.map(([v, l]) => `<option value="${esc(v)}"${String(v) === String(valor) ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select>${ayuda(err, id + 'E')}</div>`;
  const campoInput = (id, label, valor, err, attrs = '') => `<div class="ds-field"><label class="ds-label" for="${id}">${esc(label)}</label>
      <div class="ds-field-wrap${err ? ' ds-field-wrap--error' : ''}"><input class="ds-input" id="${id}" value="${esc(valor == null ? '' : valor)}" ${attrs}${err ? ` aria-invalid="true" aria-describedby="${id}E"` : ''} /></div>${ayuda(err, id + 'E')}</div>`;
  const soloLectura = (label, valor) => `<div class="cot-ro"><span class="cot-ro__l">${esc(label)}</span><span class="cot-ro__v">${esc(valor)}</span></div>`;
  const interruptor = (id, checked, labelledby) => `<label class="ds-switch cot-switch"><input type="checkbox" id="${id}"${checked ? ' checked' : ''}${labelledby ? ` aria-labelledby="${labelledby}"` : ''} /><span class="ds-switch__track"><span class="ds-switch__thumb">${ICO.x}${ICO.check}</span></span></label>`;
  const oferta = () => `<div class="cot-oferta"><span class="cot-oferta__t">${ico('sparkle', 24)}<span><b>${T.ofertaT}</b>${T.ofertaD}</span></span>
      <button class="cot-oferta__cta" type="button" data-vincular>${ico('personAdd', 20)}${T.vincula}</button></div>`;

  /* ========== izquierda: Listado de artículos ========== */
  function htmlFila(a, soloLeer, seleccionada) {
    const ok = completo(a);
    const accion = soloLeer ? '' : ok
      ? `<button class="ds-btn ds-btn--tertiary cot-iconbtn cot-del" type="button" data-del-art="${a.id}" aria-label="Eliminar artículo">${ico('trash', 20)}</button>`
      : `<span class="cot-swap"><span class="cot-swap__def">${anillo(progreso(a))}</span><button class="ds-btn ds-btn--tertiary cot-iconbtn cot-del cot-swap__del" type="button" data-del-art="${a.id}" aria-label="Eliminar artículo">${ico('trash', 20)}</button></span>`;
    return `<div class="cot-fila${seleccionada ? ' is-sel' : ''}${ok ? '' : ' is-prog'}${soloLeer ? ' is-ro' : ''}" data-art="${a.id}"${soloLeer ? '' : ` role="button" tabindex="0" aria-pressed="${seleccionada}"`}>
      ${soloLeer ? '' : `<span class="cot-handle" draggable="true" data-handle="${a.id}" title="Arrastra para mover a otro contrato" aria-hidden="true">${ico('drag', 20)}</span>`}
      <span class="cot-av" aria-hidden="true">${esc(iniciales(a.nombre))}</span>
      <span class="cot-fila__txt"><span class="cot-fila__n">${esc(a.nombre)}</span><span class="cot-fila__r">${esc(a.ruta.join(' > '))}</span></span>${accion}</div>`;
  }
  function htmlBusqueda() {
    const q = st.q.trim();
    let res = '';
    if (q.length >= 3) {
      if (st.bEstado === 'cargando') res = '<div class="cot-bres__load"><span class="ds-spinner ds-spinner--sm ds-spinner--brand" role="status" aria-label="Buscando"></span></div>';
      else if (st.bEstado === 'error') res = `<span class="cot-bres__msg">${T.errorBusqueda}</span>`;
      else if (st.resultados.length) res = `<div class="cot-bres" role="listbox" aria-label="Resultados del catálogo">${st.resultados.map((r) => `<button class="cot-bres__it" type="button" role="option" data-res="${r.id}"${st.pendiente ? ' disabled' : ''}>${esc(r.nombre)}${st.pendiente === r.id ? '<span class="ds-spinner ds-spinner--sm ds-spinner--brand" aria-hidden="true"></span>' : ''}</button>`).join('')}</div>`;
      else if (st.bEstado === 'ok') res = `<span class="cot-bres__msg">${T.sinResultados}</span>`;
    }
    return `<div class="cot-buscar" id="cotBuscar"><div class="cot-search"><input class="cot-search__in" id="cotQ" type="search" placeholder="Buscar" aria-label="Buscar artículo en el catálogo" value="${esc(st.q)}" autocomplete="off" /><span class="cot-search__ico">${ico('search', 24)}</span></div>${res}</div>`;
  }
  function htmlContrato(c, soloLeer) {
    const enProgreso = c.articulos.some((a) => !completo(a));
    const avance = c.articulos.reduce((s, a) => s + progreso(a), 0) / (c.articulos.length || 1);
    const sel = soloLeer && c.id === contratoSel().id;
    const abierto = soloLeer ? sel : !st.colapsados.has(c.id) || Boolean(st.arrastre);
    let accion = '';
    if (!soloLeer) {
      accion = enProgreso
        ? `<span class="cot-swap">${'<span class="cot-swap__def">' + anillo(Math.round(avance)) + '</span>'}<button class="ds-btn ds-btn--tertiary cot-iconbtn cot-swap__del cot-del--p" type="button" data-del-con="${c.id}" aria-label="Eliminar contrato">${ico('trash', 20)}</button></span>`
        : `<button class="ds-btn ds-btn--tertiary cot-iconbtn cot-del--p" type="button" data-del-con="${c.id}" aria-label="Eliminar contrato">${ico('trash', 20)}</button>`;
    } else if (c.plazo) accion = ico('ok', 20, 'cot-ico--plazo');
    const buscando = !soloLeer && st.buscarEn === c.id;
    return `<div class="cot-con${sel ? ' is-sel' : ''}" data-con="${c.id}">
      <div class="cot-con__head${enProgreso ? ' is-prog' : ''}" role="button" tabindex="0" aria-expanded="${abierto}" data-toggle-con="${c.id}">
        <span class="cot-chev cot-chev--sm${abierto ? ' is-open' : ''}" aria-hidden="true">${ico('down', 20)}</span>
        <span class="cot-con__txt"><span class="cot-con__t">Contrato: ${c.id}</span><span class="cot-con__s">Artículos: ${c.articulos.length}</span></span>
        ${accion ? `<span class="cot-con__acc" data-stop>${accion}</span>` : ''}</div>
      <div class="cot-con__body"${abierto ? '' : ' hidden'}>
        ${c.articulos.map((a) => htmlFila(a, soloLeer, soloLeer || st.selArt === a.id)).join('')}
        ${soloLeer ? '' : `<div class="cot-drop" data-drop="${c.id}">${ico('upload', 24)}<span>${T.soltar}</span></div>`}
        ${soloLeer ? '' : buscando ? htmlBusqueda() : `<div class="cot-addart"><button class="ds-btn ds-btn--tertiary cot-link" type="button" data-add-art="${c.id}">${ico('add', 20)}${T.addArticulo}</button></div>`}
      </div></div>`;
  }
  function pintarIzq() {
    const soloLeer = st.paso === 2;
    $('cotIzq').innerHTML = `<div class="cot-izq__head"><span class="cot-izq__t">${ico('tag', 17)}<h2>${T.listado}</h2></span>
        ${soloLeer ? '' : `<button class="ds-btn ds-btn--tertiary cot-link" type="button" id="cotNuevoCon">${ico('add', 20)}${T.addContrato}</button>`}</div>
      <div class="cot-cons${st.arrastre ? ' is-drag' : ''}" id="cotCons">${st.contratos.map((c) => htmlContrato(c, soloLeer)).join('')}
        ${soloLeer ? '' : `<div class="cot-crear" role="button" tabindex="0" id="cotCrear" data-drop="__nuevo__">${ico('add', 24)}<span>${T.crearZona}</span></div>`}</div>`;
  }

  /* ========== modo guiado (artículos con 7 o más propiedades, p. ej. un auto) ==========
     Solo UI: usa las mismas propiedades dinámicas de GetArticleProperties (tipo 1 texto, 2 número, 3 lista, 4 casilla), en el
     orden del catálogo, y guarda los mismos valores en a.valores. No necesita campos ni servicios nuevos:
     - ficha arriba que se arma con lo capturado (título con las primeras listas/textos, detalle con el resto) y el avance;
     - listas de 4 opciones o menos como opciones de un toque; las largas siguen como lista desplegable;
     - números con su unidad (lo que viene entre paréntesis en el nombre: "Kilometraje (km)") y separador de miles;
     - textos de serie, NIV, placas o motor en mayúsculas; el NIV avisa cuántos caracteres lleva (17);
     - las casillas como checklist de lo que entrega el cliente. */
  const GUIADO_MIN = 7;
  const propsGuiadas = (a) => a.props.filter((p) => p.tipo !== 5);
  const esGuiado = (a) => propsGuiadas(a).length >= GUIADO_MIN;
  const unidadDe = (n) => { const m = /\(([^)]+)\)\s*$/.exec(n); return m ? m[1] : ''; };
  const sinUnidad = (n) => n.replace(/\s*\([^)]*\)\s*$/, '');
  const esMayus = (n) => /serie|niv|vin|placa|motor/i.test(n);
  const esNiv = (n) => /\bNIV\b|\bVIN\b/i.test(n);
  const miles = (v) => { const n = num(v); return n == null ? '' : n.toLocaleString('es-MX'); };
  const esVehiculo = (a) => /veh[ií]culo|auto|moto|camioneta/i.test(a.ruta.join(' '));
  ICO.auto = P('M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11v6a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H8v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-6Zm2.2-1h9.6l-1.1-3.2a.5.5 0 0 0-.5-.3H8.8a.5.5 0 0 0-.5.3L7.2 10ZM7.5 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm9 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z');
  ICO.doc = P('M8 18h8v-2H8v2Zm0-4h8v-2H8v2Zm-2 8q-.825 0-1.412-.587T4 20V4q0-.825.588-1.413T6 2h8l6 6v12q0 .825-.587 1.413T18 22H6Zm7-13V4H6v16h12V9h-5Z');
  const SVG_S = (d) => `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const ICONO_OPCION = {
    automatica: SVG_S('<circle cx="12" cy="12" r="9"/><text x="12" y="16.2" text-anchor="middle" font-size="11" font-weight="800" fill="currentColor" stroke="none" font-family="Nunito, sans-serif">A</text>'),
    manual: SVG_S('<circle cx="5" cy="5" r="1.6"/><circle cx="12" cy="5" r="1.6"/><circle cx="19" cy="5" r="1.6"/><circle cx="5" cy="19" r="1.6"/><circle cx="12" cy="19" r="1.6"/><circle cx="19" cy="19" r="1.6"/><path d="M5 6.6v10.8M12 6.6v10.8M19 6.6v10.8M5 12h14"/>'),
    gasolina: P('M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33a2.5 2.5 0 0 0 3.5 2.29v7.21a1 1 0 0 1-2 0V14a2 2 0 0 0-2-2h-1V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v16h10v-7.5h1.5v5a2.5 2.5 0 0 0 5 0V9c0-.69-.28-1.32-.73-1.77ZM12 10H6V5h6v5Zm6 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z'),
    diesel: P('M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8Zm-1 15.5v-7h2.2a3.5 3.5 0 0 1 0 7H11Zm1.6-1.6h.6a1.9 1.9 0 0 0 0-3.8h-.6v3.8Z'),
    hibrido: P('M6.05 8.05a7.007 7.007 0 0 0-.02 9.88c1.47-3.4 4.09-6.24 7.36-7.93A15.952 15.952 0 0 0 8.67 19.8c2.6 1.23 5.8.78 7.95-1.37C19.1 15.95 20 4 20 4S8.05 4.9 6.05 8.05Z'),
    electrico: P('M7 2v11h3v9l7-12h-4l4-8H7Z'),
  };
  const iconoOpcion = (v) => ICONO_OPCION[sinAcentos(v).replace(/[^a-z]/g, '')] || '';

  /* kilometraje: odómetro (dígitos como en el tablero) y uso promedio por año según el Año del artículo */
  const anioDe = (a) => { const p = a.props.find((x) => /^a[nñ]o\b/i.test(sinAcentos(x.nombre)) || /^año/i.test(x.nombre)); return p ? Number(a.valores[p.id]) || null : null; };
  const KM_MAX = 300000, KM_PASO = 1000;   // rango del slider; en las casillas se puede escribir hasta 999,999
  const odoDigitos = (n) => { const d = String(n == null ? 0 : Math.min(Math.max(0, Math.round(n)), 999999)).padStart(6, '0').split(''); return d.map((x, i) => `<span${i === d.length - 1 ? ' class="is-ult"' : ''}>${x}</span>`).join(''); };
  function usoHTML(a, n) {
    const anio = anioDe(a), anios = anio ? Math.max(1, hoy.getFullYear() - anio) : null;
    const porAnio = n != null && anios ? Math.round(n / anios) : null;
    const uso = porAnio == null ? null : porAnio < 10000 ? ['ds-tag--verde', 'Uso bajo'] : porAnio <= 20000 ? ['ds-tag--azul', 'Uso promedio'] : ['ds-tag--amarillo', 'Uso alto'];
    return uso ? `<span class="ds-tag ${uso[0]}">${uso[1]}</span>≈ ${porAnio.toLocaleString('es-MX')} km por año${anio ? ` desde ${anio}` : ''}` : anio ? 'Escribe en las casillas lo que marca el tablero o usa el control.' : 'Escribe lo que marca el tablero. Con el año se calcula el uso por año.';
  }
  function odometroHTML(a, p, id, err) {
    const v = a.valores[p.id] || '', n = num(v);
    const pct = Math.min(100, ((n || 0) / KM_MAX) * 100);
    return `<div class="cot-km__fila">
        <div class="cot-odo${n == null ? ' is-vacio' : ''}${err ? ' is-error' : ''}" id="cotOdo${p.id}">
          <span class="cot-odo__dig" aria-hidden="true">${odoDigitos(n)}</span><span class="cot-odo__u" aria-hidden="true">km</span>
          <input class="cot-odo__in" id="${id}" value="${esc(v)}" inputmode="numeric" maxlength="6" autocomplete="off" data-num data-miles data-odo="${p.id}"${err ? ` aria-invalid="true" aria-describedby="${id}E"` : ` aria-describedby="cotOdo${p.id}U"`} />
        </div>
        <div class="cot-km__ctl">
          <button type="button" class="ds-btn ds-btn--secondary ds-btn--icon-sm cot-km__paso" id="cotOdoMenos${p.id}" data-odo-paso="-${KM_PASO}" data-pid="${p.id}" aria-label="Restar ${KM_PASO.toLocaleString('es-MX')} km">${ICO.menos}</button>
          <input type="range" class="cot-rango" id="cotOdoR${p.id}" min="0" max="${KM_MAX}" step="${KM_PASO}" value="${Math.min(n || 0, KM_MAX)}" style="--p:${pct}%" data-odo-rango="${p.id}" aria-label="Kilometraje" aria-valuetext="${(n || 0).toLocaleString('es-MX')} km" />
          <button type="button" class="ds-btn ds-btn--secondary ds-btn--icon-sm cot-km__paso" id="cotOdoMas${p.id}" data-odo-paso="${KM_PASO}" data-pid="${p.id}" aria-label="Sumar ${KM_PASO.toLocaleString('es-MX')} km">${ICO.add}</button>
        </div>
      </div>
      <p class="ds-helper cot-odo__uso" id="cotOdo${p.id}U">${usoHTML(a, n)}</p>`;
  }
  /* placas: dibujo de una placa que se llena mientras se escribe */
  const placaHTML = (v, id, err) => `<div class="cot-placa${v ? '' : ' is-vacio'}${err ? ' is-error' : ''}">
      <span class="cot-placa__top" aria-hidden="true">MÉXICO</span>
      <input class="cot-placa__in" id="${id}" value="${esc(v)}" autocomplete="off" spellcheck="false" maxlength="9" placeholder="ABC-123-D" data-mayus data-placa${err ? ` aria-invalid="true" aria-describedby="${id}E"` : ''} />
      <span class="cot-placa__pie" aria-hidden="true">Transporte privado</span></div>`;

  function htmlCampoGuiado(a, p) {
    const v = a.valores[p.id] || '';
    const err = p.obl && !v && ver('p' + p.id) ? T.obligatorio : '';
    const id = 'cotProp' + p.id;
    const etq = `${esc(p.tipo === 2 ? sinUnidad(p.nombre) : p.nombre)}${p.obl ? '' : `<span class="ds-label__optional">${T.opcional}</span>`}`;
    if (p.tipo === 3 && p.valores.length <= 4) {
      // DS ChoiceChip (ds-chip--choice / ds-chip--on): una opción por grupo
      const ancho = p.valores.join('').length > 18;
      return `<div class="ds-field${ancho ? ' cot-campo--ancho' : ''}"><span class="ds-label" id="${id}L">${etq}</span>
        <div class="cot-chips" role="radiogroup" aria-labelledby="${id}L"${err ? ` aria-describedby="${id}E"` : ''}>${p.valores.map((x, i) =>
          `<button type="button" class="ds-chip ds-chip--choice${x === v ? ' ds-chip--on' : ''}" role="radio" aria-checked="${x === v}" id="${id}R${i}" data-prop="${p.id}" data-v="${esc(x)}" tabindex="${x === v || (!v && i === 0) ? 0 : -1}">${iconoOpcion(x)}${esc(x)}</button>`).join('')}</div>${ayuda(err, id + 'E')}</div>`;
    }
    if (p.tipo === 3) return campoSelect(id, p.nombre + (p.obl ? '' : ' (opcional)'), p.valores.map((x) => [x, x]), v, err);
    if (p.tipo === 2 && unidadDe(p.nombre) === 'km') {
      return `<div class="ds-field cot-km"><label class="ds-label" for="${id}">${etq}</label>${odometroHTML(a, p, id, err)}${ayuda(err, id + 'E')}</div>`;
    }
    if (p.tipo === 2) {
      // DS Input con addon derecho para la unidad
      const u = unidadDe(p.nombre);
      return `<div class="ds-field"><label class="ds-label" for="${id}">${etq}</label>
        <div class="ds-field-wrap${err ? ' ds-field-wrap--error' : ''}"><input class="ds-input" id="${id}" value="${esc(document.activeElement && document.activeElement.id === id ? v : miles(v))}" inputmode="numeric" data-num data-miles${err ? ` aria-invalid="true" aria-describedby="${id}E"` : ''} />${u ? `<span class="ds-field-addon ds-field-addon--right" aria-hidden="true">${esc(u)}</span>` : ''}</div>${ayuda(err, id + 'E')}</div>`;
    }
    if (/placa/i.test(p.nombre)) {
      return `<div class="ds-field cot-placas"><label class="ds-label" for="${id}">${etq}</label>${placaHTML(v, id, err)}${ayuda(err, id + 'E')}</div>`;
    }
    const niv = esNiv(p.nombre);
    const largo = String(v).length;
    return `<div class="ds-field"><label class="ds-label" for="${id}">${etq}</label>
      <div class="ds-field-wrap${err ? ' ds-field-wrap--error' : ''}"><input class="ds-input${esMayus(p.nombre) ? ' cot-mayus' : ''}" id="${id}" value="${esc(v)}" autocomplete="off" spellcheck="false"${esMayus(p.nombre) ? ' data-mayus' : ''}${niv ? ' maxlength="17"' : ''}${err ? ` aria-invalid="true" aria-describedby="${id}E"` : niv ? ` aria-describedby="${id}H"` : ''} /></div>
      ${err ? ayuda(err, id + 'E') : niv ? `<p class="ds-helper" id="${id}H">${largo === 17 ? 'NIV completo · 17 caracteres' : `${largo} de 17 caracteres`}</p>` : ''}</div>`;
  }
  function htmlGuiado(a) {
    const ps = propsGuiadas(a), datos = ps.filter((p) => p.tipo !== 4), docs = ps.filter((p) => p.tipo === 4);
    // bloques por tipo de dato (sin metadatos nuevos): identificadores (serie, NIV, placas, motor), opciones de un toque, números y el resto
    const ident = datos.filter((p) => p.tipo === 1 && esMayus(p.nombre));
    const opciones = datos.filter((p) => p.tipo === 3 && p.valores.length <= 4);
    const numeros = datos.filter((p) => p.tipo === 2);
    const generales = datos.filter((p) => !ident.includes(p) && !opciones.includes(p) && !numeros.includes(p));
    const bloque = (titulo, ps2, cls) => (ps2.length ? `<section class="cot-grupo"><h3 class="cot-grupo__t">${titulo}</h3><div class="cot-guiado${cls ? ' ' + cls : ''}">${ps2.map((p) => htmlCampoGuiado(a, p)).join('')}</div></section>` : '');
    return `${bloque('Datos generales', generales)}
      ${bloque('Especificaciones', opciones)}
      ${bloque(numeros.some((p) => unidadDe(p.nombre) === 'km') ? 'Uso' : 'Medidas', numeros, 'cot-guiado--uno')}
      ${bloque('Identificación', ident)}
      ${docs.length ? `<section class="cot-grupo"><h3 class="cot-grupo__t">Lo que entrega el cliente</h3>
        <div class="cot-docs__grid">${docs.map((p) => `<label class="ds-check"><input type="checkbox" id="cotProp${p.id}"${a.valores[p.id] === 'true' ? ' checked' : ''} /><span class="ds-check__wrap"><span class="ds-check__box"></span></span>${esc(p.nombre)}</label>`).join('')}</div></section>` : ''}`;
  }

  /* ========== derecha paso 1: evaluación del artículo ========== */
  function htmlCampoProp(a, p) {
    const v = a.valores[p.id] || '';
    const err = p.obl && !v && ver('p' + p.id) ? T.obligatorio : '';
    const id = 'cotProp' + p.id;
    if (p.tipo === 3) return campoSelect(id, p.nombre, p.valores.map((x) => [x, x]), v, err);
    if (p.tipo === 4) return `<div class="ds-field cot-sw"><span class="ds-label" id="${id}L">${esc(p.nombre)}</span>${interruptor(id, v === 'true', id + 'L')}</div>`;
    return campoInput(id, p.nombre, v, err, p.tipo === 2 ? 'inputmode="decimal" data-num' : '');
  }
  const fmtMonto = (id, v) => (v == null ? '' : editandoMonto === id ? String(v) : money(v));
  function htmlEvaluacion(a) {
    const cOk = carCompleta(a); const pOk = preCompleto(a);
    const vis = visibles(a);
    const car = `<div class="cot-sec">${seccion('car', T.car, T.carSub, cOk, st.secCar)}
      ${st.secCar ? (vis.length ? (esGuiado(a) ? htmlGuiado(a) : `<div class="cot-grid3">${vis.map((p) => htmlCampoProp(a, p)).join('')}</div>`) : `<p class="cot-caption">${T.carVacio}</p>`) : ''}
      ${st.secCar ? (a.notasAbiertas ? `<div class="ds-field cot-notas"><label class="ds-label" for="cotNotas">${T.notasLbl}<span class="ds-label__optional">${T.opcional}</span></label><textarea class="ds-textarea" id="cotNotas" rows="3">${esc(a.valores.notes || '')}</textarea></div>`
        : `<button class="ds-btn ds-btn--tertiary cot-link cot-link--sm" type="button" id="cotAddNotas">${ico('add', 20)}${T.notas}</button>`) : ''}</div>`;
    const e = estadoDe(a);
    const errEstado = !a.estado && ver('estado') ? T.obligatorio : '';
    const errAv = (a.avaluo == null || a.avaluo <= 0) && ver('avaluo') ? T.soloNumeros : '';
    const errPr = ver('prestamo') ? errorPrestamo(a) : '';
    const venta = a.venta == null ? 0 : a.venta;
    const fila1 = esMetal(a)
      ? [campoSelect('cotEstado', T.estado, a.estados.map((x) => [x.id, x.nombre]), a.estado, errEstado),
        campoInput('cotPrestamo', T.prestamo, fmtMonto('cotPrestamo', a.prestamo), errPr, 'inputmode="decimal" data-moneda'),
        soloLectura(T.avaluo, money0(a.avaluo))]
      : [campoSelect('cotEstado', T.estado, a.estados.map((x) => [x.id, x.nombre]), a.estado, errEstado),
        campoInput('cotAvaluo', T.avaluo, fmtMonto('cotAvaluo', a.avaluo), errAv, 'inputmode="decimal" data-moneda'),
        campoInput('cotPrestamo', T.prestamo, fmtMonto('cotPrestamo', a.prestamo), errPr, 'inputmode="decimal" data-moneda')];
    const pre = `<div class="cot-sec">${seccion('pre', T.pre, T.preSub, pOk, st.secPre)}
      ${st.secPre ? `<div class="cot-grid3">${fila1.join('')}</div>
        <div class="cot-grid3">${soloLectura(T.venta, money(venta))}${soloLectura(T.maxPct, e ? e.pct + '%' : '-')}
          ${st.dato ? `<div class="cot-dato" role="note"><p><b>Dato clave: </b> Estos artículos cuentan con ${a.terminos} plazos específicos.</p><button class="ds-btn ds-btn--tertiary cot-iconbtn" type="button" id="cotDatoX" aria-label="Cerrar dato clave">${ico('close', 20)}</button></div>` : ''}</div>` : ''}</div>`;
    return `<form class="cot-eval" id="cotEval" novalidate>${car}<hr class="cot-line" />${pre}<hr class="cot-line" />${st.cliente ? '' : oferta()}</form>`;
  }

  /* ========== derecha paso 2: Selección de plazos ========== */
  const opcionesPlazo = (c) => {
    const lista = SRV.plazos(totalPrestar([c]), totalAvaluo([c]), Boolean(st.cliente));
    return lista.map((p) => ({ ...p, pagosT: SRV.tablaPagos(p, totalPrestar([c])) }));
  };
  function htmlPlazo(p, c) {
    const abierto = st.plazosAbiertos.has(p.id); const sel = c.plazo === p.id; const f = p.pagosT[0];
    const col = (l, v) => `<span class="cot-pl__col"><span class="cot-pl__l">${l}</span><span class="cot-pl__v">${v}</span></span>`;
    return `<div class="cot-pl${sel ? ' is-sel' : ''}">
      <div class="cot-pl__head${abierto ? ' is-open' : ''}" role="button" tabindex="0" aria-expanded="${abierto}" data-pl-toggle="${p.id}" aria-label="Ver detalle del plazo ${esc(p.nombre)}">
        <span class="cot-pl__chev" aria-hidden="true">${ico('next', 20)}</span>
        ${col('Nombre', esc(p.nombre))}${col('Mutuo', money(f.mutuo))}${col('Interés', p.pct + '%')}${col('Refrendo', money(f.refrendo))}${col('Desempeño', money(f.desempeno))}
        <label class="ds-radio cot-pl__radio" data-stop><input type="radio" name="term-selection" value="${p.id}"${sel ? ' checked' : ''} aria-label="Elegir plazo ${esc(p.nombre)}" /><span class="ds-radio__wrap"><span class="ds-radio__dot"></span></span></label>
        ${p.especial ? `<span class="cot-pl__tag">${ico('sparkle', 12)}A medida</span>` : ''}</div>
      <div class="cot-pl__body"${abierto ? '' : ' hidden'}>
        <div class="cot-pl__grid cot-pl__grid--h"><span></span><span></span><span>Fecha de pago</span><span>Mutuo</span><span>Interés</span><span>Refrendo</span><span>Desempeño</span><span></span></div>
        ${p.pagosT.map((r) => `<div class="cot-pl__grid"><span></span><span>Fecha de pago</span><span class="cot-pl__fecha">${r.fecha}${r.nota ? `<small>${r.nota}</small>` : ''}</span><span>${money(r.mutuo)}</span><span>${r.pct}%</span><span>${money(r.refrendo)}</span><span>${money(r.desempeno)}</span><span></span></div>`).join('')}
      </div></div>`;
  }
  // getPaymentExtensionQuoteFromTerm: vence en la primera fecha de pago del plazo; costo por día = 1 % del mutuo
  const cotizacionExt = (c) => {
    if (!c.plazo) return null;
    const p = opcionesPlazo(c).find((x) => x.id === c.plazo); if (!p) return null;
    const f = p.pagosT[0]; return { vence: deDdmmaaaa(f.fecha), costoDia: f.mutuo * 0.01 };
  };
  const diasExt = (vence, fecha) => (fecha ? Math.max(0, Math.round((fecha - vence) / 864e5)) : 0);
  function htmlCotitulares(c) {
    const lista = st.personas.slice(0, 4);
    if (!lista.length) return `<div class="cot-cvacio"><img src="ilust-01-empty.svg" width="150" height="150" alt="No hay contactos" /><span>No hay cotitulares o beneficiarios creados</span>
      <button class="ds-btn ds-btn--secondary ds-btn--md" type="button" data-add-persona>${ico('add', 16)}Cotitular</button></div>`;
    return `<div class="cot-personas">${lista.map((x) => {
      const r = c.cotit.roles[x.pid] || {};
      return `<div class="cot-persona"><div class="cot-persona__h"><b>${esc([x.nombres, x.paterno, x.materno].filter(Boolean).join(' '))}</b><button class="ds-btn ds-btn--tertiary cot-iconbtn cot-iconbtn--p" type="button" data-edit-persona="${x.pid}" aria-label="Editar a ${esc(x.nombres)}">${ico('edit', 20)}</button></div>
        <div class="cot-persona__d"><span>${x.tel ? esc(x.lada + ' ' + x.tel) : '-'}</span><span class="cot-vsep" aria-hidden="true"></span><span>${esc(x.correo || '-')}</span></div><hr class="cot-line" />
        <div class="cot-persona__roles">${[['cot', 'Cotitular'], ['ben', 'Beneficiario']].map(([k, l]) => `<label class="ds-check cot-check"><input type="checkbox" data-rol="${k}" data-pid="${x.pid}"${r[k] ? ' checked' : ''} /><span class="ds-check__wrap"><span class="ds-check__box"></span></span>${l}</label>`).join('')}</div></div>`;
    }).join('')}</div>`;
  }
  function htmlExtension(c) {
    const q = cotizacionExt(c);
    const fecha = c.ext.fecha ? new Date(c.ext.fecha) : null;
    const invalida = Boolean(q && fecha && !(fecha > q.vence));
    const dias = q ? diasExt(q.vence, invalida ? null : fecha) : 0;
    const total = q ? dias * q.costoDia : 0;
    const opciones = q ? Array.from({ length: 7 }, (_, i) => masDias(q.vence, i + 1)) : [];
    const valor = fecha ? ddmmaaaa(fecha) : '';
    return `<div class="cot-ext"><div class="cot-ext__row">${soloLectura('Detalles actuales', q ? 'Vence: ' + ddmmaaaa(q.vence) : '-')}${soloLectura('Costo por día', q ? money(q.costoDia) : '-')}</div>
      <div class="cot-ext__row"><div class="ds-field"><label class="ds-label cot-ro__l" for="cotFecha">Calcular nueva fecha</label>
        <select class="ds-select--standalone${invalida ? ' ds-input--error' : ''}" id="cotFecha"${q ? '' : ' disabled'}><option value="">Selecciona</option>${opciones.map((d) => `<option value="${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}"${ddmmaaaa(d) === valor ? ' selected' : ''}>${ddmmaaaa(d)}</option>`).join('')}</select>
        ${q ? '' : '<p class="ds-helper">Este contrato no admite más días de extensión</p>'}${invalida ? ayuda('Selecciona una fecha posterior al vencimiento actual', 'cotFechaE') : ''}</div>
        ${soloLectura('Total a pagar', money(total))}</div></div>`;
  }
  function htmlPlazos() {
    const c = contratoSel(); if (!c) return '';
    const ops = opcionesPlazo(c);
    const masPersona = c.cotit.activo && st.personas.length > 0 && st.personas.length < 4;
    return `<div class="cot-plazos"><div class="cot-sec">${seccion('plazos', T.plazosT, '', Boolean(c.plazo), st.secPlazos, ' cot-sec__head--28')}
      ${st.secPlazos && !st.cliente ? oferta() : ''}
      ${st.secPlazos ? `<div class="cot-pls" role="radiogroup" aria-label="Plazos del contrato ${c.id}">${ops.map((p) => htmlPlazo(p, c)).join('')}</div>` : ''}</div>
      <hr class="cot-line" />
      <div class="cot-tg"><div class="cot-tg__row"><span class="cot-tg__l"><span id="cotCotL">${T.cotit}</span>${masPersona ? `<button class="ds-btn ds-btn--tertiary cot-link cot-link--sm" type="button" data-add-persona>${ico('add', 16)}Cotitular</button>` : ''}</span>${interruptor('cotCotit', c.cotit.activo, 'cotCotL')}</div>${c.cotit.activo ? htmlCotitulares(c) : ''}</div>
      <hr class="cot-line" />
      <div class="cot-tg cot-tg--ext"><div class="cot-tg__row"><span class="cot-tg__l"><span id="cotExtL">${T.extender}</span></span>${interruptor('cotExt', c.ext.activo, 'cotExtL')}</div>${c.ext.activo ? htmlExtension(c) : ''}</div></div>`;
  }

  /* ========== barra inferior (QuoterFooterBar / TermSelectorFooterBar) ========== */
  function pintarBarra() {
    const total = `<span class="cot-bar__total">${T.total}: ${money(totalPrestar(st.contratos))}</span>`;
    const todosConPlazo = st.contratos.length > 0 && st.contratos.every((c) => Boolean(c.plazo));
    $('cotBar').innerHTML = st.paso === 1
      ? `<span></span>${total}<span class="cot-bar__acc"><button class="ds-btn ds-btn--primary ds-btn--md" type="button" id="cotSig">${T.selPlazos}${ico('next', 16)}</button></span>`
      : `<span><button class="ds-btn ds-btn--secondary ds-btn--md" type="button" id="cotAtras">${ico('back', 16)}${T.paso1}</button></span>${total}<span class="cot-bar__acc">${todosConPlazo ? `<button class="ds-btn ds-btn--primary ds-btn--md" type="button" id="cotCarrito">${T.carrito}${ico('next', 16)}</button>` : ''}</span>`;
  }
  function pintarPasos() {
    const a = $('cotPaso1'); const b = $('cotPaso2');
    a.className = 'ds-stepper__step ' + (st.paso === 1 ? 'ds-stepper__step--active' : 'ds-stepper__step--complete');
    b.className = 'ds-stepper__step' + (st.paso === 2 ? ' ds-stepper__step--active' : '');
    a.querySelector('.ds-stepper__dot').innerHTML = st.paso === 1 ? '<span class="ds-stepper__dot-number">1</span>' : ico('check', 16);
    a.setAttribute('aria-current', st.paso === 1 ? 'step' : 'false'); b.setAttribute('aria-current', st.paso === 2 ? 'step' : 'false');
  }
  ICO.check = P('M9.55 18 3.85 12.3l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4 9.55 18Z');
  function pintarDer() {
    const der = $('cotDer');
    if (st.paso === 2) { der.className = 'cot-der'; der.innerHTML = htmlPlazos(); return; }
    const a = artSel();
    if (!a) { der.className = 'cot-der cot-der--vacio'; der.innerHTML = `<p class="cot-caption">${T.vacioPanel}</p>`; return; }
    der.className = 'cot-der'; der.innerHTML = htmlEvaluacion(a);
  }
  let refocando = false;   // pintar() devuelve el foco al mismo campo: no cuenta como "entrar" al campo
  function pintar(foco) {
    const activo = foco || (document.activeElement && document.activeElement.id);
    const pos = document.activeElement && 'selectionStart' in document.activeElement ? document.activeElement.selectionStart : null;
    const ae = document.activeElement;
    const attr = !foco && ae && ['data-art', 'data-toggle-con', 'data-pl-toggle', 'data-sec', 'data-add-art'].find((k) => ae.hasAttribute && ae.hasAttribute(k));
    const sel = attr ? `[${attr}="${ae.getAttribute(attr)}"]` : null;
    pintarPasos(); pintarIzq(); pintarDer(); pintarBarra();
    refocando = true;
    if (sel && document.querySelector(sel)) { document.querySelector(sel).focus(); refocando = false; return; }
    if (activo && $(activo)) { const f = $(activo); f.focus(); try { if (pos != null && f.setSelectionRange) f.setSelectionRange(pos, pos); } catch (e) { /* select */ } }
    refocando = false;
  }

  /* ========== acciones ========== */
  // al elegir artículo se colapsan los demás contratos (useEffect de ContractList)
  function seleccionarArticulo(id) {
    st.selArt = id; st.dato = true;
    const dueño = contratoDe(id); if (dueño) st.colapsados = new Set(st.contratos.map((c) => c.id).filter((x) => x !== dueño.id));
  }
  function asegurarSeleccion() { if (!artSel() && todos().length) seleccionarArticulo(todos()[0].id); }
  const quitarSiVacio = (cid) => { const c = st.contratos.find((x) => x.id === cid); if (c && !c.articulos.length) { st.contratos = st.contratos.filter((x) => x !== c); renumerar(); } };
  function borrarArticulo(aid) {
    const c = contratoDe(aid); if (!c) return;
    c.articulos = c.articulos.filter((a) => a.id !== aid); const cid = c.id; quitarSiVacio(cid);
    asegurarSeleccion(); guardarBorrador(); pintar();
  }
  function borrarContrato(cid) { st.contratos = st.contratos.filter((c) => c.id !== cid); renumerar(); asegurarSeleccion(); guardarBorrador(); pintar(); }
  function crearContrato() { st.contratos.push(nuevoContrato(siguienteId())); guardarBorrador(); pintar(); }
  // addArticleToContractOrNewOne: si el servicio dice que no pueden ir juntos, se crea un contrato nuevo con el artículo
  async function agregarArticulo(cid, cat) {
    st.pendiente = cat.id; pintar('cotQ');
    const estados = await SRV.estados();
    const a = { id: Date.now().toString(36) + '-' + cat.id, catId: cat.id, nombre: cat.nombre, ruta: cat.ruta, tipo: cat.tipo, props: SRV.propiedades(cat),
      valores: {}, estados, estado: '', avaluo: null, prestamo: null, venta: null, terminos: 0, notasAbiertas: false };
    a.props.filter((p) => p.tipo === 4).forEach((p) => { a.valores[p.id] = 'false'; });   // withCheckboxDefaults
    const c = st.contratos.find((x) => x.id === cid);
    if (c && (!c.articulos.length || SRV.valida([...c.articulos, a]))) c.articulos.push(a);
    else { const n = nuevoContrato(siguienteId()); n.articulos.push(a); st.contratos.push(n); }
    st.pendiente = null; st.buscarEn = null; st.q = ''; st.resultados = []; st.bEstado = 'idle';
    asegurarSeleccion(); guardarBorrador(); pintar();
  }
  // moveArticleBetweenContractsWithValidation / moveArticleToNewContract
  function mover(origenId, idx, destinoId, destIdx) {
    const o = st.contratos.find((c) => c.id === origenId); const a = o && o.articulos[idx]; if (!a) return;
    if (destinoId === '__nuevo__') {
      o.articulos.splice(idx, 1); const n = nuevoContrato(siguienteId()); n.articulos.push(a); st.contratos.push(n); quitarSiVacio(origenId);
    } else {
      const d = st.contratos.find((c) => c.id === destinoId); if (!d) return;
      if (d !== o && d.articulos.length && !SRV.valida([...d.articulos, a])) { toast({ tipo: 'warning', texto: T.noArrastrar }); return; }
      o.articulos.splice(idx, 1);
      const pos = destIdx == null ? d.articulos.length : Math.min(destIdx, d.articulos.length);
      d.articulos.splice(pos, 0, a); if (d !== o) quitarSiVacio(origenId);
    }
    guardarBorrador(); pintar();
  }
  // handleSelectTerms: completa → paso 2; si no, marca errores, enfoca el primer pendiente y avisa
  function seleccionarPlazos() {
    if (cotizacionCompleta()) { st.paso = 2; st.buscarEn = null; if (!st.selContrato || !contratoSel()) st.selContrato = st.contratos[0].id; guardarBorrador(); pintar(); $('cotDer').scrollTop = 0; return; }
    st.intento = true;
    for (const c of st.contratos) {
      const inc = c.articulos.find((a) => !completo(a));
      if (inc || !c.articulos.length) { st.selContrato = c.id; if (inc) seleccionarArticulo(inc.id); break; }
    }
    pintar();
    toast({ tipo: 'error', titulo: T.reqTitulo, texto: T.reqTexto });
  }
  // TermSelectorFooterBar → info legal; PawnQuoterV4.handleAddToCart → cliente vinculado; AddQuote + extensión; luego al Home
  async function agregarAlCarrito() {
    if (proto.legal !== 'ok') { toast({ texto: T.errLegal }); return; }
    if (!st.cliente) { toast({ texto: T.errCliente }); return; }
    const b = $('cotCarrito'); b.disabled = true;   // evita el doble envío mientras se va al Home
    const cli = { nuc: st.cliente.nuc, nombre: st.cliente.nombre, telefono: st.cliente.tel };
    const items = st.contratos.map((c) => {
      const p = PLAZOS.find((x) => x.id === c.plazo);
      const q = c.ext.activo ? cotizacionExt(c) : null;
      const dias = q && c.ext.fecha ? diasExt(q.vence, new Date(c.ext.fecha)) : 0;
      const ext = dias > 0 ? { dias, monto: dias * q.costoDia } : null;
      return { id: 'emp-' + c.id + '-' + Date.now().toString(36), tipo: 'empeno', contrato: c.id,
        titulo: c.articulos.length === 1 ? c.articulos[0].nombre : `Empeño · ${c.articulos.length} artículos`,
        detalle: `Contrato ${c.id} · Plazo ${p ? p.nombre + ' (' + p.pct + '%)' : ''} · Avalúo ${money0(totalAvaluo([c]))}${ext ? ` · Extensión ${ext.dias} día${ext.dias === 1 ? '' : 's'} (${money(ext.monto)})` : ''}`,
        monto: totalPrestar([c]), plazo: p ? p.nombre : '', extension: ext,
        // prendas del contrato para el contrato y el ticket de empeño (../pasarela/contrato-firma.js)
        articulos: c.articulos.filter(completo).map((a) => ({
          nombre: a.nombre, ruta: a.ruta, avaluo: a.avaluo || 0, prestamo: a.prestamo || 0,
          estado: ((a.estados || []).find((x) => String(x.id) === String(a.estado)) || {}).nombre || '',
          caracteristicas: (a.props || []).map((pp) => { const v = a.valores[pp.id]; return v === 'true' ? pp.nombre : v && v !== 'false' ? (/accesorios/i.test(pp.nombre) ? 'accesorios ' : '') + v + (/\(g\)/.test(pp.nombre) ? ' g' : '') : ''; }).filter(Boolean).join(' · '),
        })),
        cotitulares: c.cotit.activo ? st.personas.filter((x) => (c.cotit.roles[x.pid] || {}).cot || (c.cotit.roles[x.pid] || {}).ben).map((x) => x.nombres + ' ' + x.paterno) : [] };
    });
    let ok = true;
    if (window.atsCarrito && typeof window.atsCarrito.agregarDe === 'function') ok = items.map((x) => window.atsCarrito.agregarDe(cli, x)).every((x) => x != null);
    else {
      try { const car = JSON.parse(localStorage.getItem('ats-carrito') || 'null') || { cliente: null, items: [] }; car.cliente = cli; car.items.push(...items); localStorage.setItem('ats-carrito', JSON.stringify(car)); } catch (e) { /* sin almacenamiento */ }
    }
    b.disabled = false; b.classList.remove('ds-btn--loading'); b.removeAttribute('aria-busy');
    if (!ok) return;
    borrarBorrador();
    location.href = '../home/';
  }

  /* ---------- cliente: ClientAssociation (búsqueda → tarjeta | validar correo) ---------- */
  const IL15 = 'ilust-15-empty.svg';
  function abrirVincular() {
    let vista = 'buscar'; let cli = null; let q = ''; let res = []; let cargandoB = false; let reloj = null; let correo = ''; let errCorreo = false;
    const meta = (c) => `NUC ${c.nuc} - ${c.correo}`;
    const marcar = (n) => { const i = sinAcentos(n).indexOf(sinAcentos(q.trim())); return i < 0 || !q.trim() ? esc(n) : esc(n.slice(0, i)) + '<b>' + esc(n.slice(i, i + q.trim().length)) + '</b>' + esc(n.slice(i + q.trim().length)); };
    const cuerpo = () => {
      if (vista === 'correo') return `<div class="cot-vc"><div class="cot-vc__cli"><b>${esc(cli.nombre)}</b><span class="ds-tag ds-tag--gris">${esc(cli.casa)}</span></div>
        <div class="cot-vc__copy"><b>Ingresa los datos del cliente</b><span>Ingrese los datos para cargar la información registrada previamente en otra casa de empeño.</span></div>
        ${campoInput('cotCorreo', 'Correo electrónico', correo, errCorreo ? 'Ingresa un correo electrónico válido' : '', 'type="email" autocomplete="off"')}</div>`;
      if (vista === 'tarjeta') return `<div class="cot-cli"><span class="ds-avatar cot-cli__av" aria-hidden="true">${esc(iniciales(cli.nombre))}</span><div class="cot-cli__d">
        <div class="cot-cli__h"><b title="${esc(cli.nombre)}">${esc(cli.nombre)}</b><span class="cot-cli__acts"><button class="ds-btn ds-btn--tertiary cot-iconbtn cot-iconbtn--p" type="button" id="cotCliPerfil" aria-label="Ver perfil del cliente">${ico('perfil', 20)}</button><span class="cot-vsep" aria-hidden="true"></span><button class="ds-btn ds-btn--tertiary cot-iconbtn cot-iconbtn--p" type="button" id="cotCliQuitar" aria-label="Quitar selección">${ico('trash', 20)}</button></span></div>
        <div class="cot-cli__s"><span>${ico('card', 18)}NUC ${esc(cli.nuc)}</span><span class="cot-vsep" aria-hidden="true"></span><span class="cot-cli__mail" title="${esc(cli.correo)}">${ico('mail', 18)}${esc(cli.correo)}</span><span class="cot-vsep" aria-hidden="true"></span><span>${ico('call', 18)}${esc(cli.lada)} ${esc(cli.tel.slice(0, 2) + ' ' + cli.tel.slice(2, 6) + ' ' + cli.tel.slice(6))}</span>
          <span>${ico('atm', 18)}Deuda:<span class="ds-tag ds-tag--blanco">${money(cli.deuda)}</span></span><span class="cot-vsep" aria-hidden="true"></span><span>${ico('paid', 18)}Ingresos:<span class="ds-tag ds-tag--gris">${money(cli.ingresos)}</span></span></div></div></div>`;
      const lista = q.trim().length >= 3 ? `<div class="cot-cdd" role="listbox" aria-label="Clientes">${cargandoB ? '<div class="cot-bres__load"><span class="ds-spinner ds-spinner--sm ds-spinner--brand" role="status" aria-label="Buscando"></span></div>'
        : `<button class="cot-cdd__it cot-cdd__crear" type="button" role="option" data-crear>${ico('add', 20)}Crear cliente</button>${res.map((c) => `<button class="cot-cdd__it" type="button" role="option" data-cli="${c.id}"><span>${marcar(c.nombre)}</span><small>${esc(meta(c))}</small></button>`).join('')}${res.length ? '' : '<span class="cot-cdd__vacio">No encontramos resultados para tu búsqueda</span>'}`}</div>` : '';
      return `<div class="cot-vc__buscar"><div class="cot-search"><input class="cot-search__in" id="cotCliQ" type="search" placeholder="Busca a un usuario" aria-label="Busca a un usuario" value="${esc(q)}" autocomplete="off" /><span class="cot-search__ico">${ico('search', 24)}</span></div>${lista}</div>
        <div class="cot-vc__vacio"><img src="${IL15}" width="120" height="120" alt="" /><span>Aquí verás el cliente seleccionado y un resumen de su perfil</span></div>`;
    };
    const pie = () => vista === 'tarjeta' ? `<button class="ds-btn ds-btn--secondary ds-btn--md" type="button" id="cotOtroCli">${ico('search', 20)}Buscar otro cliente</button><button class="ds-btn ds-btn--primary ds-btn--md" type="button" id="cotVincular">Vincular cliente</button>`
      : vista === 'correo' ? '<button class="ds-btn ds-btn--secondary ds-btn--md" type="button" id="cotVcCancel">Cancelar</button><button class="ds-btn ds-btn--primary ds-btn--md" type="button" id="cotVcOk">Confirmar</button>'
        : '<button class="ds-btn ds-btn--secondary ds-btn--md" type="button" data-cerrar>Cancelar</button>';
    const repinta = (foco) => { $('cotModalB').innerHTML = cuerpo(); $('cotModalF').innerHTML = pie(); const f = foco && $(foco); if (f) { f.focus(); if (f.setSelectionRange) f.setSelectionRange(f.value.length, f.value.length); } };
    const ov = modal('Vincular cliente', cuerpo(), pie(), { cls: 'cot-modal--vc' });
    const aBuscar = () => { vista = 'buscar'; cli = null; correo = ''; errCorreo = false; repinta('cotCliQ'); };
    ov.addEventListener('input', (e) => {
      if (e.target.id === 'cotCliQ') {
        q = e.target.value; clearTimeout(reloj);
        reloj = setTimeout(async () => { if (q.trim().length < 3) { res = []; repinta('cotCliQ'); return; } res = await SRV.clientes(q.trim()); repinta('cotCliQ'); }, 900);
      }
      if (e.target.id === 'cotCorreo') correo = e.target.value;
    });
    ov.addEventListener('click', async (e) => {
      const t = e.target.closest('button'); if (!t) return;
      if (t.dataset.crear !== undefined) { location.href = '../clientes/cliente-nuevo.html'; return; }
      if (t.dataset.cli) {
        cli = CLIENTES.find((c) => c.id === t.dataset.cli);    // GetClientProfile
        vista = cli.vinculado ? 'tarjeta' : 'correo'; repinta(vista === 'correo' ? 'cotCorreo' : 'cotVincular'); return;
      }
      if (t.id === 'cotCliQuitar' || t.id === 'cotOtroCli' || t.id === 'cotVcCancel') { aBuscar(); return; }
      if (t.id === 'cotCliPerfil') { guardarBorrador(true); location.href = '../clientes/'; return; }
      if (t.id === 'cotVcOk') {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) { errCorreo = true; repinta('cotCorreo'); return; }
        vista = 'tarjeta'; repinta('cotVincular'); return;
      }
      if (t.id === 'cotVincular') { st.cliente = cli; cerrarModal(); guardarBorrador(); pintar(); }
    });
  }

  /* ---------- cotitulares: CoOwnerModal ---------- */
  function abrirPersona(pid) {
    const c = contratoSel(); const x = st.personas.find((p) => p.pid === pid) || null;
    const r = x ? c.cotit.roles[x.pid] || {} : {};
    const f = x ? { ...x, cot: !!r.cot, ben: !!r.ben } : { nombres: '', paterno: '', materno: '', correo: '', lada: '+52', tel: '', idTipo: '', idNum: '', parentesco: '', cot: false, ben: false };
    let enviado = false;
    const usadoEnOtro = x ? st.contratos.some((k) => k.id !== c.id && ((k.cotit.roles[x.pid] || {}).cot || (k.cotit.roles[x.pid] || {}).ben)) : false;
    const errores = () => {
      const e = {};
      if (!f.nombres.trim()) e.nombres = T.obligatorio;
      if (!f.paterno.trim()) e.paterno = T.obligatorio;
      if (f.tel && f.tel.replace(/\D/g, '').length !== 10) e.tel = 'El teléfono debe tener 10 dígitos';
      if (f.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.correo)) e.correo = 'Correo electrónico inválido';
      if (!f.parentesco) e.parentesco = T.obligatorio;
      if (f.idTipo && !f.idNum.trim()) e.idNum = T.obligatorio;
      if (!f.cot && !f.ben) e.rol = 'Selecciona al menos un rol: Cotitular o Beneficiario';
      return e;
    };
    const cuerpo = () => {
      const e = enviado ? errores() : {};
      const inp = (k, id, l, opt, attrs = '') => campoInput(id, l, f[k], e[k], attrs).replace(`>${esc(l)}</label>`, `>${esc(l)}${opt ? '<span class="ds-label__optional"> (opcional)</span>' : ''}</label>`);
      return `<div class="cot-pm">
        <div class="cot-pm__roles"><div class="cot-pm__rrow">${[['cot', 'Cotitular'], ['ben', 'Beneficiario']].map(([k, l]) => `<label class="ds-check cot-check"><input type="checkbox" data-f="${k}"${f[k] ? ' checked' : ''} /><span class="ds-check__wrap"><span class="ds-check__box"></span></span>${l}</label>`).join('')}</div>${e.rol ? `<p class="ds-helper ds-helper--error">${e.rol}</p>` : ''}</div>
        <div class="cot-grid3">${inp('nombres', 'pmNombres', 'Nombre(s)')}${inp('paterno', 'pmPaterno', 'Apellido paterno')}${inp('materno', 'pmMaterno', 'Apellido materno', true)}</div>
        <div class="cot-grid3">${inp('correo', 'pmCorreo', 'Correo electrónico', true, 'type="email"')}
          <div class="ds-field"><label class="ds-label" for="pmTel">Teléfono</label><div class="ds-field-wrap${e.tel ? ' ds-field-wrap--error' : ''}"><span class="ds-field-addon ds-field-addon--left cot-lada">🇲🇽 +52</span><input class="ds-input" id="pmTel" inputmode="numeric" placeholder="55 0000 0000" value="${esc(f.tel)}" /></div>${ayuda(e.tel, 'pmTelE')}</div>
          ${campoSelect('pmIdTipo', 'Tipo de identificación', IDENTIFICACIONES.map((v) => [v, v]), f.idTipo, '').replace('>Tipo de identificación</label>', '>Tipo de identificación<span class="ds-label__optional"> (opcional)</span></label>')}</div>
        <div class="cot-grid3">${inp('idNum', 'pmIdNum', 'Número de documento', !f.idTipo)}${campoSelect('pmParentesco', 'Parentesco', PARENTESCOS.map((v) => [v, v]), f.parentesco, e.parentesco)}</div></div>`;
    };
    const borrarDeshabilitado = () => Boolean(f.cot || f.ben || usadoEnOtro);
    const pie = () => (x ? `<button class="ds-btn ds-btn--secondary ds-btn--md cot-btn-destr" type="button" id="pmBorrar"${borrarDeshabilitado() ? ' disabled' : ''}>Eliminar contacto</button>` : '<button class="ds-btn ds-btn--secondary ds-btn--md" type="button" data-cerrar>Cancelar</button>')
      + '<button class="ds-btn ds-btn--primary ds-btn--md" type="button" id="pmGuardar">Guardar Cambios</button>';
    const repinta = () => { const a = document.activeElement && document.activeElement.id; $('cotModalB').innerHTML = cuerpo(); $('cotModalF').innerHTML = pie(); if (a && $(a)) $(a).focus(); };
    const ov = modal(x ? 'Editar cotitular o beneficiario' : 'Agregar cotitular o beneficiario', cuerpo(), pie(), { cls: 'cot-modal--pm' });
    const mapa = { pmNombres: 'nombres', pmPaterno: 'paterno', pmMaterno: 'materno', pmCorreo: 'correo', pmTel: 'tel', pmIdNum: 'idNum', pmIdTipo: 'idTipo', pmParentesco: 'parentesco' };
    ov.addEventListener('input', (e) => {
      const k = mapa[e.target.id];
      if (k === 'tel') { const d = e.target.value.replace(/\D/g, '').slice(0, 10); f.tel = [d.slice(0, 2), d.slice(2, 6), d.slice(6)].filter(Boolean).join(' '); e.target.value = f.tel; }
      else if (k) f[k] = e.target.value;
      if (e.target.dataset.f) f[e.target.dataset.f] = e.target.checked;
      if (enviado || e.target.dataset.f || k === 'idTipo') repinta(); else $('cotModalF').innerHTML = pie();
    });
    ov.addEventListener('click', async (e) => {
      const t = e.target.closest('button'); if (!t) return;
      if (t.id === 'pmGuardar') {
        enviado = true; if (Object.keys(errores()).length) { repinta(); return; }
        // isWithinRoleLimits: máximo 2 cotitulares y 2 beneficiarios por contrato
        const roles = { ...c.cotit.roles, [x ? x.pid : '__nuevo']: { cot: f.cot, ben: f.ben } };
        const cuenta = Object.values(roles).reduce((s, v) => ({ cot: s.cot + (v.cot ? 1 : 0), ben: s.ben + (v.ben ? 1 : 0) }), { cot: 0, ben: 0 });
        if (cuenta.cot > 2 || cuenta.ben > 2) { toast({ texto: 'Debes seleccionar una persona de la lista para continuar. Max 2 Cotitulares, 2 Beneficiarios' }); return; }
        if (proto.cotit === 'error') { toast({ tipo: 'error', texto: 'No se pudo guardar el cotitular o beneficiario, intenta de nuevo' }); return; }
        const datos = { nombres: f.nombres.trim(), paterno: f.paterno.trim(), materno: f.materno.trim(), correo: f.correo.trim(), lada: f.lada, tel: f.tel, idTipo: f.idTipo, idNum: f.idNum.trim(), parentesco: f.parentesco };
        if (x) Object.assign(x, datos); else { const pid = 'p' + Date.now().toString(36); st.personas.push({ pid, ...datos }); c.cotit.roles[pid] = { cot: f.cot, ben: f.ben }; }
        if (x) c.cotit.roles[x.pid] = { cot: f.cot, ben: f.ben };
        cerrarModal(); guardarBorrador(); pintar();
      }
      if (t.id === 'pmBorrar') {
        if (usadoEnOtro) { toast({ texto: 'No se puede eliminar: esta persona ya está seleccionada como cotitular o beneficiario en otro contrato' }); return; }
        st.personas = st.personas.filter((p) => p.pid !== x.pid); st.contratos.forEach((k) => delete k.cotit.roles[x.pid]);
        cerrarModal(); guardarBorrador(); pintar();
      }
    });
  }

  /* ---------- borrador (HU-CE-582-F): sobrevive solo al ir al perfil del cliente y volver ---------- */
  const BORRADOR = 'ats-cotizador-borrador';
  const serial = () => JSON.stringify({ paso: st.paso, contratos: st.contratos, cliente: st.cliente, personas: st.personas, selArt: st.selArt, selContrato: st.selContrato });
  let irAPerfil = false;
  function guardarBorrador(perfil) { if (perfil) irAPerfil = true; if (!irAPerfil) return; try { sessionStorage.setItem(BORRADOR, serial()); } catch (e) { /* sin almacenamiento */ } }
  function borrarBorrador() { try { sessionStorage.removeItem(BORRADOR); } catch (e) { /* sin almacenamiento */ } }
  function leerBorrador() {
    try { const d = JSON.parse(sessionStorage.getItem(BORRADOR) || 'null'); borrarBorrador(); return d; } catch (e) { return null; }
  }

  /* ========== eventos ========== */
  const izq = $('cotIzq'); const der = $('cotDer');
  let relojBusqueda = null;
  let editandoMonto = null;
  izq.addEventListener('click', (e) => {
    if (e.target.closest('[data-stop]') && !e.target.closest('button')) return;
    const t = e.target.closest('button, [data-toggle-con], [data-art], #cotCrear');
    if (!t) return;
    if (t.id === 'cotNuevoCon' || t.id === 'cotCrear') { crearContrato(); return; }
    if (t.dataset.delArt) { e.stopPropagation(); borrarArticulo(t.dataset.delArt); return; }
    if (t.dataset.delCon) { e.stopPropagation(); borrarContrato(t.dataset.delCon); return; }
    if (t.dataset.addArt) { st.buscarEn = t.dataset.addArt; st.q = ''; st.resultados = []; st.bEstado = 'idle'; pintar(); return; }
    if (t.dataset.res) { const cat = st.resultados.find((r) => String(r.id) === t.dataset.res); if (cat) agregarArticulo(st.buscarEn, cat); return; }
    if (t.dataset.toggleCon) {
      const id = t.dataset.toggleCon;
      if (st.paso === 2) { st.selContrato = id; st.plazosAbiertos.clear(); }
      else if (st.colapsados.has(id)) st.colapsados.delete(id); else st.colapsados.add(id);
      pintar(); return;
    }
    if (t.dataset.art && st.paso === 1 && !e.target.closest('[data-handle]')) { seleccionarArticulo(t.dataset.art); pintar(); }
  });
  izq.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const t = e.target;
    if (t.matches('[data-toggle-con], [data-art], #cotCrear')) { e.preventDefault(); t.click(); }
  });
  izq.addEventListener('input', (e) => {
    if (e.target.id !== 'cotQ') return;
    st.q = e.target.value; clearTimeout(relojBusqueda);
    // useDebounce 800 ms y mínimo 3 letras
    relojBusqueda = setTimeout(async () => {
      const q = st.q.trim();
      if (q.length < 3) { st.resultados = []; st.bEstado = 'idle'; pintar('cotQ'); return; }
      st.bEstado = 'cargando'; pintar('cotQ');
      if (proto.busqueda === 'lenta') return;   // estado "Cargando" fijo, para revisarlo desde el riel
      try { st.resultados = await SRV.buscar(q); st.bEstado = 'ok'; } catch (err) { st.resultados = []; st.bEstado = 'error'; }
      if (st.q.trim() === q) pintar('cotQ');
    }, 800);
  });
  // al salir el foco del buscador (y no ir a un resultado) se cierra, como el onBlur de ContractArticleSearch
  izq.addEventListener('focusout', (e) => {
    const b = $('cotBuscar'); if (!b || !b.contains(e.target)) return;
    setTimeout(() => { const b2 = $('cotBuscar'); if (b2 && !b2.contains(document.activeElement) && !st.pendiente) { st.buscarEn = null; st.q = ''; st.resultados = []; st.bEstado = 'idle'; pintar(); } }, 0);
  });
  izq.addEventListener('mousedown', (e) => { if (e.target.closest('.cot-bres__it')) e.preventDefault(); });

  // arrastrar artículos (MultiContainerDragBoard): zonas "Arrastra para agregar aquí" en cada contrato y la de crear contrato
  izq.addEventListener('dragstart', (e) => {
    const h = e.target.closest('[data-handle]'); if (!h) return;
    const c = contratoDe(h.dataset.handle); st.arrastre = { cid: c.id, idx: c.articulos.findIndex((a) => a.id === h.dataset.handle) };
    e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', h.dataset.handle);
    const fila = h.closest('.cot-fila'); try { e.dataTransfer.setDragImage(fila, 20, 26); } catch (err) { /* sin imagen */ }
    requestAnimationFrame(() => { $('cotCons').classList.add('is-drag'); izq.querySelectorAll('.cot-con__body[hidden]').forEach((b) => { b.hidden = false; b.dataset.abierto = '1'; }); fila.classList.add('is-arrastrada'); });
  });
  const zonaDe = (el) => el.closest('[data-drop], .cot-con');
  izq.addEventListener('dragover', (e) => {
    if (!st.arrastre) return; const z = zonaDe(e.target); if (!z) return;
    e.preventDefault(); izq.querySelectorAll('.is-valida').forEach((x) => x.classList.remove('is-valida'));
    (z.matches('.cot-con') ? z.querySelector('.cot-drop') : z).classList.add('is-valida');
  });
  izq.addEventListener('drop', (e) => {
    if (!st.arrastre) return; e.preventDefault();
    const z = zonaDe(e.target); const a = st.arrastre; st.arrastre = null;
    if (!z) { pintar(); return; }
    const destino = z.dataset.drop || z.dataset.con;
    const fila = e.target.closest('.cot-fila');
    const c = st.contratos.find((x) => x.id === destino);
    const idx = fila && c ? c.articulos.findIndex((x) => x.id === fila.dataset.art) : null;
    if (destino === a.cid && (idx == null || idx === a.idx)) { pintar(); return; }
    mover(a.cid, a.idx, destino, idx);
  });
  izq.addEventListener('dragend', () => { if (st.arrastre) { st.arrastre = null; pintar(); } });

  // panel derecho
  // kilometraje: actualiza casillas, slider y texto de ayuda sin repintar todo (para no perder el foco al arrastrar)
  function pintarKm(pid, n, desde) {
    const o = $('cotOdo' + pid); if (!o) return;
    o.querySelector('.cot-odo__dig').innerHTML = odoDigitos(n); o.classList.toggle('is-vacio', n == null);
    const r = $('cotOdoR' + pid); if (r && desde !== 'rango') { r.value = Math.min(n || 0, KM_MAX); }
    if (r) { r.style.setProperty('--p', Math.min(100, ((n || 0) / KM_MAX) * 100) + '%'); r.setAttribute('aria-valuetext', (n || 0).toLocaleString('es-MX') + ' km'); }
    const inp = $('cotProp' + pid); if (inp && desde !== 'in') inp.value = n == null ? '' : String(n);
    const a = artSel(); const u = $('cotOdo' + pid + 'U'); if (a && u) u.innerHTML = usoHTML(a, n);
  }
  der.addEventListener('click', (e) => {
    const b = e.target.closest('[data-odo-paso]'); const a = artSel(); if (!b || !a) return;
    const pid = b.dataset.pid, n = Math.min(999999, Math.max(0, (num(a.valores[pid]) || 0) + Number(b.dataset.odoPaso)));
    a.valores[pid] = String(n); st.sucios.add(a.id + ':p' + pid); actualizarArt(a, b.id);
  });
  // DS ChoiceChip de una opción (role=radio): clic elige; ← → recorren el grupo
  der.addEventListener('click', (e) => {
    const c = e.target.closest('.ds-chip[data-prop]'); const a = artSel(); if (!c || !a) return;
    a.valores[c.dataset.prop] = c.dataset.v; st.sucios.add(a.id + ':p' + c.dataset.prop); actualizarArt(a, c.id);
  });
  der.addEventListener('keydown', (e) => {
    const c = e.target.closest('.ds-chip[data-prop]'); if (!c || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
    e.preventDefault();
    const g = [...c.parentElement.querySelectorAll('.ds-chip[data-prop]')], k = g.indexOf(c) + (e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 1);
    g[(k + g.length) % g.length].click();
  });
  // "Falta: Placas": lleva al campo (en las opciones de un toque, a la primera)
  der.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ir]'); if (!b) return;
    const el = $('cotProp' + b.dataset.ir + 'R0') || $('cotProp' + b.dataset.ir);
    if (el) { el.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); el.focus({ preventScroll: true }); }
  });
  // al salir del kilometraje se ve con separador de miles
  der.addEventListener('focusout', (e) => { const t = e.target; if (t.dataset && t.dataset.miles !== undefined && t.dataset.odo === undefined && t.value) t.value = miles(t.value); });
  der.addEventListener('focusin', (e) => { const t = e.target; if (t.dataset && t.dataset.miles !== undefined && t.value) t.value = t.value.replace(/[^0-9]/g, ''); if (t.dataset && t.dataset.odo && !t._sel && !refocando) { t._sel = true; requestAnimationFrame(() => { try { t.select(); } catch (er) { /* */ } }); } });
  der.addEventListener('focusout', (e) => { if (e.target.dataset && e.target.dataset.odo) e.target._sel = false; });
  der.addEventListener('click', (e) => {
    const t = e.target.closest('button, [data-pl-toggle]'); if (!t) return;
    const a = artSel();
    if (t.dataset.sec) { const k = { car: 'secCar', pre: 'secPre', plazos: 'secPlazos' }[t.dataset.sec]; st[k] = !st[k]; pintar(); return; }
    if (t.id === 'cotAddNotas' && a) { a.notasAbiertas = true; pintar(); $('cotNotas').focus(); return; }
    if (t.id === 'cotDatoX') { st.dato = false; pintar(); return; }
    if (t.dataset.vincular !== undefined) { abrirVincular(); return; }
    if (t.dataset.plToggle && !e.target.closest('[data-stop]')) { const id = t.dataset.plToggle; if (st.plazosAbiertos.has(id)) st.plazosAbiertos.delete(id); else st.plazosAbiertos.add(id); pintar(); return; }
    if (t.dataset.addPersona !== undefined) { abrirPersona(null); return; }
    if (t.dataset.editPersona) { abrirPersona(t.dataset.editPersona); }
  });
  der.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-pl-toggle]')) { e.preventDefault(); e.target.click(); }
  });
  // valores que se escriben (sin repintar en cada tecla para no perder el cursor; se repinta lo que depende de ellos)
  const actualizarArt = (a, foco) => {
    recalcularMetal(a);
    const m = maxPrestamo(a);
    // GetArticleSale: en generales solo si el préstamo no supera el máximo; en metales siempre que haya estado, avalúo y préstamo
    a.venta = a.estado && a.avaluo != null && a.prestamo != null && (esMetal(a) || (m !== null && a.prestamo <= m)) ? SRV.precioVenta(a.prestamo) : (esMetal(a) ? a.venta : null);
    // GetTermSelectionList con préstamo y avalúo del artículo → "Dato clave"
    a.terminos = a.prestamo && a.avaluo ? SRV.plazos(a.prestamo, a.avaluo, false).length : 0;
    pintar(foco);
  };
  der.addEventListener('input', (e) => {
    const a = artSel(); const t = e.target;
    if (t.id === 'cotNotas' && a) { a.valores.notes = t.value; return; }
    if (!a || st.paso !== 1) return;
    if (t.dataset.mayus !== undefined) { const c0 = t.selectionStart; t.value = t.value.toUpperCase(); try { t.setSelectionRange(c0, c0); } catch (er) { /* sin cursor */ } }
    if (t.dataset.placa !== undefined) { const pl = t.closest('.cot-placa'); if (pl) pl.classList.toggle('is-vacio', !t.value); }
    if (t.dataset.odo) { const nn = Number(t.value.replace(/[^0-9]/g, '')) || 0; pintarKm(t.dataset.odo, t.value ? nn : null, 'in'); }
    if (t.dataset.odoRango && a) { const pid = t.dataset.odoRango; a.valores[pid] = t.value; st.sucios.add(a.id + ':p' + pid); pintarKm(pid, Number(t.value), 'rango'); clearTimeout(t._r); t._r = setTimeout(() => actualizarArt(a, t.id), 250); return; }
    if (t.id.startsWith('cotProp') && t.type !== 'checkbox') { const pid = t.id.slice(7); a.valores[pid] = t.dataset.miles !== undefined ? t.value.replace(/[^0-9]/g, '') : t.value; st.sucios.add(a.id + ':p' + pid); if (t.tagName === 'SELECT') actualizarArt(a, t.id); else { clearTimeout(t._r); t._r = setTimeout(() => actualizarArt(a, t.id), 300); } return; }
    if (t.id === 'cotEstado') { a.estado = t.value; st.sucios.add(a.id + ':estado'); actualizarArt(a, t.id); return; }
    if (t.id === 'cotAvaluo' || t.id === 'cotPrestamo') {
      const k = t.id === 'cotAvaluo' ? 'avaluo' : 'prestamo'; a[k] = num(t.value); st.sucios.add(a.id + ':' + k);
      clearTimeout(t._r); t._r = setTimeout(() => { if (document.activeElement === t) actualizarArtSinMoneda(a, t.id); }, 300);
    }
  });
  // mientras se escribe el monto se deja tal cual; al salir se formatea como moneda
  const actualizarArtSinMoneda = (a, id) => { editandoMonto = id; actualizarArt(a, id); editandoMonto = null; };
  der.addEventListener('focusin', (e) => { const t = e.target; if (t.matches('[data-moneda]') && t.value) { const n = num(t.value); t.value = n == null ? '' : String(n); } });
  der.addEventListener('focusout', (e) => { const t = e.target; if (t.matches('[data-moneda]')) { const a = artSel(); if (a) { setTimeout(() => { if (!der.contains(document.activeElement) || !document.activeElement.matches('[data-moneda]')) actualizarArt(a); else pintarMontos(); }, 0); } } });
  function pintarMontos() { const a = artSel(); if (!a) return; ['cotAvaluo', 'cotPrestamo'].forEach((id) => { const el = $(id); if (el && el !== document.activeElement) { const v = id === 'cotAvaluo' ? a.avaluo : a.prestamo; el.value = v == null ? '' : money(v); } }); }
  der.addEventListener('change', (e) => {
    const t = e.target; const a = artSel();
    if (t.type === 'checkbox' && t.id.startsWith('cotProp') && a) { a.valores[t.id.slice(7)] = t.checked ? 'true' : 'false'; actualizarArt(a, t.id); return; }
    const c = contratoSel(); if (!c) return;
    if (t.name === 'term-selection') { c.plazo = t.value; guardarBorrador(); pintar(); return; }
    if (t.id === 'cotCotit') {
      if (t.checked && !st.cliente) { t.checked = false; toast({ texto: T.errCotit }); return; }
      c.cotit.activo = t.checked; guardarBorrador(); pintar('cotCotit'); return;
    }
    if (t.id === 'cotExt') {
      if (t.checked && !c.plazo) { t.checked = false; toast({ texto: T.errExt }); return; }
      c.ext.activo = t.checked; guardarBorrador(); pintar('cotExt'); return;
    }
    if (t.id === 'cotFecha') { const [y, m, d] = t.value.split('-').map(Number); c.ext.fecha = t.value ? new Date(y, m - 1, d).toISOString() : null; guardarBorrador(); pintar('cotFecha'); return; }
    if (t.dataset.rol) {
      // isWithinRoleLimits por contrato
      const r = { ...(c.cotit.roles[t.dataset.pid] || {}), [t.dataset.rol]: t.checked };
      const roles = { ...c.cotit.roles, [t.dataset.pid]: r };
      const cuenta = Object.values(roles).reduce((s, v) => ({ cot: s.cot + (v.cot ? 1 : 0), ben: s.ben + (v.ben ? 1 : 0) }), { cot: 0, ben: 0 });
      if (cuenta.cot > 2 || cuenta.ben > 2) { t.checked = !t.checked; toast({ texto: 'Debes seleccionar una persona de la lista para continuar. Max 2 Cotitulares, 2 Beneficiarios' }); return; }
      c.cotit.roles = roles; guardarBorrador();
    }
  });
  // HU-CE-608-F: al abrir el selector de nueva fecha se contrae la sección de plazos
  der.addEventListener('mousedown', (e) => { if (e.target.id === 'cotFecha' && st.secPlazos) { st.secPlazos = false; requestAnimationFrame(() => pintar('cotFecha')); } });
  der.addEventListener('submit', (e) => e.preventDefault());
  der.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.closest('#cotEval') && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'BUTTON') e.preventDefault(); });

  $('cotBar').addEventListener('click', (e) => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.id === 'cotSig') seleccionarPlazos();
    if (t.id === 'cotAtras') { st.paso = 1; pintar(); }
    if (t.id === 'cotCarrito') agregarAlCarrito();
  });
  document.querySelectorAll('[data-salir]').forEach((a) => a.addEventListener('click', borrarBorrador));

  /* ========== "Estados de la maqueta" ========== */
  const catDe = (id) => CATALOGO.find((c) => c.id === id);
  const listo = (cid, valores, estado, avaluo, prestamo) => {
    const cat = catDe(cid);
    const a = { id: 'ej-' + cid + '-' + Math.random().toString(36).slice(2, 6), catId: cid, nombre: cat.nombre, ruta: cat.ruta, tipo: cat.tipo, props: SRV.propiedades(cat), valores, estados: ESTADOS, estado: String(estado), avaluo, prestamo, venta: null, terminos: 0, notasAbiertas: false };
    recalcularMetal(a); a.venta = SRV.precioVenta(prestamo); a.terminos = SRV.plazos(prestamo, a.avaluo, false).length; return a;
  };
  function reiniciar() { Object.assign(st, { paso: 1, contratos: [], selArt: '', selContrato: null, cliente: null, intento: false, colapsados: new Set(), buscarEn: null, q: '', resultados: [], bEstado: 'idle', secCar: true, secPre: true, dato: true, sucios: new Set(), secPlazos: true, plazosAbiertos: new Set(), personas: [] }); }
  function ejemplo() {
    reiniciar();
    const c1 = nuevoContrato('00001'); c1.articulos.push(listo(501, { 1: '14K', 2: '12', 3: '2' }, 1, null, 8000));
    const c2 = nuevoContrato('00002'); c2.articulos.push(listo(601, { 11: 'Samsung', 12: 'true', 14: 'UN55', 15: 'SN12345' }, 2, 6000, 3000));
    st.contratos = [c1, c2]; seleccionarArticulo(c1.articulos[0].id);
  }
  function ejemploAuto() {
    reiniciar();
    const cat = catDe(701);
    const a = { id: 'ej-701-' + Math.random().toString(36).slice(2, 6), catId: 701, nombre: cat.nombre, ruta: cat.ruta, tipo: cat.tipo, props: SRV.propiedades(cat),
      valores: { 23: '2020', 25: 'Automática', 28: '45000', 32: 'true', 33: 'true', 37: 'true', 34: 'false', 35: 'false', 36: 'false', 38: 'false' },
      estados: ESTADOS, estado: '', avaluo: null, prestamo: null, venta: null, terminos: 0, notasAbiertas: false };
    const c1 = nuevoContrato('00001'); c1.articulos.push(a);
    st.contratos = [c1]; seleccionarArticulo(a.id);
  }
  $('protoBusqueda').addEventListener('change', (e) => { proto.busqueda = e.target.value; });
  $('protoValida').addEventListener('change', (e) => { proto.valida = e.target.value; });
  $('protoLegal').addEventListener('change', (e) => { proto.legal = e.target.value; });
  $('protoCotit').addEventListener('change', (e) => { proto.cotit = e.target.value; });
  document.querySelectorAll('[data-proto]').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.proto;
    if (k === 'vacio') reiniciar();
    if (k === 'ejemplo') ejemplo();
    if (k === 'auto') ejemploAuto();
    if (k === 'plazos') { ejemplo(); st.paso = 2; st.selContrato = '00001'; }
    if (k === 'sincar') { if (st.paso === 2) st.paso = 1; const cat = catDe(605); const n = nuevoContrato(siguienteId()); n.articulos.push({ id: 'ej-605-' + Date.now().toString(36), catId: 605, nombre: cat.nombre, ruta: cat.ruta, tipo: 'general', props: [], valores: {}, estados: ESTADOS, estado: '', avaluo: null, prestamo: null, venta: null, terminos: 0, notasAbiertas: false }); st.contratos.push(n); seleccionarArticulo(n.articulos[0].id); }
    pintar();
  }));

  /* ========== arranque ========== */
  const params = new URLSearchParams(location.search);
  const borrador = leerBorrador();
  if (borrador) { Object.assign(st, borrador); asegurarSeleccion(); }
  else if (params.get('paso') === '2') { ejemplo(); st.paso = 2; st.selContrato = '00001'; }
  else if (params.get('ejemplo') === 'auto') ejemploAuto();
  else if (params.get('ejemplo')) ejemplo();
  pintar();
})();
