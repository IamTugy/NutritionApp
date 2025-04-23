import { createFileRoute } from '@tanstack/react-router';
import { Nutrition } from '../../pages/Nutrition';
import { checkAuth } from '../../utils/auth';

export const Route = createFileRoute('/nutrition')({
  beforeLoad: checkAuth,
  component: Nutrition,
}); 