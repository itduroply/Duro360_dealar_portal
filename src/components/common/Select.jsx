import { LABEL, INPUT, INPUT_OK } from './formStyles.js';

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// TailAdmin select: same box as TextInput, with its own chevron.
export default function Select({ label, id, children, className = '', wrapperClassName = '', ...props }) {
  return (
    <div className={wrapperClassName}>
      {label && (
        <label htmlFor={id} className={LABEL}>
          {label}
        </label>
      )}
      <div className="relative">
        <select id={id} className={`${INPUT} ${INPUT_OK} cursor-pointer appearance-none pr-11 ${className}`} {...props}>
          {children}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-500">
          <ChevronDownIcon />
        </span>
      </div>
    </div>
  );
}
