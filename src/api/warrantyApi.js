import { supabase } from '../lib/supabaseClient';

// Duro Guarantee and Tower Duro certificates. Reads go straight to the
// tables; Row Level Security returns a Dealer only its own certificates, and
// the Duro team (Super Admin, or an Admin granted `warranty`) every one.
// Writes go only through the database functions in
// supabase/migrations/20261001120000_add_warranty_certificates.sql.
const BUCKET = 'warranty-docs';
const CERT_COLUMNS =
  'id, program, dealer_code, dealer_name, customer_type, type_name, type_address1, type_address2, type_address3, ' +
  'type_city, type_state, type_pin, type_mobile, type_email, customer_name, address1, address2, address3, city, state, pin, mobile, email, ' +
  'invoice_no, invoice_date, invoice_value, id_proof_path, invoice_path, status, serial_no, reject_reason, reviewed_at, created_at, ' +
  'warranty_certificate_items(product_id, brand, term_years)';

function fail(error) {
  if (error) throw new Error(error.message);
}

function extension(file) {
  const ext = file.name.split('.').pop()?.toLowerCase();
  return ext && ext.length <= 5 ? ext : 'bin';
}

export const warrantyApi = {
  async listProducts() {
    const { data, error } = await supabase
      .from('warranty_products')
      .select('id, program, brand, term_years, sort_order')
      .eq('active', true)
      .order('sort_order');
    fail(error);
    return data;
  },

  async list() {
    const { data, error } = await supabase.from('warranty_certificates').select(CERT_COLUMNS).order('created_at', { ascending: false });
    fail(error);
    return data;
  },

  async get(id) {
    const { data, error } = await supabase.from('warranty_certificates').select(CERT_COLUMNS).eq('id', id).maybeSingle();
    fail(error);
    return data;
  },

  // Uploads the invoice (and the ID proof, which is optional) to
  // <dealerCode>/<new id>/, then registers the purchase. A new id is made on
  // every attempt, so a retry never collides with files left by a failed one.
  async submit({ dealerCode, productIds, idProofFile, invoiceFile, ...cert }) {
    const id = crypto.randomUUID();
    const folder = `${dealerCode}/${id}`;
    const idProofPath = idProofFile ? `${folder}/id-proof.${extension(idProofFile)}` : null;
    const invoicePath = `${folder}/invoice.${extension(invoiceFile)}`;
    const uploads = [[invoicePath, invoiceFile]];
    if (idProofFile) uploads.push([idProofPath, idProofFile]);

    for (const [path, file] of uploads) {
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false });
      fail(error);
    }

    const { error } = await supabase.rpc('submit_warranty_certificate', {
      cert: { ...cert, id, id_proof_path: idProofPath, invoice_path: invoicePath },
      product_ids: productIds,
    });
    fail(error);
    return id;
  },

  async approve(id) {
    const { data, error } = await supabase.rpc('approve_warranty_certificate', { certificate_id: id });
    fail(error);
    return data;
  },

  async reject(id, reason) {
    const { error } = await supabase.rpc('reject_warranty_certificate', { certificate_id: id, reason });
    fail(error);
  },

  // Short-lived link to an uploaded document (the bucket is private).
  async documentUrl(path) {
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 600);
    fail(error);
    return data.signedUrl;
  },
};
