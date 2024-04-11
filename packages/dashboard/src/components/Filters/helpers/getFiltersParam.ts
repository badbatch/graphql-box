import { type JsonObject } from 'type-fest';

export const getFiltersParam = (searchParams: URLSearchParams): JsonObject => {
  const param = searchParams.get('filters');

  if (!param) {
    return {};
  }

  return JSON.parse(param) as JsonObject;
};
