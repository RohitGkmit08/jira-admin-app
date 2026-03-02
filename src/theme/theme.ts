import { createTheme, type PaletteMode } from '@mui/material/styles';

import { COLORS } from '../constants/theme';

import { typography } from './typography';

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,

      primary: {
        main: mode === 'light' ? COLORS.light.primary : COLORS.dark.primary,
      },

      secondary: {
        main: mode === 'light' ? COLORS.light.secondary : COLORS.dark.secondary,
      },

      background: {
        default:
          mode === 'light' ? COLORS.light.background : COLORS.dark.background,
        paper: mode === 'light' ? COLORS.light.paper : COLORS.dark.background,
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
              mode === 'light' ? COLORS.light.paper : COLORS.dark.background,
          },
        },
      },
    },
  });
