// Shared rules and wording for Duro Guarantee and Tower Warranty
// certificates, used by the Dealer Portal, the Console and the printed
// certificate, so all three say the same thing.
//
// Wording follows the "DURO GUARANTEE manual". The two programs are
// different products: Tower covers manufacturing defects only, and must
// never carry termite, insect or money-back wording.

import { todayIso } from './schemes.js';
import { DURO_INTRO, DURO_TERMS } from './certificateContent.js';

// Header and signatory, as printed on the old portal's certificate.
export const COMPANY = {
  name: 'Duroply Industries Limited',
  formerly: 'Sarda Plywood Industries Limited',
  address: '4th Floor, North Block, 113, Park Street, Kolkata - 16',
  phone: 'Phone: (033) 2265 2274, Fax: (033) 2249 3675',
  email: 'corp@duroply.com',
  cin: 'L20211WB1957PLC023493',
  signatory: 'Akhilesh Chitlangia',
  signatoryTitle: 'Managing Director & CEO',
};

export const PROGRAMS = {
  DURO_GUARANTEE: {
    key: 'DURO_GUARANTEE',
    brand: 'Duro',
    name: 'Duro Guarantee',
    certificate: 'Guarantee Certificate',
    covers: 'Insect attack, including termite and borer',
    settles: '3 × value of the infested material, or the furniture value, whichever is lower',
    range: '11 years to Lifetime',
    // Shown after the invoice value, as on the old portal.
    invoiceNote: 'of DURO products',
    serialPrefix: 'DG',
    // Letter and terms on the certificate, from the approved Guarantee
    // Certificate PDF (see certificateContent.js).
    intro: DURO_INTRO,
    terms: DURO_TERMS,
  },
  TOWER_WARRANTY: {
    key: 'TOWER_WARRANTY',
    brand: 'Tower',
    name: 'Tower Warranty',
    certificate: 'Warranty Certificate',
    covers: 'Manufacturing defects only',
    settles: 'Replacement of the damaged material only. No money claims.',
    range: '11 to 18 years',
    invoiceNote: '',
    serialPrefix: 'TW',
    // Letter on the certificate, from the Tower specimen in the manual. Never
    // the Duro letter: the old portal's Tower preview shows the Duro insect
    // wording by mistake, and Tower does not cover insect damage.
    intro: [
      'Thank you for choosing Tower brand products from Duroply Industries Limited.',
      'We offer a warranty against manufacturing defects from the date of manufacturing. If an issue arises, please notify us immediately. Our authorized personnel must be allowed to inspect the damaged portion and place of usage to verify the claim.',
      'We are committed to ensuring your satisfaction and will address valid claims promptly.',
    ],
    terms: [
      'At the time of inspection, the purchaser must produce an invoice issued by an authorised dealer. The invoice details must match this warranty certificate and the consumer data.',
      'DIL reserves the right to take samples from the damaged portions and send them for testing at the company’s own laboratory or at any approved testing facility.',
      'Upon satisfactory proof that the product is a genuine Tower brand product, DIL shall replace the actual quantity of product that has been damaged.',
      'This warranty will not apply where other brand materials or sub-standard sawn timber have been used.',
      'DIL treats Tower brand products using chemical formulations. This warranty does not cover damage caused by natural wear and tear, insect infestation, abnormal use, or improper storage of the material.',
      'This warranty is limited solely to the replacement of the material actually damaged. No financial claims will be entertained.',
      'Claims will be entertained only for products purchased from authorised Tower dealers.',
      'Any dispute shall be subject to Kolkata jurisdiction.',
    ],
  },
};

export const PROGRAM_LIST = [PROGRAMS.DURO_GUARANTEE, PROGRAMS.TOWER_WARRANTY];

// Database status -> label shown on screen (see StatusChip tones).
export const STATUS_LABEL = { PENDING: 'Pending', ISSUED: 'Issued', REJECTED: 'Rejected' };

export function termLabel(years) {
  return years == null ? 'Lifetime' : `${years} Years`;
}

// Products grouped by term, longest first: [{ term, label, items: [...] }].
export function groupByTerm(items) {
  const groups = new Map();
  for (const item of items) {
    const key = item.term_years ?? Infinity;
    if (!groups.has(key)) groups.set(key, { term: item.term_years, label: termLabel(item.term_years), items: [] });
    groups.get(key).items.push(item);
  }
  return Array.from(groups.entries())
    .sort(([a], [b]) => b - a)
    .map(([, group]) => group);
}

// A purchase can be registered only within 1 month of the invoice date.
// The database checks this again; this sets the date picker's range.
export function invoiceDateRange(today = todayIso()) {
  const d = new Date(`${today}T00:00:00`);
  d.setMonth(d.getMonth() - 1);
  return { min: d.toLocaleDateString('en-CA'), max: today };
}

// Invoice values are in rupees (not Rs Lacs): the value on one customer invoice.
export function formatRupees(value) {
  if (value === null || value === undefined || value === '') return '—';
  return `Rs ${Number(value).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

export const DOC_TYPES = 'application/pdf,image/jpeg,image/png,image/gif';
export const DOC_MAX_BYTES = 5 * 1024 * 1024;

// Customer Type, as on the old portal. For any type other than Consumer, the
// dealer also enters that person's details.
export const CUSTOMER_TYPES = [
  { value: 'CONSUMER', label: 'Consumer' },
  { value: 'CONTRACTOR', label: 'Contractor' },
  { value: 'ARCHITECT_INTERIOR_DESIGNER', label: 'Architect / Interior Designer' },
  { value: 'SUBDEALER', label: 'Authorised Retailer (SubDealer)' },
  { value: 'OEM', label: 'OEM' },
];

export function customerTypeLabel(value) {
  return CUSTOMER_TYPES.find((t) => t.value === value)?.label || 'Consumer';
}

// State list exactly as on the old portal, so records match it.
export const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh',
  'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Orissa', 'Pondicherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telengana', 'Tripura',
  'Uttarakhand', 'Uttar Pradesh', 'West Bengal',
];
