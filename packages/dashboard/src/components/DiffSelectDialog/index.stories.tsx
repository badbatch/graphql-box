import { ThemeProvider, createTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { type Meta, type StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { formatLogEntries } from '../../../__testUtils__/helpers/formatLogEntries.ts';
import { logs } from '../../../__testUtils__/logs.ts';
import { createStore } from '../../store.ts';
import { theme } from '../../theme.ts';
import { DiffSelectDialog } from './index.tsx';

const meta: Meta<typeof DiffSelectDialog> = {
  argTypes: {},
  component: DiffSelectDialog,
  decorators: [
    Story => (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={createTheme(theme)}>
          <Provider store={createStore({ preloadedState: { logs: formatLogEntries(logs) } })}>
            <Story />
          </Provider>
        </ThemeProvider>
      </LocalizationProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'Components/DiffSelectDialog',
};

// Storybook requires this to be default export.
// eslint-disable-next-line import/no-default-export
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    open: true,
  },
};
