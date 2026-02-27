import { createTheme, type PaletteMode } from '@mui/material/styles';

import { typography } from './typography';

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: '#1976d2' },
      secondary: { main: '#9c27b0' },
      background: {
        default: mode === 'light' ? '#f5f6fa' : '#1f1f1f',
        paper: mode === 'light' ? '#ffffff' : '#2c2c2c',
      },
      text: {
        primary: mode === 'light' ? '#172b4d' : '#ffffff',
        secondary: mode === 'light' ? '#6b778c' : '#b0b0b0',
      },
      divider: mode === 'light' ? '#e0e0e0' : '#3a3a3a',
    },
    typography,
    components: {
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor:
              mode === 'light' ? 'pallet.background?.paper' : '#2c2c2c',
          },
        },
      },
    },
  });
