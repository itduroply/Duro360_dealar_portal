import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Check frontend/.env.');
}

// The anon key is safe to ship to the browser -- it only grants what Row
// Level Security policies on each table allow (see
// supabase/migrations/*_create_profiles.sql). It is never the service role
// key, which stays server-side only (supabase/scripts/createAdmin.js).
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
