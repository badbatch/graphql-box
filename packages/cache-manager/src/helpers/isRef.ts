import { isPlainObject } from '@graphql-box/helpers';
import { type CacheEntryRef } from '#types.ts';

export const isRef = (value: unknown): value is CacheEntryRef =>
  isPlainObject(value) && '__ref' in value && typeof value.__ref === 'string';
