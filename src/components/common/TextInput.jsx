import { LABEL, INPUT, INPUT_OK, INPUT_ERROR, HINT_ERROR } from './formStyles.js';

export default function TextInput({ label, id, error, icon, variant = 'boxed', className = '', labelClassName = '', ...props }) {
  const fieldClasses =
    variant === 'underline'
      ? `w-full border-0 border-b bg-transparent px-0.5 pb-2 text-sm text-gray-800 transition-colors duration-150 focus:outline-none focus:ring-0 ${
          icon ? 'pl-7' : ''
        } ${error ? 'border-error-300' : 'border-gray-300 focus:border-brand-500'}`
      : `${INPUT} ${icon ? 'pl-11' : ''} ${error ? INPUT_ERROR : INPUT_OK}`;

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className={`${LABEL} ${labelClassName}`}>
          {label}
        </label>
      )}
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
        <input id={id} className={`${fieldClasses} ${className}`} {...props} />
      </div>
      {error && <p className={HINT_ERROR}>{error}</p>}
    </div>
  );
}
