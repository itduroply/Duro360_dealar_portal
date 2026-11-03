import { daysBetween } from './format.js';

// Debtors ageing buckets; the accent gets stronger as the debt gets older.
export const AGEING_BUCKETS = ['0–30', '31–60', '61–90', '90+'];

export function bucketFor(age) {
  if (age <= 30) return '0–30';
  if (age <= 60) return '31–60';
  if (age <= 90) return '61–90';
  return '90+';
}

// Ages and totals are counted to App Launcher's as_on_date, not today, so
// they match the balances in the snapshot.
export function buildAccount(rows) {
  if (rows.length === 0) return { account: null, items: [] };
  const asOnDate = rows[0].asOnDate;
  const items = rows.map((r) => {
    const age = r.documentDate && asOnDate ? daysBetween(r.documentDate, asOnDate) : 0;
    const late = r.dueDate && asOnDate ? daysBetween(r.dueDate, asOnDate) : 0;
    return { ...r, age, bucket: bucketFor(age), daysOverdue: r.balance > 0 ? Math.max(0, late) : 0 };
  });
  const sum = (list) => list.reduce((s, i) => s + i.balance, 0);
  const outstanding = sum(items);
  const overdue = sum(items.filter((i) => i.daysOverdue > 0));
  // App Launcher sends 1 for customers with no limit set.
  const limit = rows[0].creditLimit;
  const creditLimit = limit && limit > 1 ? limit : null;
  const status =
    creditLimit && outstanding > creditLimit ? 'Over Credit Limit' : overdue > 0 ? 'Overdue' : outstanding > 0 ? 'Within Terms' : 'Clear';
  return {
    account: {
      asOnDate,
      outstanding,
      overdue,
      creditLimit,
      creditDays: rows[0].creditDays,
      status,
      buckets: Object.fromEntries(AGEING_BUCKETS.map((b) => [b, sum(items.filter((i) => i.bucket === b))])),
    },
    items,
  };
}
