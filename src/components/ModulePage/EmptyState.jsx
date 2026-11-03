import { NAV_ICONS } from '../Sidebar/navIcons.jsx';

// Centered "nothing here yet" block: icon, one-line title, short hint.
export default function EmptyState({ icon, title, hint, action, compact = false }) {
  const Icon = icon ? NAV_ICONS[icon] : null;
  return (
    <div className={`flex flex-col items-center justify-center text-center ${compact ? 'px-4 py-8' : 'px-6 py-14'}`}>
      {Icon && (
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <Icon />
        </span>
      )}
      <p className="text-theme-sm font-medium text-gray-700">{title}</p>
      {hint && <p className="mt-1 max-w-xs text-theme-xs text-gray-500">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
