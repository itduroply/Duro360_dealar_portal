import { Fragment, useEffect, useMemo, useState } from 'react';
import TabBar from './TabBar.jsx';
import EmptyState from './EmptyState.jsx';
import Pagination from '../common/Pagination.jsx';
import { SearchIcon } from '../common/icons.jsx';
import { TABLE, TABLE_HEAD, TH, TABLE_ROW, TD, TD_PRIMARY } from '../common/tableStyles.js';

// Search box and selects share one height (40px) so the toolbar lines up.
const CONTROL =
  'h-10 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10';


export default function DataTable({
  title, rows = [], tabs = [], tabField = 'status', tabMatch, searchPlaceholder, searchFields = [], filters = [],columns,
  empty, pageSize = 8, onRowClick, renderExpanded, className = '',}) 
  {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [page, setPage] = useState(1);
  const [openKey, setOpenKey] = useState(null);
  const hasToolbar = title || tabs.length > 0 || searchPlaceholder || filters.length > 0;

  const visibleRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (activeTab && activeTab !== 'All' && !(tabMatch ? tabMatch(row, activeTab) : row[tabField] === activeTab)) return false;
      if (q && !searchFields.some((f) => String(row[f] ?? '').toLowerCase().includes(q))) return false;
      return filters.every((f) => {
        const value = filterValues[f.id];
        if (!value) return true;
        return f.match ? f.match(row, value) : row[f.field || f.id] === value;
      });
    });
  }, [rows, activeTab, tabField, tabMatch, search, searchFields, filters, filterValues]);

  // Any change to what is shown goes back to page 1.
  useEffect(() => {
    setPage(1);
    setOpenKey(null);
  }, [activeTab, search, filterValues, rows]);

  const pageCount = Math.max(1, Math.ceil(visibleRows.length / pageSize));
  const pageRows = visibleRows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <section className={`flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white ${className}`}>
      {hasToolbar && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-3.5">
          <div className="flex max-w-full shrink-0 items-center gap-4">
            {title && <h3 className="shrink-0 text-base font-semibold text-gray-800">{title}</h3>}
            {tabs.length > 0 && <TabBar tabs={tabs} active={activeTab} onChange={setActiveTab} />}
          </div>
          <div className="flex w-full flex-col gap-2 sm:ml-auto sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            {searchPlaceholder && (
              <div className="relative sm:w-60">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <SearchIcon />
                </span>
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className={`${CONTROL} w-full pl-10 pr-3 placeholder:text-gray-400`}
                />
              </div>
            )}
            {filters.map((filter) => (
              <select
                key={filter.id}
                aria-label={filter.label}
                value={filterValues[filter.id] || ''}
                onChange={(e) => setFilterValues((v) => ({ ...v, [filter.id]: e.target.value }))}
                className={`${CONTROL} cursor-pointer px-3 sm:w-40`}
              >
                <option value="">{filter.label}</option>
                {filter.options.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            ))}
          </div>
        </div>
      )}

      <div className="custom-scrollbar overflow-x-auto">
        <table className={TABLE}>
          <thead className={`${TABLE_HEAD} bg-gray-50/60`}>
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={`${TH} ${c.align === 'right' ? 'text-right' : ''}`}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          {pageRows.length > 0 && (
            <tbody>
              {pageRows.map((row, i) => {
                const key = row.id || row.code || i;
                const open = Boolean(renderExpanded) && openKey === key;
                const toggle = renderExpanded ? () => setOpenKey(open ? null : key) : onRowClick ? () => onRowClick(row) : undefined;
                return (
                  <Fragment key={key}>
                    <tr className={`${TABLE_ROW} ${toggle ? 'cursor-pointer' : ''} ${open ? 'bg-gray-50' : ''}`} onClick={toggle}>
                      {columns.map((c, ci) => (
                        <td
                          key={c.key}
                          className={`${TD} ${ci === 0 ? TD_PRIMARY : ''} ${c.align === 'right' ? 'text-right tabular-nums' : ''}`}
                        >
                          {c.render ? c.render(row, open) : row[c.key]}
                        </td>
                      ))}
                    </tr>
                    {open && (
                      <tr className="border-b border-gray-100 bg-gray-50/60">
                        <td colSpan={columns.length} className="px-5 py-3">
                          {renderExpanded(row)}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          )}
        </table>
      </div>

      {/* Outside the scroll area so it stays centred on narrow screens. */}
      {pageRows.length === 0 && (
        <EmptyState {...empty} title={rows.length > 0 ? 'No rows match these filters' : empty?.title} />
      )}

      {visibleRows.length > 0 && (
        <div className="mt-auto flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-5 py-3 sm:flex-row">
          <p className="text-theme-xs text-gray-500">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, visibleRows.length)} of {visibleRows.length}
          </p>
          <Pagination page={page} pageCount={pageCount} onChange={setPage} />
        </div>
      )}
    </section>
  );
}
