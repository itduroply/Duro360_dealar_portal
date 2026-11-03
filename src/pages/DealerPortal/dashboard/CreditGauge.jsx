import { formatLacs } from '../../../utils/format.js';

// Half-ring gauge: outstanding as a share of the credit limit.
export default function CreditGauge({ used, limit }) {
  const pct = limit ? Math.min(100, (used / limit) * 100) : 0;
  const color = pct >= 90 ? '#d92d20' : pct >= 70 ? '#dc6803' : '#039855';
  const arc = 'M10 60 A50 50 0 0 1 110 60';

  return (
    <div className="flex items-center gap-5">
      <div className="relative h-[68px] w-[120px] shrink-0">
        <svg viewBox="0 0 120 66" className="h-full w-full" aria-hidden="true">
          <path d={arc} fill="none" stroke="#f2f4f7" strokeWidth="11" strokeLinecap="round" />
          <path
            d={arc}
            fill="none"
            stroke={color}
            strokeWidth="11"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset={100 - pct}
          />
        </svg>
        <span className="absolute inset-x-0 bottom-0 text-center text-lg font-semibold tabular-nums text-gray-900">
          {Math.round(pct)}%
        </span>
      </div>
      <div className="text-theme-sm">
        <p className="font-medium text-gray-800">Credit limit used</p>
        <p className="mt-0.5 text-theme-xs text-gray-500">
          Rs {formatLacs(used)} of {formatLacs(limit)} Lacs
        </p>
      </div>
    </div>
  );
}
