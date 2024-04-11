import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { type ReactNode, StrictMode } from 'react';
import { Provider } from 'react-redux';
import { ErrorBoundary } from '../components/ErrorBoundary.tsx';
import { createStore } from '../store.ts';
import { theme } from '../theme.ts';

const RootLayout = (props: { children: ReactNode }) => {
  const { children } = props;

  return (
    <html lang="en">
      <body>
        <StrictMode>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ThemeProvider theme={createTheme(theme)}>
              <Provider store={createStore()}>
                <CssBaseline />
                <ErrorBoundary
                  onError={(error, errorInfo) => {
                    console.error(error, errorInfo); // eslint-disable-line no-console
                  }}
                  renderError={() => (
                    // TODO: Create error component
                    <div />
                  )}
                >
                  {children}
                </ErrorBoundary>
              </Provider>
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
