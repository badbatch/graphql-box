import {
  MaybeRequestResult,
  RawResponseDataWithMaybeCacheMetadata,
  RequestDataWithMaybeAST,
  RequestOptions,
} from "@handl/core";

export interface UserOptions {
  /**
   * The WebSocket instance for managing a
   * WebSocket connection.
   */
  websocket: WebSocket;
}

export type InitOptions = UserOptions;

export type ConstructorOptions = UserOptions;

export type SubscriberResolver = (
  rawResponseData: RawResponseDataWithMaybeCacheMetadata,
) => Promise<MaybeRequestResult>;

export interface SubscriptionsManagerDef {
  subscribe(
    requestData: RequestDataWithMaybeAST,
    options: RequestOptions,
    subscriberResolver: SubscriberResolver,
  ): Promise<AsyncIterator<MaybeRequestResult | undefined>>;
}

export type SubscriptionsManagerInit = () => Promise<SubscriptionsManagerDef>;
