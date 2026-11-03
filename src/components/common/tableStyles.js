// Table styles, shared by every table in the portal so they all look the
// same and a style change is made once, here. The parts that differ between
// themes come from theme.ui (src/theme/themes.js).
//
// Usage:
//   <div className={TABLE_WRAPPER}>
//     <table className={TABLE}>
//       <thead className={TABLE_HEAD}>…<th className={TH}>…
//       <tbody>…<tr className={TABLE_ROW}>…<td className={TD}>…

import { theme } from '../../theme/themes.js';

// Card around the table.
export const TABLE_WRAPPER = theme.ui.tableWrapper;

export const TABLE = 'w-full text-left';

// Header row: plain gray labels (TailAdmin) or a cream band with darker
// labels (woodland).
export const TABLE_HEAD = theme.ui.tableHead;

export const TH = theme.ui.th;

export const TABLE_ROW = 'border-t border-gray-100 first:border-t-0 transition-colors hover:bg-gray-50';

// Body cells; add TD_PRIMARY to the main cell of a row.
export const TD = theme.ui.td;
export const TD_PRIMARY = theme.ui.tdPrimary;

// Loading / empty-state cell text.
export const TABLE_EMPTY = 'px-6 py-10 text-center text-theme-sm text-gray-500';

// Status chips used inside table cells (same look as <Badge />).
const CHIP = 'inline-flex items-center justify-center gap-1 rounded-full px-2.5 py-0.5 text-theme-xs font-medium';
// Woodland puts a small dot before the status word (theme.ui.chipDot).
export const CHIP_ACTIVE = `${CHIP} ${theme.ui.chipDot} bg-success-50 text-success-600`;
export const CHIP_INACTIVE = `${CHIP} ${theme.ui.chipDot} bg-error-50 text-error-600`;
export const CHIP_NEUTRAL = `${CHIP} bg-brand-50 text-brand-500`;
export const CHIP_LIGHT = `${CHIP} bg-gray-100 text-gray-700`;
