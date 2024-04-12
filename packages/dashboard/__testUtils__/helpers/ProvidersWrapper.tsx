import { ThemeProvider, createTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { createStore } from '../../src/store.ts';
import { theme } from '../../src/theme.ts';
import { logs } from '../logs.ts';
import { formatLogEntries } from './formatLogEntries.ts';

export type ProvidersWrapperProps = {
  children: ReactNode;
};

export const ProvidersWrapper = ({ children }: ProvidersWrapperProps) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <ThemeProvider theme={createTheme(theme)}>
      <Provider store={createStore({ preloadedState: { logs: formatLogEntries(logs) } })}>{children}</Provider>
    </ThemeProvider>
  </LocalizationProvider>
);
