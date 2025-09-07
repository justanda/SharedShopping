import { z } from 'zod';

// Define Zod schemas for runtime validation
export const ingredientSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Ingredient name is required"),
  quantity: z.number().positive("Quantity must be positive"),
  unit: z.string(),
  section: z.string().optional(),
});

export const recipeStepSchema = z.object({
  id: z.string(),
  order: z.number().int().nonnegative(),
  instruction: z.string().min(1, "Instruction is required"),
});

export const difficultySchema = z.enum(['easy', 'medium', 'hard']);

export const recipeSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url().optional(),
  prepTime: z.number().nonnegative(),
  cookTime: z.number().nonnegative(),
  servings: z.number().positive(),
  difficulty: difficultySchema,
  tags: z.array(z.string()),
  ingredients: z.array(ingredientSchema),
  instructions: z.array(recipeStepSchema),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const shoppingItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Item name is required"),
  quantity: z.number().positive("Quantity must be positive"),
  unit: z.string(),
  section: z.string(),
  completed: z.boolean(),
  note: z.string().optional(),
});

export const shoppingListSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "List name is required"),
  items: z.array(shoppingItemSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const mealTypeSchema = z.enum(['breakfast', 'lunch', 'dinner', 'snack']);

export const plannedMealSchema = z.object({
  id: z.string(),
  date: z.date(),
  mealType: mealTypeSchema,
  recipeId: z.string().optional(),
  customMealName: z.string().optional(),
  servings: z.number().positive(),
});

export const mealPlanSchema = z.object({
  id: z.string(),
  plannedMeals: z.array(plannedMealSchema),
});

// TypeScript types derived from Zod schemas
export type Ingredient = z.infer<typeof ingredientSchema>;
export type RecipeStep = z.infer<typeof recipeStepSchema>;
export type Difficulty = z.infer<typeof difficultySchema>;
export type Recipe = z.infer<typeof recipeSchema>;
export type ShoppingItem = z.infer<typeof shoppingItemSchema>;
export type ShoppingList = z.infer<typeof shoppingListSchema>;
export type MealType = z.infer<typeof mealTypeSchema>;
export type PlannedMeal = z.infer<typeof plannedMealSchema>;
export type MealPlan = z.infer<typeof mealPlanSchema>;

// Filter types
export interface RecipeFilters {
  query?: string;
  tags?: string[];
  difficulty?: Difficulty;
  maxPrepTime?: number;
  maxCookTime?: number;
}
