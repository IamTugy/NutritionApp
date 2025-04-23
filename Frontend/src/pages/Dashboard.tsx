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
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Today's Calories</h3>
          <p className="text-3xl font-bold text-blue-600">{todaysNutritionData[0].total_calories}</p>
          <p className="text-sm text-gray-500">Goal: {myGoals?.total_calories || 'N/A'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Protein Intake</h3>
          <p className="text-3xl font-bold text-green-600">{todaysNutritionData[0].total_protein}g</p>
          <p className="text-sm text-gray-500">Goal: {myGoals?.total_protein ? `${myGoals.total_protein}g` : 'N/A'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Water Intake</h3>
          <p className="text-3xl font-bold text-blue-400">{todaysNutritionData[0].total_water}L</p>
          <p className="text-sm text-gray-500">Goal: {myGoals?.total_water_intake ? `${myGoals.total_water_intake}L` : 'N/A'}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Nutrition Overview</h2>
        <div className="h-96">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                title: {
                  display: true,
                  text: 'Weekly Nutrition Progress',
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
} 