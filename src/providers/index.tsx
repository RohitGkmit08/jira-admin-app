import { createContext, useContext, useState, type ReactNode } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import type { PaletteMode } from '@mui/material';

import { getTheme } from '../theme/theme';

type ColorModeContextType = {
  mode: PaletteMode;
  toggleMode: () => void;
};

export const ColorModeContext = createContext<ColorModeContextType>({
  mode: 'light',
  toggleMode: () => {
    if (typeof console !== 'undefined') {
      console.warn('ColorModeProvider not wrapped');
    }
  },
});

export const useColorMode = () => useContext(ColorModeContext);

type Props = {
  children: ReactNode;
};

export function ColorModeProvider({ children }: Props) {
  const [mode, setMode] = useState<PaletteMode>('light');

  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = getTheme(mode);

  return (
    <ColorModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '8px',
              fontSize: '14px',
            },
          }}
        />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
