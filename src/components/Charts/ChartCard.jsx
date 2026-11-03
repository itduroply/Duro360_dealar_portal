import { useState } from 'react';
import TabBar from '../ModulePage/TabBar.jsx';
import { TABLE, TABLE_HEAD, TH, TABLE_ROW, TD, TD_PRIMARY } from '../common/tableStyles.js';


export default function ChartCard({ title, subtitle, legend = [], table, right, children, className = '' }) {
  const [view, setView] = useState('Chart');

  return (
    <section className={`overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-theme-sm ${className}`}>
      <header className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          {subtitle && <p className="mt-0.5 text-theme-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {right}
          {table && <TabBar tabs={['Chart', 'Table']} active={view} onChange={setView} />}
        </div>
      </header>

      {view === 'Chart' ? (
        <div className="px-5 pb-5 pt-3">
          {legend.length > 1 && (
            <ul className="mb-2 flex flex-wrap gap-4">
              {legend.map((l) => (
                <li key={l.name} className="flex items-center gap-2 text-theme-xs text-gray-600">
                  <span
                    className={l.shape === 'line' ? 'h-0.5 w-4 rounded-full' : 'h-2.5 w-2.5 rounded-[3px]'}
                    style={{ background: l.color }}
                    aria-hidden="true"
                  />
                  {l.name}
                </li>
              ))}
            </ul>
          )}
          {children}
        </div>
      ) : (
        <div className="custom-scrollbar mt-3 max-h-[340px] overflow-auto border-t border-gray-100">
          <table className={TABLE}>
            <thead className={`${TABLE_HEAD} sticky top-0 bg-gray-50`}>
              <tr>
                {table.columns.map((c, i) => (
                  <th key={c} className={`${TH} ${i > 0 ? 'text-right' : ''}`}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row) => (
                <tr key={row[0]} className={TABLE_ROW}>
                  {row.map((cell, i) => (
                    <td key={i} className={`${TD} ${i === 0 ? TD_PRIMARY : 'text-right tabular-nums'}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
