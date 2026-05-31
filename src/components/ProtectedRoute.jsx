import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

const LoadingFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      <p className="text-slate-600">Loading...</p>
    </div>
  </div>
);

/**
 * ProtectedRoute - Requires authentication
 * Redirects unauthenticated users to login page
 */
export default function ProtectedRoute({ children, fallback = <LoadingFallback /> }) {
  const { isAuthenticated, isLoadingAuth } = useAuth();

  // Show loading state while checking auth
  if (isLoadingAuth) {
    return fallback;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content
  return children ? children : <Outlet />;
}
