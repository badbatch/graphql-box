import { type Meta, type StoryObj } from '@storybook/react';
import { SyntaxHighlight } from './index.tsx';

const meta: Meta<typeof SyntaxHighlight> = {
  argTypes: {},
  component: SyntaxHighlight,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'Components/SyntaxHighlight',
};

// Storybook requires this to be default export.
// eslint-disable-next-line import/no-default-export
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    code: '\nquery GetMovieCertifications(\n  $id: ID!\n) {\n  movie(id: $id) {\n    ...MovieCertifications\n  }\n}\n\nfragment MovieCertifications on Movie {\n  releaseDates {\n    iso_3166_1\n    releaseDates {\n      certification\n    }\n  }\n}\n',
    language: 'graphql',
  },
};
