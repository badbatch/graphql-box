import { type PartialRequestResult, type SubscriberResolver } from '@graphql-box/core';
import { getRequestContext, getRequestData, parsedRequests, responses } from '@graphql-box/test-utils';
import { expect } from '@jest/globals';
import { OperationTypeNode } from 'graphql';
import { forAwaitEach, isAsyncIterable } from 'iterall';
import { type Client, Server } from 'mock-socket';
import { WebsocketManager } from './index.ts';

const onOpen = (websocket: WebSocket): Promise<void> => {
  return new Promise(resolve => {
    websocket.addEventListener('open', () => {
      resolve();
    });
  });
};

describe('@graphql-box/websocket-manager >>', () => {
  const subscriptionResolver: SubscriberResolver = result => Promise.resolve(result as PartialRequestResult);
  const url = 'ws://localhost:8080';
  let server: Server;
  let serverSocket: Client;
  let websocketManager: WebsocketManager;

  beforeEach(() => {
    server = new Server(url);

    server.on('connection', socket => {
      serverSocket = socket;
    });
  });

  afterEach(() => {
    server.stop();
  });

  describe('subscribe >> return value >>', () => {
    let response: AsyncIterator<PartialRequestResult | undefined>;

    beforeEach(async () => {
      const websocket = new WebSocket(url);
      await onOpen(websocket);

      websocketManager = new WebsocketManager({
        websocket,
      });

      response = await websocketManager.subscribe(
        getRequestData(parsedRequests.nestedInterfaceSubscription),
        {},
        getRequestContext({ data: { operation: OperationTypeNode.SUBSCRIPTION } }),
        subscriptionResolver,
      );
    });

    it('async iterator', () => {
      expect(isAsyncIterable(response)).toBeTruthy();
    });
  });

  describe('async iterator >> message received >>', () => {
    let response: PartialRequestResult;

    beforeEach(async () => {
      const websocket = new WebSocket(url);
      await onOpen(websocket);

      websocketManager = new WebsocketManager({
        websocket,
      });

      const requestData = getRequestData(parsedRequests.nestedInterfaceSubscription);

      const asyncIterator = await websocketManager.subscribe(
        requestData,
        {},
        getRequestContext({ data: { operation: OperationTypeNode.SUBSCRIPTION } }),
        subscriptionResolver,
      );

      const promise = new Promise<void>(resolve => {
        if (isAsyncIterable(asyncIterator)) {
          void forAwaitEach(asyncIterator, (value: PartialRequestResult) => {
            response = value;
            resolve();
          });
        }
      });

      serverSocket.send(
        JSON.stringify({
          result: responses.nestedInterfaceSubscription,
          subscriptionID: requestData.hash,
        }),
      );

      await promise;
    });

    it('correct data', () => {
      expect(response).toEqual(expect.objectContaining({ ...responses.nestedInterfaceSubscription }));
    });
  });
});
