import type fetchMock from 'fetch-mock';
import { cloneDeepWith } from 'lodash-es';
import { type PlainData, type PlainObject } from '@graphql-box/core';
import { URL } from '../../constants.ts';
import { HEADERS } from './constants.ts';
import { type MockRequestOptions } from './types.ts';

const buildRequestURL = (hash?: string): string => {
  if (hash) {
    return `${URL}?requestId=${hash}`;
  }

  return '*';
};

export const mockRequest = (fetchMock: fetchMock.FetchMockStatic, { data, hash }: MockRequestOptions): void => {
  const body = { data };
  const headers = { 'cache-control': 'public, max-age=5' };
  fetchMock.post(buildRequestURL(hash), { body, headers });
};

export const dehydrateFetchMock = <T extends PlainData = PlainData>(data: T): T => {
  // This is fine as it is testing code
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return cloneDeepWith(data, (value: unknown) => {
    if (!(value instanceof Headers)) {
      return;
    }

    const entries = [...value.entries()];

    return entries.reduce<PlainObject>((acc, [key, val]) => {
      acc[key] = val;
      return acc;
    }, {});
  }) as T;
};

export const rehydrateFetchMock = <T extends PlainData = PlainData>(data: T): T => {
  // This is fine as it is testing code
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return cloneDeepWith(data, (value: HeadersInit | undefined, key: string | number | undefined) => {
    if (key !== HEADERS) {
      return;
    }

    return new Headers(value);
  }) as T;
};
