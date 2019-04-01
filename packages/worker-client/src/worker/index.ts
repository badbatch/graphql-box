import Client from "@handl/client";
import {
  MaybeRequestContext,
  MaybeRequestResult,
  MaybeRequestResultWithDehydratedCacheMetadata,
  RequestOptions,
} from "@handl/core";
import { dehydrateCacheMetadata } from "@handl/helpers";
import { forAwaitEach, isAsyncIterable } from "iterall";
import { REQUEST, SUBSCRIBE } from "../consts";
import { MessageHandler, MessageRequestPayload, MethodNames } from "../defs";

export default function getMessageHandler(client: Client): MessageHandler {
  const { postMessage } = self as unknown as DedicatedWorkerGlobalScope;

  async function handleRequest(
    request: string,
    method: MethodNames,
    options: RequestOptions,
    context: MaybeRequestContext,
  ): Promise<void> {
    const { _cacheMetadata, ...otherProps } = await client.request(request, options, context);
    const result: MaybeRequestResultWithDehydratedCacheMetadata = { ...otherProps };
    if (_cacheMetadata) result._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
    postMessage({ context, method, result });
  }

  async function handleSubscription(
    request: string,
    method: MethodNames,
    options: RequestOptions,
    context: MaybeRequestContext,
  ): Promise<void> {
    const subscribeResult = await client.subscribe(request, options, context);

    if (isAsyncIterable(subscribeResult)) {
      forAwaitEach(subscribeResult, ({ _cacheMetadata, ...otherProps }: MaybeRequestResult) => {
        const result: MaybeRequestResultWithDehydratedCacheMetadata = { ...otherProps };
        if (_cacheMetadata) result._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
        postMessage({ context, method, result });
      });
    }
  }

  return async function messageHandler({ context, method, options, request }: MessageRequestPayload): Promise<void> {
    if (method === REQUEST) {
      handleRequest(request, method, options, context);
    } else if (method === SUBSCRIBE) {
      handleSubscription(request, method, options, context);
    }
  };
}
