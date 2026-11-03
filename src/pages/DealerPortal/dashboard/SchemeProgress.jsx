import { Link } from 'react-router-dom';
import Panel from '../../../components/ModulePage/Panel.jsx';
import EmptyState from '../../../components/ModulePage/EmptyState.jsx';
import { SchemeBackdrop } from '../../../components/Schemes/SchemeArt.jsx';
import NewBadge from '../../../components/Motion/NewBadge.jsx';
import { formatDate, formatLacs } from '../../../utils/format.js';

// Active schemes from the Console, each with a small copy of its scene and
// a bar for purchase value against target.
export default function SchemeProgress({ schemes, isLoading }) {
  const active = schemes.filter((s) => s.status === 'Active');
  return (
    <Panel
      title="Scheme Progress"
      subtitle="Purchase value against target, Rs Lacs"
      right={<Link to="/dealer/schemes" className="text-theme-sm font-medium text-brand-500 hover:text-brand-600">See all</Link>}
    >
      {isLoading ? (
        <EmptyState compact icon="schemes" title="Loading schemes…" />
      ) : active.length === 0 ? (
        <EmptyState compact icon="schemes" title="No active schemes" />
      ) : (
        <ul className="space-y-5">
          {active.map((s, i) => {
            const pct = s.target ? Math.min(100, (s.achieved / s.target) * 100) : 0;
            return (
              <li key={s.id} className="flex gap-3">
                <span className="relative h-11 w-14 shrink-0 overflow-hidden rounded-lg ring-1 ring-black/5">
                  <SchemeBackdrop scheme={s} seed={i} still />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="flex min-w-0 items-center gap-2">
                      <span className="truncate text-theme-sm font-medium text-gray-800">{s.name}</span>
                      {s.isNew && <NewBadge />}
                    </p>
                    <p className="shrink-0 text-theme-xs tabular-nums text-gray-500">
                      <span className="font-semibold text-gray-800">{formatLacs(s.achieved)}</span> / {formatLacs(s.target)} Rs Lacs
                    </p>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${s.reached ? 'bg-success-500' : 'bg-gradient-to-r from-brand-400 to-brand-600'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-theme-xs text-gray-500">
                    {s.reached ? 'Target reached' : `${Math.round(pct)}% of target`} · ends {formatDate(s.end)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
