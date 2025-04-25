import { useAuth0 } from '@auth0/auth0-react';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { ThemeProvider } from './contexts/ThemeContext';
import { MealPlateProvider } from './contexts/MealPlateContext';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <MealPlateProvider>
        <RouterProvider router={router} />
      </MealPlateProvider>
    </ThemeProvider>
  );
} 