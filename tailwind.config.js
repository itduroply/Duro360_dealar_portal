import { theme } from './src/theme/themes.js';

// Portal theme, shared with the Super Admin Console. The brand accent, the
// grays and the sidebar colours come from src/theme/themes.js (a copy of the
// Console's file) so both apps look the same. Change colours there, not in a page.
//
//   Page background   gray-50
//   Cards, header     white, border gray-200
//   Headings          gray-800
//   Body/muted text   gray-500
//   Primary accent    brand-500
//   Sidebar           sidebar-* tokens
//   Status colors     success / error / warning / blue-light

const { brand, gray } = theme;
const success = {
  25: '#f6fef9', 50: '#ecfdf3', 100: '#d1fadf', 200: '#a6f4c5', 300: '#6ce9a6', 400: '#32d583',
  500: '#12b76a', 600: '#039855', 700: '#027a48', 800: '#05603a', 900: '#054f31', 950: '#053321',
};
const error = {
  25: '#fffbfa', 50: '#fef3f2', 100: '#fee4e2', 200: '#fecdca', 300: '#fda29b', 400: '#f97066',
  500: '#f04438', 600: '#d92d20', 700: '#b42318', 800: '#912018', 900: '#7a271a', 950: '#55160c',
};
const warning = {
  25: '#fffcf5', 50: '#fffaeb', 100: '#fef0c7', 200: '#fedf89', 300: '#fec84b', 400: '#fdb022',
  500: '#f79009', 600: '#dc6803', 700: '#b54708', 800: '#93370d', 900: '#7a2e0e', 950: '#4e1d09',
};
const blueLight = {
  25: '#f5fbff', 50: '#f0f9ff', 100: '#e0f2fe', 200: '#b9e6fe', 300: '#7cd4fd', 400: '#36bffa',
  500: '#0ba5ec', 600: '#0086c9', 700: '#026aa2', 800: '#065986', 900: '#0b4a6f', 950: '#062c41',
};
// Program accents for Duro certificates: Duro red (from the Duro logo)
// and a deep forest green for Tower. Used only on warranty screens and the
// printed certificate, so the two programs never look alike.
const duro = {
  50: '#fdf3f3', 100: '#fbe4e5', 200: '#f6c6c8', 500: '#d42a31', 600: '#b71f26', 700: '#931a20', 900: '#4f0f12',
};
const tower = {
  50: '#f1f7f4', 100: '#dcece4', 200: '#b7d8c8', 500: '#23785a', 600: '#1a6149', 700: '#154d3b', 900: '#0b2a20',
};
const orange = {
  25: '#fffaf5', 50: '#fff6ed', 100: '#ffead5', 200: '#fddcab', 300: '#feb273', 400: '#fd853a',
  500: '#fb6514', 600: '#ec4a0a', 700: '#c4320a', 800: '#9c2a10', 900: '#7e2410', 950: '#511c10',
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand,
        gray,
        success,
        error,
        warning,
        'blue-light': blueLight,
        orange,
        duro,
        tower,
        sidebar: theme.sidebar,
        accent: theme.accent,
        // Older class names still used in a few places point at the same
        // TailAdmin colors, so nothing falls back to Tailwind's defaults.
        slate: gray,
        blue: brand,
        red: error,
        green: success,
        emerald: success,
        amber: warning,
        teal: blueLight,
      },
      fontSize: {
        'theme-xs': ['12px', '18px'],
        'theme-sm': ['14px', '20px'],
        'theme-xl': ['20px', '30px'],
        'title-sm': ['30px', '38px'],
        'title-md': ['36px', '44px'],
      },
      boxShadow: {
        'theme-xs': '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
        'theme-sm': '0px 1px 3px 0px rgba(16, 24, 40, 0.1), 0px 1px 2px 0px rgba(16, 24, 40, 0.06)',
        'theme-md': '0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)',
        'theme-lg': '0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)',
      },
      // TailAdmin's focus ring is 3px wide.
      ringWidth: {
        3: '3px',
      },
      backgroundImage: {
        // Thin stripe on top of the login card.
        'accent-stripe': `linear-gradient(90deg, ${brand[500]}, ${brand[400]})`,
        // Wood grain behind the sidebar ('none' in the current theme).
        'sidebar-texture': theme.sidebarTexture,
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -14px, 0)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.52', transform: 'scale(1)' },
          '50%': { opacity: '0.78', transform: 'scale(1.08)' },
        },
        // Dashboard motion (pages/DealerPortal/dashboard).
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'grow-x': { '0%': { transform: 'scaleX(0)' }, '100%': { transform: 'scaleX(1)' } },
        'grow-y': { '0%': { transform: 'scaleY(0)' }, '100%': { transform: 'scaleY(1)' } },
        'draw-line': {
          '0%': { strokeDasharray: '1', strokeDashoffset: '1' },
          '100%': { strokeDasharray: '1', strokeDashoffset: '0' },
        },
        sweep: { '0%': { strokeDashoffset: '100' } },
        'carousel-timer': { '0%': { transform: 'scaleX(0)' }, '100%': { transform: 'scaleX(1)' } },
        // Light sweep across the "New" badge (components/Motion/NewBadge.jsx).
        shimmer: { '0%': { backgroundPosition: '200% 0' }, '100%': { backgroundPosition: '-200% 0' } },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out both',
        'float-slow': 'float-slow 7s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 6s ease-in-out infinite',
        'fade-in': 'fade-in 0.6s ease-out 0.4s both',
        'slide-in': 'slide-in 0.6s cubic-bezier(.22,.8,.24,1) 0.15s both',
        'grow-x': 'grow-x 1.1s cubic-bezier(.22,.8,.24,1) 0.3s both',
        'grow-y': 'grow-y 0.9s cubic-bezier(.22,.8,.24,1) both',
        'draw-line': 'draw-line 1.2s ease-out 0.2s both',
        sweep: 'sweep 1.2s cubic-bezier(.22,.8,.24,1) 0.2s both',
        'carousel-timer': 'carousel-timer linear both',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
};
