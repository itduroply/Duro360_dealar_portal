import { SERIES_COLORS } from './chartTheme.js';

export default function BarList({ rows, format = String, color = SERIES_COLORS[0], overColor = SERIES_COLORS[1], max }) {
  const top = max ?? Math.max(...rows.map((r) => Math.max(r.value, r.limit || 0)));
  return (
    <ul className="flex flex-col gap-3">
      {rows.map((row) => {
        const over = row.limit !== undefined && row.value > row.limit;
        return (
          <li key={row.label} className="group grid grid-cols-[minmax(0,11rem)_1fr_auto] items-center gap-3 text-theme-sm">
            <span className="truncate text-gray-600" title={row.label}>
              {row.label}
            </span>
            <span className="relative h-3 rounded-full bg-gray-100">
              <span
                className="absolute inset-y-0 left-0 rounded-r-[4px] transition-opacity group-hover:opacity-80"
                style={{ width: `${(row.value / top) * 100}%`, background: over ? overColor : color }}
              />
              {row.limit !== undefined && (
                <span
                  className="absolute -inset-y-1 w-0.5 rounded-full bg-gray-700"
                  style={{ left: `${(row.limit / top) * 100}%` }}
                  title={`Limit ${format(row.limit)}`}
                  aria-hidden="true"
                />
              )}
            </span>
            <span className="w-16 text-right font-medium tabular-nums text-gray-800">{format(row.value)}</span>
          </li>
        );
      })}
    </ul>
  );
}
