import { createFileRoute } from '@tanstack/react-router';
import { Dashboard } from '../../pages/Dashboard';
import { checkAuth } from '../../utils/auth';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: checkAuth,
  component: Dashboard,
}); 