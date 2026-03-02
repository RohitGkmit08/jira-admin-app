import { createTheme, type PaletteMode } from '@mui/material/styles';

import { COLORS } from '../constants/theme';

import { typography } from './typography';

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: COLORS.light.primary },
      secondary: { main: '#9c27b0' },
      background: {
        default:
          mode === 'light' ? COLORS.light.background : COLORS.dark.background,
        paper: mode === 'light' ? '#ffffff' : COLORS.dark.background,
      },
      text: {
        primary:
          mode === 'light' ? COLORS.light.textPrimary : COLORS.dark.textPrimary,
        secondary:
          mode === 'light'
            ? COLORS.light.textSecondary
            : COLORS.dark.textSecondary,
      },
      divider: mode === 'light' ? COLORS.light.border : COLORS.dark.border,
    },
    typography,
    components: {
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor:
              mode === 'light' ? '#ffffff' : COLORS.dark.background,
          },
        },
      },
    },
  });
