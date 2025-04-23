import { createFileRoute } from '@tanstack/react-router';
import { Goals } from '../../pages/Goals';
import { checkAuth } from '../../utils/auth';

export const Route = createFileRoute('/goals')({
  beforeLoad: checkAuth,
  component: Goals,
}); 