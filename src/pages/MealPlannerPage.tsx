import { useState, useEffect } from "react";
import { Button } from "../components/common/Button";
import { Card, CardContent, CardTitle } from "../components/common/Card";
import { useNavigate } from "react-router-dom";
import { useShopping } from "../context/ShoppingContext";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import storageService from "../services/storageService";
import "../components/planner/MealPlanner.css";
import DragIndicator from "../components/planner/DragIndicator";

// Sample data for meal planning
const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];

// Types for meal planning
interface RecipeItem {
  id: number;
  name: string;
  type: string;
  calories: number;
  imageUrl?: string;
}

interface MealPlan {
  [day: string]: {
    [meal: string]: RecipeItem | null;
  };
}

// Sample recipe data
const sampleRecipes: RecipeItem[] = [
  { id: 1, name: "Avocado Toast", type: "Breakfast", calories: 350, imageUrl: "https://source.unsplash.com/random/300x200/?avocado-toast" },
  { id: 2, name: "Grilled Chicken Salad", type: "Lunch", calories: 420, imageUrl: "https://source.unsplash.com/random/300x200/?chicken-salad" },
  { id: 3, name: "Pasta Primavera", type: "Dinner", calories: 550, imageUrl: "https://source.unsplash.com/random/300x200/?pasta" },
  { id: 4, name: "Fruit Smoothie", type: "Breakfast", calories: 280, imageUrl: "https://source.unsplash.com/random/300x200/?smoothie" },
  { id: 5, name: "Vegetable Soup", type: "Lunch", calories: 320, imageUrl: "https://source.unsplash.com/random/300x200/?soup" },
  { id: 6, name: "Quinoa Bowl", type: "Lunch", calories: 380, imageUrl: "https://source.unsplash.com/random/300x200/?quinoa" },
  { id: 7, name: "Grilled Salmon", type: "Dinner", calories: 450, imageUrl: "https://source.unsplash.com/random/300x200/?salmon" },
  { id: 8, name: "Overnight Oats", type: "Breakfast", calories: 310, imageUrl: "https://source.unsplash.com/random/300x200/?oats" },
  { id: 9, name: "Stir-Fry Vegetables", type: "Dinner", calories: 380, imageUrl: "https://source.unsplash.com/random/300x200/?stir-fry" },
];

const MealPlannerPage = () => {
  const [currentWeekDate, setCurrentWeekDate] = useState<Date>(new Date());
  const [currentWeek, setCurrentWeek] = useState<string>(
    getWeekString(new Date())
  );
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [activeDragRecipe, setActiveDragRecipe] = useState<RecipeItem | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan>(() => {
    // Initialize meal plan from storage or with empty slots
    const storedPlan = storageService.getItem<MealPlan>(
      `meal-plan-${getWeekIdentifier(currentWeekDate)}`,
      initializeEmptyMealPlan()
    );
    return storedPlan;
  });
  
  const navigate = useNavigate();
  const { generateListFromMealPlan } = useShopping();

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10, // 10px of movement before drag starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // 250ms delay on touch devices
        tolerance: 5, // 5px of movement allowed during delay
      },
    })
  );

  // Helper function to get week string
  function getWeekString(date: Date): string {
    const startOfWeek = new Date(date);
    // Set to the beginning of the week (Sunday)
    startOfWeek.setDate(date.getDate() - date.getDay());

    const month = startOfWeek.toLocaleString("default", { month: "long" });
    const day = startOfWeek.getDate();
    const year = startOfWeek.getFullYear();

    return `Week of ${month} ${day}, ${year}`;
  }
  
  // Helper to get a unique identifier for the current week
  function getWeekIdentifier(date: Date): string {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    return `${startOfWeek.getFullYear()}-${startOfWeek.getMonth() + 1}-${startOfWeek.getDate()}`;
  }
  
  // Initialize empty meal plan
  function initializeEmptyMealPlan(): MealPlan {
    const plan: MealPlan = {};
    daysOfWeek.forEach(day => {
      plan[day] = {};
      mealTypes.forEach(meal => {
        plan[day][meal] = null;
      });
    });
    return plan;
  }
  
  // Save meal plan whenever it changes
  useEffect(() => {
    const weekId = getWeekIdentifier(currentWeekDate);
    storageService.setItem(`meal-plan-${weekId}`, mealPlan);
  }, [mealPlan, currentWeekDate]);
  
  // Load meal plan when week changes
  useEffect(() => {
    const weekId = getWeekIdentifier(currentWeekDate);
    const storedPlan = storageService.getItem<MealPlan>(
      `meal-plan-${weekId}`,
      initializeEmptyMealPlan()
    );
    setMealPlan(storedPlan);
  }, [currentWeekDate]);

  // Navigate to previous week
  const goToPreviousWeek = () => {
    const prevWeek = new Date(currentWeekDate);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setCurrentWeekDate(prevWeek);
    setCurrentWeek(getWeekString(prevWeek));
  };

  // Navigate to next week
  const goToNextWeek = () => {
    const nextWeek = new Date(currentWeekDate);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setCurrentWeekDate(nextWeek);
    setCurrentWeek(getWeekString(nextWeek));
  };

  // Generate shopping list for the current week
  const handleGenerateShoppingList = async () => {
    try {
      // Calculate start and end dates for the current week
      const startDate = new Date(currentWeekDate);
      startDate.setDate(startDate.getDate() - startDate.getDay()); // Sunday

      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6); // Saturday

      // Generate shopping list
      const listId = await generateListFromMealPlan(startDate, endDate);

      // Navigate to the shopping list
      navigate(`/shopping-lists/${listId}`);
    } catch (error) {
      console.error("Error generating shopping list:", error);
      alert("Failed to generate shopping list. Please try again.");
    }
  };
  
  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    // If dragging from the recipe list
    if (active.id.toString().startsWith('recipe-')) {
      const recipeId = parseInt(active.id.toString().replace('recipe-', ''));
      const recipe = sampleRecipes.find(r => r.id === recipeId);
      if (recipe) {
        setActiveDragRecipe(recipe);
      }
    }
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    // Reset active drag item
    setActiveDragRecipe(null);
    
    if (!over) return; // Dropped outside valid drop area
    
    // If dropped on a meal slot
    if (over.id.toString().includes('-')) {
      const [day, meal] = over.id.toString().split('-');
      
      // If dragging from recipe list
      if (active.id.toString().startsWith('recipe-')) {
        const recipeId = parseInt(active.id.toString().replace('recipe-', ''));
        const recipe = sampleRecipes.find(r => r.id === recipeId);
        
        if (recipe) {
          // Update meal plan with dragged recipe
          setMealPlan(prev => {
            const updated = { ...prev };
            updated[day] = { ...updated[day], [meal]: recipe };
            return updated;
          });
        }
      }
    }
  };
  
  // Remove a recipe from the meal plan
  const handleRemoveRecipe = (day: string, meal: string) => {
    setMealPlan(prev => {
      const updated = { ...prev };
      updated[day] = { ...updated[day], [meal]: null };
      return updated;
    });
  };

  // Add a recipe to the meal plan directly (non-drag method)
  const handleAddRecipe = (recipe: RecipeItem) => {
    if (selectedDay && selectedMeal) {
      setMealPlan(prev => {
        const updated = { ...prev };
        updated[selectedDay] = { 
          ...updated[selectedDay], 
          [selectedMeal]: recipe 
        };
        return updated;
      });
    }
  };

  // Render a recipe card in a meal slot
  const renderMealSlot = (day: string, meal: string) => {
    const recipe = mealPlan[day]?.[meal];
    
    return (
      <div 
        id={`${day}-${meal}`}
        className={`py-3 px-4 text-center cursor-pointer min-h-[80px] flex items-center justify-center 
          ${selectedDay === day && selectedMeal === meal 
            ? "bg-primary-50 border border-primary-200" 
            : "hover:bg-neutral-50"}`}
        onClick={() => {
          setSelectedDay(day);
          setSelectedMeal(meal);
        }}
      >
        {recipe ? (
          <div className="w-full">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-primary-600">{recipe.name}</span>
              <button 
                className="text-neutral-400 hover:text-red-500 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveRecipe(day, meal);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="text-xs text-neutral-500 mt-1">{recipe.calories} calories</div>
          </div>
        ) : (
          <div className="text-sm text-neutral-400 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add meal
          </div>
        )}
      </div>
    );
  };

  // Render a draggable recipe card in the suggestion section
  const renderRecipeCard = (recipe: RecipeItem) => {
    return (
      <Card key={recipe.id} className="recipe-card transition-all duration-200 hover:shadow-md">
        <div 
          id={`recipe-${recipe.id}`} 
          className="cursor-grab active:cursor-grabbing h-full"
        >
          {recipe.imageUrl && (
            <div className="h-32 overflow-hidden rounded-t-lg">
              <img 
                src={recipe.imageUrl} 
                alt={recipe.name} 
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
              />
            </div>
          )}
          <CardContent className="p-4">
            <CardTitle className="mb-2">{recipe.name}</CardTitle>
            <div className="flex justify-between text-sm text-neutral-500">
              <span className="px-2 py-1 bg-neutral-100 rounded-full text-xs">{recipe.type}</span>
              <span>{recipe.calories} calories</span>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (selectedDay && selectedMeal) {
                    handleAddRecipe(recipe);
                  } else {
                    alert("Please select a day and meal first");
                  }
                }}
              >
                Add to Plan
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-800">Meal Planner</h1>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              leftIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              }
              onClick={goToPreviousWeek}
            >
              Previous Week
            </Button>
            <Button
              variant="outline"
              rightIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              }
              onClick={goToNextWeek}
            >
              Next Week
            </Button>
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-medium text-neutral-600">{currentWeek}</h2>
          <p className="text-sm text-neutral-500 mt-2">
            Drag and drop recipes to plan your meals, or click on a slot to select it
          </p>
        </div>

        {/* Week Calendar Grid */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="grid grid-cols-7 border-b border-neutral-200">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className={`p-4 text-center cursor-pointer hover:bg-primary-50 transition-colors ${
                  selectedDay === day
                    ? "bg-primary-50 border-t-2 border-primary-500"
                    : ""
                }`}
                onClick={() => setSelectedDay(day)}
              >
                <div className="font-medium text-neutral-800">{day}</div>
                <div className="text-xs text-neutral-500 mt-1">
                  Sep {daysOfWeek.indexOf(day) + 7}
                </div>
              </div>
            ))}
          </div>

          <div className="divide-y divide-neutral-200">
            {mealTypes.map((meal) => (
              <div key={meal} className="grid grid-cols-7 hover:bg-neutral-50">
                <div className="py-3 px-4 font-medium text-neutral-600 border-r border-neutral-200">
                  {meal}
                </div>
                {daysOfWeek.map((day) => renderMealSlot(day, meal))}
              </div>
            ))}
          </div>
        </div>

        {selectedDay && selectedMeal && (
          <div className="mb-4 p-3 bg-primary-50 rounded-lg border border-primary-200">
            <p className="text-primary-800">
              <span className="font-semibold">Selected: </span>
              {selectedMeal} on {selectedDay}
            </p>
          </div>
        )}

        {/* Recipe Suggestions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-neutral-800 mb-4">
            Recipe Suggestions
            <span className="ml-2 text-sm font-normal text-neutral-500">
              Drag recipes to your meal plan
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sampleRecipes.map((recipe) => renderRecipeCard(recipe))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            leftIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                <path d="M16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            }
            onClick={handleGenerateShoppingList}
          >
            Generate Shopping List
          </Button>
        </div>
      </div>
      
      {/* Drag indicator */}
      <DragIndicator active={activeDragRecipe !== null} />
      
      {/* Drag overlay */}
      <DragOverlay>
        {activeDragRecipe && (
          <div className="drag-overlay bg-white shadow-lg rounded-lg p-4 opacity-90 w-64">
            {activeDragRecipe.imageUrl && (
              <div className="h-24 w-full mb-2 overflow-hidden rounded">
                <img 
                  src={activeDragRecipe.imageUrl} 
                  alt={activeDragRecipe.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <h3 className="font-medium">{activeDragRecipe.name}</h3>
            <p className="text-sm text-neutral-500">{activeDragRecipe.calories} calories</p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default MealPlannerPage;
