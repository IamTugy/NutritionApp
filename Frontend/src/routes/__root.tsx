import { createRootRoute, Outlet } from '@tanstack/react-router'
import { MainLayout } from '../components/layout/MainLayout'
import { AuthProvider } from '../contexts/AuthContext'

export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
      <MainLayout>
        <Outlet />
      </MainLayout>
    </AuthProvider>
  ),
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
