import {
  MaybeRequestResult,
  MaybeRequestResultWithDehydratedCacheMetadata,
  RequestOptions,
} from "@handl/core";
import { dehydrateCacheMetadata } from "@handl/helpers";
import { forAwaitEach, isAsyncIterable } from "iterall";
import { isPlainObject } from "lodash";
import { MESSAGE, REQUEST, SUBSCRIBE } from "../consts";
import {
  MessageContext,
  MessageRequestPayload,
  MethodNames,
  RegisterWorkerOptions,
} from "../defs";

export default async function registerWorker({ initClient }: RegisterWorkerOptions): Promise<void> {
  const client = await initClient();
  const { addEventListener, postMessage } = self as unknown as DedicatedWorkerGlobalScope;

  async function handleRequest(
    request: string,
    method: MethodNames,
    options: RequestOptions,
    context: MessageContext,
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
    context: MessageContext,
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

  function onMessage({ data }: MessageEvent): void {
    if (!isPlainObject(data)) return;

    const { context, method, options, request } = data as MessageRequestPayload;

    if (method === REQUEST) {
      handleRequest(request, method, options, context);
    } else if (method === SUBSCRIBE) {
      handleSubscription(request, method, options, context);
    }
  }

  addEventListener(MESSAGE, onMessage);
}
