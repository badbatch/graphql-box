import { MaybeRawResponseData } from "@handl/core";
import {
  getRequestData,
  githubParsedQueries,
  githubQueryResponses,
} from "@handl/test-utils";
import fetchMock from "fetch-mock";
import { RequestManager } from ".";

const URL = "https://api.github.com/graphql";

describe("@handl/request-manager >>", () => {
  let requestManager: RequestManager;

  describe("no batching >>", () => {
    let response: MaybeRawResponseData;

    beforeAll(async () => {
      requestManager = await RequestManager.init({
        url: URL,
      });

      const body = { data: githubQueryResponses.singleType.data };
      const headers = { "cache-control": "public, max-age=5" };
      fetchMock.post("*", { body, headers });
      response = await requestManager.fetch(getRequestData(githubParsedQueries.singleType));
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

        requestManager = await RequestManager.init({
          batch: true,
          fetchTimeout: 10000,
          url: URL,
        });

        const requestData = getRequestData(githubParsedQueries.singleType);

        const body = {
          batch: {
            [requestData.hash]: { data: githubQueryResponses.singleType.data },
          },
        };

        const headers = { "cache-control": "public, max-age=5" };
        fetchMock.post("*", { body, headers });
        const promise = requestManager.fetch(requestData);
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

        requestManager = await RequestManager.init({
          batch: true,
          fetchTimeout: 10000,
          url: URL,
        });

        const initialRequestData = getRequestData(githubParsedQueries.singleTypeWithFilter.initial);
        const updatedRequestData = getRequestData(githubParsedQueries.singleTypeWithFilter.updated);

        const body = {
          batch: {
            [initialRequestData.hash]: { data: githubQueryResponses.singleTypePartialAndFilter.initial.data },
            [updatedRequestData.hash]: { data: githubQueryResponses.singleTypePartialAndFilter.updated.data },
          },
        };

        const headers = { "cache-control": "public, max-age=5" };
        fetchMock.post("*", { body, headers });

        const promises = [
          requestManager.fetch(initialRequestData),
          requestManager.fetch(updatedRequestData),
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
