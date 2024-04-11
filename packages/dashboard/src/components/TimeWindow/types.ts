import { type FormikErrors } from 'formik';
import { type FiltersValues } from '../Filters/types.ts';

export enum TimeWindowRange {
  LAST_15_MINS = '60*15',
  LAST_1_HOUR = '60*60',
  LAST_24_HOURS = '60*60*24',
  SELECT_DATES = 'select_dates',
}

export type TimeWindowValue = {
  from?: number; // timestamp
  range: TimeWindowRange;
  to?: number; // timestamp
};

export type TimeWindowProps = {
  ariaLabelledBy?: string;
  errors?: { from?: string; to?: string };
  layout?: 'inline' | 'stacked';
  name: string;
  setFieldError: (field: string, value: string | undefined) => void;
  setFieldValue: (
    key: string,
    value: string | number | undefined
  ) => Promise<FormikErrors<Partial<FiltersValues>>> | Promise<void>;
  value: TimeWindowValue | undefined;
};
