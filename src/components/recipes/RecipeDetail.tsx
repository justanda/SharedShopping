import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecipes } from '../../context/RecipeContext';
import { useShopping } from '../../context/ShoppingContext';
import { Button } from '../common/Button';
import { Card, CardContent } from '../common/Card';
import type { Recipe } from '../../types';

interface RecipeDetailProps {
  recipe: Recipe;
}

export const RecipeDetail = ({ recipe }: RecipeDetailProps) => {
  const navigate = useNavigate();
  const { deleteRecipe } = useRecipes();
  const { generateListFromRecipe } = useShopping();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddingToList, setIsAddingToList] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        setIsDeleting(true);
        await deleteRecipe(recipe.id);
        navigate('/recipes');
      } catch (error) {
        console.error('Error deleting recipe:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleAddToShoppingList = async () => {
    try {
      setIsAddingToList(true);
      const listId = await generateListFromRecipe(recipe.id);
      navigate(`/shopping-lists/${listId}`);
    } catch (error) {
      console.error('Error adding recipe to shopping list:', error);
    } finally {
      setIsAddingToList(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link to="/recipes" className="text-primary-600 hover:text-primary-700 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Recipes
        </Link>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleAddToShoppingList}
            isLoading={isAddingToList}
            leftIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
          >
            Add to Shopping List
          </Button>
          <Link to={`/recipes/${recipe.id}/edit`}>
            <Button
              variant="secondary"
              leftIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              }
            >
              Edit
            </Button>
          </Link>
          <Button
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
            leftIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            }
          >
            Delete
          </Button>
        </div>
      </div>

      {recipe.imageUrl && (
        <div className="mb-6 overflow-hidden rounded-lg">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-64 object-cover"
          />
        </div>
      )}

      <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        {recipe.tags.map((tag) => (
          <span
            key={tag}
            className="inline-block px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-6 mb-6 text-sm text-neutral-600">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1 text-primary-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Prep: {recipe.prepTime} min</span>
        </div>
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1 text-primary-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Cook: {recipe.cookTime} min</span>
        </div>
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1 text-primary-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <span>Serves: {recipe.servings}</span>
        </div>
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1 text-primary-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span>Difficulty: {recipe.difficulty}</span>
        </div>
      </div>

      <p className="text-neutral-700 mb-8">{recipe.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-1">
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient.id} className="flex justify-between items-start">
                    <span>{ingredient.name}</span>
                    <span className="text-neutral-500 ml-2">
                      {ingredient.quantity} {ingredient.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">Instructions</h2>
              <ol className="space-y-4">
                {recipe.instructions
                  .sort((a, b) => a.order - b.order)
                  .map((step) => (
                    <li key={step.id} className="flex">
                      <span className="bg-primary-100 text-primary-800 w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        {step.order + 1}
                      </span>
                      <p className="text-neutral-700">{step.instruction}</p>
                    </li>
                  ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>

      {recipe.notes && (
        <Card className="mb-8">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Notes</h2>
            <p className="text-neutral-700">{recipe.notes}</p>
          </CardContent>
        </Card>
      )}

      <div className="text-sm text-neutral-500 mt-8">
        <p>Created: {new Date(recipe.createdAt).toLocaleDateString()}</p>
        <p>Last updated: {new Date(recipe.updatedAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};
