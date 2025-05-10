import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/utils/tw';

type LoadingSpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

interface LoadingSpinnerProps {
  size?: LoadingSpinnerSize;
}

const sizeClasses: Record<LoadingSpinnerSize, string> = {
  sm: 'h-4 w-4 border-t border-b',
  md: 'h-8 w-8 border-t-2 border-b-2',
  lg: 'h-16 w-16 border-t-2 border-b-2',
  xl: 'h-32 w-32 border-t-2 border-b-2'
};

export function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  const { isDarkMode } = useTheme();

  return (
    <div className="flex justify-center items-center h-full">
      <div className={cn(
        "animate-spin rounded-full",
        sizeClasses[size],
        isDarkMode ? "border-white" : "border-gray-900"
      )}></div>
    </div>
  );
} 