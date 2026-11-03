import { supabase } from '../lib/supabaseClient';

// Schemes are read and written straight from the browser. Row Level Security
// decides who sees what (supabase/migrations/20260928150000_add_schemes.sql):
// a Super Admin, or an Admin granted `schemes`, sees and creates every
// scheme; a Dealer sees only schemes for all Dealers or assigned to it.
const SCHEME_COLUMNS =
  'id, name, type, start_date, end_date, purchase_target, incentive_rate, note, audience, created_at, scheme_dealers(dealer_code)';

export const schemesApi = {
  async list() {
    const { data, error } = await supabase.from('schemes').select(SCHEME_COLUMNS).order('start_date', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },

  // `dealerCodes` is used only when audience is 'SELECTED'.
  async create({ dealerCodes = [], ...scheme }) {
    const { data, error } = await supabase.rpc('create_scheme', { scheme, dealer_codes: dealerCodes });
    if (error) throw new Error(error.message);
    return data;
  },
};
