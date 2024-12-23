import { type PartialRawFetchData } from '@graphql-box/core';

export const parseFetchResult = async (fetchResult: Response): Promise<PartialRawFetchData> => ({
  headers: fetchResult.headers,
  // .json() resolves to an any type
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ...((await fetchResult.json()) as Omit<PartialRawFetchData, 'headers'>),
});
