import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth0 } from '@auth0/auth0-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/utils/tw';
import { useMealPlate } from '@/contexts/MealPlateContext';
import { MealPlateModal } from './meal/MealPlateModal';
import { useState } from 'react';

export function Sidebar() {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { items } = useMealPlate();
  const [isMealPlateOpen, setIsMealPlateOpen] = useState(false);

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <div className={cn(
      "h-screen w-64 fixed left-0 top-0",
      isDarkMode ? "bg-gray-800" : "bg-white"
    )}>
      <div className="flex flex-col h-full">
        <div className="flex-shrink-0 p-4">
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

        <nav className="flex-1 px-2 py-4 space-y-1">
          <Link
            to="/dashboard"
            className={cn(
              "flex items-center px-2 py-2 text-sm font-medium rounded-md",
              isDarkMode
                ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>

          <Link
            to="/nutrition"
            className={cn(
              "flex items-center px-2 py-2 text-sm font-medium rounded-md",
              isDarkMode
                ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Nutrition
          </Link>

          <Link
            to="/goals"
            className={cn(
              "flex items-center px-2 py-2 text-sm font-medium rounded-md",
              isDarkMode
                ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Goals
          </Link>

          <Link
            to="/trainers"
            className={cn(
              "flex items-center px-2 py-2 text-sm font-medium rounded-md",
              isDarkMode
                ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Trainers
          </Link>
        </nav>

        <div className="flex-shrink-0 p-4 border-t">
          {isAuthenticated ? (
            <div className="space-y-4">
              <button
                onClick={() => setIsMealPlateOpen(true)}
                className={cn(
                  "w-full flex items-center px-2 py-2 text-sm font-medium rounded-md",
                  isDarkMode
                    ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Meal Plate
                {items.length > 0 && (
                  <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                    {items.length}
                  </span>
                )}
              </button>
              <button
                onClick={handleLogout}
                className={cn(
                  "w-full flex items-center px-2 py-2 text-sm font-medium rounded-md",
                  isDarkMode
                    ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => loginWithRedirect()}
              className={cn(
                "w-full flex items-center px-2 py-2 text-sm font-medium rounded-md",
                isDarkMode
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              )}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Login
            </button>
          )}
        </div>
      </div>
      <MealPlateModal
        isOpen={isMealPlateOpen}
        onClose={() => setIsMealPlateOpen(false)}
      />
    </div>
  );
} 