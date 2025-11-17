import {
  type PostMessage as CachemapMessageRequestPayload,
  handleMessage as handleCachemapMessage,
} from '@cachemap/core-worker';
import { type Client } from '@graphql-box/client';
import { type OperationOptions, type SerialisedResponseData } from '@graphql-box/core';
import { serializeErrors } from '@graphql-box/helpers';
import { GRAPHQL_BOX, MESSAGE } from './constants.ts';
import { isGraphqlBoxMessageRequestPayload } from './helpers/isGraphqlBoxMessageRequestPayload.ts';
import { type MessageContext, type MessageRequestPayload, type RegisterWorkerOptions } from './types.ts';

const handleQuery = async (
  operation: string,
  options: OperationOptions,
  context: MessageContext,
  client: Client,
): Promise<void> => {
  const requestResult = await client.query(operation, options, context);
  const result: SerialisedResponseData = serializeErrors(requestResult);
  globalThis.postMessage({ context, result, type: GRAPHQL_BOX });
};

export const handleMessage = (data: MessageRequestPayload, client: Client): void => {
  const { context, operation, options } = data;
  void handleQuery(operation, options, context, client);
};

export const registerWorker = ({ client }: RegisterWorkerOptions): void => {
  const onMessage = ({ data }: MessageEvent<MessageRequestPayload | CachemapMessageRequestPayload>): void => {
    if (isGraphqlBoxMessageRequestPayload(data)) {
      handleMessage(data, client);
    } else if (client.cacheManager.cache) {
      void handleCachemapMessage(data, client.cacheManager.cache);
    }
  };

  globalThis.addEventListener(MESSAGE, onMessage);
};
