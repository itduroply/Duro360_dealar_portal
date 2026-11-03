
import { SHOW_SAMPLE_DATA } from './index.js';
import {
  SAMPLE_DEALERS, SAMPLE_ORDERS, SAMPLE_INVOICES, SAMPLE_PAYMENTS, SAMPLE_OUTSTANDING, AGEING_BUCKETS, REPORT_MONTHS, TODAY,
} from './transactions.js';
import { SAMPLE_SCHEMES } from './service.js';
import { addDays, daysBetween, formatDate } from '../../utils/format.js';

const round1 = (n) => Math.round(n * 10) / 10;
const total = (rows, key = 'amount') => rows.reduce((s, r) => s + r[key], 0);

function sourceDealerFor(code) {
  const hash = [...String(code)].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7);
  return SAMPLE_DEALERS[hash % SAMPLE_DEALERS.length];
}

export function ageingBucket(age) {
  if (age <= 30) return '0–30';
  if (age <= 60) return '31–60';
  if (age <= 90) return '61–90';
  return '90+';
}

// Purchase target and incentive rate per scheme, for this Dealer.
const SCHEME_TERMS = {
  'SCH-01': { target: 12, rate: 1.5 },
  'SCH-02': { target: 15, rate: 1 },
  'SCH-03': { target: 10, rate: 1.25 },
  'SCH-04': { target: 8, rate: 1 },
  'SCH-05': { target: 6, rate: 0.75 },
  'SCH-06': { target: 9, rate: 1 },
};

const EMPTY = {
  orders: [], invoices: [], payments: [], openInvoices: [], ledger: [], schemes: [],
  sharedDocuments: [], documentRequests: [], notifications: [],
  account: null, monthly: { months: REPORT_MONTHS, purchases: [], invoiced: [], paid: [] },
};

export function buildDealerSample({ code, name }) {
  if (!SHOW_SAMPLE_DATA) return EMPTY;
  const source = sourceDealerFor(code);
  const mine = (rows) => rows.filter((r) => r.dealerCode === source.code).map((r) => ({ ...r, dealerCode: code, dealerName: name }));

  const orders = mine(SAMPLE_ORDERS);
  const invoices = mine(SAMPLE_INVOICES);
  const payments = mine(SAMPLE_PAYMENTS);
  const received = payments.filter((p) => p.status !== 'Returned');
  const liveOrders = orders.filter((o) => o.status !== 'Cancelled');

  // ---- Outstanding ------------------------------------------------------
  const row = SAMPLE_OUTSTANDING.find((d) => d.code === source.code);
  const account = {
    creditLimit: source.creditLimit,
    creditDays: 45,
    outstanding: row.outstanding,
    overdue: row.overdue,
    buckets: row.buckets,
    status: row.status,
  };
  const openInvoices = invoices
    .filter((inv) => inv.balance > 0)
    .map((inv) => {
      const age = daysBetween(inv.date, TODAY);
      return { ...inv, age, bucket: ageingBucket(age), daysOverdue: Math.max(0, daysBetween(inv.dueDate, TODAY)) };
    })
    .sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1));

  // ---- Ledger: invoices are debits, payments are credits ----------------
  // A returned cheque is a credit and then a debit on the same day, so it
  // does not change the balance.
  const entries = [
    ...invoices.map((inv) => ({ date: inv.date, type: 'Invoice', ref: inv.id, particulars: `Sales invoice against ${inv.orderId}`, debit: inv.amount, credit: 0 })),
    ...payments.flatMap((p) => {
      const credit = { date: p.date, type: 'Payment', ref: p.id, particulars: `Payment received – ${p.mode}`, debit: 0, credit: p.amount };
      if (p.status !== 'Returned') return [credit];
      return [credit, { date: p.date, type: 'Reversal', ref: p.id, particulars: 'Cheque returned', debit: p.amount, credit: 0 }];
    }),
  ].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.type === 'Invoice' ? -1 : 1));
  let balance = 0;
  const ledger = entries
    .map((e, i) => {
      balance = round1(balance + e.debit - e.credit);
      return { ...e, id: `${e.ref}-${e.type}-${i}`, balance };
    })
    .reverse(); // newest first

  // ---- Monthly roll-ups (Dashboard and Reports) -------------------------
  const byMonth = (rows, value = (r) => r.amount) =>
    REPORT_MONTHS.map((m) => rows.filter((r) => r.date.startsWith(m)).reduce((s, r) => s + value(r), 0));
  const monthly = {
    months: REPORT_MONTHS,
    purchases: byMonth(liveOrders),
    orderCount: REPORT_MONTHS.map((m) => liveOrders.filter((o) => o.date.startsWith(m)).length),
    invoiced: byMonth(invoices),
    paid: byMonth(received),
  };

  // ---- Schemes: progress = order value inside the scheme dates ----------
  const schemes = SAMPLE_SCHEMES.map((s) => {
    const terms = SCHEME_TERMS[s.id];
    const achieved = round1(total(liveOrders.filter((o) => o.date >= s.start && o.date <= s.end)));
    const reached = achieved >= terms.target;
    return {
      id: s.id, name: s.name, type: s.type, start: s.start, end: s.end, status: s.status,
      target: terms.target, rate: terms.rate, achieved, reached,
      rule: `${terms.rate}% of purchase value on reaching Rs ${terms.target} Lacs in the scheme period.`,
    };
  });

  // ---- Documents ---------------------------------------------------------
  const latestInvoice = invoices[0];
  const sharedDocuments = [
    { id: 'DD-09', name: 'Price List – October 2026.pdf', category: 'Price List', date: '2026-09-22', size: '1.2 MB' },
    { id: 'DD-08', name: `Account Statement – Aug 2026 – ${code}.pdf`, category: 'Account Statement', date: '2026-09-05', size: '240 KB' },
    { id: 'DD-07', name: 'Festive Scheme Circular.pdf', category: 'Circular', date: '2026-09-15', size: '310 KB' },
    { id: 'DD-06', name: 'Dealer Agreement FY 2026-27.pdf', category: 'Agreement', date: '2026-04-10', size: '860 KB' },
    { id: 'DD-05', name: 'Authorised Dealer Certificate 2026-27.pdf', category: 'Certificate', date: '2026-04-10', size: '420 KB' },
    { id: 'DD-04', name: 'Dispatch Timing Circular.pdf', category: 'Circular', date: '2026-09-02', size: '180 KB' },
    { id: 'DD-03', name: 'Price List – September 2026.pdf', category: 'Price List', date: '2026-08-28', size: '1.1 MB' },
    { id: 'DD-02', name: 'Holiday Schedule 2026.pdf', category: 'Circular', date: '2026-08-12', size: '95 KB' },
  ].sort((a, b) => (a.date < b.date ? 1 : -1));
  const documentRequests = [
    { id: 'DR-14', name: 'GST Registration Certificate', note: 'Needed to update your master record.', requestedOn: '2026-09-18', dueOn: '2026-09-30', status: 'Pending' },
    { id: 'DR-13', name: 'Signed Dealer Agreement FY 2026-27', note: 'Sign each page and upload the scanned copy.', requestedOn: '2026-09-10', dueOn: '2026-09-25', status: 'Pending' },
    // { id: 'DR-12', name: 'Cancelled Cheque', note: 'For refunds and incentive payouts.', requestedOn: '2026-08-20', dueOn: '2026-08-31', status: 'Submitted' },
    { id: 'DR-11', name: 'PAN Card Copy', note: 'Self-attested copy.', requestedOn: '2026-04-12', dueOn: '2026-04-30', status: 'Accepted' },
  ];


  // ---- Notifications (built from this Dealer's own records) -------------
  const dispatched = orders.find((o) => o.status === 'Dispatched');
  const confirmed = received.find((p) => p.status === 'Confirmed');
  const overdueCount = openInvoices.filter((i) => i.daysOverdue > 0).length;
  const notifications = [
    latestInvoice && { id: 'DN-9', category: 'Invoices', title: `Invoice ${latestInvoice.id} raised`, text: `Invoice for Rs ${latestInvoice.amount} Lacs against order ${latestInvoice.orderId}. Due on ${formatDate(latestInvoice.dueDate)}.`, at: `${latestInvoice.date}T18:10`, read: false },
    { id: 'DN-7', category: 'General', title: 'October price list is out', text: 'The new price list is in Documents. It applies to orders from 1 October.', at: '2026-09-22T10:00', read: false },
    dispatched && { id: 'DN-6', category: 'Orders', title: `Order ${dispatched.id} dispatched`, text: 'Your order has left the plant.', at: `${addDays(dispatched.date, 3)}T14:25`, read: true },
    confirmed && { id: 'DN-5', category: 'Payments', title: `Payment ${confirmed.id} confirmed`, text: `Rs ${confirmed.amount} Lacs received by ${confirmed.mode} and adjusted against ${confirmed.invoiceId}.`, at: `${confirmed.date}T17:00`, read: true },
    { id: 'DN-4', category: 'Schemes', title: 'Festive Season Booster 2026 is live', text: 'Order between 15 September and 15 November to earn the scheme incentive.', at: '2026-09-15T09:30', read: true },
    overdueCount > 0 && { id: 'DN-3', category: 'Payments', title: 'Overdue reminder', text: `${overdueCount} invoice(s) are past the due date. Please see Outstanding.`, at: '2026-09-10T09:00', read: true },
    { id: 'DN-2', category: 'General', title: 'Plant closed on 2 October', text: 'No dispatches on 2 October. Orders will move from 3 October.', at: '2026-09-08T12:00', read: true },
  ]
    .filter(Boolean)
    .sort((a, b) => (a.at < b.at ? 1 : -1));

  return {
    sourceCode: source.code,
    orders, invoices, payments, openInvoices, ledger, account, monthly, schemes,
    sharedDocuments, documentRequests, notifications,
  };
}

export { AGEING_BUCKETS, TODAY };
