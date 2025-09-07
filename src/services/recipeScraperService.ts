import { v4 as uuidv4 } from "uuid";
import type { Recipe, Ingredient, RecipeStep } from "../types";

// List of forbidden terms for safety
const FORBIDDEN_TERMS = [
  "poisonous",
  "toxic",
  "inedible",
  "dangerous",
  "deadly",
  "lethal",
  // Add more terms as needed
];

interface RecipeSource {
  name: string;
  url: string;
  logoUrl?: string;
}

class RecipeScraperService {
  private _sources: RecipeSource[] = [
    { name: "Recipe Roulette", url: "https://reciperoulette.com" },
    { name: "Food Network", url: "https://foodnetwork.com" },
    { name: "Allrecipes", url: "https://allrecipes.com" },
    { name: "Epicurious", url: "https://epicurious.com" },
    { name: "Tasty", url: "https://tasty.co" },
  ];

  /**
   * Search for recipes online using the query term
   * Note: In a real implementation, this would call a backend API to scrape recipes
   * For this demo, we'll generate mock results
   */
  async searchRecipes(
    query: string,
    options: {
      dietaryRestrictions?: string[];
      maxResults?: number;
    } = {}
  ): Promise<Recipe[]> {
    // Check for forbidden terms in query
    if (this.containsForbiddenTerms(query)) {
      throw new Error(
        "Your search contains terms that may be unsafe. Please try a different search."
      );
    }

    // For demo, we'll just simulate a network request and return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = this.generateMockRecipes(query, options);
        resolve(results);
      }, 1500); // Simulate network delay
    });
  }

  /**
   * Check if the query contains any forbidden terms
   */
  private containsForbiddenTerms(query: string): boolean {
    const normalizedQuery = query.toLowerCase();
    return FORBIDDEN_TERMS.some((term) => normalizedQuery.includes(term));
  }

  /**
   * Generate mock recipes for demo purposes
   */
  private generateMockRecipes(
    query: string,
    options: {
      dietaryRestrictions?: string[];
      maxResults?: number;
    }
  ): Recipe[] {
    const { dietaryRestrictions = [], maxResults = 10 } = options;

    // Generate base recipes
    const baseRecipes = [
      {
        title: `${query.charAt(0).toUpperCase() + query.slice(1)} Pasta`,
        description: `A delicious ${query} pasta dish that's perfect for weeknight dinners.`,
        tags: ["pasta", "italian", "dinner", query.toLowerCase()],
        difficulty: "easy" as const,
        prepTime: 15,
        cookTime: 20,
        servings: 4,
      },
      {
        title: `Roasted ${query.charAt(0).toUpperCase() + query.slice(1)}`,
        description: `Simple and flavorful roasted ${query} that makes a perfect side dish.`,
        tags: ["side dish", "vegetables", "healthy", query.toLowerCase()],
        difficulty: "easy" as const,
        prepTime: 10,
        cookTime: 25,
        servings: 4,
      },
      {
        title: `${query.charAt(0).toUpperCase() + query.slice(1)} Soup`,
        description: `Warming ${query} soup that's perfect for cold days.`,
        tags: ["soup", "comfort food", "winter", query.toLowerCase()],
        difficulty: "medium" as const,
        prepTime: 20,
        cookTime: 40,
        servings: 6,
      },
      {
        title: `${query.charAt(0).toUpperCase() + query.slice(1)} Stir Fry`,
        description: `Quick and easy ${query} stir fry with vegetables and your choice of protein.`,
        tags: ["asian", "stir fry", "quick", query.toLowerCase()],
        difficulty: "easy" as const,
        prepTime: 15,
        cookTime: 15,
        servings: 4,
      },
      {
        title: `${query.charAt(0).toUpperCase() + query.slice(1)} Salad`,
        description: `Fresh and healthy ${query} salad with a zesty dressing.`,
        tags: ["salad", "healthy", "lunch", query.toLowerCase()],
        difficulty: "easy" as const,
        prepTime: 15,
        cookTime: 0,
        servings: 2,
      },
    ];

    // Filter by dietary restrictions if any
    const filteredRecipes =
      dietaryRestrictions.length > 0
        ? baseRecipes.filter((recipe) => {
            // Simple simulation - if dietary restriction is "vegetarian", exclude recipes with meat terms
            if (
              dietaryRestrictions.includes("vegetarian") &&
              (recipe.title.toLowerCase().includes("meat") ||
                recipe.description.toLowerCase().includes("meat"))
            ) {
              return false;
            }

            // If restriction is "vegan", exclude recipes with dairy terms
            if (
              dietaryRestrictions.includes("vegan") &&
              (recipe.title.toLowerCase().includes("cheese") ||
                recipe.description.toLowerCase().includes("cheese") ||
                recipe.title.toLowerCase().includes("milk") ||
                recipe.description.toLowerCase().includes("milk"))
            ) {
              return false;
            }

            // If restriction is "gluten-free", exclude recipes with wheat/gluten terms
            if (
              dietaryRestrictions.includes("gluten-free") &&
              (recipe.title.toLowerCase().includes("pasta") ||
                recipe.description.toLowerCase().includes("pasta") ||
                recipe.title.toLowerCase().includes("bread") ||
                recipe.description.toLowerCase().includes("bread"))
            ) {
              return false;
            }

            return true;
          })
        : baseRecipes;

    // Create full recipe objects with ingredients and instructions
    const recipes: Recipe[] = filteredRecipes
      .slice(0, maxResults)
      .map((base) => {
        const now = new Date();

        // Generate random ingredients
        const ingredients: Ingredient[] = [
          {
            id: uuidv4(),
            name: query.toLowerCase(),
            quantity: Math.floor(Math.random() * 5) + 1,
            unit: "cups",
            section: "Main Ingredients",
          },
          {
            id: uuidv4(),
            name: "Olive oil",
            quantity: 2,
            unit: "tbsp",
            section: "Pantry Items",
          },
          {
            id: uuidv4(),
            name: "Salt",
            quantity: 1,
            unit: "tsp",
            section: "Pantry Items",
          },
          {
            id: uuidv4(),
            name: "Black pepper",
            quantity: 0.5,
            unit: "tsp",
            section: "Pantry Items",
          },
          {
            id: uuidv4(),
            name: "Garlic",
            quantity: 2,
            unit: "cloves",
            section: "Produce",
          },
        ];

        // Generate random steps
        const instructions: RecipeStep[] = [
          {
            id: uuidv4(),
            order: 0,
            instruction: `Prepare the ${query.toLowerCase()} by washing and cutting into small pieces.`,
          },
          {
            id: uuidv4(),
            order: 1,
            instruction: "Heat olive oil in a large pan over medium heat.",
          },
          {
            id: uuidv4(),
            order: 2,
            instruction: "Add garlic and sauté until fragrant, about 1 minute.",
          },
          {
            id: uuidv4(),
            order: 3,
            instruction: `Add ${query.toLowerCase()} and cook for 5-7 minutes, stirring occasionally.`,
          },
          {
            id: uuidv4(),
            order: 4,
            instruction: "Season with salt and pepper to taste.",
          },
          {
            id: uuidv4(),
            order: 5,
            instruction: "Serve hot and enjoy!",
          },
        ];

        // Generate random source
        const source =
          this._sources[Math.floor(Math.random() * this._sources.length)];

        // Create the complete recipe
        return {
          ...base,
          id: uuidv4(),
          imageUrl: `https://source.unsplash.com/random/300x200/?${encodeURIComponent(
            query
          )}`,
          ingredients,
          instructions,
          notes: `This recipe featuring ${query.toLowerCase()} was sourced from ${
            source.name
          } and modified for simplicity.`,
          createdAt: now,
          updatedAt: now,
          source: {
            name: source.name,
            url: `${source.url}/recipes/${query
              .toLowerCase()
              .replace(/\s+/g, "-")}`,
            retrievedAt: now,
          },
        };
      });

    return recipes;
  }

  /**
   * Get available dietary restrictions for filtering
   */
  getDietaryRestrictions(): string[] {
    return [
      "vegetarian",
      "vegan",
      "gluten-free",
      "dairy-free",
      "nut-free",
      "low-carb",
      "keto",
      "paleo",
    ];
  }

  /**
   * Get legal information for recipe scraping
   */
  getLegalDisclaimer(): string {
    return `
      Recipe Search Disclaimer:
      
      1. The recipes provided through this search feature are collected from various public sources and are provided for informational purposes only.
      
      2. Recipe Roulette acknowledges that recipes may be subject to copyright protection. We make every effort to properly attribute recipes to their original sources.
      
      3. If you believe your copyrighted content has been used improperly, please contact us for prompt removal.
      
      4. Recipe Roulette is not responsible for the accuracy, completeness, or safety of any recipe. Users should exercise caution and judgment when preparing recipes, especially regarding potential allergens or dietary restrictions.
      
      5. By using this search feature, you agree to use the recipes for personal, non-commercial purposes only.
    `;
  }
}

export default new RecipeScraperService();
