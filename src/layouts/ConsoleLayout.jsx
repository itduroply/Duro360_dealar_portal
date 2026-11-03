import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Sidebar from '../components/Sidebar/Sidebar.jsx';
import Header from '../components/Header/Header.jsx';
import { theme } from '../theme/themes.js';

// "SUPER ADMIN CONSOLE" -> "Super Admin Console" for the footer.
function titleCase(label) {
  return label.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

// Matches Tailwind's `lg` breakpoint, where the sidebar stops being a
// slide-in drawer and sits next to the page.
const DESKTOP_QUERY = '(min-width: 1024px)';

/**
 * Shared header + page frame for both Console layouts (AdminLayout,
 * SuperAdminLayout) -- previously duplicated whole. Only the label, the nav
 * items and the base path differ between the two; everything visual is
 * identical by design so the Admin Console and Super Admin Console read as
 * the same product. The sidebar is components/Sidebar/Sidebar.jsx (see
 * sidebarConfig.js for which items each role gets); the top bar is
 * components/Header/Header.jsx. `headerTitle` replaces the console name in the
 * top bar only; `profilePath` turns the user menu into a profile icon that
 * links to that page.
 */
export default function ConsoleLayout({ consoleLabel, headerTitle, profilePath, basePath, navItems, outletContext }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Desktop: collapse to icons only. Mobile: open the drawer.
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  function toggleSidebar() {
    if (window.matchMedia(DESKTOP_QUERY).matches) {
      setIsCollapsed((v) => !v);
    } else {
      setIsMobileOpen((v) => !v);
    }
  }

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        consoleLabel={consoleLabel}
        basePath={basePath}
        navItems={navItems}
        isCollapsed={isCollapsed}
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />

      <div className="relative flex min-w-0 flex-1 flex-col">
        <Header
          consoleLabel={headerTitle || consoleLabel}
          profilePath={profilePath}
          user={user}
          onLogout={handleLogout}
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={isMobileOpen}
          navItems={navItems}
          basePath={basePath}
        />
        <main className="relative z-10 mx-auto w-full max-w-screen-2xl flex-1 p-4 md:p-6">
          <Outlet context={outletContext} />
        </main>
        {theme.decor && (
          <footer className="mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 py-5 text-theme-xs md:mx-6">
            <p className="flex items-center gap-3 text-gray-500">
              <span className="font-semibold tracking-[0.08em] text-gray-700">DUROPLY</span>
              <span className="h-3.5 w-px bg-gray-300" aria-hidden="true" />
              {titleCase(consoleLabel)}
            </p>
            <p className="flex items-center gap-3 text-gray-500">
              <span className="h-px w-16 bg-brand-200" aria-hidden="true" />
              Crafting a stronger tomorrow
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}
