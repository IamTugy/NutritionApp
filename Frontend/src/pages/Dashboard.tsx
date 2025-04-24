import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useGetGoalsUserUserIdGoalsGet } from '../api/generated/fastAPI';
import { useAuth0 } from '@auth0/auth0-react';
import { LoadingSpinner } from '../components/loading/LoadingSpinner';
import { useNutritionAggregation } from '@/hooks/useNutritionAggregation';
import { useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/utils/tw';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function Dashboard() {
  const { user } = useAuth0();
  const { isDarkMode } = useTheme();
  const { data, isLoading } = useNutritionAggregation(user?.sub || null, 7);
  const { data: goalsData, isLoading: isLoadingGoals } = useGetGoalsUserUserIdGoalsGet(user?.sub || '');
  const { data: todaysNutritionData, isLoading: isLoadingTodaysNutrition } = useNutritionAggregation(user?.sub || null, 1);

  const myGoals = useMemo(() => {
    return goalsData?.filter(g => g.user_id === user?.sub)?.[0];
  }, [goalsData, user?.sub]);

  const chartData = useMemo(() => ({
    labels: data.map(n => new Date(n.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Calories',
        data: data.map(n => n.total_calories),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Protein (g)',
        data: data.map(n => n.total_protein),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
      {
        label: 'Calories Goal',
        data: data.map(() => myGoals?.total_calories || 0),
        borderColor: 'rgb(75, 192, 192)',
        borderDash: [5, 5],
        borderWidth: 2,
        pointRadius: 0,
        tension: 0,
      },
    ],
  }), [data, myGoals?.total_calories]);

  if (isLoading || isLoadingGoals || isLoadingTodaysNutrition) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <h1 className={cn(
        "text-2xl font-bold",
        isDarkMode ? "text-white" : "text-gray-900"
      )}>Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={cn(
          "p-6 rounded-lg shadow",
          isDarkMode ? "bg-gray-800" : "bg-white"
        )}>
          <h3 className={cn(
            "text-lg font-semibold mb-2",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>Today's Calories</h3>
          <p className="text-3xl font-bold text-blue-600">{todaysNutritionData[0].total_calories}</p>
          <p className={cn(
            "text-sm",
            isDarkMode ? "text-gray-400" : "text-gray-500"
          )}>Goal: {myGoals?.total_calories || 'N/A'}</p>
        </div>
        <div className={cn(
          "p-6 rounded-lg shadow",
          isDarkMode ? "bg-gray-800" : "bg-white"
        )}>
          <h3 className={cn(
            "text-lg font-semibold mb-2",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>Protein Intake</h3>
          <p className="text-3xl font-bold text-green-600">{todaysNutritionData[0].total_protein}g</p>
          <p className={cn(
            "text-sm",
            isDarkMode ? "text-gray-400" : "text-gray-500"
          )}>Goal: {myGoals?.total_protein ? `${myGoals.total_protein}g` : 'N/A'}</p>
        </div>
        <div className={cn(
          "p-6 rounded-lg shadow",
          isDarkMode ? "bg-gray-800" : "bg-white"
        )}>
          <h3 className={cn(
            "text-lg font-semibold mb-2",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>Water Intake</h3>
          <p className="text-3xl font-bold text-blue-400">{todaysNutritionData[0].total_water}L</p>
          <p className={cn(
            "text-sm",
            isDarkMode ? "text-gray-400" : "text-gray-500"
          )}>Goal: {myGoals?.total_water_intake ? `${myGoals.total_water_intake}L` : 'N/A'}</p>
        </div>
      </div>

      <div className={cn(
        "p-6 rounded-lg shadow",
        isDarkMode ? "bg-gray-800" : "bg-white"
      )}>
        <h2 className={cn(
          "text-lg font-semibold mb-4",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>Nutrition Overview</h2>
        <div className="h-96">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
                  labels: {
                    color: isDarkMode ? 'white' : 'black'
                  }
                },
                title: {
                  display: true,
                  text: 'Weekly Nutrition Progress',
                  color: isDarkMode ? 'white' : 'black'
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                  },
                  ticks: {
                    color: isDarkMode ? 'white' : 'black'
                  }
                },
                x: {
                  grid: {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                  },
                  ticks: {
                    color: isDarkMode ? 'white' : 'black'
                  }
                }
              },
            }}
          />
        </div>
      </div>
    </div>
  );
} 