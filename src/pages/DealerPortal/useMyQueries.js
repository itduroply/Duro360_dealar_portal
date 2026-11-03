import { useCallback, useEffect, useState } from 'react';
import { queriesApi } from '../../api/queriesApi';

const REFRESH_MS = 30000;

// The signed-in Dealer's queries, newest first, with every reply. Reloads
// every 30 seconds, so a reply or a Resolved status from the Duro team shows
// up without a page refresh. Row Level Security returns only this Dealer's rows.
export function useMyQueries() {
  const [queries, setQueries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    try {
      setQueries(await queriesApi.list());
      setError('');
    } catch (err) {
      setError(err.message || 'Could not load your queries.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
    const timer = setInterval(reload, REFRESH_MS);
    return () => clearInterval(timer);
  }, [reload]);

  return { queries, isLoading, error, reload };
}
