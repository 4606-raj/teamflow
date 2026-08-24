import { createBrowserRouter } from "react-router-dom";

import { GuestRoute } from "@/routes/GuestRoute";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

import { authRoutes } from "@/features/auth/routes";
import { onboardingRoutes } from "@/features/onboarding/routes";
import { dashboardRoutes } from "@/features/dashboard/routes";
// import { projectRoutes } from "@/features/projects/routes";

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: authRoutes,
  },
  {
    element: <ProtectedRoute />,
    children: [
      ...dashboardRoutes,
      ...onboardingRoutes,
    ],
  },
]);