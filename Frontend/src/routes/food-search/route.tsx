import { createFileRoute } from '@tanstack/react-router';
import { FoodSearch } from '../../pages/FoodSearch';
import { checkAuth } from '../../utils/auth';

export const Route = createFileRoute('/food-search')({
  beforeLoad: checkAuth,
  component: FoodSearch,
}); 