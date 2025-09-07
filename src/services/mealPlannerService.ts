import { v4 as uuidv4 } from 'uuid';
import type { MealPlan, PlannedMeal, MealType } from '../types';
import storageService from './storageService';
import shoppingListService from './shoppingListService';

const MEAL_PLAN_STORAGE_KEY = 'recipe_roulette_meal_plan';

class MealPlannerService {
  private getMealPlan(): MealPlan {
    return storageService.getItem<MealPlan>(
      MEAL_PLAN_STORAGE_KEY, 
      { id: uuidv4(), plannedMeals: [] }
    );
  }

  private saveMealPlan(mealPlan: MealPlan): void {
    storageService.setItem(MEAL_PLAN_STORAGE_KEY, mealPlan);
  }

  /**
   * Fetch the meal plan
   */
  async fetchMealPlan(): Promise<MealPlan> {
    try {
      // Simulate async behavior for future API integration
      return new Promise((resolve) => {
        setTimeout(() => {
          const mealPlan = this.getMealPlan();
          resolve(mealPlan);
        }, 100);
      });
    } catch (error) {
      console.error('Error fetching meal plan:', error);
      throw error;
    }
  }

  /**
   * Add a planned meal
   */
  async addPlannedMeal(meal: Omit<PlannedMeal, 'id'>): Promise<string> {
    try {
      const mealPlan = this.getMealPlan();
      
      const newMeal: PlannedMeal = {
        ...meal,
        id: uuidv4()
      };
      
      mealPlan.plannedMeals.push(newMeal);
      this.saveMealPlan(mealPlan);
      
      return newMeal.id;
    } catch (error) {
      console.error('Error adding planned meal:', error);
      throw error;
    }
  }

  /**
   * Update a planned meal
   */
  async updatePlannedMeal(id: string, updates: Partial<PlannedMeal>): Promise<void> {
    try {
      const mealPlan = this.getMealPlan();
      
      const mealIndex = mealPlan.plannedMeals.findIndex(meal => meal.id === id);
      
      if (mealIndex === -1) {
        throw new Error(`Planned meal with ID ${id} not found`);
      }
      
      mealPlan.plannedMeals[mealIndex] = {
        ...mealPlan.plannedMeals[mealIndex],
        ...updates
      };
      
      this.saveMealPlan(mealPlan);
    } catch (error) {
      console.error(`Error updating planned meal with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Remove a planned meal
   */
  async removePlannedMeal(id: string): Promise<void> {
    try {
      const mealPlan = this.getMealPlan();
      
      const updatedMeals = mealPlan.plannedMeals.filter(meal => meal.id !== id);
      
      if (updatedMeals.length === mealPlan.plannedMeals.length) {
        throw new Error(`Planned meal with ID ${id} not found`);
      }
      
      mealPlan.plannedMeals = updatedMeals;
      this.saveMealPlan(mealPlan);
    } catch (error) {
      console.error(`Error removing planned meal with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get planned meals for a specific date
   */
  getPlannedMealsForDate(date: Date): PlannedMeal[] {
    const mealPlan = this.getMealPlan();
    const targetDate = new Date(date);
    
    // Reset time to start of day for comparison
    targetDate.setHours(0, 0, 0, 0);
    
    return mealPlan.plannedMeals.filter(meal => {
      const mealDate = new Date(meal.date);
      mealDate.setHours(0, 0, 0, 0);
      return mealDate.getTime() === targetDate.getTime();
    });
  }

  /**
   * Get planned meals for a date range
   */
  getPlannedMealsForDateRange(startDate: Date, endDate: Date): PlannedMeal[] {
    const mealPlan = this.getMealPlan();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Reset times to start/end of day for comparison
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    
    return mealPlan.plannedMeals.filter(meal => {
      const mealDate = new Date(meal.date);
      return mealDate >= start && mealDate <= end;
    });
  }

  /**
   * Generate a shopping list from meal plan for a date range
   */
  async generateShoppingList(startDate: Date, endDate: Date): Promise<string> {
    try {
      // Get planned meals for the date range
      const plannedMeals = this.getPlannedMealsForDateRange(startDate, endDate);
      
      if (plannedMeals.length === 0) {
        throw new Error('No planned meals found in the selected date range');
      }
      
      // Extract recipe IDs
      const recipeIds = plannedMeals
        .filter(meal => meal.recipeId)
        .map(meal => meal.recipeId as string);
      
      if (recipeIds.length === 0) {
        throw new Error('No recipes found in the planned meals');
      }
      
      // Create a shopping list using the shopping list service
      // This is a simplified implementation that delegates to the shopping list service
      const formattedStartDate = startDate.toLocaleDateString();
      const formattedEndDate = endDate.toLocaleDateString();
      
      const listId = await shoppingListService.createList(
        `Meal Plan (${formattedStartDate} - ${formattedEndDate})`
      );
      
      // In a real implementation, you would:
      // 1. Fetch all recipes by their IDs
      // 2. Extract ingredients, considering the serving sizes in plannedMeals
      // 3. Consolidate ingredients (combine duplicates)
      // 4. Add all ingredients to the shopping list
      
      // For now, we'll use a placeholder implementation in the shopping list service
      await shoppingListService.generateListFromMealPlan(startDate, endDate, listId);
      
      return listId;
    } catch (error) {
      console.error('Error generating shopping list from meal plan:', error);
      throw error;
    }
  }

  /**
   * Move a meal to a different date
   */
  async moveMealToDate(mealId: string, newDate: Date): Promise<void> {
    await this.updatePlannedMeal(mealId, { date: newDate });
  }

  /**
   * Change meal type
   */
  async changeMealType(mealId: string, newType: MealType): Promise<void> {
    await this.updatePlannedMeal(mealId, { mealType: newType });
  }

  /**
   * Get all unique dates that have planned meals
   */
  getPlannedDates(): Date[] {
    const mealPlan = this.getMealPlan();
    const dateMap = new Map<string, Date>();
    
    mealPlan.plannedMeals.forEach(meal => {
      const mealDate = new Date(meal.date);
      mealDate.setHours(0, 0, 0, 0);
      const dateString = mealDate.toISOString().split('T')[0];
      dateMap.set(dateString, mealDate);
    });
    
    return Array.from(dateMap.values());
  }
}

export default new MealPlannerService();
