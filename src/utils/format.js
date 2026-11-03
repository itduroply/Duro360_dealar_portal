// Shared number and date formatting for the Console modules.
// Amounts are in Rs Lacs: one decimal in tables, whole numbers in KPI tiles.

export function formatLacs(value) {
  if (value === null || value === undefined) return '—';
  return Number(value).toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export function formatLacsWhole(value) {
  if (value === null || value === undefined) return '—';
  // Round to one decimal first so float noise (944.4999…) rounds the same way everywhere.
  return Math.round(Math.round(value * 10) / 10).toLocaleString('en-IN');
}

// Per-document amounts a Dealer reads on their own invoices, in rupees:
// 480250.5 -> '₹4,80,250.50', -480250.5 -> '-₹4,80,250.50'.
export function formatRupees(value) {
  if (value === null || value === undefined) return '—';
  return Number(value).toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatCount(value) {
  if (value === null || value === undefined) return '—';
  return Number(value).toLocaleString('en-IN');
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// '2026-09-24' -> '24 Sep 2026'
export function formatDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
}

// '2026-09-24T10:42' -> '24 Sep 2026, 10:42'
export function formatDateTime(iso) {
  if (!iso) return '—';
  return `${formatDate(iso)}, ${iso.slice(11, 16)}`;
}

export function monthLabel(yyyyMm) {
  const [y, m] = yyyyMm.split('-');
  return `${MONTHS[Number(m) - 1]} ${y.slice(2)}`;
}

export function addDays(iso, days) {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(fromIso, toIso) {
  const a = Date.parse(`${fromIso.slice(0, 10)}T00:00:00Z`);
  const b = Date.parse(`${toIso.slice(0, 10)}T00:00:00Z`);
  return Math.round((b - a) / 86400000);
}

// Period filter used by the module tables ("This Month", "Last Month", ...).
export const PERIODS = ['This Month', 'Last Month', 'This Quarter', 'This Year'];

export function inPeriod(iso, period, today) {
  if (!period) return true;
  const [ty, tm] = today.split('-').map(Number);
  const [y, m] = iso.split('-').map(Number);
  if (period === 'This Month') return y === ty && m === tm;
  if (period === 'Last Month') return tm === 1 ? y === ty - 1 && m === 12 : y === ty && m === tm - 1;
  if (period === 'This Quarter') return y === ty && Math.ceil(m / 3) === Math.ceil(tm / 3);
  if (period === 'This Year') return y === ty;
  if (period === 'Today') return iso.slice(0, 10) === today;
  if (period === 'Last 7 Days') return daysBetween(iso, today) < 7;
  if (period === 'Last 30 Days') return daysBetween(iso, today) < 30;
  return true;
}
