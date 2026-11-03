// Small page-number + prev/next control, shared by any table that paginates
// client-side (see pages/Dealers/DealersDirectory.jsx). Deliberately generic
// — it only knows the current page, how many pages there are, and a
// callback, so it can't drift out of sync with whatever data it's paging.
// Styled after TailAdmin's table pagination.
export default function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null;

  const pages = [];
  const window = 1; // how many page numbers to show on either side of the current one
  for (let p = 1; p <= pageCount; p += 1) {
    if (p === 1 || p === pageCount || Math.abs(p - page) <= window) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…');
    }
  }

  const stepButton =
    'inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 text-sm font-medium text-gray-700 shadow-theme-xs transition-colors hover:bg-gray-50 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50';

  const pageButton = (active) =>
    `flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
      active ? 'bg-brand-500 text-white' : 'text-gray-700 hover:bg-brand-500/[0.08] hover:text-brand-500'
    }`;

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      <button type="button" onClick={() => onChange(page - 1)} disabled={page === 1} className={stepButton}>
        ← Prev
      </button>
      <div className="flex items-center gap-0.5">
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="flex h-10 w-10 items-center justify-center text-sm text-gray-500">
              …
            </span>
          ) : (
            <button key={p} type="button" onClick={() => onChange(p)} className={pageButton(p === page)}>
              {p}
            </button>
          )
        )}
      </div>
      <button type="button" onClick={() => onChange(page + 1)} disabled={page === pageCount} className={stepButton}>
        Next →
      </button>
    </nav>
  );
}
