/** Small "New" pill with a light sweeping across it (same as the Console's). */
export default function NewBadge({ className = '' }) {
  return (
    <span className={`relative inline-flex shrink-0 items-center overflow-hidden rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white ${className}`}>
      <span
        className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,0.55)_50%,transparent_65%)] bg-[length:200%_100%]"
        aria-hidden="true"
      />
      <span className="relative">New</span>
    </span>
  );
}
