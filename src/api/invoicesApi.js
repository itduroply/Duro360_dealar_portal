import { supabase } from '../lib/supabaseClient';

const DOCUMENT_COLUMNS = 'src_id, document_type, document_number, document_date, posting_date, sub_brand_name, basic_amount, tax_amount, net_amount';
const PAGE_SIZE = 1000;

// The signed-in Dealer's invoice and credit note rows, exactly as stored: one
// row per line, nothing added up. dealer_sales is a copy of App Launcher's
// `sales` that public.sync_sales() refreshes every 15 minutes (see
// supabase/migrations/20261012120000_add_dealer_sales_sync.sql). Row Level
// Security limits it to the Dealer's own rows.
export const invoicesApi = {
  async listMine() {
    // PostgREST returns at most 1000 rows per request, so page through.
    const rows = [];
    for (let from = 0; ; from += PAGE_SIZE) {
      const { data, error } = await supabase
        .from('dealer_sales')
        .select(DOCUMENT_COLUMNS)
        .order('document_date', { ascending: false, nullsFirst: false })
        .order('document_number')
        .order('src_id')
        .range(from, from + PAGE_SIZE - 1);
      if (error) throw new Error(error.message);
      rows.push(...data);
      if (data.length < PAGE_SIZE) break;
    }
    // Amounts stay in rupees, as App Launcher stores them.
    return rows.map((d) => ({
      id: d.src_id,
      documentType: d.document_type,
      documentNo: d.document_number,
      subBrand: d.sub_brand_name,
      documentDate: d.document_date ?? d.posting_date,
      basic: Number(d.basic_amount ?? 0),
      tax: Number(d.tax_amount ?? 0),
      net: Number(d.net_amount ?? 0),
    }));
  },

  // The same rows for closed financial years, from dealer_sales_history (a
  // copy of App Launcher's sales_data). Same shape as listMine, but there is
  // no sub brand, and each row carries its financial year ('2025-2026').
  async listHistory() {
    const rows = [];
    for (let from = 0; ; from += PAGE_SIZE) {
      const { data, error } = await supabase
        .from('dealer_sales_history')
        .select('src_id, financial_year, document_type, document_number, document_date, basic_amount, tax_amount, net_amount')
        .order('document_date', { ascending: false, nullsFirst: false })
        .order('document_number')
        .order('src_id')
        .range(from, from + PAGE_SIZE - 1);
      if (error) throw new Error(error.message);
      rows.push(...data);
      if (data.length < PAGE_SIZE) break;
    }
    return rows.map((d) => ({
      id: `h${d.src_id}`,
      financialYear: d.financial_year,
      documentType: d.document_type,
      documentNo: d.document_number,
      subBrand: null,
      documentDate: d.document_date,
      basic: Number(d.basic_amount ?? 0),
      tax: Number(d.tax_amount ?? 0),
      net: Number(d.net_amount ?? 0),
    }));
  },

  // One row per document (invoice, credit note, ...) with its lines added up,
  // from the dealer_documents view. Used by the Transactions page.
  async listDocuments() {
    const rows = [];
    for (let from = 0; ; from += PAGE_SIZE) {
      const { data, error } = await supabase
        .from('dealer_documents')
        .select('document_number, document_type, document_date, net_amount')
        .order('document_date', { ascending: false, nullsFirst: false })
        .order('document_number')
        .range(from, from + PAGE_SIZE - 1);
      if (error) throw new Error(error.message);
      rows.push(...data);
      if (data.length < PAGE_SIZE) break;
    }
    return rows.map((d) => ({
      documentNo: d.document_number,
      documentType: d.document_type,
      documentDate: d.document_date,
      net: Number(d.net_amount ?? 0),
    }));
  },

  // When the copy was last refreshed from App Launcher (null if never), as a
  // local-time 'YYYY-MM-DDTHH:MM' string for formatDateTime. The database
  // returns UTC.
  async lastSynced() {
    const { data, error } = await supabase.rpc('dealer_sales_last_synced');
    if (error) throw new Error(error.message);
    if (!data) return null;
    const d = new Date(data);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  },
};
