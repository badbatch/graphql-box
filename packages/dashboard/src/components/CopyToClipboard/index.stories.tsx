import { type Meta, type StoryObj } from '@storybook/react';
import { CopyToClipboard } from './index.tsx';

const meta: Meta<typeof CopyToClipboard> = {
  argTypes: {},
  component: CopyToClipboard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'Components/CopyToClipboard',
};

// Storybook requires this to be default export.
// eslint-disable-next-line import/no-default-export
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
