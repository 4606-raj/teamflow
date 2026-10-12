import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/features/auth';

export function GuestRoute() {
  const { isAuthenticated, isLoading, user } = useAuthStore()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isAuthenticated) {
    return <Navigate to={user?.organizations?.length ? '/' : '/onboarding'} replace />
  }

  return <Outlet />
}