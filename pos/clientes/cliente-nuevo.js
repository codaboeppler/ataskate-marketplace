/* Ataskate POS (Operativo) · Cliente nuevo — propuesta v3 de Product Design (rama del equipo del repo del equipo,
   commit 8f7723ad6, actualizado con 597ab9214, e014b0c0a, 2d1b103b4 y 0859357ca). Abre directo el formulario, con tipo de registro
   Venta / Empeño, detección de cliente existente (Marketplace / Red ataskate) mientras se captura con verificación antes de ver sus
   datos, llegada desde el buscador de Clientes (?cargar=, ?buscar=, ?nuevo=, ?modo=), layout tipo Cotizador de empeño, cámara para
   foto e identificación/comprobantes, visor de documentos, registro de huellas y FixedActionFooter. Su JS va completo; el header y el
   menú son los compartidos del POS. */
(() => {
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const S = { coSeq: 0, address: null, files: {}, photo: null, co: [], prints: { izq: new Set(), der: new Set() }, hand: 'der', finger: 'Pulgar', touched: new Set(), dirty: false, saving: false };
const FINGERS = ['Pulgar', 'Índice', 'Medio', 'Anular', 'Meñique'];
const HN = { izq: 'izquierdo', der: 'derecho' };

/* ---------- DS CircularProgressIndicator (20px small) ---------- */
function cpi(v) { const r = 8.5, c = 2 * Math.PI * r; return `<svg width="20" height="20" viewBox="0 0 20 20" role="progressbar" aria-valuenow="${v}" aria-valuemin="0" aria-valuemax="100"><circle cx="10" cy="10" r="${r}" fill="none" style="stroke:var(--ats-neutral-300)" stroke-width="3"/><circle cx="10" cy="10" r="${r}" fill="none" style="stroke:var(--ats-primary-400)" stroke-width="3" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - v / 100)}" transform="rotate(-90 10 10)"/></svg>`; }
/* DS Tag (status chip): tono → modificador del DS */
const TAG_TONE = { green: 'verde', gray: 'gris', purple: 'morado', red: 'rojo', yellow: 'amarillo', blue: 'azul' };
const tag = (el, color, txt) => { if (el) { el.className = 'ds-tag ds-tag--' + (TAG_TONE[color] || 'gris'); el.textContent = txt; } };
/* DS Chip informativo para el origen del cliente */
const SRC_CHIP = { mk: 'ds-chip--brand', red: 'ds-chip--info', new: '' };

/* ---------- Validación con el patrón de error de producción ---------- */
const val = el => (el.value || '').trim();
/* 9964739ad · reglas de su React (newClient.helpers.ts → getFieldError): mayoría de edad, CURP y R.F.C con su formato oficial,
   vigencia de la identificación y teléfono de 10 dígitos */
const CURP_RE = /^[A-Z][AEIOUX][A-Z]{2}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[HMX][A-Z]{2}[B-DF-HJ-NP-TV-Z]{3}[A-Z\d]\d$/;
const RFC_RE = /^[A-ZÑ&]{4}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[A-Z\d]{3}$/;
const ageFrom = b => { const t = new Date(); const had = t.getMonth() > b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() >= b.getDate()); return t.getFullYear() - b.getFullYear() - (had ? 0 : 1); };
function problem(el) {
  const v = val(el), k = el.dataset.kind;
  if (!v) return el.tagName === 'SELECT' ? 'Debes seleccionar una opción' : 'Campo obligatorio';
  if (k === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Formato de correo inválido.';
  if (k === 'phone' && v.replace(/\D/g, '').length < 10) return 'El número telefónico es demasiado corto.';
  if (k === 'date' || k === 'dob' || k === 'validity') {
    const d = parseDMY(v); if (!d) return 'Escribe la fecha como DD/MM/AAAA.';
    if (k === 'validity') { const t = new Date(); t.setHours(0, 0, 0, 0); return d < t ? 'La identificación está vencida.' : ''; }
    if (d > new Date()) return 'La fecha no puede ser futura.';
    if (k === 'dob' && ageFrom(d) < 18) return 'El cliente debe ser mayor de 18 años.';
  }
  const u = v.toUpperCase();
  if (k === 'curp' && (u.length !== 18 || !CURP_RE.test(u))) return 'Revisa la CURP: deben ser 18 caracteres con el formato oficial.';
  if (k === 'rfc' && (u.length !== 13 || !RFC_RE.test(u))) return 'Revisa el R.F.C: deben ser 13 caracteres con homoclave.';
  return '';
}
function showErr(fld, msg, boxEl) {
  const e = fld.querySelector('.ferr');
  (boxEl).classList.toggle('err', !!msg);
  if (e) { e.hidden = !msg; e.innerHTML = msg ? `<svg width="16" height="16"><use href="#i-err"/></svg>${esc(msg)}` : ''; }
  const note = fld.querySelector('.fnote'); if (note) note.hidden = !!msg;
}
function boxOf(el) { if (el.tagName === 'SELECT' && el._trig) return el._trig; return el.closest('.doble, .date') || el; }
function paint(el) { const m = problem(el); showErr(el.closest('.fld'), m, boxOf(el)); el.setAttribute('aria-invalid', m ? 'true' : 'false'); return m; }
/* 2d1b103b4 · Tipo de registro: Venta (contacto + dirección) o Empeño (todo). Solo cuentan los obligatorios de los apartados visibles */
S.mode = 'empeno';
const VENTA_SECS = ['contacto', 'direccion'];
const modeSecs = () => S.mode === 'venta' ? VENTA_SECS : SECS;
const reqs = () => $$('[data-req]').filter(el => !el.closest('section[hidden]'));

$$('#fs input, #fs select').forEach(el => {
  if (el.id === 'phone' || el.id === 'a-cp') el.addEventListener('input', () => { const d = el.value.replace(/\D/g, '').slice(0, el.id === 'phone' ? 10 : 5); if (d !== el.value) el.value = d; }, true); // su React: teléfono de 10 dígitos y C.P. de 5, solo dígitos
  if (el.id === 'curp' || el.id === 'rfc') el.addEventListener('input', () => { const u = el.value.toUpperCase(), a = el.selectionStart; if (u !== el.value) { el.value = u; try { el.setSelectionRange(a, a); } catch (e) {} } }, true); // su React: CURP y R.F.C siempre en mayúsculas
  el.addEventListener('input', () => {
    S.dirty = true;
    if (el.type === 'date') el.classList.toggle('empty', !el.value);
    if (el.dataset.count === undefined) { const n = $(`[data-count="${el.id}"]`); if (n) n.textContent = `${el.value.length} de ${el.id === 'curp' ? 18 : 13} caracteres`; }
    if (el.dataset.req !== undefined && S.touched.has(el.id)) paint(el);
    update();
  });
  el.addEventListener('change', () => { if (el.type === 'date') el.classList.toggle('empty', !el.value); if (el.dataset.req !== undefined) { S.touched.add(el.id); paint(el); } update(); });
  el.addEventListener('blur', e => { if (e.relatedTarget && e.relatedTarget.classList.contains('cal-btn')) return; if (el.dataset.req !== undefined && (val(el) || el.tagName === 'INPUT')) { S.touched.add(el.id); paint(el); update(); } });
});
/* la vigencia de la identificación se valida con problem() (kind validity): "La identificación está vencida." */


/* ---------- Calendar modal ---------- */
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const pad = n => String(n).padStart(2, '0');
function parseDMY(v) { const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v || ''); if (!m) return null; const d = new Date(+m[3], +m[2] - 1, +m[1]); return d.getDate() === +m[1] && d.getMonth() === +m[2] - 1 ? d : null; }
const fmtDMY = d => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
const sameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const CAL = { el: null, input: null, y: 0, m: 0, sel: null, open: null };
function openCal(input) {
  closeCal(); closeSel();
  const today = new Date(); const cur = parseDMY(input.value);
  const base = cur || (input.id === 'dob' ? new Date(today.getFullYear() - 30, today.getMonth(), 1) : today);
  Object.assign(CAL, { input, y: base.getFullYear(), m: base.getMonth(), sel: cur, open: null });
  const el = document.createElement('div'); el.className = 'calp'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Seleccionar fecha');
  document.body.appendChild(el); CAL.el = el;
  const r = input.closest('.date').getBoundingClientRect();
  el.style.left = Math.min(r.left + scrollX, scrollX + innerWidth - 320) + 'px'; el.style.top = (r.bottom + scrollY + 6) + 'px';
  input.closest('.date').querySelector('.cal-btn').setAttribute('aria-expanded', 'true');
  drawCal();
  el.addEventListener('click', e => e.stopPropagation());
}
function closeCal() { if (CAL.el) { CAL.el.remove(); CAL.el = null; const b = CAL.input && CAL.input.closest('.date').querySelector('.cal-btn'); b && b.setAttribute('aria-expanded', 'false'); } }
function drawCal() {
  const { el, y, m, sel } = CAL; const today = new Date(); const maxY = CAL.input.id === 'dob' ? today.getFullYear() : today.getFullYear() + 15;
  const years = []; for (let i = maxY; i >= 1930; i--) years.push(i);
  const first = new Date(y, m, 1); const offset = (first.getDay() + 6) % 7; const start = new Date(y, m, 1 - offset);
  let cells = ''; for (let i = 0; i < 42; i++) { const d = new Date(start); d.setDate(start.getDate() + i); const cls = ['d', d.getMonth() !== m ? 'out' : '', sameDay(d, today) ? 'today' : '', sameDay(d, sel) ? 'sel' : ''].join(' '); const future = CAL.input.id === 'dob' && d > today; cells += `<button type="button" class="${cls}" data-t="${d.getTime()}"${future ? ' disabled' : ''} aria-label="${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}"${sameDay(d, sel) ? ' aria-pressed="true"' : ''}>${d.getDate()}</button>`; }
  el.innerHTML = `<div class="top">
      <div class="pick"><button type="button" class="pill" data-open="m" aria-expanded="${CAL.open === 'm'}">${MESES[m].slice(0, 3)}<svg width="20" height="20"><use href="#i-down"/></svg></button>${CAL.open === 'm' ? `<div class="list" role="listbox">${MESES.map((n, i) => `<button type="button" data-m="${i}" aria-selected="${i === m}">${n}</button>`).join('')}</div>` : ''}</div>
      <div class="pick"><button type="button" class="pill" data-open="y" aria-expanded="${CAL.open === 'y'}">${y}<svg width="20" height="20"><use href="#i-down"/></svg></button>${CAL.open === 'y' ? `<div class="list" role="listbox">${years.map(n => `<button type="button" data-y="${n}" aria-selected="${n === y}">${n}</button>`).join('')}</div>` : ''}</div>
    </div>
    <div class="grid7">${['L','M','M','J','V','S','D'].map(w => `<span class="wd">${w}</span>`).join('')}${cells}</div>
    <div class="foot"><button type="button" class="lnk" data-act="cancel">Cancelar</button><button type="button" class="ds-btn ds-btn--primary ds-btn--md" data-act="apply"${sel ? '' : ' disabled style="opacity:.5"'}>Aplicar</button></div>`;
  const yl = el.querySelector('[data-y][aria-selected="true"]'); if (yl) yl.scrollIntoView({ block: 'center' });
  el.querySelectorAll('[data-open]').forEach(b => b.onclick = () => { CAL.open = CAL.open === b.dataset.open ? null : b.dataset.open; drawCal(); });
  el.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { CAL.m = +b.dataset.m; CAL.open = null; drawCal(); });
  el.querySelectorAll('[data-y]').forEach(b => b.onclick = () => { CAL.y = +b.dataset.y; CAL.open = null; drawCal(); });
  el.querySelectorAll('.d').forEach(b => b.onclick = () => { const d = new Date(+b.dataset.t); CAL.sel = d; CAL.y = d.getFullYear(); CAL.m = d.getMonth(); drawCal(); });
  el.querySelector('[data-act="cancel"]').onclick = closeCal;
  el.querySelector('[data-act="apply"]').onclick = () => { if (!CAL.sel) return; const i = CAL.input; i.value = fmtDMY(CAL.sel); S.touched.add(i.id); i.dispatchEvent(new Event('input')); i.dispatchEvent(new Event('change')); closeCal(); i.focus(); };
}
$$('[data-date]').forEach(i => {
  const btn = i.closest('.date').querySelector('.cal-btn');
  btn.onclick = e => { e.stopPropagation(); CAL.el && CAL.input === i ? closeCal() : openCal(i); };
  i.addEventListener('input', () => { let v = i.value.replace(/\D/g, '').slice(0, 8); if (v.length > 4) v = v.slice(0, 2) + '/' + v.slice(2, 4) + '/' + v.slice(4); else if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2); if (v !== i.value) i.value = v; });
});
document.addEventListener('click', closeCal);
addEventListener('keydown', e => { if (e.key === 'Escape') closeCal(); });


/* ---------- Selects con #drop-down list ---------- */
const CHEV = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
let openSel = null;
function syncSel(sel) { const t = sel._trig; if (!t) return; const o = sel.selectedOptions[0]; const empty = !sel.value; t.classList.toggle('ph-v', empty); t.querySelector('span').textContent = (o && o.textContent) || 'Selecciona'; t.disabled = sel.disabled; }
const syncAll = () => $$('select.in').forEach(syncSel);
function closeSel() { if (!openSel) return; openSel.trig.setAttribute('aria-expanded', 'false'); openSel.list.remove(); openSel = null; }
function openList(sel) {
  closeSel(); closeCal();
  const t = sel._trig, list = document.createElement('div'); list.className = 'ddl'; list.setAttribute('role', 'listbox');
  const opts = [...sel.options].filter(o => !o.disabled);
  list.innerHTML = opts.map(o => `<button type="button" role="option" data-v="${esc(o.value)}" aria-selected="${o.value === sel.value}">${esc(o.textContent)}</button>`).join('');
  list.style.top = (t.offsetTop + t.offsetHeight + 4) + 'px';
  t.parentElement.appendChild(list); t.setAttribute('aria-expanded', 'true'); openSel = { sel, trig: t, list, i: opts.findIndex(o => o.value === sel.value) };
  const cur = list.querySelector('[aria-selected="true"]'); if (cur) list.scrollTop = cur.offsetTop - 35;
  list.addEventListener('click', e => { e.stopPropagation(); const b = e.target.closest('button'); if (b) choose(b.dataset.v); });
}
function choose(v) { const { sel, trig } = openSel; sel.value = v; closeSel(); syncSel(sel); if (!sel.closest('.cn-modal')) S.dirty = true; sel.dispatchEvent(new Event('change')); trig.focus(); }
function enhanceSel(sel) {
  if (sel._trig) return;
  sel.classList.add('sel-native'); sel.tabIndex = -1;
  const t = document.createElement('button'); t.type = 'button'; t.className = 'in ds-input ds-input--standalone sel-trig'; t.setAttribute('aria-haspopup', 'listbox'); t.setAttribute('aria-expanded', 'false');
  t.innerHTML = '<span></span>' + CHEV; sel.insertAdjacentElement('afterend', t); sel._trig = t;
  const lb = sel.closest('.fld').querySelector('label'); if (lb) { lb.removeAttribute('for'); lb.onclick = () => t.focus(); t.setAttribute('aria-label', lb.textContent.trim()); }
  t.onclick = e => { e.stopPropagation(); openSel && openSel.sel === sel ? closeSel() : openList(sel); };
  t.onkeydown = e => {
    if (!openSel || openSel.sel !== sel) { if (['ArrowDown', 'Enter', ' '].includes(e.key)) { e.preventDefault(); openList(sel); } return; }
    const bs = [...openSel.list.querySelectorAll('button')];
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); openSel.i = Math.max(0, Math.min(bs.length - 1, openSel.i + (e.key === 'ArrowDown' ? 1 : -1))); bs.forEach((b, i) => b.classList.toggle('kb', i === openSel.i)); bs[openSel.i].scrollIntoView({ block: 'nearest' }); }
    else if (e.key === 'Enter' && openSel.i >= 0) { e.preventDefault(); choose(bs[openSel.i].dataset.v); }
    else if (e.key === 'Escape' || e.key === 'Tab') closeSel();
  };
  t.addEventListener('blur', () => setTimeout(() => { if (!openSel && sel.dataset.req !== undefined && S.touched.has(sel.id)) paint(sel); }, 0));
  sel.addEventListener('change', () => syncSel(sel)); sel.addEventListener('input', () => syncSel(sel));
  syncSel(sel);
}
$$('select.in').forEach(enhanceSel);
document.addEventListener('click', closeSel);

/* ---------- Progreso por sección ---------- */
const SECS = ['contacto', 'personal', 'direccion', 'ident', 'cotitular', 'bio'];
const REQ_DOCS = ['idFront', 'idBack'];
const fcount = keys => keys.filter(k => S.files[k]).length;
const pcount = h => h ? S.prints[h].size : S.prints.izq.size + S.prints.der.size;
function secState(sec) {
  if (sec === 'direccion') { const d = S.address ? 1 : 0; return { done: d, total: 1, err: S.touched.has('addr') && !d }; }
  const f = reqs().filter(e => e.dataset.sec === sec);
  /* 9964739ad: Identificación cuenta sus 4 datos y el frente y el reverso de la identificación (NEW_CLIENT_REQUIRED_DOCUMENTS) */
  const docs = sec === 'ident' ? REQ_DOCS : [];
  return { done: f.filter(e => !problem(e)).length + docs.filter(k => S.files[k]).length, total: f.length + docs.length, err: f.some(e => S.touched.has(e.id) && problem(e)) };
}
function update() {
  let done = 0, total = 0;
  SECS.forEach(sec => {
    let pct = 0, color = 'gray', txt = 'Pendiente', sum = '';
    if (['contacto', 'personal', 'direccion', 'ident'].includes(sec)) {
      const r = secState(sec); if (modeSecs().includes(sec)) { done += r.done; total += r.total; } pct = Math.round(r.done / r.total * 100);
      if (r.done === r.total) { color = 'green'; txt = 'Completo'; }
      else if (r.err) { color = 'red'; txt = 'Revisar'; }
      else if (r.done) { color = 'purple'; txt = `${r.done} de ${r.total}`; }
      sum = sec === 'direccion' ? txt : (r.done === r.total ? 'Completo' : r.err ? 'Revisar' : `${r.done} de ${r.total}`);
    } else if (sec === 'cotitular') {
      const n = S.co.length; pct = n ? 100 : 0; color = n ? 'green' : 'gray'; txt = n ? `${n} agregado${n > 1 ? 's' : ''}` : 'Sin agregar'; sum = txt;
    } else {
      const n = pcount(); pct = n ? 100 : 0; color = n ? 'green' : 'gray'; txt = `${n} huella${n === 1 ? '' : 's'}`; sum = txt;
    }
    tag($(`[data-tag="${sec}"]`), color, txt);
    tag($(`[data-sumtag="${sec}"]`), color === 'purple' ? 'gray' : color, sum);
    const isDone = color === 'green';
    const ic = $(`section[data-sec="${sec}"] .sec-ic`); if (ic) ic.classList.toggle('ok', isDone);
    [$(`#anchor .step[data-sec="${sec}"]`), $(`[data-cpi="${sec}"]`)].forEach(el => { if (!el) return; el.classList.toggle('is-done', isDone); const d = el.classList.contains('dot') ? el : el.querySelector('.dot'); d.innerHTML = isDone ? '<svg width="16" height="16" viewBox="0 0 24 24"><path d="M9.54998 18.0001L3.84998 12.3001L5.27498 10.8751L9.54998 15.1501L18.725 5.9751L20.15 7.4001L9.54998 18.0001Z" fill="currentColor"/></svg>' : d.dataset.n; });
  });
  const pct = Math.round(done / total * 100);
  { const ring = $('#qRing'); if (ring) { const C = 72.257; ring.querySelector('.cpi-v').setAttribute('stroke-dashoffset', (C - pct / 100 * C).toFixed(2)); ring.setAttribute('aria-valuenow', pct); ring.classList.toggle('full', pct === 100); }
    const qc = $('#qCount'); if (qc) qc.textContent = `Datos completados: ${done} de ${total}`;
    const qn = $('#qName'); if (qn) { const nm = [val($('#name')), val($('#lastName')), val($('#secondLastName'))].filter(Boolean).join(' '); qn.textContent = S.edit ? fullName(S.edit.client) : (nm || 'Cliente nuevo'); } }
  if ($('#piTxt')) { $('#piTxt').textContent = `${pct}% completado`; $('#piFill').style.width = pct + '%'; }
  const left = total - done;
  syncAnchor();
  if ($('#hint')) $('#hint').innerHTML = left ? `${left > 1 ? 'Faltan' : 'Falta'} <b>${left}</b> dato${left > 1 ? 's' : ''} obligatorio${left > 1 ? 's' : ''}.` : '<b>Todo listo para guardar.</b>';
  summary(); syncAll();
}
function summary() {
  if (!$('#sName')) return;
  const n = [val($('#name')), val($('#lastName')), val($('#secondLastName'))].filter(Boolean).join(' ');
  const sn = $('#sName'); sn.textContent = n || 'Nombre del cliente'; sn.classList.toggle('ph', !n);
  const av = $('#sAv');
  if (S.photo) av.innerHTML = `<img src="${S.photo.url}" alt="">`;
  else av.textContent = n ? ((val($('#name'))[0] || '') + (val($('#lastName'))[0] || '')).toUpperCase() : '?';
  const set = (id, v) => { const e = $(id); e.textContent = v || '—'; e.classList.toggle('ph', !v); };
  set('#sEmail', val($('#email'))); const ph = val($('#phone')); set('#sPhone', ph ? '+52 ' + ph : '');
  set('#sNat', $('#nat').value); set('#sCurp', val($('#curp')));
  richSummary();
}

/* ---------- Resumen dinámico: datos clave, listo para empeñar y tip según lo que falta ---------- */
const parseD = v => { const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v || ''); return m ? new Date(+m[3], +m[2] - 1, +m[1]) : null; };
const TODAY_S = new Date(2026, 9, 8);
function richSummary() {
  if (!$('#sKeys')) return;
  const dob = parseD(val($('#dob'))), vig = parseD(val($('#idVig')));
  const age = dob ? Math.floor((TODAY_S - dob) / 31557600000) : null;
  const months = vig ? Math.round((vig - TODAY_S) / 2629800000) : null;
  const nf = fcount(['idFront', 'idBack', 'domFile', 'ingFile']), np = pcount();
  const sk = (label, v, sub, cls) => `<div class="sk"><span>${label}</span><b class="${v ? '' : 'ph'}">${v || 'Sin dato'}</b>${sub ? `<small class="${cls || ''}">${sub}</small>` : ''}</div>`;
  $('#sKeys').innerHTML =
    sk('Edad', age != null ? `${age} años` : '', age == null ? 'Captura la fecha de nacimiento' : age >= 18 ? 'Mayor de edad' : 'Menor de edad', age == null ? '' : age >= 18 ? 'ok' : 'bad') +
    sk('Identificación', val($('#idType')) || (vig ? 'Vigencia' : ''), vig ? (months < 0 ? `Vencida desde ${val($('#idVig'))}` : months <= 3 ? `Vence en ${Math.max(months, 0)} ${months === 1 ? 'mes' : 'meses'}` : `Vigente hasta ${vig.getFullYear()}`) : 'Sin vigencia', vig ? (months < 0 ? 'bad' : months <= 3 ? 'warn' : 'ok') : '') +
    sk('Huellas', `${np} de 10`, np ? (np >= 2 ? 'Registro suficiente' : 'Registra otra de respaldo') : 'Sin registrar', np >= 2 ? 'ok' : np ? 'warn' : '') +
    sk('Documentos', `${nf} de 4`, nf === 4 ? 'Expediente completo' : `Faltan ${4 - nf}`, nf === 4 ? 'ok' : '');
  const domOk = fcount(['domFile']) > 0, idOk = fcount(['idFront', 'idBack']) === 2 && vig && months >= 0;
  const items = [['Mayor de edad', age != null && age >= 18, age != null && age < 18], ['Identificación vigente (frente y reverso)', idOk, vig && months < 0], ['Comprobante de domicilio', domOk], ['Al menos una huella registrada', np > 0]];
  const okN = items.filter(i => i[1]).length;
  $('#sReady').innerHTML = `<p class="sblk-t">Listo para su primer empeño <small>· ${okN} de ${items.length}</small></p><ul class="rd">${items.map(([t, on, no]) => `<li class="${on ? 'on' : no ? 'no' : ''}"><span class="ck">${on ? '<svg width="12" height="12"><use href="#i-check"/></svg>' : no ? '!' : ''}</span>${t}</li>`).join('')}</ul>`;
  let tip;
  if (age != null && age < 18) tip = ['Revisa la fecha de nacimiento', 'El cliente aparece como menor de edad. Confirma el dato con su identificación.'];
  else if (vig && months < 0) tip = ['Identificación vencida', 'Pide al cliente una identificación vigente antes de operar.'];
  else if (vig && months <= 3) tip = ['Su identificación vence pronto', 'Recuérdale renovarla para que no se detengan sus refrendos.'];
  else if (!np) tip = ['Registra su huella', 'La huella ayuda a validar su identidad en sus próximas operaciones en ventanilla.'];
  else if (!S.co.length) tip = ['¿Tiene cotitular?', 'Un cotitular también puede desempeñar las prendas del contrato si el titular no puede acudir.'];
  else if (nf < 4) tip = ['Completa su expediente', `Faltan ${4 - nf} documento${4 - nf === 1 ? '' : 's'} en Identificación.`];
  else tip = ['Expediente completo', 'Ya puedes guardar al cliente y empezar su primer empeño.'];
  $('#sTip').innerHTML = `<span class="ico"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 22q-.825 0-1.412-.587Q10 20.825 10 20h4q0 .825-.587 1.413Q12.825 22 12 22Zm-4-3v-2h8v2Zm.25-3q-1.725-1.025-2.737-2.75Q4.5 11.525 4.5 9.5q0-3.125 2.188-5.312Q8.875 2 12 2q3.125 0 5.312 2.188Q19.5 6.375 19.5 9.5q0 2.025-1.012 3.75Q17.475 14.975 15.75 16Zm.6-2h6.3q1.125-.8 1.738-1.975Q17.5 10.85 17.5 9.5q0-2.3-1.6-3.9T12 4Q9.7 4 8.1 5.6T6.5 9.5q0 1.35.613 2.525Q7.725 13.2 8.85 14ZM12 14Z" fill="currentColor"/></svg></span><p><b>${tip[0]}</b>${tip[1]}</p>`;
  const o = S.origin; let oe = $('#sOrig');
  if (!oe) { oe = document.createElement('span'); oe.id = 'sOrig'; oe.className = 'sorig'; $('#sName').after(oe); }
  oe.innerHTML = o ? `<span class="ds-chip ${SRC_CHIP[o.k] || ''}">${o.label}</span>` : '';
}


/* ---------- Card del cliente: secciones plegadas por defecto ---------- */
{ const tg = $('#qToggle'), card = tg && tg.closest('.qcli'), list = $('#sSecs');
  if (tg) tg.onclick = () => { const open = tg.getAttribute('aria-expanded') !== 'true'; tg.setAttribute('aria-expanded', open); tg.setAttribute('aria-label', open ? 'Ocultar secciones' : 'Mostrar secciones'); card.classList.toggle('open', open); list.hidden = !open; }; }

/* ---------- AnchorMenu: activo según scroll ---------- */
const links = $$('#anchor .step');
function syncAnchor() {
  let cur = 'contacto';
  /* Corrección al portarlo: los apartados ocultos (registro de Venta) miden 0 y su top 0 < 160 los marcaba como activos;
     en su archivo, con Venta, el activo siempre era Biometría (oculto) */
  $$('section[data-sec]').forEach(s => { if (!s.hidden && s.getBoundingClientRect().top < 160) cur = s.dataset.sec; });
  if (innerHeight + scrollY >= document.body.scrollHeight - 4) cur = modeSecs()[modeSecs().length - 1];
  links.forEach(l => { const on = l.dataset.sec === cur; l.classList.toggle('is-active', on); if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current'); }); $$('[data-cpi]').forEach(d => d.classList.toggle('is-active', d.dataset.cpi === cur));
}
addEventListener('scroll', syncAnchor, { passive: true });

/* ---------- Dropzone de producción → estados DS (subiendo / con archivo) ---------- */
const fmt = name => /\.png$/i.test(name) ? 'f-png' : /\.pdf$/i.test(name) ? 'f-pdf' : 'f-jpg';
function dzEmpty(id, label, tall, multiple, cam) {
  return `<label class="dz${tall ? ' tall' : ''}${cam ? ' has-cam' : ''}" for="${id}"><span class="ic"><svg width="24" height="24"><use href="#i-upload"/></svg></span><span class="t">${label} o</span><span class="dz-acts"><span class="dz-btn"><svg width="20" height="20"><use href="#i-mag"/></svg>Busca archivos</span>${cam ? `<button type="button" class="dz-btn dz-cam" data-cam="${cam.key}" aria-label="Tomar foto: ${cam.title}">${CAM_ICON}Tomar foto</button>` : ''}</span><input type="file" id="${id}" accept="image/jpeg,image/png,application/pdf"${multiple ? ' multiple' : ''}></label>`;
}
function dzFilled(name, key, idx) {
  const pv = key && S.files[key] && S.files[key].url;
  return `<div class="dz-f"><div class="fmt"><svg><use href="#${fmt(name)}"/></svg></div>${pv ? `<button type="button" class="nm-b" data-view="${key}" title="Ver archivo">${esc(name)}</button><button type="button" class="see" data-view="${key}" aria-label="Ver archivo" title="Ver archivo"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 16q1.875 0 3.188-1.312Q16.5 13.375 16.5 11.5q0-1.875-1.312-3.188Q13.875 7 12 7q-1.875 0-3.188 1.312Q7.5 9.625 7.5 11.5q0 1.875 1.312 3.188Q10.125 16 12 16Zm0-1.8q-1.125 0-1.912-.788Q9.3 12.625 9.3 11.5t.788-1.913Q10.875 8.8 12 8.8t1.913.787q.787.788.787 1.913t-.787 1.912q-.788.788-1.913.788Zm0 4.8q-3.65 0-6.65-2.038Q2.35 14.925 1 11.5q1.35-3.425 4.35-5.463Q8.35 4 12 4q3.65 0 6.65 2.037q3 2.038 4.35 5.463q-1.35 3.425-4.35 5.462Q15.65 19 12 19Zm0-7.5Zm0 5.5q2.825 0 5.188-1.488Q19.55 14.025 20.8 11.5q-1.25-2.525-3.612-4.013Q14.825 6 12 6Q9.175 6 6.812 7.487Q4.45 8.975 3.2 11.5q1.25 2.525 3.612 4.012Q9.175 17 12 17Z" fill="currentColor"/></svg></button>` : `<span class="nm">${esc(name)}</span>`}<button type="button" class="kebab" aria-label="Más opciones" data-k="${key}" data-i="${idx ?? ''}"><svg width="24" height="24"><use href="#i-kebab"/></svg></button></div>`;
}
function wireDrop(zone, input) {
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('over'));
  zone.addEventListener('drop', e => { e.preventDefault(); zone.classList.remove('over'); input.files = e.dataTransfer.files; input.dispatchEvent(new Event('change')); });
}
// sin carga simulada: el archivo queda listo al momento (el estado "cargando" de la maqueta ya no se finge con un temporizador)
function upload(host, after) { after(); }
function renderFile(key) {
  const host = $(`[data-file="${key}"]`), f = S.files[key];
  if (f) { host.innerHTML = dzFilled(f.name, key); wireKebab(host); $$('[data-view]', host).forEach(b => b.onclick = () => docView(key)); return; }
  host.innerHTML = dzEmpty('f-' + key, key === 'idFront' || key === 'idBack' ? 'Arrastra el archivo aquí' : 'Arrastra elementos aquí', true, false, { key, title: CAM_DOCS[key] ? CAM_DOCS[key].title : 'documento' });
  host.querySelector('[data-cam]').onclick = e => { e.preventDefault(); e.stopPropagation(); camDoc(key); };
  { const fi = host.querySelector('input[type=file]'); if (fi && $('#t-' + key)) fi.setAttribute('aria-labelledby', 't-' + key); }
  const inp = $('#f-' + key); wireDrop(host.querySelector('.dz'), inp);
  inp.addEventListener('change', () => { const file = inp.files[0]; if (!file) return; S.dirty = true; upload(host, () => { S.files[key] = { name: file.name, url: URL.createObjectURL(file), type: file.type, size: file.size }; renderFile(key); accTags(); update(); toast('Archivo cargado', file.name); }); });
}
function renderPhoto(state, pct) {
  const host = $('#photoHost'); const ph = S.photo;
  state = state || (ph ? 'filed' : 'upload');
  const CAM = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 17.5q1.875 0 3.188-1.312Q16.5 14.875 16.5 13q0-1.875-1.312-3.188Q13.875 8.5 12 8.5q-1.875 0-3.188 1.312Q7.5 11.125 7.5 13q0 1.875 1.312 3.188Q10.125 17.5 12 17.5Zm0-2q-1.05 0-1.775-.725Q9.5 14.05 9.5 13q0-1.05.725-1.775Q10.95 10.5 12 10.5q1.05 0 1.775.725Q14.5 11.95 14.5 13q0 1.05-.725 1.775Q13.05 15.5 12 15.5ZM4 21q-.825 0-1.412-.587Q2 19.825 2 19V7q0-.825.588-1.412Q3.175 5 4 5h3.15L9 3h6l1.85 2H20q.825 0 1.413.588Q22 6.175 22 7v12q0 .825-.587 1.413Q20.825 21 20 21Zm0-2h16V7h-4.05l-1.825-2h-4.25L8.05 7H4v12Zm8-6Z" fill="currentColor"/></svg>';
  const inner = {
    upload: `<span class="c"><span class="ph-cta"><span class="circ">${CAM}</span><span class="ph-t">Tomar foto</span></span></span>`,
    uploading: `<span class="c"><span class="ring" style="--p:${pct || 0}%"></span></span>`,
    error: `<span class="c"><span class="x"><svg width="26" height="26" style="color:var(--ats-white)"><use href="#i-close"/></svg></span></span>`,
    filed: ph ? `<img src="${ph.url}" alt="Foto del cliente"><span class="hov"><span class="ph-cta"><span class="circ">${CAM}</span><span class="ph-t">Tomar otra</span></span></span><span class="ph-badge" aria-hidden="true">${CAM}</span>` : ''
  }[state];
  const label = { upload: 'Tomar foto del cliente con la cámara', uploading: 'Cargando foto', error: 'Error al cargar, tomar otra foto', filed: 'Tomar otra foto del cliente' }[state];
  // el círculo abre la cámara (y acepta soltar una imagen); "Subir imagen" busca el archivo
  host.innerHTML = `<button type="button" class="phu ${state}" aria-label="${label}" ${state === 'uploading' ? 'disabled' : ''}>${inner}</button>
    <label class="ph-up" for="photo">${ph ? 'Cambiar por una imagen' : 'o sube una imagen'}<input type="file" id="photo" accept="image/jpeg,image/png"></label>${ph ? '<button type="button" class="ph-up ph-rm" id="phRemove">Quitar foto</button>' : ''}`;
  host.querySelector('.phu').onclick = () => $('#camBtn').click();
  const box = host.querySelector('.phu'), inp = $('#photo');
  box.addEventListener('dragover', e => { e.preventDefault(); box.classList.add('over'); });
  box.addEventListener('dragleave', () => box.classList.remove('over'));
  box.addEventListener('drop', e => { e.preventDefault(); box.classList.remove('over'); take(e.dataTransfer.files[0]); });
  inp.addEventListener('change', () => { const f = inp.files[0]; inp.value = ''; take(f); });
  S.takePhoto = take;
  /* 9964739ad · foto: solo JPG o PNG de máximo 10 MB (PHOTO_ERROR), se puede quitar (PHOTO_REMOVE) y no hay carga simulada */
  function take(f, fromCam) {
    if (!f) return; S.dirty = true;
    const er = $('#photoErr');
    if (!/^image\/(jpeg|png)$/.test(f.type) || f.size > 10 * 1048576) {
      renderPhoto('error'); er.hidden = false; er.innerHTML = '<svg width="16" height="16"><use href="#i-err"/></svg>Usa una imagen JPG o PNG de máximo 10 MB.'; $('#photoHelp').hidden = true; return;
    }
    er.hidden = true; $('#photoHelp').hidden = false;
    if (S.photo) URL.revokeObjectURL(S.photo.url);
    S.photo = { name: f.name, url: URL.createObjectURL(f) }; renderPhoto(); summary();
    if (fromCam) toast('Archivo cargado', f.name);
  }
  const rm = $('#phRemove'); if (rm) rm.onclick = () => { URL.revokeObjectURL(S.photo.url); S.photo = null; S.dirty = true; $('#photoErr').hidden = true; $('#photoHelp').hidden = false; renderPhoto(); summary(); $('#photoHost .phu').focus(); };
}
function wireKebab(host) {
  $$('.kebab', host).forEach(b => b.onclick = e => {
    e.stopPropagation(); closeMenus();
    const m = document.createElement('div'); m.className = 'menu'; m.innerHTML = (S.files[b.dataset.k] && S.files[b.dataset.k].url ? '<button type="button" data-a="see">Ver archivo</button>' : '') + '<button type="button" data-a="rep">Reemplazar</button><button type="button" data-a="del">Eliminar</button>';
    b.parentElement.appendChild(m);
    m.onclick = ev => {
      const a = ev.target.dataset.a; if (!a) return; const k = b.dataset.k;
      if (a === 'see') { m.remove(); docView(k); return; }
      { delete S.files[k]; renderFile(k); accTags(); update(); if (a === 'rep') $('#f-' + k).click(); }
    };
  });
}
function closeMenus() { $$('.menu').forEach(m => m.remove()); }
document.addEventListener('click', closeMenus);
function accTags() {
  const n = fcount(['idFront', 'idBack']);
  tag($('[data-acctag="id"]'), n === 2 ? 'green' : n ? 'purple' : 'gray', n === 2 ? 'Completo' : `${n} de 2 archivos`);
  tag($('[data-acctag="dom"]'), S.files.domFile ? 'green' : 'gray', S.files.domFile ? 'Cargado' : 'Sin archivo');
  tag($('[data-acctag="ing"]'), S.files.ingFile ? 'green' : 'gray', S.files.ingFile ? 'Cargado' : 'Sin archivo');
}
const CAM_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 17.5q1.875 0 3.188-1.312Q16.5 14.875 16.5 13q0-1.875-1.312-3.188Q13.875 8.5 12 8.5q-1.875 0-3.188 1.312Q7.5 11.125 7.5 13q0 1.875 1.312 3.188Q10.125 17.5 12 17.5Zm0-2q-1.05 0-1.775-.725Q9.5 14.05 9.5 13q0-1.05.725-1.775Q10.95 10.5 12 10.5q1.05 0 1.775.725Q14.5 11.95 14.5 13q0 1.05-.725 1.775Q13.05 15.5 12 15.5ZM4 21q-.825 0-1.412-.587Q2 19.825 2 19V7q0-.825.588-1.412Q3.175 5 4 5h3.15L9 3h6l1.85 2H20q.825 0 1.413.588Q22 6.175 22 7v12q0 .825-.587 1.413Q20.825 21 20 21Zm0-2h16V7h-4.05l-1.825-2h-4.25L8.05 7H4v12Zm8-6Z" fill="currentColor"/></svg>';

/* ---------- Cámara de la computadora: foto del cliente, INE y comprobantes ---------- */
let camStream = null, camShot = null, camCfg = null;
const CAM_PHOTO = { title: 'Foto del cliente', hint: 'Centra el rostro del cliente dentro del marco, de frente y sin lentes oscuros.', mirror: true, w: 720, h: 720, guide: 'circle', name: 'foto-cliente', onUse: f => S.takePhoto && S.takePhoto(f, true), retFocus: '#camBtn' };
const CAM_DOCS = {
  idFront: { title: 'Frente de la identificación', hint: 'Coloca el frente de la identificación dentro del marco, sin reflejos y con los datos legibles.', w: 1280, h: 808, guide: 'card', name: 'identificacion-frente' },
  idBack: { title: 'Reverso de la identificación', hint: 'Coloca el reverso de la identificación dentro del marco, sin reflejos y con los datos legibles.', w: 1280, h: 808, guide: 'card', name: 'identificacion-reverso' },
  domFile: { title: 'Comprobante de domicilio', hint: 'Coloca el comprobante completo dentro del marco, con la dirección y la fecha legibles.', w: 1000, h: 1294, guide: 'page', name: 'comprobante-domicilio' },
  ingFile: { title: 'Comprobante de ingresos', hint: 'Coloca el comprobante completo dentro del marco, con el nombre y el monto legibles.', w: 1000, h: 1294, guide: 'page', name: 'comprobante-ingresos' },
};
const camStop = () => { if (camStream) { camStream.getTracks().forEach(t => t.stop()); camStream = null; } };
const camClose = () => { camStop(); camShot = null; const rf = camCfg && camCfg.retFocus; $('#modalRoot').innerHTML = ''; if (camCfg && camCfg.onClose) return camCfg.onClose(); rf && $(rf) && $(rf).focus(); };
const camView = (inner, cls) => `<div class="cam-view ${cls || ''} g-${camCfg.guide}" style="aspect-ratio:${camCfg.w} / ${camCfg.h};--ar:${camCfg.w / camCfg.h}">${inner}</div>`;
function camModal(view, hint, foot) {
  modal(`<div class="ds-modal__header"><h3>${camCfg.title}</h3><button type="button" class="ds-btn ds-btn--tertiary ds-btn--icon-md cn-modal__x" id="camX" aria-label="Cerrar"><svg width="24" height="24"><use href="#i-close"/></svg></button></div>${view}${hint ? `<p class="cam-hint">${hint}</p>` : ''}<div class="ds-modal__footer">${foot}</div>`, 'cam' + (camCfg.h > camCfg.w ? ' cam-tall' : ''));
  $('#camX').onclick = camClose;
  $('#modalRoot .scrim').addEventListener('keydown', e => { if (e.key === 'Escape') camClose(); });
}
async function camOpen(cfg) {
  if (cfg) camCfg = cfg; camShot = null;
  camModal(camView('<div class="msg"><span class="spin"></span>Activando la cámara…</div>'), 'Si el navegador lo pide, permite el acceso a la cámara.', '<button type="button" class="ds-btn ds-btn--tertiary ds-btn--md" id="camCancel">Cancelar</button>');
  $('#camCancel').onclick = camClose;
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return camError('NoSupport');
  try {
    camStream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1920 }, height: { ideal: 1080 }, facingMode: camCfg.mirror ? 'user' : 'environment' }, audio: false });
    if (!$('#modalRoot .cam-view')) { camStop(); return; }
    camLive();
  } catch (e) { camError(e && e.name); }
}
function camLive() {
  camModal(camView(`<video id="camVideo" class="${camCfg.mirror ? 'mirror' : ''}" autoplay playsinline muted></video><span class="guide" aria-hidden="true"></span>`), camCfg.hint,
    `<button type="button" class="ds-btn ds-btn--tertiary ds-btn--md" id="camCancel">Cancelar</button><button type="button" class="ds-btn ds-btn--primary ds-btn--md" id="camShoot">${CAM_ICON}Capturar</button>`);
  const v = $('#camVideo'); v.srcObject = camStream; v.play().catch(() => {});
  $('#camCancel').onclick = camClose;
  $('#camShoot').onclick = () => {
    if (!v.videoWidth) return;
    const r = camCfg.w / camCfg.h; let sw = v.videoWidth, sh = sw / r; if (sh > v.videoHeight) { sh = v.videoHeight; sw = sh * r; }
    const c = document.createElement('canvas'); c.width = camCfg.w; c.height = camCfg.h; const ctx = c.getContext('2d');
    /* 9964739ad: la foto guardada no va en espejo (solo la vista en vivo) */
    ctx.drawImage(v, (v.videoWidth - sw) / 2, (v.videoHeight - sh) / 2, sw, sh, 0, 0, camCfg.w, camCfg.h);
    c.toBlob(b => { camShot = b; camPreview(); }, 'image/jpeg', 0.9);
  };
  $('#camShoot').focus();
}
function camPreview() {
  const url = URL.createObjectURL(camShot);
  camModal(camView(`<img src="${url}" alt="Vista previa: ${esc(camCfg.title)}">`), camCfg.mirror ? 'Revisa que el rostro se vea claro y completo.' : 'Revisa que el documento se vea completo, enfocado y sin reflejos.',
    `<button type="button" class="ds-btn ds-btn--tertiary ds-btn--md" id="camAgain">Tomar otra</button><button type="button" class="ds-btn ds-btn--primary ds-btn--md" id="camUse">Usar foto</button>`);
  $('#camAgain').onclick = () => { camShot = null; camLive(); };
  $('#camUse').onclick = () => {
    const f = new File([camShot], `${camCfg.name}-${Date.now()}.jpg`, { type: 'image/jpeg' });
    camStop(); camShot = null; $('#modalRoot').innerHTML = ''; camCfg.onUse(f);
  };
  $('#camUse').focus();
}
/* 9964739ad · errores específicos de la cámara (NEW_CLIENT_CAMERA_ERRORS de su React). Sin "Subir archivo": el texto ya dice que se sube
   el archivo desde la pantalla; "Reintentar" solo si tiene sentido (no con permiso denegado ni con navegador sin cámara) */
const CAM_ERRORS = {
  denied: 'El navegador bloqueó la cámara. Permite el acceso desde el candado de la barra de direcciones y vuelve a abrir esta ventana, o sube el archivo.',
  'not-found': 'No encontramos una cámara conectada. Conecta una o sube el archivo.',
  busy: 'Otra aplicación está usando la cámara. Ciérrala y vuelve a intentarlo.',
  unsupported: 'Este navegador no permite usar la cámara. Sube el archivo.',
  unknown: 'Algo falló al activar la cámara. Vuelve a intentarlo o sube el archivo.',
};
const camErrorKind = name => name === 'NotAllowedError' || name === 'SecurityError' ? 'denied' : name === 'NotFoundError' || name === 'OverconstrainedError' ? 'not-found' : name === 'NotReadableError' || name === 'AbortError' ? 'busy' : name === 'NoSupport' ? 'unsupported' : 'unknown';
function camError(name) {
  camStop();
  const kind = camErrorKind(name), canRetry = kind !== 'denied' && kind !== 'unsupported';
  camModal(camView(`<div class="msg"><b>No pudimos activar la cámara</b>${CAM_ERRORS[kind]}</div>`, 'err'), '',
    `<button type="button" class="ds-btn ds-btn--tertiary ds-btn--md" id="camCancel">Cancelar</button>${canRetry ? '<button type="button" class="ds-btn ds-btn--primary ds-btn--md" id="camRetry">Reintentar</button>' : ''}`);
  $('#camCancel').onclick = camClose;
  if (canRetry) $('#camRetry').onclick = () => camOpen();
}
function camDoc(key) {
  camOpen({ ...CAM_DOCS[key], fileInput: '#f-' + key, retFocus: `[data-cam="${key}"]`, onUse: f => setDocFile(key, f) });
}
function setDocFile(key, file) {
  const host = $(`[data-file="${key}"]`); S.dirty = true;
  upload(host, () => { S.files[key] = { name: file.name, url: URL.createObjectURL(file), type: file.type, size: file.size }; renderFile(key); accTags(); update(); toast('Archivo cargado', file.name); });
}
$('#camBtn').onclick = () => camOpen(CAM_PHOTO);

/* ---------- Visor de documentos cargados (imagen o PDF) ---------- */
const DOC_TITLE = { idFront: 'Frente de la identificación', idBack: 'Reverso de la identificación', domFile: 'Comprobante de domicilio', ingFile: 'Comprobante de ingresos' };
function docView(key) {
  const f = S.files[key]; if (!f) return;
  const isImg = f.url && /^image\//.test(f.type || ''), isPdf = f.url && /pdf/.test(f.type || '');
  let zoom = false;
  const stage = isImg ? `<div class="dv-stage" id="dvStage"><img src="${f.url}" alt="${esc(DOC_TITLE[key] || f.name)}" id="dvImg"><div class="dv-tools"><button type="button" id="dvZoom" aria-label="Acercar" title="Acercar">+</button><button type="button" id="dvRot" aria-label="Girar" title="Girar">↻</button></div></div>`
    : isPdf ? `<div class="dv-stage"><iframe src="${f.url}#toolbar=1&view=FitH" title="${esc(DOC_TITLE[key] || f.name)}"></iframe></div>`
    : `<div class="dv-stage"><div class="dv-none"><b>Vista previa no disponible</b>Este archivo no se puede mostrar en el navegador.</div></div>`;
  modal(`<div class="ds-modal__header"><h3>${esc(DOC_TITLE[key] || 'Documento')}</h3><button type="button" class="ds-btn ds-btn--tertiary ds-btn--icon-md cn-modal__x" id="dvX" aria-label="Cerrar"><svg width="24" height="24"><use href="#i-close"/></svg></button></div>
    <div class="dv-meta"><span class="ds-chip">${isPdf ? 'PDF' : isImg ? (/png/.test(f.type) ? 'PNG' : 'JPG') : 'Archivo'}</span>${esc(f.name)}${f.size ? ` · ${f.size < 1048576 ? Math.max(1, Math.round(f.size / 1024)) + ' KB' : (f.size / 1048576).toFixed(1) + ' MB'}` : ''}</div>
    ${stage}
    <div class="ds-modal__footer"><button type="button" class="ds-btn ds-btn--tertiary ds-btn--md" id="dvRep">Reemplazar</button><button type="button" class="ds-btn ds-btn--primary ds-btn--md" id="dvOk">Listo</button></div>`, 'dv');
  const close = () => { $('#modalRoot').innerHTML = ''; const b = $(`[data-file="${key}"] .see`); b && b.focus(); };
  $('#dvX').onclick = close; $('#dvOk').onclick = close;
  $('#modalRoot .scrim').addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  $('#modalRoot .scrim').addEventListener('click', e => { if (e.target.classList.contains('scrim')) close(); });
  $('#dvRep').onclick = () => { $('#modalRoot').innerHTML = ''; delete S.files[key]; renderFile(key); accTags(); update(); $('#f-' + key).click(); };
  if (isImg) {
    let rot = 0; const img = $('#dvImg'), st = $('#dvStage');
    const apply = () => { img.style.transform = `rotate(${rot}deg)`; st.classList.toggle('zoom', zoom); $('#dvZoom').textContent = zoom ? '−' : '+'; $('#dvZoom').setAttribute('aria-label', zoom ? 'Alejar' : 'Acercar'); };
    $('#dvZoom').onclick = () => { zoom = !zoom; apply(); };
    img.onclick = () => { zoom = !zoom; apply(); };
    $('#dvRot').onclick = () => { rot = (rot + 90) % 360; apply(); };
  }
  setTimeout(() => $('#dvOk') && $('#dvOk').focus(), 30);
}
renderPhoto(); ['idFront', 'idBack', 'domFile', 'ingFile'].forEach(renderFile);
$$('[data-acc]>button').forEach(b => b.addEventListener('click', () => { const a = b.parentElement; a.classList.toggle('open'); b.setAttribute('aria-expanded', a.classList.contains('open')); }));

/* ---------- Dirección: Search (DS dropdown) + manual + ItemCard ---------- */
const ADDR = [
  { nombre: 'Casa', calle: 'Av. Álvaro Obregón', ext: '121', int: '4B', col: 'Roma Norte', mun: 'Cuauhtémoc', edo: 'Ciudad de México', cp: '06700' },
  { nombre: 'Casa', calle: 'Ámsterdam', ext: '45', int: '', col: 'Condesa', mun: 'Cuauhtémoc', edo: 'Ciudad de México', cp: '06100' },
];
const line = a => `${a.calle} ${a.ext}${a.int ? ' Int. ' + a.int : ''}, ${a.col}`;
const line2 = a => `${a.mun}, ${a.edo} · C.P. ${a.cp}`;
let t;
$('#addrSearch').addEventListener('input', e => {
  const q = e.target.value.trim(), dd = $('#addrDD'); clearTimeout(t);
  if (q.length < 3) { dd.hidden = true; return; }
  dd.hidden = false;
  {
    dd.innerHTML = '<span class="cap">Direcciones</span>' + ADDR.map((a, i) => `<button type="button" data-i="${i}"><b>${esc(line(a))}</b><small>${esc(line2(a))}</small></button>`).join('');
    $$('button', dd).forEach(b => b.onclick = () => saveAddr(ADDR[b.dataset.i]));
  }
});
function saveAddr(a) {
  S.address = a; S.dirty = true; $('#addrDD').hidden = true; $('#addrSearch').value = ''; $('#addrErr').hidden = true; $('[data-box="addr"]').classList.remove('err');
  $('#addrEntry').hidden = true;
  const s = $('#addrSaved'); s.hidden = false;
  s.innerHTML = `<div class="item" id="addrItem" title="Editar dirección"><span class="ds-avatar ds-avatar--md cn-av">${esc(a.nombre.slice(0, 2).toUpperCase())}</span><span class="tx"><b>${esc(line(a))}</b><small>${esc(a.nombre)} | ${esc(line2(a))}</small></span><button type="button" class="del" aria-label="Quitar dirección"><svg width="20" height="20"><use href="#i-del"/></svg></button></div>`;
  $('#addrItem').onclick = () => { s.hidden = true; $('#addrEntry').hidden = false; openManual(true); fillManual(a); };
  $('#addrItem .del').onclick = e => { e.stopPropagation(); S.address = null; s.hidden = true; $('#addrEntry').hidden = false; update(); };
  update();
}
function fillManual(a) { Object.entries({ 'a-nombre': a.nombre, 'a-cp': a.cp, 'a-calle': a.calle, 'a-ext': a.ext, 'a-int': a.int, 'a-col': a.col, 'a-mun': a.mun, 'a-edo': a.edo }).forEach(([k, v]) => $('#' + k).value = v);  syncAll(); }
function openManual(o) { $('#manual').hidden = !o; $('#addrSearch').disabled = !!o; if (o) $('#addrDD').hidden = true; $('.addr-row').classList.toggle('manual-on', !!o); $('#manualToggle').setAttribute('aria-expanded', o); $('#manualChev').style.transform = o ? 'rotate(180deg)' : ''; }
$('#manualToggle').onclick = () => openManual($('#manual').hidden);
$('#addrCancel').onclick = () => { openManual(false); if (S.address) saveAddr(S.address); };
$('#addrSave').onclick = () => {
  let first = null;
  $$('[data-areq]').forEach(el => { const m = val(el) ? '' : (el.tagName === 'SELECT' ? 'Debes seleccionar una opción' : 'Campo obligatorio'); showErr(el.closest('.fld'), m, el); if (m && !first) first = el; });
  { const cp = $('#a-cp'); if (val(cp) && !/^\d{5}$/.test(val(cp))) { showErr(cp.closest('.fld'), 'El C.P. debe tener 5 dígitos.', cp); if (!first) first = cp; } }
  if (first) { first.focus(); return; }
  openManual(false);
  saveAddr({ nombre: $('#a-nombre').value, cp: val($('#a-cp')), calle: val($('#a-calle')), ext: val($('#a-ext')), int: val($('#a-int')), col: $('#a-col').value, mun: $('#a-mun').value, edo: $('#a-edo').value });
};

/* ---------- Cotitular: formulario existente + ItemCard ---------- */
const coIds = ['c-name', 'c-ln', 'c-ln2', 'c-email', 'c-phone', 'c-idtype', 'c-idnum', 'c-rel'];
let coEdit = -1;
$('#coAdd').onclick = () => { coEdit = -1; coIds.forEach(id => { $('#' + id).value = ''; }); $$('#coForm .err').forEach(e => e.classList.remove('err')); $$('#coForm .ferr').forEach(e => e.hidden = true); $('#coForm').hidden = false; $('#coAdd').hidden = true; syncAll(); $('#c-name').focus(); };
$('#coCancel').onclick = () => { $('#coForm').hidden = true; $('#coAdd').hidden = false; };
$('#coSave').onclick = () => {
  let first = null;
  $$('[data-creq]').forEach(el => { const m = val(el) ? '' : (el.tagName === 'SELECT' ? 'Debes seleccionar una opción' : 'Campo obligatorio'); showErr(el.closest('.fld'), m, el); if (m && !first) first = el; });
  if (first) { first.focus(); return; }
  const c = Object.fromEntries(coIds.map(id => [id, val($('#' + id)) || $('#' + id).value]));
  /* 9964739ad: cada cotitular lleva un id estable (cotitular-N) */
  if (coEdit >= 0) { c.id = S.co[coEdit].id; S.co[coEdit] = c; } else { c.id = 'cotitular-' + (++S.coSeq); S.co.push(c); }
  S.dirty = true; $('#coForm').hidden = true; $('#coAdd').hidden = false; renderCo(); update();
  toast('Cotitular agregado', [c['c-name'], c['c-ln']].join(' '));
};
function renderCo() {
  $('#coList').innerHTML = S.co.map((c, i) => `<div class="item" data-e="${i}" title="Editar"><span class="ds-avatar ds-avatar--md cn-av">${esc(((c['c-name'][0] || '') + (c['c-ln'][0] || '')).toUpperCase())}</span><span class="tx"><b>${esc([c['c-name'], c['c-ln'], c['c-ln2']].filter(Boolean).join(' '))}</b><small>${esc(c['c-rel'])}${c['c-phone'] ? ' | +52 ' + esc(c['c-phone']) : ''}</small></span><button type="button" class="del" aria-label="Quitar cotitular" data-d="${i}"><svg width="20" height="20"><use href="#i-del"/></svg></button></div>`).join('');
  $$('[data-e]', $('#coList')).forEach(b => b.onclick = () => { coEdit = +b.dataset.e; const c = S.co[coEdit]; coIds.forEach(id => $('#' + id).value = c[id] || ''); syncAll(); $('#coForm').hidden = false; $('#coAdd').hidden = true; });
  $$('[data-d]', $('#coList')).forEach(b => b.onclick = e => { e.stopPropagation(); S.co.splice(+b.dataset.d, 1); renderCo(); update(); });
}

/* ---------- Huellas: componentes de producción, flujo guiado y responsivo ---------- */
const TIPS = { Pulgar: [208.2, 170.4, -30], 'Índice': [143.5, 34.6, 0], Medio: [94.4, 15.8, 0], Anular: [53.6, 34.6, 0], 'Meñique': [12.9, 72.1, 0] };
const SHORT = { izq: 'izq.', der: 'der.' };
S.printImg = {}; S.fpState = 'idle';
function bigHand(h) {
  h = h || S.hand; const flip = h === 'der', done = S.prints[h];
  const tips = S.hand !== h ? '' : FINGERS.map(f => { const [x, y, r] = TIPS[f]; const sel = S.hand === h && S.finger === f, ok = done.has(f), col = sel ? 'var(--ats-primary-300)' : ok ? 'var(--ats-success-green-200)' : 'var(--ats-neutral-400)'; return `<g class="tip-f ${sel ? 'sel' : ''} ${ok ? 'ok' : ''}" data-h="${h}" data-f="${f}" role="button" tabindex="0" aria-pressed="${sel}" aria-label="${f} ${HN[h]}${ok ? ', registrada' : ''}" transform="translate(${x} ${y}) rotate(${r}) translate(-12 -12)" style="color:${col}"><title>${f} ${HN[h]}</title><circle class="tip-bg" cx="12" cy="12" r="15"/><use href="#i-fp" width="24" height="24"/></g>`; }).join('');
  return `<svg viewBox="0 0 226 349" aria-label="Mano ${HN[h] === 'izquierdo' ? 'izquierda' : 'derecha'}: toca un dedo"><g${flip ? ' transform="translate(226 0) scale(-1 1)"' : ''}><use href="#i-bighand" width="226" height="349"/>${tips}</g></svg>`;
}
const nextFinger = () => FINGERS.find(f => !S.prints[S.hand].has(f));
function pickFinger(f) { S.fpErr = ''; S.finger = f; S.fpState = S.prints[S.hand].has(f) ? 'done' : 'idle'; renderFp(); }
function renderFp() {
  $$('.hand').forEach(h => h.setAttribute('aria-pressed', h.dataset.hand === S.hand));
  ['izq', 'der'].forEach(h => { const n = S.prints[h].size, el = $(`[data-hc="${h}"]`); if (!el) return; el.textContent = n ? `${n} huella${n > 1 ? 's' : ''}` : 'Sin huellas'; el.classList.toggle('ok', !!n); });
  renderReg();
  const hs = $('#fpHands');
  if (hs) {
    hs.innerHTML = ['izq', 'der'].map(h => { const n = S.prints[h].size; return `<div class="hcard ${S.hand === h ? 'on' : ''}" data-hcard="${h}"><div class="hcard-h"><span class="hl">Mano ${h === 'izq' ? 'izquierda' : 'derecha'}</span><span class="hand-c ${n ? 'ok' : ''}">${n ? `${n} de 5 huellas` : 'Sin huellas'}</span></div><div class="big">${bigHand(h)}</div></div>`; }).join('');
    $$('.hcard', hs).forEach(c => c.onclick = e => { if (e.target.closest('.tip-f')) return; S.hand = c.dataset.hcard; S.finger = nextFinger() || null; S.fpState = S.finger ? 'idle' : 'done'; renderFp(); });
    $$('.tip-f', hs).forEach(g => { const go = e => { e.stopPropagation(); S.hand = g.dataset.h; pickFinger(g.dataset.f); setTimeout(() => { const t = $(`#fpHands .tip-f[data-h="${g.dataset.h}"][data-f="${g.dataset.f}"]`); t && t.focus(); }, 0); }; g.onclick = go; g.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(e); } }; });
  }
  const p = $('#fpanel');
  if (!S.hand) { p.className = 'fpanel empty'; p.innerHTML = 'Elige una mano para ver sus dedos.'; return; }
  p.className = 'fpanel';
  const done = S.prints[S.hand], f = S.finger, key = f && S.hand + ':' + f;
  const chips = FINGERS.map(x => `<button type="button" class="fchip" data-f="${x}" aria-pressed="${x === f}"><svg width="20" height="20" style="color:${done.has(x) ? 'var(--ats-success-green-200)' : 'var(--ats-primary-300)'}"><use href="#${done.has(x) ? 'i-check' : 'i-fp'}"/></svg>${x}</button>`).join('');
  let cap = '';
  if (!f) cap = `<div class="cap-box"><p class="cap-msg">Toca un dedo en la lista o en la mano.</p></div>`;
  else {
    /* 9964739ad · sin captura simulada: el lector aún no está conectado, así que se carga la imagen escaneada de la huella
       (JPG o PNG, máx. 10 MB, validada); la imagen se guarda en el formulario */
    const st = S.fpState, img = S.printImg[key];
    const box = img ? `<img src="${img}" alt="Huella ${f} ${HN[S.hand]}">` : `<svg width="48" height="48" style="color:${st === 'done' ? 'var(--ats-success-green-200)' : 'var(--ats-primary-300)'}"><use href="#i-fp"/></svg>`;
    const nx = nextFinger();
    const msg = st === 'done' ? (nx ? `Listo. Sigue con ${nx.toLowerCase()} ${HN[S.hand]}.` : `Ya registraste los 5 dedos de la mano ${HN[S.hand] === 'izquierdo' ? 'izquierda' : 'derecha'}.`) : 'El lector de huellas aún no está conectado. Carga la imagen escaneada de la huella (JPG o PNG, máx. 10 MB).';
    const err = S.fpErr ? `<p class="cap-msg" style="color:var(--ats-error-red-200)" role="alert">${esc(S.fpErr)}</p>` : '';
    const acts = st === 'done'
      ? `${nx ? `<button type="button" class="ds-btn ds-btn--primary ds-btn--md" id="fpNext">Siguiente: ${nx}</button>` : (S.prints[S.hand === 'izq' ? 'der' : 'izq'].size < 5 ? `<button type="button" class="ds-btn ds-btn--primary ds-btn--md" id="fpOtherHand">Ir a mano ${S.hand === 'izq' ? 'derecha' : 'izquierda'}</button>` : '')}<button type="button" class="lnk" id="fpRetake">Repetir</button>`
      : `<button type="button" class="ds-btn ds-btn--primary ds-btn--md" id="fpPick"><svg width="20" height="20" aria-hidden="true" style="color:var(--ats-white)"><use href="#i-upload"/></svg>Cargar imagen</button><button type="button" class="ds-btn ds-btn--tertiary ds-btn--md" disabled>Lector no conectado</button>`;
    cap = `<div class="cap-box"><div class="slot ${st === 'done' ? 'done' : ''}" id="slot"><div class="box" role="button" tabindex="0" aria-label="Cargar imagen">${box}</div></div>
      <div class="cap-info"><div class="slot-lbl"><span>${f} ${HN[S.hand]}</span>${st === 'done' ? '<span class="ds-tag ds-tag--verde">Capturada</span>' : ''}</div><p class="cap-msg" aria-live="polite">${msg}</p>${err}<div class="cap-act">${acts}</div></div></div>
      <input type="file" id="fpFile" accept="image/jpeg,image/png" hidden>`;
  }
  p.innerHTML = `<div class="fright"><div><p class="fp-step"><span class="dot">2</span>Elige el dedo</p><div class="fchips">${chips}</div></div><div><p class="fp-step"><span class="dot">3</span>Toma la huella</p>${cap}</div></div>`;
  $$('.fchip', p).forEach(b => b.onclick = () => pickFinger(b.dataset.f));
  const pick = () => { const fi = $('#fpFile'); if (fi) fi.click(); };
  if ($('#fpPick')) $('#fpPick').onclick = pick;
  if ($('#slot .box')) { $('#slot .box').onclick = pick; $('#slot .box').onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } }; }
  if ($('#fpFile')) $('#fpFile').onchange = e => {
    const file = e.target.files[0]; e.target.value = ''; if (!file) return;
    if (!/^image\/(jpeg|png)$/.test(file.type) || file.size > 10 * 1048576) { S.fpErr = 'Usa una imagen JPG o PNG de máximo 10 MB.'; renderFp(); return; }
    S.fpErr = ''; const k = S.hand + ':' + S.finger; if (S.printImg[k]) URL.revokeObjectURL(S.printImg[k]);
    S.printImg[k] = URL.createObjectURL(file); S.prints[S.hand].add(S.finger); S.dirty = true; S.fpState = 'done'; renderFp(); update();
  };
  if ($('#fpNext')) $('#fpNext').onclick = () => pickFinger(nextFinger());
  if ($('#fpOtherHand')) $('#fpOtherHand').onclick = () => { S.hand = S.hand === 'izq' ? 'der' : 'izq'; S.finger = null; S.fpState = 'idle'; S.fpErr = ''; renderFp(); };
  if ($('#fpRetake')) $('#fpRetake').onclick = () => { S.prints[S.hand].delete(S.finger); delete S.printImg[S.hand + ':' + S.finger]; S.fpState = 'idle'; S.fpErr = ''; renderFp(); update(); };
}
function renderReg() {
  const items = ['izq', 'der'].flatMap(h => FINGERS.filter(f => S.prints[h].has(f)).map(f => [h, f]));
  $('#fpReg').innerHTML = `<b>Huellas registradas (${items.length})</b>` + (items.length ? items.map(([h, f]) => `<span class="rchip">${f} ${SHORT[h]}<button type="button" data-rm="${h}:${f}" aria-label="Quitar huella ${f} ${HN[h]}">✕</button></span>`).join('') : '<span class="none">Aún no registras huellas.</span>');
  $$('[data-rm]', $('#fpReg')).forEach(b => b.onclick = () => { const [h, f] = b.dataset.rm.split(':'); S.prints[h].delete(f); delete S.printImg[h + ':' + f]; if (S.hand === h && S.finger === f) S.fpState = 'idle'; renderFp(); update(); });
}
$$('.hand').forEach(h => { const go = () => { S.hand = h.dataset.hand; S.finger = nextFinger() || null; S.fpState = S.finger ? 'idle' : 'done'; if (!S.finger) S.finger = null; renderFp(); }; h.onclick = go; h.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } }; });
renderFp();

/* ---------- Ver más Información ---------- */
$('#moreToggle').onclick = () => { const m = $('#more'); m.hidden = !m.hidden; $('#moreToggle').setAttribute('aria-expanded', !m.hidden); $('#moreChev').style.transform = m.hidden ? '' : 'rotate(180deg)'; };

/* ---------- DS Alert / Toast / Modal ---------- */
function alertNeg(title, msg, action, onAction) {
  const fa = $('#formAlert'); fa.hidden = false;
  fa.innerHTML = `<div class="ds-alert ds-alert--error" role="alert"><span class="ds-alert__icon" aria-hidden="true">!</span><div class="ds-alert__body-wrap"><p class="ds-alert__title">${esc(title)}</p><p class="ds-alert__body">${esc(msg)}</p></div><div class="ds-alert__actions">${action ? `<button type="button" class="ds-alert__action">${esc(action)}</button>` : ''}<button type="button" class="ds-alert__close" aria-label="Cerrar">×</button></div></div>`;
  if (action) fa.querySelector('.ds-alert__action').onclick = onAction;
  fa.querySelector('.ds-alert__close').onclick = () => { fa.hidden = true; };
  fa.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function toast(title, msg) {
  const r = $('#toastRoot');
  r.innerHTML = `<div class="ds-toast-region"><div class="ds-toast ds-toast--success" role="status"><span class="ds-toast__icon"><svg width="24" height="24"><use href="#i-pos"/></svg></span><div class="ds-toast__body-wrap"><p class="ds-toast__title">${esc(title)}</p><p class="ds-toast__body">${esc(msg)}</p></div><button type="button" class="ds-toast__close" aria-label="Cerrar"><svg width="20" height="20"><use href="#i-close"/></svg></button><span class="ds-toast__timer"></span></div></div>`;
  r.querySelector('.ds-toast__close').onclick = () => r.innerHTML = '';
  clearTimeout(toast.t); toast.t = setTimeout(() => r.innerHTML = '', 5000); // se va solo, al terminar la barra de tiempo del DS Toast
}
function modal(html, cls) {
  const r = $('#modalRoot'); r.innerHTML = `<div class="scrim ds-modal-overlay"><div class="ds-modal cn-modal ${cls || ''}" role="dialog" aria-modal="true">${html}</div></div>`;
  $$('[data-close]', r).forEach(b => b.onclick = () => r.innerHTML = '');
  const p = r.querySelector('.ds-btn--primary'); p && p.focus();
}

/* ---------- Guardar ---------- */
function save(e) {
  e && e.preventDefault(); if (S.saving) return;
  if (S.edit) return saveEdit();
  const errs = [];
  reqs().forEach(el => { S.touched.add(el.id); if (paint(el)) errs.push(el); });
  /* 9964739ad: en Empeño el frente y el reverso de la identificación son obligatorios */
  if (S.mode === 'empeno') REQ_DOCS.filter(k => !S.files[k]).forEach(k => { const h = $(`[data-file="${k}"]`); h.dataset.label = DOC_TITLE[k]; errs.push(h); });
  S.touched.add('addr');
  if (!S.address) { errs.push($('#addrSearch')); const ae = $('#addrErr'); ae.hidden = false; ae.innerHTML = '<svg width="16" height="16"><use href="#i-err"/></svg>Agrega la dirección del cliente.'; $('[data-box="addr"]').classList.add('err'); }
  update();
  if (errs.length) {
    const names = errs.map(x => x.dataset.label || 'Dirección domiciliaria');
    const list = names.length > 3 ? names.slice(0, 3).join(', ') + ` y ${names.length - 3} más` : names.join(', ');
    alertNeg(`Revisa ${errs.length} dato${errs.length > 1 ? 's' : ''} antes de guardar`, `Falta${errs.length > 1 ? 'n' : ''} o tiene${errs.length > 1 ? 'n' : ''} error: ${list}.`, 'Ir al primero', () => goto(errs[0]));
    return;
  }
  $('#formAlert').hidden = true;
  S.saving = true; $('#fs').disabled = true;
  // sin latencia simulada: se guarda al momento
  {
    S.saving = false; $('#fs').disabled = false;
    $$('[data-save]').forEach(b => { b.disabled = false; b.textContent = 'Guardar cliente'; });
    $$('[data-cancel]').forEach(b => b.disabled = false);
    if ($('#demoFail').checked) { alertNeg('No pudimos guardar el cliente', 'Hubo un problema de conexión. Tus datos siguen aquí.', 'Reintentar', save); return; }
    if ($('#demoDup').checked) { alertNeg('Este cliente ya está registrado', `Ya existe un cliente con la CURP ${val($('#curp')) || 'capturada'}. Revisa su registro antes de crear uno nuevo; tus datos siguen aquí.`, 'Ver cliente registrado', () => { location.href = './#clientes'; }); goto($('#curp')); return; }
    const name = [val($('#name')), val($('#lastName')), val($('#secondLastName'))].filter(Boolean).join(' ') || 'El cliente';
    modal(`<div class="ds-modal__header"><h3>Cliente creado</h3><button type="button" class="ds-btn ds-btn--tertiary ds-btn--icon-md cn-modal__x" aria-label="Cerrar" data-go><svg width="24" height="24"><use href="#i-close"/></svg></button></div><div class="ds-modal__body"><p><b>${esc(name)}</b> ya aparece en tu Lista de clientes.</p></div><div class="ds-modal__footer"><button type="button" class="ds-btn ds-btn--primary ds-btn--md" data-go>Volver a la lista</button></div>`);
    /* f92a4a5e2: el cliente se guarda en la sesión (createdClients.ts) y la lista lo muestra primero, resaltado y con el aviso "Cliente creado" */
    saveCreatedClient(buildCreatedClient({ name: val($('#name')), lastName: val($('#lastName')), secondLastName: val($('#secondLastName')), email: val($('#email')), phone: val($('#phone')), nat: $('#nat').value }, S.mode));
    $$('[data-go]').forEach(b => b.onclick = () => { location.href = './#clientes'; });
  }
}
function goto(el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(() => (el._trig || el).focus({ preventScroll: true }), 400); }
$('#form').addEventListener('submit', save);
$$('aside [data-save]').forEach(b => b.onclick = save);

/* ---------- Cancelar: modal existente (producción), solo si hay datos ---------- */
$$('[data-cancel]').forEach(b => b.onclick = () => {
  if (!S.dirty) { location.href = './#clientes'; return; }
  modal(`<h3>¿Deseas cancelar la operación?</h3><div class="ds-modal__body"><p>¿Deseas cancelar la creación del cliente?, Se perderán los datos capturados.</p></div><div class="ds-modal__footer"><button type="button" class="ds-btn ds-btn--tertiary ds-btn--md" id="yes">Sí, cancelar</button><button type="button" class="ds-btn ds-btn--primary ds-btn--md" data-close>Continuar editando</button></div>`, 'cancel');
  $('#yes').onclick = () => { location.href = './#clientes'; };
});

/* ---------- Demo ---------- */
/* el canvas no entiende var(): lee el valor del token del DS */
const dsColor = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
/* Archivo de ejemplo (sampleImage de su newClient.mocks.ts): una imagen gris con el nombre del documento, no un archivo real */
function sampleDoc(name, w = 1280, h = 808) {
  return new Promise(res => {
    const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d');
    x.fillStyle = dsColor('--ats-neutral-100'); x.fillRect(0, 0, w, h); x.fillStyle = dsColor('--ats-neutral-600'); x.font = '600 36px Nunito, sans-serif'; x.textAlign = 'center'; x.fillText('Documento de ejemplo', w / 2, h / 2 - 8); x.font = '400 24px Nunito, sans-serif'; x.fillText(name, w / 2, h / 2 + 32);
    c.toBlob(b => res(new File([b], name, { type: 'image/png' })), 'image/png');
  });
}
async function setSampleFile(key, name) { const f = await sampleDoc(name); S.files[key] = { name: f.name, url: URL.createObjectURL(f), type: f.type, size: f.size }; renderFile(key); accTags(); update(); }
/* "Llenar con datos de ejemplo" (SAMPLE_CLIENT de su React): claramente ficticio, con la identificación y sus dos documentos, que ahora son obligatorios */
$('#demoFill').onclick = async () => {
  setMode('empeno');
  const v = { name: 'Cliente', lastName: 'Demo', secondLastName: 'Ejemplo', email: 'cliente.demo@ejemplo.com', phone: '5500000999', civil: 'Soltero(a)', gender: 'Prefiero no decir', nat: 'Mexicana', dob: '01/01/1990', curp: 'XEXX010101HNEXXXA4', rfc: 'XAXX010101000', activity: 'Comercio', idType: 'INE', idNum: 'DEMO-0000000999', idExp: '01/01/2020', idVig: '01/01/2032' };
  Object.entries(v).forEach(([k, x]) => { const el = $('#' + k); el.value = x; el.dispatchEvent(new Event('input')); S.touched.add(k); if (el.dataset.req !== undefined) paint(el); });
  saveAddr({ nombre: 'Casa', calle: 'Calle Ejemplo', ext: '300', int: '', col: 'Roma Norte', mun: 'Cuauhtémoc', edo: 'Ciudad de México', cp: '00000' });
  await setSampleFile('idFront', 'ine-frente.png'); await setSampleFile('idBack', 'ine-reverso.png');
  S.dirty = true; $('#formAlert').hidden = true; update(); toast('Datos de ejemplo cargados', 'Son datos ficticios para revisar el prototipo.');
};


/* ---------- Buscar cliente existente: correo, teléfono o identificación (datos ficticios para simular) ---------- */
/* Clientes existentes (EXISTING_CLIENTS de su newClient.mocks.ts). 9964739ad: datos simulados claramente falsos (teléfonos 55 0000 0xxx,
   CURP y R.F.C genéricos, identificación DEMO-…) y un id opaco: la URL de Cliente nuevo usa ?cargar=<id>, no el correo */
const MK_NOTE = 'Del Marketplace solo vienen sus datos de contacto y su dirección de envío. Completa los datos personales, la identificación y las huellas.';
const RED_NOTE = 'Viene de otra casa de empeño de la Red ataskate con sus datos personales, dirección e identificación. Revisa que estén actualizados y registra sus huellas.';
const LK_DB = [
  { id: 'mk-1', src: 'mk', srcLabel: 'Marketplace', origin: 'Se registró en el Marketplace ataskate el 12/03/2026', email: 'valeria.ortiz@ejemplo.com', phone: '5500000101', idType: '', idNum: '', curp: '',
    data: { name: 'Valeria', lastName: 'Ortiz', secondLastName: 'Campos', email: 'valeria.ortiz@ejemplo.com', phone: '5500000101', nat: 'Mexicana' },
    addr: { nombre: 'Casa', calle: 'Calle Ejemplo', ext: '100', int: '', col: 'Roma Norte', mun: 'Cuauhtémoc', edo: 'Ciudad de México', cp: '00000' }, note: MK_NOTE },
  { id: 'red-1', src: 'red', srcLabel: 'Red ataskate', origin: 'Registrado en Monte Cristo · Red ataskate', email: 'raul.campos@ejemplo.com', phone: '5500000201', idType: 'INE', idNum: 'DEMO-0000000001', curp: 'XEXX010101HNEXXXA4',
    data: { name: 'Raúl', lastName: 'Campos', secondLastName: 'Medina', email: 'raul.campos@ejemplo.com', phone: '5500000201', civil: 'Casado(a)', gender: 'Masculino', nat: 'Mexicana', dob: '01/01/1990', curp: 'XEXX010101HNEXXXA4', rfc: 'XAXX010101000', activity: 'Comercio', idType: 'INE', idNum: 'DEMO-0000000001' },
    addr: { nombre: 'Casa', calle: 'Calle Ejemplo', ext: '100', int: '', col: 'Roma Norte', mun: 'Cuauhtémoc', edo: 'Ciudad de México', cp: '00000' }, note: RED_NOTE },
  { id: 'mk-2', src: 'mk', srcLabel: 'Marketplace', origin: 'Se registró en el Marketplace ataskate el 05/08/2026', email: 'fer.rios@ejemplo.com', phone: '5500000102', idType: '', idNum: '', curp: '',
    data: { name: 'Fernanda', lastName: 'Ríos', secondLastName: 'Luna', email: 'fer.rios@ejemplo.com', phone: '5500000102', nat: 'Mexicana' },
    addr: { nombre: 'Casa', calle: 'Calle Ejemplo', ext: '100', int: 'A', col: 'Roma Norte', mun: 'Cuauhtémoc', edo: 'Ciudad de México', cp: '00000' }, note: MK_NOTE },
  { id: 'red-2', src: 'red', srcLabel: 'Red ataskate', origin: 'Registrado en Prenda Fácil · Red ataskate', email: 'jorge.salinas@ejemplo.com', phone: '5500000202', idType: 'Pasaporte', idNum: 'DEMO-0000000002', curp: 'XEXX010101HNEXXXA4',
    data: { name: 'Jorge', lastName: 'Salinas', secondLastName: 'Paz', email: 'jorge.salinas@ejemplo.com', phone: '5500000202', civil: 'Soltero(a)', gender: 'Masculino', nat: 'Mexicana', dob: '01/01/1990', curp: 'XEXX010101HNEXXXA4', rfc: 'XAXX010101000', activity: 'Servicios profesionales', idType: 'Pasaporte', idNum: 'DEMO-0000000002' },
    addr: { nombre: 'Casa', calle: 'Calle Ejemplo', ext: '100', int: '', col: 'Roma Norte', mun: 'Cuauhtémoc', edo: 'Ciudad de México', cp: '00000' }, note: RED_NOTE },
];
const LK_EX = [
  { k: 'mk', label: 'Cliente del Marketplace', email: 'valeria.ortiz@ejemplo.com', phone: '', idType: 'INE', idNum: '' },
  { k: 'red', label: 'Cliente de otra casa de empeño', email: '', phone: '', idType: 'CURP', idNum: 'CAMR880921HNLMDL09' },
  { k: 'new', label: 'Cliente nuevo', email: 'lucia.herrera@ejemplo.com', phone: '5511223344', idType: 'INE', idNum: '' },
];
const LK = { email: '', phone: '', idType: 'INE', idNum: '' };
const digits = x => String(x || '').replace(/\D/g, '');
function lkFind(q) {
  const e = q.email.trim().toLowerCase(), p = digits(q.phone), n = q.idNum.trim().toUpperCase();
  for (const c of LK_DB) {
    const m = [];
    if (e && c.email === e) m.push('Correo electrónico');
    if (p && c.phone === p) m.push('Teléfono');
    if (n && (c.idNum === n || c.curp === n || (c.data.rfc || '') === n)) m.push(q.idType === 'CURP' ? 'CURP' : q.idType === 'R.F.C' ? 'R.F.C' : 'Identificación');
    if (m.length) return { c, m };
  }
  return null;
}
const lkIco = '<svg width="16" height="16"><use href="#i-err"/></svg>';
const lkPhone = p => { const d = digits(p); return d.length === 10 ? `+52 ${d.slice(0, 2)} ${d.slice(2, 6)} ${d.slice(6)}` : (p || ''); };
function lkForm(er) {
  er = er || {};
  const fe = k => er[k] ? `<span class="lk-err">${lkIco}${esc(er[k])}</span>` : '';
  const ids = ['INE', 'CURP', 'Pasaporte', 'R.F.C', 'Cédula profesional'];
  modal(`<div class="ds-modal__header"><h3>Nuevo cliente</h3><a class="ds-btn ds-btn--tertiary ds-btn--icon-md cn-modal__x" href="./#clientes" aria-label="Cerrar"><svg width="24" height="24"><use href="#i-close"/></svg></a></div>
    <p class="lk-sub">Antes de capturarlo, revisa si el cliente ya existe en tu casa, en otra casa de empeño de la Red ataskate o en el Marketplace. Escribe al menos uno de estos datos.</p>
    <div class="lk-grid">
      <div class="fld"><label class="lbl" for="lkEmail">Correo electrónico</label><input class="in ds-input ds-input--standalone ${er.email || er.any ? 'err' : ''}" id="lkEmail" type="email" placeholder="nombre@correo.com" value="${esc(LK.email)}" aria-invalid="${!!(er.email || er.any)}">${fe('email')}${fe('any')}</div>
      <div class="fld"><label class="lbl dob" for="lkPhone">Teléfono</label><div class="doble ${er.phone || er.any ? 'err' : ''}"><button type="button" class="pre" tabindex="-1" aria-label="Lada +52"><svg class="flag"><use href="#flag-mx"/></svg>+52</button><input id="lkPhone" inputmode="tel" maxlength="12" placeholder="55 0000 0000" value="${esc(LK.phone)}" aria-invalid="${!!(er.phone || er.any)}"></div>${fe('phone')}</div>
      <div class="lk-or s2">o identificación</div>
      <div class="fld"><label class="lbl" for="lkIdType">Tipo de identificación</label><select class="in ds-input ds-input--standalone" id="lkIdType">${ids.map(x => `<option ${x === LK.idType ? 'selected' : ''}>${x}</option>`).join('')}</select></div>
      <div class="fld"><label class="lbl" for="lkIdNum">Número o clave</label><input class="in ds-input ds-input--standalone ${er.idNum || er.any ? 'err' : ''}" id="lkIdNum" placeholder="Escribe el número o la clave" value="${esc(LK.idNum)}" aria-invalid="${!!(er.idNum || er.any)}">${fe('idNum')}</div>
    </div>
    <div class="lk-ex"><p>Ejemplos para simular la búsqueda (datos ficticios):</p><div class="row">${LK_EX.map(x => `<button type="button" class="lk-chip" data-ex="${x.k}"><span class="ds-chip ${SRC_CHIP[x.k] || ''}">${x.k === 'mk' ? 'Marketplace' : x.k === 'red' ? 'Red ataskate' : 'Sin registro'}</span>${x.label}</button>`).join('')}</div></div>
    <div class="ds-modal__footer"><a class="ds-btn ds-btn--tertiary ds-btn--md" href="./#clientes">Cancelar</a><button type="button" class="ds-btn ds-btn--primary ds-btn--md" id="lkGo">Buscar</button></div>`, 'lk');
  const r = $('#modalRoot');
  const sync = () => { LK.email = $('#lkEmail').value; LK.phone = $('#lkPhone').value; LK.idType = $('#lkIdType').value; LK.idNum = $('#lkIdNum').value; };
  enhanceSel($('#lkIdType'));
  $$('input,select', r).forEach(el => { el.addEventListener('input', sync); el.addEventListener('change', sync); });
  $$('[data-ex]', r).forEach(b => b.onclick = () => { const x = LK_EX.find(e => e.k === b.dataset.ex); Object.assign(LK, { email: x.email, phone: x.phone, idType: x.idType, idNum: x.idNum }); lkForm(); });
  r.querySelector('.lk-grid').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); $('#lkGo').click(); } });
  $('#lkGo').onclick = () => {
    sync();
    if (!LK.email.trim() && !digits(LK.phone) && !LK.idNum.trim()) { lkForm({ any: 'Escribe un correo, un teléfono o una identificación para buscar' }); return; }
    const er = {};
    if (LK.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(LK.email.trim())) er.email = 'El correo no es válido';
    if (digits(LK.phone) && digits(LK.phone).length !== 10) er.phone = 'El número ingresado no es válido';
    if (LK.idType === 'CURP' && LK.idNum.trim() && LK.idNum.trim().length !== 18) er.idNum = 'La CURP debe tener 18 caracteres';
    if (Object.keys(er).length) { lkForm(er); return; }
    lkResult(lkFind(LK)); // sin latencia simulada
  };
  setTimeout(() => ($('#lkEmail') || {}).focus && $('#lkEmail').focus(), 30);
}
function lkResult(res) {
  if (!res) {
    modal(`<div class="ds-modal__header"><h3>Nuevo cliente</h3><a class="ds-btn ds-btn--tertiary ds-btn--icon-md cn-modal__x" href="./#clientes" aria-label="Cerrar"><svg width="24" height="24"><use href="#i-close"/></svg></a></div>
      <div class="lk-empty"><span class="ds-chip">Sin registro</span><p class="t">No encontramos a este cliente</p><p class="c">No existe en tu casa, en la Red ataskate ni en el Marketplace. Crea un cliente nuevo; usaremos los datos que escribiste.</p></div>
      <div class="ds-modal__footer"><button type="button" class="ds-btn ds-btn--tertiary ds-btn--md" id="lkBack">Buscar otro</button><button type="button" class="ds-btn ds-btn--primary ds-btn--md" id="lkNew">Crear cliente nuevo</button></div>`, 'lk');
    $('#lkBack').onclick = () => lkForm();
    $('#lkNew').onclick = () => { $('#modalRoot').innerHTML = ''; lkApply(null); };
    return;
  }
  const { c, m } = res; const d = c.data;
  const kv = [['Correo electrónico', d.email], ['Teléfono', lkPhone(d.phone)], ['Fecha de nacimiento', d.dob], ['CURP', d.curp], ['Identificación', d.idType ? `${d.idType} ${d.idNum}` : ''], ['Dirección', `${c.addr.calle} ${c.addr.ext}, ${c.addr.col}, ${c.addr.mun}`]];
  modal(`<div class="ds-modal__header"><h3>Encontramos a este cliente</h3><a class="ds-btn ds-btn--tertiary ds-btn--icon-md cn-modal__x" href="./#clientes" aria-label="Cerrar"><svg width="24" height="24"><use href="#i-close"/></svg></a></div>
    <div class="lk-card">
      <div class="lk-who"><span class="ds-avatar ds-avatar--md cn-av">${esc((d.name[0] + d.lastName[0]).toUpperCase())}</span><div style="min-width:0"><b>${esc(`${d.name} ${d.lastName} ${d.secondLastName || ''}`.trim())}</b><small>${esc(c.origin)}</small></div></div>
      <div class="lk-match"><span class="ds-chip ${SRC_CHIP[c.src] || ''}">${c.srcLabel}</span>Coincide por: ${m.join(', ')}</div>
      <dl class="lk-kv">${kv.map(([k, v]) => `<div><dt>${k}</dt><dd class="${v ? '' : 'na'}">${v ? esc(v) : 'Sin registrar'}</dd></div>`).join('')}</dl>
    </div>
    <p class="lk-sub">${esc(c.note)}</p>
    <div class="ds-modal__footer"><button type="button" class="ds-btn ds-btn--tertiary ds-btn--md" id="lkBack">Buscar otro</button><button type="button" class="ds-btn ds-btn--primary ds-btn--md" id="lkLoad">Cargar datos</button></div>`, 'lk');
  $('#lkBack').onclick = () => lkForm();
  $('#lkLoad').onclick = () => { $('#modalRoot').innerHTML = ''; lkApply(c); };
}
function lkSet(id, x) {
  const el = $('#' + id); if (!el || x == null || x === '') return;
  el.value = x; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true }));
  S.touched.add(id); if (el.dataset.req !== undefined) paint(el);
}
function lkApply(c) {
  let v, title, msg, cls;
  /* Si ya se había precargado otro cliente, se limpia antes de cargar el nuevo resultado */
  (S.lkKeys || []).forEach(k => { const el = $('#' + k); if (!el) return; S.touched.delete(k); el.value = ''; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); const f = el.closest('.fld'); if (f) showErr(f, '', boxOf(el)); el.setAttribute('aria-invalid', 'false'); });
  if (S.lkAddr && S.address) { const del = $('#addrItem .del'); if (del) del.click(); }
  S.lkAddr = !!c;
  S.origin = c ? { k: c.src, label: c.src === 'mk' ? 'Marketplace' : 'Red ataskate · Monte Cristo' } : { k: 'new', label: 'Sin registro previo' };
  if (c) {
    v = { ...c.data }; saveAddr(c.addr);
    title = 'Datos precargados de'; msg = `${c.origin}. ${c.note}`; cls = 'info';
  } else {
    v = { email: LK.email.trim(), phone: digits(LK.phone) };
    if (LK.idType === 'CURP') v.curp = LK.idNum.trim().toUpperCase(); else if (LK.idType === 'R.F.C') v.rfc = LK.idNum.trim().toUpperCase();
    else if (LK.idNum.trim()) { v.idType = LK.idType; v.idNum = LK.idNum.trim(); }
    title = 'Cliente nuevo'; msg = 'No existe en ningún registro. Usamos los datos de la búsqueda; captura el resto.'; cls = 'pos';
  }
  Object.entries(v).forEach(([k, x]) => lkSet(k, x));
  S.lkKeys = Object.keys(v);
  /* 0859357ca · Cliente de otra casa de empeño (Red ataskate): ya es cliente de empeño → registro completo, sin selector Venta / Empeño */
  { const red = !!(c && c.src === 'red'), ms = $('.mode-sec'); if (ms) ms.hidden = red; if (red) setMode('empeno'); }
  let a = $('#srcAlert'); if (!a) { a = document.createElement('div'); a.id = 'srcAlert'; $('#form').prepend(a); }
  const src = c ? `<span class="ds-chip ${SRC_CHIP[c.src] || ''}">${c.srcLabel}</span>` : '<span class="ds-chip">Sin registro</span>';
  a.innerHTML = `<div class="ds-alert ds-alert--${cls === 'pos' ? 'success' : 'info'}" role="status"><span class="ds-alert__icon" aria-hidden="true">${cls === 'pos' ? '✓' : 'i'}</span><div class="ds-alert__body-wrap"><p class="ds-alert__title">${esc(title)} ${src}</p><p class="ds-alert__body">${esc(msg)}</p></div></div>`;
  update(); window.scrollTo({ top: 0, behavior: 'smooth' });
  toast(c ? 'Datos cargados' : 'Cliente nuevo', c ? `${v.name} ${v.lastName} · ${c.srcLabel}` : 'Captura sus datos para registrarlo.');
}



/* ---------- Detección de cliente existente mientras se captura (sin modal previo) ----------
   Su React (findExistingClient / verifyExisting, 9964739ad): solo coincide por correo o por teléfono (10 dígitos); la verificación
   pide el otro dato y, si coincide, carga directo (ya no hay vista previa "Datos del cliente"); el modal no muestra el nombre del
   cliente antes de verificar */
function dupFind() {
  const e = val($('#email')).toLowerCase(), p = digits(val($('#phone')));
  for (const c of LK_DB) {
    if (e && c.email === e) return { c, by: 'email' };
    if (p.length === 10 && c.phone === p) return { c, by: 'phone' };
  }
  return null;
}
/* Verificación (DS Modal + TextInput): se pide un dato distinto al que coincidió antes de cargar los datos */
function dupVerify(c, where, by) {
  const ask = by === 'email' ? 'phone' : 'email';
  const lbl = ask === 'phone' ? 'Teléfono' : 'Correo electrónico';
  const what = ask === 'phone' ? 'su número de teléfono' : 'su correo electrónico';
  const draw = (val, err) => {
    modal(`<div class="ds-modal__header"><h3>Verifica al cliente</h3><button type="button" class="ds-btn ds-btn--tertiary ds-btn--icon-md cn-modal__x" aria-label="Cerrar" data-close><svg width="24" height="24"><use href="#i-close"/></svg></button></div>
      <div class="ds-modal__body"><p class="dp-sub">${esc(where)}. Para ver y cargar sus datos, pide al cliente ${what}.</p>
        <div class="fld"><label class="lbl" for="vfyIn">${lbl}</label><input class="in ds-input ds-input--standalone ${err ? 'err' : ''}" id="vfyIn" ${ask === 'phone' ? 'inputmode="tel"' : ''} value="${esc(val)}" autocomplete="off" aria-invalid="${!!err}">${err ? `<span class="lk-err">${lkIco}${esc(err)}</span>` : ''}</div></div>
      <div class="ds-modal__footer"><button type="button" class="ds-btn ds-btn--tertiary ds-btn--md" data-close>Cancelar</button><button type="button" class="ds-btn ds-btn--primary ds-btn--md" id="vfyGo" ${val.trim() ? '' : 'disabled'}>Verificar y cargar</button></div>`, 'dp-modal');
    const i = $('#vfyIn'), go = $('#vfyGo'); i.focus(); i.setSelectionRange(i.value.length, i.value.length);
    i.addEventListener('input', () => { go.disabled = !i.value.trim(); if (err) { err = ''; i.classList.remove('err'); const e = i.parentElement.querySelector('.lk-err'); if (e) e.remove(); } });
    /* Corrección al portarlo: sin preventDefault el Enter llegaba al botón primario que el modal enfoca al abrir */
    i.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); if (!go.disabled) go.click(); } });
    go.onclick = () => {
      const v = i.value.trim();
      const ok = by === 'email' ? digits(v).slice(-10) === c.phone : v.toLowerCase() === c.email;
      if (!ok) return draw(v, 'El dato no coincide con el registro. Confírmalo con el cliente e intenta de nuevo.');
      $('#modalRoot').innerHTML = ''; S.dupLoaded = c.email; $('#dupNote').hidden = true; lkApply(c);
    };
  };
  draw('', '');
}
function dupCheck() {
  const box = $('#dupNote'); if (!box || S.edit) return;
  const r = dupFind();
  if (!r || S.dupLoaded === r.c.email || S.dupClosed === r.c.email) { box.hidden = true; box.innerHTML = ''; box.dataset.k = ''; return; }
  const where = r.c.src === 'mk' ? 'Marketplace' : 'Red ataskate';
  const list = r.by === 'email' ? 'correo electrónico' : 'teléfono';
  /* Corrección al portarlo: si ya se ve el mismo aviso no se vuelve a pintar. El "change" que sale al dejar el campo lo re-pintaba
     entre el mousedown y el click, y el primer clic en "Ver datos" o en la X se perdía (pasa igual en su archivo). */
  const key = r.c.email + '|' + list;
  if (!box.hidden && box.dataset.k === key) return;
  box.dataset.k = key;
  box.hidden = false;
  box.innerHTML = `<div class="ds-alert ds-alert--info" role="status"><span class="ds-alert__icon" aria-hidden="true">i</span><div class="ds-alert__body-wrap"><p class="ds-alert__title">Este cliente ya está registrado en ${where}</p><p class="ds-alert__body">Coincide por ${list}.</p></div><div class="ds-alert__actions"><button type="button" class="ds-alert__action" id="dupLoad">Ver datos</button><button type="button" class="ds-alert__close" id="dupX" aria-label="Cerrar">×</button></div></div>`;
  $('#dupLoad').onclick = () => dupVerify(r.c, where, r.by);
  $('#dupX').onclick = () => { S.dupClosed = r.c.email; box.hidden = true; };
}
['email', 'phone'].forEach(id => { const el = $('#' + id); if (el) { el.addEventListener('input', dupCheck); el.addEventListener('change', dupCheck); } });
/* Simulaciones del prototipo: se escribe un dato que coincide, como lo haría el valuador */
const simType = (id, v) => { const el = $('#' + id); el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); };
$('#demoMk').onclick = () => { S.dupClosed = S.dupLoaded = null; simType('email', 'valeria.ortiz@ejemplo.com'); $('#email').scrollIntoView({ block: 'center', behavior: 'smooth' }); };
$('#demoRed').onclick = () => { S.dupClosed = S.dupLoaded = null; simType('email', 'raul.campos@ejemplo.com'); $('#email').scrollIntoView({ block: 'center', behavior: 'smooth' }); };

/* ---------- 2d1b103b4 · Tipo de registro: Venta / Empeño ----------
   Mismo formulario: con Venta solo se ven Contacto y Dirección (en el formulario y en la lista de la card del cliente, renumerada),
   y el avance, "Datos completados" y "Faltan N datos" cuentan solo esos obligatorios */
const MODE_HELP = { venta: 'Para una venta solo se necesitan la información de contacto y la dirección domiciliaria.', empeno: 'Registro completo: datos personales, dirección, identificación, cotitular y huellas.' };
/* 9964739ad · al cambiar a Venta se limpian los datos que solo existen en Empeño (HIDDEN_IN_SALE), la foto, los documentos, los cotitulares y las huellas */
const HIDDEN_IN_SALE = ['civil', 'gender', 'nat', 'dob', 'curp', 'rfc', 'activity', 'idType', 'idNum', 'idExp', 'idVig', 'domType', 'domVig'];
function clearPawnData() {
  HIDDEN_IN_SALE.forEach(id => { const el = $('#' + id); if (!el || !el.value) return; S.touched.delete(id); el.value = ''; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); const f = el.closest('.fld'); if (f) showErr(f, '', boxOf(el)); el.setAttribute('aria-invalid', 'false'); });
  S.photo = null; renderPhoto();
  S.files = {}; ['idFront', 'idBack', 'domFile', 'ingFile'].forEach(renderFile); accTags();
  S.co = []; renderCo();
  S.prints.izq.clear(); S.prints.der.clear(); S.printImg = {}; S.fpState = 'idle'; renderFp();
}
function setMode(m) {
  if (m === 'venta' && S.mode !== 'venta') clearPawnData();
  S.mode = m;
  $$('.mode-chip').forEach(b => { const on = b.dataset.mode === m; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
  const mh = $('#modeHelp'); if (mh) mh.textContent = MODE_HELP[m];
  $$('#fs section.sec').forEach(sec => { const k = sec.dataset.sec; sec.hidden = m === 'venta' && !VENTA_SECS.includes(k); });
  $$('#sSecs [data-cpi]').forEach(a => { a.closest('li').hidden = m === 'venta' && !VENTA_SECS.includes(a.dataset.cpi); });
  { let n = 0; $$('#sSecs li').forEach(li => { if (li.hidden) return; n++; const d = li.querySelector('.dot'); d.dataset.n = n; if (!li.querySelector('a').classList.contains('is-done')) d.textContent = n; }); }
  update();
}
$$('.mode-chip').forEach(b => { b.onclick = () => setMode(b.dataset.mode); });
{ const md = new URLSearchParams(location.search).get('modo'); if (md === 'venta' || md === 'empeno') setMode(md); }

/* ---------- 2d1b103b4 · Llegada desde el buscador de Clientes ----------
   ?cargar=<id> → ya se verificó en Clientes ("Verificar y cargar"): se cargan sus datos directo.
   ?buscar=correo → cliente encontrado en otra fuente: se escribe el correo y aparece el aviso "Ver datos".
   ?nuevo=texto  → no se encontró: se precarga lo que se buscó (correo, teléfono o nombre). */
{ const qp = new URLSearchParams(location.search), b = qp.get('buscar'), n = (qp.get('nuevo') || '').trim();
  const cg = qp.get('cargar'), cc = cg && LK_DB.find(x => x.id === cg); // id opaco (mk-1, red-1…): la URL ya no lleva el correo
  if (cc) { S.dupLoaded = cc.email; lkApply(cc); }
  else if (b) simType('email', b);
  else if (n) {
    if (n.includes('@')) simType('email', n);
    else if (/^[\d\s+-]{7,}$/.test(n)) simType('phone', n.replace(/\D/g, '').slice(-10));
    else { const w = n.split(/\s+/); simType('name', w[0]); if (w[1]) simType('lastName', w[1]); if (w[2]) simType('secondLastName', w.slice(2).join(' ')); }
  } }

/* Controles del prototipo (pestaña "Prototipo" del riel, ../demo.js): las acciones cierran el panel para que se vea su efecto
   (sin mover el foco); las casillas lo dejan abierto */
$$('[data-proto-panel] button').forEach(b => b.addEventListener('click', () => {
  const pn = b.closest('[data-proto-panel]'), tb = $('#demoProtoTab');
  if (pn && !pn.hidden) { pn.hidden = true; if (tb) tb.setAttribute('aria-expanded', 'false'); }
}));


/* ---------- Editar cliente (EditClientRedesign / useEditClient, 20f588788) ----------
   cliente-nuevo.html?editar=<id>[&seccion=<sección>]: su /Directory/<id>/editar reutiliza Cliente nuevo con los datos del perfil.
   Solo lo que aplica al tipo de cliente (empeño: todo; venta: contacto y dirección; marketplace no se edita). Se valida con las mismas
   reglas del alta; al guardar (1.2 s simulados) se guarda el perfil completo en sessionStorage, avisa "Cambios guardados" y regresa al perfil */
const ED = {
  PAGE_TITLE: 'Editar cliente', SUBTITLE: 'Revisa y actualiza los datos del cliente. Los cambios se guardan al final.', SAVE: 'Guardar cambios', SAVED: 'Cambios guardados',
  REVIEW_TITLE: 'Revisa los datos antes de guardar', REVIEW_TEXT: items => `Falta o no es válido: ${items.join(', ')}.`,
  EXIT_TITLE: '¿Salir sin guardar?', EXIT_TEXT: 'Si hiciste cambios y no los guardaste, se pierden.', EXIT_STAY: 'Seguir editando', EXIT_LEAVE: 'Salir sin guardar',
  NOT_FOUND_TITLE: 'No se puede editar este cliente', NOT_FOUND_TEXT: 'El cliente no existe o es del Marketplace, que no se edita desde aquí.', BACK_TO_LIST: 'Ir a Clientes',
};
const ED_SECTIONS = { empeno: ['contacto', 'personal', 'direccion', 'ident', 'cotitular', 'bio'], venta: ['contacto', 'direccion'] };
const ED_FORM_SECTION = { personal: 'personal', direccion: 'direccion', ident: 'ident', cotitulares: 'cotitular', cotitular: 'cotitular', huellas: 'bio', bio: 'bio', contacto: 'contacto' };
const joinWords = (...p) => p.map(x => (x || '').trim()).filter(Boolean).join(' ');
const orUndef = v => (v || '').trim() || undefined;
const splitLast = l => { const [a = '', ...r] = (l || '').trim().split(/\s+/); return [a, r.join(' ')]; };
function setQuiet(id, v) {
  const el = $('#' + id); if (!el || v == null || v === '') return;
  if (el.tagName === 'SELECT' && ![...el.options].some(o => o.value === v || o.textContent === v)) el.add(new Option(v, v));
  el.value = v;
  if (el.type === 'text' && el.dataset.date !== undefined) el.classList.toggle('empty', !el.value);
  const cnt = $(`[data-count="${id}"]`); if (cnt) cnt.textContent = `${el.value.length} de ${id === 'curp' ? 18 : 13} caracteres`;
  if (el.tagName === 'SELECT') syncSel(el);
}
const isPast = v => { const d = parseDMY(v); if (!d) return false; const t = new Date(); t.setHours(0, 0, 0, 0); return d < t; };
function printImg(label) {
  const c = document.createElement('canvas'); c.width = 160; c.height = 200; const x = c.getContext('2d');
  x.fillStyle = dsColor('--ats-neutral-100'); x.fillRect(0, 0, 160, 200); x.strokeStyle = dsColor('--ats-neutral-400'); x.lineWidth = 3;
  for (let r = 10; r < 70; r += 8) { x.beginPath(); x.ellipse(80, 110, r, r * 1.35, 0, 0, Math.PI * 2); x.stroke(); }
  return c.toDataURL('image/png');
}
function initEdit(id, section) {
  const client = getClientProfile(id), editable = client && client.type !== 'marketplace' ? client : null;
  document.title = 'Ataskate POS — Editar cliente';
  if (!editable) {
    $('#cnMain').innerHTML = `<div class="nf" role="status"><img src="assets/ilust-01-empty.svg" alt="" width="150" height="150"><h2>${ED.NOT_FOUND_TITLE}</h2><p>${ED.NOT_FOUND_TEXT}</p><a class="ds-btn ds-btn--primary ds-btn--md" href="./">${ED.BACK_TO_LIST}</a></div>`;
    return;
  }
  S.edit = { id, client: editable, type: editable.type };
  const name = fullName(editable);
  /* encabezado: Inicio > Clientes > <nombre> > Editar cliente, título y subtítulo */
  const sep = '<span class="ds-breadcrumb__sep" aria-hidden="true"><img class="pos-crumb-sep" src="../assets/ds/ArrowForwardIos-D4D6D8.svg" alt="" /></span>';
  $('.pos-crumbs').innerHTML = `<li><a href="../home/" class="ds-breadcrumb__link">Inicio</a>${sep}</li><li><a href="./" class="ds-breadcrumb__link">Clientes</a>${sep}</li><li><a href="./#perfil/${encodeURIComponent(id)}" class="ds-breadcrumb__link">${esc(name)}</a>${sep}</li><li><span class="ds-breadcrumb__current" aria-current="page">${ED.PAGE_TITLE}</span></li>`;
  $('.cn-title').textContent = ED.PAGE_TITLE;
  $('.headrow').insertAdjacentHTML('beforeend', `<p class="cn-sub">${ED.SUBTITLE}</p>`);
  { const ms = $('.mode-sec'); if (ms) ms.hidden = true; const dn = $('#dupNote'); if (dn) dn.hidden = true; }
  const saveBtn = $('[data-save]'); if (saveBtn) saveBtn.textContent = ED.SAVE;
  if (editable.type === 'venta') setMode('venta');
  /* carga del perfil en el formulario (profileForm.ts → loadProfileIntoForm): solo los campos con dato, para no marcar error en los que el cliente no tiene */
  const [ln, ln2] = splitLast(editable.lastName), P = editable.personal || {}, L = editable.labor || {}, I = editable.identification, AP = editable.addressProof;
  const vals = { name: editable.name, lastName: ln, secondLastName: ln2, email: editable.email, phone: onlyDigits(editable.phone), civil: P.civil, gender: P.gender, nat: P.nationality, dob: P.birthDate, curp: P.curp, rfc: P.rfc, activity: P.activity,
    idType: I && I.type, idNum: I && I.number, idExp: I && I.issuedAt, idVig: I && I.validUntil, domType: AP && AP.type, domVig: AP && AP.validUntil,
    'l-sit': L.status, 'l-ant': L.seniority, 'l-ing': L.monthlyIncome ? String(L.monthlyIncome) : '', 'l-emp': L.company, 'l-tel': L.companyPhone ? onlyDigits(L.companyPhone) : '', 'l-puesto': L.position };
  Object.entries(vals).forEach(([k, v]) => setQuiet(k, v));
  if (editable.address) { const a = editable.address; saveAddr({ nombre: a.name || 'Casa', calle: a.street, ext: a.exterior, int: a.interior || '', col: a.colony, mun: a.municipality, edo: a.state, cp: a.postalCode }); }
  S.co = (editable.cotitulares || []).map(c => { const [a, b] = splitLast(c.lastName); return { id: c.id, _role: c.role, 'c-name': c.name, 'c-ln': a, 'c-ln2': b, 'c-email': c.email || '', 'c-phone': c.phone || '', 'c-idtype': c.idType || '', 'c-idnum': c.idNum || '', 'c-rel': c.relationship }; });
  renderCo();
  (editable.fingerprints || []).forEach(fp => { const hand = fp.endsWith(' derecho') ? 'der' : 'izq', finger = fp.replace(/ (derecho|izquierdo)$/, ''); S.prints[hand].add(finger); S.printImg[hand + ':' + finger] = printImg(); });
  S.fpState = 'idle'; renderFp();
  if (editable.photo) { S.photo = { name: 'foto-cliente', url: editable.photo }; renderPhoto(); }
  const docs = [['idFront', I && I.hasFront, 'identificacion-frente.png'], ['idBack', I && I.hasBack, 'identificacion-reverso.png'], ['ingFile', !!editable.incomeProof, 'comprobante-ingresos.png']];
  Promise.all(docs.filter(d => d[1]).map(d => setSampleFile(d[0], d[2]))).then(() => { S.dirty = false; update(); });
  if (AP && (AP.type || AP.validUntil)) { const acc = $('#domType').closest('[data-acc]'); if (acc && !acc.classList.contains('open')) acc.querySelector(':scope > button').click(); }
  if (L.status || L.company || L.position) { const mt = $('#moreToggle'); if (mt && $('#more').hidden) mt.click(); }
  S.dirty = false; update();
  /* Cancelar siempre pregunta (EditClientExitModal) */
  $$('[data-cancel]').forEach(b => b.onclick = () => {
    modal(`<h3>${ED.EXIT_TITLE}</h3><div class="ds-modal__body"><p>${ED.EXIT_TEXT}</p></div><div class="ds-modal__footer"><button type="button" class="ds-btn ds-btn--tertiary ds-btn--md" data-close>${ED.EXIT_STAY}</button><button type="button" class="ds-btn ds-btn--destructive ds-btn--md" id="edLeave">${ED.EXIT_LEAVE}</button></div>`, 'cancel');
    $('#edLeave').onclick = () => { location.href = `./#perfil/${encodeURIComponent(id)}`; };
  });
  if (section && ED_FORM_SECTION[section]) setTimeout(() => { const t = $('#s-' + ED_FORM_SECTION[section]); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 300);
}
/* Guardar cambios (useEditClient.save): valida solo las secciones que aplican al tipo y, si todo está bien, aplica cada sección al perfil */
function saveEdit() {
  if (S.saving || !S.edit) return;
  const { client, type } = S.edit, secs = ED_SECTIONS[type === 'venta' ? 'venta' : 'empeno'];
  const labels = [];
  reqs().forEach(el => { S.touched.add(el.id); if (paint(el)) labels.push(el.dataset.label); });
  S.touched.add('addr');
  if (secs.includes('direccion') && !S.address) { labels.push('Dirección'); const ae = $('#addrErr'); ae.hidden = false; ae.innerHTML = '<svg width="16" height="16"><use href="#i-err"/></svg>Agrega la dirección del cliente.'; $('[data-box="addr"]').classList.add('err'); }
  if (secs.includes('ident')) REQ_DOCS.filter(k => !S.files[k]).forEach(k => labels.push(DOC_TITLE[k]));
  update();
  const fa = $('#formAlert');
  if (labels.length) {
    fa.hidden = false;
    fa.innerHTML = `<div class="ds-alert ds-alert--error" role="alert"><span class="ds-alert__icon" aria-hidden="true">!</span><div class="ds-alert__body-wrap"><p class="ds-alert__title">${ED.REVIEW_TITLE}</p><p class="ds-alert__body">${esc(ED.REVIEW_TEXT(labels))}</p></div><div class="ds-alert__actions"><button type="button" class="ds-alert__close" aria-label="Cerrar">×</button></div></div>`;
    fa.querySelector('.ds-alert__close').onclick = () => { fa.hidden = true; };
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  fa.hidden = true;
  S.saving = true; $('#fs').disabled = true;
  const photoP = secs.includes('personal') && S.photo ? (S.photo.url === client.photo ? Promise.resolve(client.photo) : fetch(S.photo.url).then(r => r.blob()).then(b => new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = rej; fr.readAsDataURL(b); })).catch(() => client.photo)) : Promise.resolve(undefined);
  photoP.then(photo => {
    const v = id => val($('#' + id));
    let next = { ...client };
    next = { ...next, name: v('name'), lastName: joinWords(v('lastName'), v('secondLastName')), email: v('email').toLowerCase(), phone: v('phone') };
    if (secs.includes('personal')) {
      const income = Number(v('l-ing').replace(/[^\d.]/g, '')), labor = { status: orUndef(v('l-sit')), company: orUndef(v('l-emp')), position: orUndef(v('l-puesto')), seniority: orUndef(v('l-ant')), monthlyIncome: income || undefined, companyPhone: orUndef(onlyDigits(v('l-tel'))) };
      next = { ...next, personal: { civil: orUndef(v('civil')), gender: orUndef($('#gender').value), nationality: orUndef($('#nat').value), birthDate: orUndef(v('dob')), curp: orUndef(v('curp')), rfc: orUndef(v('rfc')), activity: orUndef($('#activity').value) }, labor: Object.values(labor).some(Boolean) ? labor : undefined, photo };
    }
    if (secs.includes('direccion')) { const a = S.address; next = { ...next, address: a ? { name: a.nombre, street: a.calle.trim(), exterior: a.ext.trim(), interior: orUndef(a.int), colony: a.col, municipality: a.mun, state: a.edo, postalCode: a.cp } : undefined }; }
    if (secs.includes('ident')) {
      next = { ...next, identification: { type: $('#idType').value, number: v('idNum'), issuedAt: orUndef(v('idExp')), validUntil: orUndef(v('idVig')), expired: isPast(v('idVig')), hasFront: !!S.files.idFront, hasBack: !!S.files.idBack },
        addressProof: $('#domType').value || v('domVig') ? { type: orUndef($('#domType').value), validUntil: orUndef(v('domVig')) } : undefined,
        incomeProof: S.files.ingFile ? { type: (client.incomeProof && client.incomeProof.type) || 'Con archivo' } : undefined };
    }
    if (secs.includes('cotitular')) next = { ...next, cotitulares: S.co.map(c => ({ id: c.id, name: c['c-name'].trim(), lastName: joinWords(c['c-ln'], c['c-ln2']), relationship: c['c-rel'], phone: orUndef(onlyDigits(c['c-phone'])), email: orUndef(c['c-email']), idType: orUndef(c['c-idtype']), idNum: orUndef(c['c-idnum']), role: ((client.cotitulares || []).find(p => p.id === c.id) || {}).role || 'Cotitular' })) };
    if (secs.includes('bio')) next = { ...next, fingerprints: ['der', 'izq'].flatMap(h => FINGERS.filter(f => S.prints[h].has(f)).map(f => `${f} ${HN[h]}`)) };
    saveEditedProfile(JSON.parse(JSON.stringify(next)));
    setPendingToast(ED.SAVED, fullName(next));
    location.href = `./#perfil/${encodeURIComponent(S.edit.id)}`;
  });
}
{ const qp = new URLSearchParams(location.search), eid = qp.get('editar'); if (eid) initEdit(eid, qp.get('seccion')); }

update();
})();

/* Rejillas de campos: cada columna mide al menos lo que su etiqueta más larga; si no cabe, el campo baja a la siguiente fila */
(function () {
  function fit(g) {
    let w = 0;
    g.querySelectorAll(':scope > .fld > .lbl').forEach(l => { w = Math.max(w, l.offsetWidth); });
    if (w) g.style.setProperty('--colmin', Math.max(160, Math.ceil(w) + 2) + 'px');
  }
  const ro = new ResizeObserver(es => es.forEach(e => fit(e.target)));
  const watch = () => document.querySelectorAll('.g').forEach(g => { if (!g._fit) { g._fit = 1; ro.observe(g); } fit(g); });
  watch();
  new MutationObserver(watch).observe(document.body, { childList: true, subtree: true });
})();
