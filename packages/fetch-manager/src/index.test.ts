/**
 * @jest-environment jsdom
 */

import {
  MaybeRawResponseData,
  MaybeRequestResult,
  PlainObjectMap,
  RawResponseDataWithMaybeCacheMetadata,
  RequestManagerDef,
  RequestResolver,
} from "@graphql-box/core";
import { getRequestContext, getRequestData, parsedRequests, responses } from "@graphql-box/test-utils";
import fetchMock from "fetch-mock";
import { forAwaitEach } from "iterall";
import { Response } from "undici";
import { FetchManager } from ".";
import createResponseChunks from "./__testUtils__/createResponseChunks";

const URL = "https://api.github.com/graphql";

describe("@graphql-box/fetch-manager >>", () => {
  let fetchManager: RequestManagerDef;

  describe("no batching >>", () => {
    describe("when batch is false >>", () => {
      let response: MaybeRawResponseData;

      beforeAll(async () => {
        fetchManager = new FetchManager({
          url: URL,
        });

        const body = { data: responses.singleTypeQuery.data };
        const headers = { "cache-control": "public, max-age=5" };
        fetchMock.post("*", { body, headers });

        response = (await fetchManager.execute(
          getRequestData(parsedRequests.singleTypeQuery),
          {},
          getRequestContext(),
          ((async () => null) as unknown) as RequestResolver,
        )) as MaybeRawResponseData;
      });

      afterAll(() => {
        fetchMock.restore();
      });

      it("correct request", () => {
        expect(fetchMock.lastCall()).toMatchSnapshot();
      });

      it("correct response data", () => {
        expect(response).toMatchSnapshot();
      });
    });

    describe("when context.hasDeferOrStream is true >>", () => {
      let response: MaybeRawResponseData;

      beforeAll(async () => {
        fetchManager = new FetchManager({
          batchRequests: true,
          url: URL,
        });

        const body = { data: responses.singleTypeQuery.data };
        const headers = { "cache-control": "public, max-age=5" };
        fetchMock.post("*", { body, headers });

        response = (await fetchManager.execute(
          getRequestData(parsedRequests.singleTypeQuery),
          {},
          getRequestContext({ hasDeferOrStream: true }),
          ((async () => null) as unknown) as RequestResolver,
        )) as MaybeRawResponseData;
      });

      afterAll(() => {
        fetchMock.restore();
      });

      it("correct request", () => {
        expect(fetchMock.lastCall()).toMatchSnapshot();
      });

      it("correct response data", () => {
        expect(response).toMatchSnapshot();
      });
    });
  });

  describe("batching >>", () => {
    describe("single request >>", () => {
      let response: MaybeRawResponseData;

      beforeAll(async () => {
        jest.useFakeTimers();

        fetchManager = new FetchManager({
          batchRequests: true,
          fetchTimeout: 10000,
          url: URL,
        });

        const requestData = getRequestData(parsedRequests.singleTypeQuery);

        const body = {
          batch: {
            [requestData.hash]: { data: responses.singleTypeQuery.data },
          },
        };

        const headers = { "cache-control": "public, max-age=5" };
        fetchMock.post("*", { body, headers });

        const promise = fetchManager.execute(
          requestData,
          {},
          getRequestContext(),
          ((async () => null) as unknown) as RequestResolver,
        ) as Promise<MaybeRawResponseData>;

        jest.runOnlyPendingTimers();
        response = await promise;
      });

      afterAll(() => {
        fetchMock.restore();
        jest.useRealTimers();
      });

      it("correct request", () => {
        expect(fetchMock.lastCall()).toMatchSnapshot();
      });

      it("correct response data", () => {
        expect(response).toMatchSnapshot();
      });
    });

    describe("multiple requests >>", () => {
      let response: MaybeRawResponseData[];

      beforeAll(async () => {
        jest.useFakeTimers();

        fetchManager = new FetchManager({
          batchRequests: true,
          fetchTimeout: 10000,
          url: URL,
        });

        const initialRequestData = getRequestData(parsedRequests.singleTypeQuerySet.initial);
        const updatedRequestData = getRequestData(parsedRequests.singleTypeQuerySet.updated);

        const body = {
          batch: {
            [initialRequestData.hash]: { data: responses.singleTypeQuerySet.initial.data },
            [updatedRequestData.hash]: {
              data: (responses.singleTypeQuerySet.updated as RawResponseDataWithMaybeCacheMetadata).data,
            },
          },
        };

        const headers = { "cache-control": "public, max-age=5" };
        fetchMock.post("*", { body, headers });

        const promises = [
          fetchManager.execute(
            initialRequestData,
            {},
            getRequestContext(),
            ((async () => null) as unknown) as RequestResolver,
          ) as Promise<MaybeRawResponseData>,

          fetchManager.execute(
            updatedRequestData,
            {},
            getRequestContext(),
            ((async () => null) as unknown) as RequestResolver,
          ) as Promise<MaybeRawResponseData>,
        ];

        jest.runOnlyPendingTimers();
        response = await Promise.all(promises);
      });

      afterAll(() => {
        fetchMock.restore();
        jest.useRealTimers();
      });

      it("correct request", () => {
        expect(fetchMock.lastCall()).toMatchSnapshot();
      });

      it("correct response data", () => {
        expect(response[0]).toMatchSnapshot();
        expect(response[1]).toMatchSnapshot();
      });
    });
  });

  describe("when content type multipart is returned >>", () => {
    const results: (MaybeRequestResult | undefined)[] = [];
    const actualFetch = global.fetch;
    let mockFetch: jest.Mock<any, any>;

    beforeAll(async () => {
      fetchManager = new FetchManager({
        url: URL,
      });

      const headers = { "Content-Type": 'multipart/mixed; boundary="-"' };

      const mockResponse = new Response(createResponseChunks(responses.deferQuerySet.updated as PlainObjectMap[]), {
        headers,
        status: 200,
      });

      mockFetch = jest.fn().mockResolvedValue(mockResponse);
      global.fetch = mockFetch;

      const executeResult = (await fetchManager.execute(
        getRequestData(parsedRequests.deferQuery),
        {},
        getRequestContext({ hasDeferOrStream: true }),
        (async data => data) as RequestResolver,
      )) as AsyncIterableIterator<MaybeRequestResult | undefined>;

      await new Promise((resolve: (value: void) => void) => {
        forAwaitEach(executeResult, async result => {
          results.push(result);

          if (!result?.hasNext) {
            resolve();
          }
        });
      });
    });

    afterAll(() => {
      global.fetch = actualFetch;
    });

    it("correct request", () => {
      expect(mockFetch.mock.calls[0]).toMatchSnapshot();
    });

    it("correct response data", () => {
      expect(results).toMatchSnapshot();
    });
  });
});
