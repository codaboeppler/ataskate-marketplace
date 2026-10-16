/* Ataskate POS (Operativo) · Clientes — datos y utilidades compartidos por index.html (lista y Perfil del cliente) y
   cliente-nuevo.html (Cliente nuevo y Editar cliente). Es la versión en JS de la rama del equipo del repo del equipo
   (hasta el commit 20f588788): src/components/ClientsRedesign/{clientsRedesign.mocks,createdClients}.ts y
   Profile/{profile.mocks,profileOperations.mocks,profilePhotos.mocks,profile.helpers,profile.constants,profileEdits}.ts.
   Las ediciones y los clientes creados se guardan en sessionStorage con las mismas claves que su React (solo esta pestaña). */

/* ---------- Íconos del DS (src/design-system/Icons/Icons.tsx), 24x24 con fill currentColor ---------- */
const CI_RAW = {
  AccountCircle: ["0 0 24 24", "<path d=\"M5.85 17.1C6.7 16.45 7.65 15.9373 8.7 15.562C9.75 15.1873 10.85 15 12 15C13.15 15 14.25 15.1873 15.3 15.562C16.35 15.9373 17.3 16.45 18.15 17.1C18.7333 16.4167 19.1877 15.6417 19.513 14.775C19.8377 13.9083 20 12.9833 20 12C20 9.78333 19.221 7.89567 17.663 6.337C16.1043 4.779 14.2167 4 12 4C9.78333 4 7.896 4.779 6.338 6.337C4.77933 7.89567 4 9.78333 4 12C4 12.9833 4.16267 13.9083 4.488 14.775C4.81267 15.6417 5.26667 16.4167 5.85 17.1ZM12 13C11.0167 13 10.1873 12.6627 9.512 11.988C8.83733 11.3127 8.5 10.4833 8.5 9.5C8.5 8.51667 8.83733 7.68733 9.512 7.012C10.1873 6.33733 11.0167 6 12 6C12.9833 6 13.8127 6.33733 14.488 7.012C15.1627 7.68733 15.5 8.51667 15.5 9.5C15.5 10.4833 15.1627 11.3127 14.488 11.988C13.8127 12.6627 12.9833 13 12 13ZM12 22C10.6167 22 9.31667 21.7373 8.1 21.212C6.88333 20.6873 5.825 19.975 4.925 19.075C4.025 18.175 3.31267 17.1167 2.788 15.9C2.26267 14.6833 2 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31267 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.31233 8.1 2.787C9.31667 2.26233 10.6167 2 12 2C13.3833 2 14.6833 2.26233 15.9 2.787C17.1167 3.31233 18.175 4.025 19.075 4.925C19.975 5.825 20.6873 6.88333 21.212 8.1C21.7373 9.31667 22 10.6167 22 12C22 13.3833 21.7373 14.6833 21.212 15.9C20.6873 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6873 15.9 21.212C14.6833 21.7373 13.3833 22 12 22ZM12 20C12.8833 20 13.7167 19.871 14.5 19.613C15.2833 19.3543 16 18.9833 16.65 18.5C16 18.0167 15.2833 17.6457 14.5 17.387C13.7167 17.129 12.8833 17 12 17C11.1167 17 10.2833 17.129 9.5 17.387C8.71667 17.6457 8 18.0167 7.35 18.5C8 18.9833 8.71667 19.3543 9.5 19.613C10.2833 19.871 11.1167 20 12 20ZM12 11C12.4333 11 12.7917 10.8583 13.075 10.575C13.3583 10.2917 13.5 9.93333 13.5 9.5C13.5 9.06667 13.3583 8.70833 13.075 8.425C12.7917 8.14167 12.4333 8 12 8C11.5667 8 11.2083 8.14167 10.925 8.425C10.6417 8.70833 10.5 9.06667 10.5 9.5C10.5 9.93333 10.6417 10.2917 10.925 10.575C11.2083 10.8583 11.5667 11 12 11Z\" fill=\"currentColor\" /> "],
  IdFrontal: ["0 0 24 24", "<path d=\"M14 13 H19 V11 H14 V13 ZM14 10 H19 V8 H14 V10 ZM5 16 H13 V15.45 C13 14.7 12.63 14.104 11.9 13.663 C11.17 13.221 10.2 13 9 13 C7.8 13 6.83 13.221 6.1 13.663 C5.37 14.104 5 14.7 5 15.45 V16 ZM9 12 C9.55 12 10.02 11.804 10.41 11.412 C10.8 11.021 11 10.55 11 10 C11 9.45 10.8 8.979 10.41 8.588 C10.02 8.196 9.55 8 9 8 C8.45 8 7.98 8.196 7.59 8.588 C7.2 8.979 7 9.45 7 10 C7 10.55 7.2 11.021 7.59 11.412 C7.98 11.804 8.45 12 9 12 ZM4 20 C3.45 20 2.98 19.804 2.59 19.413 C2.2 19.021 2 18.55 2 18 V6 C2 5.45 2.2 4.979 2.59 4.588 C2.98 4.196 3.45 4 4 4 H20 C20.55 4 21.02 4.196 21.41 4.588 C21.8 4.979 22 5.45 22 6 V18 C22 18.55 21.8 19.021 21.41 19.413 C21.02 19.804 20.55 20 20 20 H4 ZM4 18 H20 V6 H4 V18 Z\" fill=\"currentColor\" /> "],
  Call: ["0 0 24 24", "<path d=\"M19.95 21C17.8667 21 15.8083 20.5458 13.775 19.6375C11.7417 18.7292 9.89167 17.4417 8.225 15.775C6.55833 14.1083 5.27083 12.2583 4.3625 10.225C3.45417 8.19167 3 6.13333 3 4.05C3 3.75 3.1 3.5 3.3 3.3C3.5 3.1 3.75 3 4.05 3H8.1C8.33333 3 8.54167 3.07917 8.725 3.2375C8.90833 3.39583 9.01667 3.58333 9.05 3.8L9.7 7.3C9.73333 7.56667 9.725 7.79167 9.675 7.975C9.625 8.15833 9.53333 8.31667 9.4 8.45L6.975 10.9C7.30833 11.5167 7.70417 12.1125 8.1625 12.6875C8.62083 13.2625 9.125 13.8167 9.675 14.35C10.1917 14.8667 10.7333 15.3458 11.3 15.7875C11.8667 16.2292 12.4667 16.6333 13.1 17L15.45 14.65C15.6 14.5 15.7958 14.3875 16.0375 14.3125C16.2792 14.2375 16.5167 14.2167 16.75 14.25L20.2 14.95C20.4333 15.0167 20.625 15.1375 20.775 15.3125C20.925 15.4875 21 15.6833 21 15.9V19.95C21 20.25 20.9 20.5 20.7 20.7C20.5 20.9 20.25 21 19.95 21ZM6.025 9L7.675 7.35L7.25 5H5.025C5.10833 5.68333 5.225 6.35833 5.375 7.025C5.525 7.69167 5.74167 8.35 6.025 9ZM14.975 17.95C15.625 18.2333 16.2875 18.4583 16.9625 18.625C17.6375 18.7917 18.3167 18.9 19 18.95V16.75L16.65 16.275L14.975 17.95Z\" fill=\"currentColor\" /> "],
  Mail: ["0 0 24 24", "<path d=\"M4 20C3.45 20 2.97933 19.8043 2.588 19.413C2.196 19.021 2 18.55 2 18V6C2 5.45 2.196 4.97933 2.588 4.588C2.97933 4.196 3.45 4 4 4H20C20.55 4 21.021 4.196 21.413 4.588C21.8043 4.97933 22 5.45 22 6V18C22 18.55 21.8043 19.021 21.413 19.413C21.021 19.8043 20.55 20 20 20H4ZM12 13L4 8V18H20V8L12 13ZM12 11L20 6H4L12 11ZM4 8V6V18V8Z\" fill=\"currentColor\" /> "],
  Home: ["0 0 24 24", "<path d=\"M4 21V9L12 3L20 9V21H14V14H10V21H4ZM6 19H8V12H16V19H18V10L12 5.5L6 10V19Z\" fill=\"currentColor\" /> "],
  UserAttributes: ["0 0 24 24", "<path d=\"M14.0001 7V5H22.0001V7H14.0001ZM14.0001 11V9H22.0001V11H14.0001ZM14.0001 15V13H22.0001V15H14.0001ZM8.00009 14C7.16676 14 6.45843 13.7083 5.87509 13.125C5.29176 12.5417 5.00009 11.8333 5.00009 11C5.00009 10.1667 5.29176 9.45833 5.87509 8.875C6.45843 8.29167 7.16676 8 8.00009 8C8.83343 8 9.54176 8.29167 10.1251 8.875C10.7084 9.45833 11.0001 10.1667 11.0001 11C11.0001 11.8333 10.7084 12.5417 10.1251 13.125C9.54176 13.7083 8.83343 14 8.00009 14ZM2.00009 20V18.1C2.00009 17.75 2.08342 17.4167 2.25009 17.1C2.41676 16.7833 2.65009 16.5333 2.95009 16.35C3.70009 15.9 4.49592 15.5625 5.33759 15.3375C6.17926 15.1125 7.06676 15 8.00009 15C8.93342 15 9.82093 15.1125 10.6626 15.3375C11.5043 15.5625 12.3001 15.9 13.0501 16.35C13.3501 16.5333 13.5834 16.7833 13.7501 17.1C13.9168 17.4167 14.0001 17.75 14.0001 18.1V20H2.00009ZM4.15009 18H11.8501C11.2668 17.6667 10.6501 17.4167 10.0001 17.25C9.35009 17.0833 8.68342 17 8.00009 17C7.31676 17 6.65009 17.0833 6.00009 17.25C5.35009 17.4167 4.73343 17.6667 4.15009 18ZM8.00009 12C8.28342 12 8.52093 11.9042 8.71259 11.7125C8.90426 11.5208 9.00009 11.2833 9.00009 11C9.00009 10.7167 8.90426 10.4792 8.71259 10.2875C8.52093 10.0958 8.28342 10 8.00009 10C7.71676 10 7.47926 10.0958 7.28759 10.2875C7.09592 10.4792 7.00009 10.7167 7.00009 11C7.00009 11.2833 7.09592 11.5208 7.28759 11.7125C7.47926 11.9042 7.71676 12 8.00009 12Z\" fill=\"currentColor\" /> "],
  PrstamosSolicitados: ["0 0 24 24", "<path d=\"M3 22V20.5H5.5V19.75H4V18.25H5.5V17.5H3V16H6C6.28333 16 6.52083 16.0958 6.7125 16.2875C6.90417 16.4792 7 16.7167 7 17V18C7 18.2833 6.90417 18.5208 6.7125 18.7125C6.52083 18.9042 6.28333 19 6 19C6.28333 19 6.52083 19.0958 6.7125 19.2875C6.90417 19.4792 7 19.7167 7 20V21C7 21.2833 6.90417 21.5208 6.7125 21.7125C6.52083 21.9042 6.28333 22 6 22H3ZM3 15V12.25C3 11.9667 3.09583 11.7292 3.2875 11.5375C3.47917 11.3458 3.71667 11.25 4 11.25H5.5V10.5H3V9H6C6.28333 9 6.52083 9.09583 6.7125 9.2875C6.90417 9.47917 7 9.71667 7 10V11.75C7 12.0333 6.90417 12.2708 6.7125 12.4625C6.52083 12.6542 6.28333 12.75 6 12.75H4.5V13.5H7V15H3ZM4.5 8V3.5H3V2H6V8H4.5ZM9 19V17H21V19H9ZM9 13V11H21V13H9ZM9 7V5H21V7H9Z\" fill=\"currentColor\" /> "],
  Payments: ["0 0 24 24", "<path d=\"M14 13C13.1667 13 12.4583 12.7083 11.875 12.125C11.2917 11.5417 11 10.8333 11 10C11 9.16667 11.2917 8.45833 11.875 7.875C12.4583 7.29167 13.1667 7 14 7C14.8333 7 15.5417 7.29167 16.125 7.875C16.7083 8.45833 17 9.16667 17 10C17 10.8333 16.7083 11.5417 16.125 12.125C15.5417 12.7083 14.8333 13 14 13ZM7 16C6.45 16 5.97933 15.804 5.588 15.412C5.196 15.0207 5 14.55 5 14V6C5 5.45 5.196 4.97933 5.588 4.588C5.97933 4.196 6.45 4 7 4H21C21.55 4 22.021 4.196 22.413 4.588C22.8043 4.97933 23 5.45 23 6V14C23 14.55 22.8043 15.0207 22.413 15.412C22.021 15.804 21.55 16 21 16H7ZM9 14H19C19 13.45 19.1957 12.979 19.587 12.587C19.979 12.1957 20.45 12 21 12V8C20.45 8 19.979 7.804 19.587 7.412C19.1957 7.02067 19 6.55 19 6H9C9 6.55 8.804 7.02067 8.412 7.412C8.02067 7.804 7.55 8 7 8V12C7.55 12 8.02067 12.1957 8.412 12.587C8.804 12.979 9 13.45 9 14ZM20 20H3C2.45 20 1.97933 19.8043 1.588 19.413C1.196 19.021 1 18.55 1 18V7H3V18H20V20Z\" fill=\"currentColor\" /> "],
  Edit: ["0 0 24 24", "<path d=\"M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3043 2.75 17.863 2.75C18.421 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.571 21.275 6.113C21.2917 6.65433 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z\" fill=\"currentColor\" /> "],
  ViewOn: ["0 0 24 24", "<path d=\"M12 16C13.25 16 14.3127 15.5627 15.188 14.688C16.0627 13.8127 16.5 12.75 16.5 11.5C16.5 10.25 16.0627 9.18733 15.188 8.312C14.3127 7.43733 13.25 7 12 7C10.75 7 9.68733 7.43733 8.812 8.312C7.93733 9.18733 7.5 10.25 7.5 11.5C7.5 12.75 7.93733 13.8127 8.812 14.688C9.68733 15.5627 10.75 16 12 16ZM12 14.2C11.25 14.2 10.6127 13.9373 10.088 13.412C9.56267 12.8873 9.3 12.25 9.3 11.5C9.3 10.75 9.56267 10.1123 10.088 9.587C10.6127 9.06233 11.25 8.8 12 8.8C12.75 8.8 13.3877 9.06233 13.913 9.587C14.4377 10.1123 14.7 10.75 14.7 11.5C14.7 12.25 14.4377 12.8873 13.913 13.412C13.3877 13.9373 12.75 14.2 12 14.2ZM12 19C9.68333 19 7.56667 18.3877 5.65 17.163C3.73333 15.9377 2.28333 14.2833 1.3 12.2C1.25 12.1167 1.21667 12.0123 1.2 11.887C1.18333 11.7623 1.175 11.6333 1.175 11.5C1.175 11.3667 1.18333 11.2373 1.2 11.112C1.21667 10.9873 1.25 10.8833 1.3 10.8C2.28333 8.71667 3.73333 7.06267 5.65 5.838C7.56667 4.61267 9.68333 4 12 4C14.3167 4 16.4333 4.61267 18.35 5.838C20.2667 7.06267 21.7167 8.71667 22.7 10.8C22.75 10.8833 22.7833 10.9873 22.8 11.112C22.8167 11.2373 22.825 11.3667 22.825 11.5C22.825 11.6333 22.8167 11.7623 22.8 11.887C22.7833 12.0123 22.75 12.1167 22.7 12.2C21.7167 14.2833 20.2667 15.9377 18.35 17.163C16.4333 18.3877 14.3167 19 12 19ZM12 17C13.8833 17 15.6127 16.504 17.188 15.512C18.7627 14.5207 19.9667 13.1833 20.8 11.5C19.9667 9.81667 18.7627 8.479 17.188 7.487C15.6127 6.49567 13.8833 6 12 6C10.1167 6 8.38733 6.49567 6.812 7.487C5.23733 8.479 4.03333 9.81667 3.2 11.5C4.03333 13.1833 5.23733 14.5207 6.812 15.512C8.38733 16.504 10.1167 17 12 17Z\" fill=\"currentColor\" /> "],
  MoreVert: ["0 0 24 24", "<path d=\"M12 20C11.45 20 10.9793 19.8043 10.588 19.413C10.196 19.021 10 18.55 10 18C10 17.45 10.196 16.979 10.588 16.587C10.9793 16.1957 11.45 16 12 16C12.55 16 13.021 16.1957 13.413 16.587C13.8043 16.979 14 17.45 14 18C14 18.55 13.8043 19.021 13.413 19.413C13.021 19.8043 12.55 20 12 20ZM12 14C11.45 14 10.9793 13.804 10.588 13.412C10.196 13.0207 10 12.55 10 12C10 11.45 10.196 10.979 10.588 10.587C10.9793 10.1957 11.45 10 12 10C12.55 10 13.021 10.1957 13.413 10.587C13.8043 10.979 14 11.45 14 12C14 12.55 13.8043 13.0207 13.413 13.412C13.021 13.804 12.55 14 12 14ZM12 8C11.45 8 10.9793 7.804 10.588 7.412C10.196 7.02067 10 6.55 10 6C10 5.45 10.196 4.97933 10.588 4.588C10.9793 4.196 11.45 4 12 4C12.55 4 13.021 4.196 13.413 4.588C13.8043 4.97933 14 5.45 14 6C14 6.55 13.8043 7.02067 13.413 7.412C13.021 7.804 12.55 8 12 8Z\" fill=\"currentColor\" /> "],
  Fingerprint: ["0 0 24 24", "<path d=\"M3.25 9.6499C3.13333 9.56657 3.06267 9.46224 3.038 9.3369C3.01267 9.21224 3.05 9.08324 3.15 8.9499C4.18333 7.53324 5.479 6.43324 7.037 5.6499C8.59567 4.86657 10.2583 4.4749 12.025 4.4749C13.7917 4.4749 15.4583 4.8539 17.025 5.6119C18.5917 6.37057 19.9 7.46657 20.95 8.8999C21.0667 9.0499 21.104 9.18324 21.062 9.2999C21.0207 9.41657 20.95 9.51657 20.85 9.5999C20.75 9.68324 20.6333 9.72057 20.5 9.7119C20.3667 9.7039 20.25 9.63324 20.15 9.4999C19.2333 8.1999 18.0543 7.2039 16.613 6.5119C15.171 5.82057 13.6417 5.4749 12.025 5.4749C10.4083 5.4749 8.89167 5.82057 7.475 6.5119C6.05833 7.2039 4.88333 8.1999 3.95 9.4999C3.85 9.6499 3.73333 9.73324 3.6 9.7499C3.46667 9.76657 3.35 9.73324 3.25 9.6499ZM14.85 21.9749C13.1167 21.5416 11.7 20.6789 10.6 19.3869C9.5 18.0956 8.95 16.5166 8.95 14.6499C8.95 13.8166 9.25 13.1166 9.85 12.5499C10.45 11.9832 11.175 11.6999 12.025 11.6999C12.875 11.6999 13.6 11.9832 14.2 12.5499C14.8 13.1166 15.1 13.8166 15.1 14.6499C15.1 15.1999 15.3083 15.6626 15.725 16.0379C16.1417 16.4126 16.6333 16.5999 17.2 16.5999C17.7667 16.5999 18.25 16.4126 18.65 16.0379C19.05 15.6626 19.25 15.1999 19.25 14.6499C19.25 12.7166 18.5417 11.0916 17.125 9.7749C15.7083 8.45824 14.0167 7.7999 12.05 7.7999C10.0833 7.7999 8.39167 8.45824 6.975 9.7749C5.55833 11.0916 4.85 12.7082 4.85 14.6249C4.85 15.0249 4.88767 15.5249 4.963 16.1249C5.03767 16.7249 5.21667 17.4249 5.5 18.2249C5.55 18.3749 5.546 18.5082 5.488 18.6249C5.42933 18.7416 5.33333 18.8249 5.2 18.8749C5.06667 18.9249 4.93733 18.9206 4.812 18.8619C4.68733 18.8039 4.6 18.7082 4.55 18.5749C4.3 17.9249 4.121 17.2789 4.013 16.6369C3.90433 15.9956 3.85 15.3332 3.85 14.6499C3.85 12.4332 4.65433 10.5749 6.263 9.0749C7.871 7.5749 9.79167 6.8249 12.025 6.8249C14.275 6.8249 16.2083 7.5749 17.825 9.0749C19.4417 10.5749 20.25 12.4332 20.25 14.6499C20.25 15.4832 19.9543 16.1792 19.363 16.7379C18.771 17.2959 18.05 17.5749 17.2 17.5749C16.35 17.5749 15.621 17.2959 15.013 16.7379C14.4043 16.1792 14.1 15.4832 14.1 14.6499C14.1 14.0999 13.896 13.6372 13.488 13.2619C13.0793 12.8872 12.5917 12.6999 12.025 12.6999C11.4583 12.6999 10.9707 12.8872 10.562 13.2619C10.154 13.6372 9.95 14.0999 9.95 14.6499C9.95 16.2666 10.4293 17.6166 11.388 18.6999C12.346 19.7832 13.5833 20.5416 15.1 20.9749C15.25 21.0249 15.35 21.1082 15.4 21.2249C15.45 21.3416 15.4583 21.4666 15.425 21.5999C15.3917 21.7166 15.325 21.8166 15.225 21.8999C15.125 21.9832 15 22.0082 14.85 21.9749ZM6.5 4.4249C6.36667 4.50824 6.23333 4.5289 6.1 4.4869C5.96667 4.44557 5.86667 4.35824 5.8 4.2249C5.73333 4.09157 5.71667 3.97057 5.75 3.8619C5.78333 3.7539 5.86667 3.65824 6 3.5749C6.93333 3.0749 7.90833 2.69157 8.925 2.4249C9.94167 2.15824 10.975 2.0249 12.025 2.0249C13.0917 2.0249 14.1333 2.1539 15.15 2.4119C16.1667 2.67057 17.15 3.04157 18.1 3.5249C18.25 3.60824 18.3377 3.70824 18.363 3.8249C18.3877 3.94157 18.375 4.05824 18.325 4.1749C18.275 4.29157 18.1917 4.38324 18.075 4.4499C17.9583 4.51657 17.8167 4.50824 17.65 4.4249C16.7667 3.9749 15.854 3.6289 14.912 3.3869C13.9707 3.14557 13.0083 3.0249 12.025 3.0249C11.0583 3.0249 10.1083 3.13724 9.175 3.3619C8.24167 3.58724 7.35 3.94157 6.5 4.4249ZM9.45 21.6249C8.46667 20.5916 7.71267 19.5372 7.188 18.4619C6.66267 17.3872 6.4 16.1166 6.4 14.6499C6.4 13.1332 6.95 11.8539 8.05 10.8119C9.15 9.77057 10.475 9.2499 12.025 9.2499C13.575 9.2499 14.9083 9.77057 16.025 10.8119C17.1417 11.8539 17.7 13.1332 17.7 14.6499C17.7 14.7999 17.654 14.9206 17.562 15.0119C17.4707 15.1039 17.35 15.1499 17.2 15.1499C17.0667 15.1499 16.95 15.1039 16.85 15.0119C16.75 14.9206 16.7 14.7999 16.7 14.6499C16.7 13.3999 16.2373 12.3539 15.312 11.5119C14.3873 10.6706 13.2917 10.2499 12.025 10.2499C10.7583 10.2499 9.67067 10.6706 8.762 11.5119C7.854 12.3539 7.4 13.3999 7.4 14.6499C7.4 15.9999 7.63333 17.1456 8.1 18.0869C8.56667 19.0289 9.25 19.9749 10.15 20.9249C10.25 21.0249 10.3 21.1416 10.3 21.2749C10.3 21.4082 10.25 21.5249 10.15 21.6249C10.05 21.7249 9.93333 21.7749 9.8 21.7749C9.66667 21.7749 9.55 21.7249 9.45 21.6249ZM17 19.9249C15.5167 19.9249 14.229 19.4249 13.137 18.4249C12.0457 17.4249 11.5 16.1666 11.5 14.6499C11.5 14.5166 11.5457 14.3999 11.637 14.2999C11.729 14.1999 11.85 14.1499 12 14.1499C12.15 14.1499 12.271 14.1999 12.363 14.2999C12.4543 14.3999 12.5 14.5166 12.5 14.6499C12.5 15.8999 12.95 16.9249 13.85 17.7249C14.75 18.5249 15.8 18.9249 17 18.9249C17.1 18.9249 17.2417 18.9166 17.425 18.8999C17.6083 18.8832 17.8 18.8582 18 18.8249C18.15 18.7916 18.2793 18.8122 18.388 18.8869C18.496 18.9622 18.5667 19.0749 18.6 19.2249C18.6333 19.3582 18.6083 19.4749 18.525 19.5749C18.4417 19.6749 18.3333 19.7416 18.2 19.7749C17.9 19.8582 17.6377 19.9042 17.413 19.9129C17.1877 19.9209 17.05 19.9249 17 19.9249Z\" fill=\"currentColor\" /> "]
};
const CI = (name, size = 20) => { const [vb, body] = CI_RAW[name]; return `<svg width="${size}" height="${size}" viewBox="${vb}" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`; };

/* ---------- Lista de clientes (clientsRedesign.mocks.ts) ----------
   Sin fotos de personas: el DS Avatar muestra las iniciales del cliente. */
const CLIENTES = [
  ['Mariana', 'Gómez Ruiz', 1131, 'Mexicana', 'mariana.gomez@ejemplo.com', '5500000001', 'Excelente'],
  ['Luis Alberto', 'Hernández Soto', 1129, 'Mexicana', 'luis.hdz@ejemplo.com', '5500000002', 'Bueno'],
  ['Ana Sofía', 'Martínez Lara', 1127, 'Mexicana', 'anasofia.ml@ejemplo.com', '5500000003', 'Regular'],
  ['Jorge', 'Ramírez Cruz', 1124, 'Mexicana', 'jorge.ramirez@ejemplo.com', '5500000004', 'Bueno'],
  ['Daniela', 'Torres Vega', 1120, 'Mexicana', 'dani.torres@ejemplo.com', '5500000005', 'Excelente'],
  ['Carlos', 'Mendoza Ortiz', 1118, 'Mexicana', 'c.mendoza@ejemplo.com', '5500000006', 'Regular'],
  ['Valeria', 'Castillo Ríos', 1115, 'Mexicana', 'vale.castillo@ejemplo.com', '5500000007', 'Nuevo'],
  ['Miguel Ángel', 'Flores Díaz', 1112, 'Mexicana', 'miguel.flores@ejemplo.com', '5500000008', 'Bueno'],
  ['Fernanda', 'Navarro Peña', 1109, 'Mexicana', 'fer.navarro@ejemplo.com', '5500000009', 'Regular'],
  ['Ricardo', 'Silva Medina', 1105, 'Estadounidense', 'rsilva@ejemplo.com', '5500000010', 'Nuevo'],
  ['Paola', 'Jiménez Rojas', 1101, 'Mexicana', 'paola.jr@ejemplo.com', '5500000011', 'Excelente'],
  ['Héctor', 'Morales León', 1098, 'Mexicana', 'hector.ml@ejemplo.com', '5500000012', 'Regular'],
  ['Gabriela', 'Ruiz Campos', 1094, 'Mexicana', 'gaby.ruiz@ejemplo.com', '5500000013', 'Bueno'],
  ['Emilio', 'Vargas Núñez', 1090, 'Canadiense', 'emilio.vn@ejemplo.com', '5500000014', 'Nuevo'],
  ['Lucía', 'Reyes Fuentes', 1087, 'Mexicana', 'lucia.reyes@ejemplo.com', '5500000015', 'Regular'],
  ['Andrés', 'Ortega Salas', 1083, 'Mexicana', 'andres.os@ejemplo.com', '5500000016', 'Bueno'],
  ['Regina', 'Aguilar Mora', 1080, 'Mexicana', 'regina.am@ejemplo.com', '5500000017', 'Excelente'],
  ['Tomás', 'Delgado Paz', 1076, 'Mexicana', 'tomas.dp@ejemplo.com', '5500000018', 'Regular'],
  ['Ximena', 'Cabrera Luna', 1072, 'Mexicana', 'ximena.cl@ejemplo.com', '5500000019', 'Nuevo'],
  ['Diego', 'Santos Ibarra', 1069, 'Mexicana', 'diego.si@ejemplo.com', '5500000020', 'Bueno'],
].map((r, i) => ({ id: 'c' + r[2], name: r[0], last: r[1], nuc: r[2], nat: r[3], email: r[4], phone: r[5], score: r[6] }));

/* Contratos que vencen hoy (DUE_TODAY_NUCS de su clientsRedesign.mocks.ts) */
const DUE_TODAY_NUCS = [1131, 1127, 1101, 1098, 1083, 1080];

/* Clientes de otras fuentes (EXTERNAL_CLIENTS_MOCK). Los ids son opacos: la URL de Cliente nuevo usa ?cargar=<id>, no el correo */
const EXT_CLI = [
  { id: 'mk-1', src: 'mk', name: 'Valeria', last: 'Ortiz Campos', nat: 'Mexicana', email: 'valeria.ortiz@ejemplo.com', phone: '5500000101', ref: 'Registrada en mar 2026' },
  { id: 'mk-2', src: 'mk', name: 'Fernanda', last: 'Ríos Luna', nat: 'Mexicana', email: 'fer.rios@ejemplo.com', phone: '5500000102', ref: 'Registrada en ago 2026' },
  { id: 'red-1', src: 'red', name: 'Raúl', last: 'Campos Medina', nat: 'Mexicana', email: 'raul.campos@ejemplo.com', phone: '5500000201', casa: 'Monte Cristo', ref: 'Monte Cristo · NUC 2214' },
  { id: 'red-2', src: 'red', name: 'Jorge', last: 'Salinas Paz', nat: 'Mexicana', email: 'jorge.salinas@ejemplo.com', phone: '5500000202', casa: 'Prenda Fácil', ref: 'Prenda Fácil · NUC 0873' },
];
const EXT_SRC = { mk: 'Marketplace', red: 'Red ataskate' };

/* ---------- Guardado temporal del prototipo (createdClients.ts y profileEdits.ts): sessionStorage, solo esta pestaña ---------- */
const CLI_KEYS = { created: 'ataskate-ux-created-clients', last: 'ataskate-ux-last-created-client', edits: 'ataskate-ux-edited-profiles' };
const cliRead = (key, fallback) => { try { const raw = sessionStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch (e) { return fallback; } };
const cliWrite = (key, value) => { try { sessionStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* el navegador bloquea el almacenamiento */ } };
const getCreatedClients = () => cliRead(CLI_KEYS.created, []);
const saveCreatedClient = c => { cliWrite(CLI_KEYS.created, [c, ...getCreatedClients()]); try { sessionStorage.setItem(CLI_KEYS.last, c.id); } catch (e) {} };
/* Devuelve el último cliente creado una sola vez, para resaltarlo al volver a la lista */
const takeLastCreatedId = () => { try { const id = sessionStorage.getItem(CLI_KEYS.last); sessionStorage.removeItem(CLI_KEYS.last); return id; } catch (e) { return null; } };
/* buildCreatedClient: NUC = el mayor + 1; el cliente nace con score Nuevo y con el modo con el que se registró */
const buildCreatedClient = (d, mode) => {
  const nuc = Math.max(0, ...[...getCreatedClients(), ...CLIENTES].map(c => c.nuc)) + 1;
  return { id: `nuevo-${nuc}`, name: d.name.trim(), last: [d.lastName, d.secondLastName].filter(Boolean).join(' ').trim(), nuc, nat: d.nat, email: d.email.trim().toLowerCase(), phone: d.phone, score: 'Nuevo', mode };
};
const getEditedProfile = id => cliRead(CLI_KEYS.edits, {})[id];
const saveEditedProfile = p => cliWrite(CLI_KEYS.edits, { ...cliRead(CLI_KEYS.edits, {}), [p.id]: p });

/* ---------- Formatos (profile.helpers.ts) ---------- */
const clEsc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const formatMXN = n => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);
const onlyDigits = s => String(s || '').replace(/\D/g, '');
/* 5512345678 → 55 1234 5678 */
const formatPhone = p => { const d = onlyDigits(p); return d.length === 10 ? `${d.slice(0, 2)} ${d.slice(2, 6)} ${d.slice(6)}` : p; };
const fullName = c => [c.name, c.lastName ?? c.last].filter(Boolean).join(' ');
const getInitials = (a, b) => ((a || '')[0] || '').toUpperCase() + ((b || '')[0] || '').toUpperCase();
const sumAmounts = a => a.pawn + a.loan + a.layaway;

/* ---------- Mocks del perfil (profile.mocks.ts, profileOperations.mocks.ts, profilePhotos.mocks.ts) ---------- */
const OP_CONTRATOS = [
  { id: 'k1', status: 'Por vencer', cells: { folio: 'EMP-024583', articles: 'Anillo de oro 14k, cadena', loan: '$8,500.00', renewal: '$1,020.00', redemption: '$9,520.00', dueDate: '18/10/2026', branch: 'Sucursal Centro' } },
  { id: 'k2', status: 'Vigente', cells: { folio: 'EMP-024611', articles: 'iPhone 15 Pro 256 GB', loan: '$12,000.00', renewal: '$1,440.00', redemption: '$13,440.00', dueDate: '02/11/2026', branch: 'Sucursal Centro' } },
  { id: 'k3', status: 'Vencido', cells: { folio: 'EMP-023977', articles: 'Laptop Dell Latitude 7440, cargador, mochila y mouse inalámbrico', loan: '$6,200.00', renewal: '$744.00', redemption: '$6,944.00', dueDate: '30/09/2026', branch: 'Sucursal Tijuana' } },
  { id: 'k4', status: 'Desempeñado', cells: { folio: 'EMP-022140', articles: 'Reloj Tissot PRX', loan: '$4,800.00', renewal: '$576.00', redemption: '$5,376.00', dueDate: '14/07/2026', branch: 'Sucursal Centro' } },
];
const OP_TRANSACCIONES = [
  { id: 't1', status: 'Pagado', cells: { folio: 'REF-009341', date: '12/10/2026 11:42', operation: 'Refrendo', amount: '$1,020.00', method: 'Efectivo', branch: 'Sucursal Centro' } },
  { id: 't2', status: 'Pagado', cells: { folio: 'DES-004512', date: '14/07/2026 17:05', operation: 'Desempeño', amount: '$5,376.00', method: 'Tarjeta ****9785', branch: 'Sucursal Centro' } },
  { id: 't3', status: 'Devolución', cells: { folio: 'VTA-018220', date: '03/06/2026 13:18', operation: 'Compra', amount: '$3,200.00', method: 'Tarjeta ****2345', branch: 'Sucursal Mérida' } },
  { id: 't4', status: 'Pagado', cells: { folio: 'APT-002931', date: '21/05/2026 10:09', operation: 'Abono de apartado', amount: '$1,500.00', method: 'Transferencia', branch: 'Sucursal Centro' } },
];
const OP_VENTA_TRANSACCIONES = [
  { id: 's1', status: 'Pagado', cells: { folio: 'VTA-019034', date: '09/10/2026 16:30', operation: 'Compra', amount: '$18,450.00', method: 'Tarjeta ****4410', branch: 'Sucursal Centro' } },
  { id: 's2', status: 'Pagado', cells: { folio: 'APT-003117', date: '28/09/2026 12:02', operation: 'Abono de apartado', amount: '$2,000.00', method: 'Efectivo', branch: 'Sucursal Centro' } },
];
const OP_VENTA_ORDENES = [
  { id: 'o1', status: 'Entregado', cells: { folio: 'ORD-031502', date: '09/10/2026', articles: 'Esclava de oro 10k', total: '$18,450.00', channel: 'Sucursal Centro' } },
  { id: 'o2', status: 'Pendiente', cells: { folio: 'ORD-031288', date: '28/09/2026', articles: 'Consola PlayStation 5, 2 controles', total: '$9,800.00', channel: 'Apartado en sucursal' } },
];
const OP_MARKETPLACE = [
  { id: 'm1', status: 'En camino', cells: { folio: 'MKT-104223', date: '11/10/2026', articles: 'Anillo de compromiso oro blanco 0.30 ct', total: '$14,999.00', channel: 'Marketplace' } },
  { id: 'm2', status: 'Entregado', cells: { folio: 'MKT-101870', date: '02/08/2026', articles: 'Audífonos AirPods Pro', total: '$3,499.00', channel: 'Marketplace' } },
  { id: 'm3', status: 'Cancelado', cells: { folio: 'MKT-099412', date: '15/06/2026', articles: 'Bolsa Michael Kors', total: '$2,150.00', channel: 'Marketplace' } },
];
/* NUCs de la lista mock que se registraron para venta; el resto son de empeño */
const SALE_CLIENT_NUCS = [1129, 1118, 1105, 1087, 1072];
const PERFIL_CDMX = { street: 'Av. Insurgentes Sur', exterior: '1458', interior: 'Depto. 302', colony: 'Actipan', municipality: 'Benito Juárez', state: 'Ciudad de México', postalCode: '03230' };
const PERFIL_PAWN_FULL = {
  address: PERFIL_CDMX,
  personal: { civil: 'Casado(a)', gender: 'Femenino', nationality: 'Mexicana', birthDate: '12/04/1988', curp: 'GORM880412MDFMZR09', rfc: 'GORM880412AB1', activity: 'Comercio' },
  labor: { status: 'Empleado(a)', company: 'Farmacias del Valle S.A. de C.V.', position: 'Gerente de tienda', seniority: 'Más de 3 años', monthlyIncome: 24500, companyPhone: '5552803410' },
  identification: { type: 'INE', number: '0747116375842', issuedAt: '15/03/2021', validUntil: '31/12/2031', expired: false, hasFront: true, hasBack: true },
  addressProof: { type: 'Recibo de luz', validUntil: '30/11/2026' },
  incomeProof: { type: 'Recibo de nómina' },
  cotitulares: [
    { id: 'co1', name: 'Roberto', lastName: 'Gómez Salinas', relationship: 'Cónyuge', phone: '5512345678', role: 'Cotitular' },
    { id: 'co2', name: 'Sofía', lastName: 'Gómez Ruiz', relationship: 'Hijo(a)', role: 'Beneficiario' },
  ],
  fingerprints: ['Pulgar derecho', 'Índice derecho', 'Pulgar izquierdo', 'Índice izquierdo'],
  summary: { debt: { pawn: 26700, loan: 15000, layaway: 3300 }, otherHousesDebt: { pawn: 4200, loan: 0, layaway: 0 }, income: { pawn: 12400, loan: 3600, layaway: 2000 } },
  contracts: [
    { id: 'q1', folio: 'EMP-024583', dueDate: '18/10/2026', status: 'Por vencer', renewal: 1020, redemption: 9520, articles: ['Anillo de oro 14k', 'Cadena'] },
    { id: 'q2', folio: 'EMP-024611', dueDate: '02/11/2026', status: 'Vigente', renewal: 1440, redemption: 13440, articles: ['iPhone 15 Pro 256 GB'] },
    { id: 'q3', folio: 'EMP-023977', dueDate: '30/09/2026', status: 'Vencido', renewal: 744, redemption: 6944, articles: ['Laptop Dell Latitude 7440', 'Cargador', 'Mochila'] },
    { id: 'q4', folio: 'EMP-024702', dueDate: '20/11/2026', status: 'Vigente', renewal: 384, redemption: 3584, articles: ['Taladro DeWalt 20V'] },
  ],
  // apartados vigentes (Figma "Carrito - Pasarela de pago", Acciones rápidas: Cuota / Liquidación / Artículo / Cuotas · Pagar cuota)
  layaways: [{ id: 'l1', folio: 'APT-003114', dueDate: '25/10/2026', status: 'Vigente', fee: 1000, payoff: 6000, paid: 4, of: 12, article: 'Smart Band Watch Very Fit Pro M3 Negro' }],
  operations: { contratos: OP_CONTRATOS, transacciones: OP_TRANSACCIONES },
};
/* Empeño con datos incompletos: sin laboral, sin cotitulares, sin huellas e INE vencida */
const PERFIL_PAWN_PARTIAL = {
  address: { street: 'Calle 60', exterior: '491-A', colony: 'Centro', municipality: 'Mérida', state: 'Yucatán', postalCode: '97000' },
  personal: { civil: 'Soltero(a)', nationality: 'Mexicana', birthDate: '03/09/1996', curp: 'MALA960903MYNRRN04', rfc: 'MALA960903KQ2', activity: 'Servicios profesionales' },
  identification: { type: 'INE', number: '1029384756102', issuedAt: '10/01/2016', validUntil: '31/12/2025', expired: true, hasFront: true, hasBack: false },
  summary: { debt: { pawn: 2900, loan: 0, layaway: 0 }, income: { pawn: 540, loan: 0, layaway: 0 } },
  contracts: [{ id: 'q5', folio: 'EMP-024799', dueDate: '16/10/2026', status: 'Por vencer', renewal: 348, redemption: 3248, articles: ['Arracadas de oro 10k'] }],
  operations: { contratos: OP_CONTRATOS.slice(0, 1), transacciones: [] },
};
const PERFIL_SALE = {
  address: { street: 'Av. Juárez', exterior: '118', interior: 'Int. 4', colony: 'Centro', municipality: 'Guadalajara', state: 'Jalisco', postalCode: '44100' },
  operations: { ordenes: OP_VENTA_ORDENES, transacciones: OP_VENTA_TRANSACCIONES },
};
const PERFIL_DETALLES = { c1131: PERFIL_PAWN_FULL, c1127: PERFIL_PAWN_PARTIAL, c1129: PERFIL_SALE };
const PERFIL_DEFAULT = { venta: PERFIL_SALE, empeno: { ...PERFIL_PAWN_FULL, cotitulares: [], labor: undefined } };

/* getClientProfile (profile.helpers.ts): primero lo editado, luego Marketplace, luego los creados y al final la lista.
   TODO de su código: el cliente de Red ataskate no tiene perfil, sus datos están protegidos hasta cargarlo con verificación */
function getClientProfile(id) {
  const edited = getEditedProfile(id);
  if (edited) return edited;
  const mk = EXT_CLI.find(c => c.id === id && c.src === 'mk');
  if (mk) return { id: mk.id, type: 'marketplace', name: mk.name, lastName: mk.last, email: mk.email, phone: mk.phone, operations: { ordenes: OP_MARKETPLACE } };
  const base = c => ({ id: c.id, name: c.name, lastName: c.last, email: c.email, phone: c.phone, nuc: c.nuc, score: c.score });
  const created = getCreatedClients().find(c => c.id === id);
  if (created) { const type = created.mode || 'empeno'; return { ...base(created), type, personal: type === 'empeno' ? { nationality: created.nat } : undefined, operations: {} }; }
  const own = CLIENTES.find(c => c.id === id);
  if (!own) return null;
  const type = SALE_CLIENT_NUCS.includes(own.nuc) ? 'venta' : 'empeno';
  const detail = PERFIL_DETALLES[own.id] || PERFIL_DEFAULT[type];
  const personal = type === 'empeno' ? { ...detail.personal, nationality: own.nat } : undefined;
  return { ...base(own), ...detail, type, personal };
}

/* Aviso que debe verse en la pantalla a la que se navega (su toast global): Editar cliente → "Cambios guardados" en el perfil */
const setPendingToast = (title, message) => { try { sessionStorage.setItem('ataskate-ux-pending-toast', JSON.stringify({ title, message })); } catch (e) {} };
const takePendingToast = () => { try { const v = JSON.parse(sessionStorage.getItem('ataskate-ux-pending-toast') || 'null'); sessionStorage.removeItem('ataskate-ux-pending-toast'); return v; } catch (e) { return null; } };
