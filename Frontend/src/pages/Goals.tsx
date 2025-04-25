import type { Goals } from '@/api/generated/model';
import { useGetGoalsUserUserIdGoalsGet, useUpdateGoalsUserUserIdGoalsPut } from '../api/generated/fastAPI';
import { useAuth0 } from '@auth0/auth0-react';
import { GoalCard } from '../components/goals/GoalCard';
import { LoadingSpinner } from '../components/loading/LoadingSpinner';
import { useNutritionAggregation } from '@/hooks/useNutritionAggregation';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/utils/tw';
import { UserSelect } from '@/components/goals/UserSelect';
import { useState } from 'react';
import { useGetTrainerUsersTrainerTrainerIdUsersGet } from '@/api/generated/fastAPI';

export function Goals() {
  const { isDarkMode } = useTheme();
  const { user } = useAuth0();
  const [selectedUserId, setSelectedUserId] = useState(user?.sub || '');
  const [editingGoal, setEditingGoal] = useState<string | null>(null);

  const { data: goalsData, isLoading: isLoadingGoals, refetch } = useGetGoalsUserUserIdGoalsGet(selectedUserId);
  const { mutate: updateGoals } = useUpdateGoalsUserUserIdGoalsPut({
    mutation: {
      onSuccess: () => {
        refetch();
      },
    }
  });

  const { todayData, isLoading } = useNutritionAggregation(selectedUserId, 1);
  const { data: trainees } = useGetTrainerUsersTrainerTrainerIdUsersGet(user?.sub || '', {
    status: 'active'
  });

  if (isLoadingGoals || isLoading) {
    return <LoadingSpinner />;
  }

  const handleUpdateGoal = (type: 'total_calories' | 'total_protein' | 'total_water_intake', value: number) => {
    updateGoals({
      userId: selectedUserId,
      data: {
        [type]: value,
      },
    });
  };

  const handleUserSelect = (user: { user_id: string }) => {
    setSelectedUserId(user.user_id);
    setEditingGoal(null); // Reset edit state when switching users
  };

  const goal = goalsData ? (goalsData as Goals[])[0] : null;
  const hasTrainees = trainees && trainees.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <h1 className={cn(
          "text-2xl font-bold",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>Goals</h1>
        
        {hasTrainees && (
          <UserSelect
            selectedUserId={selectedUserId}
            onSelect={handleUserSelect}
          />
        )}
      </div>
      
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
          isEditing={editingGoal === 'total_calories'}
          onEditChange={(isEditing) => setEditingGoal(isEditing ? 'total_calories' : null)}
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
          isEditing={editingGoal === 'total_protein'}
          onEditChange={(isEditing) => setEditingGoal(isEditing ? 'total_protein' : null)}
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
          isEditing={editingGoal === 'total_water_intake'}
          onEditChange={(isEditing) => setEditingGoal(isEditing ? 'total_water_intake' : null)}
        />
      </div>
    </div>
  );
} 