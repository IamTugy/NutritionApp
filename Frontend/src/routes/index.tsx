import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const isAuthenticated = localStorage.getItem('auth0.is.authenticated') === 'true';
    const isLoading = localStorage.getItem('auth0.is.loading') === 'true';

    if (isLoading) {
      return null;
    }

    if (isAuthenticated) {
      return redirect({
        to: '/dashboard',
      });
    }

    return redirect({
      to: '/login',
    });
  },
})
