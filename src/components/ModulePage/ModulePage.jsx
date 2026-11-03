import PageHeader from '../common/PageHeader.jsx';
import Button from '../common/Button.jsx';
import { SHOW_SAMPLE_DATA } from '../../data/sample/index.js';

export { default as TabBar } from './TabBar.jsx';
export { default as KpiStrip } from './KpiStrip.jsx';
export { default as StatusChip } from './StatusChip.jsx';

export const NOT_CONNECTED_TITLE = 'Available once this module is connected';

// Small pill next to the page actions -- replaces the old full-width notice box.
function AwaitingDataBadge() {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-warning-200 bg-warning-50 px-2.5 py-1 text-theme-xs font-medium text-warning-700"
      title="This screen is ready. Data will show here once the data source is connected."
    >
      <span className="h-1.5 w-1.5 rounded-full bg-warning-500" aria-hidden="true" />
      Awaiting data
    </span>
  );
}


function SampleDataBadge() {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-blue-light-200 bg-blue-light-50 px-2.5 py-1 text-theme-xs font-medium text-blue-light-700"
      title="Dummy data for layout review. It will be replaced by live data."
    >
    
    </span>
  );
}

export function DataStatusBadge() {
  return SHOW_SAMPLE_DATA ? <SampleDataBadge /> : <AwaitingDataBadge />;
}

// Disabled button used for actions that need the data source (Export, Create…).
export function PendingButton({ children, variant = 'secondary', size = 'sm', className = '' }) {
  return (
    <Button variant={variant} size={size} disabled title={NOT_CONNECTED_TITLE} className={className}>
      {children}
    </Button>
  );
}

/**
 * Page frame for every Console module (pages/Orders, pages/Invoices, …):
 * the standard page header with an "Awaiting data" badge and the page's
 * actions, then the page's own sections with one fixed gap between them so
 * spacing is the same on every page. Each page builds its own layout inside
 * from KpiStrip, Panel, DataTable and EmptyState in this folder.
 */
// An action with `onClick` is a working button; one without stays a
// disabled PendingButton. `live` hides the data badge on pages that already
// read real data.
export default function ModulePage({ title, description, actions = [], live = false, children }) {
  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        actions={
          <>
            {!live && <DataStatusBadge />}
            {actions.map((action) =>
              action.onClick ? (
                <Button key={action.label} variant={action.variant || 'secondary'} size="sm" onClick={action.onClick}>
                  {action.label}
                </Button>
              ) : (
                <PendingButton key={action.label} variant={action.variant}>
                  {action.label}
                </PendingButton>
              )
            )}
          </>
        }
      />
      <div className="flex flex-col gap-4 md:gap-5">{children}</div>
    </div>
  );
}
