import { type Palette } from '@mui/material';
import { grey } from '@mui/material/colors';

export const theme = {
  backgroundPrimary: grey[900],
  breakpoints: {
    values: {
      /* eslint-disable sort-keys-fix/sort-keys-fix */
      xs: 0,
      sm: 481,
      md: 768,
      lg: 1025,
      xl: 1225,
      /* eslint-enable sort-keys-fix/sort-keys-fix */
    },
  },
  mainTextPrimary: grey[900],
  mainTextSecondary: grey[100],
  supportingTextPrimary: grey[600],
  supportingTextSecondary: grey[500],
  typography: (palette: Palette) => ({
    h1: {
      color: palette.grey[800],
    },
    h2: {
      color: palette.grey[800],
    },
    h3: {
      color: palette.grey[800],
    },
    h4: {
      color: palette.grey[800],
    },
    h5: {
      color: palette.grey[800],
    },
    h6: {
      color: palette.grey[800],
    },
  }),
};
