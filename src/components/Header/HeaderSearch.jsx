import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon } from '../common/icons.jsx';
import { NAV_ICONS } from '../Sidebar/navIcons.jsx';

/**
 * Header search box: finds a console page by name ("dealers", "warranty")
 * and opens it. Enter opens the first match; Escape closes the list. It
 * searches the same pages as the sidebar, so it never shows a page the
 * user cannot open.
 */
export default function HeaderSearch({ navItems = [], basePath }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return navItems.filter((item) => item.implemented && item.label.toLowerCase().includes(q)).slice(0, 6);
  }, [navItems, query]);

  function open(item) {
    navigate(item.path ? `${basePath}/${item.path}` : basePath, { state: item.state });
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && matches[0]) open(matches[0]);
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  }

  return (
    <div className="relative hidden md:block">
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
        <SearchIcon />
      </span>
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        // Delay so a click on a result lands before the list closes.
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        onKeyDown={handleKeyDown}
        placeholder="Search here..."
        aria-label="Search pages"
        className="h-11 w-60 rounded-full border border-gray-200 bg-white pl-11 pr-4 text-theme-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 lg:w-72"
      />
      {isOpen && query.trim() && (
        <ul className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-theme-lg">
          {matches.length === 0 ? (
            <li className="px-4 py-3 text-theme-sm text-gray-500">No page matches “{query.trim()}”.</li>
          ) : (
            matches.map((item) => {
              const Icon = NAV_ICONS[item.key];
              return (
                <li key={item.key}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => open(item)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-theme-sm text-gray-700 hover:bg-brand-25 hover:text-brand-600"
                  >
                    <span className="text-gray-500">{Icon && <Icon />}</span>
                    {item.label}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
