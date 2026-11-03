import { useState } from 'react';
import ModulePage, { KpiStrip, TabBar, StatusChip } from '../../components/ModulePage/ModulePage.jsx';
import Panel from '../../components/ModulePage/Panel.jsx';
import EmptyState from '../../components/ModulePage/EmptyState.jsx';
import Alert from '../../components/common/Alert.jsx';
import SchemeArt from '../../components/Schemes/SchemeArt.jsx';
import NewBadge from '../../components/Motion/NewBadge.jsx';
import { formatCount, formatDate, formatLacs } from '../../utils/format.js';
import { daysUntil } from '../../utils/schemes.js';
import { useDealerPortal } from './useDealerPortal.js';
import { useMySchemes } from './useMySchemes.js';

// "Ends in 12 days", "Starts in 3 days", "Ended on 30 Sep 2026".
function timeNote(scheme) {
  if (scheme.status === 'Upcoming') {
    const d = daysUntil(scheme.start);
    return d === 1 ? 'Starts tomorrow' : `Starts in ${d} days`;
  }
  if (scheme.status === 'Expired') return `Ended on ${formatDate(scheme.end)}`;
  const d = daysUntil(scheme.end);
  return d === 0 ? 'Ends today' : d === 1 ? 'Ends tomorrow' : `Ends in ${d} days`;
}

// One card per scheme, same look as the Console: animated scene on top, then
// the rule and this Dealer's purchases against the target.
function SchemeCard({ scheme, index }) {
  const share = scheme.target ? scheme.achieved / scheme.target : 0;
  const upcoming = scheme.status === 'Upcoming';

  return (
    // The entrance animation sits on the wrapper so the hover lift on the
    // card is not overridden by it.
    <div className="animate-fade-in-up" style={{ animationDelay: `${index * 70}ms` }}>
      <article className="flex h-full flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-theme-md">
        <SchemeArt scheme={scheme} seed={index} />
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-theme-sm font-semibold text-gray-800" title={scheme.name}>
                {scheme.name}
              </p>
              {scheme.isNew && <NewBadge />}
            </div>
            <p className="mt-0.5 text-theme-xs text-gray-500">
              {scheme.type} · {formatDate(scheme.start)} – {formatDate(scheme.end)}
            </p>
          </div>
          <StatusChip status={scheme.status} />
        </div>

        <div>
          <p className="text-theme-xs text-gray-600">{scheme.rule}</p>
          {scheme.note && <p className="mt-1 text-theme-xs text-gray-500">{scheme.note}</p>}
        </div>

        <div className="mt-auto">
          <div className="mb-1.5 flex justify-between text-theme-xs">
            <span className="text-gray-500">Purchases vs target</span>
            <span className="font-medium tabular-nums text-gray-800">
              {upcoming ? '—' : formatLacs(scheme.achieved)} of {formatLacs(scheme.target)} Lacs
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100">
            <div
              className={`h-full origin-left animate-grow-x rounded-full ${scheme.reached ? 'bg-success-500' : 'bg-brand-500'}`}
              style={{ width: `${upcoming ? 0 : Math.min(100, share * 100)}%`, animationDelay: `${200 + index * 70}ms` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-theme-xs">
          <span className="text-gray-500">{timeNote(scheme)}</span>
          <span className={`font-semibold ${scheme.reached && !upcoming ? 'text-success-600' : 'text-gray-800'}`}>
            {upcoming ? 'Not started' : scheme.reached ? 'Target reached' : `${Math.round(share * 100)}% of target`}
          </span>
        </div>
      </article>
    </div>
  );
}

// Schemes the Dealer is part of, and progress against each target.
export default function DealerSchemes() {
  const { sample } = useDealerPortal();
  const { schemes, isLoading, error } = useMySchemes(sample.orders);
  const [tab, setTab] = useState('All');

  const has = schemes.length > 0;
  const shown = schemes.filter((s) => tab === 'All' || s.status === tab);

  return (
    <ModulePage title="Schemes" live>
      {error && <Alert variant="error">{error}</Alert>}
      <KpiStrip
        items={[
          { label: 'Active Schemes', value: has ? formatCount(schemes.filter((s) => s.status === 'Active').length) : undefined, icon: 'schemes', tone: 'brand' },
          { label: 'Upcoming', value: has ? formatCount(schemes.filter((s) => s.status === 'Upcoming').length) : undefined, icon: 'notifications', tone: 'warning' },
          { label: 'Targets Reached', value: has ? formatCount(schemes.filter((s) => s.reached && s.status !== 'Upcoming').length) : undefined, icon: 'auditLogs', tone: 'success' },
        ]}
      />
      <Panel title="My Schemes" right={<TabBar tabs={['All', 'Active', 'Upcoming', 'Expired']} active={tab} onChange={setTab} />} flush={shown.length === 0}>
        {isLoading ? (
          <EmptyState icon="schemes" title="Loading schemes…" />
        ) : shown.length === 0 ? (
          <EmptyState icon="schemes" title={has ? `No ${tab.toLowerCase()} schemes` : 'No schemes yet'} hint="Schemes Duroply enrols you in will show here." />
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {shown.map((s, i) => (
              <SchemeCard key={s.id} scheme={s} index={i} />
            ))}
          </div>
        )}
      </Panel>
    </ModulePage>
  );
}
