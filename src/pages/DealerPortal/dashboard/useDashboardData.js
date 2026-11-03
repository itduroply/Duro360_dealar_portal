import { useEffect, useMemo, useState } from 'react';
import { outstandingApi } from '../../../api/outstandingApi.js';
import { invoicesApi } from '../../../api/invoicesApi.js';
import { receiptsApi } from '../../../api/receiptsApi.js';
import { buildAccount } from '../../../utils/outstanding.js';
import { groupVouchers, lastSixMonths, todayIso } from '../../../utils/payments.js';

const RUPEES_PER_LAC = 100000;
const lacs = (rupees) => rupees / RUPEES_PER_LAC;
const sum = (rows, key) => rows.reduce((s, r) => s + r[key], 0);

// Everything the Dealer Dashboard shows, from the Dealer's own rows in the
// App Launcher copies (outstanding, invoices, receipts). Money is in Rs Lacs.
// Each source loads on its own, so one failing does not blank the page.
export function useDashboardData() {
  const [state, setState] = useState({ outstanding: [], documents: [], receipts: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const sources = [
      ['outstanding', 'outstanding', outstandingApi.listMine()],
      ['documents', 'invoices', invoicesApi.listDocuments()],
      ['receipts', 'payments', receiptsApi.listMine()],
    ];
    Promise.allSettled(sources.map(([, , p]) => p)).then((results) => {
      if (cancelled) return;
      const next = {};
      const failed = [];
      results.forEach((r, i) => {
        const [key, label] = sources[i];
        next[key] = r.status === 'fulfilled' ? r.value : [];
        if (r.status === 'rejected') failed.push(label);
      });
      setState((s) => ({ ...s, ...next }));
      setErrors(failed);
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(() => {
    const today = todayIso();
    const months = lastSixMonths(today);
    const { account, items } = buildAccount(state.outstanding);
    const invoices = state.documents.filter((d) => d.documentType === 'Sales Invoice' && d.documentDate);
    const vouchers = groupVouchers(state.receipts).filter((v) => v.date);

    const monthTotal = (rows, dateKey, valueKey) =>
      months.map((m) => lacs(sum(rows.filter((r) => r[dateKey].slice(0, 7) === m), valueKey)));
    const purchases = monthTotal(invoices, 'documentDate', 'net');
    const paid = monthTotal(vouchers, 'date', 'amount');

    return {
      isLoading,
      errors,
      months,
      hasAccount: Boolean(account),
      hasActivity: invoices.length > 0 || vouchers.length > 0,
      account: account && {
        ...account,
        outstanding: lacs(account.outstanding),
        overdue: lacs(account.overdue),
        creditLimit: account.creditLimit === null ? null : lacs(account.creditLimit),
        buckets: Object.fromEntries(Object.entries(account.buckets).map(([k, v]) => [k, lacs(v)])),
      },
      // Open items, soonest due first (the API returns them in that order).
      dueNext: items.filter((i) => i.balance > 0 && i.daysOverdue === 0).slice(0, 3),
      overdueCount: items.filter((i) => i.daysOverdue > 0).length,
      purchases,
      paid,
      recentInvoices: invoices.slice(0, 5),
      recentPayments: vouchers.slice(0, 5),
      // Sales invoices as the "orders" a scheme counts towards its target.
      schemeOrders: invoices.map((d) => ({ status: 'Invoiced', date: d.documentDate, amount: lacs(d.net) })),
    };
  }, [state, isLoading, errors]);
}
