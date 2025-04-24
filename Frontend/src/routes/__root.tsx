import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useAuth0 } from '@auth0/auth0-react'
import nutritionLogo from '@/assets/nutrition-logo.svg'
import { MainLayout } from '../components/layout/MainLayout'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/utils/tw'
import { MealPlateProvider } from '@/contexts/MealPlateContext'

function LoadingScreen() {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={cn(
      "fixed inset-0 flex flex-col items-center justify-center",
      isDarkMode ? "bg-gray-900" : "bg-white"
    )}>
      <div className="relative">
        {/* Logo animation */}
        <div className="size-64 flex items-center justify-center">
          <img
            src={nutritionLogo}
            alt="Nutrition App Logo"
            className="size-full animate-pulse"
          />
        </div>
        
        {/* App name with fade-in animation */}
        <div className="mt-6 text-center">
          <h1 className={cn(
            "text-3xl font-bold animate-fade-in",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Nutrition App
          </h1>
          <p className={cn(
            "mt-2 animate-fade-in-delay",
            isDarkMode ? "text-gray-400" : "text-gray-600"
          )}>
            Your personal nutrition companion
          </p>
        </div>
      </div>
    </div>
  );
}

function ErrorScreen({ error }: { error: Error }) {
  const { isDarkMode } = useTheme();

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      <div className={cn(
        "max-w-md w-full space-y-8 p-8 rounded-lg shadow-lg",
        isDarkMode ? "bg-gray-800" : "bg-white"
      )}>
        <div>
          <h2 className={cn(
            "mt-6 text-center text-3xl font-extrabold",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Error
          </h2>
          <p className={cn(
            "mt-2 text-center text-sm",
            isDarkMode ? "text-gray-400" : "text-gray-600"
          )}>
            {error.message}
          </p>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  component: () => {
    const { isLoading } = useAuth0()

    if (isLoading) {
      return <LoadingScreen />;
    }

    return (
      <ThemeProvider>
        <MealPlateProvider>
        <SidebarProvider>
          <MainLayout>
            <Outlet />
          </MainLayout>
        </SidebarProvider>
        </MealPlateProvider>
      </ThemeProvider>
    )
  },
  errorComponent: ({ error }) => <ErrorScreen error={error} />,
})
