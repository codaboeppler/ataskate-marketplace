/* Inventario del Operativo — Figma Entregable 13 · HU-CE-571 (Comercial) y HU-CE-572 (Prendario).
   Datos de muestra en el propio archivo. Cada tarjeta lleva a su ficha: Comercial → ../v2/ (Detalles de artículo V2),
   Prendario → ../v2-prendario/. ?tipo=prendario abre en Prendario; ?vacio=1 muestra el estado vacío del Figma. */
(() => {
  const $ = (id) => document.getElementById(id);
  const IMG = '../assets/inventario/';

  // iconos exportados del Figma (se pintan con currentColor)
  const ICO = {
    dropdown: '<svg viewBox="0 0 24 24" fill="none"><path d="M5.7 9.7 7.1 8.3l4.6 4.6 4.6-4.6 1.4 1.4-6 6-6-6Z" fill="currentColor"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none"><path d="M19.6 21 13.3 14.7C12.8 15.1 12.225 15.417 11.575 15.65 10.925 15.883 10.233 16 9.5 16 7.683 16 6.146 15.371 4.888 14.113 3.629 12.854 3 11.317 3 9.5 3 7.683 3.629 6.146 4.888 4.887 6.146 3.629 7.683 3 9.5 3c1.817 0 3.354.629 4.613 1.887C15.371 6.146 16 7.683 16 9.5c0 .733-.117 1.425-.35 2.075-.233.65-.55 1.225-.95 1.725l6.3 6.3-1.4 1.4ZM9.5 14c1.25 0 2.313-.437 3.188-1.312C13.563 11.813 14 10.75 14 9.5c0-1.25-.437-2.313-1.312-3.188C11.813 5.437 10.75 5 9.5 5c-1.25 0-2.313.437-3.188 1.312C5.437 7.187 5 8.25 5 9.5c0 1.25.437 2.313 1.312 3.188C7.187 13.563 8.25 14 9.5 14Z" fill="currentColor"/></svg>',
    grid: '<svg viewBox="0 0 20 20" fill="none"><path d="M2.5 9.167V2.5h6.667v6.667H2.5Zm0 8.333v-6.667h6.667V17.5H2.5Zm8.333-8.333V2.5H17.5v6.667h-6.667Zm0 8.333v-6.667H17.5V17.5h-6.667ZM4.167 7.5H7.5V4.167H4.167V7.5Zm8.333 0h3.333V4.167H12.5V7.5Zm0 8.333h3.333V12.5H12.5v3.333Zm-8.333 0H7.5V12.5H4.167v3.333Z" fill="currentColor"/></svg>',
    list: '<svg viewBox="0 0 20 20" fill="none"><path d="M4.167 9.167c-.459 0-.851-.164-1.178-.49A1.605 1.605 0 0 1 2.5 7.5V4.167c0-.459.163-.851.489-1.178.327-.326.719-.489 1.178-.489h11.666c.459 0 .851.163 1.178.489.326.327.489.719.489 1.178V7.5c0 .458-.163.85-.489 1.177-.327.326-.719.49-1.178.49H4.167Zm0-1.667h11.666V4.167H4.167V7.5Zm0 10c-.459 0-.851-.163-1.178-.49A1.605 1.605 0 0 1 2.5 15.833V12.5c0-.458.163-.851.489-1.177.327-.327.719-.49 1.178-.49h11.666c.459 0 .851.163 1.178.49.326.326.489.719.489 1.177v3.333c0 .459-.163.851-.489 1.177-.327.327-.719.49-1.178.49H4.167Zm0-1.667h11.666V12.5H4.167v3.333Z" fill="currentColor"/></svg>',
    redo: '<svg viewBox="0 0 20 20" fill="none"><path d="M8.25 15.833c-1.347 0-2.503-.437-3.468-1.312-.966-.875-1.449-1.966-1.449-3.271s.483-2.396 1.449-3.271c.965-.875 2.121-1.312 3.468-1.312h5.25L11.334 4.5 12.5 3.333 16.667 7.5 12.5 11.667l-1.166-1.167L13.5 8.333H8.25c-.875 0-1.635.278-2.28.834-.646.555-.97 1.25-.97 2.083s.324 1.528.97 2.083c.645.556 1.405.834 2.28.834h5.917v1.666H8.25Z" fill="currentColor"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none"><path d="M18 14l-1.4 1.4-4.6-4.6-4.6 4.6L6 14l6-6 6 6Z" fill="currentColor"/></svg>',
    down: '<svg viewBox="0 0 20 20" fill="none"><path d="M4.75 8.083 5.917 6.917 9.75 10.75l3.833-3.833 1.167 1.166-5 5-5-5Z" fill="currentColor"/></svg>',
    help: '<svg viewBox="0 0 20 20" fill="none"><path d="M9.958 15c.292 0 .538-.1.74-.303.2-.201.302-.448.302-.739 0-.292-.101-.538-.302-.74a1.008 1.008 0 0 0-.74-.301c-.291 0-.538.1-.74.302-.2.2-.301.447-.301.739 0 .291.1.538.302.74.201.2.448.302.739.302Zm.125-8.583c.389 0 .701.107.937.322.236.216.355.497.355.844 0 .236-.08.476-.24.718-.16.244-.385.497-.677.761-.417.361-.722.709-.917 1.042-.194.333-.291.667-.291 1 0 .194.073.358.219.49a.75.75 0 0 0 .51.197.775.775 0 0 0 .52-.209c.153-.139.25-.312.292-.52.042-.237.135-.455.282-.656.145-.202.385-.463.718-.782.43-.403.733-.77.906-1.104.174-.333.26-.701.26-1.104 0-.709-.267-1.289-.801-1.74-.535-.452-1.226-.677-2.073-.677-.584 0-1.101.111-1.552.333-.451.222-.802.563-1.052 1.021a.817.817 0 0 0-.104.531.7.7 0 0 0 .292.427.88.88 0 0 0 .594.104.86.86 0 0 0 .531-.354c.153-.208.337-.368.552-.479.215-.111.462-.167.74-.167ZM10 18.333c-1.139 0-2.215-.218-3.23-.656a8.505 8.505 0 0 1-2.655-1.781 8.36 8.36 0 0 1-1.792-2.647A8.105 8.105 0 0 1 1.666 10c0-1.153.219-2.236.657-3.25a8.36 8.36 0 0 1 1.792-2.646 8.505 8.505 0 0 1 2.656-1.781A8.07 8.07 0 0 1 10 1.666c1.167 0 2.257.219 3.27.657a8.418 8.418 0 0 1 2.646 1.781 8.418 8.418 0 0 1 1.771 2.646c.43 1.014.646 2.097.646 3.25 0 1.153-.215 2.236-.646 3.25a8.418 8.418 0 0 1-1.771 2.646 8.418 8.418 0 0 1-2.646 1.781c-1.013.438-2.103.656-3.27.656Zm0-1.666c1.861 0 3.437-.65 4.729-1.948C16.02 13.42 16.667 11.847 16.667 10c0-1.847-.646-3.42-1.938-4.72C13.437 3.983 11.861 3.334 10 3.334c-1.82 0-3.386.649-4.699 1.947C3.99 6.58 3.333 8.153 3.333 10c0 1.847.656 3.42 1.968 4.719C6.614 16.017 8.18 16.667 10 16.667Z" fill="currentColor"/></svg>',
    add: '<svg viewBox="0 0 20 20" fill="none"><path d="M9.166 15.833v-5h-5V9.166h5v-5h1.667v5h5v1.667h-5v5H9.166Z" fill="currentColor"/></svg>',
    panelClose: '<svg viewBox="0 0 20 20" fill="none"><path d="M9.167 14.167V5.833L5 10l4.167 4.167ZM10.833 17.5H12.5v-15h-1.667v15Z" fill="currentColor"/></svg>',
    sliders: '<svg viewBox="0 0 24 24" fill="none"><path d="M11 21v-6h2v2h8v2h-8v2h-2Zm-8-2v-2h6v2H3Zm4-4v-2H3v-2h4V9h2v6H7Zm4-2v-2h10v2H11Zm4-4V3h2v2h4v2h-4v2h-2ZM3 7V5h10v2H3Z" fill="currentColor"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none"><path d="M6.5 20c-1.517 0-2.813-.525-3.888-1.575C1.538 17.375 1 16.092 1 14.575c0-1.3.392-2.458 1.175-3.475.783-1.017 1.808-1.667 3.075-1.95.417-1.533 1.25-2.775 2.5-3.725C9 4.475 10.417 4 12 4c1.95 0 3.604.679 4.963 2.038C18.32 7.396 19 9.05 19 11c1.15.133 2.104.629 2.863 1.488.758.858 1.137 1.862 1.137 3.012 0 1.25-.437 2.313-1.313 3.188C20.813 19.563 19.75 20 18.5 20H13c-.55 0-1.021-.196-1.413-.587A1.926 1.926 0 0 1 11 18v-5.15L9.4 14.4 8 13l4-4 4 4-1.4 1.4-1.6-1.55V18h5.5c.7 0 1.292-.242 1.775-.725.483-.483.725-1.075.725-1.775s-.242-1.292-.725-1.775C19.792 13.242 19.2 13 18.5 13H17v-2c0-1.383-.488-2.563-1.463-3.538C14.563 6.488 13.383 6 12 6s-2.563.488-3.538 1.463C7.488 8.437 7 9.617 7 11h-.5c-.967 0-1.792.342-2.475 1.025A3.372 3.372 0 0 0 3 14.5c0 .967.342 1.792 1.025 2.475A3.372 3.372 0 0 0 6.5 18H9v2H6.5Z" fill="currentColor"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 15.575a.988.988 0 0 1-.7-.275l-3.6-3.6a.948.948 0 0 1-.288-.7c.009-.267.105-.5.288-.7.2-.2.438-.304.713-.313a.93.93 0 0 1 .712.288L11 12.15V5c0-.283.096-.521.288-.713A.968.968 0 0 1 12 4c.283 0 .521.096.713.287.191.192.287.43.287.713v7.15l1.875-1.875a.93.93 0 0 1 .713-.288c.274.009.512.113.712.313.183.2.28.433.288.7a.948.948 0 0 1-.288.7l-3.6 3.6a.988.988 0 0 1-.7.275ZM6 20c-.55 0-1.021-.196-1.413-.587A1.926 1.926 0 0 1 4 18v-2c0-.283.096-.521.287-.713A.968.968 0 0 1 5 15c.283 0 .521.096.713.287.191.192.287.43.287.713v2h12v-2c0-.283.096-.521.288-.713A.968.968 0 0 1 19 15c.283 0 .521.096.712.287.192.192.288.43.288.713v2c0 .55-.196 1.021-.587 1.413A1.926 1.926 0 0 1 18 20H6Z" fill="currentColor"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none"><path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19Z" fill="currentColor"/></svg>',
  };
  const pintarIconos = (raiz) => raiz.querySelectorAll('[data-ico]').forEach((e) => { if (!e.firstChild) e.innerHTML = ICO[e.dataset.ico] || ''; });

  // ---------- datos de muestra (precios y nombres reales para cada foto) ----------
  const COMERCIAL = [
    { id: 'c7', nombre: 'Apple iPhone 16 (512GB) Negro', img: 'iphone-16-negro.png', cat: 'Celulares', precio: 17969, desc: 18, estado: 'Activo', cond: 'Excelente', similares: 3, orden: 12 },
    { id: 'c1', nombre: 'Apple iPhone 15 Pro Max (128GB) Titanio natural', img: 'iphone-15-pro.png', cat: 'Celulares', precio: 12999, desc: 3, estado: 'Activo', cond: 'Excelente', similares: 6, orden: 6 },
    { id: 'c2', nombre: 'Bocina Harman Kardon Aura Studio 4', img: 'bocina.png', cat: 'Electrónicos', precio: 4249, desc: 15, estado: 'Pausado', cond: 'Bueno', similares: 6, orden: 5 },
    { id: 'c3', nombre: 'Consola Xbox Series X 1TB', img: 'xbox.png', cat: 'Electrónicos', precio: 9239, desc: 23, estado: 'Vendido', cond: 'Excelente', similares: 6, orden: 4 },
    { id: 'c8', nombre: 'Samsung Galaxy Z Fold5 (512GB) Negro', img: 'galaxy-z-fold5.png', cat: 'Celulares', precio: 21499, desc: 12, estado: 'Activo', cond: 'Bueno', similares: 2, orden: 11 },
    { id: 'c4', nombre: 'Anillo de oro 14K · 4.2 g', img: 'anillo.png', cat: 'Metales preciosos', precio: 5819, desc: 3, estado: 'Activo', cond: 'Bueno', similares: 6, orden: 3 },
    { id: 'c9', nombre: 'Apple iPhone 16 (128GB) Rosa', img: 'iphone-16-rosa.png', cat: 'Celulares', precio: 13999, desc: 8, estado: 'Pausado', cond: 'Excelente', similares: 4, orden: 10 },
    { id: 'c10', nombre: 'Tablet Honor Pad X9 (128GB) Gris', img: 'tablet-honor.png', cat: 'Electrónicos', precio: 3899, desc: 20, estado: 'Activo', cond: 'Bueno', similares: 1, orden: 9 },
    { id: 'c5', nombre: 'Bocina inteligente Amazon Echo Pop', img: 'echo-pop.png', cat: 'Hogar', precio: 499, desc: 50, estado: 'Activo', cond: 'Regular', similares: 6, orden: 2 },
    { id: 'c11', nombre: 'Teclado mecánico ASUS ROG Strix Scope II', img: 'teclado-rog.png', cat: 'Electrónicos', precio: 1999, desc: 0, estado: 'Activo', cond: 'Regular', similares: 0, orden: 8 },
    { id: 'c6', nombre: 'Apple iPhone 15 Pro (256GB) Titanio natural', img: 'iphone-15-pro.png', cat: 'Celulares', precio: 10849, desc: 30, estado: 'Activo', cond: 'Bueno', similares: 6, orden: 1 },
    { id: 'c12', nombre: 'Anillo de oro 10K · 2.8 g', img: 'anillo.png', cat: 'Metales preciosos', precio: 3199, desc: 5, estado: 'Vendido', cond: 'Bueno', similares: 0, orden: 7 },
  ];
  // prendario: monto del préstamo, días para vencer (0 = vence hoy) y contrato / cliente ficticios
  const PRENDARIO = [
    { id: 'p6', nombre: 'Teclado mecánico ASUS ROG Strix Scope II', img: 'teclado-rog.png', cat: 'Electrónicos', precio: 1200, estado: 'Vigente', vence: 0, cond: 'Regular', orden: 9, contrato: '100C36054', cliente: 'Luis Hernández Soto', nuc: '3307215' },
    { id: 'p7', nombre: 'Tablet Honor Pad X9 (128GB) Gris', img: 'tablet-honor.png', cat: 'Electrónicos', precio: 2600, estado: 'Vigente', vence: 1, cond: 'Bueno', orden: 8, contrato: '100C36110', cliente: 'Carla Méndez Ruiz', nuc: '5190644' },
    { id: 'p1', nombre: 'Apple iPhone 15 Pro Max (128GB) Titanio natural', img: 'iphone-15-pro.png', cat: 'Celulares', precio: 12999, estado: 'Vigente', vence: 12, cond: 'Excelente', orden: 4, contrato: '100C35643', cliente: 'Ana Torres Rivas', nuc: '4821937' },
    { id: 'p5', nombre: 'Samsung Galaxy Z Fold5 (512GB) Negro', img: 'galaxy-z-fold5.png', cat: 'Celulares', precio: 15500, estado: 'Vigente', vence: 5, cond: 'Bueno', orden: 10, contrato: '100C36021', cliente: 'Jorge Ruiz Salas', nuc: '6012388' },
    { id: 'p2', nombre: 'Bocina Harman Kardon Aura Studio 4', img: 'bocina.png', cat: 'Electrónicos', precio: 3400, estado: 'Vigente', vence: 12, cond: 'Bueno', orden: 3, contrato: '100C35712', cliente: 'Luis Hernández Soto', nuc: '3307215' },
    { id: 'p8', nombre: 'Apple iPhone 16 (128GB) Rosa', img: 'iphone-16-rosa.png', cat: 'Celulares', precio: 9500, estado: 'Reactivación', cond: 'Excelente', orden: 7, contrato: '100C35277', cliente: 'Sofía Navarro Gil', nuc: '7720451' },
    { id: 'p3', nombre: 'Apple iPhone 15 Pro (256GB) Titanio natural', img: 'iphone-15-pro.png', cat: 'Celulares', precio: 9800, estado: 'Reactivación', cond: 'Bueno', orden: 2, contrato: '100C34980', cliente: 'Ana Torres Rivas', nuc: '4821937' },
    { id: 'p4', nombre: 'Anillo de oro 14K · 4.2 g', img: 'anillo.png', cat: 'Metales preciosos', precio: 4600, estado: 'Vigente', vence: 3, cond: 'Bueno', orden: 1, contrato: '100C35890', cliente: 'Carla Méndez Ruiz', nuc: '5190644' },
    { id: 'p9', nombre: 'Bocina inteligente Amazon Echo Pop', img: 'echo-pop.png', cat: 'Hogar', precio: 350, estado: 'Vigente', vence: 21, cond: 'Bueno', orden: 6, contrato: '100C36188', cliente: 'Jorge Ruiz Salas', nuc: '6012388' },
    { id: 'p10', nombre: 'Consola Xbox Series X 1TB', img: 'xbox.png', cat: 'Electrónicos', precio: 6800, estado: 'Vigente', vence: 30, cond: 'Excelente', orden: 5, contrato: '100C36230', cliente: 'Ana Torres Rivas', nuc: '4821937' },
  ];
  const CATS = ['Electrónicos', 'Celulares', 'Hogar', 'Herramientas', 'Metales preciosos'];
  const RANGOS = [['Hasta $500', 0, 500], ['De $501 a $1,000', 501, 1000], ['Más de $1,000', 1001, Infinity]];
  const CONDS = ['Excelente', 'Bueno', 'Regular'];
  const POR = ['Artículo', 'Contrato', 'Cliente'];   // opciones del SearchFieldV2 del DS

  const q = new URLSearchParams(location.search);
  const st = {
    tipo: q.get('tipo') === 'prendario' ? 'prendario' : 'comercial',
    vacio: q.get('vacio') === '1',
    texto: '', por: 'Artículo', cats: new Set(), rangos: new Set(), conds: new Set(), catQ: '',
    orden: '', multi: false, sel: new Set(), lista: false, abiertos: new Set(['tipo', 'cat', 'precio', 'cond']),
  };
  const items = () => (st.vacio ? [] : st.tipo === 'comercial' ? COMERCIAL : PRENDARIO);
  const mx = (n) => '$' + Math.round(n).toLocaleString('en-US');
  const anterior = (it) => (it.desc ? Math.round(it.precio / (1 - it.desc / 100)) : null);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  // en qué campo busca el buscador según "Artículo / Contrato / Cliente"
  const campoDe = (it) => (st.por === 'Contrato' ? it.contrato || '' : st.por === 'Cliente' ? it.cliente || '' : it.nombre);
  function filtrar() {
    const t = slug(st.texto.trim());
    let r = items().filter((it) => {
      if (t) {
        if (!slug(campoDe(it)).includes(t)) return false;
      }
      if (st.cats.size && !st.cats.has(it.cat)) return false;
      if (st.rangos.size && ![...st.rangos].some((i) => it.precio >= RANGOS[i][1] && it.precio <= RANGOS[i][2])) return false;
      if (st.conds.size && !st.conds.has(it.cond)) return false;
      return true;
    });
    const o = { recientes: (a, b) => b.orden - a.orden, 'precio-asc': (a, b) => a.precio - b.precio, 'precio-desc': (a, b) => b.precio - a.precio, nombre: (a, b) => a.nombre.localeCompare(b.nombre, 'es') }[st.orden];
    if (o) r = r.slice().sort(o);
    return r;
  }

  // ---------- panel de filtros ----------
  function grupo(key, titulo, cuerpo) {
    // Tipo (Comercial | Prendario) siempre visible: sin flecha para plegarlo
    if (key === 'tipo') return `<div class="inv-fgroup"><p class="inv-fgroup__head inv-fgroup__head--fijo">${titulo}</p><div class="inv-fgroup__body">${cuerpo}</div></div>`;
    const abierto = st.abiertos.has(key);
    return `<div class="inv-fgroup">
      <button class="inv-fgroup__head" type="button" data-grupo="${key}" aria-expanded="${abierto}" aria-controls="invG-${key}">${titulo}<span class="inv-ico inv-ico--24" data-ico="up"></span></button>
      <div class="inv-fgroup__body" id="invG-${key}" ${abierto ? '' : 'hidden'}>${cuerpo}</div>
    </div>`;
  }
  const opcion = (name, val, label, n, on) => `<label class="inv-opt${n ? '' : ' is-vacio'}"><input type="checkbox" name="${name}" value="${esc(val)}" ${on ? 'checked' : ''} /><span class="inv-opt__box"></span><span>${esc(label)} <span class="inv-opt__n">(${n})</span></span></label>`;
  function pintarFiltros() {
    const base = items();
    const cats = CATS.filter((c) => slug(c).includes(slug(st.catQ)));
    $('invFiltersInner').innerHTML =
      grupo('tipo', 'Tipo', `<div class="inv-tipo" role="group" aria-label="Tipo de inventario">
          <button type="button" data-tipo="comercial" aria-pressed="${st.tipo === 'comercial'}">Comercial</button>
          <button type="button" data-tipo="prendario" aria-pressed="${st.tipo === 'prendario'}">Prendario</button></div>`) +
      grupo('cat', 'Categoria', `<div class="inv-fsearch"><input type="search" id="invCatQ" placeholder="Buscar aquí" aria-label="Buscar categoría" value="${esc(st.catQ)}" /><span class="inv-ico inv-ico--24" data-ico="search"></span></div>
          ${cats.map((c) => opcion('cat', c, c, base.filter((it) => it.cat === c).length, st.cats.has(c))).join('') || '<p class="inv-opt is-vacio">Sin coincidencias</p>'}
          <button class="inv-link inv-fmore" type="button" data-pronto="categorías">Mostrar 10<span class="inv-ico inv-ico--20" data-ico="down"></span></button>`) +
      grupo('precio', st.tipo === 'comercial' ? 'Precios de venta' : 'Monto del préstamo', RANGOS.map((r, i) => opcion('rango', i, r[0], base.filter((it) => it.precio >= r[1] && it.precio <= r[2]).length, st.rangos.has(i))).join('') +
          '<button class="inv-link inv-fmore" type="button" data-pronto="rangos">Mostrar más<span class="inv-ico inv-ico--20" data-ico="down"></span></button>') +
      grupo('cond', 'Estado de conservación', CONDS.map((c) => opcion('cond', c, c, base.filter((it) => it.cond === c).length, st.conds.has(c))).join('')) +
      `<div class="inv-fgroup"><button class="inv-link" type="button" data-pronto="todos los filtros">Ver todos los filtros<span class="inv-ico inv-ico--20" data-ico="down"></span></button></div>`;
    pintarIconos($('invFiltersInner'));
  }

  // ---------- tarjetas ----------
  // chip de estado del DS (CardInventario · "Colores del chip de estado")
  const COLOR_ESTADO = { Activo: 'green', Publicado: 'green', Pausado: 'yellow', 'Reactivación': 'yellow', Vendido: 'white', Vigente: 'blue', Vencido: 'red' };
  const vence = (d) => (d <= 0 ? 'Vence hoy' : `Vence: ${d} día${d === 1 ? '' : 's'}`);
  function tarjeta(it) {
    const com = st.tipo === 'comercial';
    const href = com ? '../v2/' : '../v2-prendario/';
    const sel = st.sel.has(it.id);
    const tags = [];
    if (st.multi) tags.push(`<span class="inv-card__check" aria-hidden="true"><span></span></span>`);
    else if (com && it.desc) tags.push(`<span class="inv-tag inv-tag--tl inv-tag--pink">-${it.desc}%</span>`);
    if (!com && it.vence !== undefined) tags.push(`<span class="inv-tag inv-tag--tr inv-tag--white">${vence(it.vence)}</span>`);
    tags.push(`<span class="inv-tag inv-tag--bl inv-tag--${COLOR_ESTADO[it.estado] || 'gray'}">${esc(it.estado)}</span>`);
    if (com && it.similares && !st.multi) tags.push(`<span class="inv-tag inv-tag--br inv-tag--white" title="${it.similares} artículos similares">+${it.similares}</span>`);
    const viejo = anterior(it);
    const media = st.multi
      ? `<button type="button" class="inv-card__media" data-sel="${it.id}" aria-pressed="${sel}" aria-label="Seleccionar ${esc(it.nombre)}">`
      : `<a class="inv-card__media" href="${href}" aria-label="${esc(it.nombre)}">`;
    return `<article class="inv-card${sel ? ' is-selected' : ''}${it.estado === 'Vendido' ? ' is-vendido' : ''}" data-id="${it.id}">
      ${media}<img src="${IMG}${it.img}" alt="" loading="lazy" />${tags.join('')}${st.multi ? '</button>' : '</a>'}
      <div class="inv-card__body">
        <a class="inv-card__title" href="${href}" title="${esc(it.nombre)}">${esc(it.nombre)}</a>
        <span class="inv-card__meta"><span class="inv-tag inv-tag--${COLOR_ESTADO[it.estado] || 'gray'}">${esc(it.estado)}</span>${!com && it.vence !== undefined ? `<span class="inv-tag inv-tag--white">${vence(it.vence)}</span>` : ''}</span>
        <div class="inv-card__row">
          <p class="inv-price"><b>${mx(it.precio)}</b>${viejo && !st.multi ? `<s>${mx(viejo)}</s>` : (viejo ? `<s>${mx(viejo)}</s>` : '')}</p>
          <button class="inv-more" type="button" data-menu="${it.id}" aria-haspopup="menu" aria-expanded="false" aria-label="Acciones de ${esc(it.nombre)}"><img src="../assets/ds/MoreVert.svg" alt="" /></button>
        </div>
      </div>
    </article>`;
  }

  function pintar() {
    const r = filtrar();
    const hay = st.cats.size + st.rangos.size + st.conds.size + (st.texto.trim() ? 1 : 0);
    $('invGrid').classList.toggle('is-lista', st.lista);
    $('invGrid').innerHTML = r.map(tarjeta).join('');
    $('invGrid').hidden = !r.length;
    $('invEmpty').hidden = !!r.length;
    $('invEmptyTxt').textContent = items().length ? 'No hay artículos con estos filtros' : 'No tienes inventario disponible';
    $('invEmptyBtn').textContent = items().length ? 'Limpiar filtros' : 'Comienza a empeñar';
    $('invActivos').hidden = !hay;
    const nf = st.cats.size + st.rangos.size + st.conds.size;
    [['invFiltersN', ''], ['invFopenN', '']].forEach(([id]) => { $(id).hidden = !nf; $(id).textContent = nf; });
    $('invMostrarFiltros').setAttribute('aria-label', nf ? `Mostrar filtros, ${nf} activo${nf === 1 ? '' : 's'}` : 'Mostrar filtros');
    const chips = [
      ...(st.texto.trim() ? [['texto', '', `${st.por}: ${st.texto.trim()}`]] : []),
      ...[...st.cats].map((c) => ['cat', c, c]),
      ...[...st.rangos].map((i) => ['rango', i, RANGOS[i][0]]),
      ...[...st.conds].map((c) => ['cond', c, c]),
    ];
    $('invChips').innerHTML = chips.map(([k, v, l]) => `<button class="inv-fchip" type="button" data-quitar="${k}" data-val="${esc(v)}" aria-label="Quitar filtro ${esc(l)}">${esc(l)}<span class="inv-ico inv-ico--20" data-ico="close"></span></button>`).join('');
    pintarIconos($('invChips'));
    const total = items().length;
    const que = st.tipo === 'comercial' ? 'a la venta' : 'en empeño';
    $('invCount').innerHTML = st.multi
      ? `<b>${st.sel.size}</b> seleccionado${st.sel.size === 1 ? '' : 's'} de ${r.length}`
      : (!total ? '' : r.length === total ? `<b>${total}</b> artículo${total === 1 ? '' : 's'} ${que}` : `<b>${r.length}</b> de ${total} artículos ${que}`);
  }

  const todo = () => { pintarFiltros(); pintar(); };
  const urlTipo = () => {
    const u = new URL(location.href);
    if (st.tipo === 'prendario') u.searchParams.set('tipo', 'prendario'); else u.searchParams.delete('tipo');
    history.replaceState(null, '', u);
  };

  // ---------- toasts (Toast del DS, igual que en la ficha) ----------
  const TOAST_ICO = '<svg aria-hidden="true" width="24" height="24" viewBox="96 156 24 24" fill="none"><path d="M108 178c-1.383 0-2.683-.263-3.9-.788a10.1 10.1 0 0 1-3.175-2.137 10.1 10.1 0 0 1-2.137-3.175A9.738 9.738 0 0 1 98 168c0-1.383.263-2.683.788-3.9a10.1 10.1 0 0 1 2.137-3.175 10.1 10.1 0 0 1 3.175-2.138A9.738 9.738 0 0 1 108 158c1.383 0 2.683.262 3.9.787a10.1 10.1 0 0 1 3.175 2.138 10.1 10.1 0 0 1 2.137 3.175c.525 1.217.788 2.517.788 3.9 0 1.383-.263 2.683-.788 3.9a10.1 10.1 0 0 1-2.137 3.175 10.1 10.1 0 0 1-3.175 2.137A9.738 9.738 0 0 1 108 178Zm-1.4-5.4 7.05-7.05-1.4-1.4-5.65 5.65-2.85-2.85-1.4 1.4 4.25 4.25Z" fill="currentColor"/></svg>';
  function toast(titulo, texto) {
    const t = document.createElement('div');
    t.className = 'ds-toast ds-toast--success';
    t.setAttribute('role', 'status');
    t.innerHTML = '<span class="ds-toast__icon" aria-hidden="true">' + TOAST_ICO + '</span><div class="ds-toast__body-wrap"><p class="ds-toast__title"></p><p class="ds-toast__body"></p></div>'
      + '<button type="button" class="ds-toast__close" aria-label="Cerrar"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19Z" fill="currentColor"/></svg></button><div class="ds-toast__timer" aria-hidden="true"></div>';
    t.querySelector('.ds-toast__title').textContent = titulo;
    t.querySelector('.ds-toast__body').textContent = texto;
    const region = $('posToasts');
    region.querySelectorAll('.ds-toast').forEach((x) => x.remove());
    region.appendChild(t);
    let reloj = setTimeout(() => t.remove(), 5000);
    t.addEventListener('mouseenter', () => { clearTimeout(reloj); t.classList.add('is-paused'); });
    t.addEventListener('mouseleave', () => { t.classList.remove('is-paused'); reloj = setTimeout(() => t.remove(), 2500); });
    t.querySelector('.ds-toast__close').addEventListener('click', () => t.remove());
  }
  let carrito = 0;
  const alCarrito = (titulo, texto) => {
    carrito += 1;
    const n = $('posCartN');
    if (n) n.textContent = carrito;
    const b = $('posCart');
    if (b) b.setAttribute('aria-label', `Carrito, ${carrito} artículo${carrito === 1 ? '' : 's'}`);
    toast(titulo, texto);
  };

  // ---------- menús: "Artículo" del buscador y ⋮ de cada tarjeta ----------
  const menuCard = $('invCardMenu');
  let botonMenu = null;
  function cerrarMenus(devolverFoco) {
    if (!menuCard.hidden) {
      menuCard.hidden = true;
      if (botonMenu) { botonMenu.setAttribute('aria-expanded', 'false'); if (devolverFoco) botonMenu.focus(); }
      botonMenu = null;
    }
  }
  function abrirMenuCard(btn) {
    const it = items().find((x) => x.id === btn.dataset.menu);
    if (!it) return;
    const com = st.tipo === 'comercial';
    const acciones = com
      ? [['comprar', 'Comprar', it.estado === 'Vendido'], ['pausar', it.estado === 'Pausado' ? 'Reanudar artículo' : 'Pausar artículo', it.estado === 'Vendido'], ['ubicacion', 'Cambiar ubicación', false]]
      : [['refrendar', 'Refrendar', false], ['extender', 'Extender', false], ['desempenar', 'Desempeñar', false], ['ubicacion', 'Cambiar ubicación', false]];
    menuCard.innerHTML = acciones.map(([a, l, dis]) => `<button type="button" role="menuitem" data-accion="${a}" data-id="${it.id}" ${dis ? 'disabled' : ''}>${l}</button>`).join('');
    menuCard.hidden = false;
    const r = btn.getBoundingClientRect();
    const w = menuCard.offsetWidth, h = menuCard.offsetHeight;
    let left = r.right - w, top = r.bottom + 4;
    if (left < 8) left = 8;
    if (top + h > innerHeight - 48) top = r.top - h - 4;
    menuCard.style.left = left + 'px';
    menuCard.style.top = top + 'px';
    btn.setAttribute('aria-expanded', 'true');
    botonMenu = btn;
    const primero = menuCard.querySelector('button:not(:disabled)');
    if (primero) primero.focus();
  }
  function accion(a, id) {
    const it = items().find((x) => x.id === id);
    if (!it) return;
    const n = it.nombre;
    if (a === 'comprar') alCarrito('Agregado al carrito', `${n} · ${mx(it.precio)}`);
    if (a === 'refrendar') alCarrito('Refrendo agregado al carrito', n);
    if (a === 'extender') alCarrito('Extensión agregada al carrito', n);
    if (a === 'desempenar') alCarrito('Desempeño agregado al carrito', n);
    if (a === 'pausar') {
      it.estado = it.estado === 'Pausado' ? 'Activo' : 'Pausado';
      toast(it.estado === 'Pausado' ? 'Artículo pausado' : 'Artículo reanudado', it.estado === 'Pausado' ? `${n} ya no se muestra en línea ni en sucursal.` : `${n} vuelve a mostrarse.`);
      pintar();
    }
    if (a === 'ubicacion') toast('Cambiar ubicación', `Aquí se elige la nueva bodega y ubicación de ${n}.`);
  }

  // ---------- eventos ----------
  document.addEventListener('click', (e) => {
    const t = e.target;
    const menuBtn = t.closest('[data-menu]');
    if (menuBtn) { e.preventDefault(); const abierto = botonMenu === menuBtn; cerrarMenus(); if (!abierto) abrirMenuCard(menuBtn); return; }
    const acc = t.closest('[data-accion]');
    if (acc) { cerrarMenus(true); accion(acc.dataset.accion, acc.dataset.id); return; }
    if (!t.closest('.inv-menu')) cerrarMenus();
    if (!t.closest('#invSearch')) cerrarBuscador();

    const tipo = t.closest('[data-tipo]');
    if (tipo && tipo.dataset.tipo !== st.tipo) { st.tipo = tipo.dataset.tipo; st.cats.clear(); st.rangos.clear(); st.conds.clear(); st.sel.clear(); urlTipo(); todo(); return; }
    const g = t.closest('[data-grupo]');
    if (g) { const k = g.dataset.grupo; st.abiertos.has(k) ? st.abiertos.delete(k) : st.abiertos.add(k); g.setAttribute('aria-expanded', st.abiertos.has(k)); $('invG-' + k).hidden = !st.abiertos.has(k); return; }
    const pronto = t.closest('[data-pronto]');
    if (pronto) { toast('Más filtros', `En el prototipo solo hay datos de muestra; aquí se despliegan más ${pronto.dataset.pronto}.`); return; }
    const sel = t.closest('[data-sel]');
    if (sel) { const id = sel.dataset.sel; st.sel.has(id) ? st.sel.delete(id) : st.sel.add(id); pintar(); const b = document.querySelector(`[data-sel="${id}"]`); if (b) b.focus(); return; }
    const q2 = t.closest('[data-quitar]');
    if (q2) {
      const { quitar: k, val } = q2.dataset;
      if (k === 'texto') { st.texto = ''; $('invQ').value = ''; botonBuscar(); }
      if (k === 'cat') st.cats.delete(val);
      if (k === 'rango') st.rangos.delete(Number(val));
      if (k === 'cond') st.conds.delete(val);
      todo();
      return;
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarMenus(true);
    const m = [menuCard].find((x) => !x.hidden && x.contains(document.activeElement));
    if (m && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      const it = [...m.querySelectorAll('button:not(:disabled)')];
      const i = it.indexOf(document.activeElement);
      it[(i + (e.key === 'ArrowDown' ? 1 : -1) + it.length) % it.length].focus();
    }
  });
  window.addEventListener('scroll', () => cerrarMenus(), { passive: true });
  window.addEventListener('resize', () => cerrarMenus());

  $('invFiltersInner').addEventListener('change', (e) => {
    const i = e.target;
    if (i.type !== 'checkbox') return;
    const set = { cat: st.cats, rango: st.rangos, cond: st.conds }[i.name];
    const v = i.name === 'rango' ? Number(i.value) : i.value;
    i.checked ? set.add(v) : set.delete(v);
    pintar();
  });
  $('invFiltersInner').addEventListener('input', (e) => {
    if (e.target.id !== 'invCatQ') return;
    st.catQ = e.target.value;
    const pos = e.target.selectionStart;
    pintarFiltros();
    const n = $('invCatQ'); n.focus(); n.setSelectionRange(pos, pos);
  });
  // ---------- buscador: Search field V2 del DS de Figma (selector Artículo/Contrato/Cliente + resultados) ----------
  const ETIQUETA = { 'Artículo': 'Artículos', Contrato: 'Contratos', Cliente: 'Clientes' };
  const sf = { activo: -1, opciones: [], recientes: [] };
  const inp = $('invQ'), lista = $('invSugs'), menuPor = $('invByMenu');
  const resaltar = (txt, q) => {
    const i = slug(txt).indexOf(slug(q));
    return !q || i < 0 ? esc(txt) : esc(txt.slice(0, i)) + '<strong>' + esc(txt.slice(i, i + q.length)) + '</strong>' + esc(txt.slice(i + q.length));
  };
  const descDe = (it) => (st.por === 'Contrato' ? `${it.nombre} · ${it.cliente}`
    : st.por === 'Cliente' ? `NUC ${it.nuc} · Contrato ${it.contrato}`
      : `${st.tipo === 'comercial' ? 'Comercial' : 'Prendario'} · ${it.estado} · ${mx(it.precio)}`);
  // con texto, la lupa del botón morado se vuelve tache: "Limpiar búsqueda" (estado lleno del DS)
  function botonBuscar() {
    const lleno = !!inp.value;
    $('invGo').setAttribute('aria-label', lleno ? 'Limpiar búsqueda' : 'Buscar');
    $('invGo').innerHTML = `<span class="inv-ico inv-ico--24">${lleno ? ICO.close : ICO.search}</span>`;
  }
  function cerrarBuscador() {
    lista.hidden = true; inp.setAttribute('aria-expanded', 'false'); inp.removeAttribute('aria-activedescendant'); sf.activo = -1;
    if (!menuPor.hidden) { menuPor.hidden = true; $('invByBtn').setAttribute('aria-expanded', 'false'); }
  }
  const pintarOpciones = () => sf.opciones.map((o, i) => `<button type="button" role="option" class="inv-sf__opt" id="invSug-${i}" data-sug="${i}" aria-selected="false" data-active="false" tabindex="-1"><span class="inv-sf__opt-title">${o.titulo}</span>${o.desc ? `<span class="inv-sf__opt-desc">${esc(o.desc)}</span>` : ''}</button>`).join('');
  function sugerir() {
    const q2 = inp.value.trim();
    if (!q2) {
      if (!sf.recientes.length) { lista.hidden = true; inp.setAttribute('aria-expanded', 'false'); return; }
      sf.opciones = sf.recientes.map((r) => ({ valor: r, titulo: esc(r) }));
      lista.innerHTML = '<span class="inv-sf__label">Búsquedas recientes</span>' + pintarOpciones();
    } else {
      const vistos = new Set();
      const res = items().filter((it) => campoDe(it) && slug(campoDe(it)).includes(slug(q2)))
        .filter((it) => (vistos.has(campoDe(it)) ? false : vistos.add(campoDe(it)))).slice(0, 6);
      sf.opciones = res.map((it) => ({ valor: campoDe(it), titulo: resaltar(campoDe(it), q2), desc: descDe(it) }));
      lista.innerHTML = res.length
        ? `<span class="inv-sf__label">${ETIQUETA[st.por]}</span>` + pintarOpciones()
        : `<div class="inv-sf__empty" role="status">No se encuentra ${ETIQUETA[st.por].toLowerCase().replace(/s$/, '')} con “${esc(q2)}”</div>`;
    }
    sf.activo = -1;
    inp.removeAttribute('aria-activedescendant');
    lista.hidden = false;
    inp.setAttribute('aria-expanded', 'true');
  }
  function mover(d) {
    if (lista.hidden || !sf.opciones.length) { sugerir(); if (!sf.opciones.length) return; }
    sf.activo = (sf.activo + d + sf.opciones.length) % sf.opciones.length;
    lista.querySelectorAll('.inv-sf__opt').forEach((b, i) => { const on = i === sf.activo; b.dataset.active = on; b.setAttribute('aria-selected', on); if (on) b.scrollIntoView({ block: 'nearest' }); });
    inp.setAttribute('aria-activedescendant', 'invSug-' + sf.activo);
  }
  const recordar = (v) => { if (!v) return; sf.recientes = [v, ...sf.recientes.filter((r) => r !== v)].slice(0, 5); };
  function elegir(i) {
    const v = sf.opciones[i] && sf.opciones[i].valor;
    if (!v) return;
    inp.value = v; st.texto = v; recordar(v); cerrarBuscador(); botonBuscar(); pintar();
  }
  inp.addEventListener('input', () => { st.texto = inp.value; botonBuscar(); pintar(); sugerir(); });
  inp.addEventListener('focus', () => sugerir());
  inp.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); mover(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); mover(-1); }
    else if (e.key === 'Enter') { e.preventDefault(); if (sf.activo >= 0 && !lista.hidden) elegir(sf.activo); else { recordar(inp.value.trim()); cerrarBuscador(); } }
    else if (e.key === 'Escape' && !lista.hidden) { e.stopPropagation(); cerrarBuscador(); }
  });
  // las opciones no roban el foco: el clic elige y el foco se queda en el campo
  lista.addEventListener('mousedown', (e) => e.preventDefault());
  lista.addEventListener('click', (e) => { const b = e.target.closest('[data-sug]'); if (b) elegir(Number(b.dataset.sug)); });
  $('invSearch').addEventListener('submit', (e) => {
    e.preventDefault();
    if (inp.value) { inp.value = ''; st.texto = ''; botonBuscar(); pintar(); }
    inp.focus();
    sugerir();   // con el campo vacío: búsquedas recientes, o se cierra si no hay
  });
  // selector "Artículo / Contrato / Cliente": abre su lista debajo, alineada a la izquierda
  $('invByBtn').addEventListener('click', () => {
    if (!menuPor.hidden) { menuPor.hidden = true; $('invByBtn').setAttribute('aria-expanded', 'false'); return; }
    lista.hidden = true; inp.setAttribute('aria-expanded', 'false');
    menuPor.innerHTML = POR.map((p2) => `<button type="button" role="option" aria-selected="${p2 === st.por}" data-por="${p2}">${p2}</button>`).join('');
    menuPor.hidden = false;
    $('invByBtn').setAttribute('aria-expanded', 'true');
    menuPor.querySelector('[aria-selected="true"]').focus();
  });
  menuPor.addEventListener('click', (e) => {
    const b = e.target.closest('[data-por]');
    if (!b) return;
    st.por = b.dataset.por;
    $('invByLbl').textContent = st.por;
    $('invByBtn').setAttribute('aria-label', 'Buscar por: ' + st.por);
    menuPor.hidden = true; $('invByBtn').setAttribute('aria-expanded', 'false');
    inp.focus();
    pintar();
  });
  menuPor.addEventListener('keydown', (e) => {
    const it = [...menuPor.querySelectorAll('button')];
    const i = it.indexOf(document.activeElement);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); it[(i + (e.key === 'ArrowDown' ? 1 : -1) + it.length) % it.length].focus(); }
    if (e.key === 'Escape') { e.stopPropagation(); menuPor.hidden = true; $('invByBtn').setAttribute('aria-expanded', 'false'); $('invByBtn').focus(); }
  });
  const sw = (id, fn) => $(id).addEventListener('click', () => { const on = $(id).getAttribute('aria-checked') !== 'true'; $(id).setAttribute('aria-checked', on); fn(on); });
  // ---------- exportar / importar ----------
  // Exportar: CSV (abre en Excel) con lo que se ve —filtros y orden aplicados—; con Multi selección, solo lo marcado
  const csvCelda = (v) => { const t = String(v ?? ''); return /[",\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t; };
  $('invExportar').addEventListener('click', () => {
    let filas = filtrar();
    if (st.multi && st.sel.size) filas = filas.filter((it) => st.sel.has(it.id));
    if (!filas.length) { toast('Nada que exportar', 'No hay artículos con los filtros actuales.'); return; }
    const com = st.tipo === 'comercial';
    const cab = com
      ? ['Código', 'Artículo', 'Categoría', 'Estado', 'Condición', 'Precio', 'Precio anterior', 'Descuento %', 'Similares']
      : ['Código', 'Artículo', 'Categoría', 'Estado', 'Condición', 'Monto del préstamo', 'Vence (días)', 'Contrato', 'Cliente'];
    const datos = filas.map((it) => (com
      ? [it.id.toUpperCase(), it.nombre, it.cat, it.estado, it.cond, it.precio, anterior(it) ?? '', it.desc ?? '', it.similares ?? '']
      : [it.id.toUpperCase(), it.nombre, it.cat, it.estado, it.cond, it.precio, it.vence ?? '', it.contrato ?? '', it.cliente ?? '']));
    const csv = '\ufeff' + [cab, ...datos].map((r) => r.map(csvCelda).join(',')).join('\r\n');
    const hoy = new Date().toISOString().slice(0, 10);
    const nombre = `inventario-${st.tipo}-${hoy}.csv`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = nombre;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast('Inventario exportado', `${nombre} · ${filas.length} artículo${filas.length === 1 ? '' : 's'}${st.multi && st.sel.size ? ' seleccionados' : ''}`);
  });
  // Importar: elige un CSV o Excel; en el prototipo solo se lee y se cuenta, no se guarda
  $('invImportar').addEventListener('click', () => $('invArchivo').click());
  $('invArchivo').addEventListener('change', async (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    let detalle = f.name;
    if (/\.csv$/i.test(f.name) || f.type === 'text/csv') {
      const filas = (await f.text()).split(/\r?\n/).filter((l) => l.trim()).length - 1;
      detalle += ` · ${Math.max(filas, 0)} artículo${filas === 1 ? '' : 's'}`;
    }
    toast('Archivo listo para importar', `${detalle}. Se revisa antes de agregarlo al inventario.`);
    e.target.value = '';
  });

  // panel de filtros: se oculta desde su encabezado y se vuelve a abrir con "Filtros" junto a "Filtrar por:"
  const CLAVE = 'ataskate-inv-filtros';
  const verFiltros = (on, enfocar) => {
    $('invBody').classList.toggle('is-sin-filtros', !on);
    $('invMostrarFiltros').hidden = on;
    $('invMostrarFiltros').setAttribute('aria-expanded', on);
    $('invOcultarFiltros').setAttribute('aria-expanded', on);
    try { localStorage.setItem(CLAVE, on ? '1' : '0'); } catch (e) { /* sin almacenamiento: solo dura la visita */ }
    if (enfocar) (on ? $('invOcultarFiltros') : $('invMostrarFiltros')).focus();
  };
  $('invOcultarFiltros').addEventListener('click', () => verFiltros(false, true));
  $('invMostrarFiltros').addEventListener('click', () => verFiltros(true, true));
  sw('invMulti', (on) => { st.multi = on; if (!on) st.sel.clear(); pintar(); });
  const vista = (lista) => { st.lista = lista; $('invVistaGrid').setAttribute('aria-pressed', !lista); $('invVistaLista').setAttribute('aria-pressed', lista); pintar(); };
  $('invVistaGrid').addEventListener('click', () => vista(false));
  $('invVistaLista').addEventListener('click', () => vista(true));
  // ordenar por: botón de texto + lista (como Klarna)
  const ORDENES = [['', 'Relevancia'], ['recientes', 'Más recientes'], ['precio-asc', 'Precio: menor a mayor'], ['precio-desc', 'Precio: mayor a menor'], ['nombre', 'Nombre (A–Z)']];
  const menuOrden = $('invSortMenu'), btnOrden = $('invSortBtn');
  const cerrarOrden = (foco) => { if (menuOrden.hidden) return; menuOrden.hidden = true; btnOrden.setAttribute('aria-expanded', 'false'); if (foco) btnOrden.focus(); };
  btnOrden.addEventListener('click', () => {
    if (!menuOrden.hidden) { cerrarOrden(); return; }
    menuOrden.innerHTML = ORDENES.map(([v, l]) => `<button type="button" role="option" data-orden="${v}" aria-selected="${v === st.orden}">${l}</button>`).join('');
    menuOrden.hidden = false;
    btnOrden.setAttribute('aria-expanded', 'true');
    menuOrden.querySelector('[aria-selected="true"]').focus();
  });
  menuOrden.addEventListener('click', (e) => {
    const b = e.target.closest('[data-orden]');
    if (!b) return;
    st.orden = b.dataset.orden;
    $('invSortLbl').textContent = st.orden ? 'Ordenar por: ' + ORDENES.find(([v]) => v === st.orden)[1] : 'Ordenar por';
    cerrarOrden(true);
    pintar();
  });
  menuOrden.addEventListener('keydown', (e) => {
    const it = [...menuOrden.querySelectorAll('button')];
    const i = it.indexOf(document.activeElement);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); it[(i + (e.key === 'ArrowDown' ? 1 : -1) + it.length) % it.length].focus(); }
    if (e.key === 'Escape') { e.stopPropagation(); cerrarOrden(true); }
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('#invSort')) cerrarOrden(); });
  const limpiar = () => { st.texto = ''; $('invQ').value = ''; botonBuscar(); st.cats.clear(); st.rangos.clear(); st.conds.clear(); st.catQ = ''; todo(); };
  $('invLimpiar').addEventListener('click', limpiar);
  $('invEmptyBtn').addEventListener('click', () => { if (items().length) limpiar(); else toast('Comienza a empeñar', 'Desde aquí se abre el Cotizador para registrar el primer empeño.'); });
  document.querySelector('.inv-sessions__add').addEventListener('click', () => toast('Nueva sesión', 'Abre otra pestaña de trabajo con su propio carrito (hasta 5).'));

  // estado inicial: lo último que eligió esta persona; si no hay, abierto en escritorio y cerrado en teléfono
  let guardado = null;
  try { guardado = localStorage.getItem(CLAVE); } catch (e) { guardado = null; }
  verFiltros(guardado === null ? !matchMedia('(max-width: 760px)').matches : guardado === '1', false);

  // el header mide su alto para que los toasts y el panel de filtros queden debajo
  const cab = document.querySelector('.pos-header');
  if (cab && 'ResizeObserver' in window) new ResizeObserver(() => document.documentElement.style.setProperty('--pos-header-h', cab.offsetHeight + 'px')).observe(cab);

  pintarIconos(document);
  todo();
})();
