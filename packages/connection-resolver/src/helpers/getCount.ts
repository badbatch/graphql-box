import { type ConnectionInputOptions } from '../types.ts';

export const getCount = ({ first, last }: ConnectionInputOptions) => first ?? last!;
