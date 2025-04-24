import { cn } from '../../utils/tw';
import type { Goals } from '@/api/generated/model';
import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { isDarkMode } = useTheme();

  const progress = goal?.[type] ? Math.min((currentValue / (goal[type] || 1)) * 100, 100) : 0;

  if (isEditing || !goal) {
    return (
      <div className={cn(
        "p-6 rounded-lg shadow relative",
        isDarkMode ? "bg-gray-800" : "bg-white"
      )}>
        {Boolean(goal) && <button
          onClick={() => setIsEditing(false)}
          className={cn(
            "absolute top-2 right-2 focus:outline-none cursor-pointer",
            isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
          )}
          aria-label="Cancel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>}
        <h2 className={cn(
          "text-lg font-semibold mb-4",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>{title} Goal</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="goal" className={cn(
              "block text-sm font-medium",
              isDarkMode ? "text-gray-300" : "text-gray-700"
            )}>
              Enter your daily {title.toLowerCase()} goal
            </label>
            <div className="mt-1">
              <input
                type="number"
                id="goal"
                value={goalValue}
                onChange={(e) => setGoalValue(e.target.value)}
                placeholder={`e.g., ${type === 'total_calories' ? '2000' : type === 'total_protein' ? '150' : '2.5'}`}
                className={cn(
                  "block w-full rounded-md shadow-sm sm:text-sm px-2 py-1",
                  isDarkMode 
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500" 
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                )}
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
          <div className={cn(
            "text-sm",
            isDarkMode ? "text-gray-400" : "text-gray-500"
          )}>
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
    <div className={cn(
      "p-6 rounded-lg shadow",
      isDarkMode ? "bg-gray-800" : "bg-white"
    )}>
      <h2 className={cn(
        "text-lg font-semibold mb-4",
        isDarkMode ? "text-white" : "text-gray-900"
      )}>{title} Goal</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className={cn(
            "flex justify-between text-sm",
            isDarkMode ? "text-gray-300" : "text-gray-600"
          )}>
            <span>Current</span>
            <span>{currentValue} {unit}</span>
          </div>
          <div className={cn(
            "flex justify-between text-sm",
            isDarkMode ? "text-gray-300" : "text-gray-600"
          )}>
            <span>Target</span>
            <span>{goal[type]} {unit}</span>
          </div>
          <div className={cn(
            "w-full rounded-full h-2.5",
            isDarkMode ? "bg-gray-700" : "bg-gray-200"
          )}>
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
            'w-full px-4 py-2 rounded-md cursor-pointer transition-colors duration-200',
            isDarkMode 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          Change Goal
        </button>
      </div>
    </div>
  );
} 