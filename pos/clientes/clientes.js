/* Ataskate POS (Operativo) · Clientes: listado, filtros y perfil del cliente.
   Prototipo de Product Design (rama del equipo del repo del equipo, commit 8f7723ad6), traído al prototipo del POS:
   el header y el menú lateral son los compartidos (../navbar.js y ../menu-op.js); aquí solo vive el contenido del módulo.
   Se quitaron las pantallas de Home, Inventario y Nuevo artículo que venían en el mismo archivo (ya existen en ../home/ y ../inventario/). */

// Íconos exportados directamente desde el archivo de Figma "Inventario"
const S = (w, h, body) => `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const ICONS = {
  search: S(24,24,'<path d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.146 15.371 4.888 14.113C3.62933 12.8543 3 11.3167 3 9.5C3 7.68333 3.62933 6.14567 4.888 4.887C6.146 3.629 7.68333 3 9.5 3C11.3167 3 12.8543 3.629 14.113 4.887C15.371 6.14567 16 7.68333 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8127 13.5627 12.688 12.688C13.5627 11.8127 14 10.75 14 9.5C14 8.25 13.5627 7.18733 12.688 6.312C11.8127 5.43733 10.75 5 9.5 5C8.25 5 7.18733 5.43733 6.312 6.312C5.43733 7.18733 5 8.25 5 9.5C5 10.75 5.43733 11.8127 6.312 12.688C7.18733 13.5627 8.25 14 9.5 14Z" fill="#5A5AFF"/>'),
  plus: S(24,24,'<path d="M11 19V13H5V11H11V5H13V11H19V13H13V19H11Z" fill="#5A5AFF"/>'),
  plusWhite: S(20,20,'<path d="M9.16675 15.8346V10.8346H4.16675V9.16797H9.16675V4.16797H10.8334V9.16797H15.8334V10.8346H10.8334V15.8346H9.16675Z" fill="#fff"/>'),
  addplus: S(20,20,'<path d="M9.16675 15.8346V10.8346H4.16675V9.16797H9.16675V4.16797H10.8334V9.16797H15.8334V10.8346H10.8334V15.8346H9.16675Z" fill="#54575C"/>'),
  check16: S(16,16,'<path d="M6.36641 12.001L2.56641 8.20104L3.51641 7.25104L6.36641 10.101L12.4831 3.98438L13.4331 4.93438L6.36641 12.001Z" fill="white"/>'),
  chevDown: S(24,24,'<path d="M5.7 9.7L7.1 8.3L11.7 12.9L16.3 8.3L17.7 9.7L11.7 15.7L5.7 9.7Z" fill="#5A5AFF"/>'),
  rowRight: S(28,28,'<path d="M11.8327 19L10.666 17.8333L14.4993 14L10.666 10.1667L11.8327 9L16.8327 14L11.8327 19Z" fill="#5A5AFF"/>'),
  help: S(20,20,'<circle cx="10" cy="10" r="7.5" stroke="#D4D6D8" stroke-width="1.67"/><path d="M8 7.6C8.3 6.8 9.1 6.4 10 6.4c1.1 0 1.9.7 1.9 1.6 0 1.3-1.9 1.5-1.9 3" stroke="#D4D6D8" stroke-width="1.5" stroke-linecap="round"/><circle cx="10" cy="13.9" r="1" fill="#D4D6D8"/>'),
  close: S(24,24,'<path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z" fill="#5A5AFF"/>'),
  info: S(24,24,'<path d="M10.7754 16.8359H12.7754V10.8359H10.7754V16.8359ZM11.7754 8.83594C12.0587 8.83594 12.2962 8.7401 12.4879 8.54844C12.6796 8.35677 12.7754 8.11927 12.7754 7.83594C12.7754 7.5526 12.6796 7.3151 12.4879 7.12344C12.2962 6.93177 12.0587 6.83594 11.7754 6.83594C11.4921 6.83594 11.2546 6.93177 11.0629 7.12344C10.8712 7.3151 10.7754 7.5526 10.7754 7.83594C10.7754 8.11927 10.8712 8.35677 11.0629 8.54844C11.2546 8.7401 11.4921 8.83594 11.7754 8.83594ZM11.7754 21.8359C10.3921 21.8359 9.09206 21.5734 7.87539 21.0484C6.65872 20.5234 5.60039 19.8109 4.70039 18.9109C3.80039 18.0109 3.08789 16.9526 2.56289 15.7359C2.03789 14.5193 1.77539 13.2193 1.77539 11.8359C1.77539 10.4526 2.03789 9.1526 2.56289 7.93594C3.08789 6.71927 3.80039 5.66094 4.70039 4.76094C5.60039 3.86094 6.65872 3.14844 7.87539 2.62344C9.09206 2.09844 10.3921 1.83594 11.7754 1.83594C13.1587 1.83594 14.4587 2.09844 15.6754 2.62344C16.8921 3.14844 17.9504 3.86094 18.8504 4.76094C19.7504 5.66094 20.4629 6.71927 20.9879 7.93594C21.5129 9.1526 21.7754 10.4526 21.7754 11.8359C21.7754 13.2193 21.5129 14.5193 20.9879 15.7359C20.4629 16.9526 19.7504 18.0109 18.8504 18.9109C17.9504 19.8109 16.8921 20.5234 15.6754 21.0484C14.4587 21.5734 13.1587 21.8359 11.7754 21.8359Z" fill="#008FCC"/>'),
  success: S(24,24,'<circle cx="12" cy="12" r="10" fill="#309C60"/><path d="M10.6 16.6L17.65 9.55L16.25 8.15L10.6 13.8L7.75 10.95L6.35 12.35L10.6 16.6Z" fill="#fff"/>'),
  error: S(24,24,'<circle cx="12" cy="12" r="10" fill="#A82424"/><path d="M8.4 17L12 13.4L15.6 17L17 15.6L13.4 12L17 8.4L15.6 7L12 10.6L8.4 7L7 8.4L10.6 12L7 15.6L8.4 17Z" fill="#fff"/>'),
};
ICONS.warn = S(24,24,'<path d="M1 21L12 2L23 21H1Z" fill="#CC9200"/><path d="M11 16V10H13V16H11ZM12 19C11.72 19 11.48 18.9 11.29 18.71C11.1 18.52 11 18.28 11 18C11 17.72 11.1 17.48 11.29 17.29C11.48 17.1 11.72 17 12 17C12.28 17 12.52 17.1 12.71 17.29C12.9 17.48 13 17.72 13 18C13 18.28 12.9 18.52 12.71 18.71C12.52 18.9 12.28 19 12 19Z" fill="#fff"/>');

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

// ---------- Clientes (datos ficticios para el prototipo) ----------
const CLIENTES = [
  ['Mariana', 'Gómez Ruiz', 1131, 'Mexicana', 'mariana.gomez@ejemplo.com', '5512345678', 'Excelente'],
  ['Luis Alberto', 'Hernández Soto', 1129, 'Mexicana', 'luis.hdz@ejemplo.com', '8187654321', 'Bueno'],
  ['Ana Sofía', 'Martínez Lara', 1127, 'Mexicana', 'anasofia.ml@ejemplo.com', '3311122233', 'Regular'],
  ['Jorge', 'Ramírez Cruz', 1124, 'Mexicana', 'jorge.ramirez@ejemplo.com', '2224455667', 'Bueno'],
  ['Daniela', 'Torres Vega', 1120, 'Mexicana', 'dani.torres@ejemplo.com', '4421239876', 'Excelente'],
  ['Carlos', 'Mendoza Ortiz', 1118, 'Mexicana', 'c.mendoza@ejemplo.com', '5598761234', 'Regular'],
  ['Valeria', 'Castillo Ríos', 1115, 'Mexicana', 'vale.castillo@ejemplo.com', '9981234567', 'Nuevo'],
  ['Miguel Ángel', 'Flores Díaz', 1112, 'Mexicana', 'miguel.flores@ejemplo.com', '6561239870', 'Bueno'],
  ['Fernanda', 'Navarro Peña', 1109, 'Mexicana', 'fer.navarro@ejemplo.com', '4771122334', 'Regular'],
  ['Ricardo', 'Silva Medina', 1105, 'Estadounidense', 'rsilva@ejemplo.com', '6649871234', 'Nuevo'],
  ['Paola', 'Jiménez Rojas', 1101, 'Mexicana', 'paola.jr@ejemplo.com', '2281234598', 'Excelente'],
  ['Héctor', 'Morales León', 1098, 'Mexicana', 'hector.ml@ejemplo.com', '5545671230', 'Regular'],
  ['Gabriela', 'Ruiz Campos', 1094, 'Mexicana', 'gaby.ruiz@ejemplo.com', '3398712345', 'Bueno'],
  ['Emilio', 'Vargas Núñez', 1090, 'Canadiense', 'emilio.vn@ejemplo.com', '8112349876', 'Nuevo'],
  ['Lucía', 'Reyes Fuentes', 1087, 'Mexicana', 'lucia.reyes@ejemplo.com', '7221234567', 'Regular'],
  ['Andrés', 'Ortega Salas', 1083, 'Mexicana', 'andres.os@ejemplo.com', '6181239876', 'Bueno'],
  ['Regina', 'Aguilar Mora', 1080, 'Mexicana', 'regina.am@ejemplo.com', '9611234567', 'Excelente'],
  ['Tomás', 'Delgado Paz', 1076, 'Mexicana', 'tomas.dp@ejemplo.com', '6671239876', 'Regular'],
  ['Ximena', 'Cabrera Luna', 1072, 'Mexicana', 'ximena.cl@ejemplo.com', '4441234567', 'Nuevo'],
  ['Diego', 'Santos Ibarra', 1069, 'Mexicana', 'diego.si@ejemplo.com', '8711239876', 'Bueno'],
].map((r, i) => ({ id: 'c' + r[2], name: r[0], last: r[1], nuc: r[2], nat: r[3], email: r[4], phone: r[5], score: r[6] }));

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
  cli: { tab: 'mis', q: '', page: 1, loading: false, f: {}, fd: null, panel: false, score: '', fresh: null },
  prof: { id: null, panel: null, itab: 'personal', editing: false, form: {}, qa: true, q: '', est: '', sort: 'asc', page: 1 },
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
  root.innerHTML = `<div class="screen ${changed ? 'fade' : ''}">${screen()}</div>` + toast();

  document.querySelectorAll('[data-sk]').forEach(el => { if (scrolls[el.dataset.sk] != null) el.scrollTop = scrolls[el.dataset.sk]; });
  if (fk) { const el = document.querySelector(`[data-fk="${fk}"]`); if (el) { el.focus(); try { el.setSelectionRange(s0, s1); } catch (e) {} } }
  rendering = false;
}
// Home vive en ../home/ (módulo de Daniel); Clientes y Perfil son pantallas de este módulo
function go(screen) { if (screen === 'home') { location.href = '../home/'; return; } st.screen = screen; st.menu = null; render(); window.scrollTo(0, 0); }
function toastMsg(msg, kind = 'info', text = '') { st.toast = { msg, kind, text, id: ++uid }; const id = st.toast.id; render(); setTimeout(() => { if (st.toast && st.toast.id === id) { st.toast = null; render(); } }, 5000); }


function screen() {
  switch (st.screen) {
    case 'clients': return clientsScreen();
    case 'client': return clientProfileScreen();
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
const SCORES = ['Excelente', 'Bueno', 'Regular', 'Nuevo'];
const NATS = ['Mexicana', 'Canadiense', 'Estadounidense'];
const FLABEL = { nuc: 'NUC', nombre: 'Nombre', nat: 'Nacionalidad', correo: 'Correo', tel: 'Teléfono', score: 'Score' };
function cliBase() { return st.cli.tab === 'mis' ? CLIENTES : RED; }
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
function scoreTag(s) { return s === 'Nuevo' ? '<span class="cap">Cliente nuevo</span>' : `<span class="stag ${SCORE_TAG[s] || 'gray'}">${esc(s)}</span>`; }
function cliLoad() { st.cli.loading = true; st.cli.page = 1; render(); clearTimeout(cliLoad.t); cliLoad.t = setTimeout(() => { st.cli.loading = false; render(); }, 380); }
// pestañas de sesión al pie, iguales a las de ../inventario/ (Figma: Top Container · "Ventana principal" + "+")
function sesiones() {
  return `<nav class="cli-sessions" aria-label="Sesiones de trabajo"><span class="cli-sessions__tab" aria-current="page">Ventana principal<span class="cli-sessions__help" title="Cada pestaña es una sesión de trabajo con su propio carrito">${ICONS.help}</span></span><button class="cli-sessions__add" type="button" data-act="toast" data-msg="Nueva ventana de trabajo" aria-label="Abrir otra sesión" title="Abrir otra sesión">${ICONS.addplus}</button></nav>`;
}
function clientsScreen() {
  const c = st.cli, f = cliAllFilters();
  const all = cliBase(), list = cliFilter(all, c.q, f).filter(x => !c.hoy || venceHoy(x));
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE)); if (c.page > pages) c.page = pages;
  const from = (c.page - 1) * PER_PAGE, slice = list.slice(from, from + PER_PAGE);
  const red = c.tab === 'red';
  const venceHoyN = CLIENTES.filter(venceHoy).length;
  const chips = Object.entries(f).filter(([, v]) => v).map(([k, v]) => `<span class="fchip">${ICONS.check16.replace('width="16" height="16"', 'width="20" height="20"').replace('fill="white"', 'fill="#0D166B"')}${FLABEL[k]}: ${esc(v)}<button data-act="clirmf" data-v="${k}" aria-label="Quitar filtro ${FLABEL[k]}">${ICONS.close.replace('width="24" height="24"', 'width="18" height="18"')}</button></span>`);
  if (c.hoy) chips.unshift(`<span class="fchip">${ICONS.check16.replace('width="16" height="16"', 'width="20" height="20"').replace('fill="white"', 'fill="#0D166B"')}Contratos que vencen hoy<button data-act="clihoy" aria-label="Quitar filtro Contratos que vencen hoy">${ICONS.close.replace('width="24" height="24"', 'width="18" height="18"')}</button></span>`);
  if (c.q) chips.unshift(`<span class="fchip">${ICONS.check16.replace('width="16" height="16"', 'width="20" height="20"').replace('fill="white"', 'fill="#0D166B"')}“${esc(c.q)}”<button data-act="cliclearq" aria-label="Quitar búsqueda">${ICONS.close.replace('width="24" height="24"', 'width="18" height="18"')}</button></span>`);
  const nf = Object.values(c.f).filter(Boolean).length;
  const ncol = red ? 7 : 6;
  const head = `<thead><tr><th>Cliente</th><th>Nacionalidad</th><th>Correo electrónico</th><th>Teléfono</th><th>Score</th>${red ? '<th>Casa de empeño</th>' : ''}<th class="ib"><span class="sr">Acciones</span></th></tr></thead>`;
  const skel = Array.from({ length: Math.min(PER_PAGE, Math.max(3, slice.length)) }, () => `<tr>${Array.from({ length: ncol - 1 }, () => '<td class="load"><span class="shim"></span></td>').join('')}<td class="ib"></td></tr>`).join('');
  const rowsH = slice.map(x => `<tr class="crow ${x.id === c.fresh ? 'fresh' : ''}" data-act="cliopen" data-v="${x.id}" tabindex="0" aria-label="Ver ${esc(x.name + ' ' + x.last)}">
      <td class="user"><div class="u"><span class="avatar">${initials(x)}</span><div class="tx"><p class="m">${hl(x.name + ' ' + x.last, c.q)}${x.id === c.fresh ? ' <span class="stag green">Nuevo</span>' : ''}</p><p class="d">${red ? 'NUC en su casa' : 'NUC'}: ${hl(String(x.nuc), c.q)}</p></div></div></td>
      <td>${esc(x.nat)}</td>
      <td class="mail" title="${esc(x.email)}">${hl(x.email, c.q)}</td>
      <td class="num">${hl(x.phone, c.q)}</td>
      <td>${scoreTag(x.score)}</td>
      ${red ? `<td>${x.empresa === '—' ? '<span class="cap">Sin empresa</span>' : esc(x.empresa)}</td>` : ''}
      <td class="ib"><span class="tib">${ICONS.rowRight}</span></td></tr>`).join('');
  const empty = c.q || chips.length
    ? `<div class="cempty"><p class="t">No encontramos clientes${c.q ? ` para “${esc(c.q)}”` : ''}</p><p class="cap">Revisa lo que escribiste o quita algunos filtros.</p><button class="btn btn-outline" style="height:36px;padding:8px 16px" data-act="cliclearall">Limpiar búsqueda y filtros</button></div>`
    : `<div class="cempty"><p class="t">Aún no tienes clientes</p><p class="cap">Registra tu primer cliente para empezar a operar.</p><a class="btn btn-primary ic-l" style="height:36px;padding:8px 16px" href="cliente-nuevo.html">${ic('plusWhite')}Crear cliente</a></div>`;
  const pager = `<nav class="dpager" aria-label="Paginación"><span class="g"><button data-act="clipage" data-v="1" aria-label="Primera página" ${c.page === 1 ? 'disabled' : ''}>${PG.first}</button><button data-act="clipage" data-v="${c.page - 1}" aria-label="Página anterior" ${c.page === 1 ? 'disabled' : ''}>${PG.prev}</button></span><span class="t">${list.length ? `${from + 1}-${from + slice.length} de ${list.length} resultados` : '0 resultados'}</span><span class="g"><button data-act="clipage" data-v="${c.page + 1}" aria-label="Página siguiente" ${c.page >= pages ? 'disabled' : ''}>${PG.next}</button><button data-act="clipage" data-v="${pages}" aria-label="Última página" ${c.page >= pages ? 'disabled' : ''}>${PG.last}</button></span></nav>`;
  const FIL = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M11 20C10.7167 20 10.4794 19.904 10.288 19.712C10.096 19.5207 10 19.2833 10 19V13L4.20003 5.6C3.95003 5.26667 3.9127 4.91667 4.08803 4.55C4.2627 4.18333 4.5667 4 5.00003 4H19C19.4334 4 19.7377 4.18333 19.913 4.55C20.0877 4.91667 20.05 5.26667 19.8 5.6L14 13V19C14 19.2833 13.9044 19.5207 13.713 19.712C13.521 19.904 13.2834 20 13 20H11ZM12 12.3L16.95 6H7.05003L12 12.3Z" fill="currentColor"/></svg>';
  const AWARD = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M7 2H17V9.85C17 10.2333 16.9167 10.575 16.75 10.875C16.5833 11.175 16.35 11.4167 16.05 11.6L12.5 13.7L13.2 16H17L13.9 18.2L15.1 22L12 19.65L8.9 22L10.1 18.2L7 16H10.8L11.5 13.7L7.95 11.6C7.65 11.4167 7.41667 11.175 7.25 10.875C7.08333 10.575 7 10.2333 7 9.85V2ZM9 4V9.85L11 11.05V4H9ZM15 4H13V11.05L15 9.85V4Z" fill="currentColor"/></svg>';
  const CARET = '<span class="car"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 15L7 10H17L12 15Z" fill="currentColor"/></svg></span>';
  const scoreOpen = st.menu === 'cliscore';
  const scoreSel = `<div style="position:relative"><button type="button" class="tfc ${c.score ? 'sel' : ''} ${scoreOpen ? 'open' : ''}" data-act="menu" data-id="cliscore" aria-haspopup="listbox" aria-expanded="${scoreOpen}">${AWARD}<span>${c.score ? esc(c.score) : 'Score'}</span>${CARET}</button>${scoreOpen ? `<div class="tfc-list" role="listbox">${SCORES.map(o => `<div role="option" aria-selected="${o === c.score}" class="${o === c.score ? 'on' : ''}" data-act="cliscore" data-v="${o === c.score ? '' : o}">${o}</div>`).join('')}</div>` : ''}</div>`;
  const count = c.loading ? 'Buscando…' : (c.q || chips.length ? `<b>${list.length}</b> de ${all.length} ${red ? 'contactos' : 'clientes'}` : `${all.length} ${red ? 'contactos' : 'clientes'}`);
  return `<div class="cli">
    <nav aria-label="Breadcrumb" class="ds-breadcrumb"><ol class="pos-crumbs"><li><a href="../home/" class="ds-breadcrumb__link">Home</a><span class="ds-breadcrumb__sep" aria-hidden="true"><img class="pos-crumb-sep" src="../assets/ds/ArrowForwardIos-D4D6D8.svg" alt="" /></span></li><li><span class="ds-breadcrumb__current" aria-current="page">Clientes</span></li></ol></nav>
    <div class="cli-head"><div><h1 class="cli-title">Clientes</h1><p class="cli-sub">Busca clientes registrados o da de alta uno nuevo.</p></div>
      <div class="acts"><a class="btn btn-primary btn-l ic-l" href="cliente-nuevo.html">${ic('plusWhite')}Crear cliente</a></div></div>
    <div class="ctable">
      ${red ? `<div class="redinfo"><span class="cap" style="font-size:14px">Contactos registrados por otras casas de empeño de la red ataskate. Sus datos se muestran protegidos.</span><span class="chip-i">${ICONS.info.replace(/width="\d+" height="\d+"/, 'width="12" height="12"')}Suscripción activa</span></div>` : ''}
      <div class="ctools">
        <div class="dsearch"><input placeholder="Buscar por nombre, NUC, correo o teléfono" aria-label="Buscar clientes" data-in="cliq" data-fk="cliq" value="${esc(c.q)}">${c.q ? `<button class="sclear" data-act="cliclearq" aria-label="Limpiar búsqueda">${ICONS.close.replace('width="24" height="24"', 'width="20" height="20"')}</button>` : `<span class="s" aria-hidden="true">${ic('search')}</span>`}</div>
        <div class="tfc-g"><button type="button" class="tfc hoy ${c.hoy ? 'sel' : ''}" data-act="clihoy" aria-pressed="${!!c.hoy}" title="Muestra solo a los clientes que tienen contratos que vencen hoy" aria-label="Clientes con contratos que vencen hoy: ${venceHoyN}"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 22q-.825 0-1.412-.587Q3 20.825 3 20V6q0-.825.588-1.412Q4.175 4 5 4h1V2h2v2h8V2h2v2h1q.825 0 1.413.588Q21 5.175 21 6v14q0 .825-.587 1.413Q19.825 22 19 22Zm0-2h14V10H5Zm0-12h14V6H5Zm0 0V6Zm7 6q-.425 0-.712-.288Q11 13.425 11 13t.288-.713Q11.575 12 12 12t.713.287Q13 12.575 13 13t-.287.712Q12.425 14 12 14Zm-4 0q-.425 0-.713-.288Q7 13.425 7 13t.287-.713Q7.575 12 8 12t.713.287Q9 12.575 9 13t-.287.712Q8.425 14 8 14Zm8 0q-.425 0-.712-.288Q15 13.425 15 13t.288-.713Q15.575 12 16 12t.712.287Q17 12.575 17 13t-.288.712Q16.425 14 16 14Zm-4 4q-.425 0-.712-.288Q11 17.425 11 17t.288-.712Q11.575 16 12 16t.713.288Q13 16.575 13 17t-.287.712Q12.425 18 12 18Zm-4 0q-.425 0-.713-.288Q7 17.425 7 17t.287-.712Q7.575 16 8 16t.713.288Q9 16.575 9 17t-.287.712Q8.425 18 8 18Zm8 0q-.425 0-.712-.288Q15 17.425 15 17t.288-.712Q15.575 16 16 16t.712.288Q17 16.575 17 17t-.288.712Q16.425 18 16 18Z" fill="currentColor"/></svg><span>Contratos que vencen hoy</span><span class="hoy-n">${venceHoyN}</span></button>${scoreSel}
        <button type="button" class="tfc ${nf ? 'sel' : ''} ${c.panel ? 'open' : ''}" data-act="clipanel" aria-haspopup="dialog" aria-expanded="${!!c.panel}">${FIL}<span>${nf ? `Filtro (${nf})` : 'Filtro'}</span>${CARET}</button></div>
      </div>
      ${chips.length ? `<div class="cmeta"><div class="fl"><span>Filtrado por:</span>${chips.join('')}<button class="linkbtn" data-act="cliclearall">Limpiar todo</button></div><span class="cap" aria-live="polite">${count}</span></div>` : ''}
      <div class="dtw"><table class="dt neutral">${head}<tbody>${c.loading ? skel : (slice.length ? rowsH : `<tr><td class="empty" colspan="${ncol}">${empty}</td></tr>`)}</tbody></table></div>
      ${pager}
    </div>
    ${c.panel ? cliPanel() : ''}
  </div>
  ${sesiones()}`;
}
function cliPanel() {
  const d = st.cli.fd; const n = cliFilter(cliBase(), st.cli.q, { ...d, score: d.score || st.cli.score }).length;
  const inp = (k, ph) => `<label class="pf"><span>${FLABEL[k]}</span><span class="field"><input data-in="clif" data-k="${k}" data-fk="clif-${k}" value="${esc(d[k] || '')}" placeholder="${ph}"></span></label>`;
  const sel = (k, opts) => `<label class="pf pf-sel"><span>${FLABEL[k]}</span><span style="position:relative;display:block"><button class="field psel ${st.menu === 'pf-' + k ? 'open' : ''}" data-act="menu" data-id="pf-${k}" aria-haspopup="listbox" aria-expanded="${st.menu === 'pf-' + k}"><span class="${d[k] ? '' : 'ph'}">${esc(d[k] || 'Selecciona')}</span>${DS_CHEV}</button>${st.menu === 'pf-' + k ? `<div class="ddl-menu" role="listbox" style="left:0;right:0;top:44px">${['', ...opts].map(o => `<button role="option" aria-selected="${o === (d[k] || '')}" class="${o === (d[k] || '') ? 'on' : ''}" data-act="clifsel" data-k="${k}" data-v="${o}">${o || 'Todos'}</button>`).join('')}</div>` : ''}</span></label>`;
  return `<div class="side-ov" data-act="clipanelx"></div><aside class="side" role="dialog" aria-label="Filtrar clientes">
    <div class="side-h"><h2>Filtrar</h2><button class="side-x" data-act="clipanelx" aria-label="Cerrar">${ICONS.close.replace('fill="#5A5AFF"', 'fill="#2A2C2F"')}</button></div><button class="linkbtn side-clear" data-act="clifclear">Limpiar filtros</button>
    <div class="side-b">${inp('nuc', 'Ej. 1129')}${inp('nombre', 'Nombre o apellido')}${sel('nat', NATS)}${inp('correo', 'correo@ejemplo.com')}${inp('tel', '10 dígitos')}${sel('score', SCORES)}</div>
    <div class="side-f"><button class="btn btn-ter" data-act="clipanelx">Cancelar</button><button class="btn btn-primary" data-act="cliapply" ${n ? '' : 'disabled'}>${n ? `Ver ${n} resultado${n === 1 ? '' : 's'}` : 'Sin resultados'}</button></div>
  </aside>`;
}

// ---------- PERFIL DE CLIENTE (ClientProfile mejorado · mismos componentes que Clientes, Cliente nuevo y Home) ----------
const PI = {
  user: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5.85 17.1q1.275-.975 2.85-1.537Q10.275 15 12 15t3.3.563q1.575.562 2.85 1.537q.875-1.025 1.363-2.325Q20 13.475 20 12q0-3.325-2.337-5.663Q15.325 4 12 4T6.338 6.337Q4 8.675 4 12q0 1.475.488 2.775q.487 1.3 1.362 2.325ZM12 13q-1.475 0-2.488-1.012Q8.5 10.975 8.5 9.5t1.012-2.488Q10.525 6 12 6t2.488 1.012Q15.5 8.025 15.5 9.5t-1.012 2.488Q13.475 13 12 13Zm0 9q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9t2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787t3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Z" fill="currentColor"/></svg>',
  id: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 22q-.825 0-1.412-.587Q2 20.825 2 20V9q0-.825.588-1.413Q3.175 7 4 7h5V4q0-.825.588-1.413Q10.175 2 11 2h2q.825 0 1.413.587Q15 3.175 15 4v3h5q.825 0 1.413.587Q22 8.175 22 9v11q0 .825-.587 1.413Q20.825 22 20 22Zm0-2h16V9h-5q0 .825-.587 1.413Q13.825 11 13 11h-2q-.825 0-1.412-.587Q9 9.825 9 9H4Zm2-2h6v-.45q0-.425-.238-.787q-.237-.363-.662-.563q-.5-.225-1.012-.337Q9.575 15.75 9 15.75t-1.087.113q-.513.112-1.013.337q-.425.2-.662.563Q6 17.125 6 17.55Zm8-1.5h4V15h-4Zm-5-1.5q.625 0 1.062-.438q.438-.437.438-1.062t-.438-1.062Q9.625 12 9 12t-1.062.438Q7.5 12.875 7.5 13.5t.438 1.062Q8.375 15 9 15Zm5-1.5h4V12h-4ZM11 9h2V4h-2Z" fill="currentColor"/></svg>',
  phone: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19.95 21q-3.125 0-6.175-1.363q-3.05-1.362-5.55-3.862t-3.862-5.55Q3 7.175 3 4.05q0-.45.3-.75t.75-.3H8.1q.35 0 .625.238q.275.237.325.562l.65 3.5q.05.4-.025.675q-.075.275-.275.475L6.975 10.9q.5.925 1.187 1.787q.688.863 1.513 1.663q.775.775 1.625 1.438q.85.662 1.8 1.212l2.35-2.35q.225-.225.588-.338q.362-.112.712-.062l3.45.7q.35.1.575.362q.225.263.225.588v4.05q0 .45-.3.75t-.75.3Z" fill="currentColor"/></svg>',
  mail: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 20q-.825 0-1.412-.587Q2 18.825 2 18V6q0-.825.588-1.412Q3.175 4 4 4h16q.825 0 1.413.588Q22 5.175 22 6v12q0 .825-.587 1.413Q20.825 20 20 20Zm8-7L4 8v10h16V8Zm0-2l8-5H4ZM4 8V6v12Z" fill="currentColor"/></svg>',
  home: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 19h3v-6h6v6h3v-9l-6-4.5L6 10Zm-2 2V9l8-6l8 6v12h-7v-6h-2v6Zm8-8.75Z" fill="currentColor"/></svg>',
  edit: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575ZM3 21v-4.25L16.2 3.575q.3-.275.663-.425q.362-.15.762-.15t.775.15q.375.15.65.45L20.425 5q.3.275.437.65q.138.375.138.75q0 .4-.138.763q-.137.362-.437.662L7.25 21ZM19 6.4L17.6 5Zm-3.525 2.125l-.7-.725L16.2 9.225Z" fill="currentColor"/></svg>',
  debt: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 22q-1.25 0-2.125-.875T3 19v-3h3V2l1.5 1.5L9 2l1.5 1.5L12 2l1.5 1.5L15 2l1.5 1.5L18 2l1.5 1.5L21 2v17q0 1.25-.875 2.125T18 22Zm12-2q.425 0 .712-.288Q19 19.425 19 19V5H8v11h9v3q0 .425.288.712Q17.575 20 18 20ZM9 9V7h6v2Zm0 3v-2h6v2Zm8-3q-.425 0-.712-.288Q16 8.425 16 8t.288-.713Q16.575 7 17 7t.712.287Q18 7.575 18 8t-.288.712Q17.425 9 17 9Zm0 3q-.425 0-.712-.288Q16 11.425 16 11t.288-.713Q16.575 10 17 10t.712.287Q18 10.575 18 11t-.288.712Q17.425 12 17 12ZM6 20h9v-2H5v1q0 .425.288.712Q5.575 20 6 20Zm-1 0v-2Z" fill="currentColor"/></svg>',
  cash: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M14 13q-1.25 0-2.125-.875T11 10t.875-2.125T14 7t2.125.875T17 10t-.875 2.125T14 13Zm-7 3q-.825 0-1.412-.588Q5 14.825 5 14V6q0-.825.588-1.412Q6.175 4 7 4h14q.825 0 1.413.588Q23 5.175 23 6v8q0 .825-.587 1.412Q21.825 16 21 16Zm2-2h10q0-.825.588-1.413Q20.175 12 21 12V8q-.825 0-1.412-.588Q19 6.825 19 6H9q0 .825-.587 1.412Q7.825 8 7 8v4q.825 0 1.413.587Q9 13.175 9 14Zm9 6H3q-.825 0-1.412-.587Q1 18.825 1 18V7h2v11h15ZM7 14V6Z" fill="currentColor"/></svg>',
  person: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12Zm-8 8v-2.8q0-.85.438-1.563T5.6 14.55q1.55-.775 3.15-1.163T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20Zm2-2h12v-.8q0-.275-.137-.5t-.363-.35q-1.35-.675-2.725-1.012T12 15t-2.775.338T6.5 16.35q-.225.125-.363.35T6 17.2Zm6-8q.825 0 1.413-.587T14 8t-.587-1.412T12 6t-1.412.588T10 8t.588 1.413T12 10Zm0-2Zm0 10Z" fill="currentColor"/></svg>',
  file: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M8 18h8v-2H8Zm0-4h8v-2H8Zm-2 8q-.825 0-1.412-.587Q4 20.825 4 20V4q0-.825.588-1.413Q5.175 2 6 2h8l6 6v12q0 .825-.587 1.413Q18.825 22 18 22Zm7-13V4H6v16h12V9ZM6 4v5Zm0 0v16Z" fill="currentColor"/></svg>',
  finger: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41c-.24.13-.54.04-.68-.2a.506.506 0 0 1 .2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52c.25.13.34.43.21.67a.49.49 0 0 1-.44.28ZM3.5 9.72a.499.499 0 0 1-.41-.79c.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25a.5.5 0 0 1-.12.7c-.23.16-.54.11-.7-.12a9.388 9.388 0 0 0-3.39-2.94c-2.87-1.47-6.54-1.47-9.4.01c-1.36.7-2.5 1.7-3.4 2.96c-.08.14-.23.21-.39.21Zm6.25 12.07a.47.47 0 0 1-.35-.15c-.87-.87-1.34-1.43-2.01-2.64c-.69-1.23-1.05-2.73-1.05-4.34c0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.42-2.09-4.39-4.66-4.39c-2.57 0-4.66 1.97-4.66 4.39c0 1.44.32 2.77.93 3.85c.64 1.15 1.08 1.64 1.85 2.42c.19.2.19.51 0 .71c-.11.1-.24.15-.37.15Zm7.17-1.85c-1.19 0-2.24-.3-3.1-.89c-1.49-1.01-2.38-2.65-2.38-4.39c0-.28.22-.5.5-.5s.5.22.5.5c0 1.41.72 2.74 1.94 3.56c.71.48 1.54.71 2.54.71c.24 0 .64-.03 1.04-.1c.27-.05.53.13.58.41c.05.27-.13.53-.41.58c-.57.11-1.07.12-1.21.12ZM14.91 22c-.04 0-.09-.01-.13-.02c-1.59-.44-2.63-1.03-3.72-2.1a7.297 7.297 0 0 1-2.17-5.22c0-1.62 1.38-2.94 3.08-2.94c1.7 0 3.08 1.32 3.08 2.94c0 1.07.93 1.94 2.08 1.94s2.08-.87 2.08-1.94c0-3.77-3.25-6.83-7.25-6.83c-2.84 0-5.44 1.58-6.61 4.03c-.39.81-.59 1.76-.59 2.8c0 .78.07 2.01.67 3.61c.1.26-.03.55-.29.64c-.26.1-.55-.04-.64-.29a11.14 11.14 0 0 1-.73-3.96c0-1.2.23-2.29.68-3.24c1.33-2.79 4.28-4.6 7.51-4.6c4.55 0 8.25 3.51 8.25 7.83c0 1.62-1.38 2.94-3.08 2.94s-3.08-1.32-3.08-2.94c0-1.07-.93-1.94-2.08-1.94s-2.08.87-2.08 1.94c0 1.71.66 3.31 1.87 4.51c.95.94 1.86 1.46 3.27 1.85c.27.07.42.35.35.61c-.05.23-.26.38-.47.38Z" fill="currentColor"/></svg>',
  sort: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="m12 5 4 5H8l4-5Zm0 14-4-5h8l-4 5Z" fill="currentColor"/></svg>',
};
const cpChev = (open) => `<span class="cp-chev ${open ? 'up' : ''}">${ICONS.chevDown}</span>`;
const pad2 = n => String(n).padStart(2, '0');
const dmy = d => `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
const mny = n => '$' + (Number(n) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const TODAY = new Date(2026, 9, 8);
const CP_ESTADOS = ['Vigente', 'Por vencer', 'Vencido', 'Desempeñado'];
const CP_TAG = { Vigente: 'green', 'Por vencer': 'yellow', Vencido: 'red', Desempeñado: 'gray' };
const CP_CACHE = {};
const MES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const altaOf = c => c.alta || (c.score === 'Nuevo' ? new Date(TODAY.getFullYear(), TODAY.getMonth(), 1 + c.nuc % 7) : c.nuc % 7 === 0 ? new Date(TODAY.getFullYear(), TODAY.getMonth() - 1, 3 + c.nuc % 25) : new Date(2024 + c.nuc % 2, c.nuc % 12, 1 + c.nuc % 27));
const altasEn = (y, m) => CLIENTES.filter(x => { const d = altaOf(x); return d.getFullYear() === y && d.getMonth() === m; }).length;
const venceHoy = c => !c.id.startsWith('r') && cpData(c).contracts.some(x => x.estado !== 'Desempeñado' && sameDay(x.fec, TODAY));
function cpData(c) {
  if (CP_CACHE[c.id]) return CP_CACHE[c.id];
  let s = (c.nuc * 7919) % 233280; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const pick = a => a[Math.floor(r() * a.length)];
  const fem = /a$/i.test(c.name.trim().split(' ')[0]);
  const isNew = c.score === 'Nuevo';
  const dob = new Date(1966 + Math.floor(r() * 36), Math.floor(r() * 12), 1 + Math.floor(r() * 27));
  const L = (c.last + 'XX').toUpperCase().normalize('NFD').replace(/[^A-Z]/g, ''), N = c.name.toUpperCase().normalize('NFD').replace(/[^A-Z]/g, '');
  const ymd = String(dob.getFullYear()).slice(2) + pad2(dob.getMonth() + 1) + pad2(dob.getDate());
  const base = (L.slice(0, 2) + (L.split('').find((x, i) => i > 1 && /[A-Z]/.test(x)) || 'X') + N[0]).slice(0, 4);
  const sucs = SUCURSALES.map(x => x.name);
  const vend = ['Ana Rivas', 'Luis Mora', 'Carla Peña', 'Jorge Lara', 'Sofía Ruiz'];
  const imgs = ['s24', 'huawei', 'switch-console', 'xbox-s', 'legion', 'rog', 'alienware', 'xbox-x'];
  const nC = isNew ? 0 : 3 + Math.floor(r() * 7);
  const contracts = Array.from({ length: nC }, (_, i) => {
    const pre = Math.round((1500 + r() * 14000) / 50) * 50;
    const ref = Math.round(pre * 0.1566 * 100) / 100;
    const days = Math.round(-25 + r() * 80);
    const fec = new Date(TODAY.getTime() + days * 864e5);
    const done = r() < 0.18;
    const estado = done ? 'Desempeñado' : days < 0 ? 'Vencido' : days <= 7 ? 'Por vencer' : 'Vigente';
    const na = 1 + Math.floor(r() * 3);
    return { no: String(48200 + c.nuc % 97 * 13 + i * 7), arts: Array.from({ length: na }, () => pick(imgs)), na, pre, ref, des: pre + ref, ava: Math.round(pre * 1.6), vend: pick(vend), suc: pick(sucs), fec, estado };
  });
  if (!isNew && c.nuc % 3 === 0 && contracts.length) { contracts[0].fec = new Date(TODAY); contracts[0].estado = 'Por vencer'; }
  const act = contracts.filter(x => x.estado !== 'Desempeñado');
  const sum = (a, k) => a.reduce((t, x) => t + x[k], 0);
  const otrasN = isNew ? 0 : Math.floor(r() * 3);
  const d = {
    contracts,
    deuda: { emp: sum(act, 'des'), pre: 0, apa: isNew ? 0 : Math.round(r() * 3) * 850, oEmp: otrasN * Math.round(2000 + r() * 6000), oN: otrasN, oPre: 0, oPreN: 0, oApa: 0, oApaN: 0 },
    ingresos: { emp: isNew ? 0 : Math.round(sum(contracts, 'ref') * (1 + Math.floor(r() * 3)) * 100) / 100, pre: 0, apa: isNew ? 0 : Math.round(r() * 4) * 425 },
    personal: { civil: pick(['Soltero(a)', 'Casado(a)', 'Unión libre', 'Divorciado(a)']), gender: fem ? 'Femenino' : 'Masculino', nat: c.nat, dob: dmy(dob), curp: base + ymd + (fem ? 'M' : 'H') + pick(['DF', 'NL', 'JC', 'PL', 'QT']) + 'RNA0', rfc: base + ymd + pick(['K21', 'HB4', '7Q2', 'T05']), activity: pick(['Empleado', 'Comerciante', 'Independiente', 'Profesionista']) },
    laboral: isNew ? null : { sit: pick(['Empleado', 'Independiente']), emp: pick(['Grupo Norteño', 'Comercial Ríos', 'Servicios del Bajío']), puesto: pick(['Supervisor', 'Vendedor', 'Administrativo']), ant: `${1 + Math.floor(r() * 9)} años`, ing: Math.round(9000 + r() * 21000) },
    addr: { calle: pick(['Av. Insurgentes', 'Calle Morelos', 'Av. Juárez', 'Calle Hidalgo']), ext: String(10 + Math.floor(r() * 890)), col: pick(['Centro', 'Roma Norte', 'Del Valle', 'Las Lomas']), cp: String(1000 + Math.floor(r() * 89000)).padStart(5, '0'), ...(([mun, edo]) => ({ mun, edo }))(pick([['Cuauhtémoc', 'CDMX'], ['Benito Juárez', 'CDMX'], ['Monterrey', 'Nuevo León'], ['Guadalajara', 'Jalisco']])) },
    idDoc: { type: 'INE', num: String(Math.floor(1e12 + r() * 9e12)), vig: new Date(2024 + Math.floor(r() * 7), 11, 31) },
    dom: isNew ? null : { type: pick(['Recibo de luz', 'Recibo de agua', 'Estado de cuenta']), vig: new Date(2026, 6 + Math.floor(r() * 6), 1 + Math.floor(r() * 27)) },
    ingDoc: !isNew && r() > 0.4,
    cot: !isNew && r() > 0.35 ? [{ name: pick(['Rosa', 'Pedro', 'Elena', 'Marco']) + ' ' + c.last.split(' ')[0], rel: pick(['Hermano(a)', 'Esposo(a)', 'Hijo(a)', 'Madre']), phone: '55' + String(Math.floor(1e7 + r() * 9e7)), tipo: pick(['Cotitular', 'Beneficiario']) }] : [],
    huellas: isNew ? [] : ['Pulgar derecho', 'Índice derecho'].concat(r() > 0.5 ? ['Pulgar izquierdo', 'Índice izquierdo'] : []),
  };
  CP_CACHE[c.id] = d; return d;
}
function cpClient() { return [...CLIENTES, ...RED].find(x => x.id === st.prof.id); }
function cpStat(label, value, sub) { return `<div class="cp-stat"><span>${label}</span><b>${mny(value)}</b>${sub != null ? `<small>${sub}</small>` : ''}</div>`; }
function cpKV(rows) { return `<dl class="cp-kv">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd class="${v ? '' : 'na'}">${v ? esc(v) : 'Sin registrar'}</dd></div>`).join('')}</dl>`; }
function cpPanel(c, d) {
  const p = st.prof;
  if (p.panel === 'deuda') return `<div class="cp-panel"><h3>Total de deuda</h3><div class="cp-stats">${cpStat('Empeños locales', d.deuda.emp)}${cpStat('Préstamos locales', d.deuda.pre)}${cpStat('Apartado local', d.deuda.apa)}</div>
    <h3>Deuda en otras casas de empeño</h3><div class="cp-stats">${cpStat('Empeños', d.deuda.oEmp, `${d.deuda.oN} ${d.deuda.oN === 1 ? 'casa de empeño' : 'casas de empeño'}`)}${cpStat('Préstamos', d.deuda.oPre, `${d.deuda.oPreN} préstamos`)}${cpStat('Apartado', d.deuda.oApa, `${d.deuda.oApaN} apartados`)}</div></div>`;
  if (p.panel === 'ingresos') return `<div class="cp-panel"><h3>Total de ingresos</h3><div class="cp-stats">${cpStat('Empeños locales', d.ingresos.emp)}${cpStat('Préstamos locales', d.ingresos.pre)}${cpStat('Apartado local', d.ingresos.apa)}</div></div>`;
  if (p.panel !== 'info') return '';
  const tabs = [['personal', 'Datos personales'], ['docs', 'Documentos personales'], ['cot', 'Cotitulares y beneficiarios'], ['huellas', 'Registro de huellas']];
  let body = '';
  if (p.itab === 'personal') {
    const P = d.personal;
    if (p.editing) {
      const sel = (k, label, opts) => `<div class="pf pf-sel"><span>${label}</span><span style="position:relative;display:block"><button type="button" class="field psel ${st.menu === 'cpf-' + k ? 'open' : ''}" data-act="menu" data-id="cpf-${k}" aria-haspopup="listbox" aria-expanded="${st.menu === 'cpf-' + k}" aria-label="${esc(label.replace(/<[^>]+>/g, ''))}"><span class="${p.form[k] ? '' : 'ph'}">${esc(p.form[k] || 'Selecciona')}</span>${DS_CHEV}</button>${st.menu === 'cpf-' + k ? `<div class="ddl-menu" role="listbox" style="left:0;right:0;top:44px">${opts.map(o => `<button type="button" role="option" aria-selected="${o === p.form[k]}" class="${o === p.form[k] ? 'on' : ''}" data-act="cpfsel" data-k="${k}" data-v="${o}">${o}</button>`).join('')}</div>` : ''}</span></div>`;
      const inp = (k, label) => `<label class="pf"><span>${label}</span><span class="field"><input data-in="cpf" data-k="${k}" data-fk="cpf-${k}" value="${esc(p.form[k] || '')}"></span></label>`;
      body = `<div class="cp-form">${sel('civil', 'Estado civil', ['Soltero(a)', 'Casado(a)', 'Unión libre', 'Divorciado(a)', 'Viudo(a)'])}${sel('gender', 'Género <span class="opt">(opcional)</span>', ['Femenino', 'Masculino', 'Prefiero no decir'])}${sel('nat', 'Nacionalidad', NATS)}${inp('dob', 'Fecha de nacimiento')}${inp('curp', 'CURP')}${inp('rfc', 'R.F.C')}${sel('activity', 'Actividad económica', ['Empleado', 'Comerciante', 'Independiente', 'Profesionista'])}</div>
        <div class="cp-actions"><button class="btn btn-ter btn-l" data-act="cpcancel">Cancelar</button><button class="btn btn-primary btn-l" data-act="cpsave">Guardar</button></div>`;
    } else {
      const lab = d.laboral;
      body = `<div class="cp-sec-h"><h4>Datos personales</h4><button class="btn btn-outline cp-editb" data-act="cpeditp">${PI.edit}Editar</button></div>
        ${cpKV([['Estado civil', P.civil], ['Género', P.gender], ['Nacionalidad', P.nat], ['Fecha de nacimiento', P.dob], ['CURP', P.curp], ['R.F.C', P.rfc], ['Actividad económica', P.activity]])}
        <div class="cp-sec-h"><h4>Información laboral</h4></div>
        ${cpKV([['Situación laboral', lab && lab.sit], ['Nombre de la empresa', lab && lab.emp], ['Puesto', lab && lab.puesto], ['Antigüedad', lab && lab.ant], ['Ingreso mensual', lab && mny(lab.ing)]])}`;
    }
  } else if (p.itab === 'docs') {
    const vig = dt => dt >= TODAY ? '<span class="stag green">Vigente</span>' : '<span class="stag red">Vencido</span>';
    const row = (icon, t, s, tag, has) => `<div class="cp-doc"><span class="cp-doc-ic">${icon}</span><div class="tx"><b>${t}</b><small>${s}</small></div>${tag}${has ? '<button class="linkbtn" data-act="toast" data-msg="Vista previa del archivo: próximamente">Ver archivo</button>' : '<button class="linkbtn" data-act="toast" data-msg="Carga de archivo: próximamente">Cargar</button>'}</div>`;
    body = `<div class="cp-docs">${row(PI.id, 'Identificación oficial', `${d.idDoc.type} · ${d.idDoc.num} · Vigencia ${dmy(d.idDoc.vig)}`, vig(d.idDoc.vig), true)}
      ${row(PI.home, 'Comprobante de domicilio', d.dom ? `${d.dom.type} · Vigencia ${dmy(d.dom.vig)}` : 'Sin archivo', d.dom ? vig(d.dom.vig) : '<span class="stag gray">Sin archivo</span>', !!d.dom)}
      ${row(PI.file, 'Comprobante de ingresos', d.ingDoc ? 'PDF · 1 archivo' : 'Sin archivo', d.ingDoc ? '<span class="stag green">Cargado</span>' : '<span class="stag gray">Sin archivo</span>', d.ingDoc)}</div>`;
  } else if (p.itab === 'cot') {
    body = d.cot.length ? `<div class="cp-docs">${d.cot.map(x => `<div class="cp-doc"><span class="avatar">${(x.name[0] + x.name.split(' ')[1][0]).toUpperCase()}</span><div class="tx"><b>${esc(x.name)}</b><small>${x.rel} · ${x.phone.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2 $3')}</small></div><span class="stag purple">${x.tipo}</span></div>`).join('')}</div>`
      : `<div class="cempty"><p class="t">Sin cotitulares ni beneficiarios</p><p class="cap">Agrega a una persona que pueda desempeñar o recibir las prendas.</p></div>`;
    body += `<button class="linkbtn cp-add" data-act="toast" data-msg="Agregar cotitular o beneficiario: próximamente">${ic('plus')}Agregar</button>`;
  } else {
    body = d.huellas.length ? `<div class="cp-fp"><p class="cap"><b>${d.huellas.length}</b> de 10 huellas registradas</p><div class="cp-fpl">${d.huellas.map(h => `<span class="rchip">${PI.finger}${h}</span>`).join('')}</div></div>`
      : `<div class="cempty"><p class="t">Sin huellas registradas</p><p class="cap">Registra al menos una huella para validar al cliente en sus operaciones.</p></div>`;
  }
  return `<div class="cp-panel cp-info"><div class="utabs" role="tablist">${tabs.map(([k, l]) => `<button role="tab" class="${p.itab === k ? 'on' : ''}" aria-selected="${p.itab === k}" data-act="cpitab" data-v="${k}">${l}</button>`).join('')}</div><div class="cp-info-b">${body}</div></div>`;
}
function cpQuick(d) {
  const p = st.prof; const act = d.contracts.filter(x => x.estado !== 'Desempeñado').sort((a, b) => a.fec - b.fec);
  const cards = act.map(x => `<div class="qa-card">
      <div class="qa-h"><span>Vencimiento: <b>${dmy(x.fec)}</b></span><span class="stag ${CP_TAG[x.estado]}">${x.estado}</span></div>
      <button class="qa-no" data-act="cpq" data-v="${x.no}">#${x.no}</button>
      <div class="qa-amts"><div><span>Refrendo</span><b>${mny(x.ref)}</b></div><div><span>Desempeño</span><b>${mny(x.des)}</b></div></div>
      <div class="qa-pr"><span>Prendas</span><div class="qa-row"><div class="qa-imgs">${x.arts.map(k => `<img src="${IMG[k]}" alt="">`).join('')}</div><span class="chip-i">Empeño</span></div></div>
      <div class="qa-btns"><button class="btn btn-outline" data-act="cpop" data-k="Desempeño" data-v="${x.no}">Desempeñar</button><button class="btn btn-outline" data-act="cpop" data-k="Refrendo" data-v="${x.no}">Refrendar</button></div>
    </div>`).join('');
  return `<section class="cp-card"><div class="cp-card-h"><h2>Acciones rápidas</h2><button class="cp-ib" data-act="cpqa" aria-expanded="${p.qa}" aria-label="${p.qa ? 'Ocultar' : 'Mostrar'} acciones rápidas">${cpChev(p.qa)}</button></div>
    ${p.qa ? (act.length ? `<div class="qa-wrap">${act.length > 3 ? `<button class="qa-arrow l" data-act="cpscroll" data-v="-1" aria-label="Anteriores">${PG.prev}</button>` : ''}<div class="qa-track" id="qaTrack">${cards}</div>${act.length > 3 ? `<button class="qa-arrow r" data-act="cpscroll" data-v="1" aria-label="Siguientes">${PG.next}</button>` : ''}</div>`
      : '<div class="cempty"><p class="t">No hay contratos vinculados con este cliente</p></div>') : ''}</section>`;
}
function cpOps(d) {
  const p = st.prof; const nq = norm(p.q || '');
  let list = d.contracts.filter(x => (!p.est || x.estado === p.est) && (!nq || norm(x.no + ' ' + x.suc + ' ' + x.vend).includes(nq)));
  list = [...list].sort((a, b) => p.sort === 'asc' ? a.no.localeCompare(b.no) : b.no.localeCompare(a.no));
  const PER = 8; const pages = Math.max(1, Math.ceil(list.length / PER)); if (p.page > pages) p.page = pages;
  const from = (p.page - 1) * PER, slice = list.slice(from, from + PER);
  const CARET = '<span class="car"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 15L7 10H17L12 15Z" fill="currentColor"/></svg></span>';
  const FIL = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M11 20q-.425 0-.712-.288Q10 19.425 10 19v-6L4.2 5.6q-.375-.5-.112-1.05Q4.35 4 5 4h14q.65 0 .913.55q.262.55-.113 1.05L14 13v6q0 .425-.287.712Q13.425 20 13 20Zm1-7.7L16.95 6h-9.9Zm0 0Z" fill="currentColor"/></svg>';
  const open = st.menu === 'cpest';
  const head = `<div class="trow2 th cp-tr"><div class="tc k-no"><button class="cp-sort" data-act="cpsort">No contrato ${PI.sort}</button></div><div class="tc k-na">No de artículos</div><div class="tc k-art">Artículos</div><div class="tc k-m">Refrendo</div><div class="tc k-m">Desempeño</div><div class="tc k-m">Préstamo</div><div class="tc k-m">Valor avalúo</div><div class="tc k-ven">Vendedor / sucursal</div><div class="tc k-fec">Fecha de vencimiento</div><div class="tc k-est">Estado</div></div>`;
  const rows = slice.map(x => `<div class="trow2 cp-tr crow"><div class="tc k-no"><b>${x.no}</b></div><div class="tc k-na">${x.na} ${x.na === 1 ? 'artículo' : 'artículos'}</div><div class="tc k-art"><div class="cp-thumbs">${x.arts.map(k => `<img src="${IMG[k]}" alt="">`).join('')}</div></div><div class="tc k-m">${mny(x.ref)}</div><div class="tc k-m">${mny(x.des)}</div><div class="tc k-m">${mny(x.pre)}</div><div class="tc k-m">${mny(x.ava)}</div><div class="tc k-ven"><div class="tname"><p>${esc(x.vend)}</p><span>${esc(x.suc)}</span></div></div><div class="tc k-fec">${dmy(x.fec)}</div><div class="tc k-est"><span class="stag ${CP_TAG[x.estado]}">${x.estado}</span></div></div>`).join('');
  const empty = d.contracts.length ? `<div class="cempty"><p class="t">No hay contratos con estos filtros</p><button class="btn btn-outline" data-act="cpclear">Limpiar filtros</button></div>` : '<div class="cempty"><p class="t">No hay contratos disponibles.</p></div>';
  const chips = (p.est ? [`<span class="fchip">${ICONS.check16.replace('width="16" height="16"', 'width="20" height="20"').replace('fill="white"', 'fill="#0D166B"')}Estado: ${p.est}<button data-act="cpest" data-v="" aria-label="Quitar filtro Estado">${ICONS.close.replace('width="24" height="24"', 'width="18" height="18"')}</button></span>`] : []);
  const pager = list.length > PER ? `<nav class="dpager" aria-label="Paginación"><span class="g"><button data-act="cppage" data-v="1" aria-label="Primera página" ${p.page === 1 ? 'disabled' : ''}>${PG.first}</button><button data-act="cppage" data-v="${p.page - 1}" aria-label="Página anterior" ${p.page === 1 ? 'disabled' : ''}>${PG.prev}</button></span><span class="t">${from + 1}-${from + slice.length} de ${list.length} resultados</span><span class="g"><button data-act="cppage" data-v="${p.page + 1}" aria-label="Página siguiente" ${p.page >= pages ? 'disabled' : ''}>${PG.next}</button><button data-act="cppage" data-v="${pages}" aria-label="Última página" ${p.page >= pages ? 'disabled' : ''}>${PG.last}</button></span></nav>` : '';
  return `<section class="cp-card"><div class="cp-card-h"><h2>Operaciones</h2></div>
    <div class="utabs" role="tablist"><button role="tab" class="on" aria-selected="true">Contratos de empeño <span class="cnt">${d.contracts.length}</span></button></div>
    <div class="ctools"><div class="dsearch"><input placeholder="Buscar por contrato, vendedor o sucursal" aria-label="Buscar contratos" data-in="cpq" data-fk="cpq" value="${esc(p.q)}">${p.q ? `<button class="sclear" data-act="cpq0" aria-label="Limpiar búsqueda">${ICONS.close.replace('width="24" height="24"', 'width="20" height="20"')}</button>` : `<span class="s" aria-hidden="true">${ic('search')}</span>`}</div>
      <div class="tfc-g"><div style="position:relative"><button type="button" class="tfc ${p.est ? 'sel' : ''} ${open ? 'open' : ''}" data-act="menu" data-id="cpest" aria-haspopup="listbox" aria-expanded="${open}">${FIL}<span>Filtrar por</span>${CARET}</button>${open ? `<div class="tfc-list" role="listbox" style="left:auto;right:0">${CP_ESTADOS.map(o => `<div role="option" aria-selected="${o === p.est}" class="${o === p.est ? 'on' : ''}" data-act="cpest" data-v="${o === p.est ? '' : o}">${o}</div>`).join('')}</div>` : ''}</div></div></div>
    ${chips.length ? `<div class="cmeta"><div class="fl"><span>Filtrado por:</span>${chips.join('')}</div><span class="cap">${list.length} de ${d.contracts.length} contratos</span></div>` : ''}
    <div class="cp-tablew"><div class="ttable flat">${head}${slice.length ? rows : empty}</div></div>${pager}</section>`;
}
function clientProfileScreen() {
  const c = cpClient(); if (!c) return '';
  const d = cpData(c); const p = st.prof;
  const addr = `${d.addr.calle} ${d.addr.ext}, ${d.addr.col}, ${d.addr.mun}, ${d.addr.edo} CP ${d.addr.cp}`;
  const idVig = d.idDoc.vig >= TODAY;
  const kpi = (k, icon, label, val) => `<button class="cp-kpi ${p.panel === k ? 'on' : ''}" data-act="cppanel" data-v="${k}" aria-expanded="${p.panel === k}"><span class="cp-kic">${icon}</span><span class="l">${label}</span>${val != null ? `<b>${mny(val)}</b>` : ''}${cpChev(p.panel === k)}</button>`;
  return `<div class="cli cp">
    <nav aria-label="Breadcrumb" class="ds-breadcrumb"><ol class="pos-crumbs"><li><a href="../home/" class="ds-breadcrumb__link">Home</a><span class="ds-breadcrumb__sep" aria-hidden="true"><img class="pos-crumb-sep" src="../assets/ds/ArrowForwardIos-D4D6D8.svg" alt="" /></span></li><li><a href="./" class="ds-breadcrumb__link" data-act="go" data-to="clients">Clientes</a><span class="ds-breadcrumb__sep" aria-hidden="true"><img class="pos-crumb-sep" src="../assets/ds/ArrowForwardIos-D4D6D8.svg" alt="" /></span></li><li><span class="ds-breadcrumb__current" aria-current="page">Perfil del cliente</span></li></ol></nav>
    <div class="cli-head"><h1 class="cli-title">Perfil de cliente</h1></div>
    <section class="cp-card cp-head">
      <div class="cp-top">
        <span class="cp-av">${initials(c)}</span>
        <div class="cp-who">
          <div class="cp-name"><h2>${esc(c.name + ' ' + c.last)}</h2>${c.score === 'Nuevo' ? '<span class="stag gray">Cliente nuevo</span>' : `<span class="stag ${SCORE_TAG[c.score] || 'gray'}">${esc(c.score)}</span>`}</div>
          <ul class="cp-meta">
            <li>${PI.user}NUC ${c.nuc}</li>
            <li>${PI.id}${d.idDoc.type} ${d.idDoc.num}<span class="stag ${idVig ? 'green' : 'red'}">${idVig ? 'Vigente' : 'Vencido'}</span></li>
            <li>${PI.phone}${c.phone && c.phone !== '—' ? '+52 ' + esc(c.phone).replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2 $3') : 'Sin registrar'}</li>
            <li>${PI.mail}${esc(c.email)}</li>
            <li class="addr" title="${esc(addr)}">${PI.home}<span>${esc(addr)}</span></li>
          </ul>
        </div>
        <button class="cp-ib" data-act="toast" data-msg="Editar datos de contacto: próximamente" aria-label="Editar datos de contacto">${PI.edit}</button>
      </div>
      <div class="cp-kpis">${kpi('deuda', PI.debt, 'Total de deuda', d.deuda.emp + d.deuda.pre + d.deuda.apa)}${kpi('ingresos', PI.cash, 'Total de ingresos', d.ingresos.emp + d.ingresos.pre + d.ingresos.apa)}${kpi('info', PI.person, 'Información adicional', null)}</div>
      ${cpPanel(c, d)}
    </section>
    ${cpQuick(d)}
    ${cpOps(d)}
  </div>
  ${sesiones()}`;
}
const DS_CHEV = '<svg class="dchev" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function cpAct(a, v, t) {
  const p = st.prof; const c = cpClient(); const d = c && cpData(c);
  switch (a) {
    case 'cppanel': p.panel = p.panel === v ? null : v; p.editing = false; render(); return true;
    case 'cpitab': p.itab = v; p.editing = false; render(); return true;
    case 'cpeditp': p.editing = true; p.form = { ...d.personal }; render(); return true;
    case 'cpcancel': p.editing = false; render(); return true;
    case 'cpfsel': p.form[t.dataset.k] = v; st.menu = null; render(); return true;
    case 'cpsave': Object.assign(d.personal, p.form); p.editing = false; toastMsg('Datos actualizados', 'ok', `Se guardaron los datos personales de ${c.name} ${c.last}.`); return true;
    case 'cpqa': p.qa = !p.qa; render(); return true;
    case 'cpscroll': { const tr = document.getElementById('qaTrack'); if (tr) tr.scrollBy({ left: Number(v) * 340, behavior: 'smooth' }); return true; }
    case 'cpq': p.q = v; p.est = ''; p.page = 1; render(); setTimeout(() => document.querySelector('.cp .cp-tablew')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 30); return true;
    case 'cpop': toastMsg(`${t.dataset.k} agregado al carrito`, 'ok', `Contrato #${v} de ${c.name} ${c.last}.`); return true;
    case 'cpsort': p.sort = p.sort === 'asc' ? 'desc' : 'asc'; render(); return true;
    case 'cpest': p.est = v; p.page = 1; st.menu = null; render(); return true;
    case 'cpclear': p.est = ''; p.q = ''; p.page = 1; render(); return true;
    case 'cpq0': p.q = ''; p.page = 1; render(); return true;
    case 'cppage': p.page = Math.max(1, Number(v)); render(); return true;
  }
  return false;
}

let lastToastId = null;
// Toast del diseño (componente "Toast": Positive / Negative / Alert / Info)
function toast() {
  const t = st.toast; if (!t) return '';
  const icon = { ok: ICONS.success, err: ICONS.error, warn: ICONS.warn, info: ICONS.info }[t.kind] || ICONS.info;
  const fresh = t.id !== lastToastId; lastToastId = t.id;
  return `<div class="toast ${t.kind} ${fresh ? 'anim' : ''}" role="status"><span class="ico">${icon}</span><div class="tt"><p class="t1">${esc(t.msg)}</p>${t.text ? `<p class="t2">${esc(t.text)}</p>` : ''}</div><button class="tclose" data-act="tclose" aria-label="Cerrar">${ICONS.close.replace('width="24" height="24"', 'width="20" height="20"')}</button></div>`;
}

// ---------- acciones ----------
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]');
  // cerrar menús al hacer clic fuera
  if (st.menu && !(t && (t.dataset.act === 'menu' || t.closest('.menu')))) { st.menu = null; if (!t) { render(); return; } }
  if (!t) return;
  const a = t.dataset.act, v = t.dataset.v;
  if (a.startsWith('cp') && cpAct(a, v, t)) return;
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
    case 'cliopen': { const x = [...CLIENTES, ...RED].find(c => c.id === v); if (!x) return; if (x.id.startsWith('r')) { toastMsg(`${x.name} ${x.last} · NUC ${x.nuc}`, 'info', 'Los contactos de la red ataskate se muestran protegidos.'); return; } st.prof = { id: x.id, panel: null, itab: 'personal', editing: false, form: {}, qa: true, q: '', est: '', sort: 'asc', page: 1 }; go('client'); return; }
    default: return;
  }
  render();
});

document.addEventListener('input', e => {
  const t = e.target; const k = t.dataset.in; if (!k) return;
  switch (k) {
    case 'cpq': st.prof.q = t.value; st.prof.page = 1; break;
    case 'cpf': st.prof.form[t.dataset.k] = t.value; return;
    case 'cliq': st.cli.q = t.value; clearTimeout(window.__cq); window.__cq = setTimeout(cliLoad, 250); return;
    case 'clif': st.cli.fd[t.dataset.k] = t.value; break;
    default: return;
  }
  render();
});
document.addEventListener('keydown', e => {
  const t = e.target;
  if (e.key === 'Escape' && st.menu) { st.menu = null; render(); }
  if (e.key === 'Escape' && st.cli.panel) { st.cli.panel = false; render(); }
  if (e.key === 'Enter' && t.classList && t.classList.contains('crow')) t.click();
});

// #clientes abre el listado (lo usa cliente-nuevo.html al guardar o cancelar)
const hash = location.hash.replace('#', '');
if (hash === 'clientes') st.screen = 'clients';
try {
  const nc = JSON.parse(localStorage.getItem('ataskate.newClient') || 'null');
  if (nc && nc.name) {
    localStorage.removeItem('ataskate.newClient');
    const nuc = Math.max(...CLIENTES.map(c => c.nuc)) + 1;
    const c = { id: 'c' + nuc, name: nc.name, last: nc.last || '', nuc, nat: nc.nat || 'Mexicana', email: nc.email || '—', phone: nc.phone || '—', score: 'Nuevo', alta: new Date(TODAY) };
    CLIENTES.unshift(c); st.cli.fresh = c.id; st.screen = 'clients';
    setTimeout(() => toastMsg('Cliente creado', 'ok', `${c.name} ${c.last} ya está en tu lista con NUC ${nuc}.`), 50);
  }
} catch (e) {}
render();
window.__st = st;
})();
