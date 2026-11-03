import { Link } from 'react-router-dom';
import { StatusChip } from '../../components/ModulePage/ModulePage.jsx';
import Panel from '../../components/ModulePage/Panel.jsx';
import EmptyState from '../../components/ModulePage/EmptyState.jsx';
import ChartCard from '../../components/Charts/ChartCard.jsx';
import ColumnChart from '../../components/Charts/ColumnChart.jsx';
import StackedBar from '../../components/Charts/StackedBar.jsx';
import { SERIES_COLORS } from '../../components/Charts/chartTheme.js';
import Alert from '../../components/common/Alert.jsx';
import { AGEING_BUCKETS } from '../../utils/outstanding.js';
import { formatCount, formatDate, formatLacs, formatLacsWhole, formatRupees, monthLabel } from '../../utils/format.js';
import { useDealerPortal } from './useDealerPortal.js';
import KpiCard from './dashboard/KpiCard.jsx';
import WelcomeBanner from './dashboard/WelcomeBanner.jsx';
import SchemeProgress from './dashboard/SchemeProgress.jsx';
import CreditGauge from './dashboard/CreditGauge.jsx';
import { useMySchemes } from './useMySchemes.js';
import { useMyQueries } from './useMyQueries.js';
import { useDashboardData } from './dashboard/useDashboardData.js';

const [BLUE, ORANGE] = SERIES_COLORS;
const BUCKET_COLORS = { '0–30': '#1baf7a', '31–60': '#eda100', '61–90': '#eb6834', '90+': '#d92d20' };
const lacs = (v) => `${formatLacs(v)} Lacs`;

function SeeAll({ to }) {
  return (
    <Link to={to} className="text-theme-sm font-medium text-brand-600 hover:text-brand-700">
      See all
    </Link>
  );
}

// Credit limit used, outstanding split by document age, and the next
// documents falling due.
function OutstandingSnapshot({ account, dueNext }) {
  return (
    <Panel title="Outstanding by Age" subtitle="Rs Lacs" right={<SeeAll to="/dealer/outstanding" />}>
      {account ? (
        <>
          {account.creditLimit && (
            <div className="mb-5 border-b border-gray-100 pb-5">
              <CreditGauge used={account.outstanding} limit={account.creditLimit} />
            </div>
          )}
          <StackedBar
            parts={AGEING_BUCKETS.map((b) => ({ label: `${b} Days`, value: account.buckets[b], color: BUCKET_COLORS[b] }))}
            format={(v) => `Rs ${formatLacs(v)} Lacs`}
          />
          <p className="mb-2 mt-5 text-theme-xs font-medium uppercase tracking-wide text-gray-400">Due next</p>
          {dueNext.length === 0 ? (
            <p className="text-theme-sm text-gray-500">No documents due soon.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {dueNext.map((item) => (
                <li key={`${item.docType}-${item.docNo}`} className="flex items-center justify-between gap-3 py-2 text-theme-sm">
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-gray-800">{item.docNo}</span>
                    <span className="text-theme-xs text-gray-500">Due {formatDate(item.dueDate)}</span>
                  </span>
                  <span className="shrink-0 font-medium tabular-nums text-gray-800">{formatRupees(item.balance)}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <EmptyState compact icon="outstanding" title="No outstanding data yet" />
      )}
    </Panel>
  );
}

// A short list panel: title and detail on the left, an amount on the right.
function RecentList({ title, to, icon, empty, rows }) {
  return (
    <Panel title={title} right={<SeeAll to={to} />} flush>
      {rows.length === 0 ? (
        <EmptyState compact icon={icon} title={empty} />
      ) : (
        <ul className="divide-y divide-gray-100">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-3 px-5 py-3">
              <span className="min-w-0">
                <span className="block truncate text-theme-sm font-medium text-gray-800">{r.title}</span>
                <span className="block truncate text-theme-xs text-gray-500">{r.detail}</span>
              </span>
              <span className={`shrink-0 text-theme-sm font-semibold tabular-nums ${r.tone}`}>{r.amount}</span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

function OpenQueries({ queries }) {
  const open = queries.filter((q) => q.status === 'Open' || q.status === 'In Progress');
  return (
    <Panel title="Open Queries" right={<SeeAll to="/dealer/queries" />} flush>
      {open.length === 0 ? (
        <EmptyState compact icon="queries" title="No open queries" />
      ) : (
        <ul className="divide-y divide-gray-100">
          {open.map((q) => (
            <li key={q.id} className="flex items-center justify-between gap-3 px-5 py-3">
              <span className="min-w-0">
                <span className="block truncate text-theme-sm font-medium text-gray-800">{q.subject}</span>
                <span className="text-theme-xs text-gray-500">
                  {q.ticketNo} · {q.type}
                </span>
              </span>
              <StatusChip status={q.status} />
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

// Dealer landing page: banner carousel, KPI cards, then trend and
// credit, scheme progress and recent activity. Every figure comes from the
// Dealer's own records.
export default function DealerDashboard() {
  const { dealer } = useDealerPortal();
  const data = useDashboardData();
  const { account, months, purchases, paid } = data;
  const { queries } = useMyQueries();
  const { schemes, isLoading: schemesLoading } = useMySchemes(data.schemeOrders);
  const openQueries = queries.filter((q) => q.status === 'Open' || q.status === 'In Progress').length;
  const labels = months.map(monthLabel);
  const latest = (values) => (values.length ? values[values.length - 1] : undefined);
  const activity = data.hasActivity;
  const emptyNote = data.isLoading ? 'Loading…' : 'No data yet';

  const invoiceRows = data.recentInvoices.map((d) => ({
    id: `${d.documentNo}-${d.documentDate}`,
    title: d.documentNo,
    detail: formatDate(d.documentDate),
    amount: formatRupees(d.net),
    tone: 'text-gray-800',
  }));
  const paymentRows = data.recentPayments.map((v) => ({
    id: v.id,
    title: v.voucherNo,
    detail: `${formatDate(v.date)} · ${v.mode}`,
    amount: formatRupees(v.amount),
    tone: 'text-success-700',
  }));

  return (
    <div>
      <div className="flex flex-col gap-5 md:gap-6">
        {data.errors.length > 0 && <Alert variant="error">Could not load your {data.errors.join(', ')}. Please refresh the page.</Alert>}
        <WelcomeBanner name={dealer.name} code={dealer.code} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 xl:grid-cols-4">
          <KpiCard
            label="Outstanding"
            unit="Rs Lacs"
            value={account ? account.outstanding : undefined}
            format={formatLacsWhole}
            icon="outstanding"
            tone="brand"
            note={account ? `Rs ${formatLacsWhole(account.overdue)} Lacs overdue` : emptyNote}
          />
          <KpiCard
            label="Purchases This Month"
            unit="Rs Lacs"
            value={activity ? latest(purchases) : undefined}
            format={formatLacsWhole}
            icon="orders"
            tone="success"
            note={activity ? 'Sales invoices · 6-month trend' : emptyNote}
            trend={activity ? purchases : undefined}
          />
          <KpiCard
            label="Payments This Month"
            unit="Rs Lacs"
            value={activity ? latest(paid) : undefined}
            format={formatLacsWhole}
            icon="payments"
            tone="warning"
            note={activity ? 'Payments made · 6-month trend' : emptyNote}
            trend={activity ? paid : undefined}
          />
          <KpiCard
            label="Open Queries"
            value={openQueries}
            format={(v) => formatCount(Math.round(v))}
            icon="queries"
            tone="error"
            note="Open or in progress"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-5 xl:grid-cols-3">
          {activity ? (
            <ChartCard
              className="xl:col-span-2"
              title="Purchases and Payments"
              subtitle="Sales invoices and payments made each month, Rs Lacs"
              legend={[
                { name: 'Purchases', color: BLUE, shape: 'box' },
                { name: 'Payments', color: ORANGE, shape: 'box' },
              ]}
              table={{
                columns: ['Month', 'Purchases (Rs Lacs)', 'Payments (Rs Lacs)'],
                rows: labels.map((m, i) => [m, formatLacs(purchases[i]), formatLacs(paid[i])]),
              }}
            >
              <ColumnChart
                labels={labels}
                series={[
                  { name: 'Purchases', color: BLUE, values: purchases.map((v) => Math.max(0, v)) },
                  { name: 'Payments', color: ORANGE, values: paid.map((v) => Math.max(0, v)) },
                ]}
                format={lacs}
                height={390}
              />
            </ChartCard>
          ) : (
            <Panel title="Purchases and Payments" className="xl:col-span-2">
              <EmptyState compact icon="reports" title={emptyNote} />
            </Panel>
          )}
          <OutstandingSnapshot account={account} dueNext={data.dueNext} />
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-2">
          <SchemeProgress schemes={schemes} isLoading={schemesLoading} />
          <RecentList title="Recent Payments" to="/dealer/payments" icon="payments" empty="No payments yet" rows={paymentRows} />
          <OpenQueries queries={queries} />
          <RecentList title="Recent Invoices" to="/dealer/invoices" icon="invoices" empty="No invoices yet" rows={invoiceRows} />
        </div>
      </div>
    </div>
  );
}
