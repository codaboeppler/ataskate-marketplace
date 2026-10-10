/* Ataskate POS (Operativo) · Cliente nuevo — propuesta v3 de Product Design (rama del equipo del repo del equipo, commit 8f7723ad6).
   Búsqueda previa (Marketplace / Red ataskate / nuevo), layout tipo Cotizador de empeño, cámara para foto e INE/comprobantes,
   visor de documentos, registro de huellas y FixedActionFooter. Su JS va completo; el header y el menú son los compartidos del POS. */
(() => {
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const S = { address: null, files: {}, photo: null, co: [], prints: { izq: new Set(), der: new Set() }, hand: null, finger: null, touched: new Set(), dirty: false, saving: false };
const FINGERS = ['Pulgar', 'Índice', 'Medio', 'Anular', 'Meñique'];
const HN = { izq: 'izquierdo', der: 'derecho' };

/* ---------- DS CircularProgressIndicator (20px small) ---------- */
function cpi(v) { const r = 8.5, c = 2 * Math.PI * r; return `<svg width="20" height="20" viewBox="0 0 20 20" role="progressbar" aria-valuenow="${v}" aria-valuemin="0" aria-valuemax="100"><circle cx="10" cy="10" r="${r}" fill="none" stroke="#D4D6D8" stroke-width="3"/><circle cx="10" cy="10" r="${r}" fill="none" stroke="#0D166B" stroke-width="3" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - v / 100)}" transform="rotate(-90 10 10)"/></svg>`; }
const tag = (el, color, txt) => { if (el) { el.className = 'tag ' + color; el.textContent = txt; } };

/* ---------- Validación con el patrón de error de producción ---------- */
const val = el => (el.value || '').trim();
function problem(el) {
  const v = val(el), k = el.dataset.kind;
  if (!v) return el.tagName === 'SELECT' ? 'Debes seleccionar una opción' : 'Campo obligatorio';
  if (k === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Formato de correo inválido.';
  if (k === 'phone' && v.replace(/\D/g, '').length < 10) return 'El número telefónico es demasiado corto.';
  if (k === 'date') { const d = parseDMY(v); if (!d) return 'Escribe la fecha como DD/MM/AAAA.'; if (d > new Date()) return 'La fecha no puede ser futura.'; }
  if (k === 'curp' && v.length !== 18) return 'La CURP debe tener 18 caracteres.';
  if (k === 'rfc' && (v.length < 12 || v.length > 13)) return 'El R.F.C debe tener 13 caracteres.';
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
const reqs = () => $$('[data-req]');

$$('#fs input, #fs select').forEach(el => {
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
$('#idVig').addEventListener('change', e => {
  const dv = parseDMY(e.target.value); const past = dv && dv < new Date();
  const er = $('#idVigErr'); er.hidden = !past; er.innerHTML = past ? '<svg width="16" height="16"><use href="#i-err"/></svg>La identificación está vencida.' : '';
  $('[data-box="idVig"]').classList.toggle('err', !!past);
});


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
    <div class="foot"><button type="button" class="lnk" data-act="cancel">Cancelar</button><button type="button" class="btn pri sm" data-act="apply"${sel ? '' : ' disabled style="opacity:.5"'}>Aplicar</button></div>`;
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
function choose(v) { const { sel, trig } = openSel; sel.value = v; closeSel(); syncSel(sel); if (!sel.closest('.modal')) S.dirty = true; sel.dispatchEvent(new Event('change')); trig.focus(); }
function enhanceSel(sel) {
  if (sel._trig) return;
  sel.classList.add('sel-native'); sel.tabIndex = -1;
  const t = document.createElement('button'); t.type = 'button'; t.className = 'in sel-trig'; t.setAttribute('aria-haspopup', 'listbox'); t.setAttribute('aria-expanded', 'false');
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
const fcount = keys => keys.filter(k => S.files[k]).length;
const pcount = h => h ? S.prints[h].size : S.prints.izq.size + S.prints.der.size;
function secState(sec) {
  if (sec === 'direccion') { const d = S.address ? 1 : 0; return { done: d, total: 1, err: S.touched.has('addr') && !d }; }
  const f = reqs().filter(e => e.dataset.sec === sec);
  return { done: f.filter(e => !problem(e)).length, total: f.length, err: f.some(e => S.touched.has(e.id) && problem(e)) };
}
function update() {
  let done = 0, total = 0;
  SECS.forEach(sec => {
    let pct = 0, color = 'gray', txt = 'Pendiente', sum = '';
    if (['contacto', 'personal', 'direccion'].includes(sec)) {
      const r = secState(sec); done += r.done; total += r.total; pct = Math.round(r.done / r.total * 100);
      if (r.done === r.total) { color = 'green'; txt = 'Completo'; }
      else if (r.err) { color = 'red'; txt = 'Revisar'; }
      else if (r.done) { color = 'purple'; txt = `${r.done} de ${r.total}`; }
      sum = sec === 'direccion' ? txt : (r.done === r.total ? 'Completo' : r.err ? 'Revisar' : `${r.done} de ${r.total}`);
    } else if (sec === 'ident') {
      const n = fcount(['idFront', 'idBack', 'domFile', 'ingFile']); pct = n * 25;
      color = n === 4 ? 'green' : n ? 'purple' : 'gray'; txt = n === 4 ? 'Completo' : n ? `${n} de 4 archivos` : 'Pendiente'; sum = `${n} archivo${n === 1 ? '' : 's'}`;
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
    const qn = $('#qName'); if (qn) { const nm = [val($('#name')), val($('#lastName')), val($('#secondLastName'))].filter(Boolean).join(' '); qn.textContent = nm || 'Cliente nuevo'; } }
  if ($('#piTxt')) { $('#piTxt').textContent = `${pct}% completado`; $('#piFill').style.width = pct + '%'; }
  const left = total - done;
  syncAnchor();
  if ($('#hint')) $('#hint').innerHTML = left ? `Faltan <b>${left}</b> dato${left > 1 ? 's' : ''} obligatorio${left > 1 ? 's' : ''}.` : '<b>Todo listo para guardar.</b>';
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
  oe.innerHTML = o ? `<span class="src ${o.k}">${o.label}</span>` : '';
}


/* ---------- Card del cliente: secciones plegadas por defecto ---------- */
{ const tg = $('#qToggle'), card = tg && tg.closest('.qcli'), list = $('#sSecs');
  if (tg) tg.onclick = () => { const open = tg.getAttribute('aria-expanded') !== 'true'; tg.setAttribute('aria-expanded', open); tg.setAttribute('aria-label', open ? 'Ocultar secciones' : 'Mostrar secciones'); card.classList.toggle('open', open); list.hidden = !open; }; }

/* ---------- AnchorMenu: activo según scroll ---------- */
const links = $$('#anchor .step');
function syncAnchor() {
  let cur = 'contacto';
  $$('section[data-sec]').forEach(s => { if (s.getBoundingClientRect().top < 160) cur = s.dataset.sec; });
  if (innerHeight + scrollY >= document.body.scrollHeight - 4) cur = 'bio';
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
function dzUploading() { return `<div class="dz-up"><span>Subiendo archivo...</span><div class="bar"><i></i></div></div>`; }
function wireDrop(zone, input) {
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('over'));
  zone.addEventListener('drop', e => { e.preventDefault(); zone.classList.remove('over'); input.files = e.dataTransfer.files; input.dispatchEvent(new Event('change')); });
}
function upload(host, after) {
  host.innerHTML = dzUploading();
  requestAnimationFrame(() => requestAnimationFrame(() => { const i = host.querySelector('.bar i'); if (i) i.style.width = '100%'; }));
  setTimeout(after, 950);
}
function renderFile(key) {
  const host = $(`[data-file="${key}"]`), f = S.files[key];
  if (f) { host.innerHTML = dzFilled(f.name, key); wireKebab(host); $$('[data-view]', host).forEach(b => b.onclick = () => docView(key)); return; }
  host.innerHTML = dzEmpty('f-' + key, key === 'idFront' || key === 'idBack' ? 'Arrastra el archivo aquí' : 'Arrastra elementos aquí', true, false, { key, title: CAM_DOCS[key] ? CAM_DOCS[key].title : 'documento' });
  host.querySelector('[data-cam]').onclick = e => { e.preventDefault(); e.stopPropagation(); camDoc(key); };
  { const fi = host.querySelector('input[type=file]'); if (fi && $('#h-' + key)) { fi.setAttribute('aria-labelledby', 't-' + key); fi.setAttribute('aria-describedby', 'h-' + key); } }
  const inp = $('#f-' + key); wireDrop(host.querySelector('.dz'), inp);
  inp.addEventListener('change', () => { const file = inp.files[0]; if (!file) return; S.dirty = true; upload(host, () => { S.files[key] = { name: file.name, url: URL.createObjectURL(file), type: file.type, size: file.size }; renderFile(key); accTags(); update(); toast('Archivo cargado', file.name); }); });
}
function renderPhoto(state, pct) {
  const host = $('#photoHost'); const ph = S.photo;
  state = state || (ph ? 'filed' : 'upload');
  const inner = {
    upload: `<span class="c"><span class="circ"><svg width="24" height="24"><use href="#i-uptop"/></svg></span></span>`,
    uploading: `<span class="c"><span class="ring" style="--p:${pct || 0}%"></span></span>`,
    error: `<span class="c"><span class="x"><svg width="26" height="26" style="color:#fff"><use href="#i-close"/></svg></span></span>`,
    filed: ph ? `<img src="${ph.url}" alt="Foto del cliente"><span class="hov"><span class="circ"><svg width="26" height="26"><use href="#i-swap"/></svg></span></span>` : ''
  }[state];
  const label = { upload: 'Cargar foto del cliente', uploading: 'Cargando foto', error: 'Error al cargar, elegir otra foto', filed: 'Cambiar foto del cliente' }[state];
  host.innerHTML = `<label class="phu ${state}" for="photo" aria-label="${label}" title="${state === 'upload' ? 'Arrastra la foto del cliente o haz clic para buscarla' : label}">${inner}<input type="file" id="photo" accept="image/jpeg,image/png"></label>`;
  const box = host.querySelector('.phu'), inp = $('#photo');
  box.addEventListener('dragover', e => { e.preventDefault(); box.classList.add('over'); });
  box.addEventListener('dragleave', () => box.classList.remove('over'));
  box.addEventListener('drop', e => { e.preventDefault(); box.classList.remove('over'); take(e.dataTransfer.files[0]); });
  inp.addEventListener('change', () => take(inp.files[0]));
  S.takePhoto = take;
  function take(f) {
    if (!f) return; S.dirty = true;
    const er = $('#photoErr');
    if (!/^image\/(jpeg|png)$/.test(f.type)) {
      renderPhoto('error'); er.hidden = false; er.innerHTML = '<svg width="16" height="16"><use href="#i-err"/></svg>Formato no permitido. Solo JPG o PNG.'; $('#photoHelp').hidden = true; return;
    }
    er.hidden = true; $('#photoHelp').hidden = false;
    let p = 0; renderPhoto('uploading', 0);
    const iv = setInterval(() => { p += 20; const r = $('#photoHost .ring'); if (r) r.style.setProperty('--p', p + '%'); if (p >= 100) { clearInterval(iv); S.photo = { name: f.name, url: URL.createObjectURL(f) }; renderPhoto(); summary(); toast(ph ? 'Foto actualizada' : 'Foto cargada', f.name); } }, 180);
  }
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
const CAM_PHOTO = { title: 'Foto del cliente', hint: 'Centra el rostro del cliente dentro del círculo, de frente y sin lentes oscuros.', mirror: true, w: 720, h: 720, guide: 'circle', name: 'foto-cliente', onUse: f => S.takePhoto && S.takePhoto(f), retFocus: '#camBtn' };
const CAM_DOCS = {
  idFront: { title: 'Frente de la identificación', hint: 'Coloca el frente de la identificación dentro del marco, sin reflejos y con los datos legibles.', w: 1280, h: 808, guide: 'card', name: 'identificacion-frente' },
  idBack: { title: 'Reverso de la identificación', hint: 'Coloca el reverso de la identificación dentro del marco, sin reflejos y con los datos legibles.', w: 1280, h: 808, guide: 'card', name: 'identificacion-reverso' },
  domFile: { title: 'Comprobante de domicilio', hint: 'Coloca el comprobante completo dentro del marco, con la dirección y la fecha legibles.', w: 1000, h: 1294, guide: 'page', name: 'comprobante-domicilio' },
  ingFile: { title: 'Comprobante de ingresos', hint: 'Coloca el comprobante completo dentro del marco, con el nombre y el monto legibles.', w: 1000, h: 1294, guide: 'page', name: 'comprobante-ingresos' },
};
const camStop = () => { if (camStream) { camStream.getTracks().forEach(t => t.stop()); camStream = null; } };
const camClose = () => { camStop(); camShot = null; const rf = camCfg && camCfg.retFocus; $('#modalRoot').innerHTML = ''; rf && $(rf) && $(rf).focus(); };
const camView = (inner, cls) => `<div class="cam-view ${cls || ''} g-${camCfg.guide}" style="aspect-ratio:${camCfg.w} / ${camCfg.h}">${inner}</div>`;
function camModal(view, hint, foot) {
  modal(`<div class="mh"><h3>${camCfg.title}</h3><button type="button" class="mx" id="camX" aria-label="Cerrar"><svg width="24" height="24"><use href="#i-close"/></svg></button></div>${view}${hint ? `<p class="cam-hint">${hint}</p>` : ''}<div class="mf">${foot}</div>`, 'cam' + (camCfg.h > camCfg.w ? ' cam-tall' : ''));
  $('#camX').onclick = camClose;
  $('#modalRoot .scrim').addEventListener('keydown', e => { if (e.key === 'Escape') camClose(); });
}
async function camOpen(cfg) {
  if (cfg) camCfg = cfg; camShot = null;
  camModal(camView('<div class="msg"><span class="spin"></span>Activando la cámara…</div>'), 'Si el navegador lo pide, permite el acceso a la cámara.', '<button type="button" class="btn ter" id="camCancel">Cancelar</button>');
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
    `<button type="button" class="btn ter" id="camCancel">Cancelar</button><button type="button" class="btn pri" id="camShoot">${CAM_ICON}Capturar</button>`);
  const v = $('#camVideo'); v.srcObject = camStream; v.play().catch(() => {});
  $('#camCancel').onclick = camClose;
  $('#camShoot').onclick = () => {
    if (!v.videoWidth) return;
    const r = camCfg.w / camCfg.h; let sw = v.videoWidth, sh = sw / r; if (sh > v.videoHeight) { sh = v.videoHeight; sw = sh * r; }
    const c = document.createElement('canvas'); c.width = camCfg.w; c.height = camCfg.h; const ctx = c.getContext('2d');
    if (camCfg.mirror) { ctx.translate(camCfg.w, 0); ctx.scale(-1, 1); }
    ctx.drawImage(v, (v.videoWidth - sw) / 2, (v.videoHeight - sh) / 2, sw, sh, 0, 0, camCfg.w, camCfg.h);
    c.toBlob(b => { camShot = b; camPreview(); }, 'image/jpeg', 0.9);
  };
  $('#camShoot').focus();
}
function camPreview() {
  const url = URL.createObjectURL(camShot);
  camModal(camView(`<img src="${url}" alt="Vista previa: ${esc(camCfg.title)}">`), camCfg.mirror ? 'Revisa que el rostro se vea claro y completo.' : 'Revisa que el documento se vea completo, enfocado y sin reflejos.',
    `<button type="button" class="btn ter" id="camAgain">Tomar otra</button><button type="button" class="btn pri" id="camUse">Usar foto</button>`);
  $('#camAgain').onclick = () => { camShot = null; camLive(); };
  $('#camUse').onclick = () => {
    const f = new File([camShot], `${camCfg.name}-${Date.now()}.jpg`, { type: 'image/jpeg' });
    camStop(); camShot = null; $('#modalRoot').innerHTML = ''; camCfg.onUse(f);
  };
  $('#camUse').focus();
}
function camError(name) {
  camStop();
  const m = { NotAllowedError: ['No tenemos permiso para usar la cámara', 'Permite el acceso a la cámara en la barra de direcciones del navegador y vuelve a intentarlo.'], SecurityError: ['No tenemos permiso para usar la cámara', 'Permite el acceso a la cámara en la barra de direcciones del navegador y vuelve a intentarlo.'], NotFoundError: ['No encontramos una cámara', 'Conecta una cámara a la computadora o sube el archivo desde la computadora.'], NotReadableError: ['La cámara está en uso', 'Cierra las otras aplicaciones que la estén usando y vuelve a intentarlo.'], NoSupport: ['Este navegador no permite usar la cámara', 'Sube el archivo desde la computadora.'] }[name] || ['No pudimos activar la cámara', 'Vuelve a intentarlo o sube el archivo desde la computadora.'];
  camModal(camView(`<div class="msg"><span class="ic"><svg width="26" height="26"><use href="#i-close"/></svg></span><b>${m[0]}</b>${m[1]}</div>`, 'err'), '',
    `<button type="button" class="btn ter" id="camFile">Subir archivo</button><button type="button" class="btn pri" id="camRetry">Reintentar</button>`);
  $('#camFile').onclick = () => { const inp = camCfg.fileInput; camClose(); inp && $(inp) && $(inp).click(); };
  $('#camRetry').onclick = () => camOpen();
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
  modal(`<div class="mh"><h3>${esc(DOC_TITLE[key] || 'Documento')}</h3><button type="button" class="mx" id="dvX" aria-label="Cerrar"><svg width="24" height="24"><use href="#i-close"/></svg></button></div>
    <div class="dv-meta"><span class="src new">${isPdf ? 'PDF' : isImg ? (/png/.test(f.type) ? 'PNG' : 'JPG') : 'Archivo'}</span>${esc(f.name)}${f.size ? ` · ${f.size < 1048576 ? Math.max(1, Math.round(f.size / 1024)) + ' KB' : (f.size / 1048576).toFixed(1) + ' MB'}` : ''}</div>
    ${stage}
    <div class="mf"><button type="button" class="btn ter" id="dvRep">Reemplazar</button><button type="button" class="btn pri" id="dvOk">Listo</button></div>`, 'dv');
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
  dd.hidden = false; dd.innerHTML = '<div class="load"><span class="spin p"></span>Buscando…</div>';
  t = setTimeout(() => {
    dd.innerHTML = '<span class="cap">Direcciones</span>' + ADDR.map((a, i) => `<button type="button" data-i="${i}"><b>${esc(line(a))}</b><small>${esc(line2(a))}</small></button>`).join('');
    $$('button', dd).forEach(b => b.onclick = () => saveAddr(ADDR[b.dataset.i]));
  }, 600);
});
function saveAddr(a) {
  S.address = a; S.dirty = true; $('#addrDD').hidden = true; $('#addrSearch').value = ''; $('#addrErr').hidden = true; $('[data-box="addr"]').classList.remove('err');
  $('#addrEntry').hidden = true;
  const s = $('#addrSaved'); s.hidden = false;
  s.innerHTML = `<div class="item" id="addrItem" title="Editar dirección"><span class="av">${esc(a.nombre.slice(0, 2).toUpperCase())}</span><span class="tx"><b>${esc(line(a))}</b><small>${esc(a.nombre)} | ${esc(line2(a))}</small></span><button type="button" class="del" aria-label="Quitar dirección"><svg width="20" height="20"><use href="#i-del"/></svg></button></div>`;
  $('#addrItem').onclick = () => { s.hidden = true; $('#addrEntry').hidden = false; openManual(true); fillManual(a); };
  $('#addrItem .del').onclick = e => { e.stopPropagation(); S.address = null; s.hidden = true; $('#addrEntry').hidden = false; update(); };
  update();
}
function fillManual(a) { Object.entries({ 'a-nombre': a.nombre, 'a-cp': a.cp, 'a-calle': a.calle, 'a-ext': a.ext, 'a-int': a.int, 'a-col': a.col, 'a-mun': a.mun, 'a-edo': a.edo }).forEach(([k, v]) => $('#' + k).value = v);  syncAll(); }
function openManual(o) { $('#manual').hidden = !o; $('#manualToggle').setAttribute('aria-expanded', o); $('#manualChev').style.transform = o ? 'rotate(180deg)' : ''; }
$('#manualToggle').onclick = () => openManual($('#manual').hidden);
$('#addrCancel').onclick = () => { openManual(false); if (S.address) saveAddr(S.address); };
$('#addrSave').onclick = () => {
  let first = null;
  $$('[data-areq]').forEach(el => { const m = val(el) ? '' : (el.tagName === 'SELECT' ? 'Debes seleccionar una opción' : 'Campo obligatorio'); showErr(el.closest('.fld'), m, el); if (m && !first) first = el; });
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
  if (coEdit >= 0) S.co[coEdit] = c; else S.co.push(c);
  S.dirty = true; $('#coForm').hidden = true; $('#coAdd').hidden = false; renderCo(); update();
  toast('Cotitular agregado', [c['c-name'], c['c-ln']].join(' '));
};
function renderCo() {
  $('#coList').innerHTML = S.co.map((c, i) => `<div class="item" data-e="${i}" title="Editar"><span class="av">${esc(((c['c-name'][0] || '') + (c['c-ln'][0] || '')).toUpperCase())}</span><span class="tx"><b>${esc([c['c-name'], c['c-ln'], c['c-ln2']].filter(Boolean).join(' '))}</b><small>${esc(c['c-rel'])}${c['c-phone'] ? ' | +52 ' + esc(c['c-phone']) : ''}</small></span><button type="button" class="del" aria-label="Quitar cotitular" data-d="${i}"><svg width="20" height="20"><use href="#i-del"/></svg></button></div>`).join('');
  $$('[data-e]', $('#coList')).forEach(b => b.onclick = () => { coEdit = +b.dataset.e; const c = S.co[coEdit]; coIds.forEach(id => $('#' + id).value = c[id] || ''); syncAll(); $('#coForm').hidden = false; $('#coAdd').hidden = true; });
  $$('[data-d]', $('#coList')).forEach(b => b.onclick = e => { e.stopPropagation(); S.co.splice(+b.dataset.d, 1); renderCo(); update(); });
}

/* ---------- Huellas: componentes de producción, flujo guiado y responsivo ---------- */
const TIPS = { Pulgar: [208.2, 170.4, -30], 'Índice': [143.5, 34.6, 0], Medio: [94.4, 15.8, 0], Anular: [53.6, 34.6, 0], 'Meñique': [12.9, 72.1, 0] };
const SHORT = { izq: 'izq.', der: 'der.' };
S.printImg = {}; S.fpState = 'idle';
function bigHand() {
  const flip = S.hand === 'der', done = S.prints[S.hand];
  const tips = FINGERS.map(f => { const [x, y, r] = TIPS[f]; const col = S.finger === f ? '#5A5AFF' : done.has(f) ? '#309C60' : '#E8E9EA'; return `<g class="tip-f" data-f="${f}" transform="translate(${x} ${y}) rotate(${r}) translate(-12 -12)" style="color:${col}"><title>${f}</title><rect width="24" height="24" fill="transparent"/><use href="#i-fp" width="24" height="24"/></g>`; }).join('');
  return `<svg viewBox="0 0 226 349" aria-label="Mano ${HN[S.hand]}: toca un dedo"><g${flip ? ' transform="translate(226 0) scale(-1 1)"' : ''}><use href="#i-bighand" width="226" height="349"/>${tips}</g></svg>`;
}
const nextFinger = () => FINGERS.find(f => !S.prints[S.hand].has(f));
function pickFinger(f) { S.finger = f; S.fpState = S.prints[S.hand].has(f) ? 'done' : 'idle'; renderFp(); }
function renderFp() {
  $$('.hand').forEach(h => h.setAttribute('aria-pressed', h.dataset.hand === S.hand));
  ['izq', 'der'].forEach(h => { const n = S.prints[h].size, el = $(`[data-hc="${h}"]`); el.textContent = n ? `${n} huella${n > 1 ? 's' : ''}` : 'Sin huellas'; el.classList.toggle('ok', !!n); });
  renderReg();
  const p = $('#fpanel');
  if (!S.hand) { p.className = 'fpanel empty'; p.innerHTML = 'Elige una mano para ver sus dedos.'; return; }
  p.className = 'fpanel';
  const done = S.prints[S.hand], f = S.finger, key = f && S.hand + ':' + f;
  const chips = FINGERS.map(x => `<button type="button" class="fchip" data-f="${x}" aria-pressed="${x === f}"><svg width="20" height="20" style="color:${done.has(x) ? '#309C60' : '#5A5AFF'}"><use href="#${done.has(x) ? 'i-check' : 'i-fp'}"/></svg>${x}</button>`).join('');
  let cap = '';
  if (!f) cap = `<div class="cap-box"><p class="cap-msg">Toca un dedo en la lista o en la mano.</p></div>`;
  else {
    const st = S.fpState, img = S.printImg[key];
    const box = st === 'busy' ? '<span class="spin p"></span>' : img ? `<img src="${img}" alt="Huella ${f} ${HN[S.hand]}">` : `<svg width="40" height="44" style="color:${st === 'done' ? '#5A5AFF' : st === 'err' ? '#A82424' : '#E8E9EA'}"><use href="#i-fp"/></svg>`;
    const nx = nextFinger();
    const msg = { idle: 'Pide al cliente que coloque el dedo en el lector.', busy: 'Leyendo huella… pide al cliente que no retire el dedo.', done: nx ? `Listo. Sigue con ${nx.toLowerCase()} ${HN[S.hand]}.` : `Ya registraste los 5 dedos de la mano ${HN[S.hand]}.`, err: '' }[st];
    const err = st === 'err' ? `<span class="ferr" style="margin-left:0"><svg width="16" height="16"><use href="#i-err"/></svg>No detectamos el lector. Revisa la conexión o carga una imagen.</span>` : '';
    const upl = `<label class="lnk" style="cursor:pointer"><svg width="20" height="20"><use href="#i-upload"/></svg>Cargar imagen<input type="file" id="fpFile" accept="image/jpeg,image/png"></label>`;
    const acts = st === 'busy' ? '' : st === 'done'
      ? `${nx ? `<button type="button" class="btn pri sm" id="fpNext">Siguiente: ${nx}</button>` : (S.prints[S.hand === 'izq' ? 'der' : 'izq'].size < 5 ? `<button type="button" class="btn pri sm" id="fpOtherHand">Ir a mano ${S.hand === 'izq' ? 'derecha' : 'izquierda'}</button>` : '')}<button type="button" class="lnk" id="fpRetake">Repetir</button>`
      : `<button type="button" class="btn pri sm" id="fpTake">${st === 'err' ? 'Reintentar' : 'Tomar huella'}</button>${upl}`;
    cap = `<div class="cap-box"><div class="slot ${st === 'busy' ? 'busy' : st === 'done' ? 'done' : st === 'err' ? 'err' : ''}" id="slot"><div class="box" role="button" tabindex="0" aria-label="Tomar huella">${box}</div></div>
      <div class="cap-info"><div class="slot-lbl"><span>${f} ${HN[S.hand]}</span>${st === 'done' ? '<span class="tag green">Capturada</span>' : ''}</div>${msg ? `<p class="cap-msg" aria-live="polite">${msg}</p>` : ''}${err}<div class="cap-act">${acts}</div></div></div>`;
  }
  p.innerHTML = `<div class="big" id="big">${bigHand()}</div><div class="fright"><div><p class="fp-step"><span class="dot">2</span>Elige el dedo</p><div class="fchips">${chips}</div></div><div><p class="fp-step"><span class="dot">3</span>Toma la huella</p>${cap}</div></div>`;
  $$('.tip-f', p).forEach(g => g.onclick = () => pickFinger(g.dataset.f));
  $$('.fchip', p).forEach(b => b.onclick = () => pickFinger(b.dataset.f));
  const take = () => {
    if (S.fpState === 'busy' || S.fpState === 'done') return;
    S.fpState = 'busy'; renderFp();
    setTimeout(() => {
      if ($('#demoReader') && $('#demoReader').checked) { S.fpState = 'err'; renderFp(); return; }
      S.prints[S.hand].add(S.finger); S.dirty = true; S.fpState = 'done'; renderFp(); update();
    }, 1100);
  };
  if ($('#fpTake')) $('#fpTake').onclick = take;
  if ($('#slot .box') && S.fpState !== 'done') $('#slot .box').onclick = take;
  if ($('#fpFile')) $('#fpFile').onchange = e => { const file = e.target.files[0]; if (!file) return; S.printImg[S.hand + ':' + S.finger] = URL.createObjectURL(file); S.prints[S.hand].add(S.finger); S.dirty = true; S.fpState = 'done'; renderFp(); update(); };
  if ($('#fpNext')) $('#fpNext').onclick = () => pickFinger(nextFinger());
  if ($('#fpOtherHand')) $('#fpOtherHand').onclick = () => { S.hand = S.hand === 'izq' ? 'der' : 'izq'; S.finger = null; S.fpState = 'idle'; renderFp(); };
  if ($('#fpRetake')) $('#fpRetake').onclick = () => { S.prints[S.hand].delete(S.finger); delete S.printImg[S.hand + ':' + S.finger]; S.fpState = 'idle'; renderFp(); update(); };
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
  fa.innerHTML = `<div class="alert neg" role="alert"><div class="main"><span class="ico"><svg width="24" height="24"><use href="#i-neg"/></svg></span><div class="txt"><p class="ttl">${esc(title)}</p><p class="msg">${esc(msg)}</p></div></div>${action ? `<button type="button" class="act">${esc(action)}</button>` : ''}<button type="button" class="x" aria-label="Cerrar"><svg width="20" height="20"><use href="#i-close"/></svg></button></div>`;
  if (action) fa.querySelector('.act').onclick = onAction;
  fa.querySelector('.x').onclick = () => { fa.hidden = true; };
  fa.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function toast(title, msg) {
  const r = $('#toastRoot');
  r.innerHTML = `<div class="toast" role="status"><span class="ico" style="display:flex;color:#309C60"><svg width="24" height="24"><use href="#i-pos"/></svg></span><div style="display:flex;flex-direction:column;gap:8px;flex:1;min-width:0"><p style="font-weight:700;color:#174A2E;line-height:24px;letter-spacing:.3px">${esc(title)}</p><p style="color:#2A2C2F;letter-spacing:.3px;overflow-wrap:anywhere">${esc(msg)}</p></div><button type="button" class="x" aria-label="Cerrar" style="display:flex;width:36px;height:36px;padding:8px;border:0;border-radius:50%;background:#fff;color:#5A5AFF"><svg width="20" height="20"><use href="#i-close"/></svg></button><span class="bar"></span></div>`;
  r.querySelector('.x').onclick = () => r.innerHTML = '';
  clearTimeout(toast.t); toast.t = setTimeout(() => r.innerHTML = '', 3000);
}
function modal(html, cls) {
  const r = $('#modalRoot'); r.innerHTML = `<div class="scrim"><div class="modal ${cls || ''}" role="dialog" aria-modal="true">${html}</div></div>`;
  $$('[data-close]', r).forEach(b => b.onclick = () => r.innerHTML = '');
  const p = r.querySelector('.btn.pri'); p && p.focus();
}

/* ---------- Guardar ---------- */
function save(e) {
  e && e.preventDefault(); if (S.saving) return;
  const errs = [];
  reqs().forEach(el => { S.touched.add(el.id); if (paint(el)) errs.push(el); });
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
  $$('[data-save]').forEach(b => { b.disabled = true; b.innerHTML = '<span class="spin"></span><span>Guardar cliente</span>'; });
  $$('[data-cancel]').forEach(b => b.disabled = true);
  setTimeout(() => {
    S.saving = false; $('#fs').disabled = false;
    $$('[data-save]').forEach(b => { b.disabled = false; b.textContent = 'Guardar cliente'; });
    $$('[data-cancel]').forEach(b => b.disabled = false);
    if ($('#demoFail').checked) { alertNeg('No pudimos guardar el cliente', 'Hubo un problema de conexión. Tus datos siguen aquí.', 'Reintentar', save); return; }
    if ($('#demoDup').checked) { alertNeg('Este cliente ya está registrado', `Ya existe un cliente con la CURP ${val($('#curp')) || 'capturada'}. Revisa su registro antes de crear uno nuevo; tus datos siguen aquí.`, 'Ver cliente registrado', () => { location.href = './#clientes'; }); goto($('#curp')); return; }
    const name = [val($('#name')), val($('#lastName')), val($('#secondLastName'))].filter(Boolean).join(' ') || 'El cliente';
    modal(`<div class="mh"><h3>Cliente creado</h3><button type="button" class="mx" aria-label="Cerrar" data-close><svg width="24" height="24"><use href="#i-close"/></svg></button></div><div class="mb"><p><b>${esc(name)}</b> ya aparece en tu Lista de clientes.</p></div><div class="mf"><button type="button" class="btn ter sm" data-go>Volver a la lista</button><button type="button" class="btn pri sm" data-go>Ver cliente</button></div>`);
    try { localStorage.setItem('ataskate.newClient', JSON.stringify({ name: val($('#name')), last: [val($('#lastName')), val($('#secondLastName'))].filter(Boolean).join(' '), email: val($('#email')), phone: val($('#phone')), nat: $('#nat').value })); } catch (e) {}
    $$('[data-go]').forEach(b => b.onclick = () => { location.href = './#clientes'; });
  }, 1600);
}
function goto(el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(() => (el._trig || el).focus({ preventScroll: true }), 400); }
$('#form').addEventListener('submit', save);
$$('aside [data-save]').forEach(b => b.onclick = save);

/* ---------- Cancelar: modal existente (producción), solo si hay datos ---------- */
$$('[data-cancel]').forEach(b => b.onclick = () => {
  if (!S.dirty) { location.href = './#clientes'; return; }
  modal(`<h3>¿Deseas cancelar la operación?</h3><div class="mb"><p>¿Deseas cancelar la creación del cliente?, Se perderán los datos capturados.</p></div><div class="mf"><button type="button" class="btn ter" id="yes">Sí, cancelar</button><button type="button" class="btn pri" data-close>Continuar editando</button></div>`, 'cancel');
  $('#yes').onclick = () => { location.href = './#clientes'; };
});

/* ---------- Demo ---------- */
$('#demoFill').onclick = () => {
  const v = { name: 'Mariana', lastName: 'Gómez', secondLastName: 'Ruiz', email: 'mariana.gomez@ejemplo.com', phone: '5512345678', civil: 'Casado(a)', gender: 'Femenino', nat: 'Mexicana', dob: '12/04/1990', curp: 'GORM900412MDFMZR08', rfc: 'GORM900412AB1', activity: 'Comercio' };
  Object.entries(v).forEach(([k, x]) => { const el = $('#' + k); el.value = x; el.dispatchEvent(new Event('input')); S.touched.add(k); if (el.dataset.req !== undefined) paint(el); });
  saveAddr(ADDR[0]); $('#formAlert').hidden = true; update(); toast('Datos de ejemplo cargados', 'Son datos ficticios para revisar el prototipo.');
};


/* ---------- Buscar cliente existente: correo, teléfono o identificación (datos ficticios para simular) ---------- */
const LK_DB = [
  { src: 'mk', srcLabel: 'Marketplace', origin: 'Se registró en el Marketplace ataskate el 12/03/2026', email: 'valeria.ortiz@ejemplo.com', phone: '5587654321', idType: 'INE', idNum: '3141592653589', curp: '',
    data: { name: 'Valeria', lastName: 'Ortiz', secondLastName: 'Campos', email: 'valeria.ortiz@ejemplo.com', phone: '5587654321', nat: 'Mexicana' },
    addr: { nombre: 'Casa', calle: 'Av. Insurgentes Sur', ext: '1602', int: '', col: 'Crédito Constructor', mun: 'Benito Juárez', edo: 'Ciudad de México', cp: '03940' },
    note: 'Del Marketplace solo vienen sus datos de contacto y su dirección de envío. Completa los datos personales, la identificación y las huellas.' },
  { src: 'red', srcLabel: 'Otra casa de empeño', origin: 'Registrado en Monte Cristo · Red ataskate', email: 'raul.campos@ejemplo.com', phone: '8112345678', idType: 'INE', idNum: '4567891234567', curp: 'CAMR880921HNLMDL09',
    data: { name: 'Raúl', lastName: 'Campos', secondLastName: 'Medina', email: 'raul.campos@ejemplo.com', phone: '8112345678', civil: 'Casado(a)', gender: 'Masculino', nat: 'Mexicana', dob: '21/09/1988', curp: 'CAMR880921HNLMDL09', rfc: 'CAMR880921K21', activity: 'Comercio', idType: 'INE', idNum: '4567891234567' },
    addr: { nombre: 'Casa', calle: 'Calle Morelos', ext: '845', int: '', col: 'Centro', mun: 'Monterrey', edo: 'Nuevo León', cp: '64000' },
    note: 'Viene de otra casa de empeño de la Red ataskate con sus datos personales, dirección e identificación. Revisa que estén actualizados y registra sus huellas.' },
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
  modal(`<div class="mh"><h3>Nuevo cliente</h3><a class="mx" href="./#clientes" aria-label="Cerrar"><svg width="24" height="24"><use href="#i-close"/></svg></a></div>
    <p class="lk-sub">Antes de capturarlo, revisa si el cliente ya existe en tu casa, en otra casa de empeño de la Red ataskate o en el Marketplace. Escribe al menos uno de estos datos.</p>
    <div class="lk-grid">
      <div class="fld"><label class="lbl" for="lkEmail">Correo electrónico</label><input class="in ${er.email || er.any ? 'err' : ''}" id="lkEmail" type="email" placeholder="nombre@correo.com" value="${esc(LK.email)}" aria-invalid="${!!(er.email || er.any)}">${fe('email')}${fe('any')}</div>
      <div class="fld"><label class="lbl dob" for="lkPhone">Teléfono</label><div class="doble ${er.phone || er.any ? 'err' : ''}"><button type="button" class="pre" tabindex="-1" aria-label="Lada +52"><svg class="flag"><use href="#flag-mx"/></svg>+52</button><input id="lkPhone" inputmode="tel" maxlength="12" placeholder="55 0000 0000" value="${esc(LK.phone)}" aria-invalid="${!!(er.phone || er.any)}"></div>${fe('phone')}</div>
      <div class="lk-or s2">o identificación</div>
      <div class="fld"><label class="lbl" for="lkIdType">Tipo de identificación</label><select class="in" id="lkIdType">${ids.map(x => `<option ${x === LK.idType ? 'selected' : ''}>${x}</option>`).join('')}</select></div>
      <div class="fld"><label class="lbl" for="lkIdNum">Número o clave</label><input class="in ${er.idNum || er.any ? 'err' : ''}" id="lkIdNum" placeholder="Escribe el número o la clave" value="${esc(LK.idNum)}" aria-invalid="${!!(er.idNum || er.any)}">${fe('idNum')}</div>
    </div>
    <div class="lk-ex"><p>Ejemplos para simular la búsqueda (datos ficticios):</p><div class="row">${LK_EX.map(x => `<button type="button" class="lk-chip" data-ex="${x.k}"><span class="src ${x.k}">${x.k === 'mk' ? 'Marketplace' : x.k === 'red' ? 'Red ataskate' : 'Sin registro'}</span>${x.label}</button>`).join('')}</div></div>
    <div class="mf"><a class="btn ter" href="./#clientes">Cancelar</a><button type="button" class="btn pri" id="lkGo">Buscar</button></div>`, 'lk');
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
    const b = $('#lkGo'); b.disabled = true; b.innerHTML = '<span class="spin"></span>Buscando…';
    setTimeout(() => lkResult(lkFind(LK)), 900);
  };
  setTimeout(() => ($('#lkEmail') || {}).focus && $('#lkEmail').focus(), 30);
}
function lkResult(res) {
  if (!res) {
    modal(`<div class="mh"><h3>Nuevo cliente</h3><a class="mx" href="./#clientes" aria-label="Cerrar"><svg width="24" height="24"><use href="#i-close"/></svg></a></div>
      <div class="lk-empty"><span class="src new">Sin registro</span><p class="t">No encontramos a este cliente</p><p class="c">No existe en tu casa, en la Red ataskate ni en el Marketplace. Crea un cliente nuevo; usaremos los datos que escribiste.</p></div>
      <div class="mf"><button type="button" class="btn ter" id="lkBack">Buscar otro</button><button type="button" class="btn pri" id="lkNew">Crear cliente nuevo</button></div>`, 'lk');
    $('#lkBack').onclick = () => lkForm();
    $('#lkNew').onclick = () => { $('#modalRoot').innerHTML = ''; lkApply(null); };
    return;
  }
  const { c, m } = res; const d = c.data;
  const kv = [['Correo electrónico', d.email], ['Teléfono', lkPhone(d.phone)], ['Fecha de nacimiento', d.dob], ['CURP', d.curp], ['Identificación', d.idType ? `${d.idType} ${d.idNum}` : ''], ['Dirección', `${c.addr.calle} ${c.addr.ext}, ${c.addr.col}, ${c.addr.mun}`]];
  modal(`<div class="mh"><h3>Encontramos a este cliente</h3><a class="mx" href="./#clientes" aria-label="Cerrar"><svg width="24" height="24"><use href="#i-close"/></svg></a></div>
    <div class="lk-card">
      <div class="lk-who"><span class="avatar">${esc((d.name[0] + d.lastName[0]).toUpperCase())}</span><div style="min-width:0"><b>${esc(`${d.name} ${d.lastName} ${d.secondLastName || ''}`.trim())}</b><small>${esc(c.origin)}</small></div></div>
      <div class="lk-match"><span class="src ${c.src}">${c.srcLabel}</span>Coincide por: ${m.join(', ')}</div>
      <dl class="lk-kv">${kv.map(([k, v]) => `<div><dt>${k}</dt><dd class="${v ? '' : 'na'}">${v ? esc(v) : 'Sin registrar'}</dd></div>`).join('')}</dl>
    </div>
    <p class="lk-sub">${esc(c.note)}</p>
    <div class="mf"><button type="button" class="btn ter" id="lkBack">Buscar otro</button><button type="button" class="btn pri" id="lkLoad">Cargar datos</button></div>`, 'lk');
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
    title = 'Datos precargados de'; msg = c.note; cls = 'info';
  } else {
    v = { email: LK.email.trim(), phone: digits(LK.phone) };
    if (LK.idType === 'CURP') v.curp = LK.idNum.trim().toUpperCase(); else if (LK.idType === 'R.F.C') v.rfc = LK.idNum.trim().toUpperCase();
    else if (LK.idNum.trim()) { v.idType = LK.idType; v.idNum = LK.idNum.trim(); }
    title = 'Cliente nuevo'; msg = 'No existe en ningún registro. Usamos los datos de la búsqueda; captura el resto.'; cls = 'pos';
  }
  Object.entries(v).forEach(([k, x]) => lkSet(k, x));
  S.lkKeys = Object.keys(v);
  let a = $('#srcAlert'); if (!a) { a = document.createElement('div'); a.id = 'srcAlert'; $('#form').prepend(a); }
  const src = c ? `<span class="src ${c.src}">${c.srcLabel}</span>` : '<span class="src new">Sin registro</span>';
  a.innerHTML = `<div class="alert ${cls}" role="status"><div class="main"><span class="ico">${c ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M11 17h2v-6h-2Zm1-8q.425 0 .713-.288Q13 8.425 13 8t-.287-.713Q12.425 7 12 7t-.712.287Q11 7.575 11 8t.288.712Q11.575 9 12 9Zm0 13q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Z" fill="currentColor"/></svg>' : '<svg width="24" height="24"><use href="#i-pos"/></svg>'}</span><div class="txt"><p class="ttl">${esc(title)} ${src}</p><p class="msg">${esc(msg)}</p></div></div><button type="button" class="act" id="srcAgain">Buscar otro cliente</button></div>`;
  $('#srcAgain').onclick = () => lkForm();
  update(); window.scrollTo({ top: 0, behavior: 'smooth' });
  toast(c ? 'Datos cargados' : 'Cliente nuevo', c ? `${v.name} ${v.lastName} · ${c.srcLabel}` : 'Captura sus datos para registrarlo.');
}



$('#demoLookup').onclick = () => lkForm();
lkForm();

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
