import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import PageLoader from '../components/common/PageLoader.jsx';
import { roleHome } from './roleHome.js';

/**
 * Frontend route guarding is a UX convenience only -- it stops a signed-out
 * visitor from seeing a flash of a page they can't use. It is NOT the
 * security boundary; Supabase Row Level Security checks every request.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.some((role) => user.roles.includes(role))) {
    return <Navigate to={roleHome(user.roles)} replace />;
  }

  return children;
}
