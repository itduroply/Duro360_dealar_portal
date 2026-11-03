import { Link } from 'react-router-dom';
import { theme } from '../../../theme/themes.js';
import { ArrowRightIcon, PlusIcon } from './dashboardIcons.jsx';

function greetingFor(hour) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Top of the Dealer dashboard: today's date, a greeting and the two
 * two most-used actions in one slim row on a soft pink band with a red swoosh on the right.
 * Same look as the Super Admin Console's welcome banner.
 */
export default function WelcomeBanner({ name, code }) {
  const now = new Date();
  const today = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white via-[#fef3f3] to-[#fde4e3] shadow-theme-sm">
      {theme.decor && (
        <svg
          viewBox="0 0 814 163"
          preserveAspectRatio="xMaxYMid slice"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
        >
          <defs>
            <linearGradient id="banner-pale" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fbd0cf" stopOpacity="0" />
              <stop offset="1" stopColor="#f7b4b1" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="banner-red" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#e5524f" />
              <stop offset="1" stopColor="#c81e1e" />
            </linearGradient>
          </defs>
          <path d="M610 163 C720 150 700 60 700 0 H814 V163 Z" fill="url(#banner-pale)" />
          <path d="M700 0 H814 V58 C760 52 715 30 700 0 Z" fill="url(#banner-red)" />
          <path d="M814 105 V163 H735 C772 152 798 132 814 105 Z" fill="url(#banner-red)" />
        </svg>
      )}

      <div className="relative flex flex-wrap items-center justify-between gap-x-10 gap-y-5 px-6 py-6 sm:px-9 md:pr-28 xl:pr-44">
        <div className="min-w-0">
          <p className="text-theme-xs font-medium uppercase tracking-[0.16em] text-gray-600">{today}</p>
          <h2 className="mt-1.5 text-2xl font-semibold leading-tight text-gray-900 sm:text-[28px]">{greetingFor(now.getHours())}</h2>
          <p className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-theme-sm text-gray-600">
            <span className="truncate font-medium text-gray-800">{name}</span>
            {code && <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-theme-xs font-medium text-brand-600">{code}</span>}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/dealer/invoices"
            className="inline-flex items-center gap-2.5 rounded-lg bg-gradient-to-b from-brand-500 to-brand-600 px-5 py-2.5 text-theme-sm font-semibold text-white shadow-theme-md transition-transform duration-200 hover:-translate-y-0.5"
          >
            <PlusIcon />
            View Invoices
          </Link>
          <Link
            to="/dealer/queries"
            className="inline-flex items-center gap-2.5 rounded-lg border border-brand-300 bg-white/60 px-5 py-2.5 text-theme-sm font-semibold text-brand-600 transition-colors hover:bg-white"
          >
            Raise a Query
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
