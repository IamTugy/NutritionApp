import { useAuth0 } from '@auth0/auth0-react';
import { Outlet } from '@tanstack/react-router';

export function ProtectedRoute() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <Outlet />;
} 