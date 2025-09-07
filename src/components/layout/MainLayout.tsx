import { useState } from 'react';
import type { ReactNode } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { cn } from '../../utils/classNames';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <header className="sticky top-0 z-50 bg-white dark:bg-neutral-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <NavLink to="/" className="text-2xl font-bold text-primary-600">
              Recipe Roulette
            </NavLink>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/recipes"
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium transition-colors',
                  isActive
                    ? 'text-primary-600'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'
                )
              }
            >
              Recipes
            </NavLink>
            <NavLink
              to="/shopping-lists"
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium transition-colors',
                  isActive
                    ? 'text-primary-600'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'
                )
              }
            >
              Shopping Lists
            </NavLink>
            <NavLink
              to="/meal-planner"
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium transition-colors',
                  isActive
                    ? 'text-primary-600'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'
                )
              }
            >
              Meal Planner
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium transition-colors',
                  isActive
                    ? 'text-primary-600'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'
                )
              }
            >
              Settings
            </NavLink>
          </nav>

          {/* Profile Icon */}
          <div className="hidden md:block">
            <Link 
              to="/profile" 
              className="ml-4 p-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
              aria-label="User Profile"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 px-4 py-2">
            <nav className="flex flex-col space-y-4 py-2">
              <NavLink
                to="/recipes"
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium py-2 transition-colors',
                    isActive
                      ? 'text-primary-600'
                      : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'
                  )
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Recipes
              </NavLink>
              <NavLink
                to="/shopping-lists"
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium py-2 transition-colors',
                    isActive
                      ? 'text-primary-600'
                      : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'
                  )
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Shopping Lists
              </NavLink>
              <NavLink
                to="/meal-planner"
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium py-2 transition-colors',
                    isActive
                      ? 'text-primary-600'
                      : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'
                  )
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Meal Planner
              </NavLink>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium py-2 transition-colors',
                    isActive
                      ? 'text-primary-600'
                      : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'
                  )
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Settings
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium py-2 transition-colors',
                    isActive
                      ? 'text-primary-600'
                      : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'
                  )
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </NavLink>
            </nav>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>

      <footer className="bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
            Recipe Roulette &copy; {new Date().getFullYear()} - Your Meal Planning Solution
          </p>
        </div>
      </footer>
    </div>
  );
};
