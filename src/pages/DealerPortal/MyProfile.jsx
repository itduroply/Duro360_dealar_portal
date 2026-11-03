import { useState } from 'react';
import PageHeader from '../../components/common/PageHeader.jsx';
import Alert from '../../components/common/Alert.jsx';
import { PendingButton } from '../../components/ModulePage/ModulePage.jsx';
import Panel from '../../components/ModulePage/Panel.jsx';
import { LABEL } from '../../components/common/formStyles.js';
import { formatDate, formatLacs } from '../../utils/format.js';
import { useDealerPortal } from './useDealerPortal.js';

const NOT_IN_MASTER = 'Not in master data yet';
const FIELD =
  'w-full rounded-lg border border-gray-300 bg-white px-3.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10';
const CHANGE_FIELDS = ['Email', 'Mobile', 'Address', 'GST Number', 'PAN', 'Other'];

// Label / value rows. A missing value shows as a muted note, not a blank.
function DetailList({ rows }) {
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label} className="min-w-0">
          <dt className="text-theme-xs font-medium text-gray-500">{label}</dt>
          <dd className={`mt-0.5 truncate text-theme-sm ${value ? 'font-medium text-gray-800' : 'text-gray-400'}`} title={value || undefined}>
            {value || NOT_IN_MASTER}
          </dd>
        </div>
      ))}
    </dl>
  );
}

// Name, code and login status on a brand banner, with the account figures
// (zone, branch, market, credit limit) as tiles underneath.
function ProfileHero({ dealer, record, creditLimit }) {
  const initial = dealer.name.trim().charAt(0).toUpperCase();
  const place = [record?.market_name, record?.selling_branch, record?.zone].filter(Boolean).join(' · ');
  const tiles = [
    ['Zone', record?.zone],
    ['Selling Branch', record?.selling_branch],
    ['Market', record?.market_name],
    ['Credit Limit', creditLimit],
  ];
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="h-24 bg-gradient-to-r from-brand-500 to-brand-700 sm:h-28" aria-hidden="true" />
      <div className="px-5 pb-5 sm:px-6">
        <div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:gap-5">
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-brand-50 text-3xl font-semibold text-brand-500 ring-4 ring-white sm:h-24 sm:w-24 sm:text-4xl">
              {initial}
            </span>
            <div className="min-w-0 sm:pb-1">
              <h2 className="text-xl font-semibold text-gray-800">{dealer.name}</h2>
              <p className="mt-0.5 text-theme-sm text-gray-500">{place || '—'}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:pb-1">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-theme-xs font-medium text-gray-700">Dealer Code {dealer.code}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-3 py-1 text-theme-xs font-medium text-success-700">
              <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
              Portal login active
            </span>
          </div>
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {tiles.map(([label, value]) => (
            <div key={label} className="min-w-0 rounded-xl bg-gray-50 px-4 py-3">
              <dt className="text-theme-xs font-medium text-gray-500">{label}</dt>
              <dd className={`mt-1 truncate text-theme-sm ${value ? 'font-semibold text-gray-800' : 'text-gray-400'}`} title={value || undefined}>
                {value || NOT_IN_MASTER}
              </dd>
            </div>
          ))}
        </dl>
        {record?.synced_at && (
          <p className="mt-3 text-theme-xs text-gray-400">Last updated from master data on {formatDate(record.synced_at)}</p>
        )}
      </div>
    </section>
  );
}

// Dealers cannot edit master data. They send a change request, and Duroply
// checks and updates the record. Sending stays disabled until that flow is connected.
function ChangeRequest() {
  const [form, setForm] = useState({ field: CHANGE_FIELDS[0], value: '', reason: '' });
  return (
    <Panel title="Request a Change" subtitle="Duroply checks each request before updating your record." className="self-start">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="change-field" className={LABEL}>
            What to change
          </label>
          <select
            id="change-field"
            value={form.field}
            onChange={(e) => setForm((f) => ({ ...f, field: e.target.value }))}
            className={`${FIELD} h-10 cursor-pointer`}
          >
            {CHANGE_FIELDS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="change-value" className={LABEL}>
            New value
          </label>
          <input id="change-value" value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} className={`${FIELD} h-10`} />
        </div>
      </div>
      <label htmlFor="change-reason" className={`${LABEL} mt-4`}>
        Reason
      </label>
      <textarea
        id="change-reason"
        rows={3}
        value={form.reason}
        onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
        className={`${FIELD} py-2.5`}
        placeholder="For example: our office has moved."
      />
      <div className="mt-4 flex justify-end">
        <PendingButton variant="primary">Send Request</PendingButton>
      </div>
    </Panel>
  );
}

// The Dealer's own master record (real data from dealer_directory).
export default function MyProfile() {
  const { dealer, record, recordState } = useDealerPortal();
  // dealer_directory stores the credit limit in rupees; the portal shows Rs Lacs.
  const creditLimit = record?.credit_limit != null ? `Rs ${formatLacs(record.credit_limit / 100000)} Lacs` : null;

  return (
    <div>
      <PageHeader title="My Profile" description="Your details as held by Duroply." />

      {recordState.error && (
        <Alert variant="error" className="mb-4">
          {recordState.error}
        </Alert>
      )}
      {!recordState.isLoading && !record && !recordState.error && (
        <Alert variant="warning" className="mb-4">
          No master record was found for Dealer Code {dealer.code}. Please contact Duroply.
        </Alert>
      )}

      <div className="flex flex-col gap-4 md:gap-5">
        <ProfileHero dealer={dealer} record={record} creditLimit={creditLimit} />

        <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-4 md:gap-5">
            <Panel title="Contact">
              <DetailList
                rows={[
                  ['Email', record?.email],
                  ['Mobile', record?.mobile_no],
                ]}
              />
            </Panel>
            <Panel title="Business Details">
              <DetailList
                rows={[
                  ['Dealer Code', dealer.code],
                  ['Registered Name', record?.customer_name],
                  ['GST Number', null],
                  ['PAN', null],
                  ['Address', null],
                ]}
              />
            </Panel>
          </div>
          <ChangeRequest />
        </div>
      </div>
    </div>
  );
}
