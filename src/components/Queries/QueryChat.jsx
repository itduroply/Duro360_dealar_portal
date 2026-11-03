import { useEffect, useRef, useState } from 'react';

// Chat pieces shared by the Dealer Portal's Queries page and the Console's.
// Times are shown in the viewer's own time zone (the database stores UTC).

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDay(iso) {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatClock(iso) {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
}

// "14 Oct 2026, 3:11 pm"
export function formatStamp(iso) {
  return `${formatDay(iso)}, ${formatClock(iso)}`;
}

function initials(name) {
  return (
    String(name || '?')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() || '?'
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" aria-hidden="true">
      <path d="M4 12L20 4l-5.5 16-3-6.5L4 12z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M11.5 13.5L20 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// Messages, oldest first, with a date divider between days. `mine` is the
// sender ('DEALER' or 'DUROPLY') whose messages sit on the right.
export function ChatMessages({ messages, mine, note }) {
  const endRef = useRef(null);
  const lastId = messages[messages.length - 1]?.id;

  // Show the newest message when the chat opens or a message arrives.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [lastId]);

  let day = '';
  return (
    <div className="custom-scrollbar flex-1 overflow-y-auto bg-gray-50/70 px-4 py-5 sm:px-6">
      <ol className="flex flex-col gap-3">
        {messages.map((m) => {
          const isMine = m.sender === mine;
          const label = formatDay(m.at);
          const showDay = label !== day;
          day = label;
          return (
            <li key={m.id} className="flex flex-col gap-3">
              {showDay && (
                <div className="flex items-center gap-3 py-1" role="separator">
                  <span className="h-px flex-1 bg-gray-200" />
                  <span className="rounded-full bg-white px-3 py-0.5 text-theme-xs font-medium text-gray-500 ring-1 ring-gray-200">{label}</span>
                  <span className="h-px flex-1 bg-gray-200" />
                </div>
              )}
              <div className={`flex items-end gap-2.5 ${isMine ? 'flex-row-reverse' : ''}`}>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                    isMine ? 'bg-brand-100 text-brand-700' : 'bg-gray-200 text-gray-600'
                  }`}
                  aria-hidden="true"
                >
                  {initials(m.from)}
                </span>
                <div className={`flex max-w-[78%] flex-col gap-1 ${isMine ? 'items-end' : 'items-start'}`}>
                  <span className="px-1 text-theme-xs font-medium text-gray-500">{isMine ? 'You' : m.from}</span>
                  <p
                    className={`w-fit whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-theme-sm leading-6 shadow-theme-xs ${
                      isMine ? 'rounded-br-md bg-brand-500 text-white' : 'rounded-bl-md bg-white text-gray-800 ring-1 ring-gray-200'
                    }`}
                  >
                    {m.text}
                  </p>
                  <span className="px-1 text-[11px] text-gray-400">{formatClock(m.at)}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      {note && <p className="mx-auto mt-5 w-fit rounded-full bg-white px-4 py-1.5 text-theme-xs font-medium text-gray-500 ring-1 ring-gray-200">{note}</p>}
      <div ref={endRef} />
    </div>
  );
}

// Message box: Enter sends, Shift+Enter adds a new line. `onSend` gets the
// text and may throw; the message shown is the error text.
export function ChatComposer({ onSend, placeholder, isSending }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  async function submit(e) {
    e?.preventDefault();
    if (!text.trim()) {
      setError('Write a message first.');
      return;
    }
    setError('');
    try {
      await onSend(text.trim());
      setText('');
    } catch (err) {
      setError(err.message || 'Could not send your message.');
    }
  }

  return (
    <form onSubmit={submit} className="border-t border-gray-100 bg-white px-4 py-3 sm:px-6">
      <div className="flex items-end gap-2 rounded-2xl border border-gray-300 bg-white py-1.5 pl-4 pr-1.5 shadow-theme-xs focus-within:border-brand-300 focus-within:ring-3 focus-within:ring-brand-500/10">
        <textarea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) submit(e);
          }}
          placeholder={placeholder}
          className="max-h-32 min-h-[36px] flex-1 resize-none bg-transparent py-1.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isSending}
          aria-label="Send"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-brand-300"
        >
          <SendIcon />
        </button>
      </div>
      <p className={`mt-1.5 px-1 text-theme-xs ${error ? 'text-error-500' : 'text-gray-400'}`}>{error || 'Press Enter to send, Shift+Enter for a new line.'}</p>
    </form>
  );
}
