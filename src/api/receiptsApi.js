import { supabase } from '../lib/supabaseClient';

const RECEIPT_COLUMNS =
  'src_id, voucher_number, voucher_date, document_number, document_date, document_type, reference_number, reference_date, cash_bank_book_description, net_amount';
const PAGE_SIZE = 1000;

// The signed-in Dealer's receipts (payments made to Duroply), one row per
// line: a voucher that settles several documents has one row for each.
// dealer_receipts is a copy of App Launcher's `receipts` that
// public.sync_receipts() refreshes every 15 minutes (see
// supabase/migrations/20261017130000_add_dealer_receipts_sync.sql). Row Level
// Security limits it to the Dealer's own rows.
export const receiptsApi = {
  async listMine() {
    // PostgREST returns at most 1000 rows per request, so page through.
    const rows = [];
    for (let from = 0; ; from += PAGE_SIZE) {
      const { data, error } = await supabase
        .from('dealer_receipts')
        .select(RECEIPT_COLUMNS)
        .order('voucher_date', { ascending: false, nullsFirst: false })
        .order('voucher_number')
        .order('src_id')
        .range(from, from + PAGE_SIZE - 1);
      if (error) throw new Error(error.message);
      rows.push(...data);
      if (data.length < PAGE_SIZE) break;
    }
    // Amounts stay in rupees, as App Launcher stores them.
    return rows.map((r) => ({
      id: r.src_id,
      voucherNo: r.voucher_number,
      voucherDate: r.voucher_date,
      documentNo: r.document_number,
      documentDate: r.document_date,
      documentType: r.document_type,
      referenceNo: r.reference_number,
      referenceDate: r.reference_date,
      mode: r.cash_bank_book_description,
      amount: Number(r.net_amount ?? 0),
    }));
  },

  // When the copy was last refreshed from App Launcher (null if never), as a
  // local-time 'YYYY-MM-DDTHH:MM' string for formatDateTime. The database
  // returns UTC.
  async lastSynced() {
    const { data, error } = await supabase.rpc('dealer_receipts_last_synced');
    if (error) throw new Error(error.message);
    if (!data) return null;
    const d = new Date(data);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  },
};
