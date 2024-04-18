import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { type configureStore } from '@reduxjs/toolkit';
import { type ReactNode, StrictMode, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { createStore } from '../../store.ts';
import { theme } from '../../theme.ts';
import { type Store } from '../../types.ts';
import { ErrorBoundary } from '../ErrorBoundary.tsx';
import { Loader } from '../Loader/index.tsx';

export const AppScaffold = (props: { children: ReactNode }) => {
  const { children } = props;
  const [store, setStore] = useState<ReturnType<typeof configureStore<Store>>>();

  useEffect(() => {
    setStore(createStore());
  }, []);

  return store ? (
    <StrictMode>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={createTheme(theme)}>
          <Provider store={store}>
            <CssBaseline />
            <ErrorBoundary
              onError={(error, errorInfo) => {
                console.error(error, errorInfo);
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
  ) : (
    <Loader />
  );
};
