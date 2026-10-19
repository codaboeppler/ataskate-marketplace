/* Inicio del Administrativo (Home Admin) · HU-CP-400-F · rama del equipo, commit 1589eda61
   "feat: (HU-CP-400-F) Home Admin aligned with the Inicio operativo" (el repo del equipo).
   Reconstrucción estática de src/components/Home/Admin/NewAdminHome/** (NewAdminHomeView, HomeCardsRegistry,
   las 14 tarjetas, NewCard*, emptyStates, EmptyStateGhosts, chartColors, attention.utils, homeCards.utils)
   y de su vista previa src/components/PosPreview/HomeAdmin/** (/design-system/preview/home-admin).
   Reutiliza las piezas y el CSS del Inicio operativo de Product Design (../inicio-operativo/: io-card, io-lista, io-pie,
   io-tabla, io-panel, io-sk, io-err, io-toast, io-proto), que es la referencia de diseño del commit.
   Perfil y estado: panel "Estados de la maqueta" (../demo.js) o URL ?perfil=dueno|gerente&estado=datos|vacio|cargando|error.
   ?nueva=1 (llega del registro por invitación) entra en "Cuenta nueva". Sin latencia simulada: "Cargando" solo por el panel o la URL. */
(() => {
  'use strict';
  /* Íconos del DS (src/design-system/Icons/Icons.tsx de la misma rama), con fill currentColor */
  const ICO = {
    ArrowForward: ["0 0 24 24", "<path d=\"M12 20L10.575 18.6L16.175 13H4V11H16.175L10.575 5.4L12 4L20 12L12 20Z\" fill=\"currentColor\" />"],
    Add: ["0 0 24 24", "<path d=\"M11 19V13H5V11H11V5H13V11H19V13H13V19H11Z\" fill=\"currentColor\" />"],
    Sync: ["0 0 24 24", "<path d=\"M4 20V18H6.75L6.35 17.65C5.48333 16.8833 4.875 16.0083 4.525 15.025C4.175 14.0417 4 13.05 4 12.05C4 10.2 4.554 8.554 5.662 7.112C6.77067 5.67067 8.21667 4.71667 10 4.25V6.35C8.8 6.78333 7.83333 7.52067 7.1 8.562C6.36667 9.604 6 10.7667 6 12.05C6 12.8 6.14167 13.529 6.425 14.237C6.70833 14.9457 7.15 15.6 7.75 16.2L8 16.45V14H10V20H4ZM14 19.75V17.65C15.2 17.2167 16.1667 16.4793 16.9 15.438C17.6333 14.396 18 13.2333 18 11.95C18 11.2 17.8583 10.4707 17.575 9.762C17.2917 9.054 16.85 8.4 16.25 7.8L16 7.55V10H14V4H20V6H17.25L17.65 6.35C18.4667 7.16667 19.0627 8.054 19.438 9.012C19.8127 9.97067 20 10.95 20 11.95C20 13.8 19.4457 15.4457 18.337 16.887C17.229 18.329 15.7833 19.2833 14 19.75Z\" fill=\"currentColor\" />"],
    EstadosError: ["48 156 24 24", "<path d=\"M60 178C58.6167 178 57.3167 177.737 56.1 177.212C54.8833 176.687 53.825 175.975 52.925 175.075C52.025 174.175 51.3127 173.117 50.788 171.9C50.2627 170.683 50 169.383 50 168C50 166.617 50.2627 165.317 50.788 164.1C51.3127 162.883 52.025 161.825 52.925 160.925C53.825 160.025 54.8833 159.312 56.1 158.787C57.3167 158.262 58.6167 158 60 158C61.3833 158 62.6833 158.262 63.9 158.787C65.1167 159.312 66.175 160.025 67.075 160.925C67.975 161.825 68.6873 162.883 69.212 164.1C69.7373 165.317 70 166.617 70 168C70 169.383 69.7373 170.683 69.212 171.9C68.6873 173.117 67.975 174.175 67.075 175.075C66.175 175.975 65.1167 176.687 63.9 177.212C62.6833 177.737 61.3833 178 60 178ZM56.4 173L60 169.4L63.6 173L65 171.6L61.4 168L65 164.4L63.6 163L60 166.6L56.4 163L55 164.4L58.6 168L55 171.6L56.4 173Z\" fill=\"currentColor\" />"],
    EstadosSuccess: ["96 156 24 24", "<path d=\"M108 178C106.617 178 105.317 177.737 104.1 177.212C102.883 176.687 101.825 175.975 100.925 175.075C100.025 174.175 99.3127 173.117 98.788 171.9C98.2627 170.683 98 169.383 98 168C98 166.617 98.2627 165.317 98.788 164.1C99.3127 162.883 100.025 161.825 100.925 160.925C101.825 160.025 102.883 159.312 104.1 158.787C105.317 158.262 106.617 158 108 158C109.383 158 110.683 158.262 111.9 158.787C113.117 159.312 114.175 160.025 115.075 160.925C115.975 161.825 116.687 162.883 117.212 164.1C117.737 165.317 118 166.617 118 168C118 169.383 117.737 170.683 117.212 171.9C116.687 173.117 115.975 174.175 115.075 175.075C114.175 175.975 113.117 176.687 111.9 177.212C110.683 177.737 109.383 178 108 178ZM106.6 172.6L113.65 165.55L112.25 164.15L106.6 169.8L103.75 166.95L102.35 168.35L106.6 172.6Z\" fill=\"currentColor\" />"],
    Colors: ["0 0 24 24", "<path d=\"M8.65 20.5L2.5 14.35C2.33333 14.1833 2.20833 14 2.125 13.8C2.04167 13.6 2 13.3917 2 13.175C2 12.9583 2.04167 12.75 2.125 12.55C2.20833 12.35 2.33333 12.1667 2.5 12L8.25 6.275L5.6 3.625L7.15 2L17.15 12C17.3167 12.1667 17.4375 12.35 17.5125 12.55C17.5875 12.75 17.625 12.9583 17.625 13.175C17.625 13.3917 17.5875 13.6 17.5125 13.8C17.4375 14 17.3167 14.1833 17.15 14.35L11 20.5C10.8333 20.6667 10.65 20.7917 10.45 20.875C10.25 20.9583 10.0417 21 9.825 21C9.60833 21 9.4 20.9583 9.2 20.875C9 20.7917 8.81667 20.6667 8.65 20.5ZM9.825 7.85L4.475 13.2H15.175L9.825 7.85ZM19.8 21C19.2 21 18.6917 20.7875 18.275 20.3625C17.8583 19.9375 17.65 19.4167 17.65 18.8C17.65 18.35 17.7625 17.925 17.9875 17.525C18.2125 17.125 18.4667 16.7333 18.75 16.35L19.8 15L20.9 16.35C21.1667 16.7333 21.4167 17.125 21.65 17.525C21.8833 17.925 22 18.35 22 18.8C22 19.4167 21.7833 19.9375 21.35 20.3625C20.9167 20.7875 20.4 21 19.8 21Z\" fill=\"currentColor\" />"],
    CalendarClock: ["0 0 24 24", "<path d=\"M5 8H19V6H5V8ZM5 22C4.45 22 3.97917 21.8042 3.5875 21.4125C3.19583 21.0208 3 20.55 3 20V6C3 5.45 3.19583 4.97917 3.5875 4.5875C3.97917 4.19583 4.45 4 5 4H6V2H8V4H16V2H18V4H19C19.55 4 20.0208 4.19583 20.4125 4.5875C20.8042 4.97917 21 5.45 21 6V11.675C20.6833 11.525 20.3583 11.4 20.025 11.3C19.6917 11.2 19.35 11.125 19 11.075V10H5V20H11.3C11.4167 20.3667 11.5542 20.7167 11.7125 21.05C11.8708 21.3833 12.0583 21.7 12.275 22H5ZM18 23C16.6167 23 15.4375 22.5125 14.4625 21.5375C13.4875 20.5625 13 19.3833 13 18C13 16.6167 13.4875 15.4375 14.4625 14.4625C15.4375 13.4875 16.6167 13 18 13C19.3833 13 20.5625 13.4875 21.5375 14.4625C22.5125 15.4375 23 16.6167 23 18C23 19.3833 22.5125 20.5625 21.5375 21.5375C20.5625 22.5125 19.3833 23 18 23ZM19.675 20.375L20.375 19.675L18.5 17.8V15H17.5V18.2L19.675 20.375Z\" fill=\"currentColor\" />"],
    Reactivate: ["0 0 24 24", "<path d=\"M11 21.9498C9.73333 21.8165 8.55433 21.4708 7.463 20.9128C6.371 20.3541 5.421 19.6288 4.613 18.7368C3.80433 17.8455 3.16667 16.8248 2.7 15.6748C2.23333 14.5248 2 13.2998 2 11.9998C2 10.4831 2.30433 9.08314 2.913 7.7998C3.521 6.51647 4.35 5.41647 5.4 4.4998H3V2.4998H9V8.4998H7V5.7748C6.08333 6.50814 5.354 7.41247 4.812 8.4878C4.27067 9.56247 4 10.7331 4 11.9998C4 14.0498 4.671 15.8205 6.013 17.3118C7.35433 18.8038 9.01667 19.6748 11 19.9248V21.9498ZM10.575 16.5998L6.35 12.3498L7.75 10.9498L10.575 13.7748L16.25 8.0998L17.65 9.5248L10.575 16.5998ZM15 21.4998V15.4998H17V18.2248C17.9167 17.4748 18.646 16.5665 19.188 15.4998C19.7293 14.4331 20 13.2665 20 11.9998C20 9.9498 19.3293 8.1788 17.988 6.6868C16.646 5.19547 14.9833 4.3248 13 4.0748V2.0498C15.5333 2.2998 17.6667 3.36647 19.4 5.2498C21.1333 7.13314 22 9.38314 22 11.9998C22 13.5165 21.6957 14.9165 21.087 16.1998C20.479 17.4831 19.65 18.5831 18.6 19.4998H21V21.4998H15Z\" fill=\"currentColor\" />"],
    DesktopWindowsV2: ["1433 260 24 24", "<path d=\"M1441.8 280.5V279H1443.8V277H1437.61C1437.1 277 1436.67 276.825 1436.32 276.475C1435.97 276.125 1435.8 275.697 1435.8 275.192V265.308C1435.8 264.803 1435.97 264.375 1436.32 264.025C1436.67 263.675 1437.1 263.5 1437.61 263.5H1452.99C1453.5 263.5 1453.92 263.675 1454.27 264.025C1454.62 264.375 1454.8 264.803 1454.8 265.308V275.192C1454.8 275.697 1454.62 276.125 1454.27 276.475C1453.92 276.825 1453.5 277 1452.99 277H1446.8V279H1448.8V280.5H1441.8ZM1437.61 275.5H1452.99C1453.07 275.5 1453.14 275.468 1453.2 275.404C1453.27 275.34 1453.3 275.269 1453.3 275.192V265.308C1453.3 265.231 1453.27 265.16 1453.2 265.096C1453.14 265.032 1453.07 265 1452.99 265H1437.61C1437.53 265 1437.46 265.032 1437.4 265.096C1437.33 265.16 1437.3 265.231 1437.3 265.308V275.192C1437.3 275.269 1437.33 275.34 1437.4 275.404C1437.46 275.468 1437.53 275.5 1437.61 275.5Z\" fill=\"currentColor\" />"],
    CreditCardClock: ["0 0 24 24", "<path d=\"M3.99982 18.001V10.001V10.326V6.00098V18.001ZM3.99982 8.00098H19.9998V6.00098H3.99982V8.00098ZM11.6748 20.001H3.99982C3.44982 20.001 2.97898 19.8051 2.58732 19.4135C2.19565 19.0218 1.99982 18.551 1.99982 18.001V6.00098C1.99982 5.45098 2.19565 4.98014 2.58732 4.58848C2.97898 4.19681 3.44982 4.00098 3.99982 4.00098H19.9998C20.5498 4.00098 21.0207 4.19681 21.4123 4.58848C21.804 4.98014 21.9998 5.45098 21.9998 6.00098V11.251C21.3998 10.8343 20.7498 10.5218 20.0498 10.3135C19.3498 10.1051 18.6332 10.001 17.8998 10.001C16.9998 10.001 16.1332 10.176 15.2998 10.526C14.4665 10.876 13.7332 11.3676 13.0998 12.001H3.99982V18.001H11.0748C11.1248 18.351 11.1998 18.6926 11.2998 19.026C11.3998 19.3593 11.5248 19.6843 11.6748 20.001ZM19.6748 19.376L20.3748 18.676L18.4998 16.801V14.001H17.4998V17.201L19.6748 19.376ZM18.0248 22.001C16.6248 22.001 15.4373 21.5176 14.4623 20.551C13.4873 19.5843 12.9998 18.401 12.9998 17.001C12.9998 15.601 13.4873 14.4176 14.4623 13.451C15.4373 12.4843 16.6248 12.001 18.0248 12.001C19.4081 12.001 20.5832 12.4885 21.5498 13.4635C22.5165 14.4385 22.9998 15.6176 22.9998 17.001C22.9998 18.3843 22.5165 19.5635 21.5498 20.5385C20.5832 21.5135 19.4081 22.001 18.0248 22.001Z\" fill=\"currentColor\" />"],
    Group: ["0 0 24 24", "<path d=\"M1 20V17.2C1 16.6333 1.146 16.1123 1.438 15.637C1.72933 15.1623 2.11667 14.8 2.6 14.55C3.63333 14.0333 4.68333 13.6457 5.75 13.387C6.81667 13.129 7.9 13 9 13C10.1 13 11.1833 13.129 12.25 13.387C13.3167 13.6457 14.3667 14.0333 15.4 14.55C15.8833 14.8 16.2707 15.1623 16.562 15.637C16.854 16.1123 17 16.6333 17 17.2V20H1ZM19 20V17C19 16.2667 18.796 15.5623 18.388 14.887C17.9793 14.2123 17.4 13.6333 16.65 13.15C17.5 13.25 18.3 13.4207 19.05 13.662C19.8 13.904 20.5 14.2 21.15 14.55C21.75 14.8833 22.2083 15.254 22.525 15.662C22.8417 16.0707 23 16.5167 23 17V20H19ZM9 12C7.9 12 6.95833 11.6083 6.175 10.825C5.39167 10.0417 5 9.1 5 8C5 6.9 5.39167 5.95833 6.175 5.175C6.95833 4.39167 7.9 4 9 4C10.1 4 11.0417 4.39167 11.825 5.175C12.6083 5.95833 13 6.9 13 8C13 9.1 12.6083 10.0417 11.825 10.825C11.0417 11.6083 10.1 12 9 12ZM15 12C14.8167 12 14.5833 11.9793 14.3 11.938C14.0167 11.896 13.7833 11.85 13.6 11.8C14.05 11.2667 14.3957 10.675 14.637 10.025C14.879 9.375 15 8.7 15 8C15 7.3 14.879 6.625 14.637 5.975C14.3957 5.325 14.05 4.73333 13.6 4.2C13.8333 4.11667 14.0667 4.06233 14.3 4.037C14.5333 4.01233 14.7667 4 15 4C16.1 4 17.0417 4.39167 17.825 5.175C18.6083 5.95833 19 6.9 19 8C19 9.1 18.6083 10.0417 17.825 10.825C17.0417 11.6083 16.1 12 15 12ZM3 18H15V17.2C15 17.0167 14.9543 16.85 14.863 16.7C14.771 16.55 14.65 16.4333 14.5 16.35C13.6 15.9 12.6917 15.5623 11.775 15.337C10.8583 15.1123 9.93333 15 9 15C8.06667 15 7.14167 15.1123 6.225 15.337C5.30833 15.5623 4.4 15.9 3.5 16.35C3.35 16.4333 3.22933 16.55 3.138 16.7C3.046 16.85 3 17.0167 3 17.2V18ZM9 10C9.55 10 10.021 9.804 10.413 9.412C10.8043 9.02067 11 8.55 11 8C11 7.45 10.8043 6.97933 10.413 6.588C10.021 6.196 9.55 6 9 6C8.45 6 7.97933 6.196 7.588 6.588C7.196 6.97933 7 7.45 7 8C7 8.55 7.196 9.02067 7.588 9.412C7.97933 9.804 8.45 10 9 10Z\" fill=\"currentColor\" />"],
    Shelves: ["0 0 24 24", "<path d=\"M3 23V1H5V3H19V1H21V23H19V21H5V23H3ZM5 11H7V7H13V11H19V5H5V11ZM5 19H11V15H17V19H19V13H5V19ZM9 11H11V9H9V11ZM13 19H15V17H13V19Z\" fill=\"currentColor\" />"],
    PinDrop: ["0 0 24 24", "<path d=\"M12 16.475C13.65 15.1417 14.896 13.8583 15.738 12.625C16.5793 11.3917 17 10.2333 17 9.15C17 8.21667 16.8293 7.42067 16.488 6.762C16.146 6.104 15.725 5.57067 15.225 5.162C14.725 4.754 14.1833 4.45833 13.6 4.275C13.0167 4.09167 12.4833 4 12 4C11.5167 4 10.9833 4.09167 10.4 4.275C9.81667 4.45833 9.275 4.754 8.775 5.162C8.275 5.57067 7.85433 6.104 7.513 6.762C7.171 7.42067 7 8.21667 7 9.15C7 10.2333 7.42067 11.3917 8.262 12.625C9.104 13.8583 10.35 15.1417 12 16.475ZM12 19C9.65 17.2667 7.89567 15.5833 6.737 13.95C5.579 12.3167 5 10.7167 5 9.15C5 7.96667 5.21267 6.929 5.638 6.037C6.06267 5.14567 6.60833 4.4 7.275 3.8C7.94167 3.2 8.69167 2.75 9.525 2.45C10.3583 2.15 11.1833 2 12 2C12.8167 2 13.6417 2.15 14.475 2.45C15.3083 2.75 16.0583 3.2 16.725 3.8C17.3917 4.4 17.9377 5.14567 18.363 6.037C18.7877 6.929 19 7.96667 19 9.15C19 10.7167 18.4207 12.3167 17.262 13.95C16.104 15.5833 14.35 17.2667 12 19ZM12 11C12.55 11 13.021 10.804 13.413 10.412C13.8043 10.0207 14 9.55 14 9C14 8.45 13.8043 7.979 13.413 7.587C13.021 7.19567 12.55 7 12 7C11.45 7 10.9793 7.19567 10.588 7.587C10.196 7.979 10 8.45 10 9C10 9.55 10.196 10.0207 10.588 10.412C10.9793 10.804 11.45 11 12 11ZM5 22V20H19V22H5Z\" fill=\"currentColor\" />"],
    Table: ["0 0 24 24", "<path d=\"M9 21C8.45 21 7.97933 20.8043 7.588 20.413C7.196 20.021 7 19.55 7 19V9C7 8.45 7.196 7.979 7.588 7.587C7.97933 7.19567 8.45 7 9 7H19C19.55 7 20.021 7.19567 20.413 7.587C20.8043 7.979 21 8.45 21 9V19C21 19.55 20.8043 20.021 20.413 20.413C20.021 20.8043 19.55 21 19 21H9ZM9 11H19V9H9V11ZM13 15H15V13H13V15ZM13 19H15V17H13V19ZM9 15H11V13H9V15ZM17 15H19V13H17V15ZM9 19H11V17H9V19ZM17 19H19V17H17V19ZM5 17C4.45 17 3.979 16.8043 3.587 16.413C3.19567 16.021 3 15.55 3 15V5C3 4.45 3.19567 3.979 3.587 3.587C3.979 3.19567 4.45 3 5 3H15C15.55 3 16.021 3.19567 16.413 3.587C16.8043 3.979 17 4.45 17 5V6H15V5H5V15H6V17H5Z\" fill=\"currentColor\" />"],
    CarTag: ["0 0 24 24", "<path d=\"M6.50012 16C6.91679 16 7.27096 15.8542 7.56262 15.5625C7.85429 15.2708 8.00012 14.9167 8.00012 14.5C8.00012 14.0833 7.85429 13.7292 7.56262 13.4375C7.27096 13.1458 6.91679 13 6.50012 13C6.08346 13 5.72929 13.1458 5.43762 13.4375C5.14596 13.7292 5.00012 14.0833 5.00012 14.5C5.00012 14.9167 5.14596 15.2708 5.43762 15.5625C5.72929 15.8542 6.08346 16 6.50012 16ZM15.5001 16C15.8335 16 16.1335 15.9 16.4001 15.7C16.6668 15.5 16.8418 15.2417 16.9251 14.925C16.5918 14.8583 16.2751 14.7458 15.9751 14.5875C15.6751 14.4292 15.4001 14.225 15.1501 13.975L14.5251 13.35C14.3585 13.4833 14.2293 13.65 14.1376 13.85C14.046 14.05 14.0001 14.2667 14.0001 14.5C14.0001 14.9167 14.146 15.2708 14.4376 15.5625C14.7293 15.8542 15.0835 16 15.5001 16ZM5.00012 19V20C5.00012 20.2833 4.90429 20.5208 4.71262 20.7125C4.52096 20.9042 4.28346 21 4.00012 21H3.00012C2.71679 21 2.47929 20.9042 2.28762 20.7125C2.09596 20.5208 2.00012 20.2833 2.00012 20V12L4.10012 6C4.20012 5.7 4.37929 5.45833 4.63762 5.275C4.89596 5.09167 5.18346 5 5.50012 5H9.00012V6.375C9.00012 6.475 9.00429 6.57917 9.01262 6.6875C9.02096 6.79583 9.03346 6.9 9.05012 7H5.85012L4.80012 10H11.1751L13.1751 12H4.00012V17H18.0001V14.975C18.3668 14.9417 18.721 14.85 19.0626 14.7C19.4043 14.55 19.7168 14.3417 20.0001 14.075V20C20.0001 20.2833 19.9043 20.5208 19.7126 20.7125C19.521 20.9042 19.2835 21 19.0001 21H18.0001C17.7168 21 17.4793 20.9042 17.2876 20.7125C17.096 20.5208 17.0001 20.2833 17.0001 20V19H5.00012ZM15.0001 6C15.2835 6 15.521 5.90417 15.7126 5.7125C15.9043 5.52083 16.0001 5.28333 16.0001 5C16.0001 4.71667 15.9043 4.47917 15.7126 4.2875C15.521 4.09583 15.2835 4 15.0001 4C14.7168 4 14.4793 4.09583 14.2876 4.2875C14.096 4.47917 14.0001 4.71667 14.0001 5C14.0001 5.28333 14.096 5.52083 14.2876 5.7125C14.4793 5.90417 14.7168 6 15.0001 6ZM16.5501 12.55L11.4501 7.45C11.3168 7.31667 11.2085 7.15417 11.1251 6.9625C11.0418 6.77083 11.0001 6.575 11.0001 6.375V2.5C11.0001 2.08333 11.146 1.72917 11.4376 1.4375C11.7293 1.14583 12.0835 1 12.5001 1H16.3751C16.5751 1 16.771 1.04167 16.9626 1.125C17.1543 1.20833 17.3168 1.31667 17.4501 1.45L22.5501 6.55C22.8335 6.83333 22.9751 7.1875 22.9751 7.6125C22.9751 8.0375 22.8335 8.39167 22.5501 8.675L18.6751 12.55C18.3918 12.8333 18.0376 12.975 17.6126 12.975C17.1876 12.975 16.8335 12.8333 16.5501 12.55ZM17.6251 10.8L20.8001 7.625L16.1751 3H13.0001V6.175L17.6251 10.8Z\" fill=\"currentColor\" />"],
    Loyalty: ["0 0 24 24", "<path d=\"M13 17.5L16.5 14C16.6833 13.8167 16.8292 13.6 16.9375 13.35C17.0458 13.1 17.1 12.8333 17.1 12.55C17.1 11.9833 16.9 11.5 16.5 11.1C16.1 10.7 15.6167 10.5 15.05 10.5C14.7333 10.5 14.4208 10.5917 14.1125 10.775C13.8042 10.9583 13.4333 11.2667 13 11.7C12.5 11.2333 12.1083 10.9167 11.825 10.75C11.5417 10.5833 11.25 10.5 10.95 10.5C10.3833 10.5 9.9 10.7 9.5 11.1C9.1 11.5 8.9 11.9833 8.9 12.55C8.9 12.8333 8.95417 13.1 9.0625 13.35C9.17083 13.6 9.31667 13.8167 9.5 14L13 17.5ZM14.25 21.4C13.8667 21.7833 13.3917 21.975 12.825 21.975C12.2583 21.975 11.7833 21.7833 11.4 21.4L2.6 12.6C2.41667 12.4167 2.27083 12.2 2.1625 11.95C2.05417 11.7 2 11.4333 2 11.15V4C2 3.45 2.19583 2.97917 2.5875 2.5875C2.97917 2.19583 3.45 2 4 2H11.15C11.4333 2 11.7 2.05417 11.95 2.1625C12.2 2.27083 12.4167 2.41667 12.6 2.6L21.4 11.425C21.7833 11.8083 21.975 12.2792 21.975 12.8375C21.975 13.3958 21.7833 13.8667 21.4 14.25L14.25 21.4ZM12.825 20L19.975 12.85L11.15 4H4V11.15L12.825 20ZM6.5 8C6.91667 8 7.27083 7.85417 7.5625 7.5625C7.85417 7.27083 8 6.91667 8 6.5C8 6.08333 7.85417 5.72917 7.5625 5.4375C7.27083 5.14583 6.91667 5 6.5 5C6.08333 5 5.72917 5.14583 5.4375 5.4375C5.14583 5.72917 5 6.08333 5 6.5C5 6.91667 5.14583 7.27083 5.4375 7.5625C5.72917 7.85417 6.08333 8 6.5 8Z\" fill=\"currentColor\" />"],
    LocalShipping: ["0 0 24 24", "<path d=\"M6 20C5.16667 20 4.45833 19.7083 3.875 19.125C3.29167 18.5417 3 17.8333 3 17H1V6C1 5.45 1.196 4.97933 1.588 4.588C1.97933 4.196 2.45 4 3 4H17V8H20L23 12V17H21C21 17.8333 20.7083 18.5417 20.125 19.125C19.5417 19.7083 18.8333 20 18 20C17.1667 20 16.4583 19.7083 15.875 19.125C15.2917 18.5417 15 17.8333 15 17H9C9 17.8333 8.70833 18.5417 8.125 19.125C7.54167 19.7083 6.83333 20 6 20ZM6 18C6.28333 18 6.521 17.904 6.713 17.712C6.90433 17.5207 7 17.2833 7 17C7 16.7167 6.90433 16.4793 6.713 16.288C6.521 16.096 6.28333 16 6 16C5.71667 16 5.479 16.096 5.287 16.288C5.09567 16.4793 5 16.7167 5 17C5 17.2833 5.09567 17.5207 5.287 17.712C5.479 17.904 5.71667 18 6 18ZM3 15H3.8C4.08333 14.7 4.40833 14.4583 4.775 14.275C5.14167 14.0917 5.55 14 6 14C6.45 14 6.85833 14.0917 7.225 14.275C7.59167 14.4583 7.91667 14.7 8.2 15H15V6H3V15ZM18 18C18.2833 18 18.5207 17.904 18.712 17.712C18.904 17.5207 19 17.2833 19 17C19 16.7167 18.904 16.4793 18.712 16.288C18.5207 16.096 18.2833 16 18 16C17.7167 16 17.4793 16.096 17.288 16.288C17.096 16.4793 17 16.7167 17 17C17 17.2833 17.096 17.5207 17.288 17.712C17.4793 17.904 17.7167 18 18 18ZM17 13H21.25L19 10H17V13Z\" fill=\"currentColor\" />"],
    BarChart: ["0 0 24 24", "<path d=\"M16 20V13H20V20H16ZM10 20V4H14V20H10ZM4 20V9H8V20H4Z\" fill=\"currentColor\" />"],
  };
  const ico = (n, s = 24) => '<svg viewBox="' + ICO[n][0] + '" width="' + s + '" height="' + s + '" fill="none" aria-hidden="true" focusable="false">' + ICO[n][1] + '</svg>';
  const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  /* currencyFormat de src/components/CashFlow/constants.tsx y formatAmount de NewAdminHome/constants.ts */
  const money = (n) => '$' + Math.abs(n).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  const fmtAmount = (n) => (n < 0 ? '-' : '') + money(n);
  const num = (n) => Number(n).toLocaleString('es-MX');

  /* ---------- Tarjetas (HOME_CARD_IDS, HOME_CARD_ORDER y HOME_CARD_COLUMNS de constants.ts) ---------- */
  const ID = {
    ATTENTION: 'attention', BILLING: 'billing', USERS: 'users', MARKET: 'market', BRAND: 'brand', LOCATIONS: 'locations',
    LAYAWAYS: 'layaways', TERMS: 'terms', DEVICES: 'devices', TABULATORS: 'tabulators', CONSERVATION: 'conservation',
    EXTENSIONS: 'extensions', PROMOTIONS: 'promotions', ADDONS: 'addons',
  };
  /* orden de lectura del Figma de Caro (Home Admin 18764:17012) */
  const ORDER = [ID.ATTENTION, ID.BILLING, ID.USERS, ID.MARKET, ID.BRAND, ID.LOCATIONS, ID.EXTENSIONS, ID.TERMS, ID.DEVICES,
    ID.TABULATORS, ID.CONSERVATION, ID.LAYAWAYS, ID.PROMOTIONS, ID.ADDONS];
  /* columna fija de cada tarjeta, como el Inicio operativo: 0 pendientes y casa de empeño · 1 inventario, ventas y tienda · 2 negocio y configuración */
  const COLUMNS = [
    [ID.ATTENTION, ID.TERMS, ID.EXTENSIONS, ID.TABULATORS],
    [ID.MARKET, ID.CONSERVATION, ID.LAYAWAYS, ID.PROMOTIONS, ID.BRAND],
    [ID.BILLING, ID.USERS, ID.LOCATIONS, ID.DEVICES, ID.ADDONS],
  ];
  const COLUMN_COUNT = 3;

  /* ---------- Vista previa (homeAdminPreview.constants.ts) ---------- */
  const PROFILES = { dueno: 'Dueño (todos los módulos)', gerente: 'Gerente de sucursal' };
  const STATES = { datos: 'Con datos', vacio: 'Cuenta nueva', cargando: 'Cargando', error: 'Con error' };
  /* módulos por perfil (en producción los decide HomeAdmin/GetAllowDashboardAdmin) */
  const PROFILE_CARDS = {
    dueno: ORDER.filter((id) => id !== ID.ATTENTION),
    gerente: [ID.MARKET, ID.EXTENSIONS, ID.TERMS, ID.TABULATORS, ID.CONSERVATION, ID.LAYAWAYS, ID.PROMOTIONS],
  };
  /* con error fallan dos tarjetas y el resto se ve normal, como en el Inicio operativo */
  const ERROR_CARDS = [ID.BILLING, ID.MARKET];
  /* el gerente solo ve casa de empeño en el menú (HomeAdminPreviewMenu): del menú del prototipo quedan Plazos y Tabuladores */
  const MENU_GERENTE = ['inicio-admin', 'plazos', 'tabuladores', 'ayuda'];

  /* ---------- Colores de gráficas (chartColors.constants.ts) ---------- */
  const C = {
    BLUE: '--io-azul', LILA: '--io-lila', GREEN: '--io-verde', ORANGE: '--propuesta-ilustracion-rojo-300', LIME: '--io-lima',
    CYAN: '--io-cian', VIOLET: '--io-violeta', RED: '--io-rojo', AMBER: '--io-ambar', PENDING: '--ats-neutral-300', CYAN_LIGHT: '--ats-cyan-100',
  };
  const MONEY = [C.LILA, C.ORANGE, C.LIME, C.CYAN, C.VIOLET];
  const CATEGORY = [C.BLUE, C.LILA, C.GREEN, C.ORANGE];
  const moneyColor = (i) => MONEY[i % MONEY.length];
  const categoryColor = (i) => CATEGORY[i % CATEGORY.length];

  /* ---------- Datos de la vista previa (homeAdminPreview.data.ts) ---------- */
  const TABULATORS = {
    oro: { market: '$54,259.00 24K/oz', rows: [['22K', 43100], ['18K', 32330], ['14K', 24145], ['10K', 17987]] },
    plata: { market: '$612.00 .999/oz', rows: [['.999', 612], ['.950', 581.4], ['.925', 566.1], ['.900', 550.8]] },
  };
  const DATA = {
    [ID.BILLING]: {
      businessLines: [['Casa de empeño', 98720], ['Comercializadora', 45709]],
      commissions: [-3180, -599], netDeposit: 140650, nextPaymentDate: '25 Oct 2026', card: 'BBVA •••• 4471',
    },
    [ID.USERS]: { users: [['C', 'Carlos'], ['M', 'María'], ['J', 'Jorge']], totalUsers: 15 },
    [ID.MARKET]: { totalArticles: 1112, segments: [['Arriba del mercado', 42, C.RED], ['Debajo del mercado', 84, C.AMBER], ['Dentro del rango', 986, C.GREEN]] },
    [ID.BRAND]: {
      storeUrl: 'ataskate.com/empenos-fernandez', status: 'Publicada',
      warnings: [{ message: 'Banner principal sin imagen' }, { message: 'Página de contacto vacía' }],
    },
    [ID.LOCATIONS]: {
      stats: [['Sucursales', 14], ['Bodegas', 6], ['Grupos', 3]],
      groups: [['Regional Centro', 2, 6], ['Regional Norte', 2, 4], ['Regional Sur', 2, 4]],
    },
    [ID.LAYAWAYS]: {
      stats: [['Artículos apartables', 801], ['Vigentes', 3], ['Pausados', 1]],
      warnings: [{ message: '1 apartado sin vigencia' }, { message: '4 categorías sin apartados', dest: 'Nuevo apartado' }],
    },
    [ID.TERMS]: {
      stats: [['Categorías sin plazo', 8], ['Plazos inactivos', 9]],
      installments: [['Electrónicos', '30 días', '2.5% – 3.5%'], ['Juguetes', '45 días', '3.0% – 4.0%'], ['Herramientas', '60 días', '4.0% – 5.0%']],
    },
    [ID.DEVICES]: { stats: [['Con acceso', 112], ['Inactivos', 9]], warning: { message: '3 sucursales sin dispositivos' } },
    [ID.CONSERVATION]: { states: [['Excelente', 412, '90%'], ['Bueno', 286, '75%'], ['Regular', 98, '60%'], ['Malo', 0, null]] },
    [ID.EXTENSIONS]: { totalTerms: 9, withExtension: 6, expiringSoon: 1 },
    [ID.PROMOTIONS]: {
      campaigns: [['Buen Fin', 'Electrónicos +2 · hasta 30 nov', '-25%'], ['Black Friday', 'Juguetes +3 · hasta 28 nov', '-30%'], ['Cyber Monday', 'Tecnología +4 · hasta 1 dic', '-20%']],
    },
    [ID.ADDONS]: { addons: [['Módulo de envíos', 'LocalShipping'], ['Reportes avanzados', 'BarChart']] },
  };
  /* Cuenta nueva: todo lo configurable sale vacío; Facturación y Apps siempre tienen datos */
  const EMPTY_DATA = {
    ...DATA,
    [ID.USERS]: { users: [], totalUsers: 0 },
    [ID.MARKET]: { totalArticles: 0, segments: [] },
    [ID.BRAND]: { storeUrl: '', status: '', warnings: [] },
    [ID.LOCATIONS]: { stats: [], groups: [] },
    [ID.LAYAWAYS]: { stats: [], warnings: [] },
    [ID.TERMS]: { stats: [], installments: [] },
    [ID.DEVICES]: { stats: [] },
    [ID.CONSERVATION]: { states: [] },
    [ID.EXTENSIONS]: { totalTerms: 0, withExtension: 0, expiringSoon: 0 },
    [ID.PROMOTIONS]: { campaigns: [] },
  };

  /* ---------- A dónde lleva cada flecha: pantalla del prototipo si existe; si no, aviso "Abriría: …" (como el Inicio operativo) ---------- */
  const DEST = {
    [ID.BILLING]: { label: 'Facturación y suscripción' },
    [ID.USERS]: { href: '../empresa/#usuarios' },
    [ID.MARKET]: { label: 'Inventario del Administrativo' },
    [ID.BRAND]: { href: '../empresa/#tienda' },
    [ID.LOCATIONS]: { href: '../empresa/#ubicaciones' },
    [ID.EXTENSIONS]: { href: '../plazos/' },
    [ID.TERMS]: { href: '../plazos/' },
    [ID.DEVICES]: { label: 'Dispositivos' },
    [ID.TABULATORS]: { href: '../tabuladores/' },
    [ID.CONSERVATION]: { href: '../empresa/#catalogo-empenos' },
    [ID.LAYAWAYS]: { label: 'Apartados' },
  };

  /* ---------- Textos (constants.ts, extraCards.constants.ts y emptyStates.constants.ts) ---------- */
  const TITLES = {
    [ID.ATTENTION]: 'Requiere atención', [ID.BILLING]: 'Facturación y suscripción', [ID.USERS]: 'Usuarios',
    [ID.MARKET]: 'Precio de venta vs. mercado', [ID.BRAND]: 'Diseño de marca', [ID.LOCATIONS]: 'Ubicaciones',
    [ID.EXTENSIONS]: 'Extensiones', [ID.TERMS]: 'Plazos', [ID.DEVICES]: 'Dispositivos', [ID.TABULATORS]: 'Tabuladores',
    [ID.CONSERVATION]: 'Estados de conservación', [ID.LAYAWAYS]: 'Apartados', [ID.PROMOTIONS]: 'Promociones', [ID.ADDONS]: 'Apps disponibles',
  };
  const SKELETON = {
    [ID.ATTENTION]: 'table', [ID.BILLING]: 'kpi', [ID.USERS]: 'kpi', [ID.MARKET]: 'chart', [ID.BRAND]: 'table', [ID.LOCATIONS]: 'chart',
    [ID.EXTENSIONS]: 'kpi', [ID.TERMS]: 'table', [ID.DEVICES]: 'chart', [ID.TABULATORS]: 'table', [ID.CONSERVATION]: 'chart',
    [ID.LAYAWAYS]: 'kpi', [ID.PROMOTIONS]: 'table', [ID.ADDONS]: 'table',
  };
  const EMPTY = {
    [ID.ATTENTION]: { kind: 'positive', text: 'Todo al día. No hay pendientes por revisar.' },
    [ID.USERS]: { art: 'rows', icon: 'Group', text: 'Aún no hay usuarios en tu equipo.' },
    [ID.MARKET]: { art: 'donut', icon: 'Shelves', text: 'Sin artículos a la venta.' },
    [ID.BRAND]: { art: 'rows', icon: 'Colors', text: 'Aún no tienes tienda en línea.' },
    [ID.LOCATIONS]: { art: 'week', icon: 'PinDrop', text: 'Aún no tienes ubicaciones.' },
    [ID.EXTENSIONS]: { art: 'bars', icon: 'CalendarClock', text: 'Sin extensiones activas.' },
    [ID.TERMS]: { art: 'table', icon: 'Reactivate', text: 'Sin plazos configurados.' },
    [ID.DEVICES]: { art: 'donut', icon: 'DesktopWindowsV2', text: 'Sin dispositivos registrados.' },
    [ID.TABULATORS]: { art: 'table', icon: 'Table', text: 'Sin tabulador de metales.' },
    [ID.CONSERVATION]: { art: 'bars', icon: 'CarTag', text: 'Sin estados de conservación configurados.' },
    [ID.LAYAWAYS]: { art: 'rows', icon: 'CreditCardClock', text: 'Sin apartados configurados.' },
    [ID.PROMOTIONS]: { art: 'table', icon: 'Loyalty', text: 'Sin promociones activas.' },
  };
  const TX = {
    pageTitle: 'Inicio', detail: 'Ir a ', review: 'Revisar ', opens: 'Abriría: ',
    errorTitle: 'No pudimos cargar la información', errorText: 'Inténtalo de nuevo en unos segundos.', retry: 'Reintentar',
    roleNotePrefix: 'Tu rol tiene acceso a', roleNoteSuffix: 'Si necesitas otro módulo, pídeselo al administrador de tu cuenta.',
    loading: 'Cargando tarjetas del inicio', error: 'Algunas tarjetas no se pudieron cargar', retryDone: ' se cargó de nuevo',
  };
  const ROLE_NOTE_MAX = 2;

  /* ---------- Requiere atención (attention.utils.ts): junta los pendientes de cada módulo del rol ---------- */
  const splitCount = (message) => {
    const m = /^(\d+)\s+(.*)$/.exec(message);
    return m ? { label: m[2].charAt(0).toUpperCase() + m[2].slice(1), value: m[1] } : { label: message, value: '' };
  };
  const attentionRows = (data, allowed) => {
    const rows = [];
    (data[ID.BRAND].warnings || []).forEach((w) => rows.push({ ...splitCount(w.message), icon: 'Colors', card: ID.BRAND }));
    if (data[ID.EXTENSIONS].expiringSoon > 0) rows.push({ label: 'Extensiones por vencer', value: String(data[ID.EXTENSIONS].expiringSoon), icon: 'CalendarClock', card: ID.EXTENSIONS });
    const withoutTerm = Number((data[ID.TERMS].stats[0] || [])[1] || 0);
    if (withoutTerm > 0) rows.push({ label: 'Categorías sin plazo', value: String(withoutTerm), icon: 'Reactivate', card: ID.TERMS, dest: { href: '../plazos/' } });
    if (data[ID.DEVICES].warning) rows.push({ ...splitCount(data[ID.DEVICES].warning.message), icon: 'DesktopWindowsV2', card: ID.DEVICES });
    (data[ID.LAYAWAYS].warnings || []).forEach((w) => rows.push({ ...splitCount(w.message), icon: 'CreditCardClock', card: ID.LAYAWAYS, dest: w.dest ? { label: w.dest } : null }));
    return rows.filter((r) => allowed.includes(r.card));
  };

  /* ---------- Cuándo una tarjeta pinta su vacío (homeCards.utils.ts) ---------- */
  const IS_EMPTY = {
    [ID.ATTENTION]: (d, allowed) => attentionRows(d, allowed).length === 0,
    [ID.USERS]: (d) => !d[ID.USERS].totalUsers,
    [ID.MARKET]: (d) => !d[ID.MARKET].totalArticles,
    [ID.BRAND]: (d) => !d[ID.BRAND].storeUrl,
    [ID.LOCATIONS]: (d) => !d[ID.LOCATIONS].groups.length,
    [ID.EXTENSIONS]: (d) => !d[ID.EXTENSIONS].totalTerms,
    [ID.TERMS]: (d) => !d[ID.TERMS].installments.length,
    [ID.DEVICES]: (d) => !d[ID.DEVICES].stats.some((s) => Number(s[1]) > 0),
    [ID.TABULATORS]: (d) => !d[ID.TABULATORS].rows.length,
    [ID.CONSERVATION]: (d) => !d[ID.CONSERVATION].states.length,
    [ID.LAYAWAYS]: (d) => !d[ID.LAYAWAYS].stats.some((s) => Number(s[1]) > 0),
    [ID.PROMOTIONS]: (d) => !d[ID.PROMOTIONS].campaigns.length,
  };

  /* ---------- Piezas (NewCardBarLegend, NewCardList, NewCardDonut, NewCardColumns, NewCardStatsGrid, NewCardTable) ---------- */
  const dot = (c) => '<span class="io-dot" style="--c:var(' + c + ')"></span>';
  /* barra apilada proporcional (segmentos con valor > 0) y su lista con separadores debajo */
  const barLegend = (items, label) => '<div class="io-barra-ap" role="img" aria-label="' + esc(label) + '">'
    + items.filter((i) => i.value > 0).map((i) => '<span style="--c:var(' + i.color + ');flex:' + i.value + '"></span>').join('') + '</div>'
    + '<div class="io-lista">' + items.map((i) => '<div class="io-lista__f"><div class="io-lista__lbl"><span class="io-lista__lead">' + dot(i.color) + '</span><span class="io-t14">' + esc(i.label) + '</span></div>'
    + '<div class="io-lista__val"><span class="io-t14">' + esc(i.legend !== undefined ? i.legend : String(i.value)) + '</span></div></div>').join('') + '</div>';
  /* PieChart del DS (120, radios 52/42, separación de 3°), con el total al centro y la leyenda con anillo y porcentaje */
  const donut = (items, centerValue, centerLabel) => {
    const cx = 60, or = 52, ir = 42, GAP = 3;
    const total = items.reduce((s, i) => s + i.value, 0);
    const pt = (rad, deg) => { const a = ((deg - 90) * Math.PI) / 180; return [cx + rad * Math.cos(a), cx + rad * Math.sin(a)]; };
    const path = (s, e) => {
      const [sx, sy] = pt(or, s), [ex, ey] = pt(or, e), [six, siy] = pt(ir, s), [eix, eiy] = pt(ir, e), lg = e - s > 180 ? 1 : 0;
      return 'M ' + sx + ' ' + sy + ' A ' + or + ' ' + or + ' 0 ' + lg + ' 1 ' + ex + ' ' + ey + ' L ' + eix + ' ' + eiy + ' A ' + ir + ' ' + ir + ' 0 ' + lg + ' 0 ' + six + ' ' + siy + ' Z';
    };
    const nz = items.filter((i) => i.value > 0), half = nz.length > 1 ? GAP / 2 : 0;
    let cur = 0;
    const segs = nz.map((i) => { const ang = (i.value / total) * 360, s = cur + half, e = cur + ang - half; cur += ang; return '<path d="' + path(s, e) + '" style="fill:var(' + i.color + ')"/>'; }).join('');
    const ring = (c) => '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6C0 2.68629 2.68629 0 6 0C9.31371 0 12 2.68629 12 6ZM2.48911 6C2.48911 7.93901 4.06099 9.51089 6 9.51089C7.93901 9.51089 9.51089 7.93901 9.51089 6C9.51089 4.06099 7.93901 2.48911 6 2.48911C4.06099 2.48911 2.48911 4.06099 2.48911 6Z" style="fill:var(' + c + ')"/></svg>';
    const summary = centerValue + ' ' + centerLabel + ': ' + items.map((i) => i.label + ' ' + (total > 0 ? Math.round((i.value / total) * 100) : 0) + '%').join(', ');
    return '<div class="io-pie" role="img" aria-label="' + esc(summary) + '"><div class="io-pie__g"><svg width="120" height="120" aria-hidden="true">' + segs + '</svg><div class="io-pie__c" aria-hidden="true"><b>' + esc(centerValue) + '</b><span>' + esc(centerLabel) + '</span></div></div>'
      + '<ul class="io-pie__ley" aria-hidden="true">' + items.map((i) => '<li><span>' + ring(i.color) + esc(i.label) + '</span><b>' + (total > 0 ? Math.round((i.value / total) * 100) : 0) + '%</b></li>').join('') + '</ul></div>';
  };
  /* columnas como "Empeños": máx. 57 de alto, mínimo 4 */
  const columns = (groups) => {
    const max = Math.max(1, ...groups.flatMap((g) => g.bars.map((b) => b.value)));
    const h = (v) => Math.max(4, (v / max) * 57);
    return '<div class="ha-cols" role="presentation">' + groups.map((g) => '<div class="ha-cols__g"><div class="ha-cols__par">'
      + g.bars.map((b) => '<span title="' + esc(b.title) + '" style="--c:var(' + b.color + ');height:' + h(b.value).toFixed(1) + 'px"></span>').join('')
      + '</div><span class="io-l12 io-l12--body">' + esc(g.label) + '</span></div>').join('') + '</div>';
  };
  /* rejilla de datos de "Empeños" (PawnsStatsGrid) con el punto de la serie como leyenda */
  const statsGrid = (rows) => '<div class="io-pstats">' + rows.map((row) => '<div class="io-pstats__f">' + row.map((s) => '<div class="io-pstats__c">'
    + '<span class="ha-stat-lbl">' + (s.color ? dot(s.color) : '') + '<span class="io-l12">' + esc(s.label) + '</span></span><span class="io-t14">' + esc(s.value) + '</span></div>').join('') + '</div>').join('') + '</div>';
  /* Table del DS (borderVariant neutral); celda "text-description" con su detalle debajo */
  const table = (headers, rows) => '<div class="io-tabla-wrap"><table class="io-tabla"><thead><tr>' + headers.map((h) => '<th scope="col">' + esc(h) + '</th>').join('') + '</tr></thead><tbody>'
    + rows.map((row) => '<tr>' + row.map((c) => (typeof c === 'object'
      ? '<td class="ha-td-desc"><p class="ha-td-desc__t">' + esc(c.text) + '</p><p class="ha-td-desc__d">' + esc(c.description) + '</p></td>'
      : '<td>' + esc(c) + '</td>')).join('') + '</tr>').join('') + '</tbody></table></div>';
  const arrowBtn = (label, dest) => '<button class="io-ibtn" type="button" data-accion="ir"' + destAttrs(dest) + ' aria-label="' + esc(label) + '">' + ico('ArrowForward', 20) + '</button>';
  const destAttrs = (dest) => (dest && dest.href ? ' data-href="' + esc(dest.href) + '"' : '') + (dest && dest.label ? ' data-destino="' + esc(dest.label) + '"' : '');

  /* ---------- Contenido de cada tarjeta con datos (HomeCardsRegistry) ---------- */
  const RENDER = {
    [ID.ATTENTION]: (d, ctx) => {
      const rows = attentionRows(d, ctx.allowed);
      return '<div class="io-lista">' + rows.map((r) => '<div class="io-lista__f"><span class="io-lista__lbl"><span class="io-lista__lead">' + ico(r.icon, 18) + '</span><span class="io-t14">' + esc(r.label) + '</span></span>'
        + '<span class="io-t14">' + esc(r.value) + '</span>' + arrowBtn(TX.review + r.label.toLowerCase(), r.dest || DEST[r.card]) + '</div>').join('') + '</div>';
    },
    [ID.BILLING]: (d) => {
      const b = d[ID.BILLING];
      const commissions = b.commissions.reduce((s, a) => s + Math.abs(a), 0);
      const items = b.businessLines.map(([label, amount], i) => ({ label, value: amount, color: moneyColor(i), legend: fmtAmount(amount) }))
        .concat({ label: 'Comisiones', value: commissions, color: moneyColor(MONEY.length - 1), legend: fmtAmount(-commissions) });
      const isDeposit = b.netDeposit >= 0;
      return '<div class="io-stack"><p class="io-l12">' + (isDeposit ? 'Neto a depositar' : 'Total a pagar') + '</p><p class="io-t16b">' + money(b.netDeposit) + '</p></div>'
        + barLegend(items, TITLES[ID.BILLING])
        + '<p class="io-l12">' + (isDeposit ? 'Próximo depósito' : 'Próximo cobro') + ' ' + esc(b.nextPaymentDate) + ' · ' + esc(b.card) + '</p>';
    },
    [ID.USERS]: (d) => {
      const u = d[ID.USERS];
      const visible = u.users.slice(0, 3);
      const more = Math.max(0, u.totalUsers - visible.length);
      return '<div class="ha-users">' + visible.map(([ini, name]) => '<div class="ha-users__i"><span class="ha-avatar" aria-hidden="true">' + esc(ini) + '</span><span class="io-l12">' + esc(name) + '</span></div>').join('')
        + (more > 0 ? '<div class="ha-users__i ha-users__i--more"><span class="io-l12">' + more + ' más</span></div>' : '')
        + '<div class="ha-users__i"><button class="io-ibtn" type="button" data-accion="ir" data-destino="Nuevo usuario" aria-label="Agregar usuario">' + ico('Add', 20) + '</button><span class="io-l12" aria-hidden="true">Agregar usuario</span></div></div>';
    },
    [ID.MARKET]: (d) => {
      const m = d[ID.MARKET];
      return donut(m.segments.map(([label, value, color]) => ({ label, value, color })), num(m.totalArticles), 'Artículos');
    },
    [ID.BRAND]: (d) => {
      const b = d[ID.BRAND];
      return '<div class="ha-brand"><div class="ha-brand__txt"><span class="io-l12">Enlace de tu tienda</span><span class="io-t14 ha-brand__url">' + esc(b.storeUrl) + '</span></div>'
        + (b.status ? '<span class="io-chip-st' + (b.status === 'Publicada' ? '' : ' io-chip-st--gris') + '">' + esc(b.status) + '</span>' : '') + '</div>';
    },
    [ID.LOCATIONS]: (d) => {
      const l = d[ID.LOCATIONS];
      const seriesColors = [C.CYAN, C.CYAN_LIGHT];
      const pl = (n, one, many) => n + ' ' + (n === 1 ? one : many);
      return columns(l.groups.map(([label, warehouses, branches]) => ({
        label,
        bars: [{ value: branches, color: C.CYAN, title: pl(branches, 'sucursal', 'sucursales') }, { value: warehouses, color: C.CYAN_LIGHT, title: pl(warehouses, 'bodega', 'bodegas') }],
      }))) + statsGrid([l.stats.map(([label, value], i) => ({ label, value, color: seriesColors[i] }))]);
    },
    [ID.EXTENSIONS]: (d) => {
      const e = d[ID.EXTENSIONS];
      return '<p class="ha-t14b">' + e.withExtension + ' de ' + e.totalTerms + ' plazos con extensión activa</p>'
        + barLegend([{ label: 'Con extensión', value: e.withExtension, color: moneyColor(0) }, { label: 'Sin extensión', value: e.totalTerms - e.withExtension, color: C.PENDING }], TITLES[ID.EXTENSIONS]);
    },
    [ID.TERMS]: (d) => table(['Nombre', 'Duración', 'Interés'], d[ID.TERMS].installments),
    [ID.DEVICES]: (d) => {
      const s = d[ID.DEVICES].stats;
      const total = s.reduce((a, x) => a + Number(x[1]), 0);
      return donut(s.map(([label, value], i) => ({ label, value: Number(value), color: categoryColor(i) })), num(total), 'Dispositivos');
    },
    [ID.TABULATORS]: (d, ctx) => {
      const t = d[ID.TABULATORS];
      return '<div class="io-fila ha-tab-head"><div class="io-chips">' + [['oro', 'Oro'], ['plata', 'Plata']].map(([id, l]) => '<button class="io-choice" type="button" aria-pressed="' + (ctx.metal === id) + '" data-accion="metal" data-metal="' + id + '">' + l + '</button>').join('') + '</div>'
        + '<div class="io-mercado"><span class="io-l12">Precio de mercado hoy</span><span class="ha-t14b">' + esc(t.market) + '</span></div></div>'
        + table(['Pureza', 'Precio por onza'], t.rows.map(([p, v]) => [p, money(v)]));
    },
    [ID.CONSERVATION]: (d) => {
      const st = d[ID.CONSERVATION].states;
      const total = st.reduce((a, s) => a + s[1], 0);
      return '<div class="ha-txt-stack"><span class="io-l12">Empeños valuados por estado</span><span class="io-t16b">' + num(total) + ' empeños</span></div>'
        + '<div class="ha-cons">' + st.map(([name, count, pct], i) => '<div class="io-stack"><div class="ha-cons__f"><div class="ha-txt-stack"><span class="io-t14">' + esc(name) + '</span>'
          + (pct !== null ? '<span class="io-l12">' + esc(pct) + ' del avalúo</span>' : '') + '</div>'
          + (pct === null ? '<span class="io-chip-st io-chip-st--gris">Inactivo</span>' : '<span class="io-t14">' + num(count) + '</span>') + '</div>'
          + (pct !== null ? '<div class="ha-chartbar" role="img" aria-label="' + esc(name) + '"><span style="--c:var(' + moneyColor(i) + ');flex-basis:' + (total > 0 ? (count / total) * 100 : 0).toFixed(2) + '%" title="' + esc(name) + '"></span></div>' : '')
          + '</div>').join('') + '</div>';
    },
    [ID.LAYAWAYS]: (d) => {
      const [reservable, ...states] = d[ID.LAYAWAYS].stats;
      return '<p class="ha-t14b">' + num(reservable ? reservable[1] : 0) + ' ' + esc(String(reservable ? reservable[0] : '').toLowerCase()) + '</p>'
        + barLegend(states.map(([label, value], i) => ({ label, value: Number(value), color: moneyColor(i) })), TITLES[ID.LAYAWAYS]);
    },
    [ID.PROMOTIONS]: (d) => table(['Campaña', 'Descuento'], d[ID.PROMOTIONS].campaigns.map(([name, detail, discount]) => [{ text: name, description: detail }, discount])),
    /* sin ruta hasta que exista el catálogo de apps: sin flecha ni botón "+" */
    [ID.ADDONS]: (d) => '<div class="io-lista">' + d[ID.ADDONS].addons.map(([name, icon]) => '<div class="io-lista__f"><span class="io-lista__lbl"><span class="ha-addon-ico">' + ico(icon, 20) + '</span><span class="io-t14">' + esc(name) + '</span></span></div>').join('') + '</div>',
  };

  /* ---------- Estados de tarjeta (NewCardLoading, NewCardError, NewCardEmpty), iguales al Inicio operativo ---------- */
  const SKELETONS = {
    kpi: [['35%', 28], ['85%', 12], ['55%', 12]],
    chart: [['100%', 120], ['70%', 12], ['50%', 12]],
    table: [['90%', 14], ['80%', 14], ['85%', 14], ['70%', 14]],
  };
  const skeleton = (shape) => '<div class="io-stack" aria-hidden="true">' + SKELETONS[shape].map(([w, h]) => '<span class="io-sk" style="width:' + w + ';height:' + h + 'px"></span>').join('') + '</div>';
  const cardError = (id) => '<div class="io-stack" role="alert"><div class="io-err">' + ico('EstadosError', 24) + '<div><p class="io-t16b">' + TX.errorTitle + '</p><p class="io-t14 ha-caption">' + TX.errorText + '</p></div></div>'
    + '<button class="ds-btn ds-btn--secondary io-btn io-btn--ico" type="button" data-accion="reintentar" data-id="' + id + '">' + ico('Sync', 18) + TX.retry + '</button></div>';
  /* siluetas de EmptyStateGhosts.tsx (viewBox 240 × 88) */
  const L = (x, y, w, h = 6, f = '--ats-neutral-100') => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + h / 2 + '" style="fill:var(' + f + ')"/>';
  const Dt = (x, y) => '<circle cx="' + x + '" cy="' + y + '" r="4" style="fill:var(--ats-neutral-100)"/>';
  const TA = '--ats-primary-50', TB = '--propuesta-lila-100', TC = '--ats-cyan-100';
  const GHOSTS = {
    rows: () => L(16, 10, 92, 8, TA) + L(110, 10, 64, 8, TB) + L(176, 10, 48, 8, TC) + [36, 56, 76].map((y) => Dt(20, y + 3) + L(32, y, 96) + L(188, y, 36)).join(''),
    table: () => L(16, 10, 60, 5) + L(176, 10, 48, 5) + [22, 46, 70].map((y) => '<rect x="16" y="' + y + '" width="208" height="1.5" style="fill:var(--ats-neutral-50)"/>').join('')
      + [30, 54, 76].map((y) => L(16, y, 88) + L(184, y, 40)).join(''),
    donut: () => '<circle cx="44" cy="44" r="28" fill="none" style="stroke:var(' + TA + ')" stroke-width="10"/><circle cx="44" cy="44" r="28" fill="none" style="stroke:var(--ats-primary-100)" stroke-width="10" stroke-dasharray="32 144" stroke-linecap="round" transform="rotate(-90 44 44)"/>'
      + [24, 41, 58].map((y) => Dt(160, y + 3) + L(172, y, 52)).join(''),
    bars: () => L(16, 10, 52, 5) + L(16, 22, 70, 9, TA) + L(88, 22, 80, 9, TB) + L(170, 22, 54, 9, TC) + L(16, 44, 36, 5) + L(16, 56, 60, 9, TA) + L(78, 56, 40, 9, TC) + L(120, 56, 104, 9, TB)
      + [16, 76, 136].map((x) => '<circle cx="' + (x + 4) + '" cy="80" r="3.5" style="fill:var(--ats-neutral-100)"/>' + L(x + 12, 77, 36, 5)).join(''),
    week: () => [30, 46, 58, 50, 36, 62].map((h, i) => '<rect x="' + (18 + i * 30) + '" y="' + (70 - h * 0.8) + '" width="22" height="' + (h * 0.8) + '" rx="5" style="fill:var(' + TC + ')"/>').join('')
      + '<rect x="198" y="20" width="22" height="50" rx="5" fill="none" style="stroke:var(--ats-cyan-300)" stroke-width="1.5" stroke-dasharray="4 3"/>'
      + [0, 1, 2, 3, 4, 5, 6].map((i) => '<rect x="' + (23 + i * 30) + '" y="78" width="12" height="5" rx="2.5" style="fill:var(--ats-neutral-100)"/>').join(''),
  };
  const emptyBody = (e) => (e.kind === 'positive'
    ? '<div class="io-vpos">' + ico('EstadosSuccess', 24) + '<p>' + esc(e.text) + '</p></div>'
    : '<div class="io-stack"><div class="io-panel" aria-hidden="true"><svg class="io-panel__sil" viewBox="0 0 240 88">' + GHOSTS[e.art]() + '</svg><span class="io-medalla">' + ico(e.icon, 22) + '</span></div><p class="io-t14 ha-caption">' + esc(e.text) + '</p></div>');

  /* ---------- Tarjeta (NewCardShell + NewCardHeader): h3, flecha "Ir a …" solo si el módulo tiene ruta ---------- */
  const modeOf = (id, ctx) => {
    if (ctx.state === 'cargando') return 'loading';
    if (ctx.state === 'error' && ERROR_CARDS.includes(id) && !ctx.retried.includes(id)) return 'error';
    if (EMPTY[id] && IS_EMPTY[id](ctx.data, ctx.allowed)) return 'empty';
    return 'content';
  };
  const card = (id, ctx) => {
    const mode = modeOf(id, ctx);
    const body = mode === 'loading' ? skeleton(SKELETON[id]) : mode === 'error' ? cardError(id) : mode === 'empty' ? emptyBody(EMPTY[id]) : RENDER[id](ctx.data, ctx);
    return '<section class="io-card ha-card" id="ha-card-' + id + '" tabindex="-1" aria-label="' + esc(TITLES[id]) + '" aria-busy="' + (mode === 'loading') + '" data-card="' + id + '" data-modo="' + mode + '">'
      + '<div class="io-card__head"><div class="io-card__tit"><h3>' + esc(TITLES[id]) + '</h3></div>' + (DEST[id] ? arrowBtn(TX.detail + TITLES[id], DEST[id]) : '') + '</div>'
      + '<div class="io-card__body">' + body + '</div></section>';
  };

  /* columnas fijas sin las tarjetas que el rol no ve; si una columna queda vacía, se reparten en orden (getVisibleColumns) */
  const visibleColumns = (visible) => {
    const cols = COLUMNS.map((col) => col.filter((id) => visible.includes(id)));
    if (cols.every((c) => c.length > 0)) return cols;
    return Array.from({ length: COLUMN_COUNT }, (_, c) => visible.filter((_, i) => i % COLUMN_COUNT === c));
  };

  /* ---------- Estado de la maqueta y URL ---------- */
  const params = new URLSearchParams(location.search);
  const pick = (v, rec, def) => (v && rec[v] ? v : def);
  let state = {
    perfil: pick(params.get('perfil'), PROFILES, 'dueno'),
    estado: params.get('nueva') === '1' ? 'vacio' : pick(params.get('estado'), STATES, 'datos'),
    metal: 'oro', retried: [],
  };
  const toQuery = (s) => 'perfil=' + s.perfil + '&estado=' + s.estado;
  const ctxOf = (s) => {
    const allowed = PROFILE_CARDS[s.perfil];
    const base = s.estado === 'vacio' ? EMPTY_DATA : DATA;
    const data = { ...base, [ID.TABULATORS]: s.estado === 'vacio' ? { market: '', rows: [] } : TABULATORS[s.metal] };
    return { state: s.estado, allowed, data, metal: s.metal, retried: s.retried };
  };

  const root = document.getElementById('haRoot');
  const live = document.getElementById('haLive');
  const toastEl = document.getElementById('haToast');
  const announce = (m) => { live.textContent = ''; requestAnimationFrame(() => { live.textContent = m; }); };
  let toastTimer = 0;
  const notify = (m) => { toastEl.textContent = m; toastEl.hidden = false; announce(m); clearTimeout(toastTimer); toastTimer = setTimeout(() => { toastEl.hidden = true; }, 2600); };

  let focusId = null;
  const render = () => {
    const ctx = ctxOf(state);
    const visible = ORDER.filter((id) => id === ID.ATTENTION || ctx.allowed.includes(id));
    const modules = visible.filter((id) => id !== ID.ATTENTION);
    const note = modules.length <= ROLE_NOTE_MAX ? '<p class="io-t14 ha-caption ha-role-note">' + TX.roleNotePrefix + ' ' + esc(modules.map((id) => TITLES[id]).join(' y ')) + '. ' + TX.roleNoteSuffix + '</p>' : '';
    root.innerHTML = '<h1 class="sr-only">' + TX.pageTitle + '</h1>' + note
      + '<div class="io-cols">' + visibleColumns(visible).map((col) => '<div class="io-col">' + col.map((id) => card(id, ctx)).join('') + '</div>').join('') + '</div>';
    if (focusId) { const c = document.getElementById('ha-card-' + focusId); if (c) c.focus(); focusId = null; }
    syncProto(); applyMenu();
  };
  const update = (patch) => {
    const prev = state;
    state = { ...state, ...patch };
    if (patch.estado !== undefined || patch.perfil !== undefined) state.retried = [];
    if (patch.estado && patch.estado !== prev.estado) { if (patch.estado === 'cargando') announce(TX.loading); if (patch.estado === 'error') announce(TX.error); }
    if (patch.perfil && patch.perfil !== prev.perfil) announce('Vista de ' + PROFILES[patch.perfil]);
    try { history.replaceState(null, '', location.pathname + '?' + toQuery(state) + location.hash); } catch (e) { /* vista de archivo local */ }
    render();
  };

  /* ---------- Eventos (delegados) ---------- */
  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-accion]');
    if (!b) return;
    switch (b.dataset.accion) {
      case 'ir':
        if (b.dataset.href) location.href = b.dataset.href;
        else notify(TX.opens + b.dataset.destino);
        break;
      case 'metal':
        if (b.dataset.metal === state.metal) return;
        state = { ...state, metal: b.dataset.metal };
        render();
        { const m = root.querySelector('[data-metal="' + state.metal + '"]'); if (m) m.focus(); }
        break;
      /* "Reintentar" vuelve a pedir solo esa tarjeta: en su vista previa responde al instante */
      case 'reintentar':
        state = { ...state, retried: state.retried.concat(b.dataset.id) };
        focusId = b.dataset.id;
        render();
        announce(TITLES[b.dataset.id] + TX.retryDone);
        break;
      default: break;
    }
  });

  /* ---------- Panel "Estados de la maqueta" (la barra de chips de su vista previa) ---------- */
  const P = { perfil: document.getElementById('haPPerfil'), estado: document.getElementById('haPEstado') };
  const opts = (sel, rec) => { sel.innerHTML = Object.entries(rec).map(([v, l]) => '<option value="' + v + '">' + l + '</option>').join(''); };
  opts(P.perfil, PROFILES); opts(P.estado, STATES);
  function syncProto() { P.perfil.value = state.perfil; P.estado.value = state.estado; }
  P.perfil.addEventListener('change', () => update({ perfil: P.perfil.value }));
  P.estado.addEventListener('change', () => update({ estado: P.estado.value }));

  /* ---------- Menú lateral por perfil: ../menu-op.js lo pinta; aquí se ocultan los módulos sin acceso del gerente ---------- */
  function applyMenu() {
    const side = document.getElementById('posSide');
    if (!side) return;
    if (!side.dataset.haObs) { side.dataset.haObs = '1'; new MutationObserver(applyMenu).observe(side, { childList: true }); }
    side.querySelectorAll('[data-id]').forEach((it) => {
      const hide = state.perfil === 'gerente' && !MENU_GERENTE.includes(it.dataset.id);
      if (it.hidden !== hide) it.hidden = hide;
    });
    side.querySelectorAll('.pos-side__group').forEach((g) => {
      const hide = [...g.querySelectorAll('.pos-side__gitems [data-id]')].every((it) => it.hidden);
      if (g.hidden !== hide) g.hidden = hide;
    });
  }
  new MutationObserver(applyMenu).observe(document.body, { childList: true });

  if (params.get('nueva') === '1') { try { history.replaceState(null, '', location.pathname + '?' + toQuery(state) + location.hash); } catch (e) { /* vista de archivo local */ } }
  if (state.estado === 'cargando') announce(TX.loading);
  render();
})();
