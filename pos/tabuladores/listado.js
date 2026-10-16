/* Tabuladores (HU-CP-375-F) — reconstrucción estática del inicio nuevo de Tabuladores (HU-CP-375-F, con el botón
   "Tabulador" de HU-CP-376-F; igual en develop y rama del equipo del repo del equipo,
   src/components/MetalTabulator/NewMetalTabulatorHome/**; la página
   src/app/Operational/MetalTabulator/page.tsx lo muestra con la bandera HU-CP-375-F, y es a donde lleva el breadcrumb del detalle).
   A la izquierda, TabulatorLocationPanel (SearchFieldV2 + Tree del DS); a la derecha, TabulatorTablePanel (TabsButton Activo | Archivado
   + Table del DS) con los tabuladores de la ubicación elegida. Los servicios se simulan con los datos de datos.js (mismas formas).
   Escenarios de la maqueta: ?escenario=vacio (la empresa no tiene tabuladores) y ?escenario=carga-lenta (2.5–3 s por petición). */
(() => {
  'use strict';

  const D = window.TB_DATOS;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* íconos del DS (src/design-system/Icons) y blueOptionsIcon.svg (⋮ de las filas) */
  const ICO = {
    Add: ['0 0 24 24', '<path d="M11 19V13H5V11H11V5H13V11H19V13H13V19H11Z" fill="currentColor"/>'],
    Close: ['0 0 24 24', '<path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z" fill="currentColor"/>'],
    Search: ['0 0 24 24', '<path d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.146 15.371 4.888 14.113C3.62933 12.8543 3 11.3167 3 9.5C3 7.68333 3.62933 6.14567 4.888 4.887C6.146 3.629 7.68333 3 9.5 3C11.3167 3 12.8543 3.629 14.113 4.887C15.371 6.14567 16 7.68333 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8127 13.5627 12.688 12.688C13.5627 11.8127 14 10.75 14 9.5C14 8.25 13.5627 7.18733 12.688 6.312C11.8127 5.43733 10.75 5 9.5 5C8.25 5 7.18733 5.43733 6.312 6.312C5.43733 7.18733 5 8.25 5 9.5C5 10.75 5.43733 11.8127 6.312 12.688C7.18733 13.5627 8.25 14 9.5 14Z" fill="currentColor"/>'],
    SkipPrevious: ['0 0 20 20', '<path d="M9.16667 14.1667V5.83333L5 10L9.16667 14.1667ZM10.8333 17.5H12.5V2.5H10.8333V17.5Z" fill="currentColor"/>'],
    ChevronDown: ['0 0 24 24', '<path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'],
    WarningFilled: ['0 0 24 24', '<path d="M1 21L12 2L23 21H1ZM12 18C12.2833 18 12.5208 17.9042 12.7125 17.7125C12.9042 17.5208 13 17.2833 13 17C13 16.7167 12.9042 16.4792 12.7125 16.2875C12.5208 16.0958 12.2833 16 12 16C11.7167 16 11.4792 16.0958 11.2875 16.2875C11.0958 16.4792 11 16.7167 11 17C11 17.2833 11.0958 17.5208 11.2875 17.7125C11.4792 17.9042 11.7167 18 12 18ZM11 15H13V10H11V15Z" fill="currentColor"/>'],
    EstadosInfo: ['144 156 24 24', '<path d="M154.774 172.838H156.774V166.838H154.774V172.838ZM155.774 164.838C156.058 164.838 156.295 164.742 156.487 164.55C156.679 164.359 156.774 164.121 156.774 163.838C156.774 163.555 156.679 163.317 156.487 163.125C156.295 162.934 156.058 162.838 155.774 162.838C155.491 162.838 155.254 162.934 155.062 163.125C154.87 163.317 154.774 163.555 154.774 163.838C154.774 164.121 154.87 164.359 155.062 164.55C155.254 164.742 155.491 164.838 155.774 164.838ZM155.774 177.838C154.391 177.838 153.091 177.575 151.874 177.05C150.658 176.525 149.599 175.813 148.699 174.913C147.799 174.013 147.087 172.955 146.562 171.738C146.037 170.521 145.774 169.221 145.774 167.838C145.774 166.455 146.037 165.155 146.562 163.938C147.087 162.721 147.799 161.663 148.699 160.763C149.599 159.863 150.658 159.15 151.874 158.625C153.091 158.1 154.391 157.838 155.774 157.838C157.158 157.838 158.458 158.1 159.674 158.625C160.891 159.15 161.949 159.863 162.849 160.763C163.749 161.663 164.462 162.721 164.987 163.938C165.512 165.155 165.774 166.455 165.774 167.838C165.774 169.221 165.512 170.521 164.987 171.738C164.462 172.955 163.749 174.013 162.849 174.913C161.949 175.813 160.891 176.525 159.674 177.05C158.458 177.575 157.158 177.838 155.774 177.838Z" fill="currentColor"/>'],
    Options: ['0 0 24 25', '<path d="M12 20.5C11.45 20.5 10.9793 20.3043 10.588 19.913C10.196 19.521 10 19.05 10 18.5C10 17.95 10.196 17.479 10.588 17.087C10.9793 16.6957 11.45 16.5 12 16.5C12.55 16.5 13.021 16.6957 13.413 17.087C13.8043 17.479 14 17.95 14 18.5C14 19.05 13.8043 19.521 13.413 19.913C13.021 20.3043 12.55 20.5 12 20.5ZM12 14.5C11.45 14.5 10.9793 14.304 10.588 13.912C10.196 13.5207 10 13.05 10 12.5C10 11.95 10.196 11.479 10.588 11.087C10.9793 10.6957 11.45 10.5 12 10.5C12.55 10.5 13.021 10.6957 13.413 11.087C13.8043 11.479 14 11.95 14 12.5C14 13.05 13.8043 13.5207 13.413 13.912C13.021 14.304 12.55 14.5 12 14.5ZM12 8.5C11.45 8.5 10.9793 8.304 10.588 7.912C10.196 7.52067 10 7.05 10 6.5C10 5.95 10.196 5.47933 10.588 5.088C10.9793 4.696 11.45 4.5 12 4.5C12.55 4.5 13.021 4.696 13.413 5.088C13.8043 5.47933 14 5.95 14 6.5C14 7.05 13.8043 7.52067 13.413 7.912C13.021 8.304 12.55 8.5 12 8.5Z" style="fill:var(--ats-primary-300)"/>'],
  };
  const ico = (n, w = 24, h = w) => '<svg class="cd-ico" width="' + w + '" height="' + h + '" viewBox="' + ICO[n][0] + '" fill="none" aria-hidden="true" focusable="false">' + ICO[n][1] + '</svg>';

  /* ======================= constants.ts (NewMetalTabulatorHome) y los que importa ======================= */
  const TXT = {
    SEARCH_PLACEHOLDER: 'Busca',                    /* TABULATOR_LOCATION_PANEL */
    TABLE_TITLE: 'Tabulador',                       /* TABULATOR_TABLE_TITLE */
    EMPTY: 'No hay nada para mostrar',              /* TABULATOR_TABLE_EMPTY_STATE */
    CLOSE_PANEL: 'Cerrar panel',                    /* LOCATION_TREE_PANEL_CLOSE (BranchLocations) */
    OPEN_PANEL: 'Abrir panel',                      /* LOCATION_TREE_PANEL_OPEN */
    SEE_DETAILS: 'Ver detalles',                    /* MY_TABULATORS.METAL_OPTIONS */
    ARCHIVE: 'Archivar',
  };
  const MIN_SEARCH_LENGTH = 2;                      /* la búsqueda corre con más de 2 caracteres */
  const TABS_IDS = { ACTIVE: 1, ARCHIVED: 2 };
  const TAB_ITEMS = [{ id: String(TABS_IDS.ACTIVE), label: 'Activo' }, { id: String(TABS_IDS.ARCHIVED), label: 'Archivado' }];
  const HEADERS = ['Nombre', 'Fecha de creación', 'Metal', 'Precio base'];
  const ARCHIVE_MODAL = { ARCHIVE_TITLE: 'Archivar tabulador', ACTIVATE_TITLE: 'Desarchivar tabulador', CANCEL: 'Cancelar', ARCHIVE_BTN: 'Archivar', ACTIVATE_BTN: 'Desarchivar' };
  const getArchiveDescription = (name) => name + ' dejará de estar disponible para nuevas valuaciones. Puedes desarchivarlo cuando quieras.';
  const getActivateDescription = (name) => name + ' volverá a estar disponible en Activo.';
  const TREE_LEVEL_LABELS = { MY_COMPANY: 'Mi empresa', LEVEL_PREFIX: 'Nivel' };
  const COMPANY_IDS = { TYPE: 1, GROUP_FATHER: 0 };
  /* SearchFieldV2Dropdown: vacío por defecto */
  const SEARCH_EMPTY = { title: 'No encontramos resultados para tu búsqueda', description: 'Revisa la ortografía, intenta otra palabra' };

  /* ======================= utils.ts ======================= */
  const getNodeSublabel = (node, depth) => (node.type === COMPANY_IDS.TYPE && node.groupFatherId === COMPANY_IDS.GROUP_FATHER
    ? TREE_LEVEL_LABELS.MY_COMPANY : TREE_LEVEL_LABELS.LEVEL_PREFIX + ' ' + depth);
  const mapLocationsToTreeNodes = (locations, depth = 0) => locations.map((l) => ({
    id: String(l.locationId), label: l.name, sublabel: getNodeSublabel(l, depth),
    children: l.branches ? mapLocationsToTreeNodes(l.branches, depth + 1) : undefined,
  }));
  /* luxon 'LLLL yyyy' en español con mayúscula inicial: "Septiembre 2026" */
  const formatTabulatorCreatedDate = (iso) => {
    const d = new Date(iso + 'T12:00:00');
    if (isNaN(d)) return iso;
    const f = d.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' }).replace(' de ', ' ');
    return f.charAt(0).toUpperCase() + f.slice(1);
  };
  const numberToCurrency = (n) => new Intl.NumberFormat('ES-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 2 }).format(n);

  /* ======================= servicios simulados ======================= */
  const escenario = new URLSearchParams(location.search).get('escenario');
  /* sin latencia simulada: responden al momento. "carga-lenta" deja el estado de carga fijo (la promesa no se resuelve) */
  const lenta = escenario === 'carga-lenta';
  const servicio = (fn) => (lenta ? new Promise(() => {}) : Promise.resolve().then(fn));
  const getTabulatorLocationTree = () => servicio(() => D.ARBOL);
  /* GetTabulatorsByLocation: los del estatus pedido que aplican en la ubicación (o en algo debajo de ella). En la raíz (la empresa)
     salen todos; en Activo no cuentan las sucursales donde un tabulador más nuevo ya lo reemplazó; en Archivado cuentan todas */
  const getTabulatorsByLocation = ({ estatusTabulador, idLevel }) => servicio(() => {
    if (escenario === 'vacio') return [];
    const n = D.nodo(idLevel);
    const esRaiz = n && n.type === COMPANY_IDS.TYPE && n.groupFatherId === COMPANY_IDS.GROUP_FATHER;
    const sucs = new Set(D.sucursalesDe(idLevel));
    return (D.TABULADORES
      .filter((t) => D.estatus(t.tabulatorId) === estatusTabulador)
      .filter((t) => esRaiz || t.sucursales.some(([id, reemplazada]) => sucs.has(id) && (estatusTabulador === TABS_IDS.ARCHIVED || !reemplazada)))
      .map((t) => ({
        tabulatorId: t.tabulatorId, nameTabulator: t.nameTabulator, identifier: t.identifier, createdDate: t.createdDate,
        catMetalId: t.catMetalId, catMetalName: t.catMetalName, carats: t.carats, basePrice: t.basePrice,
        unitOfMeasureId: t.unitOfMeasureId, unitOfMeasure: t.unitOfMeasure,
      })));
  });
  /* GetSearchLocations: ubicaciones cuyo nombre contiene el texto (sin distinguir acentos); breadcrume = ruta de grupos */
  const sinAcentos = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const getSearchLocations = (txt) => servicio(() => {
    const q = sinAcentos(txt.trim());
    return (D.PLANO.filter((e) => sinAcentos(e.nodo.name).includes(q)).map((e) => ({
      locationId: e.nodo.locationId, typeLocation: e.nodo.type, breadcrume: D.ruta(e.nodo.locationId),
      fatherId: e.padre ? e.padre.locationId : 0, locationName: e.nodo.name,
    })));
  });

  /* ======================= estado (TabulatorPanelLayout + TabulatorLocationPanel) ======================= */
  const st = {
    tree: [], treeLoading: true,
    selected: undefined,                         /* ISelectedTabulatorLocation: { id, label, type } */
    activeTabId: String(TABS_IDS.ACTIVE),
    tabulators: [], loading: true,               /* ajuste: la tabla sale cargando desde el inicio (ver README) */
    collapsed: false,
    expanded: new Set(),                         /* Tree con defaultExpanded={false}: todo plegado */
    focusId: null,                               /* nodo que recibe el Tab (tabindex itinerante) */
    search: '', searchFocused: false, searchStatus: 'idle', searchOptions: [], activeIndex: 0,
    updateLoading: false,                        /* UpdateTabulatorStatusReducer.loading */
  };

  /* ======================= TabulatorLocationPanel ======================= */
  const loc = $('tbLoc');
  const skeletonLoc = () => '<div class="tb-loc__body" role="status" aria-label="Cargando ubicaciones">'
    + '<span class="ds-skeleton tb-sk" style="width:100%;height:40px;border-radius:100px;flex-shrink:0"></span>'
    + '<div class="tb-sk-col"><span class="ds-skeleton tb-sk" style="width:70%;height:16px;border-radius:4px"></span><span class="ds-skeleton tb-sk" style="width:50%;height:12px;border-radius:4px"></span></div></div>';
  const searchHTML = () => '<div class="cd-search" id="tbSearch">'
    + '<div class="cd-search__control"><input class="cd-search__input" id="tbQ" type="text" role="combobox" aria-autocomplete="list" aria-controls="tbQList" aria-expanded="false"'
    + ' autocomplete="off" placeholder="' + TXT.SEARCH_PLACEHOLDER + '" aria-label="' + TXT.SEARCH_PLACEHOLDER + '" value="' + esc(st.search) + '">'
    + '<button type="button" class="cd-search__btn" id="tbQBtn"></button></div>'
    + '<div class="cd-search__list" id="tbQList" hidden></div></div>';

  function renderLoc() {
    loc.classList.toggle('is-collapsed', st.collapsed);
    if (st.collapsed) {
      /* CollapsedSide: toda la franja abre el panel */
      loc.innerHTML = '<button type="button" class="tb-loc__open" data-open aria-expanded="false"><span class="tb-loc__open-in">' + ico('SkipPrevious', 20) + TXT.OPEN_PANEL + '</span></button>';
      return;
    }
    loc.innerHTML = '<button type="button" class="tb-loc__close" data-close aria-expanded="true">' + ico('SkipPrevious', 20) + TXT.CLOSE_PANEL + '</button>'
      + (st.treeLoading ? skeletonLoc() : '<div class="tb-loc__body">' + searchHTML() + '<div class="tb-loc__tree" id="tbTree">' + treeHTML() + '</div></div>');
    if (!st.treeLoading) { bindSearch(); paintSearch(); }
  }

  /* ---- Tree del DS (TreeItem): los hijos van después de su padre, con sangría 8 en la raíz y 18 + nivel × 20 abajo ---- */
  function visibles() {
    const out = [];
    const walk = (list, level) => list.forEach((n) => { out.push([n, level]); if (n.children && st.expanded.has(n.id)) walk(n.children, level + 1); });
    walk(mapLocationsToTreeNodes(st.tree), 0);
    return out;
  }
  function treeHTML() {
    const vis = visibles();
    const hay = (id) => id && vis.some(([n]) => n.id === id);
    const foco = hay(st.focusId) ? st.focusId : hay(st.selected && st.selected.id) ? st.selected.id : vis[0] && vis[0][0].id;
    return '<div class="cd-tree" role="tree" aria-label="Ubicaciones">' + vis.map(([n, level]) => {
      const kids = !!(n.children && n.children.length), open = st.expanded.has(n.id), sel = !!(st.selected && st.selected.id === n.id);
      return '<div class="cd-tree__item" role="treeitem" aria-level="' + (level + 1) + '" aria-selected="' + sel + '"' + (kids ? ' aria-expanded="' + open + '"' : '')
        + ' tabindex="' + (n.id === foco ? 0 : -1) + '" data-node="' + n.id + '" style="padding-left:' + (level === 0 ? 8 : 18 + level * 20) + 'px">'
        + (kids ? '<button type="button" class="cd-tree__chev" tabindex="-1" aria-hidden="true" aria-expanded="' + open + '" data-toggle="' + n.id + '">' + ico('ChevronDown', 20) + '</button>' : '<span class="cd-tree__spacer"></span>')
        + '<span class="cd-tree__text"><span class="cd-tree__label">' + esc(n.label) + '</span>' + (n.sublabel ? '<span class="cd-tree__sub">' + esc(n.sublabel) + '</span>' : '') + '</span></div>';
    }).join('') + '</div>';
  }
  function paintTree(focusId) {
    const t = $('tbTree'); if (!t) return;
    t.innerHTML = treeHTML();
    if (focusId) { const el = t.querySelector('[data-node="' + focusId + '"]'); if (el) el.focus(); }
  }
  /* selectLocationById: el nodo elegido pasa a la tabla; como en su código, cada selección vuelve a pedir los tabuladores */
  const findNode = (id) => D.nodo(id);
  function selectLocationById(id) {
    const node = findNode(id); if (!node) return;
    st.selected = { id: String(node.locationId), label: node.name, type: node.type };
    fetchTabulators();
  }

  loc.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) {
      /* al plegar se desmonta el Tree: al volver a abrir sale todo plegado; el texto del buscador se conserva (vive en el panel) */
      st.collapsed = true; st.expanded = new Set(); st.focusId = null; st.searchFocused = false;
      renderLoc(); loc.querySelector('[data-open]').focus(); return;
    }
    if (e.target.closest('[data-open]')) { st.collapsed = false; renderLoc(); loc.querySelector('[data-close]').focus(); return; }
    const tog = e.target.closest('[data-toggle]');
    if (tog) {
      const id = tog.dataset.toggle;
      if (st.expanded.has(id)) st.expanded.delete(id); else st.expanded.add(id);
      st.focusId = id; paintTree(id); return;
    }
    const item = e.target.closest('[data-node]');
    if (item) { st.focusId = item.dataset.node; selectLocationById(item.dataset.node); paintTree(item.dataset.node); }
  });
  /* Corrección de accesibilidad: el Tree del DS no trae teclado. ↑↓ recorren, → abre o entra, ← cierra o sube, Enter/Espacio eligen */
  loc.addEventListener('keydown', (e) => {
    const item = e.target.closest && e.target.closest('[data-node]'); if (!item) return;
    const vis = visibles(); const ids = vis.map(([n]) => n.id); const i = ids.indexOf(item.dataset.node); if (i < 0) return;
    const [n, level] = vis[i]; const kids = !!(n.children && n.children.length);
    const mover = (id) => { e.preventDefault(); st.focusId = id; paintTree(id); };
    if (e.key === 'ArrowDown' && i < ids.length - 1) mover(ids[i + 1]);
    else if (e.key === 'ArrowUp' && i > 0) mover(ids[i - 1]);
    else if (e.key === 'Home') mover(ids[0]);
    else if (e.key === 'End') mover(ids[ids.length - 1]);
    else if (e.key === 'ArrowRight' && kids) { if (!st.expanded.has(n.id)) st.expanded.add(n.id); else { mover(ids[i + 1]); return; } mover(n.id); }
    else if (e.key === 'ArrowLeft') {
      if (kids && st.expanded.has(n.id)) { st.expanded.delete(n.id); mover(n.id); return; }
      if (level > 0) { for (let j = i - 1; j >= 0; j--) if (vis[j][1] === level - 1) { mover(ids[j]); break; } }
    } else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); st.focusId = n.id; selectLocationById(n.id); paintTree(n.id); }
  });

  /* ---- SearchFieldV2 con autocompletado (debounce de 300 ms al escribir, como el componente; el servicio responde al momento) ---- */
  let reloj = null, busqueda = 0;
  const isSearchValid = () => st.search.trim().length > MIN_SEARCH_LENGTH;
  function buscar(txt) {
    const n = ++busqueda;
    st.searchStatus = 'loading'; paintSearch();
    getSearchLocations(txt).then((ops) => {
      if (n !== busqueda) return;
      st.searchOptions = ops; st.searchStatus = ops.length ? 'results' : 'empty'; st.activeIndex = 0; paintSearch();
    });
  }
  /* renderHighlightedLabel: la primera coincidencia en negritas (aquí sin distinguir acentos, como la búsqueda simulada:
     "leon" resalta "León"; quitar el acento de una letra no cambia la longitud, así que los índices coinciden) */
  const resaltar = (label, q) => {
    const t = sinAcentos(q.trim()); const i = t ? sinAcentos(label).indexOf(t) : -1;
    if (i < 0) return esc(label);
    return esc(label.slice(0, i)) + '<strong>' + esc(label.slice(i, i + t.length)) + '</strong>' + esc(label.slice(i + t.length));
  };
  function paintSearch() {
    const input = $('tbQ'), btn = $('tbQBtn'), list = $('tbQList'); if (!input) return;
    /* el botón: X para limpiar si hay texto y el campo no tiene el foco; si no, la lupa */
    const limpiar = !!st.search && !st.searchFocused;
    btn.innerHTML = ico(limpiar ? 'Close' : 'Search', 24);
    btn.setAttribute('aria-label', limpiar ? 'Limpiar búsqueda' : 'Buscar');
    btn.dataset.accion = limpiar ? 'limpiar' : 'buscar';
    const abierto = st.searchFocused && isSearchValid() && st.searchStatus !== 'idle';
    input.setAttribute('aria-expanded', String(abierto));
    list.hidden = !abierto;
    if (!abierto) { list.innerHTML = ''; input.removeAttribute('aria-activedescendant'); return; }
    list.setAttribute('role', st.searchStatus === 'results' ? 'listbox' : 'presentation');
    if (st.searchStatus === 'loading') list.innerHTML = '<div class="cd-search__loading" role="status" aria-label="Cargando resultados"><span></span><span></span><span></span></div>';
    else if (st.searchStatus === 'empty') list.innerHTML = '<div class="cd-search__feedback" role="status">' + ico('WarningFilled', 24) + '<span><strong>' + SEARCH_EMPTY.title + '</strong><span>' + SEARCH_EMPTY.description + '</span></span></div>';
    else list.innerHTML = st.searchOptions.map((o, i) => '<button type="button" class="cd-search__opt" role="option" id="tbQOpt' + i + '" tabindex="-1" aria-selected="' + (i === st.activeIndex) + '" data-active="' + (i === st.activeIndex) + '" data-opt="' + i + '">'
      + '<span class="cd-search__opt-label">' + resaltar(o.locationName, st.search) + '</span>' + (o.breadcrume ? '<span class="cd-search__opt-desc">' + esc(o.breadcrume) + '</span>' : '') + '</button>').join('');
    if (st.searchStatus === 'results') input.setAttribute('aria-activedescendant', 'tbQOpt' + st.activeIndex); else input.removeAttribute('aria-activedescendant');
  }
  /* handleSelectSearchResult: el campo se queda con el nombre, se elige el nodo y el campo pierde el foco.
     Como en su código, el árbol no se abre hasta el nodo elegido (ver README) */
  function elegirResultado(o) {
    st.search = o.locationName; st.searchFocused = false;
    const input = $('tbQ'); input.value = o.locationName; input.blur();
    selectLocationById(String(o.locationId)); paintTree(); paintSearch();
  }
  function bindSearch() {
    const box = $('tbSearch'), input = $('tbQ'), btn = $('tbQBtn'), list = $('tbQList');
    input.addEventListener('focus', () => { st.searchFocused = true; paintSearch(); });
    input.addEventListener('input', () => {
      st.search = input.value; clearTimeout(reloj);
      if (!isSearchValid()) { st.searchStatus = 'idle'; paintSearch(); return; }
      reloj = setTimeout(() => buscar(st.search), 300);
    });
    input.addEventListener('keydown', (e) => {
      const hay = st.searchStatus === 'results' && st.searchOptions.length > 0 && !list.hidden;
      if (e.key === 'Escape') { st.searchFocused = false; paintSearch(); return; }
      if (hay && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        e.preventDefault(); const n = st.searchOptions.length;
        st.activeIndex = (st.activeIndex + (e.key === 'ArrowDown' ? 1 : n - 1)) % n; paintSearch(); return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (hay) { elegirResultado(st.searchOptions[st.activeIndex]); return; }
        if (isSearchValid()) { clearTimeout(reloj); buscar(st.search); }   /* onSearch → handleSearch */
      }
    });
    /* onBlurCapture: si el foco sale del buscador, se cierra la lista */
    box.addEventListener('focusout', (e) => { if (!box.contains(e.relatedTarget)) { st.searchFocused = false; paintSearch(); } });
    btn.addEventListener('mousedown', (e) => e.preventDefault());
    btn.addEventListener('click', () => {
      if (btn.dataset.accion === 'limpiar') { st.search = ''; input.value = ''; st.searchStatus = 'idle'; paintSearch(); return; }
      if (isSearchValid()) { clearTimeout(reloj); buscar(st.search); }
    });
    list.addEventListener('mousedown', (e) => {
      const o = e.target.closest('[data-opt]'); if (!o) return;
      e.preventDefault(); elegirResultado(st.searchOptions[Number(o.dataset.opt)]);
    });
    list.addEventListener('mousemove', (e) => {
      const o = e.target.closest('[data-opt]'); if (!o || Number(o.dataset.opt) === st.activeIndex) return;
      st.activeIndex = Number(o.dataset.opt); paintSearch();
    });
  }

  /* ======================= TabulatorTablePanel ======================= */
  const tp = $('tbTp');
  let pedido = 0, enfocarPestana = false;   /* tras cambiar de pestaña o archivar, el foco vuelve a la pestaña activa */
  function fetchTabulators() {
    if (!st.selected) return;
    const n = ++pedido;
    st.loading = true; renderTable();
    getTabulatorsByLocation({ estatusTabulador: Number(st.activeTabId), typelocation: st.selected.type, idLevel: Number(st.selected.id) }).then((data) => {
      if (n !== pedido) return;   /* solo cuenta la última respuesta */
      st.tabulators = data; st.loading = false; renderTable();
    });
  }
  /* TabulatorTablePanelSkeleton: encabezado, fila de títulos y 4 filas */
  const skeletonTable = () => {
    const celdas = HEADERS.map(() => '<span class="ds-skeleton tb-sk"></span>').join('');
    return '<div role="status" aria-label="Cargando tabuladores">'
      + '<div class="tb-tp__head"><span class="ds-skeleton tb-sk" style="width:100px;height:20px;border-radius:4px"></span><span class="ds-skeleton tb-sk" style="width:160px;height:36px;border-radius:100px"></span></div>'
      + '<div class="tb-sk-row" style="height:40px">' + celdas + '</div>'
      + [0, 1, 2, 3].map(() => '<div class="tb-sk-row" style="height:48px">' + celdas + '</div>').join('') + '</div>';
  };
  const desc = (main, sub) => '<td class="cd-td cd-td--desc"><p class="cd-td__main">' + esc(main) + '</p>' + (sub ? '<p class="cd-td__sub">' + esc(sub) + '</p>' : '') + '</td>';
  /* TabulatorTableRow. Ajuste del prototipo: toda la fila abre el detalle (en su código solo "Ver detalles" del ⋮) */
  const rowHTML = (t) => '<tr class="cd-tr cd-tr--click" tabindex="0" data-id="' + t.tabulatorId + '">'
    + desc(t.nameTabulator, t.identifier || '')
    + '<td class="cd-td">' + esc(formatTabulatorCreatedDate(t.createdDate)) + '</td>'
    + desc(t.catMetalName, t.carats)
    + desc(numberToCurrency(t.basePrice), t.unitOfMeasure || '')
    + '<td class="cd-td cd-td--icon"><button type="button" class="tb-opts" aria-haspopup="menu" aria-expanded="false" aria-controls="tbMenu" aria-label="Opciones de ' + esc(t.nameTabulator) + '" data-opts="' + t.tabulatorId + '">' + ico('Options', 24, 25) + '</button></td></tr>';

  function renderTable() {
    cerrarMenu(false);
    if (st.loading) { tp.setAttribute('aria-busy', 'true'); tp.innerHTML = skeletonTable(); return; }
    tp.removeAttribute('aria-busy');
    const rows = st.tabulators;
    tp.innerHTML = '<div class="tb-tp__head"><h2 class="tb-tp__title" id="tbTpTitulo">' + TXT.TABLE_TITLE + '</h2>'
      + '<div class="cd-tabs" role="tablist" aria-label="Estado de los tabuladores" id="tbTabs">'
      + TAB_ITEMS.map((it) => '<button type="button" role="tab" class="cd-tab" aria-selected="' + (it.id === st.activeTabId) + '" tabindex="' + (it.id === st.activeTabId ? 0 : -1) + '" data-tab="' + it.id + '">' + it.label + '</button>').join('')
      + '</div></div>'
      + '<div class="tb-tp__body"><div class="cd-tframe" data-tframe><div class="cd-tscroll cd-tscroll--default"><table class="cd-table cd-table--tb">'
      + '<thead><tr>' + HEADERS.map((h) => '<th class="cd-th cd-th--160" scope="col"><div class="cd-th__in">' + h + '</div></th>').join('')
      + '<th class="cd-th cd-th--40" scope="col"><span class="tb-sr">Opciones</span></th></tr></thead>'
      + (rows.length ? '<tbody>' + rows.map(rowHTML).join('') + '</tbody>' : '')
      + '</table></div></div>'
      + (rows.length ? '' : '<div class="tb-empty" role="status"><img src="ilust-01-empty.svg" alt="" width="51" height="125" /><p>' + TXT.EMPTY + '</p></div>')
      + '</div>';
    bindShadows();
    if (enfocarPestana) { enfocarPestana = false; const b = tp.querySelector('[data-tab="' + st.activeTabId + '"]'); if (b) b.focus(); }
  }
  /* sombras de scroll horizontal (useHorizontalScrollShadows del DS) */
  let ro = null;
  function bindShadows() {
    const frame = tp.querySelector('[data-tframe]'); if (!frame) return;
    const sc = frame.querySelector('.cd-tscroll');
    const pintar = () => {
      frame.classList.toggle('is-start', sc.scrollLeft > 1);
      frame.classList.toggle('is-end', sc.scrollLeft + sc.clientWidth < sc.scrollWidth - 1);
    };
    sc.addEventListener('scroll', pintar, { passive: true });
    if (ro) ro.disconnect();
    if (typeof ResizeObserver !== 'undefined') { ro = new ResizeObserver(pintar); ro.observe(sc); ro.observe(sc.firstElementChild); }
    pintar();
  }

  const irADetalle = (id) => { location.href = 'detalle.html?id=' + encodeURIComponent(id); };
  tp.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-tab]');
    if (tab) { if (tab.dataset.tab !== st.activeTabId) { st.activeTabId = tab.dataset.tab; enfocarPestana = true; fetchTabulators(); } return; }
    const opts = e.target.closest('[data-opts]');
    if (opts) { e.stopPropagation(); if (menuDe === opts) cerrarMenu(true); else abrirMenu(opts); return; }
    const fila = e.target.closest('tr[data-id]');
    if (fila) irADetalle(fila.dataset.id);
  });
  tp.addEventListener('keydown', (e) => {
    if (e.target.matches('[data-tab]') && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      e.preventDefault();
      const i = TAB_ITEMS.findIndex((t) => t.id === st.activeTabId);
      st.activeTabId = TAB_ITEMS[(i + (e.key === 'ArrowRight' ? 1 : TAB_ITEMS.length - 1)) % TAB_ITEMS.length].id;
      enfocarPestana = true; fetchTabulators(); return;
    }
    if (e.target.matches('tr[data-id]') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); irADetalle(e.target.dataset.id); }
  });

  /* ======================= TabulatorRowOptionsMenu (⋮): Ver detalles · Archivar | Desarchivar ======================= */
  const menu = $('tbMenu');
  let menuDe = null;
  function abrirMenu(btn) {
    cerrarMenu(false);
    const id = btn.dataset.opts, isActiveTab = Number(st.activeTabId) === TABS_IDS.ACTIVE;
    menu.innerHTML = '<button type="button" class="tb-menu__item" role="menuitem" data-ver="' + id + '">' + TXT.SEE_DETAILS + '</button>'
      + '<button type="button" class="tb-menu__item" role="menuitem" data-archivar="' + id + '"' + (st.updateLoading ? ' disabled' : '') + '>' + (isActiveTab ? TXT.ARCHIVE : ARCHIVE_MODAL.ACTIVATE_BTN) + '</button>';
    menu.setAttribute('aria-label', btn.getAttribute('aria-label'));
    menu.hidden = false; menuDe = btn; btn.setAttribute('aria-expanded', 'true');
    /* 28 px abajo del ícono y alineado a su derecha (PositionTop 28 / PositionRight 0); arriba si no cabe */
    const r = btn.getBoundingClientRect(), h = menu.offsetHeight;
    const left = Math.max(8, Math.min(r.right - menu.offsetWidth, innerWidth - menu.offsetWidth - 8));
    const top = r.top + 28 + h > innerHeight - 8 ? r.top - 4 - h : r.top + 28;
    menu.style.left = left + 'px'; menu.style.top = top + 'px';
    menu.querySelector('.tb-menu__item').focus();
  }
  function cerrarMenu(foco) {
    if (!menuDe) return;
    const b = menuDe; menuDe = null; menu.hidden = true; menu.innerHTML = '';
    b.setAttribute('aria-expanded', 'false');
    if (foco && document.contains(b)) b.focus();
  }
  menu.addEventListener('click', (e) => {
    const ver = e.target.closest('[data-ver]'); if (ver) { const id = ver.dataset.ver; cerrarMenu(false); irADetalle(id); return; }
    const arch = e.target.closest('[data-archivar]'); if (arch && !arch.disabled) { const id = arch.dataset.archivar; const b = menuDe; cerrarMenu(false); openArchiveModal(Number(id), b); }
  });
  menu.addEventListener('keydown', (e) => {
    const items = [...menu.querySelectorAll('.tb-menu__item:not(:disabled)')]; const i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); items[(i + (e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length].focus(); }
    if (e.key === 'Escape') { e.preventDefault(); cerrarMenu(true); }
    if (e.key === 'Tab') cerrarMenu(false);
  });
  document.addEventListener('mousedown', (e) => { if (menuDe && !menu.contains(e.target) && !menuDe.contains(e.target)) cerrarMenu(false); });
  addEventListener('scroll', () => cerrarMenu(false), true);
  addEventListener('resize', () => cerrarMenu(false));

  /* ======================= TabulatorArchiveConfirmModal (con el Modal del DS, como en el detalle) ======================= */
  const modalRoot = $('tbModales');
  let modal = null;
  const FOCUSABLE = 'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function setBtnLoading(b, on) {
    if (!b) return;
    b.classList.toggle('is-loading', on); b.disabled = on;
    if (on) b.setAttribute('aria-busy', 'true'); else b.removeAttribute('aria-busy');
    const sp = b.querySelector('.ds-spinner');
    if (on && !sp) b.insertAdjacentHTML('afterbegin', '<span class="ds-spinner ds-spinner--sm" aria-hidden="true"></span>');
    if (!on && sp) sp.remove();
  }
  const closeModal = (volverA) => {
    if (!modal) return;
    document.removeEventListener('keydown', modal.onKey);
    modal.el.remove(); document.body.style.overflow = modal.overflow;
    const prev = modal.prev; modal = null;
    if (volverA !== false && prev && document.contains(prev) && !prev.disabled) prev.focus();
  };
  const cancel = () => { if (!st.updateLoading) closeModal(); };
  function openArchiveModal(tabId, origen) {
    const t = st.tabulators.find((x) => x.tabulatorId === tabId); if (!t) return;
    const archiving = Number(st.activeTabId) === TABS_IDS.ACTIVE;
    const title = archiving ? ARCHIVE_MODAL.ARCHIVE_TITLE : ARCHIVE_MODAL.ACTIVATE_TITLE;
    const description = archiving ? getArchiveDescription(t.nameTabulator) : getActivateDescription(t.nameTabulator);
    const el = document.createElement('div');
    el.className = 'cd-overlay ds-modal-overlay'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-labelledby', 'tbModalTitle'); el.setAttribute('aria-describedby', 'tbModalDesc');
    el.innerHTML = '<div class="ds-modal cd-modal"><div class="ds-modal__header"><h3 class="ds-modal__title" id="tbModalTitle">' + esc(title) + '</h3>'
      + '<button type="button" class="ds-btn ds-btn--tertiary ds-btn--icon-md cd-modal__x" aria-label="Cerrar" data-close>' + ico('Close', 24) + '</button></div>'
      + '<div class="ds-modal__body"><p id="tbModalDesc">' + esc(description) + '</p></div>'
      + '<div class="ds-modal__footer"><button type="button" class="ds-btn ds-btn--md ds-btn--tertiary" data-close><span class="cd-btn__txt">' + ARCHIVE_MODAL.CANCEL + '</span></button>'
      + '<button type="button" class="ds-btn ds-btn--md ds-btn--primary" data-confirm><span class="cd-btn__txt">' + esc(archiving ? ARCHIVE_MODAL.ARCHIVE_BTN : ARCHIVE_MODAL.ACTIVATE_BTN) + '</span></button></div></div>';
    modalRoot.appendChild(el);
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); cancel(); return; }
      if (e.key !== 'Tab') return;
      const f = [...el.querySelectorAll(FOCUSABLE)]; if (!f.length) return;
      const first = f[0], last = f[f.length - 1], a = document.activeElement;
      if (e.shiftKey && (a === first || !el.contains(a))) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && (a === last || !el.contains(a))) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    modal = { el, onKey, prev: origen || document.activeElement, overflow: document.body.style.overflow };
    document.body.style.overflow = 'hidden';
    el.addEventListener('mousedown', (e) => { el._down = e.target === el; });
    el.addEventListener('click', (e) => {
      if ((e.target === el && el._down) || e.target.closest('[data-close]')) { cancel(); return; }
      if (e.target.closest('[data-confirm]')) confirmToggle(t, archiving);
    });
    requestAnimationFrame(() => { const f = el.querySelector(FOCUSABLE); if (f) f.focus(); });
  }
  /* updateTabulatorStatus: loading en el botón del modal; al terminar se cierra y se vuelve a pedir la tabla (handleStatusChanged).
     El cambio se recuerda para el detalle (datos.js) */
  function confirmToggle(t, archiving) {
    if (st.updateLoading) return;
    st.updateLoading = true; setBtnLoading(modal && modal.el.querySelector('[data-confirm]'), true);
    (() => {
      D.guardarEstatus(t.tabulatorId, archiving ? TABS_IDS.ARCHIVED : TABS_IDS.ACTIVE);
      st.updateLoading = false; closeModal(false);
      enfocarPestana = true; fetchTabulators();
    })();
  }

  /* ======================= Botón "Tabulador" (CreateTabulatorButton, con HU-CP-376-F) ======================= */
  /* Lleva a routers.NewMetalTabulator, que no está en el prototipo: se avisa con un Toast del DS */
  function toast(titulo, texto) {
    const region = $('posToasts'); if (!region) return;
    const t = document.createElement('div');
    t.className = 'ds-toast ds-toast--info'; t.setAttribute('role', 'status');
    t.innerHTML = '<span class="ds-toast__icon" aria-hidden="true">' + ico('EstadosInfo', 24) + '</span><div class="ds-toast__body-wrap"><p class="ds-toast__title"></p><p class="ds-toast__body"></p></div>'
      + '<button type="button" class="ds-toast__close" aria-label="Cerrar">' + ico('Close', 20) + '</button><div class="ds-toast__timer" aria-hidden="true"></div>';
    t.querySelector('.ds-toast__title').textContent = titulo;
    t.querySelector('.ds-toast__body').textContent = texto;
    region.querySelectorAll('.ds-toast').forEach((x) => x.remove());
    region.appendChild(t);
    /* 5 s: se va cuando la barra de tiempo termina; con el puntero encima la barra (y el toast) se detienen */
    t.querySelector('.ds-toast__timer').addEventListener('animationend', () => t.remove());
    t.addEventListener('mouseenter', () => t.classList.add('is-paused'));
    t.addEventListener('mouseleave', () => t.classList.remove('is-paused'));
    t.querySelector('.ds-toast__close').addEventListener('click', () => t.remove());
  }
  $('tbCrear').addEventListener('click', () => toast('Crear tabulador', 'La pantalla para crear un tabulador (HU-CP-376-F) todavía no está en el prototipo.'));

  /* íconos estáticos del marcado */
  document.querySelectorAll('#tbMain [data-ico]').forEach((s) => { s.outerHTML = ico(s.dataset.ico, 20); });

  /* ======================= arranque: árbol → primer nodo (la empresa) → tabuladores ======================= */
  renderLoc(); renderTable();
  getTabulatorLocationTree().then((tree) => {
    st.tree = tree; st.treeLoading = false;
    if (!st.selected && tree.length > 0) { const f = tree[0]; st.selected = { id: String(f.locationId), label: f.name, type: f.type }; }
    renderLoc(); fetchTabulators();
  });
})();
