import { handleMessage as handleCachemapMessage } from "@cachemap/core-worker";
import Client from "@graphql-box/client";
import { MaybeRequestResult, MaybeRequestResultWithDehydratedCacheMetadata, RequestOptions } from "@graphql-box/core";
import { dehydrateCacheMetadata, serializeErrors } from "@graphql-box/helpers";
import { forAwaitEach, isAsyncIterable } from "iterall";
import { isPlainObject } from "lodash";
import { CACHEMAP, GRAPHQL_BOX, MESSAGE, REQUEST, SUBSCRIBE } from "../consts";
import { MessageContext, MessageRequestPayload, MethodNames, RegisterWorkerOptions } from "../defs";

const { addEventListener, postMessage } = (self as unknown) as DedicatedWorkerGlobalScope;

async function handleRequest(
  request: string,
  method: MethodNames,
  options: RequestOptions,
  context: MessageContext,
  client: Client,
): Promise<void> {
  const requestResult = await client.request(request, options, context);

  if (!isAsyncIterable(requestResult)) {
    const { _cacheMetadata, ...otherProps } = requestResult as MaybeRequestResult;
    const result: MaybeRequestResultWithDehydratedCacheMetadata = { ...otherProps };

    if (_cacheMetadata) {
      result._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
    }

    postMessage({ context, method, result: serializeErrors(result), type: GRAPHQL_BOX });
    return;
  }

  forAwaitEach(requestResult, ({ _cacheMetadata, ...otherProps }: MaybeRequestResult) => {
    const result: MaybeRequestResultWithDehydratedCacheMetadata = { ...otherProps };

    if (_cacheMetadata) {
      result._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
    }

    postMessage({ context, method, result: serializeErrors(result), type: GRAPHQL_BOX });
  });
}

async function handleSubscription(
  request: string,
  method: MethodNames,
  options: RequestOptions,
  context: MessageContext,
  client: Client,
): Promise<void> {
  const subscribeResult = await client.subscribe(request, options, context);

  if (!isAsyncIterable(subscribeResult)) {
    postMessage({ context, method, result: serializeErrors(subscribeResult as MaybeRequestResult), type: GRAPHQL_BOX });
    return;
  }

  forAwaitEach(subscribeResult, ({ _cacheMetadata, ...otherProps }: MaybeRequestResult) => {
    const result: MaybeRequestResultWithDehydratedCacheMetadata = { ...otherProps };

    if (_cacheMetadata) {
      result._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
    }

    postMessage({ context, method, result: serializeErrors(result), type: GRAPHQL_BOX });
  });
}

export function handleMessage(data: MessageRequestPayload, client: Client): void {
  const { context, method, options, request } = data as MessageRequestPayload;

  if (method === REQUEST) {
    handleRequest(request, method, options, context, client);
  } else if (method === SUBSCRIBE) {
    handleSubscription(request, method, options, context, client);
  }
}

export default async function registerWorker({ client }: RegisterWorkerOptions): Promise<void> {
  function onMessage({ data }: MessageEvent): void {
    if (!isPlainObject(data)) {
      return;
    }

    const { type } = data as MessageRequestPayload;

    if (type === GRAPHQL_BOX) {
      handleMessage(data, client);
    } else if (type === CACHEMAP && client.cache) {
      handleCachemapMessage(data, client.cache);
    }
  }

  addEventListener(MESSAGE, onMessage);
}
