import { Link, useLocation } from 'react-router-dom';

// TailAdmin page title row: title on the left, "Home > Page" on the right.
// The Home link follows whichever console hosts the page.
export default function PageHeader({ title, description, actions }) {
  const { pathname } = useLocation();
  const home = ['/superadmin', '/admin', '/dealer'].find((base) => pathname.startsWith(base)) || '/';

  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        {description && <p className="mt-1 text-theme-sm text-gray-500">{description}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        {actions}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-sm">
            <li>
              <Link to={home} className="inline-flex items-center gap-1.5 text-gray-500 hover:text-brand-500">
                Home
                <svg viewBox="0 0 17 16" fill="none" className="h-4 w-4" aria-hidden="true">
                  <path d="M6.1 12.7L10.2 8.4 6.1 4.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </li>
            <li className="text-gray-800">{title}</li>
          </ol>
        </nav>
      </div>
    </div>
  );
}
