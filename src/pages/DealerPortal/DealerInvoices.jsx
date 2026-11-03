import { useEffect, useMemo, useState } from 'react';
import ModulePage, { KpiStrip, TabBar } from '../../components/ModulePage/ModulePage.jsx';
import DataTable from '../../components/ModulePage/DataTable.jsx';
import Alert from '../../components/common/Alert.jsx';
import { invoicesApi } from '../../api/invoicesApi.js';
import { formatCount, formatDate, formatDateTime, formatLacsWhole, formatRupees } from '../../utils/format.js';

const RUPEES_PER_LAC = 100000;

// Financial years run April to March. The current year comes from dealer_sales,
// the two before it from dealer_sales_history ('2025-2026' in the database).
const YEARS = (() => {
  const now = new Date();
  const start = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  return [0, 1, 2].map((back) => {
    const from = start - back;
    return {
      label: `${from}-${String((from + 1) % 100).padStart(2, '0')}${back === 0 ? ' (Current)' : ''}`,
      financialYear: `${from}-${from + 1}`,
    };
  });
})();

function Chevron({ open }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={`h-4 w-4 shrink-0 text-gray-400 ${open ? 'rotate-90' : ''}`} aria-hidden="true">
      <path d="M8 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const COLUMNS = [
  { key: 'documentType', label: 'Document Type' },
  {
    key: 'documentNo',
    label: 'Document No.',
    render: (r, open) => (
      <span className="flex items-center gap-2">
        <Chevron open={open} />
        {r.documentNo}
      </span>
    ),
  },
  { key: 'documentDate', label: 'Document Date', render: (r) => formatDate(r.documentDate) },
  {
    key: 'subBrand',
    label: 'Sub Brand',
    render: (r) => (r.lines.length > 1 ? `${r.lines.length} items` : r.subBrand || '—'),
  },
  { key: 'basic', label: 'Basic Amount', align: 'right', render: (r) => formatRupees(r.basic) },
  { key: 'tax', label: 'Tax', align: 'right', render: (r) => formatRupees(r.tax) },
  { key: 'net', label: 'Net Amount', align: 'right', render: (r) => formatRupees(r.net) },
];

// App Launcher stores one row per item, so a document with several items
// arrives as several rows. Rows with the same document no. and type become
// one row with the amounts added up; the items show when the row is opened.
function groupByDocument(rows) {
  const groups = new Map();
  rows.forEach((r) => {
    const key = `${r.documentType}|${r.documentNo}`;
    const g = groups.get(key) ?? { id: key, documentType: r.documentType, documentNo: r.documentNo, documentDate: r.documentDate, subBrand: r.subBrand, basic: 0, tax: 0, net: 0, lines: [] };
    g.basic += r.basic;
    g.tax += r.tax;
    g.net += r.net;
    g.lines.push(r);
    groups.set(key, g);
  });
  return [...groups.values()].map((g) => ({ ...g, brands: g.lines.map((l) => l.subBrand).filter(Boolean).join(' ') }));
}

// The items inside one document, shown under its row.
function DocumentLines({ doc }) {
  return (
    <table className="w-full text-theme-sm">
      <thead>
        <tr className="text-left text-theme-xs uppercase tracking-wide text-gray-400">
          <th className="py-1.5 pr-4 font-medium">#</th>
          <th className="py-1.5 pr-4 font-medium">Sub Brand</th>
          <th className="py-1.5 pr-4 text-right font-medium">Basic Amount</th>
          <th className="py-1.5 pr-4 text-right font-medium">Tax</th>
          <th className="py-1.5 text-right font-medium">Net Amount</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {doc.lines.map((l, i) => (
          <tr key={l.id ?? i} className="text-gray-700">
            <td className="py-1.5 pr-4 text-gray-400">{i + 1}</td>
            <td className="py-1.5 pr-4">{l.subBrand || '—'}</td>
            <td className="py-1.5 pr-4 text-right tabular-nums">{formatRupees(l.basic)}</td>
            <td className="py-1.5 pr-4 text-right tabular-nums">{formatRupees(l.tax)}</td>
            <td className="py-1.5 text-right tabular-nums">{formatRupees(l.net)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Invoices and credit notes for the signed-in Dealer, from this project's copy
// of App Launcher's `sales` table (refreshed every 15 minutes).
export default function DealerInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [lastSynced, setLastSynced] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [year, setYear] = useState(YEARS[0].label);
  const [history, setHistory] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([invoicesApi.listMine(), invoicesApi.lastSynced()])
      .then(([data, synced]) => {
        if (cancelled) return;
        setInvoices(data);
        setLastSynced(synced);
      })
      .catch((err) => !cancelled && setError(err.message || 'Could not load your invoices.'))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  // Closed years load the first time one is chosen.
  useEffect(() => {
    if (year === YEARS[0].label || history) return;
    let cancelled = false;
    invoicesApi
      .listHistory()
      .then((data) => !cancelled && setHistory(data))
      .catch((err) => !cancelled && setError(err.message || 'Could not load earlier years.'));
    return () => {
      cancelled = true;
    };
  }, [year, history]);

  const selected = YEARS.find((y) => y.label === year) ?? YEARS[0];
  const isCurrent = selected === YEARS[0];
  const yearRows = useMemo(
    () => (isCurrent ? invoices : (history ?? []).filter((r) => r.financialYear === selected.financialYear)),
    [isCurrent, invoices, history, selected],
  );
  const loading = isLoading || (!isCurrent && !history && !error);
  const has = yearRows.length > 0;
  const documents = useMemo(() => groupByDocument(yearRows), [yearRows]);
  // App Launcher sends several reducing types (AR Credit Note, Sales Return,
  // ...), so everything that is not a Sales Invoice is totalled together.
  const salesInvoices = yearRows.filter((i) => i.documentType === 'Sales Invoice');
  const reductions = yearRows.filter((i) => i.documentType !== 'Sales Invoice');
  // Rows show rupees; KPI totals show Rs Lacs.
  const total = (rows) => (has ? formatLacsWhole(rows.reduce((s, i) => s + i.net, 0) / RUPEES_PER_LAC) : undefined);
  // Tabs follow the document types App Launcher actually sends.
  const tabs = useMemo(() => ['All', ...new Set(yearRows.map((i) => i.documentType).filter(Boolean))], [yearRows]);

  return (
    <ModulePage
      title="Invoices"
      description={`Your invoices and credit notes. Totals in Rs Lacs, documents in rupees.${lastSynced ? ` Last updated ${formatDateTime(lastSynced)}.` : ''}`}
      live
    >
      {error && <Alert variant="error">{error}</Alert>}
      <TabBar tabs={YEARS.map((y) => y.label)} active={year} onChange={setYear} />
      <KpiStrip
        items={[
          { label: 'Documents', value: has ? formatCount(documents.length) : undefined, icon: 'invoices', tone: 'brand' },
          { label: 'Sales Invoices (Net)', unit: 'Rs Lacs', value: total(salesInvoices), icon: 'payments', tone: 'gray' },
          { label: 'Returns & Credit Notes (Net)', unit: 'Rs Lacs', value: total(reductions), icon: 'outstanding', tone: 'warning' },
        ]}
      />
      <DataTable
        key={year}
        rows={documents}
        tabs={tabs}
        tabField="documentType"
        searchPlaceholder="Search document no. or sub brand"
        searchFields={['documentNo', 'brands']}
        columns={COLUMNS}
        renderExpanded={(doc) => <DocumentLines doc={doc} />}
        pageSize={10}
        empty={{
          icon: 'invoices',
          title: loading ? 'Loading invoices…' : isCurrent ? 'No invoices yet' : `No invoices in ${selected.label}`,
          hint: loading ? undefined : isCurrent ? 'Invoices raised for you will be listed here.' : undefined,
        }}
      />
    </ModulePage>
  );
}
