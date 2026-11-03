// TailAdmin alert box for form and page messages.
const STYLES = {
  success: 'border-success-500 bg-success-50',
  error: 'border-error-500 bg-error-50',
  warning: 'border-warning-500 bg-warning-50',
  info: 'border-blue-light-500 bg-blue-light-50',
};

export default function Alert({ variant = 'info', children, className = '' }) {
  return (
    <div
      className={`rounded-xl border p-4 text-sm text-gray-700 ${STYLES[variant]} ${className}`}
      role={variant === 'error' || variant === 'warning' ? 'alert' : 'status'}
    >
      {children}
    </div>
  );
}
