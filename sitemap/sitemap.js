/* Sitemap de la plataforma — misma estructura en las tres apps:
   Home arriba, debajo las opciones del menú como tarjetas con su icono y, adentro, sus pantallas. */
(function () {
  const D = window.SITEMAP;
  if (!D) return;

  const S = D.screens;
  const ICONS = window.SITEMAP_ICONS || {};
  const KIND = { pantalla: '', paso: 'paso', popup: 'popup', panel: 'panel', menu: 'menú', widget: 'widget', 'pestaña': 'pestaña' };
  const STATUS = { construido: 'Construido', en_curso: 'En curso', planeado: 'Planeado' };
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const kids = {};
  Object.values(S).forEach((s) => { if (s.parent && S[s.parent]) (kids[s.parent] = kids[s.parent] || []).push(s.id); });
  Object.values(kids).forEach((list) => list.sort((a, b) => (S[a].order ?? 999) - (S[b].order ?? 999)));
  const out = {}, inc = {};
  D.links.forEach((l) => {
    if (!S[l.from] || !S[l.to]) return;
    (out[l.from] = out[l.from] || []).push(l);
    (inc[l.to] = inc[l.to] || []).push(l);
  });

  // la raíz de cada app se llama igual en las tres: Home
  D.apps.forEach((a) => { if (S[a.root]) S[a.root].name = 'Home'; });

  let app = D.apps[0].key;
  let active = null;

  // icono del menú (Figma) o del DS, si la pantalla tiene uno
  const ic = (id) => (ICONS[id] ? `<span class="sm-ic">${ICONS[id]}</span>` : '');
  const dot = (s) => (s.status && s.status !== 'construido' ? `<span class="sm-dot sm-dot--${s.status}" title="${STATUS[s.status]}"></span>` : '');
  const chip = (id) => (S[id] ? `<button type="button" class="sm-chip" data-id="${id}">${ic(id)}${dot(S[id])}${esc(S[id].name)}</button>` : '');
  const arrow = '<span class="sm-arrow" aria-hidden="true">→</span>';

  function tree(id) {
    const list = kids[id] || [];
    if (!list.length) return '';
    return `<ul>${list.map((k) => `<li><button type="button" class="sm-node" data-id="${k}">${dot(S[k])}<span>${esc(S[k].name)}</span></button>${tree(k)}</li>`).join('')}</ul>`;
  }

  function render() {
    const A = D.apps.find((a) => a.key === app);
    const root = S[A.root];
    $('smApps').innerHTML = D.apps.map((a) => `<button type="button" class="sm-app" role="tab" aria-selected="${a.key === app}" data-app="${a.key}">${esc(a.label)}<small>${Object.values(S).filter((s) => s.app === a.key).length}</small></button>`).join('');

    // ---------- nivel 1: Home (solo el nodo; su detalle sale al tocarlo) ----------
    $('smRoot').innerHTML = `<button type="button" class="sm-home-pill" data-id="${root.id}">${ic(root.id)}${esc(root.name)}</button>`;

    // ---------- nivel 2: opciones del menú · nivel 3: sus pantallas ----------
    const cards = A.sections.map((sec) => {
      const s = S[sec.id];
      const sub = s.name !== sec.label ? `<span class="sm-card__screen">${esc(s.name)}</span>` : '';
      const inner = kids[s.id] && kids[s.id].length ? `<div class="sm-tree">${tree(s.id)}</div>` : '<p class="sm-card__empty">Sin pantallas adentro.</p>';
      return `
        <article class="sm-card">
          <button type="button" class="sm-card__head" data-id="${s.id}">
            ${ic(s.id) || '<span class="sm-ic"></span>'}
            <span class="sm-card__text">
              ${sec.group ? `<span class="sm-card__group">${esc(sec.group)}</span>` : ''}
              <span class="sm-card__name">${esc(sec.label)}${dot(s)}</span>
              ${sub}
            </span>
          </button>
          ${inner}
        </article>`;
    }).join('');
    $('smCols').innerHTML = `<div class="sm-grid">${cards}</div>`;

    $('smLegend').innerHTML = `<span><span class="sm-dot sm-dot--en_curso"></span>En curso</span><span><span class="sm-dot sm-dot--planeado"></span>Planeado</span><span>Sin punto: construido</span>`;

    const flows = D.flows.filter((f) => f.app === app);
    $('smFlows').innerHTML = flows.map((f) => `
      <div class="sm-flow">
        <p class="sm-flow__name">${esc(f.name)}</p>
        <div class="sm-flow__steps">${f.steps.map(chip).join(arrow)}</div>
      </div>`).join('') || '<p class="sm-sub">Sin flujos para esta plataforma.</p>';
    highlight();
  }

  function path(id) {
    const p = [];
    let cur = S[id];
    const seen = new Set();
    while (cur && !seen.has(cur.id)) { seen.add(cur.id); p.unshift(cur.id); cur = S[cur.parent]; }
    const A = D.apps.find((a) => a.key === S[id].app);
    if (A && p[0] !== A.root && !(A.pre || []).includes(p[0])) p.unshift(A.root);
    return p;
  }

  function conn(l, dir) {
    const other = S[dir === 'in' ? l.from : l.to];
    return `<li><button type="button" class="sm-conn" data-id="${other.id}"><strong>${ic(other.id)}${esc(other.name)}</strong><span>${esc(l.trigger)}</span></button></li>`;
  }

  function open(id) {
    const s = S[id];
    if (!s) return;
    if (s.app !== app) { app = s.app; active = id; render(); }
    active = id;
    const p = path(id);
    $('smCrumbs').innerHTML = p.map((pid, i) => (i === p.length - 1
      ? `<span aria-current="page">${esc(S[pid].name)}</span>`
      : `<button type="button" data-id="${pid}">${esc(S[pid].name)}</button><span aria-hidden="true">›</span>`)).join('');
    $('smPanelTitle').innerHTML = `${ic(id)}${esc(s.name)}`;
    $('smPanelMeta').innerHTML = `${s.kind && s.kind !== 'pantalla' ? `<span class="sm-tag">${esc(KIND[s.kind] || s.kind)}</span>` : ''}<span class="sm-tag sm-tag--${s.status}">${STATUS[s.status] || ''}</span>`;
    $('smPanelDesc').textContent = s.desc || '';
    const ins = inc[id] || [], outs = out[id] || [], ch = kids[id] || [];
    let body = '';
    if (ins.length) body += `<h3>Se llega desde</h3><ul class="sm-conns">${ins.map((l) => conn(l, 'in')).join('')}</ul>`;
    if (outs.length) body += `<h3>Lleva a</h3><ul class="sm-conns">${outs.map((l) => conn(l, 'out')).join('')}</ul>`;
    if (ch.length) body += `<h3>Contiene</h3><ul class="sm-conns">${ch.map((k) => `<li><button type="button" class="sm-conn" data-id="${k}"><strong>${ic(k)}${esc(S[k].name)}</strong><span>${esc(S[k].desc || '')}</span></button></li>`).join('')}</ul>`;
    if (s.hus && s.hus.length) body += `<h3>Historias</h3><div class="sm-hus">${s.hus.map((h) => `<span class="sm-tag">${esc(h)}</span>`).join('')}</div>`;
    $('smPanelBody').innerHTML = body;
    $('smPanel').classList.add('is-open');
    $('smPanel').setAttribute('aria-hidden', 'false');
    $('smScrim').hidden = false;
    highlight();
    const el = document.querySelector(`.sm-canvas [data-id="${id}"]`);
    if (el && window.matchMedia('(min-width: 761px)').matches) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function close() {
    active = null;
    $('smPanel').classList.remove('is-open');
    $('smPanel').setAttribute('aria-hidden', 'true');
    $('smScrim').hidden = true;
    highlight();
  }

  function highlight() {
    const canvas = document.querySelector('.sm-canvas');
    canvas.querySelectorAll('.is-active, .is-related').forEach((e) => e.classList.remove('is-active', 'is-related'));
    canvas.classList.toggle('sm-dim', !!active);
    if (!active) return;
    const rel = new Set();
    (inc[active] || []).forEach((l) => rel.add(l.from));
    (out[active] || []).forEach((l) => rel.add(l.to));
    canvas.querySelectorAll('[data-id]').forEach((e) => {
      if (e.dataset.id === active) e.classList.add('is-active');
      else if (rel.has(e.dataset.id)) e.classList.add('is-related');
    });
  }

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-app]');
    if (t) { app = t.dataset.app; close(); render(); return; }
    const n = e.target.closest('[data-id]');
    if (n) { open(n.dataset.id); return; }
    if (e.target.closest('#smPanelClose') || e.target.id === 'smScrim') close();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && active) close(); });

  render();
})();
