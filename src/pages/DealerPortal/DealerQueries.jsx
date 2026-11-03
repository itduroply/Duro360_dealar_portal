import { useState } from 'react';
import ModulePage, { KpiStrip, TabBar, StatusChip } from '../../components/ModulePage/ModulePage.jsx';
import EmptyState from '../../components/ModulePage/EmptyState.jsx';
import Button from '../../components/common/Button.jsx';
import Alert from '../../components/common/Alert.jsx';
import { LABEL } from '../../components/common/formStyles.js';
import { queriesApi } from '../../api/queriesApi';
import { formatCount } from '../../utils/format.js';
import { ChatComposer, ChatMessages, formatStamp } from '../../components/Queries/QueryChat.jsx';
import { useMyQueries } from './useMyQueries.js';

const TABS = ['All', 'Open', 'In Progress', 'Resolved', 'Closed'];
const RELATED = ['Order', 'Invoice', 'Payment', 'Scheme', 'Other'];
const FIELD =
  'w-full rounded-lg border border-gray-300 bg-white px-3.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10';

function Req({ children }) {
  return (
    <>
      {children} <span className="text-error-500">*</span>
    </>
  );
}

function QueryThread({ query, onChanged }) {
  const [isSending, setIsSending] = useState(false);

  async function send(text) {
    setIsSending(true);
    try {
      await queriesApi.reply(query.id, text);
      await onChanged();
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 bg-white px-5 py-4">
        <div className="min-w-0">
          <p className="text-theme-xs text-gray-500">
            {query.ticketNo} · {query.related}
            {query.reference && ` ${query.reference}`}
          </p>
          <h3 className="mt-0.5 text-base font-semibold text-gray-800">{query.subject}</h3>
        </div>
        <StatusChip status={query.status} />
      </header>
      <ChatMessages
        messages={query.thread}
        mine="DEALER"
        note={query.status === 'Resolved' && query.resolvedOn ? `Resolved on ${formatStamp(query.resolvedOn)}` : undefined}
      />
      {query.status === 'Closed' ? (
        <p className="border-t border-gray-100 bg-white px-5 py-4 text-theme-sm text-gray-500">This query is closed.</p>
      ) : (
        <ChatComposer
          onSend={send}
          isSending={isSending}
          placeholder={query.status === 'Resolved' ? 'Not resolved? Write here to open it again…' : 'Write a message…'}
        />
      )}
    </div>
  );
}

// New query.
function NewQueryForm({ onCancel, onRaised }) {
  const [form, setForm] = useState({ type: 'Query', related: RELATED[0], reference: '', subject: '', message: '' });
  const [attempted, setAttempted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const missing = {
    subject: !form.subject.trim() && 'Enter a subject.',
    message: !form.message.trim() && 'Enter your message.',
  };

  async function submit(e) {
    e.preventDefault();
    setAttempted(true);
    if (missing.subject || missing.message) return;
    setIsSaving(true);
    setError('');
    try {
      const id = await queriesApi.raise({ ...form, subject: form.subject.trim(), message: form.message.trim() });
      await onRaised(id);
    } catch (err) {
      setError(err.message || 'Could not send your query.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="flex h-full flex-col">
      <header className="border-b border-gray-100 px-5 py-4">
        <h3 className="text-base font-semibold text-gray-800">Raise a Query</h3>
        <p className="mt-0.5 text-theme-xs text-gray-500">Duroply will reply here. You can follow it until it is resolved.</p>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <p className="text-theme-xs text-gray-500">
          Fields marked <span className="text-error-500">*</span> are required.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="query-related" className={LABEL}>
              <Req>Related to</Req>
            </label>
            <select id="query-related" value={form.related} onChange={set('related')} className={`${FIELD} h-10 cursor-pointer`}>
              {RELATED.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="query-reference" className={LABEL}>
              Reference <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <input
              id="query-reference"
              value={form.reference}
              onChange={set('reference')}
              placeholder="Invoice no., scheme…"
              maxLength={60}
              className={`${FIELD} h-10`}
            />
          </div>
        </div>
        <div>
          <label htmlFor="query-subject" className={LABEL}>
            <Req>Subject</Req>
          </label>
          <input
            id="query-subject"
            value={form.subject}
            onChange={set('subject')}
            maxLength={120}
            className={`${FIELD} h-10 ${attempted && missing.subject ? '!border-error-300' : ''}`}
          />
          {attempted && missing.subject && <p className="mt-1.5 text-theme-xs text-error-500">{missing.subject}</p>}
        </div>
        <div>
          <label htmlFor="query-message" className={LABEL}>
            <Req>Message</Req>
          </label>
          <textarea
            id="query-message"
            rows={5}
            value={form.message}
            onChange={set('message')}
            className={`${FIELD} py-2.5 ${attempted && missing.message ? '!border-error-300' : ''}`}
          />
          {attempted && missing.message && <p className="mt-1.5 text-theme-xs text-error-500">{missing.message}</p>}
        </div>
        {error && <Alert variant="error">{error}</Alert>}
        <div className="mt-auto flex justify-end gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isSaving}>
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
}

// The Dealer's own queries: list on the left; the chosen
// query, or the new-query form, on the right. Replies and the status come
// from the Duro team, and refresh every 30 seconds.
export default function DealerQueries() {
  const { queries, isLoading, error, reload } = useMyQueries();
  const [tab, setTab] = useState('All');
  const [selectedId, setSelectedId] = useState(null);
  const [isComposing, setIsComposing] = useState(false);
  const has = queries.length > 0;
  const shown = queries.filter((q) => tab === 'All' || q.status === tab);
  const selected = queries.find((q) => q.id === selectedId) || (isComposing ? null : queries[0]);
  const count = (status) => (has ? formatCount(queries.filter((q) => q.status === status).length) : undefined);

  async function raised(id) {
    await reload();
    setSelectedId(id);
    setIsComposing(false);
    setTab('All');
  }

  return (
    <ModulePage title="Queries" description="Raise a query and follow it until it is resolved." live>
      {error && <Alert variant="error">{error}</Alert>}
      <KpiStrip
        items={[
          { label: 'Open', value: count('Open'), icon: 'queries', tone: 'warning' },
          { label: 'In Progress', value: count('In Progress'), icon: 'outstanding', tone: 'brand' },
          { label: 'Resolved', value: count('Resolved'), icon: 'auditLogs', tone: 'success' },
          { label: 'Total Raised', value: has ? formatCount(queries.length) : undefined, icon: 'documents', tone: 'gray' },
        ]}
      />
      <div className="grid min-h-[520px] grid-cols-1 overflow-hidden rounded-2xl border border-gray-200 bg-white lg:h-[680px] lg:grid-cols-5">
        <aside className="custom-scrollbar flex flex-col overflow-y-auto border-b border-gray-100 lg:col-span-2 lg:border-b-0 lg:border-r">
          <div className="flex flex-col gap-3 border-b border-gray-100 p-4">
            <Button size="sm" onClick={() => setIsComposing(true)}>
              + Raise Query
            </Button>
            <TabBar tabs={TABS} active={tab} onChange={setTab} />
          </div>
          {shown.length === 0 ? (
            <EmptyState
              compact
              icon="queries"
              title={isLoading ? 'Loading queries…' : has ? `No ${tab.toLowerCase()} queries` : 'No queries yet'}
              hint={isLoading || has ? undefined : 'Use Raise Query to ask Duroply a question.'}
            />
          ) : (
            <ul className="divide-y divide-gray-100">
              {shown.map((q) => {
                const isActive = !isComposing && q.id === selected?.id;
                return (
                  <li key={q.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(q.id);
                        setIsComposing(false);
                      }}
                      className={`flex w-full flex-col gap-1 border-l-2 px-4 py-3 text-left transition-colors ${
                        isActive ? 'border-brand-500 bg-brand-25' : 'border-transparent hover:bg-gray-50'
                      }`}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-theme-sm font-medium text-gray-800">{q.subject}</span>
                        <StatusChip status={q.status} />
                      </span>
                      <span className="flex items-center gap-2 text-theme-xs text-gray-400">
                        <span>{q.ticketNo}</span>·
                        <span>{formatStamp(q.raisedOn)}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>
        <div className="min-h-0 bg-white lg:col-span-3">
          {isComposing ? (
            <NewQueryForm onCancel={() => setIsComposing(false)} onRaised={raised} />
          ) : selected ? (
            <QueryThread key={selected.id} query={selected} onChanged={reload} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <EmptyState icon="queries" title="Select a query" hint="Open a query from the list, or raise a new one." />
            </div>
          )}
        </div>
      </div>
    </ModulePage>
  );
}
