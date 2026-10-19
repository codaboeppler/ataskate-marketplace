/* Ataskate POS (Operativo) · Clientes: listado, filtros y perfil del cliente.
   Prototipo de Product Design (rama del equipo del repo del equipo, commit 8f7723ad6), traído al prototipo del POS:
   el header y el menú lateral son los compartidos (../navbar.js y ../menu-op.js); aquí solo vive el contenido del módulo.
   Se quitaron las pantallas de Home, Inventario y Nuevo artículo que venían en el mismo archivo (ya existen en ../home/ y ../inventario/).
   Commit 2d1b103b4: búsqueda en otras fuentes (Marketplace / Red ataskate), modal "Verifica al cliente" y estados vacíos nuevos. */

// Íconos exportados directamente desde el archivo de Figma "Inventario"
const S = (w, h, body) => `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const ICONS = {
  search: S(24,24,'<path d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.146 15.371 4.888 14.113C3.62933 12.8543 3 11.3167 3 9.5C3 7.68333 3.62933 6.14567 4.888 4.887C6.146 3.629 7.68333 3 9.5 3C11.3167 3 12.8543 3.629 14.113 4.887C15.371 6.14567 16 7.68333 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8127 13.5627 12.688 12.688C13.5627 11.8127 14 10.75 14 9.5C14 8.25 13.5627 7.18733 12.688 6.312C11.8127 5.43733 10.75 5 9.5 5C8.25 5 7.18733 5.43733 6.312 6.312C5.43733 7.18733 5 8.25 5 9.5C5 10.75 5.43733 11.8127 6.312 12.688C7.18733 13.5627 8.25 14 9.5 14Z" style="fill:var(--ats-primary-300)"/>'),
  plus: S(24,24,'<path d="M11 19V13H5V11H11V5H13V11H19V13H13V19H11Z" style="fill:var(--ats-primary-300)"/>'),
  plusWhite: S(20,20,'<path d="M9.16675 15.8346V10.8346H4.16675V9.16797H9.16675V4.16797H10.8334V9.16797H15.8334V10.8346H10.8334V15.8346H9.16675Z" style="fill:var(--ats-white)"/>'),
  addplus: S(20,20,'<path d="M9.16675 15.8346V10.8346H4.16675V9.16797H9.16675V4.16797H10.8334V9.16797H15.8334V10.8346H10.8334V15.8346H9.16675Z" style="fill:var(--ats-neutral-600)"/>'),
  check16: S(16,16,'<path d="M6.36641 12.001L2.56641 8.20104L3.51641 7.25104L6.36641 10.101L12.4831 3.98438L13.4331 4.93438L6.36641 12.001Z" style="fill:var(--ats-white)"/>'),
  chevDown: S(24,24,'<path d="M5.7 9.7L7.1 8.3L11.7 12.9L16.3 8.3L17.7 9.7L11.7 15.7L5.7 9.7Z" style="fill:var(--ats-primary-300)"/>'),
  rowRight: S(28,28,'<path d="M11.8327 19L10.666 17.8333L14.4993 14L10.666 10.1667L11.8327 9L16.8327 14L11.8327 19Z" style="fill:var(--ats-primary-300)"/>'),
  help: S(20,20,'<circle cx="10" cy="10" r="7.5" style="stroke:var(--ats-neutral-300)" stroke-width="1.67"/><path d="M8 7.6C8.3 6.8 9.1 6.4 10 6.4c1.1 0 1.9.7 1.9 1.6 0 1.3-1.9 1.5-1.9 3" style="stroke:var(--ats-neutral-300)" stroke-width="1.5" stroke-linecap="round"/><circle cx="10" cy="13.9" r="1" style="fill:var(--ats-neutral-300)"/>'),
  close: S(24,24,'<path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z" style="fill:var(--ats-primary-300)"/>'),
  info: S(24,24,'<path d="M10.7754 16.8359H12.7754V10.8359H10.7754V16.8359ZM11.7754 8.83594C12.0587 8.83594 12.2962 8.7401 12.4879 8.54844C12.6796 8.35677 12.7754 8.11927 12.7754 7.83594C12.7754 7.5526 12.6796 7.3151 12.4879 7.12344C12.2962 6.93177 12.0587 6.83594 11.7754 6.83594C11.4921 6.83594 11.2546 6.93177 11.0629 7.12344C10.8712 7.3151 10.7754 7.5526 10.7754 7.83594C10.7754 8.11927 10.8712 8.35677 11.0629 8.54844C11.2546 8.7401 11.4921 8.83594 11.7754 8.83594ZM11.7754 21.8359C10.3921 21.8359 9.09206 21.5734 7.87539 21.0484C6.65872 20.5234 5.60039 19.8109 4.70039 18.9109C3.80039 18.0109 3.08789 16.9526 2.56289 15.7359C2.03789 14.5193 1.77539 13.2193 1.77539 11.8359C1.77539 10.4526 2.03789 9.1526 2.56289 7.93594C3.08789 6.71927 3.80039 5.66094 4.70039 4.76094C5.60039 3.86094 6.65872 3.14844 7.87539 2.62344C9.09206 2.09844 10.3921 1.83594 11.7754 1.83594C13.1587 1.83594 14.4587 2.09844 15.6754 2.62344C16.8921 3.14844 17.9504 3.86094 18.8504 4.76094C19.7504 5.66094 20.4629 6.71927 20.9879 7.93594C21.5129 9.1526 21.7754 10.4526 21.7754 11.8359C21.7754 13.2193 21.5129 14.5193 20.9879 15.7359C20.4629 16.9526 19.7504 18.0109 18.8504 18.9109C17.9504 19.8109 16.8921 20.5234 15.6754 21.0484C14.4587 21.5734 13.1587 21.8359 11.7754 21.8359Z" style="fill:var(--ats-info-blue-200)"/>'),
  success: S(24,24,'<circle cx="12" cy="12" r="10" style="fill:var(--ats-success-green-200)"/><path d="M10.6 16.6L17.65 9.55L16.25 8.15L10.6 13.8L7.75 10.95L6.35 12.35L10.6 16.6Z" style="fill:var(--ats-white)"/>'),
  error: S(24,24,'<circle cx="12" cy="12" r="10" style="fill:var(--ats-error-red-200)"/><path d="M8.4 17L12 13.4L15.6 17L17 15.6L13.4 12L17 8.4L15.6 7L12 10.6L8.4 7L7 8.4L10.6 12L7 15.6L8.4 17Z" style="fill:var(--ats-white)"/>'),
};
ICONS.warn = S(24,24,'<path d="M1 21L12 2L23 21H1Z" style="fill:var(--ats-alert-yellow-200)"/><path d="M11 16V10H13V16H11ZM12 19C11.72 19 11.48 18.9 11.29 18.71C11.1 18.52 11 18.28 11 18C11 17.72 11.1 17.48 11.29 17.29C11.48 17.1 11.72 17 12 17C12.28 17 12.52 17.1 12.71 17.29C12.9 17.48 13 17.72 13 18C13 18.28 12.9 18.52 12.71 18.71C12.52 18.9 12.28 19 12 19Z" style="fill:var(--ats-white)"/>');

// Datos de ejemplo (ficticios)
const IMG = {}; // fotos de prendas: archivos en ./assets (antes venían incrustadas en base64)
const IMG_FILES = ['s24', 'huawei', 'switch-console', 'xbox-s', 'legion', 'rog', 'alienware', 'xbox-x'];
IMG_FILES.forEach(k => { IMG[k] = `assets/${k}.jpg`; });

const SUCURSALES = [
  { id: 's1', name: 'Monterrey centro', state: 'Nuevo León', region: 'Norte' },
  { id: 's2', name: 'Saltillo', state: 'Coahuila', region: 'Norte' },
  { id: 's3', name: 'CDMX Roma', state: 'CDMX', region: 'Centro' },
  { id: 's4', name: 'CDMX Polanco', state: 'CDMX', region: 'Centro' },
  { id: 's5', name: 'Puebla', state: 'Puebla', region: 'Centro' },
  { id: 's6', name: 'Querétaro', state: 'Querétaro', region: 'Centro' },
  // Completan las 12 sucursales que menciona el diseño
  { id: 's7', name: 'Polanco lomas', state: 'CDMX', region: 'Centro' },
  { id: 's8', name: 'Guadalajara centro', state: 'Jalisco', region: 'Occidente' },
  { id: 's9', name: 'Zapopan', state: 'Jalisco', region: 'Occidente' },
  { id: 's10', name: 'Naucalpan', state: 'Edo. de México', region: 'Centro' },
  { id: 's11', name: 'Cancún', state: 'Quintana Roo', region: 'Sur' },
  { id: 's12', name: 'Oaxaca centro', state: 'Oaxaca', region: 'Sur' },
];

// ---------- Clientes (datos ficticios): CLIENTES, FOTOS, EXT_CLI y los mocks del perfil viven en perfil-datos.js ----------

const RED_EMPRESAS = ['Empeños del Río', 'Monte Cristo', 'Prestamos Norte', 'Casa Lux', '—'];
const RED = Array.from({ length: 36 }, (_, i) => {
  const n = ['Laura Vidal', 'Óscar Peña', 'Irene Soto', 'Raúl Campos', 'Nora Ibáñez', 'Sergio Lugo', 'Alma Rivas', 'Iván Mejía', 'Clara Ponce'][i % 9].split(' ');
  return { id: 'r' + (i + 1), name: n[0], last: n[1], nuc: i + 1, nat: i % 7 === 3 ? 'Canadiense' : 'Mexicana', email: ['la', 'os', 'ir', 'ra', 'no', 'se', 'al', 'iv', 'cl'][i % 9] + '********@ejemplo.com', phone: '******' + String(1200 + i * 37).slice(-4), score: i % 5 === 0 ? 'Regular' : 'Nuevo', empresa: RED_EMPRESAS[i % 5] };
});

(function () {
'use strict';

// ---------- utilidades ----------
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ic = (name, extra = '') => `<span class="ico" ${extra}>${ICONS[name] || ''}</span>`;
const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
let uid = 100;

// ---------- estado ----------
const st = {
  screen: 'clients',
  menu: null,
  toast: null,
  modal: null, // DS Modal abierto ({ type: 'verify', i, val, err }: verificación de un cliente de otra fuente)
  cli: { tab: 'mis', q: '', page: 1, loading: false, f: {}, fd: null, panel: false, score: '', fresh: null },
  prof: {}, // se llena con newProf(id) al abrir un perfil
};


// ---------- render raíz ----------
const root = document.getElementById('app');
let lastScreen = null; let rendering = false;
function render() {
  // guardar foco / scroll
  const a = document.activeElement; let fk = null, s0 = 0, s1 = 0;
  if (a && a.dataset && a.dataset.fk) { fk = a.dataset.fk; try { s0 = a.selectionStart; s1 = a.selectionEnd; } catch (e) {} }
  const scrolls = {}; document.querySelectorAll('[data-sk]').forEach(el => { scrolls[el.dataset.sk] = el.scrollTop; });

  rendering = true;
  const changed = st.screen !== lastScreen; lastScreen = st.screen;
  // el header y el menú lateral son los compartidos del POS (fuera de #app); aquí solo va la pantalla del módulo
  root.innerHTML = `<div class="screen ${changed ? 'fade' : ''}">${screen()}</div>` + modal() + profileModals() + toast();

  document.querySelectorAll('[data-sk]').forEach(el => { if (scrolls[el.dataset.sk] != null) el.scrollTop = scrolls[el.dataset.sk]; });
  if (fk) { const el = document.querySelector(`[data-fk="${fk}"]`); if (el) { el.focus(); try { el.setSelectionRange(s0, s1); } catch (e) {} } }
  rendering = false;
  pfAfterRender();
}
// Home vive en ../home/ (módulo de Daniel); Clientes y Perfil son pantallas de este módulo
function go(screen) { if (screen === 'home') { location.href = '../home/'; return; } if (screen === 'clients' && /^#perfil\//.test(location.hash)) history.pushState(null, '', location.pathname + location.search); st.screen = screen; st.menu = null; render(); window.scrollTo(0, 0); }
function toastMsg(msg, kind = 'info', text = '') { st.toast = { msg, kind, text, id: ++uid }; const id = st.toast.id; render(); setTimeout(() => { if (st.toast && st.toast.id === id) { st.toast = null; render(); } }, 5000); }


function screen() {
  switch (st.screen) {
    case 'clients': return clientsScreen();
    case 'client': return clientProfileScreen();
    case 'contract': return contractScreen();
  }
  return '';
}

// ---------- CLIENTES (ClientList mejorada con componentes del DS) ----------
const PG = {
  first: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18.41 16.59 13.82 12l4.59-4.59L17 6l-6 6 6 6 1.41-1.41ZM6 6h2v12H6V6Z" fill="currentColor"/></svg>',
  prev: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59Z" fill="currentColor"/></svg>',
  next: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12l-4.58 4.59Z" fill="currentColor"/></svg>',
  last: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5.59 7.41 10.18 12l-4.59 4.59L7 18l6-6-6-6-1.41 1.41ZM16 6h2v12h-2V6Z" fill="currentColor"/></svg>',
};
const PER_PAGE = 8;
const SCORE_TAG = { Excelente: 'green', Bueno: 'blue', Regular: 'purple', Nuevo: 'gray' };
/* tono → modificador del DS Tag (ds-tag--verde, --azul…) */
const TAG_TONE = { green: 'verde', blue: 'azul', purple: 'morado', gray: 'gris', yellow: 'amarillo', red: 'rojo', pink: 'rosa', white: 'blanco' };
const dsTag = (label, tone) => `<span class="ds-tag ds-tag--${TAG_TONE[tone] || 'gris'}">${esc(label)}</span>`;
const SCORES = ['Excelente', 'Bueno', 'Regular', 'Nuevo'];
const NATS = ['Mexicana', 'Canadiense', 'Estadounidense'];
const FLABEL = { nuc: 'NUC', nombre: 'Nombre', nat: 'Nacionalidad', correo: 'Correo', tel: 'Teléfono', score: 'Score' };
/* Los clientes recién creados (sessionStorage, createdClients.ts) van primero, como en su useClientsRedesign */
function cliBase() { return st.cli.tab === 'mis' ? [...getCreatedClients(), ...CLIENTES] : RED; }
const venceHoy = c => DUE_TODAY_NUCS.includes(c.nuc);
function cliFilter(list, q, f) {
  const nq = norm(q || '');
  return list.filter(c => {
    if (nq && !norm(`${c.name} ${c.last} ${c.nuc} ${c.email} ${c.phone}`).includes(nq)) return false;
    if (f.nuc && !String(c.nuc).includes(f.nuc)) return false;
    if (f.nombre && !norm(c.name + ' ' + c.last).includes(norm(f.nombre))) return false;
    if (f.nat && c.nat !== f.nat) return false;
    if (f.correo && !norm(c.email).includes(norm(f.correo))) return false;
    if (f.tel && !c.phone.includes(f.tel)) return false;
    if (f.score && c.score !== f.score) return false;
    return true;
  });
}
function cliAllFilters() { const f = { ...st.cli.f }; if (st.cli.score) f.score = st.cli.score; return f; }
function hl(text, q) {
  const t = esc(text); if (!q) return t;
  const i = norm(text).indexOf(norm(q)); if (i < 0) return t;
  return esc(text.slice(0, i)) + `<strong class="hlq">${esc(text.slice(i, i + q.length))}</strong>` + esc(text.slice(i + q.length));
}
const initials = c => (c.name[0] + (c.last[0] || '')).toUpperCase();
// DS Avatar con las iniciales del cliente (sin fotos de personas)
const avatar = c => `<span class="ds-avatar ds-avatar--sm cli-av" aria-hidden="true">${esc(initials(c))}</span>`;
function scoreTag(s) { return s === 'Nuevo' ? '<span class="cap">Cliente nuevo</span>' : dsTag(s, SCORE_TAG[s]); }
// sin latencia simulada: los resultados salen al momento. El estado de carga (skeleton) se ve desde "Prototipo › Ver estado de carga".
function cliLoad() { st.cli.loading = false; st.cli.page = 1; render(); }
// pestañas de sesión al pie, iguales a las de ../inventario/ (Figma: Top Container · "Ventana principal" + "+")
function sesiones() {
  return `<nav class="cli-sessions" aria-label="Sesiones de trabajo"><span class="cli-sessions__tab" aria-current="page">Ventana principal<span class="cli-sessions__help" title="Cada pestaña es una sesión de trabajo con su propio carrito">${ICONS.help}</span></span><button class="cli-sessions__add" type="button" data-act="toast" data-msg="Nueva ventana de trabajo" aria-label="Abrir otra sesión" title="Abrir otra sesión">${ICONS.addplus}</button></nav>`;
}
// ---------- Búsqueda en otras fuentes (Marketplace / Red ataskate) · datos ficticios ----------
// commit 2d1b103b4 de Product Design: el buscador también encuentra clientes del Marketplace y de la Red ataskate.
// Solo se muestran datos parciales (correo y teléfono ocultos); "Cargar cliente" pide verificarlo antes de cargar sus datos.
// Los correos coinciden con LK_DB de cliente-nuevo.js, que los recibe en ?cargar=<correo>.
// datos protegidos: se conserva el formato y la longitud; solo se ven los primeros y los últimos caracteres
const EXT_CHIP = { mk: 'ds-chip--brand', red: 'ds-chip--info' }; // Marketplace morado, Red ataskate azul
const maskEmail = e => { const [u, d] = e.split('@'), i = d.indexOf('.'); return `${u.slice(0, 2)}${'•'.repeat(Math.max(u.length - 2, 1))}@${d[0]}${'•'.repeat(Math.max(i - 1, 1))}${d.slice(i)}`; };
const maskPhone = p => `${p.slice(0, 2)}${'•'.repeat(Math.max(p.length - 6, 1))}${p.slice(-4)}`;
function extFind(q) {
  const nq = norm(q || '').trim(), dq = (q || '').replace(/\D/g, '');
  if (nq.length < 3) return [];
  return EXT_CLI.filter(x => norm(`${x.name} ${x.last}`).includes(nq) || norm(x.email) === nq || (dq.length >= 4 && x.phone.includes(dq)));
}
// los de Marketplace y Red ataskate van al final de la misma tabla de resultados, con las mismas columnas que Mis clientes:
// su origen y su referencia en la columna Cliente, correo y teléfono protegidos y "Cargar cliente" en lugar de la flecha
function extRows(ext, q, red) {
  return ext.map(x => `<tr class="ext-row">
      <td class="user"><div class="u">${avatar(x)}<div class="tx"><p class="m">${hl(x.name + ' ' + x.last, q)}</p><p class="d ext-d"><span class="ds-chip ${EXT_CHIP[x.src]}">${EXT_SRC[x.src]}</span>${esc(x.ref)}</p></div></div></td>
      <td>${esc(x.nat)}</td>
      <td class="mail" aria-label="Correo protegido">${maskEmail(x.email)}</td>
      <td class="num" aria-label="Teléfono protegido">${maskPhone(x.phone)}</td>
      <td><span class="cap">Sin score</span></td>
      ${red ? `<td>${x.casa ? esc(x.casa) : '<span class="cap">Sin empresa</span>'}</td>` : ''}
      <td class="ext-act"><button type="button" class="ds-btn ds-btn--tertiary ds-btn--md" data-act="extver" data-v="${EXT_CLI.indexOf(x)}" aria-label="Cargar cliente ${esc(x.name + ' ' + x.last)} de ${EXT_SRC[x.src]}">Cargar cliente</button></td></tr>`).join('');
}
function clientsScreen() {
  const c = st.cli, f = cliAllFilters();
  const all = cliBase(), list = cliFilter(all, c.q, f).filter(x => !c.hoy || venceHoy(x));
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE)); if (c.page > pages) c.page = pages;
  const from = (c.page - 1) * PER_PAGE, slice = list.slice(from, from + PER_PAGE);
  const red = c.tab === 'red';
  const venceHoyN = cliBase().filter(venceHoy).length;
  const chips = Object.entries(f).filter(([, v]) => v).map(([k, v]) => `<span class="ds-chip ds-chip--input">${FLABEL[k]}: ${esc(v)}<button type="button" data-act="clirmf" data-v="${k}" aria-label="Quitar filtro ${FLABEL[k]}" class="ds-chip__dismiss">×</button></span>`);
  if (c.hoy) chips.unshift(`<span class="ds-chip ds-chip--input">Contratos que vencen hoy<button type="button" data-act="clihoy" aria-label="Quitar filtro Contratos que vencen hoy" class="ds-chip__dismiss">×</button></span>`);
  if (c.q) chips.unshift(`<span class="ds-chip ds-chip--input">“${esc(c.q)}”<button type="button" data-act="cliclearq" aria-label="Quitar búsqueda" class="ds-chip__dismiss">×</button></span>`);
  const nf = Object.values(c.f).filter(Boolean).length;
  const ncol = red ? 7 : 6;
  const head = `<thead><tr><th>Cliente</th><th>Nacionalidad</th><th>Correo electrónico</th><th>Teléfono</th><th>Score</th>${red ? '<th>Casa de empeño</th>' : ''}<th class="ib"><span class="sr">Acciones</span></th></tr></thead>`;
  const skel = Array.from({ length: Math.min(PER_PAGE, Math.max(3, slice.length)) }, () => `<tr>${Array.from({ length: ncol - 1 }, () => '<td class="load"><span class="ds-skeleton cli-sk"></span></td>').join('')}<td class="ib"></td></tr>`).join('');
  const rowsH = slice.map(x => `<tr class="crow ${x.id === c.fresh ? 'fresh' : ''}" data-act="cliopen" data-v="${x.id}" tabindex="0" aria-label="Ver ${esc(x.name + ' ' + x.last)}">
      <td class="user"><div class="u">${avatar(x)}<div class="tx"><p class="m">${hl(x.name + ' ' + x.last, c.q)}</p><p class="d">${red ? 'NUC en su casa' : 'NUC'}: ${hl(String(x.nuc), c.q)}</p></div></div></td>
      <td>${esc(x.nat)}</td>
      <td class="mail" title="${esc(x.email)}">${hl(x.email, c.q)}</td>
      <td class="num">${hl(x.phone, c.q)}</td>
      <td>${scoreTag(x.score)}</td>
      ${red ? `<td>${x.empresa === '—' ? '<span class="cap">Sin empresa</span>' : esc(x.empresa)}</td>` : ''}
      <td class="ib"><span class="tib">${ICONS.rowRight}</span></td></tr>`).join('');
  // otras fuentes: solo cuando hay búsqueda (y no mientras carga); van al final de los resultados (última página), en la misma tabla.
  // Si no está en ningún lado (sin más filtros) → Limpiar búsqueda / Crear cliente con lo buscado
  const ext = c.q && !c.loading ? extFind(c.q) : [];
  const extH = ext.length && c.page >= pages ? extRows(ext, c.q, red) : '';
  // estados vacíos (ClientsRedesignEmptyState + CLIENTS_EMPTY_TEXTS): ilustración del DS, título, texto y las acciones que aplican
  const hasF = chips.filter(x => !x.includes('cliclearq')).length > 0, onlyQ = !!c.q && !hasF, emptyList = !c.q && !hasF;
  const eTitle = emptyList ? 'Aún no tienes clientes' : onlyQ ? `No encontramos clientes para “${esc(c.q)}”` : c.q ? `No encontramos clientes con estos filtros para “${esc(c.q)}”` : 'No encontramos clientes';
  const eText = emptyList ? 'Registra tu primer cliente para empezar a operar.' : onlyQ ? 'No está en Mis clientes, en el Marketplace ni en la Red ataskate.' : 'Revisa lo que escribiste o quita algunos filtros.';
  const eHref = 'cliente-nuevo.html' + (c.q ? '?nuevo=' + encodeURIComponent(c.q) : '');
  const empty = `<div class="cempty"><img src="assets/ilust-01-empty.svg" alt="" width="150" height="150"><p class="t">${eTitle}</p><p class="cap">${eText}</p><div class="cempty-a">${emptyList ? '' : `<button type="button" class="ds-btn ds-btn--secondary ds-btn--md" data-act="${onlyQ ? 'cliclearq' : 'cliclearall'}">${onlyQ ? 'Limpiar búsqueda' : 'Limpiar búsqueda y filtros'}</button>`}<a class="ds-btn ds-btn--primary ds-btn--md cli-btn-ic" href="${eHref}">${ic('plusWhite')}Crear cliente</a></div></div>`;
  const pager = `<nav class="dpager" aria-label="Paginación"><span class="g"><button data-act="clipage" data-v="1" aria-label="Primera página" ${c.page === 1 ? 'disabled' : ''}>${PG.first}</button><button data-act="clipage" data-v="${c.page - 1}" aria-label="Página anterior" ${c.page === 1 ? 'disabled' : ''}>${PG.prev}</button></span><span class="t">${list.length ? `${from + 1}-${from + slice.length} de ${list.length} resultados` : '0 resultados'}</span><span class="g"><button data-act="clipage" data-v="${c.page + 1}" aria-label="Página siguiente" ${c.page >= pages ? 'disabled' : ''}>${PG.next}</button><button data-act="clipage" data-v="${pages}" aria-label="Última página" ${c.page >= pages ? 'disabled' : ''}>${PG.last}</button></span></nav>`;
  const FIL = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M11 20C10.7167 20 10.4794 19.904 10.288 19.712C10.096 19.5207 10 19.2833 10 19V13L4.20003 5.6C3.95003 5.26667 3.9127 4.91667 4.08803 4.55C4.2627 4.18333 4.5667 4 5.00003 4H19C19.4334 4 19.7377 4.18333 19.913 4.55C20.0877 4.91667 20.05 5.26667 19.8 5.6L14 13V19C14 19.2833 13.9044 19.5207 13.713 19.712C13.521 19.904 13.2834 20 13 20H11ZM12 12.3L16.95 6H7.05003L12 12.3Z" fill="currentColor"/></svg>';
  const AWARD = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M7 2H17V9.85C17 10.2333 16.9167 10.575 16.75 10.875C16.5833 11.175 16.35 11.4167 16.05 11.6L12.5 13.7L13.2 16H17L13.9 18.2L15.1 22L12 19.65L8.9 22L10.1 18.2L7 16H10.8L11.5 13.7L7.95 11.6C7.65 11.4167 7.41667 11.175 7.25 10.875C7.08333 10.575 7 10.2333 7 9.85V2ZM9 4V9.85L11 11.05V4H9ZM15 4H13V11.05L15 9.85V4Z" fill="currentColor"/></svg>';
  const CARET = '<span class="car"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 15L7 10H17L12 15Z" fill="currentColor"/></svg></span>';
  const scoreOpen = st.menu === 'cliscore';
  const scoreSel = `<div class="cli-selw"><button type="button" class="ds-chip ds-chip--filter cli-fchip ${c.score ? 'ds-chip--on' : ''} ${scoreOpen ? 'open' : ''}" data-act="menu" data-id="cliscore" aria-haspopup="listbox" aria-expanded="${scoreOpen}">${c.score ? '' : AWARD}<span>${c.score ? esc(c.score) : 'Score'}</span>${CARET}</button>${scoreOpen ? `<div class="ddl-menu cli-chipmenu" role="listbox">${SCORES.map(o => `<button type="button" role="option" aria-selected="${o === c.score}" class="${o === c.score ? 'on' : ''}" data-act="cliscore" data-v="${o === c.score ? '' : o}">${o}</button>`).join('')}</div>` : ''}</div>`;
  const count = c.loading ? 'Buscando…' : (c.q || chips.length ? `<b>${list.length}</b> de ${all.length} ${red ? 'contactos' : 'clientes'}${ext.length ? ` · <b>${ext.length}</b> en otras fuentes` : ''}` : `${all.length} ${red ? 'contactos' : 'clientes'}`);
  return `<div class="cli">
    <nav aria-label="Breadcrumb" class="ds-breadcrumb"><ol class="pos-crumbs"><li><a href="../home/" class="ds-breadcrumb__link">Inicio</a><span class="ds-breadcrumb__sep" aria-hidden="true"><img class="pos-crumb-sep" src="../assets/ds/ArrowForwardIos-D4D6D8.svg" alt="" /></span></li><li><span class="ds-breadcrumb__current" aria-current="page">Clientes</span></li></ol></nav>
    <div class="cli-head"><div><h1 class="cli-title">Clientes</h1><p class="cli-sub">Busca clientes registrados o da de alta uno nuevo.</p></div>
      <div class="acts"><a class="ds-btn ds-btn--primary ds-btn--md cli-btn-ic" href="cliente-nuevo.html">${ic('plusWhite')}Crear cliente</a></div></div>
    <div class="ctable">
      ${red ? `<div class="redinfo"><span class="cap" style="font-size:14px">Contactos registrados por otras casas de empeño de la red ataskate. Sus datos se muestran protegidos.</span><span class="ds-chip ds-chip--info">Suscripción activa</span></div>` : ''}
      <div class="ctools cli-tools">
        <div class="ds-field-wrap cli-search"><input class="ds-input" placeholder="Buscar por nombre, NUC, correo o teléfono" aria-label="Buscar clientes" data-in="cliq" data-fk="cliq" value="${esc(c.q)}">${c.q ? `<button type="button" class="ds-field-addon ds-field-addon--right cli-search__btn" data-act="cliclearq" aria-label="Limpiar búsqueda">${X_ICON.replace(/width="\d+" height="\d+"/, 'width="20" height="20"')}</button>` : `<span class="ds-field-addon ds-field-addon--right" aria-hidden="true">${ic('search')}</span>`}</div>
        <div class="tfc-g"><button type="button" class="ds-chip ds-chip--filter cli-fchip ${c.hoy ? 'ds-chip--on' : ''}" data-act="clihoy" aria-pressed="${!!c.hoy}" title="Muestra solo a los clientes que tienen contratos que vencen hoy" aria-label="Clientes con contratos que vencen hoy: ${venceHoyN}">${c.hoy ? '' : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 22q-.825 0-1.412-.587Q3 20.825 3 20V6q0-.825.588-1.412Q4.175 4 5 4h1V2h2v2h8V2h2v2h1q.825 0 1.413.588Q21 5.175 21 6v14q0 .825-.587 1.413Q19.825 22 19 22Zm0-2h14V10H5Zm0-12h14V6H5Zm0 0V6Zm7 6q-.425 0-.712-.288Q11 13.425 11 13t.288-.713Q11.575 12 12 12t.713.287Q13 12.575 13 13t-.287.712Q12.425 14 12 14Zm-4 0q-.425 0-.713-.288Q7 13.425 7 13t.287-.713Q7.575 12 8 12t.713.287Q9 12.575 9 13t-.287.712Q8.425 14 8 14Zm8 0q-.425 0-.712-.288Q15 13.425 15 13t.288-.713Q15.575 12 16 12t.712.287Q17 12.575 17 13t-.288.712Q16.425 14 16 14Zm-4 4q-.425 0-.712-.288Q11 17.425 11 17t.288-.712Q11.575 16 12 16t.713.288Q13 16.575 13 17t-.287.712Q12.425 18 12 18Zm-4 0q-.425 0-.713-.288Q7 17.425 7 17t.287-.712Q7.575 16 8 16t.713.288Q9 16.575 9 17t-.287.712Q8.425 18 8 18Zm8 0q-.425 0-.712-.288Q15 17.425 15 17t.288-.712Q15.575 16 16 16t.712.288Q17 16.575 17 17t-.288.712Q16.425 18 16 18Z" fill="currentColor"/></svg>`}<span>Contratos que vencen hoy</span><span class="ds-tag ds-tag--amarillo">${venceHoyN}</span></button>${scoreSel}
        <button type="button" class="ds-chip ds-chip--filter cli-fchip ${nf ? 'ds-chip--on' : ''} ${c.panel ? 'open' : ''}" data-act="clipanel" aria-haspopup="dialog" aria-expanded="${!!c.panel}">${nf ? '' : FIL}<span>${nf ? `Filtro (${nf})` : 'Filtro'}</span>${CARET}</button></div>
      </div>
      ${chips.length ? `<div class="cmeta"><div class="fl"><span>Filtrado por:</span>${chips.join('')}<button type="button" class="ds-btn ds-btn--tertiary ds-btn--md" data-act="cliclearall">Limpiar todo</button></div><span class="cap" aria-live="polite">${count}</span></div>` : ''}
      <div class="dtw"><table class="ds-table cli-table">${head}<tbody>${c.loading ? skel : (slice.length || extH ? rowsH + extH : `<tr><td class="empty" colspan="${ncol}">${empty}</td></tr>`)}</tbody></table></div>
      ${!list.length && ext.length ? '' : pager}
    </div>
    ${c.panel ? cliPanel() : ''}
  </div>
  ${sesiones()}`;
}
function cliPanel() {
  const d = st.cli.fd; const n = cliFilter(cliBase(), st.cli.q, { ...d, score: d.score || st.cli.score }).length;
  const inp = (k, ph) => `<label class="ds-field"><span class="ds-label">${FLABEL[k]}</span><span class="ds-field-wrap"><input class="ds-input" data-in="clif" data-k="${k}" data-fk="clif-${k}" value="${esc(d[k] || '')}" placeholder="${ph}"></span></label>`;
  const sel = (k, opts) => `<label class="ds-field"><span class="ds-label">${FLABEL[k]}</span><span class="cli-selw"><button type="button" class="ds-field-wrap psel ${st.menu === 'pf-' + k ? 'open' : ''}" data-act="menu" data-id="pf-${k}" aria-haspopup="listbox" aria-expanded="${st.menu === 'pf-' + k}"><span class="${d[k] ? '' : 'ph'}">${esc(d[k] || 'Selecciona')}</span>${DS_CHEV}</button>${st.menu === 'pf-' + k ? `<div class="ddl-menu cli-selmenu" role="listbox">${['', ...opts].map(o => `<button role="option" aria-selected="${o === (d[k] || '')}" class="${o === (d[k] || '') ? 'on' : ''}" data-act="clifsel" data-k="${k}" data-v="${o}">${o || 'Todos'}</button>`).join('')}</div>` : ''}</span></label>`;
  return `<div class="side-ov" data-act="clipanelx"></div><aside class="side" role="dialog" aria-label="Filtrar clientes">
    <div class="side-h"><h2>Filtrar</h2><button type="button" class="ds-btn ds-btn--tertiary ds-btn--icon-md side-x" data-act="clipanelx" aria-label="Cerrar">${ICONS.close.replace('style="fill:var(--ats-primary-300)"', 'style="fill:var(--ats-neutral-700)"')}</button></div><button type="button" class="ds-btn ds-btn--tertiary ds-btn--md side-clear" data-act="clifclear">Limpiar filtros</button>
    <div class="side-b">${inp('nuc', 'Ej. 1129')}${inp('nombre', 'Nombre o apellido')}${sel('nat', NATS)}${inp('correo', 'correo@ejemplo.com')}${inp('tel', '10 dígitos')}${sel('score', SCORES)}</div>
    <div class="side-f"><button type="button" class="ds-btn ds-btn--tertiary ds-btn--md" data-act="clipanelx">Cancelar</button><button type="button" class="ds-btn ds-btn--primary ds-btn--md" data-act="cliapply" ${n ? '' : 'disabled'}>${n ? `Ver ${n} resultado${n === 1 ? '' : 's'}` : 'Sin resultados'}</button></div>
  </aside>`;
}

// ---------- PERFIL DE CLIENTE (src/components/ClientsRedesign/Profile/*, rama del equipo hasta 3e2d19b99) ----------
// Encabezado con foto, contacto y tres chips (Saldo por pagar, Saldo pagado, Información personal) que abren su modal; menú de acciones
// (editar / dar de baja, también por registro duplicado / reportar); acciones rápidas; operaciones en tabs sobre la página (Transacciones,
// Órdenes, Contratos de empeño) con buscador, "Filtrar por", calendario de vencimiento, detalle de transacción en modal y detalle del contrato.
// "Editar" lleva a cliente-nuevo.html?editar=<id> (su /Directory/<id>/editar). Los datos vienen de perfil-datos.js.
const PT = {
  BREADCRUMB_HOME: 'Inicio', BREADCRUMB_CLIENTS: 'Clientes', TITLE: 'Perfil de cliente', NUC: 'NUC', NEW_CLIENT_SCORE: 'Cliente nuevo',
  MARKETPLACE_ALERT_TITLE: 'Cliente del Marketplace ataskate', MARKETPLACE_ALERT_TEXT: 'Solo se muestran sus datos de contacto y sus órdenes del Marketplace.',
  QUICK_TITLE: 'Acciones rápidas', QUICK_DUE: d => `Vencimiento: ${d}`, QUICK_RENEWAL: 'Refrendo', QUICK_REDEMPTION: 'Desempeño', QUICK_ARTICLES: 'Prendas', QUICK_RENEW: 'Refrendar', QUICK_REDEEM: 'Desempeñar',
  QUICK_ADDED: 'Se agregó al carrito', QUICK_REACTIVATE: 'Reactivar', QUICK_REACTIVATION: 'Reactivación', QUICK_LATE_FEES: 'Se cobrarán cargos moratorios.',
  LABOR_TITLE: 'Información laboral', ID_TITLE: 'Identificación oficial', PROOFS_TITLE: 'Comprobantes', WITH_FILE: 'Con archivo', WITHOUT_FILE: 'Sin archivo', VALID: 'Vigente', EXPIRED: 'Vencida',
  FINGERPRINTS_COUNT: n => `${n} de 10 huellas registradas`, IDENTITY_TITLE: 'Identidad', SITUATION_TITLE: 'Situación personal', ADDRESS_TITLE: 'Domicilio', PEOPLE_TITLE: 'Personas registradas', FINGERPRINTS_TITLE: 'Huellas registradas',
  CLEAR_SEARCH: 'Limpiar búsqueda', NOT_FOUND_TITLE: 'No encontramos este cliente', NOT_FOUND_TEXT: 'Puede que el enlace sea incorrecto o que el cliente ya no exista.', BACK_TO_LIST: 'Ir a Clientes',
};
const PH = {
  DEBT: 'Saldo por pagar', INCOME: 'Saldo pagado', CLOSE: 'Cerrar', EDIT_CLIENT: 'Editar cliente',
  LEAVE_TITLE: 'Vas a salir del perfil', LEAVE_TEXT: n => `Para editar los datos de ${n} te llevamos a la pantalla de edición. Al guardar, regresas a este perfil.`, LEAVE_CONFIRM: 'Ir a editar',
  INFO: 'Información personal', ACTIONS: 'Acciones del cliente', ID_VALID: 'Vigente', ID_EXPIRED: 'Vencida',
  DEACTIVATED_TITLE: 'Cliente dado de baja', DEACTIVATED_TEXT: 'Este cliente ya no está activo en tu casa de empeño.', DEACTIVATE_TITLE: 'Dar de baja cliente',
  DEACTIVATE_TEXT: n => `Vas a dar de baja a ${n}. Revisa antes que no tenga contratos ni apartados vigentes.`, DEACTIVATE_REASON: 'Motivo de la baja', DEACTIVATE_CONFIRM: 'Dar de baja', DEACTIVATED_TOAST: 'Cliente dado de baja',
  REPORT_TITLE: 'Reportar cliente', REPORT_TEXT: n => `El reporte de ${n} se envía al área de prevención para su revisión.`, REPORT_REASON: 'Motivo del reporte', REPORT_DETAIL: 'Describe lo que pasó',
  REPORT_DETAIL_PLACEHOLDER: 'Ej. Presentó una identificación que no coincide con sus datos.', REPORT_CONFIRM: 'Enviar reporte', REPORT_TOAST: 'Reporte enviado', REQUIRED: 'Este dato es obligatorio.', SELECT: 'Selecciona', CANCEL: 'Cancelar',
};
/* Baja por registro duplicado (profileMerge.ts, 15c423c26) */
const MERGE = {
  INTRO: n => `Vas a dar de baja a ${n} por registro duplicado.`, TARGET_LABEL: 'Cliente que se queda', TARGET_PLACEHOLDER: 'Busca por nombre o NUC',
  TARGET_HINT: n => `Elige el registro correcto. Le pasamos todo lo de ${n} y este registro se da de baja.`, TARGET_REQUIRED: 'Elige el cliente que se queda.', SUMMARY_TITLE: 'Se va a transferir',
  NOTHING: 'Este registro no tiene movimientos; solo se dará de baja.', WARNING_TITLE: 'Esta acción no se puede deshacer',
  WARNING_TEXT: (a, b) => `El historial de ${a} quedará en el perfil de ${b}. Los contratos conservan su número.`, CONFIRM: 'Confirmo que ambos registros son la misma persona',
  CONFIRM_REQUIRED: 'Confirma que son la misma persona.', SUBMIT: 'Transferir y dar de baja', DONE_TOAST: b => `Movimientos transferidos a ${b}`,
  DONE_TEXT: b => `Registro duplicado. Sus movimientos ahora están en el perfil de ${b}.`, VIEW_TARGET: b => `Ver perfil de ${b}`, EMPTY: 'Sin coincidencias',
};
/* Desglose de saldos (profileDebt.ts y profilePaid.ts, 7e426b821) */
const DEBT_T = {
  TOTAL_LABEL: 'Total para liquidar hoy en esta casa', TOTAL_HINT: 'Empeños al monto de desempeño y apartados por lo que falta abonar.', PAWNS: 'Empeños', LAYAWAYS: 'Apartados',
  PAWN_SUB: n => `${n} ${n === 1 ? 'contrato activo' : 'contratos activos'} · monto de desempeño`, LAYAWAY_SUB: n => `${n} ${n === 1 ? 'apartado activo' : 'apartados activos'} · lo que falta abonar`,
  OTHER_TITLE: 'También debe en otras casas de empeño', OTHER_TEXT: a => `${a} adicionales. No se incluyen en el total porque se pagan en esa casa.`, EMPTY: 'El cliente no tiene saldos pendientes en esta casa.',
};
const PAID_T = {
  TOTAL_LABEL: 'Saldo pagado', TOTAL_HINT: p => `Pagos a empeños y apartados que siguen abiertos, más lo pagado en ${p}. Lo que se liquidó en meses anteriores ya no aparece.`,
  EMPTY: 'El cliente no tiene pagos en operaciones abiertas ni en este mes.', PURCHASES: 'Compras',
  PAWN_SUB: n => `${n} ${n === 1 ? 'pago' : 'pagos'} · refrendos, abonos y desempeños`, LAYAWAY_SUB: n => `${n} ${n === 1 ? 'pago' : 'pagos'} · apartados y abonos`, PURCHASE_SUB: n => `${n} ${n === 1 ? 'compra' : 'compras'} · pagadas este mes`,
};
/* Operaciones (profileOperations.ts y profileContracts.ts) */
const OPS = {
  SEARCH_TX: 'Buscar por número, operación o método de pago', SEARCH_ORD: 'Buscar por número de orden o artículo', FILTER: 'Filtrar por', DETAILS: 'Detalles', CASH: 'Efectivo', TRANSFER: 'Transferencia',
  EMPTY_TITLE: 'Sin resultados', EMPTY_TEXT: 'Revisa lo que escribiste o quita el filtro.', NONE_TITLE: 'Sin operaciones', NONE_TEXT: 'Cuando el cliente haga una operación, aparecerá aquí.',
  FILTER_STATUS: 'Estado del contrato', ROW_ACTIONS: f => `Opciones del contrato ${f}`, CT_EMPTY: 'No hay contratos disponibles.', CT_EMPTY_FILTER: 'No hay contratos con estos filtros.', ACTION_DONE: 'Acción registrada',
  ARTICLE_COUNT: n => (n === 1 ? '1 artículo' : `${n} artículos`),
};
const CAL_T = { TRIGGER: 'Vencimiento', RANGE: 'Rango', APPLY: 'Aplicar', CLEAR: 'Limpiar selección', CANCEL: 'Cancelar', CONTINUE: 'Continuar', DAY_HINT: 'Elige un día de vencimiento.', MONTH: 'Mes', YEAR: 'Año' };
/* Detalle de la transacción (transactionDetail.ts, 92f7ebdf5) */
const TXD = {
  TITLE: 'Detalle de transacción', NUMBER: 'No. transacción', DATE: 'Fecha de pago', AMOUNT: 'Monto del pago', ARTICLES: 'Artículos', COLS: ['Tipo', 'Estado', 'Empresa', 'Tipo de operación', 'Método de pago'],
  DOWNLOAD: 'Descargar comprobante', DOWNLOAD_TOAST: 'Descargando comprobante', BREAKDOWN: 'Desglose del pago', RECORD: 'Registro del pago', BRANCH: 'Sucursal', CASHIER: 'Atendió', TIME: 'Hora',
};
const TX_ALERT = { Devolución: ['info', 'Pago devuelto', 'El monto se regresó al cliente con el mismo método de pago.'], Incidencia: ['warning', 'Pago con incidencia', 'Hay una incidencia abierta; revísala antes de volver a cobrar.'], Pendiente: ['warning', 'Pago pendiente', 'El pago aún no se confirma con el banco.'] };
/* Detalle del contrato (ContractDetail/contractDetail.constants.ts, 496bbf842) */
const CTD = {
  BREADCRUMB_PROFILE: 'Perfil de cliente', BREADCRUMB_DETAIL: 'Detalle del contrato', TITLE: 'Detalle del contrato de empeño', FOLIO: 'No. contrato:', STATUS: 'Estado de contrato:', DUE: 'Fecha de vencimiento:', DISCHARGED: 'Fecha de desempeño:',
  MORE: 'Más opciones del contrato', NOT_FOUND_TITLE: 'No encontramos este contrato', NOT_FOUND_TEXT: 'Puede que el número de contrato haya cambiado o ya no pertenezca al cliente.', BACK_TO_PROFILE: 'Volver al perfil',
  CLIENT_TITLE: 'Datos del cliente', SCORE: 'Calificación:', EMAIL: 'Correo:', PHONE: 'Tel:', ADDRESS: 'Domicilio:', SUMMARY_TITLE: 'Resumen inicial del empeño',
  ARTICLES_TITLE: 'Lista de artículos', ARTICLES: 'Artículos', DEADLINE: d => `Fecha límite: ${d}`, EXPIRED_SINCE: d => `Venció el ${d}`, LATE_FEES: 'Al reactivar se cobrarán cargos moratorios.',
  SKU: 'SKU:', APPRAISAL: 'Avalúo:', LOAN: 'Préstamo:', NOTES: 'Notas', NOTES_TITLE: a => `Notas de ${a}`,
};
const CT_TABS = [['detalle', 'Detalle del empeño'], ['personas', 'Beneficiario y cotitular'], ['transacciones', 'Transacciones'], ['amortizacion', 'Tabla de amortización']];
const CT_MENU = { extend: 'Extender', print: 'Imprimir contrato', email: 'Enviar contrato por correo' };
const CT_ACTION_LABEL = { detail: 'Ver detalle', discharge: 'Desempeñar', renew: 'Refrendar', extend: 'Extender', payment: 'Abonar', reactivate: 'Reactivar', incident: 'Activar incidencia' };
const CT_ROW_ACTIONS = { 'Próximo pago': ['detail', 'discharge', 'renew', 'extend', 'payment'], 'Por vencer': ['detail', 'discharge', 'renew', 'extend', 'payment'], Vencido: ['detail', 'reactivate', 'incident'], Desempeñado: ['detail'] };
const CT_MAIN_ACTIONS = { 'Próximo pago': ['discharge', 'renew', 'payment'], 'Por vencer': ['discharge', 'renew', 'payment'], Vencido: ['reactivate', 'incident'], Desempeñado: [] };
const CT_STATUSES = ['Por vencer', 'Próximo pago', 'Vencido', 'Desempeñado'];

const PF_ACTION_LABEL = { edit: 'Editar cliente', deactivate: 'Dar de baja cliente', report: 'Reportar cliente' };
/* El cliente de marketplace no es de la casa de empeño: no se edita ni se da de baja */
const PF_ACTIONS = { empeno: ['edit', 'deactivate', 'report'], venta: ['edit', 'deactivate', 'report'], marketplace: ['report'] };
const PF_DEACTIVATE_REASONS = ['Lo solicitó el cliente', 'Registro duplicado', 'Fallecimiento', 'Otro motivo'];
const PF_DUPLICATE = 'Registro duplicado';
const PF_REPORT_REASONS = ['Documentos falsos o alterados', 'Prenda con reporte de robo', 'Conducta sospechosa o agresiva', 'Otro motivo'];
const PF_TYPE_LABEL = { empeno: 'Cliente de empeño', venta: 'Cliente de venta', marketplace: 'Marketplace' };
const PF_TYPE_CHIP = { empeno: 'ds-chip--info', venta: 'ds-chip--info', marketplace: 'ds-chip--brand' }; // DS Chip informativo
const PF_INFO_TAB_LABEL = { personal: 'Datos personales', direccion: 'Dirección', ident: 'Identificación', cotitulares: 'Cotitulares y beneficiarios', huellas: 'Huellas' };
/* Secciones que aplican a cada tipo; son las mismas que pide Cliente nuevo (MODE_SECTIONS) */
const PF_INFO_TABS = { empeno: ['personal', 'direccion', 'ident', 'cotitulares', 'huellas'], venta: ['direccion'], marketplace: [] };
/* Lo que puede editar cada tipo de cliente: venta solo captura contacto y dirección; los datos del Marketplace los administra el cliente */
const PF_EDITABLE = { empeno: ['contacto', 'personal', 'direccion', 'ident', 'cotitulares', 'huellas'], venta: ['contacto', 'direccion'], marketplace: [] };
const pfCanEdit = (type, section) => PF_EDITABLE[type].includes(section);
/* 22d8186fc: Transacciones primero; Órdenes en empeño solo si ha comprado */
const PF_OP_TABS = { empeno: ['transacciones', 'ordenes', 'contratos'], venta: ['transacciones', 'ordenes'], marketplace: ['ordenes'] };
const PF_OP_TAB_LABEL = { contratos: 'Contratos de empeño', transacciones: 'Transacciones', ordenes: 'Órdenes' };
const pfOpTabs = c => PF_OP_TABS[c.type].filter(t => t !== 'ordenes' || c.type !== 'empeno' || ((c.operations || {}).ordenes || []).length > 0);
/* Chips de estado (status-* del DS → ds-tag) */
const ST_CONTRACT = { 'Próximo pago': 'purple', 'Por vencer': 'yellow', Vencido: 'red', Desempeñado: 'gray' };
const ST_TX = { Pagado: 'green', Pendiente: 'yellow', Devolución: 'purple', Incidencia: 'pink' };
const ST_ORDER = { Entregado: 'green', 'En camino': 'blue', Pendiente: 'yellow', Cancelado: 'gray' };
const ST_LAYAWAY = { 'Al corriente': 'green', 'Por vencer': 'yellow', Vencido: 'red' };
const ST_AMORT = { Pagado: 'green', 'Por pagar': 'yellow', Vencido: 'red' };
const PF_SCORE_CHIP = { Excelente: 'green', Bueno: 'blue', Regular: 'purple' };
const PF_PAGE = 8;
const pfChip = dsTag;
/* Paleta de "Chart-bar" del DS (CHART_COLORS): verde, morado claro, azul */
const CHART_COLORS = ['var(--ats-success-green-200)', 'var(--ats-primary-200)', 'var(--ats-info-blue-200)'];
const CARD_BRAND = { amex: 'Amex', visa: 'Visa', mastercard: 'MasterCard' };

function newOpState() { return { q: '', est: '', page: 1 }; }
function newProf(id) {
  return { id, detail: null, open: [], itab: null, otab: null, dlg: null, tx: newOpState(), ord: newOpState(), ctr: { est: '', due: null, page: 1 }, cal: null,
    deactivated: false, merged: null, editSection: undefined, dReason: '', dTarget: '', dQuery: '', dSure: false, dTried: false, rReason: '', rDetail: '', rTried: false };
}
function newCt(id, folio) { return { id, folio, tab: 'detalle', notes: null, tx: newOpState() }; }
st.ct = null; // detalle del contrato abierto (#perfil/<id>/contrato/<folio>)
st.txRow = null; // transacción abierta en el modal "Detalle de transacción"

const pfFields = a => a.filter(([, v]) => v && String(v).trim()).map(([label, value]) => ({ label, value }));
const pfIdentity = c => pfFields([['Fecha de nacimiento', c.personal?.birthDate], ['Nacionalidad', c.personal?.nationality], ['CURP', c.personal?.curp], ['R.F.C', c.personal?.rfc]]);
const pfSituation = c => pfFields([['Estado civil', c.personal?.civil], ['Género', c.personal?.gender], ['Actividad económica', c.personal?.activity]]);
const pfPersonal = c => pfFields([['Fecha de nacimiento', c.personal?.birthDate], ['Nacionalidad', c.personal?.nationality], ['Estado civil', c.personal?.civil], ['Género', c.personal?.gender], ['CURP', c.personal?.curp], ['R.F.C', c.personal?.rfc], ['Actividad económica', c.personal?.activity]]);
const pfLabor = c => pfFields([['Situación laboral', c.labor?.status], ['Empresa', c.labor?.company], ['Puesto', c.labor?.position], ['Antigüedad', c.labor?.seniority], ['Ingreso mensual', c.labor?.monthlyIncome ? formatMXN(c.labor.monthlyIncome) : ''], ['Teléfono de la empresa', c.labor?.companyPhone ? formatPhone(c.labor.companyPhone) : '']]);
const pfAddress = c => { const a = c.address; if (!a) return []; const street = [a.street, a.exterior].filter(Boolean).join(' '); return pfFields([['Calle y número', [street, a.interior].filter(Boolean).join(', ')], ['Colonia', a.colony], ['Municipio o alcaldía', a.municipality], ['Estado', a.state], ['Código postal', a.postalCode]]); };
const pfFile = has => has ? PT.WITH_FILE : PT.WITHOUT_FILE;
const pfIdent = c => { const i = c.identification; return i ? pfFields([['Tipo de identificación', i.type], ['Número de identificación', i.number], ['Fecha de expedición', i.issuedAt], ['Frente de la identificación', pfFile(i.hasFront)], ['Reverso de la identificación', pfFile(i.hasBack)]]) : []; };
const pfProofs = c => pfFields([['Comprobante de domicilio', c.addressProof?.type], ['Vigencia del comprobante', c.addressProof?.validUntil], ['Comprobante de ingresos', c.incomeProof?.type]]);
const PF_TAB_HAS = { personal: c => pfPersonal(c).length > 0 || pfLabor(c).length > 0, direccion: c => pfAddress(c).length > 0, ident: c => pfIdent(c).length > 0 || pfProofs(c).length > 0, cotitulares: c => !!(c.cotitulares && c.cotitulares.length), huellas: c => !!(c.fingerprints && c.fingerprints.length) };
/* Tabs de información que aplican al tipo de cliente y que tienen datos */
const pfInfoTabs = c => PF_INFO_TABS[c.type].filter(t => PF_TAB_HAS[t](c));
/* "Pulgar derecho" → { 'Mano derecha': ['Pulgar'] }; mismo acomodo que en Cliente nuevo */
const pfPrintGroups = prints => [['derecho', 'Mano derecha'], ['izquierdo', 'Mano izquierda']].map(([s, hand]) => ({ hand, fingers: prints.filter(p => p.endsWith(' ' + s)).map(p => p.slice(0, -(s.length + 1))) })).filter(g => g.fingers.length);
const pfIc = (n, s = 20) => CI(n, s);
const articleSummary = arts => { const [f, ...rest] = arts; return f ? (rest.length ? `${f.name} y ${rest.length} más` : f.name) : ''; };
const methodText = m => m.kind === 'card' ? `${CARD_BRAND[m.brand]} ${m.last4}` : m.kind === 'cash' ? OPS.CASH : OPS.TRANSFER;
const contractHref = (c, folio) => (c.pawnContracts || []).some(k => k.folio === folio) ? `#perfil/${encodeURIComponent(c.id)}/contrato/${encodeURIComponent(folio)}` : '';

/* ---------- piezas compartidas ---------- */
/* Número de contrato con estilo de hipervínculo (ContractFolio): con detalle es un enlace, si no, texto */
const pfFolio = (c, folio, tag = 'span') => { const h = c && contractHref(c, folio); return h ? `<a class="pr-folio" href="${h}"><${tag} class="pr-folio__t">${esc(folio)}</${tag}></a>` : `<${tag} class="pr-folio__t">${esc(folio)}</${tag}>`; };
/* DS TableCell type="articulo": foto, nombre y descripción */
const pfArtCell = (photo, name, desc) => `<div class="pr-art">${photo ? `<img src="${esc(photo)}" alt="" width="40" height="40" loading="lazy">` : ''}<span class="tx"><span class="m">${esc(name)}</span>${desc ? `<span class="d">${esc(desc)}</span>` : ''}</span></div>`;
/* Método de pago: logo de la tarjeta (DS CreditCard) + últimos 4 y marca; efectivo y transferencia solo con texto */
const pfPay = m => m.kind !== 'card' ? esc(m.kind === 'cash' ? OPS.CASH : OPS.TRANSFER) : `<span class="pr-pay"><span class="pr-cc"><img src="assets/tarjetas/${m.brand}.svg" alt="" width="24" height="24"></span><span class="tx"><span>****${esc(m.last4)}</span><small>${CARD_BRAND[m.brand]}</small></span></span>`;
const pfPager = (total, page, act, k) => {
  if (total <= PF_PAGE) return '';
  const pages = Math.ceil(total / PF_PAGE), from = (page - 1) * PF_PAGE, to = Math.min(total, from + PF_PAGE);
  const b = (p, label, icon, dis) => `<button type="button" data-act="${act}" data-k="${k}" data-v="${p}" aria-label="${label}" ${dis ? 'disabled' : ''}>${icon}</button>`;
  return `<nav class="dpager" aria-label="Paginación"><span class="g">${b(1, 'Primera página', PG.first, page === 1)}${b(page - 1, 'Página anterior', PG.prev, page === 1)}</span><span class="t">${from + 1}-${to} de ${total} resultados</span><span class="g">${b(page + 1, 'Página siguiente', PG.next, page >= pages)}${b(pages, 'Última página', PG.last, page >= pages)}</span></nav>`;
};
/* DS TableFilterChip: botón con ícono, etiqueta (o la opción elegida) y flecha; la lista sale abajo a la derecha */
function pfFilterChip(id, label, opts, value, act, k) {
  const open = st.menu === id;
  return `<div class="pr-fchip"><button type="button" class="pr-fchip__btn ${value || open ? 'is-on' : ''}" data-act="menu" data-id="${id}" aria-haspopup="listbox" aria-expanded="${open}">${pfIc('FilterAlt')}<span>${esc(value || label)}</span><span class="pr-fchip__arrow">${pfIc('ArrowDropDown')}</span></button>${open ? `<div class="pr-fchip__menu" role="listbox" aria-label="${esc(label)}">${opts.map(o => `<button type="button" role="option" class="pr-fchip__opt" aria-selected="${o === value}" data-act="${act}" data-k="${k}" data-v="${o === value ? '' : esc(o)}">${esc(o)}</button>`).join('')}</div>` : ''}</div>`;
}
/* DS Search (Default): caja redonda con lupa; con texto, la lupa cambia por "Limpiar búsqueda" (d778f04ca) */
const pfSearch = (k, value, placeholder) => `<div class="ds-field-wrap cli-search pr-search"><input class="ds-input" type="search" placeholder="${esc(placeholder)}" aria-label="${esc(placeholder)}" data-in="opq" data-k="${k}" data-fk="opq-${k}" value="${esc(value)}">${value ? `<button type="button" class="ds-field-addon ds-field-addon--right cli-search__btn" data-act="opq0" data-k="${k}" aria-label="${PT.CLEAR_SEARCH}">${X_ICON.replace(/width="\d+" height="\d+"/, 'width="20" height="20"')}</button>` : `<span class="ds-field-addon ds-field-addon--right" aria-hidden="true">${ic('search')}</span>`}</div>`;
const pfEmpty = filtered => `<div class="cempty pr-empty"><img src="assets/ilust-01-empty.svg" alt="" width="150" height="150"><p class="t pr-b">${filtered ? OPS.EMPTY_TITLE : OPS.NONE_TITLE}</p><p class="cap">${filtered ? OPS.EMPTY_TEXT : OPS.NONE_TEXT}</p></div>`;
const pfTable = (head, body, cls = '') => `<div class="pr-tablew"><table class="ds-table cli-table pr-table ${cls}"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
const pfBar = segs => { const sum = segs.reduce((a, s) => a + s.value, 0); return `<div class="pr-bar" role="img" aria-label="${esc(segs.map(s => s.label).join(', '))}">${segs.map(s => `<span style="width:${(s.value / sum * 100).toFixed(2)}%;background:${s.color}" title="${esc(s.label)}"></span>`).join('')}</div><ul class="pr-legend">${segs.map(s => `<li><span class="dot" style="background:${s.color}" aria-hidden="true"></span>${esc(s.label)}</li>`).join('')}</ul>`; };
const opState = k => (k === 'ctx' ? st.ct.tx : st.prof[k]);

/* ---------- Información personal (modal ancho) ---------- */
function pfFieldGrid(fields) { return `<dl class="pr-fields">${fields.map(f => `<div class="pr-f"><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join('')}</dl>`; }
function pfSection(title, fields, aside) { return fields.length ? `<section class="pr-isec"><div class="pr-sh"><h3>${esc(title)}</h3>${aside || ''}</div>${pfFieldGrid(fields)}</section>` : ''; }
const pfPeople = c => `<div class="pr-igroup"><div class="pr-sh"><h3>${PT.PEOPLE_TITLE}</h3></div>${(c.cotitulares || []).map(p => `<div class="pr-item"><span class="ds-avatar ds-avatar--md cli-av" aria-hidden="true">${esc(getInitials(p.name, p.lastName))}</span><span class="tx"><b>${esc(fullName(p))}</b><small>${esc([p.role, p.relationship, p.phone && formatPhone(p.phone)].filter(Boolean).join(' · '))}</small></span></div>`).join('')}</div>`;
function pfInfoPanel(c, tab) {
  if (tab === 'personal') return `<div class="pr-ibody">${pfSection(PT.IDENTITY_TITLE, pfIdentity(c))}${pfSection(PT.SITUATION_TITLE, pfSituation(c))}${pfSection(PT.LABOR_TITLE, pfLabor(c))}</div>`;
  if (tab === 'direccion') return `<div class="pr-ibody">${pfSection((c.address && c.address.name) || PT.ADDRESS_TITLE, pfAddress(c))}</div>`;
  if (tab === 'ident') {
    const i = c.identification, vig = i && i.validUntil ? pfChip(`${i.expired ? PT.EXPIRED : PT.VALID} · ${i.validUntil}`, i.expired ? 'red' : 'green') : '';
    return `<div class="pr-ibody">${pfSection(PT.ID_TITLE, pfIdent(c), vig)}${pfSection(PT.PROOFS_TITLE, pfProofs(c))}</div>`;
  }
  if (tab === 'cotitulares') return pfPeople(c);
  const prints = c.fingerprints || [];
  return `<div class="pr-ibody"><div class="pr-sh"><h3>${PT.FINGERPRINTS_TITLE}</h3><span class="ds-chip">${PT.FINGERPRINTS_COUNT(prints.length)}</span></div>${pfPrintGroups(prints).map(g => `<div class="pr-igroup"><h4>${g.hand}</h4><div class="pr-chips">${g.fingers.map(f => `<span class="ds-chip ds-chip--choice ds-chip--on pr-fp">${pfIc('Fingerprint', 20)}${esc(f)}</span>`).join('')}</div></div>`).join('')}</div>`;
}
function pfInfo(c) {
  const tabs = pfInfoTabs(c), p = st.prof; if (!tabs.length) return '';
  const cur = tabs.includes(p.itab) ? p.itab : tabs[0];
  const bar = tabs.length > 1 ? `<div class="pr-stick"><div class="ds-tabs__list cli-tabs" role="tablist">${tabs.map(t => `<button type="button" role="tab" class="ds-tabs__tab" aria-selected="${t === cur}" data-act="pfitab" data-v="${t}">${PF_INFO_TAB_LABEL[t]}</button>`).join('')}</div></div>` : '';
  return `<div class="pr-ibody">${bar}<div ${tabs.length > 1 ? 'role="tabpanel"' : ''}>${pfInfoPanel(c, cur)}</div></div>`;
}

/* ---------- Saldo por pagar / Saldo pagado: total, barra por concepto y una GroupCard del DS por concepto ---------- */
function pfGroup(id, title, amount, sub, body) {
  const open = st.prof.open.includes(id);
  return `<div class="pr-gc ${open ? 'is-open' : ''}"><div class="pr-gc__head" role="button" tabindex="0" aria-expanded="${open}" data-act="pfgroup" data-v="${id}"><span class="pr-gc__chev" aria-hidden="true">${pfIc('ChevronDown')}</span><span class="pr-gc__tx"><span class="pr-gc__title"><span>${esc(title)}</span><b>${formatMXN(amount)}</b></span><span class="pr-gc__sub">${esc(sub)}</span></span></div>${open ? `<div class="pr-gc__body">${body}</div>` : ''}</div>`;
}
const pfTotalBox = (label, total, hint, segs) => `<div class="pr-total"><span class="lbl">${esc(label)}</span><p class="amt">${formatMXN(total)}</p><p class="hint">${esc(hint)}</p>${segs.length > 1 ? pfBar(segs) : ''}</div>`;
function pfDebt(c) {
  const d = getDebtBreakdown(c);
  const pawnRows = d.pawns.map(k => `<tr><td>${pfFolio(c, k.folio)}</td><td>${pfArtCell(k.articles[0] && k.articles[0].photo, articleSummary(k.articles), OPS.ARTICLE_COUNT(k.articles.length))}</td><td class="nw">${esc(k.dueDate)}</td><td class="pr-stc">${pfChip(k.status, ST_CONTRACT[k.status])}</td><td class="r"><b>${formatMXN(k.redemption)}</b></td></tr>`).join('');
  const layRows = d.layaways.map(l => `<tr><td>${pfArtCell(l.article.photo, l.article.name, l.folio)}</td><td class="nw">${esc(l.dueDate)}</td><td class="pr-stc">${pfChip(l.status, ST_LAYAWAY[l.status])}</td><td class="r">${formatMXN(l.total)}</td><td class="r">${formatMXN(l.paid)}</td><td class="r"><b>${formatMXN(layawayPending(l))}</b></td></tr>`).join('');
  const groups = [
    { id: 'pawn', title: DEBT_T.PAWNS, sub: DEBT_T.PAWN_SUB(d.pawns.length), amount: d.amounts.pawn, table: pfTable(`<th>No. contrato</th><th>Artículos</th><th>Vencimiento</th><th class="pr-stc">Estado</th><th class="r am">Desempeño</th>`, pawnRows) },
    { id: 'layaway', title: DEBT_T.LAYAWAYS, sub: DEBT_T.LAYAWAY_SUB(d.layaways.length), amount: d.amounts.layaway, table: pfTable(`<th>Artículo</th><th>Fecha límite</th><th class="pr-stc">Estado</th><th class="r am">Precio</th><th class="r am">Abonado</th><th class="r am">Falta</th>`, layRows) },
  ].map((g, i) => ({ ...g, color: CHART_COLORS[i] })).filter(g => g.amount > 0);
  const other = c.summary && c.summary.otherHousesDebt, otherTotal = other ? sumAmounts(other) : 0;
  return `<div class="pr-debt">${pfTotalBox(DEBT_T.TOTAL_LABEL, d.total, groups.length ? DEBT_T.TOTAL_HINT : DEBT_T.EMPTY, groups.map(g => ({ value: g.amount, color: g.color, label: g.title })))}
    <div class="pr-groups">${groups.map(g => pfGroup(g.id, g.title, g.amount, g.sub, g.table)).join('')}</div>
    ${otherTotal > 0 ? pfAlert('info', DEBT_T.OTHER_TITLE, DEBT_T.OTHER_TEXT(formatMXN(otherTotal))) : ''}</div>`;
}
function pfPaid(c) {
  const d = getPaidBreakdown(c);
  const table = rows => pfTable(`<th>Fecha</th><th>No. transacción</th><th>Referencia</th><th>Concepto</th><th>Método de pago</th><th class="r am">Monto</th>`, rows.map(r => { const ref = getTransactionDetail(r).reference; return `<tr><td class="nw">${esc(r.date)}</td><td>${esc(r.number)}</td><td class="nw">${ref.startsWith('EMP-') ? pfFolio(c, ref) : esc(ref)}</td><td>${esc(r.operation)}</td><td>${pfPay(r.method)}</td><td class="r"><b>${formatMXN(r.amount)}</b></td></tr>`; }).join(''));
  const groups = [['pawn', DEBT_T.PAWNS, PAID_T.PAWN_SUB], ['layaway', DEBT_T.LAYAWAYS, PAID_T.LAYAWAY_SUB], ['purchase', PAID_T.PURCHASES, PAID_T.PURCHASE_SUB]]
    .map(([id, title, sub], i) => ({ id: 'p-' + id, title, sub: sub(d.groups[id].length), amount: d.amounts[id], rows: d.groups[id], color: CHART_COLORS[i] })).filter(g => g.amount > 0);
  return `<div class="pr-debt">${pfTotalBox(PAID_T.TOTAL_LABEL, d.total, groups.length ? PAID_T.TOTAL_HINT(d.period) : PAID_T.EMPTY, groups.map(g => ({ value: g.amount, color: g.color, label: g.title })))}
    <div class="pr-groups">${groups.map(g => pfGroup(g.id, g.title, g.amount, g.sub, table(g.rows))).join('')}</div></div>`;
}
const X_ICON = ICONS.close.replace('style="fill:var(--ats-primary-300)"', 'fill="currentColor"');
const dsModalShell = (id, title, body, footer, cls, extra = '') => `<div class="ds-modal-overlay cli-ov" data-act="mbg"><div class="ds-modal cli-modal ${cls || ''}" role="dialog" aria-modal="true" aria-labelledby="${id}T" data-stop="1" ${extra}>
    <div class="ds-modal__header"><h2 class="ds-modal__title" id="${id}T">${esc(title)}</h2><button type="button" class="ds-btn ds-btn--tertiary ds-btn--icon-md cli-modal__x" data-act="mclose" aria-label="Cerrar">${X_ICON}</button></div>
    <div class="ds-modal__body">${body}</div><div class="ds-modal__footer">${footer}</div></div></div>`;
function pfDetailModal(c) {
  const p = st.prof, panel = p.detail; if (!panel) return '';
  let title, body;
  if (panel === 'debt') { title = PH.DEBT; body = pfDebt(c); }
  else if (panel === 'income') { title = PH.INCOME; body = pfPaid(c); }
  else { title = `${PH.INFO} · ${fullName(c)}`; body = pfInfo(c); }
  const canEdit = panel === 'info' && pfCanEdit(c.type, 'contacto');
  const foot = `<button type="button" class="ds-btn ${canEdit ? 'ds-btn--tertiary' : 'ds-btn--secondary'} ds-btn--md" data-act="mclose">${PH.CLOSE}</button>${canEdit ? `<button type="button" class="ds-btn ds-btn--primary ds-btn--md" data-act="pfeditinfo">${PH.EDIT_CLIENT}</button>` : ''}`;
  return dsModalShell('pfd', title, body, foot, panel === 'info' ? 'pr-wide' : 'pr-debtm pr-endfoot');
}
/* DS SelectionInput: caja del TextInput con la lista abajo (tope de 240 px; al abrir, la opción elegida queda a la vista: 1382e1a56) */
function pfSelect(id, label, opts, value, tried, key) {
  const open = st.menu === id, err = tried && !value;
  return `<div class="ds-field"><span class="ds-label" id="${id}L">${label}</span><span class="cli-selw"><button type="button" class="ds-field-wrap psel ${open ? 'open' : ''} ${err ? 'ds-field-wrap--error' : ''}" data-act="menu" data-id="${id}" aria-haspopup="listbox" aria-expanded="${open}" aria-labelledby="${id}L" ${err ? 'aria-invalid="true"' : ''}><span class="${value ? '' : 'ph'}">${esc(value || PH.SELECT)}</span>${DS_CHEV}</button>${open ? `<div class="ddl-menu cli-selmenu" role="listbox" data-center>${opts.map(o => `<button type="button" role="option" aria-selected="${o === value}" class="${o === value ? 'on' : ''}" data-act="pfsel" data-k="${key}" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div>` : ''}</span>${err ? `<span class="ds-helper ds-helper--error" role="alert">${PH.REQUIRED}</span>` : ''}</div>`;
}
/* Baja: con "Registro duplicado" se elige el cliente que se queda (DS AutoSelect) y se muestra lo que se le va a pasar (15c423c26) */
function pfDeactivate(c) {
  const p = st.prof, name = fullName(c), dup = p.dReason === PF_DUPLICATE, target = dup ? getMergeTarget(p.dTarget) : undefined;
  let body = `<p class="vfy-p">${esc(dup ? MERGE.INTRO(name) : PH.DEACTIVATE_TEXT(name))}</p>${pfSelect('pfdr', PH.DEACTIVATE_REASON, PF_DEACTIVATE_REASONS, p.dReason, p.dTried, 'dReason')}`;
  if (dup) {
    const q = norm(p.dQuery.trim()), opts = mergeCandidates(c.id).filter(o => !q || norm(o.label).includes(q)), open = st.menu === 'pfauto';
    const err = p.dTried && !target, summary = mergeSummary(c);
    body += `<p class="vfy-p pr-capt">${esc(MERGE.TARGET_HINT(name))}</p>
      <label class="ds-field"><span class="ds-label">${MERGE.TARGET_LABEL}</span><span class="cli-selw menu"><span class="ds-field-wrap ${open ? 'pr-auto-open' : ''} ${err ? 'ds-field-wrap--error' : ''}"><input class="ds-input" data-in="pfauto" data-fk="pfauto" role="combobox" aria-expanded="${open}" aria-autocomplete="list" autocomplete="off" placeholder="${esc(MERGE.TARGET_PLACEHOLDER)}" value="${esc(p.dQuery)}"><span class="ds-field-addon ds-field-addon--right pr-auto-chev" aria-hidden="true">${DS_CHEV}</span></span>
      ${open ? `<div class="ddl-menu cli-selmenu pr-automenu" role="listbox">${opts.length ? opts.map(o => `<button type="button" role="option" aria-selected="${o.value === p.dTarget}" class="${o.value === p.dTarget ? 'on' : ''}" data-act="pfpick" data-v="${o.value}">${esc(o.label)}</button>`).join('') : `<p class="pr-autoempty">${MERGE.EMPTY}</p>`}</div>` : ''}</span></label>
      ${err ? `<p class="pr-ferr" role="alert">${MERGE.TARGET_REQUIRED}</p>` : ''}`;
    if (target) {
      body += `<div class="vfy-who pr-target"><span class="ds-avatar ds-avatar--md cli-av" aria-hidden="true">${esc(target.initials)}</span><div><p class="m">${esc(target.name)}</p><p class="pr-capt">${esc(target.subtitle)}</p></div></div>
        <h3 class="pr-h3">${MERGE.SUMMARY_TITLE}</h3>${summary.length ? `<div class="pr-chips">${summary.map(s => `<span class="ds-chip ds-chip--info">${esc(s)}</span>`).join('')}</div>` : `<p class="vfy-p">${MERGE.NOTHING}</p>`}
        ${pfAlert('warning', MERGE.WARNING_TITLE, MERGE.WARNING_TEXT(name, target.name))}
        <label class="ds-check ${p.dTried && !p.dSure ? 'ds-check--error' : ''}"><input type="checkbox" data-chk="pfsure" ${p.dSure ? 'checked' : ''}><span class="ds-check__wrap"><span class="ds-check__box"></span></span>${MERGE.CONFIRM}</label>
        ${p.dTried && !p.dSure ? `<p class="pr-ferr" role="alert">${MERGE.CONFIRM_REQUIRED}</p>` : ''}`;
    }
  }
  return dsModalShell('pfx', PH.DEACTIVATE_TITLE, body, `<button type="button" class="ds-btn ds-btn--tertiary ds-btn--md" data-act="mclose">${PH.CANCEL}</button><button type="button" class="ds-btn ds-btn--destructive ds-btn--md" data-act="pfdeactivate">${dup ? MERGE.SUBMIT : PH.DEACTIVATE_CONFIRM}</button>`, `${dup ? 'pr-lg' : ''} pr-endfoot`);
}
function pfDialog(c) {
  const p = st.prof, name = fullName(c);
  if (p.dlg === 'deactivate') return pfDeactivate(c);
  if (p.dlg === 'report') { const errD = p.rTried && !p.rDetail.trim(); return dsModalShell('pfx', PH.REPORT_TITLE, `<p class="vfy-p">${esc(PH.REPORT_TEXT(name))}</p>${pfSelect('pfrr', PH.REPORT_REASON, PF_REPORT_REASONS, p.rReason, p.rTried, 'rReason')}
      <label class="ds-field"><span class="ds-label">${PH.REPORT_DETAIL}</span><textarea class="ds-textarea ${errD ? 'ds-textarea--error' : ''}" data-in="pfrd" data-fk="pfrd" rows="4" placeholder="${esc(PH.REPORT_DETAIL_PLACEHOLDER)}" ${errD ? 'aria-invalid="true"' : ''}>${esc(p.rDetail)}</textarea>${errD ? `<span class="ds-helper ds-helper--error" role="alert">${PH.REQUIRED}</span>` : ''}</label>`,
    `<button type="button" class="ds-btn ds-btn--tertiary ds-btn--md" data-act="mclose">${PH.CANCEL}</button><button type="button" class="ds-btn ds-btn--primary ds-btn--md" data-act="pfreport">${PH.REPORT_CONFIRM}</button>`, 'pr-endfoot'); }
  /* 1ec261752: el aviso de salida va en un DS Alert de advertencia */
  if (p.dlg === 'leave') return dsModalShell('pfx', PH.LEAVE_TITLE, pfAlert('warning', '', PH.LEAVE_TEXT(name)),
    `<button type="button" class="ds-btn ds-btn--tertiary ds-btn--md" data-act="mclose">${PH.CANCEL}</button><button type="button" class="ds-btn ds-btn--primary ds-btn--md" data-act="pfleave">${PH.LEAVE_CONFIRM}</button>`, 'pr-sm pr-endfoot');
  return '';
}
/* Detalle de transacción (92f7ebdf5): datos clave, artículos, tipo/estado/empresa/método, desglose y registro del pago */
function txModal() {
  const r = st.txRow; if (!r) return '';
  const d = getTransactionDetail(r), alert = TX_ALERT[r.status];
  const facts = [[d.referenceLabel, d.referenceLabel === 'Contrato' ? `<span class="pr-folio__t">${esc(d.reference)}</span>` : esc(d.reference)], [TXD.NUMBER, esc(r.number)], [TXD.DATE, esc(r.date)], [TXD.AMOUNT, formatMXN(r.amount)]];
  const lines = rows => `<dl class="pr-lines">${rows.map(l => `<div class="${l.total ? 'tot' : ''}"><dt>${esc(l.label)}</dt><dd>${l.money ? formatMXN(l.value) : esc(l.value)}</dd></div>`).join('')}</dl>`;
  const body = `<div class="pr-txd">${alert ? pfAlert(alert[0], alert[1], alert[2]) : ''}
    <div class="pr-gray"><dl class="pr-facts">${facts.map(([l, v]) => `<div><dt>${esc(l)}</dt><dd>${v}</dd></div>`).join('')}</dl></div>
    <ul class="pr-txarts" aria-label="${TXD.ARTICLES}">${d.articles.map(a => `<li><img src="${esc(a.photo)}" alt="${esc(a.name)}" width="72" height="72"><span><b>${esc(a.name)}</b><small>${esc(r.operation)}</small></span></li>`).join('')}</ul>
    <div class="pr-gray">${pfTable(TXD.COLS.map(h => `<th class="w160">${h}</th>`).join(''), `<tr><td>${esc(r.operation)}</td><td>${pfChip(r.status, ST_TX[r.status])}</td><td>${esc(d.company)}</td><td>${esc(d.kind)}</td><td>${pfPay(r.method)}</td></tr>`, 'pr-table--gray')}</div>
    <div class="pr-txrow"><div class="pr-gray"><h3 class="pr-h3">${TXD.BREAKDOWN}</h3>${lines(d.breakdown.map(l => ({ label: l.label, value: l.amount, money: true, total: l.total })))}</div>
      <div class="pr-gray"><h3 class="pr-h3">${TXD.RECORD}</h3>${lines([{ label: TXD.BRANCH, value: d.branch }, { label: TXD.CASHIER, value: d.cashier }, { label: TXD.TIME, value: d.time }])}</div></div></div>`;
  return dsModalShell('txd', TXD.TITLE, body, `<button type="button" class="ds-btn ds-btn--secondary ds-btn--md" data-act="mclose">${PH.CLOSE}</button><button type="button" class="ds-btn ds-btn--primary ds-btn--md cli-btn-ic" data-act="txdl">${pfIc('Download')}${TXD.DOWNLOAD}</button>`, 'pr-txm');
}
/* Notas de la prenda (detalle del contrato) */
function notesModal() {
  const n = st.ct && st.ct.notes; if (!n) return '';
  return dsModalShell('ctn', CTD.NOTES_TITLE(n.name), `<p class="vfy-p">${esc(n.notes)}</p>`, `<button type="button" class="ds-btn ds-btn--primary ds-btn--md" data-act="mclose">${PH.CLOSE}</button>`, 'pr-sm');
}
function profileModals() {
  if (st.screen === 'contract') return txModal() + notesModal();
  if (st.screen !== 'client') return '';
  const c = getClientProfile(st.prof.id); return c ? pfDetailModal(c) + pfDialog(c) + txModal() : '';
}
const pfAlert = (kind, title, text, action) => `<div class="ds-alert ds-alert--${kind} pr-alert" role="status"><span class="ds-alert__icon" aria-hidden="true">${kind === 'warning' ? '!' : 'i'}</span><div class="ds-alert__body-wrap">${title ? `<p class="ds-alert__title">${esc(title)}</p>` : ''}<p class="ds-alert__body">${esc(text)}</p>${action || ''}</div></div>`;
/* Menú ⋮ (IconButton + lista de ButtonSelect), alineado a la derecha del botón */
const pfMoreMenu = (id, label, opts, act, size = 'md', extra = '') => { const open = st.menu === id; return `<div class="pr-acts"><button type="button" class="ds-btn ds-btn--tertiary ds-btn--icon-${size} pr-md" data-act="menu" data-id="${id}" aria-haspopup="menu" aria-expanded="${open}" aria-label="${esc(label)}">${pfIc('MoreVert')}</button>${open ? `<div class="ddl-menu pr-menu" role="menu" aria-label="${esc(label)}">${opts.map(([v, l]) => `<button type="button" role="menuitem" data-act="${act}" data-v="${v}" ${extra}>${esc(l)}</button>`).join('')}</div>` : ''}</div>`; };

/* ---------- Encabezado (3c83b2d50: íconos como el legacy; f04300105: sin lápiz en la foto, se cambia en Editar cliente) ---------- */
function pfHeader(c) {
  const p = st.prof, s = c.summary, name = fullName(c), ident = c.identification;
  const acts = PF_ACTIONS[c.type].filter(a => !(p.deactivated && a === 'deactivate'));
  const addr = pfAddress(c).map(f => f.value).join(', ');
  /* Choice chip del DS con ícono: muestra el dato y abre su detalle; queda activo mientras está abierto */
  const pill = (id, icon, label, amount) => `<button type="button" class="ds-chip ds-chip--choice pr-pill ${p.detail === id ? 'ds-chip--on' : ''}" aria-pressed="${p.detail === id}" data-act="pfdetail" data-v="${id}">${pfIc(icon)}<span>${esc(label)}${amount != null ? ` ${formatMXN(amount)}` : ''}</span></button>`;
  return `<section class="pr-card" aria-label="${esc(name)}"><div class="pr-top">
      <div class="pr-photo"><span class="ds-avatar ds-avatar--xl cli-av pr-ph" role="img" aria-label="${esc(name)}">${esc(getInitials(c.name, c.lastName))}</span></div>
      <div class="pr-main">
        <div class="pr-name"><h2>${esc(name)}</h2><span class="ds-chip ${PF_TYPE_CHIP[c.type]}">${PF_TYPE_LABEL[c.type]}</span>${c.score && c.score !== 'Nuevo' ? pfChip(c.score, PF_SCORE_CHIP[c.score]) : ''}${c.score === 'Nuevo' ? `<span class="cap pr-cap">${PT.NEW_CLIENT_SCORE}</span>` : ''}</div>
        <ul class="pr-meta">
          ${c.nuc !== undefined ? `<li>${pfIc('AccountCircle', 16)}${PT.NUC} ${c.nuc}</li>` : ''}
          ${ident ? `<li title="${esc(ident.type + ' ' + ident.number)}">${pfIc('IdFrontal', 16)}${esc(ident.type)}${pfChip(ident.expired ? PH.ID_EXPIRED : PH.ID_VALID, ident.expired ? 'red' : 'green')}</li>` : ''}
          <li>${pfIc('Call', 16)}${esc(formatPhone(c.phone))}</li>
          <li>${pfIc('Mail', 16)}${esc(c.email)}</li>
          ${addr ? `<li>${pfIc('Home', 16)}<span class="pr-addr" title="${esc(addr)}">${esc(addr)}</span></li>` : ''}
        </ul>
        <div class="pr-pills">${s ? pill('debt', 'TaskAlt', PH.DEBT, getDebtBreakdown(c).total) : ''}${s ? pill('income', 'Payments', PH.INCOME, getPaidBreakdown(c).total) : ''}${pfInfoTabs(c).length ? pill('info', 'ClientInfo', PH.INFO) : ''}</div>
      </div>
      ${pfMoreMenu('pfacc', PH.ACTIONS, acts.map(a => [a, PF_ACTION_LABEL[a]]), 'pfaction')}
    </div></section>`;
}

/* ---------- Acciones rápidas (490adc8a9 fotos de prendas, 75c48fea5 estados y reactivación, 38e7b46e9 mismos montos que la tabla) ---------- */
function pfQuick(c) {
  const list = c.contracts; if (!list || !list.length) return '';
  const card = x => `<article class="pr-qcard" aria-label="${esc(x.folio)}"><div class="pr-qtop"><div><p class="pr-cap">${PT.QUICK_DUE(x.dueDate)}</p>${pfFolio(c, x.folio, 'h3')}</div>${pfChip(x.status, ST_CONTRACT[x.status])}</div>
      <div class="pr-qamts"><div class="pr-f"><span>${PT.QUICK_RENEWAL}</span><b>${formatMXN(x.renewal)}</b></div><div class="pr-f"><span>${PT.QUICK_REDEMPTION}</span><b>${formatMXN(x.redemption)}</b></div></div>
      <div class="pr-f"><span>${PT.QUICK_ARTICLES}</span><ul class="pr-thumbs">${x.articles.map(a => `<li><img src="${esc(a.photo)}" alt="${esc(a.name)}" title="${esc(a.name)}" width="48" height="48"></li>`).join('')}</ul></div>
      ${x.status === 'Vencido'
        ? `<div class="pr-qbtns"><p class="pr-late">${PT.QUICK_LATE_FEES}</p><button type="button" class="ds-btn ds-btn--secondary ds-btn--md" data-act="pfquick" data-k="${PT.QUICK_REACTIVATION}" data-v="${esc(x.folio)}">${PT.QUICK_REACTIVATE}</button></div>`
        : `<div class="pr-qbtns"><button type="button" class="ds-btn ds-btn--secondary ds-btn--md" data-act="pfquick" data-k="${PT.QUICK_REDEMPTION}" data-v="${esc(x.folio)}">${PT.QUICK_REDEEM}</button><button type="button" class="ds-btn ds-btn--secondary ds-btn--md" data-act="pfquick" data-k="${PT.QUICK_RENEWAL}" data-v="${esc(x.folio)}">${PT.QUICK_RENEW}</button></div>`}</article>`;
  return `<section class="pr-card" aria-label="${PT.QUICK_TITLE}"><h2 class="pr-h2">${PT.QUICK_TITLE}</h2><div class="qa-wrap"><button type="button" class="qa-arrow l" data-act="pfscroll" data-v="-1" aria-label="Anteriores" hidden>${PG.prev}</button><div class="qa-track pr-track" id="qaTrack">${list.map(card).join('')}</div><button type="button" class="qa-arrow r" data-act="pfscroll" data-v="1" aria-label="Siguientes" hidden>${PG.next}</button></div></section>`;
}

/* ---------- Operaciones (22d8186fc: tabs sobre la página y una card por tab; 8d0970d21 tabla de contratos como el perfil legacy) ---------- */
function pfTxBlock(rows, S, k) {
  const nq = norm(S.q || ''), est = [...new Set(rows.map(r => r.status))];
  const list = rows.filter(r => (!S.est || r.status === S.est) && (!nq || norm([r.number, r.operation, methodText(r.method)].join(' ')).includes(nq)));
  const pages = Math.max(1, Math.ceil(list.length / PF_PAGE)); if (S.page > pages) S.page = pages;
  const slice = list.slice((S.page - 1) * PF_PAGE, S.page * PF_PAGE);
  const tools = rows.length ? `<div class="pr-optools">${pfSearch(k, S.q, OPS.SEARCH_TX)}${pfFilterChip('est-' + k, OPS.FILTER, est, S.est, 'opest', k)}</div>` : '';
  const head = ['No. transacción', 'Fecha de pago', 'Monto del pago', 'Tipo de operación', 'Método de pago'].map(h => `<th>${h}</th>`).join('') + '<th class="pr-stc">Estado</th><th><span class="sr">Acciones</span></th>';
  const body = slice.length ? slice.map(r => `<tr><td>${esc(r.number)}</td><td class="nw">${esc(r.date)}</td><td class="nw">${formatMXN(r.amount)}</td><td>${esc(r.operation)}</td><td>${pfPay(r.method)}</td><td class="pr-stc">${pfChip(r.status, ST_TX[r.status])}</td><td class="r"><button type="button" class="ds-btn ds-btn--tertiary ds-btn--md" data-act="optxd" data-k="${k}" data-v="${esc(r.id)}">${OPS.DETAILS}</button></td></tr>`).join('')
    : `<tr><td class="empty" colspan="7">${pfEmpty(!!(S.q || S.est))}</td></tr>`;
  return tools + pfTable(head, body) + pfPager(list.length, S.page, 'oppage', k);
}
function pfOrdBlock(c) {
  const rows = (c.operations || {}).ordenes || [], S = st.prof.ord, ch = c.type !== 'marketplace', nq = norm(S.q || ''), est = [...new Set(rows.map(r => r.status))];
  const list = rows.filter(r => (!S.est || r.status === S.est) && (!nq || norm([r.number, ...r.articles.map(a => a.name)].join(' ')).includes(nq)));
  const pages = Math.max(1, Math.ceil(list.length / PF_PAGE)); if (S.page > pages) S.page = pages;
  const slice = list.slice((S.page - 1) * PF_PAGE, S.page * PF_PAGE);
  const tools = rows.length ? `<div class="pr-optools">${pfSearch('ord', S.q, OPS.SEARCH_ORD)}${pfFilterChip('est-ord', OPS.FILTER, est, S.est, 'opest', 'ord')}</div>` : '';
  const head = ['No. orden', 'Artículos', 'Fecha', ...(ch ? ['Canal de venta'] : []), 'Total abonado', 'Tipo'].map(h => `<th class="${h === 'Artículos' ? 'w240' : ''}">${h}</th>`).join('') + '<th class="pr-stc">Estado</th>';
  const body = slice.length ? slice.map(r => `<tr><td class="nw">${esc(r.number)}</td><td>${pfArtCell(r.articles[0] && r.articles[0].photo, articleSummary(r.articles), OPS.ARTICLE_COUNT(r.articles.length))}</td><td class="nw">${esc(r.date)}</td>${ch ? `<td>${esc(r.channel)}</td>` : ''}<td class="nw">${formatMXN(r.paid)}</td><td>${esc(r.type)}</td><td class="pr-stc">${pfChip(r.status, ST_ORDER[r.status])}</td></tr>`).join('')
    : `<tr><td class="empty" colspan="${ch ? 7 : 6}">${pfEmpty(!!(S.q || S.est))}</td></tr>`;
  return tools + pfTable(head, body) + pfPager(list.length, S.page, 'oppage', 'ord');
}
/* Filtro por vencimiento (ClientProfileDueFilter + DueCalendar): mismo botón que TableFilterChip y un calendario flotante;
   por fecha un mes con "Rango" y "Aplicar" (Figma "Calendario"), por rango dos meses (Figma "Date Range Picker") */
const SHORT_M = MONTH_NAMES.map(m => m.slice(0, 3).toLowerCase());
const shortDate = d => `${d.getDate()} ${SHORT_M[d.getMonth()]}`;
const rangeLabel = r => { if (!r.end || sameDay(r.start, r.end)) return shortDate(r.start); const [a, b] = dayKey(r.start) <= dayKey(r.end) ? [r.start, r.end] : [r.end, r.start]; return `${shortDate(a)} – ${shortDate(b)}`; };
const inDue = (d, r) => { const k = dayKey(d), a = dayKey(r.start), b = r.end ? dayKey(r.end) : a; return k >= Math.min(a, b) && k <= Math.max(a, b); };
const monthOf = d => ({ y: d.getFullYear(), m: d.getMonth() });
const shiftMonth = (v, n) => monthOf(new Date(v.y, v.m + n, 1));
function dayPos(day, draft, range) {
  if (!draft) return 'none';
  const { start, end } = draft;
  if (!range || !end || sameDay(start, end)) return sameDay(day, start) ? 'single' : 'none';
  const [a, b] = dayKey(start) <= dayKey(end) ? [start, end] : [end, start];
  if (sameDay(day, a)) return 'start'; if (sameDay(day, b)) return 'end';
  return inDue(day, draft) ? 'middle' : 'none';
}
function calMonth(side) {
  const C = st.prof.cal, v = C[side], today = new Date();
  const first = new Date(v.y, v.m, 1), off = (first.getDay() + 6) % 7, dim = new Date(v.y, v.m + 1, 0).getDate(), weeks = Math.ceil((off + dim) / 7);
  const days = Array.from({ length: weeks * 7 }, (_, i) => new Date(v.y, v.m, i - off + 1));
  const years = Array.from({ length: 6 }, (_, i) => today.getFullYear() - 2 + i);
  const sel = (key, label, opts, cur) => { const open = C.sel === `${side}-${key}`; return `<span class="cli-selw"><button type="button" class="ds-field-wrap psel ${open ? 'open' : ''}" data-act="calsel" data-v="${side}-${key}" aria-haspopup="listbox" aria-expanded="${open}" aria-label="${label}"><span>${esc(opts.find(o => o[0] === cur)[1])}</span>${DS_CHEV}</button>${open ? `<div class="ddl-menu cli-selmenu" role="listbox" data-center>${opts.map(([val, l]) => `<button type="button" role="option" aria-selected="${val === cur}" class="${val === cur ? 'on' : ''}" data-act="calpick" data-k="${side}-${key}" data-v="${val}">${esc(l)}</button>`).join('')}</div>` : ''}</span>`; };
  return `<div class="pr-calm"><div class="pr-calsel">${sel('m', CAL_T.MONTH, MONTH_NAMES.map((n, i) => [i, n]), v.m)}${sel('y', CAL_T.YEAR, years.map(y => [y, String(y)]), v.y)}</div>
    <div class="pr-days ${C.range ? 'band' : ''}">${['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(w => `<span class="wd" aria-hidden="true">${w}</span>`).join('')}${days.map(d => { const out = d.getMonth() !== v.m, pos = C.range && out ? 'none' : dayPos(d, C.draft, C.range); return `<button type="button" class="pr-day is-${pos} ${out ? 'is-out' : ''} ${sameDay(d, today) ? 'is-today' : ''}" aria-pressed="${pos !== 'none'}" aria-label="${d.getDate()} de ${MONTH_NAMES[d.getMonth()].toLowerCase()} de ${d.getFullYear()}" data-act="calday" data-v="${d.getTime()}">${d.getDate()}</button>`; }).join('')}</div></div>`;
}
function calPanel() {
  const C = st.prof.cal;
  if (!C.range) return `<div class="pr-cal menu" role="dialog" aria-label="${CAL_T.TRIGGER}">${calMonth('left')}<p class="pr-calhint">${CAL_T.DAY_HINT}</p><div class="pr-calfoot"><button type="button" class="ds-btn ds-btn--tertiary ds-btn--md" data-act="calrange">${CAL_T.RANGE}</button><button type="button" class="ds-btn ds-btn--primary ds-btn--md" data-act="calapply">${CAL_T.APPLY}</button></div></div>`;
  return `<div class="pr-cal pr-cal--range menu" role="dialog" aria-label="${CAL_T.TRIGGER}"><div class="pr-calrow">${calMonth('left')}${calMonth('right')}</div><div class="pr-calfoot div"><button type="button" class="ds-btn ds-btn--tertiary ds-btn--md" data-act="calclear">${CAL_T.CLEAR}</button><span class="g"><button type="button" class="ds-btn ds-btn--tertiary ds-btn--md" data-act="calcancel">${CAL_T.CANCEL}</button><button type="button" class="ds-btn ds-btn--primary ds-btn--md" data-act="calapply" ${C.draft && !C.draft.end ? 'disabled' : ''}>${CAL_T.CONTINUE}</button></span></div></div>`;
}
function pfCtrBlock(c) {
  const rows = c.pawnContracts || [], S = st.prof.ctr;
  const list = rows.filter(k => (!S.est || k.status === S.est) && (!S.due || inDue(parseDueDate(k.dueDate), S.due))).sort((a, b) => b.folio.localeCompare(a.folio));
  const pages = Math.max(1, Math.ceil(list.length / PF_PAGE)); if (S.page > pages) S.page = pages;
  const slice = list.slice((S.page - 1) * PF_PAGE, S.page * PF_PAGE), calOpen = st.menu === 'cal' && st.prof.cal;
  const tools = rows.length ? `<div class="pr-optools pr-optools--end"><div class="pr-fchip pr-calw"><button type="button" class="pr-fchip__btn ${S.due || calOpen ? 'is-on' : ''}" data-act="calopen" aria-haspopup="dialog" aria-expanded="${!!calOpen}">${pfIc('CalendarToday')}<span>${S.due ? rangeLabel(S.due) : CAL_T.TRIGGER}</span><span class="pr-fchip__arrow">${pfIc('ArrowDropDown')}</span></button>${calOpen ? calPanel() : ''}</div>${pfFilterChip('est-ctr', OPS.FILTER_STATUS, CT_STATUSES, S.est, 'opest', 'ctr')}</div>` : '';
  const head = `<th class="w140">No contrato</th><th class="w240">Artículos</th><th class="pr-stc">Estado</th><th class="pr-duec w120">Fecha de vencimiento</th>${['Refrendo', 'Desempeño', 'Préstamo', 'Valor avalúo'].map(h => `<th class="r am">${h}</th>`).join('')}<th class="pr-sellc w180">Vendedor / sucursal</th><th><span class="sr">Opciones</span></th>`;
  const body = slice.length ? slice.map(k => `<tr><td class="nw">${pfFolio(c, k.folio)}</td><td>${pfArtCell(k.articles[0] && k.articles[0].photo, articleSummary(k.articles), OPS.ARTICLE_COUNT(k.articles.length))}</td><td class="pr-stc">${pfChip(k.status, ST_CONTRACT[k.status])}</td><td class="pr-duec nw">${esc(k.dueDate)}</td>${['renewal', 'redemption', 'loan', 'appraisal'].map(f => `<td class="r nw">${formatMXN(k[f])}</td>`).join('')}<td class="pr-sellc"><span class="pr-sell"><span>${esc(k.seller)}</span><small>${esc(k.branch)}</small></span></td><td class="r pr-rowmenu">${pfMoreMenu('ctr:' + k.folio, OPS.ROW_ACTIONS(k.folio), CT_ROW_ACTIONS[k.status].map(a => [a, CT_ACTION_LABEL[a]]), 'ctrow', 'sm', `data-k="${esc(k.folio)}"`)}</td></tr>`).join('')
    : `<tr><td class="empty pr-emptytxt" colspan="11">${S.est || S.due ? OPS.CT_EMPTY_FILTER : OPS.CT_EMPTY}</td></tr>`;
  return tools + pfTable(head, body, 'pr-table--ctr') + pfPager(list.length, S.page, 'oppage', 'ctr');
}
function pfOps(c) {
  const p = st.prof, tabs = pfOpTabs(c), tab = tabs.includes(p.otab) ? p.otab : tabs[0];
  const content = tab === 'transacciones' ? pfTxBlock((c.operations || {}).transacciones || [], p.tx, 'tx') : tab === 'ordenes' ? pfOrdBlock(c) : pfCtrBlock(c);
  return `${tabs.length > 1 ? `<div class="ds-tabs__list cli-tabs pr-optabs" role="tablist">${tabs.map(t => `<button type="button" role="tab" class="ds-tabs__tab" aria-selected="${t === tab}" data-act="pfotab" data-v="${t}">${PF_OP_TAB_LABEL[t]}</button>`).join('')}</div>` : ''}
    <section class="pr-card" aria-label="${PF_OP_TAB_LABEL[tab]}"><h2 class="pr-h2">${PF_OP_TAB_LABEL[tab]}</h2><div class="pr-opbody" ${tabs.length > 1 ? 'role="tabpanel"' : ''}>${content}</div></section>`;
}
const pfCrumbs = items => `<nav aria-label="Breadcrumb" class="ds-breadcrumb"><ol class="pos-crumbs">${items.map((it, i) => i < items.length - 1 ? `<li><a href="${it.href}" class="ds-breadcrumb__link" ${it.go ? `data-act="go" data-to="${it.go}"` : ''}>${esc(it.label)}</a><span class="ds-breadcrumb__sep" aria-hidden="true"><img class="pos-crumb-sep" src="../assets/ds/ArrowForwardIos-D4D6D8.svg" alt="" /></span></li>` : `<li><span class="ds-breadcrumb__current" aria-current="page">${esc(it.label)}</span></li>`).join('')}</ol></nav>`;
function clientProfileScreen() {
  const p = st.prof, c = getClientProfile(p.id);
  const crumbs = pfCrumbs([{ label: PT.BREADCRUMB_HOME, href: '../home/' }, { label: PT.BREADCRUMB_CLIENTS, href: './', go: 'clients' }, { label: PT.TITLE }]);
  let body;
  if (!c) body = `<section class="pr-card"><div class="cempty pr-empty"><img src="assets/ilust-01-empty.svg" alt="" width="150" height="150"><h2 class="pr-h2">${PT.NOT_FOUND_TITLE}</h2><p class="cap">${PT.NOT_FOUND_TEXT}</p><a class="ds-btn ds-btn--primary ds-btn--md" href="./" data-act="go" data-to="clients">${PT.BACK_TO_LIST}</a></div></section>`;
  else {
    /* ProfileStatusAlerts: marketplace y dado de baja (o fusionado, con "Ver perfil de …") */
    const merged = p.merged, act = merged ? `<div class="pr-alertact"><a class="ds-btn ds-btn--tertiary ds-btn--md" href="#perfil/${encodeURIComponent(merged.id)}">${esc(MERGE.VIEW_TARGET(merged.name))}</a></div>` : '';
    body = (c.type === 'marketplace' ? pfAlert('info', PT.MARKETPLACE_ALERT_TITLE, PT.MARKETPLACE_ALERT_TEXT) : '') + (p.deactivated ? pfAlert('warning', PH.DEACTIVATED_TITLE, merged ? MERGE.DONE_TEXT(merged.name) : PH.DEACTIVATED_TEXT, act) : '') + pfHeader(c) + pfQuick(c) + pfOps(c);
  }
  return `<div class="cli cp">${crumbs}<div class="cli-head"><h1 class="cli-title">${PT.TITLE}</h1></div>${body}</div>${sesiones()}`;
}

/* ---------- Detalle del contrato de empeño (ContractDetail/*, 496bbf842; responsivo de d8fe089ae) ---------- */
const longDate = new Intl.DateTimeFormat('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
const formatLongDate = v => { const t = longDate.format(parseDueDate(v)); return t.charAt(0).toUpperCase() + t.slice(1); };
function contractScreen() {
  const T = st.ct, d = getContractDetail(T.id, T.folio), profHref = `#perfil/${encodeURIComponent(T.id)}`;
  const crumbs = pfCrumbs([{ label: PT.BREADCRUMB_HOME, href: '../home/' }, { label: PT.BREADCRUMB_CLIENTS, href: './', go: 'clients' }, { label: CTD.BREADCRUMB_PROFILE, href: profHref }, { label: CTD.BREADCRUMB_DETAIL }]);
  if (!d) return `<div class="cli cp">${crumbs}<section class="pr-card"><div class="cempty pr-empty"><img src="assets/ilust-01-empty.svg" alt="" width="150" height="150"><h2 class="pr-h2">${CTD.NOT_FOUND_TITLE}</h2><p class="cap">${CTD.NOT_FOUND_TEXT}</p><a class="ds-btn ds-btn--primary ds-btn--md" href="${profHref}">${CTD.BACK_TO_PROFILE}</a></div></section></div>${sesiones()}`;
  const k = d.contract, c = d.client, discharged = k.status === 'Desempeñado', expired = k.status === 'Vencido';
  const menu = (discharged || expired ? ['print', 'email'] : ['extend', 'print', 'email']).map(v => [v, CT_MENU[v]]);
  const head = `<div class="ct-head"><div class="ct-headtx"><h1 class="cli-title">${CTD.TITLE}</h1><ul class="ct-meta"><li><span class="cap">${CTD.FOLIO}</span><span class="v">${esc(k.folio)}</span></li><li><span class="cap">${CTD.STATUS}</span>${pfChip(k.status, ST_CONTRACT[k.status])}</li><li><span class="cap">${discharged ? CTD.DISCHARGED : CTD.DUE}</span><span class="v">${esc(k.dueDate)}</span></li></ul></div>${pfMoreMenu('ctmore', CTD.MORE, menu, 'ctmenu')}</div>`;
  const addr = pfAddress(c).map(f => f.value).join(', '), ident = c.identification;
  const line = (l, v) => `<span class="ct-pair"><span class="cap">${esc(l)}</span>${v}</span>`;
  const sum = [['Total de avalúo:', d.summary.appraisal], ['Total del préstamo:', d.summary.loan], ['Extensiones:', d.summary.extensions], ['Reactivaciones:', d.summary.reactivations], ['Subtotal:', d.summary.subtotal], [`Interés ${INTEREST_RATE}%:`, d.summary.interest], [`IVA ${IVA_RATE}%:`, d.summary.iva], ['Total:', d.summary.total]];
  const cards = `<div class="ct-cards"><section class="pr-card pr-card--sm" aria-label="${CTD.CLIENT_TITLE}"><h2 class="pr-h2">${CTD.CLIENT_TITLE}</h2><div class="ct-client"><a class="ct-name" href="${profHref}">${esc(fullName(c))}</a>
      ${c.score && c.score !== 'Nuevo' ? line(CTD.SCORE, pfChip(c.score, PF_SCORE_CHIP[c.score])) : ''}${ident ? line(`${ident.type}:`, `<span class="cap">${esc(ident.number)}</span>`) : ''}${line(CTD.EMAIL, `<span class="cap">${esc(c.email)}</span>`)}${line(CTD.PHONE, `<span class="cap">${esc(formatPhone(c.phone))}</span>`)}${addr ? line(CTD.ADDRESS, `<span class="cap">${esc(addr)}</span>`) : ''}</div></section>
    <section class="pr-card pr-card--sm" aria-label="${CTD.SUMMARY_TITLE}"><h2 class="pr-h2">${CTD.SUMMARY_TITLE}</h2><dl class="ct-sum">${sum.map(([l, v]) => `<div><dt>${esc(l)}</dt><dd>${formatMXN(v)}</dd></div>`).join('')}</dl></section></div>`;
  const acts = CT_MAIN_ACTIONS[k.status], deadline = formatLongDate(k.dueDate);
  const arts = `<section class="pr-card pr-card--sm ct-arts" aria-label="${CTD.ARTICLES_TITLE}"><div class="ct-artshead"><h2 class="pr-h2">${CTD.ARTICLES_TITLE}</h2>${discharged ? '' : `<p class="ct-deadline ${expired ? 'is-exp' : ''}">${pfIc('InfoCircle')}${esc(expired ? CTD.EXPIRED_SINCE(deadline) : CTD.DEADLINE(deadline))}</p>`}</div>
    <div class="ct-artsbody ${acts.length ? 'has-acts' : ''}"><div class="ct-list"><h3 class="pr-h3 sb">${CTD.ARTICLES}</h3>${d.articles.map((a, i) => `<article class="ct-art"><div class="ct-img"><img src="${esc(a.photo)}" alt="${esc(a.name)}" width="96" height="96"><span class="ct-cond">${pfChip(a.condition, 'white')}</span></div>
        <div class="ct-arttx"><h4>${esc(a.name)}</h4><p class="cap">${CTD.SKU} ${esc(a.sku)}</p><p class="cap">${CTD.APPRAISAL} ${formatMXN(a.appraisal)}</p><p class="strong">${CTD.LOAN} ${formatMXN(a.loan)}</p></div>
        ${a.notes ? `<button type="button" class="ds-btn ds-btn--tertiary ds-btn--md ct-notes" data-act="ctnotes" data-v="${i}">${CTD.NOTES}${pfIc('Chat')}</button>` : ''}</article>`).join('')}</div>
      ${acts.length ? `<div class="ct-actions">${expired ? `<p class="pr-late">${CTD.LATE_FEES}</p>` : ''}${acts.map((a, i) => `<button type="button" class="ds-btn ${i ? 'ds-btn--secondary' : 'ds-btn--primary'} ds-btn--md" data-act="ctaction" data-v="${a}">${CT_ACTION_LABEL[a]}</button>`).join('')}</div>` : ''}</div></section>`;
  const tabs = CT_TABS.filter(([id]) => (id !== 'personas' || (c.cotitulares || []).length) && (id !== 'transacciones' || d.transactions.length));
  const tab = tabs.some(t => t[0] === T.tab) ? T.tab : 'detalle';
  let panel;
  if (tab === 'detalle') panel = `<div class="ct-secs">${d.sections.map(s => `<section class="ct-sec" aria-label="${esc(s.title)}"><div class="ct-sectitle"><h3 class="pr-h3">${esc(s.title)}</h3>${s.help ? `<span class="ds-tooltip pr-tip" tabindex="0" aria-label="${esc(s.help)}">${pfIc('Help')}<span class="ds-tooltip__content" role="tooltip">${esc(s.help)}</span></span>` : ''}</div><dl class="ct-cols">${s.fields.map(([l, v]) => `<div><dt>${esc(l)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></section>`).join('')}</div>`;
  else if (tab === 'personas') panel = pfPeople(c);
  else if (tab === 'transacciones') panel = pfTxBlock(d.transactions, T.tx, 'ctx');
  else panel = pfTable(`<th>No. pago</th><th>Fecha límite</th>${['Interés', 'IVA', 'Refrendo', 'Desempeño'].map(h => `<th class="r am">${h}</th>`).join('')}<th class="pr-stc">Estado</th>`, d.amortization.map(r => `<tr><td>${r.period}</td><td class="nw">${esc(r.dueDate)}</td>${['interest', 'iva', 'renewal', 'redemption'].map(f => `<td class="r nw">${formatMXN(r[f])}</td>`).join('')}<td class="pr-stc">${pfChip(r.status, ST_AMORT[r.status])}</td></tr>`).join(''));
  const tabsCard = `<section class="pr-card pr-card--sm"><div class="ct-tabsw"><div class="ds-tabs__list cli-tabs" role="tablist">${tabs.map(([id, l]) => `<button type="button" role="tab" class="ds-tabs__tab" aria-selected="${id === tab}" data-act="cttab" data-v="${id}">${l}</button>`).join('')}</div></div><div role="tabpanel" class="ct-panel">${panel}</div></section>`;
  return `<div class="cli cp ct">${crumbs}${head}${cards}${arts}${tabsCard}</div>${sesiones()}`;
}

const DS_CHEV = '<svg class="dchev" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function pfAct(a, v, t) {
  const p = st.prof, c = st.screen === 'client' ? getClientProfile(p.id) : null, name = c ? fullName(c) : '';
  switch (a) {
    case 'pfdetail': p.detail = v; p.itab = null; p.open = []; st.menu = null; render(); return true;
    case 'pfitab': p.itab = v; render(); return true;
    case 'pfgroup': p.open = p.open.includes(v) ? p.open.filter(x => x !== v) : [...p.open, v]; render(); return true;
    case 'pfeditinfo': p.detail = null; p.editSection = undefined; p.dlg = 'leave'; render(); return true;
    case 'pfaction': st.menu = null; if (v === 'edit') { p.editSection = undefined; p.dlg = 'leave'; } else p.dlg = v; Object.assign(p, { dReason: '', dTarget: '', dQuery: '', dSure: false, dTried: false, rReason: '', rDetail: '', rTried: false }); render(); return true;
    case 'pfleave': location.href = `cliente-nuevo.html?editar=${encodeURIComponent(p.id)}${p.editSection ? `&seccion=${p.editSection}` : ''}`; return true;
    case 'pfsel': p[t.dataset.k] = v; if (t.dataset.k === 'dReason' && v !== PF_DUPLICATE) { p.dTarget = ''; p.dQuery = ''; p.dSure = false; } st.menu = null; render(); return true;
    case 'pfpick': { const x = getMergeTarget(v); p.dTarget = v; p.dQuery = x ? x.name : ''; st.menu = null; render(); return true; }
    case 'pfdeactivate': {
      p.dTried = true;
      if (!p.dReason) { render(); return true; }
      const target = p.dReason === PF_DUPLICATE ? getMergeTarget(p.dTarget) : undefined;
      if (p.dReason === PF_DUPLICATE && !(target && p.dSure)) { render(); return true; }
      p.dlg = null; p.deactivated = true; p.merged = target || null;
      toastMsg(target ? MERGE.DONE_TOAST(target.name) : PH.DEACTIVATED_TOAST, 'ok', name); return true;
    }
    case 'pfreport': p.rTried = true; if (!p.rReason || !p.rDetail.trim()) { render(); return true; } p.dlg = null; p.rReason = p.rDetail = ''; p.rTried = false; toastMsg(PH.REPORT_TOAST, 'ok', name); return true;
    case 'pfquick': {
      const kind = t.dataset.k, x = c && (c.contracts || []).find(k => k.folio === v);
      // Reactivar: aviso como en su React (el carrito compartido no tiene reactivaciones)
      if (!x || kind === PT.QUICK_REACTIVATION || !window.atsCarrito) { toastMsg(PT.QUICK_ADDED, 'ok', `${kind} · ${v}`); return true; }
      // Refrendo y Desempeño entran al carrito compartido (../carrito.js) a nombre de este cliente
      const cli = { nuc: Number(c.nuc), nombre: name, telefono: c.phone }, imagen = x.articles[0] ? new URL(x.articles[0].photo, location.href).pathname : undefined;
      const item = kind === PT.QUICK_RENEWAL
        ? { tipo: 'refrendo', titulo: 'Refrendo', detalle: `Fecha de vencimiento: ${x.dueDate}`, monto: x.renewal, contrato: x.folio, prestamo: x.redemption - x.renewal, imagen }
        : { tipo: 'desempeno', titulo: 'Desempeño', detalle: `Prendas: ${x.articles.map(a => a.name).join(', ')}`, monto: x.redemption, contrato: x.folio, imagen };
      const ya = atsCarrito.leer().items.find(i => i.contrato === item.contrato && ['refrendo', 'desempeno'].includes(i.tipo));
      if (ya && Number((atsCarrito.leer().cliente || {}).nuc) === cli.nuc) { toastMsg('Ya está en el carrito', 'warn', `${ya.titulo} · ${v}`); return true; }
      if (atsCarrito.agregarDe(cli, item)) toastMsg(`${item.titulo} agregado al carrito correctamente.`, 'ok', `${v} · ${formatMXN(item.monto)}`);
      return true;
    }
    case 'pfscroll': { const tr = document.getElementById('qaTrack'); if (tr) tr.scrollBy({ left: Number(v) * 316, behavior: 'smooth' }); return true; }
    case 'pfotab': p.otab = v; st.menu = null; render(); return true;
    /* operaciones: k = tx | ord | ctr (perfil) o ctx (transacciones del contrato) */
    case 'opest': { const S = opState(t.dataset.k); S.est = v; S.page = 1; st.menu = null; render(); return true; }
    case 'opq0': { const S = opState(t.dataset.k); S.q = ''; S.page = 1; render(); const el = document.querySelector(`[data-fk="opq-${t.dataset.k}"]`); if (el) el.focus(); return true; }
    case 'oppage': opState(t.dataset.k).page = Math.max(1, Number(v)); render(); return true;
    case 'optxd': { const rows = t.dataset.k === 'ctx' ? getContractDetail(st.ct.id, st.ct.folio).transactions : (c.operations.transacciones || []); st.txRow = rows.find(r => r.id === v) || null; st.txFrom = t; render(); return true; }
    case 'txdl': toastMsg(TXD.DOWNLOAD_TOAST, 'ok', st.txRow ? st.txRow.number : ''); return true;
    case 'ctrow': {
      const folio = t.dataset.k, href = contractHref(c, folio); st.menu = null;
      if (v === 'detail' && href) { location.hash = href.slice(1); return true; }
      toastMsg(OPS.ACTION_DONE, 'ok', `${CT_ACTION_LABEL[v]} · ${folio}`); return true;
    }
    /* calendario de vencimiento */
    case 'calopen': {
      if (st.menu === 'cal') { st.menu = null; render(); return true; }
      const due = p.ctr.due, left = monthOf(due ? due.start : new Date());
      p.cal = { range: !!(due && due.end), left, right: shiftMonth(left, 1), draft: due ? { ...due } : null, sel: null }; st.menu = 'cal'; render(); return true;
    }
    case 'calsel': p.cal.sel = p.cal.sel === v ? null : v; render(); return true;
    case 'calpick': { const [side, key] = t.dataset.k.split('-'); p.cal[side] = { ...p.cal[side], [key]: Number(v) }; p.cal.sel = null; render(); return true; }
    case 'calday': {
      const C = p.cal, d = new Date(Number(v)); C.sel = null;
      if (!C.range) C.draft = C.draft && sameDay(C.draft.start, d) && !C.draft.end ? null : { start: d };
      else C.draft = C.draft && !C.draft.end ? { start: C.draft.start, end: d } : { start: d };
      render(); return true;
    }
    case 'calrange': { const C = p.cal; if (C.draft) C.draft = { start: C.draft.start }; C.right = shiftMonth(C.left, 1); C.range = true; C.sel = null; render(); return true; }
    case 'calclear': p.cal.draft = null; p.cal.sel = null; render(); return true;
    case 'calcancel': st.menu = null; render(); return true;
    case 'calapply': p.ctr.due = p.cal.draft || null; p.ctr.page = 1; st.menu = null; render(); return true;
    /* detalle del contrato */
    case 'cttab': st.ct.tab = v; render(); return true;
    case 'ctnotes': { const d = getContractDetail(st.ct.id, st.ct.folio); st.ct.notes = d && d.articles[Number(v)]; st.ctFrom = t; render(); return true; }
    case 'ctmenu': st.menu = null; toastMsg(OPS.ACTION_DONE, 'ok', `${CT_MENU[v]} · ${st.ct.folio}`); return true;
    case 'ctaction': toastMsg(OPS.ACTION_DONE, 'ok', `${CT_ACTION_LABEL[v]} · ${st.ct.folio}`); return true;
  }
  return false;
}
/* el carrusel solo muestra sus flechas si las acciones rápidas no caben; las listas abren con la opción elegida a la vista (1382e1a56) */
function pfAfterRender() {
  document.querySelectorAll('.ddl-menu[data-center]').forEach(m => { const s = m.querySelector('[aria-selected="true"]'); if (s) m.scrollTop = s.offsetTop - (m.clientHeight - s.offsetHeight) / 2; });
  const tr = document.getElementById('qaTrack'); if (!tr) return;
  const wrap = tr.parentElement, l = wrap.querySelector('.qa-arrow.l'), r = wrap.querySelector('.qa-arrow.r');
  const sync = () => { const over = tr.scrollWidth > tr.clientWidth + 2; l.hidden = !over || tr.scrollLeft < 4; r.hidden = !over || tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 4; };
  sync(); tr.onscroll = sync;
}

let lastToastId = null;
// Toast del diseño (componente "Toast": Positive / Negative / Alert / Info)
function toast() {
  const t = st.toast; if (!t) return '';
  const icon = { ok: ICONS.success, err: ICONS.error, warn: ICONS.warn, info: ICONS.info }[t.kind] || ICONS.info;
  const fresh = t.id !== lastToastId; lastToastId = t.id;
  const tone = { ok: 'success', err: 'error', warn: 'warning', info: 'info' }[t.kind] || 'info';
  return `<div class="ds-toast-region"><div class="ds-toast ds-toast--${tone} cli-toast" role="status"${fresh ? '' : ' data-visto'}><span class="ds-toast__icon">${icon}</span><div class="ds-toast__body-wrap"><p class="ds-toast__title">${esc(t.msg)}</p>${t.text ? `<p class="ds-toast__body">${esc(t.text)}</p>` : ''}</div><button type="button" class="ds-toast__close" data-act="tclose" aria-label="Cerrar">${ICONS.close.replace('width="24" height="24"', 'width="20" height="20"')}</button><span class="ds-toast__timer"></span></div></div>`;
}

// DS Modal "Verifica al cliente" (commit 2d1b103b4): antes de cargar a un cliente del Marketplace o de la Red ataskate se le pide
// su teléfono o su correo; si coincide abre cliente-nuevo.html?cargar=<id> (id opaco: la URL ya no lleva el correo). Queda sobre el header compartido (z 80 > 30).
function modal() {
  const m = st.modal; if (!m || m.type !== 'verify') return '';
  const x = EXT_CLI[m.i];
  // la X del DS Modal en gris (var(--ats-neutral-600)) como en los modales de Cliente nuevo: el ícono toma el color del botón
  const X = X_ICON;
  return `<div class="ds-modal-overlay cli-ov" data-act="mbg"><div class="ds-modal cli-modal" role="dialog" aria-modal="true" aria-labelledby="vfyT" aria-describedby="vfyP" data-stop="1">
      <div class="ds-modal__header"><h2 class="ds-modal__title" id="vfyT">Verifica al cliente</h2><button type="button" class="ds-btn ds-btn--tertiary ds-btn--icon-md cli-modal__x" data-act="mclose" aria-label="Cerrar">${X}</button></div>
      <div class="ds-modal__body">
      <div class="vfy-who"><span class="ds-avatar ds-avatar--md cli-av" aria-hidden="true">${esc(initials(x))}</span><div><p class="m">${esc(x.name + ' ' + x.last)}</p><p class="d"><span class="ds-chip ${EXT_CHIP[x.src]}">${EXT_SRC[x.src]}</span></p></div></div>
      <p class="vfy-p" id="vfyP">Este cliente ya está registrado en ${EXT_SRC[x.src]}. Para cargar sus datos, pide al cliente su número de teléfono o su correo electrónico.</p>
      <label class="ds-field"><span class="ds-label">Teléfono o correo electrónico</span><span class="ds-field-wrap ${m.err ? 'ds-field-wrap--error' : ''}"><input class="ds-input" data-in="vfy" data-fk="vfy" value="${esc(m.val)}" placeholder="Ej. 55 1234 5678 o nombre@correo.com" autocomplete="off" aria-invalid="${!!m.err}" ${m.err ? 'aria-describedby="vfyE"' : ''}></span>${m.err ? `<span class="ds-helper ds-helper--error" id="vfyE" role="alert">${esc(m.err)}</span>` : ''}</label>
      </div><div class="ds-modal__footer"><button type="button" class="ds-btn ds-btn--tertiary ds-btn--md" data-act="mclose">Cancelar</button><button type="button" class="ds-btn ds-btn--primary ds-btn--md" data-act="vfyok" ${m.val.trim() ? '' : 'disabled'}>Verificar y cargar</button></div></div></div>`;
}
// al cerrar el modal el foco regresa al "Cargar cliente" que lo abrió (el render vuelve a crear el botón)
function closeModal() {
  /* la transacción y las notas van encima del resto: se cierran primero y el foco regresa al botón que las abrió */
  if (st.txRow || (st.ct && st.ct.notes)) {
    const from = st.txRow ? st.txFrom : st.ctFrom, sel = from && from.dataset ? `[data-act="${from.dataset.act}"][data-v="${from.dataset.v}"]` : null;
    st.txRow = null; if (st.ct) st.ct.notes = null; st.menu = null; render();
    const b = sel && document.querySelector(sel); if (b) b.focus(); return;
  }
  if (!st.modal) { const p = st.prof; if (p.dlg) p.dlg = null; else p.detail = null; st.menu = null; render(); return; }
  const i = st.modal && st.modal.i; st.modal = null; render();
  const b = document.querySelector(`[data-act="extver"][data-v="${i}"]`); if (b) b.focus();
}

// ---------- acciones ----------
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]');
  // cerrar menús al hacer clic fuera
  // (un clic dentro de un panel .menu, como el calendario o la lista del AutoSelect, no lo cierra)
  let closed = false;
  if (st.menu && !e.target.closest('.menu') && !(t && t.dataset.act === 'menu')) { st.menu = null; closed = true; if (!t) { render(); return; } }
  if (!t) return;
  // un clic dentro del modal no lo cierra: solo el fondo (mbg) y sus botones (si cerró una lista abierta, se vuelve a pintar)
  if (t.dataset.act === 'mbg' && e.target.closest('[data-stop]')) { if (closed) render(); return; }
  const a = t.dataset.act, v = t.dataset.v;
  if (/^(pf|op|cal|ct|txdl)/.test(a)) { if (/^(pf|op|ct)/.test(a) && t.tagName === 'A') e.preventDefault(); if (pfAct(a, v, t)) return; }
  switch (a) {
    case 'noop': return;
    case 'go': e.preventDefault(); go(t.dataset.to); return;
    case 'toast': toastMsg(t.dataset.msg); return;
    case 'tclose': st.toast = null; break;
    case 'menu': st.menu = st.menu === t.dataset.id ? null : t.dataset.id; break;
    // clientes
    case 'clitab': st.cli.tab = v; st.cli.page = 1; cliLoad(); return;
    case 'clipage': st.cli.page = Math.max(1, +v); break;
    case 'cliclearq': st.cli.q = ''; cliLoad(); return;
    case 'cliclearall': st.cli.q = ''; st.cli.f = {}; st.cli.score = ''; st.cli.hoy = false; cliLoad(); return;
    case 'clihoy': st.cli.hoy = !st.cli.hoy; cliLoad(); return;
    case 'clirmf': if (v === 'score') st.cli.score = ''; delete st.cli.f[v]; cliLoad(); return;
    case 'cliscore': st.cli.score = v; st.menu = null; cliLoad(); return;
    case 'clipanel': st.cli.fd = { ...st.cli.f }; st.cli.panel = true; break;
    case 'clipanelx': st.cli.panel = false; break;
    case 'clifclear': st.cli.fd = {}; break;
    case 'clifsel': st.cli.fd[t.dataset.k] = v; st.menu = null; break;
    case 'cliapply': st.cli.f = { ...st.cli.fd }; if (st.cli.f.score) { st.cli.score = st.cli.f.score; delete st.cli.f.score; } st.cli.panel = false; cliLoad(); toastMsg('Filtros aplicados', 'info'); return;
    case 'cliopen': { const x = [...getCreatedClients(), ...CLIENTES, ...RED].find(c => c.id === v); if (!x) return; if (x.id.startsWith('r')) { toastMsg(`${x.name} ${x.last} · NUC ${x.nuc}`, 'info', 'Los contactos de la red ataskate se muestran protegidos.'); return; } location.hash = 'perfil/' + encodeURIComponent(x.id); return; }
    // otras fuentes: verificar con teléfono o correo antes de cargar al cliente en Cliente nuevo
    case 'extver': st.modal = { type: 'verify', i: Number(v), val: '', err: '' }; render(); setTimeout(() => { const el = document.querySelector('[data-fk="vfy"]'); if (el) el.focus(); }, 0); return;
    case 'vfyok': {
      if (!st.modal) return;
      const x = EXT_CLI[st.modal.i], val = st.modal.val.trim(), d = val.replace(/\D/g, '');
      const ok = val.includes('@') ? norm(val) === norm(x.email) : d.length >= 10 && d.slice(-10) === x.phone;
      // si no coincide, el error queda bajo el campo y el foco regresa al campo (cursor al final) para corregirlo
      if (!ok) { st.modal.err = 'El dato no coincide con el registro. Confírmalo con el cliente e intenta de nuevo.'; render(); const el = document.querySelector('[data-fk="vfy"]'); if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } return; }
      st.modal = null; location.href = 'cliente-nuevo.html?cargar=' + encodeURIComponent(x.id); return;
    }
    case 'mbg': case 'mclose': closeModal(); return;
    // pestaña "Prototipo" del riel (../demo.js): escribe la búsqueda de prueba en el listado y cierra el panel para que se vea el efecto
    case 'protoq': {
      const pn = t.closest('[data-proto-panel]'), tb = document.getElementById('demoProtoTab');
      if (pn && !pn.hidden) { pn.hidden = true; if (tb) tb.setAttribute('aria-expanded', 'false'); }
      Object.assign(st.cli, { q: t.dataset.q, f: {}, score: '', hoy: false, panel: false }); st.modal = null;
      if (st.screen !== 'clients') { st.screen = 'clients'; window.scrollTo(0, 0); }
      cliLoad(); return;
    }
    // pestaña "Prototipo": estado de carga estático del listado (skeleton de la DS Table); otro clic lo quita
    case 'protocarga': st.cli.loading = !st.cli.loading; if (st.screen !== 'clients') { st.screen = 'clients'; history.pushState(null, '', location.pathname + location.search); } break;
    // pestaña "Prototipo": abre el perfil de ejemplo (en su React, PrototypeBar "Ver ejemplo:")
    case 'protoperfil': {
      const pn = t.closest('[data-proto-panel]'), tb = document.getElementById('demoProtoTab');
      if (pn && !pn.hidden) { pn.hidden = true; if (tb) tb.setAttribute('aria-expanded', 'false'); }
      st.modal = null; location.hash = 'perfil/' + v; return;
    }
    default: return;
  }
  render();
});

document.addEventListener('input', e => {
  const t = e.target; const k = t.dataset.in; if (!k) return;
  switch (k) {
    case 'opq': { const S = opState(t.dataset.k); S.q = t.value; S.page = 1; break; }
    /* DS AutoSelect "Cliente que se queda": al escribir se filtra la lista y se suelta el cliente elegido */
    case 'pfauto': { const p = st.prof; p.dQuery = t.value; p.dTarget = ''; p.dSure = false; st.menu = 'pfauto'; break; }
    // el detalle del reporte se guarda sin volver a pintar (el cursor no se pierde); solo se repinta al quitar el error de "obligatorio"
    case 'pfrd': { const p = st.prof, err = p.rTried && !p.rDetail.trim(); p.rDetail = t.value; if (err && p.rDetail.trim()) render(); return; }
    case 'cliq': st.cli.q = t.value; clearTimeout(window.__cq); window.__cq = setTimeout(cliLoad, 250); return;
    case 'clif': st.cli.fd[t.dataset.k] = t.value; break;
    // solo se vuelve a pintar si cambia el error o si el campo pasa de vacío a lleno (habilita "Verificar y cargar")
    case 'vfy': { if (!st.modal) return; const had = !!st.modal.err, was = !!st.modal.val.trim(); st.modal.val = t.value; st.modal.err = ''; if (had || was !== !!t.value.trim()) render(); return; }
    default: return;
  }
  render();
});
// DS Checkbox de la baja por duplicado y DS AutoSelect: la lista se abre al entrar al campo
document.addEventListener('change', e => { const t = e.target; if (t.dataset && t.dataset.chk === 'pfsure') { st.prof.dSure = t.checked; render(); } });
document.addEventListener('focusin', e => { const t = e.target; if (t.dataset && t.dataset.in === 'pfauto' && st.menu !== 'pfauto' && !rendering) { st.menu = 'pfauto'; render(); } });
document.addEventListener('keydown', e => {
  const t = e.target;
  // encabezado de la GroupCard (role=button): Enter o espacio la abre y la cierra
  if ((e.key === 'Enter' || e.key === ' ') && t.getAttribute && t.getAttribute('role') === 'button' && t.dataset.act) { e.preventDefault(); t.click(); return; }
  if (e.key === 'Escape' && st.menu === 'cal' && st.prof.cal && st.prof.cal.sel) { st.prof.cal.sel = null; render(); return; }
  const pfOpen = st.txRow || (st.ct && st.ct.notes) || (st.screen === 'client' && (st.prof.dlg || st.prof.detail));
  if (st.modal || pfOpen) {
    if (e.key === 'Escape') { if (st.menu) { st.menu = null; render(); } else closeModal(); return; }
    if (e.key === 'Enter' && t.dataset && t.dataset.in === 'vfy') { const b = document.querySelector('[data-act="vfyok"]'); if (b && !b.disabled) b.click(); return; }
    // aria-modal: el Tab no sale del modal
    if (e.key === 'Tab') {
      const ms = document.querySelectorAll('.cli-modal'), top = ms[ms.length - 1]; if (!top) return;
      const f = [...top.querySelectorAll('button:not([disabled]), input, textarea, a[href], [tabindex="0"]')]; if (!f.length) return;
      const i = f.indexOf(document.activeElement);
      if (i < 0) { e.preventDefault(); f[0].focus(); } else if (e.shiftKey && i === 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
    return;
  }
  if (e.key === 'Escape' && st.menu) { st.menu = null; render(); }
  if (e.key === 'Escape' && st.cli.panel) { st.cli.panel = false; render(); }
  if (e.key === 'Enter' && t.classList && t.classList.contains('crow')) t.click();
});

// Rutas (su React: /Directory, /Directory/<id> y /Directory/<id>/contrato/<folio>): #perfil/<id> abre el perfil del cliente y
// #perfil/<id>/contrato/<folio> el detalle del contrato; sin hash, el listado. Cliente nuevo y Editar cliente regresan con ./#perfil/<id>.
function applyHash() {
  const m = /^#perfil\/([^/]+)(?:\/contrato\/(.+))?$/.exec(location.hash);
  if (!m) { if (st.screen !== 'clients') st.screen = 'clients'; return; }
  const id = decodeURIComponent(m[1]), folio = m[2] && decodeURIComponent(m[2]);
  // como en su React, cada pantalla empieza con su estado limpio (tabs, filtros y modales)
  if (folio) { if (st.screen !== 'contract' || !st.ct || st.ct.id !== id || st.ct.folio !== folio) st.ct = newCt(id, folio); if (st.prof.id !== id) st.prof = newProf(id); st.screen = 'contract'; }
  else { if (st.screen !== 'client' || st.prof.id !== id) st.prof = newProf(id); st.screen = 'client'; }
  st.menu = null; st.txRow = null;
}
function routeFromHash() { applyHash(); render(); window.scrollTo(0, 0); }
addEventListener('hashchange', routeFromHash);
applyHash();
{ const pt = takePendingToast(); if (pt) setTimeout(() => toastMsg(pt.title, 'ok', pt.message), 50); }
// Cliente recién creado (useClientsRedesign): sale primero en la lista, resaltado y con el aviso "Cliente creado"; se lee una sola vez
{
  const lastId = takeLastCreatedId(), last = lastId && getCreatedClients().find(c => c.id === lastId);
  if (last) { st.cli.fresh = lastId; st.screen = 'clients'; setTimeout(() => toastMsg('Cliente creado', 'ok', fullName(last)), 50); }
}
render();
// al regresar con Atrás el navegador restaura la página desde su caché (bfcache) con el modal "Verifica al cliente" todavía pintado aunque st.modal ya es null: se vuelve a pintar para que coincida con el estado
window.addEventListener('pageshow', e => { if (e.persisted) render(); });
window.__st = st;
})();
