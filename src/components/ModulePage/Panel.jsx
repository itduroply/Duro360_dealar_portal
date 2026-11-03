/**
 * Section card used across the Console modules: optional header row (title,
 * short subtitle, right-side slot) with a thin divider, then the body.
 * `flush` removes body padding for tables and lists that run edge to edge.
 */
export default function Panel({ title, subtitle, right, flush = false, className = '', children }) {
  return (
    <section className={`flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white ${className}`}>
      {(title || right) && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-3.5">
          <div className="min-w-0">
            {title && <h3 className="text-base font-semibold text-gray-800">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-theme-xs text-gray-500">{subtitle}</p>}
          </div>
          {right && <div className="flex flex-wrap items-center gap-2">{right}</div>}
        </header>
      )}
      <div className={`flex-1 ${flush ? '' : 'p-5'}`}>{children}</div>
    </section>
  );
}
