import { supabase } from '../lib/supabaseClient';

const ITEM_COLUMNS = 'doc_type, doc_no, document_date, due_date, balance_due, credit_limit, credit_days, as_on_date';
const PAGE_SIZE = 1000;

// The signed-in Dealer's open items (invoices, receipts, ...) with the balance
// still due. dealer_outstanding is a copy of App Launcher's
// `customer_outstanding` that public.sync_outstanding() refreshes every 15
// minutes (see supabase/migrations/20261012130000_add_dealer_outstanding_sync.sql).
// Row Level Security limits it to the Dealer's own rows.
export const outstandingApi = {
  async listMine() {
    // PostgREST returns at most 1000 rows per request, so page through.
    const rows = [];
    for (let from = 0; ; from += PAGE_SIZE) {
      const { data, error } = await supabase
        .from('dealer_outstanding')
        .select(ITEM_COLUMNS)
        .order('due_date', { ascending: true })
        .order('doc_no')
        .range(from, from + PAGE_SIZE - 1);
      if (error) throw new Error(error.message);
      rows.push(...data);
      if (data.length < PAGE_SIZE) break;
    }
    // Amounts stay in rupees, as App Launcher stores them. Credit limit and
    // credit days repeat on every row of a customer.
    return rows.map((r) => ({
      docType: r.doc_type,
      docNo: r.doc_no,
      documentDate: r.document_date,
      dueDate: r.due_date,
      balance: Number(r.balance_due ?? 0),
      creditLimit: r.credit_limit === null ? null : Number(r.credit_limit),
      creditDays: r.credit_days,
      asOnDate: r.as_on_date,
    }));
  },
};
