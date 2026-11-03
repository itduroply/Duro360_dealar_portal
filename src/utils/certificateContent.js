// Wording and tables printed on the Duro Guarantee Certificate, word for word
// from the approved certificate PDF. Used by the printed certificate and its
// live preview, so both always say the same thing.

// Letter on the first sheet.
export const DURO_INTRO = [
  'Thank you for your purchase of Duroply products',
  'All products under "Duro" flagship brand come with a guarantee for their performance against manufacturing defects and issues arising from insect infestation. In the unlikely event of deterioration due to insect infestation or otherwise, on any product listed in the certificate, Duroply Industries Limited stands guarantee to compensate you for the proportion of defective product or the compensation value as specified under "Product Guarantee Details" on this certificate, whichever is lower.',
  'Founded in 1957, Duroply is renowned across India for its high quality products. We are confident that there shall be no complaints, however in the unlikely event of a complaint you are requested to contact our local dealers, or sales office or www.duroply.com to register your complaint along with the guarantee certificate and proof of purchase for further investigation from the company.',
];

// Terms and Conditions: one entry per printed sheet. A bullet is a string, or
// { text, sub: [...] } for a bullet with a second level. A section with no
// title continues the one before it on the next sheet.
export const DURO_TERMS = [
  [
    {
      title: '1. COVERAGE',
      items: [
        'DURO Products: Carry a guarantee against manufacturing defects and insect infestation, including termite and borer, subject to these terms.',
        'TOWER Range: Carries a warranty against manufacturing defects only.',
        'Covered infestation means live termite/borer infestation or structural damage caused by such infestation in the DURO product mentioned on this certificate, as confirmed through physical inspection and, where required, laboratory examination.',
        'Surface mud deposition, channel marks, frass or superficial markings without structural damage shall not be considered covered infestation.',
        'Infestation originating from adjoining timber, frames, battens, shutters, masonry, flooring or any component not supplied by Duroply Industries Limited is not covered.',
      ],
    },
    {
      title: '2. GUARANTEE / WARRANTY VALIDITY',
      items: [
        '"Lifetime" means for as long as the product mentioned on this certificate remains in use in its original application at the declared site address. Fixed-term guarantees/warranties shall run from the invoice date.',
        'This certificate is valid only against the original purchase invoice referenced on the certificate.',
        'Purchase must be registered on the DURO portal within 60 days of the invoice date by the dealer or customer.',
        'The certificate is valid only when verified against Duroply Industries Limited’s portal records and contains a system-generated certificate number.',
      ],
    },
    {
      title: '3. CLAIM PROCESS',
      items: [
        'Claims must be reported in writing to the authorised dealer or the Company immediately after discovery of the termite/borer infestation or manufacturing defect, quoting the certificate number.',
        'The customer must produce the original purchase invoice and this certificate.',
        'The affected material must not be repaired, replaced, dismantled, refinished or chemically treated before Company inspection. The customer must take reasonable steps to prevent further damage.',
        'The customer must allow the Company representative to inspect the site and collect samples, where required, for laboratory examination.',
      ],
    },
    {
      title: '4. REMEDY',
      items: [
        {
          text: 'Where a claim is accepted, the Company shall provide, at its option:',
          sub: [
            'Termite / Insect Infestation: Remedy/compensation up to the maximum allowable claim specified in Annexure A.',
            'Manufacturing Defect: Replacement of the affected DURO or TOWER product with an equivalent DURO or TOWER product, free of cost.',
          ],
        },
        '"Affected material" means the panels with confirmed infestation/defect and directly contiguous panels, and not the entire quantity purchased.',
      ],
    },
  ],
  [
    {
      items: [
        'The Company’s total liability under this certificate, across all claims, shall not exceed the remedy applicable to a single claim.',
        'Compensation or replacement shall not renew or extend the guarantee/warranty period.',
        'The Company’s liability is limited to the remedies stated above and excludes removal/re-installation costs, labour, freight, taxes, hardware, fittings, adhesives, laminates, polish/finishing and any indirect, incidental, consequential or economic loss.',
      ],
    },
    {
      title: '5. EXCLUSIONS',
      lead: 'The Guarantee/Warranty shall not apply where:',
      items: [
        'The product is installed in direct contact with soil or damp masonry, alongside untreated timber, or at a site with an existing untreated infestation.',
        'The product is used with plywood, blockboard, panels of other brands, or substandard/untreated sawn timber.',
        'Damage is caused by moisture, water seepage, seelan or dampness in walls.',
        'Damage arises from improper storage, handling, machining, transit, or mechanical/chemical treatment.',
        'Damage arises from force majeure, including flood, fire, earthquake, storm, lightning, war, terrorism, riot, civil unrest, sabotage or any event beyond the Company’s reasonable control.',
        'Any false or misleading information is provided in the claim, registration or invoice.',
      ],
    },
    {
      title: '6. GENERAL',
      items: [
        'No dealer, distributor or representative of Duroply Industries Limited is authorised to vary, modify or extend these terms.',
        'This Guarantee/Warranty is in addition to and does not restrict the customer’s rights under applicable law.',
        'All disputes shall be subject to Kolkata jurisdiction only.',
      ],
    },
  ],
];

// Annexure A, as in the approved PDF. `match` is the brand name with spaces
// and punctuation removed, so the portal's spelling ("Duroflex", "Duro Mac
// Platinum") finds its row. `term` is null for Lifetime; `kind` is the word
// after the term. `back` is the Money Back Policy column.
const BACK_3X = '3X Money Back Policy';
const duro = (brand, term, back = BACK_3X) => ({ brand, match: brand.toLowerCase().replace(/[^a-z0-9]/g, ''), term, kind: 'Guarantee', back });
const tower = (brand, term) => ({ brand, match: brand.toLowerCase().replace(/[^a-z0-9]/g, ''), term, kind: 'Warranty', back: 'NA' });

export const ANNEXURE_A = [
  duro('Duro Titanium', null),
  duro('Duro Derby', null),
  duro('Duro Pumaply', null),
  duro('Durobord', null),
  duro('Duro Plus', null),
  { ...duro('Duro Door - Flush Door', null), match: 'durodoor' },
  duro('Duroply', null),
  duro('Duro Flex', null),
  duro('Duro Nature\'s Signature', null),
  duro('Duro Teak', null),
  duro('Duro Marine', 25),
  duro('Duro Techply', 21),
  duro('Duro Techply - Door', 21),
  duro('Duro Macplatinum', 21),
  duro('Duro Macprime', 15),
  duro('Duro HDMMR', 15, '1X Money Back'),
  duro('Duro Mac', 11),
  duro('Duro MacDoor', 11),
  tower('Tower Board & Ply', 11),
  tower('Tower Door', 11),
  tower('Tower Solitare', 11),
  tower('Tower Platinum', 18),
  tower('Tower Prime', 15),
  tower('Tower Prime - HMR', 15),
];

const squash = (name) => String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '');

// Rows for the certificate's Annexure A: one per brand picked, in the PDF's
// order, numbered from 1. A brand that is not in the PDF's table keeps the
// term saved with the certificate and the standard 3X policy, so none is
// dropped.
export function annexureRowsFor(items) {
  return (items || [])
    .map((item, i) => {
      const hit = ANNEXURE_A.findIndex((a) => a.match === squash(item.brand));
      const row = hit >= 0 ? ANNEXURE_A[hit] : null;
      return {
        order: hit >= 0 ? hit : ANNEXURE_A.length + i,
        brand: row ? row.brand : item.brand,
        term: row ? row.term : (item.term_years ?? null),
        kind: row ? row.kind : 'Guarantee',
        back: row ? row.back : BACK_3X,
      };
    })
    .sort((a, b) => a.order - b.order)
    .map(({ order, ...row }, i) => ({ ...row, sn: i + 1 }));
}

// "Lifetime Guarantee", "25 Years Guarantee", "11 Years Warranty".
export function annexureTermLabel(row) {
  return `${row.term == null ? 'Lifetime' : `${row.term} Years`} ${row.kind}`;
}

// Date as printed on the certificate: 14-09-2026.
export function certDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}-${m}-${y}`;
}
