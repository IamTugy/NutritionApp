import { Link, useRouter } from '@tanstack/react-router';
import { useAuth0 } from '@auth0/auth0-react';

export function Sidebar() {
  const { isAuthenticated } = useAuth0();
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  if (!isAuthenticated) return null;

  const isActive = (path: string) => currentPath === path;

  return (
    <aside className="w-64 bg-white shadow-lg h-screen">
      <nav className="mt-5 px-2">
        <Link
          to="/dashboard"
          className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
            isActive('/dashboard')
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          Dashboard
        </Link>
        <Link
          to="/nutrition"
          className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md ${
            isActive('/nutrition')
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          Nutrition Tracking
        </Link>
        <Link
          to="/goals"
          className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md ${
            isActive('/goals')
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          Goals
        </Link>
        <Link
          to="/food-search"
          className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md ${
            isActive('/food-search')
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          Food Search
        </Link>
      </nav>
    </aside>
  );
} 