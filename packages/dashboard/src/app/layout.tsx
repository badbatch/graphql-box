import { ThemeProvider, createTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { type ReactNode, StrictMode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store.ts';
import { theme } from '../theme.ts';

const RootLayout = (props: { children: ReactNode }) => {
  const { children } = props;

  return (
    <html lang="en">
      <body>
        <StrictMode>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ThemeProvider theme={createTheme(theme)}>
              <Provider store={store}>{children}</Provider>
            </ThemeProvider>
          </LocalizationProvider>
        </StrictMode>
      </body>
    </html>
  );
};

// nextjs requires this to be default export
// eslint-disable-next-line import/no-default-export
export default RootLayout;
