/* Contrato de empeño: firma digital y ticket de empeño (Transacción registrada de la pasarela).

   Qué trae:
   - "Firmar contrato": modal con el contrato completo para que el cliente lo lea y lo firme con el dedo, una pluma o el mouse.
     El contrato sigue las 14 secciones y el orden de "Diseño del contrato" (HU-IN-374) y lleva los datos de la empresa de
     "Datos para contratos" congelados al emitir (HU-CE-586-B), el folio único de pantalla y PDF (HU-CE-581-B, nomenclatura
     sucursal + consecutivo de HU-CE-549-B), el contenido del PDF (HU-CE-305-F: montos, artículos con avalúo y préstamo, tabla
     de amortización, ayuda y PROFECO), la huella si el cliente la tiene sin bloquear (HU-CE-461-B) y un anexo con las fotos
     de las prendas.
   - "Ticket de empeño": ticket térmico (80 mm) rediseñado, uno por contrato, para imprimir, descargar o mandar por WhatsApp.

   Uso desde pasarela.js:
     AtsContrato.contratosDe(recibo)                → [{folio, ...}] contratos de empeño de la transacción
     AtsContrato.firmar({recibo, folio, alCambiar}) → abre la firma (folio opcional: el primero sin firmar)
     AtsContrato.ver({recibo, folio})               → contrato firmado, solo lectura
     AtsContrato.ticket({recibo, folio})            → ticket de empeño (sin folio: todos los tickets)
   Las firmas quedan en recibo.firmas[folio] = {img, fecha, hora}. En la app las guarda el servicio con el contrato.

   Datos de la empresa: los de ejemplo del prototipo (PrestaYa, ficticios). En la app salen del snapshot del contrato. */
(function () {
  'use strict';

  /* ---------- utilidades ---------- */
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const r2 = (n) => Math.round((Number(n) || 0) * 100) / 100;
  const num = (n) => r2(n).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const mxn = (n) => '$' + r2(n).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const pad = (n, l) => String(n).padStart(l, '0');
  const ddmmaaaa = (d) => pad(d.getDate(), 2) + '/' + pad(d.getMonth() + 1, 2) + '/' + d.getFullYear();
  const hhmm = (d) => pad(d.getHours(), 2) + ':' + pad(d.getMinutes(), 2);
  const masDias = (d, n) => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() + n); return x; };
  const iniciales = (s) => String(s || '').split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
  const nucDe = (cli) => String((cli && cli.nuc) || '—').replace(/^NUC-?/i, '');
  const norm = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  const IC = {
    close: '<path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z" fill="currentColor"/>',
    firma: '<path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83a.996.996 0 000-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z" fill="currentColor"/>',
    check: '<path d="M9.55 18L3.85 12.3L5.275 10.875L9.55 15.15L18.725 5.975L20.15 7.4L9.55 18Z" fill="currentColor"/>',
    imprimir: '<path d="M16 8V5H8v3H6V3h12v5h-2zM4 10h16v7h-4v4H8v-4H4v-7zm6 9h4v-4h-4v4zm8-5.5a1 1 0 100-2 1 1 0 000 2z" fill="currentColor"/>',
    descargar: '<path d="M12 16l-5-5 1.4-1.45 2.6 2.6V4h2v8.15l2.6-2.6L17 11l-5 5zm-6 4c-.55 0-1.02-.2-1.41-.59A1.93 1.93 0 014 18v-3h2v3h12v-3h2v3c0 .55-.2 1.02-.59 1.41-.39.39-.86.59-1.41.59H6z" fill="currentColor"/>',
    correo: '<path d="M4 20c-.55 0-1.02-.2-1.41-.59A1.93 1.93 0 012 18V6c0-.55.2-1.02.59-1.41C2.98 4.2 3.45 4 4 4h16c.55 0 1.02.2 1.41.59.39.39.59.86.59 1.41v12c0 .55-.2 1.02-.59 1.41-.39.39-.86.59-1.41.59H4zm8-7L4 8v10h16V8l-8 5zm0-2l8-5H4l8 5z" fill="currentColor"/>',
    whatsapp: '<path d="M12.04 2a9.93 9.93 0 00-8.6 14.9L2 22l5.25-1.38A9.94 9.94 0 1012.04 2zm0 18.17c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 1115.29-4.4 8.25 8.25 0 01-8.3 8.26zm4.53-6.18c-.25-.12-1.47-.72-1.7-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.6.19 1.13.16 1.56.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.28z" fill="currentColor"/>',
    borrar: '<path d="M7 21c-.55 0-1.02-.2-1.41-.59A1.93 1.93 0 015 19V6H4V4h5V3h6v1h5v2h-1v13c0 .55-.2 1.02-.59 1.41-.39.39-.86.59-1.41.59H7zM17 6H7v13h10V6zM9 17h2V8H9v9zm4 0h2V8h-2v9z" fill="currentColor"/>',
    abajo: '<path d="M12 16l-6-6 1.4-1.4 4.6 4.6 4.6-4.6L18 10l-6 6z" fill="currentColor"/>',
    huella: '<path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2a.506.506 0 01.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67a.49.49 0 01-.44.28zM3.5 9.72a.499.499 0 01-.41-.79c.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25a.5.5 0 01-.12.7c-.23.16-.54.11-.7-.12a9.388 9.388 0 00-3.39-2.94c-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21zm6.25 12.07a.47.47 0 01-.35-.15c-.87-.87-1.34-1.43-2.01-2.64-.69-1.23-1.05-2.73-1.05-4.34 0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.42-2.09-4.39-4.66-4.39-2.57 0-4.66 1.97-4.66 4.39 0 1.44.32 2.77.93 3.85.64 1.15 1.08 1.64 1.85 2.42.19.2.19.51 0 .71-.11.1-.24.15-.37.15zm7.17-1.85c-1.19 0-2.24-.3-3.1-.89-1.49-1.01-2.38-2.65-2.38-4.39 0-.28.22-.5.5-.5s.5.22.5.5c0 1.41.72 2.74 1.94 3.56.71.48 1.54.71 2.54.71.24 0 .64-.03 1.04-.1.27-.05.53.13.58.41.05.27-.13.53-.41.58-.57.11-1.07.12-1.21.12z" fill="currentColor"/>',
  };
  const ic = (n, s) => `<svg width="${s || 20}" height="${s || 20}" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">${IC[n]}</svg>`;

  /* ---------- datos de ejemplo de la empresa (ficticios; en la app: snapshot de "Datos para contratos", HU-CE-586-B) ---------- */
  const EMPRESA = {
    comercial: 'PrestaYa', razon: 'PrestaYa S.A. de C.V.', rfc: 'PYS010101ABC', representante: 'Mariana Ejemplo Ruiz',
    escritura: '00,001', escrituraFecha: '02 de abril de 2019', notario: '001', folioMercantil: '000001', folioFecha: '14 de mayo de 2019',
    testimonio: '01', testimonioFecha: '06 de diciembre de 2020', notarioPoder: '002',
    domicilio: 'Av. Ejemplo 123, Col. Centro, C.P. 09000, Iztapalapa, Ciudad de México', telefono: '55 0000 0300', correo: 'atencion@prestaya.ejemplo',
    horario: '09:00 a 19:00 horas de lunes a sábado', rpca: '0000-2026', rpcaFecha: '12 de octubre de 2026',
    web: 'ataskate.mx/prestaya', redes: '@prestaya', sucursal: 'Multi apoyo Iztapalapa', prefijo: 'IZT',
  };
  /* plazos del cotizador (GetTermSelectionList del prototipo): % por periodo y días de cada pago */
  const PLAZOS = {
    mensual: { nombre: 'Mensual', pct: 6.5, pagos: [30], periodo: 30 },
    quincenal: { nombre: 'Quincenal', pct: 3.5, pagos: [15, 30], periodo: 15 },
    'cliente frecuente': { nombre: 'Cliente frecuente', pct: 5.5, pagos: [30], periodo: 30 },
  };
  const IVA = 0.16, ALMACENAJE = 0.2;   // reparto ilustrativo del cargo del periodo: 80 % interés, 20 % almacenaje
  const REFRENDOS = 12;   // total de refrendos aplicables del plazo de ejemplo (límite de refrendos, HU-CE-521-B)

  /* ---------- armar los contratos de la transacción ---------- */
  function contratosDe(recibo) {
    if (!recibo || !Array.isArray(recibo.items)) return [];
    const hoy = recibo.creado ? new Date(recibo.creado) : new Date();
    return recibo.items.filter((it) => norm(it.tipo) === 'empeno').map((it, i) => {
      const id = String(it.contrato || (i + 1));
      const folio = /^[A-Z]{3}-/.test(id) ? id : EMPRESA.prefijo + '-' + pad(id.replace(/\D/g, '') || i + 1, 6);
      const arts = (Array.isArray(it.articulos) && it.articulos.length ? it.articulos : [{ nombre: it.titulo, prestamo: Math.abs(it.monto), avaluo: Math.abs(it.monto) / 0.6, imagen: it.imagen }])
        .map((a) => ({ ...a, prestamo: r2(a.prestamo), avaluo: r2(a.avaluo || a.prestamo / 0.6) }));
      const prestamo = r2(arts.reduce((s, a) => s + a.prestamo, 0)) || r2(Math.abs(it.monto));
      const avaluo = r2(arts.reduce((s, a) => s + a.avaluo, 0));
      const pl = PLAZOS[norm(it.plazo)] || PLAZOS.mensual;
      const pagos = pl.pagos.map((d, k) => {
        const cargo = r2(prestamo * pl.pct / 100 * (k + 1));
        const interes = r2(cargo * (1 - ALMACENAJE)), almacenaje = r2(cargo - interes), iva = r2(cargo * IVA);
        const refrendo = r2(cargo + iva);
        return { opc: k + 1, fecha: ddmmaaaa(masDias(hoy, d)), mutuo: prestamo, interes, almacenaje, iva, refrendo, desempeno: r2(prestamo + refrendo) };
      });
      const ult = pagos[pagos.length - 1];
      const cat = r2((Math.pow(1 + pl.pct / 100, 360 / pl.periodo) - 1) * 100);
      /* tabla de amortización: cada refrendo renueva el plazo completo (30 días) con el mismo saldo insoluto; se lista hasta el
         último refrendo permitido. En la app la devuelve el servicio (GetTermPaytable / HU-CE-580-B), el front no calcula. */
      const ciclo = pl.pagos[pl.pagos.length - 1];
      let acumulado = 0;
      const amortizacion = [];
      for (let j = 0; j < REFRENDOS; j++) {
        pagos.forEach((p, k) => {
          const dia = j * ciclo + pl.pagos[k];
          const fin = k === pagos.length - 1;
          const pagado = r2(acumulado + p.refrendo);
          amortizacion.push({ n: amortizacion.length + 1, ciclo: j + 1, fin, fecha: ddmmaaaa(masDias(hoy, dia)), dias: pl.pagos[k] - (k ? pl.pagos[k - 1] : 0),
            saldo: prestamo, interes: p.interes, almacenaje: p.almacenaje, iva: p.iva, refrendo: p.refrendo, desempeno: p.desempeno, pagado,
            nota: j === 0 && fin ? 'Fecha límite del contrato' : j === REFRENDOS - 1 && fin ? 'Último refrendo permitido' : fin ? 'Refrendo ' + (j + 1) : '' });
          if (fin) acumulado = pagado;
        });
      }
      const fines = amortizacion.filter((x) => x.fin);
      const totales = { interes: r2(fines.reduce((s, x) => s + x.interes, 0)), almacenaje: r2(fines.reduce((s, x) => s + x.almacenaje, 0)), iva: r2(fines.reduce((s, x) => s + x.iva, 0)), refrendos: acumulado };
      return {
        folio, item: it, articulos: arts, prestamo, avaluo, plazo: pl, pagos, cat, tasaAnual: r2(pl.pct * 360 / pl.periodo), amortizacion, totales, refrendosMax: REFRENDOS,
        fechaLimite: ult.fecha, refrendo: ult.refrendo, desempeno: ult.desempeno, totalPagar: ult.desempeno,
        fecha: ddmmaaaa(hoy), hora: hhmm(hoy), cliente: recibo.cliente || { nombre: 'Cliente' }, cotitulares: it.cotitulares || [],
        operacion: recibo.folio, caja: 'Caja 03', sucursal: recibo.sucursal || EMPRESA.sucursal, pagosOperacion: recibo.pagos || [],
      };
    });
  }
  const firmaDe = (recibo, folio) => (recibo.firmas || {})[folio] || null;

  /* ---------- piezas del documento ---------- */
  const QR = (() => {   // patrón fijo que parece QR (en la app el servicio genera el QR real del enlace de pago)
    const n = 21, on = new Set();
    const caja = (x, y) => { for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) if (i === 0 || j === 0 || i === 6 || j === 6 || (i > 1 && i < 5 && j > 1 && j < 5)) on.add((y + j) * n + x + i); };
    caja(0, 0); caja(14, 0); caja(0, 14);
    let s = 7; for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { s = (s * 37 + 11) % 101; if (!((x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12)) && s % 3 === 0) on.add(y * n + x); }
    return `<svg viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges" aria-hidden="true">${[...on].map((k) => `<rect x="${k % n}" y="${Math.floor(k / n)}" width="1" height="1"/>`).join('')}</svg>`;
  })();
  const barras = (txt) => {   // código de barras ilustrativo del folio
    let x = 0, h = ''; const s = String(txt);
    for (let i = 0; i < s.length * 3 + 8; i++) { const w = ((s.charCodeAt(i % s.length) + i) % 3) + 1; if (i % 2 === 0) h += `<rect x="${x}" y="0" width="${w}" height="40"/>`; x += w; }
    return `<svg class="cf-barras" viewBox="0 0 ${x} 40" preserveAspectRatio="none" aria-hidden="true">${h}</svg>`;
  };
  const logo = (cls) => `<span class="${cls}" aria-hidden="true">${esc(iniciales(EMPRESA.comercial).slice(0, 1))}</span>`;
  const imgArt = (a, cls) => a.imagen ? `<img class="${cls}" src="${esc(a.imagen)}" alt="" />` : `<span class="${cls} cf-sinfoto" aria-hidden="true">${esc(iniciales(a.nombre))}</span>`;
  const describe = (a) => [a.ruta && a.ruta.length ? a.ruta[a.ruta.length - 1] : '', a.caracteristicas].filter(Boolean).join(' · ');

  function seccion(id, titulo, cuerpo) {
    return `<section class="cf-sec cf-sec--${id}">${titulo ? `<h3 class="cf-sec__t">${titulo}</h3>` : ''}${cuerpo}</section>`;
  }
  function tabla(cabs, filas, cls) {
    return `<div class="cf-tabla-wrap"><table class="cf-tabla${cls ? ' ' + cls : ''}"><thead><tr>${cabs.map((c) => `<th scope="col">${c}</th>`).join('')}</tr></thead>
      <tbody>${filas.map((f) => `<tr>${f.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }

  /* contrato completo: 14 secciones en el orden por defecto de HU-IN-374 y el anexo fotográfico */
  function contratoHTML(c, firma) {
    const cli = c.cliente, E = EMPRESA;
    const ident = cli.identificacion || 'INE · DEMO-' + String(cli.nuc || '0000').replace(/\D/g, '').slice(-4);
    const cot = c.cotitulares.length ? c.cotitulares.map(esc).join(', ') : '';
    const hoja1 = [
      seccion('identidad', '', `<div class="cf-ident">${logo('cf-logo')}<div><p class="cf-ident__n">${esc(E.razon)}</p>
        <p class="cf-ident__s">RFC ${esc(E.rfc)} · ${esc(E.domicilio)}</p></div><span class="cf-ident__suc">Sucursal ${esc(c.sucursal)}</span></div>`),
      seccion('folio', '', `<div class="cf-folio"><p class="cf-folio__t">Contrato de mutuo con interés y garantía prendaria</p>
        <dl><div><dt>Folio</dt><dd><b>${esc(c.folio)}</b></dd></div><div><dt>Fecha de celebración</dt><dd>Ciudad de México, ${esc(c.fecha)}</dd></div><div><dt>Operación</dt><dd>${esc(c.operacion || '—')}</dd></div></dl></div>`),
      seccion('partes', 'Partes del contrato', `<p><b>El Proveedor:</b> ${esc(E.razon)} («EL PROVEEDOR»), con domicilio en ${esc(E.domicilio)}, teléfono ${esc(E.telefono)}, correo electrónico ${esc(E.correo)}, representado por ${esc(E.representante)}.</p>
        <p><b>El Consumidor:</b> ${esc(cli.nombre)} («EL CONSUMIDOR»), NUC ${esc(nucDe(cli))}, que se identifica con ${esc(ident)}${cli.telefono ? `, teléfono ${esc(String(cli.telefono).replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2 $3'))}` : ''}.</p>
        ${cot ? `<p><b>Cotitular o beneficiario:</b> ${cot}, solo para efectos de este contrato.</p>` : ''}`),
      seccion('financiera', 'Tabla financiera', tabla(['CAT', 'Tasa de interés anual', 'Monto del préstamo', 'Monto total a pagar', 'Comisiones'],
        [[`<b>${c.cat.toFixed(1)} %</b><small>Sin IVA. Para fines informativos y de comparación</small>`, `${c.tasaAnual.toFixed(1)} % fija`, `<b>${mxn(c.prestamo)}</b> MXN`, `${mxn(c.totalPagar)} MXN<small>al plazo máximo</small>`, 'Almacenaje incluido en el cargo del periodo. Avalúo: $0.00. Reposición de contrato: $0.00']])
        + '<p class="cf-nota"><b>Metodología de cálculo de interés:</b> tasa de interés anual fija dividida entre 360 días por el saldo insoluto del préstamo por los días efectivamente transcurridos.</p>'),
      seccion('plazo', 'Plazo y condiciones de pago', `<p>Plazo <b>${esc(c.plazo.nombre)}</b> (${c.plazo.pct} % por periodo). Fecha límite para refrendar o desempeñar: <b>${esc(c.fechaLimite)}</b>. Total de refrendos aplicables: <b>${c.refrendosMax}</b> (ver la tabla de amortización). Si el vencimiento cae en día inhábil, se considera el día hábil siguiente.</p>
        <p>Métodos de pago aceptados: efectivo en sucursal, tarjetas de crédito y débito, transferencia electrónica y pago en línea en ${esc(E.web)}.</p>`),
      seccion('iva', 'Nota de IVA y remisión al procedimiento', `<p>El interés y el almacenaje causan IVA a la tasa del 16 %. El procedimiento para desempeño, refrendo, finiquito y reclamo del remanente se encuentra descrito en las cláusulas de este contrato.</p>`),
      seccion('dudas', 'Dudas, aclaraciones y reclamaciones', `<p>Domicilio: ${esc(E.domicilio)}. Teléfono: ${esc(E.telefono)}. Correo electrónico: ${esc(E.correo)}, en un horario de ${esc(E.horario)}. Página de internet: ${esc(E.web)}.</p>
        <p>En caso de queja también puede acudir a PROFECO al 55 5568 8722 o al 800 468 8722. Página de internet: www.gob.mx/profeco</p>`),
      seccion('profeco', 'Registro PROFECO y obligación de transparencia', `<p>Contrato de Adhesión registrado en el Registro Público de Contratos de Adhesión de la Procuraduría Federal del Consumidor bajo el número ${esc(E.rpca)} de fecha ${esc(E.rpcaFecha)}. EL PROVEEDOR está obligado a entregar a EL CONSUMIDOR el documento con la descripción del préstamo, saldos, movimientos y de la prenda en garantía.</p>`),
      seccion('opciones', 'Tabla de opciones de pago', tabla(['Opc.', 'Fecha de pago', 'Mutuo', 'Interés', 'Almacenaje', 'IVA', 'Por refrendo', 'Por desempeño'],
        c.pagos.map((p) => [p.opc, p.fecha, mxn(p.mutuo), mxn(p.interes), mxn(p.almacenaje), mxn(p.iva), `<b>${mxn(p.refrendo)}</b>`, `<b>${mxn(p.desempeno)}</b>`]), 'cf-tabla--num')
        + '<p class="cf-nota">Después de la fecha límite se cobran intereses moratorios conforme a la cláusula de desempeño extemporáneo.</p>'),
      seccion('prenda', 'Tabla de la prenda', tabla(['Prenda', 'Descripción y características', 'Estado', 'Avalúo', 'Préstamo', '% Préstamo / avalúo'],
        c.articulos.map((a) => [`<span class="cf-prenda">${imgArt(a, 'cf-prenda__img')}<b>${esc(a.nombre)}</b></span>`, esc(describe(a) || '—'), esc(a.estado || '—'), mxn(a.avaluo), mxn(a.prestamo), (a.avaluo ? (a.prestamo / a.avaluo * 100).toFixed(0) : '—') + ' %'])
          .concat([[`<b>Total · ${c.articulos.length} ${c.articulos.length === 1 ? 'prenda' : 'prendas'}</b>`, '', '', `<b>${mxn(c.avaluo)}</b>`, `<b>${mxn(c.prestamo)}</b>`, (c.avaluo ? (c.prestamo / c.avaluo * 100).toFixed(0) : '—') + ' %']]), 'cf-tabla--prenda')),
    ];
    /* hoja de la tabla de amortización: todos los periodos hasta el último refrendo permitido */
    const A = c.amortizacion, primerLimite = A.findIndex((y) => y.fin) + 1;
    const amort = seccion('amortizacion', 'Tabla de amortización', `<div class="cf-amort__datos">
        <div><small>Monto del préstamo</small><b>${mxn(c.prestamo)}</b></div>
        <div><small>Plazo</small><b>${esc(c.plazo.nombre)} · ${c.plazo.pct} % por periodo</b></div>
        <div><small>Tasa de interés anual</small><b>${c.tasaAnual.toFixed(1)} % fija</b></div>
        <div><small>Refrendos aplicables</small><b>${c.refrendosMax}</b></div>
        <div><small>Pagos</small><b>${A.length} fechas de pago</b></div>
      </div>
      <p class="cf-nota cf-amort__mxn">Importes en pesos mexicanos (MXN).</p>
      ${tabla(['No.', 'Fecha de pago', 'Saldo insoluto', 'Interés', 'Almacenaje', 'IVA', 'Pago para refrendar', 'Pago para desempeñar', 'Refrendos pagados acumulados', 'Concepto'],
        A.map((x) => [x.n, `${esc(x.fecha)}<small>${x.dias} días</small>`, num(x.saldo), num(x.interes), num(x.almacenaje), num(x.iva), `<b>${num(x.refrendo)}</b>`, `<b>${num(x.desempeno)}</b>`, num(x.pagado),
          x.nota ? `<span class="cf-amort__nota${x.n === primerLimite ? ' is-limite' : ''}">${esc(x.nota)}</span>` : (x.fin ? '' : 'Pago parcial del periodo')])
          .concat([['<b>Totales</b>', `${c.refrendosMax} periodos`, '', `<b>${num(c.totales.interes)}</b>`, `<b>${num(c.totales.almacenaje)}</b>`, `<b>${num(c.totales.iva)}</b>`, `<b>${num(c.totales.refrendos)}</b>`, '', `<b>${num(c.totales.refrendos)}</b>`, 'Si refrenda en cada fecha límite']]), 'cf-tabla--num cf-tabla--amort')}
      <p class="cf-nota">Supone que EL CONSUMIDOR paga cada refrendo en su fecha límite y no hace abonos a capital: el saldo insoluto se mantiene en ${mxn(c.prestamo)}. Un abono a capital reduce el saldo y los cargos de los periodos siguientes. Si paga después de la fecha límite se cobran intereses moratorios. Para desempeñar en cualquier fecha se paga la columna "Pago para desempeñar" de esa fecha.</p>`);
    const firmaCli = firma
      ? `<div class="cf-firma__trazo"><img src="${firma.img}" alt="Firma de ${esc(cli.nombre)}" /></div>`
      : `<div class="cf-firma__trazo cf-firma__trazo--pend"><span>Firma pendiente</span></div>`;
    const hoja2 = [
      seccion('desempeno', 'Desempeño y firma del consumidor', `<p>EL CONSUMIDOR recoge en el acto y a su entera satisfacción la(s) prenda(s) descrita(s), por lo que otorga a ${esc(E.comercial)} el finiquito más amplio que en derecho corresponda, liberándolo de cualquier responsabilidad en relación con este contrato y la prenda.</p>
        <p class="cf-nota">Se firma el día del desempeño. Fecha: ____ / ____ / ________</p>`),
      seccion('firma', 'Firma', `<div class="cf-firmas">
        <div class="cf-firma">${firmaCli}<span class="cf-firma__l"></span><b>${esc(cli.nombre)}</b><small>El Consumidor${firma ? ` · firmado el ${esc(firma.fecha)} a las ${esc(firma.hora)}` : ''}</small></div>
        <div class="cf-firma"><div class="cf-firma__trazo cf-firma__sello"><span>${ic('check', 16)}Firma electrónica</span><small>${esc(E.razon)}</small></div><span class="cf-firma__l"></span><b>${esc(E.representante)}</b><small>El Proveedor · representante legal</small></div>
        <div class="cf-firma"><div class="cf-firma__trazo cf-firma__huella">${cli.huella === false ? '<span>Sin huella registrada</span>' : `${ic('huella', 28)}<span>Huella registrada</span>`}</div><span class="cf-firma__l"></span><b>Huella del consumidor</b><small>Se asocia sola si el cliente la tiene</small></div>
      </div>${firma ? `<p class="cf-sello">${ic('check', 16)}Firmado digitalmente en ${esc(c.sucursal)}, ${esc(c.caja)}, el ${esc(firma.fecha)} a las ${esc(firma.hora)}. Huella del documento: ${esc(firma.hash)}</p>` : ''}`),
      seccion('qr', '', `<div class="cf-qr"><span class="cf-qr__c" role="img" aria-label="Código QR para pagar en línea">${QR}</span><div><p class="cf-qr__t">Refrenda o desempeña en línea</p><p>Escanea el código, crea tu perfil en ${esc(E.web)} y paga fácil.</p></div></div>`),
      seccion('redes', '', `<p class="cf-redes">Síguenos <span>Facebook ${esc(E.redes)}</span><span>Instagram ${esc(E.redes)}</span></p>`),
      seccion('anexo', 'Anexo 1 · Fotografías de la prenda', `<p class="cf-nota">Fotografías tomadas al cotizar el empeño. Forman parte de este contrato e identifican la prenda que queda en garantía.</p>
        <div class="cf-fotos">${c.articulos.map((a, k) => `<figure class="cf-foto">${imgArt(a, 'cf-foto__img')}<figcaption><b>${k + 1}. ${esc(a.nombre)}</b><small>${esc(describe(a) || 'Sin características')} · Avalúo ${mxn(a.avaluo)}</small></figcaption></figure>`).join('')}</div>`),
    ];
    const hojas = [hoja1.join(''), amort, hoja2.join('')];
    return hojas.map((h, i) => `<article class="cf-hoja${i === 1 ? ' cf-hoja--ancha' : ''}" aria-label="Contrato ${esc(c.folio)}, hoja ${i + 1} de ${hojas.length}">${h}<p class="cf-hoja__pie">Hoja ${i + 1} de ${hojas.length} · Contrato ${esc(c.folio)}</p></article>`).join('');
  }

  /* ---------- ticket de empeño (80 mm) ---------- */
  function ticketHTML(c, firma) {
    const cli = c.cliente, E = EMPRESA;
    const entrega = c.pagosOperacion.length ? c.pagosOperacion.map((p) => `<div class="tk-fila"><span>${esc(p.detalle || p.metodo)}</span><span>${mxn(p.monto)}</span></div>`).join('') : '';
    return `<article class="tk" aria-label="Ticket de empeño ${esc(c.folio)}">
      <header class="tk-marca">${logo('tk-logo')}<div><b>${esc(E.comercial)}</b><small>${esc(E.razon)} · RFC ${esc(E.rfc)}</small><small>Sucursal ${esc(c.sucursal)}</small></div></header>
      <div class="tk-titulo"><span>Ticket de empeño</span><span class="ds-tag ds-tag--verde">Contrato vigente</span></div>
      <div class="tk-folio"><small>Número de contrato</small><b>${esc(c.folio)}</b>${barras(c.folio)}</div>
      <div class="tk-meta"><span>${esc(c.fecha)} · ${esc(c.hora)}</span><span>${esc(c.caja)}</span><span>Op. ${esc(c.operacion || '—')}</span></div>
      <section class="tk-bloque"><h4>Cliente</h4><p><b>${esc(cli.nombre)}</b></p><p>NUC ${esc(nucDe(cli))} · INE •••• ${esc(String(cli.nuc || '0000').replace(/\D/g, '').slice(-4))}</p></section>
      <section class="tk-bloque"><h4>Prendas (${c.articulos.length})</h4>
        ${c.articulos.map((a) => `<div class="tk-prenda">${imgArt(a, 'tk-prenda__img')}<div><b>${esc(a.nombre)}</b><small>${esc(describe(a) || '—')}${a.estado ? ' · ' + esc(a.estado) : ''}</small><div class="tk-fila"><span>Avalúo ${mxn(a.avaluo)}</span><span>Préstamo ${mxn(a.prestamo)}</span></div></div></div>`).join('')}
      </section>
      <div class="tk-monto"><small>Préstamo entregado</small><b>${mxn(c.prestamo)} <i>MXN</i></b><span>Plazo ${esc(c.plazo.nombre)} · ${c.plazo.pct} % · vence el <b>${esc(c.fechaLimite)}</b></span></div>
      <div class="tk-dos"><div><small>Para refrendar</small><b>${mxn(c.refrendo)}</b></div><div><small>Para desempeñar</small><b>${mxn(c.desempeno)}</b></div></div>
      ${c.pagos.length > 1 ? `<section class="tk-bloque"><h4>Calendario de pagos</h4>${c.pagos.map((p) => `<div class="tk-fila"><span>${esc(p.fecha)}</span><span>Ref. ${mxn(p.refrendo)}</span><span>Des. ${mxn(p.desempeno)}</span></div>`).join('')}</section>` : ''}
      ${entrega ? `<section class="tk-bloque"><h4>Entrega del préstamo</h4>${entrega}</section>` : ''}
      <section class="tk-bloque tk-firma">${firma ? `<img src="${firma.img}" alt="Firma de ${esc(cli.nombre)}" /><span class="tk-firma__l"></span><small>${ic('check', 12)} Contrato firmado digitalmente el ${esc(firma.fecha)} a las ${esc(firma.hora)}</small>`
        : `<span class="tk-firma__vacio"></span><span class="tk-firma__l"></span><small>Firma del cliente</small>`}</section>
      <div class="tk-qr"><span class="tk-qr__c">${QR}</span><div><b>Refrenda o desempeña en línea</b><small>${esc(E.web)}</small></div></div>
      <p class="tk-legal">Conserva este ticket: lo necesitas para refrendar o desempeñar. Contrato de adhesión RPCA ${esc(E.rpca)}. Dudas: ${esc(E.telefono)} · ${esc(E.correo)}. PROFECO 800 468 8722.</p>
      <p class="tk-gracias">¡Gracias por tu confianza!</p>
    </article>`;
  }

  /* ---------- capa modal propia (no usa #pasModal: el ticket y la firma pueden abrirse uno sobre otro) ---------- */
  let capa = null, previo = null, alCerrarCapa = null;
  const toast = (tipo, titulo, texto) => {
    const reg = document.getElementById('pasToasts') || document.body;
    reg.querySelectorAll('.ds-toast').forEach((x) => x.remove());
    const t = document.createElement('div');
    t.className = 'ds-toast ds-toast--' + tipo; t.setAttribute('role', 'status');
    t.innerHTML = `<span class="ds-toast__icon" aria-hidden="true">${ic('check', 16)}</span><div class="ds-toast__body-wrap"><p class="ds-toast__title">${esc(titulo)}</p>${texto ? `<p class="ds-toast__body">${esc(texto)}</p>` : ''}</div><button type="button" class="ds-toast__close" aria-label="Cerrar aviso">${ic('close', 16)}</button>`;
    t.querySelector('.ds-toast__close').addEventListener('click', () => t.remove());
    reg.appendChild(t); setTimeout(() => t.remove(), 5000);
  };
  const enfocables = (box) => [...box.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex="0"], canvas')].filter((x) => x.offsetParent !== null);
  function teclas(e) {
    if (!capa) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); cerrar(); return; }
    if (e.key !== 'Tab') return;
    const box = capa.querySelector('.cf-modal'), f = enfocables(box);
    if (!f.length) { e.preventDefault(); box.focus(); return; }
    const i = f.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && (i === f.length - 1 || i < 0)) { e.preventDefault(); f[0].focus(); }
  }
  function abrir({ clase, titulo, sub, cuerpo, pie, alCerrar }) {
    if (!capa) previo = document.activeElement;
    cerrar(true);
    alCerrarCapa = alCerrar || null;
    capa = document.createElement('div');
    capa.className = 'cf-ov';
    capa.innerHTML = `<div class="cf-modal ${clase || ''}" role="dialog" aria-modal="true" aria-labelledby="cfTitulo" ${sub ? 'aria-describedby="cfSub"' : ''} tabindex="-1">
        <header class="cf-modal__head"><div><h2 id="cfTitulo">${titulo}</h2>${sub ? `<p id="cfSub">${sub}</p>` : ''}</div>
          <button class="ds-btn ds-btn--tertiary ds-btn--icon-md cf-x" type="button" data-cf="cerrar" aria-label="Cerrar">${ic('close', 24)}</button></header>
        <div class="cf-modal__body">${cuerpo}</div>
        ${pie ? `<footer class="cf-modal__pie">${pie}</footer>` : ''}
      </div>`;
    document.body.appendChild(capa);
    document.documentElement.classList.add('cf-abierto');
    document.addEventListener('keydown', teclas, true);
    capa.addEventListener('mousedown', (e) => { if (e.target === capa) cerrar(); });
    capa.querySelector('[data-cf="cerrar"]').addEventListener('click', () => cerrar());
    return capa.querySelector('.cf-modal');
  }
  function cerrar(sinFoco) {
    if (!capa) return;
    capa.remove(); capa = null;
    document.documentElement.classList.remove('cf-abierto');
    document.removeEventListener('keydown', teclas, true);
    window.removeEventListener('resize', alRedimensionar);
    const fn = alCerrarCapa; alCerrarCapa = null;
    if (sinFoco) return;
    if (fn) fn();
    if (previo && document.contains(previo)) previo.focus();
    else window.dispatchEvent(new CustomEvent('ats-contrato-cerrado'));
  }

  /* ---------- pad de firma (pointer events: dedo, pluma o mouse) ---------- */
  let alRedimensionar = () => {};
  function padFirma(canvas, alCambiar) {
    const ctx = canvas.getContext('2d');
    const trazos = []; let actual = null;
    const color = getComputedStyle(document.documentElement).getPropertyValue('--ats-primary-400').trim() || 'currentColor';
    const tamano = () => {
      const r = canvas.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(r.width * dpr)); canvas.height = Math.max(1, Math.round(r.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); pintar();
    };
    const punto = (e) => { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height, p: e.pressure || 0.5 }; };
    function linea(t) {
      const r = canvas.getBoundingClientRect(), W = r.width, H = r.height;
      if (t.length === 1) { ctx.beginPath(); ctx.arc(t[0].x * W, t[0].y * H, 1.4, 0, Math.PI * 2); ctx.fill(); return; }
      ctx.beginPath(); ctx.moveTo(t[0].x * W, t[0].y * H);
      for (let i = 1; i < t.length - 1; i++) {
        const mx = (t[i].x + t[i + 1].x) / 2, my = (t[i].y + t[i + 1].y) / 2;
        ctx.lineWidth = 1.6 + (t[i].p || 0.5) * 1.6;
        ctx.quadraticCurveTo(t[i].x * W, t[i].y * H, mx * W, my * H);
      }
      const z = t[t.length - 1]; ctx.lineTo(z.x * W, z.y * H); ctx.stroke();
    }
    function pintar() {
      const r = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, r.width, r.height);
      ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 2.4;
      trazos.forEach(linea);
    }
    const largo = () => { const r = canvas.getBoundingClientRect(); let s = 0; trazos.forEach((t) => { for (let i = 1; i < t.length; i++) s += Math.hypot((t[i].x - t[i - 1].x) * r.width, (t[i].y - t[i - 1].y) * r.height); }); return s; };
    canvas.addEventListener('pointerdown', (e) => {
      if (e.button > 0) return;
      e.preventDefault(); canvas.setPointerCapture(e.pointerId);
      actual = [punto(e)]; trazos.push(actual); pintar(); alCambiar();
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!actual) return;
      (e.getCoalescedEvents ? e.getCoalescedEvents() : [e]).forEach((ev) => actual.push(punto(ev)));
      pintar();
    });
    const fin = () => { if (actual) { actual = null; alCambiar(); } };
    canvas.addEventListener('pointerup', fin); canvas.addEventListener('pointercancel', fin);
    alRedimensionar = tamano; window.addEventListener('resize', tamano);
    requestAnimationFrame(tamano);
    return {
      vacia: () => largo() < 40,   // menos de 40 px de trazo no cuenta como firma (un toque accidental)
      borrar: () => { trazos.length = 0; pintar(); alCambiar(); },
      imagen: () => canvas.toDataURL('image/png'),
    };
  }

  /* ---------- modal "Firmar contrato" ---------- */
  function firmar({ recibo, folio, alCambiar }) {
    const contratos = contratosDe(recibo);
    if (!contratos.length) return;
    recibo.firmas = recibo.firmas || {};
    const c = contratos.find((x) => x.folio === folio) || contratos.find((x) => !firmaDe(recibo, x.folio)) || contratos[0];
    if (firmaDe(recibo, c.folio)) { ver({ recibo, folio: c.folio }); return; }
    const idx = contratos.indexOf(c);
    const st = { leido: false, acepta: false, pad: null };
    const selector = contratos.length > 1 ? `<div class="cf-contratos" role="group" aria-label="Contratos de esta transacción">${contratos.map((x, i) =>
      `<button type="button" class="ds-chip ds-chip--choice${x === c ? ' is-on' : ''}" data-cf="contrato" data-folio="${esc(x.folio)}" aria-pressed="${x === c}">${esc(x.folio)}${firmaDe(recibo, x.folio) ? ' · firmado' : ''}</button>`).join('')}</div>` : '';
    const box = abrir({
      clase: 'cf-modal--firma',
      titulo: 'Firmar contrato',
      sub: `Contrato ${esc(c.folio)} · ${esc(c.cliente.nombre)}${contratos.length > 1 ? ` · ${idx + 1} de ${contratos.length}` : ''}`,
      cuerpo: `<div class="cf-firmar">
          <div class="cf-doc" tabindex="0" aria-label="Contrato para leer. Desplázate hasta el final." id="cfDoc">${selector}${contratoHTML(c, null)}</div>
          <aside class="cf-panel" aria-label="Firma del cliente">
            <section class="cf-paso" id="cfPasoLeer">
              <div class="cf-paso__head"><span class="cf-num" aria-hidden="true">1</span><h3>Lee el contrato con el cliente</h3></div>
              <div class="ds-progress" role="progressbar" aria-label="Lectura del contrato" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="cfProg"><div class="ds-progress__bar" style="width:0%"></div></div>
              <p class="cf-ayuda" id="cfLeerTxt">Desplázate hasta el final del contrato.</p>
              <button type="button" class="ds-btn ds-btn--tertiary ds-btn--sm cf-ir" data-cf="final">${ic('abajo', 16)}Ir al final</button>
            </section>
            <dl class="cf-resumen">
              <div><dt>Préstamo</dt><dd><b>${mxn(c.prestamo)}</b></dd></div>
              <div><dt>Fecha límite</dt><dd>${esc(c.fechaLimite)}</dd></div>
              <div><dt>Para refrendar</dt><dd>${mxn(c.refrendo)}</dd></div>
              <div><dt>Para desempeñar</dt><dd>${mxn(c.desempeno)}</dd></div>
              <div><dt>Prendas</dt><dd>${c.articulos.length}</dd></div>
            </dl>
            <section class="cf-paso">
              <div class="cf-paso__head"><span class="cf-num" aria-hidden="true">2</span><h3>Acepta los términos</h3></div>
              <label class="ds-check cf-acepta"><input type="checkbox" id="cfAcepta" /><span class="ds-check__wrap"><span class="ds-check__box"></span></span><span class="ds-check__text">${esc(c.cliente.nombre)} leyó el contrato, recibió la explicación del préstamo y acepta sus términos.</span></label>
            </section>
            <section class="cf-paso">
              <div class="cf-paso__head"><span class="cf-num" aria-hidden="true">3</span><h3 id="cfFirmaT">Firma del cliente</h3>
                <button type="button" class="ds-btn ds-btn--tertiary ds-btn--sm cf-borrar" data-cf="borrar" disabled>${ic('borrar', 16)}Borrar</button></div>
              <div class="cf-pad"><canvas id="cfPad" aria-labelledby="cfFirmaT" aria-describedby="cfPadAyuda" role="img"></canvas><span class="cf-pad__x" aria-hidden="true">✕</span><span class="cf-pad__l" aria-hidden="true"></span><span class="cf-pad__ph" aria-hidden="true">Firma aquí con el dedo o la pluma</span></div>
              <p class="cf-ayuda" id="cfPadAyuda">${esc(c.cliente.nombre)} firma dentro del recuadro.</p>
            </section>
            <p class="cf-falta" id="cfFalta" aria-live="polite"></p>
          </aside>
        </div>`,
      pie: `<button type="button" class="ds-btn ds-btn--md ds-btn--tertiary" data-cf="cerrar2">Firmar después</button>
        <button type="button" class="ds-btn ds-btn--md ds-btn--primary cf-btn-ico" data-cf="firmar" id="cfFirmar" disabled>${ic('firma', 20)}Firmar contrato</button>`,
    });
    const $ = (id) => box.querySelector('#' + id);
    const doc = $('cfDoc'), prog = $('cfProg'), btn = $('cfFirmar');
    const faltan = () => [!st.leido && 'leer el contrato hasta el final', !st.acepta && 'aceptar los términos', (!st.pad || st.pad.vacia()) && 'la firma del cliente'].filter(Boolean);
    const actualizar = () => {
      const f = faltan();
      btn.disabled = f.length > 0;
      $('cfFalta').textContent = f.length ? 'Para firmar falta: ' + f.join(', ') + '.' : 'Todo listo para firmar.';
      $('cfFalta').classList.toggle('is-ok', !f.length);
      box.querySelector('[data-cf="borrar"]').disabled = !st.pad || st.pad.vacia();
      box.querySelector('.cf-pad').classList.toggle('is-firmado', !!st.pad && !st.pad.vacia());
    };
    const leer = () => {
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max <= 4 ? 100 : Math.min(100, Math.round(doc.scrollTop / max * 100));
      prog.querySelector('.ds-progress__bar').style.width = pct + '%';
      prog.setAttribute('aria-valuenow', String(pct));
      if (pct >= 98 && !st.leido) {
        st.leido = true;
        prog.classList.add('ds-progress--success');
        $('cfLeerTxt').innerHTML = `${ic('check', 16)} Llegaste al final del contrato.`;
        $('cfLeerTxt').classList.add('is-ok');
        box.querySelector('[data-cf="final"]').hidden = true;
        actualizar();
      }
    };
    doc.addEventListener('scroll', leer, { passive: true });
    doc.addEventListener('scrollend', leer);
    $('cfAcepta').addEventListener('change', (e) => { st.acepta = e.target.checked; actualizar(); });
    st.pad = padFirma($('cfPad'), actualizar);
    box.addEventListener('click', (e) => {
      const t = e.target.closest('[data-cf]');
      if (!t || t.disabled) return;
      const a = t.dataset.cf;
      if (a === 'final') { doc.scrollTo({ top: doc.scrollHeight, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); doc.focus({ preventScroll: true }); setTimeout(leer, 700); }
      if (a === 'borrar') { st.pad.borrar(); $('cfPad').focus(); }
      if (a === 'cerrar2') cerrar();
      if (a === 'contrato') firmar({ recibo, folio: t.dataset.folio, alCambiar });
      if (a === 'firmar') {
        const ahora = new Date();
        const hash = Array.from({ length: 4 }, (_, k) => (Math.abs((c.folio + ahora.getTime() + k).split('').reduce((h, ch) => ((h << 5) - h + ch.charCodeAt(0)) | 0, 7)) % 65536).toString(16).toUpperCase().padStart(4, '0')).join('-');
        recibo.firmas[c.folio] = { img: st.pad.imagen(), fecha: ddmmaaaa(ahora), hora: hhmm(ahora), hash };
        if (alCambiar) alCambiar();
        const sig = contratos.find((x) => !firmaDe(recibo, x.folio));
        toast('success', 'Contrato firmado', `${c.folio} quedó firmado por ${c.cliente.nombre}.`);
        ver({ recibo, folio: c.folio, siguiente: sig ? sig.folio : null, alCambiar });
      }
    });
    actualizar();
    requestAnimationFrame(leer);
    box.focus();
  }

  /* ---------- contrato firmado (solo lectura) ---------- */
  function ver({ recibo, folio, siguiente, alCambiar }) {
    const contratos = contratosDe(recibo);
    const c = contratos.find((x) => x.folio === folio) || contratos[0];
    if (!c) return;
    const f = firmaDe(recibo, c.folio);
    const box = abrir({
      clase: 'cf-modal--ver',
      titulo: f ? 'Contrato firmado' : 'Contrato',
      sub: `Contrato ${esc(c.folio)} · ${esc(c.cliente.nombre)}${f ? ` · firmado el ${esc(f.fecha)} a las ${esc(f.hora)}` : ''}`,
      cuerpo: `${f ? `<div class="ds-alert ds-alert--success cf-alerta" role="status"><span class="ds-alert__icon" aria-hidden="true">${ic('check', 20)}</span><div class="ds-alert__body-wrap"><p class="ds-alert__title">El contrato quedó firmado</p><p class="ds-alert__body">La firma ya está en el contrato y en el ticket de empeño. Entrégale una copia al cliente.</p></div></div>` : ''}
        <div class="cf-doc cf-doc--ver" tabindex="0" aria-label="Contrato ${esc(c.folio)}">${contratoHTML(c, f)}</div>`,
      pie: `<button type="button" class="ds-btn ds-btn--md ds-btn--secondary cf-btn-ico" data-cf="correo">${ic('correo', 20)}Enviar por correo</button>
        <button type="button" class="ds-btn ds-btn--md ds-btn--secondary cf-btn-ico" data-cf="pdf">${ic('descargar', 20)}Descargar PDF</button>
        ${siguiente ? `<button type="button" class="ds-btn ds-btn--md ds-btn--primary cf-btn-ico" data-cf="siguiente">${ic('firma', 20)}Firmar ${esc(siguiente)}</button>`
          : `<button type="button" class="ds-btn ds-btn--md ds-btn--primary" data-cf="listo">Listo</button>`}`,
    });
    box.addEventListener('click', (e) => {
      const t = e.target.closest('[data-cf]');
      if (!t) return;
      const a = t.dataset.cf;
      if (a === 'pdf') toast('success', 'Descargando contrato', `Contrato_${c.folio}.pdf`);
      if (a === 'correo') toast('success', 'Contrato enviado', c.cliente.correo ? 'Se envió a ' + c.cliente.correo : 'Se envió al correo del cliente.');
      if (a === 'listo') cerrar();
      if (a === 'siguiente') firmar({ recibo, folio: siguiente, alCambiar });
    });
    box.focus();
  }

  /* ---------- modal "Ticket de empeño" ---------- */
  function ticket({ recibo, folio }) {
    const contratos = contratosDe(recibo);
    if (!contratos.length) return;
    let sel = folio || (contratos.length > 1 ? 'todos' : contratos[0].folio);
    const lista = () => (sel === 'todos' ? contratos : contratos.filter((x) => x.folio === sel));
    const tickets = () => lista().map((c) => ticketHTML(c, firmaDe(recibo, c.folio))).join('');
    const box = abrir({
      clase: 'cf-modal--ticket',
      titulo: 'Ticket de empeño',
      sub: contratos.length > 1 ? `${contratos.length} contratos en esta transacción` : `Contrato ${esc(contratos[0].folio)} · ${esc(contratos[0].cliente.nombre)}`,
      cuerpo: `${contratos.length > 1 ? `<label class="ds-field cf-tksel"><span class="ds-label">Ticket</span><select class="ds-select--standalone" data-cf-sel>
          <option value="todos">Todos los tickets por contrato</option>${contratos.map((c) => `<option value="${esc(c.folio)}"${c.folio === sel ? ' selected' : ''}>${esc(c.folio)}</option>`).join('')}</select></label>` : ''}
        <div class="cf-tkarea" id="cfTk">${tickets()}</div>`,
      pie: `<button type="button" class="ds-btn ds-btn--md ds-btn--secondary cf-btn-ico" data-cf="whatsapp">${ic('whatsapp', 20)}WhatsApp</button>
        <button type="button" class="ds-btn ds-btn--md ds-btn--secondary cf-btn-ico" data-cf="pdf">${ic('descargar', 20)}Descargar</button>
        <button type="button" class="ds-btn ds-btn--md ds-btn--primary cf-btn-ico" data-cf="imprimir">${ic('imprimir', 20)}Imprimir ticket</button>`,
    });
    const s = box.querySelector('[data-cf-sel]');
    if (s) { s.value = sel; s.addEventListener('change', () => { sel = s.value; box.querySelector('#cfTk').innerHTML = tickets(); }); }
    box.addEventListener('click', (e) => {
      const t = e.target.closest('[data-cf]');
      if (!t) return;
      const a = t.dataset.cf;
      if (a === 'imprimir') imprimir(tickets());
      if (a === 'pdf') toast('success', 'Descargando ticket', lista().map((c) => 'Ticket_' + c.folio + '.pdf').join(', '));
      if (a === 'whatsapp') { const tel = recibo.cliente && recibo.cliente.telefono; toast('success', 'Ticket enviado', tel ? 'Se envió por WhatsApp al número que termina en ' + String(tel).slice(-4) + '.' : 'Se copió el enlace del ticket.'); }
    });
    box.focus();
  }
  /* imprime solo los tickets (80 mm): una copia fuera del modal que solo se ve en @media print */
  function imprimir(html) {
    const d = document.createElement('div');
    d.className = 'cf-print'; d.innerHTML = html;
    document.body.appendChild(d);
    document.documentElement.classList.add('cf-imprimiendo');
    const quitar = () => { d.remove(); document.documentElement.classList.remove('cf-imprimiendo'); window.removeEventListener('afterprint', quitar); };
    window.addEventListener('afterprint', quitar);
    window.print();
    setTimeout(quitar, 1000);
  }

  window.AtsContrato = { contratosDe, firmar, ver, ticket, firmaDe };
})();
