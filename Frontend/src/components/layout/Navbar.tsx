import { Link } from '@tanstack/react-router';
import { useAuth0 } from '@auth0/auth0-react';
import { useSidebar } from '@/contexts/SidebarContext';
import { UserMenu } from './UserMenu';

export function Navbar() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { toggle } = useSidebar();

  return (
    <nav className="bg-white shadow-lg h-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <button
                onClick={toggle}
                className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-800">Nutrition Tracker</span>
            </Link>
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <button
                onClick={() => loginWithRedirect()}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 