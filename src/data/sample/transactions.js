// SAMPLE DATA -- fictional dealers and transactions for layout review only.
// Not real Duroply records. Everything below is generated from a fixed seed,
// so it is the same on every load, and the modules are linked to each other:
//   orders -> invoices (dispatched/delivered orders) -> payments (paid part)
//   unpaid balances -> outstanding + debtors ageing
// That keeps Orders, Invoices, Payments, Outstanding, Dashboard and Reports
// in agreement. Amounts are in Rs Lacs.
import { addDays, daysBetween } from '../../utils/format.js';

export const TODAY = '2026-09-24';
const CREDIT_DAYS = 45;

// Small seeded random generator (mulberry32).
function seeded(seed) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = seeded(1957);
const between = (min, max) => min + rand() * (max - min);
const int = (min, max) => Math.floor(between(min, max + 1));
const pick = (list) => list[Math.floor(rand() * list.length)];
const round1 = (n) => Math.round(n * 10) / 10;

export const SAMPLE_DEALERS = [
  { code: 'C10214', name: 'Shree Balaji Ply & Hardware', zone: 'North', branch: 'Jaipur', creditLimit: 60 },
  { code: 'C10238', name: 'Maruti Timber Traders', zone: 'North', branch: 'Lucknow', creditLimit: 45 },
  { code: 'C10251', name: 'Sai Laminates & Ply', zone: 'West', branch: 'Pune', creditLimit: 55 },
  { code: 'C10267', name: 'Om Sai Hardware Mart', zone: 'West', branch: 'Ahmedabad', creditLimit: 30 },
  { code: 'C10282', name: 'Kaveri Wood Centre', zone: 'South', branch: 'Bengaluru', creditLimit: 70 },
  { code: 'C10295', name: 'Lakshmi Plywood House', zone: 'South', branch: 'Chennai', creditLimit: 50 },
  { code: 'C10303', name: 'Ganga Timber Mart', zone: 'East', branch: 'Patna', creditLimit: 25 },
  { code: 'C10317', name: 'Tirupati Ply Centre', zone: 'South', branch: 'Hyderabad', creditLimit: 40 },
  { code: 'C10329', name: 'Durga Hardware & Ply', zone: 'East', branch: 'Kolkata', creditLimit: 35 },
  { code: 'C10344', name: 'Narmada Wood Works', zone: 'Central', branch: 'Indore', creditLimit: 30 },
  { code: 'C10358', name: 'Krishna Plywood Agency', zone: 'Central', branch: 'Nagpur', creditLimit: 20 },
  { code: 'C10362', name: 'Royal Ply Point', zone: 'North', branch: 'Ludhiana', creditLimit: 40 },
];

export const ZONES = ['North', 'West', 'South', 'East', 'Central'];
export const PAYMENT_MODES = ['NEFT / RTGS', 'Cheque', 'UPI', 'LC', 'BC'];

// ---- Orders: 1 Apr 2026 to yesterday -------------------------------------
function orderStatus(age) {
  if (rand() < 0.05) return 'Cancelled';
  if (age > 25) return 'Delivered';
  if (age > 14) return rand() < 0.5 ? 'Dispatched' : 'Delivered';
  if (age > 6) return rand() < 0.5 ? 'Approved' : 'Dispatched';
  return rand() < 0.7 ? 'Pending' : 'Approved';
}

export const SAMPLE_ORDERS = [];
{
  let date = '2026-04-01';
  let n = 1;
  while (date < TODAY) {
    const perDay = rand() < 0.2 ? 2 : rand() < 0.7 ? 1 : 0;
    for (let i = 0; i < perDay; i += 1) {
      const dealer = pick(SAMPLE_DEALERS);
      SAMPLE_ORDERS.push({
        id: `SO/26-27/${String(n).padStart(4, '0')}`,
        date,
        dealerName: dealer.name,
        dealerCode: dealer.code,
        zone: dealer.zone,
        items: int(2, 14),
        amount: round1(between(1.5, 12)),
        status: orderStatus(daysBetween(date, TODAY)),
      });
      n += 1;
    }
    date = addDays(date, 1);
  }
  SAMPLE_ORDERS.reverse(); // newest first
}

// ---- Invoices: one per dispatched/delivered order -----------------------
function paidShare(age) {
  const r = rand();
  if (age > 75) return r < 0.8 ? 1 : r < 0.9 ? between(0.4, 0.7) : 0;
  if (age > 40) return r < 0.5 ? 1 : r < 0.8 ? between(0.4, 0.7) : 0;
  return r < 0.2 ? 1 : r < 0.4 ? between(0.3, 0.6) : 0;
}

export const SAMPLE_INVOICES = [];
{
  let n = 1;
  [...SAMPLE_ORDERS]
    .reverse()
    .filter((o) => o.status === 'Dispatched' || o.status === 'Delivered')
    .forEach((o) => {
      const date = addDays(o.date, 2);
      if (date >= TODAY) return;
      const share = paidShare(daysBetween(date, TODAY));
      const paid = round1(o.amount * share);
      const balance = round1(o.amount - paid);
      SAMPLE_INVOICES.push({
        id: `INV/26-27/${String(n).padStart(4, '0')}`,
        date,
        dueDate: addDays(date, CREDIT_DAYS),
        orderId: o.id,
        dealerName: o.dealerName,
        dealerCode: o.dealerCode,
        zone: o.zone,
        amount: o.amount,
        paid,
        balance,
        status: balance <= 0 ? 'Paid' : paid > 0 ? 'Partly Paid' : 'Unpaid',
      });
      n += 1;
    });
  SAMPLE_INVOICES.reverse();
}

// ---- Payments: the paid part of each invoice, plus a few returned cheques --
export const SAMPLE_PAYMENTS = [];
{
  let n = 1;
  [...SAMPLE_INVOICES]
    .reverse()
    .filter((inv) => inv.paid > 0)
    .forEach((inv) => {
      const latest = addDays(TODAY, -1);
      const date = [addDays(inv.date, int(8, 50)), latest].sort()[0];
      SAMPLE_PAYMENTS.push({
        id: `PAY-${String(4100 + n)}`,
        date,
        dealerName: inv.dealerName,
        dealerCode: inv.dealerCode,
        mode: pick(['NEFT / RTGS', 'NEFT / RTGS', 'NEFT / RTGS', 'Cheque', 'UPI', 'LC', 'BC']),
        amount: inv.paid,
        invoiceId: inv.id,
        status: daysBetween(date, TODAY) <= 3 ? 'Pending' : 'Confirmed',
      });
      n += 1;
    });
  // Returned cheques do not reduce any invoice balance.
  [
    ['2026-09-12', 3],
    ['2026-08-21', 8],
  ].forEach(([date, dealerIndex]) => {
    const dealer = SAMPLE_DEALERS[dealerIndex];
    SAMPLE_PAYMENTS.push({
      id: `PAY-${String(4100 + n)}`,
      date,
      dealerName: dealer.name,
      dealerCode: dealer.code,
      mode: 'Cheque',
      amount: round1(between(2, 6)),
      invoiceId: '—',
      status: 'Returned',
    });
    n += 1;
  });
  SAMPLE_PAYMENTS.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// ---- Outstanding: unpaid balances per dealer, bucketed by invoice age ----
export const AGEING_BUCKETS = ['0–30', '31–60', '61–90', '90+'];

function bucketFor(age) {
  if (age <= 30) return '0–30';
  if (age <= 60) return '31–60';
  if (age <= 90) return '61–90';
  return '90+';
}

export const SAMPLE_OUTSTANDING = SAMPLE_DEALERS.map((dealer) => {
  const open = SAMPLE_INVOICES.filter((inv) => inv.dealerCode === dealer.code && inv.balance > 0);
  const buckets = Object.fromEntries(AGEING_BUCKETS.map((b) => [b, 0]));
  let overdue = 0;
  open.forEach((inv) => {
    buckets[bucketFor(daysBetween(inv.date, TODAY))] += inv.balance;
    if (inv.dueDate < TODAY) overdue += inv.balance;
  });
  const outstanding = round1(open.reduce((sum, inv) => sum + inv.balance, 0));
  return {
    ...dealer,
    outstanding,
    overdue: round1(overdue),
    buckets: Object.fromEntries(Object.entries(buckets).map(([k, v]) => [k, round1(v)])),
    status:
      outstanding > dealer.creditLimit ? 'Over Credit Limit' : overdue > 0 ? 'Overdue' : outstanding > 0 ? 'Within Terms' : 'Clear',
  };
}).sort((a, b) => b.outstanding - a.outstanding);

// ---- Monthly roll-ups for Dashboard and Reports ---------------------------
// Totals are kept unrounded; pages round only when they display a value, so
// the same total reads the same on every page.
export const REPORT_MONTHS = ['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09'];

const sumBy = (rows, pickDate, pickValue) =>
  REPORT_MONTHS.map((m) => rows.filter((r) => pickDate(r).startsWith(m)).reduce((s, r) => s + pickValue(r), 0));

const liveOrders = SAMPLE_ORDERS.filter((o) => o.status !== 'Cancelled');

export const MONTHLY = {
  orderValue: sumBy(liveOrders, (o) => o.date, (o) => o.amount),
  orderCount: REPORT_MONTHS.map((m) => liveOrders.filter((o) => o.date.startsWith(m)).length),
  invoiceValue: sumBy(SAMPLE_INVOICES, (i) => i.date, (i) => i.amount),
  collections: sumBy(
    SAMPLE_PAYMENTS.filter((p) => p.status !== 'Returned'),
    (p) => p.date,
    (p) => p.amount
  ),
};

export function totalsBy(rows, key, value = (r) => r.amount) {
  const totals = {};
  rows.forEach((r) => {
    totals[r[key]] = (totals[r[key]] || 0) + value(r);
  });
  return Object.entries(totals)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export const salesByDealer = totalsBy(liveOrders, 'dealerName');
export const salesByZone = ZONES.map((z) => ({
  label: z,
  value: liveOrders.filter((o) => o.zone === z).reduce((s, o) => s + o.amount, 0),
}));
export const orderStatusCounts = ['Pending', 'Approved', 'Dispatched', 'Delivered', 'Cancelled'].map((s) => ({
  label: s,
  value: SAMPLE_ORDERS.filter((o) => o.status === s).length,
}));
