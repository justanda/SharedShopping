import { RecipeGrid } from '../components/recipes/RecipeGrid';

const RecipesPage = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Recipes</h1>
      <RecipeGrid />
    </div>
  );
};

export default RecipesPage;
