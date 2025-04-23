import { redirect } from '@tanstack/react-router';

export const checkAuth = () => {
  // Check for Auth0's authentication state
  const isAuthenticated = localStorage.getItem('auth0.is.authenticated') === 'true';
  const isLoading = localStorage.getItem('auth0.is.loading') === 'true';

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return redirect({
      to: '/login',
    });
  }

  return true;
}; 