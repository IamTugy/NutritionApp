 import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { NutritionItem } from '@/api/generated/model';

interface MealPlateItem extends NutritionItem {
  id: string;
  quantity: number;
}

interface MealPlateContextType {
  items: MealPlateItem[];
  addItem: (item: NutritionItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearPlate: () => void;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalWater: number;
}

const MealPlateContext = createContext<MealPlateContextType | undefined>(undefined);

export function MealPlateProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<MealPlateItem[]>([]);

  const addItem = (item: NutritionItem) => {
    setItems(prev => {
      const existingItem = prev.find(i => i.food_name === item.food_name);
      if (existingItem) {
        return prev.map(i => 
          i.id === existingItem.id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, id: crypto.randomUUID(), quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const clearPlate = () => {
    setItems([]);
  };

  const totalCalories = items.reduce((sum, item) => sum + (item.calories || 0) * item.quantity, 0);
  const totalProtein = items.reduce((sum, item) => sum + (item.protein || 0) * item.quantity, 0);
  const totalCarbs = items.reduce((sum, item) => sum + (item.carbohydrates || 0) * item.quantity, 0);
  const totalFat = items.reduce((sum, item) => sum + (item.fat || 0) * item.quantity, 0);
  const totalWater = items.reduce((sum, item) => sum + (item.water || 0) * item.quantity, 0);

  return (
    <MealPlateContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearPlate,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      totalWater,
    }}>
      {children}
    </MealPlateContext.Provider>
  );
}

export function useMealPlate() {
  const context = useContext(MealPlateContext);
  if (context === undefined) {
    throw new Error('useMealPlate must be used within a MealPlateProvider');
  }
  return context;
}
