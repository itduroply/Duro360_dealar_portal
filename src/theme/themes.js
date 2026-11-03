// Portal themes. tailwind.config.js, the layout components and
// Charts/chartTheme.js all read the active theme from here, so switching the
// whole portal is one line:
//
//   ACTIVE_THEME = 'woodland'   cream sidebar, teak / rust accent, warm
//                               light page, wood-ring and banner artwork
//   ACTIVE_THEME = 'tailadmin'  the original white + blue TailAdmin look
//
// `ui` holds the class lists that differ between the themes (tabs, tables,
// header). They live here, inside src/, so Tailwind still finds them.
// Status colours (success / error / warning) are the same in both themes.
// The login page has its own styling and does not use these tokens.

export const ACTIVE_THEME = 'woodland';

const THEMES = {
  tailadmin: {
    brand: {
      25: '#f2f7ff', 50: '#ecf3ff', 100: '#dde9ff', 200: '#c2d6ff', 300: '#9cb9ff', 400: '#7592ff',
      500: '#465fff', 600: '#3641f5', 700: '#2a31d8', 800: '#252dae', 900: '#262e89', 950: '#161950',
    },
    gray: {
      25: '#fcfcfd', 50: '#f9fafb', 100: '#f2f4f7', 200: '#e4e7ec', 300: '#d0d5dd', 400: '#98a2b3',
      500: '#667085', 600: '#475467', 700: '#344054', 800: '#1d2939', 900: '#101828', 950: '#0c111d',
      dark: '#1a2231',
    },
    // Secondary accent for row actions (Edit, Deactivate). Same as brand here.
    accent: { 400: '#7592ff', 500: '#465fff', 600: '#3641f5', 700: '#2a31d8' },
    sidebar: {
      DEFAULT: '#ffffff',
      border: '#e4e7ec',
      text: '#344054',
      muted: '#98a2b3',
      icon: '#667085',
      hover: '#f2f4f7',
      'hover-text': '#344054',
      active: '#ecf3ff',
      'active-text': '#465fff',
      card: '#f9fafb',
      'card-text': '#344054',
      divider: '#e4e7ec',
    },
    sidebarTexture: 'none',
    sidebarLogoWhite: false,
    // Layout extras used only by the woodland theme.
    decor: false,
    ui: {
      sidebarNavActive: '',
      headerBar: 'border-gray-200 bg-white',
      headerToggle: 'border border-gray-200 text-gray-500 hover:bg-gray-100',
      headerLabel: 'text-theme-sm font-medium text-gray-500',
      avatar: 'bg-brand-50 text-brand-500',
      chevron: 'text-gray-500',
      tabTrack: 'gap-0.5 rounded-lg bg-gray-100 p-0.5',
      tabButton: 'rounded-md px-3 py-1.5',
      tabActive: 'bg-white text-gray-900 shadow-theme-xs',
      tabIdle: 'text-gray-500 hover:text-gray-900',
      tableWrapper: 'overflow-hidden rounded-2xl border border-gray-200 bg-white',
      tableHead: 'border-y border-gray-100',
      th: 'whitespace-nowrap px-5 py-3 text-theme-xs font-medium text-gray-500 sm:px-6',
      td: 'whitespace-nowrap px-5 py-3.5 text-theme-sm text-gray-500 sm:px-6',
      tdPrimary: 'font-medium text-gray-800',
      chipDot: '',
      pageCard: '',
    },
    charts: {
      series: ['#465fff', '#eb6834', '#1baf7a', '#eda100'],
      ordinal: ['#7592ff', '#465fff', '#2a31d8', '#262e89'],
      grid: '#f2f4f7',
      axisText: '#667085',
      labelText: '#344054',
    },
  },

  woodland: {
    // Duro red: buttons, active tabs, links, the active sidebar item.
    // White text on 500 is above 4.5:1.
    brand: {
      25: '#fff8f8', 50: '#fdeceb', 100: '#fbd9d7', 200: '#f7b4b1', 300: '#f08782', 400: '#e5524f',
      500: '#d3201f', 600: '#b81a1a', 700: '#951616', 800: '#781616', 900: '#611717', 950: '#350808',
    },
    // Neutral light grays with a faint pink tint. 25 is the header, 50 the page background.
    gray: {
      25: '#ffffff', 50: '#f8f6f6', 100: '#f2eeee', 200: '#e8e3e3', 300: '#d6cfcf', 400: '#a39b9b',
      500: '#6b6363', 600: '#4d4747', 700: '#363030', 800: '#1d1919', 900: '#141010', 950: '#0b0909',
      dark: '#1c1814',
    },
    // Row actions (Edit features, Deactivate) use the same red.
    accent: { 400: '#e5524f', 500: '#d3201f', 600: '#b81a1a', 700: '#951616' },
    // White sidebar; the active item is a soft pink with a red bar.
    sidebar: {
      DEFAULT: '#ffffff',
      border: '#f0e9e9',
      text: '#3a3333',
      muted: '#4a3f3f',
      icon: '#3a3333',
      hover: '#fbf1f0',
      'hover-text': '#2a1f1f',
      active: '#fde4e3',
      'active-text': '#d3201f',
      card: 'transparent',
      'card-text': '#3a3333',
      divider: '#efe7e7',
    },
    sidebarTexture: 'none',
    sidebarLogoWhite: false,
    // true shows the dark brown copy of the logo (assets/duroply-logo-brown.png).
    sidebarLogoBrown: false,
    decor: true,
    ui: {
      // Red bar on the left of the active sidebar item.
      sidebarNavActive: 'bg-[#fde4e3] font-semibold text-[#d3201f] shadow-[inset_3px_0_0_#d3201f]',
      // Icon colour of the active sidebar item.
      sidebarIconActive: 'text-[#d3201f]',
      headerBar: 'border-gray-200/70 bg-gray-25',
      headerToggle: 'bg-brand-50 text-brand-600 hover:bg-brand-100',
      headerLabel: 'text-xl font-medium uppercase tracking-[0.04em] text-gray-800',
      avatar: 'bg-gradient-to-br from-brand-400 to-brand-600 text-white',
      chevron: 'text-gray-700',
      tabTrack: 'gap-1 rounded-xl bg-gray-100 p-1',
      tabButton: 'rounded-lg px-4 py-2',
      tabActive: 'bg-brand-500 text-white shadow-theme-sm',
      tabIdle: 'text-gray-700 hover:bg-white/70 hover:text-gray-900',
      tableWrapper: 'overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-sm',
      tableHead: 'border-b border-gray-200 bg-gray-50',
      th: 'whitespace-nowrap px-4 py-3.5 text-theme-sm font-semibold text-gray-700 sm:px-5',
      td: 'whitespace-nowrap px-4 py-4 text-theme-sm text-gray-600 sm:px-5',
      tdPrimary: 'font-semibold text-gray-800',
      chipDot: 'before:h-1.5 before:w-1.5 before:rounded-full before:bg-current',
      pageCard: 'rounded-3xl border border-gray-200/70 bg-white p-5 shadow-theme-sm sm:p-6',
    },
    // Red first, then teal, ochre and green: different hues and lightness
    // so the series stay apart. Not yet run through the palette check.
    charts: {
      series: ['#d3201f', '#2f7d8c', '#d9a21b', '#4f8a4a'],
      ordinal: ['#f08782', '#e5524f', '#d3201f', '#781616'],
      grid: '#f2eeee',
      axisText: '#6b6363',
      labelText: '#363030',
    },
  },
};

export const theme = THEMES[ACTIVE_THEME];
