import { useEffect, useMemo, useState } from 'react';
import ModulePage, { KpiStrip } from '../../components/ModulePage/ModulePage.jsx';
import DataTable from '../../components/ModulePage/DataTable.jsx';
import Alert from '../../components/common/Alert.jsx';
import { invoicesApi } from '../../api/invoicesApi.js';
import { receiptsApi } from '../../api/receiptsApi.js';
import { useDealerPortal } from './useDealerPortal.js';
import { downloadCsv } from '../../utils/csv.js';
import { PERIODS, formatCount, formatDate, formatDateTime, formatLacsWhole, formatRupees, inPeriod } from '../../utils/format.js';

const RUPEES_PER_LAC = 100000;
const lacs = (rupees) => rupees / RUPEES_PER_LAC;
const pad = (n) => String(n).padStart(2, '0');

function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const TYPE_STYLE = {
  Invoice: 'bg-brand-50 text-brand-600',
  'Credit Note': 'bg-warning-50 text-warning-700',
  Payment: 'bg-success-50 text-success-700',
};

// Debit = the Dealer owes Duroply more (invoice). Credit = the Dealer owes
// less (payment, credit note, sales return). App Launcher may store credits
// as negative or positive amounts, so credits are shown as positive numbers.
function buildEntries(documents, receiptLines) {
  const entries = documents
    .filter((d) => d.documentDate)
    .map((d) => {
      const isInvoice = d.documentType === 'Sales Invoice';
      return {
        id: `doc-${d.documentNo}`,
        date: d.documentDate,
        type: isInvoice ? 'Invoice' : 'Credit Note',
        ref: d.documentNo,
        particulars: d.documentType || '—',
        debit: isInvoice ? d.net : 0,
        credit: isInvoice ? 0 : Math.abs(d.net),
      };
    });

  // A receipt can settle several documents (several lines): one entry per voucher.
  const vouchers = new Map();
  receiptLines
    .filter((l) => l.voucherDate)
    .forEach((l) => {
      const key = l.voucherNo || `line-${l.id}`;
      const v = vouchers.get(key) ?? { id: `rcpt-${key}`, date: l.voucherDate, type: 'Payment', ref: l.voucherNo || '—', mode: l.mode, referenceNo: l.referenceNo, debit: 0, credit: 0, docs: [] };
      v.credit += Math.abs(l.amount);
      if (l.documentNo && !v.docs.includes(l.documentNo)) v.docs.push(l.documentNo);
      vouchers.set(key, v);
    });
  vouchers.forEach((v) => {
    const parts = [v.mode, v.referenceNo ? `Ref ${v.referenceNo}` : null, v.docs.length ? `Against ${v.docs.join(', ')}` : null].filter(Boolean);
    entries.push({ ...v, particulars: parts.join(' · ') || 'Receipt' });
  });

  return entries.sort((a, b) => b.date.localeCompare(a.date) || String(b.ref).localeCompare(String(a.ref)));
}

const COLUMNS = [
  { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
  {
    key: 'type',
    label: 'Type',
    render: (r) => <span className={`rounded-full px-2.5 py-0.5 text-theme-xs font-medium ${TYPE_STYLE[r.type]}`}>{r.type}</span>,
  },
  { key: 'ref', label: 'Reference' },
  {
    key: 'particulars',
    label: 'Particulars',
    render: (r) => (
      <span className="block max-w-[320px] truncate" title={r.particulars}>
        {r.particulars}
      </span>
    ),
  },
  { key: 'debit', label: 'Debit', align: 'right', render: (r) => (r.debit ? formatRupees(r.debit) : '') },
  { key: 'credit', label: 'Credit', align: 'right', render: (r) => (r.credit ? formatRupees(r.credit) : '') },
];

// Every invoice, credit note and payment on the Dealer's account, newest
// first. Invoices and credit notes come from the copy of App Launcher's
// `sales`, payments from its `receipts` (both refreshed every 15 minutes).
// There is no running balance here: the amount due is on the Outstanding page.
export default function DealerTransactions() {
  const { dealer } = useDealerPortal();
  const [entries, setEntries] = useState([]);
  const [lastSynced, setLastSynced] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([invoicesApi.listDocuments(), receiptsApi.listMine(), receiptsApi.lastSynced()])
      .then(([documents, receipts, synced]) => {
        if (cancelled) return;
        setEntries(buildEntries(documents, receipts));
        setLastSynced(synced);
      })
      .catch((err) => !cancelled && setError(err.message || 'Could not load your transactions.'))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const today = todayIso();
  const has = entries.length > 0;
  const totalDebit = useMemo(() => entries.reduce((s, e) => s + e.debit, 0), [entries]);
  const totalCredit = useMemo(() => entries.reduce((s, e) => s + e.credit, 0), [entries]);
  const net = totalDebit - totalCredit;

  function downloadStatement() {
    downloadCsv(`Account Statement ${dealer.code}`, {
      columns: ['Date', 'Type', 'Reference', 'Particulars', 'Debit (Rs)', 'Credit (Rs)'],
      rows: [...entries].reverse().map((e) => [e.date, e.type, e.ref, e.particulars, e.debit || '', e.credit || '']),
    });
  }

  return (
    <ModulePage
      title="Transactions"
      description={`Every invoice, credit note and payment on your account. Totals in Rs Lacs, entries in rupees.${lastSynced ? ` Last updated ${formatDateTime(lastSynced)}.` : ''}`}
      live
      actions={has ? [{ label: 'Download Statement', onClick: downloadStatement }] : []}
    >
      {error && <Alert variant="error">{error}</Alert>}
      <KpiStrip
        items={[
          { label: 'Entries', value: has ? formatCount(entries.length) : undefined, icon: 'transactions', tone: 'gray' },
          { label: 'Total Debits', unit: 'Rs Lacs', value: has ? formatLacsWhole(lacs(totalDebit)) : undefined, icon: 'invoices', tone: 'brand' },
          { label: 'Total Credits', unit: 'Rs Lacs', value: has ? formatLacsWhole(lacs(totalCredit)) : undefined, icon: 'payments', tone: 'success' },
          { label: 'Debits less Credits', unit: net < 0 ? 'Rs Lacs Cr' : 'Rs Lacs Dr', value: has ? formatLacsWhole(Math.abs(lacs(net))) : undefined, icon: 'outstanding', tone: 'warning' },
        ]}
      />
      <DataTable
        rows={entries}
        tabs={['All', 'Invoice', 'Credit Note', 'Payment']}
        tabField="type"
        searchPlaceholder="Search reference or particulars"
        searchFields={['ref', 'particulars']}
        filters={[{ id: 'period', label: 'All Periods', options: PERIODS, match: (r, v) => inPeriod(r.date, v, today) }]}
        columns={COLUMNS}
        pageSize={15}
        empty={{
          icon: 'transactions',
          title: isLoading ? 'Loading transactions…' : 'No transactions yet',
          hint: isLoading ? undefined : 'Invoices and payments on your account will be listed here.',
        }}
      />
    </ModulePage>
  );
}
