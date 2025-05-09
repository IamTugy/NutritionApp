import type { NutritionSnapshot } from '../api/generated/model';
import { useNutrition } from './useNutrition';
import { format, parseISO, startOfDay } from 'date-fns';

interface AggregatedNutrition {
  date: string;
  total_calories: number;
  total_protein: number;
  total_water: number;
  items: NutritionSnapshot['items'];
}

export function useNutritionAggregation(
    user_id: string | null,
    days: number = 7
) {
  const { data, isLoading, ...rest } = useNutrition(user_id, days);

  // Group nutrition data by date
  const aggregatedData = data?.reduce((acc: Record<string, AggregatedNutrition>, snapshot) => {
    const date = format(parseISO(snapshot.date), 'yyyy-MM-dd');
    
    if (!acc[date]) {
      acc[date] = {
        date,
        total_calories: 0,
        total_protein: 0,
        total_water: 0,
        items: [],
      };
    }

    acc[date].total_calories += snapshot.total_calories;
    acc[date].total_protein += snapshot.items.reduce((sum, item) => sum + (item.protein || 0), 0);
    acc[date].total_water += snapshot.items.reduce((sum, item) => sum + (item.water || 0), 0);
    acc[date].items.push(...snapshot.items);

    return acc;
  }, {});

  // Convert to array and sort by date
  const sortedData = Object.values(aggregatedData || {}).sort((a, b) => 
    parseISO(a.date).getTime() - parseISO(b.date).getTime()
  );

  // Get today's data
  const today = format(startOfDay(new Date()), 'yyyy-MM-dd');
  const todayData = aggregatedData?.[today] || {
    date: today,
    total_calories: 0,
    total_protein: 0,
    total_water: 0,
    items: [],
  };

  return {
    data: sortedData,
    todayData,
    isLoading,
    ...rest,
  };
} 