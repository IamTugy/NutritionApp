import { useGetNutritionUsersUserIdNutritionsGet } from "@/api/generated/fastAPI";
import { endOfDay, subDays } from "date-fns";
import { startOfDay } from "date-fns";

export const useNutrition = (
    user_id: string | null,
    days: number = 7
) => useGetNutritionUsersUserIdNutritionsGet(
    user_id || "",
    {
      start_date: startOfDay(subDays(new Date(), days)).toISOString(),
      end_date: endOfDay(new Date()).toISOString(),
    },
    {
      query: {
        initialData: [],
        refetchOnMount: true,
      },
    }
  )