import { type Meta, type StoryObj } from '@storybook/react';
import { ProvidersWrapper } from '../../../__testUtils__/helpers/ProvidersWrapper.tsx';
import { DiffSelectDialog } from './index.tsx';

const meta: Meta<typeof DiffSelectDialog> = {
  argTypes: {},
  component: DiffSelectDialog,
  decorators: [
    Story => (
      <ProvidersWrapper>
        <Story />
      </ProvidersWrapper>
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
