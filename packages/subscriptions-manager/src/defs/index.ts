import { coreDefs } from "@handl/core";

export type SubscriberResolver = (rawResponseData: coreDefs.RawResponseData) => Promise<coreDefs.RequestResult>;

export interface SubscriptionsManager {
  subscribe(
    requestData: coreDefs.RequestData,
    options: coreDefs.RequestOptions,
    subscriberResolver: SubscriberResolver,
  ): Promise<AsyncIterable<any> | coreDefs.RawResponseData>;
}

export type SubscriptionsManagerInit = () => SubscriptionsManager;
