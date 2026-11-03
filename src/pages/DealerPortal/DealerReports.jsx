import { useMemo, useState } from 'react';
import ModulePage, { KpiStrip, TabBar } from '../../components/ModulePage/ModulePage.jsx';
import EmptyState from '../../components/ModulePage/EmptyState.jsx';
import ChartCard from '../../components/Charts/ChartCard.jsx';
import { SERIES_COLORS } from '../../components/Charts/chartTheme.js';
import { NAV_ICONS } from '../../components/Sidebar/navIcons.jsx';
import ReportChart, { legendFor } from '../Reports/ReportChart.jsx';
import { AGEING_BUCKETS } from '../../data/sample/dealerSample.js';
import { downloadCsv } from '../../utils/csv.js';
import { formatCount, formatLacs, formatLacsWhole, monthLabel } from '../../utils/format.js';
import { useDealerPortal } from './useDealerPortal.js';

const [BLUE, ORANGE] = SERIES_COLORS;
const RANGES = { '3 Months': 3, '6 Months': 6 };
const BUCKET_COLORS = { '0–30': '#1baf7a', '31–60': '#eda100', '61–90': '#eb6834', '90+': '#d92d20' };
const lacs = (v) => `${formatLacs(v)} Lacs`;
const sum = (list) => list.reduce((s, v) => s + v, 0);

// Report definitions for one Dealer, built from that Dealer's own data.
// Same shape as pages/Reports/reportDefinitions.js, so ReportChart draws them.
function dealerReports(sample) {
  const { monthly, account, orders } = sample;
  const last = (list, n) => list.slice(-n);
  return [
    {
      name: 'Purchases by Month',
      icon: 'orders',
      about: 'Order value placed with Duroply each month.',
      monthly: true,
      build: (n) => {
        const labels = last(monthly.months, n).map(monthLabel);
        const values = last(monthly.purchases, n);
        const counts = last(monthly.orderCount, n);
        return {
          summary: [
            { label: 'Order Value', value: formatLacsWhole(sum(values)), unit: 'Rs Lacs' },
            { label: 'Orders', value: formatCount(sum(counts)) },
            { label: 'Average per Month', value: formatLacsWhole(sum(values) / n), unit: 'Rs Lacs' },
          ],
          chart: { type: 'column', title: 'Order value by month', subtitle: 'Rs Lacs', labels, series: [{ name: 'Order value', color: BLUE, values }], format: lacs },
          table: { columns: ['Month', 'Orders', 'Order Value (Rs Lacs)'], rows: labels.map((m, i) => [m, counts[i], formatLacs(values[i])]) },
        };
      },
    },
    {
      name: 'Invoiced vs Paid',
      icon: 'payments',
      about: 'Invoice value raised and payments made each month.',
      monthly: true,
      build: (n) => {
        const labels = last(monthly.months, n).map(monthLabel);
        const invoiced = last(monthly.invoiced, n);
        const paid = last(monthly.paid, n);
        return {
          summary: [
            { label: 'Invoiced', value: formatLacsWhole(sum(invoiced)), unit: 'Rs Lacs' },
            { label: 'Paid', value: formatLacsWhole(sum(paid)), unit: 'Rs Lacs' },
            { label: 'Paid vs Invoiced', value: sum(invoiced) ? `${Math.round((sum(paid) / sum(invoiced)) * 100)}%` : '—' },
          ],
          chart: {
            type: 'line',
            title: 'Invoiced and paid by month',
            subtitle: 'Rs Lacs',
            labels,
            series: [
              { name: 'Invoiced', color: BLUE, values: invoiced },
              { name: 'Paid', color: ORANGE, values: paid },
            ],
            format: lacs,
          },
          table: { columns: ['Month', 'Invoiced (Rs Lacs)', 'Paid (Rs Lacs)'], rows: labels.map((m, i) => [m, formatLacs(invoiced[i]), formatLacs(paid[i])]) },
        };
      },
    },
    {
      name: 'Outstanding Ageing',
      icon: 'outstanding',
      about: 'Current outstanding split by debtors ageing buckets.',
      build: () => ({
        summary: [
          { label: 'Outstanding', value: formatLacsWhole(account.outstanding), unit: 'Rs Lacs' },
          { label: 'Overdue', value: formatLacsWhole(account.overdue), unit: 'Rs Lacs' },
          { label: 'Over 90 Days', value: formatLacsWhole(account.buckets['90+']), unit: 'Rs Lacs' },
        ],
        chart: {
          type: 'stacked',
          title: 'Outstanding by age',
          subtitle: 'Rs Lacs',
          parts: AGEING_BUCKETS.map((b) => ({ label: `${b} Days`, value: account.buckets[b], color: BUCKET_COLORS[b] })),
          format: formatLacs,
        },
        table: { columns: ['Age (Days)', 'Outstanding (Rs Lacs)'], rows: AGEING_BUCKETS.map((b) => [b, formatLacs(account.buckets[b])]) },
      }),
    },
    {
      name: 'Order Status',
      icon: 'dashboard',
      about: 'Your orders this financial year by current status.',
      build: () => {
        const rows = ['Pending', 'Approved', 'Dispatched', 'Delivered', 'Cancelled'].map((s) => ({ label: s, value: orders.filter((o) => o.status === s).length }));
        return {
          summary: [
            { label: 'Orders', value: formatCount(orders.length) },
            { label: 'Delivered', value: formatCount(rows[3].value) },
            { label: 'Cancelled', value: formatCount(rows[4].value) },
          ],
          chart: { type: 'bars', title: 'Orders by status', subtitle: 'FY 26-27', rows, format: formatCount },
          table: { columns: ['Status', 'Orders'], rows: rows.map((r) => [r.label, r.value]) },
        };
      },
    },
  ];
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M10 3v9m0 0-3.5-3.5M10 12l3.5-3.5M3.5 14.5v1a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Dealer-specific reports: report list on the left, the chosen report on the right.
export default function DealerReports() {
  const { dealer, sample } = useDealerPortal();
  const reports = useMemo(() => dealerReports(sample), [sample]);
  const [activeName, setActiveName] = useState(reports[0].name);
  const [range, setRange] = useState('6 Months');
  const hasData = Boolean(sample.account);

  const report = reports.find((r) => r.name === activeName);
  const view = useMemo(() => (hasData ? report.build(RANGES[range]) : null), [hasData, report, range]);

  return (
    <ModulePage title="Reports" description="Reports drawn from your own account data. All amounts in Rs Lacs.">
      <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-4">
        <nav className="self-start rounded-2xl border border-gray-200 bg-white p-2" aria-label="Reports">
          <p className="px-3 pb-1 pt-2 text-theme-xs font-medium uppercase tracking-wide text-gray-400">My Reports</p>
          <ul>
            {reports.map((r) => {
              const Icon = NAV_ICONS[r.icon];
              const isActive = r.name === activeName;
              return (
                <li key={r.name}>
                  <button
                    type="button"
                    onClick={() => setActiveName(r.name)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-theme-sm font-medium transition-colors ${
                      isActive ? 'bg-brand-50 text-brand-500' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className={isActive ? 'text-brand-500' : 'text-gray-400'}>
                      <Icon />
                    </span>
                    {r.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex min-w-0 flex-col gap-4 md:gap-5 lg:col-span-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{report.name}</h3>
              <p className="mt-0.5 text-theme-sm text-gray-500">{report.about}</p>
            </div>
            <div className="flex items-center gap-2">
              {report.monthly && <TabBar tabs={Object.keys(RANGES)} active={range} onChange={setRange} />}
              <button
                type="button"
                disabled={!view}
                onClick={() => downloadCsv(`${report.name} ${dealer.code}`, view.table)}
                className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-theme-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <DownloadIcon />
                CSV
              </button>
            </div>
          </div>

          {view ? (
            <>
              <KpiStrip items={view.summary} />
              <ChartCard title={view.chart.title} subtitle={view.chart.subtitle} legend={legendFor(view.chart)} table={view.table}>
                <ReportChart chart={view.chart} />
              </ChartCard>
            </>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white">
              <EmptyState icon="reports" title="No data yet" hint="This report will fill in once your account data is connected." />
            </div>
          )}
        </div>
      </div>
    </ModulePage>
  );
}
