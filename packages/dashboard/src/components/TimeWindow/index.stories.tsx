import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { type Meta, type StoryObj } from '@storybook/react';
import { useFormik } from 'formik';
import { TimeWindow } from './index.tsx';
import { TimeWindowRange } from './types.ts';

const meta: Meta<typeof TimeWindow> = {
  argTypes: {},
  component: TimeWindow,
  decorators: [
    Story => (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Story />
      </LocalizationProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  render: function Render(args) {
    const formik = useFormik({
      initialValues: {
        timeWindow: {
          range: TimeWindowRange.LAST_15_MINS,
        },
      },
      onSubmit: values => {
        console.log(values);
      },
    });

    return (
      <TimeWindow
        {...args}
        errors={formik.errors.timeWindow as { from?: string; to?: string } | undefined}
        name="timeWindow"
        setFieldError={formik.setFieldError}
        setFieldValue={formik.setFieldValue}
        value={formik.values.timeWindow}
      />
    );
  },
  tags: ['autodocs'],
  title: 'Components/TimeWindow',
};

// Storybook requires this to be default export.
// eslint-disable-next-line import/no-default-export
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    name: 'timeWindow',
  },
};
