import {
  type PartialRawResponseData,
  type PartialRequestResult,
  type PlainObject,
  type RawResponseDataWithMaybeCacheMetadata,
  type RequestManagerDef,
  type RequestResolver,
} from '@graphql-box/core';
import { getRequestContext, getRequestData, parsedRequests, responses } from '@graphql-box/test-utils';
import { expect, jest } from '@jest/globals';
import { type Jsonifiable, ResponseType, mockFetch, polyfillFetch } from 'fetch-mocked';
import { forAwaitEach } from 'iterall';
import { createResponseChunks } from './__testUtils__/createResponseChunks.ts';
import { FetchManager } from './index.ts';

polyfillFetch();
const mockedFetch = mockFetch(jest.fn);
const URL = 'https://api.github.com/graphql';

describe('@graphql-box/fetch-manager >>', () => {
  let fetchManager: RequestManagerDef;

  describe('no batching >>', () => {
    describe('when batch is false >>', () => {
      let response: PartialRawResponseData;

      beforeAll(async () => {
        jest.useFakeTimers();

        fetchManager = new FetchManager({
          apiUrl: URL,
        });

        const body = { data: responses.singleTypeQuery.data } as Jsonifiable;
        const headers = { 'cache-control': 'public, max-age=5' };
        mockedFetch.mockPostOnce('*', { body, headers });

        response = (await fetchManager.execute(
          getRequestData(parsedRequests.singleTypeQuery),
          {},
          getRequestContext(),
          (() => Promise.resolve(null)) as unknown as RequestResolver,
        )) as PartialRawResponseData;
      });

      afterAll(() => {
        jest.useRealTimers();
        mockedFetch.mockClear();
      });

      it('correct request', () => {
        expect(mockedFetch.mock.lastCall).toMatchSnapshot();
      });

      it('correct response data', () => {
        expect(response).toMatchSnapshot();
      });
    });

    describe('when context.hasDeferOrStream is true >>', () => {
      let response: PartialRawResponseData;

      beforeAll(async () => {
        jest.useFakeTimers();

        fetchManager = new FetchManager({
          apiUrl: URL,
          batchRequests: true,
        });

        const body = { data: responses.singleTypeQuery.data } as Jsonifiable;
        const headers = { 'cache-control': 'public, max-age=5' };
        mockedFetch.mockPostOnce('*', { body, headers });

        response = (await fetchManager.execute(
          getRequestData(parsedRequests.singleTypeQuery),
          {},
          getRequestContext({ hasDeferOrStream: true }),
          (() => Promise.resolve(null)) as unknown as RequestResolver,
        )) as PartialRawResponseData;
      });

      afterAll(() => {
        jest.useRealTimers();
        mockedFetch.mockClear();
      });

      it('correct request', () => {
        expect(mockedFetch.mock.lastCall).toMatchSnapshot();
      });

      it('correct response data', () => {
        expect(response).toMatchSnapshot();
      });
    });
  });

  describe('batching >>', () => {
    describe('single request >>', () => {
      let response: PartialRawResponseData;

      beforeAll(async () => {
        jest.useFakeTimers();

        fetchManager = new FetchManager({
          apiUrl: URL,
          batchRequests: true,
          fetchTimeout: 10_000,
        });

        const requestData = getRequestData(parsedRequests.singleTypeQuery);

        const body = {
          responses: {
            [requestData.hash]: { data: responses.singleTypeQuery.data },
          },
        } as Jsonifiable;

        const headers = { 'cache-control': 'public, max-age=5' };
        mockedFetch.mockPostOnce('*', { body, headers });

        const promise = fetchManager.execute(requestData, {}, getRequestContext(), (() =>
          Promise.resolve(null)) as unknown as RequestResolver) as Promise<PartialRawResponseData>;

        jest.runOnlyPendingTimers();
        response = await promise;
      });

      afterAll(() => {
        jest.useRealTimers();
        mockedFetch.mockClear();
      });

      it('correct request', () => {
        expect(mockedFetch.mock.lastCall).toMatchSnapshot();
      });

      it('correct response data', () => {
        expect(response).toMatchSnapshot();
      });
    });

    describe('multiple requests >>', () => {
      let response: PartialRawResponseData[];

      beforeAll(async () => {
        jest.useFakeTimers();

        fetchManager = new FetchManager({
          apiUrl: URL,
          batchRequests: true,
          fetchTimeout: 10_000,
        });

        const initialRequestData = getRequestData(parsedRequests.singleTypeQuerySet.initial);
        const updatedRequestData = getRequestData(parsedRequests.singleTypeQuerySet.updated);

        const body = {
          responses: {
            [initialRequestData.hash]: { data: responses.singleTypeQuerySet.initial.data },
            [updatedRequestData.hash]: {
              data: (responses.singleTypeQuerySet.updated as RawResponseDataWithMaybeCacheMetadata).data,
            },
          },
        } as Jsonifiable;

        const headers = { 'cache-control': 'public, max-age=5' };
        mockedFetch.mockPostOnce('*', { body, headers });

        const promises = [
          fetchManager.execute(initialRequestData, {}, getRequestContext(), (() =>
            Promise.resolve(null)) as unknown as RequestResolver) as Promise<PartialRawResponseData>,

          fetchManager.execute(updatedRequestData, {}, getRequestContext(), (() =>
            Promise.resolve(null)) as unknown as RequestResolver) as Promise<PartialRawResponseData>,
        ];

        jest.runOnlyPendingTimers();
        response = await Promise.all(promises);
      });

      afterAll(() => {
        jest.useRealTimers();
        mockedFetch.mockClear();
      });

      it('correct request', () => {
        expect(mockedFetch.mock.lastCall).toMatchSnapshot();
      });

      it('correct first response data', () => {
        expect(response[0]).toMatchSnapshot();
      });

      it('correct second response data', () => {
        expect(response[1]).toMatchSnapshot();
      });
    });
  });

  describe('when content type multipart is returned >>', () => {
    const results: (PartialRequestResult | undefined)[] = [];

    beforeAll(async () => {
      fetchManager = new FetchManager({
        apiUrl: URL,
      });

      const body = createResponseChunks(responses.deferQuerySet.updated as unknown as PlainObject[]);
      const headers = { 'content-type': 'multipart/mixed; boundary="-"' };
      mockedFetch.mockPostOnce('*', { body, headers }, { responseType: ResponseType.TEXT });

      const executeResult = (await fetchManager.execute(
        getRequestData(parsedRequests.deferQuery),
        {},
        getRequestContext({ hasDeferOrStream: true }),
        (data => Promise.resolve(data)) as RequestResolver,
      )) as AsyncIterableIterator<PartialRequestResult | undefined>;

      const promise = new Promise<void>(resolve => {
        void forAwaitEach(executeResult, result => {
          results.push(result);

          if (!result?.hasNext) {
            resolve();
          }
        });
      });

      await promise;
    });

    afterAll(() => {
      mockedFetch.mockClear();
    });

    it('correct request', () => {
      expect(mockedFetch.mock.calls[0]).toMatchSnapshot();
    });

    it('correct response data', () => {
      expect(results).toMatchSnapshot();
    });
  });
});
