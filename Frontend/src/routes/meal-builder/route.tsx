import { createFileRoute } from '@tanstack/react-router';
import { MealBuilder } from '../../pages/MealBuilder';

export const Route = createFileRoute('/meal-builder')({
  component: MealBuilder,
}); 