import type { Goals, NutritionSnapshot } from '@/api/generated/model';
import { useGetGoalsUserUserIdGoalsGet, useUpdateGoalsUserUserIdGoalsPut } from '../api/generated/fastAPI';
import { useAuth0 } from '@auth0/auth0-react';
import { GoalCard } from '../components/goals/GoalCard';
import { useNutrition } from '@/hooks/useNutrition';
import { LoadingSpinner } from '../components/loading/LoadingSpinner';

export function Goals() {
  const { user } = useAuth0();
  const { data: goalsData, isLoading: isLoadingGoals } = useGetGoalsUserUserIdGoalsGet(user?.sub || '');
  const { mutate: updateGoals } = useUpdateGoalsUserUserIdGoalsPut();

  const { data: nutritionData, isLoading: isLoadingNutrition } = useNutrition(user?.sub || null, 1);

  if (isLoadingGoals || isLoadingNutrition) {
    return <LoadingSpinner />;
  }

  const handleUpdateGoal = (newValue: number) => {
    updateGoals({
      userId: user?.sub || '',
      data: {
        total_calories: newValue,
      },
    });
  };

  const goal = goalsData ? (goalsData as Goals[])[0] : null;
  const todayCalories = (nutritionData as NutritionSnapshot[] || []).reduce(
    (sum: number, item: NutritionSnapshot) => sum + item.total_calories,
    0
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Goals</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GoalCard
          goal={goal}
          currentValue={todayCalories}
          onUpdateGoal={handleUpdateGoal}
        />
      </div>
    </div>
  );
} 