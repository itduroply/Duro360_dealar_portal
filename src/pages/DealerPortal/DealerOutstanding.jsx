import { useEffect, useMemo, useState } from 'react';
import ModulePage, { KpiStrip, StatusChip } from '../../components/ModulePage/ModulePage.jsx';
import Panel from '../../components/ModulePage/Panel.jsx';
import DataTable from '../../components/ModulePage/DataTable.jsx';
import Alert from '../../components/common/Alert.jsx';
import { outstandingApi } from '../../api/outstandingApi.js';
import { AGEING_BUCKETS, buildAccount } from '../../utils/outstanding.js';
import { formatCount, formatDate, formatLacs, formatLacsWhole, formatRupees } from '../../utils/format.js';

const RUPEES_PER_LAC = 100000;
const lacs = (rupees) => rupees / RUPEES_PER_LAC;

const BUCKET_STYLE = { '0–30': 'bg-success-500', '31–60': 'bg-warning-400', '61–90': 'bg-orange-500', '90+': 'bg-error-500' };

// How much of the credit limit is in use.
function CreditUsage({ account }) {
  const { creditLimit, outstanding } = account;
  const used = creditLimit ? outstanding / creditLimit : 0;
  const pct = Math.max(0, Math.round(used * 100));
  const available = creditLimit ? Math.max(0, creditLimit - outstanding) : null;
  return (
    <Panel title="Credit Limit Used" subtitle={`Credit terms: ${account.creditDays ?? '—'} days`}>
      <div className="flex items-end justify-between gap-3">
        <p className="text-3xl font-semibold text-gray-800">{creditLimit ? `${pct}%` : 'No limit set'}</p>
        <StatusChip status={account.status} />
      </div>
      <div className="mt-3 h-2.5 w-full rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full ${used > 1 ? 'bg-error-500' : used > 0.8 ? 'bg-warning-500' : 'bg-brand-500'}`}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
      <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-gray-100 pt-4 text-theme-sm">
        <div>
          <dt className="text-theme-xs text-gray-500">Credit Limit</dt>
          <dd className="font-medium tabular-nums text-gray-800">{creditLimit ? <>{formatLacs(lacs(creditLimit))}<span className="ml-1 text-theme-xs font-normal text-gray-400">Rs Lacs</span></> : '—'}</dd>
        </div>
        <div>
          <dt className="text-theme-xs text-gray-500">Outstanding</dt>
          <dd className="font-medium tabular-nums text-gray-800">{formatLacs(lacs(outstanding))}<span className="ml-1 text-theme-xs font-normal text-gray-400">Rs Lacs</span></dd>
        </div>
        <div>
          <dt className="text-theme-xs text-gray-500">Available</dt>
          <dd className="font-medium tabular-nums text-gray-800">{available === null ? '—' : <>{formatLacs(lacs(available))}<span className="ml-1 text-theme-xs font-normal text-gray-400">Rs Lacs</span></>}</dd>
        </div>
      </dl>
    </Panel>
  );
}

function AgeingBuckets({ account, items }) {
  return (
    <Panel title="Debtors Ageing" subtitle="Outstanding by age of document, Rs Lacs" className="xl:col-span-2">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {AGEING_BUCKETS.map((b) => (
          <div key={b} className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
            <span className={`mb-3 block h-1 w-10 rounded-full ${BUCKET_STYLE[b]}`} aria-hidden="true" />
            <p className="text-theme-xs font-medium text-gray-500">{b} Days</p>
            <p className="mt-0.5 text-xl font-semibold text-gray-800">
              {formatLacs(lacs(account.buckets[b]))}
              <span className="ml-1 text-theme-xs font-normal text-gray-400">Rs Lacs</span>
            </p>
            <p className="mt-1 text-theme-xs text-gray-400">{formatCount(items.filter((i) => i.bucket === b).length)} items</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

const COLUMNS = [
  { key: 'docType', label: 'Doc Type' },
  { key: 'docNo', label: 'Document No.' },
  { key: 'documentDate', label: 'Document Date', render: (r) => formatDate(r.documentDate) },
  { key: 'dueDate', label: 'Due Date', render: (r) => formatDate(r.dueDate) },
  {
    key: 'daysOverdue',
    label: 'Days Overdue',
    align: 'right',
    render: (r) => (r.daysOverdue > 0 ? <span className="font-medium text-error-600">{r.daysOverdue}</span> : '—'),
  },
  { key: 'bucket', label: 'Age (Days)' },
  { key: 'balance', label: 'Balance Due', align: 'right', render: (r) => formatRupees(r.balance) },
];

// The Dealer's own dues: credit use, debtors ageing, and each open item, from
// this project's copy of App Launcher's `customer_outstanding`.
export default function DealerOutstanding() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    outstandingApi
      .listMine()
      .then((data) => !cancelled && setRows(data))
      .catch((err) => !cancelled && setError(err.message || 'Could not load your outstanding.'))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const { account, items } = useMemo(() => buildAccount(rows), [rows]);
  const overdueItems = items.filter((i) => i.daysOverdue > 0);
  const has = Boolean(account);

  return (
    <ModulePage
      title="Outstanding"
      description={`What you owe Duroply, by age of document. Totals in Rs Lacs, documents in rupees.${account?.asOnDate ? ` Balances as on ${formatDate(account.asOnDate)}.` : ''}`}
      live
    >
      {error && <Alert variant="error">{error}</Alert>}
      <KpiStrip
        items={[
          { label: 'Total Outstanding', unit: 'Rs Lacs', value: has ? formatLacsWhole(lacs(account.outstanding)) : undefined, icon: 'outstanding', tone: 'brand' },
          { label: 'Overdue', unit: 'Rs Lacs', value: has ? formatLacsWhole(lacs(account.overdue)) : undefined, icon: 'queries', tone: 'error' },
          { label: 'Open Items', value: has ? formatCount(items.length) : undefined, icon: 'invoices', tone: 'gray' },
          { label: 'Overdue Items', value: has ? formatCount(overdueItems.length) : undefined, icon: 'notifications', tone: 'warning' },
        ]}
      />
      {has && (
        <div className="grid grid-cols-1 gap-4 md:gap-5 xl:grid-cols-3">
          <CreditUsage account={account} />
          <AgeingBuckets account={account} items={items} />
        </div>
      )}
      <DataTable
        title="Open Items"
        rows={items}
        tabs={['All', 'Overdue', ...AGEING_BUCKETS]}
        tabMatch={(r, tab) => (tab === 'Overdue' ? r.daysOverdue > 0 : r.bucket === tab)}
        searchPlaceholder="Search document no."
        searchFields={['docNo']}
        columns={COLUMNS}
        pageSize={10}
        empty={{
          icon: 'outstanding',
          title: isLoading ? 'Loading outstanding…' : 'Nothing outstanding',
          hint: isLoading ? undefined : 'Your open invoices and balances will show here.',
        }}
      />
    </ModulePage>
  );
}
