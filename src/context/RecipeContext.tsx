import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Recipe, RecipeFilters } from '../types';
import recipeService from '../services/recipeService';

// Context types
interface RecipeState {
  recipes: Recipe[];
  isLoading: boolean;
  error: Error | null;
}

interface RecipeContextValue extends RecipeState {
  fetchRecipes: () => Promise<void>;
  getRecipeById: (id: string) => Recipe | undefined;
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateRecipe: (id: string, updates: Partial<Recipe>) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  searchRecipes: (query: string) => Recipe[];
  filterRecipes: (filters: RecipeFilters) => Recipe[];
}

// Initial state
const initialState: RecipeState = {
  recipes: [],
  isLoading: false,
  error: null,
};

// Action types
type RecipeAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Recipe[] }
  | { type: 'FETCH_ERROR'; payload: Error }
  | { type: 'ADD_RECIPE'; payload: Recipe }
  | { type: 'UPDATE_RECIPE'; payload: { id: string; updates: Partial<Recipe> } }
  | { type: 'DELETE_RECIPE'; payload: string };

// Reducer
const recipeReducer = (state: RecipeState, action: RecipeAction): RecipeState => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, recipes: action.payload, isLoading: false };
    case 'FETCH_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'ADD_RECIPE':
      return { ...state, recipes: [...state.recipes, action.payload] };
    case 'UPDATE_RECIPE': {
      const { id, updates } = action.payload;
      return {
        ...state,
        recipes: state.recipes.map((recipe) =>
          recipe.id === id ? { ...recipe, ...updates } : recipe
        ),
      };
    }
    case 'DELETE_RECIPE':
      return {
        ...state,
        recipes: state.recipes.filter((recipe) => recipe.id !== action.payload),
      };
    default:
      return state;
  }
};

// Create context
const RecipeContext = createContext<RecipeContextValue | null>(null);

// Provider component
export const RecipeProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(recipeReducer, initialState);

  const fetchRecipes = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const recipes = await recipeService.fetchRecipes();
      dispatch({ type: 'FETCH_SUCCESS', payload: recipes });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error as Error });
    }
  };

  const getRecipeById = (id: string) => {
    return state.recipes.find((recipe) => recipe.id === id);
  };

  const addRecipe = async (recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = await recipeService.addRecipe(recipeData);
      const newRecipe = await recipeService.getRecipeById(id);
      if (newRecipe) {
        dispatch({ type: 'ADD_RECIPE', payload: newRecipe });
      }
      return id;
    } catch (error) {
      throw error;
    }
  };

  const updateRecipe = async (id: string, updates: Partial<Recipe>) => {
    try {
      await recipeService.updateRecipe(id, updates);
      dispatch({ type: 'UPDATE_RECIPE', payload: { id, updates } });
    } catch (error) {
      throw error;
    }
  };

  const deleteRecipe = async (id: string) => {
    try {
      await recipeService.deleteRecipe(id);
      dispatch({ type: 'DELETE_RECIPE', payload: id });
    } catch (error) {
      throw error;
    }
  };

  const searchRecipes = (query: string) => {
    return recipeService.searchRecipes(query);
  };

  const filterRecipes = (filters: RecipeFilters) => {
    return recipeService.filterRecipes(filters);
  };

  // Load recipes on initial mount
  useEffect(() => {
    fetchRecipes();
  }, []);

  const value = {
    ...state,
    fetchRecipes,
    getRecipeById,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    searchRecipes,
    filterRecipes,
  };

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
};

// Custom hook for using the recipe context
export const useRecipes = (): RecipeContextValue => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
};
