import { LABEL, INPUT, INPUT_OK, INPUT_ERROR, HINT_ERROR } from './formStyles.js';
import { useState } from 'react';

function EyeIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]" aria-hidden="true">
      <path
        d="M1.5 10S4.5 4 10 4s8.5 6 8.5 6-3 6-8.5 6-8.5-6-8.5-6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]" aria-hidden="true">
      <path
        d="M2.5 2.5l15 15M8.35 8.4a2.25 2.25 0 0 0 3.18 3.2M6.1 6.13C3.6 7.65 1.5 10 1.5 10s3 6 8.5 6c1.6 0 3-.5 4.16-1.2M13.9 13.86C16.3 12.4 18.5 10 18.5 10s-1.1-2.2-3.15-3.86A9.4 9.4 0 0 0 10 4c-.6 0-1.18.05-1.75.15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PasswordInput({ label, id, error, icon, variant = 'boxed', className = '', labelClassName = '', ...props }) {
  const [visible, setVisible] = useState(false);

  const fieldClasses =
    variant === 'underline'
      ? `w-full border-0 border-b bg-transparent px-0.5 pb-2 pr-9 text-sm text-gray-800 transition-colors duration-150 focus:outline-none focus:ring-0 ${
          icon ? 'pl-7' : ''
        } ${error ? 'border-error-300' : 'border-gray-300 focus:border-brand-500'}`
      : `${INPUT} pr-11 ${icon ? 'pl-11' : ''} ${error ? INPUT_ERROR : INPUT_OK}`;

  return (
    <div className="mb-4">
      <label htmlFor={id} className={`${LABEL} ${labelClassName}`}>
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span
            className={`pointer-events-none absolute inset-y-0 left-0 flex items-center text-gray-500 ${
              variant === 'underline' ? '' : 'pl-4'
            }`}
          >
            {icon}
          </span>
        )}
        <input id={id} type={visible ? 'text' : 'password'} className={`${fieldClasses} ${className}`} {...props} />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className={`absolute inset-y-0 right-0 flex items-center text-gray-500 transition-colors hover:text-gray-700 ${
            variant === 'underline' ? 'px-1' : 'px-4'
          }`}
          tabIndex={-1}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      {error && <p className={HINT_ERROR}>{error}</p>}
    </div>
  );
}
