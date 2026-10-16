
/* Plazos (Administrativo) · maqueta de el equipo llevada al prototipo del POS.
   Origen: su maqueta HTML (commit 67a179d82), el listado de su commit 0c4d4b518 y, desde esta ronda, su vista previa
   sin login d9539b65b (/design-system/preview/plazos): datos, servicio simulado con escenarios, listado, sugeridos,
   detalle sin pestañas y formulario sin AnchorMenu ni barra fija, con FormTree, DobleInput y AutoMultiSelect del DS.
   Lo que gana el marco del prototipo (header y menú compartidos, breadcrumb con Home, cards sin borde, capas
   1400-1430) y las reglas que se conservan están en README.md. */
(() => {
"use strict";
const ICONS = {"Catalogue": {"vb": "0 0 24 24", "inner": "<path d=\"M4 20C3.45 20 2.97917 19.8042 2.5875 19.4125C2.19583 19.0208 2 18.55 2 18V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H20C20.55 4 21.0208 4.19583 21.4125 4.5875C21.8042 4.97917 22 5.45 22 6V18C22 18.55 21.8042 19.0208 21.4125 19.4125C21.0208 19.8042 20.55 20 20 20H4ZM4 18H11V6H4V18ZM13 18H20V6H13V18ZM5 16H10V14H5V16ZM5 13H10V11H5V13ZM5 10H10V8H5V10ZM14 16H19V14H14V16ZM14 13H19V11H14V13ZM14 10H19V8H14V10Z\" fill=\"currentColor\" />"}, "PanelCollapse": {"vb": "0 0 24 24", "inner": "<path d=\"M12.44 7.56L12.44 16.44L8 12L12.44 7.56ZM14.22 4H16V20H14.22V4Z\" fill=\"currentColor\" />"}, "ChevronDown": {"vb": "0 0 24 24", "inner": "<path d=\"M7 10L12 15L17 10\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />"}, "Add": {"vb": "0 0 24 24", "inner": "<path d=\"M11 19V13H5V11H11V5H13V11H19V13H13V19H11Z\" fill=\"currentColor\" />"}, "ArrowBackIos": {"vb": "0 0 24 24", "inner": "<path d=\"M14.6 6L16 7.4L11.4 12L16 16.6L14.6 18L8.59998 12L14.6 6Z\" fill=\"currentColor\" />"}, "ArrowDropDown": {"vb": "0 0 24 24", "inner": "<path d=\"M12 15L7 10H17L12 15Z\" fill=\"currentColor\" />"}, "ArrowForwardIos": {"vb": "0 0 24 24", "inner": "<path d=\"M9.4 18L8 16.6L12.6 12L8 7.4L9.4 6L15.4 12L9.4 18Z\" fill=\"currentColor\" />"}, "CalendarToday": {"vb": "0 0 24 24", "inner": "<path d=\"M5 22C4.45 22 3.979 21.8043 3.587 21.413C3.19567 21.021 3 20.55 3 20V6C3 5.45 3.19567 4.97933 3.587 4.588C3.979 4.196 4.45 4 5 4H6V2H8V4H16V2H18V4H19C19.55 4 20.021 4.196 20.413 4.588C20.8043 4.97933 21 5.45 21 6V20C21 20.55 20.8043 21.021 20.413 21.413C20.021 21.8043 19.55 22 19 22H5ZM5 20H19V10H5V20ZM5 8H19V6H5V8Z\" fill=\"currentColor\" />"}, "Category": {"vb": "0 0 24 24", "inner": "<path d=\"M6.5 11L12 2L17.5 11H6.5ZM17.5 22C16.25 22 15.1875 21.5625 14.3125 20.6875C13.4375 19.8125 13 18.75 13 17.5C13 16.25 13.4375 15.1875 14.3125 14.3125C15.1875 13.4375 16.25 13 17.5 13C18.75 13 19.8125 13.4375 20.6875 14.3125C21.5625 15.1875 22 16.25 22 17.5C22 18.75 21.5625 19.8125 20.6875 20.6875C19.8125 21.5625 18.75 22 17.5 22ZM3 21.5V13.5H11V21.5H3ZM17.5 20C18.2 20 18.7917 19.7583 19.275 19.275C19.7583 18.7917 20 18.2 20 17.5C20 16.8 19.7583 16.2083 19.275 15.725C18.7917 15.2417 18.2 15 17.5 15C16.8 15 16.2083 15.2417 15.725 15.725C15.2417 16.2083 15 16.8 15 17.5C15 18.2 15.2417 18.7917 15.725 19.275C16.2083 19.7583 16.8 20 17.5 20ZM5 19.5H9V15.5H5V19.5ZM10.05 9H13.95L12 5.85L10.05 9Z\" fill=\"currentColor\" />"}, "Check": {"vb": "0 0 24 24", "inner": "<path d=\"M9.54998 18.0001L3.84998 12.3001L5.27498 10.8751L9.54998 15.1501L18.725 5.9751L20.15 7.4001L9.54998 18.0001Z\" fill=\"currentColor\" />"}, "Clean": {"vb": "0 0 24 24", "inner": "<path d=\"M11.1234 10.6364H12.8429V4.59091C12.8429 4.34621 12.7605 4.1411 12.5958 3.97557C12.431 3.81004 12.2268 3.72727 11.9832 3.72727C11.7396 3.72727 11.5354 3.81004 11.3706 3.97557C11.2058 4.1411 11.1234 4.34621 11.1234 4.59091V10.6364ZM5.96489 14.0909H18.0015V12.3636H5.96489V14.0909ZM4.71825 19.2727H6.82465V17.5455C6.82465 17.3008 6.90704 17.0956 7.07183 16.9301C7.23661 16.7646 7.4408 16.6818 7.6844 16.6818C7.928 16.6818 8.13219 16.7646 8.29698 16.9301C8.46176 17.0956 8.54416 17.3008 8.54416 17.5455V19.2727H11.1234V17.5455C11.1234 17.3008 11.2058 17.0956 11.3706 16.9301C11.5354 16.7646 11.7396 16.6818 11.9832 16.6818C12.2268 16.6818 12.431 16.7646 12.5958 16.9301C12.7605 17.0956 12.8429 17.3008 12.8429 17.5455V19.2727H15.4222V17.5455C15.4222 17.3008 15.5046 17.0956 15.6694 16.9301C15.8342 16.7646 16.0384 16.6818 16.282 16.6818C16.5255 16.6818 16.7297 16.7646 16.8945 16.9301C17.0593 17.0956 17.1417 17.3008 17.1417 17.5455V19.2727H19.2481L18.3884 15.8182H5.578L4.71825 19.2727ZM19.2481 21H4.71825C4.1594 21 3.70803 20.7769 3.36413 20.3307C3.02023 19.8845 2.91992 19.3879 3.06322 18.8409L4.24538 14.0909V12.3636C4.24538 11.8886 4.41375 11.482 4.75049 11.1438C5.08722 10.8055 5.49203 10.6364 5.96489 10.6364H9.40391V4.59091C9.40391 3.87121 9.65467 3.25947 10.1562 2.75568C10.6577 2.25189 11.2667 2 11.9832 2C12.6996 2 13.3086 2.25189 13.8102 2.75568C14.3117 3.25947 14.5624 3.87121 14.5624 4.59091V10.6364H18.0015C18.4743 10.6364 18.8791 10.8055 19.2159 11.1438C19.5526 11.482 19.721 11.8886 19.721 12.3636V14.0909L20.9031 18.8409C21.0894 19.3879 21.007 19.8845 20.656 20.3307C20.3049 20.7769 19.8356 21 19.2481 21Z\" fill=\"currentColor\" />"}, "Close": {"vb": "0 0 24 24", "inner": "<path d=\"M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z\" fill=\"currentColor\" />"}, "Colaps": {"vb": "0 0 24 24", "inner": "<path d=\"M3 20C2.45 20 1.97917 19.8042 1.5875 19.4125C1.19583 19.0208 1 18.55 1 18V6C1 5.45 1.19583 4.97917 1.5875 4.5875C1.97917 4.19583 2.45 4 3 4H5C5.55 4 6.02083 4.19583 6.4125 4.5875C6.80417 4.97917 7 5.45 7 6V18C7 18.55 6.80417 19.0208 6.4125 19.4125C6.02083 19.8042 5.55 20 5 20H3ZM3 18.025H5V5.975H3V18.025ZM11 20C10.45 20 9.97917 19.8042 9.5875 19.4125C9.19583 19.0208 9 18.55 9 18V6C9 5.45 9.19583 4.97917 9.5875 4.5875C9.97917 4.19583 10.45 4 11 4H21C21.55 4 22.0208 4.19583 22.4125 4.5875C22.8042 4.97917 23 5.45 23 6V18C23 18.55 22.8042 19.0208 22.4125 19.4125C22.0208 19.8042 21.55 20 21 20H11ZM11 18.025H21V5.975H11V18.025Z\" fill=\"currentColor\" />"}, "ContentCopy": {"vb": "0 0 24 24", "inner": "<path d=\"M5 22C4.45 22 3.979 21.8043 3.587 21.413C3.19567 21.021 3 20.55 3 20V6H5V20H16V22H5ZM9 18C8.45 18 7.97933 17.8043 7.588 17.413C7.196 17.021 7 16.55 7 16V4C7 3.45 7.196 2.979 7.588 2.587C7.97933 2.19567 8.45 2 9 2H18C18.55 2 19.021 2.19567 19.413 2.587C19.8043 2.979 20 3.45 20 4V16C20 16.55 19.8043 17.021 19.413 17.413C19.021 17.8043 18.55 18 18 18H9ZM9 16H18V4H9V16Z\" fill=\"currentColor\" />"}, "Delete": {"vb": "0 0 24 24", "inner": "<path d=\"M7.80775 20.8845C7.30908 20.8845 6.88308 20.7079 6.52975 20.3547C6.17658 20.0014 6 19.5754 6 19.0768V6.3845H5V4.8845H9.5V4H15.5V4.8845H20V6.3845H19V19.0768C19 19.5819 18.825 20.0095 18.475 20.3595C18.125 20.7095 17.6974 20.8845 17.1923 20.8845H7.80775ZM17.5 6.3845H7.5V19.0768C7.5 19.1666 7.52883 19.2403 7.5865 19.298C7.64417 19.3557 7.71792 19.3845 7.80775 19.3845H17.1923C17.2692 19.3845 17.3398 19.3524 17.4038 19.2883C17.4679 19.2243 17.5 19.1538 17.5 19.0768V6.3845ZM9.904 17.3845H11.4037V8.3845H9.904V17.3845ZM13.5962 17.3845H15.096V8.3845H13.5962V17.3845Z\" fill=\"currentColor\" />"}, "DesColaps": {"vb": "0 0 24 24", "inner": "<path d=\"M11.5 16L11.5 8L7.5 12L11.5 16ZM21 19C21 19.55 20.8042 20.0208 20.4125 20.4125C20.0208 20.8042 19.55 21 19 21L5 21C4.45 21 3.97917 20.8042 3.5875 20.4125C3.19583 20.0208 3 19.55 3 19L3 5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3L19 3C19.55 3 20.0208 3.19583 20.4125 3.5875C20.8042 3.97917 21 4.45 21 5L21 19ZM16 19L19 19L19 5L16 5L16 19ZM14 19L14 5L5 5L5 19L14 19Z\" fill=\"currentColor\" />"}, "Edit": {"vb": "0 0 24 24", "inner": "<path d=\"M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3043 2.75 17.863 2.75C18.421 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.571 21.275 6.113C21.2917 6.65433 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z\" fill=\"currentColor\" />"}, "EstadosError": {"vb": "48 156 24 24", "inner": "<path d=\"M60 178C58.6167 178 57.3167 177.737 56.1 177.212C54.8833 176.687 53.825 175.975 52.925 175.075C52.025 174.175 51.3127 173.117 50.788 171.9C50.2627 170.683 50 169.383 50 168C50 166.617 50.2627 165.317 50.788 164.1C51.3127 162.883 52.025 161.825 52.925 160.925C53.825 160.025 54.8833 159.312 56.1 158.787C57.3167 158.262 58.6167 158 60 158C61.3833 158 62.6833 158.262 63.9 158.787C65.1167 159.312 66.175 160.025 67.075 160.925C67.975 161.825 68.6873 162.883 69.212 164.1C69.7373 165.317 70 166.617 70 168C70 169.383 69.7373 170.683 69.212 171.9C68.6873 173.117 67.975 174.175 67.075 175.075C66.175 175.975 65.1167 176.687 63.9 177.212C62.6833 177.737 61.3833 178 60 178ZM56.4 173L60 169.4L63.6 173L65 171.6L61.4 168L65 164.4L63.6 163L60 166.6L56.4 163L55 164.4L58.6 168L55 171.6L56.4 173Z\" fill=\"currentColor\" />"}, "EstadosInfo": {"vb": "144 156 24 24", "inner": "<path d=\"M154.774 172.838H156.774V166.838H154.774V172.838ZM155.774 164.838C156.058 164.838 156.295 164.742 156.487 164.55C156.679 164.359 156.774 164.121 156.774 163.838C156.774 163.555 156.679 163.317 156.487 163.125C156.295 162.934 156.058 162.838 155.774 162.838C155.491 162.838 155.254 162.934 155.062 163.125C154.87 163.317 154.774 163.555 154.774 163.838C154.774 164.121 154.87 164.359 155.062 164.55C155.254 164.742 155.491 164.838 155.774 164.838ZM155.774 177.838C154.391 177.838 153.091 177.575 151.874 177.05C150.658 176.525 149.599 175.813 148.699 174.913C147.799 174.013 147.087 172.955 146.562 171.738C146.037 170.521 145.774 169.221 145.774 167.838C145.774 166.455 146.037 165.155 146.562 163.938C147.087 162.721 147.799 161.663 148.699 160.763C149.599 159.863 150.658 159.15 151.874 158.625C153.091 158.1 154.391 157.838 155.774 157.838C157.158 157.838 158.458 158.1 159.674 158.625C160.891 159.15 161.949 159.863 162.849 160.763C163.749 161.663 164.462 162.721 164.987 163.938C165.512 165.155 165.774 166.455 165.774 167.838C165.774 169.221 165.512 170.521 164.987 171.738C164.462 172.955 163.749 174.013 162.849 174.913C161.949 175.813 160.891 176.525 159.674 177.05C158.458 177.575 157.158 177.838 155.774 177.838Z\" fill=\"currentColor\" />"}, "EstadosSuccess": {"vb": "96 156 24 24", "inner": "<path d=\"M108 178C106.617 178 105.317 177.737 104.1 177.212C102.883 176.687 101.825 175.975 100.925 175.075C100.025 174.175 99.3127 173.117 98.788 171.9C98.2627 170.683 98 169.383 98 168C98 166.617 98.2627 165.317 98.788 164.1C99.3127 162.883 100.025 161.825 100.925 160.925C101.825 160.025 102.883 159.312 104.1 158.787C105.317 158.262 106.617 158 108 158C109.383 158 110.683 158.262 111.9 158.787C113.117 159.312 114.175 160.025 115.075 160.925C115.975 161.825 116.687 162.883 117.212 164.1C117.737 165.317 118 166.617 118 168C118 169.383 117.737 170.683 117.212 171.9C116.687 173.117 115.975 174.175 115.075 175.075C114.175 175.975 113.117 176.687 111.9 177.212C110.683 177.737 109.383 178 108 178ZM106.6 172.6L113.65 165.55L112.25 164.15L106.6 169.8L103.75 166.95L102.35 168.35L106.6 172.6Z\" fill=\"currentColor\" />"}, "FilterAlt": {"vb": "0 0 24 24", "inner": "<path d=\"M11 20C10.7167 20 10.4794 19.904 10.288 19.712C10.096 19.5207 10 19.2833 10 19V13L4.20003 5.6C3.95003 5.26667 3.9127 4.91667 4.08803 4.55C4.2627 4.18333 4.5667 4 5.00003 4H19C19.4334 4 19.7377 4.18333 19.913 4.55C20.0877 4.91667 20.05 5.26667 19.8 5.6L14 13V19C14 19.2833 13.9044 19.5207 13.713 19.712C13.521 19.904 13.2834 20 13 20H11ZM12 12.3L16.95 6H7.05003L12 12.3Z\" fill=\"currentColor\" />"}, "FirstPage": {"vb": "0 0 24 24", "inner": "<path d=\"M6 18V6H8V18H6ZM17 18L11 12L17 6L18.4 7.4L13.8 12L18.4 16.6L17 18Z\" fill=\"currentColor\" />"}, "KeyboardArrowDown": {"vb": "0 0 24 24", "inner": "<path d=\"M5.7 9.6998L7.1 8.2998L11.7 12.8998L16.3 8.2998L17.7 9.6998L11.7 15.6998L5.7 9.6998Z\" fill=\"currentColor\" />"}, "LastPage": {"vb": "0 0 24 24", "inner": "<path d=\"M6.99998 18L5.59998 16.6L10.2 12L5.59998 7.4L6.99998 6L13 12L6.99998 18ZM16 18V6H18V18H16Z\" fill=\"currentColor\" />"}, "Menu": {"vb": "0 0 24 24", "inner": "<path d=\"M3 18V16H21V18H3ZM3 13V11H21V13H3ZM3 8V6H21V8H3Z\" fill=\"currentColor\" />"}, "MoreVert": {"vb": "0 0 24 24", "inner": "<path d=\"M12 20C11.45 20 10.9793 19.8043 10.588 19.413C10.196 19.021 10 18.55 10 18C10 17.45 10.196 16.979 10.588 16.587C10.9793 16.1957 11.45 16 12 16C12.55 16 13.021 16.1957 13.413 16.587C13.8043 16.979 14 17.45 14 18C14 18.55 13.8043 19.021 13.413 19.413C13.021 19.8043 12.55 20 12 20ZM12 14C11.45 14 10.9793 13.804 10.588 13.412C10.196 13.0207 10 12.55 10 12C10 11.45 10.196 10.979 10.588 10.587C10.9793 10.1957 11.45 10 12 10C12.55 10 13.021 10.1957 13.413 10.587C13.8043 10.979 14 11.45 14 12C14 12.55 13.8043 13.0207 13.413 13.412C13.021 13.804 12.55 14 12 14ZM12 8C11.45 8 10.9793 7.804 10.588 7.412C10.196 7.02067 10 6.55 10 6C10 5.45 10.196 4.97933 10.588 4.588C10.9793 4.196 11.45 4 12 4C12.55 4 13.021 4.196 13.413 4.588C13.8043 4.97933 14 5.45 14 6C14 6.55 13.8043 7.02067 13.413 7.412C13.021 7.804 12.55 8 12 8Z\" fill=\"currentColor\" />"}, "NewMessages": {"vb": "0 0 24 24", "inner": "<path d=\"M3 20V5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3H17C17.55 3 18.0208 3.19583 18.4125 3.5875C18.8042 3.97917 19 4.45 19 5V10.075C18.8333 10.0417 18.6667 10.0208 18.5 10.0125C18.3333 10.0042 18.1667 10 18 10C17.8333 10 17.6667 10.0042 17.5 10.0125C17.3333 10.0208 17.1667 10.0417 17 10.075V5H5V15H12.075C12.0417 15.1667 12.0208 15.3333 12.0125 15.5C12.0042 15.6667 12 15.8333 12 16C12 16.1667 12.0042 16.3333 12.0125 16.5C12.0208 16.6667 12.0417 16.8333 12.075 17H6L3 20ZM7 9H15V7H7V9ZM7 13H12V11H7V13ZM17 20V17H14V15H17V12H19V15H22V17H19V20H17Z\" fill=\"currentColor\" />"}, "Notifications": {"vb": "0 0 24 24", "inner": "<path d=\"M4 19V17H6V10C6 8.61667 6.41667 7.38733 7.25 6.312C8.08333 5.23733 9.16667 4.53333 10.5 4.2V3.5C10.5 3.08333 10.646 2.72933 10.938 2.438C11.2293 2.146 11.5833 2 12 2C12.4167 2 12.7707 2.146 13.062 2.438C13.354 2.72933 13.5 3.08333 13.5 3.5V4.2C14.8333 4.53333 15.9167 5.23733 16.75 6.312C17.5833 7.38733 18 8.61667 18 10V17H20V19H4ZM12 22C11.45 22 10.9793 21.8043 10.588 21.413C10.196 21.021 10 20.55 10 20H14C14 20.55 13.8043 21.021 13.413 21.413C13.021 21.8043 12.55 22 12 22ZM8 17H16V10C16 8.9 15.6083 7.95833 14.825 7.175C14.0417 6.39167 13.1 6 12 6C10.9 6 9.95833 6.39167 9.175 7.175C8.39167 7.95833 8 8.9 8 10V17Z\" fill=\"currentColor\" />"}, "PinDrop": {"vb": "0 0 24 24", "inner": "<path d=\"M12 16.475C13.65 15.1417 14.896 13.8583 15.738 12.625C16.5793 11.3917 17 10.2333 17 9.15C17 8.21667 16.8293 7.42067 16.488 6.762C16.146 6.104 15.725 5.57067 15.225 5.162C14.725 4.754 14.1833 4.45833 13.6 4.275C13.0167 4.09167 12.4833 4 12 4C11.5167 4 10.9833 4.09167 10.4 4.275C9.81667 4.45833 9.275 4.754 8.775 5.162C8.275 5.57067 7.85433 6.104 7.513 6.762C7.171 7.42067 7 8.21667 7 9.15C7 10.2333 7.42067 11.3917 8.262 12.625C9.104 13.8583 10.35 15.1417 12 16.475ZM12 19C9.65 17.2667 7.89567 15.5833 6.737 13.95C5.579 12.3167 5 10.7167 5 9.15C5 7.96667 5.21267 6.929 5.638 6.037C6.06267 5.14567 6.60833 4.4 7.275 3.8C7.94167 3.2 8.69167 2.75 9.525 2.45C10.3583 2.15 11.1833 2 12 2C12.8167 2 13.6417 2.15 14.475 2.45C15.3083 2.75 16.0583 3.2 16.725 3.8C17.3917 4.4 17.9377 5.14567 18.363 6.037C18.7877 6.929 19 7.96667 19 9.15C19 10.7167 18.4207 12.3167 17.262 13.95C16.104 15.5833 14.35 17.2667 12 19ZM12 11C12.55 11 13.021 10.804 13.413 10.412C13.8043 10.0207 14 9.55 14 9C14 8.45 13.8043 7.979 13.413 7.587C13.021 7.19567 12.55 7 12 7C11.45 7 10.9793 7.19567 10.588 7.587C10.196 7.979 10 8.45 10 9C10 9.55 10.196 10.0207 10.588 10.412C10.9793 10.804 11.45 11 12 11ZM5 22V20H19V22H5Z\" fill=\"currentColor\" />"}, "Power": {"vb": "0 0 24 24", "inner": "<path d=\"M12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6 2.2625 9.29583 2.7875 8.0875C3.3125 6.87917 4.025 5.825 4.925 4.925L6.325 6.325C5.59167 7.05833 5.02083 7.90833 4.6125 8.875C4.20417 9.84167 4 10.8833 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 10.8833 19.7958 9.84167 19.3875 8.875C18.9792 7.90833 18.4083 7.05833 17.675 6.325L19.075 4.925C19.975 5.825 20.6875 6.87917 21.2125 8.0875C21.7375 9.29583 22 10.6 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM11 13V2H13V13H11Z\" fill=\"currentColor\" />"}, "Preview": {"vb": "0 0 24 24", "inner": "<path d=\"M5 21C4.45 21 3.97917 20.8042 3.5875 20.4125C3.19583 20.0208 3 19.55 3 19V5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3H19C19.55 3 20.0208 3.19583 20.4125 3.5875C20.8042 3.97917 21 4.45 21 5V19C21 19.55 20.8042 20.0208 20.4125 20.4125C20.0208 20.8042 19.55 21 19 21H5ZM5 19H19V7H5V19ZM12 17C10.6333 17 9.4125 16.6292 8.3375 15.8875C7.2625 15.1458 6.48333 14.1833 6 13C6.48333 11.8167 7.2625 10.8542 8.3375 10.1125C9.4125 9.37083 10.6333 9 12 9C13.3667 9 14.5875 9.37083 15.6625 10.1125C16.7375 10.8542 17.5167 11.8167 18 13C17.5167 14.1833 16.7375 15.1458 15.6625 15.8875C14.5875 16.6292 13.3667 17 12 17ZM12 15.5C12.9333 15.5 13.7833 15.2792 14.55 14.8375C15.3167 14.3958 15.9167 13.7833 16.35 13C15.9167 12.2167 15.3167 11.6042 14.55 11.1625C13.7833 10.7208 12.9333 10.5 12 10.5C11.0667 10.5 10.2167 10.7208 9.45 11.1625C8.68333 11.6042 8.08333 12.2167 7.65 13C8.08333 13.7833 8.68333 14.3958 9.45 14.8375C10.2167 15.2792 11.0667 15.5 12 15.5ZM12 14.5C12.4167 14.5 12.7708 14.3542 13.0625 14.0625C13.3542 13.7708 13.5 13.4167 13.5 13C13.5 12.5833 13.3542 12.2292 13.0625 11.9375C12.7708 11.6458 12.4167 11.5 12 11.5C11.5833 11.5 11.2292 11.6458 10.9375 11.9375C10.6458 12.2292 10.5 12.5833 10.5 13C10.5 13.4167 10.6458 13.7708 10.9375 14.0625C11.2292 14.3542 11.5833 14.5 12 14.5Z\" fill=\"currentColor\" />"}, "Search": {"vb": "0 0 24 24", "inner": "<path d=\"M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.146 15.371 4.888 14.113C3.62933 12.8543 3 11.3167 3 9.5C3 7.68333 3.62933 6.14567 4.888 4.887C6.146 3.629 7.68333 3 9.5 3C11.3167 3 12.8543 3.629 14.113 4.887C15.371 6.14567 16 7.68333 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8127 13.5627 12.688 12.688C13.5627 11.8127 14 10.75 14 9.5C14 8.25 13.5627 7.18733 12.688 6.312C11.8127 5.43733 10.75 5 9.5 5C8.25 5 7.18733 5.43733 6.312 6.312C5.43733 7.18733 5 8.25 5 9.5C5 10.75 5.43733 11.8127 6.312 12.688C7.18733 13.5627 8.25 14 9.5 14Z\" fill=\"currentColor\" />"}, "WarningFilled": {"vb": "0 0 24 24", "inner": "<path d=\"M1 21L12 2L23 21H1ZM12 18C12.2833 18 12.5208 17.9042 12.7125 17.7125C12.9042 17.5208 13 17.2833 13 17C13 16.7167 12.9042 16.4792 12.7125 16.2875C12.5208 16.0958 12.2833 16 12 16C11.7167 16 11.4792 16.0958 11.2875 16.2875C11.0958 16.4792 11 16.7167 11 17C11 17.2833 11.0958 17.5208 11.2875 17.7125C11.4792 17.9042 11.7167 18 12 18ZM11 15H13V10H11V15Z\" fill=\"currentColor\" />"}, "Help": {"vb": "0 0 24 24", "inner": "<path d=\"M11.95 18C12.3 18 12.596 17.879 12.838 17.637C13.0793 17.3957 13.2 17.1 13.2 16.75C13.2 16.4 13.0793 16.1043 12.838 15.863C12.596 15.621 12.3 15.5 11.95 15.5C11.6 15.5 11.304 15.621 11.062 15.863C10.8207 16.1043 10.7 16.4 10.7 16.75C10.7 17.1 10.8207 17.3957 11.062 17.637C11.304 17.879 11.6 18 11.95 18ZM12.1 7.7C12.5667 7.7 12.9417 7.829 13.225 8.087C13.5083 8.34567 13.65 8.68333 13.65 9.1C13.65 9.38333 13.5543 9.67067 13.363 9.962C13.171 10.254 12.9 10.5583 12.55 10.875C12.05 11.3083 11.6833 11.725 11.45 12.125C11.2167 12.525 11.1 12.925 11.1 13.325C11.1 13.5583 11.1877 13.754 11.363 13.912C11.5377 14.0707 11.7417 14.15 11.975 14.15C12.2083 14.15 12.4167 14.0667 12.6 13.9C12.7833 13.7333 12.9 13.525 12.95 13.275C13 12.9917 13.1127 12.7293 13.288 12.488C13.4627 12.246 13.75 11.9333 14.15 11.55C14.6667 11.0667 15.0293 10.625 15.238 10.225C15.446 9.825 15.55 9.38333 15.55 8.9C15.55 8.05 15.2293 7.354 14.588 6.812C13.946 6.27067 13.1167 6 12.1 6C11.4 6 10.7793 6.13333 10.238 6.4C9.696 6.66667 9.275 7.075 8.975 7.625C8.85833 7.84167 8.81667 8.054 8.85 8.262C8.88333 8.47067 9 8.64167 9.2 8.775C9.41667 8.90833 9.65433 8.95 9.913 8.9C10.171 8.85 10.3833 8.70833 10.55 8.475C10.7333 8.225 10.9543 8.03333 11.213 7.9C11.471 7.76667 11.7667 7.7 12.1 7.7ZM12 22C10.6333 22 9.34167 21.7373 8.125 21.212C6.90833 20.6873 5.846 19.975 4.938 19.075C4.02933 18.175 3.31267 17.1167 2.788 15.9C2.26267 14.6833 2 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31267 6.88333 4.02933 5.825 4.938 4.925C5.846 4.025 6.90833 3.31233 8.125 2.787C9.34167 2.26233 10.6333 2 12 2C13.4 2 14.7083 2.26233 15.925 2.787C17.1417 3.31233 18.2 4.025 19.1 4.925C20 5.825 20.7083 6.88333 21.225 8.1C21.7417 9.31667 22 10.6167 22 12C22 13.3833 21.7417 14.6833 21.225 15.9C20.7083 17.1167 20 18.175 19.1 19.075C18.2 19.975 17.1417 20.6873 15.925 21.212C14.7083 21.7373 13.4 22 12 22ZM12 20C14.2333 20 16.125 19.221 17.675 17.663C19.225 16.1043 20 14.2167 20 12C20 9.78333 19.225 7.89567 17.675 6.337C16.125 4.779 14.2333 4 12 4C9.81667 4 7.93733 4.779 6.362 6.337C4.78733 7.89567 4 9.78333 4 12C4 14.2167 4.78733 16.1043 6.362 17.663C7.93733 19.221 9.81667 20 12 20Z\" fill=\"currentColor\" />"}, "Info": {"vb": "0 0 20 20", "inner": "<path d=\"M9 15H11V9H9V15ZM10 7C10.2833 7 10.5208 6.90417 10.7125 6.7125C10.9042 6.52083 11 6.28333 11 6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6C9 6.28333 9.09583 6.52083 9.2875 6.7125C9.47917 6.90417 9.71667 7 10 7ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z\" fill=\"currentColor\" />"}, "ExpandContent": {"vb": "0 0 24 24", "inner": "<path d=\"M5 19V13.5H6.5V17.5H10.5V19H5ZM16.5 11.5V7.5H12.5V6H18V11.5H16.5Z\" fill=\"currentColor\" />"}, "Table": {"vb": "0 0 24 24", "inner": "<path d=\"M9 21C8.45 21 7.97933 20.8043 7.588 20.413C7.196 20.021 7 19.55 7 19V9C7 8.45 7.196 7.979 7.588 7.587C7.97933 7.19567 8.45 7 9 7H19C19.55 7 20.021 7.19567 20.413 7.587C20.8043 7.979 21 8.45 21 9V19C21 19.55 20.8043 20.021 20.413 20.413C20.021 20.8043 19.55 21 19 21H9ZM9 11H19V9H9V11ZM13 15H15V13H13V15ZM13 19H15V17H13V19ZM9 15H11V13H9V15ZM17 15H19V13H17V15ZM9 19H11V17H9V19ZM17 19H19V17H17V19ZM5 17C4.45 17 3.979 16.8043 3.587 16.413C3.19567 16.021 3 15.55 3 15V5C3 4.45 3.19567 3.979 3.587 3.587C3.979 3.19567 4.45 3 5 3H15C15.55 3 16.021 3.19567 16.413 3.587C16.8043 3.979 17 4.45 17 5V6H15V5H5V15H6V17H5Z\" fill=\"currentColor\" />"}};
/* ==========================================================================
   Catálogos y textos (plazosPreview.constants.ts y plazosPreviewTexts.constants.ts de d9539b65b)
   ========================================================================== */
const MONTHS_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const DURATION_UNIT_DAYS = { days: 1, weeks: 7, months: 30 };
const DURATION_UNIT_LABELS = { days: ['día', 'días'], weeks: ['semana', 'semanas'], months: ['mes', 'meses'] };
const DURATION_UNIT_OPTIONS = [{ v: 'days', label: 'Días' }, { v: 'weeks', label: 'Semanas' }, { v: 'months', label: 'Meses' }];
const RATE_TYPE_LABELS = { fixed: 'Fijo', dynamic: 'Dinámico' };
const COLLECT_OPTIONS = [{ v: 'after', label: 'Después del periodo' }, { v: 'during', label: 'Durante el periodo' }];
const SEX_OPTIONS = [{ v: 'mujer', label: 'Mujer' }, { v: 'hombre', label: 'Hombre' }, { v: 'otro', label: 'Otro' }];
const CIVIL_STATUS_OPTIONS = [
  { v: 'soltero', label: 'Soltero o Soltera' }, { v: 'casado', label: 'Casada o Casado' },
  { v: 'viudo', label: 'Viudo o Viuda' }, { v: 'divorciado', label: 'Divorciado o Divorciada' },
];
const SCORE_OPTIONS = [
  { v: 'nuevos', label: 'Clientes nuevos', sub: 'Calificación de cliente nuevo' },
  { v: 'bajo', label: 'Bajo', sub: '300 - 549' },
  { v: 'regular', label: 'Regular', sub: '550 - 632' },
  { v: 'bueno', label: 'Bueno', sub: '633 - 670' },
  { v: 'excelente', label: 'Excelente', sub: '671 - 850' },
];
const CONTRACT_STATUS_OPTIONS = [{ v: 'vigente', label: 'Vigente' }, { v: 'vencido', label: 'Vencido' }, { v: 'refrendado', label: 'Refrendado' }];
const CHANNEL_OPTIONS = [{ v: 'sucursal', label: 'Sucursal' }, { v: 'app', label: 'App móvil' }, { v: 'web', label: 'Sitio web' }];
const COMPARATOR_OPTIONS = [{ v: 'mayor', label: 'Mayor a' }, { v: 'menor', label: 'Menor a' }, { v: 'igual', label: 'Igual a' }];
const COMMISSION_OPTIONS = [{ v: 'porcentaje', label: 'Porcentaje %' }, { v: 'monto', label: 'Monto fijo $' }];
const REFINANCING_CONDITIONS = [
  { v: 'contractStatus', label: 'Estado de contrato', q: 'Ofrecer refinanciamiento si el contrato está:', opciones: CONTRACT_STATUS_OPTIONS },
  { v: 'renewals', label: 'Número de refrendos', q: 'Ofrecer refinanciamiento si el contrato tiene:' },
  { v: 'amount', label: 'Monto prestado', q: 'Ofrecer refinanciamiento si el monto prestado es mayor a:' },
  { v: 'score', label: 'Score de cliente', q: 'Ofrecer refinanciamiento a clientes con score:', opciones: SCORE_OPTIONS },
  { v: 'commission', label: 'Cobro de comisión', q: 'En el refinanciamiento, cobrar como:' },
  { v: 'channel', label: 'Canal de venta', q: 'Ofrecer refinanciamiento si el canal es:', opciones: CHANNEL_OPTIONS },
];
const condicionMeta = type => REFINANCING_CONDITIONS.find(c => c.v === type);
/* comparador con el que arranca una condición nueva (FormRefinancingSection) */
const DEFAULT_COMPARATOR = { renewals: 'mayor', commission: 'porcentaje' };

/* Forma de cada plazo = IPlazoPreview (valores del formulario + id y status) */
const EMPTY_PLAZO_FORM = {
  name: '', startDate: '', endDate: '', categoryIds: [], branchIds: [], minAmount: null, maxAmount: null,
  duration: '', durationUnit: 'days', rateType: 'fixed', rate: '', ranges: [], proration: false,
  renewalsLimited: false, renewals: '', additionalInterests: [], targetEnabled: false, sex: [], civilStatus: [], score: [],
  ageMin: '', ageMax: '', refinancingEnabled: false, refinancingConditions: [],
};
/* chips de estado (getInstallmentStateChipVariant; colores "por confirmar con Product Design") */
const ESTADOS = { Vigente: { chip: 'blue' }, Programado: { chip: 'purple' }, Inactivo: { chip: 'white' }, Borrador: { chip: 'gray' } };
/* tono → modificador del DS Tag (status) y del DS Chip (informativo) */
const TAG_TONE = { blue: 'azul', purple: 'morado', white: 'blanco', gray: 'gris' };
const CHIP_TONE = { blue: 'ds-chip--info', purple: 'ds-chip--brand', gray: '' };

const PLAZOS_SIMULATION_DEFAULT_AMOUNT = 4000, PLAZOS_IVA = 0.16, PLAZOS_DEFAULT_PERIODS = 4, MAX_PERIODS = 12;

/* ==========================================================================
   Árboles de ejemplo (plazosPreviewTrees.mocks.ts): Ubicaciones con ids "{locationId}:{type}"
   (1 = grupo, 2 = sucursal) y Catálogo con ids de texto (las hojas llevan "-")
   ========================================================================== */
const sucursal = (id, label) => ({ id: `${id}:2`, label });
const SUCURSALES = [
  { id: '1:1', label: 'Empeños La Esperanza', children: [
    { id: '10:1', label: 'Zona Centro', children: [sucursal(101, 'Sucursal Zócalo'), sucursal(102, 'Sucursal Roma Norte'), sucursal(103, 'Sucursal Coyoacán')] },
    { id: '11:1', label: 'Zona Norte', children: [sucursal(111, 'Sucursal Monterrey Centro'), sucursal(112, 'Sucursal San Nicolás')] },
    { id: '12:1', label: 'Zona Bajío', children: [sucursal(121, 'Sucursal León'), sucursal(122, 'Sucursal Querétaro'), sucursal(123, 'Sucursal Celaya')] },
  ] },
];
const CATEGORIAS = [
  { id: 'joyeria', label: 'Joyería', children: [{ id: 'joyeria-oro', label: 'Oro' }, { id: 'joyeria-plata', label: 'Plata' }, { id: 'joyeria-relojes', label: 'Relojes' }] },
  { id: 'electronica', label: 'Electrónica', children: [{ id: 'electronica-celulares', label: 'Celulares' }, { id: 'electronica-laptops', label: 'Laptops' }, { id: 'electronica-consolas', label: 'Consolas' }] },
  { id: 'herramientas', label: 'Herramientas', children: [{ id: 'herramientas-electricas', label: 'Eléctricas' }, { id: 'herramientas-manuales', label: 'Manuales' }] },
  { id: 'vehiculos', label: 'Vehículos', children: [{ id: 'vehiculos-autos', label: 'Automóviles' }, { id: 'vehiculos-motos', label: 'Motocicletas' }] },
];
const ARBOL = { sucursales: SUCURSALES, categorias: CATEGORIAS };
const RAIZ_UBICACIONES = SUCURSALES[0].id;
/* subetiquetas de mapLocationTreeToNodes / mapCatalogTreeToNodes: "Mi empresa" en la raíz y "Nivel N";
   en el catálogo, "Grupo" en el nivel 0 y "Nivel 1" en los hijos */
const subDe = (kind, depth) => (kind === 'sucursales' ? (depth === 0 ? 'Mi empresa' : `Nivel ${depth}`) : (depth === 0 ? 'Grupo' : `Nivel ${depth}`));
const flatten = (kind, nodes, parent = null, depth = 0, out = []) => {
  nodes.forEach(n => { out.push({ ...n, parent, depth, sub: subDe(kind, depth) }); if (n.children) flatten(kind, n.children, n.id, depth + 1, out); });
  return out;
};
const FLAT = { sucursales: flatten('sucursales', SUCURSALES), categorias: flatten('categorias', CATEGORIAS) };
const nodoDe = (kind, id) => FLAT[kind].find(n => n.id === id) || null;

/* plazosPreviewTree.utils.ts: el nodo y todos sus descendientes (grupos y hojas) */
const getSubtreeIds = (kind, id) => {
  const out = new Set(); const nodo = nodoDe(kind, id); if (!nodo) return out;
  const walk = n => { out.add(n.id); (n.children || []).forEach(walk); };
  walk(nodo);
  return out;
};
/* filterPlazosByNode: sin nodo, nada; la raíz de Ubicaciones trae todos (también los que no tienen sucursales);
   con otro nodo, los plazos que tienen ese nodo o alguno de sus descendientes */
const filterPlazosByNode = (plazos, kind, nodeId) => {
  if (!nodeId) return [];
  if (kind === 'sucursales' && nodeId === RAIZ_UBICACIONES) return plazos;
  const ids = getSubtreeIds(kind, nodeId), field = kind === 'sucursales' ? 'branchIds' : 'categoryIds';
  return plazos.filter(p => p[field].some(x => ids.has(x)));
};
/* getLeafRows: hojas en el orden del árbol, con el nombre de su padre directo */
const getLeafRows = kind => {
  const walk = (list, parentName) => list.flatMap(n => (n.children && n.children.length ? walk(n.children, n.label) : [{ id: n.id, name: n.label, parentName }]));
  return walk(ARBOL[kind], '');
};
/* computeNewCheckedIds del Tree del DS: cascada hacia abajo y luego recalcula hacia arriba */
const computeNewCheckedIds = (kind, id, actuales, marcar) => {
  const res = new Set(actuales);
  const bajar = n => { if (marcar) res.add(n.id); else res.delete(n.id); (n.children || []).forEach(bajar); };
  bajar(nodoDe(kind, id));
  const subir = nodes => nodes.forEach(n => {
    if (!n.children || !n.children.length) return;
    subir(n.children);
    if (n.children.every(c => res.has(c.id))) res.add(n.id); else res.delete(n.id);
  });
  subir(ARBOL[kind]);
  return [...res];
};
const hasAnyDescendantChecked = (n, set) => (n.children || []).some(c => set.has(c.id) || hasAnyDescendantChecked(c, set));

/* ==========================================================================
   Utilidades (plazosPreview.utils.ts, copiadas 1:1)
   ========================================================================== */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clone = o => JSON.parse(JSON.stringify(o));
const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
/* formato de dinero de la guía: $1,500.00 (null → $0.00) */
const formatCurrency = v => currencyFormatter.format(v ?? 0);
const formatPercent = v => `${v}%`;
const formatAmountRange = (min, max) => `${formatCurrency(min)} - ${formatCurrency(max)}`;
const DATE_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const parseDate = value => {
  const m = DATE_PATTERN.exec(String(value ?? '').trim());
  if (!m) return null;
  const p = { day: Number(m[1]), month: Number(m[2]), year: Number(m[3]) };
  if (p.month < 1 || p.month > 12 || p.day < 1 || p.day > 31) return null;
  return p;
};
const isValidDate = v => Boolean(v && parseDate(v));
/* regla de la maqueta que su esquema no trae (F-31): además del formato, el día tiene que existir (31/02 no) */
const fechaExiste = v => { const p = parseDate(v); if (!p) return false; const d = new Date(p.year, p.month - 1, p.day); return d.getMonth() === p.month - 1 && d.getDate() === p.day; };
const dateToNumber = v => { const p = parseDate(v); return p ? p.year * 10000 + p.month * 100 + p.day : 0; };
/* 30/09/2026 → 30 Sep 2026 */
const formatDate = v => { const p = parseDate(v); if (!p) return ''; return `${String(p.day).padStart(2, '0')} ${MONTHS_SHORT[p.month - 1]} ${p.year}`; };
const ddmmaaaa = d => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
const addDays = (v, days) => { const p = parseDate(v); if (!p) return ''; return ddmmaaaa(new Date(p.year, p.month - 1, p.day + days)); };
const getTodayString = () => ddmmaaaa(new Date());
const toNumber = v => { const n = Number(v); return Number.isFinite(n) ? n : 0; };
const getDurationDays = (duration, unit) => toNumber(duration) * DURATION_UNIT_DAYS[unit];
const formatDuration = (duration, unit) => { const n = toNumber(duration); return `${n} ${DURATION_UNIT_LABELS[unit][n === 1 ? 0 : 1]}`; };
/* tasa que se muestra: la fija o la MENOR de los rangos dinámicos */
const getBaseRate = p => (p.rateType === 'fixed' || p.ranges.length === 0 ? toNumber(p.rate) : Math.min(...p.ranges.map(r => toNumber(r.rate))));
const formatRate = p => `${RATE_TYPE_LABELS[p.rateType]} ${getBaseRate(p)}%`;
/* las hojas son las que tienen "-" (categorías) o tipo 2 (sucursales) */
const isLeafBranchId = id => id.endsWith(':2');
const isLeafCategoryId = id => id.includes('-');
const countBranches = p => p.branchIds.filter(isLeafBranchId).length;
const countCategories = p => p.categoryIds.filter(isLeafCategoryId).length;
/* solo dígitos y un punto decimal (tasas y porcentajes) / solo dígitos (enteros) */
const sanitizeDecimal = v => { const clean = String(v).replace(/[^\d.]/g, ''); const [entero, ...dec] = clean.split('.'); return dec.length ? `${entero}.${dec.join('')}` : entero; };
const sanitizeInteger = v => String(v).replace(/\D/g, '');
const createId = prefix => `${prefix}-${Date.now().toString(36)}-${Math.round(Math.random() * 1000)}`;
/* porcentaje a 2 decimales sin ceros de más (F-43: así el chip de la simulación nunca muestra 0.30000000000000004%) */
const pct = n => { const v = Number(n); return (Number.isInteger(v) ? v : +v.toFixed(2)) + '%'; };
const num = v => { const n = parseFloat(String(v ?? '').replace(/[^0-9.]/g, '')); return Number.isFinite(n) ? n : null; };
const money2num = v => { const n = num(v); return n == null ? null : Math.round(n * 100) / 100; };

/* Detalle (plazosPreviewDetail.utils.ts) */
const optionLabels = (values, options) => values.map(v => (options.find(o => o.v === v) || {}).label).filter(Boolean);
const optionLabel = (v, options) => (options.find(o => o.v === v) || {}).label || '';
const getValidity = p => {
  const start = formatDate(p.startDate); if (!start) return '';
  return `${start} al ${formatDate(p.endDate) || 'Sin fecha de fin'}`;
};
const getRenewalsLabel = p => (p.renewalsLimited ? p.renewals : 'Ilimitados');
const getAgeLabel = p => (!p.ageMin && !p.ageMax ? '' : `${p.ageMin || '18'} - ${p.ageMax || '100'} años`);
const getConditionValue = c => {
  const comparador = optionLabel(c.comparator, COMPARATOR_OPTIONS);
  const porTipo = {
    contractStatus: () => optionLabels(c.values, CONTRACT_STATUS_OPTIONS).join(', '),
    renewals: () => `${comparador} ${c.count} refrendos`,
    amount: () => formatCurrency(c.amount),
    score: () => optionLabels(c.values, SCORE_OPTIONS).join(', '),
    commission: () => `${optionLabel(c.comparator, COMMISSION_OPTIONS)} ${c.count}`,
    channel: () => optionLabels(c.values, CHANNEL_OPTIONS).join(', '),
  };
  return porTipo[c.type]().trim();
};
/* Formulario (plazosPreviewForm.utils.ts): misma etiqueta que getInterestConfigLabel de la pantalla real (con la coma final) */
const getInterestConfigLabel = a => {
  const count = a.collect === 'after' && a.countPeriod ? `+${a.countPeriod} ${DURATION_UNIT_LABELS[a.periodUnit][1]}, ` : '';
  return `${count}${a.collect === 'after' ? 'Después del periodo' : 'Durante el periodo'}, Tasa: ${a.rate}%,`;
};

/* Simulación (plazosPreviewAmortization.utils.ts): tasa del periodo = interés base + adicionales "durante" */
const getPeriodRate = v => getBaseRate(v) + v.additionalInterests.filter(i => i.collect === 'during').reduce((t, i) => t + toNumber(i.rate), 0);
const getAmortizationSummary = (v, amount) => {
  const rate = getPeriodRate(v), interest = (amount * rate) / 100, renewal = interest * (1 + PLAZOS_IVA);
  return { rate, interest, renewal, payoff: amount + renewal };
};
const buildAmortization = (v, amount) => {
  const periods = v.renewalsLimited ? Math.min(toNumber(v.renewals) + 1, MAX_PERIODS) : PLAZOS_DEFAULT_PERIODS;
  const days = Math.max(getDurationDays(v.duration, v.durationUnit), 1);
  const start = isValidDate(v.startDate) ? v.startDate : getTodayString();
  const { interest } = getAmortizationSummary(v, amount);
  const iva = interest * PLAZOS_IVA;
  return Array.from({ length: Math.max(periods, 1) }, (_, i) => ({
    period: i + 1, date: formatDate(addDays(start, days * (i + 1))), amount, interest, iva, renewal: interest + iva, payoff: amount + interest + iva,
  }));
};

/* ==========================================================================
   Datos de ejemplo (plazosPreview.mocks.ts y plazosPreviewSuggestions.mocks.ts), con fechas fijas
   ========================================================================== */
const ZONE_CENTRO = ['101:2', '102:2', '103:2', '10:1'];
const ZONE_NORTE = ['111:2', '112:2', '11:1'];
const ZONE_BAJIO = ['121:2', '122:2', '123:2', '12:1'];
const ALL_BRANCHES = [...ZONE_CENTRO, ...ZONE_NORTE, ...ZONE_BAJIO, '1:1'];
const adminFee = { id: 'adm', name: 'Gastos de administración', collect: 'during', countPeriod: '', periodUnit: 'days', showContract: true, rate: '1.5' };
const moratory = { id: 'mor', name: 'Interés moratorio', collect: 'after', countPeriod: '5', periodUnit: 'days', showContract: true, rate: '0.2' };
const storage = { id: 'alm', name: 'Almacenaje', collect: 'during', countPeriod: '', periodUnit: 'days', showContract: false, rate: '0.8' };
const mockPlazo = o => ({ ...EMPTY_PLAZO_FORM, status: 'Vigente', startDate: '01/09/2026', rate: '4.5', ...o });
const dynamicRanges = base => [{ id: 'r1', from: '0', to: '50', rate: String(base) }, { id: 'r2', from: '50', to: '80', rate: String(base + 1.5) }];
const buildMockPlazos = () => clone([
  mockPlazo({ id: 1, name: 'Plazo Oro 30 días', endDate: '30/09/2027', minAmount: 1500, maxAmount: 25000, duration: '30', renewalsLimited: true, renewals: '3',
    additionalInterests: [adminFee, moratory], branchIds: [...ZONE_CENTRO, ...ZONE_BAJIO], categoryIds: ['joyeria-oro', 'joyeria-plata'] }),
  mockPlazo({ id: 2, name: 'Plata Express', rate: '5', minAmount: 500, maxAmount: 8000, duration: '2', durationUnit: 'weeks', branchIds: ZONE_CENTRO, categoryIds: ['joyeria-plata'] }),
  mockPlazo({ id: 3, name: 'Electrónica Plus', rateType: 'dynamic', rate: '6', ranges: dynamicRanges(6), minAmount: 1000, maxAmount: 30000, duration: '1', durationUnit: 'months',
    proration: true, additionalInterests: [storage], targetEnabled: true, score: ['regular', 'bueno', 'excelente'], ageMin: '21', ageMax: '65',
    branchIds: ALL_BRANCHES, categoryIds: ['electronica-celulares', 'electronica-laptops', 'electronica-consolas'] }),
  mockPlazo({ id: 4, name: 'Relojes Premium', status: 'Programado', startDate: '01/11/2026', rate: '3.8', minAmount: 5000, maxAmount: 120000, duration: '3', durationUnit: 'months',
    additionalInterests: [adminFee], branchIds: [...ZONE_CENTRO, ...ZONE_NORTE], categoryIds: ['joyeria-relojes'] }),
  mockPlazo({ id: 5, name: 'Herramientas Básico', status: 'Inactivo', rate: '6', minAmount: 300, maxAmount: 6000, duration: '45', branchIds: ZONE_BAJIO,
    categoryIds: ['herramientas-electricas', 'herramientas-manuales', 'herramientas'] }),
  mockPlazo({ id: 6, name: 'Vehículos Flex', rateType: 'dynamic', rate: '3.5', ranges: dynamicRanges(3.5), minAmount: 20000, maxAmount: 250000, duration: '6', durationUnit: 'months',
    additionalInterests: [adminFee, moratory, storage], refinancingEnabled: true,
    refinancingConditions: [
      { id: 'c1', type: 'renewals', values: [], comparator: 'mayor', count: '2', amount: null },
      { id: 'c2', type: 'score', values: ['bueno', 'excelente'], comparator: '', count: '', amount: null },
    ],
    branchIds: ZONE_NORTE, categoryIds: ['vehiculos-autos', 'vehiculos-motos', 'vehiculos'] }),
  mockPlazo({ id: 7, name: 'Consolas Gamer', status: 'Borrador', startDate: '', rate: '5.5', minAmount: 800, maxAmount: 12000, duration: '4', durationUnit: 'weeks' }),
  mockPlazo({ id: 8, name: 'Celulares 15 días', endDate: '31/12/2026', rate: '7', minAmount: 1000, maxAmount: 15000, duration: '15', additionalInterests: [moratory],
    branchIds: ALL_BRANCHES, categoryIds: ['electronica-celulares'] }),
  mockPlazo({ id: 9, name: 'Laptops Estudiantes', status: 'Programado', startDate: '15/01/2027', rateType: 'dynamic', rate: '5', ranges: dynamicRanges(5), minAmount: 2000, maxAmount: 35000,
    duration: '2', durationUnit: 'months', targetEnabled: true, ageMin: '18', ageMax: '30', civilStatus: ['soltero'], branchIds: ZONE_CENTRO, categoryIds: ['electronica-laptops'] }),
  mockPlazo({ id: 10, name: 'Oro Temporada Navideña', status: 'Inactivo', rate: '4', minAmount: 1500, maxAmount: 40000, duration: '60', renewalsLimited: true, renewals: '2',
    branchIds: ALL_BRANCHES, categoryIds: ['joyeria-oro'] }),
]);
/* ISuggestedTerm: lo que manda la API de sugeridos (sin adicionales ni artículos reales) */
const buildMockSuggestions = () => [
  { suggestedTermId: 901, nameTermSuggested: 'Plazo Regular — Joyería', loanMinimum: 1500, loanMaximum: 30000, duration: 30, frequencyPeriodId: 0, typeRateTermId: 1, rateFixTerm: '4%', numberOfBranches: 8, hasProration: false },
  { suggestedTermId: 902, nameTermSuggested: 'Plazo Corto — Electrónica', loanMinimum: 800, loanMaximum: 12000, duration: 2, frequencyPeriodId: 1, typeRateTermId: 1, rateFixTerm: '6.5%', numberOfBranches: 5, hasProration: false },
];
/* intereses sugeridos con los que arranca un plazo nuevo (buildSuggestedInterests) */
const buildSuggestedInterests = () => [
  { id: 'sugerido-gracia', name: 'Días de gracia', collect: 'after', countPeriod: '3', periodUnit: 'days', showContract: true, rate: '1', suggested: true },
  { id: 'sugerido-almacenamiento', name: 'Almacenamiento', collect: 'during', countPeriod: '', periodUnit: 'days', showContract: false, rate: '0.8', suggested: true },
];
/* "Personalizar" una sugerencia (suggestionToFormValues) */
const SUGGESTION_UNITS = { 0: 'days', 1: 'weeks', 2: 'months' };
const suggestionToFormValues = s => ({
  ...clone(EMPTY_PLAZO_FORM), name: s.nameTermSuggested ?? '', minAmount: s.loanMinimum, maxAmount: s.loanMaximum ?? null,
  duration: String(s.duration), durationUnit: SUGGESTION_UNITS[s.frequencyPeriodId] ?? 'days',
  rate: (s.rateFixTerm ?? '').replace('%', '').trim(), proration: s.hasProration, additionalInterests: buildSuggestedInterests(),
});
/* plazoToFormValues: solo los campos del formulario */
const aFormulario = p => Object.fromEntries(Object.keys(EMPTY_PLAZO_FORM).map(k => [k, clone(p[k])]));

/* ==========================================================================
   Servicio simulado (plazosPreview.service.ts + usePlazosPreview.ts)
   db = el "servidor" en memoria; store = lo que la página ya cargó. Una sola carga al abrir:
   plazos, árboles y sugerencias juntos. Sin latencia simulada: responden al momento.
   ========================================================================== */
const db = { plazos: [], sugerencias: [] };
const store = { plazos: [], sugerencias: [], carga: 'cargando' }; /* carga: 'cargando' | 'listo' | 'error' */
const demo = { escenario: 'data', action: 'ok', failNextLoad: false, failNextGet: false };
let sequence = 0;
/* escenario nuevo o "Restablecer datos": vuelve a sembrar el servidor (en Vacío no hay plazos, pero sí sugerencias) */
function sembrar() {
  db.plazos = demo.escenario === 'empty' ? [] : buildMockPlazos();
  db.sugerencias = buildMockSuggestions();
  sequence = db.plazos.reduce((max, p) => Math.max(max, p.id), 0);
  /* en el escenario Error fallan solo la primera carga y el primer get; luego se apagan */
  demo.failNextLoad = demo.failNextGet = demo.escenario === 'error';
}
let cargaT = null;
function cargarTodo() {
  clearTimeout(cargaT);
  store.carga = 'cargando'; store.plazos = []; store.sugerencias = [];
  vista.alCargar?.();
  /* sin latencia simulada; el escenario "Carga lenta" deja el estado de carga fijo */
  if (demo.escenario === 'slow') return;
  cargaT = (() => {
    if (demo.failNextLoad) { demo.failNextLoad = false; store.carga = 'error'; }
    else { store.plazos = clone(db.plazos); store.sugerencias = clone(db.sugerencias); store.carga = 'listo'; }
    vista.alCargar?.();
  })();
}
const getPlazo = id => store.plazos.find(p => p.id === id);
/* upsert del servicio y replace del hook: si existe se reemplaza en su lugar; si no, entra primero */
function upsert(plazo) {
  [db.plazos, store.plazos].forEach((lista, i) => {
    const copia = i === 0 ? clone(plazo) : plazo;
    const k = lista.findIndex(x => x.id === plazo.id);
    if (k >= 0) lista[k] = copia; else lista.unshift(copia);
  });
}
function setStatus(id, activo) {
  const status = activo ? 'Vigente' : 'Inactivo';
  [db.plazos, store.plazos].forEach(lista => { const p = lista.find(x => x.id === id); if (p) p.status = status; });
  return status;
}
/* F-35 (regla de la maqueta, por confirmar): con inicio posterior a hoy queda Programado; si no, Vigente */
const estadoPorInicio = start => (dateToNumber(start) > dateToNumber(getTodayString()) ? 'Programado' : 'Vigente');
/* vista actual: qué repintar cuando termina la carga inicial */
let vista = {};

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
/* Breadcrumb: Home › Plazos (› plazo); Daniel quitó el nivel intermedio de la vista previa el 2026-10-12 */
const ui = {
  /* Button del DS. El ícono a la derecha va en su caja de 20 × 20 (.button-icon de Button.tsx) */
  btn: (label, { variant = 'primary', iconLeft, iconRight, iconRightCls = '', attrs = '', full, type = 'button' } = {}) =>
    `<button type="${type}" class="ds-btn ds-btn--md ds-btn--${variant}${iconLeft ? ' ds-btn--icon-left' : ''}${iconRight ? ' ds-btn--icon-right' : ''}${full ? ' ds-btn--full' : ''}" ${attrs}>${iconLeft ? icon(iconLeft) : ''}<span>${label}</span>${iconRight ? `<span class="ds-btn__icon">${icon(iconRight, iconRightCls)}</span>` : ''}</button>`,
  /* ButtonSelect del DS: no es un botón nuevo, es el Button (variante y tamaño propios) con ChevronDownIcon
     de 20 a la derecha dentro de un contenedor inline-flex; el menú lo abre montarButtonSelect() */
  btnSelect: (label, { variant = 'secondary', attrs = '' } = {}) =>
    `<div class="ds-btnselect">${ui.btn(label, { variant, iconRight: 'ChevronDown', iconRightCls: 'ds-btnselect__chev', attrs: `aria-haspopup="menu" aria-expanded="false" ${attrs}` })}</div>`,
  iconBtn: (name, label, attrs = '', size = '') =>
    `<button type="button" class="ds-icon-btn${size ? ' ds-icon-btn--' + size : ''}" aria-label="${esc(label)}" ${attrs}>${icon(name)}</button>`,
  /* Breadcrumb del DS con el marcado de los demás módulos (estilos en ../pos.css); siempre empieza en Home,
     que lleva al Home con widgets (../home/) */
  breadcrumb: items => { const all = [{ label: 'Inicio', href: '../home/' }, ...items]; return `<nav class="ds-breadcrumb" aria-label="Breadcrumb"><ol class="pos-crumbs">${all.map((it, i) => i < all.length - 1
    ? `<li><a href="${it.href}" class="ds-breadcrumb__link" ${it.attrs || ''}>${esc(it.label)}</a><span class="ds-breadcrumb__sep" aria-hidden="true"><img class="pos-crumb-sep" src="../assets/ds/ArrowForwardIos-D4D6D8.svg" alt=""></span></li>`
    : `<li><span class="ds-breadcrumb__current" aria-current="page">${esc(it.label)}</span></li>`).join('')}</ol></nav>`; },
  /* Chip status del DS: es de solo lectura y lleva role="status" (Chip.tsx) */
  chip: status => `<span class="ds-tag ds-tag--${TAG_TONE[ESTADOS[status].chip]}" role="status">${status}</span>`,
  /* Chip informativa grande del DS (35 de alto): blue, gray o purple */
  chipInfo: (label, color) => `<span class="ds-chip ${CHIP_TONE[color] || ''}">${esc(label)}</span>`,
  alert: (variant, { title, text, action } = {}) => {
    const ic = { info: 'EstadosInfo', error: 'EstadosError', warning: 'WarningFilled', success: 'EstadosSuccess' }[variant];
    return `<div class="ds-alert ds-alert--${variant}" role="${variant === 'error' ? 'alert' : 'status'}"><span class="ds-alert__icon">${icon(ic)}</span><div class="ds-alert__body-wrap">${title ? `<p class="ds-alert__title">${title}</p>` : ''}${text ? `<p class="ds-alert__body">${text}</p>` : ''}</div>${action ? `<div class="ds-alert__actions">${action}</div>` : ''}</div>`;
  },
  note: text => `<p class="design-note">${text}</p>`,
  /* TextInput / NumberInput del DS; sin label, el input lleva su aria-label */
  field: ({ id, label, optional, help, input, error = '' }) =>
    `<div class="ds-field" data-field="${id}">${label ? `<label class="ds-field__label" for="${id}">${label}${optional ? '<span class="ds-field__optional">(opcional)</span>' : ''}</label>` : ''}${input}${help !== undefined ? `<p class="ds-help" id="${id}-help">${help}</p>` : ''}<p class="ds-error" id="${id}-error" role="alert">${error}</p></div>`,
  input: ({ id, value = '', placeholder = '', type = 'text', attrs = '', cls = '' }) =>
    `<input class="ds-input ${cls}" id="${id}" name="${id}" type="${type}" value="${esc(value)}" placeholder="${esc(placeholder)}" aria-describedby="${id}-error ${id}-help" ${attrs}>`,
  /* TextInput type="date": texto con el ícono de calendario, sin máscara */
  date: ({ id, value, attrs = '' }) => `<div class="ds-input-wrap">${ui.input({ id, value, placeholder: 'dd/mm/aaaa', attrs: `autocomplete="off" ${attrs}` })}${icon('CalendarToday', 'ds-input__icon')}</div>`,
  select: ({ id, options, value, attrs = '', cls = '' }) =>
    `<select class="ds-select ${cls}" id="${id}" name="${id}" ${attrs}>${options.map(o => `<option value="${o.v}"${String(o.v) === String(value) ? ' selected' : ''}>${esc(o.label)}</option>`).join('')}</select>`,
  /* Switch del DS; top: etiqueta arriba (labelPosition="top"); sin label no pinta texto */
  switch: ({ id, label = '', checked, attrs = '', top = false }) => top
    ? `<label class="ds-switch ds-switch--top"><span class="ds-switch__toplabel">${label}</span><input type="checkbox" role="switch" id="${id}" ${checked ? 'checked' : ''} ${attrs}><span class="ds-switch__track">${SWITCH_KNOB}</span></label>`
    : `<label class="ds-switch"><input type="checkbox" role="switch" id="${id}" ${checked ? 'checked' : ''} ${attrs}><span class="ds-switch__track">${SWITCH_KNOB}</span>${label ? `<span>${label}</span>` : ''}</label>`,
  check: ({ name, value, label, sub, checked, attrs = '', cls = '' }) =>
    `<label class="ds-check ${cls}"><input type="checkbox" name="${name}" value="${value}" ${checked ? 'checked' : ''} ${attrs}><span class="ds-check__box">${CHECK_SVG}<span class="dash"></span></span><span class="ds-check__text"><span>${esc(label)}</span>${sub ? `<span class="ds-check__sub">${esc(sub)}</span>` : ''}</span></label>`,
  /* Checkbox sin texto visible (el del nodo del FormTree); el nombre va en aria-label */
  checkSolo: ({ label, checked, attrs = '' }) =>
    `<label class="ds-check"><input type="checkbox" aria-label="${esc(label)}" ${checked ? 'checked' : ''} ${attrs}><span class="ds-check__box">${CHECK_SVG}<span class="dash"></span></span></label>`,
  radio: ({ name, value, label, checked, attrs = '' }) =>
    `<label class="ds-radio"><input type="radio" name="${name}" value="${value}" ${checked ? 'checked' : ''} ${attrs}><span class="ds-radio__circle"></span><span>${esc(label)}</span></label>`,
  errorText: msg => msg ? `${icon('Close')}<span>${esc(msg)}</span>` : '',
  /* Menú ⋮ (InstallmentRowActionsMenu): el panel lleva el mismo nombre que su IconButton y las opciones salen del Tab */
  menu: (id, label, items) => `<div class="menu-wrap">${ui.iconBtn('MoreVert', label, `aria-haspopup="menu" aria-expanded="false" aria-controls="${id}" data-menu-trigger`)}<div class="ds-menu" role="menu" id="${id}" aria-label="${esc(label)}" hidden>${items.map(it => `<button type="button" role="menuitem" tabindex="-1" data-action="${it.action}" ${it.data || ''}>${icon(it.icon)}${it.label}</button>`).join('')}</div></div>`,
  /* Table borderVariant="neutral" dentro de su marco con scroll propio */
  tabla: (label, headers, rows, cls = '') => `<div class="table-wrap" role="region" aria-label="${esc(label)}" tabindex="0"><table class="ds-table ${cls}">
    <thead><tr>${headers.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead>
    <tbody>${rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`,
};

/* ==========================================================================
   Toast (DS): título = qué pasó · texto = qué objeto · 5 s
   ========================================================================== */
function showToast({ type = 'success', title, message }) {
  const region = document.getElementById('toasts');
  const el = document.createElement('div');
  el.className = `ds-toast ds-toast--${type}`;
  el.setAttribute('role', type === 'error' ? 'alert' : 'status');
  el.innerHTML = `<span class="ds-toast__icon">${icon(type === 'error' ? 'EstadosError' : 'EstadosSuccess')}</span><div class="ds-toast__body-wrap"><p class="ds-toast__title">${esc(title)}</p>${message ? `<p class="ds-toast__body">${esc(message)}</p>` : ''}</div><button type="button" class="ds-toast__close" aria-label="Cerrar">${icon('Close')}</button><span class="ds-toast__timer"></span>`;
  region.prepend(el);
  const remove = () => el.remove();
  el.querySelector('.ds-toast__close').addEventListener('click', remove);
  el.querySelector('.ds-toast__timer').addEventListener('animationend', remove);
  el.addEventListener('keydown', e => { if (e.key === 'Escape') remove(); });
}

/* ==========================================================================
   Modal (DS): centrado, default (606) o large (800). El pie es opcional: sin pie se cierra
   con la X, Esc o el overlay. footerEnd: botones a la derecha (ModalActions del modal de interés).
   onClose puede devolver el elemento que recibe el foco al cerrar.
   ========================================================================== */
let modalReturnFocus = null, modalOnClose = null;
function openModal({ title, body, footer, size, footerEnd, onMount, onClose }) {
  const root = document.getElementById('modal-root');
  modalReturnFocus = document.activeElement; modalOnClose = onClose || null;
  root.innerHTML = `<div class="ds-overlay" data-overlay>
    <div class="ds-modal${size === 'large' ? ' ds-modal--large' : ''}" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="ds-modal__head"><h2 class="ds-modal__title" id="modal-title">${title}</h2><button type="button" class="ds-modal__x" aria-label="Cerrar" data-close>${icon('Close')}</button></div>
      <div class="ds-modal__body">${body}</div>
      ${footer ? `<div class="ds-modal__foot${footerEnd ? ' ds-modal__foot--end' : ''}">${footer}</div>` : ''}
    </div></div>`;
  document.body.style.overflow = 'hidden';
  const overlay = root.firstElementChild;
  overlay.addEventListener('mousedown', e => { if (e.target === overlay) closeModal(); });
  overlay.querySelector('[data-close]').addEventListener('click', () => closeModal());
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
function closeModal({ sinAviso = false } = {}) {
  const root = document.getElementById('modal-root');
  const abierto = !!root.firstElementChild;
  closePopup(false);
  root.innerHTML = '';
  document.body.style.overflow = '';
  const alCerrar = modalOnClose; modalOnClose = null;
  if (!abierto) return; /* route() lo llama siempre: sin modal no hay foco que devolver */
  let f = modalReturnFocus; modalReturnFocus = null;
  if (alCerrar && !sinAviso) { const r = alCerrar(); if (r) f = r; }
  /* si la fila o el detalle se volvieron a pintar, el ⋮ es otro nodo con el mismo aria-controls (m-1, m-detail) */
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
  ov.querySelector('[data-close-btn]').addEventListener('click', () => closeModal());
  ov.querySelector('[data-confirm]').addEventListener('click', e => onConfirm(e.currentTarget));
}

/* sin latencia simulada: la acción responde al momento (en "Acciones con error" falla) */
function fakeRequest(btn, { ok, fail }) {
  demo.action === 'error' ? fail() : ok();
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
    closeMenus(trigger); closePopup(false);
    menu.hidden = !open; trigger.setAttribute('aria-expanded', String(open));
    if (open && menu.classList.contains('ds-menu')) placeMenu(trigger, menu);
    if (open) menu.querySelector('[role="menuitem"]:not([aria-disabled="true"]), [role="option"]')?.focus({ preventScroll: true });
    return;
  }
  if (!e.target.closest('[role="menu"], [role="listbox"]')) closeMenus();
});
/* El menú se pinta fijo para que el scroll de la tabla no lo recorte (guía 4.39).
   Menú ⋮ (InstallmentRowActionsMenu): alineado al borde derecho del ⋮, 4 px abajo; si abajo quedan menos
   de 200 px y arriba hay más, abre hacia arriba. */
function placeMenu(trigger, menu) {
  const r = trigger.getBoundingClientRect();
  menu.style.position = 'fixed';
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
  const menu = e.target.closest('.plz .ds-menu[role="menu"], .plz .ds-filter-chip__list[role="listbox"]');
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
    const devolver = e.key === 'Escape' || menu.matches('.ds-menu');
    closeMenus(); if (devolver) { e.preventDefault(); trigger?.focus(); }
  }
});

/* ==========================================================================
   Listas flotantes (capa 1410 en #plz-capas, position fixed): SelectionInput, la lista del DobleInput,
   el menú del ButtonSelect y la del AutoMultiSelect. Una abierta a la vez; con scroll se reubican y con resize
   se cierran (menos el menú del ButtonSelect, que se reubica).
   ========================================================================== */
let popup = null; /* { anchor, list, focusTarget, reposition, seReubica, onClose } */
function closePopup(devolverFoco) {
  if (!popup) return;
  const p = popup; popup = null;
  p.list.remove(); p.onClose?.();
  if (devolverFoco) p.focusTarget.focus();
}
function abrirLista({ anchor, items, selected, cls, width = false, minWidth, labelledby, onPick }) {
  closePopup(false); closeMenus();
  const list = document.createElement('ul');
  list.className = cls; list.setAttribute('role', 'listbox'); list.tabIndex = -1;
  if (labelledby) list.setAttribute('aria-labelledby', labelledby);
  list.innerHTML = items.map((o, i) => `<li role="option" tabindex="-1" data-i="${i}" aria-selected="${o.v === selected}">${esc(o.label)}</li>`).join('');
  document.getElementById('plz-capas').appendChild(list);
  const colocar = () => {
    const r = anchor.getBoundingClientRect();
    if (width) list.style.width = r.width + 'px';
    if (minWidth) list.style.minWidth = minWidth + 'px';
    const w = list.offsetWidth, h = list.offsetHeight;
    list.style.left = Math.max(8, Math.min(r.left, window.innerWidth - w - 8)) + 'px';
    list.style.top = (r.bottom + 4 + h <= window.innerHeight ? r.bottom + 4 : Math.max(8, r.top - 4 - h)) + 'px';
  };
  colocar();
  anchor.setAttribute('aria-expanded', 'true');
  popup = { anchor, list, focusTarget: anchor, reposition: colocar, onClose: () => anchor.setAttribute('aria-expanded', 'false') };
  (list.querySelector('[aria-selected="true"]') || list.firstElementChild)?.focus({ preventScroll: true });
  const pick = li => { const it = items[+li.dataset.i]; closePopup(true); onPick(it.v); };
  list.addEventListener('click', e => { const li = e.target.closest('[data-i]'); if (li) pick(li); });
  list.addEventListener('keydown', e => {
    const lis = [...list.children]; const i = lis.indexOf(document.activeElement);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); lis[(i + (e.key === 'ArrowDown' ? 1 : -1) + lis.length) % lis.length].focus(); }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (i >= 0) pick(lis[i]); }
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closePopup(true); }
    if (e.key === 'Tab') closePopup(false);
  });
}
document.addEventListener('mousedown', e => { if (popup && !popup.list.contains(e.target) && !popup.anchor.contains(e.target)) closePopup(false); });
window.addEventListener('scroll', e => { if (popup && !popup.list.contains(e.target)) popup.reposition?.(); }, true);
/* con resize las listas se cierran; el menú del ButtonSelect se reubica, como useAnchorRect */
window.addEventListener('resize', () => { if (popup?.seReubica) popup.reposition(); else closePopup(false); });

/* ButtonSelect (DS): menú anclado al Button (ButtonSelectMenu + useButtonSelect + anchoredPanelStyles).
   - Clic en el botón abre o cierra sin mover el foco; abierto, el botón lleva aria-controls y queda presionado.
   - ↓/↑ abren si hace falta y recorren las opciones habilitadas en círculo (desde cerrado, ↓ va a la primera y ↑ a la última).
   - Pasar el mouse por una opción también la enfoca. Enter o clic eligen; Esc cierra y regresa el foco al botón; Tab y clic fuera cierran.
   - El menú mide lo que el botón (mín. 160), va 4 px abajo, o arriba si abajo quedan menos de 200 px y arriba hay más,
     con alto máximo del espacio que queda (mín. 160). Con scroll o resize se reubica. */
let btnSelectSeq = 0;
function montarButtonSelect(trigger, { opciones, onSelect }) {
  const label = trigger.textContent.trim();
  const abierto = () => popup && popup.anchor === trigger;
  const abrir = () => {
    closePopup(false); closeMenus();
    const items = opciones();
    const menu = document.createElement('div');
    menu.className = 'ds-btnselect-menu'; menu.id = `btnselect-${++btnSelectSeq}`;
    menu.setAttribute('role', 'menu'); menu.setAttribute('aria-label', label);
    menu.innerHTML = items.map((o, i) => `<button type="button" role="menuitem" tabindex="-1" data-i="${i}"${o.disabled ? ' aria-disabled="true"' : ''}>${esc(o.label)}</button>`).join('');
    document.getElementById('plz-capas').appendChild(menu);
    const colocar = () => {
      const r = trigger.getBoundingClientRect(), alto = window.innerHeight;
      const abajo = alto - r.bottom, haciaArriba = abajo < 200 && r.top > abajo;
      menu.style.left = r.left + 'px'; menu.style.minWidth = r.width + 'px';   /* al menos el ancho del botón; crece si una opción no cabe ("Número de refrendos") */
      menu.style.top = haciaArriba ? 'auto' : (r.bottom + 4) + 'px';
      menu.style.bottom = haciaArriba ? (alto - r.top + 4) + 'px' : 'auto';
      menu.style.maxHeight = Math.max(160, (haciaArriba ? r.top : abajo) - 8 - 4) + 'px';
    };
    colocar();
    trigger.setAttribute('aria-expanded', 'true'); trigger.setAttribute('aria-controls', menu.id);
    popup = { anchor: trigger, list: menu, focusTarget: trigger, reposition: colocar, seReubica: true,
      onClose: () => { trigger.setAttribute('aria-expanded', 'false'); trigger.removeAttribute('aria-controls'); } };
    const elegir = b => {
      const o = items[+b.dataset.i];
      if (!o || o.disabled) return;
      closePopup(false); onSelect(o.v);
      if (trigger.isConnected) trigger.focus();
    };
    menu.addEventListener('click', e => { const b = e.target.closest('[role="menuitem"]'); if (b) elegir(b); });
    menu.addEventListener('mouseover', e => {
      const b = e.target.closest('[role="menuitem"]');
      if (b && b !== document.activeElement && b.getAttribute('aria-disabled') !== 'true') b.focus();
    });
    menu.addEventListener('keydown', teclas);
  };
  /* foco a la siguiente opción habilitada (nextEnabledIndex de useButtonSelect) */
  const mover = paso => {
    const lis = [...popup.list.querySelectorAll('[role="menuitem"]')];
    const actual = lis.indexOf(document.activeElement);
    const desde = actual === -1 && paso === -1 ? 0 : actual;
    for (let k = 1; k <= lis.length; k++) {
      const b = lis[(desde + paso * k + lis.length * k) % lis.length];
      if (b.getAttribute('aria-disabled') !== 'true') { b.focus(); return; }
    }
  };
  function teclas(e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!abierto()) abrir();
      mover(e.key === 'ArrowDown' ? 1 : -1);
      return;
    }
    if (!abierto()) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closePopup(true); }
    if (e.key === 'Tab') closePopup(false);
  }
  trigger.addEventListener('click', () => { if (abierto()) closePopup(false); else abrir(); });
  trigger.addEventListener('keydown', teclas);
}

/* SelectionInput (DS): botón + listbox. El <select> oculto guarda el valor y emite "change". */
const SELECT_CHEVRON = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 6l4 4 4-4" style="stroke:var(--ats-neutral-500)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function enhanceSelect(sel) {
  if (sel.dataset.enhanced) return;
  sel.dataset.enhanced = '1';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'ds-selectbtn' + (sel.classList.contains('ds-select--table') || sel.closest('.demo-panel') ? ' ds-selectbtn--table' : '');
  btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false');
  let lblId = null;
  if (sel.id) {
    btn.id = sel.id + '-btn';
    const lbl = document.querySelector(`label[for="${sel.id}"]`) || sel.closest('label');
    if (lbl) { if (lbl.htmlFor) lbl.htmlFor = btn.id; lbl.id = lbl.id || sel.id + '-lbl'; lblId = lbl.id; btn.setAttribute('aria-labelledby', `${lbl.id} ${btn.id}`); }
  }
  if (sel.getAttribute('aria-label')) btn.setAttribute('aria-label', sel.getAttribute('aria-label'));
  const sync = () => { btn.innerHTML = `<span class="ds-selectbtn__text">${esc(sel.options[sel.selectedIndex]?.text || '')}</span>${SELECT_CHEVRON}`; };
  sync();
  sel.addEventListener('change', sync);
  sel.hidden = true;
  sel.after(btn);
  const open = () => abrirLista({
    anchor: btn, cls: 'ds-listbox', width: true, labelledby: lblId, selected: sel.value,
    items: [...sel.options].map(o => ({ v: o.value, label: o.text })),
    onPick: v => { sel.value = v; sel.dispatchEvent(new Event('change', { bubbles: true })); },
  });
  btn.addEventListener('click', () => (popup && popup.anchor === btn ? closePopup(true) : open()));
  btn.addEventListener('keydown', e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); open(); } });
}
const enhanceAll = () => document.querySelectorAll('.plz select.ds-select:not([data-enhanced])').forEach(enhanceSelect);
new MutationObserver(enhanceAll).observe(document.body, { childList: true, subtree: true });
enhanceAll();

/* DobleInput (DS) type="select-input": select a la izquierda (con la etiqueta encima) e input a la derecha */
const dobleHTML = ({ id, label, ariaLabel, options, value, inputValue, inputmode = 'numeric' }) => {
  const sel = options.find(o => o.v === value);
  const nombre = label || ariaLabel;
  return `<div class="ds-doble" data-doble="${id}">
    <div class="ds-doble__row">
      <div class="ds-doble__side">
        ${label ? `<span class="ds-doble__label" id="${id}-label">${label}</span>` : ''}
        <div class="ds-doble__box ds-doble__box--left"><button type="button" class="ds-doble__trigger" id="${id}-sel" aria-haspopup="listbox" aria-expanded="false" aria-label="${esc(nombre)}: ${esc(sel ? sel.label : 'Selecciona')}">
          <span class="ds-doble__value">${esc(sel ? sel.label : 'Selecciona')}</span>${icon('ChevronDown', 'ds-doble__chev')}</button></div>
      </div>
      <span class="ds-doble__divider" aria-hidden="true"></span>
      <div class="ds-doble__side">
        <div class="ds-doble__box ds-doble__box--right"><input class="ds-doble__input" id="${id}" value="${esc(inputValue)}" inputmode="${inputmode}" autocomplete="off" aria-label="${esc(nombre)}" aria-describedby="${id}-error"></div>
      </div>
    </div>
    <span class="ds-doble__help" id="${id}-error" role="alert"></span>
  </div>`;
};
function montarDoble(caja, { options, valor, alElegir, alEscribir, sanitizar = sanitizeInteger }) {
  const trig = caja.querySelector('.ds-doble__trigger'), inp = caja.querySelector('.ds-doble__input');
  const nombre = trig.getAttribute('aria-label').split(':')[0];
  const abrir = () => abrirLista({
    anchor: trig, items: options, selected: valor(), cls: 'ds-listbox ds-listbox--doble', minWidth: trig.offsetWidth,
    onPick: v => { const o = options.find(x => x.v === v); trig.querySelector('.ds-doble__value').textContent = o.label; trig.setAttribute('aria-label', `${nombre}: ${o.label}`); alElegir(v); },
  });
  trig.addEventListener('click', () => (popup && popup.anchor === trig ? closePopup(true) : abrir()));
  trig.addEventListener('keydown', e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); abrir(); } });
  inp.addEventListener('input', () => { const v = sanitizar(inp.value); if (v !== inp.value) inp.value = v; alEscribir(v); });
}
/* el error del DobleInput reemplaza a la ayuda: Close 16 + texto en rojo y bordes en rojo */
function pintarErrorDoble(caja, msg) {
  if (!caja) return;
  caja.dataset.error = String(!!msg);
  caja.querySelector('.ds-doble__help').innerHTML = ui.errorText(msg);
  caja.querySelector('.ds-doble__input').setAttribute('aria-invalid', String(!!msg));
}

/* AutoMultiSelect (DS): chips en una sola fila (los que no caben se cuentan en "N+"), se escribe para filtrar
   y la lista lleva casillas. El foco se queda en el campo (aria-activedescendant). */
function montarAMS(caja, { id, label, optional, ariaLabel, options, valor, alCambiar }) {
  caja.innerHTML = `<div class="ds-ams">
    ${label ? `<div class="ds-ams__labelrow"><label class="ds-field__label" for="${id}">${label}</label>${optional ? '<span class="ds-field__optional">(Opcional)</span>' : ''}</div>` : ''}
    <div class="ds-ams__field">
      <div class="ds-ams__chips"><input class="ds-ams__input" id="${id}" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="${id}-list" autocomplete="off" ${label ? '' : `aria-label="${esc(ariaLabel)}"`}></div>
      <span class="ds-ams__chev">${icon('ChevronDown')}</span>
    </div></div>`;
  const raiz = caja.firstElementChild, field = raiz.querySelector('.ds-ams__field'), chips = raiz.querySelector('.ds-ams__chips'), input = chips.querySelector('input');
  let query = '', activo = -1, list = null;
  const filtradas = () => (query ? options.filter(o => o.label.toLowerCase().includes(query.toLowerCase())) : options);
  /* useChipOverflow: cuántos chips caben dejando 40 px para el cursor */
  const ajustar = () => {
    chips.querySelector('.ds-ams__chip--count')?.remove();
    const todos = [...chips.querySelectorAll('.ds-ams__chip')];
    todos.forEach(c => { c.hidden = false; });
    const disponible = chips.clientWidth - 40;
    if (!todos.length || disponible <= 0) return;
    input.insertAdjacentHTML('beforebegin', `<span class="ds-ams__chip ds-ams__chip--count">${todos.length}+</span>`);
    const contador = chips.querySelector('.ds-ams__chip--count');
    const anchos = todos.map(c => c.getBoundingClientRect().width), ancho = contador.getBoundingClientRect().width;
    let usado = 0, caben = todos.length;
    for (let i = 0; i < todos.length; i++) {
      const sig = usado + (i > 0 ? 4 : 0) + anchos[i];
      const necesita = i === todos.length - 1 ? sig : sig + 4 + ancho;
      if (necesita > disponible) { caben = i; break; }
      usado = sig;
    }
    if (caben >= todos.length) { contador.remove(); return; }
    todos.slice(caben).forEach(c => { c.hidden = true; });
    contador.textContent = `${todos.length - caben}+`;
  };
  const pintarChips = () => {
    chips.querySelectorAll('.ds-ams__chip').forEach(c => c.remove());
    const elegidas = options.filter(o => valor().includes(o.v));
    elegidas.forEach(o => input.insertAdjacentHTML('beforebegin', `<span class="ds-ams__chip">${esc(o.label)}</span>`));
    input.placeholder = elegidas.length ? '' : 'Selecciona';
    ajustar();
  };
  const colocar = () => {
    if (!list) return;
    const r = field.getBoundingClientRect();
    list.style.left = r.left + 'px'; list.style.width = r.width + 'px';
    const h = list.offsetHeight;
    list.style.top = (r.bottom + 4 + h <= window.innerHeight ? r.bottom + 4 : Math.max(8, r.top - 4 - h)) + 'px';
  };
  const pintarLista = () => {
    if (!list) return;
    const ops = filtradas(); if (activo >= ops.length) activo = ops.length - 1;
    list.innerHTML = ops.map((o, i) => { const on = valor().includes(o.v); return `<li class="ds-ams-opt${i === activo ? ' is-active' : ''}" role="option" id="${id}-opt-${i}" aria-selected="${on}" data-v="${o.v}">
      <span class="ds-ams-opt__box">${on ? icon('Check') : ''}</span><span class="ds-ams-opt__text"><span class="ds-ams-opt__label">${esc(o.label)}</span>${o.sub ? `<span class="ds-ams-opt__sub">${esc(o.sub)}</span>` : ''}</span></li>`; }).join('');
    if (activo >= 0) { input.setAttribute('aria-activedescendant', `${id}-opt-${activo}`); list.querySelector('.is-active')?.scrollIntoView({ block: 'nearest' }); }
    else input.removeAttribute('aria-activedescendant');
    colocar();
  };
  const abrir = () => {
    if (popup && popup.anchor === raiz) return;
    closePopup(false); closeMenus();
    list = document.createElement('ul');
    list.className = 'ds-ams-list'; list.id = `${id}-list`; list.setAttribute('role', 'listbox'); list.setAttribute('aria-multiselectable', 'true');
    if (label) list.setAttribute('aria-label', label.replace(/<[^>]+>/g, '')); else list.setAttribute('aria-label', ariaLabel);
    document.getElementById('plz-capas').appendChild(list);
    list.addEventListener('mousedown', e => e.preventDefault());
    list.addEventListener('click', e => { const o = e.target.closest('[data-v]'); if (o) alternar(o.dataset.v); });
    input.setAttribute('aria-expanded', 'true'); field.classList.add('is-open');
    popup = { anchor: raiz, list, focusTarget: input, reposition: colocar, onClose: () => {
      list = null; query = ''; input.value = ''; activo = -1;
      input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); field.classList.remove('is-open');
    } };
    pintarLista();
  };
  const alternar = v => { const cur = valor(); alCambiar(cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v]); pintarChips(); pintarLista(); };
  field.addEventListener('mousedown', e => { if (e.target !== input) e.preventDefault(); input.focus(); abrir(); });
  input.addEventListener('focus', abrir);
  input.addEventListener('input', () => { query = input.value; activo = -1; abrir(); pintarLista(); });
  input.addEventListener('keydown', e => {
    const abierto = popup && popup.anchor === raiz, ops = filtradas();
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault(); if (!abierto) abrir(); if (!ops.length) return;
      activo = activo < 0 ? (e.key === 'ArrowDown' ? 0 : ops.length - 1) : (activo + (e.key === 'ArrowDown' ? 1 : -1) + ops.length) % ops.length;
      pintarLista();
    } else if ((e.key === 'Enter' || (e.key === ' ' && !query)) && abierto) {
      e.preventDefault(); if (activo >= 0 && ops[activo]) alternar(ops[activo].v);
    } else if (e.key === 'Escape' && abierto) { e.preventDefault(); e.stopPropagation(); closePopup(false); }
    else if (e.key === 'Tab') closePopup(false);
  });
  pintarChips();
  if (typeof ResizeObserver !== 'undefined') { const ro = new ResizeObserver(ajustar); ro.observe(chips); cleanup.push(() => ro.disconnect()); }
}

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
  const left = Math.min(Math.max(8, r.left + r.width / 2 - t.width / 2), window.innerWidth - t.width - 8);
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
   #/plazos · #/plazos/nuevo[?sugerencia=901] · #/plazos/:id · #/plazos/:id/editar  (ids numéricos)
   ========================================================================== */
let cleanup = [];
/* En React el listado se vuelve a montar al regresar del detalle o del formulario: pestaña, nodo, filtro,
   búsqueda y panel vuelven a como se abre. Si la ruta no cambia ("Intenta nuevamente"), la selección se conserva. */
let rutaPrevia = null;
/* foco de regreso del detalle (L-16): viaja en memoria, no en la URL */
let focoAlVolver = null;
function route() {
  cleanup.forEach(fn => fn()); cleanup = [];
  closeModal({ sinAviso: true }); closePopup(false); hideTip();
  vista = {};
  const [path] = (currentHash.replace(/^#/, '') || '/plazos').split('?');
  const params = new URLSearchParams(currentHash.split('?')[1] || '');
  const parts = path.split('/').filter(Boolean);
  const main = document.getElementById('main');
  window.scrollTo(0, 0);
  if (parts[0] !== 'plazos') { go('#/plazos'); return; }
  const previa = rutaPrevia; rutaPrevia = path;
  if (parts.length !== 1) focoAlVolver = null;
  if (parts.length === 1 && previa !== null && previa !== path) { Object.assign(listState, listStateInicial()); busq.activo = 0; }
  if (parts.length === 1) renderList(main);
  else if (parts[1] === 'nuevo') renderForm(main, { sugerencia: Number(params.get('sugerencia')) || null });
  else if (parts[2] === 'editar') renderForm(main, { id: Number(parts[1]) });
  else renderDetail(main, Number(parts[1]));
  /* si la pantalla ya le dio el foco a algo (la fila de regreso), se respeta; si no, al <main> */
  const activo = document.activeElement;
  if (!(activo && activo !== main && main.contains(activo))) main.focus({ preventScroll: true });
}
/* La ruta vive en memoria y se refleja en la URL cuando el navegador lo permite
   (así funciona también abierto como archivo adjunto o en un visor). */
let currentHash = location.hash && location.hash.startsWith('#/') ? location.hash : '#/plazos';
const setUrl = (h, replace) => { try { history[replace ? 'replaceState' : 'pushState'](null, '', h); } catch (err) { /* visor sin historial */ } };
const go = (h, replace = false) => { currentHash = h; setUrl(h, replace); route(); };
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
        /* cualquier estado distinto de Vigente se activa; el resultado es Vigente o Inactivo */
        const status = setStatus(p.id, activar);
        /* primero repintar y luego cerrar: así closeModal encuentra el ⋮ nuevo y le regresa el foco */
        after(status);
        closeModal();
        showToast({ title: 'Cambio exitoso al estado del plazo', message: activar ? 'Plazo activado' : 'Plazo desactivado' });
      },
      fail: () => { closeModal(); showToast({ type: 'error', title: 'Error', message: 'No se pudo cambiar el estado del plazo. Intenta de nuevo.' }); },
    }),
  });
}
/* Duplicar (service.duplicate): sin confirmación ni indicador; al momento, "{nombre} (copia)" como Borrador,
   con el siguiente id y al inicio de la lista. La vista no cambia. */
function duplicar(p, alTerminar) {
  (() => {
    if (demo.action === 'error') { showToast({ type: 'error', title: 'Error', message: 'No se pudo duplicar el plazo. Intenta de nuevo.' }); return; }
    const base = db.plazos.find(x => x.id === p.id) || p;
    sequence += 1;
    upsert({ ...clone(base), id: sequence, name: `${base.name} (copia)`, status: 'Borrador' });
    showToast({ title: 'Cambio exitoso al estado del plazo', message: 'Plazo duplicado' });
    alTerminar?.();
  })();
}
/* Menú ⋮ de cada fila (InstallmentTableRow): el borrador solo se edita; Vigente → Desactivar, cualquier otro estado → Activar */
const accionesPorEstado = p => {
  if (p.status === 'Borrador') return [{ action: 'editar', label: 'Editar', icon: 'Edit' }];
  return [
    { action: 'ver', label: 'Ver detalle', icon: 'Preview' },
    { action: 'editar', label: 'Editar', icon: 'Edit' },
    { action: 'duplicar', label: 'Duplicar', icon: 'ContentCopy' },
    p.status === 'Vigente' ? { action: 'desactivar', label: 'Desactivar', icon: 'Power' } : { action: 'activar', label: 'Activar', icon: 'Power' },
  ];
};

/* ==========================================================================
   LISTADO (commit 0c4d4b518, con los datos y el filtrado de la vista previa d9539b65b): una card con el
   árbol y la tabla del DS, un solo chip "Filtros" y la card de sugeridos. El filtrado es local e inmediato.
   ========================================================================== */
const listStateInicial = () => ({
  tab: 'sucursales', node: { sucursales: RAIZ_UBICACIONES, categorias: null }, expanded: new Set(), search: '',
  filtro: { cat: null, opt: null }, page: 1, total: -1, collapsed: false,
});
const listState = listStateInicial();
const PAGE = 8;

/* Filtros del chip (FILTER_TYPES de su constants.ts). Valores estables; los rangos incluyen los extremos. */
const enRango = (n, v) => { const [a, b] = v.split('-').map(Number); return n >= a && n <= b; };
const FILTROS = [
  { key: 'state', label: 'Estado', test: (p, v) => p.status === { 1: 'Vigente', 2: 'Inactivo', 3: 'Programado', 4: 'Borrador' }[v],
    opciones: [{ v: '1', label: 'Vigente' }, { v: '2', label: 'Inactivo' }, { v: '3', label: 'Programado' }, { v: '4', label: 'Borrador' }] },
  { key: 'minAmount', label: 'Rango de préstamo', test: (p, v) => enRango(p.minAmount ?? 0, v),
    opciones: [{ v: '0-999', label: 'Menos de $1,000' }, { v: '1000-10000', label: '$1,000 - $10,000' }, { v: '10001-1000000000000000', label: 'Más de $10,000' }] },
  { key: 'interestType', label: 'Tipo de interés', test: (p, v) => p.rateType === (v === '1' ? 'fixed' : 'dynamic'),
    opciones: [{ v: '1', label: 'Fijo' }, { v: '2', label: 'Dinámico' }] },
  /* la API manda la duración en días; aquí semanas = 7 días y meses = 30 */
  { key: 'duration', label: 'Duración', test: (p, v) => enRango(getDurationDays(p.duration, p.durationUnit), v),
    opciones: [{ v: '0-30', label: 'Menos de 30 días' }, { v: '45-60', label: '45 - 60 días' }, { v: '90-1000000000000000', label: 'Más de 90 días' }] },
];
const filtroCat = () => FILTROS.find(c => c.key === listState.filtro.cat) || null;
const filtroOpt = () => { const c = filtroCat(); return (c && c.opciones.find(o => o.v === listState.filtro.opt)) || null; };

function renderList(main) {
  main.innerHTML = `<div class="page">
    ${ui.breadcrumb([{ label: 'Plazos' }])}
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
  const ws = main.querySelector('#workspace'), sug = main.querySelector('#sugeridos');
  busq.foco = false; busq.cerrada = false;
  renderWorkspace(ws);
  renderSugeridos(sug);
  /* al terminar la carga se pintan el árbol, la tabla y los sugeridos (sin tocar el buscador) */
  vista = { alCargar: () => { if (!document.contains(ws)) return; pintarArbol(ws); renderBody(ws); renderSugeridos(sug); } };
}

/* ---- Árbol (Ubicaciones / Catálogo) · Tree del DS: sin raíz artificial y todo plegado ---- */
function treeHTML() {
  const kind = listState.tab, sel = listState.node[kind];
  const nombre = kind === 'sucursales' ? 'Ubicaciones' : 'Catálogo';
  /* los árboles llegan en la misma carga que los plazos: mientras carga o con error, el árbol va sin nodos */
  if (store.carga !== 'listo') return `<ul class="ds-tree" role="tree" aria-label="${nombre}"></ul>`;
  const roots = ARBOL[kind];
  /* tabindex itinerante: el nodo elegido si se ve; si no, el primero (en Catálogo no hay selección de inicio) */
  const visible = id => {
    let n = nodoDe(kind, id);
    while (n && n.parent) { if (!listState.expanded.has(n.parent)) return false; n = nodoDe(kind, n.parent); }
    return !!n;
  };
  const enfocable = sel && visible(sel) ? sel : roots[0].id;
  const nodeRow = (n, depth) => {
    const isSel = sel === n.id, hasKids = !!n.children, open = listState.expanded.has(n.id);
    const pad = [8, 38, 58, 78][depth] ?? 78;
    return `<li role="none"><div class="ds-tree__node" role="treeitem" tabindex="${n.id === enfocable ? 0 : -1}" aria-selected="${isSel}" ${hasKids ? `aria-expanded="${open}"` : ''} data-node="${n.id}" style="padding-left:${pad}px">
      ${hasKids ? `<button type="button" class="ds-tree__toggle" tabindex="-1" aria-label="${open ? 'Contraer' : 'Expandir'} ${esc(n.label)}" aria-expanded="${open}" data-toggle="${n.id}">${icon('ChevronDown')}</button>` : '<span class="ds-tree__spacer"></span>'}
      <span class="ds-tree__label"><span class="ds-tree__title">${esc(n.label)}</span><span class="ds-tree__meta">${subDe(kind, depth)}</span></span>
    </div>${hasKids && open ? `<ul role="group" class="ds-tree">${n.children.map(c => nodeRow(c, depth + 1)).join('')}</ul>` : ''}</li>`;
  };
  return `<ul class="ds-tree" role="tree" aria-label="${nombre}">${roots.map(n => nodeRow(n, 0)).join('')}</ul>`;
}
const pintarArbol = ws => { const t = ws.querySelector('#tree'); if (t) t.innerHTML = treeHTML(); paintSearch(ws); };

/* ListCard: árbol y tabla en una sola card. */
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

/* Panel del árbol (AllInstallmentsSidebar): siempre arranca abierto; plegarlo o desplegarlo no toca la tabla.
   Plegarlo desmonta el buscador y el Tree: al reabrirlo, el buscador sale vacío y el árbol todo plegado. */
function renderTreePanel(ws) {
  const panel = ws.querySelector('#tree-panel');
  ws.classList.toggle('is-collapsed', listState.collapsed);
  if (listState.collapsed) {
    panel.innerHTML = `<div class="tree-panel__rail">${ui.btn('Abrir panel', { variant: 'tertiary', iconLeft: 'PanelCollapse', attrs: 'data-open aria-expanded="false"' })}</div>`;
    panel.querySelector('[data-open]').addEventListener('click', () => {
      listState.collapsed = false; listState.search = ''; listState.expanded = new Set(); busq.activo = 0; busq.cerrada = false;
      renderTreePanel(ws); ws.querySelector('[data-collapse]').focus();
    });
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

/* Cambiar de pestaña reinicia la selección (changeSegment). En Ubicaciones vuelve a quedar elegida la raíz;
   en Catálogo no se elige nada. El texto del buscador y el filtro se conservan. Sin recarga: la tabla se pinta ya. */
function cambiarPestana(ws, kind, { autoSeleccion = true } = {}) {
  listState.tab = kind; listState.node = { sucursales: null, categorias: null };
  listState.expanded = new Set(); listState.page = 1;
  if (kind === 'sucursales' && autoSeleccion) listState.node.sucursales = RAIZ_UBICACIONES;
  renderTreePanel(ws);
  if (autoSeleccion) renderBody(ws);
}
function selectNode(ws, id, { foco = true } = {}) {
  listState.node[listState.tab] = id; listState.page = 1;
  const tree = ws.querySelector('#tree');
  if (tree) { tree.innerHTML = treeHTML(); if (foco) tree.querySelector(`[data-node="${id}"]`)?.focus(); }
  renderBody(ws);
}

/* ---- Buscador del panel (PreviewLocationSearch · SearchFieldV2 con autocompletado) ----
   Un solo combobox para las dos pestañas. Con 3 o más caracteres muestra resultados o el vacío al instante.
   Primero ubicaciones (padre antes que hijos) y luego categorías; la descripción es la ruta con " › ". */
const busq = { foco: false, cerrada: false, activo: 0 };
const rutaDe = (kind, n) => {
  const out = []; let pid = n.parent;
  while (pid) { const pn = nodoDe(kind, pid); out.unshift(pn.label); pid = pn.parent; }
  return out.join(' › ');
};
function resultadosBusqueda(q) {
  const t = q.trim().toLowerCase();
  if (!t) return [];
  return ['sucursales', 'categorias'].flatMap(kind => FLAT[kind].filter(n => n.label.toLowerCase().includes(t)).map(n => ({ id: n.id, kind, label: n.label, desc: rutaDe(kind, n) })));
}
function estadoBusqueda() {
  if (listState.search.trim().length < 3) return { status: 'idle', opciones: [] };
  /* sin árboles (cargando o con error) no hay nada que encontrar */
  const opciones = store.carga === 'listo' ? resultadosBusqueda(listState.search) : [];
  return { status: opciones.length ? 'results' : 'empty', opciones };
}
const resaltar = (label, q) => {
  const t = q.trim().toLowerCase(), i = t ? label.toLowerCase().indexOf(t) : -1;
  if (i < 0) return esc(label);
  return `${esc(label.slice(0, i))}<strong>${esc(label.slice(i, i + t.length))}</strong>${esc(label.slice(i + t.length))}`;
};
const VACIO_BUSQUEDA = `<div class="ds-search__empty" role="status">${icon('WarningFilled')}<span><strong>No encontramos resultados para tu búsqueda</strong><span>Revisa la ortografía, intenta otra palabra</span></span></div>`;
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
  list.innerHTML = status === 'empty' ? VACIO_BUSQUEDA
    : opciones.map((o, i) => `<button type="button" class="ds-search__opt" role="option" id="tree-q-opt-${i}" tabindex="-1" aria-selected="${i === busq.activo}" data-opt="${i}"><span class="ds-search__opt-label">${resaltar(o.label, listState.search)}</span>${o.desc ? `<span class="ds-search__opt-desc">${esc(o.desc)}</span>` : ''}</button>`).join('');
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
  input.addEventListener('input', () => { listState.search = input.value; busq.cerrada = false; busq.activo = 0; paintSearch(ws); });
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
    if (btn.classList.contains('ds-search__btn--clear')) { listState.search = ''; input.value = ''; }
    input.focus();
  });
}
/* Al elegir: el campo se queda con el nombre y pierde el foco (SearchFieldV2); si hace falta cambia de pestaña
   y elige el nodo, sin recarga */
function elegirBusqueda(ws, o) {
  if (!o) return;
  listState.search = o.label; busq.activo = 0;
  const input = ws.querySelector('#tree-q');
  input.value = o.label; busq.foco = false; input.blur();
  if (listState.tab !== o.kind) cambiarPestana(ws, o.kind, { autoSeleccion: false });
  else paintSearch(ws);
  selectNode(ws, o.id, { foco: false });
}

/* ---- Tabla -------------------------------------------------------------- */
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

/* Celdas de la fila (InstallmentTableRow + toInstallmentItem) */
/* getSegmentationText: en Ubicaciones cuenta artículos (hojas de categoría); en Catálogo, sucursales (hojas) */
const segmentacionTxt = p => {
  if (listState.tab === 'sucursales') { const n = countCategories(p); return `${n} ${n === 1 ? 'Artículo' : 'Artículos'}`; }
  const n = countBranches(p); return `${n} ${n === 1 ? 'Sucursal' : 'Sucursales'}`;
};
/* la API manda un solo número de interés: la tasa fija o la menor de los rangos */
const interesTxt = p => `${RATE_TYPE_LABELS[p.rateType]} ${getBaseRate(p)}%`;
const adicionalesTrigger = adic => {
  if (!adic.length) return '';
  const contenido = `<span class="tip-title">Interés adicional</span><span class="tip-list">${adic.map(a => `<span class="tip-item"><span class="tip-item__name">${esc(a.name)}</span><span>${a.collect === 'during' ? 'Durante el periodo' : 'Después del periodo'}</span><span>${pct(toNumber(a.rate))}</span></span>`).join('')}</span>`;
  return `<span class="adic-trigger" tabindex="0" data-tip="${esc(contenido)}" data-tip-pos="bottom" data-tip-size="large">+ ${adic.length} ${adic.length === 1 ? 'adicional' : 'adicionales'}</span>`;
};
/* InstallmentStateBadge: Vigente con fin → "Expira"; Programado → "Inicia" */
const estadoCelda = p => {
  const f = p.status === 'Vigente' && p.endDate ? `Expira ${p.endDate}` : p.status === 'Programado' && p.startDate ? `Inicia ${p.startDate}` : '';
  return `<span class="cell-stack">${ui.chip(p.status)}${f ? `<span class="t-caption">${f}</span>` : ''}</span>`;
};
const filaPlazo = p => `<tr class="is-clickable" tabindex="0" data-row="${p.id}" aria-label="${p.status === 'Borrador' ? 'Editar' : 'Ver detalle de'} ${esc(p.name)}">
    <th scope="row">${esc(p.name)}</th>
    <td>${segmentacionTxt(p)}</td>
    <td class="cell-text-desc"><p><span class="cell-stack"><span>${interesTxt(p)}</span>${adicionalesTrigger(p.additionalInterests)}</span></p></td>
    <td>${estadoCelda(p)}</td>
    <td class="cell-iconbtn">${ui.menu(`m-${p.id}`, `Más acciones de ${p.name}`, accionesPorEstado(p).map(a => ({ ...a, data: `data-id="${p.id}"` })))}</td>
  </tr>`;
/* vacío de la tabla (AllInstallmentsEmptyState): ilustración, texto y un botón */
const vacioTabla = (msg, accion) => `<div class="empty-state" role="status"><img src="ilust-01-empty.svg" alt="" height="150" style="width:auto"><p class="t-caption">${msg}</p>${accion || ''}</div>`;
const filasCarga = (n, cols) => Array.from({ length: n }, () => `<tr>${'<td class="cell-loading"><div class="skeleton"></div></td>'.repeat(cols)}</tr>`).join('');
const abrirFila = id => { const p = getPlazo(id); if (p) go(p.status === 'Borrador' ? `#/plazos/${id}/editar` : `#/plazos/${id}`); };

/* Cuerpo (TableArea). Orden: cargando → error → el nodo tiene plazos pero el filtro no deja ninguno →
   sin nodo y con plazos (solo encabezados) → sin plazos. hasSelection = hay nodo O no hay ningún plazo. */
function renderBody(ws) {
  const body = ws.querySelector('#plazos-body'); if (!body) return;
  const kind = listState.tab, node = listState.node[kind];
  const deNodo = store.carga === 'listo' ? filterPlazosByNode(store.plazos, kind, node) : [];
  const cat = filtroCat(), opt = filtroOpt();
  const rows = opt ? deNodo.filter(p => cat.test(p, opt.v)) : deNodo;
  /* cuando cambia el total, la página vuelve a 1 (o a la del plazo que recibe el foco al volver del detalle) */
  if (rows.length !== listState.total) {
    listState.total = rows.length;
    const k = focoAlVolver != null ? rows.findIndex(p => p.id === focoAlVolver) : -1;
    listState.page = k < 0 ? 1 : Math.floor(k / PAGE) + 1;
  }
  const celdaVacia = html => `<tr><td class="cell-empty" colspan="5">${html}</td></tr>`;
  let filas = '', pages = 0;
  if (store.carga === 'cargando') filas = filasCarga(PAGE, 5);
  else if (store.carga === 'error') filas = celdaVacia(ui.alert('error', { title: 'No pudimos cargar los plazos', action: ui.btn('Intenta nuevamente', { variant: 'tertiary', attrs: 'data-retry' }) }));
  else if (deNodo.length && !rows.length) filas = celdaVacia(vacioTabla('No hay plazos con estos filtros', ui.btn('Limpiar filtros', { variant: 'secondary', attrs: 'data-clear-all' })));
  else if (!rows.length && !node && store.plazos.length) filas = '';
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
  /* L-16: al volver del detalle por su breadcrumb, el foco va a la fila de ese plazo (una sola vez) */
  if (focoAlVolver != null && store.carga === 'listo') {
    const tr = body.querySelector(`tr[data-row="${focoAlVolver}"]`);
    focoAlVolver = null;
    tr?.focus();
  }

  body.onclick = e => {
    const pg = e.target.closest('[data-page]');
    if (pg && !pg.disabled) { listState.page = +pg.dataset.page; renderBody(ws); ws.querySelector('#plazos-title').scrollIntoView({ block: 'nearest' }); return; }
    if (e.target.closest('[data-retry]')) { cargarTodo(); return; }
    if (e.target.closest('[data-clear-all]')) { limpiarFiltro(ws); return; }
    const goBtn = e.target.closest('[data-go]');
    if (goBtn) { go(goBtn.dataset.go); return; }
    const act = e.target.closest('[data-action]');
    if (act) {
      e.stopPropagation();
      /* cerrar, devolver el foco al ⋮ y luego ejecutar la acción */
      const trigger = act.closest('.menu-wrap')?.querySelector('[data-menu-trigger]');
      closeMenus(); trigger?.focus();
      return runAction(act.dataset.action, getPlazo(Number(act.dataset.id)), ws);
    }
    if (e.target.closest('button, a, [data-tip], [role="menu"]')) return;
    const row = e.target.closest('[data-row]');
    if (row) abrirFila(Number(row.dataset.row));
  };
  body.onkeydown = e => {
    const row = e.target.closest('[data-row]');
    if (row && e.target === row && e.key === 'Enter') { e.preventDefault(); abrirFila(Number(row.dataset.row)); }
  };
}
function runAction(action, p, ws) {
  if (!p) return;
  if (action === 'editar') go(`#/plazos/${p.id}/editar`);
  if (action === 'ver') go(`#/plazos/${p.id}`);
  /* el usuario se queda en el listado: página 1 (cambió el total) */
  if (action === 'duplicar') duplicar(p, () => { if (document.contains(ws)) { listState.page = 1; renderBody(ws); } });
  if (action === 'activar' || action === 'desactivar') confirmEstado(p, action === 'activar', () => renderBody(ws));
}

/* ---- Plazos sugeridos (PreviewInstallmentsSuggestions + SuggestionTermRow real) ----- */
/* Igual que la fila de React: "+ 1 adicional" fijo y la segmentación con numberOfBranches como "artículos" (hallazgo L-01) */
const MAP_PERIOD_ID = { 0: ['día', 'días'], 1: ['semana', 'semanas'], 2: ['mes', 'meses'] };
const mxn = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const sugInteresTxt = s => `${s.typeRateTermId === 2 ? 'Dinámico' : 'Fijo'} ${s.rateFixTerm ?? ''} + 1 adicional`;
const sugRangoTxt = s => `${mxn.format(s.loanMinimum)} - ${mxn.format(s.loanMaximum ?? 0)}`;
const sugDuracionTxt = s => `${s.duration} ${(MAP_PERIOD_ID[s.frequencyPeriodId] || ['', ''])[s.duration === 1 ? 0 : 1]}`;
const sugSegTxt = s => `${s.numberOfBranches} ${s.numberOfBranches === 1 ? 'artículo' : 'artículos'}`;
function renderSugeridos(box) {
  /* llegan en la misma carga que los plazos: cargando → 4 filas con shimmer; error o sin sugerencias → vacío */
  const filas = store.carga === 'cargando' ? filasCarga(4, 6)
    : store.carga === 'error' || !store.sugerencias.length
      ? `<tr><td class="cell-empty" colspan="6"><div class="empty-state" role="status"><img src="ilust-01-empty.svg" alt="" height="150" style="width:auto"><p class="t-texto-bold">No hay más sugerencias por ahora</p><p class="t-caption">Has activado los plazos recomendados para tu operación actual. Ataskate sigue analizando tendencias para ofrecerte nuevas configuraciones optimizadas próximamente.</p></div></td></tr>`
      : store.sugerencias.map(s => `<tr>
        <td>${esc(s.nameTermSuggested ?? '')}</td>
        <td>${esc(sugInteresTxt(s))}</td>
        <td>${sugRangoTxt(s)}</td>
        <td>${sugDuracionTxt(s)}</td>
        <td>${sugSegTxt(s)}</td>
        <td>${ui.btn('Personalizar', { variant: 'secondary', iconLeft: 'Edit', attrs: `data-sug="${s.suggestedTermId}" aria-label="Personalizar ${esc(s.nameTermSuggested ?? '')}"` })}</td>
      </tr>`).join('');
  box.innerHTML = `<div class="sug-head"><h2 class="t-titulos" id="sug-title">Plazos sugeridos</h2>
      <p class="t-texto" style="color:var(--text-captions)">Ataskate te sugiere plazos optimizados según tus productos y comportamiento de préstamo.</p></div>
    <div class="table-frame"><div class="table-wrap" role="region" aria-labelledby="sug-title" tabindex="0"><table class="ds-table">
      <thead><tr><th scope="col">Nombre sugerido</th><th scope="col">Interés</th><th scope="col">Rango préstamo</th><th scope="col">Duración</th><th scope="col">Segmentación</th><th scope="col">Acción</th></tr></thead>
      <tbody id="sug-rows">${filas}</tbody>
    </table></div></div>
    ${ui.note('[Por confirmar] En React el “+ 1 adicional” es fijo y la segmentación cuenta sucursales pero dice “artículos” (hallazgo L-01); aquí se copia igual que la vista previa de el equipo.')}`;
  bindScrollShadows(box.querySelector('.table-frame'));
  box.onclick = e => { const b = e.target.closest('[data-sug]'); if (b) go(`#/plazos/nuevo?sugerencia=${b.dataset.sug}`); };
}

/* ==========================================================================
   DETALLE (PreviewInstallmentDetail · patrón CompanyDetail de AccessCodes, sin pestañas):
   encabezado con título, chip y acciones; cards en 2 columnas. Cada vez que se abre hace un get (sin latencia simulada).
   ========================================================================== */
/* Card del detalle (PreviewDetailCard): región con su h2, un hr y el contenido o la caja de carga */
const tarjetaDetalle = (id, titulo, contenido, cargando) => `<section class="card dcard" aria-labelledby="${id}-title" aria-busy="${cargando}">
    <div class="dcard__head"><div id="${id}-title"><h2 class="t-subtitulos">${titulo}</h2></div></div>
    <hr class="divider">
    ${cargando ? '<div class="loading-box"><span class="ds-spinner"></span><p class="t-caption">Cargando plazo</p></div>' : contenido}
  </section>`;
/* Campo de solo lectura (PreviewViewField): caption + valor; vacío → "Sin registrar"; si lleva chips, van en lugar del valor */
const campoVista = (label, value, contenido) => `<div class="view-field"><span class="t-caption">${esc(label)}</span>${contenido
  ?? `<span class="view-field__value">${esc(String(value ?? '').trim() ? value : 'Sin registrar')}</span>`}</div>`;
const campoChips = (label, valores) => campoVista(label, '', valores.length ? `<div class="chip-row">${valores.map(v => ui.chipInfo(v, 'gray')).join('')}</div>` : undefined);
/* Tabla de amortización del detalle (variant "summary"): Fecha · Pago · Saldo; la última fila es el desempeño */
const tablaResumen = (p, monto) => {
  const filas = buildAmortization(p, monto ?? 0);
  return ui.tabla('Tabla de amortización', ['Fecha', 'Pago', 'Saldo'], filas.map((r, i) => {
    const ultima = i === filas.length - 1;
    return [r.date, formatCurrency(ultima ? r.payoff : r.renewal), formatCurrency(ultima ? 0 : r.amount)];
  }));
};
/* Segmentación: solo las hojas asignadas, en el orden del árbol, con su padre directo; se ven 5 y "Ver todas (N)" */
const VISIBLE_ITEMS = 5;
const bloqueSegmento = (id, titulo, filas) => `<div class="seg-group" data-seg="${id}" data-total="${filas.length}">
    <div class="seg-heading"><h3 class="t-texto-bold">${titulo}</h3>${ui.chipInfo(String(filas.length), 'blue')}</div>
    ${filas.length ? `<ul class="seg-list" id="${id}-list" aria-label="${titulo}">${filas.map((r, i) => `<li class="seg-item"${i >= VISIBLE_ITEMS ? ' data-extra hidden' : ''}>
        <div class="trunc"><span class="trunc__text">${esc(r.name)}</span></div><span class="t-caption">${esc(r.parentName)}</span></li>`).join('')}</ul>`
      : '<p class="t-texto">Sin elementos asignados</p>'}
    ${filas.length > VISIBLE_ITEMS ? ui.btn(`Ver todas (${filas.length})`, { variant: 'tertiary', attrs: `aria-expanded="false" aria-controls="${id}-list" data-ver-todas` }) : ''}
  </div>`;
/* Nombres truncados (PreviewTruncatedName): si de verdad se cortan, el envoltorio es enfocable y lleva tooltip */
function vigilarTruncados(caja) {
  const envolturas = [...caja.querySelectorAll('.trunc')];
  const revisar = w => {
    const t = w.firstElementChild;
    if (t.scrollWidth > t.clientWidth) { w.tabIndex = 0; w.setAttribute('data-tip', esc(t.textContent)); }
    else { w.removeAttribute('tabindex'); w.removeAttribute('data-tip'); }
  };
  envolturas.forEach(revisar);
  if (typeof ResizeObserver === 'undefined') return;
  const ro = new ResizeObserver(entries => entries.forEach(en => revisar(en.target.parentElement)));
  envolturas.forEach(w => ro.observe(w.firstElementChild));
  cleanup.push(() => ro.disconnect());
}
/* ⋮ del detalle (PreviewDetailActions): Duplicar siempre; Desactivar si es Vigente; Activar si es Programado o Inactivo */
const accionesDetalle = p => {
  const items = [{ action: 'duplicar', label: 'Duplicar', icon: 'ContentCopy' }];
  if (p.status === 'Vigente') items.push({ action: 'desactivar', label: 'Desactivar', icon: 'Power' });
  else if (p.status !== 'Borrador') items.push({ action: 'activar', label: 'Activar', icon: 'Power' });
  return items;
};

function renderDetail(main, id) {
  const st = { fetched: null, loading: true, error: false, monto: PLAZOS_SIMULATION_DEFAULT_AMOUNT };
  const actual = () => getPlazo(id) || st.fetched;
  main.innerHTML = `<div class="page">${ui.breadcrumb([])}<div class="title-row"></div><div id="detalle"></div></div>`;
  const page = main.querySelector('.page'), cuerpo = page.querySelector('#detalle');

  /* breadcrumb "… › Plazos › {nombre}", h1 + chip y acciones. Sin plazo en memoria: "Cargando plazo" y sin chip */
  function pintarEncabezado() {
    const p = actual(), titulo = p ? p.name : 'Cargando plazo';
    page.querySelector('.ds-breadcrumb').outerHTML = ui.breadcrumb([
      { label: 'Plazos', href: '#/plazos', attrs: 'data-volver' }, { label: titulo },
    ]);
    const acciones = p && !st.loading
      ? `<div class="title-row__actions">${ui.btn('Editar plazo', { variant: 'secondary', iconLeft: 'Edit', attrs: 'data-action="editar"' })}${ui.menu('m-detail', `Más acciones de ${p.name}`, accionesDetalle(p))}</div>` : '';
    page.querySelector('.title-row').outerHTML = `<div class="title-row"><div class="title-row__heading"><h1 class="t-titulo-pagina">${esc(titulo)}</h1>${p ? ui.chip(p.status) : ''}</div>${acciones}</div>`;
    const chipResumen = page.querySelector('[data-chip-resumen]');
    if (chipResumen && p) chipResumen.innerHTML = ui.chip(p.status);
  }

  function pintarCuerpo() {
    const p = actual(), L = st.loading;
    if (st.error) {
      cuerpo.innerHTML = ui.alert('error', { title: 'No pudimos cargar el plazo', action: ui.btn('Intenta nuevamente', { variant: 'tertiary', attrs: 'data-retry' }) });
      return;
    }
    /* id inexistente: el aviso de "no encontrado" (en la maqueta sí se llega por URL) */
    if (!L && !p) { cuerpo.innerHTML = ui.alert('warning', { title: 'No encontramos este plazo.' }); return; }
    const resumen = L ? '' : `<div class="fields-grid">
        ${campoVista('Estado', '', `<span data-chip-resumen>${ui.chip(p.status)}</span>`)}
        ${campoVista('Vigencia', getValidity(p))}
        ${campoVista('Interés base', formatRate(p))}
        ${campoVista('Monto del préstamo', formatAmountRange(p.minAmount, p.maxAmount))}
        ${campoVista('Duración', formatDuration(p.duration, p.durationUnit))}
        ${campoVista('Refrendos', getRenewalsLabel(p))}
        ${campoVista('Prorrateo diario', p.proration ? 'Aplica' : 'No aplica')}
      </div>`;
    const condiciones = L ? '' : `<div class="stack-8">
        <div class="fields-grid">${campoVista('Tipo de tasa', RATE_TYPE_LABELS[p.rateType])}${p.rateType === 'fixed' ? campoVista('Tasa de interés', formatPercent(p.rate)) : ''}</div>
        ${p.rateType === 'dynamic' ? `<h3 class="t-texto-bold">Rangos de la tasa dinámica</h3>
          ${ui.tabla('Rangos de la tasa dinámica', ['% Préstamo sobre avalúo', 'Hasta %', 'Interés'], p.ranges.map(r => [formatPercent(r.from), formatPercent(r.to), formatPercent(r.rate)]))}` : ''}
      </div>`;
    const adicionales = L ? '' : p.additionalInterests.length
      ? ui.tabla('Intereses adicionales', ['Nombre', 'Cuándo se cobra', 'Tasa', 'Se refleja en contrato'],
        p.additionalInterests.map(a => [a.name, optionLabel(a.collect, COLLECT_OPTIONS), formatPercent(a.rate), a.showContract ? 'Sí' : 'No']))
      : '<p class="t-texto">Sin intereses adicionales</p>';
    const cliente = L ? '' : !p.targetEnabled ? '<p class="t-texto">Disponible para cualquier cliente</p>' : `<div class="stack-8">
        ${campoChips('Sexo', optionLabels(p.sex, SEX_OPTIONS))}
        ${campoChips('Estado civil', optionLabels(p.civilStatus, CIVIL_STATUS_OPTIONS))}
        ${campoChips('Score de cliente', optionLabels(p.score, SCORE_OPTIONS))}
        ${campoVista('Rango de edad', getAgeLabel(p))}
      </div>`;
    const refi = L ? '' : !p.refinancingEnabled ? '<p class="t-texto">Sin reglas de refinanciamiento automático</p>'
      : `<div class="stack-8">${p.refinancingConditions.map(c => campoVista(condicionMeta(c.type).label, getConditionValue(c))).join('')}</div>`;
    /* los árboles son constantes en la maqueta: la segmentación sale aunque la carga del listado haya fallado */
    const segmentacion = L ? '' : `<div class="seg-columns">
        ${bloqueSegmento('plazo-sucursales', 'Sucursales', getLeafRows('sucursales').filter(r => p.branchIds.includes(r.id)))}
        ${bloqueSegmento('plazo-categorias', 'Categorías', getLeafRows('categorias').filter(r => p.categoryIds.includes(r.id)))}
      </div>`;
    const simulacion = L ? '' : `<div class="stack-8">
        ${ui.field({ id: 'plazo-simulacion-monto', label: 'Simular con', input: ui.input({ id: 'plazo-simulacion-monto', value: st.monto != null ? formatCurrency(st.monto) : '', attrs: 'inputmode="decimal" autocomplete="off"' }) })}
        <h3 class="t-texto-bold">Tabla de amortización</h3>
        <div id="sim-tabla">${tablaResumen(p, st.monto)}</div>
      </div>`;
    cuerpo.innerHTML = `<div class="stack-24">
      <div class="detail-layout">
        <div class="detail-col">
          ${tarjetaDetalle('plazo-resumen', 'Resumen', resumen, L)}
          ${tarjetaDetalle('plazo-condiciones', 'Condiciones', condiciones, L)}
          ${tarjetaDetalle('plazo-adicionales', 'Intereses adicionales', adicionales, L)}
          <div class="pair-row">${tarjetaDetalle('plazo-cliente', 'Cliente objetivo', cliente, L)}${tarjetaDetalle('plazo-refinanciamiento', 'Refinanciamiento automático', refi, L)}</div>
        </div>
        <div class="detail-col">
          ${tarjetaDetalle('plazo-segmentacion', 'Segmentación', segmentacion, L)}
          ${tarjetaDetalle('plazo-simulacion', 'Simulación', simulacion, L)}
        </div>
      </div>
      ${ui.note('[Por confirmar] Manuel v2: Estado e Interés se repiten entre el encabezado, Resumen y Condiciones (“Yo te lo quitaría”).')}
    </div>`;
    if (L) return;
    vigilarTruncados(cuerpo);
    /* Simular con: TextInput currency; se recalcula con cada tecla (vacío = 0) */
    const inp = cuerpo.querySelector('#plazo-simulacion-monto');
    bindMoney(inp);
    inp.addEventListener('input', () => { st.monto = money2num(inp.value); cuerpo.querySelector('#sim-tabla').innerHTML = tablaResumen(actual(), st.monto); });
  }
  const pintar = () => { pintarEncabezado(); pintarCuerpo(); };

  /* get del servicio: en el escenario Error falla el primero */
  function fetchPlazo() {
    st.loading = true; st.error = false; pintar();
    if (demo.escenario === 'slow') return; // "Carga lenta": estado de carga fijo
    const t = (() => {
      if (demo.failNextGet) { demo.failNextGet = false; st.error = true; }
      else { const s = db.plazos.find(x => x.id === id); st.fetched = s ? clone(s) : null; }
      st.loading = false; pintar();
    })();
  }

  page.addEventListener('click', e => {
    /* "Plazos" del breadcrumb: el listado le regresa el foco a la fila de este plazo (el router navega después) */
    if (e.target.closest('[data-volver]')) { focoAlVolver = id; return; }
    if (e.target.closest('[data-retry]')) { fetchPlazo(); return; }
    const ver = e.target.closest('[data-ver-todas]');
    if (ver) {
      const grupo = ver.closest('[data-seg]'), abierto = ver.getAttribute('aria-expanded') === 'true';
      grupo.querySelectorAll('[data-extra]').forEach(li => { li.hidden = abierto; });
      ver.setAttribute('aria-expanded', String(!abierto));
      ver.querySelector('span').textContent = abierto ? `Ver todas (${grupo.dataset.total})` : 'Ver menos';
      return;
    }
    const act = e.target.closest('[data-action]');
    if (!act) return;
    const p = actual(); if (!p) return;
    closeMenus(); act.closest('.menu-wrap')?.querySelector('[data-menu-trigger]')?.focus();
    if (act.dataset.action === 'editar') { go(`#/plazos/${id}/editar`); return; }
    /* Duplicar: la vista no cambia (se queda en el detalle del original) */
    if (act.dataset.action === 'duplicar') { duplicar(p); return; }
    /* Activar/Desactivar: el chip del título, el de Resumen y el ⋮ se actualizan sin volver a cargar las cards */
    confirmEstado(p, act.dataset.action === 'activar', status => { if (st.fetched) st.fetched.status = status; pintarEncabezado(); });
  });
  vista = { alCargar: () => { if (document.contains(page)) pintarEncabezado(); } };
  fetchPlazo();
}

/* ==========================================================================
   CREAR / EDITAR (PreviewInstallmentForm): misma estructura que /Operational/Installments/New, sin AnchorMenu
   ni barra fija (override del 2026-10-10). Cards en una columna, botones al final y la simulación a la derecha.
   ========================================================================== */
const MAX_MONTO = 10000000;
const NOMBRE_RE = /^[\p{L}\p{N} \-_.#,*$()%]+$/u;
/* orden de las cards: al enviar con errores se lleva el foco a la primera con error */
const PLAZO_FORM_SECTIONS = ['detalles', 'segmentacion', 'condiciones', 'intereses', 'cliente', 'refinanciamiento'];
const PLAZO_FIELD_SECTION = {
  name: 'detalles', startDate: 'detalles', endDate: 'detalles', categoryIds: 'segmentacion', branchIds: 'segmentacion',
  minAmount: 'condiciones', maxAmount: 'condiciones', duration: 'condiciones', rate: 'condiciones', ranges: 'condiciones', renewals: 'condiciones',
  ageMin: 'cliente', ageMax: 'cliente',
};
const CAMPOS = Object.keys(PLAZO_FIELD_SECTION);
/* id del input de cada campo con TextInput / NumberInput */
const FIELD_INPUT = {
  name: 'plazo-nombre', startDate: 'plazo-inicio', endDate: 'plazo-fin', minAmount: 'plazo-monto-minimo', maxAmount: 'plazo-monto-maximo',
  rate: 'plazo-tasa', renewals: 'plazo-refrendos', ageMin: 'plazo-edad-minima', ageMax: 'plazo-edad-maxima',
};
const PLAZO_FORM_ERRORS = {
  REQUIRED: 'Campo obligatorio', DATE: 'Usa el formato dd/mm/aaaa', END_BEFORE_START: 'Debe ser posterior a la vigencia de inicio',
  GREATER_THAN_ZERO: 'Debe ser mayor a cero', MAX_LESS_THAN_MIN: 'Debe ser mayor al mínimo', SELECT_ONE: 'Selecciona al menos una opción',
  RANGES: 'Agrega al menos un rango con su interés', AGE: 'La edad máxima debe ser mayor a la mínima', AGE_RANGE: 'Ingresa una edad entre 18 y 100',
};
const TREE_COPY = {
  categorias: { field: 'categoryIds', label: 'Categorías', search: 'Busca un grupo o producto', selectAll: 'Seleccionar todas las categorías' },
  sucursales: { field: 'branchIds', label: 'Sucursales', search: 'Busca un grupo, sucursal', selectAll: 'Seleccionar todas las sucursales' },
};
const newRange = () => ({ id: createId('rango'), from: '0', to: '', rate: '' });
/* "desde" de cada fila: 0 en la primera y el "hasta" anterior + 0.01 en las demás */
const getFrom = (ranges, i) => (i === 0 ? 0 : toNumber(ranges[i - 1].to) + 0.01);

/* Montos (TextInput currency): $, miles y 2 decimales al salir; sin formato al entrar */
function bindMoney(el) {
  el.addEventListener('blur', () => { const n = money2num(el.value); el.value = n == null ? '' : formatCurrency(n); });
  el.addEventListener('focus', () => { const n = money2num(el.value); el.value = n == null ? '' : n; });
}

/* Buscador con autocompletado (SearchFieldV2) para el FormTree: 3 o más caracteres, sin espera */
function montarBuscador(caja, { opciones, alElegir }) {
  const input = caja.querySelector('input'), btn = caja.querySelector('[data-q-btn]'), list = caja.querySelector('.ds-search__list');
  const s = { foco: false, cerrada: false, activo: 0 };
  const estado = () => {
    const q = input.value.trim();
    if (q.length < 3) return { status: 'idle', ops: [] };
    const ops = opciones(q.toLowerCase());
    return { status: ops.length ? 'results' : 'empty', ops };
  };
  const marcar = desplazar => {
    const opts = [...list.querySelectorAll('[role="option"]')];
    opts.forEach((o, i) => o.setAttribute('aria-selected', String(i === s.activo)));
    if (!opts.length) { input.removeAttribute('aria-activedescendant'); return; }
    input.setAttribute('aria-activedescendant', opts[s.activo].id);
    if (desplazar) opts[s.activo].scrollIntoView({ block: 'nearest' });
  };
  const pintar = () => {
    s.foco = s.foco && caja.contains(document.activeElement);
    const { status, ops } = estado();
    const abierta = s.foco && !s.cerrada && status !== 'idle';
    if (s.activo >= ops.length) s.activo = 0;
    input.setAttribute('aria-expanded', String(abierta));
    const limpiar = !!input.value && !s.foco;
    btn.setAttribute('aria-label', limpiar ? 'Limpiar búsqueda' : 'Buscar');
    btn.classList.toggle('ds-search__btn--clear', limpiar);
    btn.innerHTML = icon(limpiar ? 'Close' : 'Search');
    list.hidden = !abierta;
    list.setAttribute('role', abierta && status === 'results' ? 'listbox' : 'presentation');
    if (!abierta) { list.innerHTML = ''; input.removeAttribute('aria-activedescendant'); return; }
    list.innerHTML = status === 'empty' ? VACIO_BUSQUEDA
      : ops.map((o, i) => `<button type="button" class="ds-search__opt" role="option" id="${input.id}-opt-${i}" tabindex="-1" aria-selected="${i === s.activo}" data-opt="${i}"><span class="ds-search__opt-label">${resaltar(o.label, input.value)}</span>${o.desc ? `<span class="ds-search__opt-desc">${esc(o.desc)}</span>` : ''}</button>`).join('');
    marcar(false);
  };
  /* al elegir, el texto se queda, el campo pierde el foco y el árbol abre hasta el nodo (sin marcarlo) */
  const elegir = o => { if (!o) return; s.activo = 0; s.foco = false; input.blur(); pintar(); alElegir(o); };
  input.addEventListener('focus', () => { s.foco = true; s.cerrada = false; pintar(); });
  caja.addEventListener('focusout', e => { if (caja.contains(e.relatedTarget)) return; s.foco = false; pintar(); });
  input.addEventListener('input', () => { s.cerrada = false; s.activo = 0; pintar(); });
  input.addEventListener('keydown', e => {
    const { status, ops } = estado();
    const conOpciones = s.foco && !s.cerrada && status === 'results';
    if (e.key === 'Escape' && !list.hidden) { e.preventDefault(); e.stopPropagation(); s.cerrada = true; pintar(); return; }
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && conOpciones) { e.preventDefault(); s.activo = (s.activo + (e.key === 'ArrowDown' ? 1 : -1) + ops.length) % ops.length; marcar(true); return; }
    if (e.key === 'Enter') { e.preventDefault(); if (conOpciones) elegir(ops[s.activo]); }
  });
  list.addEventListener('mousedown', e => { e.preventDefault(); const o = e.target.closest('[data-opt]'); if (o) elegir(estado().ops[+o.dataset.opt]); });
  list.addEventListener('mouseover', e => { const o = e.target.closest('[data-opt]'); if (o && +o.dataset.opt !== s.activo) { s.activo = +o.dataset.opt; marcar(false); } });
  btn.addEventListener('mousedown', e => e.preventDefault());
  btn.addEventListener('click', () => { if (btn.classList.contains('ds-search__btn--clear')) input.value = ''; input.focus(); });
  pintar();
}

function renderForm(main, { id, sugerencia }) {
  const isEdit = id !== undefined && id !== null;
  /* la edición abre al instante con los datos en memoria (sin spinner ni error) */
  const original = isEdit ? (getPlazo(id) || db.plazos.find(p => p.id === id) || null) : null;
  const sug = sugerencia ? (store.sugerencias.find(s => s.suggestedTermId === sugerencia) || db.sugerencias.find(s => s.suggestedTermId === sugerencia) || null) : null;
  const title = isEdit ? 'Editar plazo' : 'Nuevo plazo';
  main.innerHTML = `<div class="page">
    ${ui.breadcrumb([{ label: 'Plazos', href: '#/plazos' }, { label: title }])}
    <div class="title-row"><h1 class="t-titulo-pagina">${title}</h1></div>
    <div id="form-root"></div></div>`;
  const root = main.querySelector('#form-root');
  if (isEdit && !original) { root.innerHTML = ui.alert('warning', { title: 'No encontramos este plazo.' }); return; }
  let f;
  if (original) f = aFormulario(original);
  else if (sug) f = suggestionToFormValues(sug);
  else f = { ...clone(EMPTY_PLAZO_FORM), additionalInterests: buildSuggestedInterests() };
  buildForm(main, root, f, { isEdit, original, sug, title });
}

function buildForm(main, root, f, { isEdit, original, sug, title }) {
  let dirty = false, saving = false, submitted = false, conFin = Boolean(f.endDate);
  let simMonto = PLAZOS_SIMULATION_DEFAULT_AMOUNT;
  const errors = {};
  /* el FormTree de cada card guarda qué nodos están abiertos (todos plegados al inicio) */
  const abiertos = { categorias: new Set(), sucursales: new Set() };
  const q = s => root.querySelector(s);
  /* Cliente objetivo y Refinanciación van lado a lado (PairRow) mientras ambos están apagados */
  const PAR_PERFIL = ['cliente', 'refinanciamiento'];
  const tarjeta = sid => `<section class="card fcard" id="${sid}" aria-labelledby="${sid}-title"></section>`;

  root.innerHTML = `
    ${isEdit && original.status === 'Vigente' ? `<div class="stack form-aviso">${ui.alert('warning', { title: 'Este plazo está vigente', text: 'Revisa a qué contratos aplican los cambios antes de guardar.' })}${ui.note('[Por confirmar con negocio] Editar un plazo vigente: ¿los cambios aplican solo a contratos nuevos o también a los existentes? El texto del aviso depende de esa regla.')}</div>` : ''}
    <form class="form-page" id="plazo-form" novalidate aria-label="${title}">
      <div class="form-main">
        ${PLAZO_FORM_SECTIONS.filter(sid => !PAR_PERFIL.includes(sid)).map(tarjeta).join('')}
        <div class="form-pair" data-form-pair>${PAR_PERFIL.map(tarjeta).join('')}</div>
        <div class="buttons-row">
          ${ui.btn('Cancelar', { variant: 'tertiary', attrs: 'data-cancel' })}
          ${ui.btn(isEdit ? 'Guardar cambios' : 'Crear plazo', { type: 'submit', attrs: 'data-submit' })}
        </div>
      </div>
      <aside class="form-sim"><section class="card sim" aria-labelledby="plazo-simulacion-title"></section></aside>
    </form>`;
  const form = q('#plazo-form');
  const sec = Object.fromEntries(PLAZO_FORM_SECTIONS.map(s => [s, q('#' + s)]));
  /* encabezado de card (PreviewFormSection): h2, descripción opcional y la acción a la derecha */
  const cabeza = (sid, titulo, desc = '', accion = '') => `<div class="fcard__heading"><div class="fcard__head"><div id="${sid}-title"><h2 class="t-subtitulos">${titulo}</h2></div>${accion}</div>${desc ? `<p class="t-texto">${desc}</p>` : ''}</div>`;
  const actualizarPar = () => q('[data-form-pair]').classList.toggle('is-pair', !f.targetEnabled && !f.refinancingEnabled);

  /* ---- Validación (plazosPreviewForm.schema.ts + reglas de la maqueta que su esquema no trae, F-31) ---- */
  const lleno = v => Boolean(String(v ?? '').trim());
  const positivo = v => v !== null && v !== undefined && v !== '' && toNumber(v) > 0;
  const positiveString = v => (!lleno(v) ? PLAZO_FORM_ERRORS.REQUIRED : !positivo(v) ? PLAZO_FORM_ERRORS.GREATER_THAN_ZERO : null);
  const edadValida = v => { const a = toNumber(v); return a >= 18 && a <= 100; };
  function regla(k) {
    switch (k) {
      case 'name': {
        const n = f.name.trim();
        if (!n) return PLAZO_FORM_ERRORS.REQUIRED;
        if (n.length < 3) return 'Usa al menos 3 caracteres';
        if (!NOMBRE_RE.test(n)) return 'Usa solo letras, números, espacios y - _ . # , * $ ( ) %';
        if (db.plazos.some(p => p.id !== (original && original.id) && p.name.trim().toLowerCase() === n.toLowerCase())) return 'Ya tienes un plazo con este nombre';
        return null;
      }
      case 'startDate':
        if (!lleno(f.startDate)) return PLAZO_FORM_ERRORS.REQUIRED;
        return isValidDate(f.startDate) && fechaExiste(f.startDate) ? null : PLAZO_FORM_ERRORS.DATE;
      case 'endDate':
        if (!f.endDate) return null;
        if (!isValidDate(f.endDate) || !fechaExiste(f.endDate)) return PLAZO_FORM_ERRORS.DATE;
        return isValidDate(f.startDate) && dateToNumber(f.endDate) <= dateToNumber(f.startDate) ? PLAZO_FORM_ERRORS.END_BEFORE_START : null;
      case 'categoryIds': case 'branchIds': return f[k].length ? null : PLAZO_FORM_ERRORS.SELECT_ONE;
      case 'minAmount':
        if (f.minAmount == null) return PLAZO_FORM_ERRORS.REQUIRED;
        if (!(f.minAmount > 0)) return PLAZO_FORM_ERRORS.GREATER_THAN_ZERO;
        return f.minAmount > MAX_MONTO ? 'El monto no puede ser mayor a $10,000,000.00' : null;
      case 'maxAmount':
        if (f.maxAmount == null) return null;
        if (f.maxAmount > MAX_MONTO) return 'El monto no puede ser mayor a $10,000,000.00';
        return f.minAmount != null && !(f.maxAmount > f.minAmount) ? PLAZO_FORM_ERRORS.MAX_LESS_THAN_MIN : null;
      case 'duration': return positiveString(f.duration);
      case 'rate': return f.rateType === 'fixed' ? positiveString(f.rate) : null;
      case 'ranges': {
        if (f.rateType !== 'dynamic') return null;
        const llenas = f.ranges.filter(r => r.to || r.rate);
        return llenas.length && llenas.every(r => positivo(r.rate)) ? null : PLAZO_FORM_ERRORS.RANGES;
      }
      case 'renewals': return f.renewalsLimited ? positiveString(f.renewals) : null;
      /* F-42: con "Cliente objetivo" apagado las edades no se validan */
      case 'ageMin': return f.targetEnabled && f.ageMin && !edadValida(f.ageMin) ? PLAZO_FORM_ERRORS.AGE_RANGE : null;
      case 'ageMax':
        if (!f.targetEnabled || !f.ageMax) return null;
        if (!edadValida(f.ageMax)) return PLAZO_FORM_ERRORS.AGE_RANGE;
        return f.ageMin && !(toNumber(f.ageMax) > toNumber(f.ageMin)) ? PLAZO_FORM_ERRORS.AGE : null;
      default: return null;
    }
  }
  /* en los árboles y en la tabla de rangos el error va en un div role="alert" con caption var(--ats-error-red-300), sin ícono */
  function pintarError(k) {
    if (k === 'categoryIds' || k === 'branchIds' || k === 'ranges') {
      root.querySelectorAll(`[data-error-for="${k}"]`).forEach(b => { b.innerHTML = errors[k] ? `<div role="alert"><p class="t-caption field-alert">${esc(errors[k])}</p></div>` : ''; });
      return;
    }
    if (k === 'duration') { pintarErrorDoble(q('[data-doble="plazo-duracion"]'), errors.duration); return; }
    const id = FIELD_INPUT[k], input = id && q('#' + id);
    if (!input) return;
    input.setAttribute('aria-invalid', String(!!errors[k]));
    const err = q(`#${id}-error`); if (err) err.innerHTML = ui.errorText(errors[k]);
    if (k === 'startDate') actualizarHoy();
  }
  const pintarErrores = () => CAMPOS.forEach(pintarError);
  function validar(k) { const m = regla(k); if (m) errors[k] = m; else delete errors[k]; pintarError(k); }
  /* desde el primer envío, cada campo se revalida al cambiar */
  function cambio(k) { dirty = true; if (submitted && CAMPOS.includes(k)) validar(k); updateSim(); }
  /* "(Hoy)" debajo de la vigencia de inicio cuando es la fecha de hoy y no hay error */
  function actualizarHoy() { const h = q('#plazo-inicio-help'); if (h) h.textContent = f.startDate === getTodayString() && !errors.startDate ? '(Hoy)' : ''; }

  /* ---- Detalles del plazo ------------------------------------------------- */
  function drawDetalles() {
    /* DetailsRow: Nombre · Inicio · [Fin] · acción de fin de vigencia en una sola fila */
    sec.detalles.innerHTML = cabeza('detalles', 'Detalles del plazo')
      + `<div class="details-row${conFin ? ' details-row--fin' : ''}">
        ${ui.field({ id: 'plazo-nombre', label: 'Nombre del producto', input: ui.input({ id: 'plazo-nombre', value: f.name, attrs: 'maxlength="100" autocomplete="off" data-k="name"' }) })}
        ${ui.field({ id: 'plazo-inicio', label: 'Vigencia de inicio', help: '', input: ui.date({ id: 'plazo-inicio', value: f.startDate, attrs: 'data-k="startDate"' }) })}
        ${conFin
    ? `${ui.field({ id: 'plazo-fin', label: 'Vigencia de fin', optional: true, input: ui.date({ id: 'plazo-fin', value: f.endDate, attrs: 'data-k="endDate"' }) })}
            <div class="end-row__x">${ui.iconBtn('Close', 'Quitar vigencia de fin', 'data-quitar-fin data-tip="Quitar vigencia de fin"', 'sm')}</div>`
    : `<div class="end-add">${ui.btn('Fin de vigencia', { variant: 'tertiary', iconLeft: 'Add', attrs: 'data-agregar-fin' })}</div>`}
      </div>`;
    ['name', 'startDate', 'endDate'].forEach(pintarError);
    actualizarHoy();
  }

  /* ---- Segmentación (FormTree del DS, primero Categorías) --------------------- */
  function montarFormTree(caja, kind, { alto, ampliar }) {
    const copy = TREE_COPY[kind], field = copy.field, pre = `ft-${kind}${ampliar ? '' : '-amp'}`;
    const abiertosArbol = ampliar ? abiertos[kind] : new Set();
    caja.innerHTML = `<div class="ds-formtree">
      <span class="ds-formtree__label" id="${pre}-label">${copy.label}</span>
      <div class="ds-formtree__search-row">
        <div class="ds-search ds-formtree__search">
          <input class="ds-input" id="${pre}-q" type="text" role="combobox" aria-autocomplete="list" aria-controls="${pre}-q-list" aria-expanded="false" autocomplete="off" placeholder="${copy.search}" aria-label="${copy.search}">
          <button type="button" class="ds-search__btn" data-q-btn aria-label="Buscar"></button>
          <div class="ds-search__list" id="${pre}-q-list" role="presentation" hidden></div>
        </div>
      </div>
      <div class="ds-formtree__list" style="height:${alto}px" data-ft-list></div>
    </div>`;
    const lista = caja.querySelector('[data-ft-list]');
    const fila = n => {
      const set = new Set(f[field]), hijos = !!(n.children && n.children.length), abierto = abiertosArbol.has(n.id);
      const marcado = set.has(n.id), indet = hijos && !marcado && hasAnyDescendantChecked(n, set);
      return `<div class="ft-node" role="treeitem" aria-level="${n.depth + 1}" ${hijos ? `aria-expanded="${abierto}"` : ''} data-ft-node="${n.id}" style="padding-left:${n.depth === 0 ? 8 : 18 + n.depth * 20}px">
        ${hijos ? `<button type="button" class="ft-node__chev" aria-label="${abierto ? 'Contraer' : 'Expandir'} ${esc(n.label)}" aria-expanded="${abierto}" data-ft-toggle="${n.id}">${icon('ChevronDown')}</button>` : '<span class="ft-node__spacer"></span>'}
        <span class="ft-node__check">${ui.checkSolo({ label: n.label, checked: marcado, attrs: `data-ft-check="${n.id}" ${indet ? 'data-indeterminate' : ''}` })}</span>
        <span class="ft-node__text"><span class="ft-node__label">${esc(n.label)}</span><span class="ft-node__sub">${esc(n.sub)}</span></span>
      </div>${hijos && abierto ? n.children.map(c => fila(nodoDe(kind, c.id))).join('') : ''}`;
    };
    const pintar = () => {
      const set = new Set(f[field]), todos = FLAT[kind].map(n => n.id);
      const todo = todos.length > 0 && todos.every(x => set.has(x)), alguno = !todo && f[field].length > 0;
      lista.innerHTML = `<div class="ds-formtree__all">${ui.check({ name: `${pre}-all`, value: 'all', label: copy.selectAll, checked: todo, cls: 'ds-check--lg', attrs: `data-ft-all ${alguno ? 'data-indeterminate' : ''}` })}</div>
        <div class="ds-formtree__nodes" role="tree" aria-label="${copy.label}" aria-multiselectable="true">${ARBOL[kind].map(n => fila(nodoDe(kind, n.id))).join('')}</div>`;
      lista.querySelectorAll('[data-indeterminate]').forEach(i => { i.indeterminate = true; });
    };
    lista.addEventListener('click', e => {
      const t = e.target.closest('[data-ft-toggle]'); if (!t) return;
      const nid = t.dataset.ftToggle;
      if (abiertosArbol.has(nid)) abiertosArbol.delete(nid); else abiertosArbol.add(nid);
      pintar(); lista.querySelector(`[data-ft-toggle="${nid}"]`)?.focus();
    });
    /* marcar o desmarcar cascada a los descendientes y recalcula hacia arriba; "Seleccionar todas" pone o vacía todo */
    lista.addEventListener('change', e => {
      const el = e.target;
      if (el.matches('[data-ft-all]')) f[field] = el.checked ? FLAT[kind].map(n => n.id) : [];
      else if (el.dataset.ftCheck) f[field] = computeNewCheckedIds(kind, el.dataset.ftCheck, f[field], el.checked);
      else return;
      const foco = el.matches('[data-ft-all]') ? '[data-ft-all]' : `[data-ft-check="${el.dataset.ftCheck}"]`;
      pintar(); lista.querySelector(foco)?.focus();
      cambio(field);
    });
    montarBuscador(caja.querySelector('.ds-formtree__search'), {
      opciones: t => FLAT[kind].filter(n => n.label.toLowerCase().includes(t) || n.sub.toLowerCase().includes(t)).map(n => ({ id: n.id, label: n.label, desc: n.sub })),
      alElegir: o => {
        let n = nodoDe(kind, o.id);
        while (n && n.parent) { abiertosArbol.add(n.parent); n = nodoDe(kind, n.parent); }
        pintar();
        requestAnimationFrame(() => lista.querySelector(`[data-ft-node="${o.id}"]`)?.scrollIntoView({ block: 'center', behavior: 'smooth' }));
      },
    });
    pintar();
  }
  /* los dos árboles lado a lado (240 de alto) y "Expandir vista" en el encabezado de la card */
  function drawSegmentacion() {
    const bloque = kind => `<div class="fblock"><div data-formtree="${kind}"></div><div data-error-for="${TREE_COPY[kind].field}"></div></div>`;
    sec.segmentacion.innerHTML = cabeza('segmentacion', 'Segmentación', 'Define a qué categorías y sucursales se aplicará este ajuste.',
      ui.btn('Expandir vista', { variant: 'tertiary', iconLeft: 'ExpandContent', attrs: 'data-seg-expand' }))
      + `<div class="row2">${bloque('categorias')}${bloque('sucursales')}</div>`;
    ['categorias', 'sucursales'].forEach(kind => montarFormTree(sec.segmentacion.querySelector(`[data-formtree="${kind}"]`), kind, { alto: 240, ampliar: true }));
    pintarError('categoryIds'); pintarError('branchIds');
  }
  /* vista ampliada: un modal large "Segmentación" sin pie con los dos árboles (480 de alto) y el mismo valor;
     al cerrar se repinta la card y el foco vuelve a "Expandir vista" */
  function abrirArbolAmpliado() {
    openModal({
      title: 'Segmentación', size: 'large', body: '<div class="row2"><div data-formtree-modal="categorias"></div><div data-formtree-modal="sucursales"></div></div>',
      onMount: ov => ['categorias', 'sucursales'].forEach(kind => montarFormTree(ov.querySelector(`[data-formtree-modal="${kind}"]`), kind, { alto: 480, ampliar: false })),
      onClose: () => { drawSegmentacion(); return sec.segmentacion.querySelector('[data-seg-expand]'); },
    });
  }

  /* ---- Condiciones: monto y duración, tasa, prorrateo y refrendos (todo en la rejilla de 3) ---- */
  function drawCondiciones() {
    sec.condiciones.innerHTML = cabeza('condiciones', 'Condiciones') + `
      <div class="fblock"><h3 class="t-texto-bold">Monto de préstamo y duración</h3>
        <div class="row3">
          ${ui.field({ id: 'plazo-monto-minimo', label: 'Mínimo', input: ui.input({ id: 'plazo-monto-minimo', value: f.minAmount != null ? formatCurrency(f.minAmount) : '', placeholder: '$', attrs: 'inputmode="decimal" autocomplete="off" data-money data-k="minAmount"' }) })}
          ${ui.field({ id: 'plazo-monto-maximo', label: 'Máximo', optional: true, input: ui.input({ id: 'plazo-monto-maximo', value: f.maxAmount != null ? formatCurrency(f.maxAmount) : '', placeholder: '-', attrs: 'inputmode="decimal" autocomplete="off" data-money data-k="maxAmount"' }) })}
          <div class="doble-field">${dobleHTML({ id: 'plazo-duracion', label: 'Duración', options: DURATION_UNIT_OPTIONS, value: f.durationUnit, inputValue: f.duration })}</div>
        </div>
      </div>
      <div class="fblock" id="bloque-tasa"></div>
      <div class="fblock">
        <h3 class="t-texto-bold">Cantidad de refrendos</h3>
        <div class="row3">
          <div class="align-input">${ui.switch({ id: 'plazo-refrendos-switch', checked: f.renewalsLimited, attrs: 'data-switch="renewalsLimited"' })}<label class="switch-label" for="plazo-refrendos-switch">Limitar el número de refrendos</label></div>
          <div id="refrendos-campo"></div>
        </div>
      </div>`;
    montarDoble(q('[data-doble="plazo-duracion"]'), {
      options: DURATION_UNIT_OPTIONS, valor: () => f.durationUnit,
      alElegir: v => { f.durationUnit = v; cambio('durationUnit'); },
      alEscribir: v => { f.duration = v; cambio('duration'); },
    });
    drawTasa(); drawRefrendos();
    ['minAmount', 'maxAmount', 'duration'].forEach(pintarError);
  }
  /* Tasa en 3 columnas: radios fija/dinámica · tasa de interés · prorrateo; la tabla de rangos va debajo.
     Una sola ayuda (InfoIcon 16 en textPlaceholder) junto al título explica los dos tipos. */
  function drawTasa() {
    const caja = q('#bloque-tasa');
    if (f.rateType === 'dynamic' && !f.ranges.length) f.ranges = [newRange()]; /* arranca con una fila vacía */
    const ayuda = 'Tasa fija: Se aplica un valor fijo durante todo el período. Tasa dinámica: Varía según condiciones definidas.';
    caja.innerHTML = `<div class="inline-row"><h3 class="t-texto-bold">Define cómo se calculará el interés base para este plazo</h3><span class="info-trigger" tabindex="0" role="img" aria-label="Ayuda" data-tip="${esc(ayuda)}">${icon('Info')}</span></div>
      <div class="row3">
        <div class="align-input" role="radiogroup" aria-label="Tipo de tasa">${ui.radio({ name: 'plazo-tipo-tasa', value: 'fixed', label: 'Tasa fija', checked: f.rateType === 'fixed', attrs: 'data-rate-type' })}${ui.radio({ name: 'plazo-tipo-tasa', value: 'dynamic', label: 'Tasa dinámica', checked: f.rateType === 'dynamic', attrs: 'data-rate-type' })}</div>
        ${f.rateType === 'fixed' ? ui.field({ id: 'plazo-tasa', label: 'Tasa de interés', input: ui.input({ id: 'plazo-tasa', value: f.rate, attrs: 'inputmode="decimal" autocomplete="off" data-k="rate" data-dec' }) }) : '<span></span>'}
        <div class="align-input">${ui.check({ name: 'plazo-prorrateo', value: '1', label: 'Aplicar interés con prorrateo diario.', checked: f.proration, attrs: 'data-proration' })}</div>
      </div>
      ${f.rateType === 'dynamic' ? '<div id="rangos"></div>' : ''}
      ${ui.note('[Por confirmar con negocio] Confirmar que “prorrateo diario” significa cobrar solo los días transcurridos. Hoy el texto del checkbox cambia según el interruptor HU-CP-395-F y dice lo contrario cuando está apagado.')}`;
    if (f.rateType === 'dynamic') drawRangos();
    pintarError('rate');
  }
  /* Tabla de tasa dinámica (DynamicTax): "hasta" > 100 no se acepta; = 100 cierra las filas siguientes;
     mayor que su "desde" en la última fila agrega otra vacía. Sin botón "Agregar rango" ni tope. */
  function drawRangos() {
    const caja = q('#rangos'); if (!caja) return;
    const r = f.ranges;
    caja.innerHTML = `<div class="table-wrap" role="region" aria-label="Rangos de la tasa dinámica" tabindex="0"><table class="ds-table ds-table--rangos">
      <thead><tr><th scope="col">% Préstamo sobre avalúo</th><th scope="col">Hasta %</th><th scope="col">Interés</th><th scope="col">Acciones</th></tr></thead>
      <tbody>${r.map((x, i) => `<tr>
        <td class="nowrap">${getFrom(r, i).toFixed(2)}</td>
        <td><input class="ds-input ds-input--table" aria-label="Hasta % del rango ${i + 1}" inputmode="decimal" autocomplete="off" data-rango="${i}" data-rk="to" value="${esc(x.to)}"></td>
        <td><input class="ds-input ds-input--table" aria-label="Interés del rango ${i + 1}" inputmode="decimal" autocomplete="off" data-rango="${i}" data-rk="rate" value="${esc(x.rate)}"></td>
        <td class="cell-iconbtn">${i > 0 ? ui.iconBtn('Delete', `Eliminar rango ${i + 1}`, `data-del-rango="${i}"`) : ''}</td>
      </tr>`).join('')}</tbody></table></div>
      <div data-error-for="ranges"></div>`;
    pintarError('ranges');
  }
  const guardarRangos = next => { f.ranges = next.map((r, i) => ({ ...r, from: getFrom(next, i).toFixed(2) })); };
  function editarRango(el) {
    const i = +el.dataset.rango, k = el.dataset.rk;
    if (k === 'to') {
      const to = sanitizeDecimal(el.value);
      if (toNumber(to) > 100) { el.value = f.ranges[i].to; return; }
      const next = f.ranges.map((r, j) => (j === i ? { ...r, to } : r)), v = toNumber(to);
      if (to && v === 100) guardarRangos(next.slice(0, i + 1));
      else if (to && v > getFrom(next, i) && i === next.length - 1) guardarRangos([...next, newRange()]);
      else guardarRangos(next);
    } else guardarRangos(f.ranges.map((r, j) => (j === i ? { ...r, rate: sanitizeDecimal(el.value) } : r)));
    drawRangos();
    const nuevo = q(`[data-rango="${i}"][data-rk="${k}"]`);
    if (nuevo) { nuevo.focus(); nuevo.setSelectionRange(nuevo.value.length, nuevo.value.length); }
    cambio('ranges');
  }
  function drawRefrendos() {
    q('#refrendos-campo').innerHTML = f.renewalsLimited
      ? ui.field({ id: 'plazo-refrendos', label: 'Máximo de refrendos', input: ui.input({ id: 'plazo-refrendos', value: f.renewals, placeholder: 'Máximo número', attrs: 'inputmode="numeric" autocomplete="off" data-k="renewals" data-int' }) }) : '';
    pintarError('renewals');
  }

  /* ---- Intereses adicionales ---------------------------------------------- */
  function drawIntereses() {
    const lista = f.additionalInterests, hay = lista.length > 0;
    sec.intereses.innerHTML = cabeza('intereses', 'Intereses adicionales',
      hay ? '' : 'Define los intereses fijos, dinámicos y cargos adicionales aplicables a tus préstamos.',
      hay ? `<div class="inline-row">${ui.btn('Interés', { variant: 'tertiary', iconLeft: 'Add', attrs: 'data-add-interes' })}${ui.btn('Borrar todo', { variant: 'tertiary', iconLeft: 'Delete', attrs: 'data-borrar-intereses' })}</div>`
        : ui.btn('Interés', { variant: 'secondary', iconLeft: 'Add', attrs: 'data-add-interes' }))
      + (hay ? `<ul class="interest-list">${lista.map(a => `<li class="interest-item">
          <div class="interest-text">
            <div class="inline-row"><span class="t-texto-bold interest-name">${esc(a.name)}</span>${a.suggested ? ui.chipInfo('Sugerido', 'blue') : ''}</div>
            <div class="inline-row"><span class="t-texto">${esc(getInterestConfigLabel(a))}</span>${a.showContract ? `<span class="interest-ok">${icon('Check')}</span><span class="t-texto">Reflejar contrato</span>` : `<span class="interest-no">${icon('Close')}</span><span class="t-texto">No reflejar contrato</span>`}</div>
          </div>
          <div class="actions-inline">${ui.iconBtn('Edit', `Editar interés ${a.name}`, `data-edit-interes="${a.id}"`)}${ui.iconBtn('Delete', `Eliminar interés ${a.name}`, `data-del-interes="${a.id}"`)}</div>
        </li>`).join('')}</ul>` : '');
  }
  /* Modal "Intereses adicionales" (InterestModal): centrado, igual para agregar y editar; valida al guardar y luego en vivo */
  function interesModal(a) {
    const d = a ? clone(a) : { id: createId('interes'), name: '', collect: 'after', countPeriod: '', periodUnit: 'days', showContract: true, rate: '' };
    let enviado = false, focoDespues = null;
    const ov = openModal({
      title: 'Intereses adicionales',
      body: `<p class="t-texto" style="color:var(--text-captions)">Configura un interés regular, moratorio o adicional según tus necesidades.</p>
        <div class="row2">
          ${ui.field({ id: 'interes-nombre', label: 'Nombre del interés', input: ui.input({ id: 'interes-nombre', value: d.name, attrs: 'maxlength="60" autocomplete="off"' }) })}
          ${ui.field({ id: 'interes-cobrar', label: 'Cobrar', input: ui.select({ id: 'interes-cobrar', value: d.collect, options: COLLECT_OPTIONS }) })}
        </div>
        <div id="i-dinamico" class="stack"></div>
        <hr class="divider">
        <div class="fblock fblock--tight"><h3 class="t-texto-bold">Define cómo se calculará el interés</h3>
          <p class="t-texto">Tasa fija (Se aplica un valor fijo durante todo el período.)</p>
          <div class="narrow">${ui.field({ id: 'interes-tasa', label: 'Tasa de interés', input: ui.input({ id: 'interes-tasa', value: d.rate, attrs: 'inputmode="decimal" autocomplete="off"' }) })}</div></div>
        ${ui.note('[Por confirmar con negocio] Qué cambia “Reflejar en contrato” y por qué solo aplica a los cobros después del periodo.')}`,
      footer: ui.btn('Cancelar', { variant: 'secondary', attrs: 'data-close-btn' }) + ui.btn('Guardar cambios', { attrs: 'data-ok' }),
      footerEnd: true,
      onClose: () => focoDespues,
    });
    const $m = s => ov.querySelector(s);
    const errores = () => ({
      nombre: enviado && !d.name.trim() ? PLAZO_FORM_ERRORS.REQUIRED : null,
      tasa: enviado && toNumber(d.rate) <= 0 ? PLAZO_FORM_ERRORS.GREATER_THAN_ZERO : null,
      duracion: enviado && d.collect === 'after' && toNumber(d.countPeriod) <= 0 ? PLAZO_FORM_ERRORS.GREATER_THAN_ZERO : null,
    });
    const pintarErroresModal = () => {
      const e = errores();
      [['interes-nombre', e.nombre], ['interes-tasa', e.tasa]].forEach(([id, msg]) => { $m('#' + id).setAttribute('aria-invalid', String(!!msg)); $m(`#${id}-error`).innerHTML = ui.errorText(msg); });
      pintarErrorDoble($m('[data-doble="interes-duracion"]'), e.duracion);
    };
    const drawDinamico = () => {
      const caja = $m('#i-dinamico');
      caja.innerHTML = d.collect === 'during'
        ? '<p class="t-texto">Este interés se aplicará y cobrará desde el primer día del pago del refrendo o desempeño</p>'
        : `<div class="row2"><div class="doble-field">${dobleHTML({ id: 'interes-duracion', label: 'Duración', options: DURATION_UNIT_OPTIONS, value: d.periodUnit, inputValue: d.countPeriod })}</div>
            <div>${ui.switch({ id: 'interes-contrato', label: 'Reflejar en contrato', checked: d.showContract, top: true })}</div></div>`;
      if (d.collect === 'after') {
        montarDoble($m('[data-doble="interes-duracion"]'), {
          options: DURATION_UNIT_OPTIONS, valor: () => d.periodUnit,
          alElegir: v => { d.periodUnit = v; }, alEscribir: v => { d.countPeriod = v; pintarErroresModal(); },
        });
        $m('#interes-contrato').addEventListener('change', e => { d.showContract = e.target.checked; });
      }
      pintarErroresModal();
    };
    drawDinamico();
    $m('#interes-nombre').addEventListener('input', e => { d.name = e.target.value; pintarErroresModal(); });
    $m('#interes-tasa').addEventListener('input', e => { const v = sanitizeDecimal(e.target.value); if (v !== e.target.value) e.target.value = v; d.rate = v; pintarErroresModal(); });
    $m('#interes-cobrar').addEventListener('change', e => { d.collect = e.target.value; drawDinamico(); });
    $m('[data-close-btn]').addEventListener('click', () => closeModal());
    $m('[data-ok]').addEventListener('click', () => {
      enviado = true;
      const e = errores();
      pintarErroresModal();
      if (e.nombre || e.tasa || e.duracion) { (e.nombre ? $m('#interes-nombre') : e.duracion ? $m('#interes-duracion') : $m('#interes-tasa')).focus(); return; }
      const nuevo = { ...d, name: d.name.trim(), showContract: d.collect === 'after' ? d.showContract : true };
      const k = f.additionalInterests.findIndex(x => x.id === nuevo.id);
      if (k >= 0) f.additionalInterests[k] = nuevo; else f.additionalInterests.push(nuevo);
      drawIntereses(); cambio('additionalInterests');
      focoDespues = sec.intereses.querySelector(`[data-edit-interes="${nuevo.id}"]`);
      closeModal();
    });
  }

  /* ---- Cliente objetivo (switch a la derecha del título; apagarlo no borra los valores) ---- */
  function drawCliente() {
    sec.cliente.innerHTML = cabeza('cliente', 'Cliente objetivo', 'Define el perfil del cliente ideal para este plazo. Esto ayudará a personalizar la oferta.',
      `<label class="sr-only" for="plazo-cliente-switch">Activar cliente objetivo</label>${ui.switch({ id: 'plazo-cliente-switch', checked: f.targetEnabled, attrs: 'data-switch="targetEnabled"' })}`)
      + ui.note('[Por confirmar con negocio] ¿El cliente objetivo limita a quién se le puede ofrecer el plazo, o solo es informativo? El texto de esta sección depende de la respuesta (Manuel ya cuestionó “personalizar la oferta”).')
      + (f.targetEnabled ? `<div class="row3"><div data-ams="sex"></div><div data-ams="civilStatus"></div><div data-ams="score"></div></div>
        <div class="fblock fblock--tight"><p class="t-label">Rango de edad</p>
          <div class="age-row">
            ${ui.field({ id: 'plazo-edad-minima', input: ui.input({ id: 'plazo-edad-minima', value: f.ageMin, placeholder: 'Edad mínima', attrs: 'inputmode="numeric" maxlength="3" autocomplete="off" aria-label="Edad mínima" data-k="ageMin" data-int' }) })}
            <span class="age-row__sep" aria-hidden="true">-</span>
            ${ui.field({ id: 'plazo-edad-maxima', input: ui.input({ id: 'plazo-edad-maxima', value: f.ageMax, placeholder: 'Edad máxima', attrs: 'inputmode="numeric" maxlength="3" autocomplete="off" aria-label="Edad máxima" data-k="ageMax" data-int' }) })}
          </div></div>` : '');
    if (f.targetEnabled) {
      [['sex', 'Sexo', true, SEX_OPTIONS], ['civilStatus', 'Estado civil', true, CIVIL_STATUS_OPTIONS], ['score', 'Score de cliente', false, SCORE_OPTIONS]].forEach(([k, label, optional, options]) => {
        montarAMS(sec.cliente.querySelector(`[data-ams="${k}"]`), { id: `plazo-${k}`, label, optional, options, valor: () => f[k], alCambiar: v => { f[k] = v; cambio(k); } });
      });
    }
    pintarError('ageMin'); pintarError('ageMax');
  }

  /* ---- Refinanciamiento (título tal cual "Refinanciación automático"; apagarlo conserva las condiciones) ---- */
  function drawRefi() {
    const condiciones = f.refinancingConditions;
    const disponibles = REFINANCING_CONDITIONS.filter(o => !condiciones.some(c => c.type === o.v));
    const condHTML = c => {
      const meta = condicionMeta(c.type);
      let ctrl = '';
      if (meta.opciones) ctrl = '<div data-cond-ams></div>';
      if (c.type === 'amount') ctrl = ui.input({ id: `condicion-${c.id}`, value: c.amount != null ? formatCurrency(c.amount) : '', placeholder: '$', attrs: `inputmode="decimal" autocomplete="off" aria-label="${meta.label}" data-money data-cond-monto` });
      if (c.type === 'renewals' || c.type === 'commission') ctrl = dobleHTML({ id: `condicion-${c.id}`, ariaLabel: meta.label, options: c.type === 'commission' ? COMMISSION_OPTIONS : COMPARATOR_OPTIONS, value: c.comparator, inputValue: c.count, inputmode: c.type === 'commission' ? 'decimal' : 'numeric' });
      return `<div class="condition" role="group" aria-label="${meta.label}" data-cond="${c.id}">
        <div class="condition__head"><h3 class="t-texto-bold">${meta.label}</h3>${ui.iconBtn('Delete', `Eliminar condición ${meta.label}`, `data-del-cond="${c.id}"`)}</div>
        <div class="condition__body"><p class="t-texto">${meta.q}</p><div class="condition__ctrl">${ctrl}</div></div>
      </div>`;
    };
    sec.refinanciamiento.innerHTML = cabeza('refinanciamiento', 'Refinanciación automático',
      'Define las reglas que activan un refinanciamiento automático. Cuando el contrato cumpla las condiciones, el cliente verá nuevas opciones de préstamo disponibles.',
      `<label class="sr-only" for="plazo-refinanciamiento-switch">Activar refinanciamiento automático</label>${ui.switch({ id: 'plazo-refinanciamiento-switch', checked: f.refinancingEnabled, attrs: 'data-switch="refinancingEnabled"' })}`)
      + (f.refinancingEnabled ? `<hr class="divider"><div class="fblock">
          ${condiciones.map(condHTML).join('')}
          ${disponibles.length ? `<div>${ui.btnSelect('Agregar condición', { variant: 'secondary', attrs: 'data-add-cond' })}</div>` : ''}
          ${ui.note('Opciones de “Estado de contrato” y “Canal de venta” de ejemplo: en producto llegan del servicio.')}
        </div>` : '');
    if (!f.refinancingEnabled) return;
    /* "Agregar condición" (ButtonSelect): al elegir, la condición se agrega y el foco vuelve al botón (select → focusTrigger);
       si ya no quedan opciones el botón desaparece y el foco va al control de la condición nueva */
    const addc = sec.refinanciamiento.querySelector('[data-add-cond]');
    if (addc) montarButtonSelect(addc, {
      opciones: () => REFINANCING_CONDITIONS.filter(o => !f.refinancingConditions.some(c => c.type === o.v)),
      onSelect: type => {
        const c = { id: createId('condicion'), type, values: [], comparator: DEFAULT_COMPARATOR[type] ?? '', count: '', amount: null };
        f.refinancingConditions.push(c); drawRefi(); cambio('refinancingConditions');
        (sec.refinanciamiento.querySelector('[data-add-cond]') || sec.refinanciamiento.querySelector(`[data-cond="${c.id}"] .condition__ctrl input, [data-cond="${c.id}"] .condition__ctrl button`))?.focus();
      },
    });
    /* ninguna condición se valida (RefinancingConditionCard) */
    condiciones.forEach(c => {
      const caja = sec.refinanciamiento.querySelector(`[data-cond="${c.id}"]`), meta = condicionMeta(c.type);
      if (meta.opciones) montarAMS(caja.querySelector('[data-cond-ams]'), { id: `condicion-${c.id}`, ariaLabel: meta.label, options: meta.opciones, valor: () => c.values, alCambiar: v => { c.values = v; cambio('refinancingConditions'); } });
      if (c.type === 'renewals' || c.type === 'commission') {
        montarDoble(caja.querySelector('.ds-doble'), {
          options: c.type === 'commission' ? COMMISSION_OPTIONS : COMPARATOR_OPTIONS, valor: () => c.comparator,
          sanitizar: c.type === 'commission' ? sanitizeDecimal : sanitizeInteger,
          alElegir: v => { c.comparator = v; cambio('refinancingConditions'); }, alEscribir: v => { c.count = v; cambio('refinancingConditions'); },
        });
      }
      if (c.type === 'amount') caja.querySelector('[data-cond-monto]').addEventListener('input', e => { c.amount = e.target.value.trim() ? money2num(e.target.value) : null; cambio('refinancingConditions'); });
    });
  }

  /* ---- Simulación del plazo (SimulationTable real) ------------------------- */
  const simCard = q('.sim');
  simCard.innerHTML = `<div class="sim__title" id="plazo-simulacion-title"><h2 class="t-subtitulos">Simulación del plazo</h2><p class="t-caption">Monto de préstamo</p></div>
    <div class="minmax">
      <div class="minmax__item"><span class="t-caption">Mínimo</span><span class="minmax__value" data-sim="min"></span></div>
      <div class="minmax__item"><span class="t-caption">Máximo</span><span class="minmax__value" data-sim="max"></span></div>
    </div>
    <div class="sim__simulate">
      ${ui.field({ id: 'plazo-simular-monto', label: 'Simular con', input: ui.input({ id: 'plazo-simular-monto', value: formatCurrency(simMonto), placeholder: '$', attrs: 'inputmode="decimal" autocomplete="off" data-money data-sim-monto' }) })}
      <div class="rate-line"><span class="t-caption">Interés</span><span data-sim="rate"></span></div>
    </div>
    <div class="sim__summary" aria-live="polite" data-sim="summary"></div>
    ${ui.btn('Tabla de amortización', { variant: 'secondary', iconLeft: 'Table', full: true, attrs: 'data-amort' })}
    ${ui.note('[Por confirmar con negocio] Simulación: tasa del periodo = interés base (fija o la menor de los rangos) + adicionales “durante”, más IVA de 16 %. Manuel: “Pago igual y saldo que no baja”.')}`;
  function updateSim() {
    const s = getAmortizationSummary(f, simMonto ?? 0);
    simCard.querySelector('[data-sim="min"]').textContent = formatCurrency(f.minAmount);
    simCard.querySelector('[data-sim="max"]').textContent = f.maxAmount ? formatCurrency(f.maxAmount) : '-';
    simCard.querySelector('[data-sim="rate"]').innerHTML = ui.chipInfo(pct(s.rate), 'purple');
    const linea = (label, valor) => `<div class="sim__line"><span class="t-caption">${label}</span><span>${valor}</span></div>`;
    simCard.querySelector('[data-sim="summary"]').innerHTML = linea('Monto mutuo', formatCurrency(simMonto))
      + linea('Interés', formatCurrency(s.interest)) + linea('Refrendo (Interés+IVA)', formatCurrency(s.renewal))
      + `<div class="sim__total"><span>Desempeño</span><span>${formatCurrency(s.payoff)}</span></div>`;
  }
  /* Tabla de amortización: modal large sin pie; tabla de 640 mínimo con scroll dentro del modal */
  function abrirAmortizacion() {
    const filas = buildAmortization(f, simMonto ?? 0).map(r => [r.date, formatCurrency(r.amount), formatCurrency(r.interest), formatCurrency(r.iva), formatCurrency(r.renewal), formatCurrency(r.payoff)]);
    openModal({ title: 'Tabla de amortización', size: 'large', body: ui.tabla('Tabla de amortización', ['Fecha', 'Mutuo', 'Interés', 'IVA', 'Refrendo', 'Desempeño'], filas, 'ds-table--amort') });
  }

  /* ---- Eventos del formulario ---------------------------------------------- */
  form.addEventListener('input', e => {
    const el = e.target;
    if (el.matches('[data-sim-monto]')) { simMonto = money2num(el.value); updateSim(); return; }
    if (el.dataset.rk) { editarRango(el); return; }
    const k = el.dataset.k; if (!k) return;
    let v = el.value;
    const limpia = el.hasAttribute('data-int') ? sanitizeInteger(v) : el.hasAttribute('data-dec') ? sanitizeDecimal(v) : v;
    if (limpia !== v) { el.value = limpia; v = limpia; }
    f[k] = el.hasAttribute('data-money') ? (v.trim() ? money2num(v) : null) : v;
    if (k === 'startDate') actualizarHoy();
    cambio(k);
  });
  form.addEventListener('change', e => {
    const el = e.target;
    if (el.matches('[data-rate-type]')) {
      f.rateType = el.value; drawTasa(); q(`[data-rate-type][value="${el.value}"]`)?.focus();
      cambio('rateType'); if (submitted) { validar('rate'); validar('ranges'); }
      return;
    }
    if (el.matches('[data-proration]')) { f.proration = el.checked; cambio('proration'); return; }
    const sw = el.dataset.switch; if (!sw) return;
    f[sw] = el.checked;
    if (sw === 'renewalsLimited') { drawRefrendos(); if (submitted) validar('renewals'); }
    if (sw === 'targetEnabled' || sw === 'refinancingEnabled') actualizarPar();
    if (sw === 'targetEnabled') { drawCliente(); q('#plazo-cliente-switch').focus(); if (submitted) { validar('ageMin'); validar('ageMax'); } }
    if (sw === 'refinancingEnabled') { drawRefi(); q('#plazo-refinanciamiento-switch').focus(); }
    cambio(sw);
  });
  /* montos: sin formato al entrar y con $, miles y 2 decimales al salir */
  form.addEventListener('focusin', e => { if (e.target.matches('[data-money]')) { const n = money2num(e.target.value); e.target.value = n == null ? '' : n; } });
  form.addEventListener('focusout', e => { if (e.target.matches('[data-money]')) { const n = money2num(e.target.value); e.target.value = n == null ? '' : formatCurrency(n); } });
  root.addEventListener('click', e => {
    const t = e.target;
    if (t.closest('[data-cancel]')) { leave(isEdit ? `#/plazos/${original.id}` : '#/plazos'); return; }
    if (t.closest('[data-agregar-fin]')) { conFin = true; drawDetalles(); q('#plazo-fin').focus(); return; }
    if (t.closest('[data-quitar-fin]')) { f.endDate = ''; delete errors.endDate; conFin = false; hideTip(); drawDetalles(); q('[data-agregar-fin]').focus(); cambio('endDate'); return; }
    if (t.closest('[data-seg-expand]')) { abrirArbolAmpliado(); return; }
    if (t.closest('[data-add-interes]')) { interesModal(null); return; }
    const ed = t.closest('[data-edit-interes]'); if (ed) { interesModal(f.additionalInterests.find(a => a.id === ed.dataset.editInteres)); return; }
    /* borrar uno o todos es inmediato, sin confirmación ni toast */
    const del = t.closest('[data-del-interes]');
    if (del) {
      const i = f.additionalInterests.findIndex(a => a.id === del.dataset.delInteres);
      f.additionalInterests.splice(i, 1); drawIntereses(); cambio('additionalInterests');
      const resto = [...sec.intereses.querySelectorAll('[data-del-interes]')];
      (resto[Math.min(i, resto.length - 1)] || sec.intereses.querySelector('[data-add-interes]')).focus();
      return;
    }
    if (t.closest('[data-borrar-intereses]')) { f.additionalInterests = []; drawIntereses(); cambio('additionalInterests'); sec.intereses.querySelector('[data-add-interes]').focus(); return; }
    const dr = t.closest('[data-del-rango]');
    if (dr) {
      const i = +dr.dataset.delRango;
      guardarRangos(f.ranges.filter((_, j) => j !== i)); drawRangos(); cambio('ranges');
      (q(`[data-del-rango="${i - 1}"]`) || q('[data-rango="0"][data-rk="to"]'))?.focus();
      return;
    }
    const dc = t.closest('[data-del-cond]');
    if (dc) {
      f.refinancingConditions = f.refinancingConditions.filter(c => c.id !== dc.dataset.delCond); drawRefi(); cambio('refinancingConditions');
      (sec.refinanciamiento.querySelector('[data-add-cond]') || q('#plazo-refinanciamiento-switch')).focus();
      return;
    }
    if (t.closest('[data-amort]')) abrirAmortizacion();
  });

  /* ---- Enviar (submit del form; Enter en un campo también envía) ------------- */
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (saving) return; /* el botón no se deshabilita: los envíos repetidos se ignoran */
    submitted = true;
    CAMPOS.forEach(validar);
    const conError = Object.keys(errors);
    if (conError.length) {
      const sid = PLAZO_FORM_SECTIONS.find(s => conError.some(k => PLAZO_FIELD_SECTION[k] === s));
      const card = document.getElementById(sid);
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      card.querySelector('input, textarea, button')?.focus({ preventScroll: true });
      return;
    }
    guardar();
  });
  function guardar() {
    saving = true;
    const btn = q('[data-submit]');
    const t = (() => {
      saving = false; btn.removeAttribute('aria-busy'); btn.querySelector('.ds-spinner')?.remove();
      if (demo.action === 'error') { showToast({ type: 'error', title: 'Error', message: 'No se pudo completar la acción. Intenta de nuevo.' }); return; }
      /* se descartan las filas de rangos sin "hasta" y sin interés */
      const valores = { ...clone(f), name: f.name.trim(), ranges: f.ranges.filter(r => r.to || r.rate) };
      let plazo;
      if (isEdit) plazo = { ...valores, id: original.id, status: original.status === 'Borrador' ? estadoPorInicio(valores.startDate) : original.status };
      else {
        sequence += 1;
        plazo = { ...valores, id: sequence, status: estadoPorInicio(valores.startDate) };
        /* F-40 (por confirmar): la sugerencia usada sale de "Plazos sugeridos" */
        if (sug) { [db, store].forEach(o => { o.sugerencias = o.sugerencias.filter(s => s.suggestedTermId !== sug.suggestedTermId); }); }
      }
      upsert(plazo);
      dirty = false;
      showToast(isEdit ? { title: 'Plazo guardado exitosamente', message: 'Los cambios del plazo se guardaron' } : { title: 'Plazo creado exitosamente', message: 'Se agregó un nuevo plazo a tu lista de plazos' });
      go(`#/plazos/${plazo.id}`);
    })();
  }

  /* ---- Salir con cambios sin guardar (F-38, regla de la maqueta) ------------- */
  function leave(dest) {
    const ir = () => (dest.startsWith('#/') ? go(dest) : (location.href = dest));
    if (!dirty) { ir(); return; }
    confirmModal({
      title: '¿Salir sin guardar?', text: 'Perderás los cambios que hiciste en este plazo.',
      confirmLabel: 'Descartar cambios', variant: 'destructive',
      onConfirm: () => { dirty = false; closeModal(); ir(); },
    });
  }
  /* Atrás del navegador con cambios sin guardar: misma confirmación que Cancelar */
  salidaForm = dest => { if (!dirty) return false; leave(dest); return true; };
  cleanup.push(() => { salidaForm = null; });
  main.querySelectorAll('.ds-breadcrumb a').forEach(a => a.addEventListener('click', e => { if (dirty) { e.preventDefault(); leave(a.getAttribute('href')); } }));
  const beforeUnload = e => { if (dirty) { e.preventDefault(); e.returnValue = ''; } };
  window.addEventListener('beforeunload', beforeUnload);
  cleanup.push(() => window.removeEventListener('beforeunload', beforeUnload));

  drawDetalles(); drawSegmentacion(); drawCondiciones(); drawIntereses(); drawCliente(); drawRefi(); actualizarPar(); updateSim();
}

/* ==========================================================================
   Panel "Estados de la maqueta" (equivale al ScenarioBar de la vista previa)
   ========================================================================== */
/* la pestaña del riel que lo abre y cierra la pone ../demo.js (data-proto-panel en index.html) */
/* cambiar de escenario equivale a key={scenario}: vuelve a sembrar, reinicia el listado y regresa a él con carga inicial */
function aplicarEscenario() {
  sembrar();
  Object.assign(listState, listStateInicial()); busq.activo = 0; busq.cerrada = false; focoAlVolver = null;
  cargarTodo();
  go('#/plazos', true);
}
document.getElementById('demo-load').addEventListener('change', e => { demo.escenario = e.target.value; aplicarEscenario(); });
document.getElementById('demo-action').addEventListener('change', e => { demo.action = e.target.value; });
document.getElementById('demo-notes').addEventListener('change', e => document.body.classList.toggle('show-notes', e.target.checked));
document.getElementById('demo-reset').addEventListener('click', () => {
  aplicarEscenario();
  showToast({ title: 'Datos restablecidos', message: 'La maqueta volvió a sus datos de ejemplo.' });
});

sembrar();
cargarTodo();
route();
})();
