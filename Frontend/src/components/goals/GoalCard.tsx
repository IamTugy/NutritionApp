import { cn } from '../../utils/tw';
import type { Goals } from '@/api/generated/model';
import { useState } from 'react';

interface GoalCardProps {
  goal: Goals | null;
  currentValue: number;
  onUpdateGoal: (type: 'total_calories' | 'total_protein' | 'total_water_intake', value: number) => void;
  type: 'total_calories' | 'total_protein' | 'total_water_intake';
  title: string;
  unit: string;
  color: string;
}

export function GoalCard({ goal, currentValue, onUpdateGoal, type, title, unit, color }: GoalCardProps) {
  const [isEditing, setIsEditing] = useState(!goal);
  const [goalValue, setGoalValue] = useState(goal?.[type]?.toString() || '');

  const progress = goal?.[type] ? Math.min((currentValue / (goal[type] || 1)) * 100, 100) : 0;

  if (isEditing || !goal) {
    return (
      <div className="bg-white p-6 rounded-lg shadow relative">
        {Boolean(goal) && <button
          onClick={() => setIsEditing(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
          aria-label="Cancel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>}
        <h2 className="text-lg font-semibold mb-4">{title} Goal</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
              Enter your daily {title.toLowerCase()} goal
            </label>
            <div className="mt-1">
              <input
                type="number"
                id="goal"
                value={goalValue}
                onChange={(e) => setGoalValue(e.target.value)}
                placeholder={`e.g., ${type === 'total_calories' ? '2000' : type === 'total_protein' ? '150' : '2.5'}`}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-2 py-1"
              />
            </div>
          </div>
          <button
            onClick={() => {
              onUpdateGoal(type, Number(goalValue));
              setIsEditing(false);
            }}
            disabled={!goalValue}
            className={cn(
              'w-full px-4 py-2 rounded-md cursor-pointer',
              'bg-blue-500 text-white hover:bg-blue-600',
              'disabled:bg-gray-300 disabled:cursor-not-allowed'
            )}
          >
            Set Goal
          </button>
          <div className="text-sm text-gray-500">
            <p>Common {title.toLowerCase()} goals:</p>
            <div className="mt-2 space-x-2">
              {type === 'total_calories' && (
                <>
                  <button onClick={() => setGoalValue("2000")} className="text-blue-500 hover:text-blue-600 cursor-pointer">2,000</button>
                  <button onClick={() => setGoalValue("2500")} className="text-blue-500 hover:text-blue-600 cursor-pointer">2,500</button>
                  <button onClick={() => setGoalValue("3000")} className="text-blue-500 hover:text-blue-600 cursor-pointer">3,000</button>
                </>
              )}
              {type === 'total_protein' && (
                <>
                  <button onClick={() => setGoalValue("100")} className="text-blue-500 hover:text-blue-600 cursor-pointer">100g</button>
                  <button onClick={() => setGoalValue("150")} className="text-blue-500 hover:text-blue-600 cursor-pointer">150g</button>
                  <button onClick={() => setGoalValue("200")} className="text-blue-500 hover:text-blue-600 cursor-pointer">200g</button>
                </>
              )}
              {type === 'total_water_intake' && (
                <>
                  <button onClick={() => setGoalValue("2")} className="text-blue-500 hover:text-blue-600 cursor-pointer">2L</button>
                  <button onClick={() => setGoalValue("2.5")} className="text-blue-500 hover:text-blue-600 cursor-pointer">2.5L</button>
                  <button onClick={() => setGoalValue("3")} className="text-blue-500 hover:text-blue-600 cursor-pointer">3L</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">{title} Goal</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Current</span>
            <span>{currentValue} {unit}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Target</span>
            <span>{goal[type]} {unit}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={cn(
                'h-2.5 rounded-full transition-all duration-300',
                progress > 100 ? 'bg-green-500' : color
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className={cn(
            'w-full px-4 py-2 rounded-md cursor-pointer',
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