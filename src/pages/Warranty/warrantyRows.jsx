import { PROGRAMS, STATUS_LABEL } from '../../utils/warranty.js';

// Shared by the Dealer's list (pages/DealerPortal/DealerWarranty.jsx) and the
// Console's approval queue (pages/Warranty/WarrantyPage.jsx).

// A warranty_certificates row, ready for DataTable: status as its label
// (DataTable tabs match on it) and the brands as one line.
export function toRow(row) {
  const items = row.warranty_certificate_items || [];
  return {
    ...row,
    status: STATUS_LABEL[row.status] || row.status,
    items,
    brands: items.map((i) => i.brand).join(', '),
    value_text: Number(row.invoice_value).toLocaleString('en-IN', { maximumFractionDigits: 2 }),
  };
}

const TAG = {
  DURO_GUARANTEE: 'bg-duro-50 text-duro-700 ring-duro-200',
  TOWER_WARRANTY: 'bg-tower-50 text-tower-700 ring-tower-200',
};

// "Duro" / "Tower" tag in the program's colour. `large` is the square badge.
export function ProgramTag({ program, large = false }) {
  const p = PROGRAMS[program];
  if (!p) return null;
  if (large) {
    return (
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-theme-xs font-bold tracking-wider ring-1 ring-inset ${TAG[program]}`}>
        {p.serialPrefix}
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-theme-xs font-semibold ring-1 ring-inset ${TAG[program]}`}>
      {p.brand}
    </span>
  );
}
