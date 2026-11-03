// SAMPLE DATA -- fictional schemes, documents, queries, notifications and
// audit entries for layout review only. Not real Duroply records. Dealer
// names match SAMPLE_DEALERS in transactions.js. Amounts are in Rs Lacs.
import { REPORT_MONTHS } from './transactions.js';

export const SAMPLE_SCHEMES = [
  { id: 'SCH-01', name: 'Festive Season Booster 2026', type: 'Volume', start: '2026-09-15', end: '2026-11-15', dealers: 9, target: 12, payout: 0, status: 'Active' },
  { id: 'SCH-02', name: 'Monsoon Volume Scheme', type: 'Volume', start: '2026-06-01', end: '2026-09-30', dealers: 11, target: 12, payout: 6.4, status: 'Active' },
  { id: 'SCH-03', name: 'Q2 Growth Target', type: 'Target', start: '2026-07-01', end: '2026-09-30', dealers: 7, target: 10, payout: 3.8, status: 'Active' },
  { id: 'SCH-04', name: 'New Dealer Welcome Scheme', type: 'Onboarding', start: '2026-10-01', end: '2027-03-31', dealers: 0, target: 5, payout: 0, status: 'Upcoming' },
  { id: 'SCH-05', name: 'Q1 Early Payment Reward', type: 'Payment', start: '2026-04-01', end: '2026-06-30', dealers: 10, target: 12, payout: 4.9, status: 'Expired' },
  { id: 'SCH-06', name: 'Summer Loyalty Rewards', type: 'Loyalty', start: '2026-04-15', end: '2026-06-15', dealers: 8, target: 12, payout: 2.7, status: 'Expired' },
];

export const DOCUMENT_CATEGORIES = ['Price List', 'Circular', 'Account Statement', 'Other'];

export const SAMPLE_DOCUMENTS = [
  { id: 'D-118', kind: 'Shared', name: 'Price List – October 2026.pdf', category: 'Price List', dealerName: 'All Dealers', date: '2026-09-22', by: 'Anita Verma', status: 'Shared' },
  { id: 'D-117', kind: 'Shared', name: 'Festive Scheme Circular.pdf', category: 'Circular', dealerName: 'All Dealers', date: '2026-09-15', by: 'Super Admin', status: 'Shared' },
  { id: 'D-116', kind: 'Requested', name: 'Account Statement Apr–Aug', category: 'Account Statement', dealerName: 'Kaveri Wood Centre', date: '2026-09-21', by: 'Dealer', status: 'Open' },
  { id: 'D-115', kind: 'Requested', name: 'TDS Certificate Q1', category: 'Other', dealerName: 'Sai Laminates & Ply', date: '2026-09-19', by: 'Dealer', status: 'Open' },
  { id: 'D-114', kind: 'Shared', name: 'Account Statement – Aug 2026.pdf', category: 'Account Statement', dealerName: 'Royal Ply Point', date: '2026-09-10', by: 'Rakesh Jain', status: 'Shared' },
  { id: 'D-113', kind: 'Requested', name: 'Ledger Copy FY 25-26', category: 'Account Statement', dealerName: 'Ganga Timber Mart', date: '2026-09-08', by: 'Dealer', status: 'Closed' },
  { id: 'D-112', kind: 'Shared', name: 'Dispatch Timing Circular.pdf', category: 'Circular', dealerName: 'North Zone', date: '2026-09-02', by: 'Anita Verma', status: 'Shared' },
  { id: 'D-111', kind: 'Shared', name: 'Price List – September 2026.pdf', category: 'Price List', dealerName: 'All Dealers', date: '2026-08-28', by: 'Anita Verma', status: 'Shared' },
  { id: 'D-110', kind: 'Requested', name: 'Credit Note Copy', category: 'Other', dealerName: 'Om Sai Hardware Mart', date: '2026-08-25', by: 'Dealer', status: 'Closed' },
  { id: 'D-109', kind: 'Shared', name: 'Holiday Schedule 2026.pdf', category: 'Circular', dealerName: 'All Dealers', date: '2026-08-12', by: 'Super Admin', status: 'Shared' },
];

export const SAMPLE_QUERIES = [
  {
    id: 'Q-2291', raisedOn: '2026-09-23T11:05', dealerName: 'Tirupati Ply Centre', type: 'Complaint', subject: 'Short supply in order SO/26-27/0071', assignedTo: 'Rakesh Jain', status: 'Open',
    thread: [{ from: 'Tirupati Ply Centre', at: '2026-09-23T11:05', text: 'We received 4 bundles less than the invoice. Please check and arrange the balance.' }],
  },
  {
    id: 'Q-2290', raisedOn: '2026-09-22T16:40', dealerName: 'Lakshmi Plywood House', type: 'Query', subject: 'Festive scheme eligibility', assignedTo: 'Anita Verma', status: 'In Progress',
    thread: [
      { from: 'Lakshmi Plywood House', at: '2026-09-22T16:40', text: 'Are orders placed before 15 September counted for the festive scheme?' },
      { from: 'Anita Verma', at: '2026-09-23T10:12', text: 'Checking with the scheme team. We will confirm by tomorrow.' },
    ],
  },
  {
    id: 'Q-2288', raisedOn: '2026-09-21T09:30', dealerName: 'Durga Hardware & Ply', type: 'Query', subject: 'Payment not showing in ledger', assignedTo: 'Rakesh Jain', status: 'In Progress',
    thread: [
      { from: 'Durga Hardware & Ply', at: '2026-09-21T09:30', text: 'NEFT sent on 18 September is not in our ledger yet.' },
      { from: 'Rakesh Jain', at: '2026-09-21T14:02', text: 'Please share the UTR number so accounts can match it.' },
    ],
  },
  {
    id: 'Q-2285', raisedOn: '2026-09-19T13:15', dealerName: 'Kaveri Wood Centre', type: 'Query', subject: 'Delivery date for pending order', assignedTo: 'Anita Verma', status: 'Resolved',
    thread: [
      { from: 'Kaveri Wood Centre', at: '2026-09-19T13:15', text: 'When will our order from 12 September be dispatched?' },
      { from: 'Anita Verma', at: '2026-09-19T17:48', text: 'It is planned for dispatch on 21 September from the plant.' },
    ],
  },
  {
    id: 'Q-2281', raisedOn: '2026-09-16T10:20', dealerName: 'Royal Ply Point', type: 'Complaint', subject: 'Damaged sheets on delivery', assignedTo: 'Rakesh Jain', status: 'Resolved',
    thread: [
      { from: 'Royal Ply Point', at: '2026-09-16T10:20', text: 'Six sheets had broken edges on arrival. Photos attached.' },
      { from: 'Rakesh Jain', at: '2026-09-17T12:30', text: 'Replacement approved. It will go with your next dispatch.' },
    ],
  },
  {
    id: 'Q-2276', raisedOn: '2026-09-11T15:00', dealerName: 'Maruti Timber Traders', type: 'Query', subject: 'Credit limit increase request', assignedTo: 'Anita Verma', status: 'Closed',
    thread: [
      { from: 'Maruti Timber Traders', at: '2026-09-11T15:00', text: 'Please review our credit limit for the festive season.' },
      { from: 'Anita Verma', at: '2026-09-13T11:10', text: 'Forwarded to accounts. Review is done each quarter; next review is in October.' },
    ],
  },
];

export const SAMPLE_NOTIFICATIONS = [
  { id: 'N-64', title: 'October price list is out', audience: 'All Dealers', channel: 'Portal, Email', date: '2026-09-22', by: 'Anita Verma', status: 'Sent' },
  { id: 'N-63', title: 'Festive Season Booster 2026 is live', audience: 'All Dealers', channel: 'Portal, Email', date: '2026-09-15', by: 'Super Admin', status: 'Sent' },
  { id: 'N-62', title: 'Plant closed on 2 October', audience: 'All Dealers', channel: 'Portal', date: '2026-09-30', by: 'Super Admin', status: 'Scheduled' },
  { id: 'N-61', title: 'Overdue reminder – September', audience: 'Selected Dealers', channel: 'Email', date: '2026-09-10', by: 'Rakesh Jain', status: 'Sent' },
  { id: 'N-60', title: 'Dispatch timing change', audience: 'Dealers in a Zone', channel: 'Portal', date: '2026-09-02', by: 'Anita Verma', status: 'Sent' },
  { id: 'N-59', title: 'Q3 scheme preview', audience: 'All Dealers', channel: 'Portal', date: '—', by: 'Anita Verma', status: 'Drafts' },
];

export const SAMPLE_AUDIT_LOGS = [
  { at: '2026-09-24T10:42', user: 'Super Admin', role: 'Super Admin', action: 'Login', details: 'Signed in', ip: '10.12.4.21', kind: 'Logins' },
  { at: '2026-09-24T10:15', user: 'Anita Verma', role: 'Admin', action: 'Shared document', details: 'Price List – October 2026.pdf', ip: '10.12.4.37', kind: 'Admin Actions' },
  { at: '2026-09-24T09:58', user: 'kaveri.wood@example.com', role: 'Dealer', action: 'Failed login', details: 'Wrong password', ip: '49.36.112.8', kind: 'Logins' },
  { at: '2026-09-24T09:31', user: 'Rakesh Jain', role: 'Admin', action: 'Login', details: 'Signed in', ip: '10.12.4.52', kind: 'Logins' },
  { at: '2026-09-23T18:20', user: 'Super Admin', role: 'Super Admin', action: 'Changed permissions', details: 'Anita Verma: added Reports', ip: '10.12.4.21', kind: 'Admin Actions' },
  { at: '2026-09-23T17:02', user: 'Super Admin', role: 'Super Admin', action: 'Created dealer login', details: 'Tirupati Ply Centre', ip: '10.12.4.21', kind: 'Admin Actions' },
  { at: '2026-09-23T12:44', user: 'royal.ply@example.com', role: 'Dealer', action: 'Login', details: 'Signed in', ip: '106.51.8.90', kind: 'Logins' },
  { at: '2026-09-23T11:05', user: 'tirupati.ply@example.com', role: 'Dealer', action: 'Raised query', details: 'Q-2291', ip: '157.48.20.14', kind: 'Admin Actions' },
  { at: '2026-09-22T16:12', user: 'Anita Verma', role: 'Admin', action: 'Deactivated login', details: 'Old account: Narmada Wood Works', ip: '10.12.4.37', kind: 'Admin Actions' },
  { at: '2026-09-22T09:40', user: 'durga.ply@example.com', role: 'Dealer', action: 'Failed login', details: 'Wrong password', ip: '103.21.4.66', kind: 'Logins' },
  { at: '2026-09-20T15:18', user: 'Rakesh Jain', role: 'Admin', action: 'Exported report', details: 'Debtors Ageing', ip: '10.12.4.52', kind: 'Admin Actions' },
  { at: '2026-09-18T10:03', user: 'Super Admin', role: 'Super Admin', action: 'Created admin login', details: 'Rakesh Jain', ip: '10.12.4.21', kind: 'Admin Actions' },
];

// Report series (same months as the transaction roll-ups).
export const QUERY_MONTHLY = {
  months: REPORT_MONTHS,
  raised: [14, 11, 17, 19, 15, 12],
  resolved: [12, 12, 14, 18, 16, 8],
  avgReplyHours: [9, 8, 11, 7, 6, 6],
};

export const DOCUMENT_REQUESTS_MONTHLY = {
  months: REPORT_MONTHS,
  requested: [6, 8, 5, 9, 7, 4],
  shared: [6, 7, 5, 9, 7, 2],
};

// Last 14 days, oldest first.
export const LOGIN_DAILY = {
  days: ['11 Sep', '12 Sep', '13 Sep', '14 Sep', '15 Sep', '16 Sep', '17 Sep', '18 Sep', '19 Sep', '20 Sep', '21 Sep', '22 Sep', '23 Sep', '24 Sep'],
  success: [18, 22, 9, 6, 24, 27, 25, 23, 21, 11, 7, 26, 28, 14],
  failed: [1, 2, 0, 0, 3, 1, 2, 1, 0, 1, 0, 2, 1, 1],
};
