import { Outlet } from '@tanstack/react-router';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/utils/tw';
import { MealPlateButton } from '@/components/meal/MealPlateButton';

export function Layout() {
  const { isDarkMode } = useTheme();

  return (
    <div className={cn(
      "min-h-screen",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      <header className={cn(
        "sticky top-0 z-50 border-b",
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className={cn(
                "text-xl font-bold",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>Nutrition App</h1>
            </div>
            <div className="flex items-center space-x-4">
              <MealPlateButton />
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
} 