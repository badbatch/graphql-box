import { type Meta, type StoryObj } from '@storybook/react';
import { Loader } from './index.tsx';

const meta: Meta<typeof Loader> = {
  argTypes: {},
  component: Loader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'Components/Loader',
};

// Storybook requires this to be default export.
// eslint-disable-next-line import/no-default-export
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
