import { createFileRoute, redirect } from '@tanstack/react-router'
import { checkAuth } from '../utils/auth'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const authResult = checkAuth();
    if (authResult === true) {
      return redirect({
        to: '/dashboard',
      });
    }
    return authResult;
  },
})

function App() {
  return (
    <div>
      APP
    </div>
  )
}
