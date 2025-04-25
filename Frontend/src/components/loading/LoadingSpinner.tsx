import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/utils/tw';

export function LoadingSpinner() {
  const { isDarkMode } = useTheme();

  return (
    <div className="flex justify-center items-center h-full">
      <div className={cn(
        "animate-spin rounded-full h-32 w-32 border-t-2 border-b-2",
        isDarkMode ? "border-white" : "border-gray-900"
      )}></div>
    </div>
  );
} 