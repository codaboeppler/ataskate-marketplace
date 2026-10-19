/* Inicio operativo (Home op) por rol · prototipo de Product Design (UX), rama del equipo.
   Reconstrucción estática de src/components/PosPreview/InicioOperativo (commits 4b51aba28 y 995acb9fd del repo
   el repo del equipo). Mismos textos, mocks, reglas por rol, estados de tarjeta y parámetros de URL:
   ?rol=dueno|gerente|cajero|valuador&escenario=datos|vacio|cargando|error&sucursal=todas|Centro|…&cajas=sin|abiertas|corte&vista=estados|matriz
   La barra negra flotante de su React vive aquí en el panel "Estados de la maqueta" (../demo.js). */
(() => {
  /* ---------- Íconos del DS (src/design-system/Icons/Icons.tsx), con fill currentColor ---------- */
  const ICO = {
    DeployedCode: ["0 0 24 24", "<path d=\"M11.2492 19.5691V12.4306L4.99921 8.81135V15.7769C4.99921 15.828 5.01204 15.8761 5.03771 15.9211C5.06337 15.9659 5.10179 16.0044 5.15296 16.0364L11.2492 19.5691ZM12.7492 19.5691L18.8455 16.0364C18.8966 16.0044 18.935 15.9659 18.9607 15.9211C18.9864 15.8761 18.9992 15.828 18.9992 15.7769V8.81135L12.7492 12.4306V19.5691ZM11.9992 11.1384L18.1742 7.5691L12.153 4.08635C12.1018 4.05435 12.0505 4.03835 11.9992 4.03835C11.9479 4.03835 11.8966 4.05435 11.8455 4.08635L5.82421 7.5691L11.9992 11.1384ZM4.40321 17.3536C4.11854 17.1896 3.89671 16.9704 3.73771 16.6961C3.57871 16.4216 3.49921 16.1203 3.49921 15.7921V8.2076C3.49921 7.87944 3.57871 7.5781 3.73771 7.3036C3.89671 7.02927 4.11854 6.8101 4.40321 6.6461L11.0955 2.7941C11.38 2.62994 11.6812 2.54785 11.9992 2.54785C12.3172 2.54785 12.6185 2.62994 12.903 2.7941L19.5952 6.6461C19.8799 6.8101 20.1017 7.02927 20.2607 7.3036C20.4197 7.5781 20.4992 7.87944 20.4992 8.2076V15.7921C20.4992 16.1203 20.4197 16.4216 20.2607 16.6961C20.1017 16.9704 19.8799 17.1896 19.5952 17.3536L12.903 21.2056C12.6185 21.3698 12.3172 21.4519 11.9992 21.4519C11.6812 21.4519 11.38 21.3698 11.0955 21.2056L4.40321 17.3536Z\" fill=\"currentColor\"/>"],
    LocalShipping: ["0 0 24 24", "<path d=\"M6 20C5.16667 20 4.45833 19.7083 3.875 19.125C3.29167 18.5417 3 17.8333 3 17H1V6C1 5.45 1.196 4.97933 1.588 4.588C1.97933 4.196 2.45 4 3 4H17V8H20L23 12V17H21C21 17.8333 20.7083 18.5417 20.125 19.125C19.5417 19.7083 18.8333 20 18 20C17.1667 20 16.4583 19.7083 15.875 19.125C15.2917 18.5417 15 17.8333 15 17H9C9 17.8333 8.70833 18.5417 8.125 19.125C7.54167 19.7083 6.83333 20 6 20ZM6 18C6.28333 18 6.521 17.904 6.713 17.712C6.90433 17.5207 7 17.2833 7 17C7 16.7167 6.90433 16.4793 6.713 16.288C6.521 16.096 6.28333 16 6 16C5.71667 16 5.479 16.096 5.287 16.288C5.09567 16.4793 5 16.7167 5 17C5 17.2833 5.09567 17.5207 5.287 17.712C5.479 17.904 5.71667 18 6 18ZM3 15H3.8C4.08333 14.7 4.40833 14.4583 4.775 14.275C5.14167 14.0917 5.55 14 6 14C6.45 14 6.85833 14.0917 7.225 14.275C7.59167 14.4583 7.91667 14.7 8.2 15H15V6H3V15ZM18 18C18.2833 18 18.5207 17.904 18.712 17.712C18.904 17.5207 19 17.2833 19 17C19 16.7167 18.904 16.4793 18.712 16.288C18.5207 16.096 18.2833 16 18 16C17.7167 16 17.4793 16.096 17.288 16.288C17.096 16.4793 17 16.7167 17 17C17 17.2833 17.096 17.5207 17.288 17.712C17.4793 17.904 17.7167 18 18 18ZM17 13H21.25L19 10H17V13Z\" fill=\"currentColor\"/>"],
    Documents: ["0 0 24 24", "<path d=\"M6 22C5.45 22 4.97917 21.8042 4.5875 21.4125C4.19583 21.0208 4 20.55 4 20V4C4 3.45 4.19583 2.97917 4.5875 2.5875C4.97917 2.19583 5.45 2 6 2H14L20 8V20C20 20.55 19.8042 21.0208 19.4125 21.4125C19.0208 21.8042 18.55 22 18 22H6ZM13 9V4H6V20H18V9H13Z\" fill=\"currentColor\"/>"],
    AddPhotoAlternate: ["0 0 24 24", "<path d=\"M5 21C4.45 21 3.97917 20.8042 3.5875 20.4125C3.19583 20.0208 3 19.55 3 19V5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3H13V5H5V19H19V11H21V19C21 19.55 20.8042 20.0208 20.4125 20.4125C20.0208 20.8042 19.55 21 19 21H5ZM6 17H18L14.25 12L11.25 16L9 13L6 17ZM17 9V7H15V5H17V3H19V5H21V7H19V9H17Z\" fill=\"currentColor\"/>"],
    PointOfSale: ["0 0 24 24", "<path d=\"M7 8C6.45 8 5.97933 7.804 5.588 7.412C5.196 7.02067 5 6.55 5 6V4C5 3.45 5.196 2.979 5.588 2.587C5.97933 2.19567 6.45 2 7 2H17C17.55 2 18.021 2.19567 18.413 2.587C18.8043 2.979 19 3.45 19 4V6C19 6.55 18.8043 7.02067 18.413 7.412C18.021 7.804 17.55 8 17 8H7ZM7 6H17V4H7V6ZM4 22C3.45 22 2.97933 21.8043 2.588 21.413C2.196 21.021 2 20.55 2 20V19H22V20C22 20.55 21.8043 21.021 21.413 21.413C21.021 21.8043 20.55 22 20 22H4ZM2 18L5.475 10.175C5.64167 9.80833 5.88767 9.52067 6.213 9.312C6.53767 9.104 6.9 9 7.3 9H16.7C17.1 9 17.4627 9.104 17.788 9.312C18.1127 9.52067 18.3583 9.80833 18.525 10.175L22 18H2ZM8.5 16H9.5C9.63333 16 9.75 15.95 9.85 15.85C9.95 15.75 10 15.6333 10 15.5C10 15.3667 9.95 15.25 9.85 15.15C9.75 15.05 9.63333 15 9.5 15H8.5C8.36667 15 8.25 15.05 8.15 15.15C8.05 15.25 8 15.3667 8 15.5C8 15.6333 8.05 15.75 8.15 15.85C8.25 15.95 8.36667 16 8.5 16ZM8.5 14H9.5C9.63333 14 9.75 13.95 9.85 13.85C9.95 13.75 10 13.6333 10 13.5C10 13.3667 9.95 13.25 9.85 13.15C9.75 13.05 9.63333 13 9.5 13H8.5C8.36667 13 8.25 13.05 8.15 13.15C8.05 13.25 8 13.3667 8 13.5C8 13.6333 8.05 13.75 8.15 13.85C8.25 13.95 8.36667 14 8.5 14ZM8.5 12H9.5C9.63333 12 9.75 11.95 9.85 11.85C9.95 11.75 10 11.6333 10 11.5C10 11.3667 9.95 11.25 9.85 11.15C9.75 11.05 9.63333 11 9.5 11H8.5C8.36667 11 8.25 11.05 8.15 11.15C8.05 11.25 8 11.3667 8 11.5C8 11.6333 8.05 11.75 8.15 11.85C8.25 11.95 8.36667 12 8.5 12ZM11.5 16H12.5C12.6333 16 12.75 15.95 12.85 15.85C12.95 15.75 13 15.6333 13 15.5C13 15.3667 12.95 15.25 12.85 15.15C12.75 15.05 12.6333 15 12.5 15H11.5C11.3667 15 11.25 15.05 11.15 15.15C11.05 15.25 11 15.3667 11 15.5C11 15.6333 11.05 15.75 11.15 15.85C11.25 15.95 11.3667 16 11.5 16ZM11.5 14H12.5C12.6333 14 12.75 13.95 12.85 13.85C12.95 13.75 13 13.6333 13 13.5C13 13.3667 12.95 13.25 12.85 13.15C12.75 13.05 12.6333 13 12.5 13H11.5C11.3667 13 11.25 13.05 11.15 13.15C11.05 13.25 11 13.3667 11 13.5C11 13.6333 11.05 13.75 11.15 13.85C11.25 13.95 11.3667 14 11.5 14ZM11.5 12H12.5C12.6333 12 12.75 11.95 12.85 11.85C12.95 11.75 13 11.6333 13 11.5C13 11.3667 12.95 11.25 12.85 11.15C12.75 11.05 12.6333 11 12.5 11H11.5C11.3667 11 11.25 11.05 11.15 11.15C11.05 11.25 11 11.3667 11 11.5C11 11.6333 11.05 11.75 11.15 11.85C11.25 11.95 11.3667 12 11.5 12ZM14.5 16H15.5C15.6333 16 15.75 15.95 15.85 15.85C15.95 15.75 16 15.6333 16 15.5C16 15.3667 15.95 15.25 15.85 15.15C15.75 15.05 15.6333 15 15.5 15H14.5C14.3667 15 14.25 15.05 14.15 15.15C14.05 15.25 14 15.3667 14 15.5C14 15.6333 14.05 15.75 14.15 15.85C14.25 15.95 14.3667 16 14.5 16ZM14.5 14H15.5C15.6333 14 15.75 13.95 15.85 13.85C15.95 13.75 16 13.6333 16 13.5C16 13.3667 15.95 13.25 15.85 13.15C15.75 13.05 15.6333 13 15.5 13H14.5C14.3667 13 14.25 13.05 14.15 13.15C14.05 13.25 14 13.3667 14 13.5C14 13.6333 14.05 13.75 14.15 13.85C14.25 13.95 14.3667 14 14.5 14ZM14.5 12H15.5C15.6333 12 15.75 11.95 15.85 11.85C15.95 11.75 16 11.6333 16 11.5C16 11.3667 15.95 11.25 15.85 11.15C15.75 11.05 15.6333 11 15.5 11H14.5C14.3667 11 14.25 11.05 14.15 11.15C14.05 11.25 14 11.3667 14 11.5C14 11.6333 14.05 11.75 14.15 11.85C14.25 11.95 14.3667 12 14.5 12Z\" fill=\"currentColor\"/>"],
    Receipt: ["0 0 24 24", "<path d=\"M6 22C5.16667 22 4.45833 21.7083 3.875 21.125C3.29167 20.5417 3 19.8333 3 19V16H6V2L7.5 3.5L9 2L10.5 3.5L12 2L13.5 3.5L15 2L16.5 3.5L18 2L19.5 3.5L21 2V19C21 19.8333 20.7083 20.5417 20.125 21.125C19.5417 21.7083 18.8333 22 18 22H6ZM18 20C18.2833 20 18.5208 19.9042 18.7125 19.7125C18.9042 19.5208 19 19.2833 19 19V5H8V16H17V19C17 19.2833 17.0958 19.5208 17.2875 19.7125C17.4792 19.9042 17.7167 20 18 20ZM9 9V7H15V9H9ZM9 12V10H15V12H9ZM17 9C16.7167 9 16.4792 8.90417 16.2875 8.7125C16.0958 8.52083 16 8.28333 16 8C16 7.71667 16.0958 7.47917 16.2875 7.2875C16.4792 7.09583 16.7167 7 17 7C17.2833 7 17.5208 7.09583 17.7125 7.2875C17.9042 7.47917 18 7.71667 18 8C18 8.28333 17.9042 8.52083 17.7125 8.7125C17.5208 8.90417 17.2833 9 17 9ZM17 12C16.7167 12 16.4792 11.9042 16.2875 11.7125C16.0958 11.5208 16 11.2833 16 11C16 10.7167 16.0958 10.4792 16.2875 10.2875C16.4792 10.0958 16.7167 10 17 10C17.2833 10 17.5208 10.0958 17.7125 10.2875C17.9042 10.4792 18 10.7167 18 11C18 11.2833 17.9042 11.5208 17.7125 11.7125C17.5208 11.9042 17.2833 12 17 12ZM6 20H15V18H5V19C5 19.2833 5.09583 19.5208 5.2875 19.7125C5.47917 19.9042 5.71667 20 6 20Z\" fill=\"currentColor\"/>"],
    Sell: ["0 0 24 24", "<path d=\"M12.85 22C12.5667 22 12.3 21.9457 12.05 21.837C11.8 21.729 11.5833 21.5833 11.4 21.4L2.6 12.6C2.41667 12.4167 2.271 12.2 2.163 11.95C2.05433 11.7 2 11.4333 2 11.15V4C2 3.45 2.196 2.979 2.588 2.587C2.97933 2.19567 3.45 2 4 2H11.15C11.4333 2 11.7 2.054 11.95 2.162C12.2 2.27067 12.4167 2.41667 12.6 2.6L21.4 11.425C21.7833 11.8083 21.975 12.279 21.975 12.837C21.975 13.3957 21.7833 13.8667 21.4 14.25L14.25 21.4C14.0667 21.5833 13.8543 21.729 13.613 21.837C13.371 21.9457 13.1167 22 12.85 22ZM12.825 20L19.975 12.85L11.15 4H4V11.15L12.825 20ZM6.5 8C6.91667 8 7.27067 7.854 7.562 7.562C7.854 7.27067 8 6.91667 8 6.5C8 6.08333 7.854 5.72933 7.562 5.438C7.27067 5.146 6.91667 5 6.5 5C6.08333 5 5.72933 5.146 5.438 5.438C5.146 5.72933 5 6.08333 5 6.5C5 6.91667 5.146 7.27067 5.438 7.562C5.72933 7.854 6.08333 8 6.5 8Z\" fill=\"currentColor\"/>"],
    AccountCircle: ["0 0 24 24", "<path d=\"M5.85 17.1C6.7 16.45 7.65 15.9373 8.7 15.562C9.75 15.1873 10.85 15 12 15C13.15 15 14.25 15.1873 15.3 15.562C16.35 15.9373 17.3 16.45 18.15 17.1C18.7333 16.4167 19.1877 15.6417 19.513 14.775C19.8377 13.9083 20 12.9833 20 12C20 9.78333 19.221 7.89567 17.663 6.337C16.1043 4.779 14.2167 4 12 4C9.78333 4 7.896 4.779 6.338 6.337C4.77933 7.89567 4 9.78333 4 12C4 12.9833 4.16267 13.9083 4.488 14.775C4.81267 15.6417 5.26667 16.4167 5.85 17.1ZM12 13C11.0167 13 10.1873 12.6627 9.512 11.988C8.83733 11.3127 8.5 10.4833 8.5 9.5C8.5 8.51667 8.83733 7.68733 9.512 7.012C10.1873 6.33733 11.0167 6 12 6C12.9833 6 13.8127 6.33733 14.488 7.012C15.1627 7.68733 15.5 8.51667 15.5 9.5C15.5 10.4833 15.1627 11.3127 14.488 11.988C13.8127 12.6627 12.9833 13 12 13ZM12 22C10.6167 22 9.31667 21.7373 8.1 21.212C6.88333 20.6873 5.825 19.975 4.925 19.075C4.025 18.175 3.31267 17.1167 2.788 15.9C2.26267 14.6833 2 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31267 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.31233 8.1 2.787C9.31667 2.26233 10.6167 2 12 2C13.3833 2 14.6833 2.26233 15.9 2.787C17.1167 3.31233 18.175 4.025 19.075 4.925C19.975 5.825 20.6873 6.88333 21.212 8.1C21.7373 9.31667 22 10.6167 22 12C22 13.3833 21.7373 14.6833 21.212 15.9C20.6873 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6873 15.9 21.212C14.6833 21.7373 13.3833 22 12 22ZM12 20C12.8833 20 13.7167 19.871 14.5 19.613C15.2833 19.3543 16 18.9833 16.65 18.5C16 18.0167 15.2833 17.6457 14.5 17.387C13.7167 17.129 12.8833 17 12 17C11.1167 17 10.2833 17.129 9.5 17.387C8.71667 17.6457 8 18.0167 7.35 18.5C8 18.9833 8.71667 19.3543 9.5 19.613C10.2833 19.871 11.1167 20 12 20ZM12 11C12.4333 11 12.7917 10.8583 13.075 10.575C13.3583 10.2917 13.5 9.93333 13.5 9.5C13.5 9.06667 13.3583 8.70833 13.075 8.425C12.7917 8.14167 12.4333 8 12 8C11.5667 8 11.2083 8.14167 10.925 8.425C10.6417 8.70833 10.5 9.06667 10.5 9.5C10.5 9.93333 10.6417 10.2917 10.925 10.575C11.2083 10.8583 11.5667 11 12 11Z\" fill=\"currentColor\"/>"],
    ArrowForward: ["0 0 24 24", "<path d=\"M12 20L10.575 18.6L16.175 13H4V11H16.175L10.575 5.4L12 4L20 12L12 20Z\" fill=\"currentColor\"/>"],
    EstadosError: ["48 156 24 24", "<path d=\"M60 178C58.6167 178 57.3167 177.737 56.1 177.212C54.8833 176.687 53.825 175.975 52.925 175.075C52.025 174.175 51.3127 173.117 50.788 171.9C50.2627 170.683 50 169.383 50 168C50 166.617 50.2627 165.317 50.788 164.1C51.3127 162.883 52.025 161.825 52.925 160.925C53.825 160.025 54.8833 159.312 56.1 158.787C57.3167 158.262 58.6167 158 60 158C61.3833 158 62.6833 158.262 63.9 158.787C65.1167 159.312 66.175 160.025 67.075 160.925C67.975 161.825 68.6873 162.883 69.212 164.1C69.7373 165.317 70 166.617 70 168C70 169.383 69.7373 170.683 69.212 171.9C68.6873 173.117 67.975 174.175 67.075 175.075C66.175 175.975 65.1167 176.687 63.9 177.212C62.6833 177.737 61.3833 178 60 178ZM56.4 173L60 169.4L63.6 173L65 171.6L61.4 168L65 164.4L63.6 163L60 166.6L56.4 163L55 164.4L58.6 168L55 171.6L56.4 173Z\" fill=\"currentColor\"/>"],
    Sync: ["0 0 24 24", "<path d=\"M4 20V18H6.75L6.35 17.65C5.48333 16.8833 4.875 16.0083 4.525 15.025C4.175 14.0417 4 13.05 4 12.05C4 10.2 4.554 8.554 5.662 7.112C6.77067 5.67067 8.21667 4.71667 10 4.25V6.35C8.8 6.78333 7.83333 7.52067 7.1 8.562C6.36667 9.604 6 10.7667 6 12.05C6 12.8 6.14167 13.529 6.425 14.237C6.70833 14.9457 7.15 15.6 7.75 16.2L8 16.45V14H10V20H4ZM14 19.75V17.65C15.2 17.2167 16.1667 16.4793 16.9 15.438C17.6333 14.396 18 13.2333 18 11.95C18 11.2 17.8583 10.4707 17.575 9.762C17.2917 9.054 16.85 8.4 16.25 7.8L16 7.55V10H14V4H20V6H17.25L17.65 6.35C18.4667 7.16667 19.0627 8.054 19.438 9.012C19.8127 9.97067 20 10.95 20 11.95C20 13.8 19.4457 15.4457 18.337 16.887C17.229 18.329 15.7833 19.2833 14 19.75Z\" fill=\"currentColor\"/>"],
    EstadosSuccess: ["96 156 24 24", "<path d=\"M108 178C106.617 178 105.317 177.737 104.1 177.212C102.883 176.687 101.825 175.975 100.925 175.075C100.025 174.175 99.3127 173.117 98.788 171.9C98.2627 170.683 98 169.383 98 168C98 166.617 98.2627 165.317 98.788 164.1C99.3127 162.883 100.025 161.825 100.925 160.925C101.825 160.025 102.883 159.312 104.1 158.787C105.317 158.262 106.617 158 108 158C109.383 158 110.683 158.262 111.9 158.787C113.117 159.312 114.175 160.025 115.075 160.925C115.975 161.825 116.687 162.883 117.212 164.1C117.737 165.317 118 166.617 118 168C118 169.383 117.737 170.683 117.212 171.9C116.687 173.117 115.975 174.175 115.075 175.075C114.175 175.975 113.117 176.687 111.9 177.212C110.683 177.737 109.383 178 108 178ZM106.6 172.6L113.65 165.55L112.25 164.15L106.6 169.8L103.75 166.95L102.35 168.35L106.6 172.6Z\" fill=\"currentColor\"/>"],
    Payments: ["0 0 24 24", "<path d=\"M14 13C13.1667 13 12.4583 12.7083 11.875 12.125C11.2917 11.5417 11 10.8333 11 10C11 9.16667 11.2917 8.45833 11.875 7.875C12.4583 7.29167 13.1667 7 14 7C14.8333 7 15.5417 7.29167 16.125 7.875C16.7083 8.45833 17 9.16667 17 10C17 10.8333 16.7083 11.5417 16.125 12.125C15.5417 12.7083 14.8333 13 14 13ZM7 16C6.45 16 5.97933 15.804 5.588 15.412C5.196 15.0207 5 14.55 5 14V6C5 5.45 5.196 4.97933 5.588 4.588C5.97933 4.196 6.45 4 7 4H21C21.55 4 22.021 4.196 22.413 4.588C22.8043 4.97933 23 5.45 23 6V14C23 14.55 22.8043 15.0207 22.413 15.412C22.021 15.804 21.55 16 21 16H7ZM9 14H19C19 13.45 19.1957 12.979 19.587 12.587C19.979 12.1957 20.45 12 21 12V8C20.45 8 19.979 7.804 19.587 7.412C19.1957 7.02067 19 6.55 19 6H9C9 6.55 8.804 7.02067 8.412 7.412C8.02067 7.804 7.55 8 7 8V12C7.55 12 8.02067 12.1957 8.412 12.587C8.804 12.979 9 13.45 9 14ZM20 20H3C2.45 20 1.97933 19.8043 1.588 19.413C1.196 19.021 1 18.55 1 18V7H3V18H20V20Z\" fill=\"currentColor\"/>"],
    CheckCircle: ["0 0 24 24", "<path d=\"M10.6 16.6L17.65 9.55L16.25 8.15L10.6 13.8L7.75 10.95L6.35 12.35L10.6 16.6ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z\" fill=\"currentColor\"/>"],
    Warehouse: ["0 0 20 20", "<path d=\"M9.99999 4.29167L3.33332 6.95833V15.8333H4.99999V10.8333C4.99999 10.375 5.16318 9.98264 5.48957 9.65625C5.81596 9.32986 6.20832 9.16667 6.66666 9.16667H13.3333C13.7917 9.16667 14.184 9.32986 14.5104 9.65625C14.8368 9.98264 15 10.375 15 10.8333V15.8333H16.6667V6.95833L9.99999 4.29167ZM1.66666 15.8333V6.95833C1.66666 6.61111 1.76041 6.29861 1.94791 6.02083C2.13541 5.74306 2.38888 5.54167 2.70832 5.41667L9.37499 2.75C9.56943 2.66667 9.77777 2.625 9.99999 2.625C10.2222 2.625 10.4305 2.66667 10.625 2.75L17.2917 5.41667C17.6111 5.54167 17.8646 5.74306 18.0521 6.02083C18.2396 6.29861 18.3333 6.61111 18.3333 6.95833V15.8333C18.3333 16.2917 18.1701 16.684 17.8437 17.0104C17.5174 17.3368 17.125 17.5 16.6667 17.5H13.3333V10.8333H6.66666V17.5H3.33332C2.87499 17.5 2.48263 17.3368 2.15624 17.0104C1.82985 16.684 1.66666 16.2917 1.66666 15.8333ZM7.49999 17.5V15.8333H9.16666V17.5H7.49999ZM9.16666 15V13.3333H10.8333V15H9.16666ZM10.8333 17.5V15.8333H12.5V17.5H10.8333Z\" fill=\"currentColor\"/>"],
    Storefront: ["0 0 24 24", "<path d=\"M21.0251 11.05V19C21.0251 19.55 20.8293 20.0208 20.4376 20.4125C20.0459 20.8042 19.5751 21 19.0251 21H5.02509C4.47509 21 4.00425 20.8042 3.61259 20.4125C3.22092 20.0208 3.02509 19.55 3.02509 19V11.05C2.64175 10.7 2.34592 10.25 2.13759 9.7C1.92925 9.15 1.92509 8.55 2.12509 7.9L3.17509 4.5C3.30842 4.06667 3.54592 3.70833 3.88759 3.425C4.22925 3.14167 4.62509 3 5.07509 3H18.9751C19.4251 3 19.8168 3.1375 20.1501 3.4125C20.4834 3.6875 20.7251 4.05 20.8751 4.5L21.9251 7.9C22.1251 8.55 22.1209 9.14167 21.9126 9.675C21.7043 10.2083 21.4084 10.6667 21.0251 11.05ZM14.2251 10C14.6751 10 15.0168 9.84583 15.2501 9.5375C15.4834 9.22917 15.5751 8.88333 15.5251 8.5L14.9751 5H13.0251V8.7C13.0251 9.05 13.1418 9.35417 13.3751 9.6125C13.6084 9.87083 13.8918 10 14.2251 10ZM9.72509 10C10.1084 10 10.4209 9.87083 10.6626 9.6125C10.9043 9.35417 11.0251 9.05 11.0251 8.7V5H9.07509L8.52509 8.5C8.45842 8.9 8.54592 9.25 8.78759 9.55C9.02926 9.85 9.34176 10 9.72509 10ZM5.27509 10C5.57509 10 5.83759 9.89167 6.06259 9.675C6.28759 9.45833 6.42509 9.18333 6.47509 8.85L7.02509 5H5.07509L4.07509 8.35C3.97509 8.68333 4.02925 9.04167 4.23759 9.425C4.44592 9.80833 4.79175 10 5.27509 10ZM18.7751 10C19.2584 10 19.6084 9.80833 19.8251 9.425C20.0418 9.04167 20.0918 8.68333 19.9751 8.35L18.9251 5H17.0251L17.5751 8.85C17.6251 9.18333 17.7626 9.45833 17.9876 9.675C18.2126 9.89167 18.4751 10 18.7751 10ZM5.02509 19H19.0251V11.95C18.9418 11.9833 18.8876 12 18.8626 12H18.7751C18.3251 12 17.9293 11.925 17.5876 11.775C17.2459 11.625 16.9084 11.3833 16.5751 11.05C16.2751 11.35 15.9334 11.5833 15.5501 11.75C15.1668 11.9167 14.7584 12 14.3251 12C13.8751 12 13.4543 11.9167 13.0626 11.75C12.6709 11.5833 12.3251 11.35 12.0251 11.05C11.7418 11.35 11.4126 11.5833 11.0376 11.75C10.6626 11.9167 10.2584 12 9.82509 12C9.34175 12 8.90426 11.9167 8.51259 11.75C8.12092 11.5833 7.77509 11.35 7.47509 11.05C7.12509 11.4 6.77925 11.6458 6.43759 11.7875C6.09592 11.9292 5.70842 12 5.27509 12H5.16259C5.12092 12 5.07509 11.9833 5.02509 11.95V19Z\" fill=\"currentColor\"/>"],
    Lock: ["0 0 24 24", "<path d=\"M6 22C5.45 22 4.97917 21.8042 4.5875 21.4125C4.19583 21.0208 4 20.55 4 20V10C4 9.45 4.19583 8.97917 4.5875 8.5875C4.97917 8.19583 5.45 8 6 8H7V6C7 4.61667 7.4875 3.4375 8.4625 2.4625C9.4375 1.4875 10.6167 1 12 1C13.3833 1 14.5625 1.4875 15.5375 2.4625C16.5125 3.4375 17 4.61667 17 6V8H18C18.55 8 19.0208 8.19583 19.4125 8.5875C19.8042 8.97917 20 9.45 20 10V20C20 20.55 19.8042 21.0208 19.4125 21.4125C19.0208 21.8042 18.55 22 18 22H6ZM6 20H18V10H6V20ZM12 17C12.55 17 13.0208 16.8042 13.4125 16.4125C13.8042 16.0208 14 15.55 14 15C14 14.45 13.8042 13.9792 13.4125 13.5875C13.0208 13.1958 12.55 13 12 13C11.45 13 10.9792 13.1958 10.5875 13.5875C10.1958 13.9792 10 14.45 10 15C10 15.55 10.1958 16.0208 10.5875 16.4125C10.9792 16.8042 11.45 17 12 17ZM9 8H15V6C15 5.16667 14.7083 4.45833 14.125 3.875C13.5417 3.29167 12.8333 3 12 3C11.1667 3 10.4583 3.29167 9.875 3.875C9.29167 4.45833 9 5.16667 9 6V8Z\" fill=\"currentColor\"/>"],
    Add: ["0 0 24 24", "<path d=\"M11 19V13H5V11H11V5H13V11H19V13H13V19H11Z\" fill=\"currentColor\"/>"],
    TrendingUp: ["0 0 24 24", "<path d=\"M3.4 18L2 16.6L9.4 9.15L13.4 13.15L18.6 8H16V6H22V12H20V9.4L13.4 16L9.4 12L3.4 18Z\" fill=\"currentColor\"/>"],
    TrendingDown: ["0 0 24 24", "<path d=\"M16 18V16H18.6L13.4 10.85L9.4 14.85L2 7.4L3.4 6L9.4 12L13.4 8L20 14.6V12H22V18H16Z\" fill=\"currentColor\"/>"],
    KeyboardArrowDown: ["0 0 24 24", "<path d=\"M5.7 9.6998L7.1 8.2998L11.7 12.8998L16.3 8.2998L17.7 9.6998L11.7 15.6998L5.7 9.6998Z\" fill=\"currentColor\"/>"],
    WarningFilled: ["0 0 24 24", "<path d=\"M1 21L12 2L23 21H1ZM12 18C12.2833 18 12.5208 17.9042 12.7125 17.7125C12.9042 17.5208 13 17.2833 13 17C13 16.7167 12.9042 16.4792 12.7125 16.2875C12.5208 16.0958 12.2833 16 12 16C11.7167 16 11.4792 16.0958 11.2875 16.2875C11.0958 16.4792 11 16.7167 11 17C11 17.2833 11.0958 17.5208 11.2875 17.7125C11.4792 17.9042 11.7167 18 12 18ZM11 15H13V10H11V15Z\" fill=\"currentColor\"/>"],
  };
  const ico = (n, s = 24) => '<svg viewBox="' + ICO[n][0] + '" width="' + s + '" height="' + s + '" fill="none" aria-hidden="true" focusable="false">' + ICO[n][1] + '</svg>';
  const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  /* ---------- Constantes (inicio.constants.ts) ---------- */
  const TODAS = 'todas';
  const RETRY_MS = 900;      /* "Reintentar" recarga solo esa tarjeta, como en su React */
  const TOAST_MS = 2600;
  const ERROR_CARDS = ['ingresos', 'almoneda'];
  const ROLES = { dueno: 'Dueño', gerente: 'Gerente', cajero: 'Cajero', valuador: 'Valuador' };
  const ESCENARIOS = { datos: 'Con datos', vacio: 'Todo vacío', cargando: 'Cargando', error: 'Con error' };
  const CAJAS = { sin: 'Sin abrir', abiertas: 'Abiertas', corte: 'Con corte' };
  const VISTAS = { prototipo: 'Prototipo', estados: 'Estados', matriz: 'Matriz' };
  const ROLE_MODULES = {
    dueno: ['all', 'pos', 'pawn', 'inventory', 'orders', 'clients', 'analytics'],
    gerente: ['all', 'pos', 'pawn', 'inventory', 'orders', 'clients', 'analytics'],
    cajero: ['all', 'pos', 'pawn', 'inventory', 'orders', 'clients', 'analytics'],
    valuador: ['all', 'pawn', 'inventory', 'orders', 'clients', 'analytics'],
  };
  const MODULE_LABELS = { all: 'Todos', pos: 'Punto de venta', pawn: 'Casa de empeño', inventory: 'Inventario', orders: 'Órdenes', clients: 'Clientes', analytics: 'Analítica' };
  /* Tarjetas en el orden de sus columnas; Descuentos queda fuera de alcance */
  const CARDS = [
    { id: 'atencion', title: 'Requiere atención', module: 'all', column: 0, emptyKind: 'positiva', hasArrow: false },
    { id: 'ingresos', title: 'Ingresos', module: 'pos', column: 0, emptyKind: 'pasiva', hasArrow: true },
    { id: 'flujo', title: 'Flujo de caja', module: 'pos', column: 0, emptyKind: 'accion', hasArrow: true },
    { id: 'tabuladores', title: 'Tabuladores', module: 'pawn', column: 0, emptyKind: 'tabulador', hasArrow: true },
    { id: 'almoneda', title: 'En almoneda', module: 'inventory', column: 1, emptyKind: 'positiva', hasArrow: true },
    { id: 'envejecimiento', title: 'Envejecimiento de inventario', module: 'inventory', column: 1, emptyKind: 'positiva', hasArrow: true },
    { id: 'empenos', title: 'Empeños', module: 'pawn', column: 1, emptyKind: 'accion', hasArrow: true },
    { id: 'depositaria', title: 'Depositaría', module: 'inventory', column: 1, emptyKind: 'pasiva', hasArrow: true },
    { id: 'vencimientos', title: 'Vencimiento de contratos', module: 'pawn', column: 1, emptyKind: 'positiva', hasArrow: true },
    { id: 'plazos', title: 'Plazos', module: 'pawn', column: 2, hasArrow: true },
    { id: 'ordenes', title: 'Estatus de órdenes', module: 'orders', column: 2, emptyKind: 'positiva', hasArrow: true },
    { id: 'tienda', title: 'Tienda en línea', module: 'orders', column: 2, emptyKind: 'pasiva', hasArrow: true },
    { id: 'transferencias', title: 'Inventario en transferencia', module: 'inventory', column: 2, emptyKind: 'pasiva', hasArrow: true },
  ];
  const EMPTY_LABELS = { positiva: 'Vacío positivo', pasiva: 'Vacío pasivo', accion: 'Vacío con acción', tabulador: 'Sin tabulador activo' };
  const EMPTY_CHIP = { positiva: 'verde', pasiva: 'gris', accion: 'morado', tabulador: 'amarillo' };
  const TX = {
    pageTitle: 'Inicio', allBranches: 'Todas las sucursales', branchPrefix: 'Sucursal ', branchesCount: '12 sucursales',
    aggregated: 'Los widgets muestran datos agregados', ownBranchHint: 'Tu usuario opera solo en esta sucursal', detail: 'Ver detalle de ',
    errorTitle: 'No pudimos cargar esta información.', errorText: 'Inténtalo de nuevo en unos segundos.', retry: 'Reintentar',
    opens: 'Abriría: ', filtered: ' · filtrado por ',
  };
  const A = {
    newPawn: 'Nuevo empeño', openCash: 'Abrir caja', openShift: 'Abrir nuevo turno', quote: 'Cotizar', noOpenCash: 'No hay cajas abiertas en ',
    openYourCash: 'Abre tu caja para registrar empeños', openYourShift: 'Abre un nuevo turno para registrar empeños', cashOpenedToast: 'Abriste tu caja en ',
  };
  const LIVE = { branchChanged: 'Mostrando ', roleChanged: 'Vista de ', loading: 'Cargando tarjetas del inicio', error: 'Algunas tarjetas no se pudieron cargar', retryDone: ' se cargó de nuevo' };
  const SCOPE = { ownMovements: 'Solo tus movimientos', ownCash: 'Tu caja', ownWork: 'Tu trabajo' };
  const V = {
    statesTitle: 'Estados de tarjeta',
    statesIntro: 'Cada tarjeta en sus cuatro estados, con Sucursal Centro y rol Dueño. El título nunca cambia; el estado vive en el cuerpo.',
    statesColumns: ['Tarjeta', 'Con datos', 'Vacío', 'Cargando', 'Error'], noEmpty: 'Sin vacío', noEmptyText: 'No aplica: siempre hay plazos.',
    matrixTitle: 'Matriz del Inicio por rol',
    matrixIntro: 'Ver un módulo en el menú = ver sus tarjetas en el Inicio. Sin acceso no se ve ni la tarjeta ni el módulo. Si no se puede ejecutar una acción, no aparece.',
    matrixModule: 'Módulo · tarjetas', matrixScopeTitle: 'Alcance de datos', matrixCashTitle: 'Acción primaria con una sucursal',
    matrixCashHeaders: ['Rol', 'Hay alguna caja abierta', 'Ninguna caja abierta'], yes: 'Sí', none: '—',
  };
  /* Menú lateral por rol: "Mi caja" solo para quien abre caja; Cajero y Valuador no ven Gestión de efectivo */
  const HIDDEN_MENU_IDS = { dueno: ['caja'], gerente: ['caja'], cajero: ['efectivo'], valuador: ['efectivo'] };
  const MATRIX = {
    modules: [
      ['pos', 'Ingresos, Flujo de caja'], ['pawn', 'Empeños, Vencimiento de contratos, Tabuladores, Plazos'],
      ['inventory', 'En almoneda, Envejecimiento, Depositaría, Inventario en transferencia'], ['orders', 'Estatus de órdenes, Tienda en línea'],
      ['clients', '—'], ['analytics', '—'], ['all', 'Requiere atención'],
    ],
    scope: [
      'Dueño y Gerente: todo (empresa o sucursal elegida).',
      'Cajero: Ingresos, Flujo de caja y Empeños muestran solo sus movimientos; el resto, toda su sucursal.',
      'Valuador: Empeños muestra su trabajo. No ve Ingresos ni Flujo de caja.',
      '"Todas las sucursales" es vista de monitoreo: no hay acciones operativas.',
    ],
    cash: [
      ['Dueño / Gerente', 'Nuevo empeño', 'Sin botón; nota "No hay cajas abiertas en [sucursal]"'],
      ['Cajero', 'Su caja abierta → Nuevo empeño', 'Sin abrir → Abrir caja + nota · Con corte → Abrir nuevo turno + nota'],
      ['Valuador', 'Nuevo empeño', 'Abrir caja (o Abrir nuevo turno) + Cotizar + nota'],
    ],
  };
  const T = {
    incomeToday: 'Hoy ', gold: 'Oro', silver: 'Plata', marketToday: 'Precio mercado hoy', purity: 'Pureza', price: 'Precio', category: 'Categoría',
    duration: 'Duración', interest: 'Interés', articles: 'Artículos', pieces: 'Prendas', storeCharged: 'Cobrado en línea', days7: '7 días', days30: '30 días',
    pawnsLoaned: 'Prestado', pawnToday: 'Hoy', pawnLoanedToday: 'Prestado hoy', pawnLast7: 'Últimos 7 días', pawnLoanedLast7: 'Prestado últimos 7 días',
    appraisedToday: 'Valuaste hoy', registeredToday: 'Registraste hoy', appraisalsLast7: 'Valuaciones últimos 7 días', registrationsLast7: 'Registros últimos 7 días',
    registrations: 'Registros', cashOfOpen: ' cajas abiertas', cashOf: ' de ', cashInBranches: ' · en ', cashBranchesTotal: ' de 12 sucursales',
    ownCashOpen: 'Tu caja: abierta desde 9:02', ownCashCut: 'Tu caja: corte a las 15:10', ownCashNone: 'Tu caja: sin abrir hoy',
    tabCompany: 'Tabulador de la empresa · 2 sucursales usan el suyo · 1 sin tabulador activo', tabOwn: 'Tabulador propio de ',
    tabInherited: 'En {branch} aplica el tabulador de la empresa', termsCompany: 'Plazos de la empresa · 1 sucursal usa los suyos',
    termsOwn: 'Plazos propios de ', termsInherited: 'En {branch} aplican los plazos de la empresa',
    noTab: 'Sin tabulador activo en {branch}. No se aceptan empeños de oro ni plata.', configureTab: 'Configurar tabulador',
  };
  const E = {
    attention: 'Todo en orden, no hay nada que requiera atención.', auction: 'No hay artículos en almoneda.',
    aging: 'Ningún artículo lleva más de 90 días en inventario.', expiration: 'Ningún contrato vence en los próximos días ni está en periodo de gracia.',
    orders: 'Todo en orden, no hay órdenes pendientes.', income: 'Aún no hay ingresos hoy.', incomeCashier: 'Aún no registras ingresos hoy.',
    store: 'Aún no hay cobros en línea.', depositary: 'No hay prendas en depositaría.', transfers: 'No hay artículos en tránsito entre sucursales.',
    cashFlow: 'Ninguna caja ha operado hoy.', cashFlowCashier: 'Abre tu caja para registrar movimientos.', pawns: 'Aún no hay empeños hoy.',
    pawnsCashier: 'Aún no entregas empeños hoy. Cotiza una prenda para registrar el primero.',
    pawnsAppraiser: 'Aún no valúas ni registras empeños hoy. Cotiza una prenda para empezar.',
  };
  const D = {
    income: 'Movimientos de caja', cashFlow: 'Flujo de caja', tabs: 'Tabuladores', auction: 'Inventario en almoneda', aging: 'Inventario por antigüedad',
    pawns: 'Empeños', depositary: 'Inventario en depositaría', contracts: 'Contratos', terms: 'Plazos', orders: 'Órdenes', store: 'Tienda en línea', transfers: 'Transferencias',
  };

  /* ---------- Mocks (inicio.mocks.ts e inicio.charts.mocks.ts); los colores son variables CSS ---------- */
  const C = { BLUE: '--io-azul', LILA: '--io-lila', GREEN: '--io-verde', ORANGE: '--io-naranja', LIME: '--io-lima', CYAN: '--io-cian', VIOLET: '--io-violeta', RED: '--io-rojo', AMBER: '--io-ambar', NAVY: '--io-navy', PURPLE: '--io-morado', PINK: '--io-rosa' };
  const BRANCHES = ['Centro', 'Norte', 'Sur', 'Lindavista', 'Coyoacán', 'Tlalpan', 'Satélite', 'Polanco', 'Iztapalapa', 'Tlalnepantla', 'Ecatepec', 'Naucalpan'];
  const ASSIGNED_BRANCH = { dueno: null, gerente: 'Norte', cajero: 'Centro', valuador: 'Centro' };
  const BRANCH_CONFIG = {
    Polanco: { hasOwnTab: true, hasOwnTerms: true, hasActiveTab: true },
    'Satélite': { hasOwnTab: true, hasOwnTerms: false, hasActiveTab: true },
    Tlalpan: { hasOwnTab: false, hasOwnTerms: false, hasActiveTab: false },
  };
  const DEFAULT_BRANCH_CONFIG = { hasOwnTab: false, hasOwnTerms: false, hasActiveTab: true };
  const CASH_COUNT = { all: { open: 9, total: 30, branchesWithOpen: 7 }, branch: { open: 2, total: 3 } };
  const ATTENTION = [
    { label: 'Artículos por aceptar', value: '3', icon: 'DeployedCode', module: 'inventory' },
    { label: 'Órdenes con recolección hoy', value: '5', icon: 'LocalShipping', module: 'orders' },
    { label: 'Contratos por vencer', value: '24', icon: 'Documents', module: 'pawn' },
    { label: 'Artículos sin imágenes', value: '12', icon: 'AddPhotoAlternate', module: 'inventory' },
    { label: 'Cortes de caja con diferencia', value: '2', icon: 'PointOfSale', module: 'pos', roles: ['dueno', 'gerente'] },
    { label: 'Refrendos con descuento por autorizar', value: '2', icon: 'Receipt', module: 'pawn', roles: ['dueno', 'gerente'] },
    { label: 'Prendas por valuar', value: '3', icon: 'Sell', module: 'pawn', roles: ['valuador'] },
    { label: 'Cotizaciones por convertir en empeño', value: '4', icon: 'Receipt', module: 'pawn', roles: ['valuador'] },
  ];
  const r = (label, value, color) => ({ label, value, color });
  const INCOME = {
    all: { total: '$48,320.00', rows: [r('Refrendos', '$14,900.00', C.LILA), r('Desempeños', '$9,000.00', C.ORANGE), r('Ventas en línea', '$8,318.00', C.LIME), r('Apartados', '$9,900.00', C.CYAN), r('Otros', '$6,202.00', C.VIOLET)] },
    branch: { total: '$6,150.00', rows: [r('Refrendos', '$2,100.00', C.LILA), r('Desempeños', '$1,200.00', C.ORANGE), r('Ventas en línea', '$950.00', C.LIME), r('Apartados', '$1,300.00', C.CYAN), r('Otros', '$600.00', C.VIOLET)] },
    own: { total: '$2,340.00', rows: [r('Refrendos', '$900.00', C.LILA), r('Desempeños', '$600.00', C.ORANGE), r('Apartados', '$540.00', C.CYAN), r('Otros', '$300.00', C.VIOLET)] },
  };
  const INCOME_ONLINE_ONLY = { total: '$950.00', rows: [r('Ventas en línea', '$950.00', C.LIME)] };
  const CASH_FLOW = {
    all: { stats: [['Saldo inicial', '$3,100.00'], ['Saldo actual', '$10,518.00'], ['Diferencias', '-$900.00', true]], rows: [r('Efectivo', '$8,318.00', C.NAVY), r('Tarjeta', '$9,900.00', C.PURPLE), r('Transferencias', '$9,900.00', C.LILA), r('Wallet', '$5,000.00', C.PINK)] },
    branch: { stats: [['Saldo inicial', '$500.00'], ['Saldo actual', '$2,950.00'], ['Diferencias', '$0.00']], rows: [r('Efectivo', '$2,450.00', C.NAVY), r('Tarjeta', '$1,900.00', C.PURPLE), r('Transferencias', '$1,300.00', C.LILA), r('Wallet', '$500.00', C.PINK)] },
    own: { stats: [['Saldo inicial', '$200.00'], ['Saldo actual', '$1,100.00'], ['Diferencias', '$0.00']], rows: [r('Efectivo', '$900.00', C.NAVY), r('Tarjeta', '$800.00', C.PURPLE), r('Transferencias', '$500.00', C.LILA), r('Wallet', '$140.00', C.PINK)] },
  };
  const TABS = {
    oro: { unit: 'oz', market: '$54,259 24K/oz', rows: [['22K', '$43,100.00'], ['18K', '$32,330.00'], ['14K', '$24,145.00'], ['10K', '$17,987.00']] },
    plata: { unit: 'g', market: '$19.70 .999/g', rows: [['.999', '$19.00'], ['.925', '$16.70'], ['.900', '$15.70'], ['.800', '$12.90']] },
  };
  const TERMS = [['Electrónicos', '30 días', '2.5-3.5%'], ['Juguetes', '45 días', '3.0-4.0%'], ['Herramientas', '60 días', '4.0-5.0%']];
  const AUCTION = {
    all: [r('Electrónicos', 12, C.BLUE), r('Juguetes', 9, C.LILA), r('Joyas', 6, C.GREEN), r('Otros', 3, C.ORANGE)],
    branch: [r('Electrónicos', 4, C.BLUE), r('Juguetes', 3, C.LILA), r('Joyas', 2, C.GREEN), r('Otros', 1, C.ORANGE)],
  };
  const DEPOSITARY = {
    all: [r('Electrónicos', 32, C.BLUE), r('Juguetes', 16, C.LILA), r('Joyas', 24, C.GREEN), r('Otros', 8, C.ORANGE)],
    branch: [r('Electrónicos', 8, C.BLUE), r('Juguetes', 4, C.LILA), r('Joyas', 6, C.GREEN), r('Otros', 2, C.ORANGE)],
  };
  const AGING_LEGEND = [r('Hasta 90 días', '', C.BLUE), r('90–120', '', C.AMBER), r('120–180', '', C.ORANGE), r('Más de 180 días', '', C.RED)];
  const toAging = (vals) => AGING_LEGEND.map((b, i) => ({ ...b, value: String(vals[i]) }));
  const AGING = {
    all: [{ label: 'Electrónicos', rows: toAging([25, 25, 25, 25]) }, { label: 'Joyas', rows: toAging([30, 20, 30, 20]) }],
    branch: [{ label: 'Electrónicos', rows: toAging([40, 30, 20, 10]) }, { label: 'Joyas', rows: toAging([50, 20, 20, 10]) }],
  };
  const PAWN_DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Hoy'];
  const PAWNS = {
    all: { amounts: [2200, 5800, 8800, 6000, 10000, 1800, 6800], today: 7, variation: 4, loanedToday: '$13,000.00', last7: 287, loanedLast7: '$523,218.00' },
    branch: { amounts: [400, 900, 1300, 800, 1500, 300, 1100], today: 3, variation: null, loanedToday: '$5,400.00', last7: 41, loanedLast7: '$74,350.00' },
    own: { amounts: [150, 300, 450, 250, 500, 100, 1800], today: 1, variation: null, loanedToday: '$1,800.00', last7: 12, loanedLast7: '$21,600.00' },
  };
  const APPRAISER = { registrations: [2, 3, 1, 4, 2, 0, 2], appraisedToday: '5', registeredToday: '2', appraisalsLast7: '31', registrationsLast7: '14' };
  const EXPIRATION = {
    all: [r('Vencen hoy', '14', C.RED), r('Próximos a vencer (5 días)', '9', C.ORANGE), r('En periodo de gracia', '6', C.AMBER), r('Reactivaciones', '9', C.BLUE)],
    branch: [r('Vencen hoy', '2', C.RED), r('Próximos a vencer (5 días)', '1', C.ORANGE), r('En periodo de gracia', '1', C.AMBER), r('Reactivaciones', '1', C.BLUE)],
  };
  const ORDERS = {
    all: [r('Por enviar', '8', C.LIME), r('En preparación', '2', C.ORANGE), r('Nuevas', '12', C.BLUE)],
    branch: [r('Por enviar', '2', C.LIME), r('En preparación', '1', C.ORANGE), r('Nuevas', '3', C.BLUE)],
  };
  const STORE = {
    7: { total: '$168,900.00', rows: [r('Refrendos y desempeños', '$86,400.00', C.LILA), r('Ventas', '$58,200.00', C.ORANGE), r('Apartados', '$24,300.00', C.GREEN)] },
    30: { total: '$702,450.00', rows: [r('Refrendos y desempeños', '$351,200.00', C.LILA), r('Ventas', '$248,950.00', C.ORANGE), r('Apartados', '$102,300.00', C.GREEN)] },
  };
  const TRANSFERS = {
    all: [r('Por aceptar', '14', C.AMBER), r('En tránsito', '9', C.BLUE)],
    branch: [r('Por aceptar', '1', C.AMBER), r('En tránsito', '2', C.BLUE)],
  };

  /* ---------- Reglas (inicio.util.ts) ---------- */
  const isLimitedRole = (role) => role === 'cajero' || role === 'valuador';
  const defaultBranch = (role) => ASSIGNED_BRANCH[role] || TODAS;
  const parseState = () => {
    const q = new URLSearchParams(location.search);
    const g = (k) => q.get(k) || '';
    const role = g('rol') in ROLES ? g('rol') : 'dueno';
    const b = g('sucursal');
    const known = b === TODAS || BRANCHES.includes(b);
    return {
      role,
      scenario: g('escenario') in ESCENARIOS ? g('escenario') : 'datos',
      branch: isLimitedRole(role) || !known ? defaultBranch(role) : b,
      cash: g('cajas') in CAJAS ? g('cajas') : 'abiertas',
      view: g('vista') in VISTAS ? g('vista') : 'prototipo',
    };
  };
  const toQuery = (s) => {
    const q = new URLSearchParams({ rol: s.role, escenario: s.scenario, sucursal: s.branch, cajas: s.cash });
    if (s.view !== 'prototipo') q.set('vista', s.view);
    return q.toString();
  };
  const cardConfig = (id) => CARDS.find((c) => c.id === id) || CARDS[0];
  const hasModule = (role, m) => ROLE_MODULES[role].includes(m);
  const canSeeCard = (role, id) => hasModule(role, cardConfig(id).module);
  /* columnas del Figma sin las tarjetas que el rol no ve; si una columna queda vacía, se reparten de izquierda a derecha */
  const visibleColumns = (role) => {
    const vis = CARDS.filter((c) => canSeeCard(role, c.id));
    const cols = [0, 1, 2].map((n) => vis.filter((c) => c.column === n).map((c) => c.id));
    if (cols.every((c) => c.length)) return cols;
    return [0, 1, 2].map((n) => vis.filter((_, i) => i % 3 === n).map((c) => c.id));
  };
  const movementScope = (ctx) => (ctx.role === 'cajero' ? 'own' : ctx.isAll ? 'all' : 'branch');
  const branchScope = (ctx) => (ctx.isAll ? 'all' : 'branch');
  const branchConfig = (b) => BRANCH_CONFIG[b] || DEFAULT_BRANCH_CONFIG;
  const canEditConfig = (role) => role === 'dueno' || role === 'gerente';
  const hasOpenCash = (s) => s.branch !== TODAS && s.cash === 'abiertas';
  const fill = (t, b) => t.replace('{branch}', b);
  const branchLabel = (b) => (b === TODAS ? TX.allBranches : TX.branchPrefix + b);

  /* ---------- Estado del prototipo ---------- */
  let state = parseState();
  let metal = 'oro';
  let storeRange = '7';
  let retries = {};
  let focusCardId = null;
  let toastTimer = 0;
  const retryTimers = [];
  const ctxOf = (s) => ({ ...s, isAll: s.branch === TODAS, isEmpty: s.scenario === 'vacio', hasOpenCash: hasOpenCash(s) });

  const live = document.getElementById('ioLive');
  const toastEl = document.getElementById('ioToast');
  const announce = (m) => { live.textContent = ''; requestAnimationFrame(() => { live.textContent = m; }); };
  const notify = (m) => {
    toastEl.textContent = m; toastEl.hidden = false; announce(m);
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { toastEl.hidden = true; }, TOAST_MS);
  };
  /* flechas y filas abren su módulo ya filtrado; el prototipo lo avisa en lugar de navegar */
  const openDestination = (ctx, dest) => notify(TX.opens + dest + TX.filtered + (ctx.isAll ? TX.allBranches : ctx.branch));

  /* ---------- Piezas de contenido ---------- */
  const dot = (c) => '<span class="io-dot" style="--c:var(' + c + ')"></span>';
  const leading = (row) => (row.icon ? ico(row.icon, 18) : row.color ? dot(row.color) : '');
  const toAmount = (v) => Number(String(v).replace(/[^0-9.]/g, ''));
  const stackedBar = (rows) => '<div class="io-barra-ap" role="presentation">' + rows.map((x) => '<span style="--c:var(' + x.color + ');flex:' + toAmount(x.value) + '"></span>').join('') + '</div>';
  const list = (rows) => '<div class="io-lista">' + rows.map((x) => '<div class="io-lista__f"><div class="io-lista__lbl"><span class="io-lista__lead">' + leading(x) + '</span><span class="io-t14">' + esc(x.label) + '</span></div><div class="io-lista__val"><span class="io-t14">' + esc(x.value) + '</span></div></div>').join('') + '</div>';
  /* Requiere atención: cada fila con su IconButton (la fila no es link) */
  const actionList = (rows) => '<div class="io-lista">' + rows.map((x) => '<div class="io-lista__f"><span class="io-lista__lbl"><span class="io-lista__lead">' + leading(x) + '</span><span class="io-t14">' + esc(x.label) + '</span></span><span class="io-t14">' + esc(x.value) + '</span>'
    + '<button class="io-ibtn" type="button" data-accion="destino" data-destino="' + esc(x.label) + '" aria-label="' + esc(TX.detail + x.label) + '">' + ico('ArrowForward', 20) + '</button></div>').join('') + '</div>';
  /* Vencimiento de contratos: la fila entera es el link */
  const linkList = (rows) => '<div class="io-lista">' + rows.map((x) => '<a class="io-lista__f" href="#" data-accion="destino" data-destino="' + esc(D.contracts + ' · ' + x.label) + '"><span class="io-lista__lbl"><span class="io-lista__lead">' + leading(x) + '</span><span class="io-t14">' + esc(x.label) + '</span></span><span class="io-t14">' + esc(x.value) + '</span></a>').join('') + '</div>';
  const stats = (st) => '<div class="io-stats">' + st.map(([l, v, neg]) => '<div><span class="io-l12">' + l + '</span><span class="io-t14' + (neg ? ' io-neg' : '') + '">' + v + '</span></div>').join('') + '</div>';
  const table = (headers, rows, align = []) => '<div class="io-tabla-wrap"><table class="io-tabla"><thead><tr>' + headers.map((h) => '<th scope="col">' + esc(h) + '</th>').join('') + '</tr></thead><tbody>'
    + rows.map((row) => '<tr>' + row.map((c, i) => '<td' + (align[i] === 'right' ? ' class="is-der"' : '') + '>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
  const plainNote = (t) => '<p class="io-l12">' + esc(t) + '</p>';
  const chip = (label, pressed, attrs) => '<button class="io-choice" type="button" aria-pressed="' + pressed + '" ' + attrs + '>' + label + '</button>';

  /* PieChart del DS: dona de 120 (radios 52/42) con separación de 3° y leyenda con anillo y porcentaje */
  const pie = (items, centerLabel) => {
    const size = 120, cx = 60, or = Math.floor(size * 0.44), ir = Math.floor(size * 0.35), GAP = 3;
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
    return '<div class="io-pie"><div class="io-pie__g"><svg width="120" height="120" aria-hidden="true">' + segs + '</svg><div class="io-pie__c"><b>' + total + '</b><span>' + centerLabel + '</span></div></div>'
      + '<ul class="io-pie__ley">' + items.map((i) => '<li><span>' + ring(i.color) + i.label + '</span><b>' + (total > 0 ? Math.round((i.value / total) * 100) : 0) + '%</b></li>').join('') + '</ul></div>';
  };
  const agingBars = (groups) => '<div class="io-stack">' + groups.map((g) => '<div class="io-stack"><span class="io-l12 io-l12--body">' + g.label + '</span>' + stackedBar(g.rows) + '</div>').join('')
    + '<div class="io-leyenda">' + AGING_LEGEND.map((l) => '<span>' + dot(l.color) + '<span class="io-l12">' + l.label + '</span></span>').join('') + '</div></div>';

  /* BarChart del DS (variant plain, 140 de alto): se dibuja al medir el ancho; ver drawBars() */
  const THOUSAND = 1000;
  const fmtAmount = (v) => (v >= THOUSAND ? '$' + (v / THOUSAND).toLocaleString('es-MX') + 'k' : '$' + v.toLocaleString('es-MX'));
  const fmtCount = (v) => String(v);
  const pawnBars = (values, seriesName, fmt) => {
    const summary = seriesName + '. ' + PAWN_DAYS.map((d, i) => d + ': ' + fmt(values[i])).join(', ');
    return '<div><div class="io-bars" data-bars=\'' + JSON.stringify({ v: values, n: seriesName, f: fmt === fmtAmount ? 'a' : 'c' }) + '\'></div><span class="sr-only">' + esc(summary) + '</span></div>';
  };
  const pawnStats = (rows) => '<div class="io-pstats">' + rows.map((row) => '<div class="io-pstats__f">' + row.map((s) => '<div class="io-pstats__c"><span class="io-l12">' + s.label + '</span><div class="io-pstats__v"><span class="io-t14">' + s.value + '</span>' + variationChip(s.variation) + '</div></div>').join('') + '</div>').join('') + '</div>';
  const variationChip = (v) => {
    if (v === undefined || v === null) return '';
    const trend = v > 0 ? 'up' : v < 0 ? 'down' : 'flat';
    const cls = { up: '', down: ' io-chip-st--rojo', flat: ' io-chip-st--gris' }[trend];
    return '<span class="io-chip-st' + cls + '">' + (trend === 'up' ? ico('TrendingUp', 12) : trend === 'down' ? ico('TrendingDown', 12) : '') + (trend === 'up' ? '+' : '') + v + '% vs ayer</span>';
  };

  /* ---------- Estados vacíos ---------- */
  const emptyPositive = (t) => '<div class="io-vpos">' + ico('EstadosSuccess', 24) + '<p>' + t + '</p></div>';
  /* siluetas de PreviewEmptyGhosts.tsx (viewBox 240 × 88) */
  const L = (x, y, w, h = 6, f = '--ats-neutral-100') => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + h / 2 + '" style="fill:var(' + f + ')"/>';
  const Dt = (x, y) => '<circle cx="' + x + '" cy="' + y + '" r="4" style="fill:var(--ats-neutral-100)"/>';
  const GHOSTS = {
    rows: () => L(16, 10, 92, 8, '--ats-primary-50') + L(110, 10, 64, 8, '--propuesta-lila-100') + L(176, 10, 48, 8, '--ats-cyan-100') + [36, 56, 76].map((y) => Dt(20, y + 3) + L(32, y, 96) + L(188, y, 36)).join(''),
    donut: () => '<circle cx="44" cy="44" r="28" fill="none" style="stroke:var(--ats-primary-50)" stroke-width="10"/><circle cx="44" cy="44" r="28" fill="none" style="stroke:var(--ats-primary-100)" stroke-width="10" stroke-dasharray="32 144" stroke-linecap="round" transform="rotate(-90 44 44)"/>'
      + [24, 41, 58].map((y) => Dt(160, y + 3) + L(172, y, 52)).join(''),
    check: () => [14, 38, 62].map((y) => '<circle cx="22" cy="' + (y + 6) + '" r="7" style="fill:var(--ats-success-green-50)"/><path d="M18.5 ' + (y + 6) + 'l2.4 2.4 4.6-4.8" fill="none" style="stroke:var(--ats-success-green-200)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' + L(38, y + 3, 110) + L(196, y + 3, 28)).join(''),
  };
  const emptyAction = (icon, text, art = 'check') => '<div class="io-stack"><div class="io-panel" aria-hidden="true"><svg class="io-panel__sil" viewBox="0 0 240 88">' + GHOSTS[art]() + '</svg><span class="io-medalla">' + ico(icon, 22) + '</span></div><p class="io-t14" style="color:var(--ats-neutral-600)">' + text + '</p></div>';
  const DOODLE = [['assets/garabato-flecha-1.svg', 4, 8, 60], ['assets/garabato-flecha-2.svg', 24, -4, 60], ['assets/garabato-flecha-3.svg', 7, 32, 5.49]];
  const doodle = () => '<span class="io-garabato" aria-hidden="true">' + DOODLE.map(([src, t, rt, rot]) => '<img src="' + src + '" alt="" width="14" height="11" style="top:' + t + 'px;right:' + rt + 'px;transform:rotate(' + rot + 'deg)" />').join('') + '</span>';

  /* ---------- Tarjetas por módulo (definiciones render(ctx)) ---------- */
  const cashStatusLine = (ctx) => {
    if (ctx.role === 'cajero') return ctx.isEmpty || ctx.cash === 'sin' ? T.ownCashNone : ctx.cash === 'corte' ? T.ownCashCut : T.ownCashOpen;
    const counts = ctx.isAll ? CASH_COUNT.all : CASH_COUNT.branch;
    const open = ctx.cash === 'abiertas' && !ctx.isEmpty ? counts.open : 0;
    const base = open + T.cashOf + counts.total + T.cashOfOpen;
    if (!ctx.isAll) return base;
    return base + T.cashInBranches + (open === 0 ? 0 : CASH_COUNT.all.branchesWithOpen) + T.cashBranchesTotal;
  };
  const cashLine = (ctx) => '<p class="io-t14">' + cashStatusLine(ctx) + '</p>';
  const tabNote = (ctx) => (ctx.isAll ? T.tabCompany : branchConfig(ctx.branch).hasOwnTab ? T.tabOwn + ctx.branch : fill(T.tabInherited, ctx.branch));
  const termsNote = (ctx) => (ctx.isAll ? T.termsCompany : branchConfig(ctx.branch).hasOwnTerms ? T.termsOwn + ctx.branch : fill(T.termsInherited, ctx.branch));

  const DEFS = {
    atencion: { skeleton: 'table', destination: '', render: (ctx) => {
      if (ctx.isEmpty) return { doodle: true, body: emptyPositive(E.attention) };
      const rows = ATTENTION.filter((x) => hasModule(ctx.role, x.module) && (!x.roles || x.roles.includes(ctx.role)));
      return { body: actionList(rows) };
    } },
    ingresos: { skeleton: 'kpi', destination: D.income, render: (ctx) => {
      const scope = movementScope(ctx), cajero = scope === 'own';
      if (ctx.isEmpty || (cajero && ctx.cash === 'sin')) return { scope: cajero ? 'ownMovements' : null, body: emptyAction('Payments', cajero ? E.incomeCashier : E.income, 'rows') };
      const inc = !ctx.isAll && !cajero && ctx.cash === 'sin' ? INCOME_ONLINE_ONLY : INCOME[scope];
      return { scope: cajero ? 'ownMovements' : null, body: '<div class="io-stack"><span class="io-l12 io-l12--body">' + T.incomeToday + inc.total + '</span>' + stackedBar(inc.rows) + list(inc.rows) + '</div>' };
    } },
    flujo: { skeleton: 'table', destination: D.cashFlow, render: (ctx) => {
      const scope = movementScope(ctx), cajero = scope === 'own';
      if (ctx.isEmpty || ctx.cash === 'sin') return { scope: cajero ? 'ownCash' : null, body: cashLine(ctx) + emptyAction('CheckCircle', cajero ? E.cashFlowCashier : E.cashFlow) };
      const f = CASH_FLOW[scope];
      return { scope: cajero ? 'ownCash' : null, body: cashLine(ctx) + stats(f.stats) + stackedBar(f.rows) + list(f.rows) };
    } },
    tabuladores: { skeleton: 'table', destination: D.tabs, render: (ctx) => {
      const active = ctx.isAll || branchConfig(ctx.branch).hasActiveTab;
      if (!active) {
        return { body: '<div class="io-alert"><div class="io-alert__in"><div class="io-alert__msg">' + ico('WarningFilled', 24) + '<p>' + fill(T.noTab, ctx.branch) + '</p></div>'
          + (canEditConfig(ctx.role) ? '<div class="io-alert__acc"><button class="ds-btn ds-btn--secondary io-btn" type="button" data-accion="destino" data-destino="' + D.tabs + '">' + T.configureTab + '</button></div>' : '') + '</div></div>' };
      }
      const tab = TABS[metal];
      return { body: '<div class="io-fila"><div class="io-chips">' + chip(T.gold, metal === 'oro', 'data-accion="metal" data-metal="oro"') + chip(T.silver, metal === 'plata', 'data-accion="metal" data-metal="plata"') + '</div>'
        + '<div class="io-mercado"><span class="io-l12">' + T.marketToday + '</span><span class="io-t14">' + tab.market + '</span></div></div>'
        + table([T.purity, T.price + ' (' + tab.unit + ')'], tab.rows) /* precio a la izquierda para alinear con su encabezado (rama del equipo 0e11b55c3) */ + plainNote(tabNote(ctx)) };
    } },
    plazos: { skeleton: 'table', destination: D.terms, render: (ctx) => ({ body: table([T.category, T.duration, T.interest], TERMS) + plainNote(termsNote(ctx)) }) },
    almoneda: { skeleton: 'chart', destination: D.auction, render: (ctx) => (ctx.isEmpty ? { doodle: true, body: emptyPositive(E.auction) } : { body: pie(AUCTION[branchScope(ctx)], T.articles) }) },
    envejecimiento: { skeleton: 'kpi', destination: D.aging, render: (ctx) => (ctx.isEmpty ? { doodle: true, body: emptyPositive(E.aging) } : { body: agingBars(AGING[branchScope(ctx)]) }) },
    depositaria: { skeleton: 'chart', destination: D.depositary, render: (ctx) => (ctx.isEmpty ? { body: emptyAction('Warehouse', E.depositary, 'donut') } : { body: pie(DEPOSITARY[branchScope(ctx)], T.pieces) }) },
    transferencias: { skeleton: 'kpi', destination: D.transfers, render: (ctx) => {
      if (ctx.isEmpty) return { body: emptyAction('LocalShipping', E.transfers, 'rows') };
      const rows = TRANSFERS[branchScope(ctx)];
      return { body: stackedBar(rows) + list(rows) };
    } },
    empenos: { skeleton: 'chart', destination: D.pawns, render: (ctx) => {
      const scope = ctx.role === 'cajero' ? 'ownMovements' : ctx.role === 'valuador' ? 'ownWork' : null;
      if (ctx.isEmpty) return { scope, body: emptyAction('Sell', ctx.role === 'cajero' ? E.pawnsCashier : ctx.role === 'valuador' ? E.pawnsAppraiser : E.pawns) };
      if (ctx.role === 'valuador') {
        return { scope, body: pawnBars(APPRAISER.registrations, T.registrations, fmtCount) + pawnStats([
          [{ label: T.appraisedToday, value: APPRAISER.appraisedToday }, { label: T.registeredToday, value: APPRAISER.registeredToday }],
          [{ label: T.appraisalsLast7, value: APPRAISER.appraisalsLast7 }, { label: T.registrationsLast7, value: APPRAISER.registrationsLast7 }]]) };
      }
      /* con cajas sin abrir no hay empeños hoy */
      const p = PAWNS[movementScope(ctx)], closed = ctx.cash === 'sin';
      const amounts = p.amounts.map((a, i, all) => (closed && i === all.length - 1 ? 0 : a));
      return { scope, body: pawnBars(amounts, T.pawnsLoaned, fmtAmount) + pawnStats([
        [{ label: T.pawnToday, value: String(closed ? 0 : p.today), variation: closed ? null : p.variation }, { label: T.pawnLoanedToday, value: closed ? '$0.00' : p.loanedToday }],
        [{ label: T.pawnLast7, value: String(p.last7) }, { label: T.pawnLoanedLast7, value: p.loanedLast7 }]]) };
    } },
    vencimientos: { skeleton: 'table', destination: D.contracts, render: (ctx) => {
      if (ctx.isEmpty) return { doodle: true, body: emptyPositive(E.expiration) };
      const rows = EXPIRATION[branchScope(ctx)];
      return { body: stackedBar(rows) + linkList(rows) };
    } },
    ordenes: { skeleton: 'table', destination: D.orders, render: (ctx) => {
      if (ctx.isEmpty) return { doodle: true, body: emptyPositive(E.orders) };
      const rows = ORDERS[branchScope(ctx)];
      return { body: stackedBar(rows) + list(rows) };
    } },
    tienda: { skeleton: 'table', destination: D.store, render: (ctx) => {
      if (ctx.isEmpty) return { body: emptyAction('Storefront', E.store, 'rows') };
      const st = STORE[storeRange];
      return { body: '<div class="io-stack"><div class="io-fila"><div class="io-monto"><span class="io-l12">' + T.storeCharged + '</span><span class="io-t16b">' + st.total + '</span></div>'
        + '<div class="io-chips">' + chip(T.days7, storeRange === '7', 'data-accion="rango" data-rango="7"') + chip(T.days30, storeRange === '30', 'data-accion="rango" data-rango="30"') + '</div></div>'
        + stackedBar(st.rows) + list(st.rows) + '</div>' };
    } },
  };

  /* Skeleton con la forma del dato: número grande, gráfica o tabla */
  const SKELETONS = {
    kpi: [['35%', 28], ['85%', 12], ['55%', 12]],
    chart: [['100%', 120], ['70%', 12], ['50%', 12]],
    table: [['90%', 14], ['80%', 14], ['85%', 14], ['70%', 14]],
  };
  const skeleton = (shape) => '<div class="io-stack" aria-hidden="true">' + SKELETONS[shape].map(([w, h]) => '<span class="io-sk" style="width:' + w + ';height:' + h + 'px"></span>').join('') + '</div>';
  const cardError = (id) => '<div class="io-stack" role="alert"><div class="io-err">' + ico('EstadosError', 24) + '<div><p class="io-t16b">' + TX.errorTitle + '</p><p class="io-t14" style="color:var(--ats-neutral-600)">' + TX.errorText + '</p></div></div>'
    + '<button class="ds-btn ds-btn--secondary io-btn io-btn--ico" type="button" data-accion="reintentar" data-id="' + (id || '') + '">' + ico('Sync', 18) + TX.retry + '</button></div>';

  /* Tarjeta base: h3 fijo, alcance con ícono de persona, flecha "Ver detalle de…" y garabato en los vacíos positivos */
  const card = (id, ctx, mode, withId) => {
    const cfg = cardConfig(id), def = DEFS[id];
    let body = '', scope = null, dd = false;
    if (mode === 'loading') body = skeleton(def.skeleton);
    else if (mode === 'error') body = cardError(withId ? id : '');
    else { const c = def.render(ctx); body = c.body; scope = c.scope; dd = c.doodle; }
    return '<section class="io-card"' + (withId ? ' id="io-card-' + id + '"' : '') + ' tabindex="-1" aria-label="' + esc(cfg.title) + '" aria-busy="' + (mode === 'loading') + '" data-card="' + id + '" data-destino="' + esc(def.destination) + '" data-branch="' + esc(ctx.branch) + '" data-all="' + ctx.isAll + '">'
      + (dd ? doodle() : '')
      + '<div class="io-card__head"><div class="io-card__tit"><h3>' + esc(cfg.title) + '</h3>' + (scope ? '<span class="io-alcance">' + ico('AccountCircle', 14) + SCOPE[scope] + '</span>' : '') + '</div>'
      + (cfg.hasArrow ? '<button class="io-ibtn" type="button" data-accion="detalle" aria-label="' + esc(TX.detail + cfg.title) + '">' + ico('ArrowForward', 20) + '</button>' : '') + '</div>'
      + '<div class="io-card__body">' + body + '</div></section>';
  };

  const modeOf = (id, ctx) => {
    if (retries[id] === 'loading' || ctx.scenario === 'cargando') return 'loading';
    if (ctx.scenario !== 'error' || !ERROR_CARDS.includes(id)) return 'content';
    return retries[id] === 'ok' ? 'content' : 'error';
  };

  /* ---------- Barra de sucursal + acción primaria ---------- */
  const primaryAction = (ctx) => {
    if (ctx.isAll) return '';
    let plan = {};
    if (!ctx.hasOpenCash) {
      const openPlan = ctx.cash === 'corte' ? { primary: A.openShift, note: A.openYourShift } : { primary: A.openCash, note: A.openYourCash };
      if (ctx.role === 'cajero') plan = openPlan;
      else if (ctx.role === 'valuador') plan = { ...openPlan, secondary: A.quote };
      else plan = { note: A.noOpenCash + ctx.branch };
    }
    return '<div class="io-accion">'
      + (plan.note ? '<p class="io-accion__nota">' + esc(plan.note) + '</p>' : '<button class="ds-btn ds-btn--primary io-btn io-btn--ico" type="button" data-accion="empeno">' + ico('Add', 20) + A.newPawn + '</button>')
      + (plan.secondary ? '<button class="ds-btn ds-btn--secondary io-btn" type="button" data-accion="cotizar">' + plan.secondary + '</button>' : '')
      + (plan.primary ? '<button class="ds-btn ds-btn--primary io-btn" type="button" data-accion="abrir-caja">' + plan.primary + '</button>' : '')
      + '</div>';
  };
  const branchBar = (ctx) => {
    let left;
    if (isLimitedRole(ctx.role)) {
      left = '<span class="io-chip-info io-chip-info--gris" aria-disabled="true">' + ico('Lock', 16) + TX.branchPrefix + esc(ctx.branch) + '</span><p class="io-txt14">' + TX.ownBranchHint + '</p>';
    } else {
      left = '<label class="io-sel"><span class="sr-only">Sucursal</span><select class="ds-select--standalone" data-accion="sucursal">'
        + [[TODAS, TX.allBranches]].concat(BRANCHES.map((b) => [b, TX.branchPrefix + b])).map(([v, l]) => '<option value="' + v + '"' + (v === ctx.branch ? ' selected' : '') + '>' + l + '</option>').join('')
        + '</select>' + ico('KeyboardArrowDown', 20) + '</label>'
        + (ctx.isAll ? '<span class="io-chip-info">' + TX.branchesCount + '</span><p class="io-txt14">' + TX.aggregated + '</p>' : '');
    }
    return '<div class="io-barra"><div class="io-barra__in">' + left + primaryAction(ctx) + '</div></div>';
  };

  /* ---------- Vistas ---------- */
  const dashboard = (ctx) => branchBar(ctx) + '<main class="pos-main io-main" id="ioMain"><h1 class="sr-only">' + TX.pageTitle + '</h1><div class="io-cols">'
    + visibleColumns(ctx.role).map((col) => '<div class="io-col">' + col.map((id) => card(id, ctx, modeOf(id, ctx), true)).join('') + '</div>').join('') + '</div></main>';

  const statesView = () => {
    const base = { ...state, role: 'dueno', branch: 'Centro', isAll: false, cash: 'abiertas' };
    const withData = { ...base, isEmpty: false, hasOpenCash: true, scenario: 'datos' };
    const empty = { ...base, isEmpty: true, hasOpenCash: false, cash: 'sin', scenario: 'vacio' };
    return '<main class="pos-main io-vista"><h1>' + V.statesTitle + '</h1><p class="io-vista__intro">' + V.statesIntro + '</p><div class="io-estados">'
      + V.statesColumns.map((c) => '<p class="io-estados__th">' + c + '</p>').join('')
      + CARDS.map((c) => '<div class="io-stack"><span class="io-t16b">' + c.title + '</span><span class="io-chip-info io-chip-info--' + (c.emptyKind ? EMPTY_CHIP[c.emptyKind] : 'gris') + '">' + (c.emptyKind ? EMPTY_LABELS[c.emptyKind] : V.noEmpty) + '</span></div>'
        + card(c.id, withData, 'content')
        + (c.emptyKind ? card(c.id, c.emptyKind === 'tabulador' ? { ...empty, branch: 'Tlalpan' } : empty, 'content') : '<p class="io-t14" style="color:var(--ats-neutral-600)">' + V.noEmptyText + '</p>')
        + card(c.id, withData, 'loading') + card(c.id, withData, 'error')).join('')
      + '</div></main>';
  };
  const matrixView = () => {
    const ids = ['dueno', 'gerente', 'cajero', 'valuador'];
    return '<main class="pos-main io-vista"><h1>' + V.matrixTitle + '</h1><p class="io-vista__intro">' + V.matrixIntro + '</p>'
      + table([V.matrixModule].concat(ids.map((x) => ROLES[x])), MATRIX.modules.map(([m, cards]) => [MODULE_LABELS[m] + ' · ' + cards].concat(ids.map((x) => (hasModule(x, m) ? V.yes : V.none)))))
      + '<h2>' + V.matrixScopeTitle + '</h2>' + MATRIX.scope.map((l) => '<p class="io-t14">' + esc(l) + '</p>').join('')
      + '<h2>' + V.matrixCashTitle + '</h2>' + table(V.matrixCashHeaders, MATRIX.cash) + '</main>';
  };

  /* ---------- Gráfica de barras (BarChart del DS: margen 8/8/0/0, eje Y de 48, eje X de 30, 5 marcas "redondas") ---------- */
  const niceTicks = (max) => {
    if (max <= 0) return [0, 1, 2, 3, 4];
    const rough = max / 4, digits = Math.floor(Math.log10(Math.abs(rough))) + 1, scale = Math.pow(10, digits);
    const ratioStep = digits !== 1 ? 0.05 : 0.1;
    const step = Math.ceil(rough / scale / ratioStep) * ratioStep * scale;
    return [0, 1, 2, 3, 4].map((i) => Math.round(step * i * 1e6) / 1e6);
  };
  const drawBars = (el) => {
    const cfg = JSON.parse(el.dataset.bars), fmt = cfg.f === 'a' ? fmtAmount : fmtCount;
    const W = el.clientWidth, H = 140, top = 8, right = 8, yW = 48, xH = 30;
    if (!W) return;
    const pl = yW, pr = W - right, pb = H - xH, ph = pb - top, band = (pr - pl) / cfg.v.length;
    const ticks = niceTicks(Math.max(...cfg.v)), tmax = ticks[ticks.length - 1];
    const y = (v) => pb - (v / tmax) * ph;
    const barW = Math.min(32, band * 0.8), last = cfg.v.length - 1;
    let s = '<svg width="' + W + '" height="' + H + '" aria-hidden="true"><rect class="io-bars__cur" x="0" y="' + top + '" width="' + band + '" height="' + ph + '" style="fill:var(--ats-primary-10)" visibility="hidden"/>';
    ticks.forEach((t) => { s += '<line x1="' + pl + '" x2="' + pr + '" y1="' + y(t) + '" y2="' + y(t) + '" style="stroke:var(--pos-border-soft)" stroke-dasharray="3 3"/>'; });
    for (let i = 0; i <= cfg.v.length; i++) s += '<line x1="' + (pl + band * i) + '" x2="' + (pl + band * i) + '" y1="' + top + '" y2="' + pb + '" style="stroke:var(--pos-border-soft)" stroke-dasharray="3 3"/>';
    ticks.forEach((t) => { s += '<text x="' + (pl - 8) + '" y="' + y(t) + '" dy="0.355em" text-anchor="end" font-size="12" style="fill:var(--ats-neutral-500)">' + fmt(t) + '</text>'; });
    cfg.v.forEach((v, i) => {
      const x = pl + band * i + (band - barW) / 2, h = (v / tmax) * ph, c = i === last ? '--ats-primary-300' : '--ats-primary-200';
      if (h > 0) {
        /* la barra de hoy es la serie superior de la pila: esquinas de arriba redondeadas (4); las demás, rectas */
        const d = i === last && h >= 4
          ? 'M' + x + ',' + (pb) + 'V' + (pb - h + 4) + 'Q' + x + ',' + (pb - h) + ' ' + (x + 4) + ',' + (pb - h) + 'H' + (x + barW - 4) + 'Q' + (x + barW) + ',' + (pb - h) + ' ' + (x + barW) + ',' + (pb - h + 4) + 'V' + pb + 'Z'
          : 'M' + x + ',' + pb + 'V' + (pb - h) + 'H' + (x + barW) + 'V' + pb + 'Z';
        s += '<path class="io-bars__b" data-i="' + i + '" d="' + d + '" style="fill:var(' + c + ');stroke:var(' + c + ')" stroke-width="0"/>';
      }
      s += '<text x="' + (pl + band * i + band / 2) + '" y="' + (pb + 8) + '" dy="0.71em" text-anchor="middle" font-size="12" style="fill:var(--ats-neutral-500)">' + PAWN_DAYS[i] + '</text>';
    });
    s += '<line x1="' + pl + '" x2="' + pr + '" y1="' + pb + '" y2="' + pb + '" style="stroke:var(--ats-neutral-300)"/></svg>';
    el.innerHTML = s + '<div class="io-bars__tip" hidden></div>';
    const svg = el.querySelector('svg'), cur = el.querySelector('.io-bars__cur'), tip = el.querySelector('.io-bars__tip');
    const off = () => { cur.setAttribute('visibility', 'hidden'); tip.hidden = true; el.querySelectorAll('.io-bars__b').forEach((b) => { b.style.fillOpacity = ''; b.setAttribute('stroke-width', '0'); }); };
    svg.addEventListener('mousemove', (e) => {
      const rect = svg.getBoundingClientRect(), mx = e.clientX - rect.left, my = e.clientY - rect.top;
      const i = Math.floor((mx - pl) / band);
      if (mx < pl || mx > pr || my < top || my > pb || i < 0 || i > last) { off(); return; }
      cur.setAttribute('x', pl + band * i); cur.setAttribute('width', band); cur.setAttribute('visibility', 'visible');
      el.querySelectorAll('.io-bars__b').forEach((b) => { const on = +b.dataset.i === i; b.style.fillOpacity = on ? '0.85' : ''; b.setAttribute('stroke-width', on ? '1' : '0'); });
      const c = i === last ? '--ats-primary-300' : '--ats-primary-200';
      tip.innerHTML = '<b>' + PAWN_DAYS[i] + '</b><span>' + '<span class="io-dot" style="--c:var(' + c + ')"></span><i>' + esc(cfg.n) + '</i><strong>' + fmt(cfg.v[i]) + '</strong></span>';
      tip.hidden = false;
      const tw = tip.offsetWidth, th = tip.offsetHeight;
      let tx = mx + 10, ty = my + 10;
      if (tx + tw > W) tx = mx - tw - 10;
      if (ty + th > H) ty = Math.max(0, my - th - 10);
      tip.style.left = tx + 'px'; tip.style.top = ty + 'px';
    });
    svg.addEventListener('mouseleave', off);
  };
  const ro = 'ResizeObserver' in window ? new ResizeObserver((entries) => entries.forEach((en) => { if (en.target.dataset.w !== String(en.target.clientWidth)) { en.target.dataset.w = en.target.clientWidth; drawBars(en.target); } })) : null;

  /* ---------- Render ---------- */
  const root = document.getElementById('ioRoot');
  const render = () => {
    const ctx = ctxOf(state);
    if (ro) ro.disconnect();
    root.innerHTML = state.view === 'estados' ? statesView() : state.view === 'matriz' ? matrixView() : dashboard(ctx);
    root.querySelectorAll('.io-bars').forEach((el) => { drawBars(el); el.dataset.w = el.clientWidth; if (ro) ro.observe(el); });
    if (focusCardId) { const c = document.getElementById('io-card-' + focusCardId); if (c) c.focus({ preventScroll: false }); }
    syncProto(); applyMenu();
  };

  const update = (patch) => {
    const next = { ...state, ...patch };
    if (patch.role) { next.branch = defaultBranch(patch.role); announce(LIVE.roleChanged + ROLES[patch.role]); }
    if (patch.branch) announce(LIVE.branchChanged + branchLabel(patch.branch));
    if (next.scenario !== state.scenario || next.branch !== state.branch || next.role !== state.role) { retries = {}; focusCardId = null; }
    if (patch.scenario && patch.scenario !== state.scenario) announceScenario(patch.scenario);
    state = next;
    history.replaceState(null, '', location.pathname + '?' + toQuery(state) + location.hash);
    render();
  };
  const announceScenario = (sc) => { if (sc === 'cargando') announce(LIVE.loading); if (sc === 'error') announce(LIVE.error); };

  const retry = (id) => {
    retries = { ...retries, [id]: 'loading' }; focusCardId = id; render();
    retryTimers.push(setTimeout(() => { retries = { ...retries, [id]: 'ok' }; render(); announce(cardConfig(id).title + LIVE.retryDone); }, RETRY_MS));
  };

  /* ---------- Eventos (delegados) ---------- */
  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-accion]');
    if (!b || b.tagName === 'SELECT') return;
    const ctx = ctxOf(state);
    const cardEl = b.closest('.io-card');
    const cctx = cardEl ? { isAll: cardEl.dataset.all === 'true', branch: cardEl.dataset.branch } : ctx;
    switch (b.dataset.accion) {
      case 'detalle': openDestination(cctx, cardEl.dataset.destino); break;
      case 'destino': e.preventDefault(); openDestination(cctx, b.dataset.destino); break;
      case 'metal': metal = b.dataset.metal; render(); break;
      case 'rango': storeRange = b.dataset.rango; render(); break;
      case 'reintentar': if (b.dataset.id) retry(b.dataset.id); break;
      case 'empeno': notify(A.newPawn + ' · ' + ctx.branch); break;
      case 'cotizar': notify(A.quote + ' · ' + ctx.branch); break;
      case 'abrir-caja': { const br = ctx.branch; update({ cash: 'abiertas' }); notify(A.cashOpenedToast + br); break; }
      default: break;
    }
  });
  root.addEventListener('change', (e) => { if (e.target.dataset.accion === 'sucursal') update({ branch: e.target.value }); });

  /* ---------- Panel "Estados de la maqueta" (la barra negra de su React) ---------- */
  const P = { rol: document.getElementById('ioPRol'), esc: document.getElementById('ioPEsc'), suc: document.getElementById('ioPSuc'), caj: document.getElementById('ioPCaj'), vis: document.getElementById('ioPVis') };
  const opts = (sel, rec) => { sel.innerHTML = Object.entries(rec).map(([v, l]) => '<option value="' + v + '">' + l + '</option>').join(''); };
  opts(P.rol, ROLES); opts(P.esc, ESCENARIOS); opts(P.caj, CAJAS); opts(P.vis, VISTAS);
  P.suc.innerHTML = '<option value="' + TODAS + '">' + TX.allBranches + '</option>' + BRANCHES.map((b) => '<option value="' + b + '">' + b + '</option>').join('');
  function syncProto() {
    P.rol.value = state.role; P.esc.value = state.scenario; P.caj.value = state.cash; P.vis.value = state.view; P.suc.value = state.branch;
    P.suc.disabled = isLimitedRole(state.role);
  }
  P.rol.addEventListener('change', () => update({ role: P.rol.value }));
  P.esc.addEventListener('change', () => update({ scenario: P.esc.value }));
  P.suc.addEventListener('change', () => update({ branch: P.suc.value }));
  P.caj.addEventListener('change', () => update({ cash: P.caj.value }));
  P.vis.addEventListener('change', () => update({ view: P.vis.value }));

  /* ---------- Menú lateral por rol: ../menu-op.js lo pinta; aquí se ocultan los módulos sin acceso y se marca Inicio ---------- */
  function applyMenu() {
    const side = document.getElementById('posSide');
    if (!side) return;
    const hidden = HIDDEN_MENU_IDS[state.role];
    side.querySelectorAll('[data-id]').forEach((it) => {
      const id = it.dataset.id;
      const hide = hidden.includes(id);
      if (it.hidden !== hide) it.hidden = hide;
      if (id === 'inicio' && !it.classList.contains('is-active')) {
        it.classList.add('is-active'); it.setAttribute('aria-current', 'page'); if (it.tagName === 'A') it.setAttribute('href', './');
      }
    });
  }
  new MutationObserver(applyMenu).observe(document.body, { childList: true, subtree: false });
  document.addEventListener('DOMContentLoaded', () => {
    const side = document.getElementById('posSide');
    if (side) new MutationObserver(applyMenu).observe(side, { childList: true });
    applyMenu();
  });

  render();
  announceScenario(state.scenario);
})();
