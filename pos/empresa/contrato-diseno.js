/* Configuración de contratos · pestaña "Diseño del contrato".
   Figma "Suscripción" (J7QvWSiVMKOxDex4x3Wmbj), sección 4621:11178 "V1- Datos de mi empresa":
   "Diseño de contrato 01–18" (editor: Contenido / Estilos), "Vista previa01/02", "Cambios Guardados" 427 (hoja guardada)
   y "tamaño de hoja" 5001:12215. Especificación: figma-contrato/SPEC.md §3, §4 y §6.

   Uso (lo llama la pantalla "Configuración de contratos", que pinta el breadcrumb, el título y el TabsButton):
     CtrDiseno.render(contenedor, ctx)
       contenedor  elemento donde va la pestaña (este módulo lo vacía y lo llena).
       ctx.empresa  datos de la pestaña "Datos de la empresa" (pueden venir incompletos). Llaves que se leen (con sus
                    alias): nombreComercial, razonSocial, rfc, representante, calle, numExt, numInt, cp, municipio,
                    colonia, estado, telefono, correo, rpcaNumero, rpcaFecha. Llenan los marcadores del contrato.
       ctx.guardado true = hoja guardada (427); false = editor. Solo se toma cuando cambia respecto a la llamada anterior;
                    si no se pasa, manda el estado interno (Guardar cambios lo pone en true y "Editar" en false).
       ctx.onChange(ev) avisos (no hace falta volver a llamar render por ellos):
                    {tipo:'cambio', dirty}         solo cuando cambia "hay cambios sin guardar"
                    {tipo:'guardando'} / {tipo:'guardado'}  al guardar (después de ~800 ms de carga)
                    {tipo:'editar'}                 se pulsó "Editar" en la hoja guardada
                    {tipo:'cancelado'}              se descartaron los cambios y se volvió a la hoja guardada
                    {tipo:'salir'}                  Cancelar sin un diseño guardado: la pantalla decide (p. ej. ir a #inicio)
                    {tipo:'vista', abierta}         se abrió o cerró la Vista previa
                    Todos traen además `estado` (ver CtrDiseno.estado()).
       ctx.botonEditar  false = no pintar el botón "Editar" de la hoja guardada (si la pantalla pone el suyo).
       ctx.confirmar(opc) opcional: devuelve una promesa<boolean> para usar el modal de la pantalla en vez del propio.
       ctx.toast(tipo, titulo) opcional: al guardar se llama con ('success', 'Cambios guardados').
     CtrDiseno.estado()          {dirty, guardado, vista, diseno} (diseno = copia del borrador).
     CtrDiseno.editar()          vuelve al editor desde la hoja guardada.
     CtrDiseno.vistaPrevia(bool) abre o cierra la Vista previa.
     CtrDiseno.descartar()       regresa al último diseño guardado (o al predeterminado) sin preguntar.
     CtrDiseno.reiniciar()       borra todo (diseño predeterminado, nada guardado). Para "Reiniciar" del prototipo.
     CtrDiseno.logoEjemplo()     carga el logo ficticio del prototipo (tiendita sobre verde, como en Figma).
     CtrDiseno.demo(nombre)      atajos para el riel del prototipo: 'editor' | 'estilos' | 'guardado' | 'vista'.

   Notas de convivencia con empresa.js (sus escuchas viven en document):
   - Aquí no se usan data-action, data-go, data-f, data-u, data-drop ni #logo-file: esos los atrapa empresa.js.
   - La Vista previa y el modal de "¿Salir sin guardar?" se cuelgan de <body> (capa .ctd-capas): dentro de .page
     (container-type) un position:fixed quedaría atado a la columna y no a la ventana. */
(function () {
  'use strict';

  /* ---------- Íconos (src/design-system/Icons/Icons.tsx y SVG del Figma) ---------- */
  const IC = {
    check: ['0 0 24 24', '<path d="M9.54998 18.0001L3.84998 12.3001L5.27498 10.8751L9.54998 15.1501L18.725 5.9751L20.15 7.4001L9.54998 18.0001Z" fill="currentColor"/>'],
    close: ['0 0 24 24', '<path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z" fill="currentColor"/>'],
    down: ['0 0 24 24', '<path d="M5.7 9.6998L7.1 8.2998L11.7 12.8998L16.3 8.2998L17.7 9.6998L11.7 15.6998L5.7 9.6998Z" fill="currentColor"/>'],
    upload: ['0 0 24 24', '<path d="M9 16H15V10H19L12 3L5 10H9V16ZM5 18H19V20H5V18Z" fill="currentColor"/>'],
    search: ['0 0 24 24', '<path d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.146 15.371 4.888 14.113C3.62933 12.8543 3 11.3167 3 9.5C3 7.68333 3.62933 6.14567 4.888 4.887C6.146 3.629 7.68333 3 9.5 3C11.3167 3 12.8543 3.629 14.113 4.887C15.371 6.14567 16 7.68333 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8127 13.5627 12.688 12.688C13.5627 11.8127 14 10.75 14 9.5C14 8.25 13.5627 7.18733 12.688 6.312C11.8127 5.43733 10.75 5 9.5 5C8.25 5 7.18733 5.43733 6.312 6.312C5.43733 7.18733 5 8.25 5 9.5C5 10.75 5.43733 11.8127 6.312 12.688C7.18733 13.5627 8.25 14 9.5 14Z" fill="currentColor"/>'],
    trash: ['0 0 24 24', '<path d="M7.80775 20.8845C7.30908 20.8845 6.88308 20.7079 6.52975 20.3547C6.17658 20.0014 6 19.5754 6 19.0768V6.3845H5V4.8845H9.5V4H15.5V4.8845H20V6.3845H19V19.0768C19 19.5819 18.825 20.0095 18.475 20.3595C18.125 20.7095 17.6974 20.8845 17.1923 20.8845H7.80775ZM17.5 6.3845H7.5V19.0768C7.5 19.1666 7.52883 19.2403 7.5865 19.298C7.64417 19.3557 7.71792 19.3845 7.80775 19.3845H17.1923C17.2692 19.3845 17.3398 19.3524 17.4038 19.2883C17.4679 19.2243 17.5 19.1538 17.5 19.0768V6.3845ZM9.904 17.3845H11.4037V8.3845H9.904V17.3845ZM13.5962 17.3845H15.096V8.3845H13.5962V17.3845Z" fill="currentColor"/>'],
    edit: ['0 0 24 24', '<path d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3043 2.75 17.863 2.75C18.421 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.571 21.275 6.113C21.2917 6.65433 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" fill="currentColor"/>'],
    drag: ['0 0 24 24', '<path d="M8.55005 20C8.00005 20 7.52922 19.8042 7.13755 19.4125C6.74588 19.0208 6.55005 18.55 6.55005 18C6.55005 17.45 6.74588 16.9792 7.13755 16.5875C7.52922 16.1958 8.00005 16 8.55005 16C9.10005 16 9.57088 16.1958 9.96255 16.5875C10.3542 16.9792 10.55 17.45 10.55 18C10.55 18.55 10.3542 19.0208 9.96255 19.4125C9.57088 19.8042 9.10005 20 8.55005 20ZM14.55 20C14 20 13.5292 19.8042 13.1375 19.4125C12.7459 19.0208 12.55 18.55 12.55 18C12.55 17.45 12.7459 16.9792 13.1375 16.5875C13.5292 16.1958 14 16 14.55 16C15.1 16 15.5709 16.1958 15.9625 16.5875C16.3542 16.9792 16.55 17.45 16.55 18C16.55 18.55 16.3542 19.0208 15.9625 19.4125C15.5709 19.8042 15.1 20 14.55 20ZM8.55005 14C8.00005 14 7.52922 13.8042 7.13755 13.4125C6.74588 13.0208 6.55005 12.55 6.55005 12C6.55005 11.45 6.74588 10.9792 7.13755 10.5875C7.52922 10.1958 8.00005 10 8.55005 10C9.10005 10 9.57088 10.1958 9.96255 10.5875C10.3542 10.9792 10.55 11.45 10.55 12C10.55 12.55 10.3542 13.0208 9.96255 13.4125C9.57088 13.8042 9.10005 14 8.55005 14ZM14.55 14C14 14 13.5292 13.8042 13.1375 13.4125C12.7459 13.0208 12.55 12.55 12.55 12C12.55 11.45 12.7459 10.9792 13.1375 10.5875C13.5292 10.1958 14 10 14.55 10C15.1 10 15.5709 10.1958 15.9625 10.5875C16.3542 10.9792 16.55 11.45 16.55 12C16.55 12.55 16.3542 13.0208 15.9625 13.4125C15.5709 13.8042 15.1 14 14.55 14ZM8.55005 8C8.00005 8 7.52922 7.80417 7.13755 7.4125C6.74588 7.02083 6.55005 6.55 6.55005 6C6.55005 5.45 6.74588 4.97917 7.13755 4.5875C7.52922 4.19583 8.00005 4 8.55005 4C9.10005 4 9.57088 4.19583 9.96255 4.5875C10.3542 4.97917 10.55 5.45 10.55 6C10.55 6.55 10.3542 7.02083 9.96255 7.4125C9.57088 7.80417 9.10005 8 8.55005 8ZM14.55 8C14 8 13.5292 7.80417 13.1375 7.4125C12.7459 7.02083 12.55 6.55 12.55 6C12.55 5.45 12.7459 4.97917 13.1375 4.5875C13.5292 4.19583 14 4 14.55 4C15.1 4 15.5709 4.19583 15.9625 4.5875C16.3542 4.97917 16.55 5.45 16.55 6C16.55 6.55 16.3542 7.02083 15.9625 7.4125C15.5709 7.80417 15.1 8 14.55 8Z" fill="currentColor"/>'],
    /* B e I: los SVG exactos del Figma (Diseño de contrato 08) */
    bold: ['0 0 20 20', '<path d="M5.66671 15.8333V4.16667H10.2709C11.1737 4.16667 12.007 4.44444 12.7709 5C13.5348 5.55556 13.9167 6.32639 13.9167 7.3125C13.9167 8.02083 13.757 8.56597 13.4375 8.94792C13.1181 9.32986 12.8195 9.60417 12.5417 9.77083C12.8889 9.92361 13.2743 10.2083 13.698 10.625C14.1216 11.0417 14.3334 11.6667 14.3334 12.5C14.3334 13.7361 13.882 14.6007 12.9792 15.0938C12.0764 15.5868 11.2292 15.8333 10.4375 15.8333H5.66671ZM8.18754 13.5H10.3542C11.0209 13.5 11.4271 13.3299 11.573 12.9896C11.7188 12.6493 11.7917 12.4028 11.7917 12.25C11.7917 12.0972 11.7188 11.8507 11.573 11.5104C11.4271 11.1701 11 11 10.2917 11H8.18754V13.5ZM8.18754 8.75H10.125C10.5834 8.75 10.9167 8.63194 11.125 8.39583C11.3334 8.15972 11.4375 7.89583 11.4375 7.60417C11.4375 7.27083 11.3195 7 11.0834 6.79167C10.8473 6.58333 10.5417 6.47917 10.1667 6.47917H8.18754V8.75Z" fill="currentColor"/>'],
    italic: ['0 0 20 20', '<path d="M4.1665 15.8332V13.7498H7.49984L9.99984 6.24984H6.6665V4.1665H14.9998V6.24984H12.0832L9.58317 13.7498H12.4998V15.8332H4.1665Z" fill="currentColor"/>'],
    /* QR: qr_code_2 (vista del editor) y QrCodeIcon del DS (hoja guardada) */
    qr2: ['0 0 24 24', '<path d="M15 21h-2v-2h2v2zm-2-7h-2v5h2v-5zm8-2h-2v4h2v-4zm-2-2h-2v2h2v-2zM7 12H5v2h2v-2zm-2-2H3v2h2v-2zm7-5h2V3h-2v2zM4.5 4.5v3h3v-3h-3zM9 9H3V3h6v6zm-4.5 7.5v3h3v-3h-3zM9 21H3v-6h6v6zm7.5-16.5v3h3v-3h-3zM21 9h-6V3h6v6zm-2 10v-3h-4v2h2v3h4v-2h-2zm-2-7h-4v2h4v-2zm-4-2H7v2h2v2h2v-2h2v-2zm1-1V7h-2V5h-2v4h4zM6.75 5.25h-1.5v1.5h1.5v-1.5zm0 12h-1.5v1.5h1.5v-1.5zm12-12h-1.5v1.5h1.5v-1.5z" fill="currentColor"/>'],
    qr: ['0 0 24 24', '<path d="M3 11V3H11V11H3ZM5 9H9V5H5V9ZM3 21V13H11V21H3ZM5 19H9V15H5V19ZM13 11V3H21V11H13ZM15 9H19V5H15V9ZM19 21V19H21V21H19ZM13 15V13H15V15H13ZM15 17V15H17V17H15ZM13 19V17H15V19H13ZM15 21V19H17V21H15ZM17 19V17H19V19H17ZM17 15V13H19V15H17ZM19 17V15H21V17H19Z" fill="currentColor"/>'],
    /* redes sociales (Diseño de contrato 18): marcas en un solo color */
    facebook: ['0 0 24 24', '<path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" fill="currentColor"/>'],
    instagram: ['0 0 24 24', '<rect x="2" y="2" width="20" height="20" rx="5.5" fill="currentColor"/><circle cx="12" cy="12" r="4.3" fill="none" stroke="#fff" stroke-width="2"/><circle cx="17.4" cy="6.6" r="1.25" fill="#fff"/>'],
    x: ['0 0 24 24', '<path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z" fill="currentColor"/>'],
  };
  const ic = (n, s, cls) => `<svg width="${s || 20}" height="${s || 20}" viewBox="${IC[n][0]}" fill="none" aria-hidden="true" focusable="false"${cls ? ` class="${cls}"` : ''}>${IC[n][1]}</svg>`;
  /* palomita y tache del pulgar del Switch del DS (Switch.tsx) */
  const PULGAR_ON = '<svg width="12" height="9" viewBox="0 0 12 9" fill="none" aria-hidden="true" focusable="false"><path d="M1 4L4.5 7.5L11 1" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const PULGAR_OFF = '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true" focusable="false"><path d="M8.5 1.5L1.5 8.5M1.5 1.5L8.5 8.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>';
  /* logo ficticio del prototipo: tiendita sobre verde (Figma usa un ícono de tienda sobre green-100); no es una marca real */
  const LOGO_EJEMPLO = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72"><rect width="72" height="72" rx="14" fill="#D1FFD1"/><rect x="17" y="31" width="38" height="24" fill="#FF7053" stroke="#0D166B" stroke-width="2.4"/><rect x="22" y="37" width="14" height="11" rx="1" fill="#30D8FF" stroke="#0D166B" stroke-width="2.2"/><rect x="40" y="37" width="10" height="18" fill="#0D9488" stroke="#0D166B" stroke-width="2.2"/><path d="M14 21h44l-1 10H15z" fill="#FFC003" stroke="#0D166B" stroke-width="2.4" stroke-linejoin="round"/><path d="M25 21v10M36 21v10M47 21v10" stroke="#FF7053" stroke-width="5"/><path d="M14 21h44l-1 10H15z" fill="none" stroke="#0D166B" stroke-width="2.4" stroke-linejoin="round"/><rect x="13" y="54" width="46" height="4" rx="1.5" fill="#0D166B"/></svg>');

  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  /* ---------- Secciones del contrato (orden y nombres de Figma, Diseño de contrato 01) ----------
     ctrl = controles de Estilos de cada sección (SPEC §3.3); titulo = encabezado en la hoja guardada (427). */
  const SECCIONES = [
    {id:'identidad', nombre:'Identidad del proveedor', ctrl:['logo', 'fondo']},
    {id:'folio', nombre:'Datos de folio y fecha', ctrl:['fondo', 'texto']},
    {id:'partes', nombre:'Partes del contrato', titulo:'Partes del contrato', ctrl:['fondo', 'texto']},
    {id:'financiera', nombre:'Tabla financiera (CAT y comisiones)', titulo:'Tabla financiera', ctrl:['fondo', 'acento', 'texto']},
    {id:'plazo', nombre:'Plazo y condiciones de pago', titulo:'Plazo y condiciones de pago', ctrl:['fondo', 'texto']},
    {id:'iva', nombre:'Nota de IVA y remisión al procedimiento', titulo:'Nota de IVA y remisión al procedimiento', ctrl:['fondo', 'texto']},
    {id:'dudas', nombre:'Dudas, aclaraciones y reclamaciones', titulo:'Dudas, aclaraciones y reclamaciones', ctrl:['fondo', 'texto']},
    {id:'profeco', nombre:'Registro PROFECO y obligación de transparencia', titulo:'Registro PROFECO y transparencia', ctrl:['fondo', 'texto']},
    {id:'opciones', nombre:'Tabla de opciones de pago', titulo:'Tabla de opciones de pago', ctrl:['fondo', 'acento', 'texto']},
    {id:'prenda', nombre:'Tabla de la prenda', titulo:'Tabla de la prenda', ctrl:['fondo', 'acento', 'texto']},
    {id:'desempeno', nombre:'Desempeño y firma del consumidor', titulo:'Desempeño y firma del consumidor', ctrl:['fondo', 'acento', 'texto']},
    {id:'firma', nombre:'Firma', ctrl:['fondo', 'texto']},
    {id:'qr', nombre:'Código QR para pagos en línea', ctrl:['fondo', 'enlace', 'texto']},
    {id:'redes', nombre:'Tus redes sociales', ctrl:['fondo', 'redes', 'ident']},
  ];
  const SEC = Object.fromEntries(SECCIONES.map(s => [s.id, s]));

  /* Texto de cada sección (campo "Texto" de Estilos). **…** = negrita. Copy de Figma con las correcciones "aplicar"
     de SPEC §7.13; "Datos de folio y fecha" no está dibujado (Q6): es la propuesta de SPEC §3.3. */
  const TEXTOS = {
    folio: ['Fecha de celebración del contrato: [Lugar] , [DD/MM/AAAA]', 'Número de folio [####]'],
    partes: [
      'Contrato de mutuo interés y garantía prendaria que celebran: [Nombre físico o moral]',
      'El Proveedor, con domicilio en [Calle, número, colonia, código postal, ciudad], con número de teléfono [+52 ### ### ####], correo electrónico: [dirección electrónica], representado por: [Nombre, primer y segundo apellido].',
      'El Consumidor [Nombre, primer y segundo apellido], que se identifica con tipo de identificación oficial: [### ### ####], con domicilio en: [Calle, número, colonia, código postal, ciudad], con número de teléfono [+52 ### ### ####], correo electrónico: [dirección electrónica].',
      'Con cotitular (si en su caso): [Nombre, primer y segundo apellido], con domicilio en: [Calle, número, colonia, código postal, ciudad],',
      'Con beneficiario (si en su caso): [Nombre, primer y segundo apellido], solo para efectos de este contrato.',
    ],
    financiera: [
      '**Costo anual total**', 'Para fines informativos y de comparación: (número) % TASA FIJA',
      '**Tasa de interés anual**', '(número) % TASA FIJA',
      '**Monto del préstamo**', '$ (cantidad en número) Moneda Nacional',
      '**Monto total a pagar**', '$ (cantidad en número) al plazo máximo nacional o refrendo',
      '**Comisiones**',
      'Por almacenaje: [-]% [Cláus. 11 d]', 'Por avalúo: $[-] [Cláus. 11 b]', 'Por comercialización [-]% [Cláus. 11 c]',
      'Por reposición de contrato: $[-] [Cláus. 11 d]', 'Desempeño Extemporáneo: [-]% [Cláus. 11 e]', 'Gastos de administración: [-]%',
      '**Metodología de cálculo de interés:** Tasa de interés anual fija dividida entre 360 días por el importe del saldo insoluto del préstamo por el número de días efectivamente transcurridos.',
    ],
    plazo: [
      'Plazo del préstamo/Fecha límite para el refrendo o desempeño: [DD/MM/AAAA]',
      'Total de Refrendos aplicables: [#]',
      'Métodos de pago aceptados: efectivo, tarjetas de crédito y débito, transferencias electrónicas.',
      'En caso de que el vencimiento sea en día inhábil, se considerará al día hábil siguiente.',
    ],
    iva: [
      'Estos conceptos causarán el pago del impuesto al valor agregado (IVA) a la tasa del (número) %.',
      '*El procedimiento para desempeño, refrendo, finiquito y reclamo del remanente se encuentra descrito en el contrato.',
    ],
    dudas: [
      '**Dudas, aclaraciones y reclamaciones:**', '',
      'Domicilio: (Calle/Avenida, número, colonia, Código Postal, Ciudad). Teléfono: (número con LADA). correo electrónico: (dirección electrónica) en un horario de: (hora. Minutos) a (hora. Minutos) horas.',
      'En caso de queja, también puede acudir a PROFECO al 55 68 87 22 o al 01-800-468-87-22. Página de Internet: www.gob.mx/profeco', '',
      '**Estado de cuenta/consulta de movimientos:** [señalar dirección electrónica]',
    ],
    profeco: [
      'Contrato de Adhesión registrado en el Registro Público de Contratos de Adhesión de la Procuraduría Federal del Consumidor; bajo el número (número y año) de fecha (día) de (mes) de (año).',
      'El proveedor está obligado a proporcionar al consumidor el documento en el cual se señala la descripción del préstamo, saldos, movimientos y la descripción de la Prenda en garantía.',
    ],
    opciones: ['**Opc. de pago**', '**Mutuo**', '**Interés**', '**Almacenaje**', '**IVA**', '**Refrendo**', '**Desempeño**', '**Fecha de pago**'],
    prenda: ['**Descripción**', '**Características**', '**Avalúo**', '**Préstamo**', '**%Préstamo/avalúo**'],
    desempeno: [
      '**Desempeño**', '',
      'EL CONSUMIDOR recoge en el acto y a su entera satisfacción la(s) prenda (s) arriba descrita(s), por lo que otorga a (nombre del proveedor), el finiquito más amplio que en derecho corresponda, liberándolo de cualquier responsabilidad que hubiere surgido o pudiere surgir en relación al contrato y a la prenda.', '',
      'Fecha: [DD/MM/AAAA]', '', 'Firmas', '', '**EL CONSUMIDOR**', '', 'Fecha: [DD/MM/AAAA]',
    ],
    firma: ['**Consumidor**', '**Proveedor**', '**Valuador**'],
    qr: ['Refrenda o desempeña en línea: escanea el QR, crea tu perfil en www.ataskate.mx y paga fácil.'],
  };
  /* un renglón con **negritas** → [{t, b?, i?}] */
  function md(linea) {
    const runs = [], re = /\*\*(.+?)\*\*/g; let i = 0, m;
    while ((m = re.exec(linea))) { if (m.index > i) runs.push({t:linea.slice(i, m.index)}); runs.push({t:m[1], b:true}); i = re.lastIndex; }
    if (i < linea.length) runs.push({t:linea.slice(i)});
    return runs;
  }
  const TEXTO_DEF = Object.fromEntries(Object.entries(TEXTOS).map(([k, ls]) => [k, ls.map(md)]));

  /* Paletas (SVG de Figma, valores exactos). Fondo: todas las secciones; Acento: secciones con tabla. */
  const COLORES = [['#FFFAEB', 'Crema'], ['#FFC003', 'Amarillo'], ['#D0F6FF', 'Azul claro'], ['#30D8FF', 'Azul'], ['#D1FFD1', 'Verde claro'],
    ['#309C60', 'Verde'], ['#FEBEB8', 'Rosa'], ['#FF6357', 'Rojo'], ['#F1E0FF', 'Lila claro'], ['#D5A4FF', 'Lila']];
  const FONDOS = [['#FFFFFF', 'Blanco'], ['#F4F4F4', 'Gris claro']].concat(COLORES);
  const ACENTOS = [['#FFFFFF', 'Blanco'], ['#EEEFEF', 'Gris']].concat(COLORES);
  const FONDO_DEF = '#FFFFFF', ACENTO_DEF = '#EEEFEF';
  const FORMATOS = [
    {v:'carta', l:'Carta · 21.6 × 27.9 cm', c:'Carta', r:27.9 / 21.6},
    {v:'oficio', l:'Oficio · 21.6 × 34 cm', c:'Oficio', r:34 / 21.6},
    {v:'a4', l:'A4 · 21 × 29.7 cm', c:'A4', r:29.7 / 21},
  ];
  const REDES = [{id:'facebook', l:'Facebook'}, {id:'instagram', l:'Instagram'}, {id:'x', l:'X'}];
  const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const HOJA_W = 557;            /* ancho de la hoja en Figma (427): 525 de contenido + 16 a cada lado */
  const CUENTA = 'PrestaYa';     /* empresa de la cuenta del prototipo (Figma usa "PrestaYa S.A. de C.V.") */

  /* ---------- Estado ---------- */
  function disenoInicial() {
    return {
      orden: SECCIONES.map(s => s.id),
      activo: Object.fromEntries(SECCIONES.map(s => [s.id, true])),
      fondo: {}, acento: {}, texto: {},     /* solo lo que difiere del predeterminado */
      logo: null,                            /* {url, nombre} */
      redes: {facebook:true, instagram:true, x:false},
      identificador: '',
      formato: 'carta', dobleCara: false,
    };
  }
  const clonar = (o) => JSON.parse(JSON.stringify(o));
  /* JSON con llaves ordenadas: para comparar borrador contra guardado sin depender del orden de inserción */
  const canon = (o) => JSON.stringify(o, (k, v) => (v && typeof v === 'object' && !Array.isArray(v)) ? Object.keys(v).sort().reduce((a, x) => { a[x] = v[x]; return a; }, {}) : v);
  const BASE = canon(disenoInicial());

  let D = disenoInicial();   /* borrador */
  let G = null;              /* último diseño guardado (null = nunca se guardó) */
  const U = {pestana:'contenido', sel:null, vista:false, abierto:null, guardando:false, guardado:false, confirmar:false, logoErr:'', sucio:false};
  const C = {cont:null, raiz:null, cuerpo:null, capa:null, ctx:{}, ctxGuardado:undefined, rango:null};
  let E = normalizarEmpresa({});

  const estaSucio = () => canon(D) !== (G ? canon(G) : BASE);
  const formatoActual = () => FORMATOS.find(f => f.v === D.formato) || FORMATOS[0];
  const fondoDe = (id) => D.fondo[id] || FONDO_DEF;
  const acentoDe = (id) => D.acento[id] || ACENTO_DEF;
  const textoDe = (id) => D.texto[id] || TEXTO_DEF[id] || [];
  const primeraVisible = () => D.orden.find(id => D.activo[id]) || null;
  const plano = (runs) => runs.map(r => r.t).join('');
  const noVacias = (ls) => ls.filter(l => plano(l).trim());

  /* ---------- Datos de la empresa (pestaña 1) ---------- */
  function normalizarEmpresa(e) {
    e = e || {};
    const v = (...ks) => { for (const k of ks) { const x = e[k]; if (x != null && String(x).trim()) return String(x).trim(); } return ''; };
    return {
      nombre:v('nombreComercial', 'nombre', 'nombreEmpresa'), razon:v('razonSocial'),
      rfc:v('rfc').toUpperCase(), representante:v('representante', 'nombreRepresentante', 'representanteLegal', 'repNombre'),
      calle:v('calle'), numExt:v('numExt', 'numeroExt', 'numeroExterior'), numInt:v('numInt', 'numeroInt', 'numeroInterior'),
      cp:v('cp', 'codigoPostal'), municipio:v('municipio', 'alcaldia'), colonia:v('colonia'), estado:v('estado'),
      telefono:v('telefono', 'tel'), correo:v('correo', 'email'),
      rpcaNumero:v('rpcaNumero', 'rpca', 'numRegistroRPCA', 'registroRPCA', 'rpcaNum'),
      rpcaFecha:v('rpcaFecha', 'fechaRPCA', 'fechaRegistroRPCA'),
    };
  }
  /* "PrestaYa S.A. de C.V." como en Figma: el formulario solo pide nombre comercial (SPEC Q3) */
  const razon = () => E.razon || `${E.nombre || CUENTA} S.A. de C.V.`;
  const razonSiHay = () => (E.razon || E.nombre) ? razon() : '';
  function domicilio() {
    if (!E.calle) return '';
    const num = [E.numExt, E.numInt ? `int. ${E.numInt}` : ''].filter(Boolean).join(' ');
    return [`${E.calle}${num ? ' ' + num : ''}`, E.colonia, E.cp ? `C.P. ${E.cp}` : '', E.municipio, E.estado].filter(Boolean).join(', ');
  }
  const domicilioCorto = () => E.calle ? [`${E.calle}${E.numExt ? ' ' + E.numExt : ''}`, E.municipio || E.estado].filter(Boolean).join(', ') : '';
  function telefono() {
    const d = E.telefono.replace(/\D/g, '').slice(-10);
    if (!d) return '';
    return '+52 ' + (d.length === 10 ? `${d.slice(0, 2)} ${d.slice(2, 6)} ${d.slice(6)}` : E.telefono);
  }
  function fechaLarga(v) {
    const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(v || '');
    return m && MESES[+m[2] - 1] ? `${+m[1]} de ${MESES[+m[2] - 1]} de ${m[3]}` : (v || '');
  }
  const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '');
  /* Enlace de código QR: de solo lectura, sale del enlace de la tienda (SPEC Q7) */
  const enlaceQR = () => `ataskate.mx/${slug(E.nombre || CUENTA) || 'tutienda'}`;

  /* qué marcadores de cada renglón se llenan con los datos de la empresa (SPEC §3.4, "Data binding") */
  function datosDe(id, texto) {
    if (id === 'partes') {
      if (/^contrato de mutuo/i.test(texto)) return {'[Nombre físico o moral]':razonSiHay()};
      if (/^el proveedor/i.test(texto)) return {'[Calle, número, colonia, código postal, ciudad]':domicilio(), '[+52 ### ### ####]':telefono(), '[dirección electrónica]':E.correo, '[Nombre, primer y segundo apellido]':E.representante};
    }
    if (id === 'profeco') return {'(número y año)':E.rpcaNumero, '(día) de (mes) de (año)':E.rpcaFecha ? fechaLarga(E.rpcaFecha) : ''};
    if (id === 'desempeno') return {'(nombre del proveedor)':razonSiHay()};
    return null;
  }

  /* ---------- Texto enriquecido: renglones de "runs" {t, b, i} ---------- */
  function normalizarRuns(runs) {
    const out = [];
    runs.forEach(r => {
      if (!r.t) return;
      const ult = out[out.length - 1];
      if (ult && !!ult.b === !!r.b && !!ult.i === !!r.i) ult.t += r.t;
      else { const n = {t:r.t}; if (r.b) n.b = true; if (r.i) n.i = true; out.push(n); }
    });
    return out;
  }
  /* DOM del editor (contenteditable) → renglones. Cada bloque (div/p) o <br> cierra un renglón. */
  function lineasDeDOM(el) {
    const out = []; let cur = null;
    const cerrar = () => { if (cur !== null) { out.push(cur); cur = null; } };
    const BLOQUE = /^(DIV|P|LI|UL|OL|H[1-6]|BLOCKQUOTE|PRE|SECTION|ARTICLE|TABLE|TR)$/;
    (function walk(n, b, i) {
      n.childNodes.forEach(h => {
        if (h.nodeType === 3) {
          h.nodeValue.replace(/ /g, ' ').split('\n').forEach((p, k) => {
            if (k > 0) { if (cur === null) out.push([]); else cerrar(); }
            if (p) { if (cur === null) cur = []; cur.push({t:p, b, i}); }
          });
        } else if (h.nodeType === 1) {
          const tag = h.tagName, st = h.style || {};
          if (tag === 'BR') { if (cur === null) out.push([]); else cerrar(); return; }
          if (tag === 'SCRIPT' || tag === 'STYLE') return;
          const nb = b || tag === 'B' || tag === 'STRONG' || st.fontWeight === 'bold' || parseInt(st.fontWeight, 10) >= 600;
          const ni = i || tag === 'I' || tag === 'EM' || st.fontStyle === 'italic';
          if (BLOQUE.test(tag)) { cerrar(); walk(h, nb, ni); cerrar(); } else walk(h, nb, ni);
        }
      });
    })(el, false, false);
    cerrar();
    return out.map(normalizarRuns);
  }
  const quitarVaciasFinales = (ls) => { const c = ls.slice(); while (c.length && !plano(c[c.length - 1]).trim()) c.pop(); return c; };
  const igualesTexto = (a, b) => JSON.stringify(quitarVaciasFinales(a).map(normalizarRuns)) === JSON.stringify(quitarVaciasFinales(b).map(normalizarRuns));
  const editado = (id) => !!D.texto[id] && !igualesTexto(D.texto[id], TEXTO_DEF[id] || []);
  const runHTML = (r) => { let h = esc(r.t); if (r.i) h = `<i>${h}</i>`; if (r.b) h = `<b>${h}</b>`; return h; };
  const htmlEditor = (ls) => ls.map(l => `<div>${l.length ? l.map(runHTML).join('') : '<br>'}</div>`).join('');

  /* texto del contrato → HTML: [marcadores] en gris, datos de la empresa en su lugar, enlaces www.* (solo QR) */
  function marcar(t, op) {
    const claves = op.datos ? Object.keys(op.datos) : [];
    const re = new RegExp(`(\\[[^\\]]*\\]${claves.map(k => '|' + escRe(k)).join('')})`, 'g');
    let out = '', i = 0, m;
    while ((m = re.exec(t))) {
      out += llano(t.slice(i, m.index), op);
      const tok = m[0], val = op.datos && op.datos[tok];
      if (val) out += `<span class="ctd-dato">${esc(val)}</span>`;
      else if (tok[0] === '[') out += `<span class="ctd-ph">${esc(tok)}</span>`;
      else out += llano(tok, op);
      i = re.lastIndex;
    }
    return out + llano(t.slice(i), op);
  }
  function llano(t, op) {
    const h = esc(t);
    return op.enlaces ? h.replace(/\bwww\.[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:\/[^\s<]*)?/gi, s => `<span class="ctd-lk">${s}</span>`) : h;
  }
  function htmlRuns(runs, op) {
    op = op || {};
    return runs.map(r => { let h = marcar(r.t, op); if (r.i) h = `<i>${h}</i>`; if (r.b) h = `<b>${h}</b>`; return h; }).join('');
  }
  /* parte un renglón en la posición idx del texto plano */
  function cortar(runs, idx) {
    const a = [], b = []; let n = 0;
    runs.forEach(r => {
      if (n + r.t.length <= idx) a.push(r);
      else if (n >= idx) b.push(r);
      else { a.push(Object.assign({}, r, {t:r.t.slice(0, idx - n)})); b.push(Object.assign({}, r, {t:r.t.slice(idx - n)})); }
      n += r.t.length;
    });
    return [normalizarRuns(a), normalizarRuns(b)];
  }

  /* ---------- Colores: contraste para texto sobre fondos y acentos ---------- */
  function lum(hex) {
    const n = parseInt(hex.slice(1), 16), c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  const contraste = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  /* Q8: la tinta que más contrasta (con esta paleta siempre gana la oscura) */
  const tintaSobre = (bg) => contraste(bg, '#2A2C2F') >= contraste(bg, '#FFFFFF') ? '#2A2C2F' : '#FFFFFF';
  /* la primera tinta de la lista que alcanza el contraste pedido sobre el fondo; si ninguna, la que más contrasta */
  function tintaPara(bg, candidatas, min) {
    let mejor = candidatas[0], kMejor = 0;
    for (const t of candidatas) { const k = contraste(bg, t); if (k >= min) return t; if (k > kMejor) { kMejor = k; mejor = t; } }
    return mejor;
  }
  /* Tintas de texto sobre un Color de fondo. Los grises de Figma (marcadores, notas, enlaces) se pensaron para blanco:
     sobre amarillo, azul, verde, rojo o lila bajan a ~1.4:1. Se oscurecen hasta 4.5:1 (texto) o 3:1 (marcadores).
     --b-* = bloques del editor; --h-* = hoja guardada y Vista previa (sus valores de origen viven en .ctd-hoja). */
  const TINTAS = [
    ['--b-ink', '#2A2C2F', ['#2A2C2F', '#1D1E20', '#FFFFFF'], 4.5],
    ['--b-title', '#1D1E20', ['#1D1E20', '#FFFFFF'], 4.5],
    ['--b-muted', '#54575C', ['#54575C', '#2A2C2F', '#1D1E20', '#FFFFFF'], 4.5],
    ['--b-lk', '#5A5AFF', ['#5A5AFF', '#0D166B', '#FFFFFF'], 4.5],
    ['--h-muted', '#6B7192', ['#6B7192', '#54575C', '#2A2C2F', '#1B1F3B', '#FFFFFF'], 4.5],
    ['--h-ph', '#A6ABC6', ['#A6ABC6', '#6B7192', '#54575C', '#2A2C2F', '#FFFFFF'], 3],
    ['--h-lk', '#5A5AFF', ['#5A5AFF', '#0D166B', '#FFFFFF'], 4.5],
  ];
  function varsBloque(id) {
    const v = [];
    const f = fondoDe(id);
    if (f !== FONDO_DEF) {
      v.push(`--b-bg:${f}`);
      TINTAS.forEach(([n, base, cands, min]) => { const t = tintaPara(f, cands, min); if (t !== base) v.push(`${n}:${t}`); });
    }
    const a = acentoDe(id);
    if (SEC[id].ctrl.includes('acento') && a !== ACENTO_DEF) {
      /* el acento pinta encabezados y bordes de la tabla; si casi no se ve sobre blanco, el borde queda gris */
      v.push(`--ac-bg:${a}`, `--ac-bd:${contraste(a, '#FFFFFF') >= 1.25 ? a : '#D4D6D8'}`, `--ac-ink:${tintaSobre(a)}`);
    }
    return v.join(';');
  }

  /* ---------- Vista del editor: columna de configuración ---------- */
  function pestanaBtn(id, l) {
    const on = U.pestana === id;
    return `<button type="button" role="tab" class="ctd-tab" id="ctd-tab-${id}" aria-selected="${on}" aria-controls="ctd-panel" tabindex="${on ? 0 : -1}" data-ctd="tab" data-v="${id}" data-foco="tab-${id}">${l}</button>`;
  }
  function panelContenido() {
    const n = D.orden.length;
    return `<div class="ctd-cab"><h2 class="ctd-cab__t">Organiza tu contrato</h2><p class="ctd-cab__d">Aquí podrás ver y/o agregar las secciones que tendrá el contrato digital.</p></div>
      <ol class="ctd-lista" aria-label="Secciones del contrato">${D.orden.map((id, i) => {
        const s = SEC[id], on = !!D.activo[id];
        return `<li class="ctd-fila${on ? '' : ' is-off'}" data-id="${id}">
          <button type="button" class="ctd-asa" data-ctd="asa" data-id="${id}" data-foco="asa-${id}" aria-label="Mover ${esc(s.nombre)}. Posición ${i + 1} de ${n}" aria-describedby="ctd-asa-ayuda">${ic('drag', 20)}</button>
          <span class="ctd-fila__n" data-ctd="fila" data-id="${id}">${esc(s.nombre)}</span>
          <label class="ctd-sw"><input type="checkbox" role="switch" data-ctd="sw" data-id="${id}" data-foco="sw-${id}" aria-label="Incluir ${esc(s.nombre)} en el contrato"${on ? ' checked' : ''}><span class="ctd-sw__tr" aria-hidden="true"><span class="ctd-sw__kn">${on ? PULGAR_ON : PULGAR_OFF}</span></span></label>
        </li>`;
      }).join('')}</ol>
      <p class="ctd-sr" id="ctd-asa-ayuda">Arrastra la sección o usa las flechas arriba y abajo para cambiar su lugar.</p>`;
  }
  function grupoColores(tipo, lista, actual) {
    const lid = `ctd-l-${tipo}`;
    return `<div class="ctd-grupo"><span class="ctd-lbl" id="${lid}">${tipo === 'fondo' ? 'Color de fondo' : 'Color de acento'}</span>
      <div class="ctd-sws" role="radiogroup" aria-labelledby="${lid}">${lista.map(([c, n]) => {
        const on = c === actual;
        return `<button type="button" role="radio" class="ctd-sw8${c === '#FFFFFF' ? ' is-blanco' : ''}" style="--c:${c}" aria-checked="${on}" tabindex="${on ? 0 : -1}" aria-label="${n}" title="${n}" data-ctd="color" data-tipo="${tipo}" data-c="${c}" data-foco="${tipo}-${c}"></button>`;
      }).join('')}</div></div>`;
  }
  function grupoTexto(id) {
    return `<div class="ctd-grupo"><span class="ctd-lbl" id="ctd-l-texto">Texto</span>
      <div class="ctd-texto" contenteditable="true" role="textbox" aria-multiline="true" aria-labelledby="ctd-l-texto" spellcheck="true" data-ctd="texto" data-id="${id}" data-foco="texto">${htmlEditor(textoDe(id))}</div>
      <div class="ctd-bi" role="toolbar" aria-label="Formato del texto">
        <button type="button" class="ctd-ib" data-ctd="fmt" data-cmd="bold" aria-pressed="false" aria-label="Negrita" title="Negrita" data-foco="fmt-bold">${ic('bold', 20)}</button>
        <button type="button" class="ctd-ib" data-ctd="fmt" data-cmd="italic" aria-pressed="false" aria-label="Cursiva" title="Cursiva" data-foco="fmt-italic">${ic('italic', 20)}</button>
      </div></div>`;
  }
  function grupoLogo() {
    if (D.logo) {
      return `<div class="ctd-grupo"><div class="ctd-logo-cab"><span class="ctd-lbl">Logo</span>
          <button type="button" class="ctd-ib ctd-ib--28" data-ctd="quitar-logo" aria-label="Eliminar logo" title="Eliminar logo" data-foco="quitar-logo">${ic('trash', 20)}</button></div>
        <div class="ctd-logo-banda"><img src="${esc(D.logo.url)}" alt="Logo de ${esc(E.nombre || CUENTA)}" width="72" height="72"></div></div>`;
    }
    return `<div class="ctd-grupo"><span class="ctd-lbl" id="ctd-l-logo">Logo</span>
      <div class="ctd-dz${U.logoErr ? ' is-err' : ''}" data-ctd="dz">
        <span class="ctd-dz__up" aria-hidden="true">${ic('upload', 24)}</span>
        <span class="ctd-dz__t">Arrastra elementos aquí o</span>
        <button type="button" class="ctd-dz__link" data-ctd="buscar-logo" data-foco="buscar-logo" aria-describedby="ctd-dz-ayuda${U.logoErr ? ' ctd-dz-err' : ''}">${ic('search', 20)}Busca archivos</button>
        <span class="ctd-sr" id="ctd-dz-ayuda">Logo en PNG, JPG o SVG</span>
      </div>${U.logoErr ? `<p class="ctd-err" id="ctd-dz-err" role="alert">${ic('close', 16)}<span>${esc(U.logoErr)}</span></p>` : ''}</div>`;
  }
  function grupoRedes() {
    return `<div class="ctd-grupo"><span class="ctd-lbl" id="ctd-l-redes">Enlace a tus redes</span>
      <div class="ctd-chips" role="group" aria-labelledby="ctd-l-redes">${REDES.map(r => {
        const on = !!D.redes[r.id];
        return `<button type="button" class="ctd-chip${on ? ' is-on' : ''}" aria-pressed="${on}" data-ctd="red" data-v="${r.id}" data-foco="red-${r.id}">${ic(r.id, 20, 'ctd-chip__red')}<span>${r.l}</span>${on ? ic('check', 20) : ''}</button>`;
      }).join('')}</div></div>
      <div class="ctd-grupo"><label class="ctd-lbl" for="ctd-ident">Identificador de redes sociales</label>
        <input class="ctd-inp" id="ctd-ident" type="text" data-ctd="ident" data-foco="ident" value="${esc(D.identificador)}" placeholder="@prestaya" maxlength="40" autocomplete="off" spellcheck="false"></div>`;
  }
  function panelEstilos() {
    const id = U.sel;
    if (!id) return '<p class="ctd-vacio">Activa al menos una sección en Contenido para cambiar sus estilos.</p>';
    const s = SEC[id];
    const partes = s.ctrl.map(c => {
      if (c === 'logo') return grupoLogo();
      if (c === 'fondo') return grupoColores('fondo', FONDOS, fondoDe(id));
      if (c === 'acento') return grupoColores('acento', ACENTOS, acentoDe(id));
      if (c === 'texto') return grupoTexto(id);
      if (c === 'enlace') return `<div class="ctd-grupo"><label class="ctd-lbl" for="ctd-qr">Enlace de código QR</label><input class="ctd-inp" id="ctd-qr" type="text" readonly value="${esc(enlaceQR())}" data-foco="qr"></div>`;
      if (c === 'redes') return grupoRedes();
      return '';
    }).join('');
    /* Figma no rotula la sección elegida (se ve por el contorno en el contrato); cuando las columnas se apilan, sí */
    return `<p class="ctd-estilos-de"><span class="ctd-estilos-de__l">Sección:</span> ${esc(s.nombre)}</p>${partes}`;
  }

  /* ---------- Vista del editor: contrato (Diseño de contrato 01, nodo 4895:15361) ---------- */
  function barraFormato(k, enVista) {
    const f = formatoActual(), ab = U.abierto === k;
    return `<div class="ctd-fbar">
      <div class="ctd-fbar__izq">
        <span class="ctd-fbar__l" id="ctd-l-formato-${k}">Formato:</span>
        <div class="ctd-sel${ab ? ' is-abierto' : ''}">
          <button type="button" class="ctd-sel__btn" data-ctd="sel" data-k="${k}" data-foco="sel-${k}" aria-haspopup="listbox" aria-expanded="${ab}"${ab ? ` aria-controls="ctd-lb-${k}"` : ''} aria-labelledby="ctd-l-formato-${k} ctd-sv-${k}"><span id="ctd-sv-${k}">${esc(f.l)}</span>${ic('down', 24)}</button>
          ${ab ? `<ul class="ctd-sel__lista" role="listbox" id="ctd-lb-${k}" aria-labelledby="ctd-l-formato-${k}">${FORMATOS.map(o => `<li role="option" tabindex="-1" aria-selected="${o.v === D.formato}" data-ctd="opt" data-k="${k}" data-v="${o.v}"><span>${esc(o.l)}</span>${o.v === D.formato ? ic('check', 20) : ''}</li>`).join('')}</ul>` : ''}
        </div>
        <button type="button" class="ctd-chip ctd-chip--40${D.dobleCara ? ' is-on' : ''}" aria-pressed="${D.dobleCara}" data-ctd="doble" data-foco="doble-${k}">Doble cara${D.dobleCara ? ic('check', 20) : ''}</button>
      </div>
      ${enVista ? '' : '<button type="button" class="ctd-btn ctd-btn--ter" data-ctd="vista" data-foco="vista" aria-haspopup="dialog">Vista previa</button>'}
    </div>`;
  }
  /* párrafos de las secciones de texto con sus reglas de color (SPEC §3.4) */
  function prevTexto(id) {
    const ls = noVacias(textoDe(id));
    const ps = [];
    ls.forEach(l => {
      const t = plano(l).trim(), op = {datos:datosDe(id, t)};
      let cls = '', pre = '';
      if (id === 'plazo' && !/\[/.test(t)) cls = 'ctd-muted';
      if (id === 'dudas') {
        if (l.every(r => r.b || !r.t.trim())) cls = 'ctd-tt';
        else if (!(l[0] && l[0].b)) pre = '• ';
      }
      const h = pre + htmlRuns(l, op);
      /* Partes: "Con cotitular…" y "Con beneficiario…" siguen al párrafo del Consumidor, como en Figma */
      if (id === 'partes' && /^con /i.test(t) && ps.length) ps[ps.length - 1].h += '<br>' + h;
      else ps.push({cls, h});
    });
    return `<div class="ctd-pt">${ps.map(p => `<p${p.cls ? ` class="${p.cls}"` : ''}>${p.h}</p>`).join('')}</div>`;
  }
  /* Tabla financiera: cada renglón en negritas (o con el nombre de un encabezado conocido) abre una columna */
  const CAB_FIN = ['costo anual total', 'tasa de interés anual', 'monto del préstamo', 'monto del prestamo', 'monto total a pagar', 'comisiones'];
  function columnasFin(ls) {
    const cols = []; let pie = null;
    noVacias(ls).forEach(l => {
      const t = plano(l).trim();
      if (/^metodolog/i.test(t)) { pie = l; return; }
      const negrita = l.every(r => r.b || !r.t.trim());
      if (negrita || CAB_FIN.includes(t.toLowerCase().replace(/:$/, ''))) cols.push({cab:l, cuerpo:[]});
      else if (cols.length) cols[cols.length - 1].cuerpo.push(l);
      else cols.push({cab:[], cuerpo:[l]});
    });
    return {cols, pie};
  }
  function celdaFin(l, i) {
    const t = plano(l), k = t.search(/\s*TASA FIJA\s*$/);
    if (k > 0) { const [a, b] = cortar(l, k); return `${htmlRuns(a)}<br><span class="${i === 0 ? 'ctd-mini' : ''}">${htmlRuns(b).trim()}</span>`; }
    return htmlRuns(l);
  }
  function prevFinanciera(id) {
    const {cols, pie} = columnasFin(textoDe(id));
    if (!cols.length && !pie) return '<p class="ctd-muted">Escribe los encabezados de la tabla en Texto.</p>';
    const esCom = (c, i) => i === cols.length - 1 && /comisi/i.test(plano(c.cab));
    return `<div class="ctd-tw"><table class="ctd-t ctd-t--fin">
      <thead><tr>${cols.map((c, i) => `<th${esCom(c, i) ? ' class="is-com"' : ''}>${htmlRuns(c.cab)}</th>`).join('')}</tr></thead>
      <tbody><tr>${cols.map((c, i) => esCom(c, i)
        ? `<td class="is-com"><ul>${c.cuerpo.map(l => { const t = plano(l), k = t.search(/\s*\[Cl[aá]us[^\]]*\]\s*$/i); if (k > 0) { const [a, b] = cortar(l, k); return `<li><span>${htmlRuns(a)}</span><span class="ctd-cl">${htmlRuns(b).trim()}</span></li>`; } return `<li><span>${htmlRuns(l)}</span></li>`; }).join('')}</ul></td>`
        : `<td>${c.cuerpo.map(l => celdaFin(l, i)).join('<br>')}</td>`).join('')}</tr>
      ${pie ? `<tr class="ctd-t__pie"><td colspan="${Math.max(cols.length, 1)}">${htmlRuns(pie)}</td></tr>` : ''}</tbody></table></div>`;
  }
  function prevColumnas(id) {
    const ls = noVacias(textoDe(id));
    if (!ls.length) return '<p class="ctd-muted">Escribe los encabezados de la tabla en Texto.</p>';
    return `<div class="ctd-tw"><table class="ctd-t ctd-t--cols ctd-t--${id}"><thead><tr>${ls.map(l => `<th>${htmlRuns(l)}</th>`).join('')}</tr></thead>
      <tbody><tr>${ls.map(() => '<td></td>').join('')}</tr></tbody></table></div>`;
  }
  /* Desempeño y firma: renglón 1 = encabezado izquierdo; "Firmas" (o el renglón que sigue a la primera "Fecha:") = derecho */
  function partesDesempeno(ls) {
    ls = noVacias(ls);
    let k = ls.findIndex((l, i) => i > 0 && /^firmas?$/i.test(plano(l).trim()));
    if (k < 0) { const f = ls.findIndex((l, i) => i > 0 && /^fecha/i.test(plano(l).trim())); k = f >= 0 && f + 1 < ls.length ? f + 1 : -1; }
    return {cabI:ls[0] || [], izq:ls.slice(1, k < 0 ? ls.length : k), cabD:k >= 0 ? ls[k] : null, der:k >= 0 ? ls.slice(k + 1) : []};
  }
  /* Figma (Diseño de contrato 01, 15 y 16): el Texto predeterminado trae "**EL CONSUMIDOR**" y las etiquetas de Firma en
     negritas, pero el contrato los dibuja Regular. Mientras el Texto no se edite, la vista del editor los muestra Regular;
     en cuanto se edita, el contrato sigue exactamente lo que dice el Texto. */
  const sinNegritas = (l) => l.map(r => Object.assign({}, r, {b:false}));
  function prevDesempeno(id) {
    const p = partesDesempeno(textoDe(id)), op = {datos:datosDe(id, '')}, comoFigma = !editado(id);
    const cuerpo = (ls) => ls.map(l => { if (comoFigma) l = sinNegritas(l); return /^fecha:/i.test(plano(l).trim()) ? `<p class="ctd-fecha">${htmlRuns(l, op)}</p>` : `<p class="ctd-p12">${htmlRuns(l, op)}</p>`; }).join('');
    return `<div class="ctd-tw"><table class="ctd-t ctd-t--des"><thead><tr><th>${htmlRuns(p.cabI)}</th>${p.cabD ? `<th>${htmlRuns(p.cabD)}</th>` : ''}</tr></thead>
      <tbody><tr><td>${cuerpo(p.izq)}</td>${p.cabD ? `<td>${cuerpo(p.der)}</td>` : ''}</tr></tbody></table></div>`;
  }
  function logoHTML(cls) {
    return `<span class="${cls}">${D.logo ? `<img src="${esc(D.logo.url)}" alt="" width="38" height="38">` : ''}</span>`;
  }
  function iconosRedes() {
    return REDES.filter(r => D.redes[r.id]).map(r => `<span class="ctd-pr__ic" title="${r.l}">${ic(r.id, 24)}<span class="ctd-sr">${r.l}</span></span>`).join('');
  }
  function contenidoPrev(id) {
    switch (id) {
      case 'identidad': return `<div class="ctd-pi">${logoHTML('ctd-pi__logo')}<span class="ctd-pi__n">${esc(razon())}</span></div>`;
      case 'folio': return `<div class="ctd-pf">${noVacias(textoDe(id)).map(l => `<p>${htmlRuns(l)}</p>`).join('')}</div>`;
      case 'financiera': return prevFinanciera(id);
      case 'opciones': case 'prenda': return prevColumnas(id);
      case 'desempeno': return prevDesempeno(id);
      case 'firma': {
        const comoFigma = !editado(id);   /* ver sinNegritas() */
        return `<div class="ctd-pfir">${noVacias(textoDe(id)).map(l => `<div class="ctd-pfir__c"><span class="ctd-pfir__l" aria-hidden="true"></span><span class="ctd-pfir__t">${htmlRuns(comoFigma ? sinNegritas(l) : l)}</span></div>`).join('')}</div>`;
      }
      case 'qr': return `<div class="ctd-pq"><p>${noVacias(textoDe(id)).map(l => htmlRuns(l, {enlaces:true})).join('<br>')}</p><span class="ctd-pq__qr" role="img" aria-label="Código QR">${ic('qr2', 52)}</span></div>`;
      case 'redes': {
        const ics = iconosRedes();
        return `<div class="ctd-pr"><span>Síguenos en</span>${ics ? `<span class="ctd-pr__ics">${ics}</span>` : '<span class="ctd-ph">[Elige tus redes]</span>'}${D.identificador.trim() ? `<span class="ctd-pr__id">${esc(D.identificador.trim())}</span>` : ''}</div>`;
      }
      default: return prevTexto(id);
    }
  }
  function bloque(id) {
    const s = SEC[id], sel = U.pestana === 'estilos' && U.sel === id;
    return `<section class="ctd-b ctd-b--${id}${sel ? ' is-sel' : ''}" data-ctd="bloque" data-id="${id}" aria-label="${esc(s.nombre)}" style="${varsBloque(id)}">
      <button type="button" class="ctd-b__sel" data-ctd="bloque" data-id="${id}" data-foco="bloque-${id}" aria-pressed="${sel}">Editar estilos de ${esc(s.nombre)}</button>
      ${contenidoPrev(id)}
    </section>`;
  }
  function bloques() {
    const vis = D.orden.filter(id => D.activo[id]);
    return vis.length ? vis.map(bloque).join('') : '<p class="ctd-vacio ctd-vacio--prev">Todas las secciones están ocultas. Actívalas en Contenido para verlas aquí.</p>';
  }
  function vistaEditor() {
    const est = U.pestana === 'estilos';
    return `<div class="ctd-cq"><div class="ctd-ed">
      <div class="ctd-col-conf">
        <section class="ctd-conf${est ? ' is-estilos' : ''}" aria-label="Diseño del contrato">
          <div class="ctd-tabs" role="tablist" aria-label="Configura el diseño">${pestanaBtn('contenido', 'Contenido')}${pestanaBtn('estilos', 'Estilos')}</div>
          <div class="ctd-panel" role="tabpanel" id="ctd-panel" aria-labelledby="ctd-tab-${U.pestana}">${est ? panelEstilos() : panelContenido()}</div>
        </section>
        <div class="ctd-pie">
          <button type="button" class="ctd-btn ctd-btn--ter" data-ctd="cancelar" data-foco="cancelar"${U.guardando ? ' disabled' : ''}>Cancelar</button>
          <button type="button" class="ctd-btn ctd-btn--pri${U.guardando ? ' is-cargando' : ''}" data-ctd="guardar" data-foco="guardar" aria-busy="${U.guardando}">${U.guardando ? '<span class="ctd-spin" aria-hidden="true"></span>' : ''}<span class="ctd-btn__t">Guardar cambios</span></button>
        </div>
      </div>
      <section class="ctd-prev" aria-label="Vista del contrato">
        ${barraFormato('e')}
        <div class="ctd-bloques">${bloques()}</div>
      </section>
    </div></div>`;
  }

  /* ---------- Hoja del contrato (427 "Cambios Guardados" y Vista previa) ----------
     Plantilla propia (SPEC Q5: el texto legal de la hoja es más corto que el del editor). Respeta el orden, lo que está
     apagado, el fondo y el acento de cada sección; si el Texto de una sección se editó, la hoja usa ese texto. */
  const ph = (t) => `<span class="ctd-ph">${esc(t)}</span>`;
  const val = (v, marcador) => v ? `<span class="ctd-dato">${esc(v)}</span>` : ph(marcador);
  const lk = (t) => `<span class="ctd-lk">${esc(t)}</span>`;
  function tablaHoja(cabs, filas, anchos) {
    return `<table class="ctd-ht">${anchos ? `<colgroup>${anchos.map(a => `<col style="width:${(a / 525 * 100).toFixed(2)}%">`).join('')}</colgroup>` : ''}
      <thead><tr>${cabs.map(c => `<th>${c}</th>`).join('')}</tr></thead>
      <tbody>${filas.map(f => `<tr>${f.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }
  const firmasHoja = (cs) => `<div class="ctd-hfir">${cs.map(c => `<div class="ctd-hfir__c"><span class="ctd-hfir__l" aria-hidden="true"></span><span class="ctd-hfir__t">${c}</span></div>`).join('')}</div>`;
  const parrafosHoja = (id, ls) => noVacias(ls).map(l => `<p>${htmlRuns(l, {datos:datosDe(id, plano(l).trim()), enlaces:id === 'qr'})}</p>`).join('');
  function hojaSeccion(id) {
    const s = SEC[id], ed = editado(id);
    const tit = s.titulo ? `<h3 class="ctd-hs__t">${esc(s.titulo)}</h3>` : '';
    let h = '';
    switch (id) {
      case 'identidad':
        h = `<div class="ctd-hid">${logoHTML('ctd-hid__logo')}<div><p class="ctd-hid__n">${esc(razon())}</p>
          <p class="ctd-hid__s">RFC: ${val(E.rfc, '[RFC]')} · ${val(domicilioCorto(), '[Domicilio fiscal]')}</p></div></div><hr class="ctd-hid__r">`;
        break;
      case 'folio':
        h = `<div class="ctd-hcaja">${ed ? noVacias(textoDe(id)).map(l => `<span>${htmlRuns(l)}</span>`).join('') : `<span>Fecha: ${ph('[DD/MM/AAAA]')}</span><span>Folio: ${ph('[000000]')}</span>`}</div>`;
        break;
      case 'partes':
        h = tit + (ed ? parrafosHoja(id, textoDe(id)) : `<p><b>Proveedor:</b> ${esc(razon())}, representada por ${val(E.representante, '[Nombre del representante]')}.</p>
          <p><b>Consumidor:</b> ${ph('[Nombre, primer y segundo apellido]')}, identificado con ${ph('[INE No.]')}.</p>`);
        break;
      case 'financiera':
        if (ed) {
          const {cols, pie} = columnasFin(textoDe(id));
          h = tit + (cols.length ? tablaHoja(cols.map(c => htmlRuns(c.cab)), [cols.map(() => ph('[—]'))]) : '') + (pie ? `<p class="ctd-hnota">${htmlRuns(pie)}</p>` : '');
        } else {
          h = tit + tablaHoja(['CAT', 'Tasa anual', 'Préstamo', 'Total a pagar', 'Comisiones'], [[ph('(num) %'), ph('(num) %'), ph('$ [imp]'), ph('$ [imp]'), ph('$ [imp]')]], [86.6, 105.4, 96.1, 125.6, 110.8])
            + '<p class="ctd-hnota">El CAT es un indicador del costo total del crédito. No incluye IVA.</p>';
        }
        break;
      case 'plazo':
        h = tit + (ed ? parrafosHoja(id, textoDe(id)) : `<p>El plazo del mutuo es de ${ph('[N]')} días naturales. Métodos: efectivo en sucursal, transferencia SPEI a CLABE ${ph('[18 dígitos]')}, y pago en línea en ${lk('www.ataskate.mx')}.</p>`);
        break;
      case 'iva':
        h = tit + (ed ? parrafosHoja(id, textoDe(id)) : `<p>Los importes señalados no incluyen IVA del ${ph('(num) %')}. Para el procedimiento de desempeño anticipado y refrendo, véase el Reglamento de la LFPC.</p>`);
        break;
      case 'dudas':
        h = tit + (ed ? parrafosHoja(id, textoDe(id)) : `<p>PROFECO: 800 468 8722 · CDMX: 55 5625 6700 · ${lk('concilianet.profeco.gob.mx')}. El proveedor atiende en sucursal o en ${val(E.correo, 'atencion@ataskate.mx')}.</p>`);
        break;
      case 'profeco':
        h = tit + (ed ? parrafosHoja(id, textoDe(id)) : `<p>Contrato inscrito en el RPCA bajo el número ${val(E.rpcaNumero, '[RPCA-0000-000]')}${E.rpcaFecha ? `, de fecha ${esc(fechaLarga(E.rpcaFecha))}` : ''}, conforme a los artículos 86 y 87 de la LFPC.</p>`);
        break;
      case 'opciones': {
        const cabs = ed ? noVacias(textoDe(id)).map(l => htmlRuns(l)) : ['Opc.', 'Mutuo', 'Interés', 'Almacenaje', 'IVA', 'Refrendo', 'Desempeño', 'Fecha'];
        const fila = () => cabs.map(() => ph('[—]'));
        h = tit + tablaHoja(cabs, [fila(), fila(), fila()], ed ? null : [46.1, 58.5, 61.5, 93.1, 39.9, 76.6, 94.4, 54.3]);
        break;
      }
      case 'prenda': {
        const cabs = ed ? noVacias(textoDe(id)).map(l => htmlRuns(l)) : ['Descripción', 'Características', 'Avalúo', 'Préstamo', '% Prés./avalúo'];
        const fila = ed ? () => cabs.map(() => ph('[—]')) : () => [ph('[Artículo]'), ph('[Marca, modelo]'), ph('$ [imp]'), ph('$ [imp]'), ph('(num) %')];
        h = tit + tablaHoja(cabs, [fila(), fila()], ed ? null : [103.8, 134.7, 69.7, 88.5, 127.9]);
        break;
      }
      case 'desempeno': {
        const p = ed ? partesDesempeno(textoDe(id)) : null;
        h = tit + (ed ? p.izq.filter(l => !/^fecha:/i.test(plano(l).trim())).map(l => `<p>${htmlRuns(l, {datos:datosDe(id, '')})}</p>`).join('')
          : '<p>He leído y acepto los términos del presente contrato. Reconozco que recibí copia del mismo.</p>')
          + firmasHoja(['Consumidor', 'Proveedor', 'Valuador']);
        break;
      }
      case 'firma':
        h = ed ? firmasHoja(noVacias(textoDe(id)).map(l => htmlRuns(l)))
          : firmasHoja([`Firma del titular · ${ph('[Nombre]')}`, `Firma del testigo · ${ph('[Nombre]')}`]);
        break;
      case 'qr':
        h = `<div class="ctd-hqr"><span class="ctd-hqr__c" role="img" aria-label="Código QR">${ic('qr', 26)}</span><div>${ed ? parrafosHoja(id, textoDe(id))
          : `<p class="ctd-hqr__t">Refrenda o desempeña en línea</p><p class="ctd-hqr__s">Escanea el QR en ${lk('www.ataskate.mx')} y paga fácil.</p>`}</div></div>`;
        break;
      case 'redes': {
        const usr = D.identificador.trim();
        const items = REDES.filter(r => D.redes[r.id]).map(r => `<span>• ${r.l} ${usr ? esc(usr) : ph('[@usuario]')}</span>`);
        h = `<p class="ctd-hredes"><span class="ctd-hredes__l">Síguenos</span>${items.join('') || ph('[Elige tus redes]')}</p>`;
        break;
      }
    }
    return `<section class="ctd-hs ctd-hs--${id}${fondoDe(id) !== FONDO_DEF ? ' con-fondo' : ''}" style="${varsBloque(id)}">${h}</section>`;
  }
  function hojaHTML() {
    const f = formatoActual(), vis = D.orden.filter(id => D.activo[id]);
    return `<article class="ctd-hoja${D.dobleCara ? ' is-doble' : ''}" aria-label="Contrato, hoja 1 de 1, ${f.c}" style="min-height:${Math.round(HOJA_W * f.r)}px">
      ${vis.length ? vis.map(hojaSeccion).join('') : '<p class="ctd-hvacia">No hay secciones activas. Actívalas en Contenido.</p>'}</article>`;
  }
  const etiquetaHoja = () => `Hoja 1 de 1 — ${formatoActual().c}${D.dobleCara ? ' · Doble cara' : ''}`;
  function vistaGuardado() {
    return `<div class="ctd-cq"><section class="ctd-gcard" aria-label="Diseño del contrato guardado" tabindex="-1" data-foco="gcard">
      ${C.ctx.botonEditar === false ? '' : `<div class="ctd-gcard__acc"><button type="button" class="ctd-btn ctd-btn--ter ctd-btn--ic" data-ctd="editar" data-foco="editar">${ic('edit', 20)}Editar</button></div>`}
      <div class="ctd-harea" data-max="1.4"><div class="ctd-hzoom">${hojaHTML()}</div></div>
      <p class="ctd-hpie">${etiquetaHoja()}</p>
    </section></div>`;
  }
  /* Vista previa01/02: reemplaza el área de contenido (sin título, pestañas ni columna de configuración) */
  function vistaPreviaHTML() {
    return `<div class="ctd-vp" role="dialog" aria-modal="true" aria-labelledby="ctd-vp-t">
      <div class="ctd-vp__in">
        <div class="ctd-vp__top"><p class="ctd-vp__t" id="ctd-vp-t">Esta vista es una previsualización de cómo quedará tu contrato</p>
          <button type="button" class="ctd-btn ctd-btn--ter ctd-btn--ic" data-ctd="salir-vista" data-foco="salir-vista">${ic('close', 20)}Salir vista previa</button></div>
        <p class="ctd-hpie">${etiquetaHoja()}</p>
        ${barraFormato('v', true)}
        <div class="ctd-harea" data-max="1.5"><div class="ctd-hzoom">${hojaHTML()}</div></div>
      </div></div>`;
  }
  /* mismo texto y botones que el "¿Salir sin guardar?" del módulo (empresa.js) */
  function modalHTML() {
    return `<div class="ctd-ov" data-ctd="ov"><div class="ctd-modal" role="alertdialog" aria-modal="true" aria-labelledby="ctd-m-t" aria-describedby="ctd-m-d">
      <div class="ctd-modal__h"><h2 id="ctd-m-t">¿Salir sin guardar?</h2><button type="button" class="ctd-mx" data-ctd="m-cerrar" aria-label="Cerrar" data-foco="m-x">${ic('close', 24)}</button></div>
      <p class="ctd-modal__b" id="ctd-m-d">Los cambios que no guardaste en el diseño del contrato se van a perder.</p>
      <div class="ctd-modal__f"><button type="button" class="ctd-btn ctd-btn--ter" data-ctd="m-cerrar" data-foco="m-seguir">Cancelar</button><button type="button" class="ctd-btn ctd-btn--des" data-ctd="m-descartar" data-foco="m-descartar">Salir sin guardar</button></div>
    </div></div>`;
  }

  /* ---------- Pintar ---------- */
  function claveFoco() {
    const a = document.activeElement;
    if (!a || !((C.raiz && C.raiz.contains(a)) || (C.capa && C.capa.contains(a)))) return null;
    const el = a.closest('[data-foco]');
    return el ? el.dataset.foco : null;
  }
  function enfocar(clave) {
    if (!clave) return;
    const sel = `[data-foco="${clave.replace(/"/g, '\\"')}"]`;
    const el = (C.capa && C.capa.querySelector(sel)) || (C.raiz && C.raiz.querySelector(sel));
    if (el) el.focus({preventScroll:true});
  }
  function pintar(foco) {
    if (!C.cuerpo) return;
    const clave = foco || claveFoco(), y = window.scrollY;
    const vp = C.capa && C.capa.querySelector('.ctd-vp'), vpY = vp ? vp.scrollTop : 0;
    C.cuerpo.innerHTML = U.guardado ? vistaGuardado() : vistaEditor();
    pintarCapas();
    const vp2 = C.capa && C.capa.querySelector('.ctd-vp');
    if (vp2 && vp) vp2.scrollTop = vpY;
    ajustar();
    if (window.scrollY !== y) window.scrollTo(0, y);
    enfocar(clave);
  }
  /* repinta un solo bloque del contrato (al escribir en Texto o en el identificador; no toca el editor) */
  function repintarBloque(id) {
    const b = C.cuerpo && C.cuerpo.querySelector(`.ctd-b[data-id="${id}"]`);
    if (b) b.outerHTML = bloque(id);
  }
  function anunciar(msg) {
    const v = C.raiz && C.raiz.querySelector('.ctd-live');
    if (!v) return;
    v.textContent = '';
    setTimeout(() => { v.textContent = msg; }, 30);
  }
  function emitir(ev) {
    const f = C.ctx && C.ctx.onChange;
    if (typeof f !== 'function') return;
    try { f(Object.assign({estado:estado()}, ev)); } catch (e) { console.error('[CtrDiseno] onChange', e); }
  }
  /* avisa "hay cambios sin guardar" solo cuando cambia (para no provocar repintados mientras se escribe) */
  function cambio() {
    const s = estaSucio();
    if (s !== U.sucio) { U.sucio = s; emitir({tipo:'cambio', dirty:s}); }
  }
  function estado() {
    return {dirty:estaSucio(), guardado:U.guardado, vista:U.vista, diseno:clonar(D)};
  }

  /* ---------- Capas en <body>: Vista previa y modal ---------- */
  let obsCapa = null, overflowPrevio = null;
  function pintarCapas() {
    const hay = !!(U.vista || U.confirmar);
    if (!hay) { quitarCapa(); return; }
    if (!C.capa || !C.capa.isConnected) {
      C.capa = document.createElement('div');
      C.capa.className = 'ctd ctd-capas';
      C.capa.setAttribute('lang', 'es');
      document.body.appendChild(C.capa);
      enlazar(C.capa);
    }
    C.capa.innerHTML = (U.vista ? vistaPreviaHTML() : '') + (U.confirmar ? modalHTML() : '');
    if (overflowPrevio === null) { overflowPrevio = document.documentElement.style.overflow; document.documentElement.style.overflow = 'hidden'; }
    C.cuerpo.inert = true;
    posicionarVista();
    /* si la pantalla se va (otra ruta, otro render) sin cerrar la capa, se limpia sola */
    if (!obsCapa) {
      obsCapa = new MutationObserver(() => { if (!C.raiz || !C.raiz.isConnected) { U.vista = false; U.confirmar = false; U.abierto = null; quitarCapa(); } });
      obsCapa.observe(document.body, {childList:true, subtree:true, attributes:true, attributeFilter:['class']});
    }
  }
  function quitarCapa() {
    if (C.capa) { C.capa.remove(); C.capa = null; }
    if (overflowPrevio !== null) { document.documentElement.style.overflow = overflowPrevio; overflowPrevio = null; }
    if (C.cuerpo) C.cuerpo.inert = false;
    if (obsCapa) { obsCapa.disconnect(); obsCapa = null; }
  }
  /* la Vista previa empieza donde termina el menú lateral fijo (el padding izquierdo de .pos-cuerpo) */
  function posicionarVista() {
    const vp = C.capa && C.capa.querySelector('.ctd-vp');
    if (!vp) return;
    const cu = C.raiz && C.raiz.closest('.pos-cuerpo');
    let izq = 0;
    if (cu) izq = Math.max(0, cu.getBoundingClientRect().left + (parseFloat(getComputedStyle(cu).paddingLeft) || 0));
    vp.style.left = izq + 'px';
  }

  /* ---------- Ajustes de tamaño: escala de la hoja y columna de configuración fija ---------- */
  /* La hoja se ajusta al ancho disponible, pero no baja de ZOOM_MIN: a la escala de Figma el texto ya mide 7.5–9 px y a
     375 el ajuste lo dejaba en ~4 px. Cuando no cabe, el área se recorre de lado dentro de su tarjeta (sin scroll de página). */
  const ZOOM_MIN = 0.9;
  function ajustar() {
    document.querySelectorAll('.ctd .ctd-harea').forEach(a => {
      const z = a.querySelector('.ctd-hzoom');
      if (!z || !a.clientWidth) return;
      const cs = getComputedStyle(a), ancho = a.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
      const max = parseFloat(a.dataset.max) || 1.4, zoom = Math.max(ZOOM_MIN, Math.min(max, ancho / HOJA_W));
      z.style.zoom = zoom.toFixed(3);
      /* si se desborda, el área se puede recorrer con el teclado */
      const desborda = HOJA_W * zoom > ancho + 1;
      a.classList.toggle('is-desborda', desborda);
      if (desborda) { a.tabIndex = 0; a.setAttribute('role', 'region'); a.setAttribute('aria-label', 'Hoja del contrato. Desplázate a los lados para verla completa.'); }
      else { a.removeAttribute('tabindex'); a.removeAttribute('role'); a.removeAttribute('aria-label'); }
    });
    posicionarVista();
    const col = C.cuerpo && C.cuerpo.querySelector('.ctd-col-conf');
    if (col) {
      const head = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--pos-header-h')) || 56;
      const cabe = col.offsetHeight <= window.innerHeight - head - 32;
      col.classList.toggle('is-fija', !apilado() && cabe);
    }
  }
  const apilado = () => { const cq = C.cuerpo && C.cuerpo.querySelector('.ctd-cq'); return !cq || cq.clientWidth < 860; };

  /* ---------- Acciones ---------- */
  function irPestana(p) {
    U.pestana = p; U.abierto = null;
    if (p === 'estilos' && (!U.sel || !D.activo[U.sel])) U.sel = primeraVisible();
    pintar(`tab-${p}`);
  }
  const suave = () => (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) ? 'auto' : 'smooth';
  const altoHeader = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--pos-header-h')) || 56;
  function seleccionar(id, origen) {
    if (!D.activo[id]) return;
    U.sel = id; U.pestana = 'estilos'; U.abierto = null;
    pintar(origen === 'contrato' ? `bloque-${id}` : 'tab-estilos');
    anunciar(`Estilos de ${SEC[id].nombre}.`);
    if (origen === 'contrato') {
      /* apiladas: la configuración queda arriba del contrato. En dos columnas, si la columna no es fija (es más alta que la
         ventana, p. ej. Tabla financiera con su Texto largo) y su inicio quedó arriba del header, los colores no se verían */
      const conf = C.cuerpo.querySelector('.ctd-conf');
      if (conf && (apilado() || conf.getBoundingClientRect().top < altoHeader())) conf.scrollIntoView({behavior:suave(), block:'start'});
    }
    if (origen === 'lista') C.cuerpo.querySelector(`.ctd-b[data-id="${id}"]`)?.scrollIntoView({behavior:suave(), block:'nearest'});
  }
  function moverA(id, j) {
    const i = D.orden.indexOf(id), n = D.orden.length;
    j = Math.max(0, Math.min(n - 1, j));
    if (i < 0 || i === j) return;
    D.orden.splice(i, 1); D.orden.splice(j, 0, id);
    cambio(); pintar(`asa-${id}`);
    anunciar(`${SEC[id].nombre}: posición ${j + 1} de ${n}.`);
  }
  function cambiarActivo(id, on) {
    D.activo[id] = on;
    if (!on && U.sel === id) U.sel = null;
    cambio(); pintar(`sw-${id}`);
  }
  function cambiarColor(tipo, c) {
    const id = U.sel; if (!id) return;
    const def = tipo === 'fondo' ? FONDO_DEF : ACENTO_DEF;
    if (c === def) delete D[tipo][id]; else D[tipo][id] = c;
    cambio(); pintar(`${tipo}-${c}`);
  }
  function abrirSelect(k, foco) {
    U.abierto = k; pintar(`sel-${k}`);
    const lista = (C.capa && C.capa.querySelector(`#ctd-lb-${k}`)) || (C.raiz && C.raiz.querySelector(`#ctd-lb-${k}`));
    if (foco !== false && lista) (lista.querySelector('[aria-selected="true"]') || lista.querySelector('li')).focus();
  }
  function cerrarSelect(enfocarBtn) {
    const k = U.abierto; if (!k) return;
    U.abierto = null; pintar(enfocarBtn ? `sel-${k}` : null);
  }
  function abrirVista() {
    if (U.vista) return;
    U.vista = true; U.abierto = null; pintar('salir-vista');
    emitir({tipo:'vista', abierta:true});
  }
  function cerrarVista() {
    if (!U.vista) return;
    U.vista = false; U.abierto = null; pintar(U.guardado ? 'gcard' : 'vista');
    emitir({tipo:'vista', abierta:false});
  }
  function guardar() {
    if (U.guardando) return;
    U.guardando = true; U.abierto = null; pintar('guardar');
    anunciar('Guardando el diseño del contrato.');
    emitir({tipo:'guardando'});
    setTimeout(() => {
      U.guardando = false; G = clonar(D); U.guardado = true; U.vista = false; U.sucio = false;
      pintar('gcard');
      /* 427: arriba, con el título y las pestañas a la vista. Así "Editar" (arriba a la derecha de la hoja) no queda debajo
         del toast "Cambios guardados", que ocupa la esquina superior derecha y se queda mientras el puntero esté encima */
      window.scrollTo({top:0, behavior:suave()});
      if (typeof C.ctx.toast === 'function') { try { C.ctx.toast('success', 'Cambios guardados'); } catch (e) { /* sin toast */ } }
      else anunciar('Cambios guardados. Así se verá tu contrato.');
      emitir({tipo:'guardado', dirty:false});
    }, 800);
  }
  function cancelar() {
    if (U.guardando) return;
    if (estaSucio()) {
      if (typeof C.ctx.confirmar === 'function') {
        Promise.resolve(C.ctx.confirmar({titulo:'¿Salir sin guardar?', texto:'Los cambios que no guardaste en el diseño del contrato se van a perder.'}))
          .then(ok => { if (ok) descartar(); }).catch(() => {});
        return;
      }
      U.confirmar = true; U.abierto = null; pintar('m-seguir'); return;
    }
    if (G) { U.guardado = true; pintar('gcard'); emitir({tipo:'cancelado'}); }
    else emitir({tipo:'salir'});
  }
  function cerrarModal() { U.confirmar = false; pintar('cancelar'); }
  function descartar() {
    D = clonar(G ? G : disenoInicial());
    U.confirmar = false; U.abierto = null; U.logoErr = ''; U.sel = null; U.pestana = 'contenido';
    U.sucio = false;
    if (G) { U.guardado = true; pintar('gcard'); emitir({tipo:'cambio', dirty:false}); emitir({tipo:'cancelado'}); }
    else { pintar('cancelar'); emitir({tipo:'cambio', dirty:false}); emitir({tipo:'salir'}); }
    anunciar('Se descartaron los cambios del diseño.');
  }
  function editar() {
    U.guardado = false; U.vista = false; U.abierto = null;
    pintar('tab-' + U.pestana);
    emitir({tipo:'editar'});
  }
  const TIPOS_LOGO = ['image/png', 'image/jpeg', 'image/svg+xml'];
  function cargarLogo(file) {
    if (!file) return;
    if (!TIPOS_LOGO.includes(file.type)) { U.logoErr = 'Formato no permitido. Solo PNG, JPG o SVG.'; pintar('buscar-logo'); return; }
    const r = new FileReader();
    r.onload = () => { D.logo = {url:r.result, nombre:file.name}; U.logoErr = ''; cambio(); pintar('quitar-logo'); anunciar('Logo cargado.'); };
    r.readAsDataURL(file);
  }
  function aplicarFormato(cmd) {
    const ed = C.cuerpo && C.cuerpo.querySelector('.ctd-texto');
    if (!ed) return;
    ed.focus({preventScroll:true});
    const s = window.getSelection();
    if (C.rango && ed.contains(C.rango.startContainer) && s && (!s.rangeCount || !ed.contains(s.anchorNode))) { s.removeAllRanges(); s.addRange(C.rango); }
    document.execCommand(cmd, false);
    leerTexto(ed);
    estadoFormato();
  }
  function leerTexto(ed) {
    const id = ed.dataset.id, ls = lineasDeDOM(ed);
    if (igualesTexto(ls, TEXTO_DEF[id] || [])) delete D.texto[id]; else D.texto[id] = ls;
    cambio(); repintarBloque(id);
  }
  /* B / I activos según la selección dentro del Texto */
  function estadoFormato() {
    const ed = C.cuerpo && C.cuerpo.querySelector('.ctd-texto');
    if (!ed) return;
    const s = window.getSelection();
    const dentro = s && s.rangeCount && ed.contains(s.anchorNode);
    if (dentro) C.rango = s.getRangeAt(0).cloneRange();
    C.cuerpo.querySelectorAll('[data-ctd="fmt"]').forEach(b => {
      let on = false;
      if (dentro) { try { on = document.queryCommandState(b.dataset.cmd); } catch (e) { on = false; } }
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  /* ---------- Arrastrar para ordenar (mouse, touch y lápiz) ---------- */
  function arrastrar(ev, asa) {
    if (ev.pointerType === 'mouse' && ev.button !== 0) return;
    const fila = asa.closest('.ctd-fila'), lista = fila && fila.parentElement;
    if (!lista) return;
    const filas = [...lista.children], i0 = filas.indexOf(fila), n = filas.length;
    const paso = n > 1 ? filas[1].getBoundingClientRect().top - filas[0].getBoundingClientRect().top : fila.offsetHeight;
    const yIni = ev.clientY + window.scrollY;
    const head = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--pos-header-h')) || 56;
    let dest = i0, ultY = ev.clientY, activo = false, raf = 0;
    ev.preventDefault();
    try { asa.setPointerCapture(ev.pointerId); } catch (e) { /* sin captura */ }
    const actualizar = () => {
      const dy = ultY + window.scrollY - yIni;
      if (!activo && Math.abs(dy) < 4) return;
      if (!activo) { activo = true; fila.classList.add('is-arrastre'); lista.classList.add('is-ordenando'); }
      const d = Math.max(-i0 * paso - paso * 0.4, Math.min((n - 1 - i0) * paso + paso * 0.4, dy));
      fila.style.transform = `translateY(${d}px)`;
      const nd = Math.max(0, Math.min(n - 1, i0 + Math.round(d / paso)));
      if (nd !== dest) {
        dest = nd;
        filas.forEach((f, j) => {
          if (f === fila) return;
          let s = 0;
          if (dest > i0 && j > i0 && j <= dest) s = -paso;
          else if (dest < i0 && j >= dest && j < i0) s = paso;
          f.style.transform = s ? `translateY(${s}px)` : '';
        });
      }
    };
    /* cerca del borde de la ventana, la página se recorre sola */
    const bucle = () => {
      if (activo) {
        let v = 0;
        if (ultY < head + 48) v = -Math.ceil((head + 48 - ultY) / 4);
        else if (ultY > window.innerHeight - 48) v = Math.ceil((ultY - (window.innerHeight - 48)) / 4);
        if (v) { window.scrollBy(0, v); actualizar(); }
      }
      raf = requestAnimationFrame(bucle);
    };
    raf = requestAnimationFrame(bucle);
    const mover = (e) => { ultY = e.clientY; actualizar(); };
    const soltar = () => {
      cancelAnimationFrame(raf);
      asa.removeEventListener('pointermove', mover); asa.removeEventListener('pointerup', soltar); asa.removeEventListener('pointercancel', soltar);
      filas.forEach(f => { f.style.transform = ''; });
      fila.classList.remove('is-arrastre'); lista.classList.remove('is-ordenando');
      if (activo && dest !== i0) moverA(fila.dataset.id, dest);
    };
    asa.addEventListener('pointermove', mover); asa.addEventListener('pointerup', soltar); asa.addEventListener('pointercancel', soltar);
  }

  /* ---------- Teclado de los menús y grupos ---------- */
  function focoAtrapado(ev, cont) {
    const fs = [...cont.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]')].filter(x => x.offsetParent !== null || x === document.activeElement);
    if (!fs.length) return;
    const i = fs.indexOf(document.activeElement);
    if (ev.shiftKey && (i <= 0)) { ev.preventDefault(); fs[fs.length - 1].focus(); }
    else if (!ev.shiftKey && (i === fs.length - 1 || i < 0)) { ev.preventDefault(); fs[0].focus(); }
  }
  function teclas(ev) {
    const t = ev.target;
    if (ev.key === 'Tab') {
      /* Tab desde una opción: se cierra la lista y el foco vuelve al botón del select ANTES de la acción normal de Tab,
         que así sigue a "Doble cara" (la opción enfocada desaparece al repintar). Va antes de la trampa de foco de la
         Vista previa: con el foco en la opción (tabindex -1) la trampa lo mandaría al inicio. */
      if (U.abierto && t.matches('[data-ctd="opt"]')) { const k = U.abierto; U.abierto = null; pintar(`sel-${k}`); }
      const m = C.capa && C.capa.querySelector(U.confirmar ? '.ctd-modal' : '.ctd-vp');
      if (m) focoAtrapado(ev, m);
      return;
    }
    const d = t.dataset ? t.dataset.ctd : null;
    if (d === 'tab' && /^(ArrowLeft|ArrowRight|Home|End)$/.test(ev.key)) { ev.preventDefault(); irPestana(t.dataset.v === 'contenido' ? 'estilos' : 'contenido'); return; }
    if (d === 'asa' && (ev.key === 'ArrowUp' || ev.key === 'ArrowDown')) { ev.preventDefault(); moverA(t.dataset.id, D.orden.indexOf(t.dataset.id) + (ev.key === 'ArrowUp' ? -1 : 1)); return; }
    if (d === 'color' && /^Arrow/.test(ev.key)) {
      ev.preventDefault();
      const rs = [...t.parentElement.querySelectorAll('[role="radio"]')], i = rs.indexOf(t);
      const j = (i + (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp' ? -1 : 1) + rs.length) % rs.length;
      cambiarColor(rs[j].dataset.tipo, rs[j].dataset.c); return;
    }
    if (d === 'sel' && /^(ArrowDown|ArrowUp|Enter| )$/.test(ev.key)) { ev.preventDefault(); if (U.abierto === t.dataset.k) cerrarSelect(true); else abrirSelect(t.dataset.k); return; }
    if (d === 'opt') {
      const lis = [...t.parentElement.children], i = lis.indexOf(t);
      if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') { ev.preventDefault(); lis[Math.max(0, Math.min(lis.length - 1, i + (ev.key === 'ArrowDown' ? 1 : -1)))].focus(); return; }
      if (ev.key === 'Home' || ev.key === 'End') { ev.preventDefault(); lis[ev.key === 'Home' ? 0 : lis.length - 1].focus(); return; }
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); t.click(); return; }
    }
  }

  /* ---------- Eventos (delegados en la raíz y en la capa) ---------- */
  function clic(ev) {
    const t = ev.target.closest('[data-ctd]');
    if (U.abierto && !ev.target.closest('.ctd-sel')) { U.abierto = null; if (!t) { pintar(); return; } }
    if (!t) return;
    const d = t.dataset.ctd, id = t.dataset.id;
    switch (d) {
      case 'tab': irPestana(t.dataset.v); break;
      case 'fila': if (D.activo[id]) seleccionar(id, 'lista'); break;
      case 'bloque': seleccionar(id, 'contrato'); break;
      case 'color': cambiarColor(t.dataset.tipo, t.dataset.c); break;
      case 'red': D.redes[t.dataset.v] = !D.redes[t.dataset.v]; cambio(); pintar(); break;
      case 'dz': case 'buscar-logo': C.raiz.querySelector('.ctd-file').click(); break;
      case 'quitar-logo': D.logo = null; U.logoErr = ''; cambio(); pintar('buscar-logo'); anunciar('Logo eliminado.'); break;
      case 'sel': if (U.abierto === t.dataset.k) cerrarSelect(true); else abrirSelect(t.dataset.k); break;
      case 'opt': D.formato = t.dataset.v; U.abierto = null; cambio(); pintar(`sel-${t.dataset.k}`); break;
      case 'doble': D.dobleCara = !D.dobleCara; cambio(); pintar(); break;
      case 'vista': abrirVista(); break;
      case 'salir-vista': cerrarVista(); break;
      case 'guardar': guardar(); break;
      case 'cancelar': cancelar(); break;
      case 'editar': editar(); break;
      case 'ov': if (ev.target === t) cerrarModal(); break;
      case 'm-cerrar': cerrarModal(); break;
      case 'm-descartar': descartar(); break;
    }
  }
  function enlazar(el) {
    el.addEventListener('click', clic);
    el.addEventListener('keydown', teclas);
    /* B / I no deben quitarle la selección al Texto */
    el.addEventListener('mousedown', (ev) => { if (ev.target.closest('[data-ctd="fmt"]')) ev.preventDefault(); });
    el.addEventListener('click', (ev) => { const b = ev.target.closest('[data-ctd="fmt"]'); if (b) aplicarFormato(b.dataset.cmd); });
    el.addEventListener('change', (ev) => {
      const t = ev.target;
      if (t.dataset.ctd === 'sw') cambiarActivo(t.dataset.id, t.checked);
      if (t.classList.contains('ctd-file')) { cargarLogo(t.files[0]); t.value = ''; }
    });
    el.addEventListener('input', (ev) => {
      const t = ev.target;
      if (t.dataset.ctd === 'texto') leerTexto(t);
      if (t.dataset.ctd === 'ident') { D.identificador = t.value; cambio(); repintarBloque('redes'); }
    });
    /* pegar en Texto: solo texto plano */
    el.addEventListener('paste', (ev) => {
      if (!ev.target.closest || !ev.target.closest('.ctd-texto')) return;
      ev.preventDefault();
      document.execCommand('insertText', false, (ev.clipboardData || window.clipboardData).getData('text/plain'));
    });
    el.addEventListener('pointerdown', (ev) => { const a = ev.target.closest('[data-ctd="asa"]'); if (a) arrastrar(ev, a); });
    const zona = (ev) => ev.target.closest && ev.target.closest('.ctd-dz');
    el.addEventListener('dragover', (ev) => { const z = zona(ev); if (z) { ev.preventDefault(); z.classList.add('is-drag'); } });
    el.addEventListener('dragleave', (ev) => { const z = zona(ev); if (z && !z.contains(ev.relatedTarget)) z.classList.remove('is-drag'); });
    el.addEventListener('drop', (ev) => { const z = zona(ev); if (!z) return; ev.preventDefault(); z.classList.remove('is-drag'); cargarLogo(ev.dataTransfer.files[0]); });
  }
  let globales = false;
  function escuchasGlobales() {
    if (globales) return;
    globales = true;
    document.addEventListener('selectionchange', () => { if (C.cuerpo && C.cuerpo.isConnected && U.pestana === 'estilos' && !U.guardado) estadoFormato(); });
    /* clic fuera del diseño: cierra el select. Se decide con la ruta del evento al despacharse y no con el DOM vivo: el
       clic que abre el select repinta (el botón pulsado ya no está en el documento) y contains() lo daría por "fuera". */
    document.addEventListener('click', (ev) => {
      if (!U.abierto) return;
      const ruta = ev.composedPath ? ev.composedPath() : [];
      if ((C.raiz && ruta.includes(C.raiz)) || (C.capa && ruta.includes(C.capa))) return;
      if (!ruta.length && ev.target && !ev.target.isConnected) return;
      U.abierto = null; pintar();
    });
    document.addEventListener('keydown', (ev) => {
      if (ev.key !== 'Escape' || !C.raiz || !C.raiz.isConnected) return;
      if (U.confirmar) { ev.preventDefault(); cerrarModal(); return; }
      if (U.abierto) { ev.preventDefault(); cerrarSelect(true); return; }
      if (U.vista) { ev.preventDefault(); cerrarVista(); }
    });
    let t = 0;
    window.addEventListener('resize', () => { cancelAnimationFrame(t); t = requestAnimationFrame(ajustar); });
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => { cancelAnimationFrame(t); t = requestAnimationFrame(ajustar); });
      C.ro = ro;
    }
    try { document.execCommand('defaultParagraphSeparator', false, 'div'); } catch (e) { /* sin execCommand */ }
  }

  /* ---------- API ---------- */
  function render(contenedor, ctx) {
    if (!contenedor) return;
    escuchasGlobales();
    ctx = ctx || {};
    if (typeof ctx.guardado === 'boolean' && ctx.guardado !== C.ctxGuardado) {
      U.guardado = ctx.guardado;
      if (U.guardado && !G) G = clonar(D);   /* p. ej. el riel del prototipo pide la hoja guardada sin haber guardado */
      if (U.guardado) { U.guardando = false; U.sucio = estaSucio(); }
    }
    C.ctxGuardado = ctx.guardado;
    C.ctx = ctx;
    E = normalizarEmpresa(ctx.empresa);
    if (C.cont !== contenedor || !C.raiz || !contenedor.contains(C.raiz)) {
      if (C.ro && C.raiz) C.ro.disconnect();
      contenedor.innerHTML = `<div class="ctd" lang="es"><div class="ctd-cuerpo"></div><p class="ctd-live ctd-sr" aria-live="polite"></p>
        <input type="file" class="ctd-file" accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml" tabindex="-1" aria-hidden="true"></div>`;
      C.cont = contenedor; C.raiz = contenedor.firstElementChild; C.cuerpo = C.raiz.firstElementChild;
      enlazar(C.raiz);
      if (C.ro) C.ro.observe(C.raiz);
    }
    pintar();
  }
  const api = {
    render,
    estado,
    editar() { if (U.guardado) editar(); },
    vistaPrevia(abrir) { if (abrir === false) cerrarVista(); else abrirVista(); },
    descartar() { if (U.guardado && !estaSucio()) return; D = clonar(G ? G : disenoInicial()); U.sel = null; U.logoErr = ''; U.confirmar = false; U.sucio = false; if (G) U.guardado = true; pintar(); emitir({tipo:'cambio', dirty:false}); },
    reiniciar() {
      D = disenoInicial(); G = null;
      Object.assign(U, {pestana:'contenido', sel:null, vista:false, abierto:null, guardando:false, guardado:false, confirmar:false, logoErr:'', sucio:false});
      C.ctxGuardado = undefined;
      pintar();
    },
    logoEjemplo() { D.logo = {url:LOGO_EJEMPLO, nombre:'logo-prestaya.svg'}; U.logoErr = ''; cambio(); pintar(); },
    /* estados de Figma para el riel del prototipo */
    demo(nombre) {
      U.vista = false; U.confirmar = false; U.abierto = null;
      if (nombre === 'editor') { U.guardado = false; U.pestana = 'contenido'; }
      else if (nombre === 'estilos') {   /* Diseño de contrato 08: tabla financiera con acento amarillo */
        U.guardado = false; U.pestana = 'estilos'; U.sel = 'financiera'; D.activo.financiera = true;
        D.acento.financiera = '#FFC003'; if (!D.logo) D.logo = {url:LOGO_EJEMPLO, nombre:'logo-prestaya.svg'}; cambio();
      } else if (nombre === 'guardado') {  /* 427 */
        if (!D.logo) D.logo = {url:LOGO_EJEMPLO, nombre:'logo-prestaya.svg'};
        G = clonar(D); U.guardado = true; U.sucio = false;
      } else if (nombre === 'vista') { U.vista = true; }
      pintar(nombre === 'vista' ? 'salir-vista' : null);
    },
  };
  window.CtrDiseno = api;
})();
