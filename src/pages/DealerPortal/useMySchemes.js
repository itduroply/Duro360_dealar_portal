import { useEffect, useMemo, useState } from 'react';
import { schemesApi } from '../../api/schemesApi';
import { isNewScheme, schemeRule, schemeStatus } from '../../utils/schemes.js';

const round1 = (n) => Math.round(n * 10) / 10;
const STATUS_ORDER = { Active: 0, Upcoming: 1, Expired: 2 };

// A schemes row as this Dealer's card: progress is the value of the Dealer's
// orders (the same list the Orders page shows) inside the scheme dates.
function toDealerScheme(row, orders) {
  const status = schemeStatus(row);
  const target = Number(row.purchase_target);
  const rate = Number(row.incentive_rate);
  const achieved = round1(
    orders
      .filter((o) => o.status !== 'Cancelled' && o.date >= row.start_date && o.date <= row.end_date)
      .reduce((sum, o) => sum + o.amount, 0)
  );
  return {
    id: row.id, name: row.name, type: row.type, start: row.start_date, end: row.end_date, status,
    target, rate, achieved, reached: achieved >= target, note: row.note, rule: schemeRule(row),
    isNew: isNewScheme(row), createdAt: row.created_at,
  };
}

/**
 * Schemes created on the Console for this Dealer (Row Level Security returns
 * only schemes for all Dealers or assigned to this one). Used by the Schemes
 * page and the Dashboard. Sorted Active, Upcoming, Expired; newest first.
 */
export function useMySchemes(orders) {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    schemesApi
      .list()
      .then((data) => !cancelled && setRows(data))
      .catch((err) => !cancelled && setError(err.message || 'Could not load your schemes.'))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const schemes = useMemo(
    () =>
      rows
        .map((r) => toDealerScheme(r, orders))
        .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || (a.createdAt < b.createdAt ? 1 : -1)),
    [rows, orders]
  );

  return { schemes, isLoading, error };
}
