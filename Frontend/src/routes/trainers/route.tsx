import { createFileRoute } from '@tanstack/react-router';
import { Trainers } from '../../pages/Trainers';

export const Route = createFileRoute('/trainers')({
  component: Trainers,
}); 