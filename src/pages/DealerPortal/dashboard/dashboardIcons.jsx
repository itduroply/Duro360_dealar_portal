// Small line icons used only on the Super Admin dashboard.
const base = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export function GiftIcon({ className = 'h-6 w-6' }) {
  return (
    <svg {...base} className={className}>
      <rect x="3.5" y="8" width="17" height="4" rx="1" />
      <path d="M5 12v8h14v-8M12 8v12" />
      <path d="M12 8C10.5 5 7 4.5 7 6.5S10 8 12 8Zm0 0c1.5-3 5-3.5 5-1.5S14 8 12 8Z" />
    </svg>
  );
}

export function TagIcon({ className = 'h-6 w-6' }) {
  return (
    <svg {...base} className={className}>
      <path d="M3.5 12.5V4.5a1 1 0 0 1 1-1h8l8 8-9 9-8-8Z" />
      <circle cx="8.5" cy="8.5" r="1.4" />
      <path d="M10 15l5-5M10.5 11h.01M14.5 14h.01" />
    </svg>
  );
}

export function StarBadgeIcon({ className = 'h-6 w-6' }) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5l1.3 2.8 3 .3-2.3 2 .7 3-2.7-1.6-2.7 1.6.7-3-2.3-2 3-.3L12 7.5Z" />
    </svg>
  );
}

export function TrendIcon({ className = 'h-6 w-6' }) {
  return (
    <svg {...base} className={className}>
      <path d="M3.5 19.5h17" />
      <path d="M5 15l4.5-4.5 3.5 3L19 7.5" />
      <path d="M15 7.5h4v4" />
    </svg>
  );
}

export function UserPlusIcon({ className = 'h-6 w-6' }) {
  return (
    <svg {...base} className={className}>
      <circle cx="10" cy="8" r="3.5" />
      <path d="M3.5 19.5c.8-3.3 3.4-5 6.5-5s5.7 1.7 6.5 5M18.5 8v5M16 10.5h5" />
    </svg>
  );
}

export function UserCheckIcon({ className = 'h-6 w-6' }) {
  return (
    <svg {...base} className={className}>
      <circle cx="10" cy="8" r="3.5" />
      <path d="M3.5 19.5c.8-3.3 3.4-5 6.5-5 1.4 0 2.7.3 3.7 1M15.5 17.5l2 2 3.5-4" />
    </svg>
  );
}

export function PlusIcon({ className = 'h-5 w-5' }) {
  return (
    <svg {...base} className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function ChevronRightIcon({ className = 'h-4 w-4' }) {
  return (
    <svg {...base} className={className}>
      <path d="M9.5 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowRightIcon({ className = 'h-4 w-4' }) {
  return (
    <svg {...base} className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
