import { useState } from 'react';

export default function StackedBar({ parts, format = String }) {
  const [hover, setHover] = useState(null);
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;

  return (
    <div>
      <div className="flex h-5 w-full gap-0.5 overflow-hidden rounded-[4px]">
        {parts.map((p) =>
          p.value > 0 ? (
            <div
              key={p.label}
              className="h-full transition-opacity first:rounded-l-[4px] last:rounded-r-[4px]"
              style={{ width: `${(p.value / total) * 100}%`, background: p.color, opacity: hover && hover !== p.label ? 0.5 : 1 }}
              onPointerEnter={() => setHover(p.label)}
              onPointerLeave={() => setHover(null)}
              title={`${p.label}: ${format(p.value)}`}
            />
          ) : null
        )}
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
        {parts.map((p) => (
          <li key={p.label} className="flex items-start gap-2">
            <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: p.color }} aria-hidden="true" />
            <div>
              <p className="text-theme-xs text-gray-500">{p.label}</p>
              <p className="text-theme-sm font-semibold text-gray-800">
                {format(p.value)} <span className="font-normal text-gray-400">· {Math.round((p.value / total) * 100)}%</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
