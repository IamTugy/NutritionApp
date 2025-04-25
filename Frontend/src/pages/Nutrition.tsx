import { useCreateNutritionUserUserIdNutritionsPost, useDeleteNutritionUserUserIdNutritionsNutritionIdDelete } from '../api/generated/fastAPI';
import { useAuth0 } from '@auth0/auth0-react';
import { useNutrition } from '@/hooks/useNutrition';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/utils/tw';
import { useNavigate } from '@tanstack/react-router';

export function Nutrition() {
  const { user } = useAuth0();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useNutrition(user?.sub || null);
  const { mutate: deleteNutrition } = useDeleteNutritionUserUserIdNutritionsNutritionIdDelete({
    mutation: {
      onSuccess: () => {
        refetch();
      },
    }
  });

  const handleDelete = (nutritionId: string) => {
    deleteNutrition({
      userId: user?.sub || '',
      nutritionId,
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={cn(
          "text-2xl font-bold",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>Nutrition Tracking</h1>
        <button
          onClick={() => navigate({ to: '/food-search' })}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer flex items-center space-x-2"
        >
          <span>Add Food</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((nutrition) => (
          <div key={nutrition.id} className={cn(
            "rounded-lg shadow p-4 group relative",
            isDarkMode ? "bg-gray-800" : "bg-white"
          )}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className={cn(
                  "text-lg font-semibold",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>
                  Meal at {new Date(nutrition.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(nutrition.date).toLocaleDateString()}
                </h3>
                <p className={cn(
                  "text-sm",
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                )}>
                  Total Calories: {nutrition.total_calories}
                </p>
              </div>
              <button
                onClick={() => handleDelete(nutrition.id)}
                className={cn(
                  "cursor-pointer md:opacity-0 md:group-hover:opacity-100 transition-opacity",
                  isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-900"
                )}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="mt-2 space-y-2 max-h-[125px] overflow-y-auto">
              {nutrition.items.map((item, index) => (
                <div key={index} className={cn(
                  "flex justify-between text-sm pr-4",
                  isDarkMode ? "text-gray-300" : "text-gray-900"
                )}>
                  <span>{item.food_name}</span>
                  <span>{item.calories} cal</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 