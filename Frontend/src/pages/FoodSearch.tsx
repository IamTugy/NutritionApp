import { useState } from 'react';
import { useSearchFoodSearchGet } from '../api/generated/fastAPI';
import { useDebounce } from '../hooks/useDebounce';
import { cn } from '../utils/tw';

export function FoodSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data, isLoading } = useSearchFoodSearchGet(
    { query: debouncedSearchQuery },
    {
      query: {
        enabled: debouncedSearchQuery.length > 0,
        initialData: [],
        refetchOnMount: true,
      },
    }
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Food Search</h1>
      
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for foods..."
          className={cn(
            'w-full p-4 border border-gray-300 rounded-lg',
            'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          )}
        />
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data?.map((food) => (
            <div key={food.food_name} className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">{food.food_name}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Calories</p>
                  <p className="font-semibold">{food.calories}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Protein</p>
                  <p className="font-semibold">{food.protein || 0}g</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Carbs</p>
                  <p className="font-semibold">{food.carbohydrates || 0}g</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fat</p>
                  <p className="font-semibold">{food.fat || 0}g</p>
                </div>
              </div>
              <button className={cn(
                'mt-4 w-full px-4 py-2 rounded-md',
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