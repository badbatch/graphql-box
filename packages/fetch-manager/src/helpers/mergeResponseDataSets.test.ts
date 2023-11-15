import { type PartialRawFetchData } from '@graphql-box/core';
import { expect } from '@jest/globals';
import { responseDataSets } from '../__testUtils__/responseDataSets.ts';
import { mergeResponseDataSets } from './mergeResponseDataSets.ts';

describe('mergeResponseDataSets', () => {
  it('should merge the response data correctly', () => {
    expect(mergeResponseDataSets(responseDataSets as unknown as PartialRawFetchData[])).toMatchSnapshot();
  });
});
