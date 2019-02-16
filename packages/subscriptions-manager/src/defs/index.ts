import {
  MaybeRawResponseData,
  MaybeRequestResult,
  RawResponseDataWithMaybeCacheMetadata,
  RequestDataWithMaybeAST,
  RequestOptions,
} from "@handl/core";

export type SubscriberResolver = (
  rawResponseData: RawResponseDataWithMaybeCacheMetadata,
) => Promise<MaybeRequestResult>;

export interface SubscriptionsManagerDef {
  subscribe(
    requestData: RequestDataWithMaybeAST,
    options: RequestOptions,
    subscriberResolver: SubscriberResolver,
  ): Promise<AsyncIterable<any> | MaybeRawResponseData>;
}

export type SubscriptionsManagerInit = () => SubscriptionsManagerDef;
