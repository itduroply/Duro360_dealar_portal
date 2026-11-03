import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDownIcon, LogoutIcon } from '../common/icons.jsx';
import { NAV_ICONS } from '../Sidebar/navIcons.jsx';
import { theme } from '../../theme/themes.js';

// Human-readable label for the signed-in user's role in the header.
// Falls back to title-casing whatever the role string is, so an
// unrecognized role still renders something readable instead of raw
// SCREAMING_CASE from the database.
const ROLE_LABELS = { SUPERADMIN: 'Super Admin', ADMIN: 'Admin', DEALER: 'Dealer', VENDOR: 'Vendor' };
function roleLabel(role) {
  if (!role) return '';
  return ROLE_LABELS[role] || role.charAt(0) + role.slice(1).toLowerCase();
}

/**
 * TailAdmin header user menu: round avatar + name + chevron. Clicking opens
 * a card with the user's name, email and role, and the Logout action.
 */
export default function UserDropdown({ user, onLogout, profilePath }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    }
    function handleEscape(e) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Up to two initials: "Super Admin" -> "SA", "Anita" -> "A".
  const initial = (user?.name || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center text-gray-700"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {profilePath ? (
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${theme.ui.avatar}`}
            title="My Profile"
            aria-label="My Profile"
          >
            <NAV_ICONS.profile />
          </span>
        ) : (
          <>
            <span className={`mr-3 flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-semibold ${theme.ui.avatar}`}>
              {initial}
            </span>
            <span className="mr-1 hidden text-theme-sm font-semibold text-gray-800 sm:block">{user?.name}</span>
            <span className={`${theme.ui.chevron} transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
              <ChevronDownIcon className="h-[18px] w-[18px]" />
            </span>
          </>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 z-50 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg"
          role="menu"
        >
          <div className="px-1 pb-3">
            <span className="block text-theme-sm font-medium text-gray-700">{user?.name}</span>
            {(user?.dealerCode || user?.email) && (
              <span className="mt-0.5 block text-theme-xs text-gray-500">
                {user.dealerCode ? `Dealer Code ${user.dealerCode}` : user.email}
              </span>
            )}
            <span className="mt-2 inline-flex rounded-full bg-brand-50 px-2.5 py-0.5 text-theme-xs font-medium text-brand-500">
              {roleLabel(user?.roles?.[0])}
            </span>
          </div>
          {profilePath && (
            <Link
              to={profilePath}
              onClick={() => setIsOpen(false)}
              className="mb-1 flex items-center gap-3 rounded-lg border-t border-gray-200 px-3 py-2 pt-3 text-theme-sm font-medium text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <span className="text-gray-500">
                <NAV_ICONS.profile />
              </span>
              View Full Profile
            </Link>
          )}
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-3 rounded-lg border-t border-gray-200 px-3 py-2 pt-3 text-theme-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700"
            role="menuitem"
          >
            <span className="text-gray-500">
              <LogoutIcon />
            </span>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
