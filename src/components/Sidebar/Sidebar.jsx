import { NavLink } from 'react-router-dom';
import duroplyLogo from '../../assets/duroply-logo.png';
import duroplyLogoBrown from '../../assets/duroply-logo-brown.png';
import { NAV_ICONS } from './navIcons.jsx';
import { theme } from '../../theme/themes.js';
import { SilkWaves } from '../Decor/Decor.jsx';

// Sidebar colours come from the sidebar-* tokens (see src/theme/themes.js):
// cream in the woodland theme, plain white in the TailAdmin theme. The
// woodland theme (`theme.decor`) also centres the logo with the product line
// under it, drops the "Menu" heading, and draws silk-like waves at the foot.

export default function Sidebar({ consoleLabel, basePath, navItems: allNavItems, isCollapsed, isOpen, onClose }) {
  const showText = !isCollapsed || isOpen;
  // The woodland design lists only pages that are built (no "coming soon").
  const navItems = theme.decor ? allNavItems.filter((item) => item.implemented) : allNavItems;

  return (
    <>
      {/* Dark backdrop behind the sidebar on mobile. */}
      <div
        className={`fixed inset-0 z-40 bg-gray-900/50 lg:hidden ${isOpen ? 'block' : 'hidden'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col overflow-hidden border-r border-sidebar-border bg-sidebar bg-sidebar-texture bg-cover ${theme.decor ? 'px-3' : 'px-5'} transition-all duration-300 lg:sticky lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${showText ? 'w-[255px]' : 'w-[255px] lg:w-[90px]'}`}
      >
        <div className={`flex shrink-0 items-center gap-3 ${theme.decor ? 'pb-7 pt-6' : 'pb-7 pt-8'} ${showText ? '' : 'lg:justify-center'}`}>
          {showText && theme.decor ? (
            <div className="flex w-full flex-col items-center text-center">
              <img
                src={theme.sidebarLogoBrown ? duroplyLogoBrown : duroplyLogo}
                alt="DUROPLY"
                className={`h-[37px] w-auto ${theme.sidebarLogoWhite ? 'brightness-0 invert' : ''}`}
              />
              <p className="mt-1.5 whitespace-nowrap text-[9.5px] font-medium uppercase leading-[1.6] tracking-[0.12em] text-sidebar-muted">
                Indian Plywood | Blockboards
                <br />
                Decorative Veneers
              </p>
            </div>
          ) : showText ? (
            <>
              <img src={duroplyLogo} alt="DUROPLY" className="h-6 w-auto shrink-0" />
              <span className="h-6 w-px bg-sidebar-divider" aria-hidden="true" />
              <span className="text-[11px] font-semibold uppercase leading-tight tracking-[0.12em] text-sidebar-muted">
                {consoleLabel}
              </span>
            </>
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500 text-base font-bold text-white">
              D
            </span>
          )}
        </div>

        <nav className="no-scrollbar relative z-10 flex-1 overflow-y-auto">
          {!theme.decor && (
            <h3
              className={`mb-4 flex text-xs uppercase leading-5 text-sidebar-muted ${showText ? 'justify-start' : 'lg:justify-center'}`}
            >
              {showText ? 'Menu' : '•••'}
            </h3>
          )}
          <ul className={`mb-6 flex flex-col ${theme.decor ? 'gap-1.5' : 'gap-1'}`}>
            {navItems.map((item) => {
              const Icon = NAV_ICONS[item.key];
              return (
                <li key={item.key}>
                  <NavLink
                    to={item.path ? `${basePath}/${item.path}` : basePath}
                    state={item.state}
                    end={item.end}
                    onClick={onClose}
                    title={showText ? undefined : item.label}
                    className={({ isActive }) =>
                      `group relative flex items-center rounded-lg px-3 transition-colors ${
                        theme.decor ? 'gap-[18px] px-5 py-3 text-[14.5px]' : 'gap-3 py-2 text-theme-sm font-medium'
                      } ${
                        showText ? '' : 'lg:justify-center'
                      } ${
                        isActive && item.implemented
                          ? `bg-sidebar-active text-sidebar-active-text ${theme.ui.sidebarNavActive}`
                          : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-hover-text'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {Icon && (
                          <span
                            className={
                              isActive && item.implemented
                                ? `text-sidebar-active-text ${theme.ui.sidebarIconActive ?? ''}`
                                : 'text-sidebar-icon group-hover:text-sidebar-hover-text'
                            }
                          >
                            <Icon />
                          </span>
                        )}
                        {showText && <span className="flex-1 truncate">{item.label}</span>}
                        {showText && item.badge && (
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium uppercase text-success-600 ${
                              isActive ? 'bg-success-100' : 'bg-success-50 group-hover:bg-success-100'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {theme.decor && <SilkWaves className="absolute bottom-0 left-0 h-[340px] w-full [mask-image:linear-gradient(to_bottom,transparent,black_35%)]" />}
      </aside>
    </>
  );
}
