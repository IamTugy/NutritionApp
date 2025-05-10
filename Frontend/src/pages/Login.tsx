import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/utils/tw';

export function Login() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/dashboard';
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className={cn(
        "max-w-md w-full space-y-8 p-8 rounded-lg shadow-lg",
        isDarkMode ? "bg-gray-800" : "bg-white"
      )}>
        <div>
          <h2 className={cn(
            "mt-6 text-center text-3xl font-extrabold",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Welcome to Food Track
          </h2>
          <p className={cn(
            "mt-2 text-center text-sm",
            isDarkMode ? "text-gray-300" : "text-gray-600"
          )}>
            Track your nutrition and achieve your health goals
          </p>
        </div>
        <div>
          <button
            onClick={() => loginWithRedirect()}
            className={cn(
              "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer",
              isDarkMode 
                ? "bg-blue-500 hover:bg-blue-600" 
                : "bg-blue-600 hover:bg-blue-700"
            )}
          >
            Sign in with Auth0
          </button>
        </div>
      </div>
    </div>
  );
} 