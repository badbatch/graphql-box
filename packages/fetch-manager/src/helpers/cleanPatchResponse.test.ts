import { type PartialRawFetchData } from '@graphql-box/core';
import { expect } from '@jest/globals';
import { responseDataSets } from '../__testUtils__/responseDataSets.ts';
import { cleanPatchResponse } from './cleanPatchResponse.ts';

describe('cleanPatchResponse', () => {
  it('should merge the response data correctly', () => {
    expect(cleanPatchResponse(responseDataSets[5] as unknown as PartialRawFetchData)).toMatchSnapshot();
  });
});
