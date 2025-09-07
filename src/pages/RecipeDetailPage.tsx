import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipes } from '../context/RecipeContext';
import { RecipeDetail } from '../components/recipes/RecipeDetail';
import type { Recipe } from '../types';

const RecipeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRecipeById } = useRecipes();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/recipes');
      return;
    }

    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const foundRecipe = getRecipeById(id);
        
        if (!foundRecipe) {
          throw new Error('Recipe not found');
        }
        
        setRecipe(foundRecipe);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching recipe:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id, getRecipeById, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Oops! Recipe Not Found</h2>
        <p className="text-neutral-600 mb-6">
          The recipe you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate('/recipes')}
          className="text-primary-600 hover:text-primary-700"
        >
          Return to Recipes
        </button>
      </div>
    );
  }

  return <RecipeDetail recipe={recipe} />;
};

export default RecipeDetailPage;
