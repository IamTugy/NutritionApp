import { cn } from '../../utils/tw';
import type { Goals } from '@/api/generated/model';
import { useState } from 'react';

interface GoalCardProps {
  goal: Goals | null;
  currentValue: number;
  onUpdateGoal: (calorieGoal: number) => void;
}

export function GoalCard({ goal, currentValue, onUpdateGoal }: GoalCardProps) {
  const [isEditing, setIsEditing] = useState(!goal);
  const [calorieGoal, setCalorieGoal] = useState(goal?.total_calories?.toString() || '');

  const progress = goal?.total_calories ? Math.min((currentValue / (goal.total_calories)) * 100, 100) : 0;

  if (isEditing || !goal) {
    return (
      <div className="bg-white p-6 rounded-lg shadow relative">
        {Boolean(goal) && <button
          onClick={() => setIsEditing(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Cancel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>}
        <h2 className="text-lg font-semibold mb-4">Daily Calorie Goal</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="calories" className="block text-sm font-medium text-gray-700">
              Enter your daily calorie goal
            </label>
            <div className="mt-1">
              <input
                type="number"
                id="calories"
                value={calorieGoal}
                onChange={(e) => setCalorieGoal(e.target.value)}
                placeholder="e.g., 2000"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-2 py-1"
              />
            </div>
          </div>
          <button
            onClick={() => {
              onUpdateGoal(Number(calorieGoal));
              setIsEditing(false);
            }}
            disabled={!calorieGoal}
            className={cn(
              'w-full px-4 py-2 rounded-md',
              'bg-blue-500 text-white hover:bg-blue-600',
              'disabled:bg-gray-300 disabled:cursor-not-allowed'
            )}
          >
            Set Goal
          </button>
          <div className="text-sm text-gray-500">
            <p>Common calorie goals:</p>
            <div className="mt-2 space-x-2">
              <button
                onClick={() => setCalorieGoal("2000")}
                className="text-blue-500 hover:text-blue-600"
              >
                2,000
              </button>
              <button
                onClick={() => setCalorieGoal("2500")}
                className="text-blue-500 hover:text-blue-600"
              >
                2,500
              </button>
              <button
                onClick={() => setCalorieGoal("3000")}
                className="text-blue-500 hover:text-blue-600"
              >
                3,000
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Daily Calorie Goal</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Current</span>
            <span>{currentValue} calories</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Target</span>
            <span>{goal?.total_calories} calories</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={cn(
                'h-2.5 rounded-full transition-all duration-300',
                progress > 100 ? 'bg-green-500' : 'bg-blue-600'
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className={cn(
            'w-full px-4 py-2 rounded-md',
            'bg-gray-100 text-gray-700 hover:bg-gray-200',
            'transition-colors duration-200'
          )}
        >
          Change Goal
        </button>
      </div>
    </div>
  );
} 