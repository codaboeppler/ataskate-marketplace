/* Tabuladores — datos de ejemplo que comparten la lista (index.html, listado.js) y el detalle (detalle.html, tabuladores.js).
   En la app vienen de tres servicios; aquí van con sus mismas formas:
   - GetTabulatorLocationTree → árbol de ubicaciones (ITabulatorLocationTreeNode)
   - GetTabulatorsByLocation  → tabuladores de la ubicación elegida (ITabulatorByLocation)
   - GetTabulatorDetails      → detalle (ITabulatorDetails); lo arma tabuladores.js con estos datos
   "Oro zona centro" (id 12, TAB-001) es el tabulador del detalle original de Product Design: sus sucursales, reglas y precio son los mismos. */
window.TB_DATOS = (() => {
  'use strict';

  /* ---------- Árbol de ubicaciones (ITabulatorLocationTreeNode) ----------
     type 1 = grupo y 2 = sucursal (PHYSICAL_LOCATION_TYPES); la raíz es la empresa (type 1 con groupFatherId 0 → "Mi empresa") */
  const grupo = (locationId, groupFatherId, name, branches) => ({ locationId, groupFatherId, name, type: 1, desciptionType: 'Grupo', branches });
  const suc = (locationId, groupFatherId, name) => ({ locationId, groupFatherId, name, type: 2, desciptionType: 'Sucursal', branches: null });
  const ARBOL = [
    grupo(1, 0, 'Empeños La Esperanza', [
      grupo(10, 1, 'Ciudad de México', [
        suc(101, 10, 'Sucursal Polanco'), suc(102, 10, 'Sucursal Roma Norte'), suc(103, 10, 'Sucursal Coyoacán'),
        suc(104, 10, 'Sucursal Santa Fe'), suc(105, 10, 'Sucursal Centro Histórico'),
      ]),
      grupo(20, 1, 'Estado de México', [
        suc(201, 20, 'Sucursal Satélite'), suc(202, 20, 'Sucursal Tlalnepantla Centro, Plaza Mundo E'), suc(203, 20, 'Sucursal Toluca'),
      ]),
      grupo(30, 1, 'Nuevo León', [suc(301, 30, 'Sucursal Monterrey Centro'), suc(302, 30, 'Sucursal San Nicolás')]),
      grupo(40, 1, 'Guanajuato', [suc(401, 40, 'Sucursal León'), suc(402, 40, 'Sucursal Celaya'), suc(403, 40, 'Sucursal Irapuato')]),
    ]),
  ];
  /* índice plano: nodo, padre y ruta (para el buscador y para la zona de cada sucursal) */
  const PLANO = [];
  const indexar = (nodes, padre) => nodes.forEach((n) => {
    PLANO.push({ nodo: n, padre });
    if (n.branches) indexar(n.branches, n);
  });
  indexar(ARBOL, null);
  const entrada = (id) => PLANO.find((e) => String(e.nodo.locationId) === String(id)) || null;
  const nodo = (id) => { const e = entrada(id); return e ? e.nodo : null; };
  const padre = (id) => { const e = entrada(id); return e ? e.padre : null; };
  /* ruta de grupos hasta el nodo, sin incluirlo ("Empeños La Esperanza › Ciudad de México"); en la app llega de la API (breadcrume) */
  const ruta = (id) => {
    const out = []; let p = padre(id);
    while (p) { out.unshift(p.name); p = padre(p.locationId); }
    return out.join(' › ');
  };
  /* ids de las sucursales que cuelgan de un nodo (o el nodo mismo si es sucursal) */
  const sucursalesDe = (id) => {
    const n = nodo(id); if (!n) return [];
    const out = [];
    const rec = (x) => { if (x.type === 2) out.push(x.locationId); (x.branches || []).forEach(rec); };
    rec(n);
    return out;
  };

  /* ---------- Tabuladores (ITabulatorByLocation + lo que el detalle necesita) ----------
     estatus: 1 = Activo, 2 = Archivado (TABS_IDS). sucursales: [id, reemplazada]; reemplazada = un tabulador más nuevo ya aplica ahí
     (el detalle la muestra tachada): "Oro Estado de México" (2 Oct) reemplazó a "Oro zona centro" en Satélite y a "Oro fiestas patrias"
     en Satélite y Toluca; "Oro Bajío" reemplazó a "Oro piloto León". Centro Histórico no tiene tabulador (la tabla sale vacía). quilates: purezas de su tabla. reglas: cuántas reglas de automatización trae (0 a 2 de ejemplo).
     creado / modificado: textos del detalle (la API todavía no los manda; en el original son los DEV_MOCK_DETAILS). */
  const QUILATES = ['8K', '10K', '12K', '14K', '18K', '21K', '22K', '24K'];
  const desde = (a, b) => QUILATES.slice(QUILATES.indexOf(a), QUILATES.indexOf(b) + 1);
  const TABULADORES = [
    { tabulatorId: 12, nameTabulator: 'Oro zona centro', identifier: 'TAB-001', createdDate: '2026-09-12', estatus: 1,
      basePrice: 2182.66, unitOfMeasureId: 1, unitOfMeasure: 'Gramo', quilates: desde('8K', '24K'), reglas: 2,
      sucursales: [[101], [102], [103], [201, true], [104], [202]], creado: '12 Sep 2026', modificado: '3 Oct 2026' },
    { tabulatorId: 13, nameTabulator: 'Oro piloto León', identifier: 'TAB-002', createdDate: '2026-09-13', estatus: 2,
      basePrice: 2160, unitOfMeasureId: 1, unitOfMeasure: 'Gramo', quilates: desde('14K', '22K'), reglas: 0,
      sucursales: [[401, true]], creado: '13 Sep 2026', modificado: '19 Sep 2026' },
    { tabulatorId: 14, nameTabulator: 'Oro fiestas patrias', identifier: 'TAB-003', createdDate: '2026-09-14', estatus: 2,
      basePrice: 2214.9, unitOfMeasureId: 1, unitOfMeasure: 'Gramo', quilates: desde('10K', '24K'), reglas: 1,
      sucursales: [[201, true], [203, true]], creado: '14 Sep 2026', modificado: '2 Oct 2026' },
    { tabulatorId: 15, nameTabulator: 'Oro zona norte', identifier: 'TAB-004', createdDate: '2026-09-15', estatus: 1,
      basePrice: 61650, unitOfMeasureId: 2, unitOfMeasure: 'Onza', quilates: desde('10K', '22K'), reglas: 0,
      sucursales: [[301], [302]], creado: '15 Sep 2026', modificado: '29 Sep 2026' },
    { tabulatorId: 16, nameTabulator: 'Oro Bajío', identifier: 'TAB-005', createdDate: '2026-09-19', estatus: 1,
      basePrice: 2168.4, unitOfMeasureId: 1, unitOfMeasure: 'Gramo', quilates: desde('8K', '24K'), reglas: 1,
      sucursales: [[401], [402], [403]], creado: '19 Sep 2026', modificado: '1 Oct 2026' },
    { tabulatorId: 17, nameTabulator: 'Oro Estado de México', identifier: 'TAB-006', createdDate: '2026-10-02', estatus: 1,
      basePrice: 2175.3, unitOfMeasureId: 1, unitOfMeasure: 'Gramo', quilates: desde('10K', '24K'), reglas: 1,
      sucursales: [[201], [203]], creado: '2 Oct 2026', modificado: '2 Oct 2026' },
  ].map((t) => ({ ...t, catMetalId: 1, catMetalName: 'Oro', carats: t.quilates[0] + ' - ' + t.quilates[t.quilates.length - 1] }));
  const tabulador = (id) => TABULADORES.find((t) => String(t.tabulatorId) === String(id)) || null;

  /* ---------- Archivar / desarchivar entre pantallas ----------
     Lo que se archiva en la lista o en el detalle se recuerda en esta pestaña del navegador (sessionStorage), para que al ir
     de una a otra el tabulador esté donde debe. Si el navegador no deja guardar, cada pantalla arranca con los datos de ejemplo. */
  const CLAVE = 'tb-estatus';
  const leer = () => { try { return JSON.parse(sessionStorage.getItem(CLAVE) || '{}') || {}; } catch (e) { return {}; } };
  const estatus = (id) => { const t = tabulador(id); const g = leer()[id]; return g === 1 || g === 2 ? g : t ? t.estatus : 1; };
  const guardarEstatus = (id, valor) => {
    try { const g = leer(); g[id] = valor; sessionStorage.setItem(CLAVE, JSON.stringify(g)); } catch (e) { /* sin almacenamiento: solo en esta pantalla */ }
  };

  return { ARBOL, nodo, padre, ruta, sucursalesDe, PLANO, TABULADORES, tabulador, estatus, guardarEstatus };
})();
