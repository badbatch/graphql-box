import { MaybeRequestResult } from "@handl/core";
import {
  getRequestData,
  githubParsedQueries,
  githubQueryResponses,
} from "@handl/test-utils";
import { forAwaitEach, isAsyncIterable } from "iterall";
import { Server } from "mock-socket";
import { SubscriptionsManager } from ".";

const URL = "ws://localhost:8080";

describe("@handl/subscriptions-manager >>", () => {
  let server: Server;
  let websocket: WebSocket;
  let subscriptionsManager: SubscriptionsManager;

  beforeAll(() => {
    server = new Server(URL);

    server.on("connection", (socket) => {
      websocket = socket;
    });
  });

  afterAll(() => {
    server.stop();
  });

  describe("subscribe >> return value >>", () => {
    let response: AsyncIterator<MaybeRequestResult | undefined>;

    beforeAll(async () => {
      subscriptionsManager = await SubscriptionsManager.init({
        websocket: new WebSocket(URL),
      });

      response = await subscriptionsManager.subscribe();
    });

    it("async iterator", () => {
      expect(isAsyncIterable(response)).toBeTruthy();
    });
  });
});
