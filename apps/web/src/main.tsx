import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Providers } from './providers/index.ts'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/index.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <Providers>
        <RouterProvider router={router} />
     </Providers>
  </StrictMode>,
)
