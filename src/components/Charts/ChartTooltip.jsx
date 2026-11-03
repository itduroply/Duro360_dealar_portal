
export default function ChartTooltip({ x, y, title, rows, containerWidth }) {
  if (x === null || x === undefined) return null;
  const flip = containerWidth && x > containerWidth - 180;
  return (
    <div
      className="pointer-events-none absolute z-10 min-w-[140px] rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-theme-lg"
      style={{ left: flip ? undefined : x + 12, right: flip ? containerWidth - x + 12 : undefined, top: Math.max(0, y - 10) }}
      role="status"
    >
      <p className="mb-1 text-theme-xs font-medium text-gray-500">{title}</p>
      {rows.map((row) => (
        <p key={row.name} className="flex items-center gap-2 text-theme-xs">
          <span className="h-0.5 w-3 rounded-full" style={{ background: row.color }} aria-hidden="true" />
          <span className="font-semibold text-gray-800">{row.value}</span>
          <span className="text-gray-500">{row.name}</span>
        </p>
      ))}
    </div>
  );
}
