import { useState } from 'react';
import { useMealPlate } from '@/contexts/MealPlateContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/utils/tw';
import { MealPlateModal } from './MealPlateModal';

export function MealPlateButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { items, totalCalories } = useMealPlate();
  const { isDarkMode } = useTheme();

  if (items.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={cn(
          "flex items-center space-x-2 px-3 py-2 rounded-full",
          isDarkMode 
            ? "bg-gray-700 hover:bg-gray-600 text-white" 
            : "bg-gray-100 hover:bg-gray-200 text-gray-900"
        )}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
        <span className="font-medium">{totalCalories} cal</span>
        <span className={cn(
          "px-2 py-0.5 text-xs rounded-full",
          isDarkMode ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-800"
        )}>
          {items.length}
        </span>
      </button>

      <MealPlateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
} 