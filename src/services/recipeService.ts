import { v4 as uuidv4 } from 'uuid';
import type { Recipe, RecipeFilters } from '../types';
import storageService from './storageService';

const RECIPES_STORAGE_KEY = 'recipe_roulette_recipes';

class RecipeService {
  private getRecipes(): Recipe[] {
    return storageService.getItem<Recipe[]>(RECIPES_STORAGE_KEY, []);
  }

  private saveRecipes(recipes: Recipe[]): void {
    storageService.setItem(RECIPES_STORAGE_KEY, recipes);
  }

  /**
   * Fetch all recipes from storage
   */
  async fetchRecipes(): Promise<Recipe[]> {
    try {
      // Simulate async behavior for future API integration
      return new Promise((resolve) => {
        setTimeout(() => {
          const recipes = this.getRecipes();
          resolve(recipes);
        }, 100);
      });
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }
  }

  /**
   * Get a recipe by its ID
   */
  async getRecipeById(id: string): Promise<Recipe | undefined> {
    try {
      const recipes = this.getRecipes();
      return recipes.find((recipe) => recipe.id === id);
    } catch (error) {
      console.error(`Error getting recipe with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Add a new recipe
   */
  async addRecipe(recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const recipes = this.getRecipes();
      const now = new Date();
      
      const newRecipe: Recipe = {
        ...recipeData,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now
      };
      
      this.saveRecipes([...recipes, newRecipe]);
      return newRecipe.id;
    } catch (error) {
      console.error('Error adding recipe:', error);
      throw error;
    }
  }

  /**
   * Update an existing recipe
   */
  async updateRecipe(id: string, updates: Partial<Recipe>): Promise<void> {
    try {
      const recipes = this.getRecipes();
      const recipeIndex = recipes.findIndex((recipe) => recipe.id === id);
      
      if (recipeIndex === -1) {
        throw new Error(`Recipe with ID ${id} not found`);
      }
      
      // Update the recipe with new data
      const updatedRecipe = {
        ...recipes[recipeIndex],
        ...updates,
        id, // Ensure ID doesn't change
        updatedAt: new Date() // Update the modified timestamp
      };
      
      recipes[recipeIndex] = updatedRecipe;
      this.saveRecipes(recipes);
    } catch (error) {
      console.error(`Error updating recipe with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a recipe
   */
  async deleteRecipe(id: string): Promise<void> {
    try {
      const recipes = this.getRecipes();
      const updatedRecipes = recipes.filter((recipe) => recipe.id !== id);
      
      if (recipes.length === updatedRecipes.length) {
        throw new Error(`Recipe with ID ${id} not found`);
      }
      
      this.saveRecipes(updatedRecipes);
    } catch (error) {
      console.error(`Error deleting recipe with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Search recipes by query term (title, description, ingredients)
   */
  searchRecipes(query: string): Recipe[] {
    if (!query.trim()) return this.getRecipes();
    
    const normalizedQuery = query.toLowerCase().trim();
    const recipes = this.getRecipes();
    
    return recipes.filter((recipe) => {
      // Search in title and description
      if (recipe.title.toLowerCase().includes(normalizedQuery) || 
          recipe.description.toLowerCase().includes(normalizedQuery)) {
        return true;
      }
      
      // Search in ingredients
      if (recipe.ingredients.some(ingredient => 
        ingredient.name.toLowerCase().includes(normalizedQuery))) {
        return true;
      }
      
      // Search in tags
      if (recipe.tags.some(tag => 
        tag.toLowerCase().includes(normalizedQuery))) {
        return true;
      }
      
      return false;
    });
  }

  /**
   * Filter recipes based on multiple criteria
   */
  filterRecipes(filters: RecipeFilters): Recipe[] {
    const recipes = this.getRecipes();
    
    return recipes.filter((recipe) => {
      // Filter by query (if provided)
      if (filters.query && !this.matchesQuery(recipe, filters.query)) {
        return false;
      }
      
      // Filter by tags (if provided)
      if (filters.tags && filters.tags.length > 0) {
        if (!filters.tags.some(tag => recipe.tags.includes(tag))) {
          return false;
        }
      }
      
      // Filter by difficulty (if provided)
      if (filters.difficulty && recipe.difficulty !== filters.difficulty) {
        return false;
      }
      
      // Filter by prep time (if provided)
      if (filters.maxPrepTime !== undefined && recipe.prepTime > filters.maxPrepTime) {
        return false;
      }
      
      // Filter by cook time (if provided)
      if (filters.maxCookTime !== undefined && recipe.cookTime > filters.maxCookTime) {
        return false;
      }
      
      return true;
    });
  }

  /**
   * Helper method to check if a recipe matches a search query
   */
  private matchesQuery(recipe: Recipe, query: string): boolean {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Check title and description
    if (recipe.title.toLowerCase().includes(normalizedQuery) || 
        recipe.description.toLowerCase().includes(normalizedQuery)) {
      return true;
    }
    
    // Check ingredients
    if (recipe.ingredients.some(ingredient => 
      ingredient.name.toLowerCase().includes(normalizedQuery))) {
      return true;
    }
    
    // Check tags
    if (recipe.tags.some(tag => 
      tag.toLowerCase().includes(normalizedQuery))) {
      return true;
    }
    
    return false;
  }
}

export default new RecipeService();
