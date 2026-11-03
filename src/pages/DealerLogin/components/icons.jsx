// Icons used only on the Dealer login page. Plain inline SVGs, copied from
// the original shared Login page so the design matches it.

export function MailIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]" aria-hidden="true">
      <rect x="2.5" y="4.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 5.5l7 5.5 7-5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]" aria-hidden="true">
      <rect x="4" y="8.5" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.5 8.5V6a3.5 3.5 0 0 1 7 0v2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Three stacked layers — a direct, literal nod to DUROPLY's 3-ply plywood
// construction, standing in for "Premium Quality" in the brand feature row.
export function LayersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M12 3.5 21 8l-9 4.5L3 8l9-4.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M3 12l9 4.5 9-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 16l9 4.5 9-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M12 3l7.5 2.7v5.3c0 4.8-3.2 8.3-7.5 10-4.3-1.7-7.5-5.2-7.5-10V5.7L12 3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M8.7 12.2l2.1 2.1 4.3-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HandshakeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M2.5 11.5 6 8.2c.6-.55 1.5-.55 2.1.05l1.2 1.2M21.5 11.5 18 8.2c-.6-.55-1.5-.55-2.1.05l-1.2 1.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.3 9.45l3.1 3c.5.5.5 1.3 0 1.8l-.3.3a1.3 1.3 0 0 1-1.8 0l-.3-.3M12.4 12.45l1.9 1.85c.5.5.5 1.3 0 1.8-.5.5-1.3.5-1.8 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M2.5 11.5l2.3 5.2c.4.9 1.5 1.2 2.3.7l1.1-.7M21.5 11.5l-2.3 5.2c-.4.9-1.5 1.2-2.3.7l-.8-.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GrowthIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M3.5 19.5h17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <rect x="5.5" y="14" width="3" height="5.5" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
      <rect x="10.5" y="10.5" width="3" height="9" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
      <rect x="15.5" y="6.5" width="3" height="13" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M14.5 4.5h4.5V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 4.5 12.5 11 9 8l-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
