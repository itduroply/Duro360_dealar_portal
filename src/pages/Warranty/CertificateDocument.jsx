import { useEffect, useRef, useState } from 'react';
import duroplyLogo from '../../assets/duroply-logo.png';
import towerLogo from '../../assets/Tower B_P Logo.jpg';
import forestFriendlyLogo from '../../assets/Forest Friendly Logo.png';
import mdSignature from '../../assets/md-signature.png';
import { formatDate } from '../../utils/format.js';
import { COMPANY, PROGRAMS, customerTypeLabel, groupByTerm } from '../../utils/warranty.js';
import { annexureRowsFor, annexureTermLabel, certDate } from '../../utils/certificateContent.js';

// A4 at 96 dpi. The sheets are drawn at this fixed size, then scaled for
// on-screen previews, so the preview and the print always match.
export const SHEET_W = 794;
export const SHEET_H = 1123;

// Program logo: Tower Board & Ply for Tower, Duro for Duro.
function BrandMark({ program, small = false }) {
  if (program === 'TOWER_WARRANTY') {
    return <img src={towerLogo} alt="Tower Board & Ply" className={small ? 'h-14 w-auto' : 'h-24 w-auto'} />;
  }
  return <img src={duroplyLogo} alt="Duroply" className={small ? 'h-6 w-auto' : 'h-9 w-auto'} />;
}

// "The Forest Friendly Company" logo, top right on both programs.
function ForestFriendlyMark() {
  return <img src={forestFriendlyLogo} alt="The Forest Friendly Company" className="h-14 w-auto shrink-0" />;
}

function Sheet({ preview, children }) {
  return (
    <div
      className="cert-sheet relative mx-auto shrink-0 overflow-hidden bg-white text-gray-800 shadow-theme-lg"
      style={{ width: SHEET_W, height: SHEET_H }}
    >
      <div className="pointer-events-none absolute inset-[18px] border border-gray-400" />
      {preview && (
        <p className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[28deg] select-none text-[120px] font-bold tracking-[0.2em] text-gray-900/[0.035]">
          PREVIEW
        </p>
      )}
      <div className="relative flex h-full flex-col px-12 pb-10 pt-9">{children}</div>
    </div>
  );
}

// "Name : value" rows, as in the old portal's certificate.
function DetailRows({ rows }) {
  return (
    <table className="text-[11.5px] leading-[18px]">
      <tbody>
        {rows.map(([label, value]) => (
          <tr key={label} className="align-top">
            <td className="w-[72px] pr-2">{label}</td>
            <td className="w-3">:</td>
            <td className="break-words">
              {Array.isArray(value) ? value.filter(Boolean).map((line) => <div key={line}>{line}</div>) : value || '—'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Dotted({ children }) {
  return <span className="inline-block min-w-[110px] border-b border-dotted border-gray-500 px-1">{children || ' '}</span>;
}

function rupees(value) {
  return `₹ ${Number(value).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

/**
 * The two A4 sheets of a certificate: the certificate itself (laid out as on
 * the old Duro Portal), then the program's terms and conditions. `cert`
 * fields match warranty_certificates, plus `items` ([{ brand, term_years }])
 * and `issued_on` (date of issue). `preview` marks it as a draft with no
 * serial number yet.
 */
function LegacyTowerSheets({ cert, preview = false, termsSheet = true }) {
  const program = PROGRAMS[cert.program] || PROGRAMS.DURO_GUARANTEE;
  const kind = program.key === 'TOWER_WARRANTY' ? 'WARRANTY' : 'GUARANTEE';
  const groups = groupByTerm(cert.items || []);
  // Contractor, Architect, Sub-dealer or OEM: printed above the consumer.
  const hasType = cert.customer_type && cert.customer_type !== 'CONSUMER';
  const serial = cert.serial_no || (preview ? 'Given after approval' : '');

  return (
    <div className="flex flex-col gap-8 print:gap-0">
      <Sheet preview={preview}>
        <p className="absolute right-12 top-9 text-[10.5px] text-gray-600">
          Sl. No. <span className="font-mono font-semibold text-gray-900">{serial}</span>
        </p>

        <header className="mt-4 flex items-start gap-6">
          <div className="w-[170px] shrink-0">
            <BrandMark program={program.key} />
          </div>
          <div className="flex-1 text-[11px] leading-[16px] text-gray-700">
            <p className="text-[18px] font-bold leading-[24px] text-[#d71920]">{COMPANY.name}</p>
            <p>(Formerly: {COMPANY.formerly})</p>
            <p className="mt-1.5">{COMPANY.address}</p>
            <p>{COMPANY.phone}</p>
            <p>E-mail: {COMPANY.email}</p>
            <p>CIN: {COMPANY.cin}</p>
          </div>
          <ForestFriendlyMark />
        </header>

        <div className="mt-7 space-y-2.5 text-[11.5px] leading-[17px]">
          <p>Dear Customer,</p>
          {program.intro.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p>For {COMPANY.name}</p>
        </div>
        <div className="mt-1 text-[11.5px] leading-[16px]">
          <img src={mdSignature} alt="" className="h-10 w-auto" />
          <p className="font-bold">{COMPANY.signatory}</p>
          <p className="italic">{COMPANY.signatoryTitle}</p>
        </div>

        <section className="mt-6 flex gap-8 text-[11.5px] leading-[17px]">
          <div className="grid flex-1 grid-cols-2 content-start gap-x-6 gap-y-3">
            {groups.length === 0 ? (
              <p className="text-gray-400">Brands you pick will show here.</p>
            ) : (
              groups.map((g) => (
                <div key={g.label}>
                  <p className="font-bold uppercase">
                    {g.label} {kind}
                  </p>
                  <ul className="list-disc pl-5 uppercase">
                    {g.items.map((item) => (
                      <li key={item.brand}>{item.brand}</li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
          <div className="w-[230px] shrink-0 space-y-2">
            <div>
              <p className="font-bold">Dealers Name</p>
              <p className="uppercase">
                {cert.dealer_name || '—'}
                {cert.dealer_code ? ` ( ${cert.dealer_code} )` : ''}
              </p>
            </div>
            <div>
              <p className="font-bold">Invoice Details</p>
              <p>
                <span className="inline-block w-10">No:</span>
                <Dotted>{cert.invoice_no}</Dotted>
              </p>
              <p className="mt-1">
                <span className="inline-block w-10">Date:</span>
                <Dotted>{cert.invoice_date && formatDate(cert.invoice_date)}</Dotted>
              </p>
              <p className="mt-1">
                <span className="inline-block w-10">Value:</span>
                <Dotted>{cert.invoice_value ? rupees(cert.invoice_value) : ''}</Dotted>
                {program.invoiceNote && <span> ({program.invoiceNote})</span>}
              </p>
            </div>
            <div>
              <p className="font-bold">Date of issue</p>
              <p>{cert.issued_on && formatDate(cert.issued_on)}</p>
            </div>
          </div>
        </section>

        <p className="mt-6 border-b border-dashed border-gray-500 pb-0.5 text-[10.5px]">*T&amp;C Apply</p>

        <section className="mt-4 flex gap-8">
          <div className="flex-1">
            <BrandMark program={program.key} small />
            <div className={`mt-3 grid gap-6 ${hasType ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {hasType && (
                <div>
                  <p className="mb-1.5 text-[13px] font-bold">{customerTypeLabel(cert.customer_type)}’s Details</p>
                  <DetailRows
                    rows={[
                      ['Name', cert.type_name],
                      ['Address', [cert.type_address1, cert.type_address2, cert.type_address3]],
                      ['City', cert.type_city],
                      ['State', cert.type_state],
                      ['Pincode', cert.type_pin],
                      ['Mobile', cert.type_mobile],
                      ['Email ID', cert.type_email],
                    ]}
                  />
                </div>
              )}
              <div>
                <p className="mb-1.5 text-[13px] font-bold">Consumer Details</p>
                <DetailRows
                  rows={[
                    ['Name', cert.customer_name],
                    ['Address', [cert.address1, cert.address2, cert.address3]],
                    ['City', cert.city],
                    ['State', cert.state],
                    ['Pincode', cert.pin],
                    ['Mobile', cert.mobile],
                    ['Email ID', cert.email],
                  ]}
                />
              </div>
            </div>
          </div>
          <div className="w-[200px] shrink-0 text-right">
            <p className="text-[14px] font-bold leading-[18px]">Dealer’s Seal with Date</p>
            <p className="mt-12 text-[11px]">for {cert.dealer_name || '—'}</p>
          </div>
        </section>
      </Sheet>

      {termsSheet && (
        <Sheet preview={preview}>
          <header className="flex items-start justify-between gap-6 border-b border-gray-200 pb-5">
            <BrandMark program={program.key} />
            <div className="text-center text-[11.5px] leading-[18px]">
              <p>
                <span className="font-semibold">Certificate Number:</span> <span className="font-mono">{serial}</span>
              </p>
              <p>
                <span className="font-semibold">Consumer Name:</span> {cert.customer_name || '—'}
              </p>
            </div>
            <ForestFriendlyMark />
          </header>
          <h2 className="mt-6 text-[15px] font-bold">{kind === 'WARRANTY' ? 'Warranty Conditions' : 'Guarantee Terms and Conditions'}</h2>
          <ol className="mt-4 space-y-2.5 text-[11.5px] leading-[18px]">
            {program.terms.map((term, i) => (
              <li key={term} className="flex gap-2">
                <span className="w-5 shrink-0 text-right">{i + 1}.</span>
                <span>{term}</span>
              </li>
            ))}
          </ol>
        </Sheet>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Duro Guarantee Certificate: laid out as the approved certificate PDF.
// Sheet 1 is the certificate, sheets 2 and 3 are the Terms and Conditions,
// sheet 4 is Annexure A with a row for each brand on the invoice.
// ---------------------------------------------------------------------------

// "Name : value" rows, as in the PDF.
function ConsumerRows({ rows }) {
  return (
    <table className="text-[11.5px] leading-[18px]">
      <tbody>
        {rows.map(([label, value]) => (
          <tr key={label} className="align-top">
            <td className="w-[78px]">{label}</td>
            <td className="pr-1.5">:</td>
            <td className="break-words">
              {Array.isArray(value) ? value.filter(Boolean).map((line) => <div key={line}>{line}</div>) : value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function InvoiceLine({ label, children }) {
  return (
    <p className="mt-1.5 flex items-baseline gap-1">
      <span className="w-[38px] shrink-0">{label}</span>
      <span className="min-w-[110px] border-b border-dashed border-gray-500 px-1">{children || ' '}</span>
    </p>
  );
}

function SheetHeader({ serial, cert }) {
  return (
    <header className="flex items-start justify-between gap-6">
      <img src={duroplyLogo} alt="Duroply" className="h-9 w-auto shrink-0" />
      <div className="pt-1 text-center text-[11.5px] font-bold leading-[17px]">
        <p>Certificate Number: {serial}</p>
        <p>Consumer Name: {cert.customer_name || '—'}</p>
      </div>
      <ForestFriendlyMark />
    </header>
  );
}

function TermSection({ section }) {
  return (
    <div className={section.title ? 'mt-5 first:mt-0' : ''}>
      {section.title && <h3 className="text-[12px] font-bold leading-[18px]">{section.title}</h3>}
      {section.lead && <p className="text-[11.5px] leading-[18px]">{section.lead}</p>}
      <ul className="mt-1.5 list-[circle] space-y-2 pl-9 text-[11.5px] leading-[17px]">
        {section.items.map((item) => {
          const text = typeof item === 'string' ? item : item.text;
          return (
            <li key={text}>
              {text}
              {typeof item === 'object' && item.sub && (
                <ul className="mt-2 list-[square] space-y-2 pl-8">
                  {item.sub.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function DuroSheets({ cert, preview, termsSheet }) {
  const program = PROGRAMS.DURO_GUARANTEE;
  const rows = annexureRowsFor(cert.items);
  const serial = cert.serial_no || (preview ? 'Given after approval' : '');
  const dealerName = cert.dealer_name || '';
  // Contractor, Architect, Sub-dealer or OEM: printed beside the consumer.
  const hasType = cert.customer_type && cert.customer_type !== 'CONSUMER';

  // First-sheet list: "LIFETIME GUARANTEE" over its brands, longest term first.
  const groups = [];
  for (const row of [...rows].sort((a, b) => (b.term ?? Infinity) - (a.term ?? Infinity))) {
    const label = annexureTermLabel(row);
    let g = groups.find((x) => x.label === label);
    if (!g) groups.push((g = { label, brands: [] }));
    g.brands.push(row.brand);
  }

  const personRows = (p) => [
    ['Name', cert[`${p}name`]],
    ['Address', [cert[`${p}address1`], cert[`${p}address2`], cert[`${p}address3`]]],
    ['City', cert[`${p}city`]],
    ['State', cert[`${p}state`]],
    ['PIN', cert[`${p}pin`]],
  ];

  return (
    <div className="flex flex-col gap-8 print:gap-0">
      <Sheet preview={preview}>
        <p className="absolute right-12 top-9 text-[11px]">
          Sl. No. <span className="border-b border-dashed border-gray-700 pb-px font-semibold">{serial || ' '}</span>
        </p>

        <header className="mt-9 flex items-start gap-6">
          <div className="w-[190px] shrink-0">
            <img src={duroplyLogo} alt="Duroply" className="h-12 w-auto" />
          </div>
          <div className="flex-1 text-[11px] leading-[16px] text-gray-800">
            <p className="text-[19px] font-bold leading-[26px] text-[#d71920]">{COMPANY.name}</p>
            <p className="mt-1">{COMPANY.address}</p>
            <p>{COMPANY.phone}</p>
            <p>E-mail: {COMPANY.email}</p>
            <p>CIN: {COMPANY.cin}</p>
          </div>
          <ForestFriendlyMark />
        </header>

        <div className="mt-6 space-y-3 text-[11.5px] leading-[17px]">
          <p>Dear Customer,</p>
          {program.intro.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p>For {COMPANY.name}</p>
        </div>
        <div className="mt-1 text-[11.5px] leading-[16px]">
          <img src={mdSignature} alt="" className="h-10 w-auto" />
          <p className="font-bold">{COMPANY.signatory}</p>
          <p className="italic">{COMPANY.signatoryTitle}</p>
        </div>

        <section className="mt-6 flex gap-8 text-[11.5px] leading-[17px]">
          <div className="flex-1 space-y-3">
            {groups.length === 0 ? (
              <p className="text-gray-400">Brands you pick will show here.</p>
            ) : (
              groups.map((g) => (
                <div key={g.label}>
                  <p className="font-bold uppercase">{g.label}</p>
                  <ul className="list-disc pl-5 uppercase">
                    {g.brands.map((brand) => (
                      <li key={brand}>{brand}</li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
          <div className="w-[300px] shrink-0">
            <p className="font-bold">Dealer’s Name</p>
            <p className="uppercase">{dealerName ? `${dealerName}${cert.dealer_code ? ` ( ${cert.dealer_code} )` : ''}` : '—'}</p>
            {cert.dealer_city && <p className="uppercase">{cert.dealer_city}</p>}

            <p className="mt-3.5 font-bold">Invoice Details</p>
            <InvoiceLine label="No:">{cert.invoice_no}</InvoiceLine>
            <InvoiceLine label="Date:">{certDate(cert.invoice_date)}</InvoiceLine>
            <p className="mt-1.5 flex items-baseline gap-1">
              <span className="w-[38px] shrink-0">Value:</span>
              <span className="min-w-[110px] border-b border-dashed border-gray-500 px-1">
                {cert.invoice_value ? `₹ ${Number(cert.invoice_value)}` : ' '}
              </span>
              <span>({program.invoiceNote})</span>
            </p>

            <p className="mt-3.5 font-bold">Date of issue</p>
            <p>{certDate(cert.issued_on)}</p>
          </div>
        </section>

        <p className="mt-auto border-b border-dashed border-gray-500 pb-0.5 text-[10.5px]">*T&amp;C Apply</p>

        <section className="mt-4 flex gap-8">
          <div className="flex-1">
            <img src={duroplyLogo} alt="Duroply" className="h-6 w-auto" />
            <div className={`mt-2 grid gap-6 ${hasType ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {hasType && (
                <div>
                  <p className="mb-1.5 text-[15px] font-bold">{customerTypeLabel(cert.customer_type)}’s Detail</p>
                  <ConsumerRows rows={personRows('type_')} />
                </div>
              )}
              <div>
                <p className="mb-1.5 text-[15px] font-bold">Consumer’s Detail</p>
                <ConsumerRows rows={personRows('')} />
              </div>
            </div>
          </div>
          <div className="w-[230px] shrink-0 text-right">
            <p className="text-[15px] font-bold leading-[19px]">
              Dealer’s Seal with
              <br />
              Signature
            </p>
            <p className="mt-14 text-[11px]">for {dealerName || '—'}</p>
          </div>
        </section>
      </Sheet>

      {termsSheet && (
        <>
          <Sheet preview={preview}>
            <SheetHeader serial={serial} cert={cert} />
            <h2 className="mt-7 text-[15px] font-bold">Terms and Conditions</h2>
            <div className="mt-5">
              {program.terms[0].map((section) => (
                <TermSection key={section.title} section={section} />
              ))}
            </div>
          </Sheet>

          <Sheet preview={preview}>
            <div className="mt-2">
              {program.terms[1].map((section) => (
                <TermSection key={section.title || section.items[0]} section={section} />
              ))}
            </div>
          </Sheet>

          <Sheet preview={preview}>
            <SheetHeader serial={serial} cert={cert} />
            <h2 className="mt-8 text-center text-[16px] font-bold">ANNEXURE A</h2>
            <table className="mt-6 w-full border-collapse border-2 border-gray-600 text-[11.5px] leading-[17px]">
              <thead>
                <tr className="font-bold">
                  {['S.N.', 'Brand', 'Guarantee / Warranty', 'Money Back Policy'].map((head) => (
                    <th key={head} className="border-2 border-gray-600 px-3 py-1.5 text-left">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.sn}>
                    <td className="w-[60px] border-2 border-gray-600 px-3 py-1.5">{row.sn}</td>
                    <td className="border-2 border-gray-600 px-3 py-1.5">{row.brand.toUpperCase()}</td>
                    <td className="border-2 border-gray-600 px-3 py-1.5">{annexureTermLabel(row)}</td>
                    <td className="border-2 border-gray-600 px-3 py-1.5">{row.back}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Sheet>
        </>
      )}
    </div>
  );
}

/**
 * The sheets of a certificate. Every new certificate is a Duro Guarantee
 * Certificate. `cert` fields match warranty_certificates, plus `items`
 * ([{ brand, term_years }]) and `issued_on` (date of issue). `preview` marks
 * it as a draft with no serial number yet. A Tower Warranty issued before
 * this change keeps its own layout and wording.
 */
export function CertificateSheets({ cert, preview = false, termsSheet = true }) {
  if (cert.program === 'TOWER_WARRANTY') return <LegacyTowerSheets cert={cert} preview={preview} termsSheet={termsSheet} />;
  return <DuroSheets cert={cert} preview={preview} termsSheet={termsSheet} />;
}

// First sheet only, scaled down to the width of its box (live preview).
export function CertificateThumbnail({ cert, preview = true }) {
  const boxRef = useRef(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return undefined;
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / SHEET_W));
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={boxRef} className="relative w-full overflow-hidden rounded-xl ring-1 ring-gray-200" style={{ height: SHEET_H * scale }}>
      <div className="absolute left-0 top-0 origin-top-left [&_.cert-sheet]:shadow-none" style={{ transform: `scale(${scale})` }}>
        <CertificateSheets cert={cert} preview={preview} termsSheet={false} />
      </div>
    </div>
  );
}
