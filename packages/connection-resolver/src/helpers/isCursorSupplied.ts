import { type PlainObject } from '@graphql-box/core';
import { type ConnectionInputOptions } from '../types.ts';

export const isCursorSupplied = ({ after, before }: PlainObject & ConnectionInputOptions) => !!(after ?? before);
