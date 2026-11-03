import { NAV_ICONS } from '../Sidebar/navIcons.jsx';
import CountUp from '../Motion/CountUp.jsx';

const TONES = {
  brand: 'bg-brand-50 text-brand-500',
  success: 'bg-success-50 text-success-600',
  warning: 'bg-warning-50 text-warning-600',
  error: 'bg-error-50 text-error-600',
  gray: 'bg-gray-100 text-gray-600',
};

/**
 * One slim card split into equal KPI cells (4 per row on desktop, 2 on
 * mobile) instead of a row of large separate boxes.
 *
 *   <KpiStrip items={[{ label: 'Total Orders', icon: 'orders', tone: 'brand' },
 *                     { label: 'Order Value', unit: 'Rs Lacs', value: 12 }]} />
 *
 * `icon` is a sidebar key from components/Sidebar/navIcons.jsx. `value`
 * falls back to "—" while there is no data; numbers count up from 0 and the
 * cells fade in one after another. `bare` drops the outer card
 * border when the strip sits inside a Panel.
 */
export default function KpiStrip({ items, bare = false }) {
  const cols = items.length >= 4 ? 'md:grid-cols-4' : items.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2';

  return (
    <div className={`grid grid-cols-2 bg-white ${bare ? '' : 'overflow-hidden rounded-2xl border border-gray-200'} ${cols}`}>
      {items.map((item, i) => {
        const Icon = item.icon ? NAV_ICONS[item.icon] : null;
        return (
          <div
            key={item.label}
            style={{ animationDelay: `${i * 80}ms` }}
            className={`group flex animate-fade-in-up items-center gap-3 border-gray-100 px-4 py-4 sm:px-5 ${
              i % 2 === 1 ? 'border-l' : ''
            } ${i >= 2 ? 'border-t md:border-t-0' : ''} ${i % 2 === 0 && i > 0 ? 'md:border-l' : ''}`}
          >
            {Icon && (
              <span
                className={`hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 sm:flex ${
                  TONES[item.tone || 'gray']
                }`}
              >
                <Icon />
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-theme-xs font-medium text-gray-500">{item.label}</p>
              <p className="mt-0.5 flex min-w-0 items-baseline gap-1.5">
                <span className="truncate text-xl font-semibold text-gray-800" title={String(item.value ?? '')}>
                  <CountUp value={item.value} />
                </span>
                {item.unit && <span className="shrink-0 text-theme-xs text-gray-400">{item.unit}</span>}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
