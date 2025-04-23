import { createFileRoute } from '@tanstack/react-router';
import { Nutrition } from '../../pages/Nutrition';

export const Route = createFileRoute('/nutrition')({
  component: Nutrition,
}); 