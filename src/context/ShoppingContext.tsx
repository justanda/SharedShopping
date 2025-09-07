import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ShoppingList, ShoppingItem } from '../types';
import shoppingListService from '../services/shoppingListService';

// Context types
interface ShoppingState {
  lists: ShoppingList[];
  activeListId: string | null;
  isLoading: boolean;
  error: Error | null;
}

interface ShoppingContextValue extends ShoppingState {
  fetchLists: () => Promise<void>;
  createList: (name: string) => Promise<string>;
  renameList: (id: string, name: string) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
  setActiveList: (id: string) => void;
  addItem: (listId: string, item: Omit<ShoppingItem, 'id'>) => Promise<string>;
  updateItem: (listId: string, itemId: string, updates: Partial<ShoppingItem>) => Promise<void>;
  removeItem: (listId: string, itemId: string) => Promise<void>;
  toggleItemCompletion: (listId: string, itemId: string) => Promise<void>;
  clearCompletedItems: (listId: string) => Promise<void>;
  generateListFromRecipe: (recipeId: string, listId?: string) => Promise<string>;
  generateListFromMealPlan: (startDate: Date, endDate: Date, listId?: string) => Promise<string>;
}

// Initial state
const initialState: ShoppingState = {
  lists: [],
  activeListId: null,
  isLoading: false,
  error: null,
};

// Action types
type ShoppingAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { lists: ShoppingList[]; activeListId: string | null } }
  | { type: 'FETCH_ERROR'; payload: Error }
  | { type: 'CREATE_LIST'; payload: ShoppingList }
  | { type: 'RENAME_LIST'; payload: { id: string; name: string } }
  | { type: 'DELETE_LIST'; payload: string }
  | { type: 'SET_ACTIVE_LIST'; payload: string }
  | { type: 'ADD_ITEM'; payload: { listId: string; item: ShoppingItem } }
  | { type: 'UPDATE_ITEM'; payload: { listId: string; itemId: string; updates: Partial<ShoppingItem> } }
  | { type: 'REMOVE_ITEM'; payload: { listId: string; itemId: string } }
  | { type: 'TOGGLE_ITEM_COMPLETION'; payload: { listId: string; itemId: string } }
  | { type: 'CLEAR_COMPLETED_ITEMS'; payload: string };

// Reducer
const shoppingReducer = (state: ShoppingState, action: ShoppingAction): ShoppingState => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        lists: action.payload.lists,
        activeListId: action.payload.activeListId,
        isLoading: false,
      };
    case 'FETCH_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CREATE_LIST':
      return { ...state, lists: [...state.lists, action.payload] };
    case 'RENAME_LIST':
      return {
        ...state,
        lists: state.lists.map((list) =>
          list.id === action.payload.id
            ? { ...list, name: action.payload.name, updatedAt: new Date() }
            : list
        ),
      };
    case 'DELETE_LIST':
      return {
        ...state,
        lists: state.lists.filter((list) => list.id !== action.payload),
        activeListId:
          state.activeListId === action.payload
            ? state.lists.length > 1
              ? state.lists.find((list) => list.id !== action.payload)?.id ?? null
              : null
            : state.activeListId,
      };
    case 'SET_ACTIVE_LIST':
      return { ...state, activeListId: action.payload };
    case 'ADD_ITEM': {
      const { listId, item } = action.payload;
      return {
        ...state,
        lists: state.lists.map((list) =>
          list.id === listId
            ? {
                ...list,
                items: [...list.items, item],
                updatedAt: new Date(),
              }
            : list
        ),
      };
    }
    case 'UPDATE_ITEM': {
      const { listId, itemId, updates } = action.payload;
      return {
        ...state,
        lists: state.lists.map((list) =>
          list.id === listId
            ? {
                ...list,
                items: list.items.map((item) =>
                  item.id === itemId ? { ...item, ...updates } : item
                ),
                updatedAt: new Date(),
              }
            : list
        ),
      };
    }
    case 'REMOVE_ITEM': {
      const { listId, itemId } = action.payload;
      return {
        ...state,
        lists: state.lists.map((list) =>
          list.id === listId
            ? {
                ...list,
                items: list.items.filter((item) => item.id !== itemId),
                updatedAt: new Date(),
              }
            : list
        ),
      };
    }
    case 'TOGGLE_ITEM_COMPLETION': {
      const { listId, itemId } = action.payload;
      return {
        ...state,
        lists: state.lists.map((list) =>
          list.id === listId
            ? {
                ...list,
                items: list.items.map((item) =>
                  item.id === itemId ? { ...item, completed: !item.completed } : item
                ),
                updatedAt: new Date(),
              }
            : list
        ),
      };
    }
    case 'CLEAR_COMPLETED_ITEMS': {
      return {
        ...state,
        lists: state.lists.map((list) =>
          list.id === action.payload
            ? {
                ...list,
                items: list.items.filter((item) => !item.completed),
                updatedAt: new Date(),
              }
            : list
        ),
      };
    }
    default:
      return state;
  }
};

// Create context
const ShoppingContext = createContext<ShoppingContextValue | null>(null);

// Provider component
export const ShoppingProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(shoppingReducer, initialState);

  const fetchLists = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const lists = await shoppingListService.fetchLists();
      const activeListId = shoppingListService.getActiveList();
      dispatch({ type: 'FETCH_SUCCESS', payload: { lists, activeListId } });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error as Error });
    }
  };

  const createList = async (name: string) => {
    try {
      const id = await shoppingListService.createList(name);
      const lists = await shoppingListService.fetchLists();
      const newList = lists.find((list) => list.id === id);
      
      if (newList) {
        dispatch({ type: 'CREATE_LIST', payload: newList });
      }
      
      return id;
    } catch (error) {
      throw error;
    }
  };

  const renameList = async (id: string, name: string) => {
    try {
      await shoppingListService.renameList(id, name);
      dispatch({ type: 'RENAME_LIST', payload: { id, name } });
    } catch (error) {
      throw error;
    }
  };

  const deleteList = async (id: string) => {
    try {
      await shoppingListService.deleteList(id);
      dispatch({ type: 'DELETE_LIST', payload: id });
    } catch (error) {
      throw error;
    }
  };

  const setActiveList = (id: string) => {
    shoppingListService.setActiveList(id);
    dispatch({ type: 'SET_ACTIVE_LIST', payload: id });
  };

  const addItem = async (listId: string, item: Omit<ShoppingItem, 'id'>) => {
    try {
      const itemId = await shoppingListService.addItem(listId, item);
      
      // Refetch the list to get the updated item
      const lists = await shoppingListService.fetchLists();
      const updatedList = lists.find((list) => list.id === listId);
      const newItem = updatedList?.items.find((i) => i.id === itemId);
      
      if (newItem) {
        dispatch({
          type: 'ADD_ITEM',
          payload: { listId, item: newItem },
        });
      }
      
      return itemId;
    } catch (error) {
      throw error;
    }
  };

  const updateItem = async (
    listId: string,
    itemId: string,
    updates: Partial<ShoppingItem>
  ) => {
    try {
      await shoppingListService.updateItem(listId, itemId, updates);
      dispatch({
        type: 'UPDATE_ITEM',
        payload: { listId, itemId, updates },
      });
    } catch (error) {
      throw error;
    }
  };

  const removeItem = async (listId: string, itemId: string) => {
    try {
      await shoppingListService.removeItem(listId, itemId);
      dispatch({ type: 'REMOVE_ITEM', payload: { listId, itemId } });
    } catch (error) {
      throw error;
    }
  };

  const toggleItemCompletion = async (listId: string, itemId: string) => {
    try {
      await shoppingListService.toggleItemCompletion(listId, itemId);
      dispatch({
        type: 'TOGGLE_ITEM_COMPLETION',
        payload: { listId, itemId },
      });
    } catch (error) {
      throw error;
    }
  };

  const clearCompletedItems = async (listId: string) => {
    try {
      await shoppingListService.clearCompletedItems(listId);
      dispatch({ type: 'CLEAR_COMPLETED_ITEMS', payload: listId });
    } catch (error) {
      throw error;
    }
  };

  const generateListFromRecipe = async (recipeId: string, listId?: string) => {
    try {
      const generatedListId = await shoppingListService.generateListFromRecipe(recipeId, listId);
      
      // Refresh lists after generation
      await fetchLists();
      
      return generatedListId;
    } catch (error) {
      throw error;
    }
  };

  const generateListFromMealPlan = async (
    startDate: Date,
    endDate: Date,
    listId?: string
  ) => {
    try {
      const generatedListId = await shoppingListService.generateListFromMealPlan(
        startDate,
        endDate,
        listId
      );
      
      // Refresh lists after generation
      await fetchLists();
      
      return generatedListId;
    } catch (error) {
      throw error;
    }
  };

  // Load shopping lists on initial mount
  useEffect(() => {
    fetchLists();
  }, []);

  const value = {
    ...state,
    fetchLists,
    createList,
    renameList,
    deleteList,
    setActiveList,
    addItem,
    updateItem,
    removeItem,
    toggleItemCompletion,
    clearCompletedItems,
    generateListFromRecipe,
    generateListFromMealPlan,
  };

  return <ShoppingContext.Provider value={value}>{children}</ShoppingContext.Provider>;
};

// Custom hook for using the shopping context
export const useShopping = (): ShoppingContextValue => {
  const context = useContext(ShoppingContext);
  if (!context) {
    throw new Error('useShopping must be used within a ShoppingProvider');
  }
  return context;
};
