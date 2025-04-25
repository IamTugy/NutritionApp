import type { Goals } from '@/api/generated/model';
import { useGetGoalsUserUserIdGoalsGet, useUpdateGoalsUserUserIdGoalsPut } from '../api/generated/fastAPI';
import { useAuth0 } from '@auth0/auth0-react';
import { GoalCard } from '../components/goals/GoalCard';
import { LoadingSpinner } from '../components/loading/LoadingSpinner';
import { useNutritionAggregation } from '@/hooks/useNutritionAggregation';

export function Goals() {
  const { user } = useAuth0();
  const { data: goalsData, isLoading: isLoadingGoals, refetch } = useGetGoalsUserUserIdGoalsGet(user?.sub || '');
  const { mutate: updateGoals } = useUpdateGoalsUserUserIdGoalsPut({
    mutation: {
      onSuccess: () => {
        refetch();
      },
    }
  });

  const { todayData, isLoading } = useNutritionAggregation(user?.sub || null, 1);

  if (isLoadingGoals || isLoading) {
    return <LoadingSpinner />;
  }

  const handleUpdateGoal = (type: 'total_calories' | 'total_protein' | 'total_water_intake', value: number) => {
    updateGoals({
      userId: user?.sub || '',
      data: {
        [type]: value,
      },
    });
  };

  const goal = goalsData ? (goalsData as Goals[])[0] : null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Goals</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GoalCard
          goal={goal}
          currentValue={todayData.total_calories}
          onUpdateGoal={handleUpdateGoal}
          type="total_calories"
          title="Calories"
          unit="cal"
          color="bg-blue-600"
          presetValues={[2000, 2500, 3000]}
        />
        <GoalCard
          goal={goal}
          currentValue={todayData.total_protein}
          onUpdateGoal={handleUpdateGoal}
          type="total_protein"
          title="Protein"
          unit="g"
          color="bg-green-600"
          presetValues={[100, 150, 200]}
        />
        <GoalCard
          goal={goal}
          currentValue={todayData.total_water}
          onUpdateGoal={handleUpdateGoal}
          type="total_water_intake"
          title="Water"
          unit="g"
          color="bg-blue-400"
          presetValues={[2000, 2500, 3000]}
        />
      </div>
    </div>
  );
} 