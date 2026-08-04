import { createBrowserRouter } from 'react-router-dom'

import { ProtectedRoute } from './ProtectedRoute'
import { GuestRoute } from './GuestRoute'

import Login from '@/pages/auth/Login'
import Dashboard from '@/pages/Dashboard'

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <>register</>,
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/projects',
        element: <>projects</>,
      },
      {
        path: '/projects/:id',
        element: <>project details</>,
      },
      {
        path: '/settings',
        element: <>settings</>,
      },
    ],
  },
])