import { useState } from 'react';
import ModulePage, { KpiStrip, TabBar } from '../../components/ModulePage/ModulePage.jsx';
import Panel from '../../components/ModulePage/Panel.jsx';
import EmptyState from '../../components/ModulePage/EmptyState.jsx';
import { NAV_ICONS } from '../../components/Sidebar/navIcons.jsx';
import { TODAY } from '../../data/sample/dealerSample.js';
import { daysBetween, formatCount, formatDateTime } from '../../utils/format.js';
import { useDealerPortal } from './useDealerPortal.js';

const CATEGORIES = ['All', 'Orders', 'Invoices', 'Payments', 'Schemes', 'Queries', 'General'];
const CATEGORY_ICON = { Orders: 'orders', Invoices: 'invoices', Payments: 'payments', Schemes: 'schemes', Queries: 'queries', General: 'notifications' };
const CHANNELS = [
  { name: 'Portal', note: 'All alerts' },
  { name: 'Email', note: 'Invoices, payments and reminders' },
  { name: 'SMS', note: 'Dispatch and overdue reminders' },
];

// Where alerts are sent. Read-only: Duroply sets this for the Dealer.
function AlertChannels() {
  return (
    <Panel title="How You Get Alerts" subtitle="Set by Duroply. Raise a query to change it." className="self-start" flush>
      <ul className="divide-y divide-gray-100">
        {CHANNELS.map((c) => (
          <li key={c.name} className="flex items-center justify-between gap-3 px-5 py-3.5">
            <span>
              <span className="block text-theme-sm font-medium text-gray-800">{c.name}</span>
              <span className="text-theme-xs text-gray-500">{c.note}</span>
            </span>
            <span className="rounded-full bg-success-50 px-2.5 py-0.5 text-theme-xs font-medium text-success-700">On</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

// Alerts about the Dealer's own account, as a feed. Read state is kept on
// this page only until notifications are connected.
export default function DealerNotifications() {
  const { sample } = useDealerPortal();
  const [readIds, setReadIds] = useState(() => new Set(sample.notifications.filter((n) => n.read).map((n) => n.id)));
  const [tab, setTab] = useState('All');
  const [category, setCategory] = useState('All');

  const notifications = sample.notifications.map((n) => ({ ...n, read: readIds.has(n.id) }));
  const has = notifications.length > 0;
  const shown = notifications.filter((n) => (tab === 'All' || !n.read) && (category === 'All' || n.category === category));
  const unread = notifications.filter((n) => !n.read).length;

  const markRead = (id) => setReadIds((s) => new Set(s).add(id));
  const markAllRead = () => setReadIds(new Set(notifications.map((n) => n.id)));

  return (
    <ModulePage title="Notifications" description="Alerts about your account and activity.">
      <KpiStrip
        items={[
          { label: 'Unread', value: has ? formatCount(unread) : undefined, icon: 'notifications', tone: 'brand' },
          { label: 'Last 7 Days', value: has ? formatCount(notifications.filter((n) => daysBetween(n.at, TODAY) < 7).length) : undefined, icon: 'dashboard', tone: 'gray' },
          { label: 'Payment Alerts', value: has ? formatCount(notifications.filter((n) => n.category === 'Payments').length) : undefined, icon: 'payments', tone: 'warning' },
          { label: 'Total', value: has ? formatCount(notifications.length) : undefined, icon: 'documents', tone: 'gray' },
        ]}
      />
      <div className="grid grid-cols-1 gap-4 md:gap-5 xl:grid-cols-3">
        <Panel
          title="All Notifications"
          right={
            <>
              <TabBar tabs={['All', 'Unread']} active={tab} onChange={setTab} />
              <button
                type="button"
                onClick={markAllRead}
                disabled={unread === 0}
                className="text-theme-sm font-medium text-brand-500 hover:text-brand-600 disabled:cursor-not-allowed disabled:text-gray-400"
              >
                Mark all as read
              </button>
            </>
          }
          className="xl:col-span-2"
          flush
        >
          <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-gray-100 px-5 py-3">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`whitespace-nowrap rounded-full border px-3 py-1 text-theme-xs font-medium transition-colors ${
                  category === c ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          {shown.length === 0 ? (
            <EmptyState icon="notifications" title={tab === 'Unread' ? 'No unread notifications' : 'No notifications'} />
          ) : (
            <ul className="divide-y divide-gray-100">
              {shown.map((n) => {
                const Icon = NAV_ICONS[CATEGORY_ICON[n.category]];
                return (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => markRead(n.id)}
                      className={`flex w-full gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50 ${n.read ? '' : 'bg-brand-25'}`}
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
                        <Icon />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-3">
                          <span className={`truncate text-theme-sm ${n.read ? 'font-medium text-gray-700' : 'font-semibold text-gray-800'}`}>{n.title}</span>
                          {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-brand-500" aria-label="Unread" />}
                        </span>
                        <span className="mt-0.5 block text-theme-sm text-gray-500">{n.text}</span>
                        <span className="mt-1 block text-theme-xs text-gray-400">
                          {n.category} · {formatDateTime(n.at)}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
        <AlertChannels />
      </div>
    </ModulePage>
  );
}
