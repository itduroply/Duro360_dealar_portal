import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import PageLoader from '../../components/common/PageLoader.jsx';
import { warrantyApi } from '../../api/warrantyApi';
import { PROGRAMS } from '../../utils/warranty.js';
import { CertificateSheets } from './CertificateDocument.jsx';

// "Related Documents" box above the certificate, as on the old portal: links
// to the invoice copy and the ID proof the dealer uploaded. Screen only; it
// is not printed. The bucket is private, so each click asks for a short-lived
// link. The tab opens first so the browser does not block it as a pop-up.
function RelatedDocuments({ cert }) {
  const [busy, setBusy] = useState('');
  const [failed, setFailed] = useState('');

  const docs = [
    { key: 'invoice', label: 'Invoice Copy', path: cert.invoice_path },
    { key: 'id', label: 'ID Proof', path: cert.id_proof_path },
  ];

  async function open(doc) {
    const tab = window.open('', '_blank');
    setBusy(doc.key);
    setFailed('');
    try {
      const url = await warrantyApi.documentUrl(doc.path);
      if (tab) tab.location.href = url;
      else window.location.href = url;
    } catch (err) {
      tab?.close();
      setFailed(err.message || 'Could not open the document.');
    } finally {
      setBusy('');
    }
  }

  return (
    <div className="no-print relative z-10 mx-auto -mb-px w-[794px] max-w-full bg-white px-[18px] pb-5 pt-8">
      <fieldset className="border border-gray-400 px-4 pb-2.5 pt-0.5">
        <legend className="px-1 text-[15px] text-gray-900">Related Documents:</legend>
        <ul className="space-y-0.5 text-[13px] leading-5">
          {docs.map((d) => (
            <li key={d.key}>
              <span className="font-bold text-gray-900">Click to view: </span>
              {d.path ? (
                <button
                  type="button"
                  onClick={() => open(d)}
                  disabled={busy === d.key}
                  className="text-[#0000ee] underline hover:text-[#551a8b] disabled:opacity-60"
                >
                  {busy === d.key ? 'Opening…' : d.label}
                </button>
              ) : (
                <span className="text-gray-500">{d.label} (not uploaded)</span>
              )}
            </li>
          ))}
        </ul>
        {failed && <p className="mt-1 text-theme-xs text-error-600">{failed}</p>}
      </fieldset>
    </div>
  );
}

// Full-screen certificate, outside the portal frame, ready to print on A4.
// Opens for Dealers (their own certificates) and the Duro team; Row Level
// Security decides which rows come back. Only an ISSUED certificate, one
// with a serial number, can be printed.
export default function CertificatePrintPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cert, setCert] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    warrantyApi
      .get(id)
      .then((row) => {
        if (cancelled) return;
        if (!row) setError('This certificate was not found, or you do not have access to it.');
        else if (row.status !== 'ISSUED') setError('This certificate is not approved yet. It can be printed once it has a serial number.');
        else setCert(row);
      })
      .catch((err) => !cancelled && setError(err.message || 'Could not load this certificate.'))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (isLoading) return <PageLoader />;

  const program = cert && PROGRAMS[cert.program];

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      <div className="no-print sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[860px] flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-theme-sm font-semibold text-gray-800">{cert ? `${program.certificate} · ${cert.serial_no}` : 'Certificate'}</p>
            {cert && <p className="text-theme-xs text-gray-500">Print, then stamp and sign in the dealer box before handing it to the customer.</p>}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
              Back
            </Button>
            {cert && (
              <Button size="sm" onClick={() => window.print()}>
                Print certificate
              </Button>
            )}
          </div>
        </div>
      </div>

      {error ? (
        <p className="mx-auto mt-16 max-w-md rounded-xl border border-gray-200 bg-white p-6 text-center text-theme-sm text-gray-600">{error}</p>
      ) : (
        <div className="custom-scrollbar overflow-x-auto py-8 print:overflow-visible print:py-0">
          <RelatedDocuments cert={cert} />
          <CertificateSheets
            cert={{ ...cert, items: cert.warranty_certificate_items, issued_on: cert.reviewed_at }}
          />
        </div>
      )}
    </div>
  );
}
