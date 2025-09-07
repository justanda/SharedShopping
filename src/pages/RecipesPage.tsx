import { useState } from "react";
import { RecipeGrid } from "../components/recipes/RecipeGrid";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import recipeScraperService from "../services/recipeScraperService";
import type { Recipe } from "../types";

const RecipesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [showLegalInfo, setShowLegalInfo] = useState(false);
  const [selectedDietaryRestrictions, setSelectedDietaryRestrictions] =
    useState<string[]>([]);
  const availableDietaryRestrictions =
    recipeScraperService.getDietaryRestrictions();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      const results = await recipeScraperService.searchRecipes(searchQuery, {
        dietaryRestrictions: selectedDietaryRestrictions,
        maxResults: 9,
      });
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching recipes:", error);
      alert(
        error instanceof Error
          ? error.message
          : "An error occurred while searching recipes"
      );
    } finally {
      setIsSearching(false);
    }
  };

  const toggleDietaryRestriction = (restriction: string) => {
    setSelectedDietaryRestrictions((prev) =>
      prev.includes(restriction)
        ? prev.filter((r) => r !== restriction)
        : [...prev, restriction]
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Recipes</h1>

      {/* Web Search Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Search for Recipes Online
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <Input
            type="text"
            placeholder="Search for recipes (e.g., chicken, pasta, vegan)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow"
          />
          <Button
            onClick={handleSearch}
            disabled={!searchQuery.trim() || isSearching}
            isLoading={isSearching}
          >
            {isSearching ? "Searching..." : "Search Online"}
          </Button>
        </div>

        <div className="mb-4">
          <p className="font-medium text-sm mb-2">Dietary Restrictions:</p>
          <div className="flex flex-wrap gap-2">
            {availableDietaryRestrictions.map((restriction) => (
              <button
                key={restriction}
                onClick={() => toggleDietaryRestriction(restriction)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedDietaryRestrictions.includes(restriction)
                    ? "bg-primary-500 text-white"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {restriction}
              </button>
            ))}
          </div>
        </div>

        <div className="text-right">
          <button
            onClick={() => setShowLegalInfo(!showLegalInfo)}
            className="text-sm text-neutral-500 hover:text-neutral-700"
          >
            {showLegalInfo
              ? "Hide Legal Information"
              : "View Legal Information"}
          </button>
        </div>

        {showLegalInfo && (
          <div className="mt-4 p-4 bg-neutral-50 rounded-md text-sm text-neutral-600 whitespace-pre-line">
            {recipeScraperService.getLegalDisclaimer()}
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                {recipe.imageUrl && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{recipe.title}</h3>
                  <p className="text-sm text-neutral-600 mb-3">
                    {recipe.description}
                  </p>
                  <div className="flex justify-between items-center text-sm text-neutral-500 mb-3">
                    <span>{recipe.prepTime + recipe.cookTime} min</span>
                    <span className="capitalize">{recipe.difficulty}</span>
                    <span>Serves {recipe.servings}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {recipe.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // In a real app, this would save to your recipes
                        alert(
                          `Recipe "${recipe.title}" saved to your collection!`
                        );
                      }}
                    >
                      Save Recipe
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        // In a real app, this would view the full recipe
                        alert(`Viewing full recipe for "${recipe.title}"`);
                      }}
                    >
                      View Recipe
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Your Recipes */}
      <h2 className="text-xl font-semibold mb-4">Your Recipes</h2>
      <RecipeGrid />
    </div>
  );
};

export default RecipesPage;
