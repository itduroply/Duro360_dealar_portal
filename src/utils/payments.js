const pad = (n) => String(n).padStart(2, '0');

// Today in the Dealer's own time, 'YYYY-MM-DD'.
export function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Financial year runs April to March: Oct 2026 is FY 26-27.
export function financialYear(today) {
  const [y, m] = today.split('-').map(Number);
  const start = m >= 4 ? y : y - 1;
  return { start: `${start}-04-01`, label: `FY ${String(start).slice(2)}-${String(start + 1).slice(2)}` };
}

// A receipt (voucher) can settle several documents, one row each in App
// Launcher. Show one row per voucher with the documents listed together.
export function groupVouchers(lines) {
  const byVoucher = new Map();
  lines.forEach((l) => {
    const key = l.voucherNo || `line-${l.id}`;
    const v = byVoucher.get(key) ?? {
      id: key,
      voucherNo: l.voucherNo || '—',
      date: l.voucherDate,
      mode: l.mode || '—',
      referenceNo: l.referenceNo || '—',
      amount: 0,
      documents: [],
    };
    v.amount += l.amount;
    if (l.documentNo && !v.documents.includes(l.documentNo)) v.documents.push(l.documentNo);
    byVoucher.set(key, v);
  });
  return [...byVoucher.values()].map((v) => ({ ...v, against: v.documents.join(', ') || '—' }));
}

// The last six calendar months, oldest first, as 'YYYY-MM'.
export function lastSixMonths(today) {
  const [y, m] = today.split('-').map(Number);
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(y, m - 1 - (5 - i), 1);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
  });
}
