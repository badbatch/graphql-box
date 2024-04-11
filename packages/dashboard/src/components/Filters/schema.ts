import * as yup from 'yup';
import { TimeWindowRange, type TimeWindowValue } from '../TimeWindow/types.ts';

export const schema = () =>
  yup.object().shape({
    args: yup.string().test('validJSON', 'The value is not valid JSON.', value => {
      if (!value) {
        return true;
      }

      try {
        JSON.parse(value);
        return true;
      } catch {
        return false;
      }
    }),
    operationName: yup.string(),
    origin: yup.string().test('validRegex', 'The value is not a valid regex.', value => {
      if (!value) {
        return true;
      }

      try {
        new RegExp(value); // eslint-disable-line no-new
        return true;
      } catch {
        return false;
      }
    }),
    requestId: yup.string(),
    timeWindow: yup.object().shape({
      from: yup
        .mixed()
        .test(
          'validFromDate',
          'The "from" date is required',
          (value, context: { parent: TimeWindowValue }) =>
            context.parent.range !== TimeWindowRange.SELECT_DATES || !!value
        ),
      to: yup
        .mixed()
        .test(
          'validToDate',
          'The "to" date is required',
          (value, context: { parent: TimeWindowValue }) =>
            context.parent.range !== TimeWindowRange.SELECT_DATES || !!value
        ),
    }),
  });
