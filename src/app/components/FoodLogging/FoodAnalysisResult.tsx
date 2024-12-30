import type { FoodAnalysisResult } from '@/app/lib/gemini';

interface FoodAnalysisResultProps {
  result: FoodAnalysisResult;
  isLoading?: boolean;
}

export default function FoodAnalysisResult({ result, isLoading }: FoodAnalysisResultProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Analysis Results</h3>
        <div className="space-y-3 sm:space-y-4">
          {result.items.map((item, index) => (
            <div key={index} className="border-b border-gray-200 pb-3 last:border-0">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0">
                <div>
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base">{item.name}</h4>
                  {item.portion && (
                    <p className="text-xs sm:text-sm text-gray-500">{item.portion}</p>
                  )}
                </div>
                <span className="text-sm sm:text-base text-gray-900 font-medium">{item.calories} cal</span>
              </div>
              {(item.protein || item.carbs || item.fat) && (
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs sm:text-sm text-gray-500">
                  {item.protein && (
                    <div>
                      <span className="font-medium">{item.protein}g</span> protein
                    </div>
                  )}
                  {item.carbs && (
                    <div>
                      <span className="font-medium">{item.carbs}g</span> carbs
                    </div>
                  )}
                  {item.fat && (
                    <div>
                      <span className="font-medium">{item.fat}g</span> fat
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900 text-sm sm:text-base">Total Calories</span>
            <span className="text-lg sm:text-xl font-bold text-indigo-600">
              {result.totalCalories}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 