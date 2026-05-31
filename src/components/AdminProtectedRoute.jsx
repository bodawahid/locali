import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

const LoadingFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      <p className="text-slate-600">Verifying admin access...</p>
    </div>
  </div>
);

/**
 * AdminProtectedRoute - Requires admin authentication
 * Redirects non-admin users to login page
 */
export default function AdminProtectedRoute({ children, fallback = <LoadingFallback /> }) {
  const { isAuthenticated, isLoadingAuth, user } = useAuth();

  // Show loading state while checking auth
  if (isLoadingAuth) {
    return fallback;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/localiadmin/login" replace />;
  }

  // Redirect if user exists but is not admin
  if (user && user.role !== 'admin') {
    return <Navigate to="/localiadmin/login" replace />;
  }

  // Render admin content
  return children ? children : <Outlet />;
}
