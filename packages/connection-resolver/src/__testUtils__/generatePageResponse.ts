import { type PlainObject } from '@graphql-box/core';
import { encode } from 'js-base64';
import { type ResourceResponse } from '../types.ts';

export type Params = {
  resultsPerPage: number;
  totalPages: number;
  totalResults: number;
};

export const generatePageResponse =
  ({ resultsPerPage, totalPages, totalResults }: Params) =>
  (page: number) =>
    Promise.resolve({
      data: {
        page,
        results: Array.from({ length: resultsPerPage }, (_v, index) => index).map(index => {
          return { id: encode(`${index}::${page}`) };
        }),
        totalPages,
        totalResults,
      },
      headers: new Headers({ 'Cache-Control': 'max-age=60' }),
    }) as unknown as Promise<ResourceResponse<PlainObject>>;
