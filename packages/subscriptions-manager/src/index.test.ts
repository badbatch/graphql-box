import { MaybeRequestResult } from "@handl/core";
import {
  getRequestData,
  parsedRequests,
  responses,
} from "@handl/test-utils";
import { forAwaitEach, isAsyncIterable } from "iterall";
import { Server } from "mock-socket";
import { SubscriptionsManager } from ".";

function onOpen(websocket: WebSocket): Promise<void> {
  return new Promise((resolve) => {
    websocket.onopen = () => {
      resolve();
    };
  });
}

describe("@handl/subscriptions-manager >>", () => {
  const subscriptionResolver = async (result: any) => result;
  const url = "ws://localhost:8080";
  let server: Server;
  let serverSocket: WebSocket;
  let subscriptionsManager: SubscriptionsManager;

  beforeEach(() => {
    server = new Server(url);

    server.on("connection", (socket) => {
      serverSocket = socket;
    });
  });

  afterEach(() => {
    server.stop();
  });

  describe("subscribe >> return value >>", () => {
    let response: AsyncIterator<MaybeRequestResult | undefined>;

    beforeEach(async () => {
      const websocket = new WebSocket(url);
      await onOpen(websocket);

      subscriptionsManager = await SubscriptionsManager.init({
        websocket,
      });

      response = await subscriptionsManager.subscribe(
        getRequestData(parsedRequests.nestedInterfaceSubscription),
        {},
        subscriptionResolver,
      );
    });

    it("async iterator", () => {
      expect(isAsyncIterable(response)).toBeTruthy();
    });
  });

  describe("async iterator >> message received >>", () => {
    let response: MaybeRequestResult;

    beforeEach(async () => {
      const websocket = new WebSocket(url);
      await onOpen(websocket);

      subscriptionsManager = await SubscriptionsManager.init({
        websocket,
      });

      const requestData = getRequestData(parsedRequests.nestedInterfaceSubscription);
      const asyncIterator = await subscriptionsManager.subscribe(requestData, {}, subscriptionResolver);

      const promise = new Promise((resolve) => {
        if (isAsyncIterable(asyncIterator)) {
          forAwaitEach(asyncIterator, (value: MaybeRequestResult) => {
            response = value;
            resolve();
          });
        }
      });

      serverSocket.send(JSON.stringify({
        result: responses.nestedInterfaceSubscription,
        subscriptionID: requestData.hash,
      }));

      await promise;
    });

    it("correct data", () => {
      expect(response).toEqual(responses.nestedInterfaceSubscription);
    });
  });
});
