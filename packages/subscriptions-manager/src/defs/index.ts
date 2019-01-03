import { coreDefs } from "@handl/core";

export type SubscriberResolver = (rawResponseData: coreDefs.RawResponseData) => Promise<coreDefs.MaybeRequestResult>;

export interface SubscriptionsManager {
  subscribe(
    requestData: coreDefs.RequestDataWithMaybeAST,
    options: coreDefs.RequestOptions,
    subscriberResolver: SubscriberResolver,
  ): Promise<AsyncIterable<any> | coreDefs.RawResponseData>;
}

export type SubscriptionsManagerInit = () => SubscriptionsManager;
