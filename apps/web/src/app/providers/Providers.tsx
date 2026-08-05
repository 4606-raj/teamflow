import { type ReactNode } from 'react';
// import { Toaster } from '@/components/ui/sonner';

import QueryProvider from './QueryProvider';
import ThemeProvider from './ThemeProvider';

interface Props {
  children: ReactNode;
}

export default function Providers({ children }: Props) {
  return (
    <ThemeProvider>
      <QueryProvider>
        {children}
        {/* <Toaster richColors position="top-right" /> */}
      </QueryProvider>
    </ThemeProvider>
  );
}