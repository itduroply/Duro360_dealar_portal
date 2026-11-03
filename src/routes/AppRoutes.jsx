import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import PageLoader from '../components/common/PageLoader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { roleHome } from './roleHome.js';

const DealerLogin = lazy(() => import('../pages/DealerLogin/DealerLogin.jsx'));
const CertificatePrintPage = lazy(() => import('../pages/Warranty/CertificatePrintPage.jsx'));
const DealerLayout = lazy(() => import('../layouts/DealerLayout.jsx'));
const DealerDashboard = lazy(() => import('../pages/DealerPortal/DealerDashboard.jsx'));
const MyProfile = lazy(() => import('../pages/DealerPortal/MyProfile.jsx'));
const DealerOrders = lazy(() => import('../pages/DealerPortal/DealerOrders.jsx'));
const DealerInvoices = lazy(() => import('../pages/DealerPortal/DealerInvoices.jsx'));
const DealerPayments = lazy(() => import('../pages/DealerPortal/DealerPayments.jsx'));
const DealerOutstanding = lazy(() => import('../pages/DealerPortal/DealerOutstanding.jsx'));
const DealerTransactions = lazy(() => import('../pages/DealerPortal/DealerTransactions.jsx'));
const DealerSchemes = lazy(() => import('../pages/DealerPortal/DealerSchemes.jsx'));
const DealerWarranty = lazy(() => import('../pages/DealerPortal/DealerWarranty.jsx'));
const IssueCertificate = lazy(() => import('../pages/DealerPortal/IssueCertificate.jsx'));
const DealerDocuments = lazy(() => import('../pages/DealerPortal/DealerDocuments.jsx'));
const DealerQueries = lazy(() => import('../pages/DealerPortal/DealerQueries.jsx'));
const DealerNotifications = lazy(() => import('../pages/DealerPortal/DealerNotifications.jsx'));
const DealerReports = lazy(() => import('../pages/DealerPortal/DealerReports.jsx'));

// Send a signed-in user to their home (always /dealer in this app).
function RoleHomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={roleHome(user?.roles)} replace />;
}

// Dealer app routes. Employees, Admins and Super Admins use the separate
// employee-frontend app; both apps share the same Supabase backend.
export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<DealerLogin />} />

        {/* Dealer Portal -- paths match DEALER_FEATURES in components/Sidebar/sidebarConfig.js. */}
        <Route
          path="/dealer"
          element={
            <ProtectedRoute allowedRoles={['DEALER']}>
              <DealerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DealerDashboard />} />
          <Route path="profile" element={<MyProfile />} />
          <Route path="orders" element={<DealerOrders />} />
          <Route path="invoices" element={<DealerInvoices />} />
          <Route path="payments" element={<DealerPayments />} />
          <Route path="outstanding" element={<DealerOutstanding />} />
          <Route path="transactions" element={<DealerTransactions />} />
          <Route path="schemes" element={<DealerSchemes />} />
          <Route path="warranty" element={<DealerWarranty />} />
          <Route path="warranty/new" element={<IssueCertificate />} />
          <Route path="documents" element={<DealerDocuments />} />
          <Route path="queries" element={<DealerQueries />} />
          <Route path="notifications" element={<DealerNotifications />} />
          <Route path="reports" element={<DealerReports />} />
        </Route>

        {/* Printable certificate, outside the portal frame. Row Level Security
            decides which certificates the Dealer can open. */}
        <Route
          path="/print/warranty/:id"
          element={
            <ProtectedRoute allowedRoles={['DEALER']}>
              <CertificatePrintPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <ProtectedRoute>
              <RoleHomeRedirect />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}
