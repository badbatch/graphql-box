import { type Client } from '@graphql-box/client';
import { type PartialRequestContext, type PartialRequestResult, type RequestOptions } from '@graphql-box/core';
import { type WorkerClient } from '@graphql-box/worker-client';
import { type ReactNode } from 'react';
import { Context } from './Context.ts';

export type GraphqlBoxProviderProps = {
  children: ReactNode;
  graphqlBoxClient: Client | WorkerClient;
  serverActions?: {
    request: (
      request: string,
      options?: RequestOptions,
      context?: PartialRequestContext,
    ) => Promise<PartialRequestResult>;
  };
};

export const GraphqlBoxProvider = ({ children, graphqlBoxClient, serverActions }: GraphqlBoxProviderProps) => (
  <Context.Provider value={{ graphqlBoxClient, serverActions }}>{children}</Context.Provider>
);
