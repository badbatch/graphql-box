import { type Client } from '@graphql-box/client';
import { type PartialRequestContext, type PartialRequestResult, type RequestOptions } from '@graphql-box/core';
import { type WorkerClient } from '@graphql-box/worker-client';
import { createContext } from 'react';

export type ServerActions = {
  request: (
    request: string,
    options?: RequestOptions,
    context?: PartialRequestContext,
  ) => Promise<PartialRequestResult>;
};

export type GraphQLBoxContext = {
  graphqlBoxClient: Client | WorkerClient;
  serverActions?: ServerActions;
};

const defaultValue = {};
// Client gets added to context in provider
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const Context = createContext<GraphQLBoxContext>(defaultValue as GraphQLBoxContext);
