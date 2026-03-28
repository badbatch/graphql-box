import { handleMessage as handleCachemapMessage, isCachemapPostMessageRequest } from '@cachemap/core-worker';
import { type Client } from '@graphql-box/client';
import { type OperationOptions, type ResponseData, type SerialisedResponseData } from '@graphql-box/core';
import { InternalError, QueryError, serializeErrors } from '@graphql-box/helpers';
import { GRAPHQL_BOX, MESSAGE } from './constants.ts';
import { isGraphqlBoxMessageRequestPayload } from './helpers/isGraphqlBoxMessageRequestPayload.ts';
import { type MessageContext, type MessageRequestPayload, type RegisterWorkerOptions } from './types.ts';

const handleQuery = async (
  operation: string,
  options: OperationOptions,
  context: MessageContext,
  client: Client,
): Promise<void> => {
  let requestResult: ResponseData | undefined;

  try {
    requestResult = await client.query(operation, options, context);
  } catch (error) {
    requestResult =
      error instanceof QueryError
        ? error
        : {
            errors: [new InternalError('Oops, something went wrong.', { cause: error })],
            extensions: { cacheMetadata: {} },
          };
  }

  const { data, errors, extensions } = requestResult;
  const result: SerialisedResponseData = serializeErrors({ data, errors, extensions });
  globalThis.postMessage({ context, result, type: GRAPHQL_BOX });
};

export const handleMessage = (data: MessageRequestPayload, client: Client): void => {
  const { context, operation, options } = data;
  void handleQuery(operation, options, context, client);
};

export const registerWorker = ({ client }: RegisterWorkerOptions): void => {
  const onMessage = ({ data }: MessageEvent<unknown>): void => {
    if (isGraphqlBoxMessageRequestPayload(data)) {
      handleMessage(data, client);
    } else if (client.cache && isCachemapPostMessageRequest(data)) {
      void handleCachemapMessage(data, client.cache);
    }
  };

  globalThis.addEventListener(MESSAGE, onMessage);
};
