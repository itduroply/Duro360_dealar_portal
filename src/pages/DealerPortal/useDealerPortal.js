import { useOutletContext } from 'react-router-dom';

// What layouts/DealerLayout.jsx passes to every Dealer Portal page:
//   dealer      { code, name } of the signed-in Dealer
//   record      the Dealer's master row from dealer_directory (null until loaded)
//   recordState { isLoading, error } for `record`
//   sample      this Dealer's sample data (data/sample/dealerSample.js)
export function useDealerPortal() {
  return useOutletContext();
}
