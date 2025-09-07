import type { ReactNode } from 'react';
import { RecipeProvider } from './RecipeContext';
import { ShoppingProvider } from './ShoppingContext';
import { PlannerProvider } from './PlannerContext';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Combines all context providers into a single component
 * for easier application-wide state management
 */
export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <RecipeProvider>
      <ShoppingProvider>
        <PlannerProvider>{children}</PlannerProvider>
      </ShoppingProvider>
    </RecipeProvider>
  );
};
