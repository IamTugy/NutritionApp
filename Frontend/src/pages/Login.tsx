import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';

export function Login() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/dashboard';
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Nutrition Tracker
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Track your nutrition and achieve your health goals
          </p>
        </div>
        <div>
          <button
            onClick={() => loginWithRedirect()}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign in with Auth0
          </button>
        </div>
      </div>
    </div>
  );
} 