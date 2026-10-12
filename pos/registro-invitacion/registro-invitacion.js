/* Registro por invitación — reconstrucción estática de la vista previa en React de Product Design
   (rama del equipo de AtaskateFrontend, 829cbd3dc: src/components/InviteSignUp/** y preview/registro-invitacion),
   sobre su maqueta HTML (3d3f1439e). Correo → código de acceso → crear cuenta → cuenta creada; quien ya tiene cuenta
   entra por el login, sin código.
   - Constantes y textos: inviteSignUp.constants.ts, inviteSignUpSteps.constants.ts.
   - Servicio simulado: inviteSignUp.utils.ts (latencia de 900 ms, mismos registros que Códigos de acceso).
   - Cada pantalla "se monta" de nuevo al entrar (como el componente de React): sus campos vuelven al estado inicial.
   - El panel "Revisión" (data-proto-panel, lo mueve ../demo.js al riel) reemplaza los chips de su vista previa. */
(() => {
  'use strict';

  /* ======================= Constantes ======================= */
  const LATENCY_MS = 900;            // INVITE_MOCK_LATENCY_MS
  const SUCCESS_PAUSE_MS = 600;      // INVITE_SUCCESS_PAUSE_MS
  const TOAST_MS = 3000;             // duración por omisión de showToast (ToastProvider)
  const CODE_LENGTH = 6;             // ACCESS_CODE_LENGTH
  const CODE_CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';   // ACCESS_CODE_CHARSET: sin I, O, 0 ni 1

  /* Mismos registros que el módulo Códigos de acceso (accessCodes.mocks.ts y ../codigos-acceso/) */
  const INVITES = [
    { code: 'P23E6R', status: 'sent', companyName: 'Empeños Cerrito', firstName: 'el equipo', lastName: 'Del Río', email: 'empenos@cerrito.com', branches: 4 },
    { code: 'H7XQ2M', status: 'used', companyName: 'Montepío Querétaro Centro', firstName: 'Laura', lastName: 'Méndez', email: 'lmendez@montepioqro.mx', branches: 7 },
  ];
  const LINK_CODE = 'P23E6R';
  const findInvite = (code) => INVITES.find((invite) => invite.code === code);
  const DEFAULT_INVITE = findInvite(LINK_CODE) || INVITES[0];

  /* Código que se precarga para simular cada escenario en el paso del código */
  const SCENARIO_CODES = { normal: '', link: 'P23E6R', invalid: 'Q9ZK4L', used: 'H7XQ2M', network: 'P23E6R' };

  /* Pantallas y escenarios de su vista previa; `url` es el valor de ?pantalla= y ?simular= */
  const SCREENS = [
    { id: 'email', label: 'Correo de invitación', url: 'correo' },
    { id: 'login', label: 'Iniciar sesión', url: 'iniciar-sesion' },
    { id: 'code', label: 'Código de acceso', url: 'codigo' },
    { id: 'account', label: 'Crea tu cuenta', url: 'cuenta' },
    { id: 'done', label: 'Cuenta creada', url: 'cuenta-creada' },
  ];
  const SCENARIOS = [
    { id: 'normal', label: 'Normal', url: 'normal' },
    { id: 'link', label: 'Llegó con el botón del correo', url: 'boton-del-correo' },
    { id: 'invalid', label: 'Código que no existe', url: 'no-existe' },
    { id: 'used', label: 'Código ya usado', url: 'ya-usado' },
    { id: 'network', label: 'Error de red', url: 'error-de-red' },
  ];

  const EMAIL_TEXTS = {
    greeting: (name) => `Bienvenido, ${name}`,
    intro: (company) => `Tu solicitud de demo fue aprobada. Usa este código de acceso para crear tu cuenta de ${company}.`,
    codeAriaLabel: (code) => `Código de acceso ${code}`,
  };
  const LOGIN_TEXTS = { loggedIn: 'Sesión iniciada. Aquí entra al Operativo.' };
  const CODE_TEXTS = {
    fromLink: 'Copiamos el código de tu correo. Valídalo para continuar.',
    incomplete: 'Escribe los 6 caracteres del código',
    invalidChars: 'El código no lleva I, O, 0 ni 1; revísalo',
    notFound: 'Este código no existe; revisa tu correo de invitación',
    usedHelper: 'Este código ya se usó',
    valid: 'Código válido',
    usedTitle: 'Este código ya se usó',
    usedText: 'Con él ya se creó una cuenta. Inicia sesión con tu correo y tu contraseña.',
    networkTitle: 'No pudimos validar el código',
    networkText: 'Revisa tu conexión e inténtalo de nuevo.',
    retry: 'Reintentar',
    login: 'Iniciar sesión',
  };
  const ACCOUNT_TEXTS = {
    invitation: (company, branches) => `Invitación para ${company} · ${branches} ${branches === 1 ? 'sucursal' : 'sucursales'}.`,
    reviewTitle: 'Revisa los campos marcados',
    missing: (count) => (count === 1 ? 'Falta 1 dato para crear tu cuenta.' : `Faltan ${count} datos para crear tu cuenta.`),
    usedTitle: 'Este código ya se usó',
    usedText: 'Se creó una cuenta con él mientras llenabas el formulario. Inicia sesión con tu correo y tu contraseña.',
    networkTitle: 'No pudimos crear tu cuenta',
    networkText: 'Revisa tu conexión e inténtalo de nuevo. Tus datos siguen aquí.',
    retry: 'Reintentar',
    login: 'Iniciar sesión',
  };
  const NAME_ERRORS = {
    namesRequired: 'Escribe tu nombre',
    lastNameRequired: 'Escribe tus apellidos',
    onlyLetters: 'Usa solo letras y espacios',
    length: 'Usa entre 2 y 100 caracteres',
  };
  const NAMES_REGEX = /^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]+$/;
  const NAME_MIN = 2;
  const NAME_MAX = 100;
  const PASSWORD_RULES = {
    length: (v) => v.length >= 8 && v.length <= 16,
    upper: (v) => /[A-Z]/.test(v),
    lower: (v) => /[a-z]/.test(v),
    number: (v) => /[0-9]/.test(v),
    special: (v) => /[!@#$%^&*]/.test(v),
  };
  const DONE_TEXTS = { text: (company) => `Ya puedes explorar la demo de Ataskate para ${company}.` };
  const MIN_MOCK_PASSWORD_LENGTH = 8;   // InviteLogin: con menos, el login simulado falla

  /* Avisos (showToast) de los destinos que quedan fuera del flujo */
  const TOASTS = {
    demo: ['info', 'Aquí se abre el formulario "Ver un demo" de la landing.'],
    legal: ['info', 'Aquí se abre el Modal con el texto legal vigente.'],
    enter: ['info', 'Aquí entra a la demo con la sesión ya iniciada.'],
    forgot: ['info', 'Aquí empieza la recuperación de contraseña, fuera de este flujo.'],   // del prototipo: en su código el enlace no hace nada
  };

  /* Notas del panel de revisión de su maqueta (decisiones y gaps de cada pantalla) */
  const NOTES = {
    email: [
      'Plantilla de correo de Figma (Suscripción · frame "email" 4173:6192): logo, ilustración, saludo, código en bloque navy, aviso, redes y pie legal. Assets descargados del frame.',
      'Se agregó el botón "Crear mi cuenta" (Button primary): la plantilla original no tiene botón porque es un código de verificación. Lleva al registro con el código ya escrito (propuesta: enlace con ?codigo=).',
      'El código se muestra como en la plantilla, carácter por carácter (P 2 3 E 6 R), y coincide con las 6 celdas del CodeField.',
      'Lo envía Marketing a mano desde Códigos de acceso; llenar el formulario no lo manda.',
      'Copy: la plantilla dice "Bienvenido" (masculino). Sugerencia: "Te damos la bienvenida, …". Además la plantilla de verificación tiene un error de dedo: "código se seguridad".',
      '[Pendiente Producto] ¿El código vence? La plantilla de verificación dice "Vigencia de 30 minutos"; para la invitación no está definido.',
    ],
    login: [
      'El login no pide código: quien ya tiene cuenta entra con su correo y su contraseña.',
      '"Crear cuenta" ahora dice "¿Tienes un código de acceso?" para que se entienda que el registro no es abierto.',
      'Nueva salida "Solicita un demo" para quien llega sin invitación.',
      'Bug del DS (TextInput password): el ojo tiene tabIndex -1 y no tiene aria-label, así que no se alcanza con teclado ni lo anuncia un lector. Se replica tal cual y se reporta.',
    ],
    code: [
      'CodeField del DS con length=6, como se indicó.',
      'CodeField con charset="alphanumeric" (nuevo en el DS): acepta letras y números y los pasa a mayúsculas.',
      'CodeField responsive (nuevo en el DS): las celdas se encogen si no caben y en ≤520px la separación baja a 8 px.',
      'CodeField accesible (nuevo en el DS): el grupo se llama "Código de acceso" y cada celda "Carácter N de 6".',
      'Errores en el helper del CodeField: incompleto, caracteres que no existen, código que no existe. Código ya usado y error de red van en Alert con acción.',
      'Steps del DS (layout inline) con 2 pasos.',
    ],
    account: [
      'Alert success confirma la invitación: empresa y sucursales vienen de la solicitud que aprobó Marketing.',
      'Correo prellenado en solo lectura. Como el código llegó a ese correo, ya no hace falta "Verifica tu correo".',
      'Gap del DS: TextInput readOnly usa el estilo de deshabilitado (texto #A1A5AA), que no pasa contraste. Se reporta y no se corrige en pantalla.',
      'Requisitos de contraseña: filas de helperText (_criterios de Figma). El ícono de éxito (SuccessFilledIcon) hay que validarlo contra la variante "Éxito" de Figma.',
      '[Pendiente Backend] La solicitud guarda el contacto en un solo texto; hay que separar nombres y apellidos para prellenarlos.',
      'Sin aceptar términos no se crea la cuenta: el Checkbox se marca en error. Los textos legales se abren con "Leer Términos y condiciones" y "Leer Declaración de privacidad" (Button tertiary).',
    ],
    done: [
      'Confirmación sobria y un solo siguiente paso: entrar a la demo.',
      'Se quitó el círculo verde con palomita de la versión anterior: no existe en el DS.',
      'Al crear la cuenta, el código pasa a "Usado" en Códigos de acceso.',
    ],
  };

  /* ======================= Íconos del DS (SVG de Icons/Icons.tsx, en currentColor) ======================= */
  const ICONS = {
    EstadosErrorIcon: '<svg width="{s}" height="{s}" viewBox="48 156 24 24" fill="none"><path d="M60 178C58.6167 178 57.3167 177.737 56.1 177.212C54.8833 176.687 53.825 175.975 52.925 175.075C52.025 174.175 51.3127 173.117 50.788 171.9C50.2627 170.683 50 169.383 50 168C50 166.617 50.2627 165.317 50.788 164.1C51.3127 162.883 52.025 161.825 52.925 160.925C53.825 160.025 54.8833 159.312 56.1 158.787C57.3167 158.262 58.6167 158 60 158C61.3833 158 62.6833 158.262 63.9 158.787C65.1167 159.312 66.175 160.025 67.075 160.925C67.975 161.825 68.6873 162.883 69.212 164.1C69.7373 165.317 70 166.617 70 168C70 169.383 69.7373 170.683 69.212 171.9C68.6873 173.117 67.975 174.175 67.075 175.075C66.175 175.975 65.1167 176.687 63.9 177.212C62.6833 177.737 61.3833 178 60 178ZM56.4 173L60 169.4L63.6 173L65 171.6L61.4 168L65 164.4L63.6 163L60 166.6L56.4 163L55 164.4L58.6 168L55 171.6L56.4 173Z" fill="currentColor"/></svg>',
    EstadosSuccessIcon: '<svg width="{s}" height="{s}" viewBox="96 156 24 24" fill="none"><path d="M108 178C106.617 178 105.317 177.737 104.1 177.212C102.883 176.687 101.825 175.975 100.925 175.075C100.025 174.175 99.3127 173.117 98.788 171.9C98.2627 170.683 98 169.383 98 168C98 166.617 98.2627 165.317 98.788 164.1C99.3127 162.883 100.025 161.825 100.925 160.925C101.825 160.025 102.883 159.312 104.1 158.787C105.317 158.262 106.617 158 108 158C109.383 158 110.683 158.262 111.9 158.787C113.117 159.312 114.175 160.025 115.075 160.925C115.975 161.825 116.687 162.883 117.212 164.1C117.737 165.317 118 166.617 118 168C118 169.383 117.737 170.683 117.212 171.9C116.687 173.117 115.975 174.175 115.075 175.075C114.175 175.975 113.117 176.687 111.9 177.212C110.683 177.737 109.383 178 108 178ZM106.6 172.6L113.65 165.55L112.25 164.15L106.6 169.8L103.75 166.95L102.35 168.35L106.6 172.6Z" fill="currentColor"/></svg>',
    EstadosInfoIcon: '<svg width="{s}" height="{s}" viewBox="144 156 24 24" fill="none"><path d="M154.774 172.838H156.774V166.838H154.774V172.838ZM155.774 164.838C156.058 164.838 156.295 164.742 156.487 164.55C156.679 164.359 156.774 164.121 156.774 163.838C156.774 163.555 156.679 163.317 156.487 163.125C156.295 162.934 156.058 162.838 155.774 162.838C155.491 162.838 155.254 162.934 155.062 163.125C154.87 163.317 154.774 163.555 154.774 163.838C154.774 164.121 154.87 164.359 155.062 164.55C155.254 164.742 155.491 164.838 155.774 164.838ZM155.774 177.838C154.391 177.838 153.091 177.575 151.874 177.05C150.658 176.525 149.599 175.813 148.699 174.913C147.799 174.013 147.087 172.955 146.562 171.738C146.037 170.521 145.774 169.221 145.774 167.838C145.774 166.455 146.037 165.155 146.562 163.938C147.087 162.721 147.799 161.663 148.699 160.763C149.599 159.863 150.658 159.15 151.874 158.625C153.091 158.1 154.391 157.838 155.774 157.838C157.158 157.838 158.458 158.1 159.674 158.625C160.891 159.15 161.949 159.863 162.849 160.763C163.749 161.663 164.462 162.721 164.987 163.938C165.512 165.155 165.774 166.455 165.774 167.838C165.774 169.221 165.512 170.521 164.987 171.738C164.462 172.955 163.749 174.013 162.849 174.913C161.949 175.813 160.891 176.525 159.674 177.05C158.458 177.575 157.158 177.838 155.774 177.838Z" fill="currentColor"/></svg>',
    CheckIcon: '<svg width="{s}" height="{s}" viewBox="0 0 24 24" fill="none"><path d="M9.54998 18.0001L3.84998 12.3001L5.27498 10.8751L9.54998 15.1501L18.725 5.9751L20.15 7.4001L9.54998 18.0001Z" fill="currentColor"/></svg>',
    CloseIcon: '<svg width="{s}" height="{s}" viewBox="0 0 24 24" fill="none"><path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z" fill="currentColor"/></svg>',
    ArrowForwardIcon: '<svg width="{s}" height="{s}" viewBox="0 0 24 24" fill="none"><path d="M12 20L10.575 18.6L16.175 13H4V11H16.175L10.575 5.4L12 4L20 12L12 20Z" fill="currentColor"/></svg>',
    ArrowBackIcon: '<svg width="{s}" height="{s}" viewBox="0 0 24 24" fill="none"><path d="M12 20L4 12L12 4L13.425 5.4L7.825 11H20V13H7.825L13.425 18.6L12 20Z" fill="currentColor"/></svg>',
    ViewOnIcon: '<svg width="{s}" height="{s}" viewBox="0 0 24 24" fill="none"><path d="M12 16C13.25 16 14.3127 15.5627 15.188 14.688C16.0627 13.8127 16.5 12.75 16.5 11.5C16.5 10.25 16.0627 9.18733 15.188 8.312C14.3127 7.43733 13.25 7 12 7C10.75 7 9.68733 7.43733 8.812 8.312C7.93733 9.18733 7.5 10.25 7.5 11.5C7.5 12.75 7.93733 13.8127 8.812 14.688C9.68733 15.5627 10.75 16 12 16ZM12 14.2C11.25 14.2 10.6127 13.9373 10.088 13.412C9.56267 12.8873 9.3 12.25 9.3 11.5C9.3 10.75 9.56267 10.1123 10.088 9.587C10.6127 9.06233 11.25 8.8 12 8.8C12.75 8.8 13.3877 9.06233 13.913 9.587C14.4377 10.1123 14.7 10.75 14.7 11.5C14.7 12.25 14.4377 12.8873 13.913 13.412C13.3877 13.9373 12.75 14.2 12 14.2ZM12 19C9.68333 19 7.56667 18.3877 5.65 17.163C3.73333 15.9377 2.28333 14.2833 1.3 12.2C1.25 12.1167 1.21667 12.0123 1.2 11.887C1.18333 11.7623 1.175 11.6333 1.175 11.5C1.175 11.3667 1.18333 11.2373 1.2 11.112C1.21667 10.9873 1.25 10.8833 1.3 10.8C2.28333 8.71667 3.73333 7.06267 5.65 5.838C7.56667 4.61267 9.68333 4 12 4C14.3167 4 16.4333 4.61267 18.35 5.838C20.2667 7.06267 21.7167 8.71667 22.7 10.8C22.75 10.8833 22.7833 10.9873 22.8 11.112C22.8167 11.2373 22.825 11.3667 22.825 11.5C22.825 11.6333 22.8167 11.7623 22.8 11.887C22.7833 12.0123 22.75 12.1167 22.7 12.2C21.7167 14.2833 20.2667 15.9377 18.35 17.163C16.4333 18.3877 14.3167 19 12 19ZM12 17C13.8833 17 15.6127 16.504 17.188 15.512C18.7627 14.5207 19.9667 13.1833 20.8 11.5C19.9667 9.81667 18.7627 8.479 17.188 7.487C15.6127 6.49567 13.8833 6 12 6C10.1167 6 8.38733 6.49567 6.812 7.487C5.23733 8.479 4.03333 9.81667 3.2 11.5C4.03333 13.1833 5.23733 14.5207 6.812 15.512C8.38733 16.504 10.1167 17 12 17Z" fill="currentColor"/></svg>',
    ViewOffIcon: '<svg width="{s}" height="{s}" viewBox="0 0 24 24" fill="none"><path d="M16.1 13.2998L14.65 11.8498C14.8 11.0665 14.575 10.3331 13.975 9.6498C13.375 8.96647 12.6 8.6998 11.65 8.8498L10.2 7.39981C10.4833 7.26647 10.7707 7.16647 11.062 7.0998C11.354 7.03314 11.6667 6.9998 12 6.9998C13.25 6.9998 14.3127 7.43714 15.188 8.3118C16.0627 9.18714 16.5 10.2498 16.5 11.4998C16.5 11.8331 16.4667 12.1458 16.4 12.4378C16.3333 12.7291 16.2333 13.0165 16.1 13.2998ZM19.3 16.4498L17.85 15.0498C18.4833 14.5665 19.046 14.0371 19.538 13.4618C20.0293 12.8871 20.45 12.2331 20.8 11.4998C19.9667 9.81647 18.7707 8.47881 17.212 7.4868C15.654 6.49547 13.9167 5.9998 12 5.9998C11.5167 5.9998 11.0417 6.03314 10.575 6.0998C10.1083 6.16647 9.65 6.26647 9.2 6.3998L7.65 4.8498C8.33333 4.56647 9.03333 4.3538 9.75 4.2118C10.4667 4.07047 11.2167 3.9998 12 3.9998C14.5167 3.9998 16.7583 4.69547 18.725 6.0868C20.6917 7.4788 22.1167 9.28314 23 11.4998C22.6167 12.4831 22.1127 13.3958 21.488 14.2378C20.8627 15.0791 20.1333 15.8165 19.3 16.4498ZM19.8 22.5998L15.6 18.4498C15.0167 18.6331 14.4293 18.7708 13.838 18.8628C13.246 18.9541 12.6333 18.9998 12 18.9998C9.48333 18.9998 7.24167 18.3041 5.275 16.9128C3.30833 15.5208 1.88333 13.7165 1 11.4998C1.35 10.6165 1.79167 9.79547 2.325 9.0368C2.85833 8.2788 3.46667 7.5998 4.15 6.9998L1.4 4.1998L2.8 2.7998L21.2 21.1998L19.8 22.5998ZM5.55 8.3998C5.06667 8.83314 4.625 9.30814 4.225 9.8248C3.825 10.3415 3.48333 10.8998 3.2 11.4998C4.03333 13.1831 5.229 14.5205 6.787 15.5118C8.34567 16.5038 10.0833 16.9998 12 16.9998C12.3333 16.9998 12.6583 16.9791 12.975 16.9378C13.2917 16.8958 13.6167 16.8498 13.95 16.7998L13.05 15.8498C12.8667 15.8998 12.6917 15.9371 12.525 15.9618C12.3583 15.9871 12.1833 15.9998 12 15.9998C10.75 15.9998 9.68733 15.5625 8.812 14.6878C7.93733 13.8125 7.5 12.7498 7.5 11.4998C7.5 11.3165 7.51233 11.1415 7.537 10.9748C7.56233 10.8081 7.6 10.6331 7.65 10.4498L5.55 8.3998Z" fill="currentColor"/></svg>',
    SuccessFilledIcon: '<svg width="{s}" height="{s}" viewBox="0 0 20 20" fill="none"><path d="M10 20C8.61667 20 7.31667 19.7373 6.1 19.212C4.88333 18.6873 3.825 17.975 2.925 17.075C2.025 16.175 1.31267 15.1167 0.788 13.9C0.262667 12.6833 0 11.3833 0 10C0 8.61667 0.262667 7.31667 0.788 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.31233 6.1 0.787C7.31667 0.262333 8.61667 0 10 0C11.3833 0 12.6833 0.262333 13.9 0.787C15.1167 1.31233 16.175 2.025 17.075 2.925C17.975 3.825 18.6873 4.88333 19.212 6.1C19.7373 7.31667 20 8.61667 20 10C20 11.3833 19.7373 12.6833 19.212 13.9C18.6873 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6873 13.9 19.212C12.6833 19.7373 11.3833 20 10 20ZM8.6 14.6L15.65 7.55L14.25 6.15L8.6 11.8L5.75 8.95L4.35 10.35L8.6 14.6Z" fill="currentColor"/></svg>',
  };
  const icon = (name, size) => (ICONS[name] || '').replace(/\{s\}/g, String(size)).replace('<svg ', '<svg aria-hidden="true" focusable="false" ');
  const hydrateIcons = (root) => root.querySelectorAll('[data-icon]').forEach((el) => {
    const size = el.dataset.size || 24;
    el.innerHTML = icon(el.dataset.icon, size);
    el.style.width = el.style.height = `${size}px`;
  });

  /* ======================= Utilidades ======================= */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* Button con loading: Spinner small y el mismo texto; el ícono se oculta y el botón queda deshabilitado */
  const setLoading = (btn, on) => {
    const spinner = $('.ri-spinner', btn);
    btn.disabled = on;
    if (on) btn.setAttribute('aria-busy', 'true'); else btn.removeAttribute('aria-busy');
    if (on && !spinner) btn.insertAdjacentHTML('afterbegin', '<span class="ri-spinner" role="status" aria-label="Cargando"></span>');
    if (!on && spinner) spinner.remove();
  };

  /* ======================= Servicio simulado (inviteSignUp.utils.ts) ======================= */
  const getCodeFormatError = (code) => {
    if (code.length < CODE_LENGTH) return CODE_TEXTS.incomplete;
    return code.split('').some((char) => !CODE_CHARSET.includes(char)) ? CODE_TEXTS.invalidChars : '';
  };
  /* Simula Suscriptionbtb: valida el código según el escenario */
  const validateInviteCode = async (code, scenario) => {
    await wait(LATENCY_MS);
    if (scenario === 'network') return { ok: false, reason: 'network' };
    const invite = findInvite(code);
    if (!invite) return { ok: false, reason: 'notFound' };
    if (invite.status === 'used') return { ok: false, reason: 'used' };
    return { ok: true, invite };
  };
  /* En el escenario "used" el código se usó mientras se llenaba el formulario */
  const createInviteAccount = async (scenario) => {
    await wait(LATENCY_MS);
    if (scenario === 'network') return { ok: false, reason: 'network' };
    if (scenario === 'used') return { ok: false, reason: 'used' };
    return { ok: true };
  };
  const getNameError = (value, requiredMessage) => {
    const clean = value.trim();
    if (!clean) return requiredMessage;
    if (!NAMES_REGEX.test(clean)) return NAME_ERRORS.onlyLetters;
    if (clean.length < NAME_MIN || clean.length > NAME_MAX) return NAME_ERRORS.length;
    return '';
  };
  const isPasswordValid = (value) => Object.values(PASSWORD_RULES).every((test) => test(value));
  const formatCodeForEmail = (code) => code.split('').join(' ');

  /* ======================= Estado ======================= */
  const state = {
    screen: 'email',
    scenario: 'normal',
    invite: DEFAULT_INVITE,
    visit: 0,          // sube cada vez que se entra a una pantalla: una respuesta vieja del servicio ya no la toca
  };

  /* ======================= AppToast ======================= */
  const toastRoot = $('#riToasts');
  function toast(type, message) {
    /* ToastProvider: si ya hay uno igual, se quita antes de mostrar el nuevo */
    [...toastRoot.children].forEach((t) => { if (t.dataset.type === type && t.dataset.msg === message) t.remove(); });
    const el = document.createElement('div');
    el.className = `ri-toast ri-toast--${type}`;
    el.dataset.type = type;
    el.dataset.msg = message;
    el.setAttribute('role', 'status');
    el.innerHTML = `<div class="ri-toast__row"><span class="ri-ico ri-toast__ico">${icon(type === 'success' ? 'EstadosSuccessIcon' : 'EstadosInfoIcon', 20)}</span><p class="ri-toast__msg">${esc(message)}</p></div>`
      + `<button type="button" class="ri-toast__x" aria-label="Cerrar aviso">${icon('CloseIcon', 24)}</button>`
      + `<span class="ri-toast__timer" aria-hidden="true" style="animation-duration:${TOAST_MS}ms"></span>`;
    $('.ri-toast__x', el).addEventListener('click', () => el.remove());
    toastRoot.appendChild(el);
    setTimeout(() => el.remove(), TOAST_MS);
  }

  /* ======================= Navegación entre pantallas ======================= */
  const screenByUrl = (v) => (SCREENS.find((s) => s.url === v) || SCREENS[0]).id;
  const scenarioByUrl = (v) => (SCENARIOS.find((s) => s.url === v) || SCENARIOS[0]).id;
  const urlFor = () => {
    const u = new URL(location.href);
    u.search = '';
    if (state.screen !== 'email') u.searchParams.set('pantalla', SCREENS.find((s) => s.id === state.screen).url);
    if (state.scenario !== 'normal') u.searchParams.set('simular', SCENARIOS.find((s) => s.id === state.scenario).url);
    return u.pathname + u.search;
  };
  /* La pantalla queda en la URL (?pantalla=) para que "atrás" del navegador regrese a la anterior */
  const syncUrl = (mode) => {
    const data = { screen: state.screen, scenario: state.scenario };
    try {
      if (mode === 'push' && urlFor() !== location.pathname + location.search) history.pushState(data, '', urlFor());
      else if (mode !== 'none') history.replaceState(data, '', urlFor());
    } catch (e) { /* sin History API (vista de archivo local): la pantalla cambia igual */ }
  };

  const ENTER = {};
  /* Entra a una pantalla: se "monta" de nuevo, como el componente de React */
  function go(screen, opts = {}) {
    const { mode = 'push', resetInvite = false } = opts;
    if (resetInvite) state.invite = DEFAULT_INVITE;
    state.screen = screen;
    state.visit += 1;
    $$('.ri-screen').forEach((s) => { s.hidden = s.dataset.screen !== screen; });
    ENTER[screen]();
    paintReview();
    syncUrl(mode);
    window.scrollTo(0, 0);
  }
  /* InviteSignUp.goToCode: si venía del botón del correo, el escenario vuelve a normal */
  function goToCode() {
    if (state.scenario === 'link') state.scenario = 'normal';
    go('code');
  }
  /* Cambio de escenario: desde el panel o al recuperarse de un error ("Reintentar") */
  function setScenario(scenario, opts = {}) {
    state.scenario = scenario;
    paintReview();
    if (opts.retry) { syncUrl('replace'); return; }
    if (state.screen === 'email' || state.screen === 'login' || state.screen === 'done') { go('code'); return; }
    if (state.screen === 'code') resetCodeForScenario();
    syncUrl('replace');
  }

  /* ======================= 1 · Correo de invitación ======================= */
  ENTER.email = () => {
    const invite = DEFAULT_INVITE;
    $('#riMailTo').textContent = invite.email;
    $('#riMailHello').textContent = EMAIL_TEXTS.greeting(`${invite.firstName} ${invite.lastName}`);
    $('#riMailIntro').textContent = EMAIL_TEXTS.intro(invite.companyName);
    $('#riMailCode').textContent = formatCodeForEmail(invite.code);
    $('#riMailCode').setAttribute('aria-label', EMAIL_TEXTS.codeAriaLabel(invite.code));
  };
  $('#riMailCta').addEventListener('click', () => {
    state.scenario = 'link';
    go('code');
  });

  /* ======================= Contraseña con ojo (TextInput type="password") ======================= */
  const resetEye = (inputId) => {
    const input = $(`#${inputId}`);
    input.type = 'password';
    const ico = $(`[data-eye="${inputId}"] [data-icon]`);
    ico.dataset.icon = 'ViewOffIcon';
    hydrateIcons(ico.parentElement);
  };
  $$('[data-eye]').forEach((btn) => btn.addEventListener('click', () => {
    const input = $(`#${btn.dataset.eye}`);
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    $('[data-icon]', btn).dataset.icon = show ? 'ViewOnIcon' : 'ViewOffIcon';
    hydrateIcons(btn);
  }));

  /* ======================= 2 · Iniciar sesión ======================= */
  const login = { user: $('#riLoginUser'), pass: $('#riLoginPass'), alert: $('#riLoginAlert'), btn: $('#riLoginBtn') };
  ENTER.login = () => {
    login.user.value = '';
    login.pass.value = '';
    login.alert.hidden = true;
    setLoading(login.btn, false);
    resetEye('riLoginPass');
  };
  $('#riLoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const visit = state.visit;
    login.alert.hidden = true;
    setLoading(login.btn, true);
    await wait(LATENCY_MS);
    if (visit !== state.visit) return;
    setLoading(login.btn, false);
    if (!login.user.value.trim() || login.pass.value.length < MIN_MOCK_PASSWORD_LENGTH) { login.alert.hidden = false; return; }
    toast('success', LOGIN_TEXTS.loggedIn);
  });

  /* ======================= 3 · Código de acceso (CodeField alfanumérico) ======================= */
  const cf = { root: $('#riCodeField'), cells: $$('#riCodeField .ri-codefield__cell'), btn: $('#riCodeBtn'), alert: $('#riCodeAlert') };
  const code = { value: '', feedback: { state: 'default', text: '' } };
  const EMPTY_FEEDBACK = { state: 'default', text: '' };

  /* CodeField controlado: las celdas se pintan desde el valor (digits = value[i] ?? '') */
  const paintCells = () => cf.cells.forEach((cell, i) => {
    cell.value = code.value[i] || '';
    cell.setAttribute('aria-invalid', code.feedback.state === 'error' ? 'true' : 'false');
  });
  const paintFeedback = () => {
    const { state: st, text } = code.feedback;
    cf.root.classList.toggle('is-error', st === 'error');
    cf.root.classList.toggle('is-success', st === 'success');
    $('#riCodeHelperIco').innerHTML = st === 'error' ? icon('CloseIcon', 16) : st === 'success' ? icon('CheckIcon', 16) : '';
    $('#riCodeHelperText').textContent = text;
    $('#riCodeHelper').hidden = !text;
    paintCells();
  };
  const setFeedback = (st, text) => { code.feedback = { state: st, text }; paintFeedback(); };
  /* onChange del InviteCodeStep: un estado de error o éxito se limpia al escribir */
  const emitChange = (digits) => {
    code.value = digits.join('');
    if (code.feedback.state !== 'default') code.feedback = EMPTY_FEEDBACK;
    paintFeedback();
  };
  const digits = () => Array.from({ length: CODE_LENGTH }, (_, i) => code.value[i] || '');
  const sanitize = (raw) => raw.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

  cf.cells.forEach((cell, idx) => {
    cell.addEventListener('input', () => {
      const raw = sanitize(cell.value);
      if (!raw) { paintCells(); return; }       // lo que no se acepta no entra
      const next = digits();
      next[idx] = raw[raw.length - 1];
      emitChange(next);
      if (idx < CODE_LENGTH - 1) cf.cells[idx + 1].focus();
    });
    cell.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace') {
        e.preventDefault();
        const next = digits();
        if (next[idx]) { next[idx] = ''; emitChange(next); }
        else if (idx > 0) { next[idx - 1] = ''; emitChange(next); cf.cells[idx - 1].focus(); }
      } else if (e.key === 'ArrowLeft' && idx > 0) cf.cells[idx - 1].focus();
      else if (e.key === 'ArrowRight' && idx < CODE_LENGTH - 1) cf.cells[idx + 1].focus();
    });
    cell.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasted = sanitize((e.clipboardData || window.clipboardData).getData('text') || '').slice(0, CODE_LENGTH - idx);
      if (!pasted) return;
      const next = digits();
      for (let i = 0; i < pasted.length; i++) next[idx + i] = pasted[i];
      emitChange(next);
      cf.cells[Math.min(idx + pasted.length, CODE_LENGTH - 1)].focus();
    });
    cell.addEventListener('click', () => cell.select());
  });

  const showCodeAlert = (type) => {
    $('#riCodeAlertTitle').textContent = type === 'used' ? CODE_TEXTS.usedTitle : CODE_TEXTS.networkTitle;
    $('#riCodeAlertText').textContent = type === 'used' ? CODE_TEXTS.usedText : CODE_TEXTS.networkText;
    const act = $('#riCodeAlertAct');
    act.textContent = type === 'network' ? CODE_TEXTS.retry : CODE_TEXTS.login;
    act.dataset.action = type === 'network' ? 'retry' : 'login';
    cf.alert.hidden = false;
  };
  $('#riCodeAlertAct').addEventListener('click', (e) => {
    if (e.currentTarget.dataset.action === 'login') { go('login'); return; }
    /* handleRetry: el escenario vuelve a normal y se valida otra vez el mismo código */
    setScenario('normal', { retry: true });
    submitCode();
  });

  /* Estado inicial del paso según el escenario (useEffect de InviteCodeStep) */
  function resetCodeForScenario() {
    state.visit += 1;
    setLoading(cf.btn, false);
    code.value = SCENARIO_CODES[state.scenario];
    cf.alert.hidden = true;
    code.feedback = state.scenario === 'link' ? { state: 'default', text: CODE_TEXTS.fromLink } : EMPTY_FEEDBACK;
    paintFeedback();
  }
  ENTER.code = () => {
    resetCodeForScenario();
    setTimeout(() => cf.cells[0].focus({ preventScroll: true }), 0);   // autoFocus del CodeField
  };

  async function submitCode(e) {
    if (e) e.preventDefault();
    const visit = state.visit;
    cf.alert.hidden = true;
    const formatError = getCodeFormatError(code.value);
    if (formatError) { setFeedback('error', formatError); return; }
    setFeedback('default', '');
    setLoading(cf.btn, true);
    const result = await validateInviteCode(code.value, state.scenario);
    if (visit !== state.visit) return;
    setLoading(cf.btn, false);
    if (result.ok) {
      setFeedback('success', CODE_TEXTS.valid);
      await wait(SUCCESS_PAUSE_MS);
      if (visit !== state.visit) return;
      state.invite = result.invite;
      go('account');
      return;
    }
    if (result.reason === 'notFound') { setFeedback('error', CODE_TEXTS.notFound); return; }
    if (result.reason === 'used') setFeedback('error', CODE_TEXTS.usedHelper);
    showCodeAlert(result.reason);
  }
  $('#riCodeForm').addEventListener('submit', submitCode);

  /* ======================= 4 · Crea tu cuenta (useInviteAccountForm) ======================= */
  const acc = {
    names: $('#riNames'), lastName: $('#riLastName'), email: $('#riEmail'), password: $('#riPassword'), terms: $('#riTerms'),
    btn: $('#riAccBtn'), alertEl: $('#riAccAlert'),
    submitted: false, touched: new Set(), alert: null,
  };
  const accErrors = () => {
    const names = getNameError(acc.names.value, NAME_ERRORS.namesRequired);
    const lastName = getNameError(acc.lastName.value, NAME_ERRORS.lastNameRequired);
    const passwordOk = isPasswordValid(acc.password.value);
    const missing = [names, lastName].filter(Boolean).length + (passwordOk ? 0 : 1) + (acc.terms.checked ? 0 : 1);
    return { names, lastName, passwordOk, missing };
  };
  const fieldError = (input, out, msg) => {
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    out.hidden = !msg;
    out.innerHTML = msg ? `<span class="ri-ico">${icon('CloseIcon', 16)}</span>${esc(msg)}` : '';
  };
  /* Se vuelve a pintar con cada cambio, como el render de React */
  function paintAccount() {
    const err = accErrors();
    fieldError(acc.names, $('#riNamesMsg'), acc.submitted || acc.touched.has('names') ? err.names : '');
    fieldError(acc.lastName, $('#riLastNameMsg'), acc.submitted || acc.touched.has('lastName') ? err.lastName : '');
    acc.password.setAttribute('aria-invalid', acc.submitted && !err.passwordOk ? 'true' : 'false');
    /* PasswordCriteria: aparecen ✓ / ✕ en cuanto se escribe o después de enviar */
    const value = acc.password.value;
    const show = acc.submitted || value.length > 0;
    $$('#riCriteria li').forEach((li) => {
      const ok = PASSWORD_RULES[li.dataset.rule](value);
      li.classList.toggle('is-ok', show && ok);
      li.classList.toggle('is-error', show && !ok);
      $('.ri-ico', li).innerHTML = !show ? '' : ok ? icon('SuccessFilledIcon', 16) : icon('CloseIcon', 16);
    });
    const termsError = acc.submitted && !acc.terms.checked;
    $('#riTermsWrap').classList.toggle('is-error', termsError);
    acc.terms.setAttribute('aria-invalid', termsError ? 'true' : 'false');
    $('#riTermsMsg').hidden = !termsError;
    /* Alert de error: "missing" cuenta en vivo los datos que faltan; "used" y "network" llevan acción */
    acc.alertEl.hidden = !acc.alert;
    if (acc.alert) {
      const titles = { missing: ACCOUNT_TEXTS.reviewTitle, used: ACCOUNT_TEXTS.usedTitle, network: ACCOUNT_TEXTS.networkTitle };
      const texts = { missing: ACCOUNT_TEXTS.missing(err.missing), used: ACCOUNT_TEXTS.usedText, network: ACCOUNT_TEXTS.networkText };
      $('#riAccAlertTitle').textContent = titles[acc.alert];
      $('#riAccAlertText').textContent = texts[acc.alert];
      $('#riAccAlertAction').hidden = acc.alert === 'missing';
      const act = $('#riAccAlertAct');
      act.textContent = acc.alert === 'network' ? ACCOUNT_TEXTS.retry : ACCOUNT_TEXTS.login;
      act.dataset.action = acc.alert === 'network' ? 'retry' : 'login';
    }
  }
  ENTER.account = () => {
    const invite = state.invite;
    $('#riInviteText').textContent = ACCOUNT_TEXTS.invitation(invite.companyName, invite.branches);
    acc.names.value = invite.firstName;
    acc.lastName.value = invite.lastName;
    acc.email.value = invite.email;
    acc.password.value = '';
    acc.terms.checked = false;
    acc.submitted = false;
    acc.touched.clear();
    acc.alert = null;
    setLoading(acc.btn, false);
    resetEye('riPassword');
    paintAccount();
  };
  async function submitAccount(e) {
    if (e) e.preventDefault();
    const visit = state.visit;
    acc.submitted = true;
    acc.alert = null;
    if (accErrors().missing > 0) { acc.alert = 'missing'; paintAccount(); return; }
    paintAccount();
    setLoading(acc.btn, true);
    const result = await createInviteAccount(state.scenario);
    if (visit !== state.visit) return;
    setLoading(acc.btn, false);
    if (result.ok) { go('done'); return; }
    acc.alert = result.reason;
    paintAccount();
  }
  $('#riAccForm').addEventListener('submit', submitAccount);
  ['names', 'lastName'].forEach((k) => {
    acc[k].addEventListener('blur', () => { acc.touched.add(k); paintAccount(); });
    acc[k].addEventListener('input', paintAccount);
  });
  acc.password.addEventListener('input', paintAccount);
  acc.terms.addEventListener('change', paintAccount);
  $('#riAccAlertAct').addEventListener('click', (e) => {
    if (e.currentTarget.dataset.action === 'login') { go('login'); return; }
    /* retry: el escenario vuelve a normal y se envía otra vez, con los datos que ya estaban */
    setScenario('normal', { retry: true });
    submitAccount();
  });

  /* ======================= 5 · Cuenta creada ======================= */
  ENTER.done = () => { $('#riDoneText').textContent = DONE_TEXTS.text(state.invite.companyName); };

  /* ======================= Enlaces y avisos comunes ======================= */
  $$('[data-go]').forEach((btn) => btn.addEventListener('click', () => (btn.dataset.go === 'code' ? goToCode() : go(btn.dataset.go))));
  $$('[data-toast]').forEach((btn) => btn.addEventListener('click', () => toast(...TOASTS[btn.dataset.toast])));
  $('#riForgot').addEventListener('click', () => toast(...TOASTS.forgot));

  /* ======================= Panel "Revisión" (chips del DS, variant="choice") ======================= */
  const chip = (option, group) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ri-chip';
    b.dataset.group = group;
    b.dataset.id = option.id;
    b.textContent = option.label;
    b.setAttribute('aria-pressed', 'false');
    return b;
  };
  SCREENS.forEach((s) => $('#riScreens').appendChild(chip(s, 'screen')));
  SCENARIOS.forEach((s) => $('#riScenarios').appendChild(chip(s, 'scenario')));
  /* selectScreen de su vista previa: la pantalla se monta de nuevo con la invitación de ejemplo */
  $('#riScreens').addEventListener('click', (e) => { const b = e.target.closest('.ri-chip'); if (b) go(b.dataset.id, { resetInvite: true }); });
  $('#riScenarios').addEventListener('click', (e) => { const b = e.target.closest('.ri-chip'); if (b) setScenario(b.dataset.id); });
  function paintReview() {
    $$('.ri-chip[data-group="screen"]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.id === state.screen)));
    $$('.ri-chip[data-group="scenario"]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.id === state.scenario)));
    $('#riNotes').innerHTML = NOTES[state.screen].map((n) => `<li>${esc(n)}</li>`).join('');
  }

  /* ======================= Arranque ======================= */
  hydrateIcons(document);
  const fromUrl = () => {
    const p = new URLSearchParams(location.search);
    state.scenario = scenarioByUrl(p.get('simular'));
    return screenByUrl(p.get('pantalla'));
  };
  addEventListener('popstate', () => go(fromUrl(), { mode: 'none', resetInvite: true }));
  go(fromUrl(), { mode: 'replace', resetInvite: true });
})();
