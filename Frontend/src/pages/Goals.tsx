import { useGetGoalsUserUserIdGoalsGet, useUpdateGoalsUserUserIdGoalsPut } from '../api/generated/fastAPI';
import { useAuth0 } from '@auth0/auth0-react';

export function Goals() {
  const { user } = useAuth0();
  const { data: goalsData, isLoading } = useGetGoalsUserUserIdGoalsGet(user?.sub || '');
  const { mutate: updateGoals } = useUpdateGoalsUserUserIdGoalsPut();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleUpdateGoal = (newValue: number) => {
    updateGoals({
      userId: user?.sub || '',
      data: {
        total_calories: newValue,
      },
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Goals</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Daily Calorie Goal</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Current</span>
              <span>{goalsData?.total_calories || 0} calories</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Target</span>
              <span>2,000 calories</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{
                  width: `${((goalsData?.total_calories || 0) / 2000) * 100}%`,
                }}
              ></div>
            </div>
            <button
              onClick={() => handleUpdateGoal(2000)}
              className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Set to 2,000 calories
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 