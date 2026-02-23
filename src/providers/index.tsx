import type { ReactNode } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { theme } from '../theme/theme';

const queryClient = new QueryClient();

type Props = {
  children: ReactNode;
};

export function AppProviders({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
