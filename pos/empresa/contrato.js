/* Configuración de contratos (Administrativo) — marco de la pantalla y pestaña "Datos de la empresa".
   Figma "Suscripción" (J7QvWSiVMKOxDex4x3Wmbj), sección 4621:11178 "V1- Datos de mi empresa":
   formulario 420 (vacío) → 424 / 421 / 422 (llenando) → 425 (lleno), guardado 426, carga 4623:4362,
   errores 4700:11359 (campos vacíos) y 4701:33040 (formato), tooltip 4752:5819.
   Reemplaza la hoja "Datos de empresa" de el equipo en la ruta #datos (alias #contrato y #contratos; la segunda
   pestaña es #datos/diseno). La pestaña "Diseño del contrato" la pinta contrato-diseno.js (window.CtrDiseno):
   aquí solo se le da un contenedor y el contexto (ver ctxDiseno()).
   Lo usa empresa.js: window.CtrContrato.crear(api) devuelve las funciones de la pantalla; los controles
   compartidos del módulo (.inp, .sel-btn, calendario .cal, .phone, .errmsg, .alert) y sus eventos
   (sel / pick / cal-* / input) siguen en empresa.js y guardan en S.f con las claves de CAMPOS. */
(function () {
  'use strict';

  /* ---------- Campos (orden y textos del Figma 420/425) ----------
     t: texto | num (solo dígitos) | fecha (DD/MM/AAAA, no futura) | rfc (12 o 13) | cp (5 dígitos) | sel | tel (10 dígitos) | correo
     g: grupo de la tarjeta. ph: placeholder de las fechas (fecha de ejemplo del Figma). */
  const CAMPOS = [
    {k:'nombreComercial', l:'Nombre comercial', t:'texto', g:'legales'},
    {k:'escrituraNum', l:'Número de escritura pública', t:'num', g:'legales'},
    {k:'escrituraFecha', l:'Fecha de escritura pública', t:'fecha', ph:'01/01/2000', g:'legales'},
    {k:'notarioNum', l:'Número público de notario', t:'num', g:'legales'},
    {k:'folioMercantil', l:'Folio mercantil de inscripción', t:'num', g:'legales'},
    {k:'folioFecha', l:'Fecha de inscripción en el folio mercantil', t:'fecha', ph:'01/01/2019', g:'legales'},
    {k:'rfc', l:'RFC', t:'rfc', g:'legales'},
    {k:'representante', l:'Nombre del representante legal', t:'texto', g:'poder'},
    {k:'testimonioNum', l:'Número de testimonio (poder)', t:'num', g:'poder'},
    {k:'testimonioFecha', l:'Fecha de testimonio (poder)', t:'fecha', ph:'01/01/2019', g:'poder'},
    {k:'notarioPoderNum', l:'Número de notario (poder)', t:'num', g:'poder'},
    {k:'notarioPoderNombre', l:'Nombre de notario público (poder)', t:'texto', g:'poder'},
    {k:'calle', l:'Calle', t:'texto', g:'direccion'},
    {k:'numExt', l:'Número ext.', t:'texto', g:'direccion'},
    {k:'numInt', l:'Número int.', t:'texto', g:'direccion', opcional:true},
    {k:'cp', l:'Código postal', t:'cp', g:'direccion'},
    {k:'municipio', l:'Alcaldía o municipio', t:'sel', g:'direccion'},
    {k:'colonia', l:'Colonia', t:'sel', g:'direccion'},
    {k:'telefono', l:'Teléfono', t:'tel', g:'direccion'},
    {k:'correo', l:'Correo electrónico', t:'correo', g:'direccion'},
    {k:'rpcaNum', l:'Número de registro RPCA', t:'texto', g:'cierre', ayuda:'Registro Público de Contratos de Adhesión'},
    {k:'rpcaFecha', l:'Fecha de registro RPCA', t:'fecha', ph:'01/01/2024', g:'cierre'}
  ];
  const TARJETAS = [
    {id:'legales', titulo:'Datos legales', grupos:['legales', 'poder']},
    {id:'direccion', titulo:'Dirección fiscal', grupos:['direccion']},
    {id:'cierre', titulo:'Cierre del contrato', grupos:['cierre']}
  ];
  /* claves que recibe el diseño del contrato (ctx.empresa): las del formulario + Estado, que sale del código postal */
  const CLAVES = CAMPOS.map(c => c.k).concat('estado');
  /* Contrato nuevo: Nombre comercial y RFC salen de los datos que la empresa dio al crear su cuenta (useSignupPrefill de el equipo);
     solo llenan campos vacíos y son el valor inicial, no cuentan como cambios sin guardar. Ficticios: el archivo se publica. */
  const CUENTA = {nombreComercial:'PrestaYa', rfc:'PYS010101ABC'};
  const vacio = () => CLAVES.reduce((o, k) => { o[k] = CUENTA[k] || ''; return o; }, {});

  /* Datos de ejemplo del Figma (§1.6 del SPEC). Ficticios: el archivo se publica. */
  const EJEMPLO = {
    nombreComercial:'PrestaYa', escrituraNum:'123', escrituraFecha:'01/01/2000', notarioNum:'123', folioMercantil:'123',
    folioFecha:'01/01/2019', rfc:'PYS010101ABC', representante:'Maria Gomez', testimonioNum:'123', testimonioFecha:'01/01/2019',
    notarioPoderNum:'345', notarioPoderNombre:'Luis Ramírez', calle:'Londres', numExt:'247', numInt:'', cp:'04100',
    municipio:'Coyoacán', colonia:'Del Carmen', estado:'Ciudad de México', telefono:'55 1234 5678', correo:'correo@email.com',
    rpcaNum:'12345', rpcaFecha:'01/01/2024'
  };
  const OBLIG = 'Campo obligatorio';
  const MSG_FORMATO = {
    num:'Ingresa solo números',
    futura:'La fecha no puede ser futura',
    fecha:'Escribe la fecha como DD/MM/AAAA',   /* no está en el Figma: fecha incompleta o que no existe (31/02) */
    rfc:'El RFC debe tener 12 o 13 caracteres',
    cp:'El código postal debe tener 5 dígitos',
    tel:'El teléfono debe tener 10 dígitos',
    correo:'Formato de correo no válido'
  };

  /* estado propio de la pantalla (vive en S.ctr; empresa.js lo crea en initialState) */
  const estadoInicial = () => ({
    tab:'empresa',       /* 'empresa' | 'diseno' */
    modo:'carga',        /* pestaña 1: 'carga' | 'edicion' | 'guardado' */
    cargado:false,       /* la carga simulada (frame Loading) solo pasa la primera vez */
    cargaFija:false,     /* "Cargando" desde el panel Prototipo: se queda hasta elegir otro estado */
    guardados:null,      /* copia de S.f al guardar; null = nunca se ha guardado */
    editando:false,      /* se abrió "Editar" sobre datos guardados */
    disenoDirty:false,   /* el diseño tiene cambios sin guardar (lo avisa contrato-diseno.js por ctx.onChange) */
    disenoSync:true,     /* volver a llamar CtrDiseno.render en el próximo render (cambió la pestaña o los datos) */
    disenoProto:''       /* último estado del diseño pedido desde el panel Prototipo (para mostrarlo en su select) */
  });

  function crear(api) {
    const {ic, esc, flag, btn, note} = api;
    const st = () => api.S;
    let disenoEl = null, cargaT = null, guardarT = null;

    const campo = (k) => CAMPOS.find(c => c.k === k);
    const camposTarjeta = (t) => CAMPOS.filter(c => t.grupos.indexOf(c.g) > -1);
    const tarjetaDe = (k) => { const c = campo(k); return c ? TARJETAS.find(t => t.grupos.indexOf(c.g) > -1) : null; };
    const hoyFin = () => { const d = new Date(); d.setHours(23, 59, 59, 999); return d; };
    const pad = (n) => String(n).padStart(2, '0');

    /* ---------- Validación (SPEC §2) ---------- */
    function formato(c, v) {
      const S = st();
      switch (c.t) {
        case 'num': return /^\d+$/.test(v) ? '' : MSG_FORMATO.num;
        case 'fecha': { const d = api.parseFecha(v); if (!d) return MSG_FORMATO.fecha; return d > hoyFin() ? MSG_FORMATO.futura : ''; }
        case 'rfc': return /^[A-ZÑ&0-9]{12,13}$/.test(v.toUpperCase()) ? '' : MSG_FORMATO.rfc;
        case 'cp': {
          if (!/^\d{5}$/.test(v)) return MSG_FORMATO.cp;
          /* el servicio dijo que no existe (copy de el equipo, no está en el Figma) */
          return api.lookupCP(v) ? '' : (S.cpLoading ? '' : 'No se encontró este código postal. Revisa los 5 dígitos.');
        }
        case 'tel': return v.replace(/\D/g, '').length === 10 ? '' : MSG_FORMATO.tel;
        case 'correo': return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : MSG_FORMATO.correo;
        default: return '';
      }
    }
    function errorDe(c) {
      const v = String(st().f[c.k] || '').trim();
      if (!v) return c.opcional ? '' : OBLIG;
      return formato(c, v);
    }
    function validar() {
      const e = {};
      CAMPOS.forEach(c => { const m = errorDe(c); if (m) e[c.k] = m; });
      /* Alcaldía y Colonia dependen del código postal: con el CP mal escrito no se marcan (Figma 4701:33040) */
      if (e.cp && e.cp !== OBLIG) { delete e.municipio; delete e.colonia; }
      return e;
    }
    function primerError() {
      const c = CAMPOS.find(x => st().errors[x.k]);
      return c ? document.getElementById('f-' + c.k) : null;
    }
    /* después de un "Guardar cambios" con errores: el foco va al primer campo con error. La página solo se mueve si ese campo
       o el aviso de su tarjeta no se ven; entonces la tarjeta queda 16 px bajo el header (título y aviso a la vista), o el
       campo 40 px bajo el header si la tarjeta no cabe hasta él */
    function irAlError() {
      const el = primerError();
      if (!el) return;
      const t = tarjetaDe(el.id.slice(2)), card = t && document.getElementById('ctr-card-' + t.id);
      const aviso = (card && card.querySelector('.ctr-alerta')) || el;
      const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--pos-header-h')) || 60;
      const alto = window.innerHeight, rCampo = el.getBoundingClientRect(), rAviso = aviso.getBoundingClientRect();
      const foco = () => el.querySelector('input,button')?.focus({preventScroll:true});
      if (rAviso.top >= headerH && rCampo.bottom <= alto) { foco(); return; }
      const arriba = card ? card.getBoundingClientRect().top - headerH - 16 : rCampo.top - headerH - 40;
      const dy = rCampo.bottom - arriba <= alto ? arriba : rCampo.top - headerH - 40;
      window.scrollTo({top:window.scrollY + dy, behavior:'smooth'});
      setTimeout(foco, 350);
    }

    /* ---------- Controles (DS Text input V2, DatePicker, Selection input V2, Phone input) ---------- */
    const errCampo = (k, msg) => msg ? `<div class="errmsg" id="e-${k}">${ic('close', 16)}<span>${esc(msg)}</span></div>` : '';
    const etiqueta = (c, extra) => `${esc(c.l)}${c.opcional ? ' <span class="opt">(opcional)</span>' : ''}${extra || ''}`;
    function campoTexto(c) {
      const S = st(), e = S.errors[c.k];
      const modo = c.t === 'num' || c.t === 'cp' ? 'inputmode="numeric"' : c.t === 'correo' ? 'inputmode="email" autocapitalize="off" spellcheck="false"' : c.t === 'rfc' ? 'autocapitalize="characters" spellcheck="false"' : '';
      const max = c.t === 'rfc' ? 'maxlength="13"' : c.t === 'cp' ? 'maxlength="5"' : '';
      const desc = [e ? 'e-' + c.k : '', c.ayuda ? 'tt-' + c.k : '', c.t === 'cp' && S.cpLoading ? 'h-cp' : ''].filter(Boolean).join(' ');
      const inp = `<input class="inp${e ? ' err' : ''}" id="in-${c.k}" data-f="${c.k}" value="${esc(S.f[c.k])}" ${modo} ${max} autocomplete="off" aria-invalid="${!!e}"${desc ? ` aria-describedby="${desc}"` : ''}>`;
      /* RPCA: ícono de ayuda (?) dentro del campo, con el Tooltip del DS abajo (Figma 4752:5819) */
      const control = c.ayuda ? `<div class="inp-wrap">${inp}<span class="ctr-tip">
          <button type="button" class="ctr-tip__btn" aria-label="Qué es RPCA" aria-describedby="tt-${c.k}">${ic('help', 24)}</button>
          <span class="ctr-tip__box" role="tooltip" id="tt-${c.k}">${esc(c.ayuda)}</span></span></div>` : inp;
      const ayudaCP = c.t === 'cp' && S.cpLoading && !e ? '<div class="help" id="h-cp">Buscando el código postal…</div>' : '';
      return `<div class="field" id="f-${c.k}"><label for="in-${c.k}">${etiqueta(c)}</label>${control}${errCampo(c.k, e)}${ayudaCP}</div>`;
    }
    function campoFecha(c) {
      const S = st(), e = S.errors[c.k], abierto = !!(S.cal && S.cal.key === c.k);
      /* en error el placeholder pasa de la fecha de ejemplo a DD/MM/AAAA, en rojo (Figma 4700:11359) */
      return `<div class="field" id="f-${c.k}"><label for="in-${c.k}">${etiqueta(c)}</label>
        <div class="inp-wrap">
          <input class="inp${e ? ' err' : ''}" id="in-${c.k}" data-f="${c.k}" data-mask="fecha" value="${esc(S.f[c.k])}" placeholder="${e ? 'DD/MM/AAAA' : esc(c.ph)}" inputmode="numeric" maxlength="10" autocomplete="off" aria-invalid="${!!e}"${e ? ` aria-describedby="e-${c.k}"` : ''}>
          <button type="button" class="cal-btn" data-action="cal-toggle" data-key="${c.k}" aria-label="Abrir calendario: ${esc(c.l)}" aria-expanded="${abierto}">${ic('calendar', 24)}</button>
          ${abierto ? api.calendario() : ''}
        </div>${errCampo(c.k, e)}</div>`;
    }
    /* Alcaldía y Colonia: opciones del código postal (servicio de QA o tabla local de empresa.js).
       Si el código postal se conoce pero no trae la lista, el campo pasa a texto (como en la hoja de el equipo). */
    function campoSelect(c) {
      const S = st(), e = S.errors[c.k], info = S.f.cp && /^\d{5}$/.test(S.f.cp) && !S.cpLoading ? api.lookupCP(S.f.cp) : null;
      const ops = !info ? [] : c.k === 'municipio' ? (info.municipio ? [info.municipio] : []) : info.colonias;
      if (info && !ops.length) return campoTexto(Object.assign({}, c, {t:'texto'}));
      const val = S.f[c.k], abierto = S.openSel === c.k;
      const lista = ops.length ? ops.map(op => `<li role="option" tabindex="-1" aria-selected="${op === val}" data-action="pick" data-key="${c.k}" data-val="${esc(op)}">${esc(op)}</li>`).join('')
        : `<li role="option" aria-disabled="true">${S.cpLoading ? 'Buscando el código postal…' : 'Escribe primero el código postal'}</li>`;
      return `<div class="field" id="f-${c.k}"><span class="lbl" id="l-${c.k}">${etiqueta(c)}</span>
        <div style="position:relative">
          <button type="button" class="sel-btn${e ? ' err' : ''}" id="in-${c.k}" data-action="sel" data-key="${c.k}" aria-haspopup="listbox" aria-expanded="${abierto}" aria-labelledby="l-${c.k} in-${c.k}" aria-invalid="${!!e}"${e ? ` aria-describedby="e-${c.k}"` : ''}>
            ${val ? esc(val) : '<span class="ph">Selecciona</span>'}${ic('down', 24)}
          </button>
          ${abierto ? `<ul class="menu-list" role="listbox" aria-labelledby="l-${c.k}">${lista}</ul>` : ''}
        </div>${errCampo(c.k, e)}</div>`;
    }
    /* Teléfono: bandera de México y +52 fijos a la izquierda (Figma: sin selector de país) */
    function campoTel(c) {
      const S = st(), e = S.errors[c.k];
      return `<div class="field" id="f-${c.k}"><label for="in-${c.k}">${etiqueta(c, '<span class="sr"> (lada +52)</span>')}</label>
        <div class="phone ctr-tel${e ? ' err' : ''}"><span class="pre" aria-hidden="true">${flag('mexico', 28)}<span>+52</span></span>
          <input id="in-${c.k}" data-f="${c.k}" value="${esc(S.f[c.k])}" inputmode="numeric" maxlength="12" autocomplete="off" aria-invalid="${!!e}"${e ? ` aria-describedby="e-${c.k}"` : ''}></div>
        ${errCampo(c.k, e)}</div>`;
    }
    const control = (c) => c.t === 'fecha' ? campoFecha(c) : c.t === 'sel' ? campoSelect(c) : c.t === 'tel' ? campoTel(c) : campoTexto(c);
    const rejilla = (g) => `<div class="ctr-grid">${CAMPOS.filter(c => c.g === g).map(control).join('')}</div>`;

    /* Alert del DS (error) debajo del título de cada tarjeta con errores: "Completa…" si falta algo, si no "Revisa…" */
    function alerta(t) {
      const S = st(), ks = camposTarjeta(t).filter(c => S.errors[c.k]);
      if (!ks.length) return '';
      const faltan = ks.some(c => S.errors[c.k] === OBLIG);
      return `<div class="ds-alert ds-alert--error ctr-alerta" role="alert"><span class="ds-alert__icon">${ic('error', 24)}</span><div class="ds-alert__body-wrap"><span class="ds-alert__title">${faltan ? 'Completa los campos marcados para continuar' : 'Revisa los campos marcados para continuar'}</span></div></div>`;
    }
    function tarjetaForm(t) {
      const cuerpo = t.id === 'legales'
        ? `${rejilla('legales')}<hr class="ctr-div"><h3 class="ctr-sub">Datos del poder del representante:</h3>${rejilla('poder')}`
        : rejilla(t.grupos[0]);
      return `<section class="card ctr-card" id="ctr-card-${t.id}" aria-labelledby="ctr-h-${t.id}">
        <h2 class="ctr-card__t" id="ctr-h-${t.id}">${t.titulo}</h2>${alerta(t)}${cuerpo}</section>`;
    }

    /* ---------- Solo lectura (frame 426 "Cambios Guardados") ----------
       Mismas etiquetas y orden del formulario (el 426 trae otros nombres: pregunta abierta) + Estado después de Colonia. */
    function dato(l, v, opcional) {
      return `<div class="ctr-dato"><dt>${esc(l)}${opcional ? ' <span class="opt">(opcional)</span>' : ''}</dt><dd>${String(v || '').trim() ? esc(v) : '—'}</dd></div>`;
    }
    function rejillaLectura(g) {
      const f = st().f;
      let items = CAMPOS.filter(c => c.g === g).map(c => dato(c.l, c.k === 'telefono' && f.telefono ? '+52 ' + f.telefono : f[c.k], c.opcional));
      if (g === 'direccion') items.splice(CAMPOS.filter(c => c.g === g).findIndex(c => c.k === 'colonia') + 1, 0, dato('Estado', f.estado));
      return `<dl class="ctr-grid ctr-ro">${items.join('')}</dl>`;
    }
    function tarjetaLectura(t) {
      const cuerpo = t.id === 'legales'
        ? `${rejillaLectura('legales')}<hr class="ctr-div"><h3 class="ctr-sub">Datos del poder del representante:</h3>${rejillaLectura('poder')}`
        : rejillaLectura(t.grupos[0]);
      return `<section class="card ctr-card" id="ctr-card-${t.id}" aria-labelledby="ctr-h-${t.id}">
        <h2 class="ctr-card__t" id="ctr-h-${t.id}">${t.titulo}</h2>${cuerpo}</section>`;
    }

    /* ---------- Carga (frame "Loading" 4623:4362): 4 tarjetas con bloques Skeleton y los botones abajo ---------- */
    function esqueleto() {
      const sk = (cls) => `<span class="ds-skeleton ctr-sk ${cls}"></span>`;
      const tarjeta = (n) => `<section class="card ctr-card" aria-hidden="true">${sk('ctr-sk--t')}<div class="ctr-grid">${Array.from({length:n}, () => sk('ctr-sk--c')).join('')}</div></section>`;
      return `<span class="sr" role="status">Cargando los datos de contrato…</span>
        <section class="card ctr-card ctr-sk-a" aria-hidden="true">${sk('ctr-sk--logo')}<span class="ctr-sk-lineas">${sk('ctr-sk--t')}${sk('ctr-sk--s')}</span></section>
        ${tarjeta(6)}${tarjeta(6)}${tarjeta(2)}
        <div class="ctr-pie" inert>${btn('Cancelar', 'tertiary', 'tabindex="-1"')}${btn('Guardar cambios', 'primary', 'tabindex="-1"')}</div>`;
    }

    function panelEmpresa() {
      const S = st(), c = S.ctr;
      if (c.modo === 'carga') return esqueleto();
      if (c.modo === 'guardado') {
        return TARJETAS.map(tarjetaLectura).join('') +
          note('Vista guardada (Figma 426): las mismas tarjetas en solo lectura, sin botones abajo. Se vuelve a editar con "Editar", junto a las pestañas (el Figma no lo dibuja).') +
          note('El Figma 426 usa otros nombres y otro orden ("Fecha de constitución", "Folio mercantil", "Nombre de notario", el representante dentro de Datos legales) y valores de relleno. El prototipo repite los campos del formulario y agrega Estado, que sale del código postal. Confirmar cuál es el bueno.', true);
      }
      return TARJETAS.map(tarjetaForm).join('') +
        `<div class="ctr-pie">${btn('Cancelar', 'tertiary', 'data-action="ctr-cancelar"')}${btn('Guardar cambios', 'primary', 'data-action="ctr-guardar"', {loading:S.saving})}</div>` +
        note('Reemplaza la hoja "Datos de empresa" de el equipo. Figma "Suscripción" › V1- Datos de mi empresa (4621:11178). Todo es obligatorio menos Número int.; el formulario empieza vacío (420 → 425), salvo Nombre comercial y RFC, que salen de los datos de la cuenta (como en el React de el equipo).') +
        note('Se valida al guardar. Después, cada campo se vuelve a revisar al salir de él. Primero "Campo obligatorio" y, si ya tiene algo, el formato. El aviso de cada tarjeta dice "Completa…" si falta algo y "Revisa…" si solo hay errores de formato.') +
        note('Código postal → Alcaldía o municipio y Colonia (servicio de QA; sin red, la tabla local). El Estado no se captura: también sale del código postal y aparece en la vista guardada y en el contrato.') +
        note('¿"Número de escritura pública" lleva solo números? El Figma no muestra su error de formato; el prototipo lo valida como los demás números.', true) +
        note('¿Falta la razón social? El contrato dice "PrestaYa S.A. de C.V." y el formulario solo pide el nombre comercial.', true);
    }

    /* ---------- Marco: breadcrumb, título, TabsButton y paneles ---------- */
    function pestanas() {
      const c = st().ctr;
      const tab = (id, l) => `<button type="button" role="tab" class="ctr-tab" id="ctr-tab-${id}" aria-selected="${c.tab === id}" aria-controls="ctr-panel-${id}" tabindex="${c.tab === id ? 0 : -1}" data-action="ctr-tab" data-tab="${id}">${l}</button>`;
      return `<div class="ctr-tabs" role="tablist" aria-label="Configuración de contratos">${tab('empresa', 'Datos de la empresa')}${tab('diseno', 'Diseño del contrato')}</div>`;
    }
    /* guardado: "Editar" (no está en el Figma) y "Continuar a …" con la siguiente tarea de la guía van en la fila de las
       pestañas; en la del título los tapaba el toast de "Cambios guardados" */
    function pantalla() {
      const S = st(), c = S.ctr;
      const guardadoVisible = c.tab === 'empresa' && c.modo === 'guardado';
      const nx = guardadoVisible ? api.siguiente() : null;
      return `<div class="page no-footer ctr" id="ctr">
        <div class="head ctr-head">
          ${api.crumbs([api.HOME, api.GUIA, {l:'Configuración de contratos'}])}
          <div class="head-row ctr-titulo"><h1 class="t-page">Configuración de contratos</h1></div>
        </div>
        <div class="ctr-barra">${pestanas()}${guardadoVisible ? `<div class="ctr-acciones">${btn('Editar', 'tertiary', 'data-action="ctr-editar"', {iconL:'edit'})}${nx ? btn(`Continuar a ${nx.destino || nx.modulo}`, 'primary', `data-go="${nx.id}"`, {iconR:'right'}) : ''}</div>` : ''}</div>
        <div class="ctr-panel" role="tabpanel" id="ctr-panel-empresa" aria-labelledby="ctr-tab-empresa"${c.modo === 'carga' && c.tab === 'empresa' ? ' aria-busy="true"' : ''}${c.tab !== 'empresa' ? ' hidden' : ''}>${c.tab === 'empresa' ? panelEmpresa() : ''}</div>
        <div class="ctr-panel" role="tabpanel" id="ctr-panel-diseno" aria-labelledby="ctr-tab-diseno"${c.tab !== 'diseno' ? ' hidden' : ''}>${c.tab === 'diseno' ? '<div id="ctrDisenoSlot"></div>' : ''}</div>
      </div>`;
    }

    /* ---------- Pestaña "Diseño del contrato": contenedor + contexto para contrato-diseno.js ----------
       window.CtrDiseno.render(contenedor, ctx) se llama al mostrar la pestaña (y cuando cambian los datos desde el panel
       Prototipo). Entre renders de empresa.js el contenedor #ctrDiseno es el mismo nodo: se vuelve a colgar sin repintarlo,
       así el diseño conserva su DOM (foco, scroll, selección). */
    /* al contrato solo pasan los valores bien escritos: un campo con error de formato (p. ej. "C.P. 041" o "+52 55 1234")
       deja su marcador ([Calle, número…], [+52 ### ### ####]); con el código postal mal, tampoco va el Estado que salió de él */
    function datosEmpresa() {
      const f = st().f;
      return CLAVES.reduce((o, k) => {
        const c = campo(k), v = String(f[k] == null ? '' : f[k]).trim();
        o[k] = !v || (c && formato(c, v)) || (k === 'estado' && f.cp && formato(campo('cp'), String(f.cp).trim())) ? '' : v;
        return o;
      }, {});
    }
    const disenoApi = () => { const D = window.CtrDiseno; return D && typeof D.render === 'function' ? D : null; };
    const estadoDiseno = () => { const D = disenoApi(); try { return D && typeof D.estado === 'function' ? D.estado() : null; } catch (e) { return null; } };
    /* ctx de CtrDiseno.render (API en el encabezado de contrato-diseno.js):
       - empresa: copia de los campos de la pestaña 1 (CLAVES; '' si está vacío).
       - guardado: el estado "guardado" del DISEÑO (hoja 427), tal como lo reporta CtrDiseno.estado(); así nunca lo
         contradice. Que la pestaña 1 esté guardada va aparte, en empresaGuardada.
       - onChange: avisos del diseño ({tipo, dirty, estado}).
       - extras: empresaGuardada, toast(tipo, titulo) e irADatos(). El "Editar" de la hoja guardada lo pinta el diseño. */
    function ctxDiseno() {
      const S = st(), e = estadoDiseno();
      return {
        empresa: datosEmpresa(),
        guardado: e ? !!e.guardado : undefined,
        onChange: alCambiarDiseno,
        empresaGuardada: !!S.ctr.guardados,
        toast: (tipo, titulo) => api.toast(tipo === 'info' ? 'info' : 'success', titulo),
        irADatos: () => cambiarTab('empresa', true)
      };
    }
    /* avisos del diseño: {tipo:'cambio'|'guardando'|'guardado'|'editar'|'cancelado'|'salir'|'vista', dirty?, abierta?, estado:{dirty, guardado, vista, diseno}}.
       La vista previa y su modal los pinta el diseño en una capa sobre la página: aquí no se esconde nada. */
    function alCambiarDiseno(ev) {
      const S = st(), c = S.ctr;
      ev = ev || {};
      const e = ev.estado || {};
      if (typeof e.dirty === 'boolean') c.disenoDirty = e.dirty;
      else if (typeof ev.dirty === 'boolean') c.disenoDirty = ev.dirty;
      if (ev.tipo === 'guardado') {
        c.disenoDirty = false;
        /* el logo guardado del contrato también sale en la tarjeta de la empresa de la guía */
        const logo = e.diseno && e.diseno.logo;
        S.logoUrl = logo && logo.url ? logo.url : null;
      }
      if (ev.tipo === 'vista' && !ev.abierta && c.disenoProto === 'vista') c.disenoProto = 'diseno';
      /* Cancelar sin un diseño guardado: igual que Cancelar en la pestaña 1 sin nada guardado, de vuelta a la guía
         (si la pestaña 1 tiene cambios, primero "¿Salir sin guardar?") */
      if (ev.tipo === 'salir') { c.disenoDirty = false; api.navegar('inicio'); return; }
      api.syncProto();
    }
    function montarDiseno() {
      const S = st(), slot = document.getElementById('ctrDisenoSlot');
      if (!slot) return;
      if (!disenoEl) { disenoEl = document.createElement('div'); disenoEl.id = 'ctrDiseno'; disenoEl.className = 'ctr-diseno'; S.ctr.disenoSync = true; }
      slot.replaceWith(disenoEl);
      const D = disenoApi();
      if (!D) {
        disenoEl.innerHTML = '<section class="card ctr-card ctr-diseno-vacio"><span class="t-cap">El editor del diseño del contrato no está disponible en este prototipo.</span></section>';
        return;
      }
      if (!S.ctr.disenoSync) return;
      S.ctr.disenoSync = false;
      try { D.render(disenoEl, ctxDiseno()); }
      catch (err) { console.error('CtrDiseno.render', err); }
    }
    const llamarDiseno = (fn, arg) => { const D = window.CtrDiseno; if (D && typeof D[fn] === 'function') { try { D[fn](arg); } catch (err) { console.error('CtrDiseno.' + fn, err); } } };

    /* ---------- Rutas ---------- */
    /* #datos, #contrato y #contratos abren la pestaña 1; con /diseno, la pestaña 2 */
    function leerHash(h) {
      const m = /^(datos|contratos?)(?:\/(empresa|diseno))?$/.exec(h || '');
      return m ? {tab: m[2] === 'diseno' ? 'diseno' : 'empresa'} : null;
    }
    const hash = () => st().ctr.tab === 'diseno' ? 'datos/diseno' : 'datos';
    /* al entrar a la pantalla (go('datos')): la carga simulada solo la primera vez */
    function entrar(tab) {
      const c = st().ctr;
      c.tab = tab === 'diseno' ? 'diseno' : 'empresa';
      c.cargaFija = false; c.disenoSync = true; c.disenoProto = '';
      if (!c.cargado) {
        /* sin latencia simulada: los datos están al momento (el estado de carga se ve desde el riel, cargaFija) */
        c.cargado = true;
        c.modo = c.guardados ? 'guardado' : 'edicion';
      } else c.modo = c.guardados && !c.editando ? 'guardado' : 'edicion';
    }
    function cambiarTab(tab, foco) {
      const S = st(), c = S.ctr;
      if (tab === c.tab) return;
      c.tab = tab; c.disenoSync = true; c.disenoProto = '';
      S.cal = null; S.openSel = null;
      try { history.replaceState(null, '', '#' + hash()); } catch (e) { /* sin hash */ }
      api.render();
      if (foco) document.getElementById('ctr-tab-' + tab)?.focus();
    }
    /* quita lo que no se guardó (Cancelar → Salir sin guardar, o salir de la pantalla con cambios).
       {soloEmpresa:true}: solo la pestaña 1. Es el Cancelar de "Datos de la empresa" que se queda en la pantalla: el borrador
       de "Diseño del contrato" no es suyo y se conserva (salir de la pantalla sí descarta las dos). */
    function descartar(op) {
      const S = st(), c = S.ctr, soloEmpresa = !!(op && op.soloEmpresa);
      if (S.dirty || c.editando) {
        Object.assign(S.f, c.guardados ? c.guardados : vacio());
        S.errors = {}; S.triedSave = false; S.cal = null; S.openSel = null;
        c.editando = false;
        if (c.modo !== 'carga') c.modo = c.guardados ? 'guardado' : 'edicion';
      }
      if (!soloEmpresa && c.disenoDirty) { llamarDiseno('descartar'); c.disenoDirty = false; c.disenoSync = true; }
      S.dirty = false;
    }

    /* ---------- Acciones (data-action="ctr-…"; las despacha el click de empresa.js) ---------- */
    function accion(act, el) {
      const S = st(), c = S.ctr;
      switch (act) {
        case 'ctr-tab': cambiarTab(el.dataset.tab, true); break;
        case 'ctr-editar':
          c.modo = 'edicion'; c.editando = true; S.errors = {}; S.triedSave = false; S.dirty = false;
          api.render();
          document.getElementById('in-nombreComercial')?.focus();
          break;
        /* Cancelar de la pestaña 1: solo responde por sus datos. Con cambios, "¿Salir sin guardar?" (con datos guardados se
           queda en la vista guardada). Sin cambios y con datos guardados, deja "Editar" sin tocar el diseño. Sin nada guardado
           va a la guía por navegar(), que pregunta si el diseño tiene cambios. */
        case 'ctr-cancelar':
          if (S.dirty) { S.modal = {type:'cancel', to:'inicio', quedarse:!!c.guardados}; api.renderLayer(); break; }
          if (c.guardados) { descartar({soloEmpresa:true}); api.render(); break; }
          api.navegar('inicio');
          break;
        case 'ctr-guardar': {
          S.cal = null; S.openSel = null;
          S.triedSave = true; S.errors = validar();
          if (Object.keys(S.errors).length) { api.render(); irAlError(); break; }
          /* se guarda lo que se validó, aunque mientras carga se salga de la pantalla (go() descarta S.f) o se escriba */
          const datos = Object.assign({}, S.f);
          S.saving = true;
          clearTimeout(guardarT);
          guardarT = (() => {
            const S2 = st(), aqui = S2.route === 'datos';
            S2.saving = false;
            Object.assign(S2.f, datos);
            S2.ctr.guardados = datos;
            S2.ctr.modo = 'guardado'; S2.ctr.editando = false; S2.ctr.disenoSync = true;
            if (aqui) { S2.dirty = false; S2.errors = {}; S2.triedSave = false; }
            S2.done.datos = true; S2.justDone = 'datos';
            api.render();
            if (aqui) window.scrollTo({top:0});
            /* un solo aviso en la esquina: si quedara otro arriba, la columna de toasts taparía "Editar" y "Continuar a …" */
            document.getElementById('toasts')?.replaceChildren();
            api.toast('success', 'Cambios guardados');
          })();
          break;
        }
      }
    }

    /* ---------- Revalidar al salir de un campo (después del primer "Guardar cambios") ---------- */
    /* el Alert solo se toca si cambia su texto: si se volviera a insertar igual, el lector de pantalla lo repetiría */
    function pintarAlerta(t) {
      const card = document.getElementById('ctr-card-' + t.id);
      if (!card) return;
      const html = alerta(t), actual = card.querySelector('.ctr-alerta');
      if (actual) {
        if (!html) actual.remove();
        else { const nuevo = /<span class="ds-alert__title">([^<]*)</.exec(html)[1], at = actual.querySelector('.at'); if (at && at.textContent !== nuevo) actual.outerHTML = html; }
      } else if (html) card.querySelector('.ctr-card__t').insertAdjacentHTML('afterend', html);
    }
    /* pone o quita el error de un campo sobre el mismo nodo (clase .err, aria-invalid, aria-describedby y el .errmsg), como
       hace empresa.js al teclear. No se reemplaza el campo: focusout llega en el mousedown y, si el control que está bajo
       el puntero (p. ej. el botón de Colonia) se cambiara por otro, el clic que viene en camino se perdería. */
    function pintarCampo(c) {
      const fld = document.getElementById('f-' + c.k), ctl = document.getElementById('in-' + c.k);
      if (fld && ctl) {
        const e = st().errors[c.k] || '', id = 'e-' + c.k;
        (ctl.closest('.phone') || ctl).classList.toggle('err', !!e);
        ctl.setAttribute('aria-invalid', String(!!e));
        const desc = (ctl.getAttribute('aria-describedby') || '').split(' ').filter(x => x && x !== id);
        if (e) desc.unshift(id);
        if (desc.length) ctl.setAttribute('aria-describedby', desc.join(' ')); else ctl.removeAttribute('aria-describedby');
        if (ctl.dataset.mask === 'fecha') ctl.placeholder = e ? 'DD/MM/AAAA' : (c.ph || '');
        const msg = fld.querySelector('.errmsg');
        if (!e) { if (msg) msg.remove(); }
        else if (msg) { const span = msg.querySelector('span'); if (span && span.textContent !== e) span.textContent = e; }
        else {
          let caja = ctl; while (caja.parentElement && caja.parentElement !== fld) caja = caja.parentElement;
          caja.insertAdjacentHTML('afterend', errCampo(c.k, e));
          fld.querySelector('#h-cp')?.remove();   /* con error no va "Buscando el código postal…" (como campoTexto) */
        }
      }
      const t = tarjetaDe(c.k); if (t) pintarAlerta(t);
    }
    /* empresa.js lo llama cuando teclear en un campo con error le quita el error */
    function alEditar(k) { const t = tarjetaDe(k); if (t) pintarAlerta(t); }
    /* después del primer "Guardar cambios", una fecha elegida en el calendario se revisa al aplicarla (p. ej. futura) */
    function revisar(k) {
      const S = st(), c = campo(k);
      if (!c || S.route !== 'datos' || !S.triedSave) return;
      const m = errorDe(c); if (m) S.errors[k] = m; else delete S.errors[k];
    }
    document.addEventListener('focusout', (ev) => {
      const S = st(), k = ev.target.dataset && ev.target.dataset.f, c = k && campo(k);
      if (!c || S.route !== 'datos' || S.ctr.tab !== 'empresa' || S.ctr.modo !== 'edicion' || !S.triedSave) return;
      const fld = ev.target.closest('.field');
      if (fld && ev.relatedTarget && fld.contains(ev.relatedTarget)) return;   /* al botón del calendario del mismo campo */
      const m = errorDe(c);
      if (m) S.errors[k] = m; else delete S.errors[k];
      if (k === 'cp' && (!m || m === OBLIG)) {   /* con el CP bien escrito, Alcaldía y Colonia vuelven a contar */
        ['municipio', 'colonia'].forEach(k2 => { const m2 = errorDe(campo(k2)); if (m2) S.errors[k2] = m2; else delete S.errors[k2]; });
      }
      /* pintarCampo solo cambia lo que difiere. Con el CP también van Alcaldía y Colonia: al teclear el CP sus errores salen
         de S.errors sin repintarse (sus opciones sí las repinta el input del CP, con render) */
      (k === 'cp' ? ['cp', 'municipio', 'colonia'] : [k]).forEach(x => pintarCampo(campo(x)));
    });
    document.addEventListener('keydown', (ev) => {
      const t = ev.target.closest && ev.target.closest('.ctr-tabs [role="tab"]');
      if (t && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].indexOf(ev.key) > -1) {
        ev.preventDefault();
        const ids = ['empresa', 'diseno'];
        const sig = ev.key === 'Home' ? ids[0] : ev.key === 'End' ? ids[1] : ids[1 - ids.indexOf(t.dataset.tab)];
        cambiarTab(sig, true);
      }
      /* el tooltip se cierra con Esc (WCAG 1.4.13) y vuelve al salir del ícono */
      if (ev.key === 'Escape') { const tip = ev.target.closest && ev.target.closest('.ctr-tip'); if (tip) tip.classList.add('is-oculto'); }
    });
    document.addEventListener('mouseout', (ev) => { const tip = ev.target.closest && ev.target.closest('.ctr-tip'); if (tip && !tip.contains(ev.relatedTarget)) tip.classList.remove('is-oculto'); });
    document.addEventListener('focusin', (ev) => { document.querySelectorAll('.ctr-tip.is-oculto').forEach(tip => { if (!tip.contains(ev.target)) tip.classList.remove('is-oculto'); }); });

    /* ---------- Panel "Prototipo": estados de la pantalla ---------- */
    function futuraDeEjemplo() { const d = new Date(); return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear() + 1}`; }
    function aplicarCP() {
      const S = st(), cp = S.f.cp;
      if (!/^\d{5}$/.test(cp)) return;
      api.fetchCP(cp).then(info => {
        const S2 = st();
        if (!info || S2.f.cp !== cp) return;
        S2.f.estado = info.estado || S2.f.estado;
        if (info.municipio) S2.f.municipio = info.municipio;
        if (info.colonias && info.colonias.length && info.colonias.indexOf(S2.f.colonia) < 0) S2.f.colonia = info.colonias[0];
        if (S2.ctr.guardados && S2.ctr.guardados.cp === cp && !S2.dirty) Object.assign(S2.ctr.guardados, {estado:S2.f.estado, municipio:S2.f.municipio, colonia:S2.f.colonia});
        if (S2.route === 'datos' && S2.ctr.tab === 'empresa') api.render();
      });
    }
    function proto(estado) {
      const S = st();
      if (!estado) return;
      if (S.route !== 'datos') api.go('datos');
      const c = st().ctr, S2 = st();
      clearTimeout(cargaT); clearTimeout(guardarT);
      c.cargado = true; c.cargaFija = false;
      S2.cal = null; S2.openSel = null; S2.modal = null; S2.saving = false;
      const tab1 = (modo) => { c.tab = 'empresa'; c.modo = modo; };
      switch (estado) {
        case 'vacio':
          Object.assign(S2.f, vacio()); c.guardados = null; c.editando = false; S2.done.datos = false;
          S2.errors = {}; S2.triedSave = false; S2.dirty = false; tab1('edicion'); break;
        case 'lleno':
          Object.assign(S2.f, EJEMPLO); c.editando = !!c.guardados;
          S2.errors = {}; S2.triedSave = false; S2.dirty = true; tab1('edicion'); break;
        case 'vacios':
          Object.assign(S2.f, vacio()); c.guardados = null; c.editando = false; S2.done.datos = false;
          tab1('edicion'); S2.triedSave = true; S2.errors = validar(); S2.dirty = false; break;
        case 'formato': {
          const fut = futuraDeEjemplo();
          Object.assign(S2.f, EJEMPLO, {escrituraFecha:fut, notarioNum:'12A', folioMercantil:'F-123', folioFecha:fut, rfc:'PYS0101',
            testimonioNum:'12O', notarioPoderNum:'3-45', notarioPoderNombre:'', cp:'041', municipio:'', colonia:'', estado:'',
            telefono:'55 1234', correo:'correo@email', rpcaFecha:fut});
          c.editando = !!c.guardados; tab1('edicion'); S2.triedSave = true; S2.errors = validar(); S2.dirty = true; break;
        }
        case 'carga': tab1('carga'); c.cargaFija = true; S2.errors = {}; break;
        case 'guardado':
          Object.assign(S2.f, EJEMPLO); c.guardados = Object.assign({}, S2.f); c.editando = false;
          S2.errors = {}; S2.triedSave = false; S2.dirty = false; S2.done.datos = true; tab1('guardado'); break;
        case 'diseno': case 'estilos': case 'diseno-guardado': case 'vista':
          c.tab = 'diseno'; c.disenoSync = true;
          if (c.modo === 'carga') c.modo = c.guardados ? 'guardado' : 'edicion';
          break;
      }
      c.disenoSync = true; c.disenoProto = c.tab === 'diseno' ? estado : '';
      try { history.replaceState(null, '', '#' + hash()); } catch (e) { /* sin hash */ }
      api.render();
      window.scrollTo({top:0});
      /* estados del Figma del diseño: CtrDiseno.demo('editor' | 'estilos' | 'guardado' | 'vista') */
      const demo = {diseno:'editor', estilos:'estilos', 'diseno-guardado':'guardado', vista:'vista'}[estado];
      if (demo) { llamarDiseno('demo', demo); const e = estadoDiseno(); if (e) c.disenoDirty = !!e.dirty; api.syncProto(); }
      if (S2.f.cp === EJEMPLO.cp) aplicarCP();
    }
    function estadoProto() {
      const S = st(), c = S.ctr;
      if (S.route !== 'datos') return '';
      if (c.tab === 'diseno') {
        const e = estadoDiseno();
        if (e && e.vista) return 'vista';
        if (e && e.guardado) return 'diseno-guardado';
        return c.disenoProto === 'estilos' ? 'estilos' : 'diseno';
      }
      if (c.modo === 'carga') return 'carga';
      if (c.modo === 'guardado') return 'guardado';
      const errs = Object.values(S.errors);
      if (errs.length) return errs.indexOf(OBLIG) > -1 ? 'vacios' : 'formato';
      const base = vacio();
      return CAMPOS.some(x => String(S.f[x.k] || '').trim() !== base[x.k]) ? 'lleno' : 'vacio';
    }
    const selProto = document.getElementById('proto-ctr');
    if (selProto) selProto.addEventListener('change', () => proto(selProto.value));
    function syncProto() { if (selProto) selProto.value = estadoProto(); }
    /* "Llenar con datos de ejemplo": los del Figma, sin guardar (hay que darle "Guardar cambios"). Sin toast: un aviso más en la
       esquina se apilaba con "Cambios guardados" y tapaba "Editar" y "Continuar a …" */
    function llenarEjemplo() { proto('lleno'); }
    function reiniciar() {
      clearTimeout(cargaT); clearTimeout(guardarT);
      llamarDiseno('reiniciar');
      if (disenoEl) { disenoEl.remove(); disenoEl = null; }
    }

    return {pantalla, despues: () => { if (st().route === 'datos' && st().ctr.tab === 'diseno') montarDiseno(); },
      accion, entrar, leerHash, hash, descartar, primerError, alEditar, revisar, llenarEjemplo, reiniciar, syncProto, cambiarTab};
  }

  window.CtrContrato = {crear, campos:CAMPOS, claves:CLAVES, vacio, estadoInicial, ejemplo:EJEMPLO};
})();
