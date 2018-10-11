import { coreDefs } from "@handl/core";

export type SubscriberResolver = (responseData: coreDefs.ResponseData) => Promise<coreDefs.RequestResult>;

export interface SubscriptionsManager {
  subscribe(
    requestData: coreDefs.RequestData,
    options: coreDefs.RequestOptions,
    subscriberResolver: SubscriberResolver,
  ): Promise<AsyncIterator<any> | coreDefs.ResponseData>;
}

export type SubscriptionsManagerInit = () => SubscriptionsManager;
