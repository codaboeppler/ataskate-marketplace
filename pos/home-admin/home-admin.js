/* Home del Administrativo (NewAdminHome, HU-CP-400-F / HU-CP-400.1-F). Tres cosas:
   1. Mampostería como NewCardMasonry: columnas = máx(1, piso((ancho + 16) / (360 + 16))) y la tarjeta i va a la columna i mod n.
   2. Tabuladores: chips Oro / Plata. Al cambiar de metal, su código vuelve a pedir la tarjeta (getTabulators con catMetalId);
      mientras llega, oculta el "Precio mercado hoy" y pone el Spinner medium en 200 de alto. Aquí la respuesta es de ejemplo.
   3. Los enlaces sin pantalla en el prototipo (href="#") no navegan. */
(() => {
  /* ---------- 1. Mampostería ---------- */
  const MIN_COL = 360;
  const GAP = 16;
  const caja = document.getElementById('haMasonry');
  const tarjetas = Array.from(caja.children);
  let columnas = 0;
  const acomodar = () => {
    const ancho = caja.getBoundingClientRect().width;
    const n = Math.max(1, Math.floor((ancho + GAP) / (MIN_COL + GAP)));
    if (n === columnas) return;
    columnas = n;
    const cols = Array.from({ length: n }, () => {
      const c = document.createElement('div');
      c.className = 'ha-col';
      c.style.width = 'calc((100% - ' + GAP * (n - 1) + 'px) / ' + n + ')';
      return c;
    });
    tarjetas.forEach((t, i) => cols[i % n].appendChild(t));
    caja.replaceChildren(...cols);
    caja.classList.add('is-cols');
  };
  acomodar();
  if ('ResizeObserver' in window) new ResizeObserver(acomodar).observe(caja);
  else addEventListener('resize', acomodar);

  /* ---------- 2. Tabuladores ---------- */
  /* respuesta de GetHomeAdminTabulators ya mapeada (mapTabulators): Oro = tabulatorsDummyData de su constants.ts; Plata, de ejemplo */
  const METALES = {
    1: { mercado: '$74,250.13 24K/oz', filas: [['22K', '$43,100.00'], ['18K', '$32,330.00'], ['14K', '$24,145.00'], ['10K', '$17,987.00']] },
    2: { mercado: '$612.40 .999/oz', filas: [['.999', '$354.84'], ['.950', '$337.43'], ['.925', '$328.56'], ['.800', '$284.15']] },
  };
  const ESPERA = 600;   /* latencia simulada del servicio */
  const tab = document.getElementById('haTabuladores');
  const precio = tab.querySelector('[data-precio]');
  const zona = tab.querySelector('[data-tabla]');
  const celda = (txt, der) => '<span class="ha-td' + (der ? ' ha-td--der' : '') + '" role="cell"><span class="ha-tc">' + txt + '</span></span>';
  const tabla = (filas) => '<div class="ha-tabla" role="table" aria-label="Precios por pureza" style="--cols: 1fr 130px">'
    + '<div class="ha-tr" role="row"><span class="ha-td" role="columnheader"><span class="ha-th ha-c-cap">Pureza</span></span>'
    + '<span class="ha-td ha-td--der" role="columnheader"><span class="ha-th ha-c-cap">Precio (oz)</span></span></div>'
    + filas.map(([p, v]) => '<div class="ha-hr" aria-hidden="true"></div><div class="ha-tr" role="row">' + celda(p) + celda(v, true) + '</div>').join('')
    + '</div>';
  let ultimo = 1;
  tab.querySelector('.ha-chips').addEventListener('click', (e) => {
    const b = e.target.closest('.ha-choice');
    if (!b) return;
    const id = Number(b.dataset.metal);
    if (id === ultimo) return;   /* su handleMetalChange ignora el chip ya elegido */
    ultimo = id;
    tab.querySelectorAll('.ha-choice').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    precio.hidden = true;
    zona.innerHTML = '<div class="ha-cargando"><div class="ha-spinner" role="status" aria-label="Cargando precios"></div></div>';
    setTimeout(() => {
      if (ultimo !== id) return;   /* como su latestMetalId: solo pinta la última respuesta */
      precio.textContent = METALES[id].mercado;
      precio.hidden = false;
      zona.innerHTML = tabla(METALES[id].filas);
    }, ESPERA);
  });

  /* ---------- 3. Enlaces sin destino ---------- */
  document.getElementById('haMain').addEventListener('click', (e) => {
    const a = e.target.closest('a[href="#"]');
    if (a) e.preventDefault();
  });
})();
