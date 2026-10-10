/* Detalles de tabulador (HU-CP-377-F) — reconstrucción estática del código de Product Design
   (rama del equipo del repo del equipo, src/components/MetalTabulator/TabulatorDetails/NewTabulatorDetails/**).
   En la app los datos vienen de Redux (GetTabulatorDetailsReducer.details, interfaz ITabulatorDetails). Aquí van datos de ejemplo
   con esa misma forma; los campos que la API todavía no manda (creado, última modificación, estado "En uso" y zona de la sucursal)
   usan sus DEV_MOCK_DETAILS, como en su ambiente de desarrollo. */
(() => {
  'use strict';

  const ICO = {"Info":["0 0 20 20","<g clip-path=\"url(#clip0_10099_28392)\"><path d=\"M9 15H11V9H9V15ZM10 7C10.2833 7 10.5208 6.90417 10.7125 6.7125C10.9042 6.52083 11 6.28333 11 6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6C9 6.28333 9.09583 6.52083 9.2875 6.7125C9.47917 6.90417 9.71667 7 10 7ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z\" fill=\"currentColor\"></path></g><defs><clipPath id=\"clip0_10099_28392\"><rect width=\"20\" height=\"20\" fill=\"white\"></rect></clipPath></defs>"],"Close":["0 0 24 24","<path d=\"M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z\" fill=\"currentColor\"></path>"]};
  const ico = (n, s = 24) => '<svg class="cd-ico" width="' + s + '" height="' + s + '" viewBox="' + ICO[n][0] + '" fill="none" aria-hidden="true" focusable="false">' + ICO[n][1] + '</svg>';
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ======================= newTabulatorDetails.constants.ts ======================= */
  const TXT = {
    BASE_PRICE_LABEL: 'Tu precio base',
    MARKET_PRICE_LABEL: 'Precio mercado',
    PURITY_COLUMN: 'Pureza',
    INFO_FOLIO: 'Folio',
    INFO_CREATED: 'Creado',
    INFO_UPDATED: 'Última modificación',
    INFO_APPLIES_IN: 'Aplica en',
    INFO_STATUS: 'Estado',
    STATUS_IN_USE: 'En uso',
    STATUS_UNASSIGNED: 'Sin asignar',
    LOCATION_TOOLTIP: 'Se muestra así porque un nuevo tabulador ya aplica en esta sucursal.',
  };
  const getAutomationCountLabel = (count, max) => count + ' de ' + max + ' reglas';
  const getBranchesCountLabel = (count) => count + ' ' + (count === 1 ? 'sucursal' : 'sucursales');
  const AUTOMATION_MAX_RULES = 4;
  const getUserDateLabel = (date, user) => date + ' · ' + user;
  const getPercentWithCommaLabel = (v) => v + '%,';
  const DEV_MOCK_DETAILS = { createdAt: '12 Sep 2026', createdBy: 'Ana R.', updatedAt: '3 Oct 2026', updatedBy: 'Luis M.', inUse: true, branchZone: 'Ciudad de México' };
  const UNIT_TABS = [{ id: 'gram', label: 'Gramo' }, { id: 'ounce', label: 'Onza' }];
  const TROY_OUNCE_IN_GRAMS = 28.3495;
  const QUALITY_COLUMNS = [
    { key: 'exellentAmount', label: 'Excelente', conservationKey: 'excellent' },
    { key: 'wellAmount', label: 'Bueno', conservationKey: 'good' },
    { key: 'averageAmount', label: 'Regular', conservationKey: 'regular' },
    { key: 'badAmont', label: 'Malo', conservationKey: 'bad' },
  ];
  const AUTOMATION_CONSTANT_TEXT = { WHEN: 'Cuando precio', MORE_THAN: 'más de', AMOUNT: 'en un', TIME: 'de manera' };
  /* NewMetalTabulatorHome/constants.ts */
  const ARCHIVE_MODAL = { ARCHIVE_TITLE: 'Archivar tabulador', ACTIVATE_TITLE: 'Desarchivar tabulador', CANCEL: 'Cancelar', ARCHIVE_BTN: 'Archivar', ACTIVATE_BTN: 'Desarchivar' };
  const getArchiveDescription = (name) => name + ' dejará de estar disponible para nuevas valuaciones. Puedes desarchivarlo cuando quieras.';
  const getActivateDescription = (name) => name + ' volverá a estar disponible en Activo.';
  const TABS_IDS = { ACTIVE: 1, ARCHIVED: 2 };
  /* HU-CP-389-F (incremento automático en las reglas) se toma como encendida en el prototipo */
  const FLAG_HU_CP_389_F = true;

  /* ======================= Datos de ejemplo con la forma de ITabulatorDetails ======================= */
  /* NewMetalTabulator: precio por pureza = precio base × pureza; Excelente 91 %, Bueno 80 %, Regular 75 %, Malo 60 % (PERCENTAGES) */
  const PERCENTAGES = { excellent: 0.91, good: 0.8, regular: 0.75, bad: 0.6 };
  const round = (v) => Math.round(v * 100) / 100;
  const BASE_PRICE_GRAM = 2182.66;   /* 24K por gramo (MXN); × 28.3495 ≈ su BASE_PRICE de 61,877.35 por onza */
  const KARATS = [['8K', 33.3], ['10K', 41.7], ['12K', 50], ['14K', 58.5], ['18K', 75], ['21K', 87.5], ['22K', 91.6], ['24K', 99.9]];
  const goldTabulator = KARATS.map(([name, pct], i) => {
    const base = round(BASE_PRICE_GRAM * (pct / 100));
    return {
      detailTabId: 300 + i, quilatesId: i + 1, quilatesName: name, porcentValue: pct, baseAmount: base,
      exellentAmount: round(base * PERCENTAGES.excellent), wellAmount: round(base * PERCENTAGES.good),
      averageAmount: round(base * PERCENTAGES.regular), badAmont: round(base * PERCENTAGES.bad),
    };
  });
  const details = {
    tabId: 12,
    tabName: 'Oro zona centro',
    tabIdentifier: 'TAB-001',
    statusTabId: TABS_IDS.ACTIVE,
    statusTabName: 'Activo',
    tabUnitMeasure: 'Gramo',
    goldValue: { tittlePrice: 'Precio base de 24K (MXN)', basePrice: BASE_PRICE_GRAM, basePorcent: -2.15 },
    goldTabulator,
    priceAdjustmentAutomation: [
      {
        idAutomation: 1, nameAutomation: 'del oro (USD/OZ)', imageAutomation: '', conditionId: 1, catTabConditionId: 1, catTabConditionName: 'sube',
        porcent: 2, catTypeExecutionTabId: 1, catTypeExecutionTabName: 'solo notificar sin hacer cambios', catTypeProcessActionName: '', porcentAutoIncrement: 0, catTypeIncrementName: '',
      },
      {
        idAutomation: 2, nameAutomation: 'del dólar (USD/MXN)', imageAutomation: '', conditionId: 2, catTabConditionId: 2, catTabConditionName: 'baja',
        porcent: 1.5, catTypeExecutionTabId: 2, catTypeExecutionTabName: 'cambiar precio base', catTypeProcessActionName: 'automática', porcentAutoIncrement: 1, catTypeIncrementName: 'menos',
      },
    ],
    generalInformation: [
      { branchTabId: 101, branchId: 1, branchName: 'Sucursal Polanco', branchTabStatus: true, branchZone: 'Ciudad de México' },
      { branchTabId: 102, branchId: 2, branchName: 'Sucursal Roma Norte', branchTabStatus: true, branchZone: 'Ciudad de México' },
      { branchTabId: 103, branchId: 3, branchName: 'Sucursal Coyoacán', branchTabStatus: true, branchZone: 'Ciudad de México' },
      { branchTabId: 104, branchId: 4, branchName: 'Sucursal Satélite', branchTabStatus: false, branchZone: 'Estado de México' },
      { branchTabId: 105, branchId: 5, branchName: 'Sucursal Santa Fe', branchTabStatus: true, branchZone: 'Ciudad de México' },
      { branchTabId: 106, branchId: 6, branchName: 'Sucursal Tlalnepantla Centro, Plaza Mundo E', branchTabStatus: true, branchZone: 'Estado de México' },
    ],
    tabConservationStatus: { excellent: 91, good: 80, regular: 75, bad: 60 },
    /* createdDate, createdBy, updatedDate, updatedBy e inUse todavía no vienen de la API: se usan los DEV_MOCK_DETAILS */
  };

  /* ======================= utils ======================= */
  const numberToCurrency = (n) => new Intl.NumberFormat('ES-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 2 }).format(n);
  const getQualityHeaderLabel = (col, cons) => col.label + ' (' + cons[col.conservationKey] + '%)';
  const convertGoldTabulatorToUnit = (rows, activeUnitId, nativeUnit) => {
    if (activeUnitId === nativeUnit) return rows;
    const factor = nativeUnit === 'gram' ? TROY_OUNCE_IN_GRAMS : 1 / TROY_OUNCE_IN_GRAMS;
    return rows.map((r) => { const c = { ...r }; ['baseAmount', 'exellentAmount', 'wellAmount', 'averageAmount', 'badAmont'].forEach((k) => { c[k] = r[k] * factor; }); return c; });
  };
  const withDevFallback = (value, mock) => (value !== undefined && value !== null ? value : mock);
  const t = (variant, text, extra = '') => '<span class="tb-t tb-t--' + variant + (extra ? ' ' + extra : '') + '">' + esc(text) + '</span>';

  /* ======================= estado ======================= */
  const nativeUnit = details.tabUnitMeasure === 'Gramo' ? 'gram' : 'ounce';
  let activeUnitId = details.tabUnitMeasure === 'Gramo' ? UNIT_TABS[0].id : UNIT_TABS[1].id;
  let updateStatusLoading = false;
  const isArchived = () => details.statusTabId === TABS_IDS.ARCHIVED;

  /* ======================= render ======================= */
  const $ = (id) => document.getElementById(id);
  const renderHeader = () => {
    $('tbTitle').textContent = details.tabName;
    const b = $('tbArchivar');
    b.querySelector('.cd-btn__txt').textContent = isArchived() ? ARCHIVE_MODAL.ACTIVATE_BTN : ARCHIVE_MODAL.ARCHIVE_BTN;
    setBtnLoading(b, updateStatusLoading);
  };
  const renderGeneral = () => {
    const activeBranches = details.generalInformation.filter((b) => b.branchTabStatus).length;
    const createdDate = withDevFallback(details.createdDate, DEV_MOCK_DETAILS.createdAt);
    const createdBy = withDevFallback(details.createdBy, DEV_MOCK_DETAILS.createdBy);
    const updatedDate = withDevFallback(details.updatedDate, DEV_MOCK_DETAILS.updatedAt);
    const updatedBy = withDevFallback(details.updatedBy, DEV_MOCK_DETAILS.updatedBy);
    const inUse = withDevFallback(details.inUse, DEV_MOCK_DETAILS.inUse);
    const item = (label, html) => '<div class="tb-dl__item"><dt>' + esc(label) + '</dt><dd>' + html + '</dd></div>';
    $('tbGeneral').innerHTML = item(TXT.INFO_FOLIO, t('bold', details.tabIdentifier))
      + (createdDate && createdBy ? item(TXT.INFO_CREATED, t('bold', getUserDateLabel(createdDate, createdBy))) : '')
      + (updatedDate && updatedBy ? item(TXT.INFO_UPDATED, t('bold', getUserDateLabel(updatedDate, updatedBy))) : '')
      + item(TXT.INFO_APPLIES_IN, t('bold', getBranchesCountLabel(activeBranches)))
      + (inUse !== undefined ? item(TXT.INFO_STATUS, '<span class="cd-chip cd-chip--' + (inUse ? 'status-green' : 'status-gray') + '">' + (inUse ? TXT.STATUS_IN_USE : TXT.STATUS_UNASSIGNED) + '</span>') : '');
  };
  const renderUnit = () => {
    $('tbUnidad').innerHTML = UNIT_TABS.map((u) => '<button type="button" role="tab" class="cd-tab" aria-selected="' + (u.id === activeUnitId) + '" tabindex="' + (u.id === activeUnitId ? 0 : -1) + '" data-unit="' + u.id + '">' + esc(u.label) + '</button>').join('');
    const bp = details.goldValue.basePrice;
    const basePrice = numberToCurrency(activeUnitId === nativeUnit ? bp : nativeUnit === 'gram' ? bp * TROY_OUNCE_IN_GRAMS : bp / TROY_OUNCE_IN_GRAMS);
    /* "Precio mercado" muestra el precio base: bug que Product Design dejó anotado en su código ("se deja tal cual por ahora") */
    const tile = (label, value) => '<div class="tb-tile">' + t('caption', label) + t('bold', value) + '</div>';
    $('tbTiles').innerHTML = tile(TXT.BASE_PRICE_LABEL, basePrice) + tile(TXT.MARKET_PRICE_LABEL, basePrice);
  };
  const renderTable = () => {
    const rows = convertGoldTabulatorToUnit(details.goldTabulator, activeUnitId, nativeUnit);
    $('tbTabla').innerHTML = '<thead><tr><th class="cd-th" scope="col"><div class="cd-th__in">' + esc(TXT.PURITY_COLUMN) + '</div></th>'
      + QUALITY_COLUMNS.map((c) => '<th class="cd-th cd-th--right" scope="col"><div class="cd-th__in">' + esc(getQualityHeaderLabel(c, details.tabConservationStatus)) + '</div></th>').join('') + '</tr></thead>'
      + '<tbody>' + rows.map((r) => '<tr class="cd-tr"><td class="cd-td"><div class="tb-purity">' + t('bold', r.quilatesName) + t('caption', r.porcentValue + '%') + '</div></td>'
        + QUALITY_COLUMNS.map((c) => '<td class="cd-td cd-td--right">' + esc(numberToCurrency(r[c.key])) + '</td>').join('') + '</tr>').join('') + '</tbody>';
    paintShadows();
  };
  const renderAutomation = () => {
    const a = details.priceAdjustmentAutomation;
    $('tbReglasN').textContent = getAutomationCountLabel(a.length, AUTOMATION_MAX_RULES);
    $('tbReglas').innerHTML = a.map((p) => '<li class="tb-rule">'
      + t('regular', AUTOMATION_CONSTANT_TEXT.WHEN) + t('bold', p.nameAutomation) + t('bold', p.catTabConditionName)
      + t('regular', AUTOMATION_CONSTANT_TEXT.MORE_THAN) + t('bold', getPercentWithCommaLabel(p.porcent)) + t('bold', p.catTypeExecutionTabName)
      + (FLAG_HU_CP_389_F && p.porcentAutoIncrement > 0
        ? t('regular', AUTOMATION_CONSTANT_TEXT.AMOUNT) + t('bold', p.porcentAutoIncrement + '%') + t('bold', p.catTypeIncrementName)
          + t('regular', AUTOMATION_CONSTANT_TEXT.TIME) + t('bold', p.catTypeProcessActionName)
        : '')
      + '</li>').join('');
  };
  const renderLocations = () => {
    const b = details.generalInformation;
    $('tbSucN').textContent = String(b.length);
    $('tbSucursales').innerHTML = b.map((br) => {
      const replaced = !br.branchTabStatus;
      const zone = withDevFallback(br.branchZone, DEV_MOCK_DETAILS.branchZone);
      /* BranchName: el Tooltip con el nombre completo solo aparece si el nombre se corta (data-tip-trunc) */
      return '<li class="tb-branch"><span class="tb-branch__row">'
        + '<span class="tb-t tb-t--regular tb-trunc' + (replaced ? ' tb-t--replaced' : '') + '" data-tip-trunc="' + esc(br.branchName) + '">' + esc(br.branchName) + '</span>'
        + (replaced ? '<button type="button" class="tb-help" data-tip="' + esc(TXT.LOCATION_TOOLTIP) + '" aria-label="' + esc(TXT.LOCATION_TOOLTIP) + '">' + ico('Info', 16) + '</button>' : '')
        + '</span>' + (zone ? t('caption', zone) : '') + '</li>';
    }).join('');
  };

  /* Button loading (DS): spinner y bloqueado mientras carga */
  function setBtnLoading(b, on) {
    if (!b) return;
    b.classList.toggle('is-loading', on); b.disabled = on;
    if (on) b.setAttribute('aria-busy', 'true'); else b.removeAttribute('aria-busy');
    const sp = b.querySelector('.cd-spinner');
    if (on && !sp) b.insertAdjacentHTML('afterbegin', '<span class="cd-spinner" aria-hidden="true"></span>');
    if (!on && sp) sp.remove();
  }

  /* sombras de scroll horizontal (useHorizontalScrollShadows del DS) */
  const frame = document.querySelector('[data-tframe]');
  const scroller = frame.querySelector('.cd-tscroll');
  function paintShadows() {
    frame.classList.toggle('is-start', scroller.scrollLeft > 1);
    frame.classList.toggle('is-end', scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1);
  }
  scroller.addEventListener('scroll', paintShadows, { passive: true });
  addEventListener('resize', paintShadows);
  if (typeof ResizeObserver !== 'undefined') { const ro = new ResizeObserver(paintShadows); ro.observe(scroller); ro.observe(scroller.firstElementChild); }

  /* TabsButton: Gramo | Onza (flechas para moverse entre pestañas) */
  $('tbUnidad').addEventListener('click', (e) => {
    const b = e.target.closest('[data-unit]'); if (!b || b.dataset.unit === activeUnitId) return;
    activeUnitId = b.dataset.unit; renderUnit(); renderTable();
    $('tbUnidad').querySelector('[data-unit="' + activeUnitId + '"]').focus();
  });
  $('tbUnidad').addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const i = UNIT_TABS.findIndex((u) => u.id === activeUnitId);
    activeUnitId = UNIT_TABS[(i + (e.key === 'ArrowRight' ? 1 : UNIT_TABS.length - 1)) % UNIT_TABS.length].id;
    renderUnit(); renderTable();
    $('tbUnidad').querySelector('[data-unit="' + activeUnitId + '"]').focus();
  });

  /* ======================= Archivar / Desarchivar (TabulatorArchiveConfirmModal con el Modal del DS) ======================= */
  const modalRoot = $('tbModales');
  let modal = null;
  const FOCUSABLE = 'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const closeModal = () => {
    if (!modal) return;
    document.removeEventListener('keydown', modal.onKey);
    modal.el.remove(); document.body.style.overflow = modal.overflow;
    const prev = modal.prev; modal = null;
    if (prev && document.contains(prev) && !prev.disabled) prev.focus(); else $('tbArchivar').focus();
  };
  const cancel = () => { if (!updateStatusLoading) closeModal(); };
  const openArchiveModal = () => {
    const archiving = !isArchived();
    const title = archiving ? ARCHIVE_MODAL.ARCHIVE_TITLE : ARCHIVE_MODAL.ACTIVATE_TITLE;
    const description = archiving ? getArchiveDescription(details.tabName) : getActivateDescription(details.tabName);
    const confirmLabel = archiving ? ARCHIVE_MODAL.ARCHIVE_BTN : ARCHIVE_MODAL.ACTIVATE_BTN;
    const el = document.createElement('div');
    el.className = 'cd-overlay'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-labelledby', 'tbModalTitle'); el.setAttribute('aria-describedby', 'tbModalDesc');
    el.innerHTML = '<div class="cd-modal"><div class="cd-modal__head"><h3 class="cd-modal__title" id="tbModalTitle">' + esc(title) + '</h3>'
      + '<button type="button" class="cd-modal__x" aria-label="Cerrar" data-close>' + ico('Close', 24) + '</button></div>'
      + '<div class="cd-modal__body"><p id="tbModalDesc">' + esc(description) + '</p></div>'
      + '<div class="cd-modal__foot"><button type="button" class="cd-btn cd-btn--tertiary" data-close><span class="cd-btn__txt">' + ARCHIVE_MODAL.CANCEL + '</span></button>'
      + '<button type="button" class="cd-btn cd-btn--primary" data-confirm><span class="cd-btn__txt">' + esc(confirmLabel) + '</span></button></div></div>';
    modalRoot.appendChild(el);
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); cancel(); return; }
      if (e.key !== 'Tab') return;
      const f = [...el.querySelectorAll(FOCUSABLE)]; if (!f.length) return;
      const first = f[0]; const last = f[f.length - 1]; const a = document.activeElement;
      if (e.shiftKey && (a === first || !el.contains(a))) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && (a === last || !el.contains(a))) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    modal = { el, onKey, prev: document.activeElement, overflow: document.body.style.overflow };
    document.body.style.overflow = 'hidden';
    el.addEventListener('mousedown', (e) => { el._down = e.target === el; });
    el.addEventListener('click', (e) => {
      if ((e.target === el && el._down) || e.target.closest('[data-close]')) { cancel(); return; }
      if (e.target.closest('[data-confirm]')) confirmToggle();
    });
    /* foco al primer control del diálogo (como su useDialogFocus), no al botón que confirma */
    requestAnimationFrame(() => { const f = el.querySelector(FOCUSABLE); if (f) f.focus(); });
  };
  /* updateTabulatorStatus: mismo loading en el botón del encabezado y en el del modal; al terminar se cierra y se vuelve a pedir el detalle */
  const confirmToggle = () => {
    if (updateStatusLoading) return;
    updateStatusLoading = true; renderHeader(); setBtnLoading(modal && modal.el.querySelector('[data-confirm]'), true);
    setTimeout(() => {
      details.statusTabId = isArchived() ? TABS_IDS.ACTIVE : TABS_IDS.ARCHIVED;
      details.statusTabName = isArchived() ? 'Archivado' : 'Activo';
      updateStatusLoading = false; renderHeader(); closeModal();
    }, 600 + Math.round(Math.random() * 300));
  };
  $('tbArchivar').addEventListener('click', openArchiveModal);
  document.querySelector('[data-noop]').addEventListener('click', (e) => e.preventDefault());

  /* ======================= Tooltip (DS) ======================= */
  const tip = document.createElement('div');
  tip.className = 'cd-tip'; tip.setAttribute('role', 'tooltip'); tip.hidden = true;
  document.body.appendChild(tip);
  const showTip = (anchor, text) => {
    tip.innerHTML = esc(text) + '<svg class="cd-tip__arrow" viewBox="0 0 16 8" width="16" height="8" fill="none" aria-hidden="true"><path d="M0 0 L16 0 L8 8 Z" fill="#0D166B"/></svg>';
    tip.hidden = false;
    const a = anchor.getBoundingClientRect(); const w = tip.offsetWidth; const h = tip.offsetHeight;
    let left = a.left + a.width / 2 - w / 2; left = Math.max(8, Math.min(left, innerWidth - w - 8));
    /* arriba del ancla (position="top" del DS); si no cabe bajo el header, abajo */
    const headerBottom = (document.querySelector('.pos-header') || { getBoundingClientRect: () => ({ bottom: 0 }) }).getBoundingClientRect().bottom;
    const above = a.top - h - 8 >= headerBottom;
    tip.style.left = left + 'px'; tip.style.top = (above ? a.top - h - 8 : a.bottom + 8) + 'px';
    const arrow = tip.querySelector('.cd-tip__arrow');
    arrow.classList.add(above ? 'cd-tip__arrow--top' : 'cd-tip__arrow--bottom');
    arrow.style.left = (a.left + a.width / 2 - left) + 'px';
    tip.classList.add('is-on');
  };
  const hideTip = () => { tip.classList.remove('is-on'); tip.hidden = true; };
  const tipFor = (el) => {
    const a = el && el.closest && el.closest('[data-tip], [data-tip-trunc]'); if (!a) return null;
    if (a.hasAttribute('data-tip')) return [a, a.dataset.tip];
    return a.scrollWidth > a.clientWidth ? [a, a.dataset.tipTrunc] : null;
  };
  document.addEventListener('mouseover', (e) => { const r = tipFor(e.target); if (r) showTip(r[0], r[1]); });
  document.addEventListener('mouseout', (e) => { const a = e.target.closest && e.target.closest('[data-tip], [data-tip-trunc]'); if (a && !a.contains(e.relatedTarget)) hideTip(); });
  document.addEventListener('focusin', (e) => { const r = tipFor(e.target); if (r) showTip(r[0], r[1]); });
  document.addEventListener('focusout', hideTip);
  addEventListener('scroll', hideTip, true);

  /* íconos estáticos del marcado */
  document.querySelectorAll('[data-ico]').forEach((s) => { s.outerHTML = ico(s.dataset.ico, 16); });

  renderHeader(); renderGeneral(); renderUnit(); renderTable(); renderAutomation(); renderLocations();
})();
