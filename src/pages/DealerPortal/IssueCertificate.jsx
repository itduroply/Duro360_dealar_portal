import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Button from '../../components/common/Button.jsx';
import TextInput from '../../components/common/TextInput.jsx';
import Select from '../../components/common/Select.jsx';
import Alert from '../../components/common/Alert.jsx';
import { NAV_ICONS } from '../../components/Sidebar/navIcons.jsx';
import { CHECKBOX, LABEL } from '../../components/common/formStyles.js';
import { warrantyApi } from '../../api/warrantyApi';
import { todayIso } from '../../utils/schemes.js';
import {
  CUSTOMER_TYPES, DOC_MAX_BYTES, DOC_TYPES, INDIAN_STATES, PROGRAMS, customerTypeLabel, invoiceDateRange, termLabel,
} from '../../utils/warranty.js';
import { formatDate } from '../../utils/format.js';
import { CertificateThumbnail } from '../Warranty/CertificateDocument.jsx';
import { useDealerPortal } from './useDealerPortal.js';

const emptyForm = () => ({
  customer_type: 'CONSUMER',
  type_name: '', type_address1: '', type_address2: '', type_address3: '', type_city: '', type_state: '', type_pin: '',
  type_mobile: '', type_email: '',
  customer_name: '', mobile: '', email: '', address1: '', address2: '', address3: '', city: '', state: '', pin: '',
  invoice_no: '', invoice_date: todayIso(), invoice_value: '',
});

// There is one certificate type now: Duro Guarantee. Tower Warranty is no
// longer issued from the portal.
const PROGRAM = 'DURO_GUARANTEE';

function CheckIcon({ className = 'h-3 w-3' }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M4.5 10.5l3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M12 15.5V4.5M7.5 9L12 4.5 16.5 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 15v2.5a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

// One group per term ("LIFETIME GUARANTEE", "21 YEARS GUARANTEE"), with a
// tile per brand. Groups keep the brand list's order, as on the old portal.
function BrandPicker({ products, selected, onToggle }) {
  const groups = [];
  for (const p of products.filter((x) => x.program === PROGRAM)) {
    const label = termLabel(p.term_years);
    let g = groups.find((x) => x.label === label);
    if (!g) groups.push((g = { label, items: [] }));
    g.items.push(p);
  }
  if (groups.length === 0) return null;
  return (
    <div className="flex flex-col gap-6">
      {groups.map((g) => (
        <div key={g.label}>
          <div className="mb-3 flex items-center gap-3">
            <p className="text-theme-xs font-semibold uppercase tracking-wider text-gray-500">{g.label} Guarantee</p>
            <span className="h-px flex-1 bg-gray-100" aria-hidden="true" />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {g.items.map((p) => {
              const checked = selected.includes(p.id);
              return (
                <label
                  key={p.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-theme-sm font-medium uppercase transition-all ${
                    checked
                      ? 'border-brand-500 bg-brand-25 text-gray-900 ring-1 ring-brand-500'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-25'
                  }`}
                >
                  <input type="checkbox" checked={checked} onChange={() => onToggle(p.id)} className={CHECKBOX} />
                  {p.brand}
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function sizeLabel(bytes) {
  return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// Drop zone for one document. Accepts PDF, JPG, PNG or GIF up to 5 MB.
function FileDrop({ id, label, hint, note, required = true, file, onChange, error: missing }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  function take(next) {
    if (!next) return;
    if (!DOC_TYPES.split(',').includes(next.type)) return setError('Use a PDF, JPG, PNG or GIF file.');
    if (next.size > DOC_MAX_BYTES) return setError('The file must be 5 MB or smaller.');
    setError('');
    onChange(next);
  }

  return (
    <div id={`${id}-box`} className="scroll-mt-24">
      <p className={LABEL}>
        {required ? (
          <Req>{label}</Req>
        ) : (
          <>
            {label} <span className="font-normal text-gray-400">(optional)</span>
          </>
        )}
      </p>
      {file ? (
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-success-600 ring-1 ring-gray-200">
            <CheckIcon className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-theme-sm font-medium text-gray-800">{file.name}</p>
            <p className="text-theme-xs text-gray-500">{sizeLabel(file.size)}</p>
          </div>
          <button type="button" onClick={() => onChange(null)} className="text-theme-xs font-medium text-gray-500 hover:text-error-600">
            Remove
          </button>
        </div>
      ) : (
        <label
          htmlFor={id}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            take(e.dataTransfer.files?.[0]);
          }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-6 text-center transition-colors ${
            dragging
              ? 'border-brand-400 bg-brand-25'
              : missing
                ? 'border-error-300 bg-error-25'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-25'
          }`}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
            <UploadIcon />
          </span>
          <span className="text-theme-sm text-gray-700">
            <span className="font-medium text-brand-500">Choose a file</span> or drop it here
          </span>
          <span className="text-theme-xs text-gray-400">{hint}</span>
        </label>
      )}
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={DOC_TYPES}
        className="sr-only"
        onChange={(e) => {
          take(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      {note && <p className="mt-1.5 text-theme-xs font-medium text-gray-600">{note}</p>}
      {(error || missing) && <p className="mt-1.5 text-theme-xs text-error-500">{error || missing}</p>}
    </div>
  );
}

function SubmittedCard({ program, onAnother }) {
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center sm:px-10">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-50 text-success-600 ring-8 ring-success-50/50">
        <CheckIcon className="h-6 w-6" />
      </span>
      <h3 className="mt-5 text-xl font-semibold text-gray-800">Sent for approval</h3>
      <p className="mt-2 text-theme-sm text-gray-500">
        The Duro team will check the details and give the {program.certificate} a serial number. You can print it from
        Duro Certificates once it is issued.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button variant="secondary" onClick={() => navigate('/dealer/warranty')}>
          View certificates
        </Button>
        <Button onClick={onAnother}>Register another purchase</Button>
      </div>
    </div>
  );
}


// Label text with a red * for a required field.
function Req({ children }) {
  return (
    <>
      {children} <span className="text-error-500">*</span>
    </>
  );
}

const MOBILE_RE = /^[6-9]\d{9}$/;
const PIN_RE = /^[1-9]\d{5}$/;
const EMAIL_RE = /^\S+@\S+\.\S+$/;

const SECTIONS = [
  { n: 1, id: 'sec-brands', icon: 'schemes', title: 'Brands sold', hint: 'Pick every Duro brand on this invoice.' },
  { n: 2, id: 'sec-type', icon: 'users', title: 'Customer type', hint: 'Who is buying from you.' },
  { n: 3, id: 'sec-consumer', icon: 'profile', title: 'Consumer’s detail', hint: 'The consumer named on your invoice.' },
  { n: 4, id: 'sec-dealer', icon: 'invoices', title: 'Dealer’s detail', hint: 'Your invoice to this consumer.' },
];

// Every check on the form, in screen order: key -> [section, short name,
// element to scroll to when it is the first problem].
const FIELD_INFO = {
  brands: [1, 'Brands', 'sec-brands'],
  type_name: [2, 'Name', 'w-type_name'],
  type_address1: [2, 'Address1', 'w-type_address1'],
  type_city: [2, 'City', 'w-type_city'],
  type_state: [2, 'State', 'w-type_state'],
  type_pin: [2, 'PIN', 'w-type_pin'],
  type_mobile: [2, 'Mobile No.', 'w-type_mobile'],
  type_email: [2, 'Email ID', 'w-type_email'],
  customer_name: [3, 'Name', 'w-customer_name'],
  address1: [3, 'Address1', 'w-address1'],
  city: [3, 'City', 'w-city'],
  state: [3, 'State', 'w-state'],
  pin: [3, 'PIN', 'w-pin'],
  mobile: [3, 'Mobile No.', 'w-mobile'],
  email: [3, 'Email ID', 'w-email'],
  invoiceFile: [3, 'Upload Invoice', 'w-invoicefile-box'],
  invoice_no: [4, 'Invoice No.', 'w-invoice_no'],
  invoice_date: [4, 'Invoice Date', 'w-invoice_date'],
  invoice_value: [4, 'Invoice Value', 'w-invoice_value'],
};

function findErrors({ productIds, form, invoiceFile, range }) {
  const e = {};
  if (productIds.length === 0) e.brands = 'Pick at least one brand.';
  if (form.customer_type !== 'CONSUMER') {
    if (!form.type_name.trim()) e.type_name = 'Enter the name.';
    if (!form.type_address1.trim()) e.type_address1 = 'Enter the address.';
    if (!form.type_city.trim()) e.type_city = 'Enter the city.';
    if (!form.type_state) e.type_state = 'Select the state.';
    if (!form.type_pin) e.type_pin = 'Enter the PIN code.';
    else if (!PIN_RE.test(form.type_pin)) e.type_pin = 'Enter a 6-digit PIN code.';
    if (!form.type_mobile) e.type_mobile = 'Enter the mobile number.';
    else if (!MOBILE_RE.test(form.type_mobile)) e.type_mobile = 'Enter a 10-digit mobile number.';
    if (!form.type_email) e.type_email = 'Enter the email ID.';
    else if (!EMAIL_RE.test(form.type_email)) e.type_email = 'Enter a valid email ID.';
  }
  if (!form.customer_name.trim()) e.customer_name = 'Enter the name.';
  if (!form.address1.trim()) e.address1 = 'Enter the address.';
  if (!form.city.trim()) e.city = 'Enter the city.';
  if (!form.state) e.state = 'Select the state.';
  if (!form.pin) e.pin = 'Enter the PIN code.';
  else if (!PIN_RE.test(form.pin)) e.pin = 'Enter a 6-digit PIN code.';
  if (!form.mobile) e.mobile = 'Enter the mobile number.';
  else if (!MOBILE_RE.test(form.mobile)) e.mobile = 'Enter a 10-digit mobile number.';
  if (!form.email) e.email = 'Enter the email ID.';
  else if (!EMAIL_RE.test(form.email)) e.email = 'Enter a valid email ID.';
  if (!invoiceFile) e.invoiceFile = 'Upload the invoice.';
  if (!form.invoice_no.trim()) e.invoice_no = 'Enter the invoice number.';
  if (!form.invoice_date) e.invoice_date = 'Enter the invoice date.';
  else if (form.invoice_date < range.min || form.invoice_date > range.max) e.invoice_date = 'The invoice must be dated within the last 1 month.';
  if (!(Number(form.invoice_value) > 0)) e.invoice_value = 'Enter the invoice value.';
  return e;
}

// Steps across the top: done (green tick), the next one to fill (blue), still
// to do (gray), joined by a line that turns green once a step is done.
// Clicking a step jumps to it.
function Stepper({ step, isDone, onGo }) {
  return (
    <ol className="flex items-start">
      {SECTIONS.map((s, i) => {
        const Icon = NAV_ICONS[s.icon];
        const done = isDone(i) && i !== step;
        const current = i === step;
        return (
          <li key={s.id} className="relative flex flex-1 flex-col items-center">
            {i < SECTIONS.length - 1 && (
              <span className="absolute left-1/2 top-[18px] h-0.5 w-full bg-gray-200" aria-hidden="true">
                <span className={`block h-full bg-success-500 transition-all duration-300 ${isDone(i) ? 'w-full' : 'w-0'}`} />
              </span>
            )}
            <button
              type="button"
              onClick={() => onGo(i)}
              aria-current={current ? 'step' : undefined}
              className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full transition-all [&_svg]:h-[18px] [&_svg]:w-[18px] ${
                done
                  ? 'bg-success-500 text-white'
                  : current
                    ? 'bg-brand-500 text-white ring-4 ring-brand-100'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              {done ? <CheckIcon className="h-4 w-4" /> : Icon && <Icon />}
            </button>
            <span
              className={`mt-2.5 px-1 text-center text-theme-xs font-medium ${
                current ? 'text-gray-800' : done ? 'text-gray-600' : 'text-gray-400'
              }`}
            >
              {s.title}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

// One part of the form, under its own heading.
function FormSection({ section, missing, children }) {
  return (
    <section id={section.id} className="scroll-mt-52 border-t border-gray-100 px-5 py-7 sm:px-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-theme-sm font-semibold text-brand-600 ring-1 ring-brand-100">
            {section.n}
          </span>
          <div>
            <h3 className="text-base font-semibold text-gray-900">{section.title}</h3>
            <p className="text-theme-xs text-gray-500">{section.hint}</p>
          </div>
        </div>
        {missing.length > 0 && <p className="text-theme-xs font-medium text-error-600">Please complete: {missing.join(', ')}</p>}
      </div>
      {children}
    </section>
  );
}

// Dealer registers a customer's purchase for a Duro Guarantee or Tower
// Warranty certificate (manual, "Registration Process"). All steps are on
// one page; the steps across the top show progress and jump to a step.
// The certificate is valid only after the Duro team approves it and it
// gets a serial number.
export default function IssueCertificate() {
  const { dealer } = useDealerPortal();
  const [products, setProducts] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [productIds, setProductIds] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [idProof, setIdProof] = useState(null);
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  // A field's error shows once the field is left, or for every field after a submit attempt.
  const [visited, setVisited] = useState({});
  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    warrantyApi
      .listProducts()
      .then(setProducts)
      .catch((err) => setLoadError(err.message || 'Could not load the brand list.'));
  }, []);

  const range = invoiceDateRange();
  const errors = findErrors({ productIds, form, invoiceFile, range });
  const stepKeys = (i) => Object.keys(FIELD_INFO).filter((k) => FIELD_INFO[k][0] === i + 1 && errors[k]);
  const isDone = (i) => stepKeys(i).length === 0;
  const shown = (key) => ((attempted || visited[key]) && errors[key]) || '';
  const missing = (i) => (attempted ? stepKeys(i).map((k) => FIELD_INFO[k][1]) : []);
  // The step to work on next: the first one not complete.
  const activeStep = Math.max(0, SECTIONS.findIndex((_, i) => !isDone(i)));
  const allDone = SECTIONS.every((_, i) => isDone(i));

  const meta = PROGRAMS[PROGRAM];
  const preview = useMemo(
    () => ({
      ...form,
      program: PROGRAM,
      dealer_name: dealer.name,
      dealer_code: dealer.code,
      items: products.filter((p) => productIds.includes(p.id)),
      issued_on: todayIso(),
    }),
    [form, dealer.name, dealer.code, products, productIds]
  );

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const digits = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value.replace(/\D/g, '') }));
  const leave = (key) => () => setVisited((v) => ({ ...v, [key]: true }));

  // Shared props for a text field.
  const field = (key, label, required = true) => ({
    id: `w-${key}`,
    label: required ? <Req>{label}</Req> : label,
    value: form[key],
    onChange: set(key),
    onBlur: leave(key),
    error: shown(key),
  });

  // State dropdown. `key` is 'state' or 'type_state'.
  const stateSelect = (key) => (
    <div className="mb-4">
      <Select
        id={`w-${key}`}
        label={<Req>State</Req>}
        value={form[key]}
        onChange={set(key)}
        onBlur={leave(key)}
        className={shown(key) ? '!border-error-300' : ''}
      >
        <option value="">--Please Select State--</option>
        {INDIAN_STATES.map((name) => (
          <option key={name}>{name}</option>
        ))}
      </Select>
      {shown(key) && <p className="mt-1.5 text-theme-xs text-error-500">{shown(key)}</p>}
    </div>
  );

  const toggleProduct = (id) => setProductIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  function scrollTo(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (el.tagName === 'INPUT' || el.tagName === 'SELECT') el.focus({ preventScroll: true });
  }

  function reset() {
    setProductIds([]);
    setForm(emptyForm());
    setIdProof(null);
    setInvoiceFile(null);
    setConfirmed(false);
    setVisited({});
    setAttempted(false);
    setError('');
    setSubmitted(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setAttempted(true);
    const first = Object.keys(FIELD_INFO).find((k) => errors[k]);
    if (first) {
      setError('');
      scrollTo(FIELD_INFO[first][2]);
      return;
    }
    if (!confirmed) {
      setError('Tick the box to confirm the details match your invoice.');
      return;
    }
    setIsSaving(true);
    setError('');
    try {
      await warrantyApi.submit({
        ...form,
        program: PROGRAM,
        invoice_value: Number(form.invoice_value),
        productIds,
        dealerCode: dealer.code,
        idProofFile: idProof,
        invoiceFile,
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Could not submit this registration.');
    } finally {
      setIsSaving(false);
    }
  }

  const missingTotal = Object.keys(errors).length;

  return (
    <div>
      <PageHeader
        title="Register a Purchase"
        description="Create a Duro Guarantee certificate for your customer, within 1 month of your invoice."
      />

      {submitted ? (
        <SubmittedCard program={meta} onAnother={reset} />
      ) : (
        <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex min-w-0 flex-col gap-5">
            <div className="z-20 rounded-2xl border border-gray-200 bg-white px-4 py-5 sm:px-8 lg:sticky lg:top-[92px]">
              <Stepper step={allDone ? -1 : activeStep} isDone={isDone} onGo={(i) => scrollTo(SECTIONS[i].id)} />
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-gray-100 bg-gradient-to-r from-brand-25 to-white px-5 py-5 sm:px-8">
                <div className="flex items-center gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 shadow-theme-xs ring-1 ring-brand-100 [&_svg]:h-[22px] [&_svg]:w-[22px]">
                    {NAV_ICONS.warranty && <NAV_ICONS.warranty />}
                  </span>
                  <div>
                    <p className="text-theme-xs font-medium uppercase tracking-wider text-gray-500">Certificate Type</p>
                    <p className="text-lg font-semibold leading-6 text-gray-900">{meta.name}</p>
                  </div>
                </div>
                <p className="text-theme-xs text-gray-500">
                  Fields marked <span className="text-error-500">*</span> are required.
                </p>
              </div>

              {loadError && (
                <div className="px-5 pt-5 sm:px-8">
                  <Alert variant="error">{loadError}</Alert>
                </div>
              )}

              <FormSection section={SECTIONS[0]} missing={missing(0)}>
                <BrandPicker products={products} selected={productIds} onToggle={toggleProduct} />
                {shown('brands') && <p className="mt-3 text-theme-xs text-error-500">{shown('brands')}</p>}
              </FormSection>

              <FormSection section={SECTIONS[1]} missing={missing(1)}>
                <div className="max-w-sm">
                  <Select id="w-customer_type" label={<Req>Type</Req>} value={form.customer_type} onChange={set('customer_type')}>
                    {CUSTOMER_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </Select>
                </div>

                {form.customer_type !== 'CONSUMER' && (
                  <div className="mt-5 rounded-xl border border-gray-200 bg-gray-25 px-4 pt-4 sm:px-5">
                    <p className="mb-3 text-theme-sm font-semibold text-gray-800">{customerTypeLabel(form.customer_type)}’s Details</p>
                    <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <TextInput {...field('type_name', 'Name')} />
                      </div>
                      <div className="sm:col-span-2">
                        <TextInput {...field('type_address1', 'Address1')} maxLength={40} />
                      </div>
                      <TextInput {...field('type_address2', 'Address2', false)} maxLength={40} />
                      <TextInput {...field('type_address3', 'Address3', false)} maxLength={40} />
                      <TextInput {...field('type_city', 'City')} />
                      {stateSelect('type_state')}
                      <TextInput {...field('type_pin', 'PIN')} onChange={digits('type_pin')} inputMode="numeric" maxLength={6} />
                      <TextInput {...field('type_mobile', 'Mobile No.')} onChange={digits('type_mobile')} inputMode="numeric" maxLength={10} />
                      <TextInput {...field('type_email', 'Email ID')} type="email" />
                    </div>
                  </div>
                )}
              </FormSection>

              <FormSection section={SECTIONS[2]} missing={missing(2)}>
                <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <TextInput {...field('customer_name', 'Name')} />
                  </div>
                  <div className="sm:col-span-2">
                    <TextInput {...field('address1', 'Address1')} maxLength={40} />
                  </div>
                  <TextInput {...field('address2', 'Address2', false)} maxLength={40} />
                  <TextInput {...field('address3', 'Address3', false)} maxLength={40} />
                  <TextInput {...field('city', 'City')} />
                  {stateSelect('state')}
                  <TextInput {...field('pin', 'PIN')} onChange={digits('pin')} inputMode="numeric" maxLength={6} />
                  <TextInput {...field('mobile', 'Mobile No.')} onChange={digits('mobile')} inputMode="numeric" maxLength={10} />
                  <TextInput {...field('email', 'Email ID')} type="email" />
                </div>
                <div className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FileDrop
                    id="w-invoicefile"
                    label="Upload Invoice"
                    hint="Allowed file types .pdf, .jpg, .jpeg, .png, .gif"
                    file={invoiceFile}
                    onChange={setInvoiceFile}
                    error={shown('invoiceFile')}
                  />
                  <FileDrop
                    id="w-idproof"
                    label="ID Proof"
                    hint="Allowed file types .pdf, .jpg, .jpeg, .png, .gif"
                    note="Upload a masked Aadhaar, or hide the first 8 digits of the Aadhaar number when you upload the scanned copy of the Aadhaar card."
                    required={false}
                    file={idProof}
                    onChange={setIdProof}
                  />
                </div>
                <dl className="mt-5 flex items-baseline gap-3 text-theme-sm">
                  <dt className="text-gray-500">Date of issue</dt>
                  <dd className="font-medium text-gray-800">{formatDate(todayIso())}</dd>
                </dl>
              </FormSection>

              <FormSection section={SECTIONS[3]} missing={missing(3)}>
                <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-3">
                  <TextInput {...field('invoice_no', 'Dealer’s Invoice No.')} />
                  <TextInput {...field('invoice_date', 'Invoice Date')} type="date" min={range.min} max={range.max} />
                  <div>
                    <TextInput {...field('invoice_value', 'Invoice Value')} type="number" min="1" step="0.01" />
                    {meta?.invoiceNote && <p className="-mt-3 mb-4 text-theme-xs text-gray-500">({meta.invoiceNote})</p>}
                  </div>
                </div>
                <dl className="flex items-baseline gap-3 text-theme-sm">
                  <dt className="text-gray-500">Name</dt>
                  <dd className="font-medium text-gray-800">{dealer.name || '—'}</dd>
                </dl>
              </FormSection>

              <div className="flex flex-col gap-4 border-t border-gray-100 bg-gray-25 px-5 py-5 sm:px-7">
                <label className="flex cursor-pointer items-start gap-3 text-theme-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => {
                      setConfirmed(e.target.checked);
                      if (e.target.checked) setError('');
                    }}
                    className={`${CHECKBOX} mt-0.5`}
                  />
                  <span>
                    I confirm these details match my invoice to the customer. <span className="text-error-500">*</span>
                  </span>
                </label>
                {attempted && missingTotal > 0 && (
                  <p className="rounded-lg bg-error-50 px-3.5 py-2.5 text-theme-sm text-error-700">
                    {missingTotal} {missingTotal === 1 ? 'field needs' : 'fields need'} your attention. They are marked in red.
                  </p>
                )}
                {error && <Alert variant="error">{error}</Alert>}
                <div className="flex justify-end">
                  <Button type="submit" isLoading={isSaving} className="w-full sm:w-auto">
                    Submit for approval
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <aside className="xl:sticky xl:top-[92px] xl:self-start">
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-800">Live preview</h3>
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-theme-xs font-medium text-gray-500">Draft</span>
              </div>
              <CertificateThumbnail cert={preview} />
              <p className="mt-4 text-theme-xs leading-5 text-gray-500">
                The serial number is given after the Duro team approves the details. A certificate without it is not valid.
              </p>
            </div>
          </aside>
        </form>
      )}
    </div>
  );
}
