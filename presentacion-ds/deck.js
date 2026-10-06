/* Presentación del Design System Ataskate.
   → / espacio avanzan (primero los pasos de la lámina, luego la siguiente lámina); ← regresa; F pantalla completa.
   Íconos: los del DS de QA (qa.ataskate.com.mx/design-system), pintados con currentColor. */
(() => {
  const ICONS = {
    Add: 'M11 19V13H5V11H11V5H13V11H19V13H13V19H11Z',
    Info: ['0 0 20 20', 'M9 15H11V9H9V15ZM10 7C10.2833 7 10.5208 6.90417 10.7125 6.7125C10.9042 6.52083 11 6.28333 11 6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6C9 6.28333 9.09583 6.52083 9.2875 6.7125C9.47917 6.90417 9.71667 7 10 7ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z'],
    ArrowForwardIos: 'M9.4 18L8 16.6L12.6 12L8 7.4L9.4 6L15.4 12L9.4 18Z',
    ArrowBackIos: 'M14.6 6L16 7.4L11.4 12L16 16.6L14.6 18L8.59998 12L14.6 6Z',
    Sync: 'M4 20V18H6.75L6.35 17.65C5.48333 16.8833 4.875 16.0083 4.525 15.025C4.175 14.0417 4 13.05 4 12.05C4 10.2 4.554 8.554 5.662 7.112C6.77067 5.67067 8.21667 4.71667 10 4.25V6.35C8.8 6.78333 7.83333 7.52067 7.1 8.562C6.36667 9.604 6 10.7667 6 12.05C6 12.8 6.14167 13.529 6.425 14.237C6.70833 14.9457 7.15 15.6 7.75 16.2L8 16.45V14H10V20H4ZM14 19.75V17.65C15.2 17.2167 16.1667 16.4793 16.9 15.438C17.6333 14.396 18 13.2333 18 11.95C18 11.2 17.8583 10.4707 17.575 9.762C17.2917 9.054 16.85 8.4 16.25 7.8L16 7.55V10H14V4H20V6H17.25L17.65 6.35C18.4667 7.16667 19.0627 8.054 19.438 9.012C19.8127 9.97067 20 10.95 20 11.95C20 13.8 19.4457 15.4457 18.337 16.887C17.229 18.329 15.7833 19.2833 14 19.75Z',
    Check: 'M9.54998 18.0001L3.84998 12.3001L5.27498 10.8751L9.54998 15.1501L18.725 5.9751L20.15 7.4001L9.54998 18.0001Z',
    CheckCircle: 'M10.6 16.6L17.65 9.55L16.25 8.15L10.6 13.8L7.75 10.95L6.35 12.35L10.6 16.6ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z',
    Inventory: 'M11 21H5C4.45 21 3.979 20.8043 3.587 20.413C3.19567 20.021 3 19.55 3 19V5C3 4.45 3.19567 3.979 3.587 3.587C3.979 3.19567 4.45 3 5 3H9.175C9.35833 2.41667 9.71667 1.93733 10.25 1.562C10.7833 1.18733 11.3667 1 12 1C12.6667 1 13.2627 1.18733 13.788 1.562C14.3127 1.93733 14.6667 2.41667 14.85 3H19C19.55 3 20.021 3.19567 20.413 3.587C20.8043 3.979 21 4.45 21 5V10H19V5H17V8H7V5H5V19H11V21ZM15.5 19.925L11.25 15.675L12.65 14.275L15.5 17.125L21.15 11.475L22.55 12.875L15.5 19.925ZM12 5C12.2833 5 12.521 4.904 12.713 4.712C12.9043 4.52067 13 4.28333 13 4C13 3.71667 12.9043 3.479 12.713 3.287C12.521 3.09567 12.2833 3 12 3C11.7167 3 11.4793 3.09567 11.288 3.287C11.096 3.479 11 3.71667 11 4C11 4.28333 11.096 4.52067 11.288 4.712C11.4793 4.904 11.7167 5 12 5Z',
    Storefront: 'M21.0251 11.05V19C21.0251 19.55 20.8293 20.0208 20.4376 20.4125C20.0459 20.8042 19.5751 21 19.0251 21H5.02509C4.47509 21 4.00425 20.8042 3.61259 20.4125C3.22092 20.0208 3.02509 19.55 3.02509 19V11.05C2.64175 10.7 2.34592 10.25 2.13759 9.7C1.92925 9.15 1.92509 8.55 2.12509 7.9L3.17509 4.5C3.30842 4.06667 3.54592 3.70833 3.88759 3.425C4.22925 3.14167 4.62509 3 5.07509 3H18.9751C19.4251 3 19.8168 3.1375 20.1501 3.4125C20.4834 3.6875 20.7251 4.05 20.8751 4.5L21.9251 7.9C22.1251 8.55 22.1209 9.14167 21.9126 9.675C21.7043 10.2083 21.4084 10.6667 21.0251 11.05ZM14.2251 10C14.6751 10 15.0168 9.84583 15.2501 9.5375C15.4834 9.22917 15.5751 8.88333 15.5251 8.5L14.9751 5H13.0251V8.7C13.0251 9.05 13.1418 9.35417 13.3751 9.6125C13.6084 9.87083 13.8918 10 14.2251 10ZM9.72509 10C10.1084 10 10.4209 9.87083 10.6626 9.6125C10.9043 9.35417 11.0251 9.05 11.0251 8.7V5H9.07509L8.52509 8.5C8.45842 8.9 8.54592 9.25 8.78759 9.55C9.02926 9.85 9.34176 10 9.72509 10ZM5.27509 10C5.57509 10 5.83759 9.89167 6.06259 9.675C6.28759 9.45833 6.42509 9.18333 6.47509 8.85L7.02509 5H5.07509L4.07509 8.35C3.97509 8.68333 4.02925 9.04167 4.23759 9.425C4.44592 9.80833 4.79175 10 5.27509 10ZM18.7751 10C19.2584 10 19.6084 9.80833 19.8251 9.425C20.0418 9.04167 20.0918 8.68333 19.9751 8.35L18.9251 5H17.0251L17.5751 8.85C17.6251 9.18333 17.7626 9.45833 17.9876 9.675C18.2126 9.89167 18.4751 10 18.7751 10ZM5.02509 19H19.0251V11.95C18.9418 11.9833 18.8876 12 18.8626 12H18.7751C18.3251 12 17.9293 11.925 17.5876 11.775C17.2459 11.625 16.9084 11.3833 16.5751 11.05C16.2751 11.35 15.9334 11.5833 15.5501 11.75C15.1668 11.9167 14.7584 12 14.3251 12C13.8751 12 13.4543 11.9167 13.0626 11.75C12.6709 11.5833 12.3251 11.35 12.0251 11.05C11.7418 11.35 11.4126 11.5833 11.0376 11.75C10.6626 11.9167 10.2584 12 9.82509 12C9.34175 12 8.90426 11.9167 8.51259 11.75C8.12092 11.5833 7.77509 11.35 7.47509 11.05C7.12509 11.4 6.77925 11.6458 6.43759 11.7875C6.09592 11.9292 5.70842 12 5.27509 12H5.16259C5.12092 12 5.07509 11.9833 5.02509 11.95V19Z',
    Search: 'M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.146 15.371 4.888 14.113C3.62933 12.8543 3 11.3167 3 9.5C3 7.68333 3.62933 6.14567 4.888 4.887C6.146 3.629 7.68333 3 9.5 3C11.3167 3 12.8543 3.629 14.113 4.887C15.371 6.14567 16 7.68333 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8127 13.5627 12.688 12.688C13.5627 11.8127 14 10.75 14 9.5C14 8.25 13.5627 7.18733 12.688 6.312C11.8127 5.43733 10.75 5 9.5 5C8.25 5 7.18733 5.43733 6.312 6.312C5.43733 7.18733 5 8.25 5 9.5C5 10.75 5.43733 11.8127 6.312 12.688C7.18733 13.5627 8.25 14 9.5 14Z',
    Close: 'M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z',
    CompareArrows: 'M8 20L6.6 18.575L9.175 16H2V14H9.175L6.6 11.425L8 10L13 15L8 20ZM16 14L11 9L16 4L17.4 5.425L14.825 8H22V10H14.825L17.4 12.575L16 14Z',
    Checklist: 'M5.55 18.9998L2 15.4498L3.4 14.0498L5.525 16.1748L9.775 11.9248L11.175 13.3498L5.55 18.9998ZM5.55 10.9998L2 7.4498L3.4 6.0498L5.525 8.1748L9.775 3.9248L11.175 5.3498L5.55 10.9998ZM13 16.9998V14.9998H22V16.9998H13ZM13 8.9998V6.9998H22V8.9998H13Z',
    GridView: 'M3 11V3H11V11H3ZM3 21V13H11V21H3ZM13 11V3H21V11H13ZM13 21V13H21V21H13ZM5 9H9V5H5V9ZM15 9H19V5H15V9ZM15 19H19V15H15V19ZM5 19H9V15H5V19Z',
    TextFields: 'M7 20V7H2V4H15V7H10V20H7ZM16 20V12H13V9H22V12H19V20H16Z',
    Category: 'M6.5 11L12 2L17.5 11H6.5ZM17.5 22C16.25 22 15.1875 21.5625 14.3125 20.6875C13.4375 19.8125 13 18.75 13 17.5C13 16.25 13.4375 15.1875 14.3125 14.3125C15.1875 13.4375 16.25 13 17.5 13C18.75 13 19.8125 13.4375 20.6875 14.3125C21.5625 15.1875 22 16.25 22 17.5C22 18.75 21.5625 19.8125 20.6875 20.6875C19.8125 21.5625 18.75 22 17.5 22ZM3 21.5V13.5H11V21.5H3ZM17.5 20C18.2 20 18.7917 19.7583 19.275 19.275C19.7583 18.7917 20 18.2 20 17.5C20 16.8 19.7583 16.2083 19.275 15.725C18.7917 15.2417 18.2 15 17.5 15C16.8 15 16.2083 15.2417 15.725 15.725C15.2417 16.2083 15 16.8 15 17.5C15 18.2 15.2417 18.7917 15.725 19.275C16.2083 19.7583 16.8 20 17.5 20ZM5 19.5H9V15.5H5V19.5ZM10.05 9H13.95L12 5.85L10.05 9Z',
    TrendingUp: 'M3.4 18L2 16.6L9.4 9.15L13.4 13.15L18.6 8H16V6H22V12H20V9.4L13.4 16L9.4 12L3.4 18Z',
    Group: 'M1 20V17.2C1 16.6333 1.146 16.1123 1.438 15.637C1.72933 15.1623 2.11667 14.8 2.6 14.55C3.63333 14.0333 4.68333 13.6457 5.75 13.387C6.81667 13.129 7.9 13 9 13C10.1 13 11.1833 13.129 12.25 13.387C13.3167 13.6457 14.3667 14.0333 15.4 14.55C15.8833 14.8 16.2707 15.1623 16.562 15.637C16.854 16.1123 17 16.6333 17 17.2V20H1ZM19 20V17C19 16.2667 18.796 15.5623 18.388 14.887C17.9793 14.2123 17.4 13.6333 16.65 13.15C17.5 13.25 18.3 13.4207 19.05 13.662C19.8 13.904 20.5 14.2 21.15 14.55C21.75 14.8833 22.2083 15.254 22.525 15.662C22.8417 16.0707 23 16.5167 23 17V20H19ZM9 12C7.9 12 6.95833 11.6083 6.175 10.825C5.39167 10.0417 5 9.1 5 8C5 6.9 5.39167 5.95833 6.175 5.175C6.95833 4.39167 7.9 4 9 4C10.1 4 11.0417 4.39167 11.825 5.175C12.6083 5.95833 13 6.9 13 8C13 9.1 12.6083 10.0417 11.825 10.825C11.0417 11.6083 10.1 12 9 12ZM15 12C14.8167 12 14.5833 11.9793 14.3 11.938C14.0167 11.896 13.7833 11.85 13.6 11.8C14.05 11.2667 14.3957 10.675 14.637 10.025C14.879 9.375 15 8.7 15 8C15 7.3 14.879 6.625 14.637 5.975C14.3957 5.325 14.05 4.73333 13.6 4.2C13.8333 4.11667 14.0667 4.06233 14.3 4.037C14.5333 4.01233 14.7667 4 15 4C16.1 4 17.0417 4.39167 17.825 5.175C18.6083 5.95833 19 6.9 19 8C19 9.1 18.6083 10.0417 17.825 10.825C17.0417 11.6083 16.1 12 15 12ZM3 18H15V17.2C15 17.0167 14.9543 16.85 14.863 16.7C14.771 16.55 14.65 16.4333 14.5 16.35C13.6 15.9 12.6917 15.5623 11.775 15.337C10.8583 15.1123 9.93333 15 9 15C8.06667 15 7.14167 15.1123 6.225 15.337C5.30833 15.5623 4.4 15.9 3.5 16.35C3.35 16.4333 3.22933 16.55 3.138 16.7C3.046 16.85 3 17.0167 3 17.2V18ZM9 10C9.55 10 10.021 9.804 10.413 9.412C10.8043 9.02067 11 8.55 11 8C11 7.45 10.8043 6.97933 10.413 6.588C10.021 6.196 9.55 6 9 6C8.45 6 7.97933 6.196 7.588 6.588C7.196 6.97933 7 7.45 7 8C7 8.55 7.196 9.02067 7.588 9.412C7.97933 9.804 8.45 10 9 10Z',
    Lock: 'M6 22C5.45 22 4.97917 21.8042 4.5875 21.4125C4.19583 21.0208 4 20.55 4 20V10C4 9.45 4.19583 8.97917 4.5875 8.5875C4.97917 8.19583 5.45 8 6 8H7V6C7 4.61667 7.4875 3.4375 8.4625 2.4625C9.4375 1.4875 10.6167 1 12 1C13.3833 1 14.5625 1.4875 15.5375 2.4625C16.5125 3.4375 17 4.61667 17 6V8H18C18.55 8 19.0208 8.19583 19.4125 8.5875C19.8042 8.97917 20 9.45 20 10V20C20 20.55 19.8042 21.0208 19.4125 21.4125C19.0208 21.8042 18.55 22 18 22H6ZM6 20H18V10H6V20ZM12 17C12.55 17 13.0208 16.8042 13.4125 16.4125C13.8042 16.0208 14 15.55 14 15C14 14.45 13.8042 13.9792 13.4125 13.5875C13.0208 13.1958 12.55 13 12 13C11.45 13 10.9792 13.1958 10.5875 13.5875C10.1958 13.9792 10 14.45 10 15C10 15.55 10.1958 16.0208 10.5875 16.4125C10.9792 16.8042 11.45 17 12 17ZM9 8H15V6C15 5.16667 14.7083 4.45833 14.125 3.875C13.5417 3.29167 12.8333 3 12 3C11.1667 3 10.4583 3.29167 9.875 3.875C9.29167 4.45833 9 5.16667 9 6V8Z',
    Schedule: 'M15.3 16.7L16.7 15.3L13 11.6V7H11V12.4L15.3 16.7ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2167 20 16.1042 19.2208 17.6625 17.6625C19.2208 16.1042 20 14.2167 20 12C20 9.78333 19.2208 7.89583 17.6625 6.3375C16.1042 4.77917 14.2167 4 12 4C9.78333 4 7.89583 4.77917 6.3375 6.3375C4.77917 7.89583 4 9.78333 4 12C4 14.2167 4.77917 16.1042 6.3375 17.6625C7.89583 19.2208 9.78333 20 12 20Z',
    Edit: 'M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3043 2.75 17.863 2.75C18.421 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.571 21.275 6.113C21.2917 6.65433 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z',
    Delete: 'M7.80775 20.8845C7.30908 20.8845 6.88308 20.7079 6.52975 20.3547C6.17658 20.0014 6 19.5754 6 19.0768V6.3845H5V4.8845H9.5V4H15.5V4.8845H20V6.3845H19V19.0768C19 19.5819 18.825 20.0095 18.475 20.3595C18.125 20.7095 17.6974 20.8845 17.1923 20.8845H7.80775ZM17.5 6.3845H7.5V19.0768C7.5 19.1666 7.52883 19.2403 7.5865 19.298C7.64417 19.3557 7.71792 19.3845 7.80775 19.3845H17.1923C17.2692 19.3845 17.3398 19.3524 17.4038 19.2883C17.4679 19.2243 17.5 19.1538 17.5 19.0768V6.3845ZM9.904 17.3845H11.4037V8.3845H9.904V17.3845ZM13.5962 17.3845H15.096V8.3845H13.5962V17.3845Z',
    Photos: 'M9 14H19L15.55 9.5L13.25 12.5L11.7 10.5L9 14ZM8 18C7.45 18 6.97917 17.8042 6.5875 17.4125C6.19583 17.0208 6 16.55 6 16V4C6 3.45 6.19583 2.97917 6.5875 2.5875C6.97917 2.19583 7.45 2 8 2H20C20.55 2 21.0208 2.19583 21.4125 2.5875C21.8042 2.97917 22 3.45 22 4V16C22 16.55 21.8042 17.0208 21.4125 17.4125C21.0208 17.8042 20.55 18 20 18H8ZM8 16H20V4H8V16ZM4 22C3.45 22 2.97917 21.8042 2.5875 21.4125C2.19583 21.0208 2 20.55 2 20V6H4V20H18V22H4Z',
    AddPhotoAlternate: 'M5 21C4.45 21 3.97917 20.8042 3.5875 20.4125C3.19583 20.0208 3 19.55 3 19V5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3H13V5H5V19H19V11H21V19C21 19.55 20.8042 20.0208 20.4125 20.4125C20.0208 20.8042 19.55 21 19 21H5ZM6 17H18L14.25 12L11.25 16L9 13L6 17ZM17 9V7H15V5H17V3H19V5H21V7H19V9H17Z',
    MoreVert: 'M12 20C11.45 20 10.9793 19.8043 10.588 19.413C10.196 19.021 10 18.55 10 18C10 17.45 10.196 16.979 10.588 16.587C10.9793 16.1957 11.45 16 12 16C12.55 16 13.021 16.1957 13.413 16.587C13.8043 16.979 14 17.45 14 18C14 18.55 13.8043 19.021 13.413 19.413C13.021 19.8043 12.55 20 12 20ZM12 14C11.45 14 10.9793 13.804 10.588 13.412C10.196 13.0207 10 12.55 10 12C10 11.45 10.196 10.979 10.588 10.587C10.9793 10.1957 11.45 10 12 10C12.55 10 13.021 10.1957 13.413 10.587C13.8043 10.979 14 11.45 14 12C14 12.55 13.8043 13.0207 13.413 13.412C13.021 13.804 12.55 14 12 14ZM12 8C11.45 8 10.9793 7.804 10.588 7.412C10.196 7.02067 10 6.55 10 6C10 5.45 10.196 4.97933 10.588 4.588C10.9793 4.196 11.45 4 12 4C12.55 4 13.021 4.196 13.413 4.588C13.8043 4.97933 14 5.45 14 6C14 6.55 13.8043 7.02067 13.413 7.412C13.021 7.804 12.55 8 12 8Z',
    // Dropzone del DS (flecha hacia arriba con base)
    Upload: 'M9 16H15V10H19L12 3L5 10H9V16ZM5 18H19V20H5V18Z',
    // chevron de trazo del Select del DS
    Chevron: { stroke: 'M7 10L12 15L17 10' },
  };
  // íconos genéricos de línea fina para la versión "Square" (no son del DS a propósito)
  const SQ = {
    chev: '<path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    info: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 11v5M12 8v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    sync: '<path d="M4 8h13l-3-3M20 16H7l3 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    down: '<path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    plus: '<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    up: '<path d="M12 15V5M8 9l4-4 4 4M5 15v4h14v-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  };
  function svgDS(name, cls) {
    const v = ICONS[name];
    if (!v) return '';
    let vb = '0 0 24 24', body;
    if (Array.isArray(v)) { vb = v[0]; body = `<path d="${v[1]}" fill="currentColor"/>`; }
    else if (typeof v === 'object') body = `<path d="${v.stroke}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    else body = `<path d="${v}" fill="currentColor"/>`;
    return `<svg ${cls ? `class="${cls}" ` : ''}viewBox="${vb}" aria-hidden="true">${body}</svg>`;
  }
  function paintIcons(root) {
    root.querySelectorAll('[data-i]').forEach((el) => { if (!el.firstChild) el.innerHTML = svgDS(el.dataset.i); });
    root.querySelectorAll('[data-sq]').forEach((el) => {
      el.innerHTML = `<svg class="i-sq" viewBox="0 0 24 24" aria-hidden="true">${SQ[el.dataset.sq]}</svg>${svgDS(el.dataset.i2, 'i-at')}`;
    });
  }

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const stage = $('#stage');
  const slides = $$('.slide');
  const total = slides.length;
  let cur = -1, step = 0, busy = false, token = 0;

  // ---------- montaje ----------
  // las palabras de los títulos entran una por una
  $$('.words').forEach((h) => {
    let i = 0;
    const wrap = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((t) => {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(t)); return; }
            const s = document.createElement('span'); s.className = 'w'; s.style.setProperty('--i', i++); s.textContent = t; frag.appendChild(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) wrap(n);
      });
    };
    wrap(h);
  });
  $$('[data-d]').forEach((el) => el.style.setProperty('--d', `${el.dataset.d}s`));

  // el editor (Square → Ataskate) sale de la plantilla: uno para la transformación y dos para el antes/después
  const tpl = $('#edTpl');
  const mkEditor = (host, cls) => {
    const n = tpl.content.firstElementChild.cloneNode(true);
    if (cls) n.classList.add(...cls.split(' '));
    host.appendChild(n);
    return n;
  };
  const ED_STEPS = ['t-base', 't-head', 't-fields', 't-desc', 't-vis', 't-media'];
  const ed = mkEditor($('#edHost'));
  mkEditor($('#baA'));
  mkEditor($('#baB'), ED_STEPS.join(' '));

  paintIcons(document);

  // ---------- escala del escenario ----------
  function fit() {
    const s = Math.min(innerWidth / 1600, (innerHeight - 8) / 900);
    stage.style.setProperty('--s', s);
  }
  addEventListener('resize', fit);
  fit();

  // ---------- navegación ----------
  const maxSteps = (sl) => +(sl.dataset.steps || 0);
  function showSteps(sl, k) {
    $$('[data-step]', sl).forEach((el) => el.classList.toggle('is-shown', +el.dataset.step <= k));
  }
  function go(i, dir = 1, atEnd = false) {
    if (i < 0 || i >= total || i === cur) return;
    const prev = slides[cur];
    const next = slides[i];
    const t = ++token;
    slides.forEach((s) => { if (s !== prev && s !== next) { clearTimeout(s._lt); s.classList.remove('leave-fwd', 'leave-back'); } });
    if (prev) {
      prev.classList.remove('is-on', 'enter-fwd', 'enter-back');
      prev.classList.add(dir > 0 ? 'leave-fwd' : 'leave-back');
      clearTimeout(prev._lt);
      prev._lt = setTimeout(() => prev.classList.remove('leave-fwd', 'leave-back'), 700);
      leave(prev);
    }
    clearTimeout(next._lt);
    cur = i;
    step = atEnd ? maxSteps(next) : 0;
    next.classList.remove('leave-fwd', 'leave-back');
    // reinicia las animaciones de entrada
    void next.offsetWidth;
    next.classList.add('is-on', dir > 0 ? 'enter-fwd' : 'enter-back');
    showSteps(next, step);
    enter(next, t, step);
    $('#bar').style.width = `${((i + 1) / total) * 100}%`;
    $('#num').textContent = `${i + 1} / ${total}`;
    if (location.hash !== `#${i + 1}`) history.replaceState(null, '', `#${i + 1}`);
  }
  function next() {
    const sl = slides[cur];
    if (step < maxSteps(sl)) { step++; showSteps(sl, step); onStep(sl, step); return; }
    go(cur + 1, 1);
  }
  function prev() {
    const sl = slides[cur];
    if (step > 0) { step--; showSteps(sl, step); onStep(sl, step, true); return; }
    go(cur - 1, -1, true);
  }

  // ---------- comportamiento por lámina ----------
  const HOOKS = {
    counters: {
      enter(sl, t) {
        $$('[data-count]', sl).forEach((el) => {
          const to = +el.dataset.count; const t0 = performance.now() + 1500; const dur = 1400;
          el.textContent = '0';
          const tick = (now) => {
            if (t !== token) return;
            const p = Math.min(1, Math.max(0, (now - t0) / dur));
            el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
    },
    button: {
      enter(sl, t, k) { btn(k); },
      step(sl, k) { btn(k); },
    },
    editor: {
      enter(sl, t, k) { editor(k, false); },
      step(sl, k, back) { editor(k, !back); },
    },
    ba: { enter(sl, t) { baSweep(t); } },
    prod: {
      enter(sl) {
        $$('iframe[data-src]', sl).forEach((f) => {
          if (f.src) return;
          f.addEventListener('load', () => {
            try {
              const st = f.contentDocument.createElement('style');
              st.textContent = '.demo-rail, .demo-tab, .demo-menu, [class^="cm-"], [class*=" cm-"] { display: none !important; }';
              f.contentDocument.head.appendChild(st);
            } catch (e) { /* otro origen: se queda como está */ }
          }, { once: true });
          f.src = f.dataset.src;
        });
      },
    },
    // beneficios y, en el paso 1, el cierre con confeti
    end: {
      enter(sl, t, k) { thanks(sl, k >= 1); },
      step(sl, k) { thanks(sl, k >= 1); },
    },
  };
  function enter(sl, t, k) { const h = HOOKS[sl.dataset.hook]; if (h && h.enter) h.enter(sl, t, k); }
  function onStep(sl, k, back) { const h = HOOKS[sl.dataset.hook]; if (h && h.step) h.step(sl, k, back); }
  function leave(sl) { const h = HOOKS[sl.dataset.hook]; if (h && h.leave) h.leave(sl); }

  // comparación del botón: un cambio del DS por paso
  function btn(k) {
    const m = $('#morph');
    ['b-color', 'b-shape', 'b-font', 'b-size', 'b-text'].forEach((c, i) => m.classList.toggle(c, k > i));
    $$('.spec__row').forEach((r) => r.classList.toggle('is-done', +r.dataset.row <= k));
    $('#btnTag').textContent = k >= 5 ? 'Ataskate DS · Primary Large' : k ? 'Transformando…' : 'Referencia: Square';
  }

  // editor de artículo: cada paso pasa una zona al DS y la cámara se acerca a esa zona
  const host = $('#edHost');
  const VIEW = { w: 972, h: 628, z: 0.7136 };
  function camera(zone) {
    if (!zone) { host.style.transform = `scale(${VIEW.z})`; return; }
    let x = 0, y = 0, el = zone;
    while (el && el !== ed) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; }
    const z = 1.05, cx = x + zone.offsetWidth / 2, cy = y + zone.offsetHeight / 2;
    const tx = Math.min(0, Math.max(VIEW.w - 1360 * z, VIEW.w / 2 - cx * z));
    const ty = Math.min(0, Math.max(VIEW.h - 880 * z, VIEW.h / 2 - cy * z));
    host.style.transform = `translate(${tx}px, ${ty}px) scale(${z})`;
  }
  const ZONES = { 3: '.ed-col', 4: '.z-desc', 5: '.z-vis', 6: '.z-media' };
  async function editor(k, animate) {
    ED_STEPS.forEach((c, i) => ed.classList.toggle(c, k > i));
    const items = $$('.ed-step');
    items.forEach((el, i) => { el.classList.toggle('is-done', i < k); el.classList.toggle('is-now', i === k - 1 && k < 6); });
    $('#edUrl').textContent = k >= 2 ? 'ataskate · Inventario · Agregar artículo' : 'Referencia: Square · Add Item (recreación)';
    const etb = $('.etb', ed), wrap = $('.etb-wrap', ed);
    wrap.classList.remove('is-bad'); etb.classList.remove('is-bad');
    camera(animate && ZONES[k] ? $(ZONES[k], ed) : null);
    if (animate) {
      const zone = { 1: '.ed-card', 2: '.ed-head', 3: '.z-fields', 4: '.z-desc .eta', 5: '.eseg', 6: '.emedia' }[k];
      const el = zone && $(zone, ed);
      if (el) { el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }
    }
    const t = token;
    if (k === 4 && animate) {
      // la barra de formato se muestra marcada un momento antes de irse
      ed.classList.remove('t-desc'); wrap.classList.add('is-bad'); etb.classList.add('is-bad');
      await wait(1300); if (t !== token || step !== 4) return;
      wrap.classList.remove('is-bad'); etb.classList.remove('is-bad'); ed.classList.add('t-desc');
    }
    if (k === 6 && animate) {
      // al terminar, la cámara se aleja para ver la página completa
      await wait(2600); if (t !== token || step !== 6) return;
      camera(null);
    }
  }

  // antes / después con jalador
  const ba = $('#ba');
  let baDrag = false, baUser = false;
  const setX = (p) => ba.style.setProperty('--x', `${Math.max(0, Math.min(100, p))}%`);
  const fromEvent = (e) => { const r = ba.getBoundingClientRect(); setX(((e.clientX - r.left) / r.width) * 100); };
  ba.addEventListener('pointerdown', (e) => { baDrag = true; baUser = true; ba.setPointerCapture(e.pointerId); fromEvent(e); });
  ba.addEventListener('pointermove', (e) => { if (baDrag) fromEvent(e); });
  ba.addEventListener('pointerup', () => { baDrag = false; });
  async function baSweep(t) {
    const anim = (a, b, ms) => new Promise((res) => {
      const t0 = performance.now();
      const f = (now) => {
        if (t !== token || baUser) return res();
        const p = Math.min(1, (now - t0) / ms); const e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        setX(a + (b - a) * e); p < 1 ? requestAnimationFrame(f) : res();
      };
      requestAnimationFrame(f);
    });
    baUser = false;
    setX(100);
    await wait(900); if (baUser || t !== token) return;
    await anim(100, 8, 1800); if (baUser || t !== token) return;
    await wait(400); if (baUser || t !== token) return;
    await anim(8, 50, 1100);
  }

  // confeti del cierre, en los colores de las ilustraciones del DS
  function thanks(sl, on) {
    sl.classList.toggle('is-thanks', on);
    if (on) confetti();
  }
  function confetti() {
    const c = $('#confetti'); if (c.childElementCount) return;
    const cols = ['#5a5aff', '#ff98ef', '#d8ff03', '#30d8ff', '#acacff', '#ff8e85', '#e5e5ff'];
    let h = '';
    for (let i = 0; i < 70; i++) {
      h += `<i style="left:${(i * 137) % 1600}px; background:${cols[i % cols.length]}; --dur:${5 + (i % 7) * .7}s; --d:${-(i % 11) * .6}s; transform:rotate(${i * 33}deg)"></i>`;
    }
    c.innerHTML = h;
  }

  // ---------- entrada ----------
  $('#next').addEventListener('click', next);
  $('#prev').addEventListener('click', prev);
  $('.cover__start .pill').addEventListener('click', next);
  $('.cover__start .pill').style.cursor = 'pointer';
  addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
    if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); prev(); }
    else if (e.key === 'Home') go(0, -1);
    else if (e.key === 'End') go(total - 1, 1);
    else if (e.key === 'f' || e.key === 'F') {
      if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen?.();
    }
  });
  // deslizar en pantallas táctiles
  let tx = null;
  addEventListener('touchstart', (e) => { tx = e.target.closest && e.target.closest('#ba') ? null : e.touches[0].clientX; }, { passive: true });
  addEventListener('touchend', (e) => {
    if (tx == null || baDrag) return;
    const dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 60) (dx < 0 ? next : prev)();
  });
  // los controles se atenúan si el mouse no se mueve
  const ctrl = $('#ctrl'); let idle;
  const wake = () => { ctrl.classList.remove('is-idle'); clearTimeout(idle); idle = setTimeout(() => ctrl.classList.add('is-idle'), 2500); };
  addEventListener('mousemove', wake); wake();

  const fromHash = () => Math.min(total, Math.max(1, parseInt(location.hash.slice(1), 10) || 1)) - 1;
  addEventListener('hashchange', () => { const n = fromHash(); if (n !== cur) go(n, n > cur ? 1 : -1); });
  go(fromHash(), 1);
})();
