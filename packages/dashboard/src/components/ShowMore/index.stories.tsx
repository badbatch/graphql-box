import { Typography } from '@mui/material';
import { type Meta, type StoryObj } from '@storybook/react';
import { ShowMore } from './index.tsx';

const meta: Meta<typeof ShowMore> = {
  argTypes: {},
  component: ShowMore,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'Components/ShowMore',
};

// Storybook requires this to be default export.
// eslint-disable-next-line import/no-default-export
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: (
      <Typography sx={{ paddingRight: '5rem' }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </Typography>
    ),
  },
};