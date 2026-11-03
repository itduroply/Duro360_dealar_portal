import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { dealerApi } from '../api/dealerApi';
import ConsoleLayout from './ConsoleLayout.jsx';
import { getSidebarForRole } from '../components/Sidebar/sidebarConfig.js';
import { buildDealerSample } from '../data/sample/dealerSample.js';


export default function DealerLayout() {
  const { user } = useAuth();
  const code = user?.dealerCode;
  const [record, setRecord] = useState(null);
  const [recordState, setRecordState] = useState({ isLoading: Boolean(code), error: '' });

  useEffect(() => {
    if (!code) return undefined;
    let cancelled = false;
    dealerApi
      .getMyRecord(code)
      .then((row) => {
        if (!cancelled) setRecord(row);
      })
      .catch((err) => {
        if (!cancelled) setRecordState((s) => ({ ...s, error: err.message || 'Could not load your details.' }));
      })
      .finally(() => {
        if (!cancelled) setRecordState((s) => ({ ...s, isLoading: false }));
      });
    return () => {
      cancelled = true;
    };
  }, [code]);

  const dealer = { code: code || '—', name: record?.customer_name || user?.name || 'Dealer' };
  const sample = useMemo(() => buildDealerSample(dealer), [dealer.code, dealer.name]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ConsoleLayout
      consoleLabel="DEALER PORTAL"
      headerTitle={dealer.name}
      profilePath="/dealer/profile"
      basePath="/dealer"
      navItems={getSidebarForRole('DEALER')}
      outletContext={{ dealer, record, recordState, sample }}
    />
  );
}
