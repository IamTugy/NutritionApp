import { useMealPlate } from '@/contexts/MealPlateContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/utils/tw';
import { useCreateNutritionUserUserIdNutritionsPost } from '@/api/generated/fastAPI';
import { useAuth0 } from '@auth0/auth0-react';
import { useNutrition } from '@/hooks/useNutrition';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

interface MealPlateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MealPlateModal({ isOpen, onClose }: MealPlateModalProps) {
  const { isDarkMode } = useTheme();
  const { user } = useAuth0();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const { items, removeItem, updateQuantity, clearPlate, totalCalories, totalProtein, totalCarbs, totalFat, totalWater } = useMealPlate();
  const { refetch } = useNutrition(user?.sub || null);
  const { mutate: createNutrition } = useCreateNutritionUserUserIdNutritionsPost({
    mutation: {
      onSuccess: () => {
        refetch();
        clearPlate();
        onClose();
        navigate({ to: '/nutrition' });
      },
      onError: () => {
        setIsSaving(false);
      }
    }
  });

  if (!isOpen) return null;

  const handleSaveMeal = () => {
    if (!user?.sub || items.length === 0 || isSaving) return;
    
    setIsSaving(true);
    createNutrition({
      userId: user.sub,
      data: {
        user_id: user.sub,
        items: items.map(item => item.food_name),
      },
    });
  };

  const formatNumber = (num: number) => {
    return Number(num.toFixed(2));
  };

  return (
    <div className="fixed size-full inset-0 bg-black/10 flex items-center justify-center z-50">
      <div className={cn(
        "size-full max-h-full md:h-auto md:max-w-2xl md:rounded-lg shadow-lg",
        isDarkMode ? "bg-gray-800" : "bg-white"
      )}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className={cn(
            "text-xl font-semibold",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>Meal Plate</h2>
          <button
            onClick={onClose}
            className={cn(
              "text-gray-500 hover:text-gray-700",
              isDarkMode && "text-gray-400 hover:text-gray-200"
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {items.map((item) => (
            <div key={item.id} className={cn(
              "flex justify-between items-center p-3 rounded",
              isDarkMode ? "bg-gray-700" : "bg-gray-50"
            )}>
              <div>
                <h3 className={cn(
                  "font-medium",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>{item.food_name}</h3>
                <p className={cn(
                  "text-sm",
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                )}>{formatNumber(item.calories)} calories</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className={cn(
                      "px-2 py-1 rounded-md",
                      isDarkMode 
                        ? "bg-gray-600 text-white hover:bg-gray-500" 
                        : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                    )}
                  >
                    -
                  </button>
                  <span className={cn(
                    "font-medium",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className={cn(
                      "px-2 py-1 rounded-md",
                      isDarkMode 
                        ? "bg-gray-600 text-white hover:bg-gray-500" 
                        : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                    )}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className={cn(
                    "text-gray-500 hover:text-gray-700",
                    isDarkMode && "text-gray-400 hover:text-gray-200"
                  )}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {items.length > 0 && (
            <div className={cn(
              "p-4 rounded-lg",
              isDarkMode ? "bg-gray-700" : "bg-gray-50"
            )}>
              <h3 className={cn(
                "font-semibold mb-2",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>Totals</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className={cn(
                    "text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}>Calories</p>
                  <p className={cn(
                    "font-medium",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>{formatNumber(totalCalories)}</p>
                </div>
                <div>
                  <p className={cn(
                    "text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}>Protein</p>
                  <p className={cn(
                    "font-medium",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>{formatNumber(totalProtein)}g</p>
                </div>
                <div>
                  <p className={cn(
                    "text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}>Carbs</p>
                  <p className={cn(
                    "font-medium",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>{formatNumber(totalCarbs)}g</p>
                </div>
                <div>
                  <p className={cn(
                    "text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}>Fat</p>
                  <p className={cn(
                    "font-medium",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>{formatNumber(totalFat)}g</p>
                </div>
                <div>
                  <p className={cn(
                    "text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}>Water</p>
                  <p className={cn(
                    "font-medium",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>{formatNumber(totalWater)}L</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t">
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              disabled={isSaving}
              className={cn(
                "px-4 py-2 rounded-md",
                isDarkMode 
                  ? "bg-gray-700 text-white hover:bg-gray-600" 
                  : "bg-gray-200 text-gray-900 hover:bg-gray-300",
                isSaving && "opacity-50 cursor-not-allowed"
              )}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveMeal}
              disabled={items.length === 0 || isSaving}
              className={cn(
                "px-4 py-2 rounded-md flex items-center space-x-2",
                items.length === 0 || isSaving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600",
                "text-white"
              )}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Meal</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 