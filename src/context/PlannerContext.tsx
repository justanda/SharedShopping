import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { MealPlan, PlannedMeal } from '../types';
import mealPlannerService from '../services/mealPlannerService';

// Context types
interface PlannerState {
  mealPlan: MealPlan | null;
  isLoading: boolean;
  error: Error | null;
}

interface PlannerContextValue extends PlannerState {
  fetchMealPlan: () => Promise<void>;
  addPlannedMeal: (meal: Omit<PlannedMeal, 'id'>) => Promise<string>;
  updatePlannedMeal: (id: string, updates: Partial<PlannedMeal>) => Promise<void>;
  removePlannedMeal: (id: string) => Promise<void>;
  getPlannedMealsForDate: (date: Date) => PlannedMeal[];
  getPlannedMealsForDateRange: (startDate: Date, endDate: Date) => PlannedMeal[];
  generateShoppingList: (startDate: Date, endDate: Date) => Promise<string>;
  moveMealToDate: (mealId: string, newDate: Date) => Promise<void>;
}

// Initial state
const initialState: PlannerState = {
  mealPlan: null,
  isLoading: false,
  error: null,
};

// Action types
type PlannerAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: MealPlan }
  | { type: 'FETCH_ERROR'; payload: Error }
  | { type: 'ADD_PLANNED_MEAL'; payload: PlannedMeal }
  | { type: 'UPDATE_PLANNED_MEAL'; payload: { id: string; updates: Partial<PlannedMeal> } }
  | { type: 'REMOVE_PLANNED_MEAL'; payload: string };

// Reducer
const plannerReducer = (state: PlannerState, action: PlannerAction): PlannerState => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, mealPlan: action.payload, isLoading: false };
    case 'FETCH_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'ADD_PLANNED_MEAL':
      return {
        ...state,
        mealPlan: state.mealPlan
          ? {
              ...state.mealPlan,
              plannedMeals: [...state.mealPlan.plannedMeals, action.payload],
            }
          : null,
      };
    case 'UPDATE_PLANNED_MEAL': {
      const { id, updates } = action.payload;
      return {
        ...state,
        mealPlan: state.mealPlan
          ? {
              ...state.mealPlan,
              plannedMeals: state.mealPlan.plannedMeals.map((meal) =>
                meal.id === id ? { ...meal, ...updates } : meal
              ),
            }
          : null,
      };
    }
    case 'REMOVE_PLANNED_MEAL':
      return {
        ...state,
        mealPlan: state.mealPlan
          ? {
              ...state.mealPlan,
              plannedMeals: state.mealPlan.plannedMeals.filter(
                (meal) => meal.id !== action.payload
              ),
            }
          : null,
      };
    default:
      return state;
  }
};

// Create context
const PlannerContext = createContext<PlannerContextValue | null>(null);

// Provider component
export const PlannerProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(plannerReducer, initialState);

  const fetchMealPlan = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const mealPlan = await mealPlannerService.fetchMealPlan();
      dispatch({ type: 'FETCH_SUCCESS', payload: mealPlan });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error as Error });
    }
  };

  const addPlannedMeal = async (mealData: Omit<PlannedMeal, 'id'>) => {
    try {
      const id = await mealPlannerService.addPlannedMeal(mealData);
      const mealPlan = await mealPlannerService.fetchMealPlan();
      const newMeal = mealPlan.plannedMeals.find((meal) => meal.id === id);
      
      if (newMeal) {
        dispatch({ type: 'ADD_PLANNED_MEAL', payload: newMeal });
      }
      
      return id;
    } catch (error) {
      throw error;
    }
  };

  const updatePlannedMeal = async (id: string, updates: Partial<PlannedMeal>) => {
    try {
      await mealPlannerService.updatePlannedMeal(id, updates);
      dispatch({ type: 'UPDATE_PLANNED_MEAL', payload: { id, updates } });
    } catch (error) {
      throw error;
    }
  };

  const removePlannedMeal = async (id: string) => {
    try {
      await mealPlannerService.removePlannedMeal(id);
      dispatch({ type: 'REMOVE_PLANNED_MEAL', payload: id });
    } catch (error) {
      throw error;
    }
  };

  const getPlannedMealsForDate = (date: Date): PlannedMeal[] => {
    if (!state.mealPlan) return [];
    return mealPlannerService.getPlannedMealsForDate(date);
  };

  const getPlannedMealsForDateRange = (startDate: Date, endDate: Date): PlannedMeal[] => {
    if (!state.mealPlan) return [];
    return mealPlannerService.getPlannedMealsForDateRange(startDate, endDate);
  };

  const generateShoppingList = async (startDate: Date, endDate: Date): Promise<string> => {
    try {
      return await mealPlannerService.generateShoppingList(startDate, endDate);
    } catch (error) {
      throw error;
    }
  };

  const moveMealToDate = async (mealId: string, newDate: Date): Promise<void> => {
    try {
      await mealPlannerService.moveMealToDate(mealId, newDate);
      dispatch({
        type: 'UPDATE_PLANNED_MEAL',
        payload: { id: mealId, updates: { date: newDate } },
      });
    } catch (error) {
      throw error;
    }
  };

  // Load meal plan on initial mount
  useEffect(() => {
    fetchMealPlan();
  }, []);

  const value = {
    ...state,
    fetchMealPlan,
    addPlannedMeal,
    updatePlannedMeal,
    removePlannedMeal,
    getPlannedMealsForDate,
    getPlannedMealsForDateRange,
    generateShoppingList,
    moveMealToDate,
  };

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
};

// Custom hook for using the planner context
export const usePlanner = (): PlannerContextValue => {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
};
