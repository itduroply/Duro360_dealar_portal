
export const SIDEBAR_FEATURES = [
  { key: 'dashboard', label: 'Dashboard', path: '', end: true, implemented: true, alwaysVisible: true },
  { key: 'dealers', label: 'Dealers', path: 'dealers', implemented: true },
  // { key: 'orders', label: 'Orders', path: 'orders', implemented: true },
  // { key: 'invoices', label: 'Invoices', path: 'invoices', implemented: true },
  // { key: 'payments', label: 'Payments', path: 'payments', implemented: true },
  // { key: 'outstanding', label: 'Outstanding', path: 'outstanding', implemented: true },
  { key: 'schemes', label: 'Schemes', path: 'schemes', implemented: true },
  { key: 'warranty', label: 'Duro Certificates', path: 'warranty', implemented: true },
  { key: 'documents', label: 'Documents', path: 'documents', implemented: true },
  { key: 'queries', label: 'Queries', path: 'queries', implemented: true },
  { key: 'notifications', label: 'Notifications', path: 'notifications', implemented: true },
  { key: 'reports', label: 'Reports', path: 'reports', implemented: true },
  { key: 'auditLogs', label: 'Audit Logs', path: 'audit-logs', implemented: true },
  { key: 'simulator', label: 'Simulator', path: 'simulator', implemented: true, badge: 'Dev/Test' },
  { key: 'settings', label: 'Settings', path: 'coming-soon', state: { moduleName: 'Settings' } },
];


export const DEALER_FEATURES = [
  { key: 'dashboard', label: 'Dashboard', path: '', end: true, implemented: true },
  // My Profile is opened from the profile icon in the header (route: dealer/profile).
  { key: 'invoices', label: 'Invoices', path: 'invoices', implemented: true },
  { key: 'payments', label: 'Payments', path: 'payments', implemented: true },
  { key: 'outstanding', label: 'Outstanding', path: 'outstanding', implemented: true },
  { key: 'transactions', label: 'Transactions', path: 'transactions', implemented: true },
  { key: 'schemes', label: 'Schemes', path: 'schemes', implemented: true },
  { key: 'warranty', label: 'Duro Certificates', path: 'warranty', implemented: true },
  // { key: 'documents', label: 'Documents', path: 'documents', implemented: true },
  { key: 'queries', label: 'Queries', path: 'queries', implemented: true },
  { key: 'notifications', label: 'Notifications', path: 'notifications', implemented: true },
  { key: 'reports', label: 'Reports', path: 'reports', implemented: true },
];

const SUPERADMIN_ONLY_ITEM = {
  key: 'users',
  label: 'Users',
  path: 'users',
  implemented: true,
  alwaysVisible: true,
};

export const ASSIGNABLE_ADMIN_PERMISSIONS = SIDEBAR_FEATURES.filter((item) => !item.alwaysVisible).map(
  ({ key, label }) => ({ key, label })
);
 
export function getSidebarForRole(role, { permissions = [], simulatorEnabled = true } = {}) {
  if (role === 'DEALER') return DEALER_FEATURES;

  // Super Admin gets "Users" straight after Dashboard.
  const items =
    role === 'SUPERADMIN'
      ? [SIDEBAR_FEATURES[0], SUPERADMIN_ONLY_ITEM, ...SIDEBAR_FEATURES.slice(1)]
      : SIDEBAR_FEATURES.filter((item) => item.alwaysVisible || permissions.includes(item.key));

  return items.filter((item) => item.key !== 'simulator' || simulatorEnabled);
}
