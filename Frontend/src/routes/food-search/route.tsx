import { createFileRoute } from '@tanstack/react-router';
import { FoodSearch } from '../../pages/FoodSearch';

export const Route = createFileRoute('/food-search')({
  component: FoodSearch,
}); 