import { supabase } from '../lib/supabaseClient';

// Dealer queries and complaints. Reads go straight to the tables; Row Level
// Security returns a Dealer only its own queries, and the Duro team (Super
// Admin, or an Admin granted `queries`) every one. Writes go only through the
// database functions in supabase/migrations/20261014120000_add_dealer_queries.sql.
const COLUMNS =
  'id, ticket_no, dealer_code, dealer_name, type, related, reference, subject, status, resolved_at, created_at, updated_at, ' +
  'dealer_query_messages(id, sender, sender_name, body, created_at)';

function fail(error) {
  if (error) throw new Error(error.message);
}

// Database row -> the shape the screens use. Messages are oldest first.
function toQuery(row) {
  const thread = [...(row.dealer_query_messages || [])]
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map((m) => ({ id: m.id, sender: m.sender, from: m.sender_name, text: m.body, at: m.created_at }));
  return {
    id: row.id,
    ticketNo: row.ticket_no,
    dealerCode: row.dealer_code,
    dealerName: row.dealer_name,
    type: row.type,
    related: row.related,
    reference: row.reference,
    subject: row.subject,
    status: row.status,
    raisedOn: row.created_at,
    updatedOn: row.updated_at,
    resolvedOn: row.resolved_at,
    thread,
  };
}

export const queriesApi = {
  async list() {
    const { data, error } = await supabase.from('dealer_queries').select(COLUMNS).order('created_at', { ascending: false });
    fail(error);
    return data.map(toQuery);
  },

  async raise({ type, related, reference, subject, message }) {
    const { data, error } = await supabase.rpc('raise_dealer_query', {
      p_type: type,
      p_related: related,
      p_reference: reference || null,
      p_subject: subject,
      p_message: message,
    });
    fail(error);
    return data;
  },

  async reply(queryId, body) {
    const { error } = await supabase.rpc('reply_dealer_query', { p_query_id: queryId, p_body: body });
    fail(error);
  },

  async setStatus(queryId, status) {
    const { error } = await supabase.rpc('set_dealer_query_status', { p_query_id: queryId, p_status: status });
    fail(error);
  },
};
