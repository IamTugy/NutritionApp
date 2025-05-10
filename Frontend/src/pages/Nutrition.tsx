import { useDeleteNutritionUserUserIdNutritionsNutritionIdDelete } from '../api/generated/fastAPI';
import { useAuth0 } from '@auth0/auth0-react';
import { useNutrition } from '@/hooks/useNutrition';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/utils/tw';
import { UserSelect } from '@/components/goals/UserSelect';
import { useState } from 'react';
import { useGetTrainerUsersTrainerTrainerIdUsersGet } from '@/api/generated/fastAPI';

export function Nutrition() {
  const { user } = useAuth0();
  const { isDarkMode } = useTheme();
  const [selectedUserId, setSelectedUserId] = useState(user?.sub || '');
  const { data, isLoading, refetch } = useNutrition(selectedUserId);
  const { data: trainees } = useGetTrainerUsersTrainerTrainerIdUsersGet(user?.sub || '', {
    status: 'active'
  });

  const { mutate: deleteNutrition } = useDeleteNutritionUserUserIdNutritionsNutritionIdDelete({
    mutation: {
      onSuccess: () => {
        refetch();
      },
    }
  });

  const handleDelete = (nutritionId: string) => {
    deleteNutrition({
      userId: selectedUserId,
      nutritionId,
    });
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  const hasTrainees = trainees && trainees.length > 0;
  const hasSnapshots = data && data.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0 pb-4">
          <h1 className={cn(
            "text-2xl font-bold",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>Nutrition</h1>

          {hasTrainees && <UserSelect
            onSelect={(user) => setSelectedUserId(user.user_id)}
            selectedUserId={selectedUserId}
          />}
        </div>
      </div>

      {!hasSnapshots ? (
        <div className={cn(
          "rounded-lg shadow p-8 text-center max-w-[500px] mx-auto",
          isDarkMode ? "bg-gray-800" : "bg-white"
        )}>
          <div className="flex flex-col items-center space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" className={cn(
              "h-16 w-16",
              isDarkMode ? "text-gray-600" : "text-gray-400"
            )} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className={cn(
              "text-xl font-semibold",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              No Nutrition Records Found
            </h3>
            <p className={cn(
              "text-sm max-w-md",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>
              Start tracking your nutrition by adding your first meal. You can add meals through the mobile app or web interface.
            </p>
          </div>
        </div>
      ) : (
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
              <div className="mt-2 space-y-2 md:max-h-[125px] overflow-y-auto">
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
      )}
    </div>
  );
} 