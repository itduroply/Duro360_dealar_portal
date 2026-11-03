import ModulePage, { KpiStrip, StatusChip, PendingButton, NOT_CONNECTED_TITLE } from '../../components/ModulePage/ModulePage.jsx';
import Panel from '../../components/ModulePage/Panel.jsx';
import DataTable from '../../components/ModulePage/DataTable.jsx';
import EmptyState from '../../components/ModulePage/EmptyState.jsx';
import { TODAY } from '../../data/sample/dealerSample.js';
import { formatCount, formatDate, inPeriod } from '../../utils/format.js';
import { useDealerPortal } from './useDealerPortal.js';

const CATEGORIES = ['Price List', 'Circular', 'Account Statement', 'Agreement', 'Certificate'];
const REQUEST_STATUS_STYLE = {
  Pending: 'bg-warning-50 text-warning-700',
  Submitted: 'bg-brand-50 text-brand-600',
  Accepted: 'bg-success-50 text-success-700',
};

function FileIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M5 2.5h6.5L15.5 6.5v10a1 1 0 0 1-1 1h-9.5a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M11.5 2.5v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M10 3v9m0 0-3.5-3.5M10 12l3.5-3.5M3.5 14.5v1a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const SHARED_COLUMNS = [
  {
    key: 'name',
    label: 'Document',
    render: (r) => (
      <span className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500">
          <FileIcon />
        </span>
        <span className="min-w-0">
          <span className="block max-w-[220px] truncate" title={r.name}>
            {r.name}
          </span>
          <span className="text-theme-xs font-normal text-gray-400">{r.size}</span>
        </span>
      </span>
    ),
  },
  { key: 'category', label: 'Category' },
  { key: 'date', label: 'Shared On', render: (r) => formatDate(r.date) },
  {
    key: 'download',
    label: '',
    render: () => (
      <button
        type="button"
        disabled
        title={NOT_CONNECTED_TITLE}
        aria-label="Download"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 ring-1 ring-inset ring-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <DownloadIcon />
      </button>
    ),
  },
];

// Documents Duroply has asked this Dealer to upload.
function RequestedDocuments({ requests }) {
  return (
    <Panel title="Requested by Duroply" subtitle="Upload these documents" flush className="self-start">
      {requests.length === 0 ? (
        <EmptyState compact icon="documents" title="No requests" />
      ) : (
        <ul className="divide-y divide-gray-100">
          {requests.map((r) => (
            <li key={r.id} className="flex flex-col gap-2 px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-theme-sm font-medium text-gray-800">{r.name}</p>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-theme-xs font-medium ${REQUEST_STATUS_STYLE[r.status]}`}>{r.status}</span>
              </div>
              <p className="text-theme-xs text-gray-500">{r.note}</p>
              <div className="flex items-center justify-between gap-3">
                <span className={`text-theme-xs ${r.status === 'Pending' && r.dueOn < TODAY ? 'font-medium text-error-600' : 'text-gray-400'}`}>
                  Due {formatDate(r.dueOn)}
                </span>
                {r.status === 'Pending' && <PendingButton>Upload</PendingButton>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

// Files Duroply has shared with the Dealer, and files Duroply has asked for.
export default function DealerDocuments() {
  const { sample } = useDealerPortal();
  const { sharedDocuments, documentRequests } = sample;
  const has = sharedDocuments.length > 0;
  const count = (list) => (has ? formatCount(list.length) : undefined);

  return (
    <ModulePage title="Documents" description="Documents shared with you, and documents Duroply has asked you to upload.">
      <KpiStrip
        items={[
          { label: 'Shared with You', value: count(sharedDocuments), icon: 'documents', tone: 'brand' },
          { label: 'New This Month', value: count(sharedDocuments.filter((d) => inPeriod(d.date, 'This Month', TODAY))), icon: 'notifications', tone: 'gray' },
          { label: 'Uploads Pending', value: count(documentRequests.filter((r) => r.status === 'Pending')), icon: 'queries', tone: 'warning' },
          { label: 'Uploads Accepted', value: count(documentRequests.filter((r) => r.status === 'Accepted')), icon: 'auditLogs', tone: 'success' },
        ]}
      />
      <div className="grid grid-cols-1 gap-4 md:gap-5 xl:grid-cols-3">
        <DataTable
          className="xl:col-span-2"
          title="Shared with You"
          rows={sharedDocuments}
          searchPlaceholder="Search document"
          searchFields={['name', 'category']}
          filters={[{ id: 'category', label: 'All Categories', options: CATEGORIES }]}
          columns={SHARED_COLUMNS}
          empty={{ icon: 'documents', title: 'No documents yet', hint: 'Files Duroply shares with you will be listed here.' }}
        />
        <RequestedDocuments requests={documentRequests} />
      </div>
    </ModulePage>
  );
}
