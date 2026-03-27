import {
  type OperationContext,
  type OperationData,
  type RequestManagerDef,
  type ResponseData,
} from '@graphql-box/core';
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

// @ts-expect-error Okay for test file
globalThis.AbortController = class {
  signal = {
    aborted: false,
    addEventListener: jest.fn(),
    onabort: jest.fn(),
    removeEventListener: jest.fn(),
  };

  abort() {
    this.signal.aborted = true;
    this.signal.onabort();
  }
};

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
            "https://api.github.com/graphql?operationId=123456789",
            {
              "body": "{"batched":false,"context":{"data":{"operationId":"123456789","operationName":"","operationType":"query","rawOperationHash":""}},"operation":"\\n  {\\n    organization(login: \\"facebook\\") {\\n      email\\n      login\\n      name\\n    }\\n  }\\n"}",
              "headers": Headers {},
              "method": "POST",
              "signal": {
                "aborted": false,
                "addEventListener": [MockFunction],
                "onabort": [MockFunction],
                "removeEventListener": [MockFunction],
              },
            },
          ]
        `);
      });

      it('correct response data', () => {
        expect(response).toMatchInlineSnapshot(`
          {
            "data": {
              "organization": {
                "__typename": "Organization",
                "email": "opensource@fb.com",
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
      let operationData: OperationData;
      let context: OperationContext;

      beforeEach(() => {
        jest.useFakeTimers();

        fetchManager = new FetchManager({
          apiUrl: URL,
          batchRequests: true,
          fetchTimeout: 10_000,
        });

        operationData = getOperationData(parsedOperations.query);
        context = getOperationContext();

        const body = {
          responses: {
            [context.data.operationId]: { data: responses.facebookQuery.data, ok: true, status: 200 },
          },
        } as Jsonifiable;

        mockedFetch.mockPostOnce('*', { body });
      });

      afterEach(() => {
        jest.useRealTimers();
        mockedFetch.mockClear();
      });

      it('correct request', async () => {
        const promise = fetchManager.execute(operationData, {}, context);
        jest.runOnlyPendingTimers();
        response = await promise;

        expect(mockedFetch.mock.lastCall).toMatchInlineSnapshot(`
          [
            "https://api.github.com/graphql?operationId=123456789",
            {
              "body": "{"batched":true,"operations":{"123456789":{"context":{"data":{"operationId":"123456789","operationName":"","operationType":"query","rawOperationHash":""}},"operation":"\\n  {\\n    organization(login: \\"facebook\\") {\\n      email\\n      login\\n      name\\n    }\\n  }\\n"}}}",
              "headers": Headers {},
              "method": "POST",
              "signal": {
                "aborted": false,
                "addEventListener": [MockFunction],
                "onabort": [MockFunction],
                "removeEventListener": [MockFunction],
              },
            },
          ]
        `);
      });

      it('correct response data', async () => {
        const promise = fetchManager.execute(operationData, {}, context);
        jest.runOnlyPendingTimers();
        response = await promise;

        expect(response).toMatchInlineSnapshot(`
          {
            "data": {
              "organization": {
                "__typename": "Organization",
                "email": "opensource@fb.com",
                "id": "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
                "login": "facebook",
                "name": "Facebook",
              },
            },
            "ok": true,
            "status": 200,
          }
        `);
      });
    });

    describe('multiple requests', () => {
      let response: ResponseData[];
      let facebookOperationData: OperationData;
      let facebookContext: OperationContext;
      let googleOperationData: OperationData;
      let googleContext: OperationContext;

      beforeEach(() => {
        jest.useFakeTimers();

        fetchManager = new FetchManager({
          apiUrl: URL,
          batchRequests: true,
          fetchTimeout: 10_000,
        });

        facebookOperationData = getOperationData(parsedOperations.query);
        facebookContext = getOperationContext();
        googleOperationData = getOperationData(parsedOperations.query.replaceAll('facebook', 'google'));
        googleContext = getOperationContext({ data: { operationId: '0123456878' } });

        const body = {
          responses: {
            [facebookContext.data.operationId]: { data: responses.facebookQuery.data, ok: true, status: 200 },
            [googleContext.data.operationId]: { data: responses.googleQuery.data, ok: true, status: 200 },
          },
        } as Jsonifiable;

        mockedFetch.mockPostOnce('*', { body });
      });

      afterEach(() => {
        jest.useRealTimers();
        mockedFetch.mockClear();
      });

      it('correct request', async () => {
        const promises = [
          fetchManager.execute(facebookOperationData, {}, facebookContext),
          fetchManager.execute(googleOperationData, {}, googleContext),
        ];

        jest.runOnlyPendingTimers();
        response = await Promise.all(promises);

        expect(mockedFetch.mock.lastCall).toMatchInlineSnapshot(`
          [
            "https://api.github.com/graphql?operationId=123456789-0123456878",
            {
              "body": "{"batched":true,"operations":{"123456789":{"context":{"data":{"operationId":"123456789","operationName":"","operationType":"query","rawOperationHash":""}},"operation":"\\n  {\\n    organization(login: \\"facebook\\") {\\n      email\\n      login\\n      name\\n    }\\n  }\\n"},"0123456878":{"context":{"data":{"operationId":"0123456878","operationName":"","operationType":"query","rawOperationHash":""}},"operation":"\\n  {\\n    organization(login: \\"google\\") {\\n      email\\n      login\\n      name\\n    }\\n  }\\n"}}}",
              "headers": Headers {},
              "method": "POST",
              "signal": {
                "aborted": false,
                "addEventListener": [MockFunction],
                "onabort": [MockFunction],
                "removeEventListener": [MockFunction],
              },
            },
          ]
        `);
      });

      it('correct first response data', async () => {
        const promises = [
          fetchManager.execute(facebookOperationData, {}, facebookContext),
          fetchManager.execute(googleOperationData, {}, googleContext),
        ];

        jest.runOnlyPendingTimers();
        response = await Promise.all(promises);

        expect(response[0]).toMatchInlineSnapshot(`
          {
            "data": {
              "organization": {
                "__typename": "Organization",
                "email": "opensource@fb.com",
                "id": "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
                "login": "facebook",
                "name": "Facebook",
              },
            },
            "ok": true,
            "status": 200,
          }
        `);
      });

      it('correct second response data', async () => {
        const promises = [
          fetchManager.execute(facebookOperationData, {}, facebookContext),
          fetchManager.execute(googleOperationData, {}, googleContext),
        ];

        jest.runOnlyPendingTimers();
        response = await Promise.all(promises);

        expect(response[1]).toMatchInlineSnapshot(`
          {
            "data": {
              "organization": {
                "__typename": "Organization",
                "email": "opensource@google.com",
                "id": "MDEyOk9yZ2FuaXphdGlvbjEzNDIwMDQ=",
                "login": "google",
                "name": "Google",
              },
            },
            "ok": true,
            "status": 200,
          }
        `);
      });
    });
  });
});
