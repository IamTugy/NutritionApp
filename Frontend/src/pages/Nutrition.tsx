import { useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useGetNutritionUsersUserIdNutritionsGet, useCreateNutritionUserUserIdNutritionsPost, useDeleteNutritionUserUserIdNutritionsNutritionIdDelete } from '../api/generated/fastAPI';
import { useAuth0 } from '@auth0/auth0-react';
import { useRef } from 'react';

export function Nutrition() {
  const { user } = useAuth0();
  const { data: nutritionData, isLoading } = useGetNutritionUsersUserIdNutritionsGet(user?.sub || '');
  const { mutate: createNutrition } = useCreateNutritionUserUserIdNutritionsPost();
  const { mutate: deleteNutrition } = useDeleteNutritionUserUserIdNutritionsNutritionIdDelete();
  const [isAdding, setIsAdding] = useState(false);
  const [newFood, setNewFood] = useState('');

  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: nutritionData?.length || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

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
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Nutrition Tracking</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
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
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFood}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        ref={parentRef}
        className="h-[600px] overflow-auto bg-white rounded-lg shadow"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const nutrition = nutritionData?.[virtualRow.index];
            if (!nutrition) return null;

            return (
              <div
                key={nutrition.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                className="border-b border-gray-200"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {new Date(nutrition.date).toLocaleDateString()}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Total Calories: {nutrition.total_calories}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(nutrition.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 