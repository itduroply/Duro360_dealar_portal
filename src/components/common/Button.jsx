// TailAdmin button. `primary` is the filled brand button, `secondary` the
// white outline button used for Filter / See all / Cancel.
export default function Button({ children, isLoading, variant = 'primary', size = 'md', className = '', ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium shadow-theme-xs transition-colors focus:outline-none focus:ring-3 disabled:cursor-not-allowed';
  const sizes = {
    sm: 'px-3.5 py-2 text-theme-sm',
    md: 'px-4 py-3 text-sm',
  };
  const variants = {
    primary: 'bg-brand-500 text-white hover:bg-brand-600 focus:ring-brand-500/20 disabled:bg-brand-300',
    secondary:
      'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:text-gray-800 focus:ring-gray-500/10 disabled:opacity-50',
    danger: 'bg-error-500 text-white hover:bg-error-600 focus:ring-error-500/20 disabled:bg-error-300',
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? 'Please wait…' : children}
    </button>
  );
}
