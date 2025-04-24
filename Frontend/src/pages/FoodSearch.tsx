import { useState } from 'react';
import { useSearchFoodSearchGet } from '../api/generated/fastAPI';
import { cn } from '../utils/tw';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';
import { useTheme } from '@/contexts/ThemeContext';

export function FoodSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [query, setQuery] = useState('');
  const { isDarkMode } = useTheme();

  const { data, isLoading } = useSearchFoodSearchGet(
    { query },
    {
      query: {
        enabled: query.length > 0,
      },
    }
  );

  return (
    <div className="space-y-6">
      <h1 className={cn(
        "text-2xl font-bold",
        isDarkMode ? "text-white" : "text-gray-900"
      )}>Food Search</h1>
      
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setQuery(searchQuery);
            }
          }}
          placeholder="Search for foods..."
          className={cn(
            'w-full p-4 border rounded-lg',
            isDarkMode 
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-transparent'
          )}
        />
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data?.map((food) => (
            <div key={food.food_name} className={cn(
              "p-6 rounded-lg shadow",
              isDarkMode ? "bg-gray-800" : "bg-white"
            )}>
              <h2 className={cn(
                "text-xl font-semibold mb-2",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>{food.food_name}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={cn(
                    "text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  )}>Calories</p>
                  <p className={cn(
                    "font-semibold",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>{food.calories}</p>
                </div>
                <div>
                  <p className={cn(
                    "text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  )}>Protein</p>
                  <p className={cn(
                    "font-semibold",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>{food.protein || 0}g</p>
                </div>
                <div>
                  <p className={cn(
                    "text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  )}>Carbs</p>
                  <p className={cn(
                    "font-semibold",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>{food.carbohydrates || 0}g</p>
                </div>
                <div>
                  <p className={cn(
                    "text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  )}>Fat</p>
                  <p className={cn(
                    "font-semibold",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>{food.fat || 0}g</p>
                </div>
                <div>
                  <p className={cn(
                    "text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  )}>Water</p>
                  <p className={cn(
                    "font-semibold",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>{food.water || 0}L</p>
                </div>
              </div>
              <button className={cn(
                'mt-4 w-full px-4 py-2 rounded-md cursor-pointer',
                'bg-blue-500 text-white hover:bg-blue-600'
              )}>
                Add to Meal
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 