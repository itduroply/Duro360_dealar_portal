import { supabase } from '../lib/supabaseClient';

// Calls a signed-in Dealer makes for its own account. Row Level Security
// limits each of these to the Dealer's own rows (see
// supabase/migrations/20260924120000_add_dealer_code_login.sql), so the
// filter here is for the query, not the security boundary.
export const dealerApi = {
  // The Dealer's own master record, synced from App Launcher's customer_master.
  async getMyRecord(dealerCode) {
    const { data, error } = await supabase
      .from('dealer_directory')
      .select('customer_code, customer_name, email, mobile_no, zone, selling_branch, market_name, credit_limit, synced_at')
      .eq('customer_code', dealerCode)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  },
};
