/* Home Operativo 3.0: pestañas de los widgets (Tabuladores: Oro / Plata; Tienda en línea: 7 / 30 días). Datos de ejemplo. */
(() => {
  const PRECIOS = {
    oro: { mercado: '$1,744.46 <small>24K/g</small>', filas: [['22K', '$1,385.70'], ['18K', '$1,039.43'], ['14K', '$776.28'], ['10K', '$578.30']] },
    plata: { mercado: '$19.85 <small>.999/g</small>', filas: [['.999', '$17.40'], ['.950', '$16.20'], ['.925', '$15.60'], ['.800', '$13.10']] },
  };
  document.querySelectorAll('.hw__tabs').forEach((tabs) => tabs.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    tabs.querySelectorAll('button').forEach((x) => x.setAttribute('aria-selected', x === b));
    const metal = b.dataset.metal; if (!metal) return;
    const w = tabs.closest('.hw');
    w.querySelector('[data-precio]').innerHTML = PRECIOS[metal].mercado;
    w.querySelector('[data-tabla]').innerHTML = PRECIOS[metal].filas.map(([p, v]) => '<tr><td>' + p + '</td><td>' + v + '</td></tr>').join('');
  }));
})();
