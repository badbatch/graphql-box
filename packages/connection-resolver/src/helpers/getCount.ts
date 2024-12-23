import { type ConnectionInputOptions } from '../types.ts';

// Based on how ConnectionInputOptions are generated, either first
// or last would be set.
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const getCount = ({ first, last }: ConnectionInputOptions) => first ?? last!;
