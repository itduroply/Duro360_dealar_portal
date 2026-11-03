import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModulePage, { KpiStrip, StatusChip } from '../../components/ModulePage/ModulePage.jsx';
import DataTable from '../../components/ModulePage/DataTable.jsx';
import Alert from '../../components/common/Alert.jsx';
import { warrantyApi } from '../../api/warrantyApi';
import { formatCount, formatDate } from '../../utils/format.js';
import { STATUS_LABEL } from '../../utils/warranty.js';
import { ProgramTag, toRow } from '../Warranty/warrantyRows.jsx';

// The Dealer's Duro Guarantee and Tower Duro certificates. Row Level
// Security returns only this Dealer's own rows.
export default function DealerWarranty() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    warrantyApi
      .list()
      .then((data) => !cancelled && setRows(data.map(toRow)))
      .catch((err) => !cancelled && setError(err.message || 'Could not load your certificates.'))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    const by = (s) => rows.filter((r) => r.status === s).length;
    return { issued: by(STATUS_LABEL.ISSUED), pending: by(STATUS_LABEL.PENDING), rejected: by(STATUS_LABEL.REJECTED) };
  }, [rows]);
  const has = rows.length > 0;

  const columns = [
    {
      key: 'serial',
      label: 'Serial No.',
      render: (r) => (r.serial_no ? <span className="font-mono text-gray-800">{r.serial_no}</span> : <span className="text-gray-400">Awaiting approval</span>),
    },
    { key: 'program', label: 'Program', render: (r) => <ProgramTag program={r.program} /> },
    {
      key: 'customer',
      label: 'Customer',
      render: (r) => (
        <div>
          <p className="font-medium text-gray-800">{r.customer_name}</p>
          <p className="text-theme-xs text-gray-400">{r.city}</p>
        </div>
      ),
    },
    {
      key: 'invoice',
      label: 'Invoice',
      render: (r) => (
        <div>
          <p className="text-gray-700">{r.invoice_no}</p>
          <p className="text-theme-xs text-gray-400">{formatDate(r.invoice_date)}</p>
        </div>
      ),
    },
    { key: 'value', label: 'Value (Rs)', align: 'right', render: (r) => r.value_text },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <div>
          <StatusChip status={r.status} />
          {r.reject_reason && (
            <p className="mt-1 max-w-[220px] whitespace-normal text-theme-xs text-error-600" title={r.reject_reason}>
              {r.reject_reason}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'action',
      label: '',
      align: 'right',
          render: (r) =>
        r.status === STATUS_LABEL.ISSUED ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/print/warranty/${r.id}`);
            }}
            className="rounded-lg px-2.5 py-1.5 text-theme-sm font-medium text-brand-500 hover:bg-brand-50"
          >
            Print
          </button>
        ) : null,
    },
  ];

  return (
    <ModulePage
      title="Duro Certificates"
      live
      actions={[{ label: '+ Register Purchase', variant: 'primary', onClick: () => navigate('/dealer/warranty/new') }]}
    >
      {error && <Alert variant="error">{error}</Alert>}
      <KpiStrip
        items={[
          { label: 'Certificates Issued', value: has ? formatCount(counts.issued) : undefined, icon: 'warranty', tone: 'success' },
          { label: 'Awaiting Approval', value: has ? formatCount(counts.pending) : undefined, icon: 'outstanding', tone: 'warning' },
          { label: 'Rejected', value: has ? formatCount(counts.rejected) : undefined, icon: 'queries', tone: 'error' },
          { label: 'Total Registered', value: has ? formatCount(rows.length) : undefined, icon: 'documents', tone: 'brand' },
        ]}
      />

      <DataTable
        title="My Certificates"
        rows={rows}
        tabs={['All', 'Issued', 'Pending', 'Rejected']}
        searchPlaceholder="Search customer, invoice or serial"
        searchFields={['customer_name', 'invoice_no', 'serial_no', 'city']}
        columns={columns}
        pageSize={10}
        empty={{
          icon: 'warranty',
          title: isLoading ? 'Loading certificates…' : 'No certificates yet',
          hint: isLoading ? undefined : 'Register a purchase within 1 month of your invoice to give your customer a certificate.',
        }}
      />
    </ModulePage>
  );
}
