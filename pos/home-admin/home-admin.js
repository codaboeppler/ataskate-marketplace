/* Inicio del Administrativo, rediseño de UX (AdminHomeV2 y su vista previa /design-system/preview/home-admin de la rama del equipo,
   sobre la maqueta public/maquetas/home-admin). Pinta las 14 tarjetas con sus estados:
   1. Datos de prueba de preview.constants.ts (los mismos de la maqueta), con nombres y montos ficticios.
   2. AdminHomeV2View.renderCard: cargando (Spinner) → error (Alert con "Reintentar") → vacío de cuenta nueva → tarjeta con datos.
   3. Mampostería NewCardMasonry: columnas = máx(1, piso((ancho + 16) / (300 + 16))); la tarjeta i va a la columna i mod n.
   4. Rol (PREVIEW_ROLE_CARDS): filtra las tarjetas; con 1 o 2 aparece la nota del rol.
   5. ?nueva=1 (llega del registro por invitación) entra en "Cuenta nueva".
   Los controles de estado, rol y saldo van en la pestaña "Revisión" del riel (../demo.js). */
(() => {
  'use strict';
  /* Íconos del DS (Icons.tsx), exportados del frame de Figma como en la maqueta */
  const ICON = {
    arrow: "<svg aria-hidden=\"true\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" > <path d=\"M12 20L10.575 18.6L16.175 13H4V11H16.175L10.575 5.4L12 4L20 12L12 20Z\" fill=\"currentColor\" /> </svg>",
    add20: "<svg aria-hidden=\"true\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" > <path d=\"M11 19V13H5V11H11V5H13V11H19V13H13V19H11Z\" fill=\"currentColor\" /> </svg>",
    add24: "<svg aria-hidden=\"true\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" > <path d=\"M11 19V13H5V11H11V5H13V11H19V13H13V19H11Z\" fill=\"currentColor\" /> </svg>",
    warning: "<svg aria-hidden=\"true\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" > <path d=\"M1 21L12 2L23 21H1ZM12 18C12.2833 18 12.5208 17.9042 12.7125 17.7125C12.9042 17.5208 13 17.2833 13 17C13 16.7167 12.9042 16.4792 12.7125 16.2875C12.5208 16.0958 12.2833 16 12 16C11.7167 16 11.4792 16.0958 11.2875 16.2875C11.0958 16.4792 11 16.7167 11 17C11 17.2833 11.0958 17.5208 11.2875 17.7125C11.4792 17.9042 11.7167 18 12 18ZM11 15H13V10H11V15Z\" fill=\"currentColor\" /> </svg>",
    alertError: "<svg aria-hidden=\"true\" width=\"24\" height=\"24\" viewBox=\"48 156 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" > <path d=\"M60 178C58.6167 178 57.3167 177.737 56.1 177.212C54.8833 176.687 53.825 175.975 52.925 175.075C52.025 174.175 51.3127 173.117 50.788 171.9C50.2627 170.683 50 169.383 50 168C50 166.617 50.2627 165.317 50.788 164.1C51.3127 162.883 52.025 161.825 52.925 160.925C53.825 160.025 54.8833 159.312 56.1 158.787C57.3167 158.262 58.6167 158 60 158C61.3833 158 62.6833 158.262 63.9 158.787C65.1167 159.312 66.175 160.025 67.075 160.925C67.975 161.825 68.6873 162.883 69.212 164.1C69.7373 165.317 70 166.617 70 168C70 169.383 69.7373 170.683 69.212 171.9C68.6873 173.117 67.975 174.175 67.075 175.075C66.175 175.975 65.1167 176.687 63.9 177.212C62.6833 177.737 61.3833 178 60 178ZM56.4 173L60 169.4L63.6 173L65 171.6L61.4 168L65 164.4L63.6 163L60 166.6L56.4 163L55 164.4L58.6 168L55 171.6L56.4 173Z\" fill=\"currentColor\" /> </svg>",
    calendar: "<svg aria-hidden=\"true\" width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" > <path d=\"M5 22C4.45 22 3.979 21.8043 3.587 21.413C3.19567 21.021 3 20.55 3 20V6C3 5.45 3.19567 4.97933 3.587 4.588C3.979 4.196 4.45 4 5 4H6V2H8V4H16V2H18V4H19C19.55 4 20.021 4.196 20.413 4.588C20.8043 4.97933 21 5.45 21 6V20C21 20.55 20.8043 21.021 20.413 21.413C20.021 21.8043 19.55 22 19 22H5ZM5 20H19V10H5V20ZM5 8H19V6H5V8Z\" fill=\"currentColor\" /> </svg>",
    card: "<svg aria-hidden=\"true\" width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" > <path d=\"M22 6V18C22 18.55 21.8043 19.021 21.413 19.413C21.021 19.8043 20.55 20 20 20H4C3.45 20 2.97933 19.8043 2.588 19.413C2.196 19.021 2 18.55 2 18V6C2 5.45 2.196 4.97933 2.588 4.588C2.97933 4.196 3.45 4 4 4H20C20.55 4 21.021 4.196 21.413 4.588C21.8043 4.97933 22 5.45 22 6ZM4 8H20V6H4V8ZM4 12V18H20V12H4Z\" fill=\"currentColor\" /> </svg>",
    close: "<svg aria-hidden=\"true\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" > <path d=\"M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z\" fill=\"currentColor\" /> </svg>",
    toastSuccess: "<svg aria-hidden=\"true\" width=\"24\" height=\"24\" viewBox=\"96 156 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" > <path d=\"M108 178C106.617 178 105.317 177.737 104.1 177.212C102.883 176.687 101.825 175.975 100.925 175.075C100.025 174.175 99.3127 173.117 98.788 171.9C98.2627 170.683 98 169.383 98 168C98 166.617 98.2627 165.317 98.788 164.1C99.3127 162.883 100.025 161.825 100.925 160.925C101.825 160.025 102.883 159.312 104.1 158.787C105.317 158.262 106.617 158 108 158C109.383 158 110.683 158.262 111.9 158.787C113.117 159.312 114.175 160.025 115.075 160.925C115.975 161.825 116.687 162.883 117.212 164.1C117.737 165.317 118 166.617 118 168C118 169.383 117.737 170.683 117.212 171.9C116.687 173.117 115.975 174.175 115.075 175.075C114.175 175.975 113.117 176.687 111.9 177.212C110.683 177.737 109.383 178 108 178ZM106.6 172.6L113.65 165.55L112.25 164.15L106.6 169.8L103.75 166.95L102.35 168.35L106.6 172.6Z\" fill=\"currentColor\" /> </svg>",
    toastInfo: "<svg aria-hidden=\"true\" width=\"24\" height=\"24\" viewBox=\"144 156 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" > <path d=\"M154.774 172.838H156.774V166.838H154.774V172.838ZM155.774 164.838C156.058 164.838 156.295 164.742 156.487 164.55C156.679 164.359 156.774 164.121 156.774 163.838C156.774 163.555 156.679 163.317 156.487 163.125C156.295 162.934 156.058 162.838 155.774 162.838C155.491 162.838 155.254 162.934 155.062 163.125C154.87 163.317 154.774 163.555 154.774 163.838C154.774 164.121 154.87 164.359 155.062 164.55C155.254 164.742 155.491 164.838 155.774 164.838ZM155.774 177.838C154.391 177.838 153.091 177.575 151.874 177.05C150.658 176.525 149.599 175.813 148.699 174.913C147.799 174.013 147.087 172.955 146.562 171.738C146.037 170.521 145.774 169.221 145.774 167.838C145.774 166.455 146.037 165.155 146.562 163.938C147.087 162.721 147.799 161.663 148.699 160.763C149.599 159.863 150.658 159.15 151.874 158.625C153.091 158.1 154.391 157.838 155.774 157.838C157.158 157.838 158.458 158.1 159.674 158.625C160.891 159.15 161.949 159.863 162.849 160.763C163.749 161.663 164.462 162.721 164.987 163.938C165.512 165.155 165.774 166.455 165.774 167.838C165.774 169.221 165.512 170.521 164.987 171.738C164.462 172.955 163.749 174.013 162.849 174.913C161.949 175.813 160.891 176.525 159.674 177.05C158.458 177.575 157.158 177.838 155.774 177.838Z\" fill=\"currentColor\" /> </svg>",
    eTabulators: "<svg aria-hidden=\"true\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" > <path d=\"M9 21C8.45 21 7.97933 20.8043 7.588 20.413C7.196 20.021 7 19.55 7 19V9C7 8.45 7.196 7.979 7.588 7.587C7.97933 7.19567 8.45 7 9 7H19C19.55 7 20.021 7.19567 20.413 7.587C20.8043 7.979 21 8.45 21 9V19C21 19.55 20.8043 20.021 20.413 20.413C20.021 20.8043 19.55 21 19 21H9ZM9 11H19V9H9V11ZM13 15H15V13H13V15ZM13 19H15V17H13V19ZM9 15H11V13H9V15ZM17 15H19V13H17V15ZM9 19H11V17H9V19ZM17 19H19V17H17V19ZM5 17C4.45 17 3.979 16.8043 3.587 16.413C3.19567 16.021 3 15.55 3 15V5C3 4.45 3.19567 3.979 3.587 3.587C3.979 3.19567 4.45 3 5 3H15C15.55 3 16.021 3.19567 16.413 3.587C16.8043 3.979 17 4.45 17 5V6H15V5H5V15H6V17H5Z\" fill=\"currentColor\" /> </svg>",
    eConservation: "<svg aria-hidden=\"true\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" > <path d=\"M12.85 22C12.5667 22 12.3 21.9457 12.05 21.837C11.8 21.729 11.5833 21.5833 11.4 21.4L2.6 12.6C2.41667 12.4167 2.271 12.2 2.163 11.95C2.05433 11.7 2 11.4333 2 11.15V4C2 3.45 2.196 2.979 2.588 2.587C2.97933 2.19567 3.45 2 4 2H11.15C11.4333 2 11.7 2.054 11.95 2.162C12.2 2.27067 12.4167 2.41667 12.6 2.6L21.4 11.425C21.7833 11.8083 21.975 12.279 21.975 12.837C21.975 13.3957 21.7833 13.8667 21.4 14.25L14.25 21.4C14.0667 21.5833 13.8543 21.729 13.613 21.837C13.371 21.9457 13.1167 22 12.85 22ZM12.825 20L19.975 12.85L11.15 4H4V11.15L12.825 20ZM6.5 8C6.91667 8 7.27067 7.854 7.562 7.562C7.854 7.27067 8 6.91667 8 6.5C8 6.08333 7.854 5.72933 7.562 5.438C7.27067 5.146 6.91667 5 6.5 5C6.08333 5 5.72933 5.146 5.438 5.438C5.146 5.72933 5 6.08333 5 6.5C5 6.91667 5.146 7.27067 5.438 7.562C5.72933 7.854 6.08333 8 6.5 8Z\" fill=\"currentColor\" /> </svg>",
    eTerms: "<svg aria-hidden=\"true\" width=\"16\" height=\"16\" viewBox=\"1961 260 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" > <path d=\"M1963.3 266V261H1968.3V263H1965.3V266H1963.3ZM1981.3 266V263H1978.3V261H1983.3V266H1981.3ZM1963.3 283V278H1965.3V281H1968.3V283H1963.3ZM1978.3 283V281H1981.3V278H1983.3V283H1978.3ZM1968.3 278H1978.3V266H1968.3V278ZM1968.3 280C1967.75 280 1967.28 279.804 1966.89 279.413C1966.5 279.021 1966.3 278.55 1966.3 278V266C1966.3 265.45 1966.5 264.979 1966.89 264.588C1967.28 264.196 1967.75 264 1968.3 264H1978.3C1978.85 264 1979.32 264.196 1979.71 264.588C1980.1 264.979 1980.3 265.45 1980.3 266V278C1980.3 278.55 1980.1 279.021 1979.71 279.413C1979.32 279.804 1978.85 280 1978.3 280H1968.3ZM1970.3 270H1976.3V268H1970.3V270ZM1970.3 273H1976.3V271H1970.3V273ZM1970.3 276H1976.3V274H1970.3V276Z\" fill=\"currentColor\" /> </svg>",
    eMarket: "<svg aria-hidden=\"true\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" > <path d=\"M6.50012 16C6.91679 16 7.27096 15.8542 7.56262 15.5625C7.85429 15.2708 8.00012 14.9167 8.00012 14.5C8.00012 14.0833 7.85429 13.7292 7.56262 13.4375C7.27096 13.1458 6.91679 13 6.50012 13C6.08346 13 5.72929 13.1458 5.43762 13.4375C5.14596 13.7292 5.00012 14.0833 5.00012 14.5C5.00012 14.9167 5.14596 15.2708 5.43762 15.5625C5.72929 15.8542 6.08346 16 6.50012 16ZM15.5001 16C15.8335 16 16.1335 15.9 16.4001 15.7C16.6668 15.5 16.8418 15.2417 16.9251 14.925C16.5918 14.8583 16.2751 14.7458 15.9751 14.5875C15.6751 14.4292 15.4001 14.225 15.1501 13.975L14.5251 13.35C14.3585 13.4833 14.2293 13.65 14.1376 13.85C14.046 14.05 14.0001 14.2667 14.0001 14.5C14.0001 14.9167 14.146 15.2708 14.4376 15.5625C14.7293 15.8542 15.0835 16 15.5001 16ZM5.00012 19V20C5.00012 20.2833 4.90429 20.5208 4.71262 20.7125C4.52096 20.9042 4.28346 21 4.00012 21H3.00012C2.71679 21 2.47929 20.9042 2.28762 20.7125C2.09596 20.5208 2.00012 20.2833 2.00012 20V12L4.10012 6C4.20012 5.7 4.37929 5.45833 4.63762 5.275C4.89596 5.09167 5.18346 5 5.50012 5H9.00012V6.375C9.00012 6.475 9.00429 6.57917 9.01262 6.6875C9.02096 6.79583 9.03346 6.9 9.05012 7H5.85012L4.80012 10H11.1751L13.1751 12H4.00012V17H18.0001V14.975C18.3668 14.9417 18.721 14.85 19.0626 14.7C19.4043 14.55 19.7168 14.3417 20.0001 14.075V20C20.0001 20.2833 19.9043 20.5208 19.7126 20.7125C19.521 20.9042 19.2835 21 19.0001 21H18.0001C17.7168 21 17.4793 20.9042 17.2876 20.7125C17.096 20.5208 17.0001 20.2833 17.0001 20V19H5.00012ZM15.0001 6C15.2835 6 15.521 5.90417 15.7126 5.7125C15.9043 5.52083 16.0001 5.28333 16.0001 5C16.0001 4.71667 15.9043 4.47917 15.7126 4.2875C15.521 4.09583 15.2835 4 15.0001 4C14.7168 4 14.4793 4.09583 14.2876 4.2875C14.096 4.47917 14.0001 4.71667 14.0001 5C14.0001 5.28333 14.096 5.52083 14.2876 5.7125C14.4793 5.90417 14.7168 6 15.0001 6ZM16.5501 12.55L11.4501 7.45C11.3168 7.31667 11.2085 7.15417 11.1251 6.9625C11.0418 6.77083 11.0001 6.575 11.0001 6.375V2.5C11.0001 2.08333 11.146 1.72917 11.4376 1.4375C11.7293 1.14583 12.0835 1 12.5001 1H16.3751C16.5751 1 16.771 1.04167 16.9626 1.125C17.1543 1.20833 17.3168 1.31667 17.4501 1.45L22.5501 6.55C22.8335 6.83333 22.9751 7.1875 22.9751 7.6125C22.9751 8.0375 22.8335 8.39167 22.5501 8.675L18.6751 12.55C18.3918 12.8333 18.0376 12.975 17.6126 12.975C17.1876 12.975 16.8335 12.8333 16.5501 12.55ZM17.6251 10.8L20.8001 7.625L16.1751 3H13.0001V6.175L17.6251 10.8Z\" fill=\"currentColor\" /> </svg>",
    eExtensions: "<svg aria-hidden=\"true\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" > <path d=\"M5 8H19V6H5V8ZM5 22C4.45 22 3.97917 21.8042 3.5875 21.4125C3.19583 21.0208 3 20.55 3 20V6C3 5.45 3.19583 4.97917 3.5875 4.5875C3.97917 4.19583 4.45 4 5 4H6V2H8V4H16V2H18V4H19C19.55 4 20.0208 4.19583 20.4125 4.5875C20.8042 4.97917 21 5.45 21 6V11.675C20.6833 11.525 20.3583 11.4 20.025 11.3C19.6917 11.2 19.35 11.125 19 11.075V10H5V20H11.3C11.4167 20.3667 11.5542 20.7167 11.7125 21.05C11.8708 21.3833 12.0583 21.7 12.275 22H5ZM18 23C16.6167 23 15.4375 22.5125 14.4625 21.5375C13.4875 20.5625 13 19.3833 13 18C13 16.6167 13.4875 15.4375 14.4625 14.4625C15.4375 13.4875 16.6167 13 18 13C19.3833 13 20.5625 13.4875 21.5375 14.4625C22.5125 15.4375 23 16.6167 23 18C23 19.3833 22.5125 20.5625 21.5375 21.5375C20.5625 22.5125 19.3833 23 18 23ZM19.675 20.375L20.375 19.675L18.5 17.8V15H17.5V18.2L19.675 20.375Z\" fill=\"currentColor\" /> </svg>",
    eBrand: "<svg aria-hidden=\"true\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" > <mask id=\"mask0_15289_23292\" style=\"mask-type:alpha\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"24\" height=\"24\" > <rect width=\"24\" height=\"24\" fill=\"currentColor\" /> </mask> <g mask=\"url(#mask0_15289_23292)\"> <path d=\"M12 22C10.6333 22 9.34167 21.7375 8.125 21.2125C6.90833 20.6875 5.84583 19.9708 4.9375 19.0625C4.02917 18.1542 3.3125 17.0917 2.7875 15.875C2.2625 14.6583 2 13.3667 2 12C2 10.6167 2.2625 9.32083 2.7875 8.1125C3.3125 6.90417 4.02917 5.84583 4.9375 4.9375C5.84583 4.02917 6.90833 3.3125 8.125 2.7875C9.34167 2.2625 10.6333 2 12 2C13.3833 2 14.6792 2.2625 15.8875 2.7875C17.0958 3.3125 18.1542 4.02917 19.0625 4.9375C19.9708 5.84583 20.6875 6.90417 21.2125 8.1125C21.7375 9.32083 22 10.6167 22 12C22 13.3667 21.7375 14.6583 21.2125 15.875C20.6875 17.0917 19.9708 18.1542 19.0625 19.0625C18.1542 19.9708 17.0958 20.6875 15.8875 21.2125C14.6792 21.7375 13.3833 22 12 22ZM12 19.95C12.4333 19.35 12.8083 18.725 13.125 18.075C13.4417 17.425 13.7 16.7333 13.9 16H10.1C10.3 16.7333 10.5583 17.425 10.875 18.075C11.1917 18.725 11.5667 19.35 12 19.95ZM9.4 19.55C9.1 19 8.8375 18.4292 8.6125 17.8375C8.3875 17.2458 8.2 16.6333 8.05 16H5.1C5.58333 16.8333 6.1875 17.5583 6.9125 18.175C7.6375 18.7917 8.46667 19.25 9.4 19.55ZM14.6 19.55C15.5333 19.25 16.3625 18.7917 17.0875 18.175C17.8125 17.5583 18.4167 16.8333 18.9 16H15.95C15.8 16.6333 15.6125 17.2458 15.3875 17.8375C15.1625 18.4292 14.9 19 14.6 19.55ZM4.25 14H7.65C7.6 13.6667 7.5625 13.3375 7.5375 13.0125C7.5125 12.6875 7.5 12.35 7.5 12C7.5 11.65 7.5125 11.3125 7.5375 10.9875C7.5625 10.6625 7.6 10.3333 7.65 10H4.25C4.16667 10.3333 4.10417 10.6625 4.0625 10.9875C4.02083 11.3125 4 11.65 4 12C4 12.35 4.02083 12.6875 4.0625 13.0125C4.10417 13.3375 4.16667 13.6667 4.25 14ZM9.65 14H14.35C14.4 13.6667 14.4375 13.3375 14.4625 13.0125C14.4875 12.6875 14.5 12.35 14.5 12C14.5 11.65 14.4875 11.3125 14.4625 10.9875C14.4375 10.6625 14.4 10.3333 14.35 10H9.65C9.6 10.3333 9.5625 10.6625 9.5375 10.9875C9.5125 11.3125 9.5 11.65 9.5 12C9.5 12.35 9.5125 12.6875 9.5375 13.0125C9.5625 13.3375 9.6 13.6667 9.65 14ZM16.35 14H19.75C19.8333 13.6667 19.8958 13.3375 19.9375 13.0125C19.9792 12.6875 20 12.35 20 12C20 11.65 19.9792 11.3125 19.9375 10.9875C19.8958 10.6625 19.8333 10.3333 19.75 10H16.35C16.4 10.3333 16.4375 10.6625 16.4625 10.9875C16.4875 11.3125 16.5 11.65 16.5 12C16.5 12.35 16.4875 12.6875 16.4625 13.0125C16.4375 13.3375 16.4 13.6667 16.35 14ZM15.95 8H18.9C18.4167 7.16667 17.8125 6.44167 17.0875 5.825C16.3625 5.20833 15.5333 4.75 14.6 4.45C14.9 5 15.1625 5.57083 15.3875 6.1625C15.6125 6.75417 15.8 7.36667 15.95 8ZM10.1 8H13.9C13.7 7.26667 13.4417 6.575 13.125 5.925C12.8083 5.275 12.4333 4.65 12 4.05C11.5667 4.65 11.1917 5.275 10.875 5.925C10.5583 6.575 10.3 7.26667 10.1 8ZM5.1 8H8.05C8.2 7.36667 8.3875 6.75417 8.6125 6.1625C8.8375 5.57083 9.1 5 9.4 4.45C8.46667 4.75 7.6375 5.20833 6.9125 5.825C6.1875 6.44167 5.58333 7.16667 5.1 8Z\" fill=\"currentColor\" /> </g> </svg>",
    eDiscounts: "<svg aria-hidden=\"true\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" > <path d=\"M18 23V20H15V18H18V15H20V18H23V20H20V23H18ZM2 20V14H1V12L2 7H17L18 12V14H17V17H15V14H11V20H2ZM4 18H9V14H4V18ZM2 6V4H17V6H2ZM3.05 12H15.95L15.35 9H3.65L3.05 12Z\" fill=\"currentColor\" /> </svg>",
    eLocations: "<svg aria-hidden=\"true\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" > <path d=\"M12 16.475C13.65 15.1417 14.896 13.8583 15.738 12.625C16.5793 11.3917 17 10.2333 17 9.15C17 8.21667 16.8293 7.42067 16.488 6.762C16.146 6.104 15.725 5.57067 15.225 5.162C14.725 4.754 14.1833 4.45833 13.6 4.275C13.0167 4.09167 12.4833 4 12 4C11.5167 4 10.9833 4.09167 10.4 4.275C9.81667 4.45833 9.275 4.754 8.775 5.162C8.275 5.57067 7.85433 6.104 7.513 6.762C7.171 7.42067 7 8.21667 7 9.15C7 10.2333 7.42067 11.3917 8.262 12.625C9.104 13.8583 10.35 15.1417 12 16.475ZM12 19C9.65 17.2667 7.89567 15.5833 6.737 13.95C5.579 12.3167 5 10.7167 5 9.15C5 7.96667 5.21267 6.929 5.638 6.037C6.06267 5.14567 6.60833 4.4 7.275 3.8C7.94167 3.2 8.69167 2.75 9.525 2.45C10.3583 2.15 11.1833 2 12 2C12.8167 2 13.6417 2.15 14.475 2.45C15.3083 2.75 16.0583 3.2 16.725 3.8C17.3917 4.4 17.9377 5.14567 18.363 6.037C18.7877 6.929 19 7.96667 19 9.15C19 10.7167 18.4207 12.3167 17.262 13.95C16.104 15.5833 14.35 17.2667 12 19ZM12 11C12.55 11 13.021 10.804 13.413 10.412C13.8043 10.0207 14 9.55 14 9C14 8.45 13.8043 7.979 13.413 7.587C13.021 7.19567 12.55 7 12 7C11.45 7 10.9793 7.19567 10.588 7.587C10.196 7.979 10 8.45 10 9C10 9.55 10.196 10.0207 10.588 10.412C10.9793 10.804 11.45 11 12 11ZM5 22V20H19V22H5Z\" fill=\"currentColor\" /> </svg>",
    eDevices: "<svg aria-hidden=\"true\" width=\"16\" height=\"16\" viewBox=\"1433 260 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" > <path d=\"M1441.8 280.5V279H1443.8V277H1437.61C1437.1 277 1436.67 276.825 1436.32 276.475C1435.97 276.125 1435.8 275.697 1435.8 275.192V265.308C1435.8 264.803 1435.97 264.375 1436.32 264.025C1436.67 263.675 1437.1 263.5 1437.61 263.5H1452.99C1453.5 263.5 1453.92 263.675 1454.27 264.025C1454.62 264.375 1454.8 264.803 1454.8 265.308V275.192C1454.8 275.697 1454.62 276.125 1454.27 276.475C1453.92 276.825 1453.5 277 1452.99 277H1446.8V279H1448.8V280.5H1441.8ZM1437.61 275.5H1452.99C1453.07 275.5 1453.14 275.468 1453.2 275.404C1453.27 275.34 1453.3 275.269 1453.3 275.192V265.308C1453.3 265.231 1453.27 265.16 1453.2 265.096C1453.14 265.032 1453.07 265 1452.99 265H1437.61C1437.53 265 1437.46 265.032 1437.4 265.096C1437.33 265.16 1437.3 265.231 1437.3 265.308V275.192C1437.3 275.269 1437.33 275.34 1437.4 275.404C1437.46 275.468 1437.53 275.5 1437.61 275.5Z\" fill=\"currentColor\" /> </svg>",
    error: "<svg aria-hidden=\"true\" width=\"18\" height=\"18\" viewBox=\"0 -960 960 960\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" > <path d=\"M508.5-291.5Q520-303 520-320t-11.5-28.5Q497-360 480-360t-28.5 11.5Q440-337 440-320t11.5 28.5Q463-280 480-280t28.5-11.5ZM440-440h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z\" fill=\"currentColor\" /> </svg>",
    addonBox: "<svg aria-hidden=\"true\" width=\"20\" height=\"20\" viewBox=\"0 -960 960 960\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" > <path d=\"M440-183v-274L200-596v274l240 139Zm80 0 240-139v-274L520-457v274Zm-80 92L160-252q-19-11-29.5-29T120-321v-318q0-22 10.5-40t29.5-29l280-161q19-11 40-11t40 11l280 161q19 11 29.5 29t10.5 40v318q0 22-10.5 40T800-252L520-91q-19 11-40 11t-40-11Zm200-528 77-44-237-137-78 45 238 136Zm-160 93 78-45-237-137-78 45 237 137Z\" fill=\"currentColor\" /> </svg>",
    addonChart: "<svg aria-hidden=\"true\" width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" > <path d=\"M16 20V13H20V20H16ZM10 20V4H14V20H10ZM4 20V9H8V20H4Z\" fill=\"currentColor\" /> </svg>",
    mUsers: "<svg aria-hidden=\"true\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" > <path d=\"M1 20V17.2C1 16.6333 1.146 16.1123 1.438 15.637C1.72933 15.1623 2.11667 14.8 2.6 14.55C3.63333 14.0333 4.68333 13.6457 5.75 13.387C6.81667 13.129 7.9 13 9 13C10.1 13 11.1833 13.129 12.25 13.387C13.3167 13.6457 14.3667 14.0333 15.4 14.55C15.8833 14.8 16.2707 15.1623 16.562 15.637C16.854 16.1123 17 16.6333 17 17.2V20H1ZM19 20V17C19 16.2667 18.796 15.5623 18.388 14.887C17.9793 14.2123 17.4 13.6333 16.65 13.15C17.5 13.25 18.3 13.4207 19.05 13.662C19.8 13.904 20.5 14.2 21.15 14.55C21.75 14.8833 22.2083 15.254 22.525 15.662C22.8417 16.0707 23 16.5167 23 17V20H19ZM9 12C7.9 12 6.95833 11.6083 6.175 10.825C5.39167 10.0417 5 9.1 5 8C5 6.9 5.39167 5.95833 6.175 5.175C6.95833 4.39167 7.9 4 9 4C10.1 4 11.0417 4.39167 11.825 5.175C12.6083 5.95833 13 6.9 13 8C13 9.1 12.6083 10.0417 11.825 10.825C11.0417 11.6083 10.1 12 9 12ZM15 12C14.8167 12 14.5833 11.9793 14.3 11.938C14.0167 11.896 13.7833 11.85 13.6 11.8C14.05 11.2667 14.3957 10.675 14.637 10.025C14.879 9.375 15 8.7 15 8C15 7.3 14.879 6.625 14.637 5.975C14.3957 5.325 14.05 4.73333 13.6 4.2C13.8333 4.11667 14.0667 4.06233 14.3 4.037C14.5333 4.01233 14.7667 4 15 4C16.1 4 17.0417 4.39167 17.825 5.175C18.6083 5.95833 19 6.9 19 8C19 9.1 18.6083 10.0417 17.825 10.825C17.0417 11.6083 16.1 12 15 12ZM3 18H15V17.2C15 17.0167 14.9543 16.85 14.863 16.7C14.771 16.55 14.65 16.4333 14.5 16.35C13.6 15.9 12.6917 15.5623 11.775 15.337C10.8583 15.1123 9.93333 15 9 15C8.06667 15 7.14167 15.1123 6.225 15.337C5.30833 15.5623 4.4 15.9 3.5 16.35C3.35 16.4333 3.22933 16.55 3.138 16.7C3.046 16.85 3 17.0167 3 17.2V18ZM9 10C9.55 10 10.021 9.804 10.413 9.412C10.8043 9.02067 11 8.55 11 8C11 7.45 10.8043 6.97933 10.413 6.588C10.021 6.196 9.55 6 9 6C8.45 6 7.97933 6.196 7.588 6.588C7.196 6.97933 7 7.45 7 8C7 8.55 7.196 9.02067 7.588 9.412C7.97933 9.804 8.45 10 9 10Z\" fill=\"currentColor\" /> </svg>",
    mLayaways: "<svg aria-hidden=\"true\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" > <path d=\"M3.99982 18.001V10.001V10.326V6.00098V18.001ZM3.99982 8.00098H19.9998V6.00098H3.99982V8.00098ZM11.6748 20.001H3.99982C3.44982 20.001 2.97898 19.8051 2.58732 19.4135C2.19565 19.0218 1.99982 18.551 1.99982 18.001V6.00098C1.99982 5.45098 2.19565 4.98014 2.58732 4.58848C2.97898 4.19681 3.44982 4.00098 3.99982 4.00098H19.9998C20.5498 4.00098 21.0207 4.19681 21.4123 4.58848C21.804 4.98014 21.9998 5.45098 21.9998 6.00098V11.251C21.3998 10.8343 20.7498 10.5218 20.0498 10.3135C19.3498 10.1051 18.6332 10.001 17.8998 10.001C16.9998 10.001 16.1332 10.176 15.2998 10.526C14.4665 10.876 13.7332 11.3676 13.0998 12.001H3.99982V18.001H11.0748C11.1248 18.351 11.1998 18.6926 11.2998 19.026C11.3998 19.3593 11.5248 19.6843 11.6748 20.001ZM19.6748 19.376L20.3748 18.676L18.4998 16.801V14.001H17.4998V17.201L19.6748 19.376ZM18.0248 22.001C16.6248 22.001 15.4373 21.5176 14.4623 20.551C13.4873 19.5843 12.9998 18.401 12.9998 17.001C12.9998 15.601 13.4873 14.4176 14.4623 13.451C15.4373 12.4843 16.6248 12.001 18.0248 12.001C19.4081 12.001 20.5832 12.4885 21.5498 13.4635C22.5165 14.4385 22.9998 15.6176 22.9998 17.001C22.9998 18.3843 22.5165 19.5635 21.5498 20.5385C20.5832 21.5135 19.4081 22.001 18.0248 22.001Z\" fill=\"currentColor\" /> </svg>",
  };
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const mxn = (n) => (n < 0 ? '-' : '') + '$' + Math.abs(n).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const num = (n) => n.toLocaleString('es-MX');
  const plural = (n, one, many) => `${num(n)} ${n === 1 ? one : many}`;

  /* ======================= Datos (preview.constants.ts: PREVIEW_DATA, PREVIEW_BILLING, PREVIEW_TABULATORS) ======================= */
  const BILLING_BASE = {
    fees: [{ label: '1% sobre transacciones', amount: -3180 }, { label: 'Plan profesional', sub: '1 sucursal', amount: -599 }],
    nextPayment: '25/09/2026', bank: 'BBVA', last4: '4471',
  };
  const BILLING = {
    favor: { ...BILLING_BASE, income: [{ label: 'Casa de empeño', amount: 98720 }, { label: 'Comercializadora', amount: 45709 }] },
    due: { ...BILLING_BASE, income: [{ label: 'Casa de empeño', amount: 2140 }, { label: 'Comercializadora', amount: 0 }] },
  };
  const TABULATORS = {
    oro: { price: '$54,259 24K/oz', rows: [['22K', 43100], ['18K', 32330], ['14K', 24145], ['10K', 17987]] },
    plata: { price: '$612 .999/oz', rows: [['.999', 612], ['.950', 581.4], ['.925', 566.1], ['.900', 550.8]] },
  };
  const DATA = {
    users: { list: [{ ini: 'C', name: 'Carlos', bg: 'var(--pos-warning-surface)' }, { ini: 'M', name: 'María', bg: 'var(--ats-info-blue-50)' }, { ini: 'J', name: 'Jorge', bg: 'var(--ats-success-green-50)' }], total: 15 },
    market: [{ label: 'Arriba del mercado', n: 42, c: 'var(--ats-error-red-200)' }, { label: 'Debajo del mercado', n: 84, c: 'var(--ats-alert-yellow-200)' }, { label: 'Dentro del rango', n: 986, c: 'var(--ats-info-blue-200)' }],
    brand: { store: 'ataskate.com/empenos-fernandez', status: 'Publicada', issues: [['Banner principal sin imagen', 'Agregar imagen'], ['Página de contacto vacía', 'Completar página']] },
    locations: { stats: [['Sucursales', 14], ['Bodegas', 6], ['Grupos', 3]], rows: [['Regional Centro', 2, 6], ['Regional Norte', 2, 4], ['Regional Sur', 2, 4]] },
    layaways: { eligible: 801, current: 3, paused: 1, issues: [['1 apartado sin vigencia', 'Definir vigencia'], ['4 categorías sin apartados', 'Habilitar apartados']] },
    terms: { noTerm: 8, inactive: 9, rows: [['Electrónicos', '30 días', '2.5% – 3.5%'], ['Juguetes', '45 días', '3.0% – 4.0%'], ['Herramientas', '60 días', '4.0% – 5.0%']] },
    devices: { withAccess: 112, inactive: 9, rows: [['San Juanico', 6], ['Sucursal norte', 4], ['Sucursal Roma', null]], warning: ['3 sucursales sin dispositivo', 'Asignar'] },
    conservation: { active: 3, inactive: 1, rows: [['Excelente', '90%'], ['Bueno', '75%'], ['Regular', '60%'], ['Malo', null]] },
    extensions: { total: 9, withExt: 6, without: [['Electrónicos', 32], ['Juguetes', 15], ['Herramientas', 20]], expiringSoon: 1 },
    files: { usedGB: 750, totalGB: 3000, rows: [{ label: 'Imágenes', files: 30450, gb: 550, c: 'var(--ats-success-green-200)' }, { label: 'Documentos', files: 2300, gb: 100, c: 'var(--ats-primary-200)' }, { label: 'Otros', files: 700, gb: 100, c: 'var(--ats-info-blue-200)' }] },
    promotions: { stats: [['Categorías con descuento', 5], ['Activas', 3], ['Pausadas', 2]], rows: [['Buen Fin', 'Electrónicos y 2 más · hasta el 30 nov', '25%'], ['Black Friday', 'Juguetes y 3 más · hasta el 28 nov', '30%'], ['Cyber Monday', 'Tecnología y 4 más · hasta el 1 dic', '20%']] },
    addons: [{ name: 'Módulo de envíos', icon: 'addonBox', color: 'var(--ha-pink-200)', bg: 'var(--ha-purple-50)' }, { name: 'Reportes avanzados', icon: 'addonChart', color: 'var(--ha-ok-title)', bg: 'var(--ha-green-100)' }],
  };

  /* ======================= Vista previa: estado, rol y saldo (preview.constants.ts) ======================= */
  const STATES = [['normal', 'Normal'], ['loading', 'Cargando'], ['empty', 'Cuenta nueva'], ['error', 'Error de carga']];
  const ROLES = [['admin', 'Administrador'], ['valuador', 'Valuador'], ['tienda', 'Solo Tienda en línea']];
  const BALANCES = [['favor', 'A favor (depósito)'], ['due', 'Por pagar (cobro)']];
  /* HOME_CARD_ORDER: orden de lectura de Figma, fila por fila de las 3 columnas */
  const ORDER = ['billing', 'users', 'market', 'brand', 'locations', 'extensions', 'terms', 'devices', 'files', 'tabulators', 'conservation', 'layaways', 'promotions', 'addons'];
  /* PREVIEW_ROLE_CARDS: en producción lo decide el backend (GetHomeAdminPermissions) */
  const ROLE_CARDS = {
    admin: ORDER,
    valuador: ['tabulators', 'terms', 'extensions', 'conservation', 'locations', 'devices', 'users'],
    tienda: ['brand'],
  };
  const ERROR_CARDS = ['billing', 'files'];
  const view = { state: 'normal', role: 'admin', balance: 'favor', metal: 'oro', retried: [], createdExt: [] };

  /* Flechas de las tarjetas: a la pantalla del prototipo si existe; si no, aviso de navegación simulada */
  const ROUTES = { brand: '../empresa/#tienda', terms: '../plazos/', users: '../empresa/#usuarios', locations: '../empresa/#ubicaciones', conservation: '../empresa/#catalogo-empenos', tabulators: '../tabuladores/', extensions: '../plazos/' };
  const TITLES = {
    billing: 'Facturación y suscripción', users: 'Usuarios', market: 'Precio de venta vs. mercado', brand: 'Diseño de marca',
    locations: 'Ubicaciones', extensions: 'Extensiones', terms: 'Plazos prendarios', devices: 'Dispositivos conectados', files: 'Archivos',
    tabulators: 'Tabuladores', conservation: 'Estados de conservación', layaways: 'Apartados', promotions: 'Promociones', addons: 'Apps disponibles',
  };

  /* Estados vacíos (EMPTY_STATE_TEXT): Figma Suscripción › estados (4930:10548) */
  const EMPTY = {
    tabulators: ['eTabulators', 'Sin tabuladores', 'Define los tabuladores para tus sucursales.', 'Crear tabulador', true],
    conservation: ['eConservation', 'Sin estados configurados', 'Define el % del avalúo de cada estado para poder valuar artículos.', 'Configurar estados'],
    terms: ['eTerms', 'Sin plazos prendarios', 'Configura los plazos y condiciones de préstamo que aplican a tus empeños.', 'Crear plazo', true],
    market: ['eMarket', 'Sin % de pase almoneda', 'Define el porcentaje de pase almoneda de tu catálogo.', 'Configurar % de pase almoneda'],
    extensions: ['eExtensions', 'Sin extensiones activas', 'Ofrece días adicionales tras el vencimiento del contrato, con un costo por día definido.', 'Crear extensión', true],
    brand: ['eBrand', 'Aún no creas tu tienda', 'Vende, recibe apartados y cobra refrendos y desempeños en línea, con tu nombre y logo.', 'Configurar tienda'],
    promotions: ['eDiscounts', 'Sin campañas activas', 'Crea descuentos por categoría, plazo o perfil de cliente y mide su impacto antes de publicarlos.', 'Crear promoción', true],
    locations: ['eLocations', 'Sin ubicaciones creadas', 'Crea las ubicaciones de tu empresa para asignarles usuarios, direcciones y horarios.', 'Crear ubicación', true],
    layaways: ['mLayaways', 'Sin apartados configurados', 'Define qué categorías se pueden apartar y la vigencia de cada apartado.', 'Configurar apartados'],
    users: ['mUsers', 'Aún no agregas a tu equipo', 'Agrega usuarios y asígnales un rol y una sucursal para que empiecen a operar.', 'Agregar usuario', true],
    devices: ['eDevices', 'Sin dispositivos registrados', 'Registra un dispositivo y usa su código de enlace para iniciar sesión en la sucursal.', 'Registrar dispositivo'],
  };

  /* ======================= Piezas ======================= */
  const head = (id) => {
    const route = ROUTES[id];
    const attrs = route ? `href="${route}"` : `href="#" data-go="${esc(TITLES[id])}"`;
    return `<div class="ha-card__head"><h2 class="ha-card__title">${esc(TITLES[id])}</h2>`
      + `<a class="ds-btn ds-btn--tertiary ds-btn--icon-sm ha-ibtn" ${attrs} aria-label="Ir a ${esc(TITLES[id])}">${ICON.arrow}</a></div>`;
  };
  const headOnly = (id) => `<div class="ha-card__head"><h2 class="ha-card__title">${esc(TITLES[id])}</h2></div>`;
  const stats = (list) => `<dl class="ha-stats">${list.map(([l, v, mod]) => `<div class="ha-stat${mod ? ` ha-stat--${mod}` : ''}"><dt>${esc(l)}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
  const btn = (label, ctx, cls = '') => `<button type="button" class="ds-btn ${/secondary/.test(cls) ? '' : 'ds-btn--tertiary '}ds-btn--md ha-btn ${cls}" data-act="${esc(label)}"${ctx ? ` data-ctx="${esc(ctx)}"` : ''}>${esc(label)}</button>`;
  const bar = (segs, total, label) => `<div class="ha-chart__track" role="img" aria-label="${esc(label)}">${segs.map((s) => `<span style="flex:0 0 ${(s.v / total * 100).toFixed(2)}%;background:${s.c}"></span>`).join('')}</div>`;
  const issue = ([text, action]) => row([td(`<span class="ha-issue-ico">${ICON.error}</span><span>${esc(text)}</span>`, 'ha-td--row'), td(btn(action, text), 'ha-td--fit ha-td--right')]);
  const warn = ([text, action]) => `<div class="ha-warn" role="status"><div class="ha-warn__txt">${ICON.warning}<span>${esc(text)}</span></div>${btn(action, text)}</div>`;
  const row = (cells) => `<tr class="ha-tr">${cells.join('')}</tr>`;
  /* Tabla del DS (.ds-table): las celdas con varias piezas llevan un contenedor flex adentro */
  const td = (html, cls = '', style = '', tag = 'td') => {
    const flex = /ha-td--row/.test(cls);
    const st = style && !flex ? ` style="${style}"` : '';
    return `<${tag} class="ha-td ${cls}"${st}>${flex ? `<div class="ha-td__flex"${style ? ` style="${style}"` : ''}>${html}</div>` : html}</${tag}>`;
  };
  const th = (labels) => `<thead><tr class="ha-tr ha-tr--head">${labels.map(([l, cls = '', style = '']) => td(esc(l), cls, style, 'th')).join('')}</tr></thead>`;

  /* ======================= Tarjetas ======================= */
  const RENDER = {
    billing() {
      const b = BILLING[view.balance];
      const subtotal = b.income.reduce((a, x) => a + x.amount, 0);
      const net = subtotal + b.fees.reduce((a, x) => a + x.amount, 0);
      const due = net < 0;
      return `${head('billing')}
        <div class="ha-panel"><span class="ha-panel__label">Ingresos por línea de negocio</span><div>
          ${b.income.map((x) => `<div class="ha-kv"><span>${esc(x.label)}</span><span>${mxn(x.amount)}</span></div>`).join('')}
          <div class="ha-kv ha-kv--total"><span>Subtotal</span><span>${mxn(subtotal)}</span></div></div></div>
        <div class="ha-panel"><span class="ha-panel__label">Comisiones</span><div>
          ${b.fees.map((x) => `<div class="ha-kv"><span>${esc(x.label)}${x.sub ? `<span class="ha-kv__sub">${esc(x.sub)}</span>` : ''}</span><span>${mxn(x.amount)}</span></div>`).join('')}</div></div>
        <div class="ha-hr"></div>
        <div class="ha-net${due ? ' ha-net--due' : ''}"><span>${due ? 'Total a pagar' : 'Neto a depositar'}</span><strong>${mxn(Math.abs(net))}</strong></div>
        <div class="ha-hr"></div>
        <div class="ha-summary${due ? ' ha-summary--due' : ''}">${ICON.calendar}<span>${due ? 'Próximo cobro' : 'Próximo depósito'}</span><time>${esc(b.nextPayment)}</time></div>
        <div class="ha-pay"><span class="ha-pay__ico">${ICON.card}</span><span class="ha-pay__n">${esc(b.bank)} •••• ${esc(b.last4)}</span><span class="ds-tag ds-tag--blanco">Predeterminada</span></div>
        <div class="ha-hr ha-hr--gray"></div>
        <div class="ha-btn-stack">${btn('Cambiar plan')}${btn('Ver recibos de pago')}</div>`;
    },
    users() {
      const u = DATA.users;
      const more = u.total - u.list.length;
      return `${head('users')}<ul class="ha-users">
        ${u.list.map((x) => `<li><button type="button" class="ha-user" data-act="Ver usuario" data-ctx="${esc(x.name)}"><span class="ds-avatar ds-avatar--md ha-av" style="background:${x.bg}" aria-hidden="true">${esc(x.ini)}</span><span class="ha-user__lbl">${esc(x.name)}</span></button></li>`).join('')}
        ${more > 0 ? `<li><a class="ha-user" href="${ROUTES.users}"><span class="ds-avatar ds-avatar--md ha-av" style="background:var(--ha-ok-surface)" aria-hidden="true"><img src="assets/ilust-usuarios-mas.svg" alt="" /></span><span class="ha-user__lbl">${more} más</span></a></li>` : ''}
        <li><button type="button" class="ha-user ha-user--add" data-act="Agregar usuario"><span class="ds-avatar ds-avatar--md ha-av" aria-hidden="true">${ICON.add24}</span><span class="ha-user__lbl">Agregar</span></button></li></ul>`;
    },
    market() {
      const rows = DATA.market;
      const total = rows.reduce((a, r) => a + r.n, 0);
      return `${head('market')}
        <div class="ha-chart"><span class="ha-chart__caption">${plural(total, 'artículo', 'artículos')}</span>${bar(rows.map((r) => ({ v: r.n, c: r.c })), total, TITLES.market)}</div>
        <table class="ds-table ha-tbl">${rows.map((r) => row([td(`<span class="ha-legend"><span class="ha-legend__dot" style="--c:${r.c}"></span>${esc(r.label)}</span>`, '', 'min-height:0;padding:0'), td(plural(r.n, 'artículo', 'artículos'), 'ha-td--fit ha-td--right', 'width:100px')])).join('')}</table>
        <div class="ha-btn-stack">${btn('Ver artículos en inventario')}${btn('Ajustar % de pase almoneda')}</div>`;
    },
    brand() {
      const d = DATA.brand;
      return `${head('brand')}
        ${stats([['Enlace a tienda', `<a class="ha-store" href="#" data-act="Abrir tienda" data-ctx="${esc(d.store)}" title="${esc(d.store)}">${esc(d.store)}</a>`], ['Estado', `<span class="ds-tag ds-tag--verde">${esc(d.status)}</span>`, 'fit']])}
        <table class="ds-table ha-tbl">${d.issues.map(issue).join('')}</table>`;
    },
    locations() {
      const l = DATA.locations;
      return `${head('locations')}${stats(l.stats)}
        <table class="ds-table ha-tbl">${th([['Grupo'], ['Sucursales', 'ha-td--fit ha-td--right', 'width:80px']])}
        ${l.rows.map(([g, w, b]) => row([td(`<span class="ha-td__main">${esc(g)}</span><span class="ha-td__sub">${plural(w, 'bodega', 'bodegas')}</span>`), td(b, 'ha-td--fit ha-td--right', 'width:80px')])).join('')}</table>`;
    },
    extensions() {
      const x = DATA.extensions;
      const without = x.without.filter(([n]) => !view.createdExt.includes(n));
      const withExt = x.withExt + view.createdExt.length;
      const label = `${withExt} de ${x.total} plazos con extensión activa`;
      return `${head('extensions')}
        <div class="ha-chart"><span class="ha-chart__caption">${label}</span>${bar([{ v: withExt, c: 'var(--ats-success-green-200)' }], x.total, label)}</div>
        <table class="ds-table ha-tbl">${th([['Plazos sin extensión']])}
        ${without.length ? without.map(([n, c]) => row([td(`<span class="ha-td__main">${esc(n)}</span><span class="ha-td__sub">${plural(c, 'contrato activo', 'contratos activos')}</span>`), td(`<button type="button" class="ds-btn ds-btn--tertiary ds-btn--md ha-btn ha-btn--icon" data-ext="${esc(n)}">${ICON.add20}Crear extensión</button>`, 'ha-td--fit ha-td--row')])).join('')
          : row([td('Todos los plazos tienen extensión.', 'ha-td--muted')])}</table>
        ${x.expiringSoon ? warn([`${plural(x.expiringSoon, 'extensión vence', 'extensiones vencen')} en 5 días`, 'Revisar']) : ''}`;
    },
    terms() {
      const t = DATA.terms;
      return `${head('terms')}${stats([['Categorías sin plazo', t.noTerm, 'auto'], ['Plazos inactivos', t.inactive]])}
        <table class="ds-table ha-tbl">${th([['Plazo'], ['Duración'], ['Interés']])}${t.rows.map((r) => row(r.map((c) => td(esc(c))))).join('')}</table>`;
    },
    devices() {
      const d = DATA.devices;
      return `${head('devices')}${stats([['Con acceso', d.withAccess], ['Inactivos', d.inactive]])}
        <table class="ds-table ha-tbl">${th([['Sucursal'], ['Dispositivos', 'ha-td--fit ha-td--right', 'width:112px']])}
        ${d.rows.map(([s, n]) => row([td(`<span class="ha-td__main">${esc(s)}</span>`), td(n ? n : '<span class="ds-tag ds-tag--gris">Sin dispositivos</span>', 'ha-td--fit ha-td--right', 'width:112px')])).join('')}</table>
        ${warn(d.warning)}`;
    },
    files() {
      const f = view.state === 'empty' ? { usedGB: 0, totalGB: 3000, rows: [] } : DATA.files;
      const label = `${num(f.usedGB)} GB usados de ${f.totalGB / 1000} TB`;
      return `${head('files')}
        <div class="ha-chart"><span class="ha-chart__caption">${label}</span>${bar(f.rows.map((r) => ({ v: r.gb, c: r.c })), f.totalGB, label)}</div>
        ${f.rows.length ? `<table class="ds-table ha-tbl">${f.rows.map((r) => row([td(`<span class="ha-legend" style="padding:0"><span class="ha-legend__dot" style="--c:${r.c}"></span></span><span style="display:flex;flex-direction:column;gap:2px"><span>${esc(r.label)}</span><span class="ha-td__sub">${num(r.files)} archivos</span></span>`, 'ha-td--row', 'gap:4px'), td(`${num(r.gb)} GB`, 'ha-td--fit ha-td--right', 'width:80px')])).join('')}</table>` : ''}`;
    },
    tabulators() {
      const t = TABULATORS[view.metal];
      return `${head('tabulators')}
        <div class="ha-tab-head"><div class="ha-chips" role="group" aria-label="Metal">
          <button type="button" class="ds-chip ds-chip--choice ha-choice${view.metal === 'oro' ? ' ds-chip--on' : ''}" data-metal="oro" aria-pressed="${view.metal === 'oro'}">Oro</button>
          <button type="button" class="ds-chip ds-chip--choice ha-choice${view.metal === 'plata' ? ' ds-chip--on' : ''}" data-metal="plata" aria-pressed="${view.metal === 'plata'}">Plata</button></div>
          <div class="ha-tab-price"><span>Precio de mercado hoy</span><span>${esc(t.price)}</span></div></div>
        <table class="ds-table ha-tbl">${th([['Pureza'], ['Precio por oz', 'ha-td--right']])}${t.rows.map(([p, v]) => row([td(esc(p)), td(mxn(v), 'ha-td--right')])).join('')}</table>`;
    },
    conservation() {
      const c = DATA.conservation;
      return `${head('conservation')}${stats([['Activos', c.active], ['Inactivos', c.inactive]])}
        <table class="ds-table ha-tbl">${th([['Estado'], ['% del avalúo']])}
        ${c.rows.map(([s, p]) => row([td(esc(s), p ? '' : 'ha-td--muted'), td(p ? esc(p) : '<span><span class="ds-tag ds-tag--gris">Inactivo</span></span>')])).join('')}</table>`;
    },
    layaways() {
      const a = DATA.layaways;
      return `${head('layaways')}${stats([['Artículos apartables', num(a.eligible), 'auto'], ['Vigentes', a.current], ['Pausados', a.paused]])}
        <table class="ds-table ha-tbl">${a.issues.map(issue).join('')}</table>`;
    },
    promotions() {
      const d = DATA.promotions;
      return `${head('promotions')}${stats([[d.stats[0][0], d.stats[0][1], 'auto'], d.stats[1], d.stats[2]])}
        <table class="ds-table ha-tbl">${th([['Campaña'], ['Descuento', 'ha-td--fit ha-td--right', 'width:72px']])}
        ${d.rows.map(([n, s, p]) => row([td(`<span class="ha-td__main">${esc(n)}</span><span class="ha-td__sub">${esc(s)}</span>`), td(esc(p), 'ha-td--fit ha-td--right', 'width:72px')])).join('')}</table>`;
    },
    addons() {
      return `${head('addons')}<div class="ha-addons">${DATA.addons.map((m) => `<div class="ha-addon">
        <span class="ha-addon__ico" style="background:${m.bg};color:${m.color}">${ICON[m.icon]}</span><span class="ha-addon__name">${esc(m.name)}</span>
        <button type="button" class="ds-btn ds-btn--tertiary ds-btn--icon-md ha-ibtn ha-ibtn--lg" data-act="Agregar app" data-ctx="${esc(m.name)}" aria-label="Agregar ${esc(m.name)}">${ICON.add24}</button></div>`).join('')}</div>`;
    },
  };

  /* AdminHomeV2View.renderCard: cargando → error → vacío (cuenta nueva) → tarjeta con datos */
  function cardHTML(id) {
    if (view.state === 'loading') return `${headOnly(id)}<div class="ha-loading"><div class="ds-spinner ds-spinner--lg ds-spinner--brand" role="status" aria-label="Cargando ${esc(TITLES[id])}"></div></div>`;
    if (view.state === 'error' && ERROR_CARDS.includes(id) && !view.retried.includes(id)) {
      return `${headOnly(id)}<div class="ds-alert ds-alert--error ha-alert" role="alert"><div class="ha-alert__body"><span class="ha-alert__ico">${ICON.alertError}</span>
        <p class="ds-alert__body ha-alert__txt">No se pudo cargar esta información. El resto del Inicio está actualizado.</p></div>
        <div class="ha-alert__action"><button type="button" class="ds-btn ds-btn--tertiary ds-btn--md ha-btn" data-retry="${id}">Reintentar</button></div></div>`;
    }
    if (view.state === 'empty' && EMPTY[id]) {
      const [icon, title, text, action, add] = EMPTY[id];
      return `${head(id)}<div class="ha-empty"><span class="ha-empty__ico">${ICON[icon]}</span>
        <p class="ha-empty__txt"><b>${esc(title)}</b><span>${esc(text)}</span></p>
        <button type="button" class="ds-btn ds-btn--secondary ds-btn--md ha-btn${add ? ' ha-btn--icon' : ''}" data-act="${esc(action)}">${add ? ICON.add20 : ''}${esc(action)}</button></div>`;
    }
    return RENDER[id]();
  }

  /* ======================= Mampostería (NewCardMasonry: 300 mínimo, separación 16, tarjeta i a la columna i mod n) ======================= */
  const MIN_COL = 300;
  const GAP = 16;
  const grid = $('#haGrid');
  const els = {};
  let cols = 0;
  const visible = () => ORDER.filter((id) => ROLE_CARDS[view.role].includes(id));
  function paintCard(id) {
    if (!els[id]) {
      els[id] = document.createElement('section');
      els[id].className = 'ds-card ha-card';
      els[id].setAttribute('aria-label', TITLES[id]);
    }
    els[id].setAttribute('aria-busy', String(view.state === 'loading'));
    els[id].innerHTML = cardHTML(id);
    els[id].classList.toggle('is-empty', !!els[id].querySelector('.ha-empty'));
  }
  function layout(force) {
    const w = grid.getBoundingClientRect().width;
    const n = Math.max(1, Math.floor((w + GAP) / (MIN_COL + GAP)));
    if (n === cols && !force) return;
    cols = n;
    const columns = Array.from({ length: n }, () => {
      const c = document.createElement('div');
      c.className = 'ha-col';
      c.style.width = `calc((100% - ${GAP * (n - 1)}px) / ${n})`;
      return c;
    });
    visible().forEach((id, i) => columns[i % n].appendChild(els[id]));
    grid.replaceChildren(...columns);
  }
  function renderAll() {
    const list = visible();
    list.forEach(paintCard);
    layout(true);
    /* ROLE_NOTE_TEXT: solo con 1 o 2 tarjetas */
    const note = $('#haRoleNote');
    note.hidden = list.length > 2;
    note.textContent = `Tu rol tiene acceso a ${list.map((id) => TITLES[id]).join(', ')}. Si necesitas otro módulo, pídeselo al administrador de tu cuenta.`;
  }
  if ('ResizeObserver' in window) new ResizeObserver(() => layout()).observe(grid);
  else addEventListener('resize', () => layout());

  /* ======================= Toast (design-system/Toast): 5 s ======================= */
  function toast(kind, title, text) {
    const t = document.createElement('div');
    t.className = `ds-toast ds-toast--${kind === 'info' ? 'info' : 'success'}`;
    t.setAttribute('role', 'status');
    t.innerHTML = `<span class="ds-toast__icon">${kind === 'info' ? ICON.toastInfo : ICON.toastSuccess}</span>
      <div class="ds-toast__body-wrap"><p class="ds-toast__title">${esc(title)}</p><p class="ds-toast__body">${esc(text)}</p></div>
      <button type="button" class="ds-toast__close" aria-label="Cerrar aviso">${ICON.close}</button><span class="ds-toast__timer" aria-hidden="true"></span>`;
    t.querySelector('.ds-toast__close').addEventListener('click', () => t.remove());
    const root = $('#haToasts');
    root.prepend(t);
    setTimeout(() => t.remove(), 5000);
    while (root.children.length > 3) root.lastChild.remove();
  }

  /* ======================= Interacciones de las tarjetas ======================= */
  grid.addEventListener('click', (e) => {
    const metal = e.target.closest('[data-metal]');
    if (metal) {
      if (view.metal === metal.dataset.metal) return;
      view.metal = metal.dataset.metal;
      paintCard('tabulators');
      $(`[data-metal="${view.metal}"]`, els.tabulators).focus();
      return;
    }
    const ext = e.target.closest('[data-ext]');
    if (ext) {
      view.createdExt.push(ext.dataset.ext);
      paintCard('extensions');
      toast('success', 'Extensión creada', `El plazo ${ext.dataset.ext} ya tiene extensión activa.`);
      return;
    }
    const retry = e.target.closest('[data-retry]');
    if (retry) {
      view.retried.push(retry.dataset.retry);
      paintCard(retry.dataset.retry);
      return;
    }
    const go = e.target.closest('[data-go]');
    if (go) { e.preventDefault(); toast('info', 'Navegación simulada', `Aquí se abre ${go.dataset.go}.`); return; }
    const act = e.target.closest('[data-act]');
    if (act) {
      e.preventDefault();
      const ctx = act.dataset.ctx ? ` · ${act.dataset.ctx}` : '';
      toast('info', act.dataset.act, `Aquí se abre el flujo "${act.dataset.act}"${ctx}.`);
    }
  });

  /* ======================= Panel "Revisión" ======================= */
  const chips = (root, options, key) => {
    root.innerHTML = options.map(([id, label]) => `<button type="button" class="ds-chip ds-chip--choice ha-choice${view[key] === id ? ' ds-chip--on' : ''}" data-id="${id}" aria-pressed="${view[key] === id}">${esc(label)}</button>`).join('');
    root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-id]');
      if (!b) return;
      view[key] = b.dataset.id;
      root.querySelectorAll('[data-id]').forEach((x) => { x.setAttribute('aria-pressed', String(x === b)); x.classList.toggle('ds-chip--on', x === b); });
      if (key === 'state') { view.retried = []; view.createdExt = []; }
      if (key === 'balance') { if (els.billing && visible().includes('billing')) paintCard('billing'); return; }
      renderAll();
    });
  };

  /* Primera entrada (viene del registro por invitación): estado "Cuenta nueva" */
  const params = new URLSearchParams(location.search);
  if (params.get('nueva') === '1') {
    view.state = 'empty';
    try { history.replaceState(null, '', location.pathname + location.hash); } catch (e) { /* vista de archivo local */ }
  }
  chips($('#haStates'), STATES, 'state');
  chips($('#haRoles'), ROLES, 'role');
  chips($('#haBalances'), BALANCES, 'balance');
  renderAll();
})();
