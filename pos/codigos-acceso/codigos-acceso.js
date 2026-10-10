/* Generación de códigos (HU-CP-407-B) — reconstrucción estática del código de Product Design
   (rama del equipo del repo del equipo, src/components/AccessCodes/**).
   Este archivo junta en vanilla JS lo que en React reparten:
   - accessCodes.constants.ts, accessCodesBatch.constants.ts, accessCodeHistory.constants.ts, accessCodesTable.config.ts (textos y reglas)
   - accessCodes.mocks.ts (32 empresas de ejemplo) y accessCodes.service.ts (servicio simulado con latencia de 600–900 ms)
   - useAccessCodes / useAccessCodesList / useAccessCodesBatch / useCopyAccessCode / useDialogFocus (estado y comportamiento)
   - los componentes (tarjetas, tabla, detalle, modales) y los del DS que usan (Table, DataTable, Modal, Alert, AppToast, Tooltip…).
   Escenarios de su vista previa: ?escenario=vacio (sin códigos) y ?escenario=carga-lenta (2.5–3 s).
   Casos de prueba de su servicio: un correo con "fallo" simula el error de envío; el RFC XAXX010101000 simula un error del servidor. */
(() => {
  'use strict';

  /* ======================= Íconos del DS (Icons.tsx, nombres según ICONS.md) ======================= */
  const ICO = {"Add":["0 0 24 24","<path d=\"M11 19V13H5V11H11V5H13V11H19V13H13V19H11Z\" fill=\"currentColor\"></path>"],"ContentCopy":["0 0 24 24","<path d=\"M5 22C4.45 22 3.979 21.8043 3.587 21.413C3.19567 21.021 3 20.55 3 20V6H5V20H16V22H5ZM9 18C8.45 18 7.97933 17.8043 7.588 17.413C7.196 17.021 7 16.55 7 16V4C7 3.45 7.196 2.979 7.588 2.587C7.97933 2.19567 8.45 2 9 2H18C18.55 2 19.021 2.19567 19.413 2.587C19.8043 2.979 20 3.45 20 4V16C20 16.55 19.8043 17.021 19.413 17.413C19.021 17.8043 18.55 18 18 18H9ZM9 16H18V4H9V16Z\" fill=\"currentColor\"></path>"],"Check":["0 0 24 24","<path d=\"M9.54998 18.0001L3.84998 12.3001L5.27498 10.8751L9.54998 15.1501L18.725 5.9751L20.15 7.4001L9.54998 18.0001Z\" fill=\"currentColor\"></path>"],"CheckCircle":["0 0 24 24","<path d=\"M10.6 16.6L17.65 9.55L16.25 8.15L10.6 13.8L7.75 10.95L6.35 12.35L10.6 16.6ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z\" fill=\"currentColor\"></path>"],"Error":["0 0 24 24","<path d=\"M12 22C10.6167 22 9.31667 21.7373 8.1 21.212C6.88333 20.6873 5.825 19.975 4.925 19.075C4.025 18.175 3.31267 17.1167 2.788 15.9C2.26267 14.6833 2 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31267 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.31233 8.1 2.787C9.31667 2.26233 10.6167 2 12 2C13.3833 2 14.6833 2.26233 15.9 2.787C17.1167 3.31233 18.175 4.025 19.075 4.925C19.975 5.825 20.6873 6.88333 21.212 8.1C21.7373 9.31667 22 10.6167 22 12C22 13.3833 21.7373 14.6833 21.212 15.9C20.6873 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6873 15.9 21.212C14.6833 21.7373 13.3833 22 12 22ZM8.4 17L12 13.4L15.6 17L17 15.6L13.4 12L17 8.4L15.6 7L12 10.6L8.4 7L7 8.4L10.6 12L7 15.6L8.4 17Z\" fill=\"currentColor\"></path>"],"EstadosError":["48 156 24 24","<path d=\"M60 178C58.6167 178 57.3167 177.737 56.1 177.212C54.8833 176.687 53.825 175.975 52.925 175.075C52.025 174.175 51.3127 173.117 50.788 171.9C50.2627 170.683 50 169.383 50 168C50 166.617 50.2627 165.317 50.788 164.1C51.3127 162.883 52.025 161.825 52.925 160.925C53.825 160.025 54.8833 159.312 56.1 158.787C57.3167 158.262 58.6167 158 60 158C61.3833 158 62.6833 158.262 63.9 158.787C65.1167 159.312 66.175 160.025 67.075 160.925C67.975 161.825 68.6873 162.883 69.212 164.1C69.7373 165.317 70 166.617 70 168C70 169.383 69.7373 170.683 69.212 171.9C68.6873 173.117 67.975 174.175 67.075 175.075C66.175 175.975 65.1167 176.687 63.9 177.212C62.6833 177.737 61.3833 178 60 178ZM56.4 173L60 169.4L63.6 173L65 171.6L61.4 168L65 164.4L63.6 163L60 166.6L56.4 163L55 164.4L58.6 168L55 171.6L56.4 173Z\" fill=\"currentColor\"></path>"],"EstadosSuccess":["96 156 24 24","<path d=\"M108 178C106.617 178 105.317 177.737 104.1 177.212C102.883 176.687 101.825 175.975 100.925 175.075C100.025 174.175 99.3127 173.117 98.788 171.9C98.2627 170.683 98 169.383 98 168C98 166.617 98.2627 165.317 98.788 164.1C99.3127 162.883 100.025 161.825 100.925 160.925C101.825 160.025 102.883 159.312 104.1 158.787C105.317 158.262 106.617 158 108 158C109.383 158 110.683 158.262 111.9 158.787C113.117 159.312 114.175 160.025 115.075 160.925C115.975 161.825 116.687 162.883 117.212 164.1C117.737 165.317 118 166.617 118 168C118 169.383 117.737 170.683 117.212 171.9C116.687 173.117 115.975 174.175 115.075 175.075C114.175 175.975 113.117 176.687 111.9 177.212C110.683 177.737 109.383 178 108 178ZM106.6 172.6L113.65 165.55L112.25 164.15L106.6 169.8L103.75 166.95L102.35 168.35L106.6 172.6Z\" fill=\"currentColor\"></path>"],"EstadosInfo":["144 156 24 24","<path d=\"M154.774 172.838H156.774V166.838H154.774V172.838ZM155.774 164.838C156.058 164.838 156.295 164.742 156.487 164.55C156.679 164.359 156.774 164.121 156.774 163.838C156.774 163.555 156.679 163.317 156.487 163.125C156.295 162.934 156.058 162.838 155.774 162.838C155.491 162.838 155.254 162.934 155.062 163.125C154.87 163.317 154.774 163.555 154.774 163.838C154.774 164.121 154.87 164.359 155.062 164.55C155.254 164.742 155.491 164.838 155.774 164.838ZM155.774 177.838C154.391 177.838 153.091 177.575 151.874 177.05C150.658 176.525 149.599 175.813 148.699 174.913C147.799 174.013 147.087 172.955 146.562 171.738C146.037 170.521 145.774 169.221 145.774 167.838C145.774 166.455 146.037 165.155 146.562 163.938C147.087 162.721 147.799 161.663 148.699 160.763C149.599 159.863 150.658 159.15 151.874 158.625C153.091 158.1 154.391 157.838 155.774 157.838C157.158 157.838 158.458 158.1 159.674 158.625C160.891 159.15 161.949 159.863 162.849 160.763C163.749 161.663 164.462 162.721 164.987 163.938C165.512 165.155 165.774 166.455 165.774 167.838C165.774 169.221 165.512 170.521 164.987 171.738C164.462 172.955 163.749 174.013 162.849 174.913C161.949 175.813 160.891 176.525 159.674 177.05C158.458 177.575 157.158 177.838 155.774 177.838Z\" fill=\"currentColor\"></path>"],"WarningFilled":["0 0 24 24","<path d=\"M1 21L12 2L23 21H1ZM12 18C12.2833 18 12.5208 17.9042 12.7125 17.7125C12.9042 17.5208 13 17.2833 13 17C13 16.7167 12.9042 16.4792 12.7125 16.2875C12.5208 16.0958 12.2833 16 12 16C11.7167 16 11.4792 16.0958 11.2875 16.2875C11.0958 16.4792 11 16.7167 11 17C11 17.2833 11.0958 17.5208 11.2875 17.7125C11.4792 17.9042 11.7167 18 12 18ZM11 15H13V10H11V15Z\" fill=\"currentColor\"></path>"],"Edit":["0 0 24 24","<path d=\"M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3043 2.75 17.863 2.75C18.421 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.571 21.275 6.113C21.2917 6.65433 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z\" fill=\"currentColor\"></path>"],"FilterAlt":["0 0 24 24","<path d=\"M11 20C10.7167 20 10.4794 19.904 10.288 19.712C10.096 19.5207 10 19.2833 10 19V13L4.20003 5.6C3.95003 5.26667 3.9127 4.91667 4.08803 4.55C4.2627 4.18333 4.5667 4 5.00003 4H19C19.4334 4 19.7377 4.18333 19.913 4.55C20.0877 4.91667 20.05 5.26667 19.8 5.6L14 13V19C14 19.2833 13.9044 19.5207 13.713 19.712C13.521 19.904 13.2834 20 13 20H11ZM12 12.3L16.95 6H7.05003L12 12.3Z\" fill=\"currentColor\"></path>"],"ArrowDropDown":["0 0 24 24","<path d=\"M12 15L7 10H17L12 15Z\" fill=\"currentColor\"></path>"],"Close":["0 0 24 24","<path d=\"M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z\" fill=\"currentColor\"></path>"],"Search":["0 0 24 24","<path d=\"M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.146 15.371 4.888 14.113C3.62933 12.8543 3 11.3167 3 9.5C3 7.68333 3.62933 6.14567 4.888 4.887C6.146 3.629 7.68333 3 9.5 3C11.3167 3 12.8543 3.629 14.113 4.887C15.371 6.14567 16 7.68333 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8127 13.5627 12.688 12.688C13.5627 11.8127 14 10.75 14 9.5C14 8.25 13.5627 7.18733 12.688 6.312C11.8127 5.43733 10.75 5 9.5 5C8.25 5 7.18733 5.43733 6.312 6.312C5.43733 7.18733 5 8.25 5 9.5C5 10.75 5.43733 11.8127 6.312 12.688C7.18733 13.5627 8.25 14 9.5 14Z\" fill=\"currentColor\"></path>"],"FirstPage":["0 0 24 24","<path d=\"M6 18V6H8V18H6ZM17 18L11 12L17 6L18.4 7.4L13.8 12L18.4 16.6L17 18Z\" fill=\"currentColor\"></path>"],"LastPage":["0 0 24 24","<path d=\"M6.99998 18L5.59998 16.6L10.2 12L5.59998 7.4L6.99998 6L13 12L6.99998 18ZM16 18V6H18V18H16Z\" fill=\"currentColor\"></path>"],"ArrowBackIos":["0 0 24 24","<path d=\"M14.6 6L16 7.4L11.4 12L16 16.6L14.6 18L8.59998 12L14.6 6Z\" fill=\"currentColor\"></path>"],"ArrowForwardIos":["0 0 24 24","<path d=\"M9.4 18L8 16.6L12.6 12L8 7.4L9.4 6L15.4 12L9.4 18Z\" fill=\"currentColor\"></path>"],"ChevronDown":["0 0 24 24","<path d=\"M7 10L12 15L17 10\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path>"]};
  const ico = (n, s = 24) => '<svg class="cd-ico" width="' + s + '" height="' + s + '" viewBox="' + ICO[n][0] + '" fill="none" aria-hidden="true" focusable="false">' + ICO[n][1] + '</svg>';
  /* Flags · MexicoFlag (DS) */
  const MEXICO_FLAG = '<svg class="cd-num__flag" width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F4F5F5"/><path d="M23.9999 11.9997C23.9999 7.24218 21.2312 3.13143 17.2173 1.19043V22.8089C21.2312 20.868 23.9999 16.7572 23.9999 11.9997Z" fill="#A82424"/><path d="M0 11.9997C0 16.7572 2.76867 20.868 6.78262 22.809V1.19043C2.76867 3.13143 0 7.24218 0 11.9997Z" fill="#309C60"/><path d="M8.86963 11.999C8.86963 13.7279 10.2712 15.1295 12.0001 15.1295C13.729 15.1295 15.1305 13.7279 15.1305 11.999V10.9556H8.86963V11.999Z" fill="#309C60"/><path d="M16.1736 9.9136H13.0431C13.0431 9.33732 12.5759 8.87012 11.9996 8.87012C11.4233 8.87012 10.9561 9.33732 10.9561 9.9136H7.82568C7.82568 10.4899 8.32767 10.9571 8.9039 10.9571H8.86917C8.86917 11.5334 9.33633 12.0006 9.91265 12.0006C9.91265 12.5769 10.3798 13.044 10.9561 13.044H13.0431C13.6194 13.044 14.0866 12.5769 14.0866 12.0006C14.6629 12.0006 15.1301 11.5334 15.1301 10.9571H15.0953C15.6716 10.9571 16.1736 10.4899 16.1736 9.9136Z" fill="#FFBD00"/></svg>';
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const wait = (ms) => new Promise((r) => setTimeout(r, Math.max(0, ms)));

  /* ======================= Constantes (accessCodes.constants.ts) ======================= */
  const ACCESS_CODE_LENGTH = 6;
  const ACCESS_CODE_GROUP_SIZE = 3;
  const ACCESS_CODE_CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const DAY_MS = 24 * 60 * 60 * 1000;
  const HOUR_MS = 60 * 60 * 1000;
  const PAGE_SIZE = 8;
  const LATENCY = [600, 900];
  const SLOW_LATENCY = [2500, 3000];
  const SKELETON_ROWS = 8;
  const ATTENTION_SKELETON_ROWS = 3;
  const TRUNCATE_AT = 26;
  const HIGHLIGHT_MS = 2000;
  const COPIED_FEEDBACK_MS = 2000;
  const TOAST_DURATION = 4000;
  const EMAIL_FAILURE_TRIGGER = 'fallo';
  const SERVER_ERROR_RFC = 'XAXX010101000';
  const CURRENT_ADMIN = 'Rocío Pérez';
  const ADMINS = ['Rocío Pérez', 'Luis Hernández'];
  const STATUS_ORDER = ['pending', 'sent', 'emailFailed', 'used'];
  const RESENDABLE = ['sent', 'emailFailed'];
  const STATUS_META = {
    pending: { label: 'Solicitud nueva', variant: 'status-yellow' },
    sent: { label: 'Enviado', variant: 'status-blue' },
    emailFailed: { label: 'Error de envío', variant: 'status-red' },
    used: { label: 'Usado', variant: 'status-green' },
  };
  const FILTER_ALL = { value: 'all', label: 'Todos' };
  const ATTENTION_STATUSES = ['emailFailed', 'pending'];
  const HISTORY_STATUSES = ['sent', 'used'];
  const FILTER_OPTIONS = [FILTER_ALL, ...HISTORY_STATUSES.map((s) => ({ value: s, label: STATUS_META[s].label }))];
  const ROW_ACTIONS = { pending: ['generate'], sent: ['copy'], emailFailed: ['copy', 'resend'], used: [] };
  const ACTION_LABELS = { viewDetail: 'Ver detalle', generate: 'Generar código', copy: 'Copiar código', resend: 'Reenviar correo' };
  const ROW_BUTTON_LABELS = { generate: 'Generar', resend: 'Reenviar' };
  const ROW_CLASSES = { highlighted: 'access-code-row--highlighted' };
  const T = {
    pageTitle: 'Generación de códigos',
    generateButton: 'Generar código',
    historyTitle: 'Historial',
    attentionTitle: 'Requieren atención',
    attentionCountPrefix: ' (',
    attentionCountSuffix: ')',
    searchPlaceholder: 'Buscar empresa, correo o código',
    rowAriaLabelPrefix: 'Ver detalle de ',
    copyAriaLabel: 'Copiar código',
    copied: 'Copiado',
    emptyNoRecordsTitle: 'Aún no hay códigos generados',
    emptyNoRecordsDescription: 'Genera el primer código para que una empresa cree su cuenta.',
    emptyNoResultsTitle: 'No hay resultados',
    emptyNoResultsDescription: 'Revisa la búsqueda o los filtros aplicados.',
    clearSearch: 'Limpiar búsqueda',
    emptyValue: '-',
    noCode: 'Sin código',
    searchAriaLabel: 'Buscar en el historial',
    clearSearchAriaLabel: 'Limpiar búsqueda',
  };
  const EMPTY_ILLUSTRATION = { src: 'ilust-01-empty.svg', alt: '', height: 150 };
  const ORIGIN_LABELS = { webForm: 'Formulario web', admin: 'Creado por un administrador' };
  const EMAIL_EDITABLE_STATUSES = ['emailFailed'];
  const PHONE_LENGTH = 10;
  const BRANCHES_MAX_LENGTH = 3;
  const FORM_T = {
    title: 'Generar código de acceso',
    companyLabel: 'Empresa', companyPlaceholder: 'Ej. Empeños Cerrito',
    rfcLabel: 'RFC', rfcPlaceholder: 'Ej. ECE200115AB3',
    contactLabel: 'Nombre del contacto', contactPlaceholder: 'Ej. el equipo Del Río',
    emailLabel: 'Correo electrónico', emailPlaceholder: 'Ej. contacto@empresa.com',
    phoneLabel: 'Teléfono', phonePlaceholder: 'Ej. 5512345678', phoneHelper: '10 dígitos, sin espacios',
    branchesLabel: 'Número de sucursales', branchesPlaceholder: 'Ej. 4',
    cancel: 'Cancelar', submit: 'Generar y enviar',
  };
  const DUP_T = {
    title: 'Esta empresa ya tiene un código',
    textPrefix: 'Ya existe un código para ',
    textSuffix: '. Cada empresa solo puede tener un código.',
    action: 'Ver detalle de la empresa',
  };
  const DISPLAY_T = { copy: 'Copiar', copied: 'Copiado', codeAriaLabel: 'Código de acceso' };
  const FORM_ERRORS = {
    requiredCompany: 'Ingresa el nombre de la empresa.',
    invalidRfc: 'Escribe un RFC de 12 o 13 caracteres, por ejemplo ECE200115AB3.',
    requiredContact: 'Ingresa el nombre del contacto.',
    requiredEmail: 'Ingresa el correo electrónico.',
    invalidEmail: 'Ingresa un correo válido, por ejemplo nombre@empresa.com.',
    requiredPhone: 'Ingresa el teléfono.',
    invalidPhone: 'El teléfono debe tener 10 dígitos.',
    requiredBranches: 'Ingresa el número de sucursales.',
    invalidBranches: 'Ingresa un número entero entre 1 y 999.',
  };
  const MISSING_T = { title: 'Completa la información requerida', textPrefix: 'Revisa estos campos antes de continuar: ' };
  const SERVICE_ERRORS = {
    duplicateCompany: 'Esta empresa ya tiene un código.',
    duplicateRfc: 'Este RFC ya tiene un código.',
    server: 'No se pudo completar la acción y no se envió ningún correo. Inténtalo de nuevo.',
    notFound: 'Este registro ya no está disponible. Actualiza la lista.',
    invalidTransition: 'Esta acción ya no está disponible para el código.',
  };
  const TOASTS = {
    sentPrefix: 'Código enviado a ',
    emailFailedPrefix: 'Código generado, pero no se pudo enviar el correo a ',
    emailFailedSuffix: '. Reenvíalo desde Requieren atención.',
    copyFailed: 'No se pudo copiar el código. Cópialo manualmente.',
    contactSaved: 'Información de contacto actualizada',
    loadFailed: 'No se pudo cargar el historial. Inténtalo de nuevo.',
  };
  const DETAIL_T = {
    invitationTitle: 'Código de acceso',
    contactTitle: 'Información de contacto',
    edit: 'Editar contacto', save: 'Guardar', cancel: 'Cancelar',
    statusLabel: 'Estado', originLabel: 'Origen',
    noCode: 'Esta solicitud aún no tiene código.',
    emailFailedTitle: 'No se pudo enviar el correo',
    emailFailedText: 'Revisa el correo en Información de contacto. Si está mal, corrígelo y reenvía: se enviará el mismo código.',
  };
  const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const TIME_SUFFIX = { am: 'a. m.', pm: 'p. m.' };
  const DATE_SEPARATOR = ' · ';
  const FORM_DEFAULTS = { companyName: '', rfc: '', contactName: '', email: '', phone: '', branches: '' };

  /* accessCodeHistory.constants.ts */
  const HISTORY_VISIBLE = 5;
  const HISTORY_T = { title: 'Historial', showAll: 'Ver todo', showLess: 'Ver menos', separator: ' · ' };
  const EVENT_LABELS = {
    requested: 'Solicitud recibida desde el formulario web',
    generated: 'Código generado',
    emailSent: 'Correo enviado a ',
    emailResent: 'Correo reenviado a ',
    emailFailed: 'No se pudo enviar el correo a ',
    used: 'La empresa usó el código para crear su cuenta',
  };
  const NEGATIVE_EVENTS = ['emailFailed'];

  /* accessCodesBatch.constants.ts */
  const SELECTION_T = {
    selectAllAriaLabel: 'Seleccionar todas',
    selectedSingular: 'Seleccionada',
    selectedPlural: 'Seleccionadas',
    deselect: 'Deseleccionar todas',
    selectRowAriaPrefix: 'Seleccionar ',
  };
  const BULK_ORDER = ['generate', 'resend'];
  const BULK_LABELS = { generate: 'Generar y enviar', resend: 'Reenviar' };
  const COUNT_WRAP = { open: ' (', close: ')' };
  const BATCH_TITLES = { generate: 'Generar y enviar códigos', resend: 'Reenviar correos', mixed: 'Generar y reenviar códigos' };
  const BATCH_CONFIRM = { generate: 'Generar y enviar', resend: 'Reenviar correos', mixed: 'Generar y reenviar' };
  const BATCH_LINES = {
    generateSingular: ' código se generará y se enviará por correo a la empresa.',
    generatePlural: ' códigos se generarán y se enviarán por correo a cada empresa.',
    resendSingular: ' correo se reenviará con su código actual.',
    resendPlural: ' correos se reenviarán con su código actual.',
    skippedSingular: ' empresa ya tiene un código (por nombre o RFC) y se omitirá.',
    skippedPlural: ' empresas ya tienen un código (por nombre o RFC) y se omitirán.',
  };
  const BATCH_MODAL_T = { companiesLabel: 'Empresas seleccionadas', skippedTitle: 'Algunas empresas se omitirán', cancel: 'Volver' };
  const BATCH_TOASTS = {
    codesSentSingular: ' código enviado', codesSentPlural: ' códigos enviados',
    emailsSentSingular: ' correo enviado', emailsSentPlural: ' correos enviados',
    failedSingular: ' no se pudo enviar', failedPlural: ' no se pudieron enviar',
    skippedOpen: ' (', skippedSingular: ' ya tenía código', skippedPlural: ' ya tenían código', skippedClose: ')',
    summarySeparator: ', ',
    pendingHintSingular: '. La encontrarás en Requieren atención.',
    pendingHintPlural: '. Las encontrarás en Requieren atención.',
  };

  /* accessCodesTable.config.ts */
  const HEADERS = { select: '', requestedAt: 'Solicitud', sentAt: 'Fecha', company: 'Empresa', contact: 'Contacto', code: 'Código', status: 'Estado', action: '' };
  const TABLE_CONFIG = {
    attention: {
      columns: [
        { key: 'select', width: '6%' }, { key: 'company', width: '26%' }, { key: 'contact', width: '27%' },
        { key: 'requestedAt', width: '18%' }, { key: 'status', width: '11%' }, { key: 'action', width: '12%', align: 'right' },
      ],
      minWidth: '880px', skeletonRows: ATTENTION_SKELETON_ROWS, showCodeUnderCompany: true, copyStatuses: [],
    },
    history: {
      columns: [
        { key: 'sentAt', width: '20%' }, { key: 'company', width: '27%' }, { key: 'contact', width: '29%' },
        { key: 'code', width: '17%' }, { key: 'status', width: '7%' },
      ],
      minWidth: '880px', skeletonRows: SKELETON_ROWS, showCodeUnderCompany: false, copyStatuses: ['sent'],
    },
  };

  /* AccessCodeFormFields.tsx · ACCESS_CODE_FIELDS */
  const FIELDS = [
    { name: 'companyName', label: FORM_T.companyLabel, placeholder: FORM_T.companyPlaceholder },
    { name: 'rfc', label: FORM_T.rfcLabel, placeholder: FORM_T.rfcPlaceholder, optional: true },
    { name: 'contactName', label: FORM_T.contactLabel, placeholder: FORM_T.contactPlaceholder },
    { name: 'email', label: FORM_T.emailLabel, placeholder: FORM_T.emailPlaceholder },
    { name: 'phone', label: FORM_T.phoneLabel, placeholder: FORM_T.phonePlaceholder, helper: FORM_T.phoneHelper, input: 'phone', maxLength: PHONE_LENGTH },
    { name: 'branches', label: FORM_T.branchesLabel, placeholder: FORM_T.branchesPlaceholder, input: 'number', maxLength: BRANCHES_MAX_LENGTH },
  ];

  /* accessCodeForm.schema.ts (yup) */
  const RFC_PATTERN = /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/;
  const EMAIL_PATTERN = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  const PHONE_PATTERN = /^\d{10}$/;
  const isValidBranches = (v) => { const c = (v || '').trim(); if (!/^\d+$/.test(c)) return false; const n = Number(c); return n >= 1 && n <= 999; };
  const VALIDATORS = {
    companyName: (v) => (v.trim() ? null : FORM_ERRORS.requiredCompany),
    rfc: (v) => { const c = (v || '').trim().toUpperCase(); return c === '' || RFC_PATTERN.test(c) ? null : FORM_ERRORS.invalidRfc; },
    contactName: (v) => (v.trim() ? null : FORM_ERRORS.requiredContact),
    email: (v) => (!v.trim() ? FORM_ERRORS.requiredEmail : EMAIL_PATTERN.test(v.trim()) ? null : FORM_ERRORS.invalidEmail),
    phone: (v) => (!v.trim() ? FORM_ERRORS.requiredPhone : PHONE_PATTERN.test(v.trim()) ? null : FORM_ERRORS.invalidPhone),
    branches: (v) => (!v.trim() ? FORM_ERRORS.requiredBranches : isValidBranches(v) ? null : FORM_ERRORS.invalidBranches),
  };

  /* ======================= Utilidades (accessCodes.utils.ts y compañía) ======================= */
  const generateAccessCode = (random = Math.random) => Array.from({ length: ACCESS_CODE_LENGTH }, () =>
    ACCESS_CODE_CHARSET[Math.min(ACCESS_CODE_CHARSET.length - 1, Math.floor(random() * ACCESS_CODE_CHARSET.length))]).join('');
  const normalizeAccessCode = (code) => code.replace(/\s+/g, '').toUpperCase();
  const splitAccessCode = (code) => { const c = normalizeAccessCode(code); const g = []; for (let i = 0; i < c.length; i += ACCESS_CODE_GROUP_SIZE) g.push(c.slice(i, i + ACCESS_CODE_GROUP_SIZE)); return g; };
  const pad2 = (n) => String(n).padStart(2, '0');
  const formatDate = (ts) => { if (ts === null) return T.emptyValue; const d = new Date(ts); return pad2(d.getDate()) + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear(); };
  const formatDateTime = (ts) => {
    if (ts === null) return T.emptyValue;
    const d = new Date(ts); const h = d.getHours(); const h12 = h % 12 === 0 ? 12 : h % 12;
    return formatDate(ts) + DATE_SEPARATOR + h12 + ':' + pad2(d.getMinutes()) + ' ' + (h < 12 ? TIME_SUFFIX.am : TIME_SUFFIX.pm);
  };
  const getRowActions = (r) => ROW_ACTIONS[r.status];
  const canPerform = (r, a) => ['viewDetail', ...getRowActions(r)].includes(a) || (a === 'resend' && RESENDABLE.includes(r.status));
  const hasAccessCode = (r) => r.status !== 'pending';
  const normalizeText = (v) => v.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();
  const normalizeCompanyName = (v) => normalizeText(v).replace(/\s+/g, '');
  const findCompanyWithCode = (records, company, excludeId) => {
    const withCode = records.filter((r) => r.id !== excludeId && hasAccessCode(r));
    const name = normalizeCompanyName(company.companyName || '');
    const rfc = (company.rfc || '').trim().toUpperCase();
    const byName = name ? withCode.find((r) => normalizeCompanyName(r.companyName) === name) : undefined;
    if (byName) return { record: byName, field: 'companyName' };
    const byRfc = rfc ? withCode.find((r) => r.rfc.toUpperCase() === rfc) : undefined;
    return byRfc ? { record: byRfc, field: 'rfc' } : null;
  };
  const getGenerateToast = (r) => (r.status === 'emailFailed'
    ? { type: 'warning', message: TOASTS.emailFailedPrefix + r.email + TOASTS.emailFailedSuffix }
    : { type: 'success', message: TOASTS.sentPrefix + r.email });
  const matchesSearch = (r, q) => {
    const needle = normalizeText(q); if (!needle) return true;
    const compact = needle.replace(/\s+/g, '');
    const hay = [r.companyName, r.contactName, r.email].map(normalizeText);
    return (r.code ? r.code.toLowerCase().includes(compact) : false) || hay.some((v) => v.includes(needle));
  };
  const paginate = (items, page, size) => items.slice((page - 1) * size, page * size);
  const toAccessCodeStatus = (v) => STATUS_ORDER.find((s) => s === v);
  const isEmailFailureTrigger = (email) => email.toLowerCase().includes(EMAIL_FAILURE_TRIGGER);
  const formValuesToCompany = (v) => ({
    companyName: v.companyName.trim(), rfc: v.rfc.trim().toUpperCase(), contactName: v.contactName.trim(),
    email: v.email.trim().toLowerCase(), phone: v.phone.trim(), branches: Number(v.branches),
  });
  const companyToFormValues = (c) => ({
    companyName: c.companyName, rfc: c.rfc, contactName: c.contactName, email: c.email, phone: c.phone,
    branches: c.branches ? String(c.branches) : '',
  });
  const getEditableContactFields = (status) => (EMAIL_EDITABLE_STATUSES.includes(status) ? ['email', 'branches'] : ['branches']);
  const toCompany = (r) => ({ companyName: r.companyName, rfc: r.rfc, contactName: r.contactName, email: r.email, phone: r.phone, branches: r.branches });

  /* accessCodesLists.utils.ts */
  const byNewest = (pick) => (a, b) => (pick(b) || 0) - (pick(a) || 0) || b.requestedAt - a.requestedAt || a.id.localeCompare(b.id);
  const attentionRank = (r) => ATTENTION_STATUSES.indexOf(r.status);
  const getAttentionRecords = (records) => { const newest = byNewest((r) => r.requestedAt); return records.filter((r) => ATTENTION_STATUSES.includes(r.status)).sort((a, b) => attentionRank(a) - attentionRank(b) || newest(a, b)); };
  const getHistoryRecords = (records, query = '', statuses = []) => records
    .filter((r) => HISTORY_STATUSES.includes(r.status))
    .filter((r) => statuses.length === 0 || statuses.includes(r.status))
    .filter((r) => matchesSearch(r, query))
    .sort(byNewest((r) => r.sentAt));
  const formatAttentionTitle = (count) => (count === undefined ? T.attentionTitle : T.attentionTitle + T.attentionCountPrefix + count + T.attentionCountSuffix);
  const formatCodeCaption = (code) => (code ? splitAccessCode(code).join(' ') : undefined);

  /* accessCodesSelection.utils.ts */
  const getSelectionState = (ids, records) => { const n = records.filter((r) => ids.includes(r.id)).length; if (n === 0) return 'none'; return n === records.length ? 'all' : 'partial'; };
  const formatSelectionCount = (n) => n + ' ' + (n === 1 ? SELECTION_T.selectedSingular : SELECTION_T.selectedPlural);

  /* accessCodesBatch.utils.ts */
  const plural = (n, one, many) => n + (n === 1 ? one : many);
  const getBulkSelection = (ids, records) => { const sel = records.filter((r) => ids.includes(r.id)); return { generate: sel.filter((r) => r.status === 'pending'), resend: sel.filter((r) => r.status === 'emailFailed') }; };
  const getBulkActions = (sel) => BULK_ORDER.filter((a) => sel[a].length > 0).map((a) => ({ action: a, count: sel[a].length, label: BULK_LABELS[a] + COUNT_WRAP.open + sel[a].length + COUNT_WRAP.close }));
  const getBatchScope = (sel, action) => ({ generate: action === 'resend' ? [] : sel.generate, resend: action === 'generate' ? [] : sel.resend });
  const getBatchCopy = (scope, records) => {
    const { generate, resend } = scope;
    const skipped = generate.filter((r) => Boolean(findCompanyWithCode(records, r, r.id))).length;
    const lines = [
      generate.length > 0 && plural(generate.length, BATCH_LINES.generateSingular, BATCH_LINES.generatePlural),
      resend.length > 0 && plural(resend.length, BATCH_LINES.resendSingular, BATCH_LINES.resendPlural),
    ].filter(Boolean);
    const kind = generate.length > 0 && resend.length > 0 ? 'mixed' : resend.length > 0 ? 'resend' : 'generate';
    const total = generate.length + resend.length;
    return {
      title: BATCH_TITLES[kind],
      confirmLabel: BATCH_CONFIRM[kind] + COUNT_WRAP.open + total + COUNT_WRAP.close,
      lines,
      companies: [...generate, ...resend].map((r) => ({ id: r.id, name: r.companyName })),
      skippedNotice: skipped > 0 ? plural(skipped, BATCH_LINES.skippedSingular, BATCH_LINES.skippedPlural) : null,
    };
  };
  const toBatchItem = (id, action, result) => {
    if (result.ok) return { id, action, outcome: result.data.status === 'emailFailed' ? 'emailFailed' : 'sent', record: result.data, error: null };
    return { id, action, outcome: ['duplicateCompany', 'duplicateRfc'].includes(result.error.code) ? 'skipped' : 'error', record: null, error: result.error.code };
  };
  const getBatchToasts = (items) => {
    const sent = items.filter((i) => i.outcome === 'sent').length;
    const skipped = items.filter((i) => i.outcome === 'skipped').length;
    const failed = items.length - sent;
    const success = items.some((i) => i.action === 'resend')
      ? plural(sent, BATCH_TOASTS.emailsSentSingular, BATCH_TOASTS.emailsSentPlural)
      : plural(sent, BATCH_TOASTS.codesSentSingular, BATCH_TOASTS.codesSentPlural);
    if (failed === 0) return [{ type: 'success', message: success }];
    const hint = failed === 1 ? BATCH_TOASTS.pendingHintSingular : BATCH_TOASTS.pendingHintPlural;
    let base = plural(failed, BATCH_TOASTS.failedSingular, BATCH_TOASTS.failedPlural);
    if (skipped > 0) base += BATCH_TOASTS.skippedOpen + plural(skipped, BATCH_TOASTS.skippedSingular, BATCH_TOASTS.skippedPlural) + BATCH_TOASTS.skippedClose;
    const failure = base + hint;
    if (sent === 0) return [{ type: 'error', message: failure }];
    return [{ type: 'warning', message: success + BATCH_TOASTS.summarySeparator + failure }];
  };

  /* accessCodeHistory.utils.ts */
  const accessCodeEvent = (type, at, by = null, detail = null) => ({ type, at, by, detail });
  const getAccessCodeHistory = (r) => r.events.map((e, i) => ({ e, i })).sort((a, b) => b.e.at - a.e.at || b.i - a.i).map(({ e }) => e);
  const getEventText = (e) => EVENT_LABELS[e.type] + (e.detail || '');
  const getEventMeta = (e) => (e.by ? formatDateTime(e.at) + HISTORY_T.separator + e.by : formatDateTime(e.at));
  const buildMockEvents = (r) => {
    const ev = [accessCodeEvent('requested', r.requestedAt)];
    if (r.generatedAt === null) return ev;
    ev.push(accessCodeEvent('generated', r.generatedAt, r.generatedBy));
    ev.push(accessCodeEvent(r.status === 'emailFailed' ? 'emailFailed' : 'emailSent', r.generatedAt, null, r.email));
    if (r.usedAt !== null) ev.push(accessCodeEvent('used', r.usedAt));
    return ev;
  };

  /* ======================= Datos de ejemplo (accessCodes.mocks.ts) ======================= */
  const SEED_ROWS = [
    'Empeños Cerrito|ECE200115AB3|el equipo Del Río|empenos@cerrito.com|3312345678|4|sent|P23E6R|0',
    'Prendamás Guadalajara|PGU190302K45|Mariana López Ortiz|mariana.lopez@prendamas.mx|3398765432|12|pending||0',
    'Casa de Empeño La Esperanza|CEE150820QW7|Jorge Ramírez Soto|jramirez@laesperanza.com.mx|5512348765|3|sent|AR45KZ|1',
    'Montepío Querétaro Centro|MQC120610HT2|Laura Méndez|lmendez@montepioqro.mx|4421239876|7|used|H7XQ2M|2',
    'Empeños del Bajío|EBA180404PL9|Ricardo Fuentes|ricardo@empenosbajio.com|4771112233|9|pending||2',
    'Préstamos Monterrey Norte|PMN170918RT5|Sofía Garza Treviño|sofia.garza@pmnorte.mx|8187654321|22|emailFailed|W9TB3N|3',
    'Oro Fácil Puebla|OFP210127ZX3|Andrés Castillo|acastillo@orofacilpuebla.mx|2223344556|2|pending||3',
    'Empeña y Gana Mérida|EGM160711MN8|Valeria Canché|valeria@empenaygana.mx|9991234567|5|used|K3DP8V|4',
    'Casa Prendaria Tijuana|CPT140305DF4|Héctor Navarro|hnavarro@prendariatj.com|6641239870|6|sent|M6RZ4C|4',
    'El Monte Chihuahua|EMC130909GH6|Patricia Olivas|polivas@elmontechih.mx|6145556677|15|sent|B8NQ5T|5',
    'Empeños Toluca Express|ETE190615JK2|Fernando Salinas|fsalinas@toluca-express.mx|7221234455|3|sent|F4LW7H|5',
    'Préstamos Veracruz Puerto|PVP200820LM3|Gabriela Herrera|gherrera@prestamosver.mx|2299876543|8|pending||6',
    'Prenda Segura León|PSL170131NP4|Miguel Ángel Torres|matorres@prendasegura.mx|4779998877|4|sent|S2KV9E|6',
    'Casa de Empeño San Luis|CES151212QR5|Daniela Rosas|drosas@empenosanluis.mx|4441237777|10|used|Y5HG3J|9',
    'Oro y Plata Cancún|OPC180228ST6|Alejandro Pech|apech@oroyplatacun.mx|9984561234|3|used|Q8MX6A|10',
    'Empeños Hermosillo Sur|EHS160404UV7|Carmen Valenzuela|cvalenzuela@empenoshmo.mx|6627778899|5|sent|T3PC8L|11',
    'Montepío Morelia|MMO140707WX8|Raúl Bautista|rbautista@montepiomorelia.mx|4433332211|6|pending||12',
    'Préstamos Culiacán Express|PCE190919YZ9|Lucía Félix|lfelix@pcexpress.mx|6671112244|2|used|V7RD2N|13',
    'Casa Empeño Oaxaca Centro|CEO200101AB2|Emilio Cruz Martínez|ecruz@empenooaxaca.mx|9515550011|3|used|G6WK4P|14',
    'Empeños Aguascalientes|EAG170505CD3|Mónica Esparza|mesparza@empenosags.mx|4497773322|7|used|N2ZT9R|15',
    'Prendamex Saltillo|PSA180812EF4|Óscar Dávila|odavila@prendamexsal.mx|8442221100|11|used|J9BH5S|16',
    'El Empeño Feliz Durango|EEF150303GH5|Rosa Elena Soto|rsoto@empenofeliz.mx|6189990000|1|pending||17',
    'Préstamos Tampico Bahía|PTB160606JK6|Eduardo Zúñiga|ezuniga@tampicobahia.mx|8331237654|4|sent|C4XM7F|18',
    'Casa de Empeño Zacatecas|CEZ190909LM7|Adriana Robles|arobles@empenozac.mx|4925554433|3|used|U8QN3G|19',
    'Montepío Xalapa|MXA141111NP8|Sergio Landa|slanda@montepioxalapa.mx|2286667788|5|used|E5TJ6W|20',
    'Empeños Ciudad Juárez|ECJ200202QR9|Teresa Holguín|tholguin@empenoscdj.mx|6563334455|14|used|Z3LB8D|21',
    'Prenda Rápida Mexicali|PRM170707ST2|Iván Ochoa|iochoa@prendarapida.mx|6862223344|6|used|H4VC9K|22',
    'Oro Seguro Villahermosa|OSV180101UV3|Natalia Pérez Lara|nperez@oroseguro.mx|9931114455|2|pending||24',
    'Casa Empeño Tepic|CET160808WX4|Diego Ibarra|dibarra@empenotepic.mx|3112225566|3|sent|R6NF2Y|26',
    'Préstamos Colima Centro|PCC151010YZ5|Elena Ceballos|eceballos@prestamoscolima.mx|3123336677|2|used|D7KP4X|28',
    'Empeños Campeche|ECA190404AB6|Arturo Uc|auc@empenoscampeche.mx|9814447788|4|used|L2WR5M|30',
    'Prendamás Pachuca|PPA200606CD7|Brenda Islas|bislas@prendamaspachuca.mx|7715558899|5|used|X9GT3B|33',
  ];
  const buildMockAccessCodes = (now = Date.now()) => SEED_ROWS.map((row, index) => {
    const [companyName, rfc, contactName, email, phone, branches, status0, code, daysAgo] = row.split('|');
    const status = STATUS_ORDER.includes(status0) ? status0 : 'pending';
    const generatedBy0 = ADMINS[index % ADMINS.length];
    const requestedAt = now - Number(daysAgo) * DAY_MS - (index + 1) * 37 * 60 * 1000;
    const withCode = status !== 'pending';
    const generatedAt = withCode ? requestedAt + Math.min(2 * HOUR_MS, Math.floor((now - requestedAt) / 2)) : null;
    const afterOneDay = generatedAt === null ? null : Math.min(generatedAt + DAY_MS, now - HOUR_MS / 60);
    const rec = {
      companyName, rfc, contactName, email, phone, branches: Number(branches), status, origin: 'webForm', code: code || null,
      id: 'ac-' + String(index + 1).padStart(3, '0'), requestedAt, generatedAt,
      sentAt: status === 'emailFailed' ? null : generatedAt,
      usedAt: status === 'used' ? afterOneDay : null,
      generatedBy: withCode ? generatedBy0 : null, events: [],
    };
    rec.events = buildMockEvents(rec);
    return rec;
  });

  /* ======================= Servicio simulado (accessCodes.service.ts) ======================= */
  const createService = ({ initialRecords, latency = LATENCY, now = Date.now, random = Math.random, currentAdmin = CURRENT_ADMIN }) => {
    let records = initialRecords.map((r) => ({ ...r }));
    let sequence = records.length;
    const ok = (data) => ({ ok: true, data });
    const fail = (error) => ({ ok: false, error });
    const delay = () => wait(latency[0] + Math.round(random() * (latency[1] - latency[0])));
    const save = (rec) => { const exists = records.some((i) => i.id === rec.id); records = exists ? records.map((i) => (i.id === rec.id ? rec : i)) : [rec, ...records]; return { ...rec }; };
    const findDuplicate = (company, excludeId) => { const d = findCompanyWithCode(records, company, excludeId); if (!d) return null; return d.field === 'companyName' ? { code: 'duplicateCompany', field: 'companyName' } : { code: 'duplicateRfc', field: 'rfc' }; };
    const issueCode = (base) => {
      const at = now(); const failed = isEmailFailureTrigger(base.email);
      return {
        ...base, status: failed ? 'emailFailed' : 'sent', code: generateAccessCode(random), generatedAt: at,
        sentAt: failed ? null : at, usedAt: null, generatedBy: currentAdmin,
        events: [...base.events, accessCodeEvent('generated', at, currentAdmin), accessCodeEvent(failed ? 'emailFailed' : 'emailSent', at, null, base.email)],
      };
    };
    const getForAction = (id, action) => { const r = records.find((i) => i.id === id); if (!r) return fail({ code: 'notFound' }); if (!canPerform(r, action)) return fail({ code: 'invalidTransition' }); return ok(r); };
    const isServerFailure = (rfc) => rfc.trim().toUpperCase() === SERVER_ERROR_RFC;
    const generateNow = (company, requestId) => {
      if (isServerFailure(company.rfc)) return fail({ code: 'server' });
      const dup = findDuplicate(company, requestId); if (dup) return fail(dup);
      if (requestId) { const req = getForAction(requestId, 'generate'); if (!req.ok) return req; return ok(save(issueCode({ ...req.data, ...company }))); }
      sequence += 1;
      return ok(save(issueCode({
        ...company, id: 'ac-new-' + sequence, status: 'pending', origin: 'admin', code: null, requestedAt: now(),
        generatedAt: null, sentAt: null, usedAt: null, generatedBy: null, events: [],
      })));
    };
    const resendNow = (id) => {
      const found = getForAction(id, 'resend'); if (!found.ok) return found;
      if (isServerFailure(found.data.rfc)) return fail({ code: 'server' });
      const at = now();
      return ok(save({ ...found.data, status: 'sent', sentAt: at, events: [...found.data.events, accessCodeEvent('emailResent', at, currentAdmin, found.data.email)] }));
    };
    const generateStored = (id) => { const r = records.find((i) => i.id === id); return r ? generateNow(toCompany(r), id) : fail({ code: 'notFound' }); };
    return {
      list: async () => { await delay(); return records.map((r) => ({ ...r })); },
      generate: async (company, requestId) => { await delay(); return generateNow(company, requestId); },
      resend: async (id) => { await delay(); return resendNow(id); },
      updateContact: async (id, changes) => { await delay(); const r = records.find((i) => i.id === id); if (!r) return fail({ code: 'notFound' }); return ok(save({ ...r, ...changes })); },
      runBatch: async (req) => { await delay(); return [...req.generate.map((id) => toBatchItem(id, 'generate', generateStored(id))), ...req.resend.map((id) => toBatchItem(id, 'resend', resendNow(id)))]; },
    };
  };

  /* ======================= Estado (useAccessCodes + useAccessCodesList + useAccessCodesBatch) ======================= */
  const params = new URLSearchParams(location.search);
  const escenarioParam = params.get('escenario');
  const scenario = escenarioParam === 'vacio' ? 'empty' : escenarioParam === 'carga-lenta' ? 'slow' : 'data';
  const service = createService({ initialRecords: scenario === 'empty' ? [] : buildMockAccessCodes(), latency: scenario === 'slow' ? SLOW_LATENCY : LATENCY });

  const S = {
    records: [], isLoading: true, hasLoaded: false, search: '', statuses: [], page: 1,
    selectedId: null, pending: null, highlightIds: [], selectedIds: [],
    batchScope: null, batchRunning: false, histExpanded: false, filterOpen: false, searchFocused: false,
    contact: null,
  };
  const attention = () => getAttentionRecords(S.records);
  const totalHistory = () => getHistoryRecords(S.records).length;
  const filtered = () => getHistoryRecords(S.records, S.search, S.statuses);
  const isInitialLoading = () => S.isLoading && !S.hasLoaded;
  const selectedRecord = () => S.records.find((r) => r.id === S.selectedId) || null;
  const pendingFor = (r) => (r && S.pending && S.pending.id === r.id ? S.pending.action : null);

  let requestId = 0;
  const load = async () => {
    requestId += 1; const id = requestId;
    S.isLoading = true; render();
    try {
      const list = await service.list();
      if (id === requestId) { S.records = list; S.hasLoaded = true; }
    } catch (e) {
      toast('error', TOASTS.loadFailed);
    } finally {
      if (id === requestId) S.isLoading = false;
    }
    render();
  };
  const upsertMany = (updates) => {
    if (updates.length === 0) return;
    const byId = new Map(updates.map((r) => [r.id, r]));
    const added = updates.filter((r) => !S.records.some((i) => i.id === r.id));
    S.records = [...added, ...S.records.map((i) => byId.get(i.id) || i)];
  };
  const changeSearch = (v) => { S.search = v; S.page = 1; render(); };
  const changeStatus = (s) => { S.statuses = s ? [s] : []; S.page = 1; render(); };
  const clearFilters = () => { S.search = ''; S.statuses = []; S.page = 1; const q = document.getElementById('acQ'); if (q) q.value = ''; };
  const changePage = (n) => { if (n === S.page) return; S.page = n; load(); };

  let highlightTimer = 0;
  const showInHistory = (ids) => {
    clearFilters(); S.highlightIds = ids;
    clearTimeout(highlightTimer);
    highlightTimer = setTimeout(() => { S.highlightIds = []; render(); }, HIGHLIGHT_MS);
  };

  /* navegación lista ↔ detalle (en la app es estado de React; aquí además queda en la URL para que "atrás" regrese a la lista) */
  const urlFor = (id) => { const p = new URLSearchParams(location.search); if (id) p.set('empresa', id); else p.delete('empresa'); const s = p.toString(); return location.pathname + (s ? '?' + s : ''); };
  const openDetail = (r) => { closeForm(); S.selectedId = r.id; S.histExpanded = false; S.contact = null; history.pushState({ empresa: r.id }, '', urlFor(r.id)); render(); };
  const backToList = () => { S.selectedId = null; S.contact = null; history.pushState({}, '', urlFor(null)); render(); };
  addEventListener('popstate', () => { closeForm(); if (S.batchScope && !S.batchRunning) { S.batchScope = null; closeModal(true); } S.selectedId = new URLSearchParams(location.search).get('empresa'); S.contact = null; render(); });
  S.selectedId = params.get('empresa');

  const handleAction = (action, r) => {
    if (action === 'viewDetail') openDetail(r);
    if (action === 'generate') openForm(r);
    if (action === 'resend') resend(r);
  };
  const resend = async (r) => {
    S.pending = { id: r.id, action: 'resend' }; render();
    const result = await service.resend(r.id);
    S.pending = null;
    if (!result.ok) { toast('error', SERVICE_ERRORS[result.error.code]); render(); return; }
    upsertMany([result.data]); showInHistory([result.data.id]); render();
    const fb = getGenerateToast(result.data); toast(fb.type, fb.message);
  };

  /* selección y lote (useAccessCodesBatch) */
  const pruneSelection = () => { const ids = new Set(attention().map((r) => r.id)); S.selectedIds = S.selectedIds.filter((id) => ids.has(id)); };
  const toggleSelect = (id) => { S.selectedIds = S.selectedIds.includes(id) ? S.selectedIds.filter((i) => i !== id) : [...S.selectedIds, id]; render(); };
  const toggleAll = () => { const att = attention(); S.selectedIds = getSelectionState(S.selectedIds, att) === 'all' ? [] : att.map((r) => r.id); render(); };
  const clearSelection = () => { S.selectedIds = []; render(); };
  const openBatch = (action) => { S.batchScope = getBatchScope(getBulkSelection(S.selectedIds, attention()), action); openBatchModal(); };
  const confirmBatch = async () => {
    if (!S.batchScope || S.batchRunning) return;
    const req = { generate: S.batchScope.generate.map((r) => r.id), resend: S.batchScope.resend.map((r) => r.id) };
    S.batchRunning = true; paintBatchRunning();
    try {
      const items = await service.runBatch(req);
      S.selectedIds = S.selectedIds.filter((id) => ![...req.generate, ...req.resend].includes(id));
      upsertMany(items.flatMap((i) => (i.record ? [i.record] : [])));
      const sentIds = items.filter((i) => i.outcome === 'sent').map((i) => i.id);
      if (sentIds.length > 0) showInHistory(sentIds);
      getBatchToasts(items).forEach((f) => toast(f.type, f.message));
    } finally {
      S.batchRunning = false; S.batchScope = null; render(); closeModal();
    }
  };

  /* ======================= DS: piezas de marcado ======================= */
  const btn = (variant, label, attrs = '', opts = {}) => {
    const iconHtml = opts.icon && !opts.loading ? '<span class="cd-btn__ico">' + opts.icon + '</span>' : '';
    const spinner = opts.loading ? '<span class="cd-spinner" aria-hidden="true"></span>' : '';
    return '<button type="' + (opts.type || 'button') + '" class="cd-btn cd-btn--' + variant + (iconHtml ? ' cd-btn--icon' : '') + (opts.loading ? ' is-loading' : '') + '"'
      + (opts.loading ? ' disabled aria-busy="true"' : '') + ' ' + attrs + '>' + spinner + iconHtml + '<span class="cd-btn__txt">' + esc(label) + '</span></button>';
  };
  /* loading del Button sin volver a pintarlo: spinner, bloqueado (como en el DS, que lo deshabilita) */
  const setBtnLoading = (b, on) => {
    if (!b) return;
    b.classList.toggle('is-loading', on); b.disabled = on;
    if (on) b.setAttribute('aria-busy', 'true'); else b.removeAttribute('aria-busy');
    const sp = b.querySelector('.cd-spinner');
    if (on && !sp) b.insertAdjacentHTML('afterbegin', '<span class="cd-spinner" aria-hidden="true"></span>');
    if (!on && sp) sp.remove();
  };
  const chip = (status) => { const m = STATUS_META[status]; return '<span class="cd-chip cd-chip--' + m.variant + '">' + esc(m.label) + '</span>'; };
  const checkbox = (checked, ariaLabel, attrs = '') => '<span class="ac-selbox" data-stop><label class="cd-check"><input type="checkbox"' + (checked ? ' checked' : '') + ' aria-label="' + esc(ariaLabel) + '" ' + attrs + ' />'
    + '<span class="cd-check__box"><svg class="cd-check__tick" width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true"><path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    + '<svg class="cd-check__dash" width="12" height="2" viewBox="0 0 12 2" fill="none" aria-hidden="true"><path d="M1 1H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span></label></span>';
  const codeGroups = (code, compact) => '<span class="ac-code' + (compact ? ' ac-code--compact' : '') + '" role="img" aria-label="' + esc(DISPLAY_T.codeAriaLabel + ' ' + normalizeAccessCode(code)) + '">'
    + splitAccessCode(code).map((g) => '<span aria-hidden="true">' + esc(g) + '</span>').join('') + '</span>';
  const alertBox = (variant, title, text, action = '') => '<div class="cd-alert cd-alert--' + variant + '"><div class="cd-alert__wrap"><span class="cd-alert__ico">'
    + ico(variant === 'warning' ? 'WarningFilled' : 'EstadosError', 24) + '</span><div class="cd-alert__content">'
    + (title ? '<p class="cd-alert__title">' + esc(title) + '</p>' : '') + (text ? '<p class="cd-alert__text">' + esc(text) + '</p>' : '') + '</div></div>'
    + (action ? '<div class="cd-alert__action">' + action + '</div>' : '') + '</div>';
  const crumbSep = '<span class="ds-breadcrumb__sep" aria-hidden="true"><img class="pos-crumb-sep" src="../assets/ds/ArrowForwardIos-D4D6D8.svg" alt="" /></span>';

  /* copiar (useCopyAccessCode): "Copiado" durante 2 s */
  const copied = new Set();
  const copyCode = async (code, key) => {
    let success = false;
    try { if (navigator.clipboard) { await navigator.clipboard.writeText(normalizeAccessCode(code)); success = true; } } catch (e) { success = false; }
    if (!success) { toast('error', TOASTS.copyFailed); return; }
    copied.add(key); render();
    setTimeout(() => { copied.delete(key); render(); }, COPIED_FEEDBACK_MS);
  };
  const copyIconButton = (r) => {
    const key = 'copy-' + r.id; const done = copied.has(key);
    return '<span class="ac-inline" data-stop><button type="button" class="cd-ibtn" aria-label="' + esc(T.copyAriaLabel) + '" data-copy="' + esc(r.code) + '" data-k="' + key + '">'
      + (done ? '<span style="color:#309c60;display:inline-flex">' + ico('Check', 20) + '</span>' : ico('ContentCopy', 20)) + '</button>'
      + '<span aria-live="polite">' + (done ? '<span class="ac-copied">' + esc(T.copied) + '</span>' : '') + '</span></span>';
  };

  /* ======================= Tabla (AccessCodesTable + celdas) ======================= */
  const cell = {
    select: (r) => '<td class="cd-td cd-td--check">' + checkbox(S.selectedIds.includes(r.id), SELECTION_T.selectRowAriaPrefix + r.companyName, 'data-sel="' + r.id + '" data-k="sel-' + r.id + '"') + '</td>',
    requestedAt: (r) => '<td class="cd-td"><span class="ac-txt">' + esc(formatDateTime(r.requestedAt)) + '</span></td>',
    sentAt: (r) => '<td class="cd-td"><span class="ac-txt">' + esc(formatDateTime(r.sentAt)) + '</span></td>',
    company: (r, cfg) => {
      const long = r.companyName.length > TRUNCATE_AT;
      const caption = cfg.showCodeUnderCompany && r.status === 'emailFailed' ? formatCodeCaption(r.code) : undefined;
      return '<td class="cd-td cd-td--desc"><p class="cd-td__main"><span class="ac-trunc"' + (long ? ' data-tip="' + esc(r.companyName) + '"' : '') + '>' + esc(r.companyName) + '</span></p>'
        + (caption ? '<p class="cd-td__sub">' + esc(caption) + '</p>' : '') + '</td>';
    },
    contact: (r) => '<td class="cd-td cd-td--desc"><p class="cd-td__main">' + esc(r.contactName) + '</p><p class="cd-td__sub">' + esc(r.email) + '</p></td>',
    code: (r, cfg) => '<td class="cd-td">' + (r.code
      ? '<span class="ac-inline">' + codeGroups(r.code, true) + (cfg.copyStatuses.includes(r.status) ? copyIconButton(r) : '') + '</span>'
      : '<span class="ac-txt ac-txt--caption">' + esc(T.noCode) + '</span>') + '</td>',
    status: (r) => '<td class="cd-td">' + chip(r.status) + '</td>',
    action: (r) => {
      const actions = getRowActions(r); const resending = S.pending && S.pending.id === r.id && S.pending.action === 'resend';
      return '<td class="cd-td cd-td--right"><span class="ac-inline" data-stop>'
        + (actions.includes('generate') ? btn('secondary', ROW_BUTTON_LABELS.generate, 'data-act="generate" data-id="' + r.id + '" data-k="gen-' + r.id + '"') : '')
        + (actions.includes('resend') ? btn('secondary', ROW_BUTTON_LABELS.resend, 'data-act="resend" data-id="' + r.id + '" data-k="res-' + r.id + '"', { loading: resending }) : '')
        + '</span></td>';
    },
  };
  const tableHtml = (variant, records, loading, opts = {}) => {
    const cfg = TABLE_CONFIG[variant];
    const selState = variant === 'attention' ? getSelectionState(S.selectedIds, records) : 'none';
    const head = cfg.columns.map((c) => (c.key === 'select'
      ? '<td class="cd-th cd-td--check">' + (!loading && records.length > 0 ? checkbox(selState === 'all', SELECTION_T.selectAllAriaLabel, 'data-selall data-k="sel-all"' + (selState === 'partial' ? ' data-indeterminate' : '')) : '') + '</td>'
      : '<th class="cd-th' + (c.align === 'right' ? ' cd-th--right' : '') + '" scope="col"><div class="cd-th__in">' + esc(HEADERS[c.key]) + '</div></th>')).join('');
    const rows = loading
      ? Array.from({ length: cfg.skeletonRows }, () => '<tr class="cd-tr">' + cfg.columns.map(() => '<td class="cd-td--loading"><div class="cd-shimmer"></div></td>').join('') + '</tr>').join('')
      : records.map((r) => {
        const sel = S.selectedIds.includes(r.id) && variant === 'attention';
        const hl = (opts.highlightIds || []).includes(r.id);
        return '<tr class="cd-tr cd-tr--click' + (sel ? ' cd-tr--selected' : '') + (hl ? ' ' + ROW_CLASSES.highlighted : '') + '" tabindex="0" aria-label="' + esc(T.rowAriaLabelPrefix + r.companyName) + '" data-row="' + r.id + '" data-k="row-' + r.id + '">'
          + cfg.columns.map((c) => cell[c.key](r, cfg)).join('') + '</tr>';
      }).join('');
    return '<div class="cd-tframe" data-tframe><div class="cd-tscroll"><table class="cd-table ac-table" style="min-width:' + cfg.minWidth + '">'
      + '<colgroup>' + cfg.columns.map((c) => '<col style="width:' + c.width + '" />').join('') + '</colgroup>'
      + '<thead><tr>' + head + '</tr></thead><tbody>' + rows + '</tbody></table></div></div>';
  };
  /* sombras de scroll horizontal (useHorizontalScrollShadows): derecha al inicio, ambas en medio, izquierda al final */
  const paintShadows = (frame) => {
    const el = frame.querySelector('.cd-tscroll'); if (!el) return;
    frame.classList.toggle('is-start', el.scrollLeft > 1);
    frame.classList.toggle('is-end', el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };
  const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver((entries) => entries.forEach((e) => { const f = e.target.closest('[data-tframe]'); if (f) paintShadows(f); }));
  const wireShadows = (root) => {
    root.querySelectorAll('[data-tframe]').forEach((f) => {
      const el = f.querySelector('.cd-tscroll'); paintShadows(f);
      el.addEventListener('scroll', () => paintShadows(f), { passive: true });
    });
    if (ro) { ro.disconnect(); document.querySelectorAll('[data-tframe] .cd-tscroll').forEach((el) => { ro.observe(el); if (el.firstElementChild) ro.observe(el.firstElementChild); }); }
  };
  addEventListener('resize', () => document.querySelectorAll('[data-tframe]').forEach(paintShadows));

  /* ======================= Vista: lista ======================= */
  const main = document.getElementById('acMain');
  let view = null;

  const emptyState = (variant) => {
    const noRecords = variant === 'noRecords';
    return '<div class="ac-empty" role="status"><img src="' + EMPTY_ILLUSTRATION.src + '" alt="' + EMPTY_ILLUSTRATION.alt + '" height="' + EMPTY_ILLUSTRATION.height + '" />'
      + '<p class="ac-empty__t">' + esc(noRecords ? T.emptyNoRecordsTitle : T.emptyNoResultsTitle) + '</p>'
      + '<p class="ac-empty__d">' + esc(noRecords ? T.emptyNoRecordsDescription : T.emptyNoResultsDescription) + '</p>'
      + (noRecords ? btn('secondary', T.generateButton, 'data-create data-k="empty-create"', { icon: ico('Add', 20) }) : btn('secondary', T.clearSearch, 'data-clear data-k="empty-clear"'))
      + '</div>';
  };

  const buildList = () => {
    main.innerHTML = ''
      + '<nav aria-label="Breadcrumb" class="ds-breadcrumb"><ol class="pos-crumbs">'
      + '<li><a href="../home/" class="ds-breadcrumb__link" data-home>Home</a>' + crumbSep + '</li>'
      + '<li><span class="ds-breadcrumb__current" aria-current="page">' + esc(T.pageTitle) + '</span></li></ol></nav>'
      + '<div class="ac-head"><h1 class="ac-title" tabindex="-1">' + esc(T.pageTitle) + '</h1>'
      + btn('primary', T.generateButton, 'data-create data-k="head-create"', { icon: ico('Add', 20) }) + '</div>'
      + '<section class="ac-card" id="acAtencion" aria-labelledby="acAtencionT"></section>'
      + '<section class="ac-card" id="acHistorial" aria-labelledby="acHistT">'
      + '<div class="ac-card__head"><h2 class="ac-h2" id="acHistT">' + esc(T.historyTitle) + '</h2>'
      + '<div class="ac-toolbar" id="acToolbar" hidden>'
      + '<div class="ac-searchbox"><div class="cd-search"><div class="cd-search__ctrl">'
      + '<input class="cd-search__input" id="acQ" type="text" role="searchbox" autocomplete="off" placeholder="' + esc(T.searchPlaceholder) + '" aria-label="' + esc(T.searchAriaLabel) + '" />'
      + '<button type="button" class="cd-search__btn" id="acQBtn"></button></div></div></div>'
      + '<div class="cd-fchip" id="acFiltro"></div>'
      + '<div id="acPag"></div>'
      + '</div></div>'
      + '<div id="acHistBody"></div></section>';
    const q = main.querySelector('#acQ');
    q.value = S.search;
    q.addEventListener('input', () => changeSearch(q.value));
    q.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); changeSearch(q.value); } if (e.key === 'Escape') q.blur(); });
    q.addEventListener('focus', () => { S.searchFocused = true; paintSearchButton(); });
    q.addEventListener('blur', () => { S.searchFocused = false; paintSearchButton(); });
    const qb = main.querySelector('#acQBtn');
    qb.addEventListener('mousedown', (e) => e.preventDefault());
    qb.addEventListener('click', () => { if (qb.dataset.mode === 'clear') { q.value = ''; changeSearch(''); } else changeSearch(q.value); });
  };
  /* SearchFieldV2: con texto y sin foco muestra la X para limpiar; si no, la lupa */
  const paintSearchButton = () => {
    const qb = document.getElementById('acQBtn'); if (!qb) return;
    const clear = Boolean(S.search) && !S.searchFocused;
    qb.dataset.mode = clear ? 'clear' : 'search';
    qb.setAttribute('aria-label', clear ? T.clearSearchAriaLabel : 'Buscar');
    qb.innerHTML = ico(clear ? 'Close' : 'Search', 24);
  };
  const renderAttention = () => {
    const card = document.getElementById('acAtencion');
    const att = attention(); const loading = isInitialLoading();
    if (!loading && att.length === 0) { card.hidden = true; card.innerHTML = ''; return; }
    card.hidden = false; card.setAttribute('aria-busy', String(loading));
    const count = loading ? 0 : S.selectedIds.length;
    const bulk = getBulkActions(getBulkSelection(S.selectedIds, att));
    card.innerHTML = '<div class="cd-dt"><div class="cd-dt__title-row"><h2 class="cd-dt__title" id="acAtencionT">' + esc(formatAttentionTitle(loading ? undefined : att.length)) + '</h2></div>'
      + (count > 0 ? '<div class="cd-dt__selection"><div class="cd-dt__selection-info"><span class="cd-dt__count">' + esc(formatSelectionCount(count)) + '</span>'
        + '<button type="button" class="cd-dt__deselect" data-deselect data-k="deselect">' + esc(SELECTION_T.deselect) + '</button></div>'
        /* Corrección: en el código las dos acciones del lote van en primary; aquí solo la primera (regla de su CLAUDE.md: un primary por bloque) */
        + '<div class="cd-dt__actions">' + bulk.map((b, i) => btn(i === 0 ? 'primary' : 'secondary', b.label, 'data-bulk="' + b.action + '" data-k="bulk-' + b.action + '"')).join('') + '</div></div>' : '')
      + tableHtml('attention', att, loading) + '</div>';
    const all = card.querySelector('[data-indeterminate]'); if (all) all.indeterminate = true;
    wireShadows(card);
  };
  const renderFilterChip = () => {
    const box = document.getElementById('acFiltro'); if (!box) return;
    const value = S.statuses[0];
    const selected = FILTER_OPTIONS.find((o) => o.value === value);
    const label = selected ? selected.label : FILTER_ALL.label;
    box.innerHTML = '<button type="button" class="cd-fchip__btn' + (value || S.filterOpen ? ' is-on' : '') + '" aria-haspopup="listbox" aria-expanded="' + S.filterOpen + '" aria-controls="acFiltroMenu" data-fchip data-k="fchip">'
      + ico('FilterAlt', 20) + '<span>' + esc(label) + '</span><span class="cd-fchip__arrow">' + ico('ArrowDropDown', 20) + '</span></button>'
      + '<div class="cd-fchip__menu" id="acFiltroMenu" role="listbox" aria-label="Estado"' + (S.filterOpen ? '' : ' hidden') + '>'
      + FILTER_OPTIONS.map((o) => '<button type="button" class="cd-fchip__opt" role="option" aria-selected="' + (o.value === value) + '" data-fopt="' + o.value + '" data-k="fopt-' + o.value + '">' + esc(o.label) + '</button>').join('')
      + '</div>';
  };
  const renderPagination = () => {
    const total = filtered().length; const page = S.page;
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const first = page <= 1; const last = page >= pages;
    const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1; const end = Math.min(page * PAGE_SIZE, total);
    const b = (dis, to, label, icon, k) => '<button type="button" class="cd-pag__btn" aria-label="' + label + '"' + (dis ? ' disabled' : '') + ' data-page="' + to + '" data-k="' + k + '">' + ico(icon, 20) + '</button>';
    document.getElementById('acPag').innerHTML = '<div class="cd-pag"><div class="cd-pag__ctrls">' + b(first, 1, 'Primera página', 'FirstPage', 'pag-first') + b(first, page - 1, 'Página anterior', 'ArrowBackIos', 'pag-prev') + '</div>'
      + '<span class="cd-pag__txt">' + start + '-' + end + ' de ' + total + ' resultados</span>'
      + '<div class="cd-pag__ctrls">' + b(last, page + 1, 'Página siguiente', 'ArrowForwardIos', 'pag-next') + b(last, pages, 'Última página', 'LastPage', 'pag-last') + '</div></div>';
  };
  const renderHistory = () => {
    const card = document.getElementById('acHistorial');
    const totalH = totalHistory(); const showControls = totalH > 0; const showNoRecords = !S.isLoading && !showControls;
    card.setAttribute('aria-busy', String(S.isLoading));
    const list = filtered();
    const lastPage = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    if (S.page > lastPage) S.page = lastPage;
    document.getElementById('acToolbar').hidden = !showControls;
    if (showControls) { renderFilterChip(); renderPagination(); paintSearchButton(); }
    const body = document.getElementById('acHistBody');
    if (showNoRecords) { body.innerHTML = emptyState('noRecords'); return; }
    /* Corrección: en el código "No hay resultados" va en una fila de la tabla de 880 y a 375 queda centrado fuera de la vista;
       aquí se muestra en la tarjeta, en lugar de la tabla */
    if (!S.isLoading && list.length === 0) { body.innerHTML = emptyState('noResults'); return; }
    body.innerHTML = tableHtml('history', paginate(list, S.page, PAGE_SIZE), S.isLoading, { highlightIds: S.highlightIds });
    wireShadows(body);
  };

  /* ======================= Vista: detalle de la empresa (CompanyDetail) ======================= */
  const viewField = (label, value) => '<div class="ac-field"><span class="ac-field__l">' + esc(label) + '</span><span class="ac-field__v">' + esc(value && String(value).trim() ? value : T.emptyValue) + '</span></div>';
  const invitationCard = (r) => {
    const actions = getRowActions(r);
    const events = getAccessCodeHistory(r);
    const visible = S.histExpanded ? events : events.slice(0, HISTORY_VISIBLE);
    const key = 'copy-detail-' + r.id; const done = copied.has(key);
    const display = r.code
      ? '<div class="ac-codebox">' + codeGroups(r.code, false)
        + (actions.includes('copy') ? '<span aria-live="polite">' + btn('primary', done ? DISPLAY_T.copied : DISPLAY_T.copy, 'data-copy="' + esc(r.code) + '" data-copykey="' + key + '" data-k="' + key + '"', { icon: ico(done ? 'Check' : 'ContentCopy', 20) }) + '</span>' : '')
        + '</div>'
      : '<div class="ac-codebox"><span class="ac-codebox__txt">' + esc(DETAIL_T.noCode) + '</span>' + btn('primary', ACTION_LABELS.generate, 'data-act="generate" data-id="' + r.id + '" data-k="detail-gen"') + '</div>';
    return '<section class="ac-card" aria-labelledby="acInvT"><div class="ac-card__head"><h2 class="ac-h2" id="acInvT">' + esc(DETAIL_T.invitationTitle) + '</h2></div><hr class="ac-card__divider" />'
      + '<div class="ac-inv"><div class="ac-inv__main">' + display
      + (r.status === 'emailFailed' ? alertBox('warning', DETAIL_T.emailFailedTitle, DETAIL_T.emailFailedText) : '')
      + '<div class="ac-inv__meta"><div class="ac-field"><span class="ac-field__l">' + esc(DETAIL_T.statusLabel) + '</span><span>' + chip(r.status) + '</span></div>'
      + viewField(DETAIL_T.originLabel, ORIGIN_LABELS[r.origin]) + '</div></div>'
      + '<section class="ac-hist" aria-label="' + esc(HISTORY_T.title) + '"><h3 class="ac-hist__t">' + esc(HISTORY_T.title) + '</h3><ol class="ac-hist__list">'
      + visible.map((e) => {
        const bad = NEGATIVE_EVENTS.includes(e.type);
        return '<li class="ac-hist__item"><span class="ac-hist__ico ' + (bad ? 'ac-hist__ico--bad' : 'ac-hist__ico--ok') + '" aria-hidden="true">' + ico(bad ? 'Error' : 'CheckCircle', 20) + '</span>'
          + '<div class="ac-hist__text"><span class="ac-hist__ev">' + esc(getEventText(e)) + '</span><span class="ac-hist__meta">' + esc(getEventMeta(e)) + '</span></div></li>';
      }).join('') + '</ol>'
      + (events.length > HISTORY_VISIBLE ? '<div class="ac-hist__toggle">' + btn('tertiary', S.histExpanded ? HISTORY_T.showLess : HISTORY_T.showAll + ' (' + events.length + ')', 'data-histtoggle data-k="hist-toggle"') + '</div>' : '')
      + '</section></div></section>';
  };

  /* campos del formulario (AccessCodeFieldInput → TextInput / NumberInput del DS) */
  const fieldHtml = (cfg, id, value, error) => {
    const help = error || cfg.helper || '';
    const isNum = cfg.input === 'phone' || cfg.input === 'number';
    const common = 'id="' + id + '" name="' + cfg.name + '" placeholder="' + esc(cfg.placeholder) + '" value="' + esc(value) + '" aria-describedby="' + id + '-help" data-k="f-' + id + '"' + (error ? ' aria-invalid="true"' : '');
    return '<div class="cd-input' + (error ? ' is-error' : '') + '" data-field="' + cfg.name + '">'
      + '<div class="cd-input__lrow"><label class="cd-input__label" for="' + id + '">' + esc(cfg.label) + '</label>' + (cfg.optional ? '<span class="cd-input__opt">(opcional)</span>' : '') + '</div>'
      + (isNum
        ? '<div class="cd-num">' + (cfg.input === 'phone' ? '<span class="cd-num__prefix">' + MEXICO_FLAG + '<span>+52</span></span>' : '')
          + '<input class="cd-num__field" type="' + (cfg.input === 'phone' ? 'tel' : 'text') + '" inputmode="numeric" maxlength="' + cfg.maxLength + '" autocomplete="off" ' + common + ' /></div>'
        : '<input class="cd-input__field" type="text" autocomplete="off" ' + common + ' />')
      + '<span class="cd-input__help" id="' + id + '-help"' + (help ? '' : ' hidden') + '>' + (error ? ico('Close', 16) : '') + esc(help) + '</span></div>';
  };
  const paintFieldError = (root, cfg, msg) => {
    const w = root.querySelector('[data-field="' + cfg.name + '"]'); if (!w) return;
    w.classList.toggle('is-error', Boolean(msg));
    const help = w.querySelector('.cd-input__help'); const text = msg || cfg.helper || '';
    help.hidden = !text; help.innerHTML = (msg ? ico('Close', 16) : '') + esc(text);
    const inp = w.querySelector('input'); if (msg) inp.setAttribute('aria-invalid', 'true'); else inp.removeAttribute('aria-invalid');
  };
  /* MissingFieldsAlert: solo errores de validación (no los del servidor), en el orden de los campos */
  const missingAlertHtml = (errors, visible) => {
    const labels = FIELDS.filter((f) => errors[f.name] && errors[f.name].type !== 'server').map((f) => f.label);
    if (!visible || labels.length === 0) return '';
    return alertBox('error', MISSING_T.title, MISSING_T.textPrefix + labels.join(', ') + '.');
  };

  /* controlador de formulario: modo onTouched de react-hook-form (valida al salir del campo y, ya tocado o enviado, al escribir).
     NumberInput del DS no tiene onBlur (gap anotado por Product Design), así que teléfono y sucursales se validan hasta enviar. */
  const createForm = (root, cfgs, values, onChange) => {
    const st = { values: { ...values }, errors: {}, touched: new Set(), submitted: false };
    const cfgOf = (n) => cfgs.find((c) => c.name === n);
    const validateField = (n) => {
      const msg = VALIDATORS[n](st.values[n] || '');
      if (msg) st.errors[n] = { type: 'validation', message: msg }; else delete st.errors[n];
      paintFieldError(root, cfgOf(n), msg); onChange && onChange();
    };
    root.addEventListener('input', (e) => {
      const n = e.target.name; const cfg = cfgOf(n); if (!cfg) return;
      let v = e.target.value;
      if (cfg.input === 'phone' || cfg.input === 'number') { const clean = v.replace(/\D/g, '').slice(0, cfg.maxLength); if (clean !== v) e.target.value = clean; v = clean; }
      st.values[n] = v;
      if (st.touched.has(n) || st.submitted || (st.errors[n] && st.errors[n].type === 'server')) validateField(n);
      else onChange && onChange(n);
    });
    root.addEventListener('focusout', (e) => {
      const n = e.target.name; const cfg = cfgOf(n); if (!cfg || cfg.input) return;
      st.touched.add(n); validateField(n);
    });
    st.validateAll = () => { st.submitted = true; cfgs.forEach((c) => validateField(c.name)); return cfgs.filter((c) => st.errors[c.name]); };
    st.setServerError = (n, msg) => { st.errors[n] = { type: 'server', message: msg }; paintFieldError(root, cfgOf(n), msg); onChange && onChange(); const i = root.querySelector('[name="' + n + '"]'); if (i) i.focus(); };
    return st;
  };

  const contactCard = (r) => {
    const values = companyToFormValues(r);
    const c = S.contact; const editing = Boolean(c && c.editing);
    const editable = getEditableContactFields(r.status);
    const action = editing
      ? '<div class="ac-head__actions">' + btn('tertiary', DETAIL_T.cancel, 'data-contact="cancel" data-k="contact-cancel"') + btn('primary', DETAIL_T.save, 'data-contact="save" data-k="contact-save"', { loading: c.saving }) + '</div>'
      : btn('tertiary', DETAIL_T.edit, 'data-contact="edit" data-k="contact-edit"', { icon: ico('Edit', 20) });
    return '<section class="ac-card" aria-labelledby="acConT"><div class="ac-card__head"><h2 class="ac-h2" id="acConT">' + esc(DETAIL_T.contactTitle) + '</h2>' + action + '</div><hr class="ac-card__divider" />'
      + '<form class="ac-stack" id="acContactForm" novalidate><div id="acContactMissing"></div><div class="ac-fields">'
      + FIELDS.map((f) => (editing && editable.includes(f.name)
        ? fieldHtml(f, 'company-contact-' + f.name, c.form ? c.form.values[f.name] : values[f.name], c.form && c.form.errors[f.name] ? c.form.errors[f.name].message : '')
        : viewField(f.label, values[f.name]))).join('')
      + '</div><button type="submit" class="ac-sr" tabindex="-1" aria-hidden="true"></button></form></section>';
  };

  const buildDetail = () => {
    const r = selectedRecord();
    const resendable = getRowActions(r).includes('resend');
    main.innerHTML = '<nav aria-label="Breadcrumb" class="ds-breadcrumb"><ol class="pos-crumbs">'
      + '<li><a href="../home/" class="ds-breadcrumb__link" data-home>Home</a>' + crumbSep + '</li>'
      + '<li><button type="button" class="ac-crumb-btn" data-back data-k="crumb-back">' + esc(T.pageTitle) + '</button>' + crumbSep + '</li>'
      + '<li><span class="ds-breadcrumb__current" aria-current="page">' + esc(r.companyName) + '</span></li></ol></nav>'
      + '<div class="ac-head"><h1 class="ac-title" tabindex="-1">' + esc(r.companyName) + '</h1>'
      + (resendable ? '<div class="ac-head__actions">' + btn('secondary', ACTION_LABELS.resend, 'data-act="resend" data-id="' + r.id + '" data-k="detail-resend"', { loading: pendingFor(r) === 'resend' }) + '</div>' : '')
      + '</div>' + invitationCard(r) + contactCard(r);
    wireContactForm(r);
  };
  const wireContactForm = (r) => {
    const c = S.contact; if (!c || !c.editing) return;
    const form = document.getElementById('acContactForm');
    const editable = getEditableContactFields(r.status);
    const cfgs = FIELDS.filter((f) => editable.includes(f.name));
    const prev = c.form;
    c.form = createForm(form, cfgs, prev ? prev.values : { branches: String(r.branches), email: r.email }, () => paintContactMissing());
    if (prev) { c.form.errors = prev.errors; c.form.touched = prev.touched; c.form.submitted = prev.submitted; }
    paintContactMissing();
    form.addEventListener('submit', (e) => { e.preventDefault(); saveContact(); });
  };
  const paintContactMissing = () => {
    const box = document.getElementById('acContactMissing'); const c = S.contact; if (!box || !c || !c.form) return;
    box.innerHTML = missingAlertHtml(c.form.errors, c.editing && c.form.submitted);
  };
  const startEditContact = () => {
    S.contact = { editing: true, saving: false, form: null }; render();
    const r = selectedRecord();
    requestAnimationFrame(() => { const el = document.getElementById('company-contact-' + getEditableContactFields(r.status)[0]); if (el) el.focus(); });
  };
  const cancelEditContact = () => { if (S.contact && S.contact.saving) return; S.contact = null; render(); const b = main.querySelector('[data-k="contact-edit"]'); if (b) b.focus(); };
  const saveContact = async () => {
    const c = S.contact; if (!c || c.saving) return;
    const bad = c.form.validateAll();
    if (bad.length) { const i = document.getElementById('company-contact-' + bad[0].name); if (i) i.focus(); return; }
    c.saving = true; render();
    const r = selectedRecord();
    const result = await service.updateContact(r.id, { branches: Number(c.form.values.branches.trim()), email: c.form.values.email.trim() });
    c.saving = false;
    if (!result.ok) { toast('error', SERVICE_ERRORS[result.error.code]); render(); c.form.setServerError(result.error.field === 'email' ? 'email' : 'branches', SERVICE_ERRORS[result.error.code]); return; }
    upsertMany([result.data]); toast('success', TOASTS.contactSaved);
    S.contact = null; render();
  };

  /* ======================= Render ======================= */
  const withFocus = (fn) => {
    const a = document.activeElement;
    const k = a && main.contains(a) ? a.getAttribute('data-k') : null;
    fn();
    if (k) { const el = main.querySelector('[data-k="' + k + '"]'); if (el && el !== document.activeElement) el.focus({ preventScroll: true }); }
  };
  /* focusFirstIn de useDialogFocus; se salta el "Home" del breadcrumb que se agregó en el prototipo, para caer donde caía en su pantalla */
  const focusFirstIn = (root) => { const el = root && root.querySelector('button:not([disabled]), a[href]:not([data-home]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'); if (el) el.focus(); };
  let firstRender = true;
  const render = () => {
    pruneSelection();
    const r = selectedRecord();
    const next = r ? 'detail' : 'list';
    if (next !== view) {
      view = next;
      if (next === 'list') { buildList(); renderAttention(); renderHistory(); } else buildDetail();
      main.setAttribute('aria-busy', String(S.isLoading));
      if (!firstRender) focusFirstIn(main);
      firstRender = false;
      return;
    }
    main.setAttribute('aria-busy', String(S.isLoading));
    withFocus(() => {
      if (view === 'list') { renderAttention(); renderHistory(); }
      else buildDetail();
    });
  };

  /* ======================= Eventos (delegados) ======================= */
  main.addEventListener('click', (e) => {
    const t = e.target;
    if (t.closest('[data-home]')) return;   /* Home lleva al Home con widgets (../home/) */
    const copyBtn = t.closest('[data-copy]');
    if (copyBtn) { e.stopPropagation(); copyCode(copyBtn.dataset.copy, copyBtn.dataset.copykey || copyBtn.dataset.k); return; }
    if (t.closest('[data-create]')) { openForm(null); return; }
    if (t.closest('[data-clear]')) { clearFilters(); render(); return; }
    if (t.closest('[data-back]')) { backToList(); return; }
    if (t.closest('[data-deselect]')) { clearSelection(); return; }
    const bulk = t.closest('[data-bulk]'); if (bulk) { openBatch(bulk.dataset.bulk); return; }
    const act = t.closest('[data-act]');
    if (act) { const r = S.records.find((i) => i.id === act.dataset.id); if (r) handleAction(act.dataset.act, r); return; }
    if (t.closest('[data-histtoggle]')) { S.histExpanded = !S.histExpanded; render(); return; }
    const cf = t.closest('[data-contact]');
    if (cf) { const a = cf.dataset.contact; if (a === 'edit') startEditContact(); else if (a === 'cancel') cancelEditContact(); else saveContact(); return; }
    const fchip = t.closest('[data-fchip]'); if (fchip) { S.filterOpen = !S.filterOpen; renderFilterChip(); if (S.filterOpen) { const o = main.querySelector('.cd-fchip__opt[aria-selected="true"]') || main.querySelector('.cd-fchip__opt'); if (o) o.focus(); } return; }
    const fopt = t.closest('[data-fopt]');
    if (fopt) { const v = fopt.dataset.fopt; const cur = S.statuses[0]; S.filterOpen = false; const next = v === cur ? undefined : v; changeStatus(toAccessCodeStatus(next)); const b = main.querySelector('[data-fchip]'); if (b) b.focus(); return; }
    const pg = t.closest('[data-page]'); if (pg && !pg.disabled) { changePage(Number(pg.dataset.page)); return; }
    if (t.closest('[data-stop]')) return;
    const row = t.closest('[data-row]');
    if (row) { const r = S.records.find((i) => i.id === row.dataset.row); if (r) handleAction('viewDetail', r); }
  });
  main.addEventListener('change', (e) => {
    const t = e.target;
    if (t.matches('[data-sel]')) toggleSelect(t.dataset.sel);
    else if (t.matches('[data-selall]')) toggleAll();
  });
  main.addEventListener('keydown', (e) => {
    const row = e.target.closest && e.target.matches('[data-row]') ? e.target : null;
    if (row && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); const r = S.records.find((i) => i.id === row.dataset.row); if (r) handleAction('viewDetail', r); }
    if (e.key === 'Escape' && S.filterOpen) { S.filterOpen = false; renderFilterChip(); const b = main.querySelector('[data-fchip]'); if (b) b.focus(); }
    if (S.filterOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp') && e.target.matches('.cd-fchip__opt')) {
      e.preventDefault(); const opts = [...main.querySelectorAll('.cd-fchip__opt')]; const i = opts.indexOf(e.target);
      opts[(i + (e.key === 'ArrowDown' ? 1 : opts.length - 1)) % opts.length].focus();
    }
  });
  document.addEventListener('mousedown', (e) => { if (S.filterOpen && !e.target.closest('#acFiltro')) { S.filterOpen = false; renderFilterChip(); } });

  /* ======================= Modales (Modal del DS + useDialogFocus) ======================= */
  const modalRoot = document.getElementById('acModales');
  let modal = null; // {el, previous, onClose, keyHandler}
  const FOCUSABLE = 'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const focusables = (el) => [...el.querySelectorAll(FOCUSABLE)].filter((x) => !x.hasAttribute('aria-hidden') && x.offsetParent !== null);
  const openModal = (title, bodyHtml, footHtml, onClose) => {
    closeModal(true);
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const wrap = document.createElement('div');
    wrap.className = 'cd-overlay'; wrap.setAttribute('role', 'dialog'); wrap.setAttribute('aria-modal', 'true'); wrap.setAttribute('aria-labelledby', 'acModalTitle');
    wrap.innerHTML = '<div class="cd-modal"><div class="cd-modal__head"><h3 class="cd-modal__title" id="acModalTitle">' + esc(title) + '</h3>'
      + '<button type="button" class="cd-modal__x" aria-label="Cerrar" data-mclose>' + ico('Close', 24) + '</button></div>'
      + '<div class="cd-modal__body">' + bodyHtml + '</div><div class="cd-modal__foot">' + footHtml + '</div></div>';
    modalRoot.appendChild(wrap);
    const prevOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
    const keyHandler = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (e.key !== 'Tab') return;
      const f = focusables(wrap); if (!f.length) return;
      const first = f[0]; const last = f[f.length - 1]; const a = document.activeElement; const outside = !wrap.contains(a);
      if (e.shiftKey && (a === first || outside)) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && (a === last || outside)) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', keyHandler);
    wrap.addEventListener('mousedown', (e) => { wrap._downOnOverlay = e.target === wrap; });
    wrap.addEventListener('click', (e) => { if (e.target === wrap && wrap._downOnOverlay) onClose(); if (e.target.closest('[data-mclose]')) onClose(); });
    modal = { el: wrap, previous, keyHandler, prevOverflow };
    requestAnimationFrame(() => { const f = focusables(wrap); const firstInput = f.find((x) => x.tagName === 'INPUT'); (firstInput || f[0] || wrap).focus(); });
    return wrap;
  };
  const closeModal = (silent) => {
    if (!modal) return;
    document.removeEventListener('keydown', modal.keyHandler);
    modal.el.remove(); document.body.style.overflow = modal.prevOverflow;
    const prev = modal.previous; modal = null;
    if (silent) return;
    if (prev && document.contains(prev)) prev.focus(); else focusFirstIn(main);
  };

  /* GenerateAccessCodeModal */
  let formState = null; // {prefill, form, submitting}
  const openForm = (prefill) => {
    const values = prefill ? companyToFormValues(prefill) : { ...FORM_DEFAULTS };
    formState = { prefill, submitting: false };
    const body = '<form id="acGenForm" novalidate><div class="ac-stack"><div id="acDup"></div><div id="acGenMissing"></div><div class="ac-form-grid">'
      + FIELDS.map((f) => fieldHtml(f, 'access-code-' + f.name, values[f.name], '')).join('')
      + '</div></div><button type="submit" class="ac-sr" tabindex="-1" aria-hidden="true"></button></form>';
    const foot = '<div class="ac-modal-foot">' + btn('tertiary', FORM_T.cancel, 'data-gen="cancel"') + btn('primary', FORM_T.submit, 'data-gen="submit"') + '</div>';
    const el = openModal(FORM_T.title, body, foot, () => { if (!formState || !formState.submitting) closeForm(); });
    const form = el.querySelector('#acGenForm');
    formState.form = createForm(form, FIELDS, values, (name) => { if (!name || name === 'companyName' || name === 'rfc') paintDuplicate(); paintGenMissing(); });
    paintDuplicate();
    form.addEventListener('submit', (e) => { e.preventDefault(); submitGenForm(); });
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-gen]'); if (b) { if (b.dataset.gen === 'cancel') { if (!formState.submitting) closeForm(); } else submitGenForm(); }
      const d = e.target.closest('[data-dupdetail]'); if (d) { const r = S.records.find((i) => i.id === d.dataset.dupdetail); if (r) openDetail(r); }
    });
  };
  const closeForm = () => { if (!formState) return; formState = null; closeModal(); };
  const currentDuplicate = () => formState && findCompanyWithCode(S.records, { companyName: formState.form.values.companyName, rfc: formState.form.values.rfc }, formState.prefill ? formState.prefill.id : undefined);
  const paintDuplicate = () => {
    const box = document.getElementById('acDup'); if (!box || !formState) return;
    const dup = currentDuplicate();
    const key = dup ? dup.record.id : '';
    if (box.dataset.key === key) return;
    box.dataset.key = key;
    box.innerHTML = dup ? '<div id="access-code-duplicate-notice" role="status" aria-live="polite">' + alertBox('warning', DUP_T.title, DUP_T.textPrefix + dup.record.companyName + DUP_T.textSuffix,
      btn('tertiary', DUP_T.action, 'data-dupdetail="' + dup.record.id + '"')) + '</div>' : '';
  };
  const paintGenMissing = () => { const box = document.getElementById('acGenMissing'); if (box && formState) box.innerHTML = missingAlertHtml(formState.form.errors, formState.form.submitted); };
  const setGenLoading = (on) => setBtnLoading(modal && modal.el.querySelector('[data-gen="submit"]'), on);
  const submitGenForm = async () => {
    if (!formState || formState.submitting) return;
    if (currentDuplicate()) {
      const notice = document.getElementById('access-code-duplicate-notice');
      if (notice) { notice.scrollIntoView({ block: 'nearest' }); const b = notice.querySelector('button'); if (b) b.focus(); }
      return;
    }
    const bad = formState.form.validateAll();
    if (bad.length) { const i = document.getElementById('access-code-' + bad[0].name); if (i) i.focus(); return; }
    formState.submitting = true; setGenLoading(true);
    const fs = formState;
    const result = await service.generate(formValuesToCompany(fs.form.values), fs.prefill ? fs.prefill.id : undefined);
    if (formState !== fs) return;
    fs.submitting = false; setGenLoading(false);
    if (!result.ok) {
      toast('error', SERVICE_ERRORS[result.error.code]);
      if (result.error.field) fs.form.setServerError(result.error.field, SERVICE_ERRORS[result.error.code]);
      return;
    }
    upsertMany([result.data]);
    if (result.data.status === 'sent') showInHistory([result.data.id]);
    render(); closeForm();
    const fb = getGenerateToast(result.data); toast(fb.type, fb.message);
  };

  /* AccessCodesBatchModal */
  const openBatchModal = () => {
    const copy = getBatchCopy(S.batchScope, S.records);
    const body = '<div class="ac-batch">' + copy.lines.map((l) => '<p class="ac-batch__p">' + esc(l) + '</p>').join('')
      + (copy.skippedNotice ? alertBox('warning', BATCH_MODAL_T.skippedTitle, copy.skippedNotice) : '')
      + '<p class="ac-batch__label">' + esc(BATCH_MODAL_T.companiesLabel) + '</p>'
      + '<ul class="ac-batch__list" aria-label="' + esc(BATCH_MODAL_T.companiesLabel) + '">' + copy.companies.map((c) => '<li>' + esc(c.name) + '</li>').join('') + '</ul></div>';
    const foot = '<div class="ac-modal-foot">' + btn('tertiary', BATCH_MODAL_T.cancel, 'data-batch="cancel"') + btn('primary', copy.confirmLabel, 'data-batch="confirm"') + '</div>';
    const el = openModal(copy.title, body, foot, () => { if (!S.batchRunning) { S.batchScope = null; closeModal(); } });
    el.dataset.confirm = copy.confirmLabel;
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-batch]'); if (!b) return;
      if (b.dataset.batch === 'cancel') { if (!S.batchRunning) { S.batchScope = null; closeModal(); } } else confirmBatch();
    });
  };
  const paintBatchRunning = () => setBtnLoading(modal && modal.el.querySelector('[data-batch="confirm"]'), true);

  /* ======================= Tooltip (DS) ======================= */
  const tip = document.createElement('div');
  tip.className = 'cd-tip'; tip.setAttribute('role', 'tooltip'); tip.id = 'acTip'; tip.hidden = true;
  document.body.appendChild(tip);
  const showTip = (anchor) => {
    tip.innerHTML = esc(anchor.dataset.tip) + '<svg class="cd-tip__arrow" viewBox="0 0 16 8" width="16" height="8" fill="none" aria-hidden="true"><path d="M0 0 L16 0 L8 8 Z" fill="#0D166B"/></svg>';
    tip.hidden = false;
    const a = anchor.getBoundingClientRect(); const w = tip.offsetWidth; const h = tip.offsetHeight;
    let left = a.left + a.width / 2 - w / 2; left = Math.max(8, Math.min(left, innerWidth - w - 8));
    tip.style.left = left + 'px'; tip.style.top = (a.top - h - 8) + 'px';
    tip.querySelector('.cd-tip__arrow').style.left = (a.left + a.width / 2 - left) + 'px';
    tip.classList.add('is-on');
  };
  const hideTip = () => { tip.classList.remove('is-on'); tip.hidden = true; };
  document.addEventListener('mouseover', (e) => { const a = e.target.closest && e.target.closest('[data-tip]'); if (a) showTip(a); });
  document.addEventListener('mouseout', (e) => { const a = e.target.closest && e.target.closest('[data-tip]'); if (a && !a.contains(e.relatedTarget)) hideTip(); });
  addEventListener('scroll', hideTip, true);

  /* ======================= AppToast ======================= */
  const toastRoot = document.getElementById('acToasts');
  const TOAST_ICON = { success: 'EstadosSuccess', error: 'EstadosError', warning: 'WarningFilled', info: 'EstadosInfo' };
  function toast(type, message, duration = TOAST_DURATION) {
    /* ToastProvider: si ya hay uno igual, se quita antes de mostrar el nuevo */
    [...toastRoot.children].forEach((t) => { if (t.dataset.type === type && t.dataset.msg === message) t.remove(); });
    const el = document.createElement('div');
    el.className = 'cd-toast cd-toast--' + type; el.dataset.type = type; el.dataset.msg = message;
    el.setAttribute('role', type === 'error' ? 'alert' : 'status');
    el.innerHTML = '<div class="cd-toast__row"><span class="cd-toast__ico">' + ico(TOAST_ICON[type], 20) + '</span><p class="cd-toast__msg">' + esc(message) + '</p></div>'
      + '<button type="button" class="cd-toast__x" aria-label="Cerrar aviso">' + ico('Close', 24) + '</button>'
      + '<span class="cd-toast__timer" aria-hidden="true" style="animation-duration:' + duration + 'ms"></span>';
    el.querySelector('.cd-toast__x').addEventListener('click', () => el.remove());
    toastRoot.appendChild(el);
    setTimeout(() => el.remove(), duration);
  }

  /* ======================= Arranque ======================= */
  render();
  load();
})();
