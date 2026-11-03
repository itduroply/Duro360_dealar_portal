// Shared scheme rules for the Console (pages/Schemes) and the Dealer Portal
// (pages/DealerPortal/DealerSchemes.jsx), so both show the same status and
// the same rule text for the same scheme.

export const SCHEME_TYPES = ['Target', 'Payment'];

// Today as YYYY-MM-DD in the viewer's own time zone.
export function todayIso() {
  return new Date().toLocaleDateString('en-CA');
}

export function schemeStatus(scheme, today = todayIso()) {
  if (today < scheme.start_date) return 'Upcoming';
  if (today > scheme.end_date) return 'Expired';
  return 'Active';
}

export function schemeRule(scheme) {
  return `${Number(scheme.incentive_rate)}% of purchase value on reaching Rs ${Number(scheme.purchase_target)} Lacs in the scheme period.`;
}

// A scheme created in the last `days` days counts as new (shows a "New"
// badge on the dashboard and the Schemes page). Same rule as the Console.
export function isNewScheme(scheme, days = 3, now = Date.now()) {
  const created = Date.parse(scheme.created_at || scheme.createdAt || '');
  return Number.isFinite(created) && now - created < days * 86400000;
}

// Whole days from today to `iso` (negative once it has passed).
export function daysUntil(iso, today = todayIso()) {
  return Math.round((Date.parse(`${iso}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86400000);
}
