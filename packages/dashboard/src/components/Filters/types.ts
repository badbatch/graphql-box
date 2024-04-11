import { type JsonValue } from 'type-fest';
import { type Filter } from '../../types.ts';
import { type TimeWindowValue } from '../TimeWindow/types.ts';

export type FilterOptions = {
  mandatory?: string[];
};

export type FiltersProps = {
  filters: ([Filter] | [Filter, JsonValue])[];
};

export type FiltersValues = {
  args: string;
  errorType: string;
  errors: boolean;
  operationName: string;
  origin: string;
  requestId: string;
  timeWindow: TimeWindowValue | undefined;
};
