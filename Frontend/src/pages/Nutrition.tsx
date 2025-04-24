import { useState } from 'react';
import { useCreateNutritionUserUserIdNutritionsPost, useDeleteNutritionUserUserIdNutritionsNutritionIdDelete } from '../api/generated/fastAPI';
import { useAuth0 } from '@auth0/auth0-react';
import { useNutrition } from '@/hooks/useNutrition';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';

export function Nutrition() {
  const { user } = useAuth0();
  const { data, isLoading, refetch } = useNutrition(user?.sub || null);
  const { mutate: createNutrition } = useCreateNutritionUserUserIdNutritionsPost({
    mutation: {
      onSuccess: () => {
        refetch();
      },
    }
  });
  const { mutate: deleteNutrition } = useDeleteNutritionUserUserIdNutritionsNutritionIdDelete({
    mutation: {
      onSuccess: () => {
        refetch();
      },
    }
  });
  const [isAdding, setIsAdding] = useState(false);
  const [newFood, setNewFood] = useState('');

  const handleAddFood = () => {
    if (!newFood) return;

    createNutrition({
      userId: user?.sub || '',
      data: {
        user_id: user?.sub || '',
        items: [newFood],
      },
    });

    setNewFood('');
    setIsAdding(false);
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Nutrition Tracking</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
        >
          Add Food
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Add New Food</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Food Name</label>
              <input
                type="text"
                value={newFood}
                onChange={(e) => setNewFood(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter food name (e.g., 'Chicken Breast')"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsAdding(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFood}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((nutrition) => (
          <div key={nutrition.id} className="bg-white rounded-lg shadow p-4 group relative">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">
                  Meal at {new Date(nutrition.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(nutrition.date).toLocaleDateString()}
                </h3>
                <p className="text-sm text-gray-500">
                  Total Calories: {nutrition.total_calories}
                </p>
              </div>
              <button
                onClick={() => handleDelete(nutrition.id)}
                className="text-gray-500 hover:text-gray-900 cursor-pointer md:opacity-0 md:group-hover:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {nutrition.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
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