import { useState } from 'react';
import { useSearchFoodSearchGet } from '../api/generated/fastAPI';
import { cn } from '../utils/tw';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';
import { useTheme } from '@/contexts/ThemeContext';
import { useMealPlate } from '@/contexts/MealPlateContext';

export function FoodSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [query, setQuery] = useState('');
  const { isDarkMode } = useTheme();
  const { items, addItem, updateQuantity } = useMealPlate();

  const { data, isLoading } = useSearchFoodSearchGet(
    { query },
    {
      query: {
        enabled: query.length > 0,
      },
    }
  );

  const getItemQuantity = (foodName: string) => {
    const item = items.find(i => i.food_name === foodName);
    return item?.quantity || 0;
  };

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
      ) : query.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-6">
          <div className={cn(
            "p-6 rounded-full",
            isDarkMode ? "bg-gray-700" : "bg-gray-100"
          )}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-center space-y-4 max-w-md">
            <h2 className={cn(
              "text-xl font-semibold",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>Create Your Meal</h2>
            <div className={cn(
              "space-y-2 text-sm",
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              <p>1. Search for foods using the search bar above</p>
              <p>2. Click "Add to Meal" to add items to your meal plate</p>
              <p>3. Adjust quantities using the + and - buttons</p>
              <p>4. Click the meal plate button in the header to view your meal</p>
              <p>5. Save your meal to track your nutrition</p>
            </div>
          </div>
        </div>
      ) : data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-6">
          <div className={cn(
            "p-6 rounded-full",
            isDarkMode ? "bg-gray-700" : "bg-gray-100"
          )}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-center space-y-4 max-w-md">
            <h2 className={cn(
              "text-xl font-semibold",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>No Food Found!</h2>
            <div className={cn(
              "space-y-2 text-sm",
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              <p>Oops! Looks like we couldn't find any food matching "{query}"</p>
              <p>Maybe it's time to invent a new dish? 🍳</p>
              <p>Try searching for something else or check your spelling!</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data?.map((food) => {
            const quantity = getItemQuantity(food.food_name);
            return (
              <div key={food.food_name} className={cn(
                "p-6 rounded-lg shadow relative",
                isDarkMode ? "bg-gray-800" : "bg-white"
              )}>
                <h2 className={cn(
                  "text-xl font-semibold mb-4",
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
                <div className="absolute bottom-6 right-6">
                  {quantity > 0 ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(items.find(i => i.food_name === food.food_name)?.id || '', quantity - 1)}
                        className={cn(
                          "px-2 py-1 rounded-md",
                          isDarkMode 
                            ? "bg-gray-700 text-white hover:bg-gray-600" 
                            : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                        )}
                      >
                        -
                      </button>
                      <span className={cn(
                        "font-medium",
                        isDarkMode ? "text-white" : "text-gray-900"
                      )}>{quantity}</span>
                      <button
                        onClick={() => addItem(food)}
                        className={cn(
                          "px-2 py-1 rounded-md",
                          isDarkMode 
                            ? "bg-gray-700 text-white hover:bg-gray-600" 
                            : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                        )}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addItem(food)}
                      className={cn(
                        'px-4 py-2 rounded-md cursor-pointer',
                        'bg-blue-500 text-white hover:bg-blue-600'
                      )}
                    >
                      Add to Meal
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 