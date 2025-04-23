import { Line } from 'react-chartjs-2';
import { startOfDay, endOfDay, subDays } from 'date-fns'
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
import { useGetNutritionUsersUserIdNutritionsGet } from '../api/generated/fastAPI';
import { useAuth0 } from '@auth0/auth0-react';
import { useNutrition } from '@/hooks/useNutrition';
import { LoadingSpinner } from '../components/loading/LoadingSpinner';

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
  const { data, isLoading } = useNutrition(user?.sub || null);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const chartData = {
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
        data: data.map(n => n.items.reduce((sum: number, item) => sum + (item.protein || 0), 0)),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  const latestNutrition = data[0];
  const totalProtein = latestNutrition?.items.reduce((sum: number, item) => sum + (item.protein || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Today's Calories</h3>
          <p className="text-3xl font-bold text-blue-600">{latestNutrition?.total_calories || 0}</p>
          <p className="text-sm text-gray-500">Goal: 2,000</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Protein Intake</h3>
          <p className="text-3xl font-bold text-green-600">{totalProtein}g</p>
          <p className="text-sm text-gray-500">Goal: 150g</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Water Intake</h3>
          <p className="text-3xl font-bold text-blue-400">0L</p>
          <p className="text-sm text-gray-500">Goal: 2.5L</p>
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
            }}
          />
        </div>
      </div>
    </div>
  );
} 