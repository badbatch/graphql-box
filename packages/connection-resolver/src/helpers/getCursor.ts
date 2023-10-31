import { type ConnectionInputOptions } from '../types.ts';

export const getCursor = ({ after, before }: ConnectionInputOptions) => before ?? after;
