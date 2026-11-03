import { useEffect, useMemo, useState } from 'react';
import ModulePage from '../../components/ModulePage/ModulePage.jsx';
import Panel from '../../components/ModulePage/Panel.jsx';
import DataTable from '../../components/ModulePage/DataTable.jsx';
import Alert from '../../components/common/Alert.jsx';
import KpiCard from './dashboard/KpiCard.jsx';
import ChartCard from '../../components/Charts/ChartCard.jsx';
import ColumnChart from '../../components/Charts/ColumnChart.jsx';
import { SERIES_COLORS } from '../../components/Charts/chartTheme.js';
import { receiptsApi } from '../../api/receiptsApi.js';
import { financialYear, groupVouchers, lastSixMonths, todayIso } from '../../utils/payments.js';
import { PERIODS, formatCount, formatDate, formatDateTime, formatLacs, formatLacsWhole, formatRupees, inPeriod, monthLabel } from '../../utils/format.js';

const RUPEES_PER_LAC = 100000;
const lacs = (rupees) => rupees / RUPEES_PER_LAC;
const sum = (rows) => rows.reduce((s, r) => s + r.amount, 0);

// Share of this financial year's payments by mode (App Launcher's cash/bank
// book name).
function ModeSplit({ vouchers, title }) {
  const totals = new Map();
  vouchers.forEach((v) => totals.set(v.mode, (totals.get(v.mode) ?? 0) + v.amount));
  const byMode = [...totals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  const max = Math.max(1, ...byMode.map(([, value]) => value));
  return (
    <Panel title="By Payment Mode" subtitle={`${title}, Rs Lacs`}>
      {byMode.length === 0 ? (
        <p className="text-theme-sm text-gray-500">No payments in this period.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {byMode.map(([mode, value]) => (
            <li key={mode}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-theme-sm">
                <span className="truncate text-gray-600">{mode}</span>
                <span className="shrink-0 font-medium tabular-nums text-gray-800">Rs {formatLacs(lacs(value))} Lacs</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-brand-500" style={{ width: `${(Math.max(0, value) / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

// "GRSI/01392/2526 +2 more": the first document and how many others.
function AgainstCell({ documents }) {
  if (documents.length === 0) return '—';
  const extra = documents.length - 1;
  return (
    <span title={documents.join(', ')}>
      {documents[0]}
      {extra > 0 && <span className="ml-1.5 rounded-full bg-gray-100 px-2 py-0.5 text-theme-xs font-medium text-gray-600">+{extra} more</span>}
    </span>
  );
}

const COLUMNS = [
  { key: 'date', label: 'Voucher Date', render: (r) => formatDate(r.date) },
  {
    key: 'voucherNo',
    label: 'Voucher No.',
    render: (r) => (
      <span className="block">
        <span className="block font-semibold text-gray-800">{r.voucherNo}</span>
        <span className="block max-w-[240px] truncate text-theme-xs text-gray-500" title={r.mode}>
          {r.mode}
        </span>
      </span>
    ),
  },
  { key: 'referenceNo', label: 'Reference No.' },
  { key: 'against', label: 'Against', render: (r) => <AgainstCell documents={r.documents} /> },
  { key: 'amount', label: 'Amount', align: 'right', render: (r) => <span className="font-semibold text-success-700">{formatRupees(r.amount)}</span> },
];

// The Dealer's own payments to Duroply, from this project's copy of App
// Launcher's `receipts` table (refreshed every 15 minutes).
export default function DealerPayments() {
  const [lines, setLines] = useState([]);
  const [lastSynced, setLastSynced] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([receiptsApi.listMine(), receiptsApi.lastSynced()])
      .then(([data, synced]) => {
        if (cancelled) return;
        setLines(data);
        setLastSynced(synced);
      })
      .catch((err) => !cancelled && setError(err.message || 'Could not load your payments.'))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const today = todayIso();
  const fy = financialYear(today);
  const vouchers = useMemo(() => groupVouchers(lines), [lines]);
  const has = vouchers.length > 0;

  const thisMonth = vouchers.filter((v) => v.date && inPeriod(v.date, 'This Month', today));
  const thisYear = vouchers.filter((v) => v.date && v.date >= fy.start);
  const latest = vouchers.find((v) => v.date);

  const months = lastSixMonths(today);
  const labels = months.map(monthLabel);
  const monthly = months.map((m) => lacs(sum(vouchers.filter((v) => v.date && v.date.slice(0, 7) === m))));

  const modes = useMemo(() => [...new Set(vouchers.map((v) => v.mode).filter((m) => m !== '—'))].sort(), [vouchers]);

  return (
    <ModulePage
      title="Payments"
      description={`Payments you have made to Duroply. Totals in Rs Lacs, payments in rupees.${lastSynced ? ` Last updated ${formatDateTime(lastSynced)}.` : ''}`}
      live
    >
      {error && <Alert variant="error">{error}</Alert>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 xl:grid-cols-4">
        <KpiCard
          label="Paid This Month"
          unit="Rs Lacs"
          value={has ? lacs(sum(thisMonth)) : undefined}
          format={formatLacsWhole}
          icon="payments"
          tone="brand"
          note={has ? `${formatCount(thisMonth.length)} payments · 6-month trend` : 'No data yet'}
          trend={monthly}
        />
        <KpiCard
          label={`Paid in ${fy.label}`}
          unit="Rs Lacs"
          value={has ? lacs(sum(thisYear)) : undefined}
          format={formatLacsWhole}
          icon="invoices"
          tone="success"
          note={has ? `${formatCount(thisYear.length)} payments this year` : 'No data yet'}
          delay={80}
        />
        <KpiCard
          label="Last Payment"
          unit="Rs Lacs"
          value={latest ? lacs(latest.amount) : undefined}
          format={formatLacsWhole}
          icon="outstanding"
          tone="warning"
          note={latest ? `${formatDate(latest.date)} · ${latest.mode}` : 'No data yet'}
          delay={160}
        />
        <KpiCard
          label="Payments Made"
          value={has ? vouchers.length : undefined}
          format={(v) => formatCount(Math.round(v))}
          icon="transactions"
          tone="error"
          note="All payments on record"
          delay={240}
        />
      </div>
      {has && (
        <div className={`grid grid-cols-1 gap-4 md:gap-5 ${modes.length > 1 ? 'xl:grid-cols-3' : ''}`}>
          <ChartCard
            className={modes.length > 1 ? 'xl:col-span-2' : ''}
            title="Payments by Month"
            subtitle="Rs Lacs"
            table={{ columns: ['Month', 'Paid (Rs Lacs)'], rows: labels.map((m, i) => [m, formatLacs(monthly[i])]) }}
          >
            <ColumnChart labels={labels} series={[{ name: 'Paid', color: SERIES_COLORS[0], values: monthly.map((v) => Math.max(0, v)) }]} format={(v) => `${formatLacs(v)} Lacs`} height={230} />
          </ChartCard>
          {modes.length > 1 && <ModeSplit vouchers={thisYear} title={fy.label} />}
        </div>
      )}
      <DataTable
        rows={vouchers}
        searchPlaceholder="Search voucher, reference or document"
        searchFields={['voucherNo', 'referenceNo', 'against']}
        filters={[
          ...(modes.length > 1 ? [{ id: 'mode', label: 'All Modes', options: modes }] : []),
          { id: 'period', label: 'All Periods', options: PERIODS, match: (r, v) => Boolean(r.date) && inPeriod(r.date, v, today) },
        ]}
        columns={COLUMNS}
        empty={{
          icon: 'payments',
          title: isLoading ? 'Loading payments…' : 'No payments yet',
          hint: isLoading ? undefined : 'Payments you make will be listed here.',
        }}
      />
    </ModulePage>
  );
}
