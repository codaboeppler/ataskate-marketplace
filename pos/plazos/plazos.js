
/* Plazos (Administrativo) · maqueta de el equipo (rama del equipo, commit 67a179d82, .working/plazos-flujo.html),
   con el listado puesto al día con su commit 0c4d4b518 ("migra el listado de Plazos al Design System").
   Es su JS casi tal cual: router por hash, datos en memoria, listado, detalle, crear/editar y panel de estados.
   Cambios para el prototipo (ver README.md): breadcrumb del DS con Home, overlays dentro de la capa .plz,
   barra fija con contenedor de 1440, tablas sin caja dentro de tarjetas, menús que no chocan con el header. */
(() => {
"use strict";
const ICONS = {"Catalogue": {"vb": "0 0 24 24", "inner": "<path d=\"M4 20C3.45 20 2.97917 19.8042 2.5875 19.4125C2.19583 19.0208 2 18.55 2 18V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H20C20.55 4 21.0208 4.19583 21.4125 4.5875C21.8042 4.97917 22 5.45 22 6V18C22 18.55 21.8042 19.0208 21.4125 19.4125C21.0208 19.8042 20.55 20 20 20H4ZM4 18H11V6H4V18ZM13 18H20V6H13V18ZM5 16H10V14H5V16ZM5 13H10V11H5V13ZM5 10H10V8H5V10ZM14 16H19V14H14V16ZM14 13H19V11H14V13ZM14 10H19V8H14V10Z\" fill=\"currentColor\" />"}, "PanelCollapse": {"vb": "0 0 24 24", "inner": "<path d=\"M12.44 7.56L12.44 16.44L8 12L12.44 7.56ZM14.22 4H16V20H14.22V4Z\" fill=\"currentColor\" />"}, "ChevronDown": {"vb": "0 0 24 24", "inner": "<path d=\"M7 10L12 15L17 10\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />"}, "Add": {"vb": "0 0 24 24", "inner": "<path d=\"M11 19V13H5V11H11V5H13V11H19V13H13V19H11Z\" fill=\"currentColor\" />"}, "ArrowBackIos": {"vb": "0 0 24 24", "inner": "<path d=\"M14.6 6L16 7.4L11.4 12L16 16.6L14.6 18L8.59998 12L14.6 6Z\" fill=\"currentColor\" />"}, "ArrowDropDown": {"vb": "0 0 24 24", "inner": "<path d=\"M12 15L7 10H17L12 15Z\" fill=\"currentColor\" />"}, "ArrowForwardIos": {"vb": "0 0 24 24", "inner": "<path d=\"M9.4 18L8 16.6L12.6 12L8 7.4L9.4 6L15.4 12L9.4 18Z\" fill=\"currentColor\" />"}, "CalendarToday": {"vb": "0 0 24 24", "inner": "<path d=\"M5 22C4.45 22 3.979 21.8043 3.587 21.413C3.19567 21.021 3 20.55 3 20V6C3 5.45 3.19567 4.97933 3.587 4.588C3.979 4.196 4.45 4 5 4H6V2H8V4H16V2H18V4H19C19.55 4 20.021 4.196 20.413 4.588C20.8043 4.97933 21 5.45 21 6V20C21 20.55 20.8043 21.021 20.413 21.413C20.021 21.8043 19.55 22 19 22H5ZM5 20H19V10H5V20ZM5 8H19V6H5V8Z\" fill=\"currentColor\" />"}, "Category": {"vb": "0 0 24 24", "inner": "<path d=\"M6.5 11L12 2L17.5 11H6.5ZM17.5 22C16.25 22 15.1875 21.5625 14.3125 20.6875C13.4375 19.8125 13 18.75 13 17.5C13 16.25 13.4375 15.1875 14.3125 14.3125C15.1875 13.4375 16.25 13 17.5 13C18.75 13 19.8125 13.4375 20.6875 14.3125C21.5625 15.1875 22 16.25 22 17.5C22 18.75 21.5625 19.8125 20.6875 20.6875C19.8125 21.5625 18.75 22 17.5 22ZM3 21.5V13.5H11V21.5H3ZM17.5 20C18.2 20 18.7917 19.7583 19.275 19.275C19.7583 18.7917 20 18.2 20 17.5C20 16.8 19.7583 16.2083 19.275 15.725C18.7917 15.2417 18.2 15 17.5 15C16.8 15 16.2083 15.2417 15.725 15.725C15.2417 16.2083 15 16.8 15 17.5C15 18.2 15.2417 18.7917 15.725 19.275C16.2083 19.7583 16.8 20 17.5 20ZM5 19.5H9V15.5H5V19.5ZM10.05 9H13.95L12 5.85L10.05 9Z\" fill=\"currentColor\" />"}, "Check": {"vb": "0 0 24 24", "inner": "<path d=\"M9.54998 18.0001L3.84998 12.3001L5.27498 10.8751L9.54998 15.1501L18.725 5.9751L20.15 7.4001L9.54998 18.0001Z\" fill=\"currentColor\" />"}, "Clean": {"vb": "0 0 24 24", "inner": "<path d=\"M11.1234 10.6364H12.8429V4.59091C12.8429 4.34621 12.7605 4.1411 12.5958 3.97557C12.431 3.81004 12.2268 3.72727 11.9832 3.72727C11.7396 3.72727 11.5354 3.81004 11.3706 3.97557C11.2058 4.1411 11.1234 4.34621 11.1234 4.59091V10.6364ZM5.96489 14.0909H18.0015V12.3636H5.96489V14.0909ZM4.71825 19.2727H6.82465V17.5455C6.82465 17.3008 6.90704 17.0956 7.07183 16.9301C7.23661 16.7646 7.4408 16.6818 7.6844 16.6818C7.928 16.6818 8.13219 16.7646 8.29698 16.9301C8.46176 17.0956 8.54416 17.3008 8.54416 17.5455V19.2727H11.1234V17.5455C11.1234 17.3008 11.2058 17.0956 11.3706 16.9301C11.5354 16.7646 11.7396 16.6818 11.9832 16.6818C12.2268 16.6818 12.431 16.7646 12.5958 16.9301C12.7605 17.0956 12.8429 17.3008 12.8429 17.5455V19.2727H15.4222V17.5455C15.4222 17.3008 15.5046 17.0956 15.6694 16.9301C15.8342 16.7646 16.0384 16.6818 16.282 16.6818C16.5255 16.6818 16.7297 16.7646 16.8945 16.9301C17.0593 17.0956 17.1417 17.3008 17.1417 17.5455V19.2727H19.2481L18.3884 15.8182H5.578L4.71825 19.2727ZM19.2481 21H4.71825C4.1594 21 3.70803 20.7769 3.36413 20.3307C3.02023 19.8845 2.91992 19.3879 3.06322 18.8409L4.24538 14.0909V12.3636C4.24538 11.8886 4.41375 11.482 4.75049 11.1438C5.08722 10.8055 5.49203 10.6364 5.96489 10.6364H9.40391V4.59091C9.40391 3.87121 9.65467 3.25947 10.1562 2.75568C10.6577 2.25189 11.2667 2 11.9832 2C12.6996 2 13.3086 2.25189 13.8102 2.75568C14.3117 3.25947 14.5624 3.87121 14.5624 4.59091V10.6364H18.0015C18.4743 10.6364 18.8791 10.8055 19.2159 11.1438C19.5526 11.482 19.721 11.8886 19.721 12.3636V14.0909L20.9031 18.8409C21.0894 19.3879 21.007 19.8845 20.656 20.3307C20.3049 20.7769 19.8356 21 19.2481 21Z\" fill=\"currentColor\" />"}, "Close": {"vb": "0 0 24 24", "inner": "<path d=\"M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z\" fill=\"currentColor\" />"}, "Colaps": {"vb": "0 0 24 24", "inner": "<path d=\"M3 20C2.45 20 1.97917 19.8042 1.5875 19.4125C1.19583 19.0208 1 18.55 1 18V6C1 5.45 1.19583 4.97917 1.5875 4.5875C1.97917 4.19583 2.45 4 3 4H5C5.55 4 6.02083 4.19583 6.4125 4.5875C6.80417 4.97917 7 5.45 7 6V18C7 18.55 6.80417 19.0208 6.4125 19.4125C6.02083 19.8042 5.55 20 5 20H3ZM3 18.025H5V5.975H3V18.025ZM11 20C10.45 20 9.97917 19.8042 9.5875 19.4125C9.19583 19.0208 9 18.55 9 18V6C9 5.45 9.19583 4.97917 9.5875 4.5875C9.97917 4.19583 10.45 4 11 4H21C21.55 4 22.0208 4.19583 22.4125 4.5875C22.8042 4.97917 23 5.45 23 6V18C23 18.55 22.8042 19.0208 22.4125 19.4125C22.0208 19.8042 21.55 20 21 20H11ZM11 18.025H21V5.975H11V18.025Z\" fill=\"currentColor\" />"}, "ContentCopy": {"vb": "0 0 24 24", "inner": "<path d=\"M5 22C4.45 22 3.979 21.8043 3.587 21.413C3.19567 21.021 3 20.55 3 20V6H5V20H16V22H5ZM9 18C8.45 18 7.97933 17.8043 7.588 17.413C7.196 17.021 7 16.55 7 16V4C7 3.45 7.196 2.979 7.588 2.587C7.97933 2.19567 8.45 2 9 2H18C18.55 2 19.021 2.19567 19.413 2.587C19.8043 2.979 20 3.45 20 4V16C20 16.55 19.8043 17.021 19.413 17.413C19.021 17.8043 18.55 18 18 18H9ZM9 16H18V4H9V16Z\" fill=\"currentColor\" />"}, "Delete": {"vb": "0 0 24 24", "inner": "<path d=\"M7.80775 20.8845C7.30908 20.8845 6.88308 20.7079 6.52975 20.3547C6.17658 20.0014 6 19.5754 6 19.0768V6.3845H5V4.8845H9.5V4H15.5V4.8845H20V6.3845H19V19.0768C19 19.5819 18.825 20.0095 18.475 20.3595C18.125 20.7095 17.6974 20.8845 17.1923 20.8845H7.80775ZM17.5 6.3845H7.5V19.0768C7.5 19.1666 7.52883 19.2403 7.5865 19.298C7.64417 19.3557 7.71792 19.3845 7.80775 19.3845H17.1923C17.2692 19.3845 17.3398 19.3524 17.4038 19.2883C17.4679 19.2243 17.5 19.1538 17.5 19.0768V6.3845ZM9.904 17.3845H11.4037V8.3845H9.904V17.3845ZM13.5962 17.3845H15.096V8.3845H13.5962V17.3845Z\" fill=\"currentColor\" />"}, "DesColaps": {"vb": "0 0 24 24", "inner": "<path d=\"M11.5 16L11.5 8L7.5 12L11.5 16ZM21 19C21 19.55 20.8042 20.0208 20.4125 20.4125C20.0208 20.8042 19.55 21 19 21L5 21C4.45 21 3.97917 20.8042 3.5875 20.4125C3.19583 20.0208 3 19.55 3 19L3 5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3L19 3C19.55 3 20.0208 3.19583 20.4125 3.5875C20.8042 3.97917 21 4.45 21 5L21 19ZM16 19L19 19L19 5L16 5L16 19ZM14 19L14 5L5 5L5 19L14 19Z\" fill=\"currentColor\" />"}, "Edit": {"vb": "0 0 24 24", "inner": "<path d=\"M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3043 2.75 17.863 2.75C18.421 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.571 21.275 6.113C21.2917 6.65433 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z\" fill=\"currentColor\" />"}, "EstadosError": {"vb": "48 156 24 24", "inner": "<path d=\"M60 178C58.6167 178 57.3167 177.737 56.1 177.212C54.8833 176.687 53.825 175.975 52.925 175.075C52.025 174.175 51.3127 173.117 50.788 171.9C50.2627 170.683 50 169.383 50 168C50 166.617 50.2627 165.317 50.788 164.1C51.3127 162.883 52.025 161.825 52.925 160.925C53.825 160.025 54.8833 159.312 56.1 158.787C57.3167 158.262 58.6167 158 60 158C61.3833 158 62.6833 158.262 63.9 158.787C65.1167 159.312 66.175 160.025 67.075 160.925C67.975 161.825 68.6873 162.883 69.212 164.1C69.7373 165.317 70 166.617 70 168C70 169.383 69.7373 170.683 69.212 171.9C68.6873 173.117 67.975 174.175 67.075 175.075C66.175 175.975 65.1167 176.687 63.9 177.212C62.6833 177.737 61.3833 178 60 178ZM56.4 173L60 169.4L63.6 173L65 171.6L61.4 168L65 164.4L63.6 163L60 166.6L56.4 163L55 164.4L58.6 168L55 171.6L56.4 173Z\" fill=\"currentColor\" />"}, "EstadosInfo": {"vb": "144 156 24 24", "inner": "<path d=\"M154.774 172.838H156.774V166.838H154.774V172.838ZM155.774 164.838C156.058 164.838 156.295 164.742 156.487 164.55C156.679 164.359 156.774 164.121 156.774 163.838C156.774 163.555 156.679 163.317 156.487 163.125C156.295 162.934 156.058 162.838 155.774 162.838C155.491 162.838 155.254 162.934 155.062 163.125C154.87 163.317 154.774 163.555 154.774 163.838C154.774 164.121 154.87 164.359 155.062 164.55C155.254 164.742 155.491 164.838 155.774 164.838ZM155.774 177.838C154.391 177.838 153.091 177.575 151.874 177.05C150.658 176.525 149.599 175.813 148.699 174.913C147.799 174.013 147.087 172.955 146.562 171.738C146.037 170.521 145.774 169.221 145.774 167.838C145.774 166.455 146.037 165.155 146.562 163.938C147.087 162.721 147.799 161.663 148.699 160.763C149.599 159.863 150.658 159.15 151.874 158.625C153.091 158.1 154.391 157.838 155.774 157.838C157.158 157.838 158.458 158.1 159.674 158.625C160.891 159.15 161.949 159.863 162.849 160.763C163.749 161.663 164.462 162.721 164.987 163.938C165.512 165.155 165.774 166.455 165.774 167.838C165.774 169.221 165.512 170.521 164.987 171.738C164.462 172.955 163.749 174.013 162.849 174.913C161.949 175.813 160.891 176.525 159.674 177.05C158.458 177.575 157.158 177.838 155.774 177.838Z\" fill=\"currentColor\" />"}, "EstadosSuccess": {"vb": "96 156 24 24", "inner": "<path d=\"M108 178C106.617 178 105.317 177.737 104.1 177.212C102.883 176.687 101.825 175.975 100.925 175.075C100.025 174.175 99.3127 173.117 98.788 171.9C98.2627 170.683 98 169.383 98 168C98 166.617 98.2627 165.317 98.788 164.1C99.3127 162.883 100.025 161.825 100.925 160.925C101.825 160.025 102.883 159.312 104.1 158.787C105.317 158.262 106.617 158 108 158C109.383 158 110.683 158.262 111.9 158.787C113.117 159.312 114.175 160.025 115.075 160.925C115.975 161.825 116.687 162.883 117.212 164.1C117.737 165.317 118 166.617 118 168C118 169.383 117.737 170.683 117.212 171.9C116.687 173.117 115.975 174.175 115.075 175.075C114.175 175.975 113.117 176.687 111.9 177.212C110.683 177.737 109.383 178 108 178ZM106.6 172.6L113.65 165.55L112.25 164.15L106.6 169.8L103.75 166.95L102.35 168.35L106.6 172.6Z\" fill=\"currentColor\" />"}, "FilterAlt": {"vb": "0 0 24 24", "inner": "<path d=\"M11 20C10.7167 20 10.4794 19.904 10.288 19.712C10.096 19.5207 10 19.2833 10 19V13L4.20003 5.6C3.95003 5.26667 3.9127 4.91667 4.08803 4.55C4.2627 4.18333 4.5667 4 5.00003 4H19C19.4334 4 19.7377 4.18333 19.913 4.55C20.0877 4.91667 20.05 5.26667 19.8 5.6L14 13V19C14 19.2833 13.9044 19.5207 13.713 19.712C13.521 19.904 13.2834 20 13 20H11ZM12 12.3L16.95 6H7.05003L12 12.3Z\" fill=\"currentColor\" />"}, "FirstPage": {"vb": "0 0 24 24", "inner": "<path d=\"M6 18V6H8V18H6ZM17 18L11 12L17 6L18.4 7.4L13.8 12L18.4 16.6L17 18Z\" fill=\"currentColor\" />"}, "KeyboardArrowDown": {"vb": "0 0 24 24", "inner": "<path d=\"M5.7 9.6998L7.1 8.2998L11.7 12.8998L16.3 8.2998L17.7 9.6998L11.7 15.6998L5.7 9.6998Z\" fill=\"currentColor\" />"}, "LastPage": {"vb": "0 0 24 24", "inner": "<path d=\"M6.99998 18L5.59998 16.6L10.2 12L5.59998 7.4L6.99998 6L13 12L6.99998 18ZM16 18V6H18V18H16Z\" fill=\"currentColor\" />"}, "Menu": {"vb": "0 0 24 24", "inner": "<path d=\"M3 18V16H21V18H3ZM3 13V11H21V13H3ZM3 8V6H21V8H3Z\" fill=\"currentColor\" />"}, "MoreVert": {"vb": "0 0 24 24", "inner": "<path d=\"M12 20C11.45 20 10.9793 19.8043 10.588 19.413C10.196 19.021 10 18.55 10 18C10 17.45 10.196 16.979 10.588 16.587C10.9793 16.1957 11.45 16 12 16C12.55 16 13.021 16.1957 13.413 16.587C13.8043 16.979 14 17.45 14 18C14 18.55 13.8043 19.021 13.413 19.413C13.021 19.8043 12.55 20 12 20ZM12 14C11.45 14 10.9793 13.804 10.588 13.412C10.196 13.0207 10 12.55 10 12C10 11.45 10.196 10.979 10.588 10.587C10.9793 10.1957 11.45 10 12 10C12.55 10 13.021 10.1957 13.413 10.587C13.8043 10.979 14 11.45 14 12C14 12.55 13.8043 13.0207 13.413 13.412C13.021 13.804 12.55 14 12 14ZM12 8C11.45 8 10.9793 7.804 10.588 7.412C10.196 7.02067 10 6.55 10 6C10 5.45 10.196 4.97933 10.588 4.588C10.9793 4.196 11.45 4 12 4C12.55 4 13.021 4.196 13.413 4.588C13.8043 4.97933 14 5.45 14 6C14 6.55 13.8043 7.02067 13.413 7.412C13.021 7.804 12.55 8 12 8Z\" fill=\"currentColor\" />"}, "NewMessages": {"vb": "0 0 24 24", "inner": "<path d=\"M3 20V5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3H17C17.55 3 18.0208 3.19583 18.4125 3.5875C18.8042 3.97917 19 4.45 19 5V10.075C18.8333 10.0417 18.6667 10.0208 18.5 10.0125C18.3333 10.0042 18.1667 10 18 10C17.8333 10 17.6667 10.0042 17.5 10.0125C17.3333 10.0208 17.1667 10.0417 17 10.075V5H5V15H12.075C12.0417 15.1667 12.0208 15.3333 12.0125 15.5C12.0042 15.6667 12 15.8333 12 16C12 16.1667 12.0042 16.3333 12.0125 16.5C12.0208 16.6667 12.0417 16.8333 12.075 17H6L3 20ZM7 9H15V7H7V9ZM7 13H12V11H7V13ZM17 20V17H14V15H17V12H19V15H22V17H19V20H17Z\" fill=\"currentColor\" />"}, "Notifications": {"vb": "0 0 24 24", "inner": "<path d=\"M4 19V17H6V10C6 8.61667 6.41667 7.38733 7.25 6.312C8.08333 5.23733 9.16667 4.53333 10.5 4.2V3.5C10.5 3.08333 10.646 2.72933 10.938 2.438C11.2293 2.146 11.5833 2 12 2C12.4167 2 12.7707 2.146 13.062 2.438C13.354 2.72933 13.5 3.08333 13.5 3.5V4.2C14.8333 4.53333 15.9167 5.23733 16.75 6.312C17.5833 7.38733 18 8.61667 18 10V17H20V19H4ZM12 22C11.45 22 10.9793 21.8043 10.588 21.413C10.196 21.021 10 20.55 10 20H14C14 20.55 13.8043 21.021 13.413 21.413C13.021 21.8043 12.55 22 12 22ZM8 17H16V10C16 8.9 15.6083 7.95833 14.825 7.175C14.0417 6.39167 13.1 6 12 6C10.9 6 9.95833 6.39167 9.175 7.175C8.39167 7.95833 8 8.9 8 10V17Z\" fill=\"currentColor\" />"}, "PinDrop": {"vb": "0 0 24 24", "inner": "<path d=\"M12 16.475C13.65 15.1417 14.896 13.8583 15.738 12.625C16.5793 11.3917 17 10.2333 17 9.15C17 8.21667 16.8293 7.42067 16.488 6.762C16.146 6.104 15.725 5.57067 15.225 5.162C14.725 4.754 14.1833 4.45833 13.6 4.275C13.0167 4.09167 12.4833 4 12 4C11.5167 4 10.9833 4.09167 10.4 4.275C9.81667 4.45833 9.275 4.754 8.775 5.162C8.275 5.57067 7.85433 6.104 7.513 6.762C7.171 7.42067 7 8.21667 7 9.15C7 10.2333 7.42067 11.3917 8.262 12.625C9.104 13.8583 10.35 15.1417 12 16.475ZM12 19C9.65 17.2667 7.89567 15.5833 6.737 13.95C5.579 12.3167 5 10.7167 5 9.15C5 7.96667 5.21267 6.929 5.638 6.037C6.06267 5.14567 6.60833 4.4 7.275 3.8C7.94167 3.2 8.69167 2.75 9.525 2.45C10.3583 2.15 11.1833 2 12 2C12.8167 2 13.6417 2.15 14.475 2.45C15.3083 2.75 16.0583 3.2 16.725 3.8C17.3917 4.4 17.9377 5.14567 18.363 6.037C18.7877 6.929 19 7.96667 19 9.15C19 10.7167 18.4207 12.3167 17.262 13.95C16.104 15.5833 14.35 17.2667 12 19ZM12 11C12.55 11 13.021 10.804 13.413 10.412C13.8043 10.0207 14 9.55 14 9C14 8.45 13.8043 7.979 13.413 7.587C13.021 7.19567 12.55 7 12 7C11.45 7 10.9793 7.19567 10.588 7.587C10.196 7.979 10 8.45 10 9C10 9.55 10.196 10.0207 10.588 10.412C10.9793 10.804 11.45 11 12 11ZM5 22V20H19V22H5Z\" fill=\"currentColor\" />"}, "Power": {"vb": "0 0 24 24", "inner": "<path d=\"M12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6 2.2625 9.29583 2.7875 8.0875C3.3125 6.87917 4.025 5.825 4.925 4.925L6.325 6.325C5.59167 7.05833 5.02083 7.90833 4.6125 8.875C4.20417 9.84167 4 10.8833 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 10.8833 19.7958 9.84167 19.3875 8.875C18.9792 7.90833 18.4083 7.05833 17.675 6.325L19.075 4.925C19.975 5.825 20.6875 6.87917 21.2125 8.0875C21.7375 9.29583 22 10.6 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM11 13V2H13V13H11Z\" fill=\"currentColor\" />"}, "Preview": {"vb": "0 0 24 24", "inner": "<path d=\"M5 21C4.45 21 3.97917 20.8042 3.5875 20.4125C3.19583 20.0208 3 19.55 3 19V5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3H19C19.55 3 20.0208 3.19583 20.4125 3.5875C20.8042 3.97917 21 4.45 21 5V19C21 19.55 20.8042 20.0208 20.4125 20.4125C20.0208 20.8042 19.55 21 19 21H5ZM5 19H19V7H5V19ZM12 17C10.6333 17 9.4125 16.6292 8.3375 15.8875C7.2625 15.1458 6.48333 14.1833 6 13C6.48333 11.8167 7.2625 10.8542 8.3375 10.1125C9.4125 9.37083 10.6333 9 12 9C13.3667 9 14.5875 9.37083 15.6625 10.1125C16.7375 10.8542 17.5167 11.8167 18 13C17.5167 14.1833 16.7375 15.1458 15.6625 15.8875C14.5875 16.6292 13.3667 17 12 17ZM12 15.5C12.9333 15.5 13.7833 15.2792 14.55 14.8375C15.3167 14.3958 15.9167 13.7833 16.35 13C15.9167 12.2167 15.3167 11.6042 14.55 11.1625C13.7833 10.7208 12.9333 10.5 12 10.5C11.0667 10.5 10.2167 10.7208 9.45 11.1625C8.68333 11.6042 8.08333 12.2167 7.65 13C8.08333 13.7833 8.68333 14.3958 9.45 14.8375C10.2167 15.2792 11.0667 15.5 12 15.5ZM12 14.5C12.4167 14.5 12.7708 14.3542 13.0625 14.0625C13.3542 13.7708 13.5 13.4167 13.5 13C13.5 12.5833 13.3542 12.2292 13.0625 11.9375C12.7708 11.6458 12.4167 11.5 12 11.5C11.5833 11.5 11.2292 11.6458 10.9375 11.9375C10.6458 12.2292 10.5 12.5833 10.5 13C10.5 13.4167 10.6458 13.7708 10.9375 14.0625C11.2292 14.3542 11.5833 14.5 12 14.5Z\" fill=\"currentColor\" />"}, "Search": {"vb": "0 0 24 24", "inner": "<path d=\"M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.146 15.371 4.888 14.113C3.62933 12.8543 3 11.3167 3 9.5C3 7.68333 3.62933 6.14567 4.888 4.887C6.146 3.629 7.68333 3 9.5 3C11.3167 3 12.8543 3.629 14.113 4.887C15.371 6.14567 16 7.68333 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8127 13.5627 12.688 12.688C13.5627 11.8127 14 10.75 14 9.5C14 8.25 13.5627 7.18733 12.688 6.312C11.8127 5.43733 10.75 5 9.5 5C8.25 5 7.18733 5.43733 6.312 6.312C5.43733 7.18733 5 8.25 5 9.5C5 10.75 5.43733 11.8127 6.312 12.688C7.18733 13.5627 8.25 14 9.5 14Z\" fill=\"currentColor\" />"}, "WarningFilled": {"vb": "0 0 24 24", "inner": "<path d=\"M1 21L12 2L23 21H1ZM12 18C12.2833 18 12.5208 17.9042 12.7125 17.7125C12.9042 17.5208 13 17.2833 13 17C13 16.7167 12.9042 16.4792 12.7125 16.2875C12.5208 16.0958 12.2833 16 12 16C11.7167 16 11.4792 16.0958 11.2875 16.2875C11.0958 16.4792 11 16.7167 11 17C11 17.2833 11.0958 17.5208 11.2875 17.7125C11.4792 17.9042 11.7167 18 12 18ZM11 15H13V10H11V15Z\" fill=\"currentColor\" />"}};
/* ==========================================================================
   Datos de ejemplo (ficticios). Sin servicios: todo vive en memoria.
   ========================================================================== */
const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const HOY = new Date(); HOY.setHours(0, 0, 0, 0);
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const parseIso = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const fecha = s => { if (!s) return ''; const d = typeof s === 'string' ? parseIso(s) : s; return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`; };
const ddmmaaaa = s => { if (!s) return ''; const d = parseIso(s); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`; };
const parseDdmm = v => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec((v || '').trim()); if (!m) return null;
  const d = new Date(+m[3], +m[2] - 1, +m[1]);
  return d.getDate() === +m[1] && d.getMonth() === +m[2] - 1 ? iso(d) : null;
};
const money = n => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct = n => { const v = Number(n); return (Number.isInteger(v) ? v : +v.toFixed(2)) + '%'; };
const plural = (n, uno, varios) => `${n.toLocaleString('en-US')} ${n === 1 ? uno : varios}`;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = (() => { let n = 100; return p => `${p}${++n}`; })();

const UNIDADES = { dias: ['día', 'días'], semanas: ['semana', 'semanas'], meses: ['mes', 'meses'] };
const duracionTxt = d => `${d.n} ${UNIDADES[d.unidad][d.n === 1 ? 0 : 1]}`;

const SUCURSALES = [
  { id: 'emp', label: 'Mi casa de empeños', meta: 'Empresa', children: [
    { id: 'z-centro', label: 'Zona Centro', meta: 'Grupo', children: [
      { id: 's-centro', label: 'Centro' }, { id: 's-roma', label: 'Roma' }, { id: 's-condesa', label: 'Condesa' }] },
    { id: 'z-norte', label: 'Zona Norte', meta: 'Grupo', children: [
      { id: 's-lindavista', label: 'Lindavista' }, { id: 's-satelite', label: 'Satélite' }, { id: 's-vallejo', label: 'Vallejo' }] },
    { id: 'z-sur', label: 'Zona Sur', meta: 'Grupo', children: [
      { id: 's-coyoacan', label: 'Coyoacán' }, { id: 's-tlalpan', label: 'Tlalpan' }] },
  ] },
];
const CATEGORIAS = [
  { id: 'c-joyeria', label: 'Joyería', meta: 'Grupo', children: [
    { id: 'c-oro', label: 'Oro' }, { id: 'c-plata', label: 'Plata' }, { id: 'c-relojes', label: 'Relojes' }] },
  { id: 'c-electronica', label: 'Electrónica', meta: 'Grupo', children: [
    { id: 'c-celulares', label: 'Celulares' }, { id: 'c-laptops', label: 'Laptops' }, { id: 'c-consolas', label: 'Consolas' }] },
  { id: 'c-herramientas', label: 'Herramientas', meta: 'Grupo', children: [
    { id: 'c-electricas', label: 'Eléctricas' }, { id: 'c-manuales', label: 'Manuales' }] },
  { id: 'c-vehiculos', label: 'Vehículos', meta: 'Grupo', children: [{ id: 'c-motos', label: 'Motocicletas' }] },
];
const flatten = (nodes, parent = null, depth = 0, out = []) => {
  nodes.forEach(n => { out.push({ ...n, parent, depth }); if (n.children) flatten(n.children, n.id, depth + 1, out); });
  return out;
};
const FLAT = { sucursales: flatten(SUCURSALES), categorias: flatten(CATEGORIAS) };
const leaves = kind => FLAT[kind].filter(n => !n.children).map(n => n.id);
const leavesUnder = (kind, id) => {
  const node = FLAT[kind].find(n => n.id === id); if (!node) return [];
  if (!node.children) return [id];
  return node.children.flatMap(c => leavesUnder(kind, c.id));
};
const labelOf = (kind, id) => (FLAT[kind].find(n => n.id === id) || {}).label || id;
const parentLabel = (kind, id) => { const n = FLAT[kind].find(x => x.id === id); return n && n.parent ? labelOf(kind, n.parent) : ''; };

const SCORE = [
  { v: 'nuevo', label: 'Clientes nuevos', sub: 'Calificación de cliente nuevo' },
  { v: 'bajo', label: 'Bajo', sub: '300 - 549' },
  { v: 'regular', label: 'Regular', sub: '550 - 632' },
  { v: 'bueno', label: 'Bueno', sub: '633 - 670' },
  { v: 'excelente', label: 'Excelente', sub: '671 - 850' },
];
const SEXO = [{ v: 'f', label: 'Femenino' }, { v: 'm', label: 'Masculino' }];
const ESTADO_CIVIL = [{ v: 'soltero', label: 'Soltero' }, { v: 'casado', label: 'Casado' }, { v: 'union', label: 'Unión libre' }, { v: 'otro', label: 'Otro' }];
const REFI = {
  estado:   { label: 'Estado de contrato', q: 'Ofrecer refinanciamiento si el contrato está:' },
  refrendos:{ label: 'Número de refrendos', q: 'Ofrecer refinanciamiento si el contrato tiene:' },
  monto:    { label: 'Monto prestado', q: 'Ofrecer refinanciamiento si el monto prestado es:' },
  score:    { label: 'Score de cliente', q: 'Ofrecer refinanciamiento a clientes con score:' },
  comision: { label: 'Cobro de comisión', q: 'En el refinanciamiento, cobrar como:' },
  canal:    { label: 'Canal de venta', q: 'Ofrecer refinanciamiento si el canal es:' },
};
const ESTADOS_CONTRATO = [{ v: 'vigente', label: 'Vigente' }, { v: 'vencido', label: 'Vencido' }, { v: 'gracia', label: 'En días de gracia' }];
const CANALES = [{ v: 'sucursal', label: 'En sucursal' }, { v: 'linea', label: 'En línea' }];
const COMPARADORES = [{ v: 'mayor', label: 'Mayor a' }, { v: 'igual', label: 'Igual a' }, { v: 'menor', label: 'Menor a' }];

const ESTADOS = {
  vigente:   { label: 'Vigente', chip: 'blue' },
  programado:{ label: 'Programado', chip: 'purple' },
  inactivo:  { label: 'Inactivo', chip: 'white' },
  borrador:  { label: 'Borrador', chip: 'gray' },
};

const adicionalesBase = () => ([
  { id: uid('a'), nombre: 'Días de gracia', cobro: 'despues', duracion: { n: 5, unidad: 'dias' }, tasa: 5, reflejar: false, sugerido: true },
  { id: uid('a'), nombre: 'Almacenamiento', cobro: 'durante', duracion: null, tasa: 5, reflejar: true, sugerido: true },
]);
const clienteVacio = () => ({ activo: false, edadMin: 18, edadMax: 99, sexo: [], estadoCivil: [], score: [] });
const refiVacio = () => ({ activo: false, condiciones: [] });
const nuevoPlazo = () => ({
  id: null, nombre: '', estado: 'vigente', inicio: iso(HOY), fin: null,
  montoMin: null, montoMax: null, duracion: { n: null, unidad: 'dias' },
  tasa: { tipo: 'fija', valor: null, rangos: [{ hasta: null, interes: null }] }, prorrateo: false,
  refrendos: { limitar: false, max: null }, adicionales: adicionalesBase(),
  categorias: [], sucursales: 'all', cliente: clienteVacio(), refi: refiVacio(),
});

function seed() {
  const p = (o) => Object.assign(nuevoPlazo(), o);
  return [
    p({ id: 'p1', nombre: 'Oro 30 días', estado: 'vigente', inicio: iso(addDays(HOY, -120)), montoMin: 500, montoMax: 80000,
        duracion: { n: 30, unidad: 'dias' }, tasa: { tipo: 'fija', valor: 5, rangos: [] }, prorrateo: true,
        refrendos: { limitar: true, max: 6 }, categorias: ['c-oro', 'c-plata'], sucursales: 'all' }),
    p({ id: 'p2', nombre: 'Electrónica 4 semanas', estado: 'vigente', inicio: iso(addDays(HOY, -60)), fin: iso(addDays(HOY, 90)), montoMin: 300, montoMax: 30000,
        duracion: { n: 4, unidad: 'semanas' }, tasa: { tipo: 'dinamica', valor: null, rangos: [{ hasta: 50, interes: 6 }, { hasta: 80, interes: 8 }, { hasta: 100, interes: 10 }] },
        categorias: ['c-celulares', 'c-laptops', 'c-consolas'], sucursales: ['s-centro', 's-roma', 's-condesa', 's-lindavista'],
        adicionales: [{ id: uid('a'), nombre: 'Almacenamiento', cobro: 'durante', duracion: null, tasa: 3, reflejar: true, sugerido: true }] }),
    p({ id: 'p3', nombre: 'Relojes premium', estado: 'programado', inicio: iso(addDays(HOY, 20)), fin: iso(addDays(HOY, 140)), montoMin: 2000, montoMax: null,
        duracion: { n: 2, unidad: 'meses' }, tasa: { tipo: 'fija', valor: 4.5, rangos: [] }, categorias: ['c-relojes'], sucursales: ['s-condesa', 's-satelite'],
        cliente: { activo: true, edadMin: 25, edadMax: 70, sexo: [], estadoCivil: [], score: ['bueno', 'excelente'] } }),
    p({ id: 'p4', nombre: 'Herramientas Norte', estado: 'inactivo', inicio: iso(addDays(HOY, -300)), fin: iso(addDays(HOY, -30)), montoMin: 200, montoMax: 15000,
        duracion: { n: 15, unidad: 'dias' }, tasa: { tipo: 'fija', valor: 7, rangos: [] }, categorias: ['c-electricas', 'c-manuales'],
        sucursales: ['s-lindavista', 's-satelite', 's-vallejo'], adicionales: [] }),
    p({ id: 'p5', nombre: 'Motos 3 meses', estado: 'vigente', inicio: iso(addDays(HOY, -10)), montoMin: 5000, montoMax: 120000,
        duracion: { n: 3, unidad: 'meses' }, tasa: { tipo: 'fija', valor: 6, rangos: [] }, categorias: ['c-motos'], sucursales: ['s-tlalpan', 's-coyoacan'],
        refi: { activo: true, condiciones: [{ id: uid('r'), tipo: 'refrendos', comp: 'mayor', valor: 2 }, { id: uid('r'), tipo: 'score', valores: ['bueno', 'excelente'] }] } }),
    p({ id: 'p6', nombre: 'Celulares 15 días', estado: 'vigente', inicio: iso(addDays(HOY, -45)), montoMin: 300, montoMax: 20000,
        duracion: { n: 15, unidad: 'dias' }, tasa: { tipo: 'fija', valor: 8, rangos: [] }, categorias: ['c-celulares'], sucursales: 'all' }),
    p({ id: 'p7', nombre: 'Plata semanal', estado: 'vigente', inicio: iso(addDays(HOY, -90)), montoMin: 200, montoMax: 10000,
        duracion: { n: 1, unidad: 'semanas' }, tasa: { tipo: 'fija', valor: 3, rangos: [] }, categorias: ['c-plata'], sucursales: ['s-centro', 's-roma'] }),
    p({ id: 'p8', nombre: 'Laptops Sur', estado: 'borrador', inicio: iso(addDays(HOY, 5)), montoMin: 1000, montoMax: 40000,
        duracion: { n: 30, unidad: 'dias' }, tasa: { tipo: 'fija', valor: 6.5, rangos: [] }, categorias: ['c-laptops'], sucursales: ['s-coyoacan', 's-tlalpan'] }),
    p({ id: 'p9', nombre: 'Oro Zona Sur', estado: 'vigente', inicio: iso(addDays(HOY, -200)), montoMin: 500, montoMax: 60000,
        duracion: { n: 1, unidad: 'meses' }, tasa: { tipo: 'dinamica', valor: null, rangos: [{ hasta: 60, interes: 4 }, { hasta: 100, interes: 5.5 }] },
        categorias: ['c-oro'], sucursales: ['s-coyoacan', 's-tlalpan'] }),
    p({ id: 'p10', nombre: 'Consolas temporada', estado: 'inactivo', inicio: iso(addDays(HOY, -400)), fin: iso(addDays(HOY, -250)), montoMin: 500, montoMax: 12000,
        duracion: { n: 20, unidad: 'dias' }, tasa: { tipo: 'fija', valor: 9, rangos: [] }, categorias: ['c-consolas'], sucursales: 'all', adicionales: [] }),
  ];
}
function seedSugerencias() {
  return [
    { id: 's1', nombre: 'Oro mensual', tasa: { tipo: 'fija', valor: 5, rangos: [] }, montoMin: 500, montoMax: 50000, duracion: { n: 1, unidad: 'meses' },
      sucursales: 'all', categorias: ['c-oro'], adicionales: adicionalesBase() },
    { id: 's2', nombre: 'Electrónica quincenal', tasa: { tipo: 'dinamica', valor: null, rangos: [{ hasta: 50, interes: 7 }, { hasta: 100, interes: 9 }] },
      montoMin: 300, montoMax: 25000, duracion: { n: 15, unidad: 'dias' }, sucursales: ['s-centro', 's-roma', 's-condesa'],
      categorias: ['c-celulares', 'c-laptops'], adicionales: [adicionalesBase()[1]] },
  ];
}

const store = { plazos: seed(), sugerencias: seedSugerencias() };
const demo = { load: 'ok', action: 'ok' };
const clone = o => JSON.parse(JSON.stringify(o));
const getPlazo = id => store.plazos.find(p => p.id === id);

/* Textos derivados */
const tasaTxt = t => {
  if (t.tipo === 'fija') return `Tasa fija ${pct(t.valor)}`;
  const vals = t.rangos.map(r => r.interes).filter(v => v != null);
  return vals.length ? `Tasa dinámica ${pct(Math.min(...vals))} a ${pct(Math.max(...vals))}` : 'Tasa dinámica';
};
const montoTxt = p => p.montoMax ? `${money(p.montoMin)} a ${money(p.montoMax)}` : `Desde ${money(p.montoMin)}`;
const segTxt = (p, kind) => {
  if (p[kind] === 'all') return kind === 'sucursales' ? 'Todas las sucursales' : 'Todas las categorías';
  return kind === 'sucursales' ? plural(p[kind].length, 'sucursal', 'sucursales') : plural(p[kind].length, 'categoría', 'categorías');
};
const vigenciaTxt = p => {
  if (p.estado === 'programado') return `Inicia ${fecha(p.inicio)}`;
  if (p.fin) return `${fecha(p.inicio)} – ${fecha(p.fin)}`;
  return `Desde ${fecha(p.inicio)}`;
};
const adicionalTxt = a => {
  const parts = [a.cobro === 'durante' ? 'Durante el periodo' : `Después del periodo · ${duracionTxt(a.duracion)}`, `Tasa ${pct(a.tasa)}`];
  parts.push(a.reflejar ? 'Se refleja en el contrato' : 'No se refleja en el contrato');
  return parts.join(' · ');
};

/* ==========================================================================
   Íconos (SVG del DS: src/design-system/Icons/Icons.tsx)
   ========================================================================== */
const icon = (name, cls = '') => {
  const i = ICONS[name];
  return `<svg viewBox="${i.vb}" fill="none" aria-hidden="true"${cls ? ` class="${cls}"` : ''}>${i.inner}</svg>`;
};
const CHECK_SVG = '<svg viewBox="0 0 12 10" fill="none" aria-hidden="true"><path d="M1 5.2L4.3 8.5L11 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const SWITCH_KNOB = '<span class="ds-switch__knob"><svg class="on" viewBox="0 0 12 9" fill="none" aria-hidden="true"><path d="M1 4.5L4.2 7.5L11 1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg><svg class="off" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></span>';

/* ==========================================================================
   Piezas del DS como funciones (HTML)
   ========================================================================== */
const ui = {
  btn: (label, { variant = 'primary', iconLeft, iconRight, attrs = '', full } = {}) =>
    `<button type="button" class="ds-btn ds-btn--${variant}${iconLeft ? ' ds-btn--icon-left' : ''}${iconRight ? ' ds-btn--icon-right' : ''}${full ? ' ds-btn--full' : ''}" ${attrs}>${iconLeft ? icon(iconLeft) : ''}<span>${label}</span>${iconRight ? icon(iconRight) : ''}</button>`,
  iconBtn: (name, label, attrs = '', size = '') =>
    `<button type="button" class="ds-icon-btn${size ? ' ds-icon-btn--' + size : ''}" aria-label="${esc(label)}" ${attrs}>${icon(name)}</button>`,
  /* Breadcrumb del DS con el marcado de los demás módulos (estilos en ../pos.css); siempre empieza en Home,
     que en el Administrativo es su inicio (INICIO.admin de ../menu-op.js) */
  breadcrumb: items => { const all = [{ label: 'Home', href: '../empresa/' }, ...items]; return `<nav class="ds-breadcrumb" aria-label="Breadcrumb"><ol class="pos-crumbs">${all.map((it, i) => i < all.length - 1
    ? `<li><a href="${it.href}" class="ds-breadcrumb__link">${esc(it.label)}</a><span class="ds-breadcrumb__sep" aria-hidden="true"><img class="pos-crumb-sep" src="../assets/ds/ArrowForwardIos-D4D6D8.svg" alt=""></span></li>`
    : `<li><span class="ds-breadcrumb__current" aria-current="page">${esc(it.label)}</span></li>`).join('')}</ol></nav>`; },
  /* Chip status del DS: es de solo lectura y lleva role="status" (Chip.tsx) */
  chip: estado => `<span class="chip-status chip-status--${ESTADOS[estado].chip}" role="status">${ESTADOS[estado].label}</span>`,
  alert: (variant, { title, text, action } = {}) => {
    const ic = { info: 'EstadosInfo', error: 'EstadosError', warning: 'WarningFilled', success: 'EstadosSuccess' }[variant];
    return `<div class="ds-alert ds-alert--${variant}" role="${variant === 'error' ? 'alert' : 'status'}">${icon(ic)}<div class="ds-alert__body">${title ? `<p class="ds-alert__title">${title}</p>` : ''}${text ? `<p class="ds-alert__text">${text}</p>` : ''}</div>${action || ''}</div>`;
  },
  note: text => `<p class="design-note">${text}</p>`,
  field: ({ id, label, optional, help, input, error = '' }) =>
    `<div class="ds-field" data-field="${id}"><label class="ds-field__label" for="${id}">${label}${optional ? '<span class="ds-field__optional">(opcional)</span>' : ''}</label>${input}${help ? `<p class="ds-help" id="${id}-help">${help}</p>` : ''}<p class="ds-error" id="${id}-error" role="alert">${error}</p></div>`,
  input: ({ id, value = '', placeholder = '', type = 'text', attrs = '', cls = '' }) =>
    `<input class="ds-input ${cls}" id="${id}" name="${id}" type="${type}" value="${esc(value)}" placeholder="${esc(placeholder)}" aria-describedby="${id}-error ${id}-help" ${attrs}>`,
  select: ({ id, options, value, attrs = '', cls = '' }) =>
    `<select class="ds-select ${cls}" id="${id}" name="${id}" ${attrs}>${options.map(o => `<option value="${o.v}"${String(o.v) === String(value) ? ' selected' : ''}>${esc(o.label)}</option>`).join('')}</select>`,
  switch: ({ id, label, checked, attrs = '' }) =>
    `<label class="ds-switch"><input type="checkbox" role="switch" id="${id}" ${checked ? 'checked' : ''} ${attrs}><span class="ds-switch__track">${SWITCH_KNOB}</span><span>${label}</span></label>`,
  check: ({ name, value, label, sub, checked, attrs = '' }) =>
    `<label class="ds-check"><input type="checkbox" name="${name}" value="${value}" ${checked ? 'checked' : ''} ${attrs}><span class="ds-check__box">${CHECK_SVG}<span class="dash"></span></span><span class="ds-check__text"><span>${esc(label)}</span>${sub ? `<span class="ds-check__sub">${esc(sub)}</span>` : ''}</span></label>`,
  radio: ({ name, value, label, checked, attrs = '' }) =>
    `<label class="ds-radio"><input type="radio" name="${name}" value="${value}" ${checked ? 'checked' : ''} ${attrs}><span class="ds-radio__circle"></span><span>${esc(label)}</span></label>`,
  errorText: msg => msg ? `${icon('Close')}<span>${esc(msg)}</span>` : '',
  loading: text => `<div class="state-loading" role="status"><span class="ds-spinner"></span><span class="t-caption">${text}</span></div>`,
  /* Menú ⋮ (InstallmentRowActionsMenu): el panel lleva el mismo nombre que su IconButton y las opciones salen del Tab */
  menu: (id, label, items) => `<div class="menu-wrap">${ui.iconBtn('MoreVert', label, `aria-haspopup="menu" aria-expanded="false" aria-controls="${id}" data-menu-trigger`)}<div class="ds-menu" role="menu" id="${id}" aria-label="${esc(label)}" hidden>${items.map(it => `<button type="button" role="menuitem" tabindex="-1" data-action="${it.action}" ${it.data || ''}>${icon(it.icon)}${it.label}</button>`).join('')}</div></div>`,
};

/* ==========================================================================
   Toast (DS): título = qué pasó · texto = qué objeto · 5 s
   ========================================================================== */
function showToast({ type = 'success', title, message }) {
  const region = document.getElementById('toasts');
  const el = document.createElement('div');
  el.className = `ds-toast ds-toast--${type}`;
  el.setAttribute('role', type === 'error' ? 'alert' : 'status');
  el.innerHTML = `${icon(type === 'error' ? 'EstadosError' : 'EstadosSuccess')}<div class="ds-toast__body"><p class="ds-toast__title">${esc(title)}</p>${message ? `<p class="ds-toast__text">${esc(message)}</p>` : ''}</div><button type="button" class="ds-toast__close" aria-label="Cerrar">${icon('Close')}</button><span class="ds-toast__timer"></span>`;
  region.prepend(el);
  const remove = () => el.remove();
  el.querySelector('.ds-toast__close').addEventListener('click', remove);
  el.querySelector('.ds-toast__timer').addEventListener('animationend', remove);
  el.addEventListener('keydown', e => { if (e.key === 'Escape') remove(); });
}

/* ==========================================================================
   Modal (DS): centrado o lateral, con X, Esc y clic en el overlay
   ========================================================================== */
let modalReturnFocus = null;
function openModal({ title, body, footer, side = false, onMount }) {
  const root = document.getElementById('modal-root');
  modalReturnFocus = document.activeElement;
  root.innerHTML = `<div class="ds-overlay${side ? ' ds-overlay--side' : ''}" data-overlay>
    <div class="ds-modal${side ? ' ds-modal--side' : ''}" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="ds-modal__head"><h2 class="ds-modal__title" id="modal-title">${title}</h2><button type="button" class="ds-modal__x" aria-label="Cerrar" data-close>${icon('Close')}</button></div>
      <div class="ds-modal__body">${body}</div>
      <div class="ds-modal__foot">${footer}</div>
    </div></div>`;
  document.body.style.overflow = 'hidden';
  const overlay = root.firstElementChild;
  overlay.addEventListener('mousedown', e => { if (e.target === overlay) closeModal(); });
  overlay.querySelector('[data-close]').addEventListener('click', closeModal);
  overlay.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); closeModal(); }
    if (e.key === 'Tab') {
      const f = [...overlay.querySelectorAll('button, input, select, [tabindex]:not([tabindex="-1"])')].filter(x => !x.disabled && x.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  if (onMount) onMount(overlay);
  const first = overlay.querySelector('.ds-modal__body input, .ds-modal__body select') || overlay.querySelector('.ds-modal__foot .ds-btn:last-child');
  (first || overlay.querySelector('[data-close]')).focus();
  return overlay;
}
function closeModal() {
  const root = document.getElementById('modal-root');
  const abierto = !!root.firstElementChild;
  root.innerHTML = '';
  document.body.style.overflow = '';
  if (!abierto) return; /* route() lo llama siempre: sin modal no hay foco que devolver */
  /* si la fila o el detalle se volvieron a pintar, el ⋮ es otro nodo con el mismo aria-controls (m-pX, m-detail) */
  let f = modalReturnFocus; modalReturnFocus = null;
  const ctrl = f && f.getAttribute && f.getAttribute('aria-controls');
  if (f && !document.contains(f) && ctrl) f = document.querySelector(`[aria-controls="${ctrl}"]`);
  if (f && document.contains(f)) f.focus();
}
/* text: un párrafo; body: HTML propio (el modal de activar/desactivar lleva dos párrafos) */
function confirmModal({ title, text, body, confirmLabel, variant = 'primary', onConfirm }) {
  const ov = openModal({
    title, body: body ?? `<p>${text}</p>`,
    footer: ui.btn('Cancelar', { variant: 'tertiary', attrs: 'data-close-btn' }) + ui.btn(confirmLabel, { variant, attrs: 'data-confirm' }),
  });
  ov.querySelector('[data-close-btn]').addEventListener('click', closeModal);
  ov.querySelector('[data-confirm]').addEventListener('click', e => onConfirm(e.currentTarget));
}

/* Simula una llamada a servicio: respeta el panel "Estados de la maqueta" */
function fakeRequest(btn, { ok, fail, ms = 700 }) {
  if (btn) {
    btn.setAttribute('aria-busy', 'true'); btn.disabled = true;
    btn.insertAdjacentHTML('afterbegin', `<span class="ds-spinner ds-spinner--sm${btn.classList.contains('ds-btn--primary') || btn.classList.contains('ds-btn--destructive') ? ' ds-spinner--white' : ''}"></span>`);
  }
  setTimeout(() => {
    if (btn && document.contains(btn)) { btn.removeAttribute('aria-busy'); btn.disabled = false; btn.querySelector('.ds-spinner')?.remove(); }
    demo.action === 'error' ? fail() : ok();
  }, ms);
}

/* ==========================================================================
   Menús ⋮ y lista de filtro: abrir, flechas, Esc, clic fuera
   ========================================================================== */
function closeMenus(except) {
  document.querySelectorAll('[data-menu-trigger][aria-expanded="true"]').forEach(t => {
    if (t === except) return;
    t.setAttribute('aria-expanded', 'false');
    document.getElementById(t.getAttribute('aria-controls')).hidden = true;
  });
}
document.addEventListener('click', e => {
  const trigger = e.target.closest('[data-menu-trigger]');
  if (trigger) {
    e.stopPropagation();
    const menu = document.getElementById(trigger.getAttribute('aria-controls'));
    const open = menu.hidden;
    closeMenus(trigger);
    menu.hidden = !open; trigger.setAttribute('aria-expanded', String(open));
    if (open && menu.classList.contains('ds-menu')) placeMenu(trigger, menu);
    if (open) menu.querySelector('[role="menuitem"]:not([aria-disabled="true"]), [role="option"]')?.focus({ preventScroll: true });
    return;
  }
  if (!e.target.closest('[role="menu"], [role="listbox"]')) closeMenus();
});
/* El menú se pinta fijo para que el scroll de la tabla no lo recorte (guía 4.39).
   Menú ⋮ (InstallmentRowActionsMenu): alineado al borde derecho del ⋮, 4 px abajo; si abajo quedan menos
   de 200 px y arriba hay más, abre hacia arriba. "Agregar condición" (.ds-menu--left) sigue como estaba. */
function placeMenu(trigger, menu) {
  const r = trigger.getBoundingClientRect();
  menu.style.position = 'fixed';
  if (menu.classList.contains('ds-menu--left')) {
    const w = menu.offsetWidth, h = menu.offsetHeight;
    const below = r.bottom + 8 + h <= window.innerHeight - 8;
    menu.style.left = Math.max(8, Math.min(r.left, window.innerWidth - w - 8)) + 'px';
    menu.style.top = (below ? r.bottom + 8 : r.top - 8 - h) + 'px';
    menu.style.right = 'auto'; menu.style.bottom = 'auto';
    return;
  }
  const vw = document.documentElement.clientWidth, vh = document.documentElement.clientHeight;
  const espacioAbajo = vh - r.bottom;
  const haciaArriba = espacioAbajo < 200 && r.top > espacioAbajo;
  menu.style.left = 'auto';
  menu.style.right = (vw - (r.left + r.width)) + 'px';
  if (haciaArriba) { menu.style.top = 'auto'; menu.style.bottom = (vh - r.top + 4) + 'px'; }
  else { menu.style.bottom = 'auto'; menu.style.top = (r.bottom + 4) + 'px'; }
}
/* con scroll o resize los menús abiertos se reubican junto a su disparador (ya no se cierran) */
const reubicarMenus = () => document.querySelectorAll('[data-menu-trigger][aria-expanded="true"]').forEach(t => {
  const m = document.getElementById(t.getAttribute('aria-controls'));
  if (m && m.classList.contains('ds-menu')) placeMenu(t, m);
});
window.addEventListener('scroll', reubicarMenus, true);
window.addEventListener('resize', reubicarMenus);
document.addEventListener('keydown', e => {
  const menu = e.target.closest('.plz [role="menu"], .plz [role="listbox"].ds-filter-chip__list');
  if (!menu) return;
  const items = [...menu.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"]), [role="option"]')];
  const i = items.indexOf(document.activeElement);
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus();
  }
  if (e.key === 'Escape' || e.key === 'Tab') {
    const trigger = document.querySelector(`[aria-controls="${menu.id}"]`);
    /* en el menú ⋮, Tab también cierra y devuelve el foco al ⋮ (como Esc) */
    const devolver = e.key === 'Escape' || menu.matches('.ds-menu:not(.ds-menu--left)');
    closeMenus(); if (devolver) { e.preventDefault(); trigger?.focus(); }
  }
});

/* ==========================================================================
   SelectionInput (DS): botón + listbox. El <select> oculto guarda el valor
   y emite "change", así el resto de la maqueta no cambia.
   ========================================================================== */
const SELECT_CHEVRON = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 6l4 4 4-4" stroke="#71767D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
let openSelect = null;
function closeSelect(focusBtn) {
  if (!openSelect) return;
  const { btn, list } = openSelect; list.remove(); btn.setAttribute('aria-expanded', 'false');
  openSelect = null; if (focusBtn) btn.focus();
}
function enhanceSelect(sel) {
  if (sel.dataset.enhanced) return;
  sel.dataset.enhanced = '1';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'ds-selectbtn' + (sel.classList.contains('ds-select--table') || sel.closest('.demo-panel') ? ' ds-selectbtn--table' : '');
  btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false');
  if (sel.id) {
    btn.id = sel.id + '-btn';
    const lbl = document.querySelector(`label[for="${sel.id}"]`) || sel.closest('label');
    if (lbl) { if (lbl.htmlFor) lbl.htmlFor = btn.id; lbl.id = lbl.id || sel.id + '-lbl'; btn.setAttribute('aria-labelledby', `${lbl.id} ${btn.id}`); }
  }
  if (sel.getAttribute('aria-label')) btn.setAttribute('aria-label', sel.getAttribute('aria-label'));
  const sync = () => { btn.innerHTML = `<span class="ds-selectbtn__text">${esc(sel.options[sel.selectedIndex]?.text || '')}</span>${SELECT_CHEVRON}`; };
  sync();
  sel.addEventListener('change', sync);
  sel.hidden = true;
  sel.after(btn);
  const open = () => {
    closeSelect(); closeMenus();
    const list = document.createElement('ul');
    list.className = 'ds-listbox'; list.setAttribute('role', 'listbox'); list.tabIndex = -1;
    if (btn.getAttribute('aria-labelledby')) list.setAttribute('aria-labelledby', btn.getAttribute('aria-labelledby').split(' ')[0]);
    list.innerHTML = [...sel.options].map((o, i) => `<li role="option" tabindex="-1" data-i="${i}" aria-selected="${i === sel.selectedIndex}">${esc(o.text)}</li>`).join('');
    document.getElementById('plz-capas').appendChild(list);
    const r = btn.getBoundingClientRect();
    list.style.width = r.width + 'px'; list.style.left = r.left + 'px';
    const h = list.offsetHeight;
    list.style.top = (r.bottom + 4 + h <= window.innerHeight ? r.bottom + 4 : r.top - 4 - h) + 'px';
    btn.setAttribute('aria-expanded', 'true');
    openSelect = { btn, list, sel };
    (list.querySelector('[aria-selected="true"]') || list.firstElementChild).focus({ preventScroll: true });
    const pick = li => { sel.selectedIndex = +li.dataset.i; sel.dispatchEvent(new Event('change', { bubbles: true })); closeSelect(true); };
    list.addEventListener('click', e => { const li = e.target.closest('[role="option"]'); if (li) pick(li); });
    list.addEventListener('keydown', e => {
      const items = [...list.children]; const i = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus(); }
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(document.activeElement); }
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeSelect(true); }
      if (e.key === 'Tab') closeSelect(false);
    });
  };
  btn.addEventListener('click', () => (openSelect && openSelect.btn === btn ? closeSelect(true) : open()));
  btn.addEventListener('keydown', e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); open(); } });
}
document.addEventListener('mousedown', e => { if (openSelect && !e.target.closest('.ds-listbox') && !openSelect.btn.contains(e.target)) closeSelect(false); });
window.addEventListener('scroll', e => { if (openSelect && !openSelect.list.contains(e.target)) closeSelect(false); }, true);
window.addEventListener('resize', () => closeSelect(false));
const enhanceAll = () => document.querySelectorAll('.plz select.ds-select:not([data-enhanced])').forEach(enhanceSelect);
new MutationObserver(enhanceAll).observe(document.body, { childList: true, subtree: true });
enhanceAll();

/* ==========================================================================
   Tooltip (DS): hover y foco; Esc lo cierra
   ========================================================================== */
const tip = document.getElementById('tooltip');
/* data-tip-pos="bottom": abajo con la flecha hacia arriba; data-tip-size="large": padding 10/14 y 320 de ancho máximo */
function showTip(el) {
  tip.innerHTML = el.getAttribute('data-tip');
  const abajo = el.getAttribute('data-tip-pos') === 'bottom';
  tip.classList.toggle('ds-tooltip--bottom', abajo);
  tip.classList.toggle('ds-tooltip--large', el.getAttribute('data-tip-size') === 'large');
  tip.classList.add('is-open');
  const r = el.getBoundingClientRect(), t = tip.getBoundingClientRect();
  let left = Math.min(Math.max(8, r.left + r.width / 2 - t.width / 2), window.innerWidth - t.width - 8);
  tip.style.left = left + 'px'; tip.style.top = (abajo ? r.bottom + 8 : r.top - t.height - 8) + 'px';
  tip.style.setProperty('--arrow-x', (r.left + r.width / 2 - left) + 'px');
}
const hideTip = () => tip.classList.remove('is-open');
document.addEventListener('mouseover', e => { const el = e.target.closest('[data-tip]'); if (el) showTip(el); });
document.addEventListener('mouseout', e => { if (e.target.closest('[data-tip]')) hideTip(); });
document.addEventListener('focusin', e => { const el = e.target.closest('[data-tip]'); el ? showTip(el) : hideTip(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') hideTip(); });
window.addEventListener('scroll', hideTip, true);

/* ==========================================================================
   Table (DS): sombras de scroll horizontal (useHorizontalScrollShadows).
   Mismo patrón que ../tabuladores: .table-frame > .table-wrap; devuelve la función que suelta los listeners.
   ========================================================================== */
function bindScrollShadows(frame) {
  const sc = frame.querySelector('.table-wrap');
  const paint = () => {
    frame.classList.toggle('is-start', sc.scrollLeft > 1);
    frame.classList.toggle('is-end', sc.scrollLeft + sc.clientWidth < sc.scrollWidth - 1);
  };
  sc.addEventListener('scroll', paint, { passive: true });
  window.addEventListener('resize', paint);
  let ro = null;
  if (typeof ResizeObserver !== 'undefined') { ro = new ResizeObserver(paint); ro.observe(sc); if (sc.firstElementChild) ro.observe(sc.firstElementChild); }
  paint();
  const off = () => { window.removeEventListener('resize', paint); ro?.disconnect(); };
  cleanup.push(off);
  return off;
}

/* ==========================================================================
   Router por hash
   #/plazos · #/plazos/nuevo[?sugerencia=] · #/plazos/:id · #/plazos/:id/editar[?copia=1]
   ========================================================================== */
let cleanup = [];
/* En React el listado se vuelve a montar al regresar del detalle o del formulario: pestaña, nodo, filtro,
   búsqueda y panel vuelven a como se abre. Si la ruta no cambia (panel "Estados de la maqueta", Intenta
   nuevamente), la selección se conserva. */
let rutaPrevia = null;
function route() {
  cleanup.forEach(fn => fn()); cleanup = [];
  closeModal(); hideTip();
  document.body.classList.remove('has-footer');
  const [path, query] = (currentHash.replace(/^#/, '') || '/plazos').split('?');
  const params = new URLSearchParams(query || '');
  const parts = path.split('/').filter(Boolean);
  const main = document.getElementById('main');
  window.scrollTo(0, 0);
  if (parts[0] !== 'plazos') { go('#/plazos'); return; }
  const previa = rutaPrevia; rutaPrevia = path;
  if (parts.length === 1 && previa !== null && previa !== path) {
    clearTimeout(busq.t); Object.assign(listState, listStateInicial()); busq.ultimo = ''; busq.activo = 0;
  }
  if (parts.length === 1) renderList(main);
  else if (parts[1] === 'nuevo') renderForm(main, { mode: 'new', sugerencia: params.get('sugerencia') });
  else if (parts[2] === 'editar') renderForm(main, { mode: 'edit', id: parts[1], copia: params.get('copia') === '1' });
  else renderDetail(main, parts[1], params.get('tab'));
  main.focus({ preventScroll: true });
}
/* La ruta vive en memoria y se refleja en la URL cuando el navegador lo permite
   (así funciona también abierto como archivo adjunto o en un visor). */
let currentHash = location.hash && location.hash.startsWith('#/') ? location.hash : '#/plazos';
const setUrl = (h, replace) => { try { history[replace ? 'replaceState' : 'pushState'](null, '', h); } catch (err) { /* visor sin historial */ } };
const go = h => { currentHash = h; setUrl(h); route(); };
/* Atrás/Adelante del navegador: sin hash (como lo abre el menú lateral) es el listado.
   Si el formulario tiene cambios sin guardar, la URL se queda en el formulario y se pide confirmar. */
let salidaForm = null;
window.addEventListener('popstate', () => {
  const dest = location.hash.startsWith('#/') ? location.hash : '#/plazos';
  if (salidaForm && salidaForm(dest)) { setUrl(currentHash); return; }
  currentHash = dest; route();
});
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#/"]');
  if (a && !e.defaultPrevented) { e.preventDefault(); go(a.getAttribute('href')); }
});

/* Carga simulada según el panel de la maqueta */
function withLoad(container, loadingText, render, errorTitle) {
  if (demo.load === 'loading') { container.innerHTML = ui.loading(loadingText); return; }
  container.innerHTML = ui.loading(loadingText);
  const t = setTimeout(() => {
    if (demo.load === 'error') {
      container.innerHTML = `<div class="state-error">${ui.alert('error', { title: errorTitle, text: 'Revisa tu conexión e intenta nuevamente.', action: ui.btn('Intenta nuevamente', { variant: 'tertiary', attrs: 'data-retry' }) })}</div>`;
      container.querySelector('[data-retry]').addEventListener('click', () => route());
      return;
    }
    render();
  }, 450);
  cleanup.push(() => clearTimeout(t));
}

/* Acciones de estado y duplicar: mismas reglas en lista y detalle (textos de su commit 0c4d4b518) */
function confirmEstado(p, activar, after) {
  confirmModal({
    title: activar ? '¿Deseas activar este plazo ahora?' : '¿Deseas desactivar este plazo?',
    body: `<div class="modal-copy"><p class="t-texto">${activar
      ? 'Al confirmar, este plazo estará disponible de inmediato para su uso en las sucursales y categorías segmentadas. Esta acción cambiará su estado a Vigente.'
      : 'Desactivar este plazo podría interrumpir su uso en las sucursales que lo tienen activo.'}</p><p class="t-texto">Confirma si deseas continuar.</p></div>`,
    confirmLabel: activar ? 'Activar' : 'Desactivar',
    onConfirm: btn => fakeRequest(btn, {
      ok: () => {
        /* su texto dice "cambiará su estado a Vigente": también un programado queda vigente */
        p.estado = activar ? 'vigente' : 'inactivo';
        /* primero repintar y luego cerrar: así closeModal encuentra el ⋮ nuevo y le regresa el foco */
        after();
        closeModal();
        showToast({ title: 'Cambio exitoso al estado del plazo', message: activar ? 'Plazo activado' : 'Plazo desactivado' });
      },
      fail: () => { closeModal(); showToast({ type: 'error', title: 'Error', message: 'No se pudo cambiar el estado del plazo. Intenta de nuevo.' }); },
    }),
  });
}
function duplicar(p, btn) {
  fakeRequest(btn, {
    ok: () => {
      const copia = clone(p);
      copia.id = uid('p'); copia.nombre = `Copia de ${p.nombre}`.slice(0, 100); copia.estado = 'borrador';
      store.plazos.unshift(copia);
      showToast({ title: 'Cambio exitoso al estado del plazo', message: 'Plazo duplicado' });
      go(`#/plazos/${copia.id}/editar?copia=1`);
    },
    fail: () => showToast({ type: 'error', title: 'Error', message: 'No se pudo duplicar el plazo. Intenta de nuevo.' }),
    ms: 500,
  });
}
/* Menú ⋮ de cada fila (InstallmentTableRow): el borrador solo se edita; vigente → Desactivar, cualquier otro estado → Activar */
const accionesPorEstado = p => {
  if (p.estado === 'borrador') return [{ action: 'editar', label: 'Editar', icon: 'Edit' }];
  return [
    { action: 'ver', label: 'Ver detalle', icon: 'Preview' },
    { action: 'editar', label: 'Editar', icon: 'Edit' },
    { action: 'duplicar', label: 'Duplicar', icon: 'ContentCopy' },
    p.estado === 'vigente' ? { action: 'desactivar', label: 'Desactivar', icon: 'Power' } : { action: 'activar', label: 'Activar', icon: 'Power' },
  ];
};

/* ==========================================================================
   LISTADO (commit 0c4d4b518): una card con el árbol y la tabla del DS, un solo chip "Filtros"
   y la card de sugeridos. Cada selección del árbol vuelve a pedir los plazos.
   ========================================================================== */
const listStateInicial = () => ({
  tab: 'sucursales', node: { sucursales: 'emp', categorias: null }, expanded: new Set(), search: '',
  filtro: { cat: null, opt: null }, page: 1, collapsed: false, loading: false, error: false,
});
const listState = listStateInicial();
const PAGE = 8;

/* Filtros del chip (FILTER_TYPES de su constants.ts). Valores estables; los rangos incluyen los extremos. */
const DIAS_POR_UNIDAD = { dias: 1, semanas: 7, meses: 30 };
const enRango = (n, v) => { const [a, b] = v.split('-').map(Number); return n >= a && n <= b; };
const FILTROS = [
  { key: 'state', label: 'Estado', test: (p, v) => p.estado === { 1: 'vigente', 2: 'inactivo', 3: 'programado', 4: 'borrador' }[v],
    opciones: [{ v: '1', label: 'Vigente' }, { v: '2', label: 'Inactivo' }, { v: '3', label: 'Programado' }, { v: '4', label: 'Borrador' }] },
  { key: 'minAmount', label: 'Rango de préstamo', test: (p, v) => enRango(p.montoMin, v),
    opciones: [{ v: '0-999', label: 'Menos de $1,000' }, { v: '1000-10000', label: '$1,000 - $10,000' }, { v: '10001-1000000000000000', label: 'Más de $10,000' }] },
  { key: 'interestType', label: 'Tipo de interés', test: (p, v) => p.tasa.tipo === (v === '1' ? 'fija' : 'dinamica'),
    opciones: [{ v: '1', label: 'Fijo' }, { v: '2', label: 'Dinámico' }] },
  /* la API manda la duración en días; aquí semanas = 7 días y meses = 30 */
  { key: 'duration', label: 'Duración', test: (p, v) => enRango(p.duracion.n * DIAS_POR_UNIDAD[p.duracion.unidad], v),
    opciones: [{ v: '0-30', label: 'Menos de 30 días' }, { v: '45-60', label: '45 - 60 días' }, { v: '90-1000000000000000', label: 'Más de 90 días' }] },
];
const filtroCat = () => FILTROS.find(c => c.key === listState.filtro.cat) || null;
const filtroOpt = () => { const c = filtroCat(); return (c && c.opciones.find(o => o.v === listState.filtro.opt)) || null; };

function renderList(main) {
  main.innerHTML = `<div class="page">
    ${ui.breadcrumb([{ label: 'Configuración de sistema', href: '#/plazos' }, { label: 'Plazos' }])}
    <div class="title-row title-row--list">
      <h1 class="t-titulo-pagina">Plazos</h1>
      <div class="title-row__actions">${ui.btn('Crear plazo', { iconLeft: 'Add', attrs: 'data-go="#/plazos/nuevo"' })}</div>
    </div>
    <div class="stack-24">
      ${ui.note('En React el listado ya no lleva breadcrumb (como Tabuladores); aquí se conserva por el marco del prototipo.')}
      <section class="card workspace" id="workspace" aria-label="Plazos por ubicación o categoría"></section>
      <div class="stack design-notes">
        ${ui.note('Formato de la ruta de ejemplo: en producto llega de la API (breadcrume).')}
        ${ui.note('Al elegir un resultado, el árbol no se abre hasta el nodo: pendiente en React (el Tree del DS no permite expandir desde fuera).')}
        ${ui.note('[Por confirmar] Si eliges una categoría y no quieres ninguna opción, no hay forma de volver a “Filtros” sin elegir una opción y quitarla.')}
        ${ui.note('[Por confirmar con negocio] Consecuencias de activar un plazo programado o desactivar uno vigente.')}
      </div>
      <section class="card card--pad stack-24" id="sugeridos" aria-labelledby="sug-title"></section>
    </div>
  </div>`;
  main.querySelector('[data-go]').addEventListener('click', e => go(e.currentTarget.dataset.go));
  const ws = main.querySelector('#workspace');
  listState.loading = false; listState.error = false;
  busq.foco = false; busq.cerrada = false;
  cleanup.push(() => { clearTimeout(cargaT); clearTimeout(busq.t); });
  renderWorkspace(ws);
  if (listState.node[listState.tab]) cargarPlazos(ws);
  renderSugeridos(main.querySelector('#sugeridos'));
}

/* ---- Árbol (Ubicaciones / Catálogo) · Tree del DS: sin raíz artificial y todo plegado ---- */
function treeHTML() {
  const kind = listState.tab, sel = listState.node[kind];
  const roots = kind === 'sucursales' ? SUCURSALES : CATEGORIAS;
  /* tabindex itinerante: el nodo elegido si se ve; si no, el primero (en Catálogo no hay selección de inicio) */
  const visible = id => {
    let n = FLAT[kind].find(x => x.id === id);
    while (n && n.parent) { if (!listState.expanded.has(n.parent)) return false; n = FLAT[kind].find(x => x.id === n.parent); }
    return !!n;
  };
  const enfocable = sel && visible(sel) ? sel : roots[0].id;
  const nodeRow = (n, depth) => {
    const isSel = sel === n.id, hasKids = !!n.children, open = listState.expanded.has(n.id);
    const pad = [8, 38, 58, 78][depth] ?? 78;
    /* subetiquetas de mapLocationTreeToNodes / mapCatalogTreeToNodes */
    const sub = kind === 'sucursales' ? (n.id === 'emp' ? 'Mi empresa' : `Nivel ${depth}`) : (depth === 0 ? 'Grupo' : `Nivel ${depth}`);
    return `<li role="none"><div class="ds-tree__node" role="treeitem" tabindex="${n.id === enfocable ? 0 : -1}" aria-selected="${isSel}" ${hasKids ? `aria-expanded="${open}"` : ''} data-node="${n.id}" style="padding-left:${pad}px">
      ${hasKids ? `<button type="button" class="ds-tree__toggle" tabindex="-1" aria-label="${open ? 'Contraer' : 'Expandir'} ${esc(n.label)}" aria-expanded="${open}" data-toggle="${n.id}">${icon('ChevronDown')}</button>` : '<span class="ds-tree__spacer"></span>'}
      <span class="ds-tree__label"><span class="ds-tree__title">${esc(n.label)}</span><span class="ds-tree__meta">${sub}</span></span>
    </div>${hasKids && open ? `<ul role="group" class="ds-tree">${n.children.map(c => nodeRow(c, depth + 1)).join('')}</ul>` : ''}</li>`;
  };
  return `<ul class="ds-tree" role="tree" aria-label="${kind === 'sucursales' ? 'Ubicaciones' : 'Catálogo'}">${roots.map(n => nodeRow(n, 0)).join('')}</ul>`;
}

/* ListCard: árbol y tabla en una sola card. El panel y la columna se pintan de inmediato; las filas, al cargar. */
function renderWorkspace(ws) {
  ws.innerHTML = `
    <aside class="tree-panel" id="tree-panel" aria-label="Ubicaciones y catálogo"></aside>
    <section class="plazos" aria-labelledby="plazos-title">
      <div class="plazos__head" id="plazos-head"></div>
      <div id="plazos-filtros"></div>
      <div class="plazos__body" id="plazos-body"></div>
    </section>`;
  renderTreePanel(ws);
  renderTable(ws);
}

/* Panel del árbol (AllInstallmentsSidebar): siempre arranca abierto; plegarlo o desplegarlo no toca la tabla */
function renderTreePanel(ws) {
  const panel = ws.querySelector('#tree-panel');
  ws.classList.toggle('is-collapsed', listState.collapsed);
  if (listState.collapsed) {
    panel.innerHTML = `<div class="tree-panel__rail">${ui.btn('Abrir panel', { variant: 'tertiary', iconLeft: 'PanelCollapse', attrs: 'data-open aria-expanded="false"' })}</div>`;
    panel.querySelector('[data-open]').addEventListener('click', () => { listState.collapsed = false; renderTreePanel(ws); ws.querySelector('[data-collapse]').focus(); });
    return;
  }
  const kind = listState.tab;
  panel.innerHTML = `<div class="tree-panel__scroll">
      <div>${ui.btn('Cerrar panel', { variant: 'tertiary', iconLeft: 'PanelCollapse', attrs: 'data-collapse aria-expanded="true"' })}</div>
      <div class="ds-tabs-button" role="tablist" aria-label="Ver por">
        <button type="button" role="tab" class="ds-tabs-button__tab" aria-selected="${kind === 'sucursales'}" data-tab="sucursales">${icon('PinDrop')}Ubicaciones</button>
        <button type="button" role="tab" class="ds-tabs-button__tab" aria-selected="${kind === 'categorias'}" data-tab="categorias">${icon('Catalogue')}Catálogo</button>
      </div>
      <div class="tree-panel__body">
        <div class="ds-search" id="tree-search">
          <input class="ds-input" id="tree-q" type="text" role="combobox" aria-autocomplete="list" aria-controls="tree-q-list" aria-expanded="false" autocomplete="off" placeholder="Busca una ubicación o categoría" aria-label="Busca una ubicación o categoría" value="${esc(listState.search)}">
          <button type="button" class="ds-search__btn" id="tree-q-btn" aria-label="Buscar"></button>
          <div class="ds-search__list" id="tree-q-list" role="presentation" hidden></div>
        </div>
        <div id="tree">${treeHTML()}</div>
      </div>
    </div>`;
  bindTreePanel(ws);
  paintSearch(ws);
}

function bindTreePanel(ws) {
  ws.querySelector('[data-collapse]').addEventListener('click', () => { listState.collapsed = true; renderTreePanel(ws); ws.querySelector('[data-open]').focus(); });
  ws.querySelectorAll('[data-tab]').forEach(t => t.addEventListener('click', () => {
    if (t.dataset.tab !== listState.tab) cambiarPestana(ws, t.dataset.tab);
    ws.querySelector(`[data-tab="${listState.tab}"]`).focus();
  }));
  ws.querySelector('[role="tablist"]').addEventListener('keydown', e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    cambiarPestana(ws, listState.tab === 'sucursales' ? 'categorias' : 'sucursales');
    ws.querySelector(`[data-tab="${listState.tab}"]`).focus();
  });
  bindSearch(ws);
  const tree = ws.querySelector('#tree');
  tree.addEventListener('click', e => {
    const tog = e.target.closest('[data-toggle]');
    if (tog) { const id = tog.dataset.toggle; listState.expanded.has(id) ? listState.expanded.delete(id) : listState.expanded.add(id); tree.innerHTML = treeHTML(); tree.querySelector(`[data-node="${id}"]`).focus(); return; }
    const node = e.target.closest('[data-node]');
    if (node) selectNode(ws, node.dataset.node);
  });
  /* teclado del árbol de su maqueta (el Tree del DS no lo trae y su spec lo pide): ↑↓, Enter/Espacio, →← */
  tree.addEventListener('keydown', e => {
    const node = e.target.closest('[data-node]'); if (!node) return;
    const all = [...tree.querySelectorAll('[data-node]')]; const i = all.indexOf(node);
    if (e.key === 'ArrowDown' && all[i + 1]) { e.preventDefault(); all[i + 1].focus(); }
    if (e.key === 'ArrowUp' && all[i - 1]) { e.preventDefault(); all[i - 1].focus(); }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectNode(ws, node.dataset.node); }
    const id = node.dataset.node;
    if (e.key === 'ArrowRight' && node.hasAttribute('aria-expanded') && !listState.expanded.has(id)) { listState.expanded.add(id); tree.innerHTML = treeHTML(); tree.querySelector(`[data-node="${id}"]`).focus(); }
    if (e.key === 'ArrowLeft' && listState.expanded.has(id)) { listState.expanded.delete(id); tree.innerHTML = treeHTML(); tree.querySelector(`[data-node="${id}"]`).focus(); }
  });
}

/* Cambiar de pestaña reinicia la selección (handleSegmentChange). En Ubicaciones vuelve a quedar elegida la empresa;
   en Catálogo no se elige nada. El texto del buscador y el filtro se conservan. */
function cambiarPestana(ws, kind, { autoSeleccion = true } = {}) {
  clearTimeout(cargaT);
  listState.tab = kind; listState.node = { sucursales: null, categorias: null };
  listState.expanded = new Set(); listState.page = 1; listState.loading = false; listState.error = false;
  if (kind === 'sucursales' && autoSeleccion) listState.node.sucursales = 'emp';
  renderTreePanel(ws);
  if (!autoSeleccion) return;
  if (listState.node[kind]) cargarPlazos(ws); else renderBody(ws);
}
function selectNode(ws, id, { foco = true } = {}) {
  listState.node[listState.tab] = id; listState.page = 1;
  const tree = ws.querySelector('#tree');
  if (tree) { tree.innerHTML = treeHTML(); if (foco) tree.querySelector(`[data-node="${id}"]`)?.focus(); }
  cargarPlazos(ws);
}
/* Cada selección vacía la tabla y vuelve a pedir los plazos (resetInstallments + getInstallments) */
let cargaT = null;
function cargarPlazos(ws) {
  clearTimeout(cargaT);
  listState.loading = true; listState.error = false;
  renderBody(ws);
  cargaT = setTimeout(() => {
    if (demo.load === 'loading') return;
    listState.loading = false; listState.error = demo.load === 'error';
    renderBody(ws);
  }, 450);
}

/* ---- Buscador del panel (SearchLocationAndCatalog · SearchFieldV2 con autocompletado) ----
   Un solo combobox para las dos pestañas. Abre con el campo enfocado y 3 o más caracteres (ya esperados 300 ms);
   mientras el texto no sea el último buscado, "cargando". Primero ubicaciones, luego categorías. */
const busq = { ultimo: '', foco: false, cerrada: false, activo: 0, t: null };
const rutaDe = (kind, n) => {
  const out = []; let pid = n.parent;
  while (pid) { const pn = FLAT[kind].find(x => x.id === pid); out.unshift(pn.label); pid = pn.parent; }
  return out.join(' / ');
};
function resultadosBusqueda(q) {
  const t = q.trim().toLowerCase();
  if (!t) return [];
  return [
    ...FLAT.sucursales.filter(n => n.label.toLowerCase().includes(t)).map(n => ({ id: n.id, kind: 'sucursales', label: n.label, desc: rutaDe('sucursales', n) })),
    ...FLAT.categorias.filter(n => n.label.toLowerCase().includes(t)).map(n => ({ id: n.id, kind: 'categorias', label: n.label, desc: '' })),
  ];
}
function estadoBusqueda() {
  if (busq.ultimo.length < 3) return { status: 'idle', opciones: [] };
  if (listState.search !== busq.ultimo) return { status: 'loading', opciones: [] };
  const opciones = resultadosBusqueda(busq.ultimo);
  return { status: opciones.length ? 'results' : 'empty', opciones };
}
const resaltar = (label, q) => {
  const t = q.trim().toLowerCase(), i = t ? label.toLowerCase().indexOf(t) : -1;
  if (i < 0) return esc(label);
  return `${esc(label.slice(0, i))}<strong>${esc(label.slice(i, i + t.length))}</strong>${esc(label.slice(i + t.length))}`;
};
function paintSearch(ws) {
  const box = ws.querySelector('#tree-search'); if (!box) return;
  const input = box.querySelector('#tree-q'), btn = box.querySelector('#tree-q-btn'), list = box.querySelector('#tree-q-list');
  busq.foco = busq.foco && box.contains(document.activeElement);
  const { status, opciones } = estadoBusqueda();
  const abierta = busq.foco && !busq.cerrada && status !== 'idle';
  if (busq.activo >= opciones.length) busq.activo = 0;
  input.setAttribute('aria-expanded', String(abierta));
  /* con texto y sin foco, la lupa se cambia por la X, que limpia el texto (no la selección del árbol) */
  const limpiar = !!listState.search && !busq.foco;
  btn.setAttribute('aria-label', limpiar ? 'Limpiar búsqueda' : 'Buscar');
  btn.classList.toggle('ds-search__btn--clear', limpiar);
  btn.innerHTML = icon(limpiar ? 'Close' : 'Search');
  list.hidden = !abierta;
  list.setAttribute('role', abierta && status === 'results' ? 'listbox' : 'presentation');
  if (!abierta) { list.innerHTML = ''; input.removeAttribute('aria-activedescendant'); return; }
  if (status === 'loading') list.innerHTML = '<div class="ds-search__skeleton" role="status" aria-label="Cargando resultados"><span></span><span></span><span></span></div>';
  else if (status === 'empty') list.innerHTML = `<div class="ds-search__empty" role="status">${icon('WarningFilled')}<span><strong>No encontramos resultados para tu búsqueda</strong><span>Revisa la ortografía, intenta otra palabra</span></span></div>`;
  else list.innerHTML = opciones.map((o, i) => `<button type="button" class="ds-search__opt" role="option" id="tree-q-opt-${i}" tabindex="-1" aria-selected="${i === busq.activo}" data-opt="${i}"><span class="ds-search__opt-label">${resaltar(o.label, listState.search)}</span>${o.desc ? `<span class="ds-search__opt-desc">${esc(o.desc)}</span>` : ''}</button>`).join('');
  marcarActivo(ws, false);
}
function marcarActivo(ws, desplazar) {
  const input = ws.querySelector('#tree-q'), opts = [...ws.querySelectorAll('#tree-q-list [role="option"]')];
  opts.forEach((o, i) => o.setAttribute('aria-selected', String(i === busq.activo)));
  if (!opts.length) { input.removeAttribute('aria-activedescendant'); return; }
  input.setAttribute('aria-activedescendant', opts[busq.activo].id);
  if (desplazar) opts[busq.activo].scrollIntoView({ block: 'nearest' });
}
function bindSearch(ws) {
  const box = ws.querySelector('#tree-search'), input = box.querySelector('#tree-q'), btn = box.querySelector('#tree-q-btn'), list = box.querySelector('#tree-q-list');
  input.addEventListener('focus', () => { busq.foco = true; busq.cerrada = false; paintSearch(ws); });
  box.addEventListener('focusout', e => { if (box.contains(e.relatedTarget)) return; busq.foco = false; paintSearch(ws); });
  input.addEventListener('input', () => {
    listState.search = input.value; busq.cerrada = false; busq.activo = 0;
    clearTimeout(busq.t);
    busq.t = setTimeout(() => { busq.ultimo = listState.search; busq.activo = 0; paintSearch(ws); }, 300);
    paintSearch(ws);
  });
  input.addEventListener('keydown', e => {
    const { status, opciones } = estadoBusqueda();
    const conOpciones = busq.foco && !busq.cerrada && status === 'results';
    if (e.key === 'Escape') { e.preventDefault(); busq.cerrada = true; paintSearch(ws); return; }
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && conOpciones) {
      e.preventDefault();
      busq.activo = (busq.activo + (e.key === 'ArrowDown' ? 1 : -1) + opciones.length) % opciones.length;
      marcarActivo(ws, true);
      return;
    }
    if (e.key === 'Enter') { e.preventDefault(); if (conOpciones) elegirBusqueda(ws, opciones[busq.activo]); }
  });
  /* mousedown con preventDefault: el campo no pierde el foco antes de elegir */
  list.addEventListener('mousedown', e => { e.preventDefault(); const o = e.target.closest('[data-opt]'); if (o) elegirBusqueda(ws, estadoBusqueda().opciones[+o.dataset.opt]); });
  list.addEventListener('mouseover', e => { const o = e.target.closest('[data-opt]'); if (o && +o.dataset.opt !== busq.activo) { busq.activo = +o.dataset.opt; marcarActivo(ws, false); } });
  btn.addEventListener('mousedown', e => e.preventDefault());
  btn.addEventListener('click', () => {
    if (btn.classList.contains('ds-search__btn--clear')) { clearTimeout(busq.t); listState.search = ''; busq.ultimo = ''; input.value = ''; }
    input.focus();
  });
}
/* Al elegir: el campo se queda con el nombre y pierde el foco (SearchFieldV2); si hace falta cambia de pestaña y elige el nodo */
function elegirBusqueda(ws, o) {
  if (!o) return;
  clearTimeout(busq.t);
  listState.search = o.label; busq.ultimo = o.label; busq.activo = 0;
  const input = ws.querySelector('#tree-q');
  input.value = o.label; busq.foco = false; input.blur();
  if (listState.tab !== o.kind) cambiarPestana(ws, o.kind, { autoSeleccion: false });
  else paintSearch(ws);
  selectNode(ws, o.id, { foco: false });
}

/* ---- Tabla -------------------------------------------------------------- */
function plazosFiltrados() {
  const kind = listState.tab, node = listState.node[kind];
  if (!node) return { rows: [], nodeCount: 0 };
  const fuente = demo.load === 'empty' ? [] : store.plazos;
  const ids = leavesUnder(kind, node);
  let rows = fuente.filter(p => p[kind] === 'all' || p[kind].some(x => ids.includes(x)));
  const nodeCount = rows.length;
  const cat = filtroCat(), opt = filtroOpt();
  if (opt) rows = rows.filter(p => cat.test(p, opt.v));
  return { rows, nodeCount };
}
function renderTable(ws) { renderFiltros(ws); renderBody(ws); }

/* Encabezado de la columna: "Plazos" y un solo TableFilterChip. Sin categoría lista las categorías;
   con categoría, sus opciones. La barra "Filtrando por:" va debajo, fuera del encabezado. */
function renderFiltros(ws) {
  const head = ws.querySelector('#plazos-head'), barra = ws.querySelector('#plazos-filtros');
  if (!head) return;
  const cat = filtroCat(), opt = filtroOpt();
  const etiqueta = opt ? opt.label : cat ? cat.label : 'Filtros';
  const opciones = cat
    ? cat.opciones.map(o => `<button type="button" role="option" tabindex="-1" aria-selected="${o.v === listState.filtro.opt}" data-filtro-opt="${o.v}">${esc(o.label)}</button>`)
    : FILTROS.map(c => `<button type="button" role="option" tabindex="-1" aria-selected="false" data-filtro-cat="${c.key}">${esc(c.label)}</button>`);
  head.innerHTML = `<h2 class="t-texto-bold" id="plazos-title">Plazos</h2>
    <div class="ds-filter-chip">
      <button type="button" class="ds-filter-chip__btn" aria-haspopup="listbox" aria-expanded="false" aria-controls="filtro-list" data-menu-trigger data-active="${!!opt}">${icon('FilterAlt')}<span>${esc(etiqueta)}</span>${icon('ArrowDropDown', 'caret')}</button>
      <div class="ds-filter-chip__list" role="listbox" id="filtro-list" aria-label="${esc(etiqueta)}" hidden>${opciones.join('')}</div>
    </div>`;
  barra.innerHTML = opt ? `<div class="filters-applied"><span class="t-texto-bold">Filtrando por:</span>
      <span class="chip-filter">${icon('Check')}${esc(cat.label)}: ${esc(opt.label)}<button type="button" class="chip-filter__x" aria-label="Eliminar" tabindex="-1" data-clear-all>${icon('Close')}</button></span>
      ${ui.btn('Limpiar filtros', { variant: 'tertiary', attrs: 'data-clear-all' })}</div>` : '';
  const chip = () => ws.querySelector('.ds-filter-chip__btn');
  head.onclick = e => {
    const c = e.target.closest('[data-filtro-cat]');
    if (c) { listState.filtro = { cat: c.dataset.filtroCat, opt: null }; renderFiltros(ws); chip().focus(); return; }
    const o = e.target.closest('[data-filtro-opt]');
    if (!o) return;
    /* elegir la misma opción otra vez quita el filtro y el chip vuelve a "Filtros" */
    listState.filtro = o.dataset.filtroOpt === listState.filtro.opt ? { cat: null, opt: null } : { cat: listState.filtro.cat, opt: o.dataset.filtroOpt };
    listState.page = 1; renderTable(ws); chip().focus();
  };
  barra.onclick = e => { if (e.target.closest('[data-clear-all]')) limpiarFiltro(ws); };
}
function limpiarFiltro(ws) {
  listState.filtro = { cat: null, opt: null }; listState.page = 1;
  renderTable(ws); ws.querySelector('.ds-filter-chip__btn').focus();
}

/* Celdas de la fila (InstallmentTableRow) */
const segmentacionTxt = p => {
  /* getSegmentationText: en Ubicaciones cuenta artículos (categorías); en Catálogo, sucursales */
  const kind = listState.tab === 'sucursales' ? 'categorias' : 'sucursales';
  const n = p[kind] === 'all' ? leaves(kind).length : p[kind].length;
  return kind === 'categorias' ? `${n} ${n === 1 ? 'Artículo' : 'Artículos'}` : `${n} ${n === 1 ? 'Sucursal' : 'Sucursales'}`;
};
/* la API manda un solo número de interés: el valor fijo o el del primer rango */
const interesTxt = t => `${t.tipo === 'fija' ? 'Fijo' : 'Dinámico'} ${pct(t.tipo === 'fija' ? t.valor : (t.rangos[0] || {}).interes)}`;
const adicionalesTrigger = adic => {
  if (!adic.length) return '';
  const contenido = `<span class="tip-title">Interés adicional</span><span class="tip-list">${adic.map(a => `<span class="tip-item"><span class="tip-item__name">${esc(a.nombre)}</span><span>${a.cobro === 'durante' ? 'Durante el periodo' : 'Después del periodo'}</span><span>${pct(a.tasa)}</span></span>`).join('')}</span>`;
  return `<span class="adic-trigger" tabindex="0" data-tip="${esc(contenido)}" data-tip-pos="bottom" data-tip-size="large">+ ${adic.length} ${adic.length === 1 ? 'adicional' : 'adicionales'}</span>`;
};
/* InstallmentStateBadge: vigente con fin → "Expira"; programado → "Inicia" */
const estadoCelda = p => {
  const f = p.estado === 'vigente' && p.fin ? `Expira ${ddmmaaaa(p.fin)}` : p.estado === 'programado' ? `Inicia ${ddmmaaaa(p.inicio)}` : '';
  return `<span class="cell-stack">${ui.chip(p.estado)}${f ? `<span class="t-caption">${f}</span>` : ''}</span>`;
};
const filaPlazo = p => `<tr class="is-clickable" tabindex="0" data-row="${p.id}" aria-label="${p.estado === 'borrador' ? 'Editar' : 'Ver detalle de'} ${esc(p.nombre)}">
    <th scope="row">${esc(p.nombre)}</th>
    <td>${segmentacionTxt(p)}</td>
    <td class="cell-text-desc"><p><span class="cell-stack"><span>${interesTxt(p.tasa)}</span>${adicionalesTrigger(p.adicionales)}</span></p></td>
    <td>${estadoCelda(p)}</td>
    <td class="cell-iconbtn">${ui.menu(`m-${p.id}`, `Más acciones de ${p.nombre}`, accionesPorEstado(p).map(a => ({ ...a, data: `data-id="${p.id}"` })))}</td>
  </tr>`;
/* vacío de la tabla (AllInstallmentsEmptyState): ilustración, texto y un botón */
const vacioTabla = (msg, accion) => `<div class="empty-state" role="status"><img src="ilust-01-empty.svg" alt="" height="150" style="width:auto"><p class="t-caption">${msg}</p>${accion || ''}</div>`;
const filasCarga = (n, cols) => Array.from({ length: n }, () => `<tr>${'<td class="cell-loading"><div class="skeleton"></div></td>'.repeat(cols)}</tr>`).join('');
const abrirFila = id => { const p = getPlazo(id); if (p) go(p.estado === 'borrador' ? `#/plazos/${id}/editar` : `#/plazos/${id}`); };

/* Cuerpo (TableArea). Orden: cargando → error sin datos → sin resultados con filtro → sin nodo → sin plazos → filas */
function renderBody(ws) {
  const body = ws.querySelector('#plazos-body'); if (!body) return;
  const node = listState.node[listState.tab];
  const { rows, nodeCount } = plazosFiltrados();
  const celdaVacia = html => `<tr><td class="cell-empty" colspan="5">${html}</td></tr>`;
  let filas = '', pages = 0;
  if (listState.loading) filas = filasCarga(PAGE, 5);
  else if (listState.error) filas = celdaVacia(ui.alert('error', { title: 'No pudimos cargar los plazos', action: ui.btn('Intenta nuevamente', { variant: 'tertiary', attrs: 'data-retry' }) }));
  else if (nodeCount && !rows.length) filas = celdaVacia(vacioTabla('No hay plazos con estos filtros', ui.btn('Limpiar filtros', { variant: 'secondary', attrs: 'data-clear-all' })));
  else if (!node) filas = '';
  else if (!rows.length) filas = celdaVacia(vacioTabla('No tienes plazos creados todavía. Una vez que los configures, podrás verlos aquí.', ui.btn('Crear plazo', { variant: 'secondary', iconLeft: 'Add', attrs: 'data-go="#/plazos/nuevo"' })));
  else {
    pages = Math.ceil(rows.length / PAGE);
    listState.page = Math.min(listState.page, pages);
    filas = rows.slice((listState.page - 1) * PAGE, listState.page * PAGE).map(filaPlazo).join('');
  }
  body.innerHTML = `<div class="table-frame"><div class="table-wrap" role="region" aria-labelledby="plazos-title" tabindex="0">
      <table class="ds-table ds-table--plazos">
        <thead><tr><th scope="col">Nombre</th><th scope="col">Segmentación</th><th scope="col">Interés</th><th scope="col">Estado</th><th scope="col">Acciones</th></tr></thead>
        <tbody>${filas}</tbody>
      </table></div></div>
    ${pages > 1 ? `<nav class="ds-pagination" aria-label="Paginación">
      <div class="ds-pagination__group"><button type="button" aria-label="Primera página" data-page="1" ${listState.page === 1 ? 'disabled' : ''}>${icon('FirstPage')}</button><button type="button" aria-label="Página anterior" data-page="${listState.page - 1}" ${listState.page === 1 ? 'disabled' : ''}>${icon('ArrowBackIos')}</button></div>
      <span class="ds-pagination__text">${(listState.page - 1) * PAGE + 1}-${Math.min(listState.page * PAGE, rows.length)} de ${rows.length} resultados</span>
      <div class="ds-pagination__group"><button type="button" aria-label="Página siguiente" data-page="${listState.page + 1}" ${listState.page === pages ? 'disabled' : ''}>${icon('ArrowForwardIos')}</button><button type="button" aria-label="Última página" data-page="${pages}" ${listState.page === pages ? 'disabled' : ''}>${icon('LastPage')}</button></div>
    </nav>` : ''}`;
  body._offSombras?.();
  body._offSombras = bindScrollShadows(body.querySelector('.table-frame'));

  body.onclick = e => {
    const pg = e.target.closest('[data-page]');
    if (pg && !pg.disabled) { listState.page = +pg.dataset.page; renderBody(ws); ws.querySelector('#plazos-title').scrollIntoView({ block: 'nearest' }); return; }
    if (e.target.closest('[data-retry]')) { cargarPlazos(ws); return; }
    if (e.target.closest('[data-clear-all]')) { limpiarFiltro(ws); return; }
    const goBtn = e.target.closest('[data-go]');
    if (goBtn) { go(goBtn.dataset.go); return; }
    const act = e.target.closest('[data-action]');
    if (act) {
      e.stopPropagation();
      /* cerrar, devolver el foco al ⋮ y luego ejecutar la acción */
      const trigger = act.closest('.menu-wrap')?.querySelector('[data-menu-trigger]');
      closeMenus(); trigger?.focus();
      return runAction(act.dataset.action, getPlazo(act.dataset.id), act, () => renderBody(ws));
    }
    if (e.target.closest('button, a, [data-tip], [role="menu"]')) return;
    const row = e.target.closest('[data-row]');
    if (row) abrirFila(row.dataset.row);
  };
  body.onkeydown = e => {
    const row = e.target.closest('[data-row]');
    if (row && e.target === row && e.key === 'Enter') { e.preventDefault(); abrirFila(row.dataset.row); }
  };
}
function runAction(action, p, el, refresh) {
  if (action === 'editar') go(`#/plazos/${p.id}/editar`);
  if (action === 'ver') go(`#/plazos/${p.id}`);
  if (action === 'duplicar') duplicar(p, el.classList.contains('ds-btn') ? el : null);
  if (action === 'activar') confirmEstado(p, true, refresh);
  if (action === 'desactivar') confirmEstado(p, false, refresh);
}

/* ---- Plazos sugeridos (InstallmentsSuggestions + SuggestionTermRow) ----- */
/* L55: aquí van la cantidad real de adicionales y de sucursales (en React el "+ 1 adicional" es fijo y dice "artículos") */
const sugInteresTxt = s => {
  const fija = s.tasa.tipo === 'fija';
  const vals = s.tasa.rangos.map(r => r.interes).filter(v => v != null);
  const base = `${fija ? 'Fijo' : 'Dinámico'} ${fija ? pct(s.tasa.valor) : `${pct(Math.min(...vals))}-${pct(Math.max(...vals))}`}`;
  const n = s.adicionales.length;
  return n ? `${base} + ${n} ${n === 1 ? 'adicional' : 'adicionales'}` : base;
};
const sugSegTxt = s => { const n = s.sucursales === 'all' ? leaves('sucursales').length : s.sucursales.length; return `${n} ${n === 1 ? 'sucursal' : 'sucursales'}`; };
function renderSugeridos(box) {
  box.innerHTML = `<div class="sug-head"><h2 class="t-titulos" id="sug-title">Plazos sugeridos</h2>
      <p class="t-texto" style="color:var(--text-captions)">Ataskate te sugiere plazos optimizados según tus productos y comportamiento de préstamo.</p></div>
    <div class="table-frame"><div class="table-wrap" role="region" aria-labelledby="sug-title" tabindex="0"><table class="ds-table">
      <thead><tr><th scope="col">Nombre sugerido</th><th scope="col">Interés</th><th scope="col">Rango préstamo</th><th scope="col">Duración</th><th scope="col">Segmentación</th><th scope="col">Acción</th></tr></thead>
      <tbody id="sug-rows">${filasCarga(4, 6)}</tbody>
    </table></div></div>
    ${ui.note('[Por confirmar] En React el “+ 1 adicional” es fijo y la segmentación dice “artículos” (hallazgo L-01 de la auditoría); aquí se muestran los datos reales.')}`;
  const tb = box.querySelector('#sug-rows');
  bindScrollShadows(box.querySelector('.table-frame'));
  box.onclick = e => { const b = e.target.closest('[data-sug]'); if (b) go(`#/plazos/nuevo?sugerencia=${b.dataset.sug}`); };
  if (demo.load === 'loading') return;
  const t = setTimeout(() => {
    /* sin sugerencias o con error, el mismo vacío con ilustración (React no tiene un error propio) */
    tb.innerHTML = demo.load === 'error' || !store.sugerencias.length
      ? `<tr><td class="cell-empty" colspan="6"><div class="empty-state" role="status"><img src="ilust-01-empty.svg" alt="" height="150" style="width:auto"><p class="t-texto-bold">No hay más sugerencias por ahora</p><p class="t-caption">Has activado los plazos recomendados para tu operación actual. Ataskate sigue analizando tendencias para ofrecerte nuevas configuraciones optimizadas próximamente.</p></div></td></tr>`
      : store.sugerencias.map(s => `<tr>
        <td>${esc(s.nombre)}</td>
        <td>${sugInteresTxt(s)}</td>
        <td>${money(s.montoMin)} - ${money(s.montoMax || 0)}</td>
        <td>${duracionTxt(s.duracion)}</td>
        <td>${sugSegTxt(s)}</td>
        <td>${ui.btn('Personalizar', { variant: 'secondary', iconLeft: 'Edit', attrs: `data-sug="${s.id}" aria-label="Personalizar ${esc(s.nombre)}"` })}</td>
      </tr>`).join('');
  }, 450);
  cleanup.push(() => clearTimeout(t));
}

/* ==========================================================================
   DETALLE
   ========================================================================== */
function renderDetail(main, id, tabParam) {
  const p0 = getPlazo(id);
  main.innerHTML = `<div class="page">
    ${ui.breadcrumb([{ label: 'Configuración de sistema', href: '#/plazos' }, { label: 'Plazos', href: '#/plazos' }, { label: p0 ? p0.nombre : 'Plazo' }])}
    <div id="detail"></div></div>`;
  const box = main.querySelector('#detail');
  if (!p0) {
    box.innerHTML = ui.alert('warning', { title: 'Este plazo ya no existe', text: 'Puede que se haya eliminado o que el enlace esté incompleto.', action: ui.btn('Ir a plazos', { variant: 'tertiary', attrs: 'data-go="#/plazos"' }) });
    box.querySelector('[data-go]').addEventListener('click', () => go('#/plazos'));
    return;
  }
  withLoad(box, 'Cargando plazo…', () => draw(), 'No pudimos cargar el plazo');

  let tab = ['config', 'sucursales', 'categorias'].includes(tabParam) ? tabParam : 'config';
  function draw() {
    const p = getPlazo(id);
    /* El detalle ya tiene "Editar plazo": su ⋮ usa su propia lista con la misma regla de estado que el listado
       (vigente → Desactivar; inactivo o programado → Activar; el borrador solo se duplica). Su spec está en pausa. */
    const items = [{ action: 'duplicar', label: 'Duplicar', icon: 'ContentCopy' }];
    if (p.estado === 'vigente') items.push({ action: 'desactivar', label: 'Desactivar', icon: 'Power' });
    if (p.estado === 'inactivo' || p.estado === 'programado') items.push({ action: 'activar', label: 'Activar', icon: 'Power' });
    box.innerHTML = `
      <div class="title-row">
        <div class="title-row__text">
          <div class="title-row__heading"><h1 class="t-titulo-pagina">${esc(p.nombre)}</h1>${ui.chip(p.estado)}</div>
          <p class="t-caption">${vigenciaTxt(p)}</p>
        </div>
        <div class="title-row__actions">${ui.btn('Editar plazo', { iconLeft: 'Edit', attrs: 'data-action="editar"' })}${ui.menu('m-detail', 'Más acciones del plazo', items)}</div>
      </div>
      <div class="stack">
        <section class="card" aria-label="Resumen del plazo">
          <div class="summary">
            <div class="kv"><span class="kv__k">Interés base</span><span class="kv__v">${tasaTxt(p.tasa)}${p.prorrateo ? '<small>Con prorrateo diario</small>' : ''}</span></div>
            <div class="kv"><span class="kv__k">Monto del préstamo</span><span class="kv__v">${montoTxt(p)}</span></div>
            <div class="kv"><span class="kv__k">Duración</span><span class="kv__v">${duracionTxt(p.duracion)}</span></div>
            <div class="kv"><span class="kv__k">Refrendos</span><span class="kv__v">${p.refrendos.limitar ? `Hasta ${p.refrendos.max}` : 'Sin límite'}</span></div>
            <div class="kv"><span class="kv__k">Sucursales</span><span class="kv__v">${segTxt(p, 'sucursales')}</span></div>
            <div class="kv"><span class="kv__k">Categorías</span><span class="kv__v">${segTxt(p, 'categorias')}</span></div>
          </div>
        </section>
        ${p.estado === 'borrador' ? ui.alert('info', { title: 'Este plazo es un borrador', text: 'No se ofrece en ninguna sucursal hasta que lo completes y lo guardes.', action: ui.btn('Completar plazo', { variant: 'tertiary', attrs: 'data-action="editar"' }) }) + ui.note('[Por confirmar con negocio] Qué es exactamente un borrador y cómo se publica.') : ''}
        <div class="card">
          <div class="ds-tabs" role="tablist" aria-label="Información del plazo" style="padding:0 var(--sp-16)">
            ${[['config', 'Configuración'], ['sucursales', `Sucursales (${p.sucursales === 'all' ? leaves('sucursales').length : p.sucursales.length})`], ['categorias', `Categorías (${p.categorias === 'all' ? leaves('categorias').length : p.categorias.length})`]]
              .map(([k, l]) => `<button type="button" role="tab" class="ds-tabs__tab" id="tab-${k}" aria-selected="${tab === k}" aria-controls="panel" tabindex="${tab === k ? 0 : -1}" data-tab="${k}">${l}</button>`).join('')}
          </div>
          <div id="panel" role="tabpanel" aria-labelledby="tab-${tab}" style="padding:var(--sp-24)"></div>
        </div>
        ${ui.note('Se quitó la pestaña “Indicadores”: hoy está vacía. Vuelve cuando exista su diseño y sus datos [Por confirmar con el PO].')}
      </div>`;
    drawPanel(p);
    box.querySelectorAll('[data-action]').forEach(b => b.addEventListener('click', e => { closeMenus(); b.closest('.menu-wrap')?.querySelector('[data-menu-trigger]')?.focus(); runAction(b.dataset.action, getPlazo(id), b, draw); }));
    const tl = box.querySelector('[role="tablist"]');
    tl.addEventListener('click', e => { const t = e.target.closest('[data-tab]'); if (t) setTab(t.dataset.tab); });
    tl.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const order = ['config', 'sucursales', 'categorias'];
      const i = (order.indexOf(tab) + (e.key === 'ArrowRight' ? 1 : -1) + order.length) % order.length;
      setTab(order[i]);
    });
  }
  function setTab(t) {
    tab = t;
    box.querySelectorAll('[data-tab]').forEach(b => { const on = b.dataset.tab === t; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; if (on) b.focus(); });
    box.querySelector('#panel').setAttribute('aria-labelledby', `tab-${t}`);
    currentHash = `#/plazos/${id}${t === 'config' ? '' : '?tab=' + t}`; setUrl(currentHash, true);
    drawPanel(getPlazo(id));
  }
  function drawPanel(p) {
    const panel = box.querySelector('#panel');
    if (tab === 'config') {
      const t = p.tasa;
      panel.innerHTML = `<div class="detail-grid">
        <section class="card card--pad stack" aria-labelledby="d-cond"><h2 class="t-subtitulos" id="d-cond">Condiciones</h2>
          <ul class="list-plain">
            <li><span>Monto del préstamo</span><span>${montoTxt(p)}</span></li>
            <li><span>Duración</span><span>${duracionTxt(p.duracion)}</span></li>
            <li><span>Interés base</span><span>${t.tipo === 'fija' ? `Tasa fija ${pct(t.valor)}` : 'Tasa dinámica'}</span></li>
            <li><span>Prorrateo diario</span><span>${p.prorrateo ? 'Sí' : 'No'}</span></li>
            <li><span>Refrendos</span><span>${p.refrendos.limitar ? `Hasta ${p.refrendos.max}` : 'Sin límite'}</span></li>
            <li><span>Vigencia</span><span>${fecha(p.inicio)}${p.fin ? ` – ${fecha(p.fin)}` : ' · sin fecha de fin'}</span></li>
          </ul>
          ${t.tipo === 'dinamica' ? `<div class="table-wrap"><table class="ds-table"><thead><tr><th scope="col">Préstamo sobre avalúo</th><th scope="col">Interés</th></tr></thead><tbody>${t.rangos.map((r, i) => `<tr><td>${i === 0 ? 0 : pct(t.rangos[i - 1].hasta)} a ${pct(r.hasta)}</td><td>${pct(r.interes)}</td></tr>`).join('')}</tbody></table></div>` : ''}
        </section>
        <section class="card card--pad stack" aria-labelledby="d-adic"><h2 class="t-subtitulos" id="d-adic">Intereses adicionales</h2>
          ${p.adicionales.length ? `<ul class="item-list">${p.adicionales.map(a => `<li class="item"><div class="item__body"><span class="item__title">${esc(a.nombre)}</span><span class="item__sub">${adicionalTxt(a)}</span></div></li>`).join('')}</ul>` : '<p class="t-caption">Sin intereses adicionales</p>'}
        </section>
        <section class="card card--pad stack" aria-labelledby="d-cli"><h2 class="t-subtitulos" id="d-cli">Cliente objetivo</h2>
          ${p.cliente.activo ? `<ul class="list-plain">
            <li><span>Edad</span><span>${p.cliente.edadMin} a ${p.cliente.edadMax} años</span></li>
            <li><span>Sexo</span><span>${p.cliente.sexo.length ? p.cliente.sexo.map(v => SEXO.find(o => o.v === v).label).join(', ') : 'Todos'}</span></li>
            <li><span>Estado civil</span><span>${p.cliente.estadoCivil.length ? p.cliente.estadoCivil.map(v => ESTADO_CIVIL.find(o => o.v === v).label).join(', ') : 'Todos'}</span></li>
            <li><span>Score de cliente</span><span>${p.cliente.score.map(v => SCORE.find(o => o.v === v).label).join(', ')}</span></li></ul>` : '<p class="t-caption">Sin cliente objetivo: aplica a cualquier cliente</p>'}
        </section>
        <section class="card card--pad stack" aria-labelledby="d-refi"><h2 class="t-subtitulos" id="d-refi">Refinanciamiento automático</h2>
          ${p.refi.activo && p.refi.condiciones.length ? `<ul class="list-plain">${p.refi.condiciones.map(c => `<li><span>${REFI[c.tipo].label}</span><span>${condTxt(c)}</span></li>`).join('')}</ul>` : '<p class="t-caption">Desactivado</p>'}
        </section>
      </div>`;
      return;
    }
    const kind = tab;
    const ids = p[kind] === 'all' ? leaves(kind) : p[kind];
    panel.innerHTML = `<div class="stack">
      ${p[kind] === 'all' ? ui.alert('info', { text: kind === 'sucursales' ? 'Este plazo aplica a todas las sucursales de tu empresa.' : 'Este plazo aplica a todo el catálogo.' }) + ui.note('[Por confirmar con negocio] Si “todas” incluye las sucursales o categorías nuevas.') : ''}
      <div class="ds-search" role="search" style="max-width:430px"><label class="sr-only" for="seg-q">Buscar ${kind === 'sucursales' ? 'sucursal' : 'categoría'}</label>
        <input class="ds-input" id="seg-q" type="search" autocomplete="off" placeholder="Buscar ${kind === 'sucursales' ? 'sucursal' : 'categoría'}"><span class="ds-search__btn">${icon('Search')}</span></div>
      <div class="table-wrap" role="region" aria-label="${kind === 'sucursales' ? 'Sucursales' : 'Categorías'} del plazo" tabindex="0"><table class="ds-table">
        <thead><tr><th scope="col">${kind === 'sucursales' ? 'Sucursal' : 'Categoría'}</th><th scope="col">${kind === 'sucursales' ? 'Zona' : 'Grupo'}</th></tr></thead>
        <tbody id="seg-rows"></tbody></table></div></div>`;
    const rowsEl = panel.querySelector('#seg-rows');
    const paint = q => {
      const list = ids.filter(x => labelOf(kind, x).toLowerCase().includes(q.toLowerCase()));
      rowsEl.innerHTML = list.length ? list.map(x => `<tr><td>${esc(labelOf(kind, x))}</td><td>${esc(parentLabel(kind, x))}</td></tr>`).join('')
        : `<tr><td colspan="2"><div class="empty" style="padding:var(--sp-24)"><p class="empty__msg">Sin coincidencias para “${esc(q)}”</p></div></td></tr>`;
    };
    paint('');
    panel.querySelector('#seg-q').addEventListener('input', e => paint(e.target.value));
  }
}
const condTxt = c => {
  const lbl = (arr, vals) => vals.map(v => arr.find(o => o.v === v).label).join(', ');
  if (c.tipo === 'estado') return lbl(ESTADOS_CONTRATO, c.valores);
  if (c.tipo === 'canal') return lbl(CANALES, c.valores);
  if (c.tipo === 'score') return lbl(SCORE, c.valores);
  if (c.tipo === 'refrendos') return `${COMPARADORES.find(o => o.v === c.comp).label.toLowerCase()} ${c.valor}`;
  if (c.tipo === 'monto') return `${COMPARADORES.find(o => o.v === c.comp).label.toLowerCase()} ${money(c.valor)}`;
  if (c.tipo === 'comision') return c.modo === 'porcentaje' ? pct(c.valor) : money(c.valor);
  return '';
};

/* ==========================================================================
   CREAR / EDITAR
   ========================================================================== */
const SECCIONES = [
  ['sec-detalles', 'Detalles'], ['sec-segmentacion', 'Segmentación'], ['sec-condiciones', 'Condiciones'],
  ['sec-adicionales', 'Intereses adicionales'], ['sec-cliente', 'Cliente objetivo'], ['sec-refi', 'Refinanciamiento'],
];
const MAX_MONTO = 10000000;
const NOMBRE_RE = /^[\p{L}\p{N} \-_.#,*$()%]+$/u;

function renderForm(main, { mode, id, sugerencia, copia }) {
  const isEdit = mode === 'edit';
  const original = isEdit ? getPlazo(id) : null;
  const sug = sugerencia ? store.sugerencias.find(s => s.id === sugerencia) : null;
  const titulo = isEdit ? 'Editar plazo' : 'Nuevo plazo';
  const crumbs = [{ label: 'Configuración de sistema', href: '#/plazos' }, { label: 'Plazos', href: '#/plazos' }];
  if (isEdit && original) crumbs.push({ label: original.nombre, href: `#/plazos/${id}` });
  crumbs.push({ label: titulo });
  main.innerHTML = `<div class="page page--form">${ui.breadcrumb(crumbs)}<div id="form-root"></div></div>`;
  const root = main.querySelector('#form-root');

  if (isEdit && !original) {
    root.innerHTML = ui.alert('warning', { title: 'Este plazo ya no existe', action: ui.btn('Ir a plazos', { variant: 'tertiary', attrs: 'data-go' }) });
    root.querySelector('[data-go]').addEventListener('click', () => go('#/plazos'));
    return;
  }
  const start = () => {
    let f;
    if (isEdit) f = clone(original);
    else {
      f = nuevoPlazo();
      if (sug) Object.assign(f, clone({ nombre: sug.nombre, tasa: sug.tasa, montoMin: sug.montoMin, montoMax: sug.montoMax, duracion: sug.duracion, sucursales: sug.sucursales, categorias: sug.categorias, adicionales: sug.adicionales }));
    }
    if (f.tasa.tipo === 'fija' && !f.tasa.rangos.length) f.tasa.rangos = [{ hasta: null, interes: null }];
    buildForm(root, f, { isEdit, original, sug, copia, titulo });
  };
  if (isEdit) withLoad(root, 'Cargando plazo…', start, 'No pudimos cargar el plazo. Para no perder la configuración, no se puede editar hasta que cargue.');
  else start();
}

function buildForm(root, f, ctx) {
  const { isEdit, original, sug, copia, titulo } = ctx;
  let dirty = false;
  const errors = {};

  const intro = [];
  if (sug) intro.push(ui.alert('info', { title: `Basado en la sugerencia de Ataskate “${esc(sug.nombre)}”`, text: 'Ajusta lo que necesites. Al guardar se crea un plazo nuevo en tu lista.' }));
  if (copia) intro.push(ui.alert('info', { title: 'Estás editando una copia', text: 'Cambia el nombre y lo que necesites. Se guarda como un plazo independiente.' }));
  if (isEdit && !copia && original.estado === 'vigente') intro.push(ui.alert('warning', { title: 'Este plazo está vigente', text: 'Revisa a qué contratos aplican los cambios antes de guardar.' }) + ui.note('[Por confirmar con negocio] Editar un plazo vigente: ¿los cambios aplican solo a contratos nuevos o también a los existentes? El texto del aviso depende de esa regla.'));

  root.innerHTML = `
    <div class="title-row"><div class="title-row__text"><h1 class="t-titulo-pagina">${titulo}</h1>
      <p class="t-caption">Los campos sin la marca (opcional) son obligatorios.</p></div></div>
    ${intro.length ? `<div class="stack" style="margin-bottom:var(--sp-16)">${intro.join('')}</div>` : ''}
    <nav class="form-anchor" aria-label="Secciones del formulario"><div class="ds-anchor">${SECCIONES.map(([sid, l], i) => `<a href="#${sid}" data-anchor="${sid}" ${i === 0 ? 'aria-current="true"' : ''}>${l}</a>`).join('')}</div></nav>
    <form class="form-layout" id="plazo-form" novalidate>
      <div class="form-cards">
        <section class="card form-card" id="sec-detalles" aria-labelledby="h-det">
          <div class="card__titles"><h2 class="t-subtitulos" id="h-det">Detalles del plazo</h2></div>
          ${ui.field({ id: 'nombre', label: 'Nombre del plazo', help: 'Así lo verán en sucursal al elegir el plazo. Ejemplo: Oro 30 días', input: ui.input({ id: 'nombre', value: f.nombre, placeholder: 'Escribe el nombre del plazo', attrs: 'maxlength="100" autocomplete="off"' }) })}
          <div class="field-row">
            ${ui.field({ id: 'inicio', label: 'Fecha de inicio', input: `<div class="ds-input-wrap">${ui.input({ id: 'inicio', value: ddmmaaaa(f.inicio), placeholder: 'DD/MM/AAAA', attrs: 'inputmode="numeric" maxlength="10"' })}${icon('CalendarToday', 'ds-input__icon')}</div>` })}
            ${ui.field({ id: 'fin', label: 'Fecha de fin', optional: true, help: 'Si la dejas vacía, el plazo no vence.', input: `<div class="ds-input-wrap">${ui.input({ id: 'fin', value: ddmmaaaa(f.fin), placeholder: 'DD/MM/AAAA', attrs: 'inputmode="numeric" maxlength="10"' })}${icon('CalendarToday', 'ds-input__icon')}</div>` })}
          </div>
        </section>

        <section class="card form-card" id="sec-segmentacion" aria-labelledby="h-seg">
          <div class="card__titles"><h2 class="t-subtitulos" id="h-seg">Segmentación</h2><p class="t-caption">Elige en qué sucursales y para qué categorías se ofrece este plazo.</p></div>
          <div id="ft-sucursales"></div>
          <div id="ft-categorias"></div>
        </section>

        <section class="card form-card" id="sec-condiciones" aria-labelledby="h-cond">
          <div class="card__titles"><h2 class="t-subtitulos" id="h-cond">Condiciones</h2></div>
          <div class="form-block">
            <h3 class="section-sub">Monto del préstamo</h3>
            <div class="field-row">
              ${ui.field({ id: 'montoMin', label: 'Monto mínimo', input: ui.input({ id: 'montoMin', value: f.montoMin != null ? money(f.montoMin) : '', placeholder: '$0.00', attrs: 'inputmode="decimal" data-money' }) })}
              ${ui.field({ id: 'montoMax', label: 'Monto máximo', optional: true, help: 'Sin monto máximo, no hay tope.', input: ui.input({ id: 'montoMax', value: f.montoMax != null ? money(f.montoMax) : '', placeholder: '$0.00', attrs: 'inputmode="decimal" data-money' }) })}
            </div>
          </div>
          <div class="form-block">
            <h3 class="section-sub" id="lbl-duracion">Duración de cada periodo</h3>
            <div class="field-row">
              ${ui.field({ id: 'durN', label: 'Cantidad', input: ui.input({ id: 'durN', value: f.duracion.n ?? '', placeholder: '0', attrs: 'inputmode="numeric" maxlength="3"' }) })}
              ${ui.field({ id: 'durU', label: 'Unidad', input: ui.select({ id: 'durU', value: f.duracion.unidad, options: [{ v: 'dias', label: 'Días' }, { v: 'semanas', label: 'Semanas' }, { v: 'meses', label: 'Meses' }] }) })}
            </div>
          </div>
          <div class="form-block">
            <h3 class="section-sub" id="lbl-tasa">Interés base</h3>
            <div class="radio-group" role="radiogroup" aria-labelledby="lbl-tasa">
              <div class="radio-option">${ui.radio({ name: 'tasaTipo', value: 'fija', label: 'Tasa fija', checked: f.tasa.tipo === 'fija' })}<span class="radio-option__sub">La misma tasa para cualquier préstamo de este plazo.</span></div>
              <div class="radio-option">${ui.radio({ name: 'tasaTipo', value: 'dinamica', label: 'Tasa dinámica', checked: f.tasa.tipo === 'dinamica' })}<span class="radio-option__sub">La tasa cambia según el porcentaje del avalúo que se presta.</span></div>
            </div>
            <div id="tasa-detail"></div>
            ${ui.check({ name: 'prorrateo', value: '1', label: 'Aplicar interés con prorrateo diario', sub: 'El interés se calcula por los días transcurridos del periodo.', checked: f.prorrateo })}
            ${ui.note('[Por confirmar con negocio] Confirmar que “prorrateo diario” significa cobrar solo los días transcurridos. Hoy el texto del checkbox cambia según el interruptor HU-CP-395-F y dice lo contrario cuando está apagado.')}
          </div>
          <div class="form-block">
            <div class="switch-row"><h3 class="section-sub">Refrendos</h3>${ui.switch({ id: 'refLimitar', label: 'Limitar el número de refrendos', checked: f.refrendos.limitar })}</div>
            <div id="ref-max-wrap" ${f.refrendos.limitar ? '' : 'hidden'}>
              <div style="max-width:320px">${ui.field({ id: 'refMax', label: 'Máximo de refrendos', input: ui.input({ id: 'refMax', value: f.refrendos.max ?? '', placeholder: '0', attrs: 'inputmode="numeric" maxlength="3"' }) })}</div>
            </div>
          </div>
        </section>

        <section class="card form-card" id="sec-adicionales" aria-labelledby="h-adic">
          <div class="card__head"><div class="card__titles"><h2 class="t-subtitulos" id="h-adic">Intereses adicionales</h2><p class="t-caption">Cargos que se suman al interés base, como días de gracia o almacenamiento.</p></div>
            ${ui.btn('Agregar interés', { variant: 'secondary', iconLeft: 'Add', attrs: 'data-add-interes' })}</div>
          <div id="adic-list"></div>
        </section>

        <section class="card form-card" id="sec-cliente" aria-labelledby="h-cli">
          <div class="card__titles"><h2 class="t-subtitulos" id="h-cli">Cliente objetivo</h2><p class="t-caption">Define el perfil de cliente para este plazo: edad, sexo, estado civil y score.</p></div>
          ${ui.switch({ id: 'cliActivo', label: 'Definir un cliente objetivo', checked: f.cliente.activo })}
          ${ui.note('[Por confirmar con negocio] ¿El cliente objetivo limita a quién se le puede ofrecer el plazo, o solo es informativo? El texto de esta sección depende de la respuesta (Manuel ya cuestionó “personalizar la oferta”).')}
          <div id="cli-body" class="stack" ${f.cliente.activo ? '' : 'hidden'}></div>
        </section>

        <section class="card form-card" id="sec-refi" aria-labelledby="h-refi">
          <div class="card__titles"><h2 class="t-subtitulos" id="h-refi">Refinanciamiento automático</h2><p class="t-caption">Cuando el contrato cumpla todas las condiciones, el cliente verá nuevas opciones de préstamo.</p></div>
          ${ui.switch({ id: 'refiActivo', label: 'Activar refinanciamiento automático', checked: f.refi.activo })}
          <div id="refi-body" class="stack" ${f.refi.activo ? '' : 'hidden'}></div>
        </section>
        <div id="server-error"></div>
      </div>

      <aside class="card sim" aria-labelledby="h-sim" id="sim"></aside>
    </form>
    <div class="ds-footer" role="region" aria-label="Acciones del formulario"><div class="ds-footer__inner">
      <p class="ds-footer__lead" id="footer-lead"></p>
      <div class="ds-footer__actions">${ui.btn('Cancelar', { variant: 'secondary', attrs: 'data-cancel' })}${ui.btn(isEdit ? 'Guardar cambios' : 'Crear plazo', { attrs: 'data-submit' })}</div>
    </div></div>`;
  document.body.classList.add('has-footer');
  const form = root.querySelector('#plazo-form');
  const $ = s => root.querySelector(s);

  /* ---- FormTree: sucursales y categorías --------------------------------- */
  const ftOpen = { sucursales: new Set(['emp']), categorias: new Set() };
  function drawFormTree(kind) {
    const box = $(`#ft-${kind}`);
    const all = f[kind] === 'all';
    const sel = new Set(all ? leaves(kind) : f[kind]);
    const total = leaves(kind).length;
    const stateOf = id => { const ls = leavesUnder(kind, id); const n = ls.filter(x => sel.has(x)).length; return n === 0 ? 'none' : n === ls.length ? 'all' : 'some'; };
    const row = (n, depth) => {
      const st = stateOf(n.id); const open = ftOpen[kind].has(n.id);
      return `<div class="ds-formtree__row" style="padding-left:${8 + depth * 30}px">
        ${n.children ? `<button type="button" class="ds-tree__toggle" aria-label="${open ? 'Contraer' : 'Expandir'} ${esc(n.label)}" aria-expanded="${open}" data-ft-toggle="${n.id}">${icon('KeyboardArrowDown')}</button>` : '<span class="ds-tree__spacer"></span>'}
        ${ui.check({ name: `ft-${kind}`, value: n.id, label: n.label, checked: st === 'all', attrs: `data-ft-node="${n.id}" ${st === 'some' ? 'data-indeterminate' : ''}` })}
      </div>${n.children && open ? n.children.map(c => row(c, depth + 1)).join('') : ''}`;
    };
    const label = kind === 'sucursales' ? 'Sucursales' : 'Categorías';
    box.innerHTML = `<div class="ds-formtree" data-field="${kind}">
      <p class="ds-formtree__label" id="ft-label-${kind}">${label}</p>
      <div class="ds-formtree__box" role="group" aria-labelledby="ft-label-${kind}" data-error="${!!errors[kind]}">
        <div class="ds-formtree__all">${ui.check({ name: `ft-all-${kind}`, value: 'all', label: kind === 'sucursales' ? 'Todas las sucursales de tu empresa' : 'Todo el catálogo', checked: all, attrs: `data-ft-all="${kind}" ${!all && sel.size ? 'data-indeterminate' : ''}` })}</div>
        ${all ? '' : `<div class="ds-formtree__list">${(kind === 'sucursales' ? SUCURSALES : CATEGORIAS).map(n => row(n, 0)).join('')}</div>`}
      </div>
      <p class="ds-error" id="${kind}-error" role="alert">${ui.errorText(errors[kind])}</p></div>`;
    box.querySelectorAll('[data-indeterminate]').forEach(i => { i.indeterminate = true; });
    if (errors[kind]) box.querySelectorAll('.ds-check').forEach(c => c.dataset.error = 'true');
  }
  ['sucursales', 'categorias'].forEach(kind => {
    const box = $(`#ft-${kind}`);
    box.addEventListener('click', e => {
      const t = e.target.closest('[data-ft-toggle]'); if (!t) return;
      const id = t.dataset.ftToggle; ftOpen[kind].has(id) ? ftOpen[kind].delete(id) : ftOpen[kind].add(id);
      drawFormTree(kind); box.querySelector(`[data-ft-toggle="${id}"]`).focus();
    });
    box.addEventListener('change', e => {
      const el = e.target; dirty = true;
      if (el.dataset.ftAll) { f[kind] = el.checked ? 'all' : []; }
      else if (el.dataset.ftNode) {
        const sel = new Set(f[kind] === 'all' ? leaves(kind) : f[kind]);
        leavesUnder(kind, el.dataset.ftNode).forEach(x => el.checked ? sel.add(x) : sel.delete(x));
        f[kind] = sel.size === leaves(kind).length ? 'all' : [...sel];
      } else return;
      if (errors[kind]) validate(kind);
      drawFormTree(kind);
      (box.querySelector(`[data-ft-node="${el.dataset.ftNode}"]`) || box.querySelector('[data-ft-all]')).focus();
      update();
    });
  });

  /* ---- Tasa: fija o rangos ---------------------------------------------- */
  function drawTasa() {
    const box = $('#tasa-detail');
    if (f.tasa.tipo === 'fija') {
      box.innerHTML = `<div style="max-width:320px">${ui.field({ id: 'tasaFija', label: 'Tasa de interés por periodo', input: ui.input({ id: 'tasaFija', value: f.tasa.valor != null ? pct(f.tasa.valor) : '', placeholder: '0%', attrs: 'inputmode="decimal" data-pct' }), error: ui.errorText(errors.tasaFija) })}</div>`;
      if (errors.tasaFija) box.querySelector('input').setAttribute('aria-invalid', 'true');
      return;
    }
    const r = f.tasa.rangos;
    box.innerHTML = `<div class="ranges" data-field="rangos">
      <div class="table-wrap"><table class="ds-table">
        <thead><tr><th scope="col">Préstamo sobre avalúo, desde</th><th scope="col">Hasta</th><th scope="col">Interés por periodo</th><th scope="col" class="cell-actions"><span class="sr-only">Quitar</span></th></tr></thead>
        <tbody>${r.map((x, i) => `<tr>
          <td class="ranges__from">${i === 0 ? '0%' : (r[i - 1].hasta != null ? pct(r[i - 1].hasta) : '—')}</td>
          <td><input class="ds-input ds-input--table" aria-label="Rango ${i + 1}: hasta qué porcentaje" placeholder="0%" inputmode="decimal" data-pct data-rango="${i}" data-k="hasta" value="${x.hasta != null ? pct(x.hasta) : ''}" ${errors.rangos && (x.hasta == null || (i === r.length - 1 && x.hasta !== 100)) ? 'aria-invalid="true"' : ''}></td>
          <td><input class="ds-input ds-input--table" aria-label="Rango ${i + 1}: interés" placeholder="0%" inputmode="decimal" data-pct data-rango="${i}" data-k="interes" value="${x.interes != null ? pct(x.interes) : ''}" ${errors.rangos && x.interes == null ? 'aria-invalid="true"' : ''}></td>
          <td class="cell-actions">${i > 0 ? ui.iconBtn('Delete', `Quitar rango ${i + 1}`, `data-del-rango="${i}"`, 'sm') : ''}</td></tr>`).join('')}</tbody></table></div>
      ${r.length < 4 && (r[r.length - 1].hasta ?? 0) < 100 ? `<div>${ui.btn('Agregar rango', { variant: 'tertiary', iconLeft: 'Add', attrs: 'data-add-rango' })}</div>` : ''}
      <p class="ds-help">Hasta 4 rangos. El último debe llegar a 100%.</p>
      <p class="ds-error" id="rangos-error" role="alert">${ui.errorText(errors.rangos)}</p></div>`;
  }
  $('#tasa-detail').addEventListener('click', e => {
    if (e.target.closest('[data-add-rango]')) { f.tasa.rangos.push({ hasta: null, interes: null }); drawTasa(); $(`[data-rango="${f.tasa.rangos.length - 1}"][data-k="hasta"]`).focus(); dirty = true; update(); }
    const del = e.target.closest('[data-del-rango]');
    if (del) { f.tasa.rangos.splice(+del.dataset.delRango, 1); drawTasa(); $('[data-add-rango]')?.focus(); dirty = true; update(); }
  });
  $('#tasa-detail').addEventListener('change', e => {
    const el = e.target;
    if (el.dataset.rango != null) {
      const v = num(el.value); f.tasa.rangos[+el.dataset.rango][el.dataset.k] = v;
      if (el.dataset.k === 'hasta' && v === 100) f.tasa.rangos.length = +el.dataset.rango + 1;
      if (errors.rangos) validate('rangos');
      const focusSel = `[data-rango="${el.dataset.rango}"][data-k="${el.dataset.k}"]`;
      drawTasa(); $(focusSel)?.focus(); update();
    }
  });

  /* ---- Intereses adicionales ------------------------------------------- */
  function drawAdicionales() {
    const box = $('#adic-list');
    box.innerHTML = f.adicionales.length ? `<ul class="item-list">${f.adicionales.map(a => `<li class="item">
      <div class="item__body"><span class="item__title">${esc(a.nombre)}${a.sugerido ? '<span class="chip-info chip-info--blue">Sugerido</span>' : ''}</span><span class="item__sub">${adicionalTxt(a)}</span></div>
      <div class="item__actions">${ui.iconBtn('Edit', `Editar ${a.nombre}`, `data-edit-interes="${a.id}"`)}${ui.iconBtn('Delete', `Quitar ${a.nombre}`, `data-del-interes="${a.id}"`)}</div></li>`).join('')}</ul>`
      : `<p class="t-caption">Sin intereses adicionales. El plazo solo cobra el interés base.</p>`;
  }
  $('#sec-adicionales').addEventListener('click', e => {
    if (e.target.closest('[data-add-interes]')) return interesModal(null);
    const ed = e.target.closest('[data-edit-interes]'); if (ed) return interesModal(f.adicionales.find(a => a.id === ed.dataset.editInteres));
    const del = e.target.closest('[data-del-interes]');
    if (del) {
      const a = f.adicionales.find(x => x.id === del.dataset.delInteres);
      f.adicionales = f.adicionales.filter(x => x !== a); dirty = true; drawAdicionales(); update();
      showToast({ title: 'Interés quitado', message: `${a.nombre} ya no se cobra en este plazo.` });
      $('[data-add-interes]').focus();
    }
  });
  function interesModal(a) {
    const d = a ? clone(a) : { id: uid('a'), nombre: '', cobro: 'despues', duracion: { n: null, unidad: 'dias' }, tasa: null, reflejar: false, sugerido: false };
    if (!d.duracion) d.duracion = { n: null, unidad: 'dias' };
    const ov = openModal({
      side: true, title: a ? 'Editar interés' : 'Agregar interés',
      body: `${ui.field({ id: 'iNombre', label: 'Nombre del interés', input: ui.input({ id: 'iNombre', value: d.nombre, placeholder: 'Ejemplo: Días de gracia', attrs: 'maxlength="60"' }) })}
        <fieldset class="stack"><legend class="ds-field__label" style="padding:0 8px 4px">Cuándo se cobra</legend>
          <div class="radio-group">
            <div class="radio-option">${ui.radio({ name: 'iCobro', value: 'durante', label: 'Durante el periodo', checked: d.cobro === 'durante' })}<span class="radio-option__sub">Se cobra desde el primer día, en el refrendo o el desempeño.</span></div>
            <div class="radio-option">${ui.radio({ name: 'iCobro', value: 'despues', label: 'Después del periodo', checked: d.cobro === 'despues' })}<span class="radio-option__sub">Se cobra al terminar el periodo, durante los días que definas.</span></div>
          </div></fieldset>
        <div id="i-despues" class="stack" ${d.cobro === 'despues' ? '' : 'hidden'}>
          <div class="field-combo">${ui.field({ id: 'iDurN', label: 'Duración', input: ui.input({ id: 'iDurN', value: d.duracion.n ?? '', placeholder: '0', attrs: 'inputmode="numeric" maxlength="3"' }) })}
            ${ui.field({ id: 'iDurU', label: 'Unidad', input: ui.select({ id: 'iDurU', value: d.duracion.unidad, options: [{ v: 'dias', label: 'Días' }, { v: 'semanas', label: 'Semanas' }, { v: 'meses', label: 'Meses' }] }) })}</div>
          ${ui.switch({ id: 'iReflejar', label: 'Reflejar en el contrato', checked: d.reflejar })}
        </div>
        ${ui.field({ id: 'iTasa', label: 'Tasa de interés', input: ui.input({ id: 'iTasa', value: d.tasa != null ? pct(d.tasa) : '', placeholder: '0%', attrs: 'inputmode="decimal" data-pct' }) })}
        ${ui.note('[Por confirmar con negocio] Qué cambia “Reflejar en el contrato” y por qué solo aplica a los cobros después del periodo.')}`,
      footer: ui.btn('Cancelar', { variant: 'tertiary', attrs: 'data-close-btn' }) + ui.btn(a ? 'Guardar interés' : 'Agregar interés', { attrs: 'data-ok' }),
    });
    ov.querySelector('[data-close-btn]').addEventListener('click', closeModal);
    ov.querySelectorAll('[name="iCobro"]').forEach(r => r.addEventListener('change', () => { ov.querySelector('#i-despues').hidden = ov.querySelector('[name="iCobro"]:checked').value !== 'despues'; }));
    ov.querySelectorAll('[data-pct]').forEach(bindPct);
    ov.querySelector('[data-ok]').addEventListener('click', () => {
      const v = {
        nombre: ov.querySelector('#iNombre').value.trim(),
        cobro: ov.querySelector('[name="iCobro"]:checked').value,
        n: parseInt(ov.querySelector('#iDurN').value, 10), unidad: ov.querySelector('#iDurU').value,
        tasa: num(ov.querySelector('#iTasa').value), reflejar: ov.querySelector('#iReflejar').checked,
      };
      const errs = {};
      if (!v.nombre) errs.iNombre = 'Escribe el nombre del interés';
      if (v.cobro === 'despues' && !(v.n > 0)) errs.iDurN = 'Escribe la duración';
      if (!(v.tasa > 0)) errs.iTasa = 'Escribe una tasa mayor a 0%';
      ['iNombre', 'iDurN', 'iTasa'].forEach(k => {
        ov.querySelector(`#${k}`).setAttribute('aria-invalid', String(!!errs[k]));
        ov.querySelector(`#${k}-error`).innerHTML = ui.errorText(errs[k]);
      });
      const first = Object.keys(errs)[0];
      if (first) { ov.querySelector(`#${first}`).focus(); return; }
      Object.assign(d, { nombre: v.nombre, cobro: v.cobro, duracion: v.cobro === 'despues' ? { n: v.n, unidad: v.unidad } : null, tasa: v.tasa, reflejar: v.cobro === 'despues' ? v.reflejar : true, sugerido: a ? a.sugerido : false });
      if (a) Object.assign(a, d); else f.adicionales.push(d);
      dirty = true; closeModal(); drawAdicionales(); update();
      showToast({ title: a ? 'Interés actualizado' : 'Interés agregado', message: d.nombre });
    });
  }

  /* ---- Cliente objetivo -------------------------------------------------- */
  function drawCliente() {
    const c = f.cliente;
    $('#cli-body').innerHTML = `
      <div class="field-row">
        ${ui.field({ id: 'edadMin', label: 'Edad mínima', input: ui.input({ id: 'edadMin', value: c.edadMin, attrs: 'inputmode="numeric" maxlength="2"' }), error: ui.errorText(errors.edadMin) })}
        ${ui.field({ id: 'edadMax', label: 'Edad máxima', input: ui.input({ id: 'edadMax', value: c.edadMax, attrs: 'inputmode="numeric" maxlength="2"' }), error: ui.errorText(errors.edadMax) })}
      </div>
      <fieldset class="stack" data-field="score"><legend class="ds-field__label" style="padding:0 8px 4px">Score de cliente</legend>
        <div class="check-group">${SCORE.map(o => ui.check({ name: 'score', value: o.v, label: o.label, sub: o.sub, checked: c.score.includes(o.v), attrs: errors.score ? '' : '' })).join('')}</div>
        <p class="ds-error" id="score-error" role="alert">${ui.errorText(errors.score)}</p></fieldset>
      <fieldset class="stack"><legend class="ds-field__label" style="padding:0 8px 4px">Sexo <span class="ds-field__optional">(opcional)</span></legend>
        <div class="check-group">${SEXO.map(o => ui.check({ name: 'sexo', value: o.v, label: o.label, checked: c.sexo.includes(o.v) })).join('')}</div></fieldset>
      <fieldset class="stack"><legend class="ds-field__label" style="padding:0 8px 4px">Estado civil <span class="ds-field__optional">(opcional)</span></legend>
        <div class="check-group">${ESTADO_CIVIL.map(o => ui.check({ name: 'estadoCivil', value: o.v, label: o.label, checked: c.estadoCivil.includes(o.v) })).join('')}</div></fieldset>`;
    if (errors.edadMin) $('#edadMin').setAttribute('aria-invalid', 'true');
    if (errors.edadMax) $('#edadMax').setAttribute('aria-invalid', 'true');
    if (errors.score) $('#cli-body').querySelectorAll('[name="score"]').forEach(i => i.closest('.ds-check').dataset.error = 'true');
  }

  /* ---- Refinanciamiento -------------------------------------------------- */
  function drawRefi() {
    const r = f.refi;
    const disponibles = Object.keys(REFI).filter(k => !r.condiciones.some(c => c.tipo === k));
    const condHTML = c => {
      const err = errors[`cond-${c.id}`];
      let ctrl = '';
      const checks = (arr) => `<div class="check-group">${arr.map(o => ui.check({ name: `c-${c.id}`, value: o.v, label: o.label, sub: o.sub, checked: (c.valores || []).includes(o.v), attrs: `data-cond="${c.id}" data-multi` })).join('')}</div>`;
      if (c.tipo === 'estado') ctrl = checks(ESTADOS_CONTRATO);
      if (c.tipo === 'canal') ctrl = checks(CANALES);
      if (c.tipo === 'score') ctrl = checks(SCORE);
      if (c.tipo === 'refrendos' || c.tipo === 'monto') ctrl = `<div class="field-combo">
        ${ui.select({ id: `c-${c.id}-comp`, value: c.comp, options: COMPARADORES, attrs: `data-cond="${c.id}" data-k="comp" aria-label="Comparación"` })}
        ${ui.input({ id: `c-${c.id}-val`, value: c.valor != null ? (c.tipo === 'monto' ? money(c.valor) : c.valor) : '', placeholder: c.tipo === 'monto' ? '$0.00' : '0', attrs: `data-cond="${c.id}" data-k="valor" ${c.tipo === 'monto' ? 'data-money inputmode="decimal"' : 'inputmode="numeric"'} aria-label="${c.tipo === 'monto' ? 'Monto' : 'Número de refrendos'}" ${err && c.valor == null ? 'aria-invalid="true"' : ''}` })}</div>`;
      if (c.tipo === 'comision') ctrl = `<div class="field-combo">
        ${ui.select({ id: `c-${c.id}-modo`, value: c.modo, options: [{ v: 'porcentaje', label: 'Porcentaje %' }, { v: 'monto', label: 'Monto fijo $' }], attrs: `data-cond="${c.id}" data-k="modo" aria-label="Tipo de comisión"` })}
        ${ui.input({ id: `c-${c.id}-val`, value: c.valor != null ? (c.modo === 'monto' ? money(c.valor) : pct(c.valor)) : '', placeholder: c.modo === 'monto' ? '$0.00' : '0%', attrs: `data-cond="${c.id}" data-k="valor" ${c.modo === 'monto' ? 'data-money' : 'data-pct'} inputmode="decimal" aria-label="Valor de la comisión" ${err && c.valor == null ? 'aria-invalid="true"' : ''}` })}</div>`;
      return `<div class="condition" data-field="cond-${c.id}"><div class="condition__head"><span class="section-sub">${REFI[c.tipo].label}</span>${ui.iconBtn('Delete', `Quitar condición ${REFI[c.tipo].label}`, `data-del-cond="${c.id}"`, 'sm')}</div>
        <p class="t-caption">${REFI[c.tipo].q}</p>${ctrl}<p class="ds-error" id="cond-${c.id}-error" role="alert">${ui.errorText(err)}</p></div>`;
    };
    $('#refi-body').innerHTML = `
      ${r.condiciones.length ? r.condiciones.map(condHTML).join('') : `<p class="t-caption">Agrega al menos una condición.</p>`}
      <p class="ds-error" id="refi-error" role="alert">${ui.errorText(errors.refi)}</p>
      ${disponibles.length ? `<div class="menu-wrap">${ui.btn('Agregar condición', { variant: 'secondary', iconLeft: 'Add', attrs: 'aria-haspopup="menu" aria-expanded="false" aria-controls="m-refi" data-menu-trigger' })}
        <div class="ds-menu ds-menu--left" role="menu" id="m-refi" hidden>${disponibles.map(k => `<button type="button" role="menuitem" data-add-cond="${k}">${icon('Add')}${REFI[k].label}</button>`).join('')}</div></div>` : ''}
      ${ui.note('Opciones de “Estado de contrato” y “Canal de venta” de ejemplo: en producto llegan del servicio.')}`;
    $('#refi-body').querySelectorAll('[data-pct]').forEach(bindPct);
    $('#refi-body').querySelectorAll('[data-money]').forEach(bindMoney);
  }
  $('#refi-body').addEventListener('click', e => {
    const add = e.target.closest('[data-add-cond]');
    if (add) {
      closeMenus();
      const t = add.dataset.addCond; const c = { id: uid('r'), tipo: t };
      if (['estado', 'canal', 'score'].includes(t)) c.valores = [];
      if (t === 'refrendos' || t === 'monto') { c.comp = 'mayor'; c.valor = null; }
      if (t === 'comision') { c.modo = 'porcentaje'; c.valor = null; }
      f.refi.condiciones.push(c); delete errors.refi; dirty = true; drawRefi(); update();
      $(`[data-field="cond-${c.id}"] input, [data-field="cond-${c.id}"] select`)?.focus();
    }
    const del = e.target.closest('[data-del-cond]');
    if (del) { f.refi.condiciones = f.refi.condiciones.filter(c => c.id !== del.dataset.delCond); dirty = true; drawRefi(); update(); $('#refiActivo').focus(); }
  });
  $('#refi-body').addEventListener('change', e => {
    const el = e.target; const c = f.refi.condiciones.find(x => x.id === el.dataset.cond); if (!c) return;
    dirty = true;
    if (el.dataset.multi != null) c.valores = [...$('#refi-body').querySelectorAll(`[data-cond="${c.id}"][data-multi]:checked`)].map(i => i.value);
    else if (el.dataset.k === 'valor') c.valor = el.dataset.money != null ? money2num(el.value) : num(el.value);
    else { c[el.dataset.k] = el.value; if (el.dataset.k === 'modo') { c.valor = null; drawRefi(); } }
    if (errors[`cond-${c.id}`]) { validate('refi'); drawRefi(); }
    update();
  });

  /* ---- Simulación --------------------------------------------------------- */
  const sim = { avaluo: 10000, prestamo: 6000 };
  function tasaAplicada() {
    if (f.tasa.tipo === 'fija') return f.tasa.valor;
    const p = sim.avaluo > 0 ? (sim.prestamo / sim.avaluo) * 100 : 0;
    const r = f.tasa.rangos.find(x => x.hasta != null && p <= x.hasta);
    return r ? r.interes : null;
  }
  function drawSim() {
    const t = tasaAplicada();
    const interes = t != null ? sim.prestamo * t / 100 : null;
    const durante = f.adicionales.filter(a => a.cobro === 'durante');
    const extra = durante.reduce((s, a) => s + sim.prestamo * a.tasa / 100, 0);
    const dur = f.duracion.n ? f.duracion : null;
    const vence = dur ? addDays(HOY, dur.unidad === 'dias' ? dur.n : dur.unidad === 'semanas' ? dur.n * 7 : dur.n * 30) : null;
    const ratio = sim.avaluo > 0 ? sim.prestamo / sim.avaluo * 100 : 0;
    $('#sim-result').innerHTML = `
      <ul class="list-plain">
        ${f.tasa.tipo === 'dinamica' ? `<li><span>Préstamo sobre avalúo</span><span>${pct(+ratio.toFixed(1))}</span></li>` : ''}
        <li><span>Interés base${t != null ? ` (${pct(t)})` : ''}</span><span>${interes != null ? money(interes) : '—'}</span></li>
        ${durante.map(a => `<li><span>${esc(a.nombre)} (${pct(a.tasa)})</span><span>${money(sim.prestamo * a.tasa / 100)}</span></li>`).join('')}
        <li><span>Vence</span><span>${vence ? fecha(vence) : '—'}</span></li>
      </ul>
      <div class="sim__total"><span>Total al vencer</span><span>${interes != null ? money(sim.prestamo + interes + extra) : '—'}</span></div>`;
    const despues = f.adicionales.filter(a => a.cobro === 'despues');
    $('#sim-after').innerHTML = despues.length ? `<p class="t-caption">Si no se paga a tiempo: ${despues.map(a => `${esc(a.nombre)} ${pct(a.tasa)} (${duracionTxt(a.duracion)})`).join(' · ')}</p>` : '';
  }
  $('#sim').innerHTML = `<div class="card__titles"><h2 class="t-subtitulos" id="h-sim">Simulación</h2><p class="t-caption">Ejemplo con un préstamo para ver cómo queda el plazo.</p></div>
    ${ui.field({ id: 'simAvaluo', label: 'Valor de avalúo', input: ui.input({ id: 'simAvaluo', value: money(sim.avaluo), attrs: 'inputmode="decimal" data-money' }) })}
    ${ui.field({ id: 'simPrestamo', label: 'Monto del préstamo', input: ui.input({ id: 'simPrestamo', value: money(sim.prestamo), attrs: 'inputmode="decimal" data-money' }) })}
    <div class="sim__result" id="sim-result" aria-live="polite"></div><div id="sim-after"></div>
    ${ui.btn('Ver tabla de amortización', { variant: 'tertiary', attrs: 'data-amort' })}
    ${ui.note('[Por confirmar con negocio] Fórmula del total: interés base + adicionales “durante el periodo”. Debe salir del mismo servicio que usa hoy la simulación.')}`;
  $('#sim').addEventListener('change', e => {
    if (e.target.id === 'simAvaluo') sim.avaluo = money2num(e.target.value) || 0;
    if (e.target.id === 'simPrestamo') sim.prestamo = money2num(e.target.value) || 0;
    drawSim();
  });
  $('#sim [data-amort]').addEventListener('click', () => {
    const t = tasaAplicada(); const dur = f.duracion.n ? f.duracion : null;
    if (t == null || !dur) { showToast({ type: 'error', title: 'Falta información para simular', message: 'Completa la duración y el interés base.' }); return; }
    const periodos = f.refrendos.limitar && f.refrendos.max ? Math.min(f.refrendos.max + 1, 6) : 3;
    const step = dur.unidad === 'dias' ? dur.n : dur.unidad === 'semanas' ? dur.n * 7 : dur.n * 30;
    const extra = f.adicionales.filter(a => a.cobro === 'durante').reduce((s, a) => s + a.tasa, 0);
    const pagoInteres = sim.prestamo * (t + extra) / 100;
    const rows = Array.from({ length: periodos }, (_, i) => {
      const last = i === periodos - 1;
      return `<tr><td>${fecha(addDays(HOY, step * (i + 1)))}</td><td>${last ? 'Desempeño' : `Refrendo ${i + 1}`}</td><td>${money(last ? pagoInteres + sim.prestamo : pagoInteres)}</td><td>${money(last ? 0 : sim.prestamo)}</td></tr>`;
    }).join('');
    const ov = openModal({
      title: 'Tabla de amortización',
      body: `<p class="t-caption">Ejemplo con un préstamo de ${money(sim.prestamo)} que se refrenda ${periodos - 1} ${periodos - 1 === 1 ? 'vez' : 'veces'} y se desempeña al final.</p>
        <div class="table-wrap" role="region" aria-label="Tabla de amortización" tabindex="0"><table class="ds-table"><thead><tr><th scope="col">Fecha</th><th scope="col">Movimiento</th><th scope="col">Cantidad</th><th scope="col">Saldo</th></tr></thead><tbody>${rows}</tbody></table></div>
        ${ui.note('[Por confirmar con negocio] Cálculo de ejemplo. La tabla real sale del servicio actual.')}`,
      footer: ui.btn('Cerrar', { attrs: 'data-close-btn' }),
    });
    ov.querySelector('[data-close-btn]').addEventListener('click', closeModal);
  });

  /* ---- Resumen en la barra fija ----------------------------------------- */
  function update() {
    const bits = [];
    if (f.tasa.tipo === 'fija' && f.tasa.valor != null) bits.push(`Tasa fija ${pct(f.tasa.valor)}`);
    if (f.tasa.tipo === 'dinamica') bits.push(tasaTxt(f.tasa));
    if (f.duracion.n) bits.push(duracionTxt(f.duracion));
    bits.push(segTxt(f, 'sucursales'));
    $('#footer-lead').innerHTML = `<strong>${esc(f.nombre || 'Plazo sin nombre')}</strong>${bits.length ? ' · ' + bits.join(' · ') : ''}`;
    drawSim();
  }

  /* ---- Campos simples ----------------------------------------------------- */
  form.addEventListener('input', e => { dirty = true; const k = e.target.id; if (errors[k]) { delete errors[k]; setFieldError(k, null); } });
  form.addEventListener('change', e => {
    const el = e.target, k = el.id;
    if (k === 'nombre') f.nombre = el.value.trim();
    if (k === 'inicio') f.inicio = parseDdmm(el.value);
    if (k === 'fin') f.fin = el.value.trim() ? parseDdmm(el.value) : null;
    if (k === 'montoMin') f.montoMin = money2num(el.value);
    if (k === 'montoMax') f.montoMax = el.value.trim() ? money2num(el.value) : null;
    if (k === 'durN') f.duracion.n = parseInt(el.value, 10) || null;
    if (k === 'durU') f.duracion.unidad = el.value;
    if (k === 'tasaFija') f.tasa.valor = num(el.value);
    if (k === 'refMax') f.refrendos.max = parseInt(el.value, 10) || null;
    if (el.name === 'prorrateo') f.prorrateo = el.checked;
    if (el.name === 'tasaTipo') {
      f.tasa.tipo = el.value; delete errors.tasaFija; delete errors.rangos;
      if (el.value === 'dinamica' && !f.tasa.rangos.length) f.tasa.rangos = [{ hasta: null, interes: null }];
      drawTasa();
    }
    if (k === 'refLimitar') { f.refrendos.limitar = el.checked; $('#ref-max-wrap').hidden = !el.checked; if (!el.checked) { f.refrendos.max = null; delete errors.refMax; } }
    if (k === 'cliActivo') { f.cliente.activo = el.checked; $('#cli-body').hidden = !el.checked; if (el.checked) drawCliente(); else { f.cliente = clienteVacio(); ['edadMin', 'edadMax', 'score'].forEach(x => delete errors[x]); } }
    if (k === 'edadMin') f.cliente.edadMin = parseInt(el.value, 10) || null;
    if (k === 'edadMax') f.cliente.edadMax = parseInt(el.value, 10) || null;
    if (['score', 'sexo', 'estadoCivil'].includes(el.name)) { f.cliente[el.name] = [...form.querySelectorAll(`[name="${el.name}"]:checked`)].map(i => i.value); if (el.name === 'score' && errors.score) { validate('score'); drawCliente(); } }
    if (k === 'refiActivo') {
      if (!el.checked && f.refi.condiciones.length) {
        el.checked = true;
        confirmModal({
          title: '¿Quitar el refinanciamiento automático?',
          text: `Se quitarán ${plural(f.refi.condiciones.length, 'condición', 'condiciones')} de este plazo.`,
          confirmLabel: 'Quitar condiciones', variant: 'destructive',
          onConfirm: () => { f.refi = refiVacio(); delete errors.refi; closeModal(); $('#refiActivo').checked = false; $('#refi-body').hidden = true; drawRefi(); update(); },
        });
        return;
      }
      f.refi.activo = el.checked; $('#refi-body').hidden = !el.checked; if (!el.checked) delete errors.refi;
      drawRefi();
    }
    update();
  });
  root.querySelectorAll('[data-money]').forEach(bindMoney);
  root.querySelectorAll('[data-pct]').forEach(bindPct);
  $('#tasa-detail').addEventListener('focusout', e => { if (e.target.matches('[data-pct]')) fmtPct(e.target); });

  /* ---- Validación al enviar (guía 5.3: el botón nunca se deshabilita) ---- */
  function setFieldError(k, msg) {
    const input = root.querySelector(`#${k}`);
    if (input) input.setAttribute('aria-invalid', String(!!msg));
    const err = root.querySelector(`#${k}-error`);
    if (err) err.innerHTML = ui.errorText(msg);
  }
  function validate(only) {
    const e = {};
    const want = k => !only || only === k;
    if (want('nombre')) {
      if (!f.nombre) e.nombre = 'Escribe el nombre del plazo';
      else if (f.nombre.length < 3) e.nombre = 'Usa al menos 3 caracteres';
      else if (!NOMBRE_RE.test(f.nombre)) e.nombre = 'Usa solo letras, números, espacios y - _ . # , * $ ( ) %';
      else if (store.plazos.some(p => p.nombre.toLowerCase() === f.nombre.toLowerCase() && p.id !== f.id)) e.nombre = 'Ya tienes un plazo con este nombre';
    }
    if (want('inicio') && !f.inicio) e.inicio = 'Escribe una fecha válida con el formato DD/MM/AAAA';
    if (want('fin')) {
      const raw = root.querySelector('#fin').value.trim();
      if (raw && !f.fin) e.fin = 'Escribe una fecha válida con el formato DD/MM/AAAA';
      else if (f.fin && f.inicio && f.fin <= f.inicio) e.fin = 'La fecha de fin debe ser posterior a la de inicio';
    }
    if (want('sucursales') && f.sucursales !== 'all' && !f.sucursales.length) e.sucursales = 'Selecciona al menos una sucursal';
    if (want('categorias') && f.categorias !== 'all' && !f.categorias.length) e.categorias = 'Selecciona al menos una categoría';
    if (want('montoMin')) { if (!(f.montoMin > 0)) e.montoMin = 'Escribe un monto mayor a $0.00'; else if (f.montoMin > MAX_MONTO) e.montoMin = 'El monto no puede ser mayor a $10,000,000.00'; }
    if (want('montoMax') && f.montoMax != null) { if (f.montoMax > MAX_MONTO) e.montoMax = 'El monto no puede ser mayor a $10,000,000.00'; else if (f.montoMin && f.montoMax < f.montoMin) e.montoMax = 'Debe ser mayor o igual al monto mínimo'; }
    if (want('durN') && !(f.duracion.n > 0)) e.durN = 'Escribe la duración del periodo';
    if (want('tasaFija') && f.tasa.tipo === 'fija' && !(f.tasa.valor > 0)) e.tasaFija = 'Escribe una tasa mayor a 0%';
    if (want('rangos') && f.tasa.tipo === 'dinamica') {
      const r = f.tasa.rangos; let ok = r.every(x => x.hasta != null && x.interes > 0) && r[r.length - 1].hasta === 100;
      for (let i = 1; i < r.length && ok; i++) if (r[i].hasta <= r[i - 1].hasta) ok = false;
      if (!ok) e.rangos = 'Completa todos los rangos en orden. El último debe llegar a 100%';
    }
    if (want('refMax') && f.refrendos.limitar && !(f.refrendos.max > 0)) e.refMax = 'Escribe el máximo de refrendos';
    if (f.cliente.activo) {
      if (want('edadMin') && !(f.cliente.edadMin >= 18)) e.edadMin = 'La edad mínima es 18 años';
      if (want('edadMax') && !(f.cliente.edadMax > (f.cliente.edadMin || 0) && f.cliente.edadMax <= 99)) e.edadMax = 'Debe ser mayor que la edad mínima y máximo 99';
      if (want('score') && !f.cliente.score.length) e.score = 'Selecciona al menos un score';
    }
    if (want('refi') && f.refi.activo) {
      if (!f.refi.condiciones.length) e.refi = 'Agrega al menos una condición o apaga el refinanciamiento';
      f.refi.condiciones.forEach(c => {
        const vacio = c.valores ? !c.valores.length : !(c.valor > 0);
        if (vacio) e[`cond-${c.id}`] = c.valores ? 'Elige al menos una opción' : 'Escribe un valor mayor a 0';
      });
    }
    if (only) {
      Object.keys(errors).filter(k => k === only || (only === 'refi' && k.startsWith('cond-'))).forEach(k => delete errors[k]);
      Object.assign(errors, e);
      return e;
    }
    Object.keys(errors).forEach(k => delete errors[k]); Object.assign(errors, e);
    return e;
  }
  function paintErrors() {
    ['nombre', 'inicio', 'fin', 'montoMin', 'montoMax', 'durN', 'refMax'].forEach(k => setFieldError(k, errors[k]));
    drawFormTree('sucursales'); drawFormTree('categorias'); drawTasa();
    if (f.cliente.activo) drawCliente();
    if (f.refi.activo) drawRefi();
  }
  const ORDEN = ['nombre', 'inicio', 'fin', 'sucursales', 'categorias', 'montoMin', 'montoMax', 'durN', 'tasaFija', 'rangos', 'refMax', 'edadMin', 'edadMax', 'score', 'refi'];
  $('.ds-footer [data-submit]').addEventListener('click', e => {
    const btn = e.currentTarget;
    ['nombre', 'inicio', 'fin', 'montoMin', 'montoMax', 'durN', 'refMax'].forEach(k => { const el = root.querySelector(`#${k}`); if (el) el.dispatchEvent(new Event('change', { bubbles: true })); });
    validate(); paintErrors();
    const keys = Object.keys(errors);
    if (keys.length) {
      const first = ORDEN.find(k => keys.includes(k)) || keys[0];
      const target = root.querySelector(`#${first}`) || root.querySelector(`[data-field="${first}"] input, [data-field="${first}"] select`) || (first === 'refi' ? root.querySelector('#refiActivo') : null);
      const scrollTo = (target && target.closest('.ds-field, .ds-formtree, fieldset, .ranges, .condition')) || target;
      scrollTo?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => (target?.matches('input, select, button') ? target : target?.querySelector('input, select'))?.focus({ preventScroll: true }), 350);
      $('#server-error').innerHTML = keys.length > 1 ? ui.alert('error', { title: `Hay ${keys.length} campos por corregir`, text: 'Están marcados en rojo.' }) : '';
      return;
    }
    $('#server-error').innerHTML = '';
    fakeRequest(btn, {
      ok: () => {
        const nuevo = !isEdit;
        if (nuevo) { f.id = uid('p'); f.estado = parseIso(f.inicio) > HOY ? 'programado' : 'vigente'; store.plazos.unshift(f); if (sug) store.sugerencias = store.sugerencias.filter(s => s.id !== sug.id); }
        else { if (copia || original.estado === 'borrador') f.estado = parseIso(f.inicio) > HOY ? 'programado' : 'vigente'; Object.assign(original, f); }
        dirty = false;
        showToast({ title: nuevo ? 'Plazo creado exitosamente' : 'Plazo guardado exitosamente' });
        go(`#/plazos/${nuevo ? f.id : original.id}`);
      },
      fail: () => {
        $('#server-error').innerHTML = ui.alert('error', { title: 'No pudimos guardar el plazo', text: 'Tus datos siguen aquí. Intenta nuevamente en unos momentos.' });
        $('#server-error').scrollIntoView({ behavior: 'smooth', block: 'center' });
      },
      ms: 900,
    });
  });
  $('.ds-footer [data-cancel]').addEventListener('click', () => leave(isEdit ? `#/plazos/${original.id}` : '#/plazos'));
  function leave(dest) {
    if (!dirty) return dest.startsWith('#/') ? go(dest) : (location.href = dest);
    confirmModal({
      title: '¿Salir sin guardar?', text: 'Perderás los cambios que hiciste en este plazo.',
      confirmLabel: 'Descartar cambios', variant: 'destructive',
      onConfirm: () => { dirty = false; closeModal(); dest.startsWith('#/') ? go(dest) : (location.href = dest); },
    });
  }
  /* Atrás del navegador con cambios sin guardar: misma confirmación que Cancelar */
  salidaForm = dest => { if (!dirty) return false; leave(dest); return true; };
  cleanup.push(() => { salidaForm = null; });
  root.querySelectorAll('.ds-breadcrumb a').forEach(a => a.addEventListener('click', e => { if (dirty) { e.preventDefault(); leave(a.getAttribute('href')); } }));
  document.querySelectorAll('#main .ds-breadcrumb a').forEach(a => a.addEventListener('click', e => { if (dirty) { e.preventDefault(); leave(a.getAttribute('href')); } }));
  const beforeUnload = e => { if (dirty) { e.preventDefault(); e.returnValue = ''; } };
  window.addEventListener('beforeunload', beforeUnload);
  cleanup.push(() => window.removeEventListener('beforeunload', beforeUnload));

  /* ---- AnchorMenu: sección activa al hacer scroll ------------------------ */
  const anchors = [...root.querySelectorAll('[data-anchor]')];
  anchors.forEach(a => a.addEventListener('click', e => { e.preventDefault(); document.getElementById(a.dataset.anchor).scrollIntoView({ behavior: 'smooth', block: 'start' }); const h = document.getElementById(a.dataset.anchor).querySelector('h2'); h.tabIndex = -1; h.focus({ preventScroll: true }); }));
  const io = new IntersectionObserver(entries => {
    entries.filter(en => en.isIntersecting).forEach(en => anchors.forEach(a => a.setAttribute('aria-current', String(a.dataset.anchor === en.target.id))));
  }, { rootMargin: '-140px 0px -55% 0px' });
  SECCIONES.forEach(([sid]) => io.observe(document.getElementById(sid)));
  cleanup.push(() => io.disconnect());

  drawFormTree('sucursales'); drawFormTree('categorias'); drawTasa(); drawAdicionales();
  if (f.cliente.activo) drawCliente();
  drawRefi(); update();
  if (!isEdit) $('#nombre').focus({ preventScroll: true });
}

/* ---- Formato de números en campos -------------------------------------- */
function num(v) { const n = parseFloat(String(v).replace(/[^0-9.]/g, '')); return Number.isFinite(n) ? n : null; }
function money2num(v) { const n = num(v); return n == null ? null : Math.round(n * 100) / 100; }
function fmtPct(el) { const n = num(el.value); el.value = n == null ? '' : pct(Math.min(n, 100)); }
function bindPct(el) { el.addEventListener('blur', () => fmtPct(el)); el.addEventListener('focus', () => { const n = num(el.value); el.value = n == null ? '' : n; }); }
function bindMoney(el) {
  el.addEventListener('blur', () => { const n = money2num(el.value); el.value = n == null ? '' : money(n); });
  el.addEventListener('focus', () => { const n = money2num(el.value); el.value = n == null ? '' : n; });
}

/* ==========================================================================
   Panel de la maqueta
   ========================================================================== */
const demoBtn = document.getElementById('demo-btn'), demoPanel = document.getElementById('demo-panel');
demoBtn.addEventListener('click', () => { demoPanel.hidden = !demoPanel.hidden; demoBtn.setAttribute('aria-expanded', String(!demoPanel.hidden)); });
document.getElementById('demo-load').addEventListener('change', e => { demo.load = e.target.value; route(); });
document.getElementById('demo-action').addEventListener('change', e => { demo.action = e.target.value; });
document.getElementById('demo-notes').addEventListener('change', e => document.body.classList.toggle('show-notes', e.target.checked));
document.getElementById('demo-reset').addEventListener('click', () => {
  store.plazos = seed(); store.sugerencias = seedSugerencias();
  /* el listado vuelve a como se abre: Ubicaciones con la empresa elegida, árbol plegado y abierto, sin búsqueda ni filtro */
  clearTimeout(busq.t); Object.assign(listState, listStateInicial()); busq.ultimo = ''; busq.activo = 0;
  go('#/plazos'); showToast({ title: 'Datos restablecidos', message: 'La maqueta volvió a sus datos de ejemplo.' }); });

route();
})();
