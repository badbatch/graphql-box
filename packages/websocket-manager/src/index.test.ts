import { MaybeRequestResult, SUBSCRIPTION } from "@graphql-box/core";
import {
  getRequestContext,
  getRequestData,
  parsedRequests,
  responses,
} from "@graphql-box/test-utils";
import { forAwaitEach, isAsyncIterable } from "iterall";
import { Server } from "mock-socket";
import { WebsocketManager } from ".";

function onOpen(websocket: WebSocket): Promise<void> {
  return new Promise((resolve) => {
    websocket.onopen = () => {
      resolve();
    };
  });
}

describe("@graphql-box/websocket-manager >>", () => {
  const subscriptionResolver = async (result: any) => result;
  const url = "ws://localhost:8080";
  let server: Server;
  let serverSocket: WebSocket;
  let websocketManager: WebsocketManager;

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

      websocketManager = await WebsocketManager.init({
        websocket,
      });

      response = await websocketManager.subscribe(
        getRequestData(parsedRequests.nestedInterfaceSubscription),
        {},
        getRequestContext({ operation: SUBSCRIPTION }),
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

      websocketManager = await WebsocketManager.init({
        websocket,
      });

      const requestData = getRequestData(parsedRequests.nestedInterfaceSubscription);

      const asyncIterator = await websocketManager.subscribe(
        requestData,
        {},
        getRequestContext({ operation: SUBSCRIPTION }),
        subscriptionResolver,
      );

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
