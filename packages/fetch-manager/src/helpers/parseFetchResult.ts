import type { PartialRawFetchData } from '@graphql-box/core';

export const parseFetchResult = async (fetchResult: Response): Promise<PartialRawFetchData> => ({
  headers: fetchResult.headers,
  ...((await fetchResult.json()) as Omit<PartialRawFetchData, 'headers'>),
});
