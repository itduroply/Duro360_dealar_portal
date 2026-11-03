import { NAV_ICONS } from '../../../components/Sidebar/navIcons.jsx';

const TONES = {
  brand: { chip: 'bg-brand-50 text-brand-600', line: '#d3201f', glow: 'from-brand-50' },
  error: { chip: 'bg-error-50 text-error-600', line: '#d92d20', glow: 'from-error-50' },
  success: { chip: 'bg-success-50 text-success-600', line: '#039855', glow: 'from-success-50' },
  warning: { chip: 'bg-warning-50 text-warning-600', line: '#dc6803', glow: 'from-warning-50' },
};

// Small area line of the last few months.
function Sparkline({ values, color }) {
  if (!values || values.length < 2) return null;
  const w = 96;
  const h = 32;
  const max = Math.max(...values) || 1;
  const min = Math.min(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, h - 3 - ((v - min) / span) * (h - 6)]);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const id = `spark-${color.slice(1)}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-8 w-24 overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity=".22" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${w},${h} L0,${h} Z`} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.6" fill={color} />
    </svg>
  );
}

/**
 * One dashboard KPI tile: icon, label, number, an optional unit, a short
 * note and a sparkline. `value` is a number; `format` turns it into the
 * shown text.
 */
export default function KpiCard({ label, unit, value, format = String, icon, tone = 'brand', note, trend }) {
  const t = TONES[tone] || TONES.brand;
  const Icon = icon ? NAV_ICONS[icon] : null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-theme-sm">
      <span className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${t.glow} to-transparent opacity-80`} aria-hidden="true" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-theme-sm font-medium text-gray-800">{label}</p>
          <p className="mt-2 flex items-baseline gap-1.5">
            <span className="text-[32px] font-semibold leading-none text-gray-900 tabular-nums">
              {value === null || value === undefined ? '—' : format(value)}
            </span>
            {unit && <span className="text-theme-xs text-gray-400">{unit}</span>}
          </p>
        </div>
        {Icon && (
          <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl [&_svg]:h-7 [&_svg]:w-7 ${t.chip}`}>
            <Icon />
          </span>
        )}
      </div>
      <div className="relative mt-4 flex items-end justify-between gap-3">
        <p className="min-w-0 text-theme-xs text-gray-500">{note}</p>
        <Sparkline values={trend} color={t.line} />
      </div>
    </div>
  );
}
