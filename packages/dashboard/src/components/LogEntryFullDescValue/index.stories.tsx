import { type Meta, type StoryObj } from '@storybook/react';
import { ProvidersWrapper } from '../../../__testUtils__/helpers/ProvidersWrapper.tsx';
import { LogEntryFullDescValue } from './index.tsx';

const meta: Meta<typeof LogEntryFullDescValue> = {
  argTypes: {},
  component: LogEntryFullDescValue,
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
  title: 'Components/LogEntryFullDescValue',
};

// Storybook requires this to be default export.
// eslint-disable-next-line import/no-default-export
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    code: '\nquery GetMovieCertifications(\n  $id: ID!\n) {\n  movie(id: $id) {\n    ...MovieCertifications\n  }\n}\n\nfragment MovieCertifications on Movie {\n  releaseDates {\n    iso_3166_1\n    releaseDates {\n      certification\n    }\n  }\n}\n',
    descKey: 'request',
    language: 'graphql',
  },
};
