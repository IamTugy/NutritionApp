import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { Auth0Provider } from '@auth0/auth0-react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { MealPlateProvider } from '@/contexts/MealPlateContext';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export function Root() {
  return (
    <Auth0Provider
      domain="dev-haim44bkrab8ssbi.us.auth0.com"
      clientId="hsJP493eiRF8ACwWAbfFFyUSUeKCaOUw"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <ThemeProvider>
        <MealPlateProvider>
          <RouterProvider router={router} />
        </MealPlateProvider>
      </ThemeProvider>
    </Auth0Provider>
  );
} 