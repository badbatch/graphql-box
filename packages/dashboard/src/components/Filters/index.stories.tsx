import { ThemeProvider, createTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { type Meta, type StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { formatLogEntries } from '../../../__testUtils__/helpers/formatLogEntries.ts';
import { logs } from '../../../__testUtils__/logs.ts';
import { createStore } from '../../store.ts';
import { theme } from '../../theme.ts';
import { Filters } from './index.tsx';

const meta: Meta<typeof Filters> = {
  argTypes: {},
  component: Filters,
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
    nextjs: {
      appDirectory: true,
    },
  },
  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  render: function Render(args) {
    return <Filters {...args} />;
  },
  tags: ['autodocs'],
  title: 'Components/Filters',
};

// Storybook requires this to be default export.
// eslint-disable-next-line import/no-default-export
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    filters: [],
  },
};
