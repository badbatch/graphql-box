import { coreDefs } from "@handl/core";

export type SubscriberResolver = (
  rawResponseData: coreDefs.RawResponseDataWithMaybeCacheMetadata,
) => Promise<coreDefs.MaybeRequestResult>;

export interface SubscriptionsManager {
  subscribe(
    requestData: coreDefs.RequestDataWithMaybeAST,
    options: coreDefs.RequestOptions,
    subscriberResolver: SubscriberResolver,
  ): Promise<AsyncIterable<any> | coreDefs.MaybeRawResponseData>;
}

export type SubscriptionsManagerInit = () => SubscriptionsManager;
