import { type Meta, type StoryObj } from '@storybook/react';
import { ProvidersWrapper } from '../../../__testUtils__/helpers/ProvidersWrapper.tsx';
import { Filters } from './index.tsx';

const meta: Meta<typeof Filters> = {
  argTypes: {},
  component: Filters,
  decorators: [
    Story => (
      <ProvidersWrapper>
        <Story />
      </ProvidersWrapper>
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