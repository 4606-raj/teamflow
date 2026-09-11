import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/index.css";

import { Providers } from "@/app/providers";
import { router } from "@/app/router";

import { RouterProvider } from "react-router-dom";
import { Toaster } from '@/shared/components/ui/sonner'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </Providers>
  </StrictMode>
);