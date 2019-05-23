import { MaybeRawResponseData, RequestManagerDef } from "@graphql-box/core";
import {
  getRequestContext,
  getRequestData,
  parsedRequests,
  responses,
} from "@graphql-box/test-utils";
import fetchMock from "fetch-mock";
import { FetchManager } from ".";

const URL = "https://api.github.com/graphql";

describe("@graphql-box/fetch-manager >>", () => {
  let fetchManager: RequestManagerDef;

  describe("no batching >>", () => {
    let response: MaybeRawResponseData;

    beforeAll(async () => {
      fetchManager = await FetchManager.init({
        url: URL,
      });

      const body = { data: responses.singleTypeQuery.data };
      const headers = { "cache-control": "public, max-age=5" };
      fetchMock.post("*", { body, headers });

      response = await fetchManager.execute(
        getRequestData(parsedRequests.singleTypeQuery),
        {},
        getRequestContext(),
      );
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

  describe("batching >>", () => {
    describe("single request >>", () => {
      let response: MaybeRawResponseData;

      beforeAll(async () => {
        jest.useFakeTimers();

        fetchManager = await FetchManager.init({
          batch: true,
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
        const promise = fetchManager.execute(requestData, {}, getRequestContext());
        jest.runOnlyPendingTimers();
        response = await promise;
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

    describe("multiple requests >>", () => {
      let response: MaybeRawResponseData[];

      beforeAll(async () => {
        jest.useFakeTimers();

        fetchManager = await FetchManager.init({
          batch: true,
          fetchTimeout: 10000,
          url: URL,
        });

        const initialRequestData = getRequestData(parsedRequests.singleTypeQuerySet.initial);
        const updatedRequestData = getRequestData(parsedRequests.singleTypeQuerySet.updated);

        const body = {
          batch: {
            [initialRequestData.hash]: { data: responses.singleTypeQuerySet.initial.data },
            [updatedRequestData.hash]: { data: responses.singleTypeQuerySet.updated.data },
          },
        };

        const headers = { "cache-control": "public, max-age=5" };
        fetchMock.post("*", { body, headers });

        const promises = [
          fetchManager.execute(initialRequestData, {}, getRequestContext()),
          fetchManager.execute(updatedRequestData, {}, getRequestContext()),
        ];

        jest.runOnlyPendingTimers();
        response = await Promise.all(promises);
      });

      afterAll(() => {
        fetchMock.restore();
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
});
