import { handleMessage as handleCachemapMessage } from "@cachemap/core-worker";
import Client from "@handl/client";
import {
  MaybeRequestResult,
  MaybeRequestResultWithDehydratedCacheMetadata,
  RequestOptions,
} from "@handl/core";
import { dehydrateCacheMetadata } from "@handl/helpers";
import { forAwaitEach, isAsyncIterable } from "iterall";
import { isPlainObject } from "lodash";
import { CACHEMAP, HANDL, MESSAGE, REQUEST, SUBSCRIBE } from "../consts";
import {
  MessageContext,
  MessageRequestPayload,
  MethodNames,
  RegisterWorkerOptions,
} from "../defs";

const { addEventListener, postMessage } = self as unknown as DedicatedWorkerGlobalScope;

async function handleRequest(
  request: string,
  method: MethodNames,
  options: RequestOptions,
  context: MessageContext,
  client: Client,
): Promise<void> {
  const { _cacheMetadata, ...otherProps } = await client.request(request, options, context);
  const result: MaybeRequestResultWithDehydratedCacheMetadata = { ...otherProps };
  if (_cacheMetadata) result._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
  postMessage({ context, method, result, type: HANDL });
}

async function handleSubscription(
  request: string,
  method: MethodNames,
  options: RequestOptions,
  context: MessageContext,
  client: Client,
): Promise<void> {
  const subscribeResult = await client.subscribe(request, options, context);

  if (isAsyncIterable(subscribeResult)) {
    forAwaitEach(subscribeResult, ({ _cacheMetadata, ...otherProps }: MaybeRequestResult) => {
      const result: MaybeRequestResultWithDehydratedCacheMetadata = { ...otherProps };
      if (_cacheMetadata) result._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
      postMessage({ context, method, result, type: HANDL });
    });
  }
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
    if (!isPlainObject(data)) return;

    const { type } = data as MessageRequestPayload;

    if (type === HANDL) {
      handleMessage(data, client);
    } else if (type === CACHEMAP && client.cache) {
      handleCachemapMessage(data, client.cache);
    }
  }

  addEventListener(MESSAGE, onMessage);
}
