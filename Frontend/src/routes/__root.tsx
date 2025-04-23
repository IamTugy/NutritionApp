import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useAuth0 } from '@auth0/auth0-react'
import nutritionLogo from '@/assets/nutrition-logo.svg'
import { MainLayout } from '../components/layout/MainLayout'
import { SidebarProvider } from '@/contexts/SidebarContext'

export const Route = createRootRoute({
  component: () => {
    const { isLoading } = useAuth0()

    if (isLoading) {
      return <div className="fixed inset-0 bg-white flex flex-col items-center justify-center">
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
            <h1 className="text-3xl font-bold text-gray-900 animate-fade-in">
              Nutrition App
            </h1>
            <p className="mt-2 text-gray-600 animate-fade-in-delay">
              Your personal nutrition companion
            </p>
          </div>
        </div>
      </div>
    }

    return (
      <SidebarProvider>
        <MainLayout>
          <Outlet />
        </MainLayout>
      </SidebarProvider>
    )
  },
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {error.message}
          </p>
        </div>
      </div>
    </div>
  ),
})
