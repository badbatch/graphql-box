import { coreDefs } from "@handl/core";
import { DocumentNode } from "graphql";

export type SubscriberResolver = (result: coreDefs.PlainObjectMap) => Promise<coreDefs.ResolveRequestResult>;

export interface SubscriptionsManager {
  subscribe(
    request: string,
    ast: DocumentNode,
    options: coreDefs.RequestOptions,
    subscriberResolver: SubscriberResolver,
  ): Promise<AsyncIterator<any>>;
}

export type SubscriptionsManagerInit = () => SubscriptionsManager;
