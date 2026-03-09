import { createTheme, type PaletteMode } from '@mui/material/styles';

import { COLORS } from '../constants/theme';

import { typography } from './typography';

export const getTheme = (mode: PaletteMode) => {
  const themeColors = COLORS[mode];

  return createTheme({
    palette: {
      mode,

      primary: {
        main: themeColors.primary,
      },

      secondary: {
        main: themeColors.secondary,
      },

      background: {
        default: themeColors.background,
        paper: themeColors.paper,
      },

      text: {
        primary: themeColors.textPrimary,
        secondary: themeColors.textSecondary,
      },

      divider: themeColors.border,
    },

    typography,

    components: {
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: themeColors.paper,
          },
        },
      },
    },
  });
};
