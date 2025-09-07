import { useState } from 'react';
import { Button } from '../components/common/Button';
import { Card, CardContent, CardTitle } from '../components/common/Card';

// Sample data for meal planning
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

// Sample recipe data
const sampleRecipes = [
  { id: 1, name: 'Avocado Toast', type: 'Breakfast', calories: 350 },
  { id: 2, name: 'Grilled Chicken Salad', type: 'Lunch', calories: 420 },
  { id: 3, name: 'Pasta Primavera', type: 'Dinner', calories: 550 },
  { id: 4, name: 'Fruit Smoothie', type: 'Breakfast', calories: 280 },
  { id: 5, name: 'Vegetable Soup', type: 'Lunch', calories: 320 },
];

const MealPlannerPage = () => {
  const [currentWeek] = useState<string>('Week of September 7, 2025');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-800">Meal Planner</h1>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            }
          >
            Previous Week
          </Button>
          <Button 
            variant="outline" 
            rightIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            }
          >
            Next Week
          </Button>
        </div>
      </div>
      
      <div className="text-center mb-6">
        <h2 className="text-xl font-medium text-neutral-600">{currentWeek}</h2>
      </div>
      
      {/* Week Calendar Grid */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="grid grid-cols-7 border-b border-neutral-200">
          {daysOfWeek.map((day) => (
            <div 
              key={day} 
              className={`p-4 text-center cursor-pointer hover:bg-primary-50 transition-colors ${selectedDay === day ? 'bg-primary-50 border-t-2 border-primary-500' : ''}`}
              onClick={() => setSelectedDay(day)}
            >
              <div className="font-medium text-neutral-800">{day}</div>
              <div className="text-xs text-neutral-500 mt-1">Sep {daysOfWeek.indexOf(day) + 7}</div>
            </div>
          ))}
        </div>
        
        <div className="divide-y divide-neutral-200">
          {mealTypes.map((meal) => (
            <div key={meal} className="grid grid-cols-7 hover:bg-neutral-50">
              <div className="py-3 px-4 font-medium text-neutral-600 border-r border-neutral-200">
                {meal}
              </div>
              {daysOfWeek.map((day) => {
                const hasRecipe = Math.random() > 0.5;
                return (
                  <div 
                    key={`${day}-${meal}`} 
                    className="py-3 px-4 text-center cursor-pointer hover:bg-primary-50"
                    onClick={() => {
                      setSelectedDay(day);
                      setSelectedMeal(meal);
                    }}
                  >
                    {hasRecipe ? (
                      <div className="text-sm text-primary-600 font-medium">
                        {sampleRecipes[Math.floor(Math.random() * sampleRecipes.length)].name}
                      </div>
                    ) : (
                      <div className="text-sm text-neutral-400">+ Add meal</div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Recipe Suggestions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-neutral-800 mb-4">Recipe Suggestions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sampleRecipes.map((recipe) => (
            <Card key={recipe.id}>
              <CardContent className="p-4">
                <CardTitle className="mb-2">{recipe.name}</CardTitle>
                <div className="flex justify-between text-sm text-neutral-500">
                  <span>{recipe.type}</span>
                  <span>{recipe.calories} calories</span>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      if (selectedDay && selectedMeal) {
                        // Logic to add recipe to meal plan
                        alert(`Added ${recipe.name} to ${selectedMeal} on ${selectedDay}`);
                      } else {
                        alert('Please select a day and meal first');
                      }
                    }}
                  >
                    Add to Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
              <path d="M16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
          }
        >
          Generate Shopping List
        </Button>
      </div>
    </div>
  );
};

export default MealPlannerPage;
