import { type RequestManagerDef, type ResponseData } from '@graphql-box/core';
import { getOperationContext, getOperationData, parsedOperations, responses } from '@graphql-box/test-utils';
import { expect, jest } from '@jest/globals';
import { type Jsonifiable, mockFetch, polyfillFetch } from 'fetch-mocked';
import { FetchManager } from './index.ts';

polyfillFetch();
const mockedFetch = mockFetch(jest.fn);
const URL = 'https://api.github.com/graphql';

Object.defineProperty(globalThis, 'location', {
  value: {
    href: 'https://browser-origin.local/browser-pathname',
    pathname: 'browser-pathname',
  },
  writable: true,
});

describe('@graphql-box/fetch-manager', () => {
  let fetchManager: RequestManagerDef;

  describe('no batching', () => {
    describe('when batch is false', () => {
      let response: ResponseData;

      beforeAll(async () => {
        jest.useFakeTimers();

        fetchManager = new FetchManager({
          apiUrl: URL,
        });

        const body = { data: responses.facebookQuery.data } as Jsonifiable;
        mockedFetch.mockPostOnce('*', { body });
        response = await fetchManager.execute(getOperationData(parsedOperations.query), {}, getOperationContext());
      });

      afterAll(() => {
        jest.useRealTimers();
        mockedFetch.mockClear();
      });

      it('correct request', () => {
        expect(mockedFetch.mock.lastCall).toMatchInlineSnapshot(`
          [
            "https://api.github.com/graphql?requestId=faf1d7adbe1edf185c33b52edd09df1b",
            {
              "body": "{"batched":false,"context":{"data":{"operationId":"123456789","operationName":"","operationType":"query","originalOperationHash":""}},"operation":"\\n  {\\n    organization(login: \\"facebook\\") {\\n      email\\n      login\\n      name\\n      id\\n    }\\n  }\\n"}",
              "headers": Headers {},
              "method": "POST",
            },
          ]
        `);
      });

      it('correct response data', () => {
        expect(response).toMatchInlineSnapshot(`
          {
            "data": {
              "organization": {
                "email": "",
                "id": "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
                "login": "facebook",
                "name": "Facebook",
              },
            },
          }
        `);
      });
    });
  });

  describe('batching', () => {
    describe('single request', () => {
      let response: ResponseData;

      beforeAll(async () => {
        jest.useFakeTimers();

        fetchManager = new FetchManager({
          apiUrl: URL,
          batchRequests: true,
          fetchTimeout: 10_000,
        });

        const operationData = getOperationData(parsedOperations.query);

        const body = {
          responses: {
            [operationData.hash]: { data: responses.facebookQuery.data },
          },
        } as Jsonifiable;

        mockedFetch.mockPostOnce('*', { body });
        const promise = fetchManager.execute(operationData, {}, getOperationContext());
        jest.runOnlyPendingTimers();
        response = await promise;
      });

      afterAll(() => {
        jest.useRealTimers();
        mockedFetch.mockClear();
      });

      it('correct request', () => {
        expect(mockedFetch.mock.lastCall).toMatchInlineSnapshot(`
          [
            "https://api.github.com/graphql?requestId=faf1d7adbe1edf185c33b52edd09df1b",
            {
              "body": "{"batched":true,"requests":{"faf1d7adbe1edf185c33b52edd09df1b":{"context":{"data":{"operationId":"123456789","operationName":"","operationType":"query","originalOperationHash":""}},"operation":"\\n  {\\n    organization(login: \\"facebook\\") {\\n      email\\n      login\\n      name\\n      id\\n    }\\n  }\\n"}}}",
              "headers": Headers {},
              "method": "POST",
            },
          ]
        `);
      });

      it('correct response data', () => {
        expect(response).toMatchInlineSnapshot(`
          {
            "data": {
              "organization": {
                "email": "",
                "id": "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
                "login": "facebook",
                "name": "Facebook",
              },
            },
          }
        `);
      });
    });

    describe('multiple requests', () => {
      let response: ResponseData[];

      beforeAll(async () => {
        jest.useFakeTimers();

        fetchManager = new FetchManager({
          apiUrl: URL,
          batchRequests: true,
          fetchTimeout: 10_000,
        });

        const facebookOperationData = getOperationData(parsedOperations.query);
        const googleOperationData = getOperationData(parsedOperations.query.replaceAll('facebook', 'google'));

        const body = {
          responses: {
            [facebookOperationData.hash]: { data: responses.facebookQuery.data },
            [googleOperationData.hash]: { data: responses.googleQuery.data },
          },
        } as Jsonifiable;

        mockedFetch.mockPostOnce('*', { body });

        const promises = [
          fetchManager.execute(facebookOperationData, {}, getOperationContext()),
          fetchManager.execute(googleOperationData, {}, getOperationContext()),
        ];

        jest.runOnlyPendingTimers();
        response = await Promise.all(promises);
      });

      afterAll(() => {
        jest.useRealTimers();
        mockedFetch.mockClear();
      });

      it('correct request', () => {
        expect(mockedFetch.mock.lastCall).toMatchInlineSnapshot(`
          [
            "https://api.github.com/graphql?requestId=faf1d7adbe1edf185c33b52edd09df1b-3288105b397b84de10bdff80ceaa5247",
            {
              "body": "{"batched":true,"requests":{"faf1d7adbe1edf185c33b52edd09df1b":{"context":{"data":{"operationId":"123456789","operationName":"","operationType":"query","originalOperationHash":""}},"operation":"\\n  {\\n    organization(login: \\"facebook\\") {\\n      email\\n      login\\n      name\\n      id\\n    }\\n  }\\n"},"3288105b397b84de10bdff80ceaa5247":{"context":{"data":{"operationId":"123456789","operationName":"","operationType":"query","originalOperationHash":""}},"operation":"\\n  {\\n    organization(login: \\"google\\") {\\n      email\\n      login\\n      name\\n      id\\n    }\\n  }\\n"}}}",
              "headers": Headers {},
              "method": "POST",
            },
          ]
        `);
      });

      it('correct first response data', () => {
        expect(response[0]).toMatchInlineSnapshot(`
          {
            "data": {
              "organization": {
                "email": "",
                "id": "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
                "login": "facebook",
                "name": "Facebook",
              },
            },
          }
        `);
      });

      it('correct second response data', () => {
        expect(response[1]).toMatchInlineSnapshot(`
          {
            "data": {
              "organization": {
                "email": "",
                "id": "MDEyOk9yZ2FuaXphdGlvbjEzNDIwMDQ=",
                "login": "google",
                "name": "Google",
              },
            },
          }
        `);
      });
    });
  });
});
