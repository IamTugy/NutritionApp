import { Link } from '@tanstack/react-router';
import { useAuth0 } from '@auth0/auth0-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/utils/tw';
import { useMealPlate } from '@/contexts/MealPlateContext';
import { MealPlateModal } from './meal/MealPlateModal';
import { useState } from 'react';

export function Navigation() {
  const { isAuthenticated, loginWithRedirect, logout} = useAuth0();
  const { isDarkMode } = useTheme();
  const { items } = useMealPlate();
  const [isMealPlateOpen, setIsMealPlateOpen] = useState(false);

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <nav className={cn(
      "bg-white shadow-sm",
      isDarkMode && "bg-gray-800"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/"
                className={cn(
                  "text-xl font-bold",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}
              >
                Food Track
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/dashboard"
                className={cn(
                  "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                  isDarkMode
                    ? "border-transparent text-gray-300 hover:border-gray-300 hover:text-white"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                )}
              >
                Dashboard
              </Link>
              <Link
                to="/nutrition"
                className={cn(
                  "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                  isDarkMode
                    ? "border-transparent text-gray-300 hover:border-gray-300 hover:text-white"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                )}
              >
                Nutrition
              </Link>
              <Link
                to="/goals"
                className={cn(
                  "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                  isDarkMode
                    ? "border-transparent text-gray-300 hover:border-gray-300 hover:text-white"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                )}
              >
                Goals
              </Link>
              <Link
                to="/trainers"
                className={cn(
                  "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                  isDarkMode
                    ? "border-transparent text-gray-300 hover:border-gray-300 hover:text-white"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                )}
              >
                Trainers
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsMealPlateOpen(true)}
                  className={cn(
                    "relative p-2 rounded-md",
                    isDarkMode
                      ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {items.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-blue-600 rounded-full">
                      {items.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium",
                    isDarkMode
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => loginWithRedirect()}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium",
                  isDarkMode
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                )}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
      <MealPlateModal
        isOpen={isMealPlateOpen}
        onClose={() => setIsMealPlateOpen(false)}
      />
    </nav>
  );
} 