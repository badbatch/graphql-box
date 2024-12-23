import fetchMock from 'fetch-mock';
import { type PlainData } from '@graphql-box/core';
import { isPlainObject } from '@graphql-box/helpers';
import { FETCH_MOCK, MESSAGE } from './constants.ts';
import { dehydrateFetchMock } from './helpers.ts';
import { type FetchMockMessageRequest } from './types.ts';

export const registerFetchMockWorker = (): void => {
  const onMessage = ({ data }: MessageEvent<FetchMockMessageRequest>): void => {
    if (!isPlainObject(data)) {
      return;
    }

    const { messageID, method, options = {}, type } = data;

    if (type !== FETCH_MOCK) {
      return;
    }

    const result = fetchMock[method]();
    // Need to implement type guard
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const returnValue = options.returnValue ? dehydrateFetchMock(result as PlainData) : undefined;
    self.postMessage({ messageID, result: returnValue, type });
  };

  self.addEventListener(MESSAGE, onMessage);
};
