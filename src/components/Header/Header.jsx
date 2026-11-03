import { Link } from 'react-router-dom';
import { MenuIcon, CloseIcon } from '../common/icons.jsx';
import { NAV_ICONS } from '../Sidebar/navIcons.jsx';
import UserDropdown from './UserDropdown.jsx';
import HeaderSearch from './HeaderSearch.jsx';
import { theme } from '../../theme/themes.js';

/**
 * Top bar: sidebar toggle and console name on the left; page search, a
 * Notifications shortcut and the user menu on the right. Colours come from
 * theme.ui (src/theme/themes.js). Used by layouts/ConsoleLayout.jsx.
 */
export default function Header({ consoleLabel, profilePath, user, onLogout, onToggleSidebar, isSidebarOpen, navItems = [], basePath }) {
  const notifications = navItems.find((item) => item.key === 'notifications');
  const BellIcon = NAV_ICONS.notifications;

  return (
    <header className={`sticky top-0 z-30 flex w-full border-b ${theme.ui.headerBar}`}>
      <div className="relative flex grow items-center justify-between gap-4 px-3 py-3 sm:px-6 lg:py-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onToggleSidebar}
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors lg:h-11 lg:w-11 ${theme.ui.headerToggle}`}
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
          {theme.decor && <span className="hidden h-8 w-px bg-gray-200 sm:block" aria-hidden="true" />}
          <span className={`hidden max-w-[34vw] truncate sm:block ${theme.ui.headerLabel}`} title={consoleLabel}>
            {consoleLabel}
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <HeaderSearch navItems={navItems} basePath={basePath} />
          {notifications && (
            <Link
              to={`${basePath}/${notifications.path}`}
              className="flex h-11 w-11 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100"
              aria-label="Notifications"
              title="Notifications"
            >
              <BellIcon />
            </Link>
          )}
          <span className="hidden h-8 w-px bg-gray-200 sm:block" aria-hidden="true" />
          <UserDropdown user={user} onLogout={onLogout} profilePath={profilePath} />
        </div>
      </div>
    </header>
  );
}
