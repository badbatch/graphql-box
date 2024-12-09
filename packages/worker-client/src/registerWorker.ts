import {
  type PostMessage as CachemapMessageRequestPayload,
  handleMessage as handleCachemapMessage,
} from '@cachemap/core-worker';
import { type Client } from '@graphql-box/client';
import { type PartialDehydratedRequestResult, type PartialRequestResult, type RequestOptions } from '@graphql-box/core';
import { dehydrateCacheMetadata, serializeErrors } from '@graphql-box/helpers';
import { forAwaitEach, isAsyncIterable } from 'iterall';
import { GRAPHQL_BOX, MESSAGE, REQUEST } from './constants.ts';
import { isGraphqlBoxMessageRequestPayload } from './helpers/isGraphqlBoxMessageRequestPayload.ts';
import {
  type MessageContext,
  type MessageRequestPayload,
  type MethodNames,
  type RegisterWorkerOptions,
} from './types.ts';

const globalScope = globalThis as unknown as DedicatedWorkerGlobalScope;

const handleRequest = async (
  request: string,
  method: MethodNames,
  options: RequestOptions,
  context: MessageContext,
  client: Client,
): Promise<void> => {
  const requestResult = await client.request(request, options, context);

  if (!isAsyncIterable(requestResult)) {
    const { _cacheMetadata, ...otherProps } = requestResult as PartialRequestResult;
    const result: PartialDehydratedRequestResult = serializeErrors({ ...otherProps });

    if (_cacheMetadata) {
      result._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
    }

    globalScope.postMessage({ context, method, result, type: GRAPHQL_BOX });
    return;
  }

  void forAwaitEach(requestResult, ({ _cacheMetadata, ...otherProps }: PartialRequestResult) => {
    const result: PartialDehydratedRequestResult = serializeErrors({ ...otherProps });

    if (_cacheMetadata) {
      result._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
    }

    globalScope.postMessage({ context, method, result, type: GRAPHQL_BOX });
  });
};

const handleSubscription = async (
  request: string,
  method: MethodNames,
  options: RequestOptions,
  context: MessageContext,
  client: Client,
): Promise<void> => {
  const subscribeResult = await client.subscribe(request, options, context);

  if (!isAsyncIterable(subscribeResult)) {
    globalScope.postMessage({
      context,
      method,
      result: serializeErrors(subscribeResult as PartialRequestResult),
      type: GRAPHQL_BOX,
    });

    return;
  }

  void forAwaitEach(subscribeResult, ({ _cacheMetadata, ...otherProps }: PartialRequestResult) => {
    const result: PartialDehydratedRequestResult = serializeErrors({ ...otherProps });

    if (_cacheMetadata) {
      result._cacheMetadata = dehydrateCacheMetadata(_cacheMetadata);
    }

    globalScope.postMessage({ context, method, result, type: GRAPHQL_BOX });
  });
};

export const handleMessage = (data: MessageRequestPayload, client: Client): void => {
  const { context, method, options, request } = data;

  if (method === REQUEST) {
    void handleRequest(request, method, options, context, client);
  } else {
    void handleSubscription(request, method, options, context, client);
  }
};

export const registerWorker = ({ client }: RegisterWorkerOptions): void => {
  const onMessage = ({ data }: MessageEvent<MessageRequestPayload | CachemapMessageRequestPayload>): void => {
    if (isGraphqlBoxMessageRequestPayload(data)) {
      handleMessage(data, client);
    } else {
      void handleCachemapMessage(data, client.cache);
    }
  };

  globalScope.addEventListener(MESSAGE, onMessage);
};
