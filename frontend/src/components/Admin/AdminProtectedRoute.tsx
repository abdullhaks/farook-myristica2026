import { Navigate, Outlet } from 'react-router-dom';
import { useAdminStore } from '../../store/useAdminStore';

export default function AdminProtectedRoute() {
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/admin" replace />;
  }

  // If authenticated, render the child routes (Outlet)
  return <Outlet />;
}
