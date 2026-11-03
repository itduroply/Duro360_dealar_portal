// Status pill for table cells. The tone follows the meaning of the status
// word, so the same word looks the same on every page.
const TONES = {
  success: 'bg-success-50 text-success-700',
  warning: 'bg-warning-50 text-warning-700',
  error: 'bg-error-50 text-error-700',
  brand: 'bg-brand-50 text-brand-600',
  gray: 'bg-gray-100 text-gray-600',
};

const STATUS_TONE = {
  Delivered: 'success', Paid: 'success', Confirmed: 'success', Resolved: 'success', Active: 'success', Sent: 'success', Shared: 'success', Clear: 'success', 'Within Terms': 'success', Login: 'success', Issued: 'success',
  Pending: 'warning', 'Partly Paid': 'warning', 'In Progress': 'warning', Upcoming: 'warning', Scheduled: 'warning', Open: 'warning', Overdue: 'warning',
  Cancelled: 'error', Unpaid: 'error', Returned: 'error', 'Over Credit Limit': 'error', 'Failed login': 'error', Rejected: 'error',
  Approved: 'brand', Dispatched: 'brand',
  Closed: 'gray', Expired: 'gray', Drafts: 'gray',
};

export default function StatusChip({ status }) {
  const tone = TONES[STATUS_TONE[status] || 'gray'];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-theme-xs font-medium ${tone}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />
      {status}
    </span>
  );
}
