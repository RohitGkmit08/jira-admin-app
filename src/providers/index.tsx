import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { PaletteMode } from '@mui/material';

import { getTheme } from '../theme/theme';

const queryClient = new QueryClient();

type ColorModeContextType = {
  mode: PaletteMode;
  toggleMode: () => void;
};

export const ColorModeContext = createContext<ColorModeContextType>({
  mode: 'light',
  toggleMode: () => {},
});

export const useColorMode = () => useContext(ColorModeContext);

type Props = {
  children: ReactNode;
};

export function AppProviders({ children }: Props) {
  const [mode, setMode] = useState<PaletteMode>('light');

  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = getTheme(mode);

  return (
    <QueryClientProvider client={queryClient}>
      <ColorModeContext.Provider value={{ mode, toggleMode }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ColorModeContext.Provider>
    </QueryClientProvider>
  );
}
