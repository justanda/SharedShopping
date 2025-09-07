import { v4 as uuidv4 } from 'uuid';
import type { ShoppingList, ShoppingItem, Recipe } from '../types';
import storageService from './storageService';
import recipeService from './recipeService';

const SHOPPING_LISTS_STORAGE_KEY = 'recipe_roulette_shopping_lists';
const ACTIVE_LIST_STORAGE_KEY = 'recipe_roulette_active_list_id';

class ShoppingListService {
  private getShoppingLists(): ShoppingList[] {
    return storageService.getItem<ShoppingList[]>(SHOPPING_LISTS_STORAGE_KEY, []);
  }

  private saveShoppingLists(lists: ShoppingList[]): void {
    storageService.setItem(SHOPPING_LISTS_STORAGE_KEY, lists);
  }

  private getActiveListId(): string | null {
    return storageService.getItem<string | null>(ACTIVE_LIST_STORAGE_KEY, null);
  }

  private setActiveListId(id: string | null): void {
    storageService.setItem(ACTIVE_LIST_STORAGE_KEY, id);
  }

  /**
   * Fetch all shopping lists
   */
  async fetchLists(): Promise<ShoppingList[]> {
    try {
      // Simulate async behavior for future API integration
      return new Promise((resolve) => {
        setTimeout(() => {
          const lists = this.getShoppingLists();
          resolve(lists);
        }, 100);
      });
    } catch (error) {
      console.error('Error fetching shopping lists:', error);
      throw error;
    }
  }

  /**
   * Get active shopping list ID
   */
  getActiveList(): string | null {
    return this.getActiveListId();
  }

  /**
   * Set active shopping list
   */
  setActiveList(id: string): void {
    this.setActiveListId(id);
  }

  /**
   * Create a new shopping list
   */
  async createList(name: string): Promise<string> {
    try {
      const lists = this.getShoppingLists();
      const now = new Date();
      
      const newList: ShoppingList = {
        id: uuidv4(),
        name,
        items: [],
        createdAt: now,
        updatedAt: now
      };
      
      this.saveShoppingLists([...lists, newList]);
      
      // If this is the first list, make it active
      if (lists.length === 0) {
        this.setActiveListId(newList.id);
      }
      
      return newList.id;
    } catch (error) {
      console.error('Error creating shopping list:', error);
      throw error;
    }
  }

  /**
   * Rename a shopping list
   */
  async renameList(id: string, name: string): Promise<void> {
    try {
      const lists = this.getShoppingLists();
      const listIndex = lists.findIndex(list => list.id === id);
      
      if (listIndex === -1) {
        throw new Error(`Shopping list with ID ${id} not found`);
      }
      
      lists[listIndex] = {
        ...lists[listIndex],
        name,
        updatedAt: new Date()
      };
      
      this.saveShoppingLists(lists);
    } catch (error) {
      console.error(`Error renaming shopping list with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a shopping list
   */
  async deleteList(id: string): Promise<void> {
    try {
      const lists = this.getShoppingLists();
      const updatedLists = lists.filter(list => list.id !== id);
      
      if (lists.length === updatedLists.length) {
        throw new Error(`Shopping list with ID ${id} not found`);
      }
      
      this.saveShoppingLists(updatedLists);
      
      // If the active list is deleted, set the first available list as active or null
      const activeListId = this.getActiveListId();
      if (activeListId === id) {
        this.setActiveListId(updatedLists.length > 0 ? updatedLists[0].id : null);
      }
    } catch (error) {
      console.error(`Error deleting shopping list with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Add an item to a shopping list
   */
  async addItem(listId: string, item: Omit<ShoppingItem, 'id'>): Promise<string> {
    try {
      const lists = this.getShoppingLists();
      const listIndex = lists.findIndex(list => list.id === listId);
      
      if (listIndex === -1) {
        throw new Error(`Shopping list with ID ${listId} not found`);
      }
      
      const newItem: ShoppingItem = {
        ...item,
        id: uuidv4()
      };
      
      lists[listIndex] = {
        ...lists[listIndex],
        items: [...lists[listIndex].items, newItem],
        updatedAt: new Date()
      };
      
      this.saveShoppingLists(lists);
      return newItem.id;
    } catch (error) {
      console.error(`Error adding item to shopping list with ID ${listId}:`, error);
      throw error;
    }
  }

  /**
   * Update a shopping list item
   */
  async updateItem(listId: string, itemId: string, updates: Partial<ShoppingItem>): Promise<void> {
    try {
      const lists = this.getShoppingLists();
      const listIndex = lists.findIndex(list => list.id === listId);
      
      if (listIndex === -1) {
        throw new Error(`Shopping list with ID ${listId} not found`);
      }
      
      const itemIndex = lists[listIndex].items.findIndex(item => item.id === itemId);
      
      if (itemIndex === -1) {
        throw new Error(`Item with ID ${itemId} not found in shopping list with ID ${listId}`);
      }
      
      lists[listIndex].items[itemIndex] = {
        ...lists[listIndex].items[itemIndex],
        ...updates
      };
      
      lists[listIndex].updatedAt = new Date();
      
      this.saveShoppingLists(lists);
    } catch (error) {
      console.error(`Error updating item with ID ${itemId} in shopping list with ID ${listId}:`, error);
      throw error;
    }
  }

  /**
   * Remove an item from a shopping list
   */
  async removeItem(listId: string, itemId: string): Promise<void> {
    try {
      const lists = this.getShoppingLists();
      const listIndex = lists.findIndex(list => list.id === listId);
      
      if (listIndex === -1) {
        throw new Error(`Shopping list with ID ${listId} not found`);
      }
      
      const updatedItems = lists[listIndex].items.filter(item => item.id !== itemId);
      
      if (updatedItems.length === lists[listIndex].items.length) {
        throw new Error(`Item with ID ${itemId} not found in shopping list with ID ${listId}`);
      }
      
      lists[listIndex] = {
        ...lists[listIndex],
        items: updatedItems,
        updatedAt: new Date()
      };
      
      this.saveShoppingLists(lists);
    } catch (error) {
      console.error(`Error removing item with ID ${itemId} from shopping list with ID ${listId}:`, error);
      throw error;
    }
  }

  /**
   * Toggle item completion status
   */
  async toggleItemCompletion(listId: string, itemId: string): Promise<void> {
    try {
      const lists = this.getShoppingLists();
      const listIndex = lists.findIndex(list => list.id === listId);
      
      if (listIndex === -1) {
        throw new Error(`Shopping list with ID ${listId} not found`);
      }
      
      const itemIndex = lists[listIndex].items.findIndex(item => item.id === itemId);
      
      if (itemIndex === -1) {
        throw new Error(`Item with ID ${itemId} not found in shopping list with ID ${listId}`);
      }
      
      lists[listIndex].items[itemIndex] = {
        ...lists[listIndex].items[itemIndex],
        completed: !lists[listIndex].items[itemIndex].completed
      };
      
      lists[listIndex].updatedAt = new Date();
      
      this.saveShoppingLists(lists);
    } catch (error) {
      console.error(`Error toggling completion for item with ID ${itemId} in shopping list with ID ${listId}:`, error);
      throw error;
    }
  }

  /**
   * Clear completed items from a shopping list
   */
  async clearCompletedItems(listId: string): Promise<void> {
    try {
      const lists = this.getShoppingLists();
      const listIndex = lists.findIndex(list => list.id === listId);
      
      if (listIndex === -1) {
        throw new Error(`Shopping list with ID ${listId} not found`);
      }
      
      lists[listIndex] = {
        ...lists[listIndex],
        items: lists[listIndex].items.filter(item => !item.completed),
        updatedAt: new Date()
      };
      
      this.saveShoppingLists(lists);
    } catch (error) {
      console.error(`Error clearing completed items from shopping list with ID ${listId}:`, error);
      throw error;
    }
  }

  /**
   * Generate a shopping list from a recipe
   */
  async generateListFromRecipe(recipeId: string, listId?: string): Promise<string> {
    try {
      const recipe = await recipeService.getRecipeById(recipeId);
      
      if (!recipe) {
        throw new Error(`Recipe with ID ${recipeId} not found`);
      }
      
      // Use existing list or create a new one
      let targetListId = listId;
      
      if (!targetListId) {
        targetListId = await this.createList(`Ingredients for ${recipe.title}`);
      }
      
      // Add recipe ingredients to the shopping list
      const ingredientPromises = recipe.ingredients.map(ingredient => 
        this.addItem(targetListId as string, {
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          section: ingredient.section || 'Other',
          completed: false
        })
      );
      
      await Promise.all(ingredientPromises);
      
      return targetListId;
    } catch (error) {
      console.error(`Error generating shopping list from recipe with ID ${recipeId}:`, error);
      throw error;
    }
  }

  /**
   * Generate a shopping list from a meal plan
   */
  async generateListFromMealPlan(
    startDate: Date, 
    endDate: Date, 
    listId?: string,
    recipes?: Recipe[]
  ): Promise<string> {
    try {
      // This is a placeholder implementation
      // The actual implementation would get planned meals for the date range
      // and extract ingredients from the associated recipes
      
      // Create a new list or use existing one
      let targetListId = listId;
      
      if (!targetListId) {
        const formattedStartDate = startDate.toLocaleDateString();
        const formattedEndDate = endDate.toLocaleDateString();
        targetListId = await this.createList(`Meal Plan (${formattedStartDate} - ${formattedEndDate})`);
      }
      
      // If sample recipes are provided (for demo purposes), add their ingredients
      if (recipes && recipes.length > 0) {
        const allIngredients: Array<{ name: string; quantity: number; unit: string; section: string }> = [];
        
        // Collect all ingredients from recipes
        recipes.forEach(recipe => {
          recipe.ingredients.forEach(ingredient => {
            allIngredients.push({
              name: ingredient.name,
              quantity: ingredient.quantity,
              unit: ingredient.unit,
              section: ingredient.section || 'Other'
            });
          });
        });
        
        // Consolidate ingredients (combine duplicates)
        const consolidatedIngredients = this.consolidateIngredients(allIngredients);
        
        // Add all ingredients to the shopping list
        const ingredientPromises = consolidatedIngredients.map(ingredient => 
          this.addItem(targetListId as string, {
            name: ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            section: ingredient.section,
            completed: false
          })
        );
        
        await Promise.all(ingredientPromises);
      }
      
      return targetListId;
    } catch (error) {
      console.error('Error generating shopping list from meal plan:', error);
      throw error;
    }
  }

  /**
   * Helper method to consolidate ingredients (combine duplicates)
   */
  private consolidateIngredients(
    ingredients: Array<{ name: string; quantity: number; unit: string; section: string }>
  ) {
    const consolidatedMap = new Map<string, { name: string; quantity: number; unit: string; section: string }>();
    
    ingredients.forEach(ingredient => {
      const key = `${ingredient.name.toLowerCase()}_${ingredient.unit.toLowerCase()}`;
      
      if (consolidatedMap.has(key)) {
        // If ingredient already exists, add quantities
        const existing = consolidatedMap.get(key)!;
        existing.quantity += ingredient.quantity;
      } else {
        // Otherwise, add new entry
        consolidatedMap.set(key, { ...ingredient });
      }
    });
    
    return Array.from(consolidatedMap.values());
  }
}

export default new ShoppingListService();
