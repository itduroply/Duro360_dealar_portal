import { useState } from 'react';
import ModulePage, { KpiStrip, StatusChip } from '../../components/ModulePage/ModulePage.jsx';
import Panel from '../../components/ModulePage/Panel.jsx';
import DataTable from '../../components/ModulePage/DataTable.jsx';
import EmptyState from '../../components/ModulePage/EmptyState.jsx';
import { TODAY } from '../../data/sample/dealerSample.js';
import { PERIODS, addDays, formatCount, formatDate, formatLacs, formatLacsWhole, inPeriod } from '../../utils/format.js';
import { useDealerPortal } from './useDealerPortal.js';

const STAGES = ['Placed', 'Approved', 'Dispatched', 'Delivered'];
const STAGE_INDEX = { Pending: 0, Approved: 1, Dispatched: 2, Delivered: 3 };
// Sample dates for each stage, counted from the order date. Dispatch is the
// invoice date (order date + 2 in data/sample/transactions.js).
const STAGE_OFFSET = [0, 1, 2, 6];

// Step-by-step status of one order, from placed to delivered.
function OrderTracking({ order, invoice }) {
  if (!order) {
    return (
      <Panel title="Order Tracking" className="self-start">
        <EmptyState compact icon="orders" title="Select an order" hint="Click an order in the list to track it." />
      </Panel>
    );
  }
  const cancelled = order.status === 'Cancelled';
  const reached = cancelled ? 0 : STAGE_INDEX[order.status];

  return (
    <Panel title="Order Tracking" subtitle={order.id} right={<StatusChip status={order.status} />} className="self-start">
      <dl className="mb-5 grid grid-cols-3 gap-3 rounded-xl bg-gray-50 p-3 text-center">
        <div>
          <dt className="text-theme-xs text-gray-500">Order Date</dt>
          <dd className="text-theme-sm font-medium text-gray-800">{formatDate(order.date)}</dd>
        </div>
        <div>
          <dt className="text-theme-xs text-gray-500">Items</dt>
          <dd className="text-theme-sm font-medium text-gray-800">{order.items}</dd>
        </div>
        <div>
          <dt className="text-theme-xs text-gray-500">Rs Lacs</dt>
          <dd className="text-theme-sm font-medium text-gray-800">{formatLacs(order.amount)}</dd>
        </div>
      </dl>

      {cancelled ? (
        <p className="rounded-xl border border-error-200 bg-error-50 p-3 text-theme-sm text-error-700">This order was cancelled.</p>
      ) : (
        <ol className="relative ml-3 border-l border-gray-200">
          {STAGES.map((stage, i) => {
            const done = i <= reached;
            return (
              <li key={stage} className="mb-5 ml-5 last:mb-0">
                <span
                  className={`absolute -left-[9px] flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 ${
                    done ? 'border-brand-500 bg-brand-500' : 'border-gray-300 bg-white'
                  }`}
                  aria-hidden="true"
                >
                  {done && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </span>
                <p className={`text-theme-sm font-medium ${done ? 'text-gray-800' : 'text-gray-400'}`}>{stage}</p>
                <p className="text-theme-xs text-gray-500">
                  {done ? formatDate([addDays(order.date, STAGE_OFFSET[i]), TODAY].sort()[0]) : 'Not yet'}
                </p>
              </li>
            );
          })}
        </ol>
      )}

      {invoice && (
        <p className="mt-5 border-t border-gray-100 pt-4 text-theme-sm text-gray-500">
          Invoice <span className="font-medium text-gray-800">{invoice.id}</span> raised on {formatDate(invoice.date)}.
        </p>
      )}
    </Panel>
  );
}

const COLUMNS = [
  { key: 'id', label: 'Order No.' },
  { key: 'date', label: 'Order Date', render: (r) => formatDate(r.date) },
  { key: 'items', label: 'Items', align: 'right' },
  { key: 'amount', label: 'Amount', align: 'right', render: (r) => formatLacs(r.amount) },
  { key: 'status', label: 'Status', render: (r) => <StatusChip status={r.status} /> },
];

// The Dealer's own orders: list on the left, tracking for the chosen order on the right.
export default function DealerOrders() {
  const { sample } = useDealerPortal();
  const { orders, invoices } = sample;
  const [selectedId, setSelectedId] = useState(orders[0]?.id);
  const has = orders.length > 0;
  const live = orders.filter((o) => o.status !== 'Cancelled');
  const count = (statuses) => (has ? formatCount(orders.filter((o) => statuses.includes(o.status)).length) : undefined);
  const selected = orders.find((o) => o.id === selectedId);

  return (
    <ModulePage title="Orders" description="Your orders with Duroply and where each one is. All amounts in Rs Lacs.">
      <KpiStrip
        items={[
          { label: 'Orders in FY 26-27', value: has ? formatCount(live.length) : undefined, icon: 'orders', tone: 'brand' },
          { label: 'Awaiting Dispatch', value: count(['Pending', 'Approved']), icon: 'outstanding', tone: 'warning' },
          { label: 'On the Way', value: count(['Dispatched']), icon: 'dealers', tone: 'success' },
          {
            label: 'Order Value This Month',
            unit: 'Rs Lacs',
            value: has ? formatLacsWhole(live.filter((o) => inPeriod(o.date, 'This Month', TODAY)).reduce((s, o) => s + o.amount, 0)) : undefined,
            icon: 'payments',
            tone: 'gray',
          },
        ]}
      />
      <div className="grid grid-cols-1 gap-4 md:gap-5 xl:grid-cols-3">
        <DataTable
          className="xl:col-span-2"
          rows={orders}
          tabs={['All', 'Pending', 'Approved', 'Dispatched', 'Delivered', 'Cancelled']}
          searchPlaceholder="Search order no."
          searchFields={['id']}
          filters={[{ id: 'period', label: 'All Periods', options: PERIODS, match: (r, v) => inPeriod(r.date, v, TODAY) }]}
          columns={COLUMNS}
          onRowClick={(r) => setSelectedId(r.id)}
          empty={{ icon: 'orders', title: 'No orders yet', hint: 'Orders you place with Duroply will be listed here.' }}
        />
        <OrderTracking order={selected} invoice={invoices.find((i) => i.orderId === selectedId)} />
      </div>
    </ModulePage>
  );
}
