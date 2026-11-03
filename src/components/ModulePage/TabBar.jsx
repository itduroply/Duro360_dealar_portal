import { theme } from '../../theme/themes.js';

// Pill-style tab switcher (segmented control). Colours come from theme.ui.
// `icons` optionally maps a tab name to an icon component shown before it.
export default function TabBar({ tabs, active, onChange, icons = {} }) {
  return (
    <div className={`no-scrollbar flex max-w-full items-center overflow-x-auto ${theme.ui.tabTrack}`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`flex items-center gap-2 whitespace-nowrap text-theme-sm font-medium transition-colors ${theme.ui.tabButton} ${
            active === tab ? theme.ui.tabActive : theme.ui.tabIdle
          }`}
        >
          {icons[tab] && (() => {
            const Icon = icons[tab];
            return <Icon />;
          })()}
          {tab}
        </button>
      ))}
    </div>
  );
}
