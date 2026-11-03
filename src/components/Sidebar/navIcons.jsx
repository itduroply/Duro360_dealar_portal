/* ---------------------------------------------------------------------- */
/* One icon per sidebar item, keyed by SIDEBAR_FEATURES/SUPERADMIN_ONLY_ITEM */
/* `key` (see sidebarConfig.js). Kept in their own file, separate from the  */
/* plain-data sidebarConfig.js, so that file stays JSX-free and this one is */
/* the single place to add/change a nav icon. No icon library is installed */
/* in this project (see pages/Login/components/icons.jsx), so these are    */
/* plain hand-drawn SVGs in the same stroke style as that file's icons.     */
/* ---------------------------------------------------------------------- */

function DashboardIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-6 w-6" aria-hidden="true">
      <rect x="2.5" y="2.5" width="6.5" height="6.5" rx="1.3" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="2.5" width="6.5" height="4.5" rx="1.3" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="9" width="6.5" height="8.5" rx="1.3" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2.5" y="11" width="6.5" height="6.5" rx="1.3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function DealersIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-6 w-6" aria-hidden="true">
      <path d="M3 8.5V16h14V8.5M2 5h16l-1.2 3.5H3.2L2 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 16v-4h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function PaymentsIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-6 w-6" aria-hidden="true">
      <rect x="2" y="4.5" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 8h16" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 12h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Shield with a tick: Duro Guarantee and Tower Duro certificates.
function WarrantyIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-6 w-6" aria-hidden="true">
      <path d="M10 2.5l6 2.25v4.6c0 3.7-2.55 6.75-6 8.15-3.45-1.4-6-4.45-6-8.15v-4.6L10 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7.25 10l1.9 1.9 3.6-3.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SchemesIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-6 w-6" aria-hidden="true">
      <path d="M10 2.5 17 6v8l-7 3.5L3 14V6l7-3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M3 6l7 3.5L17 6M10 9.5V17.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function DocumentsIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-6 w-6" aria-hidden="true">
      <path d="M5 2.5h7l3.5 3.5v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 2.5V6h3.5M6.5 10.5h7M6.5 13.5h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function QueriesIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-6 w-6" aria-hidden="true">
      <path d="M2.5 4.5h15v9h-8L5 16.5v-3h-2.5v-9Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 9h6M7 6.5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AuditLogsIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-6 w-6" aria-hidden="true">
      <rect x="4" y="2.5" width="12" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 7.5l1.5 1.5L11 6M7 13h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SimulatorIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-6 w-6" aria-hidden="true">
      <path d="M5 2.5v5.2L2.5 13a2 2 0 0 0 1.8 2.9h11.4a2 2 0 0 0 1.8-2.9L15 7.7V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M4 2.5h12M4.2 11h11.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-6 w-6" aria-hidden="true">
      <circle cx="10" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 2.8v1.9M10 15.3v1.9M17.2 10h-1.9M4.7 10H2.8M15.1 4.9l-1.3 1.3M6.2 13.8l-1.3 1.3M15.1 15.1l-1.3-1.3M6.2 6.2 4.9 4.9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-6 w-6" aria-hidden="true">
      <circle cx="7.2" cy="6.5" r="2.7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.3 16.5c.6-3 2.4-4.5 4.9-4.5s4.3 1.5 4.9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13 4.3c1.3.3 2.2 1.4 2.2 2.9s-.9 2.6-2.2 2.9M14.5 12.3c1.8.6 3 1.9 3.4 4.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-6 w-6" aria-hidden="true">
      <path d="M2.5 3h2l1.6 9.2a1 1 0 0 0 1 .8h7.6a1 1 0 0 0 1-.8L17 6H5.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8" cy="16.2" r="1.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="14" cy="16.2" r="1.2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function InvoicesIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-6 w-6" aria-hidden="true">
      <path d="M4.5 2.5h11v15l-2.2-1.4-2.1 1.4-2.2-1.4-2.2 1.4-2.3-1.4V2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7.5 6.5h5M7.5 9.5h5M7.5 12.5h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function OutstandingIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-6 w-6" aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 5.8V10l2.8 1.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NotificationsIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-6 w-6" aria-hidden="true">
      <path d="M5 8.2a5 5 0 0 1 10 0v3.3l1.5 2.5h-13L5 11.5V8.2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8.2 16.5a1.9 1.9 0 0 0 3.6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ReportsIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-6 w-6" aria-hidden="true">
      <path d="M3 17h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="4.5" y="10" width="2.6" height="5" rx="0.6" stroke="currentColor" strokeWidth="1.5" />
      <rect x="8.7" y="6" width="2.6" height="9" rx="0.6" stroke="currentColor" strokeWidth="1.5" />
      <rect x="12.9" y="3" width="2.6" height="12" rx="0.6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-6 w-6" aria-hidden="true">
      <circle cx="10" cy="7" r="3.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.8 16.8c.8-3 3.3-4.8 6.2-4.8s5.4 1.8 6.2 4.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TransactionsIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-6 w-6" aria-hidden="true">
      <path d="M3.5 6.5h12m0 0-3-3m3 3-3 3M16.5 13.5h-12m0 0 3-3m-3 3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Looked up by item.key — see sidebarConfig.js for the canonical key list.
export const NAV_ICONS = {
  dashboard: DashboardIcon,
  dealers: DealersIcon,
  orders: OrdersIcon,
  invoices: InvoicesIcon,
  payments: PaymentsIcon,
  outstanding: OutstandingIcon,
  schemes: SchemesIcon,
  warranty: WarrantyIcon,
  documents: DocumentsIcon,
  queries: QueriesIcon,
  notifications: NotificationsIcon,
  reports: ReportsIcon,
  auditLogs: AuditLogsIcon,
  simulator: SimulatorIcon,
  settings: SettingsIcon,
  users: UsersIcon,
  profile: ProfileIcon,
  transactions: TransactionsIcon,
};
