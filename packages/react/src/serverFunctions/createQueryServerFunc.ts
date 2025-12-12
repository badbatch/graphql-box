import { type Client } from '@graphql-box/client';
import {
  type OperationOptions,
  type PartialOperationContext,
  type PlainObject,
  type ResponseData,
} from '@graphql-box/core';

export const createQueryServerFunc =
  (client: Client) =>
  async <Data extends PlainObject>(
    operation: string,
    options: OperationOptions = {},
    context: PartialOperationContext = {},
  ): Promise<ResponseData<Data> & { operationId: string }> => {
    return client.query<Data>(operation, options, context);
  };
