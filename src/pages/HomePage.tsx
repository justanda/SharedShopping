import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card, CardContent, CardTitle } from '../components/common/Card';

const HomePage = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary-600 mb-4">
          Welcome to Recipe Roulette
        </h1>
        <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
          Your modern solution for meal planning, recipe management, and stress-free grocery shopping.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardContent className="text-center py-8">
            <div className="bg-primary-100 text-primary-600 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <CardTitle className="mb-2">Recipe Management</CardTitle>
            <p className="text-neutral-600 mb-4">
              Store, organize, and discover your favorite recipes in one place.
            </p>
            <Link to="/recipes">
              <Button variant="outline" fullWidth>
                Browse Recipes
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-8">
            <div className="bg-primary-100 text-primary-600 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
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
            </div>
            <CardTitle className="mb-2">Shopping Lists</CardTitle>
            <p className="text-neutral-600 mb-4">
              Create and manage shopping lists from your recipes with ease.
            </p>
            <Link to="/shopping-lists">
              <Button variant="outline" fullWidth>
                View Shopping Lists
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-8">
            <div className="bg-primary-100 text-primary-600 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <CardTitle className="mb-2">Meal Planning</CardTitle>
            <p className="text-neutral-600 mb-4">
              Plan your meals ahead with our intuitive calendar interface.
            </p>
            <Link to="/meal-planner">
              <Button variant="outline" fullWidth>
                Start Planning
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="bg-primary-50 rounded-2xl p-8 mb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-primary-800 mb-4">
            Get Started in Three Simple Steps
          </h2>
          <div className="space-y-6 mt-8">
            <div className="flex items-start">
              <div className="bg-primary-100 text-primary-800 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">Add Your Recipes</h3>
                <p className="text-neutral-600">
                  Start by adding your favorite recipes to your collection. You can enter them
                  manually or import them from URLs.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-primary-100 text-primary-800 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">Plan Your Meals</h3>
                <p className="text-neutral-600">
                  Use the meal planner to schedule recipes throughout the week. Drag and drop to
                  rearrange as needed.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-primary-100 text-primary-800 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">Generate Shopping Lists</h3>
                <p className="text-neutral-600">
                  Automatically create shopping lists from your meal plan or individual recipes,
                  organized by store department.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold mb-6">Ready to get started?</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/recipes/create">
            <Button size="lg">Create Your First Recipe</Button>
          </Link>
          <Link to="/recipes">
            <Button variant="outline" size="lg">
              Browse Recipes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
