import { createBrowserRouter } from 'react-router-dom'

import { ProtectedRoute } from './ProtectedRoute'
import { GuestRoute } from './GuestRoute'

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      {
        path: '/login',
        element: <>login</>,
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
        element: <>home</>,
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